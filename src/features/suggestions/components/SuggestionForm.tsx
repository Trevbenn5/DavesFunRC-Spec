import { useState } from 'preact/hooks';
import type { JSX } from 'preact';
import './SuggestionForm.css';
import { FormField } from '../../../components/forms/FormField';
import { Button } from '../../../components/ui/Button';
import { buildMailtoUrl, validateSuggestion, type SuggestionErrors } from '../suggestions';

export function SuggestionForm() {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [feedback, setFeedback] = useState('');
  const [errors, setErrors] = useState<SuggestionErrors>({});

  function handleSubmit(event: JSX.TargetedEvent<HTMLFormElement>) {
    event.preventDefault();

    const fields = { name, country, feedback };
    const validationErrors = validateSuggestion(fields);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      window.location.href = buildMailtoUrl(fields);
    }
  }

  return (
    <form className="suggestion-form" onSubmit={handleSubmit}>
      <FormField
        id="suggestion-name"
        label="Name"
        value={name}
        onChange={setName}
        required
        error={errors.name}
      />
      <FormField
        id="suggestion-country"
        label="Country"
        value={country}
        onChange={setCountry}
        hint="(optional)"
      />
      <FormField
        id="suggestion-feedback"
        label="Your suggestion"
        value={feedback}
        onChange={setFeedback}
        required
        error={errors.feedback}
        as="textarea"
      />
      <Button type="submit" className="suggestion-form__submit">
        Send suggestion
      </Button>
    </form>
  );
}
