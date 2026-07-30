import './ThreeDDesignsPage.css';
import { Button } from '../../components/ui/Button';
import { siteConfig } from '../../app/app-config';
import printerImage from '../../assets/three-d-designs/3d-printer.jpg';

export function ThreeDDesignsPage() {
  return (
    <div className="container three-d-designs-page">
      <h1>3D Designs</h1>

      <div className="three-d-designs-page__intro">
        <figure className="three-d-designs-page__figure">
          <img
            src={printerImage}
            alt="A 3D printer mid-print, replacing what used to be a hand-cut foam build"
          />
          <figcaption>3D printing has replaced a lot of the foam cutting</figcaption>
        </figure>

        <div className="three-d-designs-page__body">
          <p>
            Welcome! Here you&apos;ll find links to sites where you can download the 3D printable
            .STL files for many of my RC designs. Each project includes build instructions and
            links to the materials you&apos;ll need to get started.
          </p>
          <p>
            Many of the designs are free to download, while some of my original creations are
            available for about the price of a cup of coffee. Those purchases help support the
            many hours of designing, testing, and refining that go into creating these models and
            allow me to keep developing new projects for the RC community.
          </p>
          <p>
            I hope you enjoy building them as much as I&apos;ve enjoyed designing them. Happy
            printing and happy flying!
          </p>

          <div className="three-d-designs-page__actions">
            <Button href={siteConfig.externalLinks.cults3d} variant="secondary">
              View my designs on Cults3D
            </Button>
            <Button href={siteConfig.externalLinks.koFi} variant="secondary">
              Support me on Ko-fi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
