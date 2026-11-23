// Warning Label for Humans — entry program.
//
// Writes ONE line to /output/entry.txt: the safety warning label that
// should come printed on every human being. At most 160 characters,
// funny first and plausible second.
//
// The label: a driver nodding at the mechanic while understanding
// nothing, then paying anyway. Recognition is the engine here — most
// drivers cannot follow garage language at all (RAC research: 56% of
// drivers struggle with it, half feel overcharged), yet everyone nods,
// agrees, and pays. The turn lands in the last two words.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const LABEL =
  "WARNING: Nods at the mechanic while understanding nothing. Pay anyway.";

// Gate from the bounty rules: entry.txt must be UTF-8 text of 1 to 160
// characters, not only white space. Characters here are code points,
// so [...LABEL].length is the count the gate uses.
const GATE_MIN = 1;
const GATE_MAX = 160;

function countCodePoints(text: string): number {
  return [...text].length;
}

function isSingleCleanLine(text: string): boolean {
  if (countCodePoints(text) < GATE_MIN || countCodePoints(text) > GATE_MAX) {
    return false;
  }
  if (text.trim().length === 0) {
    return false;
  }
  // Reject every control character, not just line breaks: a stray tab,
  // NUL or other invisible byte would break the single-line gate and
  // the printed-label illusion alike.
  for (const ch of text) {
    const code = ch.codePointAt(0) as number;
    if (code <= 0x1f || code === 0x7f) {
      return false;
    }
  }
  return true;
}

function ensureOutDir(): string {
  const outDir = "/output";
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }
  return outDir;
}

function writeLabel(): string {
  if (!isSingleCleanLine(LABEL)) {
    throw new Error(
      `label fails the gate: ${countCodePoints(LABEL)} code points, ` +
        `expected ${GATE_MIN}-${GATE_MAX}, single non-blank line`,
    );
  }
  const outPath = join(ensureOutDir(), "entry.txt");
  writeFileSync(outPath, LABEL, "utf8");
  return outPath;
}

function confirmWritten(outPath: string): void {
  const back = readFileSync(outPath, "utf8");
  if (back !== LABEL) {
    throw new Error("round-trip check failed: entry.txt differs from LABEL");
  }
}

const outPath = writeLabel();
confirmWritten(outPath);
console.log(
  `wrote ${outPath}: ${countCodePoints(LABEL)} characters, ` +
    `${Buffer.byteLength(LABEL, "utf8")} bytes`,
);
console.log(LABEL);

// Unused by the entry itself, kept so the script stays honest about
// where it runs from if ever moved out of the repository root.
void dirname(fileURLToPath(import.meta.url));
