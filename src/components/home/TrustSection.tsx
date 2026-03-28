import { Shield, Truck, RotateCcw, Lock, Clock, HeadphonesIcon } from 'lucide-react';

const TRUST_ITEMS = [
  {
    icon: Shield,
    title: '100% Authentic',
    description: 'Genuine pharmaceutical-grade product sourced directly from licensed distributors. Every batch verified.',
  },
  {
    icon: Truck,
    title: 'Fast & Discreet',
    description: 'Ships within 48* hours in plain, unmarked packaging. No reference to product contents on the label.',
  },
  {
    icon: RotateCcw,
    title: 'Money-Back Guarantee',
    description: 'Not satisfied? We\'ll reship or refund, no questions asked. Your satisfaction is our priority.',
  },
  {
    icon: Lock,
    title: 'Secure Checkout',
    description: '256-bit SSL encryption protects every transaction. We accept Bitcoin, Ethereum, Zelle, and more.',
  },
  {
    icon: Clock,
    title: '99% Delivery Rate',
    description: 'Industry-leading delivery success rate. We\'ve shipped thousands of packages across the US.',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Our customer support team responds within 2 hours to any question, any time of day.',
  },
];

export function TrustSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest">Our Promise</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3">
            Why Customers Worldwide Choose ModaVance
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {TRUST_ITEMS.map((item) => (
            <div key={item.title} className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-navy-900 flex items-center justify-center shrink-0 bg-slate-900">
                <item.icon className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
