import './Card.css';
import { Button } from './Button';

interface CardProps {
  title: string;
  summary: string;
  href: string;
  actionLabel: string;
}

export function Card({ title, summary, href, actionLabel }: CardProps) {
  return (
    <article className="card">
      <h3>{title}</h3>
      <p>{summary}</p>
      <Button href={href} variant="tertiary">
        {actionLabel}
      </Button>
    </article>
  );
}
