import { useQuery } from '@tanstack/react-query';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';
import { DollarSign, ShoppingBag, Users, TrendingUp, Package, Clock } from 'lucide-react';
import { adminApi, unwrap } from '@/services/api';
import { normalizeOrder } from '@/utils/normalizers';
import { formatPrice, formatDate } from '@/utils/formatters';
import type { Order, OrderStatus } from '@/types';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700', confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700', shipped: 'bg-cyan-100 text-cyan-700',
  delivered: 'bg-emerald-100 text-emerald-700', cancelled: 'bg-red-100 text-red-700',
};

const PRODUCT_PIE_DATA = [
  { name: 'Modalert 200', value: 38, color: '#2563eb' },
  { name: 'Waklert 150',  value: 27, color: '#7c3aed' },
  { name: 'Modvigil 200', value: 20, color: '#059669' },
  { name: 'Artvigil 150', value: 11, color: '#d97706' },
  { name: 'Starter Pack', value: 4,  color: '#dc2626' },
];

const CUSTOM_TOOLTIP = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-sm">
        <p className="font-semibold text-slate-700 mb-1">{label}</p>
        <p className="text-blue-600 font-bold">{formatPrice(payload[0]?.value ?? 0)}</p>
      </div>
    );
  }
  return null;
};

export function AdminDashboard() {
  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const res = await adminApi.get('/admin/orders');
      return unwrap<Order[]>(res).map(normalizeOrder);
    },
  });
  const { data: customers = [] } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: async () => {
      const res = await adminApi.get('/admin/customers');
      return unwrap<{ id: string }[]>(res);
    },
  });

  const activeOrders = orders.filter(o => o.status !== 'cancelled');

  const totalRevenue = activeOrders.reduce((s, o) => s + o.total, 0);
  const totalOrders = activeOrders.length;
  const totalCustomers = customers.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const pendingCount = activeOrders.filter(o => o.status === 'pending').length;

  const revenueData = (() => {
    const days: { date: string; revenue: number; orders: number }[] = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const dayOrders = activeOrders.filter(o => {
        const od = new Date(o.createdAt);
        return od.getDate() === d.getDate() && od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
      });
      days.push({ date: dateStr, revenue: dayOrders.reduce((s, o) => s + o.total, 0), orders: dayOrders.length });
    }
    return days;
  })();

  const recentOrders = [...activeOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const STATS = [
    { label: 'Total Revenue',    value: formatPrice(totalRevenue),      icon: DollarSign,  color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Orders',     value: totalOrders.toLocaleString(),   icon: ShoppingBag, color: 'bg-purple-50 text-purple-600' },
    { label: 'Customers',        value: totalCustomers.toLocaleString(),icon: Users,       color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Avg. Order Value', value: formatPrice(avgOrderValue),     icon: TrendingUp,  color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-slate-900">Dashboard</h1><p className="text-slate-500 text-sm mt-1">Overview of your store performance</p></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {STATS.map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}><stat.icon className="w-5 h-5" /></div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div><h2 className="font-bold text-slate-900">Revenue (Last 30 Days)</h2><p className="text-sm text-slate-400 mt-0.5">Daily revenue overview</p></div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} /><stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval={6} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CUSTOM_TOOLTIP />} />
              <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="font-bold text-slate-900 mb-1">Sales by Product</h2>
          <p className="text-sm text-slate-400 mb-4">Distribution estimate</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={PRODUCT_PIE_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {PRODUCT_PIE_DATA.map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={v => [`${v}%`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {PRODUCT_PIE_DATA.map(item => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} /><span className="text-slate-600">{item.name}</span></div>
                <span className="font-semibold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="font-bold text-slate-900 mb-1">Orders per Day</h2>
          <p className="text-sm text-slate-400 mb-4">Last 7 days</p>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={revenueData.slice(-7)} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="orders" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-900">Recent Orders</h2>
            <a href="/admin/orders" className="text-xs text-blue-600 font-semibold hover:underline">View all →</a>
          </div>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8"><Package className="w-8 h-8 text-slate-200 mx-auto mb-2" /><p className="text-slate-400 text-sm">No orders yet</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide border-b border-slate-100">
                  <th className="pb-3 pr-4">Order</th><th className="pb-3 pr-4">Customer</th><th className="pb-3 pr-4">Date</th><th className="pb-3 pr-4">Amount</th><th className="pb-3">Status</th>
                </tr></thead>
                <tbody className="divide-y divide-slate-50">
                  {recentOrders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 pr-4 font-mono text-xs font-semibold text-slate-700">{order.id}</td>
                      <td className="py-3 pr-4 font-medium text-slate-900 text-xs">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</td>
                      <td className="py-3 pr-4 text-slate-500 text-xs">{formatDate(order.createdAt)}</td>
                      <td className="py-3 pr-4 font-bold text-slate-900">{formatPrice(order.total)}</td>
                      <td className="py-3"><span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${STATUS_COLORS[order.status as OrderStatus]}`}>{order.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Package,   label: 'Products in Stock', value: '5',                     color: 'text-blue-600 bg-blue-50' },
          { icon: Clock,     label: 'Pending Orders',    value: pendingCount.toString(),  color: 'text-amber-600 bg-amber-50' },
          { icon: Users,     label: 'Total Customers',   value: totalCustomers.toString(),color: 'text-emerald-600 bg-emerald-50' },
          { icon: TrendingUp,label: 'Total Orders',      value: totalOrders.toString(),   color: 'text-purple-600 bg-purple-50' },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}><item.icon className="w-5 h-5" /></div>
            <div><p className="text-lg font-bold text-slate-900">{item.value}</p><p className="text-xs text-slate-500">{item.label}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}
