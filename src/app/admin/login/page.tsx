"use client"; // ← هذا السطر مهم جداً

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { loginAdmin } from "@/lib/admin-api";
import Link from "next/dist/client/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang");
  const isAr = lang === "ar";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const username = (form.elements.namedItem("username") as HTMLInputElement)
      .value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    try {
      await loginAdmin(username, password);
      router.push(lang ? `/admin/dashboard?lang=${lang}` : "/admin/dashboard");
    } catch (err: unknown) {
      // 🌟 التعديل هنا: نتحكم في نص الرسالة بناءً على اللغة المحددة
      const errorMessage = isAr
        ? "اسم المستخدم أو كلمة المرور غير صحيحة"
        : "Invalid username or password";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.05] p-8 shadow-[0_20px_80px_rgba(2,6,23,0.5)] backdrop-blur-xl sm:p-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">
          {isAr ? "إدارة EJAF" : "EJAF Admin"}
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
          {isAr ? "تسجيل الدخول" : "Sign in"}
        </h1>

        {error && (
          <p className="mt-3 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-sm text-rose-300">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <label className="block space-y-1.5 text-sm text-slate-300">
            <span>{isAr ? "اسم المستخدم" : "Username"}</span>
            <input
              type="text"
              name="username"
              autoComplete="username"
              required
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-1 focus:ring-cyan-300/20"
              placeholder={isAr ? "اسم المستخدم" : "Admin username"}
            />
          </label>
          <label className="block space-y-1.5 text-sm text-slate-300">
            <span>{isAr ? "كلمة المرور" : "Password"}</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-1 focus:ring-cyan-300/20"
              placeholder="••••••••"
            />
          </label>
          <Link
            href={
              lang
                ? `/admin/reset-password?lang=${lang}`
                : "/admin/reset-password"
            }
            className="block mt-2 text-xs text-slate-500 hover:text-cyan-300 transition-colors"
          >
            {isAr ? "نسيت كلمة المرور؟" : "Forgot password?"}
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-full bg-white py-3 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5 hover:bg-cyan-50 disabled:opacity-60"
          >
            {loading
              ? isAr
                ? "جاري الدخول..."
                : "Signing in..."
              : isAr
                ? "دخول"
                : "Enter workspace"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
