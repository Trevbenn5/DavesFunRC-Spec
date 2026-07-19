import type { ComponentChildren } from 'preact';
import './Card.css';

interface CardProps {
  title: string;
  summary?: string;
  action?: ComponentChildren;
  children?: ComponentChildren;
}

export function Card({ title, summary, action, children }: CardProps) {
  return (
    <div class="card">
      <h3 class="card__title">{title}</h3>
      {summary && <p class="card__summary">{summary}</p>}
      {children}
      {action && <div class="card__action">{action}</div>}
    </div>
  );
}
