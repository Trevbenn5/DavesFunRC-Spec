import { siteConfig } from '../../app/app-config';
import './SiteFooter.css';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner container">
        <p>
          &copy; {year} {siteConfig.name}
        </p>
        <ul className="site-footer__links">
          <li>
            <a href={siteConfig.youtubeUrl} target="_blank" rel="noreferrer">
              YouTube
            </a>
          </li>
          <li>
            <a href={siteConfig.cults3dUrl} target="_blank" rel="noreferrer">
              Cults3D
            </a>
          </li>
          <li>
            <a href={siteConfig.koFiUrl} target="_blank" rel="noreferrer">
              Ko-fi
            </a>
          </li>
          <li>
            <a
              href={siteConfig.tinkercadUrl}
              target="_blank"
              rel="noreferrer"
            >
              Tinkercad
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
