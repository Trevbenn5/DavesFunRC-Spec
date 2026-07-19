import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { App } from '../../src/app/App';

describe('App', () => {
  beforeEach(() => {
    window.history.pushState(null, '', '/');
  });

  it('renders the home page by default', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: /welcome to davesfunrc/i })).toBeInTheDocument();
  });

  it('renders the main navigation with links to every route', () => {
    render(<App />);
    const nav = screen.getByRole('navigation', { name: /main/i });
    expect(nav).toHaveTextContent('Home');
    expect(nav).toHaveTextContent('Videos');
    expect(nav).toHaveTextContent('3D Designs');
    expect(nav).toHaveTextContent('About');
  });

  it('shows the not found page for an unknown route', () => {
    window.history.pushState(null, '', '/does-not-exist');
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: /page not found/i })).toBeInTheDocument();
  });
});
