import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, X, Save, ChevronUp, ChevronDown } from 'lucide-react';
import { adminApi, unwrap } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { FAQItem } from '@/types';

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
    queryFn: async () => {
      const res = await adminApi.get('/faq');
      return unwrap<FAQItem[]>(res);
    },
  });

  const sections = items.reduce<Record<string, FAQItem[]>>((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});
  const sectionNames = [...new Set(items.map(i => i.section))];

  const openCreate = () => { setForm(EMPTY_ITEM); setCreating(true); setEditing(null); };
  const openEdit = (item: FAQItem) => {
    setForm({ section: item.section, question: item.question, answer: item.answer, order: item.order });
    setEditing(item); setCreating(false);
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
        await adminApi.post('/faq', form);
      } else if (editing) {
        await adminApi.put(`/faq/${editing.id}`, form);
      }
      qc.invalidateQueries({ queryKey: ['admin-faq'] });
      qc.invalidateQueries({ queryKey: ['faq'] });
      closeForm();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    await adminApi.delete(`/faq/${id}`);
    qc.invalidateQueries({ queryKey: ['admin-faq'] });
    qc.invalidateQueries({ queryKey: ['faq'] });
    setDeleteId(null);
  };

  const isFormOpen = creating || !!editing;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">FAQ</h1>
          <p className="text-sm text-slate-500 mt-1">{items.length} questions across {sectionNames.length} sections</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4" /> Add Question</Button>
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-slate-900">{creating ? 'New FAQ Item' : 'Edit FAQ Item'}</h2>
            <button onClick={closeForm} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">Section</label>
              <input list="sections" value={form.section} onChange={e => setForm(f => ({ ...f, section: e.target.value }))} placeholder="e.g. About Our Products"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <datalist id="sections">{sectionNames.map(s => <option key={s} value={s} />)}</datalist>
            </div>
            <Input label="Display Order" type="number" value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} />
            <div className="md:col-span-2">
              <Input label="Question" value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} placeholder="What is modafinil?" />
            </div>
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Answer</label>
              <textarea rows={5} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                value={form.answer} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSave} loading={saving}><Save className="w-4 h-4" /> {creating ? 'Add Question' : 'Save Changes'}</Button>
            <Button variant="outline" onClick={closeForm}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {sectionNames.map(section => (
          <div key={section} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <button onClick={() => setOpenSection(openSection === section ? null : section)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-slate-900">{section}</h3>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{sections[section].length} items</span>
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
                        <button onClick={() => openEdit(item)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                        {deleteId === item.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleDelete(item.id)} className="text-xs text-red-600 font-semibold px-2 py-1 bg-red-50 rounded-lg hover:bg-red-100">Delete</button>
                            <button onClick={() => setDeleteId(null)} className="text-xs text-slate-500 px-1">✕</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteId(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
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
