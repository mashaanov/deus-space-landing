import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import config from '../ecosystem.config.cjs';

test('PM2 uses fork mode so its configured Node 22 interpreter takes effect', () => {
  const app = config.apps.find(app => app.name === 'novicovs');
  assert.equal(app.exec_mode, 'fork');
  assert.equal(app.instances, 1);
  assert.match(app.interpreter, /node-v22\.[^/]+\/bin\/node$/);
});

test('server refuses unsupported Node runtimes before serving requests', () => {
  const serverUrl = new URL('../server.mjs', import.meta.url).href;
  const result = spawnSync(process.execPath, ['--input-type=module', '--eval', `
    Object.defineProperty(process.versions, 'node', {value:'14.17.6'});
    await import(${JSON.stringify(serverUrl)});
  `], {encoding:'utf8', timeout:5000});
  assert.equal(result.error, undefined);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Node\.js 22 or newer is required; running 14\.17\.6/);
  assert.match(result.stderr, /ecosystem\.config\.cjs/);
  assert.doesNotMatch(result.stdout, /listening/);
});
