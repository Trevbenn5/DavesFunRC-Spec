import { useEffect, useState } from 'preact/hooks';
import { getLatestVideos } from './videos.service';
import type { VideoSummary } from './videos.types';

export type LatestVideosState =
  | { status: 'loading' }
  | { status: 'loaded'; videos: VideoSummary[] }
  | { status: 'error' };

export function useLatestVideos(count: number): LatestVideosState {
  const [state, setState] = useState<LatestVideosState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });

    getLatestVideos(count)
      .then((videos) => {
        if (!cancelled) {
          setState({ status: 'loaded', videos });
        }
      })
      .catch((error: unknown) => {
        console.error('Failed to load latest videos:', error);
        if (!cancelled) {
          setState({ status: 'error' });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [count]);

  return state;
}
