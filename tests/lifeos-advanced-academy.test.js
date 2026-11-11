'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('lifeos-advanced-academy.js','utf8');
const index=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const context={window:{ALL_NEW_COURSES:[]}};
vm.runInNewContext(source,context,{timeout:1000});
const courses=context.window.ALL_NEW_COURSES;
test('advanced academy registers four complete applied courses',()=>{
 assert.deepEqual(Array.from(courses,c=>c.id),['critical_thinking','analytical_thinking','strategic_thinking','evidence_biohacking']);
 assert.equal(courses.reduce((n,c)=>n+c.modules.reduce((m,x)=>m+x.lessons.length,0),0),36);
 for(const c of courses)for(const m of c.modules)for(const l of m.lessons){
  assert.ok(l.title&&l.objective&&l.theory&&l.practice&&l.metric&&l.quiz);
  assert.equal(l.steps.length,3);
  assert.ok(l.quiz.correctIndex>=0&&l.quiz.correctIndex<l.quiz.options.length);
 }
});
test('biohacking course contains safety boundaries and primary sources',()=>{
 const bio=courses.find(c=>c.id==='evidence_biohacking');
 const text=bio.modules.flatMap(m=>m.lessons).map(l=>l.theory+' '+l.practice).join(' ');
 assert.match(text,/не является лечением|не являются условиями здоровья|не начинай гормоны/i);
 assert.ok(bio.modules.flatMap(m=>m.lessons).some(l=>l.sources.some(s=>/who.int/.test(s.url))));
 assert.ok(bio.modules.flatMap(m=>m.lessons).some(l=>l.sources.some(s=>/aasm.org/.test(s.url))));
});
test('advanced academy is loaded before the course renderer and cached offline',()=>{
 assert.ok(index.indexOf('lifeos-advanced-academy.js?v=1')<index.indexOf('lifeos-learning-experience.js?v=20261111-2'));
 assert.ok(sw.includes("'./lifeos-advanced-academy.js'"));
});
