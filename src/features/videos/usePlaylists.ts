import { useEffect, useState } from 'preact/hooks';
import { getPlaylists } from './videos.service';
import type { PlaylistSummary } from './videos.types';

export type PlaylistsState =
  | { status: 'loading' }
  | { status: 'loaded'; playlists: PlaylistSummary[] }
  | { status: 'error' };

export function usePlaylists(count: number): PlaylistsState {
  const [state, setState] = useState<PlaylistsState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });

    getPlaylists(count)
      .then((playlists) => {
        if (!cancelled) {
          setState({ status: 'loaded', playlists });
        }
      })
      .catch((error: unknown) => {
        console.error('Failed to load playlists:', error);
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
