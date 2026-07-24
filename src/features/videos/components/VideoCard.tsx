import './VideoCard.css';
import { Button } from '../../../components/ui/Button';
import type { VideoSummary } from '../videos.types';

interface VideoCardProps {
  video: VideoSummary;
}

function formatPublishedDate(iso: string): string {
  const published = new Date(iso);
  const days = Math.floor((Date.now() - published.getTime()) / (1000 * 60 * 60 * 24));

  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;

  return published.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <article className="video-card">
      <img
        className="video-card__thumbnail"
        src={video.thumbnailUrl}
        alt={`${video.title} — DavesFunRC`}
      />
      <h3>{video.title}</h3>
      <p className="video-card__date">{formatPublishedDate(video.publishedAt)}</p>
      <Button
        href={video.watchUrl}
        variant="tertiary"
        aria-label={`Watch "${video.title}" on YouTube`}
      >
        Watch on YouTube
      </Button>
    </article>
  );
}
