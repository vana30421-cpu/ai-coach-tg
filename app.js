'use strict';
/* ============================================================
   LIFE OS — APP.js v42 — ЕДИНЫЙ ФАЙЛ
   ============================================================ */

var STORAGE_KEY = 'life_os_v40';
var STORAGE_BACKUP = 'life_os_backup';
var CURRENT_VERSION = '42';

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

/* ============================================================
   DEFAULT STATE
   ============================================================ */
function defaultState(){
  return{
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
    if(raw){
      var parsed=JSON.parse(raw);
      parsed=migrateState(parsed);
      state=deepMerge(defaultState(),parsed);
      console.log('[LOAD] ✓ state v'+state.settings.version);
    }else{
      state=defaultState();
      console.log('[LOAD] новый state');
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
var currentCourseId=null,currentCourseModuleIdx=null,currentCourseLessonIdx=null;
var taskFilter='all',taskSearch='',skillsFilter='all';
var currentDailySurveyStep=0,currentDailySurveyAnswers={};
var timerInterval=null,timerSeconds=25*60,timerRunning=false,timerMode='pomodoro';
var currentVisionExercise=null;
var currentDayPlanDate=today();
var v2Filter='all';
var pwaInstallPrompt=null;

/* ============ SCREEN TRACKER ============ */
function screenGetToday(){return (state.screenStats||{})[today()]||0}
function screenGetWeek(){
  var total=0,now=new Date();
  for(var i=0;i<7;i++){var d=new Date(now);d.setDate(now.getDate()-i);total+=(state.screenStats||{})[d.toISOString().slice(0,10)]||0}
  return total;
}
function screenGetMonth(){
  var total=0,now=new Date();
  for(var i=0;i<30;i++){var d=new Date(now);d.setDate(now.getDate()-i);total+=(state.screenStats||{})[d.toISOString().slice(0,10)]||0}
  return total;
}
function screenGetLast7Days(){
  var arr=[],now=new Date();
  for(var i=6;i>=0;i--){
    var d=new Date(now);d.setDate(now.getDate()-i);
    var iso=d.toISOString().slice(0,10);
    arr.push({date:iso,day:['Вс','Пн','Вт','Ср','Чт','Пт','Сб'][d.getDay()],minutes:(state.screenStats||{})[iso]||0});
  }
  return arr;
}
function screenGetLast30Days(){
  var arr=[],now=new Date();
  for(var i=29;i>=0;i--){
    var d=new Date(now);d.setDate(now.getDate()-i);
    arr.push({date:d.toISOString().slice(0,10),minutes:(state.screenStats||{})[d.toISOString().slice(0,10)]||0});
  }
  return arr;
}
function screenBestWorst(){
  var all=state.screenStats||{};
  var keys=Object.keys(all).filter(function(k){return all[k]>0});
  if(!keys.length)return{best:null,worst:null,bestDate:null,worstDate:null};
  var best=keys[0],worst=keys[0];
  keys.forEach(function(k){if(all[k]<all[best])best=k;if(all[k]>all[worst])worst=k});
  return{best:all[best],worst:all[worst],bestDate:best,worstDate:worst};
}
function screenAverage(days){
  var arr=days===30?screenGetLast30Days():screenGetLast7Days();
  var total=arr.reduce(function(a,x){return a+x.minutes},0);
  return Math.round(total/arr.length);
}
function fmtMinsHM(m){
  var h=Math.floor(m/60),mm=m%60;
  if(h===0)return mm+' мин';
  if(mm===0)return h+' ч';
  return h+' ч '+mm+' мин';
}
function parseScreenTime(str){
  if(!str)return 0;
  str=String(str).toLowerCase().trim();
  var total=0;
  var hMatch=str.match(/(\d+)\s*ч/);
  var mMatch=str.match(/(\d+)\s*м/);
  if(hMatch)total+=parseInt(hMatch[1])*60;
  if(mMatch)total+=parseInt(mMatch[1]);
  if(!hMatch&&!mMatch){
    var n=parseInt(str);
    if(!isNaN(n)){
      if(n<=24)total=n*60;
      else total=n;
    }
  }
  return total;
}

/* ============ EXPORT / IMPORT / RESET ============ */
function exportDB(){
  try{
    var blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
    var url=URL.createObjectURL(blob);
    var a=document.createElement('a');
    a.href=url;a.download='life-os-'+today()+'.json';a.click();
    URL.revokeObjectURL(url);
    toast('📤 Экспорт готов','success');
  }catch(e){toast('Ошибка экспорта','error')}
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
        backupStorage();
        localStorage.setItem(STORAGE_KEY,JSON.stringify(data));
        toast('✓ Импорт готов. Перезагрузка...','success');
        setTimeout(function(){location.reload()},1200);
      }catch(err){toast('Ошибка импорта','error')}
    };
    reader.readAsText(file);
  };
  input.click();
}
function resetAllWithConfirm(){
  if(!confirm('⚠️ Удалить ВСЕ данные? Бэкап сохранится.'))return;
  if(!confirm('Точно?'))return;
  backupStorage();
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}
function restoreBackup(){
  if(!confirm('Восстановить из последнего бэкапа?'))return;
  if(restoreFromBackup()){toast('✓ Восстановлено','success');setTimeout(function(){location.reload()},800)}
  else toast('Бэкап не найден','error');
}
window.exportDB=exportDB;
window.importDB=importDB;
window.resetAllWithConfirm=resetAllWithConfirm;
window.restoreBackup=restoreBackup;

/* ============================================================
   ЭФФЕКТЫ
   ============================================================ */
function startEffects(){
  var overlay=document.getElementById('themeEffect');
  if(!overlay)return;
  overlay.innerHTML='';
  try{
    if(state.settings.effectsEnabled===undefined)state.settings.effectsEnabled=true;
    if(!state.settings.effectsEnabled)return;
    var theme=(window.THEMES||[]).find(function(t){return t.id===state.settings.theme})||{effect:'stars'};
    var effect=theme.effect||'stars';
    var intensity=state.settings.effectsIntensity||1;
    function cnt(base){return Math.round(base*intensity*2.5)}
    var i,el;

    if(effect==='stars'||effect==='none'){
      for(i=0;i<cnt(30);i++){el=document.createElement('div');el.className='effect-star small';el.style.left=Math.random()*100+'%';el.style.top=Math.random()*100+'%';el.style.animationDelay=Math.random()*4+'s';el.style.animationDuration=(2+Math.random()*3)+'s';overlay.appendChild(el)}
      for(i=0;i<cnt(15);i++){el=document.createElement('div');el.className='effect-star medium';el.style.left=Math.random()*100+'%';el.style.top=Math.random()*100+'%';el.style.animationDelay=Math.random()*5+'s';overlay.appendChild(el)}
      for(i=0;i<cnt(6);i++){el=document.createElement('div');el.className='effect-star big';el.style.left=Math.random()*100+'%';el.style.top=Math.random()*100+'%';el.style.animationDelay=Math.random()*6+'s';overlay.appendChild(el)}
    }
    else if(effect==='rain'){
      for(i=0;i<cnt(50);i++){el=document.createElement('div');el.className='effect-drop';el.style.left=Math.random()*100+'%';el.style.animationDuration=(0.8+Math.random()*1.2)+'s';el.style.animationDelay=Math.random()*4+'s';el.style.height=(15+Math.random()*35)+'px';overlay.appendChild(el)}
    }
    else if(effect==='petals'){
      var petalEmojis=['🌸','🌺','🌷','💮','🏵'];
      for(i=0;i<cnt(25);i++){el=document.createElement('div');el.className='effect-petal';el.textContent=petalEmojis[Math.floor(Math.random()*petalEmojis.length)];el.style.left=Math.random()*100+'%';el.style.animationDuration=(6+Math.random()*6)+'s';el.style.animationDelay=Math.random()*8+'s';el.style.fontSize=(12+Math.random()*14)+'px';overlay.appendChild(el)}
    }
    else if(effect==='leaves'){
      var leafEmojis=['🍃','🍂','🍁','🌿','☘️'];
      for(i=0;i<cnt(25);i++){el=document.createElement('div');el.className='effect-leaf';el.textContent=leafEmojis[Math.floor(Math.random()*leafEmojis.length)];el.style.left=Math.random()*100+'%';el.style.animationDuration=(6+Math.random()*6)+'s';el.style.animationDelay=Math.random()*8+'s';el.style.fontSize=(14+Math.random()*16)+'px';overlay.appendChild(el)}
    }
    else if(effect==='snow'){
      var snowEmojis=['❄','❅','❆','✻','✼'];
      for(i=0;i<cnt(35);i++){el=document.createElement('div');el.className='effect-snowflake';el.textContent=snowEmojis[Math.floor(Math.random()*snowEmojis.length)];el.style.left=Math.random()*100+'%';el.style.animationDuration=(5+Math.random()*6)+'s';el.style.animationDelay=Math.random()*8+'s';el.style.fontSize=(10+Math.random()*12)+'px';overlay.appendChild(el)}
    }
    else if(effect==='waves'){
      for(i=0;i<5;i++){el=document.createElement('div');el.className='effect-wave';el.style.bottom=(i*40)+'px';el.style.animationDelay=(i*1.2)+'s';overlay.appendChild(el)}
    }
    else if(effect==='sparkles'||effect==='spark'){
      for(i=0;i<cnt(40);i++){el=document.createElement('div');el.className='effect-spark';el.style.left=Math.random()*100+'%';el.style.top=Math.random()*100+'%';el.style.animationDelay=Math.random()*3+'s';el.style.animationDuration=(0.8+Math.random()*1.5)+'s';overlay.appendChild(el)}
    }
    else if(effect==='dust'){
      for(i=0;i<cnt(30);i++){el=document.createElement('div');el.className='effect-dust';el.style.left=Math.random()*100+'%';el.style.top=Math.random()*100+'%';el.style.animationDuration=(3+Math.random()*5)+'s';el.style.animationDelay=Math.random()*6+'s';overlay.appendChild(el)}
    }
    else if(effect==='bubbles'){
      for(i=0;i<cnt(25);i++){el=document.createElement('div');el.className='effect-bubble';el.style.left=Math.random()*100+'%';el.style.bottom=(Math.random()*20)+'%';el.style.animationDuration=(6+Math.random()*6)+'s';el.style.animationDelay=Math.random()*6+'s';el.style.width=el.style.height=(6+Math.random()*20)+'px';overlay.appendChild(el)}
    }
    else if(effect==='fire'){
      for(i=0;i<cnt(30);i++){el=document.createElement('div');el.className='effect-fire';el.style.left=Math.random()*100+'%';el.style.animationDuration=(1.5+Math.random()*2)+'s';el.style.animationDelay=Math.random()*4+'s';overlay.appendChild(el)}
    }
    else if(effect==='lightning'){
      for(i=0;i<3;i++){el=document.createElement('div');el.className='effect-lightning';el.style.left=(20+Math.random()*60)+'%';el.style.animationDelay=(Math.random()*6)+'s';overlay.appendChild(el)}
    }
    else if(effect==='aurora'){
      for(i=0;i<4;i++){el=document.createElement('div');el.className='effect-aurora';el.style.animationDelay=(i*2)+'s';el.style.top=(i*15)+'%';overlay.appendChild(el)}
    }
    else if(effect==='fireflies'){
      for(i=0;i<cnt(30);i++){el=document.createElement('div');el.className='effect-dust';el.style.left=Math.random()*100+'%';el.style.top=Math.random()*100+'%';el.style.animationDuration=(4+Math.random()*6)+'s';el.style.animationDelay=Math.random()*8+'s';el.style.background='#c8ff5b';el.style.boxShadow='0 0 12px #c8ff5b';overlay.appendChild(el)}
    }
    else if(effect==='fog'){
      for(i=0;i<cnt(15);i++){el=document.createElement('div');el.className='effect-wave';el.style.bottom=(Math.random()*100)+'%';el.style.animationDelay=(i*0.8)+'s';el.style.opacity=0.08+Math.random()*0.08;overlay.appendChild(el)}
    }
    else if(effect==='pumpkin'){
      for(i=0;i<cnt(20);i++){el=document.createElement('div');el.className='effect-petal';el.textContent='🎃';el.style.left=Math.random()*100+'%';el.style.animationDuration=(8+Math.random()*6)+'s';el.style.animationDelay=Math.random()*10+'s';el.style.fontSize=(16+Math.random()*20)+'px';overlay.appendChild(el)}
      for(i=0;i<cnt(15);i++){el=document.createElement('div');el.className='effect-dust';el.style.left=Math.random()*100+'%';el.style.top=Math.random()*100+'%';el.style.background='#ff8c1a';el.style.boxShadow='0 0 15px #ff8c1a';el.style.animationDuration=(4+Math.random()*6)+'s';el.style.animationDelay=Math.random()*8+'s';overlay.appendChild(el)}
    }
    else if(effect==='bats'){
      for(i=0;i<cnt(15);i++){el=document.createElement('div');el.className='effect-petal';el.textContent='🦇';el.style.left=Math.random()*100+'%';el.style.animationDuration=(6+Math.random()*5)+'s';el.style.animationDelay=Math.random()*8+'s';el.style.fontSize=(18+Math.random()*16)+'px';el.style.filter='drop-shadow(0 0 10px #e60000)';overlay.appendChild(el)}
      for(i=0;i<cnt(20);i++){el=document.createElement('div');el.className='effect-dust';el.style.left=Math.random()*100+'%';el.style.top=Math.random()*100+'%';el.style.background='#e60000';el.style.boxShadow='0 0 20px #e60000';el.style.animationDuration=(3+Math.random()*5)+'s';el.style.animationDelay=Math.random()*6+'s';overlay.appendChild(el)}
    }
    else if(effect==='ghosts'){
      var ghosts=['👻','👻','✨','💫'];
      for(i=0;i<cnt(15);i++){el=document.createElement('div');el.className='effect-petal';el.textContent=ghosts[Math.floor(Math.random()*ghosts.length)];el.style.left=Math.random()*100+'%';el.style.animationDuration=(10+Math.random()*8)+'s';el.style.animationDelay=Math.random()*12+'s';el.style.fontSize=(20+Math.random()*20)+'px';el.style.filter='drop-shadow(0 0 15px #a89bff)';el.style.opacity=0.5+Math.random()*0.4;overlay.appendChild(el)}
    }
    else if(effect==='spiderweb'){
      for(i=0;i<3;i++){el=document.createElement('div');el.style.position='absolute';el.style.left=(i*33)+'%';el.style.top='0';el.style.width='1px';el.style.height='100%';el.style.background='linear-gradient(180deg, transparent, #00ff88, transparent)';el.style.opacity='0.15';el.style.boxShadow='0 0 15px #00ff88';overlay.appendChild(el)}
      for(i=0;i<cnt(25);i++){el=document.createElement('div');el.className='effect-dust';el.style.left=Math.random()*100+'%';el.style.top=Math.random()*100+'%';el.style.background='#00ff88';el.style.boxShadow='0 0 12px #00ff88';el.style.animationDuration=(3+Math.random()*6)+'s';el.style.animationDelay=Math.random()*6+'s';overlay.appendChild(el)}
    }
    else if(effect==='bones'){
      var bones=['💀','🦴','⚰️'];
      for(i=0;i<cnt(15);i++){el=document.createElement('div');el.className='effect-petal';el.textContent=bones[Math.floor(Math.random()*bones.length)];el.style.left=Math.random()*100+'%';el.style.animationDuration=(8+Math.random()*6)+'s';el.style.animationDelay=Math.random()*10+'s';el.style.fontSize=(16+Math.random()*20)+'px';el.style.filter='drop-shadow(0 0 10px #c0c0c0)';overlay.appendChild(el)}
    }
    else if(effect==='drops'){
      for(i=0;i<cnt(30);i++){el=document.createElement('div');el.className='effect-drop';el.style.left=Math.random()*100+'%';el.style.background='linear-gradient(180deg,transparent,#c00000,transparent)';el.style.animationDuration=(1.5+Math.random()*2)+'s';el.style.animationDelay=Math.random()*5+'s';el.style.height=(20+Math.random()*30)+'px';el.style.width='3px';el.style.boxShadow='0 0 12px #c00000';overlay.appendChild(el)}
    }
    else if(effect==='candles'){
      for(i=0;i<cnt(10);i++){el=document.createElement('div');el.className='effect-petal';el.textContent='🕯';el.style.left=Math.random()*100+'%';el.style.animationDuration=(10+Math.random()*6)+'s';el.style.animationDelay=Math.random()*10+'s';el.style.fontSize=(22+Math.random()*16)+'px';el.style.filter='drop-shadow(0 0 20px #e8a838)';overlay.appendChild(el)}
      for(i=0;i<cnt(25);i++){el=document.createElement('div');el.className='effect-fire';el.style.left=Math.random()*100+'%';el.style.background='linear-gradient(180deg,transparent,#e8a838,#b87818)';el.style.animationDuration=(2+Math.random()*2)+'s';el.style.animationDelay=Math.random()*6+'s';overlay.appendChild(el)}
    }
    else if(effect==='feathers'){
      var feathers=['🪶','🪶','🐦‍⬛'];
      for(i=0;i<cnt(20);i++){el=document.createElement('div');el.className='effect-leaf';el.textContent=feathers[Math.floor(Math.random()*feathers.length)];el.style.left=Math.random()*100+'%';el.style.animationDuration=(8+Math.random()*8)+'s';el.style.animationDelay=Math.random()*10+'s';el.style.fontSize=(14+Math.random()*16)+'px';overlay.appendChild(el)}
      for(i=0;i<cnt(20);i++){el=document.createElement('div');el.className='effect-dust';el.style.left=Math.random()*100+'%';el.style.top=Math.random()*100+'%';el.style.background='#5b5b9b';el.style.boxShadow='0 0 12px #5b5b9b';el.style.animationDuration=(4+Math.random()*6)+'s';el.style.animationDelay=Math.random()*8+'s';overlay.appendChild(el)}
    }
    if(overlay.children.length===0){
      for(i=0;i<cnt(20);i++){el=document.createElement('div');el.className='effect-star small';el.style.left=Math.random()*100+'%';el.style.top=Math.random()*100+'%';el.style.animationDelay=Math.random()*3+'s';overlay.appendChild(el)}
    }
  }catch(e){console.warn('Effects err:',e)}
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

/* ============ NAVIGATION ============ */
function navigate(page){
  if(!page)page='dashboard';
  currentPage=page;
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
    itcourse:renderCourseIT,lawcourse:renderCourseLaw,medcourse:renderCourseMed,
    financecourse:renderCourseFinance,psychdeep:renderCoursePsychDeep,
    langcourse:renderCourseLang,designcourse:renderCourseDesign,
    cookingcourse:renderCourseCooking,sportcourse:renderCourseSport,
    musiccourse:renderCourseMusic,historycourse:renderCourseHistory,
    astrocourse:renderCourseAstro,
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
    dailySurvey:renderDailySurvey,survey:renderSurvey,plan:renderPersonalPlan
  };
  var fn=renderers[page];
  if(typeof fn!=='function'){
    main.innerHTML='<div class="page"><div class="title-xl">🚧 '+page+'</div><div class="card"><div class="empty"><div class="empty-icon">🚧</div><div class="empty-title">Раздел не найден</div></div></div></div>';
    return;
  }
  try{fn()}catch(e){
    console.error('Render ['+page+']:',e);
    main.innerHTML='<div class="page"><div class="title-xl">⚠️ Ошибка</div><div class="card"><div class="empty"><div class="empty-icon">⚠️</div><div class="empty-title">'+esc(e.message||'Ошибка')+'</div></div></div></div>';
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
    var p=getLevelProgress(level.id);totalDone+=p.done;totalLessons+=p.total;
  });
  var overallPct=totalLessons?Math.round(totalDone/totalLessons*100):0;
  var waterEntry=state.customWater.find(function(w){return w.date===today()});
  var water=waterEntry?waterEntry.count:0;
  var waterGoal=state.settings.waterGoal||8;
  var todayEyeCount=(state.eyeExercises||[]).filter(function(e){return e.date===today()}).length;
  var screenToday=screenGetToday();

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

  if(screenToday>0||Object.keys(state.screenStats||{}).length>0){
    var screenStatus=screenToday>300?'danger':screenToday>180?'warn':'ok';
    var screenColor=screenStatus==='danger'?'var(--danger)':screenStatus==='warn'?'var(--warning)':'var(--success)';
    html+='<div class="card" onclick="navigate(\'screentracker\')" style="cursor:pointer;border-left:3px solid '+screenColor+';"><h2>📱 Экран сегодня</h2>';
    html+='<div style="display:flex;justify-content:space-between;align-items:center;"><div style="font-size:24px;font-weight:800;color:'+screenColor+';">'+fmtMinsHM(screenToday)+'</div>';
    html+='<div class="footnote text-secondary">Неделя: '+fmtMinsHM(screenGetWeek())+'</div></div>';
    html+='<div class="progress" style="margin-top:10px;"><div class="progress-fill" style="width:'+Math.min(100,screenToday/420*100)+'%;background:'+screenColor+';"></div></div>';
    html+='</div>';
  }

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
  html+='<div class="group-item" onclick="openScreenAdd()"><div class="group-item-icon">📱</div><div class="group-item-label">Экран</div></div>';
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
  state.tasks.unshift({id:uid(),title:'💎 '+w.action,description:'Мудрость дня: '+w.text,category:'Развитие',planned_time:15,status:'pending',priority:'medium',created_at:nowISO()});
  state.xp=(state.xp||0)+15;
  save();haptic('success');toast('✓ Внедрено','success');navigate('tasks');
}
window.applyWisdom=applyWisdom;

function renderDailySurveyCard(){
  if(!needsDailySurvey())return '';
  var html='<div class="card" style="background:linear-gradient(135deg,rgba(255,169,64,.2),rgba(255,107,107,.15));border-color:rgba(255,169,64,.4);">';
  html+='<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">';
  html+='<div style="font-size:36px;">📋</div>';
  html+='<div style="flex:1;"><div style="font-size:16px;font-weight:800;margin-bottom:2px;">Опрос о вчера</div>';
  html+='<div class="footnote text-secondary">12 вопросов → план на сегодня</div></div></div>';
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
  if(!plan.today||!plan.today.length){plan.today=generateLearnPlan('today');state.learnPlan=plan;save()}
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
    html+='</div>';
  });
  html+='<button class="btn btn-ghost btn-block mt-3" onclick="navigate(\'learnplan\')">Весь план</button>';
  html+='</div>';
  return html;
}
function generateLearnPlan(period){
  var levels=window.LEARNING_LEVELS||[];
  var items=[];
  var max={today:6,week:15,month:30}[period]||6;
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
function renderLearnPlan(){
  var plan=state.learnPlan||{today:[],week:[],month:[]};
  if(!plan.today||!plan.today.length){plan.today=generateLearnPlan('today');state.learnPlan=plan;save()}
  var target=state.settings.dailyLearnTarget||150;
  var totalMinutes=plan.today.reduce(function(a,x){return a+x.minutes},0);
  var pct=Math.min(100,Math.round(totalMinutes/target*100));
  var html='<div class="page"><div class="title-xl">🗓 План обучения</div>';
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:12px;">Сегодня</div><div style="font-size:40px;font-weight:800;">'+totalMinutes+' / '+target+' мин</div>';
  html+='<div class="progress" style="margin-top:10px;background:rgba(255,255,255,.25);height:6px;"><div class="progress-fill" style="width:'+pct+'%;background:#fff;"></div></div></div>';
  html+='<div class="card"><h2>📋 Задачи</h2>';
  if(plan.today.length){
    plan.today.forEach(function(item){
      html+='<div style="display:flex;gap:10px;align-items:center;padding:10px 0;border-bottom:1px solid var(--divider);">';
      html+='<div style="font-size:22px;">'+(item.done?'✅':item.icon)+'</div>';
      html+='<div style="flex:1;"><div style="font-weight:700;font-size:14px;">'+esc(item.title)+'</div>';
      html+='<div class="footnote text-secondary">'+item.minutes+' мин · '+esc(item.type)+'</div></div>';
      html+='</div>';
    });
  }else{html+='<div class="empty"><div class="empty-icon">✨</div><div class="empty-title">Всё изучено!</div></div>'}
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
window.renderLearnPlan=renderLearnPlan;

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
  var html='<div class="page"><div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">✅ Задачи</div><button class="btn btn-primary btn-sm" onclick="openEntityEditor(\'task\',null)">+ Новая</button></div>';
  html+='<div class="search-bar"><span style="color:var(--text-3);font-size:18px;">🔍</span><input type="search" placeholder="Поиск..." value="'+esc(taskSearch)+'" oninput="taskSearch=this.value;renderTasks()"/></div>';
  html+='<div class="segmented" style="margin-bottom:14px;"><button class="segmented-item '+(taskFilter==='all'?'active':'')+'" onclick="taskFilter=\'all\';renderTasks()">Все ('+counts.all+')</button><button class="segmented-item '+(taskFilter==='pending'?'active':'')+'" onclick="taskFilter=\'pending\';renderTasks()">Активные ('+counts.pending+')</button><button class="segmented-item '+(taskFilter==='completed'?'active':'')+'" onclick="taskFilter=\'completed\';renderTasks()">Готовые ('+counts.completed+')</button></div>';
  if(filtered.length){filtered.forEach(function(t){html+=taskRow(t)})}
  else{html+='<div class="empty"><div class="empty-icon">📋</div><div class="empty-title">'+(taskSearch?'Ничего':'Нет задач')+'</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function toggleTask(id){
  var t=state.tasks.find(function(x){return x.id===id});if(!t)return;
  t.status=t.status==='completed'?'pending':'completed';
  if(t.status==='completed')state.stats.totalTasksDone=(state.stats.totalTasksDone||0)+1;
  save();haptic('success');checkAchievements();
  if(currentPage==='tasks')renderTasks();else renderDashboard();
}
window.toggleTask=toggleTask;

/* ============ MATRIX ============ */
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
function renderDailyPlan(){navigate('plantoday')}

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
  '<div class="row" style="gap:8px;"><div style="flex:1;"><label class="field-label">Приоритет</label><select id="ent-priority"><option value="low"'+(t.priority==='low'?' selected':'')+'>🟢</option><option value="medium"'+(!t.priority||t.priority==='medium'?' selected':'')+'>🟡</option><option value="high"'+(t.priority==='high'?' selected':'')+'>🔴</option></select></div><div style="flex:1;"><label class="field-label">Категория</label><input type="text" id="ent-category" value="'+esc(t.category||'Работа')+'"/></div></div>'+
  '<div class="row" style="gap:8px;"><div style="flex:1;"><label class="field-label">Мин</label><input type="number" id="ent-time" value="'+(t.planned_time||30)+'" min="0"/></div><div style="flex:1;"><label class="field-label">Дедлайн</label><input type="datetime-local" id="ent-due" value="'+(t.due_date?t.due_date.slice(0,16):'')+'"/></div></div>'+
  '<button class="btn btn-primary btn-block mt-3" onclick="saveEntity(\'task\''+(t.id?',\''+t.id+'\'':'')+')">'+(t.id?'💾 Сохранить':'➕ Создать')+'</button>'+
  (t.id?'<button class="btn btn-danger btn-block mt-2" onclick="deleteEntity(\'task\',\''+t.id+'\')">🗑 Удалить</button>':'');
}
function habitEditorHTML(h){
  h=h||{};
  return '<div class="field"><label class="field-label">Название *</label><input type="text" id="ent-title" value="'+esc(h.title||'')+'"/></div>'+
  '<div class="field"><label class="field-label">Иконка</label><input type="text" id="ent-icon" value="'+esc(h.icon||'✅')+'" maxlength="4"/></div>'+
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
  '<div class="field"><label class="field-label">Мин</label><input type="number" id="ent-duration" value="'+(m.duration||10)+'" min="1"/></div>'+
  '<button class="btn btn-primary btn-block mt-3" onclick="saveEntity(\'meditation\''+(m.id?',\''+m.id+'\'':'')+')">'+(m.id?'💾 Сохранить':'➕ Создать')+'</button>'+
  (m.id?'<button class="btn btn-danger btn-block mt-2" onclick="deleteEntity(\'meditation\',\''+m.id+'\')">🗑 Удалить</button>':'');
}
function workoutEditorHTML(w){
  w=w||{};
  return '<div class="field"><label class="field-label">Тип *</label><input type="text" id="ent-title" value="'+esc(w.title||'Силовая')+'"/></div>'+
  '<div class="field"><label class="field-label">Мин</label><input type="number" id="ent-duration" value="'+(w.duration||60)+'"/></div>'+
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
  if(document.getElementById('ent-metric'))entity.metric=(document.getElementById('ent-metric').value||'').trim();
  if(document.getElementById('ent-target'))entity.target=parseFloat(document.getElementById('ent-target').value)||0;
  if(document.getElementById('ent-current'))entity.current=parseFloat(document.getElementById('ent-current').value)||0;
  if(document.getElementById('ent-dosage'))entity.dosage=(document.getElementById('ent-dosage').value||'').trim();
  if(isNew)arr.unshift(entity);
  save();haptic('success');closeSheet();
  toast(isNew?'✓ Создано':'💾 Сохранено','success');
  checkAchievements();
  navigate(currentPage);
}
function deleteEntity(type,id){
  if(!confirm('Удалить?'))return;
  var map={task:'tasks',habit:'customHabits',goal:'customGoals',note:'customNotes',journal:'journalEntries',meditation:'customMeditation',workout:'customWorkouts',med:'customMeds'};
  state[map[type]]=(state[map[type]]||[]).filter(function(x){return x.id!==id});
  save();closeSheet();toast('Удалено','info');navigate(currentPage);
}
window.openEntityEditor=openEntityEditor;
window.saveEntity=saveEntity;
window.deleteEntity=deleteEntity;

/* ============ LEARNING ============ */
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
    var p=getLevelProgress(level.id);totalDone+=p.done;totalLessons+=p.total;
  });
  var overallPct=totalLessons?Math.round(totalDone/totalLessons*100):0;
  var skillsDone=Object.keys(state.skillsProgress||{}).length;
  var engDone=Object.keys(state.englishProgress||{}).length;
  var html='<div class="page"><div class="title-xl">🎓 Обучение</div>';
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:12px;">Прогресс</div><div style="font-size:40px;font-weight:800;line-height:1;margin-bottom:10px;">'+overallPct+'%</div></div>';
  html+='<div class="compact-grid">';
  html+='<div class="compact-item" onclick="navigate(\'learnplan\')"><span class="compact-icon">🗓</span><span>План</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'levels\')"><span class="compact-icon">🌱</span><span>Уровни</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'english\')"><span class="compact-icon">🇬🇧</span><span>English '+engDone+'/'+(window.ENGLISH_125||[]).length+'</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'skills\')"><span class="compact-icon">💎</span><span>Навыки '+skillsDone+'/'+(window.SKILLS_LIBRARY||[]).length+'</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'methods\')"><span class="compact-icon">🎯</span><span>Методики</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'psychology\')"><span class="compact-icon">🧠</span><span>Психология</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'thinking\')"><span class="compact-icon">💡</span><span>Мышление</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'etiquette\')"><span class="compact-icon">🎩</span><span>Этикет</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'hormones\')"><span class="compact-icon">🧬</span><span>Гормоны</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'wealth\')"><span class="compact-icon">💰</span><span>Богатство</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'memory\')"><span class="compact-icon">🧠</span><span>Память</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'iq\')"><span class="compact-icon">🎯</span><span>IQ</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'eq\')"><span class="compact-icon">❤️</span><span>EQ</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'finance\')"><span class="compact-icon">💰</span><span>Финансы</span></div>';
  html+='<div class="compact-item" onclick="navigate(\'neuromodule\')"><span class="compact-icon">🔬</span><span>Нейро</span></div>';
  html+='</div>';
  html+='<h2 style="margin:20px 0 12px;font-size:18px;">🚀 Новые курсы</h2>';
  html+='<div class="compact-grid">';
  (window.ALL_NEW_COURSES||[]).forEach(function(c){
    html+='<div class="compact-item" onclick="navigate(\''+c.id+'\')"><span class="compact-icon">'+c.emoji+'</span><span>'+c.title+'</span></div>';
  });
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}

function renderLevels(){
  var html='<div class="page"><div class="title-xl">🌱 Уровни</div>';
  (window.LEARNING_LEVELS||[]).forEach(function(level){
    var p=getLevelProgress(level.id);
    var unlocked=isLevelUnlocked(level.id);
    var completed=p.pct===100;
    var cls='level-card';if(completed)cls+=' completed';else if(!unlocked)cls+=' locked';else if(p.pct>0)cls+=' active';
    html+='<div class="'+cls+'" onclick="'+(unlocked?'openLevel(\''+level.id+'\')':'toast(\'Заверши предыдущий\',\'warning\')')+'"><div class="level-header"><div class="level-num">'+(completed?'✓':level.num)+'</div><div class="level-info"><div class="level-title">'+level.emoji+' '+level.title+'</div><div class="level-subtitle">'+level.subtitle+'</div></div></div><div class="level-desc">'+level.desc+'</div></div>';
  });
  html+='</div>';document.getElementById('app').innerHTML=html;
}
function openLevel(id){currentLevelId=id;navigate('levelDetail')}
function renderLevelDetail(){
  var level=(window.LEARNING_LEVELS||[]).find(function(l){return l.id===currentLevelId});
  if(!level){navigate('learning');return}
  var p=getLevelProgress(level.id);
  var html='<div class="page"><div style="text-align:center;margin-bottom:20px;"><div style="font-size:56px;">'+level.emoji+'</div><div class="title-xl">'+level.title+'</div></div>';
  html+='<div class="card"><div class="progress"><div class="progress-fill" style="width:'+p.pct+'%;"></div></div><div class="footnote text-secondary mt-2">'+p.done+'/'+p.total+'</div></div>';
  html+='<div class="card"><h2>📦 Модули</h2>';
  level.modules.forEach(function(mod,i){
    var unlocked=isModuleUnlocked(level,i);
    var modDone=mod.lessons.every(function(l,idx){return state.levelProgress[level.id+'_'+mod.id+'_'+idx]});
    html+='<div class="module-card '+(modDone?'completed':!unlocked?'locked':'')+'" onclick="'+(unlocked?'openModule(\''+level.id+'\',\''+mod.id+'\')':'toast(\'Сначала предыдущий\',\'warning\')')+'"><div class="module-header"><div class="module-icon">'+mod.emoji+'</div><div class="module-info"><div class="module-title">'+mod.title+'</div><div class="module-meta">'+mod.lessons.length+' уроков</div></div></div></div>';
  });
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
function openModule(lid,mid){currentLevelId=lid;currentModuleId=mid;navigate('moduleDetail')}
function renderModuleDetail(){
  var level=(window.LEARNING_LEVELS||[]).find(function(l){return l.id===currentLevelId});if(!level){navigate('learning');return}
  var module=level.modules.find(function(m){return m.id===currentModuleId});if(!module){navigate('levelDetail');return}
  var html='<div class="page"><div class="title-xl">'+module.emoji+' '+module.title+'</div>';
  html+='<div class="card">';
  module.lessons.forEach(function(lesson,i){
    var key=level.id+'_'+module.id+'_'+i;
    var isDone=!!state.levelProgress[key];
    var unlocked=isLessonUnlocked(level,module,i);
    html+='<div class="lesson-row '+(isDone?'done':!unlocked?'locked':'current')+'" onclick="'+(unlocked?'openLesson('+i+')':'toast(\'Сначала предыдущий\',\'warning\')')+'"><div class="lesson-num">'+(isDone?'✓':(i+1))+'</div><div class="lesson-title">'+lesson.title+'</div></div>';
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
  var html='<div class="page"><div class="title-xl">'+lesson.title+'</div>';
  html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚 Теория</div><div class="lesson-content">'+formatLesson(lesson.theory||'')+'</div></div>';
  html+='<div class="lesson-section practice"><div class="lesson-section-title">🎯 Практика</div><div class="lesson-content">'+esc(lesson.practice||'')+'</div></div></div>';
  if(!isDone)html+='<button class="btn btn-primary btn-block" onclick="completeLesson()">✓ Изучено</button>';
  else html+='<div class="badge badge-success" style="display:block;text-align:center;padding:12px;">✓ Изучено</div>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
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
  state.levelProgress[key]=true;
  state.xp=(state.xp||0)+25;
  save();haptic('success');toast('✓ +25 XP','success');
  checkAchievements();openLesson(currentLessonIdx);
}
window.openLevel=openLevel;
window.openModule=openModule;
window.openLesson=openLesson;
window.completeLesson=completeLesson;

/* ============ GENERIC COURSE RENDERER ============ */
function getCourseProgress(course,progressKey){
  var total=0,done=0;
  course.modules.forEach(function(mod,mi){
    mod.lessons.forEach(function(l,li){
      total++;
      var key=course.id+'_'+mod.id+'_'+li;
      if(state[progressKey]&&state[progressKey][key])done++;
    });
  });
  return{done:done,total:total,pct:total>0?Math.round(done/total*100):0};
}
function renderCourse(course,progressKey){
  var p=getCourseProgress(course,progressKey);
  var html='<div class="page">';
  html+='<div style="text-align:center;margin-bottom:20px;"><div style="font-size:56px;">'+course.emoji+'</div><div class="title-xl">'+course.title+'</div><div class="footnote text-secondary">'+course.subtitle+'</div></div>';
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:12px;">Прогресс</div><div style="font-size:40px;font-weight:800;">'+p.pct+'%</div><div style="opacity:.9;font-size:12px;margin-top:6px;">'+p.done+'/'+p.total+'</div></div>';
  course.modules.forEach(function(mod,mi){
    var modDone=mod.lessons.every(function(l,li){return state[progressKey]&&state[progressKey][course.id+'_'+mod.id+'_'+li]});
    html+='<div class="card"><h2>'+mod.emoji+' '+mod.title+(modDone?' ✓':'')+'</h2><div class="footnote text-secondary mb-3">'+mod.desc+'</div>';
    mod.lessons.forEach(function(lesson,li){
      var key=course.id+'_'+mod.id+'_'+li;
      var isDone=state[progressKey]&&state[progressKey][key];
      html+='<div class="lesson-row '+(isDone?'done':'')+'" onclick="openCourseLesson(\''+course.id+'\','+mi+','+li+')"><div class="lesson-num">'+(isDone?'✓':(li+1))+'</div><div class="lesson-title">'+lesson.title+'</div></div>';
    });
    html+='</div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openCourseLesson(courseId,mi,li){
  var course=(window.ALL_NEW_COURSES||[]).find(function(c){return c.id===courseId});if(!course)return;
  var mod=course.modules[mi];var lesson=mod.lessons[li];if(!lesson)return;
  var progressKey=courseId+'Progress';
  var key=courseId+'_'+mod.id+'_'+li;
  var isDone=state[progressKey]&&state[progressKey][key];
  var html='<div class="page"><div class="footnote text-tertiary mb-2">'+course.title+' · '+mod.title+'</div>';
  html+='<div class="title-xl">'+lesson.title+'</div>';
  html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚 Теория</div><div class="lesson-content">'+formatLesson(lesson.theory||'')+'</div></div>';
  html+='<div class="lesson-section practice"><div class="lesson-section-title">🎯 Практика</div><div class="lesson-content">'+esc(lesson.practice||'')+'</div></div></div>';
  if(!isDone)html+='<button class="btn btn-primary btn-block" onclick="completeCourseLesson(\''+courseId+'\',\''+mod.id+'\','+li+')">✓ Изучено</button>';
  else html+='<div class="badge badge-success" style="display:block;text-align:center;padding:12px;">✓ Изучено</div>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function completeCourseLesson(courseId,modId,li){
  var progressKey=courseId+'Progress';
  if(!state[progressKey])state[progressKey]={};
  state[progressKey][courseId+'_'+modId+'_'+li]=true;
  state.xp=(state.xp||0)+20;
  save();haptic('success');toast('✓ +20 XP','success');
  checkAchievements();navigate(courseId);
}
window.openCourseLesson=openCourseLesson;
window.completeCourseLesson=completeCourseLesson;

function renderCourseIT(){renderCourse(window.COURSE_IT,'itProgress')}
function renderCourseLaw(){renderCourse(window.COURSE_LAW,'lawProgress')}
function renderCourseMed(){renderCourse(window.COURSE_MED,'medProgress')}
function renderCourseFinance(){renderCourse(window.COURSE_FINANCE,'financeCourseProgress')}
function renderCoursePsychDeep(){renderCourse(window.COURSE_PSYCH_DEEP,'psychDeepProgress')}
function renderCourseLang(){renderCourse(window.COURSE_LANGUAGES,'languagesProgress')}
function renderCourseDesign(){renderCourse(window.COURSE_DESIGN,'designProgress')}
function renderCourseCooking(){renderCourse(window.COURSE_COOKING,'cookingProgress')}
function renderCourseSport(){renderCourse(window.COURSE_SPORT,'sportCourseProgress')}
function renderCourseMusic(){renderCourse(window.COURSE_MUSIC,'musicProgress')}
function renderCourseHistory(){renderCourse(window.COURSE_HISTORY,'historyProgress')}
function renderCourseAstro(){renderCourse(window.COURSE_ASTRO,'astroProgress')}

/* ============ SKILLS / METHODS / ENGLISH ============ */
function renderSkills(){
  var cats=window.SKILLS_CATEGORIES||[];
  var lib=window.SKILLS_LIBRARY||[];
  var filtered=skillsFilter==='all'?lib:lib.filter(function(s){return s.cat===skillsFilter});
  var html='<div class="page"><div class="title-xl">💎 Навыки</div>';
  html+='<div class="quick-tabs"><button class="quick-tab '+(skillsFilter==='all'?'active':'')+'" onclick="skillsFilter=\'all\';renderSkills()">Все ('+lib.length+')</button>';
  cats.forEach(function(c){html+='<button class="quick-tab '+(skillsFilter===c.id?'active':'')+'" onclick="skillsFilter=\''+c.id+'\';renderSkills()">'+c.emoji+' '+c.name+'</button>'});
  html+='</div>';
  filtered.forEach(function(s){
    var isDone=state.skillsProgress&&state.skillsProgress[s.id];
    html+='<div class="method-card" onclick="openSkill(\''+s.id+'\')"><div class="method-header"><div class="method-emoji">'+s.emoji+'</div><div style="flex:1;"><div class="method-title">'+s.title+'</div><div class="method-cat">'+s.level+'</div></div>'+(isDone?'<span class="badge badge-success">✓</span>':'<div class="list-chevron">›</div>')+'</div><div class="method-desc">'+esc(s.desc)+'</div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openSkill(id){
  var s=(window.SKILLS_LIBRARY||[]).find(function(x){return x.id===id});if(!s)return;
  var isDone=state.skillsProgress&&state.skillsProgress[s.id];
  var html='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:48px;">'+s.emoji+'</div><div style="font-size:20px;font-weight:800;">'+s.title+'</div></div>';
  html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚 Теория</div><div class="lesson-content">'+formatLesson(s.theory||'')+'</div></div></div>';
  if(s.practice)html+='<div class="card"><div class="lesson-section practice"><div class="lesson-section-title">🎯 Практика</div><div class="lesson-content"><ul>'+s.practice.map(function(p){return '<li>'+esc(p)+'</li>'}).join('')+'</ul></div></div></div>';
  if(!isDone)html+='<button class="btn btn-primary btn-block mt-3" onclick="completeSkill(\''+s.id+'\')">✓ Изучено</button>';
  openSheet(s.title,html);
}
function completeSkill(id){
  state.skillsProgress[id]=true;state.xp=(state.xp||0)+20;
  save();toast('✓ +20 XP','success');closeSheet();renderSkills();
}
window.openSkill=openSkill;
window.completeSkill=completeSkill;

function renderMethods(){
  var html='<div class="page"><div class="title-xl">🎯 Методики</div>';
  (window.METHODS_LIBRARY||[]).forEach(function(m){
    html+='<div class="method-card" onclick="openMethod(\''+m.id+'\')"><div class="method-header"><div class="method-emoji">'+m.emoji+'</div><div style="flex:1;"><div class="method-title">'+m.title+'</div><div class="method-cat">'+m.category+'</div></div></div><div class="method-desc">'+m.desc+'</div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openMethod(id){
  var m=(window.METHODS_LIBRARY||[]).find(function(x){return x.id===id});if(!m)return;
  var html='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:48px;">'+m.emoji+'</div><div style="font-size:20px;font-weight:800;">'+m.title+'</div></div>';
  html+='<div class="card"><div class="lesson-section practice"><div class="lesson-section-title">📋 Шаги</div><div class="lesson-content"><ul>'+m.steps.map(function(s){return '<li>'+esc(s)+'</li>'}).join('')+'</ul></div></div></div>';
  if(m.base)html+='<div class="insight-card"><div class="insight-title">🔬 База</div><div class="insight-text">'+m.base+'</div></div>';
  openSheet(m.title,html);
}
window.openMethod=openMethod;

function renderEnglish(){
  var all=window.ENGLISH_125||[];
  var totalDone=0;all.forEach(function(l){if(state.englishProgress&&state.englishProgress[l.id])totalDone++});
  var html='<div class="page"><div class="title-xl">🇬🇧 English</div>';
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:12px;">Прогресс</div><div style="font-size:40px;font-weight:800;">'+totalDone+'/'+all.length+'</div></div>';
  ['A1','A2','B1','B2','C1'].forEach(function(lvl){
    var lessons=all.filter(function(l){return l.level===lvl});
    var done=lessons.filter(function(l){return state.englishProgress&&state.englishProgress[l.id]}).length;
    var pct=lessons.length?Math.round(done/lessons.length*100):0;
    html+='<div class="level-card'+(pct===100?' completed':'')+'" onclick="openEnglishLvl(\''+lvl+'\')"><div class="level-header"><div class="level-num">'+lvl+'</div><div class="level-info"><div class="level-title">'+lvl+'</div><div class="level-subtitle">'+done+'/'+lessons.length+'</div></div></div><div class="progress"><div class="progress-fill" style="width:'+pct+'%;"></div></div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openEnglishLvl(lvl){
  var all=window.ENGLISH_125||[];
  var lessons=all.filter(function(l){return l.level===lvl});
  var html='<div class="page"><div class="title-xl">'+lvl+'</div><div class="card">';
  lessons.forEach(function(lesson,i){
    var isDone=state.englishProgress&&state.englishProgress[lesson.id];
    html+='<div class="lesson-row '+(isDone?'done':'')+'" onclick="openEnglishLess(\''+lesson.id+'\')"><div class="lesson-num">'+(isDone?'✓':(i+1))+'</div><div class="lesson-title">'+lesson.title+'</div></div>';
  });
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
function openEnglishLess(id){
  var lesson=(window.ENGLISH_125||[]).find(function(l){return l.id===id});if(!lesson)return;
  var isDone=state.englishProgress&&state.englishProgress[id];
  var html='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:40px;">🇬🇧</div><div style="font-size:20px;font-weight:800;">'+lesson.title+'</div></div>';
  html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚 Теория</div><div class="lesson-content">'+formatLesson(lesson.theory||'')+'</div></div></div>';
  html+='<div class="card"><div class="lesson-section practice"><div class="lesson-section-title">🎯 Практика</div><div class="lesson-content">'+esc(lesson.practice||'')+'</div></div></div>';
  if(!isDone)html+='<button class="btn btn-primary btn-block mt-3" onclick="completeEnglishLess(\''+id+'\')">✓ Изучено</button>';
  openSheet(lesson.title,html);
}
function completeEnglishLess(id){
  state.englishProgress[id]=true;state.xp=(state.xp||0)+15;
  save();toast('✓ +15 XP','success');closeSheet();renderEnglish();
}
window.openEnglishLvl=openEnglishLvl;
window.openEnglishLess=openEnglishLess;
window.completeEnglishLess=completeEnglishLess;

/* ============ MEMORY / IQ / EQ / FINANCE / NEURO ============ */
var MEMORY_TECHNIQUES=[
{id:'mem_palace',emoji:'🏛',title:'Дворец памяти',desc:'Метод локусов',theory:'**Привяжи образы к знакомому месту.** 10 локусов = 10 объектов.',practice:['Выбери дом','10 точек','Размести образы','Пройди 3×']},
{id:'mem_chunking',emoji:'🧩',title:'Chunking',desc:'Разбивка',theory:'**7±2 — предел рабочей памяти.**',practice:['Разбей на блоки','Запомни','Проверь']},
{id:'mem_spacing',emoji:'📅',title:'Интервальное',desc:'Spaced',theory:'**Забываем 58% за 20 мин.** Повторяй 1д/3д/7д.',practice:['Anki','20 мин/день']},
{id:'mem_active',emoji:'🔄',title:'Recall > Recognition',desc:'Активное',theory:'**Вспомни сам — ×3 эффективнее.**',practice:['Закрой книгу','Расскажи','Проверь']}
];
function renderMemory(){
  var html='<div class="page"><div class="title-xl">🧠 Память</div>';
  MEMORY_TECHNIQUES.forEach(function(m){
    var isDone=state.memoryProgress&&state.memoryProgress[m.id];
    html+='<div class="method-card" onclick="openMemoryTechnique(\''+m.id+'\')"><div class="method-header"><div class="method-emoji">'+m.emoji+'</div><div style="flex:1;"><div class="method-title">'+m.title+'</div><div class="method-cat">'+m.desc+'</div></div>'+(isDone?'<span class="badge badge-success">✓</span>':'<div class="list-chevron">›</div>')+'</div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openMemoryTechnique(id){
  var m=MEMORY_TECHNIQUES.find(function(x){return x.id===id});if(!m)return;
  var isDone=state.memoryProgress&&state.memoryProgress[id];
  var html='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:48px;">'+m.emoji+'</div><div style="font-size:20px;font-weight:800;">'+m.title+'</div></div>';
  html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚 Теория</div><div class="lesson-content">'+formatLesson(m.theory)+'</div></div></div>';
  html+='<div class="card"><div class="lesson-section practice"><div class="lesson-section-title">🎯 Практика</div><div class="lesson-content"><ul>'+m.practice.map(function(p){return '<li>'+esc(p)+'</li>'}).join('')+'</ul></div></div></div>';
  if(!isDone)html+='<button class="btn btn-primary btn-block mt-3" onclick="completeMemory(\''+m.id+'\')">✓ Изучено</button>';
  openSheet(m.title,html);
}
function completeMemory(id){
  if(!state.memoryProgress)state.memoryProgress={};
  state.memoryProgress[id]=true;state.xp=(state.xp||0)+15;
  save();toast('✓ +15 XP','success');closeSheet();renderMemory();
}
window.openMemoryTechnique=openMemoryTechnique;
window.completeMemory=completeMemory;

function renderIQ(){renderGenericModule('IQ','🎯','iqProgress')}
function renderEQ(){renderGenericModule('EQ','❤️','eqProgress')}
function renderFinance(){renderGenericModule('Финансы','💰','financeProgress')}
function renderNeuro(){renderGenericModule('Нейро','🔬','neuroProgress')}
function renderGenericModule(name,emoji,progressKey){
  progressKey=progressKey||'genericProgress';
  if(!state[progressKey])state[progressKey]={};
  var lessons=[
    {id:'l1',title:'Что это',theory:'**'+name+' — ключевой навык.** Изучи основы.',practice:'Практикуй 15 мин/день.'},
    {id:'l2',title:'Основные принципы',theory:'**Три принципа.** Изучи и применяй.',practice:'Разбери 3 принципа.'},
    {id:'l3',title:'Практика',theory:'**Только практика закрепляет.**',practice:'Практикуй ежедневно.'},
    {id:'l4',title:'Продвинутые техники',theory:'**Продвинутые методы.**',practice:'Применяй 3 техники.'},
    {id:'l5',title:'Интеграция',theory:'**Встрой в жизнь.**',practice:'Составь план.'}
  ];
  var html='<div class="page"><div class="title-xl">'+emoji+' '+name+'</div>';
  var done=Object.keys(state[progressKey]).length;
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:12px;">Прогресс</div><div style="font-size:40px;font-weight:800;">'+done+'/'+lessons.length+'</div></div>';
  html+='<div class="card">';
  lessons.forEach(function(l,i){
    var isDone=state[progressKey][l.id];
    html+='<div class="lesson-row '+(isDone?'done':'')+'" onclick="openGenericLesson(\''+name+'\',\''+emoji+'\',\''+progressKey+'\',\''+l.id+'\')"><div class="lesson-num">'+(isDone?'✓':(i+1))+'</div><div class="lesson-title">'+l.title+'</div></div>';
  });
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
function openGenericLesson(name,emoji,progressKey,id){
  var lessons=[
    {id:'l1',title:'Что это',theory:'**'+name+' — ключевой навык.** Изучи основы.',practice:'Практикуй 15 мин/день.'},
    {id:'l2',title:'Основные принципы',theory:'**Три принципа.** Изучи и применяй.',practice:'Разбери 3 принципа.'},
    {id:'l3',title:'Практика',theory:'**Только практика закрепляет.**',practice:'Практикуй ежедневно.'},
    {id:'l4',title:'Продвинутые техники',theory:'**Продвинутые методы.**',practice:'Применяй 3 техники.'},
    {id:'l5',title:'Интеграция',theory:'**Встрой в жизнь.**',practice:'Составь план.'}
  ];
  var l=lessons.find(function(x){return x.id===id});if(!l)return;
  var isDone=state[progressKey]&&state[progressKey][id];
  var html='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:48px;">'+emoji+'</div><div style="font-size:20px;font-weight:800;">'+l.title+'</div></div>';
  html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚 Теория</div><div class="lesson-content">'+formatLesson(l.theory)+'</div></div></div>';
  html+='<div class="card"><div class="lesson-section practice"><div class="lesson-section-title">🎯 Практика</div><div class="lesson-content">'+esc(l.practice)+'</div></div></div>';
  if(!isDone)html+='<button class="btn btn-primary btn-block mt-3" onclick="completeGenericLesson(\''+progressKey+'\',\''+id+'\',\''+name+'\',\''+emoji+'\')">✓ Изучено</button>';
  openSheet(l.title,html);
}
function completeGenericLesson(progressKey,id,name,emoji){
  if(!state[progressKey])state[progressKey]={};
  state[progressKey][id]=true;state.xp=(state.xp||0)+15;
  save();toast('✓ +15 XP','success');closeSheet();
  renderGenericModule(name,emoji,progressKey);
}
window.openGenericLesson=openGenericLesson;
window.completeGenericLesson=completeGenericLesson;

/* ============ PSYCHOLOGY ============ */
function renderPsychology(){
  var topics=window.PSYCHOLOGY_TOPICS||[];
  var cats={};
  topics.forEach(function(t){if(!cats[t.cat])cats[t.cat]=[];cats[t.cat].push(t)});
  var done=Object.keys(state.psychologyProgress||{}).length;
  var html='<div class="page"><div class="title-xl">🧠 Психология</div>';
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:12px;">Прогресс</div><div style="font-size:40px;font-weight:800;">'+done+'/'+topics.length+'</div></div>';
  Object.keys(cats).forEach(function(cat){
    html+='<div class="card"><h2>'+cat+' ('+cats[cat].length+')</h2>';
    cats[cat].forEach(function(t){
      var isDone=state.psychologyProgress&&state.psychologyProgress[t.id];
      html+='<div class="method-card" onclick="openPsychologyTopic(\''+t.id+'\')"><div class="method-header"><div class="method-emoji">'+t.emoji+'</div><div style="flex:1;"><div class="method-title">'+t.title+'</div></div>'+(isDone?'<span class="badge badge-success">✓</span>':'<div class="list-chevron">›</div>')+'</div></div>';
    });
    html+='</div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openPsychologyTopic(id){
  var t=(window.PSYCHOLOGY_TOPICS||[]).find(function(x){return x.id===id});if(!t)return;
  var isDone=state.psychologyProgress&&state.psychologyProgress[id];
  var html='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:48px;">'+t.emoji+'</div><div style="font-size:20px;font-weight:800;">'+t.title+'</div><div class="footnote text-secondary">'+t.cat+'</div></div>';
  html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚 Теория</div><div class="lesson-content">'+formatLesson(t.theory)+'</div></div></div>';
  if(t.science)html+='<div class="card"><div class="lesson-section science"><div class="lesson-section-title">🔬 Наука</div><div class="lesson-content">'+formatLesson(t.science)+'</div></div></div>';
  if(t.practice)html+='<div class="card"><div class="lesson-section practice"><div class="lesson-section-title">🎯 Практика</div><div class="lesson-content"><ul>'+t.practice.map(function(p){return '<li>'+esc(p)+'</li>'}).join('')+'</ul></div></div></div>';
  if(t.effect)html+='<div class="insight-card"><div class="insight-title">💎 Эффект</div><div class="insight-text">'+esc(t.effect)+'</div></div>';
  if(t.tips)html+='<div class="insight-card"><div class="insight-title">💡 Совет</div><div class="insight-text">'+esc(t.tips)+'</div></div>';
  if(t.test&&t.test.length)html+=renderQuiz(t.test);
  if(!isDone)html+='<button class="btn btn-primary btn-block mt-3" onclick="completePsychology(\''+t.id+'\')">✓ Изучено</button>';
  openSheet(t.title,html);
}
function completePsychology(id){
  if(!state.psychologyProgress)state.psychologyProgress={};
  state.psychologyProgress[id]=true;state.xp=(state.xp||0)+15;
  save();toast('✓ +15 XP','success');closeSheet();renderPsychology();
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
  if(correct){btn.style.background='rgba(61,220,151,.3)';btn.style.borderColor='var(--success)'}
  else{btn.style.background='rgba(255,107,107,.3)';btn.style.borderColor='var(--danger)'}
  btn.disabled=true;
}
window.checkAnswer=checkAnswer;
window.openPsychologyTopic=openPsychologyTopic;
window.completePsychology=completePsychology;

/* ============ THINKING ============ */
function renderThinking(){
  var topics=window.THINKING_TOPICS||[];
  var cats={};
  topics.forEach(function(t){if(!cats[t.cat])cats[t.cat]=[];cats[t.cat].push(t)});
  var done=Object.keys(state.thinkingProgress||{}).length;
  var html='<div class="page"><div class="title-xl">💡 Мышление</div>';
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:12px;">Прогресс</div><div style="font-size:40px;font-weight:800;">'+done+'/'+topics.length+'</div></div>';
  Object.keys(cats).forEach(function(cat){
    html+='<div class="card"><h2>'+cat+' ('+cats[cat].length+')</h2>';
    cats[cat].forEach(function(t){
      var isDone=state.thinkingProgress&&state.thinkingProgress[t.id];
      html+='<div class="method-card" onclick="openThinkingTopic(\''+t.id+'\')"><div class="method-header"><div class="method-emoji">'+t.emoji+'</div><div style="flex:1;"><div class="method-title">'+t.title+'</div></div>'+(isDone?'<span class="badge badge-success">✓</span>':'<div class="list-chevron">›</div>')+'</div></div>';
    });
    html+='</div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openThinkingTopic(id){
  var t=(window.THINKING_TOPICS||[]).find(function(x){return x.id===id});if(!t)return;
  var isDone=state.thinkingProgress&&state.thinkingProgress[id];
  var html='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:48px;">'+t.emoji+'</div><div style="font-size:20px;font-weight:800;">'+t.title+'</div></div>';
  html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚 Теория</div><div class="lesson-content">'+formatLesson(t.theory)+'</div></div></div>';
  if(t.science)html+='<div class="card"><div class="lesson-section science"><div class="lesson-section-title">🔬 Наука</div><div class="lesson-content">'+formatLesson(t.science)+'</div></div></div>';
  if(t.practice)html+='<div class="card"><div class="lesson-section practice"><div class="lesson-section-title">🎯 Практика</div><div class="lesson-content"><ul>'+t.practice.map(function(p){return '<li>'+esc(p)+'</li>'}).join('')+'</ul></div></div></div>';
  if(!isDone)html+='<button class="btn btn-primary btn-block mt-3" onclick="completeThinking(\''+t.id+'\')">✓ Изучено</button>';
  openSheet(t.title,html);
}
function completeThinking(id){
  if(!state.thinkingProgress)state.thinkingProgress={};
  state.thinkingProgress[id]=true;state.xp=(state.xp||0)+15;
  save();toast('✓ +15 XP','success');closeSheet();renderThinking();
}
window.openThinkingTopic=openThinkingTopic;
window.completeThinking=completeThinking;

/* ============ ETIQUETTE ============ */
function renderEtiquette(){
  var topics=window.ETIQUETTE_TOPICS||[];
  var cats={};
  topics.forEach(function(t){if(!cats[t.cat])cats[t.cat]=[];cats[t.cat].push(t)});
  var done=Object.keys(state.etiquetteProgress||{}).length;
  var html='<div class="page"><div class="title-xl">🎩 Этикет</div>';
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:12px;">Прогресс</div><div style="font-size:40px;font-weight:800;">'+done+'/'+topics.length+'</div></div>';
  Object.keys(cats).forEach(function(cat){
    html+='<div class="card"><h2>'+cat+' ('+cats[cat].length+')</h2>';
    cats[cat].forEach(function(t){
      var isDone=state.etiquetteProgress&&state.etiquetteProgress[t.id];
      html+='<div class="method-card" onclick="openEtiquetteTopic(\''+t.id+'\')"><div class="method-header"><div class="method-emoji">'+t.emoji+'</div><div style="flex:1;"><div class="method-title">'+t.title+'</div></div>'+(isDone?'<span class="badge badge-success">✓</span>':'<div class="list-chevron">›</div>')+'</div></div>';
    });
    html+='</div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openEtiquetteTopic(id){
  var t=(window.ETIQUETTE_TOPICS||[]).find(function(x){return x.id===id});if(!t)return;
  var isDone=state.etiquetteProgress&&state.etiquetteProgress[id];
  var html='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:48px;">'+t.emoji+'</div><div style="font-size:20px;font-weight:800;">'+t.title+'</div></div>';
  html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚 Теория</div><div class="lesson-content">'+formatLesson(t.theory)+'</div></div></div>';
  if(t.science)html+='<div class="card"><div class="lesson-section science"><div class="lesson-section-title">🔬 Наука</div><div class="lesson-content">'+formatLesson(t.science)+'</div></div></div>';
  if(t.practice)html+='<div class="card"><div class="lesson-section practice"><div class="lesson-section-title">🎯 Практика</div><div class="lesson-content"><ul>'+t.practice.map(function(p){return '<li>'+esc(p)+'</li>'}).join('')+'</ul></div></div></div>';
  if(t.test&&t.test.length)html+=renderQuiz(t.test);
  if(!isDone)html+='<button class="btn btn-primary btn-block mt-3" onclick="completeEtiquette(\''+t.id+'\')">✓ Изучено</button>';
  openSheet(t.title,html);
}
function completeEtiquette(id){
  if(!state.etiquetteProgress)state.etiquetteProgress={};
  state.etiquetteProgress[id]=true;state.xp=(state.xp||0)+10;
  save();toast('✓ +10 XP','success');closeSheet();renderEtiquette();
}
window.openEtiquetteTopic=openEtiquetteTopic;
window.completeEtiquette=completeEtiquette;

/* ============ HORMONES ============ */
function renderHormones(){
  var hormones=window.HORMONES||[];
  var done=Object.keys(state.hormonesProgress||{}).length;
  var html='<div class="page"><div class="title-xl">🧬 Гормоны</div>';
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:12px;">Прогресс</div><div style="font-size:40px;font-weight:800;">'+done+'/'+hormones.length+'</div></div>';
  hormones.forEach(function(h){
    var isDone=state.hormonesProgress&&state.hormonesProgress[h.id];
    html+='<div class="method-card" onclick="openHormone(\''+h.id+'\')"><div class="method-header"><div class="method-emoji">'+h.emoji+'</div><div style="flex:1;"><div class="method-title">'+h.name+'</div><div class="method-cat">'+h.role+'</div></div>'+(isDone?'<span class="badge badge-success">✓</span>':'<div class="list-chevron">›</div>')+'</div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openHormone(id){
  var h=(window.HORMONES||[]).find(function(x){return x.id===id});if(!h)return;
  var isDone=state.hormonesProgress&&state.hormonesProgress[id];
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
  if(!isDone)html+='<button class="btn btn-primary btn-block mt-3" onclick="completeHormone(\''+h.id+'\')">✓ Изучено</button>';
  openSheet(h.name,html);
}
function completeHormone(id){
  if(!state.hormonesProgress)state.hormonesProgress={};
  state.hormonesProgress[id]=true;state.xp=(state.xp||0)+20;
  save();toast('✓ +20 XP','success');closeSheet();renderHormones();
}
window.openHormone=openHormone;
window.completeHormone=completeHormone;

/* ============ WEALTH ============ */
function renderWealth(){
  var modules=window.WEALTH_MODULES||[];
  var done=Object.keys(state.wealthProgress||{}).length;
  var html='<div class="page"><div class="title-xl">💰 Богатство</div>';
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:12px;">Прогресс</div><div style="font-size:40px;font-weight:800;">'+done+'/'+modules.length+'</div></div>';
  modules.forEach(function(m){
    var isDone=state.wealthProgress&&state.wealthProgress[m.id];
    html+='<div class="method-card" onclick="openWealthModule(\''+m.id+'\')"><div class="method-header"><div class="method-emoji">'+m.emoji+'</div><div style="flex:1;"><div class="method-title">'+m.title+'</div></div>'+(isDone?'<span class="badge badge-success">✓</span>':'<div class="list-chevron">›</div>')+'</div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openWealthModule(id){
  var m=(window.WEALTH_MODULES||[]).find(function(x){return x.id===id});if(!m)return;
  var isDone=state.wealthProgress&&state.wealthProgress[id];
  var html='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:48px;">'+m.emoji+'</div><div style="font-size:20px;font-weight:800;">'+m.title+'</div></div>';
  html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚 Теория</div><div class="lesson-content">'+formatLesson(m.theory)+'</div></div></div>';
  if(m.science)html+='<div class="card"><div class="lesson-section science"><div class="lesson-section-title">🔬 Наука</div><div class="lesson-content">'+formatLesson(m.science)+'</div></div></div>';
  if(m.practice)html+='<div class="card"><div class="lesson-section practice"><div class="lesson-section-title">🎯 Практика</div><div class="lesson-content"><ul>'+m.practice.map(function(p){return '<li>'+esc(p)+'</li>'}).join('')+'</ul></div></div></div>';
  if(!isDone)html+='<button class="btn btn-primary btn-block mt-3" onclick="completeWealth(\''+m.id+'\')">✓ Изучено</button>';
  openSheet(m.title,html);
}
function completeWealth(id){
  if(!state.wealthProgress)state.wealthProgress={};
  state.wealthProgress[id]=true;state.xp=(state.xp||0)+15;
  save();toast('✓ +15 XP','success');closeSheet();renderWealth();
}
window.openWealthModule=openWealthModule;
window.completeWealth=completeWealth;

/* ============ VISION ============ */
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
    html+='<div class="method-card" onclick="startEyeExercise(\''+e.id+'\')"><div class="method-header"><div class="method-emoji">'+e.emoji+'</div><div style="flex:1;"><div class="method-title">'+e.title+'</div><div class="method-cat">'+e.duration+'</div></div><div class="list-chevron">▶</div></div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderVision60(){
  var ex=window.VISION_EXERCISES||[];
  var filters=[
    {id:'all',label:'Все',emoji:'📋',count:ex.length},
    {id:'small',label:'Мал',emoji:'🟢',count:ex.filter(function(e){return e.effect==='small'}).length},
    {id:'medium',label:'Сред',emoji:'🟡',count:ex.filter(function(e){return e.effect==='medium'}).length},
    {id:'hard',label:'Слож',emoji:'🟠',count:ex.filter(function(e){return e.effect==='hard'}).length},
    {id:'max',label:'Макс',emoji:'🔴',count:ex.filter(function(e){return e.effect==='max'}).length}
  ];
  var html='<div class="page"><div class="title-xl">👁 75 упражнений</div>';
  html+='<div class="quick-tabs">';
  filters.forEach(function(f){html+='<button class="quick-tab '+(v2Filter===f.id?'active':'')+'" onclick="v2Filter=\''+f.id+'\';renderVision60()">'+f.emoji+' '+f.label+' ('+f.count+')</button>'});
  html+='</div>';
  var list=v2Filter==='all'?ex:ex.filter(function(e){return e.effect===v2Filter});
  list.forEach(function(e){
    var color=e.effect==='small'?'#3ddc97':e.effect==='medium'?'#ffcc4d':e.effect==='hard'?'#ffa940':'#ff6b6b';
    html+='<div class="method-card" onclick="startEyeExercise(\''+e.id+'\')"><div class="method-header"><div class="method-emoji">'+e.emoji+'</div><div style="flex:1;"><div class="method-title">'+e.title+'</div><div class="method-cat" style="color:'+color+';">'+e.duration+'</div></div><div class="list-chevron">▶</div></div><div class="method-desc">'+esc(e.desc)+'</div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function startEyeExercise(id){
  var ex=(window.VISION_EXERCISES||[]).find(function(x){return x.id===id});if(!ex)return;
  currentVisionExercise=ex;
  var html='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:56px;">'+ex.emoji+'</div><div style="font-size:22px;font-weight:800;">'+ex.title+'</div><div class="footnote text-secondary">'+ex.duration+'</div></div>';
  html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📋 Описание</div><div class="lesson-content">'+esc(ex.desc)+'</div></div></div>';
  html+='<div class="card"><div class="lesson-section practice"><div class="lesson-section-title">🎯 Как делать</div><div class="lesson-content">'+esc(ex.how)+'</div></div></div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="completeEyeExercise()">✓ Выполнено (+10 XP)</button>';
  openSheet(ex.title,html);
}
function completeEyeExercise(){
  if(!currentVisionExercise)return;
  state.eyeExercises.push({id:uid(),exerciseId:currentVisionExercise.id,date:today(),time:nowISO()});
  state.xp=(state.xp||0)+10;
  save();haptic('success');toast('✓ +10 XP','success');
  checkAchievements();closeSheet();currentVisionExercise=null;
  navigate(currentPage);
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
  var html='<div class="page"><div class="title-xl">💡 Советы</div>';
  html+='<div class="card"><h2>20-20-20</h2><div class="footnote text-secondary">Каждые 20 мин смотри 20 сек на 6 метров</div></div>';
  html+='<div class="card"><h2>Пальминг</h2><div class="footnote text-secondary">5 мин тепла для глаз</div></div>';
  html+='<div class="card"><h2>Моргание</h2><div class="footnote text-secondary">Моргай каждые 10 мин</div></div>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
window.startEyeExercise=startEyeExercise;
window.completeEyeExercise=completeEyeExercise;
window.renderVision60=renderVision60;

/* ============ RECOVERY ============ */
function renderRecovery(){
  var list=window.RECOVERY_LIBRARY||[];
  var cats={};
  list.forEach(function(r){if(!cats[r.cat])cats[r.cat]=[];cats[r.cat].push(r)});
  var done=Object.keys(state.recoveryProgress||{}).length;
  var html='<div class="page"><div class="title-xl">🌿 Восстановление</div>';
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:12px;">Прогресс</div><div style="font-size:40px;font-weight:800;">'+done+'/'+list.length+'</div></div>';
  Object.keys(cats).forEach(function(cat){
    html+='<div class="card"><h2>'+cat+' ('+cats[cat].length+')</h2>';
    cats[cat].forEach(function(r){
      var isDone=state.recoveryProgress&&state.recoveryProgress[r.id];
      html+='<div class="list-row" onclick="openRecoveryItem(\''+r.id+'\')"><div class="list-icon">'+r.emoji+'</div><div class="list-body"><div class="list-title">'+r.title+'</div><div class="list-subtitle">'+r.time+'</div></div>'+(isDone?'<span class="badge badge-success">✓</span>':'<div class="list-chevron">›</div>')+'</div>';
    });
    html+='</div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openRecoveryItem(id){
  var r=(window.RECOVERY_LIBRARY||[]).find(function(x){return x.id===id});if(!r)return;
  var isDone=state.recoveryProgress&&state.recoveryProgress[id];
  var html='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:48px;">'+r.emoji+'</div><div style="font-size:20px;font-weight:800;">'+r.title+'</div></div>';
  html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📋 Описание</div><div class="lesson-content">'+esc(r.desc)+'</div></div></div>';
  html+='<div class="card"><div class="lesson-section practice"><div class="lesson-section-title">🎯 Как делать</div><div class="lesson-content">'+esc(r.how)+'</div></div></div>';
  if(!isDone)html+='<button class="btn btn-primary btn-block mt-3" onclick="completeRecovery(\''+r.id+'\')">✓ Изучено</button>';
  openSheet(r.title,html);
}
function completeRecovery(id){
  if(!state.recoveryProgress)state.recoveryProgress={};
  state.recoveryProgress[id]=true;state.xp=(state.xp||0)+10;
  save();toast('✓ +10 XP','success');closeSheet();renderRecovery();
}
window.openRecoveryItem=openRecoveryItem;
window.completeRecovery=completeRecovery;

/* ============ DETOX 62 ============ */
function getCurrentDay(){
  var completed=Object.keys(state.detoxCourseProgress||{}).map(Number).filter(function(n){return !isNaN(n)});
  if(!completed.length)return 1;
  return Math.min(62,Math.max.apply(null,completed)+1);
}
function isDayCompleted(day){return !!(state.detoxCourseProgress&&state.detoxCourseProgress[day])}
function getCompletedDaysCount(){return Object.keys(state.detoxCourseProgress||{}).length}
function canOpenDay(day){if(day===1)return true;if(isDayCompleted(day))return true;return isDayCompleted(day-1)}

function renderDetoxCourse(){
  var course=window.DETOX_COURSE||[];
  var currentDay=getCurrentDay();
  var completed=getCompletedDaysCount();
  var pct=Math.round(completed/62*100);
  var html='<div class="page"><div class="title-xl">📚 Детокс-курс 62 дня</div>';
  html+='<div class="detox-progress-hero"><h2>Прогресс</h2><div class="big">'+pct+'%</div><div class="small">'+completed+' из 62 · День '+currentDay+'</div><div class="progress" style="margin-top:12px;background:rgba(255,255,255,.25);height:6px;"><div class="progress-fill" style="width:'+pct+'%;background:#fff;"></div></div></div>';
  if(!course.length){
    html+='<div class="card"><div class="empty"><div class="empty-icon">📭</div><div class="empty-title">Курс не загружен</div></div></div>';
  }else{
    course.forEach(function(d){
      var isDone=isDayCompleted(d.day);
      var isCurrent=d.day===currentDay;
      var canOpen=canOpenDay(d.day);
      var cls='detox-day-card';if(isDone)cls+=' completed';else if(isCurrent)cls+=' current';else if(!canOpen)cls+=' locked';
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
  html+='<div class="footnote text-secondary">'+esc(d.subtitle)+'</div>';
  html+='</div>';
  if(d.theory)html+='<div class="detox-section theory"><div class="detox-section-title">📚 Теория</div><div class="detox-section-content">'+formatLesson(d.theory)+'</div></div>';
  if(d.science)html+='<div class="detox-section science"><div class="detox-section-title">🔬 Наука</div><div class="detox-section-content">'+formatLesson(d.science)+'</div></div>';
  if(d.do&&d.do.length){
    html+='<div class="detox-section do"><div class="detox-section-title">✅ Что делать</div><div class="detox-section-content"><ul>';
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

/* ============ SCREEN TRACKER ============ */
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

  html+='<div class="stat-grid mb-4">';
  html+='<div class="stat-item"><div class="stat-value">'+fmtMinsHM(todayMin)+'</div><div class="stat-label">Сегодня</div></div>';
  html+='<div class="stat-item"><div class="stat-value">'+fmtMinsHM(weekMin)+'</div><div class="stat-label">Неделя</div></div>';
  html+='<div class="stat-item"><div class="stat-value">'+fmtMinsHM(monthMin)+'</div><div class="stat-label">Месяц</div></div>';
  html+='</div>';

  html+='<div class="card"><h2>📊 Средние</h2>';
  html+='<div class="stat-row"><span class="stat-row-label">Среднее за 7 дней</span><span class="stat-row-value">'+fmtMinsHM(avg7)+'</span></div>';
  html+='<div class="stat-row"><span class="stat-row-label">Среднее за 30 дней</span><span class="stat-row-value">'+fmtMinsHM(avg30)+'</span></div>';
  if(bestWorst.best!==null){
    html+='<div class="stat-row"><span class="stat-row-label">Лучший день 🏆</span><span class="stat-row-value">'+fmtMinsHM(bestWorst.best)+'</span></div>';
    html+='<div class="stat-row"><span class="stat-row-label">Худший день ⚠️</span><span class="stat-row-value">'+fmtMinsHM(bestWorst.worst)+'</span></div>';
  }
  html+='</div>';

  html+='<div class="card"><h2>📈 Последние 7 дней</h2>';
  html+='<div style="display:flex;gap:4px;align-items:flex-end;height:140px;padding:10px 0;">';
  last7.forEach(function(d){
    var pct=max7?(d.minutes/max7*100):0;
    var color=d.minutes>300?'var(--danger)':d.minutes>180?'var(--warning)':'var(--success)';
    html+='<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;">';
    html+='<div style="font-size:9px;color:var(--text-3);margin-bottom:4px;">'+(Math.round(d.minutes/60*10)/10)+'ч</div>';
    html+='<div style="width:100%;height:'+Math.max(2,pct)+'%;background:'+color+';border-radius:6px 6px 0 0;min-height:4px;"></div>';
    html+='<div style="font-size:10px;font-weight:700;color:var(--text-2);margin-top:4px;">'+d.day+'</div>';
    html+='</div>';
  });
  html+='</div></div>';

  html+='<button class="btn btn-primary btn-block mb-3" onclick="openScreenAdd()">➕ Добавить время</button>';

  var month30=screenGetLast30Days().filter(function(x){return x.minutes>0}).sort(function(a,b){return b.minutes-a.minutes}).slice(0,5);
  if(month30.length){
    html+='<div class="card"><h2>🏆 Топ-5 дней месяца</h2>';
    month30.forEach(function(d,i){html+='<div class="stat-row"><span class="stat-row-label">'+(i+1)+'. '+d.date+'</span><span class="stat-row-value">'+fmtMinsHM(d.minutes)+'</span></div>'});
    html+='</div>';
  }

  html+='<div class="card" style="background:linear-gradient(135deg,rgba(255,107,107,.15),rgba(255,169,64,.1));"><h2>📚 62-дневный курс</h2><div class="footnote text-secondary mb-3">Пройдено: '+detoxProgress+'/62 дней</div><div class="progress mb-3"><div class="progress-fill" style="width:'+Math.round(detoxProgress/62*100)+'%;"></div></div><button class="btn btn-primary btn-block" onclick="navigate(\'detoxcourse\')">Открыть курс</button></div>';

  var entries=(state.screenEntries||[]).slice(-10).reverse();
  if(entries.length){
    html+='<div class="card"><h2>📋 История ввода</h2>';
    entries.forEach(function(e){html+='<div class="stat-row"><span class="stat-row-label">'+e.date+(e.note?' · '+esc(e.note):'')+'</span><span class="stat-row-value">'+fmtMinsHM(e.minutes)+'</span></div>'});
    html+='</div>';
  }
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openScreenAdd(){
  var html='<div class="field"><label class="field-label">Дата</label><input type="date" id="scr-date" value="'+today()+'"/></div>';
  html+='<div class="field"><label class="field-label">Время за экраном</label><input type="text" id="scr-mins" placeholder="2ч 30мин" autocomplete="off"/></div>';
  html+='<div class="footnote text-tertiary mb-3">Введи в формате: "2ч 30мин" или "2ч" или "150мин" или "2.5"</div>';
  html+='<div class="field"><label class="field-label">Заметка</label><input type="text" id="scr-note" placeholder="соцсети, работа..."/></div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="saveScreenEntry()">💾 Сохранить</button>';
  openSheet('Время за экраном',html);
}
function saveScreenEntry(){
  var date=(document.getElementById('scr-date')||{}).value||today();
  var raw=(document.getElementById('scr-mins')||{}).value||'';
  var note=(document.getElementById('scr-note')||{}).value||'';
  var mins=parseScreenTime(raw);
  if(mins<=0){toast('Введи корректное время','error');return}
  if(!state.screenStats)state.screenStats={};
  state.screenStats[date]=(state.screenStats[date]||0)+mins;
  if(!state.screenEntries)state.screenEntries=[];
  state.screenEntries.push({id:uid(),date:date,minutes:mins,note:note,created_at:nowISO()});
  save();closeSheet();haptic('success');toast('✓ '+fmtMinsHM(mins)+' сохранено','success');
  navigate('screentracker');
}
window.openScreenAdd=openScreenAdd;
window.saveScreenEntry=saveScreenEntry;

/* ============ DAILY SURVEY ============ */
var DAILY_SURVEY_QUESTIONS=[
{id:'sleepHours',question:'Сколько часов ты спал?',type:'number',default:7,hint:'Например: 7.5'},
{id:'sleepQuality',question:'Качество сна?',type:'slider',default:7},
{id:'mood',question:'Настроение вчера?',type:'slider',default:7},
{id:'energy',question:'Сколько было энергии?',type:'slider',default:7},
{id:'stress',question:'Уровень стресса?',type:'slider',default:5},
{id:'screenTime',question:'Сколько времени за экраном?',type:'time',default:'3ч 30мин',hint:'Формат: 2ч 30мин'},
{id:'socialMedia',question:'Из них соцсети?',type:'time',default:'1ч 30мин',hint:'Формат: 1ч 30мин'},
{id:'productiveScreen',question:'Из них полезно (работа/учёба)?',type:'time',default:'1ч 30мин',hint:'Формат: 1ч 30мин'},
{id:'focus',question:'Концентрация?',type:'slider',default:7},
{id:'water',question:'Стаканов воды?',type:'number',default:6},
{id:'workouts',question:'Тренировок?',type:'number',default:0},
{id:'steps',question:'Шагов?',type:'number',default:5000},
{id:'wins',question:'Главная победа?',type:'text',default:''},
{id:'lessons',question:'Что понял?',type:'text',default:''},
{id:'tomorrowGoal',question:'Главная цель на сегодня?',type:'text',default:''}
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
  html+='<div class="card" style="background:linear-gradient(135deg,rgba(91,158,255,.15),rgba(167,139,250,.1));">';
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
    html+='<div class="field"><input type="number" id="dn" value="'+v2+'" step="0.5" oninput="currentDailySurveyAnswers[\''+q.id+'\']=parseFloat(this.value);"/></div>';
    if(q.hint)html+='<div class="footnote text-tertiary mb-3">'+esc(q.hint)+'</div>';
    html+='<button class="btn btn-primary btn-block mt-3" onclick="nextDailySurveyStep()">Далее →</button>';
  }else if(q.type==='time'){
    var v3=answers[q.id]!==undefined?answers[q.id]:q.default;
    html+='<div class="field"><input type="text" id="dt" value="'+esc(v3)+'" placeholder="2ч 30мин" autocomplete="off" oninput="currentDailySurveyAnswers[\''+q.id+'\']=this.value;updateTimePreview(this.value);"/></div>';
    if(q.hint)html+='<div class="footnote text-tertiary" style="margin-bottom:8px;">'+esc(q.hint)+'</div>';
    html+='<div class="footnote text-secondary mb-3">= <strong id="timePreview">'+fmtMinsHM(parseScreenTime(v3))+'</strong></div>';
    html+='<button class="btn btn-primary btn-block mt-3" onclick="nextDailySurveyStep()">Далее →</button>';
  }else if(q.type==='text'){
    html+='<div class="field"><textarea id="dtext" style="min-height:100px;" placeholder="Своими словами..." oninput="currentDailySurveyAnswers[\''+q.id+'\']=this.value;">'+(answers[q.id]||'')+'</textarea></div>';
    html+='<button class="btn btn-primary btn-block mt-3" onclick="nextDailySurveyStep()">Далее →</button>';
  }
  if(step>0)html+='<button class="btn btn-ghost btn-block mt-2" onclick="prevDailySurveyStep()">← Назад</button>';
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
function updateTimePreview(v){
  var el=document.getElementById('timePreview');
  if(el)el.textContent=fmtMinsHM(parseScreenTime(v));
}
window.updateTimePreview=updateTimePreview;
function nextDailySurveyStep(){saveDailySurveyAnswer();currentDailySurveyStep=(currentDailySurveyStep||0)+1;if(currentDailySurveyStep>=DAILY_SURVEY_QUESTIONS.length)finishDailySurvey();else renderDailySurvey()}
function prevDailySurveyStep(){saveDailySurveyAnswer();currentDailySurveyStep=Math.max(0,(currentDailySurveyStep||0)-1);renderDailySurvey()}
function saveDailySurveyAnswer(){
  var q=DAILY_SURVEY_QUESTIONS[currentDailySurveyStep];if(!q)return;
  if(q.type==='number'){var el=document.getElementById('dn');if(el)currentDailySurveyAnswers[q.id]=parseFloat(el.value)}
  else if(q.type==='time'){var el2=document.getElementById('dt');if(el2)currentDailySurveyAnswers[q.id]=el2.value}
  else if(q.type==='text'){var el3=document.getElementById('dtext');if(el3)currentDailySurveyAnswers[q.id]=el3.value}
}
function finishDailySurvey(){
  var answers=currentDailySurveyAnswers||{};
  var y=yesterday();
  if(!state.dailySurveys)state.dailySurveys={};
  state.dailySurveys[y]={answers:answers,filledAt:nowISO()};
  if(answers.sleepHours!=null){if(!state.customSleep)state.customSleep={};state.customSleep[y]=parseFloat(answers.sleepHours)}
  if(answers.mood!=null){if(!state.customMood)state.customMood=[];var ex=state.customMood.find(function(m){return m.date===y});if(ex)ex.score=parseInt(answers.mood);else state.customMood.push({id:uid(),date:y,score:parseInt(answers.mood),created_at:nowISO()})}
  if(answers.water!=null){if(!state.customWater)state.customWater=[];var exW=state.customWater.find(function(w){return w.date===y});if(exW)exW.count=parseInt(answers.water);else state.customWater.push({id:uid(),date:y,count:parseInt(answers.water),created_at:nowISO()})}
  if(answers.workouts!=null&&parseInt(answers.workouts)>0){if(!state.customWorkouts)state.customWorkouts=[];state.customWorkouts.push({id:uid(),title:'Тренировка (из опроса)',duration:60,intensity:7,date:y,created_at:nowISO()})}
  if(answers.screenTime){
    var screenMins=parseScreenTime(answers.screenTime);
    if(screenMins>0){
      if(!state.screenStats)state.screenStats={};
      state.screenStats[y]=screenMins;
      if(!state.screenEntries)state.screenEntries=[];
      state.screenEntries.push({id:uid(),date:y,minutes:screenMins,note:'Из опроса · соцсети: '+(answers.socialMedia||'—')+' · полезно: '+(answers.productiveScreen||'—'),created_at:nowISO()});
    }
  }
  state.todayPlan=buildTodayPlan(answers);
  state.settings.lastDailySurveyDay=today();
  save();haptic('success');toast('✓ План на сегодня готов','success',3500);
  navigate('dashboard');
}
function buildTodayPlan(answers){
  var plan={date:today(),basedOn:answers,items:[],load:100,notes:[]};
  var sleep=parseFloat(answers.sleepHours)||7;
  var mood=parseInt(answers.mood)||7;
  var energy=parseInt(answers.energy)||7;
  var stress=parseInt(answers.stress)||5;
  var screen=parseScreenTime(answers.screenTime)||240;
  var focus=parseInt(answers.focus)||7;
  var water=parseInt(answers.water)||6;
  var workouts=parseInt(answers.workouts)||0;
  if(sleep<6)plan.load-=20;if(sleep<7)plan.load-=10;
  if(mood<5)plan.load-=15;if(energy<5)plan.load-=15;
  if(stress>7)plan.load-=15;if(screen>360)plan.load-=10;
  if(focus<5)plan.load-=10;
  if(sleep>=7&&sleep<=9)plan.load+=5;
  if(mood>=7)plan.load+=5;if(energy>=7)plan.load+=5;
  plan.load=Math.max(30,Math.min(120,plan.load));
  if(screen>300)plan.items.push({time:'утро',title:'Утро без телефона 30 мин',desc:'Снижаем экран ('+fmtMinsHM(screen)+' вчера)',icon:'🌅'});
  if(sleep<7)plan.items.push({time:'вечер',title:'Сон до 23:00',desc:'Только '+sleep+' ч вчера',icon:'😴'});
  if(water<6)plan.items.push({time:'день',title:'8 стаканов воды',desc:'Только '+water+' вчера',icon:'💧'});
  if(mood<6||stress>6)plan.items.push({time:'день',title:'Медитация 10 мин',desc:'Стресс '+stress+'/10',icon:'🧘'});
  if(energy<6)plan.items.push({time:'день',title:'Прогулка 20 мин',desc:'Энергия '+energy+'/10',icon:'🚶'});
  if(focus<6||screen>300)plan.items.push({time:'утро',title:'Deep Work 90 мин',desc:'Одна задача без телефона',icon:'🎯'});
  if(workouts<1)plan.items.push({time:'день',title:'Тренировка 30 мин',desc:'Движение',icon:'🏋️'});
  plan.items.push({time:'день',title:'20-20-20 для глаз',desc:'Каждые 20 мин',icon:'👁'});
  plan.items.push({time:'вечер',title:'Дневник: 3 победы',desc:'Рефлексия',icon:'📓'});
  plan.notes.push('Нагрузка: '+plan.load+'%');
  if(answers.tomorrowGoal)plan.notes.push('Цель дня: '+answers.tomorrowGoal);
  return plan;
}
window.openDailySurvey=openDailySurvey;
window.nextDailySurveyStep=nextDailySurveyStep;
window.prevDailySurveyStep=prevDailySurveyStep;
window.finishDailySurvey=finishDailySurvey;

/* ============ HEALTH ============ */
function renderHealth(){
  var waterEntry=state.customWater.find(function(w){return w.date===today()});
  var water=waterEntry?waterEntry.count:0;
  var waterGoal=state.settings.waterGoal||8;
  var mood=(state.customMood||[]).find(function(m){return m.date===today()});
  var sleep=(state.customSleep&&state.customSleep[today()])||0;
  var html='<div class="page"><div class="title-xl">❤️ Здоровье</div>';
  html+='<div class="card"><div class="stat-grid"><div class="stat-item" onclick="quickMoodLog()" style="cursor:pointer;"><div class="stat-value">'+(mood?mood.score+'/10':'—')+'</div><div class="stat-label">Настроение</div></div><div class="stat-item" onclick="addWater()" style="cursor:pointer;"><div class="stat-value">'+water+'/'+waterGoal+'</div><div class="stat-label">Вода</div></div><div class="stat-item" onclick="openSleepEditor()" style="cursor:pointer;"><div class="stat-value">'+(sleep?sleep+'ч':'—')+'</div><div class="stat-label">Сон</div></div></div></div>';
  html+='<div class="card"><h2>🏥 Медицина</h2><button class="btn btn-primary btn-block" onclick="navigate(\'medical\')">Открыть ИИ-врача</button></div>';
  html+='<div class="card"><h2>Быстрый доступ</h2><div class="group-grid"><div class="group-item" onclick="navigate(\'water\')"><div class="group-item-icon">💧</div><div class="group-item-label">Вода</div></div><div class="group-item" onclick="navigate(\'mood\')"><div class="group-item-icon">💭</div><div class="group-item-label">Настроение</div></div><div class="group-item" onclick="navigate(\'workouts\')"><div class="group-item-icon">🏋️</div><div class="group-item-label">Тренировки</div></div><div class="group-item" onclick="navigate(\'meditation\')"><div class="group-item-icon">🧘</div><div class="group-item-label">Медитации</div></div><div class="group-item" onclick="navigate(\'meds\')"><div class="group-item-icon">💊</div><div class="group-item-label">Лекарства</div></div><div class="group-item" onclick="navigate(\'recovery\')"><div class="group-item-icon">🌿</div><div class="group-item-label">Восстановление</div></div></div></div>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function addWater(){
  var t=today();
  if(!state.customWater)state.customWater=[];
  var entry=state.customWater.find(function(w){return w.date===t});
  if(entry)entry.count++;else state.customWater.push({id:uid(),date:t,count:1,created_at:nowISO()});
  state.stats.totalWater=(state.stats.totalWater||0)+1;
  save();toast('💧 +1','success');haptic('success');navigate(currentPage);
}
function quickMoodLog(){
  var moods=['😢','😔','😐','🙂','😊'];
  var html='<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;">';
  moods.forEach(function(m,i){html+='<button class="btn btn-ghost" style="font-size:32px;padding:20px 0;" onclick="saveMood('+((i+1)*2)+')">'+m+'</button>'});
  html+='</div>';
  openSheet('Настроение?',html);
}
function saveMood(score){
  var t=today();
  if(!state.customMood)state.customMood=[];
  var ex=state.customMood.find(function(m){return m.date===t});
  if(ex)ex.score=score;else state.customMood.push({id:uid(),date:t,score:score,created_at:nowISO()});
  state.stats.totalMoodLogs=(state.stats.totalMoodLogs||0)+1;
  save();closeSheet();toast('Записано','success');navigate(currentPage);
}
function openSleepEditor(){
  var y=yesterday();var t=today();
  var curY=(state.customSleep&&state.customSleep[y])||7;
  var curT=(state.customSleep&&state.customSleep[t])||7;
  var html='<div class="field"><label class="field-label">Сон вчера (ч)</label><input type="number" id="sleepYesterday" value="'+curY+'" step="0.5"/></div>';
  html+='<div class="field"><label class="field-label">Сон сегодня (ч)</label><input type="number" id="sleepToday" value="'+curT+'" step="0.5"/></div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="saveSleep()">💾 Сохранить</button>';
  openSheet('Сон',html);
}
function saveSleep(){
  var y=yesterday();var t=today();
  var vY=parseFloat((document.getElementById('sleepYesterday')||{}).value)||7;
  var vT=parseFloat((document.getElementById('sleepToday')||{}).value)||7;
  if(!state.customSleep)state.customSleep={};
  state.customSleep[y]=vY;state.customSleep[t]=vT;
  save();closeSheet();toast('Сон записан','success');navigate(currentPage);
}
function renderWater(){
  var entry=state.customWater.find(function(w){return w.date===today()});
  var count=entry?entry.count:0;
  var goal=state.settings.waterGoal||8;
  var html='<div class="page"><div class="title-xl">💧 Вода</div>';
  html+='<div class="card card-gradient" style="text-align:center;"><div style="font-size:56px;">💧</div><div style="font-size:40px;font-weight:800;">'+count+'/'+goal+'</div></div>';
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
  if(w.length){w.forEach(function(x){html+='<div class="list-row" onclick="openEntityEditor(\'workout\',\''+x.id+'\')"><div class="list-icon">🏋️</div><div class="list-body"><div class="list-title">'+esc(x.title)+'</div><div class="list-subtitle">'+(x.duration||60)+' мин</div></div></div>'})}
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
  if(m.length){m.forEach(function(x){html+='<div class="list-row" onclick="openEntityEditor(\'med\',\''+x.id+'\')"><div class="list-icon">💊</div><div class="list-body"><div class="list-title">'+esc(x.title)+'</div><div class="list-subtitle">'+esc(x.dosage||'')+'</div></div></div>'})}
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
  if(notes.length){notes.forEach(function(n){html+='<div class="card" onclick="openEntityEditor(\'note\',\''+n.id+'\')" style="cursor:pointer;"><div class="list-title">'+esc(n.title||'—')+'</div></div>'})}
  else{html+='<div class="empty"><div class="empty-icon">📝</div><div class="empty-title">Пусто</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderGoals(){
  var goals=state.customGoals||[];
  var html='<div class="page"><div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">🎯 Цели</div><button class="btn btn-primary btn-sm" onclick="openEntityEditor(\'goal\',null)">+</button></div>';
  if(goals.length){goals.forEach(function(g){html+='<div class="card" onclick="openEntityEditor(\'goal\',\''+g.id+'\')" style="cursor:pointer;"><div class="list-title">'+esc(g.title)+'</div></div>'})}
  else{html+='<div class="empty"><div class="empty-icon">🎯</div><div class="empty-title">Нет целей</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderHabits(){
  var habits=state.customHabits||[];
  var html='<div class="page"><div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">🔄 Привычки</div><button class="btn btn-primary btn-sm" onclick="openEntityEditor(\'habit\',null)">+</button></div>';
  if(habits.length){habits.forEach(function(h){html+='<div class="habit-row" onclick="openEntityEditor(\'habit\',\''+h.id+'\')"><div class="habit-icon">'+(h.icon||'✅')+'</div><div class="habit-body"><div class="habit-title">'+esc(h.title)+'</div></div></div>'})}
  else{html+='<div class="empty"><div class="empty-icon">🔄</div><div class="empty-title">Нет привычек</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}

/* ============ MEDICAL ============ */
var MED_METRICS=[
{id:'bp_sys',name:'Давление сист.',unit:'мм рт.ст.',icon:'💓',normal:[110,130],warn:[90,140],danger:[80,180]},
{id:'bp_dia',name:'Давление диаст.',unit:'мм рт.ст.',icon:'💓',normal:[70,85],warn:[60,90],danger:[50,110]},
{id:'pulse',name:'Пульс',unit:'уд/мин',icon:'❤️',normal:[60,80],warn:[50,100],danger:[40,140]},
{id:'temp',name:'Температура',unit:'°C',icon:'🌡',normal:[36.3,37.0],warn:[35.5,37.5],danger:[35,38.5]},
{id:'weight',name:'Вес',unit:'кг',icon:'⚖️',normal:[0,999],warn:[0,999],danger:[0,999]},
{id:'sugar',name:'Сахар',unit:'ммоль/л',icon:'🩸',normal:[3.9,5.5],warn:[3.3,6.9],danger:[2.8,11]},
{id:'oxygen',name:'Сатурация',unit:'%',icon:'🫁',normal:[95,100],warn:[92,100],danger:[88,100]},
{id:'sleep',name:'Сон',unit:'ч',icon:'😴',normal:[7,9],warn:[6,10],danger:[4,12]},
{id:'steps',name:'Шаги',unit:'шагов',icon:'🚶',normal:[8000,20000],warn:[4000,30000],danger:[0,50000]},
{id:'water',name:'Вода',unit:'мл',icon:'💧',normal:[1500,3000],warn:[1000,4000],danger:[0,6000]}
];
function getMetricStatus(id,value){
  var m=MED_METRICS.find(function(x){return x.id===id});if(!m)return 'unknown';
  if(value>=m.danger[0]&&value<=m.danger[1]){
    if(value>=m.warn[0]&&value<=m.warn[1]){
      if(value>=m.normal[0]&&value<=m.normal[1])return 'normal';
      return 'warn';
    }
    return 'danger';
  }
  return 'danger';
}
function getStatusColor(s){return{normal:'var(--success)',warn:'var(--warning)',danger:'var(--danger)',unknown:'var(--text-3)'}[s]||'var(--text-3)'}
function getStatusLabel(s){return{normal:'Норма',warn:'Внимание',danger:'Опасно',unknown:'—'}[s]||'—'}

function renderMedical(){
  var data=state.medicalData||{metrics:[],entries:[],profile:{},recommendations:[]};
  var html='<div class="page"><div class="title-xl">🏥 Медицина</div>';
  html+='<div class="card card-gradient" style="text-align:center;"><div style="font-size:40px;">⚕️</div><div style="font-size:18px;font-weight:800;margin-top:6px;">ИИ-Врач</div></div>';
  html+='<div class="row mb-3" style="gap:8px;">';
  html+='<button class="btn btn-primary" style="flex:1;" onclick="openMedAddEntry()">➕ Замер</button>';
  html+='<button class="btn btn-ghost" style="flex:1;" onclick="runAIMedicalAnalysis()">✨ Анализ ИИ</button>';
  html+='</div>';
  var hasAny=false;
  html+='<div class="card"><h2>📊 Последние</h2>';
  MED_METRICS.forEach(function(m){
    var entries=data.entries.filter(function(e){return e.metricId===m.id});
    if(entries.length){
      hasAny=true;
      var last=entries[entries.length-1];
      var st=getMetricStatus(m.id,last.value);
      var color=getStatusColor(st);
      html+='<div class="list-row" onclick="openMedMetricDetail(\''+m.id+'\')" style="border-left:3px solid '+color+';"><div class="list-icon">'+m.icon+'</div><div class="list-body"><div class="list-title">'+m.name+'</div><div class="list-subtitle"><span style="color:'+color+';font-weight:700;">'+last.value+' '+m.unit+'</span> · '+getStatusLabel(st)+'</div></div></div>';
    }
  });
  if(!hasAny)html+='<div class="empty"><div class="empty-icon">📋</div><div class="empty-title">Нет данных</div></div>';
  html+='</div>';
  html+='<div class="card" style="background:rgba(255,107,107,.08);"><h2>⚠️ Дисклеймер</h2><div class="footnote text-secondary">Не заменяет врача. Острые — 103/112.</div></div>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openMedAddEntry(){
  var html='<div class="field"><label class="field-label">Что измерить</label><select id="med-metric">';
  MED_METRICS.forEach(function(m){html+='<option value="'+m.id+'">'+m.icon+' '+m.name+'</option>'});
  html+='</select></div>';
  html+='<div class="field"><label class="field-label">Значение</label><input type="number" id="med-value" step="0.1"/></div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="medSaveEntry()">💾 Сохранить</button>';
  openSheet('Новый замер',html);
}
function medSaveEntry(){
  var metricId=(document.getElementById('med-metric')||{}).value;
  var value=parseFloat((document.getElementById('med-value')||{}).value);
  if(isNaN(value)){toast('Введи число','error');return}
  if(!state.medicalData)state.medicalData={metrics:[],entries:[],profile:{},recommendations:[]};
  state.medicalData.entries.push({id:uid(),metricId:metricId,value:value,date:today(),timestamp:nowISO()});
  save();closeSheet();toast('✓ Сохранено','success');renderMedical();
}
function openMedMetricDetail(id){
  var m=MED_METRICS.find(function(x){return x.id===id});if(!m)return;
  var data=state.medicalData||{metrics:[],entries:[],profile:{},recommendations:[]};
  var list=data.entries.filter(function(e){return e.metricId===id}).slice().reverse();
  var html='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:48px;">'+m.icon+'</div><div style="font-size:20px;font-weight:800;">'+m.name+'</div><div class="footnote text-secondary">Норма: '+m.normal[0]+'–'+m.normal[1]+' '+m.unit+'</div></div>';
  html+='<button class="btn btn-primary btn-block" onclick="closeSheet();medQuickAdd(\''+id+'\')">➕ Добавить</button>';
  if(list.length){
    html+='<div class="card" style="margin-top:12px;"><h2>История</h2>';
    list.slice(0,50).forEach(function(e){html+='<div class="stat-row"><span class="stat-row-label">'+e.date+'</span><span class="stat-row-value">'+e.value+' '+m.unit+'</span></div>'});
    html+='</div>';
  }
  openSheet(m.name,html);
}
function medQuickAdd(id){
  var m=MED_METRICS.find(function(x){return x.id===id});if(!m)return;
  var html='<div class="field"><label class="field-label">Значение ('+m.unit+')</label><input type="number" id="med-q-value" step="0.1"/></div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="medSaveQuick(\''+id+'\')">💾 Сохранить</button>';
  openSheet(m.name,html);
}
function medSaveQuick(id){
  var v=parseFloat((document.getElementById('med-q-value')||{}).value);
  if(isNaN(v)){toast('Введи число','error');return}
  if(!state.medicalData)state.medicalData={metrics:[],entries:[],profile:{},recommendations:[]};
  state.medicalData.entries.push({id:uid(),metricId:id,value:v,date:today(),timestamp:nowISO()});
  save();closeSheet();toast('✓ Сохранено','success');renderMedical();
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
    summary+='- '+m.name+': '+last.value+' '+m.unit+' ('+last.date+'), среднее '+avg.toFixed(1)+'\n';
  });
  var prompt='ПАЦИЕНТ: '+data.entries.length+' замеров.\n\nПОКАЗАТЕЛИ:\n'+summary+'\n\nДай анализ: 1) Оценка. 2) Тревожные знаки. 3) Что проверить. 4) Рекомендации. Без диагнозов.';
  var reply=await callAI('doctor',prompt);
  if(!state.medicalData.recommendations)state.medicalData.recommendations=[];
  state.medicalData.recommendations.push({id:uid(),date:today(),text:reply,timestamp:nowISO()});
  save();toast('✓ Готово','success');
  var html='<div style="font-size:14px;line-height:1.6;">'+renderMd(reply)+'</div>';
  openSheet('✨ Анализ',html);
  renderMedical();
}
window.openMedAddEntry=openMedAddEntry;
window.medSaveEntry=medSaveEntry;
window.openMedMetricDetail=openMedMetricDetail;
window.medQuickAdd=medQuickAdd;
window.medSaveQuick=medSaveQuick;
window.runAIMedicalAnalysis=runAIMedicalAnalysis;

/* ============ CALENDAR ============ */
var CAL_COLORS=[
{id:'tomato',name:'Помидор',hex:'#d50000'},{id:'flamingo',name:'Фламинго',hex:'#e67c73'},
{id:'tangerine',name:'Мандарин',hex:'#f4511e'},{id:'banana',name:'Банан',hex:'#f6bf26'},
{id:'sage',name:'Шалфей',hex:'#33b679'},{id:'basil',name:'Базилик',hex:'#0b8043'},
{id:'peacock',name:'Павлин',hex:'#039be5'},{id:'blueberry',name:'Черника',hex:'#3f51b5'},
{id:'lavender',name:'Лаванда',hex:'#7986cb'},{id:'grape',name:'Виноград',hex:'#8e24aa'},
{id:'graphite',name:'Графит',hex:'#616161'}
];
var CAL_VIEW='month';
var CAL_CURSOR=new Date();

function calColorHex(id){var c=CAL_COLORS.find(function(x){return x.id===id});return c?c.hex:'#5b9eff'}
function calISO(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())}
function calParseISO(iso){var p=(iso||'').split('-');if(p.length!==3)return new Date();return new Date(parseInt(p[0]),parseInt(p[1])-1,parseInt(p[2]))}
function calDaysInMonth(y,m){return new Date(y,m+1,0).getDate()}
function calMonthName(m){return['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'][m]}
function calMonthNameShort(m){return['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'][m]}
function calWeekDayName(d){return['Вс','Пн','Вт','Ср','Чт','Пт','Сб'][d]}
function calStartOfWeek(date){var d=new Date(date);var day=d.getDay();var diff=d.getDate()-day+(day===0?-6:1);d.setDate(diff);d.setHours(0,0,0,0);return d}
function calEventsOnDate(iso){
  return (state.calendarEvents||[]).filter(function(ev){
    var start=(ev.start||'').slice(0,10);var end=(ev.end||ev.start||'').slice(0,10);
    if(start&&end&&start!==end)return iso>=start&&iso<=end;
    return start===iso;
  });
}
function renderGcal(){
  var html='<div class="page"><div class="title-xl">📅 Календарь</div>';
  html+='<div class="cal-toolbar">';
  html+='<button class="cal-nav-btn" onclick="calNavigate(-1)">‹</button>';
  html+='<button class="cal-today-btn" onclick="CAL_CURSOR=new Date();renderGcal()">Сегодня</button>';
  html+='<button class="cal-nav-btn" onclick="calNavigate(1)">›</button>';
  html+='<div class="cal-title">'+calMonthName(CAL_CURSOR.getMonth())+' '+CAL_CURSOR.getFullYear()+'</div>';
  html+='</div>';
  html+='<button class="btn btn-primary btn-block mb-3" onclick="openEventEditor(null)">➕ Новое событие</button>';
  html+=calRenderMonth();
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function calNavigate(dir){CAL_CURSOR=new Date(CAL_CURSOR.getFullYear(),CAL_CURSOR.getMonth()+dir,1);renderGcal()}
function calRenderMonth(){
  var y=CAL_CURSOR.getFullYear();var m=CAL_CURSOR.getMonth();
  var first=new Date(y,m,1);var offset=first.getDay()===0?6:first.getDay()-1;
  var days=calDaysInMonth(y,m);var todayISO=today();
  var html='<div class="cal-month"><div class="cal-month-head">';
  ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].forEach(function(d){html+='<div class="cal-month-head-cell">'+d+'</div>'});
  html+='</div><div class="cal-month-grid">';
  var prevMonth=new Date(y,m,0);var prevDays=prevMonth.getDate();
  for(var i=offset-1;i>=0;i--){html+='<div class="cal-month-cell cal-other-month"><div class="cal-day-num">'+(prevDays-i)+'</div></div>'}
  for(var d=1;d<=days;d++){
    var iso=y+'-'+pad(m+1)+'-'+pad(d);
    var evs=calEventsOnDate(iso);
    var cls='cal-month-cell'+(iso===todayISO?' cal-today':'');
    html+='<div class="'+cls+'" onclick="openEventEditorForDate(\''+iso+'\')"><div class="cal-day-num">'+d+'</div>';
    if(evs.length){
      html+='<div class="cal-day-events">';
      evs.slice(0,3).forEach(function(ev){html+='<div class="cal-event-dot" style="background:'+calColorHex(ev.color)+'"></div>'});
      html+='</div>';
    }
    html+='</div>';
  }
  var total=offset+days;var rem=(7-(total%7))%7;
  for(var n=1;n<=rem;n++)html+='<div class="cal-month-cell cal-other-month"><div class="cal-day-num">'+n+'</div></div>';
  html+='</div></div>';
  return html;
}
function openEventEditorForDate(iso){
  var events=calEventsOnDate(iso);
  var html='<div class="footnote text-secondary mb-3">'+iso+'</div>';
  if(events.length){
    events.forEach(function(ev){
      html+='<div class="list-row" onclick="closeSheet();openEventEditor(\''+ev.id+'\')"><div class="list-icon" style="background:'+calColorHex(ev.color)+'20;">📌</div><div class="list-body"><div class="list-title">'+esc(ev.title)+'</div><div class="list-subtitle">'+(ev.start?ev.start.slice(11,16):'Весь день')+'</div></div></div>';
    });
    html+='<button class="btn btn-primary btn-block mt-3" onclick="closeSheet();openEventEditor(null,\''+iso+'\')">➕ Добавить ещё</button>';
  }else{
    html+='<div class="empty"><div class="empty-icon">📅</div><div class="empty-title">Нет событий</div></div>';
    html+='<button class="btn btn-primary btn-block mt-3" onclick="closeSheet();openEventEditor(null,\''+iso+'\')">➕ Создать</button>';
  }
  openSheet('События',html);
}
function openEventEditor(id,dateISO){
  var events=state.calendarEvents||[];
  var ev=id?events.find(function(x){return x.id===id}):null;
  var isNew=!ev;
  var now=new Date();
  var defaultStart=dateISO?dateISO+'T12:00':calISO(now)+'T'+pad(now.getHours())+':'+pad(now.getMinutes());
  var title=ev?(ev.title||''):'';
  var start=ev?(ev.start||defaultStart):defaultStart;
  var end=ev?(ev.end||''):'';
  var color=ev?(ev.color||'peacock'):'peacock';
  var description=ev?(ev.description||''):'';
  var html='';
  html+='<div class="field"><label class="field-label">Название</label><input type="text" id="cev-title" value="'+esc(title)+'"/></div>';
  html+='<div class="field"><label class="field-label">Описание</label><textarea id="cev-desc">'+esc(description)+'</textarea></div>';
  html+='<div class="field"><label class="field-label">Начало</label><input type="datetime-local" id="cev-start" value="'+start+'"/></div>';
  html+='<div class="field"><label class="field-label">Конец</label><input type="datetime-local" id="cev-end" value="'+end+'"/></div>';
  html+='<div class="field"><label class="field-label">Цвет</label><div class="cal-color-picker">';
  CAL_COLORS.forEach(function(c){html+='<button type="button" class="cal-color-btn'+(c.id===color?' active':'')+'" data-color="'+c.id+'" onclick="calPickColor(\''+c.id+'\')" style="background:'+c.hex+'"></button>'});
  html+='</div><input type="hidden" id="cev-color" value="'+color+'"/></div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="saveEvent('+(id?'\''+id+'\'':'null')+')">'+(isNew?'➕ Создать':'💾 Сохранить')+'</button>';
  if(!isNew)html+='<button class="btn btn-ghost btn-block mt-2" onclick="googleExportEvent(\''+id+'\')">📤 Открыть в Google</button><button class="btn btn-danger btn-block mt-2" onclick="deleteEvent(\''+id+'\')">🗑 Удалить</button>';
  openSheet(isNew?'Новое событие':'Событие',html);
}
function calPickColor(id){
  var inp=document.getElementById('cev-color');if(inp)inp.value=id;
  document.querySelectorAll('.cal-color-btn').forEach(function(b){
    if(b.getAttribute('data-color')===id)b.classList.add('active');else b.classList.remove('active');
  });
}
function saveEvent(id){
  var title=(document.getElementById('cev-title')||{}).value||'';
  if(!title.trim()){toast('Введи название','error');return}
  var description=(document.getElementById('cev-desc')||{}).value||'';
  var start=(document.getElementById('cev-start')||{}).value||'';
  var end=(document.getElementById('cev-end')||{}).value||'';
  var color=(document.getElementById('cev-color')||{}).value||'peacock';
  if(!start){toast('Укажи начало','error');return}
  if(!state.calendarEvents)state.calendarEvents=[];
  if(id){
    var ev=state.calendarEvents.find(function(x){return x.id===id});if(!ev)return;
    ev.title=title.trim();ev.description=description;ev.start=start;ev.end=end;ev.color=color;ev.updatedAt=nowISO();
  }else{
    state.calendarEvents.push({id:uid(),title:title.trim(),description:description,start:start,end:end,color:color,createdAt:nowISO()});
  }
  save();haptic('success');closeSheet();toast('✓ Сохранено','success');renderGcal();
}
function deleteEvent(id){
  if(!confirm('Удалить?'))return;
  state.calendarEvents=(state.calendarEvents||[]).filter(function(x){return x.id!==id});
  save();closeSheet();toast('Удалено','info');renderGcal();
}
function googleExportEvent(id){
  var ev=(state.calendarEvents||[]).find(function(x){return x.id===id});if(!ev)return;
  function gfmt(iso){if(!iso)return '';var s=iso.replace(/[-:]/g,'');if(s.length===13)s+='00';return s}
  var params={action:'TEMPLATE',text:ev.title||'Событие',dates:gfmt(ev.start)+'/'+gfmt(ev.end||ev.start),details:ev.description||'',sf:'true'};
  window.open('https://calendar.google.com/calendar/render?'+Object.keys(params).map(function(k){return k+'='+encodeURIComponent(params[k])}).join('&'),'_blank');
}
window.renderGcal=renderGcal;
window.calNavigate=calNavigate;
window.openEventEditor=openEventEditor;
window.openEventEditorForDate=openEventEditorForDate;
window.calPickColor=calPickColor;
window.saveEvent=saveEvent;
window.deleteEvent=deleteEvent;
window.googleExportEvent=googleExportEvent;

/* ============ ENTERTAINMENT ============ */
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
function renderGenericLibrary(name,emoji,type){
  var list=state.watchlist.filter(function(w){return w.type===type})||[];
  var html='<div class="page"><div class="row-between" style="margin-bottom:14px;"><div class="title-xl" style="margin:0;">'+emoji+' '+name+'</div><button class="btn btn-primary btn-sm" onclick="addWatchItem(\''+type+'\')">+</button></div>';
  if(list.length){list.forEach(function(m){html+='<div class="list-row"><div class="list-icon">'+emoji+'</div><div class="list-body"><div class="list-title">'+esc(m.title)+'</div></div><button class="btn btn-ghost btn-xs" onclick="event.stopPropagation();removeWatchItem(\''+m.id+'\')">🗑</button></div>'})}
  else{html+='<div class="empty"><div class="empty-icon">'+emoji+'</div><div class="empty-title">Пусто</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderMovies(){renderGenericLibrary('Фильмы','🎥','movie')}
function renderSeries(){renderGenericLibrary('Сериалы','📺','series')}
function renderBooks(){renderGenericLibrary('Книги','📚','book')}
function renderMusic(){renderGenericLibrary('Музыка','🎵','music')}
function renderGames(){renderGenericLibrary('Игры','🎮','game')}
function renderPodcasts(){renderGenericLibrary('Подкасты','🎧','podcast')}
function addWatchItem(type){
  var title=prompt('Название:');if(!title)return;
  state.watchlist.push({id:uid(),type:type,title:title,added:nowISO()});
  save();toast('✓ Добавлено','success');navigate(currentPage);
}
function removeWatchItem(id){
  if(!confirm('Удалить?'))return;
  state.watchlist=state.watchlist.filter(function(x){return x.id!==id});
  save();toast('Удалено','info');navigate(currentPage);
}
window.addWatchItem=addWatchItem;
window.removeWatchItem=removeWatchItem;
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
  html+='<div class="field"><label class="field-label">Ссылка *</label><input type="url" id="res-url"/></div>';
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

/* ============ TIMER / FOCUS / DOMAINS ============ */
function renderTimer(){
  var m=Math.floor(timerSeconds/60),s=timerSeconds%60;
  var html='<div class="page"><div class="title-xl">⏱ Таймер</div>';
  html+='<div class="card" style="text-align:center;padding:32px 16px;"><div style="font-size:64px;font-weight:800;font-variant-numeric:tabular-nums;" id="timerDisplay">'+pad(m)+':'+pad(s)+'</div></div>';
  html+='<div class="card"><div class="btn-row" style="justify-content:center;">';
  if(!timerRunning)html+='<button class="btn btn-primary" onclick="startTimer()">▶</button>';
  else html+='<button class="btn btn-warning" onclick="pauseTimer()">⏸</button>';
  html+='<button class="btn btn-ghost" onclick="resetTimer()">🔄</button>';
  html+='<button class="btn btn-success" onclick="finishTimer()">✓</button>';
  html+='</div></div></div>';
  document.getElementById('app').innerHTML=html;
}
function startTimer(){
  if(timerRunning)return;
  timerRunning=true;
  timerInterval=setInterval(function(){
    if(timerSeconds<=0){pauseTimer();toast('⏰ Время!','success');return}
    timerSeconds--;
    var el=document.getElementById('timerDisplay');
    if(el){var m=Math.floor(timerSeconds/60),s=timerSeconds%60;el.textContent=pad(m)+':'+pad(s)}
  },1000);
  renderTimer();
}
function pauseTimer(){timerRunning=false;if(timerInterval){clearInterval(timerInterval);timerInterval=null}renderTimer()}
function resetTimer(){if(timerInterval){clearInterval(timerInterval);timerInterval=null}timerRunning=false;timerSeconds=25*60;renderTimer()}
function finishTimer(){
  if(timerInterval){clearInterval(timerInterval);timerInterval=null}
  timerRunning=false;
  state.timerSessions.push({id:uid(),duration:25,date:today(),created_at:nowISO()});
  save();toast('✓ Сессия','success');resetTimer();
}
window.startTimer=startTimer;
window.pauseTimer=pauseTimer;
window.resetTimer=resetTimer;
window.finishTimer=finishTimer;

function renderFocus(){
  var html='<div class="page"><div class="title-xl">🎯 Фокус</div>';
  html+='<div class="card"><h2>Режимы</h2>';
  html+='<div class="list-row" onclick="startFocusSession(\'Deep Work\',90)"><div class="list-icon">🎯</div><div class="list-body"><div class="list-title">Deep Work</div><div class="list-subtitle">90 мин</div></div></div>';
  html+='<div class="list-row" onclick="startFocusSession(\'Pomodoro\',25)"><div class="list-icon">🍅</div><div class="list-body"><div class="list-title">Pomodoro</div><div class="list-subtitle">25 мин</div></div></div>';
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
function startFocusSession(name,duration){
  state.focusSessions.push({id:uid(),name:name,duration:duration,date:today(),created_at:nowISO()});
  save();toast('✓ '+name,'success');haptic('success');
}
window.startFocusSession=startFocusSession;

function renderDomains(){
  var domains=window.DOMAINS||[];
  var todayScores=(state.domainScores||{})[today()]||{};
  var html='<div class="page"><div class="title-xl">🌐 Домены</div>';
  domains.forEach(function(d){
    var score=todayScores[d.id]||0;var pct=Math.round(score*10);
    html+='<div class="domain-card" onclick="openDomain(\''+d.id+'\')"><div class="domain-header"><div class="domain-icon" style="background:'+d.color+'20;color:'+d.color+';">'+d.emoji+'</div><div style="flex:1;"><div class="domain-title">'+d.name+'</div><div class="domain-score">'+(score>0?score+'/10':'—')+'</div></div></div><div class="domain-bar"><div class="domain-bar-fill" style="width:'+pct+'%;background:'+d.color+';"></div></div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openDomain(id){
  var d=(window.DOMAINS||[]).find(function(x){return x.id===id});if(!d)return;
  var todayScores=(state.domainScores||{})[today()]||{};
  var score=todayScores[id]||5;
  var html='<div style="text-align:center;margin-bottom:16px;"><div style="font-size:48px;">'+d.emoji+'</div><div style="font-size:20px;font-weight:800;">'+d.name+'</div></div>';
  html+='<div class="card"><div style="text-align:center;padding:12px 0;"><div style="font-size:40px;font-weight:800;color:'+d.color+';" id="domainScoreDisplay">'+score+'</div></div><input type="range" min="1" max="10" value="'+score+'" style="width:100%;" oninput="document.getElementById(\'domainScoreDisplay\').textContent=this.value;" id="domainScoreRange"/><button class="btn btn-primary btn-block" onclick="saveDomainScore(\''+id+'\')">Сохранить</button></div>';
  openSheet(d.name,html);
}
function saveDomainScore(id){
  var r=document.getElementById('domainScoreRange');if(!r)return;
  var t=today();
  if(!state.domainScores)state.domainScores={};
  if(!state.domainScores[t])state.domainScores[t]={};
  state.domainScores[t][id]=parseInt(r.value);
  save();toast('✓ Сохранено','success');closeSheet();renderDomains();
}
window.openDomain=openDomain;
window.saveDomainScore=saveDomainScore;

/* ============ PLANNING ============ */
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
  html+='<button class="btn btn-primary btn-block" onclick="createDayPlan(\''+date+'\')">'+(plan?'Обновить':'Создать')+'</button></div>';
  document.getElementById('app').innerHTML=html;
}
function createDayPlan(date){
  var plan=state.dayPlans[date]||{tasks:[]};
  var t=prompt('Задачи (через запятую):',plan.tasks.map(function(x){return x.title}).join(', '));
  if(t===null)return;
  plan.tasks=t.split(',').map(function(x){return{title:x.trim(),done:false}}).filter(function(x){return x.title});
  state.dayPlans[date]=plan;
  save();toast('✓ Сохранено','success');renderPlanToday();
}
function togglePlanTask(type,date,idx){
  var plan=type==='day'?state.dayPlans[date]:(type==='week'?state.weekPlans[date]:state.monthPlans[date]);
  if(!plan||!plan.tasks[idx])return;
  plan.tasks[idx].done=!plan.tasks[idx].done;
  save();navigate(currentPage);
}
function renderPlanWeek(){
  var html='<div class="page"><div class="title-xl">🗓 План недели</div>';
  html+='<button class="btn btn-primary btn-block" onclick="createWeekPlan()">Создать план</button></div>';
  document.getElementById('app').innerHTML=html;
}
function createWeekPlan(){
  var t=prompt('Задачи недели (через запятую):');if(!t)return;
  var key=getWeekKey();
  state.weekPlans[key]={tasks:t.split(',').map(function(x){return{title:x.trim(),done:false}}).filter(function(x){return x.title})};
  save();toast('✓ Сохранено','success');
}
function renderPlanMonth(){
  var html='<div class="page"><div class="title-xl">📆 План месяца</div>';
  html+='<button class="btn btn-primary btn-block" onclick="createMonthPlan()">Создать план</button></div>';
  document.getElementById('app').innerHTML=html;
}
function createMonthPlan(){
  var t=prompt('Задачи месяца:');if(!t)return;
  var key=getMonthKey();
  state.monthPlans[key]={tasks:t.split(',').map(function(x){return{title:x.trim(),done:false}}).filter(function(x){return x.title})};
  save();toast('✓ Сохранено','success');
}
function getWeekKey(){var d=new Date();var day=d.getDay();var diff=d.getDate()-day+(day===0?-6:1);var mon=new Date(d.setDate(diff));return mon.toISOString().slice(0,10)}
function getMonthKey(){return new Date().toISOString().slice(0,7)}
window.createDayPlan=createDayPlan;
window.createWeekPlan=createWeekPlan;
window.createMonthPlan=createMonthPlan;
window.togglePlanTask=togglePlanTask;

function renderObsidian(){
  var o=state.integrations.obsidian||{};
  var html='<div class="page"><div class="title-xl">📓 Obsidian</div>';
  html+='<div class="card"><div class="field"><label class="field-label">API Key</label><input type="password" id="obs-key" value="'+esc(o.apiKey||'')+'"/></div>';
  html+='<div class="field"><label class="field-label">Vault</label><input type="text" id="obs-vault" value="'+esc(o.vault||'')+'"/></div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="saveObsidian()">💾 Сохранить</button></div>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function saveObsidian(){
  state.integrations.obsidian=state.integrations.obsidian||{};
  state.integrations.obsidian.apiKey=(document.getElementById('obs-key')||{}).value||'';
  state.integrations.obsidian.vault=(document.getElementById('obs-vault')||{}).value||'';
  save();toast('✓ Сохранён','success');
}
window.saveObsidian=saveObsidian;

/* ============ AI ============ */
function renderAI(){
  var active=state.settings.activePersona||'coach';
  var personas=window.PERSONAS||{};
  var persona=personas[active]||personas.coach||{name:'AI',emoji:'✨'};
  var messages=state.chats.filter(function(c){return c.persona===active});
  var html='<div class="page"><div class="title-xl">✨ AI</div>';
  html+='<div class="quick-tabs">';
  Object.keys(personas).forEach(function(k){
    html+='<button class="quick-tab '+(active===k?'active':'')+'" onclick="switchPersona(\''+k+'\')">'+personas[k].emoji+' '+personas[k].name+'</button>';
  });
  html+='</div>';
  html+='<div class="card" style="min-height:340px;max-height:58vh;overflow-y:auto;" id="chatBox"><div class="chat">';
  if(messages.length){messages.forEach(function(m){html+='<div class="msg msg-'+(m.role==='user'?'user':'bot')+'">'+(m.role==='user'?esc(m.text):renderMd(m.text))+'</div>'})}
  else{html+='<div class="empty"><div class="empty-icon">'+persona.emoji+'</div><div class="empty-title">'+persona.name+'</div></div>'}
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
  var reply=await callAI(persona,text);
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
    if(!contents.length||contents[contents.length-1].role!=='user')contents.push({role:'user',parts:[{text:userText}]});
    var resp=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+model+':generateContent?key='+key,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({system_instruction:{parts:[{text:p.prompt}]},contents:contents})});
    var data=await resp.json();
    return (data.candidates&&data.candidates[0]&&data.candidates[0].content&&data.candidates[0].content.parts&&data.candidates[0].content.parts[0]&&data.candidates[0].content.parts[0].text)||fallbackReply(persona,userText);
  }catch(e){return fallbackReply(persona,userText)}
}
function fallbackReply(persona,text){
  text=text||'';
  if(/суицид|покончить|не хочу жить/i.test(text))return '🆘 Позвони: 8-800-2000-122 · 103 · findahelpline.com. Ты важен.';
  if(persona==='doctor')return 'Опиши симптомы.\n\n⚠️ Не заменяет врача. Острые — 103.';
  if(persona==='vision')return '20-20-20, пальминг, гимнастика.';
  if(persona==='psych')return 'Слышу тебя. Что происходит?';
  if(persona==='it')return 'Какой стек тебя интересует?';
  if(persona==='lawyer')return 'Опиши ситуацию. Я объясню общие принципы.';
  if(persona==='teacher')return 'Какую тему хочешь изучить?';
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

/* ============ SETTINGS / STORAGE / INTEGRATIONS ============ */
function renderSettings(){
  var themes=window.THEMES||[];
  var currentTheme=themes.find(function(t){return t.id===state.settings.theme})||{name:'dark'};
  var html='<div class="page"><div class="title-xl">⚙️ Настройки</div>';
  html+='<div class="card"><h2>Профиль</h2><div class="field"><label class="field-label">Имя</label><input type="text" value="'+esc(state.profile.name)+'" onchange="saveProfileName(this.value)"/></div><div class="list-row" onclick="openThemePicker()"><div class="list-icon">🎨</div><div class="list-body"><div class="list-title">Тема</div></div><div class="list-value">'+currentTheme.name+'</div></div></div>';
  html+='<div class="card"><h2>Интеграции</h2><div class="list-row" onclick="navigate(\'integrations\')"><div class="list-icon">🔗</div><div class="list-body"><div class="list-title">Все интеграции</div></div><div class="list-chevron">›</div></div></div>';
  html+='<div class="card"><h2>Данные</h2><div class="list-row" onclick="navigate(\'storage\')"><div class="list-icon">🗄</div><div class="list-body"><div class="list-title">Хранилище</div></div><div class="list-chevron">›</div></div></div>';
  html+='<div class="footnote text-tertiary" style="text-align:center;margin-top:24px;">Life OS v'+CURRENT_VERSION+'</div></div>';
  document.getElementById('app').innerHTML=html;
}
function renderStorage(){
  var totalSize=0;
  try{var raw=localStorage.getItem(STORAGE_KEY);totalSize=raw?raw.length:0}catch(e){}
  var backupSize=0;
  try{var b=localStorage.getItem(STORAGE_BACKUP);backupSize=b?b.length:0}catch(e){}
  var html='<div class="page"><div class="title-xl">🗄 Хранилище</div>';
  html+='<div class="card"><h2>🔒 Правила</h2><div class="footnote text-secondary">1. Ключ не меняется<br>2. Миграция без потерь<br>3. Бэкап перед загрузкой<br>4. Сброс только с подтверждением</div></div>';
  html+='<div class="card"><h2>Данные</h2>';
  html+='<div class="list-row"><div class="list-icon">✓</div><div class="list-body"><div class="list-title">'+STORAGE_KEY+'</div></div><div class="list-value">'+(totalSize/1024).toFixed(1)+' KB</div></div>';
  html+='<div class="list-row"><div class="list-icon">🔒</div><div class="list-body"><div class="list-title">Бэкап</div></div><div class="list-value">'+(backupSize/1024).toFixed(1)+' KB</div></div>';
  html+='</div>';
  html+='<div class="card"><h2>Операции</h2>';
  html+='<button class="btn btn-primary btn-block mb-2" onclick="exportDB()">📤 Экспорт JSON</button>';
  html+='<button class="btn btn-ghost btn-block mb-2" onclick="importDB()">📥 Импорт JSON</button>';
  html+='<button class="btn btn-ghost btn-block mb-2" onclick="restoreBackup()">🔄 Восстановить</button>';
  html+='<button class="btn btn-danger btn-block" onclick="resetAllWithConfirm()">🗑 Полный сброс</button>';
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
function renderIntegrations(){
  var obs=state.integrations.obsidian||{};
  var html='<div class="page"><div class="title-xl">🔗 Интеграции</div>';
  html+='<div class="list-row" onclick="navigate(\'obsidian\')"><div class="list-icon">📓</div><div class="list-body"><div class="list-title">Obsidian</div><div class="list-subtitle">'+(obs.connected?'✓ Подключён':'Не подключён')+'</div></div><div class="list-chevron">›</div></div>';
  html+='<div class="card"><h2>✨ Gemini AI</h2><div class="field"><label class="field-label">API Key</label><input type="password" id="gem-key" value="'+esc((state.integrations.gemini||{}).apiKey||'')+'"/></div><button class="btn btn-primary btn-block" onclick="saveGemini()">💾 Сохранить</button><div class="footnote text-tertiary mt-2">Ключ: aistudio.google.com</div></div>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function saveGemini(){
  state.integrations.gemini=state.integrations.gemini||{};
  state.integrations.gemini.apiKey=(document.getElementById('gem-key')||{}).value||'';
  state.settings.apiKey=state.integrations.gemini.apiKey;
  save();toast('✓ Сохранён','success');
}
window.saveGemini=saveGemini;

/* ============ MORE ============ */
function renderMore(){
  var groups=[
    {title:'🎓 Обучение',items:[
      {key:'learning',emoji:'🎓',label:'Обучение'},
      {key:'levels',emoji:'🌱',label:'Уровни'},
      {key:'english',emoji:'🇬🇧',label:'English'},
      {key:'skills',emoji:'💎',label:'Навыки'},
      {key:'methods',emoji:'🎯',label:'Методики'},
      {key:'psychology',emoji:'🧠',label:'Психология'},
      {key:'thinking',emoji:'💡',label:'Мышление'},
      {key:'etiquette',emoji:'🎩',label:'Этикет'},
      {key:'hormones',emoji:'🧬',label:'Гормоны'},
      {key:'wealth',emoji:'💰',label:'Богатство'}
    ]},
    {title:'🚀 Новые курсы',items:[
      {key:'itcourse',emoji:'💻',label:'IT'},
      {key:'lawcourse',emoji:'⚖️',label:'Право'},
      {key:'medcourse',emoji:'⚕️',label:'Медицина'},
      {key:'financecourse',emoji:'📈',label:'Финансы'},
      {key:'psychdeep',emoji:'🧠',label:'Психология угл.'},
      {key:'langcourse',emoji:'🌍',label:'Языки'},
      {key:'designcourse',emoji:'🎨',label:'Дизайн'},
      {key:'cookingcourse',emoji:'🍳',label:'Кулинария'},
      {key:'sportcourse',emoji:'🏋️',label:'Спорт'},
      {key:'musiccourse',emoji:'🎵',label:'Музыка'},
      {key:'historycourse',emoji:'🏛',label:'История'},
      {key:'astrocourse',emoji:'🔭',label:'Астрономия'}
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
      {key:'screentracker',emoji:'📱',label:'Экран'},
      {key:'detoxcourse',emoji:'📚',label:'Курс 62 дня'}
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
function renderPersonalPlan(){navigate('dashboard')}

/* ============ STATS / PROFILE ============ */
function renderStats(){
  var doneTasks=state.tasks.filter(function(t){return t.status==='completed'}).length;
  var doneLessons=Object.keys(state.levelProgress||{}).length;
  var html='<div class="page"><div class="title-xl">📊 Статистика</div>';
  html+='<div class="stat-grid mb-4"><div class="stat-item"><div class="stat-value">'+doneTasks+'</div><div class="stat-label">Задач</div></div><div class="stat-item"><div class="stat-value">'+doneLessons+'</div><div class="stat-label">Уроков</div></div><div class="stat-item"><div class="stat-value">'+(state.stats.streak||0)+'</div><div class="stat-label">Streak</div></div></div>';
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
  html+='<div class="group-card"><div class="group-title">❤️ Здоровье</div><div class="stat-row"><span class="stat-row-label">💧 Вода</span><span class="stat-row-value">'+waterTotal+'</span></div><div class="stat-row"><span class="stat-row-label">💭 Настроений</span><span class="stat-row-value">'+(state.customMood||[]).length+'</span></div></div>';
  html+='<div class="group-card"><div class="group-title">📱 Экран</div><div class="stat-row"><span class="stat-row-label">Сегодня</span><span class="stat-row-value">'+fmtMinsHM(screenGetToday())+'</span></div><div class="stat-row"><span class="stat-row-label">Неделя</span><span class="stat-row-value">'+fmtMinsHM(screenGetWeek())+'</span></div><div class="stat-row"><span class="stat-row-label">Месяц</span><span class="stat-row-value">'+fmtMinsHM(screenGetMonth())+'</span></div></div>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderProfile(){
  var p=state.profile;
  var unlocked=p.achievements||[];
  var doneTasks=state.tasks.filter(function(t){return t.status==='completed'}).length;
  var lessonsDone=Object.keys(state.levelProgress||{}).length;
  var lvl=Math.floor((state.xp||0)/100);
  var achievements=window.ACHIEVEMENTS||[];
  var html='<div class="page">';
  html+='<div class="profile-hero"><div class="avatar-btn" onclick="pickEmoji()" style="width:96px;height:96px;margin:0 auto 12px;font-size:48px;">'+p.emoji+'</div><div style="font-size:22px;font-weight:800;">'+esc(p.name||'Пользователь')+'</div></div>';
  html+='<div class="level-hero"><div class="level-badge">🏅 Уровень '+lvl+'</div><div class="xp-bar"><div class="xp-bar-fill" style="width:'+((state.xp||0)%100)+'%;"></div></div><div class="xp-text">'+((state.xp||0)%100)+'/100 XP · Всего: '+(state.xp||0)+'</div></div>';
  html+='<div class="stat-grid mb-4"><div class="stat-item"><div class="stat-value">'+doneTasks+'</div><div class="stat-label">Задач</div></div><div class="stat-item"><div class="stat-value">'+lessonsDone+'</div><div class="stat-label">Уроков</div></div><div class="stat-item"><div class="stat-value">'+(state.stats.streak||0)+'</div><div class="stat-label">Streak</div></div></div>';
  html+='<div class="card"><h2>✏️ Имя</h2><input type="text" value="'+esc(p.name)+'" onchange="saveProfileName(this.value)"/></div>';
  html+='<div class="card"><h2>🏆 Достижения ('+unlocked.length+'/'+achievements.length+')</h2><div class="achieve-grid">';
  achievements.forEach(function(a){
    var isUnlocked=unlocked.indexOf(a.id)>=0;
    var prog=isUnlocked?1:(a.progress?a.progress(state):0);
    html+='<div class="achieve-item '+(isUnlocked?'unlocked':'locked')+'"><div class="achieve-icon">'+a.icon+'</div><div class="achieve-name">'+a.name+'</div><div class="achieve-progress"><div class="achieve-progress-fill" style="width:'+(prog*100)+'%;"></div></div></div>';
  });
  html+='</div></div></div>';
  document.getElementById('app').innerHTML=html;
}
function pickEmoji(){
  var emojis=['😊','😎','🤓','🧑‍💻','👨‍💼','👩‍💼','🦊','🐱','🐶','🦁','🐼','🦉','🌟','⚡','🔥','💎','🚀','🎯','🧠','💪','🌈','☕','🎨','🎮','🎧','📚','🏃','🧘','🍀','🌸'];
  var html='<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:8px;">';
  emojis.forEach(function(e){html+='<button onclick="setEmoji(\''+e+'\')" style="aspect-ratio:1;border-radius:14px;background:var(--glass-2);font-size:26px;cursor:pointer;border:2px solid '+(e===state.profile.emoji?'var(--brand)':'transparent')+';">'+e+'</button>'});
  html+='</div>';
  openSheet('Аватар',html);
}
function setEmoji(e){state.profile.emoji=e;save();closeSheet();toast('Ок','success');renderProfile();updateHeader()}
function saveProfileName(name){state.profile.name=(name||'').trim()||'Пользователь';save();toast('Сохранено','success');updateHeader()}
window.pickEmoji=pickEmoji;
window.setEmoji=setEmoji;
window.saveProfileName=saveProfileName;

/* ============ CHALLENGES & ACHIEVEMENTS ============ */
function renderChallenges(){
  var list=(typeof getTodayChallenges==='function')?getTodayChallenges():[];
  if(!list.length)return '';
  var html='<div class="card"><h2>🔥 Челленджи дня</h2>';
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
  save();haptic('success');toast('🔥 +10 XP','success');
  checkAchievements();navigate(currentPage);
}
function checkAchievements(){
  var achievements=window.ACHIEVEMENTS||[];
  var unlocked=state.profile.achievements||[];
  var newOnes=[];
  for(var i=0;i<achievements.length;i++){
    var a=achievements[i];
    if(unlocked.indexOf(a.id)<0&&a.check(state)){unlocked.push(a.id);newOnes.push(a)}
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

/* ============ ADAPTIVE ============ */
function getYesterdayScreen(){return (state.screenStats||{})[yesterday()]||0}
function getYesterdaySleep(){return (state.customSleep&&state.customSleep[yesterday()])||7}
function getAdaptiveLoad(){
  var sleep=getYesterdaySleep();
  var water=(state.customWater||[]).find(function(w){return w.date===yesterday()});water=water?water.count:0;
  var mood=(state.customMood||[]).find(function(m){return m.date===yesterday()});mood=mood?mood.score:7;
  var screen=getYesterdayScreen();
  var load=100;
  if(sleep<6)load-=20;if(sleep<7)load-=10;
  if(water<4)load-=10;if(mood<5)load-=15;
  if(screen>300)load-=10;if(screen>360)load-=10;
  return Math.max(30,Math.min(120,load));
}
function getSmartTips(){
  var tips=[];
  var sleep=getYesterdaySleep();
  var water=(state.customWater||[]).find(function(w){return w.date===today()});water=water?water.count:0;
  var mood=(state.customMood||[]).find(function(m){return m.date===today()});mood=mood?mood.score:7;
  var screen=screenGetToday();
  if(sleep<6)tips.push('😴 Сон <6ч. Снизь нагрузку.');
  if(water<4)tips.push('💧 Мало воды. 2 стакана сейчас.');
  if(mood<5)tips.push('❤️ Настроение низкое. Прогулка.');
  if(screen>180)tips.push('📱 Экран сегодня уже '+fmtMinsHM(screen)+'. Лимит 3 ч.');
  if(!tips.length)tips.push('✨ Всё в балансе. Хороший день для Deep Work.');
  return tips;
}

/* ============ SURVEY ============ */
function startSurvey(){state.profile.surveyStep=0;save();navigate('survey')}
function renderSurvey(){
  var step=state.profile.surveyStep||0;
  var qs=window.SURVEY_QUESTIONS||[];var q=qs[step];
  if(!q){finishSurvey();return}
  var answers=state.profile.surveyAnswers||{};
  var html='<div class="page"><div class="survey-container"><div class="survey-progress">';
  for(var i=0;i<qs.length;i++){var cls='survey-dot';if(i<step)cls+=' done';else if(i===step)cls+=' active';html+='<div class="'+cls+'"></div>'}
  html+='</div>';
  html+='<div class="survey-question">'+q.question+'</div>';
  if(q.type==='text'){html+='<input type="text" id="surveyInput" class="welcome-input" value="'+esc(answers[q.id]||'')+'"/><button class="btn btn-primary btn-block mt-3" onclick="saveSurveyAnswer()">Далее</button>'}
  else if(q.type==='options'){q.options.forEach(function(o){html+='<div class="survey-option'+(answers[q.id]===o.value?' selected':'')+'" onclick="selectSurveyOption(\''+q.id+'\',\''+o.value+'\')"><span class="survey-option-emoji">'+o.emoji+'</span><span>'+o.label+'</span></div>'})}
  if(step>0)html+='<button class="btn btn-ghost btn-block mt-2" onclick="prevSurveyStep()">← Назад</button>';
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
function selectSurveyOption(qid,v){if(!state.profile.surveyAnswers)state.profile.surveyAnswers={};state.profile.surveyAnswers[qid]=v;save();nextSurveyStep()}
function saveSurveyAnswer(){var v=(document.getElementById('surveyInput')||{}).value||'';if(!v.trim())return toast('Заполни','error');var q=(window.SURVEY_QUESTIONS||[])[state.profile.surveyStep];if(!state.profile.surveyAnswers)state.profile.surveyAnswers={};state.profile.surveyAnswers[q.id]=v;if(q.id==='name')state.profile.name=v;save();nextSurveyStep()}
function nextSurveyStep(){state.profile.surveyStep=(state.profile.surveyStep||0)+1;save();if(state.profile.surveyStep>=(window.SURVEY_QUESTIONS||[]).length)finishSurvey();else renderSurvey()}
function prevSurveyStep(){state.profile.surveyStep=Math.max(0,(state.profile.surveyStep||0)-1);save();renderSurvey()}
function finishSurvey(){state.profile.surveyDone=true;save();toast('🎉 Готово!','success');updateHeader();navigate('dashboard')}
window.startSurvey=startSurvey;
window.saveSurveyAnswer=saveSurveyAnswer;
window.selectSurveyOption=selectSurveyOption;
window.nextSurveyStep=nextSurveyStep;
window.prevSurveyStep=prevSurveyStep;
window.finishSurvey=finishSurvey;

/* ============ WELCOME ============ */
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
    var o=document.createElement('div');o.className='welcome-screen';
    o.innerHTML='<div class="welcome-logo">👤</div><div class="welcome-title">Как тебя зовут?</div><input type="text" class="welcome-input" id="welcome-name" placeholder="Имя" maxlength="30"/><button class="btn btn-primary btn-block mt-4" style="max-width:340px;margin-top:16px;" onclick="finishOnboarding()">Далее</button>';
    document.body.appendChild(o);
    setTimeout(function(){var i=document.getElementById('welcome-name');if(i)i.focus()},300);
  }else{
    state.profile.name=name;state.settings.onboardingDone=true;
    save();updateHeader();renderTabBar();renderDashboard();
  }
}
function finishOnboarding(){
  var inp=document.getElementById('welcome-name');var name=inp?inp.value.trim():'';
  if(!name)return toast('Введи имя','error');
  state.profile.name=name;state.settings.onboardingDone=true;
  save();
  var w=document.querySelector('.welcome-screen');if(w)w.remove();
  updateHeader();renderTabBar();renderDashboard();
  haptic('success');toast('Добро пожаловать, '+name+'!','success');
}
window.startOnboarding=startOnboarding;
window.finishOnboarding=finishOnboarding;

/* ============ INIT ============ */
function init(){
  try{
    applyTheme(state.settings.theme);
    updateHeader();
    if(!state.profile.name&&!state.settings.onboardingDone){showWelcome();return}
    if(state.profile.name&&!state.settings.onboardingDone){state.settings.onboardingDone=true;save()}
    if(!state.profile.name&&window.__tgName){state.profile.name=window.__tgName;save();updateHeader()}
    if(state.tasks.length===0){
      state.tasks=[
        {id:uid(),title:'Завершить отчёт',category:'Работа',planned_time:45,status:'pending',priority:'high',created_at:nowISO()},
        {id:uid(),title:'Повторить 10 слов',category:'Обучение',planned_time:15,status:'pending',priority:'medium',created_at:nowISO()},
        {id:uid(),title:'Дневник: 3 победы',category:'Личное',planned_time:5,status:'pending',priority:'medium',created_at:nowISO()}
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

console.log('[APP v42] ✅ Всё загружено');