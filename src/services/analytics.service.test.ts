import { afterEach, describe, expect, it, vi } from 'vitest';
import { initAnalytics, trackPageView } from './analytics.service';

function resetDom(): void {
  document.getElementById('ga4-gtag-script')?.remove();
  delete window.gtag;
  delete window.dataLayer;
}

describe('analytics.service', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    resetDom();
  });

  it('does not inject a script or define gtag when the measurement id is unset', () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', '');

    initAnalytics();

    expect(document.getElementById('ga4-gtag-script')).toBeNull();
    expect(window.gtag).toBeUndefined();
  });

  it('injects exactly one gtag.js script when a measurement id is configured', () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TEST123');

    initAnalytics();
    initAnalytics();
    initAnalytics();

    const scripts = document.head.querySelectorAll('script[id="ga4-gtag-script"]');
    expect(scripts).toHaveLength(1);
    expect(scripts[0].getAttribute('src')).toBe(
      'https://www.googletagmanager.com/gtag/js?id=G-TEST123',
    );
    expect((scripts[0] as HTMLScriptElement).async).toBe(true);
  });

  it('configures gtag with the measurement id and disables automatic page views', () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TEST123');

    initAnalytics();

    expect(window.dataLayer).toBeDefined();
    expect(window.dataLayer).toContainEqual(['config', 'G-TEST123', { send_page_view: false }]);
  });

  it('trackPageView sends a page_view event with the given path once initialised', () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TEST123');
    initAnalytics();

    trackPageView('/about');

    expect(window.dataLayer).toContainEqual([
      'event',
      'page_view',
      { page_path: '/about' },
    ]);
  });

  it('trackPageView is a safe no-op when analytics was never initialised', () => {
    expect(() => trackPageView('/videos')).not.toThrow();
    expect(window.dataLayer).toBeUndefined();
  });
});
