/**
 * Resolves a media asset path to a local public URL or remote CDN URL.
 * - Remote URLs (starting with http://, https://, or //) are returned unchanged.
 * - Local paths are mapped under /media/ in public/media/.
 * - If env var NEXT_PUBLIC_MEDIA_HOST is set, local paths are prefixed with it.
 */
export function mediaUrl(path?: string | null): string {
  if (!path) return '';

  const trimmed = path.trim();
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('//')
  ) {
    return trimmed;
  }

  // Normalize path to reside under /media/
  let relativePath = trimmed;
  if (relativePath.startsWith('/media/')) {
    relativePath = relativePath;
  } else if (relativePath.startsWith('media/')) {
    relativePath = `/${relativePath}`;
  } else if (relativePath.startsWith('/')) {
    relativePath = `/media${relativePath}`;
  } else {
    relativePath = `/media/${relativePath}`;
  }

  const mediaHost = process.env.NEXT_PUBLIC_MEDIA_HOST;
  if (mediaHost && mediaHost.trim() !== '') {
    const cleanHost = mediaHost.trim().replace(/\/+$/, '');
    return `${cleanHost}${relativePath}`;
  }

  return relativePath;
}
