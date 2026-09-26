# Stage 3 — Deployment

Status: deployed and live on Cloudflare Workers.

The deployment contains only the console HTML, CSS, vendored Excel reader/license and social preview when available. Student marks stay in browser memory. Source backups, workbook fixtures, documentation, tests and development files are not exposed by the website.

`npm.cmd run build` creates a Cloudflare Workers-compatible static response handler in `dist/server/index.js`. `npm.cmd run dev` serves the same build locally. Existing application code and local file usage are preserved.

## Live Deployment

- URL: https://codeforge-grading-console.vk64375.workers.dev
- Provider: Cloudflare Workers
- Worker name: `codeforge-grading-console`
- Compatibility date: `2026-09-26`
- Version ID: `c4bfcabd-4d57-40cd-b975-20cd9aca1238`

## Live Verification

Verified over HTTPS after deployment:

- `/` returns `200`.
- `/console.css` returns `200`.
- `/package.json` returns `404`, confirming development files are not exposed.
- The local `node scripts/verify-build.cjs` check passes before deployment.
