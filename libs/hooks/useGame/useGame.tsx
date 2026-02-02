import { useCallback, useEffect, useMemo, useState } from "react";
import type { UseGameReturn } from "./useGame.type";
import { calculateRowStatus, getKeyboardAction, SUBMIT_HANDLERS } from "./useGame.util";
import { TILE_STATUS } from "./useGame.type";
import useStore from "@/store/store";
import useToast from "../useToast/useToast";
import dispatchCustomEvent from '@/libs/helpers/dispatchCustomEvent';
import { GAME_EVENTS } from '@/libs/constants/gameEvents';

export const useGame = (): UseGameReturn => {
  const { showToast } = useToast()
  const { gameSettings } = useStore();

  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [invalidRowIndex, setInvalidRowIndex] = useState<number | null>(null);

  useEffect(() => {
    setGuesses([]);
    setCurrentGuess("");
  }, [gameSettings.wordLength, gameSettings.solution]);

  useEffect(() => {
    const listeners = Object.entries(SUBMIT_HANDLERS).map(([eventName, handler]) => {
      const listener = (event: Event) => handler(showToast, event as CustomEvent);
      window.addEventListener(eventName, listener);
      return { eventName, listener };
    });

    return () => {
      listeners.forEach(({ eventName, listener }) => {
        window.removeEventListener(eventName, listener);
      });
    };
  }, [showToast])

  const board = useMemo(() => {
    return Array.from({ length: gameSettings.wordLength + 1 }).map(
      (_, rowIndex) => {
        const word =
          guesses[rowIndex] ||
          (rowIndex === guesses.length ? currentGuess : "");

        const isFinished = rowIndex < guesses.length;

        const rowStatuses = isFinished
          ? calculateRowStatus(word, gameSettings.solution)
          : [];

        return {
          isInvalid: rowIndex === invalidRowIndex,
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
  }, [guesses, currentGuess, gameSettings.solution, gameSettings.wordLength, invalidRowIndex]);

  const submitGuess = () => {
    if (currentGuess.length === gameSettings.wordLength) {
      const guess = currentGuess;
      const nextLength = guesses.length + 1;
      setGuesses((prev) => [...prev, guess]);
      if (currentGuess === gameSettings.solution) {
        dispatchCustomEvent(GAME_EVENTS.GAME_OVER_WON, nextLength);
      } else if (nextLength > gameSettings.wordLength) {
        dispatchCustomEvent(GAME_EVENTS.GAME_OVER_LOST, gameSettings.solution);
      }
      setCurrentGuess("");
    }
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
            dispatchCustomEvent(result.invalidReason ?? GAME_EVENTS.SUBMIT_UNKNOWN_ERROR);
            setInvalidRowIndex(guesses.length);
            setTimeout(() => setInvalidRowIndex(null), 600);
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
