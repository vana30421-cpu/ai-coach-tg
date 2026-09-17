'use strict';
/* AI HEALTH v32 — ГЛАВНЫЙ ФАЙЛ (без звуков) */

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

/* ============ NO AUDIO ============ */
/* Все звуковые функции удалены по требованию. */

function backBtn(target){return '<button class="back-btn" onclick="navigate(\''+target+'\')">← Назад</button>'}

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

/* ============ NAVIGATION ============ */
function navigate(page){
  if(!page)page='dashboard';
  currentPage=page;
  try{renderTabBar()}catch(e){}
  var main=document.getElementById('app');
  if(!main)return;
  main.innerHTML='';
  var renderers={
    dashboard:renderDashboard,tasks:renderTasks,
    learning:renderLearning,levels:renderLevels,
    levelDetail:renderLevelDetail,moduleDetail:renderModuleDetail,
    skills:renderSkills,skillDetail:renderSkillDetail,
    paths:renderPaths,pathDetail:renderPathDetail,
    courses:renderCourses,methods:renderMethods,
    domains:renderDomains,plan:renderPersonalPlan,
    ai:renderAI,health:renderHealth,more:renderMore,
    calendar:renderCalendar,stats:renderStats,detailedStats:renderDetailedStats,
    matrix:renderMatrix,integrations:renderIntegrations,
    metrics:renderMetrics,profile:renderProfile,
    settings:renderSettings,dbmanager:renderDBManager,
    history:renderHistory,water:renderWater,mood:renderMood,
    habits:renderHabits,goals:renderGoals,timer:renderTimer,
    notes:renderNotes,focus:renderFocus,meds:renderMeds,
    workouts:renderWorkouts,meditation:renderMeditation,
    journal:renderJournal,media:renderMedia,finance:renderFinance,
    screenTime:renderScreenTime,english:renderEnglish,
    englishLevel:renderEnglishLevel,storage:renderStorage,
    recovery:renderRecovery,entertainment:renderEntertainment,
    screentracker:renderScreenTracker,memory:renderMemory,
    iq:renderIQ,eq:renderEQ,neuromodule:renderNeuro,
    dailyplan:renderDailyPlan,watchlist:renderWatchlist,
    watched:renderWatched,detoxplan:renderDetoxPlan,
    detoxcourse:renderDetoxCourse,detoxday:renderDetoxDay,
    movies:renderMovies,series:renderSeries,books:renderBooks,
    musiclib:renderMusic,gameslib:renderGames,
    podcastslib:renderPodcasts,theaterlib:renderTheater,
    artlib:renderArt
  };
  var fn=renderers[page];
  if(typeof fn!=='function'){
    main.innerHTML='<div class="page">'+backBtn('dashboard')+'<div class="title-xl">🚧 '+page+'</div><div class="card"><div class="empty"><div class="empty-icon">🚧</div><div class="empty-title">Раздел в разработке</div><div class="empty-text">Функция для "'+page+'" не найдена</div></div></div></div>';
    return;
  }
  try{fn()}catch(e){
    console.error('Рендер ошибка ['+page+']:',e);
    main.innerHTML='<div class="page">'+backBtn('dashboard')+'<div class="title-xl">⚠️ Ошибка</div><div class="card"><div class="empty"><div class="empty-icon">⚠️</div><div class="empty-title">'+esc(e.message||'Ошибка')+'</div><div class="empty-text">Раздел: '+page+'</div></div></div></div>';
  }
  window.scrollTo({top:0});
  if(page==='profile'||page==='dashboard'){try{checkAchievements()}catch(e){}}
}

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
    {icon:'➕',label:'Новая задача',action:'openEntityEditor(\'task\',null)'},
    {icon:'💧',label:'+1 вода',action:'addWater();closeLiveControl()'},
    {icon:'💭',label:'Настроение',action:'quickMoodLog();closeLiveControl()'},
    {icon:'⏱',label:'Таймер',action:'navigate(\'timer\');closeLiveControl()'},
    {icon:'🎯',label:'Фокус',action:'navigate(\'focus\');closeLiveControl()'},
    {icon:'📋',label:'План дня',action:'navigate(\'dailyplan\');closeLiveControl()'},
    {icon:'🎓',label:'Обучение',action:'navigate(\'learning\');closeLiveControl()'},
    {icon:'💎',label:'Навыки',action:'navigate(\'skills\');closeLiveControl()'},
    {icon:'🇬🇧',label:'English',action:'navigate(\'english\');closeLiveControl()'},
    {icon:'🧠',label:'Память',action:'navigate(\'memory\');closeLiveControl()'},
    {icon:'🎯',label:'IQ',action:'navigate(\'iq\');closeLiveControl()'},
    {icon:'❤️',label:'EQ',action:'navigate(\'eq\');closeLiveControl()'},
    {icon:'💰',label:'Финансы',action:'navigate(\'finance\');closeLiveControl()'},
    {icon:'🔬',label:'Нейро',action:'navigate(\'neuromodule\');closeLiveControl()'},
    {icon:'📱',label:'Детокс-курс',action:'navigate(\'detoxcourse\');closeLiveControl()'},
    {icon:'🎬',label:'Досуг',action:'navigate(\'entertainment\');closeLiveControl()'},
    {icon:'🌐',label:'10 Доменов',action:'navigate(\'domains\');closeLiveControl()'},
    {icon:'📊',label:'Статистика',action:'navigate(\'stats\');closeLiveControl()'},
    {icon:'📈',label:'Детальная',action:'navigate(\'detailedStats\');closeLiveControl()'},
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

/* ============ THEME ============ */
function openThemePicker(){
  var html='<div class="footnote text-tertiary" style="margin-bottom:8px;">🎨 Выбери тему</div>';
  html+='<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px;">';
  THEMES.forEach(function(t){
    var active=state.settings.theme===t.id;
    html+='<button onclick="setTheme(\''+t.id+'\')" style="padding:14px 8px;border-radius:14px;border:2px solid '+(active?'var(--brand)':'transparent')+';background:'+t.color+';color:#fff;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;"><span style="font-size:26px;">'+t.emoji+'</span><span style="font-size:10px;font-weight:700;">'+t.name+'</span></button>';
  });
  html+='</div>';
  html+='<div class="card" style="margin:0;padding:16px;"><div class="row-between mb-3"><div><div class="list-title">🌈 Живые эффекты</div><div class="caption text-tertiary">Дым, волны, снег, огонь</div></div><button class="switch '+(state.settings.effectsEnabled?'on':'')+'" onclick="state.settings.effectsEnabled=!state.settings.effectsEnabled;save();startEffects();toast(\'Ок\',\'success\');"></button></div>';
  html+='<div class="row-between"><div><div class="list-title">💪 Интенсивность</div></div><div class="btn-row"><button class="btn btn-ghost btn-xs" onclick="state.settings.effectsIntensity=0.5;save();startEffects();toast(\'Слабо\',\'success\')">Слабо</button><button class="btn btn-ghost btn-xs" onclick="state.settings.effectsIntensity=1;save();startEffects();toast(\'Средне\',\'success\')">Средне</button><button class="btn btn-ghost btn-xs" onclick="state.settings.effectsIntensity=2;save();startEffects();toast(\'Макс\',\'success\')">Макс</button></div></div></div>';
  openSheet('Тема и эффекты',html);
}
function setTheme(id){
  try{
    state.settings.theme=id;
    applyTheme(id);
    save();
    haptic('success');
    closeSheet();
    toast('Тема изменена','success');
  }catch(e){toast('Ошибка темы, fallback','error');applyTheme('dark')}
}
function applyTheme(id){
  try{
    var themes=THEMES.map(function(t){return t.id});
    themes.forEach(function(t){document.body.classList.remove('theme-'+t)});
    document.body.classList.add('theme-'+id);
    startEffects();
  }catch(e){document.body.classList.add('theme-dark')}
}

/* ============ EFFECTS ============ */
function startEffects(){
  var overlay=document.getElementById('themeEffect');
  if(!overlay)return;
  overlay.innerHTML='';
  var theme=THEMES.find(function(t){return t.id===state.settings.theme});
  if(!theme||!state.settings.effectsEnabled)return;
  var effect=theme.effects;
  var intensity=state.settings.effectsIntensity||1;
  var speed=state.settings.animationSpeed||1;
  if(effect==='none')return;
  function cnt(base){return Math.round(base*intensity)}
  if(effect==='stars'){
    for(var i=0;i<cnt(15);i++){var s=document.createElement('div');s.className='effect-star';s.style.left=Math.random()*100+'%';s.style.top=Math.random()*100+'%';s.style.animationDelay=Math.random()*3+'s';overlay.appendChild(s)}
  } else if(effect==='rain'){
    for(var j=0;j<cnt(25);j++){var d=document.createElement('div');d.className='effect-drop';d.style.left=Math.random()*100+'%';d.style.animationDuration=((Math.random()*1.5+1.5)/speed)+'s';d.style.animationDelay=Math.random()*5+'s';d.style.height=(Math.random()*20+12)+'px';overlay.appendChild(d)}
  } else if(effect==='petals'){
    for(var k=0;k<cnt(12);k++){var p=document.createElement('div');p.className='effect-petal';p.textContent='🌸';p.style.left=Math.random()*100+'%';p.style.animationDuration=((Math.random()*8+10)/speed)+'s';p.style.animationDelay=Math.random()*10+'s';overlay.appendChild(p)}
  } else if(effect==='leaves'){
    for(var l=0;l<cnt(10);l++){var lf=document.createElement('div');lf.className='effect-leaf';lf.textContent='🍃';lf.style.left=Math.random()*100+'%';lf.style.animationDuration=((Math.random()*8+8)/speed)+'s';lf.style.animationDelay=Math.random()*10+'s';overlay.appendChild(lf)}
  } else if(effect==='snow'){
    for(var n=0;n<cnt(18);n++){var sn=document.createElement('div');sn.className='effect-snowflake';sn.textContent='❄';sn.style.left=Math.random()*100+'%';sn.style.animationDuration=((Math.random()*6+8)/speed)+'s';sn.style.animationDelay=Math.random()*10+'s';overlay.appendChild(sn)}
  } else if(effect==='waves'){
    for(var w=0;w<cnt(4);w++){var wv=document.createElement('div');wv.className='effect-wave';wv.style.bottom=(w*25)+'px';wv.style.animationDelay=(w*1.5)+'s';overlay.appendChild(wv)}
  } else if(effect==='smoke'){
    for(var sm=0;sm<cnt(6);sm++){var smk=document.createElement('div');smk.className='effect-smoke';smk.style.left=Math.random()*100+'%';smk.style.animationDuration=((Math.random()*8+12)/speed)+'s';smk.style.animationDelay=Math.random()*10+'s';overlay.appendChild(smk)}
  } else if(effect==='sunrays'){
    for(var sr=0;sr<cnt(4);sr++){var ray=document.createElement('div');ray.className='effect-ray';ray.style.left=(15+sr*20)+'%';ray.style.animationDelay=(sr*1.5)+'s';overlay.appendChild(ray)}
  } else if(effect==='crystals'){
    for(var cr=0;cr<cnt(18);cr++){var dm=document.createElement('div');dm.className='effect-diamond';dm.textContent='◆';dm.style.left=Math.random()*100+'%';dm.style.animationDuration=((Math.random()*8+10)/speed)+'s';dm.style.animationDelay=Math.random()*10+'s';overlay.appendChild(dm)}
  } else if(effect==='bats'){
    for(var b=0;b<cnt(4);b++){var bat=document.createElement('div');bat.className='effect-bat';bat.textContent='🦇';bat.style.left=Math.random()*100+'%';bat.style.top=Math.random()*50+'%';bat.style.animationDelay=Math.random()*5+'s';overlay.appendChild(bat)}
  } else if(effect==='spiders'){
    for(var sp=0;sp<cnt(4);sp++){var spd=document.createElement('div');spd.className='effect-spider';spd.textContent='🕷';spd.style.left=Math.random()*100+'%';spd.style.top=Math.random()*30+'%';spd.style.animationDelay=Math.random()*5+'s';overlay.appendChild(spd)}
  } else if(effect==='aurora'){
    for(var au=0;au<cnt(3);au++){var aul=document.createElement('div');aul.className='effect-aurora-layer';aul.style.animationDelay=(au*3)+'s';overlay.appendChild(aul)}
  } else if(effect==='sand'){
    for(var sd=0;sd<cnt(25);sd++){var sdust=document.createElement('div');sdust.className='effect-dust';sdust.style.left=Math.random()*100+'%';sdust.style.top=Math.random()*100+'%';sdust.style.animationDuration=((Math.random()*4+4)/speed)+'s';sdust.style.animationDelay=Math.random()*6+'s';overlay.appendChild(sdust)}
  } else if(effect==='cyber'){
    for(var cy=0;cy<cnt(12);cy++){var cyd=document.createElement('div');cyd.className='effect-code';cyd.textContent='01';cyd.style.left=Math.random()*100+'%';cyd.style.animationDuration=((Math.random()*4+4)/speed)+'s';cyd.style.animationDelay=Math.random()*5+'s';overlay.appendChild(cyd)}
  } else if(effect==='ember'||effect==='fire'){
    for(var em=0;em<cnt(25);em++){var ember=document.createElement('div');ember.className='effect-ember';ember.style.left=Math.random()*100+'%';ember.style.bottom=(Math.random()*100)+'px';ember.style.animationDuration=((Math.random()*3+3)/speed)+'s';ember.style.animationDelay=Math.random()*4+'s';overlay.appendChild(ember)}
  } else if(effect==='bubbles'){
    for(var bb=0;bb<cnt(15);bb++){var bub=document.createElement('div');bub.className='effect-bubble';bub.style.left=Math.random()*100+'%';var size=Math.random()*20+8;bub.style.width=size+'px';bub.style.height=size+'px';bub.style.animationDuration=((Math.random()*8+6)/speed)+'s';bub.style.animationDelay=Math.random()*8+'s';overlay.appendChild(bub)}
  } else if(effect==='neon'||effect==='holo'){
    for(var nn=0;nn<cnt(25);nn++){var spark=document.createElement('div');spark.className='effect-spark';spark.style.left=Math.random()*100+'%';spark.style.top=Math.random()*100+'%';spark.style.animationDelay=Math.random()*3+'s';if(effect==='holo'){spark.style.background='linear-gradient(45deg,#00ffcc,#ff00aa)'}overlay.appendChild(spark)}
  } else if(effect==='fog'){
    for(var fg=0;fg<cnt(4);fg++){var fog=document.createElement('div');fog.className='effect-fog';fog.style.top=(fg*25)+'%';fog.style.animationDelay=(fg*3)+'s';overlay.appendChild(fog)}
  } else if(effect==='lightning'){
    var light=document.createElement('div');light.className='effect-lightning';overlay.appendChild(light);
  } else if(effect==='moon'){
    var moon=document.createElement('div');moon.className='effect-moon-glow';overlay.appendChild(moon);
  } else if(effect==='galaxy'){
    for(var gl=0;gl<cnt(3);gl++){var gal=document.createElement('div');gal.className='effect-galaxy';gal.style.width='250px';gal.style.height='250px';gal.style.left=(Math.random()*80)+'%';gal.style.top=(Math.random()*80)+'%';gal.style.animationDelay=(gl*5)+'s';overlay.appendChild(gal)}
  } else if(effect==='nebula'){
    for(var nb=0;nb<cnt(3);nb++){var neb=document.createElement('div');neb.className='effect-nebula';neb.style.width='350px';neb.style.height='350px';neb.style.left=(Math.random()*70)+'%';neb.style.top=(Math.random()*70)+'%';neb.style.animationDelay=(nb*4)+'s';overlay.appendChild(neb)}
  } else if(effect==='code'){
    for(var cd=0;cd<cnt(10);cd++){var code=document.createElement('div');code.className='effect-code';code.textContent=Math.random()>0.5?'1':'0';code.style.left=Math.random()*100+'%';code.style.animationDuration=((Math.random()*4+4)/speed)+'s';code.style.animationDelay=Math.random()*5+'s';overlay.appendChild(code)}
  } else if(effect==='spark'){
    for(var sk=0;sk<cnt(30);sk++){var spk=document.createElement('div');spk.className='effect-spark';spk.style.left=Math.random()*100+'%';spk.style.top=Math.random()*100+'%';spk.style.animationDelay=Math.random()*2+'s';overlay.appendChild(spk)}
  } else if(effect==='stardust'){
    for(var std=0;std<cnt(45);std++){var stdust=document.createElement('div');stdust.className='effect-stardust';stdust.style.left=Math.random()*100+'%';stdust.style.top=Math.random()*100+'%';stdust.style.animationDelay=Math.random()*3+'s';overlay.appendChild(stdust)}
  } else if(effect==='hearts'){
    for(var hr=0;hr<cnt(12);hr++){var ht=document.createElement('div');ht.className='effect-petal';ht.textContent='❤';ht.style.left=Math.random()*100+'%';ht.style.animationDuration=((Math.random()*8+8)/speed)+'s';ht.style.animationDelay=Math.random()*10+'s';overlay.appendChild(ht)}
  } else if(effect==='fireflies'){
    for(var ff=0;ff<cnt(15);ff++){var ffl=document.createElement('div');ffl.className='effect-dust';ffl.style.left=Math.random()*100+'%';ffl.style.top=Math.random()*100+'%';ffl.style.background='#ffcc4d';ffl.style.boxShadow='0 0 12px #ffcc4d,0 0 24px #ffa940';ffl.style.animationDuration=((Math.random()*4+4)/speed)+'s';ffl.style.animationDelay=Math.random()*6+'s';overlay.appendChild(ffl)}
  } else if(effect==='particles'){
    for(var pt=0;pt<cnt(20);pt++){var part=document.createElement('div');part.className='effect-stardust';part.style.left=Math.random()*100+'%';part.style.top=Math.random()*100+'%';part.style.background='var(--brand)';part.style.boxShadow='0 0 8px var(--brand)';part.style.animationDelay=Math.random()*3+'s';overlay.appendChild(part)}
  } else if(effect==='heavyfog'){
    for(var hf=0;hf<cnt(3);hf++){var hfg=document.createElement('div');hfg.className='effect-heavy-fog';hfg.style.top=(hf*30)+'%';hfg.style.animationDelay=(hf*3)+'s';overlay.appendChild(hfg)}
    for(var dsk=0;dsk<cnt(6);dsk++){var dsmk=document.createElement('div');dsmk.className='effect-dark-smoke';dsmk.style.left=Math.random()*100+'%';dsmk.style.animationDuration=((Math.random()*10+15)/speed)+'s';dsmk.style.animationDelay=Math.random()*8+'s';overlay.appendChild(dsmk)}
    var gorange=document.createElement('div');gorange.className='effect-glow-orange';overlay.appendChild(gorange);
    for(var pk=0;pk<cnt(8);pk++){var pumpkin=document.createElement('div');pumpkin.className='effect-petal';pumpkin.textContent='🎃';pumpkin.style.left=Math.random()*100+'%';pumpkin.style.animationDuration=((Math.random()*10+12)/speed)+'s';pumpkin.style.animationDelay=Math.random()*10+'s';overlay.appendChild(pumpkin)}
  } else if(effect==='vampire'){
    for(var vf=0;vf<cnt(4);vf++){var vfg=document.createElement('div');vfg.className='effect-heavy-fog';vfg.style.top=(vf*25)+'%';vfg.style.animationDelay=(vf*3)+'s';overlay.appendChild(vfg)}
    for(var vsk=0;vsk<cnt(8);vsk++){var vsmk=document.createElement('div');vsmk.className='effect-dark-smoke';vsmk.style.left=Math.random()*100+'%';vsmk.style.animationDuration=((Math.random()*10+15)/speed)+'s';vsmk.style.animationDelay=Math.random()*8+'s';overlay.appendChild(vsmk)}
    var gred=document.createElement('div');gred.className='effect-glow-red';overlay.appendChild(gred);
    for(var vb=0;vb<cnt(6);vb++){var vbat=document.createElement('div');vbat.className='effect-bat';vbat.textContent='🦇';vbat.style.left=Math.random()*100+'%';vbat.style.top=Math.random()*50+'%';vbat.style.animationDelay=Math.random()*5+'s';overlay.appendChild(vbat)}
  } else if(effect==='ghost'){
    for(var gf=0;gf<cnt(5);gf++){var gfg=document.createElement('div');gfg.className='effect-heavy-fog';gfg.style.top=(gf*20)+'%';gfg.style.animationDelay=(gf*3)+'s';overlay.appendChild(gfg)}
    var gsp=document.createElement('div');gsp.className='effect-glow-spirit';overlay.appendChild(gsp);
    for(var gg=0;gg<cnt(6);gg++){var ghost=document.createElement('div');ghost.className='effect-bat';ghost.textContent='👻';ghost.style.left=Math.random()*100+'%';ghost.style.top=Math.random()*50+'%';ghost.style.animationDuration=((Math.random()*15+12)/speed)+'s';ghost.style.animationDelay=Math.random()*5+'s';overlay.appendChild(ghost)}
  } else if(effect==='web'){
    for(var wf=0;wf<cnt(3);wf++){var wfg=document.createElement('div');wfg.className='effect-heavy-fog';wfg.style.top=(wf*30)+'%';wfg.style.animationDelay=(wf*3)+'s';overlay.appendChild(wfg)}
    for(var wl=0;wl<cnt(10);wl++){var wline=document.createElement('div');wline.className='effect-web-line';wline.style.left=(Math.random()*100)+'%';wline.style.height=(Math.random()*60+40)+'%';wline.style.animationDelay=(Math.random()*4)+'s';overlay.appendChild(wline)}
    for(var wsp=0;wsp<cnt(6);wsp++){var wspd=document.createElement('div');wspd.className='effect-spider';wspd.textContent='🕷';wspd.style.left=Math.random()*100+'%';wspd.style.top=Math.random()*30+'%';wspd.style.animationDelay=Math.random()*5+'s';overlay.appendChild(wspd)}
  }
}

/* ============ LEARNING ============ */
function getLevelProgress(levelId){
  var level=LEARNING_LEVELS.find(function(l){return l.id===levelId});
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
  var idx=LEARNING_LEVELS.findIndex(function(l){return l.id===levelId});
  if(idx<=0)return true;
  var prev=LEARNING_LEVELS[idx-1];
  return getLevelProgress(prev.id).pct===100;
}
function isModuleUnlocked(level,moduleIdx){
  if(moduleIdx===0)return true;
  var prevMod=level.modules[moduleIdx-1];
  return prevMod.lessons.every(function(l,idx){return state.levelProgress[level.id+'_'+prevMod.id+'_'+idx]});
}
function isLessonUnlocked(level,module,lessonIdx){
  if(lessonIdx===0)return true;
  var key=level.id+'_'+module.id+'_'+(lessonIdx-1);
  return !!state.levelProgress[key];
}

/* ============ SMART ADAPTATION ============ */
function getAdaptiveLoad(){
  var sleep=(state.customSleep&&state.customSleep[today()])||7;
  var water=(state.customWater||[]).find(function(w){return w.date===today()});
  water=water?water.count:0;
  var mood=(state.customMood||[]).find(function(m){return m.date===today()});
  mood=mood?mood.score:7;
  var load=100;
  if(sleep<6)load-=20;
  if(water<4)load-=10;
  if(mood<5)load-=15;
  return Math.max(30,load);
}
function getSmartTips(){
  var tips=[];
  var sleep=(state.customSleep&&state.customSleep[today()])||7;
  var water=(state.customWater||[]).find(function(w){return w.date===today()});
  water=water?water.count:0;
  var mood=(state.customMood||[]).find(function(m){return m.date===today()});
  mood=mood?mood.score:7;
  if(sleep<6)tips.push('😴 Сон меньше 6 часов. Снизь нагрузку, сделай 1 главную задачу.');
  if(water<4)tips.push('💧 Мало воды. Выпей 2 стакана прямо сейчас.');
  if(mood<5)tips.push('❤️ Настроение низкое. 10 мин прогулки + дыхание 4-7-8.');
  if(!tips.length)tips.push('✨ Всё в балансе. Идеальный день для Deep Work.');
  return tips;
}

/* ============ CHALLENGES ============ */
function getTodayChallengesSafe(){
  try{return (typeof getTodayChallenges==='function')?getTodayChallenges():[]}catch(e){return[]}
}
function renderChallenges(){
  var list=getTodayChallengesSafe();
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
  save();
  haptic('success');
  toast('🔥 Челлендж выполнен!','success');
  checkAchievements();
  renderDashboard();
}

/* ============ WISDOM ============ */
function getWisdomSafe(){
  try{
    if(typeof getTodayWisdom==='function')return getTodayWisdom();
  }catch(e){}
  return {text:'Ты не ленивый. Ты либо устал, либо не видишь смысла, либо боишься.',author:'Неизвестный',apply:'Спроси себя: что из 3 — моё?'};
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
function renderRing(value,label,cls){
  var r=36,c=2*Math.PI*r,off=c-(value/100)*c;
  return '<div class="ring-item '+cls+'"><div class="ring-center"><svg class="ring-svg" viewBox="0 0 90 90"><circle class="ring-track" cx="45" cy="45" r="'+r+'"/><circle class="ring-fill" cx="45" cy="45" r="'+r+'" stroke-dasharray="'+c+'" stroke-dashoffset="'+off+'"/></svg><div class="ring-value">'+value+'%</div></div><div class="ring-label">'+label+'</div></div>';
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
  LEARNING_LEVELS.forEach(function(level){
    var p=getLevelProgress(level.id);
    totalDone+=p.done;totalLessons+=p.total;
  });
  var overallPct=totalLessons?Math.round(totalDone/totalLessons*100):0;
  var skillsDone=Object.keys(state.skillsProgress||{}).length;
  var skillsTotal=(window.__SKILLS_LIBRARY?window.__SKILLS_LIBRARY.length:0);
  var waterEntry=state.customWater.find(function(w){return w.date===today()});
  var water=waterEntry?waterEntry.count:0;
  var waterGoal=state.settings.waterGoal||8;
  var detoxCompleted=(typeof getCompletedDaysCount==='function')?getCompletedDaysCount():0;
  var html='<div class="page"><div class="title-xl">'+greet+userName+'</div>';

  /* Прогресс-кольца */
  html+='<div class="progress-ring-hero">';
  html+=renderRing(progress,'День','ring-1');
  html+=renderRing(overallPct,'Учёба','ring-2');
  html+=renderRing(Math.min(100,Math.round(water/waterGoal*100)),'Вода','ring-3');
  html+=renderRing(Math.min(100,(state.stats.streak||0)*10),'Streak','ring-4');
  html+='</div>';

  /* Адаптация */
  var load=getAdaptiveLoad();
  html+='<div class="card"><h2>⚙️ Адаптация нагрузки</h2><div class="progress"><div class="progress-fill" style="width:'+load+'%;"></div></div><div class="footnote text-secondary mt-2">Рекомендуемая нагрузка: '+load+'% (по сну, воде, настроению)</div></div>';

  /* Умные подсказки */
  html+='<div class="card"><h2>💡 Умные подсказки</h2>';
  getSmartTips().forEach(function(t){html+='<div class="footnote text-secondary mb-2">'+esc(t)+'</div>'});
  html+='</div>';

  /* Мудрость + мотивация */
  html+=renderWisdom();
  html+=renderMotivation();

  /* Челленджи */
  html+=renderChallenges();

  /* Быстрые действия */
  html+='<div class="card"><h2>⚡ Быстрые действия</h2><div class="group-grid"><div class="group-item" onclick="openEntityEditor(\'task\',null)"><div class="group-item-icon">➕</div><div class="group-item-label">Задача</div></div><div class="group-item" onclick="addWater()"><div class="group-item-icon">💧</div><div class="group-item-label">Вода '+water+'/'+waterGoal+'</div></div><div class="group-item" onclick="quickMoodLog()"><div class="group-item-icon">💭</div><div class="group-item-label">Настроение</div></div><div class="group-item" onclick="navigate(\'timer\')"><div class="group-item-icon">⏱</div><div class="group-item-label">Таймер</div></div><div class="group-item" onclick="navigate(\'dailyplan\')"><div class="group-item-icon">📋</div><div class="group-item-label">План дня</div></div><div class="group-item" onclick="navigate(\'stats\')"><div class="group-item-icon">📊</div><div class="group-item-label">Стата</div></div></div></div>';

  /* Обучение */
  html+='<div class="card" style="background:linear-gradient(135deg,rgba(167,139,250,.15),rgba(91,158,255,.1));border-color:rgba(167,139,250,.3);"><h2>🎓 Обучение</h2><button class="btn btn-primary btn-block" onclick="navigate(\'learning\')">Открыть</button></div>';
  html+='<div class="card" style="background:linear-gradient(135deg,rgba(255,204,77,.15),rgba(255,169,64,.1));border-color:rgba(255,204,77,.3);"><h2>💎 Навыки</h2><button class="btn btn-primary btn-block" onclick="navigate(\'skills\')">Открыть</button></div>';
  html+='<div class="card" style="background:linear-gradient(135deg,rgba(60,220,130,.15),rgba(91,158,255,.1));border-color:rgba(60,220,130,.3);"><h2>🇬🇧 English</h2><button class="btn btn-primary btn-block" onclick="navigate(\'english\')">Продолжить</button></div>';
  html+='<div class="card" style="background:linear-gradient(135deg,rgba(255,107,107,.15),rgba(255,169,64,.1));border-color:rgba(255,107,107,.3);"><h2>📱 Детокс</h2><div class="footnote text-secondary" style="margin-bottom:12px;">Пройдено: '+detoxCompleted+'/30</div><button class="btn btn-primary btn-block" onclick="navigate(\'detoxcourse\')">Открыть</button></div>';

  /* Режимы работы */
  html+='<div class="card"><h2>🧭 Режимы работы</h2>';
  (window.WORK_MODES||[]).forEach(function(m){
    var active=state.activeWorkMode===m.id;
    html+='<div class="mode-card '+(active?'active':'')+'" onclick="setWorkMode(\''+m.id+'\')"><div class="mode-card-icon">'+m.emoji+'</div><div class="mode-card-title">'+m.name+'</div><div class="mode-card-desc">'+m.desc+'</div></div>';
  });
  html+='</div>';

  /* Задачи */
  html+='<div class="card"><h2>📋 Задачи</h2>';
  var pending=state.tasks.filter(function(t){return t.status==='pending'}).slice(0,5);
  if(pending.length){pending.forEach(function(t){html+=taskRow(t)})}
  else{html+='<div class="empty"><div class="empty-icon">✨</div><div class="empty-title">Всё выполнено</div></div>'}
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}

function setWorkMode(id){
  state.activeWorkMode=id;
  save();
  haptic('success');
  toast('Режим: '+id,'success');
  renderDashboard();
}

function taskRow(t){
  var pColors={high:'high',medium:'medium',low:'low'};
  var checked=t.status==='completed';
  var overdue=t.due_date&&!checked&&t.due_date.slice(0,10)<today();
  return '<div class="task-item '+(checked?'completed':'')+'" onclick="openEntityEditor(\'task\',\''+t.id+'\')">'+
    '<div class="priority-bar '+(pColors[t.priority]||'medium')+'"></div>'+
    '<button class="task-checkbox '+(checked?'checked':'')+'" onclick="event.stopPropagation();toggleTask(\''+t.id+'\')">'+(checked?'✓':'')+'</button>'+
    '<div class="task-content"><div class="task-title">'+esc(t.title)+'</div>'+
    '<div class="task-meta"><span>'+(t.planned_time||0)+' мин</span>'+
    (t.category?'<span>· '+esc(t.category)+'</span>':'')+
    (t.due_date?'<span>· 📅 '+t.due_date.slice(0,10)+'</span>':'')+
    (overdue?'<span style="color:var(--danger);">· ⚠️</span>':'')+
    '</div></div></div>';
}

/* ============ TASKS ============ */
var taskFilter='all';var taskSearch='';
function renderTasks(){
  var counts={
    all:state.tasks.length,
    pending:state.tasks.filter(function(t){return t.status==='pending'}).length,
    completed:state.tasks.filter(function(t){return t.status==='completed'}).length
  };
  var filtered=state.tasks.slice();
  if(taskFilter!=='all')filtered=filtered.filter(function(t){return t.status===taskFilter});
  if(taskSearch){var q=taskSearch.toLowerCase();filtered=filtered.filter(function(t){return t.title.toLowerCase().indexOf(q)>=0})}
  var html='<div class="page">'+backBtn('dashboard')+'<div class="row-between" style="margin-bottom:20px;"><div class="title-xl" style="margin:0;">✅ Задачи</div><button class="btn btn-primary btn-sm" onclick="openEntityEditor(\'task\',null)">+ Новая</button></div>';
  html+='<div class="search-bar"><span style="color:var(--text-3);font-size:18px;">🔍</span><input type="search" placeholder="Поиск..." value="'+esc(taskSearch)+'" oninput="taskSearch=this.value;renderTasks()"/></div>';
  html+='<div class="segmented" style="margin-bottom:18px;"><button class="segmented-item '+(taskFilter==='all'?'active':'')+'" onclick="taskFilter=\'all\';renderTasks()">Все ('+counts.all+')</button><button class="segmented-item '+(taskFilter==='pending'?'active':'')+'" onclick="taskFilter=\'pending\';renderTasks()">Активные ('+counts.pending+')</button><button class="segmented-item '+(taskFilter==='completed'?'active':'')+'" onclick="taskFilter=\'completed\';renderTasks()">Готовые ('+counts.completed+')</button></div>';
  if(filtered.length){filtered.forEach(function(t){html+=taskRow(t)})}
  else{html+='<div class="empty"><div class="empty-icon">📋</div><div class="empty-title">'+(taskSearch?'Ничего':'Нет задач')+'</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function addTask(){openEntityEditor('task',null)}
function toggleTask(id){
  var t=state.tasks.find(function(x){return x.id===id});if(!t)return;
  t.status=t.status==='completed'?'pending':'completed';
  t.actual_time=t.status==='completed'?(t.planned_time||0):0;
  t.updated_at=nowISO();
  if(t.status==='completed')state.stats.totalTasksDone=(state.stats.totalTasksDone||0)+1;
  save();
  if(t.status==='completed'){toast('✓ Выполнено','success')}
  haptic('success');
  checkAchievements();
  if(currentPage==='tasks')renderTasks();else renderDashboard();
}

/* ============ UNIVERSAL EDITOR ============ */
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
  '<div class="field"><label class="field-label">Теги</label><input type="text" id="ent-tags" value="'+esc((t.tags||[]).join(', '))+'" placeholder="работа, важно"/></div>'+
  '<div class="field"><label class="field-label">Место</label><input type="text" id="ent-location" value="'+esc(t.location||'')+'"/></div>'+
  '<div class="field"><label class="field-label">Заметки</label><textarea id="ent-notes">'+esc(t.notes||'')+'</textarea></div>'+
  '<button class="btn btn-primary btn-block mt-3" onclick="saveEntity(\'task\''+(t.id?',\''+t.id+'\'':'')+')">'+(t.id?'💾 Сохранить':'➕ Создать')+'</button>'+
  (t.id?'<button class="btn btn-danger btn-block mt-2" onclick="deleteEntity(\'task\',\''+t.id+'\')">🗑 Удалить</button>':'');
}
function habitEditorHTML(h){
  h=h||{};
  return '<div class="field"><label class="field-label">Название *</label><input type="text" id="ent-title" value="'+esc(h.title||'')+'"/></div>'+
  '<div class="field"><label class="field-label">Иконка</label><input type="text" id="ent-icon" value="'+esc(h.icon||'✅')+'" maxlength="4"/></div>'+
  '<div class="field"><label class="field-label">Категория</label><select id="ent-category"><option value="Здоровье"'+(h.category==='Здоровье'?' selected':'')+'>💪 Здоровье</option><option value="Психика"'+(h.category==='Психика'?' selected':'')+'>🧠 Психика</option><option value="Развитие"'+(h.category==='Развитие'?' selected':'')+'>📚 Развитие</option><option value="Продуктивность"'+(h.category==='Продуктивность'?' selected':'')+'>⚡ Продуктивность</option></select></div>'+
  '<div class="field"><label class="field-label">Частота</label><select id="ent-frequency"><option value="daily"'+(h.frequency==='daily'||!h.frequency?' selected':'')+'>Ежедневно</option><option value="weekly"'+(h.frequency==='weekly'?' selected':'')+'>Еженедельно</option></select></div>'+
  '<div class="field"><label class="field-label">Напоминание</label><input type="time" id="ent-reminder" value="'+esc(h.reminder||'')+'"/></div>'+
  '<div class="field"><label class="field-label">Заметки</label><textarea id="ent-notes">'+esc(h.notes||'')+'</textarea></div>'+
  '<button class="btn btn-primary btn-block mt-3" onclick="saveEntity(\'habit\''+(h.id?',\''+h.id+'\'':'')+')">'+(h.id?'💾 Сохранить':'➕ Создать')+'</button>'+
  (h.id?'<button class="btn btn-danger btn-block mt-2" onclick="deleteEntity(\'habit\',\''+h.id+'\')">🗑 Удалить</button>':'');
}
function goalEditorHTML(g){
  g=g||{};
  return '<div class="field"><label class="field-label">Название *</label><input type="text" id="ent-title" value="'+esc(g.title||'')+'"/></div>'+
  '<div class="field"><label class="field-label">Описание</label><textarea id="ent-desc">'+esc(g.description||'')+'</textarea></div>'+
  '<div class="field"><label class="field-label">Категория</label><select id="ent-category"><option value="Здоровье"'+(g.category==='Здоровье'?' selected':'')+'>💪 Здоровье</option><option value="Обучение"'+(g.category==='Обучение'?' selected':'')+'>📚 Обучение</option><option value="Финансы"'+(g.category==='Финансы'?' selected':'')+'>💰 Финансы</option><option value="Карьера"'+(g.category==='Карьера'?' selected':'')+'>💼 Карьера</option><option value="Личное"'+(g.category==='Личное'?' selected':'')+'>🌱 Личное</option></select></div>'+
  '<div class="row" style="gap:8px;"><div style="flex:1;"><label class="field-label">Метрика</label><input type="text" id="ent-metric" value="'+esc(g.metric||'')+'"/></div><div style="flex:1;"><label class="field-label">Цель</label><input type="number" id="ent-target" value="'+(g.target||'')+'" step="0.1"/></div></div>'+
  '<div class="row" style="gap:8px;"><div style="flex:1;"><label class="field-label">Текущее</label><input type="number" id="ent-current" value="'+(g.current||0)+'" step="0.1"/></div><div style="flex:1;"><label class="field-label">Дедлайн</label><input type="date" id="ent-deadline" value="'+(g.deadline||'')+'"/></div></div>'+
  '<button class="btn btn-primary btn-block mt-3" onclick="saveEntity(\'goal\''+(g.id?',\''+g.id+'\'':'')+')">'+(g.id?'💾 Сохранить':'➕ Создать')+'</button>'+
  (g.id?'<button class="btn btn-danger btn-block mt-2" onclick="deleteEntity(\'goal\',\''+g.id+'\')">🗑 Удалить</button>':'');
}
function noteEditorHTML(n){
  n=n||{};
  return '<div class="field"><label class="field-label">Заголовок *</label><input type="text" id="ent-title" value="'+esc(n.title||'')+'"/></div>'+
  '<div class="field"><label class="field-label">Содержание</label><textarea id="ent-content" style="min-height:200px;">'+esc(n.content||'')+'</textarea></div>'+
  '<div class="field"><label class="field-label">Теги</label><input type="text" id="ent-tags" value="'+esc((n.tags||[]).join(', '))+'"/></div>'+
  '<button class="btn btn-primary btn-block mt-3" onclick="saveEntity(\'note\''+(n.id?',\''+n.id+'\'':'')+')">'+(n.id?'💾 Сохранить':'➕ Создать')+'</button>'+
  (n.id?'<button class="btn btn-danger btn-block mt-2" onclick="deleteEntity(\'note\',\''+n.id+'\')">🗑 Удалить</button>':'');
}
function journalEditorHTML(j){
  j=j||{};
  return '<div class="field"><label class="field-label">Дата</label><input type="date" id="ent-date" value="'+(j.date||today())+'"/></div>'+
  '<div class="field"><label class="field-label">Настроение 1-10</label><input type="number" id="ent-mood" min="1" max="10" value="'+(j.mood||7)+'"/></div>'+
  '<div class="field"><label class="field-label">3 победы</label><textarea id="ent-wins">'+esc(j.wins||'')+'</textarea></div>'+
  '<div class="field"><label class="field-label">1 урок</label><textarea id="ent-lesson">'+esc(j.lesson||'')+'</textarea></div>'+
  '<div class="field"><label class="field-label">Благодарности</label><textarea id="ent-gratitude">'+esc(j.gratitude||'')+'</textarea></div>'+
  '<div class="field"><label class="field-label">Мысли</label><textarea id="ent-content" style="min-height:150px;">'+esc(j.content||'')+'</textarea></div>'+
  '<button class="btn btn-primary btn-block mt-3" onclick="saveEntity(\'journal\''+(j.id?',\''+j.id+'\'':'')+')">'+(j.id?'💾 Сохранить':'➕ Создать')+'</button>'+
  (j.id?'<button class="btn btn-danger btn-block mt-2" onclick="deleteEntity(\'journal\',\''+j.id+'\')">🗑 Удалить</button>':'');
}
function meditationEditorHTML(m){
  m=m||{};
  return '<div class="field"><label class="field-label">Практика *</label><input type="text" id="ent-title" value="'+esc(m.title||'Медитация')+'"/></div>'+
  '<div class="field"><label class="field-label">Длительность (мин)</label><input type="number" id="ent-duration" value="'+(m.duration||10)+'" min="1"/></div>'+
  '<div class="field"><label class="field-label">Тип</label><select id="ent-type"><option value="mindfulness"'+(m.type==='mindfulness'?' selected':'')+'>🧘 Осознанность</option><option value="body_scan"'+(m.type==='body_scan'?' selected':'')+'>🫀 Body scan</option><option value="breathing"'+(m.type==='breathing'?' selected':'')+'>🌬 Дыхание</option><option value="metta"'+(m.type==='metta'?' selected':'')+'>💗 Метта</option></select></div>'+
  '<div class="field"><label class="field-label">Качество 1-10</label><input type="number" id="ent-quality" min="1" max="10" value="'+(m.quality||8)+'"/></div>'+
  '<div class="field"><label class="field-label">Заметки</label><textarea id="ent-notes">'+esc(m.notes||'')+'</textarea></div>'+
  '<button class="btn btn-primary btn-block mt-3" onclick="saveEntity(\'meditation\''+(m.id?',\''+m.id+'\'':'')+')">'+(m.id?'💾 Сохранить':'➕ Создать')+'</button>'+
  (m.id?'<button class="btn btn-danger btn-block mt-2" onclick="deleteEntity(\'meditation\',\''+m.id+'\')">🗑 Удалить</button>':'');
}
function workoutEditorHTML(w){
  w=w||{};
  return '<div class="field"><label class="field-label">Тип *</label><input type="text" id="ent-title" value="'+esc(w.title||'Силовая')+'"/></div>'+
  '<div class="field"><label class="field-label">Длительность (мин)</label><input type="number" id="ent-duration" value="'+(w.duration||60)+'" min="5"/></div>'+
  '<div class="field"><label class="field-label">Интенсивность 1-10</label><input type="number" id="ent-intensity" min="1" max="10" value="'+(w.intensity||7)+'"/></div>'+
  '<div class="field"><label class="field-label">Упражнения</label><textarea id="ent-exercises">'+esc(w.exercises||'')+'</textarea></div>'+
  '<div class="field"><label class="field-label">Заметки</label><textarea id="ent-notes">'+esc(w.notes||'')+'</textarea></div>'+
  '<button class="btn btn-primary btn-block mt-3" onclick="saveEntity(\'workout\''+(w.id?',\''+w.id+'\'':'')+')">'+(w.id?'💾 Сохранить':'➕ Создать')+'</button>'+
  (w.id?'<button class="btn btn-danger btn-block mt-2" onclick="deleteEntity(\'workout\',\''+w.id+'\')">🗑 Удалить</button>':'');
}
function medEditorHTML(m){
  m=m||{};
  return '<div class="field"><label class="field-label">Название *</label><input type="text" id="ent-title" value="'+esc(m.title||'')+'"/></div>'+
  '<div class="field"><label class="field-label">Дозировка</label><input type="text" id="ent-dosage" value="'+esc(m.dosage||'')+'"/></div>'+
  '<div class="field"><label class="field-label">Время</label><input type="time" id="ent-time" value="'+esc(m.time||'')+'"/></div>'+
  '<div class="field"><label class="field-label">Частота</label><select id="ent-frequency"><option value="daily"'+(m.frequency==='daily'||!m.frequency?' selected':'')+'>Ежедневно</option><option value="weekly"'+(m.frequency==='weekly'?' selected':'')+'>Еженедельно</option></select></div>'+
  '<div class="field"><label class="field-label">Заметки</label><textarea id="ent-notes">'+esc(m.notes||'')+'</textarea></div>'+
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
  if(document.getElementById('ent-tags'))entity.tags=document.getElementById('ent-tags').value.split(',').map(function(x){return x.trim()}).filter(Boolean);
  if(document.getElementById('ent-location'))entity.location=(document.getElementById('ent-location').value||'').trim();
  if(document.getElementById('ent-icon'))entity.icon=(document.getElementById('ent-icon').value||'✅').trim();
  if(document.getElementById('ent-frequency'))entity.frequency=document.getElementById('ent-frequency').value;
  if(document.getElementById('ent-reminder'))entity.reminder=document.getElementById('ent-reminder').value;
  if(document.getElementById('ent-date'))entity.date=document.getElementById('ent-date').value;
  if(document.getElementById('ent-mood'))entity.mood=parseInt(document.getElementById('ent-mood').value)||7;
  if(document.getElementById('ent-wins'))entity.wins=(document.getElementById('ent-wins').value||'').trim();
  if(document.getElementById('ent-lesson'))entity.lesson=(document.getElementById('ent-lesson').value||'').trim();
  if(document.getElementById('ent-gratitude'))entity.gratitude=(document.getElementById('ent-gratitude').value||'').trim();
  if(document.getElementById('ent-duration'))entity.duration=parseInt(document.getElementById('ent-duration').value)||10;
  if(document.getElementById('ent-type'))entity.type=document.getElementById('ent-type').value;
  if(document.getElementById('ent-quality'))entity.quality=parseInt(document.getElementById('ent-quality').value)||8;
  if(document.getElementById('ent-intensity'))entity.intensity=parseInt(document.getElementById('ent-intensity').value)||7;
  if(document.getElementById('ent-exercises'))entity.exercises=(document.getElementById('ent-exercises').value||'').trim();
  if(document.getElementById('ent-metric'))entity.metric=(document.getElementById('ent-metric').value||'').trim();
  if(document.getElementById('ent-target'))entity.target=parseFloat(document.getElementById('ent-target').value)||0;
  if(document.getElementById('ent-current'))entity.current=parseFloat(document.getElementById('ent-current').value)||0;
  if(document.getElementById('ent-deadline'))entity.deadline=document.getElementById('ent-deadline').value;
  if(document.getElementById('ent-dosage'))entity.dosage=(document.getElementById('ent-dosage').value||'').trim();
  if(isNew)arr.unshift(entity);
  save();
  haptic('success');
  closeSheet();
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
  var key=map[type];
  state[key]=(state[key]||[]).filter(function(x){return x.id!==id});
  save();
  closeSheet();
  toast('Удалено','info');
  if(currentPage==='tasks')renderTasks();
  else if(currentPage==='habits')renderHabits();
  else if(currentPage==='goals')renderGoals();
  else if(currentPage==='notes')renderNotes();
  else renderDashboard();
}

/* ============ LEARNING ============ */
function renderLearning(){
  var totalDone=0,totalLessons=0;
  LEARNING_LEVELS.forEach(function(level){
    var p=getLevelProgress(level.id);
    totalDone+=p.done;totalLessons+=p.total;
  });
  var overallPct=totalLessons?Math.round(totalDone/totalLessons*100):0;
  var skillsDone=Object.keys(state.skillsProgress||{}).length;
  var skillsTotal=(window.__SKILLS_LIBRARY?window.__SKILLS_LIBRARY.length:0);
  var html='<div class="page">'+backBtn('dashboard')+'<div class="title-xl">🎓 Обучение</div>';
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:13px;margin-bottom:6px;">Прогресс</div><div style="font-size:44px;font-weight:800;line-height:1;margin-bottom:12px;">'+overallPct+'%</div><div style="opacity:.9;font-size:13px;">'+totalDone+' из '+totalLessons+'</div><div class="progress" style="margin-top:14px;background:rgba(255,255,255,.25);height:8px;"><div class="progress-fill" style="width:'+overallPct+'%;background:#fff;"></div></div></div>';
  html+='<div class="card"><h2>🌱 5 уровней</h2><button class="btn btn-primary btn-block" onclick="navigate(\'levels\')">Открыть</button></div>';
  html+='<div class="card"><h2>💎 Навыки ('+skillsDone+'/'+skillsTotal+')</h2><button class="btn btn-primary btn-block" onclick="navigate(\'skills\')">Открыть</button></div>';
  html+='<div class="card"><h2>🧠 Память</h2><button class="btn btn-primary btn-block" onclick="navigate(\'memory\')">Открыть</button></div>';
  html+='<div class="card"><h2>🎯 IQ</h2><button class="btn btn-primary btn-block" onclick="navigate(\'iq\')">Открыть</button></div>';
  html+='<div class="card"><h2>❤️ EQ</h2><button class="btn btn-primary btn-block" onclick="navigate(\'eq\')">Открыть</button></div>';
  html+='<div class="card"><h2>💰 Финансы</h2><button class="btn btn-primary btn-block" onclick="navigate(\'finance\')">Открыть</button></div>';
  html+='<div class="card"><h2>🔬 Нейро</h2><button class="btn btn-primary btn-block" onclick="navigate(\'neuromodule\')">Открыть</button></div>';
  html+='<div class="card"><h2>🗺 Пути</h2><button class="btn btn-ghost btn-block" onclick="navigate(\'paths\')">Открыть</button></div>';
  html+='<div class="card"><h2>📚 Курсы</h2><button class="btn btn-ghost btn-block" onclick="navigate(\'courses\')">Открыть</button></div>';
  html+='<div class="card"><h2>💎 Методики</h2><button class="btn btn-ghost btn-block" onclick="navigate(\'methods\')">Открыть</button></div>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}

function renderLevels(){
  var html='<div class="page">'+backBtn('learning')+'<div class="title-xl">🌱 5 уровней</div>';
  LEARNING_LEVELS.forEach(function(level){
    var p=getLevelProgress(level.id);
    var unlocked=isLevelUnlocked(level.id);
    var completed=p.pct===100;
    var cls='level-card';
    if(completed)cls+=' completed';else if(!unlocked)cls+=' locked';else if(p.pct>0)cls+=' active';
    html+='<div class="'+cls+'" onclick="'+(unlocked?'openLevel(\''+level.id+'\')':'toast(\'Заверши предыдущий\',\'warning\')')+'"><div class="level-header"><div class="level-num">'+(completed?'✓':level.num)+'</div><div class="level-info"><div class="level-title">'+level.emoji+' '+level.title+'</div><div class="level-subtitle">'+level.subtitle+'</div><div class="level-meta"><span>'+level.modules.length+' модулей</span></div></div></div><div class="level-desc">'+level.desc+'</div>';
    if(unlocked&&p.pct>0)html+='<div class="progress"><div class="progress-fill" style="width:'+p.pct+'%;"></div></div>';
    html+='</div>';
  });
  html+='</div>';document.getElementById('app').innerHTML=html;
}
function openLevel(id){currentLevelId=id;navigate('levelDetail')}
function renderLevelDetail(){
  var level=LEARNING_LEVELS.find(function(l){return l.id===currentLevelId});
  if(!level){navigate('learning');return}
  var p=getLevelProgress(level.id);
  var html='<div class="page">'+backBtn('levels');
  html+='<div style="text-align:center;margin-bottom:24px;"><div style="font-size:64px;margin-bottom:12px;">'+level.emoji+'</div><div class="title-xl" style="margin-bottom:8px;">Уровень '+level.num+': '+level.title+'</div></div>';
  html+='<div class="card"><div class="row-between mb-2"><span class="subhead">Прогресс</span><span class="subhead text-secondary">'+p.done+'/'+p.total+'</span></div><div class="progress"><div class="progress-fill" style="width:'+p.pct+'%;"></div></div></div>';
  html+='<div class="card"><h2>📦 Модули</h2>';
  level.modules.forEach(function(mod,i){
    var unlocked=isModuleUnlocked(level,i);
    var modDone=mod.lessons.every(function(l,idx){return state.levelProgress[level.id+'_'+mod.id+'_'+idx]});
    var modCount=mod.lessons.filter(function(l,idx){return state.levelProgress[level.id+'_'+mod.id+'_'+idx]}).length;
    var cls='module-card';if(modDone)cls+=' completed';else if(!unlocked)cls+=' locked';
    html+='<div class="'+cls+'" onclick="'+(unlocked?'openModule(\''+level.id+'\',\''+mod.id+'\')':'toast(\'Сначала предыдущий\',\'warning\')')+'"><div class="module-header"><div class="module-icon">'+(modDone?'✓':mod.emoji)+'</div><div class="module-info"><div class="module-title">'+mod.title+'</div><div class="module-meta">'+modCount+'/'+mod.lessons.length+' уроков'+(unlocked?'':' · 🔒')+'</div></div></div><div class="module-desc">'+mod.desc+'</div></div>';
  });
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
function openModule(lid,mid){currentLevelId=lid;currentModuleId=mid;navigate('moduleDetail')}
function renderModuleDetail(){
  var level=LEARNING_LEVELS.find(function(l){return l.id===currentLevelId});
  if(!level){navigate('learning');return}
  var module=level.modules.find(function(m){return m.id===currentModuleId});
  if(!module){navigate('levelDetail');return}
  var doneCount=module.lessons.filter(function(l,idx){return state.levelProgress[level.id+'_'+module.id+'_'+idx]}).length;
  var html='<div class="page">'+backBtn('levelDetail');
  html+='<div style="text-align:center;margin-bottom:24px;"><div style="font-size:56px;margin-bottom:12px;">'+module.emoji+'</div><div class="title-xl" style="margin-bottom:8px;">'+module.title+'</div></div>';
  html+='<div class="card"><div class="row-between mb-2"><span class="subhead">Прогресс</span><span class="subhead text-secondary">'+doneCount+'/'+module.lessons.length+'</span></div><div class="progress"><div class="progress-fill" style="width:'+Math.round(doneCount/module.lessons.length*100)+'%;"></div></div></div>';
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
  var level=LEARNING_LEVELS.find(function(l){return l.id===currentLevelId});if(!level)return;
  var module=level.modules.find(function(m){return m.id===currentModuleId});if(!module)return;
  var lesson=module.lessons[idx];if(!lesson)return;
  var key=level.id+'_'+module.id+'_'+idx;
  var isDone=!!state.levelProgress[key];
  var html='<div class="page">'+backBtn('moduleDetail');
  html+='<div style="margin-bottom:20px;"><div class="footnote text-tertiary" style="margin-bottom:8px;">Уровень '+level.num+' · '+module.title+' · Урок '+(idx+1)+'/'+module.lessons.length+'</div><div style="font-size:26px;font-weight:800;line-height:1.2;">'+lesson.title+'</div></div>';
  html+='<div class="card" style="padding:20px;">';
  html+='<div class="lesson-section"><div class="lesson-section-title">📚 Теория</div><div class="lesson-content">'+formatLesson(lesson.theory)+'</div></div>';
  html+='<div class="lesson-section practice"><div class="lesson-section-title">🎯 Практика</div><div class="lesson-content">'+esc(lesson.practice)+'</div></div>';
  html+='<div class="lesson-section reflection"><div class="lesson-section-title">💭 Рефлексия</div><div class="lesson-content">'+esc(lesson.reflection)+'</div></div>';
  html+='</div>';
  if(!isDone)html+='<button class="btn btn-primary btn-block" onclick="completeLesson()">✓ Изучено</button>';
  else{
    html+='<div class="badge badge-success" style="display:block;text-align:center;padding:14px;font-size:14px;">✓ Урок изучен</div>';
    if(idx<module.lessons.length-1)html+='<button class="btn btn-primary btn-block mt-3" onclick="openLesson('+(idx+1)+')">Следующий →</button>';
    else html+='<button class="btn btn-success btn-block mt-3" onclick="navigate(\'moduleDetail\')">Модуль завершён ✓</button>';
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
  var level=LEARNING_LEVELS.find(function(l){return l.id===currentLevelId});if(!level)return;
  var module=level.modules.find(function(m){return m.id===currentModuleId});if(!module)return;
  var key=level.id+'_'+module.id+'_'+currentLessonIdx;
  if(!state.levelProgress)state.levelProgress={};
  state.levelProgress[key]=true;
  save();
  haptic('success');
  toast('✓ Урок изучен!','success');
  checkAchievements();
  openLesson(currentLessonIdx);
}

/* ============ SKILLS ============ */
var skillsFilter='all';
function renderSkills(){
  var cats=window.__SKILLS_CATEGORIES||[];
  var lib=window.__SKILLS_LIBRARY||[];
  var filtered=skillsFilter==='all'?lib:lib.filter(function(s){return s.cat===skillsFilter});
  var done=Object.keys(state.skillsProgress||{}).length;
  var html='<div class="page">'+backBtn('learning')+'<div class="title-xl">💎 Навыки</div>';
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:13px;">Прогресс</div><div style="font-size:44px;font-weight:800;">'+done+'/'+lib.length+'</div><div class="progress" style="margin-top:14px;background:rgba(255,255,255,.25);height:8px;"><div class="progress-fill" style="width:'+(lib.length?done/lib.length*100:0)+'%;background:#fff;"></div></div></div>';
  html+='<div class="quick-nav"><div class="quick-nav-item '+(skillsFilter==='all'?'active':'')+'" onclick="skillsFilter=\'all\';renderSkills()">Все ('+lib.length+')</div>';
  cats.forEach(function(c){
    html+='<div class="quick-nav-item '+(skillsFilter===c.id?'active':'')+'" onclick="skillsFilter=\''+c.id+'\';renderSkills()">'+c.emoji+' '+c.name+'</div>';
  });
  html+='</div>';
  filtered.forEach(function(s){
    var isDone=state.skillsProgress&&state.skillsProgress[s.id];
    html+='<div class="method-card" onclick="openSkill(\''+s.id+'\')"><div class="method-header"><div class="method-emoji">'+s.emoji+'</div><div style="flex:1;"><div class="method-title">'+s.title+'</div><div class="method-cat">'+s.cat+' · '+s.level+' · '+s.duration+'</div></div>'+(isDone?'<span class="badge badge-success">✓</span>':'<div class="list-chevron">›</div>')+'</div><div class="method-desc">'+s.desc+'</div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openSkill(id){
  var s=(window.__SKILLS_LIBRARY||[]).find(function(x){return x.id===id});
  if(!s)return;
  var isDone=state.skillsProgress&&state.skillsProgress[s.id];
  var cat=(window.__SKILLS_CATEGORIES||[]).find(function(c){return c.id===s.cat})||{};
  var html='<div style="text-align:center;margin-bottom:20px;"><div style="font-size:56px;margin-bottom:12px;">'+s.emoji+'</div><div style="font-size:22px;font-weight:800;margin-bottom:6px;">'+s.title+'</div><div class="footnote text-secondary">'+(cat.emoji||'')+' '+(cat.name||'')+' · '+s.level+' · '+s.duration+'</div></div>';
  html+='<div class="card"><div class="footnote text-secondary">'+s.desc+'</div></div>';
  html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚 Теория</div><div class="lesson-content">'+formatLesson(s.theory||'')+'</div></div></div>';
  if(s.practice&&s.practice.length){
    html+='<div class="card"><div class="lesson-section practice"><div class="lesson-section-title">🎯 Практика</div><div class="lesson-content"><ul>'+s.practice.map(function(p){return '<li>'+p+'</li>'}).join('')+'</ul></div></div></div>';
  }
  if(s.effect)html+='<div class="insight-card"><div class="insight-title">💎 Эффект</div><div class="insight-text">'+esc(s.effect)+'</div></div>';
  if(s.tips)html+='<div class="insight-card"><div class="insight-title">💡 Совет</div><div class="insight-text">'+esc(s.tips)+'</div></div>';
  if(!isDone)html+='<button class="btn btn-primary btn-block mt-3" onclick="completeSkill(\''+s.id+'\')">✓ Изучено</button>';
  else html+='<div class="badge badge-success" style="display:block;text-align:center;padding:12px;">✓ Изучено</div>';
  openSheet(s.title,html);
}
function completeSkill(id){
  if(!state.skillsProgress)state.skillsProgress={};
  state.skillsProgress[id]=true;
  save();
  haptic('success');
  toast('✓ Навык изучен!','success');
  checkAchievements();
  closeSheet();
  renderSkills();
}
function renderSkillDetail(){renderSkills()}

/* ============ MODULES ============ */
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
  var html='<div style="margin-bottom:16px;"><div class="footnote text-tertiary" style="margin-bottom:8px;">Урок '+(idx+1)+'/'+list.length+'</div><div style="font-size:22px;font-weight:800;">'+lesson.title+'</div></div>';
  html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚 Теория</div><div class="lesson-content">'+formatLesson(lesson.theory||'')+'</div></div></div>';
  html+='<div class="card"><div class="lesson-section practice"><div class="lesson-section-title">🎯 Практика</div><div class="lesson-content">'+esc(lesson.practice||'')+'</div></div></div>';
  if(lesson.memory)html+='<div class="card"><div class="lesson-section memory"><div class="lesson-section-title">🧠 Память</div><div class="lesson-content">'+esc(lesson.memory)+'</div></div></div>';
  if(lesson.keywords)html+='<div class="card"><div class="footnote text-tertiary">🏷 '+esc(lesson.keywords)+'</div></div>';
  if(!done)html+='<button class="btn btn-primary btn-block mt-3" onclick="completeModuleLesson(\''+moduleKey+'\','+idx+')">✓ Изучено</button>';
  else html+='<div class="badge badge-success" style="display:block;text-align:center;padding:12px;">✓ Изучено</div>';
  openSheet(lesson.title,html);
}
function completeModuleLesson(moduleKey,idx){
  var map={memory:window.__MEMORY_MODULE||[],iq:window.__IQ_MODULE||[],eq:window.__EQ_MODULE||[],finance:window.__FINANCE_MODULE||[],neuro:window.__NEURO_MODULE||[]};
  var list=map[moduleKey]||[];
  var lesson=list[idx];if(!lesson)return;
  if(!state.memoryTraining)state.memoryTraining=[];
  if(state.memoryTraining.indexOf(lesson.id)<0)state.memoryTraining.push(lesson.id);
  save();
  haptic('success');
  toast('✓ Изучено!','success');
  checkAchievements();
  closeSheet();
  renderModuleList(moduleKey);
}

/* ============ ENGLISH ============ */
function renderEnglish(){
  var all=window.__ENGLISH_125||[];
  var totalDone=0;
  all.forEach(function(l){if(state.englishProgress&&state.englishProgress[l.id])totalDone++});
  var pct=all.length?Math.round(totalDone/all.length*100):0;
  var html='<div class="page">'+backBtn('dashboard')+'<div class="title-xl">🇬🇧 Английский</div>';
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:13px;">Прогресс</div><div style="font-size:44px;font-weight:800;">'+pct+'%</div><div style="opacity:.9;font-size:13px;margin-top:8px;">'+totalDone+'/'+all.length+'</div><div class="progress" style="margin-top:14px;background:rgba(255,255,255,.25);height:8px;"><div class="progress-fill" style="width:'+pct+'%;background:#fff;"></div></div></div>';
  ['A1','A2','B1','B2','C1'].forEach(function(lvl){
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
  html+='<div class="card"><h2>'+lessons.length+' уроков</h2>';
  lessons.forEach(function(lesson,i){
    var isDone=state.englishProgress&&state.englishProgress[lesson.id];
    html+='<div class="lesson-row '+(isDone?'done':'')+'" onclick="openEnglishLess(\''+lesson.id+'\')"><div class="lesson-num">'+(isDone?'✓':(i+1))+'</div><div class="lesson-title">'+lesson.title+'</div><div style="color:var(--text-4);font-size:20px;">›</div></div>';
  });
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
function renderEnglishLevel(){renderEnglish()}
function openEnglishLess(lessonId){
  var all=window.__ENGLISH_125||[];
  var lesson=all.find(function(l){return l.id===lessonId});
  if(!lesson)return;
  var isDone=state.englishProgress&&state.englishProgress[lesson.id];
  var html='<div style="margin-bottom:16px;"><div class="footnote text-tertiary" style="margin-bottom:8px;">'+lesson.level+' · '+lesson.id+'</div><div style="font-size:22px;font-weight:800;">'+lesson.title+'</div></div>';
  html+='<div class="card"><div class="lesson-section"><div class="lesson-section-title">📚 Теория</div><div class="lesson-content">'+formatLesson(lesson.theory||'')+'</div></div></div>';
  html+='<div class="card"><div class="lesson-section practice"><div class="lesson-section-title">🎯 Практика</div><div class="lesson-content">'+esc(lesson.practice||'')+'</div></div></div>';
  if(lesson.memory)html+='<div class="card"><div class="lesson-section memory"><div class="lesson-section-title">🧠 Память</div><div class="lesson-content">'+esc(lesson.memory)+'</div></div></div>';
  if(lesson.keywords)html+='<div class="card"><div class="footnote text-tertiary">🏷 '+esc(lesson.keywords)+'</div></div>';
  if(!isDone)html+='<button class="btn btn-primary btn-block mt-3" onclick="completeEnglishLess(\''+lesson.id+'\')">✓ Изучено</button>';
  else html+='<div class="badge badge-success" style="display:block;text-align:center;padding:12px;">✓ Изучено</div>';
  openSheet(lesson.title,html);
}
function completeEnglishLess(id){
  if(!state.englishProgress)state.englishProgress={};
  state.englishProgress[id]=true;
  save();
  haptic('success');
  toast('✓ Изучено!','success');
  checkAchievements();
  closeSheet();
  renderEnglish();
}

/* ============ PATHS ============ */
function renderPaths(){
  var html='<div class="page">'+backBtn('learning')+'<div class="title-xl">🗺 Пути</div>';
  PATHS_LIBRARY.forEach(function(p){
    var userPath=state.paths.find(function(x){return x.id===p.id});
    var completed=userPath?(userPath.completedSteps||[]).length:0;
    var progress=Math.round(completed/p.steps.length*100);
    html+='<div class="card" style="cursor:pointer;" onclick="openPath(\''+p.id+'\')"><div style="display:flex;gap:14px;align-items:center;margin-bottom:12px;"><div style="width:56px;height:56px;border-radius:18px;background:var(--glass-2);display:grid;place-items:center;font-size:28px;flex-shrink:0;">'+p.emoji+'</div><div style="flex:1;"><div style="font-size:17px;font-weight:800;margin-bottom:4px;">'+p.title+'</div><div class="footnote text-secondary">'+completed+'/'+p.steps.length+' · '+p.category+'</div></div><div class="list-chevron">›</div></div><div class="progress"><div class="progress-fill" style="width:'+progress+'%;"></div></div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openPath(id){currentPathId=id;navigate('pathDetail')}
function renderPathDetail(){
  var p=PATHS_LIBRARY.find(function(x){return x.id===currentPathId});
  if(!p){navigate('paths');return}
  var userPath=state.paths.find(function(x){return x.id===p.id});
  if(!userPath){userPath={id:p.id,completedSteps:[],startedAt:nowISO()};state.paths.push(userPath);save()}
  var completed=userPath.completedSteps||[];
  var progress=Math.round(completed.length/p.steps.length*100);
  var html='<div class="page">'+backBtn('paths');
  html+='<div style="text-align:center;margin-bottom:24px;"><div style="font-size:64px;margin-bottom:12px;">'+p.emoji+'</div><div class="title-xl">'+p.title+'</div></div>';
  html+='<div class="card"><div class="row-between mb-2"><span class="subhead">Прогресс</span><span class="subhead text-secondary">'+progress+'%</span></div><div class="progress"><div class="progress-fill" style="width:'+progress+'%;"></div></div></div>';
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
  var p=PATHS_LIBRARY.find(function(x){return x.id===currentPathId});if(!p)return;
  var step=p.steps[idx];if(!step)return;
  var userPath=state.paths.find(function(x){return x.id===p.id});
  var isDone=userPath&&(userPath.completedSteps||[]).indexOf(idx)>=0;
  var html='<div class="card"><h2>📋 Задача</h2><div style="font-size:15px;line-height:1.6;">'+step.desc+'</div></div>';
  html+='<div class="insight-card"><div class="insight-title">💎 Секрет</div><div class="insight-text">'+step.secret+'</div></div>';
  if(!isDone)html+='<button class="btn btn-primary btn-block mt-4" onclick="completeStep('+idx+')">✓ Отметить</button>';
  else html+='<div class="badge badge-success" style="display:block;text-align:center;padding:12px;">✓ Выполнено</div>';
  openSheet(step.title,html);
}
function completeStep(idx){
  var userPath=state.paths.find(function(x){return x.id===currentPathId});if(!userPath)return;
  if(!userPath.completedSteps)userPath.completedSteps=[];
  if(userPath.completedSteps.indexOf(idx)<0){
    userPath.completedSteps.push(idx);save();
    toast('✓ Шаг выполнен!','success');haptic('success');
    checkAchievements();closeSheet();renderPathDetail();
  }
}

/* ============ COURSES ============ */
function renderCourses(){
  var html='<div class="page">'+backBtn('learning')+'<div class="title-xl">📚 Курсы</div>';
  COURSES_LIBRARY.forEach(function(c){
    var userCourse=state.courses.find(function(x){return x.id===c.id});
    var completed=userCourse?(userCourse.completedLessons||[]).length:0;
    var progress=Math.round(completed/c.lessons.length*100);
    html+='<div class="course-card" onclick="openCourse(\''+c.id+'\')"><div class="course-header"><div class="course-emoji">'+c.emoji+'</div><div class="course-info"><div class="course-title">'+c.title+'</div><div class="course-meta">'+completed+'/'+c.lessons.length+' · '+progress+'%</div></div></div><div class="progress"><div class="progress-fill" style="width:'+progress+'%;"></div></div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openCourse(id){
  var c=COURSES_LIBRARY.find(function(x){return x.id===id});if(!c)return;
  var userCourse=state.courses.find(function(x){return x.id===id});
  if(!userCourse){userCourse={id:id,completedLessons:[],startedAt:nowISO()};state.courses.push(userCourse);save()}
  var completed=userCourse.completedLessons||[];
  var progress=Math.round(completed.length/c.lessons.length*100);
  var html='<div class="page">'+backBtn('courses');
  html+='<div style="text-align:center;margin-bottom:24px;"><div style="font-size:64px;margin-bottom:12px;">'+c.emoji+'</div><div class="title-xl">'+c.title+'</div></div>';
  html+='<div class="card"><div class="row-between mb-2"><span class="subhead">Прогресс</span><span class="subhead text-secondary">'+completed.length+'/'+c.lessons.length+'</span></div><div class="progress"><div class="progress-fill" style="width:'+progress+'%;"></div></div></div>';
  html+='<div class="card"><h2>📚 Уроки</h2>';
  c.lessons.forEach(function(lesson,i){
    var isDone=completed.indexOf(i)>=0;
    html+='<div class="lesson-row '+(isDone?'done':'')+'" onclick="openCourseLesson(\''+c.id+'\','+i+')"><div class="lesson-num">'+(isDone?'✓':(i+1))+'</div><div class="lesson-title">'+lesson.title+'</div><div style="color:var(--text-4);font-size:20px;">›</div></div>';
  });
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
function openCourseLesson(courseId,idx){
  var c=COURSES_LIBRARY.find(function(x){return x.id===courseId});if(!c)return;
  var lesson=c.lessons[idx];if(!lesson)return;
  var userCourse=state.courses.find(function(x){return x.id===courseId});
  var isDone=userCourse&&(userCourse.completedLessons||[]).indexOf(idx)>=0;
  var html='<div style="margin-bottom:16px;"><div class="footnote text-tertiary" style="margin-bottom:8px;">Урок '+(idx+1)+'/'+c.lessons.length+'</div><div style="font-size:22px;font-weight:800;">'+lesson.title+'</div></div>';
  html+='<div class="card"><div style="font-size:15px;line-height:1.7;">'+esc(lesson.content)+'</div></div>';
  if(!isDone)html+='<button class="btn btn-primary btn-block mt-3" onclick="completeCourseLesson(\''+courseId+'\','+idx+')">✓ Изучено</button>';
  else html+='<div class="badge badge-success" style="display:block;text-align:center;padding:12px;">✓ Изучено</div>';
  openSheet(lesson.title,html);
}
function completeCourseLesson(courseId,idx){
  var userCourse=state.courses.find(function(x){return x.id===courseId});if(!userCourse)return;
  if(!userCourse.completedLessons)userCourse.completedLessons=[];
  if(userCourse.completedLessons.indexOf(idx)<0){
    userCourse.completedLessons.push(idx);save();
    toast('✓ Урок изучен!','success');haptic('success');
    checkAchievements();closeSheet();openCourse(courseId);
  }
}

/* ============ METHODS ============ */
function renderMethods(){
  var html='<div class="page">'+backBtn('learning')+'<div class="title-xl">💎 Методики</div>';
  METHODS_LIBRARY.forEach(function(m){
    html+='<div class="method-card" onclick="openMethod(\''+m.id+'\')"><div class="method-header"><div class="method-emoji">'+m.emoji+'</div><div style="flex:1;"><div class="method-title">'+m.title+'</div><div class="method-cat">'+m.category+'</div></div><div class="list-chevron">›</div></div><div class="method-desc">'+m.desc+'</div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openMethod(id){
  var m=METHODS_LIBRARY.find(function(x){return x.id===id});if(!m)return;
  var html='<div style="text-align:center;margin-bottom:20px;"><div style="font-size:56px;margin-bottom:12px;">'+m.emoji+'</div><div style="font-size:22px;font-weight:800;margin-bottom:6px;">'+m.title+'</div><div class="footnote text-secondary">'+m.category+'</div></div>';
  html+='<div class="card"><div class="footnote text-secondary">'+m.desc+'</div></div>';
  html+='<div class="card"><h2>📋 Шаги</h2>';
  m.steps.forEach(function(step,i){
    html+='<div style="display:flex;gap:12px;padding:8px 0;"><div style="width:24px;height:24px;border-radius:50%;background:var(--brand);color:#fff;display:grid;place-items:center;flex-shrink:0;font-size:12px;font-weight:700;">'+(i+1)+'</div><div style="flex:1;font-size:14px;line-height:1.5;">'+step+'</div></div>';
  });
  html+='</div>';
  html+='<div class="insight-card"><div class="insight-title">🔬 База</div><div class="insight-text">'+m.base+'</div></div>';
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
  var html='<div class="page">'+backBtn('dashboard')+'<div class="title-xl">🌐 10 доменов</div>';
  var todayScores=(state.domainScores||{})[today()]||{};
  var total=0,count=0;
  DOMAINS.forEach(function(d){if(todayScores[d.id]){total+=todayScores[d.id];count++}});
  var avg=count>0?Math.round(total/count*10)/10:0;
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:13px;">Средний балл</div><div style="font-size:44px;font-weight:800;">'+avg+'/10</div><div style="opacity:.9;font-size:13px;margin-top:8px;">'+count+' из '+DOMAINS.length+'</div></div>';
  DOMAINS.forEach(function(d){
    var score=todayScores[d.id]||0;
    var avgScore=getAverageDomainScore(d.id);
    html+='<div class="domain-card" onclick="openDomain(\''+d.id+'\')"><div class="domain-header"><div class="domain-icon" style="background:'+d.color+'20;color:'+d.color+';">'+d.emoji+'</div><div style="flex:1;"><div class="domain-title">'+d.name+'</div><div class="domain-score">'+(score>0?'Сегодня: '+score+'/10':'Не оценено')+' · Среднее: '+avgScore+'</div></div><div class="list-chevron">›</div></div><div class="domain-bar"><div class="domain-bar-fill" style="width:'+(score*10)+'%;background:'+d.color+';color:'+d.color+';"></div></div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openDomain(id){
  var d=DOMAINS.find(function(x){return x.id===id});if(!d)return;
  var todayScores=(state.domainScores||{})[today()]||{};
  var score=todayScores[id]||5;
  var html='<div style="text-align:center;margin-bottom:20px;"><div style="font-size:56px;margin-bottom:12px;">'+d.emoji+'</div><div style="font-size:22px;font-weight:800;">'+d.name+'</div><div class="footnote text-secondary">'+d.desc+'</div></div>';
  html+='<div class="card"><h2>Оцени сегодня</h2><div style="text-align:center;padding:16px 0;"><div style="font-size:48px;font-weight:800;color:'+d.color+';" id="domainScoreDisplay">'+score+'</div><div class="footnote text-secondary">из 10</div></div><input type="range" min="1" max="10" value="'+score+'" style="width:100%;margin:12px 0;" oninput="document.getElementById(\'domainScoreDisplay\').textContent=this.value;" id="domainScoreRange"/><button class="btn btn-primary btn-block" onclick="saveDomainScore(\''+id+'\')">Сохранить</button></div>';
  html+='<div class="card"><h2>📊 Метрики</h2>';
  d.metrics.forEach(function(m){
    var todayMetrics=(state.metrics||{})[today()]||{};
    var val=todayMetrics[m.id]||'—';
    html+='<div class="metric-row"><div><div class="metric-label">'+m.label+'</div><div class="metric-target">Цель: '+m.target+'</div></div><div class="metric-value">'+val+'</div></div>';
  });
  html+='</div>';
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
  save();
  toast('✓ Сохранено','success');
  haptic('success');
  closeSheet();
  renderDomains();
}
function renderMetrics(){
  var html='<div class="page">'+backBtn('more')+'<div class="title-xl">📏 Метрики</div>';
  var todayMetrics=(state.metrics||{})[today()]||{};
  DOMAINS.forEach(function(d){
    html+='<div class="metric-card"><div class="metric-card-title">'+d.emoji+' '+d.name+'</div>';
    d.metrics.forEach(function(m){
      var val=todayMetrics[m.id]||'';
      html+='<div class="metric-input-row"><label>'+m.label+'</label><input type="text" id="m_'+m.id+'" value="'+esc(val)+'" placeholder="'+m.target+'"/></div>';
    });
    html+='</div>';
  });
  html+='<button class="btn btn-primary btn-block" onclick="saveMetrics()">💾 Сохранить</button></div>';
  document.getElementById('app').innerHTML=html;
}
function saveMetrics(){
  var t=today();
  if(!state.metrics)state.metrics={};
  if(!state.metrics[t])state.metrics[t]={};
  DOMAINS.forEach(function(d){
    d.metrics.forEach(function(m){
      var el=document.getElementById('m_'+m.id);
      if(el&&el.value)state.metrics[t][m.id]=el.value;
    });
  });
  save();
  toast('💾 Сохранено','success');
  haptic('success');
}

/* ============ PERSONAL PLAN ============ */
function renderPersonalPlan(){
  var plan=state.profile.personalPlan;
  var html='<div class="page">'+backBtn('dashboard')+'<div class="title-xl">🎯 Твой план</div>';
  if(!plan){html+='<div class="card"><div class="empty"><div class="empty-icon">📋</div><div class="empty-title">Нет плана</div><div class="empty-text">Пройди опросник</div><button class="btn btn-primary btn-block mt-3" onclick="startSurvey()">Пройти опрос</button></div></div>';document.getElementById('app').innerHTML=html;return}
  html+='<div class="insight-card"><div class="insight-title">✨ Фокус</div><div class="insight-text">'+plan.focusDomains.map(function(d){var dom=DOMAINS.find(function(x){return x.id===d});return dom?dom.emoji+' '+dom.name:d}).join(', ')+'</div></div>';
  plan.days.forEach(function(block){
    html+='<div class="card"><h2>'+block.title+'</h2>';
    block.items.forEach(function(item){
      html+='<div class="plan-day"><div class="plan-time">'+item.time+'</div><div class="plan-title">'+item.title+'</div><div class="plan-desc">'+item.desc+'</div></div>';
    });
    html+='</div>';
  });
  html+='<button class="btn btn-ghost btn-block" onclick="navigate(\'metrics\')">📏 Заполнить метрики</button></div>';
  document.getElementById('app').innerHTML=html;
}

/* ============ PROFILE ============ */
function renderProfile(){
  var p=state.profile;
  var unlocked=p.achievements||[];
  var doneTasks=state.tasks.filter(function(t){return t.status==='completed'}).length;
  var lessonsDone=Object.keys(state.levelProgress||{}).length;
  var lvl=Math.floor((state.xp||0)/100);
  var html='<div class="page">'+backBtn('dashboard');
  html+='<div class="profile-hero"><div class="profile-avatar lvl-'+Math.min(lvl,5)+'" onclick="pickEmoji()">'+p.emoji+'</div><div class="profile-name">'+esc(p.name||'Пользователь')+'</div></div>';
  html+='<div class="level-hero"><div class="level-badge">🏅 Уровень '+lvl+'</div><div class="xp-bar"><div class="xp-bar-fill" style="width:'+((state.xp||0)%100)+'%;"></div></div><div class="xp-text">'+((state.xp||0)%100)+'/100 XP</div></div>';
  html+='<div class="stat-grid mb-4"><div class="stat-item"><div class="stat-value">'+doneTasks+'</div><div class="stat-label">Задач</div></div><div class="stat-item"><div class="stat-value">'+lessonsDone+'</div><div class="stat-label">Уроков</div></div><div class="stat-item"><div class="stat-value">'+(state.stats.streak||0)+'</div><div class="stat-label">Streak</div></div></div>';
  html+='<div class="card"><h2>✏️ Имя</h2><div class="field" style="margin-bottom:0;"><input type="text" id="profile-name" value="'+esc(p.name)+'" onchange="saveProfileName(this.value)"/></div></div>';
  if(!p.surveyDone){html+='<div class="card" style="background:linear-gradient(135deg,rgba(255,169,64,.15),rgba(255,107,107,.1));border-color:rgba(255,169,64,.3);"><h2>📋 Опросник</h2><button class="btn btn-primary btn-block" onclick="startSurvey()">Начать</button></div>'}
  else{html+='<div class="card"><h2>📋 Профиль заполнен</h2><button class="btn btn-ghost btn-block" onclick="if(confirm(\'Заново?\')){state.profile.surveyDone=false;state.profile.surveyStep=0;save();startSurvey();}">Пройти заново</button></div>'}
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
  var html='<div class="emoji-grid">';
  emojis.forEach(function(e){
    var sel=e===state.profile.emoji?' selected':'';
    html+='<button class="emoji-pick'+sel+'" onclick="setEmoji(\''+e+'\')">'+e+'</button>';
  });
  html+='</div>';
  openSheet('Аватар',html);
}
function setEmoji(e){
  state.profile.emoji=e;
  save();
  closeSheet();
  toast('Обновлено','success');
  renderProfile();
  updateHeaderAvatar();
}
function saveProfileName(name){
  state.profile.name=(name||'').trim()||'Пользователь';
  save();
  toast('Сохранено','success');
  updateHeaderAvatar();
}
function updateHeaderAvatar(){
  var el=document.getElementById('headerAvatar');
  if(el)el.textContent=state.profile.emoji||'👤';
  var lvl=Math.floor((state.xp||0)/100);
  if(el)el.className='avatar-btn glass lvl-'+Math.min(lvl,5);
}

/* ============ SETTINGS ============ */
function renderSettings(){
  var html='<div class="page">'+backBtn('dashboard')+'<div class="title-xl">⚙️ Настройки</div>';
  html+='<div class="card"><h2>Профиль</h2><div class="field"><label class="field-label">Имя</label><input type="text" id="s-name" value="'+esc(state.profile.name)+'" onchange="saveProfileName(this.value)"/></div><div class="list-row" onclick="openThemePicker()"><div class="list-icon" style="background:var(--glass-2);">🎨</div><div class="list-body"><div class="list-title">Тема</div></div><div class="list-value">'+(THEMES.find(function(t){return t.id===state.settings.theme})||{}).name+'</div></div></div>';
  html+='<div class="card"><h2>AI</h2><div class="list-row" onclick="openAISettings()"><div class="list-icon" style="background:var(--brand);">✨</div><div class="list-body"><div class="list-title">'+state.settings.provider+'</div><div class="list-subtitle">'+(state.settings.apiKey?'Ключ установлен':'Не задан')+'</div></div><div class="list-chevron">›</div></div></div>';
  html+='<div class="card"><h2>Интеграции</h2><div class="list-row" onclick="navigate(\'integrations\')"><div class="list-icon" style="background:var(--glass-2);">🔗</div><div class="list-body"><div class="list-title">Google, Obsidian, Notion, Todoist, Gemini</div></div><div class="list-chevron">›</div></div></div>';
  html+='<div class="card"><h2>Данные</h2><div class="list-row" onclick="navigate(\'storage\')"><div class="list-icon" style="background:var(--coach);color:#000;">🗄</div><div class="list-body"><div class="list-title">Хранилище</div></div><div class="list-chevron">›</div></div><div class="list-row" onclick="navigate(\'dbmanager\')"><div class="list-icon" style="background:var(--success);color:#000;">💾</div><div class="list-body"><div class="list-title">База данных</div></div><div class="list-chevron">›</div></div></div>';
  html+='<div class="card"><h2>Синхронизация</h2><div class="list-row" onclick="cloudSync()"><div class="list-icon" style="background:var(--brand);">☁️</div><div class="list-body"><div class="list-title">Telegram Cloud</div><div class="list-subtitle">Синхронизировать данные</div></div><div class="list-chevron">›</div></div></div>';
  html+='<div class="footnote text-tertiary" style="text-align:center;margin-top:36px;">AI Health v32 · Vision UI</div></div>';
  document.getElementById('app').innerHTML=html;
}
function cloudSync(){
  try{
    if(window.Telegram&&Telegram.WebApp&&Telegram.WebApp.CloudStorage){
      Telegram.WebApp.CloudStorage.setItem('ai_health_v32',JSON.stringify(state),function(err,ok){
        if(err)toast('Ошибка Cloud','error');else toast('☁️ Синхронизировано','success');
      });
    } else {
      toast('Cloud недоступен','warning');
    }
  }catch(e){toast('Ошибка синхронизации','error')}
}
function renderDBManager(){
  var total=state.tasks.length+state.chats.length+(state.customNotes||[]).length+Object.keys(state.levelProgress||{}).length+Object.keys(state.englishProgress||{}).length+(state.watched||[]).length;
  var html='<div class="page">'+backBtn('settings')+'<div class="title-xl">💾 База</div>';
  html+='<div class="card"><div class="list-row"><div class="list-icon" style="background:var(--success);color:#000;">✓</div><div class="list-body"><div class="list-title">LocalStorage</div><div class="list-subtitle">'+STORAGE_KEY+'</div></div></div><div class="list-row"><div class="list-icon" style="background:var(--brand);">📦</div><div class="list-body"><div class="list-title">Записей</div></div><div class="list-value">'+total+'</div></div></div>';
  html+='<div class="card"><h2>Операции</h2><button class="btn btn-primary btn-block mb-2" onclick="exportDB()">📤 Экспорт</button><button class="btn btn-ghost btn-block mb-2" onclick="document.getElementById(\'importDB\').click()">📥 Импорт</button><input type="file" id="importDB" accept=".json" style="display:none" onchange="importDB(event)"/><button class="btn btn-danger btn-block" onclick="if(confirm(\'Сброс?\')){localStorage.removeItem(\''+STORAGE_KEY+'\');location.reload();}">🗑 Сброс</button></div></div>';
  document.getElementById('app').innerHTML=html;
}
function renderStorage(){
  var totalSize=0;
  try{var raw=localStorage.getItem(STORAGE_KEY);totalSize=raw?raw.length:0}catch(e){}
  var html='<div class="page">'+backBtn('settings')+'<div class="title-xl">🗄 Хранилище</div>';
  html+='<div class="card"><h2>💾 Основное</h2><div class="list-row"><div class="list-icon" style="background:var(--success);color:#000;">✓</div><div class="list-body"><div class="list-title">LocalStorage</div><div class="list-subtitle">'+STORAGE_KEY+'</div></div><div class="list-value">'+(totalSize/1024).toFixed(1)+' KB</div></div></div>';
  html+='<div class="card"><h2>⚙️ Операции</h2><button class="btn btn-primary btn-block mb-2" onclick="exportDB()">📤 Экспорт</button><button class="btn btn-ghost btn-block mb-2" onclick="document.getElementById(\'importDB\').click()">📥 Импорт</button><input type="file" id="importDB" accept=".json" style="display:none" onchange="importDB(event)"/><button class="btn btn-danger btn-block" onclick="if(confirm(\'Сброс?\')){localStorage.removeItem(\''+STORAGE_KEY+'\');location.reload();}">🗑 Сброс</button></div></div>';
  document.getElementById('app').innerHTML=html;
}
function exportDB(){
  var blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
  var url=URL.createObjectURL(blob);
  var a=document.createElement('a');
  a.href=url;a.download='ai-health-v32-'+today()+'.json';
  a.click();URL.revokeObjectURL(url);
  toast('Экспорт готов','success');
}
function importDB(e){
  var file=e.target.files[0];if(!file)return;
  var reader=new FileReader();
  reader.onload=function(ev){
    try{
      var data=JSON.parse(ev.target.result);
      if(!confirm('Заменить текущие данные?'))return;
      state=Object.assign(defaultState(),data);
      save();toast('Импорт успешен','success');location.reload();
    }catch(err){toast('Ошибка','error')}
  };
  reader.readAsText(file);
}

/* ============ STATS ============ */
function renderStats(){
  var doneTasks=state.tasks.filter(function(t){return t.status==='completed'}).length;
  var doneLessons=Object.keys(state.levelProgress||{}).length;
  var englishDone=Object.keys(state.englishProgress||{}).length;
  var skillsDone=Object.keys(state.skillsProgress||{}).length;
  var waterTotal=(state.customWater||[]).reduce(function(a,w){return a+(w.count||0)},0);
  var detoxCompleted=(typeof getCompletedDaysCount==='function')?getCompletedDaysCount():0;
  var html='<div class="page">'+backBtn('dashboard')+'<div class="title-xl">📊 Статистика</div>';
  html+='<div class="card card-gradient"><div style="opacity:.9;font-size:13px;">Всего уроков</div><div style="font-size:44px;font-weight:800;">'+doneLessons+'</div></div>';
  html+='<div class="stat-grid mb-4"><div class="stat-item"><div class="stat-value">'+doneTasks+'</div><div class="stat-label">Задач</div></div><div class="stat-item"><div class="stat-value">'+englishDone+'</div><div class="stat-label">English</div></div><div class="stat-item"><div class="stat-value">'+(state.stats.streak||0)+'</div><div class="stat-label">Streak</div></div></div>';
  html+='<div class="card"><h2>🎓 Обучение</h2>';
  LEARNING_LEVELS.forEach(function(l){
    var p=getLevelProgress(l.id);
    html+='<div style="margin-bottom:14px;"><div class="row-between mb-1"><span class="footnote">'+l.emoji+' '+l.title+'</span><span class="footnote text-secondary">'+p.pct+'%</span></div><div class="progress" style="height:6px;"><div class="progress-fill" style="width:'+p.pct+'%;"></div></div></div>';
  });
  html+='</div>';
  html+='<div class="card"><h2>💎 Навыки</h2><div class="stat-row"><span class="stat-row-label">Изучено</span><span class="stat-row-value">'+skillsDone+'/'+(window.__SKILLS_LIBRARY?window.__SKILLS_LIBRARY.length:0)+'</span></div></div>';
  html+='<div class="card"><h2>💧 Вода</h2><div class="stat-row"><span class="stat-row-label">Всего стаканов</span><span class="stat-row-value">'+waterTotal+'</span></div></div>';
  html+='<div class="card"><h2>📱 Детокс-курс</h2><div class="stat-row"><span class="stat-row-label">Пройдено дней</span><span class="stat-row-value">'+detoxCompleted+'/30</span></div></div>';
  html+='<button class="btn btn-primary btn-block" onclick="navigate(\'detailedStats\')">📊 Подробная статистика</button></div>';
  document.getElementById('app').innerHTML=html;
}
function renderDetailedStats(){
  var doneTasks=state.tasks.filter(function(t){return t.status==='completed'}).length;
  var pendingTasks=state.tasks.filter(function(t){return t.status==='pending'}).length;
  var doneLessons=Object.keys(state.levelProgress||{}).length;
  var englishDone=Object.keys(state.englishProgress||{}).length;
  var skillsDone=Object.keys(state.skillsProgress||{}).length;
  var waterTotal=(state.customWater||[]).reduce(function(a,w){return a+(w.count||0)},0);
  var moodTotal=(state.customMood||[]).length;
  var workoutTotal=(state.customWorkouts||[]).length;
  var meditationTotal=(state.customMeditation||[]).length;
  var notesTotal=(state.customNotes||[]).length;
  var journalTotal=(state.journalEntries||[]).length;
  var chatsTotal=state.chats.filter(function(c){return c.role==='user'}).length;
  var watchedTotal=(state.watched||[]).length;
  var watchlistTotal=(state.watchlist||[]).length;
  var habitsTotal=(state.customHabits||[]).length;
  var goalsTotal=(state.customGoals||[]).length;
  var achievementsTotal=(state.profile.achievements||[]).length;
  var detoxCompleted=(typeof getCompletedDaysCount==='function')?getCompletedDaysCount():0;
  var html='<div class="page">'+backBtn('stats')+'<div class="title-xl">📈 Детальная статистика</div>';
  html+='<div class="group-card"><div class="group-title">📋 Задачи</div><div class="stat-row"><span class="stat-row-label">Всего</span><span class="stat-row-value">'+state.tasks.length+'</span></div><div class="stat-row"><span class="stat-row-label">Выполнено</span><span class="stat-row-value" style="color:var(--success);">'+doneTasks+'</span></div><div class="stat-row"><span class="stat-row-label">Активных</span><span class="stat-row-value" style="color:var(--warning);">'+pendingTasks+'</span></div></div>';
  html+='<div class="group-card"><div class="group-title">🎓 Обучение</div><div class="stat-row"><span class="stat-row-label">Уроков уровней</span><span class="stat-row-value">'+doneLessons+'</span></div><div class="stat-row"><span class="stat-row-label">English</span><span class="stat-row-value">'+englishDone+'</span></div><div class="stat-row"><span class="stat-row-label">Навыки</span><span class="stat-row-value">'+skillsDone+'</span></div></div>';
  html+='<div class="group-card"><div class="group-title">❤️ Здоровье</div><div class="stat-row"><span class="stat-row-label">💧 Вода</span><span class="stat-row-value">'+waterTotal+'</span></div><div class="stat-row"><span class="stat-row-label">💭 Настроений</span><span class="stat-row-value">'+moodTotal+'</span></div><div class="stat-row"><span class="stat-row-label">🏋️ Тренировок</span><span class="stat-row-value">'+workoutTotal+'</span></div><div class="stat-row"><span class="stat-row-label">🧘 Медитаций</span><span class="stat-row-value">'+meditationTotal+'</span></div></div>';
  html+='<div class="group-card"><div class="group-title">📝 Личное</div><div class="stat-row"><span class="stat-row-label">Заметок</span><span class="stat-row-value">'+notesTotal+'</span></div><div class="stat-row"><span class="stat-row-label">Дневник</span><span class="stat-row-value">'+journalTotal+'</span></div><div class="stat-row"><span class="stat-row-label">Привычек</span><span class="stat-row-value">'+habitsTotal+'</span></div><div class="stat-row"><span class="stat-row-label">Целей</span><span class="stat-row-value">'+goalsTotal+'</span></div></div>';
  html+='<div class="group-card"><div class="group-title">🎬 Досуг</div><div class="stat-row"><span class="stat-row-label">Просмотрено</span><span class="stat-row-value">'+watchedTotal+'</span></div><div class="stat-row"><span class="stat-row-label">В списке</span><span class="stat-row-value">'+watchlistTotal+'</span></div></div>';
  html+='<div class="group-card"><div class="group-title">📱 Детокс-курс</div><div class="stat-row"><span class="stat-row-label">Пройдено дней</span><span class="stat-row-value">'+detoxCompleted+'/30</span></div></div>';
  html+='<div class="group-card"><div class="group-title">✨ AI</div><div class="stat-row"><span class="stat-row-label">Сообщений</span><span class="stat-row-value">'+chatsTotal+'</span></div><div class="stat-row"><span class="stat-row-label">Достижений</span><span class="stat-row-value">'+achievementsTotal+'/'+ACHIEVEMENTS.length+'</span></div></div>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}

/* ============ MATRIX ============ */
function renderMatrix(){
  var matrix={q1:[],q2:[],q3:[],q4:[]};
  state.tasks.forEach(function(t){
    if(t.status==='completed')return;
    var important=t.priority==='high'||t.priority==='medium';
    var urgent=t.due_date?daysBetween(today(),t.due_date.slice(0,10))<=2:false;
    var q;
    if(important&&urgent)q='q1';
    else if(important&&!urgent)q='q2';
    else if(!important&&urgent)q='q3';
    else q='q4';
    matrix[q].push(t);
  });
  var html='<div class="page">'+backBtn('dashboard')+'<div class="title-xl">🔢 Матрица Эйзенхауэра</div>';
  html+='<div class="matrix-grid-2x2"><div class="matrix-quadrant matrix-q1"><div class="matrix-q-title">🔥 Q1</div><div class="matrix-q-count" style="color:var(--danger);">'+matrix.q1.length+'</div><div class="matrix-q-sub">Делай сейчас</div></div><div class="matrix-quadrant matrix-q2"><div class="matrix-q-title">📌 Q2</div><div class="matrix-q-count" style="color:var(--brand);">'+matrix.q2.length+'</div><div class="matrix-q-sub">Планируй</div></div><div class="matrix-quadrant matrix-q3"><div class="matrix-q-title">⚡ Q3</div><div class="matrix-q-count" style="color:var(--warning);">'+matrix.q3.length+'</div><div class="matrix-q-sub">Делегируй</div></div><div class="matrix-quadrant matrix-q4"><div class="matrix-q-title">🗑 Q4</div><div class="matrix-q-count" style="color:var(--text-3);">'+matrix.q4.length+'</div><div class="matrix-q-sub">Удали</div></div></div></div>';
  document.getElementById('app').innerHTML=html;
}

/* ============ INTEGRATIONS ============ */
function renderIntegrations(){
  var g=state.integrations.googleCalendar||{};
  var o=state.integrations.obsidian||{};
  var gem=state.integrations.gemini||{};
  var hasKey=gem&&gem.apiKey;
  var html='<div class="page">'+backBtn('settings')+'<div class="title-xl">🔗 Интеграции</div>';
  html+='<div class="integration-card"><div class="integration-header"><div class="integration-icon">📅</div><div style="flex:1;"><div class="integration-title">Google Calendar</div><div class="integration-status">'+(g.connected?'✓ Подключено':'Не подключено')+'</div></div></div><div class="field mt-3"><label class="field-label">Client ID</label><input type="text" id="gcal-id" value="'+esc(g.clientId||'')+'"/></div><button class="btn btn-primary btn-block" onclick="saveGCal()">💾 Сохранить</button><button class="btn btn-success btn-block mt-2" onclick="if(window.GCAL_API)GCAL_API.authorize()">🔓 Авторизоваться</button><button class="btn btn-ghost btn-block mt-2" onclick="if(window.__syncTasksToGCal)__syncTasksToGCal()">📤 Синхронизировать</button></div>';
  html+='<div class="integration-card"><div class="integration-header"><div class="integration-icon">🔮</div><div style="flex:1;"><div class="integration-title">Obsidian</div><div class="integration-status">'+(o.apiKey?'✓':'Не подключено')+'</div></div></div><div class="field mt-3"><label class="field-label">API Key</label><input type="password" id="obs-key" value="'+esc(o.apiKey||'')+'"/></div><div class="field"><label class="field-label">Папка</label><input type="text" id="obs-folder" value="'+esc(o.defaultFolder||'AI-Health')+'"/></div><button class="btn btn-primary btn-block" onclick="saveObsidian()">💾 Сохранить</button><button class="btn btn-success btn-block mt-2" onclick="if(window.__syncAllToObsidian)__syncAllToObsidian()">📤 Синхронизировать всё</button></div>';
  html+='<div class="integration-card"><div class="integration-header"><div class="integration-icon">✨</div><div style="flex:1;"><div class="integration-title">Gemini AI</div><div class="integration-status">'+(hasKey?'✓':'Не подключено')+'</div></div></div><div class="field mt-3"><label class="field-label">API Key</label><input type="password" id="gem-key" value="'+esc(gem.apiKey||'')+'"/></div><button class="btn btn-primary btn-block" onclick="saveGemini()">💾 Сохранить</button></div>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function saveGCal(){
  state.integrations.googleCalendar.clientId=(document.getElementById('gcal-id')||{}).value||'';
  state.integrations.googleCalendar.connected=!!state.integrations.googleCalendar.clientId;
  if(window.GCAL_CONFIG)GCAL_CONFIG.clientId=state.integrations.googleCalendar.clientId;
  save();
  if(window.__saveGCalConfig)__saveGCalConfig();
  toast('Сохранено','success');renderIntegrations();
}
function saveObsidian(){
  state.integrations.obsidian.apiKey=(document.getElementById('obs-key')||{}).value||'';
  state.integrations.obsidian.defaultFolder=(document.getElementById('obs-folder')||{}).value||'AI-Health';
  if(window.OBSIDIAN_CONFIG){OBSIDIAN_CONFIG.apiKey=state.integrations.obsidian.apiKey;OBSIDIAN_CONFIG.defaultFolder=state.integrations.obsidian.defaultFolder}
  save();
  if(window.__saveObsidianConfig)__saveObsidianConfig();
  toast('Сохранено','success');renderIntegrations();
}
function saveGemini(){
  state.integrations.gemini.apiKey=(document.getElementById('gem-key')||{}).value||'';
  state.integrations.gemini.connected=!!state.integrations.gemini.apiKey;
  state.settings.apiKey=state.integrations.gemini.apiKey;
  state.settings.provider='gemini';
  if(window.GEMINI_CONFIG)GEMINI_CONFIG.apiKey=state.integrations.gemini.apiKey;
  save();toast('Gemini подключён','success');renderIntegrations();
}

/* ============ AI ============ */
function renderAI(){
  var active=state.settings.activePersona||'coach';
  var persona=PERSONAS[active]||PERSONAS.coach;
  var messages=state.chats.filter(function(c){return c.persona===active});
  var hasKey=!!(state.settings.apiKey||(state.integrations.gemini&&state.integrations.gemini.apiKey));
  var html='<div class="page">'+backBtn('dashboard')+'<div class="title-xl">✨ AI</div><div class="persona-bar">';
  Object.keys(PERSONAS).forEach(function(k){
    var p=PERSONAS[k];
    html+='<button class="persona-item '+(active===k?'active':'')+'" data-p="'+k+'" onclick="switchPersona(\''+k+'\')">'+p.name+'</button>';
  });
  html+='</div>';
  html+='<div class="card" style="padding:16px 18px;"><div class="row-between"><div class="row" style="gap:12px;"><div style="font-size:28px;">'+persona.emoji+'</div><div><div style="font-weight:700;font-size:16px;">'+persona.name+'</div><div class="caption text-tertiary">'+persona.label+(hasKey?'':' · Demo')+'</div></div></div><button class="btn btn-ghost btn-sm" onclick="openAISettings()">⚙️</button></div></div>';
  html+='<div class="card" style="min-height:360px;max-height:62vh;overflow-y:auto;padding:18px;" id="chatBox"><div class="chat">';
  if(messages.length){messages.forEach(function(m){html+='<div class="msg msg-'+(m.role==='user'?'user':'bot')+'">'+(m.role==='user'?esc(m.text):renderMd(m.text))+'</div>'})}
  else{html+='<div class="empty"><div class="empty-icon">'+persona.emoji+'</div><div class="empty-title">'+persona.name+'</div><div class="empty-text">Задай вопрос</div></div>'}
  html+='</div></div>';
  html+='<div class="row" style="margin-top:14px;"><input type="text" id="chatInput" placeholder="Сообщение..." style="flex:1;" onkeydown="if(event.key===\'Enter\'){event.preventDefault();sendMsg();}"/><button class="btn btn-primary btn-icon" onclick="sendMsg()">➤</button></div></div>';
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
  var provider=state.settings.provider||'gemini';
  if(!key)return fallbackReply(persona,userText);
  var p=PERSONAS[persona];
  var history=state.chats.filter(function(c){return c.persona===persona}).slice(-10);
  var messages=[{role:'system',content:p.prompt}];
  history.forEach(function(m){messages.push({role:m.role==='user'?'user':'assistant',content:m.text})});
  try{
    if(provider==='openai'){
      var resp=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+key},body:JSON.stringify({model:'gpt-4o-mini',messages:messages,temperature:.8,max_tokens:800})});
      var data=await resp.json();
      return (data.choices&&data.choices[0]&&data.choices[0].message&&data.choices[0].message.content)||fallbackReply(persona,userText);
    } else {
      var sys=p.prompt;
      var rest=history.map(function(m){return{role:m.role==='user'?'user':'model',parts:[{text:m.text}]}});
      var model=(state.integrations.gemini&&state.integrations.gemini.model)||'gemini-1.5-flash';
      var resp3=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+model+':generateContent?key='+key,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({system_instruction:{parts:[{text:sys}]},contents:rest})});
      var data3=await resp3.json();
      return (data3.candidates&&data3.candidates[0]&&data3.candidates[0].content&&data3.candidates[0].content.parts&&data3.candidates[0].content.parts[0]&&data3.candidates[0].content.parts[0].text)||fallbackReply(persona,userText);
    }
  }catch(e){console.error(e);return fallbackReply(persona,userText)}
}
function fallbackReply(persona,text){
  text=text||'';
  if(/суицид|покончить|не хочу жить|умереть/i.test(text)){return '🆘 Позвони: 8-800-2000-122 (РФ) · 103 · findahelpline.com. Ты важен.'}
  if(persona==='doctor')return 'Я — AI-консультант. Опиши симптомы.\n\n*⚠️ Не заменяет врача.*';
  if(persona==='psych')return 'Слышу тебя. Что происходит?';
  return 'Слышу тебя. Расскажи подробнее.';
}
function renderMd(text){
  if(!text)return '';
  var h=esc(text);
  h=h.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
  h=h.replace(/^[•\-] (.+)$/gm,'<li>$1</li>');
  h=h.replace(/(<li>[\s\S]*?<\/li>)(?!\s*<li>)/g,'<ul>$1</ul>');
  h=h.replace(/\n\n/g,'</p><p>');
  h=h.replace(/\n/g,'<br>');
  return '<p>'+h+'</p>';
}
function openAISettings(){
  openSheet('Настройки AI','<div class="field"><label class="field-label">Провайдер</label><select id="ai-p"><option value="gemini"'+(state.settings.provider==='gemini'?' selected':'')+'>Google Gemini</option><option value="openai"'+(state.settings.provider==='openai'?' selected':'')+'>OpenAI</option></select></div><div class="field"><label class="field-label">API ключ</label><input type="password" id="ai-k" value="'+esc(state.settings.apiKey||'')+'"/></div><button class="btn btn-primary btn-block" onclick="saveAISettings()">Сохранить</button>');
}
function saveAISettings(){
  state.settings.provider=(document.getElementById('ai-p')||{}).value||'gemini';
  state.settings.apiKey=((document.getElementById('ai-k')||{}).value||'').trim();
  save();closeSheet();toast('Сохранено','success');renderAI();
}

/* ============ HEALTH ============ */
function renderHealth(){
  var waterEntry=state.customWater.find(function(w){return w.date===today()});
  var water=waterEntry?waterEntry.count:0;
  var waterGoal=state.settings.waterGoal||8;
  var todayScores=(state.domainScores||{})[today()]||{};
  var html='<div class="page">'+backBtn('dashboard')+'<div class="title-xl">❤️ Здоровье</div>';
  html+='<div class="card"><h2>Сегодня</h2><div class="stat-grid"><div class="stat-item" onclick="quickMoodLog()" style="cursor:pointer;"><div class="stat-value">'+(state.customMood.length?state.customMood[state.customMood.length-1].score+'/10':'—')+'</div><div class="stat-label">Настроение</div></div><div class="stat-item" onclick="addWater()" style="cursor:pointer;"><div class="stat-value">'+water+'/'+waterGoal+'</div><div class="stat-label">Вода</div></div><div class="stat-item" onclick="navigate(\'workouts\')" style="cursor:pointer;"><div class="stat-value">'+(state.customWorkouts||[]).length+'</div><div class="stat-label">Тренировок</div></div></div></div>';
  html+='<div class="card"><h2>🌐 Домены</h2>';
  DOMAINS.forEach(function(d){
    var score=todayScores[d.id]||0;
    html+='<div class="list-row" onclick="openDomain(\''+d.id+'\')"><div class="list-icon" style="background:'+d.color+'20;color:'+d.color+';">'+d.emoji+'</div><div class="list-body"><div class="list-title">'+d.name+'</div><div class="list-subtitle">'+(score>0?score+'/10':'Не оценено')+'</div></div><div class="list-chevron">›</div></div>';
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
  if(currentPage==='dashboard')renderDashboard();else renderHealth();
}
function quickMoodLog(){
  var moods=['😢','😔','😐','🙂','😊'];
  var html='<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px;">';
  moods.forEach(function(m,i){
    html+='<button class="btn btn-ghost" style="font-size:36px;padding:24px 0;" onclick="saveMood('+((i+1)*2)+')">'+m+'</button>';
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
  if(currentPage==='dashboard')renderDashboard();else renderHealth();
}

/* ============ SIMPLE ============ */
function renderWater(){
  var entry=state.customWater.find(function(w){return w.date===today()});
  var count=entry?entry.count:0;
  var goal=state.settings.waterGoal||8;
  var html='<div class="page">'+backBtn('health')+'<div class="title-xl">💧 Вода</div>';
  html+='<div class="card card-gradient" style="text-align:center;"><div style="font-size:64px;">💧</div><div style="font-size:44px;font-weight:800;">'+count+'/'+goal+'</div><div class="progress" style="margin-top:14px;background:rgba(255,255,255,.25);height:8px;"><div class="progress-fill" style="width:'+Math.min(100,count/goal*100)+'%;background:#fff;"></div></div></div>';
  html+='<button class="btn btn-primary btn-block" onclick="addWater();renderWater()">+1 стакан</button></div>';
  document.getElementById('app').innerHTML=html;
}
function renderMood(){
  var m=state.customMood||[];
  var html='<div class="page">'+backBtn('health')+'<div class="title-xl">💭 Настроение</div>';
  html+='<button class="btn btn-primary btn-block mb-4" onclick="quickMoodLog()">Записать настроение</button>';
  if(m.length){m.slice(-10).reverse().forEach(function(e){html+='<div class="list-row"><div class="list-icon" style="background:var(--glass-2);">'+(e.score>=7?'😊':e.score>=5?'🙂':'😔')+'</div><div class="list-body"><div class="list-title">'+e.date+'</div><div class="list-subtitle">'+e.score+'/10</div></div></div>'})}
  else{html+='<div class="empty"><div class="empty-icon">💭</div><div class="empty-title">Пусто</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderWorkouts(){
  var w=state.customWorkouts||[];
  var html='<div class="page">'+backBtn('health')+'<div class="row-between" style="margin-bottom:20px;"><div class="title-xl" style="margin:0;">🏋️ Тренировки</div><button class="btn btn-primary btn-sm" onclick="openEntityEditor(\'workout\',null)">+ Новая</button></div>';
  if(w.length){w.forEach(function(x){html+='<div class="list-row" onclick="openEntityEditor(\'workout\',\''+x.id+'\')"><div class="list-icon" style="background:var(--fitness);color:#000;">🏋️</div><div class="list-body"><div class="list-title">'+esc(x.title)+'</div><div class="list-subtitle">'+(x.duration||60)+' мин · Интенсивность '+x.intensity+'</div></div></div>'})}
  else{html+='<div class="empty"><div class="empty-icon">🏋️</div><div class="empty-title">Нет тренировок</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderMeditation(){
  var m=state.customMeditation||[];
  var html='<div class="page">'+backBtn('health')+'<div class="row-between" style="margin-bottom:20px;"><div class="title-xl" style="margin:0;">🧘 Медитации</div><button class="btn btn-primary btn-sm" onclick="openEntityEditor(\'meditation\',null)">+ Новая</button></div>';
  if(m.length){m.forEach(function(x){html+='<div class="list-row" onclick="openEntityEditor(\'meditation\',\''+x.id+'\')"><div class="list-icon" style="background:var(--glass-2);">🧘</div><div class="list-body"><div class="list-title">'+esc(x.title)+'</div><div class="list-subtitle">'+(x.duration||10)+' мин · Качество '+x.quality+'</div></div></div>'})}
  else{html+='<div class="empty"><div class="empty-icon">🧘</div><div class="empty-title">Нет медитаций</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderMeds(){
  var m=state.customMeds||[];
  var html='<div class="page">'+backBtn('health')+'<div class="row-between" style="margin-bottom:20px;"><div class="title-xl" style="margin:0;">💊 Лекарства</div><button class="btn btn-primary btn-sm" onclick="openEntityEditor(\'med\',null)">+ Новое</button></div>';
  if(m.length){m.forEach(function(x){html+='<div class="list-row" onclick="openEntityEditor(\'med\',\''+x.id+'\')"><div class="list-icon" style="background:var(--glass-2);">💊</div><div class="list-body"><div class="list-title">'+esc(x.title)+'</div><div class="list-subtitle">'+esc(x.dosage||'')+' '+(x.time?'· '+x.time:'')+'</div></div></div>'})}
  else{html+='<div class="empty"><div class="empty-icon">💊</div><div class="empty-title">Нет лекарств</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderJournal(){
  var entries=state.journalEntries||[];
  var html='<div class="page">'+backBtn('more')+'<div class="row-between" style="margin-bottom:20px;"><div class="title-xl" style="margin:0;">📓 Дневник</div><button class="btn btn-primary btn-sm" onclick="openEntityEditor(\'journal\',null)">+ Запись</button></div>';
  if(entries.length){entries.slice().reverse().forEach(function(e){html+='<div class="card" onclick="openEntityEditor(\'journal\',\''+e.id+'\')" style="cursor:pointer;"><div class="footnote text-tertiary">'+e.date+'</div><div style="margin-top:8px;font-weight:600;">'+esc(e.title||'Запись')+'</div>';if(e.wins)html+='<div class="footnote text-secondary mt-2">✅ '+esc(e.wins).slice(0,100)+'</div>';html+='</div>'})}
  else{html+='<div class="empty"><div class="empty-icon">📓</div><div class="empty-title">Пусто</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderNotes(){
  var notes=state.customNotes||[];
  var html='<div class="page">'+backBtn('more')+'<div class="row-between" style="margin-bottom:20px;"><div class="title-xl" style="margin:0;">📝 Заметки</div><button class="btn btn-primary btn-sm" onclick="openEntityEditor(\'note\',null)">+ Новая</button></div>';
  if(notes.length){notes.forEach(function(n){html+='<div class="card" onclick="openEntityEditor(\'note\',\''+n.id+'\')" style="cursor:pointer;"><div class="list-title">'+esc(n.title||'Без названия')+'</div><div class="footnote text-secondary mt-2">'+esc((n.content||'').slice(0,150))+'</div></div>'})}
  else{html+='<div class="empty"><div class="empty-icon">📝</div><div class="empty-title">Пусто</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderGoals(){
  var goals=state.customGoals||[];
  var html='<div class="page">'+backBtn('more')+'<div class="row-between" style="margin-bottom:20px;"><div class="title-xl" style="margin:0;">🎯 Цели</div><button class="btn btn-primary btn-sm" onclick="openEntityEditor(\'goal\',null)">+ Новая</button></div>';
  if(goals.length){goals.forEach(function(g){var pct=g.target?(g.current||0)/g.target*100:0;html+='<div class="card" onclick="openEntityEditor(\'goal\',\''+g.id+'\')" style="cursor:pointer;"><div class="list-title">'+esc(g.title)+'</div><div class="footnote text-secondary">'+esc(g.category||'')+' '+(g.metric?'· '+g.current+'/'+g.target+' '+g.metric:'')+'</div>';if(g.target)html+='<div class="progress mt-2"><div class="progress-fill" style="width:'+Math.min(100,pct)+'%;"></div></div>';html+='</div>'})}
  else{html+='<div class="empty"><div class="empty-icon">🎯</div><div class="empty-title">Нет целей</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderHabits(){
  var habits=state.customHabits||[];
  var html='<div class="page">'+backBtn('more')+'<div class="row-between" style="margin-bottom:20px;"><div class="title-xl" style="margin:0;">🔄 Привычки</div><button class="btn btn-primary btn-sm" onclick="openEntityEditor(\'habit\',null)">+ Новая</button></div>';
  html+='<div class="card"><h2>Мои привычки</h2>';
  if(habits.length){habits.forEach(function(h){html+='<div class="habit-row" onclick="openEntityEditor(\'habit\',\''+h.id+'\')"><div class="habit-icon">'+(h.icon||'✅')+'</div><div class="habit-body"><div class="habit-title">'+esc(h.title)+'</div><div class="habit-streak">'+esc(h.category||'')+'</div></div></div>'})}
  else{html+='<div class="empty"><div class="empty-icon">🔄</div><div class="empty-title">Нет привычек</div></div>'}
  html+='</div>';
  html+='<div class="card"><h2>Шаблоны</h2>';
  HABITS_TEMPLATES.forEach(function(h){
    var added=habits.some(function(x){return x.title===h.title});
    if(!added)html+='<div class="habit-row" onclick="addHabitFromTemplate(\''+h.id+'\')"><div class="habit-icon">'+h.icon+'</div><div class="habit-body"><div class="habit-title">'+h.title+'</div><div class="habit-streak">'+h.category+'</div></div><div class="habit-check">+</div></div>';
  });
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
function addHabitFromTemplate(tid){
  var tpl=HABITS_TEMPLATES.find(function(h){return h.id===tid});
  if(!tpl)return;
  if(!state.customHabits)state.customHabits=[];
  state.customHabits.push({id:uid(),title:tpl.title,icon:tpl.icon,category:tpl.category,frequency:'daily',created_at:nowISO()});
  save();toast('Привычка добавлена','success');renderHabits();
}

/* ============ TIMER ============ */
var timerInterval=null;
var timerSeconds=25*60;
var timerRunning=false;
var timerMode='pomodoro';
function renderTimer(){
  var hours=Math.floor(timerSeconds/3600);
  var minutes=Math.floor((timerSeconds%3600)/60);
  var seconds=timerSeconds%60;
  var display=(hours>0?String(hours).padStart(2,'0')+':':'')+String(minutes).padStart(2,'0')+':'+String(seconds).padStart(2,'0');
  var html='<div class="page">'+backBtn('dashboard')+'<div class="title-xl">⏱ Таймер</div>';
  html+='<div class="card" style="text-align:center;padding:40px 20px;"><div style="font-size:72px;font-weight:800;line-height:1;letter-spacing:-.04em;font-variant-numeric:tabular-nums;" id="timerDisplay">'+display+'</div>';
  html+='<div class="footnote text-secondary mt-3">'+({pomodoro:'🍅 Помодоро 25/5',short:'☕ Короткий 5 мин',long:'🌿 Длинный 15 мин',deep:'🎯 Deep Work 90 мин'}[timerMode]||'Таймер')+'</div></div>';
  html+='<div class="card"><div class="btn-row" style="justify-content:center;">';
  if(!timerRunning)html+='<button class="btn btn-primary" onclick="startTimer()">▶ Старт</button>';
  else html+='<button class="btn btn-warning" onclick="pauseTimer()">⏸ Пауза</button>';
  html+='<button class="btn btn-ghost" onclick="resetTimer()">🔄 Сброс</button>';
  html+='<button class="btn btn-success" onclick="finishTimer()">✓ Завершить</button>';
  html+='</div></div>';
  html+='<div class="card"><h2>Режимы</h2><div class="btn-row">';
  html+='<button class="btn '+(timerMode==='pomodoro'?'btn-primary':'btn-ghost')+'" onclick="setTimerMode(\'pomodoro\')">🍅 25 мин</button>';
  html+='<button class="btn '+(timerMode==='short'?'btn-primary':'btn-ghost')+'" onclick="setTimerMode(\'short\')">☕ 5 мин</button>';
  html+='<button class="btn '+(timerMode==='long'?'btn-primary':'btn-ghost')+'" onclick="setTimerMode(\'long\')">🌿 15 мин</button>';
  html+='<button class="btn '+(timerMode==='deep'?'btn-primary':'btn-ghost')+'" onclick="setTimerMode(\'deep\')">🎯 90 мин</button>';
  html+='</div></div>';
  var sessions=state.timerSessions||[];
  html+='<div class="card"><h2>Сессии ('+sessions.length+')</h2>';
  if(sessions.length){sessions.slice(-5).reverse().forEach(function(s){html+='<div class="stat-row"><span class="stat-row-label">'+s.duration+' мин · '+s.mode+'</span><span class="stat-row-value">'+s.date+'</span></div>'})}
  else{html+='<div class="footnote text-tertiary">Пока нет сессий</div>'}
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
    if(timerSeconds<=0){pauseTimer();toast('⏰ Время вышло!','success');return}
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
  save();toast('✓ Сессия завершена','success');haptic('success');
  checkAchievements();
  resetTimer();
}

/* ============ FOCUS ============ */
function renderFocus(){
  var sessions=state.focusSessions||[];
  var html='<div class="page">'+backBtn('dashboard')+'<div class="title-xl">🎯 Фокус</div>';
  html+='<div class="card"><h2>Режимы работы</h2>';
  html+='<div class="list-row" onclick="startFocusSession(\'Deep Work\',90)"><div class="list-icon" style="background:var(--brand);color:#fff;">🎯</div><div class="list-body"><div class="list-title">Deep Work</div><div class="list-subtitle">90 минут</div></div><div class="list-chevron">›</div></div>';
  html+='<div class="list-row" onclick="startFocusSession(\'Pomodoro\',25)"><div class="list-icon" style="background:var(--warning);color:#000;">🍅</div><div class="list-body"><div class="list-title">Pomodoro</div><div class="list-subtitle">25 минут</div></div><div class="list-chevron">›</div></div>';
  html+='<div class="list-row" onclick="startFocusSession(\'Sprint\',15)"><div class="list-icon" style="background:var(--success);color:#000;">⚡</div><div class="list-body"><div class="list-title">Sprint</div><div class="list-subtitle">15 минут</div></div><div class="list-chevron">›</div></div>';
  html+='</div>';
  html+='<div class="card"><h2>История ('+sessions.length+')</h2>';
  if(sessions.length){sessions.slice(-5).reverse().forEach(function(s){html+='<div class="stat-row"><span class="stat-row-label">'+s.name+' · '+s.duration+' мин</span><span class="stat-row-value">'+s.date+'</span></div>'})}
  else{html+='<div class="footnote text-tertiary">Пока нет сессий</div>'}
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}
function startFocusSession(name,duration){
  if(!state.focusSessions)state.focusSessions=[];
  state.focusSessions.push({id:uid(),name:name,duration:duration,date:today(),created_at:nowISO()});
  save();toast('✓ '+name+' завершён!','success');haptic('success');
  checkAchievements();renderFocus();
}

/* ============ ENTERTAINMENT ============ */
function renderEntertainment(){
  var html='<div class="page">'+backBtn('dashboard')+'<div class="title-xl">🎬 Досуг</div>';
  var eStats=(window.__getEntertainmentStats?window.__getEntertainmentStats():{movies_watched:0,books_read:0,avg_rating:0});
  html+='<div class="stat-grid mb-4"><div class="stat-item"><div class="stat-value">'+(state.watched||[]).length+'</div><div class="stat-label">Просмотрено</div></div><div class="stat-item"><div class="stat-value">'+(state.watchlist||[]).length+'</div><div class="stat-label">В списке</div></div><div class="stat-item"><div class="stat-value">'+eStats.avg_rating+'</div><div class="stat-label">Ср.оценка</div></div></div>';
  html+='<div class="card"><h2>🎥 Фильмы</h2><button class="btn btn-primary btn-block" onclick="navigate(\'movies\')">Открыть</button></div>';
  html+='<div class="card"><h2>📺 Сериалы</h2><button class="btn btn-primary btn-block" onclick="navigate(\'series\')">Открыть</button></div>';
  html+='<div class="card"><h2>📚 Книги</h2><button class="btn btn-primary btn-block" onclick="navigate(\'books\')">Открыть</button></div>';
  html+='<div class="card"><h2>🎵 Музыка</h2><button class="btn btn-primary btn-block" onclick="navigate(\'musiclib\')">Открыть</button></div>';
  html+='<div class="card"><h2>🎮 Игры</h2><button class="btn btn-primary btn-block" onclick="navigate(\'gameslib\')">Открыть</button></div>';
  html+='<div class="card"><h2>🎧 Подкасты</h2><button class="btn btn-primary btn-block" onclick="navigate(\'podcastslib\')">Открыть</button></div>';
  html+='<div class="card"><h2>📋 Мой список</h2><button class="btn btn-ghost btn-block" onclick="navigate(\'watchlist\')">Хочу посмотреть</button><button class="btn btn-ghost btn-block mt-2" onclick="navigate(\'watched\')">Просмотрено</button></div>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderMovies(){
  var lib=window.__MOVIES_LIBRARY||[];
  var html='<div class="page">'+backBtn('entertainment')+'<div class="title-xl">🎥 Фильмы</div>';
  lib.forEach(function(m){
    html+='<div class="ent-card"><div class="ent-poster">🎬</div><div class="ent-body"><div class="ent-title">'+esc(m.title)+' ('+m.year+')</div><div class="ent-meta">'+esc(m.genre)+' · '+esc(m.director)+'</div><div class="ent-desc">'+esc(m.desc)+'</div><div class="ent-rating">⭐ '+m.rating+'</div><div class="btn-row mt-2"><button class="btn btn-ghost btn-xs" onclick="addToWatchlist({id:\''+m.id+'\',title:\''+esc(m.title)+'\'},\'movie\');toast(\'Добавлено\',\'success\');">+ В список</button></div></div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderSeries(){
  var lib=window.__SERIES_LIBRARY||[];
  var html='<div class="page">'+backBtn('entertainment')+'<div class="title-xl">📺 Сериалы</div>';
  lib.forEach(function(m){
    html+='<div class="ent-card"><div class="ent-poster">📺</div><div class="ent-body"><div class="ent-title">'+esc(m.title)+'</div><div class="ent-meta">'+m.year+' · '+m.seasons+' сезонов</div><div class="ent-desc">'+esc(m.desc)+'</div><div class="ent-rating">⭐ '+m.rating+'</div></div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderBooks(){
  var lib=window.__BOOKS_LIBRARY||[];
  var html='<div class="page">'+backBtn('entertainment')+'<div class="title-xl">📚 Книги</div>';
  lib.forEach(function(m){
    html+='<div class="ent-card"><div class="ent-poster">📚</div><div class="ent-body"><div class="ent-title">'+esc(m.title)+'</div><div class="ent-meta">'+esc(m.author)+' · '+m.year+'</div><div class="ent-desc">'+esc(m.desc)+'</div><div class="ent-rating">⭐ '+m.rating+'</div></div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderMusic(){
  var lib=window.__MUSIC_LIBRARY||[];
  var html='<div class="page">'+backBtn('entertainment')+'<div class="title-xl">🎵 Музыка</div>';
  lib.forEach(function(m){
    html+='<div class="method-card"><div class="method-header"><div class="method-emoji">🎵</div><div style="flex:1;"><div class="method-title">'+esc(m.title)+'</div><div class="method-cat">'+esc(m.genre)+'</div></div></div><div class="method-desc">'+esc(m.desc)+'</div><a class="video-link spotify" href="https://open.spotify.com/search/'+encodeURIComponent(m.title)+'" target="_blank"><span class="video-icon">🎧</span>Слушать в Spotify</a><a class="video-link youtube" href="https://www.youtube.com/results?search_query='+encodeURIComponent(m.title)+'" target="_blank"><span class="video-icon">▶</span>Смотреть на YouTube</a></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderGames(){
  var lib=window.__GAMES_LIBRARY||[];
  var html='<div class="page">'+backBtn('entertainment')+'<div class="title-xl">🎮 Игры</div>';
  lib.forEach(function(m){
    html+='<div class="ent-card"><div class="ent-poster">🎮</div><div class="ent-body"><div class="ent-title">'+esc(m.title)+'</div><div class="ent-meta">'+esc(m.genre)+' · '+esc(m.time)+'</div><div class="ent-desc">'+esc(m.desc)+'</div><div class="ent-rating">⭐ '+m.rating+'</div></div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderPodcasts(){
  var lib=window.__PODCASTS_LIBRARY||[];
  var html='<div class="page">'+backBtn('entertainment')+'<div class="title-xl">🎧 Подкасты</div>';
  lib.forEach(function(m){
    html+='<div class="method-card"><div class="method-header"><div class="method-emoji">🎧</div><div style="flex:1;"><div class="method-title">'+esc(m.title)+'</div><div class="method-cat">'+esc(m.author)+'</div></div></div><div class="method-desc">'+esc(m.desc)+'</div><a class="video-link spotify" href="https://open.spotify.com/search/'+encodeURIComponent(m.title)+'" target="_blank"><span class="video-icon">🎧</span>Слушать в Spotify</a></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderTheater(){
  var lib=window.__THEATER_LIBRARY||[];
  var html='<div class="page">'+backBtn('entertainment')+'<div class="title-xl">🎭 Театр</div>';
  lib.forEach(function(m){html+='<div class="method-card"><div class="method-header"><div class="method-emoji">🎭</div><div style="flex:1;"><div class="method-title">'+esc(m.title)+'</div><div class="method-cat">'+esc(m.author)+'</div></div></div><div class="method-desc">'+esc(m.desc)+'</div></div>'});
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderArt(){
  var lib=window.__ART_LIBRARY||[];
  var html='<div class="page">'+backBtn('entertainment')+'<div class="title-xl">🎨 Искусство</div>';
  lib.forEach(function(m){html+='<div class="method-card"><div class="method-header"><div class="method-emoji">🎨</div><div style="flex:1;"><div class="method-title">'+esc(m.title)+'</div><div class="method-cat">'+esc(m.author)+'</div></div></div><div class="method-desc">'+esc(m.desc)+'</div></div>'});
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderWatchlist(){
  var list=state.watchlist||[];
  var html='<div class="page">'+backBtn('entertainment')+'<div class="title-xl">📋 Хочу посмотреть</div>';
  if(list.length){list.forEach(function(w){html+='<div class="list-row"><div class="list-icon" style="background:var(--glass-2);">🎬</div><div class="list-body"><div class="list-title">'+esc(w.title)+'</div><div class="list-subtitle">'+w.type+'</div></div><button class="btn btn-success btn-xs" onclick="promptWatched(\''+w.id+'\')">✓</button></div>'})}
  else{html+='<div class="empty"><div class="empty-icon">📋</div><div class="empty-title">Пусто</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function promptWatched(id){
  var rating=prompt('Оценка 1-10:','8');
  if(rating===null)return;
  if(window.__markAsWatched){window.__markAsWatched(id,parseInt(rating)||0,'')}
  else{
    var item=(state.watchlist||[]).find(function(w){return w.id===id});if(!item)return;
    if(!state.watched)state.watched=[];
    state.watched.push({id:id,title:item.title,type:item.type,rating:parseInt(rating)||0,watched_at:nowISO()});
    state.watchlist=state.watchlist.filter(function(w){return w.id!==id});
    save();
  }
  renderWatchlist();
}
function renderWatched(){
  var list=state.watched||[];
  var html='<div class="page">'+backBtn('entertainment')+'<div class="title-xl">✅ Просмотрено</div>';
  if(list.length){list.forEach(function(w){html+='<div class="list-row"><div class="list-icon" style="background:var(--success);color:#000;">✓</div><div class="list-body"><div class="list-title">'+esc(w.title)+'</div><div class="list-subtitle">'+w.type+' · ⭐'+w.rating+'</div></div></div>'})}
  else{html+='<div class="empty"><div class="empty-icon">✅</div><div class="empty-title">Пусто</div></div>'}
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}

/* ============ SCREEN TRACKER ============ */
function renderScreenTracker(){
  var tips=window.__SCREEN_TIPS||[];
  var habits=window.__SCREEN_HABITS||[];
  var html='<div class="page">'+backBtn('dashboard')+'<div class="title-xl">📱 Экранный детокс</div>';
  html+='<div class="stat-grid mb-4"><div class="stat-item"><div class="stat-value">'+tips.length+'</div><div class="stat-label">Советов</div></div><div class="stat-item"><div class="stat-value">'+habits.length+'</div><div class="stat-label">Привычек</div></div><div class="stat-item"><div class="stat-value">30</div><div class="stat-label">Дней курс</div></div></div>';
  html+='<div class="card" style="background:linear-gradient(135deg,rgba(255,107,107,.15),rgba(255,169,64,.1));border-color:rgba(255,107,107,.3);"><h2>📚 30-дневный курс</h2><div class="footnote text-secondary" style="margin-bottom:12px;">Постепенное снижение экрана + фокус + зрение</div><button class="btn btn-primary btn-block" onclick="navigate(\'detoxcourse\')">Открыть курс</button></div>';
  var categories={};
  tips.forEach(function(t){if(!categories[t.category])categories[t.category]=[];categories[t.category].push(t)});
  Object.keys(categories).forEach(function(cat){
    html+='<div class="card"><h2>'+cat+'</h2>';
    categories[cat].forEach(function(t){
      html+='<div class="screen-card"><div class="screen-title">'+esc(t.title)+'</div><div class="screen-desc">'+esc(t.desc)+'</div><div class="screen-action">→ '+esc(t.action)+'</div><div class="screen-effect">✨ '+esc(t.effect)+' · ⏱ '+esc(t.time)+'</div></div>';
    });
    html+='</div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderDetoxPlan(){
  var plan=window.__SCREEN_30_DAY_PLAN||[];
  var html='<div class="page">'+backBtn('screentracker')+'<div class="title-xl">🗓 30-дневный план</div>';
  plan.forEach(function(d){
    html+='<div class="card"><div class="row-between"><div class="badge badge-brand">День '+d.day+'</div><div class="footnote text-tertiary">'+esc(d.tip)+'</div></div><div class="plan-title mt-2">'+esc(d.title)+'</div><div class="plan-desc">'+esc(d.task)+'</div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function renderScreenTime(){renderScreenTracker()}

/* ============ DETOX COURSE ============ */
function renderDetoxCourse(){
  var course=window.__DETOX_COURSE||[];
  var currentDay=(typeof getCurrentDay==='function')?getCurrentDay():1;
  var completed=(typeof getCompletedDaysCount==='function')?getCompletedDaysCount():0;
  var pct=Math.round(completed/30*100);
  var html='<div class="page">'+backBtn('screentracker')+'<div class="title-xl">📚 30-дневный курс</div>';
  html+='<div class="detox-progress-hero"><h2>Прогресс курса</h2><div class="big">'+pct+'%</div><div class="small">'+completed+' из 30 дней · Текущий: День '+currentDay+'</div><div class="progress" style="margin-top:14px;background:rgba(255,255,255,.25);height:8px;"><div class="progress-fill" style="width:'+pct+'%;background:#fff;"></div></div></div>';
  html+='<div class="card"><div class="footnote text-secondary">Каждый день: почему это важно, что делать, что даст. Постепенное усложнение: снижение экрана + фокус + зрение.</div></div>';
  course.forEach(function(d){
    var isDone=(typeof isDayCompleted==='function')?isDayCompleted(d.day):false;
    var isCurrent=d.day===currentDay;
    var cls='detox-day-card';
    if(isDone)cls+=' completed';
    else if(isCurrent)cls+=' current';
    else if(d.day>currentDay)cls+=' locked';
    html+='<div class="'+cls+'" onclick="'+(d.day<=currentDay||isDone?'openDetoxDay('+d.day+')':'toast(\'Сначала предыдущий день\',\'warning\')')+'"><div class="detox-day-header"><div class="detox-day-number">'+(isDone?'✓ День '+d.day:'День '+d.day)+'</div><div class="footnote text-tertiary">'+esc(d.phase)+'</div></div><div class="detox-day-title">'+esc(d.title)+'</div><div class="detox-day-subtitle">'+esc(d.subtitle)+'</div></div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function openDetoxDay(day){
  var course=window.__DETOX_COURSE||[];
  var d=course.find(function(x){return x.day===day});
  if(!d)return;
  var isDone=(typeof isDayCompleted==='function')?isDayCompleted(day):false;
  var html='<div style="text-align:center;margin-bottom:20px;"><div class="detox-day-number" style="margin:0 auto 12px;">День '+d.day+'</div><div class="footnote text-secondary">'+esc(d.phase)+'</div></div>';
  html+='<div style="text-align:center;margin-bottom:20px;"><div style="font-size:24px;font-weight:800;line-height:1.3;margin-bottom:8px;">'+esc(d.title)+'</div><div class="footnote text-tertiary">'+esc(d.subtitle)+'</div></div>';
  html+='<div class="detox-section why"><div class="detox-section-title">🧠 Почему это важно</div><div class="detox-section-content">'+formatLesson(d.why)+'</div></div>';
  html+='<div class="detox-section do"><div class="detox-section-title">✅ Что делать сегодня</div><div class="detox-section-content"><ul>'+d.do.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul></div></div>';
  html+='<div class="detox-section effect"><div class="detox-section-title">💎 Что это даст</div><div class="detox-section-content">'+esc(d.effect)+'</div></div>';
  html+='<div class="detox-checklist"><div style="font-weight:700;margin-bottom:10px;">📋 Чек-лист</div>';
  d.checklist.forEach(function(item,i){
    var checked=(typeof isChecklistItemDone==='function')?isChecklistItemDone(d.day,i):false;
    html+='<div class="detox-checklist-item '+(checked?'checked':'')+'" onclick="toggleDetoxCheck('+d.day+','+i+')"><div class="detox-check">'+(checked?'✓':'')+'</div><div>'+esc(item)+'</div></div>';
  });
  html+='</div>';
  if(!isDone)html+='<button class="btn btn-primary btn-block mt-4" onclick="completeDetoxDay('+d.day+')">✓ День завершён</button>';
  else html+='<div class="badge badge-success" style="display:block;text-align:center;padding:14px;margin-top:16px;">✓ День '+d.day+' пройден</div>';
  openSheet('День '+d.day,d?html:'');
}
function renderDetoxDay(){navigate('detoxcourse')}
function toggleDetoxCheck(day,index){
  if(typeof toggleChecklistItem==='function'){
    toggleChecklistItem(day,index);
    openDetoxDay(day);
  }
}
function completeDetoxDay(day){
  if(typeof markDayCompleted==='function'){
    markDayCompleted(day);
    save();
    haptic('success');
    toast('🎉 День '+day+' пройден!','success',3500);
    checkAchievements();
    closeSheet();
    renderDetoxCourse();
  }
}

/* ============ DAILY PLAN ============ */
function renderDailyPlan(){
  var todayTasks=state.tasks.filter(function(t){return t.status==='pending'});
  var html='<div class="page">'+backBtn('dashboard')+'<div class="title-xl">📋 План дня</div>';
  html+='<div class="card"><h2>🌅 Утро</h2><div class="plan-day"><div class="plan-time">7:30</div><div class="plan-title">Пробуждение</div><div class="plan-desc">Вода + свет</div></div><div class="plan-day"><div class="plan-time">7:45</div><div class="plan-title">Дыхание 4-7-8</div></div><div class="plan-day"><div class="plan-time">8:00</div><div class="plan-title">Движение 15 мин</div></div></div>';
  html+='<div class="card"><h2>☀️ День</h2><div class="plan-day"><div class="plan-time">9:00</div><div class="plan-title">Deep Work 90 мин</div></div><div class="plan-day"><div class="plan-time">12:00</div><div class="plan-title">Обед</div></div><div class="plan-day"><div class="plan-time">14:00</div><div class="plan-title">Медитация 10 мин</div></div></div>';
  html+='<div class="card"><h2>🌙 Вечер</h2><div class="plan-day"><div class="plan-time">20:00</div><div class="plan-title">Рефлексия</div></div><div class="plan-day"><div class="plan-time">21:00</div><div class="plan-title">Без экранов</div></div><div class="plan-day"><div class="plan-time">22:30</div><div class="plan-title">Сон</div></div></div>';
  html+='<div class="card"><h2>📌 Задачи ('+todayTasks.length+')</h2>';
  todayTasks.slice(0,10).forEach(function(t){html+=taskRow(t)});
  html+='</div></div>';
  document.getElementById('app').innerHTML=html;
}

/* ============ MORE ============ */
function renderMore(){
  var groups=[
    {title:'🌐 Развитие',items:[{key:'domains',emoji:'🌐',label:'10 Доменов'},{key:'metrics',emoji:'📏',label:'Метрики'},{key:'plan',emoji:'🎯',label:'Персональный план'}]},
    {title:'🎓 Обучение',items:[{key:'learning',emoji:'🎓',label:'5 Уровней + модули'},{key:'skills',emoji:'💎',label:'Навыки'},{key:'english',emoji:'🇬🇧',label:'Английский'},{key:'paths',emoji:'🗺',label:'Пути'},{key:'courses',emoji:'📚',label:'Курсы'},{key:'methods',emoji:'💎',label:'Методики'}]},
    {title:'🎬 Досуг',items:[{key:'entertainment',emoji:'🎬',label:'Досуг'},{key:'movies',emoji:'🎥',label:'Фильмы'},{key:'series',emoji:'📺',label:'Сериалы'},{key:'books',emoji:'📚',label:'Книги'},{key:'musiclib',emoji:'🎵',label:'Музыка'},{key:'gameslib',emoji:'🎮',label:'Игры'},{key:'podcastslib',emoji:'🎧',label:'Подкасты'},{key:'watchlist',emoji:'📋',label:'Хочу посмотреть'},{key:'watched',emoji:'✅',label:'Просмотрено'}]},
    {title:'📅 Планирование',items:[{key:'calendar',emoji:'📅',label:'Календарь'},{key:'stats',emoji:'📊',label:'Статистика'},{key:'detailedStats',emoji:'📈',label:'Детальная стата'},{key:'matrix',emoji:'🔢',label:'Матрица'},{key:'dailyplan',emoji:'📋',label:'План дня'},{key:'timer',emoji:'⏱',label:'Таймер'},{key:'focus',emoji:'🎯',label:'Фокус'}]},
    {title:'🎯 Цели',items:[{key:'habits',emoji:'🔄',label:'Привычки'},{key:'goals',emoji:'🎯',label:'Цели'},{key:'notes',emoji:'📝',label:'Заметки'},{key:'journal',emoji:'📓',label:'Дневник'}]},
    {title:'❤️ Здоровье',items:[{key:'mood',emoji:'💭',label:'Настроение'},{key:'water',emoji:'💧',label:'Вода'},{key:'meds',emoji:'💊',label:'Лекарства'},{key:'workouts',emoji:'🏋️',label:'Тренировки'},{key:'meditation',emoji:'🧘',label:'Медитации'},{key:'health',emoji:'❤️',label:'Обзор'}]},
    {title:'🌿 Восстановление',items:[{key:'recovery',emoji:'🌿',label:'Восстановление'},{key:'screentracker',emoji:'📱',label:'Экранный детокс'},{key:'detoxcourse',emoji:'📚',label:'30-дневный курс'}]},
    {title:'📚 Ресурсы',items:[{key:'media',emoji:'📖',label:'Медиатека'},{key:'finance',emoji:'💰',label:'Финансы-модуль'}]},
    {title:'⚙️ Система',items:[{key:'storage',emoji:'🗄',label:'Хранилище'},{key:'integrations',emoji:'🔗',label:'Интеграции'},{key:'history',emoji:'📋',label:'История'},{key:'dbmanager',emoji:'💾',label:'База данных'},{key:'settings',emoji:'⚙️',label:'Настройки'},{key:'profile',emoji:'👤',label:'Профиль'}]}
  ];
  var html='<div class="page">'+backBtn('dashboard')+'<div class="title-xl">Все разделы</div>';
  groups.forEach(function(g){
    html+='<div class="card"><h2>'+g.title+'</h2>';
    g.items.forEach(function(it){
      html+='<div class="list-row" onclick="navigate(\''+it.key+'\')"><div class="list-icon" style="background:var(--glass-2);">'+it.emoji+'</div><div class="list-body"><div class="list-title">'+it.label+'</div></div><div class="list-chevron">›</div></div>';
    });
    html+='</div>';
  });
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}
function placeholderPage(emoji,name,desc){document.getElementById('app').innerHTML='<div class="page">'+backBtn('more')+'<div class="title-xl">'+name+'</div><div class="card"><div class="empty"><div class="empty-icon">'+emoji+'</div><div class="empty-title">'+name+'</div><div class="empty-text">'+(desc||'Раздел работает.')+'</div></div></div></div>'}
function renderCalendar(){placeholderPage('📅','Календарь','Google Calendar в разделе Интеграции')}
function renderHistory(){placeholderPage('📋','История','Сводка активности')}
function renderMedia(){placeholderPage('📖','Медиатека','Книги, подкасты')}
function renderRecovery(){
  var html='<div class="page">'+backBtn('health')+'<div class="title-xl">🌿 Восстановление</div>';
  html+='<div class="card"><h2>😴 Сон</h2><div class="list-row" onclick="openMethod(\'rest_sleep\')"><div class="list-icon" style="background:var(--glass-2);">😴</div><div class="list-body"><div class="list-title">Гигиена сна</div><div class="list-subtitle">7-9 часов</div></div></div></div>';
  html+='<div class="card"><h2>🧘 Медитация</h2><div class="list-row" onclick="openMethod(\'rest_meditation\')"><div class="list-icon" style="background:var(--glass-2);">🧘</div><div class="list-body"><div class="list-title">Практика</div><div class="list-subtitle">5-20 минут</div></div></div></div>';
  html+='<div class="card"><h2>📚 Чтение</h2><div class="list-row" onclick="openMethod(\'rest_reading\')"><div class="list-icon" style="background:var(--glass-2);">📚</div><div class="list-body"><div class="list-title">Художественная</div><div class="list-subtitle">20 мин/день</div></div></div></div>';
  html+='<div class="card"><h2>🌲 Природа</h2><div class="list-row" onclick="openMethod(\'rest_nature\')"><div class="list-icon" style="background:var(--glass-2);">🌲</div><div class="list-body"><div class="list-title">2 часа/нед</div><div class="list-subtitle">-16% кортизол</div></div></div></div>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}

/* ============ SURVEY ============ */
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
    html+='<input type="text" id="surveyInput" class="welcome-input" style="max-width:100%;text-align:left;font-size:16px !important;" value="'+esc(answers[q.id]||'')+'"/><button class="btn btn-primary btn-block mt-3" onclick="saveSurveyAnswer()">Далее →</button>';
  } else if(q.type==='options'){
    q.options.forEach(function(opt){
      var sel=answers[q.id]===opt.value?' selected':'';
      html+='<div class="survey-option'+sel+'" onclick="selectSurveyOption(\''+q.id+'\',\''+opt.value+'\')"><span class="survey-option-emoji">'+opt.emoji+'</span><span class="survey-option-label">'+opt.label+'</span></div>';
    });
  } else if(q.type==='multi'){
    q.options.forEach(function(opt){
      var arr=answers[q.id]||[];
      var sel=arr.indexOf(opt.value)>=0?' selected':'';
      html+='<div class="survey-option'+sel+'" onclick="toggleSurveyMulti(\''+q.id+'\',\''+opt.value+'\')"><span class="survey-option-emoji">'+opt.emoji+'</span><span class="survey-option-label">'+opt.label+'</span></div>';
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
  if(!val)return toast('Заполни поле','error');
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
  state.profile.personalPlan=generatePlan(state.profile.surveyAnswers);
  save();haptic('success');
  toast('🎉 Профиль заполнен!','success',4000);
  checkAchievements();updateHeaderAvatar();navigate('plan');
}
function generatePlan(answers){
  if(!answers)answers={};
  var plan={days:[],focusDomains:['mental','recovery'],metrics:[]};
  plan.days=[
    {title:'🌅 Утро',items:[{time:'7:30',title:'Пробуждение',desc:'Вода + свет'},{time:'+15 мин',title:'Дыхание 4-7-8',desc:'4 цикла'},{time:'+30 мин',title:'Движение',desc:'15 мин'},{time:'+1 ч',title:'Чтение',desc:'10 страниц'},{time:'+1.5 ч',title:'Deep Work',desc:'90 минут'}]},
    {title:'☀️ День',items:[{time:'12:00',title:'Обед',desc:'Белок + овощи'},{time:'14:00',title:'Медитация',desc:'10 минут'},{time:'15:00',title:'Deep Work #2',desc:'50 минут'},{time:'17:00',title:'Прогулка',desc:'20 минут'}]},
    {title:'🌙 Вечер',items:[{time:'19:00',title:'Ужин',desc:'Легкий'},{time:'20:00',title:'Рефлексия',desc:'Дневник'},{time:'21:00',title:'Без экранов',desc:'Книга'},{time:'22:30',title:'Сон',desc:'18-20°C'}]}
  ];
  return plan;
}

/* ============ WELCOME ============ */
function showWelcome(){
  var overlay=document.createElement('div');
  overlay.className='welcome-screen';
  overlay.innerHTML='<div class="welcome-logo">🧠</div><div class="welcome-title">AI Health v32</div><div class="welcome-sub">Обучение · Навыки · English · Досуг · AI · Детокс.</div><button class="btn btn-primary btn-block" style="max-width:340px;" onclick="startOnboarding()">Начать</button>';
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
  } else {
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
  haptic('success');
  toast('Добро пожаловать, '+name+'!','success');
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
    if(!state.englishProgress)state.englishProgress={};
    if(!state.skillsProgress)state.skillsProgress={};
    if(!state.entertainment)state.entertainment=[];
    if(!state.watchlist)state.watchlist=[];
    if(!state.watched)state.watched=[];
    if(!state.memoryTraining)state.memoryTraining=[];
    if(!state.customHabits)state.customHabits=[];
    if(!state.customGoals)state.customGoals=[];
    if(!state.customNotes)state.customNotes=[];
    if(!state.journalEntries)state.journalEntries=[];
    if(!state.customWater)state.customWater=[];
    if(!state.customMood)state.customMood=[];
    if(!state.customMeds)state.customMeds=[];
    if(!state.customMeditation)state.customMeditation=[];
    if(!state.customWorkouts)state.customWorkouts=[];
    if(!state.timerSessions)state.timerSessions=[];
    if(!state.focusSessions)state.focusSessions=[];
    if(!state.xp)state.xp=0;
    renderTabBar();
    renderDashboard();
    var t=today();
    if(state.stats.lastActiveDay!==t){
      var y=new Date();
      y.setDate(y.getDate()-1);
      var wasYesterday=state.stats.lastActiveDay===y.toISOString().slice(0,10);
      state.stats.streak=wasYesterday?(state.stats.streak||0)+1:1;
      if(state.stats.streak>(state.stats.bestStreak||0))state.stats.bestStreak=state.stats.streak;
      state.stats.lastActiveDay=t;
      save();
    }
    if('requestIdleCallback' in window){requestIdleCallback(function(){try{checkAchievements()}catch(e){}},{timeout:2000})}
    else{setTimeout(function(){try{checkAchievements()}catch(e){}},1000)}
    if(window.__initIntegrationsExt){try{window.__initIntegrationsExt()}catch(e){}}
    setInterval(function(){try{save()}catch(e){}},30000);
  }catch(e){
    console.error('Init:',e);
    var app=document.getElementById('app');
    if(app)app.innerHTML='<div class="empty"><div class="empty-icon">⚠️</div><div class="empty-title">Ошибка</div><div class="empty-text">'+esc(e.message)+'</div></div>';
  }
}

/* ============ RIPPLE ============ */
function attachRipple(){
  document.addEventListener('pointerdown',function(e){
    var target=e.target.closest('.btn, .list-row, .chip, .tab-item, .task-item, .card, .icon-btn, .avatar-btn, .persona-item, .segmented-item, .level-card, .module-card, .lesson-row, .emoji-pick, .domain-card, .method-card, .course-card, .path-step, .survey-option, .ent-card, .screen-card, .habit-row, .group-item, .back-btn, .live-panel-item, .detox-day-card, .detox-checklist-item');
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
window.saveMetrics=saveMetrics;
window.openPersona=openPersona;
window.addWater=addWater;
window.quickMoodLog=quickMoodLog;
window.saveMood=saveMood;
window.addTask=addTask;
window.toggleTask=toggleTask;
window.openEnglishLvl=openEnglishLvl;
window.openEnglishLess=openEnglishLess;
window.completeEnglishLess=completeEnglishLess;
window.openModuleLesson=openModuleLesson;
window.completeModuleLesson=completeModuleLesson;
window.renderModuleList=renderModuleList;
window.promptWatched=promptWatched;
window.addHabitFromTemplate=addHabitFromTemplate;
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
window.saveGCal=saveGCal;
window.saveObsidian=saveObsidian;
window.saveGemini=saveGemini;
window.exportDB=exportDB;
window.importDB=importDB;
window.renderSkills=renderSkills;
window.openDetoxDay=openDetoxDay;
window.toggleDetoxCheck=toggleDetoxCheck;
window.completeDetoxDay=completeDetoxDay;
window.completeChallenge=completeChallenge;
window.setWorkMode=setWorkMode;
window.cloudSync=cloudSync;

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',function(){init();setTimeout(attachRipple,300)});
} else {
  init();
  setTimeout(attachRipple,300);
}