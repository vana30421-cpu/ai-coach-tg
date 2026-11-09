'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const academy=fs.readFileSync('lifeos-learning-experience.js','utf8');
const app=fs.readFileSync('app.js','utf8');
const index=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');

test('English academy contains five CEFR levels with real topic-specific lessons',()=>{
 for(const level of ['A1','A2','B1','B2','C1'])assert.match(academy,new RegExp("\\['"+level+"',"));
 assert.ok((academy.match(/\\n\\['(?:A1|A2|B1|B2|C1)'/g)||[]).length>=20);
 assert.match(academy,/Present Simple: привычки и факты/);
 assert.match(academy,/Conditionals: 0, 1 и 2/);
 assert.match(academy,/Hedging: аккуратные утверждения/);
 assert.match(academy,/Критическая дискуссия/);
});

test('English and skill lessons require practice, self-explanation and a knowledge check',()=>{
 assert.match(academy,/completeEnglishAcademyLesson/);
 assert.match(academy,/минимум 20 символов/);
 assert.match(academy,/choice===\\(x\\[8\\]\\|\\|\\[\\]\\)\\.indexOf\\(x\\[7\\]\\)/);
 assert.match(academy,/12 треков/);
 assert.match(academy,/completeSkillAcademyLesson/);
 assert.match(academy,/минимум 20 символов/);
 assert.match(academy,/минимум 10 символов/);
 assert.match(academy,/function completeRichCourseLesson/);
 assert.match(academy,/l\.quiz\.correctIndex/);
});

test('navigation and offline cache load the academy',()=>{
 assert.match(app,/skills: window\.renderSkills \|\| renderSkills/);
 assert.match(app,/english: window\.renderEnglish \|\| renderEnglish/);
 assert.match(index,/lifeos-learning-experience\.js\?v=20261109-1/);
 assert.match(sw,/life-os-v115/);
 assert.match(sw,/lifeos-learning-experience\.js/);
});
