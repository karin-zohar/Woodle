import { type StateCreator } from "zustand";

const GAME_SETTINGS_LOCAL_STORAGE_KEY = "woodle-game-settings";
export const GUESSES_LOCAL_STORAGE_KEY = "woodle-guesses";

export type WordLength = 5 | 6 | 7;

export type GameSettings = {
  wordLength: WordLength;
  solution: string;
  activeGameId: string;
};

/** True when the user has a game in progress (valid solution), so we don't start a new one on navigation. */
export const hasOngoingGame = (settings: GameSettings): boolean =>
  !!(settings.solution && settings.solution.trim() !== "");

/** True when we have no solution yet (e.g. no persisted settings); UI should fetch and set. */
export const needsSolution = (settings: GameSettings): boolean =>
  !settings.solution || settings.solution.trim() === "";

export type GameSettingsSlice = {
  gameSettings: GameSettings;
  setWordLength: (wordLength: WordLength) => void;
  setSolution: (solution: string) => void;
  applyNewGame: (wordLength: WordLength, solution: string) => void;
};

/** No persisted settings: empty solution so UI fetches and sets via applyNewGame. */
const DEFAULT_GAME_SETTINGS: GameSettings = {
  wordLength: 5,
  solution: "",
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
    applyNewGame: (wordLength: WordLength, solution: string) => {
      set((state) => {
        const oldGameId = state.gameSettings.activeGameId;
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
