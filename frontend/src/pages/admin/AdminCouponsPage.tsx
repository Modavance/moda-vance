import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Tag, Calendar, X } from 'lucide-react';
import { adminApi, unwrap } from '@/services/api';
import { formatDate, formatPrice } from '@/utils/formatters';
import type { Coupon } from '@/types';

function AddCouponModal({ onClose, onSave }: { onClose: () => void; onSave: (c: Omit<Coupon, 'expiresAt'> & { expiresAt: string }) => Promise<void> }) {
  const [form, setForm] = useState({ code: '', discount: 10, type: 'percent' as 'percent' | 'fixed', minOrder: 0, expiresAt: '2027-12-31' });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.code.trim()) return;
    setSaving(true);
    await onSave({ ...form, code: form.code.toUpperCase().trim() });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Create Coupon</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase">Coupon Code</label>
            <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="e.g. SUMMER20"
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-mono font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase">Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as 'percent' | 'fixed' })}
                className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="percent">Percentage (%)</option>
                <option value="fixed">Fixed ($)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase">Discount Value</label>
              <input type="number" value={form.discount} onChange={e => setForm({ ...form, discount: Number(e.target.value) })}
                className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase">Min. Order ($)</label>
              <input type="number" value={form.minOrder} onChange={e => setForm({ ...form, minOrder: Number(e.target.value) })}
                className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase">Expires</label>
              <input type="date" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })}
                className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-800">
            <strong>{form.code || 'CODE'}</strong> — {form.type === 'percent' ? `${form.discount}% off` : `$${form.discount} off`}
            {form.minOrder > 0 && ` on orders over ${formatPrice(form.minOrder)}`}
          </div>
          <button onClick={handleSave} disabled={saving || !form.code}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50">
            {saving ? 'Creating...' : 'Create Coupon'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminCouponsPage() {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);

  const { data: coupons = [] } = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const res = await adminApi.get('/coupons');
      return unwrap<Coupon[]>(res);
    },
  });

  const handleAdd = async (coupon: Omit<Coupon, 'expiresAt'> & { expiresAt: string }) => {
    await adminApi.post('/coupons', coupon);
    queryClient.invalidateQueries({ queryKey: ['coupons'] });
  };

  const handleDelete = async (code: string) => {
    if (confirm(`Delete coupon ${code}?`)) {
      await adminApi.delete(`/coupons/${code}`);
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Coupons</h1>
          <p className="text-slate-500 text-sm mt-1">{coupons.length} active coupons</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all">
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {coupons.map((coupon) => {
          const isExpired = new Date(coupon.expiresAt) < new Date();
          return (
            <div key={coupon.code} className={`bg-white rounded-2xl border p-5 relative overflow-hidden ${isExpired ? 'border-slate-200 opacity-60' : 'border-slate-100'}`}>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-slate-50 rounded-r-full border-r border-y border-slate-100" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-slate-50 rounded-l-full border-l border-y border-slate-100" />
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center"><Tag className="w-4 h-4 text-blue-600" /></div>
                  <div>
                    <p className="font-black text-slate-900 tracking-wider text-lg font-mono">{coupon.code}</p>
                    <p className="text-xs text-slate-400">{coupon.type === 'percent' ? 'Percentage' : 'Fixed'} discount</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(coupon.code)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="text-center py-4 border-t border-b border-dashed border-slate-200 mb-4">
                <span className="text-3xl font-black text-blue-600">{coupon.type === 'percent' ? `${coupon.discount}%` : `$${coupon.discount}`}</span>
                <p className="text-sm text-slate-500 font-medium mt-0.5">{coupon.type === 'percent' ? 'off total order' : 'off your order'}</p>
              </div>
              <div className="flex flex-col gap-1.5 text-xs text-slate-500">
                {coupon.minOrder > 0 && <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-300" />Min. order: {formatPrice(coupon.minOrder)}</div>}
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />Expires: {formatDate(coupon.expiresAt)}
                  {isExpired && <span className="ml-1 text-red-500 font-semibold">(Expired)</span>}
                </div>
              </div>
            </div>
          );
        })}
        <button onClick={() => setShowAdd(true)}
          className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl min-h-[180px] flex flex-col items-center justify-center gap-3 hover:border-blue-300 hover:bg-blue-50 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center group-hover:border-blue-300"><Plus className="w-5 h-5 text-slate-400 group-hover:text-blue-500" /></div>
          <p className="text-sm font-medium text-slate-400 group-hover:text-blue-500">New Coupon</p>
        </button>
      </div>

      {showAdd && <AddCouponModal onClose={() => setShowAdd(false)} onSave={handleAdd} />}
    </div>
  );
}
