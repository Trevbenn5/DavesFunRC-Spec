import { describe, expect, it } from 'vitest';
import { buildMailtoUrl, validateSuggestion } from './suggestions';

describe('validateSuggestion', () => {
  it('returns no errors when name and feedback are filled in', () => {
    expect(validateSuggestion({ name: 'Sven', country: '', feedback: 'Build a STOL plane' })).toEqual(
      {},
    );
  });

  it('requires a non-empty name', () => {
    const errors = validateSuggestion({ name: '', country: '', feedback: 'Build a STOL plane' });
    expect(errors.name).toBe('Please enter your name.');
  });

  it('requires a non-empty feedback', () => {
    const errors = validateSuggestion({ name: 'Sven', country: '', feedback: '' });
    expect(errors.feedback).toBe('Please share your suggestion.');
  });

  it('treats whitespace-only input as empty', () => {
    const errors = validateSuggestion({ name: '   ', country: '', feedback: '   ' });
    expect(errors.name).toBe('Please enter your name.');
    expect(errors.feedback).toBe('Please share your suggestion.');
  });

  it('does not require country', () => {
    const errors = validateSuggestion({ name: 'Sven', country: '', feedback: 'Build a plane' });
    expect(errors).toEqual({});
  });
});

describe('buildMailtoUrl', () => {
  it('builds the exact encoded mailto URI for the Name/Country/Feedback example', () => {
    const feedback =
      "Hello, I'm from Sweden and enjoy indoor aviation due to our climate. I'd like to see you build a STOL aircraft with 4 motors.";

    const url = buildMailtoUrl({ name: 'Sven', country: 'Sweden', feedback });

    const expectedBody = `Name: Sven\nCountry: Sweden\nFeedback: ${feedback}`;
    expect(url).toBe(
      `mailto:davesfunrc@outlook.com?subject=${encodeURIComponent('DavesFunRC suggestion')}&body=${encodeURIComponent(expectedBody)}`,
    );

    // and decoding it back reproduces the exact human-readable example from the spec
    expect(decodeURIComponent(url.split('body=')[1])).toBe(expectedBody);
  });

  it('omits the Country line entirely when country is blank', () => {
    const url = buildMailtoUrl({ name: 'Sven', country: '', feedback: 'Build a STOL plane' });
    const body = decodeURIComponent(url.split('body=')[1]);

    expect(body).toBe('Name: Sven\nFeedback: Build a STOL plane');
  });

  it('omits the Country line when country is whitespace-only', () => {
    const url = buildMailtoUrl({ name: 'Sven', country: '   ', feedback: 'Build a STOL plane' });
    const body = decodeURIComponent(url.split('body=')[1]);

    expect(body).toBe('Name: Sven\nFeedback: Build a STOL plane');
  });

  it('uses a fixed subject line', () => {
    const url = buildMailtoUrl({ name: 'Sven', country: '', feedback: 'Build a plane' });
    expect(url).toContain('subject=DavesFunRC%20suggestion');
  });

  it('targets the configured suggestions email address', () => {
    const url = buildMailtoUrl({ name: 'Sven', country: '', feedback: 'Build a plane' });
    expect(url.startsWith('mailto:davesfunrc@outlook.com?')).toBe(true);
  });
});
