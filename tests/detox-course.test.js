'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const contentSource = fs.readFileSync('content.js', 'utf8');
const appSource = fs.readFileSync('app.js', 'utf8');
const detailsSource = fs.readFileSync('lifeos-detox-details.js', 'utf8');

test('front-end scripts parse without syntax errors', () => {
  assert.doesNotThrow(() => new vm.Script(contentSource, { filename: 'content.js' }));
  assert.doesNotThrow(() => new vm.Script(appSource, { filename: 'app.js' }));
  assert.doesNotThrow(() => new vm.Script(detailsSource, { filename: 'lifeos-detox-details.js' }));
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


test('all 62 detox days have a detailed objective, method, check and safe fallback', () => {
  const sandbox = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.runInNewContext(contentSource, sandbox, { filename: 'content.js' });
  vm.runInNewContext(detailsSource, sandbox, { filename: 'lifeos-detox-details.js' });
  const details = sandbox.window.DETOX_DAY_DETAILS;
  assert.equal(Object.keys(details).length, 62);
  for (let day = 1; day <= 62; day++) {
    const item = details[day];
    assert.ok(item.objective && item.why && item.why.length > 60);
    assert.ok(item.steps.length >= 4 && item.check && item.fallback && item.safety);
  }
});

test('all detox checklist items receive contextual guides and no generic fallback', () => {
  const sandbox = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.runInNewContext(contentSource, sandbox, { filename: 'content.js' });
  vm.runInNewContext(detailsSource, sandbox, { filename: 'lifeos-detox-details.js' });
  const course = sandbox.window.DETOX_COURSE;
  let tasks = 0;
  for (const day of course) {
    for (const [index, task] of day.do.entries()) {
      tasks++;
      const guide = sandbox.window.getDetoxTaskGuide(day.day, task, index);
      assert.equal(guide.task, task);
      assert.ok(guide.dayObjective && guide.why && guide.prepare && guide.example && guide.check);
      assert.ok(guide.steps.length >= 3 && guide.fallback && guide.safety);
      assert.notEqual(guide.why, 'Переведи пункт из общего намерения в одно наблюдаемое действие. Маленький выполнимый шаг лучше жёсткого запрета.');
    }
  }
  assert.ok(tasks >= 250);
});

test('rigid or misleading detox tasks are replaced with flexible and safer actions', () => {
  const sandbox = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.runInNewContext(contentSource, sandbox, { filename: 'content.js' });
  vm.runInNewContext(detailsSource, sandbox, { filename: 'lifeos-detox-details.js' });
  const course = sandbox.window.DETOX_COURSE;
  assert.match(course[25].title, /Пауза от автоматических стимулов/);
  assert.ok(course[2].do.some(task => /по жажде/.test(task)));
  assert.ok(course[37].do.every(task => !/1\.6 г|500 г/.test(task)));
  assert.ok(course[38].do.every(task => !/7-9 ч/.test(task)));
  assert.ok(course[48].do.every(task => !/4 тренировки/.test(task)));
  assert.ok(course[25].science.includes('гарантии'));
});

test('detox UI exposes explanation, task fallback and safety guidance', () => {
  assert.match(appSource, /Подробная методика/);
  assert.match(appSource, /Безопасность/);
  assert.match(appSource, /Если сложно/);
});
