import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Mail, Calendar, Award, ShoppingBag, Users } from 'lucide-react';
import { adminApi, unwrap } from '@/services/api';
import { formatDate, formatPrice } from '@/utils/formatters';

interface CustomerSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  loyaltyPoints: number;
  orderCount: number;
  totalSpent: number;
}

export function AdminCustomersPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'spent' | 'orders' | 'joined'>('joined');

  const { data: customers = [] } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: async () => {
      const res = await adminApi.get('/admin/customers');
      return unwrap<CustomerSummary[]>(res);
    },
  });

  const filtered = customers
    .filter(c => {
      if (!search) return true;
      const q = search.toLowerCase();
      return c.firstName.toLowerCase().includes(q) || c.lastName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === 'spent') return b.totalSpent - a.totalSpent;
      if (sortBy === 'orders') return b.orderCount - a.orderCount;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgLTV = customers.length > 0 ? totalRevenue / customers.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
          <p className="text-slate-500 text-sm mt-1">{customers.length} registered customers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Customers', value: customers.length.toLocaleString(), icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
          { label: 'Avg. Lifetime Value', value: formatPrice(avgLTV), icon: Award, color: 'bg-amber-50 text-amber-600' },
          { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: Calendar, color: 'bg-emerald-50 text-emerald-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}><s.icon className="w-5 h-5" /></div>
            <div><p className="text-xl font-bold text-slate-900">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..."
            className="flex-1 text-sm text-slate-700 outline-none placeholder:text-slate-400" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Sort by:</span>
          {(['joined', 'spent', 'orders'] as const).map(s => (
            <button key={s} onClick={() => setSortBy(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${sortBy === s ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {s === 'spent' ? 'Total Spent' : s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Email</th>
                <th className="px-5 py-3.5">Joined</th>
                <th className="px-5 py-3.5">Orders</th>
                <th className="px-5 py-3.5">Total Spent</th>
                <th className="px-5 py-3.5">Loyalty Pts</th>
                <th className="px-5 py-3.5">Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-16 text-center">
                  <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-400 font-medium">No customers yet</p>
                </td></tr>
              ) : filtered.map(customer => {
                const tier = customer.totalSpent >= 500 ? { label: 'Gold', cls: 'bg-amber-100 text-amber-700' }
                  : customer.totalSpent >= 100 ? { label: 'Silver', cls: 'bg-slate-100 text-slate-600' }
                  : { label: 'Bronze', cls: 'bg-orange-100 text-orange-700' };
                return (
                  <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{customer.firstName[0]}{customer.lastName[0]}</div>
                        <span className="font-semibold text-slate-900">{customer.firstName} {customer.lastName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4"><a href={`mailto:${customer.email}`} className="text-blue-600 hover:underline flex items-center gap-1 text-xs"><Mail className="w-3 h-3" />{customer.email}</a></td>
                    <td className="px-5 py-4 text-xs text-slate-500">{formatDate(customer.createdAt)}</td>
                    <td className="px-5 py-4 font-semibold text-slate-900">{customer.orderCount}</td>
                    <td className="px-5 py-4 font-bold text-slate-900">{formatPrice(customer.totalSpent)}</td>
                    <td className="px-5 py-4 text-xs font-semibold text-slate-700">{customer.loyaltyPoints.toLocaleString()}</td>
                    <td className="px-5 py-4"><span className={`px-2.5 py-1 text-xs font-bold rounded-full ${tier.cls}`}>{tier.label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
