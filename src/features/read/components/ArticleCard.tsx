import './ArticleCard.css';
import type { ReadArticle } from '../read.types';

interface ArticleCardProps {
  article: ReadArticle;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <a
      className="article-card"
      href={article.pdfUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Read "${article.title}" (opens PDF in a new tab)`}
    >
      <img
        className="article-card__thumbnail"
        src={article.thumbnailUrl}
        alt={`Preview of the ${article.title} article`}
      />
      <h3 className="article-card__title">{article.title}</h3>
    </a>
  );
}
