import './PlaceholderPage.css';
import { Button } from '../ui/Button';

export function NotFoundPage() {
  return (
    <div className="container placeholder-page">
      <h1>Page not found</h1>
      <p>
        The page you were looking for doesn&apos;t exist, or may have moved. Use the
        navigation above, or head back to the homepage.
      </p>
      <div>
        <Button href="/">Back to Home</Button>
      </div>
    </div>
  );
}
