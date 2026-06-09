# Backend Integration Guide

This frontend expects a REST API and can be wired to Laravel without changing the page components.

The frontend is multilingual. The backend should return paired English and Arabic fields for every record and the UI will render the correct locale.

## Required Endpoints

- `GET /api/services`
- `GET /api/projects`
- `GET /api/blog`

Optional future endpoint for article details:

- `GET /api/blog/{slug}`

## Response Contract

The frontend expects flat JSON objects with these fields.

The recommended multilingual shape is:

```json
{
  "title_en": "...",
  "title_ar": "...",
  "description_en": "...",
  "description_ar": "..."
}
```

### Services

```json
[
  {
    "id": "data-centers",
    "title_en": "Data Centers",
    "title_ar": "مراكز البيانات",
    "description_en": "Planning, migration, and implementation for resilient environments built to scale.",
    "description_ar": "التخطيط والترحيل والتنفيذ لبيئات مرنة جاهزة للنمو على نطاق واسع.",
    "icon": "server"
  }
]
```

### Projects

```json
[
  {
    "id": "secure-campus",
    "title_en": "Secure Campus Backbone",
    "title_ar": "البنية الأساسية للحرم الآمن",
    "description_en": "A high-availability networking and surveillance foundation for multi-building operations.",
    "description_ar": "بنية شبكات ومراقبة عالية الاعتمادية لعمليات متعددة المباني.",
    "image": "/mock/project-secure-campus.svg",
    "technologies": ["Networking", "CCTV", "Access Control"]
  }
]
```

### Blog

```json
[
  {
    "id": "surveillance-cctv-solutions-iraq",
    "slug": "surveillance-cctv-solutions-iraq",
    "title_en": "The Power of Surveillance: Effective CCTV Solutions for Iraq",
    "title_ar": "قوة المراقبة: حلول CCTV فعالة في العراق",
    "excerpt_en": "How surveillance systems can strengthen public and business safety in a demanding environment.",
    "excerpt_ar": "كيف تعزز أنظمة المراقبة سلامة الأفراد والأعمال في بيئة مليئة بالتحديات.",
    "content_en": "Modern security programs combine cameras, network design, storage, and response workflows...",
    "content_ar": "تجمع البرامج الأمنية الحديثة بين الكاميرات وتصميم الشبكات والتخزين ومسارات الاستجابة...",
    "image": "/mock/blog-surveillance.svg",
    "createdAt": "2023-06-14",
    "tags": ["Security", "CCTV", "Infrastructure"]
  }
]
```

## Laravel Notes

- Match field names exactly.
- Return REST JSON responses with no nested CMS-specific wrappers.
- Use the paired keys `title_en`, `title_ar`, `description_en`, `description_ar`, and for blog posts also `excerpt_en`, `excerpt_ar`, `content_en`, and `content_ar`.
- Keep `icon` values as simple string identifiers so the frontend icon map can stay global.
- Keep `createdAt` in ISO 8601 format.
- If images come from Laravel media storage, keep the field name `image` and return a public URL.

## Recommended Laravel Shape

- Services: `id`, `title_en`, `title_ar`, `description_en`, `description_ar`, `icon`
- Projects: `id`, `title_en`, `title_ar`, `description_en`, `description_ar`, `image`, `technologies`
- Blog: `id`, `slug`, `title_en`, `title_ar`, `excerpt_en`, `excerpt_ar`, `content_en`, `content_ar`, `image`, `createdAt`, `tags`

## Future Extension

If you add create/update/delete endpoints later, keep the same field names in request payloads so the admin UI can connect without rewriting the forms.
