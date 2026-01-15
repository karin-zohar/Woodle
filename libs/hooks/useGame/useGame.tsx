import { useCallback, useMemo, useState } from "react";
import type { UseGameReturn } from "./useGame.type";
import { calculateRowStatus, getKeyboardAction } from "./useGame.util";
import { TILE_STATUS } from "./useGame.type";
import useStore from "@/store/store";

export const useGame = (): UseGameReturn => {
  // Settings
  const { gameSettings } = useStore();

  // Board
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");

  // TODO: memoize board
  const board = useMemo(() => {
    return Array.from({ length: gameSettings.wordLength }).map(
      (_, rowIndex) => {
        const word =
          guesses[rowIndex] ||
          (rowIndex === guesses.length ? currentGuess : "");

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
  }, [guesses, currentGuess, gameSettings]);

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

  const onType = useCallback(
    (key: string) => {
      if (key === "Backspace") {
        setCurrentGuess((prev) => prev.slice(0, -1));
        return;
      }

      const result = getKeyboardAction(
        key,
        currentGuess,
        gameSettings.wordLength
      );

      switch (result.action) {
        case "SUBMIT":
          if (result.isValid) {
            submitGuess();
          } else {
            console.log("Word too short!");
            // TODO: trigger a shake animation here.
          }
          break;

        case "TYPE":
          if (result.isValid) {
            setCurrentGuess(currentGuess + key.toLowerCase());
          } else {
            console.log("Row is full!");
          }
          break;

        default:
          // Ignore other keys like 'Shift', 'Alt', etc.
          break;
      }
    },
    [currentGuess, gameSettings.wordLength, submitGuess]
  );

  return {
    board,
    guesses,
    submitGuess,
    onType,
    currentGuess,
  };
};
