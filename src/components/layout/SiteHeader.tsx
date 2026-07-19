import { Link } from '../../app/router';
import { MainNavigation } from '../navigation/MainNavigation';
import './SiteHeader.css';

export function SiteHeader() {
  return (
    <header class="site-header">
      <div class="site-header__inner">
        <Link href="/" class="site-header__brand">
          DavesFunRC
        </Link>
        <MainNavigation />
      </div>
    </header>
  );
}
