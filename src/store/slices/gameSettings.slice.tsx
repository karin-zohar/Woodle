import { type StateCreator } from "zustand";

export type WordLength = 5 | 6 | 7;

export type GameSettings = {
  wordLength: WordLength;
  solution: string;
  pendingWordLength: WordLength | null;
};

export type GameSettingsSlice = {
  gameSettings: GameSettings;
  setSolution: (solution: string) => void;
  requestWordLengthChange: (wordLength: WordLength) => void;
  confirmWordLengthChange: () => void;
  cancelWordLengthChange: () => void;
};

const DEFAULT_GAME_SETTINGS: GameSettings = {
  wordLength: 5,
  solution: "trial",
  pendingWordLength: null,
};

export const gameSettingsSlice: StateCreator<GameSettingsSlice> = (set) => ({
  gameSettings: DEFAULT_GAME_SETTINGS,

  setSolution: (solution: string) => {
    set((state) => ({
      gameSettings: { ...state.gameSettings, solution },
    }));
  },

  requestWordLengthChange: (length: WordLength) => {
    set((state) => ({
      gameSettings: {
        ...state.gameSettings,
        pendingWordLength: length,
      },
    }));
  },

  confirmWordLengthChange: () => {
    set((state) => {
      const { pendingWordLength, wordLength } = state.gameSettings;
      return {
        gameSettings: {
          ...state.gameSettings,
          wordLength: pendingWordLength ?? wordLength,
          pendingWordLength: null,
        },
      };
    });
  },

  cancelWordLengthChange: () => {
    set((state) => ({
      gameSettings: {
        ...state.gameSettings,
        pendingWordLength: null,
      },
    }));
  },
});
