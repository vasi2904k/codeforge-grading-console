# Stage 1 — Bug Fix Log

Completed 26 September 2026. Functional debugging only; redesign and deployment are later stages.
Original: `BITS_Digital_CodeForge_Challenge.original.html`. Fixed: `BITS_Digital_CodeForge_Challenge.html` (keep `vendor/` beside it).

| # | Bug / Issue Identified | How You Reproduced It | Root Cause | Fix Implemented | How You Tested the Fix |
|---|---|---|---|---|---|
| 1 | XLSX excluded by picker; incorrect rounding guidance | Inspect picker and example describing 80.2 rounding to 81 | `.xls` accept filter; inaccurate input instructions | Accept `.xlsx`; explain integer marks 0–100 and no automatic rounding | Picker test, real XLSX upload and fractional-mark rejection |
| 2 | Duplicate and stale courses | Upload repeated Math rows, then Science workbook | Options appended per row without clearing | Replace options and deduplicate courses; clear derived state | Sequential upload test verifies unique replacement list |
| 3 | Invalid rows accepted; numeric text corrupts arithmetic; documented ID alias exports undefined | Upload blank, negative, over-100, fractional, text or boolean marks; text 20 and 80; malformed headers; duplicate records; Student’s BITS ID header | No schema validation or normalization | Validate worksheet atomically; normalize numeric text and header aliases; enforce required fields; reject duplicate student/course pairs with row number | Input tests cover malformed rows, empty files, reordered headers, aliases, whitespace, numeric text and cross-course IDs |
| 4 | Min and Max reversed | Upload 20 and 80 | Swapped markup IDs | Correct IDs | Check labels and values; Edge verifies 0 and 100 |
| 5 | Empty selection produces invalid stats/stale data | Select course then placeholder | Empty-array arithmetic; no selection guard | Clear derived UI and disable actions; guard empty statistics | DOM and Edge placeholder checks |
| 6 | Incomplete coverage and empty bounds accepted | A max 99; E min 1; A min 0 produces missing next maximum | Endpoints not checked; empty string coerced to zero | Require integer bounds, endpoints 0/100, ordered intervals and exact adjacency | Tests for endpoints, gaps, overlaps, reversed and empty bounds; direct export handler cannot bypass validation |
| 7 | Single-mark band rejected | A 100–100 with A- max 99 | Uses Min >= Max | Allow inclusive Min == Max | DOM and Edge eligibility/distribution checks |
| 8 | Export enabled without instructor/records | Clear instructor after selecting course | Only ranges gate export | Check instructor, selected records and ranges on updates and at export | Clear/re-enter instructor, empty selection and invalid direct export checks |
| 9 | Reset crashes before selection and confirms twice | Reset at startup or after selection | Missing selectors; duplicate confirmation | Disable/guard until selection; one confirmation | Initial state, confirmation count and real reset workflow |
| 10 | Large histogram clips; identical marks cause invalid curve coordinates; overlapping bin labels | 40 students with mark 80 | Fixed height scale; zero standard deviation; misleading labels | Scale bars to peak bin; skip zero-variance curve; normalize curve height and align x scale; label 0–9 through 90–100 | Finite/bounded coordinate test and screenshot review |
| 11 | Old chart animation redraws after selection changes | Start chart then immediately clear selection | Pending animation not cancelled | Track/cancel frame before redraw or clear | Wait beyond pending frame; no drawing after clearing |
| 12 | CSV punctuation splits columns; formula injection; temporary URLs leak | Export name Smith, "Jo" and ID =1+1 | Raw interpolation; no URL cleanup | Quote/escape fields, neutralize formula prefixes, UTF-8 BOM/CRLF; revoke URL | Blob checks; actual Edge download independently parsed; 16 boundary students and grades verified |
| 13 | Timer freezes after export; completion text remains after edits | Download, wait, then edit ranges | Interval cleared permanently; stale success state | Keep timer running; immediate tick; reset on successful upload; clear success text on edits | Edge observes timer advance after export; edit clears message |
| 14 | Invalid ranges show unreliable distribution | Introduce gap/overlap/reversal | Summary calculated despite validation error | Clear summary until ranges validate | Invalid-range tests verify no summary badges/export |
| 15 | Upload failures/races retain wrong state | Corrupt replacement; older read finishes after newer; reader failure | Missing error handling/sequencing/state invalidation | Clear old data; check XLSX signature; catch parse errors; handle read errors/abort; ignore old callbacks | Reader race/error tests; Edge corrupt upload and recovery; missing-library/wrong-extension checks |
| 16 | Outdated unpinned Excel library; CDN dependency | Original npm-based distribution and initial audit | Unversioned jsDelivr/npm dependency | Vendor SheetJS CE 0.20.3 with license; same version in tests | Final audit and local browser import/export without CDN |

## Input decisions

- First worksheet only; exactly three headers in any order: BITS ID, Course, Total Marks. Accept Student’s BITS ID and Student's BITS ID aliases; trim headers.
- Trim IDs and course names. Preserve text IDs such as 0001; store IDs as text in Excel when leading zeros matter. Numeric display formatting is not interpreted as part of an ID.
- Accept integer numeric cells and digit-only numeric text. Reject fractions without rounding, blanks, booleans, nonnumeric marks and marks outside 0–100.
- Reject the entire workbook on any invalid populated row; skip wholly empty rows. Reject duplicate IDs within a course; permit the same ID in different courses. NC students remain excluded.
- Course switches still restore default grade settings, matching the original workflow. Per-course saved settings are a Stage 2 consideration.

## Verification

Original failed 26 of 27 initial checks. All 36 final regression checks pass, plus a separate real Edge workflow. During the second pass, a new filename-display regression was reproduced and fixed: successful uploads now retain their filename; failed uploads clear the input to permit retry.

No known unresolved Stage 1 functional defect was found in the tested cases. This does not guarantee zero bugs. Broader browser coverage, very large files, mobile layout and accessibility improvements remain outside this verification.
