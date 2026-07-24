import type { ComponentChildren } from 'preact';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';

export function PageLayout({ children }: { children: ComponentChildren }) {
  return (
    <div className="page-layout">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </div>
  );
}
