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
 assert.match(moduleSource,/current\.schedule\.swimmingDays/);
 assert.match(moduleSource,/window\.lifeOSSetSwimmingDay/);
 assert.match(moduleSource,/if\(!window\.save\(\)\)/);
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

test('swimming-day UI persists selected weekdays, renders the matching date, and rolls back failed saves',()=>{
 const vm=require('node:vm');
 const state={schedule:{times:{},customEvents:[]}};
 const page={html:'',insertAdjacentHTML(_where,html){this.html+=html;}};
 const app={querySelector(){return page;}};
 const window={state,getLifeScheduleDate:()=> '2026-11-23',save:()=>true,toast:()=>{},renderSchedule(){app.innerHTML='<div class="page"></div>';page.html='';}};
 const sandbox={window,document:{getElementById:()=>app},Date};
 vm.runInNewContext(moduleSource,sandbox);
 window.renderSchedule();
 assert.match(page.html,/Отметь дни недели/);
 window.lifeOSSetSwimmingDay(1,true);
 assert.equal(JSON.stringify(state.schedule.swimmingDays),'[1]');
 assert.match(page.html,/Дневной сон — 10 минут/);
 assert.match(page.html,/После бассейна — оставшиеся уроки/);
 window.save=()=>false;
 window.lifeOSSetSwimmingDay(2,true);
 assert.equal(JSON.stringify(state.schedule.swimmingDays),'[1]');
});
