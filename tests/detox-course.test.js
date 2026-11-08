'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const contentSource = fs.readFileSync('content.js', 'utf8');
const appSource = fs.readFileSync('app.js', 'utf8');

test('front-end scripts parse without syntax errors', () => {
  assert.doesNotThrow(() => new vm.Script(contentSource, { filename: 'content.js' }));
  assert.doesNotThrow(() => new vm.Script(appSource, { filename: 'app.js' }));
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
