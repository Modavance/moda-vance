import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '@/db/database';
import { productService } from '@/services/productService';
import type { Product } from '@/types';

// Minimal product factory
function makeProduct(overrides: Partial<Product> & { id: string; slug: string }): Product {
  return {
    name: 'Test Product',
    brand: 'Sun Pharma',
    category: 'modafinil',
    strength: '200mg',
    pillsPerStrip: 10,
    description: 'Test description',
    shortDescription: 'Short desc',
    image: 'https://example.com/img.jpg',
    images: ['https://example.com/img.jpg'],
    variants: [{ id: 'v1', quantity: 100, price: 99 }],
    effects: [],
    ingredients: '',
    manufacturer: 'Sun Pharma',
    rating: 4.5,
    reviewCount: 100,
    inStock: true,
    featured: false,
    createdAt: new Date('2024-01-01'),
    ...overrides,
  };
}

beforeEach(async () => {
  await db.products.clear();
});

describe('productService.getFeatured', () => {
  it('returns only products with featured === true', async () => {
    await db.products.bulkAdd([
      makeProduct({ id: 'p1', slug: 'p1', featured: true,  name: 'Featured A' }),
      makeProduct({ id: 'p2', slug: 'p2', featured: false, name: 'Not Featured' }),
      makeProduct({ id: 'p3', slug: 'p3', featured: true,  name: 'Featured B' }),
    ]);

    const result = await productService.getFeatured();

    expect(result).toHaveLength(2);
    expect(result.map(p => p.name)).toEqual(expect.arrayContaining(['Featured A', 'Featured B']));
    expect(result.map(p => p.name)).not.toContain('Not Featured');
  });

  it('returns empty array when no products are featured', async () => {
    await db.products.bulkAdd([
      makeProduct({ id: 'p1', slug: 'p1', featured: false }),
      makeProduct({ id: 'p2', slug: 'p2', featured: false }),
    ]);

    const result = await productService.getFeatured();
    expect(result).toHaveLength(0);
  });

  it('returns empty array when DB is empty', async () => {
    const result = await productService.getFeatured();
    expect(result).toHaveLength(0);
  });
});

describe('productService.getBySlug', () => {
  it('returns the correct product by slug', async () => {
    await db.products.bulkAdd([
      makeProduct({ id: 'p1', slug: 'modalert-200', name: 'Modalert 200mg' }),
      makeProduct({ id: 'p2', slug: 'waklert-150',  name: 'Waklert 150mg' }),
    ]);

    const result = await productService.getBySlug('modalert-200');
    expect(result?.name).toBe('Modalert 200mg');
  });

  it('returns undefined for unknown slug', async () => {
    await db.products.add(makeProduct({ id: 'p1', slug: 'real-product' }));
    const result = await productService.getBySlug('does-not-exist');
    expect(result).toBeUndefined();
  });
});

describe('productService.getAll', () => {
  it('returns all products', async () => {
    await db.products.bulkAdd([
      makeProduct({ id: 'p1', slug: 'a' }),
      makeProduct({ id: 'p2', slug: 'b' }),
      makeProduct({ id: 'p3', slug: 'c' }),
    ]);

    const result = await productService.getAll();
    expect(result).toHaveLength(3);
  });
});

describe('productService.getByCategory', () => {
  it('returns only products in the requested category', async () => {
    await db.products.bulkAdd([
      makeProduct({ id: 'p1', slug: 'a', category: 'modafinil' }),
      makeProduct({ id: 'p2', slug: 'b', category: 'armodafinil' }),
      makeProduct({ id: 'p3', slug: 'c', category: 'modafinil' }),
    ]);

    const result = await productService.getByCategory('modafinil');
    expect(result).toHaveLength(2);
    result.forEach(p => expect(p.category).toBe('modafinil'));
  });
});

describe('productService.search', () => {
  it('matches by name (case insensitive)', async () => {
    await db.products.bulkAdd([
      makeProduct({ id: 'p1', slug: 'a', name: 'Modalert 200mg' }),
      makeProduct({ id: 'p2', slug: 'b', name: 'Waklert 150mg' }),
    ]);

    const result = await productService.search('modalert');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Modalert 200mg');
  });

  it('matches by brand', async () => {
    await db.products.bulkAdd([
      makeProduct({ id: 'p1', slug: 'a', brand: 'Sun Pharma' }),
      makeProduct({ id: 'p2', slug: 'b', brand: 'HAB Pharma' }),
    ]);

    const result = await productService.search('sun');
    expect(result).toHaveLength(1);
    expect(result[0].brand).toBe('Sun Pharma');
  });

  it('returns empty array when no match', async () => {
    await db.products.add(makeProduct({ id: 'p1', slug: 'a', name: 'Modalert' }));
    const result = await productService.search('xyz-no-match');
    expect(result).toHaveLength(0);
  });
});
