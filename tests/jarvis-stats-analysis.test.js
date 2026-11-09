'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('app.js','utf8');

function loadFormatter(){
 const start=source.indexOf('function formatJarvisStatsSummary(a,analysis){');
 const end=source.indexOf('\nfunction jarvisReply(text){',start);
 assert.ok(start>=0&&end>start,'statistics formatter must exist before Jarvis command handler');
 const sandbox={};vm.createContext(sandbox);vm.runInContext(source.slice(start,end)+';this.format=formatJarvisStatsSummary;',sandbox);return sandbox.format;
}

test('Jarvis statistics summary uses saved data and distinguishes missing values from zero',()=>{
 const format=loadFormatter();
 const report=format({
  label:'За 30 дн.',
  overview:{tasksDonePeriod:12,tasksPending:4,overdue:1,habitEvents:28,habitTotal:5},
  health:{sleepAvgHours:7.2,sleepTarget:8,moodAvg:null,moodEntries:0,workouts:3,walks:6,antistress:2},
  focus:{screenDailyAvg:180,screenEntries:12,screenCoveragePct:40,focusSessions:8,checkins:4},
  learning:{studySessions:5,studyMinutes:95,fsrsDue:7},
  life:{projectsDone:1,projects:3},
  coverage:{percent:55}
 },{items:[{title:'Сон ниже цели',detail:'7.2 ч против 8 ч',action:'Проверь вечерний график.'}]});
 assert.match(report,/Выполнено задач: 12/);
 assert.match(report,/активных: 4; просрочено: 1/);
 assert.match(report,/Настроение: нет данных/);
 assert.match(report,/Экран: 180 мин\/день/);
 assert.match(report,/повторений FSRS ожидают: 7/);
 assert.match(report,/Сон ниже цели/);
 assert.match(report,/не считывается автоматически/);
});

test('summary commands build the comprehensive report and cloud mode routes summary to the configured provider',()=>{
 assert.match(source,/if\(cmd\.type==='summary'\)\{[\s\S]*?buildComprehensiveStats\(/);
 assert.match(source,/d\.cloudAIEnabled&&\(parsed\.type==='chat'\|\|parsed\.type==='summary'\)\)\{sendJarvisCloudMessage\(text\);return;\}/);
});
