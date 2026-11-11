'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const index=fs.readFileSync('index.html','utf8');
const notifications=fs.readFileSync('lifeos-notifications.js','utf8');
const systems=fs.readFileSync('lifeos-systems.js','utf8');
const sw=fs.readFileSync('sw.js','utf8');

test('the full notification center renderer loads after the legacy systems renderer',()=>{
 const systemsAt=index.indexOf('lifeos-systems.js');
 const notificationsAt=index.indexOf('lifeos-notifications.js');
 const calendarAt=index.indexOf('lifeos-calendar-v2.js');
 assert.ok(systemsAt>=0&&notificationsAt>systemsAt);
 assert.ok(calendarAt>notificationsAt);
 assert.match(systems,/window\.renderNotifications=function/);
 assert.match(notifications,/window\.renderNotifications=render/);
 assert.match(notifications,/lifeNoticeAddCalendarReminder/);
});

test('notification settings expose permission, reminders and delivery limitations',()=>{
 assert.match(notifications,/function requestPermission/);
 assert.match(notifications,/function schedule/);
 assert.match(notifications,/Для гарантированной доставки в фоне нужен push-сервис/);
 assert.ok(sw.includes('life-os-v179'));
 assert.ok(sw.includes('./lifeos-notifications.js'));
});
