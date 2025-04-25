FROM node:22-alpine AS base

# Install pnpm explicitly
RUN npm install -g pnpm

FROM base AS builder
WORKDIR /app

# Copy package files first for better caching
COPY package.json ./
# Install without frozen lockfile since there's no pnpm-lock.yaml
RUN pnpm install --no-optional

# Now copy source code
COPY tsconfig.json ./
COPY src ./src
RUN pnpm run build

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
