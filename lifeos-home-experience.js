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
    groups.planning.items=planning;
    groups.progress.items=progress;
    groups.tools.items=tools;
    var used=primary.concat(planning,progress,tools);
    var extras=nodes.filter(function(n){return n!==title && used.indexOf(n)<0;});
    progress=progress.concat(extras);

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

  root.renderDashboard=function(){
    originalRenderDashboard.apply(this,arguments);
    try{arrange();}catch(error){console.warn('[LIFEOS] Home organization skipped:',error);}
  };
  root.__lifeosHomeExperienceInstalled=true;
  try{
    var app=document.getElementById('app');
    if(app && (!app.getAttribute('data-page') || app.getAttribute('data-page')==='dashboard'))root.renderDashboard();
  }catch(e){}
})(typeof window!=='undefined'?window:globalThis);
