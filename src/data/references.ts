import rawContent from './references.md?raw';

export interface ReferenceLink {
  title: string;
  url: string;
  note?: string;
}

export interface ReferenceCategory {
  category: string;
  links: ReferenceLink[];
}

const CATEGORY_LINE = /^##\s+(.+?)\s*$/;
// Matches "- [Title](url)" with an optional " — note" / " -- note" suffix.
// The note separator must be surrounded by whitespace so it never matches a
// bare hyphen inside the URL or title.
const BULLET_LINE = /^-\s*\[([^\]]+)\]\((\S+)\)(?:\s+(?:—|--)\s+(.+))?\s*$/;

export function parseReferences(markdown: string): ReferenceCategory[] {
  const withoutComments = markdown.replace(/<!--[\s\S]*?-->/g, '');
  const categories: ReferenceCategory[] = [];
  let current: ReferenceCategory | undefined;

  for (const rawLine of withoutComments.split('\n')) {
    const line = rawLine.trim();
    if (line.length === 0) continue;

    const categoryMatch = CATEGORY_LINE.exec(line);
    if (categoryMatch) {
      current = { category: categoryMatch[1].trim(), links: [] };
      categories.push(current);
      continue;
    }

    if (!current) continue;

    const bulletMatch = BULLET_LINE.exec(line);
    if (!bulletMatch) continue;

    const [, title, url, note] = bulletMatch;
    const link: ReferenceLink = { title: title.trim(), url: url.trim() };
    if (note) link.note = note.trim();
    current.links.push(link);
  }

  return categories.filter((category) => category.links.length > 0);
}

export const referenceCategories: ReferenceCategory[] = parseReferences(rawContent);
