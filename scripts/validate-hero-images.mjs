import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { heroImages } from "../src/data/heroImages.js";
import { pages } from "../src/data/pages.js";

const root = process.cwd();
const failures = [];
const fallback = "/assets/images/hero/Parohie 1.png";

const expected = {
  home: [
    "/assets/images/hero/Parohie 1.png",
    "/assets/images/hero/Parohie 2.png",
    "/assets/images/hero/Parohie 3.png",
    "/assets/images/hero/Parohie 4.png",
    "/assets/images/hero/Parohie 5.png",
    "/assets/images/hero/Parohie 6.png",
    "/assets/images/hero/Parohie 7.png"
  ],
  "despre-noi": ["/assets/images/hero/Despre Noi 1.png"],
  botez: [
    "/assets/images/hero/Botez 1.png",
    "/assets/images/hero/Botez 2.png",
    "/assets/images/hero/Botez 3.png"
  ],
  spovedanie: [
    "/assets/images/hero/Spovedanie 1.png",
    "/assets/images/hero/Spovedanie 2.png",
    "/assets/images/hero/Spovedanie 3.png"
  ],
  donatii: [
    "/assets/images/hero/Donatii 0.png",
    "/assets/images/hero/Donatii 1.png",
    "/assets/images/hero/Donatii 2.png"
  ],
  contact: [
    "/assets/images/hero/Contact 1.png",
    "/assets/images/hero/Contact 2.png"
  ],
  "program-liturgic": ["/assets/images/hero/Parohie 5.png"],
  "fundatia-noastra": ["/assets/images/hero/Parohie 4.png"],
  "viata-sfintei-parascheva": ["/assets/images/hero/Contact 1.png"],
  "acatistul-sfintei-parascheva": ["/assets/images/hero/Contact 2.png"],
  "parohii-olanda": ["/assets/images/hero/Parohie 1.png"],
  "parohii-belgia": ["/assets/images/hero/Parohie 2.png"]
};

const sameList = (a, b) => a.length === b.length && a.every((item, index) => item === b[index]);

const localPath = (asset) => join(root, asset.replace(/^\//, ""));

const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

for (const [slug, images] of Object.entries(expected)) {
  assert(Array.isArray(heroImages[slug]), `heroImages.${slug} is missing`);
  assert(sameList(heroImages[slug] || [], images), `heroImages.${slug} does not match the required mapping`);

  for (const image of images) {
    try {
      await access(localPath(image));
    } catch {
      console.warn(`[hero-images] Missing ${image}; fallback would be ${fallback}`);
      failures.push(`Missing mapped hero image for ${slug}: ${image}`);
    }
  }
}

const pageBySlug = Object.fromEntries(pages.map((page) => [page.slug, page]));
for (const [slug, images] of Object.entries(expected)) {
  if (slug === "home") continue;
  const page = pageBySlug[slug];
  assert(page, `Missing page registry entry for ${slug}`);
  if (!page) continue;
  assert(page.heroImage === images[0], `${slug}: heroImage should be ${images[0]}`);
  assert(sameList(page.heroImages || [], images), `${slug}: heroImages should match registry mapping`);

  const generatedPage = await readFile(localPath(`${page.route}index.html`), "utf8");
  assert(generatedPage.includes(`data-page-slug="${slug}"`), `${page.route}: generated page does not contain the expected page slug`);
  assert(generatedPage.includes(`<meta property="og:image" content="${images[0]}">`), `${page.route}: generated page does not reference the primary hero image in og:image`);
}

const homepage = await readFile(join(root, "index.html"), "utf8");
const heroSection = homepage.match(/<section class="hero"[\s\S]*?<\/section>/)?.[0] || "";

for (const image of expected.home) {
  const relativeImage = image.replace(/^\//, "");
  assert(heroSection.includes(relativeImage), `Homepage hero is missing ${relativeImage}`);
}

const forbiddenHomepageHeroSets = [
  ...expected.botez,
  ...expected.spovedanie,
  ...expected.donatii,
  ...expected.contact,
  ...expected["despre-noi"]
].map((image) => image.replace(/^\//, ""));

for (const image of forbiddenHomepageHeroSets) {
  assert(!heroSection.includes(image), `Homepage hero should not include section-specific image ${image}`);
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Validated hero image registry, generated page primary images, and homepage hero image set.");
