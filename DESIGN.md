---
name: CodeForge Grading Console
description: A light, dense workspace for reviewing marks and configuring course grades.
colors:
  purple: "#5b3cc4"
  purple-dark: "#41288f"
  lavender: "#f5f3ff"
  ink: "#222039"
  muted: "#605d73"
  line: "#dedbe9"
  paper: "#fff"
  soft: "#f8f7fc"
  green: "#166349"
  red: "#a82232"
typography:
  headline:
    fontFamily: "Segoe UI, Arial, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Segoe UI, Arial, sans-serif"
    fontSize: "19px"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Segoe UI, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Segoe UI, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 600
  hint:
    fontFamily: "Segoe UI, Arial, sans-serif"
    fontSize: "12px"
    lineHeight: 1.6
rounded:
  badge: "4px"
  control: "7px"
  panel: "12px"
spacing:
  small: "8px"
  compact: "12px"
  medium: "16px"
  section: "20px"
  panel: "24px"
components:
  button-primary:
    backgroundColor: "{colors.purple}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "9px 16px"
  button-primary-hover:
    backgroundColor: "{colors.purple-dark}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "9px 16px"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "9px 11px"
  panel:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.panel}"
    padding: "24px"
---

# Design System: CodeForge Grading Console

## Overview

The incumbent purple-and-white console uses light work surfaces, restrained borders and dense, readable controls. This records the implemented Stage 2 extension, sourced from `console.css` and `BITS_Digital_CodeForge_Challenge.html`; it does not introduce a new identity or creative metaphor.

Course context and numerical alignment organize a browser-local grading workspace. The visible unofficial-prototype notice is part of the identity context; no official branding assets are implied.

**Key Characteristics:**
- Purple actions on a pale lavender canvas.
- White bordered panels with compact, labelled controls.
- Aligned numerical data and explicit validation states.

## Colors

Purple provides action and selection emphasis; cool neutrals carry sustained reading.

### Primary
- **Purple:** primary buttons, active workflow steps, chart bars and keyboard focus.
- **Deep purple:** links, selected-step text and primary hover.

### Secondary
- **Green:** successful range validation and status messages.
- **Red:** validation text and invalid field borders, accompanied by explanatory text.

### Neutral
- **Lavender:** page canvas and secondary-button hover.
- **Paper:** panels and fields.
- **Soft:** table headers and chart empty states.
- **Ink:** headings, values and main text.
- **Muted:** hints, metadata and secondary labels.
- **Line:** panel edges and section dividers.

**The Explicit State Rule.** Pair validation colors with readable messages and field semantics.

## Typography

Body and utility text use Segoe UI with Arial and sans-serif fallbacks. Labels are compact and semibold; numeric values use tabular figures in statistics, tables, range selectors and session time. Paragraphs have a maximum measure of 72ch.

The title token describes panel headings; course context uses 23px and statistics use 23px at weight 600. Body copy is 14px, table content and control labels are 13px, and supporting text is 12px. Mobile keeps supporting and chart text at 12px rather than shrinking it further. The inherited system-font page heading is documented as an incumbent exception, not a display-font prescription for future identities.

## Layout

The centered container is capped at 1360px with 30px 32px 28px padding. Import fields use three columns (1.4fr 1fr 1fr). The main workspace pairs analytics and grade ranges in a 1.05fr / minmax(360px, 1fr) grid with a 20px gap. Results and inline export review span the width below. Four statistics share a row; grade distribution normally uses two columns.

At 1000px, container padding becomes 24px, panels 20px, workspace columns equalize and grade distribution uses one column. At 760px, container padding is 20px 16px, workspace and export stack, upload spans two field columns, grade distribution returns to two columns and the table footer stacks. At 420px, import fields stack, panels use 17px padding, the masthead stacks and each distribution value moves below its bar. Table overflow remains locally scrollable. Long course names, filenames and cell content wrap.

## Elevation & Depth

The interface is flat: no box shadows, gradients or elevated overlays. White surfaces, pale canvas, thin borders and internal rules supply separation. Focus uses a 3px purple outline with a 3px offset.

## Shapes

Panels use the panel radius, controls use the control radius, and grade badges use the badge radius. Workflow counters and status dots are circles; distribution tracks are thin rounded bars. The lettered identity tile has a 9px radius.

## Components

### Buttons

Primary actions have white text on purple; hover deepens the fill. Secondary actions have ink text, a white fill and neutral border; hover adds lavender fill and a stronger border. Standard controls have a 42px minimum height. Range actions reduce to 36px, pagination to 34px, and export expands to 46px. Disabled controls have muted text, pale fills and a not-allowed cursor.

### Inputs / Fields

Fields have visible labels, a neutral stroke and white fill. Range selectors use accessible grade-specific minimum/maximum labels. Invalid selectors receive a red border, pale red fill and `aria-invalid`; the affected row is tinted and an alert explains the problem. Disabled fields use a muted fill. Focus follows the shared outline rule.

### Navigation

Four equally spaced workflow links sit between horizontal rules. The current step uses a filled purple numbered circle and deep-purple text via `aria-current=step`. Links navigate to the workflow sections. A keyboard-visible skip link targets the workspace.

### Cards / Containers

Panels are bordered white reading surfaces, with responsive padding described above. Internal dividers separate statistics, distributions and import guidance. Empty chart content sits on a soft neutral surface with a short explanation.

### Grade badges and results

Assigned grades use small lavender badges with deep-purple text; pending assignments use a muted badge. Results show 25 rows per page with labelled search and grade filters, row hover feedback, visible counts and disabled pagination boundaries. Filters affect the preview; the export review describes the full cohort.

### Charts and ranges

The histogram is 240px high, uses ten labelled mark bins with counts above bars, and renders at device pixel ratio. Labels rotate 45 degrees below a chart width of 430px; the marks-axis title stays below them. A descriptive accessible label lists bin counts. Grade distribution pairs bars with counts and percentages. Grade edits update analytics, preview and export together; invalid bands suppress final assignments and disable export. Course-scoped undo and reset controls provide recovery.

### Motion

Buttons transition background color over 150ms. Charts and distribution changes are immediate. Anchor navigation scrolls smoothly; reduced-motion preference disables smooth scrolling, animation and transitions.

## Do's and Don'ts

### Do:
- **Do** preserve labelled controls, visible keyboard focus and explanatory validation messages.
- **Do** keep numeric columns aligned and chart labels readable at narrow widths.
- **Do** describe pending and disabled states explicitly before export is available.

### Don't:
- **Don't** convey grade validity by color alone.
- **Don't** animate data changes or retain smooth scrolling under reduced-motion preference.
- **Don't** treat the incumbent system-font heading or lettered brand tile as a new display identity to propagate.
