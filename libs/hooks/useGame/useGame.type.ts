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
};

export type TileRowType = {
  tiles: TileType[];
};

export type GameBoardProps = {
  rows: TileRowType[];
};

export type UseGameProps = {};

export type UseGameReturn = {
  board: TileRowType[];
  guesses: string[];
  submitGuess: () => void;
  onType: (key: string) => void;
  currentGuess: string;
};

import { GAME_EVENTS } from '@/libs/constants/gameEvents';

export type ValidationResult =
  | { action: "TYPE"; isValid: boolean }
  | { action: "SUBMIT"; isValid: boolean, invalidReason?: typeof GAME_EVENTS.SUBMIT_NOT_ENOUGH_LETTERS | typeof GAME_EVENTS.SUBMIT_NOT_IN_WORD_LIST; }
  | { action: "IGNORE" };
