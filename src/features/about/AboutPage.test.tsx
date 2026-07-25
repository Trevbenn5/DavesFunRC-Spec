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

  it('renders the three story photos with descriptive alt text', () => {
    render(<AboutPage />);

    expect(screen.getByAltText(/Dave, smiling outdoors on a coastal walk/)).toBeInTheDocument();
    expect(
      screen.getByAltText(/launching a slope-soaring glider from a coastal cliff/),
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(/riding his bike to the flying field with a plane packed/),
    ).toBeInTheDocument();
  });

  it('captions the two inline story photos', () => {
    render(<AboutPage />);

    expect(screen.getByText('Slope soaring on the coast')).toBeInTheDocument();
    expect(screen.getByText('Budget-friendly and portable — no car required')).toBeInTheDocument();
  });
});
