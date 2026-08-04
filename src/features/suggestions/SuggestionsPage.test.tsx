import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { RouterProvider } from '../../app/router';
import { SuggestionsPage } from './SuggestionsPage';

function renderPage() {
  return render(
    <RouterProvider>
      <SuggestionsPage />
    </RouterProvider>,
  );
}

describe('SuggestionsPage', () => {
  it('renders the page heading', () => {
    renderPage();

    expect(screen.getByRole('heading', { level: 1, name: 'Suggestions' })).toBeInTheDocument();
  });

  it('renders the welcoming introduction alongside a described portrait of Dave', () => {
    renderPage();

    expect(screen.getByText(/I'd love to hear your ideas/)).toBeInTheDocument();

    const portrait = screen.getByAltText(/Dave, smiling outdoors/);
    expect(portrait.tagName).toBe('IMG');
    expect(portrait.getAttribute('alt')).not.toBe('');
  });

  it('renders the suggestion form', () => {
    renderPage();

    expect(screen.getByLabelText('Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Country (optional)')).toBeInTheDocument();
    expect(screen.getByLabelText('Your suggestion *')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send suggestion' })).toBeInTheDocument();
  });

  it('no longer shows the placeholder copy', () => {
    renderPage();

    expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument();
  });
});
