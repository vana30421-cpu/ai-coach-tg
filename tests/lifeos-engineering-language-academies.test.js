'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '..', 'lifeos-engineering-language-academies.js'), 'utf8');
function load(){
  const root = { ALL_NEW_COURSES: [] };
  vm.runInNewContext(source, { window: root, globalThis: root });
  return root;
}
test('registers three distinct academies with the requested curriculum targets', () => {
  const root = load();
  const academy = root.LIFEOS_ENGINEERING_ACADEMIES;
  assert.deepEqual(JSON.parse(JSON.stringify(academy.targets)), { javascript: 1000, python: 1000, english: 1500 });
  assert.equal(academy.courses.length, 3);
  assert.equal(root.ALL_NEW_COURSES.length, 3);
  assert.deepEqual(JSON.parse(JSON.stringify(academy.englishLevels)), ['A1','A2','B1','B2','C1','C2']);
  assert.ok(academy.levels.some(x => x.code === 'Distinguished'));
});
test('every published lesson has theory, example, practical work, test, criterion and source', () => {
  const root = load();
  const lessons = root.LIFEOS_ENGINEERING_ACADEMIES.courses.flatMap(c => c.modules.flatMap(m => m.lessons));
  assert.equal(lessons.length, 317);
  const byCourse = Object.fromEntries(root.LIFEOS_ENGINEERING_ACADEMIES.courses.map(c => [c.id, c.modules.reduce((n,m) => n + m.lessons.length, 0)]));
  assert.deepEqual(JSON.parse(JSON.stringify(byCourse)), { javascript_engineering_1000: 106, python_engineering_1000: 105, english_cefr_1500: 106 });
  assert.equal(root.LIFEOS_ENGINEERING_ACADEMIES.courses[0].modules.length, 14);
  assert.equal(root.LIFEOS_ENGINEERING_ACADEMIES.courses[1].modules.length, 14);
  assert.equal(root.LIFEOS_ENGINEERING_ACADEMIES.courses[2].modules.length, 12);
  assert.deepEqual(JSON.parse(JSON.stringify(root.LIFEOS_ENGINEERING_ACADEMIES.courses[2].modules.map(m => m.lessons.length))), [9,9,9,9,9,9,9,9,9,9,8,8]);
  assert.equal(root.LIFEOS_ENGINEERING_ACADEMIES.courses[0].careerLevels.length, 14);
  assert.equal(root.LIFEOS_ENGINEERING_ACADEMIES.courses[1].careerLevels.length, 14);
  const ids = new Set();
  const lessonIds = new Set();
  for (const lesson of lessons) {
    assert.ok(lesson.id && lesson.id.startsWith('lesson-'));
    assert.equal(lessonIds.has(lesson.id), false, 'duplicate lesson id: ' + lesson.id);
    lessonIds.add(lesson.id);
    assert.ok(lesson.title.length >= 8);
    assert.ok(lesson.objective.length >= 20);
    assert.ok(lesson.theory.length >= 120);
    assert.ok(lesson.practice.length >= 30);
    assert.equal(lesson.taskInstructions.length, 4);
    assert.ok(lesson.deliverable.length >= 20);
    assert.ok(lesson.acceptanceCriteria.length >= 20);
    assert.ok(lesson.metric.length >= 20);
    assert.ok(lesson.quiz.question.length >= 10);
    assert.equal(lesson.quiz.options.length, 3);
    assert.ok(lesson.quiz.answerExplanation.length >= 40);
    assert.ok(lesson.quiz.correctIndex >= 0 && lesson.quiz.correctIndex < 3);
    assert.ok(lesson.sources[0].url.startsWith('https://'));
    assert.equal(ids.has(lesson.title), false, 'duplicate lesson title: ' + lesson.title);
    ids.add(lesson.title);
  }
});
test('course IDs and lesson keys remain stable and unique', () => {
  const root = load();
  const courses = root.LIFEOS_ENGINEERING_ACADEMIES.courses;
  const courseIds = courses.map(c => c.id);
  assert.equal(new Set(courseIds).size, courseIds.length);
  for (const course of courses) {
    assert.ok(course.modules.length > 0);
    assert.equal(new Set(course.modules.map(m => m.id)).size, course.modules.length);
    for (const mod of course.modules) assert.ok(mod.lessons.length > 0);
  }
});
test('loading the academy twice does not duplicate catalog registrations', () => {
  const root = { ALL_NEW_COURSES: [] };
  vm.runInNewContext(source, { window: root, globalThis: root });
  vm.runInNewContext(source, { window: root, globalThis: root });
  assert.equal(root.ALL_NEW_COURSES.length, 3);
});

test('batch 9 adds distinct advanced engineering and CEFR case studies',()=>{
 const root=load();
 const courses=root.LIFEOS_ENGINEERING_ACADEMIES.courses;
 const js=courses[0].modules.flatMap(m=>m.lessons);
 const py=courses[1].modules.flatMap(m=>m.lessons);
 const en=courses[2].modules.flatMap(m=>m.lessons);
 for(const title of [
  'JavaScript · Event loop, task queues и starvation',
  'JavaScript · AbortSignal и композиция отмены',
  'JavaScript · Structured cloning и границы сериализации',
  'JavaScript · IndexedDB: транзакции и schema migration',
  'JavaScript · CSP, Trusted Types и DOM XSS defense',
  'JavaScript · Observability браузерного приложения'
 ]) assert.ok(js.some(x=>x.title===title),'missing '+title);
 for(const title of [
  'Python · Protocol, structural subtyping и адаптеры',
  'Python · pytest fixtures, parametrization и property-based tests',
  'Python · ContextVar и контекст в async-приложениях',
  'Python · Descriptor protocol и управление атрибутами',
  'Python · Async generators и backpressure'
 ]) assert.ok(py.some(x=>x.title===title),'missing '+title);
 for(const level of ['A1','A2','B1','B2','C1','C2']) assert.equal(en.filter(x=>x.title.startsWith(level+' ·')).length,18-(level==='C2'?2:0));
 const batch=js.concat(py,en).filter(x=>/Event loop, task queues|AbortSignal и композиция|Structured cloning|IndexedDB: транзакции|CSP, Trusted Types|Observability браузерного|Protocol, structural|pytest fixtures|ContextVar и контекст|Descriptor protocol|Async generators|Asking for clarification|Past Continuous и прерывающее|Hedging и степень|Negotiating scope|Synthesising conflicting|Executive briefing/.test(x.title));
 assert.equal(batch.length,17);
 for(const item of batch){
  assert.ok(item.theory.length>=250);
  assert.ok(item.practice.length>=250);
  assert.ok(item.taskInstructions.length===4);
  assert.ok(item.quiz.options.length===3);
  assert.ok(item.sources[0].url.startsWith('https://'));
 }
});
