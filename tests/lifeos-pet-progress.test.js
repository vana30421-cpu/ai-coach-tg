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
 const pet=systems.slice(systems.indexOf('function ensurePet()'),systems.indexOf('window.renderPet=function'));
 vm.createContext(sandbox);
 vm.runInContext(section('function addPetXP(amount){','/* ============ ДЕТОКС ХАБ ============ */')+'\n'+section('function addXP(amount, source){','/* ============ АГРЕГАТОР ============ */')+';this.run=addXP;',sandbox);
 return sandbox;
}

test('pet receives a small bounded share of XP from real LIFEOS progress',()=>{
 const w=runWithPet(true);
 w.run(10,'learning');
 assert.equal(w.state.gamification.xp,10);
 assert.equal(w.state.pet.xp,2);
 w.run(25,'task');
 assert.equal(w.state.pet.xp,7);
 assert.equal(w.state.gamification.xp,35);
});

test('pet growth can be disabled without affecting LIFEOS progress',()=>{
 const w=runWithPet(false);
 w.run(20,'task');
 assert.equal(w.state.gamification.xp,20);
 assert.equal(w.state.pet.xp,0);
});

test('pet UI explains both care actions and progress from useful activity',()=>{
 assert.match(systems,/Питомец растёт за полезные действия в LIFEOS и заботу о нём/);
 assert.match(source,/addPetXP\(Math\.max\(1,Math\.floor\(Number\(amount\)\/5\)\)\)/);
});
