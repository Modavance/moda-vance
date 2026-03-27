import { useQuery } from '@tanstack/react-query';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';
import {
  DollarSign, ShoppingBag, Users, TrendingUp, ArrowUpRight,
  ArrowDownRight, Package, Clock,
} from 'lucide-react';
import { db } from '@/db/database';
import { formatPrice } from '@/utils/formatters';

// Generate mock revenue data for last 30 days
function generateRevenueData() {
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: Math.floor(Math.random() * 2000 + 500),
      orders: Math.floor(Math.random() * 15 + 3),
    });
  }
  return data;
}

const REVENUE_DATA = generateRevenueData();

const PRODUCT_PIE_DATA = [
  { name: 'Modalert 200', value: 38, color: '#2563eb' },
  { name: 'Waklert 150', value: 27, color: '#7c3aed' },
  { name: 'Modvigil 200', value: 20, color: '#059669' },
  { name: 'Artvigil 150', value: 11, color: '#d97706' },
  { name: 'Starter Pack', value: 4, color: '#dc2626' },
];

const RECENT_ORDERS_MOCK = [
  { id: 'ORD-1001', customer: 'Alex T.', amount: 139, status: 'delivered', product: 'Modalert 200mg' },
  { id: 'ORD-1002', customer: 'Sarah M.', amount: 79, status: 'shipped', product: 'Waklert 150mg' },
  { id: 'ORD-1003', customer: 'David L.', amount: 249, status: 'processing', product: 'Modalert 200mg' },
  { id: 'ORD-1004', customer: 'Emma R.', amount: 59, status: 'confirmed', product: 'Artvigil 150mg' },
  { id: 'ORD-1005', customer: 'Chris B.', amount: 59, status: 'pending', product: 'Starter Pack' },
];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-cyan-100 text-cyan-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
};

const CUSTOM_TOOLTIP = ({ active, payload, label }: { active?: boolean; payload?: {value: number}[]; label?: string }) => {
  if (active && payload && payload.length) {
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
  const { data: orders } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => db.orders.toArray(),
  });
  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => db.users.toArray(),
  });

  const totalRevenue = (orders ?? []).reduce((s, o) => s + o.total, 0) + 48234;
  const totalOrders = (orders?.length ?? 0) + 1847;
  const totalCustomers = (users?.length ?? 0) + 50123;

  const STATS = [
    {
      label: 'Total Revenue',
      value: formatPrice(totalRevenue),
      change: '+12.5%',
      up: true,
      icon: DollarSign,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Total Orders',
      value: totalOrders.toLocaleString(),
      change: '+8.1%',
      up: true,
      icon: ShoppingBag,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Customers',
      value: totalCustomers.toLocaleString(),
      change: '+15.3%',
      up: true,
      icon: Users,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Avg. Order Value',
      value: formatPrice(126),
      change: '-2.1%',
      up: false,
      icon: TrendingUp,
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Overview of your store performance</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                stat.up ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
              }`}>
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart + Pie chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Area chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-slate-900">Revenue (Last 30 Days)</h2>
              <p className="text-sm text-slate-400 mt-0.5">Daily revenue overview</p>
            </div>
            <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              ↑ 12.5% vs last month
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={REVENUE_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                tickLine={false}
                axisLine={false}
                interval={6}
              />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CUSTOM_TOOLTIP />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={2.5}
                fill="url(#revGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="font-bold text-slate-900 mb-1">Sales by Product</h2>
          <p className="text-sm text-slate-400 mb-4">All-time distribution</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={PRODUCT_PIE_DATA}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {PRODUCT_PIE_DATA.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {PRODUCT_PIE_DATA.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders bar chart + Recent orders */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Bar chart */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="font-bold text-slate-900 mb-1">Orders per Day</h2>
          <p className="text-sm text-slate-400 mb-4">Last 7 days</p>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={REVENUE_DATA.slice(-7)} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="orders" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent orders */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-900">Recent Orders</h2>
            <a href="/admin/orders" className="text-xs text-blue-600 font-semibold hover:underline">View all →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide border-b border-slate-100">
                  <th className="pb-3 pr-4">Order</th>
                  <th className="pb-3 pr-4">Customer</th>
                  <th className="pb-3 pr-4">Product</th>
                  <th className="pb-3 pr-4">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {RECENT_ORDERS_MOCK.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 pr-4 font-mono text-xs text-slate-500">{order.id}</td>
                    <td className="py-3 pr-4 font-medium text-slate-900">{order.customer}</td>
                    <td className="py-3 pr-4 text-slate-500 text-xs">{order.product}</td>
                    <td className="py-3 pr-4 font-bold text-slate-900">{formatPrice(order.amount)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Package, label: 'Products in Stock', value: '5', color: 'text-blue-600 bg-blue-50' },
          { icon: Clock, label: 'Pending Orders', value: '12', color: 'text-amber-600 bg-amber-50' },
          { icon: Users, label: 'New Customers (7d)', value: '243', color: 'text-emerald-600 bg-emerald-50' },
          { icon: TrendingUp, label: 'Conversion Rate', value: '3.2%', color: 'text-purple-600 bg-purple-50' },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">{item.value}</p>
              <p className="text-xs text-slate-500">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
