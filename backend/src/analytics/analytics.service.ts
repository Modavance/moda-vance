import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);
  constructor(private readonly prisma: PrismaService) {}

  async getOverview() {
    const [orders, customers] = await Promise.all([
      this.prisma.order.aggregate({ _sum: { total: true }, _count: { id: true } }),
      this.prisma.user.count(),
    ]);
    const totalRevenue = orders._sum.total ?? 0;
    const totalOrders = orders._count.id;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    return { totalRevenue, totalOrders, totalCustomers: customers, avgOrderValue };
  }

  async getMonthly() {
    const since = new Date();
    since.setMonth(since.getMonth() - 11);
    since.setDate(1);
    const orders = await this.prisma.order.findMany({
      where: { createdAt: { gte: since } },
      select: { total: true, createdAt: true },
    });
    const map = new Map<string, { revenue: number; orders: number }>();
    for (const o of orders) {
      const key = o.createdAt.toISOString().slice(0, 7);
      const entry = map.get(key) ?? { revenue: 0, orders: 0 };
      entry.revenue += o.total;
      entry.orders += 1;
      map.set(key, entry);
    }
    return Array.from(map.entries()).map(([month, v]) => ({ month, ...v })).sort((a, b) => a.month.localeCompare(b.month));
  }

  async getPaymentBreakdown() {
    const orders = await this.prisma.order.groupBy({ by: ['paymentMethod'], _count: { id: true }, _sum: { total: true } });
    return orders.map((o) => ({ method: o.paymentMethod, count: o._count.id, revenue: o._sum.total ?? 0 }));
  }

  async getTopProducts() {
    const items = await this.prisma.orderItem.groupBy({ by: ['productId', 'productName'], _sum: { quantity: true, price: true }, orderBy: { _sum: { quantity: 'desc' } }, take: 10 });
    return items.map((i) => ({ productId: i.productId, name: i.productName, totalQuantity: i._sum.quantity ?? 0, totalRevenue: i._sum.price ?? 0 }));
  }
}
