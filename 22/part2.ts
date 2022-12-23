import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";
const wall = '#';
const tile = '.';
const Q = 50;
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
const quart = (p: Point) => Math.floor(p[0] / Q) + Math.floor(p[1] / Q) * 3;
const foldMap: ((p: Point) => Turtle)[][] = [];
foldMap[1] = [];
foldMap[2] = [];
foldMap[4] = [];
foldMap[6] = [];
foldMap[7] = [];
foldMap[9] = [];
foldMap[1][3] = (p: Point) => ({loc: [0, p[0]+(2*Q)], dir: 0});
foldMap[1][2] = (p: Point) => ({loc: [0, (3*Q)-p[1]-1], dir: 0});

foldMap[2][3] = (p: Point) => ({loc: [p[0]-(2*Q), 4*Q-1], dir: 3});
foldMap[2][0] = (p: Point) => ({loc: [2*Q-1, 3*Q-p[1]-1], dir: 2});
foldMap[2][1] = (p: Point) => ({loc: [2*Q-1, p[0]-Q], dir: 2});

foldMap[4][0] = (p: Point) => ({loc: [Q+p[1], Q-1], dir: 3});
foldMap[4][2] = (p: Point) => ({loc: [p[1]-Q, 2*Q], dir: 1});

foldMap[6][3] = (p: Point) => ({loc: [Q, p[0]+Q], dir: 0});
foldMap[6][2] = (p: Point) => ({loc: [Q, 3*Q-p[1]-1], dir: 0});

foldMap[7][1] = (p: Point) => ({loc: [Q-1, p[0]+2*Q], dir: 2});
foldMap[7][0] = (p: Point) => ({loc: [3*Q-1, 3*Q-p[1]-1], dir: 2});

foldMap[9][1] = (p: Point) => ({loc: [p[0]+2*Q, 0], dir: 1});
foldMap[9][2] = (p: Point) => ({loc: [p[1]-2*Q, 0], dir: 1});
foldMap[9][0] = (p: Point) => ({loc: [p[1]-2*Q, 3*Q-1], dir: 3});
interface Turtle {
  loc: Point;
  dir: number;
}
function step(p: Point, dir: number): Turtle {
  const d = dirs[dir];
  const next: Point = [p[0] + d[0], p[1] + d[1]];
  const currQuart = quart(p);
  let newt: Turtle|undefined;
  if (next[0] !== p[0]) {
    if (next[0] < rowBounds[p[1]][0]) { // LEFT (2)
      newt = foldMap[currQuart][dir](p);
    } else if (next[0] > rowBounds[p[1]][1]) { // RIGHT (0)
      newt = foldMap[currQuart][dir](p);
    }
  } else {
    if (next[1] < colBounds[p[0]][0]) { // UP (3)
      newt = foldMap[currQuart][dir](p);
    } else if (next[1] > colBounds[p[0]][1]) { // DOWN (1)
      newt = foldMap[currQuart][dir](p);
    }
  }
  if (newt) {
    const r = board.get(`${newt.loc[0]},${newt.loc[1]}`);
    if (r && r === tile) {
      return newt;
    }
    return {loc:p, dir};
  } else {
    const r = board.get(`${next[0]},${next[1]}`);
    if (r && r === tile) {
      return {loc:next, dir};
    }
    return {loc:p, dir};
  }
}
function move(amt: number, t: Turtle) {
  for (let x = 0; x < amt; x++) {
    const newt = step(t.loc, t.dir);
    t.loc = newt.loc;
    t.dir = newt.dir;
  }
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
