import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { AboutPage } from './AboutPage';

describe('AboutPage', () => {
  it('renders exactly one H1 reading "About"', () => {
    render(<AboutPage />);
    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent('About');
  });

  it('renders the verbatim opening and closing lines from product.md', () => {
    render(<AboutPage />);
    expect(
      screen.getByText('This site is all about having fun with RC planes—without spending a fortune.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Thanks for stopping by, and happy flying!')).toBeInTheDocument();
  });

  it('renders all 12 paragraphs from the About section', () => {
    const { container } = render(<AboutPage />);
    expect(container.querySelectorAll('p')).toHaveLength(12);
  });
});
