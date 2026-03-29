import { useState } from 'react';
import { Lock, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';

export function AdminProfilePage() {
  const { email, changePassword, changeEmail } = useAdminStore();

  const [emailForm, setEmailForm] = useState({ email });
  const [emailMsg, setEmailMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [passForm, setPassForm] = useState({ current: '', next: '', confirm: '' });
  const [passMsg, setPassMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleEmailSave = () => {
    if (!emailForm.email.includes('@')) {
      setEmailMsg({ type: 'error', text: 'Enter a valid email address.' });
      return;
    }
    changeEmail(emailForm.email);
    setEmailMsg({ type: 'success', text: 'Email updated successfully.' });
    setTimeout(() => setEmailMsg(null), 3000);
  };

  const handlePasswordSave = () => {
    if (!passForm.current) {
      setPassMsg({ type: 'error', text: 'Enter your current password.' });
      return;
    }
    if (passForm.next.length < 6) {
      setPassMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (passForm.next !== passForm.confirm) {
      setPassMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    const ok = changePassword(passForm.current, passForm.next);
    if (!ok) {
      setPassMsg({ type: 'error', text: 'Current password is incorrect.' });
      return;
    }
    setPassMsg({ type: 'success', text: 'Password changed successfully.' });
    setPassForm({ current: '', next: '', confirm: '' });
    setTimeout(() => setPassMsg(null), 3000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your admin account credentials</p>
      </div>

      {/* Avatar / info card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
          A
        </div>
        <div>
          <p className="font-bold text-slate-900 text-lg">Admin</p>
          <p className="text-slate-500 text-sm">{email}</p>
          <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
            Super Admin
          </span>
        </div>
      </div>

      {/* Email */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
            <Mail className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="font-semibold text-slate-900">Email Address</h2>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase">Email</label>
          <input
            type="email"
            value={emailForm.email}
            onChange={(e) => setEmailForm({ email: e.target.value })}
            className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {emailMsg && (
          <div className={`flex items-center gap-2 text-sm rounded-xl px-3 py-2 ${
            emailMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
          }`}>
            {emailMsg.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            {emailMsg.text}
          </div>
        )}

        <button
          onClick={handleEmailSave}
          className="bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Save Email
        </button>
      </div>

      {/* Password */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
            <Lock className="w-4 h-4 text-amber-600" />
          </div>
          <h2 className="font-semibold text-slate-900">Change Password</h2>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase">Current Password</label>
            <input
              type="password"
              value={passForm.current}
              onChange={(e) => setPassForm({ ...passForm, current: e.target.value })}
              placeholder="••••••••"
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase">New Password</label>
            <input
              type="password"
              value={passForm.next}
              onChange={(e) => setPassForm({ ...passForm, next: e.target.value })}
              placeholder="Min. 6 characters"
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase">Confirm New Password</label>
            <input
              type="password"
              value={passForm.confirm}
              onChange={(e) => setPassForm({ ...passForm, confirm: e.target.value })}
              placeholder="Repeat new password"
              className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {passMsg && (
          <div className={`flex items-center gap-2 text-sm rounded-xl px-3 py-2 ${
            passMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
          }`}>
            {passMsg.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            {passMsg.text}
          </div>
        )}

        <button
          onClick={handlePasswordSave}
          className="bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Change Password
        </button>
      </div>
    </div>
  );
}
