//
// Solution ported directly from: https://github.com/betaveros/advent-of-code-2022/blob/main/p19.noul
//
import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";
type Vector = [number, number, number, number];
const bps: number[][] = [];
for await (const line of readLines(Deno.stdin)) {
  const nums = line.split(' ').map(x => parseInt(x, 10)).filter(x => !Number.isNaN(x));
  bps.push(nums);
}

function zip(zipper: (...num: number[]) => number | null, ...arrays: number[][]) {
  const out: (number | null)[] = [];
  for (let index = 0; index < arrays[0].length; index++) {
    const inputs = arrays.map(x => x[index]);
    out[index] = zipper(...inputs);
  }
  return out;
}

function add(a: Vector, b: Vector) {
  return a.map((x, i) => x + b[i]) as Vector;
}

function sub(a: Vector, b: Vector) {
  return a.map((x, i) => x - b[i]) as Vector;
}

function mul(a: Vector, b: number) {
  return a.map(x => x * b) as Vector;
}

function solve(bp: number[], mins: number) {
  const [_bp_id, ore_bot_cost, clay_bot_cost, obs_bot_ore_cost, obs_bot_clay_cost, geode_bot_ore_cost, geode_bot_obs_cost] = bp;
	const max_ore_cost = Math.max(ore_bot_cost, clay_bot_cost, obs_bot_ore_cost, geode_bot_ore_cost);
  let ans = 0;
  const dfs = (minute: number, resources: Vector, bots: Vector) => {
		const ans_idle = resources[3] + bots[3] * minute;
		if (ans_idle > ans) {
			ans = ans_idle;
    }
		const ans_opti = ans_idle + Math.floor(minute * (minute - 1) / 2);
		if (ans_opti <= ans) return;
		const turns_to_do = (cost: Vector) => {
			const ts = zip((r:number, b:number, c:number) => {
        if (r >= c) { return 0; }
        else if (b) { return Math.floor((c - r + b - 1) / b); }
        else { return null }
      }, resources, bots, cost)
			if (ts.every(x => x != null)) {
        return Math.max(...(ts as number[]));
      } else {
        return null;
      }
    };
		const costs: [number, Vector][] = [
			[3, [geode_bot_ore_cost, 0, geode_bot_obs_cost, 0]],
			[2, [obs_bot_ore_cost, obs_bot_clay_cost, 0, 0]],
			[1, [clay_bot_cost, 0, 0, 0]],
			[0, [ore_bot_cost, 0, 0, 0]],
		];
		for (const [i, c] of costs) {
			if (i === 0 && bots[i] >= max_ore_cost) continue;
			if (i === 1 && bots[i] >= obs_bot_clay_cost) continue;
			if (i === 2 && bots[i] >= geode_bot_obs_cost) continue;
			const t = turns_to_do(c);
			if (t != null && t < minute) {
				const botsPrime = [...bots] as Vector;
				botsPrime[i] += 1;
				dfs(minute - t - 1, sub(add(resources, mul(bots, (t + 1))), c), botsPrime);
      }
    }
  };
  dfs(mins, [0,0,0,0], [1,0,0,0]);
  return ans;
}

console.log('total', bps.slice(0,3).reduce((p, bp) => p * solve(bp, 32), 1));
