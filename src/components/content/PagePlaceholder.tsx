import type { ComponentChildren } from 'preact';
import './PagePlaceholder.css';

export function PagePlaceholder({
  title,
  children,
}: {
  title: string;
  children?: ComponentChildren;
}) {
  return (
    <div className="page-placeholder">
      <h1>{title}</h1>
      {children ?? <p>This page is coming soon.</p>}
    </div>
  );
}
