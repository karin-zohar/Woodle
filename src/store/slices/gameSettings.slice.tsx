import { type StateCreator } from "zustand";

const GAME_SETTINGS_LOCAL_STORAGE_KEY = "woodle-game-settings";
export const GUESSES_LOCAL_STORAGE_KEY = "woodle-guesses";

const PLACEHOLDER_SOLUTION = "trial"; // TODO: Replace with proper solution fetching logic

export type WordLength = 5 | 6 | 7;

export type GameSettings = {
  wordLength: WordLength;
  solution: string;
  activeGameId: string;
};

export type GameSettingsSlice = {
  gameSettings: GameSettings;
  setWordLength: (wordLength: WordLength) => void;
  setSolution: (solution: string) => void;
  startNewGame: (wordLength: WordLength) => void;
};

const DEFAULT_GAME_SETTINGS: GameSettings = {
  wordLength: 5,
  solution: PLACEHOLDER_SOLUTION, // temp hardcoded
  activeGameId: Date.now().toString(),
};

export const gameSettingsSlice: StateCreator<GameSettingsSlice> = (set) => {
  const storedSettings = localStorage.getItem(GAME_SETTINGS_LOCAL_STORAGE_KEY);
  let gameSettings: GameSettings;

  if (storedSettings) {
    try {
      const parsed = JSON.parse(storedSettings);
      // Handle migration: if old data doesn't have activeGameId, generate one
      gameSettings = parsed.activeGameId
        ? parsed
        : { ...parsed, activeGameId: Date.now().toString() };
      // Validate shape: ensure required fields exist
      if (
        typeof gameSettings.wordLength !== "number" ||
        typeof gameSettings.solution !== "string" ||
        typeof gameSettings.activeGameId !== "string"
      ) {
        throw new Error("Invalid game settings shape");
      }
      const validWordLengths: WordLength[] = [5, 6, 7];
      if (!validWordLengths.includes(gameSettings.wordLength)) {
        gameSettings = { ...gameSettings, wordLength: 5 };
      }
      // Save migrated data back to localStorage
      if (!parsed.activeGameId) {
        localStorage.setItem(GAME_SETTINGS_LOCAL_STORAGE_KEY, JSON.stringify(gameSettings));
      }
    } catch {
      gameSettings = { ...DEFAULT_GAME_SETTINGS };
      localStorage.setItem(GAME_SETTINGS_LOCAL_STORAGE_KEY, JSON.stringify(gameSettings));
    }
  } else {
    gameSettings = DEFAULT_GAME_SETTINGS;
    localStorage.setItem(GAME_SETTINGS_LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_GAME_SETTINGS));
  }

  return {
    gameSettings,
    setWordLength: (wordLength: WordLength) => {
      set((state) => {
        const newSettings = { ...state.gameSettings, wordLength };
        localStorage.setItem(GAME_SETTINGS_LOCAL_STORAGE_KEY, JSON.stringify(newSettings));
        return {
          gameSettings: newSettings,
        };
      });
    },
    setSolution: (solution: string) => {
      set((state) => {
        const newSettings = { ...state.gameSettings, solution };
        localStorage.setItem(GAME_SETTINGS_LOCAL_STORAGE_KEY, JSON.stringify(newSettings));
        return {
          gameSettings: newSettings,
        };
      });
    },
    startNewGame: (wordLength: WordLength) => {
      set(() => {
        // TODO: Replace with proper solution fetching logic
        const solution = PLACEHOLDER_SOLUTION; // Placeholder - same solution every time until fetching logic is defined
        
        const newGameId = Date.now().toString();
        const newSettings: GameSettings = {
          wordLength,
          solution,
          activeGameId: newGameId,
        };
        localStorage.setItem(GAME_SETTINGS_LOCAL_STORAGE_KEY, JSON.stringify(newSettings));
        // Clear guesses for the new game
        localStorage.setItem(`${GUESSES_LOCAL_STORAGE_KEY}-${newGameId}`, JSON.stringify([]));
        return {
          gameSettings: newSettings,
        };
      });
    },
  };
};
