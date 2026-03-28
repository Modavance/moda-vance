import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, ChevronDown, Search } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/utils/cn';

const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
];

const PRODUCTS_MENU = [
  { label: 'All Products', href: '/shop', desc: 'Browse our full catalog' },
  { label: 'Modalert 200mg', href: '/products/modalert-200mg', desc: 'Sun Pharma modafinil' },
  { label: 'Modvigil 200mg', href: '/products/modvigil-200mg', desc: 'HAB Pharma modafinil' },
  { label: 'Waklert 150mg', href: '/products/waklert-150mg', desc: 'Sun Pharma armodafinil' },
  { label: 'Artvigil 150mg', href: '/products/artvigil-150mg', desc: 'HAB Pharma armodafinil' },
  { label: 'Starter Pack', href: '/products/nootropic-starter-pack', desc: 'Try all 4 products' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const cartCount = useCartStore((s) => s.getItemCount());
  const openCart = useCartStore((s) => s.openCart);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-blue-600 text-white text-center py-2 px-4 text-sm font-medium">
        🚀 Free shipping on all orders. Use code <strong>WELCOME10</strong> for 10% off your first order
      </div>

      <header
        className={cn(
          'sticky top-0 z-40 transition-all duration-300',
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white border-b border-slate-100'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <Logo size="sm" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {/* Shop dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setShopMenuOpen(true)}
                onMouseLeave={() => setShopMenuOpen(false)}
              >
                <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  Shop
                  <ChevronDown className={cn('w-4 h-4 transition-transform', shopMenuOpen && 'rotate-180')} />
                </button>
                {shopMenuOpen && (
                  <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50">
                    {PRODUCTS_MENU.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="flex flex-col px-4 py-3 rounded-xl hover:bg-blue-50 transition-colors group"
                        onClick={() => setShopMenuOpen(false)}
                      >
                        <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">{item.label}</span>
                        <span className="text-xs text-slate-500">{item.desc}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {NAV_LINKS.slice(1).map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    cn(
                      'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                      isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-48 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="button" onClick={() => setSearchOpen(false)} className="ml-1 p-1.5 text-slate-500">
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}

              {/* Account */}
              <Link
                to={user ? '/account' : '/login'}
                className="hidden sm:flex p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Cart */}
              <button
                onClick={() => openCart()}
                className="relative p-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              {/* CTA */}
              <Button
                size="sm"
                className="hidden sm:flex"
                onClick={() => navigate('/shop')}
              >
                Buy Now
              </Button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white">
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'px-4 py-3 text-sm font-medium rounded-xl transition-colors',
                      isActive ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:bg-slate-50'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <Link
                to={user ? '/account' : '/login'}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                {user ? 'My Account' : 'Sign In'}
              </Link>
              <div className="pt-2">
                <Button fullWidth onClick={() => { navigate('/shop'); setMobileOpen(false); }}>
                  Shop Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
