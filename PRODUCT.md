# Product
<!-- impeccable:product-schema 1 -->

## Platform
web

## Users
Instructors reviewing marks and configuring course grades for the CodeForge challenge.

## Product Purpose
A working, unofficial grading-console prototype. It is not an official BITS Pilani Digital tool and is not used for actual academic grading.

## Operating Context
Upload an XLSX marks file, select a course, review analytics, configure inclusive integer grade bands, validate and export CSV. The user approved Stage 2 enhancements after completing Stage 1 debugging.

## Capabilities and Constraints
Preserve Stage 1 import, grade validation and safe CSV behaviour. Input: BITS ID, Course, Total Marks (integer 0–100); omit NC students. Bands: A, A-, B, B-, C, C-, D, E. Existing static HTML and local SheetJS; no backend. Keep student data in the current browser session. Deployment remains Stage 3.

## Stage 2 scope
Clear upload/review/configure/export workflow; labelled charts and grade percentages; searchable and grade-filtered results; session-only per-course grade settings and undo; inline export review and descriptive filename. Responsive layout, keyboard access, field labels and clear errors.

## Evidence on Hand
Stage 1 backup, bug log, tests and synthetic boundary workbook. No official branding assets supplied. Retain the current purple-and-white visual identity while improving hierarchy.

## Product Principles
Every student must be accounted for. Invalid ranges must never produce apparently final grades. Course context must remain visible. Changes must be reversible. Export must describe the current course and full cohort, regardless of table filters.
