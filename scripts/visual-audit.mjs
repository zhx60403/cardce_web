import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { readFileSync, writeFileSync } from "node:fs";

const bundledModules = "C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const bundledRequire = createRequire(`${bundledModules}/.pnpm/playwright@1.60.0/node_modules/playwright/package.json`);
const { chromium } = bundledRequire("playwright");
const { PNG } = bundledRequire("pngjs");
const pixelmatch = (await import(pathToFileURL(`${bundledModules}/pixelmatch/index.js`).href)).default;

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const baseline = resolve(root, "baseline-393x852.png");
const implementation = resolve(root, "implementation.png");
const diff = resolve(root, "diff.png");
const auditHtml = `file://${resolve(root, "audit.html").replaceAll("\\", "/")}`;
const chromePath = "C:/Users/Administrator/.cache/puppeteer/chrome/win64-131.0.6778.69/chrome-win64/chrome.exe";

async function screenshot() {
  const browser = await chromium.launch({ headless: true, executablePath: chromePath });
  const page = await browser.newPage({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 1 });
  await page.addInitScript(() => {
    const style = document.createElement("style");
    style.textContent = "*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}";
    document.documentElement.appendChild(style);
  });
  await page.goto(auditHtml);
  await page.evaluate(async () => {
    if ("fonts" in document) await document.fonts.ready;
  });
  await page.screenshot({ path: implementation, fullPage: false });
  await browser.close();
  return implementation;
}

function compare() {
  const base = PNG.sync.read(readFileSync(baseline));
  const impl = PNG.sync.read(readFileSync(implementation));
  if (base.width !== impl.width || base.height !== impl.height) {
    throw new Error(`Size mismatch: baseline ${base.width}x${base.height}, implementation ${impl.width}x${impl.height}`);
  }
  const out = new PNG({ width: base.width, height: base.height });
  const mismatched = pixelmatch(base.data, impl.data, out.data, base.width, base.height, {
    threshold: 0.12,
    includeAA: true,
  });
  writeFileSync(diff, PNG.sync.write(out));
  const ratio = mismatched / (base.width * base.height);
  console.log(JSON.stringify({ baseline, implementation, diff, mismatched, ratio }, null, 2));
  return ratio;
}

const mode = process.argv[2] ?? "audit";
if (mode === "screenshot") {
  await screenshot();
} else if (mode === "compare") {
  compare();
} else {
  await screenshot();
  compare();
}
