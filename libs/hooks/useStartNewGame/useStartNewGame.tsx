import { useCallback } from "react";
import useStore from "@/store/store";
import { fetchRandomWord } from "@/api/randomWordApi";
import type { WordLength } from "@/store/slices/gameSettings.slice";

const MAX_FETCH_ATTEMPTS = 3;

const isValidSolution = (solution: string, wordLength: WordLength): boolean =>
  typeof solution === "string" &&
  solution.trim().toLowerCase().length === wordLength;

const fetchSolutionForLength = async (wordLength: WordLength) => {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_FETCH_ATTEMPTS; attempt++) {
    try {
      const { solution, definition } = await fetchRandomWord(wordLength);
      if (isValidSolution(solution, wordLength)) {
        const trimmed = solution.trim().toLowerCase();
        return { wordLength, solution: trimmed, definition: definition ?? null };
      }
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError ?? new Error("Failed to get a valid solution");
};

/**
 * Hook to start a new game: fetches a solution for the given word length, then applies it to the store (and localStorage).
 * Uses store.isFetchingSolution so isPending is shared and prevents double-fetch (e.g. React Strict Mode).
 */
export const useStartNewGame = () => {
  const applyNewGame = useStore((state) => state.applyNewGame);
  const isFetchingSolution = useStore((state) => state.isFetchingSolution);
  const setFetchingSolution = useStore((state) => state.setFetchingSolution);

  const startNewGame = useCallback(
    (wordLength: WordLength) => {
      if (isFetchingSolution) {
        return Promise.reject(new Error("Already fetching"));
      }
      setFetchingSolution(true);
      return fetchSolutionForLength(wordLength)
        .then((result) => {
          applyNewGame(result.wordLength, result.solution, result.definition);
        })
        .finally(() => {
          setFetchingSolution(false);
        });
    },
    [applyNewGame, isFetchingSolution, setFetchingSolution]
  );

  return {
    startNewGame,
    isPending: isFetchingSolution,
    isError: false,
    error: null,
  };
};
