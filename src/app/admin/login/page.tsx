"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { loginAdmin, getCaptcha } from "@/lib/admin-api";
import Link from "next/dist/client/link";
import { Shield, Eye, EyeOff, Loader2 } from "lucide-react";

function sanitizeInput(input: string): string {
  return input
    .replace(/[<>'"`;]/g, "")
    .replace(
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC|SCRIPT)\b)/gi,
      "",
    )
    .trim();
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

  // ✅ CAPTCHA — يأتي من السيرفر، الإجابة الصحيحة لا تصل للمتصفح أبداً
  const [captcha, setCaptcha] = useState<{
    captcha_id: string;
    question: string;
  } | null>(null);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaLoading, setCaptchaLoading] = useState(true);

  async function loadCaptcha() {
    setCaptchaLoading(true);
    try {
      const c = await getCaptcha();
      setCaptcha(c);
      setCaptchaAnswer("");
    } catch {
      setError(
        isAr
          ? "فشل تحميل التحقق الأمني، أعد تحميل الصفحة"
          : "Failed to load verification, please reload the page",
      );
    } finally {
      setCaptchaLoading(false);
    }
  }

  // ✅ تحميل CAPTCHA عند فتح الصفحة
  useEffect(() => {
    loadCaptcha();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!captcha) {
      setError(
        isAr
          ? "يرجى الانتظار حتى يكتمل التحميل"
          : "Please wait for verification to load",
      );
      return;
    }

    if (!captchaAnswer.trim()) {
      setError(
        isAr
          ? "يرجى الإجابة على سؤال التحقق"
          : "Please answer the verification question",
      );
      return;
    }

    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const rawUser = (form.elements.namedItem("username") as HTMLInputElement)
      .value;
    const rawPass = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    const username = sanitizeInput(rawUser);
    const password = sanitizeInput(rawPass);

    if (!isValidUsername(username)) {
      setError(
        isAr
          ? "اسم المستخدم يجب أن يكون بحروف صغيرة فقط"
          : "Username must be lowercase only",
      );
      setLoading(false);
      return;
    }

    try {
      // ✅ التحقق الفعلي من CAPTCHA يحدث على السيرفر هنا
      await loginAdmin(
        username,
        password,
        captcha.captcha_id,
        captchaAnswer,
        isAr,
      );
      router.push(lang ? `/admin/dashboard?lang=${lang}` : "/admin/dashboard");
    } catch (err: any) {
      // رسالة السيرفر إن وُجدت (مثل "فشل التحقق الأمني")، وإلا رسالة عامة
      setError(
        err?.message ||
          (isAr
            ? "اسم المستخدم أو كلمة المرور غير صحيحة"
            : "Invalid username or password"),
      );

      // ✅ CAPTCHA تُستخدم مرة واحدة — حمّل سؤالاً جديداً بعد أي فشل
      await loadCaptcha();
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

        {/* ✅ method="post" + autoComplete="off" على الفورم بالكامل */}
        <form
          onSubmit={handleLogin}
          method="post"
          autoComplete="off"
          className="mt-8 space-y-4"
        >
          <label className="block space-y-1.5 text-sm text-slate-300">
            <span>{isAr ? "اسم المستخدم" : "Username"}</span>
            {/* ✅ لا يوجد placeholder — لا تلميح عن اسم المستخدم الصحيح */}
            <input
              type="text"
              name="username"
              autoComplete="off"
              required
              onChange={(e) => {
                e.target.value = e.target.value.toLowerCase();
              }}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-1 focus:ring-cyan-300/20"
            />
          </label>

          <label className="block space-y-1.5 text-sm text-slate-300">
            <span>{isAr ? "كلمة المرور" : "Password"}</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="off"
                required
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 pr-12 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-1 focus:ring-cyan-300/20"
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

          {/* ✅ CAPTCHA — السؤال من السيرفر فقط */}
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300 flex items-center gap-2">
              <Shield className="h-3.5 w-3.5" />
              {isAr ? "التحقق البشري" : "Human Verification"}
            </p>

            {captchaLoading ? (
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                {isAr ? "جاري تحميل السؤال..." : "Loading question..."}
              </div>
            ) : captcha ? (
              <div className="space-y-2">
                <p className="text-sm text-slate-300">
                  {isAr ? "احسب: " : "Calculate: "}
                  <span className="font-bold text-white text-lg mx-2">
                    {captcha.question} = ?
                  </span>
                </p>
                <input
                  type="number"
                  name="captcha_answer"
                  autoComplete="off"
                  required
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-2 text-white outline-none focus:border-cyan-300/40"
                  placeholder={isAr ? "الإجابة" : "Answer"}
                />
              </div>
            ) : (
              <p className="text-sm text-rose-300">
                {isAr ? "تعذر تحميل السؤال" : "Could not load question"}
              </p>
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
            disabled={loading || captchaLoading || !captcha}
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
