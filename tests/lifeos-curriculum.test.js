'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const curriculum=fs.readFileSync('lifeos-curriculum.js','utf8');
const app=fs.readFileSync('app.js','utf8');
const worker=fs.readFileSync('workers/jarvis-worker.js','utf8');
const api=fs.readFileSync('functions/api/jarvis.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');

function load(){
 const english=Array.from({length:125},(_,i)=>({id:'en'+i,level:['A1','A2','B1','B2','C1'][Math.floor(i/25)],title:['Present Simple','Past Simple правильные','PPC','Инверсия','Hedging'][Math.floor(i/25)]}));
 const skills=Array.from({length:61},(_,i)=>({id:'sk'+i,title:['Память','Deep Work','Стресс','Переговоры','Сон','Бюджет'][i%6],cat:['cognitive','productivity','emotional','social','health','finance'][i%6]}));
 const courses=[{id:'sample',title:'Тестовый курс',modules:[{id:'m1',title:'База',lessons:[{title:'Проверяемый урок',theory:'Объяснение темы.',practice:'Сделай практику.'}]}]}];
 const window={ENGLISH_125:english,SKILLS_LIBRARY:skills,ALL_NEW_COURSES:courses};
 vm.runInNewContext(curriculum,{window});
 return {window,english,skills,courses};
}

test('all 125 English lessons receive a real guided lesson structure',()=>{
 const {english}=load();
 assert.equal(english.length,125);
 for(const l of english){
  assert.ok(l.objective&&l.theory&&l.example&&l.practice&&l.checkQuestion&&l.metric,l.id);
  assert.equal(l.steps.length,3,l.id);
  assert.ok(!/Изучи правила и примеры|10 упражнений по теме/.test(l.theory+' '+l.practice),l.id);
 }
});

test('all skills receive individual practice, checklist and measurable evidence',()=>{
 const {skills}=load();
 assert.equal(skills.length,61);
 for(const s of skills){
  assert.ok(s.objective&&s.theory&&s.practice&&s.metric&&s.reflection,s.id);
  assert.equal(s.steps.length,3,s.id);
  assert.ok(!/ключевой навык\. Изучи основы и практикуй\./.test(s.theory),s.id);
 }
});

test('every catalog course lesson receives an objective, steps and success criterion',()=>{
 const {courses}=load(),lesson=courses[0].modules[0].lessons[0];
 assert.ok(lesson.objective&&lesson.metric&&lesson.checkQuestion);
 assert.equal(lesson.steps.length,3);
});

test('English and skill completion requires checklist plus learner evidence',()=>{
 assert.match(app,/if\(steps\.length&&steps\.some\(function\(x\)\{return !x;\}\)\)return toast\('Отметь все этапы урока'/);
 assert.match(app,/if\(recall\.length<25\)return toast/);
 assert.match(app,/if\(evidence\.length<20\)return toast/);
 assert.match(app,/id="englishStep/);
 assert.match(app,/id="skillStep/);
});

test('Jarvis exposes an authenticated health check without revealing secrets',()=>{
 assert.match(worker,/request\.method === "GET"/);
 assert.match(worker,/safeEqual\(request\.headers\.get\("X-Jarvis-Access-Code"\), env\.JARVIS_ACCESS_CODE\)/);
 assert.match(worker,/providers: \{ openai: !!env\.OPENAI_API_KEY, gemini: !!env\.GEMINI_API_KEY \}/);
 assert.match(api,/export async function onRequestGet/);
 assert.match(app,/async function testJarvisConnection\(\)/);
 assert.match(app,/window\.testJarvisConnection=testJarvisConnection/);
 assert.match(app,/onclick="testJarvisConnection\(\)"/);
});

test('curriculum is loaded before app interaction and cached offline',()=>{
 assert.match(html,/lifeos-curriculum\.js/);
 assert.match(sw,/lifeos-v115/);
 assert.match(sw,/\.\/lifeos-curriculum\.js/);
});
