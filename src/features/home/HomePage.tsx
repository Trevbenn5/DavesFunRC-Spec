import './HomePage.css';
import { Card } from '../../components/ui/Card';
import { siteConfig } from '../../app/app-config';

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
  return (
    <div className="home-page">
      <section className="home-hero container">
        <h1 className="brand-wordmark">G'day, welcome to DavesFunRC</h1>
        <p className="home-hero__lede">
          Store-bought planes, scratch builds and the odd slope-soaring adventure — this
          is the home for everything alongside the {siteConfig.name} YouTube channel.
        </p>
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
    </div>
  );
}
