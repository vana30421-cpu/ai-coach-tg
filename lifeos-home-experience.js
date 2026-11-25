/* LIFEOS Home Experience — clarify the existing dashboard without deleting features. */
(function(root){
  'use strict';
  if(!root || typeof root.renderDashboard !== 'function' || root.__lifeosHomeExperienceInstalled)return;

  var originalRenderDashboard=root.renderDashboard;
  var groups={
    planning:{title:'🗓 Планирование',hint:'Практика дня и план на завтра',items:[]},
    progress:{title:'📈 Прогресс и рекомендации',hint:'Статистика, баланс сфер и подсказки',items:[]},
    tools:{title:'🧰 Дополнительные инструменты',hint:'Быстрые действия и остальные функции',items:[]}
  };

  function textOf(node){return String(node && (node.innerText || node.textContent) || '').replace(/\s+/g,' ').trim();}
  function makeDetails(group){
    var details=document.createElement('details');
    details.className='lifeos-home-fold';
    var summary=document.createElement('summary');
    summary.innerHTML='<span class="lifeos-home-fold-title">'+group.title+'</span><span class="lifeos-home-fold-hint">'+group.hint+'</span><span class="lifeos-home-fold-chevron" aria-hidden="true">⌄</span>';
    details.appendChild(summary);
    var body=document.createElement('div');
    body.className='lifeos-home-fold-body';
    details.appendChild(body);
    group.body=body;
    return details;
  }
  function find(nodes, matcher){
    for(var i=0;i<nodes.length;i++)if(matcher(textOf(nodes[i]),nodes[i]))return nodes[i];
    return null;
  }
  function arrange(){
    var app=document.getElementById('app');
    var page=app && app.querySelector('.page');
    if(!page || page.getAttribute('data-home-organized')==='1')return;
    var nodes=Array.prototype.slice.call(page.children);
    var title=find(nodes,function(t,n){return n.classList && n.classList.contains('title-xl');}) || nodes[0];
    var next=find(nodes,function(t){return t.indexOf('Следующий полезный шаг')>=0;});
    var tasks=find(nodes,function(t){return t.indexOf('Задачи')>=0 && t.indexOf('Все →')>=0;});
    var habits=find(nodes,function(t){return t.indexOf('Привычки')>=0 && t.indexOf('/')>=0;});
    var focus=find(nodes,function(t){return t.indexOf('⏱ Фокус')>=0 || t.indexOf('▶ 25 мин')>=0;});
    var momentum=find(nodes,function(t){return t.indexOf('Импульс дня')>=0;});
    var tomorrow=find(nodes,function(t){return t.indexOf('План на завтра')>=0;});
    var reports=find(nodes,function(t){return t.indexOf('Отчёты')>=0;});
    var quick=find(nodes,function(t,n){return t.indexOf('Быстро')>=0 && !!(n.querySelector && n.querySelector('.group-grid'));});
    var xp=find(nodes,function(t){return t.indexOf('XP до уровня')>=0;});
    var spheres=find(nodes,function(t){return t.indexOf('Баланс сфер')>=0;});
    var tip=find(nodes,function(t){return t.indexOf('Совет коуча')>=0;});
    var jarvis=find(nodes,function(t){return t.indexOf('Джарвис заметил')>=0;});
    var phase=null;
    try{var p=root.getCurrentPhase && root.getCurrentPhase();if(p&&p.name)phase=find(nodes,function(t){return t.indexOf(p.name)>=0;});}catch(e){}

    var primary=[next,tasks,habits,focus].filter(Boolean);
    var planning=[momentum,tomorrow,phase].filter(Boolean);
    var progress=[xp,spheres,tip,jarvis,reports].filter(Boolean);
    var tools=[quick].filter(Boolean);
    var used=primary.concat(planning,progress,tools);
    var extras=nodes.filter(function(n){return n!==title && used.indexOf(n)<0;});
    progress=progress.concat(extras);
    groups.planning.items=planning;
    groups.progress.items=progress;
    groups.tools.items=tools;

    page.innerHTML='';
    page.setAttribute('data-home-organized','1');
    if(title)page.appendChild(title);

    var intro=document.createElement('p');
    intro.className='lifeos-home-intro';
    intro.textContent='Выбери одно главное дело. Остальные возможности не мешают — они собраны ниже.';
    page.appendChild(intro);

    primary.forEach(function(node){page.appendChild(node);});

    var shortcuts=document.createElement('section');
    shortcuts.className='lifeos-home-shortcuts';
    shortcuts.setAttribute('aria-label','Основные разделы');
    shortcuts.innerHTML=
      '<button type="button" onclick="navigate(\'tasks\')"><span>☑️</span><b>Задачи</b></button>'+
      '<button type="button" onclick="navigate(\'learning\')"><span>📚</span><b>Обучение</b></button>'+
      '<button type="button" onclick="navigate(\'calendar\')"><span>🗓️</span><b>Календарь</b></button>'+
      '<button type="button" onclick="navigate(\'more\')"><span>☷</span><b>Все разделы</b></button>';
    page.appendChild(shortcuts);

    [groups.planning,groups.progress,groups.tools].forEach(function(group){
      var details=makeDetails(group);
      group.items.forEach(function(node){group.body.appendChild(node);});
      if(group.items.length)page.appendChild(details);
    });
  }

  function arrangeMore(){
    var hub=document.querySelector('#app .more-hub');
    if(!hub || hub.getAttribute('data-home-organized')==='1')return;
    var title=hub.querySelector('.title-xl');
    var subtitle=hub.querySelector('.subtitle');
    var search=hub.querySelector('.more-search');
    var count=hub.querySelector('.more-count');
    var tiles=Array.prototype.slice.call(hub.querySelectorAll('[data-more-item]'));
    var categories=[
      {id:'work',title:'📌 Главное и работа'},
      {id:'growth',title:'🧠 Саморазвитие'},
      {id:'learning',title:'🎓 Обучение'},
      {id:'health',title:'❤️ Здоровье и цифровой баланс'},
      {id:'progress',title:'📈 Прогресс и мотивация'},
      {id:'leisure',title:'🎬 Отдых'},
      {id:'assistants',title:'✧ AI и помощники'},
      {id:'knowledge',title:'📚 Личные знания'},
      {id:'system',title:'⚙️ Настройки и система'},
      {id:'other',title:'🧩 Остальное'}
    ];
    var categoryByKey={
      dashboard:'work',tasks:'work',projects:'work',schedule:'work',focus:'work',eveningReview:'work',
      spheres:'growth',coach:'growth',coachChat:'growth',habitList:'growth',habitCatalog:'growth',brain:'growth',antistress:'growth',
      learning:'learning',levels:'learning',english:'learning',skills:'learning',games:'learning',materials:'learning',
      health:'health',water:'health',mood:'health',sleep:'health',sleepCalendar:'health',
      vision:'health',vision60:'health',vision62:'health',visiontrack:'health',visiontips:'health',
      detox:'health',detox60:'health',detoxcourse:'health',screentracker:'health',
      dailyReport:'progress',weeklyReview:'progress',monthlyReview:'progress',achievements:'progress',stats:'progress',
      gamesHub:'progress',leagues:'progress',pet:'progress',fsrs:'progress',
      walks:'leisure',leisure:'leisure',
      ai:'assistants',telegramSetup:'assistants',
      obsidian:'knowledge',journal:'knowledge',obsidianIntegration:'knowledge',
      settings:'system',notifications:'system',profile:'system',storage:'system'
    };
    var buckets={};
    categories.forEach(function(category){buckets[category.id]=[];});
    var seen={};
    tiles.forEach(function(tile){
      var match=(tile.getAttribute('onclick')||'').match(/navigate\(['"]([^'"]+)['"]\)/);
      var key=match?match[1]:'';
      if(key && seen[key])return;
      if(key)seen[key]=true;
      var category=categoryByKey[key]||'other';
      buckets[category].push(tile);
    });
    if(!seen.tasks){
      var taskTile=document.createElement('button');
      taskTile.type='button';
      taskTile.className='more-tile';
      taskTile.setAttribute('data-more-item','');
      taskTile.setAttribute('data-search','работа задачи');
      taskTile.setAttribute('onclick',"navigate('tasks')");
      taskTile.innerHTML='<span class="more-tile-icon">☑️</span><span class="more-tile-label">Задачи</span><span class="more-tile-arrow">›</span>';
      buckets.work.unshift(taskTile);
    }
    hub.innerHTML='';
    hub.setAttribute('data-home-organized','1');
    [title,subtitle,search,count].forEach(function(node){if(node)hub.appendChild(node);});
    categories.forEach(function(category){
      var items=buckets[category.id];
      if(!items.length)return;
      var section=document.createElement('section');
      section.className='card more-group';
      section.setAttribute('data-more-group','');
      var heading=document.createElement('h2');
      heading.className='more-group-title';
      heading.textContent=category.title;
      var grid=document.createElement('div');
      grid.className='more-grid';
      section.appendChild(heading);
      section.appendChild(grid);
      items.forEach(function(tile){grid.appendChild(tile);});
      hub.appendChild(section);
    });
    if(typeof root.filterMoreSections==='function')root.filterMoreSections(search&&search.querySelector('input')?search.querySelector('input').value:'');
  }

  root.renderDashboard=function(){
    originalRenderDashboard.apply(this,arguments);
    try{arrange();}catch(error){console.warn('[LIFEOS] Home organization skipped:',error);}
  };
  try{
    var observedApp=document.getElementById('app');
    if(observedApp && typeof root.MutationObserver==='function'){
      var observer=new root.MutationObserver(function(){
        var pageName=observedApp.getAttribute('data-page');
        if(!pageName || pageName==='dashboard'){
          try{arrange();}catch(error){console.warn('[LIFEOS] Home reorganization skipped:',error);}
        }else if(pageName==='more'){
          try{arrangeMore();}catch(error){console.warn('[LIFEOS] Menu reorganization skipped:',error);}
        }
      });
      observer.observe(observedApp,{childList:true,subtree:true});
    }
  }catch(observerError){console.warn('[LIFEOS] Home observer unavailable:',observerError);}
  root.__lifeosHomeExperienceInstalled=true;
  try{
    var app=document.getElementById('app');
    if(app && (!app.getAttribute('data-page') || app.getAttribute('data-page')==='dashboard'))root.renderDashboard();
    else if(app && app.getAttribute('data-page')==='more')arrangeMore();
  }catch(e){}
})(typeof window!=='undefined'?window:globalThis);
