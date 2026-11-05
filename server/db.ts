import { getCloudflareContext } from "@opennextjs/cloudflare";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";
import { env } from "@/env.mjs";
import { normalizeDatabaseUrl } from "@/lib/database-url.mjs";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient(requestScoped = false) {
  const adapter = new PrismaPg({
    connectionString: normalizeDatabaseUrl(env.DATABASE_URL),
    // Workers cannot reuse a Postgres socket from another request.
    ...(requestScoped ? { maxUses: 1 } : {}),
  });
  return new PrismaClient({
    adapter,
    log: env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

const nodeClient = globalForPrisma.prisma ?? createClient();
if (env.NODE_ENV !== "production") globalForPrisma.prisma = nodeClient;

// Each Worker request owns its Prisma client and pool. Weak keys let completed
// requests be collected; maxUses closes each connection when it is released.
const requestClients = new WeakMap<object, PrismaClient>();
function getClient() {
  let context: { ctx: object };
  try {
    context = getCloudflareContext<Record<string, unknown>, object>();
  } catch {
    // Next.js builds and the existing Node/Vercel runtime have no Worker context.
    return nodeClient;
  }
  let client = requestClients.get(context.ctx);
  if (!client) {
    client = createClient(true);
    requestClients.set(context.ctx, client);
  }
  return client;
}

// Preserve the existing db.model API, including NextAuth's Prisma adapter,
// while resolving the client inside the request that uses it.
export const db = new Proxy(nodeClient, {
  get(_target, property) {
    const client = getClient();
    const value = Reflect.get(client, property, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
