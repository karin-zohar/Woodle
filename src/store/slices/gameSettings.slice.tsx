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

const saveSettings = (settings: GameSettings): void => {
  try {
    localStorage.setItem(GAME_SETTINGS_LOCAL_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Failed to save game settings to localStorage:", error);
  }
};

const validateAndNormalizeSettings = (parsed: unknown): GameSettings => {
  const settings = parsed as Partial<GameSettings>;
  
  // Handle migration: add activeGameId if missing
  const migrated = settings.activeGameId
    ? settings
    : { ...settings, activeGameId: Date.now().toString() };

  // Validate shape
  if (
    typeof migrated.wordLength !== "number" ||
    typeof migrated.solution !== "string" ||
    typeof migrated.activeGameId !== "string"
  ) {
    throw new Error("Invalid game settings shape");
  }

  // Normalize wordLength
  const validWordLengths: WordLength[] = [5, 6, 7];
  const wordLength = validWordLengths.includes(migrated.wordLength as WordLength)
    ? migrated.wordLength
    : 5;

  return {
    wordLength: wordLength as WordLength,
    solution: migrated.solution,
    activeGameId: migrated.activeGameId,
  };
};

const loadGameSettings = (): GameSettings => {
  const storedSettings = localStorage.getItem(GAME_SETTINGS_LOCAL_STORAGE_KEY);
  
  if (!storedSettings) {
    saveSettings(DEFAULT_GAME_SETTINGS);
    return DEFAULT_GAME_SETTINGS;
  }

  try {
    const parsed = JSON.parse(storedSettings);
    const settings = validateAndNormalizeSettings(parsed);
    
    // Save migrated data if needed
    if (!(parsed as Partial<GameSettings>).activeGameId) {
      saveSettings(settings);
    }
    
    return settings;
  } catch {
    saveSettings(DEFAULT_GAME_SETTINGS);
    return DEFAULT_GAME_SETTINGS;
  }
};

export const gameSettingsSlice: StateCreator<GameSettingsSlice> = (set) => {
  const gameSettings = loadGameSettings();

  return {
    gameSettings,
    setWordLength: (wordLength: WordLength) => {
      set((state) => {
        const newSettings = { ...state.gameSettings, wordLength };
        saveSettings(newSettings);
        return {
          gameSettings: newSettings,
        };
      });
    },
    setSolution: (solution: string) => {
      set((state) => {
        const newSettings = { ...state.gameSettings, solution };
        saveSettings(newSettings);
        return {
          gameSettings: newSettings,
        };
      });
    },
    startNewGame: (wordLength: WordLength) => {
      set((state) => {
        const oldGameId = state.gameSettings.activeGameId;
        // TODO: Replace with proper solution fetching logic
        const solution = PLACEHOLDER_SOLUTION; // Placeholder - same solution every time until fetching logic is defined

        const newGameId = Date.now().toString();
        const newSettings: GameSettings = {
          wordLength,
          solution,
          activeGameId: newGameId,
        };
        try {
          saveSettings(newSettings);
          localStorage.setItem(`${GUESSES_LOCAL_STORAGE_KEY}-${newGameId}`, JSON.stringify([]));
          localStorage.removeItem(`${GUESSES_LOCAL_STORAGE_KEY}-${oldGameId}`);
        } catch (error) {
          console.error("Failed to save new game settings to localStorage:", error);
        }
        return {
          gameSettings: newSettings,
        };
      });
    },
  };
};
