# Font setup note

The Corrupted Chronicle is explicitly styled with `font-family: "Air Americana"` throughout the site.
The font file itself is not bundled in this package. For a production deployment, add a properly licensed webfont version through `@font-face` and keep **Air Americana** as the first family name. The current CSS falls back to a condensed display face only when Air Americana is not available on the viewer's device.
