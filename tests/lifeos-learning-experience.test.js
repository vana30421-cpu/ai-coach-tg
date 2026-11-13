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
 assert.ok(['A1','A2','B1','B2','C1'].reduce((n,l)=>n+academy.split("['"+l+"',").length-1,0)>=20);
 for(const topic of ['Present Simple: привычки и факты','Conditionals: 0, 1 и 2','Hedging: аккуратные утверждения','Критическая дискуссия'])assert.ok(academy.includes(topic));
});

test('English and skill lessons require practice, self-explanation and a knowledge check',()=>{
 assert.ok(academy.includes('completeEnglishAcademyLesson'));
 assert.ok(academy.includes('минимум 20 символов'));
 assert.ok(academy.includes('choice!==(x[8]||[]).indexOf(x[7])'));
 assert.match(academy,/function englishCourseRecord/);
 assert.ok(academy.includes("storeKey=courseId+'Progress'"));
 assert.ok(academy.includes('12 треков'));
 assert.ok(academy.includes('completeSkillAcademyLesson'));
 assert.ok(academy.includes('минимум 10 символов'));
 assert.ok(academy.includes('function completeRichCourseLesson'));
 assert.ok(academy.includes('l.quiz.correctIndex'));
});

test('navigation and offline cache load the academy',()=>{
 assert.ok(app.includes('skills: window.renderSkills || renderSkills'));
 assert.ok(app.includes('english: window.renderEnglish || renderEnglish'));
 assert.ok(index.includes('lifeos-learning-experience.js?v=20261112-4'));
 assert.ok(/const CACHE='life-os-v\\d+'/.test(sw));
 assert.ok(index.includes('lifeos-advanced-academy.js?v=1'));
 assert.ok(sw.includes('lifeos-advanced-academy.js'));
 assert.ok(sw.includes('lifeos-learning-experience.js'));
});

test('rich course quiz requires an explicit answer before completion',()=>{
 assert.match(academy,/<select id="richCourseQuiz" required><option value="" selected disabled>Выбери ответ/);
 assert.match(academy,/selected===''\?NaN:Number\(selected\)/);
 assert.match(academy,/choice===Number\(l\.quiz\.correctIndex\)/);
});

test('rich course completion uses adaptive review intervals and preserves old record fields',()=>{
 assert.match(academy,/lifeosCourseReviewIntervalDays\(nextReviewCount\)/);
 assert.match(academy,/reviewIntervalDays:intervalDays/);
 assert.match(academy,/reviewCount:nextReviewCount/);
 assert.match(academy,/nextReviewAt:d\.toISOString\(\)\.slice\(0,10\)/);
});
