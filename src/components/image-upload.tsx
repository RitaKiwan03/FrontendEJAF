"use client";

import { useState } from "react";
import { uploadFile } from "@/lib/admin-api";

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  isAr?: boolean; // 🌟 أضفنا الخاصية هنا لاستقبال حالة اللغة
};

export function ImageUpload({
  value,
  onChange,
  label = "image",
  isAr = false,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // قاموس نصوص المكون المترجم ديناميكياً
  const txt = {
    uploading: isAr ? "جاري الرفع..." : "Uploading...",
    placeholder: isAr
      ? "اختر صورة أو اسحبها هنا"
      : "Choose an image or drag it here",
    btnUpload: isAr ? "رفع" : "Upload",
    btnDelete: isAr ? "حذف" : "Delete",
    manualUrl: isAr
      ? "أو ضع رابط الصورة يدوياً..."
      : "Or paste image URL manually...",
    fail: isAr ? "فشل الرفع" : "Upload failed",
  };

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const url = await uploadFile(file);
      onChange(url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : txt.fail);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2" dir={isAr ? "rtl" : "ltr"}>
      <p className="font-mono text-xs text-slate-500 text-inherit">{label}</p>

      {/* معاينة الصورة */}
      {value && (
        <div className="relative h-32 w-full overflow-hidden rounded-2xl border border-white/10">
          <img
            src={value}
            alt="preview"
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className={`absolute top-2 rounded-full bg-rose-500/80 px-2 py-1 text-xs text-white ${isAr ? "left-2" : "right-2"}`}
          >
            {txt.btnDelete}
          </button>
        </div>
      )}

      {/* زر الرفع */}
      <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-white/20 bg-white/[0.03] px-4 py-3 transition-colors hover:border-cyan-400/30 hover:bg-white/[0.06]">
        <span className="text-sm text-slate-400">
          {uploading ? txt.uploading : txt.placeholder}
        </span>
        <span
          className={`${isAr ? "mr-auto" : "ml-auto"} rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-slate-300`}
        >
          {uploading ? "..." : txt.btnUpload}
        </span>
        <input
          type="file"
          accept="image/jpg,image/jpeg,image/png,image/gif,image/svg+xml,image/webp"
          onChange={handleFile}
          disabled={uploading}
          className="hidden"
        />
      </label>

      {/* رابط يدوي بديل */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={txt.manualUrl}
        className={`w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40 ${isAr ? "text-right" : "text-left"}`}
      />

      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}
