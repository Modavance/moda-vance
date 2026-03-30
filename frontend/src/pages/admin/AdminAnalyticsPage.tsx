import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, ShoppingBag, DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminApi, unwrap } from '@/services/api';
import { formatPrice } from '@/utils/formatters';
import type { Order } from '@/types';

const PAYMENT_DATA = [
  { name: 'Bitcoin',  value: 45, color: '#f59e0b' },
  { name: 'Ethereum', value: 30, color: '#6366f1' },
  { name: 'Zelle',    value: 15, color: '#3b82f6' },
  { name: 'Bill',     value: 10, color: '#64748b' },
];

export function AdminAnalyticsPage() {
  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const res = await adminApi.get('/orders');
      return unwrap<Order[]>(res);
    },
  });
  const { data: customers = [] } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: async () => {
      const res = await adminApi.get('/admin/customers');
      return unwrap<{ id: string }[]>(res);
    },
  });

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const totalCustomers = customers.length;

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthlyMap: Record<string, { revenue: number; orders: number }> = {};
  orders.forEach(o => {
    const d = new Date(o.createdAt);
    const key = monthNames[d.getMonth()];
    if (!monthlyMap[key]) monthlyMap[key] = { revenue: 0, orders: 0 };
    monthlyMap[key].revenue += o.total;
    monthlyMap[key].orders += 1;
  });
  const monthlyData = monthNames.filter(m => monthlyMap[m]).map(m => ({ month: m, ...monthlyMap[m] }));

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-slate-900">Analytics</h1><p className="text-slate-500 text-sm mt-1">Real-time store performance</p></div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue',   value: formatPrice(totalRevenue),      icon: DollarSign,  color: 'bg-blue-50 text-blue-600' },
          { label: 'Total Orders',    value: totalOrders.toLocaleString(),   icon: ShoppingBag, color: 'bg-purple-50 text-purple-600' },
          { label: 'Total Customers', value: totalCustomers.toLocaleString(),icon: Users,       color: 'bg-emerald-50 text-emerald-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}><s.icon className="w-6 h-6" /></div>
            <div><p className="text-2xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
          </div>
        ))}
      </div>

      {monthlyData.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="font-bold text-slate-900 mb-6">Monthly Revenue & Orders</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5} dot={false} name="Revenue ($)" />
              <Line type="monotone" dataKey="orders"  stroke="#a855f7" strokeWidth={2.5} dot={false} name="Orders" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400">
          <ShoppingBag className="w-10 h-10 mx-auto mb-3 text-slate-200" />
          <p className="font-medium">No order data yet</p>
        </div>
      )}

      {orders.length > 0 && (() => {
        const productMap: Record<string, { name: string; count: number; revenue: number }> = {};
        orders.forEach(o => o.items.forEach(item => {
          if (!productMap[item.productId]) productMap[item.productId] = { name: item.productName, count: 0, revenue: 0 };
          productMap[item.productId].count += item.quantity;
          productMap[item.productId].revenue += item.price;
        }));
        const topProducts = Object.values(productMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
        return (
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-bold text-slate-900 mb-4">Top Products</h2>
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                  <span className="flex-1 text-sm font-medium text-slate-800 truncate">{p.name}</span>
                  <span className="text-xs text-slate-400">{p.count} units</span>
                  <span className="text-sm font-bold text-slate-900">{formatPrice(p.revenue)}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-bold text-slate-900 mb-4">Payment Methods</h2>
        <div className="space-y-3">
          {PAYMENT_DATA.map(p => (
            <div key={p.name} className="flex items-center gap-3">
              <span className="text-sm text-slate-600 w-20">{p.name}</span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${p.value}%`, backgroundColor: p.color }} />
              </div>
              <span className="text-sm font-semibold text-slate-700 w-8 text-right">{p.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
