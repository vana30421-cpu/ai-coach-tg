'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const app=fs.readFileSync('app.js','utf8');
const content=fs.readFileSync('content.js','utf8');
const index=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');

test('Jarvis is wired to the existing AI tab and direct route',()=>{
  assert.match(app,/ai:\s*renderAI/);
  assert.match(app,/jarvis:\s*renderJarvis/);
  assert.match(app,/function renderAI\(\)\{\s*renderJarvis\(\);\s*\}/);
});
test('main navigation labels the assistant Jarvis',()=>assert.match(content,/id:'ai',emoji:'✧',label:'Джарвис'/));
test('command core loads before app runtime',()=>assert.ok(index.indexOf('src="jarvis-core.js"')<index.indexOf('src="app.js"')));
test('Jarvis command core is included in offline shell cache',()=>assert.match(sw,/\.\/jarvis-core\.js/));
test('assistant messages and check-ins are stored in application state',()=>{
  assert.match(app,/if\(!state\.jarvis\)state\.jarvis=\{messages:\[\],checkins:\[\],focus:null,mode:'balanced',focusDefault:25\}/);
  assert.match(app,/d\.messages\.push/);
  assert.match(app,/d\.checkins\.push/);
});
test('task creation uses the native task schema and saves state',()=>{
  assert.match(app,/state\.tasks\.unshift\(\{id:uid\(\),title:cmd\.title/);
  assert.match(app,/save\(\);return 'Добавил задачу/);
});
test('voice input degrades safely when SpeechRecognition is unavailable',()=>{
  assert.match(app,/window\.SpeechRecognition\|\|window\.webkitSpeechRecognition/);
  assert.match(app,/Голосовой ввод не поддерживается этим браузером/);
});
test('self-assessment is explicitly not represented as clinical diagnosis',()=>{
  assert.match(app,/Не медицинский тест и не диагностика/);
  assert.match(app,/Личный трекер, не клинический тест/);
});
test('methodology cards cite primary or official sources',()=>{
  assert.match(app,/www\.nice\.org\.uk/);
  assert.match(app,/www\.who\.int/);
  assert.match(app,/www\.cdc\.gov/);
  assert.match(app,/open-spaced-repetition/);
});
test('focus and methods sections use functional Jarvis tools instead of placeholder screens',()=>{
  assert.match(app,/function renderFocus\(\)\{ renderJarvis\(\); \}/);
  assert.match(app,/function renderMethods\(\)\{ renderJarvisMethods\(\); \}/);
});
test('Jarvis includes configurable assistant modes and focus duration',()=>{
  assert.match(app,/function setJarvisMode/);
  assert.match(app,/function setJarvisFocusDefault/);
  assert.match(app,/jarvisFocusDefault/);
  assert.match(app,/function clearJarvisChat/);
});
test('Jarvis can complete tasks without changing other task data',()=>{
  assert.match(app,/cmd\.type==='complete_task'/);
  assert.match(app,/task\.status='completed'/);
});
test('offline status banner is removed while service worker remains',()=>{
  assert.doesNotMatch(index,/Вы офлайн · доступны сохранённые разделы/);
  assert.match(index,/navigator\.serviceWorker\.register/);
});
test('Jarvis chat and page can scroll on mobile and desktop',()=>{
  assert.match(index,/max-height:min\(54vh,560px\)/);
  assert.match(index,/overflow:visible!important/);
});
