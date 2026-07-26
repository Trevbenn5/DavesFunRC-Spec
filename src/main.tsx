import { render } from 'preact';
import { App } from './app/App';
import { initAnalytics } from './services/analytics.service';
import './styles/global.css';

initAnalytics();

const root = document.getElementById('app');

if (!root) {
  throw new Error('Application root element was not found.');
}

render(<App />, root);
