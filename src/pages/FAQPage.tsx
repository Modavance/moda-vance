import { useState } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDown } from 'lucide-react';

const FAQ_SECTIONS = [
  {
    title: 'About Our Products',
    faqs: [
      { q: 'What is Modafinil and how does it work?', a: 'Modafinil is a wakefulness-promoting agent originally developed to treat narcolepsy. It works by inhibiting dopamine reuptake, resulting in clean, focused wakefulness without jitteriness or crashes.' },
      { q: 'What is the difference between Modafinil and Armodafinil?', a: 'Armodafinil contains only the R-enantiomer — more potent and longer-lasting (15+ hours vs 12 hours), with a more consistent effect throughout the day.' },
      { q: 'What is the difference between Modalert and Modvigil?', a: 'Both contain 200mg Modafinil. Modalert (Sun Pharma) is slightly stronger with faster onset. Modvigil (HAB Pharma) is smoother and more budget-friendly.' },
      { q: 'Is Modafinil safe?', a: 'Modafinil has over 30 years of clinical use and an excellent safety profile. Start with 100mg to assess your response. Consult a doctor if you have medical conditions.' },
      { q: 'Are your products genuine pharmaceutical grade?', a: 'Yes. We source from licensed distributors of Sun Pharmaceuticals and HAB Pharmaceuticals. All facilities are WHO-GMP certified.' },
    ],
  },
  {
    title: 'Ordering & Payment',
    faqs: [
      { q: 'What payment methods do you accept?', a: 'We accept Bitcoin (BTC) and Ethereum (ETH) with 15% automatic discount, plus PayPal and Credit/Debit Card at standard pricing.' },
      { q: 'Do I need a prescription?', a: 'No prescription required. We sell for research and educational purposes. We are not a licensed pharmacy and do not provide medical advice.' },
      { q: 'Is my personal information secure?', a: 'Yes. 256-bit SSL encryption, minimal data storage, never sold to third parties. For max privacy use Bitcoin or Ethereum.' },
      { q: 'Can I use a coupon code?', a: 'Yes! Use WELCOME10 for 10% off your first order. Sign up for our newsletter for exclusive promo codes.' },
    ],
  },
  {
    title: 'Shipping & Delivery',
    faqs: [
      { q: 'How long does shipping take?', a: 'Orders processed within 24h, shipped within 48h. Estimated delivery 4–12 business days depending on your region and dispatch center.' },
      { q: 'Is packaging discreet?', a: 'Yes, completely. Plain unmarked packaging, no company name or product reference on the outside.' },
      { q: 'Do you ship internationally?', a: 'Yes, worldwide. In case of customs seizure we reship free of charge — no questions asked.' },
      { q: 'What is your reshipment policy?', a: 'Contact us within 30 days of estimated delivery and we reship at no cost.' },
      { q: 'How do I track my order?', a: 'Tracking number sent by email once shipped. Also visible in your account page. Contact support@modavance.com if no tracking within 72h.' },
    ],
  },
  {
    title: 'Usage & Dosing',
    faqs: [
      { q: 'What is the recommended dose?', a: 'Modafinil: 100–200mg in the morning. Armodafinil: 75–150mg. Always start with the lower dose.' },
      { q: 'How often should I take Modafinil?', a: 'Maximum 3–4 days per week to maintain sensitivity and preserve natural sleep patterns.' },
      { q: 'What should I avoid while taking Modafinil?', a: 'Avoid taking after noon, combining with alcohol, and note that birth control pills may be less effective. Stay well hydrated.' },
    ],
  },
  {
    title: 'Support',
    faqs: [
      { q: 'How can I contact support?', a: 'Email support@modavance.com. We respond within 24 hours, 7 days a week. Include your order number for order questions.' },
      { q: 'What is your refund policy?', a: 'Contact us within 14 days of delivery. We offer reshipment, store credit, or refund depending on the case.' },
      { q: "I haven't received my order confirmation email. What should I do?", a: 'Check spam/junk folder. If not there, email support@modavance.com with your checkout email address.' },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-5 text-left gap-4"
      >
        <span className="font-semibold text-slate-900">{q}</span>
        <ChevronDown className={cn('w-5 h-5 text-slate-400 shrink-0 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="pb-5">
          <p className="text-slate-600 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-slate-400 text-lg">
            Everything you need to know about Modafinil, Armodafinil, and ordering from ModaVance.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        {FAQ_SECTIONS.map((section) => (
          <div key={section.title} className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-4 pb-4 border-b-2 border-blue-600">
              {section.title}
            </h2>
            <div className="bg-white rounded-2xl border border-slate-100 px-6">
              {section.faqs.map((faq) => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        ))}

        <div className="bg-blue-50 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Still have questions?</h3>
          <p className="text-slate-600 mb-6">Our support team responds within 24 hours, 7 days a week.</p>
          <a
            href="mailto:support@modavance.com"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
