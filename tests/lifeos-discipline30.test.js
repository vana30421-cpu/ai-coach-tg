'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('lifeos-discipline30.js','utf8');
function boot(initial){
 const app={innerHTML:''};
 const state=initial||{tasks:[{id:'task-1',title:'Keep'}],sleepEntries:[{id:'sleep-1',hours:8}]};
 const window={state,save:()=>true,esc:value=>String(value==null?'':value).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),toast:()=>{},confirm:()=>true};
 const document={getElementById:id=>id==='app'?app:null};
 vm.runInNewContext(source,{window,document,console,Date,Math,String,Number,Array,Object});
 return {window,state,app};
}
test('discipline module parses and is wired into dashboard, navigation and offline cache',()=>{
 const index=fs.readFileSync('index.html','utf8'),app=fs.readFileSync('app.js','utf8'),sw=fs.readFileSync('sw.js','utf8');
 assert.doesNotThrow(()=>new vm.Script(source));
 assert.match(index,/lifeos-discipline30\.js\?v=20261120-1/);
 assert.match(app,/discipline30:\s*window\.renderDiscipline30/);
 assert.match(sw,/\.\/lifeos-discipline30\.js/);
 assert.match(sw,/const CACHE='life-os-v211'/);
});
test('30-day phases have correct boundaries and continue into maintenance',()=>{
 const {window}=boot();
 const api=window.LIFEOS_DISCIPLINE30;
 assert.equal(api.dayNumber('2026-11-01','2026-11-01'),1);
 assert.equal(api.dayNumber('2026-11-01','2026-11-07'),7);
 assert.equal(api.phaseForDay(8).title,'Устойчивость к скуке');
 assert.equal(api.phaseForDay(15).title,'Самоуправление');
 assert.equal(api.phaseForDay(22).title,'Закрепление');
 assert.equal(api.phaseForDay(31).title,'Поддержание');
 assert.equal(api.dayNumber('2026-11-01','2026-12-01'),31);
});
test('discipline state is additive and daily check-ins persist without changing existing records',()=>{
 const {window,state,app}=boot();
 const tasks=state.tasks,sleep=state.sleepEntries;
 window.LIFEOS_DISCIPLINE30.ensure();
 window.discipline30SetCheck('start',true);
 window.discipline30SetField('task','Finish the assignment');
 window.discipline30SetField('startTime','16:30');
 assert.equal(state.discipline30.logs[Object.keys(state.discipline30.logs)[0]].checks.start,true);
 assert.equal(state.discipline30.logs[Object.keys(state.discipline30.logs)[0]].task,'Finish the assignment');
 assert.equal(state.discipline30.logs[Object.keys(state.discipline30.logs)[0]].startTime,'16:30');
 assert.equal(state.tasks,tasks);
 assert.equal(state.sleepEntries,sleep);
 assert.equal(state.tasks[0].id,'task-1');
 assert.equal(state.sleepEntries[0].id,'sleep-1');
 assert.match(app.innerHTML,/Дисциплина 30/);
});
test('a missed day does not erase history and distraction is recorded without a penalty reset',()=>{
 const {window,state}=boot();
 window.LIFEOS_DISCIPLINE30.ensure();
 const first=state.discipline30.startDate;
 window.discipline30RecordSlip();
 assert.equal(state.discipline30.slips,1);
 assert.equal(state.discipline30.startDate,first);
 assert.equal(Object.keys(state.discipline30.logs).length,1);
});
