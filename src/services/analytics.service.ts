declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

// Google Tag Manager's own snippet in index.html owns loading the
// container and creating window.dataLayer. This module's only job is
// the "virtual pageview" push GTM needs on client-side route changes,
// since its base snippet only fires once, on initial page load.
export function trackPageView(path: string): void {
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: 'page_view', page_path: path });
}
