import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { mkdtemp, readFile, writeFile, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { createCms, initializeAdmin, validateContent, validateStructure } from '../server/cms.mjs';

async function fixture(t, seed = {hero:{title:'Initial'}}) {
  const directory = await mkdtemp(path.join(os.tmpdir(),'novicovs-test-'));
  const dataDir = path.join(directory,'data'), defaultContentPath = path.join(directory,'default.json');
  await writeFile(defaultContentPath,JSON.stringify(seed));
  await initializeAdmin(dataDir,'Masha','testing-password-42');
  let time = Date.now();
  let handle = await createCms({dataDir,defaultContentPath,now:()=>time});
  const server = http.createServer((req,res) => handle(req,res,new URL(req.url,'http://localhost').pathname));
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  t.after(async()=>{server.closeAllConnections(); await new Promise(resolve=>server.close(resolve)); await rm(directory,{recursive:true,force:true});});
  async function request(route,options={}) {
    const response = await fetch(origin+route,{...options,headers:{origin,...options.headers}});
    return {status:response.status,headers:response.headers,body:await response.json()};
  }
  const login = (password='testing-password-42') => request('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'Masha',password})});
  return {request,login,dataDir,origin,restart:async()=>{handle=await createCms({dataDir,defaultContentPath,now:()=>time});},advance:amount=>{time+=amount;}};
}
test('authentication, CSRF, content persistence, session expiration and logout',async t=>{
  const f=await fixture(t);
  assert.deepEqual((await f.request('/api/content')).body,{hero:{title:'Initial'}});
  assert.equal((await f.request('/api/admin/uploads')).status,401);
  const denied=await f.request('/api/admin/login',{method:'POST',headers:{origin:'http://evil.example','Content-Type':'application/json'},body:'{}'});
  assert.equal(denied.status,403);
  const login=await f.login();
  assert.equal(login.status,200);
  assert.match(login.headers.get('set-cookie'),/HttpOnly; SameSite=Strict/);
  const cookie=login.headers.get('set-cookie').split(';')[0];
  const headers={cookie,'Content-Type':'application/json'};
  const options={method:'PUT',headers,body:JSON.stringify({hero:{title:'Edited'}})};
  assert.equal((await f.request('/api/admin/content',options)).status,403);
  headers['X-CSRF-Token']=login.body.csrfToken;
  assert.equal((await f.request('/api/admin/content',options)).status,200);
  assert.equal((await f.request('/api/content')).body.hero.title,'Edited');
  assert.equal((await stat(path.join(f.dataDir,'content.json'))).mode & 0o777,0o600);
  options.body=JSON.stringify({hero:{src:'javascript:alert(1)'}});
  assert.equal((await f.request('/api/admin/content',options)).status,400);
  f.advance(31*60000);
  assert.equal((await f.request('/api/admin/session',{headers:{cookie}})).body.authenticated,false);
  await f.restart();
  assert.equal((await f.request('/api/content')).body.hero.title,'Edited');
  const next=await f.login();
  const nextCookie=next.headers.get('set-cookie').split(';')[0];
  assert.equal((await f.request('/api/admin/logout',{method:'POST',headers:{cookie:nextCookie,'X-CSRF-Token':next.body.csrfToken}})).status,200);
  assert.equal((await f.request('/api/admin/session',{headers:{cookie:nextCookie}})).body.authenticated,false);
});
test('20 concurrent failures persist lockout over restarts and unlock after 24 hours',async t=>{
  const f=await fixture(t);
  const replies=await Promise.all(Array.from({length:20},()=>f.login('wrong')));
  assert.equal(replies.filter(reply=>reply.status===401).length,19);
  assert.equal(replies.filter(reply=>reply.status===429).length,1);
  await f.restart();
  assert.equal((await f.login()).status,429);
  const saved=JSON.parse(await readFile(path.join(f.dataDir,'admin.json'),'utf8'));
  assert.equal(saved.failures,20);
  assert.equal(saved.password,undefined);
  f.advance(86400001);
  assert.equal((await f.login()).status,200);
});
test('uploads require valid media magic and cannot traverse storage',async t=>{
  const f=await fixture(t),login=await f.login();
  const headers={cookie:login.headers.get('set-cookie').split(';')[0],'X-CSRF-Token':login.body.csrfToken,'Content-Type':'image/png','X-File-Name':'../../admin.json'};
  assert.equal((await f.request('/api/admin/uploads',{method:'POST',headers,body:'<script>alert(1)</script>'})).status,415);
  const bytes=Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),Buffer.alloc(20)]);
  const upload=await f.request('/api/admin/uploads',{method:'POST',headers,body:bytes});
  assert.equal(upload.status,201);
  assert.match(upload.body.url,/^\/uploads\/[a-f0-9]{48}\.png$/);
  const files=await f.request('/api/admin/uploads',{headers});
  assert.equal(files.body.files.length,1);
  assert.equal((await f.request('/api/admin/uploads/%2e%2e%2fadmin.json',{method:'DELETE',headers})).status,400);
  assert.equal((await f.request('/api/admin/uploads/'+files.body.files[0].name,{method:'DELETE',headers})).status,200);
});

test('uploaded videos support bounded, open-ended and suffix byte ranges for seeking', async t => {
  const f = await fixture(t), login = await f.login();
  const headers = {cookie:login.headers.get('set-cookie').split(';')[0], 'X-CSRF-Token':login.body.csrfToken, 'Content-Type':'video/mp4'};
  const bytes = Buffer.concat([Buffer.from([0,0,0,24]), Buffer.from('ftypisom'), Buffer.from(Array.from({length:64}, (_, i) => i))]);
  const upload = await f.request('/api/admin/uploads', {method:'POST', headers, body:bytes});
  assert.equal(upload.status, 201);
  const url = f.origin + upload.body.url;
  const full = await fetch(url);
  assert.equal(full.status, 200);
  assert.equal(full.headers.get('accept-ranges'), 'bytes');
  assert.equal(full.headers.get('content-range'), null);
  assert.equal(full.headers.get('content-type'), 'video/mp4');
  assert.equal(full.headers.get('content-security-policy'), "sandbox; default-src 'none'");
  assert.equal(full.headers.get('content-length'), String(bytes.length));
  assert.deepEqual(Buffer.from(await full.arrayBuffer()), bytes);

  for (const [range, start, end] of [
    ['bytes=0-0', 0, 0], ['bytes=4-11', 4, 11],
    ['bytes=12-', 12, bytes.length - 1], ['bytes=-10', bytes.length - 10, bytes.length - 1],
    ['bytes=60-999', 60, bytes.length - 1], ['bytes=-999', 0, bytes.length - 1],
    ['bytes=1-99999999999999999999999999999999999999', 1, bytes.length - 1],
    ['bytes=-99999999999999999999999999999999999999', 0, bytes.length - 1],
  ]) {
    const response = await fetch(url, {headers:{Range:range}});
    assert.equal(response.status, 206, range);
    assert.equal(response.headers.get('accept-ranges'), 'bytes');
    assert.equal(response.headers.get('content-range'), `bytes ${start}-${end}/${bytes.length}`);
    assert.equal(response.headers.get('content-length'), String(end - start + 1));
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), bytes.subarray(start, end + 1));
  }

  for (const range of [`bytes=${bytes.length}-`, 'bytes=99999999999999999999999999999999999999-', 'bytes=-0']) {
    const response = await fetch(url, {headers:{Range:range}});
    assert.equal(response.status, 416, range);
    assert.equal(response.headers.get('content-range'), `bytes */${bytes.length}`);
    assert.equal(response.headers.get('content-length'), '0');
    assert.equal((await response.arrayBuffer()).byteLength, 0);
  }

  // Unsupported/malformed ranges are ignored; HEAD always describes the full representation.
  for (const range of ['bytes=0-1,4-5', 'bytes=10-1', 'bytes=-', 'bytes=Infinity-', 'items=0-2', 'bytes=1.5-2', `bytes=${'9'.repeat(1100)}-`]) {
    const response = await fetch(url, {headers:{Range:range}});
    assert.equal(response.status, 200, range);
    assert.equal(response.headers.get('content-range'), null);
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), bytes);
  }
  for (const range of [undefined, 'bytes=0-1', `bytes=${bytes.length}-`]) {
    const response = await fetch(url, {method:'HEAD', headers:range ? {Range:range} : {}});
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('accept-ranges'), 'bytes');
    assert.equal(response.headers.get('content-length'), String(bytes.length));
    assert.equal(response.headers.get('content-range'), null);
    assert.equal((await response.arrayBuffer()).byteLength, 0);
  }
  const conditional = await fetch(url, {headers:{Range:'bytes=0-1', 'If-Range':'"unknown-validator"'}});
  assert.equal(conditional.status, 200);
  assert.deepEqual(Buffer.from(await conditional.arrayBuffer()), bytes);
});
test('content rejects dangerous URLs, prototype keys and excessive nesting',()=>{
  for (const url of ['javascript:alert(1)','data:text/html,test','//evil.test','java\nscript:test','vbscript:alert(1)']) assert.throws(()=>validateContent({link:url}));
  assert.throws(()=>validateContent(JSON.parse('{"__proto__":{}}')));
  let nested={};for(let i=0;i<20;i++) nested={nested};
  assert.throws(()=>validateContent(nested));
  assert.doesNotThrow(()=>validateContent({description:'Text with javascript: as an explanation',href:'https://example.org/test'}));
});

test('schema enforces renderer structures while allowing empty and reordered blocks',()=>{
  const template={home:{blocks:[{type:'hero',title:'hello'},{type:'stats',items:[{label:'test'}]}]},groups:[{name:'test',repertoire:[]}]};
  assert.doesNotThrow(()=>validateStructure({home:{blocks:[]},groups:[]},template));
  assert.doesNotThrow(()=>validateStructure({home:{blocks:[{type:'stats',items:[]},{type:'hero',title:''}]},groups:[{name:'x',repertoire:['song']}]},template));
  assert.throws(()=>validateStructure({home:null,groups:[]},template));
  assert.throws(()=>validateStructure({home:{blocks:[{type:'stats',items:null}]},groups:[]},template));
  assert.throws(()=>validateStructure({home:{blocks:[{type:'unknown'}]},groups:[]},template));
  assert.throws(()=>validateStructure({home:{blocks:[]},groups:[{name:'x',repertoire:[{}]}]},template));
});

test('schema validates without Object.hasOwn and still rejects inherited fields', () => {
  const hasOwn = Object.hasOwn;
  try {
    // The production PM2 process previously used Node 14, which has no Object.hasOwn.
    Object.hasOwn = undefined;
    const template = {hero:{image:''}};
    assert.doesNotThrow(() => validateStructure({hero:{image:'/uploads/example.jpg'}}, template));
    const inherited = Object.assign(Object.create({image:''}), {unexpected:''});
    assert.throws(() => validateStructure({hero:inherited}, template), /Invalid content structure/);
  } finally {
    Object.hasOwn = hasOwn;
  }
});

test('uploaded home image saves, survives restart and serves the original bytes', async t => {
  const seed = JSON.parse(await readFile(new URL('../content/default-content.json', import.meta.url), 'utf8'));
  const f = await fixture(t, seed);
  const login = await f.login();
  const headers = {cookie:login.headers.get('set-cookie').split(';')[0], 'X-CSRF-Token':login.body.csrfToken};
  const bytes = await readFile(new URL('../public/media/test1.jpg', import.meta.url));
  const upload = await f.request('/api/admin/uploads', {method:'POST', headers:{...headers, 'Content-Type':'image/jpeg'}, body:bytes});
  assert.equal(upload.status, 201);
  const edited = structuredClone(seed);
  edited.home.blocks.find(block => block.type === 'hero').image = upload.body.url;
  const saved = await f.request('/api/admin/content', {method:'PUT', headers:{...headers, 'Content-Type':'application/json'}, body:JSON.stringify(edited)});
  assert.equal(saved.status, 200);
  await f.restart();
  assert.deepEqual((await f.request('/api/content')).body, edited);
  const image = await fetch(f.origin + upload.body.url);
  assert.equal(image.status, 200);
  assert.equal(image.headers.get('content-type'), 'image/jpeg');
  assert.deepEqual(Buffer.from(await image.arrayBuffer()), bytes);
});

test('production seed content validates and roundtrips all editable sections', async t => {
  const seed = JSON.parse(await readFile(new URL('../content/default-content.json', import.meta.url), 'utf8'));
  validateContent(seed);
  validateStructure(seed, seed);
  const edited = structuredClone(seed);
  edited.groups[0].repertoire = ['Новая песня'];
  edited.groupLabels.instagram = 'Мы в Instagram';
  edited.groupLabels.youtube = 'Мы на YouTube';
  edited.home.blocks = [...edited.home.blocks].reverse();
  validateContent(edited);
  validateStructure(edited, seed);
  const f = await fixture(t, seed);
  const login = await f.login();
  const response = await f.request('/api/admin/content', {method:'PUT', headers:{cookie:login.headers.get('set-cookie').split(';')[0], 'X-CSRF-Token':login.body.csrfToken, 'Content-Type':'application/json'}, body:JSON.stringify(edited)});
  assert.equal(response.status, 200);
  await f.restart();
  assert.deepEqual((await f.request('/api/content')).body, edited);
});
