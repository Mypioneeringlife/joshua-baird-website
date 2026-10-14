# Joshua Baird personal website: editing boundaries

These rules apply to future assistants, agents, and Codex sessions working on this repository.

## Homepage protection — critical
- \`index.html\` is the established, approved homepage. Treat its text, photos, visual composition, existing sections, styles, and behaviors as **locked**.
- **Only edit \`index.html\` to add, remove, or correct hyperlinks to new subpages** that Joshua requests. Do not redesign or rewrite any portion of the homepage as part of another page's work.
- Keep homepage diffs minimal. If adding a navigation link, insert only the anchor; preserve every existing element and its order.
- Never alter homepage-specific CSS in \`assets/css/site.css\` without a new, explicit request from Joshua authorizing a homepage design change.
- Do not modify the automatic live-content updater when editing writing pages.

## Creative Writing
- \`creative-writing.html\` is Joshua's original creative-writing landing page. Match the homepage's expressive, paper-and-ink/collage visual language, using existing genuine artwork.
- \`assets/css/creative-writing.css\` is scoped to this section so visual changes do not leak into the homepage.
- \`data/creative-writing.json\` drives the story shelf; \`assets/js/creative-writing.js\` renders it.
- Add only real stories that Joshua has approved for public display. Never fabricate titles, author credits, publication status, synopses, or links.
- Add an entry to the JSON \`works\` array with: \`title\`, \`url\`, and optional \`type\`, \`date\`, \`description\`, \`cover\`, \`coverAlt\`. The URL may be a site-relative page or an HTTPS link. Do not link to private drafts.
- For an on-site story, create and verify the destination page or file before adding its URL to the public list.
- The empty shelf is intentional until a real approved story is ready.

## Release practice
- Work on a feature branch, not directly on \`main\`.
- Review the file diff, check links at the GitHub Pages project path, and test mobile navigation.
- Ask Joshua to approve publication before merging into \`main\`. Do not publish unapproved changes.
