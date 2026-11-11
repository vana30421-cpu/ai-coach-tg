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
const ws=fs.readFileSync('lifeos-workspaces.js','utf8');
const worker=fs.readFileSync('workers/jarvis-worker.js','utf8');
const setupDoc=fs.readFileSync('CLOUDFLARE_JARVIS_SETUP.md','utf8');

test('all changed browser scripts parse',()=>{
 for(const [name,source] of [['app.js',app],['content.js',content],['jarvis-core.js',fs.readFileSync('jarvis-core.js','utf8')],['sw.js',fs.readFileSync('sw.js','utf8')]])assert.doesNotThrow(()=>new vm.Script(source,{filename:name}));
});

test('vision catalog contains 200 detailed comfort routines, not fake vision-correction drills',()=>{
 const sandbox={window:{},console:{log(){},warn(){},error(){}}};
 vm.runInNewContext(content,sandbox,{filename:'content.js'});
 const routines=sandbox.window.VISION_EXERCISES;
 assert.equal(routines.length,200);
 assert.equal(new Set(routines.map(x=>x.id)).size,200);
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
 assert.match(content,/AAO — экранная нагрузка и редкое моргание/);
});

test('Jarvis can send opt-in conversations with app analytics to a server-side API',()=>{
 assert.match(app,/function buildJarvisAppContext\(memoryQuery\)/);
 assert.match(app,/function sendJarvisCloudMessage\(text\)/);
 assert.match(app,/fetch\(apiUrl/);
 assert.match(app,/function setJarvisApiUrl\(value\)/);
 assert.match(app,/id="jarvisApiUrl"/);
 assert.match(app,/X-Jarvis-Access-Code/);
 assert.match(app,/cloudAIConsent/);
 assert.match(app,/setJarvisCloudAI/);
 assert.match(app,/buildJarvisAppContext\(text\)/);
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


test('memory training measures working and short-term recall, speed, accuracy and FSRS retention intervals',()=>{
 assert.match(app,/function getMemoryTrainingMetrics\(\)/);
 assert.match(app,/startMemoryExercise/);assert.match(app,/working/);
 assert.match(app,/short/);
 assert.match(app,/retentionDelaySeconds:challenge\.retentionDelaySeconds/);assert.match(app,/prior\.length>=8&&accuracy>=80\?30:prior\.length>=4&&accuracy>=70\?15:5/);
 assert.match(app,/memoryAccuracy/);
 assert.match(app,/memoryBestSpan/);
 assert.match(app,/Ежедневный план развития памяти · 10 минут/);
 assert.match(app,/memoryTraining:\{sessions:/);
 assert.match(app,/Долговременная память · 4 минуты/);
});
test('Jarvis context reads canonical second-brain notes and memory training data',()=>{
 assert.match(app,/state\.secondBrain&&Array\.isArray\(state\.secondBrain\.notes\)/);
 assert.match(app,/memoryTraining:\{sessions:memorySessions\.length/);
 assert.match(app,/Анализ Джарвиса/);
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
 assert.match(ws,/state\.journalEntries\.findIndex\(function\(x\)\{return x\.id===row\.id;\}\)/);
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
test('pet care actions update needs, record history and prevent XP farming without punishing missed days',()=>{
 assert.match(systems,/window\.renderPet=function/);
 assert.match(systems,/window\.lifePetAction=function/);
 assert.match(systems,/window\.renameLifePet=function/);
 assert.match(systems,/window\.feedPet=function/);
 assert.match(systems,/limit=\{feed:3,play:1,rest:1,clean:1\}/);
 assert.match(systems,/p\.careLog\.push/);
 assert.match(systems,/Пропуски не наказываются/);
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

test('Jarvis context now includes diary calendar screen anti-stress pet second brain and finance summaries',()=>{
 for(const field of ['journal:journal?','calendar:{today:events','screenTime:{minutes:screen}','antistress:{recent:stress}','pet:{name:pet.name','secondBrain:{notes:brain.length','finance:{month:month','learningProgress:{trackedTopics'])assert.ok(app.includes(field),field);
 assert.match(app,/дневник, календарь, экранное время, антистресс, питомец, второй мозг/);
});
test('learning materials and game routes no longer point to empty placeholders',()=>{
 for(const name of ['renderLearningGames','renderGamePlay','renderMaterials','renderMaterialDetail','renderDailySurvey','renderSurvey','renderPersonalPlan','renderTimer','renderSnapshot','renderRecommendations','renderGcal','renderProjectEditor','renderModuleDetail','renderOnboarding'])assert.match(systems,new RegExp('window\\.'+name+'=function'));
 assert.match(systems,/window\.renderGamesHub\(\)/);
 assert.match(systems,/window\.LEARNING_MATERIALS/);
});

test('active anti-stress flow records partial sessions without awarding XP',()=>{
 assert.match(systems,/plannedDuration:planned,completed:completed/);
 assert.match(systems,/if\(completed&&window\.addXP\)/);
 assert.match(systems,/Частичный результат сохранён без XP/);
});

test('media libraries, resources, medical log, medication log and notification preferences are functional',()=>{
 for(const name of ['renderMovies','renderSeries','renderBooks','renderMusic','renderGames','renderPodcasts','renderEntertainment','renderResources','saveLifeResource','renderMedical','saveMedicalEntry','renderMeds','addLifeMedication','logMedicationTaken','renderNotifications'])assert.match(systems,new RegExp('window\\.'+name+'=function'));
 assert.match(systems,/state\.mediaLibrary/);
 assert.match(systems,/state\.medicalEntries/);
 assert.match(systems,/state\.medications/);
 assert.match(systems,/state\.medicationLogs/);
 assert.match(systems,/window\.requestLifeOSNotificationPermission=async function/);
 assert.match(systems,/Notification\.requestPermission/);
});
test('all legacy renderer placeholders have a working replacement in an extension bundle',()=>{
 const stubs=[...app.matchAll(/function\s+(render\w+)\s*\([^)]*\)\s*\{\s*renderStub\(/g)].map(m=>m[1]);
 const extensions=ws+'\n'+systems;
 const missing=stubs.filter(name=>!new RegExp('window\\.'+name+'\\s*=\\s*function').test(extensions));
 assert.deepEqual(missing,[]);
});
test('finance transactions are included in the comprehensive analytics calculation',()=>{
 assert.match(app,/var financeRows=arr\('financeEntries'\)\.slice\(\)/);
 assert.match(app,/financePeriod=financeRows\.filter/);
});

test('Obsidian full export includes linked life areas, health and finance while keeping local vault selection user-controlled',()=>{
 assert.match(ws,/window\.showDirectoryPicker/);
 assert.match(ws,/getDirectoryHandle\('Areas'/);
 for(const key of ['Tasks.md','Habits.md','Calendar.md','Finance.md','Mood-and-Water.md','Antistress.md'])assert.ok(ws.includes(key),key);
 assert.match(ws,/window\.importObsidianFiles=function/);
 assert.match(ws,/obsidian:\/\/open\?vault=/);
 assert.match(ws,/Экспортировать в выбранный Obsidian Vault/);
});
test('entertainment category cards navigate to the correct media-library routes',()=>{
 assert.match(systems,/\['movies','🎬','Фильмы','movies'\]/);
 assert.match(systems,/\['music','🎵','Музыка','musiclib'\]/);
 assert.match(systems,/\['games','🎮','Игры','gameslib'\]/);
 assert.match(systems,/window\.renderEntertainment=function/);
});

test('Jarvis normalizes legacy second-brain notes before building Gemini/OpenAI context',()=>{
 assert.match(app,/if\(window\.ensureLifeOSBrain\)\{try\{window\.ensureLifeOSBrain\(\);\}catch\(e\)\{\}\}/);
 assert.match(ws,/window\.ensureLifeOSBrain=ensureBrain/);
 assert.match(app,/secondBrain:\{notes:brain\.length,recent:brain\.slice\(-8\)/);
});
test('statistics show a dash instead of the word null when screen-time data is missing',()=>{
 assert.match(app,/f\.screenDailyAvg===null\?'—':f\.screenDailyAvg\+' мин'/);
 assert.match(app,/stats\.focus\.screenDailyAvg===null\?'—':stats\.focus\.screenDailyAvg\+' мин'/);
});

test('FSRS stores a persistent review history with rating and interval for long-term retention metrics',()=>{
 assert.match(app,/state\.fsrs\.reviews\.push\(/);
 assert.match(app,/longTermAccuracy/);
 assert.match(app,/longTermReviews/);
 assert.match(app,/fsrsRetention:fsrsRetention/);
 assert.match(app,/Успешное долговременное воспроизведение/);
});
test('daily learning plan exposes measured long-term recall retention',()=>{
 assert.match(app,/memoryMetrics\.longTermAccuracy===null\?'нет замеров':memoryMetrics.longTermAccuracy\+'%'/);
 assert.match(app,/Интервал удержания перед ответом/);
});

test('Gemini privacy documentation discloses second-brain excerpts sent with opt-in context',()=>{
 assert.match(setupDoc,/короткие фрагменты текста/);
 assert.match(setupDoc,/до 240 символов на заметку/);
 assert.match(setupDoc,/Не включай функцию, если не согласен передавать эти данные/);
});

test('Jarvis always has a configured default Worker endpoint and a useful offline conversational fallback',()=>{
 assert.match(app,/typeof state\.jarvis\.apiUrl!=='string'\)state\.jarvis\.apiUrl='https:\/\/lifeos-jarvis-api\.vana30421\.workers\.dev'/);
 assert.match(app,/return buildJarvisLocalReply\(text\);/);
 assert.match(app,/function buildJarvisLocalReply\(text\)/);
 assert.match(app,/Сервер не отвечает или недоступен из Telegram WebView/);
 assert.match(app,/window\.renderJarvis=renderJarvis/);
 assert.match(app,/window\.renderStats=renderStats/);
});
test('statistics renderer is exposed for diagnostics and uses safe analytics data',()=>{
 assert.match(app,/function renderStats\(\)\{/);
 assert.match(app,/getSafeLifeStats\(LIFE_STATS_PERIOD\)/);
 assert.match(app,/a\.daily\.forEach/);
 assert.match(app,/window\.renderStats=renderStats/);
 assert.match(app,/window\.renderDetailedStats=renderDetailedStats/);
});
