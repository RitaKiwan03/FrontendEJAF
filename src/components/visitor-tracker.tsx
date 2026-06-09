"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
// ✅ مدة الـ heartbeat - كل 3 دقائق
const HEARTBEAT_INTERVAL = 3 * 60 * 1000;

export function VisitorTracker() {
  const pathname = usePathname();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  function sendTrack(page: string) {
    // ✅ تجاهل صفحات الأدمن نهائياً
    if (page.startsWith("/admin")) return;

    fetch(`${API_URL}/api/visitors/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page }),
    }).catch(() => {});
  }

  useEffect(() => {
    // تجاهل صفحات الأدمن
    if (pathname.startsWith("/admin")) {
      // ✅ أوقف الـ heartbeat إذا انتقل للأدمن
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    // ✅ أرسل عند تغيير الصفحة
    sendTrack(pathname);

    // ✅ Heartbeat - يُحدّث last_seen_at كل 3 دقائق
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      sendTrack(pathname);
    }, HEARTBEAT_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [pathname]);

  return null;
}
