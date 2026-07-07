"use client";

import { useCallback, useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "@/lib/theme/init-theme";

export type Theme = "light" | "dark";

const listeners = new Set<() => void>();

function readStoredTheme(): Theme {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  return saved === "light" || saved === "dark" ? saved : "light";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emitThemeChange() {
  for (const listener of listeners) listener();
}

function getSnapshot(): Theme {
  return readStoredTheme();
}

function getServerSnapshot(): Theme {
  return "light";
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLightTheme = useCallback((isLight: boolean) => {
    const next: Theme = isLight ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
    emitThemeChange();
  }, []);

  return {
    theme,
    isLight: theme === "light",
    setLightTheme,
  };
}
