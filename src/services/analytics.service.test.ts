import { afterEach, describe, expect, it } from 'vitest';
import { trackPageView } from './analytics.service';

afterEach(() => {
  delete window.dataLayer;
});

describe('analytics.service', () => {
  it('pushes a page_view event with the given path onto window.dataLayer', () => {
    trackPageView('/about');

    expect(window.dataLayer).toContainEqual({ event: 'page_view', page_path: '/about' });
  });

  it('initialises window.dataLayer if GTM has not created it yet', () => {
    expect(window.dataLayer).toBeUndefined();

    trackPageView('/videos');

    expect(window.dataLayer).toEqual([{ event: 'page_view', page_path: '/videos' }]);
  });

  it('appends to an existing dataLayer (e.g. GTM bootstrap entries) rather than replacing it', () => {
    window.dataLayer = [{ 'gtm.start': 0, event: 'gtm.js' }];

    trackPageView('/suggestions');

    expect(window.dataLayer).toEqual([
      { 'gtm.start': 0, event: 'gtm.js' },
      { event: 'page_view', page_path: '/suggestions' },
    ]);
  });
});
