import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";

let first = 0;
const packets: any[][] = [];

function compare(left: any[] | number, right: any[] | number): number {
  if (!Array.isArray(left) && !Array.isArray(right)) {
    return left - right; 
  }
  if (!Array.isArray(left)) {
    left = [left];
  }
  if (!Array.isArray(right)) {
    right = [right];
  }
  for (let index = 0; index < left.length; index++) {
    const elementL = left[index];
    if (right.length < index + 1) {
      return 1;
    }
    const elementR = right[index];
    const cmp = compare(elementL, elementR);
    if (cmp !== 0) {
      return cmp;
    }
  }
  return right.length > left.length ? -1 : 0;
}

for await (const line of readLines(Deno.stdin)) {
  if (line !== '') {
    const packet = JSON.parse(line);
    packets.push(packet);
  }
}

const div1 = [[2]];
const div2 = [[6]];
(div1 as any).isDiv = true;
(div2 as any).isDiv = true;

packets.push(div1, div2);

packets.sort(compare);

packets.forEach((p, i) => {
  if ((p as any).isDiv) {
    if (first === 0) {
      first = i + 1;
    } else {
      console.log(first * (i + 1));
    }
  }
})

