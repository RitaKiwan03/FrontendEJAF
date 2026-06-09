import type { BlogPost, Locale, Project, Service } from "@/lib/content-types";
import { getBlogPost, getBlogPosts } from "@/data/blog";
import { getProjects } from "@/data/projects";
import { getServices } from "@/data/services";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchJson<T>(endpoint: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getServicesApi(locale: Locale): Promise<Service[]> {
  return (
    (await fetchJson<Service[]>(`/api/services?lang=${locale}`)) ??
    getServices(locale)
  );
}

export async function getProjectsApi(locale: Locale): Promise<Project[]> {
  return (
    (await fetchJson<Project[]>(`/api/projects?lang=${locale}`)) ??
    getProjects(locale)
  );
}

export async function getBlogApi(locale: Locale): Promise<BlogPost[]> {
  return (
    (await fetchJson<BlogPost[]>(`/api/blog?lang=${locale}`)) ??
    getBlogPosts(locale)
  );
}

export async function getBlogItemApi(
  locale: Locale,
  slug: string,
): Promise<BlogPost | null> {
  const posts = await getBlogApi(locale);
  return posts.find((p) => p.slug === slug) ?? getBlogPost(locale, slug);
}

export async function getMessagesApi(): Promise<any[]> {
  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("ejaf_token") ||
          localStorage.getItem("admin_token")
        : null;

    const response = await fetch(`${API_URL}/api/messages`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}
export async function getLocationsApi(): Promise<any[]> {
  try {
    const response = await fetch(`${API_URL}/api/locations`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}

export async function getVisitorStatsApi(): Promise<{
  total: number;
  this_month: number;
  this_year: number;
  online: number;
  monthly: { label: string; count: number }[];
} | null> {
  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("ejaf_token") ||
          localStorage.getItem("admin_token")
        : null;

    const response = await fetch(`${API_URL}/api/visitors/stats`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}
