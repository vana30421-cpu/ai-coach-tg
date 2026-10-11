'use strict';
/* ============================================================
   LIFE OS — APP.js v46 — ЧАСТЬ 1/4
   Ядро: IIFE, Telegram, Back Button, Utils, Голос, State,
   Миграция, Загрузка/Сохранение, Глобалы, Настройки,
   Эффекты, Темы, TabBar, Header, Navigation, Sheet, Picker
   ============================================================ */
(function(){

/* ============ КОНСТАНТЫ ============ */
var STORAGE_KEY = 'life_os_v45';
var STORAGE_BACKUP = 'life_os_backup_v45';
var CURRENT_VERSION = '46';
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
      effectsIntensity:1,reducedMotion:false,updatedAt:null
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
      effectsEnabled:true,effectsIntensity:1,animationSpeed:1,
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

function save(){
  try{
    state.settings.updatedAt = nowISO();
    state.settings.version = CURRENT_VERSION;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }catch(e){ console.error('[SAVE]', e); }
}

/* ============ ГЛОБАЛЫ ============ */
var currentPage = 'dashboard';
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
  }catch(e){}
}

/* ============ ЭФФЕКТЫ ТЕМ ============ */
function startEffects(){
  var overlay = document.getElementById('themeEffect');
  if(!overlay) return;
  overlay.innerHTML = '';
  try{
    if(state.settings.effectsEnabled === undefined) state.settings.effectsEnabled = true;
    if(state.settingsV2 && state.settingsV2.reducedMotion) return;
    if(!state.settings.effectsEnabled) return;
    var theme = (window.THEMES || []).find(function(t){ return t.id === state.settings.theme; }) || {effect:'stars'};
    var effect = theme.effect || 'stars';
    var intensity = state.settings.effectsIntensity || 1;
    function cnt(base){ return Math.round(base * intensity * 2.5); }
    var i, el;
    var helpers = {
      petal: function(emoji){
        el = document.createElement('div');
        el.className = 'effect-petal';
        el.textContent = emoji;
        el.style.left = Math.random()*100 + '%';
        el.style.animationDuration = (6 + Math.random()*6) + 's';
        el.style.animationDelay = Math.random()*8 + 's';
        el.style.fontSize = (14 + Math.random()*14) + 'px';
        overlay.appendChild(el);
      },
      star: function(cls){
        el = document.createElement('div');
        el.className = 'effect-star ' + cls;
        el.style.left = Math.random()*100 + '%';
        el.style.top = Math.random()*100 + '%';
        el.style.animationDelay = Math.random()*5 + 's';
        overlay.appendChild(el);
      },
      spark: function(){
        el = document.createElement('div');
        el.className = 'effect-spark';
        el.style.left = Math.random()*100 + '%';
        el.style.top = Math.random()*100 + '%';
        overlay.appendChild(el);
      },
      dust: function(){
        el = document.createElement('div');
        el.className = 'effect-dust';
        el.style.left = Math.random()*100 + '%';
        el.style.top = Math.random()*100 + '%';
        overlay.appendChild(el);
      }
    };
    if(effect === 'stars' || effect === 'none'){
      for(i = 0; i < cnt(30); i++) helpers.star('small');
      for(i = 0; i < cnt(15); i++) helpers.star('medium');
    } else if(effect === 'rain'){
      for(i = 0; i < cnt(40); i++){
        el = document.createElement('div');
        el.className = 'effect-drop';
        el.style.left = Math.random()*100 + '%';
        el.style.height = (15 + Math.random()*35) + 'px';
        overlay.appendChild(el);
      }
    } else if(effect === 'petals'){
      var p = ['🌸','🌺','🌷','💮'];
      for(i = 0; i < cnt(20); i++) helpers.petal(p[Math.floor(Math.random()*p.length)]);
    } else if(effect === 'leaves'){
      var l = ['🍃','🍂','🍁','🌿'];
      for(i = 0; i < cnt(20); i++) helpers.petal(l[Math.floor(Math.random()*l.length)]);
    } else if(effect === 'snow'){
      var sn = ['❄','❅','❆'];
      for(i = 0; i < cnt(25); i++){
        el = document.createElement('div');
        el.className = 'effect-snowflake';
        el.textContent = sn[Math.floor(Math.random()*sn.length)];
        el.style.left = Math.random()*100 + '%';
        overlay.appendChild(el);
      }
    } else if(effect === 'waves'){
      for(i = 0; i < 4; i++){
        el = document.createElement('div');
        el.className = 'effect-wave';
        el.style.bottom = (i*50) + 'px';
        overlay.appendChild(el);
      }
    } else if(effect === 'sparkles' || effect === 'spark'){
      for(i = 0; i < cnt(35); i++) helpers.spark();
    } else if(effect === 'dust' || effect === 'fireflies'){
      for(i = 0; i < cnt(25); i++) helpers.dust();
    } else if(effect === 'bubbles'){
      for(i = 0; i < cnt(20); i++){
        el = document.createElement('div');
        el.className = 'effect-bubble';
        el.style.left = Math.random()*100 + '%';
        el.style.bottom = (Math.random()*20) + '%';
        el.style.width = el.style.height = (6 + Math.random()*20) + 'px';
        overlay.appendChild(el);
      }
    } else if(effect === 'fire' || effect === 'lava'){
      for(i = 0; i < cnt(25); i++){
        el = document.createElement('div');
        el.className = 'effect-fire';
        el.style.left = Math.random()*100 + '%';
        overlay.appendChild(el);
      }
    } else if(effect === 'lightning' || effect === 'storm'){
      for(i = 0; i < 3; i++){
        el = document.createElement('div');
        el.className = 'effect-lightning';
        el.style.left = (20 + Math.random()*60) + '%';
        overlay.appendChild(el);
      }
    } else if(effect === 'aurora'){
      for(i = 0; i < 3; i++){
        el = document.createElement('div');
        el.className = 'effect-aurora';
        el.style.top = (i*20) + '%';
        overlay.appendChild(el);
      }
    } else if(effect === 'pumpkin'){
      for(i = 0; i < cnt(15); i++) helpers.petal('🎃');
    } else if(effect === 'bats'){
      for(i = 0; i < cnt(12); i++) helpers.petal('🦇');
    } else if(effect === 'ghosts'){
      for(i = 0; i < cnt(12); i++) helpers.petal('👻');
    } else if(effect === 'bones'){
      for(i = 0; i < cnt(12); i++) helpers.petal('💀');
    } else if(effect === 'drops'){
      for(i = 0; i < cnt(20); i++) helpers.dust();
    } else if(effect === 'candles'){
      for(i = 0; i < cnt(8); i++) helpers.petal('🕯');
    } else if(effect === 'feathers'){
      for(i = 0; i < cnt(15); i++) helpers.petal('🪶');
    } else if(effect === 'spiderweb'){
      for(i = 0; i < 3; i++){
        el = document.createElement('div');
        el.style.position = 'absolute';
        el.style.left = (i*33) + '%';
        el.style.top = '0';
        el.style.width = '1px';
        el.style.height = '100%';
        el.style.background = 'linear-gradient(180deg,transparent,#00ff88,transparent)';
        el.style.opacity = '.15';
        overlay.appendChild(el);
      }
    } else if(effect === 'fog'){
      for(i = 0; i < cnt(10); i++){
        el = document.createElement('div');
        el.className = 'effect-wave';
        el.style.bottom = (Math.random()*100) + '%';
        overlay.appendChild(el);
      }
    } else {
      for(i = 0; i < cnt(15); i++) helpers.star('small');
    }
  }catch(e){ console.warn('[Effects]', e); }
}

/* ============ applyTheme ============ */
function applyTheme(id){
  try{
    var classes = document.body.className.split(/\s+/).filter(function(c){ return c && c.indexOf('theme-') !== 0; });
    classes.push('theme-dark');
    if(id && id !== 'dark') classes.push('theme-' + id);
    document.body.className = classes.join(' ');
  }catch(e){ document.body.className = 'theme-dark'; }
  startEffects();
  try{
    var meta = document.querySelector('meta[name="theme-color"]');
    if(meta){
      var theme = (window.THEMES || []).find(function(t){ return t.id === state.settings.theme; });
      if(theme) meta.setAttribute('content', theme.bg || '#000000');
    }
  }catch(e){}
}

/* ============ TAB BAR ============ */
function renderTabBar(){
  try{
    var bar = document.getElementById('tabBar');
    if(!bar) return;
    var tabs = window.TABS || [];
    var html = '';
    tabs.forEach(function(t){
      html += '<button class="tab-item ' + (t.id === currentPage ? 'active' : '') + '" onclick="navigate(\'' + t.id + '\')">';
      html += '<span class="tab-icon">' + t.emoji + '</span><span class="tab-label">' + t.label + '</span></button>';
    });
    bar.innerHTML = html;
  }catch(e){ console.error('[TabBar]', e); }
}

function updateHeader(){
  try{
    var avatar = document.getElementById('headerAvatar');
    if(avatar && state.profile) avatar.textContent = state.profile.emoji || '👤';
  }catch(e){}
}

/* ============ NAVIGATION ============ */
var MAIN_PAGES = ['dashboard','tasks','learning','calendar','vision','ai','more'];

function navigate(page, silent){
  if(!page) page = 'dashboard';
  var prev = currentPage;
  currentPage = page;
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
    projects: renderProjects, projectDetail: renderProjectDetail, projectEditor: renderProjectEditor,
    coach: renderCoach, coachSettings: renderCoachSettings, coachChat: renderCoachChat,
    schedule: renderSchedule, scheduleEditor: renderScheduleEditor,
    focus: renderFocus, eveningReview: renderEveningReview,
    weeklyReview: renderWeeklyReview, monthlyReview: renderMonthlyReview,
    achievements: renderAchievements, achievementsCategory: renderAchievementsCategory,
    tasks: renderTasks, matrix: renderMatrix, learning: renderLearning,
    levels: renderLevels, levelDetail: renderLevelDetail, moduleDetail: renderModuleDetail,
    skills: renderSkills, methods: renderMethods, english: renderEnglish,
    memory: renderMemory, iq: renderIQ, eq: renderEQ, finance: renderFinance,
    neuromodule: renderNeuro, psychology: renderPsychology, thinking: renderThinking,
    etiquette: renderEtiquette, hormones: renderHormones, wealth: renderWealth,
    planning: renderPlanning, plantoday: renderPlanToday, planweek: renderPlanWeek,
    planmonth: renderPlanMonth, obsidian: renderObsidian, gcal: renderGcal,
    calendar: renderCalendar,
    vision: renderVision, visionex: renderVisionExercises,
    visiontrack: renderVisionTracker, visiontips: renderVisionTips,
    vision60: renderVision60, vision62: renderVision62,
    ai: renderAI, health: renderHealth, water: renderWater, mood: renderMood,
    workouts: renderWorkouts, meditation: renderMeditation, meds: renderMeds,
    recovery: renderRecovery, medical: renderMedical,
    entertainment: renderEntertainment, resources: renderResources,
    movies: renderMovies, series: renderSeries, books: renderBooks,
    musiclib: renderMusic, gameslib: renderGames, podcastslib: renderPodcasts,
    habitList: renderHabitList, habitCatalog: renderHabitCatalog,
    habitDetail: renderHabitDetail, habitEditor: renderHabitEditor,
    brain: renderBrain, brainGame: renderBrainGame, brainStats: renderBrainStats,
    antistress: renderAntistress, antistressDetail: renderAntistressDetail,
    sleep: renderSleep, sleepCalendar: renderSleepCalendar, sleepEditor: renderSleepEditor,
    games: renderLearningGames, gamePlay: renderGamePlay,
    materials: renderMaterials, materialDetail: renderMaterialDetail,
    notifications: renderNotifications,
    snapshot: renderSnapshot, recommendations: renderRecommendations,
    dailyReport: renderDailyReport, weeklyReport: renderWeeklyReport,
    goals: renderGoals, notes: renderNotes, journal: renderJournal,
    more: renderMore, stats: renderStats, detailedStats: renderDetailedStats,
    timer: renderTimer, domains: renderDomains,
    profile: renderProfile, profileV2: renderProfileV2,
    settings: renderSettings, settingsV2: renderSettingsV2,
    integrations: renderIntegrations, storage: renderStorage,
    screentracker: renderScreenTracker, detoxcourse: renderDetoxCourse,
    detox60: renderDetox60, obsidianIntegration: renderObsidianIntegration,
    telegramSetup: renderTelegramSetup,
    gamesHub: renderGamesHub,
    leagues: renderLeagues,
    pet: renderPet,
    fsrs: renderFSRS,
    fsrsReview: renderFSRSReview,
    detox: renderDetoxHub,
    dailySurvey: renderDailySurvey, survey: renderSurvey,
    plan: renderPersonalPlan,
    diagnostic: renderDiagnostic,
    onboarding: renderOnboarding
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
    setTimeout(function(){ try{ attachVoiceAll('app'); }catch(e){} }, 50);
  }catch(e){
    console.error('Render [' + page + ']:', e);
    main.innerHTML = '<div class="page"><div class="card"><div class="empty"><div class="empty-icon">⚠️</div><div class="empty-title">Ошибка</div><div class="empty-text">' + esc(e.message || '') + '</div></div></div></div>';
  }
  window.scrollTo({top:0});
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
  document.querySelectorAll('.overlay').forEach(function(o){ o.remove(); });
  document.body.style.overflow = '';
}

/* ============ THEME PICKER ============ */
function openThemePicker(){
  var themes = window.THEMES || [];
  if(!themes.length){ toast('Темы не загружены','error'); return; }
  var html = '<div class="footnote text-tertiary" style="margin-bottom:8px;">🎨 Выбери тему (' + themes.length + ')</div>';
  html += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px;max-height:50vh;overflow-y:auto;">';
  themes.forEach(function(t){
    var active = state.settings.theme === t.id;
    html += '<button onclick="setTheme(\'' + t.id + '\')" style="padding:10px 6px;border-radius:12px;border:2px solid ' + (active ? 'var(--brand)' : 'transparent') + ';background:' + t.bg + ';color:' + t.text + ';cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px;"><span style="font-size:22px;">' + t.emoji + '</span><span style="font-size:9px;font-weight:700;">' + t.name + '</span></button>';
  });
  html += '</div>';
  html += '<div class="card" style="margin:0;padding:14px;">';
  html += '<div class="row-between mb-2"><div class="list-title">🌈 Эффекты</div><button class="btn btn-ghost btn-xs" onclick="state.settings.effectsEnabled=!state.settings.effectsEnabled;save();startEffects();openThemePicker()">' + (state.settings.effectsEnabled ? 'Вкл' : 'Выкл') + '</button></div>';
  html += '<div class="row-between"><div class="list-title">💫 Интенсивность</div><div class="row" style="gap:4px;">';
  [0.5,1,1.5,2].forEach(function(v){
    var active = (state.settings.effectsIntensity || 1) === v;
    html += '<button class="btn ' + (active ? 'btn-primary' : 'btn-ghost') + ' btn-xs" onclick="state.settings.effectsIntensity=' + v + ';save();startEffects();openThemePicker()">' + v + '×</button>';
  });
  html += '</div></div></div>';
  openSheet('Тема', html);
}
function setTheme(id){
  try{
    state.settings.theme = id;
    applyTheme(id);
    save();
    haptic('success');
    closeSheet();
    toast('Тема: ' + id,'success');
  }catch(e){ toast('Ошибка','error'); }
}
function openStatsQuick(){ navigate('stats'); }

/* ============ PWA INSTALL ============ */
function installPWA(){
  try{
    if(!tg){ toast('Открой в Telegram','warning'); return; }
    if(tg.addToHomeScreen){
      tg.addToHomeScreen();
      toast('📲 Устанавливаем...','info');
    } else {
      toast('Установка недоступна','warning');
    }
  }catch(e){
    console.error('[PWA]', e);
    toast('Ошибка установки','error');
  }
}
function initPWAHandlers(){
  try{
    if(!tg) return;
    if(tg.onEvent){
      tg.onEvent('homeScreenAdded', function(){
        state.settings.pwa.installed = true;
        state.settings.pwa.installedAt = nowISO();
        save();
        toast('✓ Приложение установлено','success');
        haptic('success');
      });
      tg.onEvent('homeScreenFailed', function(reason){
        console.warn('[PWA] Failed:', reason);
        toast('Установка не удалась','warning');
      });
    }
  }catch(e){}
}
function renderPWAInstallBlock(){
  var installed = state.settings && state.settings.pwa && state.settings.pwa.installed;
  var html = '<div class="card"><h2>📲 Установка</h2>';
  if(installed){
    html += '<div class="insight-card"><div class="insight-title">✓ Установлено</div>';
    html += '<div class="insight-text">Приложение добавлено на главный экран. Работает офлайн.</div></div>';
  } else {
    html += '<div class="footnote text-secondary mb-3">Добавь Life OS на главный экран — работает как обычное приложение, офлайн.</div>';
    html += '<button class="btn btn-primary btn-block" onclick="installPWA()">📲 Установить</button>';
  }
  html += '</div>';
  return html;
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

})();


/* ============================================================
   LIFE OS — APP.js v46 — ЧАСТЬ 2/4
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
  var petStage = PET_STAGES ? (PET_STAGES.find(function(s){return s.id === (pet.stage||1);}) || PET_STAGES[0]) : {emoji:'🥚',name:'Яйцо'};

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
  html += '<div class="group-item" onclick="addWater()"><div class="group-item-icon">💧</div><div class="group-item-label">Вода</div></div>';
  html += '<div class="group-item" onclick="quickMoodLog()"><div class="group-item-icon">💭</div><div class="group-item-label">Настроение</div></div>';
  html += '<div class="group-item" onclick="navigate(\'eveningReview\')"><div class="group-item-icon">🌙</div><div class="group-item-label">Вечерний обзор</div></div>';
  html += '<div class="group-item" onclick="navigate(\'projects\')"><div class="group-item-icon">📁</div><div class="group-item-label">Проекты</div></div>';
  html += '<div class="group-item" onclick="navigate(\'achievements\')"><div class="group-item-icon">🏆</div><div class="group-item-label">Достижения</div></div>';
  html += '<div class="group-item" onclick="navigate(\'gamesHub\')"><div class="group-item-icon">🎮</div><div class="group-item-label">Игры</div></div>';
  html += '<div class="group-item" onclick="navigate(\'pet\')"><div class="group-item-icon">' + petStage.emoji + '</div><div class="group-item-label">Питомец</div></div>';
  html += '<div class="group-item" onclick="navigate(\'leagues\')"><div class="group-item-icon">🏅</div><div class="group-item-label">Лиги</div></div>';
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
  addXP(10, 'sphere_score');
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
  var h = getUserHabit(id);
  if(!h) return;
  var t = today();
  if(h.lastCompletedDate === t){
    h.lastCompletedDate = null;
    h.streak = Math.max(0, (h.streak||1) - 1);
  } else {
    if(h.lastCompletedDate === yesterday()) h.streak = (h.streak||0) + 1;
    else h.streak = 1;
    h.lastCompletedDate = t;
    if((h.streak||0) > (h.bestStreak||0)) h.bestStreak = h.streak;
    addXP(5, 'habit');
    /* Питомец получает XP */
    addPetXP(3);
    /* Достижение за streak */
    if(h.streak === 7) addXP(25, 'habit_streak_7');
    if(h.streak === 30) addXP(100, 'habit_streak_30');
    haptic('success');
  }
  if(!state.habitHistory[h.id]) state.habitHistory[h.id] = {};
  state.habitHistory[h.id][t] = {completed: h.lastCompletedDate === t};
  save();
  if(currentPage === 'habitList') renderHabitList();
  else if(currentPage === 'habitDetail') renderHabitDetail();
  else if(currentPage === 'dashboard') renderDashboard();
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
}
function renderHabitRow(h){
  var tpl = getHabitTemplate(h.templateId);
  var emoji = h.emoji || (tpl ? tpl.emoji : '✅');
  var title = h.title || (tpl ? tpl.title : 'Привычка');
  var done = isHabitDoneToday(h.id);
  var prog = getHabit66Progress(h);
  var cat = (window.HABIT_CATEGORIES || []).find(function(c){ return c.id === h.category; });
  var catColor = cat ? cat.color : '#5b9eff';
  return '<div class="method-card" onclick="openHabitDetail(\'' + h.id + '\')" style="border-left:3px solid ' + catColor + ';">' +
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
  if(h.science) html += '<div class="insight-card"><div class="insight-title">🔬 Наука</div><div class="insight-text">' + esc(h.science) + '</div></div>';
  html += '<button class="btn btn-ghost btn-block mb-2" onclick="openHabitEditor(\'' + h.id + '\')">✏️ Редактировать</button>';
  html += '<button class="btn btn-danger btn-block" onclick="deleteHabit(\'' + h.id + '\')">🗑 Удалить</button>';
  html += '</div>';
  document.getElementById('app').innerHTML = html;
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
  if(currentHabitId){
    var h = getUserHabit(currentHabitId);
    if(!h) return;
    h.title = title.trim();
    h.emoji = emoji;
    h.category = category;
    h.duration = duration;
    h.startDate = startDate;
    h.updatedAt = nowISO();
  } else {
    var newH = {id:uid(), title:title.trim(), emoji:emoji, category:category, scheduleType:'daily', duration:duration, startDate:startDate, streak:0, bestStreak:0, lastCompletedDate:null, active:true, createdAt:nowISO()};
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
  addXP(5, 'task');
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

