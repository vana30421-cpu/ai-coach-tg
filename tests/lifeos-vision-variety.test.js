'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const content=fs.readFileSync('content.js','utf8');
const app=fs.readFileSync('app.js','utf8');

test('vision UI uses 28 genuinely distinct curated routines instead of context-renamed copies',()=>{
 const sandbox={window:{},console:{log(){},warn(){},error(){}}};
 vm.runInNewContext(content,sandbox,{filename:'content.js'});
 const core=sandbox.window.VISION_CORE_EXERCISES;
 assert.equal(core.length,28);
 assert.equal(new Set(core.map(x=>x.id)).size,28);
 assert.equal(new Set(core.map(x=>x.title)).size,28);
 assert.ok(core.every(x=>x.title&&x.desc&&x.how&&x.science&&x.seconds>0&&x.category));
});

test('vision dashboard rotates suggestions by date and avoids the last seven completed routines',()=>{
 assert.match(app,/window\.VISION_CORE_EXERCISES/);
 assert.match(app,/routineLog\.slice\(-7\)/);
 assert.match(app,/recentRoutineIds\.indexOf\(candidate\.id\)/);
 assert.match(app,/Разнообразие без обязательств/);
 assert.match(app,/28 разных практик/);
});

test('health-related eye comfort actions do not award XP or streak rewards',()=>{
 const start=app.indexOf('function completeEyeExercise()');
 const end=app.indexOf('\n}',start);
 const handler=app.slice(start,end);
 assert.ok(start>=0&&end>start);
 assert.doesNotMatch(handler,/addXP|addPetXP|streak|routineXpDate/);
});
