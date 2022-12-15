import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";
type Point = [number, number];
const re = /(-?\d+)[^\d-]+(-?\d+)[^\d-]+(-?\d+)[^\d-]+(-?\d+)/;
type Sensor = [Point, number];
const sensors: Sensor[] = [];
const known = new Set<string>();
let minx = Infinity;
let maxx = 0;

function tcdist(a: Point, b: Point) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

for await (const line of readLines(Deno.stdin)) {
  const match = line.match(re);
  const sensor = match?.slice(1, 3).map(x => parseInt(x, 10)) as Point;
  const beacon = match?.slice(3, 5).map(x => parseInt(x, 10)) as Point;
  const distance = tcdist(sensor, beacon);
  if (sensor[0] - distance < minx) { minx = sensor[0] - distance; }
  if (sensor[0] + distance > maxx) { maxx = sensor[0] + distance; }
  sensors.push([sensor, distance]);
  known.add(`${beacon[0]},${beacon[1]}`);
}

const y = 2000000; // Change for small.txt
let nobeacon = 0;
for (let x = minx; x <= maxx; x++) {
  if (!known.has(`${x},${y}`) && sensors.some(s => tcdist([x,y], s[0]) <= s[1])) {
    nobeacon++;
  }
}

console.log(nobeacon);
