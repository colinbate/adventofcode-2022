import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";
type NumberWithOriginalIndex = [number, number];
const buffer: NumberWithOriginalIndex[] = [];
let index = 0;
const key = 811589153;

for await (const line of readLines(Deno.stdin)) {
  const v = parseInt(line, 10);
  buffer.push([v * key, index]);
  index++;
}

function move(orig: number) {
  const ind = buffer.findIndex(x => x[1] === orig);
  const coord = buffer[ind];
  const newInd = (ind + coord[0]) % (buffer.length - 1);
  buffer.splice(ind, 1);
  buffer.splice(newInd, 0, coord);
}

for (let xx = 0; xx < 10; xx++) {
  for (let orig = 0; orig < buffer.length; orig++) {
    move(orig)
  }
}

const zero = buffer.findIndex(x => x[0] === 0);
const a = (zero + 1000) % buffer.length;
const b = (zero + 2000) % buffer.length;
const c = (zero + 3000) % buffer.length;

console.log(buffer[a][0] + buffer[b][0] + buffer[c][0]);
