"use client";
import { useState, useEffect, useRef } from "react";
import { AdminShell } from "@/components/admin-shell";
import {
  Check,
  Loader2,
  Upload,
  X,
  Plus,
  Trash2,
  ChevronDown,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import { getSettings, updateSettings, uploadLogo } from "@/lib/admin-api";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
type Props = { searchParams?: { lang?: string } };

// ✅ قائمة المنصات المتاحة
const SOCIAL_PLATFORMS = [
  { key: "facebook", label: "Facebook" },
  { key: "instagram", label: "Instagram" },
  { key: "twitter", label: "X (Twitter)" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "youtube", label: "YouTube" },
  { key: "tiktok", label: "TikTok" },
] as const;

type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number]["key"];

// ✅ أيقونات SVG للمنصات
const SocialIconSVG: Record<string, JSX.Element> = {
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  ),
};

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

  // ✅ حالات جديدة لإضافة الروابط
  const [showAddSocial, setShowAddSocial] = useState(false);
  const [selectedPlatform, setSelectedPlatform] =
    useState<SocialPlatform | null>(null);
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
  const [newSocialUrl, setNewSocialUrl] = useState("");

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
      SOCIAL_PLATFORMS.forEach(({ key }) => {
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

            {/* ✅ Social Media - Dynamic */}
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-6 space-y-4">
              <p className="text-base font-semibold text-white">
                {isAr ? "وسائل التواصل الاجتماعي" : "Social Media"}
              </p>

              {/* الروابط المضافة */}
              <div className="space-y-2">
                {Object.entries(socials)
                  .filter(([_, url]) => url)
                  .map(([key, url]) => {
                    const platform = SOCIAL_PLATFORMS.find(
                      (p) => p.key === key,
                    );
                    if (!platform) return null;

                    return (
                      <div
                        key={key}
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5"
                      >
                        <div className="flex items-center gap-2 text-cyan-300">
                          {SocialIconSVG[platform.key]}
                          <span className="text-sm font-medium text-white">
                            {platform.label}
                          </span>
                        </div>
                        <span className="flex-1 truncate text-sm text-slate-400 dir-ltr">
                          {url}
                        </span>
                        <button
                          type="button"
                          onClick={async () => {
                            // تحديث الـ state فوراً
                            setSocials((prev) => ({ ...prev, [key]: "" }));

                            // الحفظ في الـ Backend
                            try {
                              await updateSettings({ [key]: "" }, isAr);
                            } catch (err: any) {
                              setError(
                                err.message ||
                                  (isAr ? "فشل الحذف" : "Failed to delete"),
                              );
                              // استرجاع القيمة في حالة الفشل
                              setSocials((prev) => ({
                                ...prev,
                                [key]: socials[key],
                              }));
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
              </div>

              {/* زر إضافة رابط جديد */}
              {!showAddSocial ? (
                <button
                  type="button"
                  onClick={() => setShowAddSocial(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-400/20 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  {isAr ? "إضافة رابط" : "Add Link"}
                </button>
              ) : (
                /* نموذج الإضافة */
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-white">
                      {isAr ? "إضافة منصة جديدة" : "Add New Platform"}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddSocial(false);
                        setSelectedPlatform(null);
                        setNewSocialUrl("");
                        setShowPlatformDropdown(false);
                      }}
                      className="text-slate-500 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* ✅ التعديل الوحيد: من flex gap-2 إلى flex flex-col sm:flex-row gap-2 */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    {/* اختيار المنصة */}
                    <div className="relative w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() =>
                          setShowPlatformDropdown(!showPlatformDropdown)
                        }
                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white hover:bg-white/[0.08] transition-colors w-full sm:min-w-[140px] justify-between"
                      >
                        {selectedPlatform ? (
                          <div className="flex items-center gap-2">
                            {SocialIconSVG[selectedPlatform]}
                            <span>
                              {
                                SOCIAL_PLATFORMS.find(
                                  (p) => p.key === selectedPlatform,
                                )?.label
                              }
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-500">
                            {isAr ? "اختر المنصة" : "Select Platform"}
                          </span>
                        )}
                        <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
                      </button>

                      {/* القائمة المنسدلة */}
                      {showPlatformDropdown && (
                        <div className="absolute top-full left-0 right-0 sm:right-auto mt-1 z-50 rounded-xl border border-white/10 bg-[#181c27] shadow-xl">
                          <div className="max-h-64 overflow-auto py-1">
                            {SOCIAL_PLATFORMS.map((platform) => (
                              <button
                                key={platform.key}
                                type="button"
                                onClick={() => {
                                  setSelectedPlatform(platform.key);
                                  setShowPlatformDropdown(false);
                                }}
                                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/[0.05] transition-colors ${
                                  selectedPlatform === platform.key
                                    ? "bg-cyan-400/10 text-cyan-300"
                                    : "text-slate-300"
                                }`}
                              >
                                {SocialIconSVG[platform.key]}
                                <span>{platform.label}</span>
                                {socials[platform.key] && (
                                  <Check className="h-3.5 w-3.5 ml-auto text-emerald-400" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* حقل الرابط */}
                    <input
                      type="url"
                      value={newSocialUrl}
                      onChange={(e) => setNewSocialUrl(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40 dir-ltr"
                    />

                    {/* زر الإضافة */}
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedPlatform && newSocialUrl) {
                          setSocials((prev) => ({
                            ...prev,
                            [selectedPlatform]: newSocialUrl,
                          }));
                          setSelectedPlatform(null);
                          setNewSocialUrl("");
                          setShowAddSocial(false);
                        }
                      }}
                      disabled={!selectedPlatform || !newSocialUrl}
                      className="rounded-xl bg-cyan-400/15 px-4 py-2.5 text-sm text-cyan-300 hover:bg-cyan-400/25 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto flex items-center justify-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="sm:hidden">
                        {isAr ? "إضافة" : "Add"}
                      </span>
                    </button>
                  </div>
                </div>
              )}
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
                <>{isAr ? "تم الحفظ ✓" : "Saved ✓"}</>
              ) : isAr ? (
                "حفظ الإعدادات"
              ) : (
                "Save settings"
              )}
            </button>
          </form>
        )}
        {/* ── Change Password ── */}
        <ChangePassword isAr={isAr} />
      </div>
    </AdminShell>
  );
}

// ============================================================
// Change Password Component
// ============================================================
function ChangePassword({ isAr }: { isAr: boolean }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function generatePassword() {
    const chars =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%^&*";
    let pass = "";
    for (let i = 0; i < 16; i++)
      pass += chars[Math.floor(Math.random() * chars.length)];
    setNewPass(pass);
    setConfirmPass(pass);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPass !== confirmPass) {
      setError(isAr ? "كلمتا المرور غير متطابقتين" : "Passwords do not match");
      return;
    }
    if (newPass.length < 8) {
      setError(
        isAr
          ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل"
          : "Password must be at least 8 characters",
      );
      return;
    }
    setSaving(true);
    setError("");
    try {
      const token = localStorage.getItem("ejaf_token");
      const res = await fetch(`${API_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPass,
          new_password: newPass,
          new_password_confirmation: confirmPass,
        }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          data.message ||
            (isAr ? "فشل تغيير كلمة المرور" : "Failed to change password"),
        );
      setSaved(true);
      setCurrentPass("");
      setNewPass("");
      setConfirmPass("");
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const inputCls =
    "w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40";

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-6 space-y-4 mt-6">
      <p className="text-base font-semibold text-white">
        {isAr ? "تغيير كلمة المرور" : "Change Password"}
      </p>

      {error && (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
          ⚠️ {error}
        </div>
      )}
      {saved && (
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
          ✓{" "}
          {isAr
            ? "تم تغيير كلمة المرور بنجاح"
            : "Password changed successfully"}
        </div>
      )}

      <form
        onSubmit={handleChangePassword}
        className="space-y-4"
        autoComplete="off"
      >
        <div className="space-y-1.5">
          <label className="text-xs text-slate-500">
            {isAr ? "كلمة المرور الحالية" : "Current Password"}
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              required
              className={`${inputCls} pr-10`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowCurrent((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              {showCurrent ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-slate-500">
            {isAr ? "كلمة المرور الجديدة" : "New Password"}
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              required
              className={`${inputCls} pr-10`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              {showNew ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-slate-500">
            {isAr ? "تأكيد كلمة المرور" : "Confirm Password"}
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              required
              className={`${inputCls} pr-10`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              {showConfirm ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            type="button"
            onClick={generatePassword}
            className="flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-400/20 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            {isAr ? "توليد كلمة مرور" : "Generate password"}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-950 hover:-translate-y-0.5 transition-transform disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {saving
              ? isAr
                ? "جاري الحفظ..."
                : "Saving..."
              : isAr
                ? "تغيير كلمة المرور"
                : "Change password"}
          </button>
        </div>
      </form>
    </div>
  );
}
