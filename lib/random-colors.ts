/** Brand-harmonious palette for project dots and similar accents. */
const BRAND_PALETTE = [
  "#201547", // eggplant
  "#F31B7C", // fuchsia
  "#C4B5E0", // lilac mid
  "#C5D92C", // citron
  "#7C3AED", // violet
  "#0D9488", // teal
  "#DB2777", // pink
  "#6366F1", // indigo
  "#CA8A04", // gold
  "#059669", // emerald
  "#9333EA", // purple
  "#E11D48", // rose
];

/** Deterministic color from a stable index (e.g. project id). */
export const getRandomColor = (index: number) => {
  const normalized = Math.abs(Math.trunc(index));
  return BRAND_PALETTE[normalized % BRAND_PALETTE.length];
};
