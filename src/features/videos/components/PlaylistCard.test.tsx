import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { RouterProvider } from '../../../app/router';
import { PlaylistCard } from './PlaylistCard';
import type { PlaylistSummary } from '../videos.types';

const playlist: PlaylistSummary = {
  id: 'abc123',
  title: 'Slope Soaring',
  thumbnailUrl: 'https://img/slope-soaring.jpg',
  itemCount: 12,
  playlistUrl: 'https://www.youtube.com/playlist?list=abc123',
};

describe('PlaylistCard', () => {
  it('renders the title, thumbnail alt text, and a working external playlist link', () => {
    render(
      <RouterProvider>
        <PlaylistCard playlist={playlist} />
      </RouterProvider>,
    );

    expect(screen.getByRole('heading', { level: 3, name: 'Slope Soaring' })).toBeInTheDocument();
    expect(screen.getByAltText('Slope Soaring — DavesFunRC')).toHaveAttribute(
      'src',
      'https://img/slope-soaring.jpg',
    );

    const link = screen.getByRole('link', { name: /view "slope soaring" playlist on youtube/i });
    expect(link).toHaveAttribute('href', 'https://www.youtube.com/playlist?list=abc123');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
