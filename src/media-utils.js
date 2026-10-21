// Keep media sources passive and reject browser URL normalization tricks.
export function safeMediaUrl(value) {
  if (typeof value !== 'string') return '';
  const url = value.trim();
  if (!/^(?:https?:\/\/|\/(?!\/))/i.test(url) || Array.from(url).some(character => character.charCodeAt(0) <= 32 || character === '\\')) return '';
  return url;
}

export function videoSource(value) {
  const url = safeMediaUrl(value);
  if (!url) return null;
  if (/\.(?:mp4|webm)(?:[?#]|$)/i.test(url)) return { type: 'file', url };
  if (url.startsWith('/')) return null;
  try {
    const parsed = new URL(url);
    if (parsed.username || parsed.password) return null;
    const host = parsed.hostname.toLowerCase();
    let id;
    if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(host)) {
      id = parsed.pathname === '/watch' ? parsed.searchParams.get('v') : parsed.pathname.match(/^\/(?:embed|shorts)\/([^/]+)\/?$/)?.[1];
      if (/^[\w-]{11}$/.test(id || '')) return { type: 'embed', url: `https://www.youtube-nocookie.com/embed/${id}` };
    }
    if (host === 'youtu.be') {
      id = parsed.pathname.slice(1);
      if (/^[\w-]{11}$/.test(id)) return { type: 'embed', url: `https://www.youtube-nocookie.com/embed/${id}` };
    }
    if (['vimeo.com', 'www.vimeo.com', 'player.vimeo.com'].includes(host)) {
      const match = parsed.pathname.match(/^\/(?:video\/)?(\d+)(?:\/([a-zA-Z0-9]+))?\/?$/);
      if (match) {
        const hash = match[2] || parsed.searchParams.get('h');
        return { type: 'embed', url: `https://player.vimeo.com/video/${match[1]}${hash && /^[a-zA-Z0-9]+$/.test(hash) ? `?h=${hash}` : ''}` };
      }
    }
  } catch { /* Invalid or unsupported media URL. */ }
  return null;
}
