# Repository workflow

- User-facing communication defaults to French.
- Keep the application frontend-only (React, TypeScript, Vite), compatible with GitHub Pages hash routes and a configurable Vite base path.
- Be explicit about coverage: the full source-file catalog is not a set of universally executable algorithms. Only tested adapters may be labeled interactive.
- Preserve French/English localization, automatic light/dark theme and reduced-motion support.
- Update README and in-app help for behavioral changes.
- After every user-requested change, run appropriate checks, commit and push the work, then rebuild/restart the local Docker Compose stack and verify health. This is explicitly authorized by the user. The local .env uses PORT=8090 because 8080 is occupied; do not stop unrelated services.
- Run `npm run format:check`, `npm run check` and relevant Playwright tests before delivery. Native export tests require Python 3, Go and GCC.
- Never put credentials in frontend assets or VITE_* variables. Catalog refresh is a separate maintenance action with read-only upstream access.
