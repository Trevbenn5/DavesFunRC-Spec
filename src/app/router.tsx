import {
  createContext,
  type ComponentChildren,
  type JSX,
} from 'preact';
import { useContext, useEffect, useState, useCallback } from 'preact/hooks';

interface RouterContextValue {
  path: string;
  navigate: (path: string) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

function normalise(path: string): string {
  if (path.length > 1 && path.endsWith('/')) {
    return path.slice(0, -1);
  }
  return path;
}

export function RouterProvider({ children }: { children: ComponentChildren }) {
  const [path, setPath] = useState(() => normalise(window.location.pathname));

  useEffect(() => {
    const onPopState = () => setPath(normalise(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((next: string) => {
    const target = normalise(next);
    if (target !== normalise(window.location.pathname)) {
      window.history.pushState(null, '', target);
    }
    setPath(target);
    window.scrollTo(0, 0);
  }, []);

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter(): RouterContextValue {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}

interface LinkProps extends Omit<JSX.HTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
}

export function Link({ href, onClick, children, ...rest }: LinkProps) {
  const { navigate } = useRouter();

  const handleClick = (event: JSX.TargetedMouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    navigate(href);
  };

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}

export { normalise as normalisePath };
