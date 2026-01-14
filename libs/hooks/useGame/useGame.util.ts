import type { TileType, TileRowType } from "./index";
import { TILE_STATUS } from "./useGame.type";

const createEmptyTile = (): TileType => ({ status: "empty" });

export const createEmptyRow = (wordLength: number): TileRowType => ({
  tiles: Array.from({ length: wordLength }, createEmptyTile),
});

export // This sits outside your hook as a "pure" helper function
const calculateRowStatus = (guess: string, solution: string) => {
  const solutionChars = solution.split("");
  const guessChars = guess.split("");

  // Initialize all as 'absent'
  const statuses = new Array(5).fill(TILE_STATUS.ABSENT);

  // Step 1: Find Greens (Correct spot)
  // We do this first so these letters are "taken"
  guessChars.forEach((char, i) => {
    if (char === solutionChars[i]) {
      statuses[i] = TILE_STATUS.CORRECT;
      solutionChars[i] = ""; // Mark as used so it's not counted for yellow
    }
  });

  // Step 2: Find Yellows (Wrong spot)
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
