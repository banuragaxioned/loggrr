# Overview

## Technology stack

- [Next.js](https://nextjs.org/) for frontend and backend
- [trpc](https://trpc.io/) for API
- [Prisma](https://www.prisma.io/) for database ORM
- Authentication: [NextAuth.js](https://next-auth.js.org/) with Google OAuth
- [PostgreSQL](https://www.postgresql.org/) for database (hosted on [Supabase](https://supabase.io/) for development)
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Tabler Icons](https://tabler-icons.io/) for icons
- [Radix UI](https://www.radix-ui.com/) and [shadcn](https://ui.shadcn.com/) for UI components
- [Vercel](https://vercel.com/) for hosting

## Folder structure

```
.
├── README.md
├── design
|   └── overview.md                         <- You are here
├── prisma                                  <- Prisma ORM
├── public
└── src
    ├── components                          <- Components
    |   ├── layout.tsx
    |   ├── navbar.tsx
    |   └── ui                              <- Primitives
    |     └── button.tsx
    |     └── command.tsx
    └── config
    └── pages                               <- See sitemap
    └── server
    |     └── api
    |           └── router.ts               <- trpc router
    └── styles                              <- Tailwind CSS
    └── utils
```

## Sitemap

```mermaid
graph TD;
    User-->domain.com;
    domain.com--Unauthenticated--->/login;
    domain.com-->/tenantname;
    domain.com-->/profile;
    /tenantname-->/logout;
    /tenantname-->/settings;
    /tenantname-->/members;
    /tenantname-->/billing;
    /tenantname-->/projects;
    /projects-->/projectid;
    /projects-->/manage;
    /tenantname-->/reports;
    /tenantname-->/assign;
    /reports-->/logged;
    /reports-->/assigned;
    /reports-->/available;
```
