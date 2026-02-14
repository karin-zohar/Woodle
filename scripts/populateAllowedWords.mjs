/**
 * One-time script: fetch ~1000 common English words per length (5, 6, 7) from Datamuse API
 * and write libs/data/allowedWords.json. Run: node scripts/populateAllowedWords.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATAMUSE_URL = "https://api.datamuse.com/words";
const LENGTHS = [5, 6, 7];
const MAX_WORDS_PER_LENGTH = 1000;

const patternForLength = (len) => "?".repeat(len);

const fetchWordsForLength = async (length) => {
  const pattern = patternForLength(length);
  const url = `${DATAMUSE_URL}?sp=${pattern}&md=f&max=${MAX_WORDS_PER_LENGTH}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Datamuse failed: ${res.status} ${res.statusText}`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("Datamuse: expected array");
  const words = [];
  const seen = new Set();
  for (const item of data) {
    const w = item?.word;
    if (typeof w !== "string") continue;
    const normalized = w.trim().toLowerCase();
    if (normalized.length !== length) continue;
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    words.push(normalized);
    if (words.length >= MAX_WORDS_PER_LENGTH) break;
  }
  return words;
};

const main = async () => {
  const out = { "5": [], "6": [], "7": [] };
  for (const len of LENGTHS) {
    const words = await fetchWordsForLength(len);
    out[String(len)] = words;
    console.log(`Length ${len}: ${words.length} words`);
  }
  const targetPath = path.join(__dirname, "..", "libs", "data", "allowedWords.json");
  fs.writeFileSync(targetPath, JSON.stringify(out, null, 2), "utf8");
  console.log(`Wrote ${targetPath}`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
