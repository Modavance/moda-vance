import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, X, Save, ChevronUp, ChevronDown, RefreshCw } from 'lucide-react';
import { db } from '@/db/database';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { FAQItem } from '@/types';

const DEFAULT_FAQ: Omit<FAQItem, 'createdAt'>[] = [
  { id: 'f1',  section: 'About Our Products',  order: 1,  question: 'What is Modafinil and how does it work?', answer: 'Modafinil is a wakefulness-promoting agent originally developed to treat narcolepsy. It works by inhibiting dopamine reuptake, resulting in clean, focused wakefulness without jitteriness or crashes.' },
  { id: 'f2',  section: 'About Our Products',  order: 2,  question: 'What is the difference between Modafinil and Armodafinil?', answer: 'Armodafinil contains only the R-enantiomer — more potent and longer-lasting (15+ hours vs 12 hours), with a more consistent effect throughout the day.' },
  { id: 'f3',  section: 'About Our Products',  order: 3,  question: 'What is the difference between Modalert and Modvigil?', answer: 'Both contain 200mg Modafinil. Modalert (Sun Pharma) is slightly stronger with faster onset. Modvigil (HAB Pharma) is smoother and more budget-friendly.' },
  { id: 'f4',  section: 'About Our Products',  order: 4,  question: 'Is Modafinil safe?', answer: 'Modafinil has over 30 years of clinical use and an excellent safety profile. Start with 100mg to assess your response. Consult a doctor if you have medical conditions.' },
  { id: 'f5',  section: 'About Our Products',  order: 5,  question: 'Are your products genuine pharmaceutical grade?', answer: 'Yes. We source from licensed distributors of Sun Pharmaceuticals and HAB Pharmaceuticals. All facilities are WHO-GMP certified.' },
  { id: 'f6',  section: 'Ordering & Payment', order: 1,  question: 'What payment methods do you accept?', answer: 'We accept Bitcoin (BTC) and Ethereum (ETH) with 15% automatic discount, plus PayPal and Credit/Debit Card at standard pricing.' },
  { id: 'f7',  section: 'Ordering & Payment', order: 2,  question: 'Do I need a prescription?', answer: 'No prescription required. We sell for research and educational purposes. We are not a licensed pharmacy and do not provide medical advice.' },
  { id: 'f8',  section: 'Ordering & Payment', order: 3,  question: 'Is my personal information secure?', answer: 'Yes. 256-bit SSL encryption, minimal data storage, never sold to third parties. For max privacy use Bitcoin or Ethereum.' },
  { id: 'f9',  section: 'Ordering & Payment', order: 4,  question: 'Can I use a coupon code?', answer: 'Yes! Use WELCOME10 for 10% off your first order. Sign up for our newsletter for exclusive promo codes.' },
  { id: 'f10', section: 'Shipping & Delivery', order: 1, question: 'How long does shipping take?', answer: 'Orders processed within 24h, shipped within 48h. Estimated delivery 4–12 business days depending on your region and dispatch center.' },
  { id: 'f11', section: 'Shipping & Delivery', order: 2, question: 'Is packaging discreet?', answer: 'Yes, completely. Plain unmarked packaging, no company name or product reference on the outside.' },
  { id: 'f12', section: 'Shipping & Delivery', order: 3, question: 'Do you ship internationally?', answer: 'Yes, worldwide. In case of customs seizure we reship free of charge — no questions asked.' },
  { id: 'f13', section: 'Shipping & Delivery', order: 4, question: 'What is your reshipment policy?', answer: 'Contact us within 30 days of estimated delivery and we reship at no cost.' },
  { id: 'f14', section: 'Shipping & Delivery', order: 5, question: 'How do I track my order?', answer: 'Tracking number sent by email once shipped. Also visible in your account page. Contact support@modavance.com if no tracking within 72h.' },
  { id: 'f15', section: 'Usage & Dosing',     order: 1, question: 'What is the recommended dose?', answer: 'Modafinil: 100–200mg in the morning. Armodafinil: 75–150mg. Always start with the lower dose.' },
  { id: 'f16', section: 'Usage & Dosing',     order: 2, question: 'How often should I take Modafinil?', answer: 'Maximum 3–4 days per week to maintain sensitivity and preserve natural sleep patterns.' },
  { id: 'f17', section: 'Usage & Dosing',     order: 3, question: 'What should I avoid while taking Modafinil?', answer: 'Avoid taking after noon, combining with alcohol, and note that birth control pills may be less effective. Stay well hydrated.' },
  { id: 'f18', section: 'Support',            order: 1, question: 'How can I contact support?', answer: 'Email support@modavance.com. We respond within 24 hours, 7 days a week. Include your order number for order questions.' },
  { id: 'f19', section: 'Support',            order: 2, question: 'What is your refund policy?', answer: 'Contact us within 14 days of delivery. We offer reshipment, store credit, or refund depending on the case.' },
  { id: 'f20', section: 'Support',            order: 3, question: "I haven't received my order confirmation email. What should I do?", answer: 'Check spam/junk folder. If not there, email support@modavance.com with your checkout email address.' },
];

const EMPTY_ITEM = { section: '', question: '', answer: '', order: 1 };

export function AdminFAQPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<FAQItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY_ITEM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const { data: items = [] } = useQuery({
    queryKey: ['admin-faq'],
    queryFn: () => db.faqItems.orderBy('order').toArray(),
  });

  // Group by section
  const sections = items.reduce<Record<string, FAQItem[]>>((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  const sectionNames = [...new Set(items.map(i => i.section))];

  const openCreate = () => {
    setForm(EMPTY_ITEM);
    setCreating(true);
    setEditing(null);
  };

  const openEdit = (item: FAQItem) => {
    setForm({ section: item.section, question: item.question, answer: item.answer, order: item.order });
    setEditing(item);
    setCreating(false);
  };

  const closeForm = () => { setCreating(false); setEditing(null); };

  const handleSave = async () => {
    if (!form.section || !form.question || !form.answer) {
      alert('Please fill in all fields: Section, Question, and Answer.');
      return;
    }
    setSaving(true);
    try {
      if (creating) {
        await db.faqItems.add({
          ...form,
          id: `faq-${Date.now()}`,
          createdAt: new Date(),
        });
      } else if (editing) {
        await db.faqItems.update(editing.id, { ...form });
      }
      qc.invalidateQueries({ queryKey: ['admin-faq'] });
      qc.invalidateQueries({ queryKey: ['faq'] });
      closeForm();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await db.faqItems.delete(id);
    qc.invalidateQueries({ queryKey: ['admin-faq'] });
    qc.invalidateQueries({ queryKey: ['faq'] });
    setDeleteId(null);
  };

  const [reseeding, setReseeding] = useState(false);

  const isFormOpen = creating || !!editing;

  const handleReseed = async () => {
    if (!confirm('This will clear all FAQ items and reload the default questions. Continue?')) return;
    setReseeding(true);
    try {
      await db.faqItems.clear();
      for (const item of DEFAULT_FAQ) {
        await db.faqItems.put({ ...item, createdAt: new Date() });
      }
      qc.invalidateQueries({ queryKey: ['admin-faq'] });
      qc.invalidateQueries({ queryKey: ['faq'] });
      alert('FAQ loaded successfully!');
    } catch (err) {
      console.error(err);
      alert('Error: ' + err);
    } finally {
      setReseeding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">FAQ</h1>
          <p className="text-sm text-slate-500 mt-1">{items.length} questions across {sectionNames.length} sections</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReseed} loading={reseeding}>
            <RefreshCw className="w-4 h-4" /> Reset to Default
          </Button>
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4" /> Add Question
          </Button>
        </div>
      </div>

      {/* Form */}
      {isFormOpen && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-slate-900">{creating ? 'New FAQ Item' : 'Edit FAQ Item'}</h2>
            <button onClick={closeForm} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Section</label>
              <input
                list="sections"
                value={form.section}
                onChange={e => setForm(f => ({ ...f, section: e.target.value }))}
                placeholder="e.g. About Our Products"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <datalist id="sections">
                {sectionNames.map(s => <option key={s} value={s} />)}
              </datalist>
            </div>
            <Input
              label="Display Order"
              type="number"
              value={form.order}
              onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))}
            />
            <div className="md:col-span-2">
              <Input
                label="Question"
                value={form.question}
                onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
                placeholder="What is modafinil?"
              />
            </div>
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Answer</label>
              <textarea
                rows={5}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Detailed answer..."
                value={form.answer}
                onChange={e => setForm(f => ({ ...f, answer: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSave} loading={saving}>
              <Save className="w-4 h-4" /> {creating ? 'Add Question' : 'Save Changes'}
            </Button>
            <Button variant="outline" onClick={closeForm}>Cancel</Button>
          </div>
        </div>
      )}

      {/* FAQ list grouped by section */}
      <div className="space-y-4">
        {sectionNames.map(section => (
          <div key={section} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <button
              onClick={() => setOpenSection(openSection === section ? null : section)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-slate-900">{section}</h3>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  {sections[section].length} items
                </span>
              </div>
              {openSection === section ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openSection === section && (
              <div className="border-t border-slate-100 divide-y divide-slate-50">
                {sections[section].sort((a, b) => a.order - b.order).map(item => (
                  <div key={item.id} className="px-6 py-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 text-sm mb-1">{item.question}</p>
                        <p className="text-sm text-slate-500 line-clamp-2">{item.answer}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        {deleteId === item.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-xs text-red-600 font-semibold px-2 py-1 bg-red-50 rounded-lg hover:bg-red-100"
                            >
                              Delete
                            </button>
                            <button onClick={() => setDeleteId(null)} className="text-xs text-slate-500 px-1">✕</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteId(item.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {items.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 text-center py-16 text-slate-400">
            <p className="font-semibold">No FAQ items yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
