# 4sight Excel Formatting Standards
## Based on Berkeley-Haas DFMW Style Guides (Parts 1, 2 & 3)
## Investment Banking Best Practices — Jenny Herbert-Creek

This file is the authoritative source for how 4sight formats Excel spreadsheets.
Read this file whenever the user asks to format, clean up, audit, or improve the
visual presentation of a spreadsheet. These standards come directly from
investment banking conventions and are the baseline for what professional
investors expect to see.

The core design principle behind all of these rules is **transparency**. A
well-formatted model makes it immediately obvious what every number is, where
it comes from, whether it can be changed, and how the pieces connect. When in
doubt, ask: "Can a reader follow this model without me in the room?"

---

## Part 1: Model Structure

### How Calculations Should Be Built

**Perform each calculation only once.** If the same result is needed in multiple
places, the second and subsequent references should point back to the original
cell using a formula. Never recalculate the same thing in two different places —
this creates inconsistency risk where one gets updated and the other doesn't.

**Show intermediate steps.** Break complex calculations into multiple rows or
columns. If a formula requires more than one operation, split it up so each
line does one thing. The goal is that a reader can follow the logic line by
line without needing to decode a single complex formula. As the IB standard
puts it: "A complicated formula can often be broken down into multiple cells
and simplified."

**Use a logical calculation flow.** Time should flow horizontally from left to
right (Year 1 in column B, Year 2 in column C, etc.). Calculations should flow
vertically from top to bottom within each time period. This structure prevents
circular references and makes the model readable like a document — you start
at the top left and follow the logic down and to the right.

### Assumptions and Inputs

**Never hardcode assumptions inside formulas.** An assumption (like a 10%
growth rate or a $500 average contract value) should live in its own labeled
cell. Formulas elsewhere in the model should reference that cell, not contain
the number directly. This means that when an assumption changes, you update
it in exactly one place and the entire model updates automatically.

**For small models**, assumptions can be integrated into the natural flow of
the calculation, labeled clearly. **For larger multi-tab models**, create a
dedicated Assumptions tab where all inputs are consolidated. This is the
professional standard for any model that will be shared with investors.
When assumptions are in a separate tab, calculations on other tabs should
still reference them via formulas — never copy-paste the values.

**All input and output cells must have clear, concise labels.** Avoid
acronyms unless they are universally understood in the context. A cell
containing a number without a label is a model error, not just a style error.

---

## Part 2: Formatting — The Investment Banking Color System

The color system is the most immediately recognizable signal of a
professionally built model. Every investment banker and sophisticated investor
recognizes it instantly. Violating it signals that the model was built by
someone unfamiliar with professional standards.

### Font Colors (the three-color system)

**Royal Blue** is used exclusively for constants — meaning hard-coded input
values that the user can and should change. When a number is blue, it means:
"this is an assumption you can modify." Examples include growth rate
percentages, price per unit, headcount costs, discount rates, and any other
input that drives the model. In Excel, the exact color is custom: RGB values
are approximately R:0, G:0, B:255 (pure blue), though the precise "royal blue"
used in IB is slightly darker — consult the Excel custom color settings.

**Black** is used for all formula cells and all text (labels, headers,
descriptions). When a number is black, it means: "this is a calculated
result — don't change it directly." This covers every cell that contains
a formula, every cell displaying a subtotal or total, and every descriptive
text cell in the model.

**Green** is reserved for values that are pulled from another tab in the
workbook (cross-sheet references). When a number appears green, it signals:
"this value lives somewhere else in this workbook — go to that tab to change
it." Some modelers use hyperlinks instead of green font for the same purpose —
either convention is acceptable, but you must pick one and apply it consistently
throughout the entire workbook.

The three-color rule is simple to remember: **Blue = input, Black = formula
or text, Green = cross-sheet reference.**

### Fonts

Use only **Calibri** (the default in Excel 2007 and later) or **Arial**
(the default in earlier versions). Do not use decorative or non-standard fonts.
Font size should be **10 to 12 point** and must be consistent throughout the
entire model. Mixing font sizes within a sheet (except for the designated title
and header hierarchy, described below) signals a lack of attention to detail.

### Number Formats

**Negative numbers** must always be displayed in parentheses, not with a
minus sign. So negative $50,000 should appear as ($50,000), not -$50,000.
This is universal in financial statements and IB models.

**Thousands separator** (the comma) must be turned on for all numbers.
$1000 should always appear as $1,000.

**Currency format** should be used for all dollar amounts. For long lists
of numbers that are all in currency (such as an income statement), it is
acceptable to show the dollar sign only on the first and last line of the
list — this reduces visual clutter while still making the currency clear.

**Percentage format** should be used for all percentage values. For negative
percentages, ideally use a custom format that shows them in parentheses
(e.g., (5%) rather than -5%).

**Decimal places** should be chosen based on what the number represents and
applied consistently within each section. The IB convention is: no decimals
for years and dollar amounts in thousands; one decimal place for most multiples,
most percentages, and dollar amounts in millions; two decimal places for
earnings per share and certain detailed percentages or multiples.

### Alignment

**Never merge cells.** Merging cells is one of the most common mistakes in
amateur models. It breaks navigation, causes issues with copy-paste, and
creates problems when sorting or referencing. Use "Center Across Selection"
if you need a centered title that spans columns — this achieves the same visual
result without merging.

**Text aligns left, numbers align right.** This is the Excel default and
the IB standard. Column headers should align to match the data in their
column (so a number column has a right-aligned header, a text column has a
left-aligned header). Center alignment should be used sparingly — only for
major page titles or section delineators where it clearly improves readability.

**Indent sub-calculations.** If a section has line items that feed into a
total, indent the line items one level. This creates visual hierarchy within
the data without requiring separate formatting.

### Bold, Italics, Borders, and Fill

**Bold text** should be used for: section titles, subtotals and totals
(summary rows), column headers (dates, period labels), and the final
worksheet-level summary result.

**Italics** should be used only for percentage formula results — for example,
"Net Income as % of Revenue" where the cell contains a formula dividing net
income by revenue. Never italicize a hardcoded percentage input — that should
be blue. The italics signal: "this percentage was calculated, not entered."

**Borders** (not underlined text) should be used to delineate section titles
and section summaries. Use a top and bottom border to frame section headers.
Use a top border above total/summary rows. Borders create clean, readable
visual separation without relying on fill color for everything.

**Fill colors** should be used sparingly and consistently. The approved fills
are light grey (for section summaries and subtotal rows) and navy blue (for
major section headers, paired with white text). Do not use arbitrary colors —
stick to the defined hierarchy.

---

## Part 3: Worksheet Design (Single Tab)

### Page Layout

Every worksheet should be set up to print cleanly, even if it will primarily
be used digitally. This is a professional discipline that forces you to think
about whether your model is legible at a glance.

**Add an empty Row 1 and an empty Column A** to every sheet. This gives the
model visual "breathing room" at the top and left edge — the model starts at
cell B2, not A1. This is a small but immediately noticeable mark of a
professional model.

**Turn off gridlines.** A model without gridlines looks significantly more
polished and forces the structure to be communicated through borders and fills
rather than relying on Excel's default grid. Go to View → uncheck Gridlines.

**Add a title in the top left of every sheet.** The title should clearly
identify what the sheet contains. If applicable, include the time period,
scenario, or other important context directly below the title. Use font size
16 bold for the title.

**Set the model to print on one page** (for single-page models). For larger
models, adjust print settings so that page breaks occur at logical points
and that row and column labels repeat on every printed page.

### Visual Hierarchy System

Every worksheet should use a consistent, limited set of styles to communicate
structure. Using too many different styles is as bad as using none — it creates
visual noise. The approved hierarchy has exactly five levels.

The **worksheet title** should be the most visually dominant element on the
page. Use font size 16, bold. Options: navy blue fill with white text, or
large bold text on a white background.

**Section headers** mark the beginning of major logical sections within the
sheet. Options: navy blue fill with white text, or bold text with a bottom
border, or bold text in ALL CAPS. Pick one style and apply it to every
section header on the sheet.

**Section summaries** (subtotal rows within a section) should be visually
distinct from the line items above them. Options: light grey fill with bold
text, or bold text with a top border. These rows contain the calculated
total of their section.

**Worksheet summary** (the final result row of the entire sheet) should be
the most prominent data row. Options: bold text with a full outline border,
or navy fill with white text, or grey fill. This is the "bottom line" of
the sheet.

**Normal style** (everything else — regular line items, intermediate
calculations, labels) should have no special formatting. It should be
visually quiet so that the hierarchy above it reads clearly.

The key rule: **choose one consistent style for each level and never deviate
within a worksheet.** Inconsistency in the hierarchy is a formatting error.

---

## Part 4: Workbook Design (Multi-Tab Models)

Multi-tab models introduce additional requirements for navigation, consistency,
and error prevention. These standards apply any time a model has more than
one worksheet.

### Tab Organization

**The first tab must be a summary or overview.** It should either show the
final output (the result the reader most cares about) or serve as a navigation
guide to the rest of the model. An investor opening a multi-tab model should
be able to understand its structure and key outputs from the first tab alone.

**Tab names must be clear and progress logically from left to right.**
The standard financial model tab order is: Summary → Assumptions → Revenue
→ COGS/Gross Margin → Headcount/Opex → Income Statement (P&L) → Balance
Sheet → Cash Flow Statement → Cap Table → Supporting Schedules. Name each
tab descriptively — "Revenue" not "Sheet2". Abbreviate only if the full name
doesn't fit (e.g., "IS" for Income Statement is acceptable if consistently used).

**Use Freeze Panes** on any sheet where projections extend horizontally across
many columns (months or years). Freeze the left columns (typically the label
column) so that when the user scrolls right, they can still see what each row
represents. Go to View → Freeze Panes → Freeze First Column, or select the
cell to the right of the last column you want frozen and choose Freeze Panes.

**Never hide rows or columns.** Hidden cells are a major red flag in investor
models because they suggest something is being concealed or that the modeler
doesn't trust the reader to understand the intermediate steps. If you need to
temporarily collapse a section, use Group (Data → Group) instead. Grouped
rows/columns can be expanded and collapsed with a click while remaining fully
visible and auditable.

### Cross-Tab References

When a cell on one tab pulls its value from another tab, this must be visually
signaled. The two accepted conventions are green font color (the IB standard)
or a hyperlink to the source tab. Apply one convention consistently throughout
the entire workbook — never mix both.

When building a formula that references another tab, Excel automatically
creates the cross-sheet reference in the format `=SheetName!CellReference`.
Always reference the original calculation directly — never copy-paste a
value across tabs, because that creates a static number that won't update
when the source changes.

### Error Prevention and Checking

**Keep formulas simple.** Avoid nested IF statements beyond two levels. If
a calculation requires complex conditional logic, break it into multiple cells
with intermediate steps. Complex formulas are harder to audit, more likely to
contain errors, and invisible to the reader.

**Build triangulation checks.** For any important calculation, find a second
way to compute the same result and verify they match. For example, total
revenue can be computed as the sum of all product lines, or as average revenue
per customer times number of customers. If both methods give the same answer,
you have increased confidence that neither is wrong.

**Build explicit error checks into the model**, especially for the balance
sheet (which must always balance: Assets = Liabilities + Equity). Create a
dedicated "Check" row that displays a formula comparing the two sides. If
they match, display "OK" (or 0). If they don't match, display "ERROR" in
red. Keep these check formulas simple — a complex error check can itself
contain errors.

---

## Part 5: How 4sight Should Apply These Standards

When analyzing a spreadsheet for formatting issues, 4sight should evaluate
every cell against these rules and propose changes through the diff system.
The following framework guides what to flag and how to prioritize.

### Critical Errors (always flag, high priority)

Any hardcoded number inside a formula (e.g., `=B4*0.10` where 0.10 should be
a referenced assumption cell) must be flagged. This is the most dangerous
formatting error because it makes the model un-auditable and un-editable.

Any cell that appears to be an input (a constant number the user entered)
but is formatted in black font rather than royal blue must be flagged.
Readers cannot tell what can be changed.

Any calculation that appears to be performed more than once in the model
must be flagged. The duplicate should be replaced with a reference to
the original.

Any sheet missing a title must be flagged.

### Important Improvements (flag, medium priority)

Percentage formula results that are not italicized should be flagged.

Numbers displaying negative values with a minus sign rather than parentheses
should be flagged.

Missing thousands separators should be flagged.

Cells without labels should be flagged.

Any merged cells should be flagged and a note explaining the alternative
(Center Across Selection) should be provided.

Gridlines that are still visible should be flagged.

The absence of an empty Row 1 and Column A should be flagged.

### Style Suggestions (propose, low priority)

If the model has no consistent visual hierarchy (no section headers,
no summary rows formatted differently from line items), propose a formatting
scheme using the approved hierarchy from Part 3.

If a multi-tab model has no summary tab as the first sheet, propose adding one.

If freeze panes are missing on a wide time-series model, propose adding them.

If the tab order does not follow the logical flow (Assumptions → Revenue →
COGS → Headcount → P&L → Balance Sheet → Cash Flow), propose reordering.

### How to Communicate Formatting Changes

When proposing formatting changes, use the diff system exactly as with content
changes. For formatting-specific proposals that cannot be expressed as a cell
value change, use the NOTE convention:

{"sheet": "Revenue", "cell": "NOTE", "new_value": null,
 "reason": "Cell B4 contains a hardcoded 0.15 (growth rate) inside the formula
  =B3*0.15. This should be separated: put 15% in a dedicated blue-formatted
  input cell (e.g., B2, labeled 'Annual Growth Rate'), then change the formula
  to =B3*B2. This follows the IB standard of never hardcoding assumptions."}

For cell-level formatting changes that can be expressed as value or formula
changes (like fixing a formula to reference an assumption cell), use the
standard change format with a reason that explicitly names the formatting
rule being applied.

Always cite the principle behind the change in the reason field. Founders
learn formatting standards through 4sight, not just get their model fixed.
