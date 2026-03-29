import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/cartStore';
import { useNotificationStore } from '@/store/notificationStore';
import { formatPrice, formatPricePerPill } from '@/utils/formatters';
import { cn } from '@/utils/cn';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const BADGE_CONFIG = {
  bestseller: { label: '🏆 Bestseller', variant: 'gold' as const },
  new: { label: '✨ New', variant: 'info' as const },
  sale: { label: '🔥 Sale', variant: 'danger' as const },
  popular: { label: '⭐ Popular', variant: 'success' as const },
};

export function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const notify = useNotificationStore();

  const defaultVariant = product.variants.reduce((min, v) => v.price < min.price ? v : min, product.variants[0]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, defaultVariant);
    notify.success(`${product.name} added to cart`, `${defaultVariant.quantity} pills — ${formatPrice(defaultVariant.price)}`);
  };

  const badge = product.badge ? BADGE_CONFIG[product.badge] : null;
  const discount = defaultVariant.originalPrice
    ? Math.round((1 - defaultVariant.price / defaultVariant.originalPrice) * 100)
    : 0;

  return (
    <Link
      to={`/products/${product.slug}`}
      className={cn(
        'group flex flex-col bg-white rounded-2xl border border-slate-100 overflow-hidden card-hover',
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {badge && (
          <div className="absolute top-3 left-3">
            <Badge variant={badge.variant}>{badge.label}</Badge>
          </div>
        )}
        {discount > 0 && (
          <div className="absolute top-3 right-3">
            <Badge variant="danger">-{discount}%</Badge>
          </div>
        )}
        {/* Quick add overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-3">
          <Button
            fullWidth
            size="sm"
            onClick={handleAddToCart}
            className="shadow-lg"
          >
            <ShoppingCart className="w-4 h-4" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">{product.brand}</p>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">{product.name}</h3>
          </div>
        </div>

        <p className="text-sm text-slate-500 line-clamp-2 mb-3 flex-1">{product.shortDescription}</p>

        {/* Effects */}
        <div className="flex flex-wrap gap-1 mb-4">
          {product.effects.slice(0, 3).map((e) => (
            <span key={e} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              {e}
            </span>
          ))}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'w-3.5 h-3.5',
                  i < Math.floor(product.rating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-200 fill-slate-200'
                )}
              />
            ))}
          </div>
          <span className="text-xs text-slate-500">
            {product.rating} ({product.reviewCount.toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-900">{formatPrice(defaultVariant.price)}</span>
              {defaultVariant.originalPrice && (
                <span className="text-sm text-slate-400 line-through">{formatPrice(defaultVariant.originalPrice)}</span>
              )}
            </div>
            <p className="text-xs text-slate-500">{formatPricePerPill(defaultVariant.price, defaultVariant.quantity)} · {defaultVariant.quantity} pills</p>
          </div>
          <button
            onClick={handleAddToCart}
            className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-600/25"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
