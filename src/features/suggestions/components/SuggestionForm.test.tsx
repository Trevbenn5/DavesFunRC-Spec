import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
import { RouterProvider } from '../../../app/router';
import { SuggestionForm } from './SuggestionForm';

function renderForm() {
  return render(
    <RouterProvider>
      <SuggestionForm />
    </RouterProvider>,
  );
}

function typeInto(label: string, value: string) {
  fireEvent.input(screen.getByLabelText(label), { target: { value } });
}

describe('SuggestionForm', () => {
  let originalLocation: Location;

  beforeEach(() => {
    originalLocation = window.location;
    // jsdom doesn't support real mailto: navigation; replace location with a
    // plain writable stub so the submit handler's assignment is observable.
    // RouterProvider itself reads window.location.pathname on mount, so that
    // needs to survive the stub too.
    Object.defineProperty(window, 'location', {
      value: { href: '', pathname: originalLocation.pathname },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true,
    });
  });

  it('blocks submission and shows inline errors when Name and Feedback are empty', () => {
    renderForm();

    fireEvent.click(screen.getByRole('button', { name: 'Send suggestion' }));

    expect(screen.getByText('Please enter your name.')).toBeInTheDocument();
    expect(screen.getByText('Please share your suggestion.')).toBeInTheDocument();
    expect(window.location.href).toBe('');
  });

  it('navigates to the composed mailto: URI on valid submit', () => {
    renderForm();

    typeInto('Name *', 'Sven');
    typeInto('Country (optional)', 'Sweden');
    typeInto(
      'Your suggestion *',
      "Hello, I'm from Sweden and I'd like a STOL aircraft with 4 motors.",
    );
    fireEvent.click(screen.getByRole('button', { name: 'Send suggestion' }));

    expect(window.location.href).toContain('mailto:trevbenn5@hotmail.com?');
    const body = decodeURIComponent(window.location.href.split('body=')[1]);
    expect(body).toBe(
      "Name: Sven\nCountry: Sweden\nFeedback: Hello, I'm from Sweden and I'd like a STOL aircraft with 4 motors.",
    );
  });

  it('omits the Country line when Country is left blank', () => {
    renderForm();

    typeInto('Name *', 'Sven');
    typeInto('Your suggestion *', 'Build a STOL plane');
    fireEvent.click(screen.getByRole('button', { name: 'Send suggestion' }));

    const body = decodeURIComponent(window.location.href.split('body=')[1]);
    expect(body).toBe('Name: Sven\nFeedback: Build a STOL plane');
  });

  it('clears a field error once the visitor fixes it and resubmits', () => {
    renderForm();

    fireEvent.click(screen.getByRole('button', { name: 'Send suggestion' }));
    expect(screen.getByText('Please enter your name.')).toBeInTheDocument();

    typeInto('Name *', 'Sven');
    typeInto('Your suggestion *', 'Build a STOL plane');
    fireEvent.click(screen.getByRole('button', { name: 'Send suggestion' }));

    expect(screen.queryByText('Please enter your name.')).not.toBeInTheDocument();
  });
});
