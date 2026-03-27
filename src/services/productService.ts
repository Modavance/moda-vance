import { api } from './api';

function parseProduct(p: any) {
  if (p && typeof p.effects === 'string') p.effects = JSON.parse(p.effects);
  if (p && typeof p.images === 'string') p.images = JSON.parse(p.images);
  return p;
}

export const productService = {
  getAll: async () => { const r = await api('/products?limit=100'); return (r || []).map(parseProduct); },
  getById: async (id: string) => { const r = await api('/products?limit=100'); return (r || []).map(parseProduct).find((p: any) => p.id === id); },
  getBySlug: async (slug: string) => parseProduct(await api(`/products/${slug}`)),
  getFeatured: async () => { const r = await api('/products/featured'); return (r || []).map(parseProduct); },
  getByCategory: async (category: string) => { const r = await api(`/products?category=${category}`); return (r || []).map(parseProduct); },
  search: async (query: string) => { const r = await api(`/products?search=${encodeURIComponent(query)}`); return (r || []).map(parseProduct); },
};
