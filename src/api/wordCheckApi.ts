import { fetchViaProxy } from "./corsProxy";
import { isLettersOnly } from "@/libs/helpers/wordValidation";

const DICTIONARY_API_BASE = "https://api.dictionaryapi.dev/api/v2/entries/en";
const REQUEST_TIMEOUT_MS = 10_000;

/**
 * Checks if a word is a real English word using the Free Dictionary API.
 * Uses exact spelling; word is normalized (trim, lowercase) before the request.
 * Returns false if the word contains non–a–z characters (e.g. spaces, dashes).
 * 200 = word has an entry (real word), 404 or error = not considered real.
 */
export const checkWordIsReal = async (word: string): Promise<boolean> => {
  const normalized = word.trim().toLowerCase();
  if (!normalized || !isLettersOnly(normalized)) {
    return false;
  }

  const targetUrl = `${DICTIONARY_API_BASE}/${encodeURIComponent(normalized)}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetchViaProxy(targetUrl, {
      method: "GET",
      signal: controller.signal,
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
};

/** Response shape from Free Dictionary API (entries[].meanings[].definitions[].definition). */
interface DictionaryEntry {
  meanings?: Array<{
    definitions?: Array<{ definition?: string }>;
  }>;
}

export type WordValidationResult = {
  isReal: boolean;
  definition: string | null;
};

/**
 * Validates a word via the Free Dictionary API and returns the first definition when the word exists.
 * Use when you need both validation and definition in one call (e.g. when picking a solution).
 */
export const checkWordIsRealAndGetDefinition = async (
  word: string
): Promise<WordValidationResult> => {
  const normalized = word.trim().toLowerCase();
  if (!normalized || !isLettersOnly(normalized)) {
    return { isReal: false, definition: null };
  }

  const targetUrl = `${DICTIONARY_API_BASE}/${encodeURIComponent(normalized)}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetchViaProxy(targetUrl, {
      method: "GET",
      signal: controller.signal,
    });
    if (!response.ok) {
      return { isReal: false, definition: null };
    }
    const data = (await response.json()) as DictionaryEntry[] | undefined;
    const definition = data?.[0]?.meanings?.[0]?.definitions?.[0]?.definition;
    const trimmed = typeof definition === "string" ? definition.trim() : "";
    return {
      isReal: true,
      definition: trimmed || null,
    };
  } catch {
    return { isReal: false, definition: null };
  } finally {
    clearTimeout(timeoutId);
  }
};
