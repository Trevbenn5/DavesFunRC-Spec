import { describe, expect, it } from 'vitest';
import { parseReferences } from './references';

describe('parseReferences', () => {
  it('groups links under their preceding category heading', () => {
    const result = parseReferences(
      '## Useful Sites\n\n- [RCGroups](https://www.rcgroups.com)\n\n## Flying Clubs\n\n- [MAAA](https://www.maaa.asn.au)',
    );

    expect(result).toEqual([
      { category: 'Useful Sites', links: [{ title: 'RCGroups', url: 'https://www.rcgroups.com' }] },
      { category: 'Flying Clubs', links: [{ title: 'MAAA', url: 'https://www.maaa.asn.au' }] },
    ]);
  });

  it('extracts an optional note after an em dash', () => {
    const result = parseReferences(
      '## Useful Sites\n\n- [Flite Test](https://www.flitetest.com) — Foam-board build plans and reviews.',
    );

    expect(result[0].links[0]).toEqual({
      title: 'Flite Test',
      url: 'https://www.flitetest.com',
      note: 'Foam-board build plans and reviews.',
    });
  });

  it('extracts an optional note after a double hyphen', () => {
    const result = parseReferences('## Useful Sites\n\n- [Flite Test](https://www.flitetest.com) -- Reviews.');

    expect(result[0].links[0].note).toBe('Reviews.');
  });

  it('accepts a bullet with no note', () => {
    const result = parseReferences('## Useful Sites\n\n- [RCGroups](https://www.rcgroups.com)');

    expect(result[0].links[0]).toEqual({ title: 'RCGroups', url: 'https://www.rcgroups.com' });
    expect(result[0].links[0].note).toBeUndefined();
  });

  it('skips a bullet that does not match the [Title](url) pattern without throwing', () => {
    const result = parseReferences(
      '## Useful Sites\n\n- Just some plain text, not a link\n- [RCGroups](https://www.rcgroups.com)',
    );

    expect(result[0].links).toEqual([{ title: 'RCGroups', url: 'https://www.rcgroups.com' }]);
  });

  it('omits a category that ends up with zero valid links', () => {
    const result = parseReferences(
      '## Empty Category\n\n- Not a valid bullet\n\n## Useful Sites\n\n- [RCGroups](https://www.rcgroups.com)',
    );

    expect(result).toEqual([
      { category: 'Useful Sites', links: [{ title: 'RCGroups', url: 'https://www.rcgroups.com' }] },
    ]);
  });

  it('ignores bullets that appear before any category heading', () => {
    const result = parseReferences('- [Orphan](https://example.com)\n\n## Useful Sites\n\n- [RCGroups](https://www.rcgroups.com)');

    expect(result).toEqual([
      { category: 'Useful Sites', links: [{ title: 'RCGroups', url: 'https://www.rcgroups.com' }] },
    ]);
  });

  it('ignores content inside HTML comments', () => {
    const result = parseReferences(
      '<!--\n## Hidden Category\n- [Hidden](https://example.com)\n-->\n\n## Useful Sites\n\n- [RCGroups](https://www.rcgroups.com)',
    );

    expect(result).toEqual([
      { category: 'Useful Sites', links: [{ title: 'RCGroups', url: 'https://www.rcgroups.com' }] },
    ]);
  });

  it('returns an empty array for empty input', () => {
    expect(parseReferences('')).toEqual([]);
  });

  it('returns an empty array when there are no valid categories or links', () => {
    expect(parseReferences('Just some prose with no headings or links.')).toEqual([]);
  });
});
