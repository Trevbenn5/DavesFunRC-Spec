declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
  }
}

// Stable id used as the idempotency guard (FR-006, and the "duplicate
// initialisation" edge case in the spec) instead of in-memory module
// state, so a dev-mode HMR reload can't inject the script twice either.
const SCRIPT_ID = 'ga4-gtag-script';

export function initAnalytics(): void {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

  if (!measurementId) {
    return;
  }

  if (document.getElementById(SCRIPT_ID)) {
    return;
  }

  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer ?? [];
  window.gtag =
    window.gtag ??
    function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    };

  window.gtag('js', new Date());
  // send_page_view is disabled here because trackPageView() reports the
  // initial page view itself (see the router), avoiding a double count.
  window.gtag('config', measurementId, { send_page_view: false });
}

export function trackPageView(path: string): void {
  if (!window.gtag) {
    return;
  }

  window.gtag('event', 'page_view', { page_path: path });
}
