FROM node:22 AS base

# Install pnpm explicitly
RUN npm install -g pnpm

FROM base AS builder
WORKDIR /app

# Install turbo globally
RUN npm install -g turbo

# Copy monorepo root files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy workspace package files
COPY packages/email ./packages/email
COPY apps/server/package.json ./apps/server/

# Install without frozen lockfile since there's no pnpm-lock.yaml
RUN pnpm install --filter server... --frozen-lockfile

# Copy source code
COPY apps/server/tsconfig.json ./apps/server/
COPY apps/server/src ./apps/server/src

RUN pnpm build --filter server

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/apps/server/dist /app/dist
COPY --from=builder /app/package.json /app/package.json

USER hono
EXPOSE 3000

CMD ["node", "/app/dist/index.js"]
