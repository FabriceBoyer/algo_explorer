import { describe, expect, it } from "vitest";
import { algorithms } from "../src/algorithms";
import { execute } from "../src/engine";
import { validateInput, randomInput } from "../src/inputs";
const find = (id: string) => algorithms.find((a) => a.id === id)!;
function run(id: string, data = find(id).data, target = find(id).target ?? 23) {
  const result = execute(find(id).code, data, target);
  expect(result.error).toBeUndefined();
  return result.frames.at(-1)!;
}
describe("workshop results, independently specified", () => {
  it.each([
    ["minimum", 8],
    ["sum", 272],
    ["mean", 34],
    ["inversion-count", 3],
    ["sliding-window", 9],
    ["factorial", 720],
    ["fast-power", 2187],
    ["primality", 1],
    ["lcm", 36],
    ["lis", 4],
    ["coin-change", 2],
    ["subset-sum", 1],
    ["prim", 16],
  ] as const)("%s has expected result", (id, expected) =>
    expect(run(id).vars.result).toBe(expected),
  );
  it("rotates left, right and by zero", () => {
    expect(run("rotate-array", [1, 2, 3, 4], 1).a).toEqual([4, 1, 2, 3]);
    expect(run("rotate-array", [1, 2, 3, 4], -1).a).toEqual([2, 3, 4, 1]);
    expect(run("rotate-array", [1], 0).a).toEqual([1]);
  });
  it("compacts duplicate values into a valid prefix", () => {
    const r = run("deduplicate");
    expect(r.a.slice(0, r.vars.result)).toEqual([1, 2, 4, 5]);
    expect(run("deduplicate", [1, 1, 1]).vars.result).toBe(1);
  });
  it("marks exactly the primes in its output interval", () => {
    const r = run("sieve");
    expect(r.a.flatMap((v, i) => (v ? [i] : []))).toEqual([
      2, 3, 5, 7, 11, 13, 17, 19, 23,
    ]);
    expect(run("sieve", [0]).a).toEqual([0]);
  });
  it("handles arithmetic boundary cases", () => {
    expect(run("factorial", [0]).vars.result).toBe(1);
    expect(run("fast-power", [7, 0]).vars.result).toBe(1);
    for (const value of [0, 1, 4, 25, 100])
      expect(run("primality", [value]).vars.result).toBe(0);
  });
  it("handles unreachable and empty DP targets", () => {
    expect(run("coin-change", [2, 4], 3).vars.result).toBe(-1);
    expect(run("coin-change", [2, 4], 0).vars.result).toBe(0);
    expect(run("subset-sum", [2], 4).vars.result).toBe(0);
    expect(run("subset-sum", [0, 2], 0).vars.result).toBe(1);
    expect(run("lis", [3, 3, 3]).vars.result).toBe(1);
  });
  it("BFS and DFS visit each reachable vertex once", () => {
    expect(run("bfs").arrays.order).toEqual([0, 1, 3, 2, 4]);
    expect(run("dfs").arrays.order).toEqual([0, 1, 2, 4, 3]);
    for (const id of ["bfs", "dfs"]) {
      const r = run(id, [0, 1, 0, 1, 0, 0, 0, 0, 0], 0);
      expect(r.vars.result).toBe(2);
      expect(r.arrays.visited).toEqual([1, 1, 0]);
    }
  });
  it("Dijkstra computes distances and parents", () => {
    const r = run("dijkstra");
    expect(r.arrays.dist).toEqual([0, 2, 5, 6, 7]);
    expect(r.arrays.parent).toEqual([-1, 0, 1, 0, 1]);
    expect(run("dijkstra", [0, 0, 0, 0], 0).arrays.dist).toEqual([0, 1e9]);
  });
  it("Bellman-Ford supports negative edges and detects reachable cycles", () => {
    expect(run("bellman-ford").arrays.dist).toEqual([0, 4, 2, 5, 7]);
    expect(run("bellman-ford").vars.negative_cycle).toBe(0);
    expect(run("bellman-ford", [0, -1, -1, 0], 0).vars.negative_cycle).toBe(1);
  });
  it("Prim reports disconnected input", () =>
    expect(run("prim", [0, 0, 0, 0], 0).vars.result).toBe(-1));
  it("Kahn produces a valid ordering or flags a cycle", () => {
    const a = find("topological-sort");
    const r = run(a.id);
    expect(r.vars.has_cycle).toBe(0);
    const order = r.arrays.order;
    for (let u = 0; u < 5; u++)
      for (let v = 0; v < 5; v++)
        if (a.data[u * 5 + v])
          expect(order.indexOf(u)).toBeLessThan(order.indexOf(v));
    expect(run(a.id, [0, 1, 1, 0], 0).vars.has_cycle).toBe(1);
  });
  it("Floyd-Warshall agrees with shortest paths and flags negative cycles", () => {
    const r = run("floyd-warshall");
    expect(r.arrays.dist).toEqual([
      0, 2, 5, 6, 7, 2, 0, 3, 8, 5, 5, 3, 0, 11, 7, 6, 8, 11, 0, 9, 7, 5, 7, 9,
      0,
    ]);
    expect(r.vars.negative_cycle).toBe(0);
    expect(run("floyd-warshall", [0, -1, -1, 0], 0).vars.negative_cycle).toBe(
      1,
    );
  });
});
describe("auxiliary memory and validation", () => {
  it("traces immutable buffers and allows safe prototype-like identifiers", () => {
    const r = execute(
      "array __proto__[2]\n__proto__[0] <- 7\nx <- __proto__[0]",
      [1],
    );
    expect(r.error).toBeUndefined();
    expect(r.frames[1].arrays.__proto__).toEqual([0, 0]);
    expect(r.frames.at(-1)!.vars.x).toBe(7);
    expect(r.frames[2].arrayWrites.__proto__).toEqual([0]);
  });
  it("bounds total allocation and reinitializes declared buffers", () => {
    expect(
      execute(
        "array b[256]\narray c[256]\narray d[256]\narray e[256]\narray f[1]",
        [1],
      ).error,
    ).toContain("allocation");
    const r = execute("array b[2]\nb[0] <- 9\narray b[1]", [1]);
    expect(r.frames.at(-1)!.arrays.b).toEqual([0]);
  });
  it("all default inputs and generated random inputs satisfy metadata constraints", () => {
    for (const a of algorithms) {
      expect(() =>
        validateInput(a, a.data, a.target ?? 23, "en"),
      ).not.toThrow();
      expect(() =>
        validateInput(a, randomInput(a), a.target ?? 23, "en"),
      ).not.toThrow();
    }
  });
  it.each([
    ["dijkstra", [0, -1, 1, 0], 0],
    ["prim", [0, 1, 0, 0], 0],
    ["bfs", [0, 1, 0], 0],
    ["bfs", [0, 1, 1, 0], 2],
    ["factorial", [15], 0],
    ["coin-change", [0, 1], 6],
    ["subset-sum", [2], 65],
    ["sliding-window", [1, 2], 3],
  ] as const)("rejects unsupported %s input", (id, data, target) =>
    expect(() => validateInput(find(id), [...data], target, "en")).toThrow(),
  );
});
