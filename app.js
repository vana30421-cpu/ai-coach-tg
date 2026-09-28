'use strict';
/* ============================================================
   LIFE OS — APP.js v43
   ЧАСТЬ 1/8: Ядро, State v2, Telegram BackButton, Голос, Роуты
   ============================================================ */

var STORAGE_KEY = 'life_os_v43';
var STORAGE_BACKUP = 'life_os_backup_v43';
var CURRENT_VERSION = '43';

/* ============ TELEGRAM INIT ============ */
var tg=null;
try{
  tg=window.Telegram&&window.Telegram.WebApp;
  if(tg){
    try{tg.expand()}catch(e){}
    try{tg.ready()}catch(e){}
    try{tg.setHeaderColor&&tg.setHeaderColor('#000000')}catch(e){}
    try{tg.setBackgroundColor&&tg.setBackgroundColor('#000000')}catch(e){}
    try{tg.disableVerticalSwipes&&tg.disableVerticalSwipes()}catch(e){}
    var _u=tg.initDataUnsafe&&tg.initDataUnsafe.user;
    if(_u&&_u.first_name)window.__tgName=_u.first_name;
  }
}catch(e){console.warn('[TG] init error',e)}

/* ============ BACK BUTTON TELEGRAM ============ */
/* Управляет системной кнопкой «назад» в шапке Telegram.
   Показываем её, когда мы не на главной. */
var _backStack=[];
function tgBackButtonShow(){
  try{
    if(tg&&tg.BackButton){
      tg.BackButton.show();
      if(!window.__bbBound){
        tg.BackButton.onClick(function(){ navigateBack(); });
        window.__bbBound=true;
      }
    }
  }catch(e){}
}
function tgBackButtonHide(){
  try{
    if(tg&&tg.BackButton)tg.BackButton.hide();
  }catch(e){}
}
function pushBackPage(page){
  if(!page)return;
  if(_backStack[_backStack.length-1]!==page)_backStack.push(page);
}
function navigateBack(){
  _backStack.pop(); // текущая
  var prev=_backStack.pop();
  if(prev)navigate(prev,true);
  else navigate('dashboard',true);
}
window.navigateBack=navigateBack;

/* ============ UTILS ============ */
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8)}
function nowISO(){return new Date().toISOString()}
function today(){return new Date().toISOString().slice(0,10)}
function yesterday(){var d=new Date();d.setDate(d.getDate()-1);return d.toISOString().slice(0,10)}
function pad(n){return String(n).padStart(2,'0')}
function daysBetween(a,b){return Math.floor((new Date(b)-new Date(a))/(24*60*60*1000))}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}

function toast(msg,type,duration){
  type=type||'info';duration=duration||2500;
  var c=document.getElementById('toasts');if(!c)return;
  var el=document.createElement('div');el.className='toast '+type;el.textContent=msg;
  c.appendChild(el);
  setTimeout(function(){
    el.style.opacity='0';el.style.transform='translate(-50%,-16px)';el.style.transition='all .4s';
    setTimeout(function(){el.remove()},400);
  },duration);
}
function haptic(type){
  try{
    var h=tg&&tg.HapticFeedback;
    if(!h)return;
    if(type==='success')h.notificationOccurred('success');
    else if(type==='error')h.notificationOccurred('error');
    else if(type==='warning')h.notificationOccurred('warning');
    else h.impactOccurred(type||'light');
  }catch(e){}
}

/* ============================================================
   ГОЛОСОВОЙ ВВОД (webkitSpeechRecognition)
   ============================================================ */
var _voiceRec=null;
var _voiceTarget=null;

function voiceSupported(){
  return !!(window.SpeechRecognition||window.webkitSpeechRecognition);
}

/* Навешивает кнопку «🎤» на input/textarea по id.
   Пример: attachVoice('myInput') */
function attachVoice(inputId){
  if(!voiceSupported())return;
  var el=document.getElementById(inputId);
  if(!el)return;
  if(el.dataset.voiceAttached==='1')return;
  el.dataset.voiceAttached='1';
  var btn=document.createElement('button');
  btn.type='button';
  btn.className='voice-btn';
  btn.textContent='🎤';
  btn.setAttribute('aria-label','Голосовой ввод');
  btn.style.cssText='position:absolute;right:8px;top:50%;transform:translateY(-50%);background:var(--glass-3);border:1px solid var(--glass-border);color:var(--text);width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:16px;display:grid;place-items:center;z-index:2;';
  var parent=el.parentNode;
  if(getComputedStyle(parent).position==='static')parent.style.position='relative';
  parent.appendChild(btn);
  btn.addEventListener('click',function(e){
    e.preventDefault();
    startVoiceFor(el,btn);
  });
}

function startVoiceFor(el,btn){
  try{
    if(_voiceRec){try{_voiceRec.stop()}catch(e){}}
    var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){toast('Голосовой ввод не поддерживается','error');return}
    _voiceRec=new SR();
    _voiceRec.lang='ru-RU';
    _voiceRec.interimResults=false;
    _voiceRec.maxAlternatives=1;
    _voiceTarget=el;
    if(btn){btn.style.background='var(--danger)';btn.textContent='⏺'}
    haptic('light');
    _voiceRec.onresult=function(event){
      var text='';
      for(var i=event.resultIndex;i<event.results.length;i++){
        text+=event.results[i][0].transcript;
      }
      if(text.trim()){
        var cur=el.value||'';
        var sep=cur&&!/\s$/.test(cur)?' ':'';
        el.value=cur+sep+text.trim();
        el.dispatchEvent(new Event('input',{bubbles:true}));
      }
    };
    _voiceRec.onerror=function(err){
      var code=err&&err.error;
      if(code==='not-allowed'||code==='service-not-allowed'){
        toast('Доступ к микрофону запрещён','error');
      }else if(code==='no-speech'){
        toast('Речь не распознана','warning');
      }else{
        toast('Ошибка голоса: '+code,'error');
      }
      if(btn){btn.style.background='var(--glass-3)';btn.textContent='🎤'}
    };
    _voiceRec.onend=function(){
      if(btn){btn.style.background='var(--glass-3)';btn.textContent='🎤'}
    };
    _voiceRec.start();
    toast('🎤 Говорите...','info',1500);
  }catch(e){
    console.warn('[VOICE]',e);
    toast('Голосовой ввод недоступен','error');
    if(btn){btn.style.background='var(--glass-3)';btn.textContent='🎤'}
  }
}
window.attachVoice=attachVoice;
window.voiceSupported=voiceSupported;

/* Обёртка для полей — активирует голос на всех input/textarea внутри контейнера */
function attachVoiceAll(rootId){
  if(!voiceSupported())return;
  var root=rootId?document.getElementById(rootId):document.body;
  if(!root)return;
  var nodes=root.querySelectorAll('input[type="text"],input[type="search"],input:not([type]),textarea');
  nodes.forEach(function(el,i){
    if(!el.id){el.id='voice_auto_'+i+'_'+Math.random().toString(36).slice(2,6)}
    attachVoice(el.id);
  });
}
window.attachVoiceAll=attachVoiceAll;

/* ============================================================
   DEFAULT STATE v2
   ============================================================ */
function defaultState(){
  return{
    /* ==== Существующее ==== */
    tasks:[],customHabits:[],customGoals:[],customNotes:[],journalEntries:[],
    customWater:[],customMood:[],customMeds:[],customMeditation:[],
    customWorkouts:[],timerSessions:[],focusSessions:[],chats:[],
    paths:[],courses:[],watchlist:[],watched:[],customResources:[],
    screenEntries:[],eyeExercises:[],calendarEvents:[],pendingGoogleEvents:[],
    customSleep:{},levelProgress:{},englishProgress:{},skillsProgress:{},
    domainScores:{},domainHistory:{},metrics:{},
    screenStats:{},screenHabits:{},screenHistory:{},
    detoxCourseProgress:{},challengeProgress:{},dailySurveys:{},
    dayPlans:{},weekPlans:{},monthPlans:{},
    psychologyProgress:{},thinkingProgress:{},etiquetteProgress:{},
    hormonesProgress:{},wealthProgress:{},memoryProgress:{},
    iqProgress:{},eqProgress:{},financeProgress:{},neuroProgress:{},
    recoveryProgress:{},methodsProgress:{},visionProgress:{},
    itProgress:{},lawProgress:{},medProgress:{},financeCourseProgress:{},
    psychDeepProgress:{},languagesProgress:{},designProgress:{},
    cookingProgress:{},sportCourseProgress:{},musicProgress:{},
    historyProgress:{},astroProgress:{},

    /* ==== НОВОЕ v43: Привычки ==== */
    habits:[],           // активные привычки пользователя
    habitHistory:{},     // {habitId: {date: {completed: bool, note: string}}}
    habitStreaks:{},     // {habitId: {current, best, lastDate}}
    habitGoals:[],       // микро-цели привязанные к привычкам

    /* ==== НОВОЕ v43: Тренировка ума ==== */
    brainPlays:[],       // [{gameId, date, score, duration, accuracy}]
    brainStats:{},       // {gameId: {best, plays, avg, lastPlayed}}
    brainStreak:0,       // дни подряд
    brainLastDay:null,

    /* ==== НОВОЕ v43: Антистресс ==== */
    antistressEntries:[],   // [{practiceId, date, duration, time}]
    antistressStats:{},     // {practiceId: {count, totalTime, lastDate}}

    /* ==== НОВОЕ v43: Сон ==== */
    sleepEntries:[],     // [{id, date, type:'night'|'nap', start, end, hours, quality, notes, disruptions:[], improvements:[], daytimeEffects:[], daytimeFactors:[], resetFactors:[]}]

    /* ==== НОВОЕ v43: Игры и материалы ==== */
    gameProgress:{},     // {gameId: {plays, best, lastPlayed}}
    materialsProgress:{}, // {materialId: {status:'planned'|'in-progress'|'done', progress: 0-100, notes}}

    /* ==== НОВОЕ v43: Уведомления ==== */
    notifications:{
      enabled:false,
      permission:'default',
      settings:JSON.parse(JSON.stringify(window.NOTIFICATION_SETTINGS_DEFAULTS||{})),
      scheduled:[],
      history:[]
    },

    /* ==== НОВОЕ v43: Профиль v2 ==== */
    profileV2:{
      age:null,
      height:null,
      weight:null,
      gender:null,
      activity:'moderate',    // sedentary | light | moderate | active | very_active
      goal:'maintain',        // lose | maintain | gain
      targetWeight:null,
      targetDate:null,
      restingHR:null,
      maxHR:null,
      medicalNotes:'',
      updatedAt:null
    },

    /* ==== НОВОЕ v43: Настройки v2 ==== */
    settingsV2:{
      textSize:'medium',      // small | medium | large | xlarge
      scale:'100',            // 80 | 90 | 100 | 110 | 120
      sound:true,
      soundVolume:0.5,
      haptic:true,
      animations:true,
      animationsSpeed:'normal', // slow | normal | fast
      language:'ru',
      firstDayOfWeek:'monday',
      timeFormat:'24h',
      dateFormat:'DD.MM.YYYY',
      darkMode:'auto',
      effectsEnabled:true,
      effectsIntensity:1,
      reducedMotion:false,
      updatedAt:null
    },

    /* ==== НОВОЕ v43: Единая картина ==== */
    snapshot:null,          // последний снимок
    snapshotHistory:[],     // [{date, snapshot}]
    recommendations:[],     // последние рекомендации
    lastSnapshotAt:null,

    /* ==== Старое (совместимость) ==== */
    todayPlan:null,
    learnPlan:{today:[],week:[],month:[]},
    personalPlan:null,
    medicalData:{
      metrics:[],entries:[],
      profile:{age:null,sex:null,weight:null,height:null,chronic:[]},
      recommendations:[]
    },
    xp:0,level:0,activeWorkMode:null,
    integrations:{
      obsidian:{apiKey:'',vault:'',lastSync:null,connected:false},
      gcal:{clientId:'',accessToken:null,refreshToken:null,expiresAt:null,lastSync:null,connected:false,autoSync:true},
      gemini:{apiKey:'',model:'gemini-1.5-flash',connected:false}
    },
    profile:{
      name:'',emoji:'😊',createdAt:nowISO(),
      achievements:[],surveyAnswers:null,surveyStep:0,surveyDone:false,personalPlan:null
    },
    settings:{
      version:CURRENT_VERSION,theme:'dark',provider:'gemini',apiKey:'',
      activePersona:'coach',waterGoal:8,onboardingDone:false,
      effectsEnabled:true,effectsIntensity:1,animationSpeed:1,
      lastDailySurveyDay:null,dailyLearnTarget:150,
      pwa:{installed:false},
      notifications:{enabled:false,lastCheck:null},
      updatedAt:null
    },
    stats:{
      streak:0,lastActiveDay:null,totalDays:0,totalTasksDone:0,
      totalLessonsDone:0,totalWater:0,totalMoodLogs:0,totalWorkouts:0,
      totalMeditations:0,bestStreak:0
    }
  };
}

/* ============================================================
   БЭКАП / MERGE / МИГРАЦИЯ
   ============================================================ */
function backupStorage(){
  try{
    var raw=localStorage.getItem(STORAGE_KEY);
    if(raw){localStorage.setItem(STORAGE_BACKUP,raw);return true}
  }catch(e){}
  return false;
}
function restoreFromBackup(){
  try{
    var b=localStorage.getItem(STORAGE_BACKUP);
    if(!b)return false;
    localStorage.setItem(STORAGE_KEY,b);return true;
  }catch(e){return false}
}
function deepMerge(target,source){
  if(!source||typeof source!=='object')return target;
  if(Array.isArray(source))return source.slice();
  Object.keys(source).forEach(function(k){
    if(source[k]&&typeof source[k]==='object'&&!Array.isArray(source[k])){
      target[k]=deepMerge(target[k]||{},source[k]);
    }else if(source[k]!==undefined){target[k]=source[k]}
  });
  return target;
}
function migrateState(data){
  if(!data||typeof data!=='object')return data;
  var v=parseFloat((data.settings&&data.settings.version)||'0');
  if(v<parseFloat(CURRENT_VERSION)){
    console.log('[MIGRATE] v'+v+' → v'+CURRENT_VERSION);
    data=deepMerge(defaultState(),data);
    data.settings.version=CURRENT_VERSION;
  }
  /* Миграция v42 → v43: сохранить старые данные */
  if(!data.habits)data.habits=[];
  if(!data.brainPlays)data.brainPlays=[];
  if(!data.antistressEntries)data.antistressEntries=[];
  if(!data.sleepEntries)data.sleepEntries=[];
  if(!data.profileV2)data.profileV2=defaultState().profileV2;
  if(!data.settingsV2)data.settingsV2=defaultState().settingsV2;
  return data;
}

/* ============================================================
   ЗАГРУЗКА
   ============================================================ */
var state;
(function loadState(){
  try{
    backupStorage();
    var raw=localStorage.getItem(STORAGE_KEY);
    if(!raw){
      /* Попробуем загрузить v42 */
      var oldRaw=localStorage.getItem('life_os_v40');
      if(oldRaw){
        console.log('[LOAD] миграция с v40');
        var oldParsed=JSON.parse(oldRaw);
        state=deepMerge(defaultState(),oldParsed);
        state.settings.version=CURRENT_VERSION;
        save();
      }else{
        state=defaultState();
        console.log('[LOAD] новый state v43');
      }
    }else{
      var parsed=JSON.parse(raw);
      parsed=migrateState(parsed);
      state=deepMerge(defaultState(),parsed);
      console.log('[LOAD] ✓ state v'+state.settings.version);
    }
  }catch(e){
    console.error('[LOAD]',e);
    if(!restoreFromBackup()){state=defaultState()}
    else{try{var r=localStorage.getItem(STORAGE_KEY);state=deepMerge(defaultState(),JSON.parse(r))}catch(e2){state=defaultState()}}
  }
})();

function save(){
  try{
    state.settings.updatedAt=nowISO();
    state.settings.version=CURRENT_VERSION;
    localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
  }catch(e){console.error('[SAVE]',e);toast('Ошибка сохранения','error')}
}

/* ============ GLOBALS ============ */
var currentPage='dashboard';
var currentLevelId=null,currentModuleId=null,currentLessonIdx=null;
var taskFilter='all',taskSearch='',skillsFilter='all';
var currentDailySurveyStep=0,currentDailySurveyAnswers={};
var timerInterval=null,timerSeconds=25*60,timerRunning=false,timerMode='pomodoro';
var currentVisionExercise=null;
var currentDayPlanDate=today();
var v2Filter='all';
var habitCatFilter='all',habitSearch='',brainCatFilter='all',asCatFilter='all',gameCatFilter='all',matCatFilter='all';
var currentHabitId=null,currentBrainGameId=null,currentAntistressId=null;

/* ============ ADAPTIVE: применяем настройки v2 ============ */
function applyUserSettings(){
  try{
    var s=state.settingsV2||{};
    /* Размер текста и масштаб */
    var scaleMap={'small':0.9,'medium':1,'large':1.1,'xlarge':1.2};
    var sc=parseFloat(s.scale||'100')/100;
    var ts=scaleMap[s.textSize]||1;
    document.documentElement.style.fontSize=(16*ts)+'px';
    document.body.style.zoom=(sc*100)+'%';
    /* Анимации */
    if(s.reducedMotion){
      document.documentElement.style.setProperty('--ease','linear');
    }else{
      document.documentElement.style.setProperty('--ease','cubic-bezier(.4,0,.2,1)');
    }
  }catch(e){console.warn('[applyUserSettings]',e)}
}
window.applyUserSettings=applyUserSettings;

/* ============ ЭФФЕКТЫ ============ */
function startEffects(){
  var overlay=document.getElementById('themeEffect');
  if(!overlay)return;
  overlay.innerHTML='';
  try{
    if(state.settings.effectsEnabled===undefined)state.settings.effectsEnabled=true;
    if(state.settingsV2&&state.settingsV2.reducedMotion)return;
    if(!state.settings.effectsEnabled)return;
    var theme=(window.THEMES||[]).find(function(t){return t.id===state.settings.theme})||{effect:'stars'};
    var effect=theme.effect||'stars';
    var intensity=state.settings.effectsIntensity||1;
    function cnt(base){return Math.round(base*intensity*2.5)}
    var i,el;
    if(effect==='stars'||effect==='none'){
      for(i=0;i<cnt(30);i++){el=document.createElement('div');el.className='effect-star small';el.style.left=Math.random()*100+'%';el.style.top=Math.random()*100+'%';el.style.animationDelay=Math.random()*4+'s';overlay.appendChild(el)}
    }
    else if(effect==='rain'){
      for(i=0;i<cnt(50);i++){el=document.createElement('div');el.className='effect-drop';el.style.left=Math.random()*100+'%';el.style.animationDuration=(0.8+Math.random()*1.2)+'s';el.style.height=(15+Math.random()*35)+'px';overlay.appendChild(el)}
    }
    else if(effect==='petals'){
      var p=['🌸','🌺','🌷','💮'];
      for(i=0;i<cnt(25);i++){el=document.createElement('div');el.className='effect-petal';el.textContent=p[Math.floor(Math.random()*p.length)];el.style.left=Math.random()*100+'%';el.style.animationDuration=(6+Math.random()*6)+'s';el.style.fontSize=(12+Math.random()*14)+'px';overlay.appendChild(el)}
    }
    else if(effect==='leaves'){
      var l=['🍃','🍂','🍁','🌿'];
      for(i=0;i<cnt(25);i++){el=document.createElement('div');el.className='effect-leaf';el.textContent=l[Math.floor(Math.random()*l.length)];el.style.left=Math.random()*100+'%';el.style.animationDuration=(6+Math.random()*6)+'s';el.style.fontSize=(14+Math.random()*16)+'px';overlay.appendChild(el)}
    }
    else if(effect==='snow'){
      var sn=['❄','❅','❆'];
      for(i=0;i<cnt(35);i++){el=document.createElement('div');el.className='effect-snowflake';el.textContent=sn[Math.floor(Math.random()*sn.length)];el.style.left=Math.random()*100+'%';el.style.animationDuration=(5+Math.random()*6)+'s';el.style.fontSize=(10+Math.random()*12)+'px';overlay.appendChild(el)}
    }
    else if(effect==='waves'){
      for(i=0;i<5;i++){el=document.createElement('div');el.className='effect-wave';el.style.bottom=(i*40)+'px';el.style.animationDelay=(i*1.2)+'s';overlay.appendChild(el)}
    }
    else if(effect==='sparkles'||effect==='spark'){
      for(i=0;i<cnt(40);i++){el=document.createElement('div');el.className='effect-spark';el.style.left=Math.random()*100+'%';el.style.top=Math.random()*100+'%';overlay.appendChild(el)}
    }
    else if(effect==='dust'){
      for(i=0;i<cnt(30);i++){el=document.createElement('div');el.className='effect-dust';el.style.left=Math.random()*100+'%';el.style.top=Math.random()*100+'%';overlay.appendChild(el)}
    }
    else if(effect==='bubbles'){
      for(i=0;i<cnt(25);i++){el=document.createElement('div');el.className='effect-bubble';el.style.left=Math.random()*100+'%';el.style.bottom=(Math.random()*20)+'%';el.style.width=el.style.height=(6+Math.random()*20)+'px';overlay.appendChild(el)}
    }
    else if(effect==='fire'){
      for(i=0;i<cnt(30);i++){el=document.createElement('div');el.className='effect-fire';el.style.left=Math.random()*100+'%';overlay.appendChild(el)}
    }
    else if(effect==='lightning'){
      for(i=0;i<3;i++){el=document.createElement('div');el.className='effect-lightning';el.style.left=(20+Math.random()*60)+'%';overlay.appendChild(el)}
    }
    else if(effect==='aurora'){
      for(i=0;i<4;i++){el=document.createElement('div');el.className='effect-aurora';el.style.top=(i*15)+'%';overlay.appendChild(el)}
    }
    else if(effect==='fireflies'){
      for(i=0;i<cnt(30);i++){el=document.createElement('div');el.className='effect-dust';el.style.left=Math.random()*100+'%';el.style.top=Math.random()*100+'%';el.style.background='#c8ff5b';el.style.boxShadow='0 0 12px #c8ff5b';overlay.appendChild(el)}
    }
    else if(effect==='fog'){
      for(i=0;i<cnt(15);i++){el=document.createElement('div');el.className='effect-wave';el.style.bottom=(Math.random()*100)+'%';overlay.appendChild(el)}
    }
    else if(effect==='pumpkin'){
      for(i=0;i<cnt(20);i++){el=document.createElement('div');el.className='effect-petal';el.textContent='🎃';el.style.left=Math.random()*100+'%';el.style.animationDuration=(8+Math.random()*6)+'s';el.style.fontSize=(16+Math.random()*20)+'px';overlay.appendChild(el)}
    }
    else if(effect==='bats'){
      for(i=0;i<cnt(15);i++){el=document.createElement('div');el.className='effect-petal';el.textContent='🦇';el.style.left=Math.random()*100+'%';el.style.animationDuration=(6+Math.random()*5)+'s';el.style.fontSize=(18+Math.random()*16)+'px';el.style.filter='drop-shadow(0 0 10px #e60000)';overlay.appendChild(el)}
    }
    else if(effect==='ghosts'){
      for(i=0;i<cnt(15);i++){el=document.createElement('div');el.className='effect-petal';el.textContent='👻';el.style.left=Math.random()*100+'%';el.style.animationDuration=(10+Math.random()*8)+'s';el.style.fontSize=(20+Math.random()*20)+'px';el.style.filter='drop-shadow(0 0 15px #a89bff)';overlay.appendChild(el)}
    }
    else if(effect==='bones'){
      for(i=0;i<cnt(15);i++){el=document.createElement('div');el.className='effect-petal';el.textContent='💀';el.style.left=Math.random()*100+'%';el.style.fontSize=(16+Math.random()*20)+'px';overlay.appendChild(el)}
    }
    else if(effect==='drops'){
      for(i=0;i<cnt(30);i++){el=document.createElement('div');el.className='effect-drop';el.style.left=Math.random()*100+'%';el.style.background='linear-gradient(180deg,transparent,#c00000,transparent)';el.style.height=(20+Math.random()*30)+'px';el.style.width='3px';overlay.appendChild(el)}
    }
    else if(effect==='candles'){
      for(i=0;i<cnt(10);i++){el=document.createElement('div');el.className='effect-petal';el.textContent='🕯';el.style.left=Math.random()*100+'%';el.style.fontSize=(22+Math.random()*16)+'px';overlay.appendChild(el)}
    }
    else if(effect==='feathers'){
      for(i=0;i<cnt(20);i++){el=document.createElement('div');el.className='effect-leaf';el.textContent='🪶';el.style.left=Math.random()*100+'%';el.style.fontSize=(14+Math.random()*16)+'px';overlay.appendChild(el)}
    }
    else if(effect==='spiderweb'){
      for(i=0;i<3;i++){el=document.createElement('div');el.style.position='absolute';el.style.left=(i*33)+'%';el.style.top='0';el.style.width='1px';el.style.height='100%';el.style.background='linear-gradient(180deg, transparent, #00ff88, transparent)';el.style.opacity='0.15';overlay.appendChild(el)}
    }
  }catch(e){console.warn('[Effects]',e)}
}

function applyTheme(id){
  try{
    var classes=document.body.className.split(/\s+/).filter(function(c){return c&&c.indexOf('theme-')!==0});
    classes.push('theme-dark');
    if(id&&id!=='dark')classes.push('theme-'+id);
    document.body.className=classes.join(' ');
  }catch(e){document.body.className='theme-dark'}
  startEffects();
}
window.applyTheme=applyTheme;

/* ============ TAB BAR ============ */
function renderTabBar(){
  var bar=document.getElementById('tabBar');if(!bar)return;
  var tabs=window.TABS||[];
  var html='';
  tabs.forEach(function(t){
    html+='<button class="tab-item '+(t.id===currentPage?'active':'')+'" onclick="navigate(\''+t.id+'\')">';
    html+='<span class="tab-icon">'+t.emoji+'</span><span class="tab-label">'+t.label+'</span></button>';
  });
  bar.innerHTML=html;
}

function updateHeader(){
  var avatar=document.getElementById('headerAvatar');
  if(avatar&&state.profile)avatar.textContent=state.profile.emoji||'👤';
}
window.updateHeader=updateHeader;

/* ============================================================
   NAVIGATION + BackButton
   ============================================================ */
var MAIN_PAGES=['dashboard','tasks','learning','calendar','vision','ai','more'];

function navigate(page,silent){
  if(!page)page='dashboard';
  var prev=currentPage;
  currentPage=page;
  /* Back stack */
  if(!silent&&prev&&prev!==page){
    if(MAIN_PAGES.indexOf(page)>=0){
      _backStack=[];
      tgBackButtonHide();
    }else{
      if(_backStack[_backStack.length-1]!==prev)_backStack.push(prev);
      tgBackButtonShow();
    }
  }
  try{renderTabBar()}catch(e){}
  try{updateHeader()}catch(e){}
  var main=document.getElementById('app');
  if(!main)return;
  main.innerHTML='';
  var renderers={
    /* ==== Главные ==== */
    dashboard:renderDashboard,tasks:renderTasks,matrix:renderMatrix,dailyplan:renderDailyPlan,
    learning:renderLearning,learnplan:renderLearnPlan,
    levels:renderLevels,levelDetail:renderLevelDetail,moduleDetail:renderModuleDetail,
    skills:renderSkills,methods:renderMethods,english:renderEnglish,
    memory:renderMemory,iq:renderIQ,eq:renderEQ,finance:renderFinance,
    neuromodule:renderNeuro,psychology:renderPsychology,thinking:renderThinking,
    etiquette:renderEtiquette,hormones:renderHormones,wealth:renderWealth,
    planning:renderPlanning,plantoday:renderPlanToday,planweek:renderPlanWeek,
    planmonth:renderPlanMonth,obsidian:renderObsidian,gcal:renderGcal,calendar:renderGcal,
    vision:renderVision,visionex:renderVisionExercises,visiontrack:renderVisionTracker,
    visiontips:renderVisionTips,vision60:renderVision60,
    ai:renderAI,health:renderHealth,water:renderWater,mood:renderMood,
    workouts:renderWorkouts,meditation:renderMeditation,meds:renderMeds,
    recovery:renderRecovery,medical:renderMedical,
    entertainment:renderEntertainment,resources:renderResources,
    movies:renderMovies,series:renderSeries,books:renderBooks,
    musiclib:renderMusic,gameslib:renderGames,podcastslib:renderPodcasts,
    habits:renderHabits,goals:renderGoals,notes:renderNotes,journal:renderJournal,
    more:renderMore,stats:renderStats,detailedStats:renderDetailedStats,
    timer:renderTimer,focus:renderFocus,domains:renderDomains,
    profile:renderProfile,settings:renderSettings,integrations:renderIntegrations,
    storage:renderStorage,
    screentracker:renderScreenTracker,detoxcourse:renderDetoxCourse,
    dailySurvey:renderDailySurvey,survey:renderSurvey,plan:renderPersonalPlan,

    /* ==== НОВОЕ v43 ==== */
    habitList:renderHabitList,
    habitCatalog:renderHabitCatalog,
    habitDetail:renderHabitDetail,
    habitEditor:renderHabitEditor,
    brain:renderBrain,
    brainGame:renderBrainGame,
    brainStats:renderBrainStats,
    antistress:renderAntistress,
    antistressDetail:renderAntistressDetail,
    sleep:renderSleep,
    sleepCalendar:renderSleepCalendar,
    sleepEditor:renderSleepEditor,
    games:renderLearningGames,
    gamePlay:renderGamePlay,
    materials:renderMaterials,
    materialDetail:renderMaterialDetail,
    notifications:renderNotifications,
    settingsV2:renderSettingsV2,
    profileV2:renderProfileV2,
    snapshot:renderSnapshot,
    recommendations:renderRecommendations
  };
  (window.ALL_NEW_COURSES||[]).forEach(function(course){
    renderers[course.id]=function(){renderCourse(course,course.id+'Progress')};
  });
  var fn=renderers[page];
  if(typeof fn!=='function'){
    main.innerHTML='<div class="page"><div class="title-xl">🚧 '+page+'</div><div class="card"><div class="empty"><div class="empty-icon">🚧</div><div class="empty-title">Раздел ещё не подключён</div><div class="empty-text">render'+page+' не найден</div></div></div></div>';
    return;
  }
  try{
    fn();
    /* Авто-голос на всех полях ввода */
    setTimeout(function(){try{attachVoiceAll('app')}catch(e){}},50);
  }catch(e){
    console.error('Render ['+page+']:',e);
    main.innerHTML='<div class="page"><div class="title-xl">⚠️ Ошибка</div><div class="card"><div class="empty"><div class="empty-icon">⚠️</div><div class="empty-title">'+esc(e.message||'Ошибка')+'</div><div class="empty-text">'+esc(String(e.stack||'').slice(0,300))+'</div></div></div></div>';
  }
  window.scrollTo({top:0});
  if(page==='profile'||page==='dashboard'){try{checkAchievements()}catch(e){}}
}
window.navigate=navigate;

/* ============ SHEET ============ */
function openSheet(title,content){
  var overlay=document.createElement('div');
  overlay.className='overlay';
  overlay.innerHTML='<div class="modal"><div class="modal-handle"></div><div class="modal-header"><div class="modal-title">'+esc(title)+'</div><button class="modal-close" onclick="closeSheet()">✕</button></div>'+content+'</div>';
  overlay.onclick=function(e){if(e.target===overlay)closeSheet()};
  document.body.appendChild(overlay);
  document.body.style.overflow='hidden';
  setTimeout(function(){try{attachVoiceAll('.modal')}catch(e){}},50);
}
function closeSheet(){
  document.querySelectorAll('.overlay').forEach(function(o){o.remove()});
  document.body.style.overflow='';
}
window.openSheet=openSheet;
window.closeSheet=closeSheet;

/* ============ THEME PICKER ============ */
function openThemePicker(){
  var themes=window.THEMES||[];
  if(!themes.length){toast('Темы не загружены','error');return}
  var html='<div class="footnote text-tertiary" style="margin-bottom:8px;">🎨 Выбери тему ('+themes.length+')</div>';
  html+='<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px;max-height:50vh;overflow-y:auto;">';
  themes.forEach(function(t){
    var active=state.settings.theme===t.id;
    html+='<button onclick="setTheme(\''+t.id+'\')" style="padding:10px 6px;border-radius:12px;border:2px solid '+(active?'var(--brand)':'transparent')+';background:'+t.bg+';color:'+t.text+';cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px;"><span style="font-size:22px;">'+t.emoji+'</span><span style="font-size:9px;font-weight:700;">'+t.name+'</span></button>';
  });
  html+='</div>';
  html+='<div class="card" style="margin:0;padding:14px;"><div class="row-between mb-2"><div class="list-title">🌈 Эффекты</div><button class="btn btn-ghost btn-xs" onclick="state.settings.effectsEnabled=!state.settings.effectsEnabled;save();startEffects();toast(\'Ок\',\'success\')">'+(state.settings.effectsEnabled?'Вкл':'Выкл')+'</button></div>';
  html+='<div class="row-between mb-2"><div class="list-title">💫 Интенсивность</div><div class="row" style="gap:4px;">';
  [0.5,1,1.5,2].forEach(function(v){
    var active=(state.settings.effectsIntensity||1)===v;
    html+='<button class="btn '+(active?'btn-primary':'btn-ghost')+' btn-xs" onclick="state.settings.effectsIntensity='+v+';save();startEffects();openThemePicker()">'+v+'×</button>';
  });
  html+='</div></div></div>';
  openSheet('Тема',html);
}
function setTheme(id){
  try{state.settings.theme=id;applyTheme(id);save();haptic('success');closeSheet();toast('Тема: '+id,'success');}
  catch(e){toast('Ошибка','error');applyTheme('dark')}
}
window.openThemePicker=openThemePicker;
window.setTheme=setTheme;
function openStatsQuick(){navigate('stats')}
window.openStatsQuick=openStatsQuick;

/* ============ ЗАГЛУШКИ для render-функций (будут в следующих частях) ============ */
function renderDashboard(){var app=document.getElementById('app');if(app)app.innerHTML='<div class="page"><div class="title-xl">🏠 Дашборд</div><div class="card"><div class="empty"><div class="empty-icon">🚧</div><div class="empty-title">Загружается</div><div class="empty-text">Полный дашборд в следующих частях</div></div></div></div>'}
function renderHabitList(){var app=document.getElementById('app');if(app)app.innerHTML='<div class="page"><div class="title-xl">🔄 Привычки</div><div class="card"><div class="empty"><div class="empty-icon">🚧</div><div class="empty-title">Раздел в разработке</div><div class="empty-text">Часть 2 app.js</div></div></div></div>'}
function renderHabitCatalog(){renderHabitList()}
function renderHabitDetail(){renderHabitList()}
function renderHabitEditor(){renderHabitList()}
function renderBrain(){var app=document.getElementById('app');if(app)app.innerHTML='<div class="page"><div class="title-xl">🧠 Тренировка ума</div><div class="card"><div class="empty"><div class="empty-icon">🚧</div><div class="empty-title">Раздел в разработке</div><div class="empty-text">Часть 3 app.js</div></div></div></div>'}
function renderBrainGame(){renderBrain()}
function renderBrainStats(){renderBrain()}
function renderAntistress(){var app=document.getElementById('app');if(app)app.innerHTML='<div class="page"><div class="title-xl">🌬 Антистресс</div><div class="card"><div class="empty"><div class="empty-icon">🚧</div><div class="empty-title">Раздел в разработке</div><div class="empty-text">Часть 3 app.js</div></div></div></div>'}
function renderAntistressDetail(){renderAntistress()}
function renderSleep(){var app=document.getElementById('app');if(app)app.innerHTML='<div class="page"><div class="title-xl">😴 Сон</div><div class="card"><div class="empty"><div class="empty-icon">🚧</div><div class="empty-title">Раздел в разработке</div><div class="empty-text">Часть 4 app.js</div></div></div></div>'}
function renderSleepCalendar(){renderSleep()}
function renderSleepEditor(){renderSleep()}
function renderLearningGames(){var app=document.getElementById('app');if(app)app.innerHTML='<div class="page"><div class="title-xl">🎮 Игры</div><div class="card"><div class="empty"><div class="empty-icon">🚧</div><div class="empty-title">Раздел в разработке</div><div class="empty-text">Часть 5 app.js</div></div></div></div>'}
function renderGamePlay(){renderLearningGames()}
function renderMaterials(){var app=document.getElementById('app');if(app)app.innerHTML='<div class="page"><div class="title-xl">📚 Материалы</div><div class="card"><div class="empty"><div class="empty-icon">🚧</div><div class="empty-title">Раздел в разработке</div><div class="empty-text">Часть 5 app.js</div></div></div></div>'}
function renderMaterialDetail(){renderMaterials()}
function renderNotifications(){var app=document.getElementById('app');if(app)app.innerHTML='<div class="page"><div class="title-xl">🔔 Уведомления</div><div class="card"><div class="empty"><div class="empty-icon">🚧</div><div class="empty-title">Раздел в разработке</div><div class="empty-text">Часть 6 app.js</div></div></div></div>'}
function renderSettingsV2(){var app=document.getElementById('app');if(app)app.innerHTML='<div class="page"><div class="title-xl">⚙️ Настройки v2</div><div class="card"><div class="empty"><div class="empty-icon">🚧</div><div class="empty-title">Раздел в разработке</div><div class="empty-text">Часть 6 app.js</div></div></div></div>'}
function renderProfileV2(){var app=document.getElementById('app');if(app)app.innerHTML='<div class="page"><div class="title-xl">👤 Профиль v2</div><div class="card"><div class="empty"><div class="empty-icon">🚧</div><div class="empty-title">Раздел в разработке</div><div class="empty-text">Часть 7 app.js</div></div></div></div>'}
function renderSnapshot(){var app=document.getElementById('app');if(app)app.innerHTML='<div class="page"><div class="title-xl">🌐 Единая картина</div><div class="card"><div class="empty"><div class="empty-icon">🚧</div><div class="empty-title">Раздел в разработке</div><div class="empty-text">Часть 7 app.js</div></div></div></div>'}
function renderRecommendations(){renderSnapshot()}

/* Старые рендеры — заглушки, чтобы не падало */
['Tasks','Matrix','DailyPlan','Learning','LearnPlan','Levels','LevelDetail','ModuleDetail','Skills','Methods','English','Memory','IQ','EQ','Finance','Neuro','Psychology','Thinking','Etiquette','Hormones','Wealth','Planning','PlanToday','PlanWeek','PlanMonth','Obsidian','Gcal','Vision','VisionExercises','VisionTracker','VisionTips','Vision60','AI','Health','Water','Mood','Workouts','Meditation','Meds','Recovery','Medical','Entertainment','Resources','Movies','Series','Books','Music','Games','Podcasts','Goals','Notes','Journal','More','Stats','DetailedStats','Timer','Focus','Domains','Profile','Settings','Integrations','Storage','ScreenTracker','DetoxCourse','DailySurvey','Survey','PersonalPlan'].forEach(function(n){
  if(typeof window['render'+n]!=='function'){
    window['render'+n]=function(){var app=document.getElementById('app');if(app)app.innerHTML='<div class="page"><div class="card"><div class="empty"><div class="empty-icon">🚧</div><div class="empty-title">'+n+'</div><div class="empty-text">Будет в следующих частях</div></div></div></div>'};
  }
});

/* ============ INIT ============ */
function init(){
  try{
    applyTheme(state.settings.theme);
    applyUserSettings();
    updateHeader();
    if(!state.profile.name&&!state.settings.onboardingDone&&typeof showWelcome==='function'){showWelcome();return}
    if(state.profile.name&&!state.settings.onboardingDone){state.settings.onboardingDone=true;save()}
    if(!state.profile.name&&window.__tgName){state.profile.name=window.__tgName;save();updateHeader()}
    if(!state.tasks.length){
      state.tasks=[
        {id:uid(),title:'Изучить Life OS',category:'Личное',planned_time:10,status:'pending',priority:'medium',created_at:nowISO()}
      ];
      save();
    }
    if(!state.xp)state.xp=0;
    renderTabBar();
    navigate('dashboard');
    /* Streak */
    var t=today();
    if(state.stats.lastActiveDay!==t){
      var y=new Date();y.setDate(y.getDate()-1);
      var wasYesterday=state.stats.lastActiveDay===y.toISOString().slice(0,10);
      state.stats.streak=wasYesterday?(state.stats.streak||0)+1:1;
      if(state.stats.streak>(state.stats.bestStreak||0))state.stats.bestStreak=state.stats.streak;
      state.stats.lastActiveDay=t;
      save();
    }
    setInterval(function(){try{save()}catch(e){}},30000);
    console.log('[INIT ✅] Life OS v43 запущен');
  }catch(e){
    console.error('[INIT]',e);
    var app=document.getElementById('app');
    if(app)app.innerHTML='<div class="empty"><div class="empty-icon">⚠️</div><div class="empty-title">Ошибка запуска</div><div class="empty-text">'+esc(e.message)+'</div></div>';
  }
}

/* ============ EXPORTS ============ */
window.state=state;
window.save=save;
window.today=today;
window.yesterday=yesterday;
window.nowISO=nowISO;
window.uid=uid;
window.esc=esc;
window.toast=toast;
window.haptic=haptic;
window.startEffects=startEffects;
window.applyTheme=applyTheme;
window.updateHeader=updateHeader;
window.renderTabBar=renderTabBar;
window.tgBackButtonShow=tgBackButtonShow;
window.tgBackButtonHide=tgBackButtonHide;

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',init);
}else{
  init();
}

console.log('[APP v43 1/8] ✅ Ядро загружено: state v43, BackButton, голосовой ввод');
/* ============================================================
   LIFE OS — APP.js v43
   ЧАСТЬ 2/8: DASHBOARD v2, ЗАДАЧИ v2, МАТРИЦА, ПРИВЫЧКИ
   ============================================================ */

/* ============================================================
   DASHBOARD v2 — с блоком рекомендаций, привычек, тренировки ума
   ============================================================ */
function renderDashboard(){
  var todayTasks=state.tasks.filter(function(t){return t.created_at&&t.created_at.slice(0,10)===today()});
  var doneToday=todayTasks.filter(function(t){return t.status==='completed'}).length;
  var hour=new Date().getHours();
  var greet=hour<6?'Доброй ночи':hour<12?'Доброе утро':hour<18?'Добрый день':'Добрый вечер';
  var progress=todayTasks.length?Math.round(doneToday/todayTasks.length*100):0;
  var userName=state.profile.name?', '+state.profile.name:'';
  var totalDone=0,totalLessons=0;
  (window.LEARNING_LEVELS||[]).forEach(function(level){
    var p=getLevelProgress(level.id);totalDone+=p.done;totalLessons+=p.total;
  });
  var overallPct=totalLessons?Math.round(totalDone/totalLessons*100):0;
  var waterEntry=state.customWater.find(function(w){return w.date===today()});
  var water=waterEntry?waterEntry.count:0;
  var waterGoal=state.settings.waterGoal||8;
  var screenToday=screenGetToday();

  /* Снимок для рекомендаций */
  var snap=null;
  try{snap=buildUserSnapshot(state)}catch(e){console.warn('[snap]',e)}

  var html='<div class="page"><div class="title-xl">'+greet+userName+'</div>';

  /* ==== Снимок дня ==== */
  if(snap){
    html+='<div class="progress-ring-hero">';
    html+=renderRing(progress,'День','ring-1','✓');
    html+=renderRing(overallPct,'Учёба','ring-2','🎓');
    html+=renderRing(Math.min(100,Math.round(water/waterGoal*100)),'Вода','ring-3','💧');
    html+=renderRing(Math.min(100,(state.stats.streak||0)*10),'Streak','ring-4','🔥');
    html+='</div>';
  }

  /* ==== Рекомендации «единая картина» ==== */
  if(snap&&snap.recommendations&&snap.recommendations.length){
    html+='<div class="card" style="background:linear-gradient(135deg,color-mix(in srgb,var(--brand) 18%,transparent),color-mix(in srgb,var(--brand-2) 12%,transparent));border-color:color-mix(in srgb,var(--brand) 40%,transparent);">';
    html+='<div class="row-between mb-3"><div style="font-size:16px;font-weight:800;">🌐 Единая картина</div>';
    html+='<button class="btn btn-ghost btn-xs" onclick="navigate(\'snapshot\')">Все →</button></div>';
    snap.recommendations.slice(0,3).forEach(function(r){
      html+='<div style="display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--divider);">';
      html+='<div style="font-size:20px;flex-shrink:0;">'+r.emoji+'</div>';
      html+='<div style="flex:1;"><div style="font-weight:700;font-size:13px;">'+esc(r.title)+'</div>';
      html+='<div class="footnote text-secondary">'+esc(r.text)+'</div></div>';
      html+='</div>';
    });
    html+='</div>';
  }

  /* ==== Привычки сегодня ==== */
  var habitsToday=getHabitsForToday();
  if(habitsToday.length){
    var doneH=habitsToday.filter(function(h){return isHabitDoneToday(h.id)}).length;
    html+='<div class="card" onclick="navigate(\'habitList\')" style="cursor:pointer;">';
    html+='<div class="row-between mb-3"><div style="font-size:16px;font-weight:800;">🔄 Привычки сегодня</div>';
    html+='<div class="badge badge-brand">'+doneH+'/'+habitsToday.length+'</div></div>';
    html+='<div class="progress" style="margin-bottom:10px;"><div class="progress-fill" style="width:'+Math.round(doneH/habitsToday.length*100)+'%;"></div></div>';
    habitsToday.slice(0,4).forEach(function(h){
      var done=isHabitDoneToday(h.id);
      var tpl=getHabitTemplate(h.templateId);
      var emoji=tpl?tpl.emoji:'✅';
      html+='<div style="display:flex;gap:10px;align-items:center;padding:6px 0;'+(done?'opacity:.5;':'')+'">';
      html+='<div style="font-size:18px;">'+(done?'✅':emoji)+'</div>';
      html+='<div style="flex:1;"><div style="font-weight:600;font-size:13px;'+(done?'text-decoration:line-through;':'')+'">'+esc(h.title||h.customTitle||'Привычка')+'</div>';
      if(h.streak)html+='<div class="footnote text-secondary">🔥 '+h.streak+' дней</div>';
      html+='</div></div>';
    });
    html+='</div>';
  } else {
    html+='<div class="card" style="cursor:pointer;" onclick="navigate(\'habitCatalog\')">';
    html+='<div style="font-size:16px;font-weight:800;margin-bottom:8px;">🔄 Начни привычку</div>';
    html+='<div class="footnote text-secondary mb-3">200+ шаблонов: сон, вода, спорт, чтение, медитация</div>';
    html+='<div class="btn btn-primary btn-block">Выбрать шаблон</div>';
    html+='</div>';
  }

  /* ==== Тренировка ума ==== */
  html+='<div class="card" onclick="navigate(\'brain\')" style="cursor:pointer;">';
  html+='<div class="row-between mb-3"><div style="font-size:16px;font-weight:800;">🧠 Тренировка ума</div>';
  html+='<div class="badge badge-brand">'+(state.brainPlays||[]).length+' игр</div></div>';
  html+='<div class="compact-grid" style="margin:0;">';
  (window.BRAIN_CATEGORIES||[]).slice(0,4).forEach(function(c){
    html+='<div class="compact-item" style="cursor:pointer;"><span class="compact-icon">'+c.emoji+'</span><span>'+c.name+'</span></div>';
  });
  html+='</div></div>';

  /* ==== Антистресс ==== */
  html+='<div class="card" onclick="navigate(\'antistress\')" style="cursor:pointer;">';
  html+='<div class="row-between mb-3"><div style="font-size:16px;font-weight:800;">🌬 Антистресс</div>';
  html+='<div class="badge badge-brand">'+(state.antistressEntries||[]).length+' практик</div></div>';
  html+='<div class="compact-grid" style="margin:0;">';
  (window.ANTISTRESS_CATEGORIES||[]).slice(0,4).forEach(function(c){
    html+='<div class="compact-item" style="cursor:pointer;"><span class="compact-icon">'+c.emoji+'</span><span>'+c.name+'</span></div>';
  });
  html+='</div></div>';

  /* ==== Сон ==== */
  var lastSleep=(state.sleepEntries||[]).slice(-1)[0];
  html+='<div class="card" onclick="navigate(\'sleep\')" style="cursor:pointer;">';
  html+='<div class="row-between mb-2"><div style="font-size:16px;font-weight:800;">😴 Сон</div>';
  if(lastSleep)html+='<div class="badge badge-brand">'+lastSleep.hours+' ч</div>';
  html+='</div>';
  html+='<button class="btn btn-primary btn-block" onclick="event.stopPropagation();navigate(\'sleepEditor\')">➕ Записать сон</button>';
  html+='</div>';

  /* ==== Экран ==== */
  if(screenToday>0){
    var sc=screenToday>300?'var(--danger)':screenToday>180?'var(--warning)':'var(--success)';
    html+='<div class="card" onclick="navigate(\'screentracker\')" style="cursor:pointer;border-left:3px solid '+sc+';">';
    html+='<div class="row-between"><div style="font-size:16px;font-weight:800;">📱 Экран</div>';
    html+='<div style="font-size:20px;font-weight:800;color:'+sc+';">'+fmtMinsHM(screenToday)+'</div></div>';
    html+='<div class="progress" style="margin-top:10px;"><div class="progress-fill" style="width:'+Math.min(100,screenToday/420*100)+'%;background:'+sc+';"></div></div>';
    html+='</div>';
  }

  /* ==== Быстрые действия ==== */
  html+='<div class="card"><h2>⚡ Быстро</h2><div class="group-grid">';
  html+='<div class="group-item" onclick="openEntityEditor(\'task\',null)"><div class="group-item-icon">➕</div><div class="group-item-label">Задача</div></div>';
  html+='<div class="group-item" onclick="addWater()"><div class="group-item-icon">💧</div><div class="group-item-label">'+water+'/'+waterGoal+'</div></div>';
  html+='<div class="group-item" onclick="quickMoodLog()"><div class="group-item-icon">💭</div><div class="group-item-label">Настроение</div></div>';
  html+='<div class="group-item" onclick="navigate(\'brain\')"><div class="group-item-icon">🧠</div><div class="group-item-label">Игра</div></div>';
  html+='<div class="group-item" onclick="navigate(\'antistress\')"><div class="group-item-icon">🌬</div><div class="group-item-label">Дыхание</div></div>';
  html+='<div class="group-item" onclick="navigate(\'sleepEditor\')"><div class="group-item-icon">😴</div><div class="group-item-label">Сон</div></div>';
  html+='</div></div>';

  /* ==== Задачи на сегодня ==== */
  var pending=state.tasks.filter(function(t){return t.status==='pending'});
  html+='<div class="card"><div class="row-between mb-3"><h2 style="margin:0;">📋 Задачи</h2>';
  html+='<button class="btn btn-ghost btn-xs" onclick="navigate(\'tasks\')">Все →</button></div>';
  if(pending.length){
    var sorted=pending.slice().sort(function(a,b){return getEisenhowerPriority(a)-getEisenhowerPriority(b)});
    sorted.slice(0,5).forEach(function(t){html+=taskRow(t)});
  }else{html+='<div class="empty"><div class="empty-icon">✨</div><div class="empty-title">Всё выполнено</div></div>'}
  html+='</div>';

  /* ==== Мудрость дня ==== */
  html+=renderWisdom();

  /* ==== Челленджи ==== */
  html+=renderChallenges();

  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderDashboard=renderDashboard;

/* ============================================================
   ЗАДАЧИ v2 — с цветами, матрицей Эйзенхауэра, сложностью, чек-листом
   ============================================================ */
function getEisenhowerQuadrant(t){
  var important=t.priority==='high'||t.priority==='medium'||t.importance>=4;
  var urgent=t.due_date?daysBetween(today(),t.due_date.slice(0,10))<=2:false;
  if(important&&urgent)return 'q1';
  if(important&&!urgent)return 'q2';
  if(!important&&urgent)return 'q3';
  return 'q4';
}
function getEisenhowerPriority(t){
  var q=getEisenhowerQuadrant(t);
  return q==='q1'?1:q==='q2'?2:q==='q3'?3:4;
}
function taskRow(t){
  var pColors={high:'high',medium:'medium',low:'low'};
  var checked=t.status==='completed';
  var overdue=t.due_date&&!checked&&t.due_date.slice(0,10)<today();
  var quad=getEisenhowerQuadrant(t);
  var qEmoji={q1:'🔥',q2:'📌',q3:'⚡',q4:'🗑'}[quad];
  var color=t.color?((window.TASK_COLORS||[]).find(function(c){return c.id===t.color})||{}).hex:null;
  var checklist=t.checklist||[];
  var clDone=checklist.filter(function(c){return c.done}).length;
  return '<div class="task-item '+(checked?'completed':'')+'" style="'+(color?'border-left:3px solid '+color+';':'')+'" onclick="openEntityEditor(\'task\',\''+t.id+'\')">'+
    '<div class="priority-bar '+(pColors[t.priority]||'medium')+'"></div>'+
    '<button class="task-checkbox '+(checked?'checked':'')+'" onclick="event.stopPropagation();toggleTask(\''+t.id+'\')">'+(checked?'✓':'')+'</button>'+
    '<div class="task-content"><div class="task-title">'+qEmoji+' '+esc(t.title)+'</div>'+
    '<div class="task-meta"><span>'+(t.planned_time||0)+' мин</span>'+
    (t.category?'<span>· '+esc(t.category)+'</span>':'')+
    (t.due_date?'<span>· 📅 '+t.due_date.slice(0,10)+'</span>':'')+
    (checklist.length?'<span>· ☑ '+clDone+'/'+checklist.length+'</span>':'')+
    (overdue?'<span style="color:var(--danger);">· ⚠️</span>':'')+
    '</div></div></div>';
}

function renderTasks(){
  var counts={
    all:state.tasks.length,
    pending:state.tasks.filter(function(t){return t.status==='pending'}).length,
    completed:state.tasks.filter(function(t){return t.status==='completed'}).length
  };
  var filtered=state.tasks.slice();
  if(taskFilter!=='all')filtered=filtered.filter(function(t){return t.status===taskFilter});
  if(taskSearch){var q=taskSearch.toLowerCase();filtered=filtered.filter(function(t){return (t.title||'').toLowerCase().indexOf(q)>=0})}

  var html='<div class="page">';
  html+='<div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">✅ Задачи</div>';
  html+='<div class="row" style="gap:6px;">';
  html+='<button class="btn btn-ghost btn-sm" onclick="navigate(\'matrix\')">🔢</button>';
  html+='<button class="btn btn-primary btn-sm" onclick="openEntityEditor(\'task\',null)">+</button>';
  html+='</div></div>';
  html+='<div class="search-bar"><span style="color:var(--text-3);font-size:18px;">🔍</span><input type="search" placeholder="Поиск..." value="'+esc(taskSearch)+'" oninput="taskSearch=this.value;renderTasks()"/></div>';
  html+='<div class="segmented" style="margin-bottom:14px;">';
  html+='<button class="segmented-item '+(taskFilter==='all'?'active':'')+'" onclick="taskFilter=\'all\';renderTasks()">Все ('+counts.all+')</button>';
  html+='<button class="segmented-item '+(taskFilter==='pending'?'active':'')+'" onclick="taskFilter=\'pending\';renderTasks()">Активные ('+counts.pending+')</button>';
  html+='<button class="segmented-item '+(taskFilter==='completed'?'active':'')+'" onclick="taskFilter=\'completed\';renderTasks()">Готовые ('+counts.completed+')</button>';
  html+='</div>';
  if(filtered.length){filtered.forEach(function(t){html+=taskRow(t)})}
  else{html+='<div class="empty"><div class="empty-icon">📋</div><div class="empty-title">'+(taskSearch?'Ничего не найдено':'Нет задач')+'</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderTasks=renderTasks;

function toggleTask(id){
  var t=state.tasks.find(function(x){return x.id===id});if(!t)return;
  t.status=t.status==='completed'?'pending':'completed';
  if(t.status==='completed'){
    t.completedAt=nowISO();
    state.stats.totalTasksDone=(state.stats.totalTasksDone||0)+1;
    state.xp=(state.xp||0)+5;
  }
  save();haptic('success');checkAchievements();
  if(currentPage==='tasks')renderTasks();else renderDashboard();
}
window.toggleTask=toggleTask;

function renderMatrix(){
  var pending=state.tasks.filter(function(t){return t.status==='pending'});
  var q1=[],q2=[],q3=[],q4=[];
  pending.forEach(function(t){
    var q=getEisenhowerQuadrant(t);
    if(q==='q1')q1.push(t);else if(q==='q2')q2.push(t);else if(q==='q3')q3.push(t);else q4.push(t);
  });
  var html='<div class="page"><div class="title-xl">🔢 Матрица Эйзенхауэра</div>';
  html+='<div class="matrix-grid-2x2">';
  html+='<div class="matrix-quadrant matrix-q1"><div class="matrix-q-title">🔥 Q1 Важное-Срочное</div><div class="matrix-q-count">'+q1.length+'</div><div class="matrix-q-sub">Делай сейчас</div></div>';
  html+='<div class="matrix-quadrant matrix-q2"><div class="matrix-q-title">📌 Q2 Важное-Несрочное</div><div class="matrix-q-count">'+q2.length+'</div><div class="matrix-q-sub">Планируй</div></div>';
  html+='<div class="matrix-quadrant matrix-q3"><div class="matrix-q-title">⚡ Q3 Срочное-Неважное</div><div class="matrix-q-count">'+q3.length+'</div><div class="matrix-q-sub">Делегируй</div></div>';
  html+='<div class="matrix-quadrant matrix-q4"><div class="matrix-q-title">🗑 Q4 Неважное-Несрочное</div><div class="matrix-q-count">'+q4.length+'</div><div class="matrix-q-sub">Удали</div></div>';
  html+='</div>';
  html+='<div class="card"><h2>🔥 Q1 — Делай</h2>';
  if(q1.length){q1.forEach(function(t){html+=taskRow(t)})}else{html+='<div class="footnote text-tertiary">Пусто</div>'}
  html+='</div>';
  html+='<div class="card"><h2>📌 Q2 — Планируй</h2>';
  if(q2.length){q2.forEach(function(t){html+=taskRow(t)})}else{html+='<div class="footnote text-tertiary">Пусто</div>'}
  html+='</div>';
  html+='<div class="card"><h2>⚡ Q3 — Делегируй</h2>';
  if(q3.length){q3.forEach(function(t){html+=taskRow(t)})}else{html+='<div class="footnote text-tertiary">Пусто</div>'}
  html+='</div>';
  html+='<div class="card"><h2>🗑 Q4 — Удали</h2>';
  if(q4.length){q4.forEach(function(t){html+=taskRow(t)})}else{html+='<div class="footnote text-tertiary">Пусто</div>'}
  html+='</div>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderMatrix=renderMatrix;

/* ============================================================
   ПРИВЫЧКИ — рендеры
   ============================================================ */

/* Получить привычку пользователя по id */
function getUserHabit(id){
  if(!id)return null;
  for(var i=0;i<state.habits.length;i++)if(state.habits[i].id===id)return state.habits[i];
  return null;
}
window.getUserHabit=getUserHabit;

/* Выполнена ли сегодня */
function isHabitDoneToday(id){
  var h=getUserHabit(id);if(!h)return false;
  return h.lastCompletedDate===today();
}
window.isHabitDoneToday=isHabitDoneToday;

/* Привычки, активные сегодня (по расписанию) */
function getHabitsForToday(){
  var dow=new Date().getDay(); // 0=Sun, 1=Mon...
  var dowMon=dow===0?7:dow; // 1-7, Mon-Sun
  return (state.habits||[]).filter(function(h){
    if(!h.active)return true;
    var type=h.scheduleType||'daily';
    if(type==='daily')return true;
    if(type==='custom'&&h.weekDays)return h.weekDays.indexOf(dowMon)>=0;
    if(type==='weekly'||type==='count')return true;
    return true;
  });
}
window.getHabitsForToday=getHabitsForToday;

/* Отметить привычку на сегодня */
function toggleHabitToday(id){
  var h=getUserHabit(id);if(!h)return;
  var t=today();
  if(h.lastCompletedDate===t){
    h.lastCompletedDate=null;
    h.streak=Math.max(0,(h.streak||1)-1);
  }else{
    /* Проверка на продолжение серии */
    var y=yesterday();
    if(h.lastCompletedDate===y)h.streak=(h.streak||0)+1;
    else h.streak=1;
    h.lastCompletedDate=t;
    if((h.streak||0)>(h.bestStreak||0))h.bestStreak=h.streak;
    if((h.streak||0)>(state.brainStreak||0)){}
    state.xp=(state.xp||0)+10;
    haptic('success');
  }
  /* История */
  if(!state.habitHistory[h.id])state.habitHistory[h.id]={};
  state.habitHistory[h.id][t]={completed:h.lastCompletedDate===t};
  /* Дневной счётчик */
  if(h.scheduleType==='count'){
    if(!h.countToday||h.countDate!==t){h.countToday=0;h.countDate=t}
    h.countToday=(h.countToday||0)+1;
  }
  save();
  if(currentPage==='habitList'||currentPage==='habitDetail')renderHabitList();
  else if(currentPage==='dashboard')renderDashboard();
  else renderHabitsLegacy();
}
window.toggleHabitToday=toggleHabitToday;

/* Прогресс 66-дневного формирования */
function getHabit66Progress(h){
  if(!h.startDate)return{pct:0,done:0,total:66};
  var start=new Date(h.startDate);
  var end=new Date(start);
  var dur=h.duration||66;
  end.setDate(end.getDate()+dur);
  var now=new Date();
  var done=0, total=dur;
  if(!state.habitHistory[h.id])return{pct:0,done:0,total:total};
  Object.keys(state.habitHistory[h.id]).forEach(function(d){
    if(state.habitHistory[h.id][d].completed)done++;
  });
  var pct=Math.min(100,Math.round(done/total*100));
  return{pct:pct,done:done,total:total,startDate:h.startDate,endDate:end.toISOString().slice(0,10)};
}
window.getHabit66Progress=getHabit66Progress;

/* ==== Рендер: список привычек ==== */
function renderHabitList(){
  var habits=state.habits||[];
  var todayHabits=getHabitsForToday();
  var doneToday=todayHabits.filter(function(h){return h.lastCompletedDate===today()}).length;

  var html='<div class="page">';
  html+='<div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">🔄 Привычки</div>';
  html+='<div class="row" style="gap:6px;">';
  html+='<button class="btn btn-ghost btn-sm" onclick="navigate(\'habitCatalog\')">📚</button>';
  html+='<button class="btn btn-primary btn-sm" onclick="openHabitEditor(null)">+</button>';
  html+='</div></div>';

  if(habits.length){
    html+='<div class="card card-gradient">';
    html+='<div style="opacity:.9;font-size:12px;">Сегодня</div>';
    html+='<div style="font-size:36px;font-weight:800;">'+doneToday+' / '+todayHabits.length+'</div>';
    html+='<div class="progress" style="margin-top:10px;background:rgba(255,255,255,.25);height:6px;"><div class="progress-fill" style="width:'+(todayHabits.length?Math.round(doneToday/todayHabits.length*100):0)+'%;background:#fff;"></div></div>';
    html+='</div>';

    /* Фильтр по категориям */
    var cats=(window.HABIT_CATEGORIES||[]);
    var counts={};
    cats.forEach(function(c){counts[c.id]=0});
    habits.forEach(function(h){if(counts[h.category]!==undefined)counts[h.category]++});
    html+='<div class="quick-tabs">';
    html+='<button class="quick-tab '+(habitCatFilter==='all'?'active':'')+'" onclick="habitCatFilter=\'all\';renderHabitList()">Все ('+habits.length+')</button>';
    cats.forEach(function(c){
      if(!counts[c.id])return;
      html+='<button class="quick-tab '+(habitCatFilter===c.id?'active':'')+'" onclick="habitCatFilter=\''+c.id+'\';renderHabitList()">'+c.emoji+' '+c.name+' ('+counts[c.id]+')</button>';
    });
    html+='</div>';

    var filtered=habitCatFilter==='all'?habits:habits.filter(function(h){return h.category===habitCatFilter});
    if(!filtered.length){
      html+='<div class="empty"><div class="empty-icon">🔄</div><div class="empty-title">Нет привычек в этой категории</div></div>';
    }else{
      filtered.forEach(function(h){html+=renderHabitRow(h)});
    }
  } else {
    html+='<div class="card"><div class="empty"><div class="empty-icon">🔄</div>';
    html+='<div class="empty-title">Пока нет привычек</div>';
    html+='<div class="empty-text">Выбери из 200+ шаблонов или создай свою</div></div>';
    html+='<button class="btn btn-primary btn-block mt-3" onclick="navigate(\'habitCatalog\')">📚 Каталог шаблонов</button>';
    html+='<button class="btn btn-ghost btn-block mt-2" onclick="openHabitEditor(null)">➕ Создать с нуля</button>';
    html+='</div>';
  }

  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderHabitList=renderHabitList;

function renderHabitRow(h){
  var tpl=getHabitTemplate(h.templateId);
  var emoji=tpl?tpl.emoji:(h.emoji||'✅');
  var title=h.title||(tpl?tpl.title:'Привычка');
  var done=isHabitDoneToday(h.id);
  var prog=getHabit66Progress(h);
  var color=(window.HABIT_CATEGORIES||[]).find(function(c){return c.id===h.category});
  var catColor=color?color.color:'#5b9eff';
  return '<div class="method-card" onclick="openHabitDetail(\''+h.id+'\')" style="border-left:3px solid '+catColor+';">'+
    '<div class="method-header">'+
      '<div class="method-emoji">'+emoji+'</div>'+
      '<div style="flex:1;min-width:0;">'+
        '<div class="method-title">'+esc(title)+'</div>'+
        '<div class="method-cat">🔥 '+(h.streak||0)+' · Лучший '+(h.bestStreak||0)+' · '+(h.scheduleType==='daily'?'Ежедневно':h.scheduleType==='custom'?'По дням':'N раз')+'</div>'+
      '</div>'+
      '<button class="task-checkbox '+(done?'checked':'')+'" onclick="event.stopPropagation();toggleHabitToday(\''+h.id+'\')" style="width:36px;height:36px;">'+(done?'✓':'')+'</button>'+
    '</div>'+
    '<div class="progress" style="margin-top:8px;height:5px;"><div class="progress-fill" style="width:'+prog.pct+'%;"></div></div>'+
    '<div class="footnote text-tertiary" style="margin-top:4px;">'+prog.done+'/'+prog.total+' дней ('+prog.pct+'% к цели 66 дней)</div>'+
  '</div>';
}
window.renderHabitRow=renderHabitRow;

/* ==== Рендер: каталог шаблонов ==== */
function renderHabitCatalog(){
  var tpls=window.HABIT_TEMPLATES||[];
  var cats=window.HABIT_CATEGORIES||[];
  var counts={};
  cats.forEach(function(c){counts[c.id]=0});
  tpls.forEach(function(t){if(counts[t.cat]!==undefined)counts[t.cat]++});

  var html='<div class="page">';
  html+='<div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">📚 Каталог</div>';
  html+='<div class="badge badge-brand">'+tpls.length+' шаблонов</div></div>';

  html+='<div class="quick-tabs">';
  html+='<button class="quick-tab '+(habitCatFilter==='all'?'active':'')+'" onclick="habitCatFilter=\'all\';renderHabitCatalog()">Все ('+tpls.length+')</button>';
  cats.forEach(function(c){
    html+='<button class="quick-tab '+(habitCatFilter===c.id?'active':'')+'" onclick="habitCatFilter=\''+c.id+'\';renderHabitCatalog()">'+c.emoji+' '+c.name+' ('+counts[c.id]+')</button>';
  });
  html+='</div>';

  html+='<div class="search-bar"><span style="color:var(--text-3);font-size:18px;">🔍</span><input type="search" placeholder="Поиск привычки..." value="'+esc(habitSearch)+'" oninput="habitSearch=this.value;renderHabitCatalog()"/></div>';

  var filtered=habitCatFilter==='all'?tpls:tpls.filter(function(t){return t.cat===habitCatFilter});
  if(habitSearch){
    var q=habitSearch.toLowerCase();
    filtered=filtered.filter(function(t){return t.title.toLowerCase().indexOf(q)>=0||(t.desc||'').toLowerCase().indexOf(q)>=0});
  }

  if(!filtered.length){
    html+='<div class="empty"><div class="empty-icon">🔍</div><div class="empty-title">Ничего не найдено</div></div>';
  }else{
    filtered.forEach(function(t){
      var cat=cats.find(function(c){return c.id===t.cat});
      var catColor=cat?cat.color:'#5b9eff';
      html+='<div class="method-card" style="border-left:3px solid '+catColor+';" onclick="openHabitEditorFromTemplate(\''+t.id+'\')">';
      html+='<div class="method-header">';
      html+='<div class="method-emoji">'+t.emoji+'</div>';
      html+='<div style="flex:1;min-width:0;">';
      html+='<div class="method-title">'+esc(t.title)+'</div>';
      html+='<div class="method-cat">'+esc(t.desc||'')+'</div>';
      html+='</div>';
      html+='<div class="list-chevron">›</div>';
      html+='</div>';
      if(t.microGoals&&t.microGoals.length){
        html+='<div class="footnote text-tertiary" style="margin-top:6px;">🎯 '+t.microGoals.slice(0,2).map(esc).join(' · ')+'</div>';
      }
      html+='</div>';
    });
  }
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderHabitCatalog=renderHabitCatalog;

/* ==== Рендер: детали привычки ==== */
function renderHabitDetail(){
  var h=getUserHabit(currentHabitId);
  if(!h){navigate('habitList');return}
  var tpl=getHabitTemplate(h.templateId);
  var emoji=tpl?tpl.emoji:(h.emoji||'✅');
  var title=h.title||(tpl?tpl.title:'Привычка');
  var cat=(window.HABIT_CATEGORIES||[]).find(function(c){return c.id===h.category});
  var prog=getHabit66Progress(h);
  var done=isHabitDoneToday(h.id);

  var html='<div class="page">';
  html+='<div style="text-align:center;margin-bottom:20px;">';
  html+='<div style="font-size:56px;">'+emoji+'</div>';
  html+='<div class="title-xl">'+esc(title)+'</div>';
  if(cat)html+='<div class="footnote" style="color:'+cat.color+';">'+cat.emoji+' '+cat.name+'</div>';
  html+='</div>';

  html+='<div class="card card-gradient">';
  html+='<div style="opacity:.9;font-size:12px;">Прогресс 66 дней</div>';
  html+='<div style="font-size:40px;font-weight:800;">'+prog.pct+'%</div>';
  html+='<div style="opacity:.9;font-size:12px;margin-top:6px;">'+prog.done+' / '+prog.total+' дней</div>';
  html+='<div class="progress" style="margin-top:10px;background:rgba(255,255,255,.25);height:6px;"><div class="progress-fill" style="width:'+prog.pct+'%;background:#fff;"></div></div>';
  if(prog.startDate)html+='<div style="opacity:.9;font-size:11px;margin-top:6px;">'+prog.startDate+' → '+prog.endDate+'</div>';
  html+='</div>';

  html+='<div class="stat-grid mb-4">';
  html+='<div class="stat-item"><div class="stat-value">'+(h.streak||0)+'</div><div class="stat-label">Текущая</div></div>';
  html+='<div class="stat-item"><div class="stat-value">'+(h.bestStreak||0)+'</div><div class="stat-label">Лучшая</div></div>';
  html+='<div class="stat-item"><div class="stat-value">'+prog.done+'</div><div class="stat-label">Всего</div></div>';
  html+='</div>';

  html+='<button class="btn '+(done?'btn-success':'btn-primary')+' btn-block mb-3" onclick="toggleHabitToday(\''+h.id+'\')">'+(done?'✓ Выполнено сегодня':'Отметить выполнение')+'</button>';

  /* Расписание */
  html+='<div class="card"><h2>📅 Расписание</h2>';
  html+='<div class="stat-row"><span class="stat-row-label">Тип</span><span class="stat-row-value">'+(h.scheduleType==='daily'?'Ежедневно':h.scheduleType==='weekly'?'Еженедельно':h.scheduleType==='custom'?'По дням':'N раз в день')+'</span></div>';
  if(h.timeSlot)html+='<div class="stat-row"><span class="stat-row-label">Время</span><span class="stat-row-value">'+(window.HABIT_TIME_SLOTS||[]).find(function(t){return t.id===h.timeSlot})?.name||h.timeSlot+'</span></div>';
  if(h.weekDays&&h.weekDays.length){
    var dayNames=(window.WEEK_DAYS||[]).filter(function(d){return h.weekDays.indexOf(d.id)>=0}).map(function(d){return d.short}).join(', ');
    html+='<div class="stat-row"><span class="stat-row-label">Дни</span><span class="stat-row-value">'+dayNames+'</span></div>';
  }
  html+='</div>';

  /* Микро-цели */
  if(h.microGoals&&h.microGoals.length){
    html+='<div class="card"><h2>🎯 Микро-цели</h2>';
    h.microGoals.forEach(function(g,i){
      html+='<div class="stat-row"><span class="stat-row-label">'+(i+1)+'. '+esc(g)+'</span></div>';
    });
    html+='</div>';
  }

  /* Кнопки */
  html+='<button class="btn btn-ghost btn-block mb-2" onclick="openHabitEditor(\''+h.id+'\')">✏️ Редактировать</button>';
  html+='<button class="btn btn-danger btn-block" onclick="deleteHabit(\''+h.id+'\')">🗑 Удалить</button>';

  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderHabitDetail=renderHabitDetail;

function openHabitDetail(id){currentHabitId=id;navigate('habitDetail')}
window.openHabitDetail=openHabitDetail;

/* ==== Редактор привычки ==== */
function openHabitEditorFromTemplate(tplId){
  var tpl=getHabitTemplate(tplId);if(!tpl)return;
  var newHabit={
    id:uid(),
    templateId:tplId,
    category:tpl.cat,
    emoji:tpl.emoji,
    title:tpl.title,
    desc:tpl.desc||'',
    scheduleType:tpl.defaultType||'daily',
    targetCount:tpl.defaultTarget||null,
    duration:tpl.defaultDuration||66,
    timeSlot:tpl.defaultTime||'day',
    startDate:today(),
    microGoals:(tpl.microGoals||[]).slice(),
    autoTrack:tpl.autoTrack||false,
    integration:tpl.integration||null,
    streak:0,
    bestStreak:0,
    lastCompletedDate:null,
    active:true,
    createdAt:nowISO()
  };
  state.habits.push(newHabit);
  save();
  haptic('success');
  toast('✓ Привычка добавлена: '+tpl.title,'success');
  currentHabitId=newHabit.id;
  navigate('habitDetail');
}
window.openHabitEditorFromTemplate=openHabitEditorFromTemplate;

function openHabitEditor(id){
  if(!id){
    /* Создаём новую пустую */
    currentHabitId=null;
    navigate('habitEditor');
    return;
  }
  currentHabitId=id;
  navigate('habitEditor');
}
window.openHabitEditor=openHabitEditor;

function renderHabitEditor(){
  var h=currentHabitId?getUserHabit(currentHabitId):null;
  var isNew=!h;
  if(isNew)h={scheduleType:'daily',duration:66,timeSlot:'day',startDate:today(),microGoals:[]};

  var html='<div class="page">';
  html+='<div class="title-xl">'+(isNew?'Новая привычка':'Редактировать')+'</div>';

  html+='<div class="card">';
  html+='<div class="field"><label class="field-label">Название *</label><input type="text" id="hab-title" value="'+esc(h.title||'')+'" placeholder="Например: Пить воду"/></div>';
  html+='<div class="field"><label class="field-label">Эмодзи</label><input type="text" id="hab-emoji" value="'+esc(h.emoji||'✅')+'" maxlength="4"/></div>';
  html+='<div class="field"><label class="field-label">Категория</label><select id="hab-category">';
  (window.HABIT_CATEGORIES||[]).forEach(function(c){
    html+='<option value="'+c.id+'"'+(h.category===c.id?' selected':'')+'>'+c.emoji+' '+c.name+'</option>';
  });
  html+='</select></div>';
  html+='</div>';

  html+='<div class="card"><h2>📅 Расписание</h2>';
  html+='<div class="field"><label class="field-label">Тип</label><select id="hab-schedule">';
  (window.HABIT_SCHEDULE_TYPES||[]).forEach(function(s){
    html+='<option value="'+s.id+'"'+(h.scheduleType===s.id?' selected':'')+'>'+s.emoji+' '+s.name+'</option>';
  });
  html+='</select></div>';
  html+='<div class="field"><label class="field-label">Время дня</label><select id="hab-timeSlot">';
  (window.HABIT_TIME_SLOTS||[]).forEach(function(t){
    html+='<option value="'+t.id+'"'+(h.timeSlot===t.id?' selected':'')+'>'+t.emoji+' '+t.name+' ('+t.range+')</option>';
  });
  html+='</select></div>';
  html+='</div>';

  html+='<div class="card"><h2>🎯 Цель</h2>';
  html+='<div class="field"><label class="field-label">Длительность формирования</label><select id="hab-duration">';
  (window.HABIT_DURATIONS||[]).forEach(function(d){
    html+='<option value="'+d.id+'"'+(h.duration===d.id?' selected':'')+'>'+d.emoji+' '+d.name+' — '+d.desc+'</option>';
  });
  html+='</select></div>';
  html+='<div class="field"><label class="field-label">Дата старта</label><input type="date" id="hab-start" value="'+(h.startDate||today())+'"/></div>';
  html+='<div class="field"><label class="field-label">Микро-цели (через запятую)</label><textarea id="hab-micro" placeholder="5 мин, 10 мин, 20 мин">'+esc((h.microGoals||[]).join(', '))+'</textarea></div>';
  html+='</div>';

  html+='<button class="btn btn-primary btn-block mb-2" onclick="saveHabit()">'+(isNew?'➕ Создать':'💾 Сохранить')+'</button>';
  if(!isNew)html+='<button class="btn btn-danger btn-block" onclick="deleteHabit(\''+h.id+'\')">🗑 Удалить</button>';

  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderHabitEditor=renderHabitEditor;

function saveHabit(){
  var title=(document.getElementById('hab-title')||{}).value||'';
  if(!title.trim()){toast('Введите название','error');return}
  var emoji=(document.getElementById('hab-emoji')||{}).value||'✅';
  var category=(document.getElementById('hab-category')||{}).value||'health';
  var scheduleType=(document.getElementById('hab-schedule')||{}).value||'daily';
  var timeSlot=(document.getElementById('hab-timeSlot')||{}).value||'day';
  var duration=parseInt((document.getElementById('hab-duration')||{}).value)||66;
  var startDate=(document.getElementById('hab-start')||{}).value||today();
  var microRaw=(document.getElementById('hab-micro')||{}).value||'';
  var microGoals=microRaw.split(',').map(function(s){return s.trim()}).filter(Boolean);

  if(currentHabitId){
    var h=getUserHabit(currentHabitId);
    if(!h)return;
    h.title=title.trim();
    h.emoji=emoji;
    h.category=category;
    h.scheduleType=scheduleType;
    h.timeSlot=timeSlot;
    h.duration=duration;
    h.startDate=startDate;
    h.microGoals=microGoals;
    h.updatedAt=nowISO();
  }else{
    var newH={
      id:uid(),
      title:title.trim(),
      emoji:emoji,
      category:category,
      scheduleType:scheduleType,
      timeSlot:timeSlot,
      duration:duration,
      startDate:startDate,
      microGoals:microGoals,
      streak:0,
      bestStreak:0,
      lastCompletedDate:null,
      active:true,
      createdAt:nowISO()
    };
    state.habits.push(newH);
    currentHabitId=newH.id;
  }
  save();haptic('success');toast('✓ Сохранено','success');
  navigate('habitDetail');
}
window.saveHabit=saveHabit;

function deleteHabit(id){
  if(!confirm('Удалить привычку?'))return;
  state.habits=state.habits.filter(function(h){return h.id!==id});
  save();toast('Удалено','info');navigate('habitList');
}
window.deleteHabit=deleteHabit;

/* ============================================================
   СТАРЫЕ рендеры для совместимости
   ============================================================ */
function renderHabitsLegacy(){navigate('habitList')}
window.renderHabitsLegacy=renderHabitsLegacy;

console.log('[APP v43 2/8] ✅ Dashboard, Tasks v2, Matrix, Habits');
/* ============================================================
   LIFE OS — APP.js v43
   ЧАСТЬ 3/8: ТРЕНИРОВКА УМА + АНТИСТРЕСС
   ============================================================ */

/* ============================================================
   ТРЕНИРОВКА УМА
   ============================================================ */

/* Получить игру по id */
function getBrainGameById(id){
  if(!id)return null;
  for(var i=0;i<(window.BRAIN_TRAINING||[]).length;i++){
    if(window.BRAIN_TRAINING[i].id===id)return window.BRAIN_TRAINING[i];
  }
  return null;
}
window.getBrainGameById=getBrainGameById;

/* Записать результат игры */
function recordBrainPlay(gameId,score,duration,accuracy){
  if(!state.brainPlays)state.brainPlays=[];
  state.brainPlays.push({
    id:uid(),gameId:gameId,date:today(),
    score:score||0,duration:duration||0,accuracy:accuracy||null,
    timestamp:nowISO()
  });
  if(!state.brainStats)state.brainStats={};
  if(!state.brainStats[gameId])state.brainStats[gameId]={plays:0,best:0,avg:0,total:0,lastPlayed:null};
  var s=state.brainStats[gameId];
  s.plays++;
  s.total+=score||0;
  s.avg=Math.round(s.total/s.plays);
  if((score||0)>s.best)s.best=score||0;
  s.lastPlayed=nowISO();
  /* Streak */
  var t=today();
  if(state.brainLastDay!==t){
    var y=yesterday();
    if(state.brainLastDay===y)state.brainStreak=(state.brainStreak||0)+1;
    else state.brainStreak=1;
    state.brainLastDay=t;
  }
  state.xp=(state.xp||0)+10;
  save();
}
window.recordBrainPlay=recordBrainPlay;

/* ==== Рендер: главный экран тренировки ума ==== */
function renderBrain(){
  var cats=window.BRAIN_CATEGORIES||[];
  var games=window.BRAIN_TRAINING||[];
  var totalPlays=(state.brainPlays||[]).length;
  var todayPlays=(state.brainPlays||[]).filter(function(p){return p.date===today()}).length;

  var html='<div class="page">';
  html+='<div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">🧠 Тренировка ума</div>';
  html+='<button class="btn btn-ghost btn-sm" onclick="navigate(\'brainStats\')">📊</button></div>';

  html+='<div class="card card-gradient">';
  html+='<div style="opacity:.9;font-size:12px;">Сегодня</div>';
  html+='<div style="font-size:40px;font-weight:800;">'+todayPlays+' игр</div>';
  html+='<div style="opacity:.9;font-size:12px;margin-top:6px;">Всего: '+totalPlays+' · Streak: '+(state.brainStreak||0)+' 🔥</div>';
  html+='</div>';

  html+='<div class="quick-tabs">';
  html+='<button class="quick-tab '+(brainCatFilter==='all'?'active':'')+'" onclick="brainCatFilter=\'all\';renderBrain()">Все ('+games.length+')</button>';
  cats.forEach(function(c){
    var cnt=games.filter(function(g){return g.cat===c.id}).length;
    html+='<button class="quick-tab '+(brainCatFilter===c.id?'active':'')+'" onclick="brainCatFilter=\''+c.id+'\';renderBrain()">'+c.emoji+' '+c.name+' ('+cnt+')</button>';
  });
  html+='</div>';

  var filtered=brainCatFilter==='all'?games:games.filter(function(g){return g.cat===brainCatFilter});
  filtered.slice(0,50).forEach(function(g){
    var stat=state.brainStats&&state.brainStats[g.id];
    var cat=cats.find(function(c){return c.id===g.cat});
    var catColor=cat?cat.color:'#5b9eff';
    html+='<div class="method-card" style="border-left:3px solid '+catColor+';" onclick="startBrainGame(\''+g.id+'\')">';
    html+='<div class="method-header">';
    html+='<div class="method-emoji">'+g.emoji+'</div>';
    html+='<div style="flex:1;min-width:0;">';
    html+='<div class="method-title">'+esc(g.title)+'</div>';
    html+='<div class="method-cat">'+esc(g.desc||'')+' · ⏱ '+g.duration+'с · 🔥 '+g.difficulty+'/5</div>';
    html+='</div>';
    html+='<div class="list-chevron">▶</div>';
    html+='</div>';
    if(stat)html+='<div class="footnote text-tertiary" style="margin-top:6px;">Лучший: '+stat.best+' · Игр: '+stat.plays+' · Среднее: '+stat.avg+'</div>';
    html+='</div>';
  });

  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderBrain=renderBrain;

/* ==== Рендер: статистика ==== */
function renderBrainStats(){
  var plays=state.brainPlays||[];
  var stats=state.brainStats||{};
  var html='<div class="page"><div class="title-xl">📊 Статистика ума</div>';
  html+='<div class="stat-grid mb-4">';
  html+='<div class="stat-item"><div class="stat-value">'+plays.length+'</div><div class="stat-label">Всего игр</div></div>';
  html+='<div class="stat-item"><div class="stat-value">'+(state.brainStreak||0)+'</div><div class="stat-label">Streak</div></div>';
  html+='<div class="stat-item"><div class="stat-value">'+Object.keys(stats).length+'</div><div class="stat-label">Игр освоено</div></div>';
  html+='</div>';
  var catStats={};
  (window.BRAIN_CATEGORIES||[]).forEach(function(c){catStats[c.id]={games:0,plays:0}});
  Object.keys(stats).forEach(function(gid){
    var g=getBrainGameById(gid);if(!g)return;
    catStats[g.cat].games++;
    catStats[g.cat].plays+=stats[gid].plays;
  });
  html+='<div class="card"><h2>По категориям</h2>';
  (window.BRAIN_CATEGORIES||[]).forEach(function(c){
    var s=catStats[c.id];
    html+='<div class="stat-row"><span class="stat-row-label">'+c.emoji+' '+c.name+'</span><span class="stat-row-value">'+s.plays+' игр</span></div>';
  });
  html+='</div>';
  if(plays.length){
    html+='<div class="card"><h2>Последние 10</h2>';
    plays.slice(-10).reverse().forEach(function(p){
      var g=getBrainGameById(p.gameId);
      html+='<div class="stat-row"><span class="stat-row-label">'+(g?g.emoji+' '+g.title:'Игра')+'</span><span class="stat-row-value">'+p.score+'</span></div>';
    });
    html+='</div>';
  }
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderBrainStats=renderBrainStats;

/* ==== Запуск игры ==== */
function startBrainGame(id){
  currentBrainGameId=id;
  var g=getBrainGameById(id);if(!g)return;
  /* Для простоты — сразу "игра" через prompt/диалог. Полноценные игры — позже. */
  var html='<div style="text-align:center;margin-bottom:16px;">';
  html+='<div style="font-size:56px;">'+g.emoji+'</div>';
  html+='<div style="font-size:22px;font-weight:800;">'+esc(g.title)+'</div>';
  html+='<div class="footnote text-secondary">'+esc(g.desc||'')+'</div>';
  html+='</div>';
  html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">🎯 Правила</div><div class="lesson-content">'+esc(g.desc||'')+'<br><br>Длительность: '+g.duration+' секунд.<br>Сложность: '+g.difficulty+'/5.<br>Наука: '+esc(g.science||'—')+'</div></div></div>';
  html+='<div class="card"><h2>Результат</h2>';
  html+='<div class="field"><label class="field-label">Очки (0-100)</label><input type="number" id="bg-score" value="50" min="0" max="100"/></div>';
  html+='<div class="field"><label class="field-label">Точность % (опционально)</label><input type="number" id="bg-accuracy" value="80" min="0" max="100"/></div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="finishBrainGame()">✓ Записать результат</button>';
  html+='</div>';
  openSheet(g.title,html);
}
window.startBrainGame=startBrainGame;

function finishBrainGame(){
  if(!currentBrainGameId)return;
  var score=parseInt((document.getElementById('bg-score')||{}).value)||0;
  var accuracy=parseInt((document.getElementById('bg-accuracy')||{}).value)||null;
  var g=getBrainGameById(currentBrainGameId);
  recordBrainPlay(currentBrainGameId,score,g?g.duration:60,accuracy);
  haptic('success');toast('✓ +10 XP','success');
  closeSheet();currentBrainGameId=null;
  renderBrain();
}
window.finishBrainGame=finishBrainGame;

/* ============================================================
   АНТИСТРЕСС
   ============================================================ */

function getAntistressById(id){
  if(!id)return null;
  for(var i=0;i<(window.ANTISTRESS_PRACTICES||[]).length;i++){
    if(window.ANTISTRESS_PRACTICES[i].id===id)return window.ANTISTRESS_PRACTICES[i];
  }
  return null;
}
window.getAntistressById=getAntistressById;

function recordAntistress(practiceId){
  if(!state.antistressEntries)state.antistressEntries=[];
  state.antistressEntries.push({id:uid(),practiceId:practiceId,date:today(),time:nowISO()});
  if(!state.antistressStats)state.antistressStats={};
  if(!state.antistressStats[practiceId])state.antistressStats[practiceId]={count:0,lastDate:null};
  state.antistressStats[practiceId].count++;
  state.antistressStats[practiceId].lastDate=nowISO();
  state.xp=(state.xp||0)+5;
  save();
}
window.recordAntistress=recordAntistress;

/* ==== Рендер: главный экран антистресса ==== */
function renderAntistress(){
  var cats=window.ANTISTRESS_CATEGORIES||[];
  var practices=window.ANTISTRESS_PRACTICES||[];
  var todayCount=(state.antistressEntries||[]).filter(function(e){return e.date===today()}).length;

  var html='<div class="page">';
  html+='<div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">🌬 Антистресс</div>';
  html+='<div class="badge badge-brand">'+todayCount+' сегодня</div></div>';

  html+='<div class="card card-gradient">';
  html+='<div style="opacity:.9;font-size:12px;">Быстрая помощь</div>';
  html+='<div style="font-size:18px;font-weight:800;margin-top:6px;">Выбери практику → 2-10 минут → спокойствие</div>';
  html+='</div>';

  /* Быстрые кнопки */
  html+='<div class="card"><h2>⚡ Быстро (2 мин)</h2>';
  html+='<div class="group-grid">';
  html+='<div class="group-item" onclick="startAntistress(\'as_breath_sigh\')"><div class="group-item-icon">😮‍💨</div><div class="group-item-label">Вздох</div></div>';
  html+='<div class="group-item" onclick="startAntistress(\'as_breath_478\')"><div class="group-item-icon">🌬</div><div class="group-item-label">4-7-8</div></div>';
  html+='<div class="group-item" onclick="startAntistress(\'as_breath_box\')"><div class="group-item-icon">📦</div><div class="group-item-label">Box</div></div>';
  html+='<div class="group-item" onclick="startAntistress(\'as_ground_54321\')"><div class="group-item-icon">🌳</div><div class="group-item-label">5-4-3-2-1</div></div>';
  html+='<div class="group-item" onclick="startAntistress(\'as_cold_face\')"><div class="group-item-icon">🧊</div><div class="group-item-label">Холод</div></div>';
  html+='<div class="group-item" onclick="startAntistress(\'as_cold_ice\')"><div class="group-item-icon">❄️</div><div class="group-item-label">Лёд</div></div>';
  html+='</div></div>';

  html+='<div class="quick-tabs">';
  html+='<button class="quick-tab '+(asCatFilter==='all'?'active':'')+'" onclick="asCatFilter=\'all\';renderAntistress()">Все ('+practices.length+')</button>';
  cats.forEach(function(c){
    var cnt=practices.filter(function(p){return p.cat===c.id}).length;
    html+='<button class="quick-tab '+(asCatFilter===c.id?'active':'')+'" onclick="asCatFilter=\''+c.id+'\';renderAntistress()">'+c.emoji+' '+c.name+' ('+cnt+')</button>';
  });
  html+='</div>';

  var filtered=asCatFilter==='all'?practices:practices.filter(function(p){return p.cat===asCatFilter});
  filtered.forEach(function(p){
    var stat=state.antistressStats&&state.antistressStats[p.id];
    var cat=cats.find(function(c){return c.id===p.cat});
    var catColor=cat?cat.color:'#5b9eff';
    html+='<div class="method-card" style="border-left:3px solid '+catColor+';" onclick="startAntistress(\''+p.id+'\')">';
    html+='<div class="method-header">';
    html+='<div class="method-emoji">'+p.emoji+'</div>';
    html+='<div style="flex:1;min-width:0;">';
    html+='<div class="method-title">'+esc(p.title)+'</div>';
    html+='<div class="method-cat">'+esc(p.desc||'')+' · ⏱ '+Math.round(p.duration/60)+' мин · '+p.level+'</div>';
    html+='</div>';
    html+='<div class="list-chevron">▶</div>';
    html+='</div>';
    if(stat)html+='<div class="footnote text-tertiary" style="margin-top:6px;">Выполнено: '+stat.count+' раз</div>';
    html+='</div>';
  });

  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderAntistress=renderAntistress;

/* ==== Детали практики + запуск ==== */
function startAntistress(id){
  var p=getAntistressById(id);if(!p)return;
  currentAntistressId=id;
  var html='<div style="text-align:center;margin-bottom:16px;">';
  html+='<div style="font-size:56px;">'+p.emoji+'</div>';
  html+='<div style="font-size:22px;font-weight:800;">'+esc(p.title)+'</div>';
  html+='<div class="footnote text-secondary">'+esc(p.desc||'')+'</div>';
  html+='</div>';
  html+='<div class="card"><h2>📋 Шаги</h2>';
  html+='<div class="lesson-content"><ul>';
  (p.steps||[]).forEach(function(s){html+='<li>'+esc(s)+'</li>'});
  html+='</ul></div></div>';
  if(p.science)html+='<div class="insight-card"><div class="insight-title">🔬 Наука</div><div class="insight-text">'+esc(p.science)+'</div></div>';
  if(p.effect)html+='<div class="insight-card"><div class="insight-title">💎 Эффект</div><div class="insight-text">'+esc(p.effect)+'</div></div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="finishAntistress()">✓ Выполнено (+5 XP)</button>';
  openSheet(p.title,html);
}
window.startAntistress=startAntistress;

function finishAntistress(){
  if(!currentAntistressId)return;
  recordAntistress(currentAntistressId);
  haptic('success');toast('✓ +5 XP','success');
  closeSheet();currentAntistressId=null;
  renderAntistress();
}
window.finishAntistress=finishAntistress;

function renderAntistressDetail(){renderAntistress()}
window.renderAntistressDetail=renderAntistressDetail;

console.log('[APP v43 3/8] ✅ Brain Training + Antistress');
/* ============================================================
   LIFE OS — APP.js v43
   ЧАСТЬ 4/8: СОН — календарь, редактор, статистика
   ============================================================ */

/* ============================================================
   ХЕЛПЕРЫ СНА
   ============================================================ */

/* Сегодняшняя дата YYYY-MM-DD */
function _sleepDateKey(d){return d.toISOString().slice(0,10)}

/* Часы между start и end (учитывает переход через полночь) */
function calcSleepHours(startHHMM,endHHMM){
  if(!startHHMM||!endHHMM)return 0;
  var sp=startHHMM.split(':');
  var ep=endHHMM.split(':');
  var s=parseInt(sp[0])*60+parseInt(sp[1]||0);
  var e=parseInt(ep[0])*60+parseInt(ep[1]||0);
  if(e<=s)e+=24*60;
  return Math.round((e-s)/60*10)/10;
}

/* Записи сна (все) */
function getSleepEntries(){return (state.sleepEntries||[]).slice().sort(function(a,b){return a.date<b.date?-1:1})}
window.getSleepEntries=getSleepEntries;

/* Запись за дату */
function getSleepEntryForDate(date){
  if(!date)date=today();
  return (state.sleepEntries||[]).find(function(s){return s.date===date});
}
window.getSleepEntryForDate=getSleepEntryForDate;

/* Ночные записи за последние N дней */
function getNightSleepLast(days){
  days=days||7;
  var arr=[];var now=new Date();
  for(var i=days-1;i>=0;i--){
    var d=new Date(now);d.setDate(d.getDate()-i);
    var iso=_sleepDateKey(d);
    var e=getSleepEntryForDate(iso);
    if(e&&e.type==='night')arr.push(e);
  }
  return arr;
}

/* Средняя длительность */
function getAvgSleep(days){
  days=days||7;
  var arr=getNightSleepLast(days);
  if(!arr.length)return null;
  var sum=0;arr.forEach(function(s){sum+=s.hours||0});
  return Math.round(sum/arr.length*10)/10;
}
window.getAvgSleep=getAvgSleep;

/* ==== Рендер: главный экран сна ==== */
function renderSleep(){
  var todayEntry=getSleepEntryForDate(today());
  var lastEntry=(state.sleepEntries||[]).slice(-1)[0];
  var avg7=getAvgSleep(7);
  var avg30=getAvgSleep(30);
  var html='<div class="page">';
  html+='<div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">😴 Сон</div>';
  html+='<button class="btn btn-ghost btn-sm" onclick="navigate(\'sleepCalendar\')">📅</button></div>';

  html+='<div class="card card-gradient">';
  if(lastEntry){
    html+='<div style="opacity:.9;font-size:12px;">Последняя ночь</div>';
    html+='<div style="font-size:40px;font-weight:800;">'+lastEntry.hours+' ч</div>';
    html+='<div style="opacity:.9;font-size:12px;margin-top:6px;">'+lastEntry.date+' · качество: '+lastEntry.quality+'/10</div>';
  }else{
    html+='<div style="font-size:16px;font-weight:800;">Добавь первую запись сна</div>';
    html+='<div class="footnote" style="opacity:.9;margin-top:6px;">Дневной и ночной — отмечай когда лёг и встал</div>';
  }
  html+='</div>';

  html+='<button class="btn btn-primary btn-block mb-3" onclick="navigate(\'sleepEditor\')">➕ '+(todayEntry?'Редактировать запись':'Записать сон')+'</button>';

  html+='<div class="stat-grid mb-4">';
  html+='<div class="stat-item"><div class="stat-value">'+(avg7!==null?avg7+'ч':'—')+'</div><div class="stat-label">Среднее 7д</div></div>';
  html+='<div class="stat-item"><div class="stat-value">'+(avg30!==null?avg30+'ч':'—')+'</div><div class="stat-label">Среднее 30д</div></div>';
  html+='<div class="stat-item"><div class="stat-value">'+(state.sleepEntries||[]).length+'</div><div class="stat-label">Всего</div></div>';
  html+='</div>';

  /* Мини-график за 7 дней */
  var last7=[];
  for(var i=6;i>=0;i--){
    var d=new Date();d.setDate(d.getDate()-i);
    var iso=_sleepDateKey(d);
    var e=getSleepEntryForDate(iso);
    last7.push({date:iso,day:['Вс','Пн','Вт','Ср','Чт','Пт','Сб'][d.getDay()],hours:e?e.hours:0});
  }
  var maxH=Math.max.apply(null,last7.map(function(x){return x.hours}).concat([9]));
  html+='<div class="card"><h2>📊 Последние 7 ночей</h2>';
  html+='<div style="display:flex;gap:4px;align-items:flex-end;height:140px;padding:10px 0;">';
  last7.forEach(function(x){
    var pct=maxH?(x.hours/maxH*100):0;
    var color=x.hours>=7&&x.hours<=9?'var(--success)':x.hours>=6?'var(--warning)':'var(--danger)';
    html+='<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;">';
    html+='<div style="font-size:9px;color:var(--text-3);margin-bottom:4px;">'+(x.hours||'—')+'</div>';
    html+='<div style="width:100%;height:'+Math.max(2,pct)+'%;background:'+color+';border-radius:6px 6px 0 0;min-height:4px;"></div>';
    html+='<div style="font-size:10px;font-weight:700;color:var(--text-2);margin-top:4px;">'+x.day+'</div>';
    html+='</div>';
  });
  html+='</div></div>';

  html+='<div class="compact-grid">';
  html+='<div class="compact-item" onclick="navigate(\'sleepCalendar\')"><span class="compact-icon">📅</span><span>Календарь сна</span></div>';
  html+='<div class="compact-item" onclick="openSleepQuickAdd()"><span class="compact-icon">⚡</span><span>Быстрая запись</span></div>';
  html+='</div>';

  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderSleep=renderSleep;

/* ==== Рендер: календарь сна ==== */
var SLEEP_CAL_CURSOR=new Date();

function renderSleepCalendar(){
  var y=SLEEP_CAL_CURSOR.getFullYear();
  var m=SLEEP_CAL_CURSOR.getMonth();
  var first=new Date(y,m,1);
  var offset=first.getDay()===0?6:first.getDay()-1;
  var daysInMonth=new Date(y,m+1,0).getDate();
  var todayISO=today();

  var html='<div class="page">';
  html+='<div class="title-xl">📅 Календарь сна</div>';

  html+='<div class="cal-toolbar">';
  html+='<button class="cal-nav-btn" onclick="SLEEP_CAL_CURSOR=new Date('+y+','+(m-1)+',1);renderSleepCalendar()">‹</button>';
  html+='<button class="cal-today-btn" onclick="SLEEP_CAL_CURSOR=new Date();renderSleepCalendar()">Сегодня</button>';
  html+='<button class="cal-nav-btn" onclick="SLEEP_CAL_CURSOR=new Date('+y+','+(m+1)+',1);renderSleepCalendar()">›</button>';
  html+='<div class="cal-title">'+['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'][m]+' '+y+'</div>';
  html+='</div>';

  /* Легенда */
  html+='<div class="footnote text-secondary mb-3" style="display:flex;gap:12px;flex-wrap:wrap;">';
  html+='<span>🟢 7-9ч</span><span>🟡 6-7ч</span><span>🔴 &lt;6ч</span><span>⚪ нет записи</span>';
  html+='</div>';

  html+='<div class="cal-month"><div class="cal-month-head">';
  ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].forEach(function(d){html+='<div class="cal-month-head-cell">'+d+'</div>'});
  html+='</div><div class="cal-month-grid">';

  /* Пустые ячейки */
  for(var i=offset-1;i>=0;i--){
    html+='<div class="cal-month-cell" style="opacity:.35;"></div>';
  }
  for(var d=1;d<=daysInMonth;d++){
    var iso=y+'-'+pad(m+1)+'-'+pad(d);
    var e=getSleepEntryForDate(iso);
    var color='rgba(255,255,255,.08)';
    var dot='';
    if(e){
      if(e.hours>=7&&e.hours<=9)color='rgba(61,220,151,.35)';
      else if(e.hours>=6)color='rgba(255,169,64,.35)';
      else color='rgba(255,107,107,.35)';
      dot='<div style="font-size:11px;font-weight:700;text-align:center;color:#fff;">'+e.hours+'</div>';
    }
    html+='<div class="cal-month-cell'+(iso===todayISO?' cal-today':'')+'" onclick="openSleepForDate(\''+iso+'\')" style="background:'+color+';">';
    html+='<div class="cal-day-num">'+d+'</div>';
    html+=dot;
    html+='</div>';
  }
  html+='</div></div>';

  /* Статистика месяца */
  var monthEntries=(state.sleepEntries||[]).filter(function(s){return s.date&&s.date.slice(0,7)===y+'-'+pad(m+1)});
  var avg=monthEntries.length?Math.round(monthEntries.reduce(function(a,s){return a+(s.hours||0)},0)/monthEntries.length*10)/10:null;
  html+='<div class="card"><h2>📊 Месяц</h2>';
  html+='<div class="stat-row"><span class="stat-row-label">Записей</span><span class="stat-row-value">'+monthEntries.length+'</span></div>';
  html+='<div class="stat-row"><span class="stat-row-label">Среднее</span><span class="stat-row-value">'+(avg!==null?avg+' ч':'—')+'</span></div>';
  html+='<div class="stat-row"><span class="stat-row-label">Всего записей</span><span class="stat-row-value">'+(state.sleepEntries||[]).length+'</span></div>';
  html+='</div>';

  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderSleepCalendar=renderSleepCalendar;

function openSleepForDate(iso){
  var e=getSleepEntryForDate(iso);
  if(e){
    currentSleepDate=iso;
    navigate('sleepEditor');
  }else{
    currentSleepDate=iso;
    navigate('sleepEditor');
  }
}
window.openSleepForDate=openSleepForDate;

/* ==== Редактор сна ==== */
var currentSleepDate=null;

function navigateSleepEditor(date){
  currentSleepDate=date||today();
  navigate('sleepEditor');
}
window.navigateSleepEditor=navigateSleepEditor;

function renderSleepEditor(){
  var date=currentSleepDate||today();
  var e=getSleepEntryForDate(date);
  var isNew=!e;
  if(isNew)e={
    date:date,type:'night',
    start:'23:00',end:'07:00',hours:8,
    quality:7,
    notes:'',
    disruptions:[],improvements:[],
    daytimeEffects:[],daytimeFactors:[],
    resetFactors:[],
    awakenings:0
  };

  var html='<div class="page">';
  html+='<div class="title-xl">'+(isNew?'Записать сон':'Сон: '+date)+'</div>';

  /* Дата и тип */
  html+='<div class="card">';
  html+='<div class="field"><label class="field-label">Дата</label><input type="date" id="sl-date" value="'+date+'"/></div>';
  html+='<div class="field"><label class="field-label">Тип</label><select id="sl-type"><option value="night"'+(e.type==='night'?' selected':'')+'>🌙 Ночной</option><option value="nap"'+(e.type==='nap'?' selected':'')+'>☀️ Дневной</option></select></div>';
  html+='<div class="row" style="gap:8px;">';
  html+='<div style="flex:1;"><label class="field-label">Лёг</label><input type="time" id="sl-start" value="'+e.start+'"/></div>';
  html+='<div style="flex:1;"><label class="field-label">Встал</label><input type="time" id="sl-end" value="'+e.end+'"/></div>';
  html+='</div>';
  html+='<div class="footnote text-tertiary mb-3">Часы считаются автоматически (учитывается переход через полночь)</div>';
  html+='<div class="field"><label class="field-label">Пробуждений за ночь</label><input type="number" id="sl-awaken" value="'+(e.awakenings||0)+'" min="0" max="20"/></div>';
  html+='</div>';

  /* Качество */
  html+='<div class="card"><h2>✨ Качество</h2>';
  html+='<div style="text-align:center;padding:6px 0;"><div id="sl-quality-display" style="font-size:44px;font-weight:800;color:var(--brand);">'+e.quality+'/10</div></div>';
  html+='<input type="range" min="1" max="10" value="'+e.quality+'" style="width:100%;margin:10px 0;" oninput="document.getElementById(\'sl-quality-display\').textContent=this.value+\'/10\';document.getElementById(\'sl-quality-value\').value=this.value;"/>';
  html+='<input type="hidden" id="sl-quality-value" value="'+e.quality+'"/>';
  html+='</div>';

  /* Что мешало */
  html+='<div class="card"><h2>🚫 Что мешало</h2>';
  html+='<div style="display:flex;flex-wrap:wrap;gap:6px;">';
  (window.SLEEP_DISRUPTIONS||[]).forEach(function(d){
    var active=(e.disruptions||[]).indexOf(d.id)>=0;
    html+='<button class="btn '+(active?'btn-primary':'btn-ghost')+' btn-sm" data-disruption="'+d.id+'" onclick="toggleSleepChip(this,\'disruption\')">'+d.emoji+' '+d.label+'</button>';
  });
  html+='</div></div>';

  /* Что помогло */
  html+='<div class="card"><h2>✅ Что помогло</h2>';
  html+='<div style="display:flex;flex-wrap:wrap;gap:6px;">';
  (window.SLEEP_IMPROVEMENTS||[]).forEach(function(d){
    var active=(e.improvements||[]).indexOf(d.id)>=0;
    html+='<button class="btn '+(active?'btn-success':'btn-ghost')+' btn-sm" data-improvement="'+d.id+'" onclick="toggleSleepChip(this,\'improvement\')">'+d.emoji+' '+d.label+'</button>';
  });
  html+='</div></div>';

  /* Самочувствие днём */
  html+='<div class="card"><h2>☀️ Самочувствие днём</h2>';
  html+='<div style="display:flex;flex-wrap:wrap;gap:6px;">';
  (window.SLEEP_DAYTIME_EFFECTS||[]).forEach(function(d){
    var active=(e.daytimeEffects||[]).indexOf(d.id)>=0;
    html+='<button class="btn '+(active?'btn-primary':'btn-ghost')+' btn-sm" data-effect="'+d.id+'" onclick="toggleSleepChip(this,\'effect\')">'+d.emoji+' '+d.label+'</button>';
  });
  html+='</div></div>';

  /* Что повлияло */
  html+='<div class="card"><h2>🎯 Что повлияло</h2>';
  html+='<div style="display:flex;flex-wrap:wrap;gap:6px;">';
  (window.SLEEP_DAYTIME_FACTORS||[]).forEach(function(d){
    var active=(e.daytimeFactors||[]).indexOf(d.id)>=0;
    html+='<button class="btn '+(active?'btn-primary':'btn-ghost')+' btn-sm" data-factor="'+d.id+'" onclick="toggleSleepChip(this,\'factor\')">'+d.emoji+' '+d.label+'</button>';
  });
  html+='</div></div>';

  /* Что сбило режим */
  html+='<div class="card"><h2>🌪 Что сбило режим</h2>';
  html+='<div style="display:flex;flex-wrap:wrap;gap:6px;">';
  (window.SLEEP_RESET_FACTORS||[]).forEach(function(d){
    var active=(e.resetFactors||[]).indexOf(d.id)>=0;
    html+='<button class="btn '+(active?'btn-warning':'btn-ghost')+' btn-sm" data-reset="'+d.id+'" onclick="toggleSleepChip(this,\'reset\')">'+d.emoji+' '+d.label+'</button>';
  });
  html+='</div></div>';

  /* Заметка */
  html+='<div class="card"><h2>📝 Заметка</h2>';
  html+='<div class="field"><textarea id="sl-notes" style="min-height:80px;" placeholder="Своими словами...">'+esc(e.notes||'')+'</textarea></div>';
  html+='</div>';

  html+='<button class="btn btn-primary btn-block mb-2" onclick="saveSleepEntry()">💾 '+(isNew?'Сохранить':'Обновить')+'</button>';
  if(!isNew)html+='<button class="btn btn-danger btn-block" onclick="deleteSleepEntry(\''+date+'\')">🗑 Удалить</button>';

  html+='</div>';
  document.getElementById('app').innerHTML=html;
  /* Восстановим выделенные чипы */
  _applySleepChips(e);
}
window.renderSleepEditor=renderSleepEditor;

function _applySleepChips(e){
  setTimeout(function(){
    (e.disruptions||[]).forEach(function(id){
      var b=document.querySelector('[data-disruption="'+id+'"]');if(b)b.classList.add('active');
    });
    (e.improvements||[]).forEach(function(id){
      var b=document.querySelector('[data-improvement="'+id+'"]');if(b)b.classList.add('active');
    });
    (e.daytimeEffects||[]).forEach(function(id){
      var b=document.querySelector('[data-effect="'+id+'"]');if(b)b.classList.add('active');
    });
    (e.daytimeFactors||[]).forEach(function(id){
      var b=document.querySelector('[data-factor="'+id+'"]');if(b)b.classList.add('active');
    });
    (e.resetFactors||[]).forEach(function(id){
      var b=document.querySelector('[data-reset="'+id+'"]');if(b)b.classList.add('active');
    });
  },30);
}

function toggleSleepChip(btn,kind){
  btn.classList.toggle('active');
  var isActive=btn.classList.contains('active');
  if(isActive)btn.classList.remove('btn-ghost');
  else btn.classList.add('btn-ghost');
}

function _collectSleepChips(kind){
  var attr='data-'+kind;
  var arr=[];
  document.querySelectorAll('['+attr+']').forEach(function(b){
    if(b.classList.contains('active'))arr.push(b.getAttribute(attr));
  });
  return arr;
}

function saveSleepEntry(){
  var date=(document.getElementById('sl-date')||{}).value||today();
  var type=(document.getElementById('sl-type')||{}).value||'night';
  var start=(document.getElementById('sl-start')||{}).value||'23:00';
  var end=(document.getElementById('sl-end')||{}).value||'07:00';
  var hours=calcSleepHours(start,end);
  var quality=parseInt((document.getElementById('sl-quality-value')||{}).value)||7;
  var awakenings=parseInt((document.getElementById('sl-awaken')||{}).value)||0;
  var notes=(document.getElementById('sl-notes')||{}).value||'';

  var entry={
    id:(getSleepEntryForDate(date)||{}).id||uid(),
    date:date,
    type:type,
    start:start,
    end:end,
    hours:hours,
    quality:quality,
    awakenings:awakenings,
    notes:notes,
    disruptions:_collectSleepChips('disruption'),
    improvements:_collectSleepChips('improvement'),
    daytimeEffects:_collectSleepChips('effect'),
    daytimeFactors:_collectSleepChips('factor'),
    resetFactors:_collectSleepChips('reset'),
    createdAt:nowISO()
  };

  if(!state.sleepEntries)state.sleepEntries=[];
  var idx=state.sleepEntries.findIndex(function(s){return s.date===date});
  if(idx>=0)state.sleepEntries[idx]=entry;
  else state.sleepEntries.push(entry);
  state.xp=(state.xp||0)+5;
  save();haptic('success');
  toast('✓ Сон записан: '+hours+' ч','success');
  currentSleepDate=null;
  navigate('sleep');
}
window.saveSleepEntry=saveSleepEntry;

function deleteSleepEntry(date){
  if(!confirm('Удалить запись сна за '+date+'?'))return;
  state.sleepEntries=state.sleepEntries.filter(function(s){return s.date!==date});
  save();toast('Удалено','info');
  currentSleepDate=null;
  navigate('sleep');
}
window.deleteSleepEntry=deleteSleepEntry;

/* Быстрая запись через sheet */
function openSleepQuickAdd(){
  var html='<div class="field"><label class="field-label">Дата</label><input type="date" id="qsl-date" value="'+today()+'"/></div>';
  html+='<div class="row" style="gap:8px;">';
  html+='<div style="flex:1;"><label class="field-label">Лёг</label><input type="time" id="qsl-start" value="23:00"/></div>';
  html+='<div style="flex:1;"><label class="field-label">Встал</label><input type="time" id="qsl-end" value="07:00"/></div>';
  html+='</div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="quickSaveSleep()">💾 Сохранить</button>';
  openSheet('Быстрая запись сна',html);
}
window.openSleepQuickAdd=openSleepQuickAdd;

function quickSaveSleep(){
  var date=(document.getElementById('qsl-date')||{}).value||today();
  var start=(document.getElementById('qsl-start')||{}).value||'23:00';
  var end=(document.getElementById('qsl-end')||{}).value||'07:00';
  var hours=calcSleepHours(start,end);
  var entry={
    id:uid(),date:date,type:'night',
    start:start,end:end,hours:hours,
    quality:7,awakenings:0,notes:'',
    disruptions:[],improvements:[],daytimeEffects:[],daytimeFactors:[],resetFactors:[],
    createdAt:nowISO()
  };
  if(!state.sleepEntries)state.sleepEntries=[];
  var idx=state.sleepEntries.findIndex(function(s){return s.date===date});
  if(idx>=0)state.sleepEntries[idx]=entry;
  else state.sleepEntries.push(entry);
  state.xp=(state.xp||0)+5;
  save();haptic('success');
  toast('✓ '+hours+' ч','success');
  closeSheet();
  renderSleep();
}
window.quickSaveSleep=quickSaveSleep;

console.log('[APP v43 4/8] ✅ Sleep: calendar, editor, stats');
/* ============================================================
   LIFE OS — APP.js v43
   ЧАСТЬ 5/8: ИГРЫ, МАТЕРИАЛЫ, ЗАДАЧИ v2
   ============================================================ */

/* ============================================================
   ОБУЧАЮЩИЕ ИГРЫ
   ============================================================ */

function renderLearningGames(){
  var games=window.LEARNING_GAMES||[];
  var html='<div class="page">';
  html+='<div class="title-xl">🎮 Игры</div>';
  html+='<div class="card card-gradient">';
  html+='<div style="opacity:.9;font-size:12px;">Обучающие игры</div>';
  html+='<div style="font-size:32px;font-weight:800;">'+games.length+' игр</div>';
  html+='<div style="opacity:.9;font-size:12px;margin-top:6px;">Программирование, языки, науки, логика, финансы</div>';
  html+='</div>';

  var cats=['it','lang','math','physics','chemistry','biology','astro','history','logic','finance','health','etiquette'];
  html+='<div class="quick-tabs">';
  html+='<button class="quick-tab '+(gameCatFilter==='all'?'active':'')+'" onclick="gameCatFilter=\'all\';renderLearningGames()">Все ('+games.length+')</button>';
  cats.forEach(function(c){
    var cnt=games.filter(function(g){return g.cat===c}).length;
    if(!cnt)return;
    html+='<button class="quick-tab '+(gameCatFilter===c?'active':'')+'" onclick="gameCatFilter=\''+c+'\';renderLearningGames()">'+c+' ('+cnt+')</button>';
  });
  html+='</div>';

  var filtered=gameCatFilter==='all'?games:games.filter(function(g){return g.cat===gameCatFilter});
  filtered.forEach(function(g){
    var prog=state.gameProgress&&state.gameProgress[g.id];
    html+='<div class="method-card" onclick="startLearningGame(\''+g.id+'\')">';
    html+='<div class="method-header">';
    html+='<div class="method-emoji">'+g.emoji+'</div>';
    html+='<div style="flex:1;min-width:0;">';
    html+='<div class="method-title">'+esc(g.title)+'</div>';
    html+='<div class="method-cat">'+esc(g.desc||'')+' · ⏱ '+g.duration+'с · +'+g.xp+' XP</div>';
    html+='</div>';
    html+='<div class="list-chevron">▶</div>';
    html+='</div>';
    if(prog)html+='<div class="footnote text-tertiary" style="margin-top:6px;">Игр: '+prog.plays+' · Лучший: '+prog.best+'</div>';
    html+='</div>';
  });

  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderLearningGames=renderLearningGames;

function startLearningGame(id){
  var g=(window.LEARNING_GAMES||[]).find(function(x){return x.id===id});if(!g)return;
  var html='<div style="text-align:center;margin-bottom:16px;">';
  html+='<div style="font-size:56px;">'+g.emoji+'</div>';
  html+='<div style="font-size:22px;font-weight:800;">'+esc(g.title)+'</div>';
  html+='<div class="footnote text-secondary">'+esc(g.desc||'')+'</div>';
  html+='</div>';
  html+='<div class="card"><h2>📋 Правила</h2>';
  html+='<div class="footnote text-secondary">Игра будет доступна в следующих версиях. Пока — введи результат вручную.</div>';
  html+='</div>';
  html+='<div class="card"><h2>Результат</h2>';
  html+='<div class="field"><label class="field-label">Очки</label><input type="number" id="lg-score" value="50" min="0"/></div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="finishLearningGame(\''+g.id+'\')">✓ Записать (+'+g.xp+' XP)</button>';
  html+='</div>';
  openSheet(g.title,html);
}
window.startLearningGame=startLearningGame;

function finishLearningGame(id){
  var g=(window.LEARNING_GAMES||[]).find(function(x){return x.id===id});if(!g)return;
  var score=parseInt((document.getElementById('lg-score')||{}).value)||0;
  if(!state.gameProgress)state.gameProgress={};
  if(!state.gameProgress[id])state.gameProgress[id]={plays:0,best:0,lastPlayed:null};
  var p=state.gameProgress[id];
  p.plays++;
  if(score>p.best)p.best=score;
  p.lastPlayed=nowISO();
  state.xp=(state.xp||0)+g.xp;
  save();haptic('success');toast('✓ +'+g.xp+' XP','success');
  closeSheet();renderLearningGames();
}
window.finishLearningGame=finishLearningGame;

function renderGamePlay(){renderLearningGames()}
window.renderGamePlay=renderGamePlay;

/* ============================================================
   МАТЕРИАЛЫ
   ============================================================ */

function renderMaterials(){
  var mats=window.LEARNING_MATERIALS||[];
  var html='<div class="page">';
  html+='<div class="title-xl">📚 Материалы</div>';
  html+='<div class="card card-gradient">';
  html+='<div style="opacity:.9;font-size:12px;">Книги, курсы, видео, подкасты</div>';
  html+='<div style="font-size:32px;font-weight:800;">'+mats.length+' материалов</div>';
  html+='</div>';

  var cats=['book','course','video','podcast','article','tool'];
  html+='<div class="quick-tabs">';
  html+='<button class="quick-tab '+(matCatFilter==='all'?'active':'')+'" onclick="matCatFilter=\'all\';renderMaterials()">Все ('+mats.length+')</button>';
  cats.forEach(function(c){
    var cnt=mats.filter(function(m){return m.cat===c}).length;
    if(!cnt)return;
    html+='<button class="quick-tab '+(matCatFilter===c?'active':'')+'" onclick="matCatFilter=\''+c+'\';renderMaterials()">'+c+' ('+cnt+')</button>';
  });
  html+='</div>';

  var filtered=matCatFilter==='all'?mats:mats.filter(function(m){return m.cat===matCatFilter});
  filtered.forEach(function(m){
    var prog=state.materialsProgress&&state.materialsProgress[m.id];
    var status=prog?(prog.status||'planned'):'planned';
    var statusEmoji={planned:'📌',['in-progress']:'▶️',done:'✅'}[status]||'📌';
    html+='<div class="method-card" onclick="openMaterialDetail(\''+m.id+'\')">';
    html+='<div class="method-header">';
    html+='<div class="method-emoji">'+m.emoji+'</div>';
    html+='<div style="flex:1;min-width:0;">';
    html+='<div class="method-title">'+statusEmoji+' '+esc(m.title)+'</div>';
    html+='<div class="method-cat">'+esc(m.author||'')+' · '+esc(m.topic||'')+' · ⭐ '+m.rating+'/5</div>';
    html+='</div>';
    html+='<div class="list-chevron">›</div>';
    html+='</div>';
    if(m.desc)html+='<div class="method-desc">'+esc(m.desc)+'</div>';
    html+='</div>';
  });

  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderMaterials=renderMaterials;

function openMaterialDetail(id){
  var m=(window.LEARNING_MATERIALS||[]).find(function(x){return x.id===id});if(!m)return;
  var prog=state.materialsProgress&&state.materialsProgress[id];
  var status=prog?(prog.status||'planned'):'planned';
  var html='<div style="text-align:center;margin-bottom:16px;">';
  html+='<div style="font-size:48px;">'+m.emoji+'</div>';
  html+='<div style="font-size:20px;font-weight:800;">'+esc(m.title)+'</div>';
  html+='<div class="footnote text-secondary">'+esc(m.author||'')+' · ⭐ '+m.rating+'/5</div>';
  html+='</div>';
  if(m.desc)html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📖 О чём</div><div class="lesson-content">'+esc(m.desc)+'</div></div></div>';
  if(m.keyIdeas&&m.keyIdeas.length){
    html+='<div class="card"><div class="lesson-section practice"><div class="lesson-section-title">💎 Ключевые идеи</div><div class="lesson-content"><ul>';
    m.keyIdeas.forEach(function(k){html+='<li>'+esc(k)+'</li>'});
    html+='</ul></div></div></div>';
  }
  html+='<div class="card"><h2>Статус</h2>';
  html+='<div style="display:flex;gap:6px;flex-wrap:wrap;">';
  ['planned','in-progress','done'].forEach(function(s){
    var lbl={planned:'📌 Планирую',['in-progress']:'▶️ В процессе',done:'✅ Прочитано'}[s];
    var cls=status===s?'btn-primary':'btn-ghost';
    html+='<button class="btn '+cls+' btn-sm" onclick="setMaterialStatus(\''+id+'\',\''+s+'\')">'+lbl+'</button>';
  });
  html+='</div></div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="closeSheet()">Закрыть</button>';
  openSheet(m.title,html);
}
window.openMaterialDetail=openMaterialDetail;

function setMaterialStatus(id,status){
  if(!state.materialsProgress)state.materialsProgress={};
  if(!state.materialsProgress[id])state.materialsProgress[id]={status:'planned',progress:0,notes:''};
  state.materialsProgress[id].status=status;
  if(status==='done')state.materialsProgress[id].progress=100;
  save();toast('✓ '+status,'success');
  closeSheet();renderMaterials();
}
window.setMaterialStatus=setMaterialStatus;

function renderMaterialDetail(){renderMaterials()}
window.renderMaterialDetail=renderMaterialDetail;

/* ============================================================
   ЗАДАЧИ v2 — обновлённый редактор с чек-листом, цветами, матрицей
   ============================================================ */

/* Перезаписываем openEntityEditor для задач v2 */
var _origOpenEntityEditor=window.openEntityEditor;
function openEntityEditor(type,id){
  if(type==='task')return openTaskEditorV2(id);
  return _origOpenEntityEditor(type,id);
}
window.openEntityEditor=openEntityEditor;

function openTaskEditorV2(id){
  var t=id?state.tasks.find(function(x){return x.id===id}):null;
  var isNew=!t;
  if(isNew)t={checklist:[],priority:'medium',planned_time:30,color:'peacock'};

  var html='';
  /* Название + голос */
  html+='<div class="field"><label class="field-label">Название *</label><input type="text" id="ent-title" value="'+esc(t.title||'')+'"/></div>';
  html+='<div class="field"><label class="field-label">Описание</label><textarea id="ent-desc">'+esc(t.description||'')+'</textarea></div>';

  /* Приоритет + сложность */
  html+='<div class="row" style="gap:8px;">';
  html+='<div style="flex:1;"><label class="field-label">Приоритет</label><select id="ent-priority">';
  ['low','medium','high'].forEach(function(p){
    var lbl={low:'🟢 Низкий',medium:'🟡 Средний',high:'🔴 Высокий'}[p];
    html+='<option value="'+p+'"'+(t.priority===p?' selected':'')+'>'+lbl+'</option>';
  });
  html+='</select></div>';
  html+='<div style="flex:1;"><label class="field-label">Сложность</label><select id="ent-difficulty">';
  [1,2,3,4,5].forEach(function(d){
    html+='<option value="'+d+'"'+(t.difficulty===d?' selected':'')+'>'+'●'.repeat(d)+' '+d+'/5</option>';
  });
  html+='</select></div>';
  html+='</div>';

  /* Категория + минуты */
  html+='<div class="row" style="gap:8px;">';
  html+='<div style="flex:1;"><label class="field-label">Категория</label><input type="text" id="ent-category" value="'+esc(t.category||'Работа')+'"/></div>';
  html+='<div style="flex:1;"><label class="field-label">Мин</label><input type="number" id="ent-time" value="'+(t.planned_time||30)+'" min="0"/></div>';
  html+='</div>';

  /* Старт + Дедлайн */
  html+='<div class="row" style="gap:8px;">';
  html+='<div style="flex:1;"><label class="field-label">Старт</label><input type="datetime-local" id="ent-start" value="'+(t.start_date?t.start_date.slice(0,16):'')+'"/></div>';
  html+='<div style="flex:1;"><label class="field-label">Дедлайн</label><input type="datetime-local" id="ent-due" value="'+(t.due_date?t.due_date.slice(0,16):'')+'"/></div>';
  html+='</div>';

  /* Цвет */
  html+='<div class="field"><label class="field-label">Цвет</label><div style="display:grid;grid-template-columns:repeat(11,1fr);gap:6px;">';
  (window.TASK_COLORS||[]).forEach(function(c){
    var active=t.color===c.id;
    html+='<button type="button" data-task-color="'+c.id+'" onclick="pickTaskColor(\''+c.id+'\')" style="aspect-ratio:1;border-radius:50%;background:'+c.hex+';border:2px solid '+(active?'#fff':'transparent')+';cursor:pointer;'+(active?'box-shadow:0 0 0 2px var(--bg),0 0 0 4px #fff;':'')+'"></button>';
  });
  html+='</div><input type="hidden" id="ent-color" value="'+(t.color||'peacock')+'"/></div>';

  /* Чек-лист */
  var cl=t.checklist||[];
  html+='<div class="field"><label class="field-label">Чек-лист (подзадачи)</label>';
  html+='<div id="cl-list">';
  cl.forEach(function(item,i){
    html+='<div class="row" style="gap:6px;margin-bottom:6px;align-items:center;">';
    html+='<button type="button" class="task-checkbox '+(item.done?'checked':'')+'" onclick="toggleChecklistItem('+i+')" style="width:24px;height:24px;font-size:12px;flex-shrink:0;">'+(item.done?'✓':'')+'</button>';
    html+='<input type="text" value="'+esc(item.title)+'" onchange="updateChecklistItem('+i+',this.value)" style="flex:1;"/>';
    html+='<button type="button" class="btn btn-ghost btn-xs" onclick="removeChecklistItem('+i+')">🗑</button>';
    html+='</div>';
  });
  html+='</div>';
  html+='<button type="button" class="btn btn-ghost btn-sm mt-2" onclick="addChecklistItem()">+ Добавить подзадачу</button>';
  html+='</div>';

  /* Кнопки */
  html+='<button class="btn btn-primary btn-block mt-3" onclick="saveTaskV2('+(id?'\''+id+'\'':'null')+')">'+(isNew?'➕ Создать':'💾 Сохранить')+'</button>';
  if(!isNew)html+='<button class="btn btn-danger btn-block mt-2" onclick="deleteTaskV2(\''+id+'\')">🗑 Удалить</button>';

  openSheet(isNew?'Новая задача':'Задача',html);
}

/* Чек-лист — временное состояние в окне */
var _clBuffer=[];

/* Инициализация буфера при открытии — берём из задачи */
(function(){
  var _origOpen=openTaskEditorV2;
  openTaskEditorV2=function(id){
    var t=id?state.tasks.find(function(x){return x.id===id}):null;
    _clBuffer=(t&&t.checklist)?JSON.parse(JSON.stringify(t.checklist)):[];
    return _origOpen(id);
  };
})();

function addChecklistItem(){
  _clBuffer.push({title:'',done:false});
  rerenderChecklist();
}
window.addChecklistItem=addChecklistItem;

function removeChecklistItem(i){
  _clBuffer.splice(i,1);
  rerenderChecklist();
}
window.removeChecklistItem=removeChecklistItem;

function toggleChecklistItem(i){
  if(!_clBuffer[i])return;
  _clBuffer[i].done=!_clBuffer[i].done;
  rerenderChecklist();
}
window.toggleChecklistItem=toggleChecklistItem;

function updateChecklistItem(i,val){
  if(!_clBuffer[i])return;
  _clBuffer[i].title=val;
}
window.updateChecklistItem=updateChecklistItem;

function rerenderChecklist(){
  var box=document.getElementById('cl-list');if(!box)return;
  var html='';
  _clBuffer.forEach(function(item,i){
    html+='<div class="row" style="gap:6px;margin-bottom:6px;align-items:center;">';
    html+='<button type="button" class="task-checkbox '+(item.done?'checked':'')+'" onclick="toggleChecklistItem('+i+')" style="width:24px;height:24px;font-size:12px;flex-shrink:0;">'+(item.done?'✓':'')+'</button>';
    html+='<input type="text" value="'+esc(item.title)+'" onchange="updateChecklistItem('+i+',this.value)" style="flex:1;"/>';
    html+='<button type="button" class="btn btn-ghost btn-xs" onclick="removeChecklistItem('+i+')">🗑</button>';
    html+='</div>';
  });
  box.innerHTML=html;
}

function pickTaskColor(cid){
  var inp=document.getElementById('ent-color');if(inp)inp.value=cid;
  document.querySelectorAll('[data-task-color]').forEach(function(b){
    var isActive=b.getAttribute('data-task-color')===cid;
    b.style.border=isActive?'2px solid #fff':'2px solid transparent';
    b.style.boxShadow=isActive?'0 0 0 2px var(--bg), 0 0 0 4px #fff':'none';
  });
}
window.pickTaskColor=pickTaskColor;

function saveTaskV2(id){
  var title=(document.getElementById('ent-title')||{}).value||'';
  if(!title.trim())return toast('Введите название','error');
  var t=id?state.tasks.find(function(x){return x.id===id}):null;
  var isNew=!t;
  if(!t){t={id:uid(),created_at:nowISO()};state.tasks.unshift(t)}

  t.title=title.trim();
  t.description=(document.getElementById('ent-desc')||{}).value||'';
  t.priority=(document.getElementById('ent-priority')||{}).value||'medium';
  t.difficulty=parseInt((document.getElementById('ent-difficulty')||{}).value)||3;
  t.category=(document.getElementById('ent-category')||{}).value||'';
  t.planned_time=parseInt((document.getElementById('ent-time')||{}).value)||30;
  t.start_date=(document.getElementById('ent-start')||{}).value||null;
  t.due_date=(document.getElementById('ent-due')||{}).value||null;
  t.color=(document.getElementById('ent-color')||{}).value||'peacock';
  t.checklist=_clBuffer.slice();
  t.updated_at=nowISO();

  save();haptic('success');closeSheet();
  toast(isNew?'✓ Создано':'💾 Сохранено','success');
  checkAchievements();
  navigate(currentPage);
}
window.saveTaskV2=saveTaskV2;

function deleteTaskV2(id){
  if(!confirm('Удалить задачу?'))return;
  state.tasks=state.tasks.filter(function(x){return x.id!==id});
  save();closeSheet();toast('Удалено','info');navigate(currentPage);
}
window.deleteTaskV2=deleteTaskV2;

console.log('[APP v43 5/8] ✅ Games, Materials, Tasks v2');
/* ============================================================
   LIFE OS — APP.js v43
   ЧАСТЬ 6/8: НАСТРОЙКИ v2, ПРОФИЛЬ v2, УВЕДОМЛЕНИЯ, ЭКСПОРТ
   ============================================================ */

/* ============================================================
   НАСТРОЙКИ v2
   ============================================================ */

function renderSettingsV2(){
  var s=state.settingsV2||{};
  var html='<div class="page">';
  html+='<div class="title-xl">⚙️ Настройки v2</div>';

  /* Интерфейс */
  html+='<div class="card"><h2>🎨 Интерфейс</h2>';
  html+='<div class="row-between mb-2"><div class="list-title">Тема</div>';
  html+='<button class="btn btn-ghost btn-sm" onclick="openThemePicker()">Выбрать →</button></div>';

  html+='<div class="field"><label class="field-label">Размер текста</label><select id="set-textSize" onchange="saveSettingsV2()">';
  ['small','medium','large','xlarge'].forEach(function(v){
    var lbl={small:'Мелкий',medium:'Обычный',large:'Крупный',xlarge:'Очень крупный'}[v];
    html+='<option value="'+v+'"'+(s.textSize===v?' selected':'')+'>'+lbl+'</option>';
  });
  html+='</select></div>';

  html+='<div class="field"><label class="field-label">Масштаб</label><select id="set-scale" onchange="saveSettingsV2()">';
  ['80','90','100','110','120'].forEach(function(v){
    html+='<option value="'+v+'"'+(s.scale===v?' selected':'')+'>'+v+'%</option>';
  });
  html+='</select></div>';

  html+='<div class="row-between mb-2"><div class="list-title">Анимации</div>';
  html+='<button class="btn btn-ghost btn-sm" onclick="state.settingsV2.reducedMotion=!state.settingsV2.reducedMotion;save();applyUserSettings();renderSettingsV2()">'+(s.reducedMotion?'Выкл':'Вкл')+'</button></div>';

  html+='<div class="row-between mb-2"><div class="list-title">Эффекты темы</div>';
  html+='<button class="btn btn-ghost btn-sm" onclick="state.settings.effectsEnabled=!state.settings.effectsEnabled;save();startEffects();renderSettingsV2()">'+(state.settings.effectsEnabled?'Вкл':'Выкл')+'</button></div>';
  html+='</div>';

  /* Звук и вибрация */
  html+='<div class="card"><h2>🔊 Звук</h2>';
  html+='<div class="row-between mb-2"><div class="list-title">Звуки</div>';
  html+='<button class="btn btn-ghost btn-sm" onclick="state.settingsV2.sound=!state.settingsV2.sound;save();renderSettingsV2()">'+(s.sound?'Вкл':'Выкл')+'</button></div>';
  html+='<div class="field"><label class="field-label">Громкость</label><input type="range" min="0" max="1" step="0.1" value="'+(s.soundVolume||0.5)+'" oninput="state.settingsV2.soundVolume=parseFloat(this.value);save()"/></div>';
  html+='<div class="row-between mb-2"><div class="list-title">Вибрация</div>';
  html+='<button class="btn btn-ghost btn-sm" onclick="state.settingsV2.haptic=!state.settingsV2.haptic;save();renderSettingsV2()">'+(s.haptic?'Вкл':'Выкл')+'</button></div>';
  html+='</div>';

  /* Уведомления */
  html+='<div class="card"><h2>🔔 Уведомления</h2>';
  html+='<button class="btn btn-primary btn-block" onclick="navigate(\'notifications\')">Настроить уведомления</button>';
  html+='</div>';

  /* Данные */
  html+='<div class="card"><h2>🗄 Данные</h2>';
  html+='<button class="btn btn-primary btn-block mb-2" onclick="openExportPicker()">📤 Экспорт</button>';
  html+='<button class="btn btn-ghost btn-block mb-2" onclick="importDB()">📥 Импорт JSON</button>';
  html+='<button class="btn btn-danger btn-block" onclick="resetAllWithConfirm()">🗑 Полный сброс</button>';
  html+='</div>';

  html+='<div class="footnote text-tertiary" style="text-align:center;margin-top:20px;">Life OS v'+CURRENT_VERSION+'</div>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderSettingsV2=renderSettingsV2;

function saveSettingsV2(){
  var ts=(document.getElementById('set-textSize')||{}).value;
  var sc=(document.getElementById('set-scale')||{}).value;
  if(ts)state.settingsV2.textSize=ts;
  if(sc)state.settingsV2.scale=sc;
  state.settingsV2.updatedAt=nowISO();
  save();applyUserSettings();
  toast('✓ Сохранено','success');
}
window.saveSettingsV2=saveSettingsV2;

/* ============================================================
   ПРОФИЛЬ v2
   ============================================================ */

function renderProfileV2(){
  var p=state.profileV2||{};
  var calcBMI=function(){
    if(p.weight&&p.height){
      var h=p.height/100;
      return Math.round(p.weight/(h*h)*10)/10;
    }
    return null;
  };
  var bmi=calcBMI();
  var bmiCat=bmi?bmi<18.5?'Недостаток':bmi<25?'Норма':bmi<30?'Избыток':'Ожирение':'—';

  var html='<div class="page">';
  html+='<div class="title-xl">👤 Профиль v2</div>';

  html+='<div class="profile-hero">';
  html+='<div class="avatar-btn" onclick="pickEmoji()" style="width:96px;height:96px;margin:0 auto 12px;font-size:48px;">'+state.profile.emoji+'</div>';
  html+='<div style="font-size:22px;font-weight:800;">'+esc(state.profile.name||'Пользователь')+'</div>';
  html+='<div class="footnote text-secondary">Уровень '+Math.floor((state.xp||0)/100)+' · '+(state.xp||0)+' XP</div>';
  html+='</div>';

  /* Антропометрия */
  html+='<div class="card"><h2>📏 Данные</h2>';
  html+='<div class="row" style="gap:8px;">';
  html+='<div style="flex:1;"><label class="field-label">Возраст</label><input type="number" id="pv-age" value="'+(p.age||'')+'" onchange="saveProfileV2()"/></div>';
  html+='<div style="flex:1;"><label class="field-label">Пол</label><select id="pv-gender" onchange="saveProfileV2()"><option value="">—</option><option value="male"'+(p.gender==='male'?' selected':'')+'>М</option><option value="female"'+(p.gender==='female'?' selected':'')+'>Ж</option></select></div>';
  html+='</div>';
  html+='<div class="row" style="gap:8px;">';
  html+='<div style="flex:1;"><label class="field-label">Рост (см)</label><input type="number" id="pv-height" value="'+(p.height||'')+'" onchange="saveProfileV2()"/></div>';
  html+='<div style="flex:1;"><label class="field-label">Вес (кг)</label><input type="number" id="pv-weight" value="'+(p.weight||'')+'" step="0.1" onchange="saveProfileV2()"/></div>';
  html+='</div>';
  html+='<div class="row" style="gap:8px;">';
  html+='<div style="flex:1;"><label class="field-label">Активность</label><select id="pv-activity" onchange="saveProfileV2()">';
  var acts={sedentary:'Сидячий',light:'Лёгкая',moderate:'Средняя',active:'Активная',very_active:'Очень активная'};
  Object.keys(acts).forEach(function(k){
    html+='<option value="'+k+'"'+(p.activity===k?' selected':'')+'>'+acts[k]+'</option>';
  });
  html+='</select></div>';
  html+='<div style="flex:1;"><label class="field-label">Цель</label><select id="pv-goal" onchange="saveProfileV2()">';
  var goals={lose:'Похудеть',maintain:'Держать',gain:'Набрать'};
  Object.keys(goals).forEach(function(k){
    html+='<option value="'+k+'"'+(p.goal===k?' selected':'')+'>'+goals[k]+'</option>';
  });
  html+='</select></div>';
  html+='</div>';
  html+='</div>';

  /* Расчёты */
  if(bmi!==null){
    html+='<div class="card"><h2>📊 Расчёты</h2>';
    html+='<div class="stat-row"><span class="stat-row-label">ИМТ</span><span class="stat-row-value">'+bmi+' ('+bmiCat+')</span></div>';
    /* BMR (Mifflin-St Jeor) */
    if(p.age&&p.height&&p.weight&&p.gender){
      var bmr=0;
      if(p.gender==='male')bmr=10*p.weight+6.25*p.height-5*p.age+5;
      else bmr=10*p.weight+6.25*p.height-5*p.age-161;
      var mult={sedentary:1.2,light:1.375,moderate:1.55,active:1.725,very_active:1.9}[p.activity]||1.55;
      var tdee=Math.round(bmr*mult);
      html+='<div class="stat-row"><span class="stat-row-label">BMR (базовый обмен)</span><span class="stat-row-value">'+Math.round(bmr)+' ккал</span></div>';
      html+='<div class="stat-row"><span class="stat-row-label">TDEE (суточная норма)</span><span class="stat-row-value">'+tdee+' ккал</span></div>';
      if(p.goal==='lose')html+='<div class="stat-row"><span class="stat-row-label">Для похудения</span><span class="stat-row-value">'+(tdee-500)+' ккал</span></div>';
      if(p.goal==='gain')html+='<div class="stat-row"><span class="stat-row-label">Для набора</span><span class="stat-row-value">'+(tdee+300)+' ккал</span></div>';
    }
    html+='</div>';
  }

  /* Целевой вес */
  html+='<div class="card"><h2>🎯 Целевой вес</h2>';
  html+='<div class="row" style="gap:8px;">';
  html+='<div style="flex:1;"><label class="field-label">Цель (кг)</label><input type="number" id="pv-targetWeight" value="'+(p.targetWeight||'')+'" step="0.1" onchange="saveProfileV2()"/></div>';
  html+='<div style="flex:1;"><label class="field-label">Дата</label><input type="date" id="pv-targetDate" value="'+(p.targetDate||'')+'" onchange="saveProfileV2()"/></div>';
  html+='</div>';
  html+='</div>';

  /* Заметки */
  html+='<div class="card"><h2>📝 Медицинские заметки</h2>';
  html+='<textarea id="pv-notes" style="min-height:80px;" onchange="saveProfileV2()" placeholder="Аллергии, хронические, лекарства...">'+esc(p.medicalNotes||'')+'</textarea>';
  html+='</div>';

  html+='<button class="btn btn-primary btn-block mb-2" onclick="saveProfileV2()">💾 Сохранить</button>';
  html+='<button class="btn btn-ghost btn-block" onclick="navigate(\'profile\')">К старому профилю</button>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderProfileV2=renderProfileV2;

function saveProfileV2(){
  var p=state.profileV2;
  var g=function(id){return (document.getElementById(id)||{}).value};
  p.age=parseInt(g('pv-age'))||null;
  p.gender=g('pv-gender')||null;
  p.height=parseFloat(g('pv-height'))||null;
  p.weight=parseFloat(g('pv-weight'))||null;
  p.activity=g('pv-activity')||'moderate';
  p.goal=g('pv-goal')||'maintain';
  p.targetWeight=parseFloat(g('pv-targetWeight'))||null;
  p.targetDate=g('pv-targetDate')||null;
  p.medicalNotes=g('pv-notes')||'';
  p.updatedAt=nowISO();
  save();toast('✓ Профиль сохранён','success');
}
window.saveProfileV2=saveProfileV2;

/* ============================================================
   УВЕДОМЛЕНИЯ
   ============================================================ */

function renderNotifications(){
  var n=state.notifications||{};
  var s=n.settings||{};
  var html='<div class="page">';
  html+='<div class="title-xl">🔔 Уведомления</div>';

  /* Разрешение */
  html+='<div class="card">';
  html+='<div class="row-between mb-2"><div class="list-title">Разрешение браузера</div>';
  html+='<div class="badge '+(n.permission==='granted'?'badge-success':'')+'">'+(n.permission||'default')+'</div></div>';
  if(n.permission!=='granted'){
    html+='<button class="btn btn-primary btn-block" onclick="requestNotificationPermission()">Разрешить уведомления</button>';
    html+='<div class="footnote text-tertiary mt-2">В Telegram Mini App уведомления работают только когда приложение открыто</div>';
  }else{
    html+='<div class="footnote text-secondary">✓ Разрешение получено</div>';
  }
  html+='</div>';

  /* Общий тумблер */
  html+='<div class="card">';
  html+='<div class="row-between mb-2"><div class="list-title">Все уведомления</div>';
  html+='<button class="btn '+(s.enabled?'btn-primary':'btn-ghost')+' btn-sm" onclick="toggleNotifSetting(\'enabled\')">'+(s.enabled?'Вкл':'Выкл')+'</button></div>';
  html+='<div class="row-between mb-2"><div class="list-title">Звук</div>';
  html+='<button class="btn '+(s.sound?'btn-primary':'btn-ghost')+' btn-sm" onclick="toggleNotifSetting(\'sound\')">'+(s.sound?'Вкл':'Выкл')+'</button></div>';
  html+='<div class="row-between mb-2"><div class="list-title">Вибрация</div>';
  html+='<button class="btn '+(s.vibration?'btn-primary':'btn-ghost')+' btn-sm" onclick="toggleNotifSetting(\'vibration\')">'+(s.vibration?'Вкл':'Выкл')+'</button></div>';
  html+='</div>';

  /* Тихие часы */
  html+='<div class="card"><h2>🌙 Тихие часы</h2>';
  html+='<div class="row-between mb-2"><div class="list-title">Включить</div>';
  html+='<button class="btn '+(s.quietHours&&s.quietHours.enabled?'btn-primary':'btn-ghost')+' btn-sm" onclick="toggleQuietHours()">'+(s.quietHours&&s.quietHours.enabled?'Вкл':'Выкл')+'</button></div>';
  if(s.quietHours&&s.quietHours.enabled){
    html+='<div class="row" style="gap:8px;">';
    html+='<div style="flex:1;"><label class="field-label">С</label><input type="time" value="'+(s.quietHours.from||'23:00')+'" onchange="state.notifications.settings.quietHours.from=this.value;save()"/></div>';
    html+='<div style="flex:1;"><label class="field-label">До</label><input type="time" value="'+(s.quietHours.to||'07:00')+'" onchange="state.notifications.settings.quietHours.to=this.value;save()"/></div>';
    html+='</div>';
  }
  html+='</div>';

  /* Категории */
  html+='<div class="card"><h2>📋 Категории</h2>';
  var cats=[
    {id:'habitMorning',label:'🌅 Утренние привычки'},
    {id:'habitDay',label:'☀️ Дневные привычки'},
    {id:'habitEvening',label:'🌆 Вечерние привычки'},
    {id:'habitNight',label:'🌙 Ночные привычки'},
    {id:'water',label:'💧 Вода'},
    {id:'sleep',label:'😴 Сон'},
    {id:'tasks',label:'📋 Задачи'},
    {id:'eye',label:'👁 Зрение 20-20-20'},
    {id:'screen',label:'📱 Экран'},
    {id:'brain',label:'🧠 Тренировка ума'},
    {id:'stress',label:'🌬 Антистресс'},
    {id:'learn',label:'🎓 Обучение'},
    {id:'break',label:'☕ Перерывы'}
  ];
  cats.forEach(function(c){
    html+='<div class="row-between mb-2"><div class="list-title">'+c.label+'</div>';
    html+='<button class="btn '+(s[c.id]?'btn-primary':'btn-ghost')+' btn-sm" onclick="toggleNotifSetting(\''+c.id+'\')">'+(s[c.id]?'Вкл':'Выкл')+'</button></div>';
  });
  html+='</div>';

  /* Тест */
  html+='<button class="btn btn-primary btn-block" onclick="testNotification()">🔔 Тестовое уведомление</button>';

  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderNotifications=renderNotifications;

function requestNotificationPermission(){
  if(!('Notification' in window)){
    toast('Браузер не поддерживает уведомления','error');
    return;
  }
  Notification.requestPermission().then(function(perm){
    state.notifications.permission=perm;
    save();
    if(perm==='granted')toast('✓ Разрешено','success');
    else toast('Отказано','warning');
    renderNotifications();
  });
}
window.requestNotificationPermission=requestNotificationPermission;

function toggleNotifSetting(key){
  if(!state.notifications.settings)state.notifications.settings={};
  state.notifications.settings[key]=!state.notifications.settings[key];
  save();renderNotifications();
}
window.toggleNotifSetting=toggleNotifSetting;

function toggleQuietHours(){
  if(!state.notifications.settings.quietHours)state.notifications.settings.quietHours={enabled:true,from:'23:00',to:'07:00'};
  state.notifications.settings.quietHours.enabled=!state.notifications.settings.quietHours.enabled;
  save();renderNotifications();
}
window.toggleQuietHours=toggleQuietHours;

function testNotification(){
  if(state.notifications.permission!=='granted'){
    toast('Сначала разреши уведомления','warning');
    return;
  }
  try{
    new Notification('Life OS',{body:'Это тестовое уведомление 🎉',icon:'icon-192.png'});
    toast('✓ Уведомление отправлено','success');
  }catch(e){
    toast('Ошибка: '+e.message,'error');
  }
}
window.testNotification=testNotification;

/* ============================================================
   ЭКСПОРТ — выбор что экспортировать
   ============================================================ */

function openExportPicker(){
  var html='<div class="footnote text-secondary mb-3">Выбери, что экспортировать. Можно несколько.</div>';
  var groups=[
    {id:'all',label:'📦 Всё (полный JSON)',def:true},
    {id:'tasks',label:'✅ Задачи'},
    {id:'habits',label:'🔄 Привычки + история'},
    {id:'sleep',label:'😴 Сон'},
    {id:'brain',label:'🧠 Тренировка ума'},
    {id:'antistress',label:'🌬 Антистресс'},
    {id:'screen',label:'📱 Экран'},
    {id:'health',label:'❤️ Здоровье (вода, настроение, тренировки)'},
    {id:'learning',label:'🎓 Обучение (все курсы, English, навыки)'},
    {id:'journal',label:'📓 Дневник + заметки'},
    {id:'profile',label:'👤 Профиль + настройки'}
  ];
  groups.forEach(function(g){
    html+='<label class="list-row" style="cursor:pointer;margin-bottom:6px;"><input type="checkbox" data-export="'+g.id+'" '+(g.id==='all'?'checked':'')+' style="width:20px;height:20px;margin-right:10px;"/><div class="list-body"><div class="list-title">'+g.label+'</div></div></label>';
  });
  html+='<button class="btn btn-primary btn-block mt-3" onclick="doExport()">📤 Скачать JSON</button>';
  openSheet('Экспорт данных',html);
}
window.openExportPicker=openExportPicker;

function doExport(){
  var picked=[];
  document.querySelectorAll('[data-export]').forEach(function(cb){
    if(cb.checked)picked.push(cb.getAttribute('data-export'));
  });
  if(!picked.length){toast('Выбери хотя бы одно','warning');return}
  var data={};
  if(picked.indexOf('all')>=0){
    data=JSON.parse(JSON.stringify(state));
  }else{
    if(picked.indexOf('tasks')>=0)data.tasks=state.tasks;
    if(picked.indexOf('habits')>=0){data.habits=state.habits;data.habitHistory=state.habitHistory;data.habitStreaks=state.habitStreaks;data.habitGoals=state.habitGoals}
    if(picked.indexOf('sleep')>=0)data.sleepEntries=state.sleepEntries;
    if(picked.indexOf('brain')>=0){data.brainPlays=state.brainPlays;data.brainStats=state.brainStats;data.brainStreak=state.brainStreak}
    if(picked.indexOf('antistress')>=0){data.antistressEntries=state.antistressEntries;data.antistressStats=state.antistressStats}
    if(picked.indexOf('screen')>=0){data.screenEntries=state.screenEntries;data.screenStats=state.screenStats}
    if(picked.indexOf('health')>=0){data.customWater=state.customWater;data.customMood=state.customMood;data.customWorkouts=state.customWorkouts;data.customSleep=state.customSleep}
    if(picked.indexOf('learning')>=0){data.levelProgress=state.levelProgress;data.englishProgress=state.englishProgress;data.skillsProgress=state.skillsProgress;data.detoxCourseProgress=state.detoxCourseProgress}
    if(picked.indexOf('journal')>=0){data.journalEntries=state.journalEntries;data.customNotes=state.customNotes}
    if(picked.indexOf('profile')>=0){data.profile=state.profile;data.profileV2=state.profileV2;data.settings=state.settings;data.settingsV2=state.settingsV2}
  }
  data.__meta={exportedAt:nowISO(),version:CURRENT_VERSION,parts:picked};
  try{
    var blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    var url=URL.createObjectURL(blob);
    var a=document.createElement('a');
    a.href=url;a.download='life-os-'+today()+'.json';a.click();
    URL.revokeObjectURL(url);
    toast('📤 Экспорт готов','success');
    closeSheet();
  }catch(e){toast('Ошибка экспорта: '+e.message,'error')}
}
window.doExport=doExport;

console.log('[APP v43 6/8] ✅ Settings v2, Profile v2, Notifications, Export');
/* ============================================================
   LIFE OS — APP.js v43
   ЧАСТЬ 7/8: ЕДИНАЯ КАРТИНА — движок, snapshot, рекомендации
   ============================================================ */

/* ============================================================
   АВТО-ПЕРЕСЧЁТ СНИМКА
   ============================================================ */

/* Обновляет state.snapshot, state.recommendations, history */
function refreshSnapshot(){
  try{
    if(typeof buildUserSnapshot!=='function'){
      console.warn('[snapshot] buildUserSnapshot не найден');
      return null;
    }
    var snap=buildUserSnapshot(state);
    if(!snap)return null;
    state.snapshot=snap;
    state.recommendations=snap.recommendations||[];
    state.lastSnapshotAt=nowISO();
    /* История — раз в день */
    if(!state.snapshotHistory)state.snapshotHistory=[];
    var t=today();
    var last=state.snapshotHistory[state.snapshotHistory.length-1];
    if(!last||last.date!==t){
      state.snapshotHistory.push({
        date:t,
        xp:state.xp||0,
        streak:state.stats.streak||0,
        habitsDone:snap.habits.completedToday,
        tasksDone:snap.tasks.completedToday,
        sleep:snap.sleep.lastNight?snap.sleep.lastNight.hours:null,
        screen:snap.screen.today,
        mood:snap.mood.today
      });
      if(state.snapshotHistory.length>90)state.snapshotHistory=state.snapshotHistory.slice(-90);
    }
    save();
    return snap;
  }catch(e){
    console.error('[refreshSnapshot]',e);
    return null;
  }
}
window.refreshSnapshot=refreshSnapshot;

/* Авто-вызов при загрузке и раз в 15 минут */
function startSnapshotTimer(){
  refreshSnapshot();
  setInterval(function(){try{refreshSnapshot()}catch(e){}},15*60*1000);
}
window.startSnapshotTimer=startSnapshotTimer;

/* ============================================================
   РЕНДЕР: SNAPSHOT
   ============================================================ */

function renderSnapshot(){
  var snap=state.snapshot;
  if(!snap)snap=refreshSnapshot();
  if(!snap){
    document.getElementById('app').innerHTML='<div class="page"><div class="title-xl">🌐 Единая картина</div><div class="card"><div class="empty"><div class="empty-icon">⏳</div><div class="empty-title">Считаем...</div></div></div></div>';
    return;
  }

  var html='<div class="page">';
  html+='<div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">🌐 Единая картина</div>';
  html+='<button class="btn btn-ghost btn-sm" onclick="refreshSnapshot();renderSnapshot()">🔄</button></div>';

  /* Общий балл дня */
  var score=calcDayScore(snap);
  html+='<div class="card card-gradient">';
  html+='<div style="opacity:.9;font-size:12px;">Общий балл дня</div>';
  html+='<div style="font-size:56px;font-weight:800;line-height:1;">'+score.value+'</div>';
  html+='<div style="opacity:.95;font-size:14px;margin-top:6px;">'+score.label+'</div>';
  html+='<div class="progress" style="margin-top:10px;background:rgba(255,255,255,.25);height:6px;"><div class="progress-fill" style="width:'+score.value+'%;background:#fff;"></div></div>';
  html+='</div>';

  /* Ключевые метрики */
  html+='<div class="stat-grid mb-4">';
  html+='<div class="stat-item"><div class="stat-value">'+snap.habits.completedToday+'/'+snap.habits.total+'</div><div class="stat-label">Привычки</div></div>';
  html+='<div class="stat-item"><div class="stat-value">'+(snap.sleep.lastNight?snap.sleep.lastNight.hours+'ч':'—')+'</div><div class="stat-label">Сон</div></div>';
  html+='<div class="stat-item"><div class="stat-value">'+(snap.screen.today?Math.round(snap.screen.today/60)+'ч':'0ч')+'</div><div class="stat-label">Экран</div></div>';
  html+='</div>';

  /* Все домены */
  html+='<div class="card"><h2>📊 По доменам</h2>';
  html+=snapshotBar('🔄 Привычки',snap.habits.total?Math.round(snap.habits.completedToday/snap.habits.total*100):0,'var(--brand)');
  html+=snapshotBar('😴 Сон',snap.sleep.avg7?Math.min(100,Math.round(snap.sleep.avg7/8*100)):0,'#4dd4ff');
  html+=snapshotBar('📱 Экран',snap.screen.today?Math.max(0,100-Math.min(100,snap.screen.today/420*100)):100,'#ff88cc');
  html+=snapshotBar('✅ Задачи',snap.tasks.pending+snap.tasks.completedToday?Math.round(snap.tasks.completedToday/(snap.tasks.pending+snap.tasks.completedToday)*100):0,'#3ddc97');
  html+=snapshotBar('💧 Вода',snap.water.goal?Math.min(100,Math.round(snap.water.today/snap.water.goal*100)):0,'#4dd4ff');
  html+=snapshotBar('❤️ Настроение',snap.mood.today?snap.mood.today*10:0,'#ff6b6b');
  html+=snapshotBar('🏋️ Тренировки',Math.min(100,snap.workouts.last7*25),'#ffa940');
  html+=snapshotBar('🧠 Ум',Math.min(100,snap.brain.todayPlays*20),'#b394ff');
  html+=snapshotBar('🌬 Антистресс',Math.min(100,snap.antistress.todayCount*25),'#7bc043');
  html+=snapshotBar('🎓 Обучение',Math.min(100,(snap.learning.lessonsDone+snap.learning.englishDone+snap.learning.skillsDone)*5),'#5b9eff');
  html+='</div>';

  /* Рекомендации */
  if(snap.recommendations&&snap.recommendations.length){
    html+='<div class="card"><h2>💡 Рекомендации</h2>';
    snap.recommendations.forEach(function(r){
      var prColor=r.priority===1?'var(--danger)':r.priority===2?'var(--warning)':'var(--brand)';
      html+='<div style="display:flex;gap:10px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--divider);">';
      html+='<div style="font-size:22px;flex-shrink:0;">'+r.emoji+'</div>';
      html+='<div style="flex:1;"><div style="font-weight:700;font-size:13px;margin-bottom:2px;">'+esc(r.title)+'</div>';
      html+='<div class="footnote text-secondary">'+esc(r.text)+'</div>';
      if(r.action)html+='<button class="btn btn-ghost btn-xs mt-2" onclick="navigate(\''+r.action+'\')">Перейти →</button>';
      html+='</div>';
      html+='<div style="width:4px;height:36px;border-radius:2px;background:'+prColor+';flex-shrink:0;"></div>';
      html+='</div>';
    });
    html+='</div>';
  }

  /* История за 30 дней */
  if(state.snapshotHistory&&state.snapshotHistory.length>1){
    html+='<div class="card"><h2>📈 Динамика</h2>';
    var hist=state.snapshotHistory.slice(-30);
    var maxScore=0;
    var points=hist.map(function(h){
      var s=calcDayScoreFromHistory(h);
      if(s>maxScore)maxScore=s;
      return s;
    });
    maxScore=Math.max(maxScore,10);
    html+='<div style="display:flex;gap:2px;align-items:flex-end;height:80px;padding:6px 0;">';
    points.forEach(function(p,i){
      var pct=p/maxScore*100;
      html+='<div style="flex:1;height:'+Math.max(4,pct)+'%;background:var(--brand);border-radius:3px 3px 0 0;opacity:'+(0.4+i/points.length*0.6)+';"></div>';
    });
    html+='</div>';
    html+='<div class="footnote text-tertiary" style="text-align:center;margin-top:6px;">'+hist.length+' дней</div>';
    html+='</div>';
  }

  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderSnapshot=renderSnapshot;

function snapshotBar(label,value,color){
  value=Math.max(0,Math.min(100,value||0));
  return '<div style="margin-bottom:10px;">'+
    '<div class="row-between" style="font-size:12px;font-weight:700;margin-bottom:4px;"><span>'+label+'</span><span>'+value+'%</span></div>'+
    '<div class="progress"><div class="progress-fill" style="width:'+value+'%;background:'+color+';"></div></div>'+
  '</div>';
}

/* Общий балл дня из snapshot */
function calcDayScore(snap){
  if(!snap)return{value:0,label:'Нет данных'};
  var parts=[];
  /* Привычки — 25% */
  if(snap.habits.total)parts.push({w:25,v:snap.habits.completedToday/snap.habits.total*100});
  /* Сон — 20% */
  if(snap.sleep.lastNight)parts.push({w:20,v:Math.min(100,snap.sleep.lastNight.hours/8*100)});
  /* Экран — 15% (инверсия) */
  parts.push({w:15,v:Math.max(0,100-Math.min(100,snap.screen.today/420*100))});
  /* Настроение — 15% */
  if(snap.mood.today!==null)parts.push({w:15,v:snap.mood.today*10});
  /* Вода — 10% */
  parts.push({w:10,v:Math.min(100,snap.water.today/snap.water.goal*100)});
  /* Тренировка ума — 5% */
  parts.push({w:5,v:Math.min(100,snap.brain.todayPlays*20)});
  /* Антистресс — 5% */
  parts.push({w:5,v:Math.min(100,snap.antistress.todayCount*25)});
  /* Задачи — 5% */
  if(snap.tasks.pending+snap.tasks.completedToday)parts.push({w:5,v:snap.tasks.completedToday/(snap.tasks.pending+snap.tasks.completedToday)*100});

  var totalW=0,sum=0;
  parts.forEach(function(p){totalW+=p.w;sum+=p.w*p.v});
  var value=totalW?Math.round(sum/totalW):0;
  var label=value>=85?'🌟 Отличный день!':value>=70?'😊 Хороший день':value>=50?'🙂 Средний день':value>=30?'😐 Слабый день':'😔 Тяжёлый день';
  return{value:value,label:label};
}

function calcDayScoreFromHistory(h){
  var score=0,count=0;
  if(h.habitsDone!==undefined){score+=h.habitsDone*10;count++}
  if(h.sleep){score+=Math.min(100,h.sleep/8*100);count++}
  if(h.screen!==undefined){score+=Math.max(0,100-h.screen/420*100);count++}
  if(h.mood){score+=h.mood*10;count++}
  if(h.tasksDone){score+=Math.min(100,h.tasksDone*20);count++}
  return count?score/count:0;
}

/* ============================================================
   РЕНДЕР: РЕКОМЕНДАЦИИ (отдельная страница)
   ============================================================ */

function renderRecommendations(){
  var recs=state.recommendations||[];
  var html='<div class="page">';
  html+='<div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">💡 Рекомендации</div>';
  html+='<button class="btn btn-ghost btn-sm" onclick="refreshSnapshot();renderRecommendations()">🔄</button></div>';

  if(!recs.length){
    html+='<div class="card"><div class="empty"><div class="empty-icon">✨</div><div class="empty-title">Всё в балансе</div><div class="empty-text">Система не нашла проблем</div></div></div>';
  }else{
    recs.forEach(function(r){
      var prColor=r.priority===1?'var(--danger)':r.priority===2?'var(--warning)':'var(--brand)';
      html+='<div class="card" style="border-left:4px solid '+prColor+';">';
      html+='<div style="display:flex;gap:12px;align-items:flex-start;">';
      html+='<div style="font-size:32px;flex-shrink:0;">'+r.emoji+'</div>';
      html+='<div style="flex:1;">';
      html+='<div style="font-weight:800;font-size:15px;margin-bottom:4px;">'+esc(r.title)+'</div>';
      html+='<div class="footnote text-secondary" style="line-height:1.4;">'+esc(r.text)+'</div>';
      if(r.action)html+='<button class="btn btn-primary btn-sm mt-3" onclick="navigate(\''+r.action+'\')">Перейти →</button>';
      html+='</div></div></div>';
    });
  }

  html+='<div class="card"><h2>🎯 Как это работает</h2>';
  html+='<div class="footnote text-secondary">Система собирает все данные (привычки, сон, экран, настроение, воду, тренировки, обучение) и генерирует персональные рекомендации по приоритетам. Обновляется автоматически каждые 15 минут.</div>';
  html+='</div>';

  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderRecommendations=renderRecommendations;

/* ============================================================
   ДОБАВЛЯЕМ В MORE новые разделы
   ============================================================ */

/* Перезаписываем renderMore, добавляя группы новых модулей */
var _origRenderMore=window.renderMore;
function renderMore(){
  /* Пытаемся вызвать оригинал, но если он не готов — рисуем сами */
  var groups=[
    {title:'🎓 Обучение',items:[
      {key:'learning',emoji:'🎓',label:'Обучение'},
      {key:'levels',emoji:'🌱',label:'Уровни'},
      {key:'english',emoji:'🇬🇧',label:'English'},
      {key:'skills',emoji:'💎',label:'Навыки'},
      {key:'etiquette',emoji:'🎩',label:'Этикет'},
      {key:'hormones',emoji:'🧬',label:'Гормоны'},
      {key:'wealth',emoji:'💰',label:'Богатство'},
      {key:'games',emoji:'🎮',label:'Игры'},
      {key:'materials',emoji:'📚',label:'Материалы'}
    ]},
    {title:'🚀 Новые курсы',items:[]},
    {title:'💪 Тело и разум',items:[
      {key:'habits',emoji:'🔄',label:'Привычки'},
      {key:'habitCatalog',emoji:'📚',label:'Каталог привычек'},
      {key:'brain',emoji:'🧠',label:'Тренировка ума'},
      {key:'brainStats',emoji:'📊',label:'Статистика ума'},
      {key:'antistress',emoji:'🌬',label:'Антистресс'},
      {key:'sleep',emoji:'😴',label:'Сон'},
      {key:'sleepCalendar',emoji:'📅',label:'Календарь сна'}
    ]},
    {title:'🏥 Здоровье',items:[
      {key:'medical',emoji:'🏥',label:'Медицина'},
      {key:'health',emoji:'❤️',label:'Здоровье'},
      {key:'water',emoji:'💧',label:'Вода'},
      {key:'mood',emoji:'💭',label:'Настроение'},
      {key:'workouts',emoji:'🏋️',label:'Тренировки'},
      {key:'meditation',emoji:'🧘',label:'Медитации'},
      {key:'meds',emoji:'💊',label:'Лекарства'},
      {key:'recovery',emoji:'🌿',label:'Восстановление'},
      {key:'screentracker',emoji:'📱',label:'Экран'},
      {key:'detoxcourse',emoji:'📚',label:'Детокс 62 дня'}
    ]},
    {title:'📅 Планирование',items:[
      {key:'planning',emoji:'📅',label:'Планирование'},
      {key:'gcal',emoji:'📅',label:'Календарь'},
      {key:'matrix',emoji:'🔢',label:'Матрица'},
      {key:'stats',emoji:'📊',label:'Статистика'},
      {key:'detailedStats',emoji:'📈',label:'Детальная'},
      {key:'timer',emoji:'⏱',label:'Таймер'},
      {key:'focus',emoji:'🎯',label:'Фокус'},
      {key:'domains',emoji:'🌐',label:'Домены'},
      {key:'snapshot',emoji:'🌐',label:'Единая картина'},
      {key:'recommendations',emoji:'💡',label:'Рекомендации'}
    ]},
    {title:'👁 Зрение',items:[
      {key:'vision',emoji:'👁',label:'Зрение'},
      {key:'vision60',emoji:'🤸',label:'75 упражнений'},
      {key:'visiontrack',emoji:'📊',label:'Трекер'}
    ]},
    {title:'🎬 Досуг',items:[
      {key:'entertainment',emoji:'🎬',label:'Досуг'},
      {key:'resources',emoji:'🔗',label:'Ресурсы'},
      {key:'movies',emoji:'🎥',label:'Фильмы'},
      {key:'series',emoji:'📺',label:'Сериалы'},
      {key:'books',emoji:'📚',label:'Книги'}
    ]},
    {title:'🎯 Цели',items:[
      {key:'goals',emoji:'🎯',label:'Цели'},
      {key:'notes',emoji:'📝',label:'Заметки'},
      {key:'journal',emoji:'📓',label:'Дневник'}
    ]},
    {title:'⚙️ Система',items:[
      {key:'storage',emoji:'🗄',label:'Хранилище'},
      {key:'integrations',emoji:'🔗',label:'Интеграции'},
      {key:'settingsV2',emoji:'⚙️',label:'Настройки v2'},
      {key:'notifications',emoji:'🔔',label:'Уведомления'},
      {key:'settings',emoji:'⚙️',label:'Настройки'},
      {key:'profileV2',emoji:'👤',label:'Профиль v2'},
      {key:'profile',emoji:'👤',label:'Профиль'}
    ]}
  ];

  /* Авто-курсы */
  (window.ALL_NEW_COURSES||[]).forEach(function(c){
    groups[1].items.push({key:c.id,emoji:c.emoji,label:c.title});
  });

  var html='<div class="page"><div class="title-xl">Все разделы</div>';
  groups.forEach(function(g){
    if(!g.items.length)return;
    html+='<div class="card"><h2>'+g.title+'</h2>';
    g.items.forEach(function(it){
      html+='<div class="list-row" onclick="navigate(\''+it.key+'\')"><div class="list-icon">'+it.emoji+'</div><div class="list-body"><div class="list-title">'+it.label+'</div></div><div class="list-chevron">›</div></div>';
    });
    html+='</div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderMore=renderMore;

/* ============================================================
   ЗАПУСК АВТО-ОБНОВЛЕНИЯ
   ============================================================ */

/* Обновляем snapshot при каждом navigate на dashboard/snapshot */
var _origNavigate=window.navigate;
window.navigate=function(page,silent){
  if(page==='dashboard'||page==='snapshot'||page==='recommendations'){
    try{refreshSnapshot()}catch(e){}
  }
  return _origNavigate(page,silent);
};

console.log('[APP v43 7/8] ✅ Snapshot, Recommendations, More v2');
/* ============================================================
   LIFE OS — APP.js v43
   ЧАСТЬ 8/8: ФИНАЛ — init v2, миграция, авто-запуск
   ============================================================ */

/* ============================================================
   МИГРАЦИЯ v42 → v43 (дополняет migrateState)
   ============================================================ */

function migrateToV43(){
  try{
    /* Привычки */
    if(!Array.isArray(state.habits))state.habits=[];
    if(!state.habitHistory||typeof state.habitHistory!=='object')state.habitHistory={};
    if(!state.habitStreaks||typeof state.habitStreaks!=='object')state.habitStreaks={};
    if(!Array.isArray(state.habitGoals))state.habitGoals=[];

    /* Тренировка ума */
    if(!Array.isArray(state.brainPlays))state.brainPlays=[];
    if(!state.brainStats||typeof state.brainStats!=='object')state.brainStats={};
    if(typeof state.brainStreak!=='number')state.brainStreak=0;

    /* Антистресс */
    if(!Array.isArray(state.antistressEntries))state.antistressEntries=[];
    if(!state.antistressStats||typeof state.antistressStats!=='object')state.antistressStats={};

    /* Сон */
    if(!Array.isArray(state.sleepEntries))state.sleepEntries=[];

    /* Игры, материалы */
    if(!state.gameProgress||typeof state.gameProgress!=='object')state.gameProgress={};
    if(!state.materialsProgress||typeof state.materialsProgress!=='object')state.materialsProgress={};

    /* Уведомления */
    if(!state.notifications||typeof state.notifications!=='object'){
      state.notifications={
        enabled:false,
        permission:(typeof Notification!=='undefined')?Notification.permission:'default',
        settings:JSON.parse(JSON.stringify(window.NOTIFICATION_SETTINGS_DEFAULTS||{})),
        scheduled:[],
        history:[]
      };
    }else{
      if((typeof Notification!=='undefined')&&state.notifications.permission!==Notification.permission){
        state.notifications.permission=Notification.permission;
      }
    }

    /* Профиль v2 */
    if(!state.profileV2)state.profileV2={
      age:null,height:null,weight:null,gender:null,
      activity:'moderate',goal:'maintain',
      targetWeight:null,targetDate:null,
      restingHR:null,maxHR:null,medicalNotes:'',updatedAt:null
    };

    /* Настройки v2 */
    if(!state.settingsV2)state.settingsV2={
      textSize:'medium',scale:'100',
      sound:true,soundVolume:0.5,
      haptic:true,animations:true,
      animationsSpeed:'normal',
      language:'ru',firstDayOfWeek:'monday',
      timeFormat:'24h',dateFormat:'DD.MM.YYYY',
      darkMode:'auto',
      effectsEnabled:true,effectsIntensity:1,
      reducedMotion:false,updatedAt:null
    };

    /* Snapshot */
    if(!state.snapshotHistory)state.snapshotHistory=[];

    console.log('[MIGRATE v43] ✅ привычки='+state.habits.length+' ум='+state.brainPlays.length+' антистресс='+state.antistressEntries.length+' сон='+state.sleepEntries.length);
  }catch(e){
    console.error('[MIGRATE v43]',e);
  }
}

/* ============================================================
   ИНТЕГРАЦИЯ: автозапись привычек из других модулей
   ============================================================ */

/* Авто-отметка привычки, если есть интеграция
   (например, "вода 8 стаканов" — обновляется при addWater) */
function autoCompleteHabitsByIntegration(kind){
  if(!state.habits||!state.habits.length)return;
  var t=today();
  state.habits.forEach(function(h){
    if(!h.integration||h.integration!==kind)return;
    if(h.lastCompletedDate===t)return;
    /* Проверяем, выполнена ли цель */
    var ok=false;
    if(kind==='water'){
      var w=(state.customWater||[]).find(function(x){return x.date===t});
      var goal=h.targetCount||8;
      if(w&&w.count>=goal)ok=true;
    }
    if(kind==='workout'){
      var wo=(state.customWorkouts||[]).filter(function(x){return (x.date||'').slice(0,10)===t});
      var goal2=h.targetCount||1;
      if(wo.length>=goal2)ok=true;
    }
    if(kind==='screen'){
      var s=(state.screenStats||{})[t]||0;
      var limit=h.targetCount||120;
      if(s>0&&s<=limit)ok=true;
    }
    if(kind==='mood'){
      var m=(state.customMood||[]).find(function(x){return x.date===t});
      if(m)ok=true;
    }
    if(kind==='sleep'){
      var sl=getSleepEntryForDate(t);
      if(sl&&sl.hours>=7&&sl.hours<=9)ok=true;
    }
    if(ok){
      h.lastCompletedDate=t;
      h.streak=(h.streak||0)+1;
      if((h.streak||0)>(h.bestStreak||0))h.bestStreak=h.streak;
      if(!state.habitHistory[h.id])state.habitHistory[h.id]={};
      state.habitHistory[h.id][t]={completed:true,auto:true};
    }
  });
  save();
}
window.autoCompleteHabitsByIntegration=autoCompleteHabitsByIntegration;

/* ============================================================
   ИНТЕГРАЦИЯ: обновление snapshot при изменении данных
   ============================================================ */

/* Оборачиваем save, чтобы периодически обновлять snapshot */
var _origSave=window.save;
var _saveCounter=0;
window.save=function(){
  _origSave();
  _saveCounter++;
  /* Каждые 10 сохранений — обновляем snapshot */
  if(_saveCounter%10===0){
    try{refreshSnapshot()}catch(e){}
  }
};

/* ============================================================
   УВЕДОМЛЕНИЯ: планировщик (внутри приложения)
   ============================================================ */

var _notifInterval=null;
var _notifLastFired={};

function startNotificationScheduler(){
  if(_notifInterval)clearInterval(_notifInterval);
  _notifInterval=setInterval(function(){
    try{checkScheduledNotifications()}catch(e){}
  },60*1000); /* раз в минуту */
  console.log('[NOTIF] Планировщик запущен');
}
window.startNotificationScheduler=startNotificationScheduler;

function checkScheduledNotifications(){
  var n=state.notifications||{};
  if(!n.enabled)return;
  var s=n.settings||{};
  /* Тихие часы */
  if(s.quietHours&&s.quietHours.enabled){
    var now=new Date();
    var hm=pad(now.getHours())+':'+pad(now.getMinutes());
    var from=s.quietHours.from||'23:00';
    var to=s.quietHours.to||'07:00';
    var inQuiet=(from<=to)?(hm>=from&&hm<to):(hm>=from||hm<to);
    if(inQuiet)return;
  }
  var now=new Date();
  var hm=pad(now.getHours())+':'+pad(now.getMinutes());
  var t=today();

  /* Категории по времени */
  var rules=[
    {id:'habitMorning',time:'07:00',title:'Утренние привычки',body:'Пора выполнить утренние привычки'},
    {id:'water',time:'10:00',title:'Вода',body:'Выпей стакан воды'},
    {id:'brain',time:'11:00',title:'Тренировка ума',body:'5 минут игры — и мозг свежий'},
    {id:'water',time:'13:00',title:'Вода',body:'Выпей стакан воды'},
    {id:'stress',time:'14:00',title:'Дыхание',body:'Сделай 4-7-8. 2 минуты'},
    {id:'water',time:'16:00',title:'Вода',body:'Выпей стакан воды'},
    {id:'learn',time:'18:00',title:'Обучение',body:'15 минут обучения'},
    {id:'habitEvening',time:'19:00',title:'Вечерние привычки',body:'Вечерние привычки ждут'},
    {id:'tasks',time:'21:00',title:'Ревью дня',body:'Подведи итоги дня'},
    {id:'sleep',time:'22:30',title:'Скоро спать',body:'Ляг до 23:00'}
  ];

  rules.forEach(function(r){
    var key=r.id+'_'+r.time+'_'+t;
    if(_notifLastFired[key])return;
    if(!s[r.id])return;
    /* ±2 минуты */
    var rp=r.time.split(':');
    var rm=parseInt(rp[0])*60+parseInt(rp[1]);
    var nowm=now.getHours()*60+now.getMinutes();
    if(Math.abs(nowm-rm)<=2){
      fireLocalNotification(r.title,r.body);
      _notifLastFired[key]=true;
    }
  });
}

function fireLocalNotification(title,body){
  try{
    if(state.notifications.permission==='granted'&&typeof Notification!=='undefined'){
      new Notification(title,{body:body,icon:'icon-192.png'});
    }
  }catch(e){console.warn('[NOTIF fire]',e)}
  /* Внутренний тост */
  toast('🔔 '+title+': '+body,'info',4000);
  /* История */
  if(!state.notifications.history)state.notifications.history=[];
  state.notifications.history.push({title:title,body:body,time:nowISO()});
  if(state.notifications.history.length>100)state.notifications.history=state.notifications.history.slice(-100);
  save();
}
window.fireLocalNotification=fireLocalNotification;

/* ============================================================
   СТАРЫЕ РЕНДЕРЫ (совместимость — минимальные заглушки)
   ============================================================ */

/* Если какие-то рендеры из старого app.js не определены — ставим заглушки */
(function ensureRenderers(){
  var needed=[
    'renderTasks','renderMatrix','renderDailyPlan','renderLearning','renderLearnPlan',
    'renderLevels','renderLevelDetail','renderModuleDetail','renderSkills','renderMethods',
    'renderEnglish','renderMemory','renderIQ','renderEQ','renderFinance','renderNeuro',
    'renderPsychology','renderThinking','renderEtiquette','renderHormones','renderWealth',
    'renderPlanning','renderPlanToday','renderPlanWeek','renderPlanMonth','renderObsidian',
    'renderGcal','renderVision','renderVisionExercises','renderVisionTracker','renderVisionTips',
    'renderVision60','renderAI','renderHealth','renderWater','renderMood','renderWorkouts',
    'renderMeditation','renderMeds','renderRecovery','renderMedical','renderEntertainment',
    'renderResources','renderMovies','renderSeries','renderBooks','renderMusic','renderGames',
    'renderPodcasts','renderGoals','renderNotes','renderJournal','renderMore','renderStats',
    'renderDetailedStats','renderTimer','renderFocus','renderDomains','renderProfile',
    'renderSettings','renderIntegrations','renderStorage','renderScreenTracker',
    'renderDetoxCourse','renderDailySurvey','renderSurvey','renderPersonalPlan',
    'renderHabits','renderChallenges','renderWisdom'
  ];
  needed.forEach(function(name){
    if(typeof window[name]!=='function'){
      window[name]=function(){
        var app=document.getElementById('app');
        if(app)app.innerHTML='<div class="page"><div class="card"><div class="empty"><div class="empty-icon">🚧</div><div class="empty-title">'+name.replace('render','')+'</div><div class="empty-text">Раздел в разработке</div></div></div></div>';
      };
    }
  });
})();

/* ============================================================
   ФИНАЛЬНЫЙ INIT v2
   ============================================================ */

function initV2(){
  try{
    console.log('[INIT v2] Запуск Life OS v43');

    /* Миграция */
    migrateToV43();

    /* Тема + настройки */
    applyTheme(state.settings.theme);
    applyUserSettings();

    /* Профиль / welcome */
    if(!state.profile.name&&!state.settings.onboardingDone&&typeof showWelcome==='function'){
      showWelcome();
      return;
    }
    if(state.profile.name&&!state.settings.onboardingDone){
      state.settings.onboardingDone=true;save();
    }
    if(!state.profile.name&&window.__tgName){
      state.profile.name=window.__tgName;save();
    }
    updateHeader();

    /* Демо-задачи */
    if(!state.tasks.length){
      state.tasks=[
        {id:uid(),title:'Изучить Life OS',category:'Личное',planned_time:10,status:'pending',priority:'medium',created_at:nowISO()}
      ];
      save();
    }

    /* XP */
    if(!state.xp)state.xp=0;

    /* Tab bar */
    renderTabBar();

    /* Первый рендер */
    navigate('dashboard');

    /* Streak дня */
    var t=today();
    if(state.stats.lastActiveDay!==t){
      var y=new Date();y.setDate(y.getDate()-1);
      var wasYesterday=state.stats.lastActiveDay===y.toISOString().slice(0,10);
      state.stats.streak=wasYesterday?(state.stats.streak||0)+1:1;
      if(state.stats.streak>(state.stats.bestStreak||0))state.stats.bestStreak=state.stats.streak;
      state.stats.lastActiveDay=t;
      save();
    }

    /* Snapshot + авто-обновление */
    try{refreshSnapshot()}catch(e){console.warn('[init] snapshot',e)}
    startSnapshotTimer();

    /* Уведомления */
    startNotificationScheduler();

    /* Автосохранение */
    setInterval(function(){try{save()}catch(e){}},30000);

    /* Приветствие */
    console.log('[INIT v2 ✅] Всё готово. Привычки:',state.habits.length,'| Ум:',state.brainPlays.length,'| Антистресс:',state.antistressEntries.length,'| Сон:',state.sleepEntries.length);
    console.log('[INIT v2 ✅] BackButton:',!!(window.Telegram&&window.Telegram.WebApp&&window.Telegram.WebApp.BackButton));
    console.log('[INIT v2 ✅] Voice:',voiceSupported()?'✓':'✗');
  }catch(e){
    console.error('[INIT v2] Ошибка:',e);
    var app=document.getElementById('app');
    if(app)app.innerHTML='<div class="page"><div class="card"><div class="empty"><div class="empty-icon">⚠️</div><div class="empty-title">Ошибка запуска</div><div class="empty-text">'+esc(e.message||String(e))+'</div></div></div></div>';
  }
}

/* ============ ЗАПУСК ============ */
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',initV2);
}else{
  initV2();
}

/* ============ ФИНАЛЬНЫЙ ЛОГ ============ */
console.log('[APP v43 8/8] ✅ ФИНАЛ — Life OS v43 полностью загружен');
console.log('[APP v43] content.js + content2.js + app.js = '+
  ((window.THEMES||[]).length)+' тем, '+
  ((window.HABIT_TEMPLATES||[]).length)+' шаблонов привычек, '+
  ((window.BRAIN_TRAINING||[]).length)+' игр для ума, '+
  ((window.ANTISTRESS_PRACTICES||[]).length)+' практик антистресса, '+
  ((window.LEARNING_GAMES||[]).length)+' обучающих игр, '+
  ((window.LEARNING_MATERIALS||[]).length)+' материалов');