import { render, screen } from '@testing-library/preact';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from '../../src/app/App';

describe('App', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('renders the site header navigation', () => {
    render(<App />);
    expect(
      screen.getByRole('navigation', { name: 'Main' }),
    ).toBeInTheDocument();
  });

  it('renders the home page at the root path', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'DavesFunRC' }),
    ).toBeInTheDocument();
  });

  it('renders the not found page for an unknown route', () => {
    window.history.replaceState(null, '', '/unknown-route');
    render(<App />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Page not found' }),
    ).toBeInTheDocument();
  });
});
