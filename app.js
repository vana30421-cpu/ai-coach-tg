'use strict';
/* ============================================================
   LIFE OS — APP.js v47 — ЧАСТЬ 1/4
   Ядро: IIFE, Telegram, Back Button, Utils, Голос, State,
   Миграция, Загрузка/Сохранение, Глобалы, Настройки,
   Эффекты, Темы, TabBar, Header, Navigation, Sheet, Picker
   ============================================================ */
(function(){

/* ============ КОНСТАНТЫ ============ */
var STORAGE_KEY = 'life_os_v45';
var STORAGE_BACKUP = 'life_os_backup_v45';
var CURRENT_VERSION = '53';
var LEGACY_KEYS = ['life_os_v44','life_os_v43','life_os_v40'];

/* ============ TELEGRAM ============ */
var tg = null;
try{
  tg = window.Telegram && window.Telegram.WebApp;
  if(tg){
    try{tg.expand()}catch(e){}
    try{tg.ready()}catch(e){}
    try{tg.setHeaderColor && tg.setHeaderColor('#000000')}catch(e){}
    try{tg.setBackgroundColor && tg.setBackgroundColor('#000000')}catch(e){}
    try{tg.disableVerticalSwipes && tg.disableVerticalSwipes()}catch(e){}
    var _u = tg.initDataUnsafe && tg.initDataUnsafe.user;
    if(_u && _u.first_name) window.__tgName = _u.first_name;
  }
}catch(e){}

/* ============ BACK BUTTON ============ */
var _backStack = [];
function tgBackButtonShow(){
  try{
    if(tg && tg.BackButton){
      tg.BackButton.show();
      if(!window.__bbBound){
        tg.BackButton.onClick(function(){ navigateBack(); });
        window.__bbBound = true;
      }
    }
  }catch(e){}
}
function tgBackButtonHide(){
  try{ if(tg && tg.BackButton) tg.BackButton.hide(); }catch(e){}
}
function navigateBack(){
  _backStack.pop();
  var prev = _backStack.pop();
  if(prev) navigate(prev, true);
  else navigate('dashboard', true);
}

/* ============ UTILS ============ */
function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }
function nowISO(){ return new Date().toISOString(); }
function today(){ return new Date().toISOString().slice(0,10); }
function yesterday(){
  var d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0,10);
}
function pad(n){ return String(n).padStart(2,'0'); }
function daysBetween(a,b){ return Math.floor((new Date(b) - new Date(a)) / (24*60*60*1000)); }
function esc(s){
  return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}
function getNowHHMM(){
  var d = new Date();
  return pad(d.getHours()) + ':' + pad(d.getMinutes());
}

/* ============ TOAST ============ */
function toast(msg, type, duration){
  type = type || 'info';
  duration = duration || 2500;
  var c = document.getElementById('toasts');
  if(!c) return;
  var el = document.createElement('div');
  el.className = 'toast ' + type;
  el.textContent = msg;
  c.appendChild(el);
  setTimeout(function(){
    el.style.opacity = '0';
    el.style.transform = 'translate(-50%,-16px)';
    el.style.transition = 'all .4s';
    setTimeout(function(){ el.remove(); }, 400);
  }, duration);
}

/* ============ HAPTIC ============ */
function haptic(type){
  try{
    if(state&&state.settingsV2&&state.settingsV2.haptic===false)return;
    var h = tg && tg.HapticFeedback;
    if(!h) return;
    if(type === 'success') h.notificationOccurred('success');
    else if(type === 'error') h.notificationOccurred('error');
    else if(type === 'warning') h.notificationOccurred('warning');
    else h.impactOccurred(type || 'light');
  }catch(e){}
}

/* ============ ГОЛОС ============ */
function voiceSupported(){
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}
function startVoiceFor(el, btn){
  try{
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SR){ toast('Голос не поддерживается','error'); return; }
    var rec = new SR();
    rec.lang = 'ru-RU';
    rec.interimResults = false;
    if(btn){ btn.style.background = 'var(--danger)'; btn.textContent = '⏺'; }
    rec.onresult = function(ev){
      var text = '';
      for(var i = ev.resultIndex; i < ev.results.length; i++) text += ev.results[i][0].transcript;
      if(text.trim()){
        var cur = el.value || '';
        var sep = cur && !/\s$/.test(cur) ? ' ' : '';
        el.value = cur + sep + text.trim();
        el.dispatchEvent(new Event('input',{bubbles:true}));
      }
    };
    rec.onerror = function(err){
      toast('Голос: ' + (err && err.error || 'ошибка'),'error');
      if(btn){ btn.style.background = 'var(--glass-3)'; btn.textContent = '🎤'; }
    };
    rec.onend = function(){
      if(btn){ btn.style.background = 'var(--glass-3)'; btn.textContent = '🎤'; }
    };
    rec.start();
    toast('🎤 Говорите...','info',1500);
  }catch(e){
    toast('Голос недоступен','error');
    if(btn){ btn.style.background = 'var(--glass-3)'; btn.textContent = '🎤'; }
  }
}
function attachVoice(inputId){
  if(!voiceSupported()) return;
  var el = document.getElementById(inputId);
  if(!el) return;
  if(el.dataset.voiceAttached === '1') return;
  el.dataset.voiceAttached = '1';
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'voice-btn';
  btn.textContent = '🎤';
  btn.style.cssText = 'position:absolute;right:8px;top:50%;transform:translateY(-50%);background:var(--glass-3);border:1px solid var(--glass-border);color:var(--text);width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:16px;display:grid;place-items:center;z-index:2;';
  var parent = el.parentNode;
  if(getComputedStyle(parent).position === 'static') parent.style.position = 'relative';
  parent.appendChild(btn);
  btn.addEventListener('click', function(e){ e.preventDefault(); startVoiceFor(el, btn); });
}
function attachVoiceAll(rootId){
  if(!voiceSupported()) return;
  var root = rootId ? document.getElementById(rootId) : document.body;
  if(!root) return;
  var nodes = root.querySelectorAll('input[type="text"],input[type="search"],input:not([type]),textarea');
  for(var i = 0; i < nodes.length; i++){
    var el = nodes[i];
    if(!el.id) el.id = 'voice_auto_' + i + '_' + Math.random().toString(36).slice(2,6);
    attachVoice(el.id);
  }
}

/* ============ DEFAULT STATE ============ */
function defaultState(){
  return {
    workspaces:{},
    /* Старое (совместимость с v44) */
    tasks:[],customHabits:[],customGoals:[],customNotes:[],journalEntries:[],
    customWater:[],customMood:[],customMeds:[],customMeditation:[],customWorkouts:[],
    timerSessions:[],focusSessions:[],chats:[],paths:[],courses:[],
    watchlist:[],watched:[],customResources:[],screenEntries:[],eyeExercises:[],
    calendarEvents:[],pendingGoogleEvents:[],customSleep:{},
    levelProgress:{},englishProgress:{},skillsProgress:{},
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

    /* v43: привычки, ум, антистресс, сон */
    habits:[],habitHistory:{},habitStreaks:{},habitGoals:[],
    brainPlays:[],brainStats:{},brainStreak:0,brainLastDay:null,
    antistressEntries:[],antistressStats:{},
    sleepEntries:[],
    gameProgress:{},materialsProgress:{},

    /* v44: Сферы, проекты, коуч, расписание */
    spheres:{ scores:{}, lastScores:{}, history:[] },
    projects:[],
    coach:{
      style:'balanced',
      strictness:5,
      settings:null,
      tipsHistory:[],
      lastTipDate:null,
      messages:[],
      digests:[],
      weeklyAnalytics:[]
    },
    schedule:{ times:{}, customEvents:[] },
    focus:{ active:null, history:[] },
    eveningReview:{ history:[] },
    weeklyReview:{ history:[] },
    notifications:{
      enabled:false,
      permission:'default',
      settings:null,
      scheduled:[],
      history:[],
      telegram:{enabled:false, morning:true, evening:true, weekly:true}
    },
    profileV2:{
      age:null,height:null,weight:null,gender:null,activity:'moderate',goal:'maintain',
      targetWeight:null,targetDate:null,restingHR:null,maxHR:null,medicalNotes:'',updatedAt:null
    },
    settingsV2:{
      textSize:'medium',scale:'100',sound:true,soundVolume:0.5,haptic:true,
      animations:true,animationsSpeed:'normal',language:'ru',firstDayOfWeek:'monday',
      timeFormat:'24h',dateFormat:'DD.MM.YYYY',darkMode:'auto',effectsEnabled:true,
      effectsIntensity:1,effectsMotionOverride:false,reducedMotion:false,updatedAt:null
    },
    snapshot:null,snapshotHistory:[],recommendations:[],lastSnapshotAt:null,

    /* Старое */
    todayPlan:null,learnPlan:{today:[],week:[],month:[]},personalPlan:null,
    medicalData:{metrics:[],entries:[],profile:{age:null,sex:null,weight:null,height:null,chronic:[]},recommendations:[]},
    xp:0,level:0,activeWorkMode:null,
    integrations:{
      obsidian:{apiKey:'',vault:'',lastSync:null,connected:false},
      gcal:{clientId:'',accessToken:null,refreshToken:null,expiresAt:null,lastSync:null,connected:false,autoSync:true},
      gemini:{apiKey:'',model:'gemini-1.5-flash',connected:false},
      telegram:{botToken:'',chatId:'',connected:false,lastSent:null}
    },
    profile:{
      name:'',emoji:'😊',createdAt:nowISO(),achievements:[],
      surveyAnswers:null,surveyStep:0,surveyDone:false,personalPlan:null,
      diagnostic:null
    },
    settings:{
      version:CURRENT_VERSION,theme:'dark',provider:'gemini',apiKey:'',
      activePersona:'coach',waterGoal:8,onboardingDone:false,
      effectsEnabled:true,effectsIntensity:1,effectsMotionOverride:false,
      lastDailySurveyDay:null,dailyLearnTarget:150,
      pwa:{installed:false,installedAt:null},
      notifications:{enabled:false,lastCheck:null},
      updatedAt:null
    },
    stats:{
      streak:0,lastActiveDay:null,totalDays:0,totalTasksDone:0,
      totalLessonsDone:0,totalWater:0,totalMoodLogs:0,totalWorkouts:0,
      totalMeditations:0,bestStreak:0
    },

    /* v46: ГЕЙМИФИКАЦИЯ */
    gamification:{
      xp:0,
      level:1,
      xpHistory:[],
      streak:{overall:0,habits:0,learning:0,vision:0,detox:0,games:0,best:0},
      achievements:[],
      sources:{habit:0,learning:0,vision:0,detox:0,games:0,review:0,return:0,sphere:0},
      settings:{showLevelUp:true,hapticOnXP:true,petEnabled:true},
      lastLevelUp:null,
      levelUpHistory:[]
    },

    /* v46: ПИТОМЕЦ */
    pet:{
      enabled:true,
      name:'Барсик',
      stage:1,
      xp:0,
      xpToNext:100,
      hunger:100,
      mood:'happy',
      lastFed:nowISO(),
      fedCount:0,
      evolvedAt:null
    },

    /* v46: ЛИГИ */
    leagues:{
      current:'bronze',
      weeklyXp:0,
      weekStart:today(),
      weekEnd:null,
      history:[],
      rewards:{
        bronze:{weeklyGoal:100,reward:50},
        silver:{weeklyGoal:250,reward:100},
        gold:{weeklyGoal:500,reward:200},
        platinum:{weeklyGoal:1000,reward:500},
        diamond:{weeklyGoal:2000,reward:1000}
      }
    },

    /* v46: FSRS-5 */
    fsrs:{
      cards:{},
      dueToday:[],
      reviews:[],
      stats:{totalCards:0,mature:0,young:0,new:0,avgStability:0,retention:0.9},
      settings:{targetRetention:0.9,maxInterval:365,newCardsPerDay:10}
    },

    /* v46: ИГРЫ */
    games:{
      scores:{},
      records:{},
      stats:{totalPlays:0,totalTime:0,avgScore:0,favoriteGame:null},
      achievements:[]
    },

    /* v46: ДЕТОКС */
    detox:{
      cooldown:{active:false,until:null,minutes:10,trigger:null},
      pause:{active:false,seconds:10,trigger:null,startedAt:null},
      sleepMode:{enabled:false,start:'22:00',end:'07:00',active:false,password:null,lockedAt:null},
      password:null,
      stats:{cooldownCount:0,pauseCount:0,sleepHours:0,screenMinutes:0,byApp:{}},
      triggers:[
        {id:'social',name:'Соцсети',cooldown:10},
        {id:'news',name:'Новости',cooldown:5},
        {id:'video',name:'Видео',cooldown:5}
      ],
      history:[]
    },

    /* v46: 60-дневное очищение */
    detox60Progress:{},

    /* v46: Свайпы привычек */
    habitSwipe:{
      enabled:true,
      sensitivity:'medium',
      hapticFeedback:true,
      actions:{right:'complete',left:'postpone',up:'edit',down:'delete'},
      history:[]
    },

    /* v46: Зрение — расширение */
    vision:{
      diagnostic:null,
      level:null,
      plan:null,
      metrics:{},
      reviews:[],
      triggers:[],
      wins:[],
      breakTracker:{today:{done:0,target:12,lastBreakAt:null},history:{}},
      hygieneChecklist:{},
      nutrition:{},
      exercises:{},
      redFlags:{active:false,triggeredAt:null,reasons:[],stoppedUntil:null},
      plans:{current:'general',byType:{}},
      audioGuide:{enabled:false,voice:'ru-RU',rate:0.9,currentProgram:null,completedPrograms:0},
      nightMode:{enabled:false,autoStart:'21:00',autoEnd:'07:00',brightness:0.5,warmth:0.7,active:false},
      focusMode:{active:false,workMinutes:25,breakMinutes:5,cycles:0,startedAt:null},
      eyeX45:{active:false,currentDay:1,startDate:null,completedDays:[],status:'not_started'},
      detox62:{
        active:false,
        startDate:null,
        currentDay:1,
        currentStage:1,
        status:'not_started',
        stages:[
          {id:1,name:'Разгрузка',days:[1,10],completedAt:null,review:null},
          {id:2,name:'Очищение',days:[11,20],completedAt:null,review:null},
          {id:3,name:'Восстановление',days:[21,31],completedAt:null,review:null},
          {id:4,name:'Углубление',days:[32,42],completedAt:null,review:null},
          {id:5,name:'Закрепление',days:[43,52],completedAt:null,review:null},
          {id:6,name:'Интеграция',days:[53,62],completedAt:null,review:null}
        ],
        dailyLog:{},
        stageReviews:[],
        skips:[],
        metrics:{avgScreenHours:0,avgEyeFatigue:0,avgClarity:0,avgSleep:0,avgPracticeMinutes:0,automatism:0}
      }
    }
  };
}

/* ============ БЭКАП / MERGE / МИГРАЦИЯ ============ */
function backupStorage(){
  try{
    var raw = localStorage.getItem(STORAGE_KEY);
    if(raw){ localStorage.setItem(STORAGE_BACKUP, raw); return true; }
  }catch(e){}
  return false;
}
function restoreFromBackup(){
  try{
    var b = localStorage.getItem(STORAGE_BACKUP);
    if(!b) return false;
    localStorage.setItem(STORAGE_KEY, b);
    return true;
  }catch(e){ return false; }
}
function deepMerge(target, source){
  if(!source || typeof source !== 'object') return target;
  if(Array.isArray(source)) return source.slice();
  Object.keys(source).forEach(function(k){
    if(source[k] && typeof source[k] === 'object' && !Array.isArray(source[k])){
      target[k] = deepMerge(target[k] || {}, source[k]);
    } else if(source[k] !== undefined){
      target[k] = source[k];
    }
  });
  return target;
}
function migrateState(data){
  if(!data || typeof data !== 'object') return data;
  var v = parseFloat((data.settings && data.settings.version) || '0');
  if(v < parseFloat(CURRENT_VERSION)){
    console.log('[MIGRATE] v' + v + ' → v' + CURRENT_VERSION);
    data = deepMerge(defaultState(), data);
    data.settings.version = CURRENT_VERSION;
  }
  if(!Array.isArray(data.habits)) data.habits = [];
  if(!data.habitHistory) data.habitHistory = {};
  if(!Array.isArray(data.brainPlays)) data.brainPlays = [];
  if(!Array.isArray(data.antistressEntries)) data.antistressEntries = [];
  if(!Array.isArray(data.sleepEntries)) data.sleepEntries = [];
  if(!data.profileV2) data.profileV2 = defaultState().profileV2;
  if(!data.settingsV2) data.settingsV2 = defaultState().settingsV2;
  if(!data.snapshotHistory) data.snapshotHistory = [];
  if(!data.notifications) data.notifications = defaultState().notifications;
  if(!data.spheres) data.spheres = {scores:{},lastScores:{},history:[]};
  if(!Array.isArray(data.projects)) data.projects = [];
  if(!data.workspaces || typeof data.workspaces !== 'object') data.workspaces = {};
  if(!data.coach) data.coach = defaultState().coach;
  if(!data.coach.digests) data.coach.digests = [];
  if(!data.coach.weeklyAnalytics) data.coach.weeklyAnalytics = [];
  if(!data.schedule) data.schedule = {times:{},customEvents:[]};
  if(!data.focus) data.focus = {active:null,history:[]};
  if(!data.eveningReview) data.eveningReview = {history:[]};
  if(!data.weeklyReview) data.weeklyReview = {history:[]};
  if(!data.gamification) data.gamification = defaultState().gamification;
  if(!data.pet) data.pet = defaultState().pet;
  if(!data.leagues) data.leagues = defaultState().leagues;
  if(!data.fsrs) data.fsrs = defaultState().fsrs;
  if(!data.games) data.games = defaultState().games;
  if(!data.detox) data.detox = defaultState().detox;
  if(!data.detox60Progress) data.detox60Progress = {};
  if(!data.habitSwipe) data.habitSwipe = defaultState().habitSwipe;
  if(!data.vision) data.vision = defaultState().vision;
  if(!data.vision.detox62) data.vision.detox62 = defaultState().vision.detox62;
  if(!data.integrations) data.integrations = defaultState().integrations;
  if(!data.integrations.telegram) data.integrations.telegram = {botToken:'',chatId:'',connected:false,lastSent:null};
  return data;
}

/* ============ ЗАГРУЗКА STATE ============ */
var state;
(function loadState(){
  try{
    backupStorage();
    var raw = localStorage.getItem(STORAGE_KEY);
    if(!raw){
      var oldRaw = null;
      for(var i = 0; i < LEGACY_KEYS.length; i++){
        oldRaw = localStorage.getItem(LEGACY_KEYS[i]);
        if(oldRaw) break;
      }
      if(oldRaw){
        console.log('[LOAD] миграция → v' + CURRENT_VERSION);
        state = deepMerge(defaultState(), JSON.parse(oldRaw));
        state.settings.version = CURRENT_VERSION;
        save();
      } else {
        state = defaultState();
        console.log('[LOAD] новый state v' + CURRENT_VERSION);
      }
    } else {
      var parsed = JSON.parse(raw);
      parsed = migrateState(parsed);
      state = deepMerge(defaultState(), parsed);
      console.log('[LOAD] ✓ state v' + state.settings.version);
    }
  }catch(e){
    console.error('[LOAD]', e);
    if(!restoreFromBackup()) state = defaultState();
    else {
      try{ state = deepMerge(defaultState(), JSON.parse(localStorage.getItem(STORAGE_KEY))); }
      catch(e2){ state = defaultState(); }
    }
  }
  /* Инициализируем настройки */
  try{
    if(!state.coach.settings && typeof COACH_SETTINGS_DEFAULTS !== 'undefined'){
      state.coach.settings = JSON.parse(JSON.stringify(COACH_SETTINGS_DEFAULTS));
    }
    if(!state.notifications.settings && typeof NOTIFICATION_SETTINGS_DEFAULTS !== 'undefined'){
      state.notifications.settings = JSON.parse(JSON.stringify(NOTIFICATION_SETTINGS_DEFAULTS));
    }
    if(!state.schedule.times || !Object.keys(state.schedule.times).length){
      if(typeof DEFAULT_DAY_SCHEDULE !== 'undefined'){
        state.schedule.times = JSON.parse(JSON.stringify(DEFAULT_DAY_SCHEDULE));
      }
    }
  }catch(e){}
})();

/* IndexedDB — расширенное хранилище и ротация резервных копий */
var LIFE_DB_NAME='life-os-vault',LIFE_DB_STORE='snapshots',_lifeDbPromise=null,_lifeDbTimer=null;
function openLifeVault(){
  if(!('indexedDB'in window))return Promise.reject(new Error('IndexedDB недоступен'));
  if(_lifeDbPromise)return _lifeDbPromise;
  _lifeDbPromise=new Promise(function(resolve,reject){
    var request=indexedDB.open(LIFE_DB_NAME,1);
    request.onupgradeneeded=function(){var db=request.result;if(!db.objectStoreNames.contains(LIFE_DB_STORE))db.createObjectStore(LIFE_DB_STORE,{keyPath:'id',autoIncrement:true});};
    request.onsuccess=function(){resolve(request.result);};
    request.onerror=function(){reject(request.error||new Error('Не удалось открыть IndexedDB'));};
  });
  return _lifeDbPromise;
}
function writeVaultSnapshot(serialized){
  return openLifeVault().then(function(db){return new Promise(function(resolve,reject){
    var tx=db.transaction(LIFE_DB_STORE,'readwrite'),store=tx.objectStore(LIFE_DB_STORE);
    store.add({savedAt:Date.now(),version:CURRENT_VERSION,data:serialized});
    tx.oncomplete=function(){
      var trim=db.transaction(LIFE_DB_STORE,'readwrite'),s=trim.objectStore(LIFE_DB_STORE),count=s.count();
      count.onsuccess=function(){var excess=count.result-12;if(excess>0){var cursor=s.openCursor();cursor.onsuccess=function(){var c=cursor.result;if(!c||excess<=0)return;c.delete();excess--;c.continue();};}};
      resolve(true);
    };
    tx.onerror=function(){reject(tx.error||new Error('Ошибка записи резервной копии'));};
  });});
}
function queueVaultSnapshot(serialized){
  clearTimeout(_lifeDbTimer);
  _lifeDbTimer=setTimeout(function(){writeVaultSnapshot(serialized).then(function(){window.__LIFE_OS_VAULT_READY=true;}).catch(function(e){console.warn('[VAULT]',e);});},900);
}
function getLatestVaultSnapshot(){
  return openLifeVault().then(function(db){return new Promise(function(resolve,reject){
    var tx=db.transaction(LIFE_DB_STORE,'readonly'),request=tx.objectStore(LIFE_DB_STORE).openCursor(null,'prev');
    request.onsuccess=function(){resolve(request.result?request.result.value:null);};
    request.onerror=function(){reject(request.error);};
  });});
}
function restoreVaultSnapshot(){
  getLatestVaultSnapshot().then(function(item){
    if(!item||!item.data)throw new Error('Резервных копий пока нет');
    var parsed=JSON.parse(item.data);if(!parsed||typeof parsed!=='object')throw new Error('Копия повреждена');
    localStorage.setItem(STORAGE_KEY,item.data);
    toast('Копия из расширенного хранилища восстановлена','success');
    setTimeout(function(){location.reload();},700);
  }).catch(function(e){toast(e.message||'Не удалось восстановить копию','error',4000);});
}
function manualSaveAll(){
  var ok=save();
  if(!ok){toast('Не удалось сохранить данные. Скачай резервную копию JSON.','error',5000);return false;}
  backupStorage();
  try{var raw=localStorage.getItem(STORAGE_KEY);if(raw&&typeof writeVaultSnapshot==='function')writeVaultSnapshot(raw).then(function(){window.__LIFE_OS_VAULT_READY=true;toast('Все данные сохранены и резервная копия обновлена.','success');}).catch(function(){toast('Основные данные сохранены. Расширенная копия будет создана автоматически.','warning');});else toast('Данные сохранены на устройстве.','success');}catch(e){toast('Данные сохранены на устройстве.','success');}
  return true;
}
var _lifeAutosaveTimer=null;
function queueJournalAutosave(){
  if(_lifeAutosaveTimer)clearTimeout(_lifeAutosaveTimer);
  var status=document.getElementById('journalAutosaveStatus');
  if(status)status.textContent='Есть несохранённые изменения…';
  _lifeAutosaveTimer=setTimeout(function(){
    try{saveJournalEntry(true);}catch(e){console.warn('[JOURNAL AUTOSAVE]',e);}
  },900);
}
function updateGlobalSaveStatus(status,detail){
 try{
  var root=document.getElementById('lifeosSaveDock');
  if(!root&&document.body){
   root=document.createElement('div');root.id='lifeosSaveDock';root.setAttribute('role','status');
   root.style.cssText='position:fixed;right:12px;bottom:calc(env(safe-area-inset-bottom,0px) + 86px);z-index:9998;display:flex;align-items:center;gap:8px;padding:7px 9px;border:1px solid var(--glass-border,rgba(255,255,255,.14));border-radius:999px;background:var(--card,rgba(20,25,38,.94));box-shadow:0 8px 28px rgba(0,0,0,.24);backdrop-filter:blur(14px);font:12px system-ui;color:var(--text,#fff)';
   var label=document.createElement('span');label.id='lifeosSaveLabel';label.textContent='Автосохранение';
   var button=document.createElement('button');button.type='button';button.textContent='💾';button.title='Сохранить все данные';button.setAttribute('aria-label','Сохранить все данные');button.style.cssText='border:0;border-radius:50%;width:32px;height:32px;background:var(--brand,#5b8cff);color:#fff;font-size:16px';button.addEventListener('click',function(){manualSaveAll();});
   root.append(label,button);document.body.appendChild(root);
  }
  var node=document.getElementById('lifeosSaveLabel');if(node)node.textContent=status==='saving'?'Сохранение…':status==='error'?'Ошибка сохранения':(detail||'Сохранено');
 }catch(e){}
}
function initGlobalSaveControls(){
 if(LIFEOS_SAVE_UI_READY)return;LIFEOS_SAVE_UI_READY=true;
 updateGlobalSaveStatus('saved',window.__LIFE_OS_LAST_SAVED?'Сохранено':'Автосохранение включено');
 window.addEventListener('lifeos:saved',function(){updateGlobalSaveStatus('saved','Сохранено '+new Date(window.__LIFE_OS_LAST_SAVED||Date.now()).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'}));});
 window.addEventListener('pagehide',function(){try{save();}catch(e){}});
 document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden'){try{save();}catch(e){}}});
}
function save(){
 updateGlobalSaveStatus('saving');
 try{
  state.settings.updatedAt=nowISO();state.settings.version=CURRENT_VERSION;
    var serialized=JSON.stringify(state),previous=localStorage.getItem(STORAGE_KEY);
    if(previous&&previous!==serialized){try{localStorage.setItem(STORAGE_BACKUP,previous);}catch(backupError){}}
    localStorage.setItem(STORAGE_KEY,serialized);
    queueVaultSnapshot(serialized);
    window.__LIFE_OS_LAST_SAVED=Date.now();
    window.__LIFE_OS_LAST_SAVED=Date.now();updateGlobalSaveStatus('saved','Сохранено '+new Date(window.__LIFE_OS_LAST_SAVED).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'}));window.dispatchEvent(new CustomEvent('lifeos:saved'));return true;
  }catch(e){
    console.error('[SAVE]',e);updateGlobalSaveStatus('error','Ошибка сохранения');
    try{queueVaultSnapshot(JSON.stringify(state));}catch(ignore){}
    try{if(typeof toast==='function')toast('Локальное хранилище заполнено. Сохраняю резервную копию отдельно…','error',5000);}catch(ignore2){}
    return false;
  }
}

/* ============ ГЛОБАЛЫ ============ */
var currentPage = 'dashboard';
var LIFE_JOURNAL_DATE = today();
var LIFEOS_SAVE_UI_READY = false;
var currentLevelId = null, currentModuleId = null, currentLessonIdx = null;
var taskFilter = 'all', taskSearch = '', skillsFilter = 'all';
var currentDailySurveyStep = 0, currentDailySurveyAnswers = {};
var timerInterval = null, timerSeconds = 25 * 60, timerRunning = false;
var currentVisionExercise = null;
var currentDayPlanDate = today();
var v2Filter = 'all';
var habitCatFilter = 'all', habitSearch = '', brainCatFilter = 'all', asCatFilter = 'all', gameCatFilter = 'all', matCatFilter = 'all';
var currentHabitId = null, currentBrainGameId = null, currentAntistressId = null;
var currentSleepDate = null;
var SLEEP_CAL_CURSOR = new Date();
var currentReportDate = null;
var CAL_CURSOR = new Date();
var sphereFilter = 'all';
var currentSphereId = null;
var currentProjectId = null;
var focusTimerInterval = null;
var currentCourseId = null, currentCourseModuleId = null, currentCourseLessonIdx = null;

/* ============ applyUserSettings ============ */
function applyUserSettings(){
  try{
    var s = state.settingsV2 || {};
    var scaleMap = {small:0.875, medium:1, large:1.125, xlarge:1.25};
    var ts = scaleMap[s.textSize] || 1;
    var sc = parseFloat(s.scale || '100') / 100;
    document.documentElement.style.fontSize = (16 * ts * sc) + 'px';
    document.body.classList.toggle('life-disable-motion',s.animations===false);
  }catch(e){}
}

/* ============ ЭФФЕКТЫ ТЕМ ============ */
function startEffects(){
  var overlay=document.getElementById('themeEffect');
  if(!overlay)return;
  overlay.replaceChildren();
  try{
    var settings=state&&state.settings?state.settings:{};
    document.body.classList.toggle('life-motion-override',settings.effectsMotionOverride===true);
    overlay.setAttribute('aria-hidden','true');
    if(document.hidden||settings.effectsEnabled===false)return;
    var theme=(window.THEMES||[]).find(function(t){return t.id===settings.theme;})||{effect:'stars'};
    var effect=theme.effect||'stars';
    if(effect==='none')effect='stars';
    var mobile=window.innerWidth<760;
    var intensity=Math.max(.5,Math.min(1.5,Number(settings.effectsIntensity)||1));
    var cap=mobile?9:16;
    var counts={stars:12,petals:9,leaves:9,snow:10,sparkles:10,spark:10,dust:8,fireflies:8,bubbles:8,rain:9,fire:8,lava:8,pumpkin:6,bats:6,ghosts:6,bones:6,drops:8,candles:5,feathers:7,aurora:5,waves:5,lightning:4,spiderweb:4,fog:5};
    var count=Math.min(cap,Math.max(3,Math.round((counts[effect]||7)*intensity)));
    var glyphs={petals:['✿','❀','✾'],leaves:['❧','❦','✽'],snow:['❄','❅','✧'],pumpkin:['🎃'],bats:['🦇'],ghosts:['👻'],bones:['☠'],candles:['♨','✧'],feathers:['❧'],stars:['✦','✧','⋆'],sparkles:['✧','✦','✴'],spark:['✧','✦'],fireflies:['✧','·'],bubbles:['◌','○'],rain:['╱','╲'],drops:['●','◦'],fog:['◌','○'],aurora:['✧','·'],waves:['〜','〰'],lightning:['ϟ','✦'],spiderweb:['✳','✧']};
    for(var i=0;i<count;i++){
      var el=document.createElement('i');
      el.className='life-effect life-effect-'+effect;
      el.style.setProperty('--x',(Math.random()*100)+'%');
      el.style.setProperty('--delay',(-Math.random()*10)+'s');
      el.style.setProperty('--duration',(9+Math.random()*13)+'s');
      el.style.setProperty('--drift',((Math.random()-.5)*90)+'px');
      if(glyphs[effect])el.textContent=glyphs[effect][Math.floor(Math.random()*glyphs[effect].length)];
      overlay.appendChild(el);
    }
    overlay.dataset.effect=effect;
    overlay.dataset.active='true';
  }catch(e){console.warn('[Effects]',e);overlay.replaceChildren();}
}
function lifeOSCelebrate(symbol){
  try{
    var overlay=document.getElementById('themeEffect');if(!overlay||!state.settings||state.settings.effectsEnabled===false)return;
    var rect=document.getElementById('app')?.getBoundingClientRect();if(!rect)return;
    var x=Math.round(rect.left+rect.width/2),y=Math.round(Math.min(window.innerHeight*.48,rect.top+window.innerHeight*.28));
    for(var i=0;i<14;i++){
      var p=document.createElement('i');p.className='life-burst-particle';p.textContent=symbol||'✦';
      p.style.left=x+'px';p.style.top=y+'px';p.style.setProperty('--dx',((Math.random()-.5)*180)+'px');p.style.setProperty('--dy',(-30-Math.random()*130)+'px');
      document.body.appendChild(p);p.addEventListener('animationend',function(){this.remove();},{once:true});
    }
  }catch(e){console.warn('[Effects burst]',e);}
}
if(!window.__lifeEffectsVisibilityBound){
  window.__lifeEffectsVisibilityBound=true;
  document.addEventListener('visibilitychange',function(){if(!document.hidden)startEffects();});
}

/* ============ applyTheme ============ */
function applyTheme(id){
  try{
    var available=window.THEMES||[];
    var selected=available.find(function(t){return t.id===id;});
    if(!selected){id='dark';selected=available.find(function(t){return t.id==='dark';});}
    document.body.className=document.body.className.split(/\s+/).filter(function(c){return c&&c.indexOf('theme-')!==0;}).concat(['theme-'+id]).join(' ');
    var root=document.documentElement;
    if(selected){
      root.style.setProperty('--bg',selected.bg||'#000000');
      root.style.setProperty('--bg-1',selected.bg2||selected.bg||'#0b0b10');
      root.style.setProperty('--bg-2',selected.bg2||selected.bg||'#14141b');
      root.style.setProperty('--text',selected.text||'#ffffff');
      root.style.setProperty('--brand',selected.brand||'#5b9eff');
      root.style.setProperty('--brand-2',selected.brand2||selected.brand||'#a78bfa');
      root.style.setProperty('--brand-glow',(selected.brand||'#5b9eff')+'66');
      root.style.setProperty('--surface-1',selected.bg2||selected.bg||'#111827');
      root.style.setProperty('--surface-2',selected.bg||'#090d16');
      root.style.setProperty('--line',(selected.text||'#ffffff')+'20');
      root.style.setProperty('--muted',(selected.text||'#ffffff')+'99');
    }
    if(state&&state.settings){state.settings.theme=id;save();}
    var meta=document.querySelector('meta[name="theme-color"]');
    if(meta)meta.setAttribute('content',selected&&selected.bg?selected.bg:'#000000');
  }catch(e){console.error('[Theme]',e);document.body.classList.add('theme-dark');}
  startEffects();
}

/* ============ TAB BAR ============ */
function toggleTabBar(){
  try{
    if(!state.settings)state.settings={};
    state.settings.navCollapsed=!state.settings.navCollapsed;
    save();
    renderTabBar();
    haptic('light');
  }catch(e){console.warn('[Navigation panel]',e);}
}
function renderTabBar(){
  try{
    var bar=document.getElementById('tabBar');
    var wrap=document.getElementById('tabBarWrap');
    var toggle=document.getElementById('tabBarToggle');
    var icon=document.getElementById('tabBarToggleIcon');
    if(!bar)return;
    var collapsed=!!(state.settings&&state.settings.navCollapsed);
    if(wrap)wrap.classList.toggle('is-collapsed',collapsed);
    if(toggle)toggle.setAttribute('aria-label',collapsed?'Развернуть панель':'Свернуть панель');
    if(icon)icon.textContent=collapsed?'⌃':'⌄';
    var tabs=window.TABS||[];
    var html='';
    tabs.forEach(function(t){
      html+='<button class="tab-item '+(t.id===currentPage?'active':'')+'" onclick="navigate(\''+t.id+'\')" aria-label="'+t.label+'">';
      html+='<span class="tab-icon">'+t.emoji+'</span><span class="tab-label">'+t.label+'</span></button>';
    });
    bar.innerHTML=html;
  }catch(e){console.error('[TabBar]',e);}
}

function updateHeader(){
  try{
    var avatar = document.getElementById('headerAvatar');
    if(avatar && state.profile) avatar.textContent = state.profile.emoji || '👤';
  }catch(e){}
}

/* ============ NAVIGATION ============ */
var MAIN_PAGES = ['dashboard','tasks','learning','calendar','stats','vision','ai','more'];

function navigate(page, silent){
  if(!page) page = 'dashboard';
  var prev = currentPage;
  currentPage = page;
  var appRoot=document.getElementById('app');
  if(appRoot){appRoot.setAttribute('data-page',page);appRoot.className='app-main page-theme-'+String(page).replace(/[^a-z0-9_-]/gi,'');}
  if(!silent && prev && prev !== page){
    if(MAIN_PAGES.indexOf(page) >= 0){
      _backStack = [];
      tgBackButtonHide();
    } else {
      if(_backStack[_backStack.length-1] !== prev) _backStack.push(prev);
      tgBackButtonShow();
    }
  }
  try{ renderTabBar(); }catch(e){}
  try{ updateHeader(); }catch(e){}
  var main = document.getElementById('app');
  if(!main) return;
  main.innerHTML = '';
  var renderers = {
    dashboard: renderDashboard,
    spheres: renderSpheres, sphereDetail: renderSphereDetail,
    projects: renderProjects, projectDetail: renderProjectDetail, projectEditor: window.renderProjectEditor || renderProjectEditor,
    coach: renderCoach, coachSettings: renderCoachSettings, coachChat: renderCoachChat,
    schedule: window.renderSchedule || renderSchedule, scheduleEditor: window.renderScheduleEditor || renderScheduleEditor, walks: renderWalks,
    focus: window.renderFocus || renderFocus, eveningReview: window.renderEveningReview || renderEveningReview,
    weeklyReview: renderWeeklyReview, monthlyReview: renderMonthlyReview,
    achievements: renderAchievements, achievementsCategory: renderAchievementsCategory,
    tasks: renderTasks, matrix: renderMatrix, learning: window.renderLearning || renderLearning,
    levels: renderLevels, levelDetail: renderLevelDetail, moduleDetail: window.renderModuleDetail || renderModuleDetail,
    skills: renderSkills, methods: renderMethods, english: renderEnglish,
    memory: renderMemory, iq: window.renderIQ || renderIQ, eq: window.renderEQ || renderEQ, finance: window.renderFinance || renderFinance,
    neuromodule: window.renderNeuro || renderNeuro, psychology: window.renderPsychology || renderPsychology, thinking: window.renderThinking || renderThinking,
    etiquette: window.renderEtiquette || renderEtiquette, hormones: window.renderHormones || renderHormones, wealth: window.renderWealth || renderWealth,
    planning: renderPlanning, plantoday: window.renderPlanToday || renderPlanToday, planweek: window.renderPlanWeek || renderPlanWeek,
    planmonth: window.renderPlanMonth || renderPlanMonth, gcal: window.renderGcal || renderGcal,
    calendar: window.renderCalendar || renderCalendar,
    vision: renderVision, visionex: renderVisionExercises,
    visiontrack: renderVisionTracker, visiontips: renderVisionTips,
    vision60: renderVision60, vision62: renderVision62,
    ai: renderAI, jarvis: renderJarvis, health: renderHealth, water: renderWater, mood: renderMood,
    workouts: renderWorkouts, meditation: renderMeditation, meds: window.renderMeds || renderMeds,
    recovery: window.renderRecovery || renderRecovery, medical: window.renderMedical || renderMedical,
    entertainment: window.renderEntertainment || renderEntertainment, resources: window.renderResources || renderResources,
    movies: window.renderMovies || renderMovies, series: window.renderSeries || renderSeries, books: window.renderBooks || renderBooks,
    musiclib: window.renderMusic || renderMusic, gameslib: window.renderGames || renderGames, podcastslib: window.renderPodcasts || renderPodcasts,
    habitList: renderHabitList, habitCatalog: renderHabitCatalog,
    habitDetail: renderHabitDetail, habitEditor: renderHabitEditor,
    brain: renderBrain, brainGame: renderBrainGame, brainStats: renderBrainStats,
    antistress: window.renderAntistress || renderAntistress, antistressDetail: renderAntistressDetail,
    sleep: renderSleep, sleepCalendar: renderSleepCalendar, sleepEditor: renderSleepEditor,
    games: window.renderLearningGames || renderLearningGames, gamePlay: window.renderGamePlay || renderGamePlay,
    materials: window.renderMaterials || renderMaterials, materialDetail: window.renderMaterialDetail || renderMaterialDetail,
    notifications: window.renderNotifications || renderNotifications,
    snapshot: window.renderSnapshot || renderSnapshot, recommendations: window.renderRecommendations || renderRecommendations,
    dailyReport: renderDailyReport, weeklyReport: renderWeeklyReport,
    goals: renderGoals, notes: renderNotes,
    more: renderMore, stats: renderStats, detailedStats: renderDetailedStats, journal: window.renderJournal || renderJournal,
    learningPractice: renderLearningPractice, detoxReview: renderDetoxReview, personalization: renderPersonalizationSurvey,
    timer: window.renderTimer || renderTimer, domains: renderDomains,
    profile: renderProfile, profileV2: renderProfileV2,
    settings: renderSettings, settingsV2: renderSettingsV2,
    integrations: window.renderIntegrations || renderIntegrations, storage: renderStorage,
    screentracker: renderScreenTracker, detoxcourse: renderDetoxCourse,
    detox60: renderDetox60, obsidian: window.renderObsidian || renderObsidian, obsidianIntegration: window.renderObsidianIntegration || renderObsidianIntegration,
    telegramSetup: renderTelegramSetup,
    gamesHub: window.renderGamesHub || renderGamesHub,
    leagues: renderLeagues,
    pet: window.renderPet || renderPet,
    fsrs: renderFSRS,
    fsrsReview: renderFSRSReview,
    detox: renderDetoxHub,
    dailySurvey: window.renderDailySurvey || renderDailySurvey, survey: window.renderSurvey || renderSurvey,
    plan: window.renderPersonalPlan || renderPersonalPlan,
    diagnostic: renderDiagnostic,
    onboarding: window.renderOnboarding || renderOnboarding
  };
  (window.ALL_NEW_COURSES || []).forEach(function(course){
    renderers[course.id] = function(){ renderCourseGeneric(course, course.id + 'Progress'); };
  });
  var fn = renderers[page];
  if(typeof fn !== 'function'){
    main.innerHTML = '<div class="page"><div class="title-xl">🚧 ' + page + '</div><div class="card"><div class="empty"><div class="empty-icon">🚧</div><div class="empty-title">Раздел не подключён</div></div></div></div>';
    return;
  }
  try{
    fn();
    var artMap={"dashboard":"<path d=\"M8 12 20 5l12 7v16H8z\"/><path d=\"M15 28V17h10v11M5 13l15-9 15 9\"/>","tasks":"<path d=\"m8 19 6 6 14-16\"/><path d=\"M6 5h24v26H6z\"/>","learning":"<path d=\"M4 11 20 4l16 7-16 7z\"/><path d=\"M10 15v10c6 5 14 5 20 0V15M36 12v12\"/>","calendar":"<rect x=\"5\" y=\"8\" width=\"30\" height=\"27\" rx=\"5\"/><path d=\"M12 4v8M28 4v8M5 15h30M12 22h5m5 0h5m-13 7h5\"/>","vision":"<path d=\"M3 20s6-11 17-11 17 11 17 11-6 11-17 11S3 20 3 20Z\"/><circle cx=\"20\" cy=\"20\" r=\"6\"/><circle cx=\"20\" cy=\"20\" r=\"2\"/>","ai":"<path d=\"M20 4v8m0 16v8M4 20h8m16 0h8M8 8l6 6m12 12 6 6m0-24-6 6m-12 12-6 6\"/><circle cx=\"20\" cy=\"20\" r=\"8\"/>","more":"<circle cx=\"8\" cy=\"20\" r=\"2\"/><circle cx=\"20\" cy=\"20\" r=\"2\"/><circle cx=\"32\" cy=\"20\" r=\"2\"/>","walks":"<path d=\"m22 5-4 8 6 5-4 8-7 7m5-20-8 2-5 9m19-10 7 7\"/>","health":"<path d=\"M20 34S5 25 5 14a8 8 0 0 1 15-4 8 8 0 0 1 15 4c0 11-15 20-15 20Z\"/><path d=\"M11 20h7l3-6 4 12 3-6h5\"/>","memory":"<path d=\"M10 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3 5 5 0 0 1 5 8 5 5 0 0 1-2 9 5 5 0 0 1-9 5 5 5 0 0 1-9-5 5 5 0 0 1-2-9 5 5 0 0 1-1-8Z\"/><path d=\"M20 8v24m-8-18 8 5m8-5-8 5m-8 7 8-4m8 4-8-4\"/>","finance":"<path d=\"M6 32V8m0 24h29M12 26l7-8 6 4 9-12\"/><circle cx=\"34\" cy=\"10\" r=\"3\"/>","sleep":"<path d=\"M29 6a15 15 0 1 0 8 25A17 17 0 0 1 29 6Z\"/><path d=\"m9 8 1 3 3 1-3 1-1 3-1-3-3-1 3-1z\"/>"};
    var artKey=({schedule:'calendar',walks:'walks',focus:'ai',eveningReview:'sleep',weeklyReview:'calendar',monthlyReview:'calendar',stats:'finance',detailedStats:'finance',profile:'ai',profileV2:'ai',settings:'more',settingsV2:'more',storage:'memory',screentracker:'vision',detoxcourse:'health',detox:'health',brain:'memory',brainGame:'memory',brainStats:'memory',water:'health',mood:'health',workouts:'health',meditation:'sleep',sleep:'sleep',sleepCalendar:'sleep',sleepEditor:'sleep',finance:'finance',wealth:'finance',visionex:'vision',visiontrack:'vision',visiontips:'vision',vision60:'vision',vision62:'vision'})[page]||page;
    if(!artMap[artKey])artKey=({dashboard:'dashboard',tasks:'tasks',learning:'learning',calendar:'calendar',vision:'vision',ai:'ai',more:'more'})[page]||'more';
    var art=document.createElement('div');art.className='life-page-art';art.setAttribute('aria-hidden','true');
    art.innerHTML='<svg viewBox="0 0 40 40" role="presentation">'+artMap[artKey]+'</svg>';
    main.insertBefore(art,main.firstChild);
    setTimeout(function(){ try{ attachVoiceAll('app'); }catch(e){} }, 50);
  }catch(e){
    console.error('Render [' + page + ']:', e);
    main.innerHTML = '<div class="page"><div class="card"><div class="empty"><div class="empty-icon">⚠️</div><div class="empty-title">Ошибка</div><div class="empty-text">' + esc(e.message || '') + '</div></div></div></div>';
  }
  if(window.lifeosScrollToTop)window.lifeosScrollToTop();else{var scrollRoot=document.getElementById('app');if(scrollRoot)scrollRoot.scrollTop=0;}
  if(page === 'dashboard' || page === 'snapshot' || page === 'dailyReport' || page === 'weeklyReport' || page === 'spheres'){
    try{ refreshSnapshot(); }catch(e){}
  }
}

/* ============ SHEET ============ */
function openSheet(title, content){
  try{
    document.querySelectorAll('.overlay').forEach(function(o){ o.remove(); });
    var overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = '<div class="modal"><div class="modal-handle"></div><div class="modal-header"><div class="modal-title">' + esc(title) + '</div><button class="modal-close" onclick="closeSheet()">✕</button></div>' + content + '</div>';
    overlay.onclick = function(e){ if(e.target === overlay) closeSheet(); };
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    setTimeout(function(){ try{ attachVoiceAll('.modal'); }catch(e){} }, 50);
  }catch(e){ console.error('[Sheet]', e); }
}
function closeSheet(){
  if(window.__miniGameTimer){clearTimeout(window.__miniGameTimer);clearInterval(window.__miniGameTimer);window.__miniGameTimer=null;}
  __miniGame=null;
  if(window.__visionBreakInterval){clearInterval(window.__visionBreakInterval);window.__visionBreakInterval=null;}
  if(window.__eyeExerciseInterval){clearInterval(window.__eyeExerciseInterval);window.__eyeExerciseInterval=null;}
  document.querySelectorAll('.overlay').forEach(function(o){ o.remove(); });
  document.body.style.overflow = '';
}

/* ============ THEME PICKER ============ */
function openThemePicker(){
  var themes=window.THEMES||[];
  if(!themes.length){toast('Темы не загружены','error');return;}
  var html='<div class="theme-picker-intro">Выбери оформление. Эффекты работают отдельно и не должны замедлять интерфейс.</div>';
  html+='<div class="theme-gallery">';
  themes.forEach(function(t){
    var active=state.settings.theme===t.id;
    html+='<button class="theme-tile '+(active?'active':'')+'" onclick="setTheme(\''+t.id+'\')" style="--theme-a:'+t.bg+';--theme-b:'+(t.bg2||t.bg)+';--theme-accent:'+t.brand+';color:'+t.text+'"><span class="theme-tile-glow"></span><span class="theme-tile-emoji">'+t.emoji+'</span><span class="theme-tile-name">'+t.name+'</span><span class="theme-tile-check">'+(active?'✓':'')+'</span></button>';
  });
  html+='</div><div class="card theme-effects-card"><div class="row-between"><div><div class="list-title">Анимация фона</div><div class="footnote">Частицы, атмосфера и эффекты интерфейса</div></div><button class="btn btn-ghost btn-xs" onclick="state.settings.effectsEnabled=!state.settings.effectsEnabled;save();startEffects();openThemePicker()">'+(state.settings.effectsEnabled?'Включены':'Выключены')+'</button></div><div class="row-between mt-2"><div><div class="list-title">Разрешить анимацию при системном ограничении</div><div class="footnote">Принудительно включать эффекты, даже если устройство ограничивает движение</div></div><button class="btn btn-ghost btn-xs" onclick="state.settings.effectsMotionOverride=!state.settings.effectsMotionOverride;save();startEffects();openThemePicker()">'+(state.settings.effectsMotionOverride?'Да':'Нет')+'</button></div><div class="row-between mt-3"><div class="list-title">Интенсивность</div><div class="row" style="gap:5px">';
  [0.5,1,1.5].forEach(function(v){var active=(state.settings.effectsIntensity||1)===v;html+='<button class="btn '+(active?'btn-primary':'btn-ghost')+' btn-xs" onclick="state.settings.effectsIntensity='+v+';save();startEffects();openThemePicker()">'+v+'×</button>';});
  html+='</div></div></div>';
  openSheet('Темы и оформление',html);
}
function setTheme(id){
  try{
    state.settings.theme = id;
    state.settings.effectsEnabled = true;
    applyTheme(id);
    save();
    haptic('success');
    closeSheet();
    toast('Тема: ' + id,'success');
  }catch(e){ toast('Ошибка','error'); }
}
function openStatsQuick(){ navigate('stats'); }

/* ============ PWA INSTALL ============ */
var deferredPWAInstall = null;
function markPWAInstalled(){
  try{
    if(!state.settings.pwa) state.settings.pwa={};
    state.settings.pwa.installed=true; state.settings.pwa.installedAt=nowISO(); save();
    toast('✓ Life OS установлен','success'); haptic('success');
  }catch(e){console.warn('[PWA] Не удалось сохранить статус:',e);}
}
function installPWA(){
  try{
    if(window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches){toast('Life OS уже установлен','success');return;}
    if(tg&&typeof tg.addToHomeScreen==='function'){tg.addToHomeScreen();toast('📲 Подтверди добавление Life OS на главный экран','info',4000);return;}
    if(deferredPWAInstall){
      var promptEvent=deferredPWAInstall; deferredPWAInstall=null; promptEvent.prompt();
      promptEvent.userChoice.then(function(choice){if(choice&&choice.outcome==='accepted')markPWAInstalled();}).catch(function(error){console.warn('[PWA] prompt:',error);});
      return;
    }
    if(tg&&typeof tg.openLink==='function'){
      tg.openLink(location.href,{try_instant_view:false});
      toast('В браузере открой меню ⋮ и выбери «Установить приложение» или «На главный экран»','info',6000); return;
    }
    toast('Открой Life OS в браузере и выбери «Установить приложение» в меню','info',6500);
  }catch(e){console.error('[PWA]',e);toast('Не удалось начать установку. Открой Life OS во внешнем браузере.','warning',5000);}
}
function initPWAHandlers(){
  try{
    if(!state.settings.pwa) state.settings.pwa={};
    window.addEventListener('beforeinstallprompt',function(event){event.preventDefault();deferredPWAInstall=event;});
    window.addEventListener('appinstalled',markPWAInstalled);
    if(tg&&tg.onEvent){
      tg.onEvent('homeScreenAdded',markPWAInstalled);
      tg.onEvent('homeScreenFailed',function(reason){console.warn('[PWA] Failed:',reason);toast('Установка через Telegram не удалась. Попробуй браузер.','warning',5000);});
    }
  }catch(e){console.warn('[PWA] handlers:',e);}
}
function renderPWAInstallBlock(){
  var installed=state.settings&&state.settings.pwa&&state.settings.pwa.installed;
  var standalone=window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches;
  var html='<div class="card"><h2>📲 Установка Life OS</h2>';
  if(installed||standalone){
    html+='<div class="insight-card"><div class="insight-title">✓ Приложение установлено</div><div class="insight-text">Life OS запускается с главного экрана. Офлайн-доступ доступен для ранее загруженных ресурсов.</div></div>';
  }else{
    html+='<div class="footnote text-secondary mb-3">Добавь Life OS на главный экран. Если Telegram не поддерживает установку, откроется браузер.</div>';
    html+='<button class="btn btn-primary btn-block" onclick="installPWA()">📲 Установить / добавить на экран</button>';
    html+='<div class="footnote text-secondary mt-2">В браузере: меню ⋮ → «Установить приложение» или «Добавить на главный экран».</div>';
  }
  html+='<a href="https://github.com/vana30421-cpu/ai-coach-tg/archive/refs/heads/main.zip" target="_blank" rel="noopener" class="btn btn-ghost btn-block mt-2" style="text-decoration:none;">⬇️ Скачать ZIP-пакет проекта</a>';
  return html+'</div>';
}

/* ============ EXPORTS для onclick в HTML ============ */
window.navigateBack = navigateBack;
window.navigate = navigate;
window.openSheet = openSheet;
window.closeSheet = closeSheet;
window.openThemePicker = openThemePicker;
window.setTheme = setTheme;
window.openStatsQuick = openStatsQuick;
window.installPWA = installPWA;
window.jarvisQuick = jarvisQuick;
window.sendJarvisMessage = sendJarvisMessage;
window.setJarvisApiUrl = setJarvisApiUrl;
window.setJarvisProvider = setJarvisProvider;
window.startJarvisVoice = startJarvisVoice;
window.speakJarvisLast = speakJarvisLast;
window.startJarvisFocus = startJarvisFocus;
window.stopJarvisFocus = stopJarvisFocus;
window.saveJarvisCheckin = saveJarvisCheckin;
window.setJarvisMode = setJarvisMode;
window.setJarvisFocusDefault = setJarvisFocusDefault;
window.clearJarvisChat = clearJarvisChat;
window.renderJarvisAIProviders = renderJarvisAIProviders;
window.toast = toast;
window.haptic = haptic;
window.esc = esc;
window.uid = uid;
window.today = today;
window.nowISO = nowISO;

/* ============ КОНЕЦ ЧАСТИ 1/4 ============ */

/* Продолжение в части 2/4: dashboard, сферы, привычки, проекты, коуч */
/* Продолжение в части 3/4: задачи, обучение, зрение, детокс */
/* Продолжение в части 4/4: здоровье, игры, лиги, питомец, FSRS, настройки, init */


/* ============================================================
   LIFE OS — APP.js v47 — ЧАСТЬ 2/4
   Dashboard, Круг 7 сфер, Сферы, Детали сферы, Быстрые действия,
   Привычки (list, catalog, detail, editor, 66-прогресс),
   Проекты, Коуч (20 персон), Чат с коучем
   ============================================================ */

/* ============ DASHBOARD v46 — с XP, питомцем, кругом 7 сфер ============ */
function renderDashboard(){
  var hour = new Date().getHours();
  var greet = hour<6 ? 'Доброй ночи' : hour<12 ? 'Доброе утро' : hour<18 ? 'Добрый день' : 'Добрый вечер';
  var userName = state.profile.name ? ', ' + state.profile.name : '';
  var scores = (state.spheres && state.spheres.lastScores) || {};
  var balance = getSpheresBalance(scores);
  var phase = getCurrentPhase();

  var html = '<div class="page">';
  html += '<div class="title-xl">' + greet + userName + '</div>';

  /* Фаза дня */
  if(phase){
    html += '<div class="card" style="background:linear-gradient(135deg,' + phase.color + '22,' + phase.color + '11);border-color:' + phase.color + '55;">';
    html += '<div style="display:flex;align-items:center;gap:12px;">';
    html += '<div style="font-size:36px;">' + phase.emoji + '</div>';
    html += '<div style="flex:1;"><div style="font-size:16px;font-weight:800;">' + phase.name + '</div>';
    html += '<div class="footnote text-secondary">' + phase.desc + '</div></div>';
    html += '<div class="badge badge-brand">' + getNowHHMM() + '</div>';
    html += '</div></div>';
  }

  /* XP + уровень + питомец */
  var g = state.gamification || {};
  var lvl = g.level || 1;
  var xp = g.xp || 0;
  var xpNext = getXPForNextLevel(lvl);
  var xpPrev = getXPForLevel(lvl);
  var pct = xpNext > xpPrev ? Math.round((xp - xpPrev) / (xpNext - xpPrev) * 100) : 0;
  var pet = state.pet || {};
  var petStage = (window.PET_STAGES || []).find(function(s){return s.id === (pet.stage||1);}) || {emoji:'🥚',name:'Яйцо'};

  html += '<div class="card" onclick="navigate(\'stats\')" style="cursor:pointer;">';
  html += '<div class="row-between mb-2">';
  html += '<div><div style="font-size:11px;color:var(--text-2);text-transform:uppercase;font-weight:700;">Уровень ' + lvl + '</div>';
  html += '<div style="font-size:22px;font-weight:800;">' + xp + ' XP</div></div>';
  html += '<div style="font-size:44px;">' + petStage.emoji + '</div>';
  html += '</div>';
  html += '<div class="xp-bar"><div class="xp-bar-fill" style="width:' + Math.max(2,pct) + '%"></div></div>';
  html += '<div class="xp-text">' + (xpNext - xp) + ' XP до уровня ' + (lvl+1) + ' · ' + (pet.name||'Питомец') + ': ' + petStage.name + '</div>';
  html += '</div>';

  /* Круг 7 сфер */
  html += '<div class="card" onclick="navigate(\'spheres\')" style="cursor:pointer;">';
  html += '<div class="row-between mb-3"><div style="font-size:16px;font-weight:800;">🎯 Баланс сфер</div>';
  html += '<div class="badge badge-brand">' + balance.balance + '%</div></div>';
  html += renderSpheresCircle(scores, 200);
  html += '<div class="footnote text-secondary" style="text-align:center;margin-top:10px;">Средний балл: ' + balance.avg + '/10' + (balance.weakest ? ' · Слабая: ' + balance.weakest.emoji + ' ' + balance.weakest.name : '') + '</div>';
  html += '</div>';

  /* Рекомендация по слабой сфере */
  if(balance.weakest){
    var recs = getSphereRecommendations(balance.weakest.id, balance.weakest.value || 0);
    if(recs.length){
      html += '<div class="card" style="border-left:3px solid ' + balance.weakest.color + ';">';
      html += '<div style="display:flex;gap:10px;"><div style="font-size:28px;">' + recs[0].emoji + '</div>';
      html += '<div style="flex:1;"><div style="font-weight:800;font-size:14px;">' + esc(recs[0].title) + '</div>';
      html += '<div class="footnote text-secondary">' + esc(recs[0].text) + '</div></div></div></div>';
    }
  }

  /* Совет коуча */
  var tip = getRandomCoachTip(balance.weakest ? balance.weakest.id : 'health');
  if(tip){
    html += '<div class="card" style="background:linear-gradient(135deg,color-mix(in srgb,var(--brand) 15%,transparent),color-mix(in srgb,var(--brand-2) 10%,transparent));">';
    html += '<div class="row-between mb-2"><div style="font-size:14px;font-weight:800;">💡 Совет коуча</div>';
    html += '<button class="btn btn-ghost btn-xs" onclick="navigate(\'coach\')">→</button></div>';
    html += '<div style="display:flex;gap:10px;"><div style="font-size:24px;">' + tip.emoji + '</div>';
    html += '<div style="flex:1;font-size:13px;line-height:1.5;">' + esc(tip.text) + '</div></div></div>';
  }

  /* Персональная подсказка Джарвиса на главном экране */
  try{var jarvisPeek=getJarvisAnalytics(true),jarvisTop=jarvisPeek.items&&jarvisPeek.items[0];if(jarvisTop&&jarvisTop.id!=='steady'&&jarvisTop.id!=='coverage'){html+='<div class="card" style="border-left:3px solid '+(jarvisTop.level==='high'?'var(--danger)':'var(--brand)')+'"><div class="row-between"><b>✧ Джарвис заметил</b><button class="btn btn-ghost btn-xs" onclick="navigate(\'ai\')">Обсудить →</button></div><div class="list-title mt-2">'+esc(jarvisTop.title)+'</div><div class="footnote mt-1">'+esc(jarvisTop.detail)+'</div></div>';}}catch(jarvisDashboardError){}

  /* Привычки */
  var habitsToday = getHabitsForToday();
  if(habitsToday.length){
    var doneH = habitsToday.filter(function(h){ return isHabitDoneToday(h.id); }).length;
    html += '<div class="card" onclick="navigate(\'habitList\')" style="cursor:pointer;">';
    html += '<div class="row-between mb-3"><div style="font-size:16px;font-weight:800;">🔄 Привычки</div>';
    html += '<div class="badge badge-brand">' + doneH + '/' + habitsToday.length + '</div></div>';
    html += '<div class="progress" style="margin-bottom:10px;"><div class="progress-fill" style="width:' + Math.round(doneH/habitsToday.length*100) + '%;"></div></div>';
    habitsToday.slice(0,3).forEach(function(h){
      var done = isHabitDoneToday(h.id);
      var tpl = getHabitTemplate(h.templateId);
      var emoji = tpl ? tpl.emoji : (h.emoji || '✅');
      html += '<div style="display:flex;gap:10px;align-items:center;padding:6px 0;' + (done ? 'opacity:.5;' : '') + '">';
      html += '<div style="font-size:18px;">' + (done ? '✅' : emoji) + '</div>';
      html += '<div style="flex:1;font-weight:600;font-size:13px;' + (done ? 'text-decoration:line-through;' : '') + '">' + esc(h.title || 'Привычка') + '</div></div>';
    });
    html += '</div>';
  }

  /* Фокус */
  if(state.focus && state.focus.active){
    var elapsed = Math.floor((Date.now() - new Date(state.focus.active.startedAt).getTime())/1000);
    var mins = Math.floor(elapsed/60);
    html += '<div class="card card-gradient" onclick="navigate(\'focus\')" style="cursor:pointer;">';
    html += '<div style="font-size:14px;opacity:.9;">⏱ Фокус идёт</div>';
    html += '<div style="font-size:32px;font-weight:800;">' + pad(mins) + ' мин</div>';
    html += '<div style="font-size:12px;opacity:.9;">' + esc(state.focus.active.taskTitle||'Фокус-сессия') + '</div>';
    html += '</div>';
  } else {
    html += '<div class="card"><h2>⏱ Фокус</h2>';
    html += '<div class="row" style="gap:6px;">';
    html += '<button class="btn btn-primary" style="flex:1;" onclick="startFocusSession(25,\'Pomodoro\')">▶ 25 мин</button>';
    html += '<button class="btn btn-ghost" style="flex:1;" onclick="startFocusSession(50,\'Focus\')">▶ 50 мин</button>';
    html += '<button class="btn btn-ghost" style="flex:1;" onclick="startFocusSession(90,\'Deep Work\')">▶ 90 мин</button>';
    html += '</div></div>';
  }

  /* Отчёты */
  html += '<div class="card"><h2>📊 Отчёты</h2>';
  html += '<div class="row" style="gap:6px;">';
  html += '<button class="btn btn-primary" style="flex:1;" onclick="navigate(\'dailyReport\')">📊 День</button>';
  html += '<button class="btn btn-ghost" style="flex:1;" onclick="navigate(\'weeklyReview\')">📈 Неделя</button>';
  html += '<button class="btn btn-ghost" style="flex:1;" onclick="navigate(\'monthlyReview\')">📆 Месяц</button>';
  html += '</div></div>';

  /* Быстрые действия */
  html += '<div class="card"><h2>⚡ Быстро</h2><div class="group-grid">';
  html += '<div class="group-item" onclick="openEntityEditor(\'task\',null)"><div class="group-item-icon">➕</div><div class="group-item-label">Задача</div></div>';
  html += '<div class="group-item" onclick="quickWaterLog()"><div class="group-item-icon">💧</div><div class="group-item-label">Вода</div></div>';
  html += '<div class="group-item" onclick="quickMoodLog()"><div class="group-item-icon">💭</div><div class="group-item-label">Настроение</div></div>';
  html += '<div class="group-item" onclick="navigate(\'eveningReview\')"><div class="group-item-icon">🌙</div><div class="group-item-label">Вечерний обзор</div></div>';
  html += '<div class="group-item" onclick="navigate(\'projects\')"><div class="group-item-icon">📁</div><div class="group-item-label">Проекты</div></div>';
  html += '<div class="group-item" onclick="navigate(\'achievements\')"><div class="group-item-icon">🏆</div><div class="group-item-label">Достижения</div></div>';
  html += '<div class="group-item" onclick="navigate(\'journal\')"><div class="group-item-icon">📔</div><div class="group-item-label">Дневник</div></div>';
  html += '<div class="group-item" onclick="navigate(\'obsidian\')"><div class="group-item-icon">🧠</div><div class="group-item-label">Второй мозг</div></div>';
  html += '<div class="group-item" onclick="navigate(\'gamesHub\')"><div class="group-item-icon">🎮</div><div class="group-item-label">Игры</div></div>';
  html += '<div class="group-item" onclick="navigate(\'pet\')"><div class="group-item-icon">' + petStage.emoji + '</div><div class="group-item-label">Питомец</div></div>';
  html += '<div class="group-item" onclick="navigate(\'leagues\')"><div class="group-item-icon">🏅</div><div class="group-item-label">Лиги</div></div>';
  html += '<div class="group-item" onclick="navigate(\'antistress\')"><div class="group-item-icon">🌬</div><div class="group-item-label">Антистресс</div></div>';
  html += '<div class="group-item" onclick="navigate(\'calendar\')"><div class="group-item-icon">🗓</div><div class="group-item-label">Календарь</div></div>';
  html += '<div class="group-item" onclick="navigate(\'journal\')"><div class="group-item-icon">📔</div><div class="group-item-label">Дневник</div></div>';
  html += '<div class="group-item" onclick="navigate(\'obsidian\')"><div class="group-item-icon">🧠</div><div class="group-item-label">Второй мозг</div></div>';
  html += '</div></div>';

  /* Задачи */
  var pending = state.tasks.filter(function(t){ return t.status === 'pending'; });
  html += '<div class="card"><div class="row-between mb-3"><h2 style="margin:0;">📋 Задачи</h2>';
  html += '<button class="btn btn-ghost btn-xs" onclick="navigate(\'tasks\')">Все →</button></div>';
  if(pending.length){
    pending.slice().sort(function(a,b){ return getEisenhowerPriority(a) - getEisenhowerPriority(b); }).slice(0,4).forEach(function(t){ html += taskRow(t); });
  } else {
    html += '<div class="empty"><div class="empty-icon">✨</div><div class="empty-title">Всё выполнено</div></div>';
  }
  html += '</div>';

  html += '</div>';
  document.getElementById('app').innerHTML = html;
}

/* ============ КРУГ 7 СФЕР (SVG) ============ */
function renderSpheresCircle(scores, size){
  size = size || 280;
  var r = size/2;
  var innerR = r * 0.35;
  var outerR = r * 0.95;
  var spheres = LIFE_SPHERES || [];
  var angleStep = 360 / spheres.length;
  var html = '<div class="spheres-circle-wrap"><div class="spheres-circle" style="width:' + size + 'px;height:' + size + 'px;">';
  html += '<svg viewBox="0 0 ' + size + ' ' + size + '">';
  spheres.forEach(function(s, i){
    var score = scores[s.id] || 0;
    var ratio = Math.max(0.05, score/10);
    var angle1 = (i*angleStep - 90) * Math.PI/180;
    var angle2 = ((i+1)*angleStep - 90) * Math.PI/180;
    var gap = (angleStep*0.04) * Math.PI/180;
    var a1 = angle1 + gap, a2 = angle2 - gap;
    var x1 = cx(size, innerR, a1), y1 = cy(size, innerR, a1);
    var x2 = cx(size, innerR, a2), y2 = cy(size, innerR, a2);
    var x3 = cx(size, innerR + (outerR-innerR)*ratio, a2), y3 = cy(size, innerR + (outerR-innerR)*ratio, a2);
    var x4 = cx(size, innerR + (outerR-innerR)*ratio, a1), y4 = cy(size, innerR + (outerR-innerR)*ratio, a1);
    var path = 'M' + x1.toFixed(1) + ',' + y1.toFixed(1) +
               ' A' + innerR + ',' + innerR + ' 0 0 1 ' + x2.toFixed(1) + ',' + y2.toFixed(1) +
               ' L' + x3.toFixed(1) + ',' + y3.toFixed(1) +
               ' A' + (innerR+(outerR-innerR)*ratio) + ',' + (innerR+(outerR-innerR)*ratio) + ' 0 0 0 ' + x4.toFixed(1) + ',' + y4.toFixed(1) + ' Z';
    html += '<path class="sphere-sector" d="' + path + '" fill="' + s.color + '" opacity="' + (score>0 ? 0.85 : 0.25) + '" onclick="openSphereDetail(\'' + s.id + '\')"/>';
  });
  html += '</svg>';
  html += '<div class="sphere-center-label">';
  var avg = 0, c = 0;
  spheres.forEach(function(s){ if(scores[s.id]){ avg += scores[s.id]; c++; } });
  avg = c ? Math.round(avg/c*10)/10 : 0;
  html += '<div class="sphere-center-value">' + avg + '</div>';
  html += '<div class="sphere-center-text">баланс</div>';
  html += '</div></div></div>';
  return html;
}
function cx(size, radius, angle){ return size/2 + radius * Math.cos(angle); }
function cy(size, radius, angle){ return size/2 + radius * Math.sin(angle); }

/* ============ СФЕРЫ: главный экран ============ */
function renderSpheres(){
  var scores = (state.spheres && state.spheres.lastScores) || {};
  var balance = getSpheresBalance(scores);
  var html = '<div class="page">';
  html += '<div class="title-xl">🎯 Сферы жизни</div>';
  html += '<div class="card">';
  html += renderSpheresCircle(scores, 280);
  html += '<div class="stat-grid mt-3">';
  html += '<div class="stat-item"><div class="stat-value">' + balance.avg + '</div><div class="stat-label">Средний</div></div>';
  html += '<div class="stat-item"><div class="stat-value">' + balance.balance + '%</div><div class="stat-label">Баланс</div></div>';
  html += '<div class="stat-item"><div class="stat-value">' + Object.keys(scores).length + '/7</div><div class="stat-label">Оценено</div></div>';
  html += '</div></div>';
  html += '<div class="card"><h2>📊 Все сферы</h2>';
  LIFE_SPHERES.forEach(function(s){
    var score = scores[s.id] || 0;
    var pct = score * 10;
    html += '<div class="list-row" onclick="openSphereDetail(\'' + s.id + '\')" style="border-left:3px solid ' + s.color + ';">';
    html += '<div class="list-icon" style="background:' + s.color + '22;color:' + s.color + ';">' + s.emoji + '</div>';
    html += '<div class="list-body"><div class="list-title">' + s.name + '</div>';
    html += '<div class="list-subtitle">' + esc(s.desc) + '</div>';
    html += '<div class="progress" style="margin-top:6px;height:4px;"><div class="progress-fill" style="width:' + pct + '%;background:' + s.color + ';"></div></div></div>';
    html += '<div class="list-value">' + (score > 0 ? score + '/10' : '—') + '</div>';
    html += '</div>';
  });
  html += '</div></div>';
  document.getElementById('app').innerHTML = html;
}

/* ============ СФЕРА: детали ============ */
function openSphereDetail(id){ currentSphereId = id; navigate('sphereDetail'); }
function renderSphereDetail(){
  var s = getSphere(currentSphereId);
  if(!s){ navigate('spheres'); return; }
  var score = ((state.spheres && state.spheres.lastScores) || {})[s.id] || 0;
  var recs = getSphereRecommendations(s.id, score);
  var habitsForSphere = getHabitsBySphere(s.id);
  var html = '<div class="page">';
  html += '<div style="text-align:center;margin-bottom:20px;">';
  html += '<div style="font-size:56px;">' + s.emoji + '</div>';
  html += '<div class="title-xl" style="color:' + s.color + ';">' + s.name + '</div>';
  html += '<div class="footnote text-secondary">' + esc(s.desc) + '</div>';
  html += '</div>';
  html += '<div class="card">';
  html += '<div style="text-align:center;padding:12px 0;"><div id="sphereScoreDisplay" style="font-size:64px;font-weight:800;color:' + s.color + ';">' + score + '</div>';
  html += '<div class="footnote text-tertiary" id="sphereScoreHint">' + (SPHERE_SCORE_HINTS[score] || '') + '</div></div>';
  html += '<input type="range" min="0" max="10" value="' + score + '" style="width:100%;margin:14px 0;" oninput="var v=parseInt(this.value);document.getElementById(\'sphereScoreDisplay\').textContent=v;document.getElementById(\'sphereScoreHint\').textContent=(window.SPHERE_SCORE_HINTS||{})[v]||\'\';" id="sphereScoreRange"/>';
  html += '<button class="btn btn-primary btn-block" onclick="saveSphereScore(\'' + s.id + '\')">💾 Сохранить оценку</button>';
  html += '</div>';
  if(recs.length){
    html += '<div class="card"><h2>💡 Рекомендации (' + recs.length + ')</h2>';
    recs.forEach(function(r){
      html += '<div style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--divider);">';
      html += '<div style="font-size:22px;">' + r.emoji + '</div>';
      html += '<div style="flex:1;"><div style="font-weight:700;font-size:13px;">' + esc(r.title) + '</div>';
      html += '<div class="footnote text-secondary">' + esc(r.text) + '</div></div></div>';
    });
    html += '</div>';
  }
  if(habitsForSphere.length){
    html += '<div class="card"><h2>🔄 Привычки для сферы (' + habitsForSphere.length + ')</h2>';
    habitsForSphere.slice(0,10).forEach(function(h){
      html += '<div class="list-row" onclick="addHabitFromWhy(\'' + h.id + '\')">';
      html += '<div class="list-icon">' + h.emoji + '</div>';
      html += '<div class="list-body"><div class="list-title">' + esc(h.title) + '</div>';
      html += '<div class="list-subtitle">' + esc(h.why[0].text) + '</div></div>';
      html += '<div class="list-chevron">+</div></div>';
    });
    html += '</div>';
  }
  html += '<div class="card"><h2>⚡ Быстрые действия</h2><div class="group-grid">';
  html += '<div class="group-item" onclick="openSphereTask(\'' + s.id + '\')"><div class="group-item-icon">➕</div><div class="group-item-label">Задача</div></div>';
  html += '<div class="group-item" onclick="openSphereHabit(\'' + s.id + '\')"><div class="group-item-icon">🔄</div><div class="group-item-label">Привычка</div></div>';
  html += '<div class="group-item" onclick="openSphereProject(\'' + s.id + '\')"><div class="group-item-icon">📁</div><div class="group-item-label">Проект</div></div>';
  html += '</div></div>';
  html += '</div>';
  document.getElementById('app').innerHTML = html;
}
function saveSphereScore(id){
  var r = document.getElementById('sphereScoreRange');
  if(!r) return;
  var val = parseInt(r.value);
  if(!state.spheres) state.spheres = {scores:{},lastScores:{},history:[]};
  if(!state.spheres.lastScores) state.spheres.lastScores = {};
  state.spheres.lastScores[id] = val;
  var t = today();
  if(!state.spheres.scores) state.spheres.scores = {};
  if(!state.spheres.scores[t]) state.spheres.scores[t] = {};
  state.spheres.scores[t][id] = val;
  var avg = 0, c = 0;
  LIFE_SPHERES.forEach(function(s){ if(state.spheres.lastScores[s.id]){ avg += state.spheres.lastScores[s.id]; c++; } });
  avg = c ? Math.round(avg/c*10)/10 : 0;
  var bal = getSpheresBalance(state.spheres.lastScores);
  state.spheres.history.push({date:t,avg:avg,balance:bal.balance,scores:JSON.parse(JSON.stringify(state.spheres.scores[t]))});
  if(state.spheres.history.length > 365) state.spheres.history = state.spheres.history.slice(-365);
  addXP(10, 'sphere_score');addPetXP(2);
  save();
  haptic('success');
  toast('✓ Оценено: ' + val + '/10','success');
  navigate('spheres');
}
function openSphereTask(sphereId){
  var s = getSphere(sphereId);
  openSheet('Задача · ' + s.name,
    '<div class="field"><label class="field-label">Название</label><input type="text" id="st-title"/></div>' +
    '<div class="field"><label class="field-label">Описание</label><textarea id="st-desc"></textarea></div>' +
    '<button class="btn btn-primary btn-block mt-3" onclick="saveSphereTask(\'' + sphereId + '\')">💾 Создать</button>');
}
function saveSphereTask(sphereId){
  var title = (document.getElementById('st-title')||{}).value || '';
  if(!title.trim()) return toast('Введи название','error');
  state.tasks.unshift({
    id:uid(), title:title.trim(),
    description:(document.getElementById('st-desc')||{}).value||'',
    sphereId:sphereId, category:getSphere(sphereId).name,
    planned_time:30, status:'pending', priority:'medium', created_at:nowISO()
  });
  save();
  haptic('success');
  closeSheet();
  toast('✓ Создано','success');
  navigate('sphereDetail');
}
function openSphereHabit(sphereId){
  var s = getSphere(sphereId);
  var habits = getHabitsBySphere(sphereId).slice(0,20);
  var html = '<div class="footnote text-secondary mb-3">Выбери привычку для сферы «' + s.name + '»</div>';
  habits.forEach(function(h){
    html += '<div class="list-row" onclick="addHabitFromWhy(\'' + h.id + '\')"><div class="list-icon">' + h.emoji + '</div><div class="list-body"><div class="list-title">' + esc(h.title) + '</div></div></div>';
  });
  openSheet('Привычки · ' + s.name, html);
}
function openSphereProject(sphereId){ openProjectEditor(null, sphereId); }

/* ============ ПРИВЫЧКИ ============ */
function getUserHabit(id){ return (state.habits||[]).find(function(h){ return h.id === id; }) || null; }
function isHabitDoneToday(id){
  var h = getUserHabit(id);
  return h ? h.lastCompletedDate === today() : false;
}
function getHabitsForToday(){
  var dow = new Date().getDay();
  var dowMon = dow === 0 ? 7 : dow;
  return (state.habits||[]).filter(function(h){
    if(!h.active) return true;
    var type = h.scheduleType || 'daily';
    if(type === 'daily') return true;
    if(type === 'custom' && h.weekDays) return h.weekDays.indexOf(dowMon) >= 0;
    return true;
  });
}
function toggleHabitToday(id){
 var h=getUserHabit(id);if(!h)return;var t=today(),wasDone=h.lastCompletedDate===t;
 if(wasDone){h.lastCompletedDate=null;h.streak=Math.max(0,(h.streak||1)-1);}
 else{h.streak=h.lastCompletedDate===yesterday()?(h.streak||0)+1:1;h.lastCompletedDate=t;if(h.streak>(h.bestStreak||0))h.bestStreak=h.streak;addXP(5,'habit');addPetXP(3);if(h.streak===7)addXP(25,'habit_streak_7');if(h.streak===30)addXP(100,'habit_streak_30');haptic('success');lifeOSCelebrate('✦');}
 if(!state.habitHistory[h.id])state.habitHistory[h.id]={};var old=state.habitHistory[h.id][t]||{};state.habitHistory[h.id][t]=Object.assign({},old,{completed:!wasDone,updatedAt:nowISO()});
 save();if(currentPage==='habitList')renderHabitList();else if(currentPage==='habitDetail')renderHabitDetail();else if(currentPage==='dashboard')renderDashboard();
}
function saveHabitCheckin(id){
 var h=getUserHabit(id);if(!h)return;if(!state.habitHistory[id])state.habitHistory[id]={};var old=state.habitHistory[id][today()]||{};
 state.habitHistory[id][today()]=Object.assign({},old,{quality:(document.getElementById('habitQuality')||{}).value||'full',note:((document.getElementById('habitNote')||{}).value||'').trim().slice(0,500),updatedAt:nowISO()});
 save();toast('Наблюдение сохранено','success');renderHabitDetail();
}
function getHabit66Progress(h){
  if(!h.startDate) return {pct:0,done:0,total:h.duration||22};
  var dur = h.duration || 22;
  var total = dur;
  var done = 0;
  if(state.habitHistory && state.habitHistory[h.id]){
    Object.keys(state.habitHistory[h.id]).forEach(function(d){
      if(state.habitHistory[h.id][d].completed) done++;
    });
  }
  var pct = Math.min(100, Math.round(done/total*100));
  var start = new Date(h.startDate);
  var end = new Date(start);
  end.setDate(end.getDate() + dur);
  return {pct:pct, done:done, total:total, startDate:h.startDate, endDate:end.toISOString().slice(0,10)};
}
function bindHabitSwipe(){
 var root=document.getElementById('app');if(!root||root.__lifeosHabitSwipeBound)return;root.__lifeosHabitSwipeBound=true;var start=null,suppressUntil=0;
 root.addEventListener('touchstart',function(e){var card=e.target.closest&&e.target.closest('[data-habit-swipe]');if(!card)return;var t=e.touches&&e.touches[0];if(!t)return;start={id:card.getAttribute('data-habit-swipe'),x:t.clientX,y:t.clientY};},{passive:true});
 root.addEventListener('touchend',function(e){if(!start)return;var t=e.changedTouches&&e.changedTouches[0],item=start;start=null;if(!t)return;var dx=t.clientX-item.x,dy=t.clientY-item.y;if(Math.abs(dx)>58&&Math.abs(dx)>Math.abs(dy)*1.3){e.preventDefault();e.stopPropagation();suppressUntil=Date.now()+450;toggleHabitToday(item.id);}},{passive:false});
 root.addEventListener('click',function(e){if(Date.now()>suppressUntil)return;var card=e.target.closest&&e.target.closest('[data-habit-swipe]');if(card){e.preventDefault();e.stopPropagation();}},true);
}
function renderHabitList(){
  var habits = state.habits || [];
  var todayHabits = getHabitsForToday();
  var doneToday = todayHabits.filter(function(h){ return h.lastCompletedDate === today(); }).length;
  var html = '<div class="page">';
  html += '<div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">🔄 Привычки</div>';
  html += '<div class="row" style="gap:6px;">';
  html += '<button class="btn btn-ghost btn-sm" onclick="navigate(\'habitCatalog\')">📚</button>';
  html += '<button class="btn btn-primary btn-sm" onclick="navigate(\'habitEditor\')">+</button>';
  html += '</div></div>';
  if(habits.length){
    html += '<div class="card card-gradient"><div style="font-size:12px;opacity:.9;">Сегодня</div><div style="font-size:36px;font-weight:800;">' + doneToday + ' / ' + todayHabits.length + '</div></div>';
    html += '<div class="footnote mb-2">Свайпни карточку влево или вправо, чтобы отметить или снять выполнение. Вертикальная прокрутка остаётся доступной.</div>';
    var cats = window.HABIT_CATEGORIES || [];
    html += '<div class="quick-tabs"><button class="quick-tab ' + (habitCatFilter==='all'?'active':'') + '" onclick="habitCatFilter=\'all\';renderHabitList()">Все (' + habits.length + ')</button>';
    cats.forEach(function(c){
      var cnt = habits.filter(function(h){ return h.category === c.id; }).length;
      if(!cnt) return;
      html += '<button class="quick-tab ' + (habitCatFilter===c.id?'active':'') + '" onclick="habitCatFilter=\'' + c.id + '\';renderHabitList()">' + c.emoji + ' ' + c.name + ' (' + cnt + ')</button>';
    });
    html += '</div>';
    var filtered = habitCatFilter === 'all' ? habits : habits.filter(function(h){ return h.category === habitCatFilter; });
    if(!filtered.length) html += '<div class="empty"><div class="empty-icon">🔄</div><div class="empty-title">Нет привычек</div></div>';
    else filtered.forEach(function(h){ html += renderHabitRow(h); });
  } else {
    html += '<div class="card"><div class="empty"><div class="empty-icon">🔄</div><div class="empty-title">Нет привычек</div><div class="empty-text">Выбери из 200+ шаблонов</div></div>';
    html += '<button class="btn btn-primary btn-block mt-3" onclick="navigate(\'habitCatalog\')">📚 Каталог</button>';
    html += '<button class="btn btn-ghost btn-block mt-2" onclick="navigate(\'habitEditor\')">➕ Создать</button></div>';
  }
  html += '</div>';
  document.getElementById('app').innerHTML = html;
  bindHabitSwipe();
}
function renderHabitRow(h){
  var tpl = getHabitTemplate(h.templateId);
  var emoji = h.emoji || (tpl ? tpl.emoji : '✅');
  var title = h.title || (tpl ? tpl.title : 'Привычка');
  var done = isHabitDoneToday(h.id);
  var prog = getHabit66Progress(h);
  var cat = (window.HABIT_CATEGORIES || []).find(function(c){ return c.id === h.category; });
  var catColor = cat ? cat.color : '#5b9eff';
  return '<div class="method-card" data-habit-swipe="' + esc(h.id) + '" aria-label="Привычка ' + esc(title) + '. Свайп влево или вправо отмечает выполнение" onclick="openHabitDetail(\'' + h.id + '\')" style="border-left:3px solid ' + catColor + ';touch-action:pan-y;">' +
    '<div class="method-header"><div class="method-emoji">' + emoji + '</div>' +
    '<div style="flex:1;min-width:0;"><div class="method-title">' + esc(title) + '</div>' +
    '<div class="method-cat">🔥 ' + (h.streak||0) + ' · Лучший ' + (h.bestStreak||0) + ' · ' + prog.done + '/' + prog.total + '</div></div>' +
    '<button class="task-checkbox ' + (done?'checked':'') + '" onclick="event.stopPropagation();toggleHabitToday(\'' + h.id + '\')" style="width:36px;height:36px;">' + (done?'✓':'') + '</button>' +
    '</div>' +
    '<div class="progress" style="margin-top:8px;height:5px;"><div class="progress-fill" style="width:' + prog.pct + '%;"></div></div>' +
  '</div>';
}
function renderHabitCatalog(){
  var tpls = window.HABIT_TEMPLATES || [];
  var habitsWhy = window.HABITS_WITH_WHY || [];
  var all = habitsWhy.length ? habitsWhy : tpls;
  var cats = window.HABIT_CATEGORIES || [];
  var html = '<div class="page"><div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">📚 Каталог</div><div class="badge badge-brand">' + all.length + '</div></div>';
  html += '<div class="quick-tabs"><button class="quick-tab ' + (habitCatFilter==='all'?'active':'') + '" onclick="habitCatFilter=\'all\';renderHabitCatalog()">Все</button>';
  cats.forEach(function(c){
    var cnt = all.filter(function(t){ return (t.cat||t.sphereId) === c.id; }).length;
    html += '<button class="quick-tab ' + (habitCatFilter===c.id?'active':'') + '" onclick="habitCatFilter=\'' + c.id + '\';renderHabitCatalog()">' + c.emoji + ' ' + c.name + ' (' + cnt + ')</button>';
  });
  html += '</div>';
  html += '<div class="search-bar"><span style="color:var(--text-3);">🔍</span><input type="search" placeholder="Поиск..." value="' + esc(habitSearch) + '" oninput="habitSearch=this.value;renderHabitCatalog()"/></div>';
  var filtered = habitCatFilter === 'all' ? all : all.filter(function(t){ return (t.cat||t.sphereId) === habitCatFilter; });
  if(habitSearch){ var q = habitSearch.toLowerCase(); filtered = filtered.filter(function(t){ return (t.title||'').toLowerCase().indexOf(q) >= 0; }); }
  filtered.forEach(function(t){
    var isWhy = !!t.why;
    var catId = t.cat || t.sphereId;
    var cat = cats.find(function(c){ return c.id === catId; });
    var catColor = cat ? cat.color : '#5b9eff';
    html += '<div class="method-card" style="border-left:3px solid ' + catColor + ';" onclick="' + (isWhy ? 'addHabitFromWhy(\'' + t.id + '\')' : 'addHabitFromTemplate(\'' + t.id + '\')') + '">';
    html += '<div class="method-header"><div class="method-emoji">' + t.emoji + '</div><div style="flex:1;"><div class="method-title">' + esc(t.title) + '</div><div class="method-cat">' + esc((t.desc||(t.why&&t.why[0].text)||'')) + '</div></div><div class="list-chevron">+</div></div></div>';
  });
  html += '</div>';
  document.getElementById('app').innerHTML = html;
}
function addHabitFromWhy(whyId){
  var hw = getHabitWithWhy(whyId);
  if(!hw) return;
  var newHabit = {
    id:uid(),
    templateId:whyId,
    category:hw.sphereId,
    sphereId:hw.sphereId,
    emoji:hw.emoji,
    title:hw.title,
    desc:hw.why[0].text,
    why:hw.why,
    how:hw.how,
    micro:hw.micro,
    trigger:hw.trigger,
    reward:hw.reward,
    science:hw.science,
    scheduleType:'daily',
    duration:hw.duration || 22,
    startDate:today(),
    streak:0, bestStreak:0, lastCompletedDate:null,
    active:true, createdAt:nowISO()
  };
  state.habits.push(newHabit);
  save();
  haptic('success');
  toast('✓ ' + hw.title,'success');
  closeSheet();
  currentHabitId = newHabit.id;
  navigate('habitDetail');
}
function addHabitFromTemplate(tplId){
  var tpl = getHabitTemplate(tplId);
  if(!tpl) return;
  var newHabit = {
    id:uid(), templateId:tplId,
    category:tpl.cat, emoji:tpl.emoji,
    title:tpl.title, desc:tpl.desc || '',
    scheduleType:tpl.defaultType || 'daily',
    targetCount:tpl.defaultTarget || null,
    duration:tpl.defaultDuration || 22,
    timeSlot:tpl.defaultTime || 'day',
    startDate:today(),
    microGoals:(tpl.microGoals||[]).slice(),
    streak:0, bestStreak:0, lastCompletedDate:null,
    active:true, createdAt:nowISO()
  };
  state.habits.push(newHabit);
  save();
  haptic('success');
  toast('✓ ' + tpl.title,'success');
  currentHabitId = newHabit.id;
  navigate('habitDetail');
}
function openHabitDetail(id){ currentHabitId = id; navigate('habitDetail'); }
function renderHabitHeatmap(h){
 var hist=state.habitHistory&&state.habitHistory[h.id]||{},todayKey=today(),end=new Date(todayKey+'T12:00:00'),dow=(end.getDay()+6)%7;end.setDate(end.getDate()+(6-dow));var start=new Date(end);start.setDate(start.getDate()-55);var cells=[],completed=0,tracked=0,elapsed=0;
 for(var i=0;i<56;i++){var d=new Date(start);d.setDate(start.getDate()+i);var key=d.toISOString().slice(0,10),record=hist[key],isFuture=key>todayKey,isDone=!!(record&&record.completed);if(!isFuture)elapsed++;if(record&&!isFuture)tracked++;if(isDone)completed++;cells.push('<div title="'+key+(isFuture?' · будущий день':isDone?' · выполнено':record?' · есть запись':' · нет отметки')+'" aria-label="'+key+(isFuture?' будущий день':isDone?' выполнено':record?' есть запись':' нет отметки')+'" style="aspect-ratio:1;border-radius:4px;background:'+(isFuture?'transparent':isDone?'var(--success)':record?'var(--warning)':'var(--surface-3)')+';opacity:'+(isFuture?'.12':isDone?'.95':record?'.65':'.55')+'"></div>');}
 return '<div class="card"><div class="row-between"><h2>🗓 История за 8 недель</h2><b>'+completed+'/'+elapsed+'</b></div><div class="footnote mb-2">Каждая ячейка — один день. Будущие даты не входят в расчёт; цвет показывает сохранённое выполнение, а не оценку дисциплины.</div><div style="display:grid;grid-template-rows:repeat(7,10px);grid-auto-flow:column;grid-auto-columns:minmax(0,1fr);gap:4px;overflow:hidden">'+cells.join('')+'</div><div class="row mt-2" style="gap:12px;flex-wrap:wrap"><span class="footnote">🟩 Выполнено</span><span class="footnote">🟨 Есть запись</span><span class="footnote">⬛ Нет отметки</span><span class="footnote">'+tracked+' дней с записями</span></div></div>';
}
function renderHabitDetail(){
  var h = getUserHabit(currentHabitId);
  if(!h){ navigate('habitList'); return; }
  var tpl = getHabitTemplate(h.templateId);
  var emoji = h.emoji || (tpl ? tpl.emoji : '✅');
  var title = h.title || (tpl ? tpl.title : 'Привычка');
  var prog = getHabit66Progress(h);
  var done = isHabitDoneToday(h.id);
  var html = '<div class="page">';
  html += '<div style="text-align:center;margin-bottom:20px;"><div style="font-size:56px;">' + emoji + '</div><div class="title-xl">' + esc(title) + '</div></div>';
  html += '<div class="card card-gradient"><div style="font-size:12px;opacity:.9;">Прогресс</div><div style="font-size:40px;font-weight:800;">' + prog.pct + '%</div><div style="font-size:12px;opacity:.9;margin-top:6px;">' + prog.done + '/' + prog.total + ' дней</div></div>';
  html += '<div class="stat-grid mb-4"><div class="stat-item"><div class="stat-value">' + (h.streak||0) + '</div><div class="stat-label">Серия</div></div><div class="stat-item"><div class="stat-value">' + (h.bestStreak||0) + '</div><div class="stat-label">Лучшая</div></div><div class="stat-item"><div class="stat-value">' + prog.done + '</div><div class="stat-label">Всего</div></div></div>';
  html += '<button class="btn ' + (done?'btn-success':'btn-primary') + ' btn-block mb-3" onclick="toggleHabitToday(\'' + h.id + '\')">' + (done ? '✓ Выполнено' : 'Отметить') + '</button>';
  if(h.why && h.why.length){
    html += '<div class="card"><h2>💡 Зачем это нужно</h2>';
    h.why.forEach(function(w, i){
      html += '<div style="margin-bottom:12px;"><div style="font-weight:700;font-size:13px;margin-bottom:4px;">' + (i+1) + '. ' + esc(w.text) + '</div>';
      html += '<div class="footnote text-secondary">' + esc(w.long) + '</div></div>';
    });
    html += '</div>';
  }
  if(h.how && h.how.length){
    html += '<div class="card"><h2>📋 Как внедрить</h2><ul style="padding-left:20px;">';
    h.how.forEach(function(x){ html += '<li style="margin-bottom:6px;">' + esc(x) + '</li>'; });
    html += '</ul></div>';
  }
  if(h.trigger||h.minimumAction||h.reward){
    html += '<div class="card"><h2>🧩 Твой план привычки</h2>';
    if(h.trigger)html += '<div class="list-row"><div class="list-icon">⏰</div><div class="list-body"><div class="list-title">Сигнал</div><div class="footnote">' + esc(h.trigger) + '</div></div></div>';
    if(h.minimumAction)html += '<div class="list-row"><div class="list-icon">👣</div><div class="list-body"><div class="list-title">Минимум на трудный день</div><div class="footnote">' + esc(h.minimumAction) + '</div></div></div>';
    if(h.reward)html += '<div class="list-row"><div class="list-icon">🎁</div><div class="list-body"><div class="list-title">Награда</div><div class="footnote">' + esc(h.reward) + '</div></div></div>';
    html += '</div>';
  }
  html += '<div class="footnote mb-2">Регулярность важнее идеальной серии. Пропуск не стирает накопленный прогресс — просто возвращайся к следующему удобному сигналу.</div>';
  if(h.science) html += '<div class="insight-card"><div class="insight-title">🔬 Наука</div><div class="insight-text">' + esc(h.science) + '</div></div>';
  html += renderHabitProgram(h);
  var hist=state.habitHistory&&state.habitHistory[h.id]||{},days=Object.keys(hist).filter(function(k){return hist[k]&&hist[k].completed;}),elapsed=Math.max(1,Math.floor((new Date(today())-new Date(h.startDate||today()))/86400000)+1),rate=Math.round(Math.min(1,days.length/elapsed)*100),last7=[];
  for(var z=6;z>=0;z--){var dt=new Date();dt.setDate(dt.getDate()-z);var ds=dt.toISOString().slice(0,10);last7.push({date:ds,done:!!(hist[ds]&&hist[ds].completed)});}
  html+=renderHabitHeatmap(h);
  html+='<div class="card"><h2>📊 Анализ привычки</h2><div class="grid-2"><div><b>'+rate+'%</b><div class="footnote">Выполнение с начала</div></div><div><b>'+days.length+'</b><div class="footnote">Успешных дней</div></div></div><div class="row mt-2" style="gap:5px">'+last7.map(function(x){return '<div title="'+x.date+'" style="flex:1;height:9px;border-radius:6px;background:'+(x.done?'var(--success)':'var(--surface-3)')+'"></div>';}).join('')+'</div><div class="footnote mt-2">Регулярность важнее серии. Пропуск не обнуляет накопленный результат.</div></div>';
  var todayLog=hist[today()]||{};
  html+='<div class="card"><h2>📝 Качество выполнения сегодня</h2><div class="field"><label class="field-label">Какой вариант сделал?</label><select id="habitQuality"><option value="full" '+(todayLog.quality==='full'?'selected':'')+'>Полная версия</option><option value="minimum" '+(todayLog.quality==='minimum'?'selected':'')+'>Минимальная версия</option><option value="adapted" '+(todayLog.quality==='adapted'?'selected':'')+'>Адаптированная версия</option></select></div><div class="field"><label class="field-label">Что помогло или помешало?</label><textarea id="habitNote" rows="2" maxlength="500" placeholder="Короткое наблюдение…">'+esc(todayLog.note||'')+'</textarea></div><button class="btn btn-ghost btn-block" onclick="saveHabitCheckin(\''+h.id+'\')">Сохранить наблюдение</button></div>';
  html += '<button class="btn btn-ghost btn-block mb-2" onclick="openHabitEditor(\'' + h.id + '\')">✏️ Редактировать</button>';
  html += '<button class="btn btn-danger btn-block" onclick="deleteHabit(\'' + h.id + '\')">🗑 Удалить</button>';
  html += '</div>';
  document.getElementById('app').innerHTML = html;
}
function renderHabitProgram(h){
 var plan=window.HABIT_22_DAY_SYSTEM||[],all=state.habitPrograms||{},record=all[h.id]||{days:{}},done=record.days||{},count=Object.keys(done).filter(function(k){return done[k]&&done[k].completed;}).length,next=plan.find(function(d){return !done[d.day]||!done[d.day].completed;});
 var html='<div class="card"><h2>🧭 Программа внедрения · 22 дня</h2><div class="footnote mb-2">Это структурированный цикл настройки и закрепления привычки, а не обещание, что автоматизм появится ровно за 22 дня.</div><div class="stat-value">'+count+' / 22</div><div class="progress mt-2"><div class="progress-fill" style="width:'+Math.round(count/22*100)+'%"></div></div>';
 if(next){
  html+='<div class="section-title mt-3">День '+next.day+' · '+esc(next.phase||'Практика')+'</div><h3>'+esc(next.title)+'</h3><div class="lesson-content">'+esc(next.text)+'</div><div class="footnote mt-2"><b>Задание:</b> '+esc(next.task)+'</div><div class="field mt-2"><label class="field-label">Что конкретно сделал или изменил?</label><textarea id="habitProgramNote" rows="2" maxlength="600" placeholder="Опиши действие и результат…"></textarea></div><button class="btn btn-primary btn-block" onclick="completeHabitProgramDay(\''+h.id+'\','+next.day+')">Подтвердить день '+next.day+'</button>';
 }else{
  html+='<div class="insight-card mt-2"><div class="insight-title">✓ Цикл из 22 шагов завершён</div><div class="insight-text">Продолжай отслеживать регулярность. Если привычка ещё требует усилий, продли практику и упрости условия.</div></div>';
 }
 html+='<div class="footnote mt-2">Отметки программы хранятся отдельно от ежедневных галочек привычки. Можно закрывать только следующий шаг, чтобы видеть реальную последовательность.</div></div>';
 return html;
}
function completeHabitProgramDay(id,day){
 var h=getUserHabit(id),plan=window.HABIT_22_DAY_SYSTEM||[],step=plan.find(function(x){return x.day===Number(day);}),note=((document.getElementById('habitProgramNote')||{}).value||'').trim();
 if(!h||!step)return;if(note.length<5)return toast('Коротко опиши, что именно сделал','warning');
 if(!state.habitPrograms)state.habitPrograms={};if(!state.habitPrograms[id])state.habitPrograms[id]={days:{}};
 var rows=state.habitPrograms[id].days||{},count=Object.keys(rows).filter(function(k){return rows[k]&&rows[k].completed;}).length;
 if(Number(day)!==count+1)return toast('Сначала заверши предыдущий шаг программы','warning');
 if(rows[day]&&rows[day].completed)return toast('Этот шаг уже сохранён','info');
 rows[day]={completed:true,completedAt:nowISO(),note:note};state.habitPrograms[id].days=rows;save();toast('Шаг программы сохранён','success');renderHabitDetail();
}
function openHabitEditor(id){ currentHabitId = id || null; navigate('habitEditor'); }
function renderHabitEditor(){
  var h = currentHabitId ? getUserHabit(currentHabitId) : null;
  var isNew = !h;
  if(isNew) h = {scheduleType:'daily', duration:22, timeSlot:'day', startDate:today(), microGoals:[]};
  var html = '<div class="page"><div class="title-xl">' + (isNew ? 'Новая привычка' : 'Редактировать') + '</div>';
  html += '<div class="card">';
  html += '<div class="field"><label class="field-label">Название *</label><input type="text" id="hab-title" value="' + esc(h.title||'') + '"/></div>';
  html += '<div class="field"><label class="field-label">Эмодзи</label><input type="text" id="hab-emoji" value="' + esc(h.emoji||'✅') + '" maxlength="4"/></div>';
  html += '<div class="field"><label class="field-label">Категория</label><select id="hab-category">';
  (window.HABIT_CATEGORIES||[]).forEach(function(c){
    html += '<option value="' + c.id + '"' + (h.category===c.id?' selected':'') + '>' + c.emoji + ' ' + c.name + '</option>';
  });
  html += '</select></div></div>';
  html += '<div class="card"><h2>🎯 Цель</h2>';
  html += '<div class="field"><label class="field-label">Длительность</label><select id="hab-duration">';
  [21,22,30,66,90,180,365].forEach(function(d){
    html += '<option value="' + d + '"' + ((h.duration||22)===d?' selected':'') + '>' + d + ' дней</option>';
  });
  html += '</select></div>';
  html += '<div class="field"><label class="field-label">Старт</label><input type="date" id="hab-start" value="' + (h.startDate||today()) + '"/></div>';
  html += '<div class="field"><label class="field-label">Сигнал / триггер</label><input type="text" id="hab-trigger" maxlength="180" placeholder="Например: сразу после завтрака" value="' + esc(h.trigger||'') + '"/></div>';
  html += '<div class="field"><label class="field-label">Минимальное действие</label><input type="text" id="hab-minimum" maxlength="180" placeholder="Например: открыть книгу и прочитать 1 страницу" value="' + esc(h.minimumAction||'') + '"/></div>';
  html += '<div class="field"><label class="field-label">Небольшая награда</label><input type="text" id="hab-reward" maxlength="120" placeholder="Например: отметить прогресс и отдохнуть" value="' + esc(h.reward||'') + '"/></div>';
  html += '<div class="footnote">Метод: привяжи привычку к стабильному событию, заранее упрости первый шаг и выбери приятное подкрепление. Пропуск — не провал.</div>';
  html += '</div>';
  html += '<button class="btn btn-primary btn-block mb-2" onclick="saveHabit()">' + (isNew ? '➕ Создать' : '💾 Сохранить') + '</button>';
  if(!isNew) html += '<button class="btn btn-danger btn-block" onclick="deleteHabit(\'' + h.id + '\')">🗑 Удалить</button>';
  html += '</div>';
  document.getElementById('app').innerHTML = html;
}
function saveHabit(){
  var title = (document.getElementById('hab-title')||{}).value || '';
  if(!title.trim()) return toast('Введите название','error');
  var emoji = (document.getElementById('hab-emoji')||{}).value || '✅';
  var category = (document.getElementById('hab-category')||{}).value || 'health';
  var duration = parseInt((document.getElementById('hab-duration')||{}).value) || 22;
  var startDate = (document.getElementById('hab-start')||{}).value || today();
  var trigger = (document.getElementById('hab-trigger')||{}).value || '';
  var minimumAction = (document.getElementById('hab-minimum')||{}).value || '';
  var reward = (document.getElementById('hab-reward')||{}).value || '';
  if(currentHabitId){
    var h = getUserHabit(currentHabitId);
    if(!h) return;
    h.title = title.trim();
    h.emoji = emoji;
    h.category = category;
    h.duration = duration;
    h.startDate = startDate;
    h.trigger = trigger.trim();
    h.minimumAction = minimumAction.trim();
    h.reward = reward.trim();
    h.updatedAt = nowISO();
  } else {
    var newH = {id:uid(), title:title.trim(), emoji:emoji, category:category, scheduleType:'daily', duration:duration, startDate:startDate, trigger:trigger.trim(), minimumAction:minimumAction.trim(), reward:reward.trim(), streak:0, bestStreak:0, lastCompletedDate:null, active:true, createdAt:nowISO()};
    state.habits.push(newH);
    currentHabitId = newH.id;
  }
  save();
  haptic('success');
  toast('✓ Сохранено','success');
  navigate('habitDetail');
}
function deleteHabit(id){
  if(!confirm('Удалить?')) return;
  state.habits = state.habits.filter(function(h){ return h.id !== id; });
  save();
  toast('Удалено','info');
  navigate('habitList');
}

/* ============ ПРОЕКТЫ ============ */
function renderProjects(){
  var projects = state.projects || [];
  var active = projects.filter(function(p){ return p.status === 'active'; }).length;
  var done = projects.filter(function(p){ return p.status === 'done'; }).length;
  var html = '<div class="page">';
  html += '<div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">📁 Проекты</div>';
  html += '<button class="btn btn-primary btn-sm" onclick="openProjectEditor(null)">+</button></div>';
  html += '<div class="stat-grid mb-4">';
  html += '<div class="stat-item"><div class="stat-value">' + projects.length + '</div><div class="stat-label">Всего</div></div>';
  html += '<div class="stat-item"><div class="stat-value">' + active + '</div><div class="stat-label">В работе</div></div>';
  html += '<div class="stat-item"><div class="stat-value">' + done + '</div><div class="stat-label">Готово</div></div>';
  html += '</div>';
  html += '<div class="card"><h2>📋 Шаблоны</h2>';
  html += '<div class="compact-grid">';
  (window.PROJECT_TEMPLATES||[]).slice(0,6).forEach(function(t){
    html += '<div class="compact-item" onclick="createProjectFromTemplate(\'' + t.id + '\')"><span class="compact-icon">' + t.emoji + '</span><span>' + t.name + '</span></div>';
  });
  html += '</div></div>';
  if(projects.length){
    html += '<div class="card"><h2>Мои проекты</h2>';
    projects.forEach(function(p){
      var st = getProjectStatus(p.status);
      html += '<div class="list-row" onclick="openProject(\'' + p.id + '\')" style="border-left:3px solid ' + st.color + ';">';
      html += '<div class="list-icon">' + (p.emoji||'📁') + '</div>';
      html += '<div class="list-body"><div class="list-title">' + esc(p.title) + '</div>';
      html += '<div class="list-subtitle">' + st.emoji + ' ' + st.name + (p.sphereId ? ' · ' + (getSphere(p.sphereId)||{}).name : '') + '</div>';
      html += '<div class="progress" style="margin-top:6px;height:4px;"><div class="progress-fill" style="width:' + (p.progress||0) + '%;"></div></div></div>';
      html += '<div class="list-value">' + (p.progress||0) + '%</div>';
      html += '</div>';
    });
    html += '</div>';
  } else {
    html += '<div class="card"><div class="empty"><div class="empty-icon">📁</div><div class="empty-title">Нет проектов</div><div class="empty-text">Создай из шаблона или с нуля</div></div></div>';
  }
  html += '</div>';
  document.getElementById('app').innerHTML = html;
}
function createProjectFromTemplate(tplId){
  var tpl = getProjectTemplate(tplId);
  if(!tpl) return;
  var p = {
    id:uid(), templateId:tplId, emoji:tpl.emoji,
    title:tpl.name, desc:tpl.desc,
    sphereId:tpl.sphereId,
    status:'planning', progress:0,
    tasks:(tpl.defaultTasks||[]).map(function(t){ return {id:uid(), title:t, done:false}; }),
    deadline:null, createdAt:nowISO()
  };
  state.projects.push(p);
  save();
  haptic('success');
  toast('✓ Проект создан','success');
  currentProjectId = p.id;
  navigate('projectDetail');
}
function openProject(id){ currentProjectId = id; navigate('projectDetail'); }
function renderProjectDetail(){
  var p = state.projects.find(function(x){ return x.id === currentProjectId; });
  if(!p){ navigate('projects'); return; }
  var st = getProjectStatus(p.status);
  var sp = p.sphereId ? getSphere(p.sphereId) : null;
  var html = '<div class="page">';
  html += '<div style="text-align:center;margin-bottom:20px;"><div style="font-size:56px;">' + (p.emoji||'📁') + '</div>';
  html += '<div class="title-xl">' + esc(p.title) + '</div>';
  if(sp) html += '<div class="footnote" style="color:' + sp.color + ';">' + sp.emoji + ' ' + sp.name + '</div>';
  html += '</div>';
  html += '<div class="card card-gradient"><div style="font-size:12px;opacity:.9;">Прогресс</div>';
  html += '<div style="font-size:40px;font-weight:800;">' + (p.progress||0) + '%</div>';
  html += '<div style="font-size:12px;opacity:.9;margin-top:6px;">' + st.emoji + ' ' + st.name + '</div></div>';
  html += '<div class="card"><h2>📋 Задачи проекта</h2>';
  (p.tasks||[]).forEach(function(t, i){
    html += '<div class="task-item ' + (t.done?'completed':'') + '" onclick="toggleProjectTask(' + i + ')">';
    html += '<div class="task-checkbox ' + (t.done?'checked':'') + '">' + (t.done?'✓':'') + '</div>';
    html += '<div class="task-content"><div class="task-title">' + esc(t.title) + '</div></div></div>';
  });
  html += '<button class="btn btn-ghost btn-sm mt-2" onclick="addProjectTask()">+ Добавить</button>';
  html += '</div>';
  html += '<div class="card"><h2>📊 Статус</h2>';
  html += '<div class="row" style="gap:6px;">';
  (window.PROJECT_STATUSES||[]).forEach(function(s){
    var active = p.status === s.id;
    html += '<button class="btn ' + (active?'btn-primary':'btn-ghost') + ' btn-sm" onclick="setProjectStatus(\'' + s.id + '\')">' + s.emoji + ' ' + s.name + '</button>';
  });
  html += '</div></div>';
  html += '<button class="btn btn-ghost btn-block mb-2" onclick="openProjectEditor(\'' + p.id + '\')">✏️ Редактировать</button>';
  html += '<button class="btn btn-danger btn-block" onclick="deleteProject(\'' + p.id + '\')">🗑 Удалить</button>';
  html += '</div>';
  document.getElementById('app').innerHTML = html;
}
function toggleProjectTask(i){
  var p = state.projects.find(function(x){ return x.id === currentProjectId; });
  if(!p || !p.tasks[i]) return;
  p.tasks[i].done = !p.tasks[i].done;
  var done = p.tasks.filter(function(t){ return t.done; }).length;
  p.progress = p.tasks.length ? Math.round(done/p.tasks.length*100) : 0;
  if(p.progress === 100 && p.status !== 'done') p.status = 'done';
  addXP(5, 'task');addPetXP(2);
  save();
  haptic('success');
  renderProjectDetail();
}
function addProjectTask(){
  var title = prompt('Задача:');
  if(!title) return;
  var p = state.projects.find(function(x){ return x.id === currentProjectId; });
  if(!p) return;
  if(!p.tasks) p.tasks = [];
  p.tasks.push({id:uid(), title:title, done:false});
  save();
  renderProjectDetail();
}
function setProjectStatus(s){
  var p = state.projects.find(function(x){ return x.id === currentProjectId; });
  if(!p) return;
  p.status = s;
  save();
  renderProjectDetail();
}
function deleteProject(id){
  if(!confirm('Удалить проект?')) return;
  state.projects = state.projects.filter(function(p){ return p.id !== id; });
  save();
  toast('Удалено','info');
  navigate('projects');
}
function openProjectEditor(id, sphereId){
  var p = id ? state.projects.find(function(x){ return x.id === id; }) : null;
  var isNew = !p;
  if(isNew) p = {status:'planning', progress:0, tasks:[], sphereId:sphereId||null};
  var html = '<div class="page"><div class="title-xl">' + (isNew?'Новый проект':'Редактировать') + '</div>';
  html += '<div class="card">';
  html += '<div class="field"><label class="field-label">Название *</label><input type="text" id="proj-title" value="' + esc(p.title||'') + '"/></div>';
  html += '<div class="field"><label class="field-label">Описание</label><textarea id="proj-desc">' + esc(p.desc||'') + '</textarea></div>';
  html += '<div class="field"><label class="field-label">Эмодзи</label><input type="text" id="proj-emoji" value="' + esc(p.emoji||'📁') + '" maxlength="4"/></div>';
  html += '<div class="field"><label class="field-label">Сфера</label><select id="proj-sphere"><option value="">—</option>';
  (window.LIFE_SPHERES||[]).forEach(function(s){
    html += '<option value="' + s.id + '"' + (p.sphereId===s.id?' selected':'') + '>' + s.emoji + ' ' + s.name + '</option>';
  });
  html += '</select></div></div>';
  html += '<button class="btn btn-primary btn-block" onclick="saveProject(' + (id?"'"+id+"'":'null') + ')">' + (isNew?'➕ Создать':'💾 Сохранить') + '</button>';
  html += '</div>';
  document.getElementById('app').innerHTML = html;
}
function saveProject(id){
  var title = (document.getElementById('proj-title')||{}).value || '';
  if(!title.trim()) return toast('Введи название','error');
  var p = id ? state.projects.find(function(x){ return x.id === id; }) : null;
  var isNew = !p;
  if(!p){ p = {id:uid(), tasks:[], status:'planning', progress:0, createdAt:nowISO()}; state.projects.push(p); }
  p.title = title.trim();
  p.desc = (document.getElementById('proj-desc')||{}).value || '';
  p.emoji = (document.getElementById('proj-emoji')||{}).value || '📁';
  p.sphereId = (document.getElementById('proj-sphere')||{}).value || null;
  p.updatedAt = nowISO();
  save();
  haptic('success');
  toast(isNew?'✓ Создан':'💾 Сохранено','success');
  currentProjectId = p.id;
  navigate('projectDetail');
}

/* ============ КОУЧ ============ */
function renderCoach(){
  var coach = state.coach || {};
  var style = getCoachStyle(coach.style || 'balanced');
  var scores = (state.spheres && state.spheres.lastScores) || {};
  var balance = getSpheresBalance(scores);
  var tip = getRandomCoachTip(balance.weakest ? balance.weakest.id : 'health');
  var html = '<div class="page">';
  html += '<div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">💬 AI-Коуч</div>';
  html += '<button class="btn btn-ghost btn-sm" onclick="navigate(\'coachSettings\')">⚙️</button></div>';
  html += '<div class="card card-gradient">';
  html += '<div style="display:flex;align-items:center;gap:12px;">';
  html += '<div style="font-size:44px;">' + style.emoji + '</div>';
  html += '<div style="flex:1;"><div style="font-size:18px;font-weight:800;">' + style.name + '</div>';
  html += '<div style="font-size:12px;opacity:.9;">' + style.desc + '</div></div></div>';
  html += '<div style="font-size:12px;opacity:.9;margin-top:10px;">Строгость: ' + (coach.strictness||5) + '/10</div>';
  html += '</div>';
  if(tip){
    html += '<div class="card"><h2>💡 Совет дня</h2>';
    html += '<div style="display:flex;gap:12px;"><div style="font-size:32px;">' + tip.emoji + '</div>';
    html += '<div style="flex:1;font-size:14px;line-height:1.5;">' + esc(tip.text) + '</div></div></div>';
  }
  /* Открыть чат */
  html += '<button class="btn btn-primary btn-block mb-3" onclick="navigate(\'coachChat\')">💬 Открыть чат с коучем</button>';
  /* Стили */
  html += '<div class="card"><h2>🎭 Стили</h2>';
  (window.COACH_STYLES||[]).forEach(function(s){
    var active = (coach.style||'balanced') === s.id;
    html += '<div class="list-row" onclick="setCoachStyle(\'' + s.id + '\')" style="' + (active?'border-left:3px solid var(--brand);':'') + '">';
    html += '<div class="list-icon">' + s.emoji + '</div>';
    html += '<div class="list-body"><div class="list-title">' + s.name + '</div>';
    html += '<div class="list-subtitle">' + esc(s.desc) + '</div></div>';
    if(active) html += '<div class="badge badge-success">✓</div>';
    html += '</div>';
  });
  html += '</div>';
  html += '<div class="card"><h2>📝 Примеры ответов</h2>';
  style.examples.forEach(function(e){
    html += '<div style="padding:8px 0;border-bottom:1px solid var(--divider);font-size:13px;font-style:italic;color:var(--text-2);">"' + esc(e) + '"</div>';
  });
  html += '</div>';
  html += '<button class="btn btn-primary btn-block" onclick="navigate(\'coachSettings\')">⚙️ Настроить коуча</button>';
  html += '</div>';
  document.getElementById('app').innerHTML = html;
}
function setCoachStyle(id){
  if(!state.coach) state.coach = {};
  state.coach.style = id;
  save();
  haptic('success');
  toast('✓ ' + (getCoachStyle(id)||{}).name,'success');
  renderCoach();
}
function renderCoachSettings(){
  var coach = state.coach || {};
  var html = '<div class="page"><div class="title-xl">⚙️ Настройки коуча</div>';
  html += '<div class="card"><h2>🎭 Стиль общения</h2>';
  (window.COACH_STYLES||[]).forEach(function(s){
    var active = (coach.style||'balanced') === s.id;
    html += '<button class="btn ' + (active?'btn-primary':'btn-ghost') + ' btn-block mb-2" onclick="setCoachStyle(\'' + s.id + '\');renderCoachSettings()">' + s.emoji + ' ' + s.name + '</button>';
  });
  html += '</div>';
  html += '<div class="card"><h2>🎚 Строгость: <span id="strictness-val">' + (coach.strictness||5) + '/10</span></h2>';
  html += '<input type="range" min="1" max="10" value="' + (coach.strictness||5) + '" style="width:100%;" oninput="document.getElementById(\'strictness-val\').textContent=this.value+\'/10\';" id="strictness-range"/>';
  html += '<div class="footnote text-secondary mb-3" style="text-align:center;" id="strictness-desc">' + ((window.STRICTNESS_LEVELS||{})[coach.strictness||5]||'') + '</div>';
  html += '<button class="btn btn-primary btn-block" onclick="saveStrictness()">💾 Сохранить строгость</button>';
  html += '</div>';
  var settings = coach.settings || {};
  html += '<div class="card"><h2>🔔 Уведомления коуча</h2>';
  ['morningGreeting','eveningSummary','dailyTips','weeklyReport','monthlyReport','motivationalQuotes','personalizedAdvice'].forEach(function(k){
    var lbl = {morningGreeting:'🌅 Утреннее приветствие',eveningSummary:'🌆 Вечерний обзор',dailyTips:'💡 Советы дня',weeklyReport:'📈 Отчёт недели',monthlyReport:'📊 Отчёт месяца',motivationalQuotes:'🔥 Мотивация',personalizedAdvice:'🎯 Персональные советы'}[k];
    html += '<div class="row-between mb-2"><div class="list-title">' + lbl + '</div>';
    html += '<button class="btn ' + (settings[k]?'btn-primary':'btn-ghost') + ' btn-sm" onclick="toggleCoachSetting(\'' + k + '\')">' + (settings[k]?'Вкл':'Выкл') + '</button></div>';
  });
  html += '</div>';
  html += '</div>';
  document.getElementById('app').innerHTML = html;
}
function saveStrictness(){
  var r = document.getElementById('strictness-range');
  if(!r) return;
  if(!state.coach) state.coach = {};
  state.coach.strictness = parseInt(r.value);
  save();
  toast('✓ Сохранено','success');
}
function toggleCoachSetting(key){
  if(!state.coach) state.coach = {};
  if(!state.coach.settings) state.coach.settings = {};
  state.coach.settings[key] = !state.coach.settings[key];
  save();
  renderCoachSettings();
}
function renderCoachChat(){
  if(!state.coach) state.coach = {messages:[]};
  if(!state.coach.messages) state.coach.messages = [];
  var persona = state.settings.activePersona || 'coach';
  var p = (window.PERSONAS||{})[persona] || {name:'Коуч', emoji:'💬'};
  var html = '<div class="page">';
  html += '<div class="row-between mb-3"><div class="title-xl" style="margin:0;">💬 ' + p.name + '</div>';
  html += '<button class="btn btn-ghost btn-sm" onclick="navigate(\'coach\')">←</button></div>';
  html += '<div class="card" style="min-height:340px;max-height:58vh;overflow-y:auto;" id="coachChatBox"><div class="chat">';
  if(state.coach.messages.length){
    state.coach.messages.forEach(function(m){
      html += '<div class="msg ' + (m.role==='user'?'msg-user':'msg-bot') + '">' + esc(m.text) + '</div>';
    });
  } else {
    html += '<div class="empty"><div class="empty-icon">💬</div><div class="empty-title">Начни диалог</div><div class="empty-text">Напиши, что тревожит — разберём вместе</div></div>';
  }
  html += '</div></div>';
  html += '<div class="row" style="margin-top:10px;"><input type="text" id="coachInput" placeholder="Сообщение..." style="flex:1;" onkeydown="if(event.key===\'Enter\'){event.preventDefault();sendCoachMsg();}"/><button class="btn btn-primary btn-icon" onclick="sendCoachMsg()">➤</button></div>';
  html += '</div>';
  document.getElementById('app').innerHTML = html;
  var box = document.getElementById('coachChatBox');
  if(box) box.scrollTop = box.scrollHeight;
}
function sendCoachMsg(){
  var input = document.getElementById('coachInput');
  if(!input) return;
  var text = input.value.trim();
  if(!text) return;
  input.value = '';
  if(!state.coach) state.coach = {messages:[]};
  if(!state.coach.messages) state.coach.messages = [];
  state.coach.messages.push({id:uid(), role:'user', text:text, timestamp:nowISO()});
  save();
  renderCoachChat();
  setTimeout(function(){
    var reply = fallbackReply(state.settings.activePersona || 'coach', text);
    state.coach.messages.push({id:uid(), role:'bot', text:reply, timestamp:nowISO()});
    save();
    renderCoachChat();
  }, 400);
}
function fallbackReply(persona, text){
  text = text || '';
  if(/суицид|покончить|не хочу жить/i.test(text)) return '🆘 8-800-2000-122 · 103 · findahelpline.com';
  var replies = {
    coach:'Понял тебя. Давай разберём по шагам: 1) Что сейчас важнее всего? 2) Что мешает? 3) Какой 1 маленький шаг сделаешь сегодня?',
    psych:'Слышу тебя. Что ты чувствуешь прямо сейчас? Назови эмоцию — 1 слово. Дальше разберём.',
    strict:'Хватит искать причины. Бери и делай. Один шаг сейчас — какой?',
    friendly:'Я рядом 💚 Ты не один. Что тебе сейчас нужнее — поддержка или план?',
    philosophical:'Стоики сказали бы: раздели на то, что в твоей власти, и то, что нет. С чем работаем?'
  };
  return replies[persona] || 'Слышу тебя. Расскажи подробнее — что именно происходит?';
}

/* ============ EXPORTS ============ */
window.renderDashboard = renderDashboard;
window.renderWalks = renderWalks;
window.addWalkEntry = addWalkEntry;
window.deleteWalkEntry = deleteWalkEntry;
window.renderSpheres = renderSpheres;
window.openSphereDetail = openSphereDetail;
window.saveSphereScore = saveSphereScore;
window.saveSphereTask = saveSphereTask;
window.openSphereTask = openSphereTask;
window.openSphereHabit = openSphereHabit;
window.openSphereProject = openSphereProject;
window.getUserHabit = getUserHabit;
window.isHabitDoneToday = isHabitDoneToday;
window.getHabitsForToday = getHabitsForToday;
window.toggleHabitToday = toggleHabitToday;
window.getHabit66Progress = getHabit66Progress;
window.renderHabitList = renderHabitList;
window.renderHabitCatalog = renderHabitCatalog;
window.addHabitFromWhy = addHabitFromWhy;
window.addHabitFromTemplate = addHabitFromTemplate;
window.openHabitDetail = openHabitDetail;
window.completeHabitProgramDay = completeHabitProgramDay;
window.saveHabitCheckin = saveHabitCheckin;
window.openHabitEditor = openHabitEditor;
window.saveHabit = saveHabit;
window.deleteHabit = deleteHabit;
window.renderProjects = renderProjects;
window.createProjectFromTemplate = createProjectFromTemplate;
window.openProject = openProject;
window.toggleProjectTask = toggleProjectTask;
window.addProjectTask = addProjectTask;
window.setProjectStatus = setProjectStatus;
window.deleteProject = deleteProject;
window.openProjectEditor = openProjectEditor;
window.saveProject = saveProject;
window.renderCoach = renderCoach;
window.setCoachStyle = setCoachStyle;
window.renderCoachSettings = renderCoachSettings;
window.saveStrictness = saveStrictness;
window.toggleCoachSetting = toggleCoachSetting;
window.renderCoachChat = renderCoachChat;
window.sendCoachMsg = sendCoachMsg;
window.fallbackReply = fallbackReply;

/* ============ КОНЕЦ ЧАСТИ 2/4 ============ */

/* Продолжение в части 3/4: задачи, обучение (все рендеры), курсы, зрение, детокс 62 */

/* ============================================================
   LIFE OS — APP.js v47 — ЧАСТЬ 3/4
   Задачи, Матрица, Редактор задач, Обучение (все рендеры),
   English, Skills, Курсы + renderCourseGeneric, Зрение (полное),
   Детокс-курс 62, FSRS-5
   ============================================================ */

/* ============ ЗАДАЧИ ============ */
function getEisenhowerQuadrant(t){
  var important = t.priority === 'high' || t.priority === 'medium' || (t.difficulty||0) >= 4;
  var urgent = t.due_date ? daysBetween(today(), t.due_date.slice(0,10)) <= 2 : false;
  if(important && urgent) return 'q1';
  if(important && !urgent) return 'q2';
  if(!important && urgent) return 'q3';
  return 'q4';
}
function getEisenhowerPriority(t){
  var q = getEisenhowerQuadrant(t);
  return q === 'q1' ? 1 : q === 'q2' ? 2 : q === 'q3' ? 3 : 4;
}
function taskRow(t){
  var pColors = {high:'high', medium:'medium', low:'low'};
  var checked = t.status === 'completed';
  var overdue = t.due_date && !checked && t.due_date.slice(0,10) < today();
  var quad = getEisenhowerQuadrant(t);
  var qEmoji = {q1:'🔥', q2:'📌', q3:'⚡', q4:'🗑'}[quad];
  var color = t.color ? ((window.TASK_COLORS||[]).find(function(c){ return c.id === t.color; })||{}).hex : null;
  var cl = t.checklist || [];
  var clDone = cl.filter(function(c){ return c.done; }).length;
  return '<div class="task-item ' + (checked?'completed':'') + '" style="' + (color?'border-left:3px solid ' + color + ';':'') + '" onclick="openEntityEditor(\'task\',\'' + t.id + '\')">' +
    '<div class="priority-bar ' + (pColors[t.priority]||'medium') + '"></div>' +
    '<button class="task-checkbox ' + (checked?'checked':'') + '" onclick="event.stopPropagation();toggleTask(\'' + t.id + '\')">' + (checked?'✓':'') + '</button>' +
    '<div class="task-content"><div class="task-title">' + qEmoji + ' ' + esc(t.title) + '</div>' +
    '<div class="task-meta"><span>' + (t.planned_time||0) + ' мин</span>' +
    (t.category ? '<span>· ' + esc(t.category) + '</span>' : '') +
    (t.due_date ? '<span>· 📅 ' + t.due_date.slice(0,10) + '</span>' : '') +
    (cl.length ? '<span>· ☑ ' + clDone + '/' + cl.length + '</span>' : '') +
    (overdue ? '<span style="color:var(--danger);">· ⚠️</span>' : '') +
    '</div></div></div>';
}
function renderTasks(){
  var counts = {
    all: state.tasks.length,
    pending: state.tasks.filter(function(t){ return t.status === 'pending'; }).length,
    completed: state.tasks.filter(function(t){ return t.status === 'completed'; }).length
  };
  var filtered = state.tasks.slice();
  if(taskFilter !== 'all') filtered = filtered.filter(function(t){ return t.status === taskFilter; });
  if(taskSearch){ var q = taskSearch.toLowerCase(); filtered = filtered.filter(function(t){ return (t.title||'').toLowerCase().indexOf(q) >= 0; }); }
  var html = '<div class="page">';
  html += '<div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">✅ Задачи</div>';
  html += '<div class="row" style="gap:6px;">';
  html += '<button class="btn btn-ghost btn-sm" onclick="navigate(\'matrix\')">🔢</button>';
  html += '<button class="btn btn-primary btn-sm" onclick="openEntityEditor(\'task\',null)">+</button>';
  html += '</div></div>';
  html += '<div class="search-bar"><span style="color:var(--text-3);font-size:18px;">🔍</span><input type="search" placeholder="Поиск..." value="' + esc(taskSearch) + '" oninput="taskSearch=this.value;renderTasks()"/></div>';
  html += '<div class="segmented" style="margin-bottom:14px;">';
  html += '<button class="segmented-item ' + (taskFilter==='all'?'active':'') + '" onclick="taskFilter=\'all\';renderTasks()">Все (' + counts.all + ')</button>';
  html += '<button class="segmented-item ' + (taskFilter==='pending'?'active':'') + '" onclick="taskFilter=\'pending\';renderTasks()">Активные (' + counts.pending + ')</button>';
  html += '<button class="segmented-item ' + (taskFilter==='completed'?'active':'') + '" onclick="taskFilter=\'completed\';renderTasks()">Готовые (' + counts.completed + ')</button>';
  html += '</div>';
  if(filtered.length){ filtered.forEach(function(t){ html += taskRow(t); }); }
  else { html += '<div class="empty"><div class="empty-icon">📋</div><div class="empty-title">' + (taskSearch?'Ничего не найдено':'Нет задач') + '</div></div>'; }
  html += '</div>';
  document.getElementById('app').innerHTML = html;
}
function toggleTask(id){
  var t = state.tasks.find(function(x){ return x.id === id; });
  if(!t) return;
  t.status = t.status === 'completed' ? 'pending' : 'completed';
  if(t.status === 'completed'){
    t.completedAt = nowISO();
    state.stats.totalTasksDone = (state.stats.totalTasksDone||0) + 1;
    addXP(10, 'task');
    addPetXP(5);
    lifeOSCelebrate('✓');
  }
  save();
  haptic('success');
  checkAchievements();
  if(currentPage === 'tasks') renderTasks();
  else renderDashboard();
}
function renderMatrix(){
  var pending = state.tasks.filter(function(t){ return t.status === 'pending'; });
  var q1 = [], q2 = [], q3 = [], q4 = [];
  pending.forEach(function(t){
    var q = getEisenhowerQuadrant(t);
    if(q === 'q1') q1.push(t);
    else if(q === 'q2') q2.push(t);
    else if(q === 'q3') q3.push(t);
    else q4.push(t);
  });
  var html = '<div class="page"><div class="title-xl">🔢 Матрица Эйзенхауэра</div>';
  html += '<div class="matrix-grid-2x2">';
  html += '<div class="matrix-quadrant matrix-q1"><div class="matrix-q-title">🔥 Q1</div><div class="matrix-q-count">' + q1.length + '</div><div class="matrix-q-sub">Делай сейчас</div></div>';
  html += '<div class="matrix-quadrant matrix-q2"><div class="matrix-q-title">📌 Q2</div><div class="matrix-q-count">' + q2.length + '</div><div class="matrix-q-sub">Планируй</div></div>';
  html += '<div class="matrix-quadrant matrix-q3"><div class="matrix-q-title">⚡ Q3</div><div class="matrix-q-count">' + q3.length + '</div><div class="matrix-q-sub">Делегируй</div></div>';
  html += '<div class="matrix-quadrant matrix-q4"><div class="matrix-q-title">🗑 Q4</div><div class="matrix-q-count">' + q4.length + '</div><div class="matrix-q-sub">Удали</div></div>';
  html += '</div></div>';
  document.getElementById('app').innerHTML = html;
}

/* ============ РЕДАКТОР ЗАДАЧ ============ */
var _clBuffer = [];
function openEntityEditor(type, id){
  if(type === 'task') return openTaskEditorV2(id);
}
function openTaskEditorV2(id){
  var t = id ? state.tasks.find(function(x){ return x.id === id; }) : null;
  var isNew = !t;
  if(isNew) t = {checklist:[], priority:'medium', planned_time:30, color:'peacock', difficulty:3};
  _clBuffer = JSON.parse(JSON.stringify(t.checklist || []));
  var html = '';
  html += '<div class="field"><label class="field-label">Название *</label><input type="text" id="ent-title" value="' + esc(t.title||'') + '"/></div>';
  html += '<div class="field"><label class="field-label">Описание</label><textarea id="ent-desc">' + esc(t.description||'') + '</textarea></div>';
  html += '<div class="field"><label class="field-label">Сфера</label><select id="ent-sphere"><option value="">—</option>';
  (window.LIFE_SPHERES||[]).forEach(function(s){
    html += '<option value="' + s.id + '"' + (t.sphereId===s.id?' selected':'') + '>' + s.emoji + ' ' + s.name + '</option>';
  });
  html += '</select></div>';
  html += '<div class="row" style="gap:8px;">';
  html += '<div style="flex:1;"><label class="field-label">Приоритет</label><select id="ent-priority">';
  ['low','medium','high'].forEach(function(p){
    var lbl = {low:'🟢 Низкий', medium:'🟡 Средний', high:'🔴 Высокий'}[p];
    html += '<option value="' + p + '"' + (t.priority===p?' selected':'') + '>' + lbl + '</option>';
  });
  html += '</select></div>';
  html += '<div style="flex:1;"><label class="field-label">Сложность</label><select id="ent-difficulty">';
  [1,2,3,4,5].forEach(function(d){
    html += '<option value="' + d + '"' + (t.difficulty===d?' selected':'') + '>' + '●'.repeat(d) + ' ' + d + '/5</option>';
  });
  html += '</select></div></div>';
  html += '<div class="row" style="gap:8px;">';
  html += '<div style="flex:1;"><label class="field-label">Категория</label><input type="text" id="ent-category" value="' + esc(t.category||'Работа') + '"/></div>';
  html += '<div style="flex:1;"><label class="field-label">Мин</label><input type="number" id="ent-time" value="' + (t.planned_time||30) + '" min="0"/></div></div>';
  html += '<div class="row" style="gap:8px;">';
  html += '<div style="flex:1;"><label class="field-label">Старт</label><input type="datetime-local" id="ent-start" value="' + (t.start_date?t.start_date.slice(0,16):'') + '"/></div>';
  html += '<div style="flex:1;"><label class="field-label">Дедлайн</label><input type="datetime-local" id="ent-due" value="' + (t.due_date?t.due_date.slice(0,16):'') + '"/></div></div>';
  html += '<div class="field"><label class="field-label">Чек-лист</label><div id="cl-list"></div>';
  html += '<div class="row" style="gap:8px;flex-wrap:wrap"><button type="button" class="btn btn-ghost btn-sm mt-2" onclick="addChecklistItem()">+ Подзадача</button><button type="button" class="btn btn-ghost btn-sm mt-2" onclick="suggestTaskSteps()">✧ Разбить на шаги</button></div></div>';
  html += '<button class="btn btn-primary btn-block mt-3" onclick="saveTaskV2(' + (id?"'"+id+"'":'null') + ')">' + (isNew?'➕ Создать':'💾 Сохранить') + '</button>';
  if(!isNew) html += '<button class="btn btn-danger btn-block mt-2" onclick="deleteTaskV2(\'' + id + '\')">🗑 Удалить</button>';
  openSheet(isNew?'Новая задача':'Задача', html);
  rerenderChecklist();
}
function rerenderChecklist(){
  var box = document.getElementById('cl-list');
  if(!box) return;
  var html = '';
  _clBuffer.forEach(function(item, i){
    html += '<div style="display:flex;gap:6px;margin-bottom:6px;align-items:center;">';
    html += '<button type="button" class="task-checkbox ' + (item.done?'checked':'') + '" onclick="toggleChecklistItem(' + i + ')" style="width:24px;height:24px;font-size:12px;flex-shrink:0;">' + (item.done?'✓':'') + '</button>';
    html += '<input type="text" value="' + esc(item.title) + '" onchange="updateChecklistItem(' + i + ',this.value)" style="flex:1;"/>';
    html += '<button type="button" class="btn btn-ghost btn-xs" onclick="removeChecklistItem(' + i + ')">🗑</button>';
    html += '</div>';
  });
  box.innerHTML = html;
}
function addChecklistItem(){ _clBuffer.push({title:'', done:false}); rerenderChecklist(); }
function suggestTaskSteps(){
  var title=(document.getElementById('ent-title')||{}).value||'';
  var text=title.toLowerCase();
  var steps;
  if(/разработ|исправ|код|сайт|приложен|программ/.test(text))steps=['Воспроизвести и точно описать результат/ошибку','Найти причину и проверить связанные части','Составить короткий план безопасных изменений','Внести изменения небольшими шагами','Проверить сценарии, ошибки и побочные эффекты','Зафиксировать результат и обновить проект'];
  else if(/изуч|выуч|обуч|прочита|запомн|экзамен/.test(text))steps=['Определить конкретный результат обучения','Разделить материал на небольшие блоки','Изучить первый блок и закрыть источник','Воспроизвести главное по памяти','Проверить ошибки и создать карточки повторения','Запланировать интервальные повторения'];
  else if(/напис|созда|подготов|состав|оформ/.test(text))steps=['Уточнить цель и критерии готового результата','Собрать необходимые материалы и вводные','Сделать первый черновой вариант','Проверить полноту и исправить недочёты','Завершить и сохранить результат'];
  else steps=['Сформулировать, что будет считаться готовым результатом','Подготовить материалы и убрать главное препятствие','Сделать самый маленький первый шаг','Выполнить основную часть','Проверить результат и закрыть задачу'];
  var added=0;
  steps.forEach(function(step){if(_clBuffer.length<20&&!_clBuffer.some(function(x){return String(x.title||'').toLowerCase()===step.toLowerCase();})){_clBuffer.push({title:step,done:false});added++;}});
  rerenderChecklist();
  toast(added?'Добавлено шагов: '+added:'Чек-лист уже заполнен','success');
}
function removeChecklistItem(i){ _clBuffer.splice(i,1); rerenderChecklist(); }
function toggleChecklistItem(i){ if(!_clBuffer[i]) return; _clBuffer[i].done = !_clBuffer[i].done; rerenderChecklist(); }
function updateChecklistItem(i, v){ if(!_clBuffer[i]) return; _clBuffer[i].title = v; }
function saveTaskV2(id){
  var title = (document.getElementById('ent-title')||{}).value || '';
  if(!title.trim()) return toast('Введите название','error');
  var t = id ? state.tasks.find(function(x){ return x.id === id; }) : null;
  var isNew = !t;
  if(!t){ t = {id:uid(), created_at:nowISO()}; state.tasks.unshift(t); }
  t.title = title.trim();
  t.description = (document.getElementById('ent-desc')||{}).value || '';
  t.sphereId = (document.getElementById('ent-sphere')||{}).value || null;
  t.priority = (document.getElementById('ent-priority')||{}).value || 'medium';
  t.difficulty = parseInt((document.getElementById('ent-difficulty')||{}).value) || 3;
  t.category = (document.getElementById('ent-category')||{}).value || '';
  t.planned_time = parseInt((document.getElementById('ent-time')||{}).value) || 30;
  t.start_date = (document.getElementById('ent-start')||{}).value || null;
  t.due_date = (document.getElementById('ent-due')||{}).value || null;
  t.checklist = _clBuffer.slice();
  t.updated_at = nowISO();
  save();
  haptic('success');
  closeSheet();
  toast(isNew?'✓ Создано':'💾 Сохранено','success');
  checkAchievements();
  navigate(currentPage);
}
function deleteTaskV2(id){
  if(!confirm('Удалить?')) return;
  state.tasks = state.tasks.filter(function(x){ return x.id !== id; });
  save();
  closeSheet();
  navigate(currentPage);
}

/* ============ ОБУЧЕНИЕ ============ */
function getLevelProgress(levelId){
  var level = (window.LEARNING_LEVELS||[]).find(function(l){ return l.id === levelId; });
  if(!level) return {done:0,total:0,pct:0};
  var total = 0, done = 0;
  level.modules.forEach(function(mod){
    mod.lessons.forEach(function(l, idx){
      total++;
      if(state.levelProgress[levelId + '_' + mod.id + '_' + idx]) done++;
    });
  });
  return {done:done, total:total, pct:total>0 ? Math.round(done/total*100) : 0};
}
function renderLearningLegacy(){
  var totalDone = 0, totalLessons = 0;
  (window.LEARNING_LEVELS||[]).forEach(function(level){
    var p = getLevelProgress(level.id);
    totalDone += p.done;
    totalLessons += p.total;
  });
  var overallPct = totalLessons ? Math.round(totalDone/totalLessons*100) : 0;
  var skillsDone = Object.keys(state.skillsProgress||{}).length;
  var engDone = Object.keys(state.englishProgress||{}).length;
  var html = '<div class="page"><div class="title-xl">🎓 Обучение</div>';
  html += '<div class="card card-gradient"><div style="opacity:.9;font-size:12px;">Прогресс</div><div style="font-size:40px;font-weight:800;">' + overallPct + '%</div></div>';
  html += '<div class="compact-grid">';
  html += '<div class="compact-item" onclick="navigate(\'levels\')"><span class="compact-icon">🌱</span><span>Уровни</span></div>';
  html += '<div class="compact-item" onclick="navigate(\'english\')"><span class="compact-icon">🇬🇧</span><span>English ' + engDone + '/' + ((window.ENGLISH_125||[]).length) + '</span></div>';
  html += '<div class="compact-item" onclick="navigate(\'skills\')"><span class="compact-icon">💎</span><span>Навыки ' + skillsDone + '/' + ((window.SKILLS_LIBRARY||[]).length) + '</span></div>';
  html += '<div class="compact-item" onclick="navigate(\'psychology\')"><span class="compact-icon">🧠</span><span>Психология</span></div>';
  html += '<div class="compact-item" onclick="navigate(\'thinking\')"><span class="compact-icon">💡</span><span>Мышление</span></div>';
  html += '<div class="compact-item" onclick="navigate(\'games\')"><span class="compact-icon">🎮</span><span>Игры</span></div>';
  html += '<div class="compact-item" onclick="navigate(\'materials\')"><span class="compact-icon">📚</span><span>Материалы</span></div>';
  html += '<div class="compact-item" onclick="navigate(\'fsrs\')"><span class="compact-icon">🃏</span><span>Карточки FSRS</span></div>';
  html += '</div>';
  html += '<h2 style="margin:20px 0 12px;font-size:18px;">🚀 Курсы (' + ((window.ALL_NEW_COURSES||[]).length) + ')</h2>';
  html += '<div class="compact-grid">';
  (window.ALL_NEW_COURSES||[]).forEach(function(c){
    html += '<div class="compact-item" onclick="navigate(\'' + c.id + '\')"><span class="compact-icon">' + c.emoji + '</span><span>' + c.title + '</span></div>';
  });
  html += '</div></div>';
  document.getElementById('app').innerHTML = html;
}
function renderLevels(){
  var html = '<div class="page"><div class="title-xl">🌱 Уровни</div>';
  (window.LEARNING_LEVELS||[]).forEach(function(level){
    var p = getLevelProgress(level.id);
    html += '<div class="method-card" onclick="openLevel(\'' + level.id + '\')"><div class="method-header"><div class="method-emoji">' + level.emoji + '</div><div style="flex:1;"><div class="method-title">' + level.title + '</div><div class="method-cat">' + p.done + '/' + p.total + ' · ' + p.pct + '%</div></div></div><div class="progress" style="margin-top:8px;"><div class="progress-fill" style="width:' + p.pct + '%;"></div></div></div>';
  });
  html += '</div>';
  document.getElementById('app').innerHTML = html;
}
function openLevel(id){ currentLevelId = id; navigate('levelDetail'); }
function renderLevelDetail(){
  var level = (window.LEARNING_LEVELS||[]).find(function(l){ return l.id === currentLevelId; });
  if(!level){ navigate('levels'); return; }
  var html = '<div class="page"><div style="text-align:center;margin-bottom:20px;"><div style="font-size:56px;">' + level.emoji + '</div><div class="title-xl">' + level.title + '</div></div>';
  level.modules.forEach(function(mod){
    html += '<div class="card"><h2>' + mod.emoji + ' ' + mod.title + '</h2>';
    mod.lessons.forEach(function(l, i){
      var key = level.id + '_' + mod.id + '_' + i;
      var isDone = !!state.levelProgress[key];
      html += '<div class="lesson-row ' + (isDone?'done':'') + '" onclick="openLesson(\'' + level.id + '\',\'' + mod.id + '\',' + i + ')"><div class="lesson-num">' + (isDone?'✓':(i+1)) + '</div><div class="lesson-title">' + esc(l.title) + '</div></div>';
    });
    html += '</div>';
  });
  html += '</div>';
  document.getElementById('app').innerHTML = html;
}
function openLesson(lid, mid, idx){
  var level = (window.LEARNING_LEVELS||[]).find(function(l){ return l.id === lid; });
  if(!level) return;
  var mod = level.modules.find(function(m){ return m.id === mid; });
  if(!mod) return;
  var lesson = mod.lessons[idx];
  if(!lesson) return;
  var key = lid + '_' + mid + '_' + idx;
  var isDone = !!state.levelProgress[key];
  var html = '<div style="font-size:20px;font-weight:800;margin-bottom:12px;">' + esc(lesson.title) + '</div>';
  if(lesson.theory) html += '<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚 Теория</div><div class="lesson-content">' + formatLesson(lesson.theory) + '</div></div></div>';
  if(lesson.practice) html += '<div class="card"><div class="lesson-section practice"><div class="lesson-section-title">🎯 Практика</div><div class="lesson-content">' + esc(lesson.practice) + '</div></div></div>';
  if(!isDone) html += '<button class="btn btn-primary btn-block mt-3" onclick="completeLesson(\'' + lid + '\',\'' + mid + '\',' + idx + ')">✓ Изучено</button>';
  openSheet(lesson.title, html);
}
function completeLesson(lid, mid, idx){
  var key = lid + '_' + mid + '_' + idx;
  state.levelProgress[key] = true;
  addXP(10, 'lesson');
  addPetXP(3);
  save();
  haptic('success');
  toast('✓ +10 XP','success');
  closeSheet();
  navigate('levelDetail');
}
function formatLesson(text){
  if(!text) return '';
  var h = esc(text);
  h = h.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  h = h.replace(/\n/g, '<br>');
  return h;
}
function renderSkills(){
  var lib = window.SKILLS_LIBRARY || [];
  var html = '<div class="page"><div class="title-xl">💎 Навыки</div>';
  html += '<div class="card card-gradient"><div style="font-size:40px;font-weight:800;">' + lib.length + '</div></div>';
  lib.forEach(function(s){
    var isDone = state.skillsProgress[s.id];
    html += '<div class="method-card" onclick="openSkill(\'' + s.id + '\')"><div class="method-header"><div class="method-emoji">' + s.emoji + '</div><div style="flex:1;"><div class="method-title">' + esc(s.title) + '</div><div class="method-cat">' + esc(s.desc||'') + '</div></div>' + (isDone?'<span class="badge badge-success">✓</span>':'›') + '</div></div>';
  });
  html += '</div>';
  document.getElementById('app').innerHTML = html;
}
function openSkill(id){
  var s = (window.SKILLS_LIBRARY||[]).find(function(x){ return x.id === id; });
  if(!s) return;
  var isDone = state.skillsProgress[id];
  var html = '<div style="font-size:20px;font-weight:800;margin-bottom:12px;">' + esc(s.title) + '</div>';
  if(s.theory) html += '<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚</div><div class="lesson-content">' + formatLesson(s.theory) + '</div></div></div>';
  if(!isDone) html += '<button class="btn btn-primary btn-block mt-3" onclick="completeSkill(\'' + id + '\')">✓ Изучено</button>';
  openSheet(s.title, html);
}
function completeSkill(id){
  state.skillsProgress[id] = true;
  addXP(20, 'lesson');addPetXP(3);
  save();
  toast('✓ +20 XP','success');
  closeSheet();
  renderSkills();
}
function renderEnglish(){
  var all = window.ENGLISH_125 || [];
  var done = Object.keys(state.englishProgress||{}).length;
  var html = '<div class="page"><div class="title-xl">🇬🇧 English</div>';
  html += '<div class="card card-gradient"><div style="font-size:40px;font-weight:800;">' + done + '/' + all.length + '</div></div>';
  ['A1','A2','B1','B2','C1'].forEach(function(lvl){
    var lessons = all.filter(function(l){ return l.level === lvl; });
    var d = lessons.filter(function(l){ return state.englishProgress[l.id]; }).length;
    var pct = lessons.length ? Math.round(d/lessons.length*100) : 0;
    html += '<div class="card"><h2>' + lvl + ' (' + d + '/' + lessons.length + ')</h2><div class="progress mb-2"><div class="progress-fill" style="width:' + pct + '%;"></div></div>';
    lessons.forEach(function(l){
      var isDone = state.englishProgress[l.id];
      html += '<div class="lesson-row ' + (isDone?'done':'') + '" onclick="openEnglishLesson(\'' + l.id + '\')"><div class="lesson-num">' + (isDone?'✓':'○') + '</div><div class="lesson-title">' + esc(l.title) + '</div></div>';
    });
    html += '</div>';
  });
  html += '</div>';
  document.getElementById('app').innerHTML = html;
}
function openEnglishLesson(id){
  var l = (window.ENGLISH_125||[]).find(function(x){ return x.id === id; });
  if(!l) return;
  var isDone = state.englishProgress[id];
  var html = '<div style="font-size:20px;font-weight:800;margin-bottom:12px;">' + esc(l.title) + '</div>';
  if(l.theory) html += '<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚</div><div class="lesson-content">' + formatLesson(l.theory) + '</div></div></div>';
  if(!isDone) html += '<button class="btn btn-primary btn-block mt-3" onclick="completeEnglish(\'' + id + '\')">✓ Изучено</button>';
  openSheet(l.title, html);
}
function completeEnglish(id){
  state.englishProgress[id] = true;
  addXP(15, 'lesson');addPetXP(2);
  save();
  toast('✓ +15 XP','success');
  closeSheet();
  renderEnglish();
}

/* ============ RENDERCOURSE (общий для 12 курсов) ============ */
function startNextCourseReview(courseId){var course=getCourseById(courseId);if(!course)return;var progress=state[courseId+"Progress"]||{},found=null;(course.modules||[]).some(function(mod){return (mod.lessons||[]).some(function(l,idx){var r=progress[courseId+"_"+mod.id+"_"+idx];if(r&&typeof r==="object"&&r.nextReviewAt&&r.nextReviewAt<=today()){found={moduleId:mod.id,index:idx};return true;}return false;});});if(found)openCourseLesson(courseId,found.moduleId,found.index);else toast("Повторений пока нет","info");}
function renderCourseGeneric(course, progressKey){
  if(!course){
    document.getElementById('app').innerHTML = '<div class="page"><div class="card"><div class="empty"><div class="empty-icon">⚠️</div><div class="empty-title">Курс не найден</div></div></div></div>';
    return;
  }
  var progress = state[progressKey] || {};
  var totalLessons = 0;
  var doneLessons = 0;
  (course.modules||[]).forEach(function(mod){
    (mod.lessons||[]).forEach(function(l, idx){
      totalLessons++;
      if(progress[course.id + '_' + mod.id + '_' + idx]) doneLessons++;
    });
  });
  var pct = totalLessons ? Math.round(doneLessons/totalLessons*100) : 0;
  var dueLessons=[];
  (course.modules||[]).forEach(function(mod){(mod.lessons||[]).forEach(function(l,idx){var k=course.id+'_'+mod.id+'_'+idx,r=progress[k];if(r&&typeof r==='object'&&r.nextReviewAt&&r.nextReviewAt<=today())dueLessons.push({moduleId:mod.id,index:idx,title:l.title});});});
  var html = '<div class="page">';
  html += '<div style="text-align:center;margin-bottom:20px;">';
  html += '<div style="font-size:56px;">' + course.emoji + '</div>';
  html += '<div class="title-xl">' + esc(course.title) + '</div>';
  html += '<div class="footnote text-secondary">' + esc(course.subtitle||'') + '</div>';
  html += '</div>';
  html += '<div class="card card-gradient">';
  html += '<div style="font-size:12px;opacity:.9;">Прогресс</div>';
  html += '<div style="font-size:40px;font-weight:800;">' + pct + '%</div>';
  html += '<div style="font-size:12px;opacity:.9;margin-top:6px;">' + doneLessons + ' / ' + totalLessons + ' уроков</div>';
  html += '</div>';
  if(dueLessons.length)html += '<div class="card"><h2>🔁 Пора закрепить</h2><div class="footnote">'+dueLessons.length+' уроков требуют повторения по твоим предыдущим оценкам.</div><button class="btn btn-primary btn-block mt-2" onclick="startNextCourseReview(&quot;'+course.id+'&quot;)">Повторить следующий урок</button></div>';
  (course.modules||[]).forEach(function(mod){
    html += '<div class="card"><h2>' + mod.emoji + ' ' + esc(mod.title) + '</h2>';
    (mod.lessons||[]).forEach(function(l, idx){
      var key = course.id + '_' + mod.id + '_' + idx;
      var isDone = !!progress[key];
      html += '<div class="lesson-row ' + (isDone?'done':'') + '" onclick="openCourseLesson(\'' + course.id + '\',\'' + mod.id + '\',' + idx + ')">';
      html += '<div class="lesson-num">' + (isDone?'✓':(idx+1)) + '</div>';
      html += '<div class="lesson-title">' + esc(l.title) + '</div>';
      html += '</div>';
    });
    html += '</div>';
  });
  html += '</div>';
  document.getElementById('app').innerHTML = html;
}
function openCourseLesson(courseId,moduleId,idx){
 var course=getCourseById(courseId);if(!course)return;var mod=null;(course.modules||[]).forEach(function(m){if(m.id===moduleId)mod=m;});if(!mod)return;var lesson=mod.lessons[idx];if(!lesson)return;
 currentCourseId=courseId;currentCourseModuleId=moduleId;currentCourseLessonIdx=idx;
 var key=courseId+'_'+moduleId+'_'+idx,pKey=courseId+'Progress',saved=(state[pKey]||{})[key],record=saved&&typeof saved==='object'?saved:{};
 var html='<div style="font-size:20px;font-weight:800;margin-bottom:12px;">'+esc(lesson.title)+'</div>';
 if(lesson.theory)html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚 Теория</div><div class="lesson-content">'+formatLesson(lesson.theory)+'</div></div></div>';
 if(lesson.practice)html+='<div class="card"><div class="lesson-section practice"><div class="lesson-section-title">🎯 Практика</div><div class="lesson-content">'+esc(lesson.practice)+'</div></div></div>';
 var steps=saved&&typeof saved==='object'&&Array.isArray(saved.steps)?saved.steps:[];
 html+='<div class="card"><h3>🧭 Маршрут прохождения урока</h3><div class="footnote mb-2">Не только прочитай: выполни практику и проверь, что понял.</div><label class="list-row"><input type="checkbox" id="courseStep1" '+(steps[0]?'checked':'')+'><span>Разобрал теорию и выписал 2–3 главные идеи</span></label><label class="list-row"><input type="checkbox" id="courseStep2" '+(steps[1]?'checked':'')+'><span>Выполнил практическое задание</span></label><label class="list-row"><input type="checkbox" id="courseStep3" '+(steps[2]?'checked':'')+'><span>Проверил результат и отметил, что улучшить</span></label></div>';
 html+='<div class="card"><h3>🧠 Проверка усвоения</h3><div class="footnote mb-2">Вспомни главное без подсказок и объясни, как применишь это на практике.</div><label class="field-label">Что ты понял своими словами?</label><textarea id="courseMasteryRecall" rows="4" maxlength="1800" placeholder="Напиши 2–4 предложения или пример…">'+esc(record.recall||'')+'</textarea><label class="field-label">Насколько уверенно применишь?</label><select id="courseMasteryRating">'+[1,2,3,4,5].map(function(n){return '<option value="'+n+'" '+(Number(record.rating||3)===n?'selected':'')+'>'+n+' / 5</option>';}).join('')+'</select><label class="field-label">Практический результат / пример</label><textarea id="courseMasteryExample" rows="2" maxlength="1000" placeholder="Что сделал, решил или где применил?">'+esc(record.example||'')+'</textarea></div>';
 if(saved)html+='<div class="insight-card"><div class="insight-title">✓ Ранее отмечен как изученный</div><div class="insight-text">Следующая проверка: '+esc(record.nextReviewAt||'не назначена')+'</div></div>';
 html+='<button class="btn btn-primary btn-block mt-3" onclick="completeCourseLesson(\''+courseId+'\',\''+moduleId+'\','+idx+')">'+(saved?'Сохранить результат проверки':'✓ Подтвердить усвоение')+'</button>';
 openSheet(lesson.title,html);
}
function completeCourseLesson(courseId,moduleId,idx){
 var key=courseId+'_'+moduleId+'_'+idx,pKey=courseId+'Progress',recall=((document.getElementById('courseMasteryRecall')||{}).value||'').trim(),example=((document.getElementById('courseMasteryExample')||{}).value||'').trim(),rating=Number((document.getElementById('courseMasteryRating')||{}).value)||3;var steps=[!!((document.getElementById('courseStep1')||{}).checked),!!((document.getElementById('courseStep2')||{}).checked),!!((document.getElementById('courseStep3')||{}).checked)];
 if(steps.some(function(x){return !x;}))return toast('Заверши все 3 шага маршрута урока','warning');
 if(recall.length<25)return toast('Напиши хотя бы 25 символов своими словами','warning');
 if(!state[pKey])state[pKey]={};var old=state[pKey][key],wasDone=!!old,d=new Date();d.setDate(d.getDate()+({1:1,2:2,3:4,4:8,5:14}[rating]||4));
 var history=old&&typeof old==='object'&&Array.isArray(old.history)?old.history:[];history.push({at:nowISO(),rating:rating,recall:recall,example:example});
 state[pKey][key]={completed:true,completedAt:old&&old.completedAt||nowISO(),updatedAt:nowISO(),steps:steps,recall:recall,example:example,rating:rating,nextReviewAt:d.toISOString().slice(0,10),reviewCount:history.length-1,history:history.slice(-30)};
 if(!wasDone){addXP(10,'lesson');addPetXP(3);}save();haptic('success');toast(wasDone?'Результат проверки обновлён':'Усвоение подтверждено · +10 XP','success');closeSheet();renderCourseGeneric(getCourseById(courseId),pKey);
}
/* ============ ЗРЕНИЕ ============ */
function ensureVisionState(){
 if(!state.vision)state.vision=defaultState().vision;
 if(!state.vision.metrics)state.vision.metrics={};
 if(!state.vision.breakTracker)state.vision.breakTracker={today:{done:0,target:12},history:{}};
 if(!state.vision.symptomLog)state.vision.symptomLog=[];
 if(!state.vision.routineLog)state.vision.routineLog=[];
 if(!state.vision.breakTracker.history)state.vision.breakTracker.history={};
 if(state.vision.breakTracker.date&&state.vision.breakTracker.date!==today()){state.vision.breakTracker.today={done:0,target:12};state.vision.breakTracker.date=today();}
 return state.vision;
}
function renderVision(){
 var v=ensureVisionState(),m=v.metrics[today()]||{},breaks=v.breakTracker.today||{done:0,target:12};
 var html='<div class="page"><div class="title-xl">👁 Здоровье глаз</div><div class="subtitle">Комфорт при работе с экраном, наблюдение симптомов и контроль осмотров. Упражнения не исправляют близорукость, дальнозоркость или астигматизм.</div>';
 html+='<div class="card card-gradient"><div class="row-between"><div><div class="stat-label">Перерывы сегодня</div><div class="stat-value">'+(breaks.done||0)+' / '+(breaks.target||12)+'</div></div><button class="btn btn-primary" onclick="startVisionBreak()">Пауза 20 сек</button></div><div class="progress mt-2"><div class="progress-fill" style="width:'+Math.min(100,Math.round((breaks.done||0)/(breaks.target||12)*100))+'%"></div></div><div class="footnote mt-2">20-20-20 — удобное напоминание сменить фокус, но не доказанное лечение.</div></div>';
 html+='<div class="grid-2"><button class="card jarvis-tool" onclick="navigate(&quot;vision60&quot;)">⚡ Протоколы комфорта<br><small>5 безопасных действий</small></button><button class="card jarvis-tool" onclick="openVisionSymptomLog()">📝 Симптомы<br><small>Сухость, боль, размытость</small></button><button class="card jarvis-tool" onclick="navigate(&quot;visionTracker&quot;)">📊 Дневник и динамика<br><small>Последние 30 дней</small></button><button class="card jarvis-tool" onclick="navigate(&quot;visionTips&quot;)">🧭 Рабочее место<br><small>Экран, свет, расстояние</small></button></div>';
 html+='<div class="card mt-3"><h2>Сегодняшнее самонаблюдение</h2><div class="field"><label class="field-label">Усталость глаз: '+(m.eyeFatigue==null?'—':m.eyeFatigue+'/10')+'</label><input type="range" min="0" max="10" value="'+(m.eyeFatigue||0)+'" onchange="saveVisionMetric(&quot;eyeFatigue&quot;,this.value)"></div><div class="field"><label class="field-label">Сухость: '+(m.dryness==null?'—':m.dryness+'/10')+'</label><input type="range" min="0" max="10" value="'+(m.dryness||0)+'" onchange="saveVisionMetric(&quot;dryness&quot;,this.value)"></div><div class="field"><label class="field-label">Время за экраном, часов</label><input type="number" min="0" max="24" step="0.5" value="'+(m.screenHours||'')+'" placeholder="Например, 6.5" onchange="saveVisionMetric(&quot;screenHours&quot;,this.value)"></div><div class="row-between"><span>Головная боль</span><button class="btn btn-sm '+(m.headaches?'btn-danger':'btn-ghost')+'" onclick="toggleVisionHeadache()">'+(m.headaches?'Есть':'Нет')+'</button></div></div>';
 html+='<div class="card"><h2>Последние действия</h2>';
 if(v.routineLog.length)v.routineLog.slice(-5).reverse().forEach(function(x){html+='<div class="list-row"><div class="list-icon">✓</div><div class="list-body"><div class="list-title">'+esc(x.title)+'</div><div class="list-subtitle">'+esc(x.date)+' · '+(x.seconds||0)+' сек</div></div></div>';});
 else html+='<div class="footnote">Пока нет завершённых протоколов.</div>';
 html+='</div><div class="card"><h2>Важно знать</h2><p class="footnote">При внезапном ухудшении или потере зрения, сильной боли, новых вспышках света или множественных новых мушках нужна срочная очная оценка. Не пытайся «перетренировать» такие симптомы.</p><p class="footnote">Плановые проверки у офтальмолога и актуальная коррекция зрения важнее любых приложений.</p></div><div class="card"><h2>Цифровые привычки · 62 дня</h2><div class="footnote">Это программа изменения экранных привычек, а не курс восстановления зрения или лечение.</div><button class="btn btn-primary btn-block mt-2" onclick="navigate(&quot;detoxcourse&quot;)">Открыть программу цифрового баланса</button></div></div>';
 document.getElementById('app').innerHTML=html;
}
function openVisionSymptomLog(){
 var v=ensureVisionState(),m=v.metrics[today()]||{};
 var html='<div class="footnote mb-2">Отметь симптомы и их выраженность. Это дневник наблюдений, не диагностика.</div><div class="field"><label class="field-label">Сухость / жжение (0–10)</label><input id="visionDryness" type="number" min="0" max="10" value="'+(m.dryness||0)+'"></div><div class="field"><label class="field-label">Размытость зрения (0–10)</label><input id="visionBlur" type="number" min="0" max="10" value="'+(m.blur||0)+'"></div><div class="field"><label class="field-label">Боль (0–10)</label><input id="visionPain" type="number" min="0" max="10" value="'+(m.pain||0)+'"></div><div class="field"><label class="field-label">Головная боль (0–10)</label><input id="visionHeadache" type="number" min="0" max="10" value="'+(m.headacheLevel||0)+'"></div><div class="field"><label><input type="checkbox" id="visionSuddenLoss"> Внезапное ухудшение или потеря зрения</label></div><div class="field"><label><input type="checkbox" id="visionFlashes"> Новые вспышки света</label></div><div class="field"><label><input type="checkbox" id="visionFloaters"> Внезапно появилось много новых мушек</label></div><div class="field"><label><input type="checkbox" id="visionSeverePain"> Сильная боль в глазу</label></div><div class="field"><label><input type="checkbox" id="visionDouble"> Внезапное двоение</label></div><button class="btn btn-primary btn-block" onclick="saveVisionSymptoms()">Сохранить наблюдение</button>';
 openSheet('Дневник симптомов',html);
}
function saveVisionSymptoms(){
 var v=ensureVisionState(),t=today();if(!v.metrics[t])v.metrics[t]={};
 function n(id){var x=Number((document.getElementById(id)||{}).value);return Number.isFinite(x)?Math.max(0,Math.min(10,x)):0;}
 var urgent=['visionSuddenLoss','visionFlashes','visionFloaters','visionSeverePain','visionDouble'].filter(function(id){return !!((document.getElementById(id)||{}).checked);});
 Object.assign(v.metrics[t],{dryness:n('visionDryness'),blur:n('visionBlur'),pain:n('visionPain'),headacheLevel:n('visionHeadache'),headaches:n('visionHeadache')>0});
 v.symptomLog.push({date:t,at:nowISO(),dryness:v.metrics[t].dryness,blur:v.metrics[t].blur,pain:v.metrics[t].pain,headache:v.metrics[t].headacheLevel,urgent:urgent});
 if(v.symptomLog.length>500)v.symptomLog=v.symptomLog.slice(-500);
 save();closeSheet();
 if(urgent.length)toast('Есть тревожные симптомы: обратись за срочной медицинской оценкой. При внезапной потере зрения или сильной боли — немедленно.','error',7000);
 else toast('Запись симптомов сохранена','success');
 renderVision();
}

function startVisionBreak(){
 ensureVisionState();if(window.__visionBreakInterval)clearInterval(window.__visionBreakInterval);
 openSheet('Пауза для глаз','<div style="text-align:center;padding:18px 0"><div style="font-size:44px">🏞️</div><div class="stat-value" id="visionBreakCountdown">20</div><p class="footnote">Посмотри на неподвижный объект вдали, примерно в 6 метрах или дальше. Не напрягай зрение.</p><button id="visionBreakFinish" class="btn btn-primary btn-block" disabled onclick="finishVisionBreak()">Завершить паузу</button></div>');
 var left=20,el=document.getElementById('visionBreakCountdown'),btn=document.getElementById('visionBreakFinish');
 window.__visionBreakInterval=setInterval(function(){left--;if(el)el.textContent=left;if(left<=0){clearInterval(window.__visionBreakInterval);window.__visionBreakInterval=null;if(btn){btn.disabled=false;btn.textContent='✓ Я завершил паузу';}}},1000);
}
function finishVisionBreak(){
 if(window.__visionBreakInterval){clearInterval(window.__visionBreakInterval);window.__visionBreakInterval=null;}
 var v=ensureVisionState(),t=today();
 if(!v.breakTracker.today||v.breakTracker.date!==t){v.breakTracker.today={done:0,target:12};v.breakTracker.date=t;}
 if(!v.breakTracker.history)v.breakTracker.history={};
 v.breakTracker.today.done=(v.breakTracker.today.done||0)+1;v.breakTracker.today.lastBreakAt=nowISO();
 v.breakTracker.history[t]=v.breakTracker.history[t]||{done:0,target:12};v.breakTracker.history[t].done++;
 save();closeSheet();toast('Пауза записана','success');renderVision();
}

function saveVisionMetric(key, value){
  if(!state.vision) state.vision = defaultState().vision;
  if(!state.vision.metrics) state.vision.metrics = {};
  var t = today();
  if(!state.vision.metrics[t]) state.vision.metrics[t] = {};
  state.vision.metrics[t][key] = parseFloat(value);
  save();
  toast('✓ Сохранено','success');
}
function toggleVisionHeadache(){
  if(!state.vision) state.vision = defaultState().vision;
  if(!state.vision.metrics) state.vision.metrics = {};
  var t = today();
  if(!state.vision.metrics[t]) state.vision.metrics[t] = {};
  state.vision.metrics[t].headaches = !state.vision.metrics[t].headaches;
  save();
  renderVision();
}
function resetVisionRedFlags(){
  if(state.vision && state.vision.redFlags){
    state.vision.redFlags.active = false;
    state.vision.redFlags.reasons = [];
  }
  save();
  toast('✓ Сброшено','success');
  renderVision();
}
function renderVisionExercises(){ renderVision60(); }
function renderVision60(){
  var ex = window.VISION_EXERCISES || [];
  var html = '<div class="page"><div class="title-xl">👁 Протоколы комфорта (' + ex.length + ')</div><div class="subtitle">Короткие действия для перерыва и уменьшения цифрового дискомфорта. Они не тренируют диоптрии и не заменяют лечение.</div>';
  ex.forEach(function(e){
    html += '<div class="method-card" onclick="startEyeExercise(\'' + e.id + '\')"><div class="method-header"><div class="method-emoji">' + e.emoji + '</div><div style="flex:1;"><div class="method-title">' + esc(e.title) + '</div><div class="method-cat">' + esc(e.desc||'') + ' · ' + (e.duration||'') + '</div></div><div class="list-chevron">▶</div></div></div>';
  });
  html += '</div>';
  document.getElementById('app').innerHTML = html;
}
function renderVisionTracker(){
 var v=ensureVisionState(),metrics=v.metrics||{},keys=Object.keys(metrics).sort().slice(-30),logs=v.symptomLog||[];
 var html='<div class="page"><div class="title-xl">📊 Дневник зрения</div><div class="subtitle">Отслеживай самочувствие и условия работы. Это не измерение остроты зрения.</div><button class="btn btn-primary btn-block mb-3" onclick="openVisionSymptomLog()">＋ Добавить запись симптомов</button>';
 if(keys.length){html+='<div class="card"><h2>Последние 30 дней</h2>';keys.slice().reverse().forEach(function(d){var m=metrics[d]||{};html+='<div class="list-row"><div class="list-body"><div class="list-title">'+esc(d)+'</div><div class="list-subtitle">Усталость '+(m.eyeFatigue==null?'—':m.eyeFatigue+'/10')+' · сухость '+(m.dryness==null?'—':m.dryness+'/10')+' · экран '+(m.screenHours==null?'—':m.screenHours+' ч')+' · боль '+(m.pain==null?'—':m.pain+'/10')+'</div></div></div>';});html+='</div>';}
 else html+='<div class="card"><div class="empty"><div class="empty-icon">📊</div><div class="empty-title">Пока нет записей</div><div class="footnote">Добавь несколько дней наблюдений, чтобы увидеть тенденции.</div></div></div>';
 html+='<div class="card"><h2>История симптомов</h2>';
 if(logs.length)logs.slice(-20).reverse().forEach(function(x){html+='<div class="list-row"><div class="list-body"><div class="list-title">'+esc(x.date)+'</div><div class="list-subtitle">Сухость '+x.dryness+'/10 · размытость '+x.blur+'/10 · боль '+x.pain+'/10'+(x.urgent&&x.urgent.length?' · тревожные признаки отмечены':'')+'</div></div></div>';});
 else html+='<div class="footnote">Отдельных записей симптомов пока нет.</div>';
 html+='</div><div class="card"><h2>Последний осмотр</h2><div class="field"><label class="field-label">Дата посещения офтальмолога</label><input id="visionExamDate" type="date" value="'+esc(v.eyeExam&&v.eyeExam.date||'')+'"></div><div class="field"><label class="field-label">Заметки / рекомендации специалиста</label><textarea id="visionExamNotes" rows="3" maxlength="1000">'+esc(v.eyeExam&&v.eyeExam.notes||'')+'</textarea></div><button class="btn btn-ghost btn-block" onclick="saveVisionExam()">Сохранить сведения об осмотре</button></div></div>';
 document.getElementById('app').innerHTML=html;
}
function saveVisionExam(){
 var v=ensureVisionState();v.eyeExam={date:(document.getElementById('visionExamDate')||{}).value||'',notes:((document.getElementById('visionExamNotes')||{}).value||'').trim().slice(0,1000),updatedAt:nowISO()};save();toast('Сведения об осмотре сохранены','success');renderVisionTracker();
}

function renderVisionTips(){
 var tips=[
  ['🖥️','Расстояние','Размести монитор примерно на расстоянии вытянутой руки; для телефона выбери комфортную дистанцию и не подноси его вплотную.'],
  ['📐','Положение','Верхняя часть монитора — на уровне глаз или немного ниже; смотри слегка вниз.'],
  ['💡','Свет и блики','Избегай отражений на экране. Яркость должна быть комфортной и соответствовать освещению комнаты.'],
  ['👁️','Моргание','Во время чтения и работы с экраном моргание становится реже. Периодически мягко моргай, не зажмуриваясь.'],
  ['⏸️','Перерывы','Чаще меняй зрительную задачу и вставай. Правило 20-20-20 можно использовать как напоминание, но оно не гарантирует устранение симптомов.'],
  ['🩺','Коррекция зрения','Если зрение размыто, болит голова или приходится щуриться, проверь актуальность очков/линз у специалиста.'],
  ['🌿','Сухость','Если сухость повторяется, обсуди её с офтальмологом. Не используй «натуральные капли» и самодельные растворы.']
 ];
 var html='<div class="page"><div class="title-xl">🧭 Рабочее место и гигиена зрения</div><div class="subtitle">Рекомендации для уменьшения цифрового дискомфорта, а не для изменения диоптрий.</div>';
 tips.forEach(function(t){html+='<div class="card"><div class="row" style="gap:12px"><div style="font-size:28px">'+t[0]+'</div><div style="flex:1"><b>'+t[1]+'</b><p class="footnote mt-1">'+t[2]+'</p></div></div></div>';});
 html+='<div class="card"><h2>Проверенные материалы</h2><p><a href="https://www.aao.org/eye-health/glasses-contacts/computer-usage" target="_blank" rel="noopener">American Academy of Ophthalmology — экран и зрительное напряжение ↗</a></p><p><a href="https://www.cdc.gov/vision-health/prevention/taking-care-of-your-eyes.html" target="_blank" rel="noopener">CDC — уход за глазами и осмотры ↗</a></p><p><a href="https://www.hse.gov.uk/msd/dse/work-routine.htm" target="_blank" rel="noopener">UK HSE — перерывы при работе с экраном ↗</a></p><p class="footnote mt-2">Офтальмологические упражнения не доказали способность устранять близорукость, дальнозоркость или астигматизм. Для нарушений совместной работы глаз специальные упражнения назначает специалист.</p></div></div>';
 document.getElementById('app').innerHTML=html;
}

function startEyeExercise(id){
 var ex=(window.VISION_EXERCISES||[]).find(function(x){return x.id===id;});if(!ex)return;
 var v=ensureVisionState();if(v.redFlags&&v.redFlags.active){toast('Сначала обсуди симптомы с медицинским специалистом.','warning');return;}
 currentVisionExercise=ex;if(window.__eyeExerciseInterval)clearInterval(window.__eyeExerciseInterval);
 var seconds=Math.max(10,Math.min(180,Number(ex.seconds)||30));
 var html='<div style="text-align:center"><div style="font-size:52px">'+ex.emoji+'</div><h3>'+esc(ex.title)+'</h3></div><div class="card"><p>'+esc(ex.desc)+'</p><div class="footnote mt-2">'+esc(ex.how||'')+'</div><div class="footnote mt-2"><b>Источник:</b> '+esc(ex.science||'')+'</div><div class="stat-value" id="eyeExerciseCountdown">'+seconds+'</div><div class="footnote">Секунд до завершения спокойной практики</div><label class="field-label mt-2">После действия, как ощущаются глаза?</label><select id="eyeExerciseComfort"><option value="same">Без изменений</option><option value="better">Комфортнее</option><option value="worse">Стало хуже</option></select><button id="eyeExerciseFinish" class="btn btn-primary btn-block mt-3" disabled onclick="completeEyeExercise()">Завершить и записать</button></div>';
 openSheet(ex.title,html);var left=seconds,el=document.getElementById('eyeExerciseCountdown'),btn=document.getElementById('eyeExerciseFinish');
 window.__eyeExerciseInterval=setInterval(function(){left--;if(el)el.textContent=left;if(left<=0){clearInterval(window.__eyeExerciseInterval);window.__eyeExerciseInterval=null;if(btn){btn.disabled=false;btn.textContent='✓ Сохранить результат';}}},1000);
}
function completeEyeExercise(){
 if(!currentVisionExercise)return;if(window.__eyeExerciseInterval){clearInterval(window.__eyeExerciseInterval);window.__eyeExerciseInterval=null;}
 var v=ensureVisionState(),ex=currentVisionExercise,seconds=Number(ex.seconds)||30,comfort=(document.getElementById('eyeExerciseComfort')||{}).value||'same';
 if(!v.routineLog)v.routineLog=[];v.routineLog.push({exerciseId:ex.id,title:ex.title,date:today(),at:nowISO(),seconds:seconds,comfort:comfort});
 if(v.routineLog.length>500)v.routineLog=v.routineLog.slice(-500);
 if(v.routineXpDate!==today()){v.routineXpDate=today();addXP(2,'vision_routine');addPetXP(1);}
 save();closeSheet();haptic('success');toast('Результат сохранён','success');currentVisionExercise=null;renderVision();
}

function renderVision62(){
 var stats=getDetoxCourseStats();
 var html='<div class="page"><div class="title-xl">🌟 62-дневная программа</div><div class="subtitle">Единая подробная программа: задания, практика, дневник и анализ результата.</div><div class="card card-gradient"><div class="stat-value">'+stats.completed+' / 62</div><div class="stat-label">Дней действительно отмечено в подробном курсе</div><div class="progress mt-2"><div class="progress-fill" style="width:'+stats.percent+'%"></div></div></div><div class="card"><h2>📚 Полная программа</h2><div class="footnote">Здесь используется тот же прогресс, что и в подробном 62-дневном детоксе. Старые отметки отдельного трекера не удаляются, но больше не создают второй независимый счётчик.</div><button class="btn btn-primary btn-block mt-3" onclick="navigate(\'detoxcourse\')">Открыть задания, дневник и аналитику</button></div><button class="btn btn-ghost btn-block" onclick="navigate(\'vision\')">← К разделу зрения</button></div>';
 document.getElementById('app').innerHTML=html;
}
function startDetox62(){
  if(!state.vision) state.vision = defaultState().vision;
  state.vision.detox62 = state.vision.detox62 || defaultState().vision.detox62;
  state.vision.detox62.active = true;
  state.vision.detox62.status = 'active';
  state.vision.detox62.startDate = today();
  state.vision.detox62.currentDay = 1;
  state.vision.detox62.currentStage = 1;
  save();
  toast('🚀 Программа начата','success');
  navigate('detoxcourse');
}
function completeDetox62Day(){
  var d62 = state.vision.detox62;
  if(!d62) return;
  var t = today();
  if(!d62.dailyLog) d62.dailyLog = {};
  d62.dailyLog[d62.currentDay] = {completedAt:nowISO()};
  addXP(15, 'vision_62day');
  addPetXP(5);
  if(d62.currentDay < 62) d62.currentDay++;
  /* Определяем этап */
  var stages = d62.stages || [];
  stages.forEach(function(st){
    if(d62.currentDay >= st.days[0] && d62.currentDay <= st.days[1]) d62.currentStage = st.id;
  });
  save();
  haptic('success');
  toast('✓ День пройден! День ' + d62.currentDay,'success');
  renderVision62();
}
function skipDetox62Day(){
  var reason = prompt('Причина пропуска:');
  if(!reason) return;
  var d62 = state.vision.detox62;
  if(!d62) return;
  if(!d62.skips) d62.skips = [];
  d62.skips.push({day:d62.currentDay, reason:reason, at:nowISO()});
  if(d62.currentDay < 62) d62.currentDay++;
  save();
  toast('Пропуск зафиксирован','warning');
  renderVision62();
}


/* ============ 62-DAY DETOX: EXECUTION + OUTCOME TRACKING ============ */
function getDetoxCourseRecord(day){
  if(!state.detoxCourseProgress||typeof state.detoxCourseProgress!=='object')state.detoxCourseProgress={};
  var old=state.detoxCourseProgress[day];
  if(old===true)old={completed:true,completedAt:null,checks:[],reflection:{},legacy:true};
  if(!old||typeof old!=='object')old={completed:false,checks:[],reflection:{}};
  if(!Array.isArray(old.checks))old.checks=[];
  if(!old.reflection||typeof old.reflection!=='object')old.reflection={};
  state.detoxCourseProgress[day]=old;
  return old;
}
function detoxReflectionHasData(reflection){return !!(reflection&&(reflection.screenMinutes!==null&&reflection.screenMinutes!==undefined&&reflection.screenMinutes!==''||reflection.unplannedOpens!==null&&reflection.unplannedOpens!==undefined&&reflection.unplannedOpens!==''||reflection.sleepHours!==null&&reflection.sleepHours!==undefined&&reflection.sleepHours!==''||reflection.focus!==null&&reflection.focus!==undefined&&reflection.focus!==''||reflection.helped!==null&&reflection.helped!==undefined&&reflection.helped!==''||String(reflection.note||'').trim()));}
function getDetoxCourseStats(){
  var rows=state.detoxCourseProgress||{},completed=0,reflections=0,screen=[];
  Object.keys(rows).forEach(function(k){var r=rows[k];if(r===true||r&&r.completed)completed++;if(r&&detoxReflectionHasData(r.reflection)){reflections++;var raw=r.reflection.screenMinutes;if(raw!==null&&raw!==undefined&&raw!==''&&Number.isFinite(Number(raw)))screen.push({day:Number(k),minutes:Number(raw)});}});
  var first=screen.slice().sort(function(a,b){return a.day-b.day;})[0];
  var recent=screen.slice().sort(function(a,b){return b.day-a.day;}).slice(0,7);
  var recentAvg=recent.length?Math.round(recent.reduce(function(n,x){return n+x.minutes;},0)/recent.length):null;
  return {completed:completed,percent:Math.round(completed/62*100),reflections:reflections,screenBaseline:first?first.minutes:null,screenRecent:recentAvg,screenDelta:first&&recentAvg!==null?recentAvg-first.minutes:null,screenSamples:screen.length};
}
function renderDetoxCourse(){
  var course=window.DETOX_COURSE||[],stats=getDetoxCourseStats(),next=course.find(function(d){var r=state.detoxCourseProgress[d.day];return !(r===true||r&&r.completed);})||null;
  var html='<div class="page"><div class="title-xl">📱 62-дневный детокс</div><div class="subtitle">Практический курс: измеряй, меняй среду, проверяй эффект и адаптируй план под себя.</div>';
  html+='<div class="card card-gradient"><div class="grid-2"><div><div class="stat-value">'+stats.completed+'/62</div><div class="stat-label">Дней завершено</div></div><div><div class="stat-value">'+stats.percent+'%</div><div class="stat-label">Прогресс курса</div></div><div><div class="stat-value">'+stats.reflections+'</div><div class="stat-label">Дневников результата</div></div><div><div class="stat-value">'+(stats.screenRecent===null?'—':stats.screenRecent+' мин')+'</div><div class="stat-label">Среднее экранное время по записям</div></div></div><div class="progress mt-3"><div class="progress-fill" style="width:'+stats.percent+'%"></div></div></div>';
  if(stats.screenBaseline!==null&&stats.screenRecent!==null)html+='<div class="card"><h2>📉 Изменение экранного времени</h2><div class="stat-value">'+(stats.screenDelta>0?'+':'')+stats.screenDelta+' мин/день</div><div class="footnote">Исходная точка: '+stats.screenBaseline+' мин · последние записи: '+stats.screenRecent+' мин. Сравниваем только введённые тобой данные; это не автоматическое считывание телефона.</div></div>';
  if(next)html+='<div class="card"><h2>▶ Продолжить</h2><div class="method-title">День '+next.day+': '+esc(next.title)+'</div><div class="footnote">'+esc(next.subtitle||next.phase)+'</div><button class="btn btn-primary btn-block mt-2" onclick="openDetoxDay('+next.day+')">Открыть подробное задание</button></div>';else html+='<div class="card"><h2>🏆 Курс завершён</h2><div class="footnote">Все 62 дня отмечены. Открой аналитику, сравни исходные и итоговые показатели и выбери привычки, которые хочешь сохранить.</div><button class="btn btn-primary btn-block mt-2" onclick="renderDetoxCourseReport()">Посмотреть итоговый анализ</button></div>';
  html+='<div class="card"><h2>📊 Анализ и выводы</h2><button class="btn btn-ghost btn-block" onclick="renderDetoxCourseReport()">Открыть полный отчёт курса</button><div class="footnote mt-2">Отчёт учитывает выполнение, экранное время и самооценки. Если данных мало, он прямо покажет, чего не хватает.</div></div>';
  var phases={};course.forEach(function(d){phases[d.phase]=(phases[d.phase]||0)+1;});
  var currentPhase='';
  course.forEach(function(d){
    if(d.phase!==currentPhase){currentPhase=d.phase;html+='<div class="section-title mt-3">'+esc(currentPhase)+'</div>';}
    var r=state.detoxCourseProgress[d.day],isDone=r===true||!!(r&&r.completed),checks=r&&r.checks?r.checks.filter(Boolean).length:0;
    html+='<div class="method-card" style="'+(isDone?'border-left:3px solid var(--success);':'')+'" onclick="openDetoxDay('+d.day+')"><div class="method-header"><div class="method-emoji">'+(isDone?'✓':d.emoji)+'</div><div style="flex:1"><div class="method-title">День '+d.day+': '+esc(d.title)+'</div><div class="method-cat">'+esc(d.subtitle||d.phase)+' · '+(isDone?'Выполнено':checks+'/'+(d.do||[]).length+' шагов отмечено')+'</div></div><div class="list-chevron">›</div></div></div>';
  });
  html+='<button class="btn btn-ghost btn-block mt-3" onclick="navigate(\'vision\')">← К разделу зрения</button></div>';
  document.getElementById('app').innerHTML=html;
}
function openDetoxDay(day){
  var d=getDetoxDay(day);if(!d)return;
  var rec=getDetoxCourseRecord(day),isDone=!!rec.completed;
  var html='<div class="detox-day-detail"><div style="font-size:20px;font-weight:800;margin-bottom:6px">'+d.emoji+' День '+day+': '+esc(d.title)+'</div><div class="footnote mb-3">'+esc(d.phase)+' · '+esc(d.subtitle||'Практика дня')+'</div>';
  var dayGuide=getDetoxTaskGuide(day,(d.do||[])[0]||d.title,0),dayDetails=window.DETOX_DAY_DETAILS&&window.DETOX_DAY_DETAILS[day];
  var learning=d.learning||{};
  html+='<div class="card"><h2>📘 Подробное объяснение</h2><div class="lesson-content">'+esc(learning.explanation|| (dayDetails?dayDetails.why:dayGuide.why))+'</div><div class="footnote mt-2">'+esc(learning.prepare||'Подготовь доступное время и выбери посильный вариант.')+'</div></div>';
  html+='<div class="card"><h2>🎯 Цель дня</h2><div class="lesson-content">'+esc(dayDetails?dayDetails.objective:dayGuide.why)+'</div><div class="footnote mt-2">'+esc(dayDetails?dayDetails.why:'Цель — выполнить посильную практику и проверить личный результат по своим данным.')+'</div></div>';
  if(dayDetails){html+='<div class="card"><h2>🧭 Подробная методика</h2><ol style="padding-left:20px;margin:8px 0">'+dayDetails.steps.map(function(step){return '<li style="margin:8px 0;line-height:1.5">'+esc(step)+'</li>';}).join('')+'</ol><div class="footnote mt-2"><b>Критерий выполнения:</b> '+esc(dayDetails.check)+'</div><div class="footnote mt-2"><b>Если сложно:</b> '+esc(dayDetails.fallback)+'</div></div>';}
  if(learning.safety||learning.reflection){html+='<div class="card"><h2>🛡 Безопасность и адаптация</h2><div class="footnote">'+esc(learning.safety||'Адаптируй задание под свои обстоятельства.')+'</div>'+(learning.reflection?'<div class="footnote mt-2"><b>Вопрос для дневника:</b> '+esc(learning.reflection)+'</div>':'')+(learning.fallback?'<div class="footnote mt-2"><b>Если сложно:</b> '+esc(learning.fallback)+'</div>':'')+'</div>';}
  html+='<div class="card"><h2>🔬 Что важно знать</h2><div class="lesson-content">Изменения экранных привычек индивидуальны. Мы не обещаем фиксированный процент улучшения и не используем неподтверждённые цифры как гарантированный результат. Проверяй эффект по своим записям: время, частота открытий, сон, концентрация и самочувствие.</div><div class="footnote mt-2">Совет дня: '+esc(d.tips||'Выбирай реалистичный шаг.')+'</div></div>';
  html+='<div class="card"><h2>🧭 План выполнения</h2><div class="footnote mb-2">Прочитай объяснение каждого пункта, затем отметь выполнение. Можно адаптировать задание под работу, учёбу, безопасность и состояние.</div>';
  (d.do||[]).forEach(function(task,i){var g=getDetoxTaskGuide(day,task,i),checked=!!rec.checks[i];
    html+='<div class="detox-task-guide"><label class="list-row" style="align-items:flex-start"><input type="checkbox" '+(checked?'checked':'')+' onchange="toggleDetoxCourseTask('+day+','+i+',this.checked)"><span style="font-weight:700">'+esc(task)+'</span></label><div class="footnote mt-2"><b>Зачем:</b> '+esc(g.why)+'</div><div class="footnote mt-1"><b>Подготовка:</b> '+esc(g.prepare)+'</div><ol style="padding-left:20px;margin:8px 0">'+g.steps.map(function(x){return '<li style="margin:5px 0">'+esc(x)+'</li>';}).join('')+'</ol><div class="footnote"><b>Пример:</b> '+esc(g.example)+'</div><div class="footnote mt-1"><b>Проверка:</b> '+esc(g.check)+'</div></div>';
  });
  html+='</div><div class="card"><h2>📏 Измерь результат</h2><div class="footnote mb-2">Заполни в конце дня. Если показатель неизвестен — оставь поле пустым, не угадывай.</div><div class="field"><label class="field-label">Экранное время за день, минут</label><input id="detox-screen" type="number" min="0" max="1440" step="1" value="'+(rec.reflection.screenMinutes??'')+'" placeholder="Например, 245"></div><div class="field"><label class="field-label">Сколько раз открыл телефон без конкретной цели?</label><input id="detox-urges" type="number" min="0" max="500" value="'+(rec.reflection.unplannedOpens??'')+'" placeholder="Необязательно"></div><div class="field"><label class="field-label">Сон прошлой ночью, часов</label><input id="detox-sleep" type="number" min="0" max="24" step="0.25" value="'+(rec.reflection.sleepHours??'')+'" placeholder="Например, 7.5"></div><div class="field"><label class="field-label">Концентрация сегодня, 1–5</label><select id="detox-focus"><option value="">Не оценивал</option>'+[1,2,3,4,5].map(function(n){return '<option value="'+n+'" '+(Number(rec.reflection.focus)===n?'selected':'')+'>'+n+(n===1?' — очень трудно':n===3?' — средне':n===5?' — отлично':'')+'</option>';}).join('')+'</select></div><div class="field"><label class="field-label">Насколько задание помогло? 1–5</label><select id="detox-help"><option value="">Пока не знаю</option>'+[1,2,3,4,5].map(function(n){return '<option value="'+n+'" '+(Number(rec.reflection.helped)===n?'selected':'')+'>'+n+'</option>';}).join('')+'</select></div><div class="field"><label class="field-label">Что заметил? Что было сложно? Что изменить завтра?</label><textarea id="detox-note" rows="4" maxlength="1200" placeholder="Коротко: факт → вывод → следующий шаг">'+esc(rec.reflection.note||'')+'</textarea></div><button class="btn btn-ghost btn-block" onclick="saveDetoxDayReflection('+day+')">💾 Сохранить наблюдения</button></div>';
  if(isDone)html+='<div class="card"><div class="footnote">День уже отмечен как выполненный. Наблюдения можно дополнять и исправлять — XP повторно не начисляется.</div></div>';
  else html+='<button class="btn btn-primary btn-block mt-2" onclick="completeDetoxDay('+day+')">✓ Завершить день и сохранить результат</button>';
  html+='</div>';
  openSheet('День '+day+' · подробный план',html);
}

function renderDetoxCourseReport(){
  var stats=getDetoxCourseStats(),rows=Object.keys(state.detoxCourseProgress||{}).map(function(k){var r=state.detoxCourseProgress[k];return {day:Number(k),record:r===true?{completed:true}:r};}).sort(function(x,y){return x.day-y.day;});
  var reflections=rows.filter(function(x){return x.record&&detoxReflectionHasData(x.record.reflection);});
  var avg=function(key){var vals=reflections.map(function(x){return x.record.reflection[key];}).filter(function(v){return v!==null&&v!==undefined&&v!==''&&Number.isFinite(Number(v));}).map(Number);return vals.length?Math.round(vals.reduce(function(a,b){return a+b;},0)/vals.length*10)/10:null;};
  var sleep=avg('sleepHours'),focus=avg('focus'),help=avg('helped'),opens=avg('unplannedOpens');
  var screenDirection=stats.screenDelta===null?'нет достаточных данных':stats.screenDelta<0?'снижение':stats.screenDelta>0?'рост':'без изменения';
  var insight='Пока недостаточно записей для выводов. Заполни исходный замер и дневные наблюдения минимум за 7 дней.';
  if(stats.screenSamples>=3&&stats.screenBaseline!==null&&stats.screenRecent!==null){
    var pct=stats.screenBaseline>0?Math.round((stats.screenRecent-stats.screenBaseline)/stats.screenBaseline*100):null;
    insight=stats.screenDelta<0?'По твоим записям экранное время снизилось на '+Math.abs(stats.screenDelta)+' мин/день ('+(pct===null?'—':Math.abs(pct)+'%')+'). Сохрани подходящие изменения и проверь, не выросло ли время в других приложениях.':stats.screenDelta>0?'Экранное время выросло на '+stats.screenDelta+' мин/день ('+(pct===null?'—':pct+'%')+'). Это не провал: проверь, какие приложения и ситуации дали рост, и выбери одно небольшое изменение на следующую неделю.':'Среднее экранное время пока близко к исходной точке. Проверь не только минуты, но и частоту бесцельных открытий, сон и концентрацию.';
  }
  var html='<div class="page"><div class="title-xl">📊 Аналитика 62-дневного детокса</div><div class="subtitle">Отчёт строится только по сохранённым тобой данным. LIFE OS не считывает экранное время автоматически.</div>';
  html+='<div class="grid-2 mb-3"><div class="card"><div class="stat-value">'+stats.completed+'/62</div><div class="stat-label">Завершено дней</div></div><div class="card"><div class="stat-value">'+stats.reflections+'</div><div class="stat-label">Дневниковых записей</div></div><div class="card"><div class="stat-value">'+(stats.screenBaseline===null?'—':stats.screenBaseline+' мин')+'</div><div class="stat-label">Первая измеренная точка</div></div><div class="card"><div class="stat-value">'+(stats.screenRecent===null?'—':stats.screenRecent+' мин')+'</div><div class="stat-label">Среднее последних записей</div></div></div>';
  html+='<div class="card"><h2>🧠 Вывод по текущим данным</h2><div class="lesson-content">'+esc(insight)+'</div><div class="footnote mt-2">Направление: '+screenDirection+'. Изменение не доказывает, что именно курс вызвал результат: учитывай работу, выходные, поездки и другие обстоятельства.</div></div>';
  html+='<div class="card"><h2>📈 Другие показатели</h2><div class="grid-2"><div><b>'+(sleep===null?'—':sleep+' ч')+'</b><div class="footnote">Средний сон по записям</div></div><div><b>'+(focus===null?'—':focus+'/5')+'</b><div class="footnote">Средняя концентрация</div></div><div><b>'+(help===null?'—':help+'/5')+'</b><div class="footnote">Насколько помогали задания</div></div><div><b>'+(opens===null?'—':opens)+'</b><div class="footnote">Бесцельные открытия/день</div></div></div></div>';
  html+='<div class="card"><h2>🛠 Что делать дальше</h2>';
  if(stats.reflections<7)html+='<div class="list-row"><div class="list-body"><div class="list-title">1. Собери базовые данные</div><div class="footnote">Заполни экранное время, сон и концентрацию ещё несколько дней. Не подменяй пропуски нулями.</div></div></div>';
  if(stats.screenDelta!==null&&stats.screenDelta>0)html+='<div class="list-row"><div class="list-body"><div class="list-title">2. Найди источник роста</div><div class="footnote">Посмотри топ-3 приложения и выбери одно изменение: лимит, уведомления или отдельное время проверки.</div></div></div>';
  if(help!==null&&help<3)html+='<div class="list-row"><div class="list-body"><div class="list-title">3. Упрости задания</div><div class="footnote">Средняя оценка пользы низкая. Уменьши объём, измени замену или выбери более подходящее время.</div></div></div>';
  if(focus!==null&&focus<3)html+='<div class="list-row"><div class="list-body"><div class="list-title">4. Уменьши блоки фокуса</div><div class="footnote">Попробуй 10–15 минут одной задачи, затем короткий перерыв. Не форсируй длительные сессии.</div></div></div>';
  html+='<div class="footnote mt-2">Рекомендации — безопасные эксперименты, а не автоматическое управление телефоном. Решение остаётся за тобой.</div></div>';
  html+='<div class="card"><h2>📅 Дневник по дням</h2>';
  if(!reflections.length)html+='<div class="footnote">Записей пока нет.</div>';
  reflections.slice().reverse().forEach(function(x){var r=x.record.reflection;html+='<div class="list-row"><div class="list-body"><div class="list-title">День '+x.day+'</div><div class="footnote">'+(r.screenMinutes===null?'Экран —':r.screenMinutes+' мин экран')+' · '+(r.sleepHours===null?'сон —':r.sleepHours+' ч сон')+' · '+(r.focus===null?'фокус —':'фокус '+r.focus+'/5')+'</div>'+(r.note?'<div class="footnote">'+esc(r.note)+'</div>':'')+'</div></div>';});
  html+='</div><button class="btn btn-primary btn-block" onclick="renderDetoxCourse()">← К 62-дневному курсу</button></div>';
  document.getElementById('app').innerHTML=html;
}

function toggleDetoxCourseTask(day,index,checked){
  var r=getDetoxCourseRecord(day);r.checks[index]=!!checked;r.updatedAt=nowISO();save();
  var count=r.checks.filter(Boolean).length,d=getDetoxDay(day);
  toast(count+'/'+((d&&d.do)||[]).length+' шагов отмечено','success',1200);
}
function saveDetoxDayReflection(day){
  var r=getDetoxCourseRecord(day),read=function(id){var el=document.getElementById(id);return el?el.value:'';};
  var screen=read('detox-screen'),urges=read('detox-urges'),sleep=read('detox-sleep'),focus=read('detox-focus'),help=read('detox-help');
  function numberOrNull(v,min,max){if(v==='')return null;var n=Number(v);return Number.isFinite(n)&&n>=min&&n<=max?n:null;}
  var sm=numberOrNull(screen,0,1440),uo=numberOrNull(urges,0,500),sh=numberOrNull(sleep,0,24);
  if(screen!==''&&sm===null||urges!==''&&uo===null||sleep!==''&&sh===null)return toast('Проверь числовые значения','warning');
  r.reflection={screenMinutes:sm,unplannedOpens:uo,sleepHours:sh,focus:numberOrNull(focus,1,5),helped:numberOrNull(help,1,5),note:read('detox-note').trim().slice(0,1200),updatedAt:nowISO()};
  save();toast('Наблюдения сохранены','success');return true;
}
function completeDetoxDay(day){
  var d=getDetoxDay(day);if(!d)return;
  var r=getDetoxCourseRecord(day);if(r.completed){toast('Этот день уже завершён','info');return;}
  var count=(d.do||[]).filter(function(_,i){return !!r.checks[i];}).length;
  if(count<(d.do||[]).length&&!confirm('Отмечено '+count+' из '+(d.do||[]).length+' шагов. Завершить день с частичным выполнением? Можно вернуться и дополнить позже.'))return;
  if(!saveDetoxDayReflection(day))return;
  r.completed=true;r.completedAt=nowISO();r.updatedAt=nowISO();r.completedTasks=count;r.totalTasks=(d.do||[]).length;
  addXP(10,'detox');addPetXP(2);save();haptic('success');toast('День '+day+' сохранён. '+count+'/'+r.totalTasks+' шагов','success');closeSheet();renderDetoxCourse();
}

/* ============ FSRS-5 (интервальное повторение) ============ */
function renderFSRS(){
  var fsrs = state.fsrs || defaultState().fsrs;
  var cards = fsrs.cards || {};
  var due = Object.keys(cards).filter(function(id){
    var c = cards[id];
    return !c.nextReview || new Date(c.nextReview) <= new Date();
  });
  var html = '<div class="page"><div class="title-xl">🃏 Карточки FSRS-5</div>';
  html += '<div class="stat-grid mb-3">';
  html += '<div class="stat-item"><div class="stat-value">' + Object.keys(cards).length + '</div><div class="stat-label">Всего</div></div>';
  html += '<div class="stat-item"><div class="stat-value">' + due.length + '</div><div class="stat-label">К повтору</div></div>';
  html += '<div class="stat-item"><div class="stat-value">' + (fsrs.stats && fsrs.stats.mature || 0) + '</div><div class="stat-label">Зрелых</div></div>';
  html += '</div>';
  if(due.length){
    html += '<button class="btn btn-primary btn-block mb-3" onclick="navigate(\'fsrsReview\')">🎯 Повторить ' + due.length + ' карточек</button>';
  }
  html += '<div class="card"><h2>Создать карточку</h2>';
  html += '<div class="field"><label class="field-label">Вопрос</label><input type="text" id="fsrs-q"/></div>';
  html += '<div class="field"><label class="field-label">Ответ</label><textarea id="fsrs-a"></textarea></div>';
  html += '<button class="btn btn-ghost btn-block" onclick="createFSRSCard()">+ Добавить</button>';
  html += '</div></div>';
  document.getElementById('app').innerHTML = html;
}
function renderFSRSReview(){
  var fsrs = state.fsrs || defaultState().fsrs;
  var cards = fsrs.cards || {};
  var due = Object.keys(cards).filter(function(id){
    var c = cards[id];
    return !c.nextReview || new Date(c.nextReview) <= new Date();
  });
  if(!due.length){
    document.getElementById('app').innerHTML = '<div class="page"><div class="title-xl">🃏 Повторение</div><div class="card"><div class="empty"><div class="empty-icon">✓</div><div class="empty-title">Все повторено</div></div></div></div>';
    return;
  }
  var cardId = due[0];
  var card = cards[cardId];
  var html = '<div class="page"><div class="title-xl">🃏 Повторение</div>';
  html += '<div class="card card-gradient" style="text-align:center;padding:40px 16px;min-height:200px;display:flex;flex-direction:column;justify-content:center;">';
  html += '<div style="font-size:12px;opacity:.9;">Вопрос</div>';
  html += '<div style="font-size:20px;font-weight:800;margin-top:10px;">' + esc(card.question) + '</div>';
  html += '</div>';
  html += '<div class="card"><div class="footnote text-secondary">Ответ:</div><div style="font-size:16px;font-weight:600;margin-top:8px;">' + esc(card.answer) + '</div></div>';
  html += '<div class="card"><h2>Оцени ответ</h2>';
  html += '<div class="row" style="gap:6px;">';
  html += '<button class="btn btn-danger" style="flex:1;" onclick="reviewFSRS(\'' + cardId + '\',1)">😰 Забыл</button>';
  html += '<button class="btn btn-ghost" style="flex:1;" onclick="reviewFSRS(\'' + cardId + '\',2)">🤔 Трудно</button>';
  html += '<button class="btn btn-ghost" style="flex:1;" onclick="reviewFSRS(\'' + cardId + '\',3)">🙂 Ок</button>';
  html += '<button class="btn btn-success" style="flex:1;" onclick="reviewFSRS(\'' + cardId + '\',4)">😎 Легко</button>';
  html += '</div></div></div>';
  document.getElementById('app').innerHTML = html;
}
function createFSRSCard(){
  var q = (document.getElementById('fsrs-q')||{}).value || '';
  var a = (document.getElementById('fsrs-a')||{}).value || '';
  if(!q.trim() || !a.trim()) return toast('Заполни вопрос и ответ','error');
  if(!state.fsrs) state.fsrs = defaultState().fsrs;
  var id = 'card_' + uid();
  state.fsrs.cards[id] = {
    id:id, question:q.trim(), answer:a.trim(),
    createdAt:nowISO(),
    stability:0, difficulty:5, retrievability:0.5,
    lastReview:null, nextReview:nowISO(),
    reviews:0, lapses:0, state:'new'
  };
  state.fsrs.stats.totalCards = (state.fsrs.stats.totalCards||0) + 1;
  save();
  toast('✓ Карточка создана','success');
  renderFSRS();
}
function reviewFSRS(cardId, rating){
  if(!state.fsrs) state.fsrs = defaultState().fsrs;
  var card = state.fsrs.cards[cardId];
  if(!card) return;
  /* FSRS-5 упрощённо */
  var intervals = {1:1, 2:3, 3:7, 4:21};
  rating=Math.max(1,Math.min(4,Math.round(Number(rating)||1)));
  var days = intervals[rating] || 1;
  var reviewedAt=nowISO(),previousDue=card.nextReview||null;
  if(rating === 1){
    card.stability = Math.max(0.1, (card.stability||1) * 0.5);
    card.lapses = (card.lapses||0) + 1;
    card.state = 'relearning';
  } else {
    card.stability = Math.max(1, (card.stability||1) * (1 + rating * 0.5));
    card.state = 'review';
  }
  card.difficulty = Math.max(1, Math.min(10, (card.difficulty||5) + (rating < 3 ? 0.5 : -0.3)));
  card.reviews = (card.reviews||0) + 1;
  card.lastReview = reviewedAt;
  var next = new Date();
  next.setDate(next.getDate() + days);
  card.nextReview = next.toISOString();
  if(!Array.isArray(state.fsrs.reviews))state.fsrs.reviews=[];
  state.fsrs.reviews.push({id:uid(),cardId:cardId,at:reviewedAt,rating:rating,recalled:rating>=2,intervalDays:days,scheduledDays:days,stability:card.stability,difficulty:card.difficulty,previousDue:previousDue,wasDue:!previousDue||new Date(previousDue)<=new Date(reviewedAt)});
  if(state.fsrs.reviews.length>5000)state.fsrs.reviews=state.fsrs.reviews.slice(-5000);
  addXP(3, 'fsrs_review');addPetXP(1);
  save();
  toast(rating >= 3 ? '✓ Повторишь через ' + days + ' дн.' : '↺ Повторишь через ' + days + ' дн.','info');
  renderFSRSReview();
}

/* ============ ACHIEVEMENTS ============ */
function checkAchievements(){
  var achs = window.ACHIEVEMENTS_333 || window.ACHIEVEMENTS || [];
  if(!achs.length) return;
  if(!state.profile) state.profile = {achievements:[]};
  if(!state.profile.achievements) state.profile.achievements = [];
  var unlocked = state.profile.achievements;
  var newOnes = [];
  for(var i = 0; i < achs.length; i++){
    var a = achs[i];
    if(!a.check) continue;
    try{
      if(unlocked.indexOf(a.id) < 0 && a.check(state)){
        unlocked.push(a.id);
        newOnes.push(a);
        addXP(15, 'achievement');
        addPetXP(5);
      }
    }catch(e){}
  }
  state.profile.achievements = unlocked;
  if(newOnes.length){
    save();
    newOnes.forEach(function(a, idx){
      setTimeout(function(){
        toast('🏆 ' + a.name,'success',3500);
        haptic('success');
      }, idx * 800);
    });
  }
}
function renderAchievements(){
  var achs = window.ACHIEVEMENTS_333 || window.ACHIEVEMENTS || [];
  var unlocked = (state.profile && state.profile.achievements) || [];
  var html = '<div class="page"><div class="title-xl">🏆 Достижения</div>';
  html += '<div class="card card-gradient"><div style="font-size:14px;opacity:.9;">Открыто</div>';
  html += '<div style="font-size:40px;font-weight:800;">' + unlocked.length + ' / ' + achs.length + '</div>';
  html += '<div style="font-size:12px;opacity:.9;margin-top:6px;">' + (achs.length ? Math.round(unlocked.length/achs.length*100) : 0) + '%</div>';
  html += '</div>';
  html += '<div class="achieve-grid">';
  achs.slice(0, 60).forEach(function(a){
    var isUnlocked = unlocked.indexOf(a.id) >= 0;
    html += '<div class="achieve-item ' + (isUnlocked?'unlocked':'locked') + '">';
    html += '<div class="achieve-icon">' + (a.emoji || a.icon || '🏆') + '</div>';
    html += '<div class="achieve-name">' + esc(a.name) + '</div>';
    html += '</div>';
  });
  html += '</div></div>';
  document.getElementById('app').innerHTML = html;
}
function renderAchievementsCategory(){ renderAchievements(); }

/* ============ EXPORTS ============ */
window.getEisenhowerQuadrant = getEisenhowerQuadrant;
window.getEisenhowerPriority = getEisenhowerPriority;
window.renderTasks = renderTasks;
window.toggleTask = toggleTask;
window.renderMatrix = renderMatrix;
window.openEntityEditor = openEntityEditor;
window.openTaskEditorV2 = openTaskEditorV2;
window.rerenderChecklist = rerenderChecklist;
window.addChecklistItem = addChecklistItem;
window.removeChecklistItem = removeChecklistItem;
window.toggleChecklistItem = toggleChecklistItem;
window.updateChecklistItem = updateChecklistItem;
window.saveTaskV2 = saveTaskV2;
window.deleteTaskV2 = deleteTaskV2;
window.renderLearning = renderLearning;
window.renderLevels = renderLevels;
window.openLevel = openLevel;
window.renderLevelDetail = renderLevelDetail;
window.openLesson = openLesson;
window.completeLesson = completeLesson;
window.formatLesson = formatLesson;
window.renderSkills = renderSkills;
window.openSkill = openSkill;
window.completeSkill = completeSkill;
window.renderEnglish = renderEnglish;
window.openEnglishLesson = openEnglishLesson;
window.completeEnglish = completeEnglish;
window.renderCourseGeneric = renderCourseGeneric;
window.openCourseLesson = openCourseLesson;
window.startNextCourseReview = startNextCourseReview;
window.completeCourseLesson = completeCourseLesson;
window.renderVision = renderVision;
window.startVisionBreak = startVisionBreak;
window.saveVisionMetric = saveVisionMetric;
window.toggleVisionHeadache = toggleVisionHeadache;
window.resetVisionRedFlags = resetVisionRedFlags;
window.renderVisionExercises = renderVisionExercises;
window.renderVision60 = renderVision60;
window.renderVisionTracker = renderVisionTracker;
window.renderVisionTips = renderVisionTips;
window.startEyeExercise = startEyeExercise;
window.completeEyeExercise = completeEyeExercise;
window.ensureVisionState = ensureVisionState;
window.openVisionSymptomLog = openVisionSymptomLog;
window.saveVisionSymptoms = saveVisionSymptoms;
window.saveVisionExam = saveVisionExam;
window.startVisionBreak = startVisionBreak;
window.finishVisionBreak = finishVisionBreak;
window.startEyeExercise = startEyeExercise;
window.renderVision62 = renderVision62;
window.startDetox62 = startDetox62;
window.completeDetox62Day = completeDetox62Day;
window.skipDetox62Day = skipDetox62Day;
window.renderDetoxCourse = renderDetoxCourse;
window.renderDetoxCourseReport = renderDetoxCourseReport;
window.toggleDetoxCourseTask = toggleDetoxCourseTask;
window.saveDetoxDayReflection = saveDetoxDayReflection;
window.openDetoxDay = openDetoxDay;
window.completeDetoxDay = completeDetoxDay;
window.renderFSRS = renderFSRS;
window.renderFSRSReview = renderFSRSReview;
window.createFSRSCard = createFSRSCard;
window.reviewFSRS = reviewFSRS;
window.checkAchievements = checkAchievements;
window.renderAchievements = renderAchievements;
window.renderAchievementsCategory = renderAchievementsCategory;

/* ============ КОНЕЦ ЧАСТИ 3/4 ============ */

/* Продолжение в части 4/4: здоровье, сон, вода, коуч-чаты, 
   игры, лиги, питомец, детокс, настройки, профиль, PWA,
   Obsidian, Telegram, 60-дневное очищение, init() */

/* Закрытие IIFE в части 4/4 */


/* ============================================================
   LIFE OS — APP.js v47 — ЧАСТЬ 4/4
   Здоровье, Вода, Сон, Настроение, Антистресс, Brain,
   Игры, Лиги, Питомец, Детокс-хаб, 60-дневное очищение,
   Obsidian, Telegram, Настройки, Профиль, PWA, init()
   ============================================================ */

/* ============ ЗДОРОВЬЕ / ВОДА / НАСТРОЕНИЕ ============ */
function getWaterGoal(){
  var p = state.profileV2 || {};
  if(p.weight) return Math.round(p.weight * 30 / 250);
  return state.settings.waterGoal || 8;
}
function addWater(){
 var t=today();if(!Array.isArray(state.customWater))state.customWater=[];
 var e=state.customWater.find(function(w){return w.date===t;});if(e)e.count=(Number(e.count)||0)+1;else state.customWater.push({id:uid(),date:t,count:1,created_at:nowISO()});
 state.stats=state.stats||{};state.stats.totalWater=(Number(state.stats.totalWater)||0)+1;addXP(2,'water');save();toast('💧 +1 стакан','success');haptic('success');
 if(currentPage==='dashboard')renderDashboard();else if(currentPage==='water')renderWater();else if(currentPage==='health')renderHealth();
}
function removeWater(){
 var t=today(),e=(state.customWater||[]).find(function(w){return w.date===t;});if(!e||Number(e.count)<=0)return toast('Сегодня ещё нет записей воды','info');
 e.count=Math.max(0,Number(e.count)-1);state.stats=state.stats||{};state.stats.totalWater=Math.max(0,(Number(state.stats.totalWater)||0)-1);save();toast('Последний стакан отменён','info');
 if(currentPage==='dashboard')renderDashboard();else if(currentPage==='water')renderWater();else if(currentPage==='health')renderHealth();
}
function quickWaterLog(){
 var e=(state.customWater||[]).find(function(w){return w.date===today();}),count=e?Number(e.count)||0:0;
 openSheet('Вода сегодня','<div style="text-align:center"><div style="font-size:54px">💧</div><div class="stat-value" id="quickWaterCount">'+count+'</div><div class="footnote">стаканов · ориентир '+getWaterGoal()+'</div><div class="row mt-3" style="gap:8px"><button class="btn btn-ghost" onclick="removeWater();var x=document.getElementById(&quot;quickWaterCount&quot;);if(x)x.textContent=Math.max(0,Number(x.textContent)-1)">− 1</button><button class="btn btn-primary" onclick="addWater();var x=document.getElementById(&quot;quickWaterCount&quot;);if(x)x.textContent=Number(x.textContent)+1">＋ 1 стакан</button></div><p class="footnote mt-3">Цель — персональный ориентир приложения, не обязательная медицинская норма.</p></div>');
}

function quickMoodLog(){
  var moods = ['😢','😔','😐','🙂','😊'];
  var html = '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;">';
  moods.forEach(function(m, i){
    html += '<button class="btn btn-ghost" style="font-size:32px;padding:20px 0;" onclick="saveMood(' + ((i+1)*2) + ')">' + m + '</button>';
  });
  html += '</div>';
  openSheet('Настроение?', html);
}
function saveMood(score){
 score=Number(score);if(!Number.isFinite(score)||score<1||score>10)return toast('Выбери настроение от 1 до 10','warning');score=Math.round(score);
 var t=today();if(!Array.isArray(state.customMood))state.customMood=[];
 var e=state.customMood.find(function(m){return m.date===t;}),isNew=!e;
 if(e)e.score=score;else state.customMood.push({id:uid(),date:t,score:score,created_at:nowISO()});
 state.stats=state.stats||{};if(isNew)state.stats.totalMoodLogs=(Number(state.stats.totalMoodLogs)||0)+1;
 save();closeSheet();toast('Настроение сохранено · '+score+'/10','success');
 if(currentPage==='dashboard')renderDashboard();else if(currentPage==='mood')renderMood();else if(currentPage==='health')renderHealth();
}

function renderWater(){
 var e=(state.customWater||[]).find(function(w){return w.date===today();}),count=e?Number(e.count)||0:0,goal=getWaterGoal();
 var html='<div class="page"><div class="title-xl">💧 Вода</div><div class="subtitle">Учитывай жажду, активность, погоду и рекомендации врача. Количество стаканов — личный ориентир.</div><div class="card card-gradient" style="text-align:center"><div style="font-size:56px">💧</div><div class="stat-value">'+count+' / '+goal+'</div><div class="progress mt-2"><div class="progress-fill" style="width:'+Math.min(100,Math.round(count/Math.max(1,goal)*100))+'%"></div></div><div class="footnote mt-2">Записано сегодня · условный стакан 250 мл</div></div><div class="row" style="gap:8px"><button class="btn btn-primary" style="flex:1" onclick="addWater()">＋ 1 стакан</button><button class="btn btn-ghost" style="flex:1" onclick="removeWater()">− Отменить</button></div></div>';
 document.getElementById('app').innerHTML=html;
}

function renderMood(){
  var m = state.customMood || [];
  var html = '<div class="page"><div class="title-xl">💭 Настроение</div>';
  html += '<button class="btn btn-primary btn-block mb-4" onclick="quickMoodLog()">Записать</button>';
  if(m.length){ m.slice(-10).reverse().forEach(function(e){ html += '<div class="list-row"><div class="list-icon">' + (e.score>=7?'😊':e.score>=5?'🙂':'😔') + '</div><div class="list-body"><div class="list-title">' + e.date + '</div><div class="list-subtitle">' + e.score + '/10</div></div></div>'; }); }
  else html += '<div class="empty"><div class="empty-icon">💭</div><div class="empty-title">Пусто</div></div>';
  html += '</div>';
  document.getElementById('app').innerHTML = html;
}
function renderHealth(){
  var waterEntry = (state.customWater||[]).find(function(w){ return w.date === today(); });
  var water = waterEntry ? waterEntry.count : 0;
  var waterGoal = getWaterGoal();
  var html = '<div class="page"><div class="title-xl">❤️ Здоровье</div>';
  html += '<div class="card"><div class="stat-grid">';
  html += '<div class="stat-item" onclick="quickMoodLog()" style="cursor:pointer;"><div class="stat-value">💭</div><div class="stat-label">Настроение</div></div>';
  html += '<div class="stat-item" onclick="addWater()" style="cursor:pointer;"><div class="stat-value">' + water + '/' + waterGoal + '</div><div class="stat-label">Вода</div></div>';
  html += '<div class="stat-item" onclick="navigate(\'sleep\')" style="cursor:pointer;"><div class="stat-value">😴</div><div class="stat-label">Сон</div></div>';
  html += '</div></div></div>';
  document.getElementById('app').innerHTML = html;
}

/* ============ СОН ============ */
function calcSleepHours(startHHMM, endHHMM){
  if(!startHHMM || !endHHMM) return 0;
  var sp = startHHMM.split(':'), ep = endHHMM.split(':');
  var s = parseInt(sp[0]) * 60 + parseInt(sp[1]||0);
  var e = parseInt(ep[0]) * 60 + parseInt(ep[1]||0);
  if(e <= s) e += 24*60;
  return Math.round((e - s)/60*10)/10;
}
function getSleepEntryForDate(date){
  if(!date) date = today();
  return (state.sleepEntries||[]).find(function(s){ return s.date === date; });
}
function renderSleep(){
  var lastEntry = (state.sleepEntries||[]).slice(-1)[0];
  var html = '<div class="page">';
  html += '<div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">😴 Сон</div>';
  html += '<button class="btn btn-ghost btn-sm" onclick="navigate(\'sleepCalendar\')">📅</button></div>';
  html += '<div class="card card-gradient">';
  if(lastEntry){
    html += '<div style="font-size:12px;opacity:.9;">Последняя ночь</div>';
    html += '<div style="font-size:40px;font-weight:800;">' + lastEntry.hours + ' ч</div>';
    html += '<div style="font-size:12px;opacity:.9;margin-top:6px;">' + lastEntry.date + ' · качество ' + lastEntry.quality + '/10</div>';
  } else {
    html += '<div style="font-size:16px;font-weight:800;">Добавь первую запись</div>';
  }
  html += '</div>';
  html += '<button class="btn btn-primary btn-block mb-3" onclick="currentSleepDate=today();navigate(\'sleepEditor\')">➕ Записать сон</button>';
  html += '</div>';
  document.getElementById('app').innerHTML = html;
}
function renderSleepCalendar(){
  var y = SLEEP_CAL_CURSOR.getFullYear(), m = SLEEP_CAL_CURSOR.getMonth();
  var first = new Date(y, m, 1);
  var offset = first.getDay() === 0 ? 6 : first.getDay() - 1;
  var daysInMonth = new Date(y, m+1, 0).getDate();
  var todayISO = today();
  var html = '<div class="page"><div class="title-xl">📅 Календарь сна</div>';
  html += '<div class="cal-toolbar">';
  html += '<button class="cal-nav-btn" onclick="SLEEP_CAL_CURSOR=new Date(' + y + ',' + (m-1) + ',1);renderSleepCalendar()">‹</button>';
  html += '<button class="cal-today-btn" onclick="SLEEP_CAL_CURSOR=new Date();renderSleepCalendar()">Сегодня</button>';
  html += '<button class="cal-nav-btn" onclick="SLEEP_CAL_CURSOR=new Date(' + y + ',' + (m+1) + ',1);renderSleepCalendar()">›</button>';
  html += '<div class="cal-title">' + ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'][m] + ' ' + y + '</div>';
  html += '</div>';
  html += '<div class="cal-month"><div class="cal-month-head">';
  ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].forEach(function(d){ html += '<div class="cal-month-head-cell">' + d + '</div>'; });
  html += '</div><div class="cal-month-grid">';
  for(var i = offset-1; i >= 0; i--) html += '<div class="cal-month-cell" style="opacity:.35;"></div>';
  for(var d = 1; d <= daysInMonth; d++){
    var iso = y + '-' + pad(m+1) + '-' + pad(d);
    var e = getSleepEntryForDate(iso);
    var color = 'rgba(255,255,255,.08)';
    var num = '';
    if(e){
      if(e.hours >= 7 && e.hours <= 9) color = 'rgba(61,220,151,.35)';
      else if(e.hours >= 6) color = 'rgba(255,169,64,.35)';
      else color = 'rgba(255,107,107,.35)';
      num = '<div style="font-size:11px;font-weight:700;text-align:center;">' + e.hours + '</div>';
    }
    html += '<div class="cal-month-cell' + (iso === todayISO ? ' cal-today' : '') + '" style="background:' + color + ';" onclick="openSleepForDate(\'' + iso + '\')"><div class="cal-day-num">' + d + '</div>' + num + '</div>';
  }
  html += '</div></div></div>';
  document.getElementById('app').innerHTML = html;
}
function openSleepForDate(iso){ currentSleepDate = iso; navigate('sleepEditor'); }
function renderSleepEditor(){
  var date = currentSleepDate || today();
  var e = getSleepEntryForDate(date);
  var isNew = !e;
  if(isNew) e = {date:date, type:'night', start:'23:00', end:'07:00', hours:8, quality:7, notes:''};
  var html = '<div class="page"><div class="title-xl">' + (isNew?'Запись сна':'Сон: ' + date) + '</div>';
  html += '<div class="card">';
  html += '<div class="field"><label class="field-label">Дата</label><input type="date" id="sl-date" value="' + date + '"/></div>';
  html += '<div class="row" style="gap:8px;">';
  html += '<div style="flex:1;"><label class="field-label">Лёг</label><input type="time" id="sl-start" value="' + e.start + '"/></div>';
  html += '<div style="flex:1;"><label class="field-label">Встал</label><input type="time" id="sl-end" value="' + e.end + '"/></div></div>';
  html += '</div>';
  html += '<div class="card"><h2>✨ Качество</h2>';
  html += '<div style="text-align:center;padding:6px 0;"><div id="sl-q-display" style="font-size:44px;font-weight:800;color:var(--brand);">' + e.quality + '/10</div></div>';
  html += '<input type="range" min="1" max="10" value="' + e.quality + '" style="width:100%;margin:10px 0;" oninput="document.getElementById(\'sl-q-display\').textContent=this.value+\'/10\';document.getElementById(\'sl-quality-value\').value=this.value;"/>';
  html += '<input type="hidden" id="sl-quality-value" value="' + e.quality + '"/>';
  html += '</div>';
  html += '<div class="card"><h2>📝 Заметка</h2><textarea id="sl-notes" style="min-height:80px;">' + esc(e.notes||'') + '</textarea></div>';
  html += '<button class="btn btn-primary btn-block mb-2" onclick="saveSleepEntry()">💾 ' + (isNew?'Сохранить':'Обновить') + '</button>';
  if(!isNew) html += '<button class="btn btn-danger btn-block" onclick="deleteSleepEntry(\'' + date + '\')">🗑 Удалить</button>';
  html += '</div>';
  document.getElementById('app').innerHTML = html;
}
function saveSleepEntry(){
  var date = (document.getElementById('sl-date')||{}).value || today();
  var start = (document.getElementById('sl-start')||{}).value || '23:00';
  var end = (document.getElementById('sl-end')||{}).value || '07:00';
  var hours = calcSleepHours(start, end);
  var quality = parseInt((document.getElementById('sl-quality-value')||{}).value) || 7;
  var notes = (document.getElementById('sl-notes')||{}).value || '';
  var entry = {id: uid(), date:date, type:'night', start:start, end:end, hours:hours, quality:quality, notes:notes, createdAt:nowISO()};
  var idx = state.sleepEntries.findIndex(function(s){ return s.date === date; });
  if(idx >= 0) state.sleepEntries[idx] = entry;
  else state.sleepEntries.push(entry);
  addXP(5, 'sleep');
  save();
  haptic('success');
  toast('✓ ' + hours + ' ч','success');
  currentSleepDate = null;
  navigate('sleep');
}
function deleteSleepEntry(date){
  if(!confirm('Удалить?')) return;
  state.sleepEntries = state.sleepEntries.filter(function(s){ return s.date !== date; });
  save();
  toast('Удалено','info');
  currentSleepDate = null;
  navigate('sleep');
}

/* ============ АНТИСТРЕСС ============ */
function renderAntistress(){
 var cats=window.ANTISTRESS_CATEGORIES||[],practices=window.ANTISTRESS_PRACTICES||[],entries=state.antistressEntries||[],todayCount=entries.filter(function(e){return e.date===today();}).length,html='<div class="page"><div class="title-xl">🌬 Антистресс</div><div class="subtitle">Короткие практики саморегуляции. Выбирай комфортный темп; остановись при головокружении или дискомфорте.</div>';
 html+='<div class="card"><div class="row-between"><b>⚡ Быстрый старт</b><span class="badge">'+todayCount+' сегодня</span></div><div class="grid-2 mt-2"><button class="btn btn-ghost" onclick="openAntistressDetail(\'as_breath_sigh\')">😮‍💨 Физиологический вздох</button><button class="btn btn-ghost" onclick="openAntistressDetail(\'as_ground_54321\')">🌳 5–4–3–2–1</button><button class="btn btn-ghost" onclick="openAntistressDetail(\'as_breath_box\')">📦 Ровное дыхание</button><button class="btn btn-ghost" onclick="openAntistressDetail(\'as_med_body\')">🧘 Сканирование тела</button></div></div>';
 cats.forEach(function(cat){var list=practices.filter(function(p){return p.cat===cat.id;});if(!list.length)return;html+='<div class="section-title mt-3">'+cat.emoji+' '+esc(cat.name)+'</div>';list.forEach(function(p){var done=entries.filter(function(e){return e.practiceId===p.id;}).length;html+='<button class="method-card" style="width:100%;text-align:left;border-left:3px solid '+esc(cat.color||'var(--brand)')+'" onclick="openAntistressDetail(\''+p.id+'\')"><div class="method-header"><div class="method-emoji">'+p.emoji+'</div><div style="flex:1"><div class="method-title">'+esc(p.title)+'</div><div class="method-cat">'+esc(p.desc||'')+' · '+Math.max(1,Math.round((p.duration||60)/60))+' мин · выполнено '+done+'</div></div><span class="list-chevron">›</span></div></button>';});});
 html+='<div class="card mt-3"><b>История практик</b><div class="footnote mt-2">'+entries.slice(-8).reverse().map(function(e){var p=practices.find(function(x){return x.id===e.practiceId;});return esc(e.date)+' · '+esc(p?p.title:'Практика')}).join('<br>')+'</div></div></div>';document.getElementById('app').innerHTML=html;
}
function startAntistress(id){
 var p=(window.ANTISTRESS_PRACTICES||[]).find(function(x){return x.id===id;});if(!p){toast('Практика не найдена','error');return;}currentAntistressId=id;
 var duration=Math.max(15,Number(p.duration)||60);
 var html='<div style="text-align:center"><div style="font-size:52px">'+p.emoji+'</div><h2>'+esc(p.title)+'</h2><p class="footnote">'+esc(p.desc||'')+'</p><div class="stat-value" id="antiTimer">'+Math.floor(duration/60)+':'+String(duration%60).padStart(2,'0')+'</div><div class="progress mt-2"><div class="progress-fill" id="antiProgress" style="width:0%"></div></div><div class="footnote mt-2" id="antiTimerHint">Практика идёт. Кнопка завершения станет доступна по окончании таймера.</div></div><div class="card mt-2"><b>Пошагово</b><ol class="lesson-content">'+(p.steps||[]).map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ol></div><div class="footnote">Это упражнение для саморегуляции, а не лечение. Не задерживай дыхание и не форсируй вдохи; при дискомфорте остановись.</div><div class="btn-row mt-3"><button class="btn btn-primary" id="antiFinishBtn" disabled onclick="finishAntistress()">Завершить после таймера</button><button class="btn btn-ghost" onclick="finishAntistressEarly()">Завершить досрочно</button><button class="btn btn-ghost" onclick="cancelAntistress()">Отмена</button></div>';
 openSheet(p.title,html);startAntistressTimer(duration);
}
var antiTimerHandle=null,antiTimerStartedAt=0,antiTimerDuration=0,antiTimerFinished=false;
function startAntistressTimer(seconds){
 if(antiTimerHandle)clearInterval(antiTimerHandle);
 antiTimerDuration=Math.max(1,Number(seconds)||60);antiTimerStartedAt=Date.now();antiTimerFinished=false;
 function tick(){var elapsed=Math.min(antiTimerDuration,Math.floor((Date.now()-antiTimerStartedAt)/1000)),left=Math.max(0,antiTimerDuration-elapsed),node=document.getElementById('antiTimer'),bar=document.getElementById('antiProgress');if(node)node.textContent=Math.floor(left/60)+':'+String(left%60).padStart(2,'0');if(bar)bar.style.width=Math.round(elapsed/antiTimerDuration*100)+'%';if(left<=0){clearInterval(antiTimerHandle);antiTimerHandle=null;antiTimerFinished=true;var btn=document.getElementById('antiFinishBtn'),hint=document.getElementById('antiTimerHint');if(btn){btn.disabled=false;btn.textContent='✓ Завершить практику';}if(hint)hint.textContent='Время вышло. Если готов — сохрани результат.';haptic('success');}}
 tick();antiTimerHandle=setInterval(tick,250);
}
function finishAntistressRecord(completed){
 if(!currentAntistressId)return;
 if(antiTimerHandle){clearInterval(antiTimerHandle);antiTimerHandle=null;}
 var elapsed=Math.min(antiTimerDuration,Math.max(0,Math.floor((Date.now()-antiTimerStartedAt)/1000)));
 if(!Array.isArray(state.antistressEntries))state.antistressEntries=[];
 state.antistressEntries.push({id:uid(),practiceId:currentAntistressId,date:today(),time:nowISO(),duration:elapsed,plannedDuration:antiTimerDuration,durationCompleted:!!completed});
 if(completed)addXP(5,'antistress');
 save();haptic('success');toast(completed?'Практика завершена · +5 XP':'Досрочное завершение сохранено без бонуса XP',completed?'success':'info');closeSheet();currentAntistressId=null;renderAntistress();
}
function finishAntistress(){if(!antiTimerFinished){toast('Сначала закончи таймер или выбери досрочное завершение.','warning');return;}finishAntistressRecord(true);}
function finishAntistressEarly(){if(!currentAntistressId)return;finishAntistressRecord(false);}
function cancelAntistress(){if(antiTimerHandle){clearInterval(antiTimerHandle);antiTimerHandle=null;}currentAntistressId=null;closeSheet();}

function openAntistressDetail(id){currentAntistressId=id;navigate('antistressDetail');}
function renderAntistressDetail(){
 var p=(window.ANTISTRESS_PRACTICES||[]).find(function(x){return x.id===currentAntistressId;});
 if(!p){renderAntistress();return;}
 var entries=(state.antistressEntries||[]).filter(function(x){return x.practiceId===p.id;}),last=entries[entries.length-1];
 var html='<div class="page"><button class="btn btn-ghost btn-sm" onclick="navigate(\'antistress\')">← Все практики</button><div class="card card-gradient" style="text-align:center"><div style="font-size:60px">'+p.emoji+'</div><div class="title-xl">'+esc(p.title)+'</div><p class="body-text">'+esc(p.desc||'')+'</p><div class="footnote">'+entries.length+' выполнений'+(last?' · '+esc(last.date):'')+'</div><button class="btn btn-primary btn-block" onclick="startAntistress(\''+p.id+'\')">▶ Начать практику</button></div><div class="card"><h2>Пошаговая инструкция</h2><ol class="lesson-content">'+(p.steps||[]).map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ol></div><div class="card"><h2>Безопасность</h2><p class="footnote">Практика саморегуляции, не лечение. Не форсируй дыхание; остановись при головокружении, боли или дискомфорте.</p></div></div>';
 document.getElementById('app').innerHTML=html;
}

/* ============ BRAIN TRAINING ============ */
function renderBrain(){
  var cats = window.BRAIN_CATEGORIES || [];
  var games = window.BRAIN_TRAINING || [];
  var totalPlays = (state.brainPlays||[]).length;
  var todayPlays = (state.brainPlays||[]).filter(function(p){ return p.date === today(); }).length;
  var html = '<div class="page">';
  html += '<div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">🧠 Тренировка ума</div>';
  html += '<button class="btn btn-ghost btn-sm" onclick="navigate(\'brainStats\')">📊</button></div>';
  html += '<div class="card card-gradient"><div style="font-size:12px;opacity:.9;">Сегодня</div><div style="font-size:40px;font-weight:800;">' + todayPlays + '</div><div style="font-size:12px;opacity:.9;margin-top:6px;">Всего: ' + totalPlays + ' · Streak: ' + (state.brainStreak||0) + '</div></div>';
  games.slice(0, 40).forEach(function(g){
    var stat = state.brainStats && state.brainStats[g.id];
    var cat = cats.find(function(c){ return c.id === g.cat; });
    var catColor = cat ? cat.color : '#5b9eff';
    html += '<div class="method-card" style="border-left:3px solid ' + catColor + ';" onclick="startBrainGame(\'' + g.id + '\')">';
    html += '<div class="method-header"><div class="method-emoji">' + g.emoji + '</div>';
    html += '<div style="flex:1;min-width:0;"><div class="method-title">' + esc(g.title) + '</div>';
    html += '<div class="method-cat">' + esc(g.desc||'') + '</div></div>';
    html += '<div class="list-chevron">▶</div></div>';
    if(stat) html += '<div class="footnote text-tertiary" style="margin-top:6px;">Лучший: ' + stat.best + ' · Игр: ' + stat.plays + '</div>';
    html += '</div>';
  });
  html += '</div>';
  document.getElementById('app').innerHTML = html;
}
function renderBrainStats(){
  var plays = state.brainPlays || [];
  var html = '<div class="page"><div class="title-xl">📊 Статистика ума</div>';
  html += '<div class="stat-grid mb-4">';
  html += '<div class="stat-item"><div class="stat-value">' + plays.length + '</div><div class="stat-label">Всего</div></div>';
  html += '<div class="stat-item"><div class="stat-value">' + (state.brainStreak||0) + '</div><div class="stat-label">Streak</div></div>';
  html += '<div class="stat-item"><div class="stat-value">' + Object.keys(state.brainStats||{}).length + '</div><div class="stat-label">Игр</div></div>';
  html += '</div>';
  html += '</div>';
  document.getElementById('app').innerHTML = html;
}
function renderBrainGame(){ renderBrain(); }
function startBrainGame(id){
  var g = (window.BRAIN_TRAINING||[]).find(function(x){ return x.id === id; });
  if(!g) return;
  currentBrainGameId = id;
  var html = '<div style="text-align:center;margin-bottom:16px;"><div style="font-size:56px;">' + g.emoji + '</div><div style="font-size:22px;font-weight:800;">' + esc(g.title) + '</div></div>';
  html += '<div class="card"><div class="field"><label class="field-label">Очки (0-100)</label><input type="number" id="bg-score" value="50" min="0" max="100"/></div>';
  html += '<button class="btn btn-primary btn-block mt-3" onclick="finishBrainGame()">✓ Записать</button></div>';
  openSheet(g.title, html);
}
function finishBrainGame(){
  if(!currentBrainGameId) return;
  var score = parseInt((document.getElementById('bg-score')||{}).value) || 0;
  var g = (window.BRAIN_TRAINING||[]).find(function(x){ return x.id === currentBrainGameId; });
  if(!state.brainPlays) state.brainPlays = [];
  state.brainPlays.push({id:uid(), gameId:currentBrainGameId, date:today(), score:score, duration:g?g.duration:60, timestamp:nowISO()});
  if(!state.brainStats) state.brainStats = {};
  if(!state.brainStats[currentBrainGameId]) state.brainStats[currentBrainGameId] = {plays:0, best:0, total:0, avg:0};
  var s = state.brainStats[currentBrainGameId];
  s.plays++;
  s.total += score;
  s.avg = Math.round(s.total/s.plays);
  if(score > s.best) s.best = score;
  s.lastPlayed = nowISO();
  var t = today();
  if(state.brainLastDay !== t){
    if(state.brainLastDay === yesterday()) state.brainStreak = (state.brainStreak||0) + 1;
    else state.brainStreak = 1;
    state.brainLastDay = t;
  }
  addXP(10, 'brain');
  addPetXP(3);
  save();
  haptic('success');
  toast('✓ +10 XP','success');
  closeSheet();
  currentBrainGameId = null;
  renderBrain();
}

/* ============ ИГРЫ (8 игр из Mini Games Collection) ============ */
var GAMES_LIBRARY = [
 {id:'memory',emoji:'🧠',title:'Пары',desc:'Найди 6 пар одинаковых карточек',duration:90},
 {id:'puzzle15',emoji:'🧩',title:'Пятнашки 3×3',desc:'Собери числа по порядку',duration:120},
 {id:'sequences',emoji:'🔢',title:'Последовательность',desc:'Запомни и повтори цифры',duration:60},
 {id:'grids',emoji:'▦',title:'Сетка памяти',desc:'Повтори узор на поле',duration:60},
 {id:'reaction',emoji:'⚡',title:'Реакция',desc:'Нажми после сигнала',duration:30},
 {id:'math',emoji:'➗',title:'Счёт в уме',desc:'Реши 5 коротких примеров',duration:60},
 {id:'typing',emoji:'⌨️',title:'Точность ввода',desc:'Набери фразу без ошибок',duration:45},
 {id:'target',emoji:'🎯',title:'Быстрые нажатия',desc:'Нажми на цель за 15 секунд',duration:15}
];
function renderGamesHub(){
  var scores = (state.games && state.games.scores) || {};
  var totalPlays = (state.games && state.games.stats && state.games.stats.totalPlays) || 0;
  var html = '<div class="page"><div class="title-xl">🎮 Игры</div>';
  html += '<div class="card card-gradient"><div style="font-size:12px;opacity:.9;">Сыграно</div><div style="font-size:40px;font-weight:800;">' + totalPlays + '</div></div>';
  html += '<div class="compact-grid">';
  GAMES_LIBRARY.forEach(function(g){
    var s = scores[g.id] || {};
    html += '<div class="compact-item" onclick="startGame(\'' + g.id + '\')"><span class="compact-icon">' + g.emoji + '</span><span>' + g.title + (s.best ? ' <span class="footnote text-tertiary">' + s.best + '</span>' : '') + '</span></div>';
  });
  html += '</div></div>';
  document.getElementById('app').innerHTML = html;
}
var __miniGame=null;
function startGame(gameId){
 var g=GAMES_LIBRARY.find(function(x){return x.id===gameId;});if(!g)return;
 if(window.__miniGameTimer){clearTimeout(window.__miniGameTimer);clearInterval(window.__miniGameTimer);window.__miniGameTimer=null;}
 var game={id:gameId,startedAt:Date.now(),moves:0,score:0,phase:'ready'};
 if(gameId==='memory'){var symbols=['🍎','🚀','🌙','🐬','🎸','🌻'];game.cards=symbols.concat(symbols).sort(function(){return Math.random()-.5;});game.open=[];game.matched=[];}
 if(gameId==='puzzle15'){game.tiles=[1,2,3,4,5,6,7,8,0];var blank=8,prev=-1;for(var k=0;k<120;k++){var ns=[];[blank-3,blank+3,blank-1,blank+1].forEach(function(n){if(n>=0&&n<9&&Math.abs(Math.floor(n/3)-Math.floor(blank/3))+Math.abs(n%3-blank%3)===1&&n!==prev)ns.push(n);});var n=ns[Math.floor(Math.random()*ns.length)];if(n==null)continue;game.tiles[blank]=game.tiles[n];game.tiles[n]=0;prev=blank;blank=n;}}
 if(gameId==='sequences'){game.sequence=Array.from({length:5},function(){return Math.floor(Math.random()*9)+1;});game.answer=[];}
 if(gameId==='grids'){game.target=[];while(game.target.length<4){var n=Math.floor(Math.random()*9);if(game.target.indexOf(n)<0)game.target.push(n);}game.selected=[];game.phase='show';}
 if(gameId==='reaction'){game.phase='waiting';}
 if(gameId==='math'){game.round=0;game.correct=0;game.problem=makeMiniMathProblem();}
 if(gameId==='typing'){var phrases=['Сначала главное, потом остальное','Маленькие шаги создают устойчивый прогресс','Сосредоточься на одном действии'];game.phrase=phrases[Math.floor(Math.random()*phrases.length)];}
 if(gameId==='target'){game.timeLeft=15;game.hits=0;game.phase='playing';}
 __miniGame=game;
 openSheet(g.title,'<div id="miniGameBody"></div>');
 renderMiniGame();
 if(gameId==='grids'){window.__miniGameTimer=setTimeout(function(){if(__miniGame&&__miniGame.id==='grids'&&__miniGame.phase==='show'){__miniGame.phase='input';renderMiniGame();}},2200);}
 if(gameId==='reaction'){var delay=1600+Math.floor(Math.random()*3000);window.__miniGameTimer=setTimeout(function(){if(__miniGame&&__miniGame.id==='reaction'&&__miniGame.phase==='waiting'){__miniGame.phase='go';__miniGame.goAt=Date.now();renderMiniGame();}},delay);}
 if(gameId==='target'){window.__miniGameTimer=setInterval(function(){if(!__miniGame||__miniGame.id!=='target')return;__miniGame.timeLeft--;var el=document.getElementById('miniGameTimer');if(el)el.textContent=__miniGame.timeLeft;if(__miniGame.timeLeft<=0){clearInterval(window.__miniGameTimer);window.__miniGameTimer=null;finishMiniGame(__miniGame.hits*10);}},1000);}
}
function renderMiniGame(){
 var g=__miniGame,el=document.getElementById('miniGameBody');if(!g||!el)return;
 var html='<div class="footnote mb-2">Игра идёт по реальным действиям. Результат сохранится после завершения.</div>';
 if(g.id==='memory'){
  html+='<div class="row-between"><b>Совпадения: '+g.matched.length/2+' / 6</b><span>Ходы: '+g.moves+'</span></div><div class="grid-2 mt-2" style="grid-template-columns:repeat(4,minmax(0,1fr));gap:8px">';
  g.cards.forEach(function(c,i){var visible=g.open.indexOf(i)>=0||g.matched.indexOf(i)>=0;html+='<button class="btn '+(g.matched.indexOf(i)>=0?'btn-primary':'btn-ghost')+'" style="min-height:64px;font-size:26px" '+(visible?'disabled':'')+' onclick="miniGameFlip('+i+')">'+(visible?c:'❔')+'</button>';});
  html+='</div>';
 }else if(g.id==='puzzle15'){
  html+='<div class="footnote">Нажимай на плитку рядом с пустой клеткой. Ходы: '+g.moves+'</div><div class="grid-2 mt-2" style="grid-template-columns:repeat(3,minmax(0,1fr));gap:7px">';
  g.tiles.forEach(function(n,i){html+='<button class="btn '+(n?'btn-ghost':'')+'" style="min-height:68px;font-size:22px" '+(!n?'disabled':'')+' onclick="miniGamePuzzleMove('+i+')">'+(n||'')+'</button>';});html+='</div>';
 }else if(g.id==='sequences'){
  html+='<div class="card"><div class="footnote">Запомни последовательность и повтори её кнопками.</div><div class="stat-value">'+(g.phase==='show'?g.sequence.join(' · '):g.answer.map(function(n){return n;}).join(' · ')||'—')+'</div><div class="row wrap mt-2" style="gap:6px">';
  for(var n=1;n<=9;n++)html+='<button class="btn btn-ghost" onclick="miniGameSequenceAdd('+n+')">'+n+'</button>';
  html+='</div><button class="btn btn-primary btn-block mt-2" onclick="miniGameSequenceCheck()">Проверить</button><button class="btn btn-ghost btn-block" onclick="miniGameSequenceReset()">Сбросить ответ</button></div>';
 }else if(g.id==='grids'){
  html+='<div class="footnote">'+(g.phase==='show'?'Запомни подсвеченные клетки…':'Повтори узор. Выбрано: '+g.selected.length+'/4')+'</div><div class="grid-2 mt-2" style="grid-template-columns:repeat(3,minmax(0,1fr));gap:7px">';
  for(var i=0;i<9;i++){var on=g.phase==='show'?g.target.indexOf(i)>=0:g.selected.indexOf(i)>=0;html+='<button class="btn '+(on?'btn-primary':'btn-ghost')+'" style="min-height:64px" '+(g.phase==='show'?'disabled':'')+' onclick="miniGameGridToggle('+i+')">'+(on?'●':'')+'</button>';}
  html+='</div><button class="btn btn-primary btn-block mt-2" '+(g.phase==='show'?'disabled':'')+' onclick="miniGameGridCheck()">Проверить узор</button>';
 }else if(g.id==='reaction'){
  html+='<div class="card" style="text-align:center"><div class="stat-value">'+(g.phase==='waiting'?'Подожди…':g.phase==='go'?'ЖМИ!':'Готов')+'</div><p class="footnote">Не нажимай до появления зелёного сигнала.</p><button class="btn '+(g.phase==='go'?'btn-primary':'btn-ghost')+' btn-block" style="min-height:70px" onclick="miniGameReactionClick()">'+(g.phase==='go'?'НАЖАТЬ':'ЖДИ')+'</button></div>';
 }else if(g.id==='math'){
  html+='<div class="card"><div class="footnote">Раунд '+(g.round+1)+' / 5 · верно: '+g.correct+'</div><div class="stat-value">'+g.problem.q+'</div><div class="grid-2 mt-2">';
  g.problem.options.forEach(function(n){html+='<button class="btn btn-ghost" onclick="miniGameMathAnswer('+n+')">'+n+'</button>';});html+='</div></div>';
 }else if(g.id==='typing'){
  html+='<div class="card"><div class="footnote">Набери фразу точно:</div><b>'+esc(g.phrase)+'</b><textarea id="miniGameTyping" rows="3" class="mt-2" placeholder="Начни печатать…"></textarea><button class="btn btn-primary btn-block mt-2" onclick="miniGameTypingCheck()">Проверить</button></div>';
 }else if(g.id==='target'){
  html+='<div class="row-between"><b>Время: <span id="miniGameTimer">'+g.timeLeft+'</span> сек</b><b>Попадания: '+g.hits+'</b></div><button class="btn btn-primary btn-block mt-3" style="min-height:120px;font-size:42px" onclick="miniGameTargetHit()">🎯</button>';
 }
 el.innerHTML=html;
}
function makeMiniMathProblem(){
 var a=Math.floor(Math.random()*12)+3,b=Math.floor(Math.random()*9)+2,op=Math.random()<.5?'+':'−',answer=op==='+'?a+b:a-b,opts=[answer,answer+2,answer-1,answer+4].sort(function(){return Math.random()-.5;});return {q:a+' '+op+' '+b+' = ?',answer:answer,options:opts};
}
function miniGameFlip(i){
 var g=__miniGame;if(!g||g.id!=='memory'||g.open.length>=2||g.open.indexOf(i)>=0||g.matched.indexOf(i)>=0)return;
 g.open.push(i);if(g.open.length===2){g.moves++;var x=g.open[0],y=g.open[1];if(g.cards[x]===g.cards[y]){g.matched.push(x,y);g.open=[];if(g.matched.length===g.cards.length)finishMiniGame(Math.max(20,120-g.moves*5));}else{renderMiniGame();window.__miniGameTimer=setTimeout(function(){if(__miniGame&&__miniGame.id==='memory'){__miniGame.open=[];renderMiniGame();}},750);return;}}
 renderMiniGame();
}
function miniGamePuzzleMove(i){
 var g=__miniGame;if(!g||g.id!=='puzzle15')return;var z=g.tiles.indexOf(0),dist=Math.abs(Math.floor(i/3)-Math.floor(z/3))+Math.abs(i%3-z%3);if(dist!==1)return;
 g.tiles[z]=g.tiles[i];g.tiles[i]=0;g.moves++;renderMiniGame();if(g.tiles.join(',')==='1,2,3,4,5,6,7,8,0')finishMiniGame(Math.max(10,300-g.moves*3));
}
function miniGameSequenceAdd(n){var g=__miniGame;if(!g||g.id!=='sequences'||g.answer.length>=g.sequence.length)return;g.answer.push(n);renderMiniGame();}
function miniGameSequenceCheck(){var g=__miniGame;if(!g||g.id!=='sequences')return;var ok=g.answer.join('')===g.sequence.join('');if(ok)finishMiniGame(100);else{toast('Последовательность не совпала. Попробуй ещё раз.','warning');g.answer=[];renderMiniGame();}}
function miniGameSequenceReset(){if(__miniGame&&__miniGame.id==='sequences'){__miniGame.answer=[];renderMiniGame();}}
function miniGameGridToggle(i){var g=__miniGame;if(!g||g.id!=='grids'||g.phase!=='input')return;var n=g.selected.indexOf(i);if(n>=0)g.selected.splice(n,1);else if(g.selected.length<4)g.selected.push(i);renderMiniGame();}
function miniGameGridCheck(){var g=__miniGame;if(!g||g.id!=='grids')return;var a=g.target.slice().sort().join(','),b=g.selected.slice().sort().join(',');if(a===b)finishMiniGame(100);else{toast('Узор не совпал. Попробуй ещё раз.','warning');g.selected=[];renderMiniGame();}}
function miniGameReactionClick(){
 var g=__miniGame;if(!g||g.id!=='reaction')return;
 if(g.phase==='waiting'){if(window.__miniGameTimer)clearTimeout(window.__miniGameTimer);window.__miniGameTimer=null;g.phase='false';renderMiniGame();return;}
 if(g.phase==='go'){var ms=Date.now()-g.goAt;finishMiniGame(Math.max(1,Math.round(1000/ms*100)));return;}
 if(g.phase==='false'){toast('Фальстарт. Начни заново.','warning');startGame('reaction');}
}
function miniGameMathAnswer(n){var g=__miniGame;if(!g||g.id!=='math')return;if(n===g.problem.answer)g.correct++;g.round++;if(g.round>=5)finishMiniGame(g.correct*20);else{g.problem=makeMiniMathProblem();renderMiniGame();}}
function miniGameTypingCheck(){var g=__miniGame;if(!g||g.id!=='typing')return;var value=(document.getElementById('miniGameTyping')||{}).value||'';var score=Math.round(value.split('').filter(function(c,i){return c===g.phrase[i];}).length/Math.max(1,g.phrase.length)*100);if(value.trim()!==g.phrase){toast('Есть ошибки или пропуски. Исправь текст и проверь ещё раз.','warning');return;}finishMiniGame(score);}
function miniGameTargetHit(){var g=__miniGame;if(!g||g.id!=='target'||g.timeLeft<=0)return;g.hits++;var el=document.querySelector('#miniGameBody .row-between b:last-child');if(el)el.textContent='Попадания: '+g.hits;}
function finishMiniGame(score){
 var g=__miniGame;if(!g)return;if(window.__miniGameTimer){clearTimeout(window.__miniGameTimer);clearInterval(window.__miniGameTimer);window.__miniGameTimer=null;}
 var id=g.id;__miniGame=null;saveGameScore(id,Math.max(0,Math.round(Number(score)||0)));
}
function saveGameScore(gameId,score){
 if(score===undefined)score=0;score=Math.max(0,Math.min(1000,parseInt(score,10)||0));
 if(!state.games)state.games={scores:{},records:{},stats:{totalPlays:0,totalTime:0,avgScore:0,favoriteGame:null},achievements:[]};
 if(!state.games.scores)state.games.scores={};if(!state.games.scores[gameId])state.games.scores[gameId]={best:0,plays:0,totalTime:0};
 var x=state.games.scores[gameId];x.plays=(x.plays||0)+1;if(score>x.best){x.best=score;if(!state.games.records)state.games.records={};state.games.records[gameId]={date:today(),score:score};}
 state.games.stats=state.games.stats||{totalPlays:0,totalTime:0,avgScore:0,favoriteGame:null};state.games.stats.totalPlays=(state.games.stats.totalPlays||0)+1;
 var scores=Object.keys(state.games.scores).map(function(k){return state.games.scores[k];}),total=scores.reduce(function(n,z){return n+(Number(z.totalScore)||Number(z.best)||0);},0),plays=scores.reduce(function(n,z){return n+(Number(z.plays)||0);},0);state.games.stats.avgScore=plays?Math.round(total/plays):0;
 addXP(5,'game');addPetXP(2);save();haptic('success');closeSheet();renderGamesHub();toast('Игра завершена · '+score+' очков','success');
}

/* ============ ЛИГИ ============ */
function renderLeagues(){
  var l = state.leagues || defaultState().leagues;
  var tier = (window.LEAGUE_TIERS||[]).find(function(t){ return t.id === l.current; }) || {emoji:'🥉',name:'Бронза',color:'#cd7f32',weeklyGoal:100,reward:50};
  var weeklyXp = l.weeklyXp || 0;
  var pct = Math.min(100, Math.round(weeklyXp/tier.weeklyGoal*100));
  var html = '<div class="page"><div class="title-xl">🏅 Лиги</div>';
  html += '<div class="card card-gradient">';
  html += '<div style="font-size:56px;text-align:center;">' + tier.emoji + '</div>';
  html += '<div style="font-size:22px;font-weight:800;text-align:center;margin-top:8px;">' + tier.name + '</div>';
  html += '<div style="font-size:12px;opacity:.9;text-align:center;">Неделя: ' + weeklyXp + ' / ' + tier.weeklyGoal + ' XP</div>';
  html += '<div class="progress mt-3"><div class="progress-fill" style="width:' + pct + '%"></div></div>';
  html += '</div>';
  html += '<div class="card"><h2>Все тиры</h2>';
  (window.LEAGUE_TIERS||[]).forEach(function(t){
    var active = t.id === l.current;
    html += '<div class="list-row" style="' + (active?'border-left:3px solid ' + t.color + ';':'') + '">';
    html += '<div class="list-icon">' + t.emoji + '</div>';
    html += '<div class="list-body"><div class="list-title">' + t.name + '</div>';
    html += '<div class="list-subtitle">Цель: ' + t.weeklyGoal + ' XP · Награда: ' + t.reward + ' XP</div></div>';
    if(active) html += '<div class="badge badge-success">Текущая</div>';
    html += '</div>';
  });
  html += '</div></div>';
  document.getElementById('app').innerHTML = html;
}

/* ============ ПИТОМЕЦ ============ */
function getPetLiveState(){var p=state.pet||defaultState().pet,elapsed=p.lastFed?Math.max(0,(Date.now()-new Date(p.lastFed).getTime())/3600000):0;return {hunger:Math.max(0,Math.min(100,Math.round((Number(p.hunger)||100)-elapsed*3))),hours:Math.floor(elapsed)};}
function renderPet(){
 var pet=state.pet||defaultState().pet,live=getPetLiveState(),stage=(window.PET_STAGES||[]).find(function(x){return x.id===pet.stage;})||{emoji:'🥚',name:'Яйцо',desc:'Развитие'},xpNext=Number(pet.xpToNext)||100,pct=Math.min(100,Math.round((Number(pet.xp)||0)/xpNext*100)),fedToday=(pet.feedHistory||[]).filter(function(x){return x.date===today();}).length;
 var mood=live.hunger<20?'hungry':live.hunger>70?'happy':'normal',html='<div class="page"><div class="title-xl">🐾 Питомец</div><div class="subtitle">Развитие связано с твоей активностью в LIFE OS. Забота о питомце — игровая мотивация, не обязанность.</div><div class="card card-gradient" style="text-align:center"><div style="font-size:96px">'+stage.emoji+'</div><div class="field"><input id="petNameInput" maxlength="24" value="'+esc(pet.name||'Питомец')+'" aria-label="Имя питомца" onchange="renamePet(this.value)" style="text-align:center;font-weight:800"></div><div class="title-lg">'+esc(stage.name)+'</div><div class="footnote">Стадия '+pet.stage+' · '+esc(stage.desc||'')+'</div><div class="progress mt-3"><div class="progress-fill" style="width:'+pct+'%"></div></div><div class="footnote mt-2">'+(pet.xp||0)+' / '+xpNext+' XP до следующей стадии</div></div><div class="card"><h2>Состояние</h2><div class="row-between"><span>🍽 Сытость</span><b>'+live.hunger+'%</b></div><div class="progress mt-2"><div class="progress-fill" style="width:'+live.hunger+'%"></div></div><div class="row-between mt-3"><span>Настроение</span><b>'+(mood==='happy'?'😊 Доволен':mood==='hungry'?'🍽 Голоден':'😐 Спокоен')+'</b></div><div class="row-between mt-2"><span>Покормлен сегодня</span><b>'+fedToday+' раз</b></div><div class="row-between mt-2"><span>Всего кормлений</span><b>'+(pet.fedCount||0)+'</b></div></div><div class="grid-2"><button class="btn btn-primary" onclick="feedPet()">🍽 Покормить</button><button class="btn btn-ghost" onclick="playPet()">🎾 Поиграть</button></div><div class="card mt-3"><b>Как питомец развивается</b><p class="footnote mt-2">XP начисляется за реальные действия в приложении. Сытость постепенно снижается со временем и восстанавливается кормлением. Не нужно заходить каждый час — это только игровой элемент.</p></div></div>';document.getElementById('app').innerHTML=html;
}
function renamePet(name){if(!state.pet)state.pet=defaultState().pet;state.pet.name=String(name||'Питомец').trim().slice(0,24)||'Питомец';save();toast('Имя питомца сохранено','success');}
function feedPet(){
 if(!state.pet)state.pet=defaultState().pet;
 if(!Array.isArray(state.pet.feedHistory))state.pet.feedHistory=[];
 var fedToday=state.pet.feedHistory.filter(function(x){return x.date===today();}).length;
 if(fedToday>=3){toast('На сегодня питомец уже получил достаточно корма.','info');return;}
 var before=getPetLiveState().hunger,after=Math.min(100,before+20);
 if(after<=before){toast('Питомец сыт — дополнительный корм не нужен.','info');return;}
 state.pet.hunger=after;state.pet.fedCount=(state.pet.fedCount||0)+1;state.pet.lastFed=nowISO();
 state.pet.feedHistory.push({date:today(),at:nowISO()});state.pet.feedHistory=state.pet.feedHistory.slice(-100);
 state.pet.mood=after>=50?'happy':'hungry';addPetXP(5);save();haptic('success');toast('🍽 Питомец покормлен · +5 XP','success');renderPet();
}
function playPet(){
 if(!state.pet)state.pet=defaultState().pet;
 if(!Array.isArray(state.pet.playHistory))state.pet.playHistory=[];
 if(state.pet.playHistory.some(function(x){return x.date===today();})){toast('Сегодня вы уже играли. Питомцу нужен отдых.','info');return;}
 state.pet.playHistory.push({date:today(),at:nowISO()});state.pet.playHistory=state.pet.playHistory.slice(-120);
 state.pet.mood='happy';addPetXP(3);save();haptic('success');toast('🎾 Отлично поиграли · +3 XP','success');renderPet();
}
function addPetXP(amount){
  if(!state.pet) state.pet = defaultState().pet;
  if(!state.pet.enabled) return;
  state.pet.xp = (state.pet.xp||0) + (amount||0);
  /* Проверка стадии */
  var stages = window.PET_STAGES || [];
  var newStage = 1;
  for(var i = 0; i < stages.length; i++){
    if(state.pet.xp >= stages[i].minXP) newStage = stages[i].id;
  }
  if(newStage > (state.pet.stage||1)){
    state.pet.stage = newStage;
    state.pet.evolvedAt = nowISO();
    toast('🎉 Питомец эволюционировал!','success',3500);
    haptic('success');
  }
  /* Следующий порог */
  var currentStage = stages.find(function(s){ return s.id === state.pet.stage; });
  if(currentStage) state.pet.xpToNext = currentStage.maxXP || 99999;
}

/* ============ ДЕТОКС ХАБ ============ */
function renderDetoxHub(){
  var d = state.detox || defaultState().detox;
  var html = '<div class="page"><div class="title-xl">🧘 Детокс</div>';
  html += '<div class="card"><h2>❄️ Период охлаждения</h2>';
  html += '<div class="footnote text-secondary mb-3">После закрытия приложения нельзя открыть 5-10 минут.</div>';
  html += '<button class="btn btn-primary btn-block" onclick="startCooldown()">Запустить кулдаун</button></div>';
  html += '<div class="card"><h2>😴 Режим сна</h2>';
  html += '<div class="footnote text-secondary mb-3">С 22:00 до 7:00 приложение в спящем режиме.</div>';
  html += '<button class="btn ' + (d.sleepMode && d.sleepMode.enabled ? 'btn-success' : 'btn-ghost') + ' btn-block" onclick="toggleSleepMode()">' + (d.sleepMode && d.sleepMode.enabled ? '✓ Включён' : 'Включить') + '</button></div>';
  html += '<div class="card"><h2>📊 Статистика</h2>';
  html += '<div class="stat-grid">';
  html += '<div class="stat-item"><div class="stat-value">' + (d.stats && d.stats.cooldownCount || 0) + '</div><div class="stat-label">Кулдаунов</div></div>';
  html += '<div class="stat-item"><div class="stat-value">' + (d.stats && d.stats.pauseCount || 0) + '</div><div class="stat-label">Пауз</div></div>';
  html += '<div class="stat-item"><div class="stat-value">' + (d.stats && d.stats.screenMinutes || 0) + 'м</div><div class="stat-label">Экран</div></div>';
  html += '</div></div>';
  html += '<button class="btn btn-ghost btn-block" onclick="navigate(\'detox60\')">🧹 60-дневное очищение</button>';
  html += '</div>';
  document.getElementById('app').innerHTML = html;
}
function startCooldown(){
  if(!state.detox) state.detox = defaultState().detox;
  if(!state.detox.stats) state.detox.stats = {cooldownCount:0, pauseCount:0, sleepHours:0, screenMinutes:0, byApp:{}};
  state.detox.cooldown = {active:true, until:new Date(Date.now()+10*60*1000).toISOString(), minutes:10, trigger:'manual'};
  state.detox.stats.cooldownCount++;
  save();
  toast('❄️ Кулдаун 10 минут запущен','warning');
}
function toggleSleepMode(){
  if(!state.detox) state.detox = defaultState().detox;
  if(!state.detox.sleepMode) state.detox.sleepMode = {enabled:false, start:'22:00', end:'07:00', active:false};
  state.detox.sleepMode.enabled = !state.detox.sleepMode.enabled;
  save();
  toast(state.detox.sleepMode.enabled ? '✓ Режим сна включён' : 'Режим сна выключен','success');
  renderDetoxHub();
}

/* ============ 60-ДНЕВНОЕ ОЧИЩЕНИЕ ============ */
var DETOX60_ITEMS = {
  1:[{type:'physical', emoji:'👕', text:'Выброси 1 ненужную вещь из шкафа'},{type:'routine', emoji:'📱', text:'Убери 1 приложение с главного экрана'}],
  2:[{type:'physical', emoji:'📦', text:'Разбери 1 ящик/полку'},{type:'routine', emoji:'⏰', text:'Убери 1 подписку на email'}],
  3:[{type:'physical', emoji:'📄', text:'Выброси 1 стопку бумаг'},{type:'routine', emoji:'🔔', text:'Отключи 1 ненужное уведомление'}],
  4:[{type:'physical', emoji:'☕', text:'Выброси 1 сломанную чашку/вещь'},{type:'routine', emoji:'📅', text:'Убери 1 повторяющуюся встречу'}],
  5:[{type:'physical', emoji:'👟', text:'Выброси 1 пару обуви, которую не носишь'},{type:'routine', emoji:'📧', text:'Отпишись от 1 рассылки'}],
  6:[{type:'physical', emoji:'🧴', text:'Выброси 1 просроченную косметику'},{type:'routine', emoji:'📱', text:'Удали 1 приложение, которым не пользуешься'}],
  7:[{type:'physical', emoji:'📚', text:'Отдай/продай 1 книгу'},{type:'routine', emoji:'🍽', text:'Убери 1 привычку-пожиратель времени'}],
  8:[{type:'physical', emoji:'🔌', text:'Выброси 1 сломанный провод/зарядку'},{type:'routine', emoji:'💬', text:'Выйди из 1 ненужного чата'}],
  9:[{type:'physical', emoji:'🧸', text:'Отдай 1 игрушку/сувенир'},{type:'routine', emoji:'📺', text:'Убери 1 канал из подписок'}],
  10:[{type:'physical', emoji:'👔', text:'Выброси 1 вещь, которую не носил год'},{type:'routine', emoji:'🎮', text:'Удали 1 игру, в которую не играешь'}],
  11:[{type:'physical', emoji:'🍽', text:'Выброси 1 лишнюю посуду'},{type:'routine', emoji:'🛒', text:'Отпишись от 1 магазина'}],
  12:[{type:'physical', emoji:'💊', text:'Выброси 1 просроченное лекарство'},{type:'routine', emoji:'📰', text:'Убери 1 источник новостей'}],
  13:[{type:'physical', emoji:'🖼', text:'Убери 1 вещь с видного места'},{type:'routine', emoji:'📞', text:'Убери 1 нежелательный контакт'}],
  14:[{type:'physical', emoji:'📦', text:'Разбери 1 полку в холодильнике'},{type:'routine', emoji:'💳', text:'Отмени 1 ненужную подписку'}],
  15:[{type:'physical', emoji:'🧦', text:'Выброси 1 пару носков без пары'},{type:'routine', emoji:'📊', text:'Убери 1 приложение-трекер'}],
  16:[{type:'physical', emoji:'🪥', text:'Замени старую зубную щётку'},{type:'routine', emoji:'🎵', text:'Убери 1 плейлист/подкаст из очереди'}],
  17:[{type:'physical', emoji:'🍶', text:'Выброси 1 пустую бутылку/банку'},{type:'routine', emoji:'📱', text:'Отключи 1 автозапуск'}],
  18:[{type:'physical', emoji:'👝', text:'Разбери 1 сумку/рюкзак'},{type:'routine', emoji:'⏱', text:'Убери 1 ежедневное напоминание'}],
  19:[{type:'physical', emoji:'🕯', text:'Выброси 1 вещь, которая «на память»'},{type:'routine', emoji:'📧', text:'Удали 100 старых писем'}],
  20:[{type:'physical', emoji:'🧴', text:'Выброси 1 пустой флакон'},{type:'routine', emoji:'📁', text:'Удали 10 старых файлов'}],
  21:[{type:'physical', emoji:'🖥', text:'Убери 1 вещь с рабочего стола'},{type:'routine', emoji:'📸', text:'Удали 100 старых фото'}],
  22:[{type:'physical', emoji:'🎒', text:'Выброси 1 старый рюкзак/сумку'},{type:'routine', emoji:'📝', text:'Удали 5 старых заметок'}],
  23:[{type:'physical', emoji:'👖', text:'Выброси 1 вещь из «похудею»'},{type:'routine', emoji:'📞', text:'Удали 10 старых контактов'}],
  24:[{type:'physical', emoji:'🧹', text:'Выброси 1 сломанную вещь для уборки'},{type:'routine', emoji:'🎬', text:'Удали 10 сериалов из очереди'}],
  25:[{type:'physical', emoji:'💡', text:'Замени 1 перегоревшую лампочку'},{type:'routine', emoji:'📚', text:'Удали 10 книг из «прочитать»'}],
  26:[{type:'physical', emoji:'🚿', text:'Выброси 1 старую мочалку'},{type:'routine', emoji:'🎁', text:'Убери 1 «когда-нибудь» из планов'}],
  27:[{type:'physical', emoji:'🪑', text:'Найди 1 вещь, которую не использовал год'},{type:'routine', emoji:'💼', text:'Убери 1 дело из бэклога'}],
  28:[{type:'physical', emoji:'🧊', text:'Выброси 1 форму для льда, которой не пользуешься'},{type:'routine', emoji:'📋', text:'Убери 1 задачу-«зомби»'}],
  29:[{type:'physical', emoji:'🍴', text:'Выброси 1 лишний столовый прибор'},{type:'routine', emoji:'⏰', text:'Убери 1 будильник'}],
  30:[{type:'physical', emoji:'🎉', text:'Месяц! Выброси 3 вещи разом'},{type:'routine', emoji:'🎉', text:'Убери 3 рутины разом'}],
  31:[{type:'physical', emoji:'🌱', text:'Выброси 1 засохшее растение'},{type:'routine', emoji:'🧘', text:'Убери 1 «обязательный» ритуал'}],
  32:[{type:'physical', emoji:'📐', text:'Выброси 1 инструмент, которым не пользуешься'},{type:'routine', emoji:'🚶', text:'Убери 1 «надо» из расписания'}],
  33:[{type:'physical', emoji:'🧴', text:'Выброси 1 шампунь, который не нравится'},{type:'routine', emoji:'💬', text:'Убери 1 групповой чат'}],
  34:[{type:'physical', emoji:'🎨', text:'Выброси 1 недоделанный проект'},{type:'routine', emoji:'📱', text:'Отключи 1 соцсеть на день'}],
  35:[{type:'physical', emoji:'🧸', text:'Выброси 1 детскую игрушку'},{type:'routine', emoji:'🍔', text:'Убери 1 вредную привычку еды'}],
  36:[{type:'physical', emoji:'👞', text:'Выброси 1 обувь, которая жмёт'},{type:'routine', emoji:'🛌', text:'Убери 1 «полежать в телефоне»'}],
  37:[{type:'physical', emoji:'📺', text:'Выброси 1 старый пульт'},{type:'routine', emoji:'🎮', text:'Убери 1 игру на телефоне'}],
  38:[{type:'physical', emoji:'🪞', text:'Выброси 1 разбитое зеркало/рамку'},{type:'routine', emoji:'📧', text:'Убери 1 рабочий чат из личного'}],
  39:[{type:'physical', emoji:'🧴', text:'Выброси 1 крем, который не подошёл'},{type:'routine', emoji:'🎵', text:'Убери 1 «фоновую» музыку'}],
  40:[{type:'physical', emoji:'🍶', text:'Выброси 1 банку/склянку'},{type:'routine', emoji:'📰', text:'Убери 1 новостной канал'}],
  41:[{type:'physical', emoji:'🧺', text:'Разбери 1 корзину для белья'},{type:'routine', emoji:'💳', text:'Убери 1 карту из кошелька'}],
  42:[{type:'physical', emoji:'🔑', text:'Выброси 1 ключ без пары'},{type:'routine', emoji:'📱', text:'Убери 1 виджет с экрана'}],
  43:[{type:'physical', emoji:'🎒', text:'Выброси 1 старый чехол'},{type:'routine', emoji:'⏱', text:'Убери 1 «проверить телефон»'}],
  44:[{type:'physical', emoji:'🧴', text:'Выброси 1 лекарство без срока'},{type:'routine', emoji:'🍽', text:'Убери 1 перекус'}],
  45:[{type:'physical', emoji:'📦', text:'Разбери 1 кладовку'},{type:'routine', emoji:'📺', text:'Убери 1 «фоном телевизор»'}],
  46:[{type:'physical', emoji:'🧥', text:'Выброси 1 вещь не по сезону'},{type:'routine', emoji:'💤', text:'Убери 1 «досмотрю до конца»'}],
  47:[{type:'physical', emoji:'🪥', text:'Выброси 1 старую расчёску'},{type:'routine', emoji:'📞', text:'Убери 1 «перезвоню»'}],
  48:[{type:'physical', emoji:'🧸', text:'Выброси 1 «может пригодится»'},{type:'routine', emoji:'🎁', text:'Убери 1 «куплю потом»'}],
  49:[{type:'physical', emoji:'📚', text:'Выброси 1 журнал/газету'},{type:'routine', emoji:'📝', text:'Убери 1 «надо записать»'}],
  50:[{type:'physical', emoji:'🎨', text:'Выброси 1 недоделанную поделку'},{type:'routine', emoji:'🚶', text:'Убери 1 «схожу завтра»'}],
  51:[{type:'physical', emoji:'🍴', text:'Выброси 1 треснувшую тарелку'},{type:'routine', emoji:'💬', text:'Убери 1 «надо ответить»'}],
  52:[{type:'physical', emoji:'👕', text:'Выброси 1 футболку с дыркой'},{type:'routine', emoji:'⏰', text:'Убери 1 «встану пораньше»'}],
  53:[{type:'physical', emoji:'🧴', text:'Выброси 1 пустой тюбик'},{type:'routine', emoji:'📱', text:'Убери 1 «гляну мельком»'}],
  54:[{type:'physical', emoji:'🖥', text:'Выброси 1 старый диск/флешку'},{type:'routine', emoji:'🍽', text:'Убери 1 «доедаю»'}],
  55:[{type:'physical', emoji:'🧺', text:'Выброси 1 полотенце с дыркой'},{type:'routine', emoji:'💤', text:'Убери 1 «ещё 5 минут»'}],
  56:[{type:'physical', emoji:'🎮', text:'Выброси 1 диск/картридж'},{type:'routine', emoji:'📞', text:'Убери 1 «потом»'}],
  57:[{type:'physical', emoji:'🧸', text:'Выброси 1 сломанную игрушку'},{type:'routine', emoji:'🎁', text:'Убери 1 «когда-нибудь»'}],
  58:[{type:'physical', emoji:'👞', text:'Выброси 1 обувь, которую не носишь'},{type:'routine', emoji:'📝', text:'Убери 1 «начать с понедельника»'}],
  59:[{type:'physical', emoji:'📦', text:'Разбери 1 последний ящик'},{type:'routine', emoji:'🚶', text:'Убери 1 «завтра точно»'}],
  60:[{type:'physical', emoji:'🏆', text:'Финал! Освободи 1 м²'},{type:'routine', emoji:'🏆', text:'Финал! Убери 1 привычку навсегда'}]
};
function renderDetox60(){
  if(!state.detox60Progress) state.detox60Progress = {};
  var done = Object.keys(state.detox60Progress).length;
  var pct = Math.round(done/120*100);
  var html = '<div class="page"><div class="title-xl">🧹 60-дневное очищение</div>';
  html += '<div class="card card-gradient"><div style="font-size:12px;opacity:.9;">Очищено</div>';
  html += '<div style="font-size:40px;font-weight:800;">' + done + ' / 120</div>';
  html += '<div style="font-size:12px;opacity:.9;margin-top:6px;">' + pct + '% · 2 вещи/рутины в день</div>';
  html += '<div class="progress mt-3"><div class="progress-fill" style="width:' + pct + '%"></div></div></div>';
  for(var d = 1; d <= 60; d++){
    var items = DETOX60_ITEMS[d];
    if(!items) continue;
    var dayDone = state.detox60Progress[d + '_0'] && state.detox60Progress[d + '_1'];
    html += '<div class="method-card" style="border-left:3px solid ' + (dayDone ? 'var(--success)' : 'var(--brand)') + ';">';
    html += '<div class="method-header"><div class="method-emoji">' + (dayDone ? '✓' : d) + '</div>';
    html += '<div style="flex:1;"><div class="method-title">День ' + d + (dayDone ? ' · Готово' : '') + '</div></div></div>';
    items.forEach(function(item, i){
      var checked = state.detox60Progress[d + '_' + i];
      html += '<div style="display:flex;gap:10px;align-items:center;padding:8px 0;' + (checked ? 'opacity:.5;' : '') + '" onclick="toggleDetox60Item(' + d + ',' + i + ')">';
      html += '<div style="font-size:20px;">' + item.emoji + '</div>';
      html += '<div style="flex:1;font-size:13px;' + (checked ? 'text-decoration:line-through;' : '') + '">' + esc(item.text) + '</div>';
      html += '<div class="task-checkbox ' + (checked ? 'checked' : '') + '" style="width:26px;height:26px;font-size:12px;">' + (checked ? '✓' : '') + '</div>';
      html += '</div>';
    });
    html += '</div>';
  }
  html += '</div>';
  document.getElementById('app').innerHTML = html;
}
function toggleDetox60Item(day, index){
  if(!state.detox60Progress) state.detox60Progress = {};
  var key = day + '_' + index;
  state.detox60Progress[key] = !state.detox60Progress[key];
  if(state.detox60Progress[key]) addXP(5, 'detox60');
  save();
  renderDetox60();
}

/* ============ OBSIDIAN ============ */
function exportToObsidian(){
 var md='# LIFE OS — Второй мозг\n\nЭкспортировано: '+new Date().toLocaleString('ru-RU')+'\n\n## Задачи\n'+(state.tasks||[]).map(function(t){return '- ['+(t.status==='completed'?'x':' ')+'] '+String(t.title||'').replace(/\n/g,' ') +(t.due_date?' — '+t.due_date:'');}).join('\n')+'\n\n## Привычки\n'+(state.habits||[]).map(function(h){return '- '+(h.emoji||'')+' '+(h.title||'Привычка')+' — streak '+(h.streak||0);}).join('\n')+'\n\n## Дневник\n'+(state.journalEntries||[]).slice(-60).map(function(e){return '### '+e.date+'\n'+(e.text||'')+'\n\nПолучилось: '+(e.wins||'—')+'\n\nМешало: '+(e.blockers||'—')+'\n\nБлагодарность: '+(e.gratitude||'—');}).join('\n\n')+'\n\n## Знания\n'+(state.secondBrainItems||[]).map(function(x){return '### '+x.title+'\nТеги: '+(x.tags||[]).join(', ')+'\n\n'+x.body;}).join('\n\n')+'\n\n## Сферы\n'+JSON.stringify(state.spheres&&state.spheres.lastScores||{},null,2)+'\n';
 var blob=new Blob([md],{type:'text/markdown;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='lifeos-second-brain-'+today()+'.md';a.click();setTimeout(function(){URL.revokeObjectURL(url);},1000);state.lastExport=nowISO();save();toast('Markdown экспортирован','success');
}

function openObsidianDailyNote(){var vault=String(state.obsidianVaultName||'').trim();if(!vault)return toast('Укажи название Vault в разделе Obsidian','warning');window.location.href='obsidian://daily?vault='+encodeURIComponent(vault);}

function importFromObsidian(){
 var input=document.createElement('input');input.type='file';input.accept='.md,.txt,.json';
 input.onchange=function(event){
  var file=event.target.files&&event.target.files[0];if(!file)return;
  if(file.size>15*1024*1024)return toast('Файл больше 15 МБ','error');
  var reader=new FileReader();
  reader.onload=function(){
   try{
    var raw=String(reader.result||''),importedTasks=0,importedNotes=0,importedJournal=0;
    if(file.name.toLowerCase().endsWith('.json')){
     var parsed=JSON.parse(raw),incoming=parsed&&parsed.format==='life-os-backup'?parsed.data:parsed;
     if(!incoming||typeof incoming!=='object'||Array.isArray(incoming))throw new Error('Неверный JSON');
     backupStorage();
     ['tasks','journalEntries','secondBrainItems','calendarEvents','customNotes','customGoals'].forEach(function(key){
      if(!Array.isArray(incoming[key]))return;
      if(!Array.isArray(state[key]))state[key]=[];
      incoming[key].forEach(function(item){
       var identity=item.id||item.date||item.title;
       var exists=state[key].some(function(old){return (old.id||old.date||old.title)===identity;});
       if(!exists){state[key].push(item);if(key==='tasks')importedTasks++;else if(key==='journalEntries')importedJournal++;else if(key==='secondBrainItems')importedNotes++;}
      });
     });
    }else{
     var lines=raw.replace(/\r/g,'').split('\n'),section='',note=null,diary=null;
     function flushNote(){if(note&&note.title&&note.body.trim()){if(!Array.isArray(state.secondBrainItems))state.secondBrainItems=[];var duplicate=state.secondBrainItems.some(function(x){return x.title===note.title&&String(x.body||'').trim()===note.body.trim();});if(!duplicate){state.secondBrainItems.push({id:uid(),title:note.title,body:note.body.trim(),tags:note.tags||[],createdAt:today(),updatedAt:nowISO(),source:'obsidian'});importedNotes++;}}note=null;}
     function flushDiary(){if(diary&&diary.date){if(!Array.isArray(state.journalEntries))state.journalEntries=[];var exists=state.journalEntries.some(function(x){return x.date===diary.date;});if(!exists){state.journalEntries.push(Object.assign({id:uid(),createdAt:nowISO(),updatedAt:nowISO()},diary));importedJournal++;}}diary=null;}
     lines.forEach(function(line){
      var h2=line.match(/^##\s+(.+)$/),h3=line.match(/^###\s+(.+)$/);
      if(h2){flushNote();flushDiary();section=h2[1].trim();return;}
      if(section==='Знания'&&h3){flushNote();note={title:h3[1].trim(),body:'',tags:[]};return;}
      if(section==='Дневник'&&h3&&/^\d{4}-\d{2}-\d{2}$/.test(h3[1].trim())){flushDiary();diary={date:h3[1].trim(),text:''};return;}
      if(section==='Знания'&&note){var tagLine=line.match(/^Теги:\s*(.*)$/);if(tagLine){note.tags=tagLine[1].split(',').map(function(x){return x.trim();}).filter(Boolean);return;}note.body+=(note.body?'\n':'')+line;return;}
      if(section==='Дневник'&&diary){if(line.indexOf('Получилось:')===0)diary.wins=line.slice(12).trim();else if(line.indexOf('Мешало:')===0)diary.blockers=line.slice(8).trim();else if(line.indexOf('Благодарность:')===0)diary.gratitude=line.slice(14).trim();else diary.text+=(diary.text?'\n':'')+line;return;}
      var task=line.match(/^- \[([ x])\] (.+)$/);
      if(task){var title=task[2].replace(/📅.*$/,'').replace(/\x60.*\x60/,'').trim();if(title&&!state.tasks.some(function(t){return t.title===title;})){state.tasks.push({id:uid(),title:title,status:task[1]==='x'?'completed':'pending',priority:'medium',planned_time:30,created_at:nowISO(),imported_from:'obsidian'});importedTasks++;}}
     });
     flushNote();flushDiary();
    }
    if(!save())throw new Error('Не удалось записать импорт в хранилище');
    toast('Импортировано: '+importedTasks+' задач, '+importedNotes+' знаний, '+importedJournal+' записей дневника','success',4500);
    renderObsidianIntegration();
   }catch(error){console.error('[OBSIDIAN IMPORT]',error);toast('Не удалось импортировать файл: '+String(error.message||error).slice(0,120),'error',4500);}
  };
  reader.onerror=function(){toast('Не удалось прочитать файл','error');};reader.readAsText(file);
 };
 input.click();
}
function renderObsidianIntegration(){
 if(!Array.isArray(state.secondBrainItems))state.secondBrainItems=[];var items=state.secondBrainItems,html='<div class="page"><div class="title-xl">🧠 Второй мозг</div><div class="subtitle">Личная база знаний LIFE OS ↔ Obsidian ↔ Markdown. Работает офлайн; файлы остаются под твоим контролем.</div><div class="card"><h2>＋ Быстро сохранить знание</h2><div class="field"><label class="field-label">Заголовок</label><input id="brainTitle" maxlength="140" placeholder="Идея, вывод, заметка..."></div><div class="field"><label class="field-label">Содержание</label><textarea id="brainBody" rows="5" maxlength="8000" placeholder="Суть, источник, личный вывод, что применить..."></textarea></div><div class="field"><label class="field-label">Теги через запятую</label><input id="brainTags" maxlength="300" placeholder="работа, обучение, идея"></div><button class="btn btn-primary btn-block" onclick="saveSecondBrainItem()">Сохранить в базу знаний</button></div><div class="card mb-3"><h2>Связь с Obsidian</h2><div class="field"><label class="field-label">Название хранилища Obsidian</label><input id="obsidianVaultName" maxlength="80" value="'+esc(state.obsidianVaultName||'')+'" placeholder="Мой Vault" onchange="state.obsidianVaultName=this.value.trim();save()"></div><div class="btn-row"><button class="btn btn-primary" onclick="exportToObsidian()">Экспорт Markdown</button><button class="btn btn-ghost" onclick="openObsidianDailyNote()">Открыть дневную заметку ↗</button></div><div class="footnote mt-2">Браузер не может напрямую читать и изменять папку Vault без отдельного разрешения файловой системы. Экспорт создаёт совместимый Markdown-файл; Obsidian URI открывает заметку, если приложение установлено.</div><button class="btn btn-ghost btn-block mt-2" onclick="importFromObsidian()">Импорт Markdown / JSON</button></div><div class="row-between mb-2"><b>Моя база знаний</b><span class="footnote">'+items.length+' материалов</span></div><div class="field"><input id="brainSearch" placeholder="Поиск по знаниям и тегам..." oninput="filterSecondBrain(this.value)"></div><div id="secondBrainList">'+renderSecondBrainItems(items)+'</div></div>';document.getElementById('app').innerHTML=html;
}
function renderSecondBrainItems(items){if(!items.length)return '<div class="card empty"><div class="empty-icon">🧠</div><div class="empty-title">Пока нет знаний</div><div class="footnote">Сохраняй идеи, выводы и материалы — они будут доступны офлайн.</div></div>';return items.slice().sort(function(a,b){return String(b.updatedAt||b.createdAt||'').localeCompare(String(a.updatedAt||a.createdAt||''));}).map(function(x){return '<article class="card mb-2"><div class="row-between"><b>'+esc(x.title)+'</b><button class="btn btn-ghost btn-xs" onclick="deleteSecondBrainItem(\''+x.id+'\')">Удалить</button></div><p class="body-text mt-2">'+esc(x.body).replace(/\n/g,'<br>')+'</p><div class="footnote mt-2">'+esc((x.tags||[]).join(' · '))+' · '+esc(x.createdAt||'')+'</div></article>';}).join('');}
function filterSecondBrain(q){var host=document.getElementById('secondBrainList');if(!host)return;var term=String(q||'').toLowerCase();host.innerHTML=renderSecondBrainItems((state.secondBrainItems||[]).filter(function(x){return (x.title+' '+x.body+' '+(x.tags||[]).join(' ')).toLowerCase().includes(term);}));}
function saveSecondBrainItem(){var title=(document.getElementById('brainTitle')||{}).value||'',body=(document.getElementById('brainBody')||{}).value||'',tags=(document.getElementById('brainTags')||{}).value||'';if(!title.trim()||!body.trim())return toast('Укажи заголовок и содержание','warning');if(!Array.isArray(state.secondBrainItems))state.secondBrainItems=[];state.secondBrainItems.push({id:uid(),title:title.trim(),body:body.trim(),tags:tags.split(',').map(function(x){return x.trim();}).filter(Boolean).slice(0,12),createdAt:today(),updatedAt:nowISO()});save();toast('Сохранено во втором мозге','success');renderObsidianIntegration();}
function deleteSecondBrainItem(id){if(!confirm('Удалить материал из второго мозга?'))return;state.secondBrainItems=(state.secondBrainItems||[]).filter(function(x){return x.id!==id;});save();renderObsidianIntegration();}
function openObsidianDailyNote(){var vault=String(state.obsidianVaultName||'').trim();if(!vault)return toast('Сначала укажи название Vault','warning');var url='obsidian://daily?vault='+encodeURIComponent(vault);window.open(url,'_blank');}

/* ============ TELEGRAM ============ */
function getTelegramConfig(){
  if(!state.integrations) state.integrations = {};
  if(!state.integrations.telegram) state.integrations.telegram = {botToken:'', chatId:'', connected:false, lastSent:null};
  return state.integrations.telegram;
}
function saveTelegramConfig(){
  var token = (document.getElementById('tg-token')||{}).value || '';
  var chatId = (document.getElementById('tg-chat')||{}).value || '';
  var cfg = getTelegramConfig();
  cfg.botToken = token.trim();
  cfg.chatId = chatId.trim();
  cfg.connected = !!(cfg.botToken && cfg.chatId);
  save();
  toast(cfg.connected ? '✓ Telegram подключён' : 'Заполни все поля', cfg.connected ? 'success' : 'warning');
  renderTelegramSetup();
}
function sendToTelegram(text){
  var cfg = getTelegramConfig();
  if(!cfg.connected){ toast('Telegram не подключён','warning'); return Promise.reject('not connected'); }
  var url = 'https://api.telegram.org/bot' + cfg.botToken + '/sendMessage';
  return fetch(url, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({chat_id:cfg.chatId, text:text, parse_mode:'HTML'})
  }).then(function(r){ return r.json(); }).then(function(data){
    if(data.ok){ cfg.lastSent = nowISO(); save(); return data; }
    throw new Error(data.description || 'Telegram error');
  });
}
function renderTelegramSetup(){
  var cfg = getTelegramConfig();
  var html = '<div class="page"><div class="title-xl">📨 Telegram-коуч</div>';
  html += '<div class="card">';
  html += '<div class="field"><label class="field-label">Bot Token</label><input type="text" id="tg-token" value="' + esc(cfg.botToken||'') + '" placeholder="123456:ABC..."/></div>';
  html += '<div class="field"><label class="field-label">Chat ID</label><input type="text" id="tg-chat" value="' + esc(cfg.chatId||'') + '" placeholder="123456789"/></div>';
  html += '<button class="btn btn-primary btn-block" onclick="saveTelegramConfig()">💾 Сохранить</button>';
  html += '</div>';
  if(cfg.connected){
    html += '<div class="card"><h2>Отправить сообщение</h2>';
    html += '<button class="btn btn-ghost btn-block mb-2" onclick="sendCoachDailyGreeting()">🌅 Утреннее</button>';
    html += '<button class="btn btn-ghost btn-block" onclick="sendCoachEveningSummary()">🌙 Вечернее</button>';
    html += '</div>';
  }
  html += '<div class="card"><h2>Как настроить</h2>';
  html += '<div class="lesson-content"><ol style="padding-left:20px;">';
  html += '<li>Создай бота у @BotFather</li>';
  html += '<li>Скопируй botToken</li>';
  html += '<li>Напиши @userinfobot — узнай chatId</li>';
  html += '<li>Вставь сюда</li>';
  html += '</ol></div></div>';
  html += '</div>';
  document.getElementById('app').innerHTML = html;
}
function sendCoachDailyGreeting(){
  var text = '☀️ Привет, ' + (state.profile.name||'друг') + '! Как спалось?';
  sendToTelegram(text).then(function(){ toast('✓ Отправлено','success'); }).catch(function(e){ toast('Ошибка: ' + e,'error'); });
}
function sendCoachEveningSummary(){
  var t = today();
  var tasksDone = (state.tasks||[]).filter(function(x){ return x.completedAt && x.completedAt.slice(0,10) === t; }).length;
  var habitsDone = (state.habits||[]).filter(function(h){ return h.lastCompletedDate === t; }).length;
  var text = '🌙 Итоги дня:\n✅ Задач: ' + tasksDone + '\n🔄 Привычек: ' + habitsDone + '/' + (state.habits||[]).length + '\n⭐ XP: ' + (state.gamification && state.gamification.xp || 0);
  sendToTelegram(text).then(function(){ toast('✓ Отправлено','success'); }).catch(function(e){ toast('Ошибка: ' + e,'error'); });
}

/* ============ STATS / MORE / SETTINGS / PROFILE ============ */
var LIFE_STATS_PERIOD = 30;
function lifeStatsDate(value){
  if(!value)return null;
  var d=new Date(value);
  if(!Number.isFinite(d.getTime())){var m=String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);if(m)d=new Date(Number(m[1]),Number(m[2])-1,Number(m[3]));}
  return Number.isFinite(d.getTime())?d:null;
}
function lifeStatsInPeriod(value,days){
  var d=lifeStatsDate(value);if(!d)return false;
  var start=new Date();start.setHours(0,0,0,0);start.setDate(start.getDate()-(days===0?36500:days-1));
  var end=new Date();end.setHours(23,59,59,999);
  return d>=start&&d<=end;
}
function lifeStatsCountMap(value){
  if(!value||typeof value!=='object')return 0;
  return Object.keys(value).length;
}
function buildComprehensiveStatsLegacy(days){
  var s=state||{},period=Number(days)===0?0:(Number(days)||30);
  var arr=function(k){return Array.isArray(s[k])?s[k]:[];};
  var within=function(x){return lifeStatsInPeriod(x,period);};
  var byDate=function(x){return x&& (x.date||x.completedAt||x.completed_at||x.createdAt||x.created_at||x.at||x.timestamp);};
  var tasks=arr('tasks'),done=tasks.filter(function(x){return x.status==='completed';}),pending=tasks.filter(function(x){return x.status!=='completed';});
  var completedPeriod=done.filter(function(x){return within(x.completedAt||x.completed_at||x.updated_at||x.created_at);});
  var overdue=pending.filter(function(x){return x.due_date&&String(x.due_date).slice(0,10)<today();});
  var habits=arr('habits'),habitDone=habits.filter(function(x){return x.lastCompletedDate===today();});
  var screen=arr('screenEntries').filter(function(x){return within(byDate(x));});
  var screenMinutes=screen.reduce(function(n,x){return n+(Number(x.minutes)||0);},0);
  var sleep=arr('sleepEntries').filter(function(x){return within(byDate(x));});
  var sleepMinutes=sleep.reduce(function(n,x){var v=Number(x.minutes);if(!v)v=Number(x.hours)*60;if(!v)v=Number(x.duration);return n+(v>0&&v<1440?v:0);},0);
  var mood=arr('customMood').filter(function(x){return within(byDate(x));});
  var water=arr('customWater').filter(function(x){return within(byDate(x));});
  var workouts=arr('customWorkouts').filter(function(x){return within(byDate(x));});
  var meditation=arr('customMeditation').filter(function(x){return within(byDate(x));});
  var walks=arr('walks').filter(function(x){return within(byDate(x));});
  var brain=arr('brainPlays').filter(function(x){return within(byDate(x));});
  var reviews=s.fsrs&&Array.isArray(s.fsrs.reviews)?s.fsrs.reviews:[];
  var fsrsReviews=reviews.filter(function(x){return within(byDate(x));});
  var calendar=arr('calendarEvents'),calendarPeriod=calendar.filter(function(x){return within(x.date||x.createdAt);});
  var projects=arr('projects'),projectDone=projects.filter(function(x){return x.status==='completed'||x.done;});
  var focusHistory=(s.focus&&Array.isArray(s.focus.history)?s.focus.history:[]).concat(s.timerSessions||[],s.focusSessions||[]).filter(function(x){return within(byDate(x));});
  var antistress=arr('antistressEntries').filter(function(x){return within(byDate(x));});
  var checkins=(s.jarvis&&Array.isArray(s.jarvis.checkins)?s.jarvis.checkins:[]).filter(function(x){return within(byDate(x));});
  var xpHistory=s.gamification&&Array.isArray(s.gamification.xpHistory)?s.gamification.xpHistory:[];
  var xpPeriod=xpHistory.filter(function(x){return within(byDate(x));}).reduce(function(n,x){return n+(Number(x.amount)||0);},0);
  var financeRows=arr('financeEntries').slice();
  Object.keys(s.workspaces||{}).forEach(function(k){if(/finance|money|budget/i.test(k)&&Array.isArray(s.workspaces[k]))financeRows=financeRows.concat(s.workspaces[k]);});
  var financePeriod=financeRows.filter(function(x){return within(byDate(x));});
  var sphereScores=s.spheres&&s.spheres.scores||{};
  var sphereValues=Object.keys(sphereScores).map(function(k){return Number(sphereScores[k]);}).filter(function(n){return Number.isFinite(n)&&n>0;});
  var learningCount=lifeStatsCountMap(s.levelProgress)+lifeStatsCountMap(s.englishProgress)+lifeStatsCountMap(s.skillsProgress)+lifeStatsCountMap(s.memoryProgress)+lifeStatsCountMap(s.iqProgress)+lifeStatsCountMap(s.eqProgress)+lifeStatsCountMap(s.neuroProgress)+lifeStatsCountMap(s.psychologyProgress)+lifeStatsCountMap(s.thinkingProgress);
  var sectionKeys=Object.keys(s),inventory=sectionKeys.map(function(k){var v=s[k],count=Array.isArray(v)?v.length:(v&&typeof v==='object'?Object.keys(v).length:((v!==null&&v!==undefined&&v!=='')?1:0));return {key:k,count:count,type:Array.isArray(v)?'список':(v&&typeof v==='object'?'объект':'значение')};}).sort(function(a,b){return b.count-a.count;});
  var trackedSections=['tasks','habits','screenEntries','sleepEntries','customMood','customWater','customWorkouts','customMeditation','walks','brainPlays','fsrs','calendarEvents','projects','spheres','memoryProgress','vision','detox','financeProgress','jarvis'];
  var tracked=trackedSections.filter(function(k){var v=s[k];return Array.isArray(v)?v.length>0:(v&&typeof v==='object'&&Object.keys(v).length>0);}).length;
  var avg=function(rows,key){var vals=rows.map(function(x){return Number(x[key]);}).filter(function(n){return Number.isFinite(n)&&n>0;});return vals.length?Math.round(vals.reduce(function(a,b){return a+b;},0)/vals.length*10)/10:null;};
  var daily=[];for(var offset=period===0?29:Math.min(period-1,29);offset>=0;offset--){var d=new Date();d.setDate(d.getDate()-offset);var key=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');daily.push({date:key,tasks:completedPeriod.filter(function(x){return String(x.completedAt||x.completed_at||x.updated_at||'').slice(0,10)===key;}).length,screen:screen.filter(function(x){return String(byDate(x)||'').slice(0,10)===key;}).reduce(function(n,x){return n+(Number(x.minutes)||0);},0),habits:habits.filter(function(x){return x.lastCompletedDate===key;}).length});}
  return {
    period:period,label:period===0?'За всё время':'За '+period+' дн.',
    overview:{tasksTotal:tasks.length,tasksDone:done.length,tasksPending:pending.length,tasksDonePeriod:completedPeriod.length,overdue:overdue.length,habitTotal:habits.length,habitsToday:habitDone.length,streak:Number(s.stats&&s.stats.streak)||0,bestStreak:Number(s.stats&&s.stats.bestStreak)||0,xp:Number(s.gamification&&s.gamification.xp)||Number(s.xp)||0,xpPeriod:xpPeriod,level:Number(s.gamification&&s.gamification.level)||Number(s.level)||1},
    health:{sleepEntries:sleep.length,sleepAvgHours:sleep.length?Math.round(sleepMinutes/sleep.length/60*10)/10:null,moodEntries:mood.length,moodAvg:avg(mood,'score'),waterEntries:water.length,waterTotal:water.reduce(function(n,x){return n+(Number(x.count)||Number(x.amount)||0);},0),workouts:workouts.length,meditation:meditation.length,walks:walks.length,walkMinutes:walks.reduce(function(n,x){return n+(Number(x.minutes)||0);},0),antistress:antistress.length},
    focus:{screenEntries:screen.length,screenMinutes:screenMinutes,screenDailyAvg:Math.round(screenMinutes/Math.max(1,period===0?30:period)),screenLimit:Number(s.screenStats&&s.screenStats.dailyLimit)||null,focusSessions:focusHistory.length,focusMinutes:focusHistory.reduce(function(n,x){return n+(Number(x.minutes)||Number(x.duration)||0);},0),checkins:checkins.length,energyAvg:avg(checkins,'energy'),concentrationAvg:avg(checkins,'focus'),sleepQualityAvg:avg(checkins,'sleep'),stressAvg:avg(checkins,'stress')},
    learning:{progressItems:learningCount,brainPlays:brain.length,brainAvgScore:avg(brain,'score'),fsrsCards:lifeStatsCountMap(s.fsrs&&s.fsrs.cards),fsrsReviews:fsrsReviews.length,fsrsDue:(s.fsrs&&Array.isArray(s.fsrs.dueToday)?s.fsrs.dueToday.length:0)},
    life:{projects:projects.length,projectsDone:projectDone.length,calendarEvents:calendarPeriod.length,calendarDone:calendarPeriod.filter(function(x){return x.done;}).length,sphereScores:sphereValues.length,sphereAverage:sphereValues.length?Math.round(sphereValues.reduce(function(a,b){return a+b;},0)/sphereValues.length*10)/10:null,financeEntries:financePeriod.length,financeNet:financePeriod.reduce(function(n,x){return n+(Number(x.amount)||0);},0),visionLogs:lifeStatsCountMap(s.vision&&s.vision.metrics)+lifeStatsCountMap(s.vision&&s.vision.reviews),detoxEntries:(s.detox&&Array.isArray(s.detox.history)?s.detox.history.length:0)+(s.detox60Progress?lifeStatsCountMap(s.detox60Progress):0),memoryItems:lifeStatsCountMap(s.memoryProgress)+lifeStatsCountMap(s.fsrs&&s.fsrs.cards)},
    coverage:{activeSections:tracked,totalTracked:trackedSections.length,percent:Math.round(tracked/trackedSections.length*100),inventory:inventory},
    daily:daily
  };
}
function getSafeLifeStats(period){
  try{
    var result=buildComprehensiveStats(period);
    if(!result||!result.overview||!result.health||!result.focus||!result.learning||!result.life||!result.coverage)throw new Error('Аналитика вернула неполную структуру данных.');
    return result;
  }catch(error){
    return {period:Number(period)||30,label:'Аналитика временно недоступна',error:String(error&&error.message||error||'Неизвестная ошибка').slice(0,240),
      overview:{tasksTotal:0,tasksDone:0,tasksPending:0,tasksDonePeriod:0,overdue:0,habitTotal:0,habitsToday:0,habitEvents:0,streak:0,bestStreak:0,xp:0,xpPeriod:0,level:1},
      health:{sleepEntries:0,sleepAvgHours:null,sleepTarget:null,moodEntries:0,moodAvg:null,waterEntries:0,waterTotal:0,workouts:0,meditation:0,walks:0,walkMinutes:0,antistress:0},
      focus:{screenEntries:0,screenMinutes:0,screenDailyAvg:null,screenLimit:null,screenDeviation:null,screenByCategory:[],screenDays:0,screenCoveragePct:0,screenSampleSufficient:false,focusSessions:0,focusMinutes:0,checkins:0,energyAvg:null,concentrationAvg:null,sleepQualityAvg:null,stressAvg:null},
      learning:{progressItems:0,brainPlays:0,brainAvgScore:null,fsrsCards:0,fsrsReviews:0,fsrsDue:0,fsrsRetention:null,memorySessions:0,memoryAccuracy:null,memoryBestSpan:0,eyeExercises:0,studySessions:0,studyMinutes:0,studyDue:0},
      life:{projects:0,projectsDone:0,calendarEvents:0,calendarDone:0,sphereScores:0,sphereAverage:null,financeEntries:0,financeNet:0,visionLogs:0,eyeFatigueAvg:null,headaches:0,eyeBreaks:0,detoxEntries:0,memoryItems:0,detoxReviews:0},
      coverage:{activeSections:0,totalTracked:0,percent:0,inventory:[]},comparison:{screenRecentDaily:0,screenPreviousDaily:0,screenChangePercent:null,tasksRecentDaily:0,tasksPreviousDaily:0,tasksChangePercent:null},daily:[]};
  }
}
function getJarvisAnalytics(silent){
  var a=getSafeLifeStats(LIFE_STATS_PERIOD),d=getJarvisState(),items=[],focus=25;
  if(a.overview.overdue>0)items.push({id:'overdue',level:'high',title:'Разобрать просроченные задачи',detail:'Просрочено: '+a.overview.overdue+'. Сначала выбери одну важную и перенеси или выполни остальные.',action:'Открой задачи и пересмотри сроки.'});
  if(a.overview.tasksPending>8)items.push({id:'overload',level:'medium',title:'Снизить перегрузку задачами',detail:'Активных задач '+a.overview.tasksPending+'. Сузь список до 3 главных результатов на сегодня.',action:'Джарвис будет предлагать короткие фокус-сессии.'});
  if(a.focus.screenLimit&&a.focus.screenDailyAvg>a.focus.screenLimit)items.push({id:'screen',level:'high',title:'Экранное время выше лимита',detail:'Среднее за период '+a.focus.screenDailyAvg+' мин/день при лимите '+a.focus.screenLimit+' мин.',action:'Запланируй паузу и сократи следующий сеанс.'});
  if(a.focus.energyAvg!==null&&a.focus.energyAvg<2.8){focus=15;items.push({id:'energy',level:'high',title:'Учитываем низкую энергию',detail:'Средняя энергия по самооценке: '+a.focus.energyAvg+'/5.',action:'Переключить фокус на 15 минут и снизить нагрузку.'});}
  if(a.focus.concentrationAvg!==null&&a.focus.concentrationAvg<2.8){focus=Math.min(focus,15);items.push({id:'concentration',level:'medium',title:'Поддержать концентрацию',detail:'Средняя концентрация: '+a.focus.concentrationAvg+'/5.',action:'Одна задача за раз, короткий фокус и перерыв.'});}
  if(a.learning.fsrsDue>0)items.push({id:'reviews',level:'medium',title:'Есть материал для повторения',detail:'Карточек к повторению: '+a.learning.fsrsDue+'.',action:'Открой FSRS и повтори материал небольшими блоками.'});
  if(!a.learning.memorySessions)items.push({id:'memory-training',level:'info',title:'Добавить тренировку памяти в план',detail:'За выбранный период нет зарегистрированных тренировок рабочей и кратковременной памяти.',action:'Выдели 3 минуты на рабочую память, 3 минуты на кратковременную и 4 минуты на повторение FSRS.'});
  else if(a.learning.memoryAccuracy!==null&&a.learning.memoryAccuracy<65)items.push({id:'memory-training',level:'medium',title:'Снизить сложность тренировки памяти',detail:'Средняя точность воспроизведения '+a.learning.memoryAccuracy+'%.',action:'Вернись на более короткую последовательность и постепенно увеличивай объём.'});
  if(a.health.sleepAvgHours!==null&&a.health.sleepAvgHours<6.5)items.push({id:'sleep',level:'high',title:'Недостаточно данных о сне',detail:'Среднее по записанным сессиям: '+a.health.sleepAvgHours+' ч. Это ориентир по журналу, не медицинская оценка.',action:'Зафиксируй сон и оставь запас времени на восстановление.'});
  if(a.coverage.percent<35)items.push({id:'coverage',level:'info',title:'Недостаточно данных для точного управления',detail:'Заполнено '+a.coverage.activeSections+' из '+a.coverage.totalTracked+' основных трекеров.',action:'Добавь записи в важные для тебя разделы. Неактивные трекеры не считаются нулевыми результатами.'});
  if(!items.length)items.push({id:'steady',level:'good',title:'Критичных сигналов не найдено',detail:'Продолжай текущий ритм. Джарвис проверяет только реально сохранённые записи.',action:'Сохрани регулярность и проведи вечерний обзор.'});
  var selected=getLifeStatsFilter().category||'all';
  if(selected!=='all'){var allowed={productivity:['overdue','overload','habits'],screen:['screen','screen-target','screen-data','screen-trend','screen-coverage'],health:['sleep','sleep-data','energy','concentration','vision-fatigue','vision-headache'],learning:['reviews','study-due','memory-training'],life:['detox-feedback','coverage']};var ids=allowed[selected]||[];items=items.filter(function(x){return ids.indexOf(x.id)>=0||x.id.indexOf('screen-')===0;});if(!items.length)items.push({id:'filtered-empty',level:'good',title:'Отклонений в выбранном направлении не найдено',detail:'Для выбранного фильтра нет сигналов, требующих вмешательства.',action:'Продолжай наблюдение и проверь динамику позже.',target:'stats',confidence:'Текущие фильтры'});}
  return {at:nowISO(),period:a.label,analytics:a,items:items,focusSuggestion:focus};
}
function runJarvisAutopilot(silent){
  var d=getJarvisState(),analysis=getJarvisAnalytics(true),changed=false;
  var ranked=(state.tasks||[]).filter(function(t){return t.status!=='completed';}).slice().sort(function(a,b){
    var score=function(t){var p={urgent:40,high:30,medium:20,low:10}[String(t.priority||'medium').toLowerCase()]||20;var due=t.due_date&&String(t.due_date).slice(0,10);if(due&&due<today())p+=50;else if(due===today())p+=25;return p;};
    return score(b)-score(a);
  });
  d.autopilotState=analysis;d.dailyPlan={date:today(),items:analysis.items.slice(0,5),tasks:ranked.slice(0,3).map(function(t){return {id:t.id,title:t.title,priority:t.priority||'medium',due_date:t.due_date||null};}),updatedAt:nowISO()};
  if(d.autopilotEnabled){
    var suggested=analysis.focusSuggestion||25;
    if(Number(d.focusDefault)!==suggested){d.focusDefault=suggested;changed=true;}
    d.lastAutopilotAt=nowISO();
    if(!Array.isArray(d.autopilotLog))d.autopilotLog=[];
    d.autopilotLog.push({at:nowISO(),actions:changed?['focusDefault:'+suggested]:['plan-refreshed']});
    if(d.autopilotLog.length>100)d.autopilotLog=d.autopilotLog.slice(-100);
  }
  save();
  if(!silent&&typeof toast==='function')toast(d.autopilotEnabled?'Джарвис обновил план и безопасные настройки':'Анализ обновлён. Включи автопилот для автоматической адаптации','success');
  return analysis;
}
function setJarvisAutopilot(enabled){
  var d=getJarvisState();d.autopilotEnabled=!!enabled;
  runJarvisAutopilot(true);renderJarvis();
  toast(enabled?'Автопилот включён: только безопасная адаптация плана и фокуса':'Автопилот выключен','success');
}
function applyJarvisRecommendation(id){
  var a=getJarvisAnalytics(true),item=a.items.find(function(x){return x.id===id;});
  if(!item)return;
  if(id==='energy'||id==='concentration'||id==='overload'){getJarvisState().focusDefault=15;save();toast('Фокус установлен на 15 минут','success');renderJarvis();return;}
  if(id==='overdue'){navigate('tasks');return;}
  if(id==='reviews'){navigate('fsrs');return;}
  if(id==='study-due'){navigate('learningPractice');return;}
  if(id==='screen'){navigate('screentracker');return;}
  if(id==='sleep'){navigate('sleep');return;}
  if(id==='coverage'){navigate('more');return;}
  jarvisQuick('сводка');
}
function statsBar(label,value,max,unit){
  var n=Math.max(0,Number(value)||0),m=Math.max(1,Number(max)||1),pct=Math.min(100,Math.round(n/m*100));
  return '<div class="mb-2"><div class="row-between"><span class="footnote">'+esc(label)+'</span><b>'+esc(String(value===null?'—':value))+esc(unit||'')+'</b></div><div style="height:7px;background:var(--glass-2);border-radius:9px;overflow:hidden;margin-top:5px"><div style="height:100%;width:'+pct+'%;background:var(--brand);border-radius:9px"></div></div></div>';
}
function setStatsPeriod(days){LIFE_STATS_PERIOD=Number(days)===0?0:(Number(days)||30);renderStats();}
function renderStats(){
  var a=getSafeLifeStats(LIFE_STATS_PERIOD),o=a.overview,h=a.health,f=a.focus,l=a.learning,v=a.life,c=a.coverage,g=state.gamification||defaultState().gamification;
  var html='<div class="page"><div class="title-xl">📊 Полная статистика LIFE OS</div><div class="subtitle">Все основные направления · фактические записи · динамика и качество данных</div>';
  html+='<div class="btn-row mb-3"><button class="btn '+(LIFE_STATS_PERIOD===7?'btn-primary':'btn-ghost')+' btn-sm" onclick="setStatsPeriod(7)">7 дней</button><button class="btn '+(LIFE_STATS_PERIOD===30?'btn-primary':'btn-ghost')+' btn-sm" onclick="setStatsPeriod(30)">30 дней</button><button class="btn '+(LIFE_STATS_PERIOD===90?'btn-primary':'btn-ghost')+' btn-sm" onclick="setStatsPeriod(90)">90 дней</button><button class="btn '+(LIFE_STATS_PERIOD===0?'btn-primary':'btn-ghost')+' btn-sm" onclick="setStatsPeriod(0)">Всё время</button></div>';
  if(a.error)html+='<div class="card" role="status"><b>⚠️ Аналитика не смогла прочитать часть данных</b><div class="footnote mt-1">'+esc(a.error)+'</div>Повторно открой статистику после сохранения изменений.</div>';
  html+='<div class="card card-gradient"><div class="row-between"><span>Уровень '+o.level+'</span><span>'+o.streak+' 🔥 дней серии</span></div><div style="font-size:36px;font-weight:850;margin:8px 0">'+o.xp+' XP</div><div class="footnote">+'+o.xpPeriod+' XP за выбранный период · лучший streak '+o.bestStreak+'</div></div>';
  html+='<div class="grid-2 mb-3"><div class="card"><div class="stat-value">'+o.tasksDonePeriod+'</div><div class="stat-label">Задач завершено</div></div><div class="card"><div class="stat-value">'+o.tasksPending+'</div><div class="stat-label">Активные задачи</div></div><div class="card"><div class="stat-value">'+h.workouts+'</div><div class="stat-label">Тренировки</div></div><div class="card"><div class="stat-value">'+(f.screenDailyAvg===null?'—':f.screenDailyAvg+' мин')+'</div><div class="stat-label">Экран/день · среднее</div></div></div>';
  html+='<div class="card mb-3"><div class="card-title">🎯 Работа и продуктивность</div>'+statsBar('Выполнено задач за период',o.tasksDonePeriod,Math.max(1,o.tasksDonePeriod+o.tasksPending),'')+statsBar('Привычки выполнены сегодня',o.habitsToday,Math.max(1,o.habitTotal),'')+'<div class="grid-2"><div><b>'+o.overdue+'</b><div class="footnote">Просрочено</div></div><div><b>'+o.tasksTotal+'</b><div class="footnote">Всего задач</div></div></div></div>';
  html+='<div class="card mb-3"><div class="card-title">🧠 Обучение и память</div><div class="grid-2"><div><b>'+l.memorySessions+'</b><div class="footnote">Тренировок памяти за период</div></div><div><b>'+(l.memoryAccuracy===null?'—':l.memoryAccuracy+'%')+'</b><div class="footnote">Точность воспроизведения</div></div><div><b>'+l.memoryBestSpan+'</b><div class="footnote">Лучший объём памяти</div></div><div><b>'+l.progressItems+'</b><div class="footnote">Записей прогресса</div></div><div><b>'+l.brainPlays+'</b><div class="footnote">Игровых тренировок</div></div><div><b>'+l.fsrsCards+'</b><div class="footnote">Карточек FSRS</div></div><div><b>'+l.fsrsDue+'</b><div class="footnote">К повторению сейчас</div></div><div><b>'+l.fsrsReviews+'</b><div class="footnote">Повторений за период</div></div><div><b>'+(l.fsrsRetention===null?'—':l.fsrsRetention+'%')+'</b><div class="footnote">Успешное долговременное воспроизведение</div></div><div><b>'+(l.brainAvgScore===null?'—':l.brainAvgScore)+'</b><div class="footnote">Средний игровой балл</div></div></div></div>';
  html+='<div class="card mb-3"><div class="card-title">❤️ Здоровье и восстановление</div><div class="grid-2"><div><b>'+(h.sleepAvgHours===null?'Нет данных':h.sleepAvgHours+' ч')+'</b><div class="footnote">Средний сон по журналу</div></div><div><b>'+(h.moodAvg===null?'—':h.moodAvg+'/5')+'</b><div class="footnote">Среднее настроение</div></div><div><b>'+h.workouts+'</b><div class="footnote">Тренировок</div></div><div><b>'+h.meditation+'</b><div class="footnote">Медитаций</div></div><div><b>'+h.walks+'</b><div class="footnote">Прогулок</div></div><div><b>'+h.walkMinutes+' мин</b><div class="footnote">Ходьба</div></div><div><b>'+h.waterTotal+'</b><div class="footnote">Учтено воды (единицы журнала)</div></div><div><b>'+h.antistress+'</b><div class="footnote">Антистресс-записей</div></div></div><div class="footnote mt-2">Показатели отражают только внесённые данные и не являются медицинской диагностикой.</div></div>';
  html+='<div class="card mb-3"><div class="card-title">⏱ Экранное время и фокус</div><div class="grid-2"><div><b>'+f.screenMinutes+' мин</b><div class="footnote">Экран за период</div></div><div><b>'+(f.screenDailyAvg===null?'—':f.screenDailyAvg+' мин')+'</b><div class="footnote">Среднее по дням с записями</div></div><div><b>'+f.focusSessions+'</b><div class="footnote">Фокус-сессий/таймеров</div></div><div><b>'+f.focusMinutes+' мин</b><div class="footnote">Учтённая длительность</div></div><div><b>'+(f.energyAvg===null?'—':f.energyAvg+'/5')+'</b><div class="footnote">Энергия</div></div><div><b>'+(f.concentrationAvg===null?'—':f.concentrationAvg+'/5')+'</b><div class="footnote">Концентрация</div></div></div><div class="footnote mt-2">Экранное время вводится вручную: приложение не считывает его автоматически с Windows или Android.</div></div>';
  html+='<div class="card mb-3"><div class="card-title">🌐 Жизненные направления</div><div class="grid-2"><div><b>'+v.projectsDone+'/'+v.projects+'</b><div class="footnote">Проекты завершены</div></div><div><b>'+v.calendarDone+'/'+v.calendarEvents+'</b><div class="footnote">События выполнены</div></div><div><b>'+(v.sphereAverage===null?'—':v.sphereAverage+'/10')+'</b><div class="footnote">Средняя оценка сфер</div></div><div><b>'+v.visionLogs+'</b><div class="footnote">Записей зрения</div></div><div><b>'+v.memoryItems+'</b><div class="footnote">Элементов памяти/FSRS</div></div><div><b>'+v.detoxEntries+'</b><div class="footnote">Записей цифрового детокса</div></div><div><b>'+v.financeEntries+'</b><div class="footnote">Финансовых записей</div></div><div><b>'+v.financeNet.toLocaleString('ru-RU')+'</b><div class="footnote">Сальдо учтённых записей</div></div></div></div>';
  html+='<div class="card mb-3"><div class="card-title">📈 Динамика последних 30 дней</div>';
  a.daily.forEach(function(d){var width=Math.min(100,d.tasks*12);html+='<div class="row-between" style="gap:8px;margin:6px 0"><span class="footnote" style="width:78px">'+d.date.slice(5)+'</span><div style="flex:1;height:7px;background:var(--glass-2);border-radius:8px;overflow:hidden"><div style="height:100%;width:'+width+'%;background:var(--brand)"></div></div><span class="footnote" style="width:55px;text-align:right">'+d.tasks+' задач</span></div>';});
  html+='</div><div class="card mb-3"><div class="card-title">🧾 Полнота данных</div><div class="stat-value">'+c.percent+'%</div><div class="footnote">'+c.activeSections+' из '+c.totalTracked+' основных трекеров содержат данные. Пустой раздел — это «нет данных», а не нулевой результат.</div>';
  c.inventory.forEach(function(x){html+='<div class="list-row"><div class="list-body"><div class="list-title">'+esc(x.key)+'</div><div class="footnote">'+esc(x.type)+'</div></div><div class="list-value">'+x.count+'</div></div>';});
  html+='</div>';
  var jarvisStats=null;try{jarvisStats=getJarvisAnalytics(true);}catch(statsJarvisError){jarvisStats=null;}
  html+='<div class="card mb-3"><div class="row-between"><div class="card-title">✧ Анализ Джарвиса</div><span class="badge">'+(jarvisStats?jarvisStats.items.length+' сигналов':'недоступен')+'</span></div>';
  if(jarvisStats&&jarvisStats.items.length){jarvisStats.items.slice(0,5).forEach(function(item){html+='<div class="list-row" style="align-items:flex-start"><div class="list-body"><b>'+esc(item.title)+'</b><div class="footnote">'+esc(item.detail)+'</div><div class="footnote mt-1">'+esc(item.action)+'</div></div><button class="btn btn-ghost btn-xs" onclick="applyJarvisRecommendation(\''+item.id+'\')">Открыть</button></div>';});}
  else html+='<div class="footnote">По текущим записям нет сигналов для вмешательства. Если данных мало, Джарвис покажет это отдельно.</div>';
  html+='<button class="btn btn-primary btn-block mt-2" onclick="navigate(\'ai\')">Перейти к диалогу с Джарвисом →</button></div><button class="btn btn-ghost btn-block" onclick="exportDB()">📤 Экспортировать все данные</button></div>';
  document.getElementById('app').innerHTML=html;
}
function renderDetailedStats(){renderStats();}
function renderMore(){
  var groups = [
    {title:'🎯 Основное',items:[
      {key:'walks',emoji:'🚶',label:'Прогулки'},
      {key:'dashboard',emoji:'🏠',label:'Главная'},
      {key:'spheres',emoji:'🎯',label:'Сферы'},
      {key:'projects',emoji:'📁',label:'Проекты'},
      {key:'ai',emoji:'✧',label:'Джарвис'},
      {key:'coach',emoji:'💬',label:'AI-Коуч'},
      {key:'coachChat',emoji:'💭',label:'Чат с коучем'},
      {key:'schedule',emoji:'📅',label:'Расписание'},
      {key:'focus',emoji:'⏱',label:'Фокус'},
      {key:'eveningReview',emoji:'🌙',label:'Вечерний обзор'}
    ]},
    {title:'📊 Отчёты',items:[
      {key:'dailyReport',emoji:'📊',label:'Отчёт дня'},
      {key:'weeklyReview',emoji:'📈',label:'Итоги недели'},
      {key:'monthlyReview',emoji:'📆',label:'Итоги месяца'},
      {key:'achievements',emoji:'🏆',label:'Достижения'},
      {key:'stats',emoji:'📊',label:'Статистика'}
    ]},
    {title:'🎮 Геймификация',items:[
      {key:'gamesHub',emoji:'🎮',label:'Игры'},
      {key:'leagues',emoji:'🏅',label:'Лиги'},
      {key:'pet',emoji:'🥚',label:'Питомец'},
      {key:'fsrs',emoji:'🃏',label:'Карточки FSRS'}
    ]},
    {title:'🔄 Привычки и ум',items:[
      {key:'habitList',emoji:'🔄',label:'Привычки'},
      {key:'habitCatalog',emoji:'📚',label:'Каталог привычек'},
      {key:'brain',emoji:'🧠',label:'Тренировка ума'},
      {key:'antistress',emoji:'🌬',label:'Антистресс'},
      {key:'sleep',emoji:'😴',label:'Сон'},
      {key:'sleepCalendar',emoji:'📅',label:'Календарь сна'}
    ]},
    {title:'👁 Зрение',items:[
      {key:'vision',emoji:'👁',label:'Обзор'},
      {key:'vision60',emoji:'🤸',label:'Упражнения'},
      {key:'vision62',emoji:'🌟',label:'62-дневный путь'},
      {key:'visiontrack',emoji:'📊',label:'Трекер'},
      {key:'visiontips',emoji:'💡',label:'Советы'}
    ]},
    {title:'📱 Детокс',items:[
      {key:'detox',emoji:'🧘',label:'Детокс-хаб'},
      {key:'detox60',emoji:'🧹',label:'60-дневное очищение'},
      {key:'detoxcourse',emoji:'📱',label:'62-дневный детокс'},
      {key:'screentracker',emoji:'📊',label:'Трекер экрана'}
    ]},
    {title:'🎓 Обучение',items:[
      {key:'learning',emoji:'🎓',label:'Обучение'},
      {key:'levels',emoji:'🌱',label:'Уровни'},
      {key:'english',emoji:'🇬🇧',label:'English'},
      {key:'skills',emoji:'💎',label:'Навыки'},
      {key:'games',emoji:'🎮',label:'Игры-обучение'},
      {key:'materials',emoji:'📚',label:'Материалы'}
    ]},
    {title:'❤️ Здоровье',items:[
      {key:'health',emoji:'❤️',label:'Здоровье'},
      {key:'water',emoji:'💧',label:'Вода'},
      {key:'mood',emoji:'💭',label:'Настроение'}
    ]},
    {title:'🧠 Личные знания и интеграции',items:[
      {key:'obsidian',emoji:'🧠',label:'Второй мозг'},
      {key:'journal',emoji:'📔',label:'Личный дневник'},
      {key:'obsidianIntegration',emoji:'📓',label:'Obsidian Vault'},
      {key:'ai',emoji:'✦',label:'Gemini / OpenAI · Джарвис'},
      {key:'telegramSetup',emoji:'📨',label:'Telegram-коуч'}
    ]},
    {title:'⚙️ Система',items:[
      {key:'settings',emoji:'⚙️',label:'Настройки'},
      {key:'notifications',emoji:'🔔',label:'Уведомления'},
      {key:'profile',emoji:'👤',label:'Профиль'},
      {key:'storage',emoji:'🗄',label:'Хранилище'}
    ]}
  ];
  var html = '<div class="page"><div class="title-xl">Все разделы</div>';
  groups.forEach(function(g){
    html += '<div class="card"><h2>' + g.title + '</h2>';
    g.items.forEach(function(it){
      html += '<div class="list-row" onclick="navigate(\'' + it.key + '\')"><div class="list-icon">' + it.emoji + '</div><div class="list-body"><div class="list-title">' + it.label + '</div></div><div class="list-chevron">›</div></div>';
    });
    html += '</div>';
  });
  html += '</div>';
  document.getElementById('app').innerHTML = html;
}
function renderSettings(){
  var themes = window.THEMES || [];
  var currentTheme = themes.find(function(t){ return t.id === state.settings.theme; }) || {name:'dark'};
  var html = '<div class="page"><div class="title-xl">⚙️ Настройки</div>';
  html += '<div class="card"><h2>Профиль</h2><div class="field"><label class="field-label">Имя</label><input type="text" value="' + esc(state.profile.name||'') + '" onchange="saveProfileName(this.value)"/></div>';
  html += '<div class="list-row" onclick="openThemePicker()"><div class="list-icon">🎨</div><div class="list-body"><div class="list-title">Тема</div></div><div class="list-value">' + currentTheme.name + '</div></div></div>';
  html += renderPWAInstallBlock();
  html += '<div class="card"><h2>🎓 Обучение и развитие</h2><div class="footnote mb-2">Единый план на 30 дней с недельными целями, ежедневными уроками и отслеживанием прогресса.</div><button class="btn btn-primary btn-block" onclick="navigate(\'plan\')">Открыть план обучения и развития</button></div>';
  html += '<div class="card"><h2>Сохранение данных</h2><div class="footnote mb-2">Автосохранение выполняется при изменении данных. Здесь можно принудительно сохранить всё и обновить локальную резервную копию.</div><button class="btn btn-primary btn-block mb-2" onclick="manualSaveAll()">💾 Сохранить всё сейчас</button><div class="footnote">Последнее сохранение: '+(window.__LIFE_OS_LAST_SAVED?new Date(window.__LIFE_OS_LAST_SAVED).toLocaleString('ru-RU'):'при запуске приложения')+'</div></div>';
  html += '<div class="card"><h2>Резервные копии</h2>';
  html += '<button class="btn btn-primary btn-block mb-2" onclick="manualSaveAll()">💾 Сохранить и создать копию</button>';
  html += '<button class="btn btn-ghost btn-block mb-2" onclick="exportDB()">📤 Скачать JSON-копию</button>';
  html += '<button class="btn btn-ghost btn-block mb-2" onclick="importDB()">📥 Импорт JSON</button>';
  html += '<button class="btn btn-danger btn-block" onclick="resetAllWithConfirm()">🗑 Полный сброс</button>';
  html += '</div>';
  html += '<div class="footnote text-tertiary" style="text-align:center;">Life OS v' + CURRENT_VERSION + '</div></div>';
  document.getElementById('app').innerHTML = html;
}
function renderSettingsV2(){ renderSettings(); }
function renderProfile(){ renderProfileV2(); }
function renderProfileV2(){
  var p = state.profileV2 || {};
  var g = state.gamification || {};
  var html = '<div class="page"><div class="title-xl">👤 Профиль</div>';
  html += '<div class="profile-hero"><div class="avatar-btn" onclick="pickEmoji()" style="width:96px;height:96px;margin:0 auto 12px;font-size:48px;">' + state.profile.emoji + '</div>';
  html += '<div style="font-size:22px;font-weight:800;">' + esc(state.profile.name||'Пользователь') + '</div>';
  html += '<div class="footnote text-secondary">Уровень ' + (g.level||1) + ' · XP: ' + (g.xp||0) + '</div></div>';
  html += renderPWAInstallBlock();
  html += '<div class="card"><h2>📏 Данные</h2>';
  html += '<div class="field"><label class="field-label">Возраст</label><input type="number" id="pv-age" value="' + (p.age||'') + '"/></div>';
  html += '<div class="field"><label class="field-label">Рост (см)</label><input type="number" id="pv-height" value="' + (p.height||'') + '"/></div>';
  html += '<div class="field"><label class="field-label">Вес (кг)</label><input type="number" id="pv-weight" value="' + (p.weight||'') + '" step="0.1"/></div>';
  html += '<button class="btn btn-ghost btn-block" onclick="saveProfileV2()">💾 Сохранить</button>';
  html += '</div>';
  html += '<button class="btn btn-primary btn-block" onclick="navigate(\'achievements\')">🏆 Достижения</button>';
  html += '</div>';
  document.getElementById('app').innerHTML = html;
}
function saveProfileV2(){
  var p = state.profileV2;
  p.age = parseInt((document.getElementById('pv-age')||{}).value) || null;
  p.height = parseFloat((document.getElementById('pv-height')||{}).value) || null;
  p.weight = parseFloat((document.getElementById('pv-weight')||{}).value) || null;
  p.updatedAt = nowISO();
  save();
  toast('✓','success');
}
function pickEmoji(){
  var emojis = ['😊','😎','🤓','🧑‍💻','👨‍💼','👩‍💼','🦊','🐱','🐶','🦁','🐼','🦉','🌟','⚡','🔥','💎','🚀','🎯','🧠','💪','🌈','☕','🎨','🎮','🎧','📚','🏃','🧘','🍀','🌸'];
  var html = '<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:8px;">';
  emojis.forEach(function(e){
    html += '<button onclick="setEmoji(\'' + e + '\')" style="aspect-ratio:1;border-radius:14px;background:var(--glass-2);font-size:26px;cursor:pointer;border:2px solid ' + (e === state.profile.emoji ? 'var(--brand)' : 'transparent') + ';">' + e + '</button>';
  });
  html += '</div>';
  openSheet('Аватар', html);
}
function setEmoji(e){
  state.profile.emoji = e;
  save();
  closeSheet();
  toast('✓','success');
  updateHeader();
  renderProfileV2();
}
function saveProfileName(name){
  state.profile.name = (name||'').trim() || 'Пользователь';
  save();
  toast('Сохранено','success');
  updateHeader();
}

/* ============ ЭКСПОРТ / ИМПОРТ ============ */
function exportDB(){
  try{
    var payload={format:'life-os-backup',version:CURRENT_VERSION,exportedAt:nowISO(),data:state};
    var blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
    var url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download='life-os-backup-'+today()+'.json';
    document.body.appendChild(a);a.click();a.remove();
    setTimeout(function(){URL.revokeObjectURL(url);},1500);
    toast('Резервная копия скачана','success');
  }catch(e){console.error('[EXPORT]',e);toast('Не удалось создать резервную копию','error');}
}
function importDB(){
  var input=document.createElement('input');input.type='file';input.accept='.json,application/json';
  input.onchange=function(e){
    var file=e.target.files&&e.target.files[0];if(!file)return;
    if(file.size>15*1024*1024){toast('Файл слишком большой (лимит 15 МБ)','error');return;}
    var reader=new FileReader();
    reader.onload=function(){
      try{
        var parsed=JSON.parse(reader.result);
        var imported=parsed&&parsed.format==='life-os-backup'?parsed.data:parsed;
        if(!imported||typeof imported!=='object'||Array.isArray(imported)||(!imported.settings&&!imported.profile&&!imported.tasks))throw new Error('Неверный формат резервной копии');
        var merged=migrateState(deepMerge(defaultState(),imported));
        var serialized=JSON.stringify(merged);
        backupStorage();
        localStorage.setItem(STORAGE_KEY,serialized);
        toast('Данные восстановлены. Перезапускаю…','success');
        setTimeout(function(){location.reload();},800);
      }catch(err){console.error('[IMPORT]',err);toast('Файл повреждён или не является копией Life OS','error',4000);}
    };
    reader.onerror=function(){toast('Не удалось прочитать файл','error');};
    reader.readAsText(file);
  };
  input.click();
}
function resetAllWithConfirm(){
  if(!confirm('Удалить ВСЕ данные?')) return;
  if(!confirm('Точно?')) return;
  backupStorage();
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

/* ============ ЗАГЛУШКИ ============ */
function renderStub(title){
  if(title==='Раздел'&&window.__wsCurrentTitle)title=window.__wsCurrentTitle;else window.__wsCurrentTitle=title;
  var id=currentPage||'workspace';
  if(!state.workspaces)state.workspaces={};
  if(!Array.isArray(state.workspaces[id]))state.workspaces[id]=[];
  var rows=state.workspaces[id],finance=id==='finance',q=(window.__wsQuery||'').toLowerCase();
  var visible=rows.filter(function(r){return (r.title+' '+(r.note||'')+' '+(r.category||'')).toLowerCase().indexOf(q)>=0;});
  var sum=rows.reduce(function(n,r){return n+(Number(r.amount)||0);},0);
  var html='<div class="page workspace-page"><div class="row-between"><div><div class="title-xl">'+esc(title)+'</div><div class="subtitle">Рабочее пространство · данные сохраняются на устройстве</div></div><button class="btn btn-ghost btn-sm" onclick="navigate(\'more\')">Разделы</button></div>';
  html+='<div class="grid-2 mb-3"><div class="card"><div class="stat-value">'+rows.length+'</div><div class="stat-label">Записей</div></div><div class="card"><div class="stat-value">'+(finance?sum.toLocaleString('ru-RU'):rows.filter(function(r){return r.done;}).length)+'</div><div class="stat-label">'+(finance?'Баланс':'Выполнено')+'</div></div></div>';
  if(finance)html+='<div class="card mb-3"><div class="footnote">Доходы указывай положительным числом, расходы — отрицательным. Это локальный учёт, не банковская интеграция.</div></div>';
  html+='<div class="card mb-3"><div class="card-title">＋ Новая запись</div><div class="field"><label class="field-label">Название</label><input id="wsTitle" maxlength="160" placeholder="Добавить запись..."></div><div class="field"><label class="field-label">Категория</label><select id="wsCategory"><option>Личное</option><option>Работа</option><option>Обучение</option><option>Здоровье</option><option>Идея</option><option>Важно</option></select></div><div class="field"><label class="field-label">Подробности</label><textarea id="wsNote" maxlength="2000" placeholder="Описание, вывод или следующий шаг"></textarea></div>';
  if(finance)html+='<div class="field"><label class="field-label">Сумма (+ доход / − расход)</label><input id="wsAmount" type="number" step="0.01" placeholder="0"></div>';
  html+='<button class="btn btn-primary btn-block" onclick="addWorkspaceEntry()">Сохранить</button></div>';
  html+='<div class="row-between mb-2"><div class="section-title" style="margin:0">Мои записи</div><input type="search" style="max-width:48%" placeholder="Поиск" value="'+esc(window.__wsQuery||'')+'" oninput="window.__wsQuery=this.value;filterWorkspaceEntries(this.value)"></div>';
  if(!visible.length)html+='<div class="card empty"><div class="empty-icon">📌</div><div class="empty-title">'+(rows.length?'Ничего не найдено':'Пока нет записей')+'</div><div class="empty-text">Добавь первую запись — она появится здесь.</div></div>';
  visible.slice().reverse().forEach(function(r){html+='<div class="card workspace-entry" data-search="'+esc((r.title+' '+(r.note||'')+' '+(r.category||'')).toLowerCase())+'"><div class="row-between"><b>'+esc(r.title)+'</b><span class="footnote">'+esc(r.category||'')+'</span></div>'+(r.note?'<div class="footnote mt-2">'+esc(r.note)+'</div>':'')+(finance?'<div class="stat-value mt-2">'+Number(r.amount||0).toLocaleString('ru-RU')+'</div>':'')+'<div class="btn-row mt-2"><button class="btn btn-ghost btn-xs" onclick="toggleWorkspaceEntry(\''+r.id+'\')">'+(r.done?'↩ Вернуть':'✓ Выполнено')+'</button><button class="btn btn-ghost btn-xs" onclick="deleteWorkspaceEntry(\''+r.id+'\')">Удалить</button></div></div>';});
  html+='<div class="footnote text-tertiary text-center mt-3">Записи входят в резервную копию Life OS.</div></div>';
  document.getElementById('app').innerHTML=html;
}
function filterWorkspaceEntries(query){
  var q=String(query||'').toLowerCase();
  document.querySelectorAll('#app .workspace-entry').forEach(function(el){el.style.display=(el.getAttribute('data-search')||'').indexOf(q)>=0?'':'none';});
}
function addWorkspaceEntry(){
  var t=document.getElementById('wsTitle'),n=document.getElementById('wsNote'),c=document.getElementById('wsCategory');
  if(!t||!t.value.trim())return toast('Укажи название записи','warning');
  if(!state.workspaces)state.workspaces={};if(!Array.isArray(state.workspaces[currentPage]))state.workspaces[currentPage]=[];
  state.workspaces[currentPage].push({id:uid(),title:t.value.trim(),note:n?n.value.trim():'',category:c?c.value:'',amount:Number((document.getElementById('wsAmount')||{}).value)||0,done:false,createdAt:nowISO()});
  save();haptic('success');window.__wsQuery='';renderStub('Раздел');toast('Запись сохранена','success');
}
function toggleWorkspaceEntry(id){
  var r=(state.workspaces&&state.workspaces[currentPage]||[]).find(function(x){return x.id===id;});if(!r)return;r.done=!r.done;save();renderStub('Раздел');
}
function deleteWorkspaceEntry(id){
  if(!confirm('Удалить запись?'))return;
  if(state.workspaces&&Array.isArray(state.workspaces[currentPage]))state.workspaces[currentPage]=state.workspaces[currentPage].filter(function(x){return x.id!==id;});
  save();renderStub('Раздел');toast('Запись удалена','success');
}
function getMemoryTrainingData(){
  if(!state.memoryTraining||typeof state.memoryTraining!=='object')state.memoryTraining={sessions:[],bestSpan:0};
  if(!Array.isArray(state.memoryTraining.sessions))state.memoryTraining.sessions=[];
  if(!Number.isFinite(Number(state.memoryTraining.bestSpan)))state.memoryTraining.bestSpan=0;
  return state.memoryTraining;
}
function getMemoryTrainingMetrics(){
  var d=getMemoryTrainingData(),rows=d.sessions,by=function(type){return rows.filter(function(x){return x.type===type||(type==='working'&&x.type==='digits')||(type==='short'&&x.type==='words');});};
  var avg=function(list,key){var v=list.map(function(x){return Number(x[key]);}).filter(function(n){return Number.isFinite(n)&&n>=0;});return v.length?Math.round(v.reduce(function(a,b){return a+b;},0)/v.length*10)/10:null;};
  var accuracy=function(list){return list.length?Math.round(list.reduce(function(n,x){return n+(Number(x.accuracy)||Math.round((Number(x.score)||0)/Math.max(1,Number(x.length)||1)*100));},0)/list.length):null;};
  var fsrs=state.fsrs||{},cards=fsrs.cards||{},reviews=Array.isArray(fsrs.reviews)?fsrs.reviews:[];
  var due=Object.keys(cards).filter(function(id){var c=cards[id];return !c.nextReview||new Date(c.nextReview)<=new Date();}).length;
  var intervals=reviews.map(function(x){return Number(x.intervalDays||x.scheduledDays||x.interval)||0;}).filter(function(x){return x>0;}),longTermReviews=reviews.filter(function(x){return Number(x.rating)>=1&&Number(x.rating)<=4;}),longTermAccuracy=longTermReviews.length?Math.round(longTermReviews.filter(function(x){return Number(x.rating)>=2;}).length/longTermReviews.length*100):null;
  return {total:rows.length,working:by('working'),short:by('short'),workingAccuracy:accuracy(by('working')),shortAccuracy:accuracy(by('short')),workingSpeed:avg(by('working'),'seconds'),shortSpeed:avg(by('short'),'seconds'),shortRetention:avg(by('short'),'retentionDelaySeconds'),longTermReviews:longTermReviews.length,longTermAccuracy:longTermAccuracy,workingSpan:Math.max(0,...by('working').map(function(x){return Number(x.score)||0;})),shortSpan:Math.max(0,...by('short').map(function(x){return Number(x.score)||0;})),bestSpan:d.bestSpan||0,fsrsDue:due,fsrsReviews:reviews.length,longestInterval:intervals.length?Math.max.apply(null,intervals):null};
}
function renderMemory(){
  var data=getMemoryTrainingData(),m=getMemoryTrainingMetrics(),todaySessions=data.sessions.filter(function(x){return String(x.at||'').slice(0,10)===today();});
  var html='<div class="page"><div class="title-xl">🧠 Развитие памяти</div><div class="subtitle">Отдельно тренируем рабочую и кратковременную память; долговременное сохранение поддерживаем активным воспроизведением и интервальными повторениями. Метрики показывают твои результаты, а не медицинскую норму.</div>';
  html+='<div class="grid-2 mb-3"><div class="card"><div class="stat-value">'+m.total+'</div><div class="stat-label">Всего тренировок</div></div><div class="card"><div class="stat-value">'+todaySessions.length+'</div><div class="stat-label">Сегодня</div></div><div class="card"><div class="stat-value">'+(m.workingAccuracy===null?'—':m.workingAccuracy+'%')+'</div><div class="stat-label">Точность рабочей памяти</div></div><div class="card"><div class="stat-value">'+(m.shortAccuracy===null?'—':m.shortAccuracy+'%')+'</div><div class="stat-label">Точность кратковременной</div></div></div>';
  html+='<div class="card mb-3"><div class="card-title">📈 Что измеряем</div><div class="grid-2"><div><b>'+m.workingSpan+'</b><div class="footnote">Лучший объём · рабочая память</div></div><div><b>'+m.shortSpan+'</b><div class="footnote">Лучший объём · кратковременная</div></div><div><b>'+m.bestSpan+'</b><div class="footnote">Общий рекорд воспроизведения</div></div><div><b>'+(m.workingSpeed===null?'—':m.workingSpeed+' сек')+'</b><div class="footnote">Среднее время ответа · рабочая</div></div><div><b>'+(m.shortSpeed===null?'—':m.shortSpeed+' сек')+'</b><div class="footnote">Среднее время ответа · кратковременная</div></div><div><b>'+(m.shortRetention===null?'—':m.shortRetention+' сек')+'</b><div class="footnote">Интервал удержания перед ответом</div></div><div><b>'+(m.longTermAccuracy===null?'—':m.longTermAccuracy+'%')+'</b><div class="footnote">Успешное долговременное воспроизведение</div></div><div><b>'+m.longTermReviews+'</b><div class="footnote">Проверок долговременной памяти</div></div><div><b>'+(m.longestInterval===null?'—':m.longestInterval+' дн.')+'</b><div class="footnote">Максимальный интервал FSRS</div></div></div><p class="footnote mt-2">Кратковременное удержание проверяется после 5-секундного показа. Долговременное — по повторениям и интервалам FSRS. Для честной динамики сравнивай серии похожих заданий, а не единичный рекорд.</p></div>';
  html+='<div class="section-title">Ежедневный план · 10 минут</div><div class="card mb-2"><b>1. Рабочая память · 3 минуты</b><p class="footnote mt-1">Удержи последовательность цифр и воспроизведи её в обратном порядке. Это тренировка удержания и мысленного преобразования информации.</p><button class="btn btn-primary btn-block" onclick="startMemoryExercise(\'working\')">Начать рабочую память</button></div>';
  html+='<div class="card mb-2"><b>2. Кратковременная память · 3 минуты</b><p class="footnote mt-1">Запомни набор слов, затем воспроизведи его без подсказки. Измеряются точность, объём и время ответа.</p><button class="btn btn-primary btn-block" onclick="startMemoryExercise(\'short\')">Начать кратковременную память</button></div>';
  html+='<div class="card mb-3"><b>3. Долговременная память · 4 минуты</b><p class="footnote mt-1">Повтори карточки с активным вспоминанием. FSRS планирует следующие интервалы с учётом твоих оценок.</p><div class="row-between mt-2"><span class="footnote">'+m.fsrsDue+' карточек к повторению · '+m.fsrsReviews+' повторений в истории</span><button class="btn btn-primary btn-sm" onclick="navigate(\'fsrs\')">Открыть FSRS</button></div></div>';
  html+='<div class="card mb-3"><div class="card-title">История последних тренировок</div>';
  if(!data.sessions.length)html+='<div class="empty"><div class="empty-title">Начни с первого упражнения</div><div class="footnote">После тренировок появятся скорость, точность и динамика объёма.</div></div>';
  else data.sessions.slice(-12).reverse().forEach(function(x){var label=x.type==='working'||x.type==='digits'?'Рабочая память':'Кратковременная память';html+='<div class="list-row"><div class="list-body"><b>'+label+'</b><div class="footnote">'+new Date(x.at).toLocaleString('ru-RU')+' · '+(x.seconds||'—')+' сек</div></div><div><b>'+Math.round((Number(x.accuracy)||0))+'%</b><div class="footnote">'+x.score+'/'+x.length+'</div></div></div>';});
  html+='</div><button class="btn btn-ghost btn-block" onclick="navigate(\'learning\')">← К обучению</button></div>';
  document.getElementById('app').innerHTML=html;
}
function startMemoryExercise(type){
  var data=getMemoryTrainingData(),mode=type==='digits'?'working':type==='words'?'short':(type==='working'?'working':'short');
  var prior=data.sessions.filter(function(x){return x.type===mode;}).slice(-12),accuracy=prior.length?prior.reduce(function(n,x){return n+(Number(x.accuracy)||0);},0)/prior.length:70;
  var level=Math.max(3,Math.min(10,4+Math.floor(prior.length/4)+(accuracy>85?1:0)-(accuracy<45?1:0)));
  var digitPool='4839172605',wordPool=['облако','река','компас','лампа','сосна','мост','книга','песок','звезда','ключ','яблоко','поезд','фонарь','парус','гранит','малина'];
  var items=[];
  for(var i=0;i<level;i++){if(mode==='working')items.push(digitPool[Math.floor(Math.random()*digitPool.length)]);else{var candidate=wordPool[Math.floor(Math.random()*wordPool.length)];while(items.indexOf(candidate)>=0)candidate=wordPool[Math.floor(Math.random()*wordPool.length)];items.push(candidate);}}
  var retentionDelaySeconds=prior.length>=8&&accuracy>=80?30:prior.length>=4&&accuracy>=70?15:5;
  var challenge={id:uid(),type:mode,items:items,startedAt:Date.now(),retentionDelaySeconds:retentionDelaySeconds};
  window.__memoryChallenge=challenge;
  openSheet(mode==='working'?'⚡ Рабочая память':'📝 Кратковременная память','<div class="text-center" style="padding:24px 8px"><div class="title-xl" style="letter-spacing:3px">'+items.join(' · ')+'</div><div class="footnote mt-3">'+(mode==='working'?'Запомни порядок. Затем введи цифры в обратной последовательности.':'Запомни слова и их порядок.')+'</div><div class="footnote mt-2">Через '+challenge.retentionDelaySeconds+' секунд последовательность исчезнет.</div></div>');
  setTimeout(function(){if(!window.__memoryChallenge||window.__memoryChallenge.id!==challenge.id)return;var hint=mode==='working'?'Введи цифры в обратном порядке':'Введи слова через пробел';openSheet('Воспроизведи без подсказки','<div class="form-group"><input id="memoryAnswer" class="input" autocomplete="off" placeholder="'+hint+'"></div><button class="btn btn-primary btn-block" onclick="submitMemoryAnswer()">Проверить</button>');var input=document.getElementById('memoryAnswer');if(input)input.focus();},challenge.retentionDelaySeconds*1000);
}
function submitMemoryAnswer(){
  var challenge=window.__memoryChallenge,input=document.getElementById('memoryAnswer');if(!challenge||!input)return;
  var answer=String(input.value||'').trim().toLowerCase(),expectedItems=challenge.type==='working'?challenge.items.slice().reverse():challenge.items;
  var normalized=challenge.type==='working'?answer.replace(/[^0-9]/g,''):answer.replace(/[.,;]+/g,' ').replace(/\s+/g,' ').trim();
  var supplied=challenge.type==='working'?normalized.split(''):normalized.split(' ').filter(Boolean),score=0;
  expectedItems.forEach(function(item,index){if(supplied[index]===item)score++;});
  var correct=normalized===expectedItems.join(challenge.type==='working'?'':' '),duration=Math.max(1,Math.round((Date.now()-challenge.startedAt-challenge.retentionDelaySeconds*1000)/1000)),accuracy=Math.round(score/Math.max(1,challenge.items.length)*100);
  var data=getMemoryTrainingData();data.sessions.push({id:challenge.id,type:challenge.type,at:nowISO(),correct:correct,score:score,length:challenge.items.length,accuracy:accuracy,seconds:duration,retentionDelaySeconds:challenge.retentionDelaySeconds,order:challenge.type==='working'?'reverse':'forward'});
  if(data.sessions.length>500)data.sessions=data.sessions.slice(-500);
  data.bestSpan=Math.max(data.bestSpan||0,score);save();window.__memoryChallenge=null;closeSheet();
  openSheet(correct?'✅ Отлично!':'📊 Результат','<div class="text-center"><div class="title-xl">'+score+' / '+challenge.items.length+' · '+accuracy+'%</div><div class="footnote">'+(correct?'Вся последовательность воспроизведена верно.':'Посмотри, какие позиции удалось вспомнить. Следующий уровень подстроится под результаты.')+'</div><div class="footnote mt-2">Время ответа: '+duration+' сек. · удержание: '+challenge.retentionDelaySeconds+' сек.</div><button class="btn btn-primary btn-block mt-3" onclick="closeSheet();renderMemory()">Продолжить</button></div>');
}

function renderIQ(){ renderStub('🎯 IQ'); }
function renderEQ(){ renderStub('❤️ EQ'); }
function renderFinance(){ renderStub('💰 Финансы'); }
function renderNeuro(){ renderStub('🔬 Нейро'); }
function renderPsychology(){ renderStub('🧠 Психология'); }
function renderThinking(){ renderStub('💡 Мышление'); }
function renderEtiquette(){ renderStub('🎩 Этикет'); }
function renderHormones(){ renderStub('🧬 Гормоны'); }
function renderWealth(){ renderStub('💰 Богатство'); }
function renderPlanning(){ navigate('schedule'); }
function renderPlanToday(){ navigate('schedule'); }
function renderPlanWeek(){ navigate('weeklyReview'); }
function renderPlanMonth(){ navigate('monthlyReview'); }
function renderObsidian(){ renderObsidianIntegration(); }
function renderProjectEditor(){ renderStub('✏️ Редактор проекта'); }
function renderModuleDetail(){ renderStub('📖 Модуль курса'); }
function renderAI(){ renderJarvis(); }
function renderFocus(){ renderJarvis(); }
function getJarvisState(){
  if(!state.jarvis)state.jarvis={messages:[],checkins:[],focus:null,mode:'balanced',focusDefault:25};
  if(!Array.isArray(state.jarvis.messages))state.jarvis.messages=[];
  if(!Array.isArray(state.jarvis.checkins))state.jarvis.checkins=[];
  if(!state.jarvis.mode)state.jarvis.mode='balanced';
  if(!Number.isFinite(Number(state.jarvis.focusDefault)))state.jarvis.focusDefault=25;
  if(typeof state.jarvis.autopilotEnabled!=='boolean')state.jarvis.autopilotEnabled=false;
  if(!Array.isArray(state.jarvis.autopilotLog))state.jarvis.autopilotLog=[];
  if(!state.jarvis.dailyPlan)state.jarvis.dailyPlan=null;
  return state.jarvis;
}
function renderJarvis(){
  var data=getJarvisState(),tasks=state.tasks||[],pending=tasks.filter(function(t){return t.status!=='completed';});
  var analysis=getJarvisAnalytics(true),stats=analysis.analytics||getSafeLifeStats(LIFE_STATS_PERIOD);
  if(!data.dailyPlan||data.dailyPlan.date!==today()||(data.autopilotEnabled&&(!data.lastAutopilotAt||Date.now()-new Date(data.lastAutopilotAt).getTime()>3600000))){analysis=runJarvisAutopilot(true);stats=analysis.analytics;}
  var focus=data.focus,remaining=focus&&focus.active?Math.max(0,Math.ceil((focus.endsAt-Date.now())/1000)):0;
  var modes=[['balanced','Баланс'],['planner','Планировщик'],['coach','Коуч'],['strict','Строгий']];
  var html='<div class="page jarvis-page">';
  html+='<div class="jarvis-hero"><div class="jarvis-orb"><span>J</span><i></i></div><div class="jarvis-hero-copy"><div class="jarvis-kicker">LIFE OS · PERSONAL ASSISTANT</div><div class="title-xl">Джарвис</div><div class="jarvis-status"><span class="jarvis-dot"></span> '+(data.cloudAIEnabled?'ИИ включён · контекст LIFEOS':'Локальный режим · '+(window.LifeOSJarvisCore?'команды готовы':'базовый режим'))+'</div></div></div>';
  html+='<div class="grid-2 mb-3"><div class="card"><div class="stat-value">'+pending.length+'</div><div class="stat-label">Активные задачи</div></div><div class="card"><div class="stat-value">'+((state.stats||{}).streak||0)+'</div><div class="stat-label">Дней активности</div></div></div>';
  html+='<div class="card jarvis-settings-card mb-3"><div class="row-between"><b>🧭 Автопилот по статистике</b><label class="row" style="gap:7px"><input type="checkbox" '+(data.autopilotEnabled?'checked':'')+' onchange="setJarvisAutopilot(this.checked)"> <span class="footnote">Включён</span></label></div><div class="footnote mt-2">Джарвис анализирует реальные записи всех разделов, формирует план и при включении автоматически адаптирует только длительность фокуса. Задачи, финансы, здоровье и личные данные без подтверждения не меняет.</div><div class="grid-2 mt-2"><div><b>'+stats.overview.tasksPending+'</b><div class="footnote">Активные задачи</div></div><div><b>'+(stats.focus.screenDailyAvg===null?'—':stats.focus.screenDailyAvg+' мин')+'</b><div class="footnote">Экран/день</div></div><div><b>'+stats.coverage.percent+'%</b><div class="footnote">Полнота данных</div></div><div><b>'+stats.learning.fsrsDue+'</b><div class="footnote">Повторений ждут</div></div></div><div class="row-between mt-2"><span class="footnote">Период анализа: '+esc(analysis.period)+'</span><button class="btn btn-ghost btn-xs" onclick="runJarvisAutopilot(false);renderJarvis()">↻ Пересчитать</button></div>'+(data.dailyPlan&&data.dailyPlan.tasks&&data.dailyPlan.tasks.length?'<div class="footnote mt-2"><b>Приоритеты на сегодня:</b><br>'+data.dailyPlan.tasks.map(function(t,i){return (i+1)+'. '+esc(t.title);}).join('<br>')+'</div>':'<div class="footnote mt-2">План на сегодня: выбери одну важную задачу и начни с короткого фокус-блока.</div>')+'</div>';
  html+='<div class="card jarvis-settings-card mb-3"><div class="field"><label class="field-label">AI-провайдер</label><select id="jarvisProvider" onchange="setJarvisProvider(this.value)"><option value="openai" '+((data.provider||'openai')==='openai'?'selected':'')+'>OpenAI</option><option value="gemini" '+(data.provider==='gemini'?'selected':'')+'>Google Gemini</option></select><div class="footnote">Для выбранной модели нужен соответствующий серверный ключ.</div></div><div class="field"><label class="field-label">URL AI-сервера</label><input type="url" id="jarvisApiUrl" autocomplete="off" value="'+esc(data.apiUrl||'')+'" placeholder="https://...workers.dev" onchange="setJarvisApiUrl(this.value)"></div><div class="field"><label class="field-label">Код доступа к AI-серверу</label><input type="password" id="jarvisAccessCode" autocomplete="off" value="'+esc(data.accessCode||'')+'" placeholder="Введи код, заданный в Cloudflare" onchange="setJarvisAccessCode(this.value)"></div><div class="footnote mt-2">Модель выбирается на защищённом Worker через OPENAI_MODEL или GEMINI_MODEL. Секреты не хранятся в браузере.</div><div class="row-between"><b>🤖 Разговорный ИИ</b><label class="row" style="gap:7px"><input type="checkbox" '+(data.cloudAIEnabled?'checked':'')+' onchange="setJarvisCloudAI(this.checked)"><span class="footnote">Подключён</span></label></div><div class="footnote mt-2">При включении сообщение, недавний диалог и сводка LIFEOS (задачи, привычки, сон, вода, настроение, зрение, дневник, календарь, экранное время, антистресс, питомец, второй мозг и месячные итоги финансов) отправляются выбранному AI-провайдеру. Ключ хранится только на сервере, не в браузере. Без настройки серверного ключа работает локальный помощник.</div></div>';
  html+='<div class="card jarvis-settings-card mb-3"><div class="row-between"><b>Режим помощника</b><span class="footnote">Меняется в любой момент</span></div><div class="jarvis-mode-row">';
  modes.forEach(function(m){html+='<button class="jarvis-mode '+(data.mode===m[0]?'active':'')+'" onclick="setJarvisMode(\''+m[0]+'\')">'+m[1]+'</button>';});
  html+='</div><div class="row-between mt-2"><label class="footnote" for="jarvisFocusDefault">Длительность фокуса по умолчанию</label><select id="jarvisFocusDefault" onchange="setJarvisFocusDefault(this.value)"><option value="15" '+(Number(data.focusDefault)===15?'selected':'')+'>15 минут</option><option value="25" '+(Number(data.focusDefault)===25?'selected':'')+'>25 минут</option><option value="45" '+(Number(data.focusDefault)===45?'selected':'')+'>45 минут</option><option value="50" '+(Number(data.focusDefault)===50?'selected':'')+'>50 минут</option></select></div></div>';
  if(focus&&focus.active)html+='<div class="card jarvis-focus mb-3"><div class="row-between"><b>⏱ Фокус-сессия</b><span id="jarvisCountdown">'+Math.floor(remaining/60)+':'+String(remaining%60).padStart(2,'0')+'</span></div><div class="footnote mt-2">Сосредоточься на одной задаче. После сессии — короткий перерыв.</div><button class="btn btn-ghost btn-sm mt-2" onclick="stopJarvisFocus()">Завершить сессию</button></div>';
  html+='<div class="jarvis-quick"><button class="jarvis-chip" onclick="jarvisQuick(\'сводка\')">◷ Мой день</button><button class="jarvis-chip" onclick="jarvisQuick(\'покажи мои задачи\')">▤ Задачи</button><button class="jarvis-chip" onclick="jarvisQuick(\'фокус\')">◎ Фокус</button><button class="jarvis-chip" onclick="jarvisQuick(\'открой память\')">🧠 Память</button><button class="jarvis-chip" onclick="jarvisQuick(\'помощь\')">⌘ Команды</button></div>';
  html+='<div class="card jarvis-chat-card"><div class="row-between mb-2"><div class="card-title">Диалог</div><div class="row"><button class="btn btn-ghost btn-xs" onclick="speakJarvisLast()">🔊</button><button class="btn btn-ghost btn-xs" onclick="clearJarvisChat()">Очистить</button></div></div><div class="jarvis-messages" id="jarvisMessages">';
  if(!data.messages.length)html+='<div class="jarvis-message bot"><b>Джарвис</b><p>Готов помогать с задачами, планом, фокусом и обучением. Выбери режим, напиши команду или используй быстрые действия. В офлайн-режиме доступны локальные функции; генеративный ИИ требует отдельного подключения.</p></div>';
  data.messages.slice(-60).forEach(function(m){html+='<div class="jarvis-message '+(m.role==='user'?'user':'bot')+'"><b>'+(m.role==='user'?'Ты':'Джарвис')+'</b><p>'+esc(m.text).replace(/\n/g,'<br>')+'</p></div>';});
  html+='</div><div class="jarvis-compose"><input id="jarvisInput" type="text" maxlength="1000" autocomplete="off" placeholder="Например: добавь задачу — подготовить план" onkeydown="if(event.key===\'Enter\'){event.preventDefault();sendJarvisMessage();}"><button class="btn btn-primary" onclick="sendJarvisMessage()" aria-label="Отправить">➤</button><button class="btn btn-ghost" onclick="startJarvisVoice()" title="Голосовой ввод">🎙</button></div></div>';
  html+='<div class="section-title mt-3">Решения Джарвиса</div><div class="card mb-3">';
  analysis.items.forEach(function(item){var color=item.level==='high'?'#e06a62':item.level==='good'?'#35b77b':'var(--brand)';html+='<div class="list-row" style="align-items:flex-start"><div style="width:8px;height:8px;border-radius:50%;background:'+color+';margin-top:7px;flex-shrink:0"></div><div class="list-body"><div class="list-title">'+esc(item.title)+'</div><div class="footnote">'+esc(item.detail)+'</div><div class="footnote mt-1">'+esc(item.action)+'</div></div><button class="btn btn-ghost btn-xs" onclick="applyJarvisRecommendation(\''+item.id+'\')">Применить</button></div>';});
  html+='<button class="btn btn-ghost btn-block mt-2" onclick="navigate(\'detailedStats\')">Открыть полную статистику →</button></div>';
  html+='<div class="section-title mt-3">Инструменты</div><div class="grid-2"><button class="card jarvis-tool" onclick="jarvisQuick(\'самооценка\')">📋 Самооценка<br><small>Дневной срез состояния</small></button><button class="card jarvis-tool" onclick="jarvisQuick(\'методики\')">🧪 Методики<br><small>Практики с источниками</small></button><button class="card jarvis-tool" onclick="navigate(\'fsrs\')">🧠 Повторение<br><small>Карточки и FSRS</small></button><button class="card jarvis-tool" onclick="navigate(\'diagnostic\')">🛠 Диагностика<br><small>Проверка приложения</small></button><button class="card jarvis-tool" onclick="renderJarvisAIProviders()">🤖 Каталог ИИ<br><small>Популярные помощники</small></button></div>';
  if(data.checkins.length){var recent=data.checkins.slice(-7);var avg=function(k){return (recent.reduce(function(n,x){return n+(Number(x[k])||0);},0)/recent.length).toFixed(1);};html+='<div class="card mt-3"><div class="card-title">Самооценка · последние '+recent.length+' записей</div><div class="grid-2"><div class="footnote">Энергия <b>'+avg('energy')+'/5</b></div><div class="footnote">Фокус <b>'+avg('focus')+'/5</b></div><div class="footnote">Сон <b>'+avg('sleep')+'/5</b></div><div class="footnote">Стресс <b>'+avg('stress')+'/5</b></div></div><div class="footnote mt-2">Личный трекер, не клинический тест.</div></div>';}
  html+='<div class="card mt-3"><div class="card-title">Возможности и ограничения</div><p class="footnote">Офлайн: задачи, переходы, таймер, история и самооценка. Голос зависит от браузера и разрешений. Для свободных ответов уровня ChatGPT нужен подключённый ИИ-сервис и безопасное хранение ключа на сервере.</p></div></div>';
  document.getElementById('app').innerHTML=html;
  var box=document.getElementById('jarvisMessages');if(box)box.scrollTop=box.scrollHeight;
  if(focus&&focus.active)startJarvisTicker();
}
function jarvisAddMessage(role,text){
  var d=getJarvisState();d.messages.push({role:role,text:String(text||'').slice(0,3000),at:nowISO()});
  if(d.messages.length>160)d.messages=d.messages.slice(-160);save();
}
function buildJarvisAppContext(){
 if(window.ensureLifeOSBrain){try{window.ensureLifeOSBrain();}catch(e){}}
 var a=getSafeLifeStats(30)||{};
 var date=today(),tasks=(state.tasks||[]).filter(function(t){return t.status!=='completed';}),habits=[];
 try{habits=getHabitsForToday().map(function(h){return {title:h.title||getHabitTemplate(h.templateId)&&getHabitTemplate(h.templateId).title||'Привычка',done:isHabitDoneToday(h.id)};});}catch(e){}
 var water=(state.customWater||[]).find(function(x){return x.date===date;}),mood=(state.customMood||[]).find(function(x){return x.date===date;}),sleep=(state.sleepEntries||[]).slice().sort(function(x,y){return String(y.date).localeCompare(String(x.date));})[0]||null,vm=state.vision&&state.vision.metrics&&state.vision.metrics[date]||{};
 var journal=(state.journalEntries||[]).filter(function(x){return x.date===date;})[0]||null;
 var events=(state.calendarEvents||[]).filter(function(x){return x.date===date&&!x.done;}).slice(0,8).map(function(x){return {title:x.title,time:x.time||null,category:x.category||null};});
 var screen=(state.screenEntries||[]).filter(function(x){return String(x.date||'').slice(0,10)===date;}).reduce(function(n,x){return n+(Number(x.minutes)||0);},0);
 var stress=(state.antistressEntries||[]).slice(-3).map(function(x){return {title:x.title||x.practiceId,date:x.date,before:x.beforeStress,after:x.afterStress,durationSeconds:x.durationSeconds||0};});
 var pet=state.pet||{},brain=state.secondBrain&&Array.isArray(state.secondBrain.notes)?state.secondBrain.notes:(Array.isArray(state.secondBrainItems)?state.secondBrainItems:[]),developmentPlan=window.getLifeOSLearningPlanSummary?window.getLifeOSLearningPlanSummary():null,memorySessions=state.memoryTraining&&Array.isArray(state.memoryTraining.sessions)?state.memoryTraining.sessions:[],journalRecent=(state.journalEntries||[]).slice().sort(function(x,y){return String(y.date||'').localeCompare(String(x.date||''));}).slice(0,5).map(function(x){return {date:x.date,mood:x.mood,energy:x.energy,wins:String(x.wins||'').slice(0,180),blockers:String(x.blockers||'').slice(0,180)};});
 var month=date.slice(0,7),finance=(state.financeEntries||[]).filter(function(x){return String(x.date||'').slice(0,7)===month;});
 var income=finance.filter(function(x){return x.type==='income';}).reduce(function(n,x){return n+(Number(x.amount)||0);},0),expense=finance.filter(function(x){return x.type==='expense';}).reduce(function(n,x){return n+(Number(x.amount)||0);},0);
 return {
  date:date,period:"30 дней",
  tasks:{active:tasks.length,overdue:tasks.filter(function(t){return t.due_date&&String(t.due_date).slice(0,10)<date;}).length,next:tasks.slice(0,6).map(function(t){return {title:t.title,priority:t.priority||'medium',due:t.due_date||null};})},
  habits:{today:habits,completed:habits.filter(function(h){return h.done;}).length},
  water:{glasses:water?Number(water.count)||0:0,goal:getWaterGoal()},
  mood:mood?{score:mood.score}:null,
  sleep:sleep?{hours:sleep.hours,quality:sleep.quality,date:sleep.date}:null,
  vision:{eyeFatigue:vm.eyeFatigue||null,dryness:vm.dryness||null,headaches:!!vm.headaches,blur:!!vm.blur,screenHours:vm.screenHours||null},
  journal:journal?{mood:journal.mood,energy:journal.energy,wins:String(journal.wins||'').slice(0,350),blockers:String(journal.blockers||'').slice(0,350),tomorrow:journal.tomorrow||null}:null,
  calendar:{today:events,upcomingCount:(state.calendarEvents||[]).filter(function(x){return !x.done&&String(x.date||'')>=date;}).length},
  screenTime:{minutes:screen},
  antistress:{recent:stress},
  pet:{name:pet.name||null,stage:pet.stage||1,xp:pet.xp||0,careToday:(pet.careLog||[]).filter(function(x){return x.date===date;}).length},
  secondBrain:{notes:brain.length,recent:brain.slice(-8).map(function(x){return {title:x.title,tags:(x.tags||[]).slice(0,6),excerpt:String(x.body||'').slice(0,240)};})},
  memoryTraining:{sessions:memorySessions.length,bestSpan:Number(state.memoryTraining&&state.memoryTraining.bestSpan)||0,recent:memorySessions.slice(-12).map(function(x){return {type:x.type,accuracy:Number(x.accuracy)||Math.round((Number(x.score)||0)/Math.max(1,Number(x.length)||1)*100),seconds:Number(x.seconds)||null,date:String(x.at||'').slice(0,10)};})},
  journalHistory:journalRecent,
  finance:{month:month,income:income,expense:expense,balance:income-expense,entries:finance.length},
  learningProgress:{trackedTopics:Object.keys(state.libraryProgress||{}).length,developmentPlan:developmentPlan},
  analytics:{health:a.health||null,focus:a.focus||null,learning:a.learning||null,overview:a.overview||null,life:a.life||null}
 };
}
function setJarvisApiUrl(value){var d=getJarvisState(),url=String(value||'').trim();if(url&& !/^https:\/\//i.test(url)){toast('URL сервера должен начинаться с https://','warning');return;}d.apiUrl=url.slice(0,500);save();}
function setJarvisProvider(value){var d=getJarvisState();d.provider=value==='gemini'?'gemini':'openai';save();toast('Провайдер: '+(d.provider==='gemini'?'Gemini':'OpenAI'),'success');}
function setJarvisAccessCode(value){var d=getJarvisState();d.accessCode=String(value||'').trim().slice(0,160);save();}
function setJarvisCloudAI(enabled){
 var d=getJarvisState();
 if(enabled&&(!String(d.apiUrl||'').trim()||!String(d.accessCode||'').trim())){toast('Сначала укажи URL Worker и код доступа.','warning');renderJarvis();return;}
 if(enabled&&!d.cloudAIConsent){
  var ok=confirm('Разрешить отправлять твои сообщения, недавний диалог и сводные данные LIFEOS на настроенный сервер ИИ для персональных ответов? API-ключ хранится только на сервере. Продолжить?');
  if(!ok){d.cloudAIEnabled=false;save();renderJarvis();return;}
  d.cloudAIConsent=true;
 }
 d.cloudAIEnabled=!!enabled;save();renderJarvis();
 toast(enabled?'Разговорный ИИ включён':'Используется локальный режим','success');
}
async function sendJarvisCloudMessage(text){
 var d=getJarvisState(),placeholder={role:'assistant',text:'Думаю над ответом…',at:nowISO(),pending:true};
 d.messages.push(placeholder);if(d.messages.length>160)d.messages=d.messages.slice(-160);save();renderJarvis();
 try{
  var history=d.messages.slice(-14,-2).map(function(m){return {role:m.role==='assistant'?'assistant':'user',content:m.text};});
  var apiUrl=String(d.apiUrl||'').trim();if(!/^https:\/\//i.test(apiUrl))throw new Error('Укажи HTTPS URL своего Cloudflare Worker в настройках Джарвиса.');
  var response=await fetch(apiUrl,{method:'POST',headers:{'Content-Type':'application/json','X-Jarvis-Access-Code':String(d.accessCode||'')},body:JSON.stringify({message:text,history:history,provider:d.provider||'openai',context:buildJarvisAppContext()})});
  var data=await response.json().catch(function(){return {};});
  if(!response.ok){
   if(data.error==='AI_NOT_CONFIGURED')throw new Error('Серверный ИИ пока не настроен: добавь OPENAI_API_KEY и JARVIS_ACCESS_CODE в секреты Cloudflare Worker.');
   if(data.error==='UNAUTHORIZED')throw new Error('Код доступа не совпадает с JARVIS_ACCESS_CODE в Cloudflare Worker.');
   throw new Error(data.message||'ИИ временно недоступен ('+response.status+').');
  }
  placeholder.text=String(data.reply||'Не получил текст ответа.');placeholder.pending=false;
 }catch(e){
  placeholder.text='Не удалось получить ответ ИИ: '+String(e.message||e).slice(0,280)+'\nЛокальные функции LIFEOS продолжают работать.';
  placeholder.pending=false;
 }
 save();if(currentPage==='ai'||currentPage==='jarvis')renderJarvis();
}
function buildJarvisLocalReply(text){
 var q=String(text||'').toLowerCase(),c=buildJarvisAppContext(),a;
 try{a=getJarvisAnalytics(true);}catch(e){a={items:[]};}
 if(/как я|мои результаты|проанализируй|анализ|что со мной|как у меня дела/.test(q)){
  var out=['Вот что вижу по сохранённым данным LIFEOS:','• Активных задач: '+c.tasks.active+' (просрочено: '+c.tasks.overdue+').','• Привычки сегодня: '+c.habits.completed+'/'+c.habits.today.length+'.','• Вода: '+c.water.glasses+'/'+c.water.goal+' стаканов.','• Настроение: '+(c.mood?c.mood.score+'/10':'записи пока нет')+'.','• Сон: '+(c.sleep?c.sleep.hours+' ч, качество '+c.sleep.quality+'/10':'записи пока нет')+'.'];
  if(c.vision.eyeFatigue)out.push('• Усталость глаз: '+c.vision.eyeFatigue+'/10.');
  if(a.items&&a.items.length)out.push('Главный сигнал: '+a.items[0].title+'. '+a.items[0].detail);
  out.push('Это анализ записей, а не оценка того, чего ты не отслеживал. Что разберём первым?');return out.join('\n');
 }
 if(/вода|пить/.test(q))return 'Сегодня в трекере '+c.water.glasses+' из '+c.water.goal+' стаканов. Это ориентир приложения, а не обязательная норма: учитывай жажду, активность, погоду и рекомендации врача. Хочешь, помогу настроить удобные напоминания?';
 if(/настроен|груст|плохо|тревог|стресс|злюсь|устал/.test(q))return 'Я посмотрел записи: настроение сегодня '+(c.mood?c.mood.score+'/10':'не отмечено')+', энергия и стресс оцениваются только если ты заполнял самооценку. Не буду делать вывод по одному числу. Что сильнее всего повлияло на состояние сегодня?';
 if(/зрение|глаз|экран/.test(q))return 'По разделу зрения сегодня: усталость '+(c.vision.eyeFatigue?c.vision.eyeFatigue+'/10':'не отмечена')+', экран '+(c.vision.screenHours?c.vision.screenHours+' ч':'не записан')+'. Полезнее начать с перерывов, моргания, расстояния до экрана и проверки зрения у офтальмолога, а не пытаться «натренировать» близорукость. Открой раздел «Зрение» — там дневник и протоколы.';
 if(/привыч|режим|дисциплин/.test(q))return 'Сегодня выполнено '+c.habits.completed+' из '+c.habits.today.length+' привычек. Выбери одну, которую хочешь закрепить. Я помогу уменьшить её до минимального действия и привязать к конкретному сигналу.';
 if(/сон|спал/.test(q))return c.sleep?'Последняя запись сна — '+c.sleep.hours+' ч, качество '+c.sleep.quality+'/10 ('+c.sleep.date+'). Если хочешь улучшить режим, сначала сравним время отхода ко сну и подъёма за 7 дней.':'Пока нет записи сна. Добавь хотя бы несколько ночей — тогда я смогу сравнивать тенденции, а не гадать.';
 if(/учеб|учить|запомин|курс|план развития/.test(q)){var lp=c.learningProgress&&c.learningProgress.developmentPlan;if(lp)return 'Твой план развития: '+lp.overall.done+' из '+lp.overall.total+' действий ('+lp.overall.pct+'%). Сейчас день '+lp.currentDay.number+'/30, неделя '+lp.week.number+': '+lp.week.done+'/'+lp.week.total+'. Курсы: '+lp.courses.join(', ')+'. На сегодня: '+lp.currentDay.tasks.map(function(x){return (x.done?'✓ ':'• ')+x.title;}).join('; ')+'. Могу помочь разобрать любой урок или скорректировать нагрузку.';return 'В обучении лучше проверять не количество прочитанных уроков, а воспроизведение без подсказок и практическое применение. Создай единый план развития в разделе «Обучение» — я смогу учитывать его прогресс.';}
 if(/игр|играть/.test(q))return 'Игры должны запускаться как интерактивные задания, а не просить вручную вводить очки. Я обновляю игровой раздел, чтобы результат считался по реальным действиям.';
 return 'Я на связи в локальном режиме и вижу твои сохранённые показатели LIFEOS. Могу разобрать задачи, привычки, сон, воду, настроение, экранное время, зрение и обучение. Сейчас по данным: '+c.tasks.active+' активных задач, '+c.habits.completed+'/'+c.habits.today.length+' привычек сегодня. Для свободного диалога уровня языковой модели включи «Разговорный ИИ» и настрой серверный ключ. Что именно хочешь решить?';
}
function formatJarvisStatsSummary(a,analysis){
  a=a||{};analysis=analysis||{};var o=a.overview||{},h=a.health||{},f=a.focus||{},l=a.learning||{},life=a.life||{},coverage=a.coverage||{};
  var fmt=function(v,suffix){return v===null||v===undefined||v===''?'нет данных':String(v)+(suffix||'');};
  var lines=['Сводка LIFEOS · '+(a.label||'выбранный период'),'','ЗАДАЧИ И ПРИВЫЧКИ','• Выполнено задач: '+fmt(o.tasksDonePeriod)+'; активных: '+fmt(o.tasksPending)+'; просрочено: '+fmt(o.overdue)+'.','• Отметки привычек: '+fmt(o.habitEvents)+'; активных привычек: '+fmt(o.habitTotal)+'.','','СОСТОЯНИЕ И ФОКУС','• Сон: '+fmt(h.sleepAvgHours,' ч в среднем')+'; цель: '+fmt(h.sleepTarget,' ч')+'.','• Настроение: '+fmt(h.moodAvg,'/10')+'; записей: '+fmt(h.moodEntries)+'.','• Экран: '+fmt(f.screenDailyAvg,' мин/день')+'; записей: '+fmt(f.screenEntries)+'; покрытие периода: '+fmt(f.screenCoveragePct,'%')+'.','• Фокус-сессий: '+fmt(f.focusSessions)+'; самооценок: '+fmt(f.checkins)+'.','','ОБУЧЕНИЕ И ЖИЗНЬ','• Учебных сессий: '+fmt(l.studySessions)+' ('+fmt(l.studyMinutes,' мин')+'); повторений FSRS ожидают: '+fmt(l.fsrsDue)+'.','• Тренировок: '+fmt(h.workouts)+'; прогулок: '+fmt(h.walks)+'; антистресс-практик: '+fmt(h.antistress)+'.','• Проекты: '+fmt(life.projectsDone)+' завершено из '+fmt(life.projects)+'; полнота данных: '+fmt(coverage.percent,'%')+'.'];
  var items=Array.isArray(analysis.items)?analysis.items.slice(0,3):[];
  if(items.length){lines.push('','СИГНАЛЫ ДЖАРВИСА');items.forEach(function(x,i){lines.push((i+1)+'. '+x.title+': '+x.detail+' Следующий шаг: '+x.action);});}
  lines.push('','Ограничения: учитываются только сохранённые записи. Пустые поля не означают нулевой результат; экранное время не считывается автоматически. Это обзор данных, а не медицинская или финансовая оценка.');
  return lines.join('\n');
}
function jarvisReply(text){
  var core=window.LifeOSJarvisCore,cmd=core?core.parseCommand(text):{type:'chat',text:text};
  var d=getJarvisState();
  if(cmd.type==='empty')return '';
  if(cmd.type==='add_task'){
    state.tasks.unshift({id:uid(),title:cmd.title,category:'Личное',planned_time:30,status:'pending',priority:'medium',difficulty:2,checklist:[],created_at:nowISO(),updated_at:nowISO(),description:'Создано через Джарвиса'});
    save();return 'Добавил задачу «'+cmd.title+'». Она уже в списке задач.';
  }
  if(cmd.type==='complete_task'){
    var open=(state.tasks||[]).filter(function(t){return t.status!=='completed';}),task=open[cmd.index-1];
    if(!task)return 'Не нашёл активную задачу с номером '+cmd.index+'. Сначала попроси показать список задач.';
    task.status='completed';task.updated_at=nowISO();save();return 'Отметил выполненной задачу: «'+task.title+'».';
  }
  if(cmd.type==='clear_chat'){d.messages=[];save();return 'История диалога очищена. Личные задачи и записи не затронуты.';}
  if(cmd.type==='set_mode'){var modes={'планировщик':'planner','коуч':'coach','наставник':'coach','строгий':'strict','спокойный':'balanced'};d.mode=modes[cmd.mode]||'balanced';save();return 'Переключил режим помощника: '+cmd.mode+'.';}
  if(cmd.type==='list_tasks'){
    var list=(state.tasks||[]).filter(function(t){return t.status!=='completed';}).slice(0,12);
    return list.length?'Активные задачи:\n'+list.map(function(t,i){return (i+1)+'. '+t.title;}).join('\n')+'\nЧтобы завершить задачу, напиши «выполни 1».':'Активных задач нет. Хороший момент выбрать следующую цель.';
  }
  if(cmd.type==='summary'){
    var stats=getSafeLifeStats(typeof LIFE_STATS_PERIOD!=='undefined'?LIFE_STATS_PERIOD:30);
    var analysis=getJarvisAnalytics(true);
    return formatJarvisStatsSummary(stats,analysis);
  }
  if(cmd.type==='navigate'){navigate(cmd.page);return 'Открываю раздел «'+cmd.page+'».';}
  if(cmd.type==='focus'){startJarvisFocus(cmd.minutes||Number(d.focusDefault)||25);return 'Запустил фокус на '+(cmd.minutes||Number(d.focusDefault)||25)+' минут.';}
  if(cmd.type==='checkin')return 'Открыл короткую самооценку. Оцени показатели по шкале от 1 до 5.';
  if(cmd.type==='methods')return 'Открыл библиотеку методик с пояснениями и источниками.';
  if(cmd.type==='help')return 'Что умею офлайн:\n• «Добавь задачу: …»\n• «Покажи мои задачи»\n• «Выполни 1» — завершить первую активную задачу\n• «Сводка»\n• «Фокус 15 / 25 / 45 / 50»\n• «Открой память / обучение / зрение / прогулки / сон / финансы»\n• «Режим планировщик / коуч / строгий / спокойный»\n• «Самооценка», «Методики», «Очисти диалог».';
  if(/привет|здравствуй|добрый день|доброе утро/i.test(text))return 'Привет. Выбери одну приоритетную задачу — помогу превратить её в понятные шаги.';
  if(/устал|нет сил|не могу начать|прокрастин/i.test(text)){
    if(d.mode==='strict')return 'Без перегруза: назови одну задачу, поставь таймер на 10 минут и начни с первого физического действия. После 10 минут оцени, продолжать ли.';
    return 'Снизим порог входа:\n1. Выбери действие на 2 минуты.\n2. Убери один отвлекающий фактор.\n3. Сформулируй план «Когда ___, я сделаю ___».\nКакой самый маленький шаг можно сделать сейчас?';
  }
  if(/тревог|стресс|нервнича/i.test(text))return 'Попробуй мягкое заземление: назови 5 предметов, которые видишь; 4 ощущения тела; 3 звука; 2 запаха; 1 вкус. Это упражнение для переключения внимания, не лечение.';
  if(/учить|запомн|экзамен|обучен/i.test(text))return 'Практика: сначала попробуй воспроизвести материал без подсказки, затем проверь себя и создай карточку для повторения через интервал. Не перечитывай подряд — проверяй, что действительно вспомнил.';
  if(/план|расписан|приоритет/i.test(text))return 'План на сейчас: 1) выпиши все дела; 2) выбери одно важное; 3) оцени длительность; 4) поставь его в календарь; 5) оставь буфер. Могу добавить задачу командой «Добавь задачу: …».';
  return 'Эта версия работает как локальный помощник-командный центр, а не как подключённая языковая модель. Я могу управлять задачами, таймером, разделами и локальными записями. Напиши «помощь» для списка команд.';
}
function sendJarvisMessage(){
 var input=document.getElementById('jarvisInput');if(!input)return;
 var text=input.value.trim();if(!text)return;input.value='';
 var d=getJarvisState();jarvisAddMessage('user',text);
 var core=window.LifeOSJarvisCore,parsed=core?core.parseCommand(text):{type:'chat'};
 if(d.cloudAIEnabled&&(parsed.type==='chat'||parsed.type==='summary')){sendJarvisCloudMessage(text);return;}
 var reply=jarvisReply(text);if(reply)jarvisAddMessage('assistant',reply);
 if(parsed.type==='checkin')renderJarvisCheckin();
 else if(parsed.type==='methods')renderJarvisMethods();
 else if(currentPage==='ai'||currentPage==='jarvis')renderJarvis();
}

function jarvisQuick(text){var input=document.getElementById('jarvisInput');if(input)input.value=text;sendJarvisMessage();}
function setJarvisMode(mode){var allowed=['balanced','planner','coach','strict'];if(allowed.indexOf(mode)<0)return;getJarvisState().mode=mode;save();renderJarvis();}
function setJarvisFocusDefault(value){var n=Number(value);if([15,25,45,50].indexOf(n)<0)return;getJarvisState().focusDefault=n;save();toast('Длительность фокуса сохранена','success');}
function clearJarvisChat(){getJarvisState().messages=[];save();renderJarvis();toast('Диалог очищен. Остальные данные сохранены','success');}
function startJarvisVoice(){
  var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){toast('Голосовой ввод не поддерживается этим браузером','warning');return;}
  try{var rec=new SR();rec.lang='ru-RU';rec.interimResults=false;rec.maxAlternatives=1;rec.onresult=function(e){var v=e.results&&e.results[0]&&e.results[0][0]?e.results[0][0].transcript:'';var input=document.getElementById('jarvisInput');if(input)input.value=v;if(v)sendJarvisMessage();};rec.onerror=function(){toast('Не удалось распознать речь. Проверь доступ к микрофону.','warning');};rec.start();}catch(e){toast('Не удалось запустить микрофон','error');}
}
function speakJarvisLast(){
  var d=getJarvisState(),m=d.messages.slice().reverse().find(function(x){return x.role==='assistant';});
  if(!m||!window.speechSynthesis){toast('Озвучивание недоступно','warning');return;}
  try{window.speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(m.text);u.lang='ru-RU';u.rate=1;window.speechSynthesis.speak(u);}catch(e){toast('Не удалось озвучить ответ','warning');}
}
function startJarvisFocus(minutes){
  minutes=Math.max(5,Math.min(180,Number(minutes)||Number(getJarvisState().focusDefault)||25));
  var d=getJarvisState();d.focus={active:true,minutes:minutes,startedAt:Date.now(),endsAt:Date.now()+minutes*60000};save();renderJarvis();startJarvisTicker();
}
function startJarvisTicker(){
  if(window.__jarvisTicker)return;
  window.__jarvisTicker=setInterval(function(){
    var d=getJarvisState(),f=d.focus,el=document.getElementById('jarvisCountdown');if(!f||!f.active){clearInterval(window.__jarvisTicker);window.__jarvisTicker=null;return;}
    var left=Math.max(0,Math.ceil((f.endsAt-Date.now())/1000));if(el)el.textContent=Math.floor(left/60)+':'+String(left%60).padStart(2,'0');
    if(left===0){f.active=false;f.completedAt=nowISO();save();clearInterval(window.__jarvisTicker);window.__jarvisTicker=null;toast('Фокус-сессия завершена. Сделай короткий перерыв.','success',4000);if(window.speechSynthesis){var u=new SpeechSynthesisUtterance('Фокус сессия завершена. Время отдохнуть.');u.lang='ru-RU';window.speechSynthesis.speak(u);}if(currentPage==='ai'||currentPage==='jarvis')renderJarvis();}
  },1000);
}
function stopJarvisFocus(){var d=getJarvisState();if(d.focus)d.focus.active=false;save();if(window.__jarvisTicker){clearInterval(window.__jarvisTicker);window.__jarvisTicker=null;}renderJarvis();}
function renderJarvisCheckin(){
  var html='<div class="page"><div class="title-xl">📋 Самооценка состояния</div><div class="subtitle">Короткий дневной срез. Не медицинский тест и не диагностика.</div><div class="card">';
  [['energy','Энергия'],['focus','Концентрация'],['sleep','Качество сна'],['stress','Стресс (5 — низкий)']].forEach(function(x){html+='<div class="field"><label class="field-label">'+x[1]+'</label><select id="jarvis-'+x[0]+'"><option value="1">1 — очень низко</option><option value="2">2</option><option value="3" selected>3 — средне</option><option value="4">4</option><option value="5">5 — очень хорошо</option></select></div>';});
  html+='<button class="btn btn-primary btn-block" onclick="saveJarvisCheckin()">Сохранить самооценку</button></div><button class="btn btn-ghost btn-block" onclick="navigate(\'ai\')">← К Джарвису</button></div>';document.getElementById('app').innerHTML=html;
}
function saveJarvisCheckin(){
  var d=getJarvisState(),row={date:today(),at:nowISO()};['energy','focus','sleep','stress'].forEach(function(k){row[k]=Number((document.getElementById('jarvis-'+k)||{}).value)||3;});
  d.checkins.push(row);if(d.checkins.length>365)d.checkins=d.checkins.slice(-365);save();toast('Самооценка сохранена','success');navigate('ai');
}
function renderJarvisAIProviders(){
  var providers=[
    {name:'ChatGPT',kind:'Универсальный помощник',desc:'Диалог, работа с файлами, проекты, голос, поиск, создание материалов и выполнение многошаговых задач.',best:'Универсальные задачи и работа с контекстом',url:'https://chatgpt.com/overview',emoji:'✳️'},
    {name:'Claude',kind:'Анализ и длинные документы',desc:'Работа с большими материалами, проектным контекстом и памятью; сильные сценарии письма, анализа и программирования.',best:'Документы, анализ и код',url:'https://claude.com/product/overview',emoji:'◈'},
    {name:'Gemini',kind:'Экосистема Google',desc:'Мультимодальный помощник и интеграции с сервисами Google. Может работать с подключёнными приложениями и сложными задачами.',best:'Google Workspace и мультимодальные задачи',url:'https://gemini.google/overview/personal-intelligence/',emoji:'✦'},
    {name:'Perplexity',kind:'Поиск и исследования',desc:'Поиск по интернету с источниками, углублённое исследование, сравнение материалов и исследовательские процессы.',best:'Проверка фактов и поиск источников',url:'https://www.perplexity.ai/hub',emoji:'⌕'},
    {name:'Microsoft Copilot',kind:'Работа и Microsoft 365',desc:'Помощь в Word, Excel, PowerPoint, Outlook и Teams; доступность зависит от приложения, лицензии и настроек организации.',best:'Документы и офисные процессы',url:'https://learn.microsoft.com/copilot/overview',emoji:'▦'},
    {name:'Grok',kind:'Диалог и мультимедиа',desc:'Чат, голос, загрузка файлов, генерация изображений и видео, подключаемые инструменты. Доступность функций зависит от тарифа.',best:'Мультимедиа и быстрый диалог',url:'https://docs.x.ai/grok/overview',emoji:'𝕏'},
    {name:'DeepSeek',kind:'Рассуждение и разработка',desc:'Модели с режимами рассуждения, API и поддержкой инструментов. Подходит для анализа и программирования.',best:'Логика, код и API-интеграции',url:'https://deepseek.com/en/',emoji:'⌘'},
    {name:'Mistral Vibe',kind:'Рабочие и кодовые агенты',desc:'Режимы чата, продуктивности и разработки; ориентирован на многошаговую работу с инструментами и кодом.',best:'Агентные процессы и разработка',url:'https://chat.mistral.ai/',emoji:'✺'}
  ];
  var html='<div class="page jarvis-page jarvis-ai-directory"><div class="row-between"><div><div class="title-xl">Каталог ИИ</div><div class="subtitle">Основные современные помощники и для чего они полезны</div></div><button class="btn btn-ghost btn-sm" onclick="navigate(\'ai\')">← Назад</button></div>';
  html+='<div class="card mb-3"><div class="card-title">Джарвис внутри LIFE OS</div><p class="footnote mt-2">Джарвис — локальный управляющий слой приложения: задачи, таймеры, переходы, настройки и личные записи работают на устройстве. Он не является отдельной большой языковой моделью. Внешние модели можно подключать через защищённый серверный шлюз — без хранения секретных API-ключей в браузере.</p></div>';
  providers.forEach(function(p){html+='<article class="card jarvis-provider mb-2"><div class="row-between"><div class="row"><span class="jarvis-provider-icon">'+p.emoji+'</span><div><div class="card-title">'+p.name+'</div><div class="footnote">'+p.kind+'</div></div></div><span class="badge">Справка</span></div><p class="footnote mt-2">'+p.desc+'</p><div class="jarvis-provider-best">Лучше всего: '+p.best+'</div><a class="btn btn-ghost btn-sm mt-2" href="'+p.url+'" target="_blank" rel="noopener noreferrer">Официальная страница ↗</a></article>';});
  html+='<p class="footnote mt-3">Это обзор основных платформ, а не полный список всех моделей. Возможности, названия моделей, тарифы и доступность меняются; перед подключением проверяй официальную документацию и условия обработки данных.</p><button class="btn btn-primary btn-block mt-3" onclick="navigate(\'ai\')">Вернуться к Джарвису</button></div>';
  document.getElementById('app').innerHTML=html;
}

function renderJarvisMethods(){
  var methods=[
    ['Активное вспоминание','Закрой материал и попробуй воспроизвести ответ по памяти. Затем проверь ошибки.','Высокая полезность для обучения','https://journals.sagepub.com/stoken/rbtfl/Z10jaVH/60XQM/full?cookieSet=1'],
    ['Распределённая практика','Повторяй материал в несколько сессий с интервалами, а не одним длинным блоком.','Высокая полезность для долговременного запоминания','https://journals.sagepub.com/stoken/rbtfl/Z10jaVH/60XQM/full?cookieSet=1'],
    ['Интервальное повторение FSRS','После изучения возвращайся к карточке в рассчитанный срок. Оценивай честно: забыл, трудно, хорошо или легко.','Адаптивное расписание повторений; алгоритм не гарантирует конкретный результат','https://github.com/open-spaced-repetition/awesome-fsrs/wiki/The-Algorithm'],
    ['План «если — то»','Заранее свяжи ситуацию с действием: «Если наступит 19:00, то я открою урок и позанимаюсь 10 минут».','Практика планирования поведения','https://www.nice.org.uk/Guidance/PH49/chapter/recommendations'],
    ['Самонаблюдение и обратная связь','Записывай поведение и результат, затем корректируй цель по фактическим данным.','Рекомендации NICE по изменению поведения','https://www.nice.org.uk/Guidance/PH49/chapter/recommendations'],
    ['Постепенная физическая активность','Начинай с доступного объёма и наращивай постепенно; рекомендации зависят от возраста и состояния здоровья.','Ориентир ВОЗ для взрослых: 150–300 минут умеренной активности в неделю','https://www.who.int/initiatives/behealthy/physical-activity/'],
    ['Сон как базовая опора','Сохраняй регулярный режим и отслеживай длительность сна; потребность зависит от возраста.','CDC: взрослым 18–60 лет обычно требуется 7+ часов','https://www.cdc.gov/sleep/about/index.html']
  ];
  var html='<div class="page"><div class="title-xl">🧪 Библиотека методик</div><div class="subtitle">Краткие протоколы с источниками и границами применимости.</div>';
  methods.forEach(function(m){html+='<div class="card mb-2"><div class="card-title">'+m[0]+'</div><p class="footnote mt-2">'+m[1]+'</p><div class="badge badge-success mt-2">'+m[2]+'</div><p class="footnote mt-2"><a href="'+m[3]+'" target="_blank" rel="noopener">Источник и подробности ↗</a></p></div>';});
  html+='<button class="btn btn-ghost btn-block" onclick="navigate(\'ai\')">← К Джарвису</button></div>';document.getElementById('app').innerHTML=html;
}

function renderMethods(){ renderJarvisMethods(); }
function renderRecovery(){ renderStub('🌿 Восстановление'); }
function renderMedical(){ renderStub('🏥 Медицина'); }
function renderMeds(){ renderStub('💊 Лекарства'); }
function renderGcal(){ renderStub('📅 Google Calendar'); }
function renderNotifications(){ renderStub('🔔 Уведомления'); }
function renderIntegrations(){
 var jarvis=getJarvisState(),gcal=state.integrations&&state.integrations.gcal||{};
 var html="<div class='page'><div class='title-xl'>🔗 Интеграции</div><div class='subtitle'>Связи LIFE OS, второго мозга и AI-помощников.</div>";
 html+="<div class='card mb-3'><h2>🧠 Второй мозг · Obsidian</h2><p class='footnote'>Общая база знаний, поиск и Markdown-обмен. Работает офлайн.</p><button class='btn btn-primary btn-block' onclick='navigate(&quot;obsidianIntegration&quot;)'>Открыть второй мозг</button></div>";
 html+="<div class='card mb-3'><h2>✦ Google Gemini</h2><p class='footnote'>Реальный провайдер Джарвиса через Cloudflare Worker. Нужен серверный секрет GEMINI_API_KEY; ключ не хранится в приложении.</p><button class='btn btn-primary btn-block' onclick='setJarvisProvider(&quot;gemini&quot;);navigate(&quot;ai&quot;)'>"+(jarvis.provider==='gemini'?'Gemini выбран':'Выбрать Gemini')+"</button></div>";
 html+="<div class='card mb-3'><h2>✳️ OpenAI</h2><p class='footnote'>Альтернативный провайдер Джарвиса. API-ключ хранится только на сервере.</p><button class='btn btn-ghost btn-block' onclick='setJarvisProvider(&quot;openai&quot;);navigate(&quot;ai&quot;)'>"+(jarvis.provider==='openai'?'OpenAI выбран':'Выбрать OpenAI')+"</button></div>";
 html+="<div class='card mb-3'><h2>📅 Google Calendar</h2><p class='footnote'>Статус: "+(gcal.connected?'подключён':'не подключён')+". Для синхронизации нужны OAuth-разрешения Google.</p><button class='btn btn-ghost btn-block' onclick='navigate(&quot;gcal&quot;)'>Настроить календарь</button></div>";
 html+="<div class='card'><h2>💾 Резервное копирование</h2><p class='footnote'>Автосохранение на устройстве и резервные снимки IndexedDB.</p><div class='btn-row'><button class='btn btn-primary' onclick='manualSaveAll()'>Сохранить всё</button><button class='btn btn-ghost' onclick='exportDB()'>Экспорт JSON</button></div></div></div>";
 document.getElementById('app').innerHTML=html;
}
function renderEntertainment(){ renderStub('🎬 Досуг'); }
function renderResources(){ renderStub('🔗 Ресурсы'); }
function renderMovies(){ renderStub('🎥 Фильмы'); }
function renderSeries(){ renderStub('📺 Сериалы'); }
function renderBooks(){ renderStub('📚 Книги'); }
function renderMusic(){ renderStub('🎵 Музыка'); }
function renderGames(){ renderStub('🎮 Игры'); }
function renderPodcasts(){ renderStub('🎧 Подкасты'); }
function renderPersonalCollection(kind){
  var config={
    goals:{title:'🎯 Цели',subtitle:'Формулируй результат и отмечай завершение',key:'customGoals',placeholder:'Например: выучить JavaScript',button:'Добавить цель',category:'Приоритет',options:['Высокий','Средний','Низкий']},
    notes:{title:'📝 Заметки',subtitle:'Идеи, наблюдения и полезные мысли',key:'customNotes',placeholder:'Заголовок заметки',button:'Сохранить заметку',category:'Тип',options:['Идея','Работа','Обучение','Личное']},
    journal:{title:'📓 Дневник',subtitle:'Фиксируй события, мысли и состояние',key:'journalEntries',placeholder:'Что сегодня произошло?',button:'Записать в дневник',category:'Настроение',options:['😊 Хорошее','😐 Нейтральное','😔 Сложное','🔥 Продуктивное']}
  }[kind];
  var rows=state[config.key];if(!Array.isArray(rows))rows=[];
  var html='<div class="page workspace-page"><div class="title-xl">'+config.title+'</div><div class="subtitle">'+config.subtitle+'</div>';
  html+='<div class="card mb-3"><div class="field"><label class="field-label">'+(kind==='journal'?'Запись':'Название')+'</label><textarea id="collectionText" maxlength="3000" placeholder="'+config.placeholder+'"></textarea></div>';
  html+='<div class="field"><label class="field-label">'+config.category+'</label><select id="collectionCategory">'+config.options.map(function(o){return '<option>'+o+'</option>';}).join('')+'</select></div>';
  html+='<button class="btn btn-primary btn-block" onclick="addPersonalCollection(\''+kind+'\')">'+config.button+'</button></div>';
  html+='<div class="row-between mb-2"><div class="card-title">История</div><div class="footnote">'+rows.length+' записей</div></div>';
  if(!rows.length)html+='<div class="empty"><div class="empty-icon">'+(kind==='goals'?'🎯':kind==='notes'?'📝':'📓')+'</div><div class="empty-title">Пока пусто</div><div class="footnote">Добавь первую запись выше</div></div>';
  rows.slice().reverse().forEach(function(item){
    html+='<div class="card mb-2"><div class="row-between"><div class="list-title">'+esc(item.title||item.text||'Без названия')+'</div><button class="btn btn-ghost btn-sm" onclick="deletePersonalCollection(\''+kind+'\',\''+esc(item.id)+'\')">Удалить</button></div>';
    if(item.category)html+='<div class="footnote">'+esc(item.category)+'</div>';
    if(item.note)html+='<div class="body-text mt-2">'+esc(item.note)+'</div>';else if(kind==='journal'&&item.text)html+='<div class="body-text mt-2">'+esc(item.text)+'</div>';
    if(item.createdAt)html+='<div class="footnote mt-2">'+new Date(item.createdAt).toLocaleString('ru-RU')+'</div>';
    if(kind==='goals')html+='<button class="btn '+(item.done?'btn-ghost':'btn-primary')+' btn-sm mt-2" onclick="togglePersonalGoal(\''+esc(item.id)+'\')">'+(item.done?'✓ Выполнено':'Отметить выполненной')+'</button>';
    html+='</div>';
  });
  html+='</div>';document.getElementById('app').innerHTML=html;
}
function addPersonalCollection(kind){
  var cfg={goals:'customGoals',notes:'customNotes',journal:'journalEntries'}[kind];
  var field=document.getElementById('collectionText'),category=document.getElementById('collectionCategory');
  if(!cfg||!field||!field.value.trim()){toast('Сначала добавь текст','warning');return;}
  if(!Array.isArray(state[cfg]))state[cfg]=[];
  var value=field.value.trim();
  state[cfg].push({id:uid(),title:kind==='journal'?value.split(/\\n/)[0].slice(0,100):value,text:value,note:kind==='journal'?'':value,category:category?category.value:'',done:false,createdAt:nowISO()});
  save();haptic('success');toast('Сохранено','success');renderPersonalCollection(kind);
}
function deletePersonalCollection(kind,id){
  var cfg={goals:'customGoals',notes:'customNotes',journal:'journalEntries'}[kind];
  if(!cfg||!Array.isArray(state[cfg]))return;
  state[cfg]=state[cfg].filter(function(x){return x.id!==id;});save();renderPersonalCollection(kind);
}
function togglePersonalGoal(id){
  var item=(state.customGoals||[]).find(function(x){return x.id===id;});if(!item)return;
  item.done=!item.done;item.completedAt=item.done?nowISO():null;save();haptic('success');renderPersonalCollection('goals');
}
function renderGoals(){ renderPersonalCollection('goals'); }
function renderNotes(){ renderPersonalCollection('notes'); }
function renderJournal(){
 var rows=Array.isArray(state.journalEntries)?state.journalEntries:[],journalDate=LIFE_JOURNAL_DATE||today(),todayEntry=rows.find(function(x){return x.date===journalDate;})||{},html='<div class="page workspace-page"><div class="title-xl">📓 Личный дневник</div><div class="subtitle">Рефлексия, эмоции, энергия, события и планы. Автосохранение во время ввода и ручное сохранение.</div><div class="footnote mb-2" id="journalAutosaveStatus">Изменения сохраняются автоматически</div>';
 html+='<div class="card mb-3"><div class="row-between"><b>Запись за день</b><input type="date" value="'+esc(journalDate)+'" onchange="editJournalDate(this.value)" aria-label="Дата дневника"></div><div class="field"><label class="field-label">Что произошло в этот день?</label><textarea id="journalText" rows="4" maxlength="5000" placeholder="Свободно опиши события, мысли и наблюдения..." oninput="queueJournalAutosave()" onchange="queueJournalAutosave()">'+esc(todayEntry.text||'')+'</textarea></div><div class="grid-2"><div class="field"><label class="field-label">Настроение</label><select id="journalMood" oninput="queueJournalAutosave()" onchange="queueJournalAutosave()"><option value="">Не указано</option>'+['Тяжёлое','Ниже обычного','Нейтральное','Хорошее','Отличное'].map(function(x){return '<option '+(todayEntry.mood===x?'selected':'')+'>'+x+'</option>';}).join('')+'</select></div><div class="field"><label class="field-label">Энергия (1–5)</label><select id="journalEnergy" oninput="queueJournalAutosave()" onchange="queueJournalAutosave()"><option value="">Не указано</option>'+[1,2,3,4,5].map(function(n){return '<option value="'+n+'" '+(Number(todayEntry.energy)===n?'selected':'')+'>'+n+'/5</option>';}).join('')+'</select></div></div><div class="field"><label class="field-label">Что получилось?</label><textarea id="journalWins" rows="2" maxlength="1200" oninput="queueJournalAutosave()" onchange="queueJournalAutosave()">'+esc(todayEntry.wins||'')+'</textarea></div><div class="field"><label class="field-label">Что было трудным / что мешало?</label><textarea id="journalBlockers" rows="2" maxlength="1200" oninput="queueJournalAutosave()" onchange="queueJournalAutosave()">'+esc(todayEntry.blockers||'')+'</textarea></div><div class="field"><label class="field-label">За что благодарен?</label><textarea id="journalGratitude" rows="2" maxlength="800" oninput="queueJournalAutosave()" onchange="queueJournalAutosave()">'+esc(todayEntry.gratitude||'')+'</textarea></div><div class="field"><label class="field-label">Следующий важный шаг</label><input id="journalTomorrow" maxlength="180" value="'+esc(todayEntry.tomorrow||'')+'" placeholder="Один важный результат" oninput="queueJournalAutosave()" onchange="queueJournalAutosave()"></div><button class="btn btn-primary btn-block" onclick="saveJournalEntry(false)">Сохранить дневник</button></div>';
 html+='<div class="row-between mb-2"><b>История записей</b><span class="footnote">'+rows.length+' дней</span></div>';
 rows.slice().sort(function(a,b){return String(b.date||'').localeCompare(String(a.date||''));}).slice(0,60).forEach(function(e){html+='<article class="card mb-2"><div class="row-between"><b>'+esc(e.date||'')+'</b><span class="badge">'+esc(e.mood||'Без оценки')+'</span></div>'+(e.text?'<p class="body-text mt-2">'+esc(e.text).replace(/\n/g,'<br>')+'</p>':'')+(e.wins?'<div class="footnote mt-2"><b>Получилось:</b> '+esc(e.wins)+'</div>':'')+(e.blockers?'<div class="footnote mt-1"><b>Мешало:</b> '+esc(e.blockers)+'</div>':'')+(e.gratitude?'<div class="footnote mt-1"><b>Благодарность:</b> '+esc(e.gratitude)+'</div>':'')+'<div class="btn-row mt-2"><button class="btn btn-ghost btn-xs" onclick="editJournalDate(\''+e.date+'\')">Открыть день</button><button class="btn btn-ghost btn-xs" onclick="deleteJournalEntry(\''+e.date+'\')">Удалить</button></div></article>';});
 html+='</div>';document.getElementById('app').innerHTML=html;
}
function saveJournalEntry(silent){
 var get=function(id){var e=document.getElementById(id);return e?String(e.value||'').trim():'';};
 var journalDate=LIFE_JOURNAL_DATE||today();
 var entry={date:journalDate,text:get('journalText'),mood:get('journalMood'),energy:Number(get('journalEnergy'))||null,wins:get('journalWins'),blockers:get('journalBlockers'),gratitude:get('journalGratitude'),tomorrow:get('journalTomorrow'),updatedAt:nowISO()};
 if(!entry.text&&!entry.wins&&!entry.blockers&&!entry.gratitude&&!entry.tomorrow&&!entry.mood&&!entry.energy)return toast('Добавь хотя бы одну мысль или оценку','warning');
 if(!Array.isArray(state.journalEntries))state.journalEntries=[];
 var old=state.journalEntries.findIndex(function(x){return x.date===journalDate;});
 if(old>=0)state.journalEntries[old]=Object.assign({},state.journalEntries[old],entry);
 else state.journalEntries.push(Object.assign({id:uid(),createdAt:nowISO()},entry));
 if(!save())return toast('Не удалось сохранить запись. Проверь хранилище устройства.','error',4000);
 if(silent){var status=document.getElementById('journalAutosaveStatus');if(status)status.textContent='✓ Автосохранено '+new Date().toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'});return;}
 toast('Запись дневника сохранена','success');renderJournal();
}
function editJournalDate(date){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(String(date||'')))return;
 if(_lifeAutosaveTimer){clearTimeout(_lifeAutosaveTimer);_lifeAutosaveTimer=null;}
 LIFE_JOURNAL_DATE=date;renderJournal();
}
function deleteJournalEntry(date){if(!confirm('Удалить запись за '+date+'?'))return;state.journalEntries=(state.journalEntries||[]).filter(function(x){return x.date!==date;});save();renderJournal();}

function renderDailySurvey(){ renderStub('📋 Опрос'); }
function renderSurvey(){ renderStub('📋 Опрос'); }
function renderPersonalPlan(){ renderStub('🧭 Персональный план'); }
function renderLearningGames(){ renderGamesHub(); }
function renderGamePlay(){ renderGamesHub(); }
function renderMaterials(){ renderStub('📚 Материалы'); }
function renderMaterialDetail(){ renderStub('Материал'); }
function renderDailyReport(){
 var a=buildComprehensiveStats(1)||{},o=a.overview||{},f=a.focus||{},h=a.health||{},list=state.dailyReviews&&state.dailyReviews.history||[],r=list.find(function(x){return x.date===today();})||{};
 var screen=Number(f.screenDailyAvg)||0,goal=Number(o.screenGoal)||Number(state.profile&&state.profile.personalPlan&&state.profile.personalPlan.screenTotalMinutes)||0,tips=[];
 if(screen>=240)tips.push('Экранное время высокое: убери главный источник отвлечения с первого экрана телефона.');
 if(goal&&screen>goal)tips.push('Экранное время выше личного лимита. Запланируй завтра один защищённый период без телефона.');
 if(Number(o.overdue)>0)tips.push('Разбери просроченные задачи: выбери одну на 15 минут, остальные перенеси осознанно.');
 if(!tips.length)tips.push('Сохрани устойчивый темп и выбери одну главную задачу на завтра.');
 var html='<div class="page"><div class="title-xl">☀️ Отчёт и разбор дня</div><div class="subtitle">Факты → выводы → один следующий шаг.</div><div class="grid-2"><div class="card"><div class="stat-value">'+(o.tasksDonePeriod||0)+'</div><div class="stat-label">Задач завершено</div></div><div class="card"><div class="stat-value">'+(screen?screen+' мин':'—')+'</div><div class="stat-label">Экранное время</div></div><div class="card"><div class="stat-value">'+(f.focusMinutes||0)+' мин</div><div class="stat-label">Фокус</div></div><div class="card"><div class="stat-value">'+(h.sleepAvgHours||'—')+'</div><div class="stat-label">Средний сон, ч</div></div></div><div class="card"><h2>🧠 Анализ LIFE OS</h2>'+tips.map(function(t){return '<div class="list-row">• '+esc(t)+'</div>';}).join('')+'<div class="footnote">Выводы строятся только по сохранённым данным.</div></div><div class="card"><h2>🌙 Рефлексия</h2><label class="field-label">Что получилось?</label><textarea id="dailyWins" rows="2" maxlength="800">'+esc(r.wins||'')+'</textarea><label class="field-label">Что мешало?</label><textarea id="dailyBlockers" rows="2" maxlength="800">'+esc(r.blockers||'')+'</textarea><label class="field-label">Настроение (1–5)</label><select id="dailyMood"><option value="">—</option>'+[1,2,3,4,5].map(function(n){return '<option value="'+n+'" '+(Number(r.mood)===n?'selected':'')+'>'+n+'</option>';}).join('')+'</select><label class="field-label">Энергия (1–5)</label><select id="dailyEnergy"><option value="">—</option>'+[1,2,3,4,5].map(function(n){return '<option value="'+n+'" '+(Number(r.energy)===n?'selected':'')+'>'+n+'</option>';}).join('')+'</select><label class="field-label">Главное на завтра</label><input id="dailyTomorrow" maxlength="180" value="'+esc(r.tomorrow||'')+'" placeholder="Один результат"><label class="field-label">Первый шаг</label><input id="dailyFirstStep" maxlength="180" value="'+esc(r.firstStep||'')+'" placeholder="Действие на 5–15 минут"><button class="btn btn-primary btn-block mt-2" onclick="saveDailyReview()">Сохранить разбор дня</button></div></div>';
 document.getElementById('app').innerHTML=html;
}
function saveDailyReview(){
 var v=function(id){var x=document.getElementById(id);return x?String(x.value||'').trim():'';},r={date:today(),updatedAt:nowISO(),wins:v('dailyWins'),blockers:v('dailyBlockers'),mood:Number(v('dailyMood'))||null,energy:Number(v('dailyEnergy'))||null,tomorrow:v('dailyTomorrow'),firstStep:v('dailyFirstStep')};
 if(!r.wins&&!r.blockers&&!r.mood&&!r.energy&&!r.tomorrow&&!r.firstStep)return toast('Заполни хотя бы одно поле','warning');
 if(!state.dailyReviews)state.dailyReviews={history:[]};if(!Array.isArray(state.dailyReviews.history))state.dailyReviews.history=[];
 var i=state.dailyReviews.history.findIndex(function(x){return x.date===r.date;});if(i>=0)state.dailyReviews.history[i]=r;else state.dailyReviews.history.push(r);
 if(state.dailyReviews.history.length>400)state.dailyReviews.history=state.dailyReviews.history.slice(-400);
 save();toast('Разбор дня сохранён','success');renderDailyReport();
}
function renderMonthlyReview(){
 var a=buildComprehensiveStats(30)||{},o=a.overview||{},f=a.focus||{},h=a.health||{},list=state.monthlyReviews&&state.monthlyReviews.history||[],screen=Number(f.screenDailyAvg)||0,goal=Number(o.screenGoal)||Number(state.profile&&state.profile.personalPlan&&state.profile.personalPlan.screenTotalMinutes)||0,tips=[];
 if(goal&&screen>goal*1.15)tips.push('Экранное время выше ориентира: выбери один цифровой барьер и отслеживай его каждую неделю.');
 if(Number(o.overdue)>5)tips.push('Много просроченных задач: удали неактуальное, перенеси важное и разбей крупные задачи.');
 if(!tips.length)tips.push('Сохрани работающие практики. На следующий месяц выбери только одно главное улучшение.');
 var html='<div class="page"><div class="title-xl">🗓️ Итоги и разбор месяца</div><div class="subtitle">Результаты, нагрузка и план следующего месяца по фактическим записям.</div><div class="grid-2"><div class="card"><div class="stat-value">'+(o.tasksDonePeriod||0)+'</div><div class="stat-label">Задач за 30 дней</div></div><div class="card"><div class="stat-value">'+(screen?screen+' мин':'—')+'</div><div class="stat-label">Экран/день</div></div><div class="card"><div class="stat-value">'+(f.focusMinutes||0)+' мин</div><div class="stat-label">Фокус</div></div><div class="card"><div class="stat-value">'+(h.workouts||0)+'</div><div class="stat-label">Тренировок</div></div><div class="card"><div class="stat-value">'+(h.walks||0)+'</div><div class="stat-label">Прогулок</div></div><div class="card"><div class="stat-value">'+(h.meditation||0)+'</div><div class="stat-label">Медитаций</div></div></div><div class="card"><h2>🔎 Выводы</h2>'+tips.map(function(t){return '<div class="list-row">• '+esc(t)+'</div>';}).join('')+'<div class="footnote">Период — последние 30 дней, не календарный месяц. Полнота выводов зависит от заполнения дневников.</div></div><div class="card"><h2>🎯 Следующий месяц</h2><label class="field-label">Главный результат</label><textarea id="monthResult" rows="2" maxlength="800"></textarea><label class="field-label">Что продолжить?</label><textarea id="monthKeep" rows="2" maxlength="800"></textarea><label class="field-label">Что прекратить или упростить?</label><textarea id="monthStop" rows="2" maxlength="800"></textarea><label class="field-label">Главная область</label><select id="monthArea"><option value="focus">Фокус и экран</option><option value="health">Сон и здоровье</option><option value="learning">Обучение и память</option><option value="habits">Привычки</option><option value="balance">Баланс жизни</option></select><label class="field-label">Измеримая цель</label><input id="monthTarget" maxlength="180" placeholder="Например: 5 дней в неделю"><label class="field-label">Как измерим успех?</label><input id="monthMeasure" maxlength="180" placeholder="Метрика и значение"><button class="btn btn-primary btn-block mt-2" onclick="saveMonthlyReview()">Сохранить итоги</button></div><div class="section-title">История обзоров</div>';
 list.slice().reverse().slice(0,24).forEach(function(r){html+='<div class="card"><b>'+esc(r.date||'')+'</b><div>'+esc(r.target||'')+'</div><div class="footnote">'+esc(r.result||'')+'</div></div>';});
 html+='</div>';document.getElementById('app').innerHTML=html;
}
function saveMonthlyReview(){
 var v=function(id){var x=document.getElementById(id);return x?String(x.value||'').trim():'';},r={date:today(),createdAt:nowISO(),result:v('monthResult'),keep:v('monthKeep'),stop:v('monthStop'),area:v('monthArea'),target:v('monthTarget'),measure:v('monthMeasure')};
 if(!r.result&&!r.keep&&!r.stop&&!r.target&&!r.measure)return toast('Добавь вывод или цель','warning');
 if(!state.monthlyReviews)state.monthlyReviews={history:[]};if(!Array.isArray(state.monthlyReviews.history))state.monthlyReviews.history=[];
 state.monthlyReviews.history.push(r);if(state.monthlyReviews.history.length>36)state.monthlyReviews.history=state.monthlyReviews.history.slice(-36);
 save();toast('Итоги месяца сохранены','success');renderMonthlyReview();
}
function renderWeeklyReport(){ renderWeeklyReview(); }
function renderSnapshot(){ renderStub('🌐 Единая картина'); }
function renderRecommendations(){ renderStub('💡 Рекомендации'); }
var LIFE_SCHEDULE_DATE = typeof LIFE_SCHEDULE_DATE==='string' ? LIFE_SCHEDULE_DATE : '';
function lifeScheduleShiftDate(date,delta){var d=new Date(date+'T12:00:00');d.setDate(d.getDate()+delta);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function setLifeScheduleDate(date){LIFE_SCHEDULE_DATE=date;renderSchedule();}
function renderSchedule(){
 ensureLifeOSLists();var selected=LIFE_SCHEDULE_DATE||today(),base=new Date(selected+'T12:00:00'),monday=new Date(base);monday.setDate(base.getDate()-(base.getDay()+6)%7);
 var days=[];for(var i=0;i<7;i++){var d=new Date(monday);d.setDate(monday.getDate()+i);days.push(d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'));}
 var events=state.calendarEvents.filter(function(x){return x.source!=='google';}),dayEvents=events.filter(function(x){return x.date===selected;}).sort(function(a,b){return String(a.time||'').localeCompare(String(b.time||''));});
 var html='<div class="page"><div class="row-between"><div><div class="title-xl">🗓 Расписание</div><div class="subtitle">Неделя · планы · события · локальное сохранение</div></div><button class="btn btn-ghost btn-sm" onclick="navigate(\'calendar\')">Календарь</button></div>';
 html+='<div class="card"><div class="row-between"><button class="btn btn-ghost btn-sm" onclick="setLifeScheduleDate(\''+lifeScheduleShiftDate(days[0],-7)+'\')">‹</button><b>'+new Date(days[0]+'T12:00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'long'})+' — '+new Date(days[6]+'T12:00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'})+'</b><button class="btn btn-ghost btn-sm" onclick="setLifeScheduleDate(\''+lifeScheduleShiftDate(days[0],7)+'\')">›</button></div><div class="grid-2 mt-3">'+days.map(function(day){var n=events.filter(function(e){return e.date===day;}).length;return '<button class="card '+(day===selected?'card-gradient':'')+'" style="padding:10px;text-align:center;border:1px solid '+(day===selected?'var(--brand)':'var(--glass-border)')+'" onclick="setLifeScheduleDate(\''+day+'\')"><div class="footnote">'+new Date(day+'T12:00:00').toLocaleDateString('ru-RU',{weekday:'short'})+'</div><b style="font-size:20px">'+Number(day.slice(-2))+'</b><div class="footnote">'+n+' событий</div></button>';}).join('')+'</div><button class="btn btn-ghost btn-sm mt-2" onclick="setLifeScheduleDate(\''+today()+'\')">Сегодня</button></div>';
 html+='<div class="row-between mt-3 mb-2"><div class="section-title">'+new Date(selected+'T12:00:00').toLocaleDateString('ru-RU',{weekday:'long',day:'numeric',month:'long'})+'</div><span class="badge">'+dayEvents.length+' событий</span></div>';
 html+='<div class="card mb-3"><div class="field"><label class="field-label">Новое событие</label><input id="scheduleTitle" maxlength="120" placeholder="Что нужно сделать?"></div><div class="grid-2"><div class="field"><label class="field-label">Время</label><input id="scheduleTime" type="time" value="09:00"></div><div class="field"><label class="field-label">Длительность, мин</label><input id="scheduleDuration" type="number" min="5" max="720" value="30"></div></div><div class="field"><label class="field-label">Категория</label><select id="scheduleCategory"><option>Личное</option><option>Работа</option><option>Учёба</option><option>Здоровье</option><option>Отдых</option></select></div><div class="field"><label class="field-label">Заметка</label><textarea id="scheduleNote" maxlength="800" rows="2"></textarea></div><button class="btn btn-primary btn-block" onclick="addScheduleEvent(\''+selected+'\')">＋ Добавить в расписание</button></div>';
 if(!dayEvents.length)html+='<div class="card empty"><div class="empty-icon">☀️</div><div class="empty-title">На этот день пока нет событий</div><div class="footnote">Добавь встречу, задачу или время для отдыха.</div></div>';
 dayEvents.forEach(function(e){html+='<article class="card mb-2"><div class="row-between"><div><b>'+esc(e.title||'Событие')+'</b><div class="footnote">'+esc(e.category||'')+' · '+Number(e.duration||30)+' мин</div></div><b>'+esc(e.time||'—')+'</b></div>'+(e.note?'<p class="footnote mt-2">'+esc(e.note)+'</p>':'')+'<div class="btn-row mt-2"><button class="btn btn-ghost btn-xs" onclick="toggleCalendarEvent(\''+e.id+'\')">'+(e.done?'↩ Вернуть':'✓ Завершить')+'</button><button class="btn btn-ghost btn-xs" onclick="deleteCalendarEvent(\''+e.id+'\')">Удалить</button></div></article>';});
 html+='<div class="footnote mt-3">Планы хранятся на этом устройстве и доступны офлайн. События Google Calendar здесь пока не синхронизируются.</div></div>';document.getElementById('app').innerHTML=html;
}
function addScheduleEvent(date){date=date||window.LIFEOS_SELECTED_CAL_DATE||today();var title=document.getElementById('scheduleTitle'),time=document.getElementById('scheduleTime'),duration=document.getElementById('scheduleDuration');if(!title||!title.value.trim())return toast('Введи название события','warning');ensureLifeOSLists();state.calendarEvents.push({id:uid(),source:'lifeos',title:title.value.trim(),date:date,time:time&&time.value||'09:00',duration:Math.max(5,Math.min(720,Number(duration&&duration.value)||30)),category:(document.getElementById('scheduleCategory')||{}).value||'Личное',note:(document.getElementById('scheduleNote')||{}).value||'',done:false,createdAt:nowISO()});save();toast('Событие добавлено в расписание','success');renderSchedule();}
function renderScheduleEditor(){renderSchedule();}
function renderEveningReview(){renderDailyReport();}

function renderWeeklyReview(){
 var rows=state.weeklyReview&&Array.isArray(state.weeklyReview.history)?state.weeklyReview.history:[];
 var a=buildComprehensiveStats(7)||{},o=a.overview||{},f=a.focus||{},h=a.health||{};
 var screen=Number(f.screenDailyAvg)||0,goal=Number(o.screenGoal)||Number(state.profile&&state.profile.personalPlan&&state.profile.personalPlan.screenTotalMinutes)||0;
 var suggestions=[];
 if(screen&&goal&&screen>goal*1.15)suggestions.push('Экранное время выше твоего ориентира. На следующей неделе выбери один главный источник отвлечения и поставь для него конкретное окно без телефона.');
 else if(screen>=240)suggestions.push('Среднее экранное время высокое. Начни не с резкого запрета, а с двух защищённых периодов по 30 минут без развлекательных приложений.');
 if(Number(o.overdue)>0)suggestions.push('Есть просроченные задачи. Перенеси или удали неактуальные; оставь на день не больше 1–3 главных результатов.');
 if(Number(o.tasksPending)>8)suggestions.push('Большой хвост задач. Разбей одну важную задачу на первый шаг до 15 минут и запланируй его.');
 if(!suggestions.length)suggestions.push('Сохрани текущий ритм и выбери одну небольшую настройку, которую реально поддерживать всю неделю.');
 var html='<div class="page"><div class="title-xl">📈 Еженедельный обзор</div><div class="subtitle">Короткая рефлексия по методике weekly review: факты → вывод → конкретный план «если — то».</div>';
 html+='<div class="grid-2 mb-3"><div class="card"><div class="stat-value">'+(o.tasksDonePeriod||0)+'</div><div class="stat-label">Задач выполнено за 7 дней</div></div><div class="card"><div class="stat-value">'+(screen?screen+' мин':'—')+'</div><div class="stat-label">Экранное время в день</div></div><div class="card"><div class="stat-value">'+(o.habitsToday||0)+'/'+(o.habitTotal||0)+'</div><div class="stat-label">Привычки сегодня</div></div><div class="card"><div class="stat-value">'+(f.focusMinutes||0)+' мин</div><div class="stat-label">Учтённый фокус</div></div></div>';
 html+='<div class="card mb-3"><h2>🧠 Выводы LIFE OS</h2><div class="footnote mb-2">Это подсказки по записанным данным, а не автоматический диагноз. Если данных мало, приложение не делает вид, что знает больше.</div>'+suggestions.map(function(x){return '<div class="list-row"><span>•</span><span>'+esc(x)+'</span></div>';}).join('')+'</div>';
 html+='<div class="card"><h2>📝 Разбор недели</h2><div class="field"><label class="field-label">1. Что получилось? (конкретные победы)</label><textarea id="weeklyWins" rows="2" maxlength="1000" placeholder="Например: 4 раза учился по 20 минут, два вечера провёл без соцсетей…"></textarea></div><div class="field"><label class="field-label">2. Что мешало или отнимало время?</label><textarea id="weeklyBlockers" rows="2" maxlength="1000" placeholder="Например: короткие видео перед сном, слишком много задач…"></textarea></div><div class="field"><label class="field-label">3. Энергия за неделю</label><select id="weeklyEnergy"><option value="">Не оценивать</option><option value="1">1 — очень низкая</option><option value="2">2 — низкая</option><option value="3" selected>3 — средняя</option><option value="4">4 — хорошая</option><option value="5">5 — высокая</option></select></div><div class="field"><label class="field-label">4. Главный фокус следующей недели</label><input id="weeklyFocus" maxlength="180" placeholder="Одна важная цель"></div><div class="field"><label class="field-label">5. План «если — то»</label><div class="footnote mb-1">Заранее свяжи препятствие с действием. Пример: «Если потянусь к коротким видео во время учёбы, то положу телефон в другую комнату и сделаю 5 минут первого шага».</div><input id="weeklyIf" maxlength="180" placeholder="Если произойдёт…"><input id="weeklyThen" class="mt-2" maxlength="180" placeholder="…то я сделаю…"></div><div class="field"><label class="field-label">6. Что изменить в системе?</label><select id="weeklyChange"><option value="keep">Оставить всё как есть</option><option value="reduce">Уменьшить нагрузку</option><option value="simplify">Упростить привычки и задачи</option><option value="protect">Защитить время без телефона</option><option value="sleep">Перенести приоритет на сон и восстановление</option><option value="learn">Добавить регулярное обучение</option></select></div><button class="btn btn-primary btn-block" onclick="saveWeeklyReview()">Сохранить обзор и план</button></div>';
 html+='<div class="section-title mt-3">История обзоров</div>';
 if(!rows.length)html+='<div class="card empty"><div class="empty-icon">🗓️</div><div class="empty-title">Пока нет обзоров</div><div class="empty-text">После сохранения здесь будут прошлые решения и их результаты.</div></div>';
 rows.slice().reverse().slice(0,12).forEach(function(r){html+='<div class="card mb-2"><div class="row-between"><b>'+esc(r.date||'')+'</b><span class="badge">'+(r.energy?('Энергия '+r.energy+'/5'):'Обзор')+'</span></div>'+(r.focus?'<div class="mt-2"><b>Фокус:</b> '+esc(r.focus)+'</div>':'')+(r.ifText||r.thenText?'<div class="footnote mt-2">Если '+esc(r.ifText||'…')+' → то '+esc(r.thenText||'…')+'</div>':'')+(r.wins?'<div class="footnote mt-2">Победы: '+esc(r.wins)+'</div>':'')+'</div>';});
 html+='<button class="btn btn-ghost btn-block mt-2" onclick="navigate(\'stats\')">← К полной статистике</button></div>';
 document.getElementById('app').innerHTML=html;
}
function saveWeeklyReview(){
 var el=function(id){return document.getElementById(id);},value=function(id){var x=el(id);return x?String(x.value||'').trim():'';};
 var wins=value('weeklyWins'),blockers=value('weeklyBlockers'),focus=value('weeklyFocus'),ifText=value('weeklyIf'),thenText=value('weeklyThen'),energy=Number(value('weeklyEnergy'))||null;
 if(!wins&&!blockers&&!focus&&!ifText&&!thenText)return toast('Добавь хотя бы один вывод или план','warning');
 if((ifText&&!thenText)||(!ifText&&thenText))return toast('Заполни обе части плана «если — то»','warning');
 if(!state.weeklyReview||typeof state.weeklyReview!=='object')state.weeklyReview={history:[]};
 if(!Array.isArray(state.weeklyReview.history))state.weeklyReview.history=[];
 state.weeklyReview.history.push({id:uid(),date:today(),createdAt:nowISO(),wins:wins,blockers:blockers,energy:energy,focus:focus,ifText:ifText,thenText:thenText,change:value('weeklyChange')||'keep'});
 if(state.weeklyReview.history.length>104)state.weeklyReview.history=state.weeklyReview.history.slice(-104);
 save();toast('Недельный обзор сохранён','success');renderWeeklyReview();
}

function renderTimer(){ renderStub('⏱ Таймер'); }
function renderDomains(){ navigate('spheres'); }
/* ============ ПРОГУЛКИ ============ */
function getWalkEntries(){if(!Array.isArray(state.walks))state.walks=[];return state.walks;}
function renderWalks(){
  var rows=getWalkEntries().slice().sort(function(a,b){return (b.date||'').localeCompare(a.date||'');});
  var weekStart=new Date();weekStart.setDate(weekStart.getDate()-6);weekStart.setHours(0,0,0,0);
  var recent=rows.filter(function(w){return new Date((w.date||today())+'T00:00:00')>=weekStart;});
  var minutes=recent.reduce(function(n,w){return n+(Number(w.minutes)||0);},0);
  var km=recent.reduce(function(n,w){return n+(Number(w.distance)||0);},0);
  var html='<div class="page walks-page"><div class="walks-hero"><div class="walks-kicker">MOVE · RECOVER · EXPLORE</div><div class="title-xl">Прогулки</div><div class="walks-lead">Выйди на улицу, переключись и зафиксируй свой маршрут.</div><div class="walks-metrics"><div><strong>'+minutes+'</strong><span>мин за 7 дней</span></div><div><strong>'+km.toFixed(1)+'</strong><span>км за 7 дней</span></div><div><strong>'+recent.length+'</strong><span>выходов</span></div></div></div>';
  html+='<div class="card walks-form"><div class="card-title">＋ Записать прогулку</div><div class="walks-fields"><label>Дата<input id="walkDate" type="date" value="'+today()+'"></label><label>Длительность, мин<input id="walkMinutes" type="number" min="1" max="1440" placeholder="30"></label><label>Дистанция, км<input id="walkDistance" type="number" min="0" max="500" step="0.1" placeholder="2.5"></label><label>Шаги<input id="walkSteps" type="number" min="0" max="200000" placeholder="3500"></label><label class="walks-wide">Как прошла прогулка<select id="walkMood"><option value="great">Отлично</option><option value="good" selected>Хорошо</option><option value="calm">Спокойно</option><option value="tired">Устал</option></select></label><label class="walks-wide">Маршрут или заметка<textarea id="walkNote" rows="2" maxlength="500" placeholder="Парк, набережная, новые места…"></textarea></label></div><button class="btn btn-primary btn-block" onclick="addWalkEntry()">Сохранить прогулку</button></div>';
  html+='<div class="row-between mb-2"><div class="section-title" style="margin:0">История</div><span class="footnote">'+rows.length+' прогулок всего</span></div>';
  if(!rows.length)html+='<div class="card empty"><div class="empty-icon">🌿</div><div class="empty-title">Пока нет прогулок</div><div class="empty-text">Добавь первую — здесь появится твоя история активности.</div></div>';
  rows.slice(0,60).forEach(function(w){var mood={great:'✨ Отлично',good:'🙂 Хорошо',calm:'🌿 Спокойно',tired:'😮‍💨 Устал'}[w.mood]||'🚶 Прогулка';html+='<article class="card walk-entry"><div class="row-between"><div><div class="walk-date">'+esc(w.date||'')+'</div><div class="walk-title">'+(Number(w.minutes)||0)+' мин прогулки</div></div><span class="walk-mood">'+mood+'</span></div><div class="walk-stats"><span>📍 '+(Number(w.distance)||0)+' км</span><span>👟 '+(Number(w.steps)||0).toLocaleString('ru-RU')+' шагов</span></div>'+(w.note?'<div class="walk-note">'+esc(w.note)+'</div>':'')+'<button class="btn btn-ghost btn-xs mt-2" onclick="deleteWalkEntry(\''+w.id+'\')">Удалить запись</button></article>';});
  html+='</div>';document.getElementById('app').innerHTML=html;
}
function addWalkEntry(){
  var date=document.getElementById('walkDate'),mins=document.getElementById('walkMinutes'),dist=document.getElementById('walkDistance'),steps=document.getElementById('walkSteps'),mood=document.getElementById('walkMood'),note=document.getElementById('walkNote');
  var duration=Math.round(Number(mins&&mins.value)||0),distance=Number(dist&&dist.value)||0,stepCount=Math.round(Number(steps&&steps.value)||0);
  if(!duration||duration<1||duration>1440){toast('Укажи длительность от 1 до 1440 минут','error');return;}
  if(distance<0||distance>500||stepCount<0||stepCount>200000){toast('Проверь дистанцию и количество шагов','error');return;}
  getWalkEntries().push({id:uid(),date:date&&date.value||today(),minutes:duration,distance:Math.round(distance*10)/10,steps:stepCount,mood:mood&&mood.value||'good',note:(note&&note.value||'').trim(),createdAt:nowISO()});
  save();if(typeof addXP==='function'){addXP(5,'walk');addPetXP(2);}toast('Прогулка сохранена','success');renderWalks();
}
function deleteWalkEntry(id){if(!confirm('Удалить эту прогулку?'))return;state.walks=getWalkEntries().filter(function(w){return w.id!==id;});save();renderWalks();}


/* ============ ПОЛНОЦЕННЫЕ ЛИЧНЫЕ ТРЕКЕРЫ ============ */
function ensureLifeOSLists(){
  ['customWorkouts','customMeditation','screenEntries','calendarEvents'].forEach(function(k){if(!Array.isArray(state[k]))state[k]=[];});
  if(!state.screenStats||typeof state.screenStats!=='object')state.screenStats={};
}
function formatLifeMinutes(value){
  var n=Math.max(0,Math.round(Number(value)||0));
  return Math.floor(n/60)+' ч '+(n%60)+' мин';
}
function renderWorkouts(){
  ensureLifeOSLists();
  var rows=state.customWorkouts.slice().sort(function(a,b){return String(b.date||'').localeCompare(String(a.date||''));});
  var weekStart=new Date();weekStart.setDate(weekStart.getDate()-6);weekStart.setHours(0,0,0,0);
  var week=rows.filter(function(x){return new Date((x.date||'')+'T00:00:00')>=weekStart;});
  var minutes=week.reduce(function(n,x){return n+(Number(x.minutes)||0);},0);
  var html='<div class="page"><div class="title-xl">🏋️ Тренировки</div><div class="subtitle">Журнал активности и динамика нагрузки</div>';
  html+='<div class="grid-2 mb-3"><div class="card"><div class="stat-value">'+week.length+'</div><div class="stat-label">Тренировок за 7 дней</div></div><div class="card"><div class="stat-value">'+formatLifeMinutes(minutes)+'</div><div class="stat-label">Время за 7 дней</div></div></div>';
  html+='<div class="card mb-3"><div class="card-title">＋ Записать тренировку</div><div class="field"><label class="field-label">Тип</label><select id="workoutType"><option value="strength">Силовая</option><option value="cardio">Кардио</option><option value="mobility">Мобильность / растяжка</option><option value="sport">Спорт</option><option value="other">Другое</option></select></div><div class="grid-2"><div class="field"><label class="field-label">Дата</label><input id="workoutDate" type="date" value="'+today()+'"></div><div class="field"><label class="field-label">Минуты</label><input id="workoutMinutes" type="number" min="1" max="1440" value="30"></div></div><div class="field"><label class="field-label">Нагрузка по ощущениям</label><select id="workoutEffort"><option value="1">1 · Очень легко</option><option value="2">2 · Легко</option><option value="3" selected>3 · Умеренно</option><option value="4">4 · Тяжело</option><option value="5">5 · Очень тяжело</option></select></div><div class="field"><label class="field-label">Упражнения / заметка</label><textarea id="workoutNote" maxlength="1000" placeholder="Что делал, подходы, самочувствие..."></textarea></div><button class="btn btn-primary btn-block" onclick="addWorkoutEntry()">Сохранить тренировку</button></div>';
  html+='<div class="section-title">История</div>';
  if(!rows.length)html+='<div class="card empty"><div class="empty-icon">🏋️</div><div class="empty-title">Пока нет тренировок</div><div class="empty-text">Добавь первую запись — здесь появятся история и статистика.</div></div>';
  rows.slice(0,40).forEach(function(x){var names={strength:'Силовая',cardio:'Кардио',mobility:'Мобильность',sport:'Спорт',other:'Другое'};html+='<article class="card mb-2"><div class="row-between"><b>'+esc(names[x.type]||x.type||'Тренировка')+'</b><span class="footnote">'+esc(x.date||'')+'</span></div><div class="stat-value mt-2">'+Number(x.minutes||0)+' мин</div><div class="footnote">Нагрузка: '+Number(x.effort||3)+'/5</div>'+(x.note?'<p class="footnote mt-2">'+esc(x.note)+'</p>':'')+'<button class="btn btn-ghost btn-xs mt-2" onclick="deleteWorkoutEntry(\''+x.id+'\')">Удалить запись</button></article>';});
  document.getElementById('app').innerHTML=html+'</div>';
}
function addWorkoutEntry(){
  ensureLifeOSLists();
  var date=document.getElementById('workoutDate'),minutes=document.getElementById('workoutMinutes'),type=document.getElementById('workoutType');
  var n=Number(minutes&&minutes.value);
  if(!date||!date.value||!Number.isFinite(n)||n<1||n>1440)return toast('Проверь дату и длительность (1–1440 минут)','warning');
  state.customWorkouts.push({id:uid(),date:date.value,type:type.value,minutes:Math.round(n),effort:Number(document.getElementById('workoutEffort').value)||3,note:(document.getElementById('workoutNote').value||'').trim(),createdAt:nowISO()});
  state.stats.totalWorkouts=(state.stats.totalWorkouts||0)+1;save();if(typeof addXP==='function'){addXP(8,'workout');addPetXP(3);}haptic('success');toast('Тренировка сохранена','success');renderWorkouts();
}
function deleteWorkoutEntry(id){
  ensureLifeOSLists();var item=state.customWorkouts.find(function(x){return x.id===id;});if(!item)return;
  if(!confirm('Удалить запись о тренировке?'))return;
  state.customWorkouts=state.customWorkouts.filter(function(x){return x.id!==id;});state.stats.totalWorkouts=Math.max(0,(state.stats.totalWorkouts||1)-1);save();renderWorkouts();
}
function meditationRemaining(){
  var t=state.meditationTimer;if(!t)return 0;
  return t.active?Math.max(0,Math.ceil((Number(t.endsAt)||0)-Date.now())/1000):Math.max(0,Number(t.remainingSec)||0);
}
function formatClock(seconds){
  var n=Math.max(0,Math.ceil(Number(seconds)||0));return pad(Math.floor(n/60))+':'+pad(n%60);
}
function stopMeditationTicker(){
  if(window.__lifeMeditationInterval){clearInterval(window.__lifeMeditationInterval);window.__lifeMeditationInterval=null;}
}
function startMeditationTicker(){
  stopMeditationTicker();
  window.__lifeMeditationInterval=setInterval(function(){
    var left=meditationRemaining(),el=document.getElementById('medTimerClock');
    if(el)el.textContent=formatClock(left);
    if(left<=0)finishMeditation(true);
  },250);
}
function renderMeditation(){
  ensureLifeOSLists();
  var t=state.meditationTimer,active=!!(t&&t.active),left=meditationRemaining();
  var total=state.customMeditation.reduce(function(n,x){return n+(Number(x.minutes)||0);},0);
  var todayRows=state.customMeditation.filter(function(x){return x.date===today();});
  var html='<div class="page"><div class="title-xl">🧘 Медитация</div><div class="subtitle">Таймер практики, журнал и спокойные короткие сессии</div>';
  html+='<div class="grid-2 mb-3"><div class="card"><div class="stat-value">'+todayRows.length+'</div><div class="stat-label">Сессий сегодня</div></div><div class="card"><div class="stat-value">'+formatLifeMinutes(total)+'</div><div class="stat-label">Всего практики</div></div></div>';
  html+='<div class="card mb-3"><div class="card-title">Таймер практики</div><div class="text-center" style="padding:20px 0"><div id="medTimerClock" style="font-size:52px;font-weight:850;font-variant-numeric:tabular-nums">'+formatClock(left||300)+'</div><div class="footnote">'+(active?'Идёт сессия':t?'Сессия приостановлена':'Выбери длительность и начни')+'</div></div>';
  if(!t){html+='<div class="field"><label class="field-label">Длительность</label><select id="medDuration"><option value="3">3 минуты · пауза</option><option value="5" selected>5 минут · короткая практика</option><option value="10">10 минут</option><option value="15">15 минут</option><option value="20">20 минут</option><option value="30">30 минут</option></select></div><div class="field"><label class="field-label">Практика</label><select id="medKind"><option value="breathing">Осознанное дыхание</option><option value="mindfulness">Осознанность</option><option value="body">Сканирование тела</option><option value="relax">Расслабление</option><option value="other">Другое</option></select></div><button class="btn btn-primary btn-block" onclick="startMeditation()">Начать</button>';}
  else{html+='<div class="btn-row"><button class="btn btn-primary" style="flex:1" onclick="'+(active?'pauseMeditation()':'resumeMeditation()')+'">'+(active?'Пауза':'Продолжить')+'</button><button class="btn btn-ghost" style="flex:1" onclick="finishMeditation(false)">Завершить</button></div><button class="btn btn-ghost btn-block mt-2" onclick="cancelMeditation()">Отменить сессию</button>';}
  html+='</div><div class="section-title">История практики</div>';
  var rows=state.customMeditation.slice().reverse();
  if(!rows.length)html+='<div class="card empty"><div class="empty-icon">🧘</div><div class="empty-title">История пока пуста</div></div>';
  rows.slice(0,30).forEach(function(x){html+='<div class="card mb-2"><div class="row-between"><b>'+esc(x.kindLabel||'Медитация')+'</b><span class="footnote">'+esc(x.date||'')+'</span></div><div class="stat-value mt-2">'+Number(x.minutes||0)+' мин</div>'+(x.note?'<div class="footnote mt-1">'+esc(x.note)+'</div>':'')+'<button class="btn btn-ghost btn-xs mt-2" onclick="deleteMeditationEntry(\''+x.id+'\')">Удалить</button></div>';});
  html+='<div class="footnote mt-3">Таймер работает, пока приложение открыто; после сворачивания браузер может замедлять обновление экрана. Время пересчитывается по часам устройства.</div></div>';
  document.getElementById('app').innerHTML=html;
  if(active)startMeditationTicker();
}
function startMeditation(){
  ensureLifeOSLists();if(state.meditationTimer)return toast('Сначала заверши текущую сессию','warning');
  var mins=Number(document.getElementById('medDuration').value)||5;
  var kinds={breathing:'Осознанное дыхание',mindfulness:'Осознанность',body:'Сканирование тела',relax:'Расслабление',other:'Другое'};
  state.meditationTimer={id:uid(),durationSec:mins*60,remainingSec:mins*60,endsAt:Date.now()+mins*60000,active:true,kind:document.getElementById('medKind').value,kindLabel:kinds[document.getElementById('medKind').value]||'Медитация',startedAt:nowISO()};
  save();startMeditationTicker();renderMeditation();
}
function pauseMeditation(){
  var t=state.meditationTimer;if(!t||!t.active)return;
  t.remainingSec=meditationRemaining();t.active=false;t.endsAt=null;stopMeditationTicker();save();renderMeditation();
}
function resumeMeditation(){
  var t=state.meditationTimer;if(!t||t.active)return;
  t.endsAt=Date.now()+Math.max(1,t.remainingSec)*1000;t.active=true;save();startMeditationTicker();renderMeditation();
}
function finishMeditation(completed){
  var t=state.meditationTimer;if(!t)return;
  var remaining=meditationRemaining(),elapsed=Math.max(0,Math.round((t.durationSec-remaining)/60));
  if(completed)elapsed=Math.max(1,Math.round(t.durationSec/60));
  stopMeditationTicker();state.meditationTimer=null;
  if(elapsed>0){
    ensureLifeOSLists();state.customMeditation.push({id:t.id,date:today(),minutes:elapsed,kind:t.kind,kindLabel:t.kindLabel,completed:!!completed,createdAt:nowISO()});
    state.stats.totalMeditations=(state.stats.totalMeditations||0)+1;save();if(typeof addXP==='function'){addXP(5,'meditation');if(completed)addPetXP(2);}toast(completed?'Сессия завершена — отлично':'Практика сохранена','success');
  }else{save();toast('Сессия отменена без записи','info');}
  if(currentPage==='meditation')renderMeditation();
}
function cancelMeditation(){if(!state.meditationTimer)return;if(!confirm('Отменить сессию без сохранения?'))return;stopMeditationTicker();state.meditationTimer=null;save();renderMeditation();}
function deleteMeditationEntry(id){
  ensureLifeOSLists();if(!state.customMeditation.some(function(x){return x.id===id;}))return;
  if(!confirm('Удалить запись о медитации?'))return;
  state.customMeditation=state.customMeditation.filter(function(x){return x.id!==id;});state.stats.totalMeditations=Math.max(0,(state.stats.totalMeditations||1)-1);save();renderMeditation();
}
function renderScreenTracker(){
  ensureLifeOSLists();
  var rows=state.screenEntries.filter(function(x){return x.date===today();});
  var total=rows.reduce(function(n,x){return n+(Number(x.minutes)||0);},0);
  var goal=Number(state.screenStats.dailyLimit)||0;
  var by={};rows.forEach(function(x){by[x.category]=(by[x.category]||0)+(Number(x.minutes)||0);});
  var html='<div class="page"><div class="title-xl">📱 Экранное время</div><div class="subtitle">Ручной учёт времени по занятиям и устройствам</div><div class="grid-2 mb-3"><div class="card"><div class="stat-value">'+formatLifeMinutes(total)+'</div><div class="stat-label">Записано сегодня</div></div><div class="card"><div class="stat-value">'+(goal?formatLifeMinutes(Math.max(0,goal-total)):'—')+'</div><div class="stat-label">'+(goal?'Остаток до лимита':'Лимит не задан')+'</div></div></div>';
  html+='<div class="card mb-3"><div class="card-title">Цель на день</div><div class="grid-2"><div class="field"><label class="field-label">Минут в день</label><input id="screenDailyLimit" type="number" min="0" max="1440" value="'+(goal||'')+'" placeholder="Например, 240"></div><div class="field" style="justify-content:end"><button class="btn btn-ghost btn-block" onclick="saveScreenLimit()">Сохранить лимит</button></div></div></div>';
  html+='<div class="card mb-3"><div class="card-title">＋ Добавить время</div><div class="field"><label class="field-label">Занятие</label><select id="screenCategory"><option>Работа</option><option>Учёба</option><option>Видео</option><option>Развлечения</option><option>Общение</option><option>Чтение</option><option>Другое</option></select></div><div class="grid-2"><div class="field"><label class="field-label">Минуты</label><input id="screenMinutes" type="number" min="1" max="1440" value="30"></div><div class="field"><label class="field-label">Дата</label><input id="screenDate" type="date" value="'+today()+'"></div></div><div class="field"><label class="field-label">Примечание</label><input id="screenNote" maxlength="200" placeholder="Необязательно"></div><button class="btn btn-primary btn-block" onclick="addScreenEntry()">Добавить запись</button></div>';
  html+='<div class="section-title">Сегодня по категориям</div><div class="card">';
  var cats=Object.keys(by);if(!cats.length)html+='<div class="footnote">Пока нет записей. Добавь время вручную.</div>';
  cats.forEach(function(k){var pct=total?Math.round(by[k]/total*100):0;html+='<div class="mb-2"><div class="row-between"><b>'+esc(k)+'</b><span class="footnote">'+by[k]+' мин · '+pct+'%</span></div><div style="height:7px;background:var(--glass-2);border-radius:8px;overflow:hidden"><div style="height:100%;width:'+pct+'%;background:var(--brand);border-radius:8px"></div></div></div>';});
  html+='</div><div class="section-title mt-3">Записи за сегодня</div>';
  rows.slice().reverse().forEach(function(x){html+='<div class="card mb-2"><div class="row-between"><b>'+esc(x.category)+'</b><b>'+Number(x.minutes)+' мин</b></div>'+(x.note?'<div class="footnote mt-1">'+esc(x.note)+'</div>':'')+'<button class="btn btn-ghost btn-xs mt-2" onclick="deleteScreenEntry(\''+x.id+'\')">Удалить</button></div>';});
  html+='<div class="footnote mt-3">Это ручной журнал, а не автоматическое считывание статистики Android или Windows. Для автоматического сбора потребуются отдельные разрешения и нативные интеграции.</div></div>';
  document.getElementById('app').innerHTML=html;
}
function saveScreenLimit(){
  ensureLifeOSLists();var el=document.getElementById('screenDailyLimit'),n=Number(el&&el.value);
  if(!Number.isFinite(n)||n<0||n>1440)return toast('Лимит должен быть от 0 до 1440 минут','warning');
  state.screenStats.dailyLimit=Math.round(n);save();toast('Дневной лимит сохранён','success');renderScreenTracker();
}
function addScreenEntry(){
  ensureLifeOSLists();var n=Number(document.getElementById('screenMinutes').value),date=document.getElementById('screenDate').value;
  if(!Number.isFinite(n)||n<1||n>1440||!date)return toast('Проверь дату и минуты','warning');
  state.screenEntries.push({id:uid(),date:date,category:document.getElementById('screenCategory').value,minutes:Math.round(n),note:(document.getElementById('screenNote').value||'').trim(),createdAt:nowISO()});
  save();toast('Время записано','success');renderScreenTracker();
}
function deleteScreenEntry(id){
  ensureLifeOSLists();if(!state.screenEntries.some(function(x){return x.id===id;}))return;
  if(!confirm('Удалить запись?'))return;state.screenEntries=state.screenEntries.filter(function(x){return x.id!==id;});save();renderScreenTracker();
}
function calendarLocalISO(date){return date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0')+'-'+String(date.getDate()).padStart(2,'0');}
function shiftCalendarMonth(delta){CAL_CURSOR=new Date(CAL_CURSOR.getFullYear(),CAL_CURSOR.getMonth()+delta,1);renderCalendar();}
function selectCalendarDate(date){window.LIFEOS_SELECTED_CAL_DATE=date;renderCalendar();}
function renderCalendar(){
 ensureLifeOSLists();
 var events=state.calendarEvents.filter(function(x){return x.source!=='google';}).slice().sort(function(a,b){return String(a.date||'').localeCompare(String(b.date||''))||String(a.time||'').localeCompare(String(b.time||''));});
 var selected=window.LIFEOS_SELECTED_CAL_DATE||today(),cursor=CAL_CURSOR||new Date(),year=cursor.getFullYear(),month=cursor.getMonth(),first=new Date(year,month,1),start=new Date(year,month,1-((first.getDay()+6)%7));
 var days=[],counts={};events.forEach(function(e){counts[e.date]=(counts[e.date]||0)+1;});
 for(var n=0;n<42;n++){var d=new Date(start.getFullYear(),start.getMonth(),start.getDate()+n);days.push(calendarLocalISO(d));}
 var dayEvents=events.filter(function(x){return x.date===selected;});
 var upcoming=events.filter(function(x){return !x.done&&String(x.date||'')>=today();});
 var html='<div class="page"><div class="row-between"><div><div class="title-xl">📅 Календарь</div><div class="subtitle">Месячный обзор и расписание по дням</div></div><button class="btn btn-ghost btn-sm" onclick="navigate(\'schedule\')">Неделя →</button></div>';
 html+='<div class="grid-2 mb-3"><div class="card"><div class="stat-value">'+upcoming.length+'</div><div class="stat-label">Предстоящих</div></div><div class="card"><div class="stat-value">'+events.filter(function(x){return x.done;}).length+'</div><div class="stat-label">Завершено</div></div></div>';
 html+='<div class="card"><div class="row-between"><button class="btn btn-ghost btn-sm" onclick="shiftCalendarMonth(-1)">‹</button><b>'+cursor.toLocaleDateString('ru-RU',{month:'long',year:'numeric'})+'</b><button class="btn btn-ghost btn-sm" onclick="shiftCalendarMonth(1)">›</button></div>';
 html+='<div class="calendar-month-grid mt-3" style="display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px">';
 ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].forEach(function(day){html+='<div class="footnote" style="text-align:center;padding:5px 0">'+day+'</div>';});
 days.forEach(function(day){var d=new Date(day+'T12:00:00'),inside=d.getMonth()===month,active=day===selected,count=counts[day]||0;html+='<button type="button" aria-label="'+day+(count?', событий: '+count:'')+'" onclick="selectCalendarDate(\''+day+'\')" style="min-height:48px;padding:5px 2px;border-radius:10px;border:1px solid '+(active?'var(--brand)':'var(--glass-border)')+';background:'+(active?'var(--brand-soft,rgba(100,140,255,.16))':'var(--glass-1)')+';opacity:'+(inside?'1':'.42')+';color:var(--text)"><b>'+d.getDate()+'</b><div style="height:5px;margin:3px auto 0;width:18px;border-radius:8px;background:'+(count?'var(--brand)':'transparent')+'"></div></button>';});
 html+='</div><div class="row-between mt-2"><button class="btn btn-ghost btn-xs" onclick="selectCalendarDate(\''+today()+'\');CAL_CURSOR=new Date()">Сегодня</button><span class="footnote">'+events.length+' событий всего</span></div></div>';
 html+='<div class="row-between mt-3 mb-2"><b>'+new Date(selected+'T12:00:00').toLocaleDateString('ru-RU',{weekday:'long',day:'numeric',month:'long',year:'numeric'})+'</b><span class="badge">'+dayEvents.length+' событий</span></div>';
 html+='<div class="card mb-3"><div class="card-title">＋ Добавить событие</div><div class="field"><label class="field-label">Название</label><input id="calTitle" maxlength="120" placeholder="Например, тренировка"></div><div class="grid-2"><div class="field"><label class="field-label">Дата</label><input id="calDate" type="date" value="'+esc(selected)+'"></div><div class="field"><label class="field-label">Время</label><input id="calTime" type="time" value="09:00"></div></div><div class="field"><label class="field-label">Категория</label><select id="calCategory"><option>Личное</option><option>Работа</option><option>Учёба</option><option>Здоровье</option><option>Встреча</option><option>Отдых</option><option>Другое</option></select></div><div class="field"><label class="field-label">Заметка</label><textarea id="calNote" maxlength="1000" placeholder="Детали и подготовка"></textarea></div><button class="btn btn-primary btn-block" onclick="addCalendarEvent()">Сохранить событие</button></div>';
 if(!dayEvents.length)html+='<div class="card empty"><div class="empty-icon">☀️</div><div class="empty-title">На этот день событий нет</div><div class="footnote">Выбери другой день или добавь новое событие.</div></div>';
 dayEvents.forEach(function(x){html+='<article class="card mb-2"><div class="row-between"><div><b>'+esc(x.title||'Событие')+'</b><div class="footnote">'+esc(x.category||'')+'</div></div><span class="footnote">'+esc(x.time||'')+'</span></div>'+(x.note?'<p class="footnote mt-2">'+esc(x.note)+'</p>':'')+'<div class="btn-row mt-2"><button class="btn btn-ghost btn-xs" onclick="toggleCalendarEvent(\''+x.id+'\')">'+(x.done?'↩ Вернуть':'✓ Выполнено')+'</button><button class="btn btn-ghost btn-xs" onclick="deleteCalendarEvent(\''+x.id+'\')">Удалить</button></div></article>';});
 html+='</div>';document.getElementById('app').innerHTML=html;
}
function addCalendarEvent(){
  ensureLifeOSLists();var title=document.getElementById('calTitle'),date=document.getElementById('calDate');
  if(!title||!title.value.trim()||!date||!date.value)return toast('Укажи название и дату','warning');
  window.LIFEOS_SELECTED_CAL_DATE=date.value;state.calendarEvents.push({id:uid(),source:'lifeos',title:title.value.trim(),date:date.value,time:document.getElementById('calTime').value||'09:00',category:document.getElementById('calCategory').value,note:document.getElementById('calNote').value.trim(),done:false,createdAt:nowISO()});
  save();toast('Событие добавлено','success');renderCalendar();
}
function toggleCalendarEvent(id){
  var x=state.calendarEvents.find(function(e){return e.id===id&&e.source==='lifeos';});if(!x)return;x.done=!x.done;x.completedAt=x.done?nowISO():null;save();renderCalendar();
}
function deleteCalendarEvent(id){
  if(!state.calendarEvents.some(function(e){return e.id===id&&e.source==='lifeos';}))return;
  if(!confirm('Удалить событие?'))return;state.calendarEvents=state.calendarEvents.filter(function(e){return !(e.id===id&&e.source==='lifeos');});save();renderCalendar();
}

function renderStorage(){
  var bytes=0;try{bytes=new Blob([JSON.stringify(state)]).size;}catch(e){}
  var kb=(bytes/1024).toFixed(1),html='<div class="page"><div class="title-xl">🗄 Хранилище</div><div class="subtitle">Расширенное локальное хранилище · автоматические копии · офлайн</div>';
  html+='<div class="grid-2 mb-3"><div class="card"><div class="stat-value">'+kb+' КБ</div><div class="stat-label">Текущий объём данных</div></div><div class="card"><div class="stat-value">'+(navigator.onLine?'Онлайн':'Офлайн')+'</div><div class="stat-label">Подключение</div></div></div>';
  html+='<div class="card mb-3"><div class="card-title">🛡 Расширенное хранилище IndexedDB</div><div class="footnote mb-2">Отдельная база браузера хранит до 12 последних автоматических снимков данных. Она не зависит от лимита localStorage и помогает восстановить данные при его переполнении.</div><div class="stat-label" id="vaultStatus">Проверка базы…</div><button class="btn btn-ghost btn-block mt-2" onclick="restoreVaultSnapshot()">↩ Восстановить последнюю копию из расширенного хранилища</button></div>';
  html+='<div class="card mb-3"><div class="card-title">Ручное сохранение и резервные копии</div><div class="footnote mb-2">Автосохранение срабатывает при изменениях. Здесь можно принудительно сохранить всё сейчас, создать файл и восстановить данные.</div><button class="btn btn-primary btn-block mb-2" onclick="manualSaveAll()">💾 Сохранить все данные сейчас</button><button class="btn btn-ghost btn-block mb-2" onclick="exportDB()">📤 Скачать полную копию JSON</button><button class="btn btn-ghost btn-block mb-2" onclick="importDB()">📥 Импортировать копию</button><button class="btn btn-ghost btn-block" onclick="restoreStorageBackup()">↩ Вернуть предыдущую копию</button></div>';
  html+='<div class="card mb-3"><div class="card-title">Место на устройстве</div><div class="footnote" id="storageEstimate">Проверка квоты браузера…</div><div class="footnote mt-2">Фактическая квота зависит от браузера и свободного места. Доступно через IndexedDB значительно больше, чем в localStorage; система использует обе технологии.</div></div>';
  html+='<div class="card mb-3"><div class="card-title">Офлайн-режим</div><div class="footnote">Данные и сохранённые файлы доступны без интернета после первого открытия. AI-запросы, синхронизация и внешние API требуют сеть.</div></div>';
  html+='<div class="card"><div class="card-title">Сброс</div><div class="footnote mb-2">Перед удалением текущие данные останутся в резервной копии.</div><button class="btn btn-danger btn-block" onclick="resetAllWithConfirm()">Удалить данные приложения</button></div></div>';
  document.getElementById('app').innerHTML=html;
  getLatestVaultSnapshot().then(function(item){var el=document.getElementById('vaultStatus');if(el)el.textContent=item?'✓ Последняя копия: '+new Date(item.savedAt).toLocaleString('ru-RU')+' · версия '+item.version:'Пока нет копий — создадутся автоматически после сохранения';}).catch(function(){var el=document.getElementById('vaultStatus');if(el)el.textContent='IndexedDB недоступна в этом режиме браузера';});
  if(navigator.storage&&navigator.storage.estimate)navigator.storage.estimate().then(function(x){var el=document.getElementById('storageEstimate');if(el)el.textContent='Использовано: '+(x.usage/1048576).toFixed(2)+' МБ · доступная квота: '+(x.quota/1048576).toFixed(0)+' МБ';}).catch(function(){});
}
function restoreStorageBackup(){
  if(!confirm('Восстановить предыдущую резервную копию? Текущие данные будут заменены.'))return;
  try{var raw=localStorage.getItem(STORAGE_BACKUP);if(!raw)throw new Error('backup missing');var parsed=JSON.parse(raw);if(!parsed||typeof parsed!=='object')throw new Error('invalid backup');localStorage.setItem(STORAGE_KEY,raw);toast('Копия восстановлена. Перезапускаю…','success');setTimeout(function(){location.reload();},700);}catch(e){toast('Резервная копия не найдена или повреждена','error');}
}
/* Экранный трекер реализован в блоке личных трекеров выше. */
function renderDiagnostic(){
  var checks=[['Состояние данных',!!state&&typeof state==='object'],['Локальное хранилище',!!window.localStorage],['Service Worker','serviceWorker'in navigator],['Поддержка офлайн-кеша','caches'in window],['Экспорт данных',typeof exportDB==='function'],['Резервная копия',!!localStorage.getItem(STORAGE_BACKUP)]];
  var html='<div class="page"><div class="title-xl">🔍 Диагностика</div><div class="subtitle">Проверка возможностей устройства и сохранности данных</div><div class="card">';
  checks.forEach(function(c){html+='<div class="list-row"><div class="list-body"><div class="list-title">'+esc(c[0])+'</div></div><div class="list-value">'+(c[1]?'✓':'—')+'</div></div>';});
  html+='<button class="btn btn-primary btn-block mt-3" onclick="navigate(\'storage\')">Открыть хранилище</button></div></div>';
  document.getElementById('app').innerHTML=html;
}
function renderOnboarding(){ renderStub('👋 Добро пожаловать'); }

/* ============ XP-СИСТЕМА ============ */
function getXPForLevel(level){
  if(level <= 1) return 0;
  var total = 0;
  for(var i = 1; i < level; i++){
    total += Math.round(100 * Math.pow(1.2, i-1));
  }
  return total;
}
function getXPForNextLevel(level){
  return getXPForLevel(level + 1);
}
function addXP(amount, source){
  if(!amount) return;
  if(!state.gamification) state.gamification = defaultState().gamification;
  state.gamification.xp = (state.gamification.xp||0) + amount;
  state.gamification.sources = state.gamification.sources || {};
  state.gamification.sources[source||'other'] = (state.gamification.sources[source||'other']||0) + amount;
  if(!state.gamification.xpHistory) state.gamification.xpHistory = [];
  state.gamification.xpHistory.push({date:today(), amount:amount, source:source||'other', total:state.gamification.xp});
  if(state.gamification.xpHistory.length > 500) state.gamification.xpHistory = state.gamification.xpHistory.slice(-500);
  /* Проверка уровня */
  var newLevel = 1;
  for(var lvl = 1; lvl < 100; lvl++){
    if(state.gamification.xp >= getXPForLevel(lvl)) newLevel = lvl;
    else break;
  }
  if(newLevel > (state.gamification.level||1)){
    state.gamification.level = newLevel;
    state.gamification.lastLevelUp = nowISO();
    if(!state.gamification.levelUpHistory) state.gamification.levelUpHistory = [];
    state.gamification.levelUpHistory.push({level:newLevel, at:nowISO(), xp:state.gamification.xp});
    toast('🎉 Уровень ' + newLevel + '!','success',3000);
    haptic('success');
  }
  /* Обновляем лигу */
  if(!state.leagues) state.leagues = defaultState().leagues;
  state.leagues.weeklyXp = (state.leagues.weeklyXp||0) + amount;
  save();
}

/* ============ АГРЕГАТОР ============ */
function buildUserSnapshot(s){
  if(!s) return null;
  var t = today(), y = yesterday();
  var snap = {
    date:t,
    habits:{total:(s.habits||[]).length, completedToday:0, activeStreak:0, bestStreak:0},
    sleep:{lastNight:null, avg7:null, avg30:null},
    screen:{today:(s.screenStats||{})[t]||0, yesterday:(s.screenStats||{})[y]||0, week:0},
    tasks:{total:(s.tasks||[]).length, pending:0, completedToday:0, overdue:0},
    mood:{today:null, avg7:null},
    water:{today:0, goal:getWaterGoal()},
    workouts:{last7:0, last30:0},
    brain:{totalPlays:0, todayPlays:0, avgScore:null},
    antistress:{todayCount:0, weekCount:0},
    learning:{lessonsDone:Object.keys(s.levelProgress||{}).length, englishDone:Object.keys(s.englishProgress||{}).length, skillsDone:Object.keys(s.skillsProgress||{}).length},
    xp:s.gamification && s.gamification.xp || 0,
    streak:(s.stats && s.stats.streak)||0,
    recommendations:[]
  };
  if(s.habits) s.habits.forEach(function(h){
    if(h.lastCompletedDate === t) snap.habits.completedToday++;
    if(h.streak > snap.habits.activeStreak) snap.habits.activeStreak = h.streak;
  });
  if(s.tasks) s.tasks.forEach(function(task){
    if(task.status === 'pending'){
      snap.tasks.pending++;
      if(task.due_date && task.due_date.slice(0,10) < t) snap.tasks.overdue++;
    }
    if(task.status === 'completed' && task.completedAt && task.completedAt.slice(0,10) === t) snap.tasks.completedToday++;
  });
  var waterToday = (s.customWater||[]).find(function(w){ return w.date === t; });
  if(waterToday) snap.water.today = waterToday.count||0;
  var moodToday = (s.customMood||[]).find(function(m){ return m.date === t; });
  if(moodToday) snap.mood.today = moodToday.score;
  snap.brain.todayPlays = (s.brainPlays||[]).filter(function(p){ return p.date === t; }).length;
  snap.antistress.todayCount = (s.antistressEntries||[]).filter(function(e){ return e.date === t; }).length;
  return snap;
}
function refreshSnapshot(){
  try{
    var snap = buildUserSnapshot(state);
    if(!snap) return null;
    state.snapshot = snap;
    state.lastSnapshotAt = nowISO();
    save();
    return snap;
  }catch(e){ return null; }
}
function getSphere(id){
  if(typeof LIFE_SPHERES === 'undefined') return null;
  for(var i = 0; i < LIFE_SPHERES.length; i++){
    if(LIFE_SPHERES[i].id === id) return LIFE_SPHERES[i];
  }
  return null;
}
function getSpheresBalance(scores){
  if(!scores) return {avg:0,min:0,max:0,balance:0,weakest:null,strongest:null};
  var vals = [];
  (LIFE_SPHERES||[]).forEach(function(s){
    var v = scores[s.id];
    if(typeof v === 'number' && v > 0) vals.push({id:s.id, value:v});
  });
  if(!vals.length) return {avg:0,min:0,max:0,balance:0,weakest:null,strongest:null};
  var sum = 0;
  vals.forEach(function(x){ sum += x.value; });
  var avg = Math.round(sum/vals.length*10)/10;
  var sorted = vals.slice().sort(function(a,b){ return a.value - b.value; });
  var weakest = sorted[0];
  var strongest = sorted[sorted.length-1];
  var spread = strongest.value - weakest.value;
  var balance = Math.max(0, Math.round((1-spread/10)*100));
  return {avg:avg, min:weakest.value, max:strongest.value, balance:balance, weakest:getSphere(weakest.id), strongest:getSphere(strongest.id)};
}
function getSphereRecommendations(sphereId, score){
  if(typeof SPHERE_RECOMMENDATIONS === 'undefined') return [];
  var recs = SPHERE_RECOMMENDATIONS[sphereId]||[];
  return recs.filter(function(r){ return score >= r.min && score <= r.max; });
}
function getCoachStyle(id){
  if(typeof COACH_STYLES === 'undefined') return {emoji:'⚖️', name:'Баланс', desc:''};
  for(var i = 0; i < COACH_STYLES.length; i++){
    if(COACH_STYLES[i].id === id) return COACH_STYLES[i];
  }
  return COACH_STYLES[1];
}
function getRandomCoachTip(sphereId){
  if(typeof COACH_TIPS_2500 === 'undefined') return null;
  var tips = COACH_TIPS_2500[sphereId] || [];
  if(!tips.length) return null;
  return tips[Math.floor(Math.random()*tips.length)];
}
function getHabitTemplate(id){
  if(typeof HABIT_TEMPLATES === 'undefined') return null;
  for(var i = 0; i < HABIT_TEMPLATES.length; i++){
    if(HABIT_TEMPLATES[i].id === id) return HABIT_TEMPLATES[i];
  }
  return null;
}
function getHabitWithWhy(id){
  if(typeof HABITS_WITH_WHY === 'undefined') return null;
  for(var i = 0; i < HABITS_WITH_WHY.length; i++){
    if(HABITS_WITH_WHY[i].id === id) return HABITS_WITH_WHY[i];
  }
  return null;
}
function getHabitsBySphere(sphereId){
  if(typeof HABITS_WITH_WHY === 'undefined') return [];
  if(!sphereId || sphereId === 'all') return HABITS_WITH_WHY.slice();
  return HABITS_WITH_WHY.filter(function(h){ return h.sphereId === sphereId; });
}
function getProjectTemplate(id){
  if(typeof PROJECT_TEMPLATES === 'undefined') return null;
  for(var i = 0; i < PROJECT_TEMPLATES.length; i++){
    if(PROJECT_TEMPLATES[i].id === id) return PROJECT_TEMPLATES[i];
  }
  return null;
}
function getProjectStatus(id){
  if(typeof PROJECT_STATUSES === 'undefined') return {emoji:'📋', name:'—', color:'#5b9eff'};
  for(var i = 0; i < PROJECT_STATUSES.length; i++){
    if(PROJECT_STATUSES[i].id === id) return PROJECT_STATUSES[i];
  }
  return PROJECT_STATUSES[0];
}
function getCurrentPhase(){
  if(typeof DAY_PHASES === 'undefined') return {emoji:'☀️', name:'День', color:'#5b9eff', desc:''};
  var h = new Date().getHours();
  for(var i = 0; i < DAY_PHASES.length; i++){
    if(h >= DAY_PHASES[i].startHour && h < DAY_PHASES[i].endHour) return DAY_PHASES[i];
  }
  return DAY_PHASES[1];
}
function getDetoxDay(day){
  if(typeof DETOX_COURSE === 'undefined') return null;
  for(var i = 0; i < DETOX_COURSE.length; i++){
    if(DETOX_COURSE[i].day === day) return DETOX_COURSE[i];
  }
  return null;
}
function getCourseById(id){
  if(typeof ALL_NEW_COURSES === 'undefined') return null;
  for(var i = 0; i < ALL_NEW_COURSES.length; i++){
    if(ALL_NEW_COURSES[i].id === id) return ALL_NEW_COURSES[i];
  }
  return null;
}
function getTodayWisdom(){
  if(typeof DAILY_WISDOMS === 'undefined' || !DAILY_WISDOMS.length) return {text:'Начни сейчас.', author:'', action:''};
  var idx = Math.floor(Date.now()/86400000) % DAILY_WISDOMS.length;
  return DAILY_WISDOMS[idx];
}
function getTodayChallenges(){
  if(typeof DAILY_CHALLENGES === 'undefined') return [];
  var dayIdx = Math.floor(Date.now()/86400000);
  var result = [];
  for(var i = 0; i < 4; i++) result.push(DAILY_CHALLENGES[(dayIdx+i)%DAILY_CHALLENGES.length]);
  return result;
}

/* ============ WELCOME ============ */
function showWelcome(){
  var overlay = document.createElement('div');
  overlay.className = 'welcome-screen';
  overlay.innerHTML = '<div class="welcome-logo">🧠</div><div class="welcome-title">Life OS</div><div class="welcome-sub">Нейроэкосистема жизни. 7 сфер, AI-коуч, привычки, проекты, геймификация.</div><button class="btn btn-primary btn-block" style="max-width:340px;" onclick="startOnboarding()">Начать</button>';
  document.body.appendChild(overlay);
}
function startOnboarding(){
  var w = document.querySelector('.welcome-screen');
  if(w) w.remove();
  var name = window.__tgName || '';
  if(!name){
    var o = document.createElement('div');
    o.className = 'welcome-screen';
    o.innerHTML = '<div class="welcome-logo">👤</div><div class="welcome-title">Как тебя зовут?</div><input type="text" class="welcome-input" id="welcome-name" placeholder="Имя" maxlength="30"/><button class="btn btn-primary btn-block mt-4" style="max-width:340px;margin-top:16px;" onclick="finishOnboarding()">Далее</button>';
    document.body.appendChild(o);
    setTimeout(function(){ var i = document.getElementById('welcome-name'); if(i) i.focus(); }, 300);
  } else {
    state.profile.name = name;
    state.settings.onboardingDone = true;
    save();
    updateHeader();
    renderTabBar();
    renderDashboard();
  }
}
function finishOnboarding(){
  var inp = document.getElementById('welcome-name');
  var name = inp ? inp.value.trim() : '';
  if(!name) return toast('Введи имя','error');
  state.profile.name = name;
  state.settings.onboardingDone = true;
  save();
  var w = document.querySelector('.welcome-screen');
  if(w) w.remove();
  updateHeader();
  renderTabBar();
  renderDashboard();
  haptic('success');
  toast('Добро пожаловать, ' + name + '!','success');
}

/* ============ INIT ============ */
function init(){
  try{
    initGlobalSaveControls();
    applyTheme(state.settings.theme);
    applyUserSettings();
    updateHeader();
    initPWAHandlers();
    if(!state.profile.name && !state.settings.onboardingDone){ showWelcome(); window.__LIFE_OS_BOOTED = true; return; }
    if(state.profile.name && !state.settings.onboardingDone){ state.settings.onboardingDone = true; save(); }
    if(!state.profile.name && window.__tgName){ state.profile.name = window.__tgName; save(); }
    if(!state.tasks.length){
      state.tasks = [{id:uid(), title:'Изучить Life OS', category:'Личное', planned_time:10, status:'pending', priority:'medium', created_at:nowISO()}];
      save();
    }
    renderTabBar();
    renderDashboard();
    var t = today();
    if(state.stats.lastActiveDay !== t){
      var y = new Date();
      y.setDate(y.getDate() - 1);
      var wasYesterday = state.stats.lastActiveDay === y.toISOString().slice(0,10);
      state.stats.streak = wasYesterday ? (state.stats.streak||0) + 1 : 1;
      if(state.stats.streak > (state.stats.bestStreak||0)) state.stats.bestStreak = state.stats.streak;
      state.stats.lastActiveDay = t;
      save();
    }
    /* Проверка сброса кулдауна и режима сна */
    checkCooldownAndSleep();
    setTimeout(function(){ try{ refreshSnapshot(); }catch(e){} }, 500);
    setTimeout(function(){ try{ checkAchievements(); }catch(e){} }, 1000);
    setInterval(function(){ try{ save(); }catch(e){} }, 30000);
    setInterval(function(){ try{ checkAchievements(); }catch(e){} }, 5*60*1000);
    setInterval(function(){ try{ checkCooldownAndSleep(); }catch(e){} }, 60000);
    window.__LIFE_OS_BOOTED = true;
    console.log('[INIT ✅] Life OS v' + CURRENT_VERSION);
  }catch(e){
    console.error('[INIT]', e);
    var app = document.getElementById('app');
    if(app) app.innerHTML = '<div class="empty"><div class="empty-icon">⚠️</div><div class="empty-title">Ошибка</div><div class="empty-text">' + esc(e.message) + '</div></div>';
  }
}
function checkCooldownAndSleep(){
  if(!state.detox) return;
  /* Кулдаун */
  if(state.detox.cooldown && state.detox.cooldown.active){
    if(new Date(state.detox.cooldown.until) < new Date()){
      state.detox.cooldown.active = false;
      save();
    }
  }
  /* Режим сна */
  if(state.detox.sleepMode && state.detox.sleepMode.enabled){
    var now = getNowHHMM();
    var start = state.detox.sleepMode.start || '22:00';
    var end = state.detox.sleepMode.end || '07:00';
    var active = false;
    if(start > end){ active = (now >= start || now <= end); }
    else { active = (now >= start && now <= end); }
    state.detox.sleepMode.active = active;
  }
}

/* ============ ПОДКЛЮЧЕНИЕ К WINDOW ============ */
window.renderLearningBase = renderLearning;
window.state = state;
window.save = save;
window.manualSaveAll = manualSaveAll;
window.queueJournalAutosave = queueJournalAutosave;
window.today = today;
window.yesterday = yesterday;
window.nowISO = nowISO;
window.uid = uid;
window.esc = esc;
window.toast = toast;
window.haptic = haptic;
window.updateHeader = updateHeader;
window.renderTabBar = renderTabBar;
window.toggleTabBar = toggleTabBar;
window.applyTheme = applyTheme;
window.applyUserSettings = applyUserSettings;
window.startEffects = startEffects;
window.addXP = addXP;
window.addPetXP = addPetXP;
window.getXPForLevel = getXPForLevel;
window.getXPForNextLevel = getXPForNextLevel;
window.buildUserSnapshot = buildUserSnapshot;
window.refreshSnapshot = refreshSnapshot;
window.getSphere = getSphere;
window.getSpheresBalance = getSpheresBalance;
window.getSphereRecommendations = getSphereRecommendations;
window.getCoachStyle = getCoachStyle;
window.getRandomCoachTip = getRandomCoachTip;
window.getHabitTemplate = getHabitTemplate;
window.getHabitWithWhy = getHabitWithWhy;
window.getHabitsBySphere = getHabitsBySphere;
window.getProjectTemplate = getProjectTemplate;
window.getProjectStatus = getProjectStatus;
window.getCurrentPhase = getCurrentPhase;
window.getDetoxDay = getDetoxDay;
window.getCourseById = getCourseById;
window.getTodayWisdom = getTodayWisdom;
window.getTodayChallenges = getTodayChallenges;
window.getWaterGoal = getWaterGoal;
window.showWelcome = showWelcome;
window.startOnboarding = startOnboarding;
window.finishOnboarding = finishOnboarding;
window.renderStub = renderStub;
window.filterWorkspaceEntries = filterWorkspaceEntries;
window.addWorkspaceEntry = addWorkspaceEntry;
window.toggleWorkspaceEntry = toggleWorkspaceEntry;
window.deleteWorkspaceEntry = deleteWorkspaceEntry;
window.renderStats = renderStats;
window.renderDetailedStats = renderDetailedStats;
window.renderMore = renderMore;
window.renderSettings = renderSettings;
window.renderSettingsV2 = renderSettingsV2;
window.renderProfile = renderProfile;
window.renderProfileV2 = renderProfileV2;
window.saveProfileV2 = saveProfileV2;
window.pickEmoji = pickEmoji;
window.setEmoji = setEmoji;
window.saveProfileName = saveProfileName;
window.exportDB = exportDB;
window.restoreVaultSnapshot = restoreVaultSnapshot;
window.importDB = importDB;
window.resetAllWithConfirm = resetAllWithConfirm;
window.exportToObsidian = exportToObsidian;
window.importFromObsidian = importFromObsidian;
window.renderObsidianIntegration = renderObsidianIntegration;
window.saveTelegramConfig = saveTelegramConfig;
window.sendToTelegram = sendToTelegram;
window.renderTelegramSetup = renderTelegramSetup;
window.sendCoachDailyGreeting = sendCoachDailyGreeting;
window.sendCoachEveningSummary = sendCoachEveningSummary;
window.renderDetox60 = renderDetox60;
window.toggleDetox60Item = toggleDetox60Item;
window.renderGamesHub = renderGamesHub;
window.startGame = startGame;
window.saveGameScore = saveGameScore;
window.miniGameFlip = miniGameFlip;
window.miniGamePuzzleMove = miniGamePuzzleMove;
window.miniGameSequenceAdd = miniGameSequenceAdd;
window.miniGameSequenceCheck = miniGameSequenceCheck;
window.miniGameSequenceReset = miniGameSequenceReset;
window.miniGameGridToggle = miniGameGridToggle;
window.miniGameGridCheck = miniGameGridCheck;
window.miniGameReactionClick = miniGameReactionClick;
window.miniGameMathAnswer = miniGameMathAnswer;
window.miniGameTypingCheck = miniGameTypingCheck;
window.miniGameTargetHit = miniGameTargetHit;
window.renderLeagues = renderLeagues;
window.renderPet = renderPet;
window.feedPet = feedPet;
window.renderDetoxHub = renderDetoxHub;
window.startCooldown = startCooldown;
window.toggleSleepMode = toggleSleepMode;


/* ============ LIFE OS ANALYTICS V2 / PROFILE / PERSONALIZATION ============ */
var LIFE_STATS_FILTER={category:'all',from:'',to:''};
function getLifeStatsFilter(){
  if(state&&state.analyticsFilters)LIFE_STATS_FILTER=Object.assign({},LIFE_STATS_FILTER,state.analyticsFilters);
  return LIFE_STATS_FILTER;
}
function saveLifeStatsFilter(key,value){
  var f=getLifeStatsFilter();f[key]=String(value||'');
  if(!state.analyticsFilters)state.analyticsFilters={};
  state.analyticsFilters[key]=f[key];LIFE_STATS_FILTER=f;save();renderStats();
}
function lifeStatsDateV2(value){
  if(value===null||value===undefined||value==='')return null;
  if(typeof value==='number'&&value<1e12)value*=1000;
  var d=new Date(value);
  if(!Number.isFinite(d.getTime()))return null;
  return d;
}
function lifeStatsDateAllowed(value,days){
  var d=lifeStatsDateV2(value);if(!d)return false;
  var f=getLifeStatsFilter(),start,end;
  if(f.from){start=new Date(f.from+'T00:00:00');if(Number.isFinite(start.getTime())&&d<start)return false;}
  if(f.to){end=new Date(f.to+'T23:59:59.999');if(Number.isFinite(end.getTime())&&d>end)return false;}
  if(f.from||f.to)return true;
  if(Number(days)===0)return d<=new Date();
  var n=Math.max(1,Number(days)||30);start=new Date();start.setHours(0,0,0,0);start.setDate(start.getDate()-n+1);end=new Date();end.setHours(23,59,59,999);
  return d>=start&&d<=end;
}
function buildComprehensiveStats(days){
  var s=state||{},period=Number(days)===0?0:(Number(days)||30),f=getLifeStatsFilter();
  var arr=function(k){return Array.isArray(s[k])?s[k]:[];};
  var dateOf=function(x){return x&&(x.date||x.completedAt||x.completed_at||x.createdAt||x.created_at||x.at||x.timestamp||x.time)||null;};
  var within=function(x){return lifeStatsDateAllowed(x,period);};
  var tasks=arr('tasks'),done=tasks.filter(function(x){return x.status==='completed';}),pending=tasks.filter(function(x){return x.status!=='completed';});
  var completed=done.filter(function(x){return within(x.completedAt||x.completed_at||x.updated_at||x.created_at);});
  var overdue=pending.filter(function(x){return x.due_date&&String(x.due_date).slice(0,10)<today();});
  var habits=arr('habits'),habitHistory=s.habitHistory||{},habitEvents=0,habitDays={};
  Object.keys(habitHistory).forEach(function(id){var rows=habitHistory[id]||{};Object.keys(rows).forEach(function(day){if(rows[day]&&within(day)){habitEvents++;habitDays[day]=(habitDays[day]||0)+1;}});});
  var screen=arr('screenEntries').filter(function(x){return within(dateOf(x));});
  var screenMinutes=screen.reduce(function(n,x){return n+Math.max(0,Number(x.minutes)||0);},0),screenByCategory={};
  screen.forEach(function(x){var k=String(x.category||'Другое');screenByCategory[k]=(screenByCategory[k]||0)+Math.max(0,Number(x.minutes)||0);});
  var screenDates=screen.map(function(x){return String(dateOf(x)||'').slice(0,10);}).filter(Boolean);
  var daysInPeriod=period||0;
  if(f.from||f.to){
    var ds=f.from?new Date(f.from+'T00:00:00'):(f.to?new Date(f.to+'T00:00:00'):new Date());
    var de=f.to?new Date(f.to+'T00:00:00'):new Date();
    if(!f.from&&f.to)ds.setDate(ds.getDate()-(period||29));
    if(!f.from&&!f.to)ds.setDate(ds.getDate()-(period||29));
    daysInPeriod=Math.max(1,Math.floor((de-ds)/86400000)+1);
  }else if(!period){
    var valid=screenDates.slice().sort();var first=valid[0]?new Date(valid[0]+'T00:00:00'):new Date();
    var now=new Date();now.setHours(0,0,0,0);daysInPeriod=Math.max(1,Math.floor((now-first)/86400000)+1);
  }
  if(!daysInPeriod)daysInPeriod=Math.max(1,period||30);
  var screenRecordedDays=Array.from(new Set(screenDates)).length,screenCoveragePct=Math.min(100,Math.round(screenRecordedDays/Math.max(1,daysInPeriod)*100)),screenSampleSufficient=period===0?screenRecordedDays>=7:screenCoveragePct>=50;
  var screenDailyAvg=screenRecordedDays?Math.round(screenMinutes/screenRecordedDays):null;
  var screenGoal=Number(s.profile&&s.profile.surveyAnswers&&s.profile.surveyAnswers.screenTotalMinutes)||Number(s.profile&&s.profile.personalPlan&&s.profile.personalPlan.screenTotalMinutes)||Number(s.screenStats&&s.screenStats.dailyLimit)||null;
  var screenBudgets=(s.profile&&s.profile.surveyAnswers&&s.profile.surveyAnswers.screenBudgets)||{};
  var screenCategoryStats=Object.keys(screenByCategory).map(function(k){var avg=Math.round(screenByCategory[k]/Math.max(1,screenRecordedDays));var goal=Number(screenBudgets[k])||null;return {category:k,total:screenByCategory[k],dailyAvg:avg,target:goal,deviation:goal&&screenSampleSufficient?Math.round((avg-goal)/goal*100):null};}).sort(function(a,b){return b.dailyAvg-a.dailyAvg;});
  var sleep=arr('sleepEntries').filter(function(x){return within(dateOf(x));});
  var sleepMinutes=sleep.reduce(function(n,x){var v=Number(x.minutes);if(!v)v=Number(x.hours)*60;if(!v)v=Number(x.duration);return n+(v>0&&v<1440?v:0);},0);
  var mood=arr('customMood').filter(function(x){return within(dateOf(x));}),water=arr('customWater').filter(function(x){return within(dateOf(x));});
  var workouts=arr('customWorkouts').filter(function(x){return within(dateOf(x));}),meditation=arr('customMeditation').filter(function(x){return within(dateOf(x));});
  var walks=arr('walks').filter(function(x){return within(dateOf(x));}),brain=arr('brainPlays').filter(function(x){return within(dateOf(x));});
  var reviews=s.fsrs&&Array.isArray(s.fsrs.reviews)?s.fsrs.reviews:[],fsrsReviews=reviews.filter(function(x){return within(dateOf(x));});
  var fsrsRetention=fsrsReviews.length?Math.round(fsrsReviews.filter(function(x){return Number(x.rating)>=2;}).length/fsrsReviews.length*100):null;
  var cards=s.fsrs&&s.fsrs.cards||{},fsrsDue=Object.keys(cards).filter(function(id){var c=cards[id];return !c.nextReview||new Date(c.nextReview)<=new Date();}).length;
  var focusHistory=(s.focus&&Array.isArray(s.focus.history)?s.focus.history:[]).concat(Array.isArray(s.timerSessions)?s.timerSessions:[],Array.isArray(s.focusSessions)?s.focusSessions:[]).filter(function(x){return within(dateOf(x));});
  var checkins=s.jarvis&&Array.isArray(s.jarvis.checkins)?s.jarvis.checkins.filter(function(x){return within(dateOf(x));}):[];
  var vision=s.vision||{},metrics=vision.metrics||{},visionDays=Object.keys(metrics).filter(function(day){return within(day);}).sort();
  var fatigue=visionDays.map(function(day){return Number(metrics[day].eyeFatigue)||0;}).filter(function(n){return n>0;});
  var headaches=visionDays.filter(function(day){return !!metrics[day].headaches;}).length;
  var breaks=vision.breakTracker||{},breakHistory=breaks.history||{},breakDone=Object.keys(breakHistory).filter(function(day){return within(day);}).reduce(function(n,day){return n+(Number(breakHistory[day].done)||0);},0);
  var eyeExercises=arr('eyeExercises').filter(function(x){return within(dateOf(x));});
  var detox=s.detox||{},detoxHistory=Array.isArray(detox.history)?detox.history.filter(function(x){return within(dateOf(x));}):[];
  var detoxCourse=Object.keys(s.detoxCourseProgress||{}).filter(function(day){return !!s.detoxCourseProgress[day];}).length;
  var detoxReviews=detoxHistory.filter(function(x){return x.kind==='review'||x.type==='review'||x.screenMinutes!==undefined;});
  var projects=arr('projects'),projectDone=projects.filter(function(x){return x.status==='completed'||x.done;});
  var calendar=arr('calendarEvents').filter(function(x){return within(x.date||x.createdAt);});
  var finance=[];Object.keys(s.workspaces||{}).forEach(function(k){if(/finance|money|budget/i.test(k)&&Array.isArray(s.workspaces[k]))finance=finance.concat(s.workspaces[k]);});
  finance=finance.filter(function(x){return within(dateOf(x));});
  var spheres=s.spheres&&s.spheres.scores||{},sphereValues=Object.keys(spheres).map(function(k){return Number(spheres[k]);}).filter(function(n){return Number.isFinite(n)&&n>0;});
  var count=function(v){return v&&typeof v==='object'?Object.keys(v).length:0;};
  var learningCount=count(s.levelProgress)+count(s.englishProgress)+count(s.skillsProgress)+count(s.memoryProgress)+count(s.iqProgress)+count(s.eqProgress)+count(s.neuroProgress)+count(s.psychologyProgress)+count(s.thinkingProgress);
  var memoryRows=s.memoryTraining&&Array.isArray(s.memoryTraining.sessions)?s.memoryTraining.sessions.filter(function(x){return within(dateOf(x));}):[];
  var avg=function(rows,key){var values=rows.map(function(x){return Number(x[key]);}).filter(function(n){return Number.isFinite(n)&&n>0;});return values.length?Math.round(values.reduce(function(a,b){return a+b;},0)/values.length*10)/10:null;};
  var xpHistory=s.gamification&&Array.isArray(s.gamification.xpHistory)?s.gamification.xpHistory:[];
  var xpPeriod=xpHistory.filter(function(x){return within(dateOf(x));}).reduce(function(n,x){return n+(Number(x.amount)||0);},0);
  var tracked=['tasks','habits','screenEntries','sleepEntries','customMood','customWater','customWorkouts','customMeditation','walks','brainPlays','fsrs','calendarEvents','projects','spheres','memoryProgress','memoryTraining','vision','detox','jarvis','eyeExercises'];
  var active=tracked.filter(function(k){var v=s[k];return Array.isArray(v)?v.length>0:!!(v&&typeof v==='object'&&Object.keys(v).length);}).length;
  var inventory=Object.keys(s).map(function(k){var v=s[k],n=Array.isArray(v)?v.length:(v&&typeof v==='object'?Object.keys(v).length:((v!==null&&v!==undefined&&v!=='')?1:0));return {key:k,count:n,type:Array.isArray(v)?'список':(v&&typeof v==='object'?'объект':'значение')};}).sort(function(a,b){return b.count-a.count;});
  var daily=[],dailyEnd=f.to?new Date(f.to+'T00:00:00'):new Date();dailyEnd.setHours(0,0,0,0);var dailyStart=f.from?new Date(f.from+'T00:00:00'):new Date(dailyEnd);if(!f.from)dailyStart.setDate(dailyStart.getDate()-Math.min(29,Math.max(0,daysInPeriod-1)));var dailyCount=Math.min(30,Math.max(1,Math.floor((dailyEnd-dailyStart)/86400000)+1));for(var off=dailyCount-1;off>=0;off--){var d=new Date(dailyEnd);d.setDate(d.getDate()-off);var key=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');daily.push({date:key,tasks:completed.filter(function(x){return String(x.completedAt||x.completed_at||x.updated_at||'').slice(0,10)===key;}).length,screen:screen.filter(function(x){return String(dateOf(x)||'').slice(0,10)===key;}).reduce(function(n,x){return n+(Number(x.minutes)||0);},0),habits:habitDays[key]||0});}
  var profile=s.profile||{},survey=profile.surveyAnswers||{},sleepTarget=Number(survey.sleepHours)||7.5;
  var recent7=daily.slice(-7),prior7=daily.slice(-14,-7),mean=function(rows,key){return rows.length?Math.round(rows.reduce(function(n,x){return n+(Number(x[key])||0);},0)/rows.length):0;};
  var screenRecent=mean(recent7,'screen'),screenPrevious=mean(prior7,'screen'),taskRecent=mean(recent7,'tasks'),taskPrevious=mean(prior7,'tasks');
  return {
    period:period,label:f.from||f.to?'Выбранный диапазон':(period===0?'За всё время':'За '+period+' дн.'),
    filters:{category:f.category||'all',from:f.from||'',to:f.to||''},daysInPeriod:daysInPeriod,
    overview:{tasksTotal:tasks.length,tasksDone:done.length,tasksPending:pending.length,tasksDonePeriod:completed.length,overdue:overdue.length,habitTotal:habits.length,habitsToday:habits.filter(function(x){return x.lastCompletedDate===today();}).length,habitEvents:habitEvents,streak:Number(s.stats&&s.stats.streak)||0,bestStreak:Number(s.stats&&s.stats.bestStreak)||0,xp:Number(s.gamification&&s.gamification.xp)||Number(s.xp)||0,xpPeriod:xpPeriod,level:Number(s.gamification&&s.gamification.level)||Number(s.level)||1},
    health:{sleepEntries:sleep.length,sleepAvgHours:sleep.length?Math.round(sleepMinutes/sleep.length/60*10)/10:null,sleepTarget:sleepTarget,moodEntries:mood.length,moodAvg:avg(mood,'score'),waterEntries:water.length,waterTotal:water.reduce(function(n,x){return n+(Number(x.count)||Number(x.amount)||0);},0),workouts:workouts.length,meditation:meditation.length,walks:walks.length,walkMinutes:walks.reduce(function(n,x){return n+(Number(x.minutes)||0);},0),antistress:arr('antistressEntries').filter(function(x){return within(dateOf(x));}).length},
    focus:{screenEntries:screen.length,screenMinutes:screenMinutes,screenDailyAvg:screenDailyAvg,screenLimit:screenGoal,screenDeviation:screenGoal&&screenDailyAvg!==null&&screenSampleSufficient?Math.round((screenDailyAvg-screenGoal)/screenGoal*100):null,screenByCategory:screenCategoryStats,screenDays:screenRecordedDays,screenCoveragePct:screenCoveragePct,screenSampleSufficient:screenSampleSufficient,focusSessions:focusHistory.length,focusMinutes:focusHistory.reduce(function(n,x){return n+(Number(x.minutes)||Number(x.duration)||0);},0),checkins:checkins.length,energyAvg:avg(checkins,'energy'),concentrationAvg:avg(checkins,'focus'),sleepQualityAvg:avg(checkins,'sleep'),stressAvg:avg(checkins,'stress')},
    learning:{progressItems:learningCount,brainPlays:brain.length,brainAvgScore:avg(brain,'score'),fsrsCards:count(cards),fsrsReviews:fsrsReviews.length,fsrsDue:fsrsDue,fsrsRetention:fsrsRetention,memorySessions:memoryRows.length,memoryAccuracy:memoryRows.length?Math.round(memoryRows.reduce(function(n,x){return n+(Number(x.accuracy)||Math.round((Number(x.score)||0)/Math.max(1,Number(x.length)||1)*100));},0)/memoryRows.length):null,memoryBestSpan:Number(s.memoryTraining&&s.memoryTraining.bestSpan)||0,eyeExercises:eyeExercises.length,studySessions:(Array.isArray(s.learningSessions)?s.learningSessions:[]).filter(function(x){return within(dateOf(x));}).length,studyMinutes:(Array.isArray(s.learningSessions)?s.learningSessions:[]).filter(function(x){return within(dateOf(x));}).reduce(function(n,x){return n+(Number(x.minutes)||0);},0),studyDue:(Array.isArray(s.learningSessions)?s.learningSessions:[]).filter(function(x){return x.nextReviewAt&&String(x.nextReviewAt).slice(0,10)<=today();}).length},
    life:{projects:projects.length,projectsDone:projectDone.length,calendarEvents:calendar.length,calendarDone:calendar.filter(function(x){return x.done;}).length,sphereScores:sphereValues.length,sphereAverage:sphereValues.length?Math.round(sphereValues.reduce(function(a,b){return a+b;},0)/sphereValues.length*10)/10:null,financeEntries:finance.length,financeNet:finance.reduce(function(n,x){return n+(Number(x.amount)||0);},0),visionLogs:visionDays.length,eyeFatigueAvg:fatigue.length?Math.round(fatigue.reduce(function(a,b){return a+b;},0)/fatigue.length*10)/10:null,headaches:headaches,eyeBreaks:breakDone,detoxEntries:detoxHistory.length+detoxCourse,memoryItems:count(s.memoryProgress)+count(cards),detoxReviews:detoxReviews.length},
    coverage:{activeSections:active,totalTracked:tracked.length,percent:Math.round(active/tracked.length*100),inventory:inventory},comparison:{screenRecentDaily:screenRecent,screenPreviousDaily:screenPrevious,screenChangePercent:screenPrevious?Math.round((screenRecent-screenPrevious)/screenPrevious*100):null,tasksRecentDaily:taskRecent,tasksPreviousDaily:taskPrevious,tasksChangePercent:taskPrevious?Math.round((taskRecent-taskPrevious)/taskPrevious*100):null},daily:daily
  };
}
function getJarvisAnalytics(silent){
  var a=buildComprehensiveStats(LIFE_STATS_PERIOD),items=[],focus=25,profile=state.profile||{},survey=profile.surveyAnswers||{};
  var push=function(id,level,title,detail,action,target,confidence){items.push({id:id,level:level,title:title,detail:detail,action:action,target:target||'stats',confidence:confidence||'По сохранённым записям'});};
  if(a.overview.overdue)push('overdue','high','Просроченные задачи',a.overview.overdue+' задач требуют пересмотра.','Разобрать сроки и оставить реалистичный план.','tasks',a.overview.overdue+' задач');
  if(a.overview.tasksPending>8)push('overload','medium','Слишком длинный список задач','Активных задач: '+a.overview.tasksPending+'.','Выбрать до трёх главных результатов и разбить следующий шаг.','tasks');
  if(a.focus.screenDailyAvg!==null){
    if(!getLifeStatsFilter().from&&!getLifeStatsFilter().to&&a.comparison.screenChangePercent!==null&&a.comparison.screenChangePercent>20)push('screen-trend','medium','Экранное время заметно выросло','Среднее за последние 7 дней выше предыдущих 7 дней на '+a.comparison.screenChangePercent+'%.','Проверь, какая категория выросла, и выбери одно небольшое ограничение на следующую неделю.','screentracker','Сравнение двух недель');
    if(a.focus.screenLimit&&!a.focus.screenSampleSufficient)push('screen-coverage','info','Пока мало записей для честного сравнения','Есть '+a.focus.screenDays+' дней с записями из '+a.analytics.daysInPeriod+' дней выбранного периода.','Записывай экранное время регулярно; пока не считаем пропущенные дни нулевыми.','screentracker',a.focus.screenCoveragePct+'% покрытия');
    if(a.focus.screenLimit&&a.focus.screenSampleSufficient&&a.focus.screenDailyAvg>a.focus.screenLimit)push('screen','high','Экранное время выше личной цели','Среднее '+a.focus.screenDailyAvg+' мин/день при цели '+a.focus.screenLimit+' мин/день ('+Math.abs(a.focus.screenDeviation)+'% выше).','Сократить наиболее затратную категорию, добавить запланированные офлайн-паузы и проверить результат через 7 дней.','screentracker',a.focus.screenEntries+' записей');
    else if(!a.focus.screenLimit)push('screen-target','info','Не задана личная цель экранного времени','Есть '+a.focus.screenMinutes+' минут записей за выбранный период, но нет сохранённого целевого лимита.','Заполни короткую анкету или задай лимит в трекере, чтобы сравнение было персональным.','personalization');
    a.focus.screenByCategory.forEach(function(x){if(a.focus.screenSampleSufficient&&x.target&&x.dailyAvg>x.target)push('screen-'+x.category,'medium','Перерасход: '+x.category,x.dailyAvg+' мин/день при бюджете '+x.target+' мин ('+x.deviation+'% выше).','Уменьшить эту категорию небольшим шагом и повторно оценить среднее через неделю.','screentracker',x.total+' минут записано');});
  }else push('screen-data','info','Недостаточно данных об экранном времени','Экранное время не считывается автоматически: статистика использует только ручные записи.','Вноси фактические минуты по категориям или подключи отдельную нативную интеграцию.','screentracker');
  if(a.health.sleepAvgHours!==null&&a.health.sleepAvgHours<a.health.sleepTarget-0.5)push('sleep','high','Сон ниже личной цели','Среднее '+a.health.sleepAvgHours+' ч при цели '+a.health.sleepTarget+' ч.','Проверь вечерний график и попробуй сдвинуть подготовку ко сну на 15–30 минут.','sleep',a.health.sleepEntries+' записей');
  if(a.health.sleepAvgHours===null)push('sleep-data','info','Нет достаточных записей о сне','Без записей нельзя оценить динамику сна.','Записывай время сна и пробуждения; не делаем выводов по отсутствующим данным.','sleep');
  if(a.focus.energyAvg!==null&&a.focus.energyAvg<2.8){focus=15;push('energy','high','Низкая энергия','Средняя самооценка '+a.focus.energyAvg+'/5.','Снизить длительность фокуса до 15 минут, выбрать одну небольшую задачу и оценить состояние позже.','ai',a.focus.checkins+' самооценок');}
  if(a.focus.concentrationAvg!==null&&a.focus.concentrationAvg<2.8){focus=Math.min(focus,15);push('concentration','medium','Снижение концентрации','Средняя оценка '+a.focus.concentrationAvg+'/5.','Убрать переключения, разбить работу на короткие блоки и сделать паузу.','focus');}
  if(a.overview.habitTotal&&a.overview.habitsToday<a.overview.habitTotal)push('habits','info','Не все привычки отмечены сегодня',a.overview.habitsToday+' из '+a.overview.habitTotal+' отмечены на сегодня.','Проверь, реалистична ли нагрузка; используй минимальную версию привычки.','habitList');
  if(a.learning.studyDue)push('study-due','medium','Пора проверить изученное',a.learning.studyDue+' тем ждут активного воспроизведения.','Вспомни материал без подсказки, затем проверь себя.','learningPractice');
  if(a.learning.fsrsDue)push('reviews','medium','Накопились повторения',a.learning.fsrsDue+' карточек ожидают повторения.','Сделай короткую сессию активного воспроизведения.','fsrs');
  if(a.life.eyeFatigueAvg!==null&&a.life.eyeFatigueAvg>=7)push('vision-fatigue','medium','Повышенная усталость глаз','Средняя оценка усталости '+a.life.eyeFatigueAvg+'/10.','Сделай перерыв от экрана, проверь освещение и дистанцию. При стойкой боли, ухудшении или внезапных симптомах обратись к специалисту.','vision');
  if(a.life.headaches>=3)push('vision-headache','high','Повторяющиеся записи о головной боли','За период отмечено '+a.life.headaches+' дней с головной болью.','Не продолжай упражнения через боль; обратись за медицинской оценкой, если симптом повторяется или усиливается.','vision');
  if(a.life.detoxReviews&&a.life.detoxReviews<3)push('detox-feedback','info','Нужно проверить эффект детокса','Мало записей с оценкой результата: '+a.life.detoxReviews+'.','После практики зафиксируй тягу, фактическое экранное время и самочувствие — затем сравним динамику.','detox');
  if(a.coverage.percent<30)push('coverage','info','Недостаточно данных для точных решений','Заполнено '+a.coverage.activeSections+' из '+a.coverage.totalTracked+' отслеживаемых областей.','Заполняй только важные тебе трекеры. Пустые разделы не считаются плохими результатами.','personalization');
  if(!items.length)push('steady','good','Критичных отклонений не найдено','По доступным записям цели не нарушены.','Продолжай наблюдение и сравни результаты на следующем недельном обзоре.','stats');
  return {at:nowISO(),period:a.label,analytics:a,items:items,focusSuggestion:focus};
}
function setStatsPeriod(days){LIFE_STATS_PERIOD=Number(days)===0?0:(Number(days)||30);if(state.analyticsFilters){state.analyticsFilters.from='';state.analyticsFilters.to='';}LIFE_STATS_FILTER.from='';LIFE_STATS_FILTER.to='';save();renderStats();}
function setStatsDateFilter(){var from=(document.getElementById('statsFrom')||{}).value||'',to=(document.getElementById('statsTo')||{}).value||'';if(from&&to&&from>to)return toast('Начало периода позже окончания','warning');saveLifeStatsFilter('from',from);saveLifeStatsFilter('to',to);}
function renderStats(){
  var a=buildComprehensiveStats(LIFE_STATS_PERIOD),o=a.overview,h=a.health,f=a.focus,l=a.learning,v=a.life,c=a.coverage,filter=getLifeStatsFilter(),analysis=getJarvisAnalytics(true);
  var cat=filter.category||'all',show=function(k){return cat==='all'||cat===k;},fmt=function(n){return n===null||n===undefined?'—':String(n);};
  var html='<div class="page"><div class="title-xl">📊 Полная аналитика LIFE OS</div><div class="subtitle">Показатели, личные цели, динамика и рекомендации Джарвиса. Только сохранённые данные.</div>';
  html+='<div class="card mb-3"><div class="card-title">Фильтры аналитики</div><div class="btn-row mb-2">';
  [[7,'7 дней'],[30,'30 дней'],[90,'90 дней'],[0,'Всё время']].forEach(function(x){html+='<button class="btn '+(LIFE_STATS_PERIOD===x[0]&&!filter.from&&!filter.to?'btn-primary':'btn-ghost')+' btn-xs" onclick="setStatsPeriod('+x[0]+')">'+x[1]+'</button>';});
  html+='</div><div class="grid-2"><div class="field"><label class="field-label">С даты</label><input type="date" id="statsFrom" value="'+esc(filter.from||'')+'" onchange="setStatsDateFilter()"></div><div class="field"><label class="field-label">По дату</label><input type="date" id="statsTo" value="'+esc(filter.to||'')+'" onchange="setStatsDateFilter()"></div></div>';
  html+='<div class="field"><label class="field-label">Направление</label><select onchange="saveLifeStatsFilter(\'category\',this.value)">';
  [['all','Все разделы'],['productivity','Работа и задачи'],['screen','Экранное время'],['health','Здоровье и сон'],['learning','Обучение и память'],['life','Жизненные сферы']].forEach(function(x){html+='<option value="'+x[0]+'" '+(cat===x[0]?'selected':'')+'>'+x[1]+'</option>';});
  html+='</select></div><div class="footnote">Период: '+esc(a.label)+' · календарных дней в расчёте: '+a.daysInPeriod+'. Изменение фильтров пересчитывает и рекомендации.</div></div>';
  html+='<div class="card card-gradient mb-3"><div class="row-between"><span>Уровень '+o.level+'</span><span>'+o.streak+' 🔥 дней активности</span></div><div style="font-size:34px;font-weight:850;margin:8px 0">'+o.xp+' XP</div><div class="footnote">+'+o.xpPeriod+' XP за период · лучший streak '+o.bestStreak+'</div></div>';
  html+='<div class="grid-2 mb-3"><div class="card"><div class="stat-value">'+o.tasksDonePeriod+'</div><div class="stat-label">Задач выполнено</div></div><div class="card"><div class="stat-value">'+o.tasksPending+'</div><div class="stat-label">Активных задач</div></div><div class="card"><div class="stat-value">'+fmt(f.screenDailyAvg)+'</div><div class="stat-label">Экран, мин/день</div></div><div class="card"><div class="stat-value">'+fmt(h.sleepAvgHours)+'</div><div class="stat-label">Сон, часов/ночь</div></div></div>';
  html+='<div class="card mb-3"><div class="card-title">🧭 Анализ и решения Джарвиса</div><div class="footnote mb-2">Сравнивает фактические записи с твоими целями. Автоматические изменения ограничены безопасными настройками; личные данные и задачи без подтверждения не меняются.</div>';
  analysis.items.forEach(function(x){var color=x.level==='high'?'var(--danger)':x.level==='good'?'var(--success)':'var(--brand)';html+='<div class="list-row" style="align-items:flex-start"><div style="width:8px;height:8px;border-radius:50%;background:'+color+';margin-top:7px;flex-shrink:0"></div><div class="list-body"><div class="list-title">'+esc(x.title)+'</div><div class="footnote">'+esc(x.detail)+'</div><div class="footnote mt-1">'+esc(x.action)+'</div><div class="footnote mt-1">Основание: '+esc(x.confidence)+'</div></div><button class="btn btn-ghost btn-xs" onclick="applyJarvisRecommendation(\''+x.id+'\')">Открыть</button></div>';});
  html+='<button class="btn btn-primary btn-block mt-2" onclick="runJarvisAutopilot(false);renderStats()">↻ Пересчитать аналитику</button><button class="btn btn-ghost btn-block mt-2" onclick="askJarvisAboutStats()">✧ Обсудить этот период с Джарвисом</button><button class="btn btn-ghost btn-block mt-2" onclick="navigate(\'ai\')">Открыть Джарвиса</button></div>';
  if(show('all')||show('productivity'))html+='<div class="card mb-3"><div class="card-title">🎯 Работа, задачи и привычки</div>'+statsBar('Завершённые задачи за период',o.tasksDonePeriod,Math.max(1,o.tasksTotal),'')+statsBar('Привычки, отмеченные сегодня',o.habitsToday,Math.max(1,o.habitTotal),'')+'<div class="grid-2"><div><b>'+o.overdue+'</b><div class="footnote">Просрочено</div></div><div><b>'+o.tasksPending+'</b><div class="footnote">В работе</div></div><div><b>'+o.habitEvents+'</b><div class="footnote">Отметок привычек</div></div><div><b>'+o.habitTotal+'</b><div class="footnote">Активных привычек</div></div></div><button class="btn btn-ghost btn-block mt-2" onclick="navigate(\'tasks\')">Задачи и приоритеты</button></div>';
  if(show('all')||show('screen')){html+='<div class="card mb-3"><div class="card-title">📱 Экранное время: факт против цели</div><div class="grid-2"><div><b>'+fmt(f.screenDailyAvg)+' мин</b><div class="footnote">Среднее в день</div></div><div><b>'+(f.screenLimit?f.screenLimit+' мин':'Не задана')+'</b><div class="footnote">Личная цель</div></div><div><b>'+f.screenMinutes+' мин</b><div class="footnote">Всего записано</div></div><div><b>'+(f.screenDeviation===null?'—':(f.screenDeviation>0?'+':'')+f.screenDeviation+'%')+'</b><div class="footnote">Отклонение от цели</div></div></div>';
    if(f.screenLimit&&f.screenDailyAvg!==null&&f.screenSampleSufficient)html+=statsBar('Дневной лимит',f.screenDailyAvg,f.screenLimit,' мин');
    html+='<div class="section-title mt-2">По категориям</div>';
    if(!f.screenByCategory.length)html+='<div class="footnote">Нет записей за этот период.</div>';
    f.screenByCategory.forEach(function(x){html+='<div class="list-row"><div class="list-body"><div class="list-title">'+esc(x.category)+'</div><div class="footnote">'+x.total+' мин всего · '+x.dailyAvg+' мин/день'+(x.target?' · цель '+x.target+' мин/день':' · цель не задана')+'</div></div><div class="list-value">'+(x.deviation===null?'—':(x.deviation>0?'+':'')+x.deviation+'%')+'</div></div>';});
    html+='<button class="btn btn-ghost btn-block mt-2" onclick="navigate(\'screentracker\')">Открыть трекер экрана</button><div class="footnote mt-2">Дней с записями: '+f.screenDays+' из '+a.daysInPeriod+' ('+f.screenCoveragePct+'%). Среднее считается только по дням с фактическими записями, пропуски не считаются нулём. Учёт ручной; автоматические данные Android/Windows требуют отдельной нативной интеграции.</div></div>';}
  if(show('all')||show('health'))html+='<div class="card mb-3"><div class="card-title">❤️ Здоровье и восстановление</div><div class="grid-2"><div><b>'+fmt(h.sleepAvgHours)+' ч</b><div class="footnote">Средний сон</div></div><div><b>'+h.sleepTarget+' ч</b><div class="footnote">Твоя цель сна</div></div><div><b>'+fmt(h.moodAvg)+'/10</b><div class="footnote">Настроение</div></div><div><b>'+h.waterTotal+'</b><div class="footnote">Единиц воды в журнале</div></div><div><b>'+h.workouts+'</b><div class="footnote">Тренировок</div></div><div><b>'+h.meditation+'</b><div class="footnote">Медитаций</div></div><div><b>'+h.walks+'</b><div class="footnote">Прогулок</div></div><div><b>'+h.walkMinutes+' мин</b><div class="footnote">Ходьба</div></div><div><b>'+h.antistress+'</b><div class="footnote">Антистресс-сессий</div></div></div><div class="footnote mt-2">Это журнал самонаблюдения, не медицинская оценка.</div></div>';
  if(show('all')||show('learning'))html+='<div class="card mb-3"><div class="card-title">🧠 Обучение и память</div><div class="grid-2"><div><b>'+l.progressItems+'</b><div class="footnote">Элементов учебного прогресса</div></div><div><b>'+l.brainPlays+'</b><div class="footnote">Тренировок мозга</div></div><div><b>'+l.fsrsCards+'</b><div class="footnote">Карточек FSRS</div></div><div><b>'+l.fsrsDue+'</b><div class="footnote">К повторению сейчас</div></div><div><b>'+l.fsrsReviews+'</b><div class="footnote">Повторений за период</div></div><div><b>'+fmt(l.brainAvgScore)+'</b><div class="footnote">Средний балл тренировки</div></div><div><b>'+l.eyeExercises+'</b><div class="footnote">Практик для глаз отмечено</div></div></div><button class="btn btn-ghost btn-block mt-2" onclick="navigate(\'fsrs\')">Открыть интервальное повторение</button></div>';
  if(show('all')||show('life'))html+='<div class="card mb-3"><div class="card-title">🌐 Жизненные направления</div><div class="grid-2"><div><b>'+v.projectsDone+'/'+v.projects+'</b><div class="footnote">Завершено проектов</div></div><div><b>'+v.calendarDone+'/'+v.calendarEvents+'</b><div class="footnote">Выполнено событий</div></div><div><b>'+fmt(v.sphereAverage)+'/10</b><div class="footnote">Средняя оценка сфер</div></div><div><b>'+v.financeEntries+'</b><div class="footnote">Финансовых записей</div></div><div><b>'+v.financeNet.toLocaleString('ru-RU')+'</b><div class="footnote">Сальдо записей</div></div><div><b>'+v.detoxEntries+'</b><div class="footnote">Записей детокса</div></div></div></div>';
  if(show('all')||show('health'))html+='<div class="card mb-3"><div class="card-title">👁 Зрение и цифровая нагрузка</div><div class="grid-2"><div><b>'+fmt(v.eyeFatigueAvg)+'/10</b><div class="footnote">Средняя усталость глаз</div></div><div><b>'+v.headaches+'</b><div class="footnote">Дней с головной болью</div></div><div><b>'+v.eyeBreaks+'</b><div class="footnote">Перерывов 20-20-20</div></div><div><b>'+v.visionLogs+'</b><div class="footnote">Дней с метриками</div></div></div><button class="btn btn-ghost btn-block mt-2" onclick="navigate(\'vision\')">Открыть программу зрения</button></div>';
  if(show('all')||show('life'))html+='<div class="card mb-3"><div class="card-title">🧘 Детокс: проверка результата</div><div class="grid-2"><div><b>'+v.detoxEntries+'</b><div class="footnote">Практик и записей</div></div><div><b>'+v.detoxReviews+'</b><div class="footnote">Оценок эффекта</div></div></div><button class="btn btn-primary btn-block mt-2" onclick="navigate(\'detox\')">Открыть анализ детокса</button></div>';
  html+='<div class="card mb-3"><div class="card-title">📈 Динамика последних 30 дней</div>';
  a.daily.forEach(function(d){var max=Math.max(1,...a.daily.map(function(x){return x.screen;}));html+='<div class="mb-2"><div class="row-between"><span class="footnote">'+d.date.slice(5)+'</span><span class="footnote">'+d.tasks+' задач · '+d.screen+' мин экрана · '+d.habits+' привычек</span></div><div style="height:5px;background:var(--glass-2);border-radius:9px;margin-top:4px;overflow:hidden"><div style="height:100%;width:'+Math.min(100,d.screen/max*100)+'%;background:var(--brand)"></div></div></div>';});
  html+='</div><div class="card mb-3"><div class="card-title">🧾 Полнота данных</div><div class="stat-value">'+c.percent+'%</div><div class="footnote">'+c.activeSections+' из '+c.totalTracked+' основных областей имеют записи. Отсутствие записей не считается плохим результатом.</div><details class="mt-2"><summary>Инвентаризация данных</summary>';
  c.inventory.forEach(function(x){html+='<div class="list-row"><div class="list-body"><div class="list-title">'+esc(x.key)+'</div><div class="footnote">'+esc(x.type)+'</div></div><div class="list-value">'+x.count+'</div></div>';});
  html+='</details></div><button class="btn btn-ghost btn-block" onclick="exportDB()">📤 Экспортировать данные</button></div>';
  document.getElementById('app').innerHTML=html;
}
function renderDetailedStats(){renderStats();}


/* LIFE OS PERSONALIZATION V2 */
var LIFE_SURVEY_STEPS=[
{title:'🎯 Цели',desc:'Что приложение должно улучшить?',fields:[
['goals','Главные цели','multi',['Продуктивность','Обучение','Память','Здоровье и энергия','Сон','Зрение','Экранное время','Привычки','Финансы','Эмоциональный баланс']],
['mainGoal','Главный результат на 3 месяца','text'],
['obstacles','Что чаще мешает?','multi',['Телефон','Нет энергии','Сложно начать','Нет плана','Много задач','Нерегулярный сон','Теряю интерес','Не хватает времени']]]},
{title:'🗓 Режим дня',desc:'Настроим под реальную нагрузку.',fields:[
['workHours','Работа, часов в день','select',['0','1','2','2.5','3','4','5','6','8+']],
['studyHours','Учёба, часов в день','select',['0','0.5','1','1.5','2','2.5','3','4+']],
['freeMinutes','Свободное время, минут','select',['15','30','45','60','90','120','Более 2 часов']],
['sleepStart','Обычно ложусь','time'],['wakeTime','Обычно просыпаюсь','time']]},
{title:'📱 Экранное время',desc:'Задай личные лимиты. Аналитика будет сравнивать с фактом.',fields:[
['screenTotalMinutes','Общий лимит в день, минут','number'],
['budgetWork','Работа, минут','number'],['budgetStudy','Учёба, минут','number'],['budgetVideo','Видео / YouTube, минут','number'],['budgetEntertainment','Развлечения, минут','number'],['budgetOther','Прочее, минут','number'],
['screenPain','Когда чаще всего залипаешь?','multi',['После пробуждения','Перед сном','Во время работы','Во время учёбы','Когда скучно/тревожно','Не замечаю время','Пока не знаю']]]},
{title:'⏱ Фокус',desc:'Подберём рабочие блоки.',fields:[
['focusMinutes','Длительность фокуса, минут','select',['10','15','20','25','30','45','50','60']],
['planningStyle','Как планировать?','select',['Список задач','Календарь по времени','3 главных результата','Гибкий план']],
['workStyle','Когда лучше работаешь?','select',['Утром','Днём','Вечером','Ночью','По-разному']],
['breakStyle','Перерывы','select',['5 минут после 25','10 минут после 50','По самочувствию','Подобрать автоматически']]]},
{title:'🎓 Обучение и память',desc:'Настроим практику и повторение.',fields:[
['learningStyle','Как лучше учишься?','multi',['Короткая теория','Примеры','Практика','Тесты','Карточки','Видео/аудио','Проекты']],
['learningMinutes','Учебный блок, минут','select',['10','15','20','25','30','45','60']],
['learningPriority','Что важнее развивать?','multi',['Память','Внимание','Мышление','Английский','Профессия','Эрудиция','Глубокое понимание']],
['difficulty','Сложность','select',['Постепенно','Средняя','С вызовом','Адаптировать по результатам']]]},
{title:'❤️ Восстановление',desc:'Ориентиры самонаблюдения, не медицинская диагностика.',fields:[
['sleepHours','Цель сна, часов','select',['6','6.5','7','7.5','8','8.5','9']],
['exerciseDays','Движение в неделю, дней','select',['0','1','2','3','4','5','6','7']],
['walkMinutes','Прогулка, минут в день','select',['0','10','20','30','45','60','90']],
['recoveryPriority','Что улучшить?','multi',['Энергия','Сон','Стресс','Активность','Комфорт глаз','Настроение']]]},
{title:'⚙️ Как работает LIFE OS',desc:'Настроим интерфейс и помощь.',fields:[
['assistantTone','Стиль Джарвиса','select',['Кратко и по делу','Подробно','Строго','Поддерживающе','Аналитично']],
['reminders','Какие напоминания нужны?','multi',['Утренний план','Перерывы от экрана','Вода и движение','Повторение','Подготовка ко сну','Вечерний обзор','Не нужны']],
['notificationLevel','Частота','select',['Только важные','Умеренно','Чаще при пропусках','Без уведомлений']],
['interfaceDensity','Плотность интерфейса','select',['Компактный','Сбалансированный','Подробный']],
['accessibility','Доступность','multi',['Крупнее текст','Меньше анимаций','Высокий контраст','Меньше уведомлений','Виброотклик','Озвучивание']]]}
];
function lifeSurveyRead(){
 var step=Math.max(0,Math.min(LIFE_SURVEY_STEPS.length-1,Number(state.profile.surveyStep)||0)),answers=state.profile.surveyAnswers||{};
 LIFE_SURVEY_STEPS[step].fields.forEach(function(f){var id=f[0];if(f[2]==='multi')answers[id]=Array.from(document.querySelectorAll('[name="survey-'+id+'"]:checked')).map(function(x){return x.value;});else{var el=document.getElementById('survey-'+id);if(el)answers[id]=el.value;}});
 state.profile.surveyAnswers=answers;save();
}
function renderPersonalizationSurvey(){
 var step=Math.max(0,Math.min(LIFE_SURVEY_STEPS.length-1,Number(state.profile.surveyStep)||0)),cfg=LIFE_SURVEY_STEPS[step],a=state.profile.surveyAnswers||{};
 var html='<div class="page"><div class="title-xl">🧭 Персональная настройка</div><div class="subtitle">7 коротких этапов. Можно пропускать вопросы и менять ответы позже.</div><div class="card mb-3"><div class="row-between"><b>Этап '+(step+1)+' / '+LIFE_SURVEY_STEPS.length+'</b><b>'+Math.round((step+1)/LIFE_SURVEY_STEPS.length*100)+'%</b></div><div class="progress mt-2"><div class="progress-fill" style="width:'+((step+1)/LIFE_SURVEY_STEPS.length*100)+'%"></div></div></div><div class="card"><h2>'+cfg.title+'</h2><div class="footnote mb-3">'+cfg.desc+'</div>';
 cfg.fields.forEach(function(f){var id=f[0],type=f[2];html+='<div class="field"><label class="field-label">'+f[1]+'</label>';
 if(type==='multi'){var selected=Array.isArray(a[id])?a[id]:[];f[3].forEach(function(o){html+='<label class="list-row"><input type="checkbox" name="survey-'+id+'" value="'+esc(o)+'" '+(selected.indexOf(o)>=0?'checked':'')+'><span>'+esc(o)+'</span></label>';});}
 else if(type==='select'){html+='<select id="survey-'+id+'"><option value="">Выбрать…</option>';f[3].forEach(function(o){html+='<option '+(String(a[id]||'')===o?'selected':'')+'>'+esc(o)+'</option>';});html+='</select>';}
 else html+='<input id="survey-'+id+'" type="'+(type==='number'?'number':type==='time'?'time':'text')+'" min="0" max="1440" inputmode="numeric" value="'+esc(a[id]||'')+'" placeholder="Необязательно">';
 html+='</div>';});
 html+='</div><div class="btn-row mt-3">'+(step?'<button class="btn btn-ghost" onclick="lifeSurveyMove(-1)">← Назад</button>':'')+'<button class="btn btn-primary" style="flex:1" onclick="lifeSurveyMove(1)">'+(step===LIFE_SURVEY_STEPS.length-1?'Сохранить цели':'Далее →')+'</button></div><button class="btn btn-ghost btn-block mt-2" onclick="lifeSurveySkip()">Пропустить этап</button><div class="footnote text-center mt-2">Ответы остаются в локальном профиле и входят в резервную копию.</div></div>';
 document.getElementById('app').innerHTML=html;
}
function lifeSurveyMove(delta){lifeSurveyRead();var step=Number(state.profile.surveyStep)||0;if(step+delta>=LIFE_SURVEY_STEPS.length){finishLifePersonalization();return;}state.profile.surveyStep=step+delta;save();renderPersonalizationSurvey();}
function lifeSurveySkip(){lifeSurveyRead();var step=Number(state.profile.surveyStep)||0;if(step>=LIFE_SURVEY_STEPS.length-1){finishLifePersonalization();return;}state.profile.surveyStep=step+1;save();renderPersonalizationSurvey();}
function finishLifePersonalization(){
 var p=state.profile,a=p.surveyAnswers||{},budgets={};
 [['Работа','budgetWork'],['Учёба','budgetStudy'],['Видео','budgetVideo'],['Развлечения','budgetEntertainment'],['Другое','budgetOther']].forEach(function(x){var n=Number(a[x[1]]);if(n>0)budgets[x[0]]=n;});
 a.screenBudgets=budgets;p.surveyAnswers=a;p.surveyDone=true;p.surveyCompletedAt=nowISO();p.surveyStep=0;
 p.personalPlan={goals:a.goals||[],mainGoal:a.mainGoal||'',screenTotalMinutes:Number(a.screenTotalMinutes)||null,screenBudgets:budgets,sleepHours:Number(a.sleepHours)||7.5,focusMinutes:Number(a.focusMinutes)||25,learningStyle:a.learningStyle||[],updatedAt:nowISO()};
 if(p.personalPlan.screenTotalMinutes){state.screenStats=state.screenStats||{};state.screenStats.dailyLimit=p.personalPlan.screenTotalMinutes;}
 if(state.settingsV2){state.settingsV2.textSize=(a.accessibility||[]).indexOf('Крупнее текст')>=0?'large':'medium';state.settingsV2.animations=(a.accessibility||[]).indexOf('Меньше анимаций')<0;}
 save();toast('Профиль, цели и лимиты сохранены','success');navigate('profile');
}
function updateLifePreference(group,key,value){
 var allow={settingsV2:['textSize','scale','sound','soundVolume','haptic','animations','animationsSpeed','language','firstDayOfWeek','timeFormat','dateFormat','darkMode','effectsEnabled','effectsIntensity','effectsMotionOverride']};
 if(!allow[group]||allow[group].indexOf(key)<0)return;if(!state[group])state[group]={};state[group][key]=value;
 if(key==='effectsEnabled'||key==='effectsIntensity'||key==='effectsMotionOverride'){state.settings[key]=value;startEffects();}
 if(key==='animations'||key==='textSize'||key==='scale')applyUserSettings();
 save();if(currentPage==='settings')renderSettings();
}
function renderSettings(){
 var s=state.settingsV2||defaultState().settingsV2,themes=window.THEMES||[],theme=themes.find(function(t){return t.id===state.settings.theme;})||{name:'Тёмная'};
 var row=function(title,desc,control){return '<div class="list-row"><div class="list-body"><div class="list-title">'+title+'</div><div class="footnote">'+desc+'</div></div>'+control+'</div>';};
 var toggle=function(k,title,desc,v){return row(title,desc,'<button class="btn '+(v?'btn-primary':'btn-ghost')+' btn-xs" onclick="updateLifePreference(\'settingsV2\',\''+k+'\','+(!v)+')">'+(v?'Вкл.':'Выкл.')+'</button>');};
 var html='<div class="page"><div class="title-xl">⚙️ Профессиональные настройки</div><div class="subtitle">Управление персонализацией, интерфейсом, доступностью и данными.</div><div class="card"><h2>👤 Профиль и цели</h2>'+row('Профиль','Личные параметры, цели и прогресс','<button class="btn btn-primary btn-xs" onclick="navigate(\'profile\')">Открыть</button>')+row('Большая анкета','7 этапов · быстрое заполнение · персональный план','<button class="btn btn-ghost btn-xs" onclick="state.profile.surveyStep=0;save();navigate(\'personalization\')">Заполнить</button>')+'</div>';
 html+='<div class="card"><h2>🎨 Внешний вид</h2>'+row('Тема','Сейчас: '+esc(theme.name),'<button class="btn btn-ghost btn-xs" onclick="openThemePicker()">Выбрать</button>')+toggle('animations','Анимации интерфейса','Переходы и микровзаимодействия',s.animations!==false)+toggle('effectsEnabled','Частицы и фоновые эффекты','Необязательная визуальная нагрузка',state.settings.effectsEnabled!==false)+toggle('effectsMotionOverride','Переопределить системное ограничение','Включать эффекты при prefers-reduced-motion',!!state.settings.effectsMotionOverride);
 html+='<div class="card"><h2>♿ Доступность</h2>'+row('Размер текста','Комфортное чтение','<select onchange="updateLifePreference(\'settingsV2\',\'textSize\',this.value)"><option value="small" '+(s.textSize==='small'?'selected':'')+'>Маленький</option><option value="medium" '+(!s.textSize||s.textSize==='medium'?'selected':'')+'>Обычный</option><option value="large" '+(s.textSize==='large'?'selected':'')+'>Крупный</option></select>')+row('Масштаб','Размер элементов','<select onchange="updateLifePreference(\'settingsV2\',\'scale\',this.value)"><option value="90" '+(s.scale==='90'?'selected':'')+'>90%</option><option value="100" '+(!s.scale||s.scale==='100'?'selected':'')+'>100%</option><option value="110" '+(s.scale==='110'?'selected':'')+'>110%</option><option value="125" '+(s.scale==='125'?'selected':'')+'>125%</option></select>')+toggle('haptic','Тактильный отклик','Вибрация при поддержке устройством',s.haptic!==false)+'</div>';
 html+='<div class="card"><h2>🔔 Напоминания</h2><div class="footnote">Выбранные типы и частота сохраняются в персональной анкете. Push-уведомления зависят от разрешений браузера/Telegram.</div><button class="btn btn-ghost btn-block mt-2" onclick="navigate(\'notifications\')">Центр уведомлений</button></div>';
 html+='<div class="card"><h2>🛡 Данные и приватность</h2><div class="footnote mb-2">Анкета, цели, трекеры и история входят в локальную резервную копию.</div><button class="btn btn-primary btn-block mb-2" onclick="exportDB()">📤 Экспорт JSON</button><button class="btn btn-ghost btn-block mb-2" onclick="importDB()">📥 Импорт JSON</button><button class="btn btn-ghost btn-block" onclick="navigate(\'storage\')">Хранилище и резервирование</button></div><div class="footnote text-center">LIFE OS v'+CURRENT_VERSION+'</div></div>';
 document.getElementById('app').innerHTML=html;
}
function renderSettingsV2(){renderSettings();}
function renderProfileV2(){
 var p=state.profileV2||{},profile=state.profile||{},a=profile.surveyAnswers||{},plan=profile.personalPlan||{},g=state.gamification||{},goals=Array.isArray(a.goals)?a.goals:[];
 var html='<div class="page"><div class="title-xl">👤 Персональный профиль</div><div class="profile-hero"><div class="avatar-btn" onclick="pickEmoji()" style="width:84px;height:84px;margin:0 auto 10px;font-size:42px">'+(profile.emoji||'👤')+'</div><div class="field"><label class="field-label">Имя</label><input id="profileNameField" maxlength="30" value="'+esc(profile.name||'')+'"></div><button class="btn btn-ghost btn-sm" onclick="saveProfileName((document.getElementById(\'profileNameField\')||{}).value)">Сохранить имя</button><div class="footnote mt-2">Уровень '+(g.level||1)+' · '+(g.xp||0)+' XP</div></div>';
 html+='<div class="card"><h2>🎯 Персональные цели</h2><div class="footnote">'+(goals.length?goals.map(esc).join(' · '):'Анкета ещё не заполнена')+'</div>'+(a.mainGoal?'<div class="list-row"><div class="list-body"><b>Главная цель</b><div class="footnote">'+esc(a.mainGoal)+'</div></div></div>':'')+'<div class="grid-2 mt-2"><div><b>'+(plan.screenTotalMinutes||'—')+'</b><div class="footnote">Экран, мин/день</div></div><div><b>'+(plan.sleepHours||'—')+'</b><div class="footnote">Сон, часов</div></div><div><b>'+(plan.focusMinutes||'—')+'</b><div class="footnote">Фокус, минут</div></div><div><b>'+(profile.surveyDone?'Заполнена':'Не заполнена')+'</b><div class="footnote">Анкета</div></div></div><button class="btn btn-primary btn-block mt-3" onclick="state.profile.surveyStep=0;save();navigate(\'personalization\')">'+(profile.surveyDone?'Изменить персонализацию':'Заполнить большую анкету')+'</button></div>';
 html+='<div class="card"><h2>📏 Параметры</h2><div class="grid-2"><div class="field"><label class="field-label">Возраст</label><input type="number" id="pv-age" min="1" max="120" value="'+(p.age||'')+'"></div><div class="field"><label class="field-label">Рост, см</label><input type="number" id="pv-height" min="50" max="250" value="'+(p.height||'')+'"></div><div class="field"><label class="field-label">Вес, кг</label><input type="number" id="pv-weight" min="20" max="400" step="0.1" value="'+(p.weight||'')+'"></div></div><div class="field"><label class="field-label">Активность</label><select id="pv-activity"><option value="low" '+(p.activity==='low'?'selected':'')+'>Низкая</option><option value="moderate" '+(!p.activity||p.activity==='moderate'?'selected':'')+'>Умеренная</option><option value="high" '+(p.activity==='high'?'selected':'')+'>Высокая</option></select></div><div class="field"><label class="field-label">Основной фокус</label><select id="pv-goal"><option value="maintain" '+(!p.goal||p.goal==='maintain'?'selected':'')+'>Баланс</option><option value="fitness" '+(p.goal==='fitness'?'selected':'')+'>Физическая форма</option><option value="energy" '+(p.goal==='energy'?'selected':'')+'>Энергия</option><option value="learning" '+(p.goal==='learning'?'selected':'')+'>Обучение</option></select></div><button class="btn btn-primary btn-block" onclick="saveProfileV2()">Сохранить параметры</button></div><button class="btn btn-ghost btn-block" onclick="navigate(\'stats\')">📊 Аналитика</button><button class="btn btn-ghost btn-block mt-2" onclick="navigate(\'settings\')">⚙️ Настройки</button>'+renderPWAInstallBlock()+'</div>';
 document.getElementById('app').innerHTML=html;
}
function saveProfileV2(){
 if(!state.profileV2)state.profileV2=defaultState().profileV2;var p=state.profileV2;
 p.age=Number((document.getElementById('pv-age')||{}).value)||null;
 p.height=Number((document.getElementById('pv-height')||{}).value)||null;p.weight=Number((document.getElementById('pv-weight')||{}).value)||null;
 p.activity=(document.getElementById('pv-activity')||{}).value||'moderate';p.goal=(document.getElementById('pv-goal')||{}).value||'maintain';p.updatedAt=nowISO();save();toast('Параметры профиля сохранены','success');renderProfileV2();
}


/* DETOX OUTCOME TRACKING: baseline -> intervention -> outcome */
function buildDetoxOutcomeStats(){
 var rows=state.detox&&Array.isArray(state.detox.history)?state.detox.history.filter(function(x){return x&&x.kind==='review';}):[];
 var recent=rows.slice(-14),avg=function(key){var v=recent.map(function(x){return x[key];}).filter(function(x){return x!==null&&x!==undefined&&x!==' ';}).map(Number).filter(function(n){return Number.isFinite(n)&&n>=0;});return v.length?Math.round(v.reduce(function(a,b){return a+b;},0)/v.length*10)/10:null;};
 var reductions=recent.map(function(x){return Number(x.urgeBefore)-Number(x.urgeAfter);}).filter(Number.isFinite);
 return {total:rows.length,recent:recent.length,urgeBefore:avg('urgeBefore'),urgeAfter:avg('urgeAfter'),urgeReduction:reductions.length?Math.round(reductions.reduce(function(a,b){return a+b;},0)/reductions.length*10)/10:null,screen:avg('screenMinutes'),focus:avg('focusAfter'),mood:avg('moodAfter'),rows:rows};
}
function renderDetoxReview(){
 var html='<div class="page"><div class="title-xl">🧪 Проверка эффекта детокса</div><div class="subtitle">Зафиксируй состояние до и после практики. Через несколько записей LIFE OS покажет, что действительно помогает.</div><div class="card"><h2>Самооценка после практики</h2><div class="field"><label class="field-label">Тяга открыть отвлекающее приложение ДО, 0–10</label><input id="detoxUrgeBefore" type="number" min="0" max="10" value="6"></div><div class="field"><label class="field-label">Тяга ПОСЛЕ, 0–10</label><input id="detoxUrgeAfter" type="number" min="0" max="10" value="3"></div><div class="field"><label class="field-label">Экранное время сегодня, минут (если знаешь)</label><input id="detoxScreenMinutes" type="number" min="0" max="1440" placeholder="Необязательно"></div><div class="field"><label class="field-label">Концентрация после, 1–5</label><select id="detoxFocusAfter"><option value="">Нет оценки</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></div><div class="field"><label class="field-label">Самочувствие после, 1–5</label><select id="detoxMoodAfter"><option value="">Нет оценки</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></select></div><div class="field"><label class="field-label">Что помогло?</label><select id="detoxAction"><option>Убрал телефон подальше</option><option>Прогулка</option><option>Дыхание / пауза</option><option>Заменил привычку другим действием</option><option>Блокировка уведомлений</option><option>Начал конкретную задачу</option><option>Другое</option></select></div><div class="field"><label class="field-label">Триггер или заметка</label><input id="detoxTrigger" maxlength="240" placeholder="Например: открыл видео от скуки"></div><button class="btn btn-primary btn-block" onclick="saveDetoxReview()">Сохранить результат</button></div><button class="btn btn-ghost btn-block" onclick="navigate(\'detox\')">← Назад к детоксу</button></div>';
 document.getElementById('app').innerHTML=html;
}
function saveDetoxReview(){
 var before=Number(document.getElementById('detoxUrgeBefore').value),after=Number(document.getElementById('detoxUrgeAfter').value),screenRaw=document.getElementById('detoxScreenMinutes').value;
 if(screenRaw!==''&&(!Number.isFinite(Number(screenRaw))||Number(screenRaw)<0||Number(screenRaw)>1440))return toast('Экранное время должно быть от 0 до 1440 минут','warning');
 if(!Number.isFinite(before)||!Number.isFinite(after)||before<0||before>10||after<0||after>10)return toast('Оцени тягу от 0 до 10','warning');
 if(!state.detox)state.detox=defaultState().detox;if(!Array.isArray(state.detox.history))state.detox.history=[];
 state.detox.history.push({id:uid(),kind:'review',date:today(),at:nowISO(),urgeBefore:before,urgeAfter:after,screenMinutes:(document.getElementById('detoxScreenMinutes').value===''?null:Number(document.getElementById('detoxScreenMinutes').value)),focusAfter:(document.getElementById('detoxFocusAfter').value===''?null:Number(document.getElementById('detoxFocusAfter').value)),moodAfter:(document.getElementById('detoxMoodAfter').value===''?null:Number(document.getElementById('detoxMoodAfter').value)),action:document.getElementById('detoxAction').value,trigger:(document.getElementById('detoxTrigger').value||'').trim()});
 if(state.detox.history.length>500)state.detox.history=state.detox.history.slice(-500);
 save();toast('Результат практики сохранён','success');navigate('detox');
}
function renderDetoxHub(){
 var d=state.detox||defaultState().detox,stats=buildDetoxOutcomeStats(),html='<div class="page"><div class="title-xl">🧘 Цифровой детокс</div><div class="subtitle">Не просто отмечай задания: измеряй тягу, экранное время и концентрацию до и после изменений.</div>';
 html+='<div class="grid-2 mb-3"><div class="card"><div class="stat-value">'+(d.stats&&d.stats.cooldownCount||0)+'</div><div class="stat-label">Кулдаунов</div></div><div class="card"><div class="stat-value">'+stats.total+'</div><div class="stat-label">Оценок эффекта</div></div></div>';
 html+='<div class="card mb-3"><h2>📉 Помогает ли детокс?</h2><div class="grid-2"><div><b>'+(stats.urgeBefore===null?'—':stats.urgeBefore+'/10')+'</b><div class="footnote">Тяга до практики</div></div><div><b>'+(stats.urgeAfter===null?'—':stats.urgeAfter+'/10')+'</b><div class="footnote">Тяга после</div></div><div><b>'+(stats.urgeReduction===null?'—':(stats.urgeReduction>0?'+':'')+stats.urgeReduction)+'</b><div class="footnote">Среднее снижение тяги</div></div><div><b>'+(stats.screen===null?'—':stats.screen+' мин')+'</b><div class="footnote">Средний экран в записях</div></div><div><b>'+(stats.focus===null?'—':stats.focus+'/5')+'</b><div class="footnote">Концентрация после</div></div><div><b>'+(stats.mood===null?'—':stats.mood+'/5')+'</b><div class="footnote">Самочувствие после</div></div></div><div class="footnote mt-2">'+(stats.total<3?'Нужно ещё минимум 3 записи, чтобы осторожно оценивать закономерности.':'Сравнивай не один день, а тенденцию последних 14 записей. Это личный эксперимент, не клиническая оценка.')+'</div><button class="btn btn-primary btn-block mt-2" onclick="navigate(\'detoxReview\')">＋ Записать результат практики</button></div>';
 html+='<div class="card mb-3"><h2>❄️ Пауза перед импульсом</h2><div class="footnote mb-2">Короткая пауза помогает заметить автоматическое действие. Запиши, что вызвало желание открыть приложение.</div><button class="btn btn-primary btn-block" onclick="startCooldown()">Начать 10-минутную паузу</button></div>';
 html+='<div class="card mb-3"><h2>😴 Режим сна</h2><div class="footnote">Расписание сна: '+esc((d.sleepMode&&d.sleepMode.start)||'22:00')+' — '+esc((d.sleepMode&&d.sleepMode.end)||'07:00')+'. Переключатель сохраняет предпочтение; он не блокирует системные приложения.</div><button class="btn '+(d.sleepMode&&d.sleepMode.enabled?'btn-primary':'btn-ghost')+' btn-block" onclick="toggleSleepMode()">'+(d.sleepMode&&d.sleepMode.enabled?'Выключить':'Включить')+'</button></div>';
 html+='<div class="card mb-3"><h2>📚 Программа и привычки</h2><button class="btn btn-ghost btn-block mb-2" onclick="navigate(\'detox60\')">60-дневная программа</button><button class="btn btn-ghost btn-block" onclick="navigate(\'detoxcourse\')">62-дневный курс</button></div>';
 if(stats.rows.length){html+='<div class="card"><h2>Последние результаты</h2>';stats.rows.slice(-8).reverse().forEach(function(x){html+='<div class="list-row"><div class="list-body"><div class="list-title">'+esc(x.date||'')+' · '+esc(x.action||'Практика')+'</div><div class="footnote">Тяга '+x.urgeBefore+' → '+x.urgeAfter+'/10'+(x.screenMinutes!==null?' · экран '+x.screenMinutes+' мин':'')+'</div>'+(x.trigger?'<div class="footnote">'+esc(x.trigger)+'</div>':'')+'</div><div class="list-value">'+(x.urgeBefore>x.urgeAfter?'↓':'↔')+'</div></div>';});html+='</div>';}
 html+='</div>';document.getElementById('app').innerHTML=html;
}
function startCooldown(){
 if(!state.detox)state.detox=defaultState().detox;if(!state.detox.stats)state.detox.stats={cooldownCount:0,pauseCount:0,sleepHours:0,screenMinutes:0,byApp:{}};
 state.detox.cooldown={active:true,until:new Date(Date.now()+10*60*1000).toISOString(),minutes:10,trigger:'manual'};state.detox.stats.cooldownCount++;
 if(!Array.isArray(state.detox.history))state.detox.history=[];state.detox.history.push({id:uid(),kind:'practice',date:today(),at:nowISO(),action:'10-минутная пауза'});
 save();toast('Пауза запущена. После неё оцени эффект в детокс-разделе.','success');
}


/* VISION CARE V2: timed breaks + self-observation */
function startVisionBreak(){
 if(window.__visionBreakTicker){toast('Перерыв уже идёт','info');return;}
 window.__visionBreakEndsAt=Date.now()+20000;
 openSheet('👁 Перерыв для глаз','<div style="text-align:center;padding:20px"><div class="stat-value" id="visionBreakCountdown" style="font-size:48px">20</div><div class="footnote">Посмотри на удалённый объект примерно на 6 метров и спокойно поморгай. Не смотри на солнце.</div><button class="btn btn-ghost btn-block mt-3" onclick="cancelVisionBreak()">Отменить</button></div>');
 window.__visionBreakTicker=setInterval(function(){
  var left=Math.max(0,Math.ceil((window.__visionBreakEndsAt-Date.now())/1000)),el=document.getElementById('visionBreakCountdown');if(el)el.textContent=left;
  if(left<=0)finishVisionBreak();
 },200);
}
function finishVisionBreak(){
 if(window.__visionBreakTicker){clearInterval(window.__visionBreakTicker);window.__visionBreakTicker=null;}
 if(!state.vision)state.vision=defaultState().vision;
 var v=state.vision,t=today();if(!v.breakTracker)v.breakTracker={today:{done:0,target:12},history:{}};
 if(!v.breakTracker.history)v.breakTracker.history={};
 if(!v.breakTracker.history[t])v.breakTracker.history[t]={done:0,target:12};
 v.breakTracker.history[t].done++;v.breakTracker.history[t].lastBreakAt=nowISO();
 v.breakTracker.today={done:v.breakTracker.history[t].done,target:v.breakTracker.history[t].target||12,lastBreakAt:nowISO()};
 addXP(2,'vision');addPetXP(1);save();closeSheet();toast('Перерыв завершён и записан','success');if(currentPage==='vision')renderVision();
}
function cancelVisionBreak(){if(window.__visionBreakTicker){clearInterval(window.__visionBreakTicker);window.__visionBreakTicker=null;}closeSheet();}
function saveVisionCheckin(){
 if(!state.vision)state.vision=defaultState().vision;if(!state.vision.metrics)state.vision.metrics={};
 var t=today(),old=state.vision.metrics[t]||{};
 var fatigue=Number((document.getElementById('visionFatigue')||{}).value),hours=Number((document.getElementById('visionScreenHours')||{}).value),dryness=Number((document.getElementById('visionDryness')||{}).value);
 if(!Number.isFinite(fatigue)||fatigue<0||fatigue>10)return toast('Усталость: значение от 0 до 10','warning');
 state.vision.metrics[t]=Object.assign({},old,{eyeFatigue:fatigue,screenHours:Number.isFinite(hours)&&hours>=0?hours:old.screenHours||0,dryness:Number.isFinite(dryness)&&dryness>=0?dryness:old.dryness||0,headaches:!!((document.getElementById('visionHeadache')||{}).checked),updatedAt:nowISO()});
 save();toast('Наблюдение за глазами сохранено','success');renderVision();
}
function renderVision(){
 var v=state.vision||defaultState().vision,m=v.metrics||{},todayMetric=m[today()]||{},breaks=v.breakTracker&&v.breakTracker.today||{done:0,target:12},days=Object.keys(m).sort().slice(-14),avg=days.length?Math.round(days.reduce(function(n,k){return n+(Number(m[k].eyeFatigue)||0);},0)/days.length*10)/10:null;
 var html='<div class="page"><div class="title-xl">👁 Зрение и комфорт глаз</div><div class="subtitle">Гигиена зрения, перерывы и наблюдение за симптомами. Упражнения не исправляют близорукость/дальнозоркость и не заменяют проверку у офтальмолога.</div>';
 if(v.redFlags&&v.redFlags.active)html+='<div class="card"><h2>⚠️ Есть тревожные симптомы</h2><div class="footnote">При внезапном ухудшении зрения, сильной боли, вспышках/всплывающих пятнах или травме нужна срочная профессиональная оценка. Не продолжай упражнения через боль.</div></div>';
 html+='<div class="card mb-3"><h2>⏱ Перерыв 20 секунд</h2><div class="grid-2"><div><div class="stat-value">'+breaks.done+'/'+(breaks.target||12)+'</div><div class="stat-label">Перерывов сегодня</div></div><div><div class="stat-value">'+(avg===null?'—':avg+'/10')+'</div><div class="stat-label">Усталость глаз · среднее 14 дней</div></div></div><button class="btn btn-primary btn-block mt-3" onclick="startVisionBreak()">Начать настоящий 20-секундный перерыв</button><div class="footnote mt-2">Правило 20-20-20 — напоминание регулярно отводить взгляд вдаль; таймер засчитывает перерыв только после завершения 20 секунд.</div></div>';
 html+='<div class="card mb-3"><h2>📋 Самонаблюдение сегодня</h2><div class="field"><label class="field-label">Усталость глаз, 0–10</label><input id="visionFatigue" type="number" min="0" max="10" value="'+(todayMetric.eyeFatigue===undefined?3:todayMetric.eyeFatigue)+'"></div><div class="field"><label class="field-label">Часы у экрана</label><input id="visionScreenHours" type="number" min="0" max="24" step="0.5" value="'+(todayMetric.screenHours||'')+'"></div><div class="field"><label class="field-label">Сухость / дискомфорт, 0–10</label><input id="visionDryness" type="number" min="0" max="10" value="'+(todayMetric.dryness||0)+'"></div><label class="list-row"><input type="checkbox" id="visionHeadache" '+(todayMetric.headaches?'checked':'')+'><span>Сегодня была головная боль</span></label><button class="btn btn-primary btn-block mt-2" onclick="saveVisionCheckin()">Сохранить наблюдение</button></div>';
 html+='<div class="card mb-3"><h2>🧩 Практические инструменты</h2><button class="btn btn-ghost btn-block mb-2" onclick="navigate(\'visiontrack\')">История и динамика</button><button class="btn btn-ghost btn-block mb-2" onclick="navigate(\'visiontips\')">Эргономика и гигиена</button><button class="btn btn-ghost btn-block mb-2" onclick="navigate(\'vision60\')">Каталог упражнений</button><button class="btn btn-ghost btn-block" onclick="navigate(\'vision62\')">Программа привычек на 62 дня</button></div>';
 html+='<div class="footnote">Если усталость или сухость повторяются, проверь освещение, блики, размер текста и расстояние до экрана; при стойких симптомах запишись на проверку зрения.</div></div>';
 document.getElementById('app').innerHTML=html;
}
function renderVisionTracker(){
 var v=state.vision||defaultState().vision,m=v.metrics||{},keys=Object.keys(m).sort().slice(-30),rows=keys.map(function(k){return m[k];}),avg=function(key){var a=rows.map(function(x){return Number(x[key]);}).filter(function(n){return Number.isFinite(n)&&n>=0;});return a.length?Math.round(a.reduce(function(x,y){return x+y;},0)/a.length*10)/10:null;};
 var html='<div class="page"><div class="title-xl">📊 История комфорта глаз</div><div class="grid-2 mb-3"><div class="card"><div class="stat-value">'+(avg('eyeFatigue')===null?'—':avg('eyeFatigue')+'/10')+'</div><div class="stat-label">Средняя усталость</div></div><div class="card"><div class="stat-value">'+(avg('dryness')===null?'—':avg('dryness')+'/10')+'</div><div class="stat-label">Средняя сухость</div></div></div><div class="card">';
 if(!keys.length)html+='<div class="empty-title">Пока нет наблюдений</div>';
 keys.reverse().forEach(function(k){var x=m[k];html+='<div class="list-row"><div class="list-body"><div class="list-title">'+esc(k)+'</div><div class="footnote">Усталость '+(x.eyeFatigue??'—')+'/10 · сухость '+(x.dryness??'—')+'/10 · экран '+(x.screenHours??'—')+' ч · головная боль '+(x.headaches?'да':'нет')+'</div></div></div>';});
 html+='</div><button class="btn btn-primary btn-block mt-3" onclick="navigate(\'vision\')">← К разделу зрения</button></div>';document.getElementById('app').innerHTML=html;
}


/* LEARNING PRACTICE: active recall and measured review */
function getLearningSessions(){if(!Array.isArray(state.learningSessions))state.learningSessions=[];return state.learningSessions;}
function renderLearning(){
 renderLearningLegacy();
 var rows=getLearningSessions(),due=rows.filter(function(x){return x.nextReviewAt&&String(x.nextReviewAt).slice(0,10)<=today();}),minutes=rows.reduce(function(n,x){return n+(Number(x.minutes)||0);},0);
 var root=document.querySelector('#app .page');if(!root)return;
 var memoryMetrics=getMemoryTrainingMetrics();var html='<div class="card mb-3"><h2>🧠 Ежедневный план развития памяти · 10 минут</h2><div class="grid-2"><div><b>Рабочая</b><div class="footnote">3 мин · '+(memoryMetrics.workingAccuracy===null?'нет замеров':memoryMetrics.workingAccuracy+'% точности')+'</div></div><div><b>Кратковременная</b><div class="footnote">3 мин · '+(memoryMetrics.shortAccuracy===null?'нет замеров':memoryMetrics.shortAccuracy+'% точности')+'</div></div><div><b>Долговременная</b><div class="footnote">4 мин · '+memoryMetrics.fsrsDue+' карточек к повторению · удержание '+(memoryMetrics.longTermAccuracy===null?'нет замеров':memoryMetrics.longTermAccuracy+'%')+'</div></div><div><b>Лучший объём</b><div class="footnote">'+memoryMetrics.bestSpan+' элементов</div></div></div><button class="btn btn-primary btn-block mt-2" onclick="navigate(\'memory\')">Открыть тренировку памяти</button></div><div class="card mb-3"><h2>🧠 Практика активного воспроизведения</h2><div class="grid-2"><div><b>'+rows.length+'</b><div class="footnote">Учебных сессий</div></div><div><b>'+minutes+' мин</b><div class="footnote">Время практики</div></div><div><b>'+due.length+'</b><div class="footnote">Повторить сейчас</div></div><div><b>'+((state.profile&&state.profile.surveyAnswers&&state.profile.surveyAnswers.learningMinutes)||25)+'</b><div class="footnote">Цель блока, минут</div></div></div><button class="btn btn-primary btn-block mt-2" onclick="navigate(\'learningPractice\')">Начать практику и проверить память</button>';
 if(due.length){html+='<div class="section-title mt-3">Материал к повторению</div>';due.slice(0,5).forEach(function(x){html+='<div class="list-row"><div class="list-body"><div class="list-title">'+esc(x.topic)+'</div><div class="footnote">Повторений: '+(x.reviewCount||0)+' · срок '+esc(String(x.nextReviewAt).slice(0,10))+'</div></div><button class="btn btn-ghost btn-xs" onclick="startLearningReview(\''+x.id+'\')">Повторить</button></div>';});}
 html+='</div>';root.insertAdjacentHTML('afterbegin',html);
}
function renderLearningPractice(){
 var rows=getLearningSessions(),due=rows.filter(function(x){return x.nextReviewAt&&String(x.nextReviewAt).slice(0,10)<=today();});
 var html='<div class="page"><div class="title-xl">🧠 Активное воспроизведение</div><div class="subtitle">Сначала вспомни ответ без подсказок, затем сравни с заметками и оцени уверенность.</div><div class="card"><h2>Новая тема</h2><div class="field"><label class="field-label">Тема / навык</label><input id="learnTopic" maxlength="120" placeholder="Например: основы JavaScript"></div><div class="field"><label class="field-label">Вопрос для самопроверки</label><input id="learnPrompt" maxlength="240" placeholder="Что я должен вспомнить?"></div><div class="field"><label class="field-label">Что удалось вспомнить без подсказки?</label><textarea id="learnRecall" rows="4" placeholder="Запиши своими словами"></textarea></div><div class="field"><label class="field-label">Уверенность в воспроизведении</label><select id="learnConfidence"><option value="1">1 — почти ничего не вспомнил</option><option value="2">2 — вспомнил мало</option><option value="3" selected>3 — частично</option><option value="4">4 — почти всё</option><option value="5">5 — уверенно и точно</option></select></div><div class="field"><label class="field-label">Минут практики</label><input id="learnMinutes" type="number" min="1" max="240" value="15"></div><button class="btn btn-primary btn-block" onclick="saveLearningPractice()">Сохранить результат и запланировать повторение</button></div>';
 html+='<div class="card"><h2>⏰ К повторению</h2>';
 if(!due.length)html+='<div class="footnote">Нет просроченных повторений. Новые темы появятся здесь после первой практики.</div>';
 due.forEach(function(x){html+='<div class="list-row"><div class="list-body"><div class="list-title">'+esc(x.topic)+'</div><div class="footnote">'+esc(x.prompt||'')+' · повторений '+(x.reviewCount||0)+'</div></div><button class="btn btn-ghost btn-xs" onclick="startLearningReview(\''+x.id+'\')">Проверить</button></div>';});
 html+='</div><button class="btn btn-ghost btn-block" onclick="navigate(\'learning\')">← К обучению</button></div>';document.getElementById('app').innerHTML=html;
}
function learningNextInterval(rating,reviewCount){var base=({1:1,2:2,3:4,4:7,5:14})[Number(rating)]||2;var reps=Math.max(0,Math.min(6,Number(reviewCount)||0));if(Number(rating)<=2)return base;return Math.min(60,Math.round(base*Math.pow(1.35,reps)));}
function saveLearningPractice(){
 var topic=(document.getElementById('learnTopic').value||'').trim(),prompt=(document.getElementById('learnPrompt').value||'').trim(),recall=(document.getElementById('learnRecall').value||'').trim(),confidence=Number(document.getElementById('learnConfidence').value),minutes=Number(document.getElementById('learnMinutes').value);
 if(!topic||!recall)return toast('Укажи тему и запиши, что вспомнил','warning');
 if(!Number.isFinite(minutes)||minutes<1||minutes>240)return toast('Время должно быть от 1 до 240 минут','warning');
 var d=new Date();d.setDate(d.getDate()+learningNextInterval(confidence));
 getLearningSessions().push({id:uid(),topic:topic,prompt:prompt,recall:recall,confidence:confidence,minutes:minutes,date:today(),createdAt:nowISO(),reviewCount:0,nextReviewAt:d.toISOString().slice(0,10),history:[]});
 save();toast('Сессия сохранена. Повторение назначено на '+d.toLocaleDateString('ru-RU'),'success');renderLearningPractice();
}
function startLearningReview(id){
 var x=getLearningSessions().find(function(r){return r.id===id;});if(!x)return;
 openSheet('Повторение: '+x.topic,'<div class="footnote mb-2">'+esc(x.prompt||'Вспомни главное по теме без подсказок.')+'</div><div class="field"><label class="field-label">Что вспомнил сейчас?</label><textarea id="learnReviewRecall" rows="4"></textarea></div><div class="field"><label class="field-label">Насколько хорошо вспомнил?</label><select id="learnReviewRating"><option value="1">Забыл</option><option value="2">Трудно</option><option value="3" selected>Нормально</option><option value="4">Хорошо</option><option value="5">Легко</option></select></div><button class="btn btn-primary btn-block" onclick="saveLearningReview(\''+id+'\')">Сохранить повторение</button>');
}
function saveLearningReview(id){
 var x=getLearningSessions().find(function(r){return r.id===id;});if(!x)return;
 var recall=(document.getElementById('learnReviewRecall')||{}).value||'',rating=Number((document.getElementById('learnReviewRating')||{}).value)||3;
 if(!recall.trim())return toast('Сначала воспроизведи ответ по памяти','warning');
 var prior=Number(x.reviewCount)||0,interval=learningNextInterval(rating,prior),d=new Date();d.setDate(d.getDate()+interval);x.reviewCount=prior+1;x.nextReviewAt=d.toISOString().slice(0,10);x.lastReviewedAt=nowISO();x.lastRating=rating;x.lastIntervalDays=interval;x.lapses=(Number(x.lapses)||0)+(rating===1?1:0);
 if(!Array.isArray(x.history))x.history=[];x.history.push({at:nowISO(),rating:rating,recall:recall.trim(),intervalDays:interval});if(x.history.length>50)x.history=x.history.slice(-50);
 save();closeSheet();toast('Следующее повторение: '+d.toLocaleDateString('ru-RU'),'success');renderLearningPractice();
}

function applyJarvisRecommendation(id){
 var analysis=getJarvisAnalytics(true),item=analysis.items.find(function(x){return x.id===id;});if(!item)return;
 if(id==='energy'||id==='concentration'||id==='overload'){getJarvisState().focusDefault=15;save();toast('Фокус установлен на 15 минут','success');navigate('ai');return;}
 if(item.target){navigate(item.target);return;}
 navigate('stats');
}
/* Expose new inline-action handlers from the IIFE */
window.runJarvisAutopilot=runJarvisAutopilot;
window.setJarvisAutopilot=setJarvisAutopilot;
window.renderJarvisCheckin=renderJarvisCheckin;
window.renderJarvisMethods=renderJarvisMethods;
window.saveLifeStatsFilter=saveLifeStatsFilter;
window.setStatsDateFilter=setStatsDateFilter;
window.setStatsPeriod=setStatsPeriod;
window.applyJarvisRecommendation=applyJarvisRecommendation;
window.renderPersonalizationSurvey=renderPersonalizationSurvey;
window.lifeSurveyMove=lifeSurveyMove;
window.lifeSurveySkip=lifeSurveySkip;
window.finishLifePersonalization=finishLifePersonalization;
window.updateLifePreference=updateLifePreference;
window.renderDetoxReview=renderDetoxReview;
window.saveDetoxReview=saveDetoxReview;
window.buildDetoxOutcomeStats=buildDetoxOutcomeStats;
window.renderLearningPractice=renderLearningPractice;
window.saveLearningPractice=saveLearningPractice;
window.startLearningReview=startLearningReview;
window.saveLearningReview=saveLearningReview;
window.startVisionBreak=startVisionBreak;
window.finishVisionBreak=finishVisionBreak;
window.cancelVisionBreak=cancelVisionBreak;
window.saveVisionCheckin=saveVisionCheckin;

/* Заглушки на window */
window.renderMemory = renderMemory;
window.startMemoryExercise = startMemoryExercise;
window.submitMemoryAnswer = submitMemoryAnswer;
window.quickWaterLog = quickWaterLog;
window.quickMoodLog = quickMoodLog;
window.saveMood = saveMood;
window.addWater = addWater;
window.removeWater = removeWater;
window.manualSaveAll = manualSaveAll;
window.renderIQ = renderIQ;
window.renderEQ = renderEQ;
window.renderFinance = renderFinance;
window.renderNeuro = renderNeuro;
window.renderPsychology = renderPsychology;
window.renderThinking = renderThinking;
window.renderEtiquette = renderEtiquette;
window.renderHormones = renderHormones;
window.renderWealth = renderWealth;
window.renderPlanning = renderPlanning;
window.renderPlanToday = renderPlanToday;
window.renderPlanWeek = renderPlanWeek;
window.renderPlanMonth = renderPlanMonth;
window.renderObsidian = renderObsidian;
window.renderMethods = renderMethods;
window.renderRecovery = renderRecovery;
window.renderMedical = renderMedical;
window.renderEntertainment = renderEntertainment;
window.renderResources = renderResources;
window.renderMovies = renderMovies;
window.renderSeries = renderSeries;
window.renderBooks = renderBooks;
window.renderMusic = renderMusic;
window.renderGames = renderGames;
window.renderPodcasts = renderPodcasts;
window.renderGoals = renderGoals;
window.renderNotes = renderNotes;
window.renderJournal = renderJournal;
window.renderDailySurvey = renderDailySurvey;
window.renderSurvey = renderSurvey;
window.renderPersonalPlan = renderPersonalPlan;
window.renderLearningGames = renderLearningGames;
window.renderGamePlay = renderGamePlay;
window.renderMaterials = renderMaterials;
window.renderMaterialDetail = renderMaterialDetail;
window.renderDailyReport = renderDailyReport;
window.renderWeeklyReport = renderWeeklyReport;
window.renderSnapshot = renderSnapshot;
window.renderRecommendations = renderRecommendations;
window.renderSchedule = renderSchedule;
window.renderScheduleEditor = renderScheduleEditor;
window.renderFocus = renderFocus;
window.renderEveningReview = renderEveningReview;
window.renderDailyReport = renderDailyReport;
window.saveDailyReview = saveDailyReview;
window.renderWeeklyReview = renderWeeklyReview;
window.saveWeeklyReview = saveWeeklyReview;
window.renderMonthlyReview = renderMonthlyReview;
window.saveMonthlyReview = saveMonthlyReview;
window.renderTimer = renderTimer;
window.renderDomains = renderDomains;
window.renderWorkouts = renderWorkouts;
window.addWorkoutEntry = addWorkoutEntry;
window.deleteWorkoutEntry = deleteWorkoutEntry;
window.renderMeditation = renderMeditation;
window.startMeditation = startMeditation;
window.pauseMeditation = pauseMeditation;
window.resumeMeditation = resumeMeditation;
window.finishMeditation = finishMeditation;
window.cancelMeditation = cancelMeditation;
window.deleteMeditationEntry = deleteMeditationEntry;
window.renderScreenTracker = renderScreenTracker;
window.saveScreenLimit = saveScreenLimit;
window.addScreenEntry = addScreenEntry;
window.deleteScreenEntry = deleteScreenEntry;
window.renderCalendar = renderCalendar;
window.addCalendarEvent = addCalendarEvent;
window.toggleCalendarEvent = toggleCalendarEvent;
window.deleteCalendarEvent = deleteCalendarEvent;
window.renderMeditation = renderMeditation;
window.renderMeds = renderMeds;
window.renderGcal = renderGcal;
window.renderCalendar = renderCalendar;
window.renderNotifications = renderNotifications;
window.renderIntegrations = renderIntegrations;
window.renderStorage = renderStorage;
window.renderScreenTracker = renderScreenTracker;
window.renderDiagnostic = renderDiagnostic;
window.renderOnboarding = renderOnboarding;

/* ============ СТАРТ ============ */
if(document.readyState === 'complete'){
  init();
} else {
  document.addEventListener('DOMContentLoaded', init, {once:true});
}

console.log('[APP v48 ✅] ФИНАЛ загружен. Все части: 1/4 + 2/4 + 3/4 + 4/4');

})();
