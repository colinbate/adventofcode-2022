import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";

let elves = new Set<string>();
let row = 0;
for await (const line of readLines(Deno.stdin)) {
  let col = -1;
  while ((col = line.indexOf('#', col+1)) !== -1) {
    elves.add(`${col},${row}`);
  }
  row++;
}
type Point = [number, number];
type Vec = [number, number];
const allDirs: Record<string, Vec> = {
  nw: [-1,-1],
  n:  [0,-1],
  ne: [1,-1],
  e:  [1,0],
  se: [1,1],
  s:  [0,1],
  sw: [-1,1],
  w:  [-1,0],
};
const checkDirs: Vec[][] = [
  [allDirs.nw, allDirs.n, allDirs.ne],
  [allDirs.sw, allDirs.s, allDirs.se],
  [allDirs.nw, allDirs.w, allDirs.sw],
  [allDirs.ne, allDirs.e, allDirs.se],
];

function strToPoint(elf: string) {
  return elf.split(',').map(x => parseInt(x, 10)) as Point;
}

function step(elf: Point, d: Vec) {
  return [elf[0] + d[0], elf[1] + d[1]].join(',');
}

function willMove(elf: Point) {
  const dirs = Object.values(allDirs);
  return dirs.some(d => elves.has(step(elf, d)))
}

function getNext(elf: Point) {
  for (let d = 0; d < checkDirs.length; d++) {
    const dirs = checkDirs[d];
    if (dirs.every(x => !elves.has(step(elf, x)))) {
      return step(elf, dirs[1]);
    }
  }
}

function simulate() {
  // Check all around
  const proposed = new Map<string, string>();
  const conflicts = new Set<string>();
  for (const elf of elves.values()) {
    const p = strToPoint(elf);
    if (!willMove(p)) {
      proposed.set(elf, elf);
    } else {
      const next = getNext(p);
      if (next == null) {
        proposed.set(elf, elf);
      } else {
        if (proposed.has(next)) {
          if (!conflicts.has(next)) {
            conflicts.add(next);
            const other = proposed.get(next)!;
            proposed.set(other, other);
          }
          proposed.set(elf, elf);
        } else {
          proposed.set(next, elf);
        }
      }
    }
  }
  for (const conflict of conflicts.values()) {
    proposed.delete(conflict);
  }

  // Make move
  elves = new Set(proposed.keys());

  // Alter search directions
  checkDirs.push(checkDirs.shift()!);
}

for (let round = 0; round < 10; round++) {
  simulate();
}

function getEmptyInBounds() {
  let empty = 0;
  const min: Point = [Infinity, Infinity];
  const max: Point = [-Infinity, -Infinity];
  for (const elf of elves.values()) {
    const p = strToPoint(elf);
    if (p[0] > max[0]) max[0] = p[0];
    if (p[1] > max[1]) max[1] = p[1];
    if (p[0] < min[0]) min[0] = p[0];
    if (p[1] < min[1]) min[1] = p[1];
  }
  for (let r = min[1]; r <= max[1]; r++) {
    for (let c = min[0]; c <= max[0]; c++) {
      if (!elves.has(`${c},${r}`)) empty++;
    }
  }
  return empty;
}

console.debug(getEmptyInBounds());
