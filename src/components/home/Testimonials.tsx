import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Alex T.',
    role: 'Software Engineer, Google',
    rating: 5,
    text: 'I was skeptical at first, but after 3 months using Modalert on demanding sprint days, I can honestly say it\'s the single most impactful productivity tool I\'ve found. The focus is real, the quality is consistent, and the shipping is always fast.',
    avatar: 'AT',
  },
  {
    name: 'Dr. Rachel M.',
    role: 'Emergency Physician',
    rating: 5,
    text: 'Working 36-hour shifts requires a different level of mental endurance. Waklert keeps me sharp and decision-ready throughout. The armodafinil formulation is noticeably cleaner than regular modafinil — no mid-shift decline.',
    avatar: 'RM',
  },
  {
    name: 'Marcus B.',
    role: 'Hedge Fund Analyst',
    rating: 5,
    text: 'Our entire research team has tested multiple nootropics. Nothing comes close to modafinil for sustained analytical work. ModaVance\'s quality is top-notch and their customer service resolved my one question within hours.',
    avatar: 'MB',
  },
  {
    name: 'Jessica K.',
    role: 'Law Student, Harvard',
    rating: 5,
    text: 'The starter pack was perfect for finding my ideal product. I landed on Artvigil at half-dose and it\'s been transformative for exam prep. No anxiety, no jitters — just clean, sustained focus for 8+ hours.',
    avatar: 'JK',
  },
  {
    name: 'Tyler N.',
    role: 'Entrepreneur & Author',
    rating: 5,
    text: 'I\'ve written about nootropics extensively and ModaVance is my recommended source. Consistent product quality, discreet packaging, and competitive pricing. I\'ve reordered 6+ times with zero issues.',
    avatar: 'TN',
  },
  {
    name: 'Sarah L.',
    role: 'Air Traffic Controller',
    rating: 5,
    text: 'Safety in my profession is non-negotiable. Modafinil has a 30-year safety record and it\'s the only nootropic I trust for critical shifts. ModaVance delivers exactly what they promise — every single time.',
    avatar: 'SL',
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-widest">Customer Reviews</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 mb-4">
            Trusted by High Performers Worldwide
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="text-slate-600 font-semibold">4.8 out of 5</span>
            <span className="text-slate-400">· 3,500+ verified reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-shadow">
              <Quote className="w-8 h-8 text-blue-100 mb-4" />
              <p className="text-slate-600 text-sm leading-relaxed mb-6">{t.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
                <div className="ml-auto flex">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

