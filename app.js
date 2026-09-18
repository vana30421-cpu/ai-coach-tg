'use strict';
/* AI HEALTH v33 — APP (вся логика, финал с One UI 9 + surveys + content_ext) */

/* ============ TELEGRAM ============ */
try{
  var tg=window.Telegram&&window.Telegram.WebApp;
  if(tg){
    tg.expand();tg.ready();
    try{tg.setHeaderColor('#000000')}catch(e){}
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

function toast(msg,type,duration){
  type=type||'info';duration=duration||2500;
  var c=document.getElementById('toasts');if(!c)return;
  var el=document.createElement('div');
  el.className='toast '+type;el.textContent=msg;
  c.appendChild(el);
  setTimeout(function(){
    el.style.opacity='0';
    el.style.transform='translate(-50%,-16px)';
    el.style.transition='all .4s';
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
var STORAGE_KEY='ai_health_v33';
var OLD_KEYS=['ai_health_v32','ai_health_v31','ai_health_v30','ai_health_v29','ai_health_v28','ai_health_v26'];

function defaultState(){
  return{
    tasks:[],customHabits:[],customGoals:[],customNotes:[],journalEntries:[],
    customWater:[],customMood:[],customSleep:{},customMeds:[],customMeditation:[],
    customWorkouts:[],timerSessions:[],focusSessions:[],chats:[],
    levelProgress:{},englishProgress:{},skillsProgress:{},paths:[],courses:[],
    domainScores:{},domainHistory:{},metrics:{},
    watchlist:[],watched:[],customResources:[],
    screenStats:{},screenHabits:{},screenHistory:{},
    detoxCourseProgress:{},detoxChecklists:{},
    challengeProgress:{},dailySurveys:{},todayPlan:null,
    surveys:{},
    xp:0,level:0,activeWorkMode:null,
    integrations:{
      googleCalendar:{connected:false,clientId:'',calendarId:'primary',accessToken:null,lastSync:null},
      obsidian:{apiKey:'',defaultFolder:'AI-Health',autoSync:false,lastSync:null},
      gemini:{apiKey:'',model:'gemini-1.5-flash',connected:false},
      notion:{apiKey:'',databaseId:'',enabled:false},
      todoist:{apiKey:'',enabled:false}
    },
    profile:{
      name:'',emoji:'😊',createdAt:nowISO(),
      achievements:[],surveyAnswers:null,surveyStep:0,surveyDone:false,personalPlan:null
    },
    settings:{
      theme:'dark',provider:'gemini',apiKey:'',activePersona:'coach',waterGoal:8,
      onboardingDone:false,effectsEnabled:true,effectsIntensity:1,animationSpeed:1,
      adaptiveLearning:true,autoSave:true,lastDailySurveyDay:null
    },
    stats:{
      streak:0,lastActiveDay:null,totalDays:0,totalTasksDone:0,
      totalLessonsDone:0,totalWater:0,totalMoodLogs:0,totalWorkouts:0,
      totalMeditations:0,bestStreak:0,streakFreezes:1
    }
  };
}

function migrate(){
  try{
    if(localStorage.getItem(STORAGE_KEY))return;
    for(var i=0;i<OLD_KEYS.length;i++){
      var raw=null;
      try{raw=localStorage.getItem(OLD_KEYS[i])}catch(e){}
      if(raw){
        try{
          var old=JSON.parse(raw);
          var fresh=defaultState();
          Object.keys(old).forEach(function(k){
            if(k==='settings'){fresh.settings=Object.assign(fresh.settings,old.settings||{})}
            else if(k==='profile'){fresh.profile=Object.assign(fresh.profile,old.profile||{})}
            else if(k==='integrations'){fresh.integrations=Object.assign(fresh.integrations,old.integrations||{})}
            else if(k==='stats'){fresh.stats=Object.assign(fresh.stats,old.stats||{})}
            else if(fresh[k]!==undefined){fresh[k]=old[k]}
          });
          localStorage.setItem(STORAGE_KEY,JSON.stringify(fresh));
          return;
        }catch(e){}
      }
    }
  }catch(e){}
}
migrate();

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
    ['levelProgress','englishProgress','skillsProgress','domainScores','metrics',
     'challengeProgress','screenHistory','customSleep','dailySurveys','surveys'].forEach(function(k){
      if(!state[k])state[k]={};
    });
    ['tasks','customHabits','customGoals','customNotes','journalEntries','customWater',
     'customMood','customMeds','customMeditation','customWorkouts','timerSessions',
     'focusSessions','chats','paths','courses','watchlist','watched','customResources'
    ].forEach(function(k){
      if(!state[k])state[k]=[];
    });
  }else{
    state=defaultState();
  }
}catch(e){state=defaultState()}

function save(){
  try{
    state.settings.updatedAt=nowISO();
    localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
  }catch(e){toast('Ошибка сохранения','error')}
}

/* ============ GLOBALS ============ */
var currentPage='dashboard';
var currentLevelId=null;
var currentModuleId=null;
var currentLessonIdx=null;
var currentPathId=null;
var currentCourseId=null;
var currentQuickTab='all';
var taskFilter='all';
var taskSearch='';
var skillsFilter='all';
var learnSearchText='';
var currentDailySurveyStep=0;
var currentDailySurveyAnswers={};
var currentSurveyId=null;
var currentSurveyAnswers={};
var currentSurveyStep=0;
var timerInterval=null;
var timerSeconds=25*60;
var timerRunning=false;
var timerMode='pomodoro';
var currentEnglishFilter='all';

/* ============ EFFECTS ============ */
function startEffects(){
  var overlay=document.getElementById('themeEffect');
  if(!overlay)return;
  overlay.innerHTML='';
  try{
    if(state.settings.effectsEnabled===undefined)state.settings.effectsEnabled=true;
    if(state.settings.effectsIntensity===undefined)state.settings.effectsIntensity=1;
    if(state.settings.animationSpeed===undefined)state.settings.animationSpeed=1;
    if(!state.settings.effectsEnabled)return;
    var theme=THEMES.find(function(t){return t.id===state.settings.theme});
    if(!theme)theme={effects:'stars'};
    var effect=theme.effects||'stars';
    var intensity=state.settings.effectsIntensity||1;
    var speed=state.settings.animationSpeed||1;
    function cnt(base){return Math.round(base*intensity*2.5)}
    if(effect==='stars'||effect==='none'){
      for(var i=0;i<cnt(15);i++){var s=document.createElement('div');s.className='effect-star';s.style.left=Math.random()*100+'%';s.style.top=Math.random()*100+'%';s.style.animationDelay=Math.random()*3+'s';overlay.appendChild(s)}
    }else if(effect==='rain'){
      for(var j=0;j<cnt(25);j++){var d=document.createElement('div');d.className='effect-drop';d.style.left=Math.random()*100+'%';d.style.animationDuration=((Math.random()*1.5+1.5)/speed)+'s';d.style.animationDelay=Math.random()*5+'s';d.style.height=(Math.random()*20+12)+'px';overlay.appendChild(d)}
    }else if(effect==='petals'||effect==='hearts'){
      for(var k=0;k<cnt(12);k++){var p=document.createElement('div');p.className='effect-petal';p.textContent=effect==='hearts'?'❤':'🌸';p.style.left=Math.random()*100+'%';p.style.animationDuration=((Math.random()*8+10)/speed)+'s';p.style.animationDelay=Math.random()*10+'s';overlay.appendChild(p)}
    }else if(effect==='leaves'){
      for(var l=0;l<cnt(10);l++){var lf=document.createElement('div');lf.className='effect-leaf';lf.textContent='🍃';lf.style.left=Math.random()*100+'%';lf.style.animationDuration=((Math.random()*8+8)/speed)+'s';lf.style.animationDelay=Math.random()*10+'s';overlay.appendChild(lf)}
    }else if(effect==='snow'){
      for(var n=0;n<cnt(18);n++){var sn=document.createElement('div');sn.className='effect-snowflake';sn.textContent='❄';sn.style.left=Math.random()*100+'%';sn.style.animationDuration=((Math.random()*6+8)/speed)+'s';sn.style.animationDelay=Math.random()*10+'s';overlay.appendChild(sn)}
    }else if(effect==='waves'||effect==='bubbles'){
      for(var w=0;w<cnt(4);w++){var wv=document.createElement('div');wv.className='effect-wave';wv.style.bottom=(w*25)+'px';wv.style.animationDelay=(w*1.5)+'s';overlay.appendChild(wv)}
    }else if(effect==='spark'||effect==='neon'||effect==='holo'){
      for(var sk=0;sk<cnt(30);sk++){var spk=document.createElement('div');spk.className='effect-spark';spk.style.left=Math.random()*100+'%';spk.style.top=Math.random()*100+'%';spk.style.animationDelay=Math.random()*2+'s';overlay.appendChild(spk)}
    }else if(effect==='dust'||effect==='fireflies'||effect==='ember'||effect==='smoke'){
      for(var ff=0;ff<cnt(15);ff++){var ffl=document.createElement('div');ffl.className='effect-dust';ffl.style.left=Math.random()*100+'%';ffl.style.top=Math.random()*100+'%';ffl.style.animationDuration=((Math.random()*4+4)/speed)+'s';ffl.style.animationDelay=Math.random()*6+'s';overlay.appendChild(ffl)}
    }else{
      for(var fb=0;fb<cnt(15);fb++){var fs=document.createElement('div');fs.className='effect-star';fs.style.left=Math.random()*100+'%';fs.style.top=Math.random()*100+'%';fs.style.animationDelay=Math.random()*3+'s';overlay.appendChild(fs)}
    }
    if(overlay.children.length===0){
      for(var x=0;x<cnt(15);x++){var xs=document.createElement('div');xs.className='effect-star';xs.style.left=Math.random()*100+'%';xs.style.top=Math.random()*100+'%';xs.style.animationDelay=Math.random()*3+'s';overlay.appendChild(xs)}
    }
  }catch(e){
    for(var y=0;y<15;y++){var ys=document.createElement('div');ys.className='effect-star';ys.style.left=Math.random()*100+'%';ys.style.top=Math.random()*100+'%';ys.style.animationDelay=Math.random()*3+'s';overlay.appendChild(ys)}
  }
}

function applyTheme(id){
  try{
    var themes=THEMES.map(function(t){return t.id});
    themes.forEach(function(t){document.body.classList.remove('theme-'+t)});
    document.body.classList.add('theme-'+id);
    startEffects();
  }catch(e){document.body.classList.add('theme-dark')}
}

/* ============ TAB BAR ============ */
function renderTabBar(){
  var bar=document.getElementById('tabBar');if(!bar)return;
  var html='';
  for(var i=0;i<TABS.length;i++){
    var t=TABS[i];
    html+='<button class="tab-item '+(t.id===currentPage?'active':'')+'" onclick="navigate(\''+t.id+'\')">';
    html+='<span class="tab-icon">'+t.emoji+'</span><span class="tab-label">'+t.label+'</span></button>';
  }
  bar.innerHTML=html;
}

/* ============ QUICK TABS ============ */
function renderQuickTabs(page){
  var tabs=QUICK_TABS[page];
  if(!tabs||!tabs.length)return '';
  var html='<div class="quick-tabs">';
  tabs.forEach(function(t){
    html+='<button class="quick-tab '+(currentQuickTab===t.id?'active':'')+'" onclick="handleQuickTab(\''+page+'\',\''+t.id+'\')">'+t.emoji+' '+t.label+'</button>';
  });
  html+='</div>';
  return html;
}
function handleQuickTab(page,tabId){
  currentQuickTab=tabId;
  var tabs=QUICK_TABS[page]||[];
  var tab=tabs.find(function(t){return t.id===tabId});
  if(tab&&tab.target){navigate(tab.target);return}
  if(tab&&tab.filter){
    if(page==='english'){currentEnglishFilter=tab.filter;renderEnglish()}
    if(page==='tasks'){taskFilter=tab.filter;renderTasks()}
    return;
  }
  navigate(page);
}

/* ============ NAVIGATION ============ */
function navigate(page){
  if(!page)page='dashboard';
  currentPage=page;
  try{renderTabBar()}catch(e){}
  try{if(typeof updateSidebarInfo==='function')updateSidebarInfo()}catch(e){}
  var main=document.getElementById('app');
  if(!main)return;
  main.innerHTML='';
  var renderers={
    dashboard:renderDashboard,tasks:renderTasks,
    learning:renderLearning,levels:renderLevels,
    levelDetail:renderLevelDetail,moduleDetail:renderModuleDetail,
    skills:renderSkills,paths:renderPaths,pathDetail:renderPathDetail,
    courses:renderCourses,courseDetail:openCourse,methods:renderMethods,
    domains:renderDomains,plan:renderPersonalPlan,
    ai:renderAI,health:renderHealth,more:renderMore,
    stats:renderStats,detailedStats:renderDetailedStats,
    matrix:renderMatrix,integrations:renderIntegrations,
    metrics:renderMetrics,profile:renderProfile,
    settings:renderSettings,dbmanager:renderDBManager,
    water:renderWater,mood:renderMood,
    habits:renderHabits,goals:renderGoals,timer:renderTimer,
    notes:renderNotes,focus:renderFocus,meds:renderMeds,
    workouts:renderWorkouts,meditation:renderMeditation,
    journal:renderJournal,english:renderEnglish,
    storage:renderStorage,recovery:renderRecovery,
    entertainment:renderEntertainment,
    screentracker:renderScreenTracker,memory:renderMemory,
    iq:renderIQ,eq:renderEQ,neuromodule:renderNeuro,
    dailyplan:renderDailyPlan,watchlist:renderWatchlist,
    watched:renderWatched,detoxcourse:renderDetoxCourse,
    movies:renderMovies,series:renderSeries,books:renderBooks,
    musiclib:renderMusic,gameslib:renderGames,
    podcastslib:renderPodcasts,resources:renderResources,
    dailySurvey:renderDailySurvey,
    survey:function(){if(typeof renderSurveyStep==='function'&&currentSurveyId)renderSurveyStep()}
  };
  var fn=renderers[page];
  if(typeof fn!=='function'){
    main.innerHTML='<div class="page">'+backBtn('dashboard')+'<div class="title-xl">🚧 '+page+'</div><div class="card"><div class="empty"><div class="empty-icon">🚧</div><div class="empty-title">Раздел в разработке</div></div></div></div>';
    return;
  }
  try{fn()}catch(e){
    console.error('Render ['+page+']:',e);
    main.innerHTML='<div class="page">'+backBtn('dashboard')+'<div class="title-xl">⚠️ Ошибка</div><div class="card"><div class="empty"><div class="empty-icon">⚠️</div><div class="empty-title">'+esc(e.message||'Ошибка')+'</div><div class="empty-text">'+page+'</div></div></div></div>';
  }
  window.scrollTo({top:0});
  if(page==='profile'||page==='dashboard'){try{checkAchievements()}catch(e){}}
}
function backBtn(target){return '<button class="back-btn" onclick="navigate(\''+target+'\')">← Назад</button>'}

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

/* ============ LIVE PANEL ============ */
function openLiveControl(){
  var panel=document.getElementById('livePanel');
  var body=document.getElementById('livePanelBody');
  if(!panel||!body)return;
  var items=[
    {icon:'📋',label:'Опрос дня',action:'openDailySurvey(true);closeLiveControl()'},
    {icon:'➕',label:'Новая задача',action:'openEntityEditor(\'task\',null);closeLiveControl()'},
    {icon:'💧',label:'+1 вода',action:'addWater();closeLiveControl()'},
    {icon:'💭',label:'Настроение',action:'quickMoodLog();closeLiveControl()'},
    {icon:'😴',label:'Сон',action:'openSleepEditor();closeLiveControl()'},
    {icon:'⏱',label:'Таймер',action:'navigate(\'timer\');closeLiveControl()'},
    {icon:'🎯',label:'Фокус',action:'navigate(\'focus\');closeLiveControl()'},
    {icon:'📅',label:'План дня',action:'navigate(\'dailyplan\');closeLiveControl()'},
    {icon:'🎓',label:'Обучение',action:'navigate(\'learning\');closeLiveControl()'},
    {icon:'🇬🇧',label:'English',action:'navigate(\'english\');closeLiveControl()'},
    {icon:'💎',label:'Навыки',action:'navigate(\'skills\');closeLiveControl()'},
    {icon:'🧠',label:'Память',action:'navigate(\'memory\');closeLiveControl()'},
    {icon:'🎯',label:'IQ',action:'navigate(\'iq\');closeLiveControl()'},
    {icon:'❤️',label:'EQ',action:'navigate(\'eq\');closeLiveControl()'},
    {icon:'💰',label:'Финансы',action:'navigate(\'finance\');closeLiveControl()'},
    {icon:'🔬',label:'Нейро',action:'navigate(\'neuromodule\');closeLiveControl()'},
    {icon:'📱',label:'Детокс-курс',action:'navigate(\'detoxcourse\');closeLiveControl()'},
    {icon:'🎬',label:'Досуг',action:'navigate(\'entertainment\');closeLiveControl()'},
    {icon:'🌐',label:'Домены',action:'navigate(\'domains\');closeLiveControl()'},
    {icon:'📊',label:'Статистика',action:'navigate(\'stats\');closeLiveControl()'},
    {icon:'📈',label:'Детальная',action:'navigate(\'detailedStats\');closeLiveControl()'},
    {icon:'🗄',label:'Хранилище',action:'navigate(\'storage\');closeLiveControl()'},
    {icon:'🏆',label:'Достижения',action:'navigate(\'profile\');closeLiveControl()'},
    {icon:'🎨',label:'Темы',action:'openThemePicker();closeLiveControl()'},
    {icon:'⚙️',label:'Настройки',action:'navigate(\'settings\');closeLiveControl()'}
  ];
  var html='';
  items.forEach(function(it){
    html+='<div class="live-panel-item" onclick="'+it.action+'"><span class="live-panel-item-icon">'+it.icon+'</span><span class="live-panel-item-label">'+it.label+'</span></div>';
  });
  body.innerHTML=html;
  panel.classList.add('open');
}
function closeLiveControl(){
  var panel=document.getElementById('livePanel');
  if(panel)panel.classList.remove('open');
}
function openStatsQuick(){navigate('stats')}

/* ============ THEME PICKER ============ */
function openThemePicker(){
  var html='<div class="footnote text-tertiary" style="margin-bottom:8px;">🎨 Выбери тему ('+THEMES.length+')</div>';
  html+='<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px;max-height:50vh;overflow-y:auto;">';
  THEMES.forEach(function(t){
    var active=state.settings.theme===t.id;
    html+='<button onclick="setTheme(\''+t.id+'\')" style="padding:10px 6px;border-radius:12px;border:2px solid '+(active?'var(--brand)':'transparent')+';background:'+t.color+';color:#fff;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px;"><span style="font-size:22px;">'+t.emoji+'</span><span style="font-size:9px;font-weight:700;">'+t.name+'</span></button>';
  });
  html+='</div>';
  html+='<div class="card" style="margin:0;padding:14px;"><div class="row-between"><div><div class="list-title">🌈 Эффекты ×250%</div></div><button class="btn btn-ghost btn-xs" onclick="state.settings.effectsEnabled=!state.settings.effectsEnabled;save();startEffects();toast(\'Ок\',\'success\')">'+(state.settings.effectsEnabled?'Вкл':'Выкл')+'</button></div></div>';
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
  }catch(e){toast('Ошибка','error');applyTheme('dark')}
}

/* ============ DAILY SURVEY (legacy) ============ */
var DAILY_SURVEY_QUESTIONS=[
{id:'sleepHours',question:'Сколько часов ты спал прошлой ночью?',type:'number',default:7,min:0,max:14,step:0.5},
{id:'mood',question:'Настроение вчера?',type:'slider',default:7},
{id:'energy',question:'Сколько было энергии?',type:'slider',default:7},
{id:'stress',question:'Уровень стресса?',type:'slider',default:5},
{id:'screenMinutes',question:'Сколько минут экрана вчера?',type:'number',default:240,min:0,max:1440,step:15},
{id:'focus',question:'Концентрация вчера?',type:'slider',default:7},
{id:'water',question:'Стаканов воды?',type:'number',default:6,min:0,max:20,step:1},
{id:'workouts',question:'Тренировок было?',type:'number',default:0,min:0,max:5,step:1},
{id:'wins',question:'Главная победа вчера?',type:'text'},
{id:'lessons',question:'Что ты понял/узнал?',type:'text'}
];

function needsDailySurvey(){
  return state.settings.lastDailySurveyDay!==today();
}
function openDailySurvey(force){
  if(!force&&!needsDailySurvey())return;
  currentDailySurveyStep=0;
  currentDailySurveyAnswers={};
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
    html+='<div style="text-align:center;padding:8px 0;"><div id="dv" style="font-size:40px;font-weight:800;color:var(--brand);">'+val+'</div><div class="footnote text-secondary">из 10</div></div>';
    html+='<input type="range" min="1" max="10" value="'+val+'" style="width:100%;margin:14px 0;" oninput="document.getElementById(\'dv\').textContent=this.value;currentDailySurveyAnswers[\''+q.id+'\']=parseInt(this.value);"/>';
    html+='<button class="btn btn-primary btn-block mt-3" onclick="nextDailySurveyStep()">Далее →</button>';
  }else if(q.type==='number'){
    var v2=answers[q.id]!==undefined?answers[q.id]:q.default;
    html+='<div class="field"><input type="number" id="dn" value="'+v2+'" min="'+(q.min||0)+'" max="'+(q.max||24)+'" step="'+(q.step||1)+'" oninput="currentDailySurveyAnswers[\''+q.id+'\']=parseFloat(this.value);"/></div>';
    html+='<button class="btn btn-primary btn-block mt-3" onclick="nextDailySurveyStep()">Далее →</button>';
  }else if(q.type==='text'){
    html+='<div class="field"><textarea id="dt" style="min-height:100px;" oninput="currentDailySurveyAnswers[\''+q.id+'\']=this.value;">'+(answers[q.id]||'')+'</textarea></div>';
    html+='<button class="btn btn-primary btn-block mt-3" onclick="nextDailySurveyStep()">Далее →</button>';
  }
  if(step>0)html+='<button class="btn btn-ghost btn-block mt-2" onclick="prevDailySurveyStep()">← Назад</button>';
  if(step<DAILY_SURVEY_QUESTIONS.length-1)html+='<button class="btn btn-ghost btn-block mt-2" onclick="skipDailySurveyStep()">Пропустить</button>';
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
function nextDailySurveyStep(){
  saveDailySurveyAnswer();
  currentDailySurveyStep=(currentDailySurveyStep||0)+1;
  if(currentDailySurveyStep>=DAILY_SURVEY_QUESTIONS.length)finishDailySurvey();
  else renderDailySurvey();
}
function prevDailySurveyStep(){
  saveDailySurveyAnswer();
  currentDailySurveyStep=Math.max(0,(currentDailySurveyStep||0)-1);
  renderDailySurvey();
}
function skipDailySurveyStep(){
  currentDailySurveyStep=(currentDailySurveyStep||0)+1;
  if(currentDailySurveyStep>=DAILY_SURVEY_QUESTIONS.length)finishDailySurvey();
  else renderDailySurvey();
}
function saveDailySurveyAnswer(){
  var q=DAILY_SURVEY_QUESTIONS[currentDailySurveyStep];
  if(!q)return;
  if(q.type==='number'){var el=document.getElementById('dn');if(el)currentDailySurveyAnswers[q.id]=parseFloat(el.value);}
  else if(q.type==='text'){var el2=document.getElementById('dt');if(el2)currentDailySurveyAnswers[q.id]=el2.value;}
}
function finishDailySurvey(){
  var answers=currentDailySurveyAnswers||{};
  var y=yesterday();
  if(!state.dailySurveys)state.dailySurveys={};
  state.dailySurveys[y]={answers:answers,filledAt:nowISO()};
  if(answers.sleepHours!=null){
    if(!state.customSleep)state.customSleep={};
    state.customSleep[y]=parseFloat(answers.sleepHours);
  }
  if(answers.mood!=null){
    if(!state.customMood)state.customMood=[];
    var ex=state.customMood.find(function(m){return m.date===y});
    if(ex)ex.score=parseInt(answers.mood);
    else state.customMood.push({id:uid(),date:y,score:parseInt(answers.mood),created_at:nowISO()});
  }
  if(answers.screenMinutes!=null){
    if(!state.screenHistory)state.screenHistory={};
    state.screenHistory[y]=parseFloat(answers.screenMinutes);
  }
  state.todayPlan=buildTodayPlan(answers);
  state.settings.lastDailySurveyDay=today();
  save();
  haptic('success');
  toast('✓ План на сегодня готов','success',3500);
  navigate('dashboard');
}
function buildTodayPlan(answers){
  var plan={date:today(),basedOn:answers,items:[],load:100,notes:[]};
  var sleep=parseFloat(answers.sleepHours)||7;
  var mood=parseInt(answers.mood)||7;
  var energy=parseInt(answers.energy)||7;
  var stress=parseInt(answers.stress)||5;
  var screen=parseFloat(answers.screenMinutes)||240;
  var focus=parseInt(answers.focus)||7;
  var water=parseInt(answers.water)||6;
  var workouts=parseInt(answers.workouts)||0;
  if(sleep<6)plan.load-=20;
  if(sleep<7)plan.load-=10;
  if(mood<5)plan.load-=15;
  if(energy<5)plan.load-=15;
  if(stress>7)plan.load-=15;
  if(screen>360)plan.load-=10;
  if(focus<5)plan.load-=10;
  if(sleep>=7&&sleep<=9)plan.load+=5;
  if(mood>=7)plan.load+=5;
  if(energy>=7)plan.load+=5;
  plan.load=Math.max(30,Math.min(120,plan.load));
  if(screen>300)plan.items.push({time:'утро',title:'Утро без телефона 30 мин',desc:'Снижаем экран',icon:'🌅'});
  if(sleep<7)plan.items.push({time:'вечер',title:'Сон до 23:00',desc:'Приоритет сна',icon:'😴'});
  if(water<6)plan.items.push({time:'день',title:'8 стаканов воды',desc:'Гидратация',icon:'💧'});
  if(mood<6||stress>6){
    plan.items.push({time:'день',title:'Медитация 10 мин',desc:'Стресс',icon:'🧘'});
    plan.items.push({time:'день',title:'Дыхание 4-7-8',desc:'Успокоение',icon:'🌬'});
  }
  if(energy<6)plan.items.push({time:'день',title:'Прогулка 20 мин',desc:'Энергия',icon:'🚶'});
  if(focus<6||screen>300)plan.items.push({time:'утро',title:'Deep Work 90 мин',desc:'Одна задача',icon:'🎯'});
  if(workouts<2)plan.items.push({time:'день',title:'Тренировка 30 мин',desc:'Движение',icon:'🏋️'});
  plan.items.push({time:'вечер',title:'Дневник: 3 победы',desc:'Рефлексия',icon:'📓'});
  plan.notes.push('Нагрузка: '+plan.load+'%');
  if(sleep<6)plan.notes.push('⚠️ Недосып. Меньше задач.');
  if(screen>360)plan.notes.push('⚠️ Много экрана.');
  if(stress>7)plan.notes.push('⚠️ Стресс. Медитация обязательна.');
  return plan;
}
function renderDailySurveyCard(){
  if(!needsDailySurvey())return '';
  var html='<div class="card" style="background:linear-gradient(135deg,rgba(255,169,64,.2),rgba(255,107,107,.15));border-color:rgba(255,169,64,.4);">';
  html+='<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">';
  html+='<div style="font-size:36px;">📋</div>';
  html+='<div style="flex:1;"><div style="font-size:16px;font-weight:800;margin-bottom:2px;">Опрос о вчера</div>';
  html+='<div class="footnote text-secondary">10 вопросов → план на сегодня</div></div>';
  html+='</div>';
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
  if(plan.notes&&plan.notes.length){
    plan.notes.forEach(function(n){html+='<div class="footnote text-secondary" style="margin-bottom:6px;">'+esc(n)+'</div>'});
  }
  plan.items.forEach(function(item){
    html+='<div style="display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--divider);">';
    html+='<div style="font-size:20px;flex-shrink:0;">'+item.icon+'</div>';
    html+='<div style="flex:1;"><div style="font-weight:700;font-size:13px;">'+esc(item.title)+'</div>';
    html+='<div class="footnote text-secondary">'+esc(item.time)+' · '+esc(item.desc)+'</div></div>';
    html+='</div>';
  });
  html+='<button class="btn btn-ghost btn-block mt-3" onclick="openDailySurvey(true)">Обновить опрос</button>';
  html+='</div>';
  return html;
}

/* ============ SLEEP EDITOR ============ */
function openSleepEditor(){
  var y=yesterday();var t=today();
  var curY=(state.customSleep&&state.customSleep[y])||7;
  var curT=(state.customSleep&&state.customSleep[t])||7;
  var html='<div class="field"><label class="field-label">Сон вчера (часы)</label>';
  html+='<input type="number" id="sleepYesterday" value="'+curY+'" min="0" max="14" step="0.5"/></div>';
  html+='<div class="field"><label class="field-label">Сон сегодня (часы)</label>';
  html+='<input type="number" id="sleepToday" value="'+curT+'" min="0" max="14" step="0.5"/></div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="saveSleep()">💾 Сохранить</button>';
  openSheet('Сон',html);
}
function saveSleep(){
  var y=yesterday();var t=today();
  var vY=parseFloat((document.getElementById('sleepYesterday')||{}).value)||7;
  var vT=parseFloat((document.getElementById('sleepToday')||{}).value)||7;
  if(!state.customSleep)state.customSleep={};
  state.customSleep[y]=vY;
  state.customSleep[t]=vT;
  save();closeSheet();toast('Сон записан','success');haptic('success');
  if(currentPage==='dashboard')renderDashboard();else renderHealth();
}

/* ============ ADAPTIVE ============ */
function getYesterdayScreen(){return (state.screenHistory&&state.screenHistory[yesterday()])||0}
function getYesterdaySleep(){return (state.customSleep&&state.customSleep[yesterday()])||7}
function getAdaptiveLoad(){
  var sleep=getYesterdaySleep();
  var water=(state.customWater||[]).find(function(w){return w.date===yesterday()});
  water=water?water.count:0;
  var mood=(state.customMood||[]).find(function(m){return m.date===yesterday()});
  mood=mood?mood.score:7;
  var screen=getYesterdayScreen();
  var load=100;
  if(sleep<6)load-=20;
  if(sleep<7)load-=10;
  if(water<4)load-=10;
  if(mood<5)load-=15;
  if(screen>300)load-=10;
  if(screen>420)load-=10;
  return Math.max(30,Math.min(120,load));
}
function getSmartTips(){
  var tips=[];
  var sleep=getYesterdaySleep();
  var water=(state.customWater||[]).find(function(w){return w.date===today()});
  water=water?water.count:0;
  var mood=(state.customMood||[]).find(function(m){return m.date===today()});
  mood=mood?mood.score:7;
  var screen=getYesterdayScreen();
  if(sleep<6)tips.push('😴 Сон <6ч. Снизь нагрузку.');
  if(water<4)tips.push('💧 Мало воды. 2 стакана сейчас.');
  if(mood<5)tips.push('❤️ Настроение низкое. Прогулка + дыхание.');
  if(screen>300)tips.push('📱 Экран >5ч. Убери телефон утром.');
  if(!tips.length)tips.push('✨ Всё в балансе. Хороший день для Deep Work.');
  return tips;
}

/* ============ CHALLENGES ============ */
function renderChallenges(){
  var list=(typeof getTodayChallenges==='function')?getTodayChallenges():[];
  if(!list.length)return '';
  var html='<div class="card"><h2>🔥 Челленджи дня</h2>';
  list.forEach(function(ch){
    var done=state.challengeProgress&&state.challengeProgress[ch.id];
    html+='<div class="challenge-card '+(done?'done':'')+'" onclick="completeChallenge(\''+ch.id+'\')"><div class="challenge-badge">'+(done?'✓':'+'+ch.reward)+'</div><div class="challenge-title">'+esc(ch.title)+'</div><div class="challenge-desc">'+esc(ch.desc)+'</div></div>';
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

/* ============ WISDOM + MOTIVATION ============ */
function getWisdomSafe(){
  try{if(typeof getTodayWisdom==='function')return getTodayWisdom()}catch(e){}
  return{text:'Ты не ленивый. Ты либо устал, либо не видишь смысла, либо боишься.',author:'Неизвестный',apply:'Что из 3 — моё?'};
}
function renderWisdom(){
  var w=getWisdomSafe();
  return '<div class="insight-card"><div class="insight-title">💎 Мудрость дня</div><div class="insight-text">"'+esc(w.text)+'"</div><div class="insight-author">— '+esc(w.author)+'</div><div class="insight-apply">→ '+esc(w.apply)+'</div></div>';
}
function renderMotivation(){
  var quotes=[
    {q:'Дисциплина — это выбор между тем, что хочешь сейчас, и тем, что хочешь больше всего.',a:'Авраам Линкольн'},
    {q:'Мы — то, что делаем постоянно. Совершенство — не действие, а привычка.',a:'Аристотель'},
    {q:'Между стимулом и реакцией есть пространство. В нём — наша свобода.',a:'Виктор Франкл'}
  ];
  var idx=Math.floor(Date.now()/86400000)%quotes.length;
  var m=quotes[idx];
  return '<div class="motivation-card"><div class="motivation-quote">"'+esc(m.q)+'"</div><div class="motivation-author">— '+esc(m.a)+'</div></div>';
}

/* ============ PROGRESS RING ============ */
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

/* ============ DASHBOARD ============ */
function renderDashboard(){
  var todayTasks=state.tasks.filter(function(t){return t.created_at&&t.created_at.slice(0,10)===today()});
  var doneToday=todayTasks.filter(function(t){return t.status==='completed'}).length;
  var hour=new Date().getHours();
  var greet=hour<6?'Доброй ночи':hour<12?'Доброе утро':hour<18?'Добрый день':'Добрый вечер';
  var progress=todayTasks.length?Math.round(doneToday/todayTasks.length*100):0;
  var userName=state.profile.name?', '+state.profile.name:'';
  var totalDone=0,totalLessons=0;
  (LEARNING_LEVELS||[]).forEach(function(level){
    var p=getLevelProgress(level.id);
    totalDone+=p.done;totalLessons+=p.total;
  });
  var overallPct=totalLessons?Math.round(totalDone/totalLessons*100):0;
  var waterEntry=state.customWater.find(function(w){return w.date===today()});
  var water=waterEntry?waterEntry.count:0;
  var waterGoal=state.settings.waterGoal||8;

  var html='<div class="page"><div class="title-xl">'+greet+userName+'</div>';
  // Опросы: новые surveys.js с fallback на legacy
  html+=(typeof renderSurveyPrompt==='function')?renderSurveyPrompt():renderDailySurveyCard();
  html+=renderTodayPlanCard();
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
  html+=renderMotivation();
  html+=renderChallenges();

  html+='<div class="card"><h2>⚡ Быстро</h2><div class="group-grid">';
  html+='<div class="group-item" onclick="openEntityEditor(\'task\',null)"><div class="group-item-icon">➕</div><div class="group-item-label">Задача</div></div>';
  html+='<div class="group-item" onclick="addWater()"><div class="group-item-icon">💧</div><div class="group-item-label">'+water+'/'+waterGoal+'</div></div>';
  html+='<div class="group-item" onclick="quickMoodLog()"><div class="group-item-icon">💭</div><div class="group-item-label">Настроение</div></div>';
  html+='<div class="group-item" onclick="openSleepEditor()"><div class="group-item-icon">😴</div><div class="group-item-label">Сон</div></div>';
  html+='<div class="group-item" onclick="navigate(\'timer\')"><div class="group-item-icon">⏱</div><div class="group-item-label">Таймер</div></div>';
  html+='<div class="group-item" onclick="navigate(\'dailyplan\')"><div class="group-item-icon">📅</div><div class="group-item-label">План</div></div>';
  html+='</div></div>';

  html+='<div class="card"><h2>🧭 Режимы</h2>';
  (WORK_MODES||[]).forEach(function(m){
    var active=state.activeWorkMode===m.id;
    html+='<div class="mode-card '+(active?'active':'')+'" onclick="setWorkMode(\''+m.id+'\')" style="padding:12px;border:2px solid '+(active?'var(--brand)':'var(--glass-border)')+';border-radius:14px;margin-bottom:6px;cursor:pointer;"><div style="font-size:20px;">'+m.emoji+'</div><div style="font-size:13px;font-weight:800;">'+m.name+'</div><div class="footnote text-secondary">'+m.desc+'</div></div>';
  });
  html+='</div>';

  html+='<div class="card"><h2>📋 Задачи (Q1→Q4)</h2>';
  var pending=state.tasks.filter(function(t){return t.status==='pending'});
  if(pending.length){
    var sorted=pending.slice().sort(function(a,b){return getEisenhowerPriority(a)-getEisenhowerPriority(b)});
    sorted.slice(0,5).forEach(function(t){html+=taskRow(t)});
  }else{html+='<div class="empty"><div class="empty-icon">✨</div><div class="empty-title">Всё выполнено</div></div>'}
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
function setWorkMode(id){
  state.activeWorkMode=id;
  save();haptic('success');toast('Режим: '+id,'success');renderDashboard();
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

/* ============ TASKS ============ */
function renderTasks(){
  var counts={
    all:state.tasks.length,
    pending:state.tasks.filter(function(t){return t.status==='pending'}).length,
    completed:state.tasks.filter(function(t){return t.status==='completed'}).length
  };
  var filtered=state.tasks.slice();
  if(taskFilter!=='all')filtered=filtered.filter(function(t){return t.status===taskFilter});
  if(taskSearch){var q=taskSearch.toLowerCase();filtered=filtered.filter(function(t){return t.title.toLowerCase().indexOf(q)>=0})}
  var html='<div class="page">'+backBtn('dashboard')+'<div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">✅ Задачи</div><button class="btn btn-primary btn-sm" onclick="openEntityEditor(\'task\',null)">+ Новая</button></div>';
  html+=renderQuickTabs('tasks');
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

/* ============ ENTITY EDITOR ============ */
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
  '<div class="field"><label class="field-label">Заметки</label><textarea id="ent-notes">'+esc(t.notes||'')+'</textarea></div>'+
  '<button class="btn btn-primary btn-block mt-3" onclick="saveEntity(\'task\''+(t.id?',\''+t.id+'\'':'')+')">'+(t.id?'💾 Сохранить':'➕ Создать')+'</button>'+
  (t.id?'<button class="btn btn-danger btn-block mt-2" onclick="deleteEntity(\'task\',\''+t.id+'\')">🗑 Удалить</button>':'');
}
function habitEditorHTML(h){
  h=h||{};
  return '<div class="field"><label class="field-label">Название *</label><input type="text" id="ent-title" value="'+esc(h.title||'')+'"/></div>'+
  '<div class="field"><label class="field-label">Иконка</label><input type="text" id="ent-icon" value="'+esc(h.icon||'✅')+'" maxlength="4"/></div>'+
  '<div class="field"><label class="field-label">Категория</label><select id="ent-category"><option value="Здоровье"'+(h.category==='Здоровье'?' selected':'')+'>💪 Здоровье</option><option value="Психика"'+(h.category==='Психика'?' selected':'')+'>🧠 Психика</option><option value="Развитие"'+(h.category==='Развитие'?' selected':'')+'>📚 Развитие</option><option value="Продуктивность"'+(h.category==='Продуктивность'?' selected':'')+'>⚡ Продуктивность</option></select></div>'+
  '<button class="btn btn-primary btn-block mt-3" onclick="saveEntity(\'habit\''+(h.id?',\''+h.id+'\'':'')+')">'+(h.id?'💾 Сохранить':'➕ Создать')+'</button>'+
  (h.id?'<button class="btn btn-danger btn-block mt-2" onclick="deleteEntity(\'habit\',\''+h.id+'\')">🗑 Удалить</button>':'');
}
function goalEditorHTML(g){
  g=g||{};
  return '<div class="field"><label class="field-label">Название *</label><input type="text" id="ent-title" value="'+esc(g.title||'')+'"/></div>'+
  '<div class="field"><label class="field-label">Категория</label><select id="ent-category"><option value="Здоровье"'+(g.category==='Здоровье'?' selected':'')+'>💪 Здоровье</option><option value="Обучение"'+(g.category==='Обучение'?' selected':'')+'>📚 Обучение</option><option value="Финансы"'+(g.category==='Финансы'?' selected':'')+'>💰 Финансы</option><option value="Карьера"'+(g.category==='Карьера'?' selected':'')+'>💼 Карьера</option></select></div>'+
  '<div class="row" style="gap:8px;"><div style="flex:1;"><label class="field-label">Метрика</label><input type="text" id="ent-metric" value="'+esc(g.metric||'')+'"/></div><div style="flex:1;"><label class="field-label">Цель</label><input type="number" id="ent-target" value="'+(g.target||'')+'" step="0.1"/></div></div>'+
  '<div class="field"><label class="field-label">Текущее</label><input type="number" id="ent-current" value="'+(g.current||0)+'" step="0.1"/></div>'+
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
  if(document.getElementById('ent-notes'))entity.notes=(document.getElementById('ent-notes').value||'').trim();
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

/* ============ LEARNING ============ */
function getLevelProgress(levelId){
  var level=(LEARNING_LEVELS||[]).find(function(l){return l.id===levelId});
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
  var idx=(LEARNING_LEVELS||[]).findIndex(function(l){return l.id===levelId});
  if(idx<=0)return true;
  return getLevelProgress(LEARNING_LEVELS[idx-1].id).pct===100;
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
  (LEARNING_LEVELS||[]).forEach(function(level){
    var p=getLevelProgress(level.id);
    totalDone+=p.done;totalLessons+=p.total;
  });
  var overallPct=totalLessons?Math.round(totalDone/totalLessons*100):0;
  var skillsDone=Object.keys(state.skillsProgress||{}).length;
  var skillsTotal=(window.__SKILLS_LIBRARY?window.__SKILLS_LIBRARY.length:150);
  var engDone=Object.keys(state.englishProgress||{}).length;
  var engTotal=(window.__ENGLISH_125?window.__ENGLISH_125.length:250);
  var coursesTotal=(window.COURSES_LIBRARY||[]).length;
  var pathsTotal=(window.PATHS_LIBRARY||[]).length;
  var methodsTotal=(window.METHODS_LIBRARY||[]).length;
  var contentStats=(typeof countAllContent==='function')?countAllContent():{total:0,target:5555,percent:0};
  var html='<div class="page">'+backBtn('dashboard')+'<div class="title-xl">🎓 Обучение</div>';
  html+=renderQuickTabs('learning');
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:12px;">Прогресс</div><div style="font-size:40px;font-weight:800;line-height:1;margin-bottom:10px;">'+overallPct+'%</div><div class="progress" style="background:rgba(255,255,255,.25);height:6px;"><div class="progress-fill" style="width:'+overallPct+'%;background:#fff;"></div></div><div style="opacity:.9;font-size:11px;margin-top:8px;">Всего единиц контента: <strong>'+contentStats.total+'</strong> / '+contentStats.target+' ('+contentStats.percent+'%)</div></div>';
  html+='<div class="card"><h2>🔍 Поиск</h2>';
  html+='<div class="search-bar"><span style="color:var(--text-3);">🔍</span><input type="search" placeholder="Найти урок, курс, навык..." value="'+esc(learnSearchText)+'" oninput="learnSearchText=this.value;renderLearningSearch()"/></div>';
  html+='<div id="learnSearchResults"></div></div>';
  html+='<div class="compact-grid">';
  html+='<div class="compact-item" onclick="navigate(\'levels\')"><span class="compact-icon">🌱</span><span>5 уровней</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'english\')"><span class="compact-icon">🇬🇧</span><span>English '+engDone+'/'+engTotal+'</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'skills\')"><span class="compact-icon">💎</span><span>Навыки '+skillsDone+'/'+skillsTotal+'</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'courses\')"><span class="compact-icon">📖</span><span>Курсы '+coursesTotal+'</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'paths\')"><span class="compact-icon">🗺</span><span>Пути '+pathsTotal+'</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'methods\')"><span class="compact-icon">🎯</span><span>Методики '+methodsTotal+'</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'memory\')"><span class="compact-icon">🧠</span><span>Память</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'iq\')"><span class="compact-icon">🎯</span><span>IQ</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'eq\')"><span class="compact-icon">❤️</span><span>EQ</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'finance\')"><span class="compact-icon">💰</span><span>Финансы</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'neuromodule\')"><span class="compact-icon">🔬</span><span>Нейро</span></div>';
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
  renderLearningSearch();
}
function renderLearningSearch(){
  var el=document.getElementById('learnSearchResults');
  if(!el)return;
  var q=(learnSearchText||'').toLowerCase().trim();
  if(!q){el.innerHTML='';return}
  var results=[];
  (LEARNING_LEVELS||[]).forEach(function(l){
    l.modules.forEach(function(m){
      m.lessons.forEach(function(lesson,idx){
        if(lesson.title.toLowerCase().indexOf(q)>=0){
          results.push({icon:l.emoji,title:lesson.title,sub:l.title+' · '+m.title,onclick:'openLevelLessonFromSearch(\''+l.id+'\',\''+m.id+'\','+idx+')'});
        }
      });
    });
  });
  (COURSES_LIBRARY||[]).forEach(function(c){
    if(c.title.toLowerCase().indexOf(q)>=0){
      results.push({icon:c.emoji,title:c.title,sub:'Курс · '+c.category,onclick:'openCourse(\''+c.id+'\')'});
    }
    (c.lessons||[]).forEach(function(lesson,i){
      if(lesson.title.toLowerCase().indexOf(q)>=0){
        results.push({icon:c.emoji,title:lesson.title,sub:'Курс: '+c.title,onclick:'openCourseLesson(\''+c.id+'\','+i+')'});
      }
    });
  });
  (window.__SKILLS_LIBRARY||[]).forEach(function(s){
    if(s.title.toLowerCase().indexOf(q)>=0||(s.desc||'').toLowerCase().indexOf(q)>=0){
      results.push({icon:s.emoji,title:s.title,sub:'Навык · '+(s.desc||''),onclick:'openSkill(\''+s.id+'\')'});
    }
  });
  (window.__ENGLISH_125||[]).forEach(function(l){
    if(l.title.toLowerCase().indexOf(q)>=0){
      results.push({icon:'🇬🇧',title:l.title,sub:'English '+l.level,onclick:'openEnglishLess(\''+l.id+'\')'});
    }
  });
  (PATHS_LIBRARY||[]).forEach(function(p){
    if(p.title.toLowerCase().indexOf(q)>=0){
      results.push({icon:p.emoji,title:p.title,sub:'Путь · '+p.category,onclick:'openPath(\''+p.id+'\')'});
    }
  });
  (METHODS_LIBRARY||[]).forEach(function(m){
    if(m.title.toLowerCase().indexOf(q)>=0||(m.desc||'').toLowerCase().indexOf(q)>=0){
      results.push({icon:m.emoji,title:m.title,sub:'Методика · '+m.category,onclick:'openMethod(\''+m.id+'\')'});
    }
  });
  if(!results.length){el.innerHTML='<div class="footnote text-tertiary">Ничего не найдено</div>';return}
  var html='';
  results.slice(0,20).forEach(function(r){
    html+='<div class="list-row" onclick="'+r.onclick+'"><div class="list-icon">'+r.icon+'</div><div class="list-body"><div class="list-title">'+esc(r.title)+'</div><div class="list-subtitle">'+esc(r.sub)+'</div></div><div class="list-chevron">›</div></div>';
  });
  el.innerHTML=html;
}
function openLevelLessonFromSearch(levelId,moduleId,idx){
  currentLevelId=levelId;currentModuleId=moduleId;
  navigate('moduleDetail');
  setTimeout(function(){openLesson(idx)},100);
}
function renderLevels(){
  var html='<div class="page">'+backBtn('learning')+'<div class="title-xl">🌱 Уровни</div>';
  (LEARNING_LEVELS||[]).forEach(function(level){
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
  var level=(LEARNING_LEVELS||[]).find(function(l){return l.id===currentLevelId});
  if(!level){navigate('learning');return}
  var p=getLevelProgress(level.id);
  var html='<div class="page">'+backBtn('levels');
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
  var level=(LEARNING_LEVELS||[]).find(function(l){return l.id===currentLevelId});
  if(!level){navigate('learning');return}
  var module=level.modules.find(function(m){return m.id===currentModuleId});
  if(!module){navigate('levelDetail');return}
  var doneCount=module.lessons.filter(function(l,idx){return state.levelProgress[level.id+'_'+module.id+'_'+idx]}).length;
  var html='<div class="page">'+backBtn('levelDetail');
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
  var level=(LEARNING_LEVELS||[]).find(function(l){return l.id===currentLevelId});if(!level)return;
  var module=level.modules.find(function(m){return m.id===currentModuleId});if(!module)return;
  var lesson=module.lessons[idx];if(!lesson)return;
  var key=level.id+'_'+module.id+'_'+idx;
  var isDone=!!state.levelProgress[key];
  var html='<div class="page">'+backBtn('moduleDetail');
  html+='<div style="margin-bottom:16px;"><div class="footnote text-tertiary" style="margin-bottom:6px;">Уровень '+level.num+' · '+module.title+' · '+(idx+1)+'/'+module.lessons.length+'</div><div style="font-size:22px;font-weight:800;line-height:1.2;">'+lesson.title+'</div></div>';
  html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚 Теория</div><div class="lesson-content">'+formatLesson(lesson.theory||'')+'</div></div>';
  html+='<div class="lesson-section practice"><div class="lesson-section-title">🎯 Практика</div><div class="lesson-content">'+esc(lesson.practice||'')+'</div></div>';
  if(lesson.reflection)html+='<div class="lesson-section reflection"><div class="lesson-section-title">💭 Рефлексия</div><div class="lesson-content">'+esc(lesson.reflection)+'</div></div>';
  html+='</div>';
  if(!isDone)html+='<button class="btn btn-primary btn-block" onclick="completeLesson()">✓ Изучено (+XP ×2.5)</button>';
  else{
    html+='<div class="badge badge-success" style="display:block;text-align:center;padding:12px;font-size:13px;">✓ Урок изучен</div>';
    if(idx<module.lessons.length-1)html+='<button class="btn btn-primary btn-block mt-2" onclick="openLesson('+(idx+1)+')">Следующий →</button>';
    else html+='<button class="btn btn-success btn-block mt-2" onclick="navigate(\'moduleDetail\')">Модуль завершён ✓</button>';
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
  var level=(LEARNING_LEVELS||[]).find(function(l){return l.id===currentLevelId});if(!level)return;
  var module=level.modules.find(function(m){return m.id===currentModuleId});if(!module)return;
  var key=level.id+'_'+module.id+'_'+currentLessonIdx;
  if(!state.levelProgress)state.levelProgress={};
  state.levelProgress[key]=true;
  // Эффекты ×250%
  var baseXP=10;
  var xpAdd=(typeof applyLearningBonus==='function')?applyLearningBonus(baseXP):baseXP*2.5;
  state.xp=(state.xp||0)+xpAdd;
  save();haptic('success');toast('✓ Изучено! +'+xpAdd+' XP','success');
  checkAchievements();openLesson(currentLessonIdx);
}

/* ============ SKILLS ============ */
function renderSkills(){
  var cats=window.__SKILLS_CATEGORIES||[];
  var lib=window.__SKILLS_LIBRARY||[];
  var filtered=skillsFilter==='all'?lib:lib.filter(function(s){return s.cat===skillsFilter});
  var done=Object.keys(state.skillsProgress||{}).length;
  var html='<div class="page">'+backBtn('learning')+'<div class="title-xl">💎 Навыки</div>';
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
  var s=(window.__SKILLS_LIBRARY||[]).find(function(x){return x.id===id});
  if(!s)return;
  var isDone=state.skillsProgress&&state.skillsProgress[s.id];
  var cat=(window.__SKILLS_CATEGORIES||[]).find(function(c){return c.id===s.cat})||{};
  var html='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:48px;">'+s.emoji+'</div><div style="font-size:20px;font-weight:800;">'+s.title+'</div><div class="footnote text-secondary">'+(cat.emoji||'')+' '+(cat.name||'')+' · '+s.level+' · '+s.duration+'</div></div>';
  html+='<div class="card"><div class="footnote text-secondary">'+esc(s.desc)+'</div></div>';
  html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚 Теория</div><div class="lesson-content">'+formatLesson(s.theory||'')+'</div></div></div>';
  if(s.practice&&s.practice.length){
    html+='<div class="card"><div class="lesson-section practice"><div class="lesson-section-title">🎯 Практика</div><div class="lesson-content"><ul>'+s.practice.map(function(p){return '<li>'+esc(p)+'</li>'}).join('')+'</ul></div></div></div>';
  }
  if(s.effect)html+='<div class="insight-card"><div class="insight-title">💎 Эффект</div><div class="insight-text">'+esc(s.effect)+'</div></div>';
  if(s.tips)html+='<div class="insight-card"><div class="insight-title">💡 Совет</div><div class="insight-text">'+esc(s.tips)+'</div></div>';
  if(!isDone)html+='<button class="btn btn-primary btn-block mt-3" onclick="completeSkill(\''+s.id+'\')">✓ Изучено (+XP ×2.5)</button>';
  else html+='<div class="badge badge-success" style="display:block;text-align:center;padding:12px;">✓ Изучено</div>';
  openSheet(s.title,html);
}
function completeSkill(id){
  if(!state.skillsProgress)state.skillsProgress={};
  state.skillsProgress[id]=true;
  var xpAdd=(typeof applyLearningBonus==='function')?applyLearningBonus(20):50;
  state.xp=(state.xp||0)+xpAdd;
  save();haptic('success');toast('✓ Навык изучен! +'+xpAdd+' XP','success');
  checkAchievements();closeSheet();renderSkills();
}

/* ============ MODULES (Memory, IQ, EQ, Finance, Neuro) ============ */
function renderMemory(){renderModuleList('memory')}
function renderIQ(){renderModuleList('iq')}
function renderEQ(){renderModuleList('eq')}
function renderFinance(){renderModuleList('finance')}
function renderNeuro(){renderModuleList('neuro')}
function renderModuleList(moduleKey){
  var map={memory:window.__MEMORY_MODULE||[],iq:window.__IQ_MODULE||[],eq:window.__EQ_MODULE||[],finance:window.__FINANCE_MODULE||[],neuro:window.__NEURO_MODULE||[]};
  var list=map[moduleKey]||[];
  var titles={memory:'🧠 Память',iq:'🎯 IQ',eq:'❤️ EQ',finance:'💰 Финансы',neuro:'🔬 Нейро'};
  var html='<div class="page">'+backBtn('learning')+'<div class="title-xl">'+titles[moduleKey]+'</div>';
  if(!list.length){html+='<div class="card"><div class="empty"><div class="empty-icon">📭</div><div class="empty-title">Модуль пуст</div></div></div>';document.getElementById('app').innerHTML=html;return}
  html+='<div class="card"><div class="footnote text-secondary">'+list.length+' уроков</div></div>';
  list.forEach(function(lesson,i){
    var done=state.memoryTraining&&state.memoryTraining.indexOf(lesson.id)>=0;
    var cls='lesson-row'+(done?' done':'');
    html+='<div class="'+cls+'" onclick="openModuleLesson(\''+moduleKey+'\','+i+')"><div class="lesson-num">'+(done?'✓':(i+1))+'</div><div class="lesson-title">'+lesson.title+'</div><div style="color:var(--text-4);font-size:20px;">›</div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openModuleLesson(moduleKey,idx){
  var map={memory:window.__MEMORY_MODULE||[],iq:window.__IQ_MODULE||[],eq:window.__EQ_MODULE||[],finance:window.__FINANCE_MODULE||[],neuro:window.__NEURO_MODULE||[]};
  var list=map[moduleKey]||[];
  var lesson=list[idx];if(!lesson)return;
  var done=state.memoryTraining&&state.memoryTraining.indexOf(lesson.id)>=0;
  var html='<div style="margin-bottom:12px;"><div class="footnote text-tertiary">Урок '+(idx+1)+'/'+list.length+'</div><div style="font-size:20px;font-weight:800;">'+lesson.title+'</div></div>';
  html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚 Теория</div><div class="lesson-content">'+formatLesson(lesson.theory||'')+'</div></div></div>';
  html+='<div class="card"><div class="lesson-section practice"><div class="lesson-section-title">🎯 Практика</div><div class="lesson-content">'+esc(lesson.practice||'')+'</div></div></div>';
  if(lesson.memory)html+='<div class="card"><div class="lesson-section memory"><div class="lesson-section-title">🧠 Память</div><div class="lesson-content">'+esc(lesson.memory)+'</div></div></div>';
  if(lesson.keywords)html+='<div class="card"><div class="footnote text-tertiary">🏷 '+esc(lesson.keywords)+'</div></div>';
  if(!done)html+='<button class="btn btn-primary btn-block mt-3" onclick="completeModuleLesson(\''+moduleKey+'\','+idx+')">✓ Изучено (+XP ×2.5)</button>';
  else html+='<div class="badge badge-success" style="display:block;text-align:center;padding:12px;">✓ Изучено</div>';
  openSheet(lesson.title,html);
}
function completeModuleLesson(moduleKey,idx){
  var map={memory:window.__MEMORY_MODULE||[],iq:window.__IQ_MODULE||[],eq:window.__EQ_MODULE||[],finance:window.__FINANCE_MODULE||[],neuro:window.__NEURO_MODULE||[]};
  var list=map[moduleKey]||[];
  var lesson=list[idx];if(!lesson)return;
  if(!state.memoryTraining)state.memoryTraining=[];
  if(state.memoryTraining.indexOf(lesson.id)<0)state.memoryTraining.push(lesson.id);
  var xpAdd=(typeof applyLearningBonus==='function')?applyLearningBonus(15):37;
  state.xp=(state.xp||0)+xpAdd;
  save();haptic('success');toast('✓ Изучено! +'+xpAdd+' XP','success');
  checkAchievements();closeSheet();renderModuleList(moduleKey);
}

/* ============ ENGLISH ============ */
function renderEnglish(){
  var all=window.__ENGLISH_125||[];
  var totalDone=0;
  all.forEach(function(l){if(state.englishProgress&&state.englishProgress[l.id])totalDone++});
  var pct=all.length?Math.round(totalDone/all.length*100):0;
  var html='<div class="page">'+backBtn('learning')+'<div class="title-xl">🇬🇧 English</div>';
  html+=renderQuickTabs('english');
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:12px;">Прогресс</div><div style="font-size:40px;font-weight:800;">'+pct+'%</div><div style="opacity:.9;font-size:12px;margin-top:6px;">'+totalDone+'/'+all.length+'</div></div>';
  ['A1','A2','B1','B2','C1'].forEach(function(lvl){
    if(currentEnglishFilter!=='all'&&currentEnglishFilter!==lvl)return;
    var lessons=all.filter(function(l){return l.level===lvl});
    var done=lessons.filter(function(l){return state.englishProgress&&state.englishProgress[l.id]}).length;
    var lpct=lessons.length?Math.round(done/lessons.length*100):0;
    var cls='level-card';if(lpct===100)cls+=' completed';else if(lpct>0)cls+=' active';
    html+='<div class="'+cls+'" onclick="openEnglishLvl(\''+lvl+'\')"><div class="level-header"><div class="level-num">'+lvl+'</div><div class="level-info"><div class="level-title">'+lvl+' — '+lessons.length+' уроков</div><div class="level-subtitle">'+done+'/'+lessons.length+'</div></div></div><div class="progress"><div class="progress-fill" style="width:'+lpct+'%;"></div></div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openEnglishLvl(lvl){
  var all=window.__ENGLISH_125||[];
  var lessons=all.filter(function(l){return l.level===lvl});
  var html='<div class="page">'+backBtn('english')+'<div class="title-xl">'+lvl+'</div>';
  html+='<div class="card">';
  lessons.forEach(function(lesson,i){
    var isDone=state.englishProgress&&state.englishProgress[lesson.id];
    html+='<div class="lesson-row '+(isDone?'done':'')+'" onclick="openEnglishLess(\''+lesson.id+'\')"><div class="lesson-num">'+(isDone?'✓':(i+1))+'</div><div class="lesson-title">'+lesson.title+'</div><div style="color:var(--text-4);font-size:20px;">›</div></div>';
  });
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
function openEnglishLess(lessonId){
  var all=window.__ENGLISH_125||[];
  var lesson=all.find(function(l){return l.id===lessonId});
  if(!lesson)return;
  var isDone=state.englishProgress&&state.englishProgress[lesson.id];
  var html='<div style="margin-bottom:12px;"><div class="footnote text-tertiary">'+lesson.level+' · '+lesson.id+'</div><div style="font-size:20px;font-weight:800;">'+lesson.title+'</div></div>';
  html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚 Теория</div><div class="lesson-content">'+formatLesson(lesson.theory||'')+'</div></div></div>';
  html+='<div class="card"><div class="lesson-section practice"><div class="lesson-section-title">🎯 Практика</div><div class="lesson-content">'+esc(lesson.practice||'')+'</div></div></div>';
  if(lesson.memory)html+='<div class="card"><div class="lesson-section memory"><div class="lesson-section-title">🧠 Память</div><div class="lesson-content">'+esc(lesson.memory)+'</div></div></div>';
  if(lesson.keywords)html+='<div class="card"><div class="footnote text-tertiary">🏷 '+esc(lesson.keywords)+'</div></div>';
  if(!isDone)html+='<button class="btn btn-primary btn-block mt-3" onclick="completeEnglishLess(\''+lesson.id+'\')">✓ Изучено (+XP ×2.5)</button>';
  else html+='<div class="badge badge-success" style="display:block;text-align:center;padding:12px;">✓ Изучено</div>';
  openSheet(lesson.title,html);
}
function completeEnglishLess(id){
  if(!state.englishProgress)state.englishProgress={};
  state.englishProgress[id]=true;
  var xpAdd=(typeof applyLearningBonus==='function')?applyLearningBonus(15):37;
  state.xp=(state.xp||0)+xpAdd;
  save();haptic('success');toast('✓ Изучено! +'+xpAdd+' XP','success');
  checkAchievements();closeSheet();renderEnglish();
}

/* ============ PATHS ============ */
function renderPaths(){
  var html='<div class="page">'+backBtn('learning')+'<div class="title-xl">🗺 Пути</div>';
  (PATHS_LIBRARY||[]).forEach(function(p){
    var userPath=state.paths.find(function(x){return x.id===p.id});
    var completed=userPath?(userPath.completedSteps||[]).length:0;
    var progress=Math.round(completed/p.steps.length*100);
    html+='<div class="card" style="cursor:pointer;" onclick="openPath(\''+p.id+'\')"><div style="display:flex;gap:12px;align-items:center;margin-bottom:8px;"><div style="width:48px;height:48px;border-radius:14px;background:var(--glass-2);display:grid;place-items:center;font-size:24px;flex-shrink:0;">'+p.emoji+'</div><div style="flex:1;"><div style="font-size:15px;font-weight:800;margin-bottom:2px;">'+p.title+'</div><div class="footnote text-secondary">'+completed+'/'+p.steps.length+' · '+p.category+'</div></div><div class="list-chevron">›</div></div><div class="progress"><div class="progress-fill" style="width:'+progress+'%;"></div></div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openPath(id){currentPathId=id;navigate('pathDetail')}
function renderPathDetail(){
  var p=(PATHS_LIBRARY||[]).find(function(x){return x.id===currentPathId});
  if(!p){navigate('paths');return}
  var userPath=state.paths.find(function(x){return x.id===p.id});
  if(!userPath){userPath={id:p.id,completedSteps:[],startedAt:nowISO()};state.paths.push(userPath);save()}
  var completed=userPath.completedSteps||[];
  var progress=Math.round(completed.length/p.steps.length*100);
  var html='<div class="page">'+backBtn('paths');
  html+='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:56px;">'+p.emoji+'</div><div class="title-xl">'+p.title+'</div></div>';
  html+='<div class="card"><div class="progress"><div class="progress-fill" style="width:'+progress+'%;"></div></div></div>';
  html+='<div class="card"><h2>Шаги</h2>';
  p.steps.forEach(function(step,i){
    var isDone=completed.indexOf(i)>=0;
    var isActive=!isDone&&(i===0||completed.indexOf(i-1)>=0);
    var isLocked=!isDone&&!isActive;
    var cls='path-step';if(isDone)cls+=' completed';else if(isActive)cls+=' active';else if(isLocked)cls+=' locked';
    html+='<div class="'+cls+'" onclick="'+(isLocked?'':'openStep('+i+')')+'"><div class="path-step-num">'+(isDone?'✓':(i+1))+'</div><div class="path-step-body"><div class="path-step-title">'+step.title+'</div><div class="path-step-desc">'+(isDone||isActive?step.desc:'🔒')+'</div></div></div>';
  });
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
function openStep(idx){
  var p=(PATHS_LIBRARY||[]).find(function(x){return x.id===currentPathId});if(!p)return;
  var step=p.steps[idx];if(!step)return;
  var userPath=state.paths.find(function(x){return x.id===p.id});
  var isDone=userPath&&(userPath.completedSteps||[]).indexOf(idx)>=0;
  var html='<div class="card"><h2>📋 Задача</h2><div style="font-size:14px;line-height:1.6;">'+step.desc+'</div></div>';
  html+='<div class="insight-card"><div class="insight-title">💎 Секрет</div><div class="insight-text">'+step.secret+'</div></div>';
  if(!isDone)html+='<button class="btn btn-primary btn-block mt-3" onclick="completeStep('+idx+')">✓ Отметить (+XP ×2.5)</button>';
  else html+='<div class="badge badge-success" style="display:block;text-align:center;padding:12px;">✓ Выполнено</div>';
  openSheet(step.title,html);
}
function completeStep(idx){
  var userPath=state.paths.find(function(x){return x.id===currentPathId});if(!userPath)return;
  if(!userPath.completedSteps)userPath.completedSteps=[];
  if(userPath.completedSteps.indexOf(idx)<0){
    userPath.completedSteps.push(idx);
    var xpAdd=(typeof applyLearningBonus==='function')?applyLearningBonus(25):62;
    state.xp=(state.xp||0)+xpAdd;
    save();
    toast('✓ Шаг выполнен! +'+xpAdd+' XP','success');haptic('success');
    checkAchievements();closeSheet();renderPathDetail();
  }
}

/* ============ COURSES ============ */
function renderCourses(){
  var html='<div class="page">'+backBtn('learning')+'<div class="title-xl">📚 Курсы</div>';
  (COURSES_LIBRARY||[]).forEach(function(c){
    var userCourse=state.courses.find(function(x){return x.id===c.id});
    var completed=userCourse?(userCourse.completedLessons||[]).length:0;
    var progress=Math.round(completed/c.lessons.length*100);
    html+='<div class="course-card" onclick="openCourse(\''+c.id+'\')"><div class="course-header"><div class="course-emoji">'+c.emoji+'</div><div style="flex:1;"><div class="course-title">'+c.title+'</div><div class="course-meta">'+completed+'/'+c.lessons.length+' · '+progress+'%</div></div></div><div class="progress"><div class="progress-fill" style="width:'+progress+'%;"></div></div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openCourse(id){
  var c=(COURSES_LIBRARY||[]).find(function(x){return x.id===id});if(!c)return;
  var userCourse=state.courses.find(function(x){return x.id===id});
  if(!userCourse){userCourse={id:id,completedLessons:[],startedAt:nowISO()};state.courses.push(userCourse);save()}
  var completed=userCourse.completedLessons||[];
  var progress=Math.round(completed.length/c.lessons.length*100);
  var html='<div class="page">'+backBtn('courses');
  html+='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:56px;">'+c.emoji+'</div><div class="title-xl">'+c.title+'</div><div class="footnote text-secondary">'+c.category+' · '+(c.hours||6)+' ч</div></div>';
  html+='<div class="card"><div class="progress"><div class="progress-fill" style="width:'+progress+'%;"></div></div></div>';
  html+='<div class="card"><h2>📚 Уроки</h2>';
  c.lessons.forEach(function(lesson,i){
    var isDone=completed.indexOf(i)>=0;
    html+='<div class="lesson-row '+(isDone?'done':'')+'" onclick="openCourseLesson(\''+c.id+'\','+i+')"><div class="lesson-num">'+(isDone?'✓':(i+1))+'</div><div class="lesson-title">'+lesson.title+'</div><div style="color:var(--text-4);font-size:20px;">›</div></div>';
  });
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
function openCourseLesson(courseId,idx){
  var c=(COURSES_LIBRARY||[]).find(function(x){return x.id===courseId});if(!c)return;
  var lesson=c.lessons[idx];if(!lesson)return;
  var userCourse=state.courses.find(function(x){return x.id===courseId});
  var isDone=userCourse&&(userCourse.completedLessons||[]).indexOf(idx)>=0;
  var html='<div style="margin-bottom:12px;"><div class="footnote text-tertiary">Урок '+(idx+1)+'/'+c.lessons.length+'</div><div style="font-size:20px;font-weight:800;">'+lesson.title+'</div></div>';
  if(lesson.theory)html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚 Теория</div><div class="lesson-content">'+formatLesson(lesson.theory)+'</div></div></div>';
  if(lesson.content)html+='<div class="card"><div style="font-size:14px;line-height:1.6;">'+esc(lesson.content)+'</div></div>';
  if(lesson.practice)html+='<div class="card"><div class="lesson-section practice"><div class="lesson-section-title">🎯 Практика</div><div class="lesson-content">'+esc(lesson.practice)+'</div></div></div>';
  if(lesson.quiz&&lesson.quiz.length){
    html+='<div class="card"><div class="lesson-section reflection"><div class="lesson-section-title">❓ Проверь</div><div class="lesson-content"><ul>'+lesson.quiz.map(function(q){return '<li>'+esc(q)+'</li>'}).join('')+'</ul></div></div></div>';
  }
  if(lesson.video){
    html+='<div class="card"><div class="lesson-section video"><div class="lesson-section-title">🎬 Видео</div><div class="video-wrap"><iframe src="https://www.youtube.com/embed/'+lesson.video+'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></div></div>';
  }
  if(!isDone)html+='<button class="btn btn-primary btn-block mt-3" onclick="completeCourseLesson(\''+courseId+'\','+idx+')">✓ Изучено (+XP ×2.5)</button>';
  else html+='<div class="badge badge-success" style="display:block;text-align:center;padding:12px;">✓ Изучено</div>';
  openSheet(lesson.title,html);
}
function completeCourseLesson(courseId,idx){
  var userCourse=state.courses.find(function(x){return x.id===courseId});if(!userCourse)return;
  if(!userCourse.completedLessons)userCourse.completedLessons=[];
  if(userCourse.completedLessons.indexOf(idx)<0){
    userCourse.completedLessons.push(idx);
    var xpAdd=(typeof applyLearningBonus==='function')?applyLearningBonus(20):50;
    state.xp=(state.xp||0)+xpAdd;
    save();
    toast('✓ Урок изучен! +'+xpAdd+' XP','success');haptic('success');
    checkAchievements();closeSheet();openCourse(courseId);
  }
}

/* ============ METHODS ============ */
function renderMethods(){
  var html='<div class="page">'+backBtn('learning')+'<div class="title-xl">🎯 Методики</div>';
  (METHODS_LIBRARY||[]).forEach(function(m){
    html+='<div class="method-card" onclick="openMethod(\''+m.id+'\')"><div class="method-header"><div class="method-emoji">'+m.emoji+'</div><div style="flex:1;"><div class="method-title">'+m.title+'</div><div class="method-cat">'+m.category+'</div></div><div class="list-chevron">›</div></div><div class="method-desc">'+m.desc+'</div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openMethod(id){
  var m=(METHODS_LIBRARY||[]).find(function(x){return x.id===id});if(!m)return;
  var html='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:48px;">'+m.emoji+'</div><div style="font-size:20px;font-weight:800;">'+m.title+'</div><div class="footnote text-secondary">'+m.category+'</div></div>';
  html+='<div class="card"><div class="footnote text-secondary">'+m.desc+'</div></div>';
  html+='<div class="card"><h2>📋 Шаги</h2>';
  m.steps.forEach(function(step,i){
    html+='<div style="display:flex;gap:10px;padding:6px 0;"><div style="width:22px;height:22px;border-radius:50%;background:var(--brand);color:#fff;display:grid;place-items:center;flex-shrink:0;font-size:11px;font-weight:700;">'+(i+1)+'</div><div style="flex:1;font-size:13px;line-height:1.4;">'+step+'</div></div>';
  });
  html+='</div>';
  if(m.base)html+='<div class="insight-card"><div class="insight-title">🔬 База</div><div class="insight-text">'+m.base+'</div></div>';
  openSheet(m.title,html);
}

/* ============ DOMAINS ============ */
function getAverageDomainScore(id){
  var history=state.domainHistory||{};
  var dates=Object.keys(history).slice(-7);
  if(!dates.length)return 5;
  var sum=0,count=0;
  dates.forEach(function(d){if(history[d]&&history[d][id]!==undefined){sum+=history[d][id];count++}});
  return count>0?Math.round(sum/count*10)/10:5;
}
function renderDomains(){
  var html='<div class="page">'+backBtn('dashboard')+'<div class="title-xl">🌐 Домены</div>';
  var todayScores=(state.domainScores||{})[today()]||{};
  var total=0,count=0;
  DOMAINS.forEach(function(d){if(todayScores[d.id]){total+=todayScores[d.id];count++}});
  var avg=count>0?Math.round(total/count*10)/10:0;
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:12px;">Средний</div><div style="font-size:40px;font-weight:800;">'+avg+'/10</div><div style="opacity:.9;font-size:12px;">'+count+' из '+DOMAINS.length+'</div></div>';
  DOMAINS.forEach(function(d){
    var score=todayScores[d.id]||0;
    var avgScore=getAverageDomainScore(d.id);
    var pct=Math.round(score*10);
    html+='<div class="domain-card" onclick="openDomain(\''+d.id+'\')"><div class="domain-header"><div class="domain-icon" style="background:'+d.color+'20;color:'+d.color+';">'+d.emoji+'</div><div style="flex:1;"><div class="domain-title">'+d.name+'</div><div class="domain-score">'+(score>0?score+'/10 ('+pct+'%)':'—')+' · Среднее: '+avgScore+'</div></div><div class="list-chevron">›</div></div><div class="domain-bar"><div class="domain-bar-fill" style="width:'+pct+'%;background:'+d.color+';"></div></div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openDomain(id){
  var d=DOMAINS.find(function(x){return x.id===id});if(!d)return;
  var todayScores=(state.domainScores||{})[today()]||{};
  var score=todayScores[id]||5;
  var html='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:48px;">'+d.emoji+'</div><div style="font-size:20px;font-weight:800;">'+d.name+'</div><div class="footnote text-secondary">'+d.desc+'</div></div>';
  html+='<div class="card"><h2>Оцени</h2><div style="text-align:center;padding:12px 0;"><div style="font-size:40px;font-weight:800;color:'+d.color+';" id="domainScoreDisplay">'+score+'</div><div class="footnote text-secondary">из 10</div></div><input type="range" min="1" max="10" value="'+score+'" style="width:100%;margin:10px 0;" oninput="document.getElementById(\'domainScoreDisplay\').textContent=this.value;" id="domainScoreRange"/><button class="btn btn-primary btn-block" onclick="saveDomainScore(\''+id+'\')">Сохранить</button></div>';
  if(d.learning)html+='<div class="card"><h2>📚 Обучение</h2><div class="footnote text-secondary">'+esc(d.learning)+'</div></div>';
  openSheet(d.name,html);
}
function saveDomainScore(id){
  var range=document.getElementById('domainScoreRange');if(!range)return;
  var score=parseInt(range.value);
  var t=today();
  if(!state.domainScores)state.domainScores={};
  if(!state.domainScores[t])state.domainScores[t]={};
  state.domainScores[t][id]=score;
  if(!state.domainHistory)state.domainHistory={};
  if(!state.domainHistory[t])state.domainHistory[t]={};
  state.domainHistory[t][id]=score;
  save();toast('✓ Сохранено','success');haptic('success');
  closeSheet();renderDomains();
}

/* ============ PROFILE ============ */
function renderProfile(){
  var p=state.profile;
  var unlocked=p.achievements||[];
  var doneTasks=state.tasks.filter(function(t){return t.status==='completed'}).length;
  var lessonsDone=Object.keys(state.levelProgress||{}).length;
  var lvl=Math.floor((state.xp||0)/100);
  var html='<div class="page">'+backBtn('dashboard');
  html+='<div class="profile-hero"><div class="avatar-btn lvl-'+Math.min(lvl,5)+'" onclick="pickEmoji()" style="width:96px;height:96px;margin:0 auto 12px;font-size:48px;">'+p.emoji+'</div><div style="font-size:22px;font-weight:800;">'+esc(p.name||'Пользователь')+'</div></div>';
  html+='<div class="level-hero"><div class="level-badge">🏅 Уровень '+lvl+'</div><div class="xp-bar"><div class="xp-bar-fill" style="width:'+((state.xp||0)%100)+'%;"></div></div><div class="xp-text">'+((state.xp||0)%100)+'/100 XP · Всего: '+(state.xp||0)+' XP</div></div>';
  html+='<div class="stat-grid mb-4"><div class="stat-item"><div class="stat-value">'+doneTasks+'</div><div class="stat-label">Задач</div></div><div class="stat-item"><div class="stat-value">'+lessonsDone+'</div><div class="stat-label">Уроков</div></div><div class="stat-item"><div class="stat-value">'+(state.stats.streak||0)+'</div><div class="stat-label">Streak</div></div></div>';
  html+='<div class="card"><h2>✏️ Имя</h2><input type="text" id="profile-name" value="'+esc(p.name)+'" onchange="saveProfileName(this.value)"/></div>';
  if(!p.surveyDone){html+='<div class="card" style="background:linear-gradient(135deg,rgba(255,169,64,.15),rgba(255,107,107,.1));"><h2>📋 Опросник</h2><button class="btn btn-primary btn-block" onclick="startSurvey()">Начать</button></div>'}
  html+='<div class="card"><h2>🏆 Достижения ('+unlocked.length+'/'+ACHIEVEMENTS.length+')</h2><div class="achieve-grid">';
  ACHIEVEMENTS.forEach(function(a){
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
function setEmoji(e){
  state.profile.emoji=e;save();closeSheet();toast('Обновлено','success');renderProfile();updateHeaderAvatar();
}
function saveProfileName(name){
  state.profile.name=(name||'').trim()||'Пользователь';
  save();toast('Сохранено','success');updateHeaderAvatar();
}
function updateHeaderAvatar(){
  var el=document.getElementById('headerAvatar');
  if(el)el.textContent=state.profile.emoji||'👤';
  var lvl=Math.floor((state.xp||0)/100);
  if(el)el.className='avatar-btn lvl-'+Math.min(lvl,5);
  var sb=document.getElementById('sidebarAvatar');
  if(sb)sb.textContent=state.profile.emoji||'👤';
  var sn=document.getElementById('sidebarName');
  if(sn)sn.textContent=state.profile.name||'Пользователь';
  var sl=document.getElementById('sidebarLevel');
  if(sl)sl.textContent='Уровень '+(lvl+1);
}

/* ============ HEALTH ============ */
function renderHealth(){
  var waterEntry=state.customWater.find(function(w){return w.date===today()});
  var water=waterEntry?waterEntry.count:0;
  var waterGoal=state.settings.waterGoal||8;
  var todayScores=(state.domainScores||{})[today()]||{};
  var html='<div class="page">'+backBtn('dashboard')+'<div class="title-xl">❤️ Здоровье</div>';
  html+=renderQuickTabs('health');
  html+='<div class="card"><div class="stat-grid"><div class="stat-item" onclick="quickMoodLog()" style="cursor:pointer;"><div class="stat-value">'+(state.customMood.length?state.customMood[state.customMood.length-1].score+'/10':'—')+'</div><div class="stat-label">Настроение</div></div><div class="stat-item" onclick="addWater()" style="cursor:pointer;"><div class="stat-value">'+water+'/'+waterGoal+'</div><div class="stat-label">Вода</div></div><div class="stat-item" onclick="openSleepEditor()" style="cursor:pointer;"><div class="stat-value">'+(state.customSleep&&state.customSleep[today()]?state.customSleep[today()]+'ч':'—')+'</div><div class="stat-label">Сон</div></div></div></div>';
  html+='<div class="card"><h2>🌐 Домены</h2>';
  DOMAINS.forEach(function(d){
    var score=todayScores[d.id]||0;
    html+='<div class="list-row" onclick="openDomain(\''+d.id+'\')"><div class="list-icon" style="background:'+d.color+'20;color:'+d.color+';">'+d.emoji+'</div><div class="list-body"><div class="list-title">'+d.name+'</div><div class="list-subtitle">'+(score>0?score+'/10 ('+Math.round(score*10)+'%)':'Не оценено')+'</div></div><div class="list-chevron">›</div></div>';
  });
  html+='</div>';
  html+='<div class="card"><h2>Быстрый доступ</h2><div class="group-grid"><div class="group-item" onclick="navigate(\'water\')"><div class="group-item-icon">💧</div><div class="group-item-label">Вода</div></div><div class="group-item" onclick="navigate(\'mood\')"><div class="group-item-icon">💭</div><div class="group-item-label">Настроение</div></div><div class="group-item" onclick="navigate(\'workouts\')"><div class="group-item-icon">🏋️</div><div class="group-item-label">Тренировки</div></div><div class="group-item" onclick="navigate(\'meditation\')"><div class="group-item-icon">🧘</div><div class="group-item-label">Медитации</div></div><div class="group-item" onclick="navigate(\'meds\')"><div class="group-item-icon">💊</div><div class="group-item-label">Лекарства</div></div><div class="group-item" onclick="navigate(\'recovery\')"><div class="group-item-icon">🌿</div><div class="group-item-label">Восстановление</div></div></div></div>';
  html+='<div class="card"><h2>AI-специалисты</h2>';
  ['doctor','nutrition','fitness','psych'].forEach(function(k){
    var p=PERSONAS[k];
    html+='<div class="list-row" onclick="openPersona(\''+k+'\')"><div class="list-icon" style="background:var(--'+p.color+');color:#000;">'+p.emoji+'</div><div class="list-body"><div class="list-title">'+p.name+'</div><div class="list-subtitle">'+p.label+'</div></div><div class="list-chevron">›</div></div>';
  });
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
function openPersona(p){state.settings.activePersona=p;save();navigate('ai')}
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

/* ============ SIMPLE PAGES ============ */
function renderWater(){
  var entry=state.customWater.find(function(w){return w.date===today()});
  var count=entry?entry.count:0;
  var goal=state.settings.waterGoal||8;
  var html='<div class="page">'+backBtn('health')+'<div class="title-xl">💧 Вода</div>';
  html+='<div class="card card-gradient" style="text-align:center;"><div style="font-size:56px;">💧</div><div style="font-size:40px;font-weight:800;">'+count+'/'+goal+'</div><div class="progress" style="margin-top:12px;background:rgba(255,255,255,.25);height:8px;"><div class="progress-fill" style="width:'+Math.min(100,count/goal*100)+'%;background:#fff;"></div></div></div>';
  html+='<button class="btn btn-primary btn-block" onclick="addWater()">+1 стакан</button></div>';
  document.getElementById('app').innerHTML=html;
}
function renderMood(){
  var m=state.customMood||[];
  var html='<div class="page">'+backBtn('health')+'<div class="title-xl">💭 Настроение</div>';
  html+='<button class="btn btn-primary btn-block mb-4" onclick="quickMoodLog()">Записать</button>';
  if(m.length){m.slice(-10).reverse().forEach(function(e){html+='<div class="list-row"><div class="list-icon">'+(e.score>=7?'😊':e.score>=5?'🙂':'😔')+'</div><div class="list-body"><div class="list-title">'+e.date+'</div><div class="list-subtitle">'+e.score+'/10</div></div></div>'})}
  else{html+='<div class="empty"><div class="empty-icon">💭</div><div class="empty-title">Пусто</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderWorkouts(){
  var w=state.customWorkouts||[];
  var html='<div class="page">'+backBtn('health')+'<div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">🏋️ Тренировки</div><button class="btn btn-primary btn-sm" onclick="openEntityEditor(\'workout\',null)">+</button></div>';
  if(w.length){w.forEach(function(x){html+='<div class="list-row" onclick="openEntityEditor(\'workout\',\''+x.id+'\')"><div class="list-icon">🏋️</div><div class="list-body"><div class="list-title">'+esc(x.title)+'</div><div class="list-subtitle">'+(x.duration||60)+' мин · '+(x.intensity||7)+'</div></div></div>'})}
  else{html+='<div class="empty"><div class="empty-icon">🏋️</div><div class="empty-title">Нет тренировок</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderMeditation(){
  var m=state.customMeditation||[];
  var html='<div class="page">'+backBtn('health')+'<div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">🧘 Медитации</div><button class="btn btn-primary btn-sm" onclick="openEntityEditor(\'meditation\',null)">+</button></div>';
  if(m.length){m.forEach(function(x){html+='<div class="list-row" onclick="openEntityEditor(\'meditation\',\''+x.id+'\')"><div class="list-icon">🧘</div><div class="list-body"><div class="list-title">'+esc(x.title)+'</div><div class="list-subtitle">'+(x.duration||10)+' мин</div></div></div>'})}
  else{html+='<div class="empty"><div class="empty-icon">🧘</div><div class="empty-title">Нет медитаций</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderMeds(){
  var m=state.customMeds||[];
  var html='<div class="page">'+backBtn('health')+'<div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">💊 Лекарства</div><button class="btn btn-primary btn-sm" onclick="openEntityEditor(\'med\',null)">+</button></div>';
  if(m.length){m.forEach(function(x){html+='<div class="list-row" onclick="openEntityEditor(\'med\',\''+x.id+'\')"><div class="list-icon">💊</div><div class="list-body"><div class="list-title">'+esc(x.title)+'</div><div class="list-subtitle">'+esc(x.dosage||'')+' '+(x.time||'')+'</div></div></div>'})}
  else{html+='<div class="empty"><div class="empty-icon">💊</div><div class="empty-title">Нет лекарств</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderJournal(){
  var entries=state.journalEntries||[];
  var html='<div class="page">'+backBtn('more')+'<div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">📓 Дневник</div><button class="btn btn-primary btn-sm" onclick="openEntityEditor(\'journal\',null)">+</button></div>';
  if(entries.length){entries.slice().reverse().forEach(function(e){html+='<div class="card" onclick="openEntityEditor(\'journal\',\''+e.id+'\')" style="cursor:pointer;"><div class="footnote text-tertiary">'+e.date+'</div><div style="margin-top:6px;font-weight:600;">'+esc(e.title||'Запись')+'</div>';if(e.wins)html+='<div class="footnote text-secondary mt-2">✅ '+esc(e.wins).slice(0,100)+'</div>';html+='</div>'})}
  else{html+='<div class="empty"><div class="empty-icon">📓</div><div class="empty-title">Пусто</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderNotes(){
  var notes=state.customNotes||[];
  var html='<div class="page">'+backBtn('more')+'<div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">📝 Заметки</div><button class="btn btn-primary btn-sm" onclick="openEntityEditor(\'note\',null)">+</button></div>';
  if(notes.length){notes.forEach(function(n){html+='<div class="card" onclick="openEntityEditor(\'note\',\''+n.id+'\')" style="cursor:pointer;"><div class="list-title">'+esc(n.title||'—')+'</div><div class="footnote text-secondary mt-2">'+esc((n.content||'').slice(0,150))+'</div></div>'})}
  else{html+='<div class="empty"><div class="empty-icon">📝</div><div class="empty-title">Пусто</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderGoals(){
  var goals=state.customGoals||[];
  var html='<div class="page">'+backBtn('more')+'<div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">🎯 Цели</div><button class="btn btn-primary btn-sm" onclick="openEntityEditor(\'goal\',null)">+</button></div>';
  if(goals.length){goals.forEach(function(g){var pct=g.target?(g.current||0)/g.target*100:0;html+='<div class="card" onclick="openEntityEditor(\'goal\',\''+g.id+'\')" style="cursor:pointer;"><div class="list-title">'+esc(g.title)+'</div><div class="footnote text-secondary">'+(g.metric?'· '+g.current+'/'+g.target+' '+g.metric:'')+'</div>';if(g.target)html+='<div class="progress mt-2"><div class="progress-fill" style="width:'+Math.min(100,pct)+'%;"></div></div>';html+='</div>'})}
  else{html+='<div class="empty"><div class="empty-icon">🎯</div><div class="empty-title">Нет целей</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderHabits(){
  var habits=state.customHabits||[];
  var html='<div class="page">'+backBtn('more')+'<div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">🔄 Привычки</div><button class="btn btn-primary btn-sm" onclick="openEntityEditor(\'habit\',null)">+</button></div>';
  if(habits.length){habits.forEach(function(h){html+='<div class="habit-row" onclick="openEntityEditor(\'habit\',\''+h.id+'\')"><div class="habit-icon">'+(h.icon||'✅')+'</div><div class="habit-body"><div class="habit-title">'+esc(h.title)+'</div><div class="habit-streak">'+esc(h.category||'')+'</div></div></div>'})}
  else{html+='<div class="empty"><div class="empty-icon">🔄</div><div class="empty-title">Нет привычек</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}

/* ============ TIMER ============ */
function renderTimer(){
  var h=Math.floor(timerSeconds/3600);
  var m=Math.floor((timerSeconds%3600)/60);
  var s=timerSeconds%60;
  var display=(h>0?String(h).padStart(2,'0')+':':'')+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  var html='<div class="page">'+backBtn('dashboard')+'<div class="title-xl">⏱ Таймер</div>';
  html+='<div class="card" style="text-align:center;padding:32px 16px;"><div style="font-size:64px;font-weight:800;line-height:1;letter-spacing:-.04em;font-variant-numeric:tabular-nums;" id="timerDisplay">'+display+'</div></div>';
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
  html+='</div></div>';
  var sessions=state.timerSessions||[];
  html+='<div class="card"><h2>Сессии ('+sessions.length+')</h2>';
  if(sessions.length){sessions.slice(-5).reverse().forEach(function(s){html+='<div class="stat-row"><span class="stat-row-label">'+s.duration+' мин · '+s.mode+'</span><span class="stat-row-value">'+s.date+'</span></div>'})}
  else{html+='<div class="footnote text-tertiary">Пока нет</div>'}
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
function setTimerMode(mode){
  timerMode=mode;
  var mins={pomodoro:25,short:5,long:15,deep:90}[mode]||25;
  timerSeconds=mins*60;
  timerRunning=false;
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
      var h=Math.floor(timerSeconds/3600);
      var m=Math.floor((timerSeconds%3600)/60);
      var s=timerSeconds%60;
      el.textContent=(h>0?String(h).padStart(2,'0')+':':'')+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
    }
  },1000);
  renderTimer();
}
function pauseTimer(){
  timerRunning=false;
  if(timerInterval){clearInterval(timerInterval);timerInterval=null}
  renderTimer();
}
function resetTimer(){
  if(timerInterval){clearInterval(timerInterval);timerInterval=null}
  timerRunning=false;
  var mins={pomodoro:25,short:5,long:15,deep:90}[timerMode]||25;
  timerSeconds=mins*60;
  renderTimer();
}
function finishTimer(){
  if(timerInterval){clearInterval(timerInterval);timerInterval=null}
  timerRunning=false;
  var mins={pomodoro:25,short:5,long:15,deep:90}[timerMode]||25;
  var spent=mins*60-timerSeconds;
  if(!state.timerSessions)state.timerSessions=[];
  state.timerSessions.push({id:uid(),mode:timerMode,duration:Math.floor(spent/60),date:today(),created_at:nowISO()});
  save();toast('✓ Сессия','success');haptic('success');checkAchievements();resetTimer();
}

/* ============ FOCUS ============ */
function renderFocus(){
  var sessions=state.focusSessions||[];
  var html='<div class="page">'+backBtn('dashboard')+'<div class="title-xl">🎯 Фокус</div>';
  html+='<div class="card"><h2>Режимы</h2>';
  html+='<div class="list-row" onclick="startFocusSession(\'Deep Work\',90)"><div class="list-icon">🎯</div><div class="list-body"><div class="list-title">Deep Work</div><div class="list-subtitle">90 мин</div></div></div>';
  html+='<div class="list-row" onclick="startFocusSession(\'Pomodoro\',25)"><div class="list-icon">🍅</div><div class="list-body"><div class="list-title">Pomodoro</div><div class="list-subtitle">25 мин</div></div></div>';
  html+='<div class="list-row" onclick="startFocusSession(\'Sprint\',15)"><div class="list-icon">⚡</div><div class="list-body"><div class="list-title">Sprint</div><div class="list-subtitle">15 мин</div></div></div>';
  html+='</div>';
  html+='<div class="card"><h2>История ('+sessions.length+')</h2>';
  if(sessions.length){sessions.slice(-5).reverse().forEach(function(s){html+='<div class="stat-row"><span class="stat-row-label">'+s.name+' · '+s.duration+' мин</span><span class="stat-row-value">'+s.date+'</span></div>'})}
  else{html+='<div class="footnote text-tertiary">Пока нет</div>'}
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
function startFocusSession(name,duration){
  if(!state.focusSessions)state.focusSessions=[];
  state.focusSessions.push({id:uid(),name:name,duration:duration,date:today(),created_at:nowISO()});
  save();toast('✓ '+name,'success');haptic('success');checkAchievements();renderFocus();
}

/* ============ ENTERTAINMENT ============ */
function renderEntertainment(){
  var html='<div class="page">'+backBtn('dashboard')+'<div class="title-xl">🎬 Досуг</div>';
  html+=renderQuickTabs('entertainment');
  html+='<div class="stat-grid mb-4"><div class="stat-item"><div class="stat-value">'+(state.watched||[]).length+'</div><div class="stat-label">Просмотрено</div></div><div class="stat-item"><div class="stat-value">'+(state.watchlist||[]).length+'</div><div class="stat-label">В списке</div></div><div class="stat-item"><div class="stat-value">'+(state.customResources||[]).length+'</div><div class="stat-label">Свои</div></div></div>';
  html+='<div class="compact-grid">';
  html+='<div class="compact-item" onclick="navigate(\'resources\')"><span class="compact-icon">🔗</span><span>Свои ресурсы</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'movies\')"><span class="compact-icon">🎥</span><span>Фильмы</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'series\')"><span class="compact-icon">📺</span><span>Сериалы</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'books\')"><span class="compact-icon">📚</span><span>Книги</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'musiclib\')"><span class="compact-icon">🎵</span><span>Музыка</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'gameslib\')"><span class="compact-icon">🎮</span><span>Игры</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'podcastslib\')"><span class="compact-icon">🎧</span><span>Подкасты</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'watchlist\')"><span class="compact-icon">📋</span><span>Хочу</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'watched\')"><span class="compact-icon">✅</span><span>Смотрел</span></div>';
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
function renderResources(){
  var list=state.customResources||[];
  var html='<div class="page">'+backBtn('entertainment')+'<div class="title-xl">🔗 Свои ресурсы</div>';
  html+='<button class="btn btn-primary btn-block mb-4" onclick="openAddResource()">+ Добавить ссылку</button>';
  if(!list.length){html+='<div class="empty"><div class="empty-icon">🔗</div><div class="empty-title">Пока ничего</div><div class="empty-text">Добавь YouTube, Spotify, статьи</div></div>'}
  else{
    list.forEach(function(r){
      var icon='🔗';
      if(r.url.indexOf('youtube')>=0||r.url.indexOf('youtu.be')>=0)icon='▶';
      else if(r.url.indexOf('spotify')>=0)icon='🎧';
      else if(r.url.indexOf('github')>=0)icon='💻';
      else if(r.url.indexOf('telegram')>=0||r.url.indexOf('t.me')>=0)icon='✈️';
      html+='<div class="resource-card"><div class="resource-favicon">'+icon+'</div><div class="resource-body"><div class="resource-title">'+esc(r.title)+'</div><div class="resource-url">'+esc(r.url)+'</div></div><button class="btn btn-ghost btn-xs" onclick="event.stopPropagation();window.open(\''+esc(r.url)+'\',\'_blank\')">↗</button><button class="btn btn-danger btn-xs" onclick="event.stopPropagation();deleteResource(\''+r.id+'\')">🗑</button></div>';
    });
  }
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
function deleteResource(id){
  if(!confirm('Удалить?'))return;
  state.customResources=(state.customResources||[]).filter(function(x){return x.id!==id});
  save();toast('Удалено','info');renderResources();
}
function renderMovies(){
  var lib=window.__MOVIES_LIBRARY||[];
  var html='<div class="page">'+backBtn('entertainment')+'<div class="title-xl">🎥 Фильмы</div>';
  lib.forEach(function(m){
    html+='<div class="ent-card"><div class="ent-poster">🎬</div><div class="ent-body"><div class="ent-title">'+esc(m.title)+' ('+m.year+')</div><div class="ent-meta">'+esc(m.genre)+' · '+esc(m.director)+'</div><div class="ent-desc">'+esc(m.desc)+'</div><div class="ent-rating">⭐ '+m.rating+'</div></div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderSeries(){
  var lib=window.__SERIES_LIBRARY||[];
  var html='<div class="page">'+backBtn('entertainment')+'<div class="title-xl">📺 Сериалы</div>';
  lib.forEach(function(m){html+='<div class="ent-card"><div class="ent-poster">📺</div><div class="ent-body"><div class="ent-title">'+esc(m.title)+'</div><div class="ent-meta">'+m.year+' · '+m.seasons+' сезонов</div><div class="ent-desc">'+esc(m.desc)+'</div><div class="ent-rating">⭐ '+m.rating+'</div></div></div>'});
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderBooks(){
  var lib=window.__BOOKS_LIBRARY||[];
  var html='<div class="page">'+backBtn('entertainment')+'<div class="title-xl">📚 Книги</div>';
  lib.forEach(function(m){html+='<div class="ent-card"><div class="ent-poster">📚</div><div class="ent-body"><div class="ent-title">'+esc(m.title)+'</div><div class="ent-meta">'+esc(m.author)+' · '+m.year+'</div><div class="ent-desc">'+esc(m.desc)+'</div><div class="ent-rating">⭐ '+m.rating+'</div></div></div>'});
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderMusic(){
  var lib=window.__MUSIC_LIBRARY||[];
  var html='<div class="page">'+backBtn('entertainment')+'<div class="title-xl">🎵 Музыка</div>';
  lib.forEach(function(m){
    html+='<div class="method-card"><div class="method-header"><div class="method-emoji">🎵</div><div style="flex:1;"><div class="method-title">'+esc(m.title)+'</div><div class="method-cat">'+esc(m.genre)+'</div></div></div><div class="method-desc">'+esc(m.desc)+'</div><a class="video-link spotify" href="https://open.spotify.com/search/'+encodeURIComponent(m.title)+'" target="_blank">🎧 Spotify</a><a class="video-link" href="https://www.youtube.com/results?search_query='+encodeURIComponent(m.title)+'" target="_blank">▶ YouTube</a></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderGames(){
  var lib=window.__GAMES_LIBRARY||[];
  var html='<div class="page">'+backBtn('entertainment')+'<div class="title-xl">🎮 Игры</div>';
  lib.forEach(function(m){html+='<div class="ent-card"><div class="ent-poster">🎮</div><div class="ent-body"><div class="ent-title">'+esc(m.title)+'</div><div class="ent-meta">'+esc(m.genre)+' · '+esc(m.time)+'</div><div class="ent-desc">'+esc(m.desc)+'</div><div class="ent-rating">⭐ '+m.rating+'</div></div></div>'});
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderPodcasts(){
  var lib=window.__PODCASTS_LIBRARY||[];
  var html='<div class="page">'+backBtn('entertainment')+'<div class="title-xl">🎧 Подкасты</div>';
  lib.forEach(function(m){html+='<div class="method-card"><div class="method-header"><div class="method-emoji">🎧</div><div style="flex:1;"><div class="method-title">'+esc(m.title)+'</div><div class="method-cat">'+esc(m.author)+'</div></div></div><div class="method-desc">'+esc(m.desc)+'</div></div>'});
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderWatchlist(){
  var list=state.watchlist||[];
  var html='<div class="page">'+backBtn('entertainment')+'<div class="title-xl">📋 Хочу</div>';
  if(list.length){list.forEach(function(w){html+='<div class="list-row"><div class="list-icon">🎬</div><div class="list-body"><div class="list-title">'+esc(w.title)+'</div><div class="list-subtitle">'+w.type+'</div></div></div>'})}
  else{html+='<div class="empty"><div class="empty-icon">📋</div><div class="empty-title">Пусто</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderWatched(){
  var list=state.watched||[];
  var html='<div class="page">'+backBtn('entertainment')+'<div class="title-xl">✅ Смотрел</div>';
  if(list.length){list.forEach(function(w){html+='<div class="list-row"><div class="list-icon">✓</div><div class="list-body"><div class="list-title">'+esc(w.title)+'</div><div class="list-subtitle">'+w.type+' · ⭐'+w.rating+'</div></div></div>'})}
  else{html+='<div class="empty"><div class="empty-icon">✅</div><div class="empty-title">Пусто</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}

/* ============ SCREEN TRACKER ============ */
function renderScreenTracker(){
  var tips=window.__SCREEN_TIPS||[];
  var html='<div class="page">'+backBtn('dashboard')+'<div class="title-xl">📱 Экранный детокс</div>';
  html+='<div class="card" style="background:linear-gradient(135deg,rgba(255,107,107,.15),rgba(255,169,64,.1));"><h2>📚 30-дневный курс</h2><div class="footnote text-secondary mb-3">Постепенное снижение экрана</div><button class="btn btn-primary btn-block" onclick="navigate(\'detoxcourse\')">Открыть</button></div>';
  var categories={};
  tips.forEach(function(t){if(!categories[t.category])categories[t.category]=[];categories[t.category].push(t)});
  Object.keys(categories).forEach(function(cat){
    html+='<div class="card"><h2>'+cat+'</h2>';
    categories[cat].forEach(function(t){
      html+='<div style="background:var(--glass-2);border-radius:14px;padding:12px;margin-bottom:8px;"><div style="font-weight:700;margin-bottom:4px;">'+esc(t.title)+'</div><div class="footnote text-secondary">'+esc(t.desc)+'</div><div class="footnote text-secondary mt-1">→ '+esc(t.action)+'</div><div class="footnote text-tertiary">✨ '+esc(t.effect)+' · ⏱ '+esc(t.time)+'</div></div>';
    });
    html+='</div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderDetoxCourse(){
  var course=window.__DETOX_COURSE||[];
  var currentDay=(typeof getCurrentDay==='function')?getCurrentDay():1;
  var completed=(typeof getCompletedDaysCount==='function')?getCompletedDaysCount():0;
  var pct=Math.round(completed/30*100);
  var html='<div class="page">'+backBtn('screentracker')+'<div class="title-xl">📚 Детокс-курс</div>';
  html+='<div class="detox-progress-hero"><h2>Прогресс</h2><div class="big">'+pct+'%</div><div class="small">'+completed+' из 30 · День '+currentDay+'</div><div class="progress" style="margin-top:12px;background:rgba(255,255,255,.25);height:6px;"><div class="progress-fill" style="width:'+pct+'%;background:#fff;"></div></div></div>';
  course.forEach(function(d){
    var isDone=(typeof isDayCompleted==='function')?isDayCompleted(d.day):false;
    var isCurrent=d.day===currentDay;
    var canOpen=(typeof canOpenDay==='function')?canOpenDay(d.day):(d.day<=currentDay||isDone);
    var cls='detox-day-card';
    if(isDone)cls+=' completed';else if(isCurrent)cls+=' current';else if(!canOpen)cls+=' locked';
    html+='<div class="'+cls+'" onclick="'+(canOpen?'openDetoxDay('+d.day+')':'toast(\'Сначала предыдущий\',\'warning\')')+'"><div class="detox-day-header"><div class="detox-day-number">'+(isDone?'✓ День '+d.day:'День '+d.day)+'</div><div class="footnote text-tertiary">'+esc(d.phase)+'</div></div><div class="detox-day-title">'+esc(d.title)+'</div><div class="detox-day-subtitle">'+esc(d.subtitle)+'</div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openDetoxDay(day){
  var course=window.__DETOX_COURSE||[];
  var d=course.find(function(x){return x.day===day});
  if(!d)return;
  var isDone=(typeof isDayCompleted==='function')?isDayCompleted(day):false;
  var html='<div style="text-align:center;margin-bottom:16px;"><div class="detox-day-number" style="margin:0 auto 8px;">День '+d.day+'</div><div class="footnote text-secondary">'+esc(d.phase)+'</div></div>';
  html+='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:20px;font-weight:800;">'+esc(d.title)+'</div></div>';
  html+='<div class="detox-section why"><div class="detox-section-title">🧠 Почему</div><div class="detox-section-content">'+formatLesson(d.why)+'</div></div>';
  html+='<div class="detox-section do"><div class="detox-section-title">✅ Что делать</div><div class="detox-section-content"><ul>'+d.do.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul></div></div>';
  html+='<div class="detox-section effect"><div class="detox-section-title">💎 Даст</div><div class="detox-section-content">'+esc(d.effect)+'</div></div>';
  if(!isDone)html+='<button class="btn btn-primary btn-block mt-3" onclick="completeDetoxDay('+d.day+')">✓ День завершён</button>';
  else html+='<div class="badge badge-success" style="display:block;text-align:center;padding:12px;margin-top:12px;">✓ Пройден</div>';
  openSheet('День '+d.day,html);
}
function completeDetoxDay(day){
  if(typeof markDayCompleted==='function'){
    markDayCompleted(day);save();haptic('success');
    toast('🎉 День '+day+'!','success',3500);
    checkAchievements();closeSheet();renderDetoxCourse();
  }
}

/* ============ DAILY PLAN ============ */
function renderDailyPlan(){
  var todayTasks=state.tasks.filter(function(t){return t.status==='pending'});
  var plan=state.todayPlan;
  var html='<div class="page">'+backBtn('dashboard')+'<div class="title-xl">📅 План дня</div>';
  if(plan&&plan.date===today()){
    html+='<div class="card" style="background:linear-gradient(135deg,rgba(91,158,255,.15),rgba(167,139,250,.1));"><div class="row-between mb-2"><div style="font-weight:800;">🎯 Персональный</div><div class="badge badge-brand">'+plan.load+'%</div></div></div>';
    plan.items.forEach(function(item){
      html+='<div class="list-row"><div class="list-icon">'+item.icon+'</div><div class="list-body"><div class="list-title">'+esc(item.title)+'</div><div class="list-subtitle">'+esc(item.time)+' · '+esc(item.desc)+'</div></div></div>';
    });
  }
  html+='<div class="card"><h2>📌 Задачи ('+todayTasks.length+')</h2>';
  var sorted=todayTasks.slice().sort(function(a,b){return getEisenhowerPriority(a)-getEisenhowerPriority(b)});
  sorted.slice(0,10).forEach(function(t){html+=taskRow(t)});
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}

/* ============ MATRIX ============ */
function renderMatrix(){
  var matrix={q1:[],q2:[],q3:[],q4:[]};
  state.tasks.forEach(function(t){
    if(t.status==='completed')return;
    matrix[getEisenhowerQuadrant(t)].push(t);
  });
  var html='<div class="page">'+backBtn('dashboard')+'<div class="title-xl">🔢 Матрица</div>';
  html+='<div class="matrix-grid-2x2">';
  html+='<div class="matrix-quadrant matrix-q1"><div class="matrix-q-title">🔥 Q1</div><div class="matrix-q-count" style="color:var(--danger);">'+matrix.q1.length+'</div><div class="matrix-q-sub">Делай</div></div>';
  html+='<div class="matrix-quadrant matrix-q2"><div class="matrix-q-title">📌 Q2</div><div class="matrix-q-count" style="color:var(--brand);">'+matrix.q2.length+'</div><div class="matrix-q-sub">Планируй</div></div>';
  html+='<div class="matrix-quadrant matrix-q3"><div class="matrix-q-title">⚡ Q3</div><div class="matrix-q-count" style="color:var(--warning);">'+matrix.q3.length+'</div><div class="matrix-q-sub">Делегируй</div></div>';
  html+='<div class="matrix-quadrant matrix-q4"><div class="matrix-q-title">🗑 Q4</div><div class="matrix-q-count">'+matrix.q4.length+'</div><div class="matrix-q-sub">Удали</div></div>';
  html+='</div>';
  ['q1','q2','q3','q4'].forEach(function(q){
    var titles={q1:'🔥 Q1',q2:'📌 Q2',q3:'⚡ Q3',q4:'🗑 Q4'};
    html+='<div class="card"><h2>'+titles[q]+'</h2>';
    if(matrix[q].length)matrix[q].forEach(function(t){html+=taskRow(t)});
    else html+='<div class="footnote text-tertiary">Пусто</div>';
    html+='</div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}

/* ============ STATS ============ */
function renderStats(){
  var doneTasks=state.tasks.filter(function(t){return t.status==='completed'}).length;
  var doneLessons=Object.keys(state.levelProgress||{}).length;
  var html='<div class="page">'+backBtn('dashboard')+'<div class="title-xl">📊 Статистика</div>';
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
  var html='<div class="page">'+backBtn('stats')+'<div class="title-xl">📈 Всё</div>';
  html+='<div class="card"><h2>🌐 Домены (%)</h2>';
  var todayScores=(state.domainScores||{})[today()]||{};
  DOMAINS.forEach(function(d){
    var score=todayScores[d.id]||0;
    var pct=Math.round(score*10);
    html+='<div style="margin-bottom:10px;"><div class="row-between mb-1"><span class="footnote">'+d.emoji+' '+d.name+'</span><span class="footnote" style="color:'+d.color+';font-weight:700;">'+pct+'%</span></div><div class="progress"><div class="progress-fill" style="width:'+pct+'%;background:'+d.color+';"></div></div></div>';
  });
  html+='</div>';
  html+='<div class="group-card"><div class="group-title">📋 Задачи</div><div class="stat-row"><span class="stat-row-label">Всего</span><span class="stat-row-value">'+state.tasks.length+'</span></div><div class="stat-row"><span class="stat-row-label">Выполнено</span><span class="stat-row-value">'+doneTasks+'</span></div></div>';
  html+='<div class="group-card"><div class="group-title">🎓 Обучение</div><div class="stat-row"><span class="stat-row-label">Уроки</span><span class="stat-row-value">'+doneLessons+'</span></div><div class="stat-row"><span class="stat-row-label">English</span><span class="stat-row-value">'+englishDone+'</span></div><div class="stat-row"><span class="stat-row-label">Навыки</span><span class="stat-row-value">'+skillsDone+'</span></div></div>';
  html+='<div class="group-card"><div class="group-title">❤️ Здоровье</div><div class="stat-row"><span class="stat-row-label">💧 Вода</span><span class="stat-row-value">'+waterTotal+'</span></div><div class="stat-row"><span class="stat-row-label">💭 Настроений</span><span class="stat-row-value">'+(state.customMood||[]).length+'</span></div><div class="stat-row"><span class="stat-row-label">🏋️ Тренировок</span><span class="stat-row-value">'+(state.customWorkouts||[]).length+'</span></div><div class="stat-row"><span class="stat-row-label">🧘 Медитаций</span><span class="stat-row-value">'+(state.customMeditation||[]).length+'</span></div></div>';
  html+='<div class="card"><h2>📈 Динамика 7 дней</h2>';
  var days=[];
  for(var i=6;i>=0;i--){
    var d=new Date();d.setDate(d.getDate()-i);
    var key=d.toISOString().slice(0,10);
    var water=(state.customWater||[]).find(function(w){return w.date===key});
    days.push({date:key,water:water?water.count:0});
  }
  var maxVal=Math.max(8,Math.max.apply(null,days.map(function(d){return d.water})));
  html+='<div class="chart-bars">';
  days.forEach(function(d){
    var h=Math.round((d.water/maxVal)*100);
    html+='<div class="chart-bar" style="height:'+Math.max(4,h)+'%;"><div class="chart-bar-value">'+d.water+'</div><div class="chart-bar-label">'+d.date.slice(5)+'</div></div>';
  });
  html+='</div></div>';
  html+='<div class="card"><h2>🔮 Прогноз</h2>';
  var rate=doneLessons>0?doneLessons/30:1;
  html+='<div class="stat-row"><span class="stat-row-label">Через 30 дней</span><span class="stat-row-value">~'+(doneLessons+Math.round(rate*30))+' уроков</span></div>';
  html+='<div class="stat-row"><span class="stat-row-label">Через 90 дней</span><span class="stat-row-value">~'+(doneLessons+Math.round(rate*90))+' уроков</span></div></div>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}

/* ============ SETTINGS ============ */
function renderSettings(){
  var html='<div class="page">'+backBtn('dashboard')+'<div class="title-xl">⚙️ Настройки</div>';
  html+='<div class="card"><h2>Профиль</h2><div class="field"><label class="field-label">Имя</label><input type="text" value="'+esc(state.profile.name)+'" onchange="saveProfileName(this.value)"/></div><div class="list-row" onclick="openThemePicker()"><div class="list-icon">🎨</div><div class="list-body"><div class="list-title">Тема</div></div><div class="list-value">'+(THEMES.find(function(t){return t.id===state.settings.theme})||{}).name+'</div></div></div>';
  html+='<div class="card"><h2>AI</h2><div class="list-row" onclick="openAISettings()"><div class="list-icon">✨</div><div class="list-body"><div class="list-title">'+state.settings.provider+'</div><div class="list-subtitle">'+(state.settings.apiKey?'Ключ установлен':'Не задан')+'</div></div><div class="list-chevron">›</div></div></div>';
  html+='<div class="card"><h2>Данные</h2><div class="list-row" onclick="navigate(\'storage\')"><div class="list-icon">🗄</div><div class="list-body"><div class="list-title">Хранилище</div></div><div class="list-chevron">›</div></div><div class="list-row" onclick="navigate(\'dbmanager\')"><div class="list-icon">💾</div><div class="list-body"><div class="list-title">База</div></div><div class="list-chevron">›</div></div></div>';
  html+='<div class="footnote text-tertiary" style="text-align:center;margin-top:24px;">AI Health v33 · One UI 9</div></div>';
  document.getElementById('app').innerHTML=html;
}
function renderStorage(){
  var totalSize=0;
  try{var raw=localStorage.getItem(STORAGE_KEY);totalSize=raw?raw.length:0}catch(e){}
  var keys=[];
  try{
    for(var i=0;i<localStorage.length;i++){
      var k=localStorage.key(i);
      var v=localStorage.getItem(k)||'';
      if(k.indexOf('ai_health')>=0||k.indexOf('obsidian')>=0||k.indexOf('gcal')>=0){
        keys.push({key:k,size:v.length});
      }
    }
  }catch(e){}
  keys.sort(function(a,b){return b.size-a.size});
  var html='<div class="page">'+backBtn('settings')+'<div class="title-xl">🗄 Хранилище</div>';
  html+='<div class="card"><div class="list-row"><div class="list-icon">✓</div><div class="list-body"><div class="list-title">'+STORAGE_KEY+'</div></div><div class="list-value">'+(totalSize/1024).toFixed(1)+' KB</div></div></div>';
  html+='<div class="card"><h2>Ключи</h2>';
  keys.forEach(function(k){
    html+='<div class="list-row"><div class="list-icon">🔑</div><div class="list-body"><div class="list-title">'+esc(k.key)+'</div><div class="list-subtitle">'+(k.size/1024).toFixed(1)+' KB</div></div><button class="btn btn-danger btn-xs" onclick="if(confirm(\'Удалить?\')){localStorage.removeItem(\''+k.key+'\');renderStorage();}">🗑</button></div>';
  });
  html+='</div>';
  html+='<div class="card"><h2>Операции</h2><button class="btn btn-primary btn-block mb-2" onclick="exportDB()">📤 Экспорт</button><button class="btn btn-ghost btn-block mb-2" onclick="document.getElementById(\'impDB\').click()">📥 Импорт</button><input type="file" id="impDB" accept=".json" style="display:none" onchange="importDB(event)"/><button class="btn btn-ghost btn-block mb-2" onclick="cloudSync()">☁️ Cloud</button><button class="btn btn-danger btn-block" onclick="if(confirm(\'Сброс?\')){localStorage.clear();location.reload();}">🗑 Полный сброс</button></div>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderDBManager(){navigate('storage')}
function exportDB(){
  var blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
  var url=URL.createObjectURL(blob);
  var a=document.createElement('a');
  a.href=url;a.download='ai-health-v33-'+today()+'.json';
  a.click();URL.revokeObjectURL(url);
  toast('Экспорт готов','success');
}
function importDB(e){
  var file=e.target.files[0];if(!file)return;
  var reader=new FileReader();
  reader.onload=function(ev){
    try{
      var data=JSON.parse(ev.target.result);
      if(!confirm('Заменить?'))return;
      state=Object.assign(defaultState(),data);
      save();toast('Импорт','success');location.reload();
    }catch(err){toast('Ошибка','error')}
  };
  reader.readAsText(file);
}
function cloudSync(){
  try{
    if(window.Telegram&&Telegram.WebApp&&Telegram.WebApp.CloudStorage){
      Telegram.WebApp.CloudStorage.setItem(STORAGE_KEY,JSON.stringify(state),function(err){
        if(err)toast('Ошибка','error');else toast('☁️ Синхрон','success');
      });
    }else{toast('Cloud недоступен','warning')}
  }catch(e){toast('Ошибка','error')}
}

/* ============ AI ============ */
function renderAI(){
  var active=state.settings.activePersona||'coach';
  var persona=PERSONAS[active]||PERSONAS.coach;
  var messages=state.chats.filter(function(c){return c.persona===active});
  var hasKey=!!(state.settings.apiKey||(state.integrations.gemini&&state.integrations.gemini.apiKey));
  var html='<div class="page">'+backBtn('dashboard')+'<div class="title-xl">✨ AI</div>';
  html+='<div class="quick-tabs">';
  Object.keys(PERSONAS).forEach(function(k){
    var p=PERSONAS[k];
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
  var key=state.settings.apiKey||(state.integrations.gemini&&state.integrations.gemini.apiKey);
  if(!key)return fallbackReply(persona,userText);
  var p=PERSONAS[persona];
  var history=state.chats.filter(function(c){return c.persona===persona}).slice(-10);
  try{
    var model=(state.integrations.gemini&&state.integrations.gemini.model)||'gemini-1.5-flash';
    var contents=history.map(function(m){return{role:m.role==='user'?'user':'model',parts:[{text:m.text}]}});
    var resp=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+model+':generateContent?key='+key,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({system_instruction:{parts:[{text:p.prompt}]},contents:contents})});
    var data=await resp.json();
    return (data.candidates&&data.candidates[0]&&data.candidates[0].content&&data.candidates[0].content.parts&&data.candidates[0].content.parts[0]&&data.candidates[0].content.parts[0].text)||fallbackReply(persona,userText);
  }catch(e){return fallbackReply(persona,userText)}
}
function fallbackReply(persona,text){
  text=text||'';
  if(/суицид|покончить|не хочу жить|умереть/i.test(text))return '🆘 Позвони: 8-800-2000-122 · 103 · findahelpline.com. Ты важен.';
  if(persona==='doctor')return 'Я — AI-консультант. Опиши симптомы.\n\n⚠️ Не заменяет врача.';
  if(persona==='psych')return 'Слышу тебя. Что происходит?';
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
function openAISettings(){
  openSheet('AI','<div class="field"><label class="field-label">API ключ</label><input type="password" id="ai-k" value="'+esc(state.settings.apiKey||'')+'"/></div><button class="btn btn-primary btn-block" onclick="saveAISettings()">Сохранить</button>');
}
function saveAISettings(){
  state.settings.apiKey=((document.getElementById('ai-k')||{}).value||'').trim();
  save();closeSheet();toast('Сохранено','success');renderAI();
}

/* ============ INTEGRATIONS / MISC ============ */
function renderIntegrations(){
  var html='<div class="page">'+backBtn('settings')+'<div class="title-xl">🔗 Интеграции</div>';
  html+=(typeof renderIntegrationsExt==='function')?renderIntegrationsExt():'<div class="card"><div class="footnote text-secondary">Расширения не загружены</div></div>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function saveGemini(){
  state.integrations.gemini.apiKey=(document.getElementById('gem-key')||{}).value||'';
  state.settings.apiKey=state.integrations.gemini.apiKey;
  save();toast('Gemini','success');renderIntegrations();
}
function renderMetrics(){placeholderPage('📏','Метрики')}
function renderPersonalPlan(){
  var plan=state.profile.personalPlan;
  var html='<div class="page">'+backBtn('dashboard')+'<div class="title-xl">🎯 План</div>';
  if(!plan){html+='<div class="empty"><div class="empty-icon">📋</div><div class="empty-title">Нет плана</div><button class="btn btn-primary btn-block mt-3" onclick="startSurvey()">Пройти опрос</button></div>';document.getElementById('app').innerHTML=html;return}
  html+='</div>';document.getElementById('app').innerHTML=html;
}
function renderMore(){
  var groups=[
    {title:'🎓 Обучение',items:[{key:'learning',emoji:'🎓',label:'Обучение'},{key:'english',emoji:'🇬🇧',label:'English'},{key:'skills',emoji:'💎',label:'Навыки'},{key:'courses',emoji:'📖',label:'Курсы'},{key:'paths',emoji:'🗺',label:'Пути'},{key:'methods',emoji:'🎯',label:'Методики'}]},
    {title:'🎬 Досуг',items:[{key:'entertainment',emoji:'🎬',label:'Досуг'},{key:'resources',emoji:'🔗',label:'Свои ресурсы'}]},
    {title:'📅 Планирование',items:[{key:'stats',emoji:'📊',label:'Статистика'},{key:'detailedStats',emoji:'📈',label:'Детальная'},{key:'matrix',emoji:'🔢',label:'Матрица'},{key:'dailyplan',emoji:'📅',label:'План дня'},{key:'timer',emoji:'⏱',label:'Таймер'},{key:'focus',emoji:'🎯',label:'Фокус'}]},
    {title:'🎯 Цели',items:[{key:'habits',emoji:'🔄',label:'Привычки'},{key:'goals',emoji:'🎯',label:'Цели'},{key:'notes',emoji:'📝',label:'Заметки'},{key:'journal',emoji:'📓',label:'Дневник'}]},
    {title:'🌿 Восстановление',items:[{key:'recovery',emoji:'🌿',label:'Восстановление'},{key:'screentracker',emoji:'📱',label:'Детокс'},{key:'detoxcourse',emoji:'📚',label:'30-дневный курс'}]},
    {title:'⚙️ Система',items:[{key:'storage',emoji:'🗄',label:'Хранилище'},{key:'integrations',emoji:'🔗',label:'Интеграции'},{key:'settings',emoji:'⚙️',label:'Настройки'},{key:'profile',emoji:'👤',label:'Профиль'}]}
  ];
  var html='<div class="page">'+backBtn('dashboard')+'<div class="title-xl">Все разделы</div>';
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
function placeholderPage(emoji,name){document.getElementById('app').innerHTML='<div class="page">'+backBtn('more')+'<div class="title-xl">'+name+'</div><div class="card"><div class="empty"><div class="empty-icon">'+emoji+'</div><div class="empty-title">'+name+'</div></div></div></div>'}
function renderRecovery(){
  var list=(window.RECOVERY_LIBRARY||[]);
  if(!list.length){placeholderPage('🌿','Восстановление');return}
  var cats={};
  list.forEach(function(r){if(!cats[r.category])cats[r.category]=[];cats[r.category].push(r)});
  var html='<div class="page">'+backBtn('more')+'<div class="title-xl">🌿 Восстановление</div>';
  Object.keys(cats).forEach(function(cat){
    html+='<div class="card"><h2>'+cat+'</h2>';
    cats[cat].forEach(function(r){
      html+='<div class="list-row"><div class="list-icon">'+r.emoji+'</div><div class="list-body"><div class="list-title">'+esc(r.title)+'</div><div class="list-subtitle">'+esc(r.how)+' · ⏱ '+esc(r.time)+'</div></div></div>';
    });
    html+='</div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}

/* ============ SURVEY (legacy) ============ */
function startSurvey(){state.profile.surveyStep=0;save();renderSurvey()}
function renderSurvey(){
  var step=state.profile.surveyStep||0;
  var q=SURVEY_QUESTIONS[step];
  if(!q){finishSurvey();return}
  var answers=state.profile.surveyAnswers||{};
  var html='<div class="welcome-screen" id="surveyScreen"><div class="survey-container"><div class="survey-progress">';
  for(var i=0;i<SURVEY_QUESTIONS.length;i++){
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
  }else if(q.type==='multi'){
    q.options.forEach(function(opt){
      var arr=answers[q.id]||[];
      html+='<div class="survey-option'+(arr.indexOf(opt.value)>=0?' selected':'')+'" onclick="toggleSurveyMulti(\''+q.id+'\',\''+opt.value+'\')"><span class="survey-option-emoji">'+opt.emoji+'</span><span class="survey-option-label">'+opt.label+'</span></div>';
    });
    html+='<button class="btn btn-primary btn-block mt-3" onclick="nextSurveyStep()">Далее →</button>';
  }
  if(step>0)html+='<button class="btn btn-ghost btn-block mt-2" onclick="prevSurveyStep()">← Назад</button>';
  html+='</div></div>';
  var existing=document.getElementById('surveyScreen');
  if(existing)existing.remove();
  document.body.insertAdjacentHTML('beforeend',html);
}
function selectSurveyOption(qid,val){
  if(!state.profile.surveyAnswers)state.profile.surveyAnswers={};
  state.profile.surveyAnswers[qid]=val;
  save();nextSurveyStep();
}
function toggleSurveyMulti(qid,val){
  if(!state.profile.surveyAnswers)state.profile.surveyAnswers={};
  var arr=state.profile.surveyAnswers[qid]||[];
  var idx=arr.indexOf(val);
  if(idx>=0)arr.splice(idx,1);else arr.push(val);
  state.profile.surveyAnswers[qid]=arr;
  save();renderSurvey();
}
function saveSurveyAnswer(){
  var inp=document.getElementById('surveyInput');
  var val=inp?inp.value.trim():'';
  if(!val)return toast('Заполни','error');
  var q=SURVEY_QUESTIONS[state.profile.surveyStep];
  if(!state.profile.surveyAnswers)state.profile.surveyAnswers={};
  state.profile.surveyAnswers[q.id]=val;
  if(q.id==='name')state.profile.name=val;
  save();nextSurveyStep();
}
function nextSurveyStep(){
  state.profile.surveyStep=(state.profile.surveyStep||0)+1;
  save();
  if(state.profile.surveyStep>=SURVEY_QUESTIONS.length)finishSurvey();else renderSurvey();
}
function prevSurveyStep(){
  state.profile.surveyStep=Math.max(0,(state.profile.surveyStep||0)-1);
  save();renderSurvey();
}
function finishSurvey(){
  var existing=document.getElementById('surveyScreen');
  if(existing)existing.remove();
  state.profile.surveyDone=true;
  state.profile.personalPlan={days:[],focusDomains:['mental','recovery'],metrics:[]};
  save();haptic('success');
  toast('🎉 Профиль заполнен!','success',4000);
  checkAchievements();updateHeaderAvatar();navigate('dashboard');
}

/* ============ ACHIEVEMENTS ============ */
function checkAchievements(){
  var unlocked=state.profile.achievements||[];
  var newOnes=[];
  for(var i=0;i<ACHIEVEMENTS.length;i++){
    var a=ACHIEVEMENTS[i];
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

/* ============ WELCOME ============ */
function showWelcome(){
  var overlay=document.createElement('div');
  overlay.className='welcome-screen';
  overlay.innerHTML='<div class="welcome-logo">🧠</div><div class="welcome-title">AI Health v33</div><div class="welcome-sub">One UI 9 · 5555+ уроков · 150+ навыков · Периодические опросы · Адаптация · AI.</div><button class="btn btn-primary btn-block" style="max-width:340px;" onclick="startOnboarding()">Начать</button>';
  document.body.appendChild(overlay);
}
function startOnboarding(){
  var w=document.querySelector('.welcome-screen');
  if(w)w.remove();
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
    save();updateHeaderAvatar();renderTabBar();renderDashboard();
  }
}
function finishOnboarding(){
  var inp=document.getElementById('welcome-name');
  var name=inp?inp.value.trim():'';
  if(!name)return toast('Введи имя','error');
  state.profile.name=name;
  state.settings.onboardingDone=true;
  save();
  var w=document.querySelector('.welcome-screen');
  if(w)w.remove();
  updateHeaderAvatar();renderTabBar();renderDashboard();
  haptic('success');toast('Добро пожаловать, '+name+'!','success');
}

/* ============ INIT ============ */
function init(){
  try{
    applyTheme(state.settings.theme);
    updateHeaderAvatar();
    if(!state.profile.name&&!state.settings.onboardingDone){showWelcome();return}
    if(state.profile.name&&!state.settings.onboardingDone){state.settings.onboardingDone=true;save()}
    if(!state.profile.name&&window.__tgName){state.profile.name=window.__tgName;save();updateHeaderAvatar()}
    if(state.tasks.length===0){
      state.tasks=[
        {id:uid(),title:'Завершить отчёт',category:'Работа',planned_time:45,actual_time:0,status:'pending',priority:'high',created_at:nowISO()},
        {id:uid(),title:'Повторить 10 слов',category:'Обучение',planned_time:15,actual_time:0,status:'pending',priority:'medium',created_at:nowISO()},
        {id:uid(),title:'Дневник: 3 победы',category:'Личное',planned_time:5,actual_time:0,status:'pending',priority:'medium',created_at:nowISO()}
      ];
      save();
    }
    ['englishProgress','skillsProgress','levelProgress','domainScores','domainHistory',
     'challengeProgress','screenHistory','customSleep','dailySurveys','surveys'].forEach(function(k){
      if(!state[k])state[k]={};
    });
    ['customHabits','customGoals','customNotes','journalEntries','customWater','customMood',
     'customMeds','customMeditation','customWorkouts','timerSessions','focusSessions',
     'watchlist','watched','customResources','paths','courses'].forEach(function(k){
      if(!state[k])state[k]=[];
    });
    if(!state.xp)state.xp=0;
    // Защита от undefined
    if(state.settings.effectsEnabled===undefined)state.settings.effectsEnabled=true;
    if(state.settings.effectsIntensity===undefined)state.settings.effectsIntensity=1;
    if(state.settings.animationSpeed===undefined)state.settings.animationSpeed=1;
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
    setTimeout(function(){try{if(typeof updateSidebarInfo==='function')updateSidebarInfo()}catch(e){}},300);
    setInterval(function(){try{save()}catch(e){}},30000);
    if(needsDailySurvey()&&state.settings.onboardingDone){
      setTimeout(function(){
        if(needsDailySurvey()&&currentPage==='dashboard'){
          openDailySurvey(true);
        }
      },800);
    }
    // Периодические опросы
    if(typeof getPendingSurveys==='function'&&state.settings.onboardingDone){
      setTimeout(function(){
        try{
          var pending=getPendingSurveys();
          if(pending.length&&currentPage==='dashboard'){
            if(typeof openSurvey==='function')openSurvey(pending[0].id);
          }
        }catch(e){}
      },2500);
    }
  }catch(e){
    console.error('Init:',e);
    var app=document.getElementById('app');
    if(app)app.innerHTML='<div class="empty"><div class="empty-icon">⚠️</div><div class="empty-title">Ошибка</div><div class="empty-text">'+esc(e.message)+'</div></div>';
  }
}

/* ============ RIPPLE ============ */
function attachRipple(){
  document.addEventListener('pointerdown',function(e){
    var target=e.target.closest('.btn,.list-row,.quick-tab,.tab-item,.task-item,.card,.icon-btn,.avatar-btn,.segmented-item,.level-card,.module-card,.lesson-row,.domain-card,.method-card,.course-card,.path-step,.survey-option,.ent-card,.habit-row,.group-item,.back-btn,.live-panel-item,.detox-day-card,.compact-item,.resource-card,.sidebar-item,.menu-btn');
    if(!target)return;
    target.classList.add('tap-ripple');
    var rect=target.getBoundingClientRect();
    target.style.setProperty('--rx',((e.clientX-rect.left)/rect.width)*100+'%');
    target.style.setProperty('--ry',((e.clientY-rect.top)/rect.height)*100+'%');
    target.classList.remove('rippling');
    void target.offsetWidth;
    target.classList.add('rippling');
    setTimeout(function(){target.classList.remove('rippling')},700);
  },{passive:true});
}

/* ============ EXPORTS ============ */
window.navigate=navigate;
window.openSheet=openSheet;
window.closeSheet=closeSheet;
window.openThemePicker=openThemePicker;
window.setTheme=setTheme;
window.openLiveControl=openLiveControl;
window.closeLiveControl=closeLiveControl;
window.openStatsQuick=openStatsQuick;
window.openEntityEditor=openEntityEditor;
window.saveEntity=saveEntity;
window.deleteEntity=deleteEntity;
window.openLevel=openLevel;
window.openModule=openModule;
window.openLesson=openLesson;
window.completeLesson=completeLesson;
window.openSkill=openSkill;
window.completeSkill=completeSkill;
window.openPath=openPath;
window.openStep=openStep;
window.completeStep=completeStep;
window.openCourse=openCourse;
window.openCourseLesson=openCourseLesson;
window.completeCourseLesson=completeCourseLesson;
window.openMethod=openMethod;
window.openDomain=openDomain;
window.saveDomainScore=saveDomainScore;
window.openPersona=openPersona;
window.addWater=addWater;
window.quickMoodLog=quickMoodLog;
window.saveMood=saveMood;
window.toggleTask=toggleTask;
window.openEnglishLvl=openEnglishLvl;
window.openEnglishLess=openEnglishLess;
window.completeEnglishLess=completeEnglishLess;
window.openModuleLesson=openModuleLesson;
window.completeModuleLesson=completeModuleLesson;
window.renderModuleList=renderModuleList;
window.startTimer=startTimer;
window.pauseTimer=pauseTimer;
window.resetTimer=resetTimer;
window.finishTimer=finishTimer;
window.setTimerMode=setTimerMode;
window.startFocusSession=startFocusSession;
window.switchPersona=switchPersona;
window.sendMsg=sendMsg;
window.openAISettings=openAISettings;
window.saveAISettings=saveAISettings;
window.pickEmoji=pickEmoji;
window.setEmoji=setEmoji;
window.saveProfileName=saveProfileName;
window.finishOnboarding=finishOnboarding;
window.startOnboarding=startOnboarding;
window.startSurvey=startSurvey;
window.saveSurveyAnswer=saveSurveyAnswer;
window.selectSurveyOption=selectSurveyOption;
window.toggleSurveyMulti=toggleSurveyMulti;
window.nextSurveyStep=nextSurveyStep;
window.prevSurveyStep=prevSurveyStep;
window.finishSurvey=finishSurvey;
window.exportDB=exportDB;
window.importDB=importDB;
window.renderStorage=renderStorage;
window.openDetoxDay=openDetoxDay;
window.completeDetoxDay=completeDetoxDay;
window.completeChallenge=completeChallenge;
window.setWorkMode=setWorkMode;
window.cloudSync=cloudSync;
window.openSleepEditor=openSleepEditor;
window.saveSleep=saveSleep;
window.openDailySurvey=openDailySurvey;
window.nextDailySurveyStep=nextDailySurveyStep;
window.prevDailySurveyStep=prevDailySurveyStep;
window.skipDailySurveyStep=skipDailySurveyStep;
window.finishDailySurvey=finishDailySurvey;
window.renderDailySurvey=renderDailySurvey;
window.openAddResource=openAddResource;
window.saveResource=saveResource;
window.deleteResource=deleteResource;
window.renderLearningSearch=renderLearningSearch;
window.openLevelLessonFromSearch=openLevelLessonFromSearch;
window.saveGemini=saveGemini;
window.startTimer=startTimer;
window.save=save;
window.state=state;
window.updateHeaderAvatar=updateHeaderAvatar;
window.checkAchievements=checkAchievements;
window.today=today;
window.yesterday=yesterday;
window.nowISO=nowISO;
window.uid=uid;
window.esc=esc;
window.toast=toast;
window.haptic=haptic;
window.closeLiveControl=closeLiveControl;
window.openLiveControl=openLiveControl;
window.updateSidebarInfo=(typeof updateSidebarInfo==='function')?updateSidebarInfo:function(){};

/* Автозапуск */
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',function(){init();setTimeout(attachRipple,300)});
}else{
  init();
  setTimeout(attachRipple,300);
}