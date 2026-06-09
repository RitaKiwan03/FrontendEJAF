import type { NavItem, SectionCopy, SiteStat } from "@/lib/content-types";

export const navigationItems: NavItem[] = [
  { href: "/", label: { en: "Home", ar: "الرئيسية" } },
  { href: "/about", label: { en: "About", ar: "من نحن" } },
  { href: "/services", label: { en: "Services", ar: "الخدمات" } },
  { href: "/projects", label: { en: "Projects", ar: "المشاريع" } },
  { href: "/blog", label: { en: "Blog", ar: "المدونة" } },
  { href: "/contact", label: { en: "Contact", ar: "اتصل بنا" } },
];

export const footerNavigationItems: NavItem[] = [
  { href: "/services", label: { en: "Capabilities", ar: "القدرات" } },
  { href: "/projects", label: { en: "Case Studies", ar: "دراسات الحالة" } },
  { href: "/blog", label: { en: "Insights", ar: "الرؤى" } },
  { href: "/contact", label: { en: "Contact", ar: "التواصل" } },
];

export const siteStats: SiteStat[] = [
  { value: "800+", label: { en: "Satisfied clients", ar: "عملاء راضون" } },
  {
    value: "1,900+",
    label: { en: "Projects delivered", ar: "مشروعاً منجزاً" },
  },
  { value: "30+", label: { en: "Trusted partners", ar: "شريكاً موثوقاً" } },
  { value: "3", label: { en: "Local offices", ar: "مكاتب محلية" } },
];

export const companySummary: SectionCopy[] = [
  {
    eyebrow: { en: "Who we are", ar: "من نحن" },
    title: { en: "Reliable technology partner", ar: "شريك تقني موثوق" },
    description: {
      en: "EJAF Technology helps organisations across Iraq build stable, secure, and scalable digital infrastructure.",
      ar: "تساعد شركة EJAF Technology المؤسسات في العراق على بناء بنية رقمية مستقرة وآمنة وقابلة للتوسع.",
    },
  },
  {
    eyebrow: { en: "Our footprint", ar: "حضورنا" },
    title: { en: "Support across the country", ar: "دعم عبر أنحاء البلاد" },
    description: {
      en: "With teams in Erbil, Baghdad, and Basrah, the company stays close to clients and project delivery.",
      ar: "بفضل فرقنا في أربيل وبغداد والبصرة نبقى قريبين من العملاء ومراحل التنفيذ.",
    },
  },
  {
    eyebrow: { en: "Our focus", ar: "تركيزنا" },
    title: { en: "Practical outcomes", ar: "نتائج عملية" },
    description: {
      en: "The work centers on security, cloud, networking, and support systems that make daily operations simpler.",
      ar: "يركز العمل على الأمن والسحابة والشبكات وأنظمة الدعم التي تجعل التشغيل اليومي أبسط.",
    },
  },
];

export const contactLocations: SectionCopy[] = [
  {
    eyebrow: { en: "Erbil", ar: "أربيل" },
    title: {
      en: "Villa No. 384, G3 - Dream City",
      ar: "الفيلا رقم 384، G3 - دريم سيتي",
    },
    description: {
      en: "Primary office for project coordination and client support.",
      ar: "المكتب الرئيسي لتنسيق المشاريع ودعم العملاء.",
    },
  },
  {
    eyebrow: { en: "Baghdad", ar: "بغداد" },
    title: { en: "Al-Amerat Street, Al-Mansur", ar: "شارع الأمريات، المنصور" },
    description: {
      en: "Coverage for enterprise deployments and service work in the capital.",
      ar: "تغطية لتنفيذ المشاريع المؤسسية وأعمال الخدمة في العاصمة.",
    },
  },
  {
    eyebrow: { en: "Basrah", ar: "البصرة" },
    title: {
      en: "Algeria District, near Benghazwan Hospital",
      ar: "حي الجزائر، قرب مستشفى بنغزوان",
    },
    description: {
      en: "Regional support for southern customers and on-site coordination.",
      ar: "دعم إقليمي لعملائنا في الجنوب وتنسيق ميداني مباشر.",
    },
  },
];

export const solutionHighlights: SectionCopy[] = [
  {
    eyebrow: { en: "Data centers", ar: "مراكز البيانات" },
    title: { en: "Connected infrastructure", ar: "بنية مترابطة" },
    description: {
      en: "Layouts that keep servers, storage, and core applications synchronized.",
      ar: "تصاميم تبقي الخوادم والتخزين والتطبيقات الأساسية متزامنة.",
    },
  },
  {
    eyebrow: { en: "Security", ar: "الأمن" },
    title: { en: "Layered protection", ar: "حماية متعددة الطبقات" },
    description: {
      en: "Security workflows that cover the network, devices, cameras, and access points.",
      ar: "مسارات أمنية تغطي الشبكة والأجهزة والكاميرات ونقاط الوصول.",
    },
  },
  {
    eyebrow: { en: "Hosting", ar: "الاستضافة" },
    title: { en: "Reliable hosting", ar: "استضافة موثوقة" },
    description: {
      en: "Managed environments tuned for uptime, visibility, and easier maintenance.",
      ar: "بيئات مُدارة مضبوطة للجاهزية والوضوح وسهولة الصيانة.",
    },
  },
  {
    eyebrow: { en: "Testing", ar: "الاختبار" },
    title: { en: "Network assurance", ar: "ضمان الشبكة" },
    description: {
      en: "Assessment-led testing that helps identify weaknesses before they affect operations.",
      ar: "اختبارات مبنية على التقييم تساعد في اكتشاف نقاط الضعف قبل تأثيرها على التشغيل.",
    },
  },
];

export const siteCopy = {
  en: {
    brand: "EJAF Technology",
    tagline: "Technology infrastructure for modern organisations",
    hero: {
      eyebrow: "Data centers • Cloud • Security • Networking",
      title:
        "EJAF designs dependable digital foundations for companies that cannot afford downtime.",
      description:
        "We combine infrastructure planning, security, and support into a clear operating model that feels premium, stable, and ready for growth.",
      primaryCta: "Explore services",
      secondaryCta: "Talk to us",
      infraCardTitle: "Infrastructure signal",
      infraCardDescription:
        "A premium frontend layer designed to communicate scale, reliability, and engineering confidence before the backend is connected.",
      infraCardItemText: "High-trust delivery for complex environments.",
    },
    home: {
      servicesTitle: "What we do",
      servicesDescription:
        "From core infrastructure to field deployment, the service mix mirrors the original website while presenting it with a cleaner premium feel.",
      projectsTitle: "Featured delivery",
      projectsDescription:
        "Visual stories that show how EJAF approaches enterprise networking, cloud adoption, and security programs.",
      blogTitle: "Latest insights",
      blogDescription:
        "Technical articles and business notes that can later be connected to Laravel endpoints without changing the UI.",
      techSuccessEyebrow: "Technological success",
      techSuccessTitle:
        "We focus on clear delivery, practical value, and long-term reliability.",
      techSuccessDescription:
        "The goal is to reduce operational burden and provide systems that stay dependable as your business grows.",
      techSuccessCardText: "Strategic coverage and clean delivery.",
      viewServices: "View services",
      viewProjects: "View projects",
      whoWeAreEyebrow: "Who we are",
      whoWeAreTitle:
        "Ejaf Technology is a trusted source in IT services, security, and support.",
      whoWeAreDescription:
        "We help organizations across Iraq reduce complexity, improve security, and move forward with reliable technology.",
      locationsTitle: "Three domestic locations",
      locationsText:
        "Erbil, Baghdad, and Basrah help us support clients across the country.",
      contactFootnote:
        "Erbil, Baghdad, and Basrah give EJAF a nationwide support footprint for implementation and follow-through.",
    },
    page: {
      aboutTitle: "About EJAF",
      servicesTitle: "Services",
      projectsTitle: "Projects",
      blogTitle: "Blog",
      contactTitle: "Contact",
      adminTitle: "Admin Workspace",
      operationalCoverage: "Operational coverage built for scale.",
      servicesCapabilities: "Capabilities",
      servicesCapabilitiesTitle:
        "Built for data centers, cloud, security, and networking.",
      servicesCapabilitiesDescription:
        "The service catalog stays close to the original site while being structured for future API delivery and Laravel integration.",
      blogFeaturedLabel: "Blog",
      blogReadMore: "Read More",
      blogSearchPlaceholder: "Search ...",
      blogSearchButton: "Search",
      blogPopularPosts: "Popular Posts",
      blogRelatedPosts: "Related posts",
      blogMoreReading: "More reading",
      blogBreadcrumbHome: "Home",
      blogBreadcrumbBlog: "Blog",
    },
    contact: {
      title: "Start a project conversation",
      description:
        "Use the form below to request a consultation, share a requirement, or discuss a deployment plan.",
      formTitle: "Send a message",
      formNote:
        "This is a frontend-only form shell that can later connect to Laravel validation and storage.",
      locationsTitle: "Office locations",
      phoneLabel: "Phone",
      emailLabel: "Email",
      namePlaceholder: "Your name",
      emailPlaceholder: "Email address",
      subjectPlaceholder: "Subject",
      messagePlaceholder: "Tell us about your project",
      submitLabel: "Send message",
      mapLabel: "Erbil office map",
    },
    admin: {
      loginTitle: "Administrative access",
      dashboardTitle: "Control workspace",
      services: "Manage services",
      projects: "Manage projects",
      blog: "Manage blog",
    },
    footerNote: "Premium technology services delivered across Iraq.",
    footerCopyright: "© 2026 EJAF Technology. All rights reserved.",
    serviceLabel: "Service",
    readArticleLabel: "Read article",
  },
  ar: {
    brand: "EJAF Technology",
    tagline: "بنية تقنية للمؤسسات الحديثة",
    hero: {
      eyebrow: "مراكز البيانات • السحابة • الأمن • الشبكات",
      title: "تصمم EJAF أسساً رقمية موثوقة للشركات التي لا تحتمل التوقف.",
      description:
        "نجمع بين تخطيط البنية التحتية والأمن والدعم ضمن نموذج تشغيل واضح يبدو فاخراً ومستقراً وجاهزاً للنمو.",
      primaryCta: "استعرض الخدمات",
      secondaryCta: "تواصل معنا",
      infraCardTitle: "إشارة البنية التحتية",
      infraCardDescription:
        "طبقة واجهة فاخرة مصممة لإيصال معاني الحجم والموثوقية والثقة الهندسية قبل ربط الخلفية.",
      infraCardItemText: "تسليم موثوق للبيئات المعقدة.",
    },
    home: {
      servicesTitle: "ما الذي نقدمه",
      servicesDescription:
        "من البنية الأساسية إلى التنفيذ الميداني، تعكس الخدمة القائمة الأصلية لكن بواجهة أكثر وضوحاً وفخامة.",
      projectsTitle: "أعمال مختارة",
      projectsDescription:
        "قصص بصرية توضح كيفية تعامل EJAF مع شبكات المؤسسات واعتماد السحابة وبرامج الأمن.",
      blogTitle: "آخر الرؤى",
      blogDescription:
        "مقالات تقنية وملاحظات أعمال يمكن ربطها لاحقاً بنقاط نهاية Laravel دون تغيير الواجهة.",
      techSuccessEyebrow: "النجاح التقني",
      techSuccessTitle:
        "نركز على التسليم الواضح والقيمة العملية والموثوقية طويلة الأمد.",
      techSuccessDescription:
        "الهدف هو تقليل الأعباء التشغيلية وتوفير أنظمة تظل موثوقة مع نمو أعمالك.",
      techSuccessCardText: "تغطية استراتيجية وتسليم نظيف.",
      viewServices: "عرض الخدمات",
      viewProjects: "عرض المشاريع",
      whoWeAreEyebrow: "من نحن",
      whoWeAreTitle:
        "EJAF Technology مصدر موثوق في خدمات تقنية المعلومات والأمن والدعم.",
      whoWeAreDescription:
        "نساعد المؤسسات في العراق على تقليل التعقيد وتحسين الأمن والمضي قدماً بتقنية موثوقة.",
      locationsTitle: "ثلاثة مكاتب محلية",
      locationsText: "أربيل وبغداد والبصرة تساعدنا في دعم العملاء عبر البلاد.",
      contactFootnote:
        "تمنح أربيل وبغداد والبصرة EJAF حضوراً وطنياً للدعم والتنفيذ والمتابعة.",
    },
    page: {
      aboutTitle: "عن EJAF",
      servicesTitle: "الخدمات",
      projectsTitle: "المشاريع",
      blogTitle: "المدونة",
      contactTitle: "اتصل بنا",
      adminTitle: "مساحة الإدارة",
      operationalCoverage: "تغطية تشغيلية مبنية للتوسع.",
      servicesCapabilities: "القدرات",
      servicesCapabilitiesTitle:
        "مصممة لمراكز البيانات والسحابة والأمن والشبكات.",
      servicesCapabilitiesDescription:
        "يبقى كتالوج الخدمات قريباً من الموقع الأصلي مع هيكلة لتسليم API مستقبلي وتكامل Laravel.",
      blogFeaturedLabel: "المدونة",
      blogReadMore: "اقرأ المزيد",
      blogSearchPlaceholder: "البحث ...",
      blogSearchButton: "بحث",
      blogPopularPosts: "المقالات الشائعة",
      blogRelatedPosts: "مقالات ذات صلة",
      blogMoreReading: "قراءة المزيد",
      blogBreadcrumbHome: "الرئيسية",
      blogBreadcrumbBlog: "المدونة",
    },
    contact: {
      title: "ابدأ محادثة مشروع",
      description:
        "استخدم النموذج أدناه لطلب استشارة أو مشاركة متطلب أو مناقشة خطة تنفيذ.",
      formTitle: "أرسل رسالة",
      formNote: "هذا نموذج واجهة فقط ويمكن ربطه لاحقاً بتحقق Laravel والتخزين.",
      locationsTitle: "مواقع المكاتب",
      phoneLabel: "الهاتف",
      emailLabel: "البريد الإلكتروني",
      namePlaceholder: "اسمك",
      emailPlaceholder: "البريد الإلكتروني",
      subjectPlaceholder: "الموضوع",
      messagePlaceholder: "أخبرنا عن مشروعك",
      submitLabel: "إرسال الرسالة",
      mapLabel: "خريطة مكتب أربيل",
    },
    admin: {
      loginTitle: "دخول الإدارة",
      dashboardTitle: "مساحة التحكم",
      services: "إدارة الخدمات",
      projects: "إدارة المشاريع",
      blog: "إدارة المدونة",
    },
    footerNote: "خدمات تقنية فاخرة تقدم عبر العراق.",
    footerCopyright: "© 2026 EJAF Technology. جميع الحقوق محفوظة.",
    serviceLabel: "خدمة",
    readArticleLabel: "اقرأ المقال",
  },
} as const;
