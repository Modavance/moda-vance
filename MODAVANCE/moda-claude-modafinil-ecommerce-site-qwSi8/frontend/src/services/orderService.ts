import { db } from '@/db/database';
import type { Order, CartItem, Address, PaymentMethod } from '@/types';

export const orderService = {
  create: async (params: {
    userId: string;
    items: CartItem[];
    address: Address;
    paymentMethod: PaymentMethod;
    subtotal: number;
    discount: number;
  }): Promise<Order> => {
    const shipping = params.subtotal >= 150 ? 0 : 9.99;
    const total = params.subtotal - params.discount + shipping;

    const order: Order = {
      id: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      userId: params.userId,
      items: params.items.map((i) => ({
        productId: i.productId,
        productName: i.product.name,
        variantId: i.variantId,
        quantity: i.quantity,
        pillCount: i.variant.quantity * i.quantity,
        price: i.variant.price * i.quantity,
        image: i.product.image,
      })),
      status: 'confirmed',
      subtotal: params.subtotal,
      shipping,
      discount: params.discount,
      total,
      shippingAddress: params.address,
      paymentMethod: params.paymentMethod,
      trackingNumber: undefined,
      estimatedDelivery: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.orders.add(order);
    return order;
  },

  getByUser: (userId: string) =>
    db.orders.where('userId').equals(userId).sortBy('createdAt').then(orders => orders.reverse()),

  getById: (id: string) => db.orders.get(id),
};
