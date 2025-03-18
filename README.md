# Loggrr

Clean and simple time logging solution for teams that embrace transparency and want to focus on what really matters.

## Tech stack

- [TypeScript](https://www.typescriptlang.org/)
- [Next.js](https://nextjs.org)
- [Better Auth](https://www.better-auth.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com)
- [Vercel](https://vercel.com)

## Prerequisites

- [nvm](https://github.com/nvm-sh/nvm), [fnm](https://github.com/Schniz/fnm) or [Node.js](https://nodejs.org/en/)
- [pnpm](https://pnpm.io/)
- [Docker](https://docs.docker.com/get-docker/) (for local development)

## Usage

```bash
pnpm dlx shadcn@latest init
```

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Tailwind

Your `tailwind.config.ts` and `globals.css` are already set up to use the components from the `ui` package.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/button";
```
