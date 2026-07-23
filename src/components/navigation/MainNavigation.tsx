import { Menu, X } from 'lucide-preact';
import { useState } from 'preact/hooks';
import { Link, useRouter } from '../../app/router';
import { routes } from '../../app/routes';
import './MainNavigation.css';

export function MainNavigation() {
  const { path } = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="main-navigation" aria-label="Main">
      <button
        type="button"
        className="main-navigation__toggle"
        aria-expanded={isOpen}
        aria-controls="main-navigation-menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        <span className="visually-hidden">
          {isOpen ? 'Close menu' : 'Open menu'}
        </span>
      </button>

      <ul
        id="main-navigation-menu"
        className={`main-navigation__list ${isOpen ? 'main-navigation__list--open' : ''}`}
      >
        {routes.map((route) => (
          <li key={route.path}>
            <Link
              to={route.path}
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
