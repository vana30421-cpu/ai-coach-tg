'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('lifeos-recovery-coach.js','utf8');
test('recovery coach parses and is wired into the real recovery route and offline cache',()=>{
 const index=fs.readFileSync('index.html','utf8'),sw=fs.readFileSync('sw.js','utf8');
 assert.doesNotThrow(()=>new vm.Script(source));
 assert.match(index,/lifeos-recovery-coach\.js\?v=20261117-1/);
 assert.match(sw,/\.\/lifeos-recovery-coach\.js/);
 assert.match(sw,/const CACHE='life-os-v210'/);
});
test('recovery checklist persists per date without changing sleep history',()=>{
 const state={sleepEntries:[{id:'sleep-1',date:'2026-11-17',hours:8,quality:8}],recoveryRoutineByDate:{}};
 const app={innerHTML:''};
 const sandbox={window:{state,today:()=> '2026-11-17',save:()=>true,toast:()=>{}},document:{getElementById:()=>app}};
 vm.runInNewContext(source,sandbox);
 sandbox.window.setRecoveryCheck('light',true);
 assert.equal(state.recoveryRoutineByDate['2026-11-17'].light,true);
 assert.equal(state.sleepEntries.length,1);
 assert.equal(state.sleepEntries[0].id,'sleep-1');
 assert.equal(state.sleepEntries[0].hours,8);
 sandbox.window.setRecoveryBedtime('22:45');
 assert.equal(state.recoverySettings.bedtime,'22:45');
});
test('recovery coach never recommends sleep restriction and retains the 8–10 hour adolescent target',()=>{
 assert.match(source,/8–10 ч/);
 assert.match(source,/не урезай сон/);
 assert.match(source,/30–60 минут/);
 assert.match(source,/15–30 минут/);
});
