import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";

const trees: number[][] = [];
let bestScore = 0;

for await (const line of readLines(Deno.stdin)) {
  const row = line.split('').map(x => x.charCodeAt(0) - 48);
  trees.push(row);
}

function findScore(x: number, y: number) {
  if (x === 0 || y === 0 || y === trees.length - 1 || x === trees[y].length - 1) {
    return 0;
  }
  const max = trees[y][x];
  let score = 1;
  let h = -1;
  let dy = y;
  let ls = 0;
  do {
    dy -= 1;
    if (trees[dy][x] > h) { h = trees[dy][x]; }
    ls += 1;
  } while (h < max && dy > 0);
  score *= ls;

  h = -1;
  dy = y;
  ls = 0;
  do {
    dy += 1;
    if (trees[dy][x] > h) { h = trees[dy][x]; }
    ls += 1;
  } while (h < max && dy < trees.length - 1);
  score *= ls;

  h = -1;
  let dx = x;
  ls = 0;
  do {
    dx -= 1;
    if (trees[y][dx] > h) { h = trees[y][dx]; }
    ls += 1;
  } while (h < max && dx > 0);
  score *= ls;

  h = -1;
  dx = x;
  ls = 0;
  do {
    dx += 1;
    if (trees[y][dx] > h) { h = trees[y][dx]; }
    ls += 1;
  } while (h < max && dx < trees[y].length - 1);
  score *= ls;

  return score;
}

for (let x = 0; x < trees[0].length; x += 1) {
  const len = trees.length;
  for (let y = 0; y < len; y += 1) {
    const ss = findScore(x, y);
    if (ss > bestScore) {
      bestScore = ss;
    }
  }
}

console.log(bestScore);
