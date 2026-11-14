'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../lifeos-ulty-design.css',import.meta.url),'utf8');
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const sw=fs.readFileSync(new URL('../sw.js',import.meta.url),'utf8');

test('dashboard exposes an editable tomorrow plan with three priorities and schedule fields',()=>{
 assert.match(app,/План на завтра/);
 for(const id of ['tomorrowPriority1','tomorrowPriority2','tomorrowPriority3','tomorrowSchedule','tomorrowPrep']){
  assert.match(app,new RegExp('id="'+id+'"'));
 }
 assert.match(app,/onclick="saveTomorrowPlan\(\)"/);
 assert.match(app,/window\.saveTomorrowPlan = saveTomorrowPlan/);
});

test('tomorrow plan uses a local calendar date and persists per date without replacing other days',()=>{
 assert.match(app,/tomorrowDate\.setDate\(tomorrowDate\.getDate\(\)\+1\)/);
 assert.match(app,/state\.tomorrowPlans\[key\]=plan/);
 assert.match(app,/if\(!save\(\)\)/);
 assert.match(app,/while\(keys\.length>90\)/);
 assert.match(app,/esc\(tomorrowPlan\.(?:priority1|priority2|priority3|schedule|preparation)/);
});

test('ambient aurora animation is enabled while reduced-motion remains respected',()=>{
 assert.match(css,/body::before\{[^}]*animation:auroraShift 25s ease-in-out infinite alternate!important/s);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.doesNotMatch(css,/body::before\{[^}]*animation:none!important/s);
});

test('front-end asset and offline cache versions are advanced together',()=>{
 assert.match(html,/lifeos-ulty-design\.css\?v=20261114-8/);
 assert.match(html,/LIFEOS-20261114-8/);
 assert.match(sw,/const CACHE='life-os-v203'/);
});
