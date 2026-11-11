'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('lifeos-rad-method.js','utf8');
const index=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const renderer=fs.readFileSync('lifeos-learning-experience.js','utf8');
const app=fs.readFileSync('app.js','utf8');
const content=fs.readFileSync('content.js','utf8');
const mira=fs.readFileSync('lifeos-mira-skills.js','utf8');
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
 assert.equal(new Set(ids).size,16);
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
 assert.ok(index.indexOf('lifeos-rad-method.js?v=2')<index.indexOf('lifeos-learning-experience.js'));
 assert.ok(sw.includes("'./lifeos-rad-method.js'"));
 assert.match(sw,/life-os-v179/);
 assert.match(renderer,/Цель урока/);
 assert.match(renderer,/Критерий усвоения/);
});

test('vision catalog has 200 unique detailed routines',()=>{
 const ctx={window:{},console:{log(){},warn(){},error(){}}};
 vm.runInNewContext(content,ctx,{timeout:3000});
 const list=ctx.window.VISION_EXERCISES;
 assert.equal(list.length,200);
 assert.equal(new Set(list.map(x=>x.id)).size,200);
 for(const item of list) assert.ok(item.id&&item.title&&item.desc&&item.how&&item.seconds>0&&item.level);
});
test('vision catalog exposes category and duration filters plus start action',()=>{
 assert.match(app,/setVisionExerciseCategory/);
 assert.match(app,/setVisionExerciseDuration/);
 assert.match(app,/startEyeExercise/);
});
test('Mira skills work without cloud AI',()=>{
 assert.match(mira,/root.navigate\(skill.page\)/);
 assert.match(mira,/root.jarvisQuick\(skill.prompt\)/);
 assert.doesNotMatch(mira,/if\(!enabled\)/);
});
test('course lesson rows open enhanced full lesson view',()=>{
 assert.match(app,/window.openCourseLesson\|\|openCourseLesson/);
 assert.match(renderer,/richFormatLesson/);
});


test('RAD public catalogue tracks closed materials without copying them',()=>{
 assert.equal(radLibrary.publicChallengeInventory.advertisedMonthlyCount,12);
 assert.equal(radLibrary.publicChallengeInventory.identifiedMonthlyCount,5);
 assert.equal(radLibrary.publicChallengeInventory.unidentifiedMonthlyCount,7);
 assert.ok(radLibrary.restrictedMaterials.length>=4);
 assert.ok(radLibrary.restrictedMaterials.every(x=>x.importable===false));
 assert.ok(radLibrary.publicTopics.includes('MONEY MODE и личные финансы'));
 assert.ok(radLibrary.publicTopics.includes('Нейросети и AI-инструменты GOD MODE'));
});


test('RAD public resource catalogue renders source links and closed-material boundaries',()=>{
 const page={innerHTML:''};context.window.document={getElementById(id){return id==='app'?page:null;}};
 context.window.renderLIFEOSRADResources();
 assert.match(page.innerHTML,/публичные материалы/);
 assert.match(page.innerHTML,/radgilmanov\.ru/);
 assert.match(page.innerHTML,/Закрытые материалы — не импортированы/);
 assert.match(page.innerHTML,/140\+ обучающих гайдов/);
});
