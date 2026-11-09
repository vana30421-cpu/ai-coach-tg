'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('app.js','utf8');
const systems=fs.readFileSync('lifeos-systems.js','utf8');

function section(start,end){const a=source.indexOf(start),b=source.indexOf(end,a);assert.ok(a>=0&&b>a);return source.slice(a,b);}
function runWithPet(enabled){
 const sandbox={
  state:{pet:{enabled:enabled,xp:0,stage:1},gamification:{xp:0,level:1,sources:{},xpHistory:[]},leagues:{weeklyXp:0}},
  window:{PET_STAGES:[{id:1,minXP:0,maxXP:100},{id:2,minXP:100,maxXP:300}]},
  defaultState:()=>({gamification:{xp:0,level:1,sources:{},xpHistory:[]},leagues:{weeklyXp:0}}),
  getXPForLevel:level=>level*1000,today:()=> '2026-11-09',nowISO:()=> '2026-11-09T12:00:00.000Z',
  save:()=>{},toast:()=>{},haptic:()=>{}
 };
 vm.createContext(sandbox);
 vm.runInContext(section('function addPetXP(amount){','/* ============ ДЕТОКС ХАБ ============ */')+'\n'+section('function addXP(amount, source){','/* ============ АГРЕГАТОР ============ */')+';this.run=addXP;this.petReward=addPetXP;',sandbox);
 return sandbox;
}

test('pet XP is not automatically duplicated by the generic XP ledger',()=>{
 const w=runWithPet(true);
 w.run(10,'learning');
 assert.equal(w.state.gamification.xp,10);
 assert.equal(w.state.pet.xp,0);
 w.petReward(3);
 assert.equal(w.state.pet.xp,3);
});

test('pet growth can be disabled without affecting LIFEOS progress',()=>{
 const w=runWithPet(false);
 w.run(20,'task');w.petReward(3);
 assert.equal(w.state.gamification.xp,20);
 assert.equal(w.state.pet.xp,0);
});

test('pet UI explains both care actions and progress from useful activity',()=>{
 assert.match(systems,/Питомец растёт за полезные действия в LIFEOS и заботу о нём/);
 const addXp=section('function addXP(amount, source){','/* ============ АГРЕГАТОР ============ */');
 assert.doesNotMatch(addXp,/addPetXP/,'generic XP ledger must not double-award pet progress');
 assert.match(source,/addXP\(10, 'sphere_score'\);addPetXP\(2\)/);
 assert.match(source,/addXP\(20, 'lesson'\);\s*addPetXP\(3\)/);
 assert.match(source,/addXP\(8,'workout'\);addPetXP\(3\)/);
 assert.match(systems,/if\(completed&&window\.addXP\)window\.addXP\(5,'antistress'\);if\(completed&&window\.addPetXP\)window\.addPetXP\(2\)/);
});
