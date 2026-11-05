# Dokploy trial with Nixpacks

This branch supports a normal Node.js deployment as an alternative to Cloudflare
Workers. Nixpacks builds the container; no application Dockerfile or separate API
server is required. Next.js serves the UI, API routes, and authentication together.
It uses the existing external Postgres database and SMTP provider.

## Application settings

Create an Application in Dokploy and connect the GitHub repository:

| Setting | Value |
| --- | --- |
| Repository | `banuragaxioned/loggrr` |
| Branch | `migrate/cloudflare-workers` |
| Build path | `/` |
| Build type | Nixpacks |
| Configuration | `nixpacks.toml` (detected automatically) |
| Container/domain port | `3000` |
| Preview deployments | Disabled |

Use Nixpacks 1.41.0 or newer for Node 24 support. The committed configuration
installs Bun 1.3.14, runs the regular `build` script with Prisma's Node generator,
and starts Next.js under Node 24. Leave Dokploy's command overrides empty.
Do not use the Cloudflare build or deploy commands for this application.

## Environment

Add the server and public variables from `.env.example` in Dokploy's Environment
tab. Use the existing production credentials; there is no new database or email
account to provision. Keep credentials out of the repository.

Only these values are secrets: `DATABASE_URL`, `NEXTAUTH_SECRET`,
`GOOGLE_CLIENT_SECRET`, `EMAIL_PASSWORD`, and `OPENROUTER_API_KEY`.
The Google client ID, SMTP sender/host/port/username, `NODE_ENV`, URLs, and public
PostHog settings are ordinary configuration.

Set `NODE_ENV=production` and `EMAIL_PORT=465`. Use Dokploy's assigned HTTPS trial
hostname for both `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL`. Keep the production
Vercel and Cloudflare hostnames unchanged. Public variables are inlined at build
time, so changing them requires a rebuild.

The current app validates its environment during installation/build as well as
at runtime. Supply the complete environment before deploying. Nixpacks receives
those variables during the build; restrict access to the deployment environment
and image registry as you would to production credentials.

Add `https://<dokploy-trial-host>/api/auth/callback/google` to the existing Google
OAuth application's allowed redirect URIs. Retain the Vercel and Cloudflare
callbacks. Use Dokploy's domain controls to provision HTTPS and route to port 3000.

## Acceptance

Check `/auth/signin`, Google login, a fresh magic-link request and link click,
workspace/dashboard, projects, reports, and time-entry reads. Test intended writes
interactively before choosing a platform. This trial uses the existing database,
so writes are real. No schema migration, database push, or seed runs automatically.

No Cloudflare credentials, R2 bucket, or Worker bindings are required for the Node
runtime. Application stdout/stderr remains available in Dokploy; Cloudflare's
Workers log/trace settings do not control the container.

## Sources

- [Dokploy build types](https://docs.dokploy.com/docs/core/applications/build-type)
- [Nixpacks configuration](https://nixpacks.com/docs/configuration/file)
- [Nixpacks Node provider](https://nixpacks.com/docs/providers/node)
- [Nixpacks releases](https://github.com/railwayapp/nixpacks/releases)
