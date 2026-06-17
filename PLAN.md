# Plan: team reporting enhancements

Read-only reporting/filtering on existing data. **No schema changes** — uses the
existing `TimeEntry` / `Milestone` / `Task` models.

> Draft proposal — open for review before implementation. This file is removed
> once the features land.

## 1. Category + Task filters on the project detail page (`/[team]/projects/[id]`)

The project toolbar already has a generic `MultiSelectFilter` (used for Members)
that syncs to URL search params. Add two more following the same pattern:

- `server/services/project.ts`: add helpers to list a project's milestones
  ("Category") and tasks; extend the time-entry queries to filter by the selected
  milestone / task ids (`where: { milestoneId: { in }, taskId: { in } }`).
- project `page.tsx`: read `category` / `task` search params, fetch the options,
  pass them through to the queries + toolbar.
- `toolbar.tsx`: add Category + Task `MultiSelectFilter`s and include them in reset.

("Category" maps to **Milestone** — consistent with the existing CSV export column.)

## 2. "By Member" report (new tab under `/[team]/reports`)

- New `reports/by-member/page.tsx`: reuse the existing `getLogged` service (same
  data as the Logged report) and re-pivot **person-first** — each member → total
  hours (+ billable), expandable to their projects.
- Reuse the Logged report's generic `DataTable` (already supports `subRows`) with
  person-first columns + a date-range / billable toolbar.
- Add the nav entry (`nav-menu.tsx`, `command-action.tsx`, `config/dashboard.ts`).

## Constraints & verification

- No schema changes; pure aggregation/filtering on existing data.
- `build` + `tsc --noEmit` + `lint` green before marking ready.
- Aggregation totals to be sanity-checked against a known project at runtime.

## Commits

1. `feat(reports): Category + Task filters on the project detail page`
2. `feat(reports): add By Member report`
