import { db } from '@/db/database';
import type { Order, OrderStatus } from '@/types';

// Generate next MV-XXX order ID using counter stored in settings
async function generateOrderId(): Promise<string> {
  const counterSetting = await db.settings.get('order.counter');
  const current = counterSetting ? parseInt(counterSetting.value, 10) : 499;
  const next = current + 1;
  await db.settings.put({ key: 'order.counter', value: String(next) });
  return `MV-${next}`;
}

export const orderService = {
  create: async (params: any): Promise<Order> => {
    const orderId = await generateOrderId();

    // Build order items from cart items
    const items = params.items.map((i: any) => ({
      productId: i.product?.id ?? i.productId,
      productName: i.product?.name ?? i.productName,
      variantId: i.variant?.id ?? i.variantId,
      quantity: i.quantity,
      pillCount: i.variant?.quantity ?? i.pillCount ?? 0,
      price: (i.variant?.price ?? i.price ?? 0) * i.quantity,
      image: i.product?.image ?? i.image ?? '',
    }));

    const subtotal = params.subtotal;
    const shipping = 0; // Free shipping on all orders
    const discount = params.discount || 0;
    const total = subtotal - discount + shipping;

    const order: Order = {
      id: orderId,
      userId: (params.userId && params.userId !== 'guest') ? params.userId : 'guest',
      items,
      status: 'pending' as OrderStatus,
      subtotal,
      shipping,
      discount,
      total,
      shippingAddress: {
        firstName: params.address.firstName || '',
        lastName:  params.address.lastName  || '',
        email:     params.address.email     || '',
        phone:     params.address.phone     || '',
        street:    params.address.street    || params.address.address1 || '',
        apt:       params.address.apt       || '',
        city:      params.address.city      || '',
        state:     params.address.state     || '',
        zip:       params.address.zip       || params.address.postalCode || '',
        country:   params.address.country   || '',
      },
      paymentMethod: params.paymentMethod,
      estimatedDelivery: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.orders.add(order);

    // Log initial status
    await db.orderStatusLogs.add({
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      orderId: order.id,
      fromStatus: null,
      toStatus: 'pending',
      changedAt: new Date(),
      note: 'Order placed',
    });

    return order;
  },

  getByUser: async (userId?: string): Promise<Order[]> => {
    if (!userId || userId === 'guest') return [];
    const all = await db.orders.toArray();
    return all
      .filter(o => o.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getById: async (id: string): Promise<Order | undefined> => {
    return db.orders.get(id);
  },
};
