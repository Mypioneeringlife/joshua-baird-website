# Joshua Baird Website v1.3

This is the working static website build.

## Pages
- `index.html` — main personal hub
- `art.html` — art page
- `bartending.html` — bartending career, drink archive, and current zero-proof perspective
- `recipe.html?drink=...` — individual drink-story pages with flavor notes and preserved build information
- `journalism.html` — newspaper-style archive
- `article.html?id=...` — individual journalism archive pages
- `projects.html` — workshop / active-projects page

## Live content
`data/live-content.json` drives the latest My Pioneering Life and The Corrupted Chronicle videos, plus the Blog/Substack card images/titles.

`scripts/update-live-content.mjs` checks the public YouTube RSS feeds and public Open Graph metadata and writes refreshed content back to `data/live-content.json`.

## Important content rules
- Real photographs of Joshua are used for Joshua. No AI stand-in portraits belong in the live site.
- The Corrupted Chronicle uses the supplied logo and is styled for Air Americana. A licensed webfont copy still needs to be supplied before deployment if visitors must see the exact font.
- Barman's Covenant is linked only from the bartending page.
- Original cocktail measurements are never guessed. Incomplete house specs are labeled as incomplete.
- Journalism uses original source scans as evidence. Exact archival text should come from the verified archive rather than being rewritten.
- Machu Picchu uses the real supplied photograph with CSS-only crop/tone treatment.

## v1.3 bartending rebuild
- Preserves the original `003` portrait as the hero image.
- Adds the two newly supplied real working-bar photographs once each, with no repeated photo tiles.
- Reframes the page as a career arc: hospitality → craft → World Class → drink archive → present-day mocktails.
- Keeps the full public `Milestones, Not Mythology` chronology.
- Adds all approved drink-tile copy.
- Every drink image now links to a long-form drink story.
- Drink stories cover origin, flavor, ingredient logic, verified brands where known, and the preserved recipe/build state.
- Adds the full `What I Drink Now / Same Standards. Different Pour.` statement explaining the move from cocktails to mocktails.
- The timeline avoids reusing photographs already featured elsewhere on the page.

## Deploy
The site can run on any ordinary static host. GitHub Pages + GitHub Actions remains the simplest option if the automatic live-content updater is retained.


## v1.4 — Archive corrections and bartending rebuild
- Gordon House milestone corrected to October 27, 2017.
- In a Pickle restored from the July 23, 2016 Barman’s Covenant post with exact original measurements and method.
- Whippersnapper drink restored under its original name, Old Flame, with Angostura and cinnamon tincture confirmed from the August 4, 2016 archive post.
- Breakdown restored as a 2017 Hemingway Daiquiri variant using Bacardi, Cappelletti, roasted red pepper, and simple syrup; unknown measurements remain explicitly unguessed.
- Added archive-evidence panels to drink stories.
- Added Breakdown to the featured-drink gallery.
- Preserved the original pink-cocktail hero; action photographs are used once each.

## v1.5 archive changes
- Corrected the cocktail tile previously labeled “Peach, Basil & Bourbon”: that photograph is **Breakdown**. The duplicate Breakdown tile was removed.
- Journalism side cards no longer stretch into large empty white blocks.
- Every clickable journalism clipping opens a newspaper-style article page populated from the preserved archive transcription when available.
- Added title/author search to the journalism archive.
- Added `archive-text/` with one plain-text backup per verified story plus `journalism-archive-full-text.txt` containing all 20 verified website archive records.
- The original newspaper scan remains the source of truth whenever historical text extraction is incomplete or includes neighboring page material.

## v1.8 project dossiers
- Dedicated project dossier infrastructure was added without changing the homepage destination cards.
- Project pages were built for My Pioneering Life, The Corrupted Chronicle, Tested In The Wild, Dry Glass Society, and Small Hands, Big Lessons.
- Each dossier explains the project's purpose, working territory, and current direction, and links to its public channel/site.
- My Pioneering Life, The Corrupted Chronicle, and Small Hands, Big Lessons are seeded with their current public video catalog excerpts. Tested In The Wild and Dry Glass Society currently have no public uploads on their canonical channels, so their pages deliberately show an empty-state rather than borrowing content from another channel.
- Video cards contain the thumbnail, title, publication date, YouTube-description text, expandable full description, and a direct watch link.
- `data/project-content.json` / `data/project-content.js` hold the project records.
- The GitHub Actions live-content updater now refreshes up to six recent videos and their public YouTube RSS descriptions for every project channel each run.
- Canonical Tested In The Wild channel: `https://www.youtube.com/@testedinthewild` (`UCtbcUDGvHHvqZzo2yuTNOzQ`).
- Software/private build projects are intentionally excluded from the public project index.

## v1.9 publication adjustment
- Removed Small Hands, Big Lessons from the public Projects index at the owner's request.
- The Projects page now presents four public projects: My Pioneering Life, The Corrupted Chronicle, Tested In The Wild, and Dry Glass Society.
- The homepage remains unchanged.
