export type Locale = "en" | "ar";

export type LocalizedText = {
  en: string;
  ar: string;
};

export type ServiceRecord = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  icon: string;
  gif?: string;
};

export type ProjectRecord = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  image: string;
  technologies: string[];
};

export type BlogRecord = {
  id: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  content: LocalizedText;
  image: string;
  createdAt: string;
  slug: string;
  tags: string[];
};

/** Shape returned by GET /api/services?lang=en|ar */
export type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  gif?: string;
};

/** Shape sent by admin to POST /api/services and PUT /api/services/:id */
export type ServicePayload = {
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  icon: string;
  gif?: string;
};

/** Shape returned by GET /api/projects?lang=en|ar */
export type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
};

/** Shape sent by admin to POST /api/projects and PUT /api/projects/:id */
export type ProjectPayload = {
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  image: string;
  technologies: string[];
};

/** Shape returned by GET /api/blog?lang=en|ar */
export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  createdAt: string;
  slug: string;
  tags: string[];
};

/** Shape sent by admin to POST /api/blog and PUT /api/blog/:id */
export type BlogPayload = {
  title_en: string;
  title_ar: string;
  excerpt_en: string;
  excerpt_ar: string;
  content_en: string;
  content_ar: string;
  slug: string;
  image: string;
  tags: string[];
  createdAt: string;
};

export type SiteStat = {
  value: string;
  label: LocalizedText;
};

export type NavItem = {
  href: string;
  label: LocalizedText;
};

export type SectionCopy = {
  eyebrow: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
};