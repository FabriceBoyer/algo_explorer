import { test, expect } from "@playwright/test";
test.use({ locale: "fr-FR" });
test("playback, data, editor, AST, export and help", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Tri à bulles", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Étape suivante", exact: true })
    .click();
  await expect(page.locator(".current-line")).toContainText("i <- 0");
  await page
    .getByRole("button", { name: "Dernière étape", exact: true })
    .click();
  await expect(page.getByRole("img")).toHaveAttribute(
    "aria-label",
    "Visualisation: 8, 15, 23, 31, 38, 44, 52, 61",
  );
  await page.getByLabel("Données d’entrée", { exact: true }).fill("3, -1, 2");
  await page.getByRole("button", { name: "Appliquer", exact: true }).click();
  await page.getByRole("button", { name: "Modifier", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Pseudocode", exact: true })
    .fill("a[0] <- 99");
  await page
    .locator(".editor-actions")
    .getByRole("button", { name: "Appliquer" })
    .click();
  await page
    .getByRole("button", { name: "Étape suivante", exact: true })
    .click();
  await expect(page.getByRole("img")).toHaveAttribute(
    "aria-label",
    "Visualisation: 99, -1, 2",
  );
  await page.getByRole("button", { name: "Arbre AST", exact: true }).click();
  await expect(page.locator(".ast-tree")).toContainText("a[0] <- 99");
  await page.getByRole("button", { name: "Exporter", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Go", exact: true }).click();
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Télécharger" }).click(),
  ]);
  expect(download.suggestedFilename()).toBe("bubble-sort.go");
  await page.keyboard.press("Escape");
  await page.goto("/#help");
  await expect(
    page.getByRole("heading", { name: "Apprendre en faisant." }),
  ).toBeVisible();
});
test("catalog searches and pinned source links", async ({ page }) => {
  await page.goto("/#catalog");
  await page.getByLabel("Nom, chemin, catégorie…").fill("bubble");
  await expect(page.locator(".catalog-results article").first()).toBeVisible();
  await expect(
    page.locator(".catalog-results article").first().getByRole("link"),
  ).toHaveAttribute(
    "href",
    /github.com\/TheAlgorithms\/.+\/blob\/[a-f0-9]{40}\//,
  );
});
test("locale, theme, mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  await page.getByRole("button", { name: "Switch to English" }).click();
  await expect(
    page.getByRole("heading", { name: "Bubble sort", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Theme: auto" }).click();
  await page.getByRole("button", { name: "Theme: light" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Show playgrounds" }).click();
  await page
    .getByRole("button", { name: "Binary search", exact: false })
    .click();
  await expect(
    page.getByRole("heading", { name: "Binary search", exact: true }),
  ).toBeVisible();
  await page.screenshot({ path: "test-results/mobile.png", fullPage: true });
});
test("errors and execution limits", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Données d’entrée", { exact: true }).fill("NaN");
  await page.getByRole("button", { name: "Appliquer", exact: true }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await page.getByLabel("Données d’entrée", { exact: true }).fill("5,2");
  await page.getByRole("button", { name: "Appliquer", exact: true }).click();
  await expect(page.getByRole("alert")).toHaveCount(0);
  await page.getByRole("button", { name: "Modifier", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Pseudocode", exact: true })
    .fill("while 1\nend");
  await page
    .locator(".editor-actions")
    .getByRole("button", { name: "Appliquer" })
    .click();
  await expect(page.getByRole("alert")).toContainText(/limite/i);
});
test("desktop playback", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.getByRole("button", { name: "Exécuter", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Pause", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await page.screenshot({ path: "test-results/desktop.png", fullPage: true });
});

test("session import keeps custom code across hash navigation", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("input[type=file]").setInputFiles({
    name: "session.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      JSON.stringify({
        version: 1,
        algorithm: "reverse",
        code: "a[0] <- 42",
        data: [3, 2, 1],
        target: 7,
      }),
    ),
  });
  await expect(
    page.getByRole("heading", { name: "Inversion de tableau", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".code-lines")).toContainText("a[0] <- 42");
  await page
    .getByRole("button", { name: "Étape suivante", exact: true })
    .click();
  await expect(
    page.getByRole("img", { name: /Visualisation:/ }),
  ).toHaveAttribute("aria-label", "Visualisation: 42, 2, 1");
  await page
    .getByRole("button", { name: "Tri par sélection", exact: false })
    .click();
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "Inversion de tableau", exact: true }),
  ).toBeVisible();
});

test("new graph and DP workshops use editable inputs and visible buffers", async ({
  page,
}) => {
  await page.goto("/#dijkstra");
  await expect(
    page.getByRole("img", { name: "Graphe de 5 sommets" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Dernière étape", exact: true })
    .click();
  await expect(
    page
      .locator(".buffer")
      .filter({ has: page.locator("code").getByText("dist", { exact: true }) }),
  ).toContainText("7");
  await page.locator(".matrix-editor summary").click();
  await page
    .getByRole("spinbutton", { name: "Poids A → B", exact: true })
    .fill("1");
  await page.getByRole("button", { name: "Appliquer", exact: true }).click();
  await expect(page.getByRole("alert")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Dernière étape", exact: true })
    .click();
  await page.screenshot({
    path: "test-results/graph-aurora.png",
    fullPage: true,
  });
  await page.goto("/#coin-change");
  await page
    .getByRole("button", { name: "Dernière étape", exact: true })
    .click();
  await expect(
    page.locator(".variable-grid>div").filter({
      has: page.locator("code").getByText("result", { exact: true }),
    }),
  ).toContainText("2");
  await expect(page.locator(".buffer-panel")).toContainText("dp");
});
test("auxiliary arrays can be edited and graph layout fits mobile", async ({
  page,
}) => {
  await page.goto("/#merge-sort");
  await page.getByRole("button", { name: "Modifier", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Pseudocode", exact: true })
    .fill("array temp[n]\ntemp[0] <- 99\na[0] <- temp[0]");
  await page
    .locator(".editor-actions")
    .getByRole("button", { name: "Appliquer" })
    .click();
  await page
    .getByRole("button", { name: "Dernière étape", exact: true })
    .click();
  await expect(page.locator(".buffer-panel")).toContainText("99");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#bfs");
  await expect(
    page.getByRole("img", { name: "Graphe de 5 sommets" }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  await page.getByRole("button", { name: "Thème: auto" }).click();
  await page.getByRole("button", { name: "Thème: light" }).click();
  await page.screenshot({
    path: "test-results/graph-mobile-dark.png",
    fullPage: true,
  });
});
