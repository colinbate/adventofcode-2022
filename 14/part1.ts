import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";
type Point = [number, number];
type Vec = [number, number];
const fill = new Set<string>();
let maxDepth = 0;
for await (const line of readLines(Deno.stdin)) {
  const points = line.split(' -> ').map(p => p.split(',').map(c => parseInt(c, 10)) as Point);
  let p = 0;
  
  while (p + 1 < points.length) {
    const a = points[p];
    const b = points[p+1];
    if (a[0] === b[0]) {
      for (let y = Math.min(a[1], b[1]); y <= Math.max(a[1], b[1]); y++) {
        const sp = `${a[0]},${y}`;
        fill.add(sp);
        if (y > maxDepth) { maxDepth = y; }
      }
    } else if (a[1] === b[1]) {
      for (let x = Math.min(a[0], b[0]); x <= Math.max(a[0], b[0]); x++) {
        const sp = `${x},${a[1]}`;
        fill.add(sp);
      }
      if (a[1] > maxDepth) { maxDepth = a[1]; }
    }
    p++;
  }
}

const moves: Vec[] = [[0, 1],[-1,1],[1,1]];

let settled = true;

const add = (p: Point, v: Vec) => ([p[0] + v[0], p[1] + v[1]] as Point);
const isFilled = (p: Point) => fill.has(`${p[0]},${p[1]}`);
const move = (p: Point) => moves.find(m => !isFilled(add(p, m)))
let units = 0;
while (settled) {
  let sand: Point = [500,0];
  let moving = true;
  units++;
  while (moving && sand[1] < maxDepth) {
    const next = move(sand);
    if (next) {
      sand = add(sand, next);
    } else {
      moving = false;
      fill.add(`${sand[0]},${sand[1]}`);
    }
  }
  settled = !moving;
}

console.log(units - 1);
