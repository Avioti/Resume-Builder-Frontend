# Resume Builder

A modern, production-ready frontend for a resume builder application. Currently **in active development** and will be deployed on Vercel.

> **Status**: Work in Progress
> **Deployment**: Vercel

## Technology Stack

| Frontend | Build & Dev | Styling | i18n | Quality |
|----------|-------------|---------|------|---------|
| [![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react)](https://reactjs.org/) | [![Vite](https://img.shields.io/badge/Vite-5+-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/) | [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3+-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/) | [![i18next](https://img.shields.io/badge/i18next-23+-26A69A?style=flat-square)](https://www.i18next.com/) | [![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/) |
| [![React Router](https://img.shields.io/badge/React%20Router-6+-CA4245?style=flat-square&logo=react-router)](https://reactrouter.com/) | [![PostCSS](https://img.shields.io/badge/PostCSS-8+-DD3A0A?style=flat-square&logo=postcss)](https://postcss.org/) | [![Less](https://img.shields.io/badge/Less-4+-1D365D?style=flat-square&logo=less)](http://lesscss.org/) | [![Transmart](https://img.shields.io/badge/Transmart-Automated-FF6B6B?style=flat-square)](https://github.com/Quilljou/transmart) | [![ESLint](https://img.shields.io/badge/ESLint-8+-4B32C3?style=flat-square&logo=eslint)](https://eslint.org/) |
| [![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Components-000000?style=flat-square)](https://ui.shadcn.com/) | [![SVGR](https://img.shields.io/badge/SVGR-SVG%20Handling-62D9EA?style=flat-square)](https://react-svgr.com/) | [![CSS Variables](https://img.shields.io/badge/CSS%20Variables-Theming-0E7FCF?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) | | [![Prettier](https://img.shields.io/badge/Prettier-Code%20Formatting-F7B93E?style=flat-square&logo=prettier)](https://prettier.io/) |
| [![Lucide Icons](https://img.shields.io/badge/Lucide-Icons-F1635F?style=flat-square)](https://lucide.dev/) | | | | [![Husky](https://img.shields.io/badge/Husky-Git%20Hooks-C41E3A?style=flat-square)](https://typicode.github.io/husky/) |

## Architecture

- **Hash-based Routing**: Optimized for static hosting (GitHub Pages, Vercel)
- **i18n Support**: 11 languages with automated translation via Transmart
- **Type-Safe**: Strict TypeScript configuration with zero implicit any
- **Code Quality**: ESLint, Stylelint, Prettier, and Commitlint enforced via Husky pre-commit hooks
- **Component Library**: shadcn/ui components with Tailwind CSS styling

## Project Structure

```
src/
├── components/       # React components (UI library + custom)
├── hooks/            # Custom React hooks
├── i18n/             # Internationalization (11 languages)
├── lib/              # Utilities, constants, and helpers
├── pages/            # Page components (Home, Resume, About)
├── styles/           # Global LESS stylesheets
├── types/            # TypeScript type definitions
├── app.tsx           # Root component
├── main.tsx          # Application entry point
└── router.tsx        # Route configuration
```


