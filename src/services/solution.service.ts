import { getValidSolutionWords } from "@/libs/data/allowedWords";
import type { WordLength } from "@/store/slices/gameSettings.slice";
import { checkWordIsRealAndGetDefinition } from "@/api/wordCheckApi";

/**
 * Selects a random solution word of the given length from the local allowed-words list,
 * and fetches its definition from the Free Dictionary API.
 * Uses the dictionary API only for the definition of the chosen word.
 */
export const getRandomSolution = async (
  length: WordLength
): Promise<{ solution: string; definition: string | null }> => {
  const validWords = getValidSolutionWords(length);
  if (validWords.length === 0) {
    throw new Error(
      `No valid solution words for length ${length} (allowed list may have no words not ending in 's')`
    );
  }
  const solution =
    validWords[Math.floor(Math.random() * validWords.length)];
  try {
    const { definition } = await checkWordIsRealAndGetDefinition(solution);
    return { solution, definition };
  } catch {
    return { solution, definition: null };
  }
};
