import { Injectable, NotFoundException, BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ValidateCouponDto } from './dto/validate-coupon.dto';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponsService {
  private readonly logger = new Logger(CouponsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async validate(dto: ValidateCouponDto) {
    const coupon = await this.prisma.coupon.findUnique({ where: { code: dto.code } });
    if (!coupon) throw new NotFoundException('Coupon not found');
    if (new Date(coupon.expiresAt) < new Date()) throw new BadRequestException('Coupon has expired');
    if (dto.subtotal < coupon.minOrder) {
      throw new BadRequestException(`Minimum order amount is $${coupon.minOrder}`);
    }

    const discount = coupon.type === 'PERCENT'
      ? dto.subtotal * (coupon.discount / 100)
      : coupon.discount;

    return { coupon, discount };
  }

  async findAll() {
    return this.prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async create(dto: CreateCouponDto) {
    const existing = await this.prisma.coupon.findUnique({ where: { code: dto.code } });
    if (existing) throw new ConflictException('Coupon code already exists');

    return this.prisma.coupon.create({
      data: { ...dto, expiresAt: new Date(dto.expiresAt) },
    });
  }

  async update(code: string, dto: UpdateCouponDto) {
    const existing = await this.prisma.coupon.findUnique({ where: { code } });
    if (!existing) throw new NotFoundException('Coupon not found');

    return this.prisma.coupon.update({
      where: { code },
      data: { ...dto, ...(dto.expiresAt && { expiresAt: new Date(dto.expiresAt) }) },
    });
  }

  async remove(code: string) {
    const existing = await this.prisma.coupon.findUnique({ where: { code } });
    if (!existing) throw new NotFoundException('Coupon not found');
    await this.prisma.coupon.delete({ where: { code } });
  }
}
