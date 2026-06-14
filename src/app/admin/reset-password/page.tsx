"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, RefreshCw, Check, X, ShieldCheck } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// ============================================================
// النصوص — عربي / إنجليزي
// ============================================================
const t = {
  brand: { ar: "إدارة EJAF", en: "EJAF Admin" },
  title: { ar: "إعادة تعيين كلمة المرور", en: "Reset Password" },
  subtitle: {
    ar: "أدخل بياناتك لتغيير كلمة المرور",
    en: "Enter your credentials to change your password",
  },
  username: { ar: "اسم المستخدم", en: "Username" },
  currentPass: { ar: "كلمة المرور الحالية", en: "Current Password" },
  newPass: { ar: "كلمة المرور الجديدة", en: "New Password" },
  confirmPass: { ar: "تأكيد كلمة المرور", en: "Confirm Password" },
  strengthLabel: { ar: "قوة كلمة المرور:", en: "Password strength:" },
  weak: { ar: "ضعيفة", en: "Weak" },
  medium: { ar: "متوسطة", en: "Medium" },
  strong: { ar: "قوية جداً", en: "Very strong" },
  rulesTitle: { ar: "الشروط", en: "Requirements" },
  rule1: { ar: "8 أحرف على الأقل", en: "At least 8 characters" },
  rule2: { ar: "حرف كبير (A-Z)", en: "Uppercase letter (A-Z)" },
  rule3: { ar: "حرف صغير (a-z)", en: "Lowercase letter (a-z)" },
  rule4: { ar: "رقم (0-9)", en: "Number (0-9)" },
  rule5: { ar: "رمز خاص (!@#$...)", en: "Special character (!@#$...)" },
  rule6: { ar: "تطابق تأكيد كلمة المرور", en: "Passwords match" },
  generate: { ar: "توليد كلمة مرور قوية", en: "Generate strong password" },
  copy: { ar: "نسخ", en: "Copy" },
  copied: { ar: "✓ تم النسخ", en: "✓ Copied" },
  back: { ar: "رجوع", en: "Back" },
  save: { ar: "حفظ كلمة المرور الجديدة", en: "Save new password" },
  saving: { ar: "جاري الحفظ...", en: "Saving..." },
  successTitle: { ar: "تم تغيير كلمة المرور!", en: "Password changed!" },
  successSub: {
    ar: "سيتم توجيهك لصفحة الدخول...",
    en: "Redirecting to login...",
  },
  errHuman: {
    ar: "يرجى إكمال التحقق من الهوية أولاً",
    en: "Please complete the verification first",
  },
  errRules: {
    ar: "كلمة المرور لا تستوفي الشروط",
    en: "Password does not meet requirements",
  },
  errDefault: { ar: "حدث خطأ", en: "An error occurred" },
  // HumanCheck
  verifyTitle: { ar: "التحقق من الهوية", en: "Human Verification" },
  verifyDesc: {
    ar: "أجب على السؤال للتأكد أنك لست روبوت:",
    en: "Answer the question to verify you're not a robot:",
  },
  verifyQuestion: { ar: "كم يساوي", en: "What is" },
  verifyPlaceholder: { ar: "الجواب", en: "Answer" },
  verifyBtn: { ar: "تحقق", en: "Verify" },
  verifySuccess: {
    ar: "تم التحقق — لست روبوت ✓",
    en: "Verified — you're not a robot ✓",
  },
  verifyError: {
    ar: "إجابة خاطئة، حاول مرة أخرى",
    en: "Wrong answer, try again",
  },
};

// ============================================================
// قياس قوة كلمة المرور
// ============================================================
function getStrength(password: string, isAr: boolean) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2)
    return { score, label: isAr ? t.weak.ar : t.weak.en, color: "bg-rose-500" };
  if (score <= 4)
    return {
      score,
      label: isAr ? t.medium.ar : t.medium.en,
      color: "bg-amber-400",
    };
  return {
    score,
    label: isAr ? t.strong.ar : t.strong.en,
    color: "bg-emerald-400",
  };
}

// ============================================================
// توليد كلمة مرور عشوائية قوية
// ============================================================
function generatePassword(): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  const symbols = "!@#$%^&*-_+=?";
  const all = upper + lower + digits + symbols;

  let pass = "";
  pass += upper[Math.floor(Math.random() * upper.length)];
  pass += lower[Math.floor(Math.random() * lower.length)];
  pass += digits[Math.floor(Math.random() * digits.length)];
  pass += symbols[Math.floor(Math.random() * symbols.length)];
  for (let i = 4; i < 16; i++) {
    pass += all[Math.floor(Math.random() * all.length)];
  }
  return pass
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

// ============================================================
// مكوّن التحقق "لست روبوت"
// ============================================================
function HumanCheck({
  onVerified,
  isAr,
}: {
  onVerified: (v: boolean) => void;
  isAr: boolean;
}) {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [challenge, setChallenge] = useState(() => {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    return { a, b, answer: String(a + b) };
  });
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  function verify() {
    setLoading(true);
    setTimeout(() => {
      if (input.trim() === challenge.answer) {
        setChecked(true);
        onVerified(true);
        setError(false);
      } else {
        setError(true);
        const a = Math.floor(Math.random() * 9) + 1;
        const b = Math.floor(Math.random() * 9) + 1;
        setChallenge({ a, b, answer: String(a + b) });
        setInput("");
        onVerified(false);
      }
      setLoading(false);
    }, 600);
  }

  if (checked) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
        <ShieldCheck className="h-4 w-4" />
        {isAr ? t.verifySuccess.ar : t.verifySuccess.en}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
        {isAr ? t.verifyTitle.ar : t.verifyTitle.en}
      </p>
      <p className="text-sm text-slate-300">
        {isAr ? t.verifyDesc.ar : t.verifyDesc.en}
      </p>
      <p className="text-lg font-semibold text-white">
        {isAr
          ? `كم يساوي ${challenge.a} + ${challenge.b} ؟`
          : `What is ${challenge.a} + ${challenge.b}?`}
      </p>
      <div className="flex gap-2">
        <input
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && verify()}
          placeholder={isAr ? t.verifyPlaceholder.ar : t.verifyPlaceholder.en}
          className="w-24 rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2 text-center text-white outline-none focus:border-cyan-300/40"
        />
        <button
          type="button"
          onClick={verify}
          disabled={loading || !input}
          className="rounded-full bg-cyan-400/15 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-400/25 disabled:opacity-50"
        >
          {loading ? "..." : isAr ? t.verifyBtn.ar : t.verifyBtn.en}
        </button>
      </div>
      {error && (
        <p className="text-xs text-rose-400">
          {isAr ? t.verifyError.ar : t.verifyError.en}
        </p>
      )}
    </div>
  );
}

// ============================================================
// الصفحة الرئيسية
// ============================================================
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang");
  const isAr = lang === "ar";

  const [username, setUsername] = useState("");
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [humanPassed, setHumanPassed] = useState(false);
  const [copied, setCopied] = useState(false);

  const strength = getStrength(newPass, isAr);

  const rules = [
    { label: isAr ? t.rule1.ar : t.rule1.en, ok: newPass.length >= 8 },
    { label: isAr ? t.rule2.ar : t.rule2.en, ok: /[A-Z]/.test(newPass) },
    { label: isAr ? t.rule3.ar : t.rule3.en, ok: /[a-z]/.test(newPass) },
    { label: isAr ? t.rule4.ar : t.rule4.en, ok: /[0-9]/.test(newPass) },
    { label: isAr ? t.rule5.ar : t.rule5.en, ok: /[^A-Za-z0-9]/.test(newPass) },
    {
      label: isAr ? t.rule6.ar : t.rule6.en,
      ok: newPass === confirmPass && confirmPass !== "",
    },
  ];

  const allRulesPassed = rules.every((r) => r.ok);

  function handleGenerate() {
    const pass = generatePassword();
    setNewPass(pass);
    setConfirmPass(pass);
    setShowNew(true);
    setShowConfirm(true);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(newPass);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!humanPassed) {
      setError(isAr ? t.errHuman.ar : t.errHuman.en);
      return;
    }
    if (!allRulesPassed) {
      setError(isAr ? t.errRules.ar : t.errRules.en);
      return;
    }
    setLoading(true);
    setError("");

    try {
      const loginRes = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: currentPass }),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok)
        throw new Error(
          loginData.message ||
            (isAr ? "بيانات الدخول غير صحيحة" : "Invalid credentials"),
        );

      const changeRes = await fetch(`${API_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginData.token}`,
        },
        body: JSON.stringify({
          current_password: currentPass,
          new_password: newPass,
          new_password_confirmation: confirmPass,
        }),
      });
      const changeData = await changeRes.json();
      if (!changeRes.ok)
        throw new Error(
          changeData.message ||
            (isAr ? "فشل تغيير كلمة المرور" : "Failed to change password"),
        );

      setSuccess(true);
      setTimeout(() => {
        router.push(lang ? `/admin/login?lang=${lang}` : "/admin/login");
      }, 2500);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : isAr
            ? t.errDefault.ar
            : t.errDefault.en,
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-[2rem] border border-emerald-400/20 bg-emerald-400/10 p-10 text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-emerald-400" />
          <h2 className="mt-4 text-2xl font-semibold text-white">
            {isAr ? t.successTitle.ar : t.successTitle.en}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {isAr ? t.successSub.ar : t.successSub.en}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-white/[0.05] p-8 shadow-[0_20px_80px_rgba(2,6,23,0.5)] backdrop-blur-xl sm:p-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">
          {isAr ? t.brand.ar : t.brand.en}
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
          {isAr ? t.title.ar : t.title.en}
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          {isAr ? t.subtitle.ar : t.subtitle.en}
        </p>

        {error && (
          <p className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-2.5 text-sm text-rose-300">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* اسم المستخدم */}
          <label className="block space-y-1.5 text-sm text-slate-300">
            <span>{isAr ? t.username.ar : t.username.en}</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40"
            />
          </label>

          {/* كلمة المرور الحالية */}
          <label className="block space-y-1.5 text-sm text-slate-300">
            <span>{isAr ? t.currentPass.ar : t.currentPass.en}</span>
            <input
              type="password"
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              required
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40"
              placeholder="••••••••"
            />
          </label>

          {/* كلمة المرور الجديدة */}
          <label className="block space-y-1.5 text-sm text-slate-300">
            <span>{isAr ? t.newPass.ar : t.newPass.en}</span>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                required
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 pr-12 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/40"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showNew ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </label>

          {/* مؤشر القوة */}
          {newPass && (
            <div className="space-y-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all ${i <= strength.score ? strength.color : "bg-white/10"}`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-400">
                {isAr ? t.strengthLabel.ar : t.strengthLabel.en}{" "}
                <span className="font-medium text-white">{strength.label}</span>
              </p>
            </div>
          )}

          {/* شروط كلمة المرور */}
          {newPass && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                {isAr ? t.rulesTitle.ar : t.rulesTitle.en}
              </p>
              {rules.map((rule) => (
                <div
                  key={rule.label}
                  className="flex items-center gap-2 text-xs"
                >
                  {rule.ok ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <X className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                  )}
                  <span
                    className={rule.ok ? "text-slate-300" : "text-slate-500"}
                  >
                    {rule.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* توليد كلمة مرور */}
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleGenerate}
              className="flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5 text-sm text-cyan-300 hover:bg-cyan-400/15 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              {isAr ? t.generate.ar : t.generate.en}
            </button>
            {newPass && (
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-full border border-white/10 px-4 py-2.5 text-sm text-slate-300 hover:text-white transition-colors"
              >
                {copied
                  ? isAr
                    ? t.copied.ar
                    : t.copied.en
                  : isAr
                    ? t.copy.ar
                    : t.copy.en}
              </button>
            )}
          </div>

          {/* تأكيد كلمة المرور */}
          <label className="block space-y-1.5 text-sm text-slate-300">
            <span>{isAr ? t.confirmPass.ar : t.confirmPass.en}</span>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                required
                className={`w-full rounded-2xl border px-4 py-3 pr-12 text-white outline-none placeholder:text-slate-500 bg-slate-950/70 focus:ring-1 ${
                  confirmPass && newPass === confirmPass
                    ? "border-emerald-400/40 focus:border-emerald-400/40 focus:ring-emerald-400/20"
                    : confirmPass
                      ? "border-rose-400/40 focus:border-rose-400/40 focus:ring-rose-400/20"
                      : "border-white/10 focus:border-cyan-300/40 focus:ring-cyan-300/20"
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </label>

          {/* التحقق من الهوية */}
          <HumanCheck onVerified={setHumanPassed} isAr={isAr} />

          {/* أزرار */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() =>
                router.push(lang ? `/admin/login?lang=${lang}` : "/admin/login")
              }
              className="rounded-full border border-white/10 px-5 py-3 text-sm text-white hover:bg-white/[0.06] transition-colors"
            >
              {isAr ? t.back.ar : t.back.en}
            </button>
            <button
              type="submit"
              disabled={loading || !humanPassed || !allRulesPassed}
              className="flex-1 rounded-full bg-white py-3 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? isAr
                  ? t.saving.ar
                  : t.saving.en
                : isAr
                  ? t.save.ar
                  : t.save.en}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
