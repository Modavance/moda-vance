import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section className="py-20 bg-blue-600">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Mail className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">
          Get 10% Off Your First Order
        </h2>
        <p className="text-blue-100 text-lg mb-8">
          Subscribe for exclusive deals, new product alerts, and expert guides on cognitive enhancement.
        </p>

        {submitted ? (
          <div className="flex items-center justify-center gap-3 bg-white/20 rounded-2xl p-6">
            <CheckCircle className="w-6 h-6 text-white" />
            <div className="text-left">
              <p className="text-white font-bold">You're in! Check your email.</p>
              <p className="text-blue-100 text-sm">Your discount code: <strong>WELCOME10</strong></p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-5 py-3 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <Button type="submit" variant="gold" size="lg">
              Get 10% Off
            </Button>
          </form>
        )}

        <p className="text-blue-200 text-xs mt-4">
          No spam. Unsubscribe anytime. By subscribing you agree to our Privacy Policy.
        </p>
      </div>
    </section>
  );
}
