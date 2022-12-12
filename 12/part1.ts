import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";

type Node = { x: number, y: number, h: number, v: number };
type Vec = [number, number];
const dirs: Vec[] = [[0,-1],[1,0],[0,1],[-1,0]];
const grid: Node[][] = [];
let y = 0;
let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;
for await (const line of readLines(Deno.stdin)) {
  const rowHeights = line.split('').map((h,x) => ({
    x,
    y,
    h: h === 'S' ? (startX = x, startY = y, 0) : (h === 'E' ? (endX = x, endY = y, 25) : h.charCodeAt(0) - 97),
    v: 0
  } as Node));
  grid.push(rowHeights);
  y++;
}

function getAllowedNodeInDir(dir: Vec, from: Node): Node | undefined {
  const [x, y] = [from.x + dir[0], from.y + dir[1]];
  const to = grid[y]?.[x];
  return !to || !!to.v || to.h > from.h + 1 ? undefined : to;
}

type Visit = [Node, number];
function bfs(start: Node, goal: Node) {
  const queue: Visit[] = [[start,0]];
  start.v += 1;
  while (queue.length) {
    const [current, step] = queue.shift() ?? [start,0]; // Keep TS happy
    if (current === goal) { return step; }
    for (const d of dirs) {
      const next = getAllowedNodeInDir(d, current);
      if (next) {
        queue.push([next, step + 1]);
        next.v += 1;
      }
    }
  }
}

const startNode = grid[startY][startX];
const endNode = grid[endY][endX];
const total = bfs(startNode, endNode);
console.log(total);
