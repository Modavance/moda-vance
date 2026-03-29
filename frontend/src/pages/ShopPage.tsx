import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { ProductCard } from '@/components/shop/ProductCard';
import { PageLoader } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { productService } from '@/services/productService';

const CATEGORIES = [
  { value: 'all', label: 'All Products' },
  { value: 'modafinil', label: 'Modafinil' },
  { value: 'armodafinil', label: 'Armodafinil' },
  { value: 'mix', label: '🔀 Mix' },
];

const BRANDS = [
  { value: 'all', label: 'All Brands' },
  { value: 'Sun Pharma', label: 'Sun Pharma' },
  { value: 'HAB Pharma', label: 'HAB Pharma' },
];

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export function ShopPage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') ?? '';
  const [category, setCategory] = useState('all');
  const [brand, setBrand] = useState('all');
  const [sort, setSort] = useState('featured');

  const { data: allProducts, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getAll,
  });

  const filtered = allProducts
    ?.filter((p) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.category.includes(q) || p.brand.toLowerCase().includes(q);
      }
      if (category !== 'all' && p.category !== category) return false;
      if (brand !== 'all' && p.brand !== brand) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'price-asc') return (a.variants[0]?.price ?? 0) - (b.variants[0]?.price ?? 0);
      if (sort === 'price-desc') return (b.variants[0]?.price ?? 0) - (a.variants[0]?.price ?? 0);
      if (sort === 'rating') return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }) ?? [];

  useEffect(() => {
    if (searchQuery) {
      setCategory('all');
      setBrand('all');
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-slate-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">
            {searchQuery ? `Search: "${searchQuery}"` : 'Shop All Products'}
          </h1>
          <p className="text-slate-400">
            {searchQuery
              ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''} found`
              : 'Pharmaceutical-grade Modafinil, Armodafinil and Mix packs — the world\'s most trusted cognitive enhancers'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters bar */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          {/* Category tabs */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  category === c.value
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Brand filter */}
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {BRANDS.map((b) => (
                <option key={b.value} value={b.value}>{b.label}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active filters */}
        {(searchQuery || category !== 'all' || brand !== 'all') && (
          <div className="flex flex-wrap gap-2 mb-6">
            {searchQuery && (
              <span className="flex items-center gap-1.5 bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-medium">
                Search: {searchQuery}
              </span>
            )}
            {category !== 'all' && (
              <button
                onClick={() => setCategory('all')}
                className="flex items-center gap-1.5 bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-medium hover:bg-blue-200 transition-colors"
              >
                {category} <X className="w-3 h-3" />
              </button>
            )}
            {brand !== 'all' && (
              <button
                onClick={() => setBrand('all')}
                className="flex items-center gap-1.5 bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-medium hover:bg-blue-200 transition-colors"
              >
                {brand} <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {isLoading ? (
          <PageLoader />
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl font-semibold text-slate-700 mb-2">No products found</p>
            <p className="text-slate-500 mb-6">Try adjusting your filters or search query</p>
            <Button onClick={() => { setCategory('all'); setBrand('all'); }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
