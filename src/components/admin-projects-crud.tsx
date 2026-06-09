"use client";

import { useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { createProject, updateProject, deleteProject } from "@/lib/admin-api";
import { ImageUpload } from "@/components/image-upload";

type ProjectRecord = {
  id: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  image: string;
  technologies: {
    en: string;
    ar: string;
  };
};

type Props = { initial: ProjectRecord[]; isAr: boolean };

const empty = (): ProjectRecord => ({
  id: "",
  title_en: "",
  title_ar: "",
  description_en: "",
  description_ar: "",
  image: "",
  technologies: {
    en: "",
    ar: "",
  },
});

export function AdminProjectsCrud({ initial, isAr }: Props) {
  const [records, setRecords] = useState<ProjectRecord[]>(initial);
  const [form, setForm] = useState<ProjectRecord>(empty());
  const [editId, setEditId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 1. فك النص المفصول بفاصلة وتحويله إلى مصفوفة (Array) حقيقية تطابق شرط Laravel تماماً
    const techEnArray = form.technologies.en
      ? form.technologies.en
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    const techArArray = form.technologies.ar
      ? form.technologies.ar
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    // 2. بناء الـ payload المتوافق 100% مع الـ Controller
    const payload = {
      title_en: form.title_en,
      title_ar: form.title_ar,
      description_en: form.description_en,
      description_ar: form.description_ar,
      image: form.image || null,
      technologies: {
        en: techEnArray, // تم تمرير مصفوفة Array
        ar: techArArray, // تم تمرير مصفوفة Array
      },
    };

    try {
      if (editId) {
        await updateProject(editId, payload, isAr);

        // تحديث الـ state بالـ form الأصلي للحفاظ على متطلبات TypeScript والواجهة
        setRecords(
          records.map((r) => (r.id === editId ? { ...form, id: editId } : r)),
        );
      } else {
        const created = await createProject(payload, isAr);
        setRecords([...records, { ...form, id: String(created.id) }]);
      }

      // تصفير وإعادة تهيئة النموذج بعد النجاح
      setForm(empty());
      setEditId(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      console.error("Project Save Error:", err);

      // التقطي الأخطاء واعرضيها بالإنجليزية أو العربية بناءً على لغة الواجهة الحالية isAr
      if (err.status === 422 || err.message?.includes("Validation")) {
        setError(
          isAr
            ? "فشل حفظ المشروع: يرجى التأكد من تعبئة كافة الحقول المطلوبة باللغتين العربية والإنجليزية."
            : "Failed to save project: Please ensure all required fields are filled correctly in both English and Arabic.",
        );
      } else {
        setError(
          err instanceof Error
            ? err.message
            : isAr
              ? "حدث خطأ غير متوقع أثناء الحفظ"
              : "An unexpected error occurred while saving",
        );
      }
    } finally {
      setLoading(false);
    }
  }
  async function handleDelete(id: string) {
    if (!confirm(isAr ? "هل أنت متأكد من الحذف؟" : "Are you sure?")) return;
    try {
      await deleteProject(id, isAr);
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

  // قاموس نصوص الواجهة المترجم ديناميكياً
  const t = {
    formTitle: isAr
      ? editId
        ? "تعديل مشروع"
        : "إضافة مشروع"
      : editId
        ? "Edit project"
        : "Add project",
    en: isAr ? "الإنجليزية" : "English",
    ar: isAr ? "العربية" : "Arabic",
    save: isAr ? "حفظ" : "Save",
    saved: isAr ? "تم الحفظ ✓" : "Saved ✓",
    cancel: isAr ? "إلغاء" : "Cancel",
    edit: isAr ? "تعديل" : "Edit",
    del: isAr ? "حذف" : "Delete",
    empty: isAr ? "لا توجد مشاريع بعد" : "No projects yet",
    imageLabel: isAr ? "صورة المشروع" : "Project Image",
  };

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <p className="text-base font-semibold text-white">{t.formTitle}</p>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setForm(empty());
                setEditId(null);
              }}
              className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300"
            >
              <X className="h-3 w-3" />
              {t.cancel}
            </button>
          )}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* 🌐 English Section (الجانب الأيسر - نصوص إنجليزية بالكامل) */}
          <div
            className="space-y-3 rounded-[1.25rem] border border-white/10 bg-slate-950/50 p-4 text-left"
            dir="ltr"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
              {t.en}
            </p>
            <label className="block space-y-1.5 text-sm text-slate-300">
              <span className="font-mono text-xs text-slate-500">
                Project Title (EN)
              </span>
              <input
                type="text"
                value={form.title_en}
                onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/40 text-left"
                placeholder="e.g. Secure Campus Backbone"
              />
            </label>
            <label className="block space-y-1.5 text-sm text-slate-300">
              <span className="font-mono text-xs text-slate-500">
                Project Description (EN)
              </span>
              <textarea
                rows={3}
                value={form.description_en}
                onChange={(e) =>
                  setForm({ ...form, description_en: e.target.value })
                }
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/40 text-left"
                placeholder="e.g. A high-availability networking foundation built for..."
              />
            </label>

            <label className="block space-y-1.5 text-sm text-slate-300">
              <span className="font-mono text-xs text-slate-500">
                Technologies (EN) - Comma separated
              </span>
              <input
                type="text"
                value={form.technologies.en}
                onChange={(e) =>
                  setForm({
                    ...form,
                    technologies: { ...form.technologies, en: e.target.value },
                  })
                }
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/40 text-left"
                placeholder="e.g. Next.js, Laravel, Tailwind CSS"
              />
            </label>
          </div>

          {/* 🌐 Arabic Section (الجانب الأيمن - نصوص عربية بالكامل بالاتجاه الصحيح) */}
          <div
            className="space-y-3 rounded-[1.25rem] border border-white/10 bg-slate-950/50 p-4 text-right"
            dir="rtl"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
              {t.ar}
            </p>
            <label className="block space-y-1.5 text-sm text-slate-300">
              <span className="font-mono text-xs text-slate-500">
                عنوان المشروع (بالعربية)
              </span>
              <input
                type="text"
                value={form.title_ar}
                onChange={(e) => setForm({ ...form, title_ar: e.target.value })}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-right text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/40"
                placeholder="مثال: البنية الأساسية للحرم الآمن"
              />
            </label>
            <label className="block space-y-1.5 text-sm text-slate-300">
              <span className="font-mono text-xs text-slate-500">
                وصف المشروع (بالعربية)
              </span>
              <textarea
                rows={3}
                value={form.description_ar}
                onChange={(e) =>
                  setForm({ ...form, description_ar: e.target.value })
                }
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-right text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/40"
                placeholder="مثال: تأسيس بنية شبكات ومراقبة عالية الاعتمادية..."
              />
            </label>

            <label className="block space-y-1.5 text-sm text-slate-300">
              <span className="font-mono text-xs text-slate-500">
                التقنيات المستخدمة (بالعربية) - فاصلة عادية
              </span>
              <input
                type="text"
                value={form.technologies.ar}
                onChange={(e) =>
                  setForm({
                    ...form,
                    technologies: { ...form.technologies, ar: e.target.value },
                  })
                }
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-right text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/40"
                placeholder="مثال: نكست جي اس، لارفيل، تيلويند"
              />
            </label>
          </div>
        </div>

        {/* 🖼️ قسم رفع الصور - تم تمرير الـ isAr إليه ليعمل داخله التغيير ديناميكياً */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <ImageUpload
              value={form.image}
              onChange={(url) => setForm({ ...form, image: url })}
              label={t.imageLabel}
              // @ts-ignore (مرري الخاصية في حال كان المكون مجهزاً لاستقبالها، أو سنقوم بتحديث المكون نفسه بالخطوة التالية)
              isAr={isAr}
            />
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all disabled:opacity-60 ${saved ? "bg-emerald-400 text-slate-950" : "bg-white text-slate-950 hover:-translate-y-0.5"}`}
          >
            {saved ? (
              <>
                <Check className="h-4 w-4" />
                {t.saved}
              </>
            ) : loading ? (
              "..."
            ) : (
              t.save
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
              {t.cancel}
            </button>
          )}
        </div>
      </form>

      {/* Table */}
      <div className="overflow-hidden rounded-[1.75rem] border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.04] text-[11px] uppercase tracking-[0.22em] text-cyan-300">
            <tr>
              <th className="px-5 py-3">{isAr ? "العنوان" : "Title"}</th>
              <th className="px-5 py-3 hidden sm:table-cell">
                {isAr ? "التقنيات" : "Technologies"}
              </th>
              <th className="px-5 py-3 text-right">
                {isAr ? "الإجراءات" : "Actions"}
              </th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-5 py-8 text-center text-slate-500"
                >
                  {t.empty}
                </td>
              </tr>
            )}
            {records.map((r) => (
              <tr
                key={r.id}
                className="border-t border-white/[0.06] hover:bg-white/[0.02]"
              >
                <td className="px-5 py-3">
                  <p className="font-medium text-white text-left">
                    {r.title_en}
                  </p>
                  {r.title_ar && (
                    <p
                      className="text-xs text-slate-400 mt-0.5 text-right"
                      dir="rtl"
                    >
                      {r.title_ar}
                    </p>
                  )}
                </td>
                <td className="px-5 py-3 hidden sm:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {(() => {
                      const targetStr = isAr
                        ? r.technologies?.ar
                        : r.technologies?.en;
                      const techArray =
                        typeof targetStr === "string"
                          ? targetStr
                              .split(",")
                              .map((t) => t.trim())
                              .filter(Boolean)
                          : Array.isArray(targetStr)
                            ? targetStr
                            : [];

                      return techArray.map((tech, index) => (
                        <span
                          key={index}
                          className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-300"
                        >
                          {tech}
                        </span>
                      ));
                    })()}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const techEn = Array.isArray(r.technologies?.en)
                          ? (r.technologies.en as string[]).join(", ")
                          : r.technologies?.en || "";
                        const techAr = Array.isArray(r.technologies?.ar)
                          ? (r.technologies.ar as string[]).join(", ")
                          : r.technologies?.ar || "";

                        setForm({
                          ...r,
                          technologies: { en: techEn, ar: techAr },
                        });
                        setEditId(r.id);
                      }}
                      className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white hover:bg-white/[0.08]"
                    >
                      <Pencil className="h-3 w-3" />
                      {t.edit}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(r.id)}
                      className="flex items-center gap-1.5 rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1.5 text-xs text-rose-200 hover:bg-rose-400/20"
                    >
                      <Trash2 className="h-3 w-3" />
                      {t.del}
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
