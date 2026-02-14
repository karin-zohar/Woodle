/**
 * Remove duplicate words from libs/data/allowedWords.json (per length).
 * Also removes words that contain a space or any non–letter character (only a–z allowed).
 * Run: node scripts/dedupeAllowedWords.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, "..", "libs", "data", "allowedWords.json");

/** Keep only words that are purely letters (a–z), no spaces or other chars. */
const onlyLetters = /^[a-z]+$/;

const raw = fs.readFileSync(dataPath, "utf8");
const data = JSON.parse(raw);

const out = {};
for (const [key, words] of Object.entries(data)) {
  if (!Array.isArray(words)) {
    out[key] = words;
    continue;
  }
  const seen = new Set();
  out[key] = words.filter((w) => {
    const normalized = typeof w === "string" ? w.trim().toLowerCase() : String(w);
    if (!onlyLetters.test(normalized)) return false;
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

fs.writeFileSync(dataPath, JSON.stringify(out, null, 2), "utf8");
console.log("Deduplicated allowedWords.json");
for (const [key, arr] of Object.entries(out)) {
  if (Array.isArray(arr)) console.log(`  ${key}: ${arr.length} words`);
}
