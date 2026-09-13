import type { Algorithm } from "./algorithms";

export const additionalAlgorithms: Algorithm[] = [
  {
    id: "merge-sort",
    name: {
      fr: "Tri fusion",
      en: "Merge sort",
    },
    category: "sorting",
    complexity: "O(n log n)",
    space: "O(n)",
    description: {
      fr: "Diviser en petites suites, puis fusionner dans l’ordre.",
      en: "Build sorted runs, then merge them together.",
    },
    insight: {
      fr: "Version itérative : width double à chaque passage. temp reçoit la fusion avant sa copie dans a.",
      en: "Iterative version: width doubles each pass. temp receives the merge before it is copied back to a.",
    },
    data: [38, 15, 52, 23, 8, 44, 31, 61],
    code: `array temp[n]
width <- 1
while width < n
  left <- 0
  while left < n
    mid <- left + width
    if mid > n
      mid <- n
    end
    right <- left + 2 * width
    if right > n
      right <- n
    end
    i <- left
    j <- mid
    k <- left
    while k < right
      if i < mid && (j >= right || a[i] <= a[j])
        temp[k] <- a[i]
        i <- i + 1
      else
        temp[k] <- a[j]
        j <- j + 1
      end
      k <- k + 1
    end
    k <- left
    while k < right
      a[k] <- temp[k]
      k <- k + 1
    end
    left <- left + 2 * width
  end
  width <- width * 2
end`,
  },
  {
    id: "quick-sort",
    name: {
      fr: "Tri rapide",
      en: "Quick sort",
    },
    category: "sorting",
    complexity: "O(n²)",
    space: "O(n)",
    description: {
      fr: "Un pivot sépare les petites valeurs des grandes.",
      en: "A pivot separates smaller values from larger ones.",
    },
    insight: {
      fr: "Partition de Lomuto. lows et highs remplacent la pile récursive. Temps moyen O(n log n), pire cas O(n²).",
      en: "Lomuto partition. lows and highs replace the recursive stack. Average O(n log n), worst case O(n²).",
    },
    data: [38, 15, 52, 23, 8, 44, 31, 61],
    code: `array lows[n]
array highs[n]
lows[0] <- 0
highs[0] <- n - 1
top <- 1
while top > 0
  top <- top - 1
  low <- lows[top]
  high <- highs[top]
  if low < high
    pivot <- a[high]
    i <- low
    j <- low
    while j < high
      if a[j] <= pivot
        swap a[i], a[j]
        i <- i + 1
      end
      j <- j + 1
    end
    swap a[i], a[high]
    if low < i - 1
      lows[top] <- low
      highs[top] <- i - 1
      top <- top + 1
    end
    if i + 1 < high
      lows[top] <- i + 1
      highs[top] <- high
      top <- top + 1
    end
  end
end`,
  },
  {
    id: "heap-sort",
    name: {
      fr: "Tri par tas",
      en: "Heap sort",
    },
    category: "sorting",
    complexity: "O(n log n)",
    space: "O(1)",
    description: {
      fr: "Construisez un tas, puis extrayez son maximum.",
      en: "Build a heap, then extract its maximum.",
    },
    insight: {
      fr: "Le tas est stocké dans a : enfants de root aux indices 2×root+1 et 2×root+2. La zone après endpos est triée.",
      en: "The heap lives in a: children of root are at 2×root+1 and 2×root+2. Values beyond endpos are sorted.",
    },
    data: [38, 15, 52, 23, 8, 44, 31, 61],
    code: `start <- (n - n % 2) / 2 - 1
endpos <- n - 1
while endpos > 0
  if start >= 0
    root <- start
    start <- start - 1
  else
    swap a[0], a[endpos]
    endpos <- endpos - 1
    root <- 0
  end
  done <- 0
  while 2 * root + 1 <= endpos && done == 0
    child <- 2 * root + 1
    if child + 1 <= endpos && a[child] < a[child + 1]
      child <- child + 1
    end
    if a[root] < a[child]
      swap a[root], a[child]
      root <- child
    else
      done <- 1
    end
  end
end`,
  },
  {
    id: "shell-sort",
    name: {
      fr: "Tri de Shell",
      en: "Shell sort",
    },
    category: "sorting",
    complexity: "O(n²)",
    space: "O(1)",
    description: {
      fr: "Triez d’abord les valeurs éloignées, puis les voisines.",
      en: "Sort distant values first, then their neighbors.",
    },
    insight: {
      fr: "Insertion avec un intervalle gap divisé par deux. La complexité dépend de la suite d’intervalles.",
      en: "Insertion with a gap that halves on each pass. Complexity depends on the chosen gap sequence.",
    },
    data: [38, 15, 52, 23, 8, 44, 31, 61],
    code: `gap <- (n - n % 2) / 2
while gap > 0
  i <- gap
  while i < n
    key <- a[i]
    j <- i
    while j >= gap && a[j - gap] > key
      a[j] <- a[j - gap]
      j <- j - gap
    end
    a[j] <- key
    i <- i + 1
  end
  gap <- (gap - gap % 2) / 2
end`,
  },
  {
    id: "cocktail-sort",
    name: {
      fr: "Tri cocktail",
      en: "Cocktail sort",
    },
    category: "sorting",
    complexity: "O(n²)",
    space: "O(1)",
    description: {
      fr: "Un balayage dans chaque sens fait progresser les deux extrémités.",
      en: "Sweep in both directions to settle both ends.",
    },
    insight: {
      fr: "Une variante bidirectionnelle du tri à bulles. Les bornes se rapprochent après chaque balayage.",
      en: "A bidirectional bubble sort. Boundaries move inward after each sweep.",
    },
    data: [38, 15, 52, 23, 8, 44, 31, 61],
    code: `left <- 0
right <- n - 1
changed <- 1
while left < right && changed
  changed <- 0
  j <- left
  while j < right
    if a[j] > a[j + 1]
      swap a[j], a[j + 1]
      changed <- 1
    end
    j <- j + 1
  end
  right <- right - 1
  j <- right
  while j > left
    if a[j - 1] > a[j]
      swap a[j - 1], a[j]
      changed <- 1
    end
    j <- j - 1
  end
  left <- left + 1
end`,
  },
  {
    id: "comb-sort",
    name: {
      fr: "Tri à peigne",
      en: "Comb sort",
    },
    category: "sorting",
    complexity: "O(n²)",
    space: "O(1)",
    description: {
      fr: "Éliminez les grandes inversions avant les petites.",
      en: "Remove large inversions before smaller ones.",
    },
    insight: {
      fr: "gap diminue d’un facteur voisin de 1,3. À gap=1, poursuivre jusqu’à un passage sans échange.",
      en: "gap shrinks by approximately 1.3. At gap=1, continue until no swaps occur.",
    },
    data: [38, 15, 52, 23, 8, 44, 31, 61],
    code: `gap <- n
changed <- 1
while gap > 1 || changed
  gap <- (gap * 10 - (gap * 10) % 13) / 13
  if gap < 1
    gap <- 1
  end
  changed <- 0
  i <- 0
  while i + gap < n
    if a[i] > a[i + gap]
      swap a[i], a[i + gap]
      changed <- 1
    end
    i <- i + 1
  end
end`,
  },
  {
    id: "odd-even-sort",
    name: {
      fr: "Tri pair-impair",
      en: "Odd-even sort",
    },
    category: "sorting",
    complexity: "O(n²)",
    space: "O(1)",
    description: {
      fr: "Alternez les paires d’indices comparées.",
      en: "Alternate which neighboring pairs are compared.",
    },
    insight: {
      fr: "Un passage traite les indices pairs, l’autre les impairs. Arrêt lorsqu’aucun des deux ne modifie le tableau.",
      en: "One pass handles even indices, the other odd indices. Stop when neither pass changes the array.",
    },
    data: [38, 15, 52, 23, 8, 44, 31, 61],
    code: `changed <- 1
while changed
  changed <- 0
  parity <- 0
  while parity < 2
    i <- parity
    while i + 1 < n
      if a[i] > a[i + 1]
        swap a[i], a[i + 1]
        changed <- 1
      end
      i <- i + 2
    end
    parity <- parity + 1
  end
end`,
  },
  {
    id: "pancake-sort",
    name: {
      fr: "Tri par retournement",
      en: "Pancake sort",
    },
    category: "sorting",
    complexity: "O(n²)",
    space: "O(1)",
    description: {
      fr: "Triez uniquement en retournant des préfixes.",
      en: "Sort using only prefix reversals.",
    },
    insight: {
      fr: "Amener le maximum en tête, puis retourner le préfixe pour le placer à la fin de la zone restante.",
      en: "Bring the maximum to the front, then flip the prefix to place it at the end of the remaining region.",
    },
    data: [38, 15, 52, 23, 8, 44, 31, 61],
    code: `size <- n
while size > 1
  best <- 0
  i <- 1
  while i < size
    if a[i] > a[best]
      best <- i
    end
    i <- i + 1
  end
  left <- 0
  right <- best
  while left < right
    swap a[left], a[right]
    left <- left + 1
    right <- right - 1
  end
  left <- 0
  right <- size - 1
  while left < right
    swap a[left], a[right]
    left <- left + 1
    right <- right - 1
  end
  size <- size - 1
end`,
  },
  {
    id: "exponential-search",
    name: {
      fr: "Recherche exponentielle",
      en: "Exponential search",
    },
    category: "search",
    complexity: "O(log n)",
    space: "O(1)",
    description: {
      fr: "Doublez la borne, puis cherchez dans l’intervalle.",
      en: "Double the bound, then search inside the interval.",
    },
    insight: {
      fr: "Le tableau doit être trié. La croissance exponentielle encadre la cible avant la dichotomie.",
      en: "Requires sorted input. Exponential growth brackets the target before binary search.",
    },
    data: [8, 15, 23, 31, 38, 44, 52, 61],
    target: 23,
    sorted: true,
    code: `bound <- 1
while bound < n && a[bound] < target
  bound <- bound * 2
end
low <- (bound - bound % 2) / 2
high <- bound
if high >= n
  high <- n - 1
end

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
    id: "jump-search",
    name: {
      fr: "Recherche par sauts",
      en: "Jump search",
    },
    category: "search",
    complexity: "O(√n)",
    space: "O(1)",
    description: {
      fr: "Sautez de bloc en bloc, puis parcourez le bon bloc.",
      en: "Jump between blocks, then scan the right block.",
    },
    insight: {
      fr: "Le pas est la partie entière de √n. La recherche est linéaire uniquement dans le bloc candidat.",
      en: "The jump size is floor(√n). Only the candidate block is scanned linearly.",
    },
    data: [8, 15, 23, 31, 38, 44, 52, 61],
    target: 23,
    sorted: true,
    code: `size <- 1
while (size + 1) * (size + 1) <= n
  size <- size + 1
end
low <- 0
high <- size - 1
while high < n && a[high] < target
  low <- high + 1
  high <- high + size
end
if high >= n
  high <- n - 1
end
result <- -1
i <- low
while i <= high && result == -1
  if a[i] == target
    result <- i
  end
  i <- i + 1
end`,
  },
  {
    id: "interpolation-search",
    name: {
      fr: "Recherche par interpolation",
      en: "Interpolation search",
    },
    category: "search",
    complexity: "O(n)",
    space: "O(1)",
    description: {
      fr: "Estimez la position de la cible à partir des valeurs.",
      en: "Estimate the target position from the values.",
    },
    insight: {
      fr: "Sur des données uniformes, l’estimation est souvent meilleure que le milieu. Pire cas O(n) ; tous les indices sont entiers.",
      en: "For uniform data, this estimate often beats the midpoint. Worst case O(n); all indices are integers.",
    },
    data: [8, 15, 23, 31, 38, 44, 52, 61],
    target: 23,
    sorted: true,
    code: `low <- 0
high <- n - 1
result <- -1
while low <= high && result == -1 && target >= a[low] && target <= a[high]
  if a[low] == a[high]
    if a[low] == target
      result <- low
    end
    low <- high + 1
  else
    estimate <- (target - a[low]) * (high - low) / (a[high] - a[low])
    mid <- low + estimate - estimate % 1
    if a[mid] == target
      result <- mid
    else
      if a[mid] < target
        low <- mid + 1
      else
        high <- mid - 1
      end
    end
  end
end`,
  },
  {
    id: "minimum",
    name: {
      fr: "Minimum d’un tableau",
      en: "Array minimum",
    },
    category: "arrays",
    complexity: "O(n)",
    space: "O(1)",
    description: {
      fr: "Mémorisez la plus petite valeur rencontrée.",
      en: "Remember the smallest value encountered.",
    },
    insight: {
      fr: "result est le minimum du préfixe déjà visité.",
      en: "result is the minimum of the prefix visited so far.",
    },
    data: [38, 15, 52, 23, 8, 44, 31, 61],
    code: `result <- a[0]
i <- 1
while i < n
  if a[i] < result
    result <- a[i]
  end
  i <- i + 1
end`,
  },
  {
    id: "sum",
    name: {
      fr: "Somme d’un tableau",
      en: "Array sum",
    },
    category: "arrays",
    complexity: "O(n)",
    space: "O(1)",
    description: {
      fr: "Accumulez les valeurs, une cellule après l’autre.",
      en: "Accumulate values one cell at a time.",
    },
    insight: {
      fr: "L’accumulateur result résume toutes les cellules parcourues.",
      en: "The accumulator result summarizes all visited cells.",
    },
    data: [38, 15, 52, 23, 8, 44, 31, 61],
    code: `result <- 0
i <- 0
while i < n
  result <- result + a[i]
  i <- i + 1
end`,
  },
  {
    id: "mean",
    name: {
      fr: "Moyenne arithmétique",
      en: "Arithmetic mean",
    },
    category: "arrays",
    complexity: "O(n)",
    space: "O(1)",
    description: {
      fr: "Une somme, puis un partage en parts égales.",
      en: "Add the values, then divide into equal shares.",
    },
    insight: {
      fr: "La division finale est réelle : les résultats peuvent être décimaux.",
      en: "Final division is real: results can be fractional.",
    },
    data: [38, 15, 52, 23, 8, 44, 31, 61],
    code: `total <- 0
i <- 0
while i < n
  total <- total + a[i]
  i <- i + 1
end
result <- total / n`,
  },
  {
    id: "rotate-array",
    name: {
      fr: "Rotation de tableau",
      en: "Array rotation",
    },
    category: "arrays",
    complexity: "O(n)",
    space: "O(n)",
    description: {
      fr: "Décalez circulairement les valeurs vers la droite.",
      en: "Rotate values to the right with wraparound.",
    },
    insight: {
      fr: "target indique le décalage entier ; un décalage négatif tourne vers la gauche. out préserve les valeurs d’origine.",
      en: "target is the integer shift; negative values rotate left. out preserves original values.",
    },
    data: [38, 15, 52, 23, 8, 44, 31, 61],
    target: 2,
    rule: "integer-target",
    code: `array out[n]
shift <- (target % n + n) % n
i <- 0
while i < n
  out[(i + shift) % n] <- a[i]
  i <- i + 1
end
i <- 0
while i < n
  a[i] <- out[i]
  i <- i + 1
end`,
  },
  {
    id: "deduplicate",
    name: {
      fr: "Suppression des doublons",
      en: "Remove duplicates",
    },
    category: "arrays",
    complexity: "O(n)",
    space: "O(1)",
    description: {
      fr: "Compactez les valeurs distinctes dans un préfixe.",
      en: "Compact distinct values into a prefix.",
    },
    insight: {
      fr: "Entrée triée. Les result premières cases constituent la sortie ; la fin du tableau n’est pas effacée.",
      en: "Sorted input. The first result cells are the output; the rest of the array is not erased.",
    },
    data: [1, 1, 2, 2, 2, 4, 4, 5],
    sorted: true,
    code: `result <- 1
i <- 1
while i < n
  if a[i] != a[result - 1]
    a[result] <- a[i]
    result <- result + 1
  end
  i <- i + 1
end`,
  },
  {
    id: "inversion-count",
    name: {
      fr: "Comptage des inversions",
      en: "Count inversions",
    },
    category: "arrays",
    complexity: "O(n²)",
    space: "O(1)",
    description: {
      fr: "Mesurez combien de paires sont dans le mauvais ordre.",
      en: "Count pairs that appear in the wrong order.",
    },
    insight: {
      fr: "Cette version pédagogique examine chaque paire i<j. Une version fusion peut atteindre O(n log n).",
      en: "This teaching version checks every pair i<j. A merge-based version can achieve O(n log n).",
    },
    data: [3, 1, 2, 5, 4],
    code: `result <- 0
i <- 0
while i < n
  j <- i + 1
  while j < n
    if a[i] > a[j]
      result <- result + 1
    end
    j <- j + 1
  end
  i <- i + 1
end`,
  },
  {
    id: "sliding-window",
    name: {
      fr: "Somme maximale à fenêtre fixe",
      en: "Fixed-window maximum sum",
    },
    category: "arrays",
    complexity: "O(n)",
    space: "O(1)",
    description: {
      fr: "Une valeur entre dans la fenêtre, une autre en sort.",
      en: "One value enters the window as another leaves.",
    },
    insight: {
      fr: "target est la taille de fenêtre, de 1 à n. result est la meilleure somme, start son indice de départ.",
      en: "target is the window size, from 1 to n. result is the best sum, start its starting index.",
    },
    data: [2, 1, 5, 1, 3, 2],
    target: 3,
    rule: "window",
    code: `current <- 0
i <- 0
while i < target
  current <- current + a[i]
  i <- i + 1
end
result <- current
start <- 0
while i < n
  current <- current + a[i] - a[i - target]
  if current > result
    result <- current
    start <- i - target + 1
  end
  i <- i + 1
end`,
  },
  {
    id: "factorial",
    name: {
      fr: "Factorielle",
      en: "Factorial",
    },
    category: "math",
    complexity: "O(m)",
    space: "O(1)",
    description: {
      fr: "Multipliez les entiers de 1 jusqu’à m.",
      en: "Multiply integers from 1 through m.",
    },
    insight: {
      fr: "m=a[0], entier entre 0 et 14 pour respecter la limite numérique ; 0!=1.",
      en: "m=a[0], an integer from 0 to 14 within the numeric bound; 0!=1.",
    },
    data: [6],
    rule: "factorial",
    code: `result <- 1
i <- 2
while i <= a[0]
  result <- result * i
  i <- i + 1
end`,
  },
  {
    id: "fast-power",
    name: {
      fr: "Exponentiation rapide",
      en: "Binary exponentiation",
    },
    category: "math",
    complexity: "O(log e)",
    space: "O(1)",
    description: {
      fr: "Élevez au carré pour diviser l’exposant par deux.",
      en: "Square the base to halve the exponent.",
    },
    insight: {
      fr: "a[0] est la base, a[1] l’exposant entier positif ou nul. Le dernier carré inutile est évité.",
      en: "a[0] is the base, a[1] a nonnegative integer exponent. The last unnecessary square is skipped.",
    },
    data: [3, 7],
    rule: "power",
    code: `base <- a[0]
exponent <- a[1]
result <- 1
while exponent > 0
  if exponent % 2 == 1
    result <- result * base
  end
  exponent <- (exponent - exponent % 2) / 2
  if exponent > 0
    base <- base * base
  end
end`,
  },
  {
    id: "primality",
    name: {
      fr: "Test de primalité",
      en: "Primality test",
    },
    category: "math",
    complexity: "O(√m)",
    space: "O(1)",
    description: {
      fr: "Un diviseur suffit à montrer qu’un entier est composé.",
      en: "One divisor is enough to prove a number composite.",
    },
    insight: {
      fr: "m=a[0] est un entier ≥0. result vaut 1 si premier, 0 sinon. Aucun diviseur au-delà de √m n’est nécessaire.",
      en: "m=a[0] is a nonnegative integer. result is 1 for prime, 0 otherwise. No divisor beyond √m is needed.",
    },
    data: [97],
    rule: "nonnegative-integers",
    code: `result <- 1
if a[0] < 2
  result <- 0
end
divisor <- 2
while divisor * divisor <= a[0] && result
  if a[0] % divisor == 0
    result <- 0
  end
  divisor <- divisor + 1
end`,
  },
  {
    id: "sieve",
    name: {
      fr: "Crible d’Ératosthène",
      en: "Sieve of Eratosthenes",
    },
    category: "math",
    complexity: "O(n log log n)",
    space: "O(1)",
    description: {
      fr: "Marquez les multiples pour révéler les nombres premiers.",
      en: "Cross out multiples to reveal prime numbers.",
    },
    insight: {
      fr: "La longueur du tableau fixe l’intervalle [0,n−1]. À la fin, a[i]=1 signifie que i est premier.",
      en: "Array length defines [0,n−1]. At completion, a[i]=1 means i is prime.",
    },
    data: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    code: `i <- 0
while i < n
  a[i] <- 1
  i <- i + 1
end
a[0] <- 0
if n > 1
  a[1] <- 0
end
p <- 2
while p * p < n
  if a[p] == 1
    j <- p * p
    while j < n
      a[j] <- 0
      j <- j + p
    end
  end
  p <- p + 1
end`,
  },
  {
    id: "lcm",
    name: {
      fr: "PPCM",
      en: "Least common multiple",
    },
    category: "math",
    complexity: "O(log min(a,b))",
    space: "O(1)",
    description: {
      fr: "Le PGCD permet de retrouver le plus petit multiple commun.",
      en: "Use the GCD to find the least common multiple.",
    },
    insight: {
      fr: "Deux entiers strictement positifs. Diviser avant de multiplier limite les valeurs intermédiaires.",
      en: "Two strictly positive integers. Divide before multiplying to limit intermediate values.",
    },
    data: [12, 18],
    rule: "positive-pair",
    code: `x <- a[0]
y <- a[1]
while y != 0
  remainder <- x % y
  x <- y
  y <- remainder
end
result <- a[0] / x * a[1]`,
  },
  {
    id: "lis",
    name: {
      fr: "Sous-suite croissante",
      en: "Longest increasing subsequence",
    },
    category: "dynamic",
    complexity: "O(n²)",
    space: "O(n)",
    description: {
      fr: "Construisez la meilleure solution terminant à chaque position.",
      en: "Build the best solution ending at each position.",
    },
    insight: {
      fr: "dp[i] est la longueur de la plus longue sous-suite strictement croissante terminant à i. Les éléments peuvent être non contigus.",
      en: "dp[i] is the length of the longest strictly increasing subsequence ending at i. Elements need not be contiguous.",
    },
    data: [10, 9, 2, 5, 3, 7, 101, 18],
    code: `array dp[n]
result <- 0
i <- 0
while i < n
  dp[i] <- 1
  j <- 0
  while j < i
    if a[j] < a[i] && dp[j] + 1 > dp[i]
      dp[i] <- dp[j] + 1
    end
    j <- j + 1
  end
  if dp[i] > result
    result <- dp[i]
  end
  i <- i + 1
end`,
  },
  {
    id: "coin-change",
    name: {
      fr: "Rendu de monnaie",
      en: "Coin change",
    },
    category: "dynamic",
    complexity: "O(n × target)",
    space: "O(target)",
    description: {
      fr: "Combinez les pièces pour atteindre la somme avec un minimum de pièces.",
      en: "Combine denominations to reach the amount with the fewest coins.",
    },
    insight: {
      fr: "Pièces entières strictement positives, quantité illimitée ; cible entière de 0 à 64. result=-1 si impossible.",
      en: "Positive integer coins, unlimited supply; integer target from 0 to 64. result=-1 if impossible.",
    },
    data: [1, 3, 4],
    target: 6,
    rule: "coins",
    code: `array dp[target + 1]
amount <- 1
while amount <= target
  dp[amount] <- 1000000000
  i <- 0
  while i < n
    if a[i] <= amount && dp[amount - a[i]] + 1 < dp[amount]
      dp[amount] <- dp[amount - a[i]] + 1
    end
    i <- i + 1
  end
  amount <- amount + 1
end
result <- dp[target]
if result == 1000000000
  result <- -1
end`,
  },
  {
    id: "subset-sum",
    name: {
      fr: "Somme de sous-ensemble",
      en: "Subset sum",
    },
    category: "dynamic",
    complexity: "O(n × target)",
    space: "O(target)",
    description: {
      fr: "Peut-on atteindre la cible en choisissant certains éléments ?",
      en: "Can a subset of the values add up to the target?",
    },
    insight: {
      fr: "Chaque élément est utilisable une seule fois. Parcourir dp à rebours empêche de réutiliser la même valeur.",
      en: "Each element can be used once. Traversing dp backward prevents reusing a value.",
    },
    data: [3, 34, 4, 12, 5, 2],
    target: 9,
    rule: "subset",
    code: `array dp[target + 1]
dp[0] <- 1
i <- 0
while i < n
  amount <- target
  while amount >= a[i]
    if dp[amount - a[i]] == 1
      dp[amount] <- 1
    end
    amount <- amount - 1
  end
  i <- i + 1
end
result <- dp[target]`,
  },
  {
    id: "bfs",
    name: {
      fr: "Parcours en largeur",
      en: "Breadth-first search",
    },
    category: "graphs",
    complexity: "O(V²)",
    space: "O(V)",
    description: {
      fr: "Explorez les voisins, puis les voisins des voisins.",
      en: "Explore neighbors, then their neighbors.",
    },
    insight: {
      fr: "Matrice d’adjacence : 0 signifie aucune arête. target est le sommet de départ. queue est FIFO ; order donne l’ordre de découverte et result le nombre de sommets atteints.",
      en: "Adjacency matrix: 0 means no edge. target is the starting vertex. queue is FIFO; order records discovery order and result counts reachable vertices.",
    },
    data: [
      0, 2, 0, 6, 0, 2, 0, 3, 8, 5, 0, 3, 0, 0, 7, 6, 8, 0, 0, 9, 0, 5, 7, 9, 0,
    ],
    target: 0,
    input: "graph",
    code: `vertices <- 1
while vertices * vertices < n
  vertices <- vertices + 1
end

array visited[vertices]
array queue[vertices]
array order[vertices]
head <- 0
tail <- 1
queue[0] <- target
visited[target] <- 1
result <- 0
while head < tail
  u <- queue[head]
  head <- head + 1
  order[result] <- u
  result <- result + 1
  v <- 0
  while v < vertices
    if a[u * vertices + v] != 0 && visited[v] == 0
      visited[v] <- 1
      queue[tail] <- v
      tail <- tail + 1
    end
    v <- v + 1
  end
end`,
  },
  {
    id: "dfs",
    name: {
      fr: "Parcours en profondeur",
      en: "Depth-first search",
    },
    category: "graphs",
    complexity: "O(V²)",
    space: "O(V)",
    description: {
      fr: "Suivez une branche avant de revenir aux alternatives.",
      en: "Follow a branch before returning to alternatives.",
    },
    insight: {
      fr: "La pile stack est LIFO. Un sommet est marqué dès son empilement pour éviter les doublons. order contient result sommets visités.",
      en: "stack is LIFO. Vertices are marked when pushed to prevent duplicates. order contains result visited vertices.",
    },
    data: [
      0, 2, 0, 6, 0, 2, 0, 3, 8, 5, 0, 3, 0, 0, 7, 6, 8, 0, 0, 9, 0, 5, 7, 9, 0,
    ],
    target: 0,
    input: "graph",
    code: `vertices <- 1
while vertices * vertices < n
  vertices <- vertices + 1
end

array visited[vertices]
array stack[vertices]
array order[vertices]
stack[0] <- target
visited[target] <- 1
top <- 1
result <- 0
while top > 0
  top <- top - 1
  u <- stack[top]
  order[result] <- u
  result <- result + 1
  v <- vertices - 1
  while v >= 0
    if a[u * vertices + v] != 0 && visited[v] == 0
      visited[v] <- 1
      stack[top] <- v
      top <- top + 1
    end
    v <- v - 1
  end
end`,
  },
  {
    id: "dijkstra",
    name: {
      fr: "Plus courts chemins · Dijkstra",
      en: "Dijkstra shortest paths",
    },
    category: "graphs",
    complexity: "O(V²)",
    space: "O(V)",
    description: {
      fr: "Validez d’abord le sommet non traité le plus proche.",
      en: "Settle the closest unprocessed vertex first.",
    },
    insight: {
      fr: "Poids positifs. dist contient les distances depuis target ; parent reconstruit les chemins. 10⁹ représente une distance infinie. Version sans tas.",
      en: "Positive weights. dist holds distances from target; parent reconstructs paths. 10⁹ represents infinity. This version uses no heap.",
    },
    data: [
      0, 2, 0, 6, 0, 2, 0, 3, 8, 5, 0, 3, 0, 0, 7, 6, 8, 0, 0, 9, 0, 5, 7, 9, 0,
    ],
    target: 0,
    input: "graph",
    code: `vertices <- 1
while vertices * vertices < n
  vertices <- vertices + 1
end
array dist[vertices]
array parent[vertices]
i <- 0
while i < vertices
  dist[i] <- 1000000000
  parent[i] <- -1
  i <- i + 1
end
dist[target] <- 0

array visited[vertices]
count <- 0
while count < vertices
  u <- -1
  best <- 1000000000
  i <- 0
  while i < vertices
    if visited[i] == 0 && dist[i] < best
      u <- i
      best <- dist[i]
    end
    i <- i + 1
  end
  if u == -1
    count <- vertices
  else
    visited[u] <- 1
    v <- 0
    while v < vertices
      if a[u * vertices + v] > 0 && dist[u] + a[u * vertices + v] < dist[v]
        dist[v] <- dist[u] + a[u * vertices + v]
        parent[v] <- u
      end
      v <- v + 1
    end
    count <- count + 1
  end
end`,
  },
  {
    id: "bellman-ford",
    name: {
      fr: "Plus courts chemins · Bellman-Ford",
      en: "Bellman-Ford shortest paths",
    },
    category: "graphs",
    complexity: "O(V³)",
    space: "O(V)",
    description: {
      fr: "Répétez les relaxations pour propager les meilleures distances.",
      en: "Repeat relaxations to propagate shorter distances.",
    },
    insight: {
      fr: "Matrice : O(V³). Accepte les poids négatifs. negative_cycle=1 signale un cycle négatif accessible ; les distances ne sont alors pas des solutions.",
      en: "Matrix implementation: O(V³). Negative edges allowed. negative_cycle=1 flags a reachable negative cycle; distances are then not solutions.",
    },
    data: [
      0, 4, 5, 0, 0, 0, 0, -2, 6, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0,
      0,
    ],
    target: 0,
    input: "graph",
    rule: "negative-edges",
    code: `vertices <- 1
while vertices * vertices < n
  vertices <- vertices + 1
end
array dist[vertices]
array parent[vertices]
i <- 0
while i < vertices
  dist[i] <- 1000000000
  parent[i] <- -1
  i <- i + 1
end
dist[target] <- 0

pass <- 0
while pass < vertices - 1
  u <- 0
  while u < vertices
    v <- 0
    while v < vertices
      if a[u * vertices + v] != 0 && dist[u] < 1000000000 && dist[u] + a[u * vertices + v] < dist[v]
        dist[v] <- dist[u] + a[u * vertices + v]
        parent[v] <- u
      end
      v <- v + 1
    end
    u <- u + 1
  end
  pass <- pass + 1
end
negative_cycle <- 0
u <- 0
while u < vertices
  v <- 0
  while v < vertices
    if a[u * vertices + v] != 0 && dist[u] < 1000000000 && dist[u] + a[u * vertices + v] < dist[v]
      negative_cycle <- 1
    end
    v <- v + 1
  end
  u <- u + 1
end`,
  },
  {
    id: "prim",
    name: {
      fr: "Arbre couvrant · Prim",
      en: "Prim minimum spanning tree",
    },
    category: "graphs",
    complexity: "O(V²)",
    space: "O(V)",
    description: {
      fr: "Reliez un nouveau sommet par l’arête la moins coûteuse.",
      en: "Connect a new vertex through the cheapest crossing edge.",
    },
    insight: {
      fr: "Graphe non orienté à poids positifs. parent décrit l’arbre ; result est son coût, ou -1 si le graphe est déconnecté.",
      en: "Undirected graph with positive weights. parent describes the tree; result is its weight, or -1 if disconnected.",
    },
    data: [
      0, 2, 0, 6, 0, 2, 0, 3, 8, 5, 0, 3, 0, 0, 7, 6, 8, 0, 0, 9, 0, 5, 7, 9, 0,
    ],
    target: 0,
    input: "graph",
    rule: "undirected",
    code: `vertices <- 1
while vertices * vertices < n
  vertices <- vertices + 1
end
array dist[vertices]
array parent[vertices]
i <- 0
while i < vertices
  dist[i] <- 1000000000
  parent[i] <- -1
  i <- i + 1
end
dist[target] <- 0

array visited[vertices]
count <- 0
result <- 0
while count < vertices
  u <- -1
  best <- 1000000000
  i <- 0
  while i < vertices
    if visited[i] == 0 && dist[i] < best
      u <- i
      best <- dist[i]
    end
    i <- i + 1
  end
  if u == -1
    result <- -1
    count <- vertices
  else
    visited[u] <- 1
    result <- result + dist[u]
    v <- 0
    while v < vertices
      if a[u * vertices + v] > 0 && visited[v] == 0 && a[u * vertices + v] < dist[v]
        dist[v] <- a[u * vertices + v]
        parent[v] <- u
      end
      v <- v + 1
    end
    count <- count + 1
  end
end`,
  },
  {
    id: "topological-sort",
    name: {
      fr: "Tri topologique · Kahn",
      en: "Kahn topological sort",
    },
    category: "graphs",
    complexity: "O(V²)",
    space: "O(V)",
    description: {
      fr: "Exécutez les tâches dont toutes les dépendances sont satisfaites.",
      en: "Process tasks whose dependencies are all satisfied.",
    },
    insight: {
      fr: "Les sommets de degré entrant nul rejoignent la file. has_cycle=1 si tous les sommets ne peuvent pas être ordonnés. target n’intervient pas.",
      en: "Zero-indegree vertices join the queue. has_cycle=1 when not every vertex can be ordered. target is unused.",
    },
    data: [
      0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
    ],
    target: 0,
    input: "graph",
    code: `vertices <- 1
while vertices * vertices < n
  vertices <- vertices + 1
end

array indegree[vertices]
array queue[vertices]
array order[vertices]
u <- 0
while u < vertices
  v <- 0
  while v < vertices
    if a[u * vertices + v] != 0
      indegree[v] <- indegree[v] + 1
    end
    v <- v + 1
  end
  u <- u + 1
end
head <- 0
tail <- 0
u <- 0
while u < vertices
  if indegree[u] == 0
    queue[tail] <- u
    tail <- tail + 1
  end
  u <- u + 1
end
result <- 0
while head < tail
  u <- queue[head]
  head <- head + 1
  order[result] <- u
  result <- result + 1
  v <- 0
  while v < vertices
    if a[u * vertices + v] != 0
      indegree[v] <- indegree[v] - 1
      if indegree[v] == 0
        queue[tail] <- v
        tail <- tail + 1
      end
    end
    v <- v + 1
  end
end
has_cycle <- result < vertices`,
  },
  {
    id: "floyd-warshall",
    name: {
      fr: "Tous les chemins · Floyd-Warshall",
      en: "Floyd-Warshall all-pairs paths",
    },
    category: "graphs",
    complexity: "O(V³)",
    space: "O(V²)",
    description: {
      fr: "Un sommet intermédiaire peut-il raccourcir le chemin ?",
      en: "Can an intermediate vertex shorten the path?",
    },
    insight: {
      fr: "dist est une matrice aplatie. k autorise un intermédiaire supplémentaire. 10⁹ signifie inaccessible ; negative_cycle signale un cycle négatif.",
      en: "dist is a flattened matrix. k permits one more intermediate vertex. 10⁹ means unreachable; negative_cycle flags negative cycles.",
    },
    data: [
      0, 2, 0, 6, 0, 2, 0, 3, 8, 5, 0, 3, 0, 0, 7, 6, 8, 0, 0, 9, 0, 5, 7, 9, 0,
    ],
    target: 0,
    input: "graph",
    rule: "negative-edges",
    code: `vertices <- 1
while vertices * vertices < n
  vertices <- vertices + 1
end

array dist[n]
i <- 0
while i < vertices
  j <- 0
  while j < vertices
    if i == j
      dist[i * vertices + j] <- 0
    else
      if a[i * vertices + j] == 0
        dist[i * vertices + j] <- 1000000000
      else
        dist[i * vertices + j] <- a[i * vertices + j]
      end
    end
    j <- j + 1
  end
  i <- i + 1
end
k <- 0
while k < vertices
  i <- 0
  while i < vertices
    j <- 0
    while j < vertices
      if dist[i * vertices + k] < 1000000000 && dist[k * vertices + j] < 1000000000 && dist[i * vertices + k] + dist[k * vertices + j] < dist[i * vertices + j]
        dist[i * vertices + j] <- dist[i * vertices + k] + dist[k * vertices + j]
      end
      j <- j + 1
    end
    i <- i + 1
  end
  k <- k + 1
end
negative_cycle <- 0
i <- 0
while i < vertices
  if dist[i * vertices + i] < 0
    negative_cycle <- 1
  end
  i <- i + 1
end`,
  },
];
