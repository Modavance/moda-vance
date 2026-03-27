import { Brain, Zap, Clock, Shield, Award, FlaskConical } from 'lucide-react';

const FEATURES = [
  {
    icon: Brain,
    title: 'Enhanced Cognitive Function',
    description: 'Clinically documented improvements in working memory, executive function, and decision-making speed.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Zap,
    title: 'Clean, Sustained Energy',
    description: 'No jitteriness, no crash. Experience 12–15 hours of smooth, focused wakefulness from a single dose.',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
  {
    icon: Clock,
    title: 'Long-Lasting Effects',
    description: 'A single morning dose provides all-day coverage without interfering with your natural sleep cycle.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: Shield,
    title: 'Pharmaceutical Grade',
    description: 'Every product manufactured in FDA-inspected, WHO-GMP certified facilities to the highest quality standards.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: Award,
    title: 'Trusted by Experts',
    description: 'The choice of Navy SEALs, air traffic controllers, Silicon Valley executives, and top-performing athletes.',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
  {
    icon: FlaskConical,
    title: 'Lab Verified Purity',
    description: 'Third-party tested for identity, potency, and purity. Certificates of Analysis available on request.',
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
  },
];

export function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest">Why ModaVance</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 mb-4">
            The Science of Peak Performance
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Modafinil and armodafinil are the world's most studied and trusted cognitive enhancers — and ModaVance delivers them at the highest quality available.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group p-6 rounded-2xl border border-slate-100 hover:border-blue-100 hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon className={`w-6 h-6 ${f.color}`} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
