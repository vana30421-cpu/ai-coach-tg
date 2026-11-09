'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const worker=fs.readFileSync('workers/jarvis-worker.js','utf8');
const api=fs.readFileSync('functions/api/jarvis.js','utf8');
const app=fs.readFileSync('app.js','utf8');

test('Jarvis Worker exposes authenticated provider health without exposing secrets',()=>{
 assert.match(worker,/request\.method === "GET"/);
 assert.match(worker,/safeEqual\(request\.headers\.get\("X-Jarvis-Access-Code"\), env\.JARVIS_ACCESS_CODE\)/);
 assert.match(worker,/providers: \{ openai: !!env\.OPENAI_API_KEY, gemini: !!env\.GEMINI_API_KEY \}/);
 assert.match(worker,/Access-Control-Allow-Methods": "GET, POST, OPTIONS"/);
});

test('Pages Jarvis endpoint supports the same authenticated health check',()=>{
 assert.match(api,/export async function onRequestGet/);
 assert.match(api,/safeEqual\(request\.headers\.get\("X-Jarvis-Access-Code"\), env\.JARVIS_ACCESS_CODE\)/);
});

test('Jarvis settings offer a connection test and persist the result',()=>{
 assert.match(app,/async function testJarvisConnection\(\)/);
 assert.match(app,/window\.testJarvisConnection=testJarvisConnection/);
 assert.match(app,/onclick="testJarvisConnection\(\)"/);
 assert.match(app,/lastConnectionCheck/);
});
