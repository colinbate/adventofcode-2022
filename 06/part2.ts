import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";

for await (const line of readLines(Deno.stdin)) {
  for (let i = 14; i <= line.length; i += 1) {
    const s = new Set(line.slice(i-14,i).split(''));
    if (s.size === 14) {
      console.log(i);
      break;
    }
  }
}
