import { create } from "zustand";
import { type ThemeSlice, themeSlice } from "./slices/theme.slice.tsx";

type Store = ThemeSlice;

const useStore = create<Store>((...slices) => ({
  ...themeSlice(...slices),
}));

export default useStore;
