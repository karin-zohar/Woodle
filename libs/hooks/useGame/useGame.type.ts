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
export type WordLength = 5 | 6 | 7;

export type GameSettings = {
  wordLength: WordLength;
  solution: string;
};

export type UseGameReturn = {
  gameSettings: GameSettings;
  setWordLength: (selectedWordLength: WordLength) => void;
  board: TileRowType[];
  guesses: string[];
  submitGuess: () => void;
  onType: (key: string) => void;
  currentGuess: string;
};
