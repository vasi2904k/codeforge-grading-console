# Stage 1 — Verification Report

## Verification passes

1. **Baseline:** initial 27 checks ran against the original application; 1 passed, 26 failed. Evidence: `tests/baseline-results.txt`.
2. **Targeted fixes:** import, statistics, range, export and chart tests ran during implementation; all initial 27 checks then passed.
3. **Actual browser:** headless Edge verified XLSX upload, all 16 grade endpoints, statistics, real CSV download and parsed grades, timer after export, reset, instructor edits, course changes, corrupt workbook and recovery, without page errors.
4. **Expanded checks:** all 36 DOM/Excel tests pass, including racing readers, reader failure, missing library, wrong extension, reordered columns, text IDs, whitespace, HTML-looking names, every mark from 0 through 100, and cancelled chart frames.
5. **Final combined run:** `npm.cmd test` runs both suites. Results: `tests/final-results.txt`. Dependency audit: `tests/audit-results.txt`.

Tests execute the actual application JavaScript and use the real SheetJS parser/writer. The DOM suite uses jsdom; canvas calls, download URLs and dialogs are intercepted, and visible text is adapted because jsdom has no layout engine. Controlled FileReader doubles are used for race/error cases. Edge checks real browser drawing, uploads and downloaded bytes.

The connected Browser plugin returned no available browsers. Standalone headless Edge was used as a fallback with a temporary profile, without a personal browser session.

## Run locally

Open `BITS_Digital_CodeForge_Challenge.html` directly. Keep `vendor/` beside it. No server or installation is required to use the app.

For automated tests with Node.js installed:

```powershell
npm.cmd ci
npm.cmd test
```

The browser test defaults to `C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`. Set `EDGE_PATH` to another installed Edge/Chromium executable if needed. `npm.cmd run test:unit` runs only the DOM suite.

## Artifacts

- `STAGE1_BUG_LOG.md`: required six-column log.
- `BITS_Digital_CodeForge_Challenge.original.html`: untouched backup.
- `tests/fixtures/boundaries.xlsx`: 16 Course A boundary marks plus a Course B student.
- `tests/fixtures/exported-grades.csv`: actual download, selected course only.
- `tests/fixtures/stage1-desktop.png`: desktop capture after chart animation.
- `tests/console.test.cjs` and `tests/browser.cjs`: repeatable regression checks.

## Provenance

Imported and applied the `obra/superpowers` systematic-debugging, test-driven-development and verification-before-completion skills, installed in the user's Codex skills directory.

SheetJS CE 0.20.3 is pinned and vendored with its license, following the [official standalone installation documentation](https://docs.sheetjs.com/docs/getting-started/installation/standalone/). The browser file comes from the same package used by tests. Runtime CDN access is no longer needed.

## Limits

Desktop Edge was tested; Firefox, Safari, mobile usability and assistive technology were not. Extremely large workbooks and adversarial compressed files were not load-tested. Spreadsheet programs can infer CSV column types: import the BITS ID column as text to preserve leading zeros. The bell curve is a normalized visual reference, not a goodness-of-fit result. Stage 2 enhancements and Stage 3 deployment have not begun.
