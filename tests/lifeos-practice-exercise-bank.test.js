'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'..','lifeos-practice-exercise-bank.js'),'utf8');
function load(){const root={};vm.runInNewContext(source,{window:root,globalThis:root});return root;}
test('practice bank publishes exactly 800 distinct tasks for each track',()=>{
 const api=load().LIFEOS_PRACTICE_BANK;
 assert.deepEqual(JSON.parse(JSON.stringify(api.targets)),{javascript:800,python:800,english:800});
 for(const track of ['javascript','python','english']){
  const rows=api.banks[track];
  assert.equal(rows.length,800,track+' count');
  assert.equal(new Set(rows.map(x=>x.id)).size,800,track+' IDs');
  assert.equal(new Set(rows.map(x=>x.title)).size,800,track+' titles');
  assert.equal(new Set(rows.map(x=>x.prompt)).size,800,track+' prompts');
  for(const item of rows){
   assert.ok(item.objective.length>=20);
   assert.ok(item.prompt.length>=100);
   assert.ok(item.deliverable.length>=30);
   assert.equal(item.acceptanceCriteria.length,3);
   assert.ok(item.assessment.length>=40);
   assert.ok(item.source.startsWith('https://'));
   assert.ok(item.estimatedMinutes>=15);
  }
 }
});
test('practice bank covers all eight distinct assessment modes in each track',()=>{
 const api=load().LIFEOS_PRACTICE_BANK;
 const expected={
  javascript:['implement','debug','tests','refactor','performance','security','review','design'],
  python:['implement','debug','tests','refactor','performance','security','review','design'],
  english:['speaking','writing','listening','reading','grammar','vocabulary','pronunciation','mediation']
 };
 for(const track of Object.keys(expected)){
  const types=[...new Set(api.banks[track].map(x=>x.type))].sort();
  assert.deepEqual(types,expected[track].slice().sort());
  for(const type of expected[track])assert.equal(api.banks[track].filter(x=>x.type===type).length,100);
 }
});
test('exercise records have stable IDs and do not share the lesson progress namespace',()=>{
 const api=load().LIFEOS_PRACTICE_BANK;
 const ids=Object.values(api.banks).flat().map(x=>x.id);
 assert.equal(new Set(ids).size,2400);
 assert.equal(api.version,1);
 assert.deepEqual(JSON.parse(JSON.stringify(api.targets)),{javascript:800,python:800,english:800});
});
