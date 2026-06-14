"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { loginAdmin } from "@/lib/admin-api";
import Link from "next/link";
import { Shield, Eye, EyeOff, CheckCircle, RefreshCw } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

function sanitizeInput(input: string): string {
  return input.replace(/[<>'"`;]/g, "").trim();
}

function isValidUsername(username: string): boolean {
  return /^[a-z0-9_]+$/.test(username);
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang");
  const isAr = lang === "ar";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ✅ CAPTCHA من الـ server
  const [captchaId, setCaptchaId] = useState("");
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [captchaLoading, setCaptchaLoading] = useState(true);

  // ✅ جلب CAPTCHA من الـ server
  async function fetchCaptcha() {
    setCaptchaLoading(true);
    setCaptchaError("");
    setCaptchaAnswer("");
    try {
      const res = await fetch(`${API_URL}/api/auth/captcha`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setCaptchaId(data.captcha_id);
      setCaptchaQuestion(data.question);
    } catch {
      setCaptchaError(isAr ? "فشل تحميل التحقق" : "Failed to load captcha");
    } finally {
      setCaptchaLoading(false);
    }
  }

  useEffect(() => {
    fetchCaptcha();
  }, []);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const rawUser = (form.elements.namedItem("username") as HTMLInputElement)
      .value;
    const rawPass = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    const username = sanitizeInput(rawUser);
    const password = sanitizeInput(rawPass);

    if (!isValidUsername(username)) {
      setError(isAr ? "اسم المستخدم غير صالح" : "Invalid username format");
      return;
    }

    if (!captchaId || !captchaAnswer) {
      setError(
        isAr ? "يرجى إكمال التحقق أولاً" : "Please complete verification first",
      );
      return;
    }

    setLoading(true);

    try {
      await loginAdmin(username, password, captchaId, parseInt(captchaAnswer));
      router.push(lang ? `/admin/dashboard?lang=${lang}` : "/admin/dashboard");
    } catch (err: any) {
      setError(
        err.message ||
          (isAr ? "بيانات الدخول غير صحيحة" : "Invalid credentials"),
      );
      // ✅ جلب CAPTCHA جديد عند الفشل
      await fetchCaptcha();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.05] p-8 shadow-[0_20px_80px_rgba(2,6,23,0.5)] backdrop-blur-xl sm:p-10">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="h-4 w-4 text-cyan-300" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">
            {isAr ? "إدارة EJAF" : "EJAF Admin"}
          </p>
        </div>
        <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
          {isAr ? "تسجيل الدخول" : "Sign in"}
        </h1>

        {error && (
          <p className="mt-3 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-sm text-rose-300">
            {error}
          </p>
        )}

        {/* ✅ method POST + autoComplete off */}
        <form
          onSubmit={handleLogin}
          method="post"
          autoComplete="off"
          className="mt-8 space-y-4"
        >
          {/* ✅ بدون placeholder لمنع تلميح اسم المستخدم */}
          <label className="block space-y-1.5 text-sm text-slate-300">
            <span>{isAr ? "اسم المستخدم" : "Username"}</span>
            <input
              type="text"
              name="username"
              autoComplete="off"
              required
              onChange={(e) => {
                e.target.value = e.target.value.toLowerCase();
              }}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300/40 focus:ring-1 focus:ring-cyan-300/20"
            />
          </label>

          <label className="block space-y-1.5 text-sm text-slate-300">
            <span>{isAr ? "كلمة المرور" : "Password"}</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                required
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 pr-12 text-white outline-none focus:border-cyan-300/40 focus:ring-1 focus:ring-cyan-300/20"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </label>

          {/* ✅ CAPTCHA من الـ server */}
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300 flex items-center gap-2">
              <Shield className="h-3.5 w-3.5" />
              {isAr ? "التحقق البشري" : "Human Verification"}
            </p>

            {captchaLoading ? (
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <RefreshCw className="h-4 w-4 animate-spin" />
                {isAr ? "جاري التحميل..." : "Loading..."}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-300">
                    {isAr ? "احسب: " : "Calculate: "}
                    <span className="font-bold text-white text-lg mx-2">
                      {captchaQuestion} = ?
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={fetchCaptcha}
                    className="text-slate-500 hover:text-cyan-300 transition-colors"
                    title={isAr ? "تحديث" : "Refresh"}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleLogin(e as any))
                    }
                    className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-2 text-white outline-none focus:border-cyan-300/40"
                    placeholder={isAr ? "الإجابة" : "Answer"}
                  />
                </div>
                {captchaError && (
                  <p className="text-xs text-rose-300">{captchaError}</p>
                )}
              </div>
            )}
          </div>

          <Link
            href={
              lang
                ? `/admin/reset-password?lang=${lang}`
                : "/admin/reset-password"
            }
            className="block text-xs text-slate-500 hover:text-cyan-300 transition-colors"
          >
            {isAr ? "نسيت كلمة المرور؟" : "Forgot password?"}
          </Link>

          <button
            type="submit"
            disabled={loading || captchaLoading || !captchaId}
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
