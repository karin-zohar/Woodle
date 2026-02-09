import { type StateCreator } from "zustand";

const THEME_LOCAL_STORAGE_KEY = "theme";

type Theme = "light" | "dark";
export type ThemeSlice = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const themeSlice: StateCreator<ThemeSlice> = (set, get) => {
  const initialTheme = (localStorage.getItem(THEME_LOCAL_STORAGE_KEY) as Theme) || "light";
  
  return {
    theme: initialTheme,
    setTheme: (theme: Theme) => {
      set({ theme });
      localStorage.setItem(THEME_LOCAL_STORAGE_KEY, theme);
    },
  };
};
