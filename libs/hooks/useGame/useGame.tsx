import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "react-use";
import { TILE_STATUS , type UseGameReturn } from "./useGame.type";
import { calculateRowStatus, getKeyboardAction, checkGameStatus } from "./useGame.util";
import { SUBMIT_HANDLERS } from "./useGame.handlers";
import useStore from "@/store/store";
import { useToast, useModal } from "../index";
import dispatchCustomEvent from "@/libs/helpers/dispatchCustomEvent";
import { GAME_EVENTS } from "@/libs/constants/gameEvents";
import { GUESSES_LOCAL_STORAGE_KEY } from "@/store/slices/gameSettings.slice";

export const useGame = (): UseGameReturn => {
  const { showToast } = useToast();
  const { patchModalParams } = useModal();
  const activeGameId = useStore((state) => state.gameSettings.activeGameId);
  const gameSettings = useStore((state) => state.gameSettings);

  const [guesses, setGuesses] = useLocalStorage<string[]>(
    `${GUESSES_LOCAL_STORAGE_KEY}-${activeGameId}`,
    []
  );
  
  const [currentGuess, setCurrentGuess] = useState<{ guess: string; isInvalid: boolean }>({
    guess: "",
    isInvalid: false,
  });

  // Reset guess state when activeGameId changes (new game).
  useEffect(() => {
    setCurrentGuess({ guess: "", isInvalid: false });
  }, [activeGameId]);

  useEffect(() => {
    const listeners = Object.entries(SUBMIT_HANDLERS).map(([eventName, handler]) => {
      const listener = (event: Event) =>
        handler(showToast, event as CustomEvent, patchModalParams);
      window.addEventListener(eventName, listener);
      return { eventName, listener };
    });

    return () => {
      listeners.forEach(({ eventName, listener }) => {
        window.removeEventListener(eventName, listener);
      });
    };
  }, [showToast, patchModalParams]);

  const board = useMemo(() => {
    const guessesArray = guesses || [];
    return Array.from({ length: gameSettings.wordLength + 1 }).map(
      (_, rowIndex) => {
        const word =
          guessesArray[rowIndex] ||
          (rowIndex === guessesArray.length ? currentGuess.guess : "");

        const isFinished = rowIndex < guessesArray.length;

        const rowStatuses = isFinished
          ? calculateRowStatus(word, gameSettings.solution)
          : [];

        return {
          isInvalid: rowIndex === guessesArray.length && currentGuess.isInvalid,
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

  const submitGuess = useCallback(() => {
    if (currentGuess.guess.length === gameSettings.wordLength) {
      const guess = currentGuess.guess;
      const nextLength = (guesses?.length || 0) + 1;
      setGuesses([...(guesses || []), guess]);
      checkGameStatus(guess, gameSettings.solution, gameSettings.wordLength, nextLength);
      setCurrentGuess({ guess: "", isInvalid: false });
    }
  }, [
    currentGuess,
    gameSettings.solution,
    gameSettings.wordLength,
    guesses,
    setGuesses,
    setCurrentGuess,
  ]);

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
    [currentGuess, gameSettings.wordLength, submitGuess, guesses?.length]
  );

  return {
    board,
    guesses: guesses || [],
    submitGuess,
    onType,
    currentGuess,
  };
};
