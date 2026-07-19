import { useState } from 'preact/hooks';
import { Link, useRouter } from '../../app/router';
import { routes } from '../../app/routes';
import './MainNavigation.css';

export function MainNavigation() {
  const { path } = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav class="main-nav" aria-label="Main">
      <button
        type="button"
        class="main-nav__toggle"
        aria-expanded={isOpen}
        aria-controls="main-nav-list"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span class="visually-hidden">Toggle menu</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 6h16M4 12h16M4 18h16"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>
      <ul class="main-nav__list" id="main-nav-list" data-open={isOpen}>
        {routes.map((route) => (
          <li key={route.path}>
            <Link
              href={route.path}
              class="main-nav__link"
              aria-current={path === route.path ? 'page' : undefined}
              onClick={() => setIsOpen(false)}
            >
              {route.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
