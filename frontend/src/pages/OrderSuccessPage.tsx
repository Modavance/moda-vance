import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle, Package, Truck, MapPin, Clock,
  Copy, Share2, ArrowRight, Star, Gift, Zap, ShoppingCart,
} from 'lucide-react';
import { orderService } from '@/services/orderService';
import { productService } from '@/services/productService';
import { api, unwrap } from '@/services/api';
import { useCartStore } from '@/store/cartStore';
import { useNotificationStore } from '@/store/notificationStore';
import { PageLoader } from '@/components/ui/Spinner';
import { formatPrice, formatDate } from '@/utils/formatters';
import type { OrderStatus, Product } from '@/types';

/* ─── Confetti ─── */
function Confetti() {
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 3,
    color: ['#2563eb', '#f59e0b', '#10b981', '#7c3aed', '#ef4444', '#06b6d4'][Math.floor(Math.random() * 6)],
    size: 6 + Math.random() * 8,
    shape: Math.random() > 0.5 ? 'circle' : 'rect',
  }));

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-50">
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        .confetti-piece { position: absolute; top: -20px; animation: fall linear forwards; }
      `}</style>
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            backgroundColor: p.color,
            width: p.shape === 'circle' ? p.size : p.size * 0.6,
            height: p.size,
            borderRadius: p.shape === 'circle' ? '50%' : 2,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Timeline ─── */
const TIMELINE_STEPS: { status: OrderStatus; label: string; desc: string; icon: React.ReactNode }[] = [
  { status: 'confirmed',  label: 'Order Confirmed',  desc: 'Your order has been received and confirmed', icon: <CheckCircle className="w-5 h-5" /> },
  { status: 'processing', label: 'Payment Verified', desc: 'Payment processed and order in queue',       icon: <Zap className="w-5 h-5" /> },
  { status: 'shipped',    label: 'Shipped',           desc: 'Your package is on its way',                icon: <Package className="w-5 h-5" /> },
  { status: 'delivered',  label: 'Delivered',         desc: 'Package delivered to your address',         icon: <MapPin className="w-5 h-5" /> },
];

const STATUS_WEIGHT: Record<OrderStatus, number> = {
  pending: 0, confirmed: 1, processing: 2, shipped: 3, delivered: 4, cancelled: -1,
};

function buildPaymentInstructions(s: Record<string, string>, total: number) {
  const btcWallet = s['payment.bitcoin.wallet']  ?? '(wallet address will be in your confirmation email)';
  const ethWallet = s['payment.ethereum.wallet'] ?? '(wallet address will be in your confirmation email)';

  return {
    bitcoin: {
      title: 'Complete Your Bitcoin Payment',
      color: 'bg-amber-50 border-amber-200',
      steps: [
        `Send exactly the BTC equivalent of $${total.toFixed(2)} USD to: ${btcWallet}`,
        'Send payment from your Bitcoin wallet within 48 hours of placing your order.',
        'Once confirmed on-chain (1 confirmation), your order ships automatically.',
        'You\'ll receive a shipping notification with tracking number.',
      ],
    },
    ethereum: {
      title: 'Complete Your Ethereum Payment',
      color: 'bg-purple-50 border-purple-200',
      steps: [
        `Send exactly the ETH equivalent of $${total.toFixed(2)} USD to: ${ethWallet}`,
        'Send payment from your Ethereum wallet within 48 hours of placing your order.',
        'Once confirmed (1 confirmation), your order ships automatically.',
        'You\'ll receive a shipping notification with tracking number.',
      ],
    },
    zelle: {
      title: 'Complete Your Zelle Payment',
      color: 'bg-blue-50 border-blue-200',
      steps: [
        `Send $${total.toFixed(2)} via Zelle to the address in your confirmation email.`,
        'Please complete the payment within 48 hours to hold your order.',
        'Your order will be processed within 2 hours of receiving payment.',
        'You\'ll receive a shipping confirmation email once it ships.',
      ],
    },
    bill: {
      title: 'Check Your Email for Payment Details',
      color: 'bg-slate-50 border-slate-200',
      steps: [
        'Payment instructions have been sent to your email address.',
        'Please check your inbox and spam/junk folder.',
        'Complete the payment within 48 hours to hold your order.',
        'Your order will be processed once payment is confirmed.',
      ],
    },
  };
}

/* ─── Upsell card ─── */
function UpsellCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const notify  = useNotificationStore();

  const variant = product.variants.find((v) => v.label === 'Best Value') ?? product.variants[Math.floor(product.variants.length / 2)];

  const handleAdd = () => {
    addItem(product, variant);
    notify.success(`${product.name} added to cart`, `${variant.quantity} pills — ${formatPrice(variant.price)}`);
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-blue-100 transition-colors bg-white">
      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-50 shrink-0">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-900 text-sm truncate">{product.name}</p>
        <p className="text-xs text-slate-400">{product.brand} · {product.strength}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="text-xs text-slate-500">{product.rating}</span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-slate-900">{formatPrice(variant.price)}</p>
        <button
          onClick={handleAdd}
          className="mt-1 inline-flex items-center gap-1 text-xs bg-blue-600 text-white px-2.5 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          <ShoppingCart className="w-3 h-3" /> Add
        </button>
      </div>
    </div>
  );
}

export function OrderSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);
  const [copied, setCopied] = useState(false);

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getById(orderId!),
    enabled: !!orderId,
  });

  const { data: allProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll(),
  });

  const { data: settings = {} } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await api.get('/settings');
      const list = unwrap<{ key: string; value: string }[]>(res);
      return Object.fromEntries(list.map(s => [s.key, s.value]));
    },
  });

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(t);
  }, []);

  const handleCopyOrderId = () => {
    if (order) {
      navigator.clipboard.writeText(order.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) return <PageLoader />;
  if (!order) {
    navigate('/');
    return null;
  }

  const currentStep = STATUS_WEIGHT[order.status];
  const resolvedPaymentFee = order.paymentFee ?? (['card', 'paypal'].includes(order.paymentMethod) ? 10 : 0);
  const paymentInstructions = buildPaymentInstructions(settings, order.total);
  const instructions = paymentInstructions[order.paymentMethod as keyof typeof paymentInstructions]
    ?? paymentInstructions.bill;

  // Suggest products the customer didn't order
  const orderedIds = new Set(order.items.map((i) => i.productId));
  const suggestions = (allProducts ?? [])
    .filter((p) => !orderedIds.has(p.id) && p.inStock && p.id !== 'starter-pack')
    .slice(0, 3);

  return (
    <>
      {showConfetti && <Confetti />}

      <div className="min-h-screen bg-slate-50">
        {/* Hero banner */}
        <div className="gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center relative">
            <div className="relative inline-flex mb-6">
              <div className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -inset-2 rounded-full border-2 border-emerald-400/30 animate-ping" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              🎉 Order Confirmed!
            </h1>
            <p className="text-slate-300 text-lg mb-6">
              Thank you for your purchase. Your order is being processed.
            </p>

            <button
              onClick={handleCopyOrderId}
              className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full text-white text-sm font-medium hover:bg-white/10 transition-all"
            >
              <span className="font-mono">{order.id}</span>
              {copied
                ? <span className="text-emerald-400 text-xs">Copied!</span>
                : <Copy className="w-3.5 h-3.5 text-slate-300" />
              }
            </button>

            <p className="text-slate-400 text-sm mt-3">
              Placed on {formatDate(order.createdAt)} · Confirmation sent to {order.shippingAddress.email}
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">

          {/* Payment instructions */}
          <div className={`rounded-2xl border p-6 ${instructions.color}`}>
            <h2 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              {instructions.title}
            </h2>
            <ol className="space-y-3">
              {instructions.steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-700">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Order timeline */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" /> Order Timeline
            </h2>
            <div className="relative">
              <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-slate-100" />
              <div className="space-y-6">
                {TIMELINE_STEPS.map((step, i) => {
                  const done   = currentStep >= STATUS_WEIGHT[step.status];
                  const active = currentStep === STATUS_WEIGHT[step.status];
                  return (
                    <div key={step.status} className="flex gap-4 relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                        done
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                          : 'bg-white border-2 border-slate-200 text-slate-300'
                      } ${active ? 'ring-4 ring-blue-100' : ''}`}>
                        {step.icon}
                      </div>
                      <div className="pt-1.5">
                        <p className={`font-semibold text-sm ${done ? 'text-slate-900' : 'text-slate-400'}`}>{step.label}</p>
                        <p className={`text-xs mt-0.5 ${done ? 'text-slate-500' : 'text-slate-300'}`}>{step.desc}</p>
                        {active && (
                          <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full mt-1">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                            Current status
                          </span>
                        )}
                      </div>
                      {done && i < TIMELINE_STEPS.length - 1 && (
                        <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-blue-600" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {order.estimatedDelivery && (
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3 text-sm text-slate-600">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>Estimated delivery: <strong className="text-slate-900">{formatDate(order.estimatedDelivery)}</strong></span>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-bold text-slate-900 mb-5">Order Summary</h2>
            <div className="space-y-3 mb-5">
              {order.items.map((item) => (
                <div key={item.productId} className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                    <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm">{item.productName}</p>
                    <p className="text-xs text-slate-400">{item.pillCount} pills · qty {item.quantity}</p>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">{formatPrice(item.price)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 pt-4 border-t border-slate-100 text-sm">
              <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount saved{order.couponCode ? ` (${order.couponCode})` : ''}</span><span>−{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="text-emerald-600 font-semibold">FREE</span>
              </div>
              {order.shipping > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Dispatch Center Fee</span>
                  <span className="font-semibold">+{formatPrice(order.shipping)}</span>
                </div>
              )}
              {resolvedPaymentFee > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Processing Fee</span>
                  <span className="font-semibold">+{formatPrice(resolvedPaymentFee)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-slate-900 text-base pt-2 border-t border-slate-100">
                <span>Total Paid</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" /> Shipping To
            </h2>
            <p className="font-semibold text-slate-900">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
            <p className="text-slate-500 text-sm">{order.shippingAddress.street}{order.shippingAddress.apt ? `, ${order.shippingAddress.apt}` : ''}</p>
            <p className="text-slate-500 text-sm">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
            <p className="text-slate-500 text-sm">{order.shippingAddress.country}</p>
            <p className="text-xs text-slate-400 mt-2">📦 Discreet plain packaging · No branding visible</p>
          </div>

          {/* Post-purchase suggestions */}
          {suggestions.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="font-bold text-slate-900 mb-1">Complete Your Stack</h2>
              <p className="text-sm text-slate-500 mb-4">Customers who bought your items also added these:</p>
              <div className="space-y-3">
                {suggestions.map((product) => (
                  <UpsellCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {/* Loyalty */}
          <div className="bg-blue-600 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-white text-lg mb-1">You earned loyalty points!</h3>
            <p className="text-blue-100 text-sm mb-4">
              Share your referral code and earn <strong className="text-white">$15</strong> for every friend who orders.
            </p>
            <button className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-blue-50 transition-colors">
              <Share2 className="w-4 h-4" />
              Share & Earn
            </button>
          </div>

          {/* Tips */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-bold text-slate-900 mb-4">First-Time User Tips</h2>
            <div className="space-y-3">
              {[
                { icon: '🌅', text: 'Take your dose in the morning, ideally 30–60 min after waking.' },
                { icon: '💊', text: 'Start with 100mg (half a tablet) to calibrate your response.' },
                { icon: '💧', text: 'Stay well-hydrated throughout the day — drink an extra 500ml of water.' },
                { icon: '🌙', text: 'Avoid taking after noon to prevent sleep disruption.' },
                { icon: '📊', text: 'Keep a simple log of effects, dose, and timing for the first few uses.' },
              ].map((tip) => (
                <div key={tip.icon} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="text-lg">{tip.icon}</span>
                  {tip.text}
                </div>
              ))}
            </div>
          </div>

          {/* Rate experience */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center">
            <h3 className="font-bold text-slate-900 mb-2">How was your ordering experience?</h3>
            <p className="text-sm text-slate-500 mb-4">Your feedback helps us improve</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} className="group">
                  <Star className="w-8 h-8 text-slate-200 fill-slate-200 group-hover:text-amber-400 group-hover:fill-amber-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row gap-4 pb-4">
            <Link
              to={`/orders/${order.id}`}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-4 rounded-2xl hover:bg-blue-700 active:scale-95 transition-all text-base shadow-lg shadow-blue-600/25"
            >
              <Package className="w-5 h-5" /> Track Your Order
            </Link>
            <Link
              to="/shop"
              className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-900 font-semibold py-4 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:scale-95 transition-all text-base"
            >
              Continue Shopping <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
