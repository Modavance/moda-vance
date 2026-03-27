import { cn } from '@/utils/cn';

interface LogoProps {
  variant?: 'light' | 'dark' | 'color';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export function Logo({ variant = 'color', size = 'md', showTagline, className }: LogoProps) {
  const sizes = {
    sm: { icon: 28, text: 'text-lg', tagline: 'text-xs' },
    md: { icon: 36, text: 'text-2xl', tagline: 'text-xs' },
    lg: { icon: 48, text: 'text-3xl', tagline: 'text-sm' },
  };

  const s = sizes[size];
  const textColor = variant === 'light' ? 'text-white' : variant === 'dark' ? 'text-slate-900' : 'text-slate-900';
  const taglineColor = variant === 'light' ? 'text-blue-200' : 'text-slate-500';

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Hexagon background */}
        <path
          d="M20 2L36.5 11V29L20 38L3.5 29V11L20 2Z"
          fill="url(#logoGrad)"
        />
        {/* M letter stylized */}
        <path
          d="M11 27V14L16 21L20 15L24 21L29 14V27"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Small dot accent */}
        <circle cx="20" cy="30" r="1.5" fill="white" opacity="0.8" />
        <defs>
          <linearGradient id="logoGrad" x1="3.5" y1="2" x2="36.5" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2563EB" />
            <stop offset="1" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex flex-col leading-none">
        <span className={cn('font-bold tracking-tight', s.text, textColor)}>
          Moda<span className="text-blue-600">Vance</span>
        </span>
        {showTagline && (
          <span className={cn('font-medium tracking-widest uppercase mt-0.5', s.tagline, taglineColor)}>
            The Future of Focus
          </span>
        )}
      </div>
    </div>
  );
}
