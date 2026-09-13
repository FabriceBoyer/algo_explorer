import { GraphView, BufferView, MatrixEditor } from "./Structures";
import { validateInput, randomInput } from "./inputs";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Code2,
  ExternalLink,
  GitBranch,
  Globe2,
  Layers,
  Maximize2,
  Moon,
  Pause,
  Play,
  RotateCcw,
  Search,
  Settings2,
  Shuffle,
  SkipBack,
  SkipForward,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { algorithms } from "./algorithms";
import type { Locale } from "./algorithms";
import { execute, parseData } from "./engine";
import type { Node } from "./engine";
import { localizeError } from "./errors";
import { exportProgram } from "./export";
import type { Language } from "./export";
const read = (key: string, fallback: string) => {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
};
const save = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Storage may be unavailable in private mode. */
  }
};
const words = {
  fr: {
    explore: "Explorer",
    catalog: "Catalogue",
    help: "Guide pratique",
    workspace: "ATELIER INTERACTIF",
    title: "Voir. Comprendre.",
    accent: "Expérimenter.",
    intro: "Les algorithmes prennent vie, une étape à la fois.",
    search: "Rechercher un algorithme…",
    all: "Tous les ateliers",
    sorting: "Tris",
    searchCat: "Recherches",
    math: "Mathématiques",
    arrays: "Tableaux",
    graphs: "Graphes",
    dynamic: "Programmation dynamique",
    graph: "Graphe",
    ready: "prêts à explorer",
    collections: "COLLECTIONS",
    source: "Les sources ouvertes, la curiosité sans limites.",
    browse: "Explorer TheAlgorithms",
    visual: "Visualisation",
    bars: "Barres",
    cells: "Cellules",
    initial: "État initial",
    step: "Étape",
    of: "sur",
    play: "Exécuter",
    pause: "Pause",
    previous: "Étape précédente",
    next: "Étape suivante",
    reset: "Recommencer",
    end: "Dernière étape",
    speed: "Vitesse",
    data: "Données d’entrée",
    apply: "Appliquer",
    random: "Données aléatoires",
    target: "Cible",
    read: "Lecture",
    write: "Écriture",
    idle: "Au repos",
    insight: "LE DÉCLIC",
    variables: "Variables",
    noVars: "Les variables apparaîtront au fil de l’exécution.",
    pseudo: "Pseudocode",
    ast: "Arbre AST",
    edit: "Modifier",
    cancel: "Annuler",
    export: "Exporter",
    download: "Télécharger",
    restore: "Restaurer l’original",
    time: "Temps",
    space: "Mémoire",
    generic: "Indépendant du langage",
    finished: "Exécution terminée",
    error: "Exécution interrompue",
    edits: "Vos modifications changent le programme exécuté et les exports.",
    custom: "Modifié",
    auto: "Automatique",
    theme: "Thème",
    exportTitle: "Votre algorithme, votre langage.",
    exportInfo:
      "Programme autonome généré à partir du pseudocode actuel et des données appliquées. Les snapshots et le résultat final (tableau et variables) sont imprimés en JSON.",
    close: "Fermer",
    sourceTitle: "Une bibliothèque ouverte sur le monde.",
    sourceIntro:
      "Toutes les arborescences TheAlgorithms, réunies dans un catalogue statique. Les fichiers sources ne sont pas tous des algorithmes distincts.",
    loading: "Chargement du catalogue…",
    failed: "Catalogue indisponible. Réessayez ou consultez TheAlgorithms.",
    retry: "Réessayer",
    repositories: "dépôts",
    files: "fichiers indexés",
    snapshot: "Instantané du",
    repo: "Tous les dépôts",
    code: "Code source",
    docs: "Documentation",
    other: "Autres fichiers",
    allFiles: "Tous les fichiers",
    open: "Voir la source",
    noAdapter: "Source · sans simulation intégrée",
    adapterNote:
      "Les ateliers interactifs sont des adaptations pédagogiques indépendantes. Une source du catalogue doit être transcrite dans le pseudocode pris en charge pour être exécutée ici.",
    noResults: "Aucun résultat. Essayez un autre terme.",
    page: "Page",
    sourceSearch: "Nom, chemin, catégorie…",
    back: "Retour à l’atelier",
    helpTitle: "Apprendre en faisant.",
    helpIntro:
      "Un laboratoire pour rendre visibles les étapes habituellement cachées.",
    exportSession: "Sauvegarder la session",
    importSession: "Importer une session",
    session: "Session",
    valid: "Session importée",
    start: "Commencez par un atelier",
    original: "Complexités de la version originale",
    shortcut: "← → pas à pas · Espace lecture / pause",
    sorted:
      "La recherche dichotomique exige des données triées par ordre croissant.",
    euclid: "Euclide exige au moins deux entiers strictement positifs.",
    privacy: "100 % dans votre navigateur",
    saved: "Modifications enregistrées localement",
    current: "INSTRUCTION COURANTE",
    welcome: "Lancez l’algorithme pour observer sa première instruction.",
    steps: "instructions observées",
    mobileMenu: "Afficher les ateliers",
    dirty: "Brouillon : appliquez les modifications pour les exécuter.",
    license: "Licence",
    coverage: "Couverture transparente",
  },
  en: {
    explore: "Explore",
    catalog: "Catalog",
    help: "Field guide",
    workspace: "INTERACTIVE PLAYGROUND",
    title: "See it. Understand it.",
    accent: "Make it yours.",
    intro: "Algorithms come to life, one step at a time.",
    search: "Find an algorithm…",
    all: "All playgrounds",
    sorting: "Sorting",
    searchCat: "Searching",
    math: "Mathematics",
    arrays: "Arrays",
    graphs: "Graphs",
    dynamic: "Dynamic programming",
    graph: "Graph",
    ready: "ready to explore",
    collections: "COLLECTIONS",
    source: "Open sources. Boundless curiosity.",
    browse: "Explore TheAlgorithms",
    visual: "Visualization",
    bars: "Bars",
    cells: "Cells",
    initial: "Initial state",
    step: "Step",
    of: "of",
    play: "Run",
    pause: "Pause",
    previous: "Previous step",
    next: "Next step",
    reset: "Restart",
    end: "Last step",
    speed: "Speed",
    data: "Input data",
    apply: "Apply",
    random: "Randomize data",
    target: "Target",
    read: "Read",
    write: "Write",
    idle: "Idle",
    insight: "THE AHA MOMENT",
    variables: "Variables",
    noVars: "Variables will appear as the algorithm runs.",
    pseudo: "Pseudocode",
    ast: "AST tree",
    edit: "Edit",
    cancel: "Cancel",
    export: "Export",
    download: "Download",
    restore: "Restore original",
    time: "Time",
    space: "Space",
    generic: "Language independent",
    finished: "Execution complete",
    error: "Execution interrupted",
    edits: "Your edits change the executed program and its exports.",
    custom: "Modified",
    auto: "Automatic",
    theme: "Theme",
    exportTitle: "Your algorithm. Your language.",
    exportInfo:
      "A standalone program generated from your current pseudocode and applied input. Snapshots and final results (array and variables) are printed as JSON.",
    close: "Close",
    sourceTitle: "An open world of algorithms.",
    sourceIntro:
      "Every TheAlgorithms repository tree in one static catalog. Source files are not necessarily distinct algorithms.",
    loading: "Loading catalog…",
    failed: "Catalog unavailable. Try again or visit TheAlgorithms.",
    retry: "Try again",
    repositories: "repositories",
    files: "indexed files",
    snapshot: "Snapshot from",
    repo: "All repositories",
    code: "Source code",
    docs: "Documentation",
    other: "Other files",
    allFiles: "All files",
    open: "View source",
    noAdapter: "Source · no built-in simulation",
    adapterNote:
      "Interactive playgrounds are independent educational adaptations. A catalog source must be transcribed into supported pseudocode to execute here.",
    noResults: "No results. Try a different search.",
    page: "Page",
    sourceSearch: "Name, path, category…",
    back: "Back to playground",
    helpTitle: "Learn by doing.",
    helpIntro: "A laboratory for making the invisible steps visible.",
    exportSession: "Save session",
    importSession: "Import session",
    session: "Session",
    valid: "Session imported",
    start: "Start with a playground",
    original: "Original version complexity",
    shortcut: "← → step through · Space play / pause",
    sorted: "Binary search requires data sorted in ascending order.",
    euclid: "Euclid requires at least two strictly positive integers.",
    privacy: "100% in your browser",
    saved: "Changes saved locally",
    current: "CURRENT INSTRUCTION",
    welcome: "Run the algorithm to see its first instruction.",
    steps: "observed instructions",
    mobileMenu: "Show playgrounds",
    dirty: "Draft: apply your changes to execute them.",
    license: "License",
    coverage: "Transparent coverage",
  },
};
function download(name: string, content: string, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function Ast({ nodes, line }: { nodes: Node[]; line: number }) {
  return (
    <ul className="ast-tree">
      {nodes.map((n) => (
        <li key={n.line}>
          <div className={line === n.line ? "ast-active" : ""}>
            <GitBranch aria-hidden="true" size={13} />
            <span>{n.kind}</span>
            <code>{n.text}</code>
          </div>
          {(n.kind === "if" || n.kind === "while") && (
            <>
              <Ast nodes={n.body} line={line} />
              {n.otherwise.length > 0 && (
                <>
                  <small>else</small>
                  <Ast nodes={n.otherwise} line={line} />
                </>
              )}
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
type Catalog = {
  generatedAt: string;
  repositories: {
    name: string;
    sha?: string;
    license?: string;
    status: string;
  }[];
  entries: { repo: string; path: string; name: string; kind: string }[];
};
export default function App() {
  const [locale, setLocale] = useState<Locale>(() =>
    read("locale", navigator.language.startsWith("fr") ? "fr" : "en") === "fr"
      ? "fr"
      : "en",
  );
  const t = words[locale];
  const fr = locale === "fr";
  const [theme, setTheme] = useState(() => read("theme", "auto"));
  const [page, setPage] = useState(() =>
    location.hash === "#help"
      ? "help"
      : location.hash === "#catalog"
        ? "catalog"
        : "explore",
  );
  const [selected, setSelected] = useState(
    () =>
      algorithms.find((a) => a.id === location.hash.slice(1)) || algorithms[0],
  );
  const selectedId = useRef(selected.id);
  selectedId.current = selected.id;
  const [code, setCode] = useState(() =>
    read(`code:${selected.id}`, selected.code),
  );
  const [draft, setDraft] = useState(code);
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(selected.data.join(", "));
  const [data, setData] = useState(selected.data);
  const [target, setTarget] = useState(selected.target ?? 23);
  const [targetDraft, setTargetDraft] = useState(String(target));
  const [inputError, setInputError] = useState("");
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(2);
  const [view, setView] = useState(
    selected.input === "graph" ? "graph" : "bars",
  );
  const [codeView, setCodeView] = useState("pseudo");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [menu, setMenu] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [language, setLanguage] = useState<Language>("python");
  const [notice, setNotice] = useState("");
  const [full, setFull] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [catalogError, setCatalogError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [catalogQuery, setCatalogQuery] = useState("");
  const [repo, setRepo] = useState("");
  const [kind, setKind] = useState("code");
  const [catalogPage, setCatalogPage] = useState(0);
  useEffect(() => {
    document.documentElement.lang = locale;
    save("locale", locale);
  }, [locale]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    save("theme", theme);
  }, [theme]);
  useEffect(() => {
    const fn = () => {
      const hash = location.hash.slice(1);
      if (hash === "help" || hash === "catalog") {
        setPage(hash);
        setPlaying(false);
      } else {
        const a = algorithms.find((a) => a.id === hash);
        if (a && selectedId.current !== a.id) choose(a);
        else setPage("explore");
      }
    };
    window.addEventListener("hashchange", fn);
    return () => window.removeEventListener("hashchange", fn);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${import.meta.env.BASE_URL}catalog.json`, {
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) throw Error();
        return r.json();
      })
      .then(setCatalog)
      .catch((e) => {
        if (e.name !== "AbortError") setCatalogError(true);
      });
    return () => controller.abort();
  }, [retry]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(timer);
  }, [notice]);
  const run = useMemo<ReturnType<typeof execute>>(() => {
    try {
      validateInput(selected, data, target, locale);
      return execute(code, data, target);
    } catch (e) {
      return {
        nodes: [],
        frames: [
          {
            a: data,
            arrays: {},
            arrayReads: {},
            arrayWrites: {},
            vars: { n: data.length, target },
            line: 0,
            reads: [],
            writes: [],
            text: "ready",
          },
        ],
        error: (e as Error).message,
      };
    }
  }, [code, data, target, selected, locale]);
  const frame = run.frames[Math.min(step, run.frames.length - 1)];
  const last = run.frames.length - 1;
  const completed = step === last && step > 0;
  const modified = code !== selected.code;
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(
      () =>
        setStep((s) => {
          if (s >= last) {
            setPlaying(false);
            return s;
          }
          return s + 1;
        }),
      1100 / speed,
    );
    return () => clearInterval(timer);
  }, [playing, speed, last]);
  useEffect(() => {
    function key(e: KeyboardEvent) {
      if (
        page !== "explore" ||
        exporting ||
        ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"].includes(
          (e.target as HTMLElement).tagName,
        )
      )
        return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setPlaying(false);
        setStep((s) => Math.min(last, s + 1));
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setPlaying(false);
        setStep((s) => Math.max(0, s - 1));
      }
      if (e.code === "Space") {
        e.preventDefault();
        if (step === last) setStep(0);
        setPlaying((p) => !p);
      }
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [page, exporting, last, step]);
  const exported = useMemo(() => {
    try {
      return exportProgram(code, data, target, language);
    } catch (e) {
      return (e as Error).message;
    }
  }, [code, data, target, language]);
  const listed = algorithms.filter(
    (a) =>
      (category === "all" || a.category === category) &&
      `${a.name.fr} ${a.name.en}`.toLowerCase().includes(query.toLowerCase()),
  );
  const filtered = useMemo(
    () =>
      catalog?.entries.filter(
        (e) =>
          (!repo || repo === e.repo) &&
          (!kind || e.kind === kind) &&
          `${e.name} ${e.path} ${e.repo}`
            .toLowerCase()
            .includes(catalogQuery.toLowerCase()),
      ) || [],
    [catalog, repo, kind, catalogQuery],
  );
  const categories = [
    ["all", t.all],
    ["sorting", t.sorting],
    ["search", t.searchCat],
    ["arrays", t.arrays],
    ["math", t.math],
    ["graphs", t.graphs],
    ["dynamic", t.dynamic],
  ];
  function navigate(p: string) {
    setPage(p);
    location.hash = p === "explore" ? selected.id : p;
    setPlaying(false);
  }
  function choose(a: typeof selected) {
    selectedId.current = a.id;
    setSelected(a);
    setView(a.input === "graph" ? "graph" : "bars");
    const stored = read(`code:${a.id}`, a.code);
    setCode(stored);
    setDraft(stored);
    setEditing(false);
    setData(a.data);
    setInput(a.data.join(", "));
    setTarget(a.target ?? 23);
    setTargetDraft(String(a.target ?? 23));
    setInputError("");
    setPlaying(false);
    setStep(0);
    setPage("explore");
    setMenu(false);
    location.hash = a.id;
  }
  function applyData() {
    try {
      const next = parseData(input);
      const num = Number(targetDraft);
      if (!targetDraft.trim() || !Number.isFinite(num) || Math.abs(num) > 1e6)
        throw Error(
          fr
            ? "Cible invalide (±1 000 000 maximum)"
            : "Invalid target (±1,000,000 maximum)",
        );
      validateInput(selected, next, num, locale);
      setData(next);
      setTarget(num);
      setStep(0);
      setPlaying(false);
      setInputError("");
    } catch (e) {
      setInputError((e as Error).message);
    }
  }
  function applyCode() {
    try {
      execute(draft, data, target);
      setCode(draft);
      save(`code:${selected.id}`, draft);
      setStep(0);
      setPlaying(false);
      setEditing(false);
      setInputError("");
      setNotice(t.saved);
    } catch (e) {
      setInputError((e as Error).message);
    }
  }
  async function importSession(file?: File) {
    if (!file) return;
    try {
      if (file.size > 50000) throw Error("Session > 50 KB");
      const s = JSON.parse(await file.text());
      const a = algorithms.find((a) => a.id === s.algorithm);
      if (
        !a ||
        s.version !== 1 ||
        typeof s.code !== "string" ||
        !Array.isArray(s.data) ||
        s.data.some((v: unknown) => typeof v !== "number") ||
        typeof s.target !== "number" ||
        !Number.isFinite(s.target) ||
        Math.abs(s.target) > 1e6
      )
        throw Error(fr ? "Session invalide" : "Invalid session");
      const values = parseData(s.data.join(","));
      validateInput(a, values, s.target, locale);
      execute(s.code, values, s.target);
      choose(a);
      setCode(s.code);
      setDraft(s.code);
      setData(values);
      setInput(values.join(", "));
      setTarget(s.target);
      setTargetDraft(String(s.target));
      setNotice(t.valid);
    } catch (e) {
      setInputError((e as Error).message);
    }
    if (fileRef.current) fileRef.current.value = "";
  }
  const max = Math.max(...frame.a.map(Math.abs), 1);
  return (
    <div className="app-shell">
      <aside className={`sidebar ${menu ? "mobile-open" : ""}`}>
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("explore");
          }}
        >
          <span className="brand-icon">
            <Layers aria-hidden="true" size={23} />
          </span>
          <span>
            algo<span className="brand-light">explorer</span>
            <small>THE ALGORITHM PLAYGROUND</small>
          </span>
        </a>
        <div className="sidebar-search">
          <Search aria-hidden="true" size={16} />
          <input
            aria-label={t.search}
            placeholder={t.search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <p className="eyebrow sidebar-label">{t.collections}</p>
        <nav className="categories">
          {categories.map(([id, label], i) => (
            <button
              key={id}
              className={category === id ? "active" : ""}
              onClick={() => {
                setCategory(id);
                navigate("explore");
              }}
            >
              <span className="category-symbol">
                {["◈", "≋", "⌕", "▦", "ƒ", "⌘", "▧"][i]}
              </span>
              {label}
              <span className="count">
                {id === "all"
                  ? algorithms.length
                  : algorithms.filter((a) => a.category === id).length}
              </span>
            </button>
          ))}
        </nav>
        <div className="list-heading">
          <span>{t.explore}</span>
          <span>{listed.length}</span>
        </div>
        <div className="algorithm-list">
          {listed.map((a, i) => (
            <button
              key={a.id}
              className={selected.id === a.id ? "selected" : ""}
              onClick={() => choose(a)}
            >
              <span className="algo-dot" />
              <span>{a.name[locale]}</span>
              {selected.id === a.id ? (
                <ChevronRight aria-hidden="true" size={14} />
              ) : (
                <small>{String(i + 1).padStart(2, "0")}</small>
              )}
            </button>
          ))}
          {!listed.length && <p className="empty">{t.noResults}</p>}
        </div>
        <div className="source-card">
          <div className="source-mark">
            <GitBranch aria-hidden="true" size={18} />
            <span>TheAlgorithms</span>
            <ExternalLink aria-hidden="true" size={13} />
          </div>
          <p>{t.source}</p>
          <button onClick={() => navigate("catalog")}>
            {t.browse}
            <ArrowRight aria-hidden="true" size={15} />
          </button>
        </div>
        <button className="sidebar-help" onClick={() => navigate("help")}>
          <CircleHelp aria-hidden="true" size={17} />
          {t.help}
          <ArrowRight aria-hidden="true" size={15} />
        </button>
        <div className="sidebar-footer">
          <span className="live-dot" />
          {t.privacy}
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="mobile-trigger icon-button"
              aria-label={t.mobileMenu}
              onClick={() => setMenu(!menu)}
            >
              <Layers aria-hidden="true" size={20} />
            </button>
            <span>Playground</span>
            <ChevronRight aria-hidden="true" size={13} />
            <strong>
              {page === "explore"
                ? t.explore
                : page === "help"
                  ? t.help
                  : t.catalog}
            </strong>
          </div>
          <nav className="top-actions">
            <button
              className={page === "catalog" ? "nav-active" : ""}
              onClick={() => navigate("catalog")}
            >
              <BookOpen aria-hidden="true" size={15} />
              {t.catalog}
            </button>
            <button onClick={() => navigate("help")} aria-label={t.help}>
              <CircleHelp aria-hidden="true" size={17} />
            </button>
            <span className="divider" />
            <button
              aria-label={fr ? "Switch to English" : "Passer en français"}
              onClick={() => setLocale(fr ? "en" : "fr")}
            >
              <Globe2 aria-hidden="true" size={15} />
              {locale.toUpperCase()}
            </button>
            <button
              aria-label={`${t.theme}: ${theme}`}
              title={`${t.theme}: ${theme}`}
              onClick={() =>
                setTheme(
                  theme === "auto"
                    ? "light"
                    : theme === "light"
                      ? "dark"
                      : "auto",
                )
              }
            >
              {theme === "dark" ? (
                <Moon aria-hidden="true" size={17} />
              ) : theme === "light" ? (
                <Sun aria-hidden="true" size={17} />
              ) : (
                <Settings2 aria-hidden="true" size={17} />
              )}
            </button>
            <a
              className="github-link"
              href="https://github.com/FabriceBoyer/algo_explorer"
              target="_blank"
              rel="noreferrer"
            >
              <GitBranch aria-hidden="true" size={16} />
              <span>GitHub</span>
            </a>
          </nav>
        </header>
        <main>
          {page === "explore" && (
            <>
              <section className="hero">
                <div>
                  <p className="eyebrow">
                    <span className="tiny-star">✳</span>
                    {t.workspace}
                  </p>
                  <h1>
                    {t.title} <em>{t.accent}</em>
                  </h1>
                  <p className="hero-subtitle">{t.intro}</p>
                </div>
                <div className="hero-badge">
                  <span className="badge-stack">▂ ▅ ▃ ▇</span>
                  <span>
                    <b>
                      {algorithms.length} {fr ? "ateliers" : "playgrounds"}
                    </b>
                    <small>{t.ready}</small>
                  </span>
                </div>
              </section>
              <section className="algorithm-heading">
                <div>
                  <div className="title-line">
                    <h2>{selected.name[locale]}</h2>
                    <span className="pill">
                      {categories.find(([id]) => id === selected.category)?.[1]}
                    </span>
                    {modified && (
                      <span className="pill purple">{t.custom}</span>
                    )}
                  </div>
                  <p>{selected.description[locale]}</p>
                </div>
                <div className="complexities" title={t.original}>
                  <span>
                    {t.time}
                    <b>{selected.complexity}</b>
                  </span>
                  <span>
                    {t.space}
                    <b>{selected.space}</b>
                  </span>
                </div>
              </section>
              {(inputError || run.error) && (
                <div className="error-banner" role="alert">
                  <CircleHelp aria-hidden="true" size={18} />
                  <span>
                    {localizeError(inputError || `${run.error}`, locale)}
                  </span>
                  <button
                    className="text-button"
                    onClick={() => navigate("help")}
                  >
                    {t.help}
                  </button>
                </div>
              )}
              <div className={`workbench ${full ? "expanded" : ""}`}>
                <section className="panel visual-panel">
                  <header className="panel-header">
                    <h3>
                      <span className="coral-dot" />
                      {t.visual}
                    </h3>
                    <div className="panel-actions">
                      <div className="segmented">
                        {(selected.input === "graph"
                          ? ["graph", "cells"]
                          : ["bars", "cells"]
                        ).map((v) => (
                          <button
                            key={v}
                            className={view === v ? "selected" : ""}
                            onClick={() => setView(v)}
                          >
                            {v === "graph"
                              ? t.graph
                              : v === "bars"
                                ? t.bars
                                : t.cells}
                          </button>
                        ))}
                      </div>
                      <button
                        className="icon-button"
                        aria-label={full ? t.close : t.visual}
                        onClick={() => setFull(!full)}
                      >
                        <Maximize2 aria-hidden="true" size={15} />
                      </button>
                    </div>
                  </header>
                  <div className="visual-stage">
                    <div className="stage-caption">
                      <span>
                        <span
                          className={`status-dot ${playing ? "pulsing" : ""}`}
                        />
                        {step === 0
                          ? t.initial
                          : completed
                            ? run.error
                              ? t.error
                              : t.finished
                            : `${t.step} ${step}`}
                      </span>
                      <span>a[{frame.a.length}]</span>
                    </div>
                    {selected.input === "graph" && view === "graph" ? (
                      <GraphView
                        frame={frame}
                        locale={locale}
                        source={target}
                      />
                    ) : (
                      <div
                        className={`array-visual ${view}`}
                        role="img"
                        aria-label={`${t.visual}: ${frame.a.join(", ")}`}
                      >
                        {frame.a.map((value, i) => (
                          <div
                            className={`array-item ${frame.writes.includes(i) ? "writing" : frame.reads.includes(i) ? "reading" : ""}`}
                            key={i}
                          >
                            <div className="bar-space">
                              <div
                                className={`bar ${value < 0 ? "negative" : ""}`}
                                style={{
                                  height:
                                    view === "bars"
                                      ? `${Math.max(9, (Math.abs(value) / max) * 100)}%`
                                      : undefined,
                                }}
                              >
                                <span>
                                  {Number.isInteger(value)
                                    ? value
                                    : Number(value.toFixed(2))}
                                </span>
                              </div>
                            </div>
                            <span className="array-index">{i}</span>
                            <div className="array-pointer">
                              {Object.entries(frame.vars)
                                .filter(
                                  ([name, v]) =>
                                    [
                                      "i",
                                      "j",
                                      "mid",
                                      "left",
                                      "right",
                                      "best",
                                      "low",
                                      "high",
                                      "root",
                                      "child",
                                      "k",
                                      "p",
                                      "start",
                                    ].includes(name) && v === i,
                                )
                                .map(([name]) => (
                                  <span key={name}>{name}</span>
                                ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="legend">
                      <span>
                        <i />
                        {t.idle}
                      </span>
                      <span>
                        <i className="purple-dot" />
                        {t.read}
                      </span>
                      <span>
                        <i className="coral-dot" />
                        {t.write}
                      </span>
                    </div>
                  </div>
                  <div className="transport">
                    <div className="scrubber">
                      <input
                        type="range"
                        min="0"
                        max={last}
                        value={Math.min(step, last)}
                        aria-label={t.step}
                        onChange={(e) => {
                          setPlaying(false);
                          setStep(Number(e.target.value));
                        }}
                      />
                      <span>
                        {step}
                        <small> / {last}</small>
                      </span>
                    </div>
                    <div className="transport-row">
                      <div className="play-controls">
                        <button
                          className="icon-button"
                          aria-label={t.reset}
                          onClick={() => {
                            setStep(0);
                            setPlaying(false);
                          }}
                        >
                          <SkipBack aria-hidden="true" size={17} />
                        </button>
                        <button
                          className="icon-button"
                          aria-label={t.previous}
                          disabled={step === 0}
                          onClick={() => {
                            setStep((s) => s - 1);
                            setPlaying(false);
                          }}
                        >
                          <ArrowLeft aria-hidden="true" size={17} />
                        </button>
                        <button
                          className="primary play"
                          disabled={last === 0}
                          onClick={() => {
                            if (step === last) setStep(0);
                            setPlaying(!playing);
                          }}
                        >
                          {playing ? (
                            <Pause
                              aria-hidden="true"
                              size={16}
                              fill="currentColor"
                            />
                          ) : (
                            <Play
                              aria-hidden="true"
                              size={16}
                              fill="currentColor"
                            />
                          )}
                          {playing ? t.pause : t.play}
                        </button>
                        <button
                          className="icon-button"
                          aria-label={t.next}
                          disabled={step >= last}
                          onClick={() => {
                            setStep((s) => s + 1);
                            setPlaying(false);
                          }}
                        >
                          <ArrowRight aria-hidden="true" size={17} />
                        </button>
                        <button
                          className="icon-button"
                          aria-label={t.end}
                          disabled={step >= last}
                          onClick={() => {
                            setStep(last);
                            setPlaying(false);
                          }}
                        >
                          <SkipForward aria-hidden="true" size={17} />
                        </button>
                      </div>
                      <label className="speed">
                        {t.speed}
                        <select
                          value={speed}
                          onChange={(e) => setSpeed(Number(e.target.value))}
                        >
                          {[0.5, 1, 2, 4, 8].map((s) => (
                            <option key={s} value={s}>
                              {s}×
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>
                  <form
                    className="input-panel"
                    onSubmit={(e) => {
                      e.preventDefault();
                      applyData();
                    }}
                  >
                    <div className="input-label">
                      <label htmlFor="data">{t.data}</label>
                      <button
                        type="button"
                        className="text-button"
                        onClick={() => {
                          const values = randomInput(selected);
                          setInput(values.join(", "));
                        }}
                      >
                        <Shuffle aria-hidden="true" size={13} />
                        {t.random}
                      </button>
                    </div>
                    {selected.input === "graph" && (
                      <MatrixEditor
                        input={input}
                        update={setInput}
                        locale={locale}
                        symmetric={selected.rule === "undirected"}
                      />
                    )}
                    <div className="input-row">
                      <input
                        id="data"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        spellCheck={false}
                      />
                      <button type="submit" className="secondary">
                        {t.apply}
                        <ArrowRight aria-hidden="true" size={14} />
                      </button>
                    </div>
                    {selected.target !== undefined && (
                      <label className="target-input">
                        {selected.input === "graph"
                          ? fr
                            ? "Sommet de départ (0 = A)"
                            : "Starting vertex (0 = A)"
                          : selected.id === "sliding-window"
                            ? fr
                              ? "Taille de fenêtre"
                              : "Window size"
                            : selected.id === "rotate-array"
                              ? fr
                                ? "Décalage"
                                : "Shift"
                              : t.target}
                        <input
                          type="number"
                          value={targetDraft}
                          onChange={(e) => setTargetDraft(e.target.value)}
                        />
                      </label>
                    )}
                  </form>
                </section>
                <section className="panel code-panel">
                  <header className="panel-header">
                    <div className="code-tabs">
                      <button
                        className={codeView === "pseudo" ? "active" : ""}
                        onClick={() => setCodeView("pseudo")}
                      >
                        <Code2 aria-hidden="true" size={16} />
                        {t.pseudo}
                      </button>
                      <button
                        className={codeView === "ast" ? "active" : ""}
                        onClick={() => setCodeView("ast")}
                      >
                        <GitBranch aria-hidden="true" size={15} />
                        {t.ast}
                      </button>
                    </div>
                    <button
                      className="text-button"
                      onClick={() => {
                        setEditing(!editing);
                        setCodeView("pseudo");
                        setDraft(code);
                        setPlaying(false);
                      }}
                    >
                      {editing ? t.cancel : t.edit}
                    </button>
                  </header>
                  <div className="code-body">
                    {editing ? (
                      <>
                        <p className="editor-hint">{t.edits}</p>
                        <textarea
                          aria-label={t.pseudo}
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          spellCheck={false}
                        />
                        <div className="editor-actions">
                          <button
                            className="text-button"
                            onClick={() => setDraft(selected.code)}
                          >
                            <RotateCcw aria-hidden="true" size={13} />
                            {t.restore}
                          </button>
                          <button className="primary" onClick={applyCode}>
                            <Check aria-hidden="true" size={15} />
                            {t.apply}
                          </button>
                        </div>
                        {draft !== code && (
                          <p className="editor-hint">{t.dirty}</p>
                        )}
                      </>
                    ) : codeView === "ast" ? (
                      <Ast nodes={run.nodes} line={frame.line} />
                    ) : (
                      <div className="code-lines">
                        {code.split("\n").map((line, i) => (
                          <div
                            key={i}
                            className={
                              frame.line === i + 1 ? "current-line" : ""
                            }
                          >
                            <span className="line-number">
                              {frame.line === i + 1 ? (
                                <ChevronRight aria-hidden="true" size={12} />
                              ) : (
                                i + 1
                              )}
                            </span>
                            <code>
                              {line
                                .split(
                                  /(\b(?:array|while|if|else|end|swap|emit)\b|<-|\b\d+\b)/g,
                                )
                                .map((part, j) => (
                                  <span
                                    key={j}
                                    className={
                                      /^(array|while|if|else|end|swap|emit|<-)$/.test(
                                        part,
                                      )
                                        ? "keyword"
                                        : /^\d+$/.test(part)
                                          ? "number"
                                          : ""
                                    }
                                  >
                                    {part}
                                  </span>
                                ))}
                            </code>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="code-footer">
                    <span>
                      <Globe2 aria-hidden="true" size={13} />
                      {t.generic}
                    </span>
                    <button
                      className="text-button"
                      onClick={() => {
                        setExporting(true);
                        setPlaying(false);
                      }}
                    >
                      <ArrowDownToLine aria-hidden="true" size={14} />
                      {t.export}
                      <ChevronDown aria-hidden="true" size={12} />
                    </button>
                  </div>
                  <div className="variables">
                    <h3>
                      {t.variables}
                      <span>{Object.keys(frame.vars).length}</span>
                    </h3>
                    <div className="variable-grid">
                      {Object.entries(frame.vars).map(([key, v]) => (
                        <div
                          key={key}
                          className={
                            step > 0 && run.frames[step - 1]?.vars[key] !== v
                              ? "changed"
                              : ""
                          }
                        >
                          <code>{key}</code>
                          <strong>
                            {Number.isInteger(v) ? v : Number(v.toFixed(3))}
                          </strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
              <BufferView
                frame={frame}
                previous={run.frames[step - 1]}
                locale={locale}
                matrixSize={
                  selected.input === "graph"
                    ? Math.sqrt(data.length)
                    : undefined
                }
              />
              <div className="bottom-grid">
                <section className="insight">
                  <div className="insight-icon">
                    <Sparkles aria-hidden="true" size={20} />
                  </div>
                  <div>
                    <h3>{t.insight}</h3>
                    <p>{selected.insight[locale]}</p>
                  </div>
                </section>
                <section className="instruction">
                  <span className="eyebrow">{t.current}</span>
                  <code>{step ? frame.text : t.welcome}</code>
                </section>
              </div>
              <footer className="workspace-footer">
                <span>{t.shortcut}</span>
                <div>
                  <button
                    onClick={() =>
                      download(
                        `${selected.id}.json`,
                        JSON.stringify(
                          {
                            version: 1,
                            algorithm: selected.id,
                            code,
                            data,
                            target,
                          },
                          null,
                          2,
                        ),
                        "application/json",
                      )
                    }
                  >
                    {t.exportSession}
                  </button>
                  <button onClick={() => fileRef.current?.click()}>
                    {t.importSession}
                  </button>
                  <input
                    hidden
                    type="file"
                    accept=".json"
                    ref={fileRef}
                    onChange={(e) => void importSession(e.target.files?.[0])}
                  />
                </div>
              </footer>
            </>
          )}
          {page === "catalog" && (
            <section className="catalog-page">
              <p className="eyebrow">
                <GitBranch aria-hidden="true" size={15} /> THE ALGORITHMS / OPEN
                SOURCE
              </p>
              <h1>{t.sourceTitle}</h1>
              <p className="page-intro">{t.sourceIntro}</p>
              <div className="coverage-note">
                <Layers aria-hidden="true" size={23} />
                <div>
                  <strong>{t.coverage}</strong>
                  <p>{t.adapterNote}</p>
                </div>
              </div>
              {catalog ? (
                <>
                  <div className="catalog-stats">
                    <div>
                      <b>{catalog.repositories.length}</b>
                      {t.repositories}
                    </div>
                    <div>
                      <b>{catalog.entries.length.toLocaleString(locale)}</b>
                      {t.files}
                    </div>
                    <div>
                      <b>{algorithms.length}</b>
                      {fr
                        ? "simulations interactives"
                        : "interactive simulations"}
                    </div>
                    <small>
                      {t.snapshot}{" "}
                      {new Date(catalog.generatedAt).toLocaleDateString(locale)}
                    </small>
                  </div>
                  <div className="catalog-filters">
                    <div className="search-field">
                      <Search aria-hidden="true" size={17} />
                      <input
                        placeholder={t.sourceSearch}
                        aria-label={t.sourceSearch}
                        value={catalogQuery}
                        onChange={(e) => {
                          setCatalogQuery(e.target.value);
                          setCatalogPage(0);
                        }}
                      />
                    </div>
                    <select
                      aria-label={t.repo}
                      value={repo}
                      onChange={(e) => {
                        setRepo(e.target.value);
                        setCatalogPage(0);
                      }}
                    >
                      <option value="">{t.repo}</option>
                      {catalog.repositories.map((r) => (
                        <option key={r.name}>{r.name}</option>
                      ))}
                    </select>
                    <select
                      aria-label={t.allFiles}
                      value={kind}
                      onChange={(e) => {
                        setKind(e.target.value);
                        setCatalogPage(0);
                      }}
                    >
                      <option value="code">{t.code}</option>
                      <option value="doc">{t.docs}</option>
                      <option value="other">{t.other}</option>
                      <option value="">{t.allFiles}</option>
                    </select>
                  </div>
                  <p className="results-count">
                    {filtered.length.toLocaleString(locale)}{" "}
                    {fr ? "résultats" : "results"}
                  </p>
                  <div className="catalog-results">
                    {filtered
                      .slice(catalogPage * 30, (catalogPage + 1) * 30)
                      .map((e) => {
                        const repository = catalog.repositories.find(
                          (r) => r.name === e.repo,
                        )!;
                        return (
                          <article key={e.repo + e.path}>
                            <span className="file-icon">
                              <Code2 aria-hidden="true" size={20} />
                            </span>
                            <div>
                              <h3>{e.name}</h3>
                              <p>
                                {e.repo} / {e.path}
                              </p>
                              <small>
                                {t.noAdapter} · {t.license}:{" "}
                                {repository.license || "NOASSERTION"}
                              </small>
                            </div>
                            <a
                              href={`https://github.com/TheAlgorithms/${encodeURIComponent(e.repo)}/blob/${repository.sha}/${e.path.split("/").map(encodeURIComponent).join("/")}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {t.open}
                              <ExternalLink aria-hidden="true" size={14} />
                            </a>
                          </article>
                        );
                      })}
                  </div>
                  {!filtered.length && <p className="empty">{t.noResults}</p>}
                  <div className="pagination">
                    <button
                      className="secondary"
                      disabled={catalogPage === 0}
                      onClick={() => setCatalogPage((p) => p - 1)}
                    >
                      <ArrowLeft aria-hidden="true" size={16} />
                      {t.previous}
                    </button>
                    <span>
                      {t.page} {catalogPage + 1} /{" "}
                      {Math.max(1, Math.ceil(filtered.length / 30))}
                    </span>
                    <button
                      className="secondary"
                      disabled={(catalogPage + 1) * 30 >= filtered.length}
                      onClick={() => setCatalogPage((p) => p + 1)}
                    >
                      {t.next}
                      <ArrowRight aria-hidden="true" size={16} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="empty">
                  {catalogError ? (
                    <>
                      {t.failed}
                      <button
                        onClick={() => {
                          setCatalogError(false);
                          setRetry((r) => r + 1);
                        }}
                      >
                        {t.retry}
                      </button>
                    </>
                  ) : (
                    t.loading
                  )}
                </div>
              )}
            </section>
          )}
          {page === "help" && (
            <section className="help-page">
              <p className="eyebrow">
                <BookOpen aria-hidden="true" size={16} />
                {t.help}
              </p>
              <h1>{t.helpTitle}</h1>
              <p className="page-intro">{t.helpIntro}</p>
              <div className="help-grid">
                {(fr
                  ? [
                      [
                        "01",
                        "Choisir et observer",
                        "Choisissez l’un des 45 ateliers. Exécuter anime les instructions ; les flèches avancent ou reculent d’une étape. Le curseur accède à n’importe quel état. Espace lance ou suspend la lecture hors des champs de saisie.",
                      ],
                      [
                        "02",
                        "Lire la visualisation",
                        "Chaque barre représente a[index]. Sa hauteur représente la valeur absolue ; les nombres négatifs sont hachurés et conservent leur signe. Bleu = lecture, corail = écriture. Les étiquettes sous les indices montrent les curseurs du programme. Le mode Cellules convient aux grands tableaux.",
                      ],
                      [
                        "03",
                        "Changer les données",
                        "Saisissez 1 à 64 nombres séparés par des virgules, espaces ou points-virgules (valeur absolue ≤ 1 000 000), puis Appliquer. Les décimales utilisent un point. Aléatoire prépare de nouvelles données à appliquer. La recherche dichotomique exige un tableau trié ; Euclide deux entiers strictement positifs.",
                      ],
                      [
                        "04",
                        "Modifier le programme",
                        "Modifier ouvre l’éditeur. Appliquer reconstruit la trace et sauvegarde le pseudocode localement par atelier. Restaurer l’original prépare le code initial : cliquez ensuite sur Appliquer. Les complexités affichées concernent toujours la version originale.",
                      ],
                      [
                        "05",
                        "Exporter et partager",
                        "Exporter génère un programme autonome Python 3, Go ou C11 à partir du pseudocode appliqué. Le programme imprime les tableaux en JSON à chaque emit, puis le tableau et les variables à la fin. Sauvegarder la session conserve données, cible et code dans un JSON réimportable. Aucun fichier importé n’exécute de JavaScript.",
                      ],
                      [
                        "06",
                        "Comprendre la couverture",
                        "Le catalogue indexe tous les fichiers de toutes les arborescences publiques découvertes dans l’organisation TheAlgorithms à la date indiquée, y compris les dépôts archivés non vides. Filtres et recherche donnent accès aux sources, pas à une traduction universelle. 45 adaptations indépendantes sont simulables, dont sept ateliers de graphes. Les tableaux auxiliaires et les matrices aplaties sont pris en charge ; les chaînes et la récursion restent à ajouter. Les autres sources du catalogue restent à adapter et à tester.",
                      ],
                    ]
                  : [
                      [
                        "01",
                        "Choose and observe",
                        "Choose one of 45 playgrounds. Run animates instructions; the arrows move forward or backward one step. Scrub to any state. Space toggles playback when you are not editing or focusing a control.",
                      ],
                      [
                        "02",
                        "Read the visualization",
                        "Each bar represents a[index]. Height represents absolute value; negative numbers are hatched and retain their sign. Blue means read, coral means write. Labels beneath indices show program cursors. Cells mode works well for larger arrays.",
                      ],
                      [
                        "03",
                        "Change the input",
                        "Enter 1–64 numbers separated by commas, spaces or semicolons (absolute value ≤ 1,000,000), then Apply. Use dots for decimals. Randomize prepares fresh input to apply. Binary search requires sorted data; Euclid requires two strictly positive integers.",
                      ],
                      [
                        "04",
                        "Edit the program",
                        "Edit opens the editor. Apply rebuilds the trace and saves pseudocode locally per playground. Restore original prepares the initial program: click Apply afterward. Displayed complexities always describe the original version.",
                      ],
                      [
                        "05",
                        "Export and share",
                        "Export generates a standalone Python 3, Go or C11 program from applied pseudocode. It prints JSON arrays on emit, then the array and variables at completion. Save session preserves data, target and code as importable JSON. Imported files never execute JavaScript.",
                      ],
                      [
                        "06",
                        "Understand coverage",
                        "The catalog indexes every file in every public repository tree discovered in TheAlgorithms at the snapshot date, including non-empty archived repositories. Search and filters provide sources, not universal translation. 45 independent adaptations are executable, including seven graph playgrounds. Auxiliary arrays and flattened matrices are supported; strings and recursion remain future work. Other catalog sources still need adaptation and testing.",
                      ],
                    ]
                ).map(([num, title, text]) => (
                  <article className="help-card" key={num}>
                    <span>{num}</span>
                    <h2>{title}</h2>
                    <p>{text}</p>
                  </article>
                ))}
              </div>
              <section className="syntax-guide">
                <h2>
                  {fr
                    ? "Un pseudocode simple, un vrai moteur."
                    : "Simple pseudocode. A real interpreter."}
                </h2>
                <p>
                  {fr
                    ? "Tableau numérique a, longueur n en lecture seule, cible target et variables scalaires. Indices à partir de zéro. Une instruction par ligne ; blocs fermés par end. Déclarez un tableau de zéros avec array temp[n], puis lisez ou modifiez temp[i]. Les graphes utilisent a[u * vertices + v] : 0 = aucune arête. Le bouton Modifier les arêtes édite la matrice ; appliquez ensuite les données."
                    : "Numeric array a, read-only length n, target and scalar variables. Zero-based indices. One instruction per line; close blocks with end. Declare a zero-filled array with array temp[n], then read or modify temp[i]. Graphs use a[u * vertices + v]: 0 = no edge. Edit edges opens the matrix editor; apply your changes afterward."}
                </p>
                <pre>{`# ${fr ? "Commentaire" : "Comment"}
i <- 0
while i < n
  if a[i] > target
    a[i] <- a[i] - 1
  else
    emit
  end
  i <- i + 1
end
swap a[0], a[n - 1]`}</pre>
                <p>
                  <code>+ - * / % &lt; &gt; &lt;= &gt;= == != && || ! ( )</code>
                </p>
                <p>
                  {fr
                    ? "La division est réelle ; % est le reste signé (comme C). && et || court-circuitent. Les valeurs sont des nombres IEEE 754 ; les comparaisons produisent 0 ou 1. Limites : 20 000 caractères, 32 blocs imbriqués, 5 000 étapes, 10 000 instructions, valeurs stockées ≤ 10¹². Tableaux auxiliaires : 1 à 256 cellules chacun, 32 tableaux et 1 024 cellules au total. La trace est limitée à 2 millions de valeurs et 500 000 évaluations d’expression. Une erreur conserve les étapes déjà exécutées. Les exports ont une limite de 10 000 instructions, sans l’historique visuel."
                    : "Division is real; % is signed remainder (as in C). && and || short-circuit. Values use IEEE 754 numbers; comparisons produce 0 or 1. Limits: 20,000 characters, 32 nested blocks, 5,000 steps, 10,000 instructions, stored absolute values ≤ 10¹². Auxiliary arrays: 1–256 cells each, 32 arrays and 1,024 total cells. Trace storage is capped at 2 million values and 500,000 expression evaluations. Errors preserve earlier steps. Exports have a 10,000-instruction limit without visual history."}
                </p>
              </section>
              <section className="help-card">
                <h2>
                  {fr
                    ? "Sources, licences et autres pistes"
                    : "Sources, licenses and further learning"}
                </h2>
                <p>
                  {fr
                    ? "Les sources externes restent soumises à leur licence propre, affichée dans le catalogue ; vérifiez aussi les en-têtes des fichiers. Aucun code source externe n’est embarqué. Les ateliers ont été écrits pour ce projet. Pour compléter : "
                    : "External sources retain their own licenses, shown in the catalog; also check file headers. No external source code is bundled. Playgrounds were authored for this project. Further resources: "}
                  <a
                    href="https://the-algorithms.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    The Algorithms
                  </a>{" "}
                  ·{" "}
                  <a
                    href="https://visualgo.net/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    VisuAlgo
                  </a>{" "}
                  ·{" "}
                  <a
                    href="https://cp-algorithms.com/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    CP-Algorithms
                  </a>
                  .
                </p>
                <p>
                  {fr
                    ? "Le thème suit votre système par défaut. Le bouton de thème alterne automatique, clair et sombre. La langue est détectée au premier accès, puis votre choix FR/EN est mémorisé. Aucune télémétrie ni backend : seuls les fichiers statiques sont téléchargés."
                    : "Theme follows your system by default. The theme button cycles auto, light and dark. Language is detected on first access, then your FR/EN choice is remembered. No telemetry or backend: only static files are downloaded."}
                </p>
              </section>
              <button className="primary" onClick={() => navigate("explore")}>
                <ArrowLeft aria-hidden="true" size={16} />
                {t.back}
              </button>
            </section>
          )}
        </main>
      </div>
      {exporting && (
        <ExportDialog close={() => setExporting(false)} title={t.exportTitle}>
          <p>{t.exportInfo}</p>
          <div className="export-options">
            {(["python", "go", "c"] as const).map((l) => (
              <button
                key={l}
                className={language === l ? "selected" : ""}
                onClick={() => setLanguage(l)}
              >
                {l === "python" ? "Python 3" : l === "go" ? "Go" : "C11"}
              </button>
            ))}
          </div>
          <pre>{exported}</pre>
          <button
            className="primary"
            disabled={!run.nodes.length}
            onClick={() =>
              download(
                `${selected.id}.${language === "python" ? "py" : language}`,
                exported,
              )
            }
          >
            <ArrowDownToLine aria-hidden="true" size={16} />
            {t.download}
          </button>
        </ExportDialog>
      )}
      {notice && (
        <div role="status" className="toast">
          <Check aria-hidden="true" size={17} />
          {notice}
        </div>
      )}
    </div>
  );
}
function ExportDialog({
  close,
  title,
  children,
}: {
  close: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      className="export-dialog"
      onCancel={close}
      onClick={(e) => {
        if (e.target === ref.current) close();
      }}
    >
      <div className="modal-content">
        <button
          autoFocus
          aria-label="Close / Fermer"
          className="modal-close icon-button"
          onClick={close}
        >
          <X aria-hidden="true" size={22} />
        </button>
        <span className="eyebrow">CODE EXPORT</span>
        <h2>{title}</h2>
        {children}
      </div>
    </dialog>
  );
}
