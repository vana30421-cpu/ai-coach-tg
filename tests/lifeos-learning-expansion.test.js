'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('lifeos-learning-expansion.js','utf8');
const index=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
test('learning expansion registers 18 unique, structured lessons across three safe academies',()=>{
 const context={window:{ALL_NEW_COURSES:[]}};
 vm.runInNewContext(source,context,{timeout:1000});
 const courses=context.window.ALL_NEW_COURSES;
 assert.deepEqual(Array.from(courses,c=>c.id),['psychology_foundations_2','communication_mastery_2','martial_arts_safety_foundations']);
 const lessons=courses.flatMap(c=>c.modules.flatMap(m=>m.lessons));
 assert.equal(lessons.length,18);
 assert.equal(new Set(lessons.map(l=>l.title)).size,18);
 for(const l of lessons){
  assert.ok(l.objective&&l.theory&&l.practice&&l.metric&&l.quiz.question);
  assert.ok(l.steps.length>=3&&l.sources.length>0);
  assert.ok(l.quiz.correctIndex>=0&&l.quiz.correctIndex<l.quiz.options.length);
 }
});
test('expansion is loaded before learning renderer and cached offline',()=>{
 assert.ok(index.indexOf('lifeos-learning-expansion.js?v=20261112-1')<index.indexOf('lifeos-learning-experience.js'));
 assert.ok(sw.includes("'./lifeos-learning-expansion.js'"));
 assert.match(sw,/const CACHE='life-os-v\\d+'/);
});
test('combat curriculum explicitly prevents unsupervised contact techniques',()=>{
 const context={window:{ALL_NEW_COURSES:[]}};
 vm.runInNewContext(source,context,{timeout:1000});
 const c=context.window.ALL_NEW_COURSES.find(x=>x.id==='martial_arts_safety_foundations');
 const text=c.modules.flatMap(m=>m.lessons).map(l=>l.theory+' '+l.practice).join(' ');
 assert.match(text,/тренер|контакт|останов/i);
 assert.match(text,/не следует переносить спортивные навыки в уличные конфликты/i);
});

test('adaptive review schedule grows and caps without mutating existing progress',()=>{
 const context={window:{ALL_NEW_COURSES:[]}};
 vm.runInNewContext(source,context,{timeout:1000});
 const schedule=context.window.lifeosCourseReviewIntervalDays;
 assert.deepEqual([1,2,3,4,5,6].map(schedule),[1,3,7,14,30,30]);
});
