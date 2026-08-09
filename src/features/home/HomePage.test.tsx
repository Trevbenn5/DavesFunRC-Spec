import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/preact';
import { HomePage } from './HomePage';
import { RouterProvider } from '../../app/router';
import { homeWeeklyUpdate } from '../../data/home-weekly-update';
import * as videosService from './videos.service';

function renderHomePage() {
  return render(
    <RouterProvider>
      <HomePage />
    </RouterProvider>,
  );
}

describe('HomePage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the hero heading', () => {
    vi.spyOn(videosService, 'getLatestVideos').mockReturnValue(new Promise(() => {}));

    renderHomePage();

    expect(
      screen.getByRole('heading', { level: 1, name: "G'day, welcome to DavesFunRC" }),
    ).toBeInTheDocument();
  });

  it('renders the welcome copy and photo below the hero heading', () => {
    vi.spyOn(videosService, 'getLatestVideos').mockReturnValue(new Promise(() => {}));

    renderHomePage();

    expect(screen.getByText(/thanks for dropping by/i)).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getByText('Links to my YouTube videos')).toBeInTheDocument();
    expect(screen.getByText('3D printer build designs (3D models)')).toBeInTheDocument();
    expect(screen.getByText('Technical articles to help new starters')).toBeInTheDocument();
    expect(screen.getByText('Suggestions on future projects are welcome…')).toBeInTheDocument();

    const image = screen.getByAltText(/dave, wearing a helmet-mounted action camera/i);
    expect(image).toBeInTheDocument();
    expect(image.getAttribute('alt')).not.toBe('');
  });

  it('renders the weekly update alongside the hero', () => {
    vi.spyOn(videosService, 'getLatestVideos').mockReturnValue(new Promise(() => {}));

    renderHomePage();

    expect(
      screen.getByRole('heading', { level: 2, name: homeWeeklyUpdate.heading }),
    ).toBeInTheDocument();
  });

  it('still renders the existing highlights', () => {
    vi.spyOn(videosService, 'getLatestVideos').mockReturnValue(new Promise(() => {}));

    renderHomePage();

    expect(screen.getByRole('heading', { level: 3, name: 'Watch' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Read' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Build' })).toBeInTheDocument();
  });

  it('links the Read highlight card to the Read page', () => {
    vi.spyOn(videosService, 'getLatestVideos').mockReturnValue(new Promise(() => {}));

    renderHomePage();

    const readLink = screen.getByRole('link', { name: 'Read articles' });
    expect(readLink).toHaveAttribute('href', '/read');
  });

  it('shows a loading announcement and 6 skeleton placeholders while the latest videos load', () => {
    vi.spyOn(videosService, 'getLatestVideos').mockReturnValue(new Promise(() => {}));

    const { container } = renderHomePage();

    expect(screen.getByRole('status')).toHaveTextContent(/loading latest videos/i);
    expect(container.querySelectorAll('.home-video-skeleton')).toHaveLength(6);
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

    renderHomePage();

    await screen.findByRole('heading', { level: 3, name: 'Newest video' });
    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings.map((heading) => heading.textContent)).toEqual([
      'Watch',
      'Read',
      'Build',
      'Newest video',
      'Older video',
    ]);

    const watchLink = screen.getByRole('link', { name: /watch "newest video" on youtube/i });
    expect(watchLink).toHaveAttribute('href', 'https://www.youtube.com/watch?v=newest');
    expect(watchLink).toHaveAttribute('target', '_blank');
  });

  it('shows an error state with a link to the channel when the latest videos fetch fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(videosService, 'getLatestVideos').mockRejectedValue(new Error('boom'));

    renderHomePage();

    expect(await screen.findByText(/couldn.t load the latest videos/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /visit the youtube channel/i })).toHaveAttribute(
      'href',
      'https://www.youtube.com/@DavesFunRC',
    );
  });

  it('shows an empty state with a link to the channel when there are no videos', async () => {
    vi.spyOn(videosService, 'getLatestVideos').mockResolvedValue([]);

    renderHomePage();

    expect(await screen.findByText(/no videos yet/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /visit the youtube channel/i })).toHaveAttribute(
      'href',
      'https://www.youtube.com/@DavesFunRC',
    );
  });
});
