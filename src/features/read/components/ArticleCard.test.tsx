import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { ArticleCard } from './ArticleCard';
import type { ReadArticle } from '../read.types';

const article: ReadArticle = {
  slug: 'foam-wing-sheeting',
  title: 'Foam Wing Sheeting',
  pdfUrl: 'https://cdn/foam-wing-sheeting.pdf',
  thumbnailUrl: 'https://cdn/foam-wing-sheeting.jpg',
};

describe('ArticleCard', () => {
  it('renders the title, a described thumbnail, and a link that opens the PDF in a new tab', () => {
    render(<ArticleCard article={article} />);

    expect(
      screen.getByRole('heading', { level: 3, name: 'Foam Wing Sheeting' }),
    ).toBeInTheDocument();

    const thumbnail = screen.getByAltText('Preview of the Foam Wing Sheeting article');
    expect(thumbnail).toHaveAttribute('src', 'https://cdn/foam-wing-sheeting.jpg');

    const link = screen.getByRole('link', {
      name: 'Read "Foam Wing Sheeting" (opens PDF in a new tab)',
    });
    expect(link).toHaveAttribute('href', 'https://cdn/foam-wing-sheeting.pdf');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
