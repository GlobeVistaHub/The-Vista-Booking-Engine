"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Eye, EyeOff, Save, X, Image as ImageIcon, FileText } from "lucide-react";
import { createInsightAction, updateInsightAction, deleteInsightAction, uploadImageAction } from "@/app/actions/insights";

interface Insight {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  published: boolean;
  created_at: string;
}

export default function InsightsClient({ initialInsights }: { initialInsights: Insight[] }) {
  const [insights, setInsights] = useState<Insight[]>(initialInsights);
  const [editing, setEditing] = useState<Partial<Insight> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.title || !editing?.slug || !editing?.content) return;
    setIsSaving(true);
    setStatus("");

    const data = {
      title: editing.title,
      slug: editing.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      excerpt: editing.excerpt || "",
      content: editing.content,
      cover_image: editing.cover_image || "",
      published: editing.published || false
    };

    let res;
    if (editing.id) {
      res = await updateInsightAction(editing.id, data);
    } else {
      res = await createInsightAction(data);
    }

    if (res.success) {
      setStatus("Saved successfully! Refreshing...");
      window.location.reload(); // Quick dirty refresh for now
    } else {
      setStatus(`Error: ${res.error}`);
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this insight? This cannot be undone.")) return;
    const res = await deleteInsightAction(id);
    if (res.success) {
      setInsights(prev => prev.filter(i => i.id !== id));
    } else {
      alert("Failed to delete.");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("Uploading image...");
    setIsSaving(true);
    
    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadImageAction(formData);

    if (!res.success) {
      setStatus(`Upload failed: ${res.error}`);
      setIsSaving(false);
      return;
    }

    setEditing(prev => ({ ...prev, cover_image: res.url }));
    setStatus("Image uploaded!");
    setIsSaving(false);
  };

  if (editing) {
    return (
      <div className="bg-[#111] border border-white/10 rounded-xl p-6 md:p-8 animate-in fade-in duration-300">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold uppercase tracking-widest">{editing.id ? 'Edit Insight' : 'New Insight'}</h2>
          <button onClick={() => setEditing(null)} className="text-white/50 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white/70 text-sm font-bold uppercase tracking-widest mb-2">Title</label>
              <input 
                type="text" required
                value={editing.title || ''} 
                onChange={e => setEditing({...editing, title: e.target.value})}
                className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00C2D4] transition-colors"
                placeholder="e.g. Why Ceramic Coating is Essential"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm font-bold uppercase tracking-widest mb-2">URL Slug</label>
              <input 
                type="text" required
                value={editing.slug || ''} 
                onChange={e => setEditing({...editing, slug: e.target.value})}
                className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00C2D4] transition-colors font-mono text-sm"
                placeholder="e.g. ceramic-coating-essential"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/70 text-sm font-bold uppercase tracking-widest mb-2">Excerpt (Summary)</label>
            <textarea 
              rows={2} required
              value={editing.excerpt || ''} 
              onChange={e => setEditing({...editing, excerpt: e.target.value})}
              className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00C2D4] transition-colors"
              placeholder="A brief 1-2 sentence summary for the insights grid..."
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm font-bold uppercase tracking-widest mb-2">Cover Image</label>
            <div className="flex items-center gap-4">
              {editing.cover_image && (
                <img src={editing.cover_image} alt="Cover" className="w-32 h-20 object-cover rounded border border-white/20" />
              )}
              <input 
                type="file" accept="image/*"
                onChange={handleImageUpload}
                disabled={isSaving}
                className="block w-full text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-bold file:bg-[#00C2D4] file:text-[#050505] hover:file:bg-[#00a8b8] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/70 text-sm font-bold uppercase tracking-widest mb-2">Insight Content (Markdown Supported)</label>
            <textarea 
              rows={12} required
              value={editing.content || ''} 
              onChange={e => setEditing({...editing, content: e.target.value})}
              className="w-full bg-[#050505] border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00C2D4] transition-colors font-mono text-sm leading-relaxed"
              placeholder="Write your article here..."
            />
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className={`w-12 h-6 rounded-full transition-colors relative ${editing.published ? 'bg-[#00C2D4]' : 'bg-white/10'}`}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${editing.published ? 'translate-x-7' : 'translate-x-1'}`} />
              </div>
              <input 
                type="checkbox" className="hidden"
                checked={editing.published || false}
                onChange={e => setEditing({...editing, published: e.target.checked})}
              />
              <span className="text-sm font-bold uppercase tracking-widest text-white/70">{editing.published ? 'Published' : 'Draft'}</span>
            </label>

            <div className="flex items-center gap-4">
              <span className="text-sm text-white/50">{status}</span>
              <button 
                type="submit"
                disabled={isSaving}
                className="bg-[#00C2D4] hover:bg-[#00a8b8] text-[#050505] font-bold px-8 py-3 rounded transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Save size={18} />
                {isSaving ? 'SAVING...' : 'SAVE INSIGHT'}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold uppercase tracking-widest">Insights</h2>
        <button 
          onClick={() => setEditing({ title: '', slug: '', excerpt: '', content: '', published: false })}
          className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded transition-colors flex items-center gap-2 text-sm uppercase tracking-widest"
        >
          <Plus size={16} /> New Insight
        </button>
      </div>

      {insights.length === 0 ? (
        <div className="text-center py-12 border border-white/5 rounded-lg bg-[#111]">
          <FileText size={32} className="mx-auto text-white/20 mb-4" />
          <p className="text-white/50">No insights written yet. Start your first article.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map(insight => (
            <div key={insight.id} className="bg-[#111] border border-white/10 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {insight.cover_image ? (
                  <img src={insight.cover_image} alt="" className="w-16 h-16 object-cover rounded bg-[#050505]" />
                ) : (
                  <div className="w-16 h-16 rounded bg-[#050505] border border-white/5 flex items-center justify-center">
                    <ImageIcon size={20} className="text-white/20" />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-white text-lg">{insight.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded flex items-center gap-1 ${insight.published ? 'bg-green-500/10 text-green-400' : 'bg-cyber-orange/10 text-cyber-orange'}`}>
                      {insight.published ? <Eye size={12} /> : <EyeOff size={12} />}
                      {insight.published ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-white/30 text-xs font-mono">/{insight.slug}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setEditing(insight)}
                  className="p-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(insight.id)}
                  className="p-2 bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-400 rounded transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
