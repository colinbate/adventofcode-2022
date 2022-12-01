import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";

let largest = 0;
let current = 0;
for await (const line of readLines(Deno.stdin)) {
  if (line !== '') {
    current += parseInt(line, 10);
  } else {
    if (current > largest) {
      largest = current;
    }
    current = 0;
  }
}
if (current > largest) {
  largest = current;
}

console.log(largest);
