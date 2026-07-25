import {
  DEFAULT_CUSTOM_PRIMARY,
  generateThemeFromPrimary,
  readStoredCustomTheme,
  type CustomThemeConfig,
} from "@/lib/generate-theme";

export const COLOR_THEME_STORAGE_KEY = "loggrr-color-theme";
export const DEFAULT_COLOR_THEME = "zinc" as const;

// Zinc (default) and Brand lead; the rest are alphabetical, with custom last.
export const COLOR_THEME_IDS = [
  "zinc",
  "brand",
  "copper",
  "forest",
  "gold",
  "ocean",
  "olive",
  "pink",
  "slate",
  "teal",
  "custom",
] as const;

export type ColorThemeId = (typeof COLOR_THEME_IDS)[number];

/** Map removed palette ids so existing localStorage choices still resolve. */
const LEGACY_COLOR_THEME_MAP: Record<string, ColorThemeId> = {
  sunset: "copper",
  rose: "pink",
  amber: "gold",
  indigo: "copper",
  crimson: "pink",
  violet: "olive",
  navy: "gold",
};

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
    id: "copper",
    name: "Copper",
    description: "Warm copper & terracotta",
    swatches: ["#9A3412", "#EA580C", "#FFEDD5", "#FFF7ED"],
    loader: "#C2410C",
  },
  {
    id: "forest",
    name: "Forest",
    description: "Emerald greens",
    swatches: ["#065F46", "#10B981", "#D1FAE5", "#ECFDF5"],
    loader: "#059669",
  },
  {
    id: "gold",
    name: "Gold",
    description: "Deep gold & honey",
    swatches: ["#854D0E", "#CA8A04", "#FEF9C3", "#FEFCE8"],
    loader: "#A16207",
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Cool sky blues",
    swatches: ["#0369A1", "#0EA5E9", "#E0F2FE", "#F0F9FF"],
    loader: "#0284C7",
  },
  {
    id: "olive",
    name: "Olive",
    description: "Earthy olive green",
    swatches: ["#3F6212", "#65A30D", "#ECFCCB", "#F7FEE7"],
    loader: "#4D7C0F",
  },
  {
    id: "pink",
    name: "Pink",
    description: "Soft pink that works in light & dark",
    swatches: ["#9D174D", "#EC4899", "#FCE7F3", "#FDF2F8"],
    loader: "#DB2777",
  },
  {
    id: "slate",
    name: "Slate",
    description: "Cool blue-gray",
    swatches: ["#1E293B", "#64748B", "#E2E8F0", "#F8FAFC"],
    loader: "#334155",
  },
  {
    id: "teal",
    name: "Teal",
    description: "Teal & cyan",
    swatches: ["#115E59", "#14B8A6", "#CCFBF1", "#F0FDFA"],
    loader: "#0D9488",
  },
];

export function isColorThemeId(value: unknown): value is ColorThemeId {
  return typeof value === "string" && (COLOR_THEME_IDS as readonly string[]).includes(value);
}

export function resolveColorThemeId(value: unknown): ColorThemeId {
  if (isColorThemeId(value)) return value;
  if (typeof value === "string" && value in LEGACY_COLOR_THEME_MAP) {
    return LEGACY_COLOR_THEME_MAP[value];
  }
  return DEFAULT_COLOR_THEME;
}

export function getCustomThemeMeta(config?: CustomThemeConfig): ColorThemeMeta {
  const resolved = config ?? { primary: DEFAULT_CUSTOM_PRIMARY };
  const generated = generateThemeFromPrimary(resolved.primary, resolved.accent);
  return {
    id: "custom",
    name: "Custom",
    description: "Your generated palette",
    swatches: generated.swatches,
    loader: generated.loader,
  };
}

export function getColorTheme(id: ColorThemeId, customConfig?: CustomThemeConfig): ColorThemeMeta {
  if (id === "custom") {
    const config =
      customConfig ?? (typeof window !== "undefined" ? readStoredCustomTheme() : { primary: DEFAULT_CUSTOM_PRIMARY });
    return getCustomThemeMeta(config);
  }
  return COLOR_THEMES.find((theme) => theme.id === id) ?? COLOR_THEMES[0];
}

/** Preset themes for the grid (excludes custom — shown separately). */
export function getPresetThemes(): ColorThemeMeta[] {
  return COLOR_THEMES;
}
