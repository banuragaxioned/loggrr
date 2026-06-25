# Improvement Plans — "Add budgets to reports" (issue #599)

These plans implement [issue #599](https://github.com/banuragaxioned/loggrr/issues/599),
scoped by the locked decisions below (captured in a grilling session).

**Written against commit:** `eecbe5b`
**Stack:** Next.js (App Router, RSC), Prisma, TanStack Table, Tailwind, Bun.
**Verification gates (run from repo root):**
- Typecheck/build: `bun run build`
- Lint: `bun run lint`
- Format: `bun run format:check`
There is no automated test suite in this repo — verification is build + lint + manual.

## Locked decisions (from grilling)

1. `Project.budget` is **hours** (not money). `Project.interval` (`FIXED | MONTHLY`) is the project "type".
2. `/reports/logged`, MONTHLY projects: always show the **raw per-month budget** (no scaling by range).
3. `/reports/logged`: show a **Budget column + utilization %** at the project row level.
   Known/accepted trade-off: a MONTHLY project viewed over a multi-month range reads as over budget.
4. `/reports/logged`: budget `null` or `0` → render **"—" with no %** (no divide-by-zero, no false over-budget).
5. `/projects/[project]`: connect **chart + user-details table only** to the `range` param.
   Sidebar cards in `layout.tsx` stay as-is (they can't read `searchParams` in the App Router).
6. `/projects/[project]` default range is **interval-based**: MONTHLY → current calendar month;
   FIXED → all-time (`project.createdAt` → today).

## Plans

| # | Plan | Area | Effort | Risk | Depends on |
|---|------|------|--------|------|------------|
| 001 | [Budget + utilization column in /reports/logged](001-reports-budget-column.md) | Reports | M | Low | — |
| 002 | [Interval-based default range on /projects/[project]](002-project-interval-default-range.md) | Project overview | M | Low | — |

The two plans are **independent** and can be executed in either order. No schema migration is
required — `budget` and `interval` already exist on `Project`.

## Considered and rejected

- **Scaling monthly budget by months-in-range** — rejected in favor of always showing raw per-month budget (decision 2).
- **Moving sidebar cards out of `layout.tsx` to connect them to `range`** — rejected as out of scope (decision 5).
- **Schema change for budget unit/type** — not needed; fields already exist.

## Status

| Plan | Status |
|------|--------|
| 001 | TODO |
| 002 | TODO |
