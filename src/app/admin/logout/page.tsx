"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { logoutAdmin } from "@/lib/admin-api";
import { resolveLocale } from "@/lib/i18n";

const strings = {
  en: {
    sub: "Content Management System",
    title: "Sign out of EJAF Admin?",
    desc: "You will be returned to the login screen. Any unsaved changes will be lost.",
    cancel: "Cancel",
    confirm: "Sign out",
    dir: "ltr" as const,
  },
  ar: {
    sub: "نظام إدارة المحتوى",
    title: "هل تريد تسجيل الخروج؟",
    desc: "سيتم إعادتك إلى شاشة تسجيل الدخول. ستُفقد أي تغييرات غير محفوظة.",
    cancel: "إلغاء",
    confirm: "تسجيل الخروج",
    dir: "rtl" as const,
  },
};

function LogoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = resolveLocale(searchParams.get("lang"));
  const s = strings[locale];

  const handleLogout = async () => {
    await logoutAdmin();
    // الحفاظ على اللغة عند الرجوع لصفحة تسجيل الدخول
    router.push(locale === "ar" ? "/admin/login?lang=ar" : "/admin/login");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div
      dir={s.dir}
      className="min-h-screen bg-[#0f1117] flex flex-col items-center justify-center p-8"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 px-8 py-4 border-b border-[#2a2d3a] bg-[#0f1117] flex items-center justify-between">
        <div>
          <p className="text-white font-bold tracking-widest text-lg">EJAF</p>
          <p className="text-[#6b7280] text-xs">{s.sub}</p>
        </div>
      </div>

      {/* Card */}
      <div className="bg-[#181c27] border border-[#2a2d3a] rounded-2xl p-10 w-full max-w-md text-center mt-12">
        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-[#1e2133] border border-[#2a2d3a] flex items-center justify-center mx-auto mb-6">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f87171"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </div>

        <h1 className="text-[#e2e8f0] text-xl font-medium mb-3">{s.title}</h1>
        <p className="text-[#64748b] text-sm leading-relaxed mb-7">{s.desc}</p>

        {/* Buttons */}
        <div
          className={`flex gap-3 ${s.dir === "rtl" ? "flex-row-reverse" : ""}`}
        >
          <button
            onClick={handleCancel}
            className="flex-1 py-2.5 rounded-lg bg-[#1e2133] border border-[#2a2d3a] text-[#94a3b8] text-sm font-medium hover:bg-[#252a3a] transition-colors cursor-pointer"
          >
            {s.cancel}
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer"
          >
            {s.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LogoutPage() {
  return (
    <Suspense>
      <LogoutContent />
    </Suspense>
  );
}
