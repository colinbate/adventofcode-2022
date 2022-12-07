import { readLines } from "https://deno.land/std@0.167.0/io/mod.ts";

interface File { dir: false; name: string; size: number }
interface Dir { dir: true; name: string; size: number; parent: Dir | undefined; children: Record<string, (File | Dir)> }

const root: Dir = {
  dir: true,
  name: '/',
  size: 0,
  parent: undefined,
  children: {}
};
let cwd: Dir = root;
for await (const line of readLines(Deno.stdin)) {
  const [a, b, c] = line.split(' ');
  if (a === '$') {
    if (b === 'cd') {
      if (c === '/') { cwd = root; }
      else if (c === '..') {
        if (cwd.parent) {
          cwd = cwd.parent;
        }
      } else {
        if (c in cwd.children) {
          const child = cwd.children[c];
          if (child.dir) {
            cwd = child;
          }
        }
      }
    }
  } else if (a === 'dir') {
    cwd.children[b] = ({dir: true, name: b, size: 0, parent: cwd, children: {}});
  } else {
    const size = parseInt(a, 10);
    cwd.children[b] = ({dir: false, name: b, size});
    let p: Dir | undefined = cwd;
    while (p) {
      p.size += size;
      p = p.parent;
    }
  }
}

const TOTAL = 70000000;
const NEED = 30000000;
const free = TOTAL - root.size;
const extra = NEED - free;
let smallest = root;

function travel(d: Dir) {
  const kids = Object.keys(d.children);
  for (const k of kids) {
    const child = d.children[k];
    if (child.dir) {
      if (child.size >= extra && child.size < smallest.size) {
        smallest = child;
      }
      travel(child);
    }
  }
}
travel(root);

console.log(smallest.size);