'use strict';
/* ============================================================
   LIFE OS — APP.js v43 — ФИНАЛ (4 части)
   ЧАСТЬ 1/4: Ядро, State, BackButton, Голос, Роуты, Dashboard
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
}catch(e){console.warn('[TG]',e)}

/* ============ BACK BUTTON TELEGRAM ============ */
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
function tgBackButtonHide(){
  try{if(tg&&tg.BackButton)tg.BackButton.hide()}catch(e){}
}
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
function voiceSupported(){
  return !!(window.SpeechRecognition||window.webkitSpeechRecognition);
}
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
    rec.onerror=function(err){
      toast('Голос: '+(err&&err.error||'ошибка'),'error');
      if(btn){btn.style.background='var(--glass-3)';btn.textContent='🎤'}
    };
    rec.onend=function(){if(btn){btn.style.background='var(--glass-3)';btn.textContent='🎤'}};
    rec.start();
    toast('🎤 Говорите...','info',1500);
  }catch(e){
    toast('Голос недоступен','error');
    if(btn){btn.style.background='var(--glass-3)';btn.textContent='🎤'}
  }
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

/* ============ DEFAULT STATE ============ */
function defaultState(){
  return{
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

    /* Новое v43 */
    habits:[],habitHistory:{},habitStreaks:{},habitGoals:[],
    brainPlays:[],brainStats:{},brainStreak:0,brainLastDay:null,
    antistressEntries:[],antistressStats:{},
    sleepEntries:[],
    gameProgress:{},materialsProgress:{},
    notifications:{enabled:false,permission:'default',settings:{},scheduled:[],history:[]},
    profileV2:{age:null,height:null,weight:null,gender:null,activity:'moderate',goal:'maintain',targetWeight:null,targetDate:null,restingHR:null,maxHR:null,medicalNotes:'',updatedAt:null},
    settingsV2:{textSize:'medium',scale:'100',sound:true,soundVolume:0.5,haptic:true,animations:true,animationsSpeed:'normal',language:'ru',firstDayOfWeek:'monday',timeFormat:'24h',dateFormat:'DD.MM.YYYY',darkMode:'auto',effectsEnabled:true,effectsIntensity:1,reducedMotion:false,updatedAt:null},
    snapshot:null,snapshotHistory:[],recommendations:[],lastSnapshotAt:null,

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
function backupStorage(){
  try{var raw=localStorage.getItem(STORAGE_KEY);if(raw){localStorage.setItem(STORAGE_BACKUP,raw);return true}}catch(e){}
  return false;
}
function restoreFromBackup(){
  try{var b=localStorage.getItem(STORAGE_BACKUP);if(!b)return false;localStorage.setItem(STORAGE_KEY,b);return true}catch(e){return false}
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
  if(!Array.isArray(data.habits))data.habits=[];
  if(!data.habitHistory)data.habitHistory={};
  if(!Array.isArray(data.brainPlays))data.brainPlays=[];
  if(!Array.isArray(data.antistressEntries))data.antistressEntries=[];
  if(!Array.isArray(data.sleepEntries))data.sleepEntries=[];
  if(!data.profileV2)data.profileV2=defaultState().profileV2;
  if(!data.settingsV2)data.settingsV2=defaultState().settingsV2;
  if(!data.snapshotHistory)data.snapshotHistory=[];
  if(!data.notifications)data.notifications={enabled:false,permission:'default',settings:{},scheduled:[],history:[]};
  return data;
}

/* ============ ЗАГРУЗКА ============ */
var state;
(function loadState(){
  try{
    backupStorage();
    var raw=localStorage.getItem(STORAGE_KEY);
    if(!raw){
      var oldRaw=localStorage.getItem('life_os_v40');
      if(oldRaw){
        console.log('[LOAD] миграция v40 → v43');
        state=deepMerge(defaultState(),JSON.parse(oldRaw));
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
    if(!restoreFromBackup())state=defaultState();
    else{try{state=deepMerge(defaultState(),JSON.parse(localStorage.getItem(STORAGE_KEY)))}catch(e2){state=defaultState()}}
  }
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
    dashboard:renderDashboard,tasks:renderTasks,matrix:renderMatrix,dailyplan:renderDailyPlan,
    learning:renderLearning,learnplan:renderLearnPlan,
    levels:renderLevels,levelDetail:renderLevelDetail,moduleDetail:renderModuleDetail,
    skills:renderSkills,methods:renderMethods,english:renderEnglish,
    memory:renderMemory,iq:renderIQ,eq:renderEQ,finance:renderFinance,
    neuromodule:renderNeuro,psychology:renderPsychology,thinking:renderThinking,
    etiquette:renderEtiquette,hormones:renderHormones,wealth:renderWealth,
    planning:renderPlanning,plantoday:renderPlanToday,planweek:renderPlanWeek,
    planmonth:renderPlanMonth,obsidian:renderObsidian,gcal:renderGcal,calendar:renderCalendarV2,
    vision:renderVision,visionex:renderVisionExercises,visiontrack:renderVisionTracker,
    visiontips:renderVisionTips,vision60:renderVision60,
    ai:renderAI,health:renderHealth,water:renderWater,mood:renderMood,
    workouts:renderWorkouts,meditation:renderMeditation,meds:renderMeds,
    recovery:renderRecovery,medical:renderMedical,
    entertainment:renderEntertainment,resources:renderResources,
    movies:renderMovies,series:renderSeries,books:renderBooks,
    musiclib:renderMusic,gameslib:renderGames,podcastslib:renderPodcasts,
    habits:renderHabitList,goals:renderGoals,notes:renderNotes,journal:renderJournal,
    more:renderMore,stats:renderStats,detailedStats:renderDetailedStats,
    timer:renderTimer,focus:renderFocus,domains:renderDomains,
    profile:renderProfile,profileV2:renderProfileV2,settings:renderSettings,
    settingsV2:renderSettingsV2,integrations:renderIntegrations,storage:renderStorage,
    screentracker:renderScreenTracker,detoxcourse:renderDetoxCourse,
    dailySurvey:renderDailySurvey,survey:renderSurvey,plan:renderPersonalPlan,
    habitList:renderHabitList,habitCatalog:renderHabitCatalog,habitDetail:renderHabitDetail,habitEditor:renderHabitEditor,
    brain:renderBrain,brainGame:renderBrainGame,brainStats:renderBrainStats,
    antistress:renderAntistress,antistressDetail:renderAntistressDetail,
    sleep:renderSleep,sleepCalendar:renderSleepCalendar,sleepEditor:renderSleepEditor,
    games:renderLearningGames,gamePlay:renderGamePlay,
    materials:renderMaterials,materialDetail:renderMaterialDetail,
    notifications:renderNotifications,
    snapshot:renderSnapshot,recommendations:renderRecommendations,
    dailyReport:renderDailyReport,weeklyReport:renderWeeklyReport,
    gamesPlay:renderGamePlayReal
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
  if(page==='dashboard'||page==='snapshot'||page==='dailyReport'||page==='weeklyReport'){
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
  try{
    state.settings.theme=id;
    applyTheme(id);
    save();
    haptic('success');
    closeSheet();
    toast('Тема: '+id,'success');
  }catch(e){toast('Ошибка','error')}
}
window.openThemePicker=openThemePicker;
window.setTheme=setTheme;
function openStatsQuick(){navigate('stats')}
window.openStatsQuick=openStatsQuick;

/* ============ DASHBOARD ============ */
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
  var waterGoal=getWaterGoal();
  var screenToday=screenGetToday();

  var snap=null;
  try{snap=buildUserSnapshot(state)}catch(e){}

  var html='<div class="page"><div class="title-xl">'+greet+userName+'</div>';

  html+='<div class="progress-ring-hero">';
  html+=renderRing(progress,'День','ring-1','✓');
  html+=renderRing(overallPct,'Учёба','ring-2','🎓');
  html+=renderRing(Math.min(100,Math.round(water/waterGoal*100)),'Вода','ring-3','💧');
  html+=renderRing(Math.min(100,(state.stats.streak||0)*10),'Streak','ring-4','🔥');
  html+='</div>';

  if(snap&&snap.recommendations&&snap.recommendations.length){
    html+='<div class="card" style="background:linear-gradient(135deg,color-mix(in srgb,var(--brand) 18%,transparent),color-mix(in srgb,var(--brand-2) 12%,transparent));border-color:color-mix(in srgb,var(--brand) 40%,transparent);">';
    html+='<div class="row-between mb-3"><div style="font-size:16px;font-weight:800;">🌐 Единая картина</div>';
    html+='<button class="btn btn-ghost btn-xs" onclick="navigate(\'snapshot\')">Все →</button></div>';
    snap.recommendations.slice(0,3).forEach(function(r){
      html+='<div style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid var(--divider);">';
      html+='<div style="font-size:20px;">'+r.emoji+'</div>';
      html+='<div style="flex:1;"><div style="font-weight:700;font-size:13px;">'+esc(r.title)+'</div>';
      html+='<div class="footnote text-secondary">'+esc(r.text)+'</div></div></div>';
    });
    html+='</div>';
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
  }else{
    html+='<div class="card" style="cursor:pointer;" onclick="navigate(\'habitCatalog\')">';
    html+='<div style="font-size:16px;font-weight:800;margin-bottom:8px;">🔄 Начни привычку</div>';
    html+='<div class="footnote text-secondary mb-3">200+ шаблонов</div>';
    html+='<div class="btn btn-primary btn-block">Выбрать</div></div>';
  }

  /* Отчёты */
  html+='<div class="card"><h2>📊 Отчёты</h2>';
  html+='<div class="row" style="gap:8px;">';
  html+='<button class="btn btn-primary" style="flex:1;" onclick="navigate(\'dailyReport\')">📊 День</button>';
  html+='<button class="btn btn-ghost" style="flex:1;" onclick="navigate(\'weeklyReport\')">📈 Неделя</button>';
  html+='</div></div>';

  /* Быстрые действия */
  html+='<div class="card"><h2>⚡ Быстро</h2><div class="group-grid">';
  html+='<div class="group-item" onclick="openEntityEditor(\'task\',null)"><div class="group-item-icon">➕</div><div class="group-item-label">Задача</div></div>';
  html+='<div class="group-item" onclick="addWater()"><div class="group-item-icon">💧</div><div class="group-item-label">'+water+'/'+waterGoal+'</div></div>';
  html+='<div class="group-item" onclick="quickMoodLog()"><div class="group-item-icon">💭</div><div class="group-item-label">Настроение</div></div>';
  html+='<div class="group-item" onclick="navigate(\'brain\')"><div class="group-item-icon">🧠</div><div class="group-item-label">Ум</div></div>';
  html+='<div class="group-item" onclick="navigate(\'antistress\')"><div class="group-item-icon">🌬</div><div class="group-item-label">Стресс</div></div>';
  html+='<div class="group-item" onclick="navigate(\'sleepEditor\')"><div class="group-item-icon">😴</div><div class="group-item-label">Сон</div></div>';
  html+='</div></div>';

  /* Экран */
  if(screenToday>0){
    var sc=screenToday>300?'var(--danger)':screenToday>180?'var(--warning)':'var(--success)';
    html+='<div class="card" onclick="navigate(\'screentracker\')" style="cursor:pointer;border-left:3px solid '+sc+';">';
    html+='<div class="row-between"><div style="font-size:16px;font-weight:800;">📱 Экран</div>';
    html+='<div style="font-size:20px;font-weight:800;color:'+sc+';">'+fmtMinsHM(screenToday)+'</div></div>';
    html+='</div>';
  }

  /* Задачи */
  var pending=state.tasks.filter(function(t){return t.status==='pending'});
  html+='<div class="card"><div class="row-between mb-3"><h2 style="margin:0;">📋 Задачи</h2>';
  html+='<button class="btn btn-ghost btn-xs" onclick="navigate(\'tasks\')">Все →</button></div>';
  if(pending.length){
    pending.slice().sort(function(a,b){return getEisenhowerPriority(a)-getEisenhowerPriority(b)}).slice(0,4).forEach(function(t){html+=taskRow(t)});
  }else{html+='<div class="empty"><div class="empty-icon">✨</div><div class="empty-title">Всё выполнено</div></div>'}
  html+='</div>';

  html+=renderWisdom();
  html+=renderChallenges();

  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderDashboard=renderDashboard;

/* ============ ЗАГЛУШКИ (будут перезаписаны в следующих частях) ============ */
function renderTasks(){renderStub('✅ Задачи')}
function renderMatrix(){renderStub('🔢 Матрица')}
function renderDailyPlan(){renderStub('📅 План дня')}
function renderLearning(){renderStub('🎓 Обучение')}
function renderLearnPlan(){renderStub('🗓 План обучения')}
function renderLevels(){renderStub('🌱 Уровни')}
function renderLevelDetail(){renderStub('Уровень')}
function renderModuleDetail(){renderStub('Модуль')}
function renderSkills(){renderStub('💎 Навыки')}
function renderMethods(){renderStub('🎯 Методики')}
function renderEnglish(){renderStub('🇬🇧 English')}
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
function renderPlanning(){renderStub('📅 Планирование')}
function renderPlanToday(){renderStub('📅 План дня')}
function renderPlanWeek(){renderStub('🗓 План недели')}
function renderPlanMonth(){renderStub('📆 План месяца')}
function renderObsidian(){renderStub('📓 Obsidian')}
function renderGcal(){renderCalendarV2()}
function renderVision(){renderStub('👁 Зрение')}
function renderVisionExercises(){renderStub('🤸 Упражнения')}
function renderVisionTracker(){renderStub('📊 Трекер зрения')}
function renderVisionTips(){renderStub('💡 Советы')}
function renderVision60(){renderStub('👁 75 упражнений')}
function renderAI(){renderStub('✨ AI')}
function renderHealth(){renderStub('❤️ Здоровье')}
function renderWater(){renderStub('💧 Вода')}
function renderMood(){renderStub('💭 Настроение')}
function renderWorkouts(){renderStub('🏋️ Тренировки')}
function renderMeditation(){renderStub('🧘 Медитации')}
function renderMeds(){renderStub('💊 Лекарства')}
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
function renderStats(){renderStub('📊 Статистика')}
function renderDetailedStats(){renderStub('📈 Детальная')}
function renderTimer(){renderStub('⏱ Таймер')}
function renderFocus(){renderStub('🎯 Фокус')}
function renderDomains(){renderStub('🌐 Домены')}
function renderIntegrations(){renderStub('🔗 Интеграции')}
function renderStorage(){renderStub('🗄 Хранилище')}
function renderScreenTracker(){renderStub('📱 Экран')}
function renderDetoxCourse(){renderStub('📚 Детокс')}
function renderDailySurvey(){renderStub('📋 Опрос')}
function renderSurvey(){renderStub('📋 Опрос')}
function renderPersonalPlan(){renderStub('🎯 План')}
function renderHabitList(){renderStub('🔄 Привычки')}
function renderHabitCatalog(){renderStub('📚 Каталог')}
function renderHabitDetail(){renderStub('Привычка')}
function renderHabitEditor(){renderStub('Редактор')}
function renderBrain(){renderStub('🧠 Тренировка ума')}
function renderBrainGame(){renderStub('Игра')}
function renderBrainStats(){renderStub('📊 Ум')}
function renderAntistress(){renderStub('🌬 Антистресс')}
function renderAntistressDetail(){renderStub('Практика')}
function renderSleep(){renderStub('😴 Сон')}
function renderSleepCalendar(){renderStub('📅 Календарь сна')}
function renderSleepEditor(){renderStub('Сон')}
function renderLearningGames(){renderStub('🎮 Игры')}
function renderGamePlay(){renderStub('Игра')}
function renderMaterials(){renderStub('📚 Материалы')}
function renderMaterialDetail(){renderStub('Материал')}
function renderNotifications(){renderStub('🔔 Уведомления')}
function renderSettingsV2(){renderStub('⚙️ Настройки v2')}
function renderProfileV2(){renderStub('👤 Профиль v2')}
function renderSnapshot(){renderStub('🌐 Единая картина')}
function renderRecommendations(){renderStub('💡 Рекомендации')}
function renderDailyReport(){renderStub('📊 Отчёт дня')}
function renderWeeklyReport(){renderStub('📈 Отчёт недели')}
function renderCalendarV2(){renderStub('📅 Календарь')}
function renderGamePlayReal(){renderStub('🎮 Игра')}
function renderSettings(){renderStub('⚙️ Настройки')}
function renderProfile(){renderStub('👤 Профиль')}
function renderMore(){renderMoreFinal()}

function renderStub(title){
  var app=document.getElementById('app');
  if(app)app.innerHTML='<div class="page"><div class="title-xl">'+title+'</div><div class="card"><div class="empty"><div class="empty-icon">🚧</div><div class="empty-title">Раздел в разработке</div></div></div></div>';
}
window.renderStub=renderStub;

function renderMoreFinal(){
  var groups=[
    {title:'🎓 Обучение',items:[
      {key:'learning',emoji:'🎓',label:'Обучение'},
      {key:'games',emoji:'🎮',label:'Игры'},
      {key:'materials',emoji:'📚',label:'Материалы'}
    ]},
    {title:'💪 Тело и разум',items:[
      {key:'habitList',emoji:'🔄',label:'Привычки'},
      {key:'habitCatalog',emoji:'📚',label:'Каталог привычек'},
      {key:'brain',emoji:'🧠',label:'Тренировка ума'},
      {key:'brainStats',emoji:'📊',label:'Статистика ума'},
      {key:'antistress',emoji:'🌬',label:'Антистресс'},
      {key:'sleep',emoji:'😴',label:'Сон'},
      {key:'sleepCalendar',emoji:'📅',label:'Календарь сна'}
    ]},
    {title:'📊 Отчёты',items:[
      {key:'dailyReport',emoji:'📊',label:'Отчёт дня'},
      {key:'weeklyReport',emoji:'📈',label:'Отчёт недели'},
      {key:'snapshot',emoji:'🌐',label:'Единая картина'},
      {key:'recommendations',emoji:'💡',label:'Рекомендации'}
    ]},
    {title:'🏥 Здоровье',items:[
      {key:'health',emoji:'❤️',label:'Здоровье'},
      {key:'water',emoji:'💧',label:'Вода'},
      {key:'mood',emoji:'💭',label:'Настроение'},
      {key:'workouts',emoji:'🏋️',label:'Тренировки'},
      {key:'meditation',emoji:'🧘',label:'Медитации'},
      {key:'meds',emoji:'💊',label:'Лекарства'},
      {key:'screentracker',emoji:'📱',label:'Экран'},
      {key:'detoxcourse',emoji:'📚',label:'Детокс 62 дня'}
    ]},
    {title:'📅 Планирование',items:[
      {key:'calendar',emoji:'📅',label:'Календарь'},
      {key:'tasks',emoji:'✅',label:'Задачи'},
      {key:'matrix',emoji:'🔢',label:'Матрица'},
      {key:'stats',emoji:'📊',label:'Статистика'}
    ]},
    {title:'⚙️ Система',items:[
      {key:'settingsV2',emoji:'⚙️',label:'Настройки'},
      {key:'profileV2',emoji:'👤',label:'Профиль'},
      {key:'notifications',emoji:'🔔',label:'Уведомления'},
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
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderMoreFinal=renderMoreFinal;
window.renderMore=renderMoreFinal;

console.log('[APP v43 1/4] ✅ Ядро, State, BackButton, Голос, Dashboard');
/* ============================================================
   LIFE OS — APP.js v43 — ФИНАЛ
   ЧАСТЬ 2/4: Tasks, Matrix, Learning, Habits, Brain, Antistress
   ============================================================ */

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
  html+='<div class="matrix-quadrant matrix-q1"><div class="matrix-q-title">🔥 Q1</div><div class="matrix-q-count">'+q1.length+'</div><div class="matrix-q-sub">Делай сейчас</div></div>';
  html+='<div class="matrix-quadrant matrix-q2"><div class="matrix-q-title">📌 Q2</div><div class="matrix-q-count">'+q2.length+'</div><div class="matrix-q-sub">Планируй</div></div>';
  html+='<div class="matrix-quadrant matrix-q3"><div class="matrix-q-title">⚡ Q3</div><div class="matrix-q-count">'+q3.length+'</div><div class="matrix-q-sub">Делегируй</div></div>';
  html+='<div class="matrix-quadrant matrix-q4"><div class="matrix-q-title">🗑 Q4</div><div class="matrix-q-count">'+q4.length+'</div><div class="matrix-q-sub">Удали</div></div>';
  html+='</div>';
  [['🔥 Q1 — Делай',q1],['📌 Q2 — Планируй',q2],['⚡ Q3 — Делегируй',q3],['🗑 Q4 — Удали',q4]].forEach(function(pair){
    html+='<div class="card"><h2>'+pair[0]+'</h2>';
    if(pair[1].length){pair[1].forEach(function(t){html+=taskRow(t)})}else{html+='<div class="footnote text-tertiary">Пусто</div>'}
    html+='</div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderMatrix=renderMatrix;

/* ============ РЕДАКТОР ЗАДАЧ v2 ============ */
var _clBuffer=[];
function openEntityEditor(type,id){
  if(type==='task')return openTaskEditorV2(id);
  if(type==='habit')return openHabitEditor(id);
  if(type==='meditation')return openSimpleEditor('meditation',id);
  if(type==='workout')return openSimpleEditor('workout',id);
  if(type==='med')return openSimpleEditor('med',id);
  if(type==='journal')return openSimpleEditor('journal',id);
  if(type==='note')return openSimpleEditor('note',id);
  if(type==='goal')return openSimpleEditor('goal',id);
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
  html+='<div class="field"><label class="field-label">Цвет</label><div style="display:grid;grid-template-columns:repeat(11,1fr);gap:6px;">';
  (window.TASK_COLORS||[]).forEach(function(c){
    var active=t.color===c.id;
    html+='<button type="button" data-task-color="'+c.id+'" onclick="pickTaskColor(\''+c.id+'\')" style="aspect-ratio:1;border-radius:50%;background:'+c.hex+';border:2px solid '+(active?'#fff':'transparent')+';cursor:pointer;'+(active?'box-shadow:0 0 0 2px var(--bg),0 0 0 4px #fff;':'')+'"></button>';
  });
  html+='</div><input type="hidden" id="ent-color" value="'+(t.color||'peacock')+'"/></div>';
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

function pickTaskColor(cid){
  var inp=document.getElementById('ent-color');if(inp)inp.value=cid;
  document.querySelectorAll('[data-task-color]').forEach(function(b){
    var active=b.getAttribute('data-task-color')===cid;
    b.style.border=active?'2px solid #fff':'2px solid transparent';
    b.style.boxShadow=active?'0 0 0 2px var(--bg), 0 0 0 4px #fff':'none';
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
  checkAchievements();navigate(currentPage);
}
window.saveTaskV2=saveTaskV2;
function deleteTaskV2(id){if(!confirm('Удалить?'))return;state.tasks=state.tasks.filter(function(x){return x.id!==id});save();closeSheet();navigate(currentPage)}
window.deleteTaskV2=deleteTaskV2;

/* ============ ОБУЧЕНИЕ ============ */
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
  html+='<div class="compact-item" onclick="navigate(\'etiquette\')"><span class="compact-icon">🎩</span><span>Этикет</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'hormones\')"><span class="compact-icon">🧬</span><span>Гормоны</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'wealth\')"><span class="compact-icon">💰</span><span>Богатство</span></div>';
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
  html+='</div>';
  document.getElementById('app').innerHTML=html;
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
  html+='</div>';
  document.getElementById('app').innerHTML=html;
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
  html+='<div class="card card-gradient"><div style="font-size:12px;opacity:.9;">Всего</div><div style="font-size:40px;font-weight:800;">'+lib.length+'</div></div>';
  lib.forEach(function(s){
    var isDone=state.skillsProgress[s.id];
    html+='<div class="method-card" onclick="openSkill(\''+s.id+'\')"><div class="method-header"><div class="method-emoji">'+s.emoji+'</div><div style="flex:1;"><div class="method-title">'+esc(s.title)+'</div><div class="method-cat">'+esc(s.desc||'')+'</div></div>'+(isDone?'<span class="badge badge-success">✓</span>':'<div class="list-chevron">›</div>')+'</div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
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
  html+='<div class="card card-gradient"><div style="font-size:12px;opacity:.9;">Прогресс</div><div style="font-size:40px;font-weight:800;">'+done+'/'+all.length+'</div></div>';
  var levels=['A1','A2','B1','B2','C1'];
  levels.forEach(function(lvl){
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
  html+='</div>';
  document.getElementById('app').innerHTML=html;
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

function renderPsychology(){
  var topics=window.PSYCHOLOGY_TOPICS||[];
  var html='<div class="page"><div class="title-xl">🧠 Психология</div>';
  html+='<div class="card card-gradient"><div style="font-size:40px;font-weight:800;">'+topics.length+'</div></div>';
  topics.forEach(function(t){
    var isDone=state.psychologyProgress[t.id];
    html+='<div class="method-card" onclick="openPsychology(\''+t.id+'\')"><div class="method-header"><div class="method-emoji">'+t.emoji+'</div><div style="flex:1;"><div class="method-title">'+esc(t.title)+'</div><div class="method-cat">'+esc(t.cat)+'</div></div>'+(isDone?'<span class="badge badge-success">✓</span>':'›')+'</div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderPsychology=renderPsychology;
function openPsychology(id){
  var t=(window.PSYCHOLOGY_TOPICS||[]).find(function(x){return x.id===id});if(!t)return;
  var isDone=state.psychologyProgress[id];
  var html='<div style="font-size:20px;font-weight:800;margin-bottom:12px;">'+esc(t.title)+'</div>';
  if(t.theory)html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚</div><div class="lesson-content">'+formatLesson(t.theory)+'</div></div></div>';
  if(!isDone)html+='<button class="btn btn-primary btn-block mt-3" onclick="completePsychology(\''+id+'\')">✓ Изучено</button>';
  openSheet(t.title,html);
}
window.openPsychology=openPsychology;
function completePsychology(id){state.psychologyProgress[id]=true;state.xp=(state.xp||0)+15;save();toast('✓ +15 XP','success');closeSheet();renderPsychology()}
window.completePsychology=completePsychology;

function renderThinking(){
  var topics=window.THINKING_TOPICS||[];
  var html='<div class="page"><div class="title-xl">💡 Мышление</div><div class="card card-gradient"><div style="font-size:40px;font-weight:800;">'+topics.length+'</div></div>';
  topics.forEach(function(t){
    var isDone=state.thinkingProgress[t.id];
    html+='<div class="method-card" onclick="openThinking(\''+t.id+'\')"><div class="method-header"><div class="method-emoji">'+t.emoji+'</div><div style="flex:1;"><div class="method-title">'+esc(t.title)+'</div><div class="method-cat">'+esc(t.cat)+'</div></div>'+(isDone?'<span class="badge badge-success">✓</span>':'›')+'</div></div>';
  });
  html+='</div>';document.getElementById('app').innerHTML=html;
}
window.renderThinking=renderThinking;
function openThinking(id){
  var t=(window.THINKING_TOPICS||[]).find(function(x){return x.id===id});if(!t)return;
  var isDone=state.thinkingProgress[id];
  var html='<div style="font-size:20px;font-weight:800;margin-bottom:12px;">'+esc(t.title)+'</div>';
  if(t.theory)html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚</div><div class="lesson-content">'+formatLesson(t.theory)+'</div></div></div>';
  if(!isDone)html+='<button class="btn btn-primary btn-block mt-3" onclick="completeThinking(\''+id+'\')">✓ Изучено</button>';
  openSheet(t.title,html);
}
window.openThinking=openThinking;
function completeThinking(id){state.thinkingProgress[id]=true;state.xp=(state.xp||0)+15;save();toast('✓ +15 XP','success');closeSheet();renderThinking()}
window.completeThinking=completeThinking;

function renderEtiquette(){
  var topics=window.ETIQUETTE_TOPICS||[];
  var html='<div class="page"><div class="title-xl">🎩 Этикет</div><div class="card card-gradient"><div style="font-size:40px;font-weight:800;">'+topics.length+'</div></div>';
  topics.slice(0,100).forEach(function(t){
    var isDone=state.etiquetteProgress[t.id];
    html+='<div class="method-card" onclick="openEtiquette(\''+t.id+'\')"><div class="method-header"><div class="method-emoji">'+t.emoji+'</div><div style="flex:1;"><div class="method-title">'+esc(t.title)+'</div><div class="method-cat">'+esc(t.cat)+'</div></div>'+(isDone?'<span class="badge badge-success">✓</span>':'›')+'</div></div>';
  });
  html+='</div>';document.getElementById('app').innerHTML=html;
}
window.renderEtiquette=renderEtiquette;
function openEtiquette(id){
  var t=(window.ETIQUETTE_TOPICS||[]).find(function(x){return x.id===id});if(!t)return;
  var isDone=state.etiquetteProgress[id];
  var html='<div style="font-size:20px;font-weight:800;margin-bottom:12px;">'+esc(t.title)+'</div>';
  if(t.theory)html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚</div><div class="lesson-content">'+formatLesson(t.theory)+'</div></div></div>';
  if(!isDone)html+='<button class="btn btn-primary btn-block mt-3" onclick="completeEtiquette(\''+id+'\')">✓ Изучено</button>';
  openSheet(t.title,html);
}
window.openEtiquette=openEtiquette;
function completeEtiquette(id){state.etiquetteProgress[id]=true;state.xp=(state.xp||0)+10;save();toast('✓ +10 XP','success');closeSheet();renderEtiquette()}
window.completeEtiquette=completeEtiquette;

function renderHormones(){
  var list=window.HORMONES||[];
  var html='<div class="page"><div class="title-xl">🧬 Гормоны</div><div class="card card-gradient"><div style="font-size:40px;font-weight:800;">'+list.length+'</div></div>';
  list.forEach(function(h){
    var isDone=state.hormonesProgress[h.id];
    html+='<div class="method-card" onclick="openHormone(\''+h.id+'\')"><div class="method-header"><div class="method-emoji">'+h.emoji+'</div><div style="flex:1;"><div class="method-title">'+esc(h.name)+'</div><div class="method-cat">'+esc(h.role||'')+'</div></div>'+(isDone?'<span class="badge badge-success">✓</span>':'›')+'</div></div>';
  });
  html+='</div>';document.getElementById('app').innerHTML=html;
}
window.renderHormones=renderHormones;
function openHormone(id){
  var h=(window.HORMONES||[]).find(function(x){return x.id===id});if(!h)return;
  var isDone=state.hormonesProgress[id];
  var html='<div style="font-size:20px;font-weight:800;margin-bottom:12px;">'+esc(h.name)+'</div>';
  if(h.what)html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📖 Что</div><div class="lesson-content">'+formatLesson(h.what)+'</div></div></div>';
  if(h.up)html+='<div class="card"><div class="lesson-section practice"><div class="lesson-section-title">📈 Повысить</div><div class="lesson-content"><ul>'+h.up.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul></div></div></div>';
  if(!isDone)html+='<button class="btn btn-primary btn-block mt-3" onclick="completeHormone(\''+id+'\')">✓ Изучено</button>';
  openSheet(h.name,html);
}
window.openHormone=openHormone;
function completeHormone(id){state.hormonesProgress[id]=true;state.xp=(state.xp||0)+20;save();toast('✓ +20 XP','success');closeSheet();renderHormones()}
window.completeHormone=completeHormone;

function renderWealth(){
  var list=window.WEALTH_MODULES||[];
  var html='<div class="page"><div class="title-xl">💰 Богатство</div><div class="card card-gradient"><div style="font-size:40px;font-weight:800;">'+list.length+'</div></div>';
  list.forEach(function(m){
    var isDone=state.wealthProgress[m.id];
    html+='<div class="method-card" onclick="openWealth(\''+m.id+'\')"><div class="method-header"><div class="method-emoji">'+m.emoji+'</div><div style="flex:1;"><div class="method-title">'+esc(m.title)+'</div></div>'+(isDone?'<span class="badge badge-success">✓</span>':'›')+'</div></div>';
  });
  html+='</div>';document.getElementById('app').innerHTML=html;
}
window.renderWealth=renderWealth;
function openWealth(id){
  var m=(window.WEALTH_MODULES||[]).find(function(x){return x.id===id});if(!m)return;
  var isDone=state.wealthProgress[id];
  var html='<div style="font-size:20px;font-weight:800;margin-bottom:12px;">'+esc(m.title)+'</div>';
  if(m.theory)html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚</div><div class="lesson-content">'+formatLesson(m.theory)+'</div></div></div>';
  if(!isDone)html+='<button class="btn btn-primary btn-block mt-3" onclick="completeWealth(\''+id+'\')">✓ Изучено</button>';
  openSheet(m.title,html);
}
window.openWealth=openWealth;
function completeWealth(id){state.wealthProgress[id]=true;state.xp=(state.xp||0)+15;save();toast('✓ +15 XP','success');closeSheet();renderWealth()}
window.completeWealth=completeWealth;

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
  if(!h.startDate)return{pct:0,done:0,total:66};
  var dur=h.duration||66;var total=dur;
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
  var emoji=tpl?tpl.emoji:(h.emoji||'✅');
  var title=h.title||(tpl?tpl.title:'Привычка');
  var done=isHabitDoneToday(h.id);
  var prog=getHabit66Progress(h);
  var color=(window.HABIT_CATEGORIES||[]).find(function(c){return c.id===h.category});
  var catColor=color?color.color:'#5b9eff';
  return '<div class="method-card" onclick="openHabitDetail(\''+h.id+'\')" style="border-left:3px solid '+catColor+';">'+
    '<div class="method-header"><div class="method-emoji">'+emoji+'</div>'+
    '<div style="flex:1;min-width:0;"><div class="method-title">'+esc(title)+'</div>'+
    '<div class="method-cat">🔥 '+(h.streak||0)+' · Лучший '+(h.bestStreak||0)+'</div></div>'+
    '<button class="task-checkbox '+(done?'checked':'')+'" onclick="event.stopPropagation();toggleHabitToday(\''+h.id+'\')" style="width:36px;height:36px;">'+(done?'✓':'')+'</button>'+
    '</div>'+
    '<div class="progress" style="margin-top:8px;height:5px;"><div class="progress-fill" style="width:'+prog.pct+'%;"></div></div>'+
    '<div class="footnote text-tertiary" style="margin-top:4px;">'+prog.done+'/'+prog.total+' дней ('+prog.pct+'%)</div>'+
  '</div>';
}
window.renderHabitRow=renderHabitRow;

function renderHabitCatalog(){
  var tpls=window.HABIT_TEMPLATES||[];
  var cats=window.HABIT_CATEGORIES||[];
  var html='<div class="page"><div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">📚 Каталог</div><div class="badge badge-brand">'+tpls.length+'</div></div>';
  html+='<div class="quick-tabs"><button class="quick-tab '+(habitCatFilter==='all'?'active':'')+'" onclick="habitCatFilter=\'all\';renderHabitCatalog()">Все</button>';
  cats.forEach(function(c){
    var cnt=tpls.filter(function(t){return t.cat===c.id}).length;
    html+='<button class="quick-tab '+(habitCatFilter===c.id?'active':'')+'" onclick="habitCatFilter=\''+c.id+'\';renderHabitCatalog()">'+c.emoji+' '+c.name+' ('+cnt+')</button>';
  });
  html+='</div>';
  html+='<div class="search-bar"><span style="color:var(--text-3);">🔍</span><input type="search" placeholder="Поиск..." value="'+esc(habitSearch)+'" oninput="habitSearch=this.value;renderHabitCatalog()"/></div>';
  var filtered=habitCatFilter==='all'?tpls:tpls.filter(function(t){return t.cat===habitCatFilter});
  if(habitSearch){var q=habitSearch.toLowerCase();filtered=filtered.filter(function(t){return t.title.toLowerCase().indexOf(q)>=0})}
  filtered.forEach(function(t){
    var cat=cats.find(function(c){return c.id===t.cat});
    var catColor=cat?cat.color:'#5b9eff';
    html+='<div class="method-card" style="border-left:3px solid '+catColor+';" onclick="addHabitFromTemplate(\''+t.id+'\')">';
    html+='<div class="method-header"><div class="method-emoji">'+t.emoji+'</div><div style="flex:1;"><div class="method-title">'+esc(t.title)+'</div><div class="method-cat">'+esc(t.desc||'')+'</div></div><div class="list-chevron">+</div></div></div>';
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
    duration:tpl.defaultDuration||66,
    timeSlot:tpl.defaultTime||'day',
    startDate:today(),
    microGoals:(tpl.microGoals||[]).slice(),
    streak:0,bestStreak:0,lastCompletedDate:null,
    active:true,createdAt:nowISO()
  };
  state.habits.push(newHabit);
  save();haptic('success');
  toast('✓ '+tpl.title,'success');
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
  var emoji=tpl?tpl.emoji:(h.emoji||'✅');
  var title=h.title||(tpl?tpl.title:'Привычка');
  var prog=getHabit66Progress(h);
  var done=isHabitDoneToday(h.id);
  var html='<div class="page">';
  html+='<div style="text-align:center;margin-bottom:20px;"><div style="font-size:56px;">'+emoji+'</div><div class="title-xl">'+esc(title)+'</div></div>';
  html+='<div class="card card-gradient"><div style="font-size:12px;opacity:.9;">Прогресс</div><div style="font-size:40px;font-weight:800;">'+prog.pct+'%</div><div style="font-size:12px;opacity:.9;margin-top:6px;">'+prog.done+'/'+prog.total+' дней</div></div>';
  html+='<div class="stat-grid mb-4"><div class="stat-item"><div class="stat-value">'+(h.streak||0)+'</div><div class="stat-label">Серия</div></div><div class="stat-item"><div class="stat-value">'+(h.bestStreak||0)+'</div><div class="stat-label">Лучшая</div></div><div class="stat-item"><div class="stat-value">'+prog.done+'</div><div class="stat-label">Всего</div></div></div>';
  html+='<button class="btn '+(done?'btn-success':'btn-primary')+' btn-block mb-3" onclick="toggleHabitToday(\''+h.id+'\')">'+(done?'✓ Выполнено':'Отметить')+'</button>';
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
  if(isNew)h={scheduleType:'daily',duration:66,timeSlot:'day',startDate:today(),microGoals:[]};
  var html='<div class="page"><div class="title-xl">'+(isNew?'Новая привычка':'Редактировать')+'</div>';
  html+='<div class="card">';
  html+='<div class="field"><label class="field-label">Название *</label><input type="text" id="hab-title" value="'+esc(h.title||'')+'"/></div>';
  html+='<div class="field"><label class="field-label">Эмодзи</label><input type="text" id="hab-emoji" value="'+esc(h.emoji||'✅')+'" maxlength="4"/></div>';
  html+='<div class="field"><label class="field-label">Категория</label><select id="hab-category">';
  (window.HABIT_CATEGORIES||[]).forEach(function(c){
    html+='<option value="'+c.id+'"'+(h.category===c.id?' selected':'')+'>'+c.emoji+' '+c.name+'</option>';
  });
  html+='</select></div></div>';
  html+='<div class="card"><h2>📅 Расписание</h2>';
  html+='<div class="field"><label class="field-label">Тип</label><select id="hab-schedule">';
  (window.HABIT_SCHEDULE_TYPES||[]).forEach(function(s){
    html+='<option value="'+s.id+'"'+(h.scheduleType===s.id?' selected':'')+'>'+s.emoji+' '+s.name+'</option>';
  });
  html+='</select></div></div>';
  html+='<div class="card"><h2>🎯 Цель</h2>';
  html+='<div class="field"><label class="field-label">Длительность</label><select id="hab-duration">';
  (window.HABIT_DURATIONS||[]).forEach(function(d){
    html+='<option value="'+d.id+'"'+(h.duration===d.id?' selected':'')+'>'+d.emoji+' '+d.name+'</option>';
  });
  html+='</select></div>';
  html+='<div class="field"><label class="field-label">Старт</label><input type="date" id="hab-start" value="'+(h.startDate||today())+'"/></div>';
  html+='<div class="field"><label class="field-label">Микро-цели (через запятую)</label><textarea id="hab-micro">'+esc((h.microGoals||[]).join(', '))+'</textarea></div></div>';
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
  var scheduleType=(document.getElementById('hab-schedule')||{}).value||'daily';
  var duration=parseInt((document.getElementById('hab-duration')||{}).value)||66;
  var startDate=(document.getElementById('hab-start')||{}).value||today();
  var microRaw=(document.getElementById('hab-micro')||{}).value||'';
  var microGoals=microRaw.split(',').map(function(s){return s.trim()}).filter(Boolean);
  if(currentHabitId){
    var h=getUserHabit(currentHabitId);if(!h)return;
    h.title=title.trim();h.emoji=emoji;h.category=category;h.scheduleType=scheduleType;
    h.duration=duration;h.startDate=startDate;h.microGoals=microGoals;h.updatedAt=nowISO();
  }else{
    var newH={id:uid(),title:title.trim(),emoji:emoji,category:category,scheduleType:scheduleType,
      duration:duration,startDate:startDate,microGoals:microGoals,streak:0,bestStreak:0,
      lastCompletedDate:null,active:true,createdAt:nowISO()};
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

/* ============ ТРЕНИРОВКА УМА ============ */
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
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderBrainStats=renderBrainStats;

function renderBrainGame(){renderBrain()}
window.renderBrainGame=renderBrainGame;

function startBrainGame(id){
  var g=getBrainGameById(id);if(!g)return;
  currentBrainGameId=id;
  var html='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:56px;">'+g.emoji+'</div><div style="font-size:22px;font-weight:800;">'+esc(g.title)+'</div><div class="footnote text-secondary">'+esc(g.desc||'')+'</div></div>';
  html+='<div class="card"><h2>Результат</h2>';
  html+='<div class="field"><label class="field-label">Очки (0-100)</label><input type="number" id="bg-score" value="50" min="0" max="100"/></div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="finishBrainGame()">✓ Записать (+10 XP)</button></div>';
  openSheet(g.title,html);
}
window.startBrainGame=startBrainGame;
function finishBrainGame(){
  if(!currentBrainGameId)return;
  var score=parseInt((document.getElementById('bg-score')||{}).value)||0;
  var g=getBrainGameById(currentBrainGameId);
  recordBrainPlay(currentBrainGameId,score,g?g.duration:60,null);
  haptic('success');toast('✓ +10 XP','success');
  closeSheet();currentBrainGameId=null;
  renderBrain();
}
window.finishBrainGame=finishBrainGame;

/* ============ АНТИСТРЕСС ============ */
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
  html+='</div>';
  document.getElementById('app').innerHTML=html;
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

console.log('[APP v43 2/4] ✅ Tasks, Matrix, Learning, Habits, Brain, Antistress');
/* ============================================================
   LIFE OS — APP.js v43 — ФИНАЛ
   ЧАСТЬ 3/4: Сон, Календарь v2, Отчёты, Snapshot, Рекомендации
   ============================================================ */

/* ============ СОН ============ */
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

function getSleepEntryForDate(date){
  if(!date)date=today();
  return (state.sleepEntries||[]).find(function(s){return s.date===date});
}
window.getSleepEntryForDate=getSleepEntryForDate;

function getNightSleepLast(days){
  days=days||7;
  var arr=[],now=new Date();
  for(var i=days-1;i>=0;i--){
    var d=new Date(now);d.setDate(d.getDate()-i);
    var iso=_sleepDateKey(d);
    var e=getSleepEntryForDate(iso);
    if(e&&e.type==='night')arr.push(e);
  }
  return arr;
}
function getAvgSleep(days){
  days=days||7;
  var arr=getNightSleepLast(days);
  if(!arr.length)return null;
  var sum=0;arr.forEach(function(s){sum+=s.hours||0});
  return Math.round(sum/arr.length*10)/10;
}
window.getAvgSleep=getAvgSleep;

function renderSleep(){
  var lastEntry=(state.sleepEntries||[]).slice(-1)[0];
  var avg7=getAvgSleep(7);
  var avg30=getAvgSleep(30);
  var html='<div class="page">';
  html+='<div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">😴 Сон</div>';
  html+='<button class="btn btn-ghost btn-sm" onclick="navigate(\'sleepCalendar\')">📅</button></div>';
  html+='<div class="card card-gradient">';
  if(lastEntry){
    html+='<div style="font-size:12px;opacity:.9;">Последняя ночь</div>';
    html+='<div style="font-size:40px;font-weight:800;">'+lastEntry.hours+' ч</div>';
    html+='<div style="font-size:12px;opacity:.9;margin-top:6px;">'+lastEntry.date+' · качество '+lastEntry.quality+'/10</div>';
  }else{
    html+='<div style="font-size:16px;font-weight:800;">Добавь первую запись</div>';
  }
  html+='</div>';
  html+='<button class="btn btn-primary btn-block mb-3" onclick="currentSleepDate=today();navigate(\'sleepEditor\')">➕ Записать сон</button>';
  html+='<div class="stat-grid mb-4">';
  html+='<div class="stat-item"><div class="stat-value">'+(avg7!==null?avg7+'ч':'—')+'</div><div class="stat-label">Среднее 7д</div></div>';
  html+='<div class="stat-item"><div class="stat-value">'+(avg30!==null?avg30+'ч':'—')+'</div><div class="stat-label">30д</div></div>';
  html+='<div class="stat-item"><div class="stat-value">'+(state.sleepEntries||[]).length+'</div><div class="stat-label">Всего</div></div>';
  html+='</div>';
  /* График 7 дней */
  var last7=[];
  for(var i=6;i>=0;i--){
    var d=new Date();d.setDate(d.getDate()-i);
    var iso=_sleepDateKey(d);
    var e=getSleepEntryForDate(iso);
    last7.push({day:['Вс','Пн','Вт','Ср','Чт','Пт','Сб'][d.getDay()],hours:e?e.hours:0});
  }
  var maxH=Math.max.apply(null,last7.map(function(x){return x.hours}).concat([9]));
  html+='<div class="card"><h2>📊 7 ночей</h2><div style="display:flex;gap:4px;align-items:flex-end;height:140px;padding:10px 0;">';
  last7.forEach(function(x){
    var pct=maxH?(x.hours/maxH*100):0;
    var color=x.hours>=7&&x.hours<=9?'var(--success)':x.hours>=6?'var(--warning)':'var(--danger)';
    html+='<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;">';
    html+='<div style="font-size:9px;color:var(--text-3);margin-bottom:4px;">'+(x.hours||'—')+'</div>';
    html+='<div style="width:100%;height:'+Math.max(2,pct)+'%;background:'+color+';border-radius:6px 6px 0 0;min-height:4px;"></div>';
    html+='<div style="font-size:10px;font-weight:700;color:var(--text-2);margin-top:4px;">'+x.day+'</div></div>';
  });
  html+='</div></div>';
  html+='<div class="compact-grid">';
  html+='<div class="compact-item" onclick="navigate(\'sleepCalendar\')"><span class="compact-icon">📅</span><span>Календарь</span></div>';
  html+='<div class="compact-item" onclick="openSleepQuickAdd()"><span class="compact-icon">⚡</span><span>Быстро</span></div>';
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
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
  html+='<div class="footnote text-secondary mb-3">🟢 7-9ч · 🟡 6-7ч · 🔴 <6ч · ⚪ нет</div>';
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

function openSleepForDate(iso){
  currentSleepDate=iso;
  navigate('sleepEditor');
}
window.openSleepForDate=openSleepForDate;

function renderSleepEditor(){
  var date=currentSleepDate||today();
  var e=getSleepEntryForDate(date);
  var isNew=!e;
  if(isNew)e={date:date,type:'night',start:'23:00',end:'07:00',hours:8,quality:7,notes:'',awakenings:0,disruptions:[],improvements:[],daytimeEffects:[],daytimeFactors:[],resetFactors:[]};

  var html='<div class="page"><div class="title-xl">'+(isNew?'Запись сна':'Сон: '+date)+'</div>';
  html+='<div class="card">';
  html+='<div class="field"><label class="field-label">Дата</label><input type="date" id="sl-date" value="'+date+'"/></div>';
  html+='<div class="field"><label class="field-label">Тип</label><select id="sl-type"><option value="night"'+(e.type==='night'?' selected':'')+'>🌙 Ночной</option><option value="nap"'+(e.type==='nap'?' selected':'')+'>☀️ Дневной</option></select></div>';
  html+='<div class="row" style="gap:8px;">';
  html+='<div style="flex:1;"><label class="field-label">Лёг</label><input type="time" id="sl-start" value="'+e.start+'"/></div>';
  html+='<div style="flex:1;"><label class="field-label">Встал</label><input type="time" id="sl-end" value="'+e.end+'"/></div></div>';
  html+='<div class="field"><label class="field-label">Пробуждений</label><input type="number" id="sl-awaken" value="'+(e.awakenings||0)+'" min="0"/></div>';
  html+='</div>';
  html+='<div class="card"><h2>✨ Качество</h2>';
  html+='<div style="text-align:center;padding:6px 0;"><div id="sl-q-display" style="font-size:44px;font-weight:800;color:var(--brand);">'+e.quality+'/10</div></div>';
  html+='<input type="range" min="1" max="10" value="'+e.quality+'" style="width:100%;margin:10px 0;" oninput="document.getElementById(\'sl-q-display\').textContent=this.value+\'/10\';document.getElementById(\'sl-quality-value\').value=this.value;"/>';
  html+='<input type="hidden" id="sl-quality-value" value="'+e.quality+'"/>';
  html+='</div>';
  /* Мешало */
  html+='<div class="card"><h2>🚫 Что мешало</h2><div style="display:flex;flex-wrap:wrap;gap:6px;">';
  (window.SLEEP_DISRUPTIONS||[]).forEach(function(d){
    var active=(e.disruptions||[]).indexOf(d.id)>=0;
    html+='<button class="btn '+(active?'btn-primary':'btn-ghost')+' btn-sm" onclick="this.classList.toggle(\'active\');this.classList.toggle(\'btn-primary\');this.classList.toggle(\'btn-ghost\')">'+d.emoji+' '+d.label+'</button>';
  });
  html+='</div></div>';
  /* Помогло */
  html+='<div class="card"><h2>✅ Что помогло</h2><div style="display:flex;flex-wrap:wrap;gap:6px;">';
  (window.SLEEP_IMPROVEMENTS||[]).forEach(function(d){
    var active=(e.improvements||[]).indexOf(d.id)>=0;
    html+='<button class="btn '+(active?'btn-primary':'btn-ghost')+' btn-sm" onclick="this.classList.toggle(\'active\');this.classList.toggle(\'btn-primary\');this.classList.toggle(\'btn-ghost\')">'+d.emoji+' '+d.label+'</button>';
  });
  html+='</div></div>';
  /* Заметки */
  html+='<div class="card"><h2>📝 Заметка</h2><textarea id="sl-notes" style="min-height:80px;">'+esc(e.notes||'')+'</textarea></div>';
  html+='<button class="btn btn-primary btn-block mb-2" onclick="saveSleepEntry()">💾 '+(isNew?'Сохранить':'Обновить')+'</button>';
  if(!isNew)html+='<button class="btn btn-danger btn-block" onclick="deleteSleepEntry(\''+date+'\')">🗑 Удалить</button>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderSleepEditor=renderSleepEditor;

function saveSleepEntry(){
  var date=(document.getElementById('sl-date')||{}).value||today();
  var type=(document.getElementById('sl-type')||{}).value||'night';
  var start=(document.getElementById('sl-start')||{}).value||'23:00';
  var end=(document.getElementById('sl-end')||{}).value||'07:00';
  var hours=calcSleepHours(start,end);
  var quality=parseInt((document.getElementById('sl-quality-value')||{}).value)||7;
  var awakenings=parseInt((document.getElementById('sl-awaken')||{}).value)||0;
  var notes=(document.getElementById('sl-notes')||{}).value||'';
  /* Чипы */
  var disruptions=[], improvements=[];
  document.querySelectorAll('.card').forEach(function(card){
    var h=card.querySelector('h2');
    if(!h)return;
    var txt=h.textContent;
    card.querySelectorAll('button.active').forEach(function(b){
      var id=null;
      (window.SLEEP_DISRUPTIONS||[]).forEach(function(x){if(b.textContent.indexOf(x.label)>=0)id=x.id});
      (window.SLEEP_IMPROVEMENTS||[]).forEach(function(x){if(b.textContent.indexOf(x.label)>=0)id=x.id});
      if(id){
        if(txt.indexOf('мешало')>=0)disruptions.push(id);
        if(txt.indexOf('помогло')>=0)improvements.push(id);
      }
    });
  });
  var entry={
    id:getSleepEntryForDate(date)?getSleepEntryForDate(date).id:uid(),
    date:date,type:type,start:start,end:end,hours:hours,
    quality:quality,awakenings:awakenings,notes:notes,
    disruptions:disruptions,improvements:improvements,
    daytimeEffects:[],daytimeFactors:[],resetFactors:[],
    createdAt:nowISO()
  };
  var idx=state.sleepEntries.findIndex(function(s){return s.date===date});
  if(idx>=0)state.sleepEntries[idx]=entry;
  else state.sleepEntries.push(entry);
  state.xp=(state.xp||0)+5;
  save();haptic('success');
  toast('✓ '+hours+' ч','success');
  currentSleepDate=null;
  navigate('sleep');
}
window.saveSleepEntry=saveSleepEntry;

function deleteSleepEntry(date){
  if(!confirm('Удалить?'))return;
  state.sleepEntries=state.sleepEntries.filter(function(s){return s.date!==date});
  save();toast('Удалено','info');
  currentSleepDate=null;navigate('sleep');
}
window.deleteSleepEntry=deleteSleepEntry;

function openSleepQuickAdd(){
  var html='<div class="field"><label class="field-label">Дата</label><input type="date" id="qsl-date" value="'+today()+'"/></div>';
  html+='<div class="row" style="gap:8px;"><div style="flex:1;"><label class="field-label">Лёг</label><input type="time" id="qsl-start" value="23:00"/></div><div style="flex:1;"><label class="field-label">Встал</label><input type="time" id="qsl-end" value="07:00"/></div></div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="quickSaveSleep()">💾</button>';
  openSheet('Быстрая запись',html);
}
window.openSleepQuickAdd=openSleepQuickAdd;

function quickSaveSleep(){
  var date=(document.getElementById('qsl-date')||{}).value||today();
  var start=(document.getElementById('qsl-start')||{}).value||'23:00';
  var end=(document.getElementById('qsl-end')||{}).value||'07:00';
  var hours=calcSleepHours(start,end);
  var entry={id:uid(),date:date,type:'night',start:start,end:end,hours:hours,quality:7,awakenings:0,notes:'',disruptions:[],improvements:[],daytimeEffects:[],daytimeFactors:[],resetFactors:[],createdAt:nowISO()};
  var idx=state.sleepEntries.findIndex(function(s){return s.date===date});
  if(idx>=0)state.sleepEntries[idx]=entry;else state.sleepEntries.push(entry);
  state.xp=(state.xp||0)+5;
  save();toast('✓ '+hours+' ч','success');closeSheet();renderSleep();
}
window.quickSaveSleep=quickSaveSleep;

/* ============ КАЛЕНДАРЬ v2 ============ */
var CAL_COLORS=[
  {id:'tomato',hex:'#d50000',name:'Помидор'},{id:'flamingo',hex:'#e67c73',name:'Фламинго'},
  {id:'tangerine',hex:'#f4511e',name:'Мандарин'},{id:'banana',hex:'#f6bf26',name:'Банан'},
  {id:'sage',hex:'#33b679',name:'Шалфей'},{id:'basil',hex:'#0b8043',name:'Базилик'},
  {id:'peacock',hex:'#039be5',name:'Павлин'},{id:'blueberry',hex:'#3f51b5',name:'Черника'},
  {id:'lavender',hex:'#7986cb',name:'Лаванда'},{id:'grape',hex:'#8e24aa',name:'Виноград'},
  {id:'graphite',hex:'#616161',name:'Графит'}
];
window.CAL_COLORS=CAL_COLORS;

function calColorHex(id){var c=CAL_COLORS.find(function(x){return x.id===id});return c?c.hex:'#5b9eff'}
function calEventsOnDate(iso){
  return (state.calendarEvents||[]).filter(function(ev){
    var s=(ev.start||'').slice(0,10), e=(ev.end||ev.start||'').slice(0,10);
    if(s&&e&&s!==e)return iso>=s&&iso<=e;
    return s===iso;
  });
}
function tasksOnDate(iso){
  return (state.tasks||[]).filter(function(t){
    return (t.due_date&&t.due_date.slice(0,10)===iso)||(t.start_date&&t.start_date.slice(0,10)===iso);
  });
}
function habitsCompletedOnDate(iso){
  var arr=[];
  (state.habits||[]).forEach(function(h){
    if(state.habitHistory&&state.habitHistory[h.id]&&state.habitHistory[h.id][iso]&&state.habitHistory[h.id][iso].completed)arr.push(h);
  });
  return arr;
}

function renderCalendarV2(){
  var y=CAL_CURSOR.getFullYear(), m=CAL_CURSOR.getMonth();
  var first=new Date(y,m,1), offset=first.getDay()===0?6:first.getDay()-1;
  var daysInMonth=new Date(y,m+1,0).getDate();
  var todayISO=today();

  var html='<div class="page"><div class="title-xl">📅 Календарь</div>';
  html+='<div class="cal-toolbar">';
  html+='<button class="cal-nav-btn" onclick="CAL_CURSOR=new Date('+y+','+(m-1)+',1);renderCalendarV2()">‹</button>';
  html+='<button class="cal-today-btn" onclick="CAL_CURSOR=new Date();renderCalendarV2()">Сегодня</button>';
  html+='<button class="cal-nav-btn" onclick="CAL_CURSOR=new Date('+y+','+(m+1)+',1);renderCalendarV2()">›</button>';
  html+='<div class="cal-title">'+['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'][m]+' '+y+'</div>';
  html+='</div>';
  html+='<button class="btn btn-primary btn-block mb-3" onclick="openEventEditor(null)">➕ Новое событие</button>';
  html+='<div class="cal-month"><div class="cal-month-head">';
  ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].forEach(function(d){html+='<div class="cal-month-head-cell">'+d+'</div>'});
  html+='</div><div class="cal-month-grid">';
  for(var i=offset-1;i>=0;i--)html+='<div class="cal-month-cell cal-other-month"></div>';
  for(var d=1;d<=daysInMonth;d++){
    var iso=y+'-'+pad(m+1)+'-'+pad(d);
    var evs=calEventsOnDate(iso);
    var tsks=tasksOnDate(iso);
    var habs=habitsCompletedOnDate(iso);
    var sleepE=getSleepEntryForDate(iso);
    var dots='';
    evs.slice(0,2).forEach(function(ev){dots+='<div class="cal-event-dot" style="background:'+calColorHex(ev.color)+'"></div>'});
    tsks.slice(0,2).forEach(function(t){
      var tc=t.color?calColorHex(t.color):'#5b9eff';
      dots+='<div class="cal-event-dot" style="background:'+tc+';border-radius:2px;"></div>';
    });
    if(habs.length)dots+='<div class="cal-event-dot" style="background:#3ddc97"></div>';
    if(sleepE)dots+='<div class="cal-event-dot" style="background:#4dd4ff"></div>';
    html+='<div class="cal-month-cell'+(iso===todayISO?' cal-today':'')+'" onclick="openCalendarDay(\''+iso+'\')"><div class="cal-day-num">'+d+'</div><div class="cal-day-events">'+dots+'</div></div>';
  }
  var total=offset+daysInMonth, rem=(7-(total%7))%7;
  for(var n=1;n<=rem;n++)html+='<div class="cal-month-cell cal-other-month"></div>';
  html+='</div></div>';
  html+='<div class="footnote text-secondary mt-3" style="text-align:center;">🟦 события · ▪️ задачи · 🟢 привычки · 🔵 сон</div>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderCalendarV2=renderCalendarV2;

function openCalendarDay(iso){
  var evs=calEventsOnDate(iso), tsks=tasksOnDate(iso), habs=habitsCompletedOnDate(iso), sleepE=getSleepEntryForDate(iso);
  var html='<div class="footnote text-secondary mb-3">'+iso+'</div>';
  if(evs.length){
    html+='<h3 style="font-size:14px;font-weight:800;margin:12px 0 6px;">📌 События</h3>';
    evs.forEach(function(ev){
      html+='<div class="list-row" onclick="closeSheet();openEventEditor(\''+ev.id+'\')"><div class="list-icon" style="background:'+calColorHex(ev.color)+'20;">📌</div><div class="list-body"><div class="list-title">'+esc(ev.title)+'</div><div class="list-subtitle">'+(ev.start?ev.start.slice(11,16):'Весь день')+'</div></div></div>';
    });
  }
  if(tsks.length){
    html+='<h3 style="font-size:14px;font-weight:800;margin:12px 0 6px;">✅ Задачи</h3>';
    tsks.forEach(function(t){
      html+='<div class="list-row" onclick="closeSheet();openEntityEditor(\'task\',\''+t.id+'\')"><div class="list-icon">'+(t.status==='completed'?'✓':'○')+'</div><div class="list-body"><div class="list-title">'+esc(t.title)+'</div></div></div>';
    });
  }
  if(habs.length){
    html+='<h3 style="font-size:14px;font-weight:800;margin:12px 0 6px;">🔄 Привычки</h3>';
    habs.forEach(function(h){
      html+='<div class="list-row"><div class="list-icon">'+(h.emoji||'✅')+'</div><div class="list-body"><div class="list-title">'+esc(h.title||'Привычка')+'</div></div></div>';
    });
  }
  if(sleepE){
    html+='<h3 style="font-size:14px;font-weight:800;margin:12px 0 6px;">😴 Сон</h3>';
    html+='<div class="list-row"><div class="list-icon">😴</div><div class="list-body"><div class="list-title">'+sleepE.hours+' ч</div><div class="list-subtitle">'+sleepE.start+' → '+sleepE.end+' · '+sleepE.quality+'/10</div></div></div>';
  }
  if(!evs.length&&!tsks.length&&!habs.length&&!sleepE)html+='<div class="empty"><div class="empty-icon">📅</div><div class="empty-title">Пусто</div></div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="closeSheet();openEventEditor(null,\''+iso+'\')">➕ Добавить событие</button>';
  openSheet('День',html);
}
window.openCalendarDay=openCalendarDay;

function openEventEditor(id,dateISO){
  var ev=id?(state.calendarEvents||[]).find(function(x){return x.id===id}):null;
  var isNew=!ev;
  var now=new Date();
  var defStart=dateISO?dateISO+'T12:00':(now.getFullYear()+'-'+pad(now.getMonth()+1)+'-'+pad(now.getDate())+'T12:00');
  var title=ev?ev.title:'';var start=ev?ev.start:defStart;
  var end=ev?ev.end:'';var color=ev?ev.color:'peacock';var desc=ev?ev.description:'';
  var html='';
  html+='<div class="field"><label class="field-label">Название</label><input type="text" id="cev-title" value="'+esc(title)+'"/></div>';
  html+='<div class="field"><label class="field-label">Описание</label><textarea id="cev-desc">'+esc(desc)+'</textarea></div>';
  html+='<div class="field"><label class="field-label">Начало</label><input type="datetime-local" id="cev-start" value="'+(start||'').slice(0,16)+'"/></div>';
  html+='<div class="field"><label class="field-label">Конец</label><input type="datetime-local" id="cev-end" value="'+(end||'').slice(0,16)+'"/></div>';
  html+='<div class="field"><label class="field-label">Цвет</label><div class="cal-color-picker">';
  CAL_COLORS.forEach(function(c){html+='<button type="button" class="cal-color-btn'+(c.id===color?' active':'')+'" data-color="'+c.id+'" onclick="calPickColor(\''+c.id+'\')" style="background:'+c.hex+'"></button>'});
  html+='</div><input type="hidden" id="cev-color" value="'+color+'"/></div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="saveEvent('+(id?'\''+id+'\'':'null')+')">'+(isNew?'➕ Создать':'💾 Сохранить')+'</button>';
  if(!isNew)html+='<button class="btn btn-danger btn-block mt-2" onclick="deleteEvent(\''+id+'\')">🗑 Удалить</button>';
  openSheet(isNew?'Новое событие':'Событие',html);
}
window.openEventEditor=openEventEditor;

function calPickColor(cid){
  var inp=document.getElementById('cev-color');if(inp)inp.value=cid;
  document.querySelectorAll('.cal-color-btn').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-color')===cid)});
}
window.calPickColor=calPickColor;

function saveEvent(id){
  var title=(document.getElementById('cev-title')||{}).value||'';
  if(!title.trim())return toast('Введи название','error');
  var desc=(document.getElementById('cev-desc')||{}).value||'';
  var start=(document.getElementById('cev-start')||{}).value||'';
  var end=(document.getElementById('cev-end')||{}).value||'';
  var color=(document.getElementById('cev-color')||{}).value||'peacock';
  if(!start)return toast('Укажи начало','error');
  if(!state.calendarEvents)state.calendarEvents=[];
  if(id){
    var ev=state.calendarEvents.find(function(x){return x.id===id});if(!ev)return;
    ev.title=title;ev.description=desc;ev.start=start;ev.end=end;ev.color=color;ev.updatedAt=nowISO();
  }else{
    state.calendarEvents.push({id:uid(),title:title,description:desc,start:start,end:end,color:color,createdAt:nowISO()});
  }
  save();haptic('success');closeSheet();toast('✓','success');navigate('calendar');
}
window.saveEvent=saveEvent;
function deleteEvent(id){if(!confirm('Удалить?'))return;state.calendarEvents=state.calendarEvents.filter(function(x){return x.id!==id});save();closeSheet();navigate('calendar')}
window.deleteEvent=deleteEvent;

/* ============ ОТЧЁТЫ ============ */
function renderDailyReport(){
  var date=currentReportDate||today();
  var snap=state.snapshot;
  if(!snap||snap.date!==date){
    try{snap=buildUserSnapshot(state)}catch(e){}
  }
  var score=snap?calcDayScore(snap):{value:0,label:'Нет данных'};
  var html='<div class="page">';
  html+='<div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">📊 Отчёт дня</div>';
  html+='<button class="btn btn-ghost btn-sm" onclick="navigate(\'weeklyReport\')">📈 Неделя</button></div>';
  html+='<div class="card card-gradient"><div style="font-size:12px;opacity:.9;">'+date+'</div>';
  html+='<div style="font-size:56px;font-weight:800;line-height:1;">'+score.value+'</div>';
  html+='<div style="font-size:14px;opacity:.95;margin-top:6px;">'+score.label+'</div></div>';
  if(!snap){
    html+='<div class="card"><div class="empty"><div class="empty-icon">⏳</div><div class="empty-title">Считаем...</div></div></div></div>';
    document.getElementById('app').innerHTML=html;return;
  }
  html+='<div class="card"><h2>📋 Итоги</h2>';
  html+=reportRow('🔄 Привычки',snap.habits.completedToday+'/'+snap.habits.total,snap.habits.total?(snap.habits.completedToday/snap.habits.total*100):0);
  html+=reportRow('😴 Сон',snap.sleep.lastNight?snap.sleep.lastNight.hours+' ч':'—',snap.sleep.lastNight?Math.min(100,snap.sleep.lastNight.hours/8*100):0);
  html+=reportRow('📱 Экран',snap.screen.today?Math.round(snap.screen.today/60)+' ч':'0 ч',snap.screen.today?Math.max(0,100-snap.screen.today/420*100):100);
  html+=reportRow('✅ Задачи',snap.tasks.completedToday+' / '+snap.tasks.pending,(snap.tasks.completedToday+snap.tasks.pending)?(snap.tasks.completedToday/(snap.tasks.completedToday+snap.tasks.pending)*100):0);
  html+=reportRow('💧 Вода',snap.water.today+'/'+snap.water.goal,snap.water.goal?(snap.water.today/snap.water.goal*100):0);
  html+=reportRow('❤️ Настроение',snap.mood.today!==null?snap.mood.today+'/10':'—',snap.mood.today!==null?snap.mood.today*10:0);
  html+=reportRow('🧠 Ум',snap.brain.todayPlays+' игр',Math.min(100,snap.brain.todayPlays*20));
  html+=reportRow('🌬 Антистресс',snap.antistress.todayCount+' практик',Math.min(100,snap.antistress.todayCount*25));
  html+='</div>';
  if(snap.recommendations&&snap.recommendations.length){
    html+='<div class="card"><h2>💡 Что улучшить</h2>';
    snap.recommendations.slice(0,3).forEach(function(r){
      html+='<div style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid var(--divider);"><div style="font-size:20px;">'+r.emoji+'</div><div style="flex:1;"><div style="font-weight:700;font-size:13px;">'+esc(r.title)+'</div><div class="footnote text-secondary">'+esc(r.text)+'</div></div></div>';
    });
    html+='</div>';
  }
  html+='<div class="row" style="gap:8px;"><button class="btn btn-ghost" style="flex:1;" onclick="exportDayReport(\''+date+'\')">📤 Экспорт</button>';
  html+='<button class="btn btn-primary" style="flex:1;" onclick="navigate(\'weeklyReport\')">📈 Неделя</button></div>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderDailyReport=renderDailyReport;

function reportRow(label,value,pct){
  pct=Math.max(0,Math.min(100,pct||0));
  return '<div style="margin-bottom:10px;"><div class="row-between" style="font-size:13px;font-weight:700;margin-bottom:4px;"><span>'+label+'</span><span>'+value+'</span></div><div class="progress"><div class="progress-fill" style="width:'+pct+'%;"></div></div></div>';
}

function renderWeeklyReport(){
  var days=getLast7DaysData();
  var avgScore=Math.round(days.reduce(function(a,d){return a+d.score},0)/days.length);
  var best=days.reduce(function(a,d){return d.score>a.score?d:a},days[0]);
  var worst=days.reduce(function(a,d){return d.score<a.score?d:a},days[0]);
  var html='<div class="page">';
  html+='<div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">📈 Отчёт недели</div>';
  html+='<button class="btn btn-ghost btn-sm" onclick="navigate(\'dailyReport\')">📊 День</button></div>';
  html+='<div class="card card-gradient"><div style="font-size:12px;opacity:.9;">Средний балл</div>';
  html+='<div style="font-size:56px;font-weight:800;line-height:1;">'+avgScore+'</div>';
  html+='<div style="font-size:14px;opacity:.95;margin-top:6px;">'+(avgScore>=85?'🌟 Отличная неделя!':avgScore>=70?'😊 Хорошая':avgScore>=50?'🙂 Средняя':'😐 Слабая')+'</div></div>';
  html+='<div class="card"><h2>📊 По дням</h2><div style="display:flex;gap:4px;align-items:flex-end;height:160px;padding:10px 0;">';
  var maxS=Math.max.apply(null,days.map(function(d){return d.score}).concat([1]));
  days.forEach(function(d){
    var pct=d.score/maxS*100;
    var color=d.score>=70?'var(--success)':d.score>=50?'var(--warning)':'var(--danger)';
    html+='<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;">';
    html+='<div style="font-size:9px;color:var(--text-3);margin-bottom:4px;">'+d.score+'</div>';
    html+='<div style="width:100%;height:'+Math.max(3,pct)+'%;background:'+color+';border-radius:6px 6px 0 0;min-height:4px;"></div>';
    html+='<div style="font-size:10px;font-weight:700;color:var(--text-2);margin-top:4px;">'+d.day+'</div></div>';
  });
  html+='</div></div>';
  html+='<div class="stat-grid mb-4">';
  html+='<div class="stat-item"><div class="stat-value">'+best.score+'</div><div class="stat-label">Лучший '+best.day+'</div></div>';
  html+='<div class="stat-item"><div class="stat-value">'+worst.score+'</div><div class="stat-label">Худший '+worst.day+'</div></div>';
  html+='<div class="stat-item"><div class="stat-value">'+(state.stats.streak||0)+'</div><div class="stat-label">Streak</div></div></div>';
  html+='<div class="card"><h2>📈 Тренды</h2>';
  html+=trendRow('😴 Сон',days,'sleep',8,'ч',false);
  html+=trendRow('📱 Экран',days,'screen',180,'мин',true);
  html+=trendRow('💧 Вода',days,'water',8,'ст',false);
  html+=trendRow('✅ Задачи',days,'tasksDone',5,'шт',false);
  html+=trendRow('❤️ Настроение',days,'mood',7,'/10',false);
  html+=trendRow('🔄 Привычки',days,'habitsDone',5,'шт',false);
  html+='</div>';
  var weeklyRecs=generateWeeklyRecommendations(days);
  if(weeklyRecs.length){
    html+='<div class="card"><h2>💡 На следующую неделю</h2>';
    weeklyRecs.forEach(function(r){
      html+='<div style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid var(--divider);"><div style="font-size:20px;">'+r.emoji+'</div><div style="flex:1;"><div style="font-weight:700;font-size:13px;">'+esc(r.title)+'</div><div class="footnote text-secondary">'+esc(r.text)+'</div></div></div>';
    });
    html+='</div>';
  }
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderWeeklyReport=renderWeeklyReport;

function getLast7DaysData(){
  var arr=[],now=new Date();
  for(var i=6;i>=0;i--){
    var d=new Date(now);d.setDate(now.getDate()-i);
    var iso=d.toISOString().slice(0,10);
    var dayNames=['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
    var habitsDone=0;
    if(state.habitHistory){
      Object.keys(state.habitHistory).forEach(function(hid){
        if(state.habitHistory[hid][iso]&&state.habitHistory[hid][iso].completed)habitsDone++;
      });
    }
    var sleepEntry=(state.sleepEntries||[]).find(function(s){return s.date===iso});
    var screen=(state.screenStats||{})[iso]||0;
    var water=(state.customWater||[]).find(function(w){return w.date===iso});
    var mood=(state.customMood||[]).find(function(m){return m.date===iso});
    var tasksDone=(state.tasks||[]).filter(function(t){return t.completedAt&&t.completedAt.slice(0,10)===iso}).length;
    var parts=[],sumW=0,sumV=0;
    function addP(w,v){parts.push({w:w,v:v});sumW+=w;sumV+=w*v}
    if(habitsDone)addP(25,Math.min(100,habitsDone*20));
    if(sleepEntry)addP(20,Math.min(100,sleepEntry.hours/8*100));
    if(screen)addP(15,Math.max(0,100-screen/420*100));
    if(mood)addP(15,mood.score*10);
    if(water)addP(10,Math.min(100,water.count/8*100));
    if(tasksDone)addP(5,Math.min(100,tasksDone*20));
    var score=sumW?Math.round(sumV/sumW):0;
    arr.push({date:iso,day:dayNames[d.getDay()],score:score,habitsDone:habitsDone,sleep:sleepEntry?sleepEntry.hours:null,screen:screen,water:water?water.count:0,mood:mood?mood.score:null,tasksDone:tasksDone});
  }
  return arr;
}

function trendRow(label,days,key,target,unit,reverse){
  var vals=days.map(function(d){return d[key]}).filter(function(v){return v!==null&&v!==undefined&&v>0});
  if(!vals.length)return '<div class="stat-row"><span class="stat-row-label">'+label+'</span><span class="stat-row-value">—</span></div>';
  var avg=vals.reduce(function(a,v){return a+v},0)/vals.length;
  var pct=Math.min(100,avg/target*100);
  var trend='';
  if(vals.length>=2){
    var half=Math.floor(vals.length/2);
    var h1=vals.slice(0,half), h2=vals.slice(half);
    var a1=h1.reduce(function(a,v){return a+v},0)/h1.length;
    var a2=h2.reduce(function(a,v){return a+v},0)/h2.length;
    var diff=a2-a1;
    var good=reverse?diff<0:diff>0;
    if(Math.abs(diff)>0.05)trend=good?' 📈':' 📉';
  }
  return '<div style="margin-bottom:10px;"><div class="row-between" style="font-size:13px;font-weight:700;margin-bottom:4px;"><span>'+label+trend+'</span><span>'+Math.round(avg*10)/10+unit+'</span></div><div class="progress"><div class="progress-fill" style="width:'+pct+'%;"></div></div></div>';
}

function generateWeeklyRecommendations(days){
  var recs=[];
  var avgSleep=0,cS=0;days.forEach(function(d){if(d.sleep){avgSleep+=d.sleep;cS++}});
  if(cS)avgSleep/=cS;
  if(cS&&avgSleep<7)recs.push({emoji:'😴',title:'Сон меньше 7 часов',text:'Средний сон '+Math.round(avgSleep*10)/10+' ч. Ложись раньше.'});
  var avgScreen=0,cSc=0;days.forEach(function(d){if(d.screen>0){avgScreen+=d.screen;cSc++}});
  if(cSc)avgScreen/=cSc;
  if(cSc&&avgScreen>180)recs.push({emoji:'📱',title:'Много экрана',text:'Средний экран '+Math.round(avgScreen/60*10)/10+' ч в день.'});
  var avgMood=0,cM=0;days.forEach(function(d){if(d.mood){avgMood+=d.mood;cM++}});
  if(cM)avgMood/=cM;
  if(cM&&avgMood<5)recs.push({emoji:'❤️',title:'Настроение ниже среднего',text:'Средний уровень '+Math.round(avgMood*10)/10+'/10.'});
  return recs;
}

function calcDayScore(snap){
  if(!snap)return{value:0,label:'Нет данных'};
  var parts=[],sumW=0,sumV=0;
  function addP(w,v){parts.push({w:w,v:v});sumW+=w;sumV+=w*v}
  if(snap.habits.total)addP(25,snap.habits.completedToday/snap.habits.total*100);
  if(snap.sleep.lastNight)addP(20,Math.min(100,snap.sleep.lastNight.hours/8*100));
  addP(15,Math.max(0,100-Math.min(100,snap.screen.today/420*100)));
  if(snap.mood.today!==null)addP(15,snap.mood.today*10);
  addP(10,Math.min(100,snap.water.today/snap.water.goal*100));
  addP(5,Math.min(100,snap.brain.todayPlays*20));
  addP(5,Math.min(100,snap.antistress.todayCount*25));
  if(snap.tasks.pending+snap.tasks.completedToday)addP(5,snap.tasks.completedToday/(snap.tasks.pending+snap.tasks.completedToday)*100);
  var value=sumW?Math.round(sumV/sumW):0;
  var label=value>=85?'🌟 Отличный день':value>=70?'😊 Хороший':value>=50?'🙂 Средний':value>=30?'😐 Слабый':'😔 Тяжёлый';
  return{value:value,label:label};
}

/* ============ SNAPSHOT + РЕКОМЕНДАЦИИ ============ */
function refreshSnapshot(){
  try{
    if(typeof buildUserSnapshot!=='function')return null;
    var snap=buildUserSnapshot(state);
    if(!snap)return null;
    state.snapshot=snap;
    state.recommendations=snap.recommendations||[];
    state.lastSnapshotAt=nowISO();
    if(!state.snapshotHistory)state.snapshotHistory=[];
    var t=today();
    var last=state.snapshotHistory[state.snapshotHistory.length-1];
    if(!last||last.date!==t){
      state.snapshotHistory.push({date:t,xp:state.xp||0,streak:state.stats.streak||0,habitsDone:snap.habits.completedToday,tasksDone:snap.tasks.completedToday,sleep:snap.sleep.lastNight?snap.sleep.lastNight.hours:null,screen:snap.screen.today,mood:snap.mood.today});
      if(state.snapshotHistory.length>90)state.snapshotHistory=state.snapshotHistory.slice(-90);
    }
    save();
    return snap;
  }catch(e){console.error('[refreshSnapshot]',e);return null}
}
window.refreshSnapshot=refreshSnapshot;

function renderSnapshot(){
  var snap=state.snapshot;
  if(!snap)snap=refreshSnapshot();
  var html='<div class="page">';
  html+='<div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">🌐 Единая картина</div>';
  html+='<button class="btn btn-ghost btn-sm" onclick="refreshSnapshot();renderSnapshot()">🔄</button></div>';
  if(!snap){html+='<div class="card"><div class="empty"><div class="empty-icon">⏳</div><div class="empty-title">Считаем...</div></div></div></div>';document.getElementById('app').innerHTML=html;return}
  var score=calcDayScore(snap);
  html+='<div class="card card-gradient"><div style="font-size:12px;opacity:.9;">Балл дня</div>';
  html+='<div style="font-size:56px;font-weight:800;line-height:1;">'+score.value+'</div>';
  html+='<div style="font-size:14px;opacity:.95;margin-top:6px;">'+score.label+'</div></div>';
  html+='<div class="stat-grid mb-4"><div class="stat-item"><div class="stat-value">'+snap.habits.completedToday+'/'+snap.habits.total+'</div><div class="stat-label">Привычки</div></div><div class="stat-item"><div class="stat-value">'+(snap.sleep.lastNight?snap.sleep.lastNight.hours+'ч':'—')+'</div><div class="stat-label">Сон</div></div><div class="stat-item"><div class="stat-value">'+(snap.screen.today?Math.round(snap.screen.today/60)+'ч':'0ч')+'</div><div class="stat-label">Экран</div></div></div>';
  html+='<div class="card"><h2>📊 По доменам</h2>';
  html+=snapshotBar('🔄 Привычки',snap.habits.total?Math.round(snap.habits.completedToday/snap.habits.total*100):0,'var(--brand)');
  html+=snapshotBar('😴 Сон',snap.sleep.avg7?Math.min(100,Math.round(snap.sleep.avg7/8*100)):0,'#4dd4ff');
  html+=snapshotBar('📱 Экран',snap.screen.today?Math.max(0,100-Math.min(100,snap.screen.today/420*100)):100,'#ff88cc');
  html+=snapshotBar('✅ Задачи',(snap.tasks.pending+snap.tasks.completedToday)?Math.round(snap.tasks.completedToday/(snap.tasks.pending+snap.tasks.completedToday)*100):0,'#3ddc97');
  html+=snapshotBar('💧 Вода',snap.water.goal?Math.min(100,Math.round(snap.water.today/snap.water.goal*100)):0,'#4dd4ff');
  html+=snapshotBar('❤️ Настроение',snap.mood.today?snap.mood.today*10:0,'#ff6b6b');
  html+=snapshotBar('🧠 Ум',Math.min(100,snap.brain.todayPlays*20),'#b394ff');
  html+=snapshotBar('🌬 Антистресс',Math.min(100,snap.antistress.todayCount*25),'#7bc043');
  html+='</div>';
  if(snap.recommendations&&snap.recommendations.length){
    html+='<div class="card"><h2>💡 Рекомендации</h2>';
    snap.recommendations.forEach(function(r){
      var prColor=r.priority===1?'var(--danger)':r.priority===2?'var(--warning)':'var(--brand)';
      html+='<div style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--divider);"><div style="font-size:22px;">'+r.emoji+'</div>';
      html+='<div style="flex:1;"><div style="font-weight:700;font-size:13px;">'+esc(r.title)+'</div><div class="footnote text-secondary">'+esc(r.text)+'</div></div>';
      html+='<div style="width:4px;height:36px;border-radius:2px;background:'+prColor+';"></div></div>';
    });
    html+='</div>';
  }
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderSnapshot=renderSnapshot;

function snapshotBar(label,value,color){
  value=Math.max(0,Math.min(100,value||0));
  return '<div style="margin-bottom:10px;"><div class="row-between" style="font-size:12px;font-weight:700;margin-bottom:4px;"><span>'+label+'</span><span>'+value+'%</span></div><div class="progress"><div class="progress-fill" style="width:'+value+'%;background:'+color+';"></div></div></div>';
}

function renderRecommendations(){
  var recs=state.recommendations||[];
  var html='<div class="page"><div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">💡 Рекомендации</div>';
  html+='<button class="btn btn-ghost btn-sm" onclick="refreshSnapshot();renderRecommendations()">🔄</button></div>';
  if(!recs.length){html+='<div class="card"><div class="empty"><div class="empty-icon">✨</div><div class="empty-title">Всё в балансе</div></div></div>'}
  else{
    recs.forEach(function(r){
      var prColor=r.priority===1?'var(--danger)':r.priority===2?'var(--warning)':'var(--brand)';
      html+='<div class="card" style="border-left:4px solid '+prColor+';"><div style="display:flex;gap:12px;"><div style="font-size:32px;">'+r.emoji+'</div>';
      html+='<div style="flex:1;"><div style="font-weight:800;font-size:15px;margin-bottom:4px;">'+esc(r.title)+'</div>';
      html+='<div class="footnote text-secondary">'+esc(r.text)+'</div>';
      if(r.action)html+='<button class="btn btn-primary btn-sm mt-3" onclick="navigate(\''+r.action+'\')">Перейти →</button></div></div></div>';
    });
  }
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderRecommendations=renderRecommendations;

/* ============ ГЕНЕРАТОР РЕКОМЕНДАЦИЙ (внутри снапшота) ============ */
function generateRecommendations(snap){
  var recs=[];
  if(!snap)return recs;
  if(snap.sleep.avg7!==null&&snap.sleep.avg7<7)recs.push({emoji:'😴',priority:1,title:'Сон <7ч',text:'Средний '+snap.sleep.avg7+'ч. Ложись раньше.',action:'sleep'});
  if(snap.screen.today>240)recs.push({emoji:'📱',priority:1,title:'Много экрана',text:Math.round(snap.screen.today/60)+'ч. Час без телефона.',action:'screentracker'});
  if(snap.water.today<snap.water.goal*0.5)recs.push({emoji:'💧',priority:1,title:'Мало воды',text:snap.water.today+'/'+snap.water.goal,action:'water'});
  if(snap.tasks.overdue>0)recs.push({emoji:'⚠️',priority:1,title:'Просрочено',text:snap.tasks.overdue+' задач',action:'tasks'});
  if(snap.mood.today!==null&&snap.mood.today<5)recs.push({emoji:'❤️',priority:1,title:'Низкое настроение',text:snap.mood.today+'/10. Прогулка.',action:'mood'});
  if(snap.habits.total===0)recs.push({emoji:'🔄',priority:2,title:'Нет привычек',text:'Начни с 1-2.',action:'habitCatalog'});
  else if(snap.habits.completedToday===0)recs.push({emoji:'🔄',priority:1,title:'Привычки не выполнены',text:'0 сегодня',action:'habitList'});
  if(snap.workouts.last7<2)recs.push({emoji:'🏋️',priority:2,title:'Мало движения',text:snap.workouts.last7+' за 7 дней',action:'workouts'});
  if(snap.brain.todayPlays===0)recs.push({emoji:'🧠',priority:3,title:'Тренировка ума',text:'5 минут игры',action:'brain'});
  if(snap.antistress.todayCount===0&&snap.screen.today>180)recs.push({emoji:'🌬',priority:2,title:'Пора расслабиться',text:'Дыхание 4-7-8',action:'antistress'});
  recs.sort(function(a,b){return a.priority-b.priority});
  return recs.slice(0,5);
}

/* ============ ЭКСПОРТ ОТЧЁТОВ ============ */
function exportDayReport(date){
  try{
    var snap=state.snapshot||buildUserSnapshot(state);
    var score=calcDayScore(snap);
    var text='📊 ОТЧЁТ ЗА ДЕНЬ '+date+'\n\nБалл дня: '+score.value+'/100 — '+score.label+'\n\n';
    text+='🔄 Привычки: '+snap.habits.completedToday+'/'+snap.habits.total+'\n';
    text+='😴 Сон: '+(snap.sleep.lastNight?snap.sleep.lastNight.hours+' ч':'—')+'\n';
    text+='📱 Экран: '+Math.round(snap.screen.today/60)+' ч\n';
    text+='✅ Задачи: '+snap.tasks.completedToday+' / '+snap.tasks.pending+'\n';
    text+='💧 Вода: '+snap.water.today+'/'+snap.water.goal+'\n';
    text+='❤️ Настроение: '+(snap.mood.today!==null?snap.mood.today+'/10':'—')+'\n';
    text+='🧠 Ум: '+snap.brain.todayPlays+'\n';
    text+='🌬 Антистресс: '+snap.antistress.todayCount+'\n';
    if(navigator.share){navigator.share({title:'Отчёт '+date,text:text})}
    else{navigator.clipboard.writeText(text);toast('✓ Скопировано','success')}
  }catch(e){toast('Ошибка экспорта','error')}
}
window.exportDayReport=exportDayReport;

console.log('[APP v43 3/4] ✅ Sleep, Calendar v2, Reports, Snapshot');
/* ============================================================
   LIFE OS — APP.js v43 — ФИНАЛ
   ЧАСТЬ 4/4: Настройки, Профиль v2, Уведомления, Игры, Материалы, Экспорт, INIT
   ============================================================ */

/* ============ НАСТРОЙКИ v2 ============ */
function renderSettingsV2(){
  var s=state.settingsV2||{};
  var html='<div class="page"><div class="title-xl">⚙️ Настройки</div>';
  html+='<div class="card"><h2>🎨 Интерфейс</h2>';
  html+='<div class="row-between mb-2"><div class="list-title">Тема</div><button class="btn btn-ghost btn-sm" onclick="openThemePicker()">Выбрать →</button></div>';
  html+='<div class="field"><label class="field-label">Размер текста</label><select id="set-textSize" onchange="saveSettingsV2()">';
  ['small','medium','large','xlarge'].forEach(function(v){
    var lbl={small:'Мелкий',medium:'Обычный',large:'Крупный',xlarge:'Очень крупный'}[v];
    html+='<option value="'+v+'"'+(s.textSize===v?' selected':'')+'>'+lbl+'</option>';
  });
  html+='</select></div>';
  html+='<div class="field"><label class="field-label">Масштаб</label><select id="set-scale" onchange="saveSettingsV2()">';
  ['80','90','100','110','120'].forEach(function(v){html+='<option value="'+v+'"'+(s.scale===v?' selected':'')+'>'+v+'%</option>'});
  html+='</select></div>';
  html+='<div class="row-between mb-2"><div class="list-title">Уменьшить движение</div><button class="btn '+(s.reducedMotion?'btn-primary':'btn-ghost')+' btn-sm" onclick="state.settingsV2.reducedMotion=!state.settingsV2.reducedMotion;save();applyUserSettings();renderSettingsV2()">'+(s.reducedMotion?'Вкл':'Выкл')+'</button></div>';
  html+='<div class="row-between"><div class="list-title">Эффекты темы</div><button class="btn '+(state.settings.effectsEnabled?'btn-primary':'btn-ghost')+' btn-sm" onclick="state.settings.effectsEnabled=!state.settings.effectsEnabled;save();startEffects();renderSettingsV2()">'+(state.settings.effectsEnabled?'Вкл':'Выкл')+'</button></div>';
  html+='</div>';
  html+='<div class="card"><h2>🔊 Звук и вибрация</h2>';
  html+='<div class="row-between mb-2"><div class="list-title">Звуки</div><button class="btn '+(s.sound?'btn-primary':'btn-ghost')+' btn-sm" onclick="state.settingsV2.sound=!state.settingsV2.sound;save();renderSettingsV2()">'+(s.sound?'Вкл':'Выкл')+'</button></div>';
  html+='<div class="row-between"><div class="list-title">Вибрация</div><button class="btn '+(s.haptic?'btn-primary':'btn-ghost')+' btn-sm" onclick="state.settingsV2.haptic=!state.settingsV2.haptic;save();renderSettingsV2()">'+(s.haptic?'Вкл':'Выкл')+'</button></div>';
  html+='</div>';
  html+='<div class="card"><h2>🔔 Уведомления</h2><button class="btn btn-primary btn-block" onclick="navigate(\'notifications\')">Настроить</button></div>';
  html+='<div class="card"><h2>🗄 Данные</h2>';
  html+='<button class="btn btn-primary btn-block mb-2" onclick="openExportPicker()">📤 Экспорт</button>';
  html+='<button class="btn btn-ghost btn-block mb-2" onclick="importDB()">📥 Импорт JSON</button>';
  html+='<button class="btn btn-danger btn-block" onclick="resetAllWithConfirm()">🗑 Сброс</button>';
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

/* ============ ПРОФИЛЬ v2 ============ */
function getWaterGoal(){
  var p=state.profileV2||{};
  if(p.weight)return Math.round(p.weight*30/250);
  return state.settings.waterGoal||8;
}
window.getWaterGoal=getWaterGoal;

function getCalorieGoal(){
  var p=state.profileV2||{};
  if(!p.weight||!p.height||!p.age||!p.gender)return null;
  var bmr;
  if(p.gender==='male')bmr=10*p.weight+6.25*p.height-5*p.age+5;
  else bmr=10*p.weight+6.25*p.height-5*p.age-161;
  var mult={sedentary:1.2,light:1.375,moderate:1.55,active:1.725,very_active:1.9}[p.activity]||1.55;
  var tdee=Math.round(bmr*mult);
  if(p.goal==='lose')tdee-=500;
  if(p.goal==='gain')tdee+=300;
  return tdee;
}
window.getCalorieGoal=getCalorieGoal;

function renderProfileV2(){
  var p=state.profileV2||{};
  var bmi=null;
  if(p.weight&&p.height){var h=p.height/100;bmi=Math.round(p.weight/(h*h)*10)/10}
  var bmiCat=bmi?bmi<18.5?'Недостаток':bmi<25?'Норма':bmi<30?'Избыток':'Ожирение':'—';
  var cal=getCalorieGoal();
  var waterGoal=getWaterGoal();

  var html='<div class="page"><div class="title-xl">👤 Профиль</div>';
  html+='<div class="profile-hero">';
  html+='<div class="avatar-btn" onclick="pickEmoji()" style="width:96px;height:96px;margin:0 auto 12px;font-size:48px;">'+state.profile.emoji+'</div>';
  html+='<div style="font-size:22px;font-weight:800;">'+esc(state.profile.name||'Пользователь')+'</div>';
  html+='<div class="footnote text-secondary">Уровень '+Math.floor((state.xp||0)/100)+' · '+(state.xp||0)+' XP</div>';
  html+='</div>';

  html+='<div class="card"><h2>📏 Данные</h2>';
  html+='<div class="row" style="gap:8px;"><div style="flex:1;"><label class="field-label">Возраст</label><input type="number" id="pv-age" value="'+(p.age||'')+'" onchange="saveProfileV2()"/></div>';
  html+='<div style="flex:1;"><label class="field-label">Пол</label><select id="pv-gender" onchange="saveProfileV2()"><option value="">—</option><option value="male"'+(p.gender==='male'?' selected':'')+'>М</option><option value="female"'+(p.gender==='female'?' selected':'')+'>Ж</option></select></div></div>';
  html+='<div class="row" style="gap:8px;"><div style="flex:1;"><label class="field-label">Рост (см)</label><input type="number" id="pv-height" value="'+(p.height||'')+'" onchange="saveProfileV2()"/></div>';
  html+='<div style="flex:1;"><label class="field-label">Вес (кг)</label><input type="number" id="pv-weight" value="'+(p.weight||'')+'" step="0.1" onchange="saveProfileV2()"/></div></div>';
  html+='<div class="row" style="gap:8px;"><div style="flex:1;"><label class="field-label">Активность</label><select id="pv-activity" onchange="saveProfileV2()">';
  var acts={sedentary:'Сидячий',light:'Лёгкая',moderate:'Средняя',active:'Активная',very_active:'Очень активная'};
  Object.keys(acts).forEach(function(k){html+='<option value="'+k+'"'+(p.activity===k?' selected':'')+'>'+acts[k]+'</option>'});
  html+='</select></div>';
  html+='<div style="flex:1;"><label class="field-label">Цель</label><select id="pv-goal" onchange="saveProfileV2()">';
  var goals={lose:'Похудеть',maintain:'Держать',gain:'Набрать'};
  Object.keys(goals).forEach(function(k){html+='<option value="'+k+'"'+(p.goal===k?' selected':'')+'>'+goals[k]+'</option>'});
  html+='</select></div></div>';
  html+='</div>';

  if(bmi!==null||cal||waterGoal){
    html+='<div class="card"><h2>📊 Расчёты</h2>';
    if(bmi!==null)html+='<div class="stat-row"><span class="stat-row-label">ИМТ</span><span class="stat-row-value">'+bmi+' ('+bmiCat+')</span></div>';
    if(cal)html+='<div class="stat-row"><span class="stat-row-label">Калории</span><span class="stat-row-value">'+cal+' ккал</span></div>';
    html+='<div class="stat-row"><span class="stat-row-label">Норма воды</span><span class="stat-row-value">'+waterGoal+' стаканов</span></div>';
    html+='</div>';
  }

  html+='<div class="card"><h2>🎯 Целевой вес</h2>';
  html+='<div class="row" style="gap:8px;"><div style="flex:1;"><label class="field-label">Цель (кг)</label><input type="number" id="pv-targetWeight" value="'+(p.targetWeight||'')+'" step="0.1" onchange="saveProfileV2()"/></div>';
  html+='<div style="flex:1;"><label class="field-label">Дата</label><input type="date" id="pv-targetDate" value="'+(p.targetDate||'')+'" onchange="saveProfileV2()"/></div></div></div>';

  html+='<div class="card"><h2>📝 Заметки</h2><textarea id="pv-notes" style="min-height:80px;" onchange="saveProfileV2()" placeholder="Аллергии, хронические, лекарства...">'+esc(p.medicalNotes||'')+'</textarea></div>';

  html+='<div class="card"><h2>🏆 Достижения ('+((state.profile.achievements||[]).length)+'/'+((window.ACHIEVEMENTS||[]).length)+')</h2><div class="achieve-grid">';
  (window.ACHIEVEMENTS||[]).forEach(function(a){
    var isUnlocked=(state.profile.achievements||[]).indexOf(a.id)>=0;
    var prog=isUnlocked?1:(a.progress?a.progress(state):0);
    html+='<div class="achieve-item '+(isUnlocked?'unlocked':'locked')+'"><div class="achieve-icon">'+a.icon+'</div><div class="achieve-name">'+a.name+'</div><div class="achieve-progress"><div class="achieve-progress-fill" style="width:'+(prog*100)+'%"></div></div></div>';
  });
  html+='</div></div>';

  html+='<button class="btn btn-primary btn-block mb-2" onclick="saveProfileV2()">💾 Сохранить</button>';
  html+='<button class="btn btn-ghost btn-block" onclick="pickEmoji()">😊 Сменить аватар</button>';
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
  save();toast('✓ Сохранено','success');
}
window.saveProfileV2=saveProfileV2;

function pickEmoji(){
  var emojis=['😊','😎','🤓','🧑‍💻','👨‍💼','👩‍💼','🦊','🐱','🐶','🦁','🐼','🦉','🌟','⚡','🔥','💎','🚀','🎯','🧠','💪','🌈','☕','🎨','🎮','🎧','📚','🏃','🧘','🍀','🌸'];
  var html='<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:8px;">';
  emojis.forEach(function(e){html+='<button onclick="setEmoji(\''+e+'\')" style="aspect-ratio:1;border-radius:14px;background:var(--glass-2);font-size:26px;cursor:pointer;border:2px solid '+(e===state.profile.emoji?'var(--brand)':'transparent')+';">'+e+'</button>'});
  html+='</div>';
  openSheet('Аватар',html);
}
window.pickEmoji=pickEmoji;
function setEmoji(e){state.profile.emoji=e;save();closeSheet();toast('✓','success');updateHeader();renderProfileV2()}
window.setEmoji=setEmoji;

/* ============ УВЕДОМЛЕНИЯ ============ */
function renderNotifications(){
  var n=state.notifications||{};
  var s=n.settings||{};
  var html='<div class="page"><div class="title-xl">🔔 Уведомления</div>';
  html+='<div class="card"><div class="row-between mb-2"><div class="list-title">Разрешение</div><div class="badge '+(n.permission==='granted'?'badge-success':'')+'">'+(n.permission||'default')+'</div></div>';
  if(n.permission!=='granted')html+='<button class="btn btn-primary btn-block" onclick="requestNotificationPermission()">Разрешить</button>';
  else html+='<div class="footnote text-secondary">✓ Разрешено</div>';
  html+='</div>';
  html+='<div class="card"><h2>Общие</h2>';
  html+='<div class="row-between mb-2"><div class="list-title">Все уведомления</div><button class="btn '+(s.enabled?'btn-primary':'btn-ghost')+' btn-sm" onclick="toggleNotifSetting(\'enabled\')">'+(s.enabled?'Вкл':'Выкл')+'</button></div>';
  html+='<div class="row-between"><div class="list-title">Вибрация</div><button class="btn '+(s.vibration?'btn-primary':'btn-ghost')+' btn-sm" onclick="toggleNotifSetting(\'vibration\')">'+(s.vibration?'Вкл':'Выкл')+'</button></div>';
  html+='</div>';
  html+='<div class="card"><h2>Категории</h2>';
  var cats=[
    {id:'habitMorning',label:'🌅 Утренние привычки'},
    {id:'habitDay',label:'☀️ Дневные'},
    {id:'habitEvening',label:'🌆 Вечерние'},
    {id:'habitNight',label:'🌙 Ночные'},
    {id:'water',label:'💧 Вода'},
    {id:'sleep',label:'😴 Сон'},
    {id:'tasks',label:'📋 Задачи'},
    {id:'eye',label:'👁 20-20-20'},
    {id:'screen',label:'📱 Экран'},
    {id:'brain',label:'🧠 Ум'},
    {id:'stress',label:'🌬 Антистресс'},
    {id:'learn',label:'🎓 Обучение'}
  ];
  cats.forEach(function(c){
    html+='<div class="row-between mb-2"><div class="list-title">'+c.label+'</div><button class="btn '+(s[c.id]?'btn-primary':'btn-ghost')+' btn-sm" onclick="toggleNotifSetting(\''+c.id+'\')">'+(s[c.id]?'Вкл':'Выкл')+'</button></div>';
  });
  html+='</div>';
  html+='<button class="btn btn-primary btn-block" onclick="testNotification()">🔔 Тест</button>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderNotifications=renderNotifications;

function requestNotificationPermission(){
  if(!('Notification' in window))return toast('Не поддерживается','error');
  Notification.requestPermission().then(function(perm){
    state.notifications.permission=perm;
    save();
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

function testNotification(){
  if(state.notifications.permission!=='granted')return toast('Разреши сначала','warning');
  try{
    new Notification('Life OS',{body:'Тестовое уведомление 🎉'});
    toast('✓ Отправлено','success');
  }catch(e){toast('Ошибка','error')}
}
window.testNotification=testNotification;

/* ============ ЭКСПОРТ / ИМПОРТ ============ */
function openExportPicker(){
  var html='<div class="footnote text-secondary mb-3">Что экспортировать?</div>';
  var groups=[
    {id:'all',label:'📦 Всё',def:true},
    {id:'tasks',label:'✅ Задачи'},
    {id:'habits',label:'🔄 Привычки'},
    {id:'sleep',label:'😴 Сон'},
    {id:'brain',label:'🧠 Ум'},
    {id:'antistress',label:'🌬 Антистресс'},
    {id:'screen',label:'📱 Экран'},
    {id:'health',label:'❤️ Здоровье'},
    {id:'learning',label:'🎓 Обучение'},
    {id:'journal',label:'📓 Дневник'},
    {id:'profile',label:'👤 Профиль'}
  ];
  groups.forEach(function(g){
    html+='<label class="list-row" style="cursor:pointer;"><input type="checkbox" data-export="'+g.id+'" '+(g.id==='all'?'checked':'')+' style="width:20px;height:20px;margin-right:10px;"/><div class="list-body"><div class="list-title">'+g.label+'</div></div></label>';
  });
  html+='<button class="btn btn-primary btn-block mt-3" onclick="doExport()">📤 Скачать JSON</button>';
  openSheet('Экспорт',html);
}
window.openExportPicker=openExportPicker;

function doExport(){
  var picked=[];
  document.querySelectorAll('[data-export]').forEach(function(cb){if(cb.checked)picked.push(cb.getAttribute('data-export'))});
  if(!picked.length)return toast('Выбери','warning');
  var data={};
  if(picked.indexOf('all')>=0)data=JSON.parse(JSON.stringify(state));
  else{
    if(picked.indexOf('tasks')>=0)data.tasks=state.tasks;
    if(picked.indexOf('habits')>=0){data.habits=state.habits;data.habitHistory=state.habitHistory}
    if(picked.indexOf('sleep')>=0)data.sleepEntries=state.sleepEntries;
    if(picked.indexOf('brain')>=0){data.brainPlays=state.brainPlays;data.brainStats=state.brainStats}
    if(picked.indexOf('antistress')>=0)data.antistressEntries=state.antistressEntries;
    if(picked.indexOf('screen')>=0){data.screenEntries=state.screenEntries;data.screenStats=state.screenStats}
    if(picked.indexOf('health')>=0){data.customWater=state.customWater;data.customMood=state.customMood;data.customWorkouts=state.customWorkouts}
    if(picked.indexOf('learning')>=0){data.levelProgress=state.levelProgress;data.englishProgress=state.englishProgress;data.skillsProgress=state.skillsProgress}
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
    toast('📤 Готово','success');closeSheet();
  }catch(e){toast('Ошибка','error')}
}
window.doExport=doExport;

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
        backupStorage();
        localStorage.setItem(STORAGE_KEY,JSON.stringify(data));
        toast('✓ Импорт. Перезагрузка...','success');
        setTimeout(function(){location.reload()},1200);
      }catch(err){toast('Ошибка','error')}
    };
    reader.readAsText(file);
  };
  input.click();
}
window.importDB=importDB;

function resetAllWithConfirm(){
  if(!confirm('Удалить ВСЕ данные?'))return;
  if(!confirm('Точно?'))return;
  backupStorage();
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}
window.resetAllWithConfirm=resetAllWithConfirm;

/* ============ ХЕЛПЕРЫ ============ */
function renderRing(value,label,cls,icon){
  var r=40,c=2*Math.PI*r,off=c-(value/100)*c;
  var gid='rg_'+cls;
  var colors={'ring-1':['#5b9eff','#a78bfa'],'ring-2':['#3ddc97','#4dd4ff'],'ring-3':['#4dd4ff','#5b9eff'],'ring-4':['#ffa940','#ff6b6b']};
  var col=colors[cls]||['#5b9eff','#a78bfa'];
  return '<div class="ring-item"><div class="ring-center">'+
    '<svg class="ring-svg" viewBox="0 0 100 100"><defs><linearGradient id="'+gid+'" x1="0%" y1="0%" x2="100%" y2="100%">'+
    '<stop offset="0%" stop-color="'+col[0]+'"/><stop offset="100%" stop-color="'+col[1]+'"/></linearGradient></defs>'+
    '<circle class="ring-track" cx="50" cy="50" r="'+r+'"/>'+
    '<circle class="ring-fill" cx="50" cy="50" r="'+r+'" stroke="url(#'+gid+')" stroke-dasharray="'+c+'" stroke-dashoffset="'+off+'"/></svg>'+
    '<div class="ring-value"><div>'+value+'%</div></div></div>'+
    '<div class="ring-label">'+label+'</div></div>';
}

function renderWisdom(){
  var w=(typeof getTodayWisdom==='function')?getTodayWisdom():{text:'Начни.',author:'',action:'Сделай шаг'};
  return '<div class="insight-card"><div class="insight-title">💎 Мудрость дня</div><div class="insight-text">"'+esc(w.text)+'"</div>'+(w.author?'<div class="insight-author">— '+esc(w.author)+'</div>':'')+'<div class="insight-apply">→ '+esc(w.action||'')+'</div><button class="btn btn-primary btn-block mt-3" onclick="applyWisdom()">Внедрить</button></div>';
}
function applyWisdom(){
  var w=(typeof getTodayWisdom==='function')?getTodayWisdom():{action:'Сделай шаг',text:''};
  state.tasks.unshift({id:uid(),title:'💎 '+w.action,description:w.text,category:'Развитие',planned_time:15,status:'pending',priority:'medium',created_at:nowISO()});
  save();toast('✓','success');navigate('tasks');
}
window.applyWisdom=applyWisdom;

function renderChallenges(){
  var list=(typeof getTodayChallenges==='function')?getTodayChallenges():[];
  if(!list.length)return '';
  var html='<div class="card"><h2>🔥 Челленджи</h2>';
  list.forEach(function(ch){
    var done=state.challengeProgress&&state.challengeProgress[ch.id];
    html+='<div style="background:linear-gradient(135deg,rgba(255,169,64,.15),rgba(255,107,107,.1));border:1px solid rgba(255,169,64,.35);border-radius:var(--r-lg);padding:16px;margin-bottom:12px;cursor:pointer;" onclick="completeChallenge(\''+ch.id+'\')"><div style="font-size:15px;font-weight:800;margin-bottom:6px;">'+(done?'✓ ':'')+esc(ch.title)+'</div><div style="font-size:13px;color:var(--text-2);">'+esc(ch.desc)+'</div></div>';
  });
  html+='</div>';
  return html;
}
function completeChallenge(id){
  if(!state.challengeProgress)state.challengeProgress={};
  if(state.challengeProgress[id])return;
  state.challengeProgress[id]=nowISO();
  state.xp=(state.xp||0)+10;
  save();haptic('success');toast('🔥 +10 XP','success');navigate(currentPage);
}
window.completeChallenge=completeChallenge;

function checkAchievements(){
  var achievements=window.ACHIEVEMENTS||[];
  var unlocked=state.profile.achievements||[];
  var newOnes=[];
  for(var i=0;i<achievements.length;i++){
    var a=achievements[i];
    if(unlocked.indexOf(a.id)<0&&a.check(state)){unlocked.push(a.id);newOnes.push(a)}
  }
  state.profile.achievements=unlocked;
  if(newOnes.length){save();newOnes.forEach(function(a,i){setTimeout(function(){toast('🏆 '+a.name,'success',3500);haptic('success')},i*800)})}
}
window.checkAchievements=checkAchievements;

/* ============ SCREEN TRACKER ============ */
function screenGetToday(){return (state.screenStats||{})[today()]||0}
function screenGetWeek(){var t=0,now=new Date();for(var i=0;i<7;i++){var d=new Date(now);d.setDate(now.getDate()-i);t+=(state.screenStats||{})[d.toISOString().slice(0,10)]||0}return t}
function fmtMinsHM(m){var h=Math.floor(m/60),mm=m%60;if(h===0)return mm+' мин';if(mm===0)return h+' ч';return h+' ч '+mm+' мин'}
function parseScreenTime(str){
  if(!str)return 0;str=String(str).toLowerCase().trim();
  var total=0;
  var h=str.match(/(\d+)\s*ч/), m=str.match(/(\d+)\s*м/);
  if(h)total+=parseInt(h[1])*60;
  if(m)total+=parseInt(m[1]);
  if(!h&&!m){var n=parseInt(str);if(!isNaN(n))total=n<=24?n*60:n}
  return total;
}
function renderScreenTracker(){
  var today_=screenGetToday();
  var html='<div class="page"><div class="title-xl">📱 Экран</div>';
  html+='<div class="card card-gradient"><div style="font-size:12px;opacity:.9;">Сегодня</div><div style="font-size:40px;font-weight:800;">'+fmtMinsHM(today_)+'</div><div style="font-size:12px;opacity:.9;margin-top:6px;">За неделю: '+fmtMinsHM(screenGetWeek())+'</div></div>';
  html+='<button class="btn btn-primary btn-block mb-3" onclick="openScreenAdd()">➕ Добавить</button>';
  var entries=(state.screenEntries||[]).slice(-10).reverse();
  if(entries.length){
    html+='<div class="card"><h2>История</h2>';
    entries.forEach(function(e){html+='<div class="stat-row"><span class="stat-row-label">'+e.date+'</span><span class="stat-row-value">'+fmtMinsHM(e.minutes)+'</span></div>'});
    html+='</div>';
  }
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderScreenTracker=renderScreenTracker;
function openScreenAdd(){
  var html='<div class="field"><label class="field-label">Дата</label><input type="date" id="scr-date" value="'+today()+'"/></div>';
  html+='<div class="field"><label class="field-label">Время</label><input type="text" id="scr-mins" placeholder="2ч 30мин"/></div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="saveScreenEntry()">💾</button>';
  openSheet('Экран',html);
}
window.openScreenAdd=openScreenAdd;
function saveScreenEntry(){
  var date=(document.getElementById('scr-date')||{}).value||today();
  var raw=(document.getElementById('scr-mins')||{}).value||'';
  var mins=parseScreenTime(raw);
  if(mins<=0)return toast('Введи время','error');
  if(!state.screenStats)state.screenStats={};
  state.screenStats[date]=(state.screenStats[date]||0)+mins;
  if(!state.screenEntries)state.screenEntries=[];
  state.screenEntries.push({id:uid(),date:date,minutes:mins,created_at:nowISO()});
  save();closeSheet();toast('✓','success');renderScreenTracker();
}
window.saveScreenEntry=saveScreenEntry;

/* ============ ВОДА / НАСТРОЕНИЕ ============ */
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
  var count=e?e.count:0;
  var goal=getWaterGoal();
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
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderMood=renderMood;

/* ============ ИГРЫ / МАТЕРИАЛЫ ============ */
function renderLearningGames(){
  var games=window.LEARNING_GAMES||[];
  var html='<div class="page"><div class="title-xl">🎮 Игры</div>';
  html+='<div class="card card-gradient"><div style="font-size:12px;opacity:.9;">Обучающие</div><div style="font-size:32px;font-weight:800;">'+games.length+'</div></div>';
  games.forEach(function(g){
    html+='<div class="method-card" onclick="startLearningGame(\''+g.id+'\')"><div class="method-header"><div class="method-emoji">'+g.emoji+'</div><div style="flex:1;"><div class="method-title">'+esc(g.title)+'</div><div class="method-cat">'+esc(g.desc||'')+' · +'+g.xp+' XP</div></div><div class="list-chevron">▶</div></div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderLearningGames=renderLearningGames;
function startLearningGame(id){
  var g=(window.LEARNING_GAMES||[]).find(function(x){return x.id===id});if(!g)return;
  var html='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:56px;">'+g.emoji+'</div><div style="font-size:22px;font-weight:800;">'+esc(g.title)+'</div></div>';
  html+='<div class="card"><div class="field"><label class="field-label">Очки</label><input type="number" id="lg-score" value="50"/></div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="finishLearningGame(\''+g.id+'\')">✓ +'+g.xp+' XP</button></div>';
  openSheet(g.title,html);
}
window.startLearningGame=startLearningGame;
function finishLearningGame(id){
  var g=(window.LEARNING_GAMES||[]).find(function(x){return x.id===id});if(!g)return;
  var score=parseInt((document.getElementById('lg-score')||{}).value)||0;
  if(!state.gameProgress)state.gameProgress={};
  if(!state.gameProgress[id])state.gameProgress[id]={plays:0,best:0,lastPlayed:null};
  state.gameProgress[id].plays++;
  if(score>state.gameProgress[id].best)state.gameProgress[id].best=score;
  state.gameProgress[id].lastPlayed=nowISO();
  state.xp=(state.xp||0)+g.xp;
  save();toast('✓ +'+g.xp+' XP','success');closeSheet();renderLearningGames();
}
window.finishLearningGame=finishLearningGame;

function renderMaterials(){
  var mats=window.LEARNING_MATERIALS||[];
  var html='<div class="page"><div class="title-xl">📚 Материалы</div>';
  html+='<div class="card card-gradient"><div style="font-size:32px;font-weight:800;">'+mats.length+'</div></div>';
  mats.forEach(function(m){
    var prog=state.materialsProgress&&state.materialsProgress[m.id];
    var status=prog?prog.status:'planned';
    var statusEmoji={planned:'📌','in-progress':'▶️',done:'✅'}[status]||'📌';
    html+='<div class="method-card" onclick="openMaterialDetail(\''+m.id+'\')"><div class="method-header"><div class="method-emoji">'+m.emoji+'</div><div style="flex:1;"><div class="method-title">'+statusEmoji+' '+esc(m.title)+'</div><div class="method-cat">'+esc(m.author||'')+' · ⭐ '+m.rating+'</div></div><div class="list-chevron">›</div></div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderMaterials=renderMaterials;
function openMaterialDetail(id){
  var m=(window.LEARNING_MATERIALS||[]).find(function(x){return x.id===id});if(!m)return;
  var html='<div style="font-size:20px;font-weight:800;margin-bottom:12px;">'+esc(m.title)+'</div>';
  if(m.desc)html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📖</div><div class="lesson-content">'+esc(m.desc)+'</div></div></div>';
  html+='<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:12px;">';
  ['planned','in-progress','done'].forEach(function(s){
    var lbl={planned:'📌 Планирую','in-progress':'▶️ В процессе',done:'✅ Прочитано'}[s];
    html+='<button class="btn btn-ghost btn-sm" onclick="setMaterialStatus(\''+id+'\',\''+s+'\')">'+lbl+'</button>';
  });
  html+='</div>';
  openSheet(m.title,html);
}
window.openMaterialDetail=openMaterialDetail;
function setMaterialStatus(id,status){
  if(!state.materialsProgress)state.materialsProgress={};
  if(!state.materialsProgress[id])state.materialsProgress[id]={status:'planned',progress:0,notes:''};
  state.materialsProgress[id].status=status;
  save();toast('✓','success');closeSheet();renderMaterials();
}
window.setMaterialStatus=setMaterialStatus;

/* ============ STORAGE ============ */
function renderStorage(){
  var size=0;
  try{size=(localStorage.getItem(STORAGE_KEY)||'').length}catch(e){}
  var html='<div class="page"><div class="title-xl">🗄 Хранилище</div>';
  html+='<div class="card"><h2>Данные</h2><div class="stat-row"><span class="stat-row-label">Размер</span><span class="stat-row-value">'+(size/1024).toFixed(1)+' KB</span></div></div>';
  html+='<div class="card"><h2>Операции</h2>';
  html+='<button class="btn btn-primary btn-block mb-2" onclick="openExportPicker()">📤 Экспорт</button>';
  html+='<button class="btn btn-ghost btn-block mb-2" onclick="importDB()">📥 Импорт</button>';
  html+='<button class="btn btn-danger btn-block" onclick="resetAllWithConfirm()">🗑 Сброс</button>';
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
window.renderStorage=renderStorage;

/* ============ STATS / PROFILE ============ */
function renderStats(){
  var doneTasks=state.tasks.filter(function(t){return t.status==='completed'}).length;
  var doneLessons=Object.keys(state.levelProgress||{}).length;
  var html='<div class="page"><div class="title-xl">📊 Статистика</div>';
  html+='<div class="stat-grid mb-4"><div class="stat-item"><div class="stat-value">'+doneTasks+'</div><div class="stat-label">Задач</div></div><div class="stat-item"><div class="stat-value">'+doneLessons+'</div><div class="stat-label">Уроков</div></div><div class="stat-item"><div class="stat-value">'+(state.stats.streak||0)+'</div><div class="stat-label">Streak</div></div></div>';
  html+='<button class="btn btn-primary btn-block" onclick="navigate(\'dailyReport\')">📊 Отчёт дня</button>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.renderStats=renderStats;
function renderDetailedStats(){renderStats()}
window.renderDetailedStats=renderDetailedStats;
function renderProfile(){renderProfileV2()}
window.renderProfile=renderProfile;
function renderSettings(){renderSettingsV2()}
window.renderSettings=renderSettings;

/* ============ АВТО-ТРЕКИНГ ПРИВЫЧЕК ============ */
function autoCompleteHabitsByIntegration(kind){
  if(!state.habits||!state.habits.length)return;
  var t=today();
  state.habits.forEach(function(h){
    if(!h.integration||h.integration!==kind)return;
    if(h.lastCompletedDate===t)return;
    var ok=false;
    if(kind==='water'){
      var w=(state.customWater||[]).find(function(x){return x.date===t});
      if(w&&w.count>=(h.targetCount||8))ok=true;
    }
    if(kind==='mood'){var m=(state.customMood||[]).find(function(x){return x.date===t});if(m)ok=true}
    if(kind==='sleep'){var sl=getSleepEntryForDate(t);if(sl&&sl.hours>=7&&sl.hours<=9)ok=true}
    if(ok){
      h.lastCompletedDate=t;h.streak=(h.streak||0)+1;
      if((h.streak||0)>(h.bestStreak||0))h.bestStreak=h.streak;
      if(!state.habitHistory[h.id])state.habitHistory[h.id]={};
      state.habitHistory[h.id][t]={completed:true,auto:true};
    }
  });
  save();
}
window.autoCompleteHabitsByIntegration=autoCompleteHabitsByIntegration;

/* ============ УВЕДОМЛЕНИЯ (планировщик) ============ */
var _notifLastFired={};
function startNotificationScheduler(){
  setInterval(function(){
    try{checkScheduledNotifications()}catch(e){}
  },60000);
  console.log('[NOTIF] Планировщик запущен');
}
window.startNotificationScheduler=startNotificationScheduler;
function checkScheduledNotifications(){
  var n=state.notifications||{};
  if(!n.enabled)return;
  var now=new Date();
  var hm=pad(now.getHours())+':'+pad(now.getMinutes());
  var t=today();
  var rules=[
    {id:'habitMorning',time:'07:00',title:'Утренние привычки'},
    {id:'water',time:'10:00',title:'Вода'},
    {id:'brain',time:'11:00',title:'Тренировка ума'},
    {id:'stress',time:'14:00',title:'Дыхание'},
    {id:'learn',time:'18:00',title:'Обучение'},
    {id:'habitEvening',time:'19:00',title:'Вечерние привычки'},
    {id:'tasks',time:'21:00',title:'Ревью дня'},
    {id:'sleep',time:'22:30',title:'Скоро спать'}
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

/* ============ INIT ============ */
function showWelcome(){
  var overlay=document.createElement('div');
  overlay.className='welcome-screen';
  overlay.innerHTML='<div class="welcome-logo">🧠</div><div class="welcome-title">Life OS</div><div class="welcome-sub">Нейроэкосистема жизни</div><button class="btn btn-primary btn-block" style="max-width:340px;" onclick="startOnboarding()">Начать</button>';
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
    setInterval(function(){try{refreshSnapshot()}catch(e){}},15*60*1000);
    console.log('[INIT ✅] Life OS v43: habits='+state.habits.length+' brain='+state.brainPlays.length+' as='+state.antistressEntries.length+' sleep='+state.sleepEntries.length);
    console.log('[INIT ✅] BackButton='+!!(tg&&tg.BackButton)+' Voice='+voiceSupported());
  }catch(e){
    console.error('[INIT]',e);
    var app=document.getElementById('app');
    if(app)app.innerHTML='<div class="empty"><div class="empty-icon">⚠️</div><div class="empty-title">Ошибка: '+esc(e.message)+'</div></div>';
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

console.log('[APP v43 4/4] ✅ ФИНАЛ загружен');