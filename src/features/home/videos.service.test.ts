import { afterEach, describe, expect, it, vi } from 'vitest';
import { getLatestVideos } from './videos.service';

function mockPlaylistResponse(items: unknown[]): Response {
  return {
    ok: true,
    status: 200,
    json: async () => ({ items }),
  } as Response;
}

describe('getLatestVideos', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('throws when the API key or uploads playlist id is not configured', async () => {
    vi.stubEnv('VITE_YOUTUBE_API_KEY', '');
    vi.stubEnv('VITE_YOUTUBE_UPLOADS_PLAYLIST_ID', '');

    await expect(getLatestVideos(3)).rejects.toThrow();
  });

  it('requests the uploads playlist and maps the response, newest first', async () => {
    vi.stubEnv('VITE_YOUTUBE_API_KEY', 'test-key');
    vi.stubEnv('VITE_YOUTUBE_UPLOADS_PLAYLIST_ID', 'UUabc123');

    const fetchMock = vi.fn().mockResolvedValue(
      mockPlaylistResponse([
        {
          snippet: {
            title: 'Older video',
            publishedAt: '2026-07-01T00:00:00Z',
            resourceId: { videoId: 'aaa' },
            thumbnails: { medium: { url: 'https://img/aaa.jpg' } },
          },
        },
        {
          snippet: {
            title: 'Newest video',
            publishedAt: '2026-07-20T00:00:00Z',
            resourceId: { videoId: 'bbb' },
            thumbnails: { medium: { url: 'https://img/bbb.jpg' } },
          },
        },
      ]),
    );
    vi.stubGlobal('fetch', fetchMock);

    const videos = await getLatestVideos(2);

    expect(fetchMock).toHaveBeenCalledOnce();
    const requestedUrl = new URL(fetchMock.mock.calls[0][0] as string);
    expect(requestedUrl.origin + requestedUrl.pathname).toBe(
      'https://www.googleapis.com/youtube/v3/playlistItems',
    );
    expect(requestedUrl.searchParams.get('playlistId')).toBe('UUabc123');
    expect(requestedUrl.searchParams.get('maxResults')).toBe('2');
    expect(requestedUrl.searchParams.get('key')).toBe('test-key');

    expect(videos).toEqual([
      {
        id: 'bbb',
        title: 'Newest video',
        publishedAt: '2026-07-20T00:00:00Z',
        thumbnailUrl: 'https://img/bbb.jpg',
        watchUrl: 'https://www.youtube.com/watch?v=bbb',
      },
      {
        id: 'aaa',
        title: 'Older video',
        publishedAt: '2026-07-01T00:00:00Z',
        thumbnailUrl: 'https://img/aaa.jpg',
        watchUrl: 'https://www.youtube.com/watch?v=aaa',
      },
    ]);
  });

  it('falls back to the default thumbnail when medium is missing', async () => {
    vi.stubEnv('VITE_YOUTUBE_API_KEY', 'test-key');
    vi.stubEnv('VITE_YOUTUBE_UPLOADS_PLAYLIST_ID', 'UUabc123');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        mockPlaylistResponse([
          {
            snippet: {
              title: 'Video',
              publishedAt: '2026-07-01T00:00:00Z',
              resourceId: { videoId: 'aaa' },
              thumbnails: { default: { url: 'https://img/default.jpg' } },
            },
          },
        ]),
      ),
    );

    const videos = await getLatestVideos(1);

    expect(videos[0].thumbnailUrl).toBe('https://img/default.jpg');
  });

  it('throws when the API responds with a non-2xx status', async () => {
    vi.stubEnv('VITE_YOUTUBE_API_KEY', 'test-key');
    vi.stubEnv('VITE_YOUTUBE_UPLOADS_PLAYLIST_ID', 'UUabc123');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 403, json: async () => ({}) }),
    );

    await expect(getLatestVideos(3)).rejects.toThrow();
  });
});
