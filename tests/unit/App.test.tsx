import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { App } from '../../src/app/App';

describe('App', () => {
  it('renders the home page with primary navigation', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      "G'day, welcome to DavesFunRC",
    );

    const nav = screen.getByRole('navigation', { name: /main/i });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Videos' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
  });

  it('renders a placeholder page when navigating to a route', async () => {
    render(<App />);

    screen.getByRole('link', { name: 'Videos' }).click();

    expect(await screen.findByRole('heading', { level: 1, name: 'Videos' })).toBeInTheDocument();
  });
});
