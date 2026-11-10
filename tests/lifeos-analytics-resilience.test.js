'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const app=fs.readFileSync('app.js','utf8');
const index=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');

test('statistics and Jarvis use a guarded aggregation boundary with visible diagnostics',()=>{
 assert.match(app,/function getSafeLifeStats\(period\)/);
 assert.match(app,/catch\(error\)\{[\s\S]*label:'Аналитика временно недоступна'/);
 assert.match(app,/var a=getSafeLifeStats\(LIFE_STATS_PERIOD\)/);
 assert.match(app,/var a=getSafeLifeStats\(LIFE_STATS_PERIOD\),o=a\.overview/);
 assert.match(app,/if\(a\.error\)html\+='/);
 assert.match(app,/id:'analytics-error'/);
});

test('Jarvis page tolerates legacy profiles without a stats object',()=>{
 assert.match(app,/\(\(state\.stats\|\|\{\}\)\.streak\|\|0\)/);
 assert.match(app,/var analysis=getJarvisAnalytics\(true\),stats=analysis\.analytics\|\|getSafeLifeStats/);
});

test('Jarvis local analytics context and summary use guarded statistics',()=>{
 assert.match(app,/a=getSafeLifeStats\(30\)\|\|\{\}/);
 assert.match(app,/var stats=getSafeLifeStats\(typeof LIFE_STATS_PERIOD/);
 assert.match(app,/function formatJarvisStatsSummary/);
 assert.match(app,/function buildJarvisAppContext/);
});

test('updated analytics assets are versioned and available offline',()=>{
 assert.ok(index.includes('app.js?v=20261110-1'));
 assert.ok(sw.includes('life-os-v138'));
 assert.match(sw,/\.\/app\.js/);
});
