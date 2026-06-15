"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Shield, Mail, ArrowLeft } from "lucide-react";

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang");
  const isAr = lang === "ar";

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.05] p-8 shadow-[0_20px_80px_rgba(2,6,23,0.5)] backdrop-blur-xl sm:p-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Shield className="h-4 w-4 text-cyan-300" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">
            {isAr ? "إدارة EJAF" : "EJAF Admin"}
          </p>
        </div>

        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10">
          <Mail className="h-8 w-8 text-cyan-300" />
        </div>

        <h1 className="text-2xl font-semibold text-white mb-3">
          {isAr ? "نسيت كلمة المرور؟" : "Forgot your password?"}
        </h1>

        <p className="text-sm text-slate-400 leading-7 mb-6">
          {isAr
            ? "لإعادة تعيين كلمة المرور، تواصل مع مسؤول النظام عبر البريد الإلكتروني:"
            : "To reset your password, contact the system administrator at:"}
        </p>

        <a
          href="mailto:Rayan-Frihat@proton.me"
          className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-6 py-3 text-sm font-medium text-cyan-300 hover:bg-cyan-400/20 transition-colors"
        >
          <Mail className="h-4 w-4" />
          Rayan-Frihat@proton.me
        </a>

        <p className="mt-4 text-xs text-slate-500">
          {isAr
            ? "سيتم الرد عليك في أقرب وقت ممكن"
            : "You will receive a response as soon as possible"}
        </p>

        <div className="mt-8 border-t border-white/10 pt-6">
          <Link
            href={lang ? `/admin/login?lang=${lang}` : "/admin/login"}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {isAr ? "العودة لتسجيل الدخول" : "Back to login"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
