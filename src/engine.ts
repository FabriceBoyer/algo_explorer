/** A bounded numeric pseudocode interpreter. No eval, Function or user JS. */
export type Expr =
  | { kind: "number"; value: number }
  | { kind: "var"; name: string }
  | { kind: "index"; name: string; index: Expr }
  | { kind: "unary"; op: string; value: Expr }
  | { kind: "binary"; op: string; left: Expr; right: Expr };
export type Target = { name: string; index?: Expr };
export type Node = { line: number; text: string } & (
  | { kind: "set"; target: Target; value: Expr }
  | { kind: "swap"; left: Expr; right: Expr }
  | { kind: "while" | "if"; condition: Expr; body: Node[]; otherwise: Node[] }
  | { kind: "array"; name: string; size: Expr }
  | { kind: "emit" }
);
export type Instruction = { node: Node; jump?: number; branch?: boolean };
export type Frame = {
  a: number[];
  arrays: Record<string, number[]>;
  arrayReads: Record<string, number[]>;
  arrayWrites: Record<string, number[]>;
  vars: Record<string, number>;
  line: number;
  reads: number[];
  writes: number[];
  text: string;
};
export class AlgorithmError extends Error {}
const precedence: Record<string, number> = {
  "||": 1,
  "&&": 2,
  "==": 3,
  "!=": 3,
  "<": 4,
  ">": 4,
  "<=": 4,
  ">=": 4,
  "+": 5,
  "-": 5,
  "*": 6,
  "/": 6,
  "%": 6,
};
export function expression(source: string): Expr {
  const tokens =
    source.match(
      /\d+(?:\.\d+)?|[a-zA-Z_]\w*|==|!=|<=|>=|&&|\|\||[+\-*/%<>!()[\]]/g,
    ) || [];
  if (tokens.join("") !== source.replace(/\s/g, ""))
    throw new AlgorithmError(`Invalid expression: ${source}`);
  let pos = 0;
  function parse(min = 0): Expr {
    const token = tokens[pos++];
    let left: Expr;
    if (token === "-" || token === "!" || token === "+")
      left = { kind: "unary", op: token, value: parse(7) };
    else if (token === "(") {
      left = parse();
      if (tokens[pos++] !== ")") throw new AlgorithmError("Expected )");
    } else if (token && /^\d/.test(token))
      left = { kind: "number", value: Number(token) };
    else if (token && /^[a-zA-Z_]\w*$/.test(token)) {
      if (tokens[pos] === "[") {
        pos++;
        const index = parse();
        if (tokens[pos++] !== "]") throw new AlgorithmError("Expected ]");
        left = { kind: "index", name: token, index };
      } else left = { kind: "var", name: token };
    } else throw new AlgorithmError(`Expected expression: ${source}`);
    while (pos < tokens.length && (precedence[tokens[pos]] ?? -1) >= min) {
      const op = tokens[pos++];
      left = { kind: "binary", op, left, right: parse(precedence[op] + 1) };
    }
    return left;
  }
  const result = parse();
  if (pos !== tokens.length)
    throw new AlgorithmError(`Unexpected token: ${tokens[pos]}`);
  return result;
}
export function parseProgram(source: string): Node[] {
  if (source.length > 20000)
    throw new AlgorithmError("Program too large (20,000 characters maximum)");
  const root: Node[] = [];
  let body = root;
  const stack: {
    node: Extract<Node, { kind: "while" | "if" }>;
    parent: Node[];
    hasElse: boolean;
  }[] = [];
  source.split("\n").forEach((raw, index) => {
    const text = raw.split("#")[0].trim();
    const line = index + 1;
    if (!text) return;
    try {
      if (text === "end") {
        const top = stack.pop();
        if (!top) throw new AlgorithmError("Unexpected end");
        body = top.parent;
        return;
      }
      if (text === "else") {
        const top = stack.at(-1);
        if (!top || top.node.kind !== "if" || top.hasElse)
          throw new AlgorithmError("Unexpected else");
        top.hasElse = true;
        body = top.node.otherwise;
        return;
      }
      const block = /^(while|if)\s+(.+)$/.exec(text);
      if (block) {
        if (stack.length >= 32) throw new AlgorithmError("Maximum nesting: 32");
        const node: Extract<Node, { kind: "while" | "if" }> = {
          kind: block[1] as "while" | "if",
          condition: expression(block[2]),
          body: [],
          otherwise: [],
          line,
          text,
        };
        body.push(node);
        stack.push({ node, parent: body, hasElse: false });
        body = node.body;
        return;
      }
      if (text === "emit") {
        body.push({ kind: "emit", line, text });
        return;
      }
      const declaration = /^array\s+([a-zA-Z_]\w*)\[(.+)\]$/.exec(text);
      if (declaration) {
        const [, name, size] = declaration;
        if (["a", "n", "target"].includes(name))
          throw new AlgorithmError("Reserved array name");
        body.push({ kind: "array", name, size: expression(size), line, text });
        return;
      }
      const swap = /^swap\s+a\[(.+)\]\s*,\s*a\[(.+)\]$/.exec(text);
      if (swap) {
        body.push({
          kind: "swap",
          left: expression(swap[1]),
          right: expression(swap[2]),
          line,
          text,
        });
        return;
      }
      const assignment = /^([a-zA-Z_]\w*)(?:\[(.+)\])?\s*<-\s*(.+)$/.exec(text);
      if (!assignment)
        throw new AlgorithmError(
          "Expected assignment (<-), if, while, swap, emit or end",
        );
      const [, name, subscript, value] = assignment;
      if (name === "n" || (name === "a" && !subscript))
        throw new AlgorithmError("n is read-only; a requires indexing");
      body.push({
        kind: "set",
        target: { name, index: subscript ? expression(subscript) : undefined },
        value: expression(value),
        line,
        text,
      });
    } catch (e) {
      throw new AlgorithmError(`L${line}: ${(e as Error).message}`);
    }
  });
  if (stack.length)
    throw new AlgorithmError(`L${stack.at(-1)!.node.line}: Missing end`);
  if (!root.length) throw new AlgorithmError("Empty program");
  return root;
}
export function compile(nodes: Node[]): Instruction[] {
  const code: Instruction[] = [];
  function walk(body: Node[]) {
    for (const node of body) {
      const start = code.length;
      code.push({ node });
      if (node.kind === "while" || node.kind === "if") {
        walk(node.body);
        if (node.kind === "while")
          code.push({ node, jump: start, branch: true });
        else if (node.otherwise.length) {
          const skip = code.length;
          code.push({ node, branch: true });
          code[start].jump = code.length;
          walk(node.otherwise);
          code[skip].jump = code.length;
          continue;
        }
        code[start].jump = code.length;
      }
    }
  }
  walk(nodes);
  return code;
}
export function parseData(source: string): number[] {
  const values = source
    .trim()
    .split(/[\s,;]+/)
    .filter(Boolean)
    .map(Number);
  if (
    !values.length ||
    values.length > 64 ||
    values.some((v) => !Number.isFinite(v) || Math.abs(v) > 1000000)
  )
    throw new AlgorithmError(
      "Data: 1–64 finite numbers, between -1000000 and 1000000",
    );
  return values;
}
export function execute(
  source: string,
  input: number[],
  target = 23,
): { nodes: Node[]; frames: Frame[]; error?: string } {
  const nodes = parseProgram(source);
  const code = compile(nodes);
  const a = [...input];
  const arrays: Record<string, number[]> = Object.create(null);
  let arrayReads: Record<string, number[]> = Object.create(null);
  let arrayWrites: Record<string, number[]> = Object.create(null);
  let evaluations = 0;
  let storedCells = 0;
  const vars: Record<string, number> = Object.assign(Object.create(null), {
    n: a.length,
    target,
  });
  const frames: Frame[] = [
    {
      a: [...a],
      arrays: {},
      arrayReads: {},
      arrayWrites: {},
      vars: { ...vars },
      line: 0,
      reads: [],
      writes: [],
      text: "ready",
    },
  ];
  let pc = 0;
  let count = 0;
  let reads: number[] = [];
  let writes: number[] = [];
  const buffer = (name: string): number[] => {
    if (name === "a") return a;
    if (!Object.hasOwn(arrays, name))
      throw new AlgorithmError(`Undefined array: ${name}`);
    return arrays[name];
  };
  const index = (v: number, name = "a") => {
    const length = buffer(name).length;
    if (!Number.isInteger(v) || v < 0 || v >= length)
      throw new AlgorithmError(`Index ${v} outside [0, ${length - 1}]`);
    return v;
  };
  function val(e: Expr): number {
    if (++evaluations > 500000)
      throw new AlgorithmError("Expression limit exceeded");
    if (e.kind === "number") return e.value;
    if (e.kind === "var") {
      if (!Object.hasOwn(vars, e.name))
        throw new AlgorithmError(`Undefined variable: ${e.name}`);
      return vars[e.name];
    }
    if (e.kind === "index") {
      const i = index(val(e.index), e.name);
      if (e.name === "a") reads.push(i);
      else (arrayReads[e.name] ??= []).push(i);
      return buffer(e.name)[i];
    }
    if (e.kind === "unary") {
      const v = val(e.value);
      return e.op === "-" ? -v : e.op === "!" ? Number(!v) : v;
    }
    const l = val(e.left);
    if (e.op === "&&" && !l) return 0;
    if (e.op === "||" && l) return 1;
    const r = val(e.right);
    if ((e.op === "/" || e.op === "%") && r === 0)
      throw new AlgorithmError("Division by zero");
    switch (e.op) {
      case "+":
        return l + r;
      case "-":
        return l - r;
      case "*":
        return l * r;
      case "/":
        return l / r;
      case "%":
        return l % r;
      case "<":
        return Number(l < r);
      case ">":
        return Number(l > r);
      case "<=":
        return Number(l <= r);
      case ">=":
        return Number(l >= r);
      case "==":
        return Number(l === r);
      case "!=":
        return Number(l !== r);
      case "&&":
        return Number(Boolean(r));
      case "||":
        return Number(Boolean(r));
      default:
        throw new AlgorithmError("Unknown operator");
    }
  }
  try {
    while (pc < code.length) {
      if (++count > 10000 || frames.length >= 5001)
        throw new AlgorithmError(
          "Execution limit reached (5,000 steps / 10,000 instructions)",
        );
      const instruction = code[pc];
      const node = instruction.node;
      reads = [];
      writes = [];
      arrayReads = Object.create(null);
      arrayWrites = Object.create(null);
      if (instruction.branch) {
        pc = instruction.jump!;
        continue;
      }
      if (node.kind === "array") {
        const size = val(node.size);
        const total = Object.entries(arrays).reduce(
          (sum, [name, values]) =>
            sum + (name === node.name ? 0 : values.length),
          0,
        );
        if (
          !Number.isInteger(size) ||
          size < 1 ||
          size > 256 ||
          total + size > 1024 ||
          (!Object.hasOwn(arrays, node.name) &&
            Object.keys(arrays).length >= 32)
        )
          throw new AlgorithmError(
            "Array allocation limit (1–256 cells, 32 arrays, 1024 total)",
          );
        arrays[node.name] = Array(size).fill(0);
        pc++;
      } else if (node.kind === "set") {
        const v = val(node.value);
        if (!Number.isFinite(v) || Math.abs(v) > 1e12)
          throw new AlgorithmError("Numeric limit exceeded");
        if (node.target.index) {
          const i = index(val(node.target.index), node.target.name);
          buffer(node.target.name)[i] = v;
          if (node.target.name === "a") writes.push(i);
          else (arrayWrites[node.target.name] ??= []).push(i);
        } else vars[node.target.name] = v;
        pc++;
      } else if (node.kind === "swap") {
        const l = index(val(node.left));
        const r = index(val(node.right));
        [a[l], a[r]] = [a[r], a[l]];
        reads.push(l, r);
        writes.push(l, r);
        pc++;
      } else if (node.kind === "if" || node.kind === "while")
        pc = val(node.condition) ? pc + 1 : instruction.jump!;
      else pc++;
      storedCells +=
        a.length +
        Object.values(arrays).reduce((s, a) => s + a.length, 0) +
        Object.keys(vars).length;
      if (storedCells > 2000000)
        throw new AlgorithmError("Trace memory limit exceeded");
      frames.push({
        arrays: Object.fromEntries(
          Object.entries(arrays).map(([name, values]) => [name, [...values]]),
        ),
        arrayReads,
        arrayWrites,
        a: [...a],
        vars: { ...vars },
        line: node.line,
        reads: [...new Set(reads)],
        writes: [...new Set(writes)],
        text: node.text,
      });
    }
    return { nodes, frames };
  } catch (e) {
    return {
      nodes,
      frames,
      error: `L${code[pc]?.node.line ?? "?"}: ${(e as Error).message}`,
    };
  }
}
