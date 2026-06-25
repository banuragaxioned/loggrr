# Plan 002 — Interval-based default range on /projects/[project]

**Written against commit:** `eecbe5b`
**Area:** `app/[team]/projects/[project]/` + `server/services/project.ts`
**Effort:** M · **Risk:** Low

## Why this matters

The project overview page (`/projects/[project]`) currently defaults its date filter to the **last 30
days** (a rolling window). Issue #599 wants the default to be the **current calendar month**, and —
as a "good to have" — for **FIXED** projects to default to **all time** (the whole project), since a
fixed-budget project is measured against a total, not a month.

The chart and the user-details table already read the `range` URL param server-side (they're fed from
`getStartandEndDates(searchParams.range, ...)` in `page.tsx`), so "connecting" them is mostly about
**changing the default** and making the toolbar's date picker **display** that same default.

## Locked decisions (do not deviate)

- Default when no `range` param is present:
  - **MONTHLY** → current calendar month (1st of this month → today).
  - **FIXED** → all time: `project.createdAt` → today.
- Scope is **chart + user-details table only**. Do NOT touch the sidebar cards in `layout.tsx`
  (`TimeLoggedCard`, `BillableCard`, `TeamsCard`); they keep their own overall/last-30 windows. (They
  live in a layout, which cannot receive `searchParams` in the App Router — out of scope by decision.)
- When a `range` param IS present, it always wins (current behavior) for every interval.

## Current state

### `server/services/project.ts` — `getProjectDetailsById` (lines 7-27)

Selects only `name`, `client.name`, `billable`. It does **not** select `interval` or `createdAt`,
both of which Step 2 needs:

```ts
    select: {
      name: true,
      client: {
        select: {
          name: true,
        },
      },
      billable: true,
    },
```

### `app/[team]/projects/[project]/page.tsx`

Computes the range with a hardcoded 30-day default (line 34) and fetches chart + table data from it:

```ts
  const projectDetails = await getProjectDetailsById(team, +project!);
  const selectedRange = searchParams.range;
  ...
  const { startDate, endDate } = getStartandEndDates(selectedRange, 30);
```

`totalDays = differenceInDays(endDate, startDate) + 1` (line 62) is passed to `<TimeChart>`.

### `lib/months.ts` — `getStartandEndDates`

With no `range` and no `defaultDay`, it already returns **start-of-current-month → today**. With
`defaultDay` it returns `subDays(now, defaultDay) → today`:

```ts
  return {
    startDate: defaultDay
      ? subDays(new Date(), defaultDay)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(),
  };
```

So **dropping the `30` argument** gives the current-month default for free. FIXED needs a custom
start (`createdAt`).

### `app/[team]/projects/[project]/components/toolbar.tsx` (client component)

The date-range picker derives its displayed default from a hardcoded 30-day fallback (lines 44 & 128):

```ts
  const defaultDay = selectedRange ? undefined : 30;
  ...
  const [start, end] = selectedRange?.split(",") || [];
  const startFrom = (start && startOfDay(new Date(start))) || subDays(startOfToday(), 30);
  const endTo = (end && startOfDay(new Date(end))) || startOfToday();
```

`startFrom`/`endTo` feed `<DateRangePicker initialDateFrom initialDateTo>`. To keep the picker's
shown default in sync with the server default, the fallback must become current-month (and, for FIXED
projects, the project's createdAt).

## Steps

### Step 1 — Select `interval` and `createdAt` in `getProjectDetailsById`

In `server/services/project.ts`, extend the `select` (lines ~16-23):

```ts
    select: {
      name: true,
      client: {
        select: {
          name: true,
        },
      },
      billable: true,
      interval: true,
      createdAt: true,
    },
```

**Verify:** `bun run build`. `projectDetails.interval` is `"FIXED" | "MONTHLY"`, `createdAt` is `Date`.

### Step 2 — Compute the interval-based default in `page.tsx`

Replace line 34 (`const { startDate, endDate } = getStartandEndDates(selectedRange, 30);`) with logic
that: uses the `range` param when present; else current-month for MONTHLY; else createdAt→today for
FIXED. Add `startOfMonth` to the `date-fns` import already on line 18.

```ts
import { differenceInDays, startOfMonth } from "date-fns";
```

```ts
  const isFixed = projectDetails?.interval === "FIXED";

  const { startDate, endDate } = selectedRange
    ? getStartandEndDates(selectedRange)
    : isFixed
      ? { startDate: projectDetails?.createdAt ?? startOfMonth(new Date()), endDate: new Date() }
      : getStartandEndDates(""); // no range, no defaultDay → start of current month → today
```

> `getStartandEndDates("")` returns current-month → today (see lib/months.ts above). Do NOT pass
> `30` anymore.

**Verify:** `bun run build` passes.

### Step 3 — Sync the toolbar's displayed default

The toolbar is a client component and has no access to `projectDetails`. Pass the interval and
createdAt down as props from `page.tsx`, then use them for the picker fallback.

In `page.tsx`, pass props to `<DataTableToolbar>` (lines 67-72):

```tsx
      <DataTableToolbar
        isBillable={isBillable}
        allMembers={allMembers}
        allCategories={allCategories}
        allTasks={allTasks}
        interval={projectDetails?.interval}
        projectCreatedAt={projectDetails?.createdAt?.toISOString()}
      />
```

In `toolbar.tsx`:
1. Add `interval?: "FIXED" | "MONTHLY"` and `projectCreatedAt?: string` to the component's props type
   (find the destructured props / type near the top of the component, around lines 20-30).
2. Replace the 30-day fallbacks (lines 44, 128) so the picker shows the same default the server uses:

```ts
  // line 44 region — keep defaultDay for the export payload, but base it on month start
  const isFixed = interval === "FIXED";
  ...
  // line 128 region
  const [start, end] = selectedRange?.split(",") || [];
  const monthStart = startOfMonth(startOfToday());
  const fixedStart = projectCreatedAt ? startOfDay(new Date(projectCreatedAt)) : monthStart;
  const startFrom = (start && startOfDay(new Date(start))) || (isFixed ? fixedStart : monthStart);
  const endTo = (end && startOfDay(new Date(end))) || startOfToday();
```

3. Add `startOfMonth` to the `date-fns` import on line 6
   (`import { format, startOfDay, startOfMonth, startOfToday, subDays } from "date-fns";`).
   Remove `subDays` from the import **only if** no other usage remains — grep first:
   `grep -n "subDays" app/[team]/projects/[project]/components/toolbar.tsx`.

> The `defaultDay` variable (line 44) is also sent in the `/api/team/export` payload (line 88). To
> avoid changing export behavior in this plan, **leave `defaultDay` as-is** unless the export is
> explicitly verified — see STOP conditions.

**Verify:** `bun run build` and `bun run lint` pass.

### Step 4 — Manual check

Run `bun run dev`:
- Open a **MONTHLY** project overview with no query string → date picker and chart cover the **current
  month** (1st → today), not the last 30 days.
- Open a **FIXED** project with no query string → range spans **createdAt → today** (chart may show
  many days; that's expected — see Maintenance note).
- Pick a custom range in the picker → URL gets `?range=...` and both chart and table honor it for both
  interval types.

## Scope boundaries

**In scope:** `server/services/project.ts` (`getProjectDetailsById` select only), `page.tsx`
(range computation + toolbar props), `toolbar.tsx` (props + picker default fallback).

**Out of scope — do NOT touch:**
- `layout.tsx` and the sidebar cards (`TimeLoggedCard`, `BillableCard`, `TeamsCard`).
- `time-chart.tsx` internals (it already derives its window from `range`/today + `totalDays`).
- The `/reports/logged` route (that's plan 001) and its date default.
- The `/api/team/export` `defaultDay` semantics (leave unless explicitly verifying export).
- Any Prisma schema change.

## Done criteria (machine-checkable)

- [ ] `bun run build` exits 0.
- [ ] `bun run lint` exits 0.
- [ ] `bun run format:check` exits 0 (prettier --write only changed files if needed).
- [ ] `grep -n "interval: true" server/services/project.ts` shows it inside `getProjectDetailsById`.
- [ ] `grep -n "getStartandEndDates(selectedRange, 30)" app/[team]/projects/[project]/page.tsx`
      returns **nothing** (the 30-day default is gone).

## Test plan

No automated test framework exists in this repo. Verification is build + lint + the manual checks in
Step 4. Do not introduce a new test framework; note the gap if you feel coverage is needed.

## Maintenance note

- For FIXED projects with a long history, the chart can render many daily bars (it builds one entry
  per day across `totalDays`). This plan does not change `time-chart.tsx`; if the chart becomes
  unreadable for old projects, that's a follow-up (e.g. weekly/monthly bucketing) — flag it, don't
  silently redesign the chart here.
- The server default (page.tsx) and the picker default (toolbar.tsx) are two places that must agree.
  A reviewer should confirm they produce the same window for both intervals.

## STOP conditions

- If `getProjectDetailsById` no longer matches the excerpt (file drifted since `eecbe5b`), STOP and report.
- If touching the toolbar's `defaultDay` would change the `/api/team/export` payload behavior and you
  cannot verify export still works, STOP and leave `defaultDay` untouched (the picker default in Step 3
  does not require changing `defaultDay`).
- If `Project.interval` or `Project.createdAt` is missing/renamed in `prisma/schema.prisma`, STOP.
