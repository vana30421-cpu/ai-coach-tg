'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const app = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
const sleepStart = app.indexOf('function calcSleepHours');
const sleepEnd = app.indexOf('/* ============ АНТИСТРЕСС ============ */', sleepStart);
assert.ok(sleepStart >= 0 && sleepEnd > sleepStart, 'sleep implementation block must exist');

function createHarness(inputs, saveResult = true, existing = []) {
  const state = { sleepEntries: existing.slice() };
  const effects = { xp: 0, saved: 0, toasts: [], navigations: [] };
  const sandbox = {
    state,
    document: { getElementById: id => inputs[id] ? { ...inputs[id] } : null },
    today: () => '2026-11-14',
    uid: () => 'sleep-new-id',
    nowISO: () => '2026-11-14T00:00:00.000Z',
    save: () => { effects.saved++; return saveResult; },
    addXP: amount => { effects.xp += amount; },
    haptic: () => {},
    toast: message => effects.toasts.push(message),
    navigate: page => effects.navigations.push(page),
    esc: value => String(value),
    confirm: () => true,
    console
  };
  vm.runInNewContext(
    'let currentSleepDate = null;\n' + app.slice(sleepStart, sleepEnd) +
    '\nthis.sleepApi = { calcSleepHours, saveSleepEntry, deleteSleepEntry, openSleepForDate, renderSleepEditor };',
    sandbox
  );
  return { state, effects, api: sandbox.sleepApi };
}

test('sleep entry persists an overnight session and awards XP once', () => {
  const h = createHarness({
    'sl-date': { value: '2026-11-13' },
    'sl-start': { value: '23:00' },
    'sl-end': { value: '07:00' },
    'sl-quality-value': { value: '8' },
    'sl-notes': { value: 'Хорошо выспался' }
  });
  assert.equal(h.api.saveSleepEntry(), true);
  assert.equal(h.state.sleepEntries.length, 1);
  assert.deepEqual(
    { date: h.state.sleepEntries[0].date, start: h.state.sleepEntries[0].start, end: h.state.sleepEntries[0].end, hours: h.state.sleepEntries[0].hours, quality: h.state.sleepEntries[0].quality, notes: h.state.sleepEntries[0].notes },
    { date: '2026-11-13', start: '23:00', end: '07:00', hours: 8, quality: 8, notes: 'Хорошо выспался' }
  );
  assert.equal(h.effects.xp, 5);
  assert.deepEqual(h.effects.navigations, ['sleep']);
});

test('editing a sleep record preserves its ID and does not award duplicate XP', () => {
  const previous = { id: 'stable-sleep-id', date: '2026-11-13', start: '22:30', end: '06:30', hours: 8, quality: 6, notes: '', createdAt: '2026-11-13T00:00:00.000Z' };
  const h = createHarness({
    'sl-date': { value: '2026-11-13' },
    'sl-start': { value: '22:00' },
    'sl-end': { value: '07:00' },
    'sl-quality-value': { value: '9' },
    'sl-notes': { value: 'Обновлено' }
  }, true, [previous]);
  assert.equal(h.api.saveSleepEntry(), true);
  assert.equal(h.state.sleepEntries.length, 1);
  assert.equal(h.state.sleepEntries[0].id, 'stable-sleep-id');
  assert.equal(h.state.sleepEntries[0].hours, 9);
  assert.equal(h.effects.xp, 0);
});

test('invalid calendar dates and impossible clock times are rejected before persistence', () => {
  for (const values of [
    { date: '2026-02-30', start: '23:00', end: '07:00' },
    { date: '2026-11-14', start: '25:00', end: '07:00' },
    { date: '2026-11-14', start: '23:75', end: '07:00' }
  ]) {
    const h = createHarness({
      'sl-date': { value: values.date },
      'sl-start': { value: values.start },
      'sl-end': { value: values.end },
      'sl-quality-value': { value: '7' },
      'sl-notes': { value: '' }
    });
    assert.equal(h.api.saveSleepEntry(), false);
    assert.equal(h.state.sleepEntries.length, 0);
    assert.equal(h.effects.saved, 0);
  }
});

test('failed localStorage persistence rolls back the optimistic sleep mutation', () => {
  const h = createHarness({
    'sl-date': { value: '2026-11-14' },
    'sl-start': { value: '23:00' },
    'sl-end': { value: '07:00' },
    'sl-quality-value': { value: '7' },
    'sl-notes': { value: '' }
  }, false);
  assert.equal(h.api.saveSleepEntry(), false);
  assert.equal(h.state.sleepEntries.length, 0);
  assert.equal(h.effects.xp, 0);
  assert.match(h.effects.toasts.join(' '), /Не удалось сохранить сон/);
});
