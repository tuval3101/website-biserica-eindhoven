import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pages } from "../src/data/pages.js";
import { siteConfig } from "../src/data/siteConfig.js";

const root = process.cwd();

const template = (page) => `<!doctype html>
<html lang="ro">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${page.seoTitle}</title>
    <meta name="description" content="${page.seoDescription}">
    <meta name="theme-color" content="#071018">
    <meta property="og:title" content="${page.seoTitle}">
    <meta property="og:description" content="${page.seoDescription}">
    <meta property="og:type" content="website">
    <meta property="og:image" content="${page.heroImage}">
    <link rel="canonical" href="${page.route}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body data-page-slug="${page.slug}">
    <a class="skip-link" href="#main">Sari la conținut</a>
    <div data-site-header></div>
    <main id="main" data-page-main>
      <section class="article-section">
        <div class="container article-card">
          <h1>${page.title}</h1>
          <p>Se încarcă...</p>
        </div>
      </section>
    </main>
    <div data-site-footer></div>
    <script type="module" src="/src/app.js"></script>
  </body>
</html>
`;

for (const page of pages) {
  const dir = join(root, page.slug);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "index.html"), template(page), "utf8");
}

console.log(`Generated ${pages.length} markdown-driven pages for ${siteConfig.siteName}.`);
