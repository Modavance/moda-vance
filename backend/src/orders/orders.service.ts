import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderFilterDto } from './dto/order-filter.dto';
import { OrderStatus, Prisma } from '@prisma/client';

const PAYMENT_DISCOUNTS: Record<string, number> = {
  BITCOIN: 0.15,
  ETHEREUM: 0.15,
  CARD: 0,
  PAYPAL: 0,
};

// Admin can change to any status except going back to the same one
const LOCKED_STATUSES: OrderStatus[] = []; // no locked statuses for admin

async function generateOrderId(tx: Prisma.TransactionClient): Promise<string> {
  const last = await tx.order.findFirst({
    where: { id: { startsWith: 'MV-' } },
    orderBy: { createdAt: 'desc' },
  });
  let next = 500;
  if (last) {
    const m = last.id.match(/^MV-(\d+)$/);
    if (m) next = parseInt(m[1]) + 1;
  }
  return `MV-${next}`;
}

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
  ) {}

  async create(dto: CreateOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      const variants = await tx.productVariant.findMany({
        where: { id: { in: dto.items.map((i) => i.variantId) } },
        include: { product: true },
      });
      if (variants.length !== dto.items.length) {
        throw new BadRequestException('One or more products are invalid');
      }

      const subtotal = dto.items.reduce((sum, item) => {
        const variant = variants.find((v) => v.id === item.variantId)!;
        return sum + variant.price * item.quantity;
      }, 0);

      let couponDiscount = 0;
      if (dto.couponCode) {
        const coupon = await tx.coupon.findUnique({ where: { code: dto.couponCode } });
        if (!coupon) throw new BadRequestException('Invalid coupon code');
        if (new Date(coupon.expiresAt) < new Date()) throw new BadRequestException('Coupon has expired');
        if (subtotal < coupon.minOrder) throw new BadRequestException(`Minimum order for this coupon is $${coupon.minOrder}`);
        couponDiscount = coupon.type === 'PERCENT' ? (subtotal * coupon.discount) / 100 : coupon.discount;
      }

      const paymentDiscount = subtotal * (PAYMENT_DISCOUNTS[dto.paymentMethod] ?? 0);
      const discount = couponDiscount + paymentDiscount;
      const shipping = dto.shipping ?? (subtotal >= 150 ? 0 : 9.99);
      const total = subtotal - discount + shipping;

      const order = await tx.order.create({
        data: {
          id: await generateOrderId(tx),
          userId: dto.userId ?? null,
          paymentMethod: dto.paymentMethod,
          couponCode: dto.couponCode ?? null,
          shippingAddress: dto.shippingAddress as unknown as Prisma.InputJsonValue,
          shippingCenter: dto.shippingCenter ?? null,
          subtotal, shipping, discount, total,
          items: {
            create: dto.items.map((item) => {
              const variant = variants.find((v) => v.id === item.variantId)!;
              return {
                productId: item.productId,
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
        include: { items: true, statusLogs: true },
      });

      await tx.orderStatusLog.create({
        data: { orderId: order.id, fromStatus: null, toStatus: OrderStatus.CONFIRMED },
      });

      this.logger.log(`Order created: ${order.id}`);

      // Send confirmation email
      const addr = dto.shippingAddress as { firstName?: string; email?: string };
      if (addr.email) {
        this.email.sendOrderConfirmation(addr.email, {
          id: order.id,
          firstName: addr.firstName ?? 'Customer',
          items: order.items.map(i => ({ productName: i.productName, quantity: i.quantity, price: i.price })),
          subtotal: order.subtotal,
          discount: order.discount,
          shipping: order.shipping,
          total: order.total,
          paymentMethod: order.paymentMethod,
        }).catch(() => {});
      }

      return order;
    });
  }

  async findMine(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true, statusLogs: { orderBy: { changedAt: 'asc' } } },
    });
    if (!order) throw new NotFoundException(`Order not found: ${id}`);
    return order;
  }

  async findAll(query: OrderFilterDto) {
    const { page = 1, limit = 20, search, status } = query;
    const where: Prisma.OrderWhereInput = {
      ...(status && { status }),
      ...(search && { id: { contains: search } }),
    };
    const [data, total] = await Promise.all([
      this.prisma.order.findMany({ where, skip: (page - 1) * limit, take: limit, include: { items: true }, orderBy: { createdAt: 'desc' } }),
      this.prisma.order.count({ where }),
    ]);
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.findById(id);
    if (order.status === dto.status) {
      throw new BadRequestException(`Order is already ${dto.status}`);
    }
    if (LOCKED_STATUSES.includes(order.status)) {
      throw new BadRequestException(`Cannot change status from ${order.status}`);
    }
    const orderUpdate: Record<string, unknown> = { status: dto.status };
    if (dto.trackingNumber) orderUpdate.trackingNumber = dto.trackingNumber;
    const [updated] = await this.prisma.$transaction([
      this.prisma.order.update({ where: { id }, data: orderUpdate, include: { items: true, statusLogs: true } }),
      this.prisma.orderStatusLog.create({ data: { orderId: id, fromStatus: order.status, toStatus: dto.status, note: dto.note ?? null } }),
    ]);

    // Send status update email (skip for cancelled orders)
    const addr = order.shippingAddress as { firstName?: string; email?: string };
    if (addr.email && dto.status !== OrderStatus.CANCELLED) {
      this.email.sendStatusUpdate(addr.email, addr.firstName ?? 'Customer', id, dto.status, dto.trackingNumber, dto.note).catch(() => {});
    }

    return updated;
  }

  async findLogs(orderId: string) {
    return this.prisma.orderStatusLog.findMany({ where: { orderId }, orderBy: { changedAt: 'asc' } });
  }
}
