//
// This attempt was abandoned. Check the `.js` files.
//

import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";
// Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
type Node = { id: string; rate: number; neighbors: string[] };
const nodes: Record<string, Node> = {};
let nodeCount = 0;
const notOpenable = new Set<string>();
const weights: Record<string, Record<string, number>> = {};
const nodePrime: Record<string, string> = {};
for await (const line of readLines(Deno.stdin)) {
  const words = line.split(' ');
  const id = words[1];
  const rate = parseInt(words[4].slice(5), 10);
  const neighbors = words.slice(9).map(x => x.replace(',', ''));
  const node: Node = { id, rate, neighbors };
  nodes[id] = node;
  if (rate === 0) {
    notOpenable.add(id);
  } else {
    const idprime = `${id}'`;
    const prime: Node = { id: idprime, rate: 0, neighbors };
    nodes[idprime] = prime;
    nodePrime[id] = idprime;
    nodeCount++;
  }
  nodeCount++;
}

const setw = (from: string, to: string, w: number) => {
  if (!(from in weights)) {
    weights[from] = {};
  }
  weights[from][to] = w;
}

const getw = (from: string, to: string) => weights[from]?.[to] ?? -Infinity;

for (const node of Object.values(nodes)) {
  for (const dest of node.neighbors) {
    setw(node.id, dest, node.rate);
    const prime = nodePrime[dest];
    if (prime) {
      setw(node.id, prime, node.rate);
    }
  }
}

class SetStack {
  hash: Record<string, boolean> = {};
  stack: string[] = [];
  constructor(orig: SetStack | string | undefined) {
    if (orig) {
      if (typeof orig === 'string') {
        this.push(orig);
      } else {
        this.hash = {...orig.hash};
        this.stack = [...orig.stack];
      }
    }
  }
  push(item: string) {
    if (this.hash[item] === true) {
      return false;
    }
    this.hash[item] = true;
    this.stack.push(item);
  }
  pop() {
    if (!this.stack.length) {
      return false;
    }
    const item = this.stack.pop();
    if (item == null) {
      return false;
    }
    this.hash[item] = false;
    return item;
  }
  peek(num = 1) {
    return this.stack.at(-1 * num);
  }
  has(item: string) {
    return this.hash[item] === true;
  }
}
type Visit = { id: string; weight: number, time: number; open: Set<string>; path: string[]; branch: SetStack, pruned: Set<string> };

function weightCmp(a: Visit, b: Visit) {
  return b.weight - a.weight;
}

const queue: Visit[] = [];
function enq(id: string, weight: number, time: number, open: Set<string>, path: string[], branch: SetStack, pruned: Set<string>) {
  queue.push({id, weight, time, open, path, branch, pruned});
  queue.sort(weightCmp);
}
function deq() {
  return queue.shift();
}

let best = 0;
function search(start: string, time: number) {
  enq(start, 0, time, new Set(notOpenable.values()), [`${start}(${time}:0:0)`], new SetStack(start), new Set<string>());
  let v: Visit | undefined
  while ((v = deq())) {
    const valve = nodes[v.id];
    //console.log(`Visit ${valve.id} with ${v.time} minutes and ${v.weight} weight`);
    if (v.time > 1 && v.open.size < nodeCount) {
      const availableNeighbors = valve.neighbors.filter(n => !v?.pruned.has(n));
      const mypruned = new Set(v.pruned.values());
      if (availableNeighbors.length === 1 && v.open.has(v.id)) {
        mypruned.add(v.id);
      }
      if (
        v.path[1]?.startsWith('DD(28') &&
        v.path[2]?.startsWith('CC(27') &&
        v.path[3]?.startsWith('BB(25') &&
        v.path[4]?.startsWith('AA(24') &&
        v.path[5]?.startsWith('II(23') &&
        v.path[6]?.startsWith('JJ(21') &&
        v.path[7]?.startsWith('II(20') &&
        v.path[8]?.startsWith('AA(19') &&
        v.path[9]?.startsWith('DD(18') &&
        v.path[10]?.startsWith('EE(17') &&
        v.path[11]?.startsWith('FF(16') &&
        v.path[12]?.startsWith('GG(15') &&
        v.path[13]?.startsWith('HH(13')
      ) {
        console.log('Promising...');
        console.log(availableNeighbors);
        console.log(v.weight);
        console.log(v.branch);
        console.log(v.pruned);
        console.log(v.open);
        console.log(v.path.join('->'));
      }
      for (const neighbor of availableNeighbors) {
        const mybranch = new SetStack(v.branch);
        if (mybranch.peek(2) === neighbor) {
          mybranch.pop();
          mybranch.pop();
        }
        if ((mybranch.has(neighbor)) || (v.path.at(-2)?.startsWith(neighbor) && v.path.at(-3)?.startsWith(v.id))) {
          // Cycle
          //
          continue;
        }
        mybranch.push(neighbor);
        console.log(mybranch);
        const nn = nodes[neighbor];
        const nopen = v.open.has(neighbor);
        const next = (nopen ? 0 : (v.time - 2) * nn.rate);
        const openClone = new Set(v.open.values());
        if (!nopen && nn.rate > 0) {
          openClone.add(neighbor);
        }
        const nextTime = next > 0 ? v.time - 2 : v.time - 1;
        const pathStr = `${neighbor}(${nextTime}:${next}:${v.weight + next})`;
        enq(neighbor, v.weight + next, nextTime, openClone, [...v.path, pathStr], mybranch, mypruned);
        if (next) {
          const alt = `${neighbor}(${v.time - 1}:0*:${v.weight})`;
          enq(neighbor, v.weight, v.time - 1, new Set(v.open.values()), [...v.path, alt], mybranch, mypruned);
        }
      }
    } else {
      if (
        v.path[1]?.startsWith('DD(28') &&
        v.path[2]?.startsWith('CC(27') &&
        v.path[3]?.startsWith('BB(25') &&
        v.path[4]?.startsWith('AA(24') &&
        v.path[5]?.startsWith('II(23') &&
        v.path[6]?.startsWith('JJ(21') &&
        v.path[7]?.startsWith('II(20') &&
        v.path[8]?.startsWith('AA(19') &&
        v.path[9]?.startsWith('DD(18') &&
        v.path[10]?.startsWith('EE(17') &&
        v.path[11]?.startsWith('FF(16') &&
        v.path[12]?.startsWith('GG(15') //&&
        // v.path[13]?.startsWith('HH(13') &&
        // v.path[14]?.startsWith('GG(12') &&
        // v.path[15]?.startsWith('FF(11') &&
        // v.path[16]?.startsWith('EE(9:') &&
        // v.path[17]?.startsWith('DD(8:') &&
        // v.path[18]?.startsWith('CC(6:')
      ) {
        // console.log('Promising...');
        // console.log(v.weight);
        // console.log(v.pruned);
        // console.log(v.open);
        // console.log(v.path.join('->'));
      }
      if (v.weight > best) {
        best = v.weight;
        console.log(v.weight);
        console.log(v.pruned);
        console.log(v.open);
        console.log(v.path.join('->'));
      }
    }
  }
}

search('AA', 30);
console.log(`Best: ${best}`);