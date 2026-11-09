'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('lifeos-detox-details.js','utf8');
const app=fs.readFileSync('app.js','utf8');
const index=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');

test('all 62 detox days have a unique, actionable detailed guide',()=>{
 const window={};vm.runInNewContext(source,{window});
 const guides=window.DETOX_DAY_DETAILS;
 assert.equal(Object.keys(guides).length,62);
 for(let day=1;day<=62;day++){
  const g=guides[day];
  assert.ok(g,'missing day '+day);
  assert.ok(g.objective.length>20,'day '+day+' objective too short');
  assert.ok(g.why.length>40,'day '+day+' explanation too short');
  assert.ok(g.steps.length>=3,'day '+day+' needs at least 3 steps');
  assert.ok(g.steps.every(step=>step.length>20),'day '+day+' has an underdeveloped step');
  assert.ok(g.check.length>20,'day '+day+' needs a completion criterion');
  assert.ok(g.fallback.length>20,'day '+day+' needs an adaptation path');
 }
});

test('detox detail data is loaded, rendered and available offline',()=>{
 assert.match(index,/lifeos-detox-details\.js\?v=20261109-1/);
 assert.match(index,/lifeos-detox-details\.js/);
 assert.match(app,/window\.DETOX_DAY_DETAILS&&window\.DETOX_DAY_DETAILS\[day\]/);
 assert.match(app,/Подробная методика/);
 assert.match(app,/Критерий выполнения/);
 assert.match(sw,/lifeos-detox-details\.js/);
 assert.match(sw,/const CACHE='life-os-v104'/);
});
