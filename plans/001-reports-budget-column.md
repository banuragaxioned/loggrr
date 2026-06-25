# Plan 001 — Budget + utilization % column in /reports/logged

**Written against commit:** `eecbe5b`
**Area:** `app/[team]/(reports)/reports/logged/` + `server/services/time-entry.ts`
**Effort:** M · **Risk:** Low

## Why this matters

The Logged Hours report (`/reports/logged`) shows a Client → Project → Category → Member → Entry
tree with an "Hours" column. Project managers want to see, at the **project row**, how logged
hours compare against the project's **budget** (measured in hours). The data is already fetched —
`getLogged` selects `Project.budget` — it's just dropped during transformation and never rendered.

Budget semantics depend on `Project.interval`:
- **MONTHLY** — budget is "X hours per month". We display the **raw monthly value** regardless of
  the selected date range (a deliberate decision; see Trade-off below).
- **FIXED** — budget is "X hours total" for the project.

## Locked decisions (do not deviate)

- Budget is **hours**. Utilization % = `round(projectHours / budget * 100)`.
- Show Budget + utilization **only on the project-level row** (`type === "project"`). Do NOT add
  budget to client/category/member/entry rows.
- If `budget` is `null` or `0`: render **"—"** in the Budget cell and **no %** (no divide-by-zero,
  no "over budget"). Treat `null` and `0` identically.
- Over budget (utilization > 100%) should be visually distinguishable (e.g. a destructive/red text
  class), matching how the codebase already signals state with Tailwind tokens.

## Trade-off (already accepted — do not try to "fix" it)

For MONTHLY projects we show the raw per-month budget against whatever hours the selected range
sums. If a user selects a 3-month range, logged hours will exceed the one-month budget and the row
will read as >100%. This is intended. Do not scale the budget by the number of months in the range.

## Current state

### `server/services/time-entry.ts` — `getLogged`

The project `select` already includes `budget` but **not** `interval`:

```ts
// lines ~218-227
        select: {
          id: true,
          name: true,
          budget: true,
          status: true,
          billable: true,
          client: {
            select: {
              id: true,
              name: true,
            },
          },
```

The flattened response exposes `projectBudget` but **not** `projectInterval`:

```ts
// lines ~300-307
      projects: entry.project.map((project) => {
        return {
          projectId: project.id,
          projectName: project.name,
          projectBillable: project.billable,
          projectBudget: project.budget,
          projectStatus: project.status,
```

### `app/[team]/(reports)/reports/logged/page.tsx` — transform

The project-level row is built around lines 129-135 and currently drops budget/interval:

```ts
            return {
              type: "project",
              id: project.projectId,
              name: project.projectName,
              hours: +`${projectHours.toFixed(2)}`,
              subRows: projectSubRows,
            };
```

### `app/[team]/(reports)/reports/logged/columns.tsx`

The `Logged` row interface (lines 11-25) has no `budget`/`interval`. There are two columns: `name`
and `hours` (lines 27-102). The `hours` column shows `${row.getValue("hours") ?? 0} h` and uses a
right-aligned fixed-width span — match this styling for the new column.

## Steps

### Step 1 — Expose `interval` from `getLogged`

In `server/services/time-entry.ts`:

1. Add `interval: true,` to the project `select` block (right after `budget: true,` near line 221).
2. Add `projectInterval: project.interval,` to the flattened response (right after
   `projectBudget: project.budget,` near line 305).

> `budget` is already selected and returned — only `interval` is missing. Do not touch the rest of
> the query.

**Verify:** `bun run build` — no type errors. `projectInterval` is now `"FIXED" | "MONTHLY"`.

### Step 2 — Thread budget + interval into the project row

In `app/[team]/(reports)/reports/logged/page.tsx`, extend the returned project object (lines 129-135):

```ts
            return {
              type: "project",
              id: project.projectId,
              name: project.projectName,
              hours: +`${projectHours.toFixed(2)}`,
              budget: project.projectBudget ?? null,
              interval: project.projectInterval,
              subRows: projectSubRows,
            };
```

Do not add `budget`/`interval` to the client object or any sub-row.

**Verify:** `bun run build` passes.

### Step 3 — Extend the `Logged` interface

In `app/[team]/(reports)/reports/logged/columns.tsx`, add two optional fields to the `Logged`
interface (after `hours?: number;`, line 15):

```ts
  budget?: number | null;
  interval?: "FIXED" | "MONTHLY";
```

### Step 4 — Add the Budget column

In the same file, append a third column to the `columns` array (after the `hours` column, before the
closing `];` at line 103). It renders only for project rows; everything else renders an empty cell so
the column stays aligned.

```tsx
  {
    accessorKey: "budget",
    header: () => <span className="inline-block w-24 text-right">Budget</span>,
    cell: ({ row }) => {
      const { original } = row;
      if (original.type !== "project") {
        return <span className="inline-block w-24" />;
      }

      const budget = original.budget;
      const hours = (row.getValue("hours") as number) ?? 0;
      const hasBudget = typeof budget === "number" && budget > 0;

      if (!hasBudget) {
        return <span className="inline-block w-24 text-right opacity-50">—</span>;
      }

      const utilization = Math.round((hours / budget) * 100);
      const isOver = utilization > 100;

      return (
        <span className="inline-block w-24 text-right">
          <span className="mr-1">{budget} h</span>
          <span className={`text-xs ${isOver ? "text-destructive" : "opacity-50"}`}>
            {utilization}%
          </span>
        </span>
      );
    },
  },
```

> `text-destructive` is the standard shadcn/Tailwind token used in this repo for error/over states.
> If `bun run build` or a quick grep shows it is unavailable, use `text-red-500` instead — confirm
> by grepping: `grep -rn "text-destructive" components/ app/`.

**Verify:** `bun run build` and `bun run lint` pass.

### Step 5 — Manual check

Run `bun run dev`, open `/<team>/reports/logged`, expand a client:
- A project **with** a budget shows e.g. `40 h  85%` (and red % if over 100).
- A project with `budget = null`/`0` shows `—`.
- Non-project rows (client/category/member/entry) show nothing in the Budget column and stay aligned.

## Scope boundaries

**In scope:** `server/services/time-entry.ts` (getLogged select + response only), `page.tsx`
(project row object only), `columns.tsx` (interface + new column).

**Out of scope — do NOT touch:**
- `data-table.tsx`, `toolbar.tsx`, the date-range default (stays start-of-current-month).
- Budget on any non-project row.
- The `/projects/[project]` route (that's plan 002).
- `getProjects` / `getProjectDetailsById` in `server/services/project.ts`.
- The CSV/export path (`/api/team/export`).

## Done criteria (machine-checkable)

- [ ] `bun run build` exits 0.
- [ ] `bun run lint` exits 0.
- [ ] `bun run format:check` exits 0 (run `prettier --write` on only the files you changed if it fails).
- [ ] `grep -n "projectInterval" server/services/time-entry.ts` shows it in both select and response.
- [ ] `grep -n "accessorKey: \"budget\"" app/[team]/\(reports\)/reports/logged/columns.tsx` returns a match.

## Test plan

No automated test framework exists in this repo. Verification is build + lint + the manual check in
Step 5. If you add tests, do not introduce a new framework — note the gap instead.

## Maintenance note

Future work that changes how `getLogged` shapes its response, or that adds budget at the
category/milestone level in this report, will interact with this column. The utilization color
threshold (>100%) is the single place to adjust over-budget styling. Reviewers should confirm the
MONTHLY-over-multi-month trade-off (Trade-off section) is understood and not "fixed" by accident.

## STOP conditions

- If `getLogged`'s response shape differs materially from the excerpts above (the file drifted since
  `eecbe5b`), STOP and report — line numbers are leads, not guarantees.
- If `Project.interval` no longer exists or is renamed in `prisma/schema.prisma`, STOP and report.
