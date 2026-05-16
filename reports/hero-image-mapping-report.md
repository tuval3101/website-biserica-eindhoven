# Hero Image Mapping Report

## Summary
Hero images are now assigned from the centralized registry in `src/data/heroImages.js`. The Markdown page registry consumes that mapping so every generated route uses the image set named for its section.

## Pages Updated
| Page | Route | Hero Images | Mode | Dot Count |
| --- | --- | --- | --- | --- |
| Homepage | `/` | `Parohie 1.png`, `Parohie 2.png`, `Parohie 3.png`, `Parohie 4.png`, `Parohie 5.png`, `Parohie 6.png`, `Parohie 7.png` | Slider | 7 |
| Despre Noi | `/despre-noi/` | `Despre Noi 1.png` | Static | 0 |
| Program Liturgic | `/program-liturgic/` | `Parohie 5.png` | Static | 0 |
| Botez | `/botez/` | `Botez 1.png`, `Botez 2.png`, `Botez 3.png` | Slider | 3 |
| Spovedanie | `/spovedanie/` | `Spovedanie 1.png`, `Spovedanie 2.png`, `Spovedanie 3.png` | Slider | 3 |
| Donații | `/donatii/` | `Donatii 0.png`, `Donatii 1.png`, `Donatii 2.png` | Slider | 3 |
| Fundația Noastră | `/fundatia-noastra/` | `Parohie 4.png` | Static | 0 |
| Viața Sfintei Parascheva | `/viata-sfintei-parascheva/` | `Contact 1.png` | Static | 0 |
| Acatistul Sfintei Parascheva | `/acatistul-sfintei-parascheva/` | `Contact 2.png` | Static | 0 |
| Parohii Olanda | `/parohii-olanda/` | `Parohie 1.png` | Static | 0 |
| Parohii Belgia | `/parohii-belgia/` | `Parohie 2.png` | Static | 0 |
| Contact | `/contact/` | `Contact 1.png`, `Contact 2.png` | Slider | 2 |

## Registry
The source of truth is:

`src/data/heroImages.js`

The page registry in `src/data/pages.js` now uses `getPrimaryHeroImage(slug)` and `getHeroImages(slug)` for every Markdown-driven page.

## Validation Result
| Check | Result |
| --- | --- |
| Every mapped hero image exists | Pass |
| Homepage references all `Parohie 1–7` hero images | Pass |
| Homepage does not include Botez/Spovedanie/Donații/Contact-specific hero sets | Pass |
| Every generated page has the expected page slug | Pass |
| Every generated page references the expected primary hero image in Open Graph metadata | Pass |
| Page registry hero image arrays match the required mapping | Pass |

## Build Result
| Command | Result |
| --- | --- |
| `npm run build` | Pass. Generated 11 markdown-driven pages, validated 12 HTML files, 11 markdown pages, 26 required assets, link routing, and hero image mapping. |

## Notes
The existing hero slider automatically displays dots only when a page has multiple images. Single-image pages render as static hero sections without dots.
