import type { Locale, Project, ProjectRecord } from "@/lib/content-types";
import { translate } from "@/lib/i18n";

export const projectRecords: ProjectRecord[] = [
  {
    id: "secure-campus",
    title: { en: "Secure Campus Backbone", ar: "البنية الأساسية للحرم الآمن" },
    description: {
      en: "A high-availability networking and surveillance foundation for multi-building operations.",
      ar: "بنية شبكات ومراقبة عالية الاعتمادية لعمليات متعددة المباني.",
    },
    image: "/mock/project-secure-campus.svg",
    technologies: ["Networking", "CCTV", "Access Control"],
  },
  {
    id: "cloud-modernization",
    title: { en: "Cloud Modernization Program", ar: "برنامج التحديث السحابي" },
    description: {
      en: "Migrated legacy workloads into a cleaner and more resilient cloud operating model.",
      ar: "نقل أحمال العمل القديمة إلى نموذج تشغيل سحابي أوضح وأكثر مرونة.",
    },
    image: "/mock/project-cloud-modernization.svg",
    technologies: ["Cloud", "Migration", "Automation"],
  },
  {
    id: "data-center-refresh",
    title: { en: "Data Center Refresh", ar: "تحديث مركز البيانات" },
    description: {
      en: "Infrastructure redesign focused on uptime, visibility, and simplified maintenance.",
      ar: "إعادة تصميم البنية التحتية مع التركيز على الجاهزية والوضوح وسهولة الصيانة.",
    },
    image: "/mock/project-data-center-refresh.svg",
    technologies: ["Servers", "Storage", "Virtualization"],
  },
  {
    id: "security-operations",
    title: { en: "Security Operations Layer", ar: "طبقة عمليات الأمن" },
    description: {
      en: "Monitoring and incident response workflows that help teams act earlier and with more confidence.",
      ar: "مسارات مراقبة واستجابة للحوادث تساعد الفرق على التحرك مبكراً وبثقة أعلى.",
    },
    image: "/mock/project-security-operations.svg",
    technologies: ["Monitoring", "Logging", "Response"],
  },
];

export function getProjects(locale: Locale): Project[] {
  return projectRecords.map((project) => ({
    id: project.id,
    title: translate(locale, project.title),
    description: translate(locale, project.description),
    image: project.image,
    technologies: project.technologies,
  }));
}