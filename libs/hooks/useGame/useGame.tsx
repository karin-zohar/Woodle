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
        updateTile(rowIdx, i, { status: "green" })
      );
      // user wins
    }

    const guessResult: Partial<TileType>[] = guessLetters.map((letter, i) => {
      if (letter === solution[i]) {
        return { status: "green" };
      }
      if (solution.includes(letter)) {
        return { status: "yellow" };
      }
      return { status: "gray" };
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
        status: "empty",
      });
      return;
    }
    if (firstEmptyTileIdx === -1) {
      return;
    }
    updateTile(activeRowIdx, firstEmptyTileIdx, {
      content: key,
      status: "editing",
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
