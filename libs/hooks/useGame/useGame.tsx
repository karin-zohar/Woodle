import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocalStorage } from "react-use";
import { TILE_STATUS, type UseGameReturn } from "./useGame.type";
import { calculateRowStatus, getKeyboardAction, checkGameStatus } from "./useGame.util";
import { SUBMIT_HANDLERS } from "./useGame.handlers";
import useStore from "@/store/store";
import { useToast, useModal } from "../index";
import dispatchCustomEvent from "@/libs/helpers/dispatchCustomEvent";
import { GAME_EVENTS } from "@/libs/constants/gameEvents";
import {
  getDecodedSolution,
  GUESSES_LOCAL_STORAGE_KEY,
} from "@/store/slices/gameSettings.slice";
import { checkWordIsReal } from "@/api/wordCheckApi";
import { addWordToAllowedList } from "@/libs/data/allowedWords";

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
  
  const [currentGuess, setCurrentGuess] = useState<{ guess: string; isInvalid: boolean }>({
    guess: "",
    isInvalid: false,
  });
  const [isCheckingWord, setIsCheckingWord] = useState(false);
  const isCheckingWordRef = useRef(false);

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
          ? calculateRowStatus(word, solution)
          : [];

        return {
          isInvalid: rowIndex === guessesArray.length && currentGuess.isInvalid,
          isWin: isFinished && word === solution,
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
  }, [guesses, currentGuess, solution, gameSettings.wordLength]);

  const submitGuess = useCallback(
    (overrideGuess?: string) => {
      const guessToSubmit = overrideGuess ?? currentGuess.guess;
      if (guessToSubmit.length !== gameSettings.wordLength) {
        return;
      }
      const nextLength = (guesses?.length || 0) + 1;
      // useLocalStorage from react-use can pass stale prev to functional updater; use current guesses from closure.
      setGuesses([...(guesses || []), guessToSubmit]);
      checkGameStatus(guessToSubmit, solution, gameSettings.wordLength, nextLength);
      setCurrentGuess({ guess: "", isInvalid: false });
    },
    [
      currentGuess.guess,
      solution,
      gameSettings.wordLength,
      guesses,
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
        case "SUBMIT":
          if (result.isValid) {
            submitGuess();
          } else if (result.invalidReason === GAME_EVENTS.SUBMIT_NOT_IN_WORD_LIST) {
            const guess = currentGuess.guess.trim().toLowerCase();
            if (guess.length !== gameSettings.wordLength) {
              dispatchCustomEvent(GAME_EVENTS.SUBMIT_NOT_IN_WORD_LIST);
              setCurrentGuess((prev) => ({ ...prev, isInvalid: true }));
              setTimeout(() => setCurrentGuess((prev) => ({ ...prev, isInvalid: false })), 600);
              break;
            }
            if (isCheckingWordRef.current) {
              break;
            }
            isCheckingWordRef.current = true;
            setIsCheckingWord(true);
            const handleNotInList = () => {
              dispatchCustomEvent(GAME_EVENTS.SUBMIT_NOT_IN_WORD_LIST);
              setCurrentGuess((prev) => ({ ...prev, isInvalid: true }));
              setTimeout(() => setCurrentGuess((prev) => ({ ...prev, isInvalid: false })), 600);
            };
            checkWordIsReal(guess)
              .then((isReal) => {
                if (isReal) {
                  addWordToAllowedList(guess, gameSettings.wordLength);
                  submitGuess(guess);
                } else {
                  handleNotInList();
                }
              })
              .catch(() => handleNotInList())
              .finally(() => {
                isCheckingWordRef.current = false;
                setIsCheckingWord(false);
              });
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
    [currentGuess, gameSettings.wordLength, submitGuess, guesses?.length, isCheckingWord]
  );

  return {
    board,
    guesses: guesses || [],
    currentRowIndex: (guesses?.length ?? 0),
    submitGuess,
    onType,
    currentGuess,
    isCheckingWord,
  };
};
