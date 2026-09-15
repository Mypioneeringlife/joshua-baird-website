# CODEX TASK — Rebuild the complete Joshua Baird newspaper image archive for the website

You are working on a preservation-first journalism archive for Joshua Baird.

## Source folder
`C:\Users\Jadda\Documents\journalism`

The folder contains the original digitized college-newspaper PDFs and an existing extracted archive. Treat the original PDFs as READ-ONLY. Never overwrite, rename, move, recompress, or modify them.

## Goal
The previous article-extraction pass was useful, but it emphasized individual article records and crops. For the website, I now need the COMPLETE visual newspaper archive so that important front pages, page placement, section layouts, political interviews, special sections, photography, neighboring stories, and award-winning layouts are not lost.

Render EVERY PAGE of EVERY source newspaper PDF as a standalone image and build a manifest that lets the website match full pages back to the original PDFs and to any already-verified Joshua Baird articles.

This is an archival rendering task. Do not rewrite journalism. Do not summarize article text. Do not use generative image tools.

## Output root
Create:

`C:\Users\Jadda\Documents\journalism\Joshua_Baird_Archive\09_FULL_NEWSPAPER_PAGES`

With this structure:

```text
09_FULL_NEWSPAPER_PAGES
├── 00_MANIFEST
├── 01_MASTER_PNG
├── 02_WEB_WEBP
├── 03_CONTACT_SHEETS
├── 04_JOSHUA_PAGE_INDEX
├── 05_REVIEW_REQUIRED
└── 06_REPORTS
```

## 1. Render every PDF page
For every source newspaper PDF:

- Render every PDF page, not only pages containing a Joshua Baird article.
- Use the PDF itself as the source. Do not screenshot a PDF viewer UI.
- Preserve page orientation exactly.
- Do not crop away newspaper margins unless the PDF itself has obvious scanner-only empty borders. If borders are removed, log it.
- Do not perspective-warp, rewrite, repair, repaint, generatively enhance, or alter the newspaper content.
- Light deskew is allowed only when the source scan is clearly rotated.
- Modest global contrast/brightness correction is allowed only when needed to make the scanned page readable. Never selectively alter article areas.

Create two image versions per page:

### Archival master
`01_MASTER_PNG`
- PNG
- Target render resolution: approximately 220–250 DPI, or the closest high-quality deterministic render the PDF library supports.
- Preserve readable small newspaper type.
- Do not downscale below the effective resolution of the PDF source.

### Website copy
`02_WEB_WEBP`
- WebP
- Preserve the full page.
- Long edge target: approximately 2400 px unless that would upscale a lower-resolution source.
- Quality target: 88–92.
- Keep text as readable as practical while making files reasonable for a web archive.

## 2. Naming convention
Use stable names derived from source PDF and page number.

Preferred format:

`<SOURCE_STEM>__pdfpage_###.png`
`<SOURCE_STEM>__pdfpage_###.webp`

Example:

`The_Clackamas_Print_2010-02-10__pdfpage_003.png`

Sanitize only filesystem-invalid characters. Do not silently invent dates if the PDF filename or page does not establish one.

## 3. Build a full-page manifest
Create:

`00_MANIFEST\full_page_manifest.csv`
`00_MANIFEST\full_page_manifest.json`

One row/object per rendered PDF page with:

- `page_image_id`
- `source_pdf_filename`
- `source_pdf_sha256`
- `pdf_page_index_zero_based`
- `pdf_page_number_one_based`
- `printed_page_number` if confidently visible/known, otherwise blank
- `issue_date` if confidently established from source metadata/page, otherwise blank
- `section` if confidently established, otherwise blank
- `master_png_path`
- `web_webp_path`
- `pixel_width_master`
- `pixel_height_master`
- `render_dpi_or_scale`
- `deskew_applied`
- `global_tonal_adjustment_applied`
- `contains_verified_joshua_baird_article`
- `verified_article_ids`
- `contains_explicit_joshua_baird_byline`
- `contains_explicit_joshua_baird_photo_credit`
- `review_required`
- `notes`

## 4. Cross-reference the existing verified archive
Read, but do not modify, the existing archive under:

`Joshua_Baird_Archive\00_MANIFEST`
`Joshua_Baird_Archive\01_VERIFIED_ARTICLES`
`Joshua_Baird_Archive\03_ARTICLE_CROPS`
`Joshua_Baird_Archive\05_REVIEW_REQUIRED`

Use existing source references and metadata to identify which full newspaper pages contain already-verified Joshua Baird work.

Do NOT infer authorship merely because Joshua was an editor or because a story appears in Arts & Culture.

If an explicit byline or photo credit is visible on a full page but does not appear in the current verified manifest, add that page to `05_REVIEW_REQUIRED`; do not automatically claim the work.

## 5. Build a Joshua page index
Create:

`04_JOSHUA_PAGE_INDEX\joshua_baird_full_pages.csv`
`04_JOSHUA_PAGE_INDEX\joshua_baird_full_pages.json`

This should contain only full newspaper pages that:

- contain a verified Joshua Baird article, OR
- contain an explicit Joshua Baird photo credit, OR
- require human review for a possible Joshua Baird contribution.

Include the same source/page identifiers plus the linked verified article IDs and review status.

## 6. Contact sheets
Create contact sheets in `03_CONTACT_SHEETS` so the archive can be reviewed quickly.

Requirements:
- 12–16 newspaper pages per sheet.
- Each thumbnail must remain large enough to recognize page layout.
- Label each thumbnail with source filename stem + PDF page number.
- Do not use OCR text as the label unless the source filename lacks useful identification.

Also create a second set of contact sheets containing ONLY pages in the Joshua page index.

## 7. Political/public-affairs and front-page work must not be hidden
The existing extraction contains stronger material than the first website prototype surfaced, including public-affairs reporting and interviews.

Do NOT prioritize only Arts & Culture material.

The website archive needs to make it easy to locate:
- front-page stories,
- politician/public-official interviews,
- community reaction / public-affairs reporting,
- major regional or national-news localizations,
- special sections,
- section fronts,
- pages connected to awards,
- photojournalism,
- Arts & Culture work,
- food/culture features,
- opinion pieces.

Do not editorially rank politicians or political positions. This is archival categorization only.

If page content clearly fits one of those factual archival categories, record that in `notes` or an optional `content_tags` field.

## 8. Preserve duplicates correctly
If multiple source PDFs are byte-identical duplicates:
- render one canonical set of page images,
- record every duplicate source filename in the manifest,
- do not waste space rendering the same bytes repeatedly.

If PDFs have similar names but different hashes, process them separately.

## 9. Failure handling
Do not stop the whole run because one PDF is malformed.

For failures:
- continue processing other PDFs,
- write the failed file/page to `06_REPORTS\render_failures.csv`,
- record the exact exception/error,
- retry once with a second deterministic PDF rendering library if available,
- never substitute OCR-generated or AI-generated fake page images.

## 10. Verification pass
After rendering:

1. Confirm every unique source PDF has a manifest entry for every page.
2. Compare PDF page counts to rendered-page counts.
3. Confirm every manifest path exists.
4. Confirm every PNG and WebP opens successfully.
5. Confirm dimensions are plausible and nonzero.
6. Confirm the Joshua page index links to existing page images.
7. Confirm current verified article IDs have a corresponding full-page match whenever source references make that possible.
8. Confirm originals remain unchanged by comparing file hashes captured before and after the run.

Create:

`06_REPORTS\full_page_render_verification.md`

Report:
- total source PDFs found,
- unique PDF hashes,
- duplicate PDFs,
- total PDF pages expected,
- master PNGs created,
- web WebPs created,
- pages linked to verified Joshua work,
- pages requiring review,
- failures,
- source-original hash verification result.

## 11. Website handoff
Create:

`00_MANIFEST\website_archive_manifest.json`

Keep it lightweight enough for a static website to load. For each Joshua-indexed page include:

- page image ID
- issue date
- section
- source PDF
- web WebP relative path
- master PNG relative path
- verified article IDs
- content tags
- review status

Do not embed OCR article text in this lightweight website manifest.

## Non-negotiable preservation rules
- Originals are read-only.
- No generative image enhancement.
- No rewriting journalism.
- No grammar correction.
- No headline rewriting.
- No invented metadata.
- No inferred authorship from editorship.
- No selective deletion because an article seems uninteresting.
- Every original PDF page must be represented unless it is an exact-byte duplicate of a canonical source.

When finished, print a concise completion summary and the exact paths to:
1. `full_page_manifest.csv`
2. `joshua_baird_full_pages.csv`
3. `website_archive_manifest.json`
4. `full_page_render_verification.md`
