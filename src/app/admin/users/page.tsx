"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import {
  getUsers,
  changeModeratorPassword,
  blockModerator,
  getAdminUser,
} from "@/lib/admin-api";
import {
  Loader2,
  Key,
  Shield,
  ShieldAlert,
  User,
  Check,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react";

type User = {
  id: number;
  name: string;
  username: string;
  role: string;
  is_admin: boolean;
  created_at: string;
};

export default function AdminUsersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang");
  const isAr = lang === "ar";
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  // نموذج تغيير كلمة المرور
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [changing, setChanging] = useState(false);

  // نموذج الحظر
  const [blockingId, setBlockingId] = useState<number | null>(null);

  useEffect(() => {
    const user = getAdminUser();
    if (!user?.is_admin) {
      router.push("/admin/dashboard");
      return;
    }
    setCurrentUser(user);
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    setError("");
    try {
      const data = await getUsers();
      setUsers(data.users || []);
    } catch (err: any) {
      setError(
        err.message || (isAr ? "فشل جلب المستخدمين" : "Failed to load users"),
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError(isAr ? "كلمتا المرور غير متطابقتين" : "Passwords don't match");
      return;
    }
    if (newPassword.length < 8) {
      setError(
        isAr
          ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل"
          : "Password must be at least 8 characters",
      );
      return;
    }
    setChanging(true);
    setError("");
    setSuccess("");

    try {
      await changeModeratorPassword(
        selectedUser!.id,
        adminPassword,
        newPassword,
        confirmPassword,
      );
      setSuccess(
        isAr
          ? `تم تغيير كلمة مرور ${selectedUser!.username} بنجاح`
          : `Password changed for ${selectedUser!.username}`,
      );
      setAdminPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSelectedUser(null);
    } catch (err: any) {
      setError(
        err.message ||
          (isAr ? "فشل تغيير كلمة المرور" : "Failed to change password"),
      );
    } finally {
      setChanging(false);
    }
  }

  async function handleBlock(userId: number, username: string) {
    if (
      !confirm(
        isAr
          ? `هل أنت متأكد من حظر "${username}"؟ سيتم إلغاء جميع جلساته.`
          : `Are you sure you want to block "${username}"? All sessions will be terminated.`,
      )
    )
      return;

    setBlockingId(userId);
    setError("");
    try {
      await blockModerator(userId);
      setSuccess(
        isAr ? `تم حظر ${username} بنجاح` : `${username} blocked successfully`,
      );
    } catch (err: any) {
      setError(err.message || (isAr ? "فشل الحظر" : "Failed to block"));
    } finally {
      setBlockingId(null);
    }
  }

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-white outline-none focus:border-cyan-300/40";

  return (
    <AdminShell
      title={isAr ? "إدارة المستخدمين" : "User Management"}
      description={
        isAr
          ? "عرض وإدارة حسابات المشرفين (للأدمن فقط)"
          : "View and manage moderator accounts (Admin only)"
      }
    >
      {error && (
        <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
          ✓ {success}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* قائمة المستخدمين */}
          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-cyan-300" />
              {isAr ? "المستخدمون" : "Users"} ({users.length})
            </h2>
            <div className="space-y-2">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        u.is_admin
                          ? "bg-amber-400/10 text-amber-300"
                          : "bg-cyan-400/10 text-cyan-300"
                      }`}
                    >
                      {u.is_admin ? (
                        <Shield className="h-5 w-5" />
                      ) : (
                        <ShieldAlert className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{u.name}</p>
                      <p className="text-xs text-slate-400">
                        @{u.username} •{" "}
                        <span
                          className={
                            u.is_admin ? "text-amber-300" : "text-cyan-300"
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
                  <div className="flex gap-2">
                    {!u.is_admin && (
                      <>
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-400/20"
                        >
                          <Key className="h-4 w-4" />
                          {isAr ? "تغيير كلمة المرور" : "Change Password"}
                        </button>
                        <button
                          onClick={() => handleBlock(u.id, u.username)}
                          disabled={blockingId === u.id}
                          className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-sm text-rose-300 hover:bg-rose-400/20 disabled:opacity-50"
                        >
                          {blockingId === u.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <ShieldAlert className="h-4 w-4" />
                          )}
                          {isAr ? "حظر" : "Block"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* نموذج تغيير كلمة المرور */}
          {selectedUser && (
            <div className="rounded-[1.75rem] border border-cyan-400/20 bg-cyan-400/5 p-6">
              <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                <Key className="h-5 w-5 text-cyan-300" />
                {isAr ? "تغيير كلمة مرور" : "Change Password"}:{" "}
                <span className="text-cyan-300">@{selectedUser.username}</span>
              </h3>
              <p className="text-xs text-slate-400 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5" />
                {isAr
                  ? "يجب إدخال كلمة مرور الأدمن للتأكيد"
                  : "Admin password required for confirmation"}
              </p>
              <form onSubmit={handleChangePassword} className="space-y-3">
                <label className="block space-y-1.5 text-sm text-slate-300">
                  <span>
                    {isAr
                      ? "كلمة مرور الأدمن (للتأكيد)"
                      : "Admin Password (confirmation)"}
                  </span>
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
                      {showAdminPass ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </label>

                <label className="block space-y-1.5 text-sm text-slate-300">
                  <span>{isAr ? "كلمة المرور الجديدة" : "New Password"}</span>
                  <div className="relative">
                    <input
                      type={showNewPass ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={8}
                      className={inputCls}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                    >
                      {showNewPass ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </label>

                <label className="block space-y-1.5 text-sm text-slate-300">
                  <span>{isAr ? "تأكيد كلمة المرور" : "Confirm Password"}</span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={inputCls}
                  />
                </label>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={changing}
                    className="flex-1 rounded-full bg-cyan-400 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {changing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        {isAr ? "تغيير كلمة المرور" : "Change Password"}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUser(null);
                      setAdminPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                    className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-slate-400 hover:text-white"
                  >
                    {isAr ? "إلغاء" : "Cancel"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </AdminShell>
  );
}
