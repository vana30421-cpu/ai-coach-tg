'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('lifeos-learning-plan.js', 'utf8');
function loadPlanner() {
  const window = {
    ALL_NEW_COURSES: [],
    state: {},
    today: () => '2026-11-09',
    save: () => {},
    toast: () => {},
    esc: value => String(value)
  };
  vm.runInNewContext(source, { window, document: {}, Date, Math });
  return window;
}

test('adds four structured courses with lessons, theory and practice', () => {
  const w = loadPlanner();
  const added = w.ALL_NEW_COURSES;
  assert.equal(added.length, 4);
  for (const course of added) {
    assert.ok(course.modules.length > 0, course.id);
    const lessons = course.modules.flatMap(module => module.lessons);
    assert.ok(lessons.length >= 4, course.id);
    assert.ok(lessons.every(lesson => lesson.title && lesson.theory && lesson.practice), course.id);
  }
});

test('builds a complete 30-day plan with weekly reviews and real course lesson references', () => {
  const w = loadPlanner();
  const ids = ['ai_literacy_course', 'productivity_course', 'communication_course'];
  const plan = w.LIFEOS_LEARNING_PLAN_TESTS.buildSchedule('2026-11-09', ids, 35);
  assert.equal(plan.days.length, 30);
  assert.equal(plan.startDate, '2026-11-09');
  assert.equal(plan.endDate, '2026-12-08');
  assert.deepEqual(Array.from(new Set(plan.days.map(day => day.week))), [1, 2, 3, 4, 5]);
  for (const day of plan.days) {
    assert.ok(day.tasks.some(task => task.type === 'reflection'));
    for (const task of day.tasks.filter(task => task.type === 'lesson')) {
      assert.ok(ids.includes(task.courseId));
      assert.ok(Number.isInteger(task.index));
    }
  }
  for (const dayNo of [7, 14, 21, 28, 30]) {
    const day = plan.days[dayNo - 1];
    assert.ok(day.tasks.some(task => task.type.includes('review')));
    assert.equal(day.tasks.some(task => task.type === 'lesson'), false);
  }
});

test('respects time bounds and supports one selected course', () => {
  const w = loadPlanner();
  const plan = w.LIFEOS_LEARNING_PLAN_TESTS.buildSchedule('2026-11-09', ['ai_literacy_course'], 500);
  assert.equal(plan.minutesPerDay, 120);
  assert.ok(plan.days.some(day => day.tasks.some(task => task.courseId === 'ai_literacy_course')));
  const minimal = w.LIFEOS_LEARNING_PLAN_TESTS.buildSchedule('2026-11-09', ['ai_literacy_course'], 1);
  assert.equal(minimal.minutesPerDay, 20);
});

test('navigation routes and offline cache include the learning planner', () => {
  const app = fs.readFileSync('app.js', 'utf8');
  const html = fs.readFileSync('index.html', 'utf8');
  const sw = fs.readFileSync('sw.js', 'utf8');
  assert.match(app, /learning:\s*window\.renderLearning\s*\|\|\s*renderLearning/);
  assert.match(app, /plan:\s*window\.renderPersonalPlan\s*\|\|\s*renderPersonalPlan/);
  assert.match(html, /lifeos-learning-plan\.js/);
  assert.match(sw, /life-os-v98/);
  assert.match(sw, /lifeos-learning-plan\.js/);
});