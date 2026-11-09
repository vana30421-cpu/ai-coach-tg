'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const academy=fs.readFileSync('lifeos-learning-experience.js','utf8');
const app=fs.readFileSync('app.js','utf8');
const index=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');

test('English academy contains five CEFR levels with real topic-specific lessons',()=>{
 for(const level of ['A1','A2','B1','B2','C1'])assert.ok(academy.includes("['"+level+"',"));
 assert.equal((academy.match(/\n\['(?:A1|A2|B1|B2|C1)'/g)||[]).length,21);
 for(const topic of ['Present Simple: привычки и факты','Conditionals: 0, 1 и 2','Hedging: аккуратные утверждения','Критическая дискуссия'])assert.ok(academy.includes(topic));
});

test('English and skill lessons require practice, self-explanation and a knowledge check',()=>{
 assert.ok(academy.includes('completeEnglishAcademyLesson'));
 assert.ok(academy.includes('минимум 20 символов'));
 assert.ok(academy.includes('correct=choice===(x[8]||[]).indexOf(x[7])'));
 assert.ok(academy.includes('12 треков'));
 assert.ok(academy.includes('completeSkillAcademyLesson'));
 assert.ok(academy.includes('минимум 10 символов'));
 assert.ok(academy.includes('function completeRichCourseLesson'));
 assert.ok(academy.includes('l.quiz.correctIndex'));
});

test('navigation and offline cache load the academy',()=>{
 assert.ok(app.includes('skills: window.renderSkills || renderSkills'));
 assert.ok(app.includes('english: window.renderEnglish || renderEnglish'));
 assert.ok(index.includes('lifeos-learning-experience.js?v=20261109-1'));
 assert.ok(sw.includes('life-os-v115'));
 assert.ok(sw.includes('lifeos-learning-experience.js'));
});
