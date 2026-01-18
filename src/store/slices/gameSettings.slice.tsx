import { type StateCreator } from "zustand";

export type WordLength = 5 | 6 | 7;

export type GameSettings = {
  wordLength: WordLength;
  solution: string;
};

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
      //TODO: fetch new solution after wordLength change
    }));
  },
  setSolution: (solution: string) => {
    set((state) => ({
      gameSettings: { ...state.gameSettings, solution },
    }));
  },
});
