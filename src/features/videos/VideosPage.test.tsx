import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { RouterProvider } from '../../app/router';
import { VideosPage } from './VideosPage';
import * as videosService from './videos.service';

function renderVideosPage() {
  return render(
    <RouterProvider>
      <VideosPage />
    </RouterProvider>,
  );
}

describe('VideosPage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the page heading', () => {
    vi.spyOn(videosService, 'getPlaylists').mockReturnValue(new Promise(() => {}));

    renderVideosPage();

    expect(screen.getByRole('heading', { level: 1, name: 'Videos' })).toBeInTheDocument();
  });

  it('shows a loading announcement and 5 skeleton placeholders while loading', () => {
    vi.spyOn(videosService, 'getPlaylists').mockReturnValue(new Promise(() => {}));

    const { container } = renderVideosPage();

    expect(screen.getByRole('status')).toHaveTextContent(/loading playlists/i);
    expect(container.querySelectorAll('.playlist-card-skeleton')).toHaveLength(5);
    expect(screen.queryByRole('link', { name: /watch shorts/i })).not.toBeInTheDocument();
  });

  it('shows the playlists, ranked by video count, once loaded', async () => {
    vi.spyOn(videosService, 'getPlaylists').mockResolvedValue([
      {
        id: 'big',
        title: 'Biggest playlist',
        thumbnailUrl: 'https://img/big.jpg',
        itemCount: 42,
        playlistUrl: 'https://www.youtube.com/playlist?list=big',
      },
      {
        id: 'small',
        title: 'Smaller playlist',
        thumbnailUrl: 'https://img/small.jpg',
        itemCount: 3,
        playlistUrl: 'https://www.youtube.com/playlist?list=small',
      },
    ]);

    renderVideosPage();

    const headings = await screen.findAllByRole('heading', { level: 3 });
    expect(headings.map((heading) => heading.textContent)).toEqual([
      'Biggest playlist',
      'Smaller playlist',
      'YouTube Shorts',
    ]);

    const viewLink = screen.getByRole('link', {
      name: /view "biggest playlist" playlist on youtube/i,
    });
    expect(viewLink).toHaveAttribute('href', 'https://www.youtube.com/playlist?list=big');
    expect(viewLink).toHaveAttribute('target', '_blank');

    const shortsLink = screen.getByRole('link', { name: /watch davesfunrc shorts on youtube/i });
    expect(shortsLink).toHaveAttribute('href', 'https://www.youtube.com/@DavesFunRC/shorts');
    expect(shortsLink).toHaveAttribute('target', '_blank');
  });

  it('shows an error state with a link to the channel when the fetch fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(videosService, 'getPlaylists').mockRejectedValue(new Error('boom'));

    renderVideosPage();

    expect(await screen.findByText(/couldn.t load the playlists/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /visit the youtube channel/i })).toHaveAttribute(
      'href',
      'https://www.youtube.com/@DavesFunRC',
    );
    expect(screen.queryByRole('link', { name: /watch shorts/i })).not.toBeInTheDocument();
  });

  it('shows an empty state with a link to the channel when there are no playlists', async () => {
    vi.spyOn(videosService, 'getPlaylists').mockResolvedValue([]);

    renderVideosPage();

    expect(await screen.findByText(/no playlists yet/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /visit the youtube channel/i })).toHaveAttribute(
      'href',
      'https://www.youtube.com/@DavesFunRC',
    );
    expect(screen.queryByRole('link', { name: /watch shorts/i })).not.toBeInTheDocument();
  });
});
