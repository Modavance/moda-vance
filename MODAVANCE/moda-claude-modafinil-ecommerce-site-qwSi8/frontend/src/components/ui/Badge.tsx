import { cn } from '@/utils/cn';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'gold' | 'navy';
  size?: 'sm' | 'md';
  className?: string;
  children: React.ReactNode;
}

export function Badge({ variant = 'default', size = 'sm', className, children }: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    gold: 'bg-amber-500 text-white',
    navy: 'bg-blue-900 text-blue-100',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={cn('inline-flex items-center font-semibold rounded-full', variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}
