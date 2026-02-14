const RANDOM_WORD_API_BASE_URL = "https://random-word-api.herokuapp.com";
/** Use ?url= format so we don't send extra query params to the API (avoids 400). */
const CORS_PROXY_PREFIX = "https://corsproxy.io/?url=";
const REQUEST_TIMEOUT_MS = 15_000;

/** Fallback words when the API is unreachable (e.g. CORS, Heroku sleep, network). */
const FALLBACK_WORDS: Record<number, string[]> = {
  5: ["apple", "bread", "crane", "draft", "earth", "flame", "grape", "heart", "ideal", "jelly"],
  6: ["anchor", "bright", "castle", "dragon", "engine", "forest", "garden", "harbor", "island", "jungle"],
  7: ["ancient", "battery", "capture", "diamond", "evening", "fortune", "gallery", "harvest", "instant", "journey"],
};

const parseAndValidateWord = (data: unknown, length: number): string => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Invalid response: expected non-empty array");
  }
  const word = data[0];
  if (typeof word !== "string") {
    throw new Error(`Invalid response: expected string, got ${typeof word}`);
  }
  const trimmed = word.trim().toLowerCase();
  if (trimmed.length !== length) {
    throw new Error(
      `Invalid word length: expected ${length}, got ${trimmed.length} (word: ${trimmed})`
    );
  }
  return trimmed;
};

const getFallbackWord = (length: number): string => {
  const list = FALLBACK_WORDS[length];
  if (!list) {
    throw new Error(`No fallback words for length ${length}`);
  }
  return list[Math.floor(Math.random() * list.length)];
};

const getWordApiUrl = (length: number): string =>
  `${RANDOM_WORD_API_BASE_URL}/word?length=${length}`;

/**
 * Fetches via CORS proxy when direct request fails (e.g. Heroku CORS or sleeping dyno).
 * Uses ?url=ENCODED_TARGET only (no extra params) so the API does not receive 400.
 */
const fetchViaProxy = async (length: number): Promise<string> => {
  const targetUrl = getWordApiUrl(length);
  const proxyUrl = CORS_PROXY_PREFIX + encodeURIComponent(targetUrl);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(proxyUrl, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      throw new Error(`Proxy request failed: ${response.status} ${response.statusText}`);
    }
    const text = await response.text();
    const data = JSON.parse(text) as unknown;
    return parseAndValidateWord(data, length);
  } catch (err) {
    clearTimeout(timeoutId);
    if (import.meta.env.DEV) {
      console.error("[randomWordApi] Proxy fetch failed:", err);
    }
    throw err;
  }
};

/**
 * Direct fetch with no extra headers (some APIs return 400 for GET + Content-Type: application/json).
 */
const fetchDirect = async (length: number): Promise<string> => {
  const url = getWordApiUrl(length);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      // No Content-Type so the API does not reject the request
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Request failed: ${response.status} ${text}`);
    }
    const data = (await response.json()) as unknown;
    return parseAndValidateWord(data, length);
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
};

/**
 * Fetches a single random word of the given length from random-word-api.
 * Tries: (1) direct request, (2) CORS proxy, (3) static fallback list.
 */
export const fetchRandomWord = async (length: number): Promise<string> => {
  try {
    return await fetchDirect(length);
  } catch (directErr) {
    if (import.meta.env.DEV) {
      console.error("[randomWordApi] Direct fetch failed:", directErr);
    }
    try {
      return await fetchViaProxy(length);
    } catch (proxyErr) {
      if (import.meta.env.DEV) {
        console.error("[randomWordApi] Proxy fetch failed, using fallback words:", proxyErr);
      }
      return getFallbackWord(length);
    }
  }
};
