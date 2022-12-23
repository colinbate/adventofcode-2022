import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";

type Point = [number, number, number];
const lava = new Set<string>();
const points: Point[] = [];

function has(pt: Point) {
  return lava.has(pt.join(','));
}

for await (const line of readLines(Deno.stdin)) {
  const pt = line.split(',').map(x => parseInt(x, 10)) as Point;
  lava.add(line);
  points.push(pt);
}

let faces = 0;

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

function countNeighbours(pt: Point) {
  return getAllNeighbours(pt).filter(has).length;
}

for (const pt of points) {
  faces += (6 - countNeighbours(pt));
}

console.log(faces);
