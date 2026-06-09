"use client";

import { useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { AdminIconPicker } from "@/components/admin-icon-picker";
import { IconMark } from "@/components/icon-mark";
import { ImageUpload } from "@/components/image-upload";
import { createService, updateService, deleteService } from "@/lib/admin-api";

type ServiceRecord = {
  id: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  icon: string;
  gif: string;
};

type Props = { initial: ServiceRecord[]; isAr: boolean };

function empty(): ServiceRecord {
  return {
    id: "",
    title_en: "",
    title_ar: "",
    description_en: "",
    description_ar: "",
    icon: "Server",
    gif: "",
  };
}

export function AdminServicesCrud({ initial, isAr }: Props) {
  const [records, setRecords] = useState<ServiceRecord[]>(initial);
  const [form, setForm] = useState<ServiceRecord>(empty());
  const [editId, setEditId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !form.title_en.trim() ||
      !form.title_ar.trim() ||
      !form.description_en.trim() ||
      !form.description_ar.trim()
    ) {
      setError(
        isAr
          ? "يرجى تعبئة كافة حقول العناوين والوصف باللغتين!"
          : "Please fill in all title and description fields in both languages!",
      );
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      title_en: form.title_en,
      title_ar: form.title_ar,
      description_en: form.description_en,
      description_ar: form.description_ar,
      icon: form.icon,
      gif: form.gif || null,
    };

    try {
      if (editId) {
        const updated = await updateService(editId, payload, isAr);
        setRecords(records.map((r) => (r.id === editId ? { ...updated } : r)));
      } else {
        const created = await createService(payload, isAr);
        setRecords([
          ...records,
          {
            id: String(created.id),
            title_en: created.title_en,
            title_ar: created.title_ar,
            description_en: created.description_en,
            description_ar: created.description_ar,
            icon: created.icon,
            gif: created.gif || "",
          },
        ]);
      }

      setForm(empty());
      setEditId(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : isAr
            ? "حدث خطأ غير متوقع"
            : "An unexpected error occurred",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(isAr ? "هل أنت متأكد من الحذف؟" : "Are you sure?")) return;
    try {
      await deleteService(id, isAr);
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

  const t = {
    formTitle: isAr
      ? editId
        ? "تعديل خدمة"
        : "إضافة خدمة"
      : editId
        ? "Edit service"
        : "Add service",
    en: isAr ? "الإنجليزية" : "English",
    ar: isAr ? "العربية" : "Arabic",
    save: isAr ? "حفظ" : "Save",
    saved: isAr ? "تم الحفظ ✓" : "Saved ✓",
    cancel: isAr ? "إلغاء" : "Cancel",
    edit: isAr ? "تعديل" : "Edit",
    del: isAr ? "حذف" : "Delete",
    empty: isAr ? "لا توجد خدمات بعد" : "No services yet",
    tableTitle: isAr ? "العنوان" : "Title",
    tableIcon: isAr ? "الأيقونة" : "Icon",
    tableActions: isAr ? "الإجراءات" : "Actions",
  };

  const inputCls =
    "w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/40";
  const textCls = `${inputCls} resize-none`;

  return (
    <div className="space-y-6 text-left" dir="ltr">
      {error && (
        <p className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300 animate-pulse">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-6"
      >
        {/* العناوين والتحكم العلوي */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-base font-semibold text-white">{t.formTitle}</p>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setForm(empty());
                setEditId(null);
              }}
              className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5"
            >
              <X className="h-3 w-3" /> {t.cancel}
            </button>
          )}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* English fields */}
          <div className="space-y-3 rounded-[1.25rem] border border-white/10 bg-slate-950/50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
              {t.en} Content
            </p>
            <label className="block space-y-1.5 text-sm text-slate-300">
              <span className="font-mono text-xs text-slate-500">
                Service Title (EN)
              </span>
              <input
                type="text"
                value={form.title_en}
                onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                className={`${inputCls} text-left`}
                placeholder="e.g. Data Centers & Cloud"
              />
            </label>
            <label className="block space-y-1.5 text-sm text-slate-300">
              <span className="font-mono text-xs text-slate-500">
                Service Description (EN)
              </span>
              <textarea
                rows={3}
                value={form.description_en}
                onChange={(e) =>
                  setForm({ ...form, description_en: e.target.value })
                }
                className={`${textCls} text-left`}
                placeholder="Describe what this service provides in English..."
              />
            </label>
          </div>

          {/* Arabic fields */}
          <div className="space-y-3 rounded-[1.25rem] border border-white/10 bg-slate-950/50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300 text-right">
              المحتوى {t.ar}
            </p>
            <label className="block space-y-1.5 text-sm text-slate-300 text-right">
              <span className="font-mono text-xs text-slate-500 block">
                عنوان الخدمة (بالعربية)
              </span>
              <input
                type="text"
                value={form.title_ar}
                onChange={(e) => setForm({ ...form, title_ar: e.target.value })}
                className={`${inputCls} text-right`}
                dir="rtl"
                placeholder="مثال: مراكز البيانات والسحب الحسابية"
              />
            </label>
            <label className="block space-y-1.5 text-sm text-slate-300 text-right">
              <span className="font-mono text-xs text-slate-500 block">
                وصف الخدمة (بالعربية)
              </span>
              <textarea
                rows={3}
                value={form.description_ar}
                onChange={(e) =>
                  setForm({ ...form, description_ar: e.target.value })
                }
                className={`${textCls} text-right`}
                dir="rtl"
                placeholder="اشرح تفاصيل الخدمة وما تقدمه باللغة العربية هنا..."
              />
            </label>
          </div>
        </div>

        {/* 🌟 تعديل قسم الأيقونات والـ GIF ليبقى ثابتاً في اليسار كاملاً بدون انعكاس هيكلي */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {/* قسم الأيقونة */}
          <div className="space-y-1.5">
            <p className="font-mono text-xs text-slate-500">
              {isAr ? "أيقونة الخدمة" : "Service Icon"}
            </p>
            <div className="flex items-center gap-3 justify-start">
              <AdminIconPicker
                value={form.icon}
                onChange={(chosenIcon) =>
                  setForm((prev) => ({ ...prev, icon: chosenIcon }))
                }
              />
              {form.icon && <IconMark name={form.icon} />}
            </div>
          </div>

          {/* قسم رفع الصور الـ GIF */}
          <div className="space-y-1.5">
            <span className="font-mono text-xs text-slate-500 block">
              {isAr
                ? "ملف الشرح المرجعي GIF (اختياري)"
                : "Explainer GIF (Optional)"}
            </span>
            <ImageUpload
              value={form.gif}
              onChange={(url) => setForm({ ...form, gif: url || "" })}
              label={isAr ? "رفع ملف GIF" : "Upload GIF file"}
              isAr={isAr}
            />
          </div>
        </div>

        {/* زر الحفظ السفلي */}
        <div className="mt-5 flex gap-3 justify-start">
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all disabled:opacity-60 ${saved ? "bg-emerald-400 text-slate-950" : "bg-white text-slate-950 hover:-translate-y-0.5"}`}
          >
            {saved ? (
              <>
                <Check className="h-4 w-4" /> {t.saved}
              </>
            ) : loading ? (
              "..."
            ) : (
              t.save
            )}
          </button>
        </div>
      </form>

      {/* الجدول المعروض في الأسفل بقوائمه */}
      <div className="overflow-hidden rounded-[1.75rem] border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.04] text-[11px] uppercase tracking-[0.22em] text-cyan-300">
            <tr>
              <th className="px-5 py-3 text-left">{t.tableIcon}</th>
              <th className="px-5 py-3 text-left">{t.tableTitle}</th>
              <th className="px-5 py-3 text-right">{t.tableActions}</th>
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
                <td className="px-5 py-3 text-left">
                  <IconMark name={r.icon} />
                </td>
                <td className="px-5 py-3 text-left">
                  <p className="font-medium text-white">{r.title_en}</p>
                  {r.title_ar && (
                    <p
                      className="text-xs text-slate-400 mt-0.5 text-left"
                      dir="rtl"
                    >
                      {r.title_ar}
                    </p>
                  )}
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setForm(r);
                        setEditId(r.id);
                      }}
                      className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white hover:bg-white/[0.08]"
                    >
                      <Pencil className="h-3 w-3" /> {t.edit}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(r.id)}
                      className="flex items-center gap-1.5 rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1.5 text-xs text-rose-200 hover:bg-rose-400/20"
                    >
                      <Trash2 className="h-3 w-3" /> {t.del}
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
