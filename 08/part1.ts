import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";

const trees: number[][] = [];
const visible = new Set<string>();

for await (const line of readLines(Deno.stdin)) {
  const row = line.split('').map(x => x.charCodeAt(0) - 48);
  trees.push(row);
}

for (let y = 0; y < trees.length; y += 1) {
  let lh = -1;
  let rh = -1;
  const len = trees[y].length;
  for (let x = 0; x < len; x += 1) {
    if (trees[y][x] > lh) { lh = trees[y][x]; visible.add(`${x},${y}`); }
    const rx = len - x - 1;
    if (trees[y][rx] > rh) { rh = trees[y][rx]; visible.add(`${rx},${y}`); }
  }
}

for (let x = 0; x < trees[0].length; x += 1) {
  let th = -1;
  let bh = -1;
  const len = trees.length;
  for (let y = 0; y < len; y += 1) {
    if (trees[y][x] > th) { th = trees[y][x]; visible.add(`${x},${y}`); }
    const ry = len - y - 1;
    if (trees[ry][x] > bh) { bh = trees[ry][x]; visible.add(`${x},${ry}`); }
  }
}

console.log(visible.size);
