import { describe, expect, it } from 'vitest';
import { buildArticles } from './articles';

describe('buildArticles', () => {
  it('pairs a PDF and JPG sharing a basename into an article', () => {
    const articles = buildArticles({
      '/src/assets/read/foam-wing-sheeting.pdf': 'https://cdn/foam-wing-sheeting.pdf',
      '/src/assets/read/foam-wing-sheeting.jpg': 'https://cdn/foam-wing-sheeting.jpg',
    });

    expect(articles).toEqual([
      {
        slug: 'foam-wing-sheeting',
        title: 'Foam Wing Sheeting',
        pdfUrl: 'https://cdn/foam-wing-sheeting.pdf',
        thumbnailUrl: 'https://cdn/foam-wing-sheeting.jpg',
      },
    ]);
  });

  it('title-cases hyphens and underscores in the slug', () => {
    const articles = buildArticles({
      '/src/assets/read/cad_design_basics.pdf': 'https://cdn/a.pdf',
      '/src/assets/read/cad_design_basics.jpg': 'https://cdn/a.jpg',
    });

    expect(articles[0].title).toBe('Cad Design Basics');
  });

  it('excludes a PDF with no matching JPG', () => {
    const articles = buildArticles({
      '/src/assets/read/orphan-pdf.pdf': 'https://cdn/orphan-pdf.pdf',
    });

    expect(articles).toEqual([]);
  });

  it('excludes a JPG with no matching PDF', () => {
    const articles = buildArticles({
      '/src/assets/read/orphan-jpg.jpg': 'https://cdn/orphan-jpg.jpg',
    });

    expect(articles).toEqual([]);
  });

  it('matches extensions case-insensitively', () => {
    const articles = buildArticles({
      '/src/assets/read/getting-started.PDF': 'https://cdn/getting-started.PDF',
      '/src/assets/read/getting-started.JPG': 'https://cdn/getting-started.JPG',
    });

    expect(articles).toHaveLength(1);
    expect(articles[0].title).toBe('Getting Started');
  });

  it('sorts articles alphabetically by title', () => {
    const articles = buildArticles({
      '/src/assets/read/wing-repair.pdf': 'https://cdn/wing-repair.pdf',
      '/src/assets/read/wing-repair.jpg': 'https://cdn/wing-repair.jpg',
      '/src/assets/read/battery-safety.pdf': 'https://cdn/battery-safety.pdf',
      '/src/assets/read/battery-safety.jpg': 'https://cdn/battery-safety.jpg',
    });

    expect(articles.map((article) => article.title)).toEqual(['Battery Safety', 'Wing Repair']);
  });

  it('returns an empty array when no files are present', () => {
    expect(buildArticles({})).toEqual([]);
  });
});
