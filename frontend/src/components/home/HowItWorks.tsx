import { MousePointerClick, Package, Zap } from 'lucide-react';

const STEPS = [
  {
    icon: MousePointerClick,
    number: '01',
    title: 'Choose Your Product',
    description: 'Browse our catalog and select the Modafinil or Armodafinil product that fits your needs and budget. Not sure? Start with our Sample Pack.',
  },
  {
    icon: Package,
    number: '02',
    title: 'Secure Checkout',
    description: 'Complete your order using Bitcoin, Ethereum, Card, or Paypal transfer. Your data is protected with 256-bit SSL encryption. No prescription required.',
  },
  {
    icon: Zap,
    number: '03',
    title: 'Unlock Your Potential',
    description: 'Receive your discreet package super fast. Start with a half dose (100mg) to calibrate your response, then enjoy sustained cognitive enhancement.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-900/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-blue-400 uppercase tracking-widest">Simple Process</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">
            How It Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {STEPS.map((step, index) => (
            <div key={step.number} className="relative flex flex-col items-center text-center">
              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+3rem)] right-[-3rem] h-px bg-gradient-to-r from-blue-600/50 to-transparent" />
              )}

              {/* Icon */}
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-600/30">
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {step.number.replace('0', '')}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
