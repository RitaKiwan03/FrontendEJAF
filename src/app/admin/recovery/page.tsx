"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, AlertTriangle, Trash2, Key, UserPlus, LogOut, Loader2, CheckCircle } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

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
  const [step, setStep] = useState<"code" | "panel">("code");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  // نموذج إعادة التعيين
  const [resetUsername, setResetUsername] = useState("");
  const [resetPassword, setResetPassword] = useState("");

  // نموذج إنشاء أدمن
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

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

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_URL}/api/recovery/reset-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Recovery-Token": tempToken,
        },
        body: JSON.stringify({
          username: resetUsername,
          new_password: resetPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess(data.message);
      setResetUsername("");
      setResetPassword("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateAdmin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_URL}/api/recovery/create-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Recovery-Token": tempToken,
        },
        body: JSON.stringify({
          name: newName,
          username: newUsername,
          password: newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess(data.message);
      setNewName("");
      setNewUsername("");
      setNewPassword("");
      await loadUsers(tempToken);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteUser(userId: number, username: string) {
    if (!confirm(`هل أنت متأكد من حذف المستخدم "${username}"؟`)) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/recovery/delete-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Recovery-Token": tempToken,
        },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess(data.message);
      await loadUsers(tempToken);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleForceLogout() {
    if (!confirm("هل تريد تسجيل خروج جميع المستخدمين؟")) return;
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
    "w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-white outline-none focus:border-amber-300/40";

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-[2rem] border border-amber-400/20 bg-white/[0.03] p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-amber-400/10 flex items-center justify-center">
            <Shield className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-400">
              Emergency Recovery
            </p>
            <h1 className="text-2xl font-semibold text-white">
              صفحة الاسترجاع السرية
            </h1>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
            ⚠️ {error}
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
            <div className="rounded-xl border border-amber-400/10 bg-amber-400/5 p-4 text-sm text-amber-200">
              <AlertTriangle className="h-4 w-4 inline mr-2" />
              هذه الصفحة سرية. أدخل كود الاسترجاع للمتابعة.
            </div>
            <label className="block space-y-1.5 text-sm text-slate-300">
              <span>Recovery Code</span>
              <input
                type="password"
                value={recoveryCode}
                onChange={(e) => setRecoveryCode(e.target.value)}
                required
                className={inputCls}
                placeholder="أدخل كود الاسترجاع..."
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-amber-400 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-300 disabled:opacity-50"
            >
              {loading ? "جاري التحقق..." : "دخول"}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            {/* قائمة المستخدمين */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-cyan-300" />
                المستخدمون ({users.length})
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
                            u.is_admin ? "text-amber-300" : "text-cyan-300"
                          }
                        >
                          {u.is_admin ? "Admin" : u.role}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteUser(u.id, u.username)}
                      disabled={loading}
                      className="p-2 text-rose-400 hover:bg-rose-400/10 rounded-lg"
                      title="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* إعادة تعيين كلمة مرور الأدمن */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Key className="h-5 w-5 text-cyan-300" />
                إعادة تعيين كلمة مرور الأدمن
              </h2>
              <form onSubmit={handleResetPassword} className="space-y-3">
                <input
                  type="text"
                  value={resetUsername}
                  onChange={(e) => setResetUsername(e.target.value)}
                  placeholder="اسم المستخدم"
                  required
                  className={inputCls}
                />
                <input
                  type="password"
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  placeholder="كلمة المرور الجديدة"
                  required
                  minLength={8}
                  className={inputCls}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-cyan-400/20 py-2.5 text-sm font-medium text-cyan-300 hover:bg-cyan-400/30 disabled:opacity-50"
                >
                  {loading ? "جاري..." : "إعادة التعيين"}
                </button>
              </form>
            </div>

            {/* إنشاء أدمن جديد */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-emerald-300" />
                إنشاء أدمن جديد
              </h2>
              <form onSubmit={handleCreateAdmin} className="space-y-3">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="الاسم الكامل"
                  required
                  className={inputCls}
                />
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="اسم المستخدم (a-z, 0-9, _)"
                  required
                  pattern="[a-z0-9_]+"
                  className={inputCls}
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="كلمة المرور"
                  required
                  minLength={8}
                  className={inputCls}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-emerald-400/20 py-2.5 text-sm font-medium text-emerald-300 hover:bg-emerald-400/30 disabled:opacity-50"
                >
                  {loading ? "جاري..." : "إنشاء الأدمن"}
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
              {loading ? "جاري..." : "تسجيل خروج جميع المستخدمين"}
            </button>

            {/* رجوع للدخول */}
            <button
              onClick={() => router.push("/admin/login")}
              className="w-full rounded-full border border-white/10 py-2.5 text-sm text-slate-400 hover:text-white"
            >
              العودة لصفحة تسجيل الدخول
            </button>
          </div>
        )}
      </div>
    </div>
  );
}