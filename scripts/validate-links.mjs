import { access, readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { siteConfig } from "../src/data/siteConfig.js";

const root = process.cwd();
const failures = [];

const requiredRoutes = [
  ["/", "ACASĂ"],
  ["/despre-noi/", "DESPRE NOI"],
  ["/program-liturgic/", "PROGRAM LITURGIC"],
  ["/botez/", "BOTEZ"],
  ["/spovedanie/", "SPOVEDANIE"],
  ["/donatii/", "DONAȚII"],
  ["/fundatia-noastra/", "FUNDAȚIA NOASTRĂ"],
  ["/viata-sfintei-parascheva/", "VIAȚA SFINTEI PARASCHEVA"],
  ["/acatistul-sfintei-parascheva/", "ACATISTUL SFINTEI PARASCHEVA"],
  ["/parohii-olanda/", "PAROHII OLANDA"],
  ["/parohii-belgia/", "PAROHII BELGIA"],
  ["/contact/", "CONTACT"]
];

const externalLinks = {
  whatsapp: siteConfig.whatsapp,
  whatsappGroup: siteConfig.whatsappGroup,
  maps: siteConfig.maps,
  email: `mailto:${siteConfig.email}`,
  facebook: siteConfig.facebook
};

const normalizeText = (value) =>
  value
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleUpperCase("ro-RO");

const relPath = (file) => relative(root, file).replace(/\\/g, "/");

const collectHtml = async (dir = root) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if ([".git", "node_modules", "reports"].includes(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectHtml(full)));
    } else if (entry.name.endsWith(".html")) {
      files.push(full);
    }
  }

  return files;
};

const extractAnchors = (html) =>
  [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map((match) => {
    const attrs = match[1];
    const href = attrs.match(/\bhref="([^"]*)"/i)?.[1] ?? "";
    const target = attrs.match(/\btarget="([^"]*)"/i)?.[1] ?? "";
    const rel = attrs.match(/\brel="([^"]*)"/i)?.[1] ?? "";

    return {
      href,
      target,
      rel,
      html: match[0],
      text: normalizeText(match[2])
    };
  });

const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

const hasAnchor = (anchors, label, href) =>
  anchors.some((anchor) => anchor.text === label && anchor.href === href);

const hasAnchorContaining = (anchors, text, href) =>
  anchors.some((anchor) => anchor.text.includes(text) && anchor.href === href);

const validateExternalAnchor = (file, anchor) => {
  if (!/^(https?:|mailto:)/.test(anchor.href)) return;
  if (anchor.href.startsWith("mailto:")) return;

  assert(
    anchor.target === "_blank" && anchor.rel.includes("noopener") && anchor.rel.includes("noreferrer"),
    `${file}: external link "${anchor.text || anchor.href}" must use target="_blank" and rel="noopener noreferrer"`
  );
};

const validateHtmlFile = async (file) => {
  const html = await readFile(file, "utf8");
  const label = relPath(file);
  const anchors = extractAnchors(html);

  assert(!html.includes('href="#"'), `${label}: contains href="#"`);
  assert(!html.includes('href=""'), `${label}: contains empty href`);
  assert(!/javascript:void\(0\)/i.test(html), `${label}: contains javascript:void(0)`);
  assert(!/\bonclick=/i.test(html), `${label}: contains inline onclick`);
  assert(!/\bdata-href=/i.test(html), `${label}: contains data-href instead of a real link`);

  for (const anchor of anchors) {
    validateExternalAnchor(label, anchor);
  }

  if (label === "index.html") {
    for (const [href, navLabel] of requiredRoutes) {
      assert(hasAnchor(anchors, navLabel, href), `${label}: missing canonical mobile/nav link ${navLabel} -> ${href}`);
    }

    assert(/<article class="service-card">[\s\S]*?<h3>BOTEZ<\/h3>[\s\S]*?href="\/botez\/"/.test(html), `${label}: Botez card must link to /botez/`);
    assert(/<article class="service-card">[\s\S]*?<h3>SPOVEDANIE<\/h3>[\s\S]*?href="\/spovedanie\/"/.test(html), `${label}: Spovedanie card must link to /spovedanie/`);
    assert(/<article class="service-card">[\s\S]*?<h3>DONAȚII<\/h3>[\s\S]*?href="\/donatii\/"/.test(html), `${label}: Donații card must link to /donatii/`);
    assert(hasAnchor(anchors, "DESPRE NOI", "/despre-noi/"), `${label}: hero DESPRE NOI must link to /despre-noi/`);
    assert(hasAnchor(anchors, "PROGRAM LITURGIC", "/program-liturgic/"), `${label}: hero PROGRAM LITURGIC must link to /program-liturgic/`);
    assert(hasAnchor(anchors, "VEZI DETALII", "/program-liturgic/"), `${label}: VEZI DETALII must link to /program-liturgic/`);
    assert(hasAnchorContaining(anchors, "CONTACTEAZĂ PĂRINTELE", externalLinks.whatsapp), `${label}: Contactează părintele must link to direct WhatsApp`);
    assert(hasAnchorContaining(anchors, "TRIMITE EMAIL", externalLinks.email), `${label}: Trimite email must link to mailto`);
    assert(hasAnchorContaining(anchors, "VEZI PE HARTĂ", externalLinks.maps), `${label}: Vezi pe hartă must link to Google Maps`);
    assert(hasAnchorContaining(anchors, "INTRĂ ÎN GRUPUL WHATSAPP", externalLinks.whatsappGroup), `${label}: WhatsApp group CTA must link to group invite`);
    assert(hasAnchorContaining(anchors, "FACEBOOK", externalLinks.facebook), `${label}: Facebook link must use configured URL`);
  }
};

const validateRoutesExist = async () => {
  for (const [route] of requiredRoutes) {
    const target = route === "/" ? "index.html" : `${route.replace(/^\//, "")}index.html`;
    try {
      await access(join(root, target));
    } catch {
      failures.push(`Missing required route file: ${target}`);
    }
  }
};

const validateRuntimeSource = async () => {
  const app = await readFile(join(root, "src", "app.js"), "utf8");
  const script = await readFile(join(root, "script.js"), "utf8");
  const styles = await readFile(join(root, "styles.css"), "utf8");

  for (const [href, label] of requiredRoutes) {
    assert(app.includes(`createLink("${href}", "${label}")`), `src/app.js: missing mobile generated link ${label} -> ${href}`);
  }

  assert(app.includes('class="primary-nav mobile-nav" id="primary-navigation"'), "src/app.js: generated mobile menu must use dedicated mobile-nav anchors");
  assert(app.includes('href="${siteConfig.whatsapp}"'), "src/app.js: page CTA direct WhatsApp link is missing");
  assert(app.includes('href="${siteConfig.maps}"'), "src/app.js: page CTA Google Maps link is missing");
  assert(app.includes('href="${siteConfig.whatsappGroup}"'), "src/app.js: WhatsApp group link is missing");
  assert(script.includes('document.querySelector("#primary-navigation")'), "script.js: homepage menu must target the mobile navigation by id");
  assert(app.includes('document.querySelector("#primary-navigation")'), "src/app.js: generated pages menu must target the mobile navigation by id");
  assert(styles.includes(".hero__overlay") && styles.includes("pointer-events: none"), "styles.css: decorative overlays should not intercept CTA clicks");
  assert(styles.includes(".info-menu__panel") && styles.includes("visibility: hidden"), "styles.css: hidden dropdowns should not remain click-active");
};

await validateRoutesExist();

const htmlFiles = await collectHtml();
for (const file of htmlFiles) {
  await validateHtmlFile(file);
}

await validateRuntimeSource();

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Validated link routing in ${htmlFiles.length} HTML files and runtime navigation sources.`);
