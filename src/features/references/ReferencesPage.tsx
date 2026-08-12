import './ReferencesPage.css';
import { referenceCategories } from '../../data/references';
import { Button } from '../../components/ui/Button';

export function ReferencesPage() {
  return (
    <div className="container references-page">
      <h1>References</h1>

      <p className="references-page__intro">
        A curated list of sites, flying clubs, YouTube channels and other resources I find
        useful for the RC hobby.
      </p>

      {referenceCategories.length > 0 && (
        <div className="references-page__categories">
          {referenceCategories.map((category) => (
            <section key={category.category} className="references-page__category">
              <h2>{category.category}</h2>
              <ul className="references-page__list">
                {category.links.map((link) => (
                  <li key={link.url} className="references-page__link">
                    <Button href={link.url} variant="tertiary">
                      {link.title}
                    </Button>
                    {link.note && <p className="references-page__note">{link.note}</p>}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {referenceCategories.length === 0 && (
        <div className="references-page__empty">
          <p>No references have been added yet — check back soon.</p>
          <Button href="/" variant="secondary">
            Back to Home
          </Button>
        </div>
      )}
    </div>
  );
}
