import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "react-use";
import type { UseGameReturn } from "./useGame.type";
import { calculateRowStatus, getKeyboardAction, SUBMIT_HANDLERS } from "./useGame.util";
import { TILE_STATUS } from "./useGame.type";
import useStore from "@/store/store";
import useToast from "../useToast/useToast";
import useModal from "../useModal/useModal";
import dispatchCustomEvent from "@/libs/helpers/dispatchCustomEvent";
import { GAME_EVENTS } from "@/libs/constants/gameEvents";
import { GUESSES_LOCAL_STORAGE_KEY } from "@/store/slices/gameSettings.slice";

const GAME_OVER_MODAL_DELAY_MS = 4000;

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

   const checkGameStatus = useCallback(
    (guess: string, solution: string, wordLength: number, guessesCountAfterSubmit: number) => {
      if (guess === solution) {
        dispatchCustomEvent(GAME_EVENTS.GAME_OVER_WON, guessesCountAfterSubmit);
      } else if (guessesCountAfterSubmit > wordLength) {
        dispatchCustomEvent(GAME_EVENTS.GAME_OVER_LOST, solution);
      }
    },
    []
  );

  // Reset current guess when activeGameId changes (new game)
  // Guesses are cleared in startNewGame, and will automatically load from localStorage via useLocalStorage when the key changes
  useEffect(() => {
    setCurrentGuess({ guess: "", isInvalid: false });
  }, [activeGameId]);

  const openGameOverModal = useCallback(
    (result: "won" | "lost") => {
      setTimeout(() => {
        patchModalParams({
          "game-over": true,
          "game-over-won": result === "won",
          "game-over-lost": result === "lost",
        });
      }, GAME_OVER_MODAL_DELAY_MS);
    },
    [patchModalParams]
  );

  useEffect(() => {
    const context = { openGameOverModal };
    const listeners = Object.entries(SUBMIT_HANDLERS).map(([eventName, handler]) => {
      const listener = (event: Event) =>
        handler(showToast, event as CustomEvent, context);
      window.addEventListener(eventName, listener);
      return { eventName, listener };
    });

    return () => {
      listeners.forEach(({ eventName, listener }) => {
        window.removeEventListener(eventName, listener);
      });
    };
  }, [showToast, openGameOverModal]);

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

 

  const submitGuess = () => {
    if (currentGuess.guess.length === gameSettings.wordLength) {
      const guess = currentGuess.guess;
      const nextLength = (guesses?.length || 0) + 1;
      setGuesses([...(guesses || []), guess]);
      checkGameStatus(guess, gameSettings.solution, gameSettings.wordLength, nextLength);
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
