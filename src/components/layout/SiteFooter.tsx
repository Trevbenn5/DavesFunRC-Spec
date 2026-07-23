import './SiteFooter.css';
import { siteConfig } from '../../app/app-config';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p>
          © {year} {siteConfig.name}. Built by Dave from Downunder.
        </p>
        <ul className="site-footer__links" role="list">
          <li>
            <a href={siteConfig.externalLinks.youtube} target="_blank" rel="noopener noreferrer">
              YouTube
            </a>
          </li>
          <li>
            <a href={siteConfig.externalLinks.cults3d} target="_blank" rel="noopener noreferrer">
              Cults3D
            </a>
          </li>
          <li>
            <a href={siteConfig.externalLinks.koFi} target="_blank" rel="noopener noreferrer">
              Ko-Fi
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
