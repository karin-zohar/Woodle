import { useState } from "react";

export type UseGameProps = {};
export type WordLength = 5 | 6 | 7;

export type GameSettings = {
  wordLength: WordLength;
  solution: string;
};

export type UseGameReturn = {
  gameSettings: GameSettings;
  setWordLength: (selectedWordLength: WordLength) => void;
};

export const useGame = (): UseGameReturn => {
  const defaultGameSettings: GameSettings = {
    wordLength: 5,
    solution: "trial", // temp hardcoded
  };
  const [gameSettings, setGameSettings] =
    useState<GameSettings>(defaultGameSettings);

  const setWordLength = (selectedWordLength: WordLength) => {
    setGameSettings((prev) => ({ ...prev, wordLength: selectedWordLength }));
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
  };
};
