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

test('notification module parses without browser globals at load time',()=>{
 assert.doesNotThrow(()=>new vm.Script(notifications,{filename:'lifeos-notifications.js'}));
});

test('calendar stores end time and warns about overlapping events',()=>{
 assert.match(calendar,/endTime:\$\('lcEndTime'\)\.value/);
 assert.match(calendar,/Время окончания должно быть позже начала/);
 assert.match(calendar,/Есть пересечение с событием/);
 assert.match(calendar,/e\.endTime\?'–'\+e\.endTime/);
});
