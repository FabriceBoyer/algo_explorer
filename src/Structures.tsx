import type { Frame } from "./engine";
import type { Locale } from "./algorithms";
const valueLabel = (v: number) =>
  v === 1000000000
    ? "∞"
    : Number.isInteger(v)
      ? v
      : String(Number(v.toFixed(2)));
export function GraphView({
  frame,
  locale,
  source,
}: {
  frame: Frame;
  locale: Locale;
  source: number;
}) {
  const count = Math.sqrt(frame.a.length);
  if (!Number.isInteger(count) || count < 2 || count > 8)
    return (
      <p className="empty">
        {locale === "fr"
          ? "Matrice carrée de 2 à 8 sommets requise."
          : "A square matrix with 2–8 vertices is required."}
      </p>
    );
  const points = Array.from({ length: count }, (_, i) => ({
    x: 250 + 155 * Math.cos((2 * Math.PI * i) / count - Math.PI / 2),
    y: 165 + 115 * Math.sin((2 * Math.PI * i) / count - Math.PI / 2),
  }));
  const symmetric = frame.a.every(
    (w, i) => w === frame.a[(i % count) * count + Math.floor(i / count)],
  );
  const parents = frame.arrays.parent;
  const dist =
    frame.arrays.dist?.length === count ? frame.arrays.dist : undefined;
  return (
    <div className="graph-view">
      <svg
        viewBox="0 0 500 340"
        role="img"
        aria-label={
          locale === "fr"
            ? `Graphe de ${count} sommets`
            : `Graph with ${count} vertices`
        }
      >
        <defs>
          <marker
            id="edge-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" />
          </marker>
        </defs>
        {frame.a.map((weight, index) => {
          const u = Math.floor(index / count),
            v = index % count;
          if (!weight || u === v || (symmetric && v < u)) return null;
          const p = points[u],
            q = points[v];
          const dx = q.x - p.x,
            dy = q.y - p.y,
            length = Math.hypot(dx, dy);
          const offset = !symmetric && frame.a[v * count + u] !== 0 ? 25 : 0;
          const mx = (p.x + q.x) / 2 - (dy / length) * offset,
            my = (p.y + q.y) / 2 + (dx / length) * offset;
          const path = `M ${p.x + (dx / length) * 23} ${p.y + (dy / length) * 23} Q ${mx} ${my} ${q.x - (dx / length) * 25} ${q.y - (dy / length) * 25}`;
          const active =
            frame.reads.includes(index) ||
            (symmetric && frame.reads.includes(v * count + u));
          const tree =
            parents && (parents[v] === u || (symmetric && parents[u] === v));
          return (
            <g
              key={index}
              className={`graph-edge ${active ? "edge-active" : ""} ${tree ? "edge-tree" : ""}`}
            >
              <path
                d={path}
                markerEnd={!symmetric ? "url(#edge-arrow)" : undefined}
              />
              <rect x={mx - 13} y={my - 10} width="26" height="20" rx="7" />
              <text x={mx} y={my + 4}>
                {weight}
              </text>
            </g>
          );
        })}
        {points.map((p, i) => {
          const visited = frame.arrays.visited?.[i];
          const active = frame.vars.u === i;
          const updated = Object.values(frame.arrayWrites).some((indices) =>
            indices.includes(i),
          );
          return (
            <g
              key={i}
              transform={`translate(${p.x},${p.y})`}
              className={`graph-node ${visited ? "visited" : ""} ${active ? "node-active" : ""} ${updated ? "node-updated" : ""}`}
            >
              <circle className="node-halo" r="29" />
              <circle r="21" />
              <text y="5">{String.fromCharCode(65 + i)}</text>
              <text className="node-distance" y="43">
                {dist
                  ? `d=${valueLabel(dist[i])}`
                  : i === source
                    ? locale === "fr"
                      ? "départ"
                      : "start"
                    : String(i)}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="graph-key">
        {locale === "fr"
          ? "Bleu : arête lue · Corail : lien parent · Halo : sommet courant"
          : "Blue: read edge · Coral: parent link · Halo: current vertex"}
      </p>
    </div>
  );
}
export function BufferView({
  frame,
  previous,
  locale,
  matrixSize,
}: {
  frame: Frame;
  previous?: Frame;
  locale: Locale;
  matrixSize?: number;
}) {
  if (!Object.keys(frame.arrays).length) return null;
  return (
    <section className="buffer-panel">
      <h3>
        {locale === "fr" ? "Structures de travail" : "Working structures"}
        <span>{Object.keys(frame.arrays).length}</span>
      </h3>
      {Object.entries(frame.arrays).map(([name, values]) => {
        const matrix = matrixSize && values.length === matrixSize * matrixSize;
        return (
          <div className="buffer" key={name}>
            <div className="buffer-heading">
              <code>{name}</code>
              <small>
                {matrix
                  ? `${matrixSize} × ${matrixSize}`
                  : `${values.length} ${locale === "fr" ? "cellules" : "cells"}`}
              </small>
            </div>
            <div
              className={matrix ? "buffer-cells matrix" : "buffer-cells"}
              style={
                matrix
                  ? {
                      gridTemplateColumns: `repeat(${matrixSize}, minmax(32px,1fr))`,
                    }
                  : undefined
              }
            >
              {values.map((v, i) => (
                <div
                  key={i}
                  className={
                    frame.arrayWrites[name]?.includes(i)
                      ? "buffer-write"
                      : frame.arrayReads[name]?.includes(i)
                        ? "buffer-read"
                        : previous?.arrays[name] &&
                            previous.arrays[name][i] !== v
                          ? "buffer-write"
                          : ""
                  }
                >
                  <small>
                    {matrix
                      ? `${Math.floor(i / matrixSize)},${i % matrixSize}`
                      : i}
                  </small>
                  <strong>{valueLabel(v)}</strong>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
export function MatrixEditor({
  input,
  update,
  locale,
  symmetric,
}: {
  input: string;
  update: (s: string) => void;
  locale: Locale;
  symmetric: boolean;
}) {
  const numbers = input
      .trim()
      .split(/[\s,;]+/)
      .map(Number),
    size = Math.sqrt(numbers.length);
  if (!Number.isInteger(size) || size < 2 || size > 8) return null;
  return (
    <details className="matrix-editor">
      <summary>
        {locale === "fr" ? "Modifier les arêtes" : "Edit edges"}
        <span>{locale === "fr" ? "0 = aucune arête" : "0 = no edge"}</span>
      </summary>
      <div
        className="matrix-input-grid"
        style={{ gridTemplateColumns: `24px repeat(${size},minmax(25px,1fr))` }}
      >
        <span />
        {Array.from({ length: size }, (_, i) => (
          <b key={i}>{String.fromCharCode(65 + i)}</b>
        ))}
        {Array.from({ length: size }, (_, row) => (
          <div className="matrix-row" key={row}>
            <b>{String.fromCharCode(65 + row)}</b>
            {numbers.slice(row * size, (row + 1) * size).map((v, col) => (
              <input
                key={col}
                type="number"
                disabled={row === col}
                aria-label={`${locale === "fr" ? "Poids" : "Weight"} ${String.fromCharCode(65 + row)} → ${String.fromCharCode(65 + col)}`}
                value={v}
                onChange={(e) => {
                  const next = [...numbers];
                  next[row * size + col] = Number(e.target.value);
                  if (symmetric)
                    next[col * size + row] = Number(e.target.value);
                  update(next.join(", "));
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </details>
  );
}
