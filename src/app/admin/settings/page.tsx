"use client";

import { useState, useEffect, useRef } from "react";
import { AdminShell } from "@/components/admin-shell";
import { Check, Loader2, Upload, X } from "lucide-react";
import { getSettings, updateSettings, uploadLogo } from "@/lib/admin-api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type Props = { searchParams?: { lang?: string } };

export default function AdminSettingsPage({ searchParams }: Props) {
  const isAr = searchParams?.lang === "ar";

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconUrl, setFaviconUrl] = useState("");
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    try {
      const data = await getSettings();
      // فقط حدّث إذا القيمة موجودة — لا تُصفّر القيم الحالية
      if (data.phone !== undefined) setPhone(data.phone || "");
      if (data.email !== undefined) setEmail(data.email || "");
      if (data.logo_url) setLogoUrl(API_URL + data.logo_url);
      if (data.favicon_url) setFaviconUrl(API_URL + data.favicon_url);
    } catch {
      setError(isAr ? "فشل جلب الإعدادات" : "Failed to load settings");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateSettings({ phone, email }, isAr);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      // أعد جلب الإعدادات بعد الحفظ للتأكد
      await fetchSettings();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // preview مؤقت أثناء الرفع
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);

    setUploadingLogo(true);
    setError(null);
    try {
      const url = await uploadLogo(file, isAr);
      setLogoUrl(url);
      setLogoPreview(null);

      // إذا ليس GIF — حدّث الـ favicon تلقائياً
      const isGif = file.name.toLowerCase().endsWith(".gif");
      if (!isGif) {
        setFaviconUrl(url);
        updateFaviconInBrowser(url);
      }

      // أعد جلب الإعدادات للتأكد من حفظها
      await fetchSettings();
    } catch (err: any) {
      setError(err.message);
      setLogoPreview(null);
    } finally {
      setUploadingLogo(false);
      // صفّر الـ input لتمكين رفع نفس الملف مرة أخرى
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleFaviconChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setFaviconPreview(reader.result as string);
    reader.readAsDataURL(file);

    setUploadingFavicon(true);
    setError(null);
    try {
      const token = localStorage.getItem("ejaf_token");
      const formData = new FormData();
      formData.append("favicon", file);

      const res = await fetch(`${API_URL}/api/settings/favicon`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok)
        throw new Error(
          isAr ? "فشل رفع الـ Favicon" : "Failed to upload favicon",
        );

      const data = await res.json();
      const fullUrl = API_URL + data.url;
      setFaviconUrl(fullUrl);
      setFaviconPreview(null);
      updateFaviconInBrowser(fullUrl);

      // أعد جلب الإعدادات للتأكد
      await fetchSettings();
    } catch (err: any) {
      setError(err.message);
      setFaviconPreview(null);
    } finally {
      setUploadingFavicon(false);
      // صفّر الـ input
      if (faviconRef.current) faviconRef.current.value = "";
    }
  }

  function updateFaviconInBrowser(url: string) {
    document.querySelectorAll("link[rel*='icon']").forEach((el) => el.remove());
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = url + "?v=" + Date.now();
    document.head.appendChild(link);
  }

  const inputCls =
    "w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40";

  return (
    <AdminShell
      title={isAr ? "إعدادات الموقع" : "Site Settings"}
      description={
        isAr
          ? "تعديل معلومات الاتصال وشعار الموقع"
          : "Edit contact info and site logo"
      }
    >
      <div className="space-y-6">
        {error && (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {/* اللوغو */}
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-6">
              <p className="text-base font-semibold text-white mb-5">
                {isAr ? "شعار الموقع" : "Site Logo"}
              </p>
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-2xl border border-white/10 bg-slate-950/50 flex items-center justify-center overflow-hidden shrink-0">
                  {uploadingLogo ? (
                    <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
                  ) : logoPreview || logoUrl ? (
                    <img
                      src={logoPreview || logoUrl}
                      alt="Logo"
                      className="h-full w-full object-contain p-2"
                    />
                  ) : (
                    <p className="text-xs text-slate-500 text-center px-2">
                      {isAr ? "لا يوجد شعار" : "No logo"}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploadingLogo}
                    className="flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-400/20 transition-colors disabled:opacity-50"
                  >
                    <Upload className="h-4 w-4" />
                    {uploadingLogo
                      ? isAr
                        ? "جاري الرفع..."
                        : "Uploading..."
                      : isAr
                        ? "رفع شعار جديد"
                        : "Upload new logo"}
                  </button>
                  <p className="text-xs text-slate-500">
                    {isAr
                      ? "PNG, JPG, SVG, GIF, WebP — بحد أقصى 5MB"
                      : "PNG, JPG, SVG, GIF, WebP — max 5MB"}
                  </p>
                  {logoUrl && !uploadingLogo && (
                    <button
                      type="button"
                      onClick={() => {
                        setLogoUrl("");
                        setLogoPreview(null);
                      }}
                      className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition-colors"
                    >
                      <X className="h-3 w-3" />
                      {isAr ? "إزالة الشعار" : "Remove logo"}
                    </button>
                  )}
                </div>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".png,.jpg,.jpeg,.svg,.webp,.gif"
                onChange={handleLogoChange}
                className="hidden"
              />
            </div>

            {/* Favicon */}
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-6">
              <p className="text-base font-semibold text-white mb-1">
                {isAr ? "أيقونة الموقع (Favicon)" : "Site Favicon"}
              </p>
              <p className="text-xs text-slate-500 mb-5">
                {isAr
                  ? "تُحدَّث تلقائياً عند رفع اللوغو (ما عدا GIF)"
                  : "Auto-updated when uploading logo (except GIF)"}
              </p>
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 rounded-2xl border border-white/10 bg-slate-950/50 flex items-center justify-center overflow-hidden shrink-0">
                  {uploadingFavicon ? (
                    <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
                  ) : faviconPreview || faviconUrl ? (
                    <img
                      src={faviconPreview || faviconUrl}
                      alt="Favicon"
                      className="h-full w-full object-contain p-2"
                    />
                  ) : (
                    <p className="text-xs text-slate-500 text-center px-2">
                      {isAr ? "لا توجد أيقونة" : "No favicon"}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => faviconRef.current?.click()}
                    disabled={uploadingFavicon}
                    className="flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-400/20 transition-colors disabled:opacity-50"
                  >
                    <Upload className="h-4 w-4" />
                    {uploadingFavicon
                      ? isAr
                        ? "جاري الرفع..."
                        : "Uploading..."
                      : isAr
                        ? "رفع favicon مخصص"
                        : "Upload custom favicon"}
                  </button>
                  <p className="text-xs text-slate-500">
                    {isAr
                      ? "PNG, JPG, SVG, ICO — بحد أقصى 1MB (لا يدعم GIF)"
                      : "PNG, JPG, SVG, ICO — max 1MB (GIF not supported)"}
                  </p>
                </div>
              </div>
              <input
                ref={faviconRef}
                type="file"
                accept=".png,.jpg,.jpeg,.svg,.ico"
                onChange={handleFaviconChange}
                className="hidden"
              />
            </div>

            {/* معلومات الاتصال */}
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-6 space-y-4">
              <p className="text-base font-semibold text-white">
                {isAr ? "معلومات الاتصال" : "Contact Information"}
              </p>
              <label className="block space-y-1.5 text-sm text-slate-300">
                <span className="font-mono text-xs text-slate-500">
                  {isAr ? "رقم الهاتف" : "Phone number"}
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputCls}
                  placeholder="+964 (0)750-191-4252"
                  dir="ltr"
                />
              </label>
              <label className="block space-y-1.5 text-sm text-slate-300">
                <span className="font-mono text-xs text-slate-500">
                  {isAr ? "البريد الإلكتروني" : "Email address"}
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputCls}
                  placeholder="R.Awad@ejaftech.iq"
                  dir="ltr"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className={
                "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all disabled:opacity-60 " +
                (saved
                  ? "bg-emerald-400 text-slate-950"
                  : "bg-white text-slate-950 hover:-translate-y-0.5")
              }
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isAr ? "جاري الحفظ..." : "Saving..."}
                </>
              ) : saved ? (
                <>
                  <Check className="h-4 w-4" />
                  {isAr ? "تم الحفظ ✓" : "Saved ✓"}
                </>
              ) : isAr ? (
                "حفظ الإعدادات"
              ) : (
                "Save settings"
              )}
            </button>
          </form>
        )}
      </div>
    </AdminShell>
  );
}
