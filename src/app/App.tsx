import { RouterProvider, useRouter } from './router';
import { PageLayout } from '../components/layout/PageLayout';
import { PagePlaceholder } from '../components/content/PagePlaceholder';
import { NotFoundPage } from '../components/content/NotFoundPage';
import { HomePage } from '../features/home/HomePage';

function CurrentPage() {
  const { path } = useRouter();

  switch (path) {
    case '/':
      return <HomePage />;
    case '/videos':
      return <PagePlaceholder title="Videos" />;
    case '/3d-designs':
      return <PagePlaceholder title="3D Designs" />;
    case '/about':
      return <PagePlaceholder title="About" />;
    default:
      return <NotFoundPage />;
  }
}

export function App() {
  return (
    <RouterProvider>
      <PageLayout>
        <CurrentPage />
      </PageLayout>
    </RouterProvider>
  );
}
