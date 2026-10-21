import assert from 'node:assert/strict';
import test from 'node:test';
import { safeMediaUrl, videoSource } from '../src/media-utils.js';

test('media URLs exclude executable protocols and browser normalization tricks', () => {
  for (const value of ['javascript:alert(1)', 'data:image/svg+xml,test', '//evil.example/x', '/\\evil.example/x', 'https://example.com/\nfile.mp4', null]) assert.equal(safeMediaUrl(value), '');
  assert.equal(safeMediaUrl('/uploads/photo.png'), '/uploads/photo.png');
  assert.equal(safeMediaUrl(' https://example.com/photo.png '), 'https://example.com/photo.png');
});

test('uploaded and remote video files use the native player', () => {
  for (const url of ['/uploads/a.mp4', 'https://example.com/video.WEBM?token=123']) assert.deepEqual(videoSource(url), { type: 'file', url });
});

test('only known video services can produce iframe sources', () => {
  assert.deepEqual(videoSource('https://www.youtube.com/watch?v=dQw4w9WgXcQ&evil=yes'), { type: 'embed', url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ' });
  assert.deepEqual(videoSource('https://youtu.be/dQw4w9WgXcQ'), { type: 'embed', url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ' });
  assert.deepEqual(videoSource('https://vimeo.com/123456/abc123'), { type: 'embed', url: 'https://player.vimeo.com/video/123456?h=abc123' });
  for (const url of ['https://youtube.com.evil.com/embed/dQw4w9WgXcQ', 'https://example.com/embed/x', '/admin', 'javascript:alert(1)', 'https://evil@youtube.com/embed/dQw4w9WgXcQ']) assert.equal(videoSource(url), null);
});
