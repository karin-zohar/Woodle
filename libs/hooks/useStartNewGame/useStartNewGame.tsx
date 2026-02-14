import { useMutation } from "@tanstack/react-query";
import useStore from "@/store/store";
import { fetchRandomWord } from "@/api/randomWordApi";
import type { WordLength } from "@/store/slices/gameSettings.slice";

/** Fetches a random word for the given length and returns it with the length for the store. */
const fetchSolutionForLength = async (wordLength: WordLength) => {
  const solution = await fetchRandomWord(wordLength);
  return { wordLength, solution };
};

/**
 * Hook to start a new game: fetches a solution for the given word length, then applies it to the store.
 * Use when the user clicks "Play", "New Game", or changes word length (after confirm).
 */
export const useStartNewGame = () => {
  const applyNewGame = useStore((state) => state.applyNewGame);

  const mutation = useMutation({
    mutationFn: fetchSolutionForLength,
    onSuccess: ({ wordLength, solution }) => {
      applyNewGame(wordLength, solution);
    },
  });

  const startNewGame = (wordLength: WordLength) => mutation.mutateAsync(wordLength);

  return {
    startNewGame,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};
