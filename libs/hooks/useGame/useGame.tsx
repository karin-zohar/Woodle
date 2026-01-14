import { useState } from "react";
import type { GameSettings, UseGameReturn, WordLength } from "./useGame.type";
import { calculateRowStatus } from "./useGame.util";
import { TILE_STATUS } from "./useGame.type";

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
  const [currentGuess, setCurrentGuess] = useState<string>("");

  const board = Array.from({ length: gameSettings.wordLength }).map(
    (_, rowIndex) => {
      const word =
        guesses[rowIndex] || (rowIndex === guesses.length ? currentGuess : "");

      const isFinished = rowIndex < guesses.length;

      const rowStatuses = isFinished
        ? calculateRowStatus(word, gameSettings.solution)
        : [];

      return {
        tiles: word
          .padEnd(gameSettings.wordLength, " ")
          .split("")
          .map((char, charIndex) => ({
            content: char.trim(),
            status: isFinished ? rowStatuses[charIndex] : TILE_STATUS.EDITING,
          })),
      };
    }
  );

  const addGuess = () => {
    if (currentGuess.length === gameSettings.wordLength) {
      const guess = currentGuess;
      // validate guess
      setGuesses((prev) => [...prev, guess]);
      setCurrentGuess("");
    }
  };

  const submitGuess = () => {
    addGuess();
  };

  const onType = (key: string) => {
    if (key === "Backspace") {
      setCurrentGuess((prev) => prev.slice(0, -1));
      return;
    }
    const isRowFull = currentGuess.length === gameSettings.wordLength;
    if (isRowFull) {
      return;
    }

    setCurrentGuess((prev) => prev + key);
  };

  return {
    gameSettings,
    setWordLength,
    board,
    guesses,
    submitGuess,
    onType,
    currentGuess,
  };
};
