/**
 * Allowed guess words and solution words by word length.
 * Supports in-memory additions (e.g. after API confirms a word) and O(1) membership checks.
 * Runtime additions are persisted to localStorage and merged at load.
 * Word lengths are driven by WORD_LENGTHS in gameSettings.slice.
 */
import { WORD_LENGTHS, type WordLength } from "@/store/slices/gameSettings.slice";
import { isLettersOnly, normalizeString } from "@/libs/helpers/wordValidation";
import allowedWordsJson from "./allowedWords.json";

const ALLOWED_WORDS_ADDITIONS_KEY = "woodle-allowed-words-additions";

/** Merges persisted additions from localStorage into the given map (mutates it). */
const mergePersistedAdditions = (out: Record<string, string[]>): void => {
  try {
    const raw = localStorage.getItem(ALLOWED_WORDS_ADDITIONS_KEY);
    if (!raw) {
      return;
    }
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") {
      return;
    }
    WORD_LENGTHS.forEach((len) => {
      const key = String(len);
      const added = parsed[key];
      if (!Array.isArray(added)) {
        return;
      }
      const list = out[key];
      parseStoredStrings(added).forEach((w) => {
        const norm = normalizeString(w);
        if (norm && !list.includes(norm)) {
          list.push(norm);
        }
      });
    });
  } catch {
    // Corrupted or missing storage: ignore and use only bundled data.
  }
};

/** Returns a string array from stored value; non-strings are filtered out. */
const parseStoredStrings = (value: unknown): string[] =>
  Array.isArray(value) ? (value as unknown[]).filter((w): w is string => typeof w === "string") : [];

const allowedWordsByLength = ((): Record<string, string[]> => {
  const json = allowedWordsJson as Record<string, string[]>;
  const out = Object.fromEntries(
    WORD_LENGTHS.map((len) => {
      const key = String(len);
      const arr = json[key];
      return [key, Array.isArray(arr) ? [...arr] : []];
    })
  ) as Record<string, string[]>;
  mergePersistedAdditions(out);
  return out;
})();

/** Lazy-built Set per length for O(1) membership check. */
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

const persistAddition = (length: WordLength, word: string): void => {
  try {
    const raw = localStorage.getItem(ALLOWED_WORDS_ADDITIONS_KEY);
    const parsed: Record<string, unknown> = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    const additionsForLength = parseStoredStrings(parsed[String(length)]);
    if (additionsForLength.includes(word)) {
      return;
    }
    additionsForLength.push(word);
    const toSave: Record<string, string[]> = Object.fromEntries(
      WORD_LENGTHS.map((len) => [
        String(len),
        len === length ? additionsForLength : parseStoredStrings(parsed[String(len)]),
      ])
    );
    localStorage.setItem(ALLOWED_WORDS_ADDITIONS_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error("Failed to persist allowed-word addition:", e);
  }
};

/** Adds a word to the in-memory allowed list for the given length (e.g. after API confirms it is a real word). Persists to localStorage. */
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

/** True if the word ends in "s" (used to exclude plurals from solution words). */
const endsWithS = (word: string): boolean => word.endsWith("s");

/**
 * Allowed words for the given length that qualify as solutions (letters only, do not end in "s"), normalized to lowercase.
 */
export const getValidSolutionWords = (length: WordLength): string[] => {
  const list = allowedWordsByLength[String(length)];
  if (!Array.isArray(list)) {
    return [];
  }
  return list
    .filter((w) => isLettersOnly(w) && !endsWithS(w))
    .map((w) => normalizeString(w));
};
