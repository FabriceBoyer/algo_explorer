import type { Algorithm, Locale } from "./algorithms";
export function validateInput(
  algorithm: Algorithm,
  data: number[],
  target: number,
  locale: Locale,
) {
  const fail = (fr: string, en: string) => {
    throw new Error(locale === "fr" ? fr : en);
  };
  if (algorithm.sorted && data.some((v, i) => i > 0 && v < data[i - 1]))
    fail(
      "Cet atelier exige un tableau trié par ordre croissant.",
      "This playground requires an ascending sorted array.",
    );
  if (algorithm.id === "euclid" || algorithm.rule === "positive-pair") {
    if (
      data.length < 2 ||
      data.slice(0, 2).some((v) => !Number.isInteger(v) || v <= 0)
    )
      fail(
        "Utilisez au moins deux entiers strictement positifs.",
        "Use at least two strictly positive integers.",
      );
  }
  if (algorithm.input === "graph") {
    const size = Math.sqrt(data.length);
    if (!Number.isInteger(size) || size < 2 || size > 8)
      fail(
        "Matrice carrée attendue : 2 à 8 sommets (4 à 64 valeurs).",
        "A square matrix is required: 2–8 vertices (4–64 values).",
      );
    if (!Number.isInteger(target) || target < 0 || target >= size)
      fail(
        "Le sommet de départ doit être un indice valide.",
        "The starting vertex must be a valid index.",
      );
    if (data.some((v, i) => i % (size + 1) === 0 && v !== 0))
      fail(
        "La diagonale doit être nulle (pas de boucle sur un sommet).",
        "The diagonal must be zero (no self-loops).",
      );
    if (algorithm.rule !== "negative-edges" && data.some((v) => v < 0))
      fail(
        "Cet atelier exige des poids positifs ; 0 signifie aucune arête.",
        "This playground requires positive weights; 0 means no edge.",
      );
    if (
      algorithm.rule === "undirected" &&
      data.some((v, i) => v !== data[(i % size) * size + Math.floor(i / size)])
    )
      fail(
        "Prim exige une matrice symétrique : graphe non orienté.",
        "Prim requires a symmetric matrix: an undirected graph.",
      );
  }
  if (algorithm.rule === "integer-target" && !Number.isInteger(target))
    fail("Le décalage doit être entier.", "The shift must be an integer.");
  if (
    algorithm.rule === "window" &&
    (!Number.isInteger(target) || target < 1 || target > data.length)
  )
    fail(
      "La taille de fenêtre doit être un entier entre 1 et n.",
      "Window size must be an integer from 1 to n.",
    );
  if (
    algorithm.rule === "factorial" &&
    (!Number.isInteger(data[0]) || data[0] < 0 || data[0] > 14)
  )
    fail(
      "La factorielle attend un entier entre 0 et 14.",
      "Factorial expects an integer from 0 to 14.",
    );
  if (
    algorithm.rule === "power" &&
    (data.length < 2 || !Number.isInteger(data[1]) || data[1] < 0)
  )
    fail(
      "Indiquez une base et un exposant entier positif ou nul.",
      "Provide a base and a nonnegative integer exponent.",
    );
  if (
    algorithm.rule === "nonnegative-integers" &&
    data.some((v) => !Number.isInteger(v) || v < 0)
  )
    fail("Utilisez des entiers positifs ou nuls.", "Use nonnegative integers.");
  if (algorithm.rule === "coins" || algorithm.rule === "subset") {
    if (
      data.some(
        (v) =>
          !Number.isInteger(v) || (algorithm.rule === "coins" ? v <= 0 : v < 0),
      )
    )
      fail(
        "Les valeurs doivent être entières et positives (zéro accepté pour les sous-ensembles).",
        "Values must be positive integers (zero is allowed for subsets).",
      );
    if (!Number.isInteger(target) || target < 0 || target > 64)
      fail(
        "La cible doit être un entier entre 0 et 64.",
        "Target must be an integer from 0 to 64.",
      );
  }
}
export function randomInput(algorithm: Algorithm): number[] {
  if (algorithm.input === "graph") {
    const size = Math.sqrt(algorithm.data.length);
    const matrix = Array(size * size).fill(0);
    for (let i = 0; i < size; i++)
      for (let j = i + 1; j < size; j++)
        if (j === i + 1 || Math.random() > 0.5) {
          const w = 1 + Math.floor(Math.random() * 9);
          matrix[i * size + j] = w;
          if (algorithm.id !== "topological-sort") matrix[j * size + i] = w;
        }
    return matrix;
  }
  if (algorithm.rule === "factorial") return [Math.floor(Math.random() * 12)];
  if (algorithm.rule === "power")
    return [
      2 + Math.floor(Math.random() * 3),
      3 + Math.floor(Math.random() * 6),
    ];
  if (algorithm.id === "sieve")
    return Array(16 + Math.floor(Math.random() * 16)).fill(0);
  const values = Array.from(
    { length: algorithm.data.length },
    () => 1 + Math.floor(Math.random() * 40),
  );
  return algorithm.sorted ? values.sort((a, b) => a - b) : values;
}
