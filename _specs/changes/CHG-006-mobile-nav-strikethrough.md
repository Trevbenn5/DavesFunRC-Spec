# CHG-006 — Mobile nav strikethrough fix

## Status

Implemented (2026-07-24)

## Requested change

Fix a visual bug: when a visitor opens the hamburger menu on a narrow
(mobile) viewport, lines render through some of the menu item text
instead of neatly below each row.

## Reason

Reported directly by the site owner. Reproduced and confirmed in a real
browser at a 390px viewport.

## Current behaviour

`src/components/navigation/MainNavigation.css`'s `.main-nav__link` has no
explicit `display` property, so it stays `display: inline` (the browser
default for `<a>`). On desktop this doesn't matter — `.main-nav__list` is
`display: flex`, and flex *items* (the `<li>` elements) get automatically
"blockified" by the flex layout spec, but that blockification doesn't
cascade to the `<a>` nested inside each `<li>`.

The mobile media query (`@media (max-width: 768px)`) adds
`padding: var(--space-16) var(--page-padding-mobile)` and
`border-bottom: 1px solid var(--colour-border)` directly to
`.main-nav__link`, and the base rule separately gives the active item
(`[aria-current='page']`) a `2px solid` border-bottom. Vertical padding
and borders on an **inline** element don't reserve line-box space the way
they do on a block element — browsers render them overlapping the
adjacent line instead of pushing it down. Reproduced screenshot: the
active item's 2px border renders as a strikethrough through the *next*
item's text entirely, and the plain 1px dividers between other rows sit
high enough to cut close to/through descenders and ascenders.

See the real before/after screenshots:
https://claude.ai/code/artifact/859dc9d1-3ad1-49db-b978-1951904f6d52

## Desired behaviour

Each mobile menu item's divider (and the active item's underline) render
as a clean line directly beneath that item's own text, with no line
overlapping or striking through any menu item's words.

## Change classification

Defect

## Affected files

- `src/components/navigation/MainNavigation.css` — add `display: block;`
  to the base `.main-nav__link` rule. Verified locally: this alone
  resolves the overlap in both the mobile stacked list and the active-item
  underline, with no other property changes needed. Desktop is unaffected
  (the link is still a flex item there, and `display: block` doesn't
  change a flex item's own layout behaviour as a flex child, only how its
  own children/box model behave — confirmed visually, no regression).
- No changes to `MainNavigation.tsx`, routing, or any other component.
