# Loggrr

Clean and simple time logging solution for teams that embrace transparency and want to focus on what really matters.

## Tech stack

- [Next 16](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com)
- [Vercel](https://vercel.com)

## Getting Started

### Prerequisites

- [mise](https://mise.jdx.dev/) (reads `.tool-versions` to provision Node + Bun), or [Node.js](https://nodejs.org/en/) 24 + [Bun](https://bun.sh/) installed manually
- [Docker](https://docs.docker.com/get-docker/) (for local development)

### Installation

```bash

# Setup environment variables
cp .env.example env

# Install dependencies
bun install

# Start the database
docker compose up

# Push db changes
bun run push

# Seed the database
bun run seed

# Start the development server
bun run dev

# Build for production
bun run build

# Start the production server
bun run start
```
