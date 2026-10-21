import http from 'node:http';
import { createReadStream } from 'node:fs';
import { realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = await realpath(fileURLToPath(new URL('./dist/', import.meta.url)));
const port = Number(process.env.PORT || 1488);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535');
}
const spaRoutes = new Set(['/', '/tech-rider', '/order']);
const mimeTypes = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp',
  '.avif': 'image/avif', '.ico': 'image/x-icon', '.woff': 'font/woff',
  '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.mp4': 'video/mp4',
  '.webm': 'video/webm', '.mp3': 'audio/mpeg', '.txt': 'text/plain; charset=utf-8',
};

const server = http.createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  const fail = (status, message) => {
    res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(req.method === 'HEAD' ? undefined : message);
  };
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return fail(405, 'Method not allowed');
  }
  let pathname;
  try {
    pathname = decodeURIComponent((req.url || '/').split('?')[0]);
  } catch {
    return fail(400, 'Invalid URL');
  }
  if (!pathname.startsWith('/') || pathname.includes('\\') || pathname.includes('\0') ||
      pathname.split('/').some(segment => segment.startsWith('.'))) {
    return fail(403, 'Forbidden');
  }
  const route = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  const relative = spaRoutes.has(route) ? 'index.html' : pathname.slice(1);
  try {
    const filename = await realpath(path.resolve(root, relative));
    if (!filename.startsWith(root + path.sep)) return fail(403, 'Forbidden');
    const info = await stat(filename);
    if (!info.isFile()) return fail(404, 'Not found');
    const immutable = pathname.startsWith('/assets/') && /-[\w-]{8,}\.[\w]+$/.test(pathname);
    res.writeHead(200, {
      'Content-Type': mimeTypes[path.extname(filename).toLowerCase()] || 'application/octet-stream',
      'Content-Length': info.size,
      'Cache-Control': immutable ? 'public, max-age=31536000, immutable' : 'no-cache',
    });
    if (req.method === 'HEAD') return res.end();
    const stream = createReadStream(filename);
    stream.on('error', () => res.destroy());
    res.on('close', () => stream.destroy());
    stream.pipe(res);
  } catch (error) {
    if (['ENOENT', 'ENOTDIR'].includes(error.code)) return fail(404, 'Not found');
    console.error('Static request failed:', error.code || error.message);
    return fail(500, 'Internal server error');
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`novicovs listening on 0.0.0.0:${port}`);
});
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 5000).unref();
  });
}
