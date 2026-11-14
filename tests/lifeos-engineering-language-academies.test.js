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
  assert.equal(academy.version, 3);
  assert.equal(academy.bulkExpansion, 'batch-12-3000');
  assert.deepEqual(JSON.parse(JSON.stringify(academy.targets)), { javascript: 1000, python: 1000, english: 1500 });
  assert.equal(academy.courses.length, 3);
  assert.equal(root.ALL_NEW_COURSES.length, 3);
  assert.deepEqual(JSON.parse(JSON.stringify(academy.englishLevels)), ['A1','A2','B1','B2','C1','C2']);
  assert.ok(academy.levels.some(x => x.code === 'Distinguished'));
});
test('every published lesson has theory, example, practical work, test, criterion and source', () => {
  const root = load();
  const lessons = root.LIFEOS_ENGINEERING_ACADEMIES.courses.flatMap(c => c.modules.flatMap(m => m.lessons));
  assert.equal(lessons.length, 3349);
  const byCourse = Object.fromEntries(root.LIFEOS_ENGINEERING_ACADEMIES.courses.map(c => [c.id, c.modules.reduce((n,m) => n + m.lessons.length, 0)]));
  assert.deepEqual(JSON.parse(JSON.stringify(byCourse)), { javascript_engineering_1000: 1000, python_engineering_1000: 1000, english_cefr_1500: 1349 });
  assert.equal(root.LIFEOS_ENGINEERING_ACADEMIES.courses[0].modules.length, 14);
  assert.equal(root.LIFEOS_ENGINEERING_ACADEMIES.courses[1].modules.length, 14);
  assert.equal(root.LIFEOS_ENGINEERING_ACADEMIES.courses[2].modules.length, 12);
  assert.deepEqual(JSON.parse(JSON.stringify(root.LIFEOS_ENGINEERING_ACADEMIES.courses[2].modules.map(m => m.lessons.length))), [113,112,113,112,113,112,113,112,113,112,112,112]);
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
 for(const level of ['A1','A2','B1','B2','C1','C2']) assert.equal(en.filter(x=>x.title.startsWith(level+' ·')).length,225-(level==='C2'?1:0));
 const batch=js.concat(py,en).filter(x=>/Event loop, task queues|AbortSignal и композиция|Structured cloning|IndexedDB: транзакции|CSP, Trusted Types|Observability браузерного|Protocol, structural|pytest fixtures|ContextVar и контекст|Descriptor protocol|Async generators|Asking for clarification|Past Continuous и прерывающее|Hedging и степень|Negotiating scope|Synthesising conflicting|Executive briefing/.test(x.title));
 assert.equal(batch.length,17);
 for(const item of batch){
  assert.ok(item.theory.length>=250);
  assert.ok(item.practice.length>=120);
  assert.ok(item.taskInstructions.length===4);
  assert.ok(item.quiz.options.length===3);
  assert.ok(item.sources[0].url.startsWith('https://'));
 }
});

test('batch 10 adds network/runtime engineering and advanced language tasks',()=>{
 const courses=load().LIFEOS_ENGINEERING_ACADEMIES.courses;
 const js=courses[0].modules.flatMap(m=>m.lessons), py=courses[1].modules.flatMap(m=>m.lessons), en=courses[2].modules.flatMap(m=>m.lessons);
 const titles=[
  ['JavaScript · WebSocket lifecycle и reconnect strategy',js],
  ['JavaScript · Fetch streams и backpressure',js],
  ['JavaScript · Web Crypto и управление ключами',js],
  ['JavaScript · Intl, календарные даты и timezone correctness',js],
  ['JavaScript · Module graph, циклические зависимости и API boundaries',js],
  ['Python · dataclass: equality, mutability и slots',py],
  ['Python · Multiprocessing start methods и переносимость',py],
  ['Python · Logging: structured fields, correlation и redaction',py],
  ['Python · Import system, namespace packages и plugin discovery',py],
  ['Python · Garbage collection, weak references и object lifetime',py],
  ['A1 · Asking for and giving simple directions',en],
  ['A2 · Countable and uncountable nouns in context',en],
  ['B1 · Reported speech и backshift',en],
  ['B2 · Passive reporting structures',en],
  ['C1 · Argument mapping и выявление логических ошибок',en],
  ['C2 · Technical due diligence и calibrated recommendation',en]
 ];
 for(const [title,items] of titles) assert.ok(items.some(x=>x.title===title),'missing '+title);
 const selected=titles.flatMap(([title,items])=>items.filter(x=>x.title===title));
 assert.equal(selected.length,16);
 for(const item of selected){
  assert.ok(item.theory.length>=250);
  assert.ok(item.practice.length>=120);
  assert.equal(item.taskInstructions.length,4);
  assert.ok(item.acceptanceCriteria.length>=20);
  assert.ok(item.quiz.options.length===3);
 }
});

test('batch 11 adds performance, data integrity and professional communication lessons',()=>{
 const courses=load().LIFEOS_ENGINEERING_ACADEMIES.courses;
 const js=courses[0].modules.flatMap(m=>m.lessons), py=courses[1].modules.flatMap(m=>m.lessons), en=courses[2].modules.flatMap(m=>m.lessons);
 const titles=[
  ['JavaScript · Performance budgets и Long Animation Frames',js],
  ['JavaScript · Shadow DOM и Web Components contracts',js],
  ['JavaScript · URL state и безопасная маршрутизация SPA',js],
  ['JavaScript · Storage quota, eviction и resilient persistence',js],
  ['JavaScript · Accessibility engineering: keyboard и focus management',js],
  ['Python · Type narrowing, generics и variance',py],
  ['Python · SQL transaction isolation и retry discipline',py],
  ['Python · subprocess pipes, deadlocks и process supervision',py],
  ['Python · pyproject.toml, build isolation и reproducible artifacts',py],
  ['Python · Async cancellation scopes и cleanup guarantees',py],
  ['A1 · Present Simple for routines and schedules',en],
  ['A2 · Comparatives, superlatives и fair comparisons',en],
  ['B1 · First, second и third conditionals in decisions',en],
  ['B2 · Writing a persuasive proposal with measurable outcomes',en],
  ['C1 · Diplomatic disagreement и constructive challenge',en],
  ['C2 · High-stakes negotiation and BATNA',en]
 ];
 for(const [title,items] of titles) assert.ok(items.some(x=>x.title===title),'missing '+title);
 const selected=titles.flatMap(([title,items])=>items.filter(x=>x.title===title));
 assert.equal(selected.length,16);
 for(const item of selected){
  assert.ok(item.theory.length>=250);
  assert.ok(item.practice.length>=120);
  assert.equal(item.taskInstructions.length,4);
  assert.ok(item.acceptanceCriteria.length>=20);
  assert.ok(item.quiz.options.length===3);
 }
});


test('batch-12 adds the complete 3,000-record expansion with unique topic pairs',()=>{
 const courses=load().LIFEOS_ENGINEERING_ACADEMIES.courses;
 const js=courses[0].modules.flatMap(m=>m.lessons),py=courses[1].modules.flatMap(m=>m.lessons),en=courses[2].modules.flatMap(m=>m.lessons);
 assert.equal(js.length,1000);assert.equal(py.length,1000);assert.equal(en.length,1349);
 const addedJs=js.filter(x=>x.objective.startsWith('Спроектировать и проверить решение по теме'));
 const addedPy=py.filter(x=>x.objective.startsWith('Реализовать инженерный контракт в области'));
 const addedEn=en.filter(x=>x.objective.startsWith('Develop '));
 assert.equal(addedJs.length,884);assert.equal(addedPy.length,885);assert.equal(addedEn.length,1231);
 for(const [rows,minTheory,minPractice] of [[addedJs,250,120],[addedPy,250,120],[addedEn,250,120]]){
  assert.equal(new Set(rows.map(x=>x.title)).size,rows.length);
  for(const row of rows){assert.ok(row.objective.length>=60);assert.ok(row.theory.length>=minTheory);assert.ok(row.practice.length>=minPractice);assert.equal(row.taskInstructions.length,4);assert.equal(row.quiz.options.length,3);assert.ok(row.acceptanceCriteria.length>=20);}
 }
 for(const level of ['A1','A2','B1','B2','C1']) assert.equal(en.filter(x=>x.title.startsWith(level+' ·')).length,225);
 assert.equal(en.filter(x=>x.title.startsWith('C2 ·')).length,224);
});
