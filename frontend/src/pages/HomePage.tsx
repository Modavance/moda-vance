import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { Hero } from '@/components/home/Hero';
import { Features } from '@/components/home/Features';
import { Testimonials } from '@/components/home/Testimonials';
import { TrustSection } from '@/components/home/TrustSection';
import { HowItWorks } from '@/components/home/HowItWorks';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { ProductCard } from '@/components/shop/ProductCard';
import { PageLoader } from '@/components/ui/Spinner';
import { productService } from '@/services/productService';
import { getRecentlyViewedIds } from '@/hooks/useRecentlyViewed';
import { api, unwrap } from '@/services/api';
import type { Product } from '@/types';

function RecentlyViewedSection() {
  const ids = getRecentlyViewedIds();

  const { data: products } = useQuery({
    queryKey: ['recently-viewed', ids.join(',')],
    queryFn: async () => {
      if (ids.length === 0) return [];
      const results = await Promise.all(
        ids.map(id => api.get(`/products/${id}`).then(r => unwrap<Product>(r)).catch(() => null))
      );
      return results.filter((p): p is Product => p != null);
    },
    enabled: ids.length > 0,
  });

  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
              <Clock className="w-4 h-4 text-slate-500" />
            </div>
            <div>
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
                Recently Viewed
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-0.5">
                Pick up where you left off
              </h2>
            </div>
          </div>
          <Link
            to="/shop"
            className="hidden sm:flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors text-sm"
          >
            Browse All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  const { data: featured, isLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: productService.getFeatured,
  });

  return (
    <>
      <Hero />
      <Features />

      {/* Featured Products */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest">Our Products</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
                Premium Cognitive Enhancers
              </h2>
            </div>
            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <PageLoader />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link to="/shop" className="text-blue-600 font-semibold">
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* Recently Viewed — only shown after user has browsed products */}
      <RecentlyViewedSection />

      <HowItWorks />
      <Testimonials />
      <TrustSection />
      <NewsletterSection />
    </>
  );
}
