import type { WordLength } from "@/store/slices/gameSettings.slice";
import { isLettersOnly } from "@/libs/helpers/wordValidation";
import allowedWordsJson from "./allowedWords.json";

const allowedWordsByLength = allowedWordsJson as Record<string, string[]>;

const LENGTHS: WordLength[] = [5, 6, 7];

/** Lazy-built Set per length for O(1) membership check. */
const setByLength: Partial<Record<WordLength, Set<string>>> = {};

const getSetForLength = (length: WordLength): Set<string> => {
  let set = setByLength[length];
  if (!set) {
    const list = allowedWordsByLength[String(length)];
    const arr = Array.isArray(list) ? list : [];
    set = new Set(arr);
    setByLength[length] = set;
  }
  return set;
};

export const getAllowedWordsByLength = (): Record<WordLength, string[]> => {
  const out: Record<WordLength, string[]> = { 5: [], 6: [], 7: [] };
  for (const len of LENGTHS) {
    const list = allowedWordsByLength[String(len)];
    out[len as WordLength] = Array.isArray(list) ? [...list] : [];
  }
  return out;
};

export const isWordAllowed = (word: string, length: WordLength): boolean => {
  const normalized = word.trim().toLowerCase();
  return isLettersOnly(normalized) && getSetForLength(length).has(normalized);
};

/** Adds a word to the in-memory allowed list for the given length (e.g. after API confirms it is a real word). */
export const addWordToAllowedList = (word: string, length: WordLength): void => {
  const normalized = word.trim().toLowerCase();
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
  }
};

export const isValidSolution = (word: string, length: WordLength): boolean =>
  isWordAllowed(word, length) && !word.trim().toLowerCase().endsWith("s");

export const getValidSolutionWords = (length: WordLength): string[] => {
  const list = allowedWordsByLength[String(length)];
  if (!Array.isArray(list)) {
    return [];
  }
  return list.filter((w) => isLettersOnly(w) && !w.endsWith("s"));
};
