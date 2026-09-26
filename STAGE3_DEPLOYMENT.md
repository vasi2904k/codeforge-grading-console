# Stage 3 — Deployment

Status: preparing public publication with Sites.

The deployment contains only the console HTML, CSS, vendored Excel reader/license and social preview when available. Student marks stay in browser memory. Source backups, workbook fixtures, documentation, tests and development files are not exposed by the website.

`npm.cmd run build` creates a Cloudflare Workers-compatible static response handler in `dist/server/index.js`. `npm.cmd run dev` serves the same build locally. Existing application code and local file usage are preserved.

Final URL and live verification will be recorded after deployment succeeds.
