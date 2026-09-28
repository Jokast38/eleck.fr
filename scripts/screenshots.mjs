// Captures responsive (360, 768, 1024, 1440 px) des pages du site, avec détection du débordement horizontal.
// Usage : node scripts/screenshots.mjs [baseUrl] [outDir] [chemin1,chemin2,...]
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const base = process.argv[2] ?? "http://localhost:3000";
const out = process.argv[3] ?? "screenshots";
const paths = (process.argv[4] ?? "/").split(",");
const widths = [360, 768, 1024, 1440];
const executablePath =
  process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";

mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({ executablePath, headless: true });
const page = await browser.newPage();
for (const path of paths) {
  for (const width of widths) {
    await page.setViewport({ width, height: width < 768 ? 800 : 900, isMobile: width < 768, hasTouch: width < 768 });
    await page.goto(base + path, { waitUntil: "load" });
    await new Promise((r) => setTimeout(r, 400));
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const name = `${path === "/" ? "home" : path.replaceAll("/", "_").slice(1)}-${width}.png`;
    await page.screenshot({ path: `${out}/${name}`, fullPage: process.env.FULL === "1" });
    console.log(`${name}${overflow > 0 ? `  ⚠ débordement horizontal ${overflow}px` : ""}`);
  }
}
await browser.close();
