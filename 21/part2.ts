//
// I ended up solving this manually with a binary search because I was way too tired to code it up.
//

import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";
const ops = {
  '*': (a: number,b:number) => a * b,
  '+': (a: number,b:number) => a + b,
  '/': (a: number,b:number) => a / b,
  '-': (a: number,b:number) => a - b,
  '=': (a: number,b:number) => (console.log('equal', a, '=', b), 0),
};
type Op = keyof typeof ops;
type Monkey = { v?: number, op?: Op, d1?: string, d2?: string };
const monkeys = new Map<string, Monkey>();
for await (const line of readLines(Deno.stdin)) {
  const [name, data] = line.split(': ');
  if (data.includes(' ')) {
    let [d1, op, d2] = data.split(' ');
    if (name === 'root') {
      op = '=';
    }
    const m = { op: op as Op, d1, d2 };
    monkeys.set(name, m);
  } else {
    let v = parseInt(data, 10);
    if (name === 'humn') {
      v = 3759566892641;
      console.log('humn', v);
    }
    const m = { v };
    monkeys.set(name, m);
  }
}

console.log(monkeys.size);

console.debug('root', monkeys.get('root'));
function find(root: string) {
  const stack: Monkey[] = [];
  stack.push(monkeys.get(root)!);
  while (stack.length) {
    const cm = stack.at(-1)!;
    if (cm.d1 === 'humn' || cm.d2 === 'humn') {
      console.log('found you');
    }
    if (cm.v == null) {
      const m1 = monkeys.get(cm.d1!)!;
      const m2 = monkeys.get(cm.d2!)!;
      if (m1.v != null && m2.v != null && cm.op) {
        const v = ops[cm.op].call(null, m1.v, m2.v);
        cm.v = v;
        stack.pop();
      } else {
        if (m1.v == null) {
          stack.push(m1);
        }
        if (m2.v == null) {
          stack.push(m2);
        }
      }
    } else {
      stack.pop();
    }
  }
}

find('root');

//find('pppw');
//find('bsbd');

//find('sjmn');
//find('fcgj');
