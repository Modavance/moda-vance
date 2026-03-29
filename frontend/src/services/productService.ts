import { db } from '@/db/database';
import type { Product } from '@/types';

function parseProduct(p: Product): Product {
  return p;
}

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const products = await db.products.toArray();
    return products.map(parseProduct);
  },

  getById: async (id: string): Promise<Product | undefined> => {
    const p = await db.products.get(id);
    return p ? parseProduct(p) : undefined;
  },

  getBySlug: async (slug: string): Promise<Product | undefined> => {
    const p = await db.products.where('slug').equals(slug).first();
    return p ? parseProduct(p) : undefined;
  },

  getFeatured: async (): Promise<Product[]> => {
    const products = await db.products.where('featured').equals(1).toArray();
    return products.map(parseProduct);
  },

  getByCategory: async (category: string): Promise<Product[]> => {
    const products = await db.products.where('category').equals(category).toArray();
    return products.map(parseProduct);
  },

  search: async (query: string): Promise<Product[]> => {
    const all = await db.products.toArray();
    const q = query.toLowerCase();
    return all.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    ).map(parseProduct);
  },
};
