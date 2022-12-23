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
const elfCount = elves.size;
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
  let staying = 0;
  for (const elf of elves.values()) {
    const p = strToPoint(elf);
    if (!willMove(p)) {
      proposed.set(elf, elf);
      staying++;
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
    if (staying === elfCount) {
      done = true;
      return;
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

let round = 0;
let done = false;
while (!done) {
  simulate();
  round++;
}

console.debug(round);
