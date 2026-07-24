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
    vi.spyOn(videosService, 'getLatestVideos').mockReturnValue(new Promise(() => {}));

    renderVideosPage();

    expect(screen.getByRole('heading', { level: 1, name: 'Videos' })).toBeInTheDocument();
  });

  it('shows a loading announcement and skeleton placeholders while loading', () => {
    vi.spyOn(videosService, 'getLatestVideos').mockReturnValue(new Promise(() => {}));

    renderVideosPage();

    expect(screen.getByRole('status')).toHaveTextContent(/loading latest videos/i);
  });

  it('shows the latest videos, newest first, once loaded', async () => {
    vi.spyOn(videosService, 'getLatestVideos').mockResolvedValue([
      {
        id: 'newest',
        title: 'Newest video',
        publishedAt: '2026-07-20T00:00:00Z',
        thumbnailUrl: 'https://img/newest.jpg',
        watchUrl: 'https://www.youtube.com/watch?v=newest',
      },
      {
        id: 'older',
        title: 'Older video',
        publishedAt: '2026-07-01T00:00:00Z',
        thumbnailUrl: 'https://img/older.jpg',
        watchUrl: 'https://www.youtube.com/watch?v=older',
      },
    ]);

    renderVideosPage();

    const headings = await screen.findAllByRole('heading', { level: 3 });
    expect(headings.map((heading) => heading.textContent)).toEqual([
      'Newest video',
      'Older video',
    ]);

    const watchLink = screen.getByRole('link', { name: /watch "newest video" on youtube/i });
    expect(watchLink).toHaveAttribute('href', 'https://www.youtube.com/watch?v=newest');
    expect(watchLink).toHaveAttribute('target', '_blank');
  });

  it('shows an error state with a link to the channel when the fetch fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(videosService, 'getLatestVideos').mockRejectedValue(new Error('boom'));

    renderVideosPage();

    expect(await screen.findByText(/couldn.t load the latest videos/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /visit the youtube channel/i })).toHaveAttribute(
      'href',
      'https://www.youtube.com/@DavesFunRC',
    );
  });

  it('shows an empty state with a link to the channel when there are no videos', async () => {
    vi.spyOn(videosService, 'getLatestVideos').mockResolvedValue([]);

    renderVideosPage();

    expect(await screen.findByText(/no videos yet/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /visit the youtube channel/i })).toHaveAttribute(
      'href',
      'https://www.youtube.com/@DavesFunRC',
    );
  });
});
