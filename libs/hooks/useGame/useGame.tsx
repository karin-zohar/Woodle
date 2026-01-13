import { useState } from "react";
import type {
  GameSettings,
  TileRowType,
  TileType,
  UseGameReturn,
  WordLength,
} from "./useGame.type";
import { createEmptyRow } from "./useGame.util";

const TILE_STATUS = {
  CORRECT: "green",
  PRESENT: "yellow",
  ABSENT: "gray",
  EMPTY: "empty",
  EDITING: "editing",
} as const;

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

  const [guesses, setGuesses] = useState<string[]>([]);

  const [board, setBoard] = useState<TileRowType[]>(() =>
    Array.from({ length: gameSettings.wordLength + 1 }, () =>
      createEmptyRow(gameSettings.wordLength)
    )
  );

  const addGuess = () => {
    const activeRow = board[guesses.length];
    const guess = activeRow.tiles.map((tile) => tile.content ?? "").join("");
    // validate guess
    setGuesses((prev) => [...prev, guess]);
    return guess;
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

  const checkGuess = (currentGuess: string, rowIdx: number) => {
    const { solution } = gameSettings;
    if (!currentGuess) {
      return;
    }

    const guessLetters = currentGuess.toLowerCase().split("");

    if (currentGuess === solution) {
      guessLetters.forEach((_letter, i) =>
        updateTile(rowIdx, i, { status: TILE_STATUS.CORRECT })
      );
      // user wins
    }

    const guessResult: Partial<TileType>[] = guessLetters.map((letter, i) => {
      if (letter === solution[i]) {
        return { status: TILE_STATUS.CORRECT };
      }
      if (solution.includes(letter)) {
        return { status: TILE_STATUS.PRESENT };
      }
      return { status: TILE_STATUS.ABSENT };
    });

    guessResult.forEach((tile: Partial<TileType>, i) =>
      updateTile(rowIdx, i, tile)
    );
  };

  const submitGuess = () => {
    const currentRowIndex = guesses.length;
    const guess = addGuess();
    if (guess) {
      checkGuess(guess, currentRowIndex);
    }
  };

  const onType = (key: string) => {
    const activeRowIdx = guesses.length;
    const activeRow = board[activeRowIdx];
    const firstEmptyTileIdx = activeRow.tiles.findIndex(
      (tile: TileType) => !tile.content
    );

    if (key === "Backspace") {
      const lastTypedTileIdx = activeRow.tiles.findLastIndex(
        (tile: TileType) => !!tile.content
      );
      updateTile(activeRowIdx, lastTypedTileIdx, {
        content: "",
        status: TILE_STATUS.EMPTY,
      });
      return;
    }
    if (firstEmptyTileIdx === -1) {
      return;
    }
    updateTile(activeRowIdx, firstEmptyTileIdx, {
      content: key,
      status: TILE_STATUS.EDITING,
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
    submitGuess,
    onType,
  };
};
