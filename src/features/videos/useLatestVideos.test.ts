import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/preact';
import { useLatestVideos } from './useLatestVideos';
import * as videosService from './videos.service';
import type { VideoSummary } from './videos.types';

describe('useLatestVideos', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('transitions from loading to loaded', async () => {
    const videos: VideoSummary[] = [
      {
        id: '1',
        title: 'A video',
        publishedAt: '2026-01-01T00:00:00Z',
        thumbnailUrl: 'https://img/1.jpg',
        watchUrl: 'https://www.youtube.com/watch?v=1',
      },
    ];
    vi.spyOn(videosService, 'getLatestVideos').mockResolvedValue(videos);

    const { result } = renderHook(() => useLatestVideos(3));

    expect(result.current.status).toBe('loading');

    await waitFor(() => expect(result.current.status).toBe('loaded'));
    expect(result.current).toEqual({ status: 'loaded', videos });
  });

  it('transitions from loading to error and logs the failure', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(videosService, 'getLatestVideos').mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => useLatestVideos(3));

    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(consoleError).toHaveBeenCalled();
  });
});
