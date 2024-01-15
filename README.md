# Loggr

Clean and simple time logging solution for teams that embrace transparency and want to focus on what really matters.

## Tech stack

- [Next 14](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com)
- [Vercel](https://vercel.com)

## Getting Started

### Prerequisites

- [nvm](https://github.com/nvm-sh/nvm), [fnm](https://github.com/Schniz/fnm) or [Node.js](https://nodejs.org/en/)
- [pnpm](https://pnpm.io/)
- [Docker](https://docs.docker.com/get-docker/) (for local development)

### Installation

```bash

# Setup environment variables
cp .env.example env

# Install dependencies
p install

# Start the database
docker compose up

# Push db changes
p push

# Seed the database
p seed

# Start the development server
p dev

# Build for production
p build

# Start the production server
p start
```
