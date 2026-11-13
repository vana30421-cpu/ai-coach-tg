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
  assert.match(app, /onclick="openSleepForDate\(/);
});
