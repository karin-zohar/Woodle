import { type StateCreator } from "zustand";

type Theme = "light" | "dark";
export type ThemeSlice = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const themeSlice: StateCreator<ThemeSlice> = (set) => ({
  theme: "dark",
  setTheme: (theme: Theme) => {
    set({ theme });
  },
});
