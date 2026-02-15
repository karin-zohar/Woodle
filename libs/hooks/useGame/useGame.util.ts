import {
  TILE_STATUS,
  type CurrentGuessState,
  type SetCurrentGuess,
  type TileRowType,
  type TryAddWordAndSubmitOptions,
  type ValidationResult,
} from "./useGame.type";
import { GAME_EVENTS } from "@/libs/constants/gameEvents";
import dispatchCustomEvent from "@/libs/helpers/dispatchCustomEvent";
import { addWordToAllowedList, isWordAllowed } from "@/libs/data/allowedWords";
import type { WordLength } from "@/store/slices/gameSettings.slice";
import { checkWordIsReal } from "@/api/wordCheckApi";

const INVALID_GUESS_RESET_MS = 600;

export const calculateRowStatus = (guess: string, solution: string) => {
  const solutionChars = solution.split("");
  const guessChars = guess.split("");
  // Default status: absent
  const statuses = new Array(guess.length).fill(TILE_STATUS.ABSENT);
  
  guessChars.forEach((char, i) => {
    if (char === solutionChars[i]) {
      statuses[i] = TILE_STATUS.CORRECT;
      solutionChars[i] = ""; // Mark as used so it's not counted for yellow
    }
  });

  guessChars.forEach((char, i) => {
    if (statuses[i] !== TILE_STATUS.CORRECT && solutionChars.includes(char)) {
      statuses[i] = TILE_STATUS.PRESENT;
      // Remove only ONE instance of the letter from the solution pool
      const indexInSolution = solutionChars.indexOf(char);
      solutionChars[indexInSolution] = "";
    }
  });

  return statuses;
};

export const getKeyboardAction = (
  key: string,
  currentGuess: string,
  wordLength: WordLength
): ValidationResult => {
  if (key === "Enter") {
    if (currentGuess.length === 0) {
      return {
        action: "IGNORE"
      }
    }
    const invalidReason =
      currentGuess.length !== wordLength
        ? GAME_EVENTS.SUBMIT_NOT_ENOUGH_LETTERS
        : !isWordAllowed(currentGuess, wordLength)
          ? GAME_EVENTS.SUBMIT_NOT_IN_WORD_LIST
          : undefined;

    return {
      action: "SUBMIT",
      isValid: invalidReason === undefined,
      ...(invalidReason && { invalidReason }),
    };
  }

  if (/^[a-zA-Z]$/.test(key)) {
    return {
      action: "TYPE",
      isValid: currentGuess.length < wordLength,
    };
  }

  return { action: "IGNORE" };
};

export const checkGameStatus = (
  guess: string,
  solution: string,
  wordLength: WordLength,
  guessesCountAfterSubmit: number
): void => {
  if (guess === solution) {
    dispatchCustomEvent(GAME_EVENTS.GAME_OVER_WON, guessesCountAfterSubmit);
  } else if (guessesCountAfterSubmit > wordLength) {
    dispatchCustomEvent(GAME_EVENTS.GAME_OVER_LOST, solution);
  }
};

/**
 * Dispatches an optional game event, marks the current guess as invalid,
 * then clears the invalid state after a short delay.
 */
export const showInvalidGuessAndClear = (
  setCurrentGuess: SetCurrentGuess,
  eventName?: string
): void => {
  if (eventName) {
    dispatchCustomEvent(eventName);
  }
  setCurrentGuess((prev) => ({ ...prev, isInvalid: true }));
  setTimeout(() => {
    setCurrentGuess((prev) => ({ ...prev, isInvalid: false }));
  }, INVALID_GUESS_RESET_MS);
};

/**
 * Checks if the guess is a real word via API. If so, adds it to the allowed list
 * and submits. Otherwise calls onNotInList (e.g. show "not in word list").
 */
export const tryAddWordAndSubmit = (
  guess: string,
  wordLength: WordLength,
  submitGuess: (overrideGuess?: string) => void,
  options: TryAddWordAndSubmitOptions
): void => {
  const { isCheckingWordRef, setIsCheckingWord, onNotInList } = options;
  if (isCheckingWordRef.current) {
    return;
  }
  isCheckingWordRef.current = true;
  setIsCheckingWord(true);
  checkWordIsReal(guess)
    .then((isReal) => {
      if (isReal) {
        addWordToAllowedList(guess, wordLength);
        submitGuess(guess);
      } else {
        onNotInList();
      }
    })
    .catch(() => {
      onNotInList();
    })
    .finally(() => {
      isCheckingWordRef.current = false;
      setIsCheckingWord(false);
    });
};

/**
 * Builds the board rows from guesses, current typing row, solution, and word length.
 */
export const buildBoard = (
  guesses: string[],
  currentGuess: CurrentGuessState,
  solution: string,
  wordLength: WordLength
): TileRowType[] => {
  return Array.from({ length: wordLength + 1 }).map((_, rowIndex) => {
    const word =
      guesses[rowIndex] ??
      (rowIndex === guesses.length ? currentGuess.guess : "");
    const isFinished = rowIndex < guesses.length;
    const rowStatuses = isFinished ? calculateRowStatus(word, solution) : [];

    return {
      isInvalid: rowIndex === guesses.length && currentGuess.isInvalid,
      isWin: isFinished && word === solution,
      tiles: word
        .padEnd(wordLength, " ")
        .split("")
        .map((char, charIndex) => ({
          content: char.trim(),
          status: isFinished ? rowStatuses[charIndex] : TILE_STATUS.EDITING,
        })),
    };
  });
};
