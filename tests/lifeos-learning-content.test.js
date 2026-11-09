'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const contentSource=fs.readFileSync('content.js','utf8');
const learningSource=fs.readFileSync('lifeos-learning-content.js','utf8');
const index=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const app=fs.readFileSync('app.js','utf8');
const worker=fs.readFileSync('workers/jarvis-worker.js','utf8');
const api=fs.readFileSync('functions/api/jarvis.js','utf8');

function loadLearning(){
 const window={};
 const quiet={log(){},warn(){},error(){}};
 vm.runInNewContext(contentSource,{window,console:quiet,Date,Math});
 vm.runInNewContext(learningSource,{window,console:quiet,Date,Math});
 return window;
}

test('all 125 English lessons are enriched with objective, explanation, examples, practice and self-check',()=>{
 const w=loadLearning();
 assert.equal(w.ENGLISH_125.length,125);
 for(const lesson of w.ENGLISH_125){
  const guide=w.LIFEOSLearningContent.topicLesson(lesson);
  assert.ok(guide.objective&&guide.theory&&guide.examples&&guide.practice&&guide.check,lesson.id);
  assert.ok(!/Изучи правила и примеры|10 упражнений по теме/.test(guide.theory+' '+guide.practice),lesson.id);
 }
});

test('all 60 skills open with a measurable objective, practical task and checklist',()=>{
 const w=loadLearning();
 assert.equal(w.SKILLS_LIBRARY.length,60);
 for(const skill of w.SKILLS_LIBRARY){
  const guide=w.LIFEOSLearningContent.skillInfo(skill);
  assert.ok(guide.objective&&guide.practice&&guide.metric&&guide.steps.length===3,skill.title);
  assert.ok(!/ключевой навык\. Изучи основы и практикуй\./.test(guide.theory),skill.title);
 }
});

test('the actual learning-content module is loaded and checked at startup and cached offline',()=>{
 assert.match(index,/lifeos-learning-content\.js\?v=/);
 assert.match(index,/lifeos-learning-content\.js/);
 assert.match(sw,/lifeos-learning-content\.js/);
 assert.match(sw,/life-os-v119/);
});

test('Jarvis connection test is authenticated and does not expose provider secrets',()=>{
 assert.match(worker,/request\.method === "GET"/);
 assert.match(worker,/safeEqual\(request\.headers\.get\("X-Jarvis-Access-Code"\), env\.JARVIS_ACCESS_CODE\)/);
 assert.match(worker,/providers: \{ openai: !!env\.OPENAI_API_KEY, gemini: !!env\.GEMINI_API_KEY \}/);
 assert.match(api,/export async function onRequestGet/);
 assert.match(app,/async function testJarvisConnection\(\)/);
 assert.match(app,/window\.testJarvisConnection=testJarvisConnection/);
 assert.match(app,/onclick="testJarvisConnection\(\)"/);
});
