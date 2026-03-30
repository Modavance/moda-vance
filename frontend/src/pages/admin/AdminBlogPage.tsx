import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Eye, X, Save } from 'lucide-react';
import { adminApi, unwrap } from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatDate } from '@/utils/formatters';
import type { BlogPost } from '@/types';

const EMPTY_POST: Omit<BlogPost, 'id' | 'createdAt'> = {
  slug: '', title: '', excerpt: '', body: '',
  image: '', author: '', category: '', readTime: 5,
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function AdminBlogPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Omit<BlogPost, 'id' | 'createdAt'>>(EMPTY_POST);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: posts = [] } = useQuery({
    queryKey: ['admin-blog'],
    queryFn: async () => {
      const res = await adminApi.get('/blog');
      return unwrap<BlogPost[]>(res);
    },
  });

  const openCreate = () => { setForm(EMPTY_POST); setCreating(true); setEditing(null); };
  const openEdit = (post: BlogPost) => {
    setForm({ slug: post.slug, title: post.title, excerpt: post.excerpt, body: post.body, image: post.image, author: post.author, category: post.category, readTime: post.readTime });
    setEditing(post); setCreating(false);
  };
  const closeForm = () => { setCreating(false); setEditing(null); };
  const handleTitleChange = (title: string) => setForm(f => ({ ...f, title, slug: slugify(title) }));

  const handleSave = async () => {
    if (!form.title || !form.body) return;
    setSaving(true);
    try {
      if (creating) {
        await adminApi.post('/blog', form);
      } else if (editing) {
        await adminApi.put(`/blog/${editing.id}`, form);
      }
      qc.invalidateQueries({ queryKey: ['admin-blog'] });
      qc.invalidateQueries({ queryKey: ['blogs'] });
      closeForm();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    await adminApi.delete(`/blog/${id}`);
    qc.invalidateQueries({ queryKey: ['admin-blog'] });
    qc.invalidateQueries({ queryKey: ['blogs'] });
    setDeleteId(null);
  };

  const isFormOpen = creating || !!editing;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Blog Posts</h1>
          <p className="text-sm text-slate-500 mt-1">{posts.length} posts</p>
        </div>
        <Button onClick={openCreate}><Plus className="w-4 h-4" /> New Post</Button>
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-slate-900">{creating ? 'New Blog Post' : 'Edit Post'}</h2>
            <button onClick={closeForm} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <Input label="Title" value={form.title} onChange={e => handleTitleChange(e.target.value)} placeholder="Article title" />
            </div>
            <Input label="Slug (URL)" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="article-url-slug" />
            <Input label="Author" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} placeholder="Dr. Jane Smith" />
            <Input label="Category" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="Education, Guides, Lifestyle..." />
            <Input label="Read Time (minutes)" type="number" value={form.readTime} onChange={e => setForm(f => ({ ...f, readTime: Number(e.target.value) }))} />
            <div className="md:col-span-2">
              <Input label="Cover Image URL" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://images.unsplash.com/..." />
            </div>
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Excerpt</label>
              <textarea rows={2} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} />
            </div>
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Body Content</label>
              <textarea rows={16} className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y" value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSave} loading={saving}><Save className="w-4 h-4" /> {creating ? 'Publish Post' : 'Save Changes'}</Button>
            <Button variant="outline" onClick={closeForm}>Cancel</Button>
            {!creating && <a href={`/blog/${editing?.slug}`} target="_blank" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 px-3 py-2"><Eye className="w-4 h-4" /> Preview</a>}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {posts.length === 0 ? (
          <div className="text-center py-16 text-slate-400"><p className="font-semibold">No blog posts yet</p></div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-6 py-3">Title</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Category</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Author</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Date</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {post.image && <img src={post.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0 bg-slate-100" />}
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{post.title}</p>
                        <p className="text-xs text-slate-400 font-mono">/blog/{post.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell"><span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">{post.category}</span></td>
                  <td className="px-4 py-4 text-sm text-slate-500 hidden lg:table-cell">{post.author}</td>
                  <td className="px-4 py-4 text-sm text-slate-400 hidden lg:table-cell">{formatDate(post.createdAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <a href={`/blog/${post.slug}`} target="_blank" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye className="w-4 h-4" /></a>
                      <button onClick={() => openEdit(post)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                      {deleteId === post.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDelete(post.id)} className="text-xs text-red-600 font-semibold px-2 py-1 bg-red-50 rounded-lg hover:bg-red-100">Confirm</button>
                          <button onClick={() => setDeleteId(null)} className="text-xs text-slate-500 px-2 py-1 hover:bg-slate-100 rounded-lg">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteId(post.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
