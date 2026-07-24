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
  COLOR_THEMES,
  DEFAULT_COLOR_THEME,
  getColorTheme,
  isColorThemeId,
  type ColorThemeId,
  type ColorThemeMeta,
} from "@/lib/color-themes";

interface ColorThemeContextValue {
  theme: ColorThemeId;
  setTheme: (theme: ColorThemeId) => void;
  themes: ColorThemeMeta[];
  activeTheme: ColorThemeMeta;
}

const ColorThemeContext = createContext<ColorThemeContextValue | null>(null);

function applyColorTheme(theme: ColorThemeId) {
  document.documentElement.dataset.theme = theme;
}

export function ColorThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ColorThemeId>(DEFAULT_COLOR_THEME);

  useEffect(() => {
    const stored = localStorage.getItem(COLOR_THEME_STORAGE_KEY);
    const next = isColorThemeId(stored) ? stored : DEFAULT_COLOR_THEME;
    setThemeState(next);
    applyColorTheme(next);
  }, []);

  const setTheme = useCallback((next: ColorThemeId) => {
    setThemeState(next);
    applyColorTheme(next);
    localStorage.setItem(COLOR_THEME_STORAGE_KEY, next);
  }, []);

  const value = useMemo<ColorThemeContextValue>(
    () => ({
      theme,
      setTheme,
      themes: COLOR_THEMES,
      activeTheme: getColorTheme(theme),
    }),
    [theme, setTheme],
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
