"use client";

import { useState, useEffect, useRef } from "react";
import { AdminShell } from "@/components/admin-shell";
import { useSearchParams } from "next/navigation";
import { Loader2, Plus, Trash2, Upload, ChevronUp, ChevronDown } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type Member = {
  id: string;
  name_en: string;
  name_ar: string;
  role_en: string;
  role_ar: string;
  image: string;
  row: number;
  order: number;
};

function empty(): Omit<Member, "id"> {
  return { name_en: "", name_ar: "", role_en: "", role_ar: "", image: "", row: 1, order: 0 };
}

function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("ejaf_token") || "";
}

export default function AdminTeamPage() {
  const searchParams = useSearchParams();
  const isAr = searchParams.get("lang") === "ar";
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(empty());
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchMembers(); }, []);

  async function fetchMembers() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/team`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) setMembers(await res.json());
    } catch {}
    setLoading(false);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd,
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const url = data.url.startsWith("http") ? data.url : API_URL + data.url;
      setForm((f) => ({ ...f, image: url }));
    } catch {
      setError(isAr ? "فشل رفع الصورة" : "Failed to upload image");
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const url = editId ? `${API_URL}/api/team/${editId}` : `${API_URL}/api/team`;
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSuccess(isAr ? "تم الحفظ بنجاح" : "Saved successfully");
      setTimeout(() => setSuccess(""), 2000);
      setForm(empty());
      setEditId(null);
      await fetchMembers();
    } catch {
      setError(isAr ? "فشل الحفظ" : "Failed to save");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm(isAr ? "هل أنت متأكد؟" : "Are you sure?")) return;
    try {
      await fetch(`${API_URL}/api/team/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      await fetchMembers();
    } catch {}
  }

  function handleEdit(m: Member) {
    setForm({ name_en: m.name_en, name_ar: m.name_ar, role_en: m.role_en, role_ar: m.role_ar, image: m.image, row: m.row, order: m.order });
    setEditId(m.id);
  }

  const inputCls = "w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40";
  const rows = [1, 2, 3, 4];

  return (
    <AdminShell
      title={isAr ? "فريق العمل" : "Team"}
      description={isAr ? "إدارة أعضاء الفريق وهيكله الهرمي" : "Manage team members and hierarchy"}
    >
      <div className="space-y-6">
        {error && <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">⚠️ {error}</div>}
        {success && <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">✓ {success}</div>}

        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-6 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
            {editId ? (isAr ? "تعديل عضو" : "Edit Member") : (isAr ? "إضافة عضو" : "Add Member")}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-slate-500">Name (EN)</label>
              <input className={inputCls} value={form.name_en} onChange={e => setForm(f => ({ ...f, name_en: e.target.value }))} placeholder="John Smith" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-500">الاسم (AR)</label>
              <input className={inputCls} value={form.name_ar} onChange={e => setForm(f => ({ ...f, name_ar: e.target.value }))} placeholder="جون سميث" dir="rtl" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-500">Role (EN)</label>
              <input className={inputCls} value={form.role_en} onChange={e => setForm(f => ({ ...f, role_en: e.target.value }))} placeholder="CEO" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-500">المسمى الوظيفي (AR)</label>
              <input className={inputCls} value={form.role_ar} onChange={e => setForm(f => ({ ...f, role_ar: e.target.value }))} placeholder="المدير التنفيذي" dir="rtl" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-500">{isAr ? "الصف (1-4)" : "Row (1-4)"}</label>
              <select className={inputCls} value={form.row} onChange={e => setForm(f => ({ ...f, row: Number(e.target.value) }))}>
                {rows.map(r => <option key={r} value={r} className="bg-slate-900">Row {r}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-500">{isAr ? "الترتيب" : "Order"}</label>
              <input type="number" className={inputCls} value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} placeholder="0" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-slate-500">{isAr ? "الصورة" : "Photo"}</label>
            <div className="flex items-center gap-4">
              {form.image && (
                <img src={form.image} alt="" className="h-14 w-14 rounded-full object-cover border border-white/10" />
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-400/20 transition-colors disabled:opacity-50"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploading ? (isAr ? "جاري الرفع..." : "Uploading...") : (isAr ? "رفع صورة" : "Upload photo")}
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !form.name_en}
              className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 hover:-translate-y-0.5 transition-transform disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {editId ? (isAr ? "تحديث" : "Update") : (isAr ? "إضافة" : "Add")}
            </button>
            {editId && (
              <button onClick={() => { setForm(empty()); setEditId(null); }} className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-slate-400 hover:text-white transition-colors">
                {isAr ? "إلغاء" : "Cancel"}
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-slate-500" /></div>
        ) : (
          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-[0.22em] text-slate-500">
                  <th className="px-5 py-3 text-left">{isAr ? "الصورة" : "Photo"}</th>
                  <th className="px-5 py-3 text-left">{isAr ? "الاسم" : "Name"}</th>
                  <th className="px-5 py-3 text-left hidden md:table-cell">{isAr ? "المسمى" : "Role"}</th>
                  <th className="px-5 py-3 text-left hidden md:table-cell">{isAr ? "الصف" : "Row"}</th>
                  <th className="px-5 py-3 text-right">{isAr ? "إجراءات" : "Actions"}</th>
                </tr>
              </thead>
              <tbody>
                {members.sort((a,b) => a.row - b.row || a.order - b.order).map((m) => (
                  <tr key={m.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3">
                      {m.image ? (
                        <img src={m.image} alt={m.name_en} className="h-10 w-10 rounded-full object-cover border border-white/10" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-cyan-300 text-sm font-semibold">{m.name_en.charAt(0)}</div>
                      )}
                    </td>
                    <td className="px-5 py-3 text-white font-medium">{m.name_en}</td>
                    <td className="px-5 py-3 text-slate-400 hidden md:table-cell">{m.role_en}</td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <span className="rounded-full bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 text-xs text-cyan-300">Row {m.row}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(m)} className="rounded-xl border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:border-white/20 transition-colors">
                          {isAr ? "تعديل" : "Edit"}
                        </button>
                        <button onClick={() => handleDelete(m.id)} className="rounded-xl border border-rose-400/20 px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-400/10 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {members.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-500">{isAr ? "لا يوجد أعضاء بعد" : "No team members yet"}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
