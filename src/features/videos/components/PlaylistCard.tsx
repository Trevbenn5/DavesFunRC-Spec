import './PlaylistCard.css';
import { Button } from '../../../components/ui/Button';
import type { PlaylistSummary } from '../videos.types';

interface PlaylistCardProps {
  playlist: PlaylistSummary;
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  return (
    <article className="playlist-card">
      <img
        className="playlist-card__thumbnail"
        src={playlist.thumbnailUrl}
        alt={`${playlist.title} — DavesFunRC`}
      />
      <h3>{playlist.title}</h3>
      <Button
        href={playlist.playlistUrl}
        variant="tertiary"
        aria-label={`View "${playlist.title}" playlist on YouTube`}
      >
        View playlist
      </Button>
    </article>
  );
}
