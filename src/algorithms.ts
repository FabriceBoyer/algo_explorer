export type Locale = "fr" | "en";
export type Algorithm = {
  id: string;
  name: Record<Locale, string>;
  category: "sorting" | "search" | "math" | "arrays";
  complexity: string;
  space: string;
  description: Record<Locale, string>;
  insight: Record<Locale, string>;
  code: string;
  data: number[];
  target?: number;
  sorted?: boolean;
};
const data = [38, 15, 52, 23, 8, 44, 31, 61];
export const algorithms: Algorithm[] = [
  {
    id: "bubble-sort",
    name: { fr: "Tri à bulles", en: "Bubble sort" },
    category: "sorting",
    complexity: "O(n²)",
    space: "O(1)",
    description: {
      fr: "Les petites valeurs remontent, les grandes trouvent leur place. Une comparaison à la fois.",
      en: "Small values rise. Large values find their place. One comparison at a time.",
    },
    insight: {
      fr: "À chaque passage, le plus grand élément restant rejoint sa position finale. Les cases violettes sont lues ; les cases vertes sont modifiées.",
      en: "Each pass moves the largest remaining value to its final position. Purple cells are read; green cells are changed.",
    },
    data,
    code: `i <- 0
while i < n - 1
  j <- 0
  while j < n - i - 1
    if a[j] > a[j + 1]
      swap a[j], a[j + 1]
    end
    j <- j + 1
  end
  i <- i + 1
end`,
  },
  {
    id: "selection-sort",
    name: { fr: "Tri par sélection", en: "Selection sort" },
    category: "sorting",
    complexity: "O(n²)",
    space: "O(1)",
    description: {
      fr: "Cherchez le minimum. Placez-le au début. Recommencez.",
      en: "Find the minimum. Move it to the front. Repeat.",
    },
    insight: {
      fr: "La zone à gauche de i est triée. best mémorise l’indice du plus petit élément rencontré.",
      en: "The region left of i is sorted. best remembers the index of the smallest value found.",
    },
    data,
    code: `i <- 0
while i < n - 1
  best <- i
  j <- i + 1
  while j < n
    if a[j] < a[best]
      best <- j
    end
    j <- j + 1
  end
  swap a[i], a[best]
  i <- i + 1
end`,
  },
  {
    id: "insertion-sort",
    name: { fr: "Tri par insertion", en: "Insertion sort" },
    category: "sorting",
    complexity: "O(n²)",
    space: "O(1)",
    description: {
      fr: "Construisez une suite ordonnée, comme une main de cartes.",
      en: "Build a sorted sequence, just like a hand of cards.",
    },
    insight: {
      fr: "La clé key traverse le préfixe trié. Les valeurs plus grandes se décalent vers la droite.",
      en: "The key moves through the sorted prefix. Larger values shift to the right.",
    },
    data,
    code: `i <- 1
while i < n
  key <- a[i]
  j <- i - 1
  while j >= 0 && a[j] > key
    a[j + 1] <- a[j]
    j <- j - 1
  end
  a[j + 1] <- key
  i <- i + 1
end`,
  },
  {
    id: "gnome-sort",
    name: { fr: "Tri du gnome", en: "Gnome sort" },
    category: "sorting",
    complexity: "O(n²)",
    space: "O(1)",
    description: {
      fr: "Avancez si tout est en ordre. Sinon, échangez et reculez.",
      en: "Step forward when ordered. Otherwise swap and step back.",
    },
    insight: {
      fr: "Le curseur i recule pour réparer une inversion avant de poursuivre.",
      en: "The cursor i steps back to repair an inversion before moving on.",
    },
    data,
    code: `i <- 1
while i < n
  if i == 0 || a[i - 1] <= a[i]
    i <- i + 1
  else
    swap a[i - 1], a[i]
    i <- i - 1
  end
end`,
  },
  {
    id: "linear-search",
    name: { fr: "Recherche linéaire", en: "Linear search" },
    category: "search",
    complexity: "O(n)",
    space: "O(1)",
    description: {
      fr: "Parcourez les valeurs jusqu’à trouver votre cible.",
      en: "Walk through the values until you find your target.",
    },
    insight: {
      fr: "result contient l’indice trouvé, ou -1 si la cible est absente. Aucune hypothèse de tri.",
      en: "result holds the matching index, or -1 if absent. No sorting assumption.",
    },
    data,
    target: 23,
    code: `result <- -1
i <- 0
while i < n && result == -1
  if a[i] == target
    result <- i
  end
  i <- i + 1
end`,
  },
  {
    id: "binary-search",
    name: { fr: "Recherche dichotomique", en: "Binary search" },
    category: "search",
    complexity: "O(log n)",
    space: "O(1)",
    description: {
      fr: "Divisez l’espace de recherche en deux à chaque étape.",
      en: "Cut the search space in half at every step.",
    },
    insight: {
      fr: "Précondition : données triées. low et high bornent la zone restante ; mid est son milieu entier.",
      en: "Requires sorted data. low and high bound the remaining region; mid is its integer midpoint.",
    },
    data: [8, 15, 23, 31, 38, 44, 52, 61],
    target: 23,
    sorted: true,
    code: `low <- 0
high <- n - 1
result <- -1
while low <= high && result == -1
  mid <- (low + high - (low + high) % 2) / 2
  if a[mid] == target
    result <- mid
  else
    if a[mid] < target
      low <- mid + 1
    else
      high <- mid - 1
    end
  end
end`,
  },
  {
    id: "maximum",
    name: { fr: "Maximum d’un tableau", en: "Array maximum" },
    category: "arrays",
    complexity: "O(n)",
    space: "O(1)",
    description: {
      fr: "Gardez en mémoire le plus grand élément rencontré.",
      en: "Remember the largest value encountered so far.",
    },
    insight: {
      fr: "Après chaque itération, result est le maximum du préfixe déjà exploré.",
      en: "After every iteration, result is the maximum of the explored prefix.",
    },
    data,
    code: `result <- a[0]
i <- 1
while i < n
  if a[i] > result
    result <- a[i]
  end
  i <- i + 1
end`,
  },
  {
    id: "prefix-sum",
    name: { fr: "Sommes préfixes", en: "Prefix sums" },
    category: "arrays",
    complexity: "O(n)",
    space: "O(1)",
    description: {
      fr: "Transformez chaque valeur en somme de celles qui la précèdent.",
      en: "Turn each value into the sum of all values up to it.",
    },
    insight: {
      fr: "La transformation en place permet ensuite de calculer des sommes d’intervalles.",
      en: "This in-place transformation enables subsequent range-sum queries.",
    },
    data: [3, 1, 4, 1, 5, 9, 2, 6],
    code: `i <- 1
while i < n
  a[i] <- a[i] + a[i - 1]
  i <- i + 1
end`,
  },
  {
    id: "reverse",
    name: { fr: "Inversion de tableau", en: "Array reversal" },
    category: "arrays",
    complexity: "O(n)",
    space: "O(1)",
    description: {
      fr: "Deux curseurs se rejoignent, en échangeant les extrémités.",
      en: "Two cursors meet by swapping opposite ends.",
    },
    insight: {
      fr: "Chaque échange place deux valeurs à leur position finale.",
      en: "Every swap puts two values in their final positions.",
    },
    data,
    code: `left <- 0
right <- n - 1
while left < right
  swap a[left], a[right]
  left <- left + 1
  right <- right - 1
end`,
  },
  {
    id: "kadane",
    name: { fr: "Sous-tableau maximal", en: "Maximum subarray" },
    category: "arrays",
    complexity: "O(n)",
    space: "O(1)",
    description: {
      fr: "Prolonger la somme courante, ou repartir de zéro ?",
      en: "Extend the current sum, or start a new subarray?",
    },
    insight: {
      fr: "Algorithme de Kadane : current est la meilleure somme terminant à i ; result est la meilleure somme globale.",
      en: "Kadane’s algorithm: current is the best sum ending at i; result is the best overall sum.",
    },
    data: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
    code: `current <- a[0]
result <- current
i <- 1
while i < n
  if current + a[i] > a[i]
    current <- current + a[i]
  else
    current <- a[i]
  end
  if current > result
    result <- current
  end
  i <- i + 1
end`,
  },
  {
    id: "euclid",
    name: { fr: "PGCD d’Euclide", en: "Euclidean GCD" },
    category: "math",
    complexity: "O(log min(a,b))",
    space: "O(1)",
    description: {
      fr: "Le reste d’une division révèle le diviseur commun.",
      en: "The remainder of a division reveals the common divisor.",
    },
    insight: {
      fr: "Utilisez deux entiers strictement positifs. Le PGCD de x et y est aussi celui de y et x modulo y.",
      en: "Use two strictly positive integers. gcd(x,y) equals gcd(y,x modulo y).",
    },
    data: [48, 18],
    code: `x <- a[0]
y <- a[1]
while y != 0
  remainder <- x % y
  x <- y
  y <- remainder
end
result <- x`,
  },
  {
    id: "fibonacci",
    name: { fr: "Suite de Fibonacci", en: "Fibonacci sequence" },
    category: "math",
    complexity: "O(n)",
    space: "O(1)",
    description: {
      fr: "Chaque terme naît de la somme des deux précédents.",
      en: "Each number is the sum of the two before it.",
    },
    insight: {
      fr: "Le tableau sert de support : modifiez sa longueur pour générer plus ou moins de termes.",
      en: "The array is the output canvas: change its length to generate more or fewer terms.",
    },
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    code: `a[0] <- 0
if n > 1
  a[1] <- 1
end
i <- 2
while i < n
  a[i] <- a[i - 1] + a[i - 2]
  i <- i + 1
end`,
  },
];
