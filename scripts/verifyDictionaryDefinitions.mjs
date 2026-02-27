/**
 * Removes from allowedWords.json any word that does not have a definition on the Free Dictionary API.
 * Only words that return 200 and have at least one definition are kept.
 * Run: node scripts/verifyDictionaryDefinitions.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DICTIONARY_API_BASE = "https://api.dictionaryapi.dev/api/v2/entries/en";
const DELAY_MS = 250; // avoid rate limiting

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Returns true if the word has at least one definition on the API.
 */
async function wordHasDefinition(word) {
  const normalized = word.trim().toLowerCase();
  if (!normalized) return false;

  const url = `${DICTIONARY_API_BASE}/${encodeURIComponent(normalized)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) return false;

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return false;
    const entry = data[0];
    const meanings = entry?.meanings;
    if (!Array.isArray(meanings) || meanings.length === 0) return false;
    const definitions = meanings[0]?.definitions;
    if (!Array.isArray(definitions) || definitions.length === 0) return false;
    const definition = definitions[0]?.definition;
    return typeof definition === "string" && definition.trim().length > 0;
  } catch {
    return false;
  }
}

async function main() {
  const dataPath = path.join(__dirname, "..", "libs", "data", "allowedWords.json");
  const raw = fs.readFileSync(dataPath, "utf8");
  const data = JSON.parse(raw);

  const result = {};
  const removed = {};
  let totalChecked = 0;
  let totalRemoved = 0;

  for (const len of ["5", "6", "7"]) {
    const words = data[len];
    if (!Array.isArray(words)) {
      result[len] = [];
      continue;
    }
    result[len] = [];
    removed[len] = [];
    console.log(`\nChecking ${words.length} words of length ${len}...`);

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      totalChecked++;
      const hasDef = await wordHasDefinition(word);
      if (hasDef) {
        result[len].push(word);
      } else {
        removed[len].push(word);
        totalRemoved++;
      }
      if ((i + 1) % 50 === 0) {
        console.log(`  ${i + 1}/${words.length} checked`);
      }
      await sleep(DELAY_MS);
    }

    console.log(`  Length ${len}: kept ${result[len].length}, removed ${removed[len].length}`);
    // Save after each length so partial progress is not lost (e.g. if rate-limited)
    const merged = {};
    for (const k of ["5", "6", "7"]) {
      merged[k] = result[k] !== undefined ? result[k] : data[k];
    }
    fs.writeFileSync(dataPath, JSON.stringify(merged, null, 2), "utf8");
    console.log(`  Saved progress to ${dataPath}`);
  }

  console.log(`\nTotal: ${totalChecked} checked, ${totalRemoved} removed (no definition).`);

  // Write only words that have definitions; words without definitions are removed
  const filtered = {};
  for (const k of ["5", "6", "7"]) {
    filtered[k] = result[k] ?? [];
  }
  fs.writeFileSync(dataPath, JSON.stringify(filtered, null, 2), "utf8");
  console.log(`Written ${dataPath} with only words that have definitions (${totalRemoved} removed).`);

  if (totalRemoved > 0) {
    const removedPath = path.join(__dirname, "..", "libs", "data", "removedWords.no-definition.json");
    fs.writeFileSync(removedPath, JSON.stringify(removed, null, 2), "utf8");
    console.log(`Removed words list saved to ${removedPath}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
