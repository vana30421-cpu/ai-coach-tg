/* LIFEOS Discipline 30 — offline-first behavioral training, additive state only. */
(function(root){
'use strict';
var KEY='discipline30';
var habits=[
 {id:'start',icon:'🚀',title:'Начал важную, но скучную задачу',detail:'Сделай первый конкретный шаг, не ожидая желания.'},
 {id:'focus',icon:'🎯',title:'Провёл один блок сосредоточенной работы',detail:'Начни с 15–25 минут; длительность подбирай по самочувствию.'},
 {id:'break',icon:'📵',title:'Перерыв прошёл без автоматического скроллинга',detail:'Если открыл приложение — просто закрой и вернись, день не испорчен.'},
 {id:'return',icon:'🔄',title:'Вернулся после сопротивления или отвлечения',detail:'Отметь возвращение, даже если отвлечение всё-таки произошло.'}
];
var phases=[
 {from:1,to:7,title:'Осознанность и старт',detail:'Замечать импульс, заранее выбирать следующий шаг и ежедневно тренировать лёгкий старт.'},
 {from:8,to:14,title:'Устойчивость к скуке',detail:'Оставаться с одной задачей короткими блоками, не требуя от себя интереса.'},
 {from:15,to:21,title:'Самоуправление',detail:'Самостоятельно возвращаться к плану после отвлечений и сопротивления.'},
 {from:22,to:30,title:'Закрепление',detail:'Проверить систему в обычные учебные и рабочие дни, настроить личные правила.'},
 {from:31,to:9999,title:'Поддержание',detail:'Продолжать без перезапуска курса: дисциплина поддерживается практикой, а не счётчиком.'}
];
function localDate(d){
 d=d||new Date();
 return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function dateIndex(value){
 var p=String(value||'').split('-').map(Number);
 if(p.length!==3||!p[0]||!p[1]||!p[2])return NaN;
 return Math.floor(Date.UTC(p[0],p[1]-1,p[2])/86400000);
}
function dayNumber(start,current){
 var a=dateIndex(start),b=dateIndex(current||localDate());
 return Number.isFinite(a)&&Number.isFinite(b)?Math.max(1,b-a+1):1;
}
function phaseForDay(day){
 return phases.find(function(p){return day>=p.from&&day<=p.to;})||phases[0];
}
function ensure(){
 if(!root.state||typeof root.state!=='object')return null;
 var s=root.state;
 if(!s[KEY]||typeof s[KEY]!=='object'||Array.isArray(s[KEY]))s[KEY]={};
 var d=s[KEY];
 if(!d.startDate)d.startDate=localDate();
 if(!d.logs||typeof d.logs!=='object'||Array.isArray(d.logs))d.logs={};
 if(typeof d.slips!=='number'||!Number.isFinite(d.slips))d.slips=0;
 if(!d.settings||typeof d.settings!=='object')d.settings={};
 return d;
}
function persist(){
 try{if(typeof root.save==='function')root.save();}catch(e){console.warn('[LIFEOS Discipline30] save failed',e);}
}
function esc(value){
 return typeof root.esc==='function'?root.esc(value):String(value==null?'':value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});
}
function getLog(d,date){
 if(!d.logs[date])d.logs[date]={checks:{},task:'',startTime:'',reflection:'',slips:0};
 var l=d.logs[date];
 if(!l.checks||typeof l.checks!=='object')l.checks={};
 if(typeof l.task!=='string')l.task='';
 if(typeof l.startTime!=='string')l.startTime='';
 if(typeof l.reflection!=='string')l.reflection='';
 if(typeof l.slips!=='number')l.slips=0;
 return l;
}
function summarize(d,today){
 var dates=Object.keys(d.logs||{}),completed=0,focus=0,starts=0,breaks=0,returns=0;
 dates.forEach(function(date){
  var l=d.logs[date]||{},c=l.checks||{};
  if(['start','focus','break','return'].every(function(k){return c[k]===true;}))completed++;
  if(c.focus)focus++;if(c.start)starts++;if(c.break)breaks++;if(c.return)returns++;
 });
 var current=dayNumber(d.startDate,today),phase=phaseForDay(current);
 return {day:current,phase:phase,loggedDays:dates.length,completedDays:completed,focusBlocks:focus,startedTasks:starts,screenFreeBreaks:breaks,returns:returns,slips:d.slips||0,maintenance:current>30};
}
function setCheck(id,value){
 if(!habits.some(function(h){return h.id===id;}))return;
 var d=ensure();if(!d)return;
 var l=getLog(d,localDate());l.checks[id]=!!value;persist();render();
}
function setField(field,value){
 if(['task','startTime','reflection'].indexOf(field)<0)return;
 var d=ensure();if(!d)return;
 getLog(d,localDate())[field]=String(value||'').slice(0,field==='task'?240:field==='reflection'?500:5);persist();
}
function recordSlip(){
 var d=ensure();if(!d)return;
 var l=getLog(d,localDate());l.slips++;d.slips++;
 persist();render();
 if(typeof root.toast==='function')root.toast('Срыв отмечен без штрафа. Следующий шаг — вернуться к задаче.','info');
}
function resetStartDate(){
 var d=ensure();if(!d)return;
 if(typeof root.confirm==='function'&&!root.confirm('Начать новый 30-дневный цикл? Текущая история сохранится.'))return;
 d.previousCycles=Array.isArray(d.previousCycles)?d.previousCycles:[];
 d.previousCycles.push({startDate:d.startDate,endedAt:localDate(),logs:d.logs});
 d.startDate=localDate();d.logs={};d.slips=0;persist();render();
}
function render(){
 var d=ensure(),app=document.getElementById('app');
 if(!app)return;
 if(!d){app.innerHTML='<div class="page"><div class="card">Дисциплина временно недоступна: состояние LIFEOS не загружено.</div></div>';return;}
 var date=localDate(),log=getLog(d,date),stats=summarize(d,date),phase=stats.phase;
 var html='<div class="page"><div class="row-between"><div><div class="title-xl">🧭 Дисциплина 30</div><div class="subtitle">Тренировка самостоятельности, а не марафон мотивации</div></div><span class="badge badge-brand">'+(stats.maintenance?'Поддержание':'День '+Math.min(stats.day,30)+'/30')+'</span></div>';
 html+='<section class="card"><div class="row-between"><b>'+esc(phase.title)+'</b><span class="footnote">'+(stats.maintenance?'После программы':'Этап '+(phases.indexOf(phase)+1)+' из 4')+'</span></div><div class="progress-bar mt-2"><div class="progress-fill" style="width:'+Math.min(100,Math.round(Math.min(stats.day,30)/30*100))+'%"></div></div><p class="footnote mt-2">'+esc(phase.detail)+'</p><div class="footnote">Пропущенный день не обнуляет прогресс. Не нужно начинать сначала.</div></section>';
 html+='<section class="grid-2 mb-3"><div class="card"><div class="stat-value">'+stats.completedDays+'</div><div class="stat-label">Полных дней по чек-листу</div></div><div class="card"><div class="stat-value">'+stats.focusBlocks+'</div><div class="stat-label">Фокус-блоков отмечено</div></div><div class="card"><div class="stat-value">'+stats.startedTasks+'</div><div class="stat-label">Сложных задач начато</div></div><div class="card"><div class="stat-value">'+stats.returns+'</div><div class="stat-label">Возвращений после отвлечения</div></div></section>';
 html+='<section class="card"><h2>🎯 Одна задача на сегодня</h2><div class="field"><label class="field-label" for="discipline30Task">Какую важную, но неинтересную задачу ты откладываешь?</label><input id="discipline30Task" maxlength="240" value="'+esc(log.task)+'" placeholder="Например: сделать домашнее задание по математике" onchange="discipline30SetField(\'task\',this.value)"></div><div class="field"><label class="field-label" for="discipline30Start">Когда начнёшь?</label><input id="discipline30Start" type="time" value="'+esc(log.startTime)+'" onchange="discipline30SetField(\'startTime\',this.value)"></div><div class="footnote">Запиши действие и время. Конкретное решение уменьшает торг с собой в момент старта.</div></section>';
 html+='<section class="card"><div class="row-between"><h2>✅ Практика дня</h2><span class="badge">'+habits.filter(function(h){return log.checks[h.id]===true;}).length+'/4</span></div>';
 habits.forEach(function(h){html+='<label class="row-between" style="gap:12px;align-items:flex-start;padding:12px 0;border-bottom:1px solid var(--divider)"><span style="display:flex;gap:10px;flex:1"><span style="font-size:22px">'+h.icon+'</span><span><b>'+h.title+'</b><span class="footnote" style="display:block;margin-top:4px">'+h.detail+'</span></span></span><input type="checkbox" aria-label="'+esc(h.title)+'" '+(log.checks[h.id]?'checked':'')+' onchange="discipline30SetCheck(\''+h.id+'\',this.checked)" style="width:22px;height:22px;flex:0 0 22px"></label>';});
 html+='</section><section class="card"><h2>🧠 Если потянуло открыть приложение</h2><p class="footnote">Не спорь с собой и не ругай себя. Назови импульс, запиши его при необходимости и выбери следующий физический шаг по задаче. Если уже отвлёкся — вернись с ближайшего действия.</p><button class="btn btn-secondary btn-block" onclick="discipline30RecordSlip()">Отметить отвлечение без наказания</button><div class="footnote mt-2">Отмечено отвлечений за всё время: '+stats.slips+'. Сам факт отвлечения не считается провалом.</div></section>';
 html+='<section class="card"><h2>📝 Короткий итог</h2><div class="field"><label class="field-label" for="discipline30Reflection">Что помогло или помешало сегодня?</label><textarea id="discipline30Reflection" rows="2" maxlength="500" onchange="discipline30SetField(\'reflection\',this.value)" placeholder="Одно наблюдение без самокритики">'+esc(log.reflection)+'</textarea></div><div class="footnote">Главная метрика — не идеальная серия, а способность вернуться к выбранному делу.</div></section>';
 html+='<section class="card"><h2>🔄 После 30-го дня</h2><p class="footnote">Программа не заканчивается обнулением. Сохраняй короткий старт, один фокус-блок и возвращение после отвлечения. На 31-й день LIFEOS автоматически переключит экран на режим поддержания.</p><button class="btn btn-ghost btn-block" onclick="discipline30ResetCycle()">Начать новый цикл, сохранив историю</button></section></div>';
 app.innerHTML=html;
}
root.renderDiscipline30=render;
root.discipline30SetCheck=setCheck;
root.discipline30SetField=setField;
root.discipline30RecordSlip=recordSlip;
root.discipline30ResetCycle=resetStartDate;
root.LIFEOS_DISCIPLINE30={dayNumber:dayNumber,phaseForDay:phaseForDay,summarize:summarize,ensure:ensure,habits:habits};
if(typeof root.renderDashboard==='function'&&!root.__discipline30DashboardWrapped){
 var originalDashboard=root.renderDashboard;
 root.renderDashboard=function(){
  originalDashboard();
  var page=document.querySelector('#app .page');
  if(!page||page.querySelector('[data-discipline30-entry]'))return;
  var d=ensure(),stats=d?summarize(d,localDate()):null;
  var card=document.createElement('section');card.className='card';card.setAttribute('data-discipline30-entry','1');
  card.style.border='1px solid color-mix(in srgb,var(--brand) 34%,var(--glass-border))';
  card.innerHTML='<div class="row-between"><div><b>🧭 Дисциплина 30</b><div class="footnote">Самостоятельность без постоянной мотивации</div></div><span class="badge badge-brand">'+(stats&&stats.maintenance?'Поддержание':'День '+Math.min(stats?stats.day:1,30)+'/30')+'</span></div><button class="btn btn-primary btn-block mt-3" onclick="navigate(\'discipline30\')">Открыть программу →</button>';
  page.insertBefore(card,page.firstChild);
 };
 root.__discipline30DashboardWrapped=true;
}
})(typeof window!=='undefined'?window:globalThis);
