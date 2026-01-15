import { create } from "zustand";
import { type ThemeSlice, themeSlice } from "./slices/theme.slice.tsx";
import {
  type GameSettingsSlice,
  gameSettingsSlice,
} from "./slices/gameSettings.slice.tsx";

type Store = ThemeSlice & GameSettingsSlice;

const useStore = create<Store>((...slices) => ({
  ...themeSlice(...slices),
  ...gameSettingsSlice(...slices),
}));

export default useStore;
