import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAdminStore, ADMIN_EMAIL } from '@/store/adminStore';
import { Logo } from '@/components/ui/Logo';

export function AdminLoginPage() {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const login = useAdminStore((s) => s.login);
  const navigate = useNavigate();

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  try {
    const res = await fetch('https://api.modavance.co/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data?.data?.token) {
      localStorage.setItem('adminToken', data.data.token);
      login(password);
      navigate('/admin');
    } else {
      setError('Invalid email or password');
    }
  } catch {
    setError('Connection error. Please try again.');
  }
};

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-slate-900 px-8 py-8 text-center">
            <Logo variant="light" size="md" className="justify-center mb-4" />
            <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Admin Panel</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
            <p className="text-slate-500 text-sm mb-6">Sign in to access the admin dashboard</p>

            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <Lock className="w-4 h-4" />
                Sign In to Admin
              </button>
            </form>

            <div className="mt-5 p-3 bg-slate-50 rounded-xl text-xs text-slate-500 border border-slate-100">
              <strong>Demo credentials:</strong><br />
              Email: admin@modavance.com<br />
              Password: admin123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
