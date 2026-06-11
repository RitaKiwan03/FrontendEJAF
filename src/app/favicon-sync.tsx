"use client";

import { useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export function FaviconSync() {
  useEffect(() => {
    fetch(`${API_URL}/api/settings`)
      .then((r) => r.json())
      .then((data) => {
        const rawUrl = data.favicon_url || data.logo_url;
        if (!rawUrl) return;

        const url = rawUrl.startsWith("http") ? rawUrl : API_URL + rawUrl;

        const isGif = url.toLowerCase().endsWith(".gif");
        if (isGif) return;

        document
          .querySelectorAll("link[rel*='icon']")
          .forEach((el) => el.remove());

        const link = document.createElement("link");
        link.rel = "icon";
        link.type = url.endsWith(".svg") ? "image/svg+xml" : "image/png";
        link.href = url + "?v=" + Date.now();
        document.head.appendChild(link);
      })
      .catch(() => {});
  }, []);

  return null;
}
