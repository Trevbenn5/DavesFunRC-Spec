import { describe, expect, it } from 'vitest';
import { parseWeeklyUpdate } from './home-weekly-update';

describe('parseWeeklyUpdate', () => {
  it('extracts the heading from the leading H1 line', () => {
    const result = parseWeeklyUpdate('# Hello there\n\nOne paragraph.');

    expect(result.heading).toBe('Hello there');
  });

  it('splits blank-line-separated blocks into body paragraphs, in order', () => {
    const result = parseWeeklyUpdate(
      '# Heading\n\nFirst paragraph.\n\nSecond paragraph.\n\nThird paragraph.',
    );

    expect(result.body).toEqual(['First paragraph.', 'Second paragraph.', 'Third paragraph.']);
  });

  it('trims surrounding whitespace from the heading and each paragraph', () => {
    const result = parseWeeklyUpdate('#   Padded heading  \n\n  Padded paragraph.  ');

    expect(result.heading).toBe('Padded heading');
    expect(result.body).toEqual(['Padded paragraph.']);
  });
});
