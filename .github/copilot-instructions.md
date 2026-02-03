# Copilot Instructions for BeatTheATS

## Architecture Overview

This is a Vite + React + TypeScript SPA using hash-based routing. The app is an **ATS-optimized resume builder** with a confident, competitive brand identity. Key concepts:

- **Page layouts via static methods**: Each page component can define a static `getLayout()` method (see [src/router.tsx](../src/router.tsx#L13-L14)). If undefined, `getDefaultLayout` wraps pages with the Header component.
- **Hash routing**: Uses `createHashRouter` from react-router-dom for GitHub Pages compatibility
- **Dynamic i18n loading**: Translation files are lazy-loaded per language/namespace via `resourcesToBackend` (see [src/i18n/config.ts](../src/i18n/config.ts))
- **Transmart integration**: Automated translation system syncing 11 languages (`npm run translate` uses OpenAI)

## Path Aliases & Imports

**Always use the `src/*` path alias** defined in [tsconfig.json](../tsconfig.json) and [vite.config.ts](../vite.config.ts):

```tsx
import { cn } from 'src/lib/utils'        // ✅ Correct
import { Hero } from 'src/components/hero' // ✅ Correct
import { Hero } from '../../components/hero' // ❌ Avoid relative paths
```

## Component Patterns

### shadcn/ui Components

UI components in `src/components/ui/` follow shadcn patterns:
- Use `class-variance-authority` (`cva`) for variant styling
- Apply `cn()` utility from `src/lib/utils` to merge Tailwind classes
- Support `asChild` prop via `@radix-ui/react-slot` for composition

Example from [src/components/ui/button.tsx](../src/components/ui/button.tsx):

```tsx
const buttonVariants = cva(baseStyles, { variants: {...}, defaultVariants: {...} })
<Slot className={cn(buttonVariants({ variant, size, className }))} />
```

## Page Components

Pages in `src/pages/` should:
1. Use `<Helmet>` for setting document title with i18n
2. Import translations via `useTranslation('translation')` hook
3. Optionally define static `getLayout` method to override default layout

**Note:** The About page component exists at `src/pages/about/index.tsx` but is not yet added to the router. When ready to enable it, add this route to `routerObjects` in [src/router.tsx](../src/router.tsx):
```tsx
{
  path: '/about',
  Component: AboutPage,
}
```

## i18n Workflow

1. **Add keys to English source**: Edit `src/i18n/locales/en/translation.json`
2. **Auto-translate**: Run `npm run translate` (uses Transmart + OpenAI to sync all 11 locales)
3. **Generate TypeScript types**: Run `npm run i18next-resources-for-ts` to update `src/types/resources.ts` for type-safe keys

**Supported languages** (from [src/i18n/config.ts](../src/i18n/config.ts)): en, de, fr, es, zh-Hans, zh-Hant, ja, ko, pt, it, ru

## Styling Guidelines

- **Tailwind + LESS hybrid**: Use Tailwind utility classes for most styling; LESS files in `src/styles/` for global styles
- **CSS variables for theming**: Colors use HSL CSS variables (e.g., `hsl(var(--primary))`) defined in [tailwind.config.js](../tailwind.config.js)
- **Dark mode**: Configured with `class` strategy (`darkMode: ['class']`)

## Development Commands

```sh
npm run dev              # Start dev server on port 5000
npm run build            # Type check + production build
npm run typecheck:watch  # Watch mode for type errors
npm run lint:fix         # Auto-fix ESLint + Stylelint issues
```

## Quality Tools

- **Pre-commit hooks** (Husky + lint-staged): Auto-runs ESLint/Stylelint on staged files
- **Commitlint**: Enforces conventional commit messages
- **Strict TypeScript**: `strict: true` with `noImplicitAny`, `strictNullChecks` enabled

## Adding New Pages

1. Create page component in `src/pages/<name>/index.tsx`
2. Add route to `routerObjects` array in [src/router.tsx](../src/router.tsx#L8-L14)
3. Optional: Add static `getLayout` method to page component for custom layout
4. Add translations to `src/i18n/locales/en/translation.json` and run `npm run translate`

## Current Pages

The app currently has three pages:
- **Home** ([src/pages/home/index.tsx](../src/pages/home/index.tsx)): Landing page with Hero component
- **Resume** ([src/pages/resume/index.tsx](../src/pages/resume/index.tsx)): Resume builder with form inputs for name, job title, and skills
- **About** ([src/pages/about/index.tsx](../src/pages/about/index.tsx)): Currently contains placeholder content (needs implementation)

## Deployment Notes

- **Base URL**: Uses `base: './'` in Vite config for relative asset paths
- **Hash routing**: Required for static hosting (GitHub Pages, Cloudflare Pages)
- **Build output**: `dist/` directory
