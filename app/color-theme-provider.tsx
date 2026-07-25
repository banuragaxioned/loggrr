"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  COLOR_THEME_STORAGE_KEY,
  DEFAULT_COLOR_THEME,
  getColorTheme,
  getPresetThemes,
  resolveColorThemeId,
  type ColorThemeId,
  type ColorThemeMeta,
} from "@/lib/color-themes";
import {
  CUSTOM_THEME_STORAGE_KEY,
  DEFAULT_CUSTOM_PRIMARY,
  injectCustomThemeStyle,
  persistCustomTheme,
  readStoredCustomTheme,
  type CustomThemeConfig,
} from "@/lib/generate-theme";

interface ColorThemeContextValue {
  theme: ColorThemeId;
  setTheme: (theme: ColorThemeId) => void;
  themes: ColorThemeMeta[];
  activeTheme: ColorThemeMeta;
  customConfig: CustomThemeConfig;
  setCustomConfig: (config: CustomThemeConfig, options?: { activate?: boolean }) => void;
  resetCustomConfig: () => void;
}

const ColorThemeContext = createContext<ColorThemeContextValue | null>(null);

function applyColorTheme(theme: ColorThemeId) {
  document.documentElement.dataset.theme = theme;
}

export function ColorThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ColorThemeId>(DEFAULT_COLOR_THEME);
  const [customConfig, setCustomConfigState] = useState<CustomThemeConfig>({
    primary: DEFAULT_CUSTOM_PRIMARY,
  });

  useEffect(() => {
    const stored = localStorage.getItem(COLOR_THEME_STORAGE_KEY);
    const next = resolveColorThemeId(stored);
    const custom = readStoredCustomTheme();
    setCustomConfigState(custom);

    const css = localStorage.getItem(`${CUSTOM_THEME_STORAGE_KEY}-css`);
    if (css) injectCustomThemeStyle(css);
    else persistCustomTheme(custom);

    setThemeState(next);
    applyColorTheme(next);
    if (stored !== next) localStorage.setItem(COLOR_THEME_STORAGE_KEY, next);
  }, []);

  const setTheme = useCallback(
    (next: ColorThemeId) => {
      setThemeState(next);
      applyColorTheme(next);
      localStorage.setItem(COLOR_THEME_STORAGE_KEY, next);
      if (next === "custom") persistCustomTheme(customConfig);
    },
    [customConfig],
  );

  const setCustomConfig = useCallback((config: CustomThemeConfig, options?: { activate?: boolean }) => {
    const saved = persistCustomTheme(config);
    setCustomConfigState(saved);
    if (options?.activate === false) return;
    setThemeState("custom");
    applyColorTheme("custom");
    localStorage.setItem(COLOR_THEME_STORAGE_KEY, "custom");
  }, []);

  const resetCustomConfig = useCallback(() => {
    const saved = persistCustomTheme({ primary: DEFAULT_CUSTOM_PRIMARY });
    setCustomConfigState(saved);
    setThemeState("custom");
    applyColorTheme("custom");
    localStorage.setItem(COLOR_THEME_STORAGE_KEY, "custom");
  }, []);

  const value = useMemo<ColorThemeContextValue>(
    () => ({
      theme,
      setTheme,
      themes: getPresetThemes(),
      activeTheme: getColorTheme(theme, customConfig),
      customConfig,
      setCustomConfig,
      resetCustomConfig,
    }),
    [theme, setTheme, customConfig, setCustomConfig, resetCustomConfig],
  );

  return <ColorThemeContext.Provider value={value}>{children}</ColorThemeContext.Provider>;
}

export function useColorTheme() {
  const context = useContext(ColorThemeContext);
  if (!context) {
    throw new Error("useColorTheme must be used within ColorThemeProvider");
  }
  return context;
}
