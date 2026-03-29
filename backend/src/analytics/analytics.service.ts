import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const [totalOrders, totalUsers, totalProducts, revenueAgg] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.user.count(),
      this.prisma.product.count(),
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: 'CANCELLED' } },
      }),
    ]);

    return {
      totalOrders,
      totalUsers,
      totalProducts,
      totalRevenue: revenueAgg._sum.total ?? 0,
    };
  }

  async getOrdersByDay(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const orders = await this.prisma.order.findMany({
      where: { createdAt: { gte: since }, status: { not: 'CANCELLED' } },
      select: { createdAt: true, total: true },
      orderBy: { createdAt: 'asc' },
    });

    const byDay = orders.reduce<Record<string, { orders: number; revenue: number }>>(
      (acc, order) => {
        const key = order.createdAt.toISOString().slice(0, 10);
        if (!acc[key]) acc[key] = { orders: 0, revenue: 0 };
        acc[key].orders++;
        acc[key].revenue += order.total;
        return acc;
      },
      {},
    );

    return Object.entries(byDay).map(([date, stats]) => ({ date, ...stats }));
  }
}
