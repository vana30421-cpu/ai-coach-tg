'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const curriculum=fs.readFileSync('lifeos-curriculum.js','utf8');

function load(){
 const english=Array.from({length:125},(_,i)=>({id:'en'+i,level:['A1','A2','B1','B2','C1'][Math.floor(i/25)],title:['Present Simple','Past Simple правильные','PPC','Инверсия','Hedging'][Math.floor(i/25)]}));
 const skills=Array.from({length:61},(_,i)=>({id:'sk'+i,title:['Память','Deep Work','Стресс','Переговоры','Сон','Бюджет'][i%6],cat:['cognitive','productivity','emotional','social','health','finance'][i%6]}));
 const courses=[{id:'sample',title:'Тестовый курс',modules:[{id:'m1',title:'База',lessons:[{title:'Проверяемый урок',theory:'Объяснение темы.',practice:'Сделай практику.'}]}]}];
 const window={ENGLISH_125:english,SKILLS_LIBRARY:skills,ALL_NEW_COURSES:courses};
 vm.runInNewContext(curriculum,{window});
 return {window,english,skills,courses};
}

test('all 125 English lessons receive objective, theory, examples, practice, check and steps',()=>{
 const {english}=load();assert.equal(english.length,125);
 for(const l of english){assert.ok(l.objective&&l.theory&&l.example&&l.practice&&l.checkQuestion&&l.metric,l.id);assert.equal(l.steps.length,3,l.id);assert.ok(!/Изучи правила и примеры|10 упражнений по теме/.test(l.theory+' '+l.practice),l.id);}
});

test('all 61 skill cards receive an actionable practice and measurable evidence',()=>{
 const {skills}=load();assert.equal(skills.length,61);
 for(const s of skills){assert.ok(s.objective&&s.theory&&s.practice&&s.metric&&s.reflection,s.id);assert.equal(s.steps.length,3,s.id);assert.ok(!/ключевой навык\. Изучи основы и практикуй\./.test(s.theory),s.id);}
});

test('course lessons receive objective, practical steps and success criteria',()=>{
 const {courses}=load(),lesson=courses[0].modules[0].lessons[0];
 assert.ok(lesson.objective&&lesson.metric&&lesson.checkQuestion);assert.equal(lesson.steps.length,3);
});

test('curriculum loads before app and is cached offline with the guided lesson renderer',()=>{
 const html=fs.readFileSync('index.html','utf8'),sw=fs.readFileSync('sw.js','utf8'),guided=fs.readFileSync('lifeos-learning-content.js','utf8');
 assert.ok(html.indexOf('src="lifeos-curriculum.js')<html.indexOf('src="app.js'));
 assert.match(html,/lifeos-learning-content\\.js/);
 assert.match(html,/lifeos-learning-content\\.js','lifeos-search\\.js/);
 assert.match(sw,/life-os-v121/);assert.match(sw,/\.\/lifeos-curriculum\.js/);
 assert.match(guided,/root\.LIFEOS_CURRICULUM&&l\.objective/);
 assert.match(guided,/root\.openCourseLesson=openCourseLessonGuided/);
 assert.match(guided,/completeRealEnglishLesson/);assert.match(guided,/completeRealSkill/);
});
