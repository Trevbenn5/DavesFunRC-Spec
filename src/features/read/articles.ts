import type { ReadArticle } from './read.types';

function titleFromSlug(slug: string): string {
  return slug
    .replace(/[-_]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Pairs PDF/image files sharing a basename into articles. Exported so
 * articles.test.ts can exercise the pairing/title-casing/sort rules with
 * synthetic entries, without depending on import.meta.glob at test time.
 */
export function buildArticles(entries: Record<string, string>): ReadArticle[] {
  const pdfBySlug = new Map<string, string>();
  const thumbnailBySlug = new Map<string, string>();

  for (const [path, url] of Object.entries(entries)) {
    const fileName = path.slice(path.lastIndexOf('/') + 1);
    const lastDot = fileName.lastIndexOf('.');
    if (lastDot === -1) continue;

    const slug = fileName.slice(0, lastDot);
    const extension = fileName.slice(lastDot + 1).toLowerCase();

    if (extension === 'pdf') {
      pdfBySlug.set(slug, url);
    } else if (extension === 'jpg' || extension === 'jpeg') {
      thumbnailBySlug.set(slug, url);
    }
  }

  const articles: ReadArticle[] = [];

  for (const [slug, pdfUrl] of pdfBySlug) {
    const thumbnailUrl = thumbnailBySlug.get(slug);
    if (!thumbnailUrl) continue;

    articles.push({ slug, title: titleFromSlug(slug), pdfUrl, thumbnailUrl });
  }

  return articles.sort((a, b) => a.title.localeCompare(b.title));
}

const articleFiles = import.meta.glob('/src/assets/read/*.{pdf,PDF,jpg,jpeg,JPG,JPEG}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

export const readArticles: ReadArticle[] = buildArticles(articleFiles);
