import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
import { mkdir, readFile, writeFile, rename, chmod, readdir, stat, unlink } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';

const scrypt = promisify(scryptCallback);
const DAY = 86400000;
const cookieName = 'novicovs_admin';
const digest = value => createHash('sha256').update(value).digest('hex');
const random = () => randomBytes(32).toString('hex');
export async function atomicJson(filename, value) {
  const temporary = `${filename}.${randomBytes(8).toString('hex')}.tmp`;
  await writeFile(temporary, JSON.stringify(value, null, 2), { mode: 0o600 });
  await rename(temporary, filename);
  await chmod(filename, 0o600);
}
export async function initializeAdmin(dataDir, username, password) {
  if (typeof username !== 'string' || !username.trim() || username.length > 100 || typeof password !== 'string' || password.length < 12 || password.length > 1024) throw new Error('Provide ADMIN_USERNAME and an ADMIN_PASSWORD of at least 12 characters');
  await mkdir(dataDir, { recursive: true, mode: 0o700 });
  await chmod(dataDir, 0o700);
  const salt = random();
  const hash = (await scrypt(password, salt, 64)).toString('hex');
  await atomicJson(path.join(dataDir, 'admin.json'), { username, salt, hash, failures: 0, lockedUntil: 0 });
}
async function readJson(filename) {
  try { return JSON.parse(await readFile(filename, 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}
export function validateContent(value) {
  let count = 0;
  function visit(item, key = '', depth = 0, rootKey = '') {
    if (++count > 15000 || depth > 16) throw new Error('Content is too complex');
    if (item === null || typeof item === 'boolean' || (typeof item === 'number' && Number.isFinite(item))) return;
    if (typeof item === 'string') {
      if (item.length > 100000) throw new Error('Text is too long');
      if ((rootKey !== 'groupLabels' || key === 'orderPath') && rootKey !== 'form' && /(?:url|href|src|image|poster|file|link|background|path|photos|avatar|thumbnail|instagram|youtube)$/i.test(key) && item.trim()) {
        const clean = item.trim();
        if (/[\u0000-\u0020\u007f]/.test(clean) || clean.startsWith('//') || clean.includes('\\') || /^(?!https?:|mailto:|tel:)[a-z][a-z0-9+.-]*:/i.test(clean)) throw new Error('Unsafe URL');
      }
      return;
    }
    if (Array.isArray(item)) { if (item.length > 1000) throw new Error('Too many items'); item.forEach(child => visit(child, key, depth + 1, rootKey)); return; }
    if (item && typeof item === 'object') {
      for (const [name, child] of Object.entries(item)) {
        if (['__proto__', 'constructor', 'prototype'].includes(name) || name.length > 100) throw new Error('Invalid field');
        visit(child, name, depth + 1, rootKey || name);
      }
      return;
    }
    throw new Error('Invalid content');
  }
  if (!value || Array.isArray(value) || typeof value !== 'object') throw new Error('Content must be an object');
  visit(value);
}
export function validateStructure(value, template) {
  function visit(item, expected) {
    if (Array.isArray(expected)) {
      if (!Array.isArray(item)) throw new Error('Invalid content structure');
      for (const child of item) {
        // Blocks have independent shapes selected by their type; regular lists share a template.
        const model = expected.some(entry => entry && typeof entry === 'object' && typeof entry.type === 'string')
          ? expected.find(entry => entry.type === child?.type)
          : expected[0] ?? '';
        if (model === undefined) throw new Error('Invalid content structure');
        visit(child, model);
      }
    } else if (expected && typeof expected === 'object') {
      if (!item || Array.isArray(item) || typeof item !== 'object') throw new Error('Invalid content structure');
      const keys = Object.keys(expected);
      if (keys.length !== Object.keys(item).length || keys.some(key => !Object.prototype.hasOwnProperty.call(item, key))) throw new Error('Invalid content structure');
      for (const key of keys) visit(item[key], expected[key]);
    } else if (typeof item !== typeof expected || item === null) throw new Error('Invalid content structure');
  }
  visit(value, template);
}
async function body(req, limit) {
  const parts = []; let length = 0;
  for await (const part of req) {
    length += part.length;
    if (length > limit) throw Object.assign(new Error('Request too large'), { status: 413 });
    parts.push(part);
  }
  return Buffer.concat(parts);
}
function uploadType(bytes) {
  if (bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return ['png','image/png'];
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return ['jpg','image/jpeg'];
  if (/^GIF8[79]a$/.test(bytes.subarray(0,6).toString('ascii'))) return ['gif','image/gif'];
  if (bytes.subarray(0,4).toString() === 'RIFF' && bytes.subarray(8,12).toString() === 'WEBP') return ['webp','image/webp'];
  if (bytes.subarray(4,8).toString() === 'ftyp' && /^(isom|iso2|mp41|mp42|avc1|M4V |dash)/.test(bytes.subarray(8,12).toString())) return ['mp4','video/mp4'];
  if (bytes.subarray(0,4).equals(Buffer.from([26,69,223,163])) && bytes.subarray(0,4096).includes(Buffer.from('webm'))) return ['webm','video/webm'];
  if (bytes.subarray(0,3).toString() === 'ID3' || (bytes[0] === 255 && (bytes[1] & 0xe0) === 0xe0)) return ['mp3','audio/mpeg'];
  if (bytes.subarray(0,5).toString() === '%PDF-') return ['pdf','application/pdf'];
  return null;
}
const mimeByExtension = { png:'image/png', jpg:'image/jpeg', gif:'image/gif', webp:'image/webp', mp4:'video/mp4', webm:'video/webm', mp3:'audio/mpeg', pdf:'application/pdf' };
export async function createCms({ dataDir, defaultContentPath, now = Date.now }) {
  await mkdir(dataDir, { recursive: true, mode: 0o700 });
  await chmod(dataDir, 0o700);
  const uploads = path.join(dataDir, 'uploads');
  await mkdir(uploads, { recursive: true, mode: 0o700 });
  await chmod(uploads, 0o700);
  const adminPath = path.join(dataDir, 'admin.json');
  const credentials = await readJson(adminPath);
  const defaultContent = await readJson(defaultContentPath);
  const sessions = new Map();
  let loginQueue = Promise.resolve();
  let pendingLogins = 0;
  function reply(res, status, value) {
    res.writeHead(status, { 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store' });
    res.end(JSON.stringify(value));
  }
  function sameOrigin(req) {
    const origin = req.headers.origin;
    if (origin) {
      try { const url = new URL(origin); return ['http:', 'https:'].includes(url.protocol) && url.host === req.headers.host && url.origin === origin; } catch { return false; }
    }
    return req.headers['sec-fetch-site'] === 'same-origin';
  }
  function session(req) {
    const match = (req.headers.cookie || '').split(';').map(part => part.trim()).find(part => part.startsWith(`${cookieName}=`));
    if (!match) return null;
    const token = match.slice(cookieName.length + 1);
    if (!/^[a-f0-9]{64}$/.test(token)) return null;
    const key = digest(token), item = sessions.get(key);
    if (!item) return null;
    if (now() - item.seen > 30 * 60000 || now() - item.created > 12 * 3600000) { sessions.delete(key); return null; }
    item.seen = now();
    return { ...item, key };
  }
  return async function handleCms(req, res, pathname) {
    if (!pathname.startsWith('/api/') && !pathname.startsWith('/uploads/')) return false;
    try {
      if (pathname.startsWith('/uploads/')) {
        if (!['GET','HEAD'].includes(req.method)) { reply(res,405,{error:'Method not allowed'}); return true; }
        const filename = pathname.slice('/uploads/'.length);
        if (!/^[a-f0-9]{48}\.(png|jpg|gif|webp|mp4|webm|mp3|pdf)$/.test(filename)) { reply(res,404,{error:'Not found'}); return true; }
        const file = path.join(uploads, filename);
        const info = await stat(file);
        res.writeHead(200, { 'Content-Type':mimeByExtension[path.extname(file).slice(1)], 'Content-Length':info.size, 'Cache-Control':'public, max-age=86400', 'Content-Security-Policy':"sandbox; default-src 'none'", ...(filename.endsWith('.pdf') ? {'Content-Disposition':'attachment'} : {}) });
        if (req.method === 'HEAD') res.end(); else { const stream = createReadStream(file); stream.on('error', () => res.destroy()); res.on('close', () => stream.destroy()); stream.pipe(res); }
        return true;
      }
      if (req.method === 'GET' && pathname === '/api/content') {
        const content = await readJson(path.join(dataDir,'content.json')) || defaultContent;
        reply(res,200,content || {}); return true;
      }
      if (!pathname.startsWith('/api/admin/')) { reply(res,404,{error:'Not found'}); return true; }
      const auth = session(req);
      if (req.method === 'GET' && pathname === '/api/admin/session') { reply(res,200,auth ? {authenticated:true, csrfToken:auth.csrfToken} : {authenticated:false}); return true; }
      if (!['GET','HEAD'].includes(req.method) && !sameOrigin(req)) { reply(res,403,{error:'Invalid origin'}); return true; }
      if (req.method === 'POST' && pathname === '/api/admin/login') {
        if (!req.headers['content-type']?.startsWith('application/json')) { reply(res,415,{error:'JSON required'}); return true; }
        const input = JSON.parse((await body(req,4096)).toString());
        if (!input || Array.isArray(input) || typeof input !== 'object') { reply(res,400,{error:'Invalid credentials payload'}); return true; }
        if (pendingLogins >= 25) { reply(res,429,{error:'Too many login requests'}); return true; }
        pendingLogins += 1;
        const attempt = async () => {
          if (!credentials) { reply(res,503,{error:'Administrator is not configured'}); return; }
          if (credentials.lockedUntil > now()) { reply(res,429,{error:'Account is locked for 24 hours',lockedUntil:credentials.lockedUntil}); return; }
          if (credentials.lockedUntil) { credentials.failures = 0; credentials.lockedUntil = 0; }
          const password = typeof input.password === 'string' && input.password.length <= 1024 ? input.password : '';
          const hash = await scrypt(password, credentials.salt, 64);
          if (!timingSafeEqual(hash, Buffer.from(credentials.hash,'hex')) || input.username !== credentials.username) {
            credentials.failures += 1;
            if (credentials.failures >= 20) credentials.lockedUntil = now() + DAY;
            await atomicJson(adminPath, credentials);
            reply(res,credentials.lockedUntil ? 429 : 401,{error:credentials.lockedUntil ? 'Account is locked for 24 hours' : 'Invalid username or password', ...(credentials.lockedUntil ? {lockedUntil:credentials.lockedUntil} : {})}); return;
          }
          credentials.failures = 0; credentials.lockedUntil = 0;
          await atomicJson(adminPath, credentials);
          for (const [key,item] of sessions) if (now() - item.seen > 30*60000 || now() - item.created > 12*3600000) sessions.delete(key);
          if (sessions.size >= 10) sessions.delete(sessions.keys().next().value);
          const token = random(), csrfToken = random();
          sessions.set(digest(token), { csrfToken, created:now(), seen:now() });
          res.setHeader('Set-Cookie',`${cookieName}=${token}; Path=/api/admin; HttpOnly; SameSite=Strict; Max-Age=43200${process.env.COOKIE_SECURE === 'true' ? '; Secure' : ''}`);
          reply(res,200,{authenticated:true,csrfToken});
        };
        const pending = loginQueue.then(attempt);
        loginQueue = pending.catch(() => {});
        try { await pending; } finally { pendingLogins -= 1; }
        return true;
      }
      if (!auth) { reply(res,401,{error:'Authentication required'}); return true; }
      if (!['GET','HEAD'].includes(req.method) && req.headers['x-csrf-token'] !== auth.csrfToken) { reply(res,403,{error:'Invalid CSRF token'}); return true; }
      if (req.method === 'POST' && pathname === '/api/admin/logout') {
        sessions.delete(auth.key);
        res.setHeader('Set-Cookie',`${cookieName}=; Path=/api/admin; HttpOnly; SameSite=Strict; Max-Age=0`);
        reply(res,200,{authenticated:false}); return true;
      }
      if (req.method === 'PUT' && pathname === '/api/admin/content') {
        if (!req.headers['content-type']?.startsWith('application/json')) { reply(res,415,{error:'JSON required'}); return true; }
        const content = JSON.parse((await body(req, 2 * 1024 * 1024)).toString());
        validateContent(content);
        if (defaultContent) validateStructure(content, defaultContent);
        await atomicJson(path.join(dataDir,'content.json'),content);
        reply(res,200,{content}); return true;
      }
      if (pathname === '/api/admin/uploads' && req.method === 'GET') {
        const files = await Promise.all((await readdir(uploads)).filter(name => /^[a-f0-9]{48}\.(png|jpg|gif|webp|mp4|webm|mp3|pdf)$/.test(name)).map(async name => ({name,url:`/uploads/${name}`,size:(await stat(path.join(uploads,name))).size})));
        reply(res,200,{files}); return true;
      }
      if (pathname === '/api/admin/uploads' && req.method === 'POST') {
        const bytes = await body(req,25*1024*1024);
        const type = uploadType(bytes);
        if (!type || req.headers['content-type']?.split(';')[0].trim() !== type[1]) { reply(res,415,{error:'Unsupported file type'}); return true; }
        const filename = `${randomBytes(24).toString('hex')}.${type[0]}`;
        await writeFile(path.join(uploads,filename),bytes,{mode:0o600,flag:'wx'});
        reply(res,201,{url:`/uploads/${filename}`}); return true;
      }
      if (pathname.startsWith('/api/admin/uploads/') && req.method === 'DELETE') {
        const filename = pathname.slice('/api/admin/uploads/'.length);
        if (!/^[a-f0-9]{48}\.(png|jpg|gif|webp|mp4|webm|mp3|pdf)$/.test(filename)) { reply(res,400,{error:'Invalid filename'}); return true; }
        await unlink(path.join(uploads,filename)); reply(res,200,{deleted:true}); return true;
      }
      reply(res,404,{error:'Not found'});
    } catch (error) {
      const status = error.status || (error.code === 'ENOENT' ? 404 : error instanceof SyntaxError || ['Content is too complex','Text is too long','Too many items','Unsafe URL','Invalid field','Invalid content','Content must be an object','Invalid content structure'].includes(error.message) ? 400 : 500);
      if (status === 500) console.error('CMS operation failed:', error.code || error.name);
      if (!res.headersSent) reply(res,status,{error:status === 500 ? 'Internal server error' : status === 404 ? 'Not found' : error.message}); else res.destroy();
    }
    return true;
  };
}
