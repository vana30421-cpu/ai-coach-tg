'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const workerSource = fs.readFileSync('workers/jarvis-worker.js', 'utf8');
const executableSource = workerSource.replace(/^export default\s+/m, 'globalThis.__worker = ');

function createWorker(fetchImpl) {
  const sandbox = { Response, TextEncoder, URL, Date, Math, fetch: fetchImpl };
  vm.runInNewContext(executableSource, sandbox, { filename: 'workers/jarvis-worker.js' });
  return sandbox.__worker;
}
function request(body, options) {
  options = options || {};
  const headers = new Headers(options.headers || {});
  if (options.origin !== false && !headers.has('Origin')) headers.set('Origin', 'https://lifeos.example');
  if (options.code !== false && !headers.has('X-Jarvis-Access-Code')) headers.set('X-Jarvis-Access-Code', 'test-secret');
  return {
    method: options.method || 'POST',
    headers,
    text: async () => typeof body === 'string' ? body : JSON.stringify(body)
  };
}
const env = { ALLOWED_ORIGIN: 'https://lifeos.example', JARVIS_ACCESS_CODE: 'test-secret', GEMINI_API_KEY: 'gemini-secret', GEMINI_MODEL: 'gemini-test-model' };

test('worker source parses as a JavaScript module after its default export wrapper', () => {
  assert.match(executableSource, /globalThis\.__worker = \{/);
  assert.doesNotThrow(() => new vm.Script(executableSource));
});

test('Gemini request is authenticated, uses server secret and converts assistant history to model role', async () => {
  let called = null;
  const worker = createWorker(async (url, init) => {
    called = { url: String(url), init };
    return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: 'Gemini отвечает.' }] } }] }), { status: 200 });
  });
  const res = await worker.fetch(request({
    provider: 'gemini',
    message: 'Продолжи анализ',
    history: [{ role: 'user', content: 'Привет' }, { role: 'assistant', content: 'Здравствуйте' }],
    context: { tasks: { active: 3 } }
  }), env);
  const data = await res.json();
  assert.equal(res.status, 200);
  assert.equal(data.provider, 'gemini');
  assert.equal(data.reply, 'Gemini отвечает.');
  assert.match(called.url, /gemini-test-model:generateContent$/);
  assert.equal(called.init.headers['x-goog-api-key'], 'gemini-secret');
  const payload = JSON.parse(called.init.body);
  assert.deepEqual(payload.contents.map(x => x.role), ['user', 'model', 'user']);
  assert.match(payload.systemInstruction.parts[0].text, /tasks/);
});

test('Gemini reports a clear configuration error when its secret is missing', async () => {
  const worker = createWorker(async () => { throw new Error('fetch must not run'); });
  const res = await worker.fetch(request({ provider: 'gemini', message: 'Тест' }), { ...env, GEMINI_API_KEY: '' });
  assert.equal(res.status, 503);
  assert.equal((await res.json()).error, 'PROVIDER_NOT_CONFIGURED');
});

test('wrong access code is rejected before contacting the provider', async () => {
  let calls = 0;
  const worker = createWorker(async () => { calls++; throw new Error('unexpected'); });
  const req = request({ provider: 'gemini', message: 'Тест' }, { code: false });
  req.headers.set('X-Jarvis-Access-Code', 'wrong');
  const res = await worker.fetch(req, env);
  assert.equal(res.status, 401);
  assert.equal(calls, 0);
});

test('request size is checked from actual body even when Content-Length is absent', async () => {
  const worker = createWorker(async () => { throw new Error('provider must not run'); });
  const req = request('x'.repeat(24001));
  const res = await worker.fetch(req, env);
  assert.equal(res.status, 413);
  assert.equal((await res.json()).error, 'REQUEST_TOO_LARGE');
});

test('disallowed browser origins are rejected', async () => {
  const worker = createWorker(async () => { throw new Error('provider must not run'); });
  const req = request({ provider: 'gemini', message: 'Тест' });
  req.headers.set('Origin', 'https://attacker.example');
  const res = await worker.fetch(req, env);
  assert.equal(res.status, 403);
});
