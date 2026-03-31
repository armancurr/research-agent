"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  APP_THEME_STORAGE_KEY,
  type AppTheme,
  DEFAULT_APP_THEME,
  isAppTheme,
} from "@/lib/themes";

type ThemeContextValue = {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: AppTheme) {
  document.documentElement.dataset.appTheme = theme;
}

function readStoredTheme(): AppTheme {
  if (typeof window === "undefined") return DEFAULT_APP_THEME;

  const stored = window.localStorage.getItem(APP_THEME_STORAGE_KEY);
  return stored && isAppTheme(stored) ? stored : DEFAULT_APP_THEME;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<AppTheme>(DEFAULT_APP_THEME);

  useEffect(() => {
    const storedTheme = readStoredTheme();
    setTheme(storedTheme);
    applyTheme(storedTheme);
  }, []);

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(APP_THEME_STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
