'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const mod=fs.readFileSync('lifeos-daily-value.js','utf8');
const index=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const app=fs.readFileSync('app.js','utf8');

test('legacy daily-action data remains untouched for backward compatibility',()=>{
 assert.ok(mod.includes("KEY='lifeos_daily_value_v1'"));
 assert.ok(!app.includes("localStorage.removeItem('lifeos_daily_value_v1')"));
 assert.ok(!app.includes('lifeos_daily_value_v1'));
});

test('generic random daily popup is no longer loaded or precached',()=>{
 assert.ok(!index.includes('lifeos-daily-value.js'));
 assert.ok(!sw.includes("'./lifeos-daily-value.js'"));
});

test('dashboard offers a context-aware next step from real profile data',()=>{
 assert.ok(app.includes('window.LIFEOS_INTELLIGENCE_CORE'));
 assert.ok(app.includes('intelligenceCore.analyze(state, today())'));
 assert.ok(app.includes('Следующий полезный шаг'));
 assert.ok(app.includes('nextPending[0]'));
});
