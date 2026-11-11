'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('lifeos-rad-method.js','utf8');
const index=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const renderer=fs.readFileSync('lifeos-learning-experience.js','utf8');
const context={window:{ALL_NEW_COURSES:[]}};
vm.runInNewContext(source,context,{timeout:1000});
const courses=context.window.ALL_NEW_COURSES;
const radLibrary=context.window.LIFEOS_RAD_LIBRARY;
const course=courses.find(c=>c.id==='rad_god_mode');
test('RAD track registers 16 modules and 48 original lessons',()=>{
 assert.ok(course);
 assert.equal(course.modules.length,16);
 assert.equal(course.modules.reduce((n,m)=>n+m.lessons.length,0),48);
 const ids=course.modules.map(m=>m.id);
 assert.equal(new Set(ids).size,8);
 for(const m of course.modules){
  assert.ok(m.title&&m.desc);
  for(const l of m.lessons){
   assert.ok(l.title&&l.objective&&l.theory&&l.practice&&l.metric&&l.quiz);
   assert.equal(l.steps.length,3);
   assert.ok(l.quiz.correctIndex>=0&&l.quiz.correctIndex<l.quiz.options.length);
   assert.ok(l.sources.some(s=>s.url==='https://www.youtube.com/@rad.gilmanov'));
   assert.ok(l.sources.some(s=>s.url==='https://radgilmanov.ru/rezhim_boga'));
  }
 }
});
test('RAD public resource library and challenge templates are registered',()=>{
 assert.ok(radLibrary);
 assert.equal(radLibrary.resources.length,4);
 assert.ok(radLibrary.publicTopics.length>=15);
 assert.ok(radLibrary.challengeTemplates.length>=7);
 assert.ok(radLibrary.resources.some(x=>x.url==='https://www.youtube.com/@rad.gilmanov'));
});
test('RAD track has safety boundaries and no income guarantees',()=>{
 const all=course.modules.flatMap(m=>m.lessons).map(l=>l.theory+' '+l.practice).join(' ');
 assert.match(all,/не является медицинской диагностикой|обратись к врачу|обратись за медицинской помощью/i);
 assert.match(all,/не являются гарантией заработка|не должны вытеснять здоровье/i);
});
test('RAD course is loaded before renderer and cached for offline use',()=>{
 assert.ok(index.indexOf('lifeos-rad-method.js?v=1')<index.indexOf('lifeos-learning-experience.js'));
 assert.ok(sw.includes("'./lifeos-rad-method.js'"));
 assert.match(sw,/life-os-v169/);
 assert.match(renderer,/Цель урока/);
 assert.match(renderer,/Критерий усвоения/);
});
