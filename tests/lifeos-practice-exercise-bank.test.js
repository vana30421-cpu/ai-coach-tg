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
   assert.ok(item.variantIndex>=1&&item.variantIndex<=5);
   assert.ok(item.variantLabel.length>=5);
   assert.ok(item.prompt.includes('Вариант «'+item.variantLabel+'»'));
   assert.ok(item.prompt.includes('Проверяемая ситуация:'));
   assert.ok(item.acceptanceCriteria.every(x=>x.length>=40));
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
 assert.equal(api.version,2);
 assert.deepEqual(JSON.parse(JSON.stringify(api.targets)),{javascript:800,python:800,english:800});
});

test('each track has five materially different case variants with balanced coverage',()=>{
 const api=load().LIFEOS_PRACTICE_BANK;
 const labels={
  javascript:['Базовый сценарий','Граничные данные','Сбой и восстановление','Изменение требования','Передача в production'],
  python:['Базовый сценарий','Граничные данные','Сбой и восстановление','Изменение требования','Передача в production'],
  english:['Свободное выполнение','Ограничение времени','Смена аудитории и регистра','Уточнение и несогласие','Синтез и перенос']
 };
 for(const track of Object.keys(labels)){
  const rows=api.banks[track];
  for(let i=1;i<=5;i++){
   const group=rows.filter(x=>x.variantIndex===i);
   assert.equal(group.length,160,track+' variant '+i);
   assert.ok(group.every(x=>x.variantLabel===labels[track][i-1]));
  }
  for(const item of rows){
   assert.ok(item.prompt.includes(item.module));
   assert.ok(item.deliverable.includes('Дополнительно:'));
  }
 }
});
test('English and engineering tasks specify their actual assessment method',()=>{
 const api=load().LIFEOS_PRACTICE_BANK;
 for(const item of api.banks.english){
  assert.match(item.prompt,/открыт(ый|ого) аудио|открытый текст|устное выступление|законченный текст|грамматик|словосочетан|запись|источник/i);
  assert.match(item.assessment,/0–5/);
 }
 for(const track of ['javascript','python']){
  for(const item of api.banks[track]){
   assert.match(item.assessment,/0–5/);
   assert.match(item.prompt,/первопричину|risk-based|baseline|публичный контракт|внешнее поведение|активы|design note|ревью/i);
  }
 }
});
