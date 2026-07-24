import './SiteHeader.css';
import { MainNavigation } from '../navigation/MainNavigation';
import { useRouter } from '../../app/router';
import { siteConfig } from '../../app/app-config';
import planeLogo from '../../assets/brand/plane-logo.png';

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
          <img className="site-header__logo-icon" src={planeLogo} alt="" />
          {siteConfig.name}
        </a>
        <MainNavigation />
      </div>
    </header>
  );
}
