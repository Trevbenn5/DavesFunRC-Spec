const SUGGESTIONS_EMAIL = 'davesfunrc@outlook.com';
const SUGGESTION_SUBJECT = 'DavesFunRC suggestion';

export interface SuggestionFields {
  name: string;
  country: string;
  feedback: string;
}

export interface SuggestionErrors {
  name?: string;
  feedback?: string;
}

export function validateSuggestion({ name, feedback }: SuggestionFields): SuggestionErrors {
  const errors: SuggestionErrors = {};

  if (!name.trim()) {
    errors.name = 'Please enter your name.';
  }

  if (!feedback.trim()) {
    errors.feedback = 'Please share your suggestion.';
  }

  return errors;
}

export function buildMailtoUrl({ name, country, feedback }: SuggestionFields): string {
  const lines = [`Name: ${name}`];

  if (country.trim()) {
    lines.push(`Country: ${country}`);
  }

  lines.push(`Feedback: ${feedback}`);

  const body = encodeURIComponent(lines.join('\n'));
  const subject = encodeURIComponent(SUGGESTION_SUBJECT);

  return `mailto:${SUGGESTIONS_EMAIL}?subject=${subject}&body=${body}`;
}
