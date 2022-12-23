import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";

type Point = [number, number, number];
const lava = new Set<string>();
const points: Point[] = [];
const max: Point = [0,0,0];
const min: Point = [Infinity, Infinity, Infinity];
const water = new Set<string>();

function has(pt: Point) {
  return lava.has(pt.join(','));
}

for await (const line of readLines(Deno.stdin)) {
  const pt = line.split(',').map(x => parseInt(x, 10)) as Point;
  for (let c = 0; c < 3; c++) {
    if (pt[c]>max[c]){max[c]=pt[c];}
    if (pt[c]<min[c]){min[c]=pt[c];}
  }
  lava.add(line);
  points.push(pt);
}

for (let c = 0; c < 3; c++) {
  max[c]++;
  min[c]--;
}

let faces = 0;

function inBounds(pt: Point) {
  return min[0] <= pt[0] && pt[0] <= max[0] && min[1] <= pt[1] && pt[1] <= max[1] && min[2] <= pt[2] && pt[2] <= max[2];
}

function getAllNeighbours(pt: Point) {
  return [
    [pt[0]-1, pt[1], pt[2]],
    [pt[0]+1, pt[1], pt[2]],
    [pt[0], pt[1]-1, pt[2]],
    [pt[0], pt[1]+1, pt[2]],
    [pt[0], pt[1], pt[2]-1],
    [pt[0], pt[1], pt[2]+1],
  ] as Point[];
}

function flood(from: Point) {
  const q: Point[] = [];
  q.push(from);
  while (q.length) {
    const w = q.shift() as Point;
    getAllNeighbours(w).forEach(n => {
      if (!hasWater(n) && inBounds(n) && !has(n)) {
        water.add(n.join(','));
        q.push(n);
      }
    });
  }
}

function hasWater(pt: Point) {
  return water.has(pt.join(','));
}

function countWaterNeighbours(pt: Point) {
  return getAllNeighbours(pt).filter(hasWater).length;
}

flood(min);

for (const pt of points) {
  faces += countWaterNeighbours(pt);
}

console.log(faces);
