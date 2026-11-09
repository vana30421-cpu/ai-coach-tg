'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const workspaces = fs.readFileSync('lifeos-workspaces.js', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');

test('Telegram WebView uses one explicit vertical scroll container', () => {
  const start = html.indexOf('<style id="lifeos-webview-scroll-fix">');
  const end = html.indexOf('</style>', start);
  assert.ok(start >= 0 && end > start, 'final scroll contract exists');
  const css = html.slice(start, end);
  assert.match(css, /html,body\s*\{[\s\S]*?overflow:hidden!important/);
  assert.match(css, /#app\.app-main\s*\{[\s\S]*?overflow-y:auto!important/);
  assert.match(css, /#app\.app-main\s*\{[\s\S]*?touch-action:pan-y!important/);
  assert.match(css, /#app\.app-main\s*\{[\s\S]*?min-height:0!important/);
  assert.match(css, /\.app-header\s*\{[\s\S]*?flex:0 0 auto!important/);
});

test('scroll viewport adapts to Telegram viewport and mobile keyboard changes', () => {
  assert.match(html, /tg\.viewportHeight/);
  assert.match(html, /viewportChanged/);
  assert.match(html, /visualViewport\.addEventListener\('resize'/);
  assert.match(html, /--lifeos-header-height/);
  assert.match(html, /window\.lifeosScrollToTop=function/);
});

test('page and workspace navigation scroll the actual app viewport', () => {
  assert.match(app, /if\(window\.lifeosScrollToTop\)window\.lifeosScrollToTop\(\)/);
  assert.doesNotMatch(app, /window\.scrollTo\(\{top:0\}\)/);
  assert.match(workspaces, /window\.lifeosScrollToTop\(\)/);
  assert.doesNotMatch(workspaces, /window\.scrollTo\(0,0\)/);
});

test('modal keeps its own scroll and app cache is refreshed', () => {
  assert.match(html, /\.modal\s*\{[\s\S]*?overflow-y:auto!important/);
  assert.match(sw, /const CACHE='life-os-v124'/);
});
