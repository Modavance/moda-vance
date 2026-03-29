import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Prisma, OrderStatus, PaymentMethod } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderFilterDto } from './dto/order-filter.dto';
import { PaginatedResult } from '../common/dto/paginated-response.dto';

const PAYMENT_DISCOUNTS: Partial<Record<PaymentMethod, number>> = {
  [PaymentMethod.BITCOIN]: 0.15,
  [PaymentMethod.ETHEREUM]: 0.10,
  [PaymentMethod.ZELLE]: 0.10,
};

function generateOrderId(): string {
  return `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto, userId?: string) {
    const order = await this.prisma.$transaction(async (tx) => {
      const variantIds = dto.items.map((i) => i.variantId);
      const variants = await tx.productVariant.findMany({
        where: { id: { in: variantIds } },
        include: { product: true },
      });

      if (variants.length !== dto.items.length) {
        throw new BadRequestException('One or more products are invalid');
      }

      const subtotal = dto.items.reduce((sum, item) => {
        const variant = variants.find((v) => v.id === item.variantId)!;
        return sum + variant.price * item.quantity;
      }, 0);

      const shipping = subtotal >= 150 ? 0 : 9.99;

      let couponDiscount = 0;
      if (dto.couponCode) {
        const coupon = await tx.coupon.findUnique({ where: { code: dto.couponCode } });
        if (coupon && new Date(coupon.expiresAt) > new Date() && subtotal >= coupon.minOrder) {
          couponDiscount = coupon.type === 'PERCENT'
            ? subtotal * (coupon.discount / 100)
            : coupon.discount;
        }
      }

      const paymentDiscountRate = PAYMENT_DISCOUNTS[dto.paymentMethod] ?? 0;
      const paymentDiscount = subtotal * paymentDiscountRate;
      const discount = couponDiscount + paymentDiscount;
      const total = subtotal - discount + shipping;

      const created = await tx.order.create({
        data: {
          id: generateOrderId(),
          userId: userId ?? null,
          paymentMethod: dto.paymentMethod,
          shippingAddress: dto.shippingAddress as unknown as Prisma.InputJsonValue,
          couponCode: dto.couponCode ?? null,
          subtotal,
          shipping,
          discount,
          total,
          items: {
            create: dto.items.map((item) => {
              const variant = variants.find((v) => v.id === item.variantId)!;
              return {
                productId: variant.productId,
                variantId: item.variantId,
                productName: variant.product.name,
                quantity: item.quantity,
                pillCount: variant.quantity * item.quantity,
                price: variant.price,
                image: variant.product.image,
              };
            }),
          },
        },
        include: { items: true },
      });

      await tx.orderStatusLog.create({
        data: { orderId: created.id, fromStatus: null, toStatus: OrderStatus.CONFIRMED },
      });

      return created;
    });

    this.logger.log(`Order created: ${order.id}`);
    return order;
  }

  async findAll(query: OrderFilterDto): Promise<PaginatedResult<unknown>> {
    const { page = 1, limit = 20, status, userId } = query;
    const where: Prisma.OrderWhereInput = {
      ...(status && { status }),
      ...(userId && { userId }),
    };

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { items: true, statusLogs: { orderBy: { changedAt: 'asc' } } },
      }),
      this.prisma.order.count({ where }),
    ]);

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findByUser(userId: string): Promise<unknown[]> {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });
  }

  async findById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        statusLogs: { orderBy: { changedAt: 'asc' } },
      },
    });
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.findById(id);

    await this.prisma.$transaction([
      this.prisma.order.update({
        where: { id },
        data: {
          status: dto.status,
          ...(dto.trackingNumber && { trackingNumber: dto.trackingNumber }),
        },
      }),
      this.prisma.orderStatusLog.create({
        data: {
          orderId: id,
          fromStatus: order.status,
          toStatus: dto.status,
          note: dto.note ?? null,
        },
      }),
    ]);

    this.logger.log(`Order ${id} status: ${order.status} → ${dto.status}`);
    return this.findById(id);
  }
}
