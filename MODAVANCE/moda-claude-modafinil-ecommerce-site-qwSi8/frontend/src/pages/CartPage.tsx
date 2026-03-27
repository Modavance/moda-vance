import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Package } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/utils/formatters';

export function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const navigate = useNavigate();
  const subtotal = getSubtotal();
  const shipping = subtotal >= 150 ? 0 : 9.99;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-slate-300" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h1>
          <p className="text-slate-500 mb-8">Browse our products and add something to your cart</p>
          <Button size="lg" onClick={() => navigate('/shop')}>
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Free shipping bar */}
            {shipping > 0 && (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                <div className="flex justify-between text-sm font-medium text-blue-700 mb-2">
                  <span>Add {formatPrice(150 - subtotal)} more for FREE shipping</span>
                  <span>{Math.round((subtotal / 150) * 100)}%</span>
                </div>
                <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{ width: `${(subtotal / 150) * 100}%` }}
                  />
                </div>
              </div>
            )}
            {shipping === 0 && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-emerald-700 font-semibold flex items-center gap-2">
                <Package className="w-5 h-5" /> You qualify for FREE shipping!
              </div>
            )}

            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-5 flex gap-5 border border-slate-100">
                <Link to={`/products/${item.product.slug}`} className="w-24 h-24 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link to={`/products/${item.product.slug}`} className="font-bold text-slate-900 hover:text-blue-600 transition-colors">
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-slate-500 mt-0.5">{item.variant.quantity} pills per pack · {item.product.brand}</p>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-slate-200 rounded-xl">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-2 text-slate-500 hover:text-slate-700 transition-colors">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 font-semibold text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-2 text-slate-500 hover:text-slate-700 transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{formatPrice(item.variant.price * item.quantity)}</p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-slate-400">{formatPrice(item.variant.price)} each</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-24">
              <h2 className="font-bold text-slate-900 text-lg mb-6">Order Summary</h2>
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'font-semibold text-emerald-600' : 'font-medium'}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 text-base pt-3 border-t border-slate-100">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <Button fullWidth size="lg" onClick={() => navigate('/checkout')}>
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Button>
              <Link to="/shop" className="block text-center text-sm text-slate-500 hover:text-slate-700 mt-4 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
