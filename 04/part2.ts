import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";

let total = 0;
for await (const line of readLines(Deno.stdin)) {
  const [first, second] = line.split(',');
  const [x, y] = first.split('-').map(n => parseInt(n, 10));
  const [a, b] = second.split('-').map(n => parseInt(n, 10));
  if (!(y < a || x > b)) {
    total += 1;
  }
}

console.log(total);