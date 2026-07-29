import './HomePage.css';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { WeeklyUpdate } from './components/WeeklyUpdate';
import { VideoCard } from './components/VideoCard';
import { useLatestVideos } from './useLatestVideos';
import { siteConfig } from '../../app/app-config';
import bannerImage from '../../assets/home/banner.jpg';

const LATEST_VIDEO_COUNT = 6;

const highlights = [
  {
    title: 'Watch',
    description:
      'Browse builds, maiden flights and slope soaring sessions from the DavesFunRC YouTube channel, sorted into playlists.',
    href: '/videos',
    actionLabel: 'Browse videos',
  },
  {
    title: 'Read',
    description:
      'How-to articles on construction techniques, CAD design, 3D printing and getting started in the hobby.',
    href: '/about',
    actionLabel: 'Learn more',
  },
  {
    title: 'Build',
    description:
      'Grab 3D-printable designs from Cults3D, Ko-Fi and Tinkercad, and see what projects are planned next.',
    href: '/3d-designs',
    actionLabel: 'See 3D designs',
  },
] as const;

export function HomePage() {
  const videosState = useLatestVideos(LATEST_VIDEO_COUNT);

  return (
    <div className="home-page">
      <img className="home-banner" src={bannerImage} alt="" />

      <section className="home-hero-row container">
        <div className="home-hero">
          <h1 className="brand-wordmark">G'day, welcome to DavesFunRC</h1>
          <p className="home-hero__lede">
            Store-bought planes, scratch builds and the odd slope-soaring adventure — this
            is the home for everything alongside the {siteConfig.name} YouTube channel.
          </p>
        </div>

        <WeeklyUpdate />
      </section>

      <section className="home-highlights container" aria-label="What to expect">
        {highlights.map((highlight) => (
          <Card
            key={highlight.title}
            title={highlight.title}
            summary={highlight.description}
            actionLabel={highlight.actionLabel}
            href={highlight.href}
          />
        ))}
      </section>

      <section className="home-videos container">
        <h2>Latest videos</h2>

        {videosState.status === 'loading' && (
          <>
            <p className="visually-hidden" role="status">
              Loading latest videos…
            </p>
            <div className="home-videos__grid" aria-hidden="true">
              {Array.from({ length: LATEST_VIDEO_COUNT }).map((_, index) => (
                <div className="home-video-skeleton" key={index} />
              ))}
            </div>
          </>
        )}

        {videosState.status === 'loaded' && videosState.videos.length > 0 && (
          <div className="home-videos__grid">
            {videosState.videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}

        {videosState.status === 'loaded' && videosState.videos.length === 0 && (
          <div className="home-videos__empty">
            <p>No videos yet — check back soon.</p>
            <Button href={siteConfig.externalLinks.youtube} variant="secondary">
              Visit the YouTube channel
            </Button>
          </div>
        )}

        {videosState.status === 'error' && (
          <div className="home-videos__empty">
            <p>
              We couldn&apos;t load the latest videos right now. You can always check them
              directly on the DavesFunRC YouTube channel.
            </p>
            <Button href={siteConfig.externalLinks.youtube} variant="secondary">
              Visit the YouTube channel
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
