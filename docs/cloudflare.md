# Cloudflare migration trial

Loggrr uses the OpenNext Cloudflare adapter on the `migrate/cloudflare-workers`
branch. The trial targets the Axioned account and `https://loggrr.axioned.workers.dev`.
The production domain remains on Vercel until the trial is accepted.

## Runtime

- OpenNext adapts the existing Next.js application, including NextAuth v4.
  The vinext compatibility scan identifies NextAuth v4 as unsupported, so the
  migration does not change authentication providers or account data.
- The JWT auth gate uses `middleware.ts` with the Edge runtime because OpenNext
  does not officially support the Node middleware used by `proxy.ts`. Next.js 16
  warns that the middleware filename is deprecated; this is intentional until
  OpenNext officially supports Node middleware.
- The Cloudflare build uses Next.js Webpack because the current Turbopack Wasm
  loader traces too broadly and exceeds the Worker bundle size limit.
- Prisma generates for the Cloudflare runtime so its query compiler is imported
  as a WebAssembly module instead of compiled dynamically at runtime.
- Prisma's pg adapter and `pg` remain external to Next.js so OpenNext can
  resolve the `pg-cloudflare` socket implementation using its workerd condition.
- Each Worker request gets a Prisma client and Postgres pool. Connections are
  closed after use (`maxUses: 1`) to prevent reuse across Worker requests. The
  Node runtime retains its existing development singleton and connection pooling.
- The Worker is placed in `aws:eu-central-1`, matching the configured Neon region.
- The official OpenNext setup supplies an R2 incremental cache, the self-reference
  service binding, Cloudflare Images, and immutable static asset headers.
- Logs and traces are enabled. Version preview URLs are disabled. There is no
  Worker Previews configuration.

## Local checks

Use the repository's Bun version from `package.json`. Install dependencies with
`bun install --frozen-lockfile`; `postinstall` generates Prisma without changing
any database schema. A valid `DATABASE_URL` is required even for generation
because `prisma.config.ts` validates it.

Keep runtime credentials in an ignored `.dev.vars` file, using `.env.example` as
an inventory. Set `NEXTAUTH_URL=http://localhost:8787` for local sign-in.

```sh
bun run cf:typegen
bun run typecheck
bun run preview:cloudflare
```

`preview:cloudflare` serves the built application locally in workerd. It does not
create a Cloudflare branch preview. Binding type generation excludes Workers
runtime globals so Next.js browser types remain unchanged.

## Build and deploy

The Cloudflare origin must also be present during the build because Next.js
inlines public environment variables:

```sh
NEXT_PUBLIC_APP_URL=https://loggrr.axioned.workers.dev \
NEXTAUTH_URL=https://loggrr.axioned.workers.dev \
bun run build:cloudflare
bunx wrangler deploy --dry-run
```

Create the `loggrr-cache` R2 bucket in the Axioned account before the first
upload. Store application credentials with Wrangler secrets or the dashboard;
never put their values in the committed Wrangler configuration. Upload only
variables used by the application, not unrelated old credentials from `.env`.

After validation, deploy with `bunx opennextjs-cloudflare deploy`. For subsequent
local builds and deployments, `bun run deploy:cloudflare` performs both steps;
export the public application URL as above first. Wrangler's `vars` configure
runtime values, not Next.js client-side build values.

## Workers Builds settings

Connect `banuragaxioned/loggrr` to Worker `loggrr` in the Axioned dashboard:

| Setting           | Value                                    |
| ----------------- | ---------------------------------------- |
| Root directory    | `/`                                      |
| Deployment branch | `migrate/cloudflare-workers`             |
| Preview builds    | Disabled                                 |
| Build command     | `bun run build:cloudflare`               |
| Deploy command    | `bunx opennextjs-cloudflare deploy`      |
| Bun version       | Use the version pinned in `package.json` |
| Node version      | Use the major pinned in `package.json`   |

Set `NEXT_PUBLIC_APP_URL` and `NEXTAUTH_URL` to the workers.dev origin in the
build environment. Also supply the variables required by `env.mjs` and
`prisma.config.ts` at build time. Store sensitive values as build secrets as
well as Worker runtime secrets where required; runtime secrets alone do not
provide environment validation values during a clean build.

`preview_urls: false` disables version preview URLs. The separate **Enable
Preview Builds** checkbox in Workers Builds must remain unchecked too.
Connecting the Git repository is separate from deploying with Wrangler.

## Acceptance before merge

Verify the landing and sign-in pages, static assets, unauthorized redirects,
authenticated sessions, dashboard, projects, logged reports, and time-entry reads.
Repeat and overlap authenticated requests to exercise request isolation.

A signed test session can verify authenticated reads without writing accounts,
verification tokens, or time entries. It does not verify Google OAuth or email
transport. Test those interactively before accepting the migration. Google must
allow this callback URL:

```text
https://loggrr.axioned.workers.dev/api/auth/callback/google
```

Do not remove the existing production callback. Review email links to ensure
they use the trial origin. Normal sign-in can update account data or send mail;
use the intended database and credentials for that check.

After acceptance, merge and change the Workers Builds deployment branch to
`main`. Domain mapping is a separate later step: update the configured runtime
and build origins, rebuild, register the final OAuth callback, and then move the
domain. The Vercel deployment remains available during the trial.

## Sources

- [Cloudflare OpenNext guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/)
- [OpenNext setup](https://opennext.js.org/cloudflare/get-started)
- [OpenNext databases](https://opennext.js.org/cloudflare/howtos/db)
- [Prisma generator runtime](https://www.prisma.io/docs/orm/v7/prisma-schema/overview/generators)
- [Cloudflare build branches](https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/)
- [Cloudflare build configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
