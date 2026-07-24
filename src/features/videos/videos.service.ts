import type { VideoSummary } from './videos.types';

interface PlaylistItemsResponse {
  items: Array<{
    snippet: {
      title: string;
      publishedAt: string;
      resourceId: { videoId: string };
      thumbnails: {
        medium?: { url: string };
        default?: { url: string };
      };
    };
  }>;
}

// Uploads-playlist items are cheap (1 quota unit) versus search.list (100
// units) for the same "latest N uploads" result — see spec's
// Non-functional requirements (Performance).
export async function getLatestVideos(count: number): Promise<VideoSummary[]> {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY as string | undefined;
  const uploadsPlaylistId = import.meta.env.VITE_YOUTUBE_UPLOADS_PLAYLIST_ID as
    | string
    | undefined;

  if (!apiKey || !uploadsPlaylistId) {
    throw new Error('YouTube API is not configured.');
  }

  const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('playlistId', uploadsPlaylistId);
  url.searchParams.set('maxResults', String(count));
  url.searchParams.set('key', apiKey);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`YouTube API request failed with status ${response.status}`);
  }

  const data = (await response.json()) as PlaylistItemsResponse;

  return data.items
    .map((item) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      publishedAt: item.snippet.publishedAt,
      thumbnailUrl:
        item.snippet.thumbnails.medium?.url ?? item.snippet.thumbnails.default?.url ?? '',
      watchUrl: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
    }))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, count);
}
