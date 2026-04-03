import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

function getTier(totalSpent: number): 'BRONZE' | 'SILVER' | 'GOLD' {
  if (totalSpent >= 3000) return 'GOLD';
  if (totalSpent >= 1000) return 'SILVER';
  return 'BRONZE';
}

function getRedeemValue(tier: string): number {
  if (tier === 'GOLD') return 10;
  if (tier === 'SILVER') return 7;
  return 5;
}

@Injectable()
export class LoyaltyService {
  constructor(private readonly prisma: PrismaService) {}

  private async checkAndExpirePoints(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { loyaltyPoints: true, pointsExpiresAt: true } });
    if (user.pointsExpiresAt && new Date() > user.pointsExpiresAt && user.loyaltyPoints > 0) {
      await this.prisma.user.update({ where: { id: userId }, data: { loyaltyPoints: 0, pointsExpiresAt: null } });
      return 0;
    }
    return user.loyaltyPoints;
  }

  async getInfo(userId: string) {
    const loyaltyPoints = await this.checkAndExpirePoints(userId);
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { pointsExpiresAt: true } });
    const orders = await this.prisma.order.findMany({
      where: { userId, status: { not: OrderStatus.CANCELLED } },
      select: { total: true },
    });
    const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
    const tier = getTier(totalSpent);
    const redeemValue = getRedeemValue(tier);
    return { loyaltyPoints, tier, totalSpent, redeemValue, pointsExpiresAt: user.pointsExpiresAt };
  }

  async redeem(userId: string) {
    const currentPoints = await this.checkAndExpirePoints(userId);
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { loyaltyPoints: true, email: true } });
    if (currentPoints < 200) throw new BadRequestException('You need at least 200 points to redeem a discount');

    const orders = await this.prisma.order.findMany({
      where: { userId, status: { not: OrderStatus.CANCELLED } },
      select: { total: true },
    });
    const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
    const tier = getTier(totalSpent);
    const discount = getRedeemValue(tier);

    const code = `REWARD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await this.prisma.$transaction([
      this.prisma.coupon.create({ data: { code, discount, type: 'FIXED', minOrder: 0, expiresAt, maxUsage: 1 } }),
      this.prisma.user.update({ where: { id: userId }, data: { loyaltyPoints: { decrement: 200 } } }),
    ]);

    return { code, discount, expiresAt };
  }
}
