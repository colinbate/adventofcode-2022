import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";

const top: number[] = [];
let current = 0;

function process() {
  if (top.length < 3) {
    top.push(current);
  } else if (top.some(x => current > x)) {
    top.sort((a,b) => a-b);
    top.shift();
    top.push(current);
  }
}

for await (const line of readLines(Deno.stdin)) {
  if (line !== '') {
    current += parseInt(line, 10);
  } else {
    process();
    current = 0;
  }
}
process();

console.log(top.reduce((p,c) => p + c, 0));
