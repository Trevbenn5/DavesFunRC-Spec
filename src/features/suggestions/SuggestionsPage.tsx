import './SuggestionsPage.css';
import portraitImage from '../../assets/brand/portrait.png';
import { SuggestionForm } from './components/SuggestionForm';

export function SuggestionsPage() {
  return (
    <div className="container suggestions-page">
      <h1>Suggestions</h1>

      <div className="suggestions-page__intro">
        <p>
          Hi, I&apos;m Dave — I&apos;d love to hear your ideas for future builds, videos or
          projects. Tell me a bit about yourself and what you&apos;d like to see next.
        </p>
        <img
          className="suggestions-page__portrait"
          src={portraitImage}
          alt="Dave, smiling outdoors on a coastal walk"
        />
      </div>

      <SuggestionForm />
    </div>
  );
}
