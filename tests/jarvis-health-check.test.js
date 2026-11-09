'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const worker=fs.readFileSync('workers/jarvis-worker.js','utf8');
const app=fs.readFileSync('app.js','utf8');

test('Jarvis Worker exposes an authenticated read-only health check',()=>{
 assert.match(worker,/"Access-Control-Allow-Methods": "GET, POST, OPTIONS"/);
 assert.match(worker,/if \(request\.method === "GET"\)/);
 assert.match(worker,/safeEqual\(request\.headers\.get\("X-Jarvis-Access-Code"\), env\.JARVIS_ACCESS_CODE\)/);
 assert.match(worker,/providers: \{ openai: !!env\.OPENAI_API_KEY, gemini: !!env\.GEMINI_API_KEY \}/);
 assert.match(worker,/rateLimit: !!env\.JARVIS_RATE_LIMITS/);
});

test('Jarvis UI can test Worker connectivity and report provider configuration',()=>{
 assert.match(app,/async function testJarvisConnection\(\)/);
 assert.match(app,/method:'GET',headers:\{'X-Jarvis-Access-Code':code\}/);
 assert.match(app,/d\.lastConnectionCheck=\{at:nowISO\(\),ok:true,provider:provider\}/);
 assert.match(app,/d\.lastConnectionCheck=\{at:nowISO\(\),ok:false,error:/);
 assert.match(app,/id="jarvisTestConnection"/);
 assert.match(app,/window\.testJarvisConnection=testJarvisConnection/);
});
