import { type StateCreator } from "zustand";
import type { GameSettings, WordLength } from "@/libs/hooks/useGame/useGame.type";

export type GameSettingsSlice = {
  gameSettings: GameSettings;
  setWordLength: (wordLength: WordLength) => void;
  setSolution: (solution: string) => void;
};

const DEFAULT_GAME_SETTINGS: GameSettings = {
  wordLength: 5,
  solution: "trial", // temp hardcoded
};

export const gameSettingsSlice: StateCreator<GameSettingsSlice> = (set) => ({
  gameSettings: DEFAULT_GAME_SETTINGS,
  setWordLength: (wordLength: WordLength) => {
    set((state) => ({
      gameSettings: { ...state.gameSettings, wordLength },
    }));
  },
  setSolution: (solution: string) => {
    set((state) => ({
      gameSettings: { ...state.gameSettings, solution },
    }));
  },
});
