import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";

const s: Record<string, number> = {
  'A X': 3,
  'A Y': 4,
  'A Z': 8,
  'B X': 1,
  'B Y': 5,
  'B Z': 9,
  'C X': 2,
  'C Y': 6,
  'C Z': 7,
};
let total = 0;
for await (const line of readLines(Deno.stdin)) {
  total += s[line];
}

console.log(total);

// (1 for Rock, 2 for Paper, and 3 for Scissors) plus the score for the outcome of the round
// (0 if you lost, 3 if the round was a draw, and 6 if you won).