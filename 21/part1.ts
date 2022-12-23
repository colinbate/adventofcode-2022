import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";
const ops = {
  '*': (a: number,b:number) => a * b,
  '+': (a: number,b:number) => a + b,
  '/': (a: number,b:number) => a / b,
  '-': (a: number,b:number) => a - b,
};
type Op = keyof typeof ops;
type Monkey = { v?: number, op?: Op, d1?: string, d2?: string };
const ready = new Map<string, Monkey>();
const waiting = new Map<string, Monkey>();
for await (const line of readLines(Deno.stdin)) {
  const [name, data] = line.split(': ');
  if (data.includes(' ')) {
    const [d1, op, d2] = data.split(' ');
    const m = { op: op as Op, d1, d2 };
    waiting.set(name, m);
  } else {
    const v = parseInt(data, 10);
    const m = { v };
    ready.set(name, m);
  }
}

console.log(ready.size, waiting.size);

while (!ready.has('root')) {
  const current = Array.from(waiting.entries());
  for (const [name, monkey] of current) {
    if (monkey.d1 && ready.has(monkey.d1) && monkey.d2 && ready.has(monkey.d2) && monkey.op) {
      const v = ops[monkey.op].call(null, ready.get(monkey.d1)!.v!, ready.get(monkey.d2)!.v!);
      ready.set(name, { v });
      waiting.delete(name);
    }
  }
}

console.log(`root: ${ready.get('root')!.v}`);
