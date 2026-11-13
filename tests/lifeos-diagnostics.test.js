'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const app=fs.readFileSync('app.js','utf8');
const index=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');

test('diagnostics checks storage, runtime errors, modules and data coverage',()=>{
 assert.match(app,/function collectLifeOSDiagnostics\(\)/);
 assert.match(app,/lifeos-diagnostic-probe/);
 assert.match(app,/__LIFEOS_RUNTIME_ERRORS/);
 assert.match(app,/unhandledrejection/);
 assert.match(app,/LIFEOS_INTELLIGENCE_CORE/);
 assert.match(app,/renderNotifications/);
 assert.match(app,/Фоновые push-уведомления/);
 assert.match(app,/Отсутствующие записи не считаются нулевым результатом/);
});

test('diagnostics renderer is available and the updated app is cached offline',()=>{
 assert.match(app,/window\.collectLifeOSDiagnostics=collectLifeOSDiagnostics/);
 assert.match(app,/function renderDiagnostic\(\)/);
 assert.ok(/app\.js\?v=\d{8}-\d+/.test(index));
 assert.ok(/const CACHE='life-os-v\d+'/.test(sw));
 assert.ok(sw.includes('./app.js'));
});
