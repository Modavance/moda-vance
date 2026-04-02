import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle, Package, Truck, MapPin, Clock,
  Copy, ArrowLeft, Zap, ExternalLink,
} from 'lucide-react';
import { useState } from 'react';
import { orderService } from '@/services/orderService';
import { PageLoader } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { formatPrice, formatDate } from '@/utils/formatters';
import type { OrderStatus } from '@/types';

const TIMELINE_STEPS: { status: OrderStatus; label: string; desc: string; icon: React.ReactNode }[] = [
  { status: 'confirmed',  label: 'Order Confirmed',  desc: 'Order received and confirmed',          icon: <CheckCircle className="w-5 h-5" /> },
  { status: 'processing', label: 'Payment Verified', desc: 'Payment processed, preparing shipment', icon: <Zap className="w-5 h-5" /> },
  { status: 'shipped',    label: 'Shipped',           desc: 'Package dispatched from warehouse',     icon: <Package className="w-5 h-5" /> },
  { status: 'delivered',  label: 'Delivered',         desc: 'Package delivered to your address',     icon: <MapPin className="w-5 h-5" /> },
];

const STATUS_WEIGHT: Record<OrderStatus, number> = {
  pending: 0, confirmed: 1, processing: 2, shipped: 3, delivered: 4, cancelled: -1,
};

const STATUS_CONFIG: Record<OrderStatus, { label: string; variant: 'info' | 'warning' | 'success' | 'danger' | 'default' }> = {
  pending:    { label: 'Pending',    variant: 'warning' },
  confirmed:  { label: 'Confirmed',  variant: 'info'    },
  processing: { label: 'Processing', variant: 'info'    },
  shipped:    { label: 'Shipped',    variant: 'success' },
  delivered:  { label: 'Delivered',  variant: 'success' },
  cancelled:  { label: 'Cancelled',  variant: 'danger'  },
};

const PAYMENT_LABELS: Record<string, string> = {
  bitcoin:  'Bitcoin (BTC)',
  ethereum: 'Ethereum (ETH)',
  card:     'Card Payment',
  paypal:   'PayPal',
  // legacy values
  zelle:    'Card Payment',
  bill:     'PayPal',
};

export function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getById(orderId!),
    enabled: !!orderId,
  });

  if (isLoading) return <PageLoader />;
  if (!order) {
    navigate('/track');
    return null;
  }

  const currentStep = STATUS_WEIGHT[order.status];
  const statusConfig = STATUS_CONFIG[order.status];

  const handleCopy = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Back */}
        <Link
          to="/track"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Track Another Order
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-bold text-slate-900">Order Details</h1>
                <Badge variant={statusConfig.variant} size="md">{statusConfig.label}</Badge>
              </div>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors"
              >
                <span className="font-mono text-slate-700">{order.id}</span>
                {copied
                  ? <span className="text-emerald-600 text-xs font-semibold">Copied!</span>
                  : <Copy className="w-3.5 h-3.5" />
                }
              </button>
            </div>
            <div className="text-right text-sm text-slate-500">
              <p>Placed on</p>
              <p className="font-semibold text-slate-900">{formatDate(order.createdAt)}</p>
            </div>
          </div>

          {order.trackingNumber && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Tracking Number</p>
                <p className="font-mono text-slate-900 font-semibold">{order.trackingNumber}</p>
              </div>
              <a
                href={`https://tools.usps.com/go/TrackConfirmAction?tLabels=${order.trackingNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-blue-600 font-semibold hover:underline"
              >
                Track Package <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-4">
          <h2 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" /> Shipment Status
          </h2>

          {order.status === 'cancelled' ? (
            <div className="py-4 text-center">
              <p className="text-red-600 font-semibold">This order has been cancelled.</p>
              <p className="text-sm text-slate-500 mt-1">Please contact support if you have questions.</p>
            </div>
          ) : (
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
          )}

          {order.estimatedDelivery && order.status !== 'delivered' && order.status !== 'cancelled' && (
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3 text-sm text-slate-600">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Estimated delivery: <strong className="text-slate-900">{formatDate(order.estimatedDelivery)}</strong></span>
            </div>
          )}
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-4">
          <h2 className="font-bold text-slate-900 mb-5">Items Ordered</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={`${item.productId}-${item.variantId}`} className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                  <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900">{item.productName}</p>
                  <p className="text-sm text-slate-400">{item.pillCount} pills · qty {item.quantity}</p>
                </div>
                <span className="font-bold text-slate-900 shrink-0">{formatPrice(item.price)}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount</span><span>−{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className={order.shipping === 0 ? 'text-emerald-600 font-semibold' : ''}>
                {order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}
              </span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 text-base pt-2 border-t border-slate-100">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Shipping + Payment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" /> Shipping Address
            </h3>
            <p className="font-semibold text-slate-900 text-sm">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
            <p className="text-sm text-slate-500 mt-1">{order.shippingAddress.street}{order.shippingAddress.apt ? `, ${order.shippingAddress.apt}` : ''}</p>
            <p className="text-sm text-slate-500">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
            <p className="text-sm text-slate-500">{order.shippingAddress.country}</p>
            <p className="text-xs text-slate-400 mt-2">📦 Plain, discreet packaging</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h3 className="font-bold text-slate-900 mb-3">Payment Method</h3>
            <p className="text-sm font-semibold text-slate-700">{PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}</p>
            <p className="text-xs text-slate-400 mt-1">Order placed {formatDate(order.createdAt)}</p>
            {(order.paymentMethod === 'bitcoin' || order.paymentMethod === 'ethereum') && (
              <p className="text-xs text-emerald-600 font-semibold mt-2">✓ 15% crypto discount applied</p>
            )}
            {order.paymentMethod === 'zelle' && (
              <p className="text-xs text-emerald-600 font-semibold mt-2">✓ 10% discount applied</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/shop"
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3.5 rounded-2xl hover:bg-blue-700 transition-all text-sm"
          >
            Continue Shopping
          </Link>
          <Link
            to="/contact"
            className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-900 font-semibold py-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all text-sm"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
