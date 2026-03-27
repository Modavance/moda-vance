import { describe, expect, it } from 'vitest';
import type { Product } from '@/types';

// Mirror the sort/filter logic from ShopPage
function sortProducts(products: Product[], sort: string): Product[] {
  return [...products].sort((a, b) => {
    if (sort === 'price-asc') return (a.variants[0]?.price ?? 0) - (b.variants[0]?.price ?? 0);
    if (sort === 'price-desc') return (b.variants[0]?.price ?? 0) - (a.variants[0]?.price ?? 0);
    if (sort === 'rating') return b.rating - a.rating;
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });
}

function filterProducts(
  products: Product[],
  opts: { searchQuery?: string; category?: string; brand?: string }
): Product[] {
  const { searchQuery, category = 'all', brand = 'all' } = opts;
  return products.filter(p => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.includes(q) ||
        p.brand.toLowerCase().includes(q)
      );
    }
    if (category !== 'all' && p.category !== category) return false;
    if (brand !== 'all' && p.brand !== brand) return false;
    return true;
  });
}

function makeProduct(overrides: Partial<Product> & { id: string }): Product {
  return {
    name: 'Product',
    slug: overrides.id,
    brand: 'Sun Pharma',
    category: 'modafinil',
    strength: '200mg',
    pillsPerStrip: 10,
    description: '',
    shortDescription: '',
    image: '',
    images: [],
    variants: [{ id: 'v1', quantity: 100, price: 99 }],
    effects: [],
    ingredients: '',
    manufacturer: 'Sun Pharma',
    rating: 4.0,
    reviewCount: 10,
    inStock: true,
    featured: false,
    createdAt: new Date(),
    ...overrides,
  };
}

describe('ShopPage — sorting', () => {
  const products = [
    makeProduct({ id: 'p1', variants: [{ id: 'v1', quantity: 100, price: 149 }], rating: 4.5 }),
    makeProduct({ id: 'p2', variants: [{ id: 'v1', quantity: 100, price: 49  }], rating: 4.9 }),
    makeProduct({ id: 'p3', variants: [{ id: 'v1', quantity: 100, price: 99  }], rating: 4.2 }),
  ];

  it('sorts price-asc correctly', () => {
    const sorted = sortProducts(products, 'price-asc');
    expect(sorted.map(p => p.id)).toEqual(['p2', 'p3', 'p1']);
  });

  it('sorts price-desc correctly', () => {
    const sorted = sortProducts(products, 'price-desc');
    expect(sorted.map(p => p.id)).toEqual(['p1', 'p3', 'p2']);
  });

  it('sorts by rating descending', () => {
    const sorted = sortProducts(products, 'rating');
    expect(sorted[0].id).toBe('p2'); // rating 4.9
    expect(sorted[2].id).toBe('p3'); // rating 4.2
  });

  it('puts featured products first in default sort', () => {
    const ps = [
      makeProduct({ id: 'a', featured: false }),
      makeProduct({ id: 'b', featured: true }),
      makeProduct({ id: 'c', featured: false }),
    ];
    const sorted = sortProducts(ps, 'featured');
    expect(sorted[0].id).toBe('b');
  });

  it('does NOT crash when a product has no variants (bug fix)', () => {
    const noVariants = [
      makeProduct({ id: 'empty', variants: [] }),
      makeProduct({ id: 'normal', variants: [{ id: 'v1', quantity: 100, price: 99 }] }),
    ];

    expect(() => sortProducts(noVariants, 'price-asc')).not.toThrow();
    expect(() => sortProducts(noVariants, 'price-desc')).not.toThrow();

    const asc = sortProducts(noVariants, 'price-asc');
    // empty variants defaults to price 0, so it comes first
    expect(asc[0].id).toBe('empty');
    expect(asc[1].id).toBe('normal');
  });

  it('treats product with no variants as price 0 for sorting', () => {
    const ps = [
      makeProduct({ id: 'cheap',   variants: [{ id: 'v', quantity: 10, price: 10 }] }),
      makeProduct({ id: 'no-vars', variants: [] }),
      makeProduct({ id: 'pricey',  variants: [{ id: 'v', quantity: 10, price: 200 }] }),
    ];
    const sorted = sortProducts(ps, 'price-asc');
    expect(sorted[0].id).toBe('no-vars'); // 0
    expect(sorted[1].id).toBe('cheap');   // 10
    expect(sorted[2].id).toBe('pricey');  // 200
  });
});

describe('ShopPage — filtering', () => {
  const products = [
    makeProduct({ id: 'p1', name: 'Modalert 200mg', category: 'modafinil',   brand: 'Sun Pharma' }),
    makeProduct({ id: 'p2', name: 'Waklert 150mg',  category: 'armodafinil', brand: 'Sun Pharma' }),
    makeProduct({ id: 'p3', name: 'Artvigil 150mg', category: 'armodafinil', brand: 'HAB Pharma' }),
  ];

  it('filters by category', () => {
    const result = filterProducts(products, { category: 'armodafinil' });
    expect(result).toHaveLength(2);
    result.forEach(p => expect(p.category).toBe('armodafinil'));
  });

  it('filters by brand', () => {
    const result = filterProducts(products, { brand: 'HAB Pharma' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('p3');
  });

  it('filters by search query (name match)', () => {
    const result = filterProducts(products, { searchQuery: 'waklert' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('p2');
  });

  it('search query overrides category/brand filters', () => {
    // When searchQuery is set, category and brand are ignored
    const result = filterProducts(products, {
      searchQuery: 'modalert',
      category: 'armodafinil',
      brand: 'HAB Pharma',
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('p1');
  });

  it('category all returns all products', () => {
    const result = filterProducts(products, { category: 'all' });
    expect(result).toHaveLength(3);
  });

  it('returns empty array when nothing matches search', () => {
    const result = filterProducts(products, { searchQuery: 'zzznotfound' });
    expect(result).toHaveLength(0);
  });
});
