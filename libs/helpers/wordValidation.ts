export const normalizeString = (str: string): string => str.trim().toLowerCase();

export const isLettersOnly = (str: string): boolean =>
  /^[a-z]+$/.test(normalizeString(str));
