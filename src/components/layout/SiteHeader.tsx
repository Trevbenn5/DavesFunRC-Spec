import { Link } from '../../app/router';
import { MainNavigation } from '../navigation/MainNavigation';
import './SiteHeader.css';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner container">
        <Link to="/" className="site-header__wordmark brand-wordmark">
          DavesFunRC
        </Link>
        <MainNavigation />
      </div>
    </header>
  );
}
