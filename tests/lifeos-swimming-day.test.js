'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const moduleSource=fs.readFileSync(path.join(root,'lifeos-swimming-day.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const state=fs.readFileSync(path.join(root,'PROJECT_STATE.md'),'utf8');

test('swimming-day settings are additive and persisted in the existing schedule state',()=>{
 assert.match(moduleSource,/state\.schedule\.swimmingDays/);
 assert.match(moduleSource,/window\.lifeOSSetSwimmingDay/);
 assert.match(moduleSource,/if\(!save\(\)\)/);
 assert.match(moduleSource,/window\.renderSchedule=function\(\)/);
});

test('swimming weekdays are configurable and mapped to the selected local date',()=>{
 assert.match(moduleSource,/DAY_VALUES=\[1,2,3,4,5,6,0\]/);
 assert.match(moduleSource,/settings\.swimmingDays\.indexOf\(weekday\)>=0/);
 assert.match(moduleSource,/onchange="lifeOSSetSwimmingDay\(/);
});

test('swimming-day plan includes the agreed short blocks and preserves all lessons',()=>{
 for(const phrase of ['Дневной сон — 10 минут','10 минут спокойной паузы','Планирование — 5 минут','Подготовка к бассейну — 5 минут','приоритетные уроки','оставшиеся уроки']){
  assert.ok(moduleSource.includes(phrase), 'missing: '+phrase);
 }
 assert.match(moduleSource,/без автоматического уменьшения нагрузки/);
 assert.doesNotMatch(moduleSource,/Перекус|Отдельное восстановление|Душ/);
});

test('new module is loaded after the schedule renderer and precached offline',()=>{
 assert.match(html,/lifeos-calendar-v2\.js[\s\S]*lifeos-swimming-day\.js\?v=20261123-1/);
 assert.match(html,/sw\.js\?v=20261123-1/);
 assert.match(sw,/const CACHE='life-os-v211'/);
 assert.match(sw,/\.\/lifeos-swimming-day\.js/);
 assert.match(state,/Swimming-day schedule template/);
});
