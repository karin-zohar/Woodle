/**
 * Allowed guess words and solution words by word length.
 * Supports in-memory additions (e.g. after API confirms a word) and O(1) membership checks.
 * Runtime additions are persisted to localStorage and merged at load.
 * Word lengths are driven by WORD_LENGTHS in gameSettings.slice.
 */
import { WORD_LENGTHS, type WordLength } from "@/store/slices/gameSettings.slice";
import { isLettersOnly, normalizeString } from "@/libs/helpers/wordValidation";
import { parseStoredStrings } from "@/libs/helpers/localStorage";
import allowedWordsJson from "./allowedWords.json";

const ALLOWED_WORDS_ADDITIONS_KEY = "woodle-allowed-words-additions";

// Merges persisted additions from localStorage into the given map (mutates it). 
const mergePersistedAdditions = (wordsByLength: Record<string, string[]>): void => {
  try {
    const rawAdditions = localStorage.getItem(ALLOWED_WORDS_ADDITIONS_KEY);
    if (!rawAdditions) {
      return;
    }
    const parsed = JSON.parse(rawAdditions) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") {
      return;
    }
    Object.entries(parsed).forEach(([wordLengthKey, addedWords]) => {
      if (!Array.isArray(addedWords)) {
        return;
      }
      const list = wordsByLength[wordLengthKey];
      if (!Array.isArray(list)) {
        return;
      }
      parseStoredStrings(addedWords).forEach((word) => {
        const normalized = normalizeString(word);
        if (normalized && !list.includes(normalized)) {
          list.push(normalized);
        }
      });
    });
  } catch (e) {
    // Corrupted or missing storage: ignore and use only bundled data.
    console.error("Failed to merge persisted word additions:", e);
  }
};

// Lazy-built map of allowed words by length.
// Runs on module load. 
const allowedWordsByLength = ((): Record<string, string[]> => {
  // Deep copy to avoid mutating the imported JSON
  const wordsByLength = structuredClone(allowedWordsJson) as Record<string, string[]>;
  mergePersistedAdditions(wordsByLength);
  return wordsByLength;
})();

// Lazy-built Set per length for O(1) membership check.
const setByLength: Partial<Record<WordLength, Set<string>>> = {};

const getSetForLength = (length: WordLength): Set<string> => {
  let set = setByLength[length];
  if (!set) {
    const list = allowedWordsByLength[String(length)];
    const listArray = Array.isArray(list) ? list : [];
    set = new Set(listArray);
    setByLength[length] = set;
  }
  return set;
};

export const isWordAllowed = (word: string, length: WordLength): boolean => {
  const normalized = normalizeString(word);
  return isLettersOnly(normalized) && getSetForLength(length).has(normalized);
};

const persistAddition = (targetLength: WordLength, word: string): void => {
  try {
    const raw = localStorage.getItem(ALLOWED_WORDS_ADDITIONS_KEY);
    const parsed: Record<string, unknown> = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    const additionsForLength = parseStoredStrings(parsed[String(targetLength)]);
    if (additionsForLength.includes(word)) {
      return;
    }
    additionsForLength.push(word);
    
    const toSave: Record<string, string[]> = Object.fromEntries(
      WORD_LENGTHS.map((currentLength) => [
        // key
        String(currentLength),
        // value
        currentLength === targetLength 
        ? additionsForLength :
         parseStoredStrings(parsed[String(currentLength)]),
      ])
    );

    localStorage.setItem(ALLOWED_WORDS_ADDITIONS_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error("Failed to persist allowed-word addition:", e);
  }
};

// Adds a word to the in-memory allowed list for the given length (after API confirms it is a real word). 
// Persists to localStorage.
export const addWordToAllowedList = (word: string, length: WordLength): void => {
  const normalized = normalizeString(word);
  if (!isLettersOnly(normalized) || normalized.length !== length) {
    return;
  }
  const set = getSetForLength(length);
  if (set.has(normalized)) {
    return;
  }
  set.add(normalized);
  const list = allowedWordsByLength[String(length)];
  if (Array.isArray(list) && !list.includes(normalized)) {
    list.push(normalized);
    persistAddition(length, normalized);
  }
};


// Allowed words for the given length that qualify as solutions (letters only), normalized to lowercase.
export const getValidSolutionWords = (length: WordLength): string[] => {
  const list = allowedWordsByLength[String(length)];
  if (!Array.isArray(list)) {
    return [];
  }
  return list
    .filter((word) => isLettersOnly(word))
    .map((word) => normalizeString(word));
};
