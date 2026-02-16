// Returns a string array from stored value; non-strings are filtered out.
export const parseStoredStrings = (value: unknown): string[] => (
  Array.isArray(value) 
  ? (value as unknown[]).filter((value): value is string => typeof value === "string") 
  : []
);
