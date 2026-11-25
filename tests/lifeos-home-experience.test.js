'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('lifeos-home-experience.js', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');

test('home experience is syntactically valid and loaded after the core app', () => {
  assert.doesNotThrow(() => new vm.Script(source));
  const appScript = index.indexOf('app.js?v=');
  const homeScript = index.indexOf('lifeos-home-experience.js?v=');
  assert.ok(appScript >= 0, 'core app script exists');
  assert.ok(homeScript > appScript, 'home experience loads after app.js');
  assert.match(sw, /\.\/lifeos-home-experience\.js/);
});

test('dashboard organization preserves the original renderer and all feature groups', () => {
  assert.match(source, /var originalRenderDashboard=root\.renderDashboard/);
  assert.match(source, /originalRenderDashboard\.apply\(this,arguments\)/);
  assert.match(source, /Следующий полезный шаг/);
  assert.match(source, /Импульс дня/);
  assert.match(source, /План на завтра/);
  assert.match(source, /Прогресс и рекомендации/);
  assert.match(source, /Дополнительные инструменты/);
  assert.match(source, /Все разделы/);
});

test('all main navigation shortcuts point to existing LIFEOS routes', () => {
  for (const route of ['tasks','learning','calendar','more']) {
    assert.match(source, new RegExp("navigate\\\\\\\\\\\\('"+route+"'\\\\\\\\\\\\)"));
  }
});
