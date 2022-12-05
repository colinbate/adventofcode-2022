import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";

let total = 0;
function priority(letter: string) {
  return letter.charCodeAt(0) - (letter >= 'a' ? 96 : 38);
}
let groupSet: Set<string> | undefined;
for await (const line of readLines(Deno.stdin)) {
  if (!groupSet) {
    groupSet = new Set(Array.from(line));
  } else {
    const matches = new Set<string>();
    for (const char of line) {
      if (groupSet.has(char)) {
        matches.add(char);
      }
    }
    if (matches.size === 1) {
      total += priority(Array.from(matches.values())[0]);
      groupSet = undefined;
    } else {
      groupSet = new Set(matches);
    }
  }
}

console.log(total);
