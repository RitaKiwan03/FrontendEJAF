"use client";

import { useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export function FaviconSync() {
  useEffect(() => {
    fetch(`${API_URL}/api/settings`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.logo_url) return;

        const url = API_URL + data.logo_url;

        // ✅ تجاهل GIF للـ favicon - استخدم اللوغو الأصلي فقط
        const isGif = url.toLowerCase().endsWith(".gif");
        if (isGif) return;

        // ✅ احذف الـ favicon القديم
        document
          .querySelectorAll("link[rel*='icon']")
          .forEach((el) => el.remove());

        // ✅ أضف الجديد
        const link = document.createElement("link");
        link.rel = "icon";
        link.type = url.endsWith(".svg") ? "image/svg+xml" : "image/png";
        link.href = url + "?v=" + Date.now(); // منع الـ cache
        document.head.appendChild(link);
      })
      .catch(() => {});
  }, []);

  return null;
}
