import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";

let X = 1;
let signal = 0;

type Operation = { time: number; invoke: (v: number) => void };
type Instruction = { op: string, input: number };
const addx: Operation = {
  time: 2,
  invoke(value: number) {
    X = X + value;
  }
};

const noop: Operation = {
  time: 1,
  invoke(_: number) {}
}

const ops: Record<string, Operation> = {
  addx,
  noop
};

function run(program: Instruction[]) {
  let cycle = 1;
  const code = [...program];
  let current: Instruction | undefined;
  let busy = 0;
  while (code.length) {
    if (!current) {
      current = code.shift();
      if (current) {
        busy = ops[current.op].time;
      }
    }
    if (busy) { busy--; } // Do work ;)

    if (cycle % 40 === 20) {
      signal += (cycle * X);
    }

    if (current && !busy) {
      ops[current.op].invoke(current.input);
      current = undefined;
    }
    cycle++;
  }
}

const prog: Instruction[] = [];
for await (const line of readLines(Deno.stdin)) {
  const [op, value] = line.split(' ');
  const input = value ? parseInt(value, 10) : 0;
  prog.push({op, input});
}
run(prog);

console.log(signal);
