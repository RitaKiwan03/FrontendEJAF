import type { Locale, Service, ServiceRecord } from "@/lib/content-types";
import { translate } from "@/lib/i18n";

export const serviceRecords: ServiceRecord[] = [
  {
    id: "data-centers",
    title: { en: "Data Centers", ar: "مراكز البيانات" },
    description: {
      en: "Planning, migration, and implementation for resilient environments built to scale.",
      ar: "التخطيط والترحيل والتنفيذ لبيئات مرنة جاهزة للنمو على نطاق واسع.",
    },
    icon: "server",
    gif: "/gifs/data-center-solutions_3.gif",
  },
  {
    id: "cloud-computing",
    title: { en: "Cloud Computing", ar: "الحوسبة السحابية" },
    description: {
      en: "Flexible cloud environments that improve access, resilience, and operational speed.",
      ar: "بيئات سحابية مرنة تعزز الوصول والمرونة وسرعة العمل.",
    },
    icon: "cloud",
    gif: "/gifs/service-2.gif",
  },
  {
    id: "cyber-security",
    title: { en: "Cyber Security", ar: "الأمن السيبراني" },
    description: {
      en: "Enterprise protection strategies designed to reduce risk and strengthen trust.",
      ar: "استراتيجيات حماية مؤسسية لتقليل المخاطر وتعزيز الثقة.",
    },
    icon: "shield",
    gif: "/gifs/service-4.gif",
  },
  {
    id: "networking-solutions",
    title: { en: "Networking Solutions", ar: "حلول الشبكات" },
    description: {
      en: "Reliable network design for offices, campuses, and data-driven operations.",
      ar: "تصميم شبكات موثوق للمكاتب والحرم المؤسسي والعمليات المعتمدة على البيانات.",
    },
    icon: "network",
    gif: "/gifs/service-6.gif",
  },
  {
    id: "intelligent-security",
    title: { en: "Intelligent Security", ar: "الأمن الذكي" },
    description: {
      en: "Integrated access and surveillance systems that support safer facilities.",
      ar: "أنظمة دخول ومراقبة متكاملة تدعم بيئات أكثر أماناً.",
    },
    icon: "camera",
    gif: "/gifs/sevice-1.gif",
  },
  {
    id: "it-management",
    title: { en: "IT Management", ar: "إدارة تقنية المعلومات" },
    description: {
      en: "Managed oversight for systems, updates, and the day-to-day technical workload.",
      ar: "إدارة وتشغيل الأنظمة والتحديثات والأعباء التقنية اليومية.",
    },
    icon: "workflow",
    gif: "/gifs/service-7.gif",
  },
];

export const serviceHighlights = [
  {
    id: "resilience",
    title: { en: "Built for resilience", ar: "مصمم للمرونة" },
    description: {
      en: "Architectures designed to keep core operations available and recoverable.",
      ar: "هياكل تقنية تحافظ على استمرارية العمليات وقابلية الاسترجاع.",
    },
  },
  {
    id: "performance",
    title: { en: "Performance first", ar: "الأداء أولاً" },
    description: {
      en: "Every deployment is tuned for speed, visibility, and clean handoff to support teams.",
      ar: "كل تنفيذ يضبط للسرعة والوضوح وتسليم سلس لفرق الدعم.",
    },
  },
  {
    id: "security",
    title: { en: "Security by default", ar: "الأمان بشكل افتراضي" },
    description: {
      en: "Protection is layered into infrastructure decisions instead of being added later.",
      ar: "تُدمج الحماية داخل قرارات البنية التحتية بدل إضافتها لاحقاً.",
    },
  },
  {
    id: "growth",
    title: { en: "Ready to expand", ar: "جاهز للتوسع" },
    description: {
      en: "Systems scale cleanly as teams, branches, and workloads grow.",
      ar: "تتوسع الأنظمة بسلاسة مع نمو الفرق والفروع وأحمال العمل.",
    },
  },
];

export function getServices(locale: Locale): Service[] {
  return serviceRecords.map((service) => ({
    id: service.id,
    title: translate(locale, service.title),
    description: translate(locale, service.description),
    icon: service.icon,
    gif: service.gif,
  }));
}