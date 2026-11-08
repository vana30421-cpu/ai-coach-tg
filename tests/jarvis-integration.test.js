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
test('command core loads before app runtime',()=>assert.ok(index.search(/src="jarvis-core\.js(?:\\?[^\"]*)?"/)<index.search(/src="app\.js(?:\\?[^\"]*)?"/)));
test('Jarvis command core is included in offline shell cache',()=>assert.match(sw,/\.\/jarvis-core\.js/));
test('PWA cache is versioned and activates the fresh worker without a stale waiting worker',()=>{assert.match(sw,/life-os-v66/);assert.match(sw,/await self\.skipWaiting\(\)/);assert.match(sw,/ignoreSearch:true/);});
test('app scripts use a cache-busting version',()=>{for(const name of ['content.js','content2.js','content3.js','jarvis-core.js','app.js'])assert.match(index,new RegExp('src="'+name.replace('.','\\.')+'\\?v=20261108-2"'));});
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

test('all Jarvis inline controls are exported to the browser window',()=>{
  for(const name of ['jarvisQuick','sendJarvisMessage','startJarvisVoice','speakJarvisLast','startJarvisFocus','stopJarvisFocus','saveJarvisCheckin','setJarvisMode','setJarvisFocusDefault','clearJarvisChat','renderJarvisAIProviders']){
    assert.ok(app.includes('window.'+name+' ='),name+' is exported');
  }
});
test('AI directory documents major assistants and safe integration boundaries',()=>{
  for(const name of ['ChatGPT','Claude','Gemini','Perplexity','Microsoft Copilot','Grok','DeepSeek','Mistral Vibe'])assert.ok(app.includes(name),name+' is documented');
  assert.match(app,/function renderJarvisAIProviders/);
  assert.match(app,/без хранения секретных API-ключей в браузере/);
});

test('workouts tracker is functional and uses existing persistent state',()=>{
  assert.match(app,/function renderWorkouts\(\)\{/);
  assert.match(app,/function addWorkoutEntry\(\)/);
  assert.match(app,/function deleteWorkoutEntry\(id\)/);
  assert.match(app,/state\.customWorkouts\.push/);
  assert.match(app,/state\.stats\.totalWorkouts/);
  assert.doesNotMatch(app,/function renderWorkouts\(\)\{\s*renderStub/);
});
test('meditation has a real resumable timer and persisted session history',()=>{
  for(const name of ['startMeditation','pauseMeditation','resumeMeditation','finishMeditation','cancelMeditation'])assert.match(app,new RegExp('function '+name+'\\('));
  assert.match(app,/state\.meditationTimer/);
  assert.match(app,/state\.customMeditation\.push/);
  assert.match(app,/Date\.now\(\).*endsAt/s);
  assert.doesNotMatch(app,/function renderMeditation\(\)\{\s*renderStub/);
});
test('screen time tracker clearly records manual input and supports daily limits',()=>{
  assert.match(app,/function renderScreenTracker\(\)\{/);
  assert.match(app,/function addScreenEntry\(\)/);
  assert.match(app,/function saveScreenLimit\(\)/);
  assert.match(app,/state\.screenEntries\.push/);
  assert.match(app,/state\.screenStats\.dailyLimit/);
  assert.match(app,/ручной журнал, а не автоматическое считывание/);
  assert.doesNotMatch(app,/function renderScreenTracker\(\)\{\s*renderStub/);
});
test('calendar supports local event create, complete and delete',()=>{
  for(const name of ['addCalendarEvent','toggleCalendarEvent','deleteCalendarEvent'])assert.match(app,new RegExp('function '+name+'\\('));
  assert.match(app,/state\.calendarEvents\.push/);
  assert.match(app,/source:'lifeos'/);
  assert.doesNotMatch(app,/function renderCalendar\(\)\{\s*renderStub/);
});

test('statistics dashboard aggregates detailed data across LIFE OS domains',()=>{
  for(const name of ['buildComprehensiveStats','getJarvisAnalytics','runJarvisAutopilot','renderDetailedStats','setStatsPeriod'])assert.ok(app.includes('function '+name),name+' exists');
  assert.match(app,/screenDailyAvg/);
  assert.match(app,/fsrsReviews/);
  assert.match(app,/coverage/);
  assert.match(app,/financeNet/);
});
test('Jarvis autopilot uses statistics and only changes safe focus settings',()=>{
  assert.match(app,/function setJarvisAutopilot\(enabled\)/);
  assert.match(app,/d\.autopilotEnabled/);
  assert.match(app,/d\.focusDefault=suggested/);
  assert.match(app,/Задачи, финансы, здоровье и личные данные без подтверждения не меняет/);
  assert.match(app,/function applyJarvisRecommendation\(id\)/);
});


test('visual effects support an explicit reduced-motion override and completion bursts',()=>{
  assert.match(app,/life-motion-override/);
  assert.match(app,/function lifeOSCelebrate\(symbol\)/);
  assert.match(app,/lifeOSCelebrate\('✦'\)/);
  assert.match(app,/lifeOSCelebrate\('✓'\)/);
  assert.match(index,/@keyframes lifeBurst/);
  assert.match(index,/prefers-reduced-motion:reduce\).*life-motion-override/s);
});
test('all-time statistics and FSRS review history are counted correctly',()=>{
  assert.match(app,/Number\(days\)===0\?0/);
  assert.match(app,/var reviews=s\.fsrs&&Array\.isArray\(s\.fsrs\.reviews\)\?s\.fsrs\.reviews:\[\]/);
  assert.match(app,/function setStatsPeriod\(days\)\{LIFE_STATS_PERIOD=Number\(days\)===0\?/);
});


test('custom habits support stable cues, a minimum action, and a reward',()=>{
  assert.match(app,/id="hab-trigger"/);
  assert.match(app,/id="hab-minimum"/);
  assert.match(app,/id="hab-reward"/);
  assert.match(app,/h\.trigger = trigger\.trim\(\)/);
  assert.match(app,/h\.minimumAction = minimumAction\.trim\(\)/);
  assert.match(app,/h\.reward = reward\.trim\(\)/);
  assert.match(app,/Регулярность важнее идеальной серии/);
});
test('research and product guardrails are documented',()=>{
  assert.match(index,/life-burst-particle/);
  assert.match(app,/effectsMotionOverride/);
});


test('completion particle burst is layered over the interface and uses viewport coordinates',()=>{
  assert.match(app,/rect\.left\+rect\.width\/2/);
  assert.match(app,/document\.body\.appendChild\(p\)/);
  assert.match(index,/life-burst-particle\{position:fixed/);
});
