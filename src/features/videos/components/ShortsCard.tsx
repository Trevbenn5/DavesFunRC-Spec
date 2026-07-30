import { SquarePlay } from 'lucide-preact';
import './ShortsCard.css';
import { Button } from '../../../components/ui/Button';
import { siteConfig } from '../../../app/app-config';

export function ShortsCard() {
  return (
    <article className="playlist-card shorts-card">
      <div className="shorts-card__icon" aria-hidden="true">
        <SquarePlay size={40} />
      </div>
      <h3>YouTube Shorts</h3>
      <Button
        href={siteConfig.externalLinks.youtubeShorts}
        variant="tertiary"
        aria-label="Watch DavesFunRC Shorts on YouTube"
      >
        Watch Shorts
      </Button>
    </article>
  );
}
