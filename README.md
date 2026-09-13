# Algo Explorer

Un atelier visuel pour apprendre les algorithmes en manipulant leur exécution. **React + TypeScript + Vite, frontend uniquement**, déployé sur GitHub Pages et servi localement par Docker/Nginx.

- **Site :** https://FabriceBoyer.github.io/algo_explorer/
- **Aide FR/EN :** https://FabriceBoyer.github.io/algo_explorer/#help
- **Catalogue :** https://FabriceBoyer.github.io/algo_explorer/#catalog

## Couverture réelle

L’instantané initial du 13 septembre 2026 indexe **10 038 fichiers de 44 dépôts publics TheAlgorithms** : code, documentation et autres fichiers, avec chemin, dépôt, licence déclarée et référence de commit. Les dépôts archivés non vides sont inclus, les dépôts vides sont indiqués. Les fichiers ne correspondent **pas** tous à des algorithmes distincts : tests, outils et variantes sont également présents.

**12 ateliers sont réellement simulables et exportables.** Le catalogue exhaustif des fichiers ne constitue pas une simulation automatique de tous les algorithmes de l’organisation. Les autres sources sont consultables sur GitHub, explicitement étiquetées « sans simulation intégrée ». Leur adaptation en pseudocode reste à réaliser. Il n’existe pas de traduction automatique universelle du code source importé.

| Famille       | Ateliers                                    | Temps, pire cas | Mémoire auxiliaire du programme |
| ------------- | ------------------------------------------- | --------------- | ------------------------------- |
| Tris          | Bulles, sélection, insertion, gnome         | O(n²)           | O(1)                            |
| Recherche     | Linéaire                                    | O(n)            | O(1)                            |
| Recherche     | Dichotomique                                | O(log n)        | O(1)                            |
| Tableaux      | Maximum, sommes préfixes, inversion, Kadane | O(n)            | O(1)                            |
| Mathématiques | PGCD d’Euclide                              | O(log min(a,b)) | O(1)                            |
| Mathématiques | Fibonacci, remplissage du tableau           | O(n)            | O(1)                            |

Ces complexités concernent les versions originales, hors stockage de la trace par l’interface. Les ateliers sont des adaptations pédagogiques écrites pour ce projet, pas des copies d’implémentations externes.

## Démarrage en moins de cinq minutes

Prérequis : Node.js **22.22.1 ou supérieur dans la branche 22**, npm et Git. Pour la suite complète de tests : Python 3, Go et GCC (C11).

```sh
npm ci
npm run dev
```

Ouvrir http://localhost:5173. Le catalogue livré fonctionne sans authentification GitHub. Aucun backend, compte, clé API, télémétrie ou police externe n’est nécessaire à l’exécution du site. Les fichiers statiques doivent être servis par HTTP, pas ouverts directement avec `file://`.

### Docker Compose

Prérequis : Docker Engine et Compose v2+.

```sh
docker compose up --build -d --wait
```

Ouvrir http://localhost:8080 (ou le port configuré dans `.env` ; cette installation locale utilise **8090** car 8080 était occupé). Le port est lié à **127.0.0.1**. Pour choisir un autre port :

```sh
PORT=8090 docker compose up --build -d --wait
```

Commandes utiles :

```sh
docker compose ps
docker compose logs --tail=100 web
docker compose up --build --force-recreate -d --wait
docker compose down
```

L’image compile Vite dans un étage Node, puis sert uniquement `dist/` avec Nginx sur le port interne 8080. Le conteneur a une racine en lecture seule et des volumes temporaires pour Nginx. Son healthcheck vérifie HTTP `/`. Nginx n’est pas un backend applicatif : aucune exécution de programme utilisateur ne lui est transmise.

## Utiliser l’atelier

1. Sélectionner un atelier dans la barre latérale ; filtrer par famille ou nom français/anglais.
2. Cliquer **Exécuter** ; régler la vitesse de 0,5× à 8×.
3. Les flèches avancent/reculent d’une instruction. Le curseur donne accès à toute la trace. Recommencer revient à l’état initial ; dernière étape montre le résultat.
4. La ligne exécutée est surlignée dans le pseudocode et dans l’arbre AST. Les variables modifiées deviennent vertes.
5. Dans **Données d’entrée**, préparer les valeurs puis cliquer **Appliquer**. Aléatoire modifie le champ, sans appliquer silencieusement ses valeurs.
6. **Modifier** ouvre l’éditeur. **Appliquer** reconstruit la trace depuis l’état initial et mémorise le pseudocode par atelier. **Restaurer l’original** remplit l’éditeur ; appliquer ensuite.
7. **Exporter** produit un programme Python, Go ou C avec le code et les données effectivement appliqués, et non un brouillon non appliqué.
8. **Sauvegarder la session** produit un JSON contenant atelier, pseudocode, données et cible. **Importer une session** les restaure après validation.

### Lire l’affichage

- Tableau `a`, indexé à partir de **0**. Hauteur des barres = valeur absolue. Les nombres négatifs sont hachurés avec leur signe visible.
- Violet : lecture ; vert : écriture ; vert-gris : cellule non touchée à cette étape.
- Les curseurs `i`, `j`, `low`, `high`, `mid`, `left`, `right`, `best` apparaissent sous les indices correspondants.
- Le mode **Cellules** conserve les valeurs et indices sans coder les grandeurs par les hauteurs.
- Les états sont des instantanés immuables : revenir en arrière ne réexécute pas du code arbitraire.
- Les touches **← / →** naviguent et **Espace** joue/suspend lorsque le focus n’est pas sur un champ ou un contrôle.

### Données et préconditions

1 à 64 nombres, séparés par virgules, espaces ou points-virgules ; décimales avec un point. Valeur absolue maximale : 1 000 000. La cible de recherche suit la même limite.

La recherche dichotomique exige un tableau croissant. Euclide utilise les deux premières valeurs, qui doivent être des entiers strictement positifs. Fibonacci utilise la longueur du tableau comme nombre de termes. Les autres préconditions sont décrites dans le panneau pédagogique.

### Préférences et accessibilité

Langue détectée via `navigator.language` au premier accès, puis choix FR/EN enregistré localement. Thème automatique via `prefers-color-scheme`, avec alternance auto → clair → sombre. `prefers-reduced-motion` désactive les transitions et pulsations. Contrôles natifs accessibles au clavier, focus visible, dialogue d’export modal et mise en page adaptative. Les 64 cellules restent consultables horizontalement sur petit écran. Les diagnostics usuels du moteur sont également traduits.

Les seuls éléments conservés automatiquement sont les préférences et le pseudocode appliqué par atelier dans `localStorage`. L’import d’une session ne l’enregistre pas automatiquement : appliquer le code pour le mémoriser. Exporter une session avant d’effacer les données du navigateur.

## Langage de pseudocode

Le moteur manipule un tableau numérique `a`, sa longueur `n` en lecture seule, une variable `target` et des variables scalaires. Les identifiants suivent `[a-zA-Z_]\w*`. Les mots-clés sont en minuscules et restent identiques en FR/EN.

```text
# Parcours avec modification conditionnelle
i <- 0
while i < n
  if a[i] > target
    a[i] <- a[i] - 1
  else
    emit
  end
  i <- i + 1
end
swap a[0], a[n - 1]
```

| Construction                    | Sémantique                                            |
| ------------------------------- | ----------------------------------------------------- |
| `x <- expression`               | Affectation d’une variable numérique                  |
| `a[index] <- expression`        | Écriture dans le tableau                              |
| `swap a[i], a[j]`               | Échange de deux cellules                              |
| `if condition` / `else` / `end` | Branchement, `else` facultatif                        |
| `while condition` / `end`       | Boucle tant que la condition est non nulle            |
| `emit`                          | Étape explicite ; imprime le tableau dans les exports |
| `# commentaire`                 | Commentaire jusqu’à la fin de la ligne                |

Une instruction par ligne. L’indentation est recommandée mais ne délimite pas les blocs : utiliser `end`. Les expressions acceptent `+ - * / %`, `== != < > <= >=`, `&& || !` et les parenthèses. Priorité usuelle ; opérateurs binaires associatifs à gauche. `&&` et `||` court-circuitent. Les comparaisons produisent 0 ou 1, zéro signifie faux. La division est réelle ; `%` est le reste signé, et non le modulo mathématique positif.

### Limites du moteur

- Nombres IEEE 754 double précision, pas d’entiers arbitrairement grands.
- 20 000 caractères par programme, 32 blocs imbriqués.
- 5 000 étapes visibles / 10 000 instructions de contrôle ; une boucle infinie est interrompue.
- Toute valeur stockée doit être finie et de valeur absolue ≤ 10¹².
- Accès hors tableau, indice fractionnaire, variable non définie, division par zéro et syntaxe invalide sont signalés.
- Une erreur d’exécution conserve la portion valide de la trace et indique la ligne fautive.
- Ni `eval`, ni `Function`, ni JavaScript utilisateur, ni imports exécutables.
- **Pas encore de graphes, matrices, chaînes, fonctions, récursion, allocation dynamique ni visualisation de structures arborescentes de données.** L’arbre AST représente le programme, pas un arbre binaire d’entrée.

Le langage vise l’expérimentation pédagogique ; ce n’est pas un compilateur des langages des dépôts TheAlgorithms.

## Exports Python, Go et C

Les exports sont dérivés du même AST que l’interpréteur. Ils incluent les valeurs initiales, des garde-fous et des helpers numériques. Les noms scalaires sont représentés par des indices internes, évitant les collisions avec les mots réservés du langage cible.

```sh
python3 bubble-sort.py
go run bubble-sort.go
gcc -std=c11 bubble-sort.c -lm -o bubble-sort
./bubble-sort
```

`emit` imprime un tableau JSON. La dernière ligne est un objet JSON avec `a` (résultat) et `variables` (état scalaire). Exemples : résultat de recherche dans `variables.result`, PGCD dans `variables.result`.

Les exports partagent les opérations et contrôles de bornes ; ils sont limités à 10 000 instructions mais ne stockent pas les 5 000 images de l’interface. À cette limite, leur nombre exact d’itérations peut différer du moteur, car la trace visuelle est limitée séparément. Des différences d’arrondi IEEE 754 restent possibles pour des calculs extrêmes.

## Catalogue TheAlgorithms

`public/catalog.json` est un instantané statique livré et versionné. Le navigateur ne contacte pas l’API GitHub. Il filtre et pagine localement les fichiers ; les liens de consultation pointent vers le **commit exact** indexé.

Pour rafraîchir :

```sh
# GitHub CLI authentifié, OU GH_TOKEN / GITHUB_TOKEN dans l’environnement
npm run catalog
npm run check
git add public/catalog.json
git commit -m "chore: refresh TheAlgorithms catalog"
git push
```

`scripts/catalog.mjs` pagine la liste complète des dépôts publics et lit chaque arbre. Un arbre tronqué est parcouru récursivement sans perdre ses sous-arbres. Une requête échouée arrête le processus avant publication du nouvel instantané ; une écriture temporaire puis un renommage préservent aussi le fichier existant en cas d’interruption d’écriture. Les permissions du token se limitent à la lecture des sources publiques ; ne jamais le placer dans une variable `VITE_*` ni le committer.

Dans GitHub Actions, **Build fresh TheAlgorithms catalog** est déclenchable manuellement. Il ne possède que `contents: read` et publie un artifact. Télécharger le JSON, le remplacer dans `public/`, examiner puis committer. Il n’écrit pas dans le dépôt et ne crée pas de PR automatiquement.

Les types `code`, `doc`, `other` sont déduits de l’extension. Ils ne constituent pas une classification sémantique parfaite. Le filtre par défaut affiche le code, **Tous les fichiers** permet d’accéder aux autres entrées. La licence provient des métadonnées du dépôt ; vérifier aussi la licence et les en-têtes du fichier original. `NOASSERTION` signifie licence non déterminée, pas domaine public.

## Architecture et fichiers

```text
src/algorithms.ts    Ateliers, entrées, descriptions FR/EN, pseudocode
src/engine.ts        Analyseur d’expressions → AST → instructions → trace
src/export.ts        Générateurs Python / Go / C à partir de l’AST
src/App.tsx          Navigation, éditeur, visualisations, catalogue et aide
src/style.css       Thèmes, responsive, transitions et motion réduite
public/catalog.json Instantané complet du catalogue et provenance
scripts/catalog.mjs Indexeur de maintenance, jamais exécuté dans le navigateur
tests/              Tests du moteur, compilation des exports, parcours navigateur
```

Flux : édition → analyse AST → compilation des branchements → exécution bornée → instantanés → visualisation. L’AST alimente aussi les exports. L’application fonctionne sans serveur applicatif. Les routes `#help`, `#catalog`, `#bubble-sort`, etc. conviennent à l’hébergement statique, sans règle SPA de réécriture. Les polices DM Sans et Manrope sont embarquées via `@fontsource`.

## Tests et qualité

```sh
npm test                            # moteur et exports ; nécessite Python, Go, GCC
npx playwright install chromium     # une fois ; --with-deps sur Linux si nécessaire
npm run test:e2e                     # démarre Vite automatiquement sur 5173
npm run build                       # TypeScript strict + bundle production
npm run check                       # tests + build
npm audit --audit-level=high
```

Les tests vérifient chaque atelier, les résultats sur valeurs négatives/doublons/cas limites, les erreurs, les courts-circuits et l’immuabilité de la trace. Ils compilent/exécutent les **36 combinaisons atelier × langage** et comparent tableau ET variables avec l’interpréteur, avec un programme modifié supplémentaire couvrant comparaisons, grands produits et décimales. Playwright teste édition, pas-à-pas, export téléchargé, erreurs, catalogue, mobile, traduction et thème.

Les captures de test sont écrites dans `test-results/` (ignoré par Git). Les nombres décimaux demandent des comparaisons avec tolérance si vous ajoutez des tests qui en utilisent.

## CI et GitHub Pages

`.github/workflows/ci.yml` s’exécute sur push de `main`, pull request ou déclenchement manuel :

1. Installation reproductible par `npm ci` et audit des dépendances.
2. Tests unitaires et compilation native Python/Go/C.
3. Parcours Chromium avec Playwright.
4. Vérification TypeScript, build avec `BASE_PATH=/<nom-du-dépôt>/`, smoke test HTTP du catalogue sous ce préfixe.
5. Dans un job indépendant : build Docker, démarrage Compose, healthcheck et test HTTP.
6. Déploiement Pages uniquement pour `main`, après réussite des deux jobs.

Dans **Settings → Pages → Build and deployment**, choisir **GitHub Actions**. Le job de déploiement seul reçoit `pages: write` et `id-token: write`. Le reste du pipeline a `contents: read`. Dependabot suit npm, les actions et les images Docker.

Build manuel pour ce dépôt :

```sh
BASE_PATH=/algo_explorer/ npm run build
BASE_PATH=/algo_explorer/ npm run preview
```

Pour un domaine racine, utiliser `BASE_PATH=/`. Le Dockerfile et Compose ciblent `/`. Ne pas réutiliser un bundle construit pour `/algo_explorer/` à la racine d’un serveur sans adapter sa configuration.

### Procédure de livraison et retour arrière

Après chaque modification demandée : lancer les tests adaptés et le build, reconstruire et relancer Compose, vérifier `docker compose ps` et HTTP, puis committer et pousser les fichiers voulus. Vérifier le workflow Pages et l’URL publiée. Ne pas annoncer un déploiement réussi si la CI échoue.

Si le site devient vide, un asset répond 404, ou un parcours essentiel régresse : revenir à la version précédente par `git revert <commit>` puis pousser et attendre le redéploiement. Pour la version locale, reconstruire Compose sur le commit rétabli. Aucun schéma de base de données ni migration n’est impliqué.

### Dépannage

| Symptôme                           | Vérification / résolution                                          |
| ---------------------------------- | ------------------------------------------------------------------ |
| Port 8080 occupé                   | `PORT=8090 docker compose up --build -d --wait`                    |
| Échec des tests natifs             | Installer Python 3, Go, GCC ; les commandes doivent être dans PATH |
| Chromium absent                    | `npx playwright install --with-deps chromium`                      |
| Page blanche sur Pages             | Vérifier le préfixe Vite, la console et le workflow déployé        |
| Refresh de `#help` en erreur       | Conserver les routes hash, ne pas remplacer par `/help`            |
| Catalogue indisponible             | Vérifier la présence et l’accès HTTP à `catalog.json` dans `dist/` |
| API limitée pendant l’indexation   | Authentifier `gh` ou fournir GH_TOKEN ; réessayer plus tard        |
| Modifications absentes de l’export | Appliquer le code ET les données avant d’exporter                  |
| « Execution limit »                | Réduire l’entrée ou corriger la condition/progression de boucle    |
| Échec de stockage navigateur       | Exporter la session ; le site reste utilisable sans localStorage   |

## Contribuer et étendre la couverture

Ajouter un atelier dans `src/algorithms.ts` : identifiant stable, catégorie, noms/descriptions/explication FR/EN, complexités, données par défaut pertinentes et pseudocode. Ajouter des tests sur résultat, cas limites et exports. Toute extension du langage doit évoluer **simultanément** dans l’analyseur, l’exécuteur, les trois exporteurs et la documentation.

Pour couvrir à terme l’ensemble des algorithmes, il faudra : dédupliquer les variantes multilangages, définir une taxonomie indépendante du langage, ajouter structures de graphes/matrices/chaînes et récursion au modèle intermédiaire, développer les vues correspondantes, puis écrire et valider des adaptations par famille. Une source cataloguée ne doit jamais être marquée « interactive » avant cette validation.

## Sources complémentaires et licences

- [TheAlgorithms](https://github.com/TheAlgorithms) et son [site](https://the-algorithms.com/) : corpus d’origine du catalogue.
- [CP-Algorithms](https://cp-algorithms.com/) : explications et algorithmes classiques, utiles pour de futurs ateliers avancés.
- [VisuAlgo](https://visualgo.net/) : autres visualisations pédagogiques à consulter.
- [Guide Vite de déploiement statique](https://vite.dev/guide/static-deploy) : configuration de base de GitHub Pages.

Ces ressources complémentaires ne sont pas importées dans ce site. Une intégration future doit conserver provenance, attribution et conditions de licence spécifiques. Aucun code source TheAlgorithms n’est redistribué dans le catalogue : seulement des métadonnées et des liens. Le code propre à Algo Explorer est sous licence MIT ; les dépendances, polices et sources externes conservent leurs licences respectives.

## English guide

Algo Explorer is a **frontend-only React/TypeScript/Vite algorithm playground**. Start with `npm ci && npm run dev`, or `docker compose up --build -d --wait` and visit http://localhost:8080. The UI and built-in help are fully available in English and French; language and light/dark theme are automatically detected, with persistent overrides.

**Coverage is explicit:** the bundled snapshot indexes 10,038 files from all 44 discovered public TheAlgorithms repositories. It is a source catalog, not a universal algorithm translator. Twelve independently authored numeric-array/scalar playgrounds support execution, stepping backward/forward, editable pseudocode and input, AST display and Python/Go/C exports. Graphs, recursion, matrices and strings remain future work.

Click Run, step with arrows, or scrub the timeline. Purple cells are read, green cells are written. Apply edited input and pseudocode before exporting. JSON sessions preserve your applied code, data and target. The final line of a generated program prints `{ "a": [...], "variables": {...} }`. Runtime errors retain valid earlier frames; loops and numeric values are bounded.

Run `npm test` with Python, Go and GCC installed; use `npm run test:e2e` after `npx playwright install chromium`. The CI tests all playgrounds and native exports, browser flows, Docker, and the production base path before deploying Pages on main. Enable GitHub Actions as the Pages publishing source. Refresh the catalog with `npm run catalog` using an authenticated GitHub CLI or GH_TOKEN. Tokens are maintenance-only and never included in frontend assets.

Refer to the [English field guide](https://FabriceBoyer.github.io/algo_explorer/#help) for interactive usage, language syntax, limits and learning resources. Project code is MIT licensed; upstream repositories and dependencies retain their own licenses.
