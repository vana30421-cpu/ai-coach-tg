'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync(require.resolve('../lifeos-learning-experience.js'),'utf8');
const window={ALL_NEW_COURSES:[]};
vm.runInNewContext(source,{window,document:{},Date,Math,Array,Object,String,Number,isFinite});
const scheduler=window.LIFEOS_LEARNING_SCHEDULER;
test('scheduler is exposed without browser storage or network dependencies',()=>{assert.ok(scheduler);assert.equal(typeof scheduler.schedule,'function');});
test('first successful retrieval is due in one day',()=>{
 const result=scheduler.schedule({},4,new Date('2026-11-12T12:00:00Z'));
 assert.equal(result.learningSchedule.intervalDays,1);
 assert.equal(result.nextReviewAt,'2026-11-13');
 assert.equal(result.reviewCount,1);
});
test('successful retrieval grows intervals and preserves schedule metadata',()=>{
 let record={};
 record=scheduler.schedule(record,4,new Date('2026-11-12T12:00:00Z'));
 record=scheduler.schedule(record,4,new Date('2026-11-13T12:00:00Z'));
 assert.equal(record.learningSchedule.intervalDays,3);
 record=scheduler.schedule(record,5,new Date('2026-11-16T12:00:00Z'));
 assert.ok(record.learningSchedule.intervalDays>=6);
 assert.equal(record.learningSchedule.repetitions,3);
 assert.equal(record.reviewCount,3);
});
test('a lapse resets repetitions, shortens interval and records lapse count',()=>{
 let record=scheduler.schedule({},4,new Date('2026-11-12T12:00:00Z'));
 record=scheduler.schedule(record,4,new Date('2026-11-13T12:00:00Z'));
 const failed=scheduler.schedule(record,2,new Date('2026-11-16T12:00:00Z'));
 assert.equal(failed.learningSchedule.repetitions,0);
 assert.equal(failed.learningSchedule.intervalDays,1);
 assert.equal(failed.learningSchedule.lapses,1);
});
test('interval is bounded and grade is clamped',()=>{
 let record={learningSchedule:{repetitions:20,intervalDays:365,easeFactor:3.5}};
 const result=scheduler.schedule(record,99,new Date('2026-11-12T12:00:00Z'));
 assert.equal(result.learningSchedule.intervalDays,365);
 assert.equal(result.learningSchedule.lastGrade,5);
});
test('legacy nextReviewAt is used as a backwards-compatible interval hint',()=>{
 const result=scheduler.schedule({reviewCount:4,nextReviewAt:'2026-11-19'},4,new Date('2026-11-12T12:00:00Z'));
 assert.equal(result.learningSchedule.intervalDays,3);
 assert.equal(result.reviewCount,5);
});
test('summary distinguishes due, scheduled and mastered items',()=>{
 const records=[
  {completed:true,nextReviewAt:'2026-11-10',learningSchedule:{intervalDays:30}},
  {completed:true,nextReviewAt:'2026-11-20',learningSchedule:{intervalDays:3}},
  {completed:false,nextReviewAt:'2026-11-01',learningSchedule:{intervalDays:50}}
 ];
 const result=scheduler.summarize(records,new Date('2026-11-12T12:00:00Z'));
 assert.deepEqual(JSON.parse(JSON.stringify(result)),{scheduled:2,due:1,mastered:1,averageIntervalDays:16.5});
});
