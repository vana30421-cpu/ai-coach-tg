'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const app=fs.readFileSync('app.js','utf8');
const content=fs.readFileSync('content.js','utf8');
const content2=fs.readFileSync('content2.js','utf8');
const api=fs.readFileSync('functions/api/jarvis.js','utf8');
const systems=fs.readFileSync('lifeos-systems.js','utf8');
const worker=fs.readFileSync('workers/jarvis-worker.js','utf8');

test('all changed browser scripts parse',()=>{
 for(const [name,source] of [['app.js',app],['content.js',content],['jarvis-core.js',fs.readFileSync('jarvis-core.js','utf8')],['sw.js',fs.readFileSync('sw.js','utf8')]])assert.doesNotThrow(()=>new vm.Script(source,{filename:name}));
});

test('vision catalog contains only five defined comfort routines, not fake vision-correction drills',()=>{
 const sandbox={window:{},console:{log(){},warn(){},error(){}}};
 vm.runInNewContext(content,sandbox,{filename:'content.js'});
 const routines=sandbox.window.VISION_EXERCISES;
 assert.equal(routines.length,5);
 assert.ok(routines.every(x=>x.title&&x.desc&&x.how&&x.science&&x.seconds>0));
 assert.doesNotMatch(content,/Солнечные ванны|Соляризация|Без очков|Природные капли/);
});

test('vision section has timed breaks, symptom logging, exam history and urgent-symptom guidance',()=>{
 for(const name of ['startVisionBreak','finishVisionBreak','openVisionSymptomLog','saveVisionSymptoms','saveVisionExam','startEyeExercise','completeEyeExercise'])assert.match(app,new RegExp('function '+name+'\\('));
 assert.match(app,/visionBreakCountdown/);
 assert.match(app,/eyeExerciseCountdown/);
 assert.match(app,/visionSuddenLoss/);
 assert.match(app,/visionFlashes/);
 assert.match(app,/visionFloaters/);
 assert.match(app,/срочная очная оценка/);
 assert.match(content,/AAO — Computers, Digital Devices, and Eye Strain/);
});

test('Jarvis can send opt-in conversations with app analytics to a server-side API',()=>{
 assert.match(app,/function buildJarvisAppContext\(\)/);
 assert.match(app,/function sendJarvisCloudMessage\(text\)/);
 assert.match(app,/fetch\(apiUrl/);
 assert.match(app,/function setJarvisApiUrl\(value\)/);
 assert.match(app,/id="jarvisApiUrl"/);
 assert.match(app,/X-Jarvis-Access-Code/);
 assert.match(app,/cloudAIConsent/);
 assert.match(app,/setJarvisCloudAI/);
 assert.match(app,/buildJarvisAppContext\(\)/);
 assert.match(app,/Персональная подсказка Джарвиса на главном экране/);
});

test('standalone Worker restricts CORS to the configured app origin and checks its server-side access code',()=>{
 assert.match(worker,/env\.ALLOWED_ORIGIN/);
 assert.match(worker,/Access-Control-Allow-Origin/);
 assert.match(worker,/ORIGIN_NOT_ALLOWED/);
 assert.match(worker,/env\.JARVIS_ACCESS_CODE/);
 assert.match(worker,/X-Jarvis-Access-Code/);
 assert.match(worker,/JARVIS_RATE_LIMITS/);
});

test('server endpoint never embeds the OpenAI secret in the browser and requires server secrets plus access code',()=>{
 assert.match(api,/env\.OPENAI_API_KEY/);
 assert.match(api,/env\.JARVIS_ACCESS_CODE/);
 assert.match(api,/X-Jarvis-Access-Code/);
 assert.match(api,/api\.openai\.com\/v1\/responses/);
 assert.match(api,/max_output_tokens:\s*650/);
 assert.doesNotMatch(app,/sk-[A-Za-z0-9]{20,}/);
});

test('all eight games have playable mechanics and no manual score entry placeholder',()=>{
 for(const id of ['memory','puzzle15','sequences','grids','reaction','math','typing','target'])assert.match(app,new RegExp("id:'"+id+"'"));
 for(const name of ['miniGameFlip','miniGamePuzzleMove','miniGameSequenceAdd','miniGameGridToggle','miniGameReactionClick','miniGameMathAnswer','miniGameTypingCheck','miniGameTargetHit','finishMiniGame'])assert.match(app,new RegExp('function '+name+'\\('));
 const start=app.slice(app.indexOf('function startGame(gameId){'),app.indexOf('function renderMiniGame(){'));
 assert.match(start,/miniGameBody/);
 assert.doesNotMatch(start,/game-score/);
});

test('quick water and mood actions safely save, undo, and avoid duplicate daily mood counts',()=>{
 for(const name of ['quickWaterLog','addWater','removeWater','quickMoodLog','saveMood'])assert.match(app,new RegExp('function '+name+'\\('));
 assert.match(app,/if\(isNew\)state\.stats\.totalMoodLogs=/);
 assert.match(app,/function removeWater\(\)/);
 assert.match(app,/function quickWaterLog\(\)/);
 assert.match(app,/onclick="quickWaterLog\(\)"/);
});

test('Jarvis API rejects missing configuration and invalid access codes',async()=>{
 const source=api.replace(/export async function/g,'async function')+'\nglobalThis.__handlers={onRequestPost,onRequestOptions};';
 const sandbox={Response,fetch:async()=>{throw new Error('fetch must not run')},Date,JSON,Number,String,Math};
 vm.runInNewContext(source,sandbox,{filename:'jarvis-api.js'});
 const handler=sandbox.__handlers.onRequestPost;
 const noConfig=await handler({request:new Request('https://example.test/api/jarvis',{method:'POST',body:JSON.stringify({message:'hello'})}),env:{}});
 assert.equal(noConfig.status,503);
 const unauthorized=await handler({request:new Request('https://example.test/api/jarvis',{method:'POST',headers:{'Content-Type':'application/json','X-Jarvis-Access-Code':'wrong'},body:JSON.stringify({message:'hello'})}),env:{OPENAI_API_KEY:'secret',JARVIS_ACCESS_CODE:'correct'}});
 assert.equal(unauthorized.status,401);
});

test('Jarvis API sends context through Responses API and returns model text',async()=>{
 let sent=null;
 const source=api.replace(/export async function/g,'async function')+'\nglobalThis.__handlers={onRequestPost,onRequestOptions};';
 const sandbox={Response,Date,JSON,Number,String,Math,fetch:async(url,options)=>{sent={url,options};return new Response(JSON.stringify({output_text:'Привет! Я вижу данные LIFEOS.'}),{status:200,headers:{'Content-Type':'application/json'}})}};
 vm.runInNewContext(source,sandbox,{filename:'jarvis-api.js'});
 const request=new Request('https://example.test/api/jarvis',{method:'POST',headers:{'Content-Type':'application/json','X-Jarvis-Access-Code':'correct'},body:JSON.stringify({message:'Проанализируй мой день',history:[{role:'user',content:'Привет'}],context:{tasks:{active:3}}})});
 const response=await sandbox.__handlers.onRequestPost({request,env:{OPENAI_API_KEY:'server-only',JARVIS_ACCESS_CODE:'correct',OPENAI_MODEL:'gpt-5-mini'}});
 const data=await response.json();
 assert.equal(response.status,200);
 assert.match(data.reply,/данные LIFEOS/);
 assert.equal(sent.url,'https://api.openai.com/v1/responses');
 const payload=JSON.parse(sent.options.body);
 assert.equal(payload.model,'gpt-5-mini');
 assert.match(payload.instructions,/tasks/);
 assert.equal(payload.input.length,2);
});

test('schedule renders a selectable week and saves day-specific events with duration',()=>{
 assert.match(app,/function renderSchedule\(\)/);
 assert.match(app,/function addScheduleEvent\(date\)/);
 assert.match(app,/function setLifeScheduleDate\(date\)/);
 assert.match(app,/scheduleDuration/);
 assert.match(app,/calendarEvents\.push\(\{id:uid\(\),source:'lifeos',title:title\.value\.trim\(\),date:date/);
});
test('journal stores one editable daily entry with reflection fields and preserves history',()=>{
 for(const name of ['renderJournal','saveJournalEntry','deleteJournalEntry'])assert.match(app,new RegExp('function '+name+'\\('));
 for(const id of ['journalText','journalMood','journalEnergy','journalWins','journalBlockers','journalGratitude','journalTomorrow'])assert.match(app,new RegExp('id="'+id+'"'));
 assert.match(app,/state\.journalEntries\.findIndex\(function\(x\)\{return x\.date===today\(\);\}\)/);
});
test('second brain stores searchable knowledge and exports diary and knowledge to Markdown',()=>{
 for(const name of ['renderObsidianIntegration','saveSecondBrainItem','filterSecondBrain','deleteSecondBrainItem','exportToObsidian','openObsidianDailyNote'])assert.match(app,new RegExp('function '+name+'\\('));
 assert.match(app,/state\.secondBrainItems\.push/);
 assert.match(app,/## Дневник/);
 assert.match(app,/## Знания/);
 assert.match(app,/obsidian:\/\/daily\?vault=/);
});
test('anti-stress fast actions use real content IDs and guided before-after practices are saved',()=>{
 assert.match(content2,/id:'as_ground_54321'/);
 for(const name of ['renderAntistress','startAntistress','finishAntistress'])assert.match(systems,new RegExp('window\\.'+name+'=function'));
 assert.match(systems,/asBefore/);
 assert.match(systems,/asAfter/);
 assert.match(systems,/durationSeconds/);
 assert.match(systems,/stepsDone/);
});
test('pet hunger changes with elapsed time and feeding updates the live value',()=>{
 for(const name of ['getPetLiveState','renderPet','renamePet','feedPet'])assert.match(app,new RegExp('function '+name+'\\('));
 assert.match(app,/elapsed\*3/);
 assert.match(app,/getPetLiveState\(\)\.hunger \+ 20/);
 assert.match(app,/feedHistory/);
});
test('Jarvis exposes the Gemini provider and the Worker uses a server-side Gemini secret',()=>{
 assert.match(app,/function setJarvisProvider\(value\)/);
 assert.match(app,/value="gemini"/);
 assert.match(app,/provider:d\.provider\|\|'openai'/);
 assert.match(worker,/env\.GEMINI_API_KEY/);
 assert.match(worker,/generativelanguage\.googleapis\.com/);
 assert.match(worker,/gemini-2\.5-flash/);
});

test('manual full save and journal autosave are exposed and preserve backup snapshots',()=>{
 assert.match(app,/function manualSaveAll\(\)/);
 assert.match(app,/function queueJournalAutosave\(\)/);
 assert.match(app,/function saveJournalEntry\(silent\)/);
 assert.match(app,/onclick="manualSaveAll\(\)"/);
 assert.match(app,/journalAutosaveStatus/);
});
test('anti-stress timer cannot award completion XP before the actual duration',()=>{
 assert.match(app,/function finishAntistressRecord\(completed\)/);
 assert.match(app,/function finishAntistressEarly\(\)/);
 assert.match(app,/if\(!antiTimerFinished\)/);
 assert.match(app,/if\(completed\)addXP\(5,'antistress'\)/);
 assert.match(app,/plannedDuration:antiTimerDuration/);
 assert.match(app,/disabled onclick="finishAntistress\(\)"/);
});

test('previously blank reference sections now render searchable libraries and save progress',()=>{
 for(const name of ['renderLifeLibrary','renderLifeLibraryRows','renderPsychology','renderThinking','renderEtiquette','renderHormones','renderRecovery','renderIQ','renderEQ','renderNeuro','renderWealth'])assert.match(systems,new RegExp('window\\.'+name+'=function|function '+name+'\\('));
 assert.match(systems,/window\.filterLifeLibrary=function/);
 assert.match(systems,/window\.markLifeLibraryDone=function/);
});
test('finance section supports local income and expense records with validation',()=>{
 assert.match(systems,/window\.renderFinance=function/);
 assert.match(systems,/window\.addFinanceEntry=function/);
 assert.match(systems,/window\.deleteFinanceEntry=function/);
 assert.match(systems,/state\.financeEntries\.push/);
 assert.match(systems,/amount<=0/);
});
test('stats page can hand a real period-specific analysis to Jarvis',()=>{
 assert.match(app,/onclick="askJarvisAboutStats\(\)"/);
 assert.match(systems,/window\.askJarvisAboutStats=function/);
 assert.match(systems,/Разбери мою статистику LIFE OS/);
});
test('weekly schedule add action defaults to the currently selected date',()=>{
 assert.match(app,/function addScheduleEvent\(date\)\{date=date\|\|window\.LIFEOS_SELECTED_CAL_DATE\|\|today\(\)/);
 assert.match(systems,/onclick="addScheduleEvent\(\)"/);
});
