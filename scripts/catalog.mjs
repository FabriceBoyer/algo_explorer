import { execFileSync } from "node:child_process";
import { writeFile, mkdir, rename } from "node:fs/promises";
// This runs only at maintenance/build time. No token is ever shipped to the browser.
async function api(path) {
  if (process.env.GH_TOKEN || process.env.GITHUB_TOKEN) {
    const r = await fetch(`https://api.github.com/${path}`, {
      headers: {
        Authorization: `Bearer ${process.env.GH_TOKEN || process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    });
    if (!r.ok) throw new Error(`${path}: HTTP ${r.status}`);
    return r.json();
  }
  return JSON.parse(
    execFileSync("gh", ["api", path], {
      maxBuffer: 64 * 1024 * 1024,
    }).toString(),
  );
}
let repos = [];
for (let page = 1; ; page++) {
  const batch = await api(`orgs/TheAlgorithms/repos?per_page=100&page=${page}`);
  repos.push(...batch);
  if (batch.length < 100) break;
}
const entries = [],
  repositories = [];
for (const repo of repos) {
  if (!repo.size) {
    repositories.push({
      name: repo.name,
      status: "empty",
      license: repo.license?.spdx_id,
    });
    continue;
  }
  const commit = await api(
    `repos/TheAlgorithms/${repo.name}/commits/${repo.default_branch}`,
  );
  const tree = await api(
    `repos/TheAlgorithms/${repo.name}/git/trees/${commit.commit.tree.sha}?recursive=1`,
  );
  let files = tree.tree;
  if (tree.truncated) {
    files = [];
    async function walk(sha, prefix = "") {
      const part = await api(
        `repos/TheAlgorithms/${repo.name}/git/trees/${sha}`,
      );
      for (const item of part.tree) {
        const path = prefix + item.path;
        if (item.type === "tree") await walk(item.sha, path + "/");
        else files.push({ ...item, path });
      }
    }
    await walk(tree.sha);
  }
  const blobs = files.filter((f) => f.type === "blob");
  repositories.push({
    name: repo.name,
    sha: commit.sha,
    treeSha: tree.sha,
    branch: repo.default_branch,
    license: repo.license?.spdx_id || "NOASSERTION",
    archived: repo.archived,
    files: blobs.length,
    status: "indexed",
  });
  for (const f of blobs) {
    const filename = f.path.split("/").at(-1);
    const ext = filename.split(".").at(-1).toLowerCase();
    const kind =
      /^(py|c|h|cpp|hpp|cc|cs|go|js|ts|tsx|rs|java|kt|scala|rb|swift|php|jl|lua|ex|exs|hs|ml|mli|fs|fsx|clj|cljs|dart|elm|r|m|f90|f95|f|nim|zig|s|asm|sol|mojo|jule|ipynb)$/.test(
        ext,
      )
        ? "code"
        : /^(md|rst|txt)$/.test(ext)
          ? "doc"
          : "other";
    entries.push({
      repo: repo.name,
      path: f.path,
      name: filename
        .replace(/\.[^.]+$/, "")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/[_-]/g, " "),
      kind,
    });
  }
  console.log(`${repo.name}: ${blobs.length} files`);
}
await mkdir("public", { recursive: true });
await writeFile(
  "public/catalog.json.tmp",
  JSON.stringify({
    generatedAt: new Date().toISOString(),
    repositories,
    entries,
  }),
);
await rename("public/catalog.json.tmp", "public/catalog.json");
console.log(
  `Saved ${entries.length} files from ${repositories.length} repositories. Atomic publication: previous snapshot preserved if a request fails.`,
);
