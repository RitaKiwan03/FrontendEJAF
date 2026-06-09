"use client";

import { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin-shell";
import { Pencil, Trash2, Check, X, MapPin, Map, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from "@/lib/admin-api";

const LocationPicker = dynamic(() => import("@/components/location-picker"), {
  ssr: false,
  loading: () => (
    <div className="h-64 rounded-2xl border border-white/10 bg-slate-950/50 flex items-center justify-center">
      <p className="text-sm text-slate-500">Loading map...</p>
    </div>
  ),
});

type Location = {
  id: string;
  eyebrow_en: string;
  eyebrow_ar: string;
  title_en: string;
  title_ar: string;
  desc_en: string;
  desc_ar: string;
  mapUrl: string;
  location_name: string;
  lat: number | null;
  lng: number | null;
};

const empty = (): Location => ({
  id: "",
  eyebrow_en: "",
  eyebrow_ar: "",
  title_en: "",
  title_ar: "",
  desc_en: "",
  desc_ar: "",
  mapUrl: "",
  location_name: "",
  lat: null,
  lng: null,
});

function fromApi(item: any): Location {
  return {
    id: String(item.id),
    eyebrow_en: item.eyebrow_en || "",
    eyebrow_ar: item.eyebrow_ar || "",
    title_en: item.title_en || "",
    title_ar: item.title_ar || "",
    desc_en: item.desc_en || "",
    desc_ar: item.desc_ar || "",
    mapUrl: item.map_url || "",
    location_name: item.location_name || "",
    lat: item.lat ? parseFloat(item.lat) : null,
    lng: item.lng ? parseFloat(item.lng) : null,
  };
}

function toApi(form: Location) {
  return {
    eyebrow_en: form.eyebrow_en,
    eyebrow_ar: form.eyebrow_ar,
    title_en: form.title_en,
    title_ar: form.title_ar,
    desc_en: form.desc_en,
    desc_ar: form.desc_ar,
    map_url: form.mapUrl,
    location_name: form.location_name,
    lat: form.lat,
    lng: form.lng,
  };
}

export default function AdminLocationsPage({
  searchParams,
}: {
  searchParams?: { lang?: string };
}) {
  const isAr = searchParams?.lang === "ar";

  const [locations, setLocations] = useState<Location[]>([]);
  const [form, setForm] = useState<Location>(empty());
  const [editId, setEditId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab] = useState<"en" | "ar">("en");
  const [showMap, setShowMap] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  async function fetchLocations() {
    setLoading(true);
    setError(null);
    try {
      const data = await getLocations();
      setLocations(data.map(fromApi));
    } catch {
      setError("Failed to load locations.");
    } finally {
      setLoading(false);
    }
  }

  function handleLocationPicked(lat: number, lng: number, name?: string) {
    const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    setForm({ ...form, lat, lng, mapUrl, location_name: name || "" });
    setShowMap(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // 1. التحقق من وجود البيانات باللغتين
    const isMissingData =
      !form.title_en.trim() ||
      !form.title_ar.trim() ||
      !form.eyebrow_en.trim() ||
      !form.eyebrow_ar.trim();

    if (isMissingData) {
      setError(
        isAr
          ? "يرجى تعبئة كافة الحقول باللغتين العربية والإنجليزية."
          : "Please fill in all fields in both languages.",
      );
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const isEdit = !!editId;
      const saved_item = isEdit
        ? await updateLocation(editId, toApi(form))
        : await createLocation(toApi(form));

      // ... بقية كود النجاح كما هو ...

      setForm(empty());
      setEditId(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      // 2. رسالة خطأ ذكية حسب اللغة
      setError(
        isAr
          ? "حدث خطأ أثناء الحفظ، يرجى التأكد من ملء جميع الحقول."
          : "An error occurred while saving, please ensure all fields are filled.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ✅ يستخدم admin-api مع التوكن
  async function handleDelete(id: string) {
    if (!confirm(isAr ? "هل أنت متأكد؟" : "Are you sure?")) return;
    try {
      await deleteLocation(id);
      setLocations((prev) => prev.filter((l) => l.id !== id));
    } catch {
      setError("Failed to delete location.");
    }
  }

  const inputCls =
    "w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40";
  const textCls = inputCls + " resize-none";

  return (
    <AdminShell
      title={isAr ? "مواقع المكاتب" : "Office Locations"}
      description={
        isAr ? "إدارة مواقع مكاتب الشركة" : "Manage company office locations"
      }
    >
      <div className="space-y-6">
        {error && (
          <div className="mb-6 rounded-[1.25rem] border border-rose-400/20 bg-rose-400/10 px-6 py-4 text-sm text-rose-300 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-rose-400" />
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <p className="text-base font-semibold text-white">
              {editId
                ? isAr
                  ? "تعديل موقع"
                  : "Edit location"
                : isAr
                  ? "إضافة موقع"
                  : "Add location"}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTab("en")}
                className={
                  "rounded-full px-4 py-1.5 text-xs font-medium transition-colors " +
                  (tab === "en"
                    ? "bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-400/25"
                    : "text-slate-400 hover:text-white")
                }
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setTab("ar")}
                className={
                  "rounded-full px-4 py-1.5 text-xs font-medium transition-colors " +
                  (tab === "ar"
                    ? "bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-400/25"
                    : "text-slate-400 hover:text-white")
                }
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

          {tab === "en" ? (
            <div className="space-y-3 rounded-[1.25rem] border border-white/10 bg-slate-950/50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
                English
              </p>
              <label className="block space-y-1.5 text-sm text-slate-300">
                <span className="font-mono text-xs text-slate-500">
                  city name
                </span>
                <input
                  type="text"
                  value={form.eyebrow_en}
                  onChange={(e) =>
                    setForm({ ...form, eyebrow_en: e.target.value })
                  }
                  className={inputCls}
                  placeholder="Erbil"
                />
              </label>
              <label className="block space-y-1.5 text-sm text-slate-300">
                <span className="font-mono text-xs text-slate-500">
                  title (address)
                </span>
                <input
                  type="text"
                  value={form.title_en}
                  onChange={(e) =>
                    setForm({ ...form, title_en: e.target.value })
                  }
                  className={inputCls}
                  placeholder="Villa No. 384, G3 - Dream City"
                />
              </label>
              <label className="block space-y-1.5 text-sm text-slate-300">
                <span className="font-mono text-xs text-slate-500">
                  description
                </span>
                <textarea
                  rows={2}
                  value={form.desc_en}
                  onChange={(e) =>
                    setForm({ ...form, desc_en: e.target.value })
                  }
                  className={textCls}
                  placeholder="Primary office for project coordination..."
                />
              </label>
            </div>
          ) : (
            <div
              className="space-y-3 rounded-[1.25rem] border border-white/10 bg-slate-950/50 p-4"
              dir="rtl"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
                العربية
              </p>
              <label className="block space-y-1.5 text-sm text-slate-300">
                <span className="font-mono text-xs text-slate-500">
                  اسم المدينة
                </span>
                <input
                  type="text"
                  dir="rtl"
                  value={form.eyebrow_ar}
                  onChange={(e) =>
                    setForm({ ...form, eyebrow_ar: e.target.value })
                  }
                  className={inputCls + " text-right"}
                  placeholder="أربيل"
                />
              </label>
              <label className="block space-y-1.5 text-sm text-slate-300">
                <span className="font-mono text-xs text-slate-500">
                  العنوان
                </span>
                <input
                  type="text"
                  dir="rtl"
                  value={form.title_ar}
                  onChange={(e) =>
                    setForm({ ...form, title_ar: e.target.value })
                  }
                  className={inputCls + " text-right"}
                  placeholder="فيلا رقم 384، G3 - دريم سيتي"
                />
              </label>
              <label className="block space-y-1.5 text-sm text-slate-300">
                <span className="font-mono text-xs text-slate-500">الوصف</span>
                <textarea
                  rows={2}
                  dir="rtl"
                  value={form.desc_ar}
                  onChange={(e) =>
                    setForm({ ...form, desc_ar: e.target.value })
                  }
                  className={textCls + " text-right"}
                  placeholder="المكتب الرئيسي لتنسيق المشاريع..."
                />
              </label>
            </div>
          )}

          {/* Map Picker */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-slate-500">
                {isAr ? "الموقع على الخريطة" : "Location on map"}
              </span>
              <button
                type="button"
                onClick={() => setShowMap(!showMap)}
                className="flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs text-cyan-300 hover:bg-cyan-400/20 transition-colors"
              >
                <Map className="h-3.5 w-3.5" />
                {showMap
                  ? isAr
                    ? "إخفاء الخريطة"
                    : "Hide map"
                  : isAr
                    ? "تحديد على الخريطة"
                    : "Pick on map"}
              </button>
            </div>

            {form.lat && form.lng && (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2.5">
                <MapPin className="h-4 w-4 text-emerald-300 shrink-0" />
                <p className="text-sm font-medium text-emerald-300 truncate">
                  {form.location_name ||
                    `${form.lat.toFixed(4)}, ${form.lng.toFixed(4)}`}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      lat: null,
                      lng: null,
                      mapUrl: "",
                      location_name: "",
                    })
                  }
                  className="ml-auto text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {showMap && (
              <div className="rounded-2xl overflow-hidden border border-white/10">
                <LocationPicker
                  initialLat={form.lat ?? 33.3152}
                  initialLng={form.lng ?? 44.3661}
                  onPick={handleLocationPicked}
                />
              </div>
            )}
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className={
                "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all disabled:opacity-60 " +
                (saved
                  ? "bg-emerald-400 text-slate-950"
                  : "bg-white text-slate-950 hover:-translate-y-0.5")
              }
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                </>
              ) : saved ? (
                <>
                  <Check className="h-4 w-4" />
                  {isAr ? "تم الحفظ ✓" : "Saved ✓"}
                </>
              ) : isAr ? (
                "حفظ"
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-5 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-cyan-300 shrink-0" />
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                      {isAr ? loc.eyebrow_ar : loc.eyebrow_en}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setForm(loc);
                        setEditId(loc.id);
                        setTab("en");
                        setShowMap(false);
                      }}
                      className="rounded-xl border border-white/10 p-1.5 text-slate-400 hover:text-white transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(loc.id)}
                      className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-1.5 text-rose-300 hover:bg-rose-400/20 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-sm font-medium text-white">
                  {isAr ? loc.title_ar : loc.title_en}
                </p>
                <p className="text-xs leading-6 text-slate-400">
                  {isAr ? loc.desc_ar : loc.desc_en}
                </p>
                {loc.lat && loc.lng && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.location_name || `${loc.lat},${loc.lng}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <MapPin className="h-3 w-3" />
                    {isAr ? "عرض على الخريطة ↗" : "View on map ↗"}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
