import { useState } from "react";
import type {
  GameSettings,
  TileRowType,
  TileType,
  UseGameReturn,
  WordLength,
} from "./useGame.type";

export const useGame = (): UseGameReturn => {
  const defaultGameSettings: GameSettings = {
    wordLength: 5,
    solution: "trial", // temp hardcoded
  };

  // Settings
  const [gameSettings, setGameSettings] =
    useState<GameSettings>(defaultGameSettings);

  const setWordLength = (selectedWordLength: WordLength) => {
    setGameSettings((prev) => ({ ...prev, wordLength: selectedWordLength }));
  };

  // Board
  const createEmptyTile = (): TileType => ({ status: "empty" });

  const createEmptyRow = (): TileRowType => ({
    tiles: Array.from({ length: gameSettings.wordLength }, createEmptyTile),
  });

  const [guesses, setGuesses] = useState<string[]>([]);

  const [board, setBoard] = useState<TileRowType[]>(() =>
    Array.from({ length: gameSettings.wordLength + 1 }, createEmptyRow)
  );

  const addGuess = () => {
    const activeRow = board[guesses.length];
    const guess = activeRow.tiles.map((tile) => tile.content ?? "").join("");

    setGuesses((prev) => [...prev, guess]);
  };

  const updateTile = (
    rowId: number,
    tileId: number,
    newTileDetails: Partial<TileType>
  ) => {
    setBoard((prev) => {
      const next = prev.map((row, rIdx) => {
        if (rIdx !== rowId) return row;

        return {
          ...row,
          tiles: row.tiles.map((tile, tIdx) =>
            tIdx === tileId ? { ...tile, ...newTileDetails } : tile
          ),
        };
      });

      return next;
    });
  };

  //   const startNewGame = () => {
  //     // fetch solution and update it
  //     // wipe board
  //   };

  // Process:
  // start new game - fetch the solution word
  // user types -> next active tile updates to editing mode
  // user clicks submit
  // join the active row tiles into a guess
  // check if guess is valid
  // if guess invalid: signal to user, stay on the same row.
  // if guess valid: check each tile status (gray/yellow/green) and update board.
  // join the active row tiles into a guess
  // check if guess === solution word
  // if yes: user wins
  // if not:
  // if there are more guesses left, move active to next row
  // if it's the last guess, game over.

  return {
    gameSettings,
    setWordLength,
    board,
    updateTile,
    guesses,
    addGuess,
  };
};
