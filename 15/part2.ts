import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";
type Point = [number, number];
const re = /(-?\d+)[^\d-]+(-?\d+)[^\d-]+(-?\d+)[^\d-]+(-?\d+)/;
type Sensor = [Point, number];
const sensors: Sensor[] = [];
const max: Point = [4000000,4000000]; // Change for small.txt
const TUNE = 4000000;

function tcdist(a: Point, b: Point) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

for await (const line of readLines(Deno.stdin)) {
  const match = line.match(re);
  const sensor = match?.slice(1, 3).map(x => parseInt(x, 10)) as Point;
  const beacon = match?.slice(3, 5).map(x => parseInt(x, 10)) as Point;
  const distance = tcdist(sensor, beacon);
  sensors.push([sensor, distance]);
}

function* radiusPoints(s: Sensor) {
  for (let x = s[0][0] - s[1]; x <= s[0][0] + s[1]; x++) {
    const xdist = Math.abs(x - s[0][0]);
    if (xdist === s[1]) {
      yield [x,s[0][1]] as Point;
    } else {
      yield [x,s[0][1]+(s[1] - xdist)] as Point;
      yield [x,s[0][1]+(s[1] + xdist)] as Point;
    }
  }
}

function test() {
  for (let sen = 0; sen < sensors.length; sen++) {
    const s = sensors[sen];
    for (const pt of radiusPoints([s[0], s[1]+1])) {
      if ((0 <= pt[0] && pt[0] <= max[0]) && (0 <= pt[1] && pt[1] <= max[1])) {
        if (!sensors.some(s => tcdist(pt, s[0]) <= s[1])) {
          console.log(pt, pt[0] * TUNE + pt[1]);
          return;
        }
      }
    }
  }
}

test();
