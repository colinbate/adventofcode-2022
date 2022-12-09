import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";

const visited = new Set<string>();
type Point = [number, number];
type Vector = [number, number];

let head: Point = [0,0];
let tail: Point = [0,0];

const vectors: Record<string, Vector> = {
  U: [0,-1],
  R: [1,0],
  D: [0,1],
  L: [-1,0],
};

function moveDir(point: Point, dir: string): Point {
  const v = vectors[dir];
  if (!v) { return point }
  return [point[0] + v[0], point[1] + v[1]];
}

function diff(a: Point, b: Point): Vector {
  return [b[0] - a[0], b[1] - a[1]];
}

function dndDistance(v: Vector) {
  return Math.max(Math.abs(v[0]), Math.abs(v[1]));
}

function moveTo(point: Point, to: Point): Point {
  const dir = diff(point, to);
  const dist = dndDistance(dir);
  if (dist < 2) { return point; }
  const step = dir.map(x => Math.abs(x) > 1 ? x / Math.abs(x) : x) as Vector;
  return [point[0] + step[0], point[1] + step[1]];
}

function note(point: Point) {
  visited.add(`${point[0]},${point[1]}`);
}

for await (const line of readLines(Deno.stdin)) {
  const [dir, dist] = line.split(' ').map((x,ind) => ind === 1 ? parseInt(x, 10) : x) as [string, number];
  for (let step = 0; step < dist; step += 1) {
    head = moveDir(head, dir);
    tail = moveTo(tail, head);
    note(tail);
  }
}

console.log(visited.size);
