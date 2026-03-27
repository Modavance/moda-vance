import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import { db } from '@/db/database';

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
  const { data: items = [] } = useQuery({
    queryKey: ['faq'],
    queryFn: () => db.faqItems.orderBy('order').toArray(),
  });

  const { data: settings = [] } = useQuery({
    queryKey: ['settings'],
    queryFn: () => db.settings.toArray(),
  });

  const settingsMap = Object.fromEntries(settings.map(s => [s.key, s.value]));
  const supportEmail = settingsMap['contact.email'] ?? 'support@modavance.com';

  // Group by section in order
  const sectionNames = [...new Set(items.map(i => i.section))];
  const sections = sectionNames.map(name => ({
    title: name,
    faqs: items.filter(i => i.section === name).sort((a, b) => a.order - b.order),
  }));

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-slate-400 text-lg">
            Everything you need to know about modafinil, armodafinil, and ordering from ModaVance.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        {sections.map((section) => (
          <div key={section.title} className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-4 pb-4 border-b-2 border-blue-600">
              {section.title}
            </h2>
            <div className="bg-white rounded-2xl border border-slate-100 px-6">
              {section.faqs.map((faq) => (
                <FAQItem key={faq.id} q={faq.question} a={faq.answer} />
              ))}
            </div>
          </div>
        ))}

        {sections.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <p>FAQ content is being updated. Check back soon.</p>
          </div>
        )}

        <div className="bg-blue-50 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Still have questions?</h3>
          <p className="text-slate-600 mb-6">Our support team responds within 2 hours, 7 days a week.</p>
          <a
            href={`mailto:${supportEmail}`}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
