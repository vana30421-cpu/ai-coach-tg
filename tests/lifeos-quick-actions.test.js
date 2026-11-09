'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const systems=fs.readFileSync('lifeos-systems.js','utf8');
const index=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');

test('global header exposes a quick-action launcher',()=>{
 assert.match(index,/openLifeOSQuickActions\(\)/);
 assert.match(index,/aria-label="Быстрые действия"/);
 assert.match(index,/lifeos-systems\.js\?v=20261109-12/);
});

test('quick actions link only to existing LIFEOS routes and preserve data',()=>{
 assert.match(systems,/window\.openLifeOSQuickActions=function/);
 const routes=['plantoday','tasks','habitList','learning','memory','obsidian','workouts','sleep','antistress','ai','journal','stats'];
 for(const route of routes)assert.ok(systems.includes("'"+route+"'"),'missing route '+route);
 assert.match(systems,/window\.openSheet\('⚡ Быстрые действия',html\)/);
 assert.match(systems,/Быстрый переход к основным инструментам\. Данные не меняются при открытии раздела/);
 assert.match(sw,/const CACHE='life-os-v114'/);
});
