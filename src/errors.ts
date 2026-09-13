import type { Locale } from "./algorithms";
/** Translate engine diagnostics without changing user identifiers or expressions. */
export function localizeError(message: string, locale: Locale): string {
  if (locale === "en") return message;
  const translations: [string, string][] = [
    [
      "Data: 1–64 finite numbers, between -1000000 and 1000000",
      "Données : 1 à 64 nombres finis, entre -1 000 000 et 1 000 000",
    ],
    [
      "Execution limit reached (5,000 steps / 10,000 instructions)",
      "Limite d’exécution atteinte (5 000 étapes / 10 000 instructions)",
    ],
    [
      "Expected assignment (<-), if, while, swap, emit or end",
      "Affectation (<-), if, while, swap, emit ou end attendu",
    ],
    [
      "Program too large (20,000 characters maximum)",
      "Programme trop long (20 000 caractères maximum)",
    ],
    [
      "n is read-only; a requires indexing",
      "n est en lecture seule ; a exige un indice",
    ],
    ["Undefined array:", "Tableau non défini :"],
    ["Reserved array name", "Nom de tableau réservé"],
    [
      "Array allocation limit (1–256 cells, 32 arrays, 1024 total)",
      "Limite des tableaux (1–256 cellules, 32 tableaux, 1 024 au total)",
    ],
    ["Trace memory limit exceeded", "Limite mémoire de la trace dépassée"],
    [
      "Expression limit exceeded",
      "Limite d’évaluation des expressions dépassée",
    ],
    ["Maximum nesting: 32", "Imbrication maximale : 32"],
    ["Division by zero", "Division par zéro"],
    ["Numeric limit exceeded", "Limite numérique dépassée"],
    ["Undefined variable:", "Variable non définie :"],
    ["Invalid expression:", "Expression invalide :"],
    ["Expected expression:", "Expression attendue :"],
    ["Unexpected token:", "Élément inattendu :"],
    ["Unexpected end", "end inattendu"],
    ["Unexpected else", "else inattendu"],
    ["Expected )", ") attendu"],
    ["Expected ]", "] attendu"],
    ["Use a[index]", "Utilisez a[indice]"],
    ["Missing end", "end manquant"],
    ["Empty program", "Programme vide"],
    ["Unknown operator", "Opérateur inconnu"],
  ];
  const prefix = /^(L\d+: )?(.*)$/.exec(message)!;
  const detail = prefix[2];
  const match = translations.find(([text]) => detail.startsWith(text));
  if (match)
    return (prefix[1] || "") + match[1] + detail.slice(match[0].length);
  return message.replace(/Index (.+) outside (.+)/, "Indice $1 hors de $2");
}
