/** Shared keys for custom theme persistence and anti-flash injection. */
export const CUSTOM_THEME_STORAGE_KEY = "loggrr-custom-theme";
export const CUSTOM_THEME_STYLE_ID = "loggrr-custom-theme-vars";
export const DEFAULT_CUSTOM_PRIMARY = "#7C3AED";

export interface HslColor {
  h: number;
  s: number;
  l: number;
}

export interface CustomThemeConfig {
  primary: string;
  /** Optional secondary hue offset seed; when omitted, derived from primary. */
  accent?: string;
}

/** Semantic tokens we override for a generated theme (HSL channels without hsl()). */
export type ThemeTokenMap = Record<string, string>;

export interface GeneratedTheme {
  light: ThemeTokenMap;
  dark: ThemeTokenMap;
  swatches: [string, string, string, string];
  loader: string;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function normalizeHex(input: string): string | null {
  const raw = input.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(raw)) {
    const expanded = raw
      .split("")
      .map((char) => char + char)
      .join("");
    return `#${expanded.toUpperCase()}`;
  }
  if (/^[0-9a-fA-F]{6}$/.test(raw)) return `#${raw.toUpperCase()}`;
  return null;
}

export function hexToHsl(hex: string): HslColor {
  const normalized = normalizeHex(hex) ?? DEFAULT_CUSTOM_PRIMARY;
  const value = normalized.slice(1);
  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  return { h, s: s * 100, l: l * 100 };
}

export function hslToHex({ h, s, l }: HslColor): string {
  const saturation = clamp(s, 0, 100) / 100;
  const lightness = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lightness - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  const toHex = (channel: number) =>
    Math.round((channel + m) * 255)
      .toString(16)
      .padStart(2, "0")
      .toUpperCase();

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function channel(h: number, s: number, l: number): string {
  return `${Math.round(h)} ${Math.round(clamp(s, 0, 100))}% ${Math.round(clamp(l, 0, 100))}%`;
}

function relativeLuminance(hex: string): number {
  const normalized = normalizeHex(hex) ?? DEFAULT_CUSTOM_PRIMARY;
  const value = normalized.slice(1);
  const channels = [0, 2, 4].map((i) => {
    const c = parseInt(value.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function readableForeground(backgroundHex: string): string {
  return relativeLuminance(backgroundHex) > 0.4 ? "0 0% 4%" : "0 0% 100%";
}

function oklchApprox(h: number, chroma: number, lightness: number): string {
  // Charts already use oklch elsewhere; approximate from hue for variety.
  return `oklch(${lightness.toFixed(2)} ${chroma.toFixed(2)} ${Math.round(h)})`;
}

/** Build full light/dark semantic tokens from a primary (and optional accent) hex. */
export function generateThemeFromPrimary(primaryHex: string, accentHex?: string): GeneratedTheme {
  const primary = hexToHsl(normalizeHex(primaryHex) ?? DEFAULT_CUSTOM_PRIMARY);
  const accentSource = accentHex ? hexToHsl(normalizeHex(accentHex) ?? primaryHex) : primary;
  const h = primary.h;
  const a = accentSource.h;
  const sat = clamp(primary.s, 35, 90);

  const lightPrimaryL = clamp(primary.l > 45 ? primary.l - 20 : primary.l, 22, 42);
  const darkPrimaryL = clamp(primary.l < 55 ? primary.l + 15 : primary.l, 48, 68);
  const lightPrimaryHex = hslToHex({ h, s: sat, l: lightPrimaryL });
  const darkPrimaryHex = hslToHex({ h, s: sat, l: darkPrimaryL });

  const light: ThemeTokenMap = {
    "--background": channel(h, Math.min(sat, 40), 98.5),
    "--foreground": channel(h, Math.min(sat, 40), 10),
    "--card": "0 0% 100%",
    "--card-foreground": channel(h, Math.min(sat, 40), 10),
    "--popover": "0 0% 100%",
    "--popover-foreground": channel(h, Math.min(sat, 40), 10),
    "--primary": channel(h, sat, lightPrimaryL),
    "--primary-foreground": readableForeground(lightPrimaryHex),
    "--secondary": channel(a, Math.min(sat, 45), 94),
    "--secondary-foreground": channel(h, sat * 0.7, 20),
    "--muted": channel(h, Math.min(sat, 30), 95),
    "--muted-foreground": channel(h, 12, 42),
    "--accent": channel(a, Math.min(sat, 55), 92),
    "--accent-foreground": channel(h, sat * 0.8, 22),
    "--border": channel(h, Math.min(sat, 25), 88),
    "--input": channel(h, Math.min(sat, 25), 88),
    "--ring": channel(h, sat, clamp(lightPrimaryL + 12, 35, 55)),
    "--chart-1": oklchApprox(h, 0.18, 0.55),
    "--chart-2": oklchApprox((h + 40) % 360, 0.14, 0.65),
    "--chart-3": oklchApprox((h + 80) % 360, 0.12, 0.5),
    "--chart-4": oklchApprox((h + 140) % 360, 0.1, 0.72),
    "--chart-5": oklchApprox((h + 200) % 360, 0.1, 0.45),
    "--sidebar": `oklch(0.98 ${Math.min(sat / 400, 0.03).toFixed(3)} ${Math.round(h)})`,
    "--sidebar-foreground": `oklch(0.22 ${Math.min(sat / 250, 0.05).toFixed(3)} ${Math.round(h)})`,
    "--sidebar-primary": `oklch(0.42 ${Math.min(sat / 200, 0.14).toFixed(3)} ${Math.round(h)})`,
    "--sidebar-primary-foreground": "oklch(0.99 0 0)",
    "--sidebar-accent": `oklch(0.94 ${Math.min(sat / 300, 0.04).toFixed(3)} ${Math.round(h)})`,
    "--sidebar-accent-foreground": `oklch(0.28 ${Math.min(sat / 220, 0.08).toFixed(3)} ${Math.round(h)})`,
    "--sidebar-border": `oklch(0.9 ${Math.min(sat / 400, 0.03).toFixed(3)} ${Math.round(h)})`,
    "--sidebar-ring": `oklch(0.65 ${Math.min(sat / 180, 0.16).toFixed(3)} ${Math.round(h)})`,
  };

  const dark: ThemeTokenMap = {
    "--background": channel(h, Math.min(sat, 35), 7),
    "--foreground": channel(h, Math.min(sat, 30), 96),
    "--card": channel(h, Math.min(sat, 30), 10),
    "--card-foreground": channel(h, Math.min(sat, 30), 96),
    "--popover": channel(h, Math.min(sat, 30), 10),
    "--popover-foreground": channel(h, Math.min(sat, 30), 96),
    "--primary": channel(h, sat, darkPrimaryL),
    "--primary-foreground": readableForeground(darkPrimaryHex),
    "--secondary": channel(h, Math.min(sat, 25), 16),
    "--secondary-foreground": channel(h, Math.min(sat, 30), 96),
    "--muted": channel(h, Math.min(sat, 22), 15),
    "--muted-foreground": channel(h, 12, 68),
    "--accent": channel(a, Math.min(sat, 28), 18),
    "--accent-foreground": channel(a, Math.min(sat, 50), 88),
    "--border": channel(h, Math.min(sat, 20), 18),
    "--input": channel(h, Math.min(sat, 20), 18),
    "--ring": channel(h, sat, darkPrimaryL),
    "--chart-1": oklchApprox(h, 0.16, 0.7),
    "--chart-2": oklchApprox((h + 40) % 360, 0.12, 0.75),
    "--chart-3": oklchApprox((h + 80) % 360, 0.1, 0.62),
    "--chart-4": oklchApprox((h + 140) % 360, 0.09, 0.8),
    "--chart-5": oklchApprox((h + 200) % 360, 0.1, 0.55),
    "--sidebar": `oklch(0.16 ${Math.min(sat / 350, 0.04).toFixed(3)} ${Math.round(h)})`,
    "--sidebar-foreground": `oklch(0.95 ${Math.min(sat / 500, 0.02).toFixed(3)} ${Math.round(h)})`,
    "--sidebar-primary": `oklch(0.68 ${Math.min(sat / 180, 0.16).toFixed(3)} ${Math.round(h)})`,
    "--sidebar-primary-foreground": `oklch(0.15 ${Math.min(sat / 300, 0.04).toFixed(3)} ${Math.round(h)})`,
    "--sidebar-accent": `oklch(0.24 ${Math.min(sat / 350, 0.04).toFixed(3)} ${Math.round(h)})`,
    "--sidebar-accent-foreground": `oklch(0.95 ${Math.min(sat / 500, 0.02).toFixed(3)} ${Math.round(h)})`,
    "--sidebar-border": "oklch(1 0 0 / 10%)",
    "--sidebar-ring": `oklch(0.68 ${Math.min(sat / 180, 0.16).toFixed(3)} ${Math.round(h)})`,
  };

  return {
    light,
    dark,
    swatches: [
      lightPrimaryHex,
      hslToHex({ h, s: sat, l: 55 }),
      hslToHex({ h, s: Math.min(sat, 40), l: 90 }),
      hslToHex({ h, s: Math.min(sat, 30), l: 97 }),
    ],
    loader: lightPrimaryHex,
  };
}

function tokensToCss(selector: string, tokens: ThemeTokenMap): string {
  const body = Object.entries(tokens)
    .map(([key, value]) => `${key}:${value};`)
    .join("");
  return `${selector}{${body}}`;
}

/** CSS block injected for `[data-theme="custom"]` light + dark. */
export function buildCustomThemeCss(config: CustomThemeConfig): string {
  const generated = generateThemeFromPrimary(config.primary, config.accent);
  return [
    tokensToCss('[data-theme="custom"]', generated.light),
    tokensToCss('.dark[data-theme="custom"]', generated.dark),
  ].join("");
}

export function injectCustomThemeStyle(css: string) {
  if (typeof document === "undefined") return;
  let style = document.getElementById(CUSTOM_THEME_STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = CUSTOM_THEME_STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = css;
}

export function removeCustomThemeStyle() {
  if (typeof document === "undefined") return;
  document.getElementById(CUSTOM_THEME_STYLE_ID)?.remove();
}

export function readStoredCustomTheme(): CustomThemeConfig {
  if (typeof window === "undefined") return { primary: DEFAULT_CUSTOM_PRIMARY };
  try {
    const raw = localStorage.getItem(CUSTOM_THEME_STORAGE_KEY);
    if (!raw) return { primary: DEFAULT_CUSTOM_PRIMARY };
    const parsed = JSON.parse(raw) as CustomThemeConfig;
    const primary = normalizeHex(parsed.primary ?? "") ?? DEFAULT_CUSTOM_PRIMARY;
    const accent = parsed.accent ? normalizeHex(parsed.accent) ?? undefined : undefined;
    return { primary, accent };
  } catch {
    return { primary: DEFAULT_CUSTOM_PRIMARY };
  }
}

export function persistCustomTheme(config: CustomThemeConfig) {
  const primary = normalizeHex(config.primary) ?? DEFAULT_CUSTOM_PRIMARY;
  const accent = config.accent ? normalizeHex(config.accent) ?? undefined : undefined;
  const next: CustomThemeConfig = { primary, ...(accent ? { accent } : {}) };
  localStorage.setItem(CUSTOM_THEME_STORAGE_KEY, JSON.stringify(next));
  const css = buildCustomThemeCss(next);
  localStorage.setItem(`${CUSTOM_THEME_STORAGE_KEY}-css`, css);
  injectCustomThemeStyle(css);
  return next;
}
