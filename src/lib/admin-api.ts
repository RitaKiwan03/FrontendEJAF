const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("ejaf_token");
}

function adminHeaders(isAr = false): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
    "Accept-Language": isAr ? "ar" : "en",
  };
}

function t(ar: string, en: string, isAr = false) {
  return isAr ? ar : en;
}

// ✅ دالة موحدة لمعالجة الأخطاء — كانت مفقودة وسببت الخطأ
async function handleResponse(res: Response, errorMsg: string) {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || errorMsg);
  }
  return res.json();
}

// ==================== AUTH ====================

export async function loginAdmin(
  username: string,
  password: string,
  isAr = false,
) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(
      data.message || t("فشل تسجيل الدخول", "Login failed", isAr),
    );

  localStorage.setItem("ejaf_token", data.token);
  localStorage.setItem("ejaf_user", JSON.stringify(data.user));

  // ✅ Secure في production
  document.cookie = `ejaf_token=${data.token}; path=/; max-age=86400; SameSite=Strict${
    location.protocol === "https:" ? "; Secure" : ""
  }`;

  return data;
}

export async function logoutAdmin() {
  // ✅ انتظر الـ logout من السيرفر
  await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    headers: adminHeaders(),
  }).catch(() => {});

  localStorage.removeItem("ejaf_token");
  localStorage.removeItem("ejaf_user");
  document.cookie = "ejaf_token=; path=/; max-age=0; SameSite=Strict";
}

export function getAdminUser() {
  if (typeof window === "undefined") return null;
  const u = localStorage.getItem("ejaf_user");
  return u ? JSON.parse(u) : null;
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

// ==================== UPLOAD ====================

export async function uploadFile(file: File, isAr = false): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const token = getToken();
  if (!token)
    throw new Error(
      t(
        "غير مسجل الدخول — يرجى تسجيل الدخول أولاً",
        "Not logged in — please login first",
        isAr,
      ),
    );

  const res = await fetch(`${API_URL}/api/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.message ||
        t(
          `فشل رفع الصورة (${res.status})`,
          `Failed to upload image (${res.status})`,
          isAr,
        ),
    );
  }

  const data = await res.json();
  return data.url;
}

// ==================== SERVICES ====================

export async function getServicesAdmin(isAr = false) {
  const res = await fetch(`${API_URL}/api/admin/services`, {
    headers: adminHeaders(isAr),
    cache: "no-store",
  });
  if (!res.ok)
    throw new Error(t("فشل جلب الخدمات", "Failed to fetch services", isAr));
  return res.json();
}

export async function createService(payload: object, isAr = false) {
  const res = await fetch(`${API_URL}/api/services`, {
    method: "POST",
    headers: adminHeaders(isAr),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const error: any = new Error(
      errorData.message || t("فشل إضافة الخدمة", "Failed to add service", isAr),
    );
    error.status = res.status;
    throw error;
  }
  return res.json();
}

export async function updateService(id: string, payload: object, isAr = false) {
  const res = await fetch(`${API_URL}/api/services/${id}`, {
    method: "PUT",
    headers: adminHeaders(isAr),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const error: any = new Error(
      errorData.message ||
        t("فشل تعديل الخدمة", "Failed to update service", isAr),
    );
    error.status = res.status;
    throw error;
  }
  return res.json();
}

export async function deleteService(id: string, isAr = false) {
  const res = await fetch(`${API_URL}/api/services/${id}`, {
    method: "DELETE",
    headers: adminHeaders(isAr),
  });
  if (!res.ok)
    throw new Error(t("فشل حذف الخدمة", "Failed to delete service", isAr));
  return res.json();
}

// ==================== PROJECTS ====================

export async function getProjectsAdmin(isAr = false) {
  const res = await fetch(`${API_URL}/api/admin/projects`, {
    headers: adminHeaders(isAr),
    cache: "no-store",
  });
  if (!res.ok)
    throw new Error(t("فشل جلب المشاريع", "Failed to fetch projects", isAr));
  return res.json();
}

export async function createProject(payload: object, isAr = false) {
  const res = await fetch(`${API_URL}/api/projects`, {
    method: "POST",
    headers: adminHeaders(isAr),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const error: any = new Error(
      errorData.message ||
        t("فشل إضافة المشروع", "Failed to add project", isAr),
    );
    error.status = res.status;
    throw error;
  }
  return res.json();
}

export async function updateProject(id: string, payload: object, isAr = false) {
  const res = await fetch(`${API_URL}/api/projects/${id}`, {
    method: "PUT",
    headers: adminHeaders(isAr),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const error: any = new Error(
      errorData.message ||
        t("فشل تعديل المشروع", "Failed to update project", isAr),
    );
    error.status = res.status;
    throw error;
  }
  return res.json();
}

export async function deleteProject(id: string, isAr = false) {
  const res = await fetch(`${API_URL}/api/projects/${id}`, {
    method: "DELETE",
    headers: adminHeaders(isAr),
  });
  if (!res.ok)
    throw new Error(t("فشل حذف المشروع", "Failed to delete project", isAr));
  return res.json();
}

// ==================== BLOG ====================

// ✅ مصحح — يستخدم handleResponse الموجودة الآن
export async function getAdminPosts() {
  const res = await fetch(`${API_URL}/api/admin/blog`, {
    headers: adminHeaders(),
    cache: "no-store",
  });
  return handleResponse(res, "فشل جلب المقالات");
}

export async function createPost(payload: object, isAr = false) {
  const res = await fetch(`${API_URL}/api/blog`, {
    method: "POST",
    headers: adminHeaders(isAr),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const error: any = new Error(
      errorData.message || t("فشل إضافة المقال", "Failed to add post", isAr),
    );
    error.status = res.status;
    throw error;
  }
  return res.json();
}

export async function updatePost(id: string, payload: object, isAr = false) {
  const res = await fetch(`${API_URL}/api/blog/${id}`, {
    method: "PUT",
    headers: adminHeaders(isAr),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const error: any = new Error(
      errorData.message || t("فشل تعديل المقال", "Failed to update post", isAr),
    );
    error.status = res.status;
    throw error;
  }
  return res.json();
}

export async function deletePost(id: string, isAr = false) {
  const res = await fetch(`${API_URL}/api/blog/${id}`, {
    method: "DELETE",
    headers: adminHeaders(isAr),
  });
  if (!res.ok)
    throw new Error(t("فشل حذف المقال", "Failed to delete post", isAr));
  return res.json();
}

// ✅ مسار مصحح — كان /api/search أصبح /api/blog/search
export async function searchPosts(query: string, locale: string) {
  const res = await fetch(
    `${API_URL}/api/blog/search?q=${encodeURIComponent(query)}&lang=${locale}`,
    { cache: "no-store" },
  );
  if (!res.ok) return [];
  return res.json();
}

// ==================== CONTACT ====================

export async function sendContact(payload: object, isAr = false) {
  const res = await fetch(`${API_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok)
    throw new Error(t("فشل إرسال الرسالة", "Failed to send message", isAr));
  return res.json();
}

export async function getContactMessages(isAr = false) {
  const res = await fetch(`${API_URL}/api/contact`, {
    headers: adminHeaders(isAr),
    cache: "no-store",
  });
  if (!res.ok)
    throw new Error(t("فشل جلب الرسائل", "Failed to fetch messages", isAr));
  return res.json();
}

export async function markMessageRead(id: string, isAr = false) {
  const res = await fetch(`${API_URL}/api/contact/${id}/read`, {
    method: "PUT",
    headers: adminHeaders(isAr),
  });
  if (!res.ok)
    throw new Error(t("فشل تحديث الرسالة", "Failed to update message", isAr));
  return res.json();
}

export async function deleteMessage(id: string, isAr = false) {
  const res = await fetch(`${API_URL}/api/contact/${id}`, {
    method: "DELETE",
    headers: adminHeaders(isAr),
  });
  if (!res.ok)
    throw new Error(t("فشل حذف الرسالة", "Failed to delete message", isAr));
  return res.json();
}

// ==================== LOCATIONS ====================

export async function getLocations(isAr = false) {
  const res = await fetch(`${API_URL}/api/locations`, {
    headers: adminHeaders(isAr),
    cache: "no-store",
  });
  if (!res.ok)
    throw new Error(t("فشل جلب المواقع", "Failed to fetch locations", isAr));
  return res.json();
}

export async function createLocation(payload: object, isAr = false) {
  const res = await fetch(`${API_URL}/api/locations`, {
    method: "POST",
    headers: adminHeaders(isAr),
    body: JSON.stringify(payload),
  });
  if (!res.ok)
    throw new Error(t("فشل إضافة الموقع", "Failed to add location", isAr));
  return res.json();
}

export async function updateLocation(
  id: string,
  payload: object,
  isAr = false,
) {
  const res = await fetch(`${API_URL}/api/locations/${id}`, {
    method: "PUT",
    headers: adminHeaders(isAr),
    body: JSON.stringify(payload),
  });
  if (!res.ok)
    throw new Error(t("فشل تعديل الموقع", "Failed to update location", isAr));
  return res.json();
}

export async function deleteLocation(id: string, isAr = false) {
  const res = await fetch(`${API_URL}/api/locations/${id}`, {
    method: "DELETE",
    headers: adminHeaders(isAr),
  });
  if (!res.ok)
    throw new Error(t("فشل حذف الموقع", "Failed to delete location", isAr));
  return res.json();
}

// ==================== SETTINGS ====================

export async function getSettings(isAr = false) {
  const res = await fetch(`${API_URL}/api/settings`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok)
    throw new Error(t("فشل جلب الإعدادات", "Failed to load settings", isAr));
  return res.json();
}

export async function updateSettings(
  payload: { phone?: string; email?: string },
  isAr = false,
) {
  const res = await fetch(`${API_URL}/api/settings`, {
    method: "PUT",
    headers: adminHeaders(isAr),
    body: JSON.stringify(payload),
  });
  if (!res.ok)
    throw new Error(t("فشل حفظ الإعدادات", "Failed to save settings", isAr));
  return res.json();
}

export async function uploadLogo(file: File, isAr = false): Promise<string> {
  const formData = new FormData();
  formData.append("logo", file);

  const res = await fetch(`${API_URL}/api/settings/logo`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });

  if (!res.ok)
    throw new Error(t("فشل رفع اللوغو", "Failed to upload logo", isAr));

  const data = await res.json();
  return data.url;
}
