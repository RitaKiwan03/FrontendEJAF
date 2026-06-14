"use client";

import { useState, useEffect, useRef } from "react";
import { AdminShell } from "@/components/admin-shell";
import {
  Check,
  Loader2,
  Upload,
  X,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
} from "lucide-react";
import { getSettings, updateSettings, uploadLogo } from "@/lib/admin-api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type Props = { searchParams?: { lang?: string } };

const SOCIAL_FIELDS = [
  {
    key: "facebook",
    label: "Facebook",
    placeholder: "https://facebook.com/ejaftech",
  },
  {
    key: "instagram",
    label: "Instagram",
    placeholder: "https://instagram.com/ejaftech",
  },
  {
    key: "twitter",
    label: "X (Twitter)",
    placeholder: "https://x.com/ejaftech",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    placeholder: "https://linkedin.com/company/ejaftech",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    placeholder: "https://wa.me/9647501914252",
  },
  {
    key: "youtube",
    label: "YouTube",
    placeholder: "https://youtube.com/@ejaftech",
  },
  {
    key: "tiktok",
    label: "TikTok",
    placeholder: "https://tiktok.com/@ejaftech",
  },
];

export default function AdminSettingsPage({ searchParams }: Props) {
  const isAr = searchParams?.lang === "ar";

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [socials, setSocials] = useState<Record<string, string>>({});
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
      if (data.phone !== undefined) setPhone(data.phone || "");
      if (data.email !== undefined) setEmail(data.email || "");
      if (data.logo_url)
        setLogoUrl(
          data.logo_url.startsWith("http")
            ? data.logo_url
            : API_URL + data.logo_url,
        );
      if (data.favicon_url)
        setFaviconUrl(
          data.favicon_url.startsWith("http")
            ? data.favicon_url
            : API_URL + data.favicon_url,
        );

      // ✅ جلب Social Media
      const socialData: Record<string, string> = {};
      SOCIAL_FIELDS.forEach(({ key }) => {
        socialData[key] = data[key] || "";
      });
      setSocials(socialData);
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
      await updateSettings({ phone, email, ...socials }, isAr);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
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
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
    setUploadingLogo(true);
    setError(null);
    try {
      const url = await uploadLogo(file, isAr);
      setLogoUrl(url);
      setLogoPreview(null);
      const isGif = file.name.toLowerCase().endsWith(".gif");
      if (!isGif) {
        setFaviconUrl(url);
        updateFaviconInBrowser(url);
      }
      await fetchSettings();
    } catch (err: any) {
      setError(err.message);
      setLogoPreview(null);
    } finally {
      setUploadingLogo(false);
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
      const fullUrl = data.url.startsWith("http")
        ? data.url
        : API_URL + data.url;
      setFaviconUrl(fullUrl);
      setFaviconPreview(null);
      updateFaviconInBrowser(fullUrl);
      await fetchSettings();
    } catch (err: any) {
      setError(err.message);
      setFaviconPreview(null);
    } finally {
      setUploadingFavicon(false);
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
                      ? "PNG, JPG, SVG, ICO — بحد أقصى 1MB"
                      : "PNG, JPG, SVG, ICO — max 1MB"}
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

            {/* ✅ Social Media */}
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-6 space-y-4">
              <p className="text-base font-semibold text-white">
                {isAr ? "وسائل التواصل الاجتماعي" : "Social Media"}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {SOCIAL_FIELDS.map(({ key, label, placeholder }) => (
                  <label
                    key={key}
                    className="block space-y-1.5 text-sm text-slate-300"
                  >
                    <span className="font-mono text-xs text-slate-500">
                      {label}
                    </span>
                    <input
                      type="url"
                      value={socials[key] || ""}
                      onChange={(e) =>
                        setSocials((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                      className={inputCls}
                      placeholder={placeholder}
                      dir="ltr"
                    />
                  </label>
                ))}
              </div>
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
