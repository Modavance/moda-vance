import { Injectable, NotFoundException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ValidateCouponDto } from './dto/validate-coupon.dto';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponsService {
  private readonly logger = new Logger(CouponsService.name);
  constructor(private readonly prisma: PrismaService) {}

  async validate(dto: ValidateCouponDto) {
    const coupon = await this.prisma.coupon.findUnique({ where: { code: dto.code.toUpperCase() } });
    if (!coupon) throw new BadRequestException('Invalid coupon code');
    if (new Date(coupon.expiresAt) < new Date()) throw new BadRequestException('Coupon has expired');
    if (dto.subtotal < coupon.minOrder) throw new BadRequestException(`Minimum order for this coupon is $${coupon.minOrder}`);
    const discountAmount = coupon.type === 'PERCENT' ? (dto.subtotal * coupon.discount) / 100 : coupon.discount;
    return { valid: true, code: coupon.code, type: coupon.type, discount: coupon.discount, discountAmount };
  }

  async findAll() { return this.prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } }); }

  async create(dto: CreateCouponDto) {
    const existing = await this.prisma.coupon.findUnique({ where: { code: dto.code } });
    if (existing) throw new ConflictException('Coupon code already exists');
    return this.prisma.coupon.create({ data: { ...dto, expiresAt: new Date(dto.expiresAt) } });
  }

  async update(code: string, dto: UpdateCouponDto) {
    await this.findByCode(code);
    return this.prisma.coupon.update({ where: { code }, data: { ...dto, ...(dto.expiresAt && { expiresAt: new Date(dto.expiresAt) }) } });
  }

  async delete(code: string) {
    await this.findByCode(code);
    await this.prisma.coupon.delete({ where: { code } });
  }

  private async findByCode(code: string) {
    const coupon = await this.prisma.coupon.findUnique({ where: { code } });
    if (!coupon) throw new NotFoundException(`Coupon not found: ${code}`);
    return coupon;
  }
}
