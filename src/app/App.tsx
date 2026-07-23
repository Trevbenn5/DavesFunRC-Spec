import { NotFoundPage } from '../components/content/NotFoundPage';
import { PagePlaceholder } from '../components/content/PagePlaceholder';
import { PageLayout } from '../components/layout/PageLayout';
import { SiteFooter } from '../components/layout/SiteFooter';
import { SiteHeader } from '../components/layout/SiteHeader';
import { HomePage } from '../features/home/HomePage';
import { RouterProvider, useRouter } from './router';

function PageContent() {
  const { path } = useRouter();

  switch (path) {
    case '/':
      return <HomePage />;
    case '/videos':
      return <PagePlaceholder title="Videos" />;
    case '/3d-designs':
      return <PagePlaceholder title="3D Designs" />;
    case '/suggestions':
      return <PagePlaceholder title="Suggestions" />;
    case '/about':
      return <PagePlaceholder title="About" />;
    default:
      return <NotFoundPage />;
  }
}

export function App() {
  return (
    <RouterProvider>
      <SiteHeader />
      <PageLayout>
        <PageContent />
      </PageLayout>
      <SiteFooter />
    </RouterProvider>
  );
}
