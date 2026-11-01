import rawContent from './home-weekly-update.md?raw';

export interface HomeWeeklyUpdate {
  heading: string;
  body: string[];
}

export function parseWeeklyUpdate(markdown: string): HomeWeeklyUpdate {
  const normalizeText = (value: string) => value.replace(/\s+/g, ' ').trim();

  const [headingBlock = '', ...bodyBlocks] = markdown
    .trim()
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  const headingLines = headingBlock
    .split(/\n/)
    .map((line) => normalizeText(line))
    .filter(Boolean);

  const heading = headingLines[0]?.replace(/^#\s*/, '') ?? '';
  const body = [...headingLines.slice(1), ...bodyBlocks]
    .map((paragraph) => normalizeText(paragraph))
    .filter(Boolean);

  return { heading, body };
}

export const homeWeeklyUpdate: HomeWeeklyUpdate = parseWeeklyUpdate(rawContent);
