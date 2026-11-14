'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const core=require('../lifeos-intelligence-core.js');

test('returns no false alerts for an empty profile and marks missing data',()=>{
 const result=core.analyze({},'2026-11-11');
 assert.deepEqual(result.recommendations,[]);
 assert.equal(result.quality.trackedSections,0);
 assert.equal(result.quality.totalSections,7);
 assert.equal(result.signals.sleepMoodPairedDays,0);
});

test('detects overdue tasks and explains the evidence and next action',()=>{
 const result=core.analyze({tasks:[
  {id:'a',title:'Late',status:'pending',due_date:'2026-11-10'},
  {id:'b',title:'Done',status:'completed',due_date:'2026-11-01'}
 ]},'2026-11-11');
 const item=result.recommendations.find(x=>x.id==='overdue-tasks');
 assert.ok(item);
 assert.match(item.why,/1 просрочено/);
 assert.equal(item.target,'tasks');
 assert.equal(item.timeMinutes,5);
});

test('detects a large active task queue without diagnosing the user',()=>{
 const tasks=Array.from({length:9},(_,i)=>({id:String(i),status:'pending'}));
 const result=core.analyze({tasks},'2026-11-11');
 const item=result.recommendations.find(x=>x.id==='task-overload');
 assert.ok(item);
 assert.match(item.why,/эвристика, а не диагноз/);
});

test('sleep and mood pattern requires seven paired days and is described as correlation',()=>{
 const sleepEntries=[],customMood=[];
 for(let day=1;day<=7;day++){
  const d='2026-11-'+String(day).padStart(2,'0');
  sleepEntries.push({date:d,hours:day<4?5:8});
  customMood.push({date:d,score:day<4?3:8});
 }
 const result=core.analyze({sleepEntries,customMood},'2026-11-11');
 const item=result.recommendations.find(x=>x.id==='sleep-mood-pattern');
 assert.ok(item);
 assert.match(item.detail,/корреляция/);
 assert.match(item.detail,/не доказательство причинности/);
});

test('missing sleep or mood records are not converted to zero values',()=>{
 const result=core.analyze({sleepEntries:[{date:'2026-11-10',hours:7}]},'2026-11-11');
 assert.equal(result.signals.sleepMoodPairedDays,0);
 assert.equal(result.signals.sleepMoodCorrelation,null);
 assert.equal(result.recommendations.some(x=>x.id==='sleep-review'),false);
});


test('ignores cancelled, archived and deleted tasks when calculating active load',()=>{
 const tasks=[
  ...Array.from({length:9},(_,i)=>({id:'active-'+i,status:'pending'})),
  {id:'cancelled',status:'cancelled',due_date:'2026-11-01'},
  {id:'archived',status:'archived',due_date:'2026-11-01'},
  {id:'deleted',status:'deleted',due_date:'2026-11-01'}
 ];
 const result=core.analyze({tasks},'2026-11-11');
 assert.equal(result.signals.activeTasks,9);
 assert.equal(result.signals.overdueTasks,0);
 assert.ok(result.recommendations.some(x=>x.id==='task-overload'));
 assert.ok(!result.recommendations.some(x=>x.id==='overdue-tasks'));
});

test('rejects impossible calendar dates instead of creating false overdue signals',()=>{
 const result=core.analyze({tasks:[
  {id:'bad-date',status:'pending',due_date:'2026-02-31'},
  {id:'valid-date',status:'pending',due_date:'2026-11-10'}
 ]},'2026-11-11');
 assert.equal(result.signals.overdueTasks,1);
 assert.match(result.recommendations.find(x=>x.id==='overdue-tasks').why,/1 просрочено/);
});

test('blank numeric strings remain missing rather than becoming zero',()=>{
 const result=core.analyze({
  sleepEntries:[{date:'2026-11-10',hours:'   '},{date:'2026-11-09',hours:7}],
  customMood:[{date:'2026-11-10',score:' '}]
 },'2026-11-11');
 assert.equal(result.signals.sleepMoodPairedDays,0);
 assert.equal(result.signals.sleepMoodCorrelation,null);
 assert.equal(result.recommendations.some(x=>x.id==='sleep-review'),false);
});
