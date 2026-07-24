import './VideosPage.css';
import { useLatestVideos } from './useLatestVideos';
import { VideoCard } from './components/VideoCard';
import { Button } from '../../components/ui/Button';
import { siteConfig } from '../../app/app-config';

const LATEST_VIDEO_COUNT = 3;

export function VideosPage() {
  const state = useLatestVideos(LATEST_VIDEO_COUNT);

  return (
    <div className="container videos-page">
      <h1>Videos</h1>
      <h2>Latest videos</h2>

      {state.status === 'loading' && (
        <>
          <p className="visually-hidden" role="status">
            Loading latest videos…
          </p>
          <div className="videos-page__grid" aria-hidden="true">
            {Array.from({ length: LATEST_VIDEO_COUNT }).map((_, index) => (
              <div className="video-card-skeleton" key={index} />
            ))}
          </div>
        </>
      )}

      {state.status === 'loaded' && state.videos.length > 0 && (
        <div className="videos-page__grid">
          {state.videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}

      {state.status === 'loaded' && state.videos.length === 0 && (
        <div className="videos-page__empty">
          <p>No videos yet — check back soon.</p>
          <Button href={siteConfig.externalLinks.youtube} variant="secondary">
            Visit the YouTube channel
          </Button>
        </div>
      )}

      {state.status === 'error' && (
        <div className="videos-page__empty">
          <p>
            We couldn&apos;t load the latest videos right now. You can always check them
            directly on the DavesFunRC YouTube channel.
          </p>
          <Button href={siteConfig.externalLinks.youtube} variant="secondary">
            Visit the YouTube channel
          </Button>
        </div>
      )}
    </div>
  );
}
