"use client";

import { useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { createPost, updatePost, deletePost } from "@/lib/admin-api";
import { ImageUpload } from "@/components/image-upload";

type PostRecord = {
  id: string;
  title_en: string;
  title_ar: string;
  excerpt_en: string;
  excerpt_ar: string;
  content_en: string;
  content_ar: string;
  slug: string;
  image: string;
  tags: {
    en: string | string[];
    ar: string | string[];
  };
  createdAt: string;
};

type Props = { initial: PostRecord[]; isAr: boolean };

const empty = (): PostRecord => ({
  id: "",
  title_en: "",
  title_ar: "",
  excerpt_en: "",
  excerpt_ar: "",
  content_en: "",
  content_ar: "",
  slug: "",
  image: "",
  tags: { en: "", ar: "" },
  createdAt: new Date().toISOString().slice(0, 10),
});

export function AdminBlogCrud({ initial, isAr }: Props) {
  const [records, setRecords] = useState<PostRecord[]>(initial);
  const [form, setForm] = useState<PostRecord>(empty());
  const [editId, setEditId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<"en" | "ar">("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // تحويل المصفوفة إلى نص مفصول بفواصل ليقبلها Laravel
    const payload = {
      title_en: form.title_en,
      title_ar: form.title_ar,
      excerpt_en: form.excerpt_en,
      excerpt_ar: form.excerpt_ar,
      content_en: form.content_en,
      content_ar: form.content_ar,
      slug: form.slug.trim(),
      image: form.image || null,
      tags: {
        en: Array.isArray(form.tags.en) ? form.tags.en.join(",") : form.tags.en,
        ar: Array.isArray(form.tags.ar) ? form.tags.ar.join(",") : form.tags.ar,
      },
      created_at_display:
        form.createdAt || new Date().toISOString().split("T")[0],
    };

    try {
      if (editId) {
        await updatePost(editId, payload);
        // نستخدم form المتوافق مع الـ State لمنع خطوط TypeScript الحمراء
        setRecords(
          records.map((r) => (r.id === editId ? { ...form, id: editId } : r)),
        );
      } else {
        const created = await createPost(payload);
        setRecords([...records, { ...form, id: String(created.id) }]);
      }

      // تصفير النموذج عند النجاح
      setForm(empty());
      setEditId(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      console.error("Validation or Saving Error:", err);

      // فحص أخطاء الباك إيند وتخصيص الرسائل بناءً على لغة الواجهة الحالية isAr
      if (
        err.status === 422 ||
        (err.message && err.message.includes("Validation"))
      ) {
        setError(
          isAr
            ? "فشل في حفظ المقال: يرجى التأكد من ملء جميع الحقول المطلوبة، وأن الرابط الثابت (Slug) مكتوب بالإنجليزية فقط وبدون مسافات."
            : "Failed to save article: Please ensure all required fields are filled, and the (Slug) contains lowercase English characters only.",
        );
      } else {
        setError(
          err instanceof Error
            ? err.message
            : isAr
              ? "حدث خطأ غير متوقع أثناء الحفظ."
              : "An unexpected error occurred while saving.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(isAr ? "هل أنت متأكد من الحذف؟" : "Are you sure?")) return;
    try {
      await deletePost(id);
      setRecords(records.filter((r) => r.id !== id));
    } catch (err: unknown) {
      alert(
        err instanceof Error
          ? err.message
          : isAr
            ? "فشل الحذف"
            : "Delete failed",
      );
    }
  }

  const F = form;
  const set =
    (k: keyof PostRecord) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...F, [k]: e.target.value });

  const inputCls =
    "w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/40";
  const textCls = `${inputCls} resize-none`;

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300 animate-pulse">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <p className="text-base font-semibold text-white">
            {isAr
              ? editId
                ? "تعديل مقال"
                : "إضافة مقال"
              : editId
                ? "Edit post"
                : "Add post"}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTab("en")}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${tab === "en" ? "bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-400/25" : "text-slate-400 hover:text-white"}`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setTab("ar")}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${tab === "ar" ? "bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-400/25" : "text-slate-400 hover:text-white"}`}
            >
              AR
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setForm(empty());
                  setEditId(null);
                }}
                className="flex items-center gap-1 rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* 🌐 English Tab View */}
        {tab === "en" ? (
          <div
            className="space-y-3 rounded-[1.25rem] border border-white/10 bg-slate-950/50 p-4 text-left"
            dir="ltr"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
              English Content
            </p>
            <label className="block space-y-1.5 text-sm text-slate-300">
              <span className="font-mono text-xs text-slate-500">
                Post Title (EN)
              </span>
              <input
                type="text"
                value={F.title_en}
                onChange={set("title_en")}
                className={`${inputCls} text-left`}
                placeholder="e.g. The Power of Surveillance"
              />
            </label>
            <label className="block space-y-1.5 text-sm text-slate-300">
              <span className="font-mono text-xs text-slate-500">
                Short Excerpt (EN)
              </span>
              <textarea
                rows={2}
                value={F.excerpt_en}
                onChange={set("excerpt_en")}
                className={`${textCls} text-left`}
                placeholder="Short description shown in the blog list..."
              />
            </label>
            <label className="block space-y-1.5 text-sm text-slate-300">
              <span className="font-mono text-xs text-slate-500">
                Full Article Content (EN)
              </span>
              <textarea
                rows={7}
                value={F.content_en}
                onChange={set("content_en")}
                className={`${textCls} text-left`}
                placeholder="Write the full article body in English here..."
              />
            </label>
            <label className="block space-y-1.5 text-sm text-slate-300">
              <span className="font-mono text-xs text-slate-500">
                Tags (EN) - Comma separated
              </span>
              <input
                type="text"
                value={typeof F.tags.en === "string" ? F.tags.en : ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    tags: { ...form.tags, en: e.target.value },
                  })
                }
                className={`${inputCls} text-left`}
                placeholder="e.g. Security, Technology, CCTV"
              />
            </label>
          </div>
        ) : (
          /* 🌐 Arabic Tab View */
          <div
            className="space-y-3 rounded-[1.25rem] border border-white/10 bg-slate-950/50 p-4 text-right"
            dir="rtl"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
              المحتوى العربي
            </p>
            <label className="block space-y-1.5 text-right text-sm text-slate-300">
              <span className="font-mono text-xs text-slate-500">
                عنوان المقال (بالعربية)
              </span>
              <input
                type="text"
                value={F.title_ar}
                onChange={set("title_ar")}
                className={`${inputCls} text-right`}
                placeholder="مثال: قوة أنظمة المراقبة الحديثة"
              />
            </label>
            <label className="block space-y-1.5 text-right text-sm text-slate-300">
              <span className="font-mono text-xs text-slate-500">
                مقتطف قصير (بالعربية)
              </span>
              <textarea
                rows={2}
                value={F.excerpt_ar}
                onChange={set("excerpt_ar")}
                className={`${textCls} text-right`}
                placeholder="وصف قصير يظهر في قائمة المدونة العامة..."
              />
            </label>
            <label className="block space-y-1.5 text-right text-sm text-slate-300">
              <span className="font-mono text-xs text-slate-500">
                نص المقال الكامل (بالعربية)
              </span>
              <textarea
                rows={7}
                value={F.content_ar}
                onChange={set("content_ar")}
                className={`${textCls} text-right`}
                placeholder="اكتب نص المقال الكامل باللغة العربية هنا..."
              />
            </label>
            <label className="block space-y-1.5 text-right text-sm text-slate-300">
              <span className="font-mono text-xs text-slate-500">
                الوسوم (بالعربية) - مفصولة بفاصلة
              </span>
              <input
                type="text"
                value={typeof F.tags.ar === "string" ? F.tags.ar : ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    tags: { ...form.tags, ar: e.target.value },
                  })
                }
                className={`${inputCls} text-right`}
                placeholder="مثال: أمن, تكنولوجيا, كاميرات مراقبة"
              />
            </label>
          </div>
        )}

        {/* Shared metadata */}
        <div
          className="mt-4 rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4"
          dir={isAr ? "rtl" : "ltr"}
        >
          <p
            className={`mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300 ${isAr ? "text-right" : "text-left"}`}
          >
            {isAr ? "بيانات مشتركة" : "Shared metadata"}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label
              className={`block space-y-1.5 text-sm text-slate-300 ${isAr ? "text-right" : "text-left"}`}
            >
              <span className="font-mono text-xs text-slate-500">
                Slug (URL)
              </span>
              <input
                type="text"
                value={F.slug}
                onChange={set("slug")}
                className={`${inputCls} ${isAr ? "text-right" : "text-left"}`}
                placeholder="surveillance-cctv-iraq"
              />
            </label>
            <label
              className={`block space-y-1.5 text-sm text-slate-300 ${isAr ? "text-right" : "text-left"}`}
            >
              <span className="font-mono text-xs text-slate-500">
                {isAr ? "تاريخ الإنشاء" : "Created At"}
              </span>
              <input
                type="date"
                value={F.createdAt}
                onChange={set("createdAt")}
                className={`${inputCls} ${isAr ? "text-right" : "text-left"}`}
              />
            </label>
          </div>

          <div className="mt-4">
            <ImageUpload
              value={form.image}
              onChange={(url) => setForm({ ...form, image: url })}
              label={isAr ? "صورة المقال" : "Post Image"}
              isAr={isAr} // ✅ يتبع لغة الواجهة الكاملة وليس التبويب
            />
          </div>
        </div>

        <div className="mt-5 flex gap-3" dir={isAr ? "rtl" : "ltr"}>
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all disabled:opacity-60 ${saved ? "bg-emerald-400 text-slate-950" : "bg-white text-slate-950 hover:-translate-y-0.5"}`}
          >
            {saved ? (
              <>
                <Check className="h-4 w-4" />
                {isAr ? "تم الحفظ ✓" : "Saved ✓"}
              </>
            ) : loading ? (
              "..."
            ) : isAr ? (
              "حفظ"
            ) : (
              "Save"
            )}
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setForm(empty());
                setEditId(null);
              }}
              className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-white hover:bg-white/[0.06]"
            >
              {isAr ? "إلغاء" : "Cancel"}
            </button>
          )}
        </div>
      </form>

      {/* Table */}
      <div className="overflow-hidden rounded-[1.75rem] border border-white/10">
        <table className="w-full text-left text-sm" dir={isAr ? "rtl" : "ltr"}>
          <thead className="bg-white/[0.04] text-[11px] uppercase tracking-[0.22em] text-cyan-300">
            <tr>
              <th className={`px-5 py-3 ${isAr ? "text-right" : "text-left"}`}>
                {isAr ? "العنوان" : "Title"}
              </th>
              <th
                className={`px-5 py-3 hidden md:table-cell ${isAr ? "text-right" : "text-left"}`}
              >
                {isAr ? "التاريخ" : "Date"}
              </th>
              <th
                className={`px-5 py-3 hidden lg:table-cell ${isAr ? "text-right" : "text-left"}`}
              >
                {isAr ? "الوسوم" : "Tags"}
              </th>
              <th className={`px-5 py-3 ${isAr ? "text-left" : "text-right"}`}>
                {isAr ? "الإجراءات" : "Actions"}
              </th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-8 text-center text-slate-500"
                >
                  {isAr ? "لا توجد مقالات بعد" : "No posts yet"}
                </td>
              </tr>
            )}
            {records.map((r) => (
              <tr
                key={r.id}
                className="border-t border-white/[0.06] hover:bg-white/[0.02]"
              >
                <td className="px-5 py-3">
                  <p
                    className={`font-medium text-white ${isAr ? "text-right" : "text-left"}`}
                  >
                    {isAr ? r.title_ar || r.title_en : r.title_en}
                  </p>
                  {!isAr && r.title_ar && (
                    <p
                      className="text-xs text-slate-400 mt-0.5 text-left"
                      dir="rtl"
                    >
                      {r.title_ar}
                    </p>
                  )}
                  {isAr && r.title_en && (
                    <p
                      className="text-xs text-slate-500 mt-0.5 text-right"
                      dir="ltr"
                    >
                      {r.title_en}
                    </p>
                  )}
                </td>
                <td className="px-5 py-3 text-slate-400 hidden md:table-cell">
                  {r.createdAt}
                </td>
                <td className="px-5 py-3 hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {(() => {
                      const currentTags = isAr ? r.tags.ar : r.tags.en;
                      const tagsStr = Array.isArray(currentTags)
                        ? currentTags.join(", ")
                        : currentTags || "";
                      return tagsStr
                        .split(",")
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-300"
                          >
                            {t.trim()}
                          </span>
                        ));
                    })()}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div
                    className={`flex gap-2 ${isAr ? "justify-start" : "justify-end"}`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        const tagsEn = Array.isArray(r.tags.en)
                          ? r.tags.en.join(", ")
                          : r.tags.en || "";
                        const tagsAr = Array.isArray(r.tags.ar)
                          ? r.tags.ar.join(", ")
                          : r.tags.ar || "";

                        setForm({
                          ...r,
                          tags: { en: tagsEn, ar: tagsAr },
                        });
                        setEditId(r.id);
                        setTab(isAr ? "ar" : "en");
                      }}
                      className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white hover:bg-white/[0.08]"
                    >
                      <Pencil className="h-3 w-3" />
                      {isAr ? "تعديل" : "Edit"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(r.id)}
                      className="flex items-center gap-1.5 rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1.5 text-xs text-rose-200 hover:bg-rose-400/20"
                    >
                      <Trash2 className="h-3 w-3" />
                      {isAr ? "حذف" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
