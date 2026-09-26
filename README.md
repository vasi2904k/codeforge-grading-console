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

## Project Structure

| Path | Purpose |
| --- | --- |
| [`BITS_Digital_CodeForge_Challenge.html`](BITS_Digital_CodeForge_Challenge.html) | Current application markup and client-side grading logic. |
| [`console.css`](console.css) | Responsive visual design and accessibility states. |
| [`vendor/xlsx.full.min.js`](vendor/xlsx.full.min.js) | Vendored SheetJS Excel reader/writer used at runtime. |
| [`scripts/build.cjs`](scripts/build.cjs) | Creates the allowlisted deployment worker in `dist/server/index.js`. |
| [`scripts/serve.cjs`](scripts/serve.cjs) | Serves the generated worker locally on port `4173`. |
| [`scripts/verify-build.cjs`](scripts/verify-build.cjs) | Checks public assets, private routes, methods and source consistency. |
| [`tests/console.test.cjs`](tests/console.test.cjs) | jsdom unit and application behavior tests. |
| [`tests/browser.cjs`](tests/browser.cjs) | Headless Edge end-to-end and responsive checks. |
| [`tests/fixtures/`](tests/fixtures/) | Synthetic workbook and exported CSV test artifacts. |
| [`public/`](public/) | Optional public assets such as the social preview image. |
| `dist/` | Generated deployment output; do not edit by hand. |

## Build And Deployment

`npm.cmd run build` publishes only the application HTML, CSS, vendored Excel reader and license, plus `public/og.png` when present. The generated handler accepts `GET` and `HEAD` requests and returns `404` for tests, fixtures, documentation and other development files.

The generated server is compatible with the project's Cloudflare Workers-style hosting configuration in `.openai/hosting.json`. The deployment is intentionally static and has no upload endpoint. Student marks remain in browser memory.

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
