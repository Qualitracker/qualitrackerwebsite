// Lists every Swahili string on the site in one markdown table so a fluent
// reviewer can correct them in one pass. Finds every inline
// tr('English', 'Kiswahili') call and every { en: '...', sw: '...' } pair under src/.
// Usage: node scripts/export-swahili.mjs > swahili-review.md
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = join(ROOT, 'src');
const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? (f === 'test' ? [] : walk(p)) : /\.tsx?$/.test(f) ? [p] : [];
});
const unq = (s) => s.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\n/g, ' ');
const esc = (s) => unq(s).replace(/\|/g, '/');
const str = String.raw`('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|` + '`(?:[^`\\\\]|\\\\.)*`)';
const rows = [];
for (const file of walk(SRC)) {
  const text = readFileSync(file, 'utf8');
  const rel = relative(ROOT, file);
  for (const m of text.matchAll(new RegExp(String.raw`\b(?:tr|L)\(\s*${str}\s*,\s*${str}\s*\)`, 'g'))) {
    rows.push([rel, m[1].slice(1, -1), m[2].slice(1, -1)]);
  }
  for (const m of text.matchAll(new RegExp(String.raw`\ben:\s*${str},\s*sw:\s*${str}`, 'g'))) {
    rows.push([rel, m[1].slice(1, -1), m[2].slice(1, -1)]);
  }
}
console.log('# Swahili copy for review\n');
console.log('First draft, not yet reviewed by a fluent speaker. Correct the Kiswahili column, then send it back or edit the matching `tr(...)` call in the file shown. Technical terms such as SOP, CAPA, ISO 15189 and QualiBOT are kept in English on purpose.\n');
console.log('| File | English | Kiswahili (draft) | Corrected Kiswahili |');
console.log('|---|---|---|---|');
for (const [f, en, sw] of rows) console.log(`| ${f} | ${esc(en)} | ${esc(sw)} | |`);
console.error(rows.length + ' strings');
