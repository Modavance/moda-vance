import { api } from './api';
import type { CartItem, Address, PaymentMethod } from '@/types';

export const orderService = {
  create: async (params: {
    userId?: string;
    items: CartItem[];
    address: Address;
    paymentMethod: PaymentMethod;
    subtotal: number;
    discount: number;
    couponCode?: string;
  }) => {
    return api('/orders', {
      method: 'POST',
      body: JSON.stringify({
        userId: params.userId || null,
        items: params.items.map(i => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
        })),
        shippingAddress: params.address,
        paymentMethod: String(params.paymentMethod).toUpperCase(),
        subtotal: params.subtotal,
        discount: params.discount || 0,
        couponCode: params.couponCode || null,
      }),
    });
  },
  getByUser: () => api('/orders/my/orders'),
  getById: (id: string) => api(`/orders/${id}`),
};
