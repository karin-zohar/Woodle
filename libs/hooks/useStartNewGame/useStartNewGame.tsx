import { useCallback } from "react";
import useStore from "@/store/store";
import { getRandomSolution } from "@/services/solution.service";
import type { WordLength } from "@/store/slices/gameSettings.slice";

const fetchSolutionForLength = async (wordLength: WordLength) => {
  const { solution, definition } = await getRandomSolution(wordLength);
  const trimmed = solution.trim().toLowerCase();
  return { wordLength, solution: trimmed, definition: definition ?? null };
};


/*
 * Hook to start a new game: chooses a solution from the local word list and fetches its definition,
 * then applies it to the store and localStorage.
 * Uses store.isFetchingSolution to prevent concurrent fetches and share loading state across components.
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
