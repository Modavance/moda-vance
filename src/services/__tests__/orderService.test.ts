import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '@/db/database';
import { orderService } from '@/services/orderService';
import type { CartItem, Address } from '@/types';

const address: Address = {
  firstName: 'John', lastName: 'Doe', email: 'john@example.com',
  phone: '555-0000', street: '1 Main St', city: 'New York',
  state: 'New York', zip: '10001', country: 'United States',
};

const cartItem: CartItem = {
  id: 'ci1',
  productId: 'p1',
  variantId: 'v1',
  quantity: 1,
  product: {
    id: 'p1', name: 'Modalert 200mg', slug: 'modalert-200',
    brand: 'Sun Pharma', category: 'modafinil', strength: '200mg',
    pillsPerStrip: 10, description: '', shortDescription: '',
    image: 'https://example.com/img.jpg', images: [],
    variants: [], effects: [], ingredients: '', manufacturer: 'Sun Pharma',
    rating: 4.5, reviewCount: 100, inStock: true, featured: true, createdAt: new Date(),
  },
  variant: { id: 'v1', quantity: 100, price: 139 },
};

beforeEach(async () => {
  await db.orders.clear();
});

describe('orderService.create', () => {
  it('creates an order and persists it in DB', async () => {
    const order = await orderService.create({
      userId: 'u1',
      items: [cartItem],
      address,
      paymentMethod: 'bitcoin',
      subtotal: 139,
      discount: 0,
    });

    expect(order.id).toMatch(/^ORD-/);
    expect(order.userId).toBe('u1');
    expect(order.status).toBe('confirmed');
    // subtotal 139 < 150 → shipping 9.99 → total = 148.99
    expect(order.total).toBe(148.99);
    expect(order.items).toHaveLength(1);
    expect(order.items[0].productName).toBe('Modalert 200mg');
    expect(order.items[0].pillCount).toBe(100);

    const inDb = await db.orders.get(order.id);
    expect(inDb).toBeDefined();
    expect(inDb?.id).toBe(order.id);
  });

  it('sets shipping to 0 when subtotal >= 150', async () => {
    const order = await orderService.create({
      userId: 'u1', items: [cartItem], address,
      paymentMethod: 'bitcoin', subtotal: 150, discount: 0,
    });
    expect(order.shipping).toBe(0);
    expect(order.total).toBe(150);
  });

  it('sets shipping to 9.99 when subtotal < 150', async () => {
    const order = await orderService.create({
      userId: 'u1', items: [cartItem], address,
      paymentMethod: 'zelle', subtotal: 100, discount: 0,
    });
    expect(order.shipping).toBe(9.99);
    expect(order.total).toBe(109.99);
  });

  it('applies discount correctly', async () => {
    const order = await orderService.create({
      userId: 'u1', items: [cartItem], address,
      paymentMethod: 'bitcoin', subtotal: 200, discount: 20,
    });
    expect(order.discount).toBe(20);
    // 200 - 20 + 0 (free shipping) = 180
    expect(order.total).toBe(180);
  });

  it('generates a unique ID for each order', async () => {
    const o1 = await orderService.create({
      userId: 'u1', items: [cartItem], address,
      paymentMethod: 'bitcoin', subtotal: 200, discount: 0,
    });
    const o2 = await orderService.create({
      userId: 'u1', items: [cartItem], address,
      paymentMethod: 'bitcoin', subtotal: 200, discount: 0,
    });
    expect(o1.id).not.toBe(o2.id);
  });
});

describe('orderService.getByUser', () => {
  it('returns only orders for the specified user', async () => {
    const o1 = await orderService.create({
      userId: 'user-A', items: [cartItem], address,
      paymentMethod: 'bitcoin', subtotal: 200, discount: 0,
    });
    await orderService.create({
      userId: 'user-B', items: [cartItem], address,
      paymentMethod: 'bitcoin', subtotal: 200, discount: 0,
    });

    const result = await orderService.getByUser('user-A');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(o1.id);
  });

  it('returns orders sorted newest first', async () => {
    await db.orders.bulkAdd([
      {
        id: 'old', userId: 'u1', status: 'confirmed', items: [], subtotal: 100,
        shipping: 0, discount: 0, total: 100, shippingAddress: address,
        paymentMethod: 'bitcoin', createdAt: new Date('2024-01-01'), updatedAt: new Date(),
      },
      {
        id: 'newest', userId: 'u1', status: 'confirmed', items: [], subtotal: 100,
        shipping: 0, discount: 0, total: 100, shippingAddress: address,
        paymentMethod: 'bitcoin', createdAt: new Date('2024-03-01'), updatedAt: new Date(),
      },
      {
        id: 'middle', userId: 'u1', status: 'confirmed', items: [], subtotal: 100,
        shipping: 0, discount: 0, total: 100, shippingAddress: address,
        paymentMethod: 'bitcoin', createdAt: new Date('2024-02-01'), updatedAt: new Date(),
      },
    ]);

    const result = await orderService.getByUser('u1');
    expect(result[0].id).toBe('newest');
    expect(result[1].id).toBe('middle');
    expect(result[2].id).toBe('old');
  });

  it('returns empty array when user has no orders', async () => {
    const result = await orderService.getByUser('no-such-user');
    expect(result).toHaveLength(0);
  });
});

describe('orderService.getById', () => {
  it('returns the correct order', async () => {
    const order = await orderService.create({
      userId: 'u1', items: [cartItem], address,
      paymentMethod: 'bitcoin', subtotal: 200, discount: 0,
    });

    const found = await orderService.getById(order.id);
    expect(found?.id).toBe(order.id);
  });

  it('returns undefined for unknown ID', async () => {
    const found = await orderService.getById('does-not-exist');
    expect(found).toBeUndefined();
  });
});
