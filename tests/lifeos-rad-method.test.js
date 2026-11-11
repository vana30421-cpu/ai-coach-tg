'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('lifeos-rad-method.js','utf8');
const index=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const context={window:{ALL_NEW_COURSES:[]}};
vm.runInNewContext(source,context,{timeout:1000});
const courses=context.window.ALL_NEW_COURSES;
const course=courses.find(c=>c.id==='rad_god_mode');
test('RAD track registers eight practical modules and 24 original lessons',()=>{
 assert.ok(course);
 assert.equal(course.modules.length,8);
 assert.equal(course.modules.reduce((n,m)=>n+m.lessons.length,0),24);
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
test('RAD track has safety boundaries and no income guarantees',()=>{
 const all=course.modules.flatMap(m=>m.lessons).map(l=>l.theory+' '+l.practice).join(' ');
 assert.match(all,/не является медицинской диагностикой|обратись к врачу|обратись за медицинской помощью/i);
 assert.match(all,/не являются гарантией заработка|не должны вытеснять здоровье/i);
});
test('RAD course is loaded before renderer and cached for offline use',()=>{
 assert.ok(index.indexOf('lifeos-rad-method.js?v=1')<index.indexOf('lifeos-learning-experience.js'));
 assert.ok(sw.includes("'./lifeos-rad-method.js'"));
 assert.match(sw,/life-os-v169/);
});
