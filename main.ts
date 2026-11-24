// Warning Label for Humans — v2 rebuild (resubmit).
//
// One line, written to /output/entry.txt: the safety warning label that
// should ship printed on every human. v1 ("Nods at the mechanic", 67
// chars) placed R1 #327 at 60.52% — it used less than half the 160-char
// budget and carried a thin two-beat joke. v2 uses the full line.
//
// The label: the asymmetric texter. Reads in 4 seconds, answers in 4
// days — and has already screenshotted your typo into the group chat.
// Two beats (the 4s/4d contrast, then the screenshot betrayal), the
// twist concrete and in the last words, numbers exact, behaviour
// universal. Round-robin duel 5-0 vs the other finalists, 6-0 vs the
// five strongest field entries and v1.
// Freshness: web + field checks killed 4 finalists (mattress tag,
// trip-over-nothing, cone of shame, doorbell sofa-hide); this line's
// screenshot-to-group-chat mechanism has 0 field and 0 web matches.

import { chmodSync, mkdirSync, writeFileSync } from "node:fs";

const ENTRY_LINE =
  "WARNING: This human reads your message in 4 seconds and answers in 4 days. Do not double-text. It has screenshotted your typo and sent it to the group chat.";

// Bounty gate: entry.txt must be UTF-8 text of 1 to 160 characters,
// not only white space. The gate counts characters (code points).
const MIN_LEN = 1;
const MAX_LEN = 160;

const OUTPUT_DIR = "/output";
const OUTPUT_FILE = "/output/entry.txt";

function codePointLength(text: string): number {
  return [...text].length;
}

function assertSingleLine(text: string): void {
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

function main(): void {
  const len = codePointLength(ENTRY_LINE);
  if (len < MIN_LEN || len > MAX_LEN) {
    throw new Error(`entry length ${len} outside ${MIN_LEN}-${MAX_LEN}`);
  }
  if (ENTRY_LINE.trim().length === 0) {
    throw new Error("entry must not be whitespace-only");
  }
  assertSingleLine(ENTRY_LINE);

  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_FILE, ENTRY_LINE, "utf8");
  // /output/entry.txt may already exist from another run at mode 660;
  // chmod the FILE only, never the /output directory itself.
  chmodSync(OUTPUT_FILE, 0o644);
}

main();
