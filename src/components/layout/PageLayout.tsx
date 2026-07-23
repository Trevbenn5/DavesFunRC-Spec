import type { ComponentChildren } from 'preact';
import './PageLayout.css';

export function PageLayout({ children }: { children: ComponentChildren }) {
  return <main className="page-layout container">{children}</main>;
}
