'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('lifeos-learning-plan.js', 'utf8');
function loadPlanner() {
  const window = {
    ALL_NEW_COURSES: [],
    ENGLISH_125: [{id:'a1_01',level:'A1',title:'Present Simple'}],
    SKILLS_LIBRARY: [{id:'sk_1',title:'Память'}],
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

test('adds twelve structured courses with lessons, theory and practice', () => {
  const w = loadPlanner();
  const added = w.ALL_NEW_COURSES;
  assert.equal(added.length, 12);
  assert.equal(added.reduce((sum, course) => sum + course.modules.reduce((n, module) => n + module.lessons.length, 0), 0), 52);
  assert.equal(new Set(added.map(course => course.id)).size, 12);
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

test('Jarvis receives the live monthly, weekly and daily development-plan summary',()=>{
 const w=loadPlanner(),p=w.LIFEOS_LEARNING_PLAN_TESTS.buildSchedule('2026-11-09',['ai_literacy_course','productivity_course'],35);
 w.state.learningDevelopmentPlan=p;
 const today=p.days[0],task=today.tasks.find(x=>x.type==='reflection');
 p.completed={[today.date]:{[task.id]:true}};
 const summary=w.getLifeOSLearningPlanSummary();
 assert.equal(summary.startDate,'2026-11-09');
 assert.equal(summary.currentDay.number,1);
 assert.equal(summary.currentDay.done,1);
 assert.ok(summary.overall.total>0);
 assert.ok(summary.week.total>0);
 assert.ok(summary.courses.includes('Грамотная работа с ИИ'));
 assert.ok(summary.currentDay.tasks.some(x=>x.title===task.title&&x.done));
 const app=fs.readFileSync('app.js','utf8');
 assert.match(app,/developmentPlan=window\.getLifeOSLearningPlanSummary\?window\.getLifeOSLearningPlanSummary\(\):null/);
 assert.match(app,/developmentPlan:developmentPlan/);
 assert.match(app,/Твой план развития:/);
});

test('navigation routes and offline cache include the learning planner', () => {
  const app = fs.readFileSync('app.js', 'utf8');
  const html = fs.readFileSync('index.html', 'utf8');
  const sw = fs.readFileSync('sw.js', 'utf8');
  assert.match(app, /learning:\s*window\.renderLearning\s*\|\|\s*renderLearning/);
  assert.match(app, /plan:\s*window\.renderPersonalPlan\s*\|\|\s*renderPersonalPlan/);
  assert.match(html, /lifeos-learning-plan\.js/);
  assert.ok(sw.includes('life-os-v171'));
  assert.match(sw, /lifeos-learning-plan\.js/);
  const planner = fs.readFileSync('lifeos-learning-plan.js', 'utf8');
  assert.doesNotMatch(planner, /JSON\.stringify\(/, 'inline HTML handlers must not embed double-quoted JSON arguments');
  assert.match(planner, /window\.openLearningPlanDay=specificDay/);
});
test('unified development plan includes English and practical skills with real completion state',()=>{
 const w=loadPlanner();
 const p=w.LIFEOS_LEARNING_PLAN_TESTS.buildSchedule('2026-11-09',['ai_literacy_course'],35,{english:true,skills:true});
 assert.equal(p.tracks.english,true);assert.equal(p.tracks.skills,true);
 const tasks=p.days.flatMap(d=>d.tasks);
 assert.ok(tasks.some(t=>t.type==='english'&&t.idRef==='a1_01'));
 assert.ok(tasks.some(t=>t.type==='skill'&&t.idRef==='sk_1'));
 assert.ok(tasks.filter(t=>t.type==='english').length>0,'English must be scheduled in the first month');
 assert.ok(tasks.filter(t=>t.type==='skill').length>0,'skills must be scheduled in the first month');
 w.state.englishProgress={a1_01:{completed:true}};
 w.state.skillsProgress={sk_1:{completed:true}};
 const e=tasks.find(t=>t.type==='english'),k=tasks.find(t=>t.type==='skill');
 const ed=p.days.find(d=>d.tasks.includes(e)),kd=p.days.find(d=>d.tasks.includes(k));
 assert.equal(w.LIFEOS_LEARNING_PLAN_TESTS.isDone(ed,e),true);
 assert.equal(w.LIFEOS_LEARNING_PLAN_TESTS.isDone(kd,k),true);
});
test('learning planner UI exposes English and skill tracks',()=>{
 const planner=fs.readFileSync('lifeos-learning-plan.js','utf8');
 assert.match(planner,/id="planEnglish"/);assert.match(planner,/id="planSkills"/);
 assert.match(planner,/type==='english'/);assert.match(planner,/type==='skill'/);
 assert.match(planner,/window\.openEnglishLesson\(t\.idRef\)/);
 assert.match(planner,/window\.openSkill\(t\.idRef\)/);
});
test('English and skill lessons are enriched with practical instructions and mastery checks',()=>{
 const source=fs.readFileSync('lifeos-learning-content.js','utf8');
 const window={ENGLISH_125:[{id:'a1_01',level:'A1',title:'Present Simple'}],SKILLS_LIBRARY:[{id:'sk_1',title:'Память'}],state:{},esc:String};
 vm.runInNewContext(source,{window,Date,Math});
 assert.match(window.ENGLISH_125[0].theory,/habits|факт|привыч/i);
 assert.ok(window.ENGLISH_125[0].examples.length>20);
 assert.ok(window.ENGLISH_125[0].practice.length>30);
 assert.equal(window.ENGLISH_125[0].steps.length,3);
 assert.ok(window.LIFEOSLearningContent.skillInfo(window.SKILLS_LIBRARY[0]).practice.length>30);
});

test('unified plan removes course cap and expands to schedule every selected lesson',()=>{
 const w=loadPlanner(),ids=w.ALL_NEW_COURSES.map(course=>course.id);
 const p=w.LIFEOS_LEARNING_PLAN_TESTS.buildSchedule('2026-11-09',ids,35,{english:true,skills:true});
 const lessons=p.days.flatMap(day=>day.tasks).filter(task=>['lesson','english','skill'].includes(task.type));
 assert.ok(p.days.length>30,'plan duration expands to fit selected curriculum');
 assert.equal(lessons.length,54,'all 52 course lessons plus English and skills are scheduled');
 assert.equal(new Set(lessons.map(task=>task.id)).size,lessons.length,'no lesson is duplicated');
 assert.ok(p.days.some(day=>day.tasks.some(task=>task.type==='practice')),'application practice follows the lessons');
 assert.ok(source.includes('(Math.ceil(Math.max(1,lessons.length)/6)+1)*7'));
 assert.doesNotMatch(source,/ids\.length>5/);
});
test('learning plan UI supports bulk course selection and dynamic duration',()=>{
 assert.match(source,/Выбрать все курсы/);
 assert.match(source,/Снять выбор/);
 assert.match(source,/p\.days\.length/);
 assert.match(source,/lifeos-learning-hub/);
});
