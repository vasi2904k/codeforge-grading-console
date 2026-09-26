# Stage 2 — Verification Report

## Scope

Stage 2 extends the Stage 1 console with a guided workflow, grade percentages, a student preview, per-course session settings with undo, and inline export review. It remains a local static web application. Stage 3 deployment is not included.

## Tests

The first seven feature checks failed against Stage 1, then passed after implementation (`tests/stage2-baseline.txt`). The regression suite now includes the original 36 checks and Stage 2 tests for:

- Course settings remaining independent, including invalid drafts and blank course selection.
- Undo of boundary edits, automatic adjacent maximum updates and reset operations.
- New workbook clearing saved ranges, history and search.
- ID search combined with grade filtering, empty results and pagination.
- Filters never reducing the exported cohort.
- Percentages and export-range descriptions following edits.
- Invalid bounds being identified and individual grades shown as Pending.
- Instructor name optional for review but mandatory for export.

`tests/browser.cjs` uses actual headless Edge and the vendored parser. It covers real workbook uploads, all grade boundaries, actual downloaded CSV contents and filename, per-course drafts and undo, table filters, keyboard access, reduced motion and horizontal-overflow checks at 1440, 1024, 768, 390 and 320 pixels. It captures the loaded desktop and mobile states.

Final combined results: **45 tests passed, 0 failed**, plus the real Edge workflow. Evidence: `tests/stage2-final-results.txt`.

## Design review

Desktop and mobile captures: `.impeccable/review/desktop.png` and `mobile.png`. The mechanical detector ran once; initial findings remain in `detector.json`. Small text and disabled contrast were improved. The workflow-padding warning was not actionable: the links already supply vertical padding. A separate finish reviewer requested responsive high-resolution histogram text, larger mobile labels, and removal of width animation. All three were corrected and scored resolved on recapture; disposition **ship** for the scored fixes.

## Run and review

Open `BITS_Digital_CodeForge_Challenge.html` in a browser. Keep `console.css` and `vendor/` beside it. Upload `tests/fixtures/boundaries.xlsx` for synthetic test data.

```powershell
npm.cmd ci
npm.cmd test
```

The browser test defaults to the locally installed Windows Edge path; set `EDGE_PATH` for another installed Chromium/Edge executable. `npm.cmd run test:unit` runs the DOM suite alone.

## Intentional changes from Stage 1

- Course changes restore that course's draft instead of resetting its bands.
- An instructor can review marks before entering a name; download remains blocked until the name is entered.
- The histogram shows actual bin counts; the normalized illustrative bell curve was removed to avoid suggesting a statistical fit.
- Export uses a course/date filename and the current full cohort. The inline review always shows the actual instructor, course, count and valid ranges.
- Undo retains up to 50 preceding changes per course. These settings are memory-only and cleared on reload, close or replacement upload.

## Limits

Desktop Edge with mobile viewport emulation was used, not physical phone or Safari/Firefox testing. Labels, focus, keyboard navigation and reduced motion were checked; no full assistive-technology certification is claimed. Extremely large or adversarial workbooks were not load-tested. CSV applications may infer numeric ID types, so import BITS IDs as text when leading zeros matter. Stage 1 logs and snapshots remain historical records of that stage.
