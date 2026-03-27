import { Star } from 'lucide-react';
import { cn } from '@/utils/cn';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

export function StarRating({ rating, max = 5, size = 'sm', showValue, className }: StarRatingProps) {
  const sizes = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' };

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;

        return (
          <span key={i} className="relative">
            <Star className={cn(sizes[size], 'text-slate-200 fill-slate-200')} />
            {(filled || partial) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: partial ? `${(rating % 1) * 100}%` : '100%' }}
              >
                <Star className={cn(sizes[size], 'text-amber-400 fill-amber-400')} />
              </span>
            )}
          </span>
        );
      })}
      {showValue && (
        <span className="ml-1 text-sm font-medium text-slate-700">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
