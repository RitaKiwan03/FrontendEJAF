"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Shield,
  AlertTriangle,
  LogOut,
  Loader2,
  CheckCircle,
  Key,
  Users,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// ✅ النصوص - عربي / إنجليزي
const t = {
  title: { ar: "صفحة الاسترجاع السرية", en: "Emergency Recovery" },
  subtitle: {
    ar: "أدخل كود الاسترجاع للمتابعة",
    en: "Enter recovery code to continue",
  },
  warning: {
    ar: "هذه الصفحة سرية. أدخل كود الاسترجاع للمتابعة.",
    en: "This page is secret. Enter recovery code to continue.",
  },
  recoveryCode: { ar: "كود الاسترجاع", en: "Recovery Code" },
  placeholder: { ar: "أدخل كود الاسترجاع...", en: "Enter recovery code..." },
  enter: { ar: "دخول", en: "Enter" },
  verifying: { ar: "جاري التحقق...", en: "Verifying..." },
  users: { ar: "المستخدمون", en: "Users" },
  resetModerator: {
    ar: "إعادة تعيين كلمة مرور المشرف",
    en: "Reset Moderator Password",
  },
  adminPassword: { ar: "كلمة مرور الأدمن", en: "Admin Password" },
  moderatorUsername: { ar: "اسم المستخدم للمشرف", en: "Moderator Username" },
  newPassword: { ar: "كلمة المرور الجديدة", en: "New Password" },
  reset: { ar: "إعادة التعيين", en: "Reset" },
  resetting: { ar: "جاري...", en: "Resetting..." },
  forceLogout: {
    ar: "تسجيل خروج جميع المستخدمين",
    en: "Force Logout All Users",
  },
  loggingOut: { ar: "جاري...", en: "Logging out..." },
  backToLogin: { ar: "العودة لصفحة تسجيل الدخول", en: "Back to Login" },
  success: { ar: "نجاح", en: "Success" },
  error: { ar: "خطأ", en: "Error" },
};

type User = {
  id: number;
  name: string;
  username: string;
  role: string;
  is_admin: boolean;
  created_at: string;
};

export default function RecoveryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang");
  const isAr = lang === "ar";

  const [step, setStep] = useState<"code" | "panel">("code");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  // نموذج إعادة تعيين كلمة مرور الـ moderator
  const [adminPassword, setAdminPassword] = useState("");
  const [moderatorUsername, setModeratorUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  useEffect(() => {
    // تحديث عنوان الصفحة حسب اللغة
    document.title = isAr ? "صفحة الاسترجاع السرية" : "Emergency Recovery";
  }, [isAr]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/recovery/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recovery_code: recoveryCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setTempToken(data.temp_token);
      setStep("panel");
      await loadUsers(data.temp_token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadUsers(token: string) {
    try {
      const res = await fetch(`${API_URL}/api/recovery/users`, {
        headers: { "X-Recovery-Token": token },
      });
      const data = await res.json();
      if (res.ok) setUsers(data.users);
    } catch {}
  }

  async function handleResetModerator(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_URL}/api/recovery/reset-moderator`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Recovery-Token": tempToken,
        },
        body: JSON.stringify({
          admin_password: adminPassword,
          moderator_username: moderatorUsername,
          new_password: newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess(data.message);
      setAdminPassword("");
      setModeratorUsername("");
      setNewPassword("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleForceLogout() {
    if (
      !confirm(
        isAr
          ? "هل تريد تسجيل خروج جميع المستخدمين؟"
          : "Are you sure you want to logout all users?",
      )
    )
      return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/recovery/force-logout`, {
        method: "POST",
        headers: { "X-Recovery-Token": tempToken },
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message);
        setTimeout(() => router.push("/admin/login"), 2000);
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-white outline-none focus:border-cyan-300/40";

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-[2rem] border border-cyan-400/20 bg-white/[0.03] p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-cyan-400/10 flex items-center justify-center">
            <Shield className="h-6 w-6 text-cyan-400" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-400">
              {isAr ? "استرجاع طوارئ" : "Emergency Recovery"}
            </p>
            <h1 className="text-2xl font-semibold text-white">
              {isAr ? t.title.ar : t.title.en}
            </h1>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
            ️ {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            {success}
          </div>
        )}

        {step === "code" ? (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/5 p-4 text-sm text-cyan-200">
              <AlertTriangle className="h-4 w-4 inline mr-2" />
              {isAr ? t.warning.ar : t.warning.en}
            </div>
            <label className="block space-y-1.5 text-sm text-slate-300">
              <span>{isAr ? t.recoveryCode.ar : t.recoveryCode.en}</span>
              <input
                type="password"
                value={recoveryCode}
                onChange={(e) => setRecoveryCode(e.target.value)}
                required
                className={inputCls}
                placeholder={isAr ? t.placeholder.ar : t.placeholder.en}
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-cyan-400 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
            >
              {loading
                ? isAr
                  ? t.verifying.ar
                  : t.verifying.en
                : isAr
                  ? t.enter.ar
                  : t.enter.en}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            {/* قائمة المستخدمين */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-cyan-300" />
                {isAr ? t.users.ar : t.users.en} ({users.length})
              </h2>
              <div className="space-y-2">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/50 px-4 py-2.5"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{u.name}</p>
                      <p className="text-xs text-slate-400">
                        @{u.username} •{" "}
                        <span
                          className={
                            u.is_admin ? "text-cyan-300" : "text-slate-300"
                          }
                        >
                          {u.is_admin
                            ? isAr
                              ? "أدمن"
                              : "Admin"
                            : isAr
                              ? "مشرف"
                              : "Moderator"}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* إعادة تعيين كلمة مرور الـ moderator */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Key className="h-5 w-5 text-cyan-300" />
                {isAr ? t.resetModerator.ar : t.resetModerator.en}
              </h2>
              <form onSubmit={handleResetModerator} className="space-y-3">
                <label className="block space-y-1.5 text-sm text-slate-300">
                  <span>{isAr ? t.adminPassword.ar : t.adminPassword.en}</span>
                  <div className="relative">
                    <input
                      type={showAdminPass ? "text" : "password"}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                      className={inputCls}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPass(!showAdminPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                    >
                      {showAdminPass ? "" : "👁️"}
                    </button>
                  </div>
                </label>

                <label className="block space-y-1.5 text-sm text-slate-300">
                  <span>
                    {isAr ? t.moderatorUsername.ar : t.moderatorUsername.en}
                  </span>
                  <input
                    type="text"
                    value={moderatorUsername}
                    onChange={(e) => setModeratorUsername(e.target.value)}
                    required
                    className={inputCls}
                    placeholder="moderator"
                  />
                </label>

                <label className="block space-y-1.5 text-sm text-slate-300">
                  <span>{isAr ? t.newPassword.ar : t.newPassword.en}</span>
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={8}
                      className={inputCls}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                    >
                      {showNewPass ? "🙈" : "️"}
                    </button>
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-cyan-400/20 py-2.5 text-sm font-medium text-cyan-300 hover:bg-cyan-400/30 disabled:opacity-50"
                >
                  {loading
                    ? isAr
                      ? t.resetting.ar
                      : t.resetting.en
                    : isAr
                      ? t.reset.ar
                      : t.reset.en}
                </button>
              </form>
            </div>

            {/* إجبار تسجيل الخروج */}
            <button
              onClick={handleForceLogout}
              disabled={loading}
              className="w-full rounded-full bg-rose-400/20 py-3 text-sm font-medium text-rose-300 hover:bg-rose-400/30 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              {loading
                ? isAr
                  ? t.loggingOut.ar
                  : t.loggingOut.en
                : isAr
                  ? t.forceLogout.ar
                  : t.forceLogout.en}
            </button>

            {/* رجوع للدخول */}
            <button
              onClick={() => router.push("/admin/login")}
              className="w-full rounded-full border border-white/10 py-2.5 text-sm text-slate-400 hover:text-white"
            >
              {isAr ? t.backToLogin.ar : t.backToLogin.en}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
