import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";

let total = 0;
function priority(letter: string) {
  return letter.charCodeAt(0) - (letter >= 'a' ? 96 : 38);
}
for await (const line of readLines(Deno.stdin)) {
  const one = line.slice(0, (line.length/2));
  const two = line.slice(line.length/2);
  const oneSet = new Set(Array.from(one));
  for (const char of two) {
    if (oneSet.has(char)) {
      total += priority(char);
      break;
    }
  }
}

console.log(total);
