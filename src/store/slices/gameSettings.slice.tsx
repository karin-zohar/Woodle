import { type StateCreator } from "zustand";
import { decode, encode } from "@/services/obfuscation.service";

const GAME_SETTINGS_LOCAL_STORAGE_KEY = "woodle-game-settings";
export const GUESSES_LOCAL_STORAGE_KEY = "woodle-guesses";

/** Single source of truth for supported word lengths. Add a new number here to support another length. */
export const WORD_LENGTHS = [5, 6, 7] as const;
export type WordLength = (typeof WORD_LENGTHS)[number];

export type GameSettings = {
  wordLength: WordLength;
  solution: string;
  solutionDefinition: string | null;
  activeGameId: string;
};

/** True when the user has a game in progress (valid decoded solution). */
export const hasOngoingGame = (settings: GameSettings): boolean => {
  const decoded = decode(settings.solution);
  return !!(decoded && decoded.trim() !== "");
};

/** Returns the decoded solution for gameplay/display; use this instead of settings.solution in UI. */
export const getDecodedSolution = (settings: GameSettings): string =>
  decode(settings.solution);

export type GameSettingsSlice = {
  gameSettings: GameSettings;
  setWordLength: (wordLength: WordLength) => void;
  setSolution: (solution: string) => void;
  applyNewGame: (wordLength: WordLength, solution: string, definition?: string | null) => void;
  /** True while a new game solution is being fetched (prevents double-fetch). */
  isFetchingSolution: boolean;
  setFetchingSolution: (value: boolean) => void;
};

/** No persisted settings: empty solution so UI fetches and sets via applyNewGame. */
const DEFAULT_GAME_SETTINGS: GameSettings = {
  wordLength: WORD_LENGTHS[0],
  solution: "",
  solutionDefinition: null,
  activeGameId: Date.now().toString(),
};

const saveSettings = (settings: GameSettings): void => {
  try {
    localStorage.setItem(GAME_SETTINGS_LOCAL_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Failed to save game settings to localStorage:", error);
    throw error;
  }
};

const validateAndNormalizeSettings = (parsed: unknown): GameSettings => {
  const settings = parsed as Partial<GameSettings>;
  
  const migratedSettings = settings.activeGameId
    ? settings
    : { ...settings, activeGameId: Date.now().toString() };

  // Validate shape
  if (
    typeof migratedSettings.wordLength !== "number" ||
    typeof migratedSettings.solution !== "string" ||
    typeof migratedSettings.activeGameId !== "string"
  ) {
    throw new Error("Invalid game settings shape");
  }

  // Normalize wordLength
  const wordLength = (WORD_LENGTHS as readonly number[]).includes(migratedSettings.wordLength)
    ? migratedSettings.wordLength
    : WORD_LENGTHS[0];

  const solutionDefinition =
    typeof migratedSettings.solutionDefinition === "string" && migratedSettings.solutionDefinition.trim() !== ""
      ? migratedSettings.solutionDefinition.trim()
      : null;

  return {
    wordLength: wordLength as WordLength,
    solution: migratedSettings.solution,
    solutionDefinition,
    activeGameId: migratedSettings.activeGameId,
  };
};

const loadGameSettings = (): GameSettings => {
  const storedSettings = localStorage.getItem(GAME_SETTINGS_LOCAL_STORAGE_KEY);

  if (!storedSettings) {
    try {
      saveSettings(DEFAULT_GAME_SETTINGS);
    } catch (error) {
      console.error("Failed to persist default game settings to localStorage:", error);
    }
    return DEFAULT_GAME_SETTINGS;
  }

  try {
    const parsed = JSON.parse(storedSettings);
    const settings = validateAndNormalizeSettings(parsed);

    if (!(parsed as Partial<GameSettings>).activeGameId) {
      try {
        saveSettings(settings);
      } catch (error) {
        console.error("Failed to persist migrated game settings to localStorage:", error);
      }
    }

    return settings;
  } catch {
    try {
      saveSettings(DEFAULT_GAME_SETTINGS);
    } catch (error) {
      console.error("Failed to persist default game settings to localStorage:", error);
    }
    return DEFAULT_GAME_SETTINGS;
  }
};

export const gameSettingsSlice: StateCreator<GameSettingsSlice> = (set) => {
  const gameSettings = loadGameSettings();

  return {
    gameSettings,
    isFetchingSolution: false,
    setFetchingSolution: (value: boolean) => {
      set({ isFetchingSolution: value });
    },
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
        const newSettings = {
          ...state.gameSettings,
          solution: encode(solution),
          solutionDefinition: null,
        };
        saveSettings(newSettings);
        return {
          gameSettings: newSettings,
        };
      });
    },
    applyNewGame: (wordLength: WordLength, solution: string, definition?: string | null) => {
      const trimmed = typeof solution === "string" ? solution.trim().toLowerCase() : "";
      if (!trimmed || trimmed.length !== wordLength) {
        throw new Error("applyNewGame: invalid solution for word length");
      }
      const encodedSolution = encode(trimmed);
      if (!encodedSolution) {
        throw new Error("applyNewGame: failed to encode solution");
      }
      const solutionDefinition =
        typeof definition === "string" && definition.trim() !== "" ? definition.trim() : null;
      set((state) => {
        const oldGameId = state.gameSettings.activeGameId;
        const newGameId = Date.now().toString();
        const newSettings: GameSettings = {
          wordLength,
          solution: encodedSolution,
          solutionDefinition,
          activeGameId: newGameId,
        };
        saveSettings(newSettings);
        try {
          localStorage.setItem(`${GUESSES_LOCAL_STORAGE_KEY}-${newGameId}`, JSON.stringify([]));
          localStorage.removeItem(`${GUESSES_LOCAL_STORAGE_KEY}-${oldGameId}`);
        } catch (error) {
          console.error("Failed to persist guesses keys to localStorage:", error);
        }
        return {
          gameSettings: newSettings,
        };
      });
    },
  };
};
