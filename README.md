# Craftfolio

A modern, production-ready resume builder frontend. Create polished, professional resumes in minutes with a calm, guided experience.

> **Status**: Production Ready
> **Live Demo**: Coming soon on Vercel

## Features

- ✨ **Guided Builder** — Step-by-step form with real-time preview
- 📄 **A4 Print-Ready** — Professional layout optimized for ATS
- 🎨 **Warm, Confident Design** — Premium "high-end stationery" aesthetic
- 🌍 **11 Languages** — Automated i18n via Transmart
- 📱 **Fully Responsive** — Works on all devices
- 🔒 **Privacy First** — Data stays in localStorage (no account required)
- 🖨️ **PDF Export** — Print-safe output with browser print

## Technology Stack

| Frontend | Build & Dev | Styling | i18n | Quality |
|----------|-------------|---------|------|---------|
| [![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react)](https://reactjs.org/) | [![Vite](https://img.shields.io/badge/Vite-5+-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/) | [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3+-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/) | [![i18next](https://img.shields.io/badge/i18next-23+-26A69A?style=flat-square)](https://www.i18next.com/) | [![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/) |
| [![React Router](https://img.shields.io/badge/React%20Router-6+-CA4245?style=flat-square&logo=react-router)](https://reactrouter.com/) | [![PostCSS](https://img.shields.io/badge/PostCSS-8+-DD3A0A?style=flat-square&logo=postcss)](https://postcss.org/) | [![Less](https://img.shields.io/badge/Less-4+-1D365D?style=flat-square&logo=less)](http://lesscss.org/) | [![Transmart](https://img.shields.io/badge/Transmart-Automated-FF6B6B?style=flat-square)](https://github.com/nicepkg/transmart) | [![ESLint](https://img.shields.io/badge/ESLint-8+-4B32C3?style=flat-square&logo=eslint)](https://eslint.org/) |
| [![Framer Motion](https://img.shields.io/badge/Framer%20Motion-Animations-0055FF?style=flat-square)](https://www.framer.com/motion/) | [![SVGR](https://img.shields.io/badge/SVGR-SVG%20Handling-62D9EA?style=flat-square)](https://react-svgr.com/) | [![CSS Variables](https://img.shields.io/badge/CSS%20Variables-Theming-0E7FCF?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) | | [![Prettier](https://img.shields.io/badge/Prettier-Code%20Formatting-F7B93E?style=flat-square&logo=prettier)](https://prettier.io/) |
| [![Lucide Icons](https://img.shields.io/badge/Lucide-Icons-F1635F?style=flat-square)](https://lucide.dev/) | | | | [![Husky](https://img.shields.io/badge/Husky-Git%20Hooks-C41E3A?style=flat-square)](https://typicode.github.io/husky/) |

## Architecture

- **Hash-based Routing**: Optimized for static hosting (GitHub Pages, Vercel)
- **State Management**: React Context + useReducer with localStorage persistence
- **i18n Support**: 11 languages with automated translation via Transmart
- **Type-Safe**: Strict TypeScript configuration with zero implicit any
- **Code Quality**: ESLint, Stylelint, Prettier, and Commitlint enforced via Husky
- **Component Library**: shadcn/ui components with Tailwind CSS styling
- **Motion Design**: Framer Motion for calm, confident animations

## Project Structure

```
src/
├── components/       # React components
│   ├── ui/           # shadcn/ui components (Button, Popover, Spinner)
│   ├── resume-forms/ # Form sections (Personal, Experience, Education, Skills)
│   ├── resume-preview/ # Preview components (MiniPreview, ResumeDocument)
│   ├── header/       # Site header with logo
│   └── layout/       # Layout wrappers
├── hooks/            # Custom React hooks
├── i18n/             # Internationalization (11 languages)
├── lib/              # Utilities
│   ├── motion.ts     # Framer Motion animation variants
│   ├── resume-context.tsx # Resume state management
│   └── utils.ts      # Helper functions
├── pages/            # Page components
│   ├── home/         # Landing page
│   ├── start/        # Getting started
│   ├── resume/       # Resume builder editor
│   ├── preview/      # Full-page preview + export
│   └── signup/       # Account creation (mock)
├── styles/           # Global LESS stylesheets
├── types/            # TypeScript type definitions
├── app.tsx           # Root component
├── main.tsx          # Application entry point
└── router.tsx        # Route configuration
```

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linters
npm run lint:fix
```

Open [http://localhost:5000](http://localhost:5000) to view the app.

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing page with value proposition |
| `/start` | Getting started options |
| `/resume` | Resume builder editor (4 sections) |
| `/preview` | Full-page A4 preview with export |
| `/signup` | Account creation (mock) |

## Design System

- **Typography**: Fraunces (display) + DM Sans (body) via Google Fonts
- **Colors**: Warm neutrals with amber accent (`#f59e0b`)
- **Spacing**: 4px base unit, consistent rhythm
- **Shadows**: Warm-tinted for depth
- **Animations**: Calm, confident (0.2-0.5s durations)

See [src/styles/globals.less](src/styles/globals.less) for CSS variables.

## Backend Integration

This frontend is designed to work standalone (localStorage) but is architected for easy backend integration. See [BACKEND_INTEGRATION.md](BACKEND_INTEGRATION.md) for:

- API endpoint specifications
- Authentication flow
- PDF generation options
- Database schema recommendations

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 5000 |
| `npm run build` | Type check + production build |
| `npm run typecheck` | Run TypeScript compiler |
| `npm run lint:fix` | Auto-fix ESLint + Stylelint issues |
| `npm run translate` | Sync translations via Transmart |

## License

MIT
