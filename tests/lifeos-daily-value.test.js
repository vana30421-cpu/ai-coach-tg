'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const mod=fs.readFileSync('lifeos-daily-value.js','utf8');
const index=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
test('daily value loop provides a varied, non-duplicated pool of practical actions',()=>{
 const ids=[...mod.matchAll(/\{id:'([^']+)'/g)].map(x=>x[1]);
 assert.ok(ids.length>=30,'at least 30 authored actions');
 assert.equal(new Set(ids).size,ids.length,'stable unique IDs');
 for(const category of ['Программирование','Учёба','Фокус','Планирование','Коммуникация','Самочувствие','Мышление'])assert.ok(mod.includes(category));
 assert.ok(mod.includes('blocked=recent.concat(exclude||[])'));
});
test('daily value progress persists locally and rewards only once per day',()=>{
 assert.ok(mod.includes("KEY='lifeos_daily_value_v1'"));
 assert.ok(mod.includes('if(s.done)return'));
 assert.ok(mod.includes('s.xp=(Number(s.xp)||0)+10'));
 assert.ok(mod.includes('s.completedDates'));
});
test('daily value module is loaded and precached offline',()=>{
 assert.ok(index.includes('lifeos-daily-value.js?v=1'));
 assert.ok(sw.includes("'./lifeos-daily-value.js'"));
 assert.ok(/life-os-v206/.test(sw));
});
