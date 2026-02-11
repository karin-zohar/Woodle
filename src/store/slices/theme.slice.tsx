import { type StateCreator } from "zustand";

const THEME_LOCAL_STORAGE_KEY = "theme";
const VALID_THEMES = ["light", "dark"] as const;

type Theme = (typeof VALID_THEMES)[number];
export type ThemeSlice = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const getStoredTheme = (): Theme => {
  const stored = localStorage.getItem(THEME_LOCAL_STORAGE_KEY);
  if (stored && VALID_THEMES.includes(stored as Theme)) {
    return stored as Theme;
  }
  return "light";
}

export const themeSlice: StateCreator<ThemeSlice> = (set) => {
  const initialTheme = getStoredTheme();

  return {
    theme: initialTheme,
    setTheme: (theme: Theme) => {
      set({ theme });
      try {
        localStorage.setItem(THEME_LOCAL_STORAGE_KEY, theme);
      } catch (error) {
        console.error("Failed to save theme to localStorage:", error);
      }
    },
  };
};
