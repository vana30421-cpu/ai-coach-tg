'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root={ALL_NEW_COURSES:[]};
const context={window:root,globalThis:root};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..','lifeos-engineering-language-academies.js'),'utf8'),context);
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..','lifeos-programming-zero-start.js'),'utf8'),context);
test('JavaScript and Python academies begin with an absolute-zero module',()=>{
 const academy=root.LIFEOS_ENGINEERING_ACADEMIES;
 const js=academy.courses.find(c=>c.id==='javascript_engineering_1000');
 const py=academy.courses.find(c=>c.id==='python_engineering_1000');
 assert.equal(js.modules[0].id,'js-zero-start');
 assert.equal(py.modules[0].id,'py-zero-start');
 assert.equal(js.modules[0].lessons.length,10);
 assert.equal(py.modules[0].lessons.length,10);
 assert.match(js.modules[0].lessons[0].title,/что такое код/i);
 assert.match(py.modules[0].lessons[0].title,/что такое код/i);
});
test('beginner lessons explain code before asking for independent development work',()=>{
 const beginner=root.LIFEOS_PROGRAMMING_ZERO;
 for(const track of [beginner.javascript,beginner.python]){
  assert.equal(track.length,10);
  for(const lesson of track){
   assert.ok(lesson.objective.length>=20);
   assert.ok(lesson.theory.length>=120);
   assert.ok(lesson.practice.length>=30);
   assert.equal(lesson.taskInstructions.length,4);
   assert.match(lesson.deliverable,/установка.*не требуется/i);
   assert.equal(lesson.quiz.options.length,3);
   assert.ok(lesson.quiz.correctIndex>=0&&lesson.quiz.correctIndex<3);
   assert.ok(lesson.quiz.answerExplanation.length>=40);
   assert.ok(lesson.sources[0].url.startsWith('https://'));
  }
 }
});
test('the first beginner lesson teaches what code is and does not demand a local toolchain',()=>{
 const first=root.LIFEOS_PROGRAMMING_ZERO.javascript[0];
 assert.match(first.theory,/команд/i);
 assert.match(first.practice,/не нужно устанавливать/i);
 assert.doesNotMatch(first.practice,/создай файл|установи Node|запусти терминал/i);
});
test('beginner curriculum is added idempotently and preserves existing English course',()=>{
 const before=root.LIFEOS_ENGINEERING_ACADEMIES.courses.find(c=>c.id==='english_cefr_1500');
 assert.equal(before.modules.reduce((n,m)=>n+m.lessons.length,0),100);
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..','lifeos-programming-zero-start.js'),'utf8'),context);
 const js=root.LIFEOS_ENGINEERING_ACADEMIES.courses.find(c=>c.id==='javascript_engineering_1000');
 const py=root.LIFEOS_ENGINEERING_ACADEMIES.courses.find(c=>c.id==='python_engineering_1000');
 assert.equal(js.modules.filter(m=>m.id==='js-zero-start').length,1);
 assert.equal(py.modules.filter(m=>m.id==='py-zero-start').length,1);
 assert.equal(js.modules.reduce((n,m)=>n+m.lessons.length,0),110);
 assert.equal(py.modules.reduce((n,m)=>n+m.lessons.length,0),110);
});
