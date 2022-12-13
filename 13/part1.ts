import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";

let total = 0;
let left: any[] | undefined;

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

let pair = 0;
for await (const line of readLines(Deno.stdin)) {
  if (!left) {
    left = JSON.parse(line);
  } else if (line === '') {
    left = undefined;
  } else {
    const right = JSON.parse(line);
    pair++;
    const cmp = compare(left, right);
    if (cmp < 0) {
      total += pair;
    }
  }
}

console.log(total);
