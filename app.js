'use strict';
/* ============================================================
   LIFE OS — APP.js v41 — ЧАСТЬ 1/2
   Ядро, state, dashboard, задачи, матрица, обучение, здоровье
   ============================================================ */

/* ============ TELEGRAM ============ */
try{
  var tg=window.Telegram&&window.Telegram.WebApp;
  if(tg){
    tg.expand();tg.ready();
    try{tg.setHeaderColor('#000000')}catch(e){}
    try{tg.setBackgroundColor('#000000')}catch(e){}
    try{tg.disableVerticalSwipes&&tg.disableVerticalSwipes()}catch(e){}
    var u=tg.initDataUnsafe&&tg.initDataUnsafe.user;
    if(u&&u.first_name)window.__tgName=u.first_name;
  }
}catch(e){}

/* ============ UTILS ============ */
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8)}
function nowISO(){return new Date().toISOString()}
function today(){return new Date().toISOString().slice(0,10)}
function yesterday(){var d=new Date();d.setDate(d.getDate()-1);return d.toISOString().slice(0,10)}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function daysBetween(a,b){return Math.floor((new Date(b)-new Date(a))/(24*60*60*1000))}
function pad(n){return String(n).padStart(2,'0')}

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
    var h=window.Telegram&&window.Telegram.WebApp&&window.Telegram.WebApp.HapticFeedback;
    if(!h)return;
    if(type==='success')h.notificationOccurred('success');
    else if(type==='error')h.notificationOccurred('error');
    else h.impactOccurred(type||'light');
  }catch(e){}
}

/* ============ STATE ============ */
var STORAGE_KEY='life_os_v41';

function defaultState(){
  return{
    tasks:[],customHabits:[],customGoals:[],customNotes:[],journalEntries:[],
    customWater:[],customMood:[],customSleep:{},customMeds:[],customMeditation:[],
    customWorkouts:[],timerSessions:[],focusSessions:[],chats:[],
    levelProgress:{},englishProgress:{},skillsProgress:{},paths:[],courses:[],
    domainScores:{},domainHistory:{},metrics:{},
    watchlist:[],watched:[],customResources:[],
    screenStats:{},screenHabits:{},screenHistory:{},screenEntries:[],
    detoxCourseProgress:{},eyeExercises:[],
    challengeProgress:{},dailySurveys:{},todayPlan:null,
    dayPlans:{},weekPlans:{},monthPlans:{},
    learnPlan:{today:[],week:[],month:[]},
    calendarEvents:[],pendingGoogleEvents:[],
    medicalData:{metrics:[],entries:[],profile:{age:null,sex:null,weight:null,height:null,chronic:[]},recommendations:[]},
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
      theme:'dark',provider:'gemini',apiKey:'',activePersona:'coach',waterGoal:8,
      onboardingDone:false,effectsEnabled:true,effectsIntensity:1,animationSpeed:1,
      lastDailySurveyDay:null,dailyLearnTarget:150,
      pwa:{installed:false,installPrompt:null},
      notifications:{enabled:false,lastCheck:null}
    },
    stats:{
      streak:0,lastActiveDay:null,totalDays:0,totalTasksDone:0,
      totalLessonsDone:0,totalWater:0,totalMoodLogs:0,totalWorkouts:0,
      totalMeditations:0,bestStreak:0
    }
  };
}

var state;
try{
  var raw=localStorage.getItem(STORAGE_KEY);
  if(raw){
    var parsed=JSON.parse(raw);
    state=Object.assign(defaultState(),parsed);
    state.settings=Object.assign(defaultState().settings,parsed.settings||{});
    state.stats=Object.assign(defaultState().stats,parsed.stats||{});
    state.profile=Object.assign(defaultState().profile,parsed.profile||{});
    state.integrations=Object.assign(defaultState().integrations,parsed.integrations||{});
    state.medicalData=Object.assign({metrics:[],entries:[],profile:{age:null,sex:null,weight:null,height:null,chronic:[]},recommendations:[]},parsed.medicalData||{});
    ['levelProgress','englishProgress','skillsProgress','domainScores','metrics',
     'challengeProgress','screenHistory','customSleep','dailySurveys','dayPlans','weekPlans','monthPlans','screenStats'].forEach(function(k){
      if(!state[k])state[k]={};
    });
    ['tasks','customHabits','customGoals','customNotes','journalEntries','customWater',
     'customMood','customMeds','customMeditation','customWorkouts','timerSessions',
     'focusSessions','chats','paths','courses','watchlist','watched','customResources',
     'eyeExercises','calendarEvents','screenEntries','pendingGoogleEvents'
    ].forEach(function(k){
      if(!state[k])state[k]=[];
    });
    if(!state.learnPlan)state.learnPlan={today:[],week:[],month:[]};
  }else{state=defaultState()}
}catch(e){state=defaultState()}

function save(){
  try{
    state.settings.updatedAt=nowISO();
    localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
  }catch(e){toast('Ошибка сохранения','error')}
}

/* ============ GLOBALS ============ */
var currentPage='dashboard';
var currentLevelId=null,currentModuleId=null,currentLessonIdx=null;
var currentPathId=null,currentCourseId=null;
var taskFilter='all',taskSearch='',skillsFilter='all',learnSearchText='';
var currentDailySurveyStep=0,currentDailySurveyAnswers={};
var timerInterval=null,timerSeconds=25*60,timerRunning=false,timerMode='pomodoro';
var currentEnglishFilter='all';
var currentVisionExercise=null;
var currentDayPlanDate=today();
var currentLearnPlanPeriod='today';
var v2Filter='all';
var pwaInstallPrompt=null;

/* ============ PAGE STRUCTURE ============ */
var PAGE_PARENTS={
  dashboard:null,tasks:'dashboard',matrix:'tasks',dailyplan:'dashboard',
  learning:'dashboard',learnplan:'learning',learnplanweek:'learnplan',learnplanmonth:'learnplan',
  levels:'learning',levelDetail:'levels',moduleDetail:'levelDetail',
  skills:'learning',paths:'learning',pathDetail:'paths',courses:'learning',
  methods:'learning',english:'learning',memory:'learning',iq:'learning',eq:'learning',
  finance:'learning',neuromodule:'learning',psychology:'learning',thinking:'learning',
  etiquette:'learning',hormones:'learning',wealth:'learning',
  planning:'dashboard',plantoday:'planning',planweek:'planning',planmonth:'planning',
  obsidian:'planning',gcal:'planning',calendar:'planning',
  vision:'dashboard',visionex:'vision',visiontrack:'vision',visiontips:'vision',vision60:'vision',
  ai:'dashboard',health:'dashboard',water:'health',mood:'health',workouts:'health',
  meditation:'health',meds:'health',recovery:'health',recoveryItem:'recovery',medical:'health',
  entertainment:'dashboard',resources:'entertainment',movies:'entertainment',
  series:'entertainment',books:'entertainment',musiclib:'entertainment',
  gameslib:'entertainment',podcastslib:'entertainment',
  habits:'more',goals:'more',notes:'more',journal:'more',
  more:'dashboard',stats:'dashboard',detailedStats:'stats',
  timer:'dashboard',focus:'dashboard',domains:'dashboard',
  profile:'dashboard',settings:'dashboard',integrations:'settings',storage:'settings',
  screentracker:'more',detoxcourse:'screentracker',detoxday:'detoxcourse',
  dailySurvey:'dashboard',survey:'dashboard',plan:'dashboard'
};

var PAGE_TITLES={
  tasks:'Задачи',matrix:'Матрица',dailyplan:'План дня',
  learning:'Обучение',learnplan:'План обучения',learnplanweek:'Неделя',learnplanmonth:'Месяц',
  levels:'Уровни',levelDetail:'Уровень',moduleDetail:'Модуль',
  skills:'Навыки',paths:'Пути',pathDetail:'Путь',courses:'Курсы',
  methods:'Методики',english:'English',memory:'Память',iq:'IQ',eq:'EQ',
  finance:'Финансы',neuromodule:'Нейро',psychology:'Психология',thinking:'Мышление',
  etiquette:'Этикет',hormones:'Гормоны',wealth:'Богатство',
  planning:'Планирование',plantoday:'План дня',planweek:'План недели',
  planmonth:'План месяца',obsidian:'Obsidian',gcal:'Календарь',calendar:'Календарь',
  vision:'Зрение',visionex:'Упражнения',visiontrack:'Трекер',visiontips:'Советы',vision60:'75 упражнений',
  ai:'AI',health:'Здоровье',water:'Вода',mood:'Настроение',
  workouts:'Тренировки',meditation:'Медитации',meds:'Лекарства',
  recovery:'Восстановление',recoveryItem:'Восстановление',medical:'Медицина',
  entertainment:'Досуг',resources:'Ресурсы',movies:'Фильмы',series:'Сериалы',
  books:'Книги',musiclib:'Музыка',gameslib:'Игры',podcastslib:'Подкасты',
  habits:'Привычки',goals:'Цели',notes:'Заметки',journal:'Дневник',
  more:'Ещё',stats:'Статистика',detailedStats:'Детальная',
  timer:'Таймер',focus:'Фокус',domains:'Домены',
  profile:'Профиль',settings:'Настройки',integrations:'Интеграции',storage:'Хранилище',
  screentracker:'Детокс',detoxcourse:'30-дневный курс',detoxday:'День',
  dailySurvey:'Опрос',survey:'Опрос',plan:'План'
};

function updateHeader(page){
  var avatar=document.getElementById('headerAvatar');
  if(avatar&&state.profile)avatar.textContent=state.profile.emoji||'👤';
}
window.updateHeader=updateHeader;

/* ============ THEME ============ */
function startEffects(){
  var overlay=document.getElementById('themeEffect');
  if(!overlay)return;
  overlay.innerHTML='';
  try{
    if(state.settings.effectsEnabled===undefined)state.settings.effectsEnabled=true;
    if(!state.settings.effectsEnabled)return;
    var theme=(window.THEMES||[]).find(function(t){return t.id===state.settings.theme})||{effect:'stars'};
    var effect=theme.effect||'stars';
    function cnt(base){return Math.round(base*(state.settings.effectsIntensity||1)*1.5)}
    if(effect==='stars'||effect==='none'){
      for(var i=0;i<cnt(20);i++){var s=document.createElement('div');s.className='effect-star';s.style.left=Math.random()*100+'%';s.style.top=Math.random()*100+'%';s.style.animationDelay=Math.random()*3+'s';overlay.appendChild(s)}
    }else if(effect==='rain'){
      for(var j=0;j<cnt(20);j++){var d=document.createElement('div');d.className='effect-drop';d.style.left=Math.random()*100+'%';d.style.animationDuration=((Math.random()*1.5+1.5))+'s';d.style.animationDelay=Math.random()*5+'s';d.style.height=(Math.random()*20+12)+'px';overlay.appendChild(d)}
    }else if(effect==='petals'){
      for(var k=0;k<cnt(10);k++){var p=document.createElement('div');p.className='effect-petal';p.textContent='🌸';p.style.left=Math.random()*100+'%';p.style.animationDuration=((Math.random()*8+10))+'s';p.style.animationDelay=Math.random()*10+'s';overlay.appendChild(p)}
    }else if(effect==='leaves'){
      for(var l=0;l<cnt(10);l++){var lf=document.createElement('div');lf.className='effect-leaf';lf.textContent='🍃';lf.style.left=Math.random()*100+'%';lf.style.animationDuration=((Math.random()*8+8))+'s';lf.style.animationDelay=Math.random()*10+'s';overlay.appendChild(lf)}
    }else if(effect==='snow'){
      for(var n=0;n<cnt(15);n++){var sn=document.createElement('div');sn.className='effect-snowflake';sn.textContent='❄';sn.style.left=Math.random()*100+'%';sn.style.animationDuration=((Math.random()*6+8))+'s';sn.style.animationDelay=Math.random()*10+'s';overlay.appendChild(sn)}
    }else if(effect==='waves'){
      for(var w=0;w<cnt(3);w++){var wv=document.createElement('div');wv.className='effect-wave';wv.style.bottom=(w*30)+'px';wv.style.animationDelay=(w*1.5)+'s';overlay.appendChild(wv)}
    }else if(effect==='spark'){
      for(var sk=0;sk<cnt(20);sk++){var spk=document.createElement('div');spk.className='effect-spark';spk.style.left=Math.random()*100+'%';spk.style.top=Math.random()*100+'%';spk.style.animationDelay=Math.random()*2+'s';overlay.appendChild(spk)}
    }else if(effect==='dust'){
      for(var ff=0;ff<cnt(15);ff++){var ffl=document.createElement('div');ffl.className='effect-dust';ffl.style.left=Math.random()*100+'%';ffl.style.top=Math.random()*100+'%';ffl.style.animationDuration=((Math.random()*4+4))+'s';ffl.style.animationDelay=Math.random()*6+'s';overlay.appendChild(ffl)}
    }
    if(overlay.children.length===0){
      for(var x=0;x<cnt(20);x++){var xs=document.createElement('div');xs.className='effect-star';xs.style.left=Math.random()*100+'%';xs.style.top=Math.random()*100+'%';xs.style.animationDelay=Math.random()*3+'s';overlay.appendChild(xs)}
    }
  }catch(e){}
}

function applyTheme(id){
  try{
    var themes=(window.THEMES||[]).map(function(t){return t.id});
    themes.forEach(function(t){document.body.classList.remove('theme-'+t)});
    document.body.classList.add('theme-'+id);
    startEffects();
  }catch(e){document.body.classList.add('theme-dark')}
}

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

/* ============ QUICK TABS ============ */
function renderQuickTabs(page){
  var tabs=(window.QUICK_TABS||{})[page];
  if(!tabs||!tabs.length)return '';
  var html='<div class="quick-tabs">';
  tabs.forEach(function(t){
    html+='<button class="quick-tab '+(currentPage===t.id?'active':'')+'" onclick="navigate(\''+(t.target||t.id)+'\')">'+t.emoji+' '+t.label+'</button>';
  });
  html+='</div>';
  return html;
}

/* ============ NAVIGATION ============ */
function navigate(page){
  if(!page)page='dashboard';
  currentPage=page;
  try{renderTabBar()}catch(e){}
  try{updateHeader(page)}catch(e){}
  var main=document.getElementById('app');
  if(!main)return;
  main.innerHTML='';
  var renderers={
    dashboard:renderDashboard,tasks:renderTasks,matrix:renderMatrix,dailyplan:renderDailyPlan,
    learning:renderLearning,learnplan:renderLearnPlan,learnplanweek:renderLearnPlanWeek,learnplanmonth:renderLearnPlanMonth,
    levels:renderLevels,levelDetail:renderLevelDetail,moduleDetail:renderModuleDetail,
    skills:renderSkills,
    methods:renderMethods,english:renderEnglish,
    memory:renderMemory,iq:renderIQ,eq:renderEQ,finance:renderFinance,
    neuromodule:renderNeuro,psychology:renderPsychology,thinking:renderThinking,
    etiquette:renderEtiquette,hormones:renderHormones,wealth:renderWealth,
    planning:renderPlanning,plantoday:renderPlanToday,planweek:renderPlanWeek,
    planmonth:renderPlanMonth,obsidian:renderObsidian,gcal:renderGcal,
    calendar:renderGcal,
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
    dailySurvey:renderDailySurvey,survey:renderSurvey,plan:renderPersonalPlan
  };
  var fn=renderers[page];
  if(typeof fn!=='function'){
    main.innerHTML='<div class="page"><div class="title-xl">🚧 '+page+'</div><div class="card"><div class="empty"><div class="empty-icon">🚧</div><div class="empty-title">Раздел в разработке</div></div></div></div>';
    return;
  }
  try{fn()}catch(e){
    console.error('Render ['+page+']:',e);
    main.innerHTML='<div class="page"><div class="title-xl">⚠️ Ошибка</div><div class="card"><div class="empty"><div class="empty-icon">⚠️</div><div class="empty-title">'+esc(e.message||'Ошибка')+'</div><div class="empty-text">'+page+'</div></div></div></div>';
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
  html+='<div class="card" style="margin:0;padding:14px;"><div class="row-between"><div><div class="list-title">🌈 Эффекты</div></div><button class="btn btn-ghost btn-xs" onclick="state.settings.effectsEnabled=!state.settings.effectsEnabled;save();startEffects();toast(\'Ок\',\'success\')">'+(state.settings.effectsEnabled?'Вкл':'Выкл')+'</button></div></div>';
  openSheet('Тема',html);
}
function setTheme(id){
  try{
    state.settings.theme=id;applyTheme(id);save();haptic('success');closeSheet();toast('Тема: '+id,'success');
  }catch(e){toast('Ошибка','error');applyTheme('dark')}
}
window.openThemePicker=openThemePicker;
window.setTheme=setTheme;

/* ============ STATS QUICK ============ */
function openStatsQuick(){navigate('stats')}
window.openStatsQuick=openStatsQuick;

/* ============================================================
   DASHBOARD
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
    var p=getLevelProgress(level.id);
    totalDone+=p.done;totalLessons+=p.total;
  });
  var overallPct=totalLessons?Math.round(totalDone/totalLessons*100):0;
  var waterEntry=state.customWater.find(function(w){return w.date===today()});
  var water=waterEntry?waterEntry.count:0;
  var waterGoal=state.settings.waterGoal||8;
  var todayEyeCount=(state.eyeExercises||[]).filter(function(e){return e.date===today()}).length;

  var html='<div class="page"><div class="title-xl">'+greet+userName+'</div>';
  html+=renderDailySurveyCard();
  html+=renderTodayPlanCard();
  html+=renderLearnPlanCard();
  html+='<div class="progress-ring-hero">';
  html+=renderRing(progress,'День','ring-1','✓');
  html+=renderRing(overallPct,'Учёба','ring-2','🎓');
  html+=renderRing(Math.min(100,Math.round(water/waterGoal*100)),'Вода','ring-3','💧');
  html+=renderRing(Math.min(100,(state.stats.streak||0)*10),'Streak','ring-4','🔥');
  html+='</div>';

  var load=getAdaptiveLoad();
  var loadColor=load<50?'var(--danger)':load<80?'var(--warning)':'var(--success)';
  html+='<div class="card"><h2>⚙️ Адаптация</h2><div class="progress"><div class="progress-fill" style="width:'+load+'%;background:'+loadColor+';"></div></div><div class="footnote text-secondary mt-2">Нагрузка: <strong style="color:'+loadColor+';">'+load+'%</strong></div></div>';

  html+='<div class="card"><h2>💡 Подсказки</h2>';
  getSmartTips().forEach(function(t){html+='<div class="footnote text-secondary mb-2">'+esc(t)+'</div>'});
  html+='</div>';

  html+=renderWisdom();
  html+=renderChallenges();

  html+='<div class="card"><h2>👁 Зрение — быстро ('+todayEyeCount+' сегодня)</h2>';
  html+='<div class="group-grid">';
  html+='<div class="group-item" onclick="startEyeExercise(\'v2_17\')"><div class="group-item-icon">⏱</div><div class="group-item-label">20-20-20</div></div>';
  html+='<div class="group-item" onclick="startEyeExercise(\'v2_16\')"><div class="group-item-icon">✋</div><div class="group-item-label">Пальминг</div></div>';
  html+='<div class="group-item" onclick="navigate(\'vision60\')"><div class="group-item-icon">🤸</div><div class="group-item-label">Все 75</div></div>';
  html+='</div></div>';

  html+='<div class="card"><h2>⚡ Быстро</h2><div class="group-grid">';
  html+='<div class="group-item" onclick="openEntityEditor(\'task\',null)"><div class="group-item-icon">➕</div><div class="group-item-label">Задача</div></div>';
  html+='<div class="group-item" onclick="addWater()"><div class="group-item-icon">💧</div><div class="group-item-label">'+water+'/'+waterGoal+'</div></div>';
  html+='<div class="group-item" onclick="quickMoodLog()"><div class="group-item-icon">💭</div><div class="group-item-label">Настроение</div></div>';
  html+='<div class="group-item" onclick="openSleepEditor()"><div class="group-item-icon">😴</div><div class="group-item-label">Сон</div></div>';
  html+='<div class="group-item" onclick="navigate(\'timer\')"><div class="group-item-icon">⏱</div><div class="group-item-label">Таймер</div></div>';
  html+='<div class="group-item" onclick="navigate(\'plantoday\')"><div class="group-item-icon">📅</div><div class="group-item-label">План</div></div>';
  html+='</div></div>';

  html+='<div class="card"><h2>📋 Задачи</h2>';
  var pending=state.tasks.filter(function(t){return t.status==='pending'});
  if(pending.length){
    var sorted=pending.slice().sort(function(a,b){return getEisenhowerPriority(a)-getEisenhowerPriority(b)});
    sorted.slice(0,5).forEach(function(t){html+=taskRow(t)});
  }else{html+='<div class="empty"><div class="empty-icon">✨</div><div class="empty-title">Всё выполнено</div></div>'}
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}

function getEisenhowerQuadrant(t){
  var important=t.priority==='high'||t.priority==='medium';
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
  return '<div class="task-item '+(checked?'completed':'')+'" onclick="openEntityEditor(\'task\',\''+t.id+'\')">'+
    '<div class="priority-bar '+(pColors[t.priority]||'medium')+'"></div>'+
    '<button class="task-checkbox '+(checked?'checked':'')+'" onclick="event.stopPropagation();toggleTask(\''+t.id+'\')">'+(checked?'✓':'')+'</button>'+
    '<div class="task-content"><div class="task-title">'+qEmoji+' '+esc(t.title)+'</div>'+
    '<div class="task-meta"><span>'+(t.planned_time||0)+' мин</span>'+
    (t.category?'<span>· '+esc(t.category)+'</span>':'')+
    (t.due_date?'<span>· 📅 '+t.due_date.slice(0,10)+'</span>':'')+
    (overdue?'<span style="color:var(--danger);">· ⚠️</span>':'')+
    '</div></div></div>';
}

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
    '<div class="ring-value"><div>'+value+'%</div>'+(icon?'<div class="ring-icon">'+icon+'</div>':'')+'</div></div>'+
    '<div class="ring-label">'+label+'</div></div>';
}

function renderWisdom(){
  var w=(typeof getTodayWisdom==='function')?getTodayWisdom():{text:'Начни.',author:'Неизвестный',action:'Сделай шаг'};
  var html='<div class="insight-card"><div class="insight-title">💎 Мудрость дня</div><div class="insight-text">"'+esc(w.text)+'"</div><div class="insight-author">— '+esc(w.author)+'</div><div class="insight-apply">→ '+esc(w.action)+'</div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="applyWisdom()">Внедрить в жизнь</button></div>';
  return html;
}
function applyWisdom(){
  var w=(typeof getTodayWisdom==='function')?getTodayWisdom():{action:'Сделай шаг',text:''};
  var task={id:uid(),title:'💎 '+w.action,description:'Мудрость дня: '+w.text,category:'Развитие',planned_time:15,status:'pending',priority:'medium',created_at:nowISO()};
  state.tasks.unshift(task);
  state.xp=(state.xp||0)+15;
  save();haptic('success');
  toast('✓ Мудрость внедрена','success');
  navigate('tasks');
}
window.applyWisdom=applyWisdom;

function renderDailySurveyCard(){
  if(!needsDailySurvey())return '';
  var html='<div class="card" style="background:linear-gradient(135deg,rgba(255,169,64,.2),rgba(255,107,107,.15));border-color:rgba(255,169,64,.4);">';
  html+='<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">';
  html+='<div style="font-size:36px;">📋</div>';
  html+='<div style="flex:1;"><div style="font-size:16px;font-weight:800;margin-bottom:2px;">Опрос о вчера</div>';
  html+='<div class="footnote text-secondary">10 вопросов → план на сегодня</div></div></div>';
  html+='<button class="btn btn-primary btn-block" onclick="openDailySurvey(true)">Начать опрос</button>';
  html+='</div>';
  return html;
}
function renderTodayPlanCard(){
  var plan=state.todayPlan;
  if(!plan||plan.date!==today())return '';
  var html='<div class="card" style="background:linear-gradient(135deg,rgba(61,220,151,.15),rgba(91,158,255,.1));border-color:rgba(61,220,151,.35);">';
  html+='<div class="row-between mb-3"><div style="font-size:16px;font-weight:800;">🎯 План на сегодня</div>';
  html+='<div class="badge badge-brand">'+plan.load+'%</div></div>';
  if(plan.notes&&plan.notes.length){plan.notes.forEach(function(n){html+='<div class="footnote text-secondary" style="margin-bottom:6px;">'+esc(n)+'</div>'})}
  plan.items.forEach(function(item){
    html+='<div style="display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--divider);">';
    html+='<div style="font-size:20px;flex-shrink:0;">'+item.icon+'</div>';
    html+='<div style="flex:1;"><div style="font-weight:700;font-size:13px;">'+esc(item.title)+'</div>';
    html+='<div class="footnote text-secondary">'+esc(item.time)+' · '+esc(item.desc)+'</div></div></div>';
  });
  html+='</div>';
  return html;
}

function renderLearnPlanCard(){
  var plan=state.learnPlan||{today:[]};
  if(!plan.today||!plan.today.length){
    plan.today=generateLearnPlan('today');
    state.learnPlan=plan;save();
  }
  if(!plan.today.length)return '';
  var doneCount=plan.today.filter(function(x){return x.done}).length;
  var html='<div class="card" style="background:linear-gradient(135deg,color-mix(in srgb,var(--brand) 15%,transparent),color-mix(in srgb,var(--brand-2) 10%,transparent));border-color:color-mix(in srgb,var(--brand) 35%,transparent);">';
  html+='<div class="row-between mb-3"><div style="font-size:16px;font-weight:800;">🎓 План обучения</div>';
  html+='<div class="badge badge-brand">'+doneCount+'/'+plan.today.length+'</div></div>';
  plan.today.slice(0,4).forEach(function(item){
    var done=item.done;
    html+='<div style="display:flex;gap:10px;align-items:center;padding:6px 0;'+(done?'opacity:.5;':'')+'">';
    html+='<div style="font-size:18px;">'+(done?'✅':item.icon)+'</div>';
    html+='<div style="flex:1;"><div style="font-weight:600;font-size:13px;'+(done?'text-decoration:line-through;':'')+'">'+esc(item.title)+'</div>';
    html+='<div class="footnote text-secondary">'+item.minutes+' мин · '+esc(item.type)+'</div></div>';
    if(!done)html+='<button class="btn btn-xs btn-ghost" onclick="event.stopPropagation();startLearnItem(\''+item.id+'\')">Начать</button>';
    html+='</div>';
  });
  html+='<button class="btn btn-ghost btn-block mt-3" onclick="navigate(\'learnplan\')">Весь план обучения</button>';
  html+='</div>';
  return html;
}

function generateLearnPlan(period){
  var levels=window.LEARNING_LEVELS||[];
  var items=[];
  var limits={today:6,week:15,month:30};
  var max=limits[period]||6;
  levels.forEach(function(level){
    level.modules.forEach(function(mod){
      mod.lessons.forEach(function(lesson,i){
        var key=level.id+'_'+mod.id+'_'+i;
        if(!state.levelProgress[key]&&items.length<max){
          items.push({id:key,title:lesson.title,type:'Урок · '+level.title,icon:level.emoji,minutes:15,done:false,action:'level',levelId:level.id,moduleId:mod.id,lessonIdx:i});
        }
      });
    });
  });
  if(items.length<max){
    (window.ENGLISH_125||[]).slice(0,10).forEach(function(l){
      if(!state.englishProgress[l.id]&&items.length<max){
        items.push({id:'eng_'+l.id,title:l.title,type:'English '+l.level,icon:'🇬🇧',minutes:15,done:false,action:'english',lessonId:l.id});
      }
    });
  }
  return items.slice(0,max);
}
function startLearnItem(id){
  var plan=state.learnPlan||{today:[]};
  var item=plan.today.find(function(x){return x.id===id});
  if(!item)return;
  if(item.action==='level'){
    currentLevelId=item.levelId;currentModuleId=item.moduleId;
    navigate('moduleDetail');
    setTimeout(function(){openLesson(item.lessonIdx)},200);
  }else if(item.action==='english'){
    navigate('english');
  }
}
window.startLearnItem=startLearnItem;

function renderLearnPlan(){
  var plan=state.learnPlan||{today:[],week:[],month:[]};
  if(!plan.today||!plan.today.length){plan.today=generateLearnPlan('today');state.learnPlan=plan;save()}
  var target=state.settings.dailyLearnTarget||150;
  var totalMinutes=plan.today.reduce(function(a,x){return a+x.minutes},0);
  var pct=Math.min(100,Math.round(totalMinutes/target*100));
  var html='<div class="page"><div class="title-xl">🗓 План обучения</div>';
  html+='<div class="quick-tabs">';
  html+='<button class="quick-tab '+(currentLearnPlanPeriod==='today'?'active':'')+'" onclick="currentLearnPlanPeriod=\'today\';renderLearnPlan()">📅 Сегодня</button>';
  html+='<button class="quick-tab '+(currentLearnPlanPeriod==='week'?'active':'')+'" onclick="navigate(\'learnplanweek\')">🗓 Неделя</button>';
  html+='<button class="quick-tab '+(currentLearnPlanPeriod==='month'?'active':'')+'" onclick="navigate(\'learnplanmonth\')">📆 Месяц</button>';
  html+='</div>';
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:12px;">Сегодня</div><div style="font-size:40px;font-weight:800;">'+totalMinutes+' / '+target+' мин</div>';
  html+='<div class="progress" style="margin-top:10px;background:rgba(255,255,255,.25);height:6px;"><div class="progress-fill" style="width:'+pct+'%;background:#fff;"></div></div></div>';
  html+='<div class="card"><h2>⚙️ Настройки</h2>';
  html+='<div class="list-row"><div class="list-icon">⏱</div><div class="list-body"><div class="list-title">Цель на день</div><div class="list-subtitle">'+target+' минут</div></div><button class="btn btn-ghost btn-xs" onclick="changeLearnTarget()">Изменить</button></div>';
  html+='<button class="btn btn-primary btn-block mt-2" onclick="regenerateLearnPlan()">🔄 Пересобрать план</button></div>';
  html+='<div class="card"><h2>📋 Задачи на сегодня</h2>';
  if(plan.today.length){
    plan.today.forEach(function(item){
      html+='<div style="display:flex;gap:10px;align-items:center;padding:10px 0;border-bottom:1px solid var(--divider);">';
      html+='<div style="font-size:22px;">'+(item.done?'✅':item.icon)+'</div>';
      html+='<div style="flex:1;"><div style="font-weight:700;font-size:14px;'+(item.done?'text-decoration:line-through;opacity:.6;':'')+'">'+esc(item.title)+'</div>';
      html+='<div class="footnote text-secondary">'+item.minutes+' мин · '+esc(item.type)+'</div></div>';
      if(!item.done)html+='<button class="btn btn-xs btn-primary" onclick="startLearnItem(\''+item.id+'\')">▶</button>';
      else html+='<div class="badge badge-success">✓</div>';
      html+='</div>';
    });
  }else{html+='<div class="empty"><div class="empty-icon">✨</div><div class="empty-title">Всё изучено!</div></div>'}
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
function regenerateLearnPlan(){
  state.learnPlan={today:generateLearnPlan('today'),week:[],month:[]};
  save();toast('🔄 План пересобран','success');
  renderLearnPlan();
}
function changeLearnTarget(){
  var val=prompt('Цель обучения на день (минут):',state.settings.dailyLearnTarget||150);
  if(!val)return;
  state.settings.dailyLearnTarget=parseInt(val)||150;
  save();renderLearnPlan();
}
window.regenerateLearnPlan=regenerateLearnPlan;
window.changeLearnTarget=changeLearnTarget;

function renderLearnPlanWeek(){
  var levels=window.LEARNING_LEVELS||[];
  var items=[];
  levels.forEach(function(level){
    level.modules.forEach(function(mod){
      mod.lessons.forEach(function(lesson,i){
        var key=level.id+'_'+mod.id+'_'+i;
        if(!state.levelProgress[key]){
          items.push({key:key,title:lesson.title,type:level.title+' · '+mod.title,icon:level.emoji,minutes:15});
        }
      });
    });
  });
  var totalMin=items.slice(0,15).reduce(function(a,x){return a+x.minutes},0);
  var html='<div class="page"><div class="title-xl">🗓 План на неделю</div>';
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:12px;">Цель недели</div><div style="font-size:40px;font-weight:800;">'+totalMin+' мин</div><div style="opacity:.9;font-size:12px;">~'+Math.round(totalMin/60)+' часов</div></div>';
  html+='<div class="card"><h2>📋 15 уроков на неделю</h2>';
  if(items.length){
    items.slice(0,15).forEach(function(item){
      html+='<div class="list-row" onclick="openLevelLessonFromSearch(\''+item.key.split('_')[0]+'\',\''+item.key.split('_')[1]+'\','+item.key.split('_')[2]+')"><div class="list-icon">'+item.icon+'</div><div class="list-body"><div class="list-title">'+esc(item.title)+'</div><div class="list-subtitle">'+esc(item.type)+' · '+item.minutes+' мин</div></div><div class="list-chevron">›</div></div>';
    });
  }else{html+='<div class="empty"><div class="empty-icon">✨</div><div class="empty-title">Всё изучено!</div></div>'}
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
function renderLearnPlanMonth(){
  var levels=window.LEARNING_LEVELS||[];
  var items=[];
  levels.forEach(function(level){
    level.modules.forEach(function(mod){
      mod.lessons.forEach(function(lesson,i){
        var key=level.id+'_'+mod.id+'_'+i;
        if(!state.levelProgress[key]){
          items.push({key:key,title:lesson.title,type:level.title+' · '+mod.title,icon:level.emoji,minutes:15});
        }
      });
    });
  });
  var totalMin=items.slice(0,30).reduce(function(a,x){return a+x.minutes},0);
  var html='<div class="page"><div class="title-xl">📆 План на месяц</div>';
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:12px;">Цель месяца</div><div style="font-size:40px;font-weight:800;">'+totalMin+' мин</div><div style="opacity:.9;font-size:12px;">~'+Math.round(totalMin/60)+' часов · '+items.slice(0,30).length+' уроков</div></div>';
  html+='<div class="card"><h2>📋 30 уроков на месяц</h2>';
  if(items.length){
    items.slice(0,30).forEach(function(item){
      html+='<div class="list-row" onclick="openLevelLessonFromSearch(\''+item.key.split('_')[0]+'\',\''+item.key.split('_')[1]+'\','+item.key.split('_')[2]+')"><div class="list-icon">'+item.icon+'</div><div class="list-body"><div class="list-title">'+esc(item.title)+'</div><div class="list-subtitle">'+esc(item.type)+' · '+item.minutes+' мин</div></div><div class="list-chevron">›</div></div>';
    });
  }else{html+='<div class="empty"><div class="empty-icon">✨</div><div class="empty-title">Всё изучено!</div></div>'}
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
function openLevelLessonFromSearch(levelId,moduleId,idx){
  currentLevelId=levelId;currentModuleId=moduleId;
  navigate('moduleDetail');
  setTimeout(function(){openLesson(parseInt(idx))},100);
}
window.openLevelLessonFromSearch=openLevelLessonFromSearch;

/* ============================================================
   TASKS
   ============================================================ */
function renderTasks(){
  var counts={
    all:state.tasks.length,
    pending:state.tasks.filter(function(t){return t.status==='pending'}).length,
    completed:state.tasks.filter(function(t){return t.status==='completed'}).length
  };
  var filtered=state.tasks.slice();
  if(taskFilter!=='all')filtered=filtered.filter(function(t){return t.status===taskFilter});
  if(taskSearch){var q=taskSearch.toLowerCase();filtered=filtered.filter(function(t){return t.title.toLowerCase().indexOf(q)>=0})}
  var html='<div class="page"><div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">✅ Задачи</div><button class="btn btn-primary btn-sm" onclick="openEntityEditor(\'task\',null)">+ Новая</button></div>';
  html+='<div class="search-bar"><span style="color:var(--text-3);font-size:18px;">🔍</span><input type="search" placeholder="Поиск..." value="'+esc(taskSearch)+'" oninput="taskSearch=this.value;renderTasks()"/></div>';
  html+='<div class="segmented" style="margin-bottom:14px;"><button class="segmented-item '+(taskFilter==='all'?'active':'')+'" onclick="taskFilter=\'all\';renderTasks()">Все ('+counts.all+')</button><button class="segmented-item '+(taskFilter==='pending'?'active':'')+'" onclick="taskFilter=\'pending\';renderTasks()">Активные ('+counts.pending+')</button><button class="segmented-item '+(taskFilter==='completed'?'active':'')+'" onclick="taskFilter=\'completed\';renderTasks()">Готовые ('+counts.completed+')</button></div>';
  if(filtered.length){
    if(taskFilter==='pending'){
      var sorted=filtered.slice().sort(function(a,b){return getEisenhowerPriority(a)-getEisenhowerPriority(b)});
      sorted.forEach(function(t){html+=taskRow(t)});
    }else{filtered.forEach(function(t){html+=taskRow(t)})}
  }else{html+='<div class="empty"><div class="empty-icon">📋</div><div class="empty-title">'+(taskSearch?'Ничего':'Нет задач')+'</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function toggleTask(id){
  var t=state.tasks.find(function(x){return x.id===id});if(!t)return;
  t.status=t.status==='completed'?'pending':'completed';
  t.actual_time=t.status==='completed'?(t.planned_time||0):0;
  t.updated_at=nowISO();
  if(t.status==='completed')state.stats.totalTasksDone=(state.stats.totalTasksDone||0)+1;
  save();
  if(t.status==='completed')toast('✓ Выполнено','success');
  haptic('success');checkAchievements();
  if(currentPage==='tasks')renderTasks();else renderDashboard();
}
window.toggleTask=toggleTask;

/* ============================================================
   MATRIX
   ============================================================ */
function renderMatrix(){
  var pending=state.tasks.filter(function(t){return t.status==='pending'});
  var q1=[],q2=[],q3=[],q4=[];
  pending.forEach(function(t){
    var q=getEisenhowerQuadrant(t);
    if(q==='q1')q1.push(t);else if(q==='q2')q2.push(t);else if(q==='q3')q3.push(t);else q4.push(t);
  });
  var html='<div class="page"><div class="title-xl">🔢 Матрица Эйзенхауэра</div>';
  html+='<div class="footnote text-secondary mb-3">🔥 Q1 делай · 📌 Q2 планируй · ⚡ Q3 делегируй · 🗑 Q4 удали</div>';
  html+='<div class="matrix-grid-2x2">';
  html+='<div class="matrix-quadrant matrix-q1" onclick="openMatrixQuadrant(\'q1\')"><div class="matrix-q-title">🔥 Срочно + Важно</div><div class="matrix-q-count">'+q1.length+'</div><div class="matrix-q-sub">Делай сейчас</div></div>';
  html+='<div class="matrix-quadrant matrix-q2" onclick="openMatrixQuadrant(\'q2\')"><div class="matrix-q-title">📌 Не срочно + Важно</div><div class="matrix-q-count">'+q2.length+'</div><div class="matrix-q-sub">Планируй</div></div>';
  html+='<div class="matrix-quadrant matrix-q3" onclick="openMatrixQuadrant(\'q3\')"><div class="matrix-q-title">⚡ Срочно + Неважно</div><div class="matrix-q-count">'+q3.length+'</div><div class="matrix-q-sub">Делегируй</div></div>';
  html+='<div class="matrix-quadrant matrix-q4" onclick="openMatrixQuadrant(\'q4\')"><div class="matrix-q-title">🗑 Не срочно + Неважно</div><div class="matrix-q-count">'+q4.length+'</div><div class="matrix-q-sub">Удали</div></div>';
  html+='</div>';
  if(pending.length){
    html+='<div class="card"><h2>📋 Все активные ('+pending.length+')</h2>';
    pending.forEach(function(t){html+=taskRow(t)});
    html+='</div>';
  }else{
    html+='<div class="card"><div class="empty"><div class="empty-icon">✨</div><div class="empty-title">Нет активных задач</div></div></div>';
  }
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openMatrixQuadrant(q){
  var pending=state.tasks.filter(function(t){return t.status==='pending'&&getEisenhowerQuadrant(t)===q});
  var titles={q1:'🔥 Срочно + Важно',q2:'📌 Не срочно + Важно',q3:'⚡ Срочно + Неважно',q4:'🗑 Не срочно + Неважно'};
  var html='<div style="margin-bottom:12px;"><div style="font-size:16px;font-weight:800;">'+titles[q]+'</div></div>';
  if(!pending.length){html+='<div class="empty"><div class="empty-icon">✨</div><div class="empty-title">Пусто</div></div>';openSheet(titles[q],html);return}
  html+='<div class="card">';
  pending.forEach(function(t){html+=taskRow(t)});
  html+='</div>';
  openSheet(titles[q],html);
}
window.openMatrixQuadrant=openMatrixQuadrant;

/* ============================================================
   DAILY PLAN
   ============================================================ */
function renderDailyPlan(){
  var plan=state.todayPlan;
  var html='<div class="page"><div class="title-xl">📅 План дня</div>';
  if(!plan||plan.date!==today()){
    html+='<div class="card"><div class="empty"><div class="empty-icon">📋</div><div class="empty-title">План не сформирован</div><div class="empty-text">Пройди опрос дня</div><button class="btn btn-primary btn-block mt-3" onclick="openDailySurvey(true)">Пройти опрос</button></div></div>';
    html+='</div>';
    document.getElementById('app').innerHTML=html;
    return;
  }
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:12px;">Нагрузка</div><div style="font-size:40px;font-weight:800;">'+plan.load+'%</div></div>';
  html+='<div class="card"><h2>📋 Что делать</h2>';
  plan.items.forEach(function(item){
    html+='<div style="display:flex;gap:10px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--divider);">';
    html+='<div style="font-size:22px;flex-shrink:0;">'+item.icon+'</div>';
    html+='<div style="flex:1;"><div style="font-weight:700;font-size:14px;">'+esc(item.title)+'</div>';
    html+='<div class="footnote text-secondary">'+esc(item.time)+' · '+esc(item.desc)+'</div></div></div>';
  });
  html+='</div>';
  if(plan.basedOn){
    html+='<div class="card"><h2>📊 На основе опроса</h2>';
    if(plan.basedOn.sleepHours)html+='<div class="stat-row"><span class="stat-row-label">Сон</span><span class="stat-row-value">'+plan.basedOn.sleepHours+' ч</span></div>';
    if(plan.basedOn.mood)html+='<div class="stat-row"><span class="stat-row-label">Настроение</span><span class="stat-row-value">'+plan.basedOn.mood+'/10</span></div>';
    if(plan.basedOn.energy)html+='<div class="stat-row"><span class="stat-row-label">Энергия</span><span class="stat-row-value">'+plan.basedOn.energy+'/10</span></div>';
    html+='</div>';
  }
  html+='<button class="btn btn-ghost btn-block mt-3" onclick="openDailySurvey(true)">🔄 Обновить опрос</button>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}

/* ============================================================
   ENTITY EDITOR
   ============================================================ */
function openEntityEditor(type,id){
  var entity=null;
  if(id){
    var map={task:'tasks',habit:'customHabits',goal:'customGoals',note:'customNotes',journal:'journalEntries',meditation:'customMeditation',workout:'customWorkouts',med:'customMeds'};
    var arr=state[map[type]]||[];
    entity=arr.find(function(x){return x.id===id});
  }
  var isNew=!entity;
  var html='';
  if(type==='task')html=taskEditorHTML(entity);
  else if(type==='habit')html=habitEditorHTML(entity);
  else if(type==='goal')html=goalEditorHTML(entity);
  else if(type==='note')html=noteEditorHTML(entity);
  else if(type==='journal')html=journalEditorHTML(entity);
  else if(type==='meditation')html=meditationEditorHTML(entity);
  else if(type==='workout')html=workoutEditorHTML(entity);
  else if(type==='med')html=medEditorHTML(entity);
  else html='<div class="empty"><div class="empty-icon">🚧</div><div class="empty-title">Тип не поддержан</div></div>';
  openSheet((isNew?'Новая ':'')+({task:'задача',habit:'привычка',goal:'цель',note:'заметка',journal:'запись',meditation:'медитация',workout:'тренировка',med:'лекарство'}[type]||type),html);
}
function taskEditorHTML(t){
  t=t||{};
  return '<div class="field"><label class="field-label">Название *</label><input type="text" id="ent-title" value="'+esc(t.title||'')+'"/></div>'+
  '<div class="field"><label class="field-label">Описание</label><textarea id="ent-desc">'+esc(t.description||'')+'</textarea></div>'+
  '<div class="row" style="gap:8px;"><div style="flex:1;"><label class="field-label">Приоритет</label><select id="ent-priority"><option value="low"'+(t.priority==='low'?' selected':'')+'>🟢 Низкий</option><option value="medium"'+(!t.priority||t.priority==='medium'?' selected':'')+'>🟡 Средний</option><option value="high"'+(t.priority==='high'?' selected':'')+'>🔴 Высокий</option></select></div><div style="flex:1;"><label class="field-label">Категория</label><input type="text" id="ent-category" value="'+esc(t.category||'Работа')+'"/></div></div>'+
  '<div class="row" style="gap:8px;"><div style="flex:1;"><label class="field-label">Время (мин)</label><input type="number" id="ent-time" value="'+(t.planned_time||30)+'" min="0" step="5"/></div><div style="flex:1;"><label class="field-label">Дедлайн</label><input type="datetime-local" id="ent-due" value="'+(t.due_date?t.due_date.slice(0,16):'')+'"/></div></div>'+
  '<button class="btn btn-primary btn-block mt-3" onclick="saveEntity(\'task\''+(t.id?',\''+t.id+'\'':'')+')">'+(t.id?'💾 Сохранить':'➕ Создать')+'</button>'+
  (t.id?'<button class="btn btn-danger btn-block mt-2" onclick="deleteEntity(\'task\',\''+t.id+'\')">🗑 Удалить</button>':'');
}
function habitEditorHTML(h){
  h=h||{};
  return '<div class="field"><label class="field-label">Название *</label><input type="text" id="ent-title" value="'+esc(h.title||'')+'"/></div>'+
  '<div class="field"><label class="field-label">Иконка</label><input type="text" id="ent-icon" value="'+esc(h.icon||'✅')+'" maxlength="4"/></div>'+
  '<div class="field"><label class="field-label">Категория</label><select id="ent-category"><option value="Здоровье"'+(h.category==='Здоровье'?' selected':'')+'>💪 Здоровье</option><option value="Психика"'+(h.category==='Психика'?' selected':'')+'>🧠 Психика</option><option value="Развитие"'+(h.category==='Развитие'?' selected':'')+'>📚 Развитие</option></select></div>'+
  '<button class="btn btn-primary btn-block mt-3" onclick="saveEntity(\'habit\''+(h.id?',\''+h.id+'\'':'')+')">'+(h.id?'💾 Сохранить':'➕ Создать')+'</button>'+
  (h.id?'<button class="btn btn-danger btn-block mt-2" onclick="deleteEntity(\'habit\',\''+h.id+'\')">🗑 Удалить</button>':'');
}
function goalEditorHTML(g){
  g=g||{};
  return '<div class="field"><label class="field-label">Название *</label><input type="text" id="ent-title" value="'+esc(g.title||'')+'"/></div>'+
  '<div class="field"><label class="field-label">Метрика</label><input type="text" id="ent-metric" value="'+esc(g.metric||'')+'"/></div>'+
  '<div class="row" style="gap:8px;"><div style="flex:1;"><label class="field-label">Цель</label><input type="number" id="ent-target" value="'+(g.target||'')+'" step="0.1"/></div><div style="flex:1;"><label class="field-label">Текущее</label><input type="number" id="ent-current" value="'+(g.current||0)+'" step="0.1"/></div></div>'+
  '<button class="btn btn-primary btn-block mt-3" onclick="saveEntity(\'goal\''+(g.id?',\''+g.id+'\'':'')+')">'+(g.id?'💾 Сохранить':'➕ Создать')+'</button>'+
  (g.id?'<button class="btn btn-danger btn-block mt-2" onclick="deleteEntity(\'goal\',\''+g.id+'\')">🗑 Удалить</button>':'');
}
function noteEditorHTML(n){
  n=n||{};
  return '<div class="field"><label class="field-label">Заголовок *</label><input type="text" id="ent-title" value="'+esc(n.title||'')+'"/></div>'+
  '<div class="field"><label class="field-label">Содержание</label><textarea id="ent-content" style="min-height:200px;">'+esc(n.content||'')+'</textarea></div>'+
  '<button class="btn btn-primary btn-block mt-3" onclick="saveEntity(\'note\''+(n.id?',\''+n.id+'\'':'')+')">'+(n.id?'💾 Сохранить':'➕ Создать')+'</button>'+
  (n.id?'<button class="btn btn-danger btn-block mt-2" onclick="deleteEntity(\'note\',\''+n.id+'\')">🗑 Удалить</button>':'');
}
function journalEditorHTML(j){
  j=j||{};
  return '<div class="field"><label class="field-label">Дата</label><input type="date" id="ent-date" value="'+(j.date||today())+'"/></div>'+
  '<div class="field"><label class="field-label">3 победы</label><textarea id="ent-wins">'+esc(j.wins||'')+'</textarea></div>'+
  '<div class="field"><label class="field-label">1 урок</label><textarea id="ent-lesson">'+esc(j.lesson||'')+'</textarea></div>'+
  '<div class="field"><label class="field-label">Мысли</label><textarea id="ent-content" style="min-height:150px;">'+esc(j.content||'')+'</textarea></div>'+
  '<button class="btn btn-primary btn-block mt-3" onclick="saveEntity(\'journal\''+(j.id?',\''+j.id+'\'':'')+')">'+(j.id?'💾 Сохранить':'➕ Создать')+'</button>'+
  (j.id?'<button class="btn btn-danger btn-block mt-2" onclick="deleteEntity(\'journal\',\''+j.id+'\')">🗑 Удалить</button>':'');
}
function meditationEditorHTML(m){
  m=m||{};
  return '<div class="field"><label class="field-label">Практика *</label><input type="text" id="ent-title" value="'+esc(m.title||'Медитация')+'"/></div>'+
  '<div class="field"><label class="field-label">Длительность (мин)</label><input type="number" id="ent-duration" value="'+(m.duration||10)+'" min="1"/></div>'+
  '<button class="btn btn-primary btn-block mt-3" onclick="saveEntity(\'meditation\''+(m.id?',\''+m.id+'\'':'')+')">'+(m.id?'💾 Сохранить':'➕ Создать')+'</button>'+
  (m.id?'<button class="btn btn-danger btn-block mt-2" onclick="deleteEntity(\'meditation\',\''+m.id+'\')">🗑 Удалить</button>':'');
}
function workoutEditorHTML(w){
  w=w||{};
  return '<div class="field"><label class="field-label">Тип *</label><input type="text" id="ent-title" value="'+esc(w.title||'Силовая')+'"/></div>'+
  '<div class="field"><label class="field-label">Длительность (мин)</label><input type="number" id="ent-duration" value="'+(w.duration||60)+'" min="5"/></div>'+
  '<div class="field"><label class="field-label">Интенсивность 1-10</label><input type="number" id="ent-intensity" min="1" max="10" value="'+(w.intensity||7)+'"/></div>'+
  '<button class="btn btn-primary btn-block mt-3" onclick="saveEntity(\'workout\''+(w.id?',\''+w.id+'\'':'')+')">'+(w.id?'💾 Сохранить':'➕ Создать')+'</button>'+
  (w.id?'<button class="btn btn-danger btn-block mt-2" onclick="deleteEntity(\'workout\',\''+w.id+'\')">🗑 Удалить</button>':'');
}
function medEditorHTML(m){
  m=m||{};
  return '<div class="field"><label class="field-label">Название *</label><input type="text" id="ent-title" value="'+esc(m.title||'')+'"/></div>'+
  '<div class="field"><label class="field-label">Дозировка</label><input type="text" id="ent-dosage" value="'+esc(m.dosage||'')+'"/></div>'+
  '<div class="field"><label class="field-label">Время</label><input type="time" id="ent-time" value="'+esc(m.time||'')+'"/></div>'+
  '<button class="btn btn-primary btn-block mt-3" onclick="saveEntity(\'med\''+(m.id?',\''+m.id+'\'':'')+')">'+(m.id?'💾 Сохранить':'➕ Создать')+'</button>'+
  (m.id?'<button class="btn btn-danger btn-block mt-2" onclick="deleteEntity(\'med\',\''+m.id+'\')">🗑 Удалить</button>':'');
}
function saveEntity(type,id){
  var map={task:'tasks',habit:'customHabits',goal:'customGoals',note:'customNotes',journal:'journalEntries',meditation:'customMeditation',workout:'customWorkouts',med:'customMeds'};
  var key=map[type];if(!state[key])state[key]=[];
  var arr=state[key];
  var entity=id?arr.find(function(x){return x.id===id}):null;
  var isNew=!entity;
  if(!entity)entity={id:uid(),created_at:nowISO()};
  entity.updated_at=nowISO();
  var title=(document.getElementById('ent-title')||{}).value||'';
  if(!title.trim())return toast('Введите название','error');
  entity.title=title.trim();
  if(document.getElementById('ent-desc'))entity.description=(document.getElementById('ent-desc').value||'').trim();
  if(document.getElementById('ent-content'))entity.content=(document.getElementById('ent-content').value||'').trim();
  if(document.getElementById('ent-category'))entity.category=document.getElementById('ent-category').value;
  if(document.getElementById('ent-priority'))entity.priority=document.getElementById('ent-priority').value;
  if(document.getElementById('ent-time'))entity.planned_time=parseInt(document.getElementById('ent-time').value)||30;
  if(document.getElementById('ent-due'))entity.due_date=document.getElementById('ent-due').value;
  if(document.getElementById('ent-icon'))entity.icon=(document.getElementById('ent-icon').value||'✅').trim();
  if(document.getElementById('ent-date'))entity.date=document.getElementById('ent-date').value;
  if(document.getElementById('ent-wins'))entity.wins=(document.getElementById('ent-wins').value||'').trim();
  if(document.getElementById('ent-lesson'))entity.lesson=(document.getElementById('ent-lesson').value||'').trim();
  if(document.getElementById('ent-duration'))entity.duration=parseInt(document.getElementById('ent-duration').value)||10;
  if(document.getElementById('ent-intensity'))entity.intensity=parseInt(document.getElementById('ent-intensity').value)||7;
  if(document.getElementById('ent-metric'))entity.metric=(document.getElementById('ent-metric').value||'').trim();
  if(document.getElementById('ent-target'))entity.target=parseFloat(document.getElementById('ent-target').value)||0;
  if(document.getElementById('ent-current'))entity.current=parseFloat(document.getElementById('ent-current').value)||0;
  if(document.getElementById('ent-dosage'))entity.dosage=(document.getElementById('ent-dosage').value||'').trim();
  if(isNew)arr.unshift(entity);
  save();haptic('success');closeSheet();
  toast(isNew?'✓ Создано':'💾 Сохранено','success');
  checkAchievements();
  if(currentPage==='tasks')renderTasks();
  else if(currentPage==='habits')renderHabits();
  else if(currentPage==='goals')renderGoals();
  else if(currentPage==='notes')renderNotes();
  else if(currentPage==='journal')renderJournal();
  else if(currentPage==='meditation')renderMeditation();
  else if(currentPage==='workouts')renderWorkouts();
  else if(currentPage==='meds')renderMeds();
  else renderDashboard();
}
function deleteEntity(type,id){
  if(!confirm('Удалить?'))return;
  var map={task:'tasks',habit:'customHabits',goal:'customGoals',note:'customNotes',journal:'journalEntries',meditation:'customMeditation',workout:'customWorkouts',med:'customMeds'};
  state[map[type]]=(state[map[type]]||[]).filter(function(x){return x.id!==id});
  save();closeSheet();toast('Удалено','info');
  if(currentPage==='tasks')renderTasks();else renderDashboard();
}
window.openEntityEditor=openEntityEditor;
window.saveEntity=saveEntity;
window.deleteEntity=deleteEntity;

/* ============================================================
   LEARNING
   ============================================================ */
function getLevelProgress(levelId){
  var level=(window.LEARNING_LEVELS||[]).find(function(l){return l.id===levelId});
  if(!level)return{done:0,total:0,pct:0};
  var total=0,done=0;
  level.modules.forEach(function(mod){
    mod.lessons.forEach(function(l,idx){
      total++;
      if(state.levelProgress&&state.levelProgress[levelId+'_'+mod.id+'_'+idx])done++;
    });
  });
  return{done:done,total:total,pct:total>0?Math.round(done/total*100):0};
}
function isLevelUnlocked(levelId){
  var idx=(window.LEARNING_LEVELS||[]).findIndex(function(l){return l.id===levelId});
  if(idx<=0)return true;
  return getLevelProgress(window.LEARNING_LEVELS[idx-1].id).pct===100;
}
function isModuleUnlocked(level,moduleIdx){
  if(moduleIdx===0)return true;
  var prevMod=level.modules[moduleIdx-1];
  return prevMod.lessons.every(function(l,idx){return state.levelProgress[level.id+'_'+prevMod.id+'_'+idx]});
}
function isLessonUnlocked(level,module,lessonIdx){
  if(lessonIdx===0)return true;
  return !!state.levelProgress[level.id+'_'+module.id+'_'+(lessonIdx-1)];
}

function renderLearning(){
  var totalDone=0,totalLessons=0;
  (window.LEARNING_LEVELS||[]).forEach(function(level){
    var p=getLevelProgress(level.id);
    totalDone+=p.done;totalLessons+=p.total;
  });
  var overallPct=totalLessons?Math.round(totalDone/totalLessons*100):0;
  var skillsDone=Object.keys(state.skillsProgress||{}).length;
  var engDone=Object.keys(state.englishProgress||{}).length;
  var html='<div class="page"><div class="title-xl">🎓 Обучение</div>';
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:12px;">Прогресс</div><div style="font-size:40px;font-weight:800;line-height:1;margin-bottom:10px;">'+overallPct+'%</div><div class="progress" style="background:rgba(255,255,255,.25);height:6px;"><div class="progress-fill" style="width:'+overallPct+'%;background:#fff;"></div></div></div>';
  html+='<div class="compact-grid">';
  html+='<div class="compact-item" onclick="navigate(\'learnplan\')"><span class="compact-icon">🗓</span><span>План обучения</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'levels\')"><span class="compact-icon">🌱</span><span>Уровни</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'english\')"><span class="compact-icon">🇬🇧</span><span>English '+engDone+'/'+(window.ENGLISH_125||[]).length+'</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'skills\')"><span class="compact-icon">💎</span><span>Навыки '+skillsDone+'/'+(window.SKILLS_LIBRARY||[]).length+'</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'courses\')"><span class="compact-icon">📖</span><span>Курсы</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'methods\')"><span class="compact-icon">🎯</span><span>Методики '+(window.METHODS_LIBRARY||[]).length+'</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'psychology\')"><span class="compact-icon">🧠</span><span>Психология '+(window.PSYCHOLOGY_TOPICS||[]).length+'</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'thinking\')"><span class="compact-icon">💡</span><span>Мышление '+(window.THINKING_TOPICS||[]).length+'</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'etiquette\')"><span class="compact-icon">🎩</span><span>Этикет '+(window.ETIQUETTE_TOPICS||[]).length+'</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'hormones\')"><span class="compact-icon">🧬</span><span>Гормоны '+(window.HORMONES||[]).length+'</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'wealth\')"><span class="compact-icon">💰</span><span>Богатство '+(window.WEALTH_MODULES||[]).length+'</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'memory\')"><span class="compact-icon">🧠</span><span>Память</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'iq\')"><span class="compact-icon">🎯</span><span>IQ</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'eq\')"><span class="compact-icon">❤️</span><span>EQ</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'finance\')"><span class="compact-icon">💰</span><span>Финансы</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'neuromodule\')"><span class="compact-icon">🔬</span><span>Нейро</span></div>';
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}

function renderLevels(){
  var html='<div class="page"><div class="title-xl">🌱 Уровни</div>';
  (window.LEARNING_LEVELS||[]).forEach(function(level){
    var p=getLevelProgress(level.id);
    var unlocked=isLevelUnlocked(level.id);
    var completed=p.pct===100;
    var cls='level-card';
    if(completed)cls+=' completed';else if(!unlocked)cls+=' locked';else if(p.pct>0)cls+=' active';
    html+='<div class="'+cls+'" onclick="'+(unlocked?'openLevel(\''+level.id+'\')':'toast(\'Заверши предыдущий\',\'warning\')')+'"><div class="level-header"><div class="level-num">'+(completed?'✓':level.num)+'</div><div class="level-info"><div class="level-title">'+level.emoji+' '+level.title+'</div><div class="level-subtitle">'+level.subtitle+'</div></div></div><div class="level-desc">'+level.desc+'</div>';
    if(unlocked&&p.pct>0)html+='<div class="progress"><div class="progress-fill" style="width:'+p.pct+'%;"></div></div>';
    html+='</div>';
  });
  html+='</div>';document.getElementById('app').innerHTML=html;
}
function openLevel(id){currentLevelId=id;navigate('levelDetail')}
function renderLevelDetail(){
  var level=(window.LEARNING_LEVELS||[]).find(function(l){return l.id===currentLevelId});
  if(!level){navigate('learning');return}
  var p=getLevelProgress(level.id);
  var html='<div class="page">';
  html+='<div style="text-align:center;margin-bottom:20px;"><div style="font-size:56px;">'+level.emoji+'</div><div class="title-xl">Уровень '+level.num+': '+level.title+'</div></div>';
  html+='<div class="card"><div class="row-between mb-2"><span class="subhead">Прогресс</span><span class="subhead text-secondary">'+p.done+'/'+p.total+'</span></div><div class="progress"><div class="progress-fill" style="width:'+p.pct+'%;"></div></div></div>';
  html+='<div class="card"><h2>📦 Модули</h2>';
  level.modules.forEach(function(mod,i){
    var unlocked=isModuleUnlocked(level,i);
    var modDone=mod.lessons.every(function(l,idx){return state.levelProgress[level.id+'_'+mod.id+'_'+idx]});
    var modCount=mod.lessons.filter(function(l,idx){return state.levelProgress[level.id+'_'+mod.id+'_'+idx]}).length;
    var cls='module-card';if(modDone)cls+=' completed';else if(!unlocked)cls+=' locked';
    html+='<div class="'+cls+'" onclick="'+(unlocked?'openModule(\''+level.id+'\',\''+mod.id+'\')':'toast(\'Сначала предыдущий\',\'warning\')')+'"><div class="module-header"><div class="module-icon">'+(modDone?'✓':mod.emoji)+'</div><div class="module-info"><div class="module-title">'+mod.title+'</div><div class="module-meta">'+modCount+'/'+mod.lessons.length+(unlocked?'':' · 🔒')+'</div></div></div><div class="module-desc">'+mod.desc+'</div></div>';
  });
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
function openModule(lid,mid){currentLevelId=lid;currentModuleId=mid;navigate('moduleDetail')}
function renderModuleDetail(){
  var level=(window.LEARNING_LEVELS||[]).find(function(l){return l.id===currentLevelId});
  if(!level){navigate('learning');return}
  var module=level.modules.find(function(m){return m.id===currentModuleId});
  if(!module){navigate('levelDetail');return}
  var doneCount=module.lessons.filter(function(l,idx){return state.levelProgress[level.id+'_'+module.id+'_'+idx]}).length;
  var html='<div class="page">';
  html+='<div style="text-align:center;margin-bottom:20px;"><div style="font-size:48px;">'+module.emoji+'</div><div class="title-xl">'+module.title+'</div></div>';
  html+='<div class="card"><div class="progress"><div class="progress-fill" style="width:'+Math.round(doneCount/module.lessons.length*100)+'%;"></div></div></div>';
  html+='<div class="card"><h2>📖 Уроки</h2>';
  module.lessons.forEach(function(lesson,i){
    var key=level.id+'_'+module.id+'_'+i;
    var isDone=!!state.levelProgress[key];
    var unlocked=isLessonUnlocked(level,module,i);
    var cls='lesson-row';if(isDone)cls+=' done';else if(!unlocked)cls+=' locked';else cls+=' current';
    html+='<div class="'+cls+'" onclick="'+(unlocked?'openLesson('+i+')':'toast(\'Сначала предыдущий\',\'warning\')')+'"><div class="lesson-num">'+(isDone?'✓':(i+1))+'</div><div class="lesson-title">'+lesson.title+'</div><div style="color:var(--text-4);font-size:20px;">›</div></div>';
  });
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
function openLesson(idx){
  currentLessonIdx=idx;
  var level=(window.LEARNING_LEVELS||[]).find(function(l){return l.id===currentLevelId});if(!level)return;
  var module=level.modules.find(function(m){return m.id===currentModuleId});if(!module)return;
  var lesson=module.lessons[idx];if(!lesson)return;
  var key=level.id+'_'+module.id+'_'+idx;
  var isDone=!!state.levelProgress[key];
  var html='<div class="page">';
  html+='<div style="margin-bottom:16px;"><div class="footnote text-tertiary" style="margin-bottom:6px;">Уровень '+level.num+' · '+module.title+' · '+(idx+1)+'/'+module.lessons.length+'</div><div style="font-size:22px;font-weight:800;line-height:1.2;">'+lesson.title+'</div></div>';
  html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚 Теория</div><div class="lesson-content">'+formatLesson(lesson.theory||'')+'</div></div>';
  html+='<div class="lesson-section practice"><div class="lesson-section-title">🎯 Практика</div><div class="lesson-content">'+esc(lesson.practice||'')+'</div></div>';
  html+='</div>';
  if(!isDone)html+='<button class="btn btn-primary btn-block" onclick="completeLesson()">✓ Изучено</button>';
  else{
    html+='<div class="badge badge-success" style="display:block;text-align:center;padding:12px;font-size:13px;">✓ Урок изучен</div>';
    if(idx<module.lessons.length-1)html+='<button class="btn btn-primary btn-block mt-2" onclick="openLesson('+(idx+1)+')">Следующий →</button>';
  }
  html+='</div>';
  document.getElementById('app').innerHTML=html;
  window.scrollTo({top:0});
}
function formatLesson(text){
  var h=esc(text);
  h=h.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
  h=h.replace(/^• (.+)$/gm,'<li>$1</li>');
  h=h.replace(/(<li>[\s\S]*?<\/li>)(?!\s*<li>)/g,'<ul>$1</ul>');
  h=h.replace(/\n\n/g,'</p><p>');
  h=h.replace(/\n/g,'<br>');
  return '<p>'+h+'</p>';
}
function completeLesson(){
  var level=(window.LEARNING_LEVELS||[]).find(function(l){return l.id===currentLevelId});if(!level)return;
  var module=level.modules.find(function(m){return m.id===currentModuleId});if(!module)return;
  var key=level.id+'_'+module.id+'_'+currentLessonIdx;
  if(!state.levelProgress)state.levelProgress={};
  state.levelProgress[key]=true;
  state.xp=(state.xp||0)+25;
  var plan=state.learnPlan||{today:[]};
  plan.today.forEach(function(x){if(x.id===key)x.done=true});
  state.learnPlan=plan;
  save();haptic('success');toast('✓ Изучено! +25 XP','success');
  checkAchievements();openLesson(currentLessonIdx);
}
window.openLevel=openLevel;
window.openModule=openModule;
window.openLesson=openLesson;
window.completeLesson=completeLesson;

/* ============================================================
   SKILLS
   ============================================================ */
function renderSkills(){
  var cats=window.SKILLS_CATEGORIES||[];
  var lib=window.SKILLS_LIBRARY||[];
  var filtered=skillsFilter==='all'?lib:lib.filter(function(s){return s.cat===skillsFilter});
  var done=Object.keys(state.skillsProgress||{}).length;
  var html='<div class="page"><div class="title-xl">💎 Навыки</div>';
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:12px;">Прогресс</div><div style="font-size:40px;font-weight:800;">'+done+'/'+lib.length+'</div></div>';
  html+='<div class="quick-tabs"><button class="quick-tab '+(skillsFilter==='all'?'active':'')+'" onclick="skillsFilter=\'all\';renderSkills()">Все ('+lib.length+')</button>';
  cats.forEach(function(c){
    html+='<button class="quick-tab '+(skillsFilter===c.id?'active':'')+'" onclick="skillsFilter=\''+c.id+'\';renderSkills()">'+c.emoji+' '+c.name+'</button>';
  });
  html+='</div>';
  filtered.forEach(function(s){
    var isDone=state.skillsProgress&&state.skillsProgress[s.id];
    html+='<div class="method-card" onclick="openSkill(\''+s.id+'\')"><div class="method-header"><div class="method-emoji">'+s.emoji+'</div><div style="flex:1;"><div class="method-title">'+s.title+'</div><div class="method-cat">'+s.level+' · '+s.duration+'</div></div>'+(isDone?'<span class="badge badge-success">✓</span>':'<div class="list-chevron">›</div>')+'</div><div class="method-desc">'+esc(s.desc)+'</div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openSkill(id){
  var s=(window.SKILLS_LIBRARY||[]).find(function(x){return x.id===id});
  if(!s)return;
  var isDone=state.skillsProgress&&state.skillsProgress[s.id];
  var cat=(window.SKILLS_CATEGORIES||[]).find(function(c){return c.id===s.cat})||{};
  var html='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:48px;">'+s.emoji+'</div><div style="font-size:20px;font-weight:800;">'+s.title+'</div><div class="footnote text-secondary">'+(cat.emoji||'')+' '+(cat.name||'')+' · '+s.level+' · '+s.duration+'</div></div>';
  html+='<div class="card"><div class="footnote text-secondary">'+esc(s.desc)+'</div></div>';
  html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚 Теория</div><div class="lesson-content">'+formatLesson(s.theory||'')+'</div></div></div>';
  if(s.practice&&s.practice.length){html+='<div class="card"><div class="lesson-section practice"><div class="lesson-section-title">🎯 Практика</div><div class="lesson-content"><ul>'+s.practice.map(function(p){return '<li>'+esc(p)+'</li>'}).join('')+'</ul></div></div></div>'}
  if(s.effect)html+='<div class="insight-card"><div class="insight-title">💎 Эффект</div><div class="insight-text">'+esc(s.effect)+'</div></div>';
  if(s.tips)html+='<div class="insight-card"><div class="insight-title">💡 Совет</div><div class="insight-text">'+esc(s.tips)+'</div></div>';
  if(!isDone)html+='<button class="btn btn-primary btn-block mt-3" onclick="completeSkill(\''+s.id+'\')">✓ Изучено</button>';
  else html+='<div class="badge badge-success" style="display:block;text-align:center;padding:12px;">✓ Изучено</div>';
  openSheet(s.title,html);
}
function completeSkill(id){
  if(!state.skillsProgress)state.skillsProgress={};
  state.skillsProgress[id]=true;
  state.xp=(state.xp||0)+20;
  save();haptic('success');toast('✓ Навык изучен! +20 XP','success');
  checkAchievements();closeSheet();renderSkills();
}
window.openSkill=openSkill;
window.completeSkill=completeSkill;

/* ============================================================
   METHODS
   ============================================================ */
function renderMethods(){
  var html='<div class="page"><div class="title-xl">🎯 Методики</div>';
  (window.METHODS_LIBRARY||[]).forEach(function(m){
    html+='<div class="method-card" onclick="openMethod(\''+m.id+'\')"><div class="method-header"><div class="method-emoji">'+m.emoji+'</div><div style="flex:1;"><div class="method-title">'+m.title+'</div><div class="method-cat">'+m.category+'</div></div><div class="list-chevron">›</div></div><div class="method-desc">'+m.desc+'</div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openMethod(id){
  var m=(window.METHODS_LIBRARY||[]).find(function(x){return x.id===id});if(!m)return;
  var html='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:48px;">'+m.emoji+'</div><div style="font-size:20px;font-weight:800;">'+m.title+'</div><div class="footnote text-secondary">'+m.category+'</div></div>';
  html+='<div class="card"><div class="footnote text-secondary">'+m.desc+'</div></div>';
  html+='<div class="card"><h2>📋 Шаги</h2>';
  (m.steps||[]).forEach(function(step,i){
    html+='<div style="display:flex;gap:10px;padding:6px 0;"><div style="width:22px;height:22px;border-radius:50%;background:var(--brand);color:#fff;display:grid;place-items:center;flex-shrink:0;font-size:11px;font-weight:700;">'+(i+1)+'</div><div style="flex:1;font-size:13px;line-height:1.4;">'+step+'</div></div>';
  });
  html+='</div>';
  if(m.base)html+='<div class="insight-card"><div class="insight-title">🔬 База</div><div class="insight-text">'+m.base+'</div></div>';
  openSheet(m.title,html);
}
window.openMethod=openMethod;

/* ============================================================
   PSYCHOLOGY / THINKING / ETIQUETTE / HORMONES / WEALTH
   ============================================================ */
function renderPsychology(){
  var topics=window.PSYCHOLOGY_TOPICS||[];
  var cats={};
  topics.forEach(function(t){if(!cats[t.cat])cats[t.cat]=[];cats[t.cat].push(t)});
  var html='<div class="page"><div class="title-xl">🧠 Психология</div>';
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:12px;">Тем</div><div style="font-size:40px;font-weight:800;">'+topics.length+'</div></div>';
  Object.keys(cats).forEach(function(cat){
    html+='<div class="card"><h2>'+cat+' ('+cats[cat].length+')</h2>';
    cats[cat].forEach(function(t){
      html+='<div class="method-card" onclick="openPsychologyTopic(\''+t.id+'\')"><div class="method-header"><div class="method-emoji">'+t.emoji+'</div><div style="flex:1;"><div class="method-title">'+t.title+'</div></div><div class="list-chevron">›</div></div></div>';
    });
    html+='</div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openPsychologyTopic(id){
  var t=(window.PSYCHOLOGY_TOPICS||[]).find(function(x){return x.id===id});if(!t)return;
  var html='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:48px;">'+t.emoji+'</div><div style="font-size:20px;font-weight:800;">'+t.title+'</div><div class="footnote text-secondary">'+t.cat+'</div></div>';
  html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚 Теория</div><div class="lesson-content">'+formatLesson(t.theory)+'</div></div></div>';
  if(t.science)html+='<div class="card"><div class="lesson-section science"><div class="lesson-section-title">🔬 Наука</div><div class="lesson-content">'+formatLesson(t.science)+'</div></div></div>';
  if(t.practice)html+='<div class="card"><div class="lesson-section practice"><div class="lesson-section-title">🎯 Практика</div><div class="lesson-content"><ul>'+t.practice.map(function(p){return '<li>'+esc(p)+'</li>'}).join('')+'</ul></div></div></div>';
  if(t.effect)html+='<div class="insight-card"><div class="insight-title">💎 Эффект</div><div class="insight-text">'+esc(t.effect)+'</div></div>';
  if(t.tips)html+='<div class="insight-card"><div class="insight-title">💡 Совет</div><div class="insight-text">'+esc(t.tips)+'</div></div>';
  if(t.test&&t.test.length)html+=renderQuiz(t.test);
  openSheet(t.title,html);
}
function renderQuiz(test){
  var html='<div class="card"><h2>📝 Проверь себя</h2>';
  test.forEach(function(q,i){
    html+='<div style="margin-bottom:12px;"><div style="font-weight:700;font-size:13px;margin-bottom:6px;">'+(i+1)+'. '+esc(q.q)+'</div>';
    q.options.forEach(function(opt,j){
      html+='<button class="btn btn-ghost btn-block mb-2" style="justify-content:flex-start;text-align:left;" onclick="checkAnswer(this,'+(j===q.correct)+')">'+esc(opt)+'</button>';
    });
    html+='</div>';
  });
  html+='</div>';
  return html;
}
function checkAnswer(btn,correct){
  if(correct){btn.style.background='rgba(61,220,151,.3)';btn.style.borderColor='var(--success)';}
  else{btn.style.background='rgba(255,107,107,.3)';btn.style.borderColor='var(--danger)';}
  btn.disabled=true;
}
window.checkAnswer=checkAnswer;
window.openPsychologyTopic=openPsychologyTopic;
window.renderPsychology=renderPsychology;

function renderThinking(){
  var topics=window.THINKING_TOPICS||[];
  var cats={};
  topics.forEach(function(t){if(!cats[t.cat])cats[t.cat]=[];cats[t.cat].push(t)});
  var html='<div class="page"><div class="title-xl">💡 Мышление</div>';
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:12px;">Материалов</div><div style="font-size:40px;font-weight:800;">'+topics.length+'</div></div>';
  Object.keys(cats).forEach(function(cat){
    html+='<div class="card"><h2>'+cat+' ('+cats[cat].length+')</h2>';
    cats[cat].forEach(function(t){
      html+='<div class="method-card" onclick="openThinkingTopic(\''+t.id+'\')"><div class="method-header"><div class="method-emoji">'+t.emoji+'</div><div style="flex:1;"><div class="method-title">'+t.title+'</div></div><div class="list-chevron">›</div></div></div>';
    });
    html+='</div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openThinkingTopic(id){
  var t=(window.THINKING_TOPICS||[]).find(function(x){return x.id===id});if(!t)return;
  var html='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:48px;">'+t.emoji+'</div><div style="font-size:20px;font-weight:800;">'+t.title+'</div><div class="footnote text-secondary">'+t.cat+'</div></div>';
  html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚 Теория</div><div class="lesson-content">'+formatLesson(t.theory)+'</div></div></div>';
  if(t.science)html+='<div class="card"><div class="lesson-section science"><div class="lesson-section-title">🔬 Наука</div><div class="lesson-content">'+formatLesson(t.science)+'</div></div></div>';
  if(t.practice)html+='<div class="card"><div class="lesson-section practice"><div class="lesson-section-title">🎯 Практика</div><div class="lesson-content"><ul>'+t.practice.map(function(p){return '<li>'+esc(p)+'</li>'}).join('')+'</ul></div></div></div>';
  if(t.effect)html+='<div class="insight-card"><div class="insight-title">💎 Эффект</div><div class="insight-text">'+esc(t.effect)+'</div></div>';
  if(t.tips)html+='<div class="insight-card"><div class="insight-title">💡 Совет</div><div class="insight-text">'+esc(t.tips)+'</div></div>';
  openSheet(t.title,html);
}
window.openThinkingTopic=openThinkingTopic;
window.renderThinking=renderThinking;

function renderEtiquette(){
  var topics=window.ETIQUETTE_TOPICS||[];
  var cats={};
  topics.forEach(function(t){if(!cats[t.cat])cats[t.cat]=[];cats[t.cat].push(t)});
  var html='<div class="page"><div class="title-xl">🎩 Этикет</div>';
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:12px;">Материалов</div><div style="font-size:40px;font-weight:800;">'+topics.length+'</div></div>';
  Object.keys(cats).forEach(function(cat){
    html+='<div class="card"><h2>'+cat+' ('+cats[cat].length+')</h2>';
    cats[cat].forEach(function(t){
      html+='<div class="method-card" onclick="openEtiquetteTopic(\''+t.id+'\')"><div class="method-header"><div class="method-emoji">'+t.emoji+'</div><div style="flex:1;"><div class="method-title">'+t.title+'</div></div><div class="list-chevron">›</div></div></div>';
    });
    html+='</div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openEtiquetteTopic(id){
  var t=(window.ETIQUETTE_TOPICS||[]).find(function(x){return x.id===id});if(!t)return;
  var html='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:48px;">'+t.emoji+'</div><div style="font-size:20px;font-weight:800;">'+t.title+'</div><div class="footnote text-secondary">'+t.cat+'</div></div>';
  html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚 Теория</div><div class="lesson-content">'+formatLesson(t.theory)+'</div></div></div>';
  if(t.science)html+='<div class="card"><div class="lesson-section science"><div class="lesson-section-title">🔬 Наука</div><div class="lesson-content">'+formatLesson(t.science)+'</div></div></div>';
  if(t.practice)html+='<div class="card"><div class="lesson-section practice"><div class="lesson-section-title">🎯 Практика</div><div class="lesson-content"><ul>'+t.practice.map(function(p){return '<li>'+esc(p)+'</li>'}).join('')+'</ul></div></div></div>';
  if(t.effect)html+='<div class="insight-card"><div class="insight-title">💎 Эффект</div><div class="insight-text">'+esc(t.effect)+'</div></div>';
  if(t.tips)html+='<div class="insight-card"><div class="insight-title">💡 Совет</div><div class="insight-text">'+esc(t.tips)+'</div></div>';
  if(t.test&&t.test.length)html+=renderQuiz(t.test);
  openSheet(t.title,html);
}
window.openEtiquetteTopic=openEtiquetteTopic;
window.renderEtiquette=renderEtiquette;

function renderHormones(){
  var hormones=window.HORMONES||[];
  var html='<div class="page"><div class="title-xl">🧬 Гормоны</div>';
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:12px;">Справочник</div><div style="font-size:40px;font-weight:800;">'+hormones.length+'</div></div>';
  hormones.forEach(function(h){
    html+='<div class="method-card" onclick="openHormone(\''+h.id+'\')"><div class="method-header"><div class="method-emoji">'+h.emoji+'</div><div style="flex:1;"><div class="method-title">'+h.name+'</div><div class="method-cat">'+h.role+'</div></div><div class="list-chevron">›</div></div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openHormone(id){
  var h=(window.HORMONES||[]).find(function(x){return x.id===id});if(!h)return;
  var html='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:48px;">'+h.emoji+'</div><div style="font-size:22px;font-weight:800;">'+h.name+'</div><div class="footnote text-secondary">'+h.role+'</div></div>';
  if(h.what)html+='<div class="card"><div class="lesson-section theory"><div class="lesson-section-title">📖 Что это</div><div class="lesson-content">'+formatLesson(h.what)+'</div></div></div>';
  if(h.where)html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📍 Где вырабатывается</div><div class="lesson-content">'+formatLesson(h.where)+'</div></div></div>';
  if(h.when)html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">⏰ Когда растёт</div><div class="lesson-content">'+formatLesson(h.when)+'</div></div></div>';
  if(h.up&&h.up.length)html+='<div class="card"><div class="lesson-section practice"><div class="lesson-section-title">📈 Как повысить</div><div class="lesson-content"><ul>'+h.up.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul></div></div></div>';
  if(h.down&&h.down.length)html+='<div class="card"><div class="lesson-section theory"><div class="lesson-section-title">📉 Чего избегать</div><div class="lesson-content"><ul>'+h.down.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul></div></div></div>';
  if(h.food)html+='<div class="card"><h2>🥗 Еда</h2><div class="footnote text-secondary">'+esc(h.food)+'</div></div>';
  if(h.sleep)html+='<div class="card"><h2>😴 Сон</h2><div class="footnote text-secondary">'+esc(h.sleep)+'</div></div>';
  if(h.sport)html+='<div class="card"><h2>🏋️ Спорт</h2><div class="footnote text-secondary">'+esc(h.sport)+'</div></div>';
  if(h.normal)html+='<div class="card"><h2>✅ Норма</h2><div class="footnote text-secondary">'+esc(h.normal)+'</div></div>';
  if(h.imbalance)html+='<div class="card" style="background:rgba(255,107,107,.08);border-color:rgba(255,107,107,.3);"><h2>⚠️ Дисбаланс</h2><div class="footnote text-secondary">'+esc(h.imbalance)+'</div></div>';
  if(h.protocol&&h.protocol.length)html+='<div class="card"><h2>🎯 Протокол</h2><ul>'+h.protocol.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul></div>';
  if(h.example)html+='<div class="insight-card"><div class="insight-title">💡 Пример</div><div class="insight-text">'+esc(h.example)+'</div></div>';
  if(h.symptoms&&h.symptoms.length)html+='<div class="card"><h2>⚠️ Симптомы дисбаланса</h2><ul>'+h.symptoms.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul></div>';
  openSheet(h.name,html);
}
window.openHormone=openHormone;
window.renderHormones=renderHormones;

function renderWealth(){
  var modules=window.WEALTH_MODULES||[];
  var html='<div class="page"><div class="title-xl">💰 Богатство</div>';
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:12px;">Модулей</div><div style="font-size:40px;font-weight:800;">'+modules.length+'</div></div>';
  modules.forEach(function(m){
    html+='<div class="method-card" onclick="openWealthModule(\''+m.id+'\')"><div class="method-header"><div class="method-emoji">'+m.emoji+'</div><div style="flex:1;"><div class="method-title">'+m.title+'</div></div><div class="list-chevron">›</div></div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openWealthModule(id){
  var m=(window.WEALTH_MODULES||[]).find(function(x){return x.id===id});if(!m)return;
  var html='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:48px;">'+m.emoji+'</div><div style="font-size:20px;font-weight:800;">'+m.title+'</div></div>';
  html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚 Теория</div><div class="lesson-content">'+formatLesson(m.theory)+'</div></div></div>';
  if(m.science)html+='<div class="card"><div class="lesson-section science"><div class="lesson-section-title">🔬 Наука</div><div class="lesson-content">'+formatLesson(m.science)+'</div></div></div>';
  if(m.practice)html+='<div class="card"><div class="lesson-section practice"><div class="lesson-section-title">🎯 Практика</div><div class="lesson-content"><ul>'+m.practice.map(function(p){return '<li>'+esc(p)+'</li>'}).join('')+'</ul></div></div></div>';
  if(m.effect)html+='<div class="insight-card"><div class="insight-title">💎 Эффект</div><div class="insight-text">'+esc(m.effect)+'</div></div>';
  if(m.tips)html+='<div class="insight-card"><div class="insight-title">💡 Совет</div><div class="insight-text">'+esc(m.tips)+'</div></div>';
  openSheet(m.title,html);
}
window.openWealthModule=openWealthModule;
window.renderWealth=renderWealth;

/* ============================================================
   ENGLISH
   ============================================================ */
function renderEnglish(){
  var all=window.ENGLISH_125||[];
  var totalDone=0;
  all.forEach(function(l){if(state.englishProgress&&state.englishProgress[l.id])totalDone++});
  var pct=all.length?Math.round(totalDone/all.length*100):0;
  var html='<div class="page"><div class="title-xl">🇬🇧 English</div>';
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:12px;">Прогресс</div><div style="font-size:40px;font-weight:800;">'+pct+'%</div><div style="opacity:.9;font-size:12px;margin-top:6px;">'+totalDone+'/'+all.length+'</div></div>';
  ['A1','A2','B1','B2','C1'].forEach(function(lvl){
    var lessons=all.filter(function(l){return l.level===lvl});
    var done=lessons.filter(function(l){return state.englishProgress&&state.englishProgress[l.id]}).length;
    var lpct=lessons.length?Math.round(done/lessons.length*100):0;
    var cls='level-card';if(lpct===100)cls+=' completed';else if(lpct>0)cls+=' active';
    html+='<div class="'+cls+'" onclick="openEnglishLvl(\''+lvl+'\')"><div class="level-header"><div class="level-num">'+lvl+'</div><div class="level-info"><div class="level-title">'+lvl+' — '+lessons.length+' уроков</div><div class="level-subtitle">'+done+'/'+lessons.length+'</div></div></div><div class="progress"><div class="progress-fill" style="width:'+lpct+'%;"></div></div></div>';
    if(lpct===100&&(window.ENGLISH_TESTS||[]).find(function(t){return t.level===lvl})){
      var test=(window.ENGLISH_TESTS||[]).find(function(t){return t.level===lvl});
      html+='<button class="btn btn-warning btn-block mb-3" onclick="startEnglishTest(\''+test.id+'\')">📝 '+test.title+' ('+test.questions+' вопросов)</button>';
    }
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openEnglishLvl(lvl){
  var all=window.ENGLISH_125||[];
  var lessons=all.filter(function(l){return l.level===lvl});
  var html='<div class="page"><div class="title-xl">'+lvl+'</div>';
  html+='<div class="card">';
  lessons.forEach(function(lesson,i){
    var isDone=state.englishProgress&&state.englishProgress[lesson.id];
    html+='<div class="lesson-row '+(isDone?'done':'')+'" onclick="openEnglishLess(\''+lesson.id+'\')"><div class="lesson-num">'+(isDone?'✓':(i+1))+'</div><div class="lesson-title">'+lesson.title+'</div><div style="color:var(--text-4);font-size:20px;">›</div></div>';
  });
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
function openEnglishLess(lessonId){
  var all=window.ENGLISH_125||[];
  var lesson=all.find(function(l){return l.id===lessonId});if(!lesson)return;
  var isDone=state.englishProgress&&state.englishProgress[lesson.id];
  var html='<div style="margin-bottom:12px;"><div class="footnote text-tertiary">'+lesson.level+' · '+lesson.id+'</div><div style="font-size:20px;font-weight:800;">'+lesson.title+'</div></div>';
  html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚 Теория</div><div class="lesson-content">'+formatLesson(lesson.theory||'')+'</div></div></div>';
  html+='<div class="card"><div class="lesson-section practice"><div class="lesson-section-title">🎯 Практика</div><div class="lesson-content">'+esc(lesson.practice||'')+'</div></div></div>';
  if(!isDone)html+='<button class="btn btn-primary btn-block mt-3" onclick="completeEnglishLess(\''+lesson.id+'\')">✓ Изучено</button>';
  else html+='<div class="badge badge-success" style="display:block;text-align:center;padding:12px;">✓ Изучено</div>';
  openSheet(lesson.title,html);
}
function completeEnglishLess(id){
  if(!state.englishProgress)state.englishProgress={};
  state.englishProgress[id]=true;
  state.xp=(state.xp||0)+15;
  save();haptic('success');toast('✓ Изучено! +15 XP','success');
  checkAchievements();closeSheet();renderEnglish();
}
function startEnglishTest(id){
  var test=(window.ENGLISH_TESTS||[]).find(function(t){return t.id===id});if(!test)return;
  var html='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:48px;">📝</div><div style="font-size:20px;font-weight:800;">'+test.title+'</div><div class="footnote text-secondary">'+test.questions+' вопросов · проходной '+test.pass+'%</div></div>';
  html+='<div class="card"><div class="footnote text-secondary">Тест проверит все темы уровня '+test.level+'. После прохождения ты получишь сертификат.</div></div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="toast(\'Тест будет доступен в следующем обновлении\',\'info\');closeSheet()">▶ Начать тест</button>';
  openSheet(test.title,html);
}
window.openEnglishLvl=openEnglishLvl;
window.openEnglishLess=openEnglishLess;
window.completeEnglishLess=completeEnglishLess;
window.startEnglishTest=startEnglishTest;

/* ============================================================
   GENERIC MODULES
   ============================================================ */
function renderMemory(){renderGenericModule('Память','🧠')}
function renderIQ(){renderGenericModule('IQ','🎯')}
function renderEQ(){renderGenericModule('EQ','❤️')}
function renderFinance(){renderGenericModule('Финансы','💰')}
function renderNeuro(){renderGenericModule('Нейро','🔬')}
function renderGenericModule(name,emoji){
  var html='<div class="page"><div class="title-xl">'+emoji+' '+name+'</div>';
  html+='<div class="card"><div class="empty"><div class="empty-icon">📭</div><div class="empty-title">Раздел в разработке</div><div class="empty-text">Скоро здесь будет '+name+'</div></div></div>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}

/* ============================================================
   HEALTH
   ============================================================ */
function renderHealth(){
  var waterEntry=state.customWater.find(function(w){return w.date===today()});
  var water=waterEntry?waterEntry.count:0;
  var waterGoal=state.settings.waterGoal||8;
  var mood=(state.customMood||[]).find(function(m){return m.date===today()});
  var sleep=(state.customSleep&&state.customSleep[today()])||0;
  var html='<div class="page"><div class="title-xl">❤️ Здоровье</div>';
  html+='<div class="card"><div class="stat-grid"><div class="stat-item" onclick="quickMoodLog()" style="cursor:pointer;"><div class="stat-value">'+(mood?mood.score+'/10':'—')+'</div><div class="stat-label">Настроение</div></div><div class="stat-item" onclick="addWater()" style="cursor:pointer;"><div class="stat-value">'+water+'/'+waterGoal+'</div><div class="stat-label">Вода</div></div><div class="stat-item" onclick="openSleepEditor()" style="cursor:pointer;"><div class="stat-value">'+(sleep?sleep+'ч':'—')+'</div><div class="stat-label">Сон</div></div></div></div>';
  html+='<div class="card"><h2>🏥 Медицина</h2><div class="footnote text-secondary mb-2">ИИ-врач: показатели, история, анализ</div><button class="btn btn-primary btn-block" onclick="navigate(\'medical\')">Открыть</button></div>';
  html+='<div class="card"><h2>Быстрый доступ</h2><div class="group-grid"><div class="group-item" onclick="navigate(\'water\')"><div class="group-item-icon">💧</div><div class="group-item-label">Вода</div></div><div class="group-item" onclick="navigate(\'mood\')"><div class="group-item-icon">💭</div><div class="group-item-label">Настроение</div></div><div class="group-item" onclick="navigate(\'workouts\')"><div class="group-item-icon">🏋️</div><div class="group-item-label">Тренировки</div></div><div class="group-item" onclick="navigate(\'meditation\')"><div class="group-item-icon">🧘</div><div class="group-item-label">Медитации</div></div><div class="group-item" onclick="navigate(\'meds\')"><div class="group-item-icon">💊</div><div class="group-item-label">Лекарства</div></div><div class="group-item" onclick="navigate(\'recovery\')"><div class="group-item-icon">🌿</div><div class="group-item-label">Восстановление</div></div></div></div>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function addWater(){
  var t=today();
  if(!state.customWater)state.customWater=[];
  var entry=state.customWater.find(function(w){return w.date===t});
  if(entry)entry.count++;
  else state.customWater.push({id:uid(),date:t,count:1,created_at:nowISO()});
  state.stats.totalWater=(state.stats.totalWater||0)+1;
  save();toast('💧 +1','success');haptic('success');
  if(currentPage==='dashboard')renderDashboard();else if(currentPage==='health')renderHealth();else renderWater();
}
function quickMoodLog(){
  var moods=['😢','😔','😐','🙂','😊'];
  var html='<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;">';
  moods.forEach(function(m,i){
    html+='<button class="btn btn-ghost" style="font-size:32px;padding:20px 0;" onclick="saveMood('+((i+1)*2)+')">'+m+'</button>';
  });
  html+='</div>';
  openSheet('Настроение?',html);
}
function saveMood(score){
  var t=today();
  if(!state.customMood)state.customMood=[];
  var existing=state.customMood.find(function(m){return m.date===t});
  if(existing)existing.score=score;
  else state.customMood.push({id:uid(),date:t,score:score,created_at:nowISO()});
  state.stats.totalMoodLogs=(state.stats.totalMoodLogs||0)+1;
  save();closeSheet();toast('Записано','success');haptic('success');
  if(currentPage==='dashboard')renderDashboard();else if(currentPage==='health')renderHealth();else renderMood();
}
function openSleepEditor(){
  var y=yesterday();var t=today();
  var curY=(state.customSleep&&state.customSleep[y])||7;
  var curT=(state.customSleep&&state.customSleep[t])||7;
  var html='<div class="field"><label class="field-label">Сон вчера (часы)</label><input type="number" id="sleepYesterday" value="'+curY+'" min="0" max="14" step="0.5"/></div>';
  html+='<div class="field"><label class="field-label">Сон сегодня (часы)</label><input type="number" id="sleepToday" value="'+curT+'" min="0" max="14" step="0.5"/></div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="saveSleep()">💾 Сохранить</button>';
  openSheet('Сон',html);
}
function saveSleep(){
  var y=yesterday();var t=today();
  var vY=parseFloat((document.getElementById('sleepYesterday')||{}).value)||7;
  var vT=parseFloat((document.getElementById('sleepToday')||{}).value)||7;
  if(!state.customSleep)state.customSleep={};
  state.customSleep[y]=vY;state.customSleep[t]=vT;
  save();closeSheet();toast('Сон записан','success');haptic('success');
  if(currentPage==='dashboard')renderDashboard();else renderHealth();
}
function renderWater(){
  var entry=state.customWater.find(function(w){return w.date===today()});
  var count=entry?entry.count:0;
  var goal=state.settings.waterGoal||8;
  var html='<div class="page"><div class="title-xl">💧 Вода</div>';
  html+='<div class="card card-gradient" style="text-align:center;"><div style="font-size:56px;">💧</div><div style="font-size:40px;font-weight:800;">'+count+'/'+goal+'</div><div class="progress" style="margin-top:12px;background:rgba(255,255,255,.25);height:8px;"><div class="progress-fill" style="width:'+Math.min(100,count/goal*100)+'%;background:#fff;"></div></div></div>';
  html+='<button class="btn btn-primary btn-block" onclick="addWater()">+1 стакан</button></div>';
  document.getElementById('app').innerHTML=html;
}
function renderMood(){
  var m=state.customMood||[];
  var html='<div class="page"><div class="title-xl">💭 Настроение</div>';
  html+='<button class="btn btn-primary btn-block mb-4" onclick="quickMoodLog()">Записать</button>';
  if(m.length){m.slice(-10).reverse().forEach(function(e){html+='<div class="list-row"><div class="list-icon">'+(e.score>=7?'😊':e.score>=5?'🙂':'😔')+'</div><div class="list-body"><div class="list-title">'+e.date+'</div><div class="list-subtitle">'+e.score+'/10</div></div></div>'})}
  else{html+='<div class="empty"><div class="empty-icon">💭</div><div class="empty-title">Пусто</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderWorkouts(){
  var w=state.customWorkouts||[];
  var html='<div class="page"><div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">🏋️ Тренировки</div><button class="btn btn-primary btn-sm" onclick="openEntityEditor(\'workout\',null)">+</button></div>';
  if(w.length){w.forEach(function(x){html+='<div class="list-row" onclick="openEntityEditor(\'workout\',\''+x.id+'\')"><div class="list-icon">🏋️</div><div class="list-body"><div class="list-title">'+esc(x.title)+'</div><div class="list-subtitle">'+(x.duration||60)+' мин · '+(x.intensity||7)+'</div></div></div>'})}
  else{html+='<div class="empty"><div class="empty-icon">🏋️</div><div class="empty-title">Нет тренировок</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderMeditation(){
  var m=state.customMeditation||[];
  var html='<div class="page"><div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">🧘 Медитации</div><button class="btn btn-primary btn-sm" onclick="openEntityEditor(\'meditation\',null)">+</button></div>';
  if(m.length){m.forEach(function(x){html+='<div class="list-row" onclick="openEntityEditor(\'meditation\',\''+x.id+'\')"><div class="list-icon">🧘</div><div class="list-body"><div class="list-title">'+esc(x.title)+'</div><div class="list-subtitle">'+(x.duration||10)+' мин</div></div></div>'})}
  else{html+='<div class="empty"><div class="empty-icon">🧘</div><div class="empty-title">Нет медитаций</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderMeds(){
  var m=state.customMeds||[];
  var html='<div class="page"><div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">💊 Лекарства</div><button class="btn btn-primary btn-sm" onclick="openEntityEditor(\'med\',null)">+</button></div>';
  if(m.length){m.forEach(function(x){html+='<div class="list-row" onclick="openEntityEditor(\'med\',\''+x.id+'\')"><div class="list-icon">💊</div><div class="list-body"><div class="list-title">'+esc(x.title)+'</div><div class="list-subtitle">'+esc(x.dosage||'')+' '+(x.time||'')+'</div></div></div>'})}
  else{html+='<div class="empty"><div class="empty-icon">💊</div><div class="empty-title">Нет лекарств</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderJournal(){
  var entries=state.journalEntries||[];
  var html='<div class="page"><div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">📓 Дневник</div><button class="btn btn-primary btn-sm" onclick="openEntityEditor(\'journal\',null)">+</button></div>';
  if(entries.length){entries.slice().reverse().forEach(function(e){html+='<div class="card" onclick="openEntityEditor(\'journal\',\''+e.id+'\')" style="cursor:pointer;"><div class="footnote text-tertiary">'+e.date+'</div><div style="margin-top:6px;font-weight:600;">'+esc(e.title||'Запись')+'</div></div>'})}
  else{html+='<div class="empty"><div class="empty-icon">📓</div><div class="empty-title">Пусто</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderNotes(){
  var notes=state.customNotes||[];
  var html='<div class="page"><div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">📝 Заметки</div><button class="btn btn-primary btn-sm" onclick="openEntityEditor(\'note\',null)">+</button></div>';
  if(notes.length){notes.forEach(function(n){html+='<div class="card" onclick="openEntityEditor(\'note\',\''+n.id+'\')" style="cursor:pointer;"><div class="list-title">'+esc(n.title||'—')+'</div><div class="footnote text-secondary mt-2">'+esc((n.content||'').slice(0,150))+'</div></div>'})}
  else{html+='<div class="empty"><div class="empty-icon">📝</div><div class="empty-title">Пусто</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderGoals(){
  var goals=state.customGoals||[];
  var html='<div class="page"><div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">🎯 Цели</div><button class="btn btn-primary btn-sm" onclick="openEntityEditor(\'goal\',null)">+</button></div>';
  if(goals.length){goals.forEach(function(g){var pct=g.target?(g.current||0)/g.target*100:0;html+='<div class="card" onclick="openEntityEditor(\'goal\',\''+g.id+'\')" style="cursor:pointer;"><div class="list-title">'+esc(g.title)+'</div><div class="footnote text-secondary">'+(g.metric?'· '+g.current+'/'+g.target+' '+g.metric:'')+'</div>';if(g.target)html+='<div class="progress mt-2"><div class="progress-fill" style="width:'+Math.min(100,pct)+'%;"></div></div>';html+='</div>'})}
  else{html+='<div class="empty"><div class="empty-icon">🎯</div><div class="empty-title">Нет целей</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderHabits(){
  var habits=state.customHabits||[];
  var html='<div class="page"><div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">🔄 Привычки</div><button class="btn btn-primary btn-sm" onclick="openEntityEditor(\'habit\',null)">+</button></div>';
  if(habits.length){habits.forEach(function(h){html+='<div class="habit-row" onclick="openEntityEditor(\'habit\',\''+h.id+'\')"><div class="habit-icon">'+(h.icon||'✅')+'</div><div class="habit-body"><div class="habit-title">'+esc(h.title)+'</div><div class="habit-streak">'+esc(h.category||'')+'</div></div></div>'})}
  else{html+='<div class="empty"><div class="empty-icon">🔄</div><div class="empty-title">Нет привычек</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}

/* ============================================================
   RECOVERY
   ============================================================ */
function renderRecovery(){
  var list=window.RECOVERY_LIBRARY||[];
  var cats={};
  list.forEach(function(r){if(!cats[r.cat])cats[r.cat]=[];cats[r.cat].push(r)});
  var html='<div class="page"><div class="title-xl">🌿 Восстановление</div>';
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:12px;">Видов</div><div style="font-size:40px;font-weight:800;">'+list.length+'</div></div>';
  Object.keys(cats).forEach(function(cat){
    html+='<div class="card"><h2>'+cat+' ('+cats[cat].length+')</h2>';
    cats[cat].forEach(function(r){
      html+='<div class="list-row" onclick="openRecoveryItem(\''+r.id+'\')"><div class="list-icon">'+r.emoji+'</div><div class="list-body"><div class="list-title">'+r.title+'</div><div class="list-subtitle">'+r.time+' · '+r.effect+'</div></div><div class="list-chevron">›</div></div>';
    });
    html+='</div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openRecoveryItem(id){
  var r=(window.RECOVERY_LIBRARY||[]).find(function(x){return x.id===id});if(!r)return;
  var html='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:48px;">'+r.emoji+'</div><div style="font-size:20px;font-weight:800;">'+r.title+'</div><div class="footnote text-secondary">'+r.cat+'</div></div>';
  html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📋 Описание</div><div class="lesson-content">'+esc(r.desc)+'</div></div></div>';
  html+='<div class="card"><div class="lesson-section practice"><div class="lesson-section-title">🎯 Как делать</div><div class="lesson-content">'+esc(r.how)+'</div></div></div>';
  html+='<div class="card"><div class="lesson-section effect"><div class="lesson-section-title">💎 Эффект</div><div class="lesson-content">'+esc(r.effect)+'</div></div></div>';
  html+='<div class="card"><div class="lesson-section science"><div class="lesson-section-title">🔬 Наука</div><div class="lesson-content">'+esc(r.science)+'</div></div></div>';
  html+='<div class="card"><div class="lesson-section tips"><div class="lesson-section-title">⏰ Как часто</div><div class="lesson-content">'+esc(r.times)+' · '+r.time+'</div></div></div>';
  openSheet(r.title,html);
}
window.openRecoveryItem=openRecoveryItem;
window.renderRecovery=renderRecovery;

/* ============================================================
   VISION
   ============================================================ */
function renderVision(){
  var ex=window.VISION_EXERCISES||[];
  var todayDone=(state.eyeExercises||[]).filter(function(e){return e.date===today()}).length;
  var total=(state.eyeExercises||[]).length;
  var html='<div class="page"><div class="title-xl">👁 Зрение</div>';
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:12px;">Сегодня</div><div style="font-size:40px;font-weight:800;">'+todayDone+' упражнений</div><div style="opacity:.9;font-size:12px;margin-top:6px;">Всего: '+total+'</div></div>';
  html+='<div class="card"><h2>⚡ Быстрые</h2>';
  ex.slice(0,4).forEach(function(e){
    html+='<div class="list-row" onclick="startEyeExercise(\''+e.id+'\')"><div class="list-icon">'+e.emoji+'</div><div class="list-body"><div class="list-title">'+e.title+'</div><div class="list-subtitle">'+e.duration+' · '+e.benefit+'</div></div><div class="list-chevron">▶</div></div>';
  });
  html+='<button class="btn btn-ghost btn-block mt-2" onclick="navigate(\'vision60\')">Все 75 упражнений</button></div>';
  html+='<div class="card"><h2>📊 Трекер</h2><button class="btn btn-primary btn-block" onclick="navigate(\'visiontrack\')">Открыть статистику</button></div>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderVisionExercises(){
  var ex=window.VISION_EXERCISES||[];
  var html='<div class="page"><div class="title-xl">🤸 Упражнения</div>';
  ex.forEach(function(e){
    html+='<div class="method-card" onclick="startEyeExercise(\''+e.id+'\')"><div class="method-header"><div class="method-emoji">'+e.emoji+'</div><div style="flex:1;"><div class="method-title">'+e.title+'</div><div class="method-cat">'+e.duration+' · '+e.benefit+'</div></div><div class="list-chevron">▶</div></div><div class="method-desc">'+esc(e.desc)+'</div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderVision60(){
  var ex=window.VISION_EXERCISES||[];
  var filters=[
    {id:'all',label:'Все',emoji:'📋',count:ex.length},
    {id:'small',label:'Маленький',emoji:'🟢',count:ex.filter(function(e){return e.effect==='small'}).length},
    {id:'medium',label:'Средний',emoji:'🟡',count:ex.filter(function(e){return e.effect==='medium'}).length},
    {id:'hard',label:'Сложный',emoji:'🟠',count:ex.filter(function(e){return e.effect==='hard'}).length},
    {id:'max',label:'Максимум',emoji:'🔴',count:ex.filter(function(e){return e.effect==='max'}).length}
  ];
  var html='<div class="page"><div class="title-xl">👁 75 упражнений</div>';
  html+='<div class="quick-tabs">';
  filters.forEach(function(f){
    html+='<button class="quick-tab '+(v2Filter===f.id?'active':'')+'" onclick="v2Filter=\''+f.id+'\';renderVision60()">'+f.emoji+' '+f.label+' ('+f.count+')</button>';
  });
  html+='</div>';
  var list=v2Filter==='all'?ex:ex.filter(function(e){return e.effect===v2Filter});
  list.forEach(function(e){
    var color=e.effect==='small'?'#3ddc97':e.effect==='medium'?'#ffcc4d':e.effect==='hard'?'#ffa940':'#ff6b6b';
    var label=e.effect==='small'?'Маленький':e.effect==='medium'?'Средний':e.effect==='hard'?'Сложный':'Максимум';
    html+='<div class="method-card" onclick="startEyeExercise(\''+e.id+'\')"><div class="method-header"><div class="method-emoji">'+e.emoji+'</div><div style="flex:1;"><div class="method-title">'+e.title+'</div><div class="method-cat"><span style="color:'+color+';font-weight:800;">'+label+'</span> · '+e.duration+'</div></div><div class="list-chevron">▶</div></div><div class="method-desc">'+esc(e.desc)+'</div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function startEyeExercise(id){
  var ex=(window.VISION_EXERCISES||[]).find(function(x){return x.id===id});if(!ex)return;
  currentVisionExercise=ex;
  var html='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:56px;">'+ex.emoji+'</div>';
  html+='<div style="font-size:22px;font-weight:800;">'+ex.title+'</div>';
  html+='<div class="footnote text-secondary">'+ex.duration+' · '+ex.benefit+'</div></div>';
  html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📋 Описание</div><div class="lesson-content">'+esc(ex.desc)+'</div></div></div>';
  html+='<div class="card"><div class="lesson-section practice"><div class="lesson-section-title">🎯 Как делать</div><div class="lesson-content">'+esc(ex.how)+'</div></div></div>';
  html+='<div class="card"><div class="lesson-section science"><div class="lesson-section-title">🔬 Наука</div><div class="lesson-content">'+esc(ex.science)+'</div></div></div>';
  html+='<div class="card"><div class="lesson-section effect"><div class="lesson-section-title">💎 Эффект</div><div class="lesson-content">'+esc(ex.benefit)+'</div></div></div>';
  html+='<div class="card"><div class="lesson-section tips"><div class="lesson-section-title">⏰ Как часто</div><div class="lesson-content">'+esc(ex.times)+'</div></div></div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="completeEyeExercise()">✓ Выполнено (+10 XP)</button>';
  openSheet(ex.title,html);
}
function completeEyeExercise(){
  if(!currentVisionExercise)return;
  state.eyeExercises.push({id:uid(),exerciseId:currentVisionExercise.id,date:today(),time:nowISO()});
  state.xp=(state.xp||0)+10;
  save();haptic('success');toast('✓ +10 XP','success');
  checkAchievements();closeSheet();currentVisionExercise=null;
  if(currentPage==='vision')renderVision();
  else if(currentPage==='vision60')renderVision60();
  else renderDashboard();
}
function renderVisionTracker(){
  var entries=state.eyeExercises||[];
  var todayCount=entries.filter(function(e){return e.date===today()}).length;
  var weekAgo=new Date();weekAgo.setDate(weekAgo.getDate()-7);
  var weekEntries=entries.filter(function(e){return new Date(e.time)>=weekAgo});
  var html='<div class="page"><div class="title-xl">📊 Трекер зрения</div>';
  html+='<div class="stat-grid mb-4"><div class="stat-item"><div class="stat-value">'+todayCount+'</div><div class="stat-label">Сегодня</div></div><div class="stat-item"><div class="stat-value">'+weekEntries.length+'</div><div class="stat-label">За неделю</div></div><div class="stat-item"><div class="stat-value">'+entries.length+'</div><div class="stat-label">Всего</div></div></div>';
  html+='<div class="card"><h2>📈 Последние</h2>';
  if(entries.length){
    entries.slice(-10).reverse().forEach(function(e){
      var ex=(window.VISION_EXERCISES||[]).find(function(x){return x.id===e.exerciseId});
      html+='<div class="stat-row"><span class="stat-row-label">'+(ex?ex.emoji+' '+ex.title:'Упражнение')+'</span><span class="stat-row-value">'+e.date+'</span></div>';
    });
  }else{html+='<div class="footnote text-tertiary">Пока нет</div>'}
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
function renderVisionTips(){
  var tips=(window.SCREEN_TIPS||[]).filter(function(t){return t.category&&t.category.indexOf('Зрение')>=0});
  var html='<div class="page"><div class="title-xl">💡 Советы</div>';
  if(!tips.length)html+='<div class="empty"><div class="empty-icon">💡</div><div class="empty-title">Советы загружаются</div></div>';
  tips.forEach(function(t){
    html+='<div class="card"><h2>'+esc(t.title)+'</h2><div class="footnote text-secondary mb-2">'+esc(t.desc)+'</div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.startEyeExercise=startEyeExercise;
window.completeEyeExercise=completeEyeExercise;
window.renderVision60=renderVision60;

/* ============================================================
   ENTERTAINMENT
   ============================================================ */
function renderEntertainment(){
  var html='<div class="page"><div class="title-xl">🎬 Досуг</div>';
  html+='<div class="compact-grid">';
  html+='<div class="compact-item" onclick="navigate(\'resources\')"><span class="compact-icon">🔗</span><span>Ресурсы</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'movies\')"><span class="compact-icon">🎥</span><span>Фильмы</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'series\')"><span class="compact-icon">📺</span><span>Сериалы</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'books\')"><span class="compact-icon">📚</span><span>Книги</span></div>';
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
function renderMovies(){renderGenericModule('Фильмы','🎥')}
function renderSeries(){renderGenericModule('Сериалы','📺')}
function renderBooks(){renderGenericModule('Книги','📚')}
function renderMusic(){renderGenericModule('Музыка','🎵')}
function renderGames(){renderGenericModule('Игры','🎮')}
function renderPodcasts(){renderGenericModule('Подкасты','🎧')}
function renderResources(){
  var list=state.customResources||[];
  var html='<div class="page"><div class="title-xl">🔗 Ресурсы</div>';
  html+='<button class="btn btn-primary btn-block mb-4" onclick="openAddResource()">+ Добавить</button>';
  if(!list.length)html+='<div class="empty"><div class="empty-icon">🔗</div><div class="empty-title">Пока ничего</div></div>';
  else list.forEach(function(r){
    html+='<div class="resource-card"><div class="resource-favicon">🔗</div><div class="resource-body"><div class="resource-title">'+esc(r.title)+'</div><div class="resource-url">'+esc(r.url)+'</div></div><button class="btn btn-ghost btn-xs" onclick="event.stopPropagation();window.open(\''+esc(r.url)+'\',\'_blank\')">↗</button></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openAddResource(){
  var html='<div class="field"><label class="field-label">Название *</label><input type="text" id="res-title"/></div>';
  html+='<div class="field"><label class="field-label">Ссылка *</label><input type="url" id="res-url" placeholder="https://..."/></div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="saveResource()">💾 Сохранить</button>';
  openSheet('Новый ресурс',html);
}
function saveResource(){
  var title=(document.getElementById('res-title')||{}).value||'';
  var url=(document.getElementById('res-url')||{}).value||'';
  if(!title.trim()||!url.trim())return toast('Заполни','error');
  if(!state.customResources)state.customResources=[];
  state.customResources.push({id:uid(),title:title.trim(),url:url.trim(),created_at:nowISO()});
  save();closeSheet();toast('✓ Добавлено','success');renderResources();
}
window.openAddResource=openAddResource;
window.saveResource=saveResource;

/* ============================================================
   TIMER / FOCUS / DOMAINS
   ============================================================ */
function renderTimer(){
  var h=Math.floor(timerSeconds/3600),m=Math.floor((timerSeconds%3600)/60),s=timerSeconds%60;
  var display=(h>0?pad(h)+':':'')+pad(m)+':'+pad(s);
  var html='<div class="page"><div class="title-xl">⏱ Таймер</div>';
  html+='<div class="card" style="text-align:center;padding:32px 16px;"><div style="font-size:64px;font-weight:800;line-height:1;font-variant-numeric:tabular-nums;" id="timerDisplay">'+display+'</div></div>';
  html+='<div class="card"><div class="btn-row" style="justify-content:center;">';
  if(!timerRunning)html+='<button class="btn btn-primary" onclick="startTimer()">▶ Старт</button>';
  else html+='<button class="btn btn-warning" onclick="pauseTimer()">⏸ Пауза</button>';
  html+='<button class="btn btn-ghost" onclick="resetTimer()">🔄</button>';
  html+='<button class="btn btn-success" onclick="finishTimer()">✓</button>';
  html+='</div></div>';
  html+='<div class="card"><h2>Режимы</h2><div class="btn-row">';
  html+='<button class="btn '+(timerMode==='pomodoro'?'btn-primary':'btn-ghost')+'" onclick="setTimerMode(\'pomodoro\')">🍅 25</button>';
  html+='<button class="btn '+(timerMode==='short'?'btn-primary':'btn-ghost')+'" onclick="setTimerMode(\'short\')">☕ 5</button>';
  html+='<button class="btn '+(timerMode==='long'?'btn-primary':'btn-ghost')+'" onclick="setTimerMode(\'long\')">🌿 15</button>';
  html+='<button class="btn '+(timerMode==='deep'?'btn-primary':'btn-ghost')+'" onclick="setTimerMode(\'deep\')">🎯 90</button>';
  html+='</div></div></div>';
  document.getElementById('app').innerHTML=html;
}
function setTimerMode(mode){
  timerMode=mode;
  var mins={pomodoro:25,short:5,long:15,deep:90}[mode]||25;
  timerSeconds=mins*60;timerRunning=false;
  if(timerInterval){clearInterval(timerInterval);timerInterval=null}
  renderTimer();
}
function startTimer(){
  if(timerRunning)return;
  timerRunning=true;
  timerInterval=setInterval(function(){
    if(timerSeconds<=0){pauseTimer();toast('⏰ Время!','success');return}
    timerSeconds--;
    var el=document.getElementById('timerDisplay');
    if(el){
      var h=Math.floor(timerSeconds/3600),m=Math.floor((timerSeconds%3600)/60),s=timerSeconds%60;
      el.textContent=(h>0?pad(h)+':':'')+pad(m)+':'+pad(s);
    }
  },1000);
  renderTimer();
}
function pauseTimer(){timerRunning=false;if(timerInterval){clearInterval(timerInterval);timerInterval=null}renderTimer()}
function resetTimer(){if(timerInterval){clearInterval(timerInterval);timerInterval=null}timerRunning=false;var mins={pomodoro:25,short:5,long:15,deep:90}[timerMode]||25;timerSeconds=mins*60;renderTimer()}
function finishTimer(){
  if(timerInterval){clearInterval(timerInterval);timerInterval=null}
  timerRunning=false;
  var mins={pomodoro:25,short:5,long:15,deep:90}[timerMode]||25;
  var spent=mins*60-timerSeconds;
  if(!state.timerSessions)state.timerSessions=[];
  state.timerSessions.push({id:uid(),mode:timerMode,duration:Math.floor(spent/60),date:today(),created_at:nowISO()});
  save();toast('✓ Сессия','success');haptic('success');checkAchievements();resetTimer();
}
window.startTimer=startTimer;
window.pauseTimer=pauseTimer;
window.resetTimer=resetTimer;
window.finishTimer=finishTimer;
window.setTimerMode=setTimerMode;

function renderFocus(){
  var sessions=state.focusSessions||[];
  var html='<div class="page"><div class="title-xl">🎯 Фокус</div>';
  html+='<div class="card"><h2>Режимы</h2>';
  html+='<div class="list-row" onclick="startFocusSession(\'Deep Work\',90)"><div class="list-icon">🎯</div><div class="list-body"><div class="list-title">Deep Work</div><div class="list-subtitle">90 мин</div></div></div>';
  html+='<div class="list-row" onclick="startFocusSession(\'Pomodoro\',25)"><div class="list-icon">🍅</div><div class="list-body"><div class="list-title">Pomodoro</div><div class="list-subtitle">25 мин</div></div></div>';
  html+='<div class="list-row" onclick="startFocusSession(\'Sprint\',15)"><div class="list-icon">⚡</div><div class="list-body"><div class="list-title">Sprint</div><div class="list-subtitle">15 мин</div></div></div>';
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
function startFocusSession(name,duration){
  if(!state.focusSessions)state.focusSessions=[];
  state.focusSessions.push({id:uid(),name:name,duration:duration,date:today(),created_at:nowISO()});
  save();toast('✓ '+name,'success');haptic('success');checkAchievements();renderFocus();
}
window.startFocusSession=startFocusSession;

function renderDomains(){
  var domains=window.DOMAINS||[];
  var todayScores=(state.domainScores||{})[today()]||{};
  var html='<div class="page"><div class="title-xl">🌐 Домены</div>';
  domains.forEach(function(d){
    var score=todayScores[d.id]||0;
    var pct=Math.round(score*10);
    html+='<div class="domain-card" onclick="openDomain(\''+d.id+'\')"><div class="domain-header"><div class="domain-icon" style="background:'+d.color+'20;color:'+d.color+';">'+d.emoji+'</div><div style="flex:1;"><div class="domain-title">'+d.name+'</div><div class="domain-score">'+(score>0?score+'/10 ('+pct+'%)':'—')+'</div></div><div class="list-chevron">›</div></div><div class="domain-bar"><div class="domain-bar-fill" style="width:'+pct+'%;background:'+d.color+';"></div></div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openDomain(id){
  var domains=window.DOMAINS||[];
  var d=domains.find(function(x){return x.id===id});if(!d)return;
  var todayScores=(state.domainScores||{})[today()]||{};
  var score=todayScores[id]||5;
  var html='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:48px;">'+d.emoji+'</div><div style="font-size:20px;font-weight:800;">'+d.name+'</div></div>';
  html+='<div class="card"><h2>Оцени</h2><div style="text-align:center;padding:12px 0;"><div style="font-size:40px;font-weight:800;color:'+d.color+';" id="domainScoreDisplay">'+score+'</div></div><input type="range" min="1" max="10" value="'+score+'" style="width:100%;margin:10px 0;" oninput="document.getElementById(\'domainScoreDisplay\').textContent=this.value;" id="domainScoreRange"/><button class="btn btn-primary btn-block" onclick="saveDomainScore(\''+id+'\')">Сохранить</button></div>';
  openSheet(d.name,html);
}
function saveDomainScore(id){
  var range=document.getElementById('domainScoreRange');if(!range)return;
  var score=parseInt(range.value);
  var t=today();
  if(!state.domainScores)state.domainScores={};
  if(!state.domainScores[t])state.domainScores[t]={};
  state.domainScores[t][id]=score;
  save();toast('✓ Сохранено','success');haptic('success');
  closeSheet();renderDomains();
}
window.openDomain=openDomain;
window.saveDomainScore=saveDomainScore;

/* ============================================================
   PROFILE / STATS
   ============================================================ */
function renderProfile(){
  var p=state.profile;
  var unlocked=p.achievements||[];
  var doneTasks=state.tasks.filter(function(t){return t.status==='completed'}).length;
  var lessonsDone=Object.keys(state.levelProgress||{}).length;
  var lvl=Math.floor((state.xp||0)/100);
  var achievements=window.ACHIEVEMENTS||[];
  var html='<div class="page">';
  html+='<div class="profile-hero"><div class="avatar-btn" onclick="pickEmoji()" style="width:96px;height:96px;margin:0 auto 12px;font-size:48px;">'+p.emoji+'</div><div style="font-size:22px;font-weight:800;">'+esc(p.name||'Пользователь')+'</div></div>';
  html+='<div class="level-hero"><div class="level-badge">🏅 Уровень '+lvl+'</div><div class="xp-bar"><div class="xp-bar-fill" style="width:'+((state.xp||0)%100)+'%;"></div></div><div class="xp-text">'+((state.xp||0)%100)+'/100 XP · Всего: '+(state.xp||0)+' XP</div></div>';
  html+='<div class="stat-grid mb-4"><div class="stat-item"><div class="stat-value">'+doneTasks+'</div><div class="stat-label">Задач</div></div><div class="stat-item"><div class="stat-value">'+lessonsDone+'</div><div class="stat-label">Уроков</div></div><div class="stat-item"><div class="stat-value">'+(state.stats.streak||0)+'</div><div class="stat-label">Streak</div></div></div>';
  html+='<div class="card"><h2>✏️ Имя</h2><input type="text" id="profile-name" value="'+esc(p.name)+'" onchange="saveProfileName(this.value)"/></div>';
  html+='<div class="card"><h2>🏆 Достижения ('+unlocked.length+'/'+achievements.length+')</h2><div class="achieve-grid">';
  achievements.forEach(function(a){
    var isUnlocked=unlocked.indexOf(a.id)>=0;
    var prog=isUnlocked?1:(a.progress?a.progress(state):0);
    html+='<div class="achieve-item '+(isUnlocked?'unlocked':'locked')+'"><div class="achieve-icon">'+a.icon+'</div><div class="achieve-name">'+a.name+'</div><div class="achieve-progress"><div class="achieve-progress-fill" style="width:'+(prog*100)+'%;"></div></div><div class="achieve-progress-text">'+Math.round(prog*100)+'%</div></div>';
  });
  html+='</div></div></div>';
  document.getElementById('app').innerHTML=html;
}
function pickEmoji(){
  var emojis=['😊','😎','🤓','🧑‍💻','👨‍💼','👩‍💼','🦊','🐱','🐶','🦁','🐼','🦉','🌟','⚡','🔥','💎','🚀','🎯','🧠','💪','🌈','☕','🎨','🎮','🎧','📚','🏃','🧘','🍀','🌸'];
  var html='<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:8px;">';
  emojis.forEach(function(e){
    html+='<button onclick="setEmoji(\''+e+'\')" style="aspect-ratio:1;border-radius:14px;background:var(--glass-2);font-size:26px;cursor:pointer;border:2px solid '+(e===state.profile.emoji?'var(--brand)':'transparent')+';">'+e+'</button>';
  });
  html+='</div>';
  openSheet('Аватар',html);
}
function setEmoji(e){state.profile.emoji=e;save();closeSheet();toast('Обновлено','success');renderProfile();updateHeader()}
function saveProfileName(name){state.profile.name=(name||'').trim()||'Пользователь';save();toast('Сохранено','success');updateHeader()}
window.pickEmoji=pickEmoji;
window.setEmoji=setEmoji;
window.saveProfileName=saveProfileName;
window.renderProfile=renderProfile;

function renderStats(){
  var doneTasks=state.tasks.filter(function(t){return t.status==='completed'}).length;
  var doneLessons=Object.keys(state.levelProgress||{}).length;
  var html='<div class="page"><div class="title-xl">📊 Статистика</div>';
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:12px;">Уроков</div><div style="font-size:40px;font-weight:800;">'+doneLessons+'</div></div>';
  html+='<div class="stat-grid mb-4"><div class="stat-item"><div class="stat-value">'+doneTasks+'</div><div class="stat-label">Задач</div></div><div class="stat-item"><div class="stat-value">'+Object.keys(state.englishProgress||{}).length+'</div><div class="stat-label">English</div></div><div class="stat-item"><div class="stat-value">'+(state.stats.streak||0)+'</div><div class="stat-label">Streak</div></div></div>';
  html+='<button class="btn btn-primary btn-block" onclick="navigate(\'detailedStats\')">📈 Вся статистика</button></div>';
  document.getElementById('app').innerHTML=html;
}
function renderDetailedStats(){
  var doneTasks=state.tasks.filter(function(t){return t.status==='completed'}).length;
  var doneLessons=Object.keys(state.levelProgress||{}).length;
  var englishDone=Object.keys(state.englishProgress||{}).length;
  var skillsDone=Object.keys(state.skillsProgress||{}).length;
  var waterTotal=(state.customWater||[]).reduce(function(a,w){return a+(w.count||0)},0);
  var html='<div class="page"><div class="title-xl">📈 Всё</div>';
  html+='<div class="group-card"><div class="group-title">📋 Задачи</div><div class="stat-row"><span class="stat-row-label">Всего</span><span class="stat-row-value">'+state.tasks.length+'</span></div><div class="stat-row"><span class="stat-row-label">Выполнено</span><span class="stat-row-value">'+doneTasks+'</span></div></div>';
  html+='<div class="group-card"><div class="group-title">🎓 Обучение</div><div class="stat-row"><span class="stat-row-label">Уроки</span><span class="stat-row-value">'+doneLessons+'</span></div><div class="stat-row"><span class="stat-row-label">English</span><span class="stat-row-value">'+englishDone+'</span></div><div class="stat-row"><span class="stat-row-label">Навыки</span><span class="stat-row-value">'+skillsDone+'</span></div></div>';
  html+='<div class="group-card"><div class="group-title">❤️ Здоровье</div><div class="stat-row"><span class="stat-row-label">💧 Вода</span><span class="stat-row-value">'+waterTotal+'</span></div><div class="stat-row"><span class="stat-row-label">💭 Настроений</span><span class="stat-row-value">'+(state.customMood||[]).length+'</span></div><div class="stat-row"><span class="stat-row-label">👁 Упражнений глаз</span><span class="stat-row-value">'+(state.eyeExercises||[]).length+'</span></div></div>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}

/* ============================================================
   SURVEY
   ============================================================ */
function startSurvey(){state.profile.surveyStep=0;save();navigate('survey')}
function renderSurvey(){
  var step=state.profile.surveyStep||0;
  var questions=window.SURVEY_QUESTIONS||[];
  var q=questions[step];
  if(!q){finishSurvey();return}
  var answers=state.profile.surveyAnswers||{};
  var html='<div class="page"><div class="survey-container"><div class="survey-progress">';
  for(var i=0;i<questions.length;i++){
    var cls='survey-dot';
    if(i<step)cls+=' done';else if(i===step)cls+=' active';
    html+='<div class="'+cls+'"></div>';
  }
  html+='</div>';
  html+='<div class="survey-question">'+q.question+'</div>';
  if(q.type==='text'){
    html+='<input type="text" id="surveyInput" class="welcome-input" value="'+esc(answers[q.id]||'')+'"/><button class="btn btn-primary btn-block mt-3" onclick="saveSurveyAnswer()">Далее →</button>';
  }else if(q.type==='options'){
    q.options.forEach(function(opt){
      html+='<div class="survey-option'+(answers[q.id]===opt.value?' selected':'')+'" onclick="selectSurveyOption(\''+q.id+'\',\''+opt.value+'\')"><span class="survey-option-emoji">'+opt.emoji+'</span><span class="survey-option-label">'+opt.label+'</span></div>';
    });
  }
  if(step>0)html+='<button class="btn btn-ghost btn-block mt-2" onclick="prevSurveyStep()">← Назад</button>';
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
function selectSurveyOption(qid,val){
  if(!state.profile.surveyAnswers)state.profile.surveyAnswers={};
  state.profile.surveyAnswers[qid]=val;
  save();nextSurveyStep();
}
function saveSurveyAnswer(){
  var inp=document.getElementById('surveyInput');
  var val=inp?inp.value.trim():'';
  if(!val)return toast('Заполни','error');
  var questions=window.SURVEY_QUESTIONS||[];
  var q=questions[state.profile.surveyStep];
  if(!state.profile.surveyAnswers)state.profile.surveyAnswers={};
  state.profile.surveyAnswers[q.id]=val;
  if(q.id==='name')state.profile.name=val;
  save();nextSurveyStep();
}
function nextSurveyStep(){
  state.profile.surveyStep=(state.profile.surveyStep||0)+1;
  save();
  var questions=window.SURVEY_QUESTIONS||[];
  if(state.profile.surveyStep>=questions.length)finishSurvey();else renderSurvey();
}
function prevSurveyStep(){
  state.profile.surveyStep=Math.max(0,(state.profile.surveyStep||0)-1);
  save();renderSurvey();
}
function finishSurvey(){
  state.profile.surveyDone=true;
  save();haptic('success');toast('🎉 Профиль заполнен!','success',4000);
  checkAchievements();updateHeader();navigate('dashboard');
}
window.startSurvey=startSurvey;
window.saveSurveyAnswer=saveSurveyAnswer;
window.selectSurveyOption=selectSurveyOption;
window.nextSurveyStep=nextSurveyStep;
window.prevSurveyStep=prevSurveyStep;
window.finishSurvey=finishSurvey;

/* ============================================================
   DAILY SURVEY
   ============================================================ */
var DAILY_SURVEY_QUESTIONS=[
{id:'sleepHours',question:'Сколько часов ты спал?',type:'number',default:7},
{id:'mood',question:'Настроение вчера?',type:'slider',default:7},
{id:'energy',question:'Сколько было энергии?',type:'slider',default:7},
{id:'stress',question:'Уровень стресса?',type:'slider',default:5},
{id:'screenMinutes',question:'Сколько минут экрана?',type:'number',default:240},
{id:'focus',question:'Концентрация?',type:'slider',default:7},
{id:'water',question:'Стаканов воды?',type:'number',default:6},
{id:'workouts',question:'Тренировок?',type:'number',default:0},
{id:'wins',question:'Главная победа?',type:'text'},
{id:'lessons',question:'Что понял?',type:'text'}
];
function needsDailySurvey(){return state.settings.lastDailySurveyDay!==today()}
function openDailySurvey(force){
  if(!force&&!needsDailySurvey())return;
  currentDailySurveyStep=0;currentDailySurveyAnswers={};
  navigate('dailySurvey');
}
function renderDailySurvey(){
  var step=currentDailySurveyStep||0;
  var q=DAILY_SURVEY_QUESTIONS[step];
  if(!q){finishDailySurvey();return}
  var answers=currentDailySurveyAnswers||{};
  var html='<div class="page"><div class="title-xl">📋 Опрос о вчера</div>';
  html+='<div class="card" style="background:linear-gradient(135deg,rgba(91,158,255,.15),rgba(167,139,250,.1));border-color:rgba(91,158,255,.3);">';
  html+='<div class="footnote text-secondary" style="margin-bottom:8px;">Шаг '+(step+1)+' из '+DAILY_SURVEY_QUESTIONS.length+'</div>';
  html+='<div class="progress" style="margin-bottom:14px;"><div class="progress-fill" style="width:'+Math.round((step+1)/DAILY_SURVEY_QUESTIONS.length*100)+'%;"></div></div>';
  html+='<div style="font-size:18px;font-weight:800;line-height:1.3;margin-bottom:14px;">'+esc(q.question)+'</div>';
  if(q.type==='slider'){
    var val=answers[q.id]!==undefined?answers[q.id]:q.default;
    html+='<div style="text-align:center;padding:8px 0;"><div id="dv" style="font-size:40px;font-weight:800;color:var(--brand);">'+val+'</div></div>';
    html+='<input type="range" min="1" max="10" value="'+val+'" style="width:100%;margin:14px 0;" oninput="document.getElementById(\'dv\').textContent=this.value;currentDailySurveyAnswers[\''+q.id+'\']=parseInt(this.value);"/>';
    html+='<button class="btn btn-primary btn-block mt-3" onclick="nextDailySurveyStep()">Далее →</button>';
  }else if(q.type==='number'){
    var v2=answers[q.id]!==undefined?answers[q.id]:q.default;
    html+='<div class="field"><input type="number" id="dn" value="'+v2+'" oninput="currentDailySurveyAnswers[\''+q.id+'\']=parseFloat(this.value);"/></div>';
    html+='<button class="btn btn-primary btn-block mt-3" onclick="nextDailySurveyStep()">Далее →</button>';
  }else if(q.type==='text'){
    html+='<div class="field"><textarea id="dt" style="min-height:100px;" oninput="currentDailySurveyAnswers[\''+q.id+'\']=this.value;">'+(answers[q.id]||'')+'</textarea></div>';
    html+='<button class="btn btn-primary btn-block mt-3" onclick="nextDailySurveyStep()">Далее →</button>';
  }
  if(step>0)html+='<button class="btn btn-ghost btn-block mt-2" onclick="prevDailySurveyStep()">← Назад</button>';
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
function nextDailySurveyStep(){saveDailySurveyAnswer();currentDailySurveyStep=(currentDailySurveyStep||0)+1;if(currentDailySurveyStep>=DAILY_SURVEY_QUESTIONS.length)finishDailySurvey();else renderDailySurvey()}
function prevDailySurveyStep(){saveDailySurveyAnswer();currentDailySurveyStep=Math.max(0,(currentDailySurveyStep||0)-1);renderDailySurvey()}
function saveDailySurveyAnswer(){
  var q=DAILY_SURVEY_QUESTIONS[currentDailySurveyStep];if(!q)return;
  if(q.type==='number'){var el=document.getElementById('dn');if(el)currentDailySurveyAnswers[q.id]=parseFloat(el.value)}
  else if(q.type==='text'){var el2=document.getElementById('dt');if(el2)currentDailySurveyAnswers[q.id]=el2.value}
}
function finishDailySurvey(){
  var answers=currentDailySurveyAnswers||{};
  var y=yesterday();
  if(!state.dailySurveys)state.dailySurveys={};
  state.dailySurveys[y]={answers:answers,filledAt:nowISO()};
  if(answers.sleepHours!=null){if(!state.customSleep)state.customSleep={};state.customSleep[y]=parseFloat(answers.sleepHours)}
  if(answers.mood!=null){if(!state.customMood)state.customMood=[];var ex=state.customMood.find(function(m){return m.date===y});if(ex)ex.score=parseInt(answers.mood);else state.customMood.push({id:uid(),date:y,score:parseInt(answers.mood),created_at:nowISO()})}
  state.todayPlan=buildTodayPlan(answers);
  state.settings.lastDailySurveyDay=today();
  save();haptic('success');toast('✓ План на сегодня готов','success',3500);navigate('dashboard');
}
function buildTodayPlan(answers){
  var plan={date:today(),basedOn:answers,items:[],load:100,notes:[]};
  var sleep=parseFloat(answers.sleepHours)||7,mood=parseInt(answers.mood)||7,energy=parseInt(answers.energy)||7,stress=parseInt(answers.stress)||5,screen=parseFloat(answers.screenMinutes)||240,focus=parseInt(answers.focus)||7,water=parseInt(answers.water)||6,workouts=parseInt(answers.workouts)||0;
  if(sleep<6)plan.load-=20;if(sleep<7)plan.load-=10;if(mood<5)plan.load-=15;if(energy<5)plan.load-=15;if(stress>7)plan.load-=15;if(screen>360)plan.load-=10;if(focus<5)plan.load-=10;
  if(sleep>=7&&sleep<=9)plan.load+=5;if(mood>=7)plan.load+=5;if(energy>=7)plan.load+=5;
  plan.load=Math.max(30,Math.min(120,plan.load));
  if(screen>300)plan.items.push({time:'утро',title:'Утро без телефона 30 мин',desc:'Снижаем экран',icon:'🌅'});
  if(sleep<7)plan.items.push({time:'вечер',title:'Сон до 23:00',desc:'Приоритет сна',icon:'😴'});
  if(water<6)plan.items.push({time:'день',title:'8 стаканов воды',desc:'Гидратация',icon:'💧'});
  if(mood<6||stress>6)plan.items.push({time:'день',title:'Медитация 10 мин',desc:'Стресс',icon:'🧘'});
  if(energy<6)plan.items.push({time:'день',title:'Прогулка 20 мин',desc:'Энергия',icon:'🚶'});
  if(focus<6||screen>300)plan.items.push({time:'утро',title:'Deep Work 90 мин',desc:'Одна задача',icon:'🎯'});
  if(workouts<2)plan.items.push({time:'день',title:'Тренировка 30 мин',desc:'Движение',icon:'🏋️'});
  plan.items.push({time:'день',title:'20-20-20 для глаз',desc:'Каждые 20 мин',icon:'👁'});
  plan.items.push({time:'вечер',title:'Дневник: 3 победы',desc:'Рефлексия',icon:'📓'});
  plan.notes.push('Нагрузка: '+plan.load+'%');
  return plan;
}
window.openDailySurvey=openDailySurvey;
window.nextDailySurveyStep=nextDailySurveyStep;
window.prevDailySurveyStep=prevDailySurveyStep;
window.finishDailySurvey=finishDailySurvey;

/* ============================================================
   CHALLENGES & ACHIEVEMENTS
   ============================================================ */
function renderChallenges(){
  var list=(typeof getTodayChallenges==='function')?getTodayChallenges():[];
  if(!list.length)return '';
  var html='<div class="card"><h2>🔥 Челленджи дня</h2>';
  list.forEach(function(ch){
    var done=state.challengeProgress&&state.challengeProgress[ch.id];
    html+='<div class="challenge-card '+(done?'done':'')+'" onclick="completeChallenge(\''+ch.id+'\')" style="background:linear-gradient(135deg,rgba(255,169,64,.15),rgba(255,107,107,.1));border:1px solid rgba(255,169,64,.35);border-radius:var(--r-lg);padding:16px;margin-bottom:12px;cursor:pointer;"><div class="challenge-title" style="font-size:15px;font-weight:800;margin-bottom:6px;">'+(done?'✓ ':'')+esc(ch.title)+'</div><div class="challenge-desc" style="font-size:13px;color:var(--text-2);">'+esc(ch.desc)+'</div></div>';
  });
  html+='</div>';
  return html;
}
function completeChallenge(id){
  if(!state.challengeProgress)state.challengeProgress={};
  if(state.challengeProgress[id])return;
  state.challengeProgress[id]=nowISO();
  state.xp=(state.xp||0)+10;
  save();haptic('success');toast('🔥 Челлендж выполнен!','success');
  checkAchievements();
  if(currentPage==='dashboard')renderDashboard();
}
function checkAchievements(){
  var achievements=window.ACHIEVEMENTS||[];
  var unlocked=state.profile.achievements||[];
  var newOnes=[];
  for(var i=0;i<achievements.length;i++){
    var a=achievements[i];
    if(unlocked.indexOf(a.id)<0&&a.check(state)){
      unlocked.push(a.id);
      newOnes.push(a);
    }
  }
  state.profile.achievements=unlocked;
  if(newOnes.length){
    save();
    newOnes.forEach(function(a,idx){
      setTimeout(function(){toast('🏆 '+a.name,'success',3500);haptic('success')},idx*800);
    });
  }
}
window.completeChallenge=completeChallenge;
window.checkAchievements=checkAchievements;

/* ============================================================
   ADAPTIVE
   ============================================================ */
function getYesterdayScreen(){return (state.screenHistory&&state.screenHistory[yesterday()])||0}
function getYesterdaySleep(){return (state.customSleep&&state.customSleep[yesterday()])||7}
function getAdaptiveLoad(){
  var sleep=getYesterdaySleep();
  var water=(state.customWater||[]).find(function(w){return w.date===yesterday()});water=water?water.count:0;
  var mood=(state.customMood||[]).find(function(m){return m.date===yesterday()});mood=mood?mood.score:7;
  var screen=getYesterdayScreen();
  var load=100;
  if(sleep<6)load-=20;if(sleep<7)load-=10;if(water<4)load-=10;if(mood<5)load-=15;if(screen>300)load-=10;
  return Math.max(30,Math.min(120,load));
}
function getSmartTips(){
  var tips=[];
  var sleep=getYesterdaySleep();
  var water=(state.customWater||[]).find(function(w){return w.date===today()});water=water?water.count:0;
  var mood=(state.customMood||[]).find(function(m){return m.date===today()});mood=mood?mood.score:7;
  if(sleep<6)tips.push('😴 Сон <6ч. Снизь нагрузку.');
  if(water<4)tips.push('💧 Мало воды. 2 стакана сейчас.');
  if(mood<5)tips.push('❤️ Настроение низкое. Прогулка + дыхание.');
  if(!tips.length)tips.push('✨ Всё в балансе. Хороший день для Deep Work.');
  return tips;
}

/* ============================================================
   MORE
   ============================================================ */
function renderMore(){
  var groups=[
    {title:'🎓 Обучение',items:[
      {key:'learning',emoji:'🎓',label:'Обучение'},
      {key:'learnplan',emoji:'🗓',label:'План обучения'},
      {key:'english',emoji:'🇬🇧',label:'English'},
      {key:'skills',emoji:'💎',label:'Навыки'},
      {key:'methods',emoji:'🎯',label:'Методики'},
      {key:'psychology',emoji:'🧠',label:'Психология'},
      {key:'thinking',emoji:'💡',label:'Мышление'},
      {key:'etiquette',emoji:'🎩',label:'Этикет'},
      {key:'hormones',emoji:'🧬',label:'Гормоны'},
      {key:'wealth',emoji:'💰',label:'Богатство'}
    ]},
    {title:'🏥 Здоровье',items:[
      {key:'medical',emoji:'🏥',label:'Медицина'},
      {key:'health',emoji:'❤️',label:'Здоровье'},
      {key:'water',emoji:'💧',label:'Вода'},
      {key:'mood',emoji:'💭',label:'Настроение'},
      {key:'workouts',emoji:'🏋️',label:'Тренировки'},
      {key:'meditation',emoji:'🧘',label:'Медитации'},
      {key:'meds',emoji:'💊',label:'Лекарства'}
    ]},
    {title:'📅 Планирование',items:[
      {key:'planning',emoji:'📅',label:'Планирование'},
      {key:'gcal',emoji:'📅',label:'Календарь'},
      {key:'stats',emoji:'📊',label:'Статистика'},
      {key:'detailedStats',emoji:'📈',label:'Детальная'},
      {key:'matrix',emoji:'🔢',label:'Матрица'},
      {key:'timer',emoji:'⏱',label:'Таймер'},
      {key:'focus',emoji:'🎯',label:'Фокус'}
    ]},
    {title:'👁 Зрение',items:[
      {key:'vision',emoji:'👁',label:'Зрение'},
      {key:'vision60',emoji:'🤸',label:'75 упражнений'},
      {key:'visiontrack',emoji:'📊',label:'Трекер'}
    ]},
    {title:'🎬 Досуг',items:[
      {key:'entertainment',emoji:'🎬',label:'Досуг'},
      {key:'resources',emoji:'🔗',label:'Свои ресурсы'}
    ]},
    {title:'🎯 Цели',items:[
      {key:'habits',emoji:'🔄',label:'Привычки'},
      {key:'goals',emoji:'🎯',label:'Цели'},
      {key:'notes',emoji:'📝',label:'Заметки'},
      {key:'journal',emoji:'📓',label:'Дневник'}
    ]},
    {title:'🌿 Восстановление',items:[
      {key:'recovery',emoji:'🌿',label:'Восстановление'},
      {key:'screentracker',emoji:'📱',label:'Детокс'},
      {key:'detoxcourse',emoji:'📚',label:'30-дневный курс'}
    ]},
    {title:'⚙️ Система',items:[
      {key:'storage',emoji:'🗄',label:'Хранилище'},
      {key:'integrations',emoji:'🔗',label:'Интеграции'},
      {key:'settings',emoji:'⚙️',label:'Настройки'},
      {key:'profile',emoji:'👤',label:'Профиль'}
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
function renderPersonalPlan(){
  var html='<div class="page"><div class="title-xl">🎯 План</div>';
  html+='<div class="empty"><div class="empty-icon">📋</div><div class="empty-title">Пройди опрос</div><button class="btn btn-primary btn-block mt-3" onclick="startSurvey()">Пройти</button></div>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}

/* ============================================================
   LIFE OS — APP.js v41 — ЧАСТЬ 2/2
   Мед-ИИ, Google Calendar, экран-статистика, PWA, AI, настройки
   ============================================================ */

/* ============================================================
   МЕДИЦИНА — ИИ-ВРАЧ
   ============================================================ */
var MED_METRICS=[
{id:'bp_sys',name:'Давление систолическое',unit:'мм рт.ст.',icon:'💓',normal:[110,130],warn:[90,140],danger:[80,180],cat:'cardiovascular'},
{id:'bp_dia',name:'Давление диастолическое',unit:'мм рт.ст.',icon:'💓',normal:[70,85],warn:[60,90],danger:[50,110],cat:'cardiovascular'},
{id:'pulse',name:'Пульс',unit:'уд/мин',icon:'❤️',normal:[60,80],warn:[50,100],danger:[40,140],cat:'cardiovascular'},
{id:'temp',name:'Температура',unit:'°C',icon:'🌡',normal:[36.3,37.0],warn:[35.5,37.5],danger:[35,38.5],cat:'general'},
{id:'weight',name:'Вес',unit:'кг',icon:'⚖️',normal:[0,999],warn:[0,999],danger:[0,999],cat:'general'},
{id:'height',name:'Рост',unit:'см',icon:'📏',normal:[0,250],warn:[0,250],danger:[0,250],cat:'general'},
{id:'sugar',name:'Сахар',unit:'ммоль/л',icon:'🩸',normal:[3.9,5.5],warn:[3.3,6.9],danger:[2.8,11],cat:'endocrine'},
{id:'oxygen',name:'Сатурация',unit:'%',icon:'🫁',normal:[95,100],warn:[92,100],danger:[88,100],cat:'respiratory'},
{id:'sleep',name:'Сон',unit:'часов',icon:'😴',normal:[7,9],warn:[6,10],danger:[4,12],cat:'recovery'},
{id:'steps',name:'Шаги',unit:'шагов',icon:'🚶',normal:[8000,20000],warn:[4000,30000],danger:[0,50000],cat:'activity'},
{id:'water',name:'Вода',unit:'мл',icon:'💧',normal:[1500,3000],warn:[1000,4000],danger:[0,6000],cat:'nutrition'},
{id:'hgb',name:'Гемоглобин',unit:'г/л',icon:'🩸',normal:[120,160],warn:[100,180],danger:[70,200],cat:'blood'},
{id:'chol',name:'Холестерин общий',unit:'ммоль/л',icon:'🫀',normal:[3.0,5.2],warn:[2.5,6.2],danger:[2.0,8.0],cat:'blood'}
];

function getMetricStatus(metricId,value){
  var m=MED_METRICS.find(function(x){return x.id===metricId});
  if(!m)return 'unknown';
  if(value>=m.danger[0]&&value<=m.danger[1]){
    if(value>=m.warn[0]&&value<=m.warn[1]){
      if(value>=m.normal[0]&&value<=m.normal[1])return 'normal';
      return 'warn';
    }
    return 'danger';
  }
  return 'danger';
}
function getStatusColor(status){
  return {normal:'var(--success)',warn:'var(--warning)',danger:'var(--danger)',unknown:'var(--text-3)'}[status]||'var(--text-3)';
}
function getStatusLabel(status){
  return {normal:'Норма',warn:'Внимание',danger:'Опасно',unknown:'—'}[status]||'—';
}

function renderMedical(){
  var data=state.medicalData||{metrics:[],entries:[],profile:{},recommendations:[]};
  var html='<div class="page"><div class="title-xl">🏥 Медицина</div>';
  html+='<div class="card card-gradient" style="text-align:center;"><div style="font-size:40px;">⚕️</div><div style="font-size:18px;font-weight:800;margin-top:6px;">ИИ-Врач</div><div style="font-size:12px;opacity:.9;margin-top:4px;">Анализ показателей · рекомендации · тренды</div></div>';
  html+='<div class="card"><h2>👤 Профиль пациента</h2>';
  var p=data.profile||{};
  html+='<div class="list-row" onclick="openMedicalProfile()"><div class="list-icon">📋</div><div class="list-body"><div class="list-title">'+(p.age?p.age+' лет':'Возраст не указан')+' · '+(p.sex==='m'?'Мужской':p.sex==='f'?'Женский':'Пол не указан')+'</div><div class="list-subtitle">'+(p.weight?p.weight+' кг · ':'')+(p.height?p.height+' см':'')+(p.chronic&&p.chronic.length?' · Хрон.: '+p.chronic.join(', '):'')+'</div></div><div class="list-chevron">›</div></div>';
  html+='</div>';
  html+='<div class="row mb-3" style="gap:8px;">';
  html+='<button class="btn btn-primary" style="flex:1;" onclick="openMedAddEntry()">➕ Замер</button>';
  html+='<button class="btn btn-ghost" style="flex:1;" onclick="runAIMedicalAnalysis()">✨ Анализ ИИ</button>';
  html+='</div>';
  var hasAny=false;
  html+='<div class="card"><h2>📊 Последние показатели</h2>';
  MED_METRICS.forEach(function(m){
    var entries=data.entries.filter(function(e){return e.metricId===m.id});
    if(entries.length){
      hasAny=true;
      var last=entries[entries.length-1];
      var status=getMetricStatus(m.id,last.value);
      var color=getStatusColor(status);
      html+='<div class="list-row" onclick="openMedMetricDetail(\''+m.id+'\')" style="border-left:3px solid '+color+';">';
      html+='<div class="list-icon">'+m.icon+'</div>';
      html+='<div class="list-body"><div class="list-title">'+m.name+'</div>';
      html+='<div class="list-subtitle"><span style="color:'+color+';font-weight:700;">'+last.value+' '+m.unit+'</span> · '+getStatusLabel(status)+' · '+last.date+'</div></div>';
      html+='<div class="list-chevron">›</div></div>';
    }
  });
  if(!hasAny)html+='<div class="empty"><div class="empty-icon">📋</div><div class="empty-title">Нет данных</div><div class="empty-text">Добавь первый замер</div></div>';
  html+='</div>';
  if(data.recommendations&&data.recommendations.length){
    html+='<div class="card"><h2>✨ Рекомендации ИИ</h2>';
    data.recommendations.slice(-3).reverse().forEach(function(r){
      html+='<div class="insight-card" style="margin-bottom:8px;"><div class="footnote text-tertiary">'+r.date+'</div><div style="font-size:13px;line-height:1.5;margin-top:4px;">'+renderMd(r.text)+'</div></div>';
    });
    html+='</div>';
  }
  html+='<div class="card" style="background:rgba(255,107,107,.08);border-color:rgba(255,107,107,.3);"><h2>⚠️ Дисклеймер</h2><div class="footnote text-secondary">ИИ-Врач не заменяет реального врача. При острых симптомах — 103/112. При хронических — к специалисту.</div></div>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}

function openMedicalProfile(){
  var p=(state.medicalData&&state.medicalData.profile)||{};
  var html='<div class="field"><label class="field-label">Возраст</label><input type="number" id="med-age" value="'+(p.age||'')+'" min="0" max="120"/></div>';
  html+='<div class="field"><label class="field-label">Пол</label><select id="med-sex"><option value="">— Не указан —</option><option value="m"'+(p.sex==='m'?' selected':'')+'>Мужской</option><option value="f"'+(p.sex==='f'?' selected':'')+'>Женский</option></select></div>';
  html+='<div class="row" style="gap:8px;"><div style="flex:1;"><label class="field-label">Вес (кг)</label><input type="number" id="med-weight" value="'+(p.weight||'')+'" step="0.1"/></div><div style="flex:1;"><label class="field-label">Рост (см)</label><input type="number" id="med-height" value="'+(p.height||'')+'" step="0.1"/></div></div>';
  html+='<div class="field"><label class="field-label">Хронические заболевания (через запятую)</label><input type="text" id="med-chronic" value="'+esc((p.chronic||[]).join(', '))+'"/></div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="saveMedicalProfile()">💾 Сохранить</button>';
  openSheet('Профиль пациента',html);
}
function saveMedicalProfile(){
  if(!state.medicalData)state.medicalData={metrics:[],entries:[],profile:{},recommendations:[]};
  if(!state.medicalData.profile)state.medicalData.profile={};
  state.medicalData.profile.age=parseInt((document.getElementById('med-age')||{}).value)||null;
  state.medicalData.profile.sex=(document.getElementById('med-sex')||{}).value||null;
  state.medicalData.profile.weight=parseFloat((document.getElementById('med-weight')||{}).value)||null;
  state.medicalData.profile.height=parseFloat((document.getElementById('med-height')||{}).value)||null;
  var chronicStr=(document.getElementById('med-chronic')||{}).value||'';
  state.medicalData.profile.chronic=chronicStr.split(',').map(function(s){return s.trim()}).filter(function(s){return s});
  save();closeSheet();toast('✓ Профиль сохранён','success');renderMedical();
}
window.openMedicalProfile=openMedicalProfile;
window.saveMedicalProfile=saveMedicalProfile;

function openMedAddEntry(){
  var html='<div class="field"><label class="field-label">Что измерить</label><select id="med-metric">';
  MED_METRICS.forEach(function(m){html+='<option value="'+m.id+'">'+m.icon+' '+m.name+' ('+m.unit+')</option>'});
  html+='</select></div>';
  html+='<div class="field"><label class="field-label">Значение</label><input type="number" id="med-value" step="0.1" autofocus/></div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="medSaveEntry()">💾 Сохранить</button>';
  openSheet('Новый замер',html);
}
function medSaveEntry(){
  var metricId=(document.getElementById('med-metric')||{}).value;
  var value=parseFloat((document.getElementById('med-value')||{}).value);
  if(isNaN(value)){toast('Введи число','error');return}
  if(!state.medicalData)state.medicalData={metrics:[],entries:[],profile:{},recommendations:[]};
  state.medicalData.entries.push({id:uid(),metricId:metricId,value:value,date:today(),timestamp:nowISO()});
  save();closeSheet();haptic('success');toast('✓ Сохранено','success');
  renderMedical();
}
function openMedMetricDetail(id){
  var m=MED_METRICS.find(function(x){return x.id===id});if(!m)return;
  var data=state.medicalData||{metrics:[],entries:[],profile:{},recommendations:[]};
  var list=data.entries.filter(function(e){return e.metricId===id}).slice().reverse();
  var avg=list.length?list.slice(0,30).reduce(function(a,e){return a+e.value},0)/Math.min(list.length,30):0;
  var html='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:48px;">'+m.icon+'</div><div style="font-size:20px;font-weight:800;">'+m.name+'</div><div class="footnote text-secondary">'+m.unit+' · Норма: '+m.normal[0]+'–'+m.normal[1]+'</div></div>';
  if(list.length){
    var last=list[0];
    var status=getMetricStatus(id,last.value);
    var color=getStatusColor(status);
    html+='<div class="card" style="text-align:center;border-color:'+color+';"><div style="font-size:36px;font-weight:800;color:'+color+';">'+last.value+'</div><div class="footnote text-secondary">'+m.unit+' · '+getStatusLabel(status)+' · '+last.date+'</div><div class="footnote text-tertiary mt-2">Среднее за 30: '+avg.toFixed(1)+' '+m.unit+'</div></div>';
  }
  html+='<button class="btn btn-primary btn-block" onclick="closeSheet();medQuickAdd(\''+id+'\')">➕ Добавить</button>';
  if(list.length){
    html+='<div class="card" style="margin-top:12px;"><h2>История</h2>';
    list.slice(0,50).forEach(function(e){
      var st=getMetricStatus(id,e.value);
      var cl=getStatusColor(st);
      html+='<div class="stat-row"><span class="stat-row-label">'+e.date+'</span><span class="stat-row-value" style="color:'+cl+';">'+e.value+' '+m.unit+'</span></div>';
    });
    html+='</div>';
  }
  openSheet(m.name,html);
}
function medQuickAdd(id){
  var m=MED_METRICS.find(function(x){return x.id===id});if(!m)return;
  var html='<div class="field"><label class="field-label">Значение ('+m.unit+')</label><input type="number" id="med-q-value" step="0.1" autofocus/></div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="medSaveQuick(\''+id+'\')">💾 Сохранить</button>';
  openSheet(m.name,html);
}
function medSaveQuick(id){
  var v=parseFloat((document.getElementById('med-q-value')||{}).value);
  if(isNaN(v)){toast('Введи число','error');return}
  if(!state.medicalData)state.medicalData={metrics:[],entries:[],profile:{},recommendations:[]};
  state.medicalData.entries.push({id:uid(),metricId:id,value:v,date:today(),timestamp:nowISO()});
  save();closeSheet();haptic('success');toast('✓ Сохранено','success');renderMedical();
}
async function runAIMedicalAnalysis(){
  var data=state.medicalData||{metrics:[],entries:[],profile:{},recommendations:[]};
  if(!data.entries.length){toast('Добавь хотя бы 1 замер','warning');return}
  toast('✨ ИИ анализирует...','info');
  var byMetric={};
  data.entries.forEach(function(e){
    if(!byMetric[e.metricId])byMetric[e.metricId]=[];
    byMetric[e.metricId].push(e);
  });
  var summary='';
  Object.keys(byMetric).forEach(function(mid){
    var m=MED_METRICS.find(function(x){return x.id===mid});if(!m)return;
    var arr=byMetric[mid];
    var last=arr[arr.length-1];
    var avg=arr.slice(-14).reduce(function(a,e){return a+e.value},0)/Math.min(arr.length,14);
    var status=getMetricStatus(mid,last.value);
    summary+='- '+m.name+': последнее '+last.value+' '+m.unit+' ('+last.date+'), среднее '+avg.toFixed(1)+', статус: '+status+'\n';
  });
  var prompt='ПАЦИЕНТ: возраст '+(data.profile.age||'не указан')+', пол '+(data.profile.sex||'не указан')+', вес '+(data.profile.weight||'?')+' кг, рост '+(data.profile.height||'?')+' см. Хронические: '+((data.profile.chronic||[]).join(', ')||'нет')+'.\n\nПОКАЗАТЕЛИ:\n'+summary+'\n\nДай краткий анализ: 1) Общая оценка. 2) Тревожные знаки. 3) Что проверить. 4) Рекомендации по образу жизни. 5) К какому врачу. Без диагнозов.';
  var reply=await callAI('doctor',prompt);
  if(!state.medicalData.recommendations)state.medicalData.recommendations=[];
  state.medicalData.recommendations.push({id:uid(),date:today(),text:reply,timestamp:nowISO()});
  save();haptic('success');toast('✓ Анализ готов','success');
  renderMedical();
  setTimeout(function(){
    var html='<div style="font-size:14px;line-height:1.6;">'+renderMd(reply)+'</div>';
    openSheet('✨ Анализ ИИ-врача',html);
  },400);
}
window.openMedAddEntry=openMedAddEntry;
window.medSaveEntry=medSaveEntry;
window.openMedMetricDetail=openMedMetricDetail;
window.medQuickAdd=medQuickAdd;
window.medSaveQuick=medSaveQuick;
window.runAIMedicalAnalysis=runAIMedicalAnalysis;
window.renderMedical=renderMedical;

/* ============================================================
   GOOGLE CALENDAR
   ============================================================ */
var CAL_COLORS=[
{id:'tomato',name:'Помидор',hex:'#d50000'},
{id:'flamingo',name:'Фламинго',hex:'#e67c73'},
{id:'tangerine',name:'Мандарин',hex:'#f4511e'},
{id:'banana',name:'Банан',hex:'#f6bf26'},
{id:'sage',name:'Шалфей',hex:'#33b679'},
{id:'basil',name:'Базилик',hex:'#0b8043'},
{id:'peacock',name:'Павлин',hex:'#039be5'},
{id:'blueberry',name:'Черника',hex:'#3f51b5'},
{id:'lavender',name:'Лаванда',hex:'#7986cb'},
{id:'grape',name:'Виноград',hex:'#8e24aa'},
{id:'graphite',name:'Графит',hex:'#616161'}
];
var CAL_NOTIFICATIONS=[
{value:0,label:'Не напоминать'},{value:5,label:'За 5 минут'},{value:10,label:'За 10 минут'},
{value:15,label:'За 15 минут'},{value:30,label:'За 30 минут'},{value:60,label:'За 1 час'},
{value:120,label:'За 2 часа'},{value:1440,label:'За 1 день'},{value:2880,label:'За 2 дня'},
{value:10080,label:'За 1 неделю'}
];
var CAL_REPEATS=[
{value:'none',label:'Не повторять'},{value:'daily',label:'Каждый день'},
{value:'weekday',label:'По будням'},{value:'weekly',label:'Каждую неделю'},
{value:'biweekly',label:'Каждые 2 недели'},{value:'monthly',label:'Каждый месяц'},
{value:'yearly',label:'Каждый год'}
];
var CAL_VIEW='month';
var CAL_CURSOR=new Date();

function calColorHex(id){var c=CAL_COLORS.find(function(x){return x.id===id});return c?c.hex:'#5b9eff'}
function calTodayISO(){return today()}
function calISO(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())}
function calParseISO(iso){var p=(iso||'').split('-');if(p.length!==3)return new Date();return new Date(parseInt(p[0]),parseInt(p[1])-1,parseInt(p[2]))}
function calDaysInMonth(y,m){return new Date(y,m+1,0).getDate()}
function calMonthName(m){return ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'][m]}
function calMonthNameShort(m){return ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'][m]}
function calWeekDayName(d){return ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'][d]}
function calWeekDayNameFull(d){return ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'][d]}
function calStartOfWeek(date){
  var d=new Date(date);var day=d.getDay();
  var diff=d.getDate()-day+(day===0?-6:1);
  d.setDate(diff);d.setHours(0,0,0,0);return d;
}
function calEventsOnDate(dateISO){
  return (state.calendarEvents||[]).filter(function(ev){
    var start=(ev.start||'').slice(0,10);
    var end=(ev.end||ev.start||'').slice(0,10);
    if(start&&end&&start!==end)return dateISO>=start&&dateISO<=end;
    return start===dateISO;
  }).sort(function(a,b){return (a.start||'').localeCompare(b.start||'')});
}
function calFormatTime(iso){if(!iso)return '';return iso.slice(11,16)||''}
function calNotifLabel(v){var n=CAL_NOTIFICATIONS.find(function(x){return x.value===v});return n?n.label:'—'}
function calRepeatLabel(v){var r=CAL_REPEATS.find(function(x){return x.value===v});return r?r.label:''}
function calEscape(s){return esc(s)}

function renderGcal(){
  var app=document.getElementById('app');if(!app)return;
  var gcal=state.integrations.gcal||{};
  var html='<div class="page cal-page">';
  html+='<div class="cal-toolbar">';
  html+='<button class="cal-nav-btn" onclick="calNavigate(\'prev\')">‹</button>';
  html+='<button class="cal-today-btn" onclick="calGoToday()">Сегодня</button>';
  html+='<button class="cal-nav-btn" onclick="calNavigate(\'next\')">›</button>';
  html+='<div class="cal-title">'+calGetTitle()+'</div>';
  html+='<div class="cal-views">';
  html+='<button class="cal-view-btn '+(CAL_VIEW==='day'?'active':'')+'" onclick="calSetView(\'day\')">День</button>';
  html+='<button class="cal-view-btn '+(CAL_VIEW==='week'?'active':'')+'" onclick="calSetView(\'week\')">Нед</button>';
  html+='<button class="cal-view-btn '+(CAL_VIEW==='month'?'active':'')+'" onclick="calSetView(\'month\')">Мес</button>';
  html+='</div></div>';
  // Google статус
  if(gcal.connected){
    html+='<div class="card" style="background:rgba(61,220,151,.1);border-color:rgba(61,220,151,.35);padding:10px 14px;"><div class="row-between"><div class="footnote" style="color:var(--success);font-weight:700;">✓ Google Calendar подключён</div><button class="btn btn-ghost btn-xs" onclick="syncAllToGoogle()">🔄 Синхр.</button></div></div>';
  }else{
    html+='<div class="card" style="background:rgba(91,158,255,.08);border-color:rgba(91,158,255,.3);padding:10px 14px;"><div class="footnote text-secondary mb-2">📅 Подключи Google Calendar — события будут создаваться автоматически</div><button class="btn btn-primary btn-sm" onclick="openGcalSettings()">Подключить</button></div>';
  }
  html+='<button class="btn btn-primary btn-block cal-add-btn" onclick="openEventEditor(null)">➕ Новое событие</button>';
  if(CAL_VIEW==='month')html+=calRenderMonth();
  else if(CAL_VIEW==='week')html+=calRenderWeek();
  else html+=calRenderDay();
  html+=calRenderLegend();
  html+='</div>';
  app.innerHTML=html;
}
function calGetTitle(){
  if(CAL_VIEW==='month')return calMonthName(CAL_CURSOR.getMonth())+' '+CAL_CURSOR.getFullYear();
  if(CAL_VIEW==='week'){var s=calStartOfWeek(CAL_CURSOR);var e=new Date(s);e.setDate(s.getDate()+6);return s.getDate()+' '+calMonthNameShort(s.getMonth())+' – '+e.getDate()+' '+calMonthNameShort(e.getMonth())}
  return CAL_CURSOR.getDate()+' '+calMonthName(CAL_CURSOR.getMonth())+' '+CAL_CURSOR.getFullYear();
}
function calNavigate(dir){
  if(CAL_VIEW==='month')CAL_CURSOR=new Date(CAL_CURSOR.getFullYear(),CAL_CURSOR.getMonth()+(dir==='next'?1:-1),1);
  else if(CAL_VIEW==='week'){CAL_CURSOR=new Date(CAL_CURSOR);CAL_CURSOR.setDate(CAL_CURSOR.getDate()+(dir==='next'?7:-7))}
  else{CAL_CURSOR=new Date(CAL_CURSOR);CAL_CURSOR.setDate(CAL_CURSOR.getDate()+(dir==='next'?1:-1))}
  renderGcal();
}
function calGoToday(){CAL_CURSOR=new Date();renderGcal()}
function calSetView(v){CAL_VIEW=v;renderGcal()}
function calRenderMonth(){
  var y=CAL_CURSOR.getFullYear();var m=CAL_CURSOR.getMonth();
  var first=new Date(y,m,1);var firstDay=first.getDay();
  var offset=firstDay===0?6:firstDay-1;
  var days=calDaysInMonth(y,m);var todayISO=calTodayISO();
  var html='<div class="cal-month">';
  html+='<div class="cal-month-head">';
  ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].forEach(function(d){html+='<div class="cal-month-head-cell">'+d+'</div>'});
  html+='</div><div class="cal-month-grid">';
  var prevMonth=new Date(y,m,0);var prevDays=prevMonth.getDate();
  for(var i=offset-1;i>=0;i--){var dnum=prevDays-i;html+='<div class="cal-month-cell cal-other-month"><div class="cal-day-num">'+dnum+'</div></div>'}
  for(var d=1;d<=days;d++){
    var iso=y+'-'+pad(m+1)+'-'+pad(d);
    var evs=calEventsOnDate(iso);
    var isToday=iso===todayISO;
    var cls='cal-month-cell';if(isToday)cls+=' cal-today';
    html+='<div class="'+cls+'" onclick="calOpenDay(\''+iso+'\')">';
    html+='<div class="cal-day-num">'+d+'</div>';
    if(evs.length){
      html+='<div class="cal-day-events">';
      evs.slice(0,3).forEach(function(ev){html+='<div class="cal-event-dot" style="background:'+calColorHex(ev.color)+'"></div>'});
      if(evs.length>3)html+='<div class="cal-day-more">+'+(evs.length-3)+'</div>';
      html+='</div>';
    }
    html+='</div>';
  }
  var totalCells=offset+days;var remaining=(7-(totalCells%7))%7;
  for(var n=1;n<=remaining;n++)html+='<div class="cal-month-cell cal-other-month"><div class="cal-day-num">'+n+'</div></div>';
  html+='</div></div>';
  return html;
}
function calRenderWeek(){
  var start=calStartOfWeek(CAL_CURSOR);var todayISO=calTodayISO();
  var html='<div class="cal-week">';
  for(var i=0;i<7;i++){
    var d=new Date(start);d.setDate(start.getDate()+i);
    var iso=calISO(d);var evs=calEventsOnDate(iso);
    var isToday=iso===todayISO;
    var cls='cal-week-day';if(isToday)cls+=' cal-today';
    html+='<div class="'+cls+'" onclick="calOpenDay(\''+iso+'\')">';
    html+='<div class="cal-week-day-head"><div class="cal-week-day-name">'+calWeekDayName(d.getDay())+'</div><div class="cal-week-day-num">'+d.getDate()+' '+calMonthNameShort(d.getMonth())+'</div></div>';
    if(evs.length){
      html+='<div class="cal-week-events">';
      evs.forEach(function(ev){
        html+='<div class="cal-week-event" style="border-left-color:'+calColorHex(ev.color)+'">';
        if(ev.start&&ev.start.length>10)html+='<div class="cal-week-event-time">'+calFormatTime(ev.start)+'</div>';
        html+='<div class="cal-week-event-title">'+calEscape(ev.title||'Событие')+'</div>';
        html+='</div>';
      });
      html+='</div>';
    }else html+='<div class="cal-week-empty">—</div>';
    html+='</div>';
  }
  html+='</div>';
  return html;
}
function calRenderDay(){
  var iso=calISO(CAL_CURSOR);var evs=calEventsOnDate(iso);var d=calParseISO(iso);
  var html='<div class="cal-day">';
  html+='<div class="cal-day-header"><div class="cal-day-header-name">'+calWeekDayNameFull(d.getDay())+'</div><div class="cal-day-header-date">'+d.getDate()+' '+calMonthName(d.getMonth())+' '+d.getFullYear()+'</div></div>';
  if(evs.length===0)html+='<div class="empty"><div class="empty-icon">📅</div><div class="empty-title">Нет событий</div></div>';
  else evs.forEach(function(ev){html+=calRenderEventCard(ev)});
  html+='</div>';
  return html;
}
function calRenderEventCard(ev){
  var color=calColorHex(ev.color);
  var html='<div class="cal-event-card" style="border-left-color:'+color+'" onclick="openEventEditor(\''+ev.id+'\')">';
  html+='<div class="cal-event-card-time">';
  if(ev.start&&ev.start.length>10){
    html+=calFormatTime(ev.start);
    if(ev.end&&ev.end.length>10&&ev.end.slice(0,10)===ev.start.slice(0,10))html+=' – '+calFormatTime(ev.end);
  }else html+='Весь день';
  html+='</div><div class="cal-event-card-body">';
  html+='<div class="cal-event-card-title">'+calEscape(ev.title||'Событие')+'</div>';
  if(ev.description)html+='<div class="cal-event-card-desc">'+calEscape(ev.description).slice(0,100)+'</div>';
  var badges=[];
  if(ev.notify>0)badges.push('🔔 '+calNotifLabel(ev.notify));
  if(ev.repeat&&ev.repeat!=='none')badges.push('🔁 '+calRepeatLabel(ev.repeat));
  if(ev.googleEventId)badges.push('☁️ Google');
  if(badges.length)html+='<div class="cal-event-card-badges">'+badges.join(' · ')+'</div>';
  html+='</div></div>';
  return html;
}
function calRenderLegend(){
  var html='<div class="card" style="margin-top:14px;"><h2>🎨 Цвета</h2><div class="cal-legend">';
  CAL_COLORS.forEach(function(c){html+='<div class="cal-legend-item"><span class="cal-legend-dot" style="background:'+c.hex+'"></span>'+c.name+'</div>'});
  html+='</div></div>';
  return html;
}
function calOpenDay(iso){CAL_CURSOR=calParseISO(iso);CAL_VIEW='day';renderGcal()}

function openEventEditor(id){
  var events=state.calendarEvents||[];
  var ev=id?events.find(function(x){return x.id===id}):null;
  var isNew=!ev;var now=new Date();
  var defaultStart=calISO(now)+'T'+pad(now.getHours())+':'+pad(now.getMinutes());
  var title=ev?(ev.title||''):'';
  var start=ev?(ev.start||defaultStart):defaultStart;
  var end=ev?(ev.end||''):'';
  var color=ev?(ev.color||'peacock'):'peacock';
  var notify=ev?(ev.notify!==undefined?ev.notify:30):30;
  var repeat=ev?(ev.repeat||'none'):'none';
  var description=ev?(ev.description||''):'';
  var html='';
  html+='<div class="field"><label class="field-label">Название</label><input type="text" id="cev-title" value="'+esc(title)+'" placeholder="Встреча, задача..."/></div>';
  html+='<div class="field"><label class="field-label">Описание</label><textarea id="cev-desc">'+esc(description)+'</textarea></div>';
  html+='<div class="field"><label class="field-label">Начало</label><input type="datetime-local" id="cev-start" value="'+start+'"/></div>';
  html+='<div class="field"><label class="field-label">Конец (необязательно)</label><input type="datetime-local" id="cev-end" value="'+end+'"/></div>';
  html+='<div class="field"><label class="field-label">Цвет</label><div class="cal-color-picker">';
  CAL_COLORS.forEach(function(c){
    html+='<button type="button" class="cal-color-btn'+(c.id===color?' active':'')+'" data-color="'+c.id+'" onclick="calPickColor(\''+c.id+'\')" style="background:'+c.hex+'"></button>';
  });
  html+='</div><input type="hidden" id="cev-color" value="'+color+'"/></div>';
  html+='<div class="field"><label class="field-label">Напоминание</label><select id="cev-notify">';
  CAL_NOTIFICATIONS.forEach(function(n){html+='<option value="'+n.value+'"'+(n.value===notify?' selected':'')+'>'+n.label+'</option>'});
  html+='</select></div>';
  html+='<div class="field"><label class="field-label">Повтор</label><select id="cev-repeat">';
  CAL_REPEATS.forEach(function(r){html+='<option value="'+r.value+'"'+(r.value===repeat?' selected':'')+'>'+r.label+'</option>'});
  html+='</select></div>';
  var gcal=state.integrations.gcal||{};
  if(gcal.connected){
    html+='<div class="card" style="background:rgba(61,220,151,.1);border-color:rgba(61,220,151,.3);padding:10px;margin-bottom:10px;"><label style="display:flex;align-items:center;gap:10px;font-size:13px;"><input type="checkbox" id="cev-google" checked style="width:20px;height:20px;"/> ☁️ Создать в Google Calendar</label></div>';
  }
  html+='<button class="btn btn-primary btn-block mt-3" onclick="saveEvent('+(id?'\''+id+'\'':'null')+')">'+(isNew?'➕ Создать':'💾 Сохранить')+'</button>';
  if(!isNew){
    html+='<button class="btn btn-ghost btn-block mt-2" onclick="googleExportEvent(\''+id+'\')">📤 Открыть в Google</button>';
    html+='<button class="btn btn-danger btn-block mt-2" onclick="deleteEvent(\''+id+'\')">🗑 Удалить</button>';
  }
  openSheet(isNew?'Новое событие':'Событие',html);
}
function calPickColor(id){
  var inp=document.getElementById('cev-color');if(inp)inp.value=id;
  document.querySelectorAll('.cal-color-btn').forEach(function(b){
    if(b.getAttribute('data-color')===id)b.classList.add('active');else b.classList.remove('active');
  });
}
async function saveEvent(id){
  var title=(document.getElementById('cev-title')||{}).value||'';
  if(!title.trim()){toast('Введи название','error');return}
  var description=(document.getElementById('cev-desc')||{}).value||'';
  var start=(document.getElementById('cev-start')||{}).value||'';
  var end=(document.getElementById('cev-end')||{}).value||'';
  var color=(document.getElementById('cev-color')||{}).value||'peacock';
  var notify=parseInt((document.getElementById('cev-notify')||{}).value||'0');
  var repeat=(document.getElementById('cev-repeat')||{}).value||'none';
  var toGoogle=(document.getElementById('cev-google')||{}).checked;
  if(!start){toast('Укажи начало','error');return}
  if(end&&end<start){toast('Конец раньше начала','error');return}
  if(!state.calendarEvents)state.calendarEvents=[];
  var savedEv;
  if(id){
    var ev=state.calendarEvents.find(function(x){return x.id===id});if(!ev)return;
    ev.title=title.trim();ev.description=description;ev.start=start;ev.end=end;
    ev.color=color;ev.notify=notify;ev.repeat=repeat;ev.updatedAt=nowISO();
    savedEv=ev;
  }else{
    savedEv={id:uid(),title:title.trim(),description:description,start:start,end:end,color:color,notify:notify,repeat:repeat,createdAt:nowISO()};
    state.calendarEvents.push(savedEv);
  }
  save();haptic('success');closeSheet();
  toast(id?'💾 Сохранено':'✓ Создано','success');
  if(toGoogle&&(state.integrations.gcal||{}).connected){
    try{
      var gid=await createGoogleEvent(savedEv);
      if(gid){savedEv.googleEventId=gid;save();toast('☁️ Создано в Google','success');}
    }catch(e){toast('Google: ошибка','error');}
  }
  renderGcal();
}
function deleteEvent(id){
  if(!confirm('Удалить событие?'))return;
  var ev=(state.calendarEvents||[]).find(function(x){return x.id===id});
  if(ev&&ev.googleEventId){
    deleteGoogleEvent(ev.googleEventId).catch(function(){});
  }
  state.calendarEvents=(state.calendarEvents||[]).filter(function(x){return x.id!==id});
  save();closeSheet();toast('Удалено','info');renderGcal();
}
function googleExportEvent(id){
  var ev=(state.calendarEvents||[]).find(function(x){return x.id===id});if(!ev)return;
  var url=calBuildGoogleUrl(ev);window.open(url,'_blank');
}
function calBuildGoogleUrl(ev){
  if(!ev||!ev.start)return 'https://calendar.google.com';
  function gfmt(iso){if(!iso)return '';var s=iso.replace(/[-:]/g,'');if(s.length===13)s+='00';return s}
  var start=gfmt(ev.start);var end=ev.end?gfmt(ev.end):'';
  if(!end){var d=new Date(ev.start);d.setHours(d.getHours()+1);end=gfmt(d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())+'T'+pad(d.getHours())+':'+pad(d.getMinutes()))}
  var params={action:'TEMPLATE',text:ev.title||'Событие',dates:start+'/'+end,details:ev.description||'',sf:'true'};
  return 'https://calendar.google.com/calendar/render?'+Object.keys(params).map(function(k){return k+'='+encodeURIComponent(params[k])}).join('&');
}
function openGcalSettings(){
  var g=(state.integrations.gcal||{});
  var html='<div class="card" style="background:rgba(91,158,255,.08);border-color:rgba(91,158,255,.3);">';
  html+='<div class="footnote text-secondary mb-3">Для автоматического создания событий нужен Google OAuth Client ID.</div>';
  html+='<div class="footnote text-secondary mb-3"><strong>Как получить:</strong><br>1. console.cloud.google.com<br>2. APIs → Google Calendar API → Enable<br>3. Credentials → OAuth Client ID<br>4. Type: Web application<br>5. Authorized origins: добавь домен приложения<br>6. Скопируй Client ID сюда</div>';
  html+='</div>';
  html+='<div class="field"><label class="field-label">Client ID</label><input type="text" id="gcal-client" value="'+esc(g.clientId||'')+'" placeholder="xxxxx.apps.googleusercontent.com"/></div>';
  html+='<div class="row-between mb-3"><div class="footnote text-secondary">Автосинхронизация</div><button class="btn btn-ghost btn-xs" onclick="toggleGcalAutoSync()">'+(g.autoSync?'Вкл':'Выкл')+'</button></div>';
  html+='<button class="btn btn-primary btn-block" onclick="saveGcalClient()">💾 Сохранить</button>';
  if(g.connected){
    html+='<button class="btn btn-ghost btn-block mt-2" onclick="syncAllToGoogle()">🔄 Синхронизировать все</button>';
    html+='<button class="btn btn-danger btn-block mt-2" onclick="disconnectGcal()">🔌 Отключить</button>';
  }else if(g.clientId){
    html+='<button class="btn btn-success btn-block mt-2" onclick="startGcalOAuth()">🔐 Войти в Google</button>';
  }
  html+='<div class="footnote text-tertiary mt-3">Без OAuth события открываются в Google через кнопку «📤 Открыть в Google» — работает всегда.</div>';
  openSheet('Google Calendar',html);
}
function saveGcalClient(){
  if(!state.integrations.gcal)state.integrations.gcal={};
  state.integrations.gcal.clientId=(document.getElementById('gcal-client')||{}).value||'';
  save();toast('✓ Client ID сохранён','success');closeSheet();
}
function toggleGcalAutoSync(){
  if(!state.integrations.gcal)state.integrations.gcal={};
  state.integrations.gcal.autoSync=!state.integrations.gcal.autoSync;
  save();openGcalSettings();
}
function startGcalOAuth(){
  var g=state.integrations.gcal||{};
  if(!g.clientId){toast('Сначала Client ID','error');return}
  var redirect=location.origin+location.pathname;
  var scope='https://www.googleapis.com/auth/calendar.events';
  var url='https://accounts.google.com/o/oauth2/v2/auth?'+
    'client_id='+encodeURIComponent(g.clientId)+
    '&redirect_uri='+encodeURIComponent(redirect)+
    '&response_type=token'+
    '&scope='+encodeURIComponent(scope)+
    '&include_granted_scopes=true&prompt=consent';
  window.location.href=url;
}
function checkGcalCallback(){
  if(location.hash&&location.hash.indexOf('access_token')>=0){
    var params={};
    location.hash.slice(1).split('&').forEach(function(kv){var p=kv.split('=');params[p[0]]=decodeURIComponent(p[1]||'')});
    if(params.access_token){
      if(!state.integrations.gcal)state.integrations.gcal={};
      state.integrations.gcal.accessToken=params.access_token;
      state.integrations.gcal.connected=true;
      state.integrations.gcal.expiresAt=Date.now()+(parseInt(params.expires_in)||3600)*1000;
      save();history.replaceState(null,'',location.pathname);
      toast('✓ Google Calendar подключён','success',3000);
      if(currentPage==='gcal'||currentPage==='calendar')renderGcal();
    }
  }
}
async function createGoogleEvent(ev){
  var g=state.integrations.gcal||{};
  if(!g.accessToken)throw new Error('no_token');
  var body={
    summary:ev.title||'Событие',
    description:ev.description||'',
    start:{dateTime:ev.start.length===16?ev.start+':00':ev.start,timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone},
    end:{dateTime:(ev.end||ev.start).length===16?(ev.end||ev.start)+':00':(ev.end||ev.start),timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone},
    reminders:{useDefault:false,overrides:[{method:'popup',minutes:ev.notify||30}]}
  };
  if(ev.repeat&&ev.repeat!=='none'){
    var rrule={daily:'RRULE:FREQ=DAILY',weekday:'RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR',weekly:'RRULE:FREQ=WEEKLY',biweekly:'RRULE:FREQ=WEEKLY;INTERVAL=2',monthly:'RRULE:FREQ=MONTHLY',yearly:'RRULE:FREQ=YEARLY'}[ev.repeat];
    if(rrule)body.recurrence=[rrule];
  }
  var resp=await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events',{
    method:'POST',
    headers:{'Authorization':'Bearer '+g.accessToken,'Content-Type':'application/json'},
    body:JSON.stringify(body)
  });
  if(!resp.ok)throw new Error('api_error');
  var data=await resp.json();
  return data.id;
}
async function deleteGoogleEvent(googleId){
  var g=state.integrations.gcal||{};
  if(!g.accessToken||!googleId)return;
  await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events/'+googleId,{
    method:'DELETE',
    headers:{'Authorization':'Bearer '+g.accessToken}
  });
}
async function syncAllToGoogle(){
  var g=state.integrations.gcal||{};
  if(!g.connected){toast('Сначала подключи Google','warning');return}
  var events=state.calendarEvents||[];
  var synced=0;
  for(var i=0;i<events.length;i++){
    var ev=events[i];
    if(ev.googleEventId)continue;
    try{
      var gid=await createGoogleEvent(ev);
      if(gid){ev.googleEventId=gid;synced++;}
    }catch(e){}
  }
  save();toast('☁️ Синхронизировано: '+synced,'success');renderGcal();
}
function disconnectGcal(){
  if(!confirm('Отключить Google Calendar?'))return;
  state.integrations.gcal={clientId:state.integrations.gcal.clientId||'',accessToken:null,connected:false,autoSync:true};
  save();closeSheet();toast('Отключено','info');renderGcal();
}
window.renderGcal=renderGcal;
window.calNavigate=calNavigate;
window.calGoToday=calGoToday;
window.calSetView=calSetView;
window.calOpenDay=calOpenDay;
window.openEventEditor=openEventEditor;
window.saveEvent=saveEvent;
window.deleteEvent=deleteEvent;
window.calPickColor=calPickColor;
window.googleExportEvent=googleExportEvent;
window.openGcalSettings=openGcalSettings;
window.saveGcalClient=saveGcalClient;
window.toggleGcalAutoSync=toggleGcalAutoSync;
window.startGcalOAuth=startGcalOAuth;
window.syncAllToGoogle=syncAllToGoogle;
window.disconnectGcal=disconnectGcal;

/* ============================================================
   SCREEN TRACKER — СТАТИСТИКА ЭКРАНА
   ============================================================ */
function screenAddMinutes(mins){
  if(!state.screenStats)state.screenStats={};
  var t=today();
  state.screenStats[t]=(state.screenStats[t]||0)+mins;
  save();
}
function screenGetToday(){return (state.screenStats||{})[today()]||0}
function screenGetWeek(){
  var total=0;var now=new Date();
  for(var i=0;i<7;i++){
    var d=new Date(now);d.setDate(now.getDate()-i);
    var iso=d.toISOString().slice(0,10);
    total+=(state.screenStats||{})[iso]||0;
  }
  return total;
}
function screenGetMonth(){
  var total=0;var now=new Date();
  for(var i=0;i<30;i++){
    var d=new Date(now);d.setDate(now.getDate()-i);
    var iso=d.toISOString().slice(0,10);
    total+=(state.screenStats||{})[iso]||0;
  }
  return total;
}
function screenGetLast7Days(){
  var arr=[];var now=new Date();
  for(var i=6;i>=0;i--){
    var d=new Date(now);d.setDate(now.getDate()-i);
    var iso=d.toISOString().slice(0,10);
    arr.push({date:iso,day:['Вс','Пн','Вт','Ср','Чт','Пт','Сб'][d.getDay()],minutes:(state.screenStats||{})[iso]||0});
  }
  return arr;
}
function screenGetLast30Days(){
  var arr=[];var now=new Date();
  for(var i=29;i>=0;i--){
    var d=new Date(now);d.setDate(now.getDate()-i);
    var iso=d.toISOString().slice(0,10);
    arr.push({date:iso,minutes:(state.screenStats||{})[iso]||0});
  }
  return arr;
}
function screenBestWorst(){
  var all=state.screenStats||{};
  var keys=Object.keys(all).filter(function(k){return all[k]>0});
  if(!keys.length)return{best:null,worst:null,bestDate:null,worstDate:null};
  var best=keys[0],worst=keys[0];
  keys.forEach(function(k){
    if(all[k]<all[best])best=k;
    if(all[k]>all[worst])worst=k;
  });
  return{best:all[best],worst:all[worst],bestDate:best,worstDate:worst};
}
function screenAverage(days){
  var arr=days===30?screenGetLast30Days():screenGetLast7Days();
  var total=arr.reduce(function(a,x){return a+x.minutes},0);
  return Math.round(total/arr.length);
}
function fmtMins(m){
  if(m<60)return m+' мин';
  return (m/60).toFixed(1)+' ч';
}
function fmtMinsHM(m){
  var h=Math.floor(m/60),mm=m%60;
  if(h===0)return mm+' мин';
  return h+' ч '+mm+' мин';
}

function renderScreenTracker(){
  var todayMin=screenGetToday();
  var weekMin=screenGetWeek();
  var monthMin=screenGetMonth();
  var avg7=screenAverage(7);
  var avg30=screenAverage(30);
  var bestWorst=screenBestWorst();
  var last7=screenGetLast7Days();
  var max7=Math.max.apply(null,last7.map(function(x){return x.minutes}).concat([1]));
  var detoxProgress=Object.keys(state.detoxCourseProgress||{}).length;
  var html='<div class="page"><div class="title-xl">📱 Экранный детокс</div>';
  // Главные метрики
  html+='<div class="stat-grid mb-4">';
  html+='<div class="stat-item"><div class="stat-value">'+fmtMinsHM(todayMin)+'</div><div class="stat-label">Сегодня</div></div>';
  html+='<div class="stat-item"><div class="stat-value">'+fmtMinsHM(weekMin)+'</div><div class="stat-label">Неделя</div></div>';
  html+='<div class="stat-item"><div class="stat-value">'+fmtMinsHM(monthMin)+'</div><div class="stat-label">Месяц</div></div>';
  html+='</div>';
  // Средние
  html+='<div class="card"><h2>📊 Средние</h2>';
  html+='<div class="stat-row"><span class="stat-row-label">Среднее за 7 дней</span><span class="stat-row-value">'+fmtMinsHM(avg7)+'</span></div>';
  html+='<div class="stat-row"><span class="stat-row-label">Среднее за 30 дней</span><span class="stat-row-value">'+fmtMinsHM(avg30)+'</span></div>';
  if(bestWorst.best!==null){
    html+='<div class="stat-row"><span class="stat-row-label">Лучший день 🏆</span><span class="stat-row-value">'+fmtMinsHM(bestWorst.best)+' ('+bestWorst.bestDate+')</span></div>';
    html+='<div class="stat-row"><span class="stat-row-label">Худший день ⚠️</span><span class="stat-row-value">'+fmtMinsHM(bestWorst.worst)+' ('+bestWorst.worstDate+')</span></div>';
  }
  html+='</div>';
  // График за 7 дней
  html+='<div class="card"><h2>📈 Последние 7 дней</h2>';
  html+='<div style="display:flex;gap:4px;align-items:flex-end;height:140px;padding:10px 0;">';
  last7.forEach(function(d){
    var pct=max7?(d.minutes/max7*100):0;
    var color=d.minutes>300?'var(--danger)':d.minutes>180?'var(--warning)':'var(--success)';
    html+='<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;">';
    html+='<div style="font-size:9px;color:var(--text-3);margin-bottom:4px;">'+Math.round(d.minutes/60*10)/10+'ч</div>';
    html+='<div style="width:100%;height:'+Math.max(2,pct)+'%;background:'+color+';border-radius:6px 6px 0 0;transition:height .4s;min-height:4px;"></div>';
    html+='<div style="font-size:10px;font-weight:700;color:var(--text-2);margin-top:4px;">'+d.day+'</div>';
    html+='</div>';
  });
  html+='</div></div>';
  // Кнопка добавить
  html+='<button class="btn btn-primary btn-block mb-3" onclick="openScreenAdd()">➕ Добавить время за сегодня</button>';
  // Топ дней месяца
  var month30=screenGetLast30Days().filter(function(x){return x.minutes>0}).sort(function(a,b){return b.minutes-a.minutes}).slice(0,5);
  if(month30.length){
    html+='<div class="card"><h2>🏆 Топ-5 дней месяца</h2>';
    month30.forEach(function(d,i){
      html+='<div class="stat-row"><span class="stat-row-label">'+(i+1)+'. '+d.date+'</span><span class="stat-row-value">'+fmtMinsHM(d.minutes)+'</span></div>';
    });
    html+='</div>';
  }
  // Курс детокса
  html+='<div class="card" style="background:linear-gradient(135deg,rgba(255,107,107,.15),rgba(255,169,64,.1));"><h2>📚 30-дневный курс</h2><div class="footnote text-secondary mb-3">Пройдено: '+detoxProgress+'/30 дней</div><div class="progress mb-3"><div class="progress-fill" style="width:'+Math.round(detoxProgress/30*100)+'%;"></div></div><button class="btn btn-primary btn-block" onclick="navigate(\'detoxcourse\')">Открыть курс</button></div>';
  // Ручные записи
  var entries=(state.screenEntries||[]).slice(-10).reverse();
  if(entries.length){
    html+='<div class="card"><h2>📋 История ввода</h2>';
    entries.forEach(function(e){
      html+='<div class="stat-row"><span class="stat-row-label">'+e.date+(e.note?' · '+esc(e.note):'')+'</span><span class="stat-row-value">'+fmtMinsHM(e.minutes)+'</span></div>';
    });
    html+='</div>';
  }
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}

function openScreenAdd(){
  var html='<div class="field"><label class="field-label">Дата</label><input type="date" id="scr-date" value="'+today()+'"/></div>';
  html+='<div class="field"><label class="field-label">Минут за экраном</label><input type="number" id="scr-mins" placeholder="120" min="0" step="15"/></div>';
  html+='<div class="field"><label class="field-label">Заметка</label><input type="text" id="scr-note" placeholder="соцсети, работа..."/></div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="saveScreenEntry()">💾 Сохранить</button>';
  openSheet('Время за экраном',html);
}
function saveScreenEntry(){
  var date=(document.getElementById('scr-date')||{}).value||today();
  var mins=parseInt((document.getElementById('scr-mins')||{}).value)||0;
  var note=(document.getElementById('scr-note')||{}).value||'';
  if(mins<=0){toast('Введи минуты','error');return}
  if(!state.screenStats)state.screenStats={};
  state.screenStats[date]=(state.screenStats[date]||0)+mins;
  if(!state.screenEntries)state.screenEntries=[];
  state.screenEntries.push({id:uid(),date:date,minutes:mins,note:note,created_at:nowISO()});
  save();closeSheet();haptic('success');toast('✓ Сохранено','success');
  renderScreenTracker();
}
window.openScreenAdd=openScreenAdd;
window.saveScreenEntry=saveScreenEntry;
window.renderScreenTracker=renderScreenTracker;

/* ============================================================
   DETOX COURSE
   ============================================================ */
function getCurrentDay(){
  var completed=Object.keys(state.detoxCourseProgress||{}).map(Number).filter(function(n){return !isNaN(n)});
  if(!completed.length)return 1;
  var max=Math.max.apply(null,completed);
  return Math.min(30,max+1);
}
function isDayCompleted(day){return !!(state.detoxCourseProgress&&state.detoxCourseProgress[day])}
function getCompletedDaysCount(){return Object.keys(state.detoxCourseProgress||{}).length}
function canOpenDay(day){if(day===1)return true;if(isDayCompleted(day))return true;return isDayCompleted(day-1)}

function renderDetoxCourse(){
  var course=window.DETOX_COURSE||[];
  var currentDay=getCurrentDay();
  var completed=getCompletedDaysCount();
  var pct=Math.round(completed/30*100);
  var html='<div class="page"><div class="title-xl">📚 Детокс-курс</div>';
  html+='<div class="detox-progress-hero"><h2>Прогресс</h2><div class="big">'+pct+'%</div><div class="small">'+completed+' из 30 · День '+currentDay+'</div><div class="progress" style="margin-top:12px;background:rgba(255,255,255,.25);height:6px;"><div class="progress-fill" style="width:'+pct+'%;background:#fff;"></div></div></div>';
  if(!course.length){
    html+='<div class="card"><div class="empty"><div class="empty-icon">📭</div><div class="empty-title">Курс не загружен</div></div></div>';
  }else{
    course.forEach(function(d){
      var isDone=isDayCompleted(d.day);
      var isCurrent=d.day===currentDay;
      var canOpen=canOpenDay(d.day);
      var cls='detox-day-card';
      if(isDone)cls+=' completed';else if(isCurrent)cls+=' current';else if(!canOpen)cls+=' locked';
      html+='<div class="'+cls+'" onclick="'+(canOpen?'openDetoxDay('+d.day+')':'toast(\'Сначала предыдущий\',\'warning\')')+'"><div class="detox-day-header"><div class="detox-day-number">'+(isDone?'✓ День '+d.day:'День '+d.day)+'</div><div class="footnote text-tertiary">'+esc(d.phase)+'</div></div><div class="detox-day-title">'+esc(d.title)+'</div><div class="detox-day-subtitle">'+esc(d.subtitle)+'</div></div>';
    });
  }
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openDetoxDay(day){
  var course=window.DETOX_COURSE||[];
  var d=course.find(function(x){return x.day===day});if(!d)return;
  var isDone=isDayCompleted(day);
  var html='<div style="text-align:center;margin-bottom:16px;">';
  html+='<div class="detox-day-number" style="margin:0 auto 8px;">День '+d.day+'</div>';
  if(d.emoji)html+='<div style="font-size:48px;margin:8px 0;">'+d.emoji+'</div>';
  html+='<div style="font-size:22px;font-weight:800;">'+esc(d.title)+'</div>';
  html+='<div class="footnote text-secondary" style="margin-top:4px;">'+esc(d.subtitle)+'</div>';
  html+='</div>';
  if(d.theory)html+='<div class="detox-section theory"><div class="detox-section-title">📚 Теория</div><div class="detox-section-content">'+formatLesson(d.theory)+'</div></div>';
  if(d.science)html+='<div class="detox-section science"><div class="detox-section-title">🔬 Наука</div><div class="detox-section-content">'+formatLesson(d.science)+'</div></div>';
  if(d.do&&d.do.length){
    html+='<div class="detox-section do"><div class="detox-section-title">✅ Что делать сегодня</div><div class="detox-section-content"><ul>';
    d.do.forEach(function(x){html+='<li>'+esc(x)+'</li>'});
    html+='</ul></div></div>';
  }
  if(d.effect)html+='<div class="detox-section effect"><div class="detox-section-title">💎 Что даёт</div><div class="detox-section-content">'+formatLesson(d.effect)+'</div></div>';
  if(d.tips)html+='<div class="detox-section tips"><div class="detox-section-title">💡 Лайфхаки</div><div class="detox-section-content">'+formatLesson(d.tips)+'</div></div>';
  if(!isDone)html+='<button class="btn btn-primary btn-block mt-3" onclick="completeDetoxDay('+d.day+')">✓ День завершён</button>';
  else html+='<div class="badge badge-success" style="display:block;text-align:center;padding:12px;margin-top:12px;">✓ Пройден</div>';
  openSheet('День '+d.day,html);
}
function completeDetoxDay(day){
  if(!state.detoxCourseProgress)state.detoxCourseProgress={};
  state.detoxCourseProgress[day]=true;
  save();haptic('success');toast('🎉 День '+day+'!','success',3500);
  checkAchievements();closeSheet();renderDetoxCourse();
}
window.openDetoxDay=openDetoxDay;
window.completeDetoxDay=completeDetoxDay;

/* ============================================================
   PLANNING
   ============================================================ */
function renderPlanning(){
  var html='<div class="page"><div class="title-xl">📅 Планирование</div>';
  html+='<div class="compact-grid">';
  html+='<div class="compact-item" onclick="navigate(\'plantoday\')"><span class="compact-icon">📅</span><span>План дня</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'planweek\')"><span class="compact-icon">🗓</span><span>План недели</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'planmonth\')"><span class="compact-icon">📆</span><span>План месяца</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'gcal\')"><span class="compact-icon">📅</span><span>Календарь</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'obsidian\')"><span class="compact-icon">📓</span><span>Obsidian</span></div>';
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
function renderPlanToday(){
  var date=currentDayPlanDate;
  var plan=state.dayPlans[date];
  var html='<div class="page"><div class="title-xl">📅 План дня</div>';
  html+='<div class="card"><h2>Дата</h2><input type="date" value="'+date+'" onchange="currentDayPlanDate=this.value;renderPlanToday()"/></div>';
  if(plan){
    html+='<div class="card"><h2>✅ Задачи</h2>';
    (plan.tasks||[]).forEach(function(t,i){
      html+='<div class="task-item '+(t.done?'completed':'')+'" onclick="togglePlanTask(\'day\',\''+date+'\','+i+')"><div class="task-checkbox '+(t.done?'checked':'')+'">'+(t.done?'✓':'')+'</div><div class="task-content"><div class="task-title">'+esc(t.title)+'</div></div></div>';
    });
    html+='</div>';
  }
  html+='<button class="btn btn-primary btn-block" onclick="createDayPlan(\''+date+'\')">'+(plan?'Обновить':'Создать')+' план</button>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function createDayPlan(date){
  var plan=state.dayPlans[date]||{tasks:[]};
  var taskTitles=prompt('Задачи (через запятую):',plan.tasks.map(function(t){return t.title}).join(', '));
  if(taskTitles===null)return;
  plan.tasks=taskTitles.split(',').map(function(t){return{title:t.trim(),done:false}}).filter(function(t){return t.title});
  state.dayPlans[date]=plan;
  save();toast('✓ План сохранён','success');renderPlanToday();
}
function togglePlanTask(type,date,idx){
  var plan=type==='day'?state.dayPlans[date]:(type==='week'?state.weekPlans[date]:state.monthPlans[date]);
  if(!plan||!plan.tasks[idx])return;
  plan.tasks[idx].done=!plan.tasks[idx].done;
  save();
  if(type==='day')renderPlanToday();else if(type==='week')renderPlanWeek();else renderPlanMonth();
}
function renderPlanWeek(){
  var weekKey=getWeekKey();
  var plan=state.weekPlans[weekKey];
  var html='<div class="page"><div class="title-xl">🗓 План недели</div>';
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:12px;">Неделя</div><div style="font-size:24px;font-weight:800;">'+weekKey+'</div></div>';
  if(plan){
    html+='<div class="card"><h2>✅ Задачи</h2>';
    (plan.tasks||[]).forEach(function(t,i){
      html+='<div class="task-item '+(t.done?'completed':'')+'" onclick="togglePlanTask(\'week\',\''+weekKey+'\','+i+')"><div class="task-checkbox '+(t.done?'checked':'')+'">'+(t.done?'✓':'')+'</div><div class="task-content"><div class="task-title">'+esc(t.title)+'</div></div></div>';
    });
    html+='</div>';
  }
  html+='<button class="btn btn-primary btn-block" onclick="createWeekPlan(\''+weekKey+'\')">'+(plan?'Обновить':'Создать')+'</button></div>';
  document.getElementById('app').innerHTML=html;
}
function createWeekPlan(weekKey){
  var plan=state.weekPlans[weekKey]||{tasks:[]};
  var taskTitles=prompt('Задачи недели:',plan.tasks.map(function(t){return t.title}).join(', '));
  if(taskTitles===null)return;
  plan.tasks=taskTitles.split(',').map(function(t){return{title:t.trim(),done:false}}).filter(function(t){return t.title});
  state.weekPlans[weekKey]=plan;
  save();toast('✓ План недели','success');renderPlanWeek();
}
function renderPlanMonth(){
  var monthKey=getMonthKey();
  var plan=state.monthPlans[monthKey];
  var html='<div class="page"><div class="title-xl">📆 План месяца</div>';
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:12px;">Месяц</div><div style="font-size:24px;font-weight:800;">'+monthKey+'</div></div>';
  if(plan){
    html+='<div class="card"><h2>✅ Задачи</h2>';
    (plan.tasks||[]).forEach(function(t,i){
      html+='<div class="task-item '+(t.done?'completed':'')+'" onclick="togglePlanTask(\'month\',\''+monthKey+'\','+i+')"><div class="task-checkbox '+(t.done?'checked':'')+'">'+(t.done?'✓':'')+'</div><div class="task-content"><div class="task-title">'+esc(t.title)+'</div></div></div>';
    });
    html+='</div>';
  }
  html+='<button class="btn btn-primary btn-block" onclick="createMonthPlan(\''+monthKey+'\')">'+(plan?'Обновить':'Создать')+'</button></div>';
  document.getElementById('app').innerHTML=html;
}
function createMonthPlan(monthKey){
  var plan=state.monthPlans[monthKey]||{tasks:[]};
  var taskTitles=prompt('Задачи месяца:',plan.tasks.map(function(t){return t.title}).join(', '));
  if(taskTitles===null)return;
  plan.tasks=taskTitles.split(',').map(function(t){return{title:t.trim(),done:false}}).filter(function(t){return t.title});
  state.monthPlans[monthKey]=plan;
  save();toast('✓ План месяца','success');renderPlanMonth();
}
function getWeekKey(){
  var d=new Date();var day=d.getDay();
  var diff=d.getDate()-day+(day===0?-6:1);
  var monday=new Date(d.setDate(diff));
  return monday.toISOString().slice(0,10);
}
function getMonthKey(){return new Date().toISOString().slice(0,7)}
window.createDayPlan=createDayPlan;
window.createWeekPlan=createWeekPlan;
window.createMonthPlan=createMonthPlan;
window.togglePlanTask=togglePlanTask;

function renderObsidian(){
  var o=state.integrations.obsidian||{};
  var html='<div class="page"><div class="title-xl">📓 Obsidian</div>';
  html+='<div class="card"><h2>Настройка</h2>';
  html+='<div class="field"><label class="field-label">API Key</label><input type="password" id="obs-key" value="'+esc(o.apiKey||'')+'"/></div>';
  html+='<div class="field"><label class="field-label">Vault</label><input type="text" id="obs-vault" value="'+esc(o.vault||'')+'"/></div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="saveObsidian()">💾 Сохранить</button></div>';
  html+='<div class="card"><h2>📖 Как подключить</h2><ol style="padding-left:20px;line-height:1.8;font-size:13px;"><li>Открой Obsidian</li><li>Сторонние плагины</li><li>Local REST API</li><li>Скопируй ключ</li><li>Вставь сюда</li></ol></div>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function saveObsidian(){
  state.integrations.obsidian=state.integrations.obsidian||{};
  state.integrations.obsidian.apiKey=(document.getElementById('obs-key')||{}).value||'';
  state.integrations.obsidian.vault=(document.getElementById('obs-vault')||{}).value||'';
  state.integrations.obsidian.connected=!!state.integrations.obsidian.apiKey;
  save();toast('✓ Obsidian сохранён','success');renderObsidian();
}
window.saveObsidian=saveObsidian;

/* ============================================================
   AI
   ============================================================ */
function renderAI(){
  var active=state.settings.activePersona||'coach';
  var personas=window.PERSONAS||{};
  var persona=personas[active]||personas.coach||{name:'AI',emoji:'✨',prompt:'Помощник'};
  var messages=state.chats.filter(function(c){return c.persona===active});
  var hasKey=!!state.settings.apiKey;
  var html='<div class="page"><div class="title-xl">✨ AI</div>';
  html+='<div class="quick-tabs">';
  Object.keys(personas).forEach(function(k){
    var p=personas[k];
    html+='<button class="quick-tab '+(active===k?'active':'')+'" onclick="switchPersona(\''+k+'\')">'+p.emoji+' '+p.name+'</button>';
  });
  html+='</div>';
  html+='<div class="card" style="min-height:340px;max-height:58vh;overflow-y:auto;" id="chatBox"><div class="chat">';
  if(messages.length){messages.forEach(function(m){html+='<div class="msg msg-'+(m.role==='user'?'user':'bot')+'">'+(m.role==='user'?esc(m.text):renderMd(m.text))+'</div>'})}
  else{html+='<div class="empty"><div class="empty-icon">'+persona.emoji+'</div><div class="empty-title">'+persona.name+'</div><div class="empty-text">'+(hasKey?'Задай вопрос':'Demo-режим')+'</div></div>'}
  html+='</div></div>';
  html+='<div class="row" style="margin-top:10px;"><input type="text" id="chatInput" placeholder="Сообщение..." style="flex:1;" onkeydown="if(event.key===\'Enter\'){event.preventDefault();sendMsg();}"/><button class="btn btn-primary btn-icon" onclick="sendMsg()">➤</button></div></div>';
  document.getElementById('app').innerHTML=html;
  var box=document.getElementById('chatBox');
  if(box)box.scrollTop=box.scrollHeight;
}
function switchPersona(p){state.settings.activePersona=p;save();renderAI()}
async function sendMsg(){
  var input=document.getElementById('chatInput');if(!input)return;
  var text=input.value.trim();if(!text)return;
  input.value='';input.disabled=true;
  var persona=state.settings.activePersona||'coach';
  state.chats.push({id:uid(),persona:persona,role:'user',text:text,timestamp:nowISO()});
  save();renderAI();
  var box=document.getElementById('chatBox');
  var typing=document.createElement('div');
  typing.className='typing';typing.innerHTML='<span></span><span></span><span></span>';
  if(box){box.appendChild(typing);box.scrollTop=box.scrollHeight}
  var reply=await callAI(persona,text);
  if(typing)typing.remove();
  state.chats.push({id:uid(),persona:persona,role:'coach',text:reply,timestamp:nowISO()});
  save();checkAchievements();renderAI();
}
async function callAI(persona,userText){
  var key=state.settings.apiKey;
  if(!key)return fallbackReply(persona,userText);
  var personas=window.PERSONAS||{};
  var p=personas[persona]||{prompt:'Помощник'};
  var history=state.chats.filter(function(c){return c.persona===persona}).slice(-10);
  try{
    var model=(state.integrations.gemini&&state.integrations.gemini.model)||'gemini-1.5-flash';
    var contents=history.map(function(m){return{role:m.role==='user'?'user':'model',parts:[{text:m.text}]}});
    if(!contents.length||contents[contents.length-1].role!=='user'){
      contents.push({role:'user',parts:[{text:userText}]});
    }
    var resp=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+model+':generateContent?key='+key,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({system_instruction:{parts:[{text:p.prompt}]},contents:contents})
    });
    var data=await resp.json();
    return (data.candidates&&data.candidates[0]&&data.candidates[0].content&&data.candidates[0].content.parts&&data.candidates[0].content.parts[0]&&data.candidates[0].content.parts[0].text)||fallbackReply(persona,userText);
  }catch(e){return fallbackReply(persona,userText)}
}
function fallbackReply(persona,text){
  text=text||'';
  if(/суицид|покончить|не хочу жить/i.test(text))return '🆘 Позвони: 8-800-2000-122 · 103 · findahelpline.com. Ты важен.';
  if(persona==='doctor')return 'Я — AI-консультант. Опиши симптомы.\n\n⚠️ Не заменяет врача. При острых — 103.';
  if(persona==='vision')return 'Упражнения для глаз: 20-20-20, пальминг, гимнастика.\n\n⚠️ При болях — к офтальмологу.';
  if(persona==='psych')return 'Слышу тебя. Что происходит?';
  if(persona==='finance')return 'Разберём бюджет. Какой доход и расходы?';
  if(persona==='nutrition')return 'Расскажи про питание. Что ешь обычно?';
  if(persona==='fitness')return 'Какой уровень подготовки? Что тренируешь?';
  return 'Слышу тебя. Расскажи подробнее.';
}
function renderMd(text){
  if(!text)return '';
  var h=esc(text);
  h=h.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
  h=h.replace(/\n\n/g,'</p><p>');
  h=h.replace(/\n/g,'<br>');
  return '<p>'+h+'</p>';
}
window.switchPersona=switchPersona;
window.sendMsg=sendMsg;
window.callAI=callAI;

/* ============================================================
   SETTINGS / STORAGE / INTEGRATIONS
   ============================================================ */
function renderSettings(){
  var themes=window.THEMES||[];
  var currentTheme=themes.find(function(t){return t.id===state.settings.theme})||{name:'dark'};
  var html='<div class="page"><div class="title-xl">⚙️ Настройки</div>';
  html+='<div class="card"><h2>Профиль</h2><div class="field"><label class="field-label">Имя</label><input type="text" value="'+esc(state.profile.name)+'" onchange="saveProfileName(this.value)"/></div><div class="list-row" onclick="openThemePicker()"><div class="list-icon">🎨</div><div class="list-body"><div class="list-title">Тема</div></div><div class="list-value">'+currentTheme.name+'</div></div></div>';
  html+='<div class="card"><h2>Обучение</h2><div class="list-row" onclick="changeLearnTarget()"><div class="list-icon">⏱</div><div class="list-body"><div class="list-title">Цель обучения</div></div><div class="list-value">'+(state.settings.dailyLearnTarget||150)+' мин</div></div></div>';
  html+='<div class="card"><h2>Интеграции</h2><div class="list-row" onclick="navigate(\'integrations\')"><div class="list-icon">🔗</div><div class="list-body"><div class="list-title">Все интеграции</div></div><div class="list-chevron">›</div></div></div>';
  html+='<div class="card"><h2>Данные</h2><div class="list-row" onclick="navigate(\'storage\')"><div class="list-icon">🗄</div><div class="list-body"><div class="list-title">Хранилище</div></div><div class="list-chevron">›</div></div></div>';
  // PWA install
  if(pwaInstallPrompt){
    html+='<div class="card" style="background:linear-gradient(135deg,color-mix(in srgb,var(--brand) 15%,transparent),color-mix(in srgb,var(--brand-2) 10%,transparent));"><h2>📱 Установить приложение</h2><div class="footnote text-secondary mb-3">Работает без Telegram — как отдельное приложение.</div><button class="btn btn-primary btn-block" onclick="installPWA()">Установить</button></div>';
  }
  html+='<div class="footnote text-tertiary" style="text-align:center;margin-top:24px;">Life OS v41</div></div>';
  document.getElementById('app').innerHTML=html;
}
function renderStorage(){
  var totalSize=0;
  try{var raw=localStorage.getItem(STORAGE_KEY);totalSize=raw?raw.length:0}catch(e){}
  var html='<div class="page"><div class="title-xl">🗄 Хранилище</div>';
  html+='<div class="card"><div class="list-row"><div class="list-icon">✓</div><div class="list-body"><div class="list-title">'+STORAGE_KEY+'</div></div><div class="list-value">'+(totalSize/1024).toFixed(1)+' KB</div></div></div>';
  html+='<div class="card"><h2>Операции</h2><button class="btn btn-primary btn-block mb-2" onclick="exportDB()">📤 Экспорт JSON</button><button class="btn btn-ghost btn-block mb-2" onclick="importDB()">📥 Импорт JSON</button><button class="btn btn-danger btn-block" onclick="if(confirm(\'Сброс?\')){localStorage.clear();location.reload();}">🗑 Полный сброс</button></div>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function exportDB(){
  var blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
  var url=URL.createObjectURL(blob);
  var a=document.createElement('a');
  a.href=url;a.download='life-os-'+today()+'.json';a.click();
  URL.revokeObjectURL(url);
  toast('Экспорт готов','success');
}
function importDB(){
  var input=document.createElement('input');
  input.type='file';input.accept='.json,application/json';
  input.onchange=function(e){
    var file=e.target.files[0];if(!file)return;
    var reader=new FileReader();
    reader.onload=function(){
      try{
        var data=JSON.parse(reader.result);
        if(!data||typeof data!=='object')throw new Error('bad');
        localStorage.setItem(STORAGE_KEY,JSON.stringify(data));
        toast('✓ Импорт готов. Перезагрузка...','success');
        setTimeout(function(){location.reload()},1200);
      }catch(err){toast('Ошибка импорта','error')}
    };
    reader.readAsText(file);
  };
  input.click();
}
function renderIntegrations(){
  var html='<div class="page"><div class="title-xl">🔗 Интеграции</div>';
  var obs=state.integrations.obsidian||{};
  var gcal=state.integrations.gcal||{};
  html+='<div class="list-row" onclick="navigate(\'obsidian\')"><div class="list-icon">📓</div><div class="list-body"><div class="list-title">Obsidian</div><div class="list-subtitle">'+(obs.connected?'✓ Подключён':'Не подключён')+'</div></div><div class="list-chevron">›</div></div>';
  html+='<div class="list-row" onclick="openGcalSettings()"><div class="list-icon">📅</div><div class="list-body"><div class="list-title">Google Calendar</div><div class="list-subtitle">'+(gcal.connected?'✓ Подключён':'Не подключён')+'</div></div><div class="list-chevron">›</div></div>';
  html+='<div class="card"><h2>✨ Gemini AI</h2><div class="field"><label class="field-label">API Key</label><input type="password" id="gem-key" value="'+esc((state.integrations.gemini||{}).apiKey||'')+'"/></div><button class="btn btn-primary btn-block" onclick="saveGemini()">💾 Сохранить</button><div class="footnote text-tertiary mt-2">Ключ: aistudio.google.com</div></div>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function saveGemini(){
  state.integrations.gemini=state.integrations.gemini||{};
  state.integrations.gemini.apiKey=(document.getElementById('gem-key')||{}).value||'';
  state.settings.apiKey=state.integrations.gemini.apiKey;
  state.integrations.gemini.connected=!!state.settings.apiKey;
  save();toast('✓ Gemini сохранён','success');renderIntegrations();
}
window.exportDB=exportDB;
window.importDB=importDB;
window.saveGemini=saveGemini;

/* ============================================================
   PWA
   ============================================================ */
function installPWA(){
  if(!pwaInstallPrompt){toast('Установка недоступна','info');return}
  pwaInstallPrompt.prompt();
  pwaInstallPrompt.userChoice.then(function(choice){
    if(choice.outcome==='accepted'){toast('✓ Установлено','success');pwaInstallPrompt=null;}
  });
}
window.installPWA=installPWA;

if('serviceWorker' in navigator){
  window.addEventListener('load',function(){
    navigator.serviceWorker.register('sw.js').catch(function(e){console.warn('SW:',e)});
  });
}
window.addEventListener('beforeinstallprompt',function(e){
  e.preventDefault();
  pwaInstallPrompt=e;
  if(state.settings.pwa)state.settings.pwa.installPrompt=true;
  save();
});

/* ============================================================
   WELCOME
   ============================================================ */
function showWelcome(){
  var overlay=document.createElement('div');
  overlay.className='welcome-screen';
  overlay.innerHTML='<div class="welcome-logo">🧠</div><div class="welcome-title">Life OS</div><div class="welcome-sub">Нейроэкосистема жизни. Обучение, планирование, зрение, медицина, AI.</div><button class="btn btn-primary btn-block" style="max-width:340px;" onclick="startOnboarding()">Начать</button>';
  document.body.appendChild(overlay);
}
function startOnboarding(){
  var w=document.querySelector('.welcome-screen');if(w)w.remove();
  var name=window.__tgName||'';
  if(!name){
    var overlay=document.createElement('div');
    overlay.className='welcome-screen';
    overlay.innerHTML='<div class="welcome-logo">👤</div><div class="welcome-title">Как тебя зовут?</div><input type="text" class="welcome-input" id="welcome-name" placeholder="Имя" maxlength="30"/><button class="btn btn-primary btn-block mt-4" style="max-width:340px;margin-top:16px;" onclick="finishOnboarding()">Далее</button>';
    document.body.appendChild(overlay);
    setTimeout(function(){var i=document.getElementById('welcome-name');if(i)i.focus()},300);
  }else{
    state.profile.name=name;
    state.settings.onboardingDone=true;
    save();updateHeader();renderTabBar();renderDashboard();
  }
}
function finishOnboarding(){
  var inp=document.getElementById('welcome-name');
  var name=inp?inp.value.trim():'';
  if(!name)return toast('Введи имя','error');
  state.profile.name=name;
  state.settings.onboardingDone=true;
  save();
  var w=document.querySelector('.welcome-screen');if(w)w.remove();
  updateHeader();renderTabBar();renderDashboard();
  haptic('success');toast('Добро пожаловать, '+name+'!','success');
}
window.startOnboarding=startOnboarding;
window.finishOnboarding=finishOnboarding;

/* ============================================================
   INIT
   ============================================================ */
function init(){
  try{
    checkGcalCallback();
    applyTheme(state.settings.theme);
    updateHeader();
    if(!state.profile.name&&!state.settings.onboardingDone){showWelcome();return}
    if(state.profile.name&&!state.settings.onboardingDone){state.settings.onboardingDone=true;save()}
    if(!state.profile.name&&window.__tgName){state.profile.name=window.__tgName;save();updateHeader()}
    if(state.tasks.length===0){
      state.tasks=[
        {id:uid(),title:'Завершить отчёт',category:'Работа',planned_time:45,actual_time:0,status:'pending',priority:'high',created_at:nowISO()},
        {id:uid(),title:'Повторить 10 слов',category:'Обучение',planned_time:15,actual_time:0,status:'pending',priority:'medium',created_at:nowISO()},
        {id:uid(),title:'Дневник: 3 победы',category:'Личное',planned_time:5,actual_time:0,status:'pending',priority:'medium',created_at:nowISO()}
      ];
      save();
    }
    if(!state.xp)state.xp=0;
    if(state.settings.effectsEnabled===undefined)state.settings.effectsEnabled=true;
    renderTabBar();
    renderDashboard();
    var t=today();
    if(state.stats.lastActiveDay!==t){
      var y=new Date();y.setDate(y.getDate()-1);
      var wasYesterday=state.stats.lastActiveDay===y.toISOString().slice(0,10);
      state.stats.streak=wasYesterday?(state.stats.streak||0)+1:1;
      if(state.stats.streak>(state.stats.bestStreak||0))state.stats.bestStreak=state.stats.streak;
      state.stats.lastActiveDay=t;
      save();
    }
    setTimeout(function(){try{checkAchievements()}catch(e){}},1000);
    setInterval(function(){try{save()}catch(e){}},30000);
  }catch(e){
    console.error('Init:',e);
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
window.startEffects=startEffects;
window.applyTheme=applyTheme;
window.updateHeader=updateHeader;
window.renderTabBar=renderTabBar;

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',function(){init()});
}else{
  init();
}