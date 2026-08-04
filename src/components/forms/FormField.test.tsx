import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
import { FormField } from './FormField';

describe('FormField', () => {
  it('renders a labelled input and reports changes', () => {
    const onChange = vi.fn();
    render(<FormField id="name" label="Name" value="Sven" onChange={onChange} />);

    const input = screen.getByLabelText('Name') as HTMLInputElement;
    expect(input.value).toBe('Sven');

    fireEvent.input(input, { target: { value: 'Sven A' } });

    expect(onChange).toHaveBeenCalledWith('Sven A');
  });

  it('renders a textarea when as="textarea"', () => {
    render(
      <FormField id="feedback" label="Feedback" value="Hello" onChange={vi.fn()} as="textarea" />,
    );

    expect(screen.getByLabelText('Feedback').tagName).toBe('TEXTAREA');
  });

  it('shows a required marker and marks the field as aria-required', () => {
    render(<FormField id="name" label="Name" value="" onChange={vi.fn()} required />);

    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/)).toHaveAttribute('aria-required', 'true');
  });

  it('shows hint text next to the label', () => {
    render(
      <FormField id="country" label="Country" value="" onChange={vi.fn()} hint="(optional)" />,
    );

    expect(screen.getByText('(optional)')).toBeInTheDocument();
  });

  it('shows and associates an inline error message when present', () => {
    render(
      <FormField
        id="name"
        label="Name"
        value=""
        onChange={vi.fn()}
        required
        error="Please enter your name."
      />,
    );

    const input = screen.getByLabelText(/Name/);
    const error = screen.getByRole('alert');

    expect(error).toHaveTextContent('Please enter your name.');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', error.id);
  });

  it('omits the error message and aria-invalid when there is no error', () => {
    render(<FormField id="name" label="Name" value="Sven" onChange={vi.fn()} />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'false');
  });
});
