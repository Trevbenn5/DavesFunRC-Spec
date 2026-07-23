import { useState } from 'preact/hooks';
import { Menu, X } from 'lucide-preact';
import './MainNavigation.css';
import { routes } from '../../app/routes';
import { useRouter } from '../../app/router';

export function MainNavigation() {
  const { path, navigate } = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = routes.filter((route) => route.showInNav);

  const handleNavigate = (href: string) => (event: MouseEvent) => {
    event.preventDefault();
    setIsOpen(false);
    navigate(href);
  };

  return (
    <nav className="main-nav" aria-label="Main">
      <button
        type="button"
        className="main-nav__toggle"
        aria-expanded={isOpen}
        aria-controls="main-nav-list"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        <span className="visually-hidden">{isOpen ? 'Close menu' : 'Open menu'}</span>
      </button>
      <ul
        id="main-nav-list"
        className={`main-nav__list${isOpen ? ' main-nav__list--open' : ''}`}
        role="list"
      >
        {navItems.map((item) => {
          const isActive = path === item.path;
          return (
            <li key={item.path}>
              <a
                href={item.path}
                className="main-nav__link"
                aria-current={isActive ? 'page' : undefined}
                onClick={handleNavigate(item.path)}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
