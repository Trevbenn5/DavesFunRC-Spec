import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { RouterProvider } from '../../../app/router';
import { ShortsCard } from './ShortsCard';

describe('ShortsCard', () => {
  it('renders the heading and a working external Shorts link', () => {
    render(
      <RouterProvider>
        <ShortsCard />
      </RouterProvider>,
    );

    expect(screen.getByRole('heading', { level: 3, name: 'YouTube Shorts' })).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /watch davesfunrc shorts on youtube/i });
    expect(link).toHaveAttribute('href', 'https://www.youtube.com/@DavesFunRC/shorts');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
