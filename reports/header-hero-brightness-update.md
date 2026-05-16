# Header and Hero Brightness Update

## Summary
The header is now fixed at the top of the viewport and remains visible while scrolling. Hero overlays were lightened on desktop and mobile so image details are more visible while keeping text readable.

## Files Modified
| File | Change |
| --- | --- |
| `styles.css` | Fixed header/top contact bar, added body top spacing, lightened hero overlays, improved mobile hero brightness, and added text shadow for hero copy. |
| `reports/header-hero-brightness-update.md` | Added this report. |

## Sticky Header Implementation
| Element | Implementation |
| --- | --- |
| `.top-strip` | `position: fixed`, `top: 0`, `z-index: 10000`, full width. |
| `.site-header` | `position: fixed`, below the top strip on desktop, `z-index: 9999`, full width. |
| `body` | Uses `padding-top: var(--fixed-header-offset)` so page content and hero sections do not hide behind the fixed header. |
| Mobile | Top strip is hidden, header moves to `top: 0`, and body spacing is reduced to the mobile header height. |

## Overlay Opacity Changes
| Area | Previous Behavior | New Behavior |
| --- | --- | --- |
| Homepage desktop hero | Heavy navy overlay around `0.92 / 0.72 / 0.58` plus dark vertical layer. | Softer overlay around `0.48 / 0.28 / 0.14` with a lighter vertical layer. |
| Content page hero | Heavy page shade around `0.94 / 0.62 / 0.78`. | Softer shade around `0.50 / 0.24 / 0.18`. |
| Mobile homepage hero | Dark vertical overlay around `0.62 / 0.45 / 0.35`. | Brighter vertical overlay around `0.20 / 0.16 / 0.24`. |
| Mobile page hero | Dark vertical overlay around `0.62 / 0.45 / 0.35`. | Brighter vertical overlay around `0.22 / 0.16 / 0.26`. |

## Mobile Adjustments
| Item | Result |
| --- | --- |
| Header | Fixed at the top, menu remains aligned under the header. |
| Mobile menu | Existing hamburger behavior preserved. |
| Hero images | Added `brightness(1.15) contrast(1.05) saturate(1.05)` for mobile slider images. |
| Hero text | Subtitle and page hero text now use subtle text shadow for readability on brighter images. |
| Click behavior | Existing overlay `pointer-events: none` rules remain in place so CTA buttons are not blocked. |

## Validation Results
| Check | Result |
| --- | --- |
| `npm run build` | Pass |
| Static page generation | Pass, 11 Markdown-driven pages generated |
| Site validation | Pass, 12 HTML files, 11 Markdown pages, and 26 assets validated |
| Link routing validation | Pass |
| Hero image mapping validation | Pass |

## Screenshots
Screenshots were not added to this report because the local browser session blocked the localhost preview in this environment during the previous visual verification attempt. Automated build and validation completed successfully.
