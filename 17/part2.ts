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
const goal = 1_000_000_000_000;
let targetRock = goal - 1;
let cjet = 0;
let top = 0;
const W = 7;
const chamber = new Set<string>();
const memo: Record<string, [number, number]> = {};
const tops: number[] = [];
let bonus = 0;
let result = 0;

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
  tops.push(top);
}

function memoize(r: number, j: number) {
  const crock = r % rocks.length;
  const diffs = tops.slice(-100).reduce((p, c, i, a) => i + 1 === a.length ? p : [...p, c - a[i + 1]], [] as number[]);
  const key = `${crock}:${j}:${diffs.join(',')}`;
  const cached = memo[key];
  if (!cached) {
    memo[key] = [r, top];
  } else {
    const [oldr, oldtop] = cached;
    if (targetRock === goal - 1) {
      const period = r - oldr;
      bonus = (top - oldtop) * Math.floor((goal - r) / period);
      targetRock = r + (goal - 1 - r) % period;
    }
  }
}

function dropRock(r: number) {
  const crock = r % rocks.length;
  const start: Point = [2, top + 3];
  let currentPos = rocks[crock].map(p => add(start, p));
  while (true) {
    const dir = jets[cjet];
    cjet = (cjet + 1) % jets.length;
    const [success, next] = attemptNudge(currentPos, dir);
    if (success) { 
      currentPos = next;
    }
    const [dsuccess, dnext] = attemptNudge(currentPos, 'v');
    
    if (dsuccess) {
      currentPos = dnext;
    } else {
      solidify(currentPos);
      break;
    }
  }
  if (r === targetRock) {
   result = bonus + top;
   return true;
  }
  memoize(r, cjet);
  return false;
}

for (let r = 0; r < goal; r++) {
  if (dropRock(r)) break;
}

console.log(result);
