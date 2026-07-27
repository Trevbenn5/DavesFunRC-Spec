import rawContent from './home-weekly-update.md?raw';

export interface HomeWeeklyUpdate {
  heading: string;
  body: string[];
}

export function parseWeeklyUpdate(markdown: string): HomeWeeklyUpdate {
  const [headingBlock, ...bodyBlocks] = markdown
    .trim()
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return {
    heading: headingBlock.replace(/^#\s*/, ''),
    body: bodyBlocks,
  };
}

export const homeWeeklyUpdate: HomeWeeklyUpdate = parseWeeklyUpdate(rawContent);
