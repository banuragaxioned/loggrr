/** Shared day-hours intensity scale used by the week heatmap and date badge. */
export const HEATMAP_MAX_HOURS = 7.5;

export function getDayHoursTone(hours: number) {
  if (hours <= 0) return "bg-muted";
  const level = Math.min(Math.ceil((hours / HEATMAP_MAX_HOURS) * 4), 4);
  const tones = [
    "bg-emerald-200 dark:bg-emerald-950",
    "bg-emerald-300 dark:bg-emerald-900",
    "bg-emerald-500 dark:bg-emerald-700",
    "bg-emerald-600 dark:bg-emerald-600",
  ];
  return tones[level - 1];
}
