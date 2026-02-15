/** Trim and lowercase a string for consistent comparison and storage. */
export const normalizeString = (str: string): string => str.trim().toLowerCase();

/** True if the string is non-empty and contains only a–z after trim and lowercase. */
export const isLettersOnly = (str: string): boolean =>
  /^[a-z]+$/.test(normalizeString(str));
