import type { BlogPost, BlogRecord, Locale } from "@/lib/content-types";
import { translate } from "@/lib/i18n";

export const blogRecords: BlogRecord[] = [
  {
    id: "surveillance-cctv-solutions-iraq",
    slug: "surveillance-cctv-solutions-iraq",
    createdAt: "2023-06-14",
    title: {
      en: "The Power of Surveillance: Effective CCTV Solutions for Iraq",
      ar: "قوة المراقبة: حلول CCTV فعالة في العراق",
    },
    excerpt: {
      en: "How surveillance systems can strengthen public and business safety in a demanding environment.",
      ar: "كيف تعزز أنظمة المراقبة سلامة الأفراد والأعمال في بيئة مليئة بالتحديات.",
    },
    content: {
      en: "Modern security programs combine cameras, network design, storage, and response workflows so teams can react quickly and reduce blind spots.",
      ar: "تجمع البرامج الأمنية الحديثة بين الكاميرات وتصميم الشبكات والتخزين ومسارات الاستجابة حتى تتمكن الفرق من التحرك بسرعة وتقليل نقاط الضعف.",
    },
    image: "/mock/blog-surveillance.svg",
    tags: ["Security", "CCTV", "Infrastructure"],
  },
  {
    id: "digital-landscape-it-solutions",
    slug: "digital-landscape-it-solutions",
    createdAt: "2023-06-14",
    title: {
      en: "Navigating the Digital Landscape in Iraq: Top 5 IT Solutions",
      ar: "التنقل في المشهد الرقمي بالعراق: أفضل 5 حلول تقنية",
    },
    excerpt: {
      en: "A practical look at the technology foundations that help modern businesses move forward.",
      ar: "نظرة عملية على الأسس التقنية التي تساعد الشركات الحديثة على التقدم.",
    },
    content: {
      en: "Reliable infrastructure starts with clear priorities: availability, security, cloud readiness, and the ability to support new services without disruption.",
      ar: "تبدأ البنية التحتية الموثوقة بأولويات واضحة: التوفر والأمان والجاهزية السحابية والقدرة على دعم خدمات جديدة دون انقطاع.",
    },
    image: "/mock/blog-digital-landscape.svg",
    tags: ["Cloud", "IT", "Strategy"],
  },
  {
    id: "gold-partner-value",
    slug: "gold-partner-value",
    createdAt: "2023-05-31",
    title: {
      en: "Elevating Your Business: The Advantages of Being a Gold Partner in Iraq",
      ar: "رفع قيمة الأعمال: مزايا أن تكون شريكاً ذهبياً في العراق",
    },
    excerpt: {
      en: "Why strong partnerships can increase credibility, reach, and growth opportunities.",
      ar: "لماذا يمكن للشراكات القوية أن تزيد الموثوقية والانتشار وفرص النمو.",
    },
    content: {
      en: "A strong partner network shortens delivery cycles, improves support quality, and gives customers a clearer path from planning to deployment.",
      ar: "تساعد الشبكة القوية من الشركاء على تقصير دورة التنفيذ وتحسين جودة الدعم ومنح العملاء مساراً أوضح من التخطيط إلى التشغيل.",
    },
    image: "/mock/blog-gold-partner.svg",
    tags: ["Partnerships", "Growth", "Business"],
  },
  {
    id: "enterprise-modernization",
    slug: "enterprise-modernization",
    createdAt: "2023-05-12",
    title: {
      en: "Enterprise Modernization Starts With the Network",
      ar: "تبدأ تحديثات المؤسسات من الشبكة",
    },
    excerpt: {
      en: "A reliable network is the base layer for cloud adoption, security, and application performance.",
      ar: "الشبكة الموثوقة هي الطبقة الأساسية لاعتماد السحابة والأمان وأداء التطبيقات.",
    },
    content: {
      en: "When the network is designed well, every other system becomes easier to support, scale, and secure.",
      ar: "عندما تُصمم الشبكة بشكل صحيح تصبح كل الأنظمة الأخرى أسهل في الدعم والتوسع والحماية.",
    },
    image: "/mock/blog-enterprise-modernization.svg",
    tags: ["Networking", "Enterprise", "Performance"],
  },
];

export function getBlogPosts(locale: Locale): BlogPost[] {
  return blogRecords.map((post) => ({
    id: post.id,
    slug: post.slug,
    createdAt: post.createdAt,
    title: translate(locale, post.title),
    excerpt: translate(locale, post.excerpt),
    content: translate(locale, post.content),
    image: post.image,
    tags: post.tags,
  }));
}

export function getBlogPost(locale: Locale, slug: string) {
  const post = blogRecords.find((item) => item.slug === slug);

  if (!post) {
    return null;
  }

  return {
    id: post.id,
    slug: post.slug,
    createdAt: post.createdAt,
    title: translate(locale, post.title),
    excerpt: translate(locale, post.excerpt),
    content: translate(locale, post.content),
    image: post.image,
    tags: post.tags,
  } satisfies BlogPost;
}