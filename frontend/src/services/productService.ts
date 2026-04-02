import { api, unwrap } from './api';
import { normalizeProduct } from '@/utils/normalizers';
import type { Product } from '@/types';

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const res = await api.get('/products');
    return unwrap<Product[]>(res).map(normalizeProduct);
  },

  getById: async (id: string): Promise<Product | undefined> => {
    try {
      const res = await api.get(`/products/${id}`);
      return normalizeProduct(unwrap<Product>(res));
    } catch {
      return undefined;
    }
  },

  getBySlug: async (slug: string): Promise<Product | undefined> => {
    try {
      const res = await api.get(`/products/${slug}`);
      return normalizeProduct(unwrap<Product>(res));
    } catch {
      return undefined;
    }
  },

  getFeatured: async (): Promise<Product[]> => {
    const res = await api.get('/products/featured');
    return unwrap<Product[]>(res).map(normalizeProduct);
  },

  getByCategory: async (category: string): Promise<Product[]> => {
    const res = await api.get(`/products?category=${encodeURIComponent(category)}`);
    return unwrap<Product[]>(res).map(normalizeProduct);
  },

  search: async (query: string): Promise<Product[]> => {
    const res = await api.get(`/products?search=${encodeURIComponent(query)}`);
    return unwrap<Product[]>(res).map(normalizeProduct);
  },
};
