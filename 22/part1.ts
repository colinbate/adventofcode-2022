import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";
const wall = '#';
const tile = '.';
type Space = typeof wall | typeof tile;
type Bound = [number, number];
type Point = [number, number];
type Vec = [number, number];
const board = new Map<string, Space>();
const rowBounds: Bound[] = [];
const colBounds: Bound[] = [];
let row = 0;
let getInstructions = false;
const dirs: Vec[] = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];
interface Turtle {
  loc: Point;
  dir: number;
}
function step(p: Point, d: Vec): Point {
  const next: Point = [p[0] + d[0], p[1] + d[1]];
  if (next[0] !== p[0]) {
    if (next[0] < rowBounds[p[1]][0]) {
      next[0] = rowBounds[p[1]][1];
    } else if (next[0] > rowBounds[p[1]][1]) {
      next[0] = rowBounds[p[1]][0];
    }
  } else {
    if (next[1] < colBounds[p[0]][0]) {
      next[1] = colBounds[p[0]][1];
    } else if (next[1] > colBounds[p[0]][1]) {
      next[1] = colBounds[p[0]][0];
    }
  }
  const r = board.get(`${next[0]},${next[1]}`);
  if (r && r === tile) {
    return next;
  }
  return p;
}
function move(amt: number, t: Turtle) {
  let p = t.loc;
  for (let x = 0; x < amt; x++) {
    p = step(p, dirs[t.dir]);
  }
  t.loc = p;
}
function turn(amt: number, t: Turtle) {
  t.dir = (t.dir + amt + dirs.length) % dirs.length;
}
const dmap = {
  L: -1,
  R: 1
};
let buf: string[] = [];
let lastW = 0;
const turtle: Turtle = { loc: [0, 0], dir: 0 };
for await (const line of readLines(Deno.stdin)) {
  if (getInstructions) {
    // Parse that line
    for (const char of line) {
      if (char === 'L' || char === 'R') {
        if (buf.length) {
          const amt = parseInt(buf.join(''), 10);
          move(amt, turtle);
          buf = [];
        }
        turn(dmap[char], turtle);
      } else {
        buf.push(char);
      }
    }
    if (buf.length) {
      const amt = parseInt(buf.join(''), 10);
      move(amt, turtle);
      buf = [];
    }
  } else {
    if (line === '') { getInstructions = true; }
    // Map!
    const cols = line.split('');
    if (cols.length - 1 < lastW) {
      for (let c = cols.length; c <= lastW; c++) {
        if (colBounds[c] && colBounds[c][1] === 0) {
          colBounds[c][1] = row - 1;
        }
      }
    }
    if (cols.length === 0) { continue; }
    lastW = cols.length - 1;
    let start = false;
    rowBounds[row] = [0, cols.length - 1];
    for (let col = 0; col < cols.length; col++) {
      if (cols[col] !== ' ') {
        if (!start) {
          start = true;
          rowBounds[row][0] = col;
          if (row === 0) {
            turtle.loc[0] = col;
          }
        }
        if (!colBounds[col]) {
          colBounds[col] = [row, 0];
        }
        board.set(`${col},${row}`, cols[col] as Space);
      } else {
        if (colBounds[col] && colBounds[col][1] === 0) {
          colBounds[col][1] = row - 1;
        }
      }
    }
    
    row++;
  }
}

console.log(`password`, (turtle.loc[0] + 1) * 4 + (turtle.loc[1] + 1) * 1000 + turtle.dir);