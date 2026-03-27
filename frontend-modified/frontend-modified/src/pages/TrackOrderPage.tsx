import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ArrowRight, Package } from 'lucide-react';

export function TrackOrderPage() {
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = input.trim();
    if (id) navigate(`/orders/${id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-slate-900 text-white py-14">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 mb-5">
            <Search className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Track Your Order</h1>
          <p className="text-slate-400 text-lg">
            Enter your order ID to see the current status — no account needed.
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">
        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Order ID
          </label>
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. ORD-1718123456789-ABC12"
              className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:font-sans placeholder:text-slate-400"
              autoFocus
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-40 transition-colors flex items-center gap-2 shrink-0"
            >
              <ArrowRight className="w-4 h-4" />
              Track
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Your order ID was sent to your email and shown on the confirmation page.
          </p>
        </form>

        {/* Help */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3">
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Where is my order ID?</p>
              <p className="text-xs text-slate-500 mt-0.5">
                It looks like <span className="font-mono text-slate-700">ORD-1718123456789-ABC12</span>.
                Check your confirmation email or the page shown after placing your order.
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-slate-400 mt-8">
          Have an account?{' '}
          <Link to="/account" className="text-blue-600 font-medium hover:underline">
            View all orders in My Account →
          </Link>
        </p>
      </div>
    </div>
  );
}
