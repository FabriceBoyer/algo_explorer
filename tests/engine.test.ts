import { describe, expect, it } from "vitest";
import { algorithms } from "../src/algorithms";
import { execute, parseData, parseProgram } from "../src/engine";
import { exportProgram } from "../src/export";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
describe("pseudocode interpreter", () => {
  for (const algorithm of algorithms)
    it(`executes ${algorithm.id}`, () => {
      const run = execute(algorithm.code, algorithm.data, algorithm.target);
      expect(run.error).toBeUndefined();
      const final = run.frames.at(-1)!;
      if (algorithm.category === "sorting")
        expect(final.a).toEqual([...algorithm.data].sort((a, b) => a - b));
      if (algorithm.category === "search")
        expect(final.vars.result).toBe(
          algorithm.data.indexOf(algorithm.target!),
        );
      if (algorithm.id === "maximum") expect(final.vars.result).toBe(61);
      if (algorithm.id === "prefix-sum")
        expect(final.a).toEqual([3, 4, 8, 9, 14, 23, 25, 31]);
      if (algorithm.id === "reverse")
        expect(final.a).toEqual([...algorithm.data].reverse());
      if (algorithm.id === "kadane") expect(final.vars.result).toBe(6);
      if (algorithm.id === "euclid") expect(final.vars.result).toBe(6);
      if (algorithm.id === "fibonacci")
        expect(final.a).toEqual([0, 1, 1, 2, 3, 5, 8, 13, 21, 34]);
      expect(run.frames[0].a).toEqual(algorithm.data);
    });
  for (const algorithm of algorithms.filter((a) => a.category === "sorting"))
    for (const data of [
      [1],
      [2, 2, 2],
      [3, -2, 0, -2],
      [-2, -1, 0],
      [6, 5, 4, 3, 2, 1],
    ])
      it(`${algorithm.id} handles ${data}`, () =>
        expect(execute(algorithm.code, data).frames.at(-1)!.a).toEqual(
          [...data].sort((a, b) => a - b),
        ));
  for (const algorithm of algorithms.filter((a) => a.category === "search"))
    it(`${algorithm.id}: missing and duplicate targets`, () => {
      expect(
        execute(algorithm.code, [1, 2, 2, 4], 8).frames.at(-1)!.vars.result,
      ).toBe(-1);
      const result = execute(algorithm.code, [1, 2, 2, 4], 2).frames.at(-1)!
        .vars.result;
      expect([1, 2]).toContain(result);
    });
  it("preserves immutable previous states and highlights reads and writes", () => {
    const r = execute("swap a[0], a[1]", [8, 3]);
    expect(r.frames[0].a).toEqual([8, 3]);
    expect(r.frames[1]).toMatchObject({
      a: [3, 8],
      reads: [0, 1],
      writes: [0, 1],
      line: 1,
    });
  });
  it("short circuits before unsafe array access", () =>
    expect(
      execute("i <- -1\nif i >= 0 && a[i] > 0\n x <- 1\nend", [1]).error,
    ).toBeUndefined());
  it("uses signed remainder and floating division", () =>
    expect(
      execute("x <- -5 % 3\ny <- 5 / 2", [1]).frames.at(-1)!.vars,
    ).toMatchObject({ x: -2, y: 2.5 }));
  it("evaluates precedence, unary and nested branches", () =>
    expect(
      execute(
        "if !(1 + 2 * 3 == 8)\n if 0\n x <- 0\n else\n x <- 42\n end\nelse\n x <- -1\nend",
        [1],
      ).frames.at(-1)!.vars.x,
    ).toBe(42));
  it("bounds runaway execution", () =>
    expect(execute("while 1\nend", [1]).error).toContain("limit"));
  it("retains valid frames before an error", () => {
    const r = execute("x <- 4\ny <- a[2]", [1]);
    expect(r.error).toContain("L2");
    expect(r.frames.at(-1)!.vars.x).toBe(4);
  });
  it.each([
    "x <- 1 / 0",
    "x <- unknown",
    "x <- a[-1]",
    "x <- a[0.5]",
    "x <- 10000000000000",
  ])("reports runtime error: %s", (code) =>
    expect(execute(code, [1]).error).toBeTruthy(),
  );
  it.each([
    "while 1",
    "end",
    "else",
    "n <- 0",
    "a <- 1",
    "x[0] <- 1",
    "x = 1",
    "x <- alert(1)",
    "if 1\nelse\nelse\nend",
  ])("rejects malformed code: %s", (code) =>
    expect(() => parseProgram(code)).toThrow(),
  );
  it("never resolves inherited object properties", () =>
    expect(execute("x <- constructor", [1]).error).toContain("Undefined"));
  it("accepts prototype-like identifiers as plain variables", () =>
    expect(
      execute("__proto__ <- 2\nx <- __proto__", [1]).frames.at(-1)!.vars.x,
    ).toBe(2));
  it("validates array bounds and finite input", () => {
    expect(parseData("1, -2; 3.5")).toEqual([1, -2, 3.5]);
    for (const s of [
      "",
      "NaN",
      "Infinity",
      "1000001",
      Array(65).fill(0).join(","),
    ])
      expect(() => parseData(s)).toThrow();
  });
});
describe("native exports match interpreter output", () => {
  for (const language of ["python", "go", "c"] as const)
    for (const algorithm of [
      ...algorithms,
      {
        id: "numeric-experiment",
        data: [1, -2, 3],
        target: 23,
        code: "x <- 1000000 * 1000000\ny <- 1 < 2\nz <- -5 % 3\na[0] <- 5 / 2\nif 0 && a[-1]\n  x <- 0\nend\nif y\n  a[1] <- x / 1000000\nelse\n  a[1] <- -1\nend",
      },
    ])
      it(`${language}: ${algorithm.id}`, () => {
        const dir = mkdtempSync(join(tmpdir(), "algo-export-"));
        const file = join(
          dir,
          `main.${language === "python" ? "py" : language}`,
        );
        try {
          writeFileSync(
            file,
            exportProgram(
              algorithm.code,
              algorithm.data,
              algorithm.target ?? 23,
              language,
            ),
          );
          let output: string;
          if (language === "python")
            output = execFileSync("python3", [file], { encoding: "utf8" });
          else if (language === "go")
            output = execFileSync("go", ["run", file], {
              encoding: "utf8",
              env: { ...process.env, GOCACHE: join(tmpdir(), "algo-go-cache") },
            });
          else {
            const binary = join(dir, "main");
            execFileSync("gcc", ["-std=c11", file, "-lm", "-o", binary]);
            output = execFileSync(binary, [], { encoding: "utf8" });
          }
          const result = JSON.parse(output.trim().split("\n").at(-1)!);
          const expected = execute(
            algorithm.code,
            algorithm.data,
            algorithm.target ?? 23,
          ).frames.at(-1)!;
          expect(result.a).toEqual(expected.a);
          expect(result.variables).toEqual(expected.vars);
        } finally {
          rmSync(dir, { recursive: true, force: true });
        }
      }, 60000);
});
