import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/preact';
import { usePlaylists } from './usePlaylists';
import * as videosService from './videos.service';
import type { PlaylistSummary } from './videos.types';

describe('usePlaylists', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('transitions from loading to loaded', async () => {
    const playlists: PlaylistSummary[] = [
      {
        id: '1',
        title: 'A playlist',
        thumbnailUrl: 'https://img/1.jpg',
        itemCount: 10,
        playlistUrl: 'https://www.youtube.com/playlist?list=1',
      },
    ];
    vi.spyOn(videosService, 'getPlaylists').mockResolvedValue(playlists);

    const { result } = renderHook(() => usePlaylists(5));

    expect(result.current.status).toBe('loading');

    await waitFor(() => expect(result.current.status).toBe('loaded'));
    expect(result.current).toEqual({ status: 'loaded', playlists });
  });

  it('transitions from loading to error and logs the failure', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(videosService, 'getPlaylists').mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => usePlaylists(5));

    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(consoleError).toHaveBeenCalled();
  });
});
