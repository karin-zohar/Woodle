/** True if the string is non-empty and contains only a–z after trim and lowercase. */
export const isLettersOnly = (word: string): boolean =>
  /^[a-z]+$/.test(word.trim().toLowerCase());
