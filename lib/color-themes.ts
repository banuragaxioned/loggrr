export const COLOR_THEME_STORAGE_KEY = "loggrr-color-theme";
export const DEFAULT_COLOR_THEME = "zinc" as const;

export const COLOR_THEME_IDS = [
  "zinc",
  "brand",
  "ocean",
  "forest",
  "sunset",
  "rose",
  "violet",
  "teal",
  "amber",
  "slate",
] as const;

export type ColorThemeId = (typeof COLOR_THEME_IDS)[number];

export interface ColorThemeMeta {
  id: ColorThemeId;
  name: string;
  description: string;
  /** Hex swatches shown in the Manage picker preview */
  swatches: [string, string, string, string];
  /** Top-loader / accent hex used across modes */
  loader: string;
}

export const COLOR_THEMES: ColorThemeMeta[] = [
  {
    id: "zinc",
    name: "Zinc",
    description: "Original neutral grayscale",
    swatches: ["#18181B", "#71717A", "#E4E4E7", "#FAFAFA"],
    loader: "#18181B",
  },
  {
    id: "brand",
    name: "Brand",
    description: "Eggplant, fuchsia, lilac & citron",
    swatches: ["#201547", "#F31B7C", "#E8DFF5", "#C5D92C"],
    loader: "#F31B7C",
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Cool sky blues",
    swatches: ["#0369A1", "#0EA5E9", "#E0F2FE", "#F0F9FF"],
    loader: "#0284C7",
  },
  {
    id: "forest",
    name: "Forest",
    description: "Emerald greens",
    swatches: ["#065F46", "#10B981", "#D1FAE5", "#ECFDF5"],
    loader: "#059669",
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Warm orange & coral",
    swatches: ["#C2410C", "#F97316", "#FFEDD5", "#FFF7ED"],
    loader: "#EA580C",
  },
  {
    id: "rose",
    name: "Rose",
    description: "Soft rose & pink",
    swatches: ["#9F1239", "#E11D48", "#FFE4E6", "#FFF1F2"],
    loader: "#E11D48",
  },
  {
    id: "violet",
    name: "Violet",
    description: "Rich purple",
    swatches: ["#5B21B6", "#8B5CF6", "#EDE9FE", "#F5F3FF"],
    loader: "#7C3AED",
  },
  {
    id: "teal",
    name: "Teal",
    description: "Teal & cyan",
    swatches: ["#115E59", "#14B8A6", "#CCFBF1", "#F0FDFA"],
    loader: "#0D9488",
  },
  {
    id: "amber",
    name: "Amber",
    description: "Gold & amber",
    swatches: ["#92400E", "#F59E0B", "#FEF3C7", "#FFFBEB"],
    loader: "#D97706",
  },
  {
    id: "slate",
    name: "Slate",
    description: "Cool blue-gray",
    swatches: ["#1E293B", "#64748B", "#E2E8F0", "#F8FAFC"],
    loader: "#334155",
  },
];

export function isColorThemeId(value: unknown): value is ColorThemeId {
  return typeof value === "string" && (COLOR_THEME_IDS as readonly string[]).includes(value);
}

export function getColorTheme(id: ColorThemeId): ColorThemeMeta {
  return COLOR_THEMES.find((theme) => theme.id === id) ?? COLOR_THEMES[0];
}
