import { TILE_STATUS, type ValidationResult } from "./useGame.type";
import type { ToastType } from '../useToast/useToast';
import { GAME_EVENTS } from '@/libs/constants/gameEvents';

export type SubmitHandler = (
  showToast: (type: ToastType, text: string) => void,
  event: CustomEvent
) => void;

export const SUBMIT_HANDLERS: Record<string, SubmitHandler> = {
  [GAME_EVENTS.SUBMIT_NOT_ENOUGH_LETTERS]: (showToast) =>
    showToast('info', 'Not enough letters'),
  [GAME_EVENTS.SUBMIT_NOT_IN_WORD_LIST]: (showToast) =>
    showToast('info', 'Not in word list'),
  [GAME_EVENTS.SUBMIT_UNKNOWN_ERROR]: (showToast) =>
    showToast('error', 'Something went wrong'),
  [GAME_EVENTS.GAME_OVER_WON]: (showToast, event) => {
    const guessesLength = event.detail as number;
    const messages = [
      'Genius',
      'Magnificent',
      'Impressive',
      'Splendid',
      'Great',
      'Phew',
    ];
    showToast('info', messages[guessesLength - 1] ?? 'Game Over');
  },
  [GAME_EVENTS.GAME_OVER_LOST]: (showToast, event) => {
    const solution = event.detail as string;
    showToast('info', solution);
  },
};

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
