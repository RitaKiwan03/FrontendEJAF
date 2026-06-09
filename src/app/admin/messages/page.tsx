"use client";

import { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin-shell";
import {
  Mail,
  MailOpen,
  Trash2,
  Phone,
  User,
  AtSign,
  Calendar,
  MessageSquare,
  RefreshCw,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type Message = {
  id: number;
  name: string;
  email: string;
  phone_code: string | null;
  phone: string | null;
  subject: string;
  message: string;
  read_at: string | null;
  created_at: string;
};

function getToken() {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("ejaf_token") || localStorage.getItem("admin_token")
  );
}

function adminHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

export default function AdminMessagesPage({
  searchParams,
}: {
  searchParams?: { lang?: string };
}) {
  const isAr = searchParams?.lang === "ar";

  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchMessages() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        headers: adminHeaders() as HeadersInit,
      });
      if (!res.ok) throw new Error("فشل جلب الرسائل");
      const data = await res.json();
      setMessages(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkRead(id: number) {
    await fetch(`${API_URL}/api/contact/${id}/read`, {
      method: "PUT",
      headers: adminHeaders() as HeadersInit,
    });
    setMessages((msgs) =>
      msgs.map((m) =>
        m.id === id ? { ...m, read_at: new Date().toISOString() } : m,
      ),
    );
  }

  async function handleDelete(id: number) {
    if (
      !confirm(isAr ? "هل أنت متأكد من حذف الرسالة؟" : "Delete this message?")
    )
      return;
    await fetch(`${API_URL}/api/contact/${id}`, {
      method: "DELETE",
      headers: adminHeaders() as HeadersInit,
    });
    setMessages((msgs) => msgs.filter((m) => m.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  function handleSelect(msg: Message) {
    setSelected(msg);
    if (!msg.read_at) handleMarkRead(msg.id);
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  const unread = messages.filter((m) => !m.read_at).length;

  return (
    <AdminShell
      title={isAr ? "صندوق الرسائل" : "Messages"}
      description={
        isAr
          ? `${messages.length} رسالة — ${unread} غير مقروءة`
          : `${messages.length} messages — ${unread} unread`
      }
    >
      {error && (
        <p className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-[320px_1fr] lg:items-start">
        {/* قائمة الرسائل */}
        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
              {isAr ? "الرسائل" : "Inbox"}
            </p>
            <button
              onClick={fetchMessages}
              className="rounded-full p-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="px-4 py-8 text-center text-slate-500 text-sm">
              {isAr ? "جاري التحميل..." : "Loading..."}
            </div>
          ) : messages.length === 0 ? (
            <div className="px-4 py-8 text-center text-slate-500 text-sm">
              {isAr ? "لا توجد رسائل بعد" : "No messages yet"}
            </div>
          ) : (
            <div className="divide-y divide-white/[0.06]">
              {messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => handleSelect(msg)}
                  className={`w-full text-left px-4 py-3.5 transition-colors hover:bg-white/[0.04] ${
                    selected?.id === msg.id
                      ? "bg-cyan-400/[0.06] border-l-2 border-cyan-400"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                        msg.read_at ? "bg-transparent" : "bg-cyan-400"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm truncate ${
                          msg.read_at
                            ? "text-slate-400"
                            : "font-semibold text-white"
                        }`}
                      >
                        {msg.name}
                      </p>
                      <p className="text-xs text-cyan-400/70 truncate mt-0.5 flex items-center gap-1">
                        <AtSign className="h-3 w-3 shrink-0" />
                        {msg.email}
                      </p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {msg.subject}
                      </p>
                      {msg.phone && (
                        <p
                          className="text-xs text-slate-500 mt-0.5 flex items-center gap-1"
                          dir="ltr"
                        >
                          <Phone className="h-3 w-3 text-cyan-400 shrink-0" />
                          {msg.phone_code} {msg.phone}
                        </p>
                      )}
                      <p className="text-xs text-slate-600 mt-1">
                        {new Date(msg.created_at).toLocaleDateString(
                          isAr ? "ar" : "en",
                          { day: "2-digit", month: "short", year: "numeric" },
                        )}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* محتوى الرسالة */}
        {selected ? (
          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] overflow-hidden">
            <div className="border-b border-white/10 p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-semibold text-white">
                  {selected.subject}
                </h2>
                <div className="flex gap-2 shrink-0">
                  {!selected.read_at && (
                    <button
                      onClick={() => handleMarkRead(selected.id)}
                      className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:text-white transition-colors"
                    >
                      <MailOpen className="h-3.5 w-3.5" />
                      {isAr ? "تحديد كمقروء" : "Mark read"}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(selected.id)}
                    className="flex items-center gap-1.5 rounded-full border border-rose-400/20 bg-rose-400/10 px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-400/20 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {isAr ? "حذف" : "Delete"}
                  </button>
                </div>
              </div>

              {/* بيانات المرسل */}
              <div className="grid gap-2 rounded-2xl border border-white/10 bg-slate-950/50 p-4 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <User className="h-4 w-4 text-cyan-300 shrink-0" />
                  <span className="text-slate-500">
                    {isAr ? "الاسم:" : "Name:"}
                  </span>
                  <span className="font-medium text-white">
                    {selected.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <AtSign className="h-4 w-4 text-cyan-300 shrink-0" />
                  <span className="text-slate-500">
                    {isAr ? "الإيميل:" : "Email:"}
                  </span>
                  <a
                    href={`mailto:${selected.email}`}
                    className="font-medium text-cyan-300 hover:text-cyan-200 transition-colors truncate"
                  >
                    {selected.email}
                  </a>
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Phone className="h-4 w-4 text-cyan-300 shrink-0" />
                    <span className="text-slate-500">
                      {isAr ? "الهاتف:" : "Phone:"}
                    </span>
                    <a
                      href={`tel:${selected.phone_code}${selected.phone}`}
                      className="font-medium text-white hover:text-cyan-300 transition-colors"
                      dir="ltr"
                    >
                      {selected.phone_code} {selected.phone}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Calendar className="h-4 w-4 text-cyan-300 shrink-0" />
                  <span className="text-slate-500">
                    {isAr ? "التاريخ:" : "Date:"}
                  </span>
                  <span className="font-medium text-white">
                    {new Date(selected.created_at).toLocaleDateString(
                      isAr ? "ar" : "en",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </span>
                </div>
              </div>

              {/* شارة الحالة */}
              <div className="flex items-center gap-2">
                {selected.read_at ? (
                  <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
                    <MailOpen className="h-3 w-3" />
                    {isAr ? "مقروءة" : "Read"}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
                    <Mail className="h-3 w-3" />
                    {isAr ? "جديدة" : "New"}
                  </span>
                )}
              </div>
            </div>

            {/* نص الرسالة */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-4 w-4 text-cyan-300" />
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                  {isAr ? "نص الرسالة" : "Message"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
                <p className="text-sm leading-8 text-slate-200 whitespace-pre-wrap">
                  {selected.message}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-[1.75rem] border border-white/10 bg-white/[0.02]">
            <div className="text-center space-y-2">
              <Mail className="mx-auto h-8 w-8 text-slate-600" />
              <p className="text-sm text-slate-500">
                {isAr ? "اختر رسالة للعرض" : "Select a message to view"}
              </p>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
