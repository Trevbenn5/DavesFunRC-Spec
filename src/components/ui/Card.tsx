import type { ComponentChildren } from 'preact';
import './Card.css';

export interface CardProps {
  title: string;
  summary: string;
  action?: ComponentChildren;
}

export function Card({ title, summary, action }: CardProps) {
  return (
    <article className="card">
      <h3 className="card__title">{title}</h3>
      <p className="card__summary">{summary}</p>
      {action ? <div className="card__action">{action}</div> : null}
    </article>
  );
}
