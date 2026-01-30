import { TILE_STATUS, type ValidationResult } from "./useGame.type";
import { GAME_EVENTS } from '@/libs/constants/gameEvents';

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

// TODO: Replace with a proper word list loaded from a file, grouped by word length
const allowedWordsList = ['trial', 'growl', 'arise']

export const getKeyboardAction = (
  key: string,
  currentGuess: string,
  wordLength: number
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
        : !allowedWordsList.includes(currentGuess)
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
