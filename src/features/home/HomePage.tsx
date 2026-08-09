import './HomePage.css';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { WeeklyUpdate } from './components/WeeklyUpdate';
import { VideoCard } from './components/VideoCard';
import { useLatestVideos } from './useLatestVideos';
import { siteConfig } from '../../app/app-config';
import bannerImage from '../../assets/home/banner.jpg';
import daveLaunchingPlaneImage from '../../assets/home/dave-launching-plane.jpg';

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
    href: '/read',
    actionLabel: 'Read articles',
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
          <div className="home-hero__lede">
            <p>
              Thanks for dropping by! My passion is all about having fun with RC planes
              — I returned to this absorbing hobby in 2022, and I design, build and fly
              planes of all sizes, indoors and out, as well as slope soaring.
            </p>
            <div className="home-hero__list-block">
              <p>On this site you&apos;ll find:</p>
              <ul>
                <li>Links to my YouTube videos</li>
                <li>3D printer build designs (3D models)</li>
                <li>Technical articles to help new starters</li>
                <li>Suggestions on future projects are welcome…</li>
              </ul>
              <p>Enjoy!</p>
            </div>
          </div>
          <img
            className="home-hero__image"
            src={daveLaunchingPlaneImage}
            alt="Dave, wearing a helmet-mounted action camera, launching a red, white and yellow foam RC plane by hand across a grassy park"
          />
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
