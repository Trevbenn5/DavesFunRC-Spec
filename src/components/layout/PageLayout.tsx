import type { ComponentChildren } from 'preact';
import { SiteHeader } from './SiteHeader';
import { SiteFooter } from './SiteFooter';
import './PageLayout.css';

interface PageLayoutProps {
  children: ComponentChildren;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <>
      <a href="#main-content" class="visually-hidden">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content" class="page-layout__main">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
