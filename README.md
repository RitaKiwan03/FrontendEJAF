# EJAF Technology Frontend

Premium Next.js 14 frontend for EJAF Technology, rebuilt as a typed, bilingual, API-ready interface.

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React icons

## Project Structure

- `src/app` contains the route pages, API route placeholders, and admin UI routes.
- `src/components` contains reusable shells, cards, forms, motion helpers, and locale controls.
- `src/data` contains local mock data that mirrors the eventual API payloads.
- `src/lib/api.ts` is the only place pages should use for content fetching.
- `src/lib/i18n.ts` resolves locale state, query-string routing, and date formatting.
- `public/mock` contains local illustration assets used by projects and blog cards.

## Data Flow

1. Page components call `getServicesApi`, `getProjectsApi`, or `getBlogApi` from `src/lib/api.ts`.
2. Those helpers try the matching placeholder endpoint first.
3. If the endpoint is unavailable, they fall back to the local mock data in `src/data`.
4. The UI consumes the normalized frontend shape only: `id`, `title`, `description`, `icon`, `image`, `createdAt`, and related fields.

## Locale Support

- English is the default language.
- Arabic is enabled with RTL direction switching.
- The language switcher uses the `lang=ar` query parameter.
- `src/components/locale-sync.tsx` keeps the document direction and language attribute aligned with the selected locale.

## Running Locally

From the app folder:

```powershell
Set-Location .\ejaf-website
npm run dev
```

Production build:

```powershell
Set-Location .\ejaf-website
npm run build
```

## API Layer

The frontend is prepared for Laravel integration through `src/lib/api.ts` and the placeholder routes:

- `GET /api/services`
- `GET /api/projects`
- `GET /api/blog`

These routes currently return local mock data, but the page components already consume them through the abstraction layer.

## Admin UI

- `/admin/login` is a frontend-only login surface.
- `/admin/dashboard` is the main workspace.
- `/admin/services`, `/admin/projects`, and `/admin/blog` provide list, form, and action layouts.

## Notes

- This project is frontend-only for now.
- The code is structured so Laravel can replace the placeholder API responses without changing the page components.

## Logo

- Place your PNG logo in `public/brand/` or `public/images/`.
- Use a transparent PNG with enough padding so the mark does not touch the edges.
- Keep the source file around 2x the intended display size for crisp results on retina screens.
- Optimize the file before shipping; a small, clean PNG usually works well for the navbar.
- Use Next.js `Image` in the navbar so the logo benefits from sizing and lazy loading.
- If you later want sharper scaling and smaller payloads, convert the logo to SVG after the brand is finalized.

## Typography

- Put custom `.ttf` files in `public/fonts/`.
- Load them with `next/font/local` for best performance and predictable fallback behavior.
- Use one family for English and another for Arabic if both are available.
- If custom fonts are not available, use `Inter` for English and `Cairo` or `Tajawal` for Arabic.
- Control weights globally through the font loader and Tailwind base styles.
- Switch fonts by locale using the document language and direction state already handled by `src/components/locale-sync.tsx`.

## Language Editing

- English is the default language.
- Arabic uses `lang=ar` and RTL direction.
- Site text lives in locale-aware data files so editing copy does not require component rewrites.
- The admin screens now mirror the multilingual data model with paired English and Arabic fields.
# FrontendEJAF
