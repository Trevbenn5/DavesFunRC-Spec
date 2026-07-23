import type { ComponentChildren, JSX } from 'preact';
import { createContext } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';

interface RouterContextValue {
  path: string;
  navigate: (path: string) => void;
}

const RouterContext = createContext<RouterContextValue | undefined>(
  undefined,
);

function getCurrentPath(): string {
  return window.location.pathname || '/';
}

export function RouterProvider({
  children,
}: {
  children: ComponentChildren;
}) {
  const [path, setPath] = useState(getCurrentPath());

  useEffect(() => {
    const onPopState = () => setPath(getCurrentPath());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (nextPath: string) => {
    if (nextPath !== window.location.pathname) {
      window.history.pushState(null, '', nextPath);
    }
    setPath(nextPath);
    window.scrollTo(0, 0);
  };

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

export function Link({
  to,
  children,
  onClick: onClickProp,
  ...rest
}: { to: string; children: ComponentChildren } & Omit<
  JSX.HTMLAttributes<HTMLAnchorElement>,
  'href'
>) {
  const { navigate } = useRouter();

  const onClick = (event: JSX.TargetedMouseEvent<HTMLAnchorElement>) => {
    onClickProp?.(event);
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
    navigate(to);
  };

  return (
    <a href={to} onClick={onClick} {...rest}>
      {children}
    </a>
  );
}
