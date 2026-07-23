import { Link } from '../../app/router';
import { PagePlaceholder } from './PagePlaceholder';

export function NotFoundPage() {
  return (
    <PagePlaceholder title="Page not found">
      <p>The page you're looking for doesn't exist or may have moved.</p>
      <p>
        <Link to="/">Back to Home</Link>
      </p>
    </PagePlaceholder>
  );
}
