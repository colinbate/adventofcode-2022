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
let total = 0;
for await (const line of readLines(Deno.stdin)) {
  const [a, b, c] = line.split(' ');
  if (a === '$') {
    if (b === 'cd') {
      if (c === '/') { cwd = root; }
      else if (c === '..') {
        if (cwd.parent) {
          if (cwd.size <= 100000) {
            total += cwd.size;
          }
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

console.log(total);