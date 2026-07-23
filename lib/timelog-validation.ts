import { hoursToDecimal } from "@/lib/helper";

interface BillableProject {
  billable?: boolean;
}

interface SelectableItem {
  id: number;
  name?: string | null;
}

interface TimelogValidationInput {
  project?: BillableProject | null;
  comment?: string | null;
  time?: string | null;
  milestone?: SelectableItem | null;
  task?: SelectableItem | null;
  categories: SelectableItem[];
  tasks: SelectableItem[];
  timeError?: boolean;
}

function hasPositiveTime(time?: string | null): boolean {
  if (!time?.trim()) return false;
  const hours = +hoursToDecimal(time);
  return !isNaN(hours) && hours > 0;
}

/** Published options only — excludes archived items and the "No category/task" sentinel (id 0). */
export function getPublishedOptions<T extends { id: number; archived?: boolean }>(options: T[]): T[] {
  return options.filter((option) => option.id > 0 && !option.archived);
}

export function hasPublishedCategories(categories: SelectableItem[]): boolean {
  return getPublishedOptions(categories).length > 0;
}

export function hasPublishedTasks(tasks: SelectableItem[]): boolean {
  return getPublishedOptions(tasks).length > 0;
}

/** Billable project with at least one published category or task. */
export function isClassificationRequired(
  project: BillableProject | null | undefined,
  categories: SelectableItem[],
  tasks: SelectableItem[],
): boolean {
  return Boolean(project?.billable && (hasPublishedCategories(categories) || hasPublishedTasks(tasks)));
}

/** Satisfied when either a category or a task is selected. */
export function isClassificationSatisfied(
  milestone?: SelectableItem | null,
  task?: SelectableItem | null,
): boolean {
  return Boolean(milestone?.id || task?.id);
}

/** Show * / missing cue on Category when billable, categories exist, and neither side is selected yet. */
export function isCategoryRequired(
  project: BillableProject | null | undefined,
  categories: SelectableItem[],
  _tasks: SelectableItem[] = [],
  milestone?: SelectableItem | null,
  task?: SelectableItem | null,
): boolean {
  return Boolean(
    project?.billable && hasPublishedCategories(categories) && !isClassificationSatisfied(milestone, task),
  );
}

/** Show * / missing cue on Task when billable, tasks exist, and neither side is selected yet. */
export function isTaskRequired(
  project: BillableProject | null | undefined,
  tasks: SelectableItem[],
  _categories: SelectableItem[] = [],
  milestone?: SelectableItem | null,
  task?: SelectableItem | null,
): boolean {
  return Boolean(project?.billable && hasPublishedTasks(tasks) && !isClassificationSatisfied(milestone, task));
}

export function isTimelogValid({
  project,
  comment,
  time,
  milestone,
  task,
  categories,
  tasks,
  timeError,
}: TimelogValidationInput): boolean {
  if (!project || !comment?.trim().length || !hasPositiveTime(time) || timeError) return false;
  if (isClassificationRequired(project, categories, tasks) && !isClassificationSatisfied(milestone, task)) {
    return false;
  }
  return true;
}

/** Keep an archived (or otherwise missing) selection visible in the options list while editing. */
export function mergeSelectedIntoOptions<T extends { id: number; archived?: boolean }>(
  options: T[],
  selected?: T | null,
): T[] {
  if (!selected?.id) return options;
  if (options.some((option) => option.id === selected.id)) return options;
  return [{ ...selected, archived: true }, ...options];
}
