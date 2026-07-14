# Design System

## Purpose

This document defines the visual language, interaction patterns and reusable
components for the website.
All new features must follow these standards.
Do not introduce new UI patterns unless there is a compelling user experience
reason.
---

# Design Principles

The application should feel:

- Simple
- Professional
- Fast
- Accessible
- Consistent
- Spacious rather than cluttered

Every screen should emphasise the user's primary task.

---

# Colour Palette

Refer to the file `static_assets\color_pallette.jpeg` for inspiration on the theme

## Primary
Deep Navy (#243746)
Used for:

- Primary buttons
- Links
- Active navigation
- Focus indicators

## Secondary

Sage Green (#7C9A7D)

Used for:

- Secondary text
- Borders
- Disabled controls

---

## Accent

Burnt Copper (#B56A3B)

---

## Background

Warm Ivory (#F8F6F2)

---

## Text

Charcoal (#2E2E2E)

---

## Success

Green

Used for:

- Successful actions
- Validation success
- Completed workflow states

---

## Warning

Amber

Used for:

- Warnings
- Unsaved changes
- Confirmation prompts

---

## Error

Red

Used for:

- Validation errors
- Failed operations
- Dangerous actions

---

# Typography

## Font

Inter

Fallback:

- Arial
- sans-serif

---

## Heading hierarchy

H1
Page title

H2
Major section

H3
Subsection

H4
Component heading

Never skip heading levels.

---

## Body text

16px

Line spacing should favour readability.

Paragraphs should be short.

---

# Layout

Maximum content width:

1200px

Standard page padding:

32px desktop

16px mobile

---

# Grid

Desktop

12 columns

Tablet

8 columns

Mobile

Single column

---

# Spacing

Use an 8-point spacing system.

Allowed spacing values:

4
8
16
24
32
40
48
64

Avoid arbitrary spacing.

---

# Border Radius

Cards

12px

Buttons

8px

Inputs

8px

Badges

999px

---

# Shadows

Only three shadow levels:

Small

Cards

Medium

Dialogs

Large

Navigation overlays

---

# Icons

Use Lucide icons.

Avoid mixing icon libraries.

Icons should always accompany destructive actions.

---

# Buttons

## Primary

Filled

Used for:

- Save
- Submit
- Continue
- Create

Only one primary action should exist per page section.

---

## Secondary

Outlined

Used for less important actions.

---

## Tertiary

Text only.

Used for optional actions.

---

## Destructive

Red.

Confirmation required.

---

# Forms

Labels always appear above fields.

Required fields display "*".

Inline validation.

Error message appears below the field.

Never rely on colour alone.

---

# Tables

Default sorting on primary column.

Sticky headers.

Pagination above 20 rows.

Support keyboard navigation.

---

# Cards

Cards should contain

- title
- summary
- primary action

Avoid large walls of text.

---

# Navigation

Desktop

Horizontal navigation

Mobile

Hamburger menu

Breadcrumbs appear from the second level onward.

---

# Empty States

Every empty state should include

- explanation
- illustration (optional)
- primary action

Never show an empty table.

---

# Loading States

Prefer skeleton loaders.

Avoid spinner-only pages.

---

# Error States

Errors should explain

- what happened
- what the user can do next

Avoid technical messages.

---

# Dialogs

Dialogs should contain

- title
- explanation
- primary action
- cancel action

Avoid nested dialogs.

---

# Accessibility

Minimum WCAG AA.

All controls keyboard accessible.

Visible focus indicators.

Semantic HTML.

Colour contrast minimum AA.

Images require alt text.

---

# Responsive Behaviour

Desktop first.

Every feature must function on:

- desktop
- tablet
- mobile

No horizontal scrolling.

---

# Animation

Keep animations subtle.

Maximum duration:

300ms

Respect reduced-motion preference.

---

# Reusable Components

Available components:

- Button
- Card
- Modal
- Table
- Form
- Input
- Select
- Checkbox
- Radio
- Badge
- Alert
- Tabs
- Accordion
- Breadcrumb
- Pagination
- Toast

Always reuse existing components before creating a new one.

---

# Component Rules

Before creating a new component:

1. Search existing components.
2. Extend an existing component if appropriate.
3. Only create a new component when reuse would reduce clarity.

---

# Naming

Component names use PascalCase.

Props should follow existing conventions.

Avoid abbreviations.

---

# Feature Checklist

Every feature should:

✓ reuse existing components
✓ follow spacing rules
✓ use existing colours
✓ use existing typography
✓ support keyboard navigation
✓ support mobile
✓ include loading state
✓ include error state
✓ include empty state where appropriate
✓ satisfy accessibility requirements
✓ include tests