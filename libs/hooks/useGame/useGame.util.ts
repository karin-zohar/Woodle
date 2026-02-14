import { TILE_STATUS, type ValidationResult } from "./useGame.type";
import { GAME_EVENTS } from "@/libs/constants/gameEvents";
import dispatchCustomEvent from "@/libs/helpers/dispatchCustomEvent";
import { isWordAllowed } from "@/libs/data/allowedWords";
import type { WordLength } from "@/store/slices/gameSettings.slice";

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
