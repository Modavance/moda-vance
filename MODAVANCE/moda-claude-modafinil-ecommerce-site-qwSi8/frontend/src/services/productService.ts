import { db } from '@/db/database';
import type { Product } from '@/types';

export const productService = {
  getAll: () => db.products.toArray(),

  getById: (id: string) => db.products.get(id),

  getBySlug: (slug: string) =>
    db.products.where('slug').equals(slug).first(),

  getFeatured: () =>
    db.products.filter(p => p.featured === true).toArray(),

  getByCategory: (category: string) =>
    db.products.where('category').equals(category).toArray(),

  search: async (query: string): Promise<Product[]> => {
    const q = query.toLowerCase();
    return db.products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      )
      .toArray();
  },
};
