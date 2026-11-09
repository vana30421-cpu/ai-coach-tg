'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const workspaces=fs.readFileSync('lifeos-workspaces.js','utf8');
const systems=fs.readFileSync('lifeos-systems.js','utf8');
const workerSource=fs.readFileSync('workers/jarvis-worker.js','utf8');
const app=fs.readFileSync('app.js','utf8');
const index=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');

function sandboxFor(source){
 const values={};const appRoot={innerHTML:''};
 const sandbox={
  console,Date,Math,Number,String,Array,Object,JSON,RegExp,Promise,Blob,URL,Response,Request,FileReader:function(){},
  setTimeout:()=>1,clearTimeout:()=>{},setInterval:()=>1,clearInterval:()=>{},
  state:{tasks:[],calendarEvents:[],journalEntries:[],pet:{enabled:true,name:'Пиксель',stage:1,xp:0,xpToNext:100,hunger:60,mood:'happy',fedCount:0},antistressEntries:[]},
  document:{getElementById(id){return id==='app'?appRoot:(values[id]||null);},addEventListener(){},createElement(){return {click(){},set href(v){},set download(v){}};}},
  save(){},toast(){},haptic(){},uid:(()=>{let n=0;return()=>'id-'+(++n);})(),today:()=> '2026-11-08',nowISO:()=> '2026-11-08T12:00:00.000Z',
  esc(v){return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));},
  openSheet(title,html){appRoot.innerHTML=html;},closeSheet(){},navigate(){},confirm(){return true;},addXP(){},addPetXP(n){sandbox.state.pet.xp+=n;},
  ANTISTRESS_CATEGORIES:[{id:'breath',emoji:'🌬',name:'Дыхание'}],
  ANTISTRESS_PRACTICES:[{id:'as_breath_sigh',cat:'breath',emoji:'😮‍💨',title:'Физиологический вздох',desc:'Спокойный выдох',duration:60,steps:['Вдох','Двойной вдох','Длинный выдох']}],
  PET_STAGES:[{id:1,emoji:'🥚',name:'Яйцо',minXP:0,maxXP:100,desc:'Начало'},{id:2,emoji:'🐣',name:'Птенец',minXP:100,maxXP:300,desc:'Рост'}]
 };
 sandbox.addEventListener=()=>{};sandbox.window=sandbox;vm.createContext(sandbox);vm.runInContext(source,sandbox);return {sandbox,values,appRoot};
}

test('workspace and system extensions are syntactically valid and loaded by the PWA',()=>{
 for(const [name,src] of [['workspaces',workspaces],['systems',systems]])assert.doesNotThrow(()=>new vm.Script(src,{filename:name}));
 assert.match(index,/lifeos-workspaces\.js\?v=/);assert.match(index,/lifeos-systems\.js\?v=/);
 assert.match(sw,/lifeos-workspaces\.js/);assert.match(sw,/lifeos-systems\.js/);
});

test('second brain stores Markdown notes, tags and wikilinks without losing legacy state',()=>{
 const {sandbox,values,appRoot}=sandboxFor(workspaces);
 values.brainTitle={value:'Принцип обучения'};values.brainBody={value:'Повторяй регулярно. См. [[Интервальное повторение]].'};values.brainType={value:'permanent'};values.brainTags={value:'обучение, память'};
 sandbox.window.renderObsidian();sandbox.window.saveBrainNote();
 assert.equal(sandbox.state.secondBrain.notes.length,1);
 assert.deepEqual(Array.from(sandbox.state.secondBrain.notes[0].links),['Интервальное повторение']);
 assert.deepEqual(Array.from(sandbox.state.secondBrain.notes[0].tags),['обучение','память']);
 assert.match(appRoot.innerHTML,/Второй мозг/);
});

test('professional journal validates and saves structured daily reflections',()=>{
 const {sandbox,values}=sandboxFor(workspaces);
 Object.assign(values,{journalDate:{value:'2026-11-08'},journalTitle:{value:'Спокойный день'},journalText:{value:'Закончил важную задачу.'},journalWins:{value:'Сделал главное'},journalBlockers:{value:'Отвлекался'},journalMood:{value:'8'},journalEnergy:{value:'4'},journalInsight:{value:'Короткий план помогает'},journalGratitude:{value:'Поддержка'},journalTomorrow:{value:'Повторить тему'},journalTags:{value:'работа, обучение'}});
 sandbox.window.saveJournalEntry();const entry=sandbox.state.journalEntries[0];
 assert.equal(entry.mood,8);assert.equal(entry.energy,4);assert.equal(entry.date,'2026-11-08');assert.equal(entry.wins,'Сделал главное');assert.deepEqual(Array.from(entry.tags),['работа','обучение']);assert.equal(sandbox.state.secondBrain.notes.length,1);assert.equal(sandbox.state.secondBrain.notes[0].source,'journal');assert.match(sandbox.state.secondBrain.notes[0].body,/Сделал главное/);
});


test('workspace drafts autosave locally and restore after reopening the editor',()=>{
 const {sandbox,values}=sandboxFor(workspaces);
 values.brainTitle={value:'Новая идея'};values.brainBody={value:'Черновик, который нельзя потерять'};values.brainType={value:'permanent'};values.brainTags={value:'идея'};
 assert.equal(sandbox.window.captureWorkspaceDraft('brain'),true);
 assert.equal(sandbox.state.workspaceDrafts.brain.values.brainBody,'Черновик, который нельзя потерять');
 values.brainBody.value='';
 sandbox.window.renderObsidian();
 assert.equal(values.brainBody.value,'Черновик, который нельзя потерять');
});
test('legacy second-brain items migrate without deleting the source array',()=>{
 const {sandbox}=sandboxFor(workspaces);
 sandbox.state.secondBrainItems=[{id:'legacy-1',title:'Старая заметка',text:'Старое содержимое',tags:'память, идея'}];
 sandbox.window.renderObsidian();
 assert.equal(sandbox.state.secondBrain.notes.length,1);
 assert.equal(sandbox.state.secondBrain.notes[0].title,'Старая заметка');
 assert.match(sandbox.state.secondBrain.notes[0].body,/Старое содержимое/);
 assert.equal(sandbox.state.secondBrainItems.length,1);
});


test('legacy notes merge into an existing canonical second brain without duplication',()=>{
 const {sandbox}=sandboxFor(workspaces);
 sandbox.state.secondBrain={notes:[{id:'new-1',title:'Современная',body:'Новая',tags:[],links:[]}]};
 sandbox.state.secondBrainItems=[{id:'old-1',title:'Старая',text:'Старый текст'}];
 sandbox.window.renderObsidian();
 assert.equal(sandbox.state.secondBrain.notes.length,2);
 assert.equal(sandbox.state.secondBrainItems.length,1);
});

test('weekly schedule and month calendar include events and due tasks',()=>{
 const {sandbox,appRoot}=sandboxFor(systems);
 sandbox.state.calendarEvents=[{id:'e1',source:'lifeos',title:'Тренировка',date:'2026-11-08',time:'09:00'}];
 sandbox.state.tasks=[{id:'t1',title:'Подготовить проект',status:'pending',due_date:'2026-11-08'}];
 sandbox.window.setLifeOSSelectedDate('2026-11-08');sandbox.window.renderSchedule();
 assert.match(appRoot.innerHTML,/Тренировка/);assert.match(appRoot.innerHTML,/Подготовить проект/);
 sandbox.window.renderCalendar();assert.match(appRoot.innerHTML,/Календарь/);assert.match(appRoot.innerHTML,/Тренировка/);
});

test('schedule event creation persists duration, category and selected date',()=>{
 const {sandbox,values}=sandboxFor(systems);
 Object.assign(values,{scheduleTitle:{value:'Английский'},scheduleTime:{value:'16:30'},scheduleDuration:{value:'45'},scheduleCategory:{value:'Учёба'},scheduleNote:{value:'Практика speaking'}});
 sandbox.window.setLifeOSSelectedDate('2026-11-09');sandbox.window.addScheduleEvent();
 const event=sandbox.state.calendarEvents[0];assert.equal(event.date,'2026-11-09');assert.equal(event.duration,45);assert.equal(event.category,'Учёба');
});

test('pet care actions are logged and daily limits prevent XP farming',()=>{
 const {sandbox,appRoot}=sandboxFor(systems);sandbox.window.renderPet();sandbox.window.lifePetAction('feed');
 assert.equal(sandbox.state.pet.careLog.length,1);assert.equal(sandbox.state.pet.hunger,85);
 const xp=sandbox.state.pet.xp;sandbox.window.lifePetAction('feed');sandbox.window.lifePetAction('feed');sandbox.window.lifePetAction('feed');
 assert.equal(sandbox.state.pet.careLog.length,3);assert.equal(sandbox.state.pet.xp,xp+4);assert.match(appRoot.innerHTML,/Забота сегодня/);
});

test('antistress has guided steps, before-after self-rating and stored practice outcome',()=>{
 const {sandbox,values,appRoot}=sandboxFor(systems);sandbox.window.renderAntistress();assert.match(appRoot.innerHTML,/Быстрый выбор/);
 sandbox.window.startAntistress('as_breath_sigh');assert.match(appRoot.innerHTML,/Выполняй по шагам/);
 values.asBefore={value:'7'};values.asAfter={value:'4'};values.asReflection={value:'Стало спокойнее'};sandbox.window.finishAntistress();
 const row=sandbox.state.antistressEntries[0];assert.equal(row.beforeStress,7);assert.equal(row.afterStress,4);assert.equal(row.reflection,'Стало спокойнее');
});

test('Jarvis Worker supports Gemini securely using only server-side API credentials',async()=>{
 const mod=await import('data:text/javascript;base64,'+Buffer.from(workerSource).toString('base64'));
 const oldFetch=global.fetch;let captured;
 global.fetch=async(url,options)=>{captured={url,options};return new Response(JSON.stringify({candidates:[{content:{parts:[{text:'Ответ Gemini для LIFEOS'}]}}]}),{status:200,headers:{'Content-Type':'application/json'}});};
 try{
  const request=new Request('https://lifeos-jarvis-api.example.workers.dev/',{method:'POST',headers:{Origin:'https://vana30421-cpu.github.io','Content-Type':'application/json','X-Jarvis-Access-Code':'correct'},body:JSON.stringify({provider:'gemini',message:'Проанализируй день',history:[{role:'user',content:'Привет'}],context:{tasks:{active:2}}})});
  const response=await mod.default.fetch(request,{ALLOWED_ORIGIN:'https://vana30421-cpu.github.io',JARVIS_ACCESS_CODE:'correct',GEMINI_API_KEY:'server-secret',GEMINI_MODEL:'gemini-2.5-flash'});
  const data=await response.json();assert.equal(response.status,200);assert.match(data.reply,/Ответ Gemini/);assert.equal(data.provider,'gemini');
  assert.match(captured.url,/models\/gemini-2\.5-flash:generateContent/);assert.equal(captured.options.headers['x-goog-api-key'],'server-secret');
  const payload=JSON.parse(captured.options.body);assert.equal(payload.contents.length,2);assert.equal(payload.contents[0].role,'user');
 }finally{global.fetch=oldFetch;}
});

test('Jarvis Worker rejects wrong origin and wrong access code before calling providers',async()=>{
 const mod=await import('data:text/javascript;base64,'+Buffer.from(workerSource).toString('base64'));
 const oldFetch=global.fetch;let called=false;global.fetch=async()=>{called=true;throw new Error('must not call');};
 try{
  const wrongOrigin=new Request('https://worker.example/',{method:'POST',headers:{Origin:'https://evil.example','Content-Type':'application/json'},body:JSON.stringify({message:'hi'})});
  const deniedOrigin=await mod.default.fetch(wrongOrigin,{ALLOWED_ORIGIN:'https://vana30421-cpu.github.io',JARVIS_ACCESS_CODE:'correct'});assert.equal(deniedOrigin.status,403);
  const wrongCode=new Request('https://worker.example/',{method:'POST',headers:{Origin:'https://vana30421-cpu.github.io','Content-Type':'application/json','X-Jarvis-Access-Code':'bad'},body:JSON.stringify({message:'hi'})});
  const deniedCode=await mod.default.fetch(wrongCode,{ALLOWED_ORIGIN:'https://vana30421-cpu.github.io',JARVIS_ACCESS_CODE:'correct'});assert.equal(deniedCode.status,401);assert.equal(called,false);
 }finally{global.fetch=oldFetch;}
});

test('Jarvis statistics action and Gemini selector are wired to the real provider request',()=>{
 assert.match(app,/function setJarvisProvider\(value\)/);assert.match(app,/provider:d\.provider\|\|'openai'/);assert.match(app,/id="jarvisProvider"/);assert.match(systems,/askJarvisAboutStats/);
});

test('legacy and canonical second-brain stores are merged idempotently',()=>{
 const {sandbox}=sandboxFor(workspaces);
 sandbox.state.secondBrain={notes:[{id:'canonical-1',title:'Основная заметка',body:'Текст',tags:[],links:[]}]};
 sandbox.state.secondBrainItems=[{id:'legacy-2',title:'Старая заметка',body:'Не потерять',tags:'память'}];
 sandbox.window.ensureLifeOSBrain();
 assert.equal(sandbox.state.secondBrain.notes.length,2);
 sandbox.window.ensureLifeOSBrain();
 assert.equal(sandbox.state.secondBrain.notes.length,2);
 assert.ok(sandbox.state.secondBrain.notes.some(n=>n.id==='legacy-2'));
 assert.equal(sandbox.state.secondBrainItems.length,1);
});
test('Jarvis can normalize the second-brain store before building external AI context',()=>{
 const {sandbox}=sandboxFor(workspaces);
 assert.equal(typeof sandbox.window.ensureLifeOSBrain,'function');
 sandbox.state.secondBrain={notes:[]};
 sandbox.state.secondBrainItems=[{id:'legacy-3',title:'Знание',body:'Содержимое',tags:'AI'}];
 sandbox.window.ensureLifeOSBrain();
 assert.equal(sandbox.state.secondBrain.notes[0].title,'Знание');
});

test('closing an unfinished anti-stress practice saves a partial record without XP',()=>{
 const {sandbox}=sandboxFor(systems);
 sandbox.window.startAntistress('as_breath_sigh');
 sandbox.window.__lifeosAntistress.startedAt=Date.now()-12000;
 const xp=sandbox.state.pet.xp;
 sandbox.window.closeSheet();
 assert.equal(sandbox.state.antistressEntries.length,1);
 assert.equal(sandbox.state.antistressEntries[0].completed,false);
 assert.equal(sandbox.state.antistressEntries[0].closedEarly,true);
 assert.ok(sandbox.state.antistressEntries[0].durationSeconds>=12);
 assert.equal(sandbox.state.pet.xp,xp);
});
test('pet progress bar measures progress within the current evolution stage',()=>{
 const {sandbox,appRoot}=sandboxFor(systems);
 sandbox.PET_STAGES=[
  {id:1,emoji:'🥚',name:'Яйцо',minXP:0,maxXP:100,desc:'Начало'},
  {id:2,emoji:'🐣',name:'Птенец',minXP:100,maxXP:300,desc:'Рост'},
  {id:3,emoji:'🐥',name:'Орёл',minXP:300,maxXP:700,desc:'Сила'}
 ];
 sandbox.state.pet.stage=2;sandbox.state.pet.xp=200;
 sandbox.window.renderPet();
 assert.match(appRoot.innerHTML,/width:50%/);
});


test('Telegram WebView uses a dedicated touch-scrollable app viewport',()=>{
 const start=index.indexOf('<style id="lifeos-webview-scroll-fix">');
 const end=index.indexOf('</style>',start);
 assert.ok(start>=0&&end>start);
 const css=index.slice(start,end);
 assert.match(css,/html,body\{[\s\S]*?overflow:hidden!important/);
 assert.match(css,/#app\.app-main\{[\s\S]*?overflow-y:auto!important/);
 assert.match(css,/#app\.app-main\{[\s\S]*?touch-action:pan-y!important/);
 assert.match(index,/tg\.viewportHeight/);
 assert.match(index,/viewportChanged/);
 assert.match(app,/lifeosScrollToTop/);
 assert.match(sw,/const CACHE='life-os-v103'/);
});

test('journal entries can be sent to Jarvis for contextual reflection without modifying the original entry',()=>{
 assert.match(workspaces,/window\.analyzeJournalEntry=function/);
 assert.match(workspaces,/Разобрать с Джарвисом/);
 assert.match(workspaces,/window\.jarvisQuick\(prompt\)/);
 assert.match(workspaces,/row\.mood==null\?'не указано'/);
 assert.match(workspaces,/row\.energy==null\?'не указана'/);
});

test('second-brain quick capture is available from the global app header',()=>{
 assert.match(index,/openBrainQuickCapture\(\)/);
 assert.match(workspaces,/window\.openBrainQuickCapture=function/);
 assert.match(workspaces,/window\.navigate\('obsidian'\)/);
 assert.match(index,/lifeos-workspaces\.js\?v=20261109-1/);
 assert.match(sw,/const CACHE='life-os-v103'/);
});
