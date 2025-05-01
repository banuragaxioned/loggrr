FROM node:22 AS base

# Install pnpm explicitly
RUN npm install -g pnpm

FROM base AS builder
WORKDIR /app

# Copy monorepo root files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy workspace package files
COPY packages/email/package.json ./packages/email/
COPY apps/server/package.json ./apps/server/

# Install without frozen lockfile since there's no pnpm-lock.yaml
RUN pnpm install --filter @loggrr/server... --frozen-lockfile

# Copy source code
COPY apps/server/tsconfig.json ./apps/server/
COPY apps/server/src ./apps/server/src

RUN pnpm build --filter @loggrr/server

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package.json

USER hono
EXPOSE 3000

CMD ["node", "/app/dist/index.js"]
