import './PlaceholderPage.css';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="container placeholder-page">
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
