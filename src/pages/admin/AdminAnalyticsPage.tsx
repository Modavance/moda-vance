import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { Users, ShoppingBag, DollarSign } from 'lucide-react';
import { formatPrice } from '@/utils/formatters';

// Generate 12-month data
const MONTHLY_DATA = [
  { month: 'Jan', revenue: 18400, orders: 142, customers: 98 },
  { month: 'Feb', revenue: 22100, orders: 167, customers: 118 },
  { month: 'Mar', revenue: 19800, orders: 151, customers: 104 },
  { month: 'Apr', revenue: 25600, orders: 198, customers: 143 },
  { month: 'May', revenue: 28900, orders: 221, customers: 167 },
  { month: 'Jun', revenue: 31200, orders: 245, customers: 189 },
  { month: 'Jul', revenue: 29400, orders: 229, customers: 172 },
  { month: 'Aug', revenue: 34800, orders: 271, customers: 208 },
  { month: 'Sep', revenue: 38100, orders: 296, customers: 234 },
  { month: 'Oct', revenue: 42300, orders: 332, customers: 265 },
  { month: 'Nov', revenue: 51200, orders: 401, customers: 318 },
  { month: 'Dec', revenue: 58900, orders: 467, customers: 381 },
];

const PAYMENT_DATA = [
  { name: 'Bitcoin', value: 42, color: '#f59e0b' },
  { name: 'Ethereum', value: 28, color: '#6366f1' },
  { name: 'Zelle', value: 18, color: '#10b981' },
  { name: 'Cash Mail', value: 12, color: '#64748b' },
];

const GEO_DATA = [
  { state: 'California', orders: 412, revenue: 52840 },
  { state: 'New York', orders: 287, revenue: 36736 },
  { state: 'Texas', orders: 241, revenue: 30848 },
  { state: 'Florida', orders: 198, revenue: 25344 },
  { state: 'Illinois', orders: 156, revenue: 19968 },
  { state: 'Washington', orders: 134, revenue: 17152 },
  { state: 'Massachusetts', orders: 121, revenue: 15488 },
  { state: 'Colorado', orders: 98, revenue: 12544 },
];

export function AdminAnalyticsPage() {
  const totalRevenue = MONTHLY_DATA.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = MONTHLY_DATA.reduce((s, d) => s + d.orders, 0);
  const totalCustomers = MONTHLY_DATA.reduce((s, d) => s + d.customers, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500 text-sm mt-1">Year-to-date performance overview</p>
      </div>

      {/* YTD Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'YTD Revenue', value: formatPrice(totalRevenue), icon: DollarSign, color: 'bg-blue-50 text-blue-600', change: '+43.2%' },
          { label: 'YTD Orders', value: totalOrders.toLocaleString(), icon: ShoppingBag, color: 'bg-purple-50 text-purple-600', change: '+38.9%' },
          { label: 'YTD New Customers', value: totalCustomers.toLocaleString(), icon: Users, color: 'bg-emerald-50 text-emerald-600', change: '+52.1%' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className="text-xs font-semibold text-emerald-600 mt-0.5">{s.change} vs last year</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue trend */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-slate-900">Monthly Revenue & Orders</h2>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-600" /><span className="text-slate-500">Revenue</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-purple-500" /><span className="text-slate-500">Orders</span></div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={MONTHLY_DATA} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
            <Tooltip formatter={(v, name) => [name === 'revenue' ? formatPrice(v as number) : v, name === 'revenue' ? 'Revenue' : 'Orders']} />
            <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5} dot={{ fill: '#2563eb', r: 3 }} />
            <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: '#7c3aed', r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Payment methods + Geo */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Payment breakdown */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="font-bold text-slate-900 mb-5">Payment Methods</h2>
          <div className="space-y-3">
            {PAYMENT_DATA.map((p) => (
              <div key={p.name}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium text-slate-700">{p.name}</span>
                  <span className="font-bold text-slate-900">{p.value}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${p.value}%`, backgroundColor: p.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top states */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="font-bold text-slate-900 mb-5">Top States by Revenue</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={GEO_DATA.slice(0, 6)} layout="vertical" margin={{ top: 0, right: 0, left: 60, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="state" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
              <Tooltip formatter={(v) => [formatPrice(v as number), 'Revenue']} />
              <Bar dataKey="revenue" fill="#2563eb" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Customer growth */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-bold text-slate-900 mb-5">New Customer Acquisition</h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={MONTHLY_DATA} margin={{ top: 0, right: 0, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar dataKey="customers" fill="#10b981" radius={[4, 4, 0, 0]} name="New Customers" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
