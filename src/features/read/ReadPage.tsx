import './ReadPage.css';
import { readArticles } from './articles';
import { ArticleCard } from './components/ArticleCard';
import { Button } from '../../components/ui/Button';

export function ReadPage() {
  return (
    <div className="container read-page">
      <h1>Read</h1>

      {readArticles.length > 0 && (
        <div className="read-page__grid">
          {readArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}

      {readArticles.length === 0 && (
        <div className="read-page__empty">
          <p>No how-to articles yet — check back soon.</p>
          <Button href="/" variant="secondary">
            Back to Home
          </Button>
        </div>
      )}
    </div>
  );
}
