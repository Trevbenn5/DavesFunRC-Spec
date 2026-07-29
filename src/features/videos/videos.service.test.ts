import { afterEach, describe, expect, it, vi } from 'vitest';
import { getPlaylists } from './videos.service';

function mockPlaylistsResponse(items: unknown[]): Response {
  return {
    ok: true,
    status: 200,
    json: async () => ({ items }),
  } as Response;
}

describe('getPlaylists', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('throws when the API key or uploads playlist id is not configured', async () => {
    vi.stubEnv('VITE_YOUTUBE_API_KEY', '');
    vi.stubEnv('VITE_YOUTUBE_UPLOADS_PLAYLIST_ID', '');

    await expect(getPlaylists(5)).rejects.toThrow();
  });

  it('derives the channel id from the uploads playlist id and ranks by item count', async () => {
    vi.stubEnv('VITE_YOUTUBE_API_KEY', 'test-key');
    vi.stubEnv('VITE_YOUTUBE_UPLOADS_PLAYLIST_ID', 'UUabc123');

    const fetchMock = vi.fn().mockResolvedValue(
      mockPlaylistsResponse([
        {
          id: 'small',
          snippet: { title: 'Small playlist', thumbnails: { medium: { url: 'https://img/small.jpg' } } },
          contentDetails: { itemCount: 3 },
        },
        {
          id: 'big',
          snippet: { title: 'Big playlist', thumbnails: { medium: { url: 'https://img/big.jpg' } } },
          contentDetails: { itemCount: 42 },
        },
      ]),
    );
    vi.stubGlobal('fetch', fetchMock);

    const playlists = await getPlaylists(2);

    expect(fetchMock).toHaveBeenCalledOnce();
    const requestedUrl = new URL(fetchMock.mock.calls[0][0] as string);
    expect(requestedUrl.origin + requestedUrl.pathname).toBe(
      'https://www.googleapis.com/youtube/v3/playlists',
    );
    expect(requestedUrl.searchParams.get('channelId')).toBe('UCabc123');
    expect(requestedUrl.searchParams.get('key')).toBe('test-key');

    expect(playlists).toEqual([
      {
        id: 'big',
        title: 'Big playlist',
        thumbnailUrl: 'https://img/big.jpg',
        itemCount: 42,
        playlistUrl: 'https://www.youtube.com/playlist?list=big',
      },
      {
        id: 'small',
        title: 'Small playlist',
        thumbnailUrl: 'https://img/small.jpg',
        itemCount: 3,
        playlistUrl: 'https://www.youtube.com/playlist?list=small',
      },
    ]);
  });

  it('caps results to the requested count after ranking', async () => {
    vi.stubEnv('VITE_YOUTUBE_API_KEY', 'test-key');
    vi.stubEnv('VITE_YOUTUBE_UPLOADS_PLAYLIST_ID', 'UUabc123');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        mockPlaylistsResponse([
          {
            id: 'a',
            snippet: { title: 'A', thumbnails: { medium: { url: 'https://img/a.jpg' } } },
            contentDetails: { itemCount: 1 },
          },
          {
            id: 'b',
            snippet: { title: 'B', thumbnails: { medium: { url: 'https://img/b.jpg' } } },
            contentDetails: { itemCount: 2 },
          },
          {
            id: 'c',
            snippet: { title: 'C', thumbnails: { medium: { url: 'https://img/c.jpg' } } },
            contentDetails: { itemCount: 3 },
          },
        ]),
      ),
    );

    const playlists = await getPlaylists(1);

    expect(playlists).toHaveLength(1);
    expect(playlists[0].id).toBe('c');
  });

  it('falls back to the default thumbnail when medium is missing', async () => {
    vi.stubEnv('VITE_YOUTUBE_API_KEY', 'test-key');
    vi.stubEnv('VITE_YOUTUBE_UPLOADS_PLAYLIST_ID', 'UUabc123');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        mockPlaylistsResponse([
          {
            id: 'a',
            snippet: { title: 'A', thumbnails: { default: { url: 'https://img/default.jpg' } } },
            contentDetails: { itemCount: 1 },
          },
        ]),
      ),
    );

    const playlists = await getPlaylists(1);

    expect(playlists[0].thumbnailUrl).toBe('https://img/default.jpg');
  });

  it('throws when the API responds with a non-2xx status', async () => {
    vi.stubEnv('VITE_YOUTUBE_API_KEY', 'test-key');
    vi.stubEnv('VITE_YOUTUBE_UPLOADS_PLAYLIST_ID', 'UUabc123');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 403, json: async () => ({}) }),
    );

    await expect(getPlaylists(5)).rejects.toThrow();
  });
});
