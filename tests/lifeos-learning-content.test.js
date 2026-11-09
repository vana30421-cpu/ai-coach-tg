'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const curriculum=fs.readFileSync('lifeos-curriculum.js','utf8');
const guided=fs.readFileSync('lifeos-learning-content.js','utf8');
const plan=fs.readFileSync('lifeos-learning-plan.js','utf8');
const app=fs.readFileSync('app.js','utf8');
const index=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');

test('English and skills curricula are enriched with real objectives, examples and practice',()=>{
 assert.match(curriculum,/function englishGuide\(lesson\)/);
 assert.match(curriculum,/var englishExamples=/);
 assert.match(curriculum,/var skillGuides=/);
 assert.match(curriculum,/function enrichSkill\(skill\)/);
 assert.match(curriculum,/lesson\.duration=15/);
 assert.match(guided,/function openEnglish\(id\)/);
 assert.match(guided,/function completeEnglish\(id\)/);
 assert.match(guided,/function openSkill\(id\)/);
 assert.match(guided,/function completeSkill\(id\)/);
 assert.match(guided,/answer\.length<30/);
 assert.match(guided,/evidence\.length<20/);
});

test('English and skills can be included in the 30-day plan and completed from their own progress records',()=>{
 assert.match(plan,/if\(opts\.english\)/);
 assert.match(plan,/if\(opts\.skills\)/);
 assert.match(plan,/type:'english',id:l\.id/);
 assert.match(plan,/type:'skill',id:l\.id/);
 assert.match(plan,/ep\[task\.idRef\]/);
 assert.match(plan,/sp\[task\.idRef\]/);
 assert.match(plan,/window\.openEnglishLesson\(t\.idRef\)/);
 assert.match(plan,/window\.openSkill\(t\.idRef\)/);
 assert.match(plan,/id="planEnglish" checked/);
 assert.match(plan,/id="planSkills" checked/);
});

test('learning content is checked at startup and cached offline',()=>{
 assert.match(index,/lifeos-learning-content\.js/);
 assert.match(index,/lifeos-learning-content\.js','lifeos-search\.js'/);
 assert.match(sw,/lifeos-learning-content\.js/);
 assert.match(sw,/life-os-v120/);
});

test('statistics and Jarvis include the unified development plan',()=>{
 assert.match(app,/learningPlanDone/);
 assert.match(app,/developmentPlanDone/);
 assert.match(app,/development-plan/);
 assert.match(app,/Единый план · выполнено/);
});
