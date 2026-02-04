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
  const [currentGuess, setCurrentGuess] = useState<{ guess: string; isInvalid: boolean }>({
    guess: "",
    isInvalid: false,
  });

  useEffect(() => {
    setGuesses([]);
    setCurrentGuess({ guess: "", isInvalid: false });
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
          (rowIndex === guesses.length ? currentGuess.guess : "");

        const isFinished = rowIndex < guesses.length;

        const rowStatuses = isFinished
          ? calculateRowStatus(word, gameSettings.solution)
          : [];

        return {
          isInvalid: rowIndex === guesses.length && currentGuess.isInvalid,
          isWin: isFinished && word === gameSettings.solution,
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
  }, [guesses, currentGuess, gameSettings.solution, gameSettings.wordLength]);

  const submitGuess = () => {
    if (currentGuess.guess.length === gameSettings.wordLength) {
      const guess = currentGuess.guess;
      const nextLength = guesses.length + 1;
      setGuesses((prev) => [...prev, guess]);
      if (currentGuess.guess === gameSettings.solution) {
        dispatchCustomEvent(GAME_EVENTS.GAME_OVER_WON, nextLength);
      } else if (nextLength > gameSettings.wordLength) {
        dispatchCustomEvent(GAME_EVENTS.GAME_OVER_LOST, gameSettings.solution);
      }
      setCurrentGuess({ guess: "", isInvalid: false });
    }
  };



  const onType = useCallback(
    (key: string) => {
      if (key === "Backspace") {
        setCurrentGuess((prev) => ({ ...prev, guess: prev.guess.slice(0, -1) }));
        return;
      }

      const result = getKeyboardAction(
        key,
        currentGuess.guess,
        gameSettings.wordLength
      );

      switch (result.action) {
        case "SUBMIT":
          if (result.isValid) {
            submitGuess();
          } else {
            dispatchCustomEvent(result.invalidReason ?? GAME_EVENTS.SUBMIT_UNKNOWN_ERROR);
            setCurrentGuess((prev) => ({ ...prev, isInvalid: true }));
            setTimeout(() => setCurrentGuess((prev) => ({ ...prev, isInvalid: false })), 600);
          }
          break;

        case "TYPE":
          if (result.isValid) {
            setCurrentGuess((prev) => ({ ...prev, guess: prev.guess + key.toLowerCase() }));
          }
          break;

        default:
          // Ignore other keys like 'Shift', 'Alt', etc.
          break;
      }
    },
    [currentGuess, gameSettings.wordLength, submitGuess, guesses.length]
  );

  return {
    board,
    guesses,
    submitGuess,
    onType,
    currentGuess,
  };
};
