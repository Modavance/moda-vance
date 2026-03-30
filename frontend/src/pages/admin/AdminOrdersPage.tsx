import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Search, Eye, ChevronDown, Package, Truck, CheckCircle,
  XCircle, Clock, RefreshCw, AlertTriangle, History,
} from 'lucide-react';
import { adminApi, unwrap } from '@/services/api';
import { formatPrice, formatDate } from '@/utils/formatters';
import type { Order, OrderStatus, OrderStatusLog } from '@/types';

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_STYLES: Record<OrderStatus, { bg: string; text: string; icon: React.ReactNode }> = {
  pending:    { bg: 'bg-amber-100',   text: 'text-amber-700',   icon: <Clock className="w-3.5 h-3.5" /> },
  confirmed:  { bg: 'bg-blue-100',    text: 'text-blue-700',    icon: <CheckCircle className="w-3.5 h-3.5" /> },
  processing: { bg: 'bg-purple-100',  text: 'text-purple-700',  icon: <RefreshCw className="w-3.5 h-3.5" /> },
  shipped:    { bg: 'bg-cyan-100',    text: 'text-cyan-700',    icon: <Truck className="w-3.5 h-3.5" /> },
  delivered:  { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: <Package className="w-3.5 h-3.5" /> },
  cancelled:  { bg: 'bg-red-100',     text: 'text-red-700',     icon: <XCircle className="w-3.5 h-3.5" /> },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${s.bg} ${s.text}`}>
      {s.icon} {status}
    </span>
  );
}

function ConfirmStatusDialog({ orderId, fromStatus, toStatus, note, onNoteChange, onConfirm, onCancel }: {
  orderId: string; fromStatus: OrderStatus; toStatus: OrderStatus; note: string;
  onNoteChange: (v: string) => void; onConfirm: () => void; onCancel: () => void;
}) {
  const from = STATUS_STYLES[fromStatus];
  const to = STATUS_STYLES[toStatus];
  const isDanger = toStatus === 'cancelled';
  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isDanger ? 'bg-red-100' : 'bg-blue-100'}`}>
            <AlertTriangle className={`w-5 h-5 ${isDanger ? 'text-red-600' : 'text-blue-600'}`} />
          </div>
          <div><h3 className="font-bold text-slate-900">Confirm Status Change</h3><p className="text-xs text-slate-500 font-mono mt-0.5">{orderId}</p></div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 justify-center">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-full capitalize ${from.bg} ${from.text}`}>{from.icon} {fromStatus}</span>
            <span className="text-slate-400 font-bold">→</span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-full capitalize ${to.bg} ${to.text}`}>{to.icon} {toStatus}</span>
          </div>
          {isDanger && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">This will cancel the order. This action cannot be easily undone.</div>}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase">Note <span className="font-normal text-slate-400 normal-case">(optional)</span></label>
            <textarea rows={2} value={note} onChange={e => onNoteChange(e.target.value)} placeholder={toStatus === 'shipped' ? 'e.g. Tracking #TRK123456789' : 'e.g. Payment confirmed'}
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
        </div>
        <div className="p-4 border-t border-slate-100 flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
          <button onClick={onConfirm} className={`flex-1 py-2.5 text-sm font-semibold text-white rounded-xl transition-colors ${isDanger ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>Confirm Change</button>
        </div>
      </div>
    </div>
  );
}

function StatusLogTimeline({ orderId, orderCreatedAt }: { orderId: string; orderCreatedAt: Date }) {
  const { data: logs } = useQuery<OrderStatusLog[]>({
    queryKey: ['status-logs', orderId],
    queryFn: async () => {
      const res = await adminApi.get(`/orders/${orderId}/logs`);
      return unwrap<OrderStatusLog[]>(res);
    },
  });

  const fmtTime = (d: Date | string) => new Date(d).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  type Entry = { kind: 'created'; at: Date } | { kind: 'log'; log: OrderStatusLog };
  const entries: Entry[] = [
    { kind: 'created', at: new Date(orderCreatedAt) },
    ...(logs ?? []).map(log => ({ kind: 'log' as const, log })),
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <History className="w-4 h-4 text-slate-400" />
        <p className="text-sm font-semibold text-slate-700">Status Change Log</p>
        <span className="ml-auto text-xs text-slate-400">{logs?.length ?? 0} change{(logs?.length ?? 0) !== 1 ? 's' : ''}</span>
      </div>
      <div className="relative">
        <div className="absolute left-3 top-4 bottom-4 w-px bg-slate-200" />
        <div className="space-y-3">
          {entries.map((entry, idx) => {
            if (entry.kind === 'created') return (
              <div key="created" className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center shrink-0 z-10"><Package className="w-3 h-3 text-white" /></div>
                <div className="flex-1"><p className="text-sm font-semibold text-slate-900">Order placed</p><p className="text-xs text-slate-400 mt-0.5">{fmtTime(entry.at)}</p></div>
              </div>
            );
            const { log } = entry;
            const toStyle = STATUS_STYLES[log.toStatus];
            const isLatest = idx === entries.length - 1;
            return (
              <div key={log.id} className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${toStyle.bg}`}><span className={toStyle.text}>{toStyle.icon}</span></div>
                <div className={`flex-1 rounded-xl p-3 ${isLatest ? 'bg-blue-50 ring-1 ring-blue-200' : 'bg-slate-100'}`}>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      {log.fromStatus && (<><span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full ${STATUS_STYLES[log.fromStatus].bg} ${STATUS_STYLES[log.fromStatus].text}`}>{log.fromStatus}</span><span className="text-slate-400 text-xs font-bold">→</span></>)}
                      <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full ${toStyle.bg} ${toStyle.text}`}>{log.toStatus}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">{fmtTime(log.changedAt)}</span>
                  </div>
                  {log.note && <p className="text-xs text-slate-600 mt-1.5"><span className="text-slate-400">Note: </span>{log.note}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function OrderDetailModal({ order, onClose, onRequestStatusChange }: {
  order: Order; onClose: () => void; onRequestStatusChange: (id: string, from: OrderStatus, to: OrderStatus) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div><h2 className="font-bold text-slate-900 text-lg">{order.id}</h2><p className="text-sm text-slate-500">{formatDate(order.createdAt)}</p></div>
          <div className="flex items-center gap-3"><StatusBadge status={order.status} /><button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">✕</button></div>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Change Status</p>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.filter(s => s !== order.status).map(s => (
                <button key={s} onClick={() => onRequestStatusChange(order.id, order.status, s)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border-2 capitalize transition-all border-current ${STATUS_STYLES[s].text} bg-white hover:opacity-80`}>
                  {STATUS_STYLES[s].icon} {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-3">Items</p>
            <div className="space-y-2">
              {order.items.map(item => (
                <div key={item.productId} className="flex gap-3 p-3 bg-slate-50 rounded-xl">
                  {item.image && <img src={item.image} className="w-12 h-12 rounded-lg object-cover" alt={item.productName} />}
                  <div className="flex-1"><p className="font-semibold text-slate-900 text-sm">{item.productName}</p><p className="text-xs text-slate-500">{item.pillCount} pills · qty {item.quantity}</p></div>
                  <span className="font-bold text-slate-900 text-sm">{formatPrice(item.price)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Ship To</p>
              <p className="text-sm font-semibold text-slate-900">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p className="text-xs text-slate-500">{order.shippingAddress.street}</p>
              <p className="text-xs text-slate-500">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p className="text-xs text-slate-500">{order.shippingAddress.email}</p>
              <p className="text-xs text-slate-500">{order.shippingAddress.country}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Payment</p>
              <p className="text-sm font-semibold text-slate-900 capitalize">{order.paymentMethod}</p>
              <div className="mt-2 space-y-1 text-xs text-slate-500">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                {order.discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>−{formatPrice(order.discount)}</span></div>}
                <div className="flex justify-between"><span>Shipping</span><span className="text-emerald-600 font-semibold">{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}</span></div>
                <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1"><span>Total</span><span>{formatPrice(order.total)}</span></div>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4">
            <StatusLogTimeline orderId={order.id} orderCreatedAt={order.createdAt} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [pending, setPending] = useState<{ orderId: string; fromStatus: OrderStatus; toStatus: OrderStatus; note: string } | null>(null);

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const res = await adminApi.get('/orders');
      return unwrap<Order[]>(res);
    },
  });

  const filtered = orders.filter(o => {
    const matchSearch = search === '' || o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress.email.toLowerCase().includes(search.toLowerCase()) ||
      `${o.shippingAddress.firstName} ${o.shippingAddress.lastName}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleRequestStatusChange = (orderId: string, fromStatus: OrderStatus, toStatus: OrderStatus) => {
    setPending({ orderId, fromStatus, toStatus, note: '' });
  };

  const handleConfirmStatusChange = async () => {
    if (!pending) return;
    const { orderId, fromStatus, toStatus, note } = pending;
    await adminApi.patch(`/orders/${orderId}/status`, { status: toStatus, note: note.trim() || undefined });
    queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    queryClient.invalidateQueries({ queryKey: ['status-logs', orderId] });
    if (selectedOrder?.id === orderId) setSelectedOrder(prev => prev ? { ...prev, status: toStatus, updatedAt: new Date() } : null);
    setPending(null);
  };

  const statusCounts = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] ?? 0) + 1; return acc; }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-slate-900">Orders</h1><p className="text-slate-500 text-sm mt-1">{orders.length} total orders</p></div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setStatusFilter('all')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${statusFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}>All ({orders.length})</button>
        {STATUS_OPTIONS.map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${statusFilter === s ? `${STATUS_STYLES[s].bg} ${STATUS_STYLES[s].text}` : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}>
            {s} ({statusCounts[s] ?? 0})
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order ID, customer name, or email..." className="flex-1 text-sm text-slate-700 outline-none placeholder:text-slate-400" />
        {search && <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600 text-xs">Clear</button>}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                <th className="px-5 py-3.5">Order ID</th><th className="px-5 py-3.5">Customer</th><th className="px-5 py-3.5">Items</th>
                <th className="px-5 py-3.5">Total</th><th className="px-5 py-3.5">Payment</th><th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Status</th><th className="px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-16 text-center"><Package className="w-10 h-10 text-slate-200 mx-auto mb-3" /><p className="text-slate-400 font-medium">No orders yet</p></td></tr>
              ) : filtered.map(order => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs font-semibold text-slate-700">{order.id}</td>
                  <td className="px-5 py-4"><p className="font-semibold text-slate-900 text-sm">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p><p className="text-xs text-slate-400">{order.shippingAddress.email}</p></td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1">
                      {order.items.slice(0, 2).map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          {item.image ? <img src={item.image} className="w-8 h-8 rounded-lg object-cover shrink-0" alt="" /> : <div className="w-8 h-8 rounded-lg bg-slate-200 shrink-0" />}
                          <div><p className="text-xs font-medium text-slate-800 leading-tight">{item.productName}</p><p className="text-[11px] text-slate-400">{item.pillCount} pills · qty {item.quantity}</p></div>
                        </div>
                      ))}
                      {order.items.length > 2 && <p className="text-xs text-slate-400">+{order.items.length - 2} more</p>}
                    </div>
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-900">{formatPrice(order.total)}</td>
                  <td className="px-5 py-4 text-xs text-slate-500 capitalize">{order.paymentMethod}</td>
                  <td className="px-5 py-4 text-xs text-slate-500">{formatDate(order.createdAt)}</td>
                  <td className="px-5 py-4"><StatusBadge status={order.status} /></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelectedOrder(order)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                      <div className="relative group">
                        <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"><ChevronDown className="w-4 h-4" /></button>
                        <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-slate-100 rounded-xl shadow-xl py-1 z-10 hidden group-hover:block">
                          {STATUS_OPTIONS.filter(s => s !== order.status).map(s => (
                            <button key={s} onClick={() => handleRequestStatusChange(order.id, order.status, s)}
                              className={`w-full text-left px-3 py-2 text-xs capitalize hover:bg-slate-50 font-medium ${STATUS_STYLES[s].text}`}>→ {s}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onRequestStatusChange={handleRequestStatusChange} />}
      {pending && (
        <ConfirmStatusDialog orderId={pending.orderId} fromStatus={pending.fromStatus} toStatus={pending.toStatus} note={pending.note}
          onNoteChange={v => setPending(p => p ? { ...p, note: v } : null)} onConfirm={handleConfirmStatusChange} onCancel={() => setPending(null)} />
      )}
    </div>
  );
}
