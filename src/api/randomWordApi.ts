import {
  isWordAllowed,
  getValidSolutionWords,
  addWordToAllowedList,
} from "@/libs/data/allowedWords";
import { isLettersOnly } from "@/libs/helpers/wordValidation";
import type { WordLength } from "@/store/slices/gameSettings.slice";
import { checkWordIsReal } from "@/api/wordCheckApi";
import { fetchViaProxy } from "@/api/corsProxy";

const RANDOM_WORD_API_BASE_URL = "https://random-word-api.herokuapp.com";
const REQUEST_TIMEOUT_MS = 15_000;
const BATCH_SIZE = 5;
const MAX_BATCHES_BEFORE_FALLBACK = 20;

/** Fallback words when the API is unreachable (e.g. CORS, Heroku sleep, network). */
const FALLBACK_WORDS: Record<number, string[]> = {
  5: ["apple", "bread", "crane", "draft", "earth", "flame", "grape", "heart", "ideal", "jelly"],
  6: ["anchor", "bright", "castle", "dragon", "engine", "forest", "garden", "harbor", "island", "jungle"],
  7: ["ancient", "battery", "capture", "diamond", "evening", "fortune", "gallery", "harvest", "instant", "journey"],
};

const parseAndValidateWords = (data: unknown, length: number): string[] => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Invalid response: expected non-empty array");
  }
  const out: string[] = [];
  for (const item of data) {
    if (typeof item !== "string") {
      continue;
    }
    const trimmed = item.trim().toLowerCase();
    if (trimmed.length !== length || !isLettersOnly(trimmed)) {
      continue;
    }
    out.push(trimmed);
  }
  return out;
};

const getFallbackBatch = (length: number, count: number): string[] => {
  const list = FALLBACK_WORDS[length];
  if (!list) {
    throw new Error(`No fallback words for length ${length}`);
  }
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    out.push(list[Math.floor(Math.random() * list.length)]);
  }
  return out;
};

const getWordApiUrl = (length: number, count?: number): string => {
  const base = `${RANDOM_WORD_API_BASE_URL}/word?length=${length}`;
  if (count != null && count > 0) {
    return `${base}&number=${count}`;
  }
  return base;
};

const fetchViaProxyBatch = async (
  length: number,
  count: number
): Promise<string[]> => {
  const targetUrl = getWordApiUrl(length, count);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetchViaProxy(targetUrl, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      throw new Error(`Proxy request failed: ${response.status} ${response.statusText}`);
    }
    const text = await response.text();
    const data = JSON.parse(text) as unknown;
    return parseAndValidateWords(data, length);
  } catch (err) {
    clearTimeout(timeoutId);
    if (import.meta.env.DEV) {
      console.error("[randomWordApi] Proxy fetch failed:", err);
    }
    throw err;
  }
};

const fetchDirectBatch = async (
  length: number,
  count: number
): Promise<string[]> => {
  const url = getWordApiUrl(length, count);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Request failed: ${response.status} ${text}`);
    }
    const data = (await response.json()) as unknown;
    return parseAndValidateWords(data, length);
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
};

/** Fetches exactly BATCH_SIZE (5) candidate words in a single request. */
const fetchBatch = async (length: number): Promise<string[]> => {
  const count = BATCH_SIZE;
  try {
    return await fetchDirectBatch(length, count);
  } catch (directErr) {
    if (import.meta.env.DEV) {
      console.error("[randomWordApi] Direct fetch failed:", directErr);
    }
    try {
      return await fetchViaProxyBatch(length, count);
    } catch (proxyErr) {
      if (import.meta.env.DEV) {
        console.error("[randomWordApi] Proxy fetch failed, using fallback words:", proxyErr);
      }
      return getFallbackBatch(length, count);
    }
  }
};

/**
 * Returns the first candidate from the batch that is a valid solution.
 * Per-word flow: reject if ends in "s"; if in allowed list use it; if not, validate via API;
 * if not real fetch new (try next); if real add to session allowed list and set as solution.
 */
const findValidSolutionFromBatch = async (
  batch: string[],
  length: WordLength
): Promise<string | null> => {
  for (const word of batch) {
    if (!isLettersOnly(word) || word.endsWith("s")) {
      continue;
    }
    if (isWordAllowed(word, length)) {
      return word;
    }
    // Not in allowed list: validate via API (check if real word).
    const isReal = await checkWordIsReal(word);
    if (!isReal) {
      continue; // Not a real word — fetch new (try next in batch).
    }
    // Real word: add to session allowed words list and set as solution.
    addWordToAllowedList(word, length);
    return word;
  }
  return null;
};

/**
 * Fetches a random word of the given length that is a valid solution.
 * - Fetches 5 candidates at a time (one batch request). Processes all 5; only fetches a new batch if none are valid.
 * - Valid = does not end in "s", and either in allowed list or confirmed real via API (then added to allowed list).
 * - Fallback: random from getValidSolutionWords(length) if no batch yields a valid solution.
 */
export const fetchRandomWord = async (length: WordLength): Promise<string> => {
  for (let batchCount = 0; batchCount < MAX_BATCHES_BEFORE_FALLBACK; batchCount++) {
    const batch = await fetchBatch(length); // single request for 5 words
    const solution = await findValidSolutionFromBatch(batch, length);
    if (solution !== null) {
      return solution;
    }
    // No valid solution in this batch — fetch next batch only now
  }
  const validWords = getValidSolutionWords(length);
  if (validWords.length === 0) {
    throw new Error(`No valid solution words for length ${length} (allowed list may have no words not ending in 's')`);
  }
  return validWords[Math.floor(Math.random() * validWords.length)];
};
