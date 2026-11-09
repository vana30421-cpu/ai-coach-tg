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
  ,document: { getElementById: () => ({ innerHTML: '' }) }
  };
  vm.runInNewContext(source, { window, document: { getElementById: () => ({ innerHTML: '' }) }, Date, Math });
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
  const scheduledLessons = plan.days.flatMap(day => day.tasks.filter(task => task.type === 'lesson').map(task => task.id));
  assert.equal(new Set(scheduledLessons).size, scheduledLessons.length, 'lesson references must not repeat');
  assert.ok(plan.days.some(day => day.tasks.some(task => task.type === 'practice')), 'remaining days should contain application practice');
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

test('unified plan reads real progress from habits, movement, sleep and the second brain',()=>{
 const w=loadPlanner(),p=w.LIFEOS_LEARNING_PLAN_TESTS.buildSchedule('2026-11-09',['ai_literacy_course'],35);
 w.state.learningDevelopmentPlan=p;
 const get=(dayNo)=>p.days[dayNo-1].tasks.find(task=>task.type.indexOf('life-')===0);
 const habit=get(3),movement=get(10),sleep=get(17),brain=get(24),review=get(30);
 for(const task of [habit,movement,sleep,brain,review])assert.ok(task,'missing cross-domain task');
 assert.equal(w.LIFEOS_LEARNING_PLAN_TESTS.isDone(p.days[2],habit),false);
 w.state.habits=[{lastCompletedDate:p.days[2].date}];
 assert.equal(w.LIFEOS_LEARNING_PLAN_TESTS.isDone(p.days[2],habit),true);
 w.state.customWorkouts=[{date:p.days[9].date}];
 assert.equal(w.LIFEOS_LEARNING_PLAN_TESTS.isDone(p.days[9],movement),true);
 w.state.sleepEntries=[{date:p.days[16].date}];
 assert.equal(w.LIFEOS_LEARNING_PLAN_TESTS.isDone(p.days[16],sleep),true);
 w.state.secondBrain={notes:[{title:'Вывод',updatedAt:p.days[23].date+'T12:00:00.000Z'}]};
 assert.equal(w.LIFEOS_LEARNING_PLAN_TESTS.isDone(p.days[23],brain),true);
 p.completed={[p.days[29].date]:{[review.id]:true}};
 assert.equal(w.LIFEOS_LEARNING_PLAN_TESTS.isDone(p.days[29],review),true);
});

test('respects time bounds and supports one selected course', () => {
  const w = loadPlanner();
  const plan = w.LIFEOS_LEARNING_PLAN_TESTS.buildSchedule('2026-11-09', ['ai_literacy_course'], 500);
  assert.equal(plan.minutesPerDay, 120);
  assert.ok(plan.days.some(day => day.tasks.some(task => task.courseId === 'ai_literacy_course')));
  const minimal = w.LIFEOS_LEARNING_PLAN_TESTS.buildSchedule('2026-11-09', ['ai_literacy_course'], 1);
  assert.equal(minimal.minutesPerDay, 20);
});


test('missed learning tasks are moved forward without losing completed work',()=>{
 const w=loadPlanner(),p=w.LIFEOS_LEARNING_PLAN_TESTS.buildSchedule('2026-11-01',['ai_literacy_course','productivity_course'],35);
 const completedDay=p.days[6],completedTask=completedDay.tasks.find(task=>task.type==='weekly-review');
 p.completed={};p.completed[completedDay.date]={[completedTask.id]:true};
 w.state.learningDevelopmentPlan=p;
 const moved=w.LIFEOS_LEARNING_PLAN_TESTS.rebalance();
 assert.ok(moved>0);
 assert.ok(p.days.find(day=>day.date===completedDay.date).tasks.some(task=>task.id===completedTask.id),'completed review stays on its original day');
 const oldPending=p.days.filter(day=>day.date<'2026-11-09').flatMap(day=>day.tasks);
 assert.ok(oldPending.every(task=>task.id===completedTask.id),'only completed work remains in the past');
 const carried=p.days.filter(day=>day.date>='2026-11-09').flatMap(day=>day.tasks).filter(task=>task.rescheduledFrom);
 assert.equal(carried.length,moved);
 assert.ok(carried.every(task=>task.rescheduledFrom<'2026-11-09'));
 assert.equal(p.endDate,p.days[p.days.length-1].date);
});

test('navigation routes and offline cache include the learning planner', () => {
  const app = fs.readFileSync('app.js', 'utf8');
  const html = fs.readFileSync('index.html', 'utf8');
  const sw = fs.readFileSync('sw.js', 'utf8');
  assert.match(app, /learning:\s*window\.renderLearning\s*\|\|\s*renderLearning/);
  assert.match(app, /plan:\s*window\.renderPersonalPlan\s*\|\|\s*renderPersonalPlan/);
  assert.match(html, /lifeos-learning-plan\.js/);
  assert.match(sw, /life-os-v104/);
  assert.match(sw, /lifeos-learning-plan\.js/);
  const planner = fs.readFileSync('lifeos-learning-plan.js', 'utf8');
  assert.doesNotMatch(planner, /JSON\.stringify\(/, 'inline HTML handlers must not embed double-quoted JSON arguments');
  assert.match(planner, /window\.openLearningPlanDay=specificDay/);
});