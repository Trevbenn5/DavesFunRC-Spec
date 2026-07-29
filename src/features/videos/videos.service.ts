import type { PlaylistSummary } from './videos.types';

interface PlaylistsResponse {
  items: Array<{
    id: string;
    snippet: {
      title: string;
      thumbnails: {
        medium?: { url: string };
        default?: { url: string };
      };
    };
    contentDetails: {
      itemCount: number;
    };
  }>;
}

// playlists.list has no page-level "top playlists" ranking, so this fetches
// a single page (up to 50 — see spec's Edge cases on channels with more
// playlists than that) and ranks by itemCount client-side.
const PLAYLIST_FETCH_LIMIT = 50;

// The channel ID isn't configured separately — it shares its suffix with
// the uploads-playlist ID already required by getLatestVideos (uploads
// `UUxxxxxxxx` <-> channel `UCxxxxxxxx`), which is YouTube's documented,
// stable convention.
function deriveChannelId(uploadsPlaylistId: string): string {
  return uploadsPlaylistId.replace(/^UU/, 'UC');
}

export async function getPlaylists(count: number): Promise<PlaylistSummary[]> {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY as string | undefined;
  const uploadsPlaylistId = import.meta.env.VITE_YOUTUBE_UPLOADS_PLAYLIST_ID as
    | string
    | undefined;

  if (!apiKey || !uploadsPlaylistId) {
    throw new Error('YouTube API is not configured.');
  }

  const url = new URL('https://www.googleapis.com/youtube/v3/playlists');
  url.searchParams.set('part', 'snippet,contentDetails');
  url.searchParams.set('channelId', deriveChannelId(uploadsPlaylistId));
  url.searchParams.set('maxResults', String(PLAYLIST_FETCH_LIMIT));
  url.searchParams.set('key', apiKey);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`YouTube API request failed with status ${response.status}`);
  }

  const data = (await response.json()) as PlaylistsResponse;

  return data.items
    .map((item) => ({
      id: item.id,
      title: item.snippet.title,
      thumbnailUrl:
        item.snippet.thumbnails.medium?.url ?? item.snippet.thumbnails.default?.url ?? '',
      itemCount: item.contentDetails.itemCount,
      playlistUrl: `https://www.youtube.com/playlist?list=${item.id}`,
    }))
    .sort((a, b) => b.itemCount - a.itemCount)
    .slice(0, count);
}
