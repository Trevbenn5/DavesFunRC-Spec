import type { JSX } from 'preact';
import './FormField.css';

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  hint?: string;
  error?: string;
  as?: 'input' | 'textarea';
  type?: string;
}

export function FormField({
  id,
  label,
  value,
  onChange,
  required,
  hint,
  error,
  as = 'input',
  type = 'text',
}: FormFieldProps) {
  const errorId = error ? `${id}-error` : undefined;

  function handleInput(event: JSX.TargetedEvent<HTMLInputElement | HTMLTextAreaElement>) {
    onChange(event.currentTarget.value);
  }

  return (
    <div className="form-field">
      <label htmlFor={id}>
        {label}
        {required && (
          <span className="form-field__required" aria-hidden="true">
            {' '}
            *
          </span>
        )}
        {hint && <span className="form-field__hint"> {hint}</span>}
      </label>

      {as === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onInput={handleInput}
          aria-required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onInput={handleInput}
          aria-required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
        />
      )}

      {error && (
        <p className="form-field__error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
