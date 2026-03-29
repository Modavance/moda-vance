import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Mail, CheckCircle, Eye, Trash2, Clock } from 'lucide-react';
import { db } from '@/db/database';
import { formatDate } from '@/utils/formatters';
import type { ContactSubmission } from '@/types';

export function AdminContactPage() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const { data: submissions = [] } = useQuery({
    queryKey: ['admin-contact'],
    queryFn: () => db.contactSubmissions.orderBy('createdAt').reverse().toArray(),
  });

  const filtered = submissions.filter(s => {
    if (filter === 'unread') return !s.read;
    if (filter === 'read')   return s.read;
    return true;
  });

  const unreadCount = submissions.filter(s => !s.read).length;

  const handleOpen = async (sub: ContactSubmission) => {
    setSelected(sub);
    if (!sub.read) {
      await db.contactSubmissions.update(sub.id, { read: true });
      qc.invalidateQueries({ queryKey: ['admin-contact'] });
    }
  };

  const handleDelete = async (id: string) => {
    await db.contactSubmissions.delete(id);
    qc.invalidateQueries({ queryKey: ['admin-contact'] });
    if (selected?.id === id) setSelected(null);
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contact Submissions</h1>
          <p className="text-sm text-slate-500 mt-1">
            {submissions.length} total · <span className="text-blue-600 font-semibold">{unreadCount} unread</span>
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-slate-100">
        {(['all', 'unread', 'read'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2.5 text-sm font-semibold capitalize border-b-2 -mb-px transition-all ${
              filter === f
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {f} {f === 'unread' && unreadCount > 0 && (
              <span className="ml-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Mail className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No messages</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {filtered.map(sub => (
                <div
                  key={sub.id}
                  onClick={() => handleOpen(sub)}
                  className={`px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                    selected?.id === sub.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!sub.read ? 'bg-blue-600' : 'bg-transparent'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm truncate ${!sub.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                          {sub.name}
                        </p>
                        <span className="text-xs text-slate-400 shrink-0">{formatDate(sub.createdAt)}</span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{sub.subject}</p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{sub.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-bold text-slate-900 text-lg">{selected.subject}</h2>
                  <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${selected.email}`} className="text-blue-600 hover:underline">{selected.email}</a>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {formatDate(selected.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {deleteId === selected.id ? (
                    <>
                      <button
                        onClick={() => handleDelete(selected.id)}
                        className="text-xs text-red-600 font-semibold px-3 py-1.5 bg-red-50 rounded-lg hover:bg-red-100"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setDeleteId(null)}
                        className="text-xs text-slate-500 px-2 py-1.5 hover:bg-slate-100 rounded-lg"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setDeleteId(selected.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-6">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                  {selected.name[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{selected.name}</p>
                  <p className="text-xs text-slate-500">{selected.email}</p>
                </div>
                {selected.read && (
                  <span className="ml-auto flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" /> Read
                  </span>
                )}
              </div>

              <div className="bg-white border border-slate-100 rounded-xl p-4">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              <div className="mt-6">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-blue-700 transition-colors"
                >
                  <Mail className="w-4 h-4" /> Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 flex items-center justify-center h-64">
              <div className="text-center text-slate-400">
                <Eye className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">Select a message to read</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
