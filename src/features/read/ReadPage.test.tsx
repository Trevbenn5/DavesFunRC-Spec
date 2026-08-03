import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { RouterProvider } from '../../app/router';
import { ReadPage } from './ReadPage';
import type { ReadArticle } from './read.types';

const { mockArticles } = vi.hoisted(() => ({ mockArticles: [] as ReadArticle[] }));

vi.mock('./articles', () => ({
  get readArticles() {
    return mockArticles;
  },
}));

function setArticles(articles: ReadArticle[]) {
  mockArticles.length = 0;
  mockArticles.push(...articles);
}

function renderReadPage() {
  return render(
    <RouterProvider>
      <ReadPage />
    </RouterProvider>,
  );
}

describe('ReadPage', () => {
  it('renders the page heading', () => {
    setArticles([]);

    renderReadPage();

    expect(screen.getByRole('heading', { level: 1, name: 'Read' })).toBeInTheDocument();
  });

  it('renders one card per discovered article', () => {
    setArticles([
      {
        slug: 'foam-wing-sheeting',
        title: 'Foam Wing Sheeting',
        pdfUrl: 'https://cdn/foam-wing-sheeting.pdf',
        thumbnailUrl: 'https://cdn/foam-wing-sheeting.jpg',
      },
      {
        slug: 'battery-safety',
        title: 'Battery Safety',
        pdfUrl: 'https://cdn/battery-safety.pdf',
        thumbnailUrl: 'https://cdn/battery-safety.jpg',
      },
    ]);

    renderReadPage();

    expect(screen.getByRole('heading', { level: 3, name: 'Foam Wing Sheeting' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Battery Safety' })).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('shows an empty state with a link back to Home when no articles exist', () => {
    setArticles([]);

    renderReadPage();

    expect(screen.getByText('No how-to articles yet — check back soon.')).toBeInTheDocument();
    const backLink = screen.getByRole('link', { name: 'Back to Home' });
    expect(backLink).toHaveAttribute('href', '/');
  });
});
