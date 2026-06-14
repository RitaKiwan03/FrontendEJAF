"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { loginAdmin } from "@/lib/admin-api";
import Link from "next/dist/client/link";
import { Shield, Eye, EyeOff, CheckCircle } from "lucide-react";

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

function generateMath() {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  const ops = ["+", "-", "*"] as const;
  const op = ops[Math.floor(Math.random() * ops.length)];
  let answer: number;
  if (op === "+") answer = a + b;
  else if (op === "-") answer = a - b;
  else answer = a * b;
  return { question: `${a} ${op} ${b}`, answer };
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang");
  const isAr = lang === "ar";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [math, setMath] = useState(generateMath);

  function handleCaptchaCheck() {
    const userAnswer = parseInt(captchaAnswer.trim());
    if (userAnswer === math.answer) {
      setCaptchaVerified(true);
      setCaptchaError("");
    } else {
      setCaptchaError(
        isAr ? "إجابة خاطئة، حاول مرة أخرى" : "Wrong answer, try again",
      );
      setMath(generateMath());
      setCaptchaAnswer("");
    }
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!captchaVerified) {
      setError(
        isAr ? "يرجى إكمال التحقق أولاً" : "Please complete verification first",
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
      await loginAdmin(username, password);
      router.push(lang ? `/admin/dashboard?lang=${lang}` : "/admin/dashboard");
    } catch {
      setError(
        isAr
          ? "اسم المستخدم أو كلمة المرور غير صحيحة"
          : "Invalid username or password",
      );
      setCaptchaVerified(false);
      setMath(generateMath());
      setCaptchaAnswer("");
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

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <label className="block space-y-1.5 text-sm text-slate-300">
            <span>{isAr ? "اسم المستخدم" : "Username"}</span>
            <input
              type="text"
              name="username"
              autoComplete="username"
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
                autoComplete="current-password"
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

          {/* CAPTCHA */}
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300 flex items-center gap-2">
              <Shield className="h-3.5 w-3.5" />
              {isAr ? "التحقق البشري" : "Human Verification"}
            </p>

            {captchaVerified ? (
              <div className="flex items-center gap-2 text-emerald-300 text-sm">
                <CheckCircle className="h-4 w-4" />
                {isAr ? "تم التحقق ✓" : "Verified ✓"}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-slate-300">
                  {isAr ? "احسب: " : "Calculate: "}
                  <span className="font-bold text-white text-lg mx-2">
                    {math.question} = ?
                  </span>
                </p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleCaptchaCheck())
                    }
                    className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-2 text-white outline-none focus:border-cyan-300/40"
                    placeholder={isAr ? "الإجابة" : "Answer"}
                  />
                  <button
                    type="button"
                    onClick={handleCaptchaCheck}
                    className="shrink-0 rounded-2xl bg-cyan-400/15 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-400/25 transition-colors"
                  >
                    {isAr ? "تحقق" : "Verify"}
                  </button>
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
            disabled={loading || !captchaVerified}
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
