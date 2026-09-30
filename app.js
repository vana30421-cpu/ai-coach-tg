'use strict';
/* ============================================================
   LIFE OS — APP.js v44
   Ядро + State + BackButton + Голос + Сферы + AI-коуч + Расписание + Проекты + Init
   ============================================================ */

var STORAGE_KEY = 'life_os_v44';
var STORAGE_BACKUP = 'life_os_backup_v44';
var CURRENT_VERSION = '44';

/* ============ TELEGRAM ============ */
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
}catch(e){}

/* ============ BACK BUTTON ============ */
var _backStack=[];
function tgBackButtonShow(){
  try{
    if(tg&&tg.BackButton){
      tg.BackButton.show();
      if(!window.__bbBound){
        tg.BackButton.onClick(function(){navigateBack()});
        window.__bbBound=true;
      }
    }
  }catch(e){}
}
function tgBackButtonHide(){try{if(tg&&tg.BackButton)tg.BackButton.hide()}catch(e){}}
function navigateBack(){
  _backStack.pop();
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
    var h=tg&&tg.HapticFeedback;if(!h)return;
    if(type==='success')h.notificationOccurred('success');
    else if(type==='error')h.notificationOccurred('error');
    else if(type==='warning')h.notificationOccurred('warning');
    else h.impactOccurred(type||'light');
  }catch(e){}
}

/* ============ ГОЛОС ============ */
function voiceSupported(){return !!(window.SpeechRecognition||window.webkitSpeechRecognition)}
function attachVoice(inputId){
  if(!voiceSupported())return;
  var el=document.getElementById(inputId);if(!el)return;
  if(el.dataset.voiceAttached==='1')return;
  el.dataset.voiceAttached='1';
  var btn=document.createElement('button');
  btn.type='button';btn.className='voice-btn';btn.textContent='🎤';
  btn.style.cssText='position:absolute;right:8px;top:50%;transform:translateY(-50%);background:var(--glass-3);border:1px solid var(--glass-border);color:var(--text);width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:16px;display:grid;place-items:center;z-index:2;';
  var parent=el.parentNode;
  if(getComputedStyle(parent).position==='static')parent.style.position='relative';
  parent.appendChild(btn);
  btn.addEventListener('click',function(e){e.preventDefault();startVoiceFor(el,btn)});
}
function startVoiceFor(el,btn){
  try{
    var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){toast('Голос не поддерживается','error');return}
    var rec=new SR();rec.lang='ru-RU';rec.interimResults=false;
    if(btn){btn.style.background='var(--danger)';btn.textContent='⏺'}
    rec.onresult=function(ev){
      var text='';
      for(var i=ev.resultIndex;i<ev.results.length;i++)text+=ev.results[i][0].transcript;
      if(text.trim()){
        var cur=el.value||'';
        var sep=cur&&!/\s$/.test(cur)?' ':'';
        el.value=cur+sep+text.trim();
        el.dispatchEvent(new Event('input',{bubbles:true}));
      }
    };
    rec.onerror=function(err){toast('Голос: '+(err&&err.error||'ошибка'),'error');if(btn){btn.style.background='var(--glass-3)';btn.textContent='🎤'}};
    rec.onend=function(){if(btn){btn.style.background='var(--glass-3)';btn.textContent='🎤'}};
    rec.start();
    toast('🎤 Говорите...','info',1500);
  }catch(e){toast('Голос недоступен','error');if(btn){btn.style.background='var(--glass-3)';btn.textContent='🎤'}}
}
window.attachVoice=attachVoice;
window.voiceSupported=voiceSupported;
function attachVoiceAll(rootId){
  if(!voiceSupported())return;
  var root=rootId?document.getElementById(rootId):document.body;
  if(!root)return;
  var nodes=root.querySelectorAll('input[type="text"],input[type="search"],input:not([type]),textarea');
  for(var i=0;i<nodes.length;i++){
    var el=nodes[i];
    if(!el.id)el.id='voice_auto_'+i+'_'+Math.random().toString(36).slice(2,6);
    attachVoice(el.id);
  }
}
window.attachVoiceAll=attachVoiceAll;

/* ============ DEFAULT STATE v44 ============ */
function defaultState(){
  return{
    /* Старое (совместимость) */
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

    /* v44: НОВОЕ */
    spheres:{
      scores:{},            // {date: {sphereId: score}}
      lastScores:{},        // {sphereId: score} — последние
      history:[]            // [{date, avg, balance, scores}]
    },
    projects:[],             // [{id, templateId, title, desc, sphereId, status, progress, tasks:[], deadline, createdAt}]
    coach:{
      style:'balanced',     // friendly | balanced | strict
      strictness:5,         // 1-10
      settings:null,        // будет заполнено из COACH_SETTINGS_DEFAULTS
      tipsHistory:[],       // [{id, shownAt}]
      lastTipDate:null,
      messages:[]           // чат с коучем
    },
    schedule:{
      times:{},             // {wake, breakfast, workStart, lunch, workEnd, dinner, relax, windDown, sleep}
      customEvents:[]       // [{id, date, time, title, sphereId, done}]
    },
    focus:{
      active:null,          // {startedAt, duration, taskTitle, sphereId}
      history:[]            // [{date, duration, taskTitle, sphereId}]
    },
    eveningReview:{
      history:[]            // [{date, wins:[], lesson, tomorrow:[], gratitude}]
    },
    notifications:{
      enabled:false,
      permission:'default',
      settings:null,        // будет из NOTIFICATION_SETTINGS_DEFAULTS
      scheduled:[],
      history:[]
    },
    profileV2:{age:null,height:null,weight:null,gender:null,activity:'moderate',goal:'maintain',targetWeight:null,targetDate:null,restingHR:null,maxHR:null,medicalNotes:'',updatedAt:null},
    settingsV2:{textSize:'medium',scale:'100',sound:true,soundVolume:0.5,haptic:true,animations:true,animationsSpeed:'normal',language:'ru',firstDayOfWeek:'monday',timeFormat:'24h',dateFormat:'DD.MM.YYYY',darkMode:'auto',effectsEnabled:true,effectsIntensity:1,reducedMotion:false,updatedAt:null},
    snapshot:null,snapshotHistory:[],recommendations:[],lastSnapshotAt:null,

    /* старое */
    todayPlan:null,learnPlan:{today:[],week:[],month:[]},personalPlan:null,
    medicalData:{metrics:[],entries:[],profile:{age:null,sex:null,weight:null,height:null,chronic:[]},recommendations:[]},
    xp:0,level:0,activeWorkMode:null,
    integrations:{
      obsidian:{apiKey:'',vault:'',lastSync:null,connected:false},
      gcal:{clientId:'',accessToken:null,refreshToken:null,expiresAt:null,lastSync:null,connected:false,autoSync:true},
      gemini:{apiKey:'',model:'gemini-1.5-flash',connected:false}
    },
    profile:{name:'',emoji:'😊',createdAt:nowISO(),achievements:[],surveyAnswers:null,surveyStep:0,surveyDone:false,personalPlan:null},
    settings:{
      version:CURRENT_VERSION,theme:'dark',provider:'gemini',apiKey:'',
      activePersona:'coach',waterGoal:8,onboardingDone:false,
      effectsEnabled:true,effectsIntensity:1,animationSpeed:1,
      lastDailySurveyDay:null,dailyLearnTarget:150,
      pwa:{installed:false},
      notifications:{enabled:false,lastCheck:null},
      updatedAt:null
    },
    stats:{streak:0,lastActiveDay:null,totalDays:0,totalTasksDone:0,totalLessonsDone:0,totalWater:0,totalMoodLogs:0,totalWorkouts:0,totalMeditations:0,bestStreak:0}
  };
}

/* ============ БЭКАП / MERGE / МИГРАЦИЯ ============ */
function backupStorage(){try{var raw=localStorage.getItem(STORAGE_KEY);if(raw){localStorage.setItem(STORAGE_BACKUP,raw);return true}}catch(e){}return false}
function restoreFromBackup(){try{var b=localStorage.getItem(STORAGE_BACKUP);if(!b)return false;localStorage.setItem(STORAGE_KEY,b);return true}catch(e){return false}}
function deepMerge(target,source){
  if(!source||typeof source!=='object')return target;
  if(Array.isArray(source))return source.slice();
  Object.keys(source).forEach(function(k){
    if(source[k]&&typeof source[k]==='object'&&!Array.isArray(source[k])){target[k]=deepMerge(target[k]||{},source[k])}
    else if(source[k]!==undefined){target[k]=source[k]}
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
  if(!Array.isArray(data.habits))data.habits=[];
  if(!data.habitHistory)data.habitHistory={};
  if(!Array.isArray(data.brainPlays))data.brainPlays=[];
  if(!Array.isArray(data.antistressEntries))data.antistressEntries=[];
  if(!Array.isArray(data.sleepEntries))data.sleepEntries=[];
  if(!data.profileV2)data.profileV2=defaultState().profileV2;
  if(!data.settingsV2)data.settingsV2=defaultState().settingsV2;
  if(!data.snapshotHistory)data.snapshotHistory=[];
  if(!data.notifications)data.notifications=defaultState().notifications;
  /* v44 */
  if(!data.spheres)data.spheres={scores:{},lastScores:{},history:[]};
  if(!Array.isArray(data.projects))data.projects=[];
  if(!data.coach)data.coach=defaultState().coach;
  if(!data.schedule)data.schedule={times:{},customEvents:[]};
  if(!data.focus)data.focus={active:null,history:[]};
  if(!data.eveningReview)data.eveningReview={history:[]};
  return data;
}

/* ============ ЗАГРУЗКА ============ */
var state;
(function loadState(){
  try{
    backupStorage();
    var raw=localStorage.getItem(STORAGE_KEY);
    if(!raw){
      var oldRaw=localStorage.getItem('life_os_v43')||localStorage.getItem('life_os_v40');
      if(oldRaw){
        console.log('[LOAD] миграция → v44');
        state=deepMerge(defaultState(),JSON.parse(oldRaw));
        state.settings.version=CURRENT_VERSION;
        save();
      }else{
        state=defaultState();
        console.log('[LOAD] новый state v44');
      }
    }else{
      var parsed=JSON.parse(raw);
      parsed=migrateState(parsed);
      state=deepMerge(defaultState(),parsed);
      console.log('[LOAD] ✓ state v'+state.settings.version);
    }
  }catch(e){
    console.error('[LOAD]',e);
    if(!restoreFromBackup())state=defaultState();
    else{try{state=deepMerge(defaultState(),JSON.parse(localStorage.getItem(STORAGE_KEY)))}catch(e2){state=defaultState()}}
  }
  /* Инициализируем настройки коуча и уведомлений если их нет */
  try{
    if(!state.coach.settings&&typeof COACH_SETTINGS_DEFAULTS!=='undefined')state.coach.settings=JSON.parse(JSON.stringify(COACH_SETTINGS_DEFAULTS));
    if(!state.notifications.settings&&typeof NOTIFICATION_SETTINGS_DEFAULTS!=='undefined')state.notifications.settings=JSON.parse(JSON.stringify(NOTIFICATION_SETTINGS_DEFAULTS));
    if(!state.schedule.times||!Object.keys(state.schedule.times).length){
      if(typeof DEFAULT_DAY_SCHEDULE!=='undefined')state.schedule.times=JSON.parse(JSON.stringify(DEFAULT_DAY_SCHEDULE));
    }
  }catch(e){}
})();

function save(){
  try{
    state.settings.updatedAt=nowISO();
    state.settings.version=CURRENT_VERSION;
    localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
  }catch(e){console.error('[SAVE]',e)}
}

/* ============ GLOBALS ============ */
var currentPage='dashboard';
var currentLevelId=null,currentModuleId=null,currentLessonIdx=null;
var taskFilter='all',taskSearch='',skillsFilter='all';
var currentDailySurveyStep=0,currentDailySurveyAnswers={};
var timerInterval=null,timerSeconds=25*60,timerRunning=false;
var currentVisionExercise=null;
var currentDayPlanDate=today();
var v2Filter='all';
var habitCatFilter='all',habitSearch='',brainCatFilter='all',asCatFilter='all',gameCatFilter='all',matCatFilter='all';
var currentHabitId=null,currentBrainGameId=null,currentAntistressId=null;
var currentSleepDate=null;
var SLEEP_CAL_CURSOR=new Date();
var currentReportDate=null;
var CAL_CURSOR=new Date();
var sphereFilter='all';
var currentSphereId=null;
var currentProjectId=null;
var focusTimerInterval=null;

/* ============ applyUserSettings ============ */
function applyUserSettings(){
  try{
    var s=state.settingsV2||{};
    var scaleMap={small:0.9,medium:1,large:1.1,xlarge:1.2};
    var sc=parseFloat(s.scale||'100')/100;
    var ts=scaleMap[s.textSize]||1;
    document.documentElement.style.fontSize=(16*ts)+'px';
    document.body.style.zoom=(sc*100)+'%';
  }catch(e){}
}
window.applyUserSettings=applyUserSettings;

/* ============ ЭФФЕКТЫ ============ */
function startEffects(){
  var overlay=document.getElementById('themeEffect');if(!overlay)return;
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
    var helpers={
      petal:function(emoji){el=document.createElement('div');el.className='effect-petal';el.textContent=emoji;el.style.left=Math.random()*100+'%';el.style.animationDuration=(6+Math.random()*6)+'s';el.style.animationDelay=Math.random()*8+'s';el.style.fontSize=(14+Math.random()*14)+'px';overlay.appendChild(el)},
      star:function(cls){el=document.createElement('div');el.className='effect-star '+cls;el.style.left=Math.random()*100+'%';el.style.top=Math.random()*100+'%';el.style.animationDelay=Math.random()*5+'s';overlay.appendChild(el)},
      spark:function(){el=document.createElement('div');el.className='effect-spark';el.style.left=Math.random()*100+'%';el.style.top=Math.random()*100+'%';overlay.appendChild(el)},
      dust:function(){el=document.createElement('div');el.className='effect-dust';el.style.left=Math.random()*100+'%';el.style.top=Math.random()*100+'%';overlay.appendChild(el)}
    };
    if(effect==='stars'||effect==='none'){for(i=0;i<cnt(30);i++)helpers.star('small');for(i=0;i<cnt(15);i++)helpers.star('medium')}
    else if(effect==='rain'){for(i=0;i<cnt(40);i++){el=document.createElement('div');el.className='effect-drop';el.style.left=Math.random()*100+'%';el.style.height=(15+Math.random()*35)+'px';overlay.appendChild(el)}}
    else if(effect==='petals'){var p=['🌸','🌺','🌷','💮'];for(i=0;i<cnt(20);i++)helpers.petal(p[Math.floor(Math.random()*p.length)])}
    else if(effect==='leaves'){var l=['🍃','🍂','🍁','🌿'];for(i=0;i<cnt(20);i++)helpers.petal(l[Math.floor(Math.random()*l.length)])}
    else if(effect==='snow'){var sn=['❄','❅','❆'];for(i=0;i<cnt(25);i++){el=document.createElement('div');el.className='effect-snowflake';el.textContent=sn[Math.floor(Math.random()*sn.length)];el.style.left=Math.random()*100+'%';overlay.appendChild(el)}}
    else if(effect==='waves'){for(i=0;i<4;i++){el=document.createElement('div');el.className='effect-wave';el.style.bottom=(i*50)+'px';overlay.appendChild(el)}}
    else if(effect==='sparkles'||effect==='spark'){for(i=0;i<cnt(35);i++)helpers.spark()}
    else if(effect==='dust'||effect==='fireflies'){for(i=0;i<cnt(25);i++)helpers.dust()}
    else if(effect==='bubbles'){for(i=0;i<cnt(20);i++){el=document.createElement('div');el.className='effect-bubble';el.style.left=Math.random()*100+'%';el.style.bottom=(Math.random()*20)+'%';el.style.width=el.style.height=(6+Math.random()*20)+'px';overlay.appendChild(el)}}
    else if(effect==='fire'||effect==='lava'){for(i=0;i<cnt(25);i++){el=document.createElement('div');el.className='effect-fire';el.style.left=Math.random()*100+'%';overlay.appendChild(el)}}
    else if(effect==='lightning'||effect==='storm'){for(i=0;i<3;i++){el=document.createElement('div');el.className='effect-lightning';el.style.left=(20+Math.random()*60)+'%';overlay.appendChild(el)}}
    else if(effect==='aurora'){for(i=0;i<3;i++){el=document.createElement('div');el.className='effect-aurora';el.style.top=(i*20)+'%';overlay.appendChild(el)}}
    else if(effect==='pumpkin'){for(i=0;i<cnt(15);i++)helpers.petal('🎃')}
    else if(effect==='bats'){for(i=0;i<cnt(12);i++)helpers.petal('🦇')}
    else if(effect==='ghosts'){for(i=0;i<cnt(12);i++)helpers.petal('👻')}
    else if(effect==='bones'){for(i=0;i<cnt(12);i++)helpers.petal('💀')}
    else if(effect==='drops'){for(i=0;i<cnt(20);i++)helpers.dust()}
    else if(effect==='candles'){for(i=0;i<cnt(8);i++)helpers.petal('🕯')}
    else if(effect==='feathers'){for(i=0;i<cnt(15);i++)helpers.petal('🪶')}
    else if(effect==='spiderweb'){for(i=0;i<3;i++){el=document.createElement('div');el.style.position='absolute';el.style.left=(i*33)+'%';el.style.top='0';el.style.width='1px';el.style.height='100%';el.style.background='linear-gradient(180deg,transparent,#00ff88,transparent)';el.style.opacity='.15';overlay.appendChild(el)}}
    else if(effect==='fog'){for(i=0;i<cnt(10);i++){el=document.createElement('div');el.className='effect-wave';el.style.bottom=(Math.random()*100)+'%';overlay.appendChild(el)}}
    else{for(i=0;i<cnt(15);i++)helpers.star('small')}
  }catch(e){console.warn('[Effects]',e)}
}
window.startEffects=startEffects;

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
window.renderTabBar=renderTabBar;

function updateHeader(){
  var avatar=document.getElementById('headerAvatar');
  if(avatar&&state.profile)avatar.textContent=state.profile.emoji||'👤';
}
window.updateHeader=updateHeader;

/* ============ NAVIGATION ============ */
var MAIN_PAGES=['dashboard','tasks','learning','calendar','vision','ai','more'];

function navigate(page,silent){
  if(!page)page='dashboard';
  var prev=currentPage;
  currentPage=page;
  if(!silent&&prev&&prev!==page){
    if(MAIN_PAGES.indexOf(page)>=0){_backStack=[];tgBackButtonHide()}
    else{if(_backStack[_backStack.length-1]!==prev)_backStack.push(prev);tgBackButtonShow()}
  }
  try{renderTabBar()}catch(e){}
  try{updateHeader()}catch(e){}
  var main=document.getElementById('app');
  if(!main)return;
  main.innerHTML='';
  var renderers={
    /* Новое v44 */
    dashboard:renderDashboard,
    spheres:renderSpheres,sphereDetail:renderSphereDetail,
    projects:renderProjects,projectDetail:renderProjectDetail,projectEditor:renderProjectEditor,
    coach:renderCoach,coachSettings:renderCoachSettings,
    schedule:renderSchedule,scheduleEditor:renderScheduleEditor,
    focus:renderFocus,eveningReview:renderEveningReview,weeklyReview:renderWeeklyReview,monthlyReview:renderMonthlyReview,
    achievements:renderAchievements,achievementsCategory:renderAchievementsCategory,
    /* Старые роуты (совместимость) */
    tasks:renderTasks,matrix:renderMatrix,learning:renderLearning,
    levels:renderLevels,levelDetail:renderLevelDetail,moduleDetail:renderLevelDetail,
    skills:renderSkills,methods:renderMethods,english:renderEnglish,
    memory:renderMemory,iq:renderIQ,eq:renderEQ,finance:renderFinance,
    neuromodule:renderNeuro,psychology:renderPsychology,thinking:renderThinking,
    etiquette:renderEtiquette,hormones:renderHormones,wealth:renderWealth,
    planning:renderPlanning,plantoday:renderPlanToday,planweek:renderPlanWeek,
    planmonth:renderPlanMonth,obsidian:renderObsidian,gcal:renderGcal,calendar:renderCalendar,
    vision:renderVision,visionex:renderVisionExercises,visiontrack:renderVisionTracker,
    visiontips:renderVisionTips,vision60:renderVision60,
    ai:renderAI,health:renderHealth,water:renderWater,mood:renderMood,
    workouts:renderWorkouts,meditation:renderMeditation,meds:renderMeds,
    recovery:renderRecovery,medical:renderMedical,
    entertainment:renderEntertainment,resources:renderResources,
    movies:renderMovies,series:renderSeries,books:renderBooks,
    musiclib:renderMusic,gameslib:renderGames,podcastslib:renderPodcasts,
    habitList:renderHabitList,habitCatalog:renderHabitCatalog,habitDetail:renderHabitDetail,habitEditor:renderHabitEditor,
    brain:renderBrain,brainGame:renderBrainGame,brainStats:renderBrainStats,
    antistress:renderAntistress,antistressDetail:renderAntistressDetail,
    sleep:renderSleep,sleepCalendar:renderSleepCalendar,sleepEditor:renderSleepEditor,
    games:renderLearningGames,gamePlay:renderGamePlay,
    materials:renderMaterials,materialDetail:renderMaterialDetail,
    notifications:renderNotifications,
    snapshot:renderSnapshot,recommendations:renderRecommendations,
    dailyReport:renderDailyReport,weeklyReport:renderWeeklyReport,
    goals:renderGoals,notes:renderNotes,journal:renderJournal,
    more:renderMore,stats:renderStats,detailedStats:renderDetailedStats,
    timer:renderTimer,domains:renderDomains,
    profile:renderProfile,profileV2:renderProfileV2,settings:renderSettings,
    settingsV2:renderSettingsV2,integrations:renderIntegrations,storage:renderStorage,
    screentracker:renderScreenTracker,detoxcourse:renderDetoxCourse,
    dailySurvey:renderDailySurvey,survey:renderSurvey,
    plan:renderPersonalPlan
  };
  (window.ALL_NEW_COURSES||[]).forEach(function(course){
    renderers[course.id]=function(){renderCourse(course,course.id+'Progress')};
  });
  var fn=renderers[page];
  if(typeof fn!=='function'){
    main.innerHTML='<div class="page"><div class="title-xl">🚧 '+page+'</div><div class="card"><div class="empty"><div class="empty-icon">🚧</div><div class="empty-title">Раздел не подключён</div></div></div></div>';
    return;
  }
  try{
    fn();
    setTimeout(function(){try{attachVoiceAll('app')}catch(e){}},50);
  }catch(e){
    console.error('Render ['+page+']:',e);
    main.innerHTML='<div class="page"><div class="card"><div class="empty"><div class="empty-icon">⚠️</div><div class="empty-title">Ошибка</div><div class="empty-text">'+esc(e.message||'')+'</div></div></div></div>';
  }
  window.scrollTo({top:0});
  if(page==='dashboard'||page==='snapshot'||page==='dailyReport'||page==='weeklyReport'||page==='spheres'){
    try{refreshSnapshot()}catch(e){}
  }
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
  html+='<div class="card" style="margin:0;padding:14px;">';
  html+='<div class="row-between mb-2"><div class="list-title">🌈 Эффекты</div><button class="btn btn-ghost btn-xs" onclick="state.settings.effectsEnabled=!state.settings.effectsEnabled;save();startEffects();openThemePicker()">'+(state.settings.effectsEnabled?'Вкл':'Выкл')+'</button></div>';
  html+='<div class="row-between"><div class="list-title">💫 Интенсивность</div><div class="row" style="gap:4px;">';
  [0.5,1,1.5,2].forEach(function(v){
    var active=(state.settings.effectsIntensity||1)===v;
    html+='<button class="btn '+(active?'btn-primary':'btn-ghost')+' btn-xs" onclick="state.settings.effectsIntensity='+v+';save();startEffects();openThemePicker()">'+v+'×</button>';
  });
  html+='</div></div></div>';
  openSheet('Тема',html);
}
function setTheme(id){
  try{state.settings.theme=id;applyTheme(id);save();haptic('success');closeSheet();toast('Тема: '+id,'success')}
  catch(e){toast('Ошибка','error')}
}
window.openThemePicker=openThemePicker;
window.setTheme=setTheme;
function openStatsQuick(){navigate('stats')}
window.openStatsQuick=openStatsQuick;

/* ============================================================
   DASHBOARD v44 — с кругом 7 сфер
   ============================================================ */
function renderDashboard(){
  var hour=new Date().getHours();
  var greet=hour<6?'Доброй ночи':hour<12?'Доброе утро':hour<18?'Добрый день':'Добрый вечер';
  var userName=state.profile.name?', '+state.profile.name:'';
  var snap=null;
  try{snap=buildUserSnapshot(state)}catch(e){}
  var scores=state.spheres.lastScores||{};
  var balance=getSpheresBalance(scores);
  var phase=getCurrentPhase();

  var html='<div class="page">';
  html+='<div class="title-xl">'+greet+userName+'</div>';

  /* Фаза дня */
  if(phase){
    html+='<div class="card" style="background:linear-gradient(135deg,'+phase.color+'22,'+phase.color+'11);border-color:'+phase.color+'55;">';
    html+='<div style="display:flex;align-items:center;gap:12px;">';
    html+='<div style="font-size:36px;">'+phase.emoji+'</div>';
    html+='<div style="flex:1;"><div style="font-size:16px;font-weight:800;">'+phase.name+'</div>';
    html+='<div class="footnote text-secondary">'+phase.desc+'</div></div>';
    html+='<div class="badge badge-brand">'+getNowHHMM()+'</div>';
    html+='</div></div>';
  }

  /* Круг 7 сфер */
  html+='<div class="card" onclick="navigate(\'spheres\')" style="cursor:pointer;">';
  html+='<div class="row-between mb-3"><div style="font-size:16px;font-weight:800;">🎯 Баланс сфер</div>';
  html+='<div class="badge badge-brand">'+balance.balance+'%</div></div>';
  html+=renderSpheresCircle(scores,200);
  html+='<div class="footnote text-secondary" style="text-align:center;margin-top:10px;">Средний балл: '+balance.avg+'/10'+(balance.weakest?' · Слабая: '+balance.weakest.emoji+' '+balance.weakest.name:'')+'</div>';
  html+='</div>';

  /* Рекомендация по слабой сфере */
  if(balance.weakest){
    var recs=getSphereRecommendations(balance.weakest.id,balance.weakest.value||0);
    if(recs.length){
      html+='<div class="card" style="border-left:3px solid '+balance.weakest.color+';">';
      html+='<div style="display:flex;gap:10px;"><div style="font-size:28px;">'+recs[0].emoji+'</div>';
      html+='<div style="flex:1;"><div style="font-weight:800;font-size:14px;">'+esc(recs[0].title)+'</div>';
      html+='<div class="footnote text-secondary">'+esc(recs[0].text)+'</div></div></div></div>';
    }
  }

  /* Совет коуча */
  var tip=getRandomCoachTip(balance.weakest?balance.weakest.id:'health');
  if(tip){
    html+='<div class="card" style="background:linear-gradient(135deg,color-mix(in srgb,var(--brand) 15%,transparent),color-mix(in srgb,var(--brand-2) 10%,transparent));">';
    html+='<div class="row-between mb-2"><div style="font-size:14px;font-weight:800;">💡 Совет коуча</div>';
    html+='<button class="btn btn-ghost btn-xs" onclick="navigate(\'coach\')">→</button></div>';
    html+='<div style="display:flex;gap:10px;"><div style="font-size:24px;">'+tip.emoji+'</div>';
    html+='<div style="flex:1;font-size:13px;line-height:1.5;">'+esc(tip.text)+'</div></div></div>';
  }

  /* Привычки */
  var habitsToday=getHabitsForToday();
  if(habitsToday.length){
    var doneH=habitsToday.filter(function(h){return isHabitDoneToday(h.id)}).length;
    html+='<div class="card" onclick="navigate(\'habitList\')" style="cursor:pointer;">';
    html+='<div class="row-between mb-3"><div style="font-size:16px;font-weight:800;">🔄 Привычки</div>';
    html+='<div class="badge badge-brand">'+doneH+'/'+habitsToday.length+'</div></div>';
    html+='<div class="progress" style="margin-bottom:10px;"><div class="progress-fill" style="width:'+Math.round(doneH/habitsToday.length*100)+'%;"></div></div>';
    habitsToday.slice(0,3).forEach(function(h){
      var done=isHabitDoneToday(h.id);
      var tpl=getHabitTemplate(h.templateId);
      var emoji=tpl?tpl.emoji:(h.emoji||'✅');
      html+='<div style="display:flex;gap:10px;align-items:center;padding:6px 0;'+(done?'opacity:.5;':'')+'">';
      html+='<div style="font-size:18px;">'+(done?'✅':emoji)+'</div>';
      html+='<div style="flex:1;font-weight:600;font-size:13px;'+(done?'text-decoration:line-through;':'')+'">'+esc(h.title||'Привычка')+'</div></div>';
    });
    html+='</div>';
  }

  /* Фокус */
  if(state.focus&&state.focus.active){
    var elapsed=Math.floor((Date.now()-new Date(state.focus.active.startedAt).getTime())/1000);
    var mins=Math.floor(elapsed/60);
    html+='<div class="card card-gradient" onclick="navigate(\'focus\')" style="cursor:pointer;">';
    html+='<div style="font-size:14px;opacity:.9;">⏱ Фокус идёт</div>';
    html+='<div style="font-size:32px;font-weight:800;">'+pad(mins)+' мин</div>';
    html+='<div style="font-size:12px;opacity:.9;">'+esc(state.focus.active.taskTitle||'Фокус-сессия')+'</div>';
    html+='</div>';
  } else {
    html+='<div class="card"><h2>⏱ Фокус</h2>';
    html+='<div class="row" style="gap:6px;">';
    html+='<button class="btn btn-primary" style="flex:1;" onclick="startFocusSession(25,\'Pomodoro\')">▶ 25 мин</button>';
    html+='<button class="btn btn-ghost" style="flex:1;" onclick="startFocusSession(50,\'Focus\')">▶ 50 мин</button>';
    html+='<button class="btn btn-ghost" style="flex:1;" onclick="startFocusSession(90,\'Deep Work\')">▶ 90 мин</button>';
    html+='</div></div>';
  }

  /* Отчёты */
  html+='<div class="card"><h2>📊 Отчёты</h2>';
  html+='<div class="row" style="gap:6px;">';
  html+='<button class="btn btn-primary" style="flex:1;" onclick="navigate(\'dailyReport\')">📊 День</button>';
  html+='<button class="btn btn-ghost" style="flex:1;" onclick="navigate(\'weeklyReview\')">📈 Неделя</button>';
  html+='<button class="btn btn-ghost" style="flex:1;" onclick="navigate(\'monthlyReview\')">📆 Месяц</button>';
  html+='</div></div>';

  /* Быстрые действия */
  html+='<div class="card"><h2>⚡ Быстро</h2><div class="group-grid">';
  html+='<div class="group-item" onclick="openEntityEditor(\'task\',null)"><div class="group-item-icon">➕</div><div class="group-item-label">Задача</div></div>';
  html+='<div class="group-item" onclick="addWater()"><div class="group-item-icon">💧</div><div class="group-item-label">Вода</div></div>';
  html+='<div class="group-item" onclick="quickMoodLog()"><div class="group-item-icon">💭</div><div class="group-item-label">Настроение</div></div>';
  html+='<div class="group-item" onclick="navigate(\'eveningReview\')"><div class="group-item-icon">🌙</div><div class="group-item-label">Вечерний обзор</div></div>';
  html+='<div class="group-item" onclick="navigate(\'projects\')"><div class="group-item-icon">📁</div><div class="group-item-label">Проекты</div></div>';
  html+='<div class="group-item" onclick="navigate(\'achievements\')"><div class="group-item-icon">🏆</div><div class="group-item-label">Достижения</div></div>';
  html+='</div></div>';

  /* Задачи */
  var pending=state.tasks.filter(function(t){return t.status==='pending'});
  html+='<div class="card"><div class="row-between mb-3"><h2 style="margin:0;">📋 Задачи</h2>';
  html+='<button class="btn btn-ghost btn-xs" onclick="navigate(\'tasks\')">Все →</button></div>';
  if(pending.length){
    pending.slice().sort(function(a,b){return getEisenhowerPriority(a)-getEisenhowerPriority(b)}).slice(0,4).forEach(function(t){html+=taskRow(t)});
  }else{html+='<div class="empty"><div class="empty-icon">✨</div><div class="empty-title">Всё выполнено</div></div>'}
  html+='</div>';

  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderDashboard=renderDashboard;

/* ============ КРУГ 7 СФЕР (SVG) ============ */
function renderSpheresCircle(scores,size){
  size=size||280;
  var r=size/2;
  var innerR=r*0.35;
  var outerR=r*0.95;
  var spheres=LIFE_SPHERES||[];
  var angleStep=360/spheres.length;
  var html='<div class="spheres-circle-wrap"><div class="spheres-circle" style="width:'+size+'px;height:'+size+'px;">';
  html+='<svg viewBox="0 0 '+size+' '+size+'">';
  spheres.forEach(function(s,i){
    var score=scores[s.id]||0;
    var ratio=Math.max(0.05,score/10);
    var angle1=(i*angleStep-90)*Math.PI/180;
    var angle2=((i+1)*angleStep-90)*Math.PI/180;
    var gap=(angleStep*0.04)*Math.PI/180;
    var a1=angle1+gap, a2=angle2-gap;
    var x1=cx(size,r,innerR,a1);
    var y1=cy(size,r,innerR,a1);
    var x2=cx(size,r,innerR,a2);
    var y2=cy(size,r,innerR,a2);
    var x3=cx(size,r,innerR+(outerR-innerR)*ratio,a2);
    var y3=cy(size,r,innerR+(outerR-innerR)*ratio,a2);
    var x4=cx(size,r,innerR+(outerR-innerR)*ratio,a1);
    var y4=cy(size,r,innerR+(outerR-innerR)*ratio,a1);
    var path='M'+x1.toFixed(1)+','+y1.toFixed(1)+' A'+innerR+','+innerR+' 0 0 1 '+x2.toFixed(1)+','+y2.toFixed(1)+
             ' L'+x3.toFixed(1)+','+y3.toFixed(1)+' A'+(innerR+(outerR-innerR)*ratio)+','+(innerR+(outerR-innerR)*ratio)+' 0 0 0 '+x4.toFixed(1)+','+y4.toFixed(1)+' Z';
    html+='<path class="sphere-sector" d="'+path+'" fill="'+s.color+'" opacity="'+(score>0?0.85:0.25)+'" onclick="openSphereDetail(\''+s.id+'\')"/>';
  });
  html+='</svg>';
  html+='<div class="sphere-center-label">';
  var avg=0,c=0;
  spheres.forEach(function(s){if(scores[s.id]){avg+=scores[s.id];c++}});
  avg=c?Math.round(avg/c*10)/10:0;
  html+='<div class="sphere-center-value">'+avg+'</div>';
  html+='<div class="sphere-center-text">баланс</div>';
  html+='</div></div></div>';
  return html;
}
function cx(size,r,radius,angle){return size/2+radius*Math.cos(angle)}
function cy(size,r,radius,angle){return size/2+radius*Math.sin(angle)}

/* ============ СФЕРЫ: главный экран ============ */
function renderSpheres(){
  var scores=state.spheres.lastScores||{};
  var balance=getSpheresBalance(scores);
  var html='<div class="page">';
  html+='<div class="title-xl">🎯 Сферы жизни</div>';

  html+='<div class="card">';
  html+=renderSpheresCircle(scores,280);
  html+='<div class="stat-grid mt-3">';
  html+='<div class="stat-item"><div class="stat-value">'+balance.avg+'</div><div class="stat-label">Средний</div></div>';
  html+='<div class="stat-item"><div class="stat-value">'+balance.balance+'%</div><div class="stat-label">Баланс</div></div>';
  html+='<div class="stat-item"><div class="stat-value">'+Object.keys(scores).length+'/7</div><div class="stat-label">Оценено</div></div>';
  html+='</div></div>';

  html+='<div class="card"><h2>📊 Все сферы</h2>';
  LIFE_SPHERES.forEach(function(s){
    var score=scores[s.id]||0;
    var pct=score*10;
    html+='<div class="list-row" onclick="openSphereDetail(\''+s.id+'\')" style="border-left:3px solid '+s.color+';">';
    html+='<div class="list-icon" style="background:'+s.color+'22;color:'+s.color+';">'+s.emoji+'</div>';
    html+='<div class="list-body"><div class="list-title">'+s.name+'</div>';
    html+='<div class="list-subtitle">'+esc(s.desc)+'</div>';
    html+='<div class="progress" style="margin-top:6px;height:4px;"><div class="progress-fill" style="width:'+pct+'%;background:'+s.color+';"></div></div></div>';
    html+='<div class="list-value">'+(score>0?score+'/10':'—')+'</div>';
    html+='</div>';
  });
  html+='</div>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderSpheres=renderSpheres;

/* ============ СФЕРА: детали ============ */
function openSphereDetail(id){currentSphereId=id;navigate('sphereDetail')}
window.openSphereDetail=openSphereDetail;

function renderSphereDetail(){
  var s=getSphere(currentSphereId);
  if(!s){navigate('spheres');return}
  var score=(state.spheres.lastScores||{})[s.id]||0;
  var recs=getSphereRecommendations(s.id,score);
  var habitsForSphere=getHabitsBySphere(s.id);
  var html='<div class="page">';
  html+='<div style="text-align:center;margin-bottom:20px;">';
  html+='<div style="font-size:56px;">'+s.emoji+'</div>';
  html+='<div class="title-xl" style="color:'+s.color+';">'+s.name+'</div>';
  html+='<div class="footnote text-secondary">'+esc(s.desc)+'</div>';
  html+='</div>';

  /* Оценка */
  html+='<div class="card">';
  html+='<div style="text-align:center;padding:12px 0;"><div id="sphereScoreDisplay" style="font-size:64px;font-weight:800;color:'+s.color+';">'+score+'</div>';
  html+='<div class="footnote text-tertiary">'+SPHERE_SCORE_HINTS[score]+'</div></div>';
  html+='<input type="range" min="0" max="10" value="'+score+'" style="width:100%;margin:14px 0;" oninput="document.getElementById(\'sphereScoreDisplay\').textContent=this.value;document.getElementById(\'sphereScoreLabel\').textContent=(window.SPHERE_SCORE_HINTS||{})[this.value]||\'\';" id="sphereScoreRange"/>';
  html+='<div class="footnote text-secondary mb-3" style="text-align:center;" id="sphereScoreLabel">'+SPHERE_SCORE_HINTS[score]+'</div>';
  html+='<button class="btn btn-primary btn-block" onclick="saveSphereScore(\''+s.id+'\')">💾 Сохранить оценку</button>';
  html+='</div>';

  /* Рекомендации */
  if(recs.length){
    html+='<div class="card"><h2>💡 Рекомендации ('+recs.length+')</h2>';
    recs.forEach(function(r){
      html+='<div style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--divider);">';
      html+='<div style="font-size:22px;">'+r.emoji+'</div>';
      html+='<div style="flex:1;"><div style="font-weight:700;font-size:13px;">'+esc(r.title)+'</div>';
      html+='<div class="footnote text-secondary">'+esc(r.text)+'</div></div></div>';
    });
    html+='</div>';
  }

  /* Привычки для сферы */
  if(habitsForSphere.length){
    html+='<div class="card"><h2>🔄 Привычки для этой сферы ('+habitsForSphere.length+')</h2>';
    habitsForSphere.slice(0,10).forEach(function(h){
      html+='<div class="list-row" onclick="addHabitFromWhy(\''+h.id+'\')">';
      html+='<div class="list-icon">'+h.emoji+'</div>';
      html+='<div class="list-body"><div class="list-title">'+esc(h.title)+'</div>';
      html+='<div class="list-subtitle">'+esc(h.why[0].text)+'</div></div>';
      html+='<div class="list-chevron">+</div></div>';
    });
    html+='</div>';
  }

  /* Быстрые действия */
  html+='<div class="card"><h2>⚡ Быстрые действия</h2><div class="group-grid">';
  html+='<div class="group-item" onclick="openSphereTask(\''+s.id+'\')"><div class="group-item-icon">➕</div><div class="group-item-label">Задача</div></div>';
  html+='<div class="group-item" onclick="openSphereHabit(\''+s.id+'\')"><div class="group-item-icon">🔄</div><div class="group-item-label">Привычка</div></div>';
  html+='<div class="group-item" onclick="openSphereProject(\''+s.id+'\')"><div class="group-item-icon">📁</div><div class="group-item-label">Проект</div></div>';
  html+='</div></div>';

  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderSphereDetail=renderSphereDetail;

function saveSphereScore(id){
  var r=document.getElementById('sphereScoreRange');if(!r)return;
  var val=parseInt(r.value);
  if(!state.spheres)state.spheres={scores:{},lastScores:{},history:[]};
  if(!state.spheres.lastScores)state.spheres.lastScores={};
  state.spheres.lastScores[id]=val;
  var t=today();
  if(!state.spheres.scores)state.spheres.scores={};
  if(!state.spheres.scores[t])state.spheres.scores[t]={};
  state.spheres.scores[t][id]=val;
  /* История */
  var avg=0,c=0;
  LIFE_SPHERES.forEach(function(s){if(state.spheres.lastScores[s.id]){avg+=state.spheres.lastScores[s.id];c++}});
  avg=c?Math.round(avg/c*10)/10:0;
  var bal=getSpheresBalance(state.spheres.lastScores);
  state.spheres.history.push({date:t,avg:avg,balance:bal.balance,scores:JSON.parse(JSON.stringify(state.spheres.scores[t]))});
  if(state.spheres.history.length>365)state.spheres.history=state.spheres.history.slice(-365);
  state.xp=(state.xp||0)+5;
  save();haptic('success');toast('✓ Оценено: '+val+'/10','success');
  navigate('spheres');
}
window.saveSphereScore=saveSphereScore;

/* ============ БЫСТРЫЕ ДЕЙСТВИЯ В СФЕРЕ ============ */
function openSphereTask(sphereId){
  var s=getSphere(sphereId);
  openSheet('Задача · '+s.name,
    '<div class="field"><label class="field-label">Название</label><input type="text" id="st-title"/></div>'+
    '<div class="field"><label class="field-label">Описание</label><textarea id="st-desc"></textarea></div>'+
    '<button class="btn btn-primary btn-block mt-3" onclick="saveSphereTask(\''+sphereId+'\')">💾 Создать</button>');
}
window.openSphereTask=openSphereTask;
function saveSphereTask(sphereId){
  var title=(document.getElementById('st-title')||{}).value||'';
  if(!title.trim())return toast('Введи название','error');
  state.tasks.unshift({
    id:uid(),title:title.trim(),
    description:(document.getElementById('st-desc')||{}).value||'',
    sphereId:sphereId,category:getSphere(sphereId).name,
    planned_time:30,status:'pending',priority:'medium',created_at:nowISO()
  });
  save();haptic('success');closeSheet();toast('✓ Создано','success');
  navigate('sphereDetail');
}
window.saveSphereTask=saveSphereTask;

function openSphereHabit(sphereId){
  var s=getSphere(sphereId);
  var habits=getHabitsBySphere(sphereId).slice(0,20);
  var html='<div class="footnote text-secondary mb-3">Выбери привычку для сферы «'+s.name+'»</div>';
  habits.forEach(function(h){
    html+='<div class="list-row" onclick="addHabitFromWhy(\''+h.id+'\')"><div class="list-icon">'+h.emoji+'</div><div class="list-body"><div class="list-title">'+esc(h.title)+'</div></div></div>';
  });
  openSheet('Привычки · '+s.name,html);
}
window.openSphereHabit=openSphereHabit;

function openSphereProject(sphereId){
  var s=getSphere(sphereId);
  openProjectEditor(null,sphereId);
}
window.openSphereProject=openSphereProject;

/* ============ ДОБАВИТЬ ПРИВЫЧКУ С «ЗАЧЕМ» ============ */
function addHabitFromWhy(whyId){
  var hw=getHabitWithWhy(whyId);if(!hw)return;
  var newHabit={
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
    duration:hw.duration||22,
    startDate:today(),
    streak:0,bestStreak:0,lastCompletedDate:null,
    active:true,createdAt:nowISO()
  };
  state.habits.push(newHabit);
  save();haptic('success');toast('✓ '+hw.title,'success');
  closeSheet();
  currentHabitId=newHabit.id;
  navigate('habitDetail');
}
window.addHabitFromWhy=addHabitFromWhy;

/* ============ ПРИВЫЧКИ ============ */
function getUserHabit(id){if(!id)return null;return state.habits.find(function(h){return h.id===id})}
window.getUserHabit=getUserHabit;
function isHabitDoneToday(id){var h=getUserHabit(id);return h?h.lastCompletedDate===today():false}
window.isHabitDoneToday=isHabitDoneToday;
function getHabitsForToday(){
  var dow=new Date().getDay();var dowMon=dow===0?7:dow;
  return (state.habits||[]).filter(function(h){
    if(!h.active)return true;
    var type=h.scheduleType||'daily';
    if(type==='daily')return true;
    if(type==='custom'&&h.weekDays)return h.weekDays.indexOf(dowMon)>=0;
    return true;
  });
}
window.getHabitsForToday=getHabitsForToday;
function toggleHabitToday(id){
  var h=getUserHabit(id);if(!h)return;
  var t=today();
  if(h.lastCompletedDate===t){
    h.lastCompletedDate=null;
    h.streak=Math.max(0,(h.streak||1)-1);
  }else{
    if(h.lastCompletedDate===yesterday())h.streak=(h.streak||0)+1;
    else h.streak=1;
    h.lastCompletedDate=t;
    if((h.streak||0)>(h.bestStreak||0))h.bestStreak=h.streak;
    state.xp=(state.xp||0)+10;
    haptic('success');
  }
  if(!state.habitHistory[h.id])state.habitHistory[h.id]={};
  state.habitHistory[h.id][t]={completed:h.lastCompletedDate===t};
  save();
  if(currentPage==='habitList')renderHabitList();
  else if(currentPage==='habitDetail')renderHabitDetail();
  else if(currentPage==='dashboard')renderDashboard();
}
window.toggleHabitToday=toggleHabitToday;
function getHabit66Progress(h){
  if(!h.startDate)return{pct:0,done:0,total:h.duration||22};
  var dur=h.duration||22;var total=dur;
  var done=0;
  if(state.habitHistory&&state.habitHistory[h.id]){
    Object.keys(state.habitHistory[h.id]).forEach(function(d){
      if(state.habitHistory[h.id][d].completed)done++;
    });
  }
  var pct=Math.min(100,Math.round(done/total*100));
  var start=new Date(h.startDate);var end=new Date(start);end.setDate(end.getDate()+dur);
  return{pct:pct,done:done,total:total,startDate:h.startDate,endDate:end.toISOString().slice(0,10)};
}
window.getHabit66Progress=getHabit66Progress;

function renderHabitList(){
  var habits=state.habits||[];
  var todayHabits=getHabitsForToday();
  var doneToday=todayHabits.filter(function(h){return h.lastCompletedDate===today()}).length;
  var html='<div class="page">';
  html+='<div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">🔄 Привычки</div>';
  html+='<div class="row" style="gap:6px;">';
  html+='<button class="btn btn-ghost btn-sm" onclick="navigate(\'habitCatalog\')">📚</button>';
  html+='<button class="btn btn-primary btn-sm" onclick="navigate(\'habitEditor\')">+</button>';
  html+='</div></div>';
  if(habits.length){
    html+='<div class="card card-gradient"><div style="font-size:12px;opacity:.9;">Сегодня</div><div style="font-size:36px;font-weight:800;">'+doneToday+' / '+todayHabits.length+'</div></div>';
    var cats=window.HABIT_CATEGORIES||[];
    html+='<div class="quick-tabs"><button class="quick-tab '+(habitCatFilter==='all'?'active':'')+'" onclick="habitCatFilter=\'all\';renderHabitList()">Все ('+habits.length+')</button>';
    cats.forEach(function(c){
      var cnt=habits.filter(function(h){return h.category===c.id}).length;
      if(!cnt)return;
      html+='<button class="quick-tab '+(habitCatFilter===c.id?'active':'')+'" onclick="habitCatFilter=\''+c.id+'\';renderHabitList()">'+c.emoji+' '+c.name+' ('+cnt+')</button>';
    });
    html+='</div>';
    var filtered=habitCatFilter==='all'?habits:habits.filter(function(h){return h.category===habitCatFilter});
    if(!filtered.length)html+='<div class="empty"><div class="empty-icon">🔄</div><div class="empty-title">Нет привычек</div></div>';
    else filtered.forEach(function(h){html+=renderHabitRow(h)});
  }else{
    html+='<div class="card"><div class="empty"><div class="empty-icon">🔄</div><div class="empty-title">Нет привычек</div><div class="empty-text">Выбери из 200+ шаблонов</div></div>';
    html+='<button class="btn btn-primary btn-block mt-3" onclick="navigate(\'habitCatalog\')">📚 Каталог</button>';
    html+='<button class="btn btn-ghost btn-block mt-2" onclick="navigate(\'habitEditor\')">➕ Создать</button></div>';
  }
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderHabitList=renderHabitList;

function renderHabitRow(h){
  var tpl=getHabitTemplate(h.templateId);
  var emoji=h.emoji||(tpl?tpl.emoji:'✅');
  var title=h.title||(tpl?tpl.title:'Привычка');
  var done=isHabitDoneToday(h.id);
  var prog=getHabit66Progress(h);
  var cat=(window.HABIT_CATEGORIES||[]).find(function(c){return c.id===h.category});
  var catColor=cat?cat.color:'#5b9eff';
  return '<div class="method-card" onclick="openHabitDetail(\''+h.id+'\')" style="border-left:3px solid '+catColor+';">'+
    '<div class="method-header"><div class="method-emoji">'+emoji+'</div>'+
    '<div style="flex:1;min-width:0;"><div class="method-title">'+esc(title)+'</div>'+
    '<div class="method-cat">🔥 '+(h.streak||0)+' · Лучший '+(h.bestStreak||0)+' · '+prog.done+'/'+prog.total+'</div></div>'+
    '<button class="task-checkbox '+(done?'checked':'')+'" onclick="event.stopPropagation();toggleHabitToday(\''+h.id+'\')" style="width:36px;height:36px;">'+(done?'✓':'')+'</button>'+
    '</div>'+
    '<div class="progress" style="margin-top:8px;height:5px;"><div class="progress-fill" style="width:'+prog.pct+'%;"></div></div>'+
  '</div>';
}
window.renderHabitRow=renderHabitRow;

function renderHabitCatalog(){
  var tpls=window.HABIT_TEMPLATES||[];
  var habitsWhy=window.HABITS_WITH_WHY||[];
  var all = habitsWhy.length?habitsWhy:tpls;
  var cats=window.HABIT_CATEGORIES||[];
  var html='<div class="page"><div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">📚 Каталог</div><div class="badge badge-brand">'+all.length+'</div></div>';
  html+='<div class="quick-tabs"><button class="quick-tab '+(habitCatFilter==='all'?'active':'')+'" onclick="habitCatFilter=\'all\';renderHabitCatalog()">Все</button>';
  cats.forEach(function(c){
    var cnt=all.filter(function(t){return (t.cat||t.sphereId)===c.id}).length;
    html+='<button class="quick-tab '+(habitCatFilter===c.id?'active':'')+'" onclick="habitCatFilter=\''+c.id+'\';renderHabitCatalog()">'+c.emoji+' '+c.name+' ('+cnt+')</button>';
  });
  html+='</div>';
  html+='<div class="search-bar"><span style="color:var(--text-3);">🔍</span><input type="search" placeholder="Поиск..." value="'+esc(habitSearch)+'" oninput="habitSearch=this.value;renderHabitCatalog()"/></div>';
  var filtered=habitCatFilter==='all'?all:all.filter(function(t){return (t.cat||t.sphereId)===habitCatFilter});
  if(habitSearch){var q=habitSearch.toLowerCase();filtered=filtered.filter(function(t){return (t.title||'').toLowerCase().indexOf(q)>=0})}
  filtered.forEach(function(t){
    var isWhy=!!t.why;
    var catId=t.cat||t.sphereId;
    var cat=cats.find(function(c){return c.id===catId});
    var catColor=cat?cat.color:'#5b9eff';
    html+='<div class="method-card" style="border-left:3px solid '+catColor+';" onclick="'+(isWhy?'addHabitFromWhy(\''+t.id+'\')':'addHabitFromTemplate(\''+t.id+'\')')+'">';
    html+='<div class="method-header"><div class="method-emoji">'+t.emoji+'</div><div style="flex:1;"><div class="method-title">'+esc(t.title)+'</div><div class="method-cat">'+esc((t.desc||(t.why&&t.why[0].text)||''))+'</div></div><div class="list-chevron">+</div></div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderHabitCatalog=renderHabitCatalog;

function addHabitFromTemplate(tplId){
  var tpl=getHabitTemplate(tplId);if(!tpl)return;
  var newHabit={
    id:uid(),templateId:tplId,category:tpl.cat,emoji:tpl.emoji,
    title:tpl.title,desc:tpl.desc||'',
    scheduleType:tpl.defaultType||'daily',
    targetCount:tpl.defaultTarget||null,
    duration:tpl.defaultDuration||22,
    timeSlot:tpl.defaultTime||'day',
    startDate:today(),
    microGoals:(tpl.microGoals||[]).slice(),
    streak:0,bestStreak:0,lastCompletedDate:null,
    active:true,createdAt:nowISO()
  };
  state.habits.push(newHabit);
  save();haptic('success');toast('✓ '+tpl.title,'success');
  currentHabitId=newHabit.id;
  navigate('habitDetail');
}
window.addHabitFromTemplate=addHabitFromTemplate;

function openHabitDetail(id){currentHabitId=id;navigate('habitDetail')}
window.openHabitDetail=openHabitDetail;
function renderHabitDetail(){
  var h=getUserHabit(currentHabitId);
  if(!h){navigate('habitList');return}
  var tpl=getHabitTemplate(h.templateId);
  var emoji=h.emoji||(tpl?tpl.emoji:'✅');
  var title=h.title||(tpl?tpl.title:'Привычка');
  var prog=getHabit66Progress(h);
  var done=isHabitDoneToday(h.id);
  var html='<div class="page">';
  html+='<div style="text-align:center;margin-bottom:20px;"><div style="font-size:56px;">'+emoji+'</div><div class="title-xl">'+esc(title)+'</div></div>';
  html+='<div class="card card-gradient"><div style="font-size:12px;opacity:.9;">Прогресс</div><div style="font-size:40px;font-weight:800;">'+prog.pct+'%</div><div style="font-size:12px;opacity:.9;margin-top:6px;">'+prog.done+'/'+prog.total+' дней</div></div>';
  html+='<div class="stat-grid mb-4"><div class="stat-item"><div class="stat-value">'+(h.streak||0)+'</div><div class="stat-label">Серия</div></div><div class="stat-item"><div class="stat-value">'+(h.bestStreak||0)+'</div><div class="stat-label">Лучшая</div></div><div class="stat-item"><div class="stat-value">'+prog.done+'</div><div class="stat-label">Всего</div></div></div>';
  html+='<button class="btn '+(done?'btn-success':'btn-primary')+' btn-block mb-3" onclick="toggleHabitToday(\''+h.id+'\')">'+(done?'✓ Выполнено':'Отметить')+'</button>';

  if(h.why&&h.why.length){
    html+='<div class="card"><h2>💡 Зачем это нужно</h2>';
    h.why.forEach(function(w,i){
      html+='<div style="margin-bottom:12px;"><div style="font-weight:700;font-size:13px;margin-bottom:4px;">'+(i+1)+'. '+esc(w.text)+'</div>';
      html+='<div class="footnote text-secondary">'+esc(w.long)+'</div></div>';
    });
    html+='</div>';
  }
  if(h.how&&h.how.length){
    html+='<div class="card"><h2>📋 Как внедрить</h2><ul style="padding-left:20px;">';
    h.how.forEach(function(x){html+='<li style="margin-bottom:6px;">'+esc(x)+'</li>'});
    html+='</ul></div>';
  }
  if(h.science)html+='<div class="insight-card"><div class="insight-title">🔬 Наука</div><div class="insight-text">'+esc(h.science)+'</div></div>';

  html+='<button class="btn btn-ghost btn-block mb-2" onclick="openHabitEditor(\''+h.id+'\')">✏️ Редактировать</button>';
  html+='<button class="btn btn-danger btn-block" onclick="deleteHabit(\''+h.id+'\')">🗑 Удалить</button>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderHabitDetail=renderHabitDetail;

function openHabitEditor(id){
  if(id)currentHabitId=id;else currentHabitId=null;
  navigate('habitEditor');
}
window.openHabitEditor=openHabitEditor;
function renderHabitEditor(){
  var h=currentHabitId?getUserHabit(currentHabitId):null;
  var isNew=!h;
  if(isNew)h={scheduleType:'daily',duration:22,timeSlot:'day',startDate:today(),microGoals:[]};
  var html='<div class="page"><div class="title-xl">'+(isNew?'Новая привычка':'Редактировать')+'</div>';
  html+='<div class="card">';
  html+='<div class="field"><label class="field-label">Название *</label><input type="text" id="hab-title" value="'+esc(h.title||'')+'"/></div>';
  html+='<div class="field"><label class="field-label">Эмодзи</label><input type="text" id="hab-emoji" value="'+esc(h.emoji||'✅')+'" maxlength="4"/></div>';
  html+='<div class="field"><label class="field-label">Категория</label><select id="hab-category">';
  (window.HABIT_CATEGORIES||[]).forEach(function(c){
    html+='<option value="'+c.id+'"'+(h.category===c.id?' selected':'')+'>'+c.emoji+' '+c.name+'</option>';
  });
  html+='</select></div></div>';
  html+='<div class="card"><h2>🎯 Цель</h2>';
  html+='<div class="field"><label class="field-label">Длительность</label><select id="hab-duration">';
  [21,22,30,66,90,180,365].forEach(function(d){
    html+='<option value="'+d+'"'+((h.duration||22)===d?' selected':'')+'>'+d+' дней</option>';
  });
  html+='</select></div>';
  html+='<div class="field"><label class="field-label">Старт</label><input type="date" id="hab-start" value="'+(h.startDate||today())+'"/></div>';
  html+='</div>';
  html+='<button class="btn btn-primary btn-block mb-2" onclick="saveHabit()">'+(isNew?'➕ Создать':'💾 Сохранить')+'</button>';
  if(!isNew)html+='<button class="btn btn-danger btn-block" onclick="deleteHabit(\''+h.id+'\')">🗑 Удалить</button>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderHabitEditor=renderHabitEditor;

function saveHabit(){
  var title=(document.getElementById('hab-title')||{}).value||'';
  if(!title.trim())return toast('Введите название','error');
  var emoji=(document.getElementById('hab-emoji')||{}).value||'✅';
  var category=(document.getElementById('hab-category')||{}).value||'health';
  var duration=parseInt((document.getElementById('hab-duration')||{}).value)||22;
  var startDate=(document.getElementById('hab-start')||{}).value||today();
  if(currentHabitId){
    var h=getUserHabit(currentHabitId);if(!h)return;
    h.title=title.trim();h.emoji=emoji;h.category=category;
    h.duration=duration;h.startDate=startDate;h.updatedAt=nowISO();
  }else{
    var newH={id:uid(),title:title.trim(),emoji:emoji,category:category,
      scheduleType:'daily',duration:duration,startDate:startDate,
      streak:0,bestStreak:0,lastCompletedDate:null,active:true,createdAt:nowISO()};
    state.habits.push(newH);currentHabitId=newH.id;
  }
  save();haptic('success');toast('✓ Сохранено','success');
  navigate('habitDetail');
}
window.saveHabit=saveHabit;

function deleteHabit(id){
  if(!confirm('Удалить?'))return;
  state.habits=state.habits.filter(function(h){return h.id!==id});
  save();toast('Удалено','info');navigate('habitList');
}
window.deleteHabit=deleteHabit;

/* ============ ПРОЕКТЫ ============ */
function renderProjects(){
  var projects=state.projects||[];
  var active=projects.filter(function(p){return p.status==='active'}).length;
  var done=projects.filter(function(p){return p.status==='done'}).length;
  var html='<div class="page">';
  html+='<div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">📁 Проекты</div>';
  html+='<button class="btn btn-primary btn-sm" onclick="openProjectEditor(null)">+</button></div>';
  html+='<div class="stat-grid mb-4">';
  html+='<div class="stat-item"><div class="stat-value">'+projects.length+'</div><div class="stat-label">Всего</div></div>';
  html+='<div class="stat-item"><div class="stat-value">'+active+'</div><div class="stat-label">В работе</div></div>';
  html+='<div class="stat-item"><div class="stat-value">'+done+'</div><div class="stat-label">Готово</div></div>';
  html+='</div>';

  html+='<div class="card"><h2>📋 Шаблоны</h2>';
  html+='<div class="compact-grid">';
  (window.PROJECT_TEMPLATES||[]).slice(0,6).forEach(function(t){
    html+='<div class="compact-item" onclick="createProjectFromTemplate(\''+t.id+'\')"><span class="compact-icon">'+t.emoji+'</span><span>'+t.name+'</span></div>';
  });
  html+='</div></div>';

  if(projects.length){
    html+='<div class="card"><h2>Мои проекты</h2>';
    projects.forEach(function(p){
      var st=getProjectStatus(p.status);
      html+='<div class="list-row" onclick="openProject(\''+p.id+'\')" style="border-left:3px solid '+st.color+';">';
      html+='<div class="list-icon">'+(p.emoji||'📁')+'</div>';
      html+='<div class="list-body"><div class="list-title">'+esc(p.title)+'</div>';
      html+='<div class="list-subtitle">'+st.emoji+' '+st.name+(p.sphereId?' · '+(getSphere(p.sphereId)||{}).name:'')+'</div>';
      html+='<div class="progress" style="margin-top:6px;height:4px;"><div class="progress-fill" style="width:'+(p.progress||0)+'%;"></div></div></div>';
      html+='<div class="list-value">'+(p.progress||0)+'%</div>';
      html+='</div>';
    });
    html+='</div>';
  }else{
    html+='<div class="card"><div class="empty"><div class="empty-icon">📁</div><div class="empty-title">Нет проектов</div><div class="empty-text">Создай из шаблона или с нуля</div></div></div>';
  }
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderProjects=renderProjects;

function createProjectFromTemplate(tplId){
  var tpl=getProjectTemplate(tplId);if(!tpl)return;
  var p={
    id:uid(),templateId:tplId,emoji:tpl.emoji,
    title:tpl.name,desc:tpl.desc,
    sphereId:tpl.sphereId,
    status:'planning',
    progress:0,
    tasks:(tpl.defaultTasks||[]).map(function(t){return{id:uid(),title:t,done:false}}),
    deadline:null,createdAt:nowISO()
  };
  state.projects.push(p);
  save();haptic('success');toast('✓ Проект создан','success');
  currentProjectId=p.id;
  navigate('projectDetail');
}
window.createProjectFromTemplate=createProjectFromTemplate;

function openProject(id){currentProjectId=id;navigate('projectDetail')}
window.openProject=openProject;

function renderProjectDetail(){
  var p=state.projects.find(function(x){return x.id===currentProjectId});
  if(!p){navigate('projects');return}
  var st=getProjectStatus(p.status);
  var sp=p.sphereId?getSphere(p.sphereId):null;
  var html='<div class="page">';
  html+='<div style="text-align:center;margin-bottom:20px;"><div style="font-size:56px;">'+(p.emoji||'📁')+'</div>';
  html+='<div class="title-xl">'+esc(p.title)+'</div>';
  if(sp)html+='<div class="footnote" style="color:'+sp.color+';">'+sp.emoji+' '+sp.name+'</div>';
  html+='</div>';
  html+='<div class="card card-gradient"><div style="font-size:12px;opacity:.9;">Прогресс</div>';
  html+='<div style="font-size:40px;font-weight:800;">'+(p.progress||0)+'%</div>';
  html+='<div style="font-size:12px;opacity:.9;margin-top:6px;">'+st.emoji+' '+st.name+'</div></div>';

  html+='<div class="card"><h2>📋 Задачи проекта</h2>';
  (p.tasks||[]).forEach(function(t,i){
    html+='<div class="task-item '+(t.done?'completed':'')+'" onclick="toggleProjectTask('+i+')">';
    html+='<div class="task-checkbox '+(t.done?'checked':'')+'">'+(t.done?'✓':'')+'</div>';
    html+='<div class="task-content"><div class="task-title">'+esc(t.title)+'</div></div></div>';
  });
  html+='<button class="btn btn-ghost btn-sm mt-2" onclick="addProjectTask()">+ Добавить</button>';
  html+='</div>';

  html+='<div class="card"><h2>📊 Статус</h2>';
  html+='<div class="row" style="gap:6px;">';
  (window.PROJECT_STATUSES||[]).forEach(function(s){
    var active=p.status===s.id;
    html+='<button class="btn '+(active?'btn-primary':'btn-ghost')+' btn-sm" onclick="setProjectStatus(\''+s.id+'\')">'+s.emoji+' '+s.name+'</button>';
  });
  html+='</div></div>';

  html+='<button class="btn btn-ghost btn-block mb-2" onclick="openProjectEditor(\''+p.id+'\')">✏️ Редактировать</button>';
  html+='<button class="btn btn-danger btn-block" onclick="deleteProject(\''+p.id+'\')">🗑 Удалить</button>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderProjectDetail=renderProjectDetail;

function toggleProjectTask(i){
  var p=state.projects.find(function(x){return x.id===currentProjectId});
  if(!p||!p.tasks[i])return;
  p.tasks[i].done=!p.tasks[i].done;
  var done=p.tasks.filter(function(t){return t.done}).length;
  p.progress=p.tasks.length?Math.round(done/p.tasks.length*100):0;
  if(p.progress===100&&p.status!=='done')p.status='done';
  save();haptic('success');renderProjectDetail();
}
window.toggleProjectTask=toggleProjectTask;

function addProjectTask(){
  var title=prompt('Задача:');
  if(!title)return;
  var p=state.projects.find(function(x){return x.id===currentProjectId});
  if(!p)return;
  if(!p.tasks)p.tasks=[];
  p.tasks.push({id:uid(),title:title,done:false});
  save();renderProjectDetail();
}
window.addProjectTask=addProjectTask;

function setProjectStatus(s){
  var p=state.projects.find(function(x){return x.id===currentProjectId});
  if(!p)return;
  p.status=s;
  save();renderProjectDetail();
}
window.setProjectStatus=setProjectStatus;

function deleteProject(id){
  if(!confirm('Удалить проект?'))return;
  state.projects=state.projects.filter(function(p){return p.id!==id});
  save();toast('Удалено','info');navigate('projects');
}
window.deleteProject=deleteProject;

function openProjectEditor(id,sphereId){
  var p=id?state.projects.find(function(x){return x.id===id}):null;
  var isNew=!p;
  if(isNew)p={status:'planning',progress:0,tasks:[],sphereId:sphereId||null};
  var html='<div class="page"><div class="title-xl">'+(isNew?'Новый проект':'Редактировать')+'</div>';
  html+='<div class="card">';
  html+='<div class="field"><label class="field-label">Название *</label><input type="text" id="proj-title" value="'+esc(p.title||'')+'"/></div>';
  html+='<div class="field"><label class="field-label">Описание</label><textarea id="proj-desc">'+esc(p.desc||'')+'</textarea></div>';
  html+='<div class="field"><label class="field-label">Эмодзи</label><input type="text" id="proj-emoji" value="'+esc(p.emoji||'📁')+'" maxlength="4"/></div>';
  html+='<div class="field"><label class="field-label">Сфера</label><select id="proj-sphere"><option value="">—</option>';
  (window.LIFE_SPHERES||[]).forEach(function(s){
    html+='<option value="'+s.id+'"'+(p.sphereId===s.id?' selected':'')+'>'+s.emoji+' '+s.name+'</option>';
  });
  html+='</select></div>';
  html+='</div>';
  html+='<button class="btn btn-primary btn-block" onclick="saveProject('+(id?'\''+id+'\'':'null')+')">'+(isNew?'➕ Создать':'💾 Сохранить')+'</button>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.openProjectEditor=openProjectEditor;
window.renderProjectEditor=function(){openProjectEditor(currentProjectId)};

function saveProject(id){
  var title=(document.getElementById('proj-title')||{}).value||'';
  if(!title.trim())return toast('Введи название','error');
  var p=id?state.projects.find(function(x){return x.id===id}):null;
  var isNew=!p;
  if(!p){p={id:uid(),tasks:[],status:'planning',progress:0,createdAt:nowISO()};state.projects.push(p)}
  p.title=title.trim();
  p.desc=(document.getElementById('proj-desc')||{}).value||'';
  p.emoji=(document.getElementById('proj-emoji')||{}).value||'📁';
  p.sphereId=(document.getElementById('proj-sphere')||{}).value||null;
  p.updatedAt=nowISO();
  save();haptic('success');toast(isNew?'✓ Создан':'💾 Сохранено','success');
  currentProjectId=p.id;
  navigate('projectDetail');
}
window.saveProject=saveProject;

/* ============ AI-КОУЧ ============ */
function renderCoach(){
  var coach=state.coach||{};
  var style=getCoachStyle(coach.style||'balanced');
  var scores=state.spheres.lastScores||{};
  var balance=getSpheresBalance(scores);
  var tip=getRandomCoachTip(balance.weakest?balance.weakest.id:'health');
  var html='<div class="page">';
  html+='<div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">💬 AI-Коуч</div>';
  html+='<button class="btn btn-ghost btn-sm" onclick="navigate(\'coachSettings\')">⚙️</button></div>';

  html+='<div class="card card-gradient">';
  html+='<div style="display:flex;align-items:center;gap:12px;">';
  html+='<div style="font-size:44px;">'+style.emoji+'</div>';
  html+='<div style="flex:1;"><div style="font-size:18px;font-weight:800;">'+style.name+'</div>';
  html+='<div style="font-size:12px;opacity:.9;">'+style.desc+'</div></div></div>';
  html+='<div style="font-size:12px;opacity:.9;margin-top:10px;">Строгость: '+(coach.strictness||5)+'/10</div>';
  html+='</div>';

  if(tip){
    html+='<div class="card"><h2>💡 Совет дня</h2>';
    html+='<div style="display:flex;gap:12px;"><div style="font-size:32px;">'+tip.emoji+'</div>';
    html+='<div style="flex:1;font-size:14px;line-height:1.5;">'+esc(tip.text)+'</div></div>';
    html+='</div>';
  }

  /* Стили примеров */
  html+='<div class="card"><h2>🎭 Стили</h2>';
  (window.COACH_STYLES||[]).forEach(function(s){
    var active=(coach.style||'balanced')===s.id;
    html+='<div class="list-row" onclick="setCoachStyle(\''+s.id+'\')" style="'+(active?'border-left:3px solid var(--brand);':'')+'">';
    html+='<div class="list-icon">'+s.emoji+'</div>';
    html+='<div class="list-body"><div class="list-title">'+s.name+'</div>';
    html+='<div class="list-subtitle">'+esc(s.desc)+'</div></div>';
    if(active)html+='<div class="badge badge-success">✓</div>';
    html+='</div>';
  });
  html+='</div>';

  /* Примеры ответов */
  html+='<div class="card"><h2>📝 Примеры ответов</h2>';
  style.examples.forEach(function(e){
    html+='<div style="padding:8px 0;border-bottom:1px solid var(--divider);font-size:13px;font-style:italic;color:var(--text-2);">"'+esc(e)+'"</div>';
  });
  html+='</div>';

  html+='<button class="btn btn-primary btn-block" onclick="navigate(\'coachSettings\')">⚙️ Настроить коуча</button>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderCoach=renderCoach;

function setCoachStyle(id){
  if(!state.coach)state.coach={};
  state.coach.style=id;
  save();haptic('success');toast('✓ '+(getCoachStyle(id)||{}).name,'success');
  renderCoach();
}
window.setCoachStyle=setCoachStyle;

function renderCoachSettings(){
  var coach=state.coach||{};
  var html='<div class="page"><div class="title-xl">⚙️ Настройки коуча</div>';

  html+='<div class="card"><h2>🎭 Стиль общения</h2>';
  (window.COACH_STYLES||[]).forEach(function(s){
    var active=(coach.style||'balanced')===s.id;
    html+='<button class="btn '+(active?'btn-primary':'btn-ghost')+' btn-block mb-2" onclick="setCoachStyle(\''+s.id+'\');renderCoachSettings()">'+s.emoji+' '+s.name+'</button>';
  });
  html+='</div>';

  html+='<div class="card"><h2>🎚 Строгость: '+(coach.strictness||5)+'/10</h2>';
  html+='<input type="range" min="1" max="10" value="'+(coach.strictness||5)+'" style="width:100%;" oninput="document.getElementById(\'strictness-val\').textContent=this.value+\'/10\';document.getElementById(\'strictness-desc\').textContent=(window.STRICTNESS_LEVELS||{})[this.value]||\'\';" id="strictness-range"/>';
  html+='<div style="text-align:center;font-size:40px;font-weight:800;color:var(--brand);" id="strictness-val">'+(coach.strictness||5)+'/10</div>';
  html+='<div class="footnote text-secondary mb-3" style="text-align:center;" id="strictness-desc">'+(window.STRICTNESS_LEVELS||{})[coach.strictness||5]+'</div>';
  html+='<button class="btn btn-primary btn-block" onclick="saveStrictness()">💾 Сохранить строгость</button>';
  html+='</div>';

  var settings=coach.settings||{};
  html+='<div class="card"><h2>🔔 Уведомления коуча</h2>';
  ['morningGreeting','eveningSummary','dailyTips','weeklyReport','monthlyReport','motivationalQuotes','personalizedAdvice'].forEach(function(k){
    var lbl={morningGreeting:'🌅 Утреннее приветствие',eveningSummary:'🌆 Вечерний обзор',dailyTips:'💡 Советы дня',weeklyReport:'📈 Отчёт недели',monthlyReport:'📊 Отчёт месяца',motivationalQuotes:'🔥 Мотивация',personalizedAdvice:'🎯 Персональные советы'}[k];
    html+='<div class="row-between mb-2"><div class="list-title">'+lbl+'</div>';
    html+='<button class="btn '+(settings[k]?'btn-primary':'btn-ghost')+' btn-sm" onclick="toggleCoachSetting(\''+k+'\')">'+(settings[k]?'Вкл':'Выкл')+'</button></div>';
  });
  html+='</div>';

  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderCoachSettings=renderCoachSettings;

function saveStrictness(){
  var r=document.getElementById('strictness-range');if(!r)return;
  if(!state.coach)state.coach={};
  state.coach.strictness=parseInt(r.value);
  save();toast('✓ Сохранено','success');
}
window.saveStrictness=saveStrictness;

function toggleCoachSetting(key){
  if(!state.coach)state.coach={};
  if(!state.coach.settings)state.coach.settings={};
  state.coach.settings[key]=!state.coach.settings[key];
  save();renderCoachSettings();
}
window.toggleCoachSetting=toggleCoachSetting;

/* ============ РАСПИСАНИЕ ============ */
function renderSchedule(){
  var times=(state.schedule&&state.schedule.times)||DEFAULT_DAY_SCHEDULE;
  var phase=getCurrentPhase();
  var html='<div class="page"><div class="title-xl">📅 Расписание дня</div>';

  html+='<div class="card card-gradient" style="background:linear-gradient(135deg,'+phase.color+','+phase.color+'cc);">';
  html+='<div style="display:flex;align-items:center;gap:12px;">';
  html+='<div style="font-size:40px;">'+phase.emoji+'</div>';
  html+='<div style="flex:1;"><div style="font-size:18px;font-weight:800;">'+phase.name+'</div>';
  html+='<div style="font-size:12px;opacity:.9;">'+phase.desc+'</div></div>';
  html+='<div class="badge" style="background:rgba(0,0,0,.2);color:#fff;">'+getNowHHMM()+'</div>';
  html+='</div></div>';

  html+='<div class="card"><h2>🕐 Время обычного дня</h2>';
  html+='<div class="footnote text-secondary mb-3">На это расписание подстраивается всё приложение</div>';
  var slots=[
    {key:'wake',     emoji:'🌅', label:'Подъём'},
    {key:'breakfast',emoji:'🍳', label:'Завтрак'},
    {key:'workStart',emoji:'💼', label:'Работа начало'},
    {key:'lunch',    emoji:'🍽', label:'Обед'},
    {key:'workEnd',  emoji:'🏁', label:'Работа конец'},
    {key:'dinner',   emoji:'🍲', label:'Ужин'},
    {key:'relax',    emoji:'🌆', label:'Отдых'},
    {key:'windDown', emoji:'🌙', label:'Подготовка ко сну'},
    {key:'sleep',    emoji:'😴', label:'Сон'}
  ];
  html+='<div class="schedule-grid">';
  slots.forEach(function(slot){
    var time=times[slot.key]||DEFAULT_DAY_SCHEDULE[slot.key];
    var isNow=isTimeNear(time,60);
    html+='<div class="schedule-slot'+(isNow?' active':'')+'">';
    html+='<div class="schedule-icon">'+slot.emoji+'</div>';
    html+='<div class="schedule-body"><div class="schedule-label">'+slot.label+'</div></div>';
    html+='<input type="time" class="schedule-time-input" value="'+time+'" onchange="updateScheduleTime(\''+slot.key+'\',this.value)"/>';
    html+='</div>';
  });
  html+='</div></div>';

  html+='<button class="btn btn-primary btn-block mb-3" onclick="navigate(\'scheduleEditor\')">➕ Добавить событие</button>';

  /* Свои события на сегодня */
  var todayEvents=(state.schedule&&state.schedule.customEvents||[]).filter(function(e){return e.date===today()});
  if(todayEvents.length){
    html+='<div class="card"><h2>📌 Мои события сегодня</h2>';
    todayEvents.forEach(function(e){
      html+='<div class="list-row" onclick="toggleScheduleEvent(\''+e.id+'\')">';
      html+='<div class="list-icon">'+(e.done?'✓':'○')+'</div>';
      html+='<div class="list-body"><div class="list-title" style="'+(e.done?'text-decoration:line-through;opacity:.5;':'')+'">'+esc(e.title)+'</div>';
      html+='<div class="list-subtitle">'+esc(e.time||'')+(e.sphereId?' · '+(getSphere(e.sphereId)||{}).name:'')+'</div></div>';
      html+='</div>';
    });
    html+='</div>';
  }

  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderSchedule=renderSchedule;

function isTimeNear(timeStr, minutes){
  if(!timeStr)return false;
  var p=timeStr.split(':');if(p.length<2)return false;
  var t=parseInt(p[0])*60+parseInt(p[1]);
  var n=new Date();var now=n.getHours()*60+n.getMinutes();
  return Math.abs(t-now)<=minutes;
}

function updateScheduleTime(key,value){
  if(!state.schedule)state.schedule={times:{},customEvents:[]};
  if(!state.schedule.times)state.schedule.times={};
  state.schedule.times[key]=value;
  save();toast('✓ '+value,'success');
  renderSchedule();
}
window.updateScheduleTime=updateScheduleTime;

function toggleScheduleEvent(id){
  var e=(state.schedule&&state.schedule.customEvents||[]).find(function(x){return x.id===id});
  if(!e)return;
  e.done=!e.done;
  save();haptic('success');renderSchedule();
}
window.toggleScheduleEvent=toggleScheduleEvent;

function renderScheduleEditor(){
  var html='<div class="page"><div class="title-xl">➕ Новое событие</div>';
  html+='<div class="card">';
  html+='<div class="field"><label class="field-label">Название *</label><input type="text" id="ev-title"/></div>';
  html+='<div class="row" style="gap:8px;">';
  html+='<div style="flex:1;"><label class="field-label">Дата</label><input type="date" id="ev-date" value="'+today()+'"/></div>';
  html+='<div style="flex:1;"><label class="field-label">Время</label><input type="time" id="ev-time" value="12:00"/></div>';
  html+='</div>';
  html+='<div class="field"><label class="field-label">Сфера</label><select id="ev-sphere"><option value="">—</option>';
  (window.LIFE_SPHERES||[]).forEach(function(s){
    html+='<option value="'+s.id+'">'+s.emoji+' '+s.name+'</option>';
  });
  html+='</select></div>';
  html+='</div>';
  html+='<button class="btn btn-primary btn-block" onclick="saveScheduleEvent()">💾 Создать</button>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderScheduleEditor=renderScheduleEditor;

function saveScheduleEvent(){
  var title=(document.getElementById('ev-title')||{}).value||'';
  if(!title.trim())return toast('Введи название','error');
  if(!state.schedule)state.schedule={times:{},customEvents:[]};
  if(!state.schedule.customEvents)state.schedule.customEvents=[];
  state.schedule.customEvents.push({
    id:uid(),title:title.trim(),
    date:(document.getElementById('ev-date')||{}).value||today(),
    time:(document.getElementById('ev-time')||{}).value||'12:00',
    sphereId:(document.getElementById('ev-sphere')||{}).value||null,
    done:false,createdAt:nowISO()
  });
  save();haptic('success');toast('✓ Создано','success');
  navigate('schedule');
}
window.saveScheduleEvent=saveScheduleEvent;

/* ============ ФОКУС ============ */
function renderFocus(){
  var active=state.focus&&state.focus.active;
  var html='<div class="page"><div class="title-xl">🎯 Фокус</div>';

  if(active){
    var elapsed=Math.floor((Date.now()-new Date(active.startedAt).getTime())/1000);
    var m=Math.floor(elapsed/60), s=elapsed%60;
    html+='<div class="card card-gradient" style="text-align:center;padding:40px 16px;">';
    html+='<div style="font-size:72px;font-weight:800;font-variant-numeric:tabular-nums;" id="focusTimer">'+pad(m)+':'+pad(s)+'</div>';
    html+='<div style="font-size:14px;opacity:.9;margin-top:10px;">'+esc(active.taskTitle||'Фокус-сессия')+'</div>';
    html+='</div>';
    html+='<button class="btn btn-success btn-block mb-2" onclick="finishFocusSession()">✓ Завершить</button>';
    html+='<button class="btn btn-ghost btn-block" onclick="cancelFocusSession()">✕ Отменить</button>';
    setTimeout(startFocusTimerTick,100);
  }else{
    html+='<div class="card"><h2>Начать сессию</h2>';
    html+='<div class="field"><label class="field-label">Задача</label><input type="text" id="focus-task" placeholder="Над чем работаешь?"/></div>';
    html+='<div class="row" style="gap:6px;margin-top:14px;">';
    html+='<button class="btn btn-primary" style="flex:1;" onclick="startFocusSession(25,\'Pomodoro\')">25 мин</button>';
    html+='<button class="btn btn-ghost" style="flex:1;" onclick="startFocusSession(50,\'Focus\')">50 мин</button>';
    html+='<button class="btn btn-ghost" style="flex:1;" onclick="startFocusSession(90,\'Deep Work\')">90 мин</button>';
    html+='</div></div>';

    var hist=(state.focus&&state.focus.history)||[];
    if(hist.length){
      html+='<div class="card"><h2>📊 История</h2>';
      hist.slice(-10).reverse().forEach(function(h){
        html+='<div class="stat-row"><span class="stat-row-label">'+esc(h.taskTitle||'Сессия')+'</span><span class="stat-row-value">'+h.duration+' мин</span></div>';
      });
      html+='</div>';
    }
  }
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderFocus=renderFocus;

function startFocusSession(minutes,type){
  if(!state.focus)state.focus={active:null,history:[]};
  var taskTitle=(document.getElementById('focus-task')||{}).value||type;
  state.focus.active={
    startedAt:nowISO(),
    duration:minutes,
    taskTitle:taskTitle,
    type:type
  };
  save();haptic('success');toast('▶ '+taskTitle+' — '+minutes+' мин','success');
  navigate('focus');
}
window.startFocusSession=startFocusSession;

function startFocusTimerTick(){
  if(focusTimerInterval)clearInterval(focusTimerInterval);
  focusTimerInterval=setInterval(function(){
    var el=document.getElementById('focusTimer');
    if(!el){clearInterval(focusTimerInterval);focusTimerInterval=null;return}
    var active=state.focus&&state.focus.active;
    if(!active){clearInterval(focusTimerInterval);focusTimerInterval=null;return}
    var elapsed=Math.floor((Date.now()-new Date(active.startedAt).getTime())/1000);
    var m=Math.floor(elapsed/60), s=elapsed%60;
    el.textContent=pad(m)+':'+pad(s);
  },1000);
}

function finishFocusSession(){
  var active=state.focus&&state.focus.active;
  if(!active)return;
  var elapsed=Math.floor((Date.now()-new Date(active.startedAt).getTime())/60000);
  state.focus.history.push({
    date:today(),
    duration:elapsed,
    taskTitle:active.taskTitle,
    type:active.type
  });
  state.focus.active=null;
  state.xp=(state.xp||0)+Math.min(elapsed,90);
  save();haptic('success');toast('✓ Сессия: '+elapsed+' мин','success');
  if(focusTimerInterval){clearInterval(focusTimerInterval);focusTimerInterval=null}
  navigate('dashboard');
}
window.finishFocusSession=finishFocusSession;

function cancelFocusSession(){
  if(!confirm('Отменить сессию?'))return;
  if(state.focus)state.focus.active=null;
  save();
  if(focusTimerInterval){clearInterval(focusTimerInterval);focusTimerInterval=null}
  navigate('focus');
}
window.cancelFocusSession=cancelFocusSession;

/* ============ ВЕЧЕРНИЙ ОБЗОР ============ */
function renderEveningReview(){
  var todayReview=(state.eveningReview&&state.eveningReview.history||[]).find(function(r){return r.date===today()});
  var html='<div class="page"><div class="title-xl">🌙 Вечерний обзор</div>';

  if(todayReview){
    html+='<div class="card card-gradient"><div style="font-size:14px;opacity:.9;">Обзор за '+today()+'</div>';
    html+='<div style="font-size:24px;font-weight:800;margin-top:6px;">✓ Выполнен</div></div>';
    if(todayReview.wins&&todayReview.wins.length){
      html+='<div class="card"><h2>✅ Победы</h2>';
      todayReview.wins.forEach(function(w){html+='<div style="padding:6px 0;">'+esc(w)+'</div>'});
      html+='</div>';
    }
    if(todayReview.lesson)html+='<div class="card"><h2>📚 Урок</h2><div>'+esc(todayReview.lesson)+'</div></div>';
    if(todayReview.tomorrow&&todayReview.tomorrow.length){
      html+='<div class="card"><h2>🎯 План на завтра</h2>';
      todayReview.tomorrow.forEach(function(t){html+='<div style="padding:6px 0;">• '+esc(t)+'</div>'});
      html+='</div>';
    }
    if(todayReview.gratitude)html+='<div class="card"><h2>🙏 Благодарность</h2><div>'+esc(todayReview.gratitude)+'</div></div>';
    html+='<button class="btn btn-ghost btn-block" onclick="resetEveningReview()">↻ Заполнить заново</button>';
  }else{
    html+='<div class="card"><div class="footnote text-secondary mb-3">Ответь на 7 вопросов — и день закроется правильно.</div>';
    html+='<div class="field"><label class="field-label">1. 3 победы дня</label><textarea id="er-wins" placeholder="Что получилось?"></textarea></div>';
    html+='<div class="field"><label class="field-label">2. 1 урок дня</label><textarea id="er-lesson" placeholder="Что понял?"></textarea></div>';
    html+='<div class="field"><label class="field-label">3. Что не получилось?</label><textarea id="er-fail" placeholder="Честно"></textarea></div>';
    html+='<div class="field"><label class="field-label">4. Почему?</label><textarea id="er-why" placeholder="Корень проблемы"></textarea></div>';
    html+='<div class="field"><label class="field-label">5. Что улучшу завтра?</label><textarea id="er-improve"></textarea></div>';
    html+='<div class="field"><label class="field-label">6. 3 задачи на завтра</label><textarea id="er-tomorrow" placeholder="Через запятую"></textarea></div>';
    html+='<div class="field"><label class="field-label">7. За что благодарен?</label><textarea id="er-gratitude"></textarea></div>';
    html+='<button class="btn btn-primary btn-block mt-3" onclick="saveEveningReview()">💾 Сохранить обзор</button>';
    html+='</div>';
  }
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderEveningReview=renderEveningReview;

function saveEveningReview(){
  if(!state.eveningReview)state.eveningReview={history:[]};
  var wins=((document.getElementById('er-wins')||{}).value||'').split('\n').filter(Boolean);
  var review={
    date:today(),
    wins:wins,
    lesson:(document.getElementById('er-lesson')||{}).value||'',
    fail:(document.getElementById('er-fail')||{}).value||'',
    why:(document.getElementById('er-why')||{}).value||'',
    improve:(document.getElementById('er-improve')||{}).value||'',
    tomorrow:((document.getElementById('er-tomorrow')||{}).value||'').split(',').map(function(s){return s.trim()}).filter(Boolean),
    gratitude:(document.getElementById('er-gratitude')||{}).value||''
  };
  state.eveningReview.history.push(review);
  state.xp=(state.xp||0)+20;
  save();haptic('success');toast('✓ Обзор сохранён','success');
  renderEveningReview();
}
window.saveEveningReview=saveEveningReview;

function resetEveningReview(){
  if(!confirm('Заполнить заново?'))return;
  if(state.eveningReview)state.eveningReview.history=state.eveningReview.history.filter(function(r){return r.date!==today()});
  save();renderEveningReview();
}
window.resetEveningReview=resetEveningReview;

/* ============ ИТОГИ НЕДЕЛИ / МЕСЯЦА ============ */
function renderWeeklyReview(){
  var html='<div class="page"><div class="title-xl">📈 Итоги недели</div>';
  var days=7;
  var stats={tasks:0,habits:0,sleep:0,brain:0,focus:0,spheres:0};
  var now=new Date();
  for(var i=0;i<days;i++){
    var d=new Date(now);d.setDate(now.getDate()-i);
    var iso=d.toISOString().slice(0,10);
    stats.tasks+=(state.tasks||[]).filter(function(t){return t.completedAt&&t.completedAt.slice(0,10)===iso}).length;
    Object.keys(state.habitHistory||{}).forEach(function(hid){
      if(state.habitHistory[hid][iso]&&state.habitHistory[hid][iso].completed)stats.habits++;
    });
    stats.brain+=(state.brainPlays||[]).filter(function(p){return p.date===iso}).length;
    stats.focus+=(state.focus&&state.focus.history||[]).filter(function(f){return f.date===iso}).length;
  }
  html+='<div class="stat-grid mb-4">';
  html+='<div class="stat-item"><div class="stat-value">'+stats.tasks+'</div><div class="stat-label">Задач</div></div>';
  html+='<div class="stat-item"><div class="stat-value">'+stats.habits+'</div><div class="stat-label">Привычек</div></div>';
  html+='<div class="stat-item"><div class="stat-value">'+stats.brain+'</div><div class="stat-label">Игр ума</div></div>';
  html+='</div>';
  html+='<div class="stat-grid mb-4">';
  html+='<div class="stat-item"><div class="stat-value">'+stats.focus+'</div><div class="stat-label">Фокус-сессий</div></div>';
  html+='<div class="stat-item"><div class="stat-value">'+(state.stats.streak||0)+'</div><div class="stat-label">Streak</div></div>';
  html+='<div class="stat-item"><div class="stat-value">'+(state.xp||0)+'</div><div class="stat-label">XP</div></div>';
  html+='</div>';
  html+='<button class="btn btn-primary btn-block" onclick="navigate(\'dailyReport\')">📊 Отчёт дня</button>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderWeeklyReview=renderWeeklyReview;

function renderMonthlyReview(){
  var html='<div class="page"><div class="title-xl">📆 Итоги месяца</div>';
  var days=30;
  var stats={tasks:0,habits:0,sleep:0,brain:0};
  var now=new Date();
  for(var i=0;i<days;i++){
    var d=new Date(now);d.setDate(now.getDate()-i);
    var iso=d.toISOString().slice(0,10);
    stats.tasks+=(state.tasks||[]).filter(function(t){return t.completedAt&&t.completedAt.slice(0,10)===iso}).length;
    Object.keys(state.habitHistory||{}).forEach(function(hid){
      if(state.habitHistory[hid][iso]&&state.habitHistory[hid][iso].completed)stats.habits++;
    });
    stats.brain+=(state.brainPlays||[]).filter(function(p){return p.date===iso}).length;
    if((state.sleepEntries||[]).some(function(s){return s.date===iso}))stats.sleep++;
  }
  html+='<div class="stat-grid mb-4">';
  html+='<div class="stat-item"><div class="stat-value">'+stats.tasks+'</div><div class="stat-label">Задач</div></div>';
  html+='<div class="stat-item"><div class="stat-value">'+stats.habits+'</div><div class="stat-label">Привычек</div></div>';
  html+='<div class="stat-item"><div class="stat-value">'+stats.brain+'</div><div class="stat-label">Игр ума</div></div>';
  html+='</div>';
  html+='<div class="stat-grid mb-4">';
  html+='<div class="stat-item"><div class="stat-value">'+stats.sleep+'</div><div class="stat-label">Ночей сна</div></div>';
  html+='<div class="stat-item"><div class="stat-value">'+(state.stats.bestStreak||0)+'</div><div class="stat-label">Лучший streak</div></div>';
  html+='<div class="stat-item"><div class="stat-value">'+(state.xp||0)+'</div><div class="stat-label">XP</div></div>';
  html+='</div>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderMonthlyReview=renderMonthlyReview;

/* ============ ДОСТИЖЕНИЯ ============ */
function renderAchievements(){
  var achs=window.ACHIEVEMENTS_333||[];
  var unlocked=(state.profile&&state.profile.achievements)||[];
  var cats={};
  achs.forEach(function(a){
    var cat=a.category||'other';
    if(!cats[cat])cats[cat]={total:0,unlocked:0,list:[]};
    cats[cat].total++;
    cats[cat].list.push(a);
    if(unlocked.indexOf(a.id)>=0)cats[cat].unlocked++;
  });
  var html='<div class="page"><div class="title-xl">🏆 Достижения</div>';
  html+='<div class="card card-gradient"><div style="font-size:14px;opacity:.9;">Открыто</div>';
  html+='<div style="font-size:40px;font-weight:800;">'+unlocked.length+' / '+achs.length+'</div>';
  html+='<div style="font-size:12px;opacity:.9;margin-top:6px;">'+Math.round(unlocked.length/achs.length*100)+'%</div>';
  html+='</div>';

  var catNames={
    tasks:'✅ Задачи',habits:'🔄 Привычки',streak:'🔥 Серии',xp:'⭐ XP',
    learning:'🎓 Обучение',health:'❤️ Здоровье',detox:'📱 Детокс',
    finance:'💰 Финансы',relations:'👥 Отношения',meaning:'🧭 Смысл',
    spheres:'🎯 Сферы',special:'🌟 Особые'
  };
  Object.keys(cats).forEach(function(cat){
    var c=cats[cat];
    html+='<div class="card"><div class="row-between mb-3"><h2 style="margin:0;">'+(catNames[cat]||cat)+'</h2>';
    html+='<div class="badge badge-brand">'+c.unlocked+'/'+c.total+'</div></div>';
    html+='<div class="achieve-grid">';
    c.list.slice(0,30).forEach(function(a){
      var isUnlocked=unlocked.indexOf(a.id)>=0;
      var prog=isUnlocked?1:(a.progress?a.progress(state):0);
      html+='<div class="achieve-item '+(isUnlocked?'unlocked':'locked')+'">';
      html+='<div class="achieve-icon">'+a.emoji+'</div>';
      html+='<div class="achieve-name">'+esc(a.name)+'</div>';
      html+='<div class="achieve-progress"><div class="achieve-progress-fill" style="width:'+(prog*100)+'%"></div></div>';
      html+='</div>';
    });
    html+='</div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderAchievements=renderAchievements;
window.renderAchievementsCategory=renderAchievements;

/* ============ ЗАДАЧИ ============ */
function getEisenhowerQuadrant(t){
  var important=t.priority==='high'||t.priority==='medium'||(t.difficulty||0)>=4;
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
  var cl=t.checklist||[];
  var clDone=cl.filter(function(c){return c.done}).length;
  return '<div class="task-item '+(checked?'completed':'')+'" style="'+(color?'border-left:3px solid '+color+';':'')+'" onclick="openEntityEditor(\'task\',\''+t.id+'\')">'+
    '<div class="priority-bar '+(pColors[t.priority]||'medium')+'"></div>'+
    '<button class="task-checkbox '+(checked?'checked':'')+'" onclick="event.stopPropagation();toggleTask(\''+t.id+'\')">'+(checked?'✓':'')+'</button>'+
    '<div class="task-content"><div class="task-title">'+qEmoji+' '+esc(t.title)+'</div>'+
    '<div class="task-meta"><span>'+(t.planned_time||0)+' мин</span>'+
    (t.category?'<span>· '+esc(t.category)+'</span>':'')+
    (t.due_date?'<span>· 📅 '+t.due_date.slice(0,10)+'</span>':'')+
    (cl.length?'<span>· ☑ '+clDone+'/'+cl.length+'</span>':'')+
    (overdue?'<span style="color:var(--danger);">· ⚠️</span>':'')+
    '</div></div></div>';
}

function renderTasks(){
  var counts={all:state.tasks.length,pending:state.tasks.filter(function(t){return t.status==='pending'}).length,completed:state.tasks.filter(function(t){return t.status==='completed'}).length};
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
  if(t.status==='completed'){t.completedAt=nowISO();state.stats.totalTasksDone=(state.stats.totalTasksDone||0)+1;state.xp=(state.xp||0)+5}
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
  var html='<div class="page"><div class="title-xl">🔢 Матрица</div>';
  html+='<div class="matrix-grid-2x2">';
  html+='<div class="matrix-quadrant matrix-q1"><div class="matrix-q-title">🔥 Q1</div><div class="matrix-q-count">'+q1.length+'</div><div class="matrix-q-sub">Делай</div></div>';
  html+='<div class="matrix-quadrant matrix-q2"><div class="matrix-q-title">📌 Q2</div><div class="matrix-q-count">'+q2.length+'</div><div class="matrix-q-sub">Планируй</div></div>';
  html+='<div class="matrix-quadrant matrix-q3"><div class="matrix-q-title">⚡ Q3</div><div class="matrix-q-count">'+q3.length+'</div><div class="matrix-q-sub">Делегируй</div></div>';
  html+='<div class="matrix-quadrant matrix-q4"><div class="matrix-q-title">🗑 Q4</div><div class="matrix-q-count">'+q4.length+'</div><div class="matrix-q-sub">Удали</div></div>';
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
window.renderMatrix=renderMatrix;

/* ============ РЕДАКТОР ЗАДАЧ ============ */
var _clBuffer=[];
function openEntityEditor(type,id){
  if(type==='task')return openTaskEditorV2(id);
}
window.openEntityEditor=openEntityEditor;

function openTaskEditorV2(id){
  var t=id?state.tasks.find(function(x){return x.id===id}):null;
  var isNew=!t;
  if(isNew)t={checklist:[],priority:'medium',planned_time:30,color:'peacock',difficulty:3};
  _clBuffer=JSON.parse(JSON.stringify(t.checklist||[]));
  var html='';
  html+='<div class="field"><label class="field-label">Название *</label><input type="text" id="ent-title" value="'+esc(t.title||'')+'"/></div>';
  html+='<div class="field"><label class="field-label">Описание</label><textarea id="ent-desc">'+esc(t.description||'')+'</textarea></div>';
  html+='<div class="field"><label class="field-label">Сфера</label><select id="ent-sphere"><option value="">—</option>';
  (window.LIFE_SPHERES||[]).forEach(function(s){
    html+='<option value="'+s.id+'"'+(t.sphereId===s.id?' selected':'')+'>'+s.emoji+' '+s.name+'</option>';
  });
  html+='</select></div>';
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
  html+='</select></div></div>';
  html+='<div class="row" style="gap:8px;">';
  html+='<div style="flex:1;"><label class="field-label">Категория</label><input type="text" id="ent-category" value="'+esc(t.category||'Работа')+'"/></div>';
  html+='<div style="flex:1;"><label class="field-label">Мин</label><input type="number" id="ent-time" value="'+(t.planned_time||30)+'" min="0"/></div></div>';
  html+='<div class="row" style="gap:8px;">';
  html+='<div style="flex:1;"><label class="field-label">Старт</label><input type="datetime-local" id="ent-start" value="'+(t.start_date?t.start_date.slice(0,16):'')+'"/></div>';
  html+='<div style="flex:1;"><label class="field-label">Дедлайн</label><input type="datetime-local" id="ent-due" value="'+(t.due_date?t.due_date.slice(0,16):'')+'"/></div></div>';
  html+='<div class="field"><label class="field-label">Чек-лист</label><div id="cl-list"></div>';
  html+='<button type="button" class="btn btn-ghost btn-sm mt-2" onclick="addChecklistItem()">+ Подзадача</button></div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="saveTaskV2('+(id?'\''+id+'\'':'null')+')">'+(isNew?'➕ Создать':'💾 Сохранить')+'</button>';
  if(!isNew)html+='<button class="btn btn-danger btn-block mt-2" onclick="deleteTaskV2(\''+id+'\')">🗑 Удалить</button>';
  openSheet(isNew?'Новая задача':'Задача',html);
  rerenderChecklist();
}
window.openTaskEditorV2=openTaskEditorV2;

function rerenderChecklist(){
  var box=document.getElementById('cl-list');if(!box)return;
  var html='';
  _clBuffer.forEach(function(item,i){
    html+='<div style="display:flex;gap:6px;margin-bottom:6px;align-items:center;">';
    html+='<button type="button" class="task-checkbox '+(item.done?'checked':'')+'" onclick="toggleChecklistItem('+i+')" style="width:24px;height:24px;font-size:12px;flex-shrink:0;">'+(item.done?'✓':'')+'</button>';
    html+='<input type="text" value="'+esc(item.title)+'" onchange="updateChecklistItem('+i+',this.value)" style="flex:1;"/>';
    html+='<button type="button" class="btn btn-ghost btn-xs" onclick="removeChecklistItem('+i+')">🗑</button>';
    html+='</div>';
  });
  box.innerHTML=html;
}
window.rerenderChecklist=rerenderChecklist;
function addChecklistItem(){_clBuffer.push({title:'',done:false});rerenderChecklist()}
function removeChecklistItem(i){_clBuffer.splice(i,1);rerenderChecklist()}
function toggleChecklistItem(i){if(!_clBuffer[i])return;_clBuffer[i].done=!_clBuffer[i].done;rerenderChecklist()}
function updateChecklistItem(i,v){if(!_clBuffer[i])return;_clBuffer[i].title=v}
window.addChecklistItem=addChecklistItem;
window.removeChecklistItem=removeChecklistItem;
window.toggleChecklistItem=toggleChecklistItem;
window.updateChecklistItem=updateChecklistItem;

function saveTaskV2(id){
  var title=(document.getElementById('ent-title')||{}).value||'';
  if(!title.trim())return toast('Введите название','error');
  var t=id?state.tasks.find(function(x){return x.id===id}):null;
  var isNew=!t;
  if(!t){t={id:uid(),created_at:nowISO()};state.tasks.unshift(t)}
  t.title=title.trim();
  t.description=(document.getElementById('ent-desc')||{}).value||'';
  t.sphereId=(document.getElementById('ent-sphere')||{}).value||null;
  t.priority=(document.getElementById('ent-priority')||{}).value||'medium';
  t.difficulty=parseInt((document.getElementById('ent-difficulty')||{}).value)||3;
  t.category=(document.getElementById('ent-category')||{}).value||'';
  t.planned_time=parseInt((document.getElementById('ent-time')||{}).value)||30;
  t.start_date=(document.getElementById('ent-start')||{}).value||null;
  t.due_date=(document.getElementById('ent-due')||{}).value||null;
  t.checklist=_clBuffer.slice();
  t.updated_at=nowISO();
  save();haptic('success');closeSheet();
  toast(isNew?'✓ Создано':'💾 Сохранено','success');
  checkAchievements();navigate(currentPage);
}
window.saveTaskV2=saveTaskV2;
function deleteTaskV2(id){if(!confirm('Удалить?'))return;state.tasks=state.tasks.filter(function(x){return x.id!==id});save();closeSheet();navigate(currentPage)}
window.deleteTaskV2=deleteTaskV2;

/* ============ ОБУЧЕНИЕ (просмотр) ============ */
function getLevelProgress(levelId){
  var level=(window.LEARNING_LEVELS||[]).find(function(l){return l.id===levelId});
  if(!level)return{done:0,total:0,pct:0};
  var total=0,done=0;
  level.modules.forEach(function(mod){mod.lessons.forEach(function(l,idx){total++;if(state.levelProgress[levelId+'_'+mod.id+'_'+idx])done++})});
  return{done:done,total:total,pct:total>0?Math.round(done/total*100):0};
}
function renderLearning(){
  var totalDone=0,totalLessons=0;
  (window.LEARNING_LEVELS||[]).forEach(function(level){var p=getLevelProgress(level.id);totalDone+=p.done;totalLessons+=p.total});
  var overallPct=totalLessons?Math.round(totalDone/totalLessons*100):0;
  var skillsDone=Object.keys(state.skillsProgress||{}).length;
  var engDone=Object.keys(state.englishProgress||{}).length;
  var html='<div class="page"><div class="title-xl">🎓 Обучение</div>';
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:12px;">Прогресс</div><div style="font-size:40px;font-weight:800;">'+overallPct+'%</div></div>';
  html+='<div class="compact-grid">';
  html+='<div class="compact-item" onclick="navigate(\'levels\')"><span class="compact-icon">🌱</span><span>Уровни</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'english\')"><span class="compact-icon">🇬🇧</span><span>English '+engDone+'/'+((window.ENGLISH_125||[]).length)+'</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'skills\')"><span class="compact-icon">💎</span><span>Навыки '+skillsDone+'/'+((window.SKILLS_LIBRARY||[]).length)+'</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'psychology\')"><span class="compact-icon">🧠</span><span>Психология</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'thinking\')"><span class="compact-icon">💡</span><span>Мышление</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'games\')"><span class="compact-icon">🎮</span><span>Игры</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'materials\')"><span class="compact-icon">📚</span><span>Материалы</span></div>';
  html+='</div>';
  html+='<h2 style="margin:20px 0 12px;font-size:18px;">🚀 Курсы</h2>';
  html+='<div class="compact-grid">';
  (window.ALL_NEW_COURSES||[]).forEach(function(c){
    html+='<div class="compact-item" onclick="navigate(\''+c.id+'\')"><span class="compact-icon">'+c.emoji+'</span><span>'+c.title+'</span></div>';
  });
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
window.renderLearning=renderLearning;

function renderLevels(){
  var html='<div class="page"><div class="title-xl">🌱 Уровни</div>';
  (window.LEARNING_LEVELS||[]).forEach(function(level){
    var p=getLevelProgress(level.id);
    html+='<div class="method-card" onclick="openLevel(\''+level.id+'\')"><div class="method-header"><div class="method-emoji">'+level.emoji+'</div><div style="flex:1;"><div class="method-title">'+level.title+'</div><div class="method-cat">'+p.done+'/'+p.total+' · '+p.pct+'%</div></div></div><div class="progress" style="margin-top:8px;"><div class="progress-fill" style="width:'+p.pct+'%;"></div></div></div>';
  });
  html+='</div>';document.getElementById('app').innerHTML=html;
}
window.renderLevels=renderLevels;
function openLevel(id){currentLevelId=id;navigate('levelDetail')}
function renderLevelDetail(){
  var level=(window.LEARNING_LEVELS||[]).find(function(l){return l.id===currentLevelId});
  if(!level){navigate('levels');return}
  var html='<div class="page"><div style="text-align:center;margin-bottom:20px;"><div style="font-size:56px;">'+level.emoji+'</div><div class="title-xl">'+level.title+'</div></div>';
  level.modules.forEach(function(mod){
    html+='<div class="card"><h2>'+mod.emoji+' '+mod.title+'</h2>';
    mod.lessons.forEach(function(l,i){
      var key=level.id+'_'+mod.id+'_'+i;
      var isDone=!!state.levelProgress[key];
      html+='<div class="lesson-row '+(isDone?'done':'')+'" onclick="openLesson(\''+level.id+'\',\''+mod.id+'\','+i+')"><div class="lesson-num">'+(isDone?'✓':(i+1))+'</div><div class="lesson-title">'+esc(l.title)+'</div></div>';
    });
    html+='</div>';
  });
  html+='</div>';document.getElementById('app').innerHTML=html;
}
window.renderLevelDetail=renderLevelDetail;
function openLesson(lid,mid,idx){
  var level=(window.LEARNING_LEVELS||[]).find(function(l){return l.id===lid});if(!level)return;
  var mod=level.modules.find(function(m){return m.id===mid});if(!mod)return;
  var lesson=mod.lessons[idx];if(!lesson)return;
  var key=lid+'_'+mid+'_'+idx;
  var isDone=!!state.levelProgress[key];
  var html='<div style="font-size:20px;font-weight:800;margin-bottom:12px;">'+esc(lesson.title)+'</div>';
  if(lesson.theory)html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚 Теория</div><div class="lesson-content">'+formatLesson(lesson.theory)+'</div></div></div>';
  if(lesson.practice)html+='<div class="card"><div class="lesson-section practice"><div class="lesson-section-title">🎯 Практика</div><div class="lesson-content">'+esc(lesson.practice)+'</div></div></div>';
  if(!isDone)html+='<button class="btn btn-primary btn-block mt-3" onclick="completeLesson(\''+lid+'\',\''+mid+'\','+idx+')">✓ Изучено</button>';
  openSheet(lesson.title,html);
}
window.openLesson=openLesson;
function completeLesson(lid,mid,idx){
  var key=lid+'_'+mid+'_'+idx;
  state.levelProgress[key]=true;
  state.xp=(state.xp||0)+25;
  save();haptic('success');toast('✓ +25 XP','success');
  closeSheet();navigate('levelDetail');
}
window.completeLesson=completeLesson;
function formatLesson(text){
  if(!text)return '';
  var h=esc(text);
  h=h.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
  h=h.replace(/\n/g,'<br>');
  return h;
}
window.formatLesson=formatLesson;

function renderSkills(){
  var lib=window.SKILLS_LIBRARY||[];
  var html='<div class="page"><div class="title-xl">💎 Навыки</div>';
  html+='<div class="card card-gradient"><div style="font-size:40px;font-weight:800;">'+lib.length+'</div></div>';
  lib.forEach(function(s){
    var isDone=state.skillsProgress[s.id];
    html+='<div class="method-card" onclick="openSkill(\''+s.id+'\')"><div class="method-header"><div class="method-emoji">'+s.emoji+'</div><div style="flex:1;"><div class="method-title">'+esc(s.title)+'</div><div class="method-cat">'+esc(s.desc||'')+'</div></div>'+(isDone?'<span class="badge badge-success">✓</span>':'›')+'</div></div>';
  });
  html+='</div>';document.getElementById('app').innerHTML=html;
}
window.renderSkills=renderSkills;
function openSkill(id){
  var s=(window.SKILLS_LIBRARY||[]).find(function(x){return x.id===id});if(!s)return;
  var isDone=state.skillsProgress[id];
  var html='<div style="font-size:20px;font-weight:800;margin-bottom:12px;">'+esc(s.title)+'</div>';
  if(s.theory)html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚</div><div class="lesson-content">'+formatLesson(s.theory)+'</div></div></div>';
  if(!isDone)html+='<button class="btn btn-primary btn-block mt-3" onclick="completeSkill(\''+id+'\')">✓ Изучено</button>';
  openSheet(s.title,html);
}
window.openSkill=openSkill;
function completeSkill(id){state.skillsProgress[id]=true;state.xp=(state.xp||0)+20;save();toast('✓ +20 XP','success');closeSheet();renderSkills()}
window.completeSkill=completeSkill;

function renderEnglish(){
  var all=window.ENGLISH_125||[];
  var done=Object.keys(state.englishProgress||{}).length;
  var html='<div class="page"><div class="title-xl">🇬🇧 English</div>';
  html+='<div class="card card-gradient"><div style="font-size:40px;font-weight:800;">'+done+'/'+all.length+'</div></div>';
  ['A1','A2','B1','B2','C1'].forEach(function(lvl){
    var lessons=all.filter(function(l){return l.level===lvl});
    var d=lessons.filter(function(l){return state.englishProgress[l.id]}).length;
    var pct=lessons.length?Math.round(d/lessons.length*100):0;
    html+='<div class="card"><h2>'+lvl+' ('+d+'/'+lessons.length+')</h2><div class="progress mb-2"><div class="progress-fill" style="width:'+pct+'%;"></div></div>';
    lessons.forEach(function(l){
      var isDone=state.englishProgress[l.id];
      html+='<div class="lesson-row '+(isDone?'done':'')+'" onclick="openEnglishLesson(\''+l.id+'\')"><div class="lesson-num">'+(isDone?'✓':'○')+'</div><div class="lesson-title">'+esc(l.title)+'</div></div>';
    });
    html+='</div>';
  });
  html+='</div>';document.getElementById('app').innerHTML=html;
}
window.renderEnglish=renderEnglish;
function openEnglishLesson(id){
  var l=(window.ENGLISH_125||[]).find(function(x){return x.id===id});if(!l)return;
  var isDone=state.englishProgress[id];
  var html='<div style="font-size:20px;font-weight:800;margin-bottom:12px;">'+esc(l.title)+'</div>';
  if(l.theory)html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚</div><div class="lesson-content">'+formatLesson(l.theory)+'</div></div></div>';
  if(!isDone)html+='<button class="btn btn-primary btn-block mt-3" onclick="completeEnglish(\''+id+'\')">✓ Изучено</button>';
  openSheet(l.title,html);
}
window.openEnglishLesson=openEnglishLesson;
function completeEnglish(id){state.englishProgress[id]=true;state.xp=(state.xp||0)+15;save();toast('✓ +15 XP','success');closeSheet();renderEnglish()}
window.completeEnglish=completeEnglish;

/* ============ УМ, АНТИСТРЕСС, СОН (из content2) ============ */
function getBrainGameById(id){return (window.BRAIN_TRAINING||[]).find(function(g){return g.id===id})||null}
window.getBrainGameById=getBrainGameById;
function recordBrainPlay(gameId,score,duration,accuracy){
  if(!state.brainPlays)state.brainPlays=[];
  state.brainPlays.push({id:uid(),gameId:gameId,date:today(),score:score||0,duration:duration||0,accuracy:accuracy||null,timestamp:nowISO()});
  if(!state.brainStats)state.brainStats={};
  if(!state.brainStats[gameId])state.brainStats[gameId]={plays:0,best:0,total:0,avg:0,lastPlayed:null};
  var s=state.brainStats[gameId];
  s.plays++;s.total+=score||0;s.avg=Math.round(s.total/s.plays);
  if((score||0)>s.best)s.best=score||0;
  s.lastPlayed=nowISO();
  var t=today();
  if(state.brainLastDay!==t){
    if(state.brainLastDay===yesterday())state.brainStreak=(state.brainStreak||0)+1;
    else state.brainStreak=1;
    state.brainLastDay=t;
  }
  state.xp=(state.xp||0)+10;
  save();
}
window.recordBrainPlay=recordBrainPlay;
function renderBrain(){
  var cats=window.BRAIN_CATEGORIES||[];
  var games=window.BRAIN_TRAINING||[];
  var totalPlays=(state.brainPlays||[]).length;
  var todayPlays=(state.brainPlays||[]).filter(function(p){return p.date===today()}).length;
  var html='<div class="page">';
  html+='<div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">🧠 Тренировка ума</div>';
  html+='<button class="btn btn-ghost btn-sm" onclick="navigate(\'brainStats\')">📊</button></div>';
  html+='<div class="card card-gradient"><div style="font-size:12px;opacity:.9;">Сегодня</div><div style="font-size:40px;font-weight:800;">'+todayPlays+'</div><div style="font-size:12px;opacity:.9;margin-top:6px;">Всего: '+totalPlays+' · Streak: '+(state.brainStreak||0)+'</div></div>';
  html+='<div class="quick-tabs"><button class="quick-tab '+(brainCatFilter==='all'?'active':'')+'" onclick="brainCatFilter=\'all\';renderBrain()">Все ('+games.length+')</button>';
  cats.forEach(function(c){
    var cnt=games.filter(function(g){return g.cat===c.id}).length;
    html+='<button class="quick-tab '+(brainCatFilter===c.id?'active':'')+'" onclick="brainCatFilter=\''+c.id+'\';renderBrain()">'+c.emoji+' '+c.name+' ('+cnt+')</button>';
  });
  html+='</div>';
  var filtered=brainCatFilter==='all'?games:games.filter(function(g){return g.cat===brainCatFilter});
  filtered.slice(0,60).forEach(function(g){
    var stat=state.brainStats&&state.brainStats[g.id];
    var cat=cats.find(function(c){return c.id===g.cat});
    var catColor=cat?cat.color:'#5b9eff';
    html+='<div class="method-card" style="border-left:3px solid '+catColor+';" onclick="startBrainGame(\''+g.id+'\')"><div class="method-header"><div class="method-emoji">'+g.emoji+'</div><div style="flex:1;min-width:0;"><div class="method-title">'+esc(g.title)+'</div><div class="method-cat">'+esc(g.desc||'')+'</div></div><div class="list-chevron">▶</div></div>';
    if(stat)html+='<div class="footnote text-tertiary" style="margin-top:6px;">Лучший: '+stat.best+' · Игр: '+stat.plays+'</div>';
    html+='</div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderBrain=renderBrain;
function renderBrainStats(){
  var plays=state.brainPlays||[];
  var html='<div class="page"><div class="title-xl">📊 Статистика ума</div>';
  html+='<div class="stat-grid mb-4"><div class="stat-item"><div class="stat-value">'+plays.length+'</div><div class="stat-label">Всего</div></div><div class="stat-item"><div class="stat-value">'+(state.brainStreak||0)+'</div><div class="stat-label">Streak</div></div><div class="stat-item"><div class="stat-value">'+Object.keys(state.brainStats||{}).length+'</div><div class="stat-label">Игр</div></div></div>';
  if(plays.length){
    html+='<div class="card"><h2>Последние</h2>';
    plays.slice(-10).reverse().forEach(function(p){
      var g=getBrainGameById(p.gameId);
      html+='<div class="stat-row"><span class="stat-row-label">'+(g?g.emoji+' '+g.title:'Игра')+'</span><span class="stat-row-value">'+p.score+'</span></div>';
    });
    html+='</div>';
  }
  html+='</div>';document.getElementById('app').innerHTML=html;
}
window.renderBrainStats=renderBrainStats;
function renderBrainGame(){renderBrain()}
window.renderBrainGame=renderBrainGame;
function startBrainGame(id){
  var g=getBrainGameById(id);if(!g)return;
  currentBrainGameId=id;
  var html='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:56px;">'+g.emoji+'</div><div style="font-size:22px;font-weight:800;">'+esc(g.title)+'</div></div>';
  html+='<div class="card"><div class="field"><label class="field-label">Очки (0-100)</label><input type="number" id="bg-score" value="50" min="0" max="100"/></div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="finishBrainGame()">✓ Записать</button></div>';
  openSheet(g.title,html);
}
window.startBrainGame=startBrainGame;
function finishBrainGame(){
  if(!currentBrainGameId)return;
  var score=parseInt((document.getElementById('bg-score')||{}).value)||0;
  var g=getBrainGameById(currentBrainGameId);
  recordBrainPlay(currentBrainGameId,score,g?g.duration:60,null);
  haptic('success');toast('✓ +10 XP','success');
  closeSheet();currentBrainGameId=null;renderBrain();
}
window.finishBrainGame=finishBrainGame;

function getAntistressById(id){return (window.ANTISTRESS_PRACTICES||[]).find(function(p){return p.id===id})||null}
window.getAntistressById=getAntistressById;
function recordAntistress(practiceId){
  if(!state.antistressEntries)state.antistressEntries=[];
  state.antistressEntries.push({id:uid(),practiceId:practiceId,date:today(),time:nowISO()});
  state.xp=(state.xp||0)+5;
  save();
}
window.recordAntistress=recordAntistress;
function renderAntistress(){
  var cats=window.ANTISTRESS_CATEGORIES||[];
  var practices=window.ANTISTRESS_PRACTICES||[];
  var todayCount=(state.antistressEntries||[]).filter(function(e){return e.date===today()}).length;
  var html='<div class="page">';
  html+='<div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">🌬 Антистресс</div>';
  html+='<div class="badge badge-brand">'+todayCount+'</div></div>';
  html+='<div class="card"><h2>⚡ Быстро</h2><div class="group-grid">';
  html+='<div class="group-item" onclick="startAntistress(\'as_breath_sigh\')"><div class="group-item-icon">😮‍💨</div><div class="group-item-label">Вздох</div></div>';
  html+='<div class="group-item" onclick="startAntistress(\'as_breath_478\')"><div class="group-item-icon">🌬</div><div class="group-item-label">4-7-8</div></div>';
  html+='<div class="group-item" onclick="startAntistress(\'as_breath_box\')"><div class="group-item-icon">📦</div><div class="group-item-label">Box</div></div>';
  html+='<div class="group-item" onclick="startAntistress(\'as_ground_54321\')"><div class="group-item-icon">🌳</div><div class="group-item-label">5-4-3-2-1</div></div>';
  html+='<div class="group-item" onclick="startAntistress(\'as_cold_face\')"><div class="group-item-icon">🧊</div><div class="group-item-label">Холод</div></div>';
  html+='<div class="group-item" onclick="startAntistress(\'as_cold_ice\')"><div class="group-item-icon">❄️</div><div class="group-item-label">Лёд</div></div>';
  html+='</div></div>';
  html+='<div class="quick-tabs"><button class="quick-tab '+(asCatFilter==='all'?'active':'')+'" onclick="asCatFilter=\'all\';renderAntistress()">Все ('+practices.length+')</button>';
  cats.forEach(function(c){
    var cnt=practices.filter(function(p){return p.cat===c.id}).length;
    html+='<button class="quick-tab '+(asCatFilter===c.id?'active':'')+'" onclick="asCatFilter=\''+c.id+'\';renderAntistress()">'+c.emoji+' '+c.name+' ('+cnt+')</button>';
  });
  html+='</div>';
  var filtered=asCatFilter==='all'?practices:practices.filter(function(p){return p.cat===asCatFilter});
  filtered.forEach(function(p){
    var cat=cats.find(function(c){return c.id===p.cat});
    var catColor=cat?cat.color:'#5b9eff';
    html+='<div class="method-card" style="border-left:3px solid '+catColor+';" onclick="startAntistress(\''+p.id+'\')"><div class="method-header"><div class="method-emoji">'+p.emoji+'</div><div style="flex:1;"><div class="method-title">'+esc(p.title)+'</div><div class="method-cat">'+esc(p.desc||'')+' · '+Math.round(p.duration/60)+' мин</div></div><div class="list-chevron">▶</div></div></div>';
  });
  html+='</div>';document.getElementById('app').innerHTML=html;
}
window.renderAntistress=renderAntistress;
function startAntistress(id){
  var p=getAntistressById(id);if(!p)return;
  currentAntistressId=id;
  var html='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:56px;">'+p.emoji+'</div><div style="font-size:22px;font-weight:800;">'+esc(p.title)+'</div></div>';
  if(p.steps&&p.steps.length){
    html+='<div class="card"><h2>📋 Шаги</h2><div class="lesson-content"><ul>';
    p.steps.forEach(function(s){html+='<li>'+esc(s)+'</li>'});
    html+='</ul></div></div>';
  }
  if(p.science)html+='<div class="insight-card"><div class="insight-title">🔬 Наука</div><div class="insight-text">'+esc(p.science)+'</div></div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="finishAntistress()">✓ Выполнено</button>';
  openSheet(p.title,html);
}
window.startAntistress=startAntistress;
function finishAntistress(){
  if(!currentAntistressId)return;
  recordAntistress(currentAntistressId);
  haptic('success');toast('✓ +5 XP','success');
  closeSheet();currentAntistressId=null;renderAntistress();
}
window.finishAntistress=finishAntistress;
function renderAntistressDetail(){renderAntistress()}
window.renderAntistressDetail=renderAntistressDetail;

function _sleepDateKey(d){return d.toISOString().slice(0,10)}
function calcSleepHours(startHHMM,endHHMM){
  if(!startHHMM||!endHHMM)return 0;
  var sp=startHHMM.split(':'), ep=endHHMM.split(':');
  var s=parseInt(sp[0])*60+parseInt(sp[1]||0);
  var e=parseInt(ep[0])*60+parseInt(ep[1]||0);
  if(e<=s)e+=24*60;
  return Math.round((e-s)/60*10)/10;
}
window.calcSleepHours=calcSleepHours;
function getSleepEntryForDate(date){if(!date)date=today();return (state.sleepEntries||[]).find(function(s){return s.date===date})}
window.getSleepEntryForDate=getSleepEntryForDate;
function renderSleep(){
  var lastEntry=(state.sleepEntries||[]).slice(-1)[0];
  var html='<div class="page">';
  html+='<div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">😴 Сон</div>';
  html+='<button class="btn btn-ghost btn-sm" onclick="navigate(\'sleepCalendar\')">📅</button></div>';
  html+='<div class="card card-gradient">';
  if(lastEntry){html+='<div style="font-size:12px;opacity:.9;">Последняя ночь</div><div style="font-size:40px;font-weight:800;">'+lastEntry.hours+' ч</div><div style="font-size:12px;opacity:.9;margin-top:6px;">'+lastEntry.date+' · качество '+lastEntry.quality+'/10</div>'}
  else{html+='<div style="font-size:16px;font-weight:800;">Добавь первую запись</div>'}
  html+='</div>';
  html+='<button class="btn btn-primary btn-block mb-3" onclick="currentSleepDate=today();navigate(\'sleepEditor\')">➕ Записать сон</button>';
  html+='</div>';document.getElementById('app').innerHTML=html;
}
window.renderSleep=renderSleep;
function renderSleepCalendar(){
  var y=SLEEP_CAL_CURSOR.getFullYear(), m=SLEEP_CAL_CURSOR.getMonth();
  var first=new Date(y,m,1), offset=first.getDay()===0?6:first.getDay()-1;
  var daysInMonth=new Date(y,m+1,0).getDate();
  var todayISO=today();
  var html='<div class="page"><div class="title-xl">📅 Календарь сна</div>';
  html+='<div class="cal-toolbar">';
  html+='<button class="cal-nav-btn" onclick="SLEEP_CAL_CURSOR=new Date('+y+','+(m-1)+',1);renderSleepCalendar()">‹</button>';
  html+='<button class="cal-today-btn" onclick="SLEEP_CAL_CURSOR=new Date();renderSleepCalendar()">Сегодня</button>';
  html+='<button class="cal-nav-btn" onclick="SLEEP_CAL_CURSOR=new Date('+y+','+(m+1)+',1);renderSleepCalendar()">›</button>';
  html+='<div class="cal-title">'+['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'][m]+' '+y+'</div>';
  html+='</div>';
  html+='<div class="cal-month"><div class="cal-month-head">';
  ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].forEach(function(d){html+='<div class="cal-month-head-cell">'+d+'</div>'});
  html+='</div><div class="cal-month-grid">';
  for(var i=offset-1;i>=0;i--)html+='<div class="cal-month-cell" style="opacity:.35;"></div>';
  for(var d=1;d<=daysInMonth;d++){
    var iso=y+'-'+pad(m+1)+'-'+pad(d);
    var e=getSleepEntryForDate(iso);
    var color='rgba(255,255,255,.08)', num='';
    if(e){
      if(e.hours>=7&&e.hours<=9)color='rgba(61,220,151,.35)';
      else if(e.hours>=6)color='rgba(255,169,64,.35)';
      else color='rgba(255,107,107,.35)';
      num='<div style="font-size:11px;font-weight:700;text-align:center;">'+e.hours+'</div>';
    }
    html+='<div class="cal-month-cell'+(iso===todayISO?' cal-today':'')+'" style="background:'+color+';" onclick="openSleepForDate(\''+iso+'\')"><div class="cal-day-num">'+d+'</div>'+num+'</div>';
  }
  html+='</div></div></div>';
  document.getElementById('app').innerHTML=html;
}
window.renderSleepCalendar=renderSleepCalendar;
function openSleepForDate(iso){currentSleepDate=iso;navigate('sleepEditor')}
window.openSleepForDate=openSleepForDate;
function renderSleepEditor(){
  var date=currentSleepDate||today();
  var e=getSleepEntryForDate(date);
  var isNew=!e;
  if(isNew)e={date:date,type:'night',start:'23:00',end:'07:00',hours:8,quality:7,notes:'',awakenings:0,disruptions:[],improvements:[]};
  var html='<div class="page"><div class="title-xl">'+(isNew?'Запись сна':'Сон: '+date)+'</div>';
  html+='<div class="card">';
  html+='<div class="field"><label class="field-label">Дата</label><input type="date" id="sl-date" value="'+date+'"/></div>';
  html+='<div class="row" style="gap:8px;">';
  html+='<div style="flex:1;"><label class="field-label">Лёг</label><input type="time" id="sl-start" value="'+e.start+'"/></div>';
  html+='<div style="flex:1;"><label class="field-label">Встал</label><input type="time" id="sl-end" value="'+e.end+'"/></div></div>';
  html+='</div>';
  html+='<div class="card"><h2>✨ Качество</h2>';
  html+='<div style="text-align:center;padding:6px 0;"><div id="sl-q-display" style="font-size:44px;font-weight:800;color:var(--brand);">'+e.quality+'/10</div></div>';
  html+='<input type="range" min="1" max="10" value="'+e.quality+'" style="width:100%;margin:10px 0;" oninput="document.getElementById(\'sl-q-display\').textContent=this.value+\'/10\';document.getElementById(\'sl-quality-value\').value=this.value;"/>';
  html+='<input type="hidden" id="sl-quality-value" value="'+e.quality+'"/>';
  html+='</div>';
  html+='<div class="card"><h2>📝 Заметка</h2><textarea id="sl-notes" style="min-height:80px;">'+esc(e.notes||'')+'</textarea></div>';
  html+='<button class="btn btn-primary btn-block mb-2" onclick="saveSleepEntry()">💾 '+(isNew?'Сохранить':'Обновить')+'</button>';
  if(!isNew)html+='<button class="btn btn-danger btn-block" onclick="deleteSleepEntry(\''+date+'\')">🗑 Удалить</button>';
  html+='</div>';document.getElementById('app').innerHTML=html;
}
window.renderSleepEditor=renderSleepEditor;
function saveSleepEntry(){
  var date=(document.getElementById('sl-date')||{}).value||today();
  var start=(document.getElementById('sl-start')||{}).value||'23:00';
  var end=(document.getElementById('sl-end')||{}).value||'07:00';
  var hours=calcSleepHours(start,end);
  var quality=parseInt((document.getElementById('sl-quality-value')||{}).value)||7;
  var notes=(document.getElementById('sl-notes')||{}).value||'';
  var entry={id:getSleepEntryForDate(date)?getSleepEntryForDate(date).id:uid(),date:date,type:'night',start:start,end:end,hours:hours,quality:quality,notes:notes,disruptions:[],improvements:[],createdAt:nowISO()};
  var idx=state.sleepEntries.findIndex(function(s){return s.date===date});
  if(idx>=0)state.sleepEntries[idx]=entry;else state.sleepEntries.push(entry);
  state.xp=(state.xp||0)+5;
  save();haptic('success');toast('✓ '+hours+' ч','success');
  currentSleepDate=null;navigate('sleep');
}
window.saveSleepEntry=saveSleepEntry;
function deleteSleepEntry(date){
  if(!confirm('Удалить?'))return;
  state.sleepEntries=state.sleepEntries.filter(function(s){return s.date!==date});
  save();toast('Удалено','info');currentSleepDate=null;navigate('sleep');
}
window.deleteSleepEntry=deleteSleepEntry;

/* ============ КАЛЕНДАРЬ ============ */
function renderCalendar(){navigate('gcal')}
window.renderCalendar=renderCalendar;

var CAL_COLORS=[];
function renderGcal(){
  var html='<div class="page"><div class="title-xl">📅 Календарь</div>';
  html+='<div class="card"><div class="footnote text-secondary">Календарь объединён с расписанием дня.</div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="navigate(\'schedule\')">Открыть расписание</button></div>';
  html+='</div>';document.getElementById('app').innerHTML=html;
}
window.renderGcal=renderGcal;

/* ============ AI (быстрый чат) ============ */
function renderAI(){
  var personas=window.PERSONAS||{};
  var active=state.settings.activePersona||'coach';
  var messages=state.chats.filter(function(c){return c.persona===active});
  var html='<div class="page"><div class="title-xl">✨ AI</div>';
  html+='<div class="quick-tabs">';
  Object.keys(personas).forEach(function(k){
    html+='<button class="quick-tab '+(active===k?'active':'')+'" onclick="switchPersona(\''+k+'\')">'+personas[k].emoji+' '+personas[k].name+'</button>';
  });
  html+='</div>';
  html+='<div class="card" style="min-height:340px;max-height:58vh;overflow-y:auto;" id="chatBox"><div class="chat">';
  if(messages.length){messages.forEach(function(m){html+='<div class="msg msg-'+(m.role==='user'?'user':'bot')+'">'+(m.role==='user'?esc(m.text):esc(m.text))+'</div>'})}
  else{html+='<div class="empty"><div class="empty-icon">✨</div><div class="empty-title">AI-помощник</div></div>'}
  html+='</div></div>';
  html+='<div class="row" style="margin-top:10px;"><input type="text" id="chatInput" placeholder="Сообщение..." style="flex:1;" onkeydown="if(event.key===\'Enter\'){event.preventDefault();sendMsg();}"/><button class="btn btn-primary btn-icon" onclick="sendMsg()">➤</button></div></div>';
  document.getElementById('app').innerHTML=html;
  var box=document.getElementById('chatBox');if(box)box.scrollTop=box.scrollHeight;
}
window.renderAI=renderAI;
function switchPersona(p){state.settings.activePersona=p;save();renderAI()}
window.switchPersona=switchPersona;
async function sendMsg(){
  var input=document.getElementById('chatInput');if(!input)return;
  var text=input.value.trim();if(!text)return;
  input.value='';
  var persona=state.settings.activePersona||'coach';
  state.chats.push({id:uid(),persona:persona,role:'user',text:text,timestamp:nowISO()});
  save();renderAI();
  var reply=fallbackReply(persona,text);
  state.chats.push({id:uid(),persona:persona,role:'coach',text:reply,timestamp:nowISO()});
  save();renderAI();
}
window.sendMsg=sendMsg;
function fallbackReply(persona,text){
  text=text||'';
  if(/суицид|покончить|не хочу жить/i.test(text))return '🆘 8-800-2000-122 · 103 · findahelpline.com';
  return 'Слышу тебя. Расскажи подробнее.';
}
window.fallbackReply=fallbackReply;

/* ============ ДОСТИЖЕНИЯ: проверка ============ */
function checkAchievements(){
  var achs=window.ACHIEVEMENTS_333||[];
  if(!achs.length)return;
  var unlocked=(state.profile&&state.profile.achievements)||[];
  var newOnes=[];
  for(var i=0;i<achs.length;i++){
    var a=achs[i];
    if(!a.check)continue;
    try{
      if(unlocked.indexOf(a.id)<0&&a.check(state)){unlocked.push(a.id);newOnes.push(a)}
    }catch(e){}
  }
  if(!state.profile)state.profile={achievements:[]};
  state.profile.achievements=unlocked;
  if(newOnes.length){
    save();
    newOnes.forEach(function(a,idx){
      setTimeout(function(){toast('🏆 '+a.name,'success',3500);haptic('success')},idx*800);
    });
  }
}
window.checkAchievements=checkAchievements;

/* ============ HEALTH / WATER / MOOD ============ */
function getWaterGoal(){
  var p=state.profileV2||{};
  if(p.weight)return Math.round(p.weight*30/250);
  return state.settings.waterGoal||8;
}
window.getWaterGoal=getWaterGoal;
function addWater(){
  var t=today();
  if(!state.customWater)state.customWater=[];
  var e=state.customWater.find(function(w){return w.date===t});
  if(e)e.count++;else state.customWater.push({id:uid(),date:t,count:1,created_at:nowISO()});
  state.stats.totalWater=(state.stats.totalWater||0)+1;
  save();toast('💧 +1','success');haptic('success');
  if(currentPage==='dashboard')renderDashboard();else if(currentPage==='water')renderWater();
}
window.addWater=addWater;
function quickMoodLog(){
  var moods=['😢','😔','😐','🙂','😊'];
  var html='<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;">';
  moods.forEach(function(m,i){html+='<button class="btn btn-ghost" style="font-size:32px;padding:20px 0;" onclick="saveMood('+((i+1)*2)+')">'+m+'</button>'});
  html+='</div>';
  openSheet('Настроение?',html);
}
window.quickMoodLog=quickMoodLog;
function saveMood(score){
  var t=today();
  if(!state.customMood)state.customMood=[];
  var e=state.customMood.find(function(m){return m.date===t});
  if(e)e.score=score;else state.customMood.push({id:uid(),date:t,score:score,created_at:nowISO()});
  save();closeSheet();toast('✓','success');
  if(currentPage==='dashboard')renderDashboard();else if(currentPage==='mood')renderMood();
}
window.saveMood=saveMood;
function renderWater(){
  var e=state.customWater.find(function(w){return w.date===today()});
  var count=e?e.count:0;var goal=getWaterGoal();
  var html='<div class="page"><div class="title-xl">💧 Вода</div>';
  html+='<div class="card card-gradient" style="text-align:center;"><div style="font-size:56px;">💧</div><div style="font-size:40px;font-weight:800;">'+count+'/'+goal+'</div></div>';
  html+='<button class="btn btn-primary btn-block" onclick="addWater()">+1 стакан</button></div>';
  document.getElementById('app').innerHTML=html;
}
window.renderWater=renderWater;
function renderMood(){
  var m=state.customMood||[];
  var html='<div class="page"><div class="title-xl">💭 Настроение</div>';
  html+='<button class="btn btn-primary btn-block mb-4" onclick="quickMoodLog()">Записать</button>';
  if(m.length){m.slice(-10).reverse().forEach(function(e){html+='<div class="list-row"><div class="list-icon">'+(e.score>=7?'😊':e.score>=5?'🙂':'😔')+'</div><div class="list-body"><div class="list-title">'+e.date+'</div><div class="list-subtitle">'+e.score+'/10</div></div></div>'})}
  else html+='<div class="empty"><div class="empty-icon">💭</div><div class="empty-title">Пусто</div></div>';
  html+='</div>';document.getElementById('app').innerHTML=html;
}
window.renderMood=renderMood;
function renderHealth(){
  var waterEntry=state.customWater.find(function(w){return w.date===today()});
  var water=waterEntry?waterEntry.count:0;var waterGoal=getWaterGoal();
  var html='<div class="page"><div class="title-xl">❤️ Здоровье</div>';
  html+='<div class="card"><div class="stat-grid"><div class="stat-item" onclick="quickMoodLog()" style="cursor:pointer;"><div class="stat-value">💭</div><div class="stat-label">Настроение</div></div><div class="stat-item" onclick="addWater()" style="cursor:pointer;"><div class="stat-value">'+water+'/'+waterGoal+'</div><div class="stat-label">Вода</div></div><div class="stat-item" onclick="navigate(\'sleep\')" style="cursor:pointer;"><div class="stat-value">😴</div><div class="stat-label">Сон</div></div></div></div>';
  html+='</div>';document.getElementById('app').innerHTML=html;
}
window.renderHealth=renderHealth;
function renderWorkouts(){renderStub('🏋️ Тренировки')}
function renderMeditation(){renderStub('🧘 Медитации')}
function renderMeds(){renderStub('💊 Лекарства')}
window.renderWorkouts=renderWorkouts;
window.renderMeditation=renderMeditation;
window.renderMeds=renderMeds;

/* ============ SCREEN TRACKER ============ */
function screenGetToday(){return (state.screenStats||{})[today()]||0}
function screenGetWeek(){var t=0,now=new Date();for(var i=0;i<7;i++){var d=new Date(now);d.setDate(now.getDate()-i);t+=(state.screenStats||{})[d.toISOString().slice(0,10)]||0}return t}
function fmtMinsHM(m){var h=Math.floor(m/60),mm=m%60;if(h===0)return mm+' мин';if(mm===0)return h+' ч';return h+' ч '+mm+' мин'}
window.screenGetToday=screenGetToday;
window.fmtMinsHM=fmtMinsHM;
function renderScreenTracker(){
  var today_=screenGetToday();
  var html='<div class="page"><div class="title-xl">📱 Экран</div>';
  html+='<div class="card card-gradient"><div style="font-size:12px;opacity:.9;">Сегодня</div><div style="font-size:40px;font-weight:800;">'+fmtMinsHM(today_)+'</div><div style="font-size:12px;opacity:.9;margin-top:6px;">Неделя: '+fmtMinsHM(screenGetWeek())+'</div></div>';
  html+='<button class="btn btn-primary btn-block mb-3" onclick="openScreenAdd()">➕ Добавить</button>';
  html+='</div>';document.getElementById('app').innerHTML=html;
}
window.renderScreenTracker=renderScreenTracker;
function openScreenAdd(){
  var html='<div class="field"><label class="field-label">Дата</label><input type="date" id="scr-date" value="'+today()+'"/></div>';
  html+='<div class="field"><label class="field-label">Время (мин или "2ч 30м")</label><input type="text" id="scr-mins"/></div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="saveScreenEntry()">💾</button>';
  openSheet('Экран',html);
}
window.openScreenAdd=openScreenAdd;
function parseScreenTime(str){
  if(!str)return 0;str=String(str).toLowerCase().trim();
  var total=0;var h=str.match(/(\d+)\s*ч/), m=str.match(/(\d+)\s*м/);
  if(h)total+=parseInt(h[1])*60;if(m)total+=parseInt(m[1]);
  if(!h&&!m){var n=parseInt(str);if(!isNaN(n))total=n<=24?n*60:n}
  return total;
}
window.parseScreenTime=parseScreenTime;
function saveScreenEntry(){
  var date=(document.getElementById('scr-date')||{}).value||today();
  var raw=(document.getElementById('scr-mins')||{}).value||'';
  var mins=parseScreenTime(raw);
  if(mins<=0)return toast('Введи время','error');
  if(!state.screenStats)state.screenStats={};
  state.screenStats[date]=(state.screenStats[date]||0)+mins;
  save();closeSheet();toast('✓','success');renderScreenTracker();
}
window.saveScreenEntry=saveScreenEntry;

/* ============ ЗРЕНИЕ (просмотр) ============ */
function renderVision(){
  var ex=window.VISION_EXERCISES||[];
  var html='<div class="page"><div class="title-xl">👁 Зрение</div>';
  html+='<div class="card"><h2>⚡ Быстрые</h2>';
  ex.slice(0,4).forEach(function(e){
    html+='<div class="list-row" onclick="startEyeExercise(\''+e.id+'\')"><div class="list-icon">'+e.emoji+'</div><div class="list-body"><div class="list-title">'+esc(e.title)+'</div><div class="list-subtitle">'+e.duration+'</div></div></div>';
  });
  html+='</div></div>';document.getElementById('app').innerHTML=html;
}
window.renderVision=renderVision;
function renderVisionExercises(){renderStub('🤸 Упражнения')}
function renderVisionTracker(){renderStub('📊 Трекер')}
function renderVisionTips(){renderStub('💡 Советы')}
function renderVision60(){renderStub('👁 75 упражнений')}
window.renderVisionExercises=renderVisionExercises;
window.renderVisionTracker=renderVisionTracker;
window.renderVisionTips=renderVisionTips;
window.renderVision60=renderVision60;
function startEyeExercise(id){
  var ex=(window.VISION_EXERCISES||[]).find(function(x){return x.id===id});if(!ex)return;
  currentVisionExercise=ex;
  var html='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:56px;">'+ex.emoji+'</div><div style="font-size:22px;font-weight:800;">'+esc(ex.title)+'</div></div>';
  html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📋 Описание</div><div class="lesson-content">'+esc(ex.desc)+'</div></div></div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="completeEyeExercise()">✓ Выполнено</button>';
  openSheet(ex.title,html);
}
window.startEyeExercise=startEyeExercise;
function completeEyeExercise(){
  if(!currentVisionExercise)return;
  state.eyeExercises.push({id:uid(),exerciseId:currentVisionExercise.id,date:today(),time:nowISO()});
  state.xp=(state.xp||0)+10;
  save();haptic('success');toast('✓ +10 XP','success');
  checkAchievements();closeSheet();currentVisionExercise=null;navigate(currentPage);
}
window.completeEyeExercise=completeEyeExercise;

/* ============ УВЕДОМЛЕНИЯ (планировщик) ============ */
var _notifLastFired={};
function startNotificationScheduler(){
  setInterval(function(){try{checkScheduledNotifications()}catch(e){}},60000);
  console.log('[NOTIF] Планировщик запущен');
}
window.startNotificationScheduler=startNotificationScheduler;
function checkScheduledNotifications(){
  var n=state.notifications||{};
  if(!n.enabled)return;
  var now=new Date();
  var t=today();
  var rules=[
    {id:'morning',time:'07:00',title:'Утренний чек'},
    {id:'day',time:'13:00',title:'Обед'},
    {id:'evening',time:'21:00',title:'Вечерний обзор'},
    {id:'night',time:'22:30',title:'Скоро спать'}
  ];
  rules.forEach(function(r){
    var key=r.id+'_'+r.time+'_'+t;
    if(_notifLastFired[key])return;
    var s=n.settings||{};
    if(!s[r.id])return;
    var rp=r.time.split(':');
    var rm=parseInt(rp[0])*60+parseInt(rp[1]);
    var nowm=now.getHours()*60+now.getMinutes();
    if(Math.abs(nowm-rm)<=2){
      try{if(n.permission==='granted'&&typeof Notification!=='undefined')new Notification('Life OS',{body:r.title})}catch(e){}
      toast('🔔 '+r.title,'info',4000);
      _notifLastFired[key]=true;
    }
  });
}
function renderNotifications(){
  var n=state.notifications||{};
  var s=n.settings||{};
  var html='<div class="page"><div class="title-xl">🔔 Уведомления</div>';
  html+='<div class="card"><div class="row-between mb-2"><div class="list-title">Разрешение</div><div class="badge '+(n.permission==='granted'?'badge-success':'')+'">'+(n.permission||'default')+'</div></div>';
  if(n.permission!=='granted')html+='<button class="btn btn-primary btn-block" onclick="requestNotificationPermission()">Разрешить</button>';
  html+='</div>';
  html+='<div class="card"><h2>Общие</h2>';
  html+='<div class="row-between mb-2"><div class="list-title">Все уведомления</div><button class="btn '+(s.enabled?'btn-primary':'btn-ghost')+' btn-sm" onclick="toggleNotifSetting(\'enabled\')">'+(s.enabled?'Вкл':'Выкл')+'</button></div>';
  html+='<div class="row-between mb-2"><div class="list-title">Утро</div><button class="btn '+(s.morning?'btn-primary':'btn-ghost')+' btn-sm" onclick="toggleNotifSetting(\'morning\')">'+(s.morning?'Вкл':'Выкл')+'</button></div>';
  html+='<div class="row-between mb-2"><div class="list-title">День</div><button class="btn '+(s.day?'btn-primary':'btn-ghost')+' btn-sm" onclick="toggleNotifSetting(\'day\')">'+(s.day?'Вкл':'Выкл')+'</button></div>';
  html+='<div class="row-between mb-2"><div class="list-title">Вечер</div><button class="btn '+(s.evening?'btn-primary':'btn-ghost')+' btn-sm" onclick="toggleNotifSetting(\'evening\')">'+(s.evening?'Вкл':'Выкл')+'</button></div>';
  html+='<div class="row-between mb-2"><div class="list-title">Ночь</div><button class="btn '+(s.night?'btn-primary':'btn-ghost')+' btn-sm" onclick="toggleNotifSetting(\'night\')">'+(s.night?'Вкл':'Выкл')+'</button></div>';
  html+='</div>';
  html+='<button class="btn btn-primary btn-block" onclick="testNotification()">🔔 Тест</button>';
  html+='</div>';document.getElementById('app').innerHTML=html;
}
window.renderNotifications=renderNotifications;
function requestNotificationPermission(){
  if(!('Notification' in window))return toast('Не поддерживается','error');
  Notification.requestPermission().then(function(perm){state.notifications.permission=perm;save();renderNotifications()});
}
window.requestNotificationPermission=requestNotificationPermission;
function toggleNotifSetting(key){
  if(!state.notifications.settings)state.notifications.settings={};
  state.notifications.settings[key]=!state.notifications.settings[key];
  save();renderNotifications();
}
window.toggleNotifSetting=toggleNotifSetting;
function testNotification(){
  if(state.notifications.permission!=='granted')return toast('Разреши сначала','warning');
  try{new Notification('Life OS',{body:'Тест 🎉'});toast('✓','success')}catch(e){toast('Ошибка','error')}
}
window.testNotification=testNotification;

/* ============ НАСТРОЙКИ ============ */
function renderSettings(){
  var themes=window.THEMES||[];
  var currentTheme=themes.find(function(t){return t.id===state.settings.theme})||{name:'dark'};
  var html='<div class="page"><div class="title-xl">⚙️ Настройки</div>';
  html+='<div class="card"><h2>Профиль</h2><div class="field"><label class="field-label">Имя</label><input type="text" value="'+esc(state.profile.name)+'" onchange="saveProfileName(this.value)"/></div>';
  html+='<div class="list-row" onclick="openThemePicker()"><div class="list-icon">🎨</div><div class="list-body"><div class="list-title">Тема</div></div><div class="list-value">'+currentTheme.name+'</div></div></div>';
  html+='<div class="card"><h2>Коуч</h2><button class="btn btn-primary btn-block" onclick="navigate(\'coachSettings\')">Настроить AI-коуча</button></div>';
  html+='<div class="card"><h2>Расписание</h2><button class="btn btn-primary btn-block" onclick="navigate(\'schedule\')">Время обычного дня</button></div>';
  html+='<div class="card"><h2>Уведомления</h2><button class="btn btn-primary btn-block" onclick="navigate(\'notifications\')">Настроить</button></div>';
  html+='<div class="card"><h2>Данные</h2>';
  html+='<button class="btn btn-primary btn-block mb-2" onclick="exportDB()">📤 Экспорт JSON</button>';
  html+='<button class="btn btn-ghost btn-block mb-2" onclick="importDB()">📥 Импорт JSON</button>';
  html+='<button class="btn btn-danger btn-block" onclick="resetAllWithConfirm()">🗑 Полный сброс</button>';
  html+='</div>';
  html+='<div class="footnote text-tertiary" style="text-align:center;">Life OS v'+CURRENT_VERSION+'</div></div>';
  document.getElementById('app').innerHTML=html;
}
window.renderSettings=renderSettings;
function renderSettingsV2(){renderSettings()}
window.renderSettingsV2=renderSettingsV2;
function renderProfile(){renderProfileV2()}
window.renderProfile=renderProfile;
function renderProfileV2(){
  var p=state.profileV2||{};
  var html='<div class="page"><div class="title-xl">👤 Профиль</div>';
  html+='<div class="profile-hero"><div class="avatar-btn" onclick="pickEmoji()" style="width:96px;height:96px;margin:0 auto 12px;font-size:48px;">'+state.profile.emoji+'</div>';
  html+='<div style="font-size:22px;font-weight:800;">'+esc(state.profile.name||'Пользователь')+'</div>';
  html+='<div class="footnote text-secondary">XP: '+(state.xp||0)+'</div></div>';
  html+='<div class="card"><h2>📏 Данные</h2>';
  html+='<div class="field"><label class="field-label">Возраст</label><input type="number" id="pv-age" value="'+(p.age||'')+'" onchange="saveProfileV2()"/></div>';
  html+='<div class="field"><label class="field-label">Рост (см)</label><input type="number" id="pv-height" value="'+(p.height||'')+'" onchange="saveProfileV2()"/></div>';
  html+='<div class="field"><label class="field-label">Вес (кг)</label><input type="number" id="pv-weight" value="'+(p.weight||'')+'" step="0.1" onchange="saveProfileV2()"/></div>';
  html+='</div>';
  html+='<button class="btn btn-primary btn-block" onclick="navigate(\'achievements\')">🏆 Достижения</button>';
  html+='</div>';document.getElementById('app').innerHTML=html;
}
window.renderProfileV2=renderProfileV2;
function saveProfileV2(){
  var p=state.profileV2;
  p.age=parseInt((document.getElementById('pv-age')||{}).value)||null;
  p.height=parseFloat((document.getElementById('pv-height')||{}).value)||null;
  p.weight=parseFloat((document.getElementById('pv-weight')||{}).value)||null;
  p.updatedAt=nowISO();
  save();toast('✓','success');
}
window.saveProfileV2=saveProfileV2;
function pickEmoji(){
  var emojis=['😊','😎','🤓','🧑‍💻','👨‍💼','👩‍💼','🦊','🐱','🐶','🦁','🐼','🦉','🌟','⚡','🔥','💎','🚀','🎯','🧠','💪','🌈','☕','🎨','🎮','🎧','📚','🏃','🧘','🍀','🌸'];
  var html='<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:8px;">';
  emojis.forEach(function(e){html+='<button onclick="setEmoji(\''+e+'\')" style="aspect-ratio:1;border-radius:14px;background:var(--glass-2);font-size:26px;cursor:pointer;border:2px solid '+(e===state.profile.emoji?'var(--brand)':'transparent')+';">'+e+'</button>'});
  html+='</div>';openSheet('Аватар',html);
}
window.pickEmoji=pickEmoji;
function setEmoji(e){state.profile.emoji=e;save();closeSheet();toast('✓','success');updateHeader();renderProfileV2()}
window.setEmoji=setEmoji;
function saveProfileName(name){state.profile.name=(name||'').trim()||'Пользователь';save();toast('Сохранено','success');updateHeader()}
window.saveProfileName=saveProfileName;
function renderIntegrations(){renderStub('🔗 Интеграции')}
window.renderIntegrations=renderIntegrations;
function renderStorage(){renderStub('🗄 Хранилище')}
window.renderStorage=renderStorage;

/* ============ MORE (удобный) ============ */
function renderMore(){
  var groups=[
    {title:'🎯 Основное',items:[
      {key:'dashboard',emoji:'🏠',label:'Главная'},
      {key:'spheres',emoji:'🎯',label:'Сферы'},
      {key:'projects',emoji:'📁',label:'Проекты'},
      {key:'coach',emoji:'💬',label:'AI-Коуч'},
      {key:'schedule',emoji:'📅',label:'Расписание'},
      {key:'focus',emoji:'⏱',label:'Фокус'},
      {key:'eveningReview',emoji:'🌙',label:'Вечерний обзор'}
    ]},
    {title:'📊 Отчёты',items:[
      {key:'dailyReport',emoji:'📊',label:'Отчёт дня'},
      {key:'weeklyReview',emoji:'📈',label:'Итоги недели'},
      {key:'monthlyReview',emoji:'📆',label:'Итоги месяца'},
      {key:'achievements',emoji:'🏆',label:'Достижения'},
      {key:'snapshot',emoji:'🌐',label:'Единая картина'}
    ]},
    {title:'🔄 Привычки и ум',items:[
      {key:'habitList',emoji:'🔄',label:'Привычки'},
      {key:'habitCatalog',emoji:'📚',label:'Каталог привычек'},
      {key:'brain',emoji:'🧠',label:'Тренировка ума'},
      {key:'antistress',emoji:'🌬',label:'Антистресс'},
      {key:'sleep',emoji:'😴',label:'Сон'},
      {key:'sleepCalendar',emoji:'📅',label:'Календарь сна'}
    ]},
    {title:'🎓 Обучение',items:[
      {key:'learning',emoji:'🎓',label:'Обучение'},
      {key:'levels',emoji:'🌱',label:'Уровни'},
      {key:'english',emoji:'🇬🇧',label:'English'},
      {key:'skills',emoji:'💎',label:'Навыки'},
      {key:'games',emoji:'🎮',label:'Игры'},
      {key:'materials',emoji:'📚',label:'Материалы'}
    ]},
    {title:'❤️ Здоровье',items:[
      {key:'health',emoji:'❤️',label:'Здоровье'},
      {key:'water',emoji:'💧',label:'Вода'},
      {key:'mood',emoji:'💭',label:'Настроение'},
      {key:'screentracker',emoji:'📱',label:'Экран'},
      {key:'detoxcourse',emoji:'📚',label:'Детокс'},
      {key:'vision',emoji:'👁',label:'Зрение'}
    ]},
    {title:'⚙️ Система',items:[
      {key:'settings',emoji:'⚙️',label:'Настройки'},
      {key:'notifications',emoji:'🔔',label:'Уведомления'},
      {key:'profile',emoji:'👤',label:'Профиль'},
      {key:'storage',emoji:'🗄',label:'Хранилище'}
    ]}
  ];
  var html='<div class="page"><div class="title-xl">Все разделы</div>';
  groups.forEach(function(g){
    html+='<div class="card"><h2>'+g.title+'</h2>';
    g.items.forEach(function(it){
      html+='<div class="list-row" onclick="navigate(\''+it.key+'\')"><div class="list-icon">'+it.emoji+'</div><div class="list-body"><div class="list-title">'+it.label+'</div></div><div class="list-chevron">›</div></div>';
    });
    html+='</div>';
  });
  html+='</div>';document.getElementById('app').innerHTML=html;
}
window.renderMore=renderMore;

function renderStub(title){
  var app=document.getElementById('app');
  if(app)app.innerHTML='<div class="page"><div class="title-xl">'+title+'</div><div class="card"><div class="empty"><div class="empty-icon">🚧</div><div class="empty-title">Раздел в разработке</div></div></div></div>';
}
window.renderStub=renderStub;

/* Заглушки для старых роутов */
function renderStats(){renderStub('📊 Статистика')}
function renderDetailedStats(){renderStub('📈 Детальная')}
function renderTimer(){navigate('focus')}
function renderDomains(){navigate('spheres')}
function renderMemory(){renderStub('🧠 Память')}
function renderIQ(){renderStub('🎯 IQ')}
function renderEQ(){renderStub('❤️ EQ')}
function renderFinance(){renderStub('💰 Финансы')}
function renderNeuro(){renderStub('🔬 Нейро')}
function renderPsychology(){renderStub('🧠 Психология')}
function renderThinking(){renderStub('💡 Мышление')}
function renderEtiquette(){renderStub('🎩 Этикет')}
function renderHormones(){renderStub('🧬 Гормоны')}
function renderWealth(){renderStub('💰 Богатство')}
function renderPlanning(){navigate('schedule')}
function renderPlanToday(){navigate('schedule')}
function renderPlanWeek(){navigate('weeklyReview')}
function renderPlanMonth(){navigate('monthlyReview')}
function renderObsidian(){renderStub('📓 Obsidian')}
function renderMethods(){renderStub('🎯 Методики')}
function renderRecovery(){renderStub('🌿 Восстановление')}
function renderMedical(){renderStub('🏥 Медицина')}
function renderEntertainment(){renderStub('🎬 Досуг')}
function renderResources(){renderStub('🔗 Ресурсы')}
function renderMovies(){renderStub('🎥 Фильмы')}
function renderSeries(){renderStub('📺 Сериалы')}
function renderBooks(){renderStub('📚 Книги')}
function renderMusic(){renderStub('🎵 Музыка')}
function renderGames(){renderStub('🎮 Игры')}
function renderPodcasts(){renderStub('🎧 Подкасты')}
function renderGoals(){renderStub('🎯 Цели')}
function renderNotes(){renderStub('📝 Заметки')}
function renderJournal(){renderStub('📓 Дневник')}
function renderDetoxCourse(){renderStub('📚 Детокс-курс')}
function renderDailySurvey(){renderStub('📋 Опрос')}
function renderSurvey(){renderStub('📋 Опрос')}
function renderPersonalPlan(){navigate('dashboard')}
function renderLearningGames(){renderStub('🎮 Игры')}
function renderGamePlay(){renderStub('Игра')}
function renderMaterials(){renderStub('📚 Материалы')}
function renderMaterialDetail(){renderStub('Материал')}
function renderDailyReport(){renderStub('📊 Отчёт дня')}
function renderWeeklyReport(){renderWeeklyReview()}
function renderSnapshot(){renderStub('🌐 Единая картина')}
function renderRecommendations(){renderStub('💡 Рекомендации')}
window.renderStats=renderStats;window.renderDetailedStats=renderDetailedStats;
window.renderTimer=renderTimer;window.renderDomains=renderDomains;
window.renderMemory=renderMemory;window.renderIQ=renderIQ;window.renderEQ=renderEQ;
window.renderFinance=renderFinance;window.renderNeuro=renderNeuro;
window.renderPsychology=renderPsychology;window.renderThinking=renderThinking;
window.renderEtiquette=renderEtiquette;window.renderHormones=renderHormones;
window.renderWealth=renderWealth;window.renderPlanning=renderPlanning;
window.renderPlanToday=renderPlanToday;window.renderPlanWeek=renderPlanWeek;
window.renderPlanMonth=renderPlanMonth;window.renderObsidian=renderObsidian;
window.renderMethods=renderMethods;window.renderRecovery=renderRecovery;
window.renderMedical=renderMedical;window.renderEntertainment=renderEntertainment;
window.renderResources=renderResources;window.renderMovies=renderMovies;
window.renderSeries=renderSeries;window.renderBooks=renderBooks;
window.renderMusic=renderMusic;window.renderGames=renderGames;
window.renderPodcasts=renderPodcasts;window.renderGoals=renderGoals;
window.renderNotes=renderNotes;window.renderJournal=renderJournal;
window.renderDetoxCourse=renderDetoxCourse;window.renderDailySurvey=renderDailySurvey;
window.renderSurvey=renderSurvey;window.renderPersonalPlan=renderPersonalPlan;
window.renderLearningGames=renderLearningGames;window.renderGamePlay=renderGamePlay;
window.renderMaterials=renderMaterials;window.renderMaterialDetail=renderMaterialDetail;
window.renderDailyReport=renderDailyReport;window.renderWeeklyReport=renderWeeklyReport;
window.renderSnapshot=renderSnapshot;window.renderRecommendations=renderRecommendations;

/* ============ АГРЕГАТОР ============ */
function buildUserSnapshot(s){
  if(!s)return null;
  var t=today(),y=yesterday();
  var snap={
    date:t,
    habits:{total:(s.habits||[]).length,completedToday:0,activeStreak:0,bestStreak:0,byCategory:{}},
    sleep:{lastNight:null,avg7:null,avg30:null},
    screen:{today:(s.screenStats||{})[t]||0,yesterday:(s.screenStats||{})[y]||0,week:0},
    tasks:{total:(s.tasks||[]).length,pending:0,completedToday:0,overdue:0},
    mood:{today:null,avg7:null},
    water:{today:0,goal:getWaterGoal()},
    workouts:{last7:0,last30:0},
    brain:{totalPlays:0,todayPlays:0,avgScore:null},
    antistress:{todayCount:0,weekCount:0},
    learning:{lessonsDone:Object.keys(s.levelProgress||{}).length,englishDone:Object.keys(s.englishProgress||{}).length,skillsDone:Object.keys(s.skillsProgress||{}).length},
    xp:s.xp||0,
    streak:(s.stats&&s.stats.streak)||0,
    recommendations:[]
  };
  if(s.habits)s.habits.forEach(function(h){if(h.lastCompletedDate===t)snap.habits.completedToday++;if(h.streak>snap.habits.activeStreak)snap.habits.activeStreak=h.streak});
  if(s.tasks)s.tasks.forEach(function(task){if(task.status==='pending'){snap.tasks.pending++;if(task.due_date&&task.due_date.slice(0,10)<t)snap.tasks.overdue++}if(task.status==='completed'&&task.completedAt&&task.completedAt.slice(0,10)===t)snap.tasks.completedToday++});
  var waterToday=(s.customWater||[]).find(function(w){return w.date===t});
  if(waterToday)snap.water.today=waterToday.count||0;
  var moodToday=(s.customMood||[]).find(function(m){return m.date===t});
  if(moodToday)snap.mood.today=moodToday.score;
  snap.brain.todayPlays=(s.brainPlays||[]).filter(function(p){return p.date===t}).length;
  snap.antistress.todayCount=(s.antistressEntries||[]).filter(function(e){return e.date===t}).length;
  return snap;
}
window.buildUserSnapshot=buildUserSnapshot;

function refreshSnapshot(){
  try{
    var snap=buildUserSnapshot(state);
    if(!snap)return null;
    state.snapshot=snap;
    state.lastSnapshotAt=nowISO();
    save();
    return snap;
  }catch(e){return null}
}
window.refreshSnapshot=refreshSnapshot;

/* ============ ЭКСПОРТ / ИМПОРТ ============ */
function exportDB(){
  try{
    var blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
    var url=URL.createObjectURL(blob);
    var a=document.createElement('a');
    a.href=url;a.download='life-os-'+today()+'.json';a.click();
    URL.revokeObjectURL(url);toast('📤 Готово','success');
  }catch(e){toast('Ошибка','error')}
}
window.exportDB=exportDB;
function importDB(){
  var input=document.createElement('input');
  input.type='file';input.accept='.json';
  input.onchange=function(e){
    var file=e.target.files[0];if(!file)return;
    var reader=new FileReader();
    reader.onload=function(){
      try{
        var data=JSON.parse(reader.result);
        if(!data||typeof data!=='object')throw new Error('bad');
        backupStorage();localStorage.setItem(STORAGE_KEY,JSON.stringify(data));
        toast('✓ Перезагрузка...','success');setTimeout(function(){location.reload()},1200);
      }catch(err){toast('Ошибка','error')}
    };
    reader.readAsText(file);
  };input.click();
}
window.importDB=importDB;
function resetAllWithConfirm(){
  if(!confirm('Удалить ВСЕ данные?'))return;
  if(!confirm('Точно?'))return;
  backupStorage();localStorage.removeItem(STORAGE_KEY);location.reload();
}
window.resetAllWithConfirm=resetAllWithConfirm;

/* ============ WELCOME ============ */
function showWelcome(){
  var overlay=document.createElement('div');
  overlay.className='welcome-screen';
  overlay.innerHTML='<div class="welcome-logo">🧠</div><div class="welcome-title">Life OS</div><div class="welcome-sub">Нейроэкосистема жизни. Сферы, AI-коуч, привычки, проекты, расписание.</div><button class="btn btn-primary btn-block" style="max-width:340px;" onclick="startOnboarding()">Начать</button>';
  document.body.appendChild(overlay);
}
window.showWelcome=showWelcome;
function startOnboarding(){
  var w=document.querySelector('.welcome-screen');if(w)w.remove();
  var name=window.__tgName||'';
  if(!name){
    var o=document.createElement('div');o.className='welcome-screen';
    o.innerHTML='<div class="welcome-logo">👤</div><div class="welcome-title">Как тебя зовут?</div><input type="text" class="welcome-input" id="welcome-name" placeholder="Имя" maxlength="30"/><button class="btn btn-primary btn-block mt-4" style="max-width:340px;margin-top:16px;" onclick="finishOnboarding()">Далее</button>';
    document.body.appendChild(o);
    setTimeout(function(){var i=document.getElementById('welcome-name');if(i)i.focus()},300);
  }else{state.profile.name=name;state.settings.onboardingDone=true;save();updateHeader();renderTabBar();renderDashboard()}
}
window.startOnboarding=startOnboarding;
function finishOnboarding(){
  var inp=document.getElementById('welcome-name');var name=inp?inp.value.trim():'';
  if(!name)return toast('Введи имя','error');
  state.profile.name=name;state.settings.onboardingDone=true;save();
  var w=document.querySelector('.welcome-screen');if(w)w.remove();
  updateHeader();renderTabBar();renderDashboard();
  haptic('success');toast('Добро пожаловать, '+name+'!','success');
}
window.finishOnboarding=finishOnboarding;

/* ============ INIT ============ */
function init(){
  try{
    applyTheme(state.settings.theme);
    applyUserSettings();
    updateHeader();
    if(!state.profile.name&&!state.settings.onboardingDone){showWelcome();return}
    if(state.profile.name&&!state.settings.onboardingDone){state.settings.onboardingDone=true;save()}
    if(!state.profile.name&&window.__tgName){state.profile.name=window.__tgName;save()}
    if(!state.tasks.length){
      state.tasks=[{id:uid(),title:'Изучить Life OS',category:'Личное',planned_time:10,status:'pending',priority:'medium',created_at:nowISO()}];
      save();
    }
    if(!state.xp)state.xp=0;
    renderTabBar();
    renderDashboard();
    var t=today();
    if(state.stats.lastActiveDay!==t){
      var y=new Date();y.setDate(y.getDate()-1);
      var wasYesterday=state.stats.lastActiveDay===y.toISOString().slice(0,10);
      state.stats.streak=wasYesterday?(state.stats.streak||0)+1:1;
      if(state.stats.streak>(state.stats.bestStreak||0))state.stats.bestStreak=state.stats.streak;
      state.stats.lastActiveDay=t;save();
    }
    setTimeout(function(){try{refreshSnapshot()}catch(e){}},500);
    setTimeout(function(){try{checkAchievements()}catch(e){}},1000);
    startNotificationScheduler();
    setInterval(function(){try{save()}catch(e){}},30000);
    setInterval(function(){try{checkAchievements()}catch(e){}},5*60*1000);
    console.log('[INIT ✅] Life OS v44: spheres='+Object.keys(state.spheres.lastScores||{}).length+' projects='+state.projects.length+' habits='+state.habits.length);
  }catch(e){
    console.error('[INIT]',e);
    var app=document.getElementById('app');
    if(app)app.innerHTML='<div class="empty"><div class="empty-icon">⚠️</div><div class="empty-title">Ошибка</div><div class="empty-text">'+esc(e.message)+'</div></div>';
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
window.updateHeader=updateHeader;
window.renderTabBar=renderTabBar;

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',init);
}else{
  init();
}

function renderModuleDetail(){
  var level=(window.LEARNING_LEVELS||[]).find(function(l){return l.id===currentLevelId});
  if(!level){navigate('learning');return}
  var module=(level.modules||[]).find(function(m){return m.id===currentModuleId});
  if(!module){navigate('levelDetail');return}
  var html='<div class="page"><div class="title-xl">'+module.emoji+' '+module.title+'</div><div class="card">';
  (module.lessons||[]).forEach(function(lesson,i){
    var key=level.id+'_'+module.id+'_'+i;
    var isDone=!!state.levelProgress[key];
    html+='<div class="lesson-row '+(isDone?'done':'')+'" onclick="openLesson(\''+level.id+'\',\''+module.id+'\','+i+')"><div class="lesson-num">'+(isDone?'✓':(i+1))+'</div><div class="lesson-title">'+esc(lesson.title)+'</div></div>';
  });
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}

console.log('[APP v44 ✅] ФИНАЛ загружен');
