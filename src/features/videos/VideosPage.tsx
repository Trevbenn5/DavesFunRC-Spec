import './VideosPage.css';
import { usePlaylists } from './usePlaylists';
import { PlaylistCard } from './components/PlaylistCard';
import { ShortsCard } from './components/ShortsCard';
import { Button } from '../../components/ui/Button';
import { siteConfig } from '../../app/app-config';

const TOP_PLAYLIST_COUNT = 5;

export function VideosPage() {
  const state = usePlaylists(TOP_PLAYLIST_COUNT);

  return (
    <div className="container videos-page">
      <h1>Videos</h1>
      <h2>Playlists</h2>

      {state.status === 'loading' && (
        <>
          <p className="visually-hidden" role="status">
            Loading playlists…
          </p>
          <div className="videos-page__grid" aria-hidden="true">
            {Array.from({ length: TOP_PLAYLIST_COUNT }).map((_, index) => (
              <div className="playlist-card-skeleton" key={index} />
            ))}
          </div>
        </>
      )}

      {state.status === 'loaded' && state.playlists.length > 0 && (
        <div className="videos-page__grid">
          {state.playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
          <ShortsCard />
        </div>
      )}

      {state.status === 'loaded' && state.playlists.length === 0 && (
        <div className="videos-page__empty">
          <p>No playlists yet — check back soon.</p>
          <Button href={siteConfig.externalLinks.youtube} variant="secondary">
            Visit the YouTube channel
          </Button>
        </div>
      )}

      {state.status === 'error' && (
        <div className="videos-page__empty">
          <p>
            We couldn&apos;t load the playlists right now. You can always browse them
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
