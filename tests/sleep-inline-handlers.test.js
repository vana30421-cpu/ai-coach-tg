'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const app = fs.readFileSync(require('node:path').join(__dirname, '..', 'app.js'), 'utf8');

test('sleep editor inline handlers are exported from the app IIFE', () => {
  assert.match(app, /window\.openSleepForDate\s*=\s*openSleepForDate\s*;/);
  assert.match(app, /window\.saveSleepEntry\s*=\s*saveSleepEntry\s*;/);
  assert.match(app, /window\.deleteSleepEntry\s*=\s*deleteSleepEntry\s*;/);
});

test('sleep editor buttons call the exported save and delete handlers', () => {
  assert.match(app, /onclick="saveSleepEntry\(\)"/);
  assert.match(app, /onclick="deleteSleepEntry\(/);
  assert.match(app, /onclick="openSleepForDate\(today\(\)\)"/);
});

test('sleep overview renders recent records and a seven-day trend without changing stored data', () => {
  assert.match(app, /Среднее за 7 дней/);
  assert.match(app, /Последние записи/);
  assert.match(app, /openSleepForDate\(/);
});
