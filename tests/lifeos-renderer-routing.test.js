'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const app=fs.readFileSync('app.js','utf8');
const systems=fs.readFileSync('lifeos-systems.js','utf8');

test('navigation prefers the complete global renderer over legacy local stubs',()=>{
 const start=app.indexOf('var renderers = {');
 const end=app.indexOf('};\n  (window.ALL_NEW_COURSES',start);
 assert.ok(start>=0&&end>start);
 const routes=app.slice(start,end);
 const names=[...new Set(systems.split('window.').slice(1).map(part=>part.slice(0,part.indexOf('='))).filter(name=>name.startsWith('render')))];
 for(const name of names){
  if(routes.includes(name))assert.ok(routes.includes('window.'+name+' || '+name),'route must prefer '+name);
 }
 assert.ok(routes.includes('iq: window.renderIQ || renderIQ'));
 assert.ok(routes.includes('finance: window.renderFinance || renderFinance'));
 assert.ok(routes.includes('psychology: window.renderPsychology || renderPsychology'));
});


test('dashboard navigation prefers the wrapped global renderer',()=>{
 const source=fs.readFileSync('app.js','utf8');
 assert.match(source,/dashboard:\s*window\.renderDashboard\s*\|\|\s*renderDashboard/);
});
