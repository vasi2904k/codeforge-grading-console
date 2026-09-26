# CodeForge Grading Console

CodeForge is an unofficial browser-based grading-console prototype for instructors reviewing marks and configuring course grades. It was created for the BITS Digital CodeForge challenge and is **not an official BITS Pilani Digital tool or a system for actual academic grading**.

The application runs as a static web app. A workbook is read in the browser, course analytics and grade assignments are calculated locally, and the selected course can be exported as a CSV file. There is no application backend and no student data is uploaded to a server.

## What It Does

The console guides an instructor through four steps:

1. **Upload marks** from an `.xlsx` workbook.
2. **Review marks** using minimum, maximum, average, median, histogram and grade-distribution views.
3. **Set ranges** for the inclusive grades `A`, `A-`, `B`, `B-`, `C`, `C-`, `D` and `E`.
4. **Export grades** after the instructor, course, student records and ranges have been validated.

Additional features include:

- Searchable student preview with grade filtering and pagination.
- Independent in-memory range drafts for each course.
- Undo history and reset-to-default range controls.
- Validation feedback for incomplete, overlapping, reversed or otherwise invalid ranges.
- CSV quoting and formula-prefix protection for safer exports.
- Responsive layout, keyboard-visible focus, labelled controls and reduced-motion support.

## Workbook Format

The first worksheet must contain exactly these three columns, in any order:

| Column | Requirements |
| --- | --- |
| `BITS ID` or `Student's BITS ID` | Required text identifier. Keep leading-zero IDs as text in Excel. |
| `Course` | Required course name. Whitespace is trimmed. |
| `Total Marks` | Required whole number from `0` through `100`. Fractions, blanks, booleans and nonnumeric values are rejected. |

Completely empty rows are ignored. Duplicate student IDs within the same course are rejected. The same ID may appear in different courses. Students receiving `NC` should be omitted from the workbook.

A new workbook replaces the current session's data and course settings. Grade settings, search state and undo history are memory-only and are cleared when the page is closed or a new workbook is loaded.

## Run Locally

### Fastest option: open the HTML file

No installation or server is required for normal use. Open [`BITS_Digital_CodeForge_Challenge.html`](BITS_Digital_CodeForge_Challenge.html) in a browser and keep [`console.css`](console.css) and [`vendor/`](vendor/) beside it.

### Local development server

Install Node.js, then run these commands from the project directory:

```powershell
npm.cmd install
npm.cmd run build
npm.cmd run dev
```

Open <http://127.0.0.1:4173> after the server starts. The development server serves the same generated assets used by the deployment bundle.

If port `4173` is already in use, use the existing server at that address or stop the process before restarting the command.

## Test And Verify

The project uses Node's built-in test runner, jsdom, the vendored SheetJS parser/writer and headless Microsoft Edge for browser checks.

```powershell
# DOM and application logic tests
npm.cmd run test:unit

# Headless browser workflow and responsive checks
npm.cmd run test:browser

# Both test suites
npm.cmd test
```

The browser test defaults to:

```text
C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe
```

Set `EDGE_PATH` when Edge or Chromium is installed elsewhere:

```powershell
$env:EDGE_PATH = 'C:\path\to\msedge.exe'
npm.cmd run test:browser
```

The current verified suite contains 45 passing unit/integration tests plus the headless browser workflow. The browser checks cover workbook upload, CSV contents, grade ranges, course-specific drafts, undo, filters, keyboard access, reduced motion and viewport widths from 320px to 1440px.

To verify the generated deployment bundle independently:

```powershell
npm.cmd run build
node scripts/verify-build.cjs
```

## Repository Contents

The following is the complete source and evidence set committed to GitHub. The repository is intentionally small: the current app is a static HTML/CSS page, while the remaining files document, test and package it.

### Application files

| Path | Purpose |
| --- | --- |
| [`BITS_Digital_CodeForge_Challenge.html`](BITS_Digital_CodeForge_Challenge.html) | Current Stage 2 application markup and client-side grading logic. This is the file to edit and run. |
| [`console.css`](console.css) | Responsive visual design, layout, validation states and accessibility styling. |
| [`vendor/xlsx.full.min.js`](vendor/xlsx.full.min.js) | Vendored SheetJS Excel reader/writer used by the browser application. |
| [`vendor/LICENSE`](vendor/LICENSE) | License for the vendored SheetJS distribution. |
| [`public/og.png`](public/og.png) | Social preview image included in the deployment when present. |

### Historical application snapshots

| Path | Purpose |
| --- | --- |
| [`BITS_Digital_CodeForge_Challenge.stage1.html`](BITS_Digital_CodeForge_Challenge.stage1.html) | Stage 1 checkpoint retained for comparison and regression context. It is not used by the build. |
| [`BITS_Digital_CodeForge_Challenge.original.html`](BITS_Digital_CodeForge_Challenge.original.html) | Untouched original challenge snapshot. It is historical reference only and is not deployed. |

### Development and deployment scripts

| Path | Purpose |
| --- | --- |
| [`package.json`](package.json) | Project metadata, npm scripts and dependency declarations. |
| [`package-lock.json`](package-lock.json) | Locked dependency tree for reproducible npm installation. |
| [`scripts/build.cjs`](scripts/build.cjs) | Creates the allowlisted Cloudflare Workers-compatible bundle in `dist/`. |
| [`scripts/serve.cjs`](scripts/serve.cjs) | Serves the generated bundle locally on `127.0.0.1:4173`. |
| [`scripts/verify-build.cjs`](scripts/verify-build.cjs) | Confirms deployed assets match source and private routes are not exposed. |
| [`.openai/hosting.json`](.openai/hosting.json) | Hosting project metadata used by the build and deployment workflow. |
| [`.gitignore`](.gitignore) | Excludes dependencies, generated output, local documents and generated test artifacts. |

### Design records

| Path | Purpose |
| --- | --- |
| [`.impeccable/design.json`](.impeccable/design.json) | Design-tool project metadata. |
| [`.impeccable/surfaces/bits-digital-codeforge-challenge-html.md`](.impeccable/surfaces/bits-digital-codeforge-challenge-html.md) | Design surface record for the application page. |
| [`PRODUCT.md`](PRODUCT.md) | Product users, purpose, constraints and principles. |
| [`DESIGN.md`](DESIGN.md) | Implemented visual system, responsive behavior and accessibility decisions. |

### Test code and evidence

| Path | Purpose |
| --- | --- |
| [`tests/console.test.cjs`](tests/console.test.cjs) | jsdom unit and application behavior tests. |
| [`tests/browser.cjs`](tests/browser.cjs) | Headless Edge end-to-end, download and responsive checks. |
| [`tests/audit-results.txt`](tests/audit-results.txt) | Dependency/security audit evidence. |
| [`tests/baseline-results.txt`](tests/baseline-results.txt) | Original baseline verification results. |
| [`tests/final-results.txt`](tests/final-results.txt) | Stage 1 final regression results. |
| [`tests/stage2-baseline.txt`](tests/stage2-baseline.txt) | Stage 2 baseline feature results before fixes. |
| [`tests/stage2-browser-results.txt`](tests/stage2-browser-results.txt) | Stage 2 browser verification evidence. |
| [`tests/stage2-final-results.txt`](tests/stage2-final-results.txt) | Stage 2 final regression results. |
| [`tests/stage2-unit-results.txt`](tests/stage2-unit-results.txt) | Stage 2 unit-test evidence. |

The browser test creates temporary workbook, CSV and screenshot outputs under `tests/fixtures/` and `.impeccable/review/`. Those generated files are ignored and are not part of the GitHub repository.

### Historical project reports

| Path | Purpose |
| --- | --- |
| [`STAGE1_BUG_LOG.md`](STAGE1_BUG_LOG.md) | Stage 1 defects, root causes, fixes and verification. |
| [`STAGE1_TEST_REPORT.md`](STAGE1_TEST_REPORT.md) | Stage 1 test scope, commands, artifacts and limitations. |
| [`STAGE2_ENHANCEMENT_LOG.md`](STAGE2_ENHANCEMENT_LOG.md) | Stage 2 feature changes and verification summary. |
| [`STAGE2_TEST_REPORT.md`](STAGE2_TEST_REPORT.md) | Stage 2 test scope, design review and limitations. |
| [`STAGE3_DEPLOYMENT.md`](STAGE3_DEPLOYMENT.md) | Deployment packaging status and publishing notes. |

### Not committed

The following local items are deliberately excluded by [`.gitignore`](.gitignore): `node_modules/` dependencies, generated `dist/` and `deployments/` directories, `.impeccable/review/` screenshots, generated files in `tests/fixtures/`, npm debug logs, operating-system metadata and the local DOCX source file. They can be recreated or are not needed to build, test or review the application.

## Build And Deployment

`npm.cmd run build` publishes only the application HTML, CSS, vendored Excel reader and license, plus `public/og.png` when present. The generated handler accepts `GET` and `HEAD` requests and returns `404` for tests, fixtures, documentation and other development files.

The generated server is compatible with the project's Cloudflare Workers-style hosting configuration in `.openai/hosting.json`. The deployment is intentionally static and has no upload endpoint. Student marks remain in browser memory.

### Live Application

Reviewers should open the deployed application here:

**https://codeforge-grading-console.vk64375.workers.dev**

The source repository and documentation are available here:

**https://github.com/vasi2904k/codeforge-grading-console**

The application is hosted on Cloudflare Workers, not Netlify. The current Worker name is `codeforge-grading-console` and the account's `workers.dev` subdomain is `vk64375`. Cloudflare therefore produces the URL in this form:

```text
https://codeforge-grading-console.vk64375.workers.dev
```

Cloudflare's `workers.dev` URLs include the account subdomain. A custom domain requires a domain owned and configured by the account; `vasi-codeforge-grading-console.workers.dev` cannot be created as a standalone custom `workers.dev` address.

To reproduce the deployment after authenticating Wrangler with `npx wrangler login`:

```powershell
npm.cmd run build
npx wrangler deploy dist/server/index.js --name codeforge-grading-console --compatibility-date=2026-09-26
```

The live deployment was verified with HTTP `200` responses for `/` and `/console.css`, and an HTTP `404` response for `/package.json`.

## HTML Files

The repository contains three HTML versions of the console. Only the current file is used by the build and local server:

| File | Purpose | Edit or run? |
| --- | --- | --- |
| [`BITS_Digital_CodeForge_Challenge.html`](BITS_Digital_CodeForge_Challenge.html) | Current Stage 2 application with the completed grading workflow, responsive UI, validation, preview, undo and CSV export. | **Run and edit this file.** |
| [`BITS_Digital_CodeForge_Challenge.stage1.html`](BITS_Digital_CodeForge_Challenge.stage1.html) | Stage 1 checkpoint preserved before the Stage 2 enhancements. It is useful for historical comparison and regression context. | Do not use for normal development. |
| [`BITS_Digital_CodeForge_Challenge.original.html`](BITS_Digital_CodeForge_Challenge.original.html) | Untouched starting snapshot from the original challenge. It preserves the baseline implementation and its original CDN-based SheetJS reference. | Historical reference only. |

The build script publishes only the current [`BITS_Digital_CodeForge_Challenge.html`](BITS_Digital_CodeForge_Challenge.html) file at the site root. The Stage 1 and original snapshots are kept locally and are intentionally excluded from the deployment bundle.

## Design And Project Records

- [`PRODUCT.md`](PRODUCT.md) describes the users, purpose, constraints and product principles.
- [`DESIGN.md`](DESIGN.md) records the implemented visual system and responsive behavior.
- [`STAGE1_BUG_LOG.md`](STAGE1_BUG_LOG.md) records the original defects and their fixes.
- [`STAGE1_TEST_REPORT.md`](STAGE1_TEST_REPORT.md) records Stage 1 verification and known limits.
- [`STAGE2_ENHANCEMENT_LOG.md`](STAGE2_ENHANCEMENT_LOG.md) records the Stage 2 feature work.
- [`STAGE2_TEST_REPORT.md`](STAGE2_TEST_REPORT.md) records Stage 2 verification and test scope.
- [`STAGE3_DEPLOYMENT.md`](STAGE3_DEPLOYMENT.md) records the deployment packaging plan.

## Known Limits

This is a prototype, not a production academic records system. The tested browser workflow uses desktop Edge and mobile viewport emulation; Firefox, Safari, physical mobile devices and full assistive-technology certification are not covered. Extremely large or adversarial workbooks have not been load-tested. CSV applications may infer ID columns as numbers, so leading-zero identifiers should be stored and handled as text.
