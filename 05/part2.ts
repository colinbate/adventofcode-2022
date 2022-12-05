import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";

let stacks: string[][] = [];
let stackCount = 0;
let inst = false;
for await (const line of readLines(Deno.stdin)) {
  if (line.length === 0) { inst = true; continue; }
  if (inst) {
    const parts = line.split(' ');
    const count = parseInt(parts[1], 10);
    const from = parseInt(parts[3], 10) - 1;
    const to = parseInt(parts[5], 10) - 1;
    stacks[to].push(...stacks[from].splice(stacks[from].length - count));
  } else {
    if (!line.includes('[')) { continue; }
    if (!stackCount) {
      stackCount = (line.length + 1) / 4;
      stacks = Array.from<string[]>({length: stackCount}).map(() => ([]));
    }
    for (let xx = 0; xx < stackCount; xx += 1) {
      const item = line.at((xx * 4) + 1);
      if (item != null && item !== ' ') {
        stacks[xx].unshift(item);
      }
    }
  }
}

console.log(stacks.map(x => x.pop() ?? '').join(''));
