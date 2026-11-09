'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('lifeos-search.js', 'utf8');
function setup(){
 const elements = {
  lifeosGlobalSearchResults: { innerHTML: '' },
  lifeosGlobalSearchInput: { focus(){ this.focused = true; } }
 };
 const calls = [];
 const window = {
  esc(value){ return String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); },
  openSheet(title, html){ calls.push(['sheet', title, html]); },
  closeSheet(){ calls.push(['close']); },
  navigate(page){ calls.push(['navigate', page]); },
  openEntityEditor(type,id){ calls.push(['task', type, id]); },
  openProject(id){ calls.push(['project', id]); },
  openHabitDetail(id){ calls.push(['habit', id]); },
  editJournalEntry(id){ calls.push(['journal', id]); },
  openBrainNote(id){ calls.push(['brain', id]); },
  selectLifeOSCalendarDate(date){ calls.push(['calendar', date]); }
 };
 const state = {
  tasks:[{id:'t1',title:'Подготовить презентацию',description:'проект LIFEOS'}],
  projects:[{id:'p1',title:'LIFEOS',description:'личная система'}],
  habits:[{id:'h1',title:'Читать',description:'каждый день'}],
  journalEntries:[{id:'j1',title:'Итоги дня',text:'сделал важное',date:'2026-11-09'}],
  secondBrain:{notes:[{id:'b1',title:'Идея второго мозга',body:'связи и знания',tags:['obsidian']}]},
  calendarEvents:[{id:'c1',title:'Планирование',note:'неделя',date:'2026-11-10'}]
 };
 const document = { getElementById(id){ return elements[id] || null; } };
 vm.runInNewContext(source,{window,state,document,setTimeout(fn){fn();},Array,String,Number,Math,RegExp,Object,JSON});
 return {window,state,elements,calls};
}

test('global search opens from any page and explains its local search scope',()=>{
 const x=setup();x.window.openLifeOSGlobalSearch();
 assert.equal(x.calls[0][0],'sheet');
 assert.equal(x.calls[0][1],'Поиск по LIFEOS');
 assert.match(x.calls[0][2],/lifeosGlobalSearchInput/);
 assert.equal(x.elements.lifeosGlobalSearchInput.focused,true);
});

test('global search indexes tasks, projects, habits, journal, second brain and calendar',()=>{
 const x=setup();
 x.window.renderLifeOSGlobalSearch('lifeos');
 assert.match(x.elements.lifeosGlobalSearchResults.innerHTML,/Подготовить презентацию/);
 assert.match(x.elements.lifeosGlobalSearchResults.innerHTML,/LIFEOS/);
 x.window.renderLifeOSGlobalSearch('obsidian');
 assert.match(x.elements.lifeosGlobalSearchResults.innerHTML,/Идея второго мозга/);
 x.window.renderLifeOSGlobalSearch('неделя');
 assert.match(x.elements.lifeosGlobalSearchResults.innerHTML,/Планирование/);
});

test('search uses AND matching for multiple terms and reports empty results',()=>{
 const x=setup();
 x.window.renderLifeOSGlobalSearch('презентацию проект');
 assert.match(x.elements.lifeosGlobalSearchResults.innerHTML,/Подготовить презентацию/);
 x.window.renderLifeOSGlobalSearch('несуществующая фраза');
 assert.match(x.elements.lifeosGlobalSearchResults.innerHTML,/Ничего не найдено/);
});

test('search result routes to the original record without changing stored data',()=>{
 const x=setup();
 const before=JSON.stringify(x.state);
 x.window.openLifeOSSearchResult('brain','b1','');
 assert.deepEqual(x.calls.slice(0,2),[['close'],['navigate','obsidian']]);
 assert.deepEqual(x.calls[2],['brain','b1']);
 assert.equal(JSON.stringify(x.state),before);
});

test('all supported result types route to their owning LIFEOS sections',()=>{
 const x=setup();
 for(const [type,id,date,expected] of [
  ['task','t1','',['navigate','tasks']],
  ['project','p1','',['project','p1']],
  ['habit','h1','',['habit','h1']],
  ['journal','j1','',['navigate','journal']],
  ['calendar','c1','2026-11-10',['calendar','2026-11-10']]
 ]){
  x.window.openLifeOSSearchResult(type,id,date);
  assert.ok(x.calls.some(c=>c[0]===expected[0]&&(expected.length===1||c[1]===expected[1])),type);
 }
});
