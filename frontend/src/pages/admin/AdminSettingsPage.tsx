import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Save, Mail, CreditCard } from 'lucide-react';
import { adminApi, unwrap } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type SettingsMap = Record<string, string>;

export function AdminSettingsPage() {
  const qc = useQueryClient();
  const [values, setValues] = useState<SettingsMap>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { data } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const res = await adminApi.get('/admin/settings');
      return unwrap<Record<string, string>>(res);
    },
  });

  useEffect(() => { if (data) setValues(data); }, [data]);

  const set = (key: string, value: string) => setValues(v => ({ ...v, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.put('/admin/settings', { settings: values });
      qc.invalidateQueries({ queryKey: ['admin-settings'] });
      qc.invalidateQueries({ queryKey: ['settings'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Payment configuration and contact information</p>
        </div>
        <Button onClick={handleSave} loading={saving}><Save className="w-4 h-4" />{saved ? 'Saved!' : 'Save Changes'}</Button>
      </div>

      {/* Contact info */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center"><Mail className="w-4 h-4 text-blue-600" /></div>
          <div><h2 className="font-bold text-slate-900">Contact Information</h2><p className="text-xs text-slate-400">Displayed on Contact page and in emails</p></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Support Email" type="email" value={values['contact.email'] ?? ''} onChange={e => set('contact.email', e.target.value)} placeholder="support@modavance.com" />
          <Input label="Response Time" value={values['contact.response_time'] ?? ''} onChange={e => set('contact.response_time', e.target.value)} placeholder="Within 2 hours, 7 days a week" />
          <div className="md:col-span-2">
            <Input label="Phone (optional)" value={values['contact.phone'] ?? ''} onChange={e => set('contact.phone', e.target.value)} placeholder="+1 (555) 000-0000" />
          </div>
        </div>
      </div>

      {/* Bitcoin */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center"><span className="text-amber-600 font-bold text-sm">₿</span></div>
          <div><h2 className="font-bold text-slate-900">Bitcoin (BTC)</h2><p className="text-xs text-slate-400">Wallet address shown in order confirmation emails</p></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2"><Input label="Bitcoin Wallet Address" value={values['payment.bitcoin.wallet'] ?? ''} onChange={e => set('payment.bitcoin.wallet', e.target.value)} placeholder="bc1q..." /></div>
          <Input label="Discount (%)" type="number" value={values['payment.bitcoin.discount'] ?? '15'} onChange={e => set('payment.bitcoin.discount', e.target.value)} />
        </div>
      </div>

      {/* Ethereum */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center"><span className="text-purple-600 font-bold text-sm">Ξ</span></div>
          <div><h2 className="font-bold text-slate-900">Ethereum (ETH)</h2><p className="text-xs text-slate-400">Wallet address shown in order confirmation emails</p></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2"><Input label="Ethereum Wallet Address" value={values['payment.ethereum.wallet'] ?? ''} onChange={e => set('payment.ethereum.wallet', e.target.value)} placeholder="0x..." /></div>
          <Input label="Discount (%)" type="number" value={values['payment.ethereum.discount'] ?? '15'} onChange={e => set('payment.ethereum.discount', e.target.value)} />
        </div>
      </div>

      {/* Card Payment */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center"><CreditCard className="w-4 h-4 text-blue-600" /></div>
          <div><h2 className="font-bold text-slate-900">Card Payment</h2><p className="text-xs text-slate-400">Instructions shown in order confirmation emails</p></div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Payment Instructions</label>
            <textarea rows={3} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              value={values['payment.card.instructions'] ?? ''} onChange={e => set('payment.card.instructions', e.target.value)} placeholder="Card payment instructions..." />
          </div>
        </div>
      </div>

      {/* PayPal */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center"><span className="text-blue-700 font-bold text-sm">P</span></div>
          <div><h2 className="font-bold text-slate-900">PayPal</h2><p className="text-xs text-slate-400">PayPal email or link shown in order confirmation emails</p></div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <Input label="PayPal Email or Link" value={values['payment.paypal.recipient'] ?? ''} onChange={e => set('payment.paypal.recipient', e.target.value)} placeholder="payments@modavance.com" />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Additional Instructions</label>
            <textarea rows={2} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              value={values['payment.paypal.instructions'] ?? ''} onChange={e => set('payment.paypal.instructions', e.target.value)} placeholder="Send as Friends & Family..." />
          </div>
        </div>
      </div>

      <div className="flex justify-end pb-4">
        <Button onClick={handleSave} loading={saving} size="lg"><Save className="w-4 h-4" />{saved ? 'Saved!' : 'Save All Settings'}</Button>
      </div>
    </div>
  );
}
