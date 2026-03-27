import { api } from './api';

export const orderService = {
  create: async (params: any) => {
    return api('/orders', {
      method: 'POST',
      body: JSON.stringify({
        userId: params.userId || null,
        items: params.items.map((i: any) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
        })),
        shippingAddress: {
          firstName: params.address.firstName || '',
          lastName: params.address.lastName || '',
          email: params.address.email || '',
          phone: params.address.phone || '',
          street: params.address.street || params.address.address1 || '',
          apt: params.address.apt || '',
          city: params.address.city || '',
          state: params.address.state || '',
          zip: params.address.zip || params.address.postalCode || '',
          country: params.address.country || '',
        },
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
