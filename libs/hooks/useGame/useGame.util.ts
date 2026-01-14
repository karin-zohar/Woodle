import { TILE_STATUS } from "./useGame.type";

export const calculateRowStatus = (guess: string, solution: string) => {
  const solutionChars = solution.split("");
  const guessChars = guess.split("");

  // Default status: absent
  const statuses = new Array(5).fill(TILE_STATUS.ABSENT);

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
