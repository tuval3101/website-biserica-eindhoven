import { access, readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { pages } from "../src/data/pages.js";

const root = process.cwd();
const failures = [];

const localPath = (value) => join(root, value.replace(/^\//, ""));

const collectHtml = async (dir = root) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectHtml(full)));
    } else if (entry.name.endsWith(".html")) {
      files.push(full);
    }
  }
  return files;
};

const requiredAssets = [
  "/assets/images/spirituality/Parascheva main.png",
  "/assets/images/spirituality/Botez.png",
  "/assets/images/spirituality/Spovedanie.png",
  "/assets/images/spirituality/Donatii.png",
  "/assets/images/spirituality/Program.png",
  "/assets/images/spirituality/Grupwhatsapp.png",
  "/assets/images/contact-location/St. Willibrord Church.png",
  "/assets/images/hero/Parohie 1.png",
  "/assets/images/hero/Parohie 2.png",
  "/assets/images/hero/Parohie 3.png",
  "/assets/images/hero/Parohie 4.png",
  "/assets/images/hero/Parohie 5.png",
  "/assets/images/hero/Parohie 6.png",
  "/assets/images/hero/Parohie 7.png"
];

for (const asset of requiredAssets) {
  try {
    await access(localPath(asset));
  } catch {
    failures.push(`Missing required asset: ${asset}`);
  }
}

for (const page of pages) {
  try {
    await access(localPath(`${page.route}index.html`));
  } catch {
    failures.push(`Missing generated route: ${page.route}`);
  }
  try {
    await access(localPath(page.markdownFile));
  } catch {
    failures.push(`Missing markdown file for ${page.slug}: ${page.markdownFile}`);
  }
  for (const asset of [page.heroImage, page.icon, ...(page.heroImages || [])]) {
    try {
      await access(localPath(asset));
    } catch {
      failures.push(`Missing page asset for ${page.slug}: ${asset}`);
    }
  }
}

const htmlFiles = await collectHtml();
for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const refs = [...html.matchAll(/(?:src|href|content)="((?:\/)?assets\/[^"]+)"/g)].map((match) => match[1]);
  const localLinks = [...html.matchAll(/href="(\/[^"#]+\/)"/g)].map((match) => match[1]);
  const blankExternalLinks = [...html.matchAll(/<a\b[^>]*href="https?:\/\/[^"]+"[^>]*target="_blank"[^>]*>/g)].map((match) => match[0]);

  if (html.includes('class="brand__cross"') && html.includes("site-header")) {
    failures.push(`${file}: old CSS cross is still used in header markup`);
  }

  for (const ref of refs) {
    try {
      await access(localPath(ref));
    } catch {
      failures.push(`${file}: missing referenced asset ${ref}`);
    }
  }

  for (const link of localLinks) {
    if (link === "/") continue;
    try {
      await access(localPath(`${link}index.html`));
    } catch {
      failures.push(`${file}: missing linked route ${link}`);
    }
  }

  for (const link of blankExternalLinks) {
    if (!link.includes('rel="noopener noreferrer"')) {
      failures.push(`${file}: external blank link missing rel noopener noreferrer`);
    }
  }
}

for (const jsFile of ["script.js", "src/app.js", "src/markdown.js", "src/data/pages.js", "src/data/siteConfig.js"]) {
  const jsCheck = spawnSync("node", ["--check", jsFile], { cwd: root, encoding: "utf8" });
  if (jsCheck.status !== 0) {
    failures.push(jsCheck.stderr || jsCheck.stdout || `${jsFile} syntax check failed`);
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} HTML files, ${pages.length} markdown pages, and ${requiredAssets.length} required assets.`);
