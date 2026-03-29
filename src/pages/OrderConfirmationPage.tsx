import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle, Package, Truck, Mail, ArrowRight } from 'lucide-react';
import { orderService } from '@/services/orderService';
import { PageLoader } from '@/components/ui/Spinner';
import { formatPrice, formatDate } from '@/utils/formatters';

const PAYMENT_INSTRUCTIONS: Record<string, { title: string; steps: string[] }> = {
  bitcoin: {
    title: 'Bitcoin Payment Instructions',
    steps: [
      'A confirmation email with the BTC wallet address has been sent to your email.',
      'Send the exact BTC amount shown in the email to the provided wallet address.',
      'Payment must be received within 48 hours to hold your order.',
      'Your order will be shipped within 48 hours of payment confirmation.',
    ],
  },
  ethereum: {
    title: 'Ethereum Payment Instructions',
    steps: [
      'A confirmation email with the ETH wallet address has been sent to your email.',
      'Send the exact ETH amount shown in the email to the provided wallet address.',
      'Payment must be received within 48 hours to hold your order.',
      'Your order will be shipped within 48 hours of payment confirmation.',
    ],
  },
  zelle: {
    title: 'Zelle Payment Instructions',
    steps: [
      'You will receive Zelle payment details to your email address.',
      'Complete the Zelle payment within 48 hours to hold your order.',
      'Your order will be processed within 2 hours of receiving payment.',
      'A shipping confirmation email will be sent once your order ships.',
    ],
  },
  bill: {
    title: 'Cash by Mail Instructions',
    steps: [
      'You will receive mailing instructions to your email address.',
      'Send cash or a money order within 48 hours to hold your order.',
      'Your order will be processed once payment is received.',
      'A shipping confirmation email will be sent once your order ships.',
    ],
  },
};

export function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getById(orderId!),
    enabled: !!orderId,
  });

  if (isLoading) return <PageLoader />;
  if (!order) return (
    <div className="text-center py-32">
      <p className="text-xl font-bold text-slate-700">Order not found</p>
      <Link to="/" className="text-blue-600 hover:underline mt-4 block">Go Home</Link>
    </div>
  );

  const instructions = PAYMENT_INSTRUCTIONS[order.paymentMethod];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Success header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
          <p className="text-slate-500">Order #{order.id}</p>
          <p className="text-slate-500 text-sm mt-1">Placed on {formatDate(order.createdAt)}</p>
        </div>

        {/* Payment Instructions */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6">
          <h2 className="font-bold text-amber-900 mb-4">{instructions.title}</h2>
          <ol className="space-y-3">
            {instructions.steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-amber-800">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Order details */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
          <h2 className="font-bold text-slate-900 mb-5">Order Details</h2>
          <div className="flex flex-col gap-4 mb-6">
            {order.items.map((item) => (
              <div key={item.productId} className="flex gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                  <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{item.productName}</p>
                  <p className="text-sm text-slate-500">{item.pillCount} pills × {item.quantity}</p>
                </div>
                <span className="font-bold text-slate-900">{formatPrice(item.price)}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm text-emerald-600 font-medium">
                <span>Discount</span><span>−{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-slate-600">
              <span>Shipping</span>
              <span className={order.shipping === 0 ? 'text-emerald-600 font-semibold' : ''}>
                {order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}
              </span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-100">
              <span>Total</span><span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Delivery info */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-8">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Shipping To</p>
              <p className="text-sm font-semibold text-slate-900">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p className="text-sm text-slate-500">{order.shippingAddress.street}</p>
              {order.shippingAddress.apt && <p className="text-sm text-slate-500">{order.shippingAddress.apt}</p>}
              <p className="text-sm text-slate-500">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Estimated Delivery</p>
              <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-500" />
                {order.estimatedDelivery ? formatDate(order.estimatedDelivery) : '7-14 business days'}
              </p>
              <p className="text-xs text-slate-400 mt-1">Discreet plain packaging</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/account" className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 text-base font-semibold rounded-xl hover:bg-blue-700 transition-all">
            <Package className="w-5 h-5" />
            Track Order
          </Link>
          <Link to="/shop" className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-800 px-6 py-3 text-base font-semibold rounded-xl hover:bg-slate-200 transition-all">
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-6 text-center flex items-center justify-center gap-2 text-sm text-slate-400">
          <Mail className="w-4 h-4" />
          <span>Confirmation sent to {order.shippingAddress.email}</span>
        </div>
      </div>
    </div>
  );
}
