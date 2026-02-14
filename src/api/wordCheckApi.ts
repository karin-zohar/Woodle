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
