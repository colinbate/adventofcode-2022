//
// Solution was adapted from https://github.com/betaveros/advent-of-code-2022/blob/main/p16.noul
//
import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";
// Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
const names = [];
const flows = [];
const conns = [];
for await (const line of readLines(Deno.stdin)) {
  const words = line.split(' ');
  names.push(words[1]);
  flows.push(parseInt(words[4].slice(5), 10));
  conns.push(words.slice(9).map(x => x.replace(',', '')));
}

const dist = Array.from({length: names.length}).map(() => {
  return Array.from({length: names.length}).map(() => 99);
});

conns.forEach((cl, i) => {
  for (const conn of cl) {
    dist[i][names.findIndex(x => x === conn)] = 1;
  }
});

const V = names.length;
const AA = names.findIndex(x => x === 'AA');
for (let k = 0; k < V; k++) {
  for (let i = 0; i < V; i++) {
    for (let j = 0; j < V; j++) {
      dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
    }
  }
}

function* chooseOne(xs) {
  for (let i = 0; i < xs.length; i++) {
    yield [xs[i], xs.slice(0,i).concat(xs.slice(i+1))];
  }
}

function dfs(cur, rest, t) {
  let max = 0;
  for (const [r, rr] of chooseOne(rest)) {
    if (dist[cur][r] < t) {
      const f = flows[r] * (t - dist[cur][r] - 1) + dfs(r, rr, t - dist[cur][r] - 1);
      if (f > max) {
        max = f;
      }
    }
  }
  return max;
}

const r = dfs(AA, flows.map((x, i) => [x,i]).filter(f => f[0] > 0).map(x => x[1]), 30);
console.log(r);
