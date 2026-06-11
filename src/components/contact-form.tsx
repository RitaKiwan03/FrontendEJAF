"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const COUNTRY_CODES = [
  { code: "+964", flag: "🇮🇶", name: "Iraq" },
  { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+962", flag: "🇯🇴", name: "Jordan" },
  { code: "+965", flag: "🇰🇼", name: "Kuwait" },
  { code: "+968", flag: "🇴🇲", name: "Oman" },
  { code: "+974", flag: "🇶🇦", name: "Qatar" },
  { code: "+973", flag: "🇧🇭", name: "Bahrain" },
  { code: "+963", flag: "🇸🇾", name: "Syria" },
  { code: "+961", flag: "🇱🇧", name: "Lebanon" },
  { code: "+20", flag: "🇪🇬", name: "Egypt" },
  { code: "+90", flag: "🇹🇷", name: "Turkey" },
  { code: "+98", flag: "🇮🇷", name: "Iran" },
  { code: "+44", flag: "🇬🇧", name: "UK" },
  { code: "+1", flag: "🇺🇸", name: "USA" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "+33", flag: "🇫🇷", name: "France" },
];

type ContactFormProps = {
  namePlaceholder?: string;
  emailPlaceholder?: string;
  subjectPlaceholder?: string;
  messagePlaceholder?: string;
  submitLabel?: string;
  isAr?: boolean;
};

export function ContactForm({
  namePlaceholder = "Your name",
  emailPlaceholder = "Email address",
  subjectPlaceholder = "Subject",
  messagePlaceholder = "Tell us about your project",
  submitLabel = "Send message",
  isAr = false,
}: ContactFormProps) {
  const [phoneCode, setPhoneCode] = useState("+964");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState<{ phone?: string; email?: string }>(
    {},
  );

  // ✅ جلب الإعدادات من قاعدة البيانات
  useEffect(() => {
    fetch(`${API_URL}/api/settings`)
      .then((r) => r.json())
      .then((data) => setSettings(data))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const payload = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone_code: phoneCode,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement)
        .value,
    };

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(isAr ? "فشل الإرسال" : "Failed to send");
      setSuccess(true);
      form.reset();
      setPhoneCode("+964");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : isAr
            ? "حدث خطأ، حاول مرة أخرى"
            : "An error occurred, please try again",
      );
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-1 focus:ring-cyan-300/20";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-[0_20px_50px_rgba(2,6,23,0.28)] backdrop-blur-xl sm:p-8"
    >
      {success && (
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
          ✓{" "}
          {isAr
            ? "تم إرسال رسالتك بنجاح! سنتواصل معك قريباً."
            : "Message sent successfully! We'll be in touch soon."}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="text"
          name="name"
          required
          autoComplete="name"
          className={inputCls}
          placeholder={namePlaceholder}
        />
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className={inputCls}
          placeholder={emailPlaceholder}
        />
      </div>

      <div className="flex gap-2">
        <select
          value={phoneCode}
          onChange={(e) => setPhoneCode(e.target.value)}
          className="w-28 shrink-0 rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-3 text-sm text-white outline-none focus:border-cyan-300/40 cursor-pointer"
        >
          {COUNTRY_CODES.map((c) => (
            <option key={c.code} value={c.code} className="bg-slate-900">
              {c.flag} {c.code}
            </option>
          ))}
        </select>
        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          className={`${inputCls} flex-1`}
          placeholder={
            isAr ? "رقم الهاتف (اختياري)" : "Phone number (optional)"
          }
        />
      </div>

      <input
        type="text"
        name="subject"
        required
        className={inputCls}
        placeholder={subjectPlaceholder}
      />

      <textarea
        name="message"
        rows={5}
        required
        className={`${inputCls} min-h-40 resize-none`}
        placeholder={messagePlaceholder}
      />

      {/* ✅ الإيميل الديناميكي */}
      {settings.email && (
        <p className="text-xs text-slate-500">
          {isAr ? "أو راسلنا مباشرة على" : "Or reach us directly at"}{" "}
          <a
            href={"mailto:" + settings.email}
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {settings.email}
          </a>
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-cyan-50 disabled:opacity-60"
      >
        {loading ? (isAr ? "جاري الإرسال..." : "Sending...") : submitLabel}
      </button>
    </form>
  );
}
