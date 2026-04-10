import { api, unwrap } from './api';
import { normalizeOrder } from '@/utils/normalizers';
import type { Order } from '@/types';

interface CreateOrderParams {
  items: Array<{
    product?: { id: string; name: string; image?: string };
    productId?: string;
    productName?: string;
    variant?: { id: string; quantity: number; price: number };
    variantId?: string;
    pillCount?: number;
    price?: number;
    quantity: number;
    image?: string;
  }>;
  subtotal: number;
  shipping?: number;
  discount?: number;
  address: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    street?: string;
    address1?: string;
    apt?: string;
    city: string;
    state?: string;
    zip?: string;
    postalCode?: string;
    country: string;
  };
  paymentMethod: string;
  couponCode?: string;
  paymentFee?: number;
  shippingCenter?: string;
}

export const orderService = {
  create: async (params: CreateOrderParams): Promise<Order> => {
    const body = {
      items: params.items.map((i) => ({
        productId: i.product?.id ?? i.productId,
        productName: i.product?.name ?? i.productName,
        variantId: i.variant?.id ?? i.variantId,
        quantity: i.quantity,
        pillCount: i.variant?.quantity ?? i.pillCount ?? 0,
        price: (i.variant?.price ?? i.price ?? 0) * i.quantity,
        image: i.product?.image ?? i.image ?? '',
      })),
      subtotal: params.subtotal,
      shipping: params.shipping ?? 0,
      discount: params.discount ?? 0,
      shippingAddress: {
        firstName: params.address.firstName,
        lastName: params.address.lastName,
        email: params.address.email,
        phone: params.address.phone ?? '',
        street: params.address.street ?? params.address.address1 ?? '',
        apt: params.address.apt ?? '',
        city: params.address.city,
        state: params.address.state ?? '',
        zip: params.address.zip ?? params.address.postalCode ?? '',
        country: params.address.country,
      },
      paymentMethod: params.paymentMethod,
      couponCode: params.couponCode,
      paymentFee: params.paymentFee,
      shippingCenter: params.shippingCenter,
    };

    const res = await api.post('/orders', body);
    return normalizeOrder(unwrap<Order>(res));
  },

  getByUser: async (): Promise<Order[]> => {
    const res = await api.get('/orders/mine');
    return unwrap<Order[]>(res).map(normalizeOrder);
  },

  getById: async (id: string): Promise<Order | undefined> => {
    try {
      const res = await api.get(`/orders/${id}`);
      return normalizeOrder(unwrap<Order>(res));
    } catch {
      return undefined;
    }
  },
};
