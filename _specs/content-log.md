# Content Log

Record of Content fast-path edits (per `CLAUDE.md`'s Content fast path).
Each entry is a dated bullet; multiple edits made together are grouped as
sub-bullets under one entry.

## 2026-07-27

- Rewrote the weekly update body text in `src/data/home-weekly-update.md`
  (Home Page Weekly Update feature) — new wording about the MKVI Canberra
  Bomber finishing touches and the MKVI Chaotic 3D Flyer, same three
  paragraphs, no structural change.

## 2026-08-04

- Updated the Suggestions page's contact email (the `mailto:` target
  built by `src/features/suggestions/suggestions.ts`) from
  `trevbenn5@hotmail.com` to `davesfunrc@outlook.com`. Same field, same
  validation, same behaviour — only the destination address changed.

## 2026-08-10

- Fixed `src/data/home-weekly-update.md` so it deploys correctly: restored
  the blank line between the heading and each paragraph, and between
  paragraphs (an earlier weekly-update edit had collapsed them onto
  consecutive lines, which made `parseWeeklyUpdate` treat the whole file
  as a single heading block with no body paragraphs, failing
  `WeeklyUpdate.test.tsx` in CI).
- Removed an accidental double space in the "This Friday..." paragraph
  ("competition.  I've" → "competition. I've"), a pre-existing typo that
  was masked by the blank-line bug above and, once that was fixed, broke
  the same test's text-matching assertion.

## 2026-08-12

- Fixed `src/data/references.md` so three recently-added link notes
  deploy correctly: replaced a plain hyphen (` - `) with the required em
  dash (` — `) as the note separator for "Flying Site Guide Victoria",
  "Andrew Newton" and "GroundControlRC". `parseReferences`'s bullet regex
  only recognises `—` or `--` as a note separator (per the format
  documented in the file's own header comment), so entries using a plain
  `-` were silently dropped from the rendered References page even
  though they were present in the deployed bundle.

## 2026-08-19

- Rewrote the weekly update body text in `src/data/home-weekly-update.md`
  (Home Page Weekly Update feature) — new wording covering the John Bird
  Memorial competition result and Most Creative Modeller award, the Lark
  LW PLA wing research, MKVI Chaotix design improvements, and the
  upcoming BYME-A Gyro flight controller test results on the DMFV
  JumpRacer. Same heading and paragraph structure, no behavioural
  change.
