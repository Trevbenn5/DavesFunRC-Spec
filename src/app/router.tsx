import { createContext } from 'preact';
import type { ComponentChildren } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { routes, type RouteDefinition } from './routes';
import { trackPageView } from '../services/analytics.service';

interface RouterContextValue {
  path: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

function normalise(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname || '/';
}

export function RouterProvider({ children }: { children: ComponentChildren }) {
  const [path, setPath] = useState(() => normalise(window.location.pathname));

  useEffect(() => {
    const onPopState = () => setPath(normalise(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Runs for the initial path and every subsequent change (navigate()
  // and popstate alike, since both update `path`), covering FR-003,
  // FR-004 and FR-008 (404s are just an unmatched path, tracked the
  // same way) from the Google Analytics Tracking feature spec.
  useEffect(() => {
    trackPageView(path);
  }, [path]);

  const navigate = (to: string) => {
    const target = normalise(to);
    if (target !== normalise(window.location.pathname)) {
      window.history.pushState(null, '', target);
      setPath(target);
      window.scrollTo(0, 0);
    }
  };

  return <RouterContext.Provider value={{ path, navigate }}>{children}</RouterContext.Provider>;
}

export function useRouter(): RouterContextValue {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}

export function matchRoute(path: string): RouteDefinition | undefined {
  return routes.find((route) => route.path === path);
}
