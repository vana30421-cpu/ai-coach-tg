'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const app=fs.readFileSync('app.js','utf8');
const index=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const design=fs.readFileSync('lifeos-ulty-design.css','utf8');

test('habit detail renders an eight-week completion heatmap from saved history',()=>{
 assert.match(app,/function renderHabitHeatmap\(h\)/);
 assert.match(app,/for\(var i=0;i<56;i\+\+\)/);
 assert.match(app,/grid-template-rows:repeat\(7,10px\);grid-auto-flow:column/);
 assert.match(app,/renderHabitHeatmap\(h\)/);
 assert.match(app,/completed\+'\/'\+elapsed/);
});

test('habit cards support horizontal swipe without blocking vertical scrolling',()=>{
 assert.match(app,/data-habit-swipe=/);
 assert.match(app,/function bindHabitSwipe\(\)/);
 assert.match(app,/Math\.abs\(dx\)>58&&Math\.abs\(dx\)>Math\.abs\(dy\)\*1\.3/);
 assert.match(app,/touch-action:pan-y/);
 assert.match(app,/Свайпни карточку влево или вправо/);
 assert.match(app,/bindHabitSwipe\(\);/);
});

test('mobile glass effects keep critical surfaces while reducing blur on dense cards',()=>{
 const start=index.indexOf('<style id="lifeos-glass-performance">');
 const end=index.indexOf('</style>',start);
 assert.ok(start>=0&&end>start);
 const css=index.slice(start,end);
 assert.match(css,/\.card,.list-row,.task-item/);
 assert.match(css,/backdrop-filter:none!important/);
 assert.doesNotMatch(css,/\.method-card|\.modal|\.tab-bar-wrap/);
 assert.match(sw,/const CACHE='life-os-v\d+'/);
 assert.ok(index.includes('lifeos-ulty-design.css?v=20261110-1'));
 assert.ok(sw.includes("'./lifeos-ulty-design.css'"));
 assert.match(design,/One UI 9 inspired glass design system/);
 assert.match(design,/prefers-reduced-motion:reduce/);
});
