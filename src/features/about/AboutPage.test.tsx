import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { AboutPage } from './AboutPage';

describe('AboutPage', () => {
  it('renders the page heading', () => {
    render(<AboutPage />);

    expect(screen.getByRole('heading', { level: 1, name: 'About' })).toBeInTheDocument();
  });

  it('renders the full story, in order, as separate paragraphs', () => {
    render(<AboutPage />);

    const paragraphs = screen.getAllByText(/./, { selector: 'p' });

    expect(paragraphs).toHaveLength(12);
    expect(paragraphs[0]).toHaveTextContent(
      'This site is all about having fun with RC planes—without spending a fortune.',
    );
    expect(paragraphs[paragraphs.length - 1]).toHaveTextContent(
      'Thanks for stopping by, and happy flying!',
    );
  });

  it('no longer shows the placeholder copy', () => {
    render(<AboutPage />);

    expect(screen.queryByText(/coming soon/i)).not.toBeInTheDocument();
  });
});
