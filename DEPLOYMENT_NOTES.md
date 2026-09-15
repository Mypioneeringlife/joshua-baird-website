# Deployment Notes

## Website v1.9 GitHub Pages deployment

- Production baseline: Website v1.9.
- GitHub Pages path compatibility audit: no root-relative local HTML, CSS, JavaScript, or module references were found.
- Local-reference QA: intentional inline SVG `data:` URLs and JavaScript template placeholders were excluded; no missing local website files were found.
- The visible Projects index was checked to keep **Small Hands, Big Lessons** absent. Its unlinked source page remains preserved.

## Blog/domain checklist

The following existing references to `https://mypioneeringlife.com` were preserved intentionally for this initial deployment:

- `index.html` — Blog card link.
- `scripts/update-live-content.mjs` — blog Open Graph fetch target.
- `data/live-content.js` — generated blog metadata URL.
- `data/live-content.json` — live blog metadata URL.
- `data/project-content.js` — project site URL metadata.
- `data/project-content.json` — project site URL metadata.

Custom-domain migration and DNS changes for `mypioneeringlife.com` have **not** been performed. Before a future custom-domain migration, confirm the Blog card and live-content updater cannot create a self-loop back to the GitHub Pages homepage.
