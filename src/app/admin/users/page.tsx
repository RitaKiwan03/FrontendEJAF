"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import {
  getUsers,
  changeModeratorPassword,
  blockModerator,
  unblockModerator,
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
  Ban,
  Unlock,
} from "lucide-react";

type User = {
  id: number;
  name: string;
  username: string;
  role: string;
  is_admin: boolean;
  is_blocked: boolean;
  created_at: string;
};

// ✅ النصوص - عربي / إنجليزي
const t = {
  title: { ar: "إدارة المستخدمين", en: "User Management" },
  description: {
    ar: "عرض وإدارة حسابات المشرفين (للأدمن فقط)",
    en: "View and manage moderator accounts (Admin only)",
  },
  users: { ar: "المستخدمون", en: "Users" },
  admin: { ar: "أدمن", en: "Admin" },
  moderator: { ar: "مشرف", en: "Moderator" },
  blocked: { ar: "محظور", en: "Blocked" },
  changePassword: { ar: "تغيير كلمة المرور", en: "Change Password" },
  block: { ar: "حظر", en: "Block" },
  unblock: { ar: "فك الحظر", en: "Unblock" },
  blocking: { ar: "جاري...", en: "Blocking..." },
  unblocking: { ar: "جاري...", en: "Unblocking..." },
  adminPassword: {
    ar: "كلمة مرور الأدمن (للتأكيد)",
    en: "Admin Password (confirmation)",
  },
  newPassword: { ar: "كلمة المرور الجديدة", en: "New Password" },
  confirmPassword: { ar: "تأكيد كلمة المرور", en: "Confirm Password" },
  cancel: { ar: "إلغاء", en: "Cancel" },
  passwordsNotMatch: {
    ar: "كلمتا المرور غير متطابقتين",
    en: "Passwords don't match",
  },
  passwordMinLength: {
    ar: "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
    en: "Password must be at least 8 characters",
  },
  passwordChanged: {
    ar: (username: string) => `تم تغيير كلمة مرور ${username} بنجاح`,
    en: (username: string) => `Password changed for ${username}`,
  },
  passwordFailed: {
    ar: "فشل تغيير كلمة المرور",
    en: "Failed to change password",
  },
  usersFailed: { ar: "فشل جلب المستخدمين", en: "Failed to load users" },
  confirmBlock: {
    ar: (username: string) =>
      `هل أنت متأكد من حظر "${username}"؟ سيتم إلغاء جميع جلساته ومنعه من تسجيل الدخول.`,
    en: (username: string) =>
      `Are you sure you want to block "${username}"? All sessions will be terminated and login will be prevented.`,
  },
  confirmUnblock: {
    ar: (username: string) =>
      `هل تريد فك الحظر عن "${username}"؟ سيتمكن من تسجيل الدخول مرة أخرى.`,
    en: (username: string) =>
      `Do you want to unblock "${username}"? They will be able to login again.`,
  },
  blockSuccess: {
    ar: (username: string) => `تم حظر ${username} بنجاح`,
    en: (username: string) => `${username} blocked successfully`,
  },
  unblockSuccess: {
    ar: (username: string) => `تم فك الحظر عن ${username} بنجاح`,
    en: (username: string) => `${username} unblocked successfully`,
  },
  blockFailed: { ar: "فشل الحظر", en: "Failed to block" },
  unblockFailed: { ar: "فشل فك الحظر", en: "Failed to unblock" },
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

  // حالة الحظر
  const [blockingId, setBlockingId] = useState<number | null>(null);
  const [unblockingId, setUnblockingId] = useState<number | null>(null);

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
      setError(err.message || (isAr ? t.usersFailed.ar : t.usersFailed.en));
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError(isAr ? t.passwordsNotMatch.ar : t.passwordsNotMatch.en);
      return;
    }
    if (newPassword.length < 8) {
      setError(isAr ? t.passwordMinLength.ar : t.passwordMinLength.en);
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
          ? t.passwordChanged.ar(selectedUser!.username)
          : t.passwordChanged.en(selectedUser!.username),
      );
      setAdminPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSelectedUser(null);
    } catch (err: any) {
      setError(
        err.message || (isAr ? t.passwordFailed.ar : t.passwordFailed.en),
      );
    } finally {
      setChanging(false);
    }
  }

  async function handleBlock(userId: number, username: string) {
    if (
      !confirm(isAr ? t.confirmBlock.ar(username) : t.confirmBlock.en(username))
    )
      return;

    setBlockingId(userId);
    setError("");
    try {
      await blockModerator(userId);
      setSuccess(
        isAr ? t.blockSuccess.ar(username) : t.blockSuccess.en(username),
      );
      await loadUsers(); // ✅ إعادة تحميل القائمة لتحديث الحالة
    } catch (err: any) {
      setError(err.message || (isAr ? t.blockFailed.ar : t.blockFailed.en));
    } finally {
      setBlockingId(null);
    }
  }

  async function handleUnblock(userId: number, username: string) {
    if (
      !confirm(
        isAr ? t.confirmUnblock.ar(username) : t.confirmUnblock.en(username),
      )
    )
      return;

    setUnblockingId(userId);
    setError("");
    try {
      await unblockModerator(userId);
      setSuccess(
        isAr ? t.unblockSuccess.ar(username) : t.unblockSuccess.en(username),
      );
      await loadUsers(); // ✅ إعادة تحميل القائمة لتحديث الحالة
    } catch (err: any) {
      setError(err.message || (isAr ? t.unblockFailed.ar : t.unblockFailed.en));
    } finally {
      setUnblockingId(null);
    }
  }

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-2.5 text-white outline-none focus:border-cyan-300/40";

  return (
    <AdminShell
      title={isAr ? t.title.ar : t.title.en}
      description={isAr ? t.description.ar : t.description.en}
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
              {isAr ? t.users.ar : t.users.en} ({users.length})
            </h2>
            <div className="space-y-2">
              {users.map((u) => (
                <div
                  key={u.id}
                  className={`flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 ${
                    u.is_blocked ? "opacity-60" : ""
                  }`}
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
                      <p className="text-sm font-medium text-white flex items-center gap-2">
                        {u.name}
                        {u.is_blocked && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-400/10 px-2 py-0.5 text-[10px] font-medium text-rose-300">
                            <Ban className="h-3 w-3" />
                            {isAr ? t.blocked.ar : t.blocked.en}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-400">
                        @{u.username} •{" "}
                        <span
                          className={
                            u.is_admin ? "text-amber-300" : "text-cyan-300"
                          }
                        >
                          {u.is_admin
                            ? isAr
                              ? t.admin.ar
                              : t.admin.en
                            : isAr
                              ? t.moderator.ar
                              : t.moderator.en}
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
                          {isAr ? t.changePassword.ar : t.changePassword.en}
                        </button>
                        {u.is_blocked ? (
                          <button
                            onClick={() => handleUnblock(u.id, u.username)}
                            disabled={unblockingId === u.id}
                            className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300 hover:bg-emerald-400/20 disabled:opacity-50"
                          >
                            {unblockingId === u.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Unlock className="h-4 w-4" />
                            )}
                            {isAr ? t.unblock.ar : t.unblock.en}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBlock(u.id, u.username)}
                            disabled={blockingId === u.id}
                            className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-sm text-rose-300 hover:bg-rose-400/20 disabled:opacity-50"
                          >
                            {blockingId === u.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Ban className="h-4 w-4" />
                            )}
                            {isAr ? t.block.ar : t.block.en}
                          </button>
                        )}
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
                {isAr ? t.changePassword.ar : t.changePassword.en}:{" "}
                <span className="text-cyan-300">@{selectedUser.username}</span>
              </h3>
              <p className="text-xs text-slate-400 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5" />
                {isAr ? t.adminPassword.ar : t.adminPassword.en}
              </p>
              <form onSubmit={handleChangePassword} className="space-y-3">
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
                      {showAdminPass ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
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
                  <span>
                    {isAr ? t.confirmPassword.ar : t.confirmPassword.en}
                  </span>
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
                        {isAr ? t.changePassword.ar : t.changePassword.en}
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
                    {isAr ? t.cancel.ar : t.cancel.en}
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
