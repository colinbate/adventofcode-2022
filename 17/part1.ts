import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";

let jets: string[] = [];
for await (const line of readLines(Deno.stdin)) {
  jets = line.split('');
}
type Point = [number, number];
type Rock = Point[];
const rocks: Rock[] = [
  [[0,0],[1,0],[2,0],[3,0]], // -
  [[1,0],[0,1],[1,1],[2,1],[1,2]], // +
  [[0,0],[1,0],[2,0],[2,1],[2,2]], // L
  [[0,0],[0,1],[0,2],[0,3]], // |
  [[0,0],[1,0],[0,1],[1,1]], // []
]

let cjet = 0;
let top = 0;
const W = 7;
const chamber = new Set<string>();

const add = (a: Point, b: Point) => ([a[0] + b[0], a[1] + b[1]] as Point);
const attemptNudge = (r: Rock, dir: string) => {
  let moved: Rock = [];
  if (dir === '<') {
    moved = r.map(p => add(p, [-1,0]));
    if (moved.some(x => x[0] < 0) || moved.map(x => `${x[0]},${x[1]}`).some(x => chamber.has(x))) {
      return [false, r] as [boolean, Rock];
    }
  } else if (dir === '>') {
    moved = r.map(p => add(p, [1,0]));
    if (moved.some(x => x[0] >= W) || moved.map(x => `${x[0]},${x[1]}`).some(x => chamber.has(x))) {
      return [false, r] as [boolean, Rock];
    }
  } else {
    // Down
    moved = r.map(p => add(p, [0,-1]));
    if (moved.some(x => x[1] < 0) || moved.map(x => `${x[0]},${x[1]}`).some(x => chamber.has(x))) {
      return [false, r] as [boolean, Rock];
    }
  }
  return [true, moved] as [boolean, Rock];
};

function solidify(r: Rock) {
  r.map(x => `${x[0]},${x[1]}`).forEach(p => chamber.add(p));
  let max = 0;
  for (const pt of r) {
    if (pt[1]>max) {
      max = pt[1];
    }
  }
  if (max + 1 > top) {
    top = max + 1;
  }
}

function dropRock(r: number) {
  const start: Point = [2, top + 3];
  let currentPos = rocks[r].map(p => add(start, p));
  let stopped = false;
  while (!stopped) {
    const dir = jets[cjet];
    const [success, next] = attemptNudge(currentPos, dir);
    if (success) { 
      currentPos = next;
    }
    const [dsuccess, dnext] = attemptNudge(currentPos, 'v');
    
    if (dsuccess) {
      currentPos = dnext;
    } else {
      solidify(currentPos)
      stopped = true;
    }
    cjet = (cjet + 1) % jets.length;
  }
}

for (let r = 0; r < 2022; r++) {
  const crock = r % rocks.length;
  dropRock(crock);
}

console.log(top);
