'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const app=fs.readFileSync('app.js','utf8');
const systems=fs.readFileSync('lifeos-systems.js','utf8');

test('navigation prefers the complete global renderer over legacy local stubs',()=>{
 const start=app.indexOf('var renderers = {');
 const end=app.indexOf('};\\n  (window.ALL_NEW_COURSES',start);
 assert.ok(start>=0&&end>start);
 const routes=app.slice(start,end);
 const names=[...systems.matchAll(/window\\.(render\\w+)\\s*=\\s*function/g)].map(match=>match[1]);
 for(const name of names){
  if(new RegExp('\\\\b'+name+'\\\\b').test(routes)){
   assert.match(routes,new RegExp('window\\\\.'+name+'\\\\s*\\\\|\\\\|\\\\s*'+name+'\\\\b'),'route must prefer '+name);
  }
 }
 assert.match(routes,/iq: window\\.renderIQ \\|\\| renderIQ/);
 assert.match(routes,/finance: window\\.renderFinance \\|\\| renderFinance/);
 assert.match(routes,/psychology: window\\.renderPsychology \\|\\| renderPsychology/);
});
