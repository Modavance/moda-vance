import { api } from './api';

export const productService = {
  getAll: () => api('/products?limit=100'),
  getById: async (id: string) => {
    const products = await api('/products?limit=100');
    return products.find((p: any) => p.id === id);
  },
  getBySlug: (slug: string) => api(`/products/${slug}`),
  getFeatured: () => api('/products/featured'),
  getByCategory: (category: string) => api(`/products?category=${category}`),
  search: (query: string) => api(`/products?search=${encodeURIComponent(query)}`),
};
