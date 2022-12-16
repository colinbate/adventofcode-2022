import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";
// Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
type Node = { id: string; rate: number; neighbors: string[] };
type Visit = { id: string; weight: number, time: number; open: Set<string>; path: string[]; pruned: Set<string> };
const nodes: Record<string, Node> = {};
let nodeCount = 0;
const notOpenable = new Set<string>();
for await (const line of readLines(Deno.stdin)) {
  const words = line.split(' ');
  const id = words[1];
  const rate = parseInt(words[4].slice(5), 10);
  const neighbors = words.slice(9).map(x => x.replace(',', ''));
  const node: Node = { id, rate, neighbors };
  nodes[id] = node;
  if (rate === 0) {
    notOpenable.add(id);
  }
  nodeCount++;
}

function weightCmp(a: Visit, b: Visit) {
  return b.weight - a.weight;
}

const queue: Visit[] = [];
function enq(id: string, weight: number, time: number, open: Set<string>, path: string[], pruned: Set<string>) {
  queue.push({id, weight, time, open, path, pruned});
  queue.sort(weightCmp);
}
function deq() {
  return queue.shift();
}

let best = 0;
function search(start: string, time: number) {
  enq(start, 0, time, new Set(notOpenable.values()), [`${start}(${time}:0:0)`], new Set<string>());
  let v: Visit | undefined
  while ((v = deq())) {
    const valve = nodes[v.id];
    //console.log(`Visit ${valve.id} with ${v.time} minutes and ${v.weight} weight`);
    if (v.time > 1 && v.open.size < nodeCount) {
      const mypruned = new Set(v.pruned.values());
      for (const neighbor of valve.neighbors) {
        if (v.pruned.has(neighbor)) {
          continue;
        }
        const nn = nodes[neighbor];
        const nopen = v.open.has(neighbor);
        const next = (nopen ? 0 : (v.time - 2) * nn.rate);
        const openClone = new Set(v.open.values());
        if (!nopen && nn.rate > 0) {
          openClone.add(neighbor);
        }
        const nextTime = next > 0 ? v.time - 2 : v.time - 1;
        const pathStr = `${neighbor}(${nextTime}:${next}:${v.weight + next})`;
        enq(neighbor, v.weight + next, nextTime, openClone, [...v.path, pathStr], mypruned);
        if (next) {
          const alt = `${neighbor}(${v.time - 1}:0:${v.weight})`;
          enq(neighbor, v.weight, v.time - 1, new Set(v.open.values()), [...v.path, alt], mypruned);
        }
      }
    } else {
      if (v.weight > best) {
        best = v.weight;
        console.log(v.weight);
        console.log(v.path.join('->'));
      }
    }
  }
}

search('AA', 30);
console.log(`Best: ${best}`);