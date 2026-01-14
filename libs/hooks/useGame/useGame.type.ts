export type TileType = {
  status: "empty" | "editing" | "gray" | "yellow" | "green";
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
