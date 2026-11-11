'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const index=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const notifications=fs.readFileSync('lifeos-notifications.js','utf8');
const calendar=fs.readFileSync('lifeos-calendar-v2.js','utf8');

test('notification center is loaded and cached for offline use',()=>{
 assert.match(index,/lifeos-notifications\.js\?v=/);
 assert.match(sw,/\.\/lifeos-notifications\.js/);
 assert.match(notifications,/window\.renderNotifications=render/);
});

test('notification preferences include quiet hours, categories and local reminders',()=>{
 for(const token of ['quietStart','quietEnd','categories','reminders','Notification.requestPermission','showNotification','lifeNoticeAdd','lifeNoticeDone','lifeNoticeDelete'])assert.ok(notifications.includes(token),token);
 assert.match(notifications,/тихих часов/);
 assert.match(notifications,/navigator\.serviceWorker/);
});

test('calendar reminder and check-in settings APIs are available',()=>{assert.match(notifications,/lifeNoticeAddCalendarReminder/);assert.match(notifications,/calendarLeadMinutes/);assert.match(notifications,/renderLifeOSCheckinSettings/);});
test('notification module parses without browser globals at load time',()=>{
 assert.doesNotThrow(()=>new vm.Script(notifications,{filename:'lifeos-notifications.js'}));
});

test('calendar zoom, colors and reminder integration are available',()=>{assert.match(calendar,/lifeCalendarZoomTo/);assert.match(calendar,/COLOR_LABELS/);assert.match(calendar,/lifeNoticeAddCalendarReminder/);});
test('calendar stores end time and warns about overlapping events',()=>{
 assert.match(calendar,/endTime:\$\('lcEndTime'\)\.value/);
 assert.match(calendar,/Время окончания должно быть позже начала/);
 assert.match(calendar,/Есть пересечение с событием/);
 assert.match(calendar,/e\.endTime\?'–'\+e\.endTime/);
});

test('sleep save validates and persists before reward',()=>{const app=fs.readFileSync('app.js','utf8');const fn=app.slice(app.indexOf('function saveSleepEntry(){'),app.indexOf('function deleteSleepEntry('));assert.match(fn,/if\(!save\(\)\)/);assert.match(fn,/if\(!previous\)addXP/);assert.match(fn,/hours>24/);});
test('check-in routines enforce once-per-period persistence',()=>{const routines=fs.readFileSync('lifeos-routines.js','utf8');for(const k of ['morningStart','eveningStart','weeklyEnabled','monthlyEnabled','checkinShown','dailyReviews','tomorrowPlans','weeklyReview','monthlyReviews'])assert.ok(routines.includes(k),k);assert.match(routines,/lifeOSCheckinOnOpen/);});
