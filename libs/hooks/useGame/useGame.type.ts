export const TILE_STATUS = {
  CORRECT: "green",
  PRESENT: "yellow",
  ABSENT: "gray",
  EMPTY: "empty",
  EDITING: "editing",
} as const;

export type TileStatusValue = (typeof TILE_STATUS)[keyof typeof TILE_STATUS];

export type TileType = {
  status: TileStatusValue;
  content?: string;
  index?: number;
};

export type TileRowType = {
  tiles: TileType[];
  isInvalid?: boolean;
  isWin?: boolean;
  /** When true, tiles in this row show a loading animation (validating guess). */
  isValidating?: boolean;
};

export type GameBoardProps = {
  rows: TileRowType[];
  /** Index of the row the user is currently typing in (for pulse animation). */
  currentRowIndex: number;
  /** When true, the current guess row shows a pulsing loading animation. */
  isCheckingWord?: boolean;
};

export type UseGameProps = {};

export type UseGameReturn = {
  board: TileRowType[];
  guesses: string[];
  /** Index of the row the user is currently typing in (equals guesses.length). */
  currentRowIndex: number;
  submitGuess: (overrideGuess?: string) => void;
  onType: (key: string) => void;
  currentGuess: { guess: string; isInvalid: boolean };
  /** True while a submitted guess is being validated (not in list → API check); typing is disabled. */
  isCheckingWord: boolean;
};

import { GAME_EVENTS } from '@/libs/constants/gameEvents';

export type ValidationResult =
  | { action: "TYPE"; isValid: boolean }
  | {
      action: "SUBMIT";
      isValid: boolean;
      invalidReason?:
        | typeof GAME_EVENTS.SUBMIT_NOT_ENOUGH_LETTERS
        | typeof GAME_EVENTS.SUBMIT_NOT_IN_WORD_LIST
        | typeof GAME_EVENTS.SUBMIT_UNKNOWN_ERROR;
    }
  | { action: "IGNORE" };
