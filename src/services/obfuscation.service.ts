import CryptoJS from "crypto-js";

const ENCODED_PREFIX = "v2:";
/** Key for obfuscation only; not for real security (lives in client bundle). */
const KEY = "woodle-solution-obfuscation";

export const encode = (plain: string): string => {
  if (!plain || plain.trim() === "") {
    return "";
  }
  try {
    const ciphertext = CryptoJS.AES.encrypt(plain, KEY).toString();
    return ENCODED_PREFIX + ciphertext;
  } catch {
    return "";
  }
};

export const decode = (stored: string): string => {
  if (!stored || stored.trim() === "") {
    return "";
  }
  if (!stored.startsWith(ENCODED_PREFIX)) {
    return stored;
  }
  try {
    const ciphertext = stored.slice(ENCODED_PREFIX.length);
    const bytes = CryptoJS.AES.decrypt(ciphertext, KEY);
    const plain = bytes.toString(CryptoJS.enc.Utf8);
    return plain || "";
  } catch {
    return "";
  }
};
