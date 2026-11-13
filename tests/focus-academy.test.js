'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const academy=fs.readFileSync(path.join(__dirname,'..','lifeos-focus-academy.js'),'utf8');
const app=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
const index=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
test('focus course contains 12 practical lessons across three modules',()=>{
 assert.match(academy,/id:'focus_mastery_course'/);
 assert.equal((academy.match(/lesson\('/g)||[]).length,12);
 assert.equal((academy.match(/id:'focus_(?:foundations|execution|resilience)'/g)||[]).length,3);
});
test('focus course uses generic course quiz and progress-compatible fields',()=>{
 assert.match(academy,/quiz:\{question:question,options:options,correctIndex:correct\}/);
 assert.match(academy,/sources:sources/);
 assert.match(app,/state\.focus_mastery_courseProgress/);
 assert.match(app,/navigate\(\\'focus_mastery_course\\'\)/);
});
test('focus academy loads before app router and learning page links to it',()=>{
 assert.ok(index.indexOf('lifeos-focus-academy.js')<index.indexOf('app.js?v=20261113-4'));
 assert.match(app,/Тренировка фокуса/);
});
