import { PageLayout } from '../components/layout/PageLayout';
import { ErrorBoundary } from '../components/layout/ErrorBoundary';
import { NotFoundPage } from '../components/content/NotFoundPage';
import { RouterProvider, matchRoute, useRouter } from './router';

function RouteOutlet() {
  const { path } = useRouter();
  const route = matchRoute(path);

  if (!route) {
    return <NotFoundPage />;
  }

  const { Component } = route;
  return <Component />;
}

export function App() {
  return (
    <RouterProvider>
      <PageLayout>
        <ErrorBoundary>
          <RouteOutlet />
        </ErrorBoundary>
      </PageLayout>
    </RouterProvider>
  );
}
