import type { ComponentChildren } from 'preact';
import { Link } from '../../app/router';
import '../ui/Button.css';
import './PagePlaceholder.css';

interface PagePlaceholderProps {
  title: string;
  children?: ComponentChildren;
}

export function PagePlaceholder({ title, children }: PagePlaceholderProps) {
  return (
    <div class="page-placeholder">
      <h1>{title}</h1>
      <p class="page-placeholder__body">
        {children ?? 'This page is on the workbench and will be built out in a future update.'}
      </p>
      <Link href="/" class="button button--secondary">
        Back to Home
      </Link>
    </div>
  );
}
