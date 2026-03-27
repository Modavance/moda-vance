import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ShoppingCart, Shield, Truck, RotateCcw, ChevronRight,
  Minus, Plus, CheckCircle, Info
} from 'lucide-react';
import { productService } from '@/services/productService';
import { useCartStore } from '@/store/cartStore';
import { useNotificationStore } from '@/store/notificationStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/Spinner';
import { StarRating } from '@/components/ui/StarRating';
import { formatPrice, formatPricePerPill } from '@/utils/formatters';
import { trackProductView } from '@/hooks/useRecentlyViewed';
import type { ProductVariant } from '@/types';

const BADGE_CONFIG = {
  bestseller: { label: 'Bestseller', variant: 'gold' as const },
  new: { label: 'New Arrival', variant: 'info' as const },
  sale: { label: 'On Sale', variant: 'danger' as const },
  popular: { label: 'Popular', variant: 'success' as const },
};

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'dosing' | 'shipping'>('description');

  const addItem = useCartStore((s) => s.addItem);
  const notify = useNotificationStore();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getBySlug(slug!),
    enabled: !!slug,
  });

  const variant = selectedVariant ?? (product?.variants[Math.floor((product.variants.length - 1) / 2)] ?? product?.variants[0]);

  useEffect(() => {
    if (product?.id) trackProductView(product.id);
  }, [product?.id]);

  if (isLoading) return <PageLoader />;
  if (!product) return (
    <div className="text-center py-32">
      <p className="text-2xl font-bold text-slate-700 mb-2">Product not found</p>
      <Link to="/shop" className="text-blue-600 hover:underline">Back to shop</Link>
    </div>
  );

  const badge = product.badge ? BADGE_CONFIG[product.badge] : null;
  const discount = variant?.originalPrice
    ? Math.round((1 - variant.price / variant.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!variant) return;
    for (let i = 0; i < qty; i++) addItem(product, variant);
    notify.success('Added to cart!', `${qty}x ${product.name} (${variant.quantity} pills)`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/shop" className="hover:text-blue-600">Shop</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-4">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    i === activeImage ? 'border-blue-600' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div>
            {/* Header */}
            <div className="flex flex-wrap items-start gap-3 mb-4">
              {badge && <Badge variant={badge.variant} size="md">{badge.label}</Badge>}
              {discount > 0 && <Badge variant="danger" size="md">Save {discount}%</Badge>}
            </div>

            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-1">{product.brand}</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <StarRating rating={product.rating} size="md" showValue />
              <span className="text-slate-400 text-sm">({product.reviewCount.toLocaleString()} reviews)</span>
            </div>

            <p className="text-slate-600 leading-relaxed mb-8">{product.shortDescription}</p>

            {/* Variant selector */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-slate-700 mb-3">Select Quantity</p>
              <div className="flex flex-col gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
                      variant?.id === v.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        variant?.id === v.id ? 'border-blue-600' : 'border-slate-300'
                      }`}>
                        {variant?.id === v.id && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900">{v.quantity} pills</span>
                        {v.label && (
                          <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                            {v.label}
                          </span>
                        )}
                        <span className="ml-2 text-xs text-slate-500">{formatPricePerPill(v.price, v.quantity)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">{formatPrice(v.price)}</span>
                      {v.originalPrice && (
                        <span className="block text-xs text-slate-400 line-through">{formatPrice(v.originalPrice)}</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Add to cart */}
            <div className="flex gap-3 mb-6">
              <div className="flex items-center border border-slate-200 rounded-xl">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-3 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-semibold text-slate-900">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-3 py-3 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="w-5 h-5" />
                Add to Cart · {variant ? formatPrice(variant.price * qty) : ''}
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-3 py-6 border-t border-b border-slate-100 mb-6">
              {[
                { icon: Shield, text: 'Authentic' },
                { icon: Truck, text: 'Ships in 24h' },
                { icon: RotateCcw, text: 'Money-Back' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1.5 text-center">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-slate-600">{text}</span>
                </div>
              ))}
            </div>

            {/* Effects */}
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-3">Effects</p>
              <div className="flex flex-wrap gap-2">
                {product.effects.map((e) => (
                  <span key={e} className="flex items-center gap-1.5 text-sm bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {e}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex gap-1 border-b border-slate-100 mb-8">
            {(['description', 'dosing', 'shipping'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-semibold capitalize border-b-2 transition-all -mb-px ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab === 'dosing' ? 'Dosing Guide' : tab}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="prose prose-slate max-w-none">
              <div className="text-slate-600 leading-relaxed whitespace-pre-line space-y-4">
                {product.description.split('\n\n').map((para, i) => (
                  <div key={i}>
                    {para.startsWith('**') ? (
                      <h3 className="text-lg font-bold text-slate-900 mt-6 mb-2">
                        {para.replace(/\*\*/g, '')}
                      </h3>
                    ) : (
                      <p>{para}</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-200 flex gap-3">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  <strong>Ingredients:</strong> {product.ingredients}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'dosing' && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-blue-50 rounded-2xl p-6">
                <h3 className="font-bold text-slate-900 mb-3">Recommended Dosing Protocol</h3>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" /><span><strong>Starting dose:</strong> Begin with 100mg (half a tablet) to assess your individual response.</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" /><span><strong>Standard dose:</strong> 200mg modafinil / 150mg armodafinil taken in the morning.</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" /><span><strong>Timing:</strong> Take upon waking or 1 hour before you need to be at peak performance.</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" /><span><strong>Frequency:</strong> 3–4 days per week maximum to maintain sensitivity.</span></li>
                  <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" /><span><strong>With food:</strong> Can be taken with or without food; avoid late afternoon doses.</span></li>
                </ul>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-600">
                <strong>Disclaimer:</strong> This information is for educational purposes only. Consult a licensed healthcare provider before use. Not for sale to persons under 18.
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="max-w-2xl space-y-4">
              {[
                { title: 'Processing Time', desc: 'Orders are processed within 24 hours of payment confirmation.' },
                { title: 'Standard Shipping (US)', desc: '7–14 business days. Ships via USPS or FedEx in plain, unmarked packaging.' },
                { title: 'Express Shipping (US)', desc: '3–7 business days. Available for an additional $19.99.' },
                { title: 'International Shipping', desc: '10–21 business days to most countries. Shipping costs calculated at checkout.' },
                { title: 'Tracking', desc: 'A tracking number is emailed within 48 hours of shipment.' },
                { title: 'Reshipment Policy', desc: 'If your package is seized by customs or lost in transit, we will reship free of charge — no questions asked.' },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 p-4 rounded-xl bg-slate-50">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{item.title}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
