import { useNavigate } from 'react-router-dom';
import { X, ShoppingCart, Trash2, Plus, Minus, Package } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/utils/formatters';

export function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const navigate = useNavigate();

  const subtotal = getSubtotal();
  const shipping = 0; // Free shipping on all orders

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-900">Your Cart</h2>
            {items.length > 0 && (
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
              <ShoppingCart className="w-10 h-10 text-slate-300" />
            </div>
            <div>
              <p className="text-slate-900 font-semibold">Your cart is empty</p>
              <p className="text-slate-500 text-sm mt-1">Add some products to get started</p>
            </div>
            <Button onClick={() => { navigate('/shop'); closeCart(); }}>
              Browse Products
            </Button>
          </div>
        ) : (
          <>
            <div className="px-6 py-2.5 bg-blue-50 border-b border-blue-100 text-xs font-semibold text-blue-700 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" /> Worldwide delivery · Region fee applied at checkout
              </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-50">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{item.product.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.variant.quantity} pills</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-slate-900">
                        {formatPrice(item.variant.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors self-start mt-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'font-medium text-emerald-600' : 'font-medium'}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span>{formatPrice(subtotal + shipping)}</span>
                </div>
              </div>
              <Button
                fullWidth
                size="lg"
                onClick={() => { navigate('/checkout'); closeCart(); }}
              >
                Checkout · {formatPrice(subtotal + shipping)}
              </Button>
              <button
                onClick={() => { navigate('/shop'); closeCart(); }}
                className="w-full text-center text-sm text-slate-500 hover:text-slate-700 mt-3 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

