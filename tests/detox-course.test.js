'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const contentSource = fs.readFileSync('content.js', 'utf8');
const appSource = fs.readFileSync('app.js', 'utf8');
const indexSource = fs.readFileSync('index.html', 'utf8');
const swSource = fs.readFileSync('sw.js', 'utf8');
const enhancementSource = fs.readFileSync('lifeos-detox-enhancements.js', 'utf8');

test('front-end scripts parse without syntax errors', () => {
  assert.doesNotThrow(() => new vm.Script(contentSource, { filename: 'content.js' }));
  assert.doesNotThrow(() => new vm.Script(appSource, { filename: 'app.js' }));
  assert.doesNotThrow(() => new vm.Script(enhancementSource, { filename: 'lifeos-detox-enhancements.js' }));
});

test('62-day detox course contains all days in order', () => {
  const sandbox = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.runInNewContext(contentSource, sandbox, { filename: 'content.js' });
  const course = sandbox.window.DETOX_COURSE;
  assert.ok(Array.isArray(course));
  assert.equal(course.length, 62);
  assert.deepEqual(Array.from(course, day => day.day), Array.from({ length: 62 }, (_, i) => i + 1));
  for (const day of course) {
    assert.ok(day.title && day.phase && day.theory, 'day ' + day.day + ' needs a title, phase and theory');
    assert.ok(Array.isArray(day.do) && day.do.length > 0, 'day ' + day.day + ' needs actionable tasks');
  }
});

test('every detox task has an actionable guide and verification criterion', () => {
  const sandbox = { window: {} };
  vm.runInNewContext(contentSource, sandbox, { filename: 'content.js' });
  const course = sandbox.window.DETOX_COURSE;
  for (const day of course) {
    for (const [index, task] of day.do.entries()) {
      const guide = sandbox.window.getDetoxTaskGuide(day.day, task, index);
      assert.equal(guide.task, task, 'day ' + day.day + ', task ' + index);
      assert.ok(guide.why && guide.prepare && guide.example && guide.check);
      assert.ok(Array.isArray(guide.steps) && guide.steps.length >= 3);
      assert.ok(guide.steps.every(step => typeof step === 'string' && step.length > 15));
    }
  }
});

test('inline detox controls are exported for the Telegram WebView', () => {
  for (const handler of ['renderDetoxCourse', 'renderDetoxCourseReport', 'openDetoxDay', 'toggleDetoxCourseTask', 'saveDetoxDayReflection', 'completeDetoxDay']) {
    assert.match(appSource, new RegExp('window\\.' + handler + '\\s*='));
  }
});


test('all 62 days have detailed lessons, methods, measurable checks and safe fallbacks', () => {
  const sandbox = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.runInNewContext(contentSource, sandbox, { filename: 'content.js' });
  vm.runInNewContext(enhancementSource, sandbox, { filename: 'lifeos-detox-enhancements.js' });
  const course = sandbox.window.DETOX_COURSE;
  assert.equal(course.length, 62);
  for (const day of course) {
    assert.ok(day.learning.explanation.length > 180, 'day ' + day.day + ' needs a real explanation');
    assert.ok(day.learning.method.length > 80, 'day ' + day.day + ' needs a method');
    assert.ok(day.learning.metric && day.learning.reflection && day.learning.fallback);
    assert.ok(day.science.includes('без обещания') || day.science.includes('гарантии') || day.science.includes('гарантированный'));
    for (const [index, task] of day.do.entries()) {
      const guide = sandbox.window.getDetoxTaskGuide(day.day, task, index);
      assert.ok(guide.dayObjective && guide.why && guide.prepare && guide.example && guide.check);
      assert.ok(Array.isArray(guide.steps) && guide.steps.length >= 3);
      assert.ok(guide.fallback && guide.safety);
    }
  }
});

test('misleading rigid challenges are replaced with safe, adaptable experiments', () => {
  const sandbox = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.runInNewContext(contentSource, sandbox, { filename: 'content.js' });
  vm.runInNewContext(enhancementSource, sandbox, { filename: 'lifeos-detox-enhancements.js' });
  const course = sandbox.window.DETOX_COURSE;
  assert.match(course[25].title, /Пауза от автоматических стимулов/);
  assert.ok(course[25].do.some(task => /30–60 минут/.test(task)));
  assert.ok(course[2].do.some(task => /по жажде/.test(task)));
  assert.ok(course[37].do.every(task => !/1\.6 г|500 г/.test(task)));
  assert.ok(course[38].do.every(task => !/7-9 ч/.test(task)));
});

test('detox day screen renders lesson explanation, method and safety guidance', () => {
  assert.match(appSource, /Подробное объяснение/);
  assert.match(appSource, /Подробная методика/);
  assert.match(appSource, /Критерий выполнения/);
  assert.match(appSource, /Безопасность и адаптация/);
  assert.match(appSource, /Если сложно/);
});

test('all 62 days have detailed lessons and all checklist tasks have specific safe guides',()=>{
 const sandbox={window:{},console:{log(){},warn(){},error(){}}};
 vm.runInNewContext(contentSource,sandbox,{filename:'content.js'});
 vm.runInNewContext(enhancementSource,sandbox,{filename:'lifeos-detox-enhancements.js'});
 const course=sandbox.window.DETOX_COURSE;assert.equal(course.length,62);
 let total=0;
 for(const day of course){
  assert.ok(day.learning.explanation.length>180,'day '+day.day+' needs a detailed explanation');
  assert.ok(day.learning.method.length>80,'day '+day.day+' needs a practical method');
  assert.ok(day.learning.metric&&day.learning.reflection&&day.learning.fallback);
  assert.ok(day.learning.safety);
  for(const [index,task] of day.do.entries()){
   total++;const guide=sandbox.window.getDetoxTaskGuide(day.day,task,index);
   assert.ok(guide.dayObjective&&guide.why&&guide.prepare&&guide.example&&guide.check);
   assert.ok(Array.isArray(guide.steps)&&guide.steps.length>=3);
   assert.ok(guide.fallback&&guide.safety);
  }
 }
 assert.ok(total>=250,'all daily checklist tasks should have a guide');
});

test('misleading rigid detox challenges are replaced with safe, adaptable experiments',()=>{
 const sandbox={window:{},console:{log(){},warn(){},error(){}}};
 vm.runInNewContext(contentSource,sandbox,{filename:'content.js'});
 vm.runInNewContext(enhancementSource,sandbox,{filename:'lifeos-detox-enhancements.js'});
 const course=sandbox.window.DETOX_COURSE;
 assert.match(course[25].title,/Пауза от автоматических стимулов/);
 assert.ok(course[25].do.some(task=>/30–60 минут/.test(task)));
 assert.ok(course[2].do.some(task=>/по жажде/.test(task)));
 assert.ok(course[37].do.every(task=>!/1\.6 г|500 г/.test(task)));
 assert.ok(course[38].do.every(task=>!/7-9 ч/.test(task)));
});

test('detox day screen renders detailed explanation, method, criteria and safety',()=>{
 assert.match(appSource,/Подробное объяснение/);
 assert.match(appSource,/Подробная методика/);
 assert.match(appSource,/Критерий выполнения/);
 assert.match(appSource,/Безопасность и адаптация/);
 assert.match(appSource,/Если сложно/);
});

test('detox task enrichment loads after source content and is cached offline',()=>{
 assert.match(indexSource,/content\.js[^\n]*\n<script defer src="lifeos-detox-enhancements\.js/);
 assert.match(indexSource,/lifeos-detox-details\.js/);
 assert.match(swSource,/lifeos-detox-enhancements\.js/);
 assert.match(swSource,/lifeos-detox-details\.js/);
 assert.match(swSource,/const CACHE='life-os-v\d+';/);
});
