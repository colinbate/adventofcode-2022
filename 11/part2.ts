import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";

interface Monkey {
  id: number;
  items: number[];
  mod: number;
  success: number;
  fail: number;
  op: 'add' | 'mult';
  value?: number;
  total: number;
}

const math = {
  add(worry: number, value: number | undefined) {
    return value == null ? worry + worry : worry + value;
  },
  mult(worry: number, value: number | undefined) {
    return value == null ? worry * worry : worry * value;
  },
};

function turn(m: Monkey, mlist: Monkey[], prod: number) {
  let worry = m.items.shift();
  while (worry != null) {
    worry = math[m.op].call(null, worry, m.value);
    worry = worry % prod;
    if (worry % m.mod === 0) {
      mlist[m.success].items.push(worry);
    } else {
      mlist[m.fail].items.push(worry);
    }
    m.total += 1;
    worry = m.items.shift();
  }
}

function shenanigans(mlist: Monkey[], rounds: number, prod: number) {
  for (let ii = 0; ii < rounds; ii += 1) {
    for (let mm = 0; mm < mlist.length; mm += 1) {
      turn(mlist[mm], mlist, prod);
    }
  }
}

function getMonkeyBusiness(mlist: Monkey[]) {
  const slist = [...mlist].sort((a, b) => b.total - a.total);
  return slist[0].total * slist[1].total;
}

const ops = {'*': 'mult', '+': 'add'} as const;
const monkeys: Monkey[] = [];
let current: Partial<Monkey> = { total: 0 };
let part = 0;

for await (const line of readLines(Deno.stdin)) {
  if (line === '') {
    continue;
  }
  const tokens = line.trim().split(' ');
  if (part === 0) {
    current.id = parseInt(tokens[1].replace(':', ''), 10);
  } else if (part === 1) {
    current.items = tokens.slice(2).map(x => parseInt(x.replace(',', ''), 10));
  } else if (part === 2) {
    current.op = ops[tokens[4] as '*' | '+'];
    current.value = tokens[5] === 'old' ? undefined : parseInt(tokens[5], 10);
  } else if (part === 3) {
    current.mod = parseInt(tokens[3]);
  } else if (part === 4) {
    current.success = parseInt(tokens[5], 10);
  } else if (part === 5) {
    current.fail = parseInt(tokens[5], 10);
    monkeys.push(current as Monkey);
    current = {total: 0};
    part = -1;
  }
  part++;
}

const product = monkeys.reduce((p, c) => p * c.mod, 1);

shenanigans(monkeys, 10000, product);
console.log(getMonkeyBusiness(monkeys));
