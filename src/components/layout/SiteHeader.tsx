import './SiteHeader.css';
import { MainNavigation } from '../navigation/MainNavigation';
import { useRouter } from '../../app/router';
import { siteConfig } from '../../app/app-config';

export function SiteHeader() {
  const { navigate } = useRouter();

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a
          href="/"
          className="site-header__logo brand-wordmark"
          onClick={(event) => {
            event.preventDefault();
            navigate('/');
          }}
        >
          {siteConfig.name}
        </a>
        <MainNavigation />
      </div>
    </header>
  );
}
