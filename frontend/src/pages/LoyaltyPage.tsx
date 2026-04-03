import { Link } from 'react-router-dom';
import { Star, Gift, Zap, ChevronRight } from 'lucide-react';

const TIERS = [
  {
    name: 'Bronze',
    icon: '🥉',
    range: '$0 – $1,000',
    color: 'border-amber-200 bg-amber-50',
    headerColor: 'bg-amber-500',
    benefits: [
      '1 point per $1 spent',
      '200 points = $5 discount',
    ],
  },
  {
    name: 'Silver',
    icon: '🥈',
    range: '$1,000 – $3,000',
    color: 'border-slate-300 bg-slate-50',
    headerColor: 'bg-slate-400',
    benefits: [
      '1.2 points per $1 spent',
      '200 points = $7 discount',
      'Early access to new products',
    ],
  },
  {
    name: 'Gold',
    icon: '🥇',
    range: '$3,000+',
    color: 'border-yellow-300 bg-yellow-50',
    headerColor: 'bg-yellow-500',
    benefits: [
      '1.5 points per $1 spent',
      '200 points = $10 discount',
      '1 free strip with every order',
      'Exclusive 15% coupon every month',
    ],
  },
];

const STEPS = [
  { icon: Star, title: 'Create an account', desc: 'Start with 50 bonus points instantly.' },
  { icon: Zap, title: 'Place an order', desc: 'Earn points automatically on every purchase.' },
  { icon: Gift, title: 'Redeem', desc: 'Once you reach 200 points, unlock a discount code from your account.' },
];

const FAQS = [
  { q: 'When do I earn points?', a: 'Points are added automatically after each purchase. The amount depends on your tier.' },
  { q: 'How do I redeem?', a: 'Go to your account page, click "Redeem Points" and a discount code will be generated instantly and shown to you.' },
  { q: 'Do points expire?', a: 'No — your points never expire.' },
  { q: 'How do I move up a tier?', a: 'Tiers are based on your total amount spent. Once you cross the threshold, your tier upgrades automatically.' },
  { q: 'Can I use multiple discount codes?', a: 'One discount code per order. You can redeem multiple times as long as you have enough points.' },
];

export function LoyaltyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Star className="w-4 h-4" /> ModaVance Rewards
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Shop more. Earn more.<br />Save more.</h1>
          <p className="text-blue-100 text-lg mb-8">Every purchase brings you closer to exclusive benefits and bigger discounts.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors"
          >
            Join for free <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">

        {/* How it works */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mx-auto mb-3">{i + 1}</div>
                <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tiers */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">Membership Tiers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TIERS.map((tier) => (
              <div key={tier.name} className={`rounded-2xl border-2 overflow-hidden ${tier.color}`}>
                <div className={`${tier.headerColor} text-white px-6 py-4 text-center`}>
                  <div className="text-3xl mb-1">{tier.icon}</div>
                  <h3 className="text-xl font-bold">{tier.name}</h3>
                  <p className="text-white/80 text-sm mt-0.5">{tier.range} total spent</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-2.5">
                    {tier.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="text-green-500 font-bold mt-0.5">✓</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6">
                <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-500 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-blue-600 rounded-2xl p-10 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Ready to start earning?</h2>
          <p className="text-blue-100 mb-6">Create a free account and get 50 bonus points instantly.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors"
          >
            Create Account <ChevronRight className="w-4 h-4" />
          </Link>
        </section>

      </div>
    </div>
  );
}
