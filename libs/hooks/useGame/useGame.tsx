import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocalStorage } from "react-use";
import type { CurrentGuessState, UseGameReturn } from "./useGame.type";
import {
  buildBoard,
  checkGameStatus,
  getKeyboardAction,
  showInvalidGuessAndClear,
  tryAddWordAndSubmit,
} from "./useGame.util";
import { SUBMIT_HANDLERS } from "./useGame.handlers";
import useStore from "@/store/store";
import { useToast, useModal } from "../index";
import { GAME_EVENTS } from "@/libs/constants/gameEvents";
import {
  getDecodedSolution,
  GUESSES_LOCAL_STORAGE_KEY,
} from "@/store/slices/gameSettings.slice";

const INITIAL_GUESS_STATE: CurrentGuessState = {
  guess: "",
  isInvalid: false,
};

export const useGame = (): UseGameReturn => {
  const { showToast } = useToast();
  const { patchModalParams } = useModal();
  const activeGameId = useStore((state) => state.gameSettings.activeGameId);
  const gameSettings = useStore((state) => state.gameSettings);
  const solution = useStore((state) => getDecodedSolution(state.gameSettings));

  const [guesses, setGuesses] = useLocalStorage<string[]>(
    `${GUESSES_LOCAL_STORAGE_KEY}-${activeGameId}`,
    []
  );
  const [currentGuess, setCurrentGuess] = useState(INITIAL_GUESS_STATE);
  const [isCheckingWord, setIsCheckingWord] = useState(false);
  const isCheckingWordRef = useRef(false);

  const guessesList = guesses ?? [];

  // Reset current guess when switching to a new game.
  useEffect(() => {
    setCurrentGuess(INITIAL_GUESS_STATE);
  }, [activeGameId]);

  // Subscribe to game events (not enough letters, not in list, game over, etc.).
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

  const board = useMemo(
    () =>
      buildBoard(
        guesses ?? [],
        currentGuess,
        solution,
        gameSettings.wordLength
      ),
    [guesses, currentGuess, solution, gameSettings.wordLength]
  );

  const submitGuess = useCallback(
    (overrideGuess?: string) => {
      const guessToSubmit = overrideGuess ?? currentGuess.guess;
      if (guessToSubmit.length !== gameSettings.wordLength) {
        return;
      }
      const nextLength = guessesList.length + 1;
      setGuesses([...guessesList, guessToSubmit]);
      checkGameStatus(guessToSubmit, solution, gameSettings.wordLength, nextLength);
      setCurrentGuess(INITIAL_GUESS_STATE);
    },
    [
      currentGuess.guess,
      solution,
      gameSettings.wordLength,
      guessesList,
      setGuesses,
      setCurrentGuess,
    ]
  );

  const onType = useCallback(
    (key: string) => {
      if (isCheckingWord) {
        return;
      }
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
        case "SUBMIT": {
          if (result.isValid) {
            submitGuess();
            break;
          }
          if (result.invalidReason === GAME_EVENTS.SUBMIT_NOT_IN_WORD_LIST) {
            const guess = currentGuess.guess.trim().toLowerCase();
            tryAddWordAndSubmit(guess, gameSettings.wordLength, submitGuess, {
              setCurrentGuess,
              isCheckingWordRef,
              setIsCheckingWord,
              onNotInList: () =>
                showInvalidGuessAndClear(
                  setCurrentGuess,
                  GAME_EVENTS.SUBMIT_NOT_IN_WORD_LIST
                ),
            });
            break;
          }
          showInvalidGuessAndClear(
            setCurrentGuess,
            result.invalidReason ?? GAME_EVENTS.SUBMIT_UNKNOWN_ERROR
          );
          break;
        }

        case "TYPE":
          if (result.isValid) {
            setCurrentGuess((prev) => ({
              ...prev,
              guess: prev.guess + key.toLowerCase(),
            }));
          }
          break;

        default:
          break;
      }
    },
    [currentGuess, gameSettings.wordLength, submitGuess, isCheckingWord]
  );

  return {
    board,
    guesses: guessesList,
    currentRowIndex: guessesList.length,
    submitGuess,
    onType,
    currentGuess,
    isCheckingWord,
  };
};
