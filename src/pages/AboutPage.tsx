import { Link } from 'react-router-dom';
import { Shield, Award, Globe, Users, ArrowRight } from 'lucide-react';


const VALUES = [
  {
    icon: Shield,
    title: 'Authenticity First',
    desc: 'We source exclusively from licensed pharmaceutical manufacturers with verifiable supply chains. Every product is authentic or we don\'t sell it.',
  },
  {
    icon: Award,
    title: 'Quality Without Compromise',
    desc: 'We work only with WHO-GMP certified manufacturers. Each batch undergoes third-party testing for identity, potency, and purity.',
  },
  {
    icon: Globe,
    title: 'Education & Transparency',
    desc: 'We believe informed customers make better decisions. We publish detailed product information, dosing guides, and honest reviews.',
  },
  {
    icon: Users,
    title: 'Community First',
    desc: 'Our customer community is the heart of ModaVance. We listen, adapt, and continuously improve based on real customer feedback.',
  },
];

export function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="gradient-hero py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-sm font-semibold text-blue-400 uppercase tracking-widest">Our Story</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-6">
            We Started ModaVance Because We Needed It
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            Founded in 2019 by a group of biohackers, pharmacists, and tech professionals, ModaVance was born from personal experience with the challenges of sourcing high-quality cognitive enhancers in the US market.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest">Our Mission</span>
              <h2 className="text-3xl font-bold text-slate-900 mt-3 mb-5">
                Making Cognitive Excellence Accessible to Everyone
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                When Marcus Webb was working 80-hour weeks at his first startup, a friend recommended modafinil. The problem? Sourcing quality product was a minefield — sketchy vendors, inconsistent quality, zero customer service.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                We built ModaVance to be the source we wished existed: rigorous quality standards, transparent supply chain, expert guidance, and customer service that actually responds.
              </p>
              <div className="flex gap-8">
                {[
                  { value: '5+', label: 'Years in Business' },
                  { value: '50K+', label: 'Customers Served' },
                  { value: '99%', label: 'Delivery Success' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold text-blue-600">{stat.value}</p>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&q=80"
                alt="ModaVance team"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {VALUES.map((v) => (
              <div key={v.title} className="flex gap-5">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <v.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{v.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 bg-blue-600">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience the Difference?</h2>
          <p className="text-blue-100 mb-8">Join thousands of customers who've made ModaVance their trusted cognitive enhancement source.</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-amber-500 text-white px-8 py-4 text-lg font-semibold rounded-xl hover:bg-amber-600 active:scale-95 transition-all shadow-lg"
          >
            Shop Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

