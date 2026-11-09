/* LIFEOS global search — offline-first search across personal records */
(function(){
'use strict';
function esc(value){return window.esc?window.esc(value):String(value==null?'':value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function text(value){return String(value==null?'':value).replace(/<[^>]*>/g,' ').replace(/\\s+/g,' ').trim();}
function arg(value){return "'"+String(value==null?'':value).replace(/\\/g,'\\\\').replace(/'/g,"\\'")+"';}
function collect(){
 var rows=[];
 function add(list,type,label,titleOf,bodyOf,dateOf){
  if(!Array.isArray(list))return;
  list.forEach(function(item){
   if(!item||typeof item!=='object')return;
   var title=text(titleOf(item));if(!title)return;
   rows.push({type:type,label:label,id:String(item.id||''),title:title,body:text(bodyOf(item)).slice(0,180),date:text(dateOf?dateOf(item):'')});
  });
 }
 add(state.tasks,'task','Задача',function(x){return x.title;},function(x){return [x.description,x.notes,(x.tags||[]).join(' ')].join(' ');},function(x){return x.due_date||x.dueDate||'';});
 add(state.projects,'project','Проект',function(x){return x.title;},function(x){return [x.description,x.notes,(x.tasks||[]).map(function(t){return t.title;}).join(' ')].join(' ');});
 add(state.habits,'habit','Привычка',function(x){return x.title||x.name;},function(x){return [x.description,x.why,x.category].join(' ');});
 add(state.journalEntries,'journal','Дневник',function(x){return x.title;},function(x){return [x.text,x.body,x.wins,x.blockers,x.insight,x.gratitude,(x.tags||[]).join(' ')].join(' ');},function(x){return x.date||'';});
 var brain=state.secondBrain&&Array.isArray(state.secondBrain.notes)?state.secondBrain.notes:[];
 add(brain,'brain','Второй мозг',function(x){return x.title;},function(x){return [x.body,(x.tags||[]).join(' '),(x.links||[]).join(' ')].join(' ');},function(x){return x.updatedAt||x.createdAt||'';});
 add(state.calendarEvents,'calendar','Календарь',function(x){return x.title;},function(x){return [x.note,x.category].join(' ');},function(x){return x.date||'';});
 return rows;
}
function render(query){
 var target=document.getElementById('lifeosGlobalSearchResults');if(!target)return;
 var q=String(query||'').trim().toLowerCase();
 if(q.length<2){target.innerHTML='<div class="footnote">Введи минимум 2 символа. Поиск охватывает задачи, проекты, привычки, дневник, второй мозг и календарь.</div>';return;}
 var terms=q.split(/\\s+/).filter(Boolean),found=collect().filter(function(row){var hay=(row.title+' '+row.body+' '+row.label+' '+row.date).toLowerCase();return terms.every(function(term){return hay.indexOf(term)>=0;});}).slice(0,40);
 if(!found.length){target.innerHTML='<div class="card empty"><div class="empty-title">Ничего не найдено</div><div class="footnote">Попробуй другое слово или часть фразы.</div></div>';return;}
 target.innerHTML='<div class="footnote mb-2">Найдено: '+found.length+(found.length===40?' · показаны первые 40':'')+'</div>'+found.map(function(row){
  return '<button class="list-row" type="button" style="width:100%;text-align:left" onclick="openLifeOSSearchResult('+esc(arg(row.type))+','+esc(arg(row.id))+','+esc(arg(row.date))+')"><span class="list-icon">🔎</span><span class="list-body"><span class="list-title">'+esc(row.title)+'</span><span class="list-subtitle">'+esc(row.label)+(row.date?' · '+esc(row.date):'')+(row.body?' · '+esc(row.body):'')+'</span></span><span class="list-chevron">›</span></button>';
 }).join('');
}
window.openLifeOSGlobalSearch=function(){
 var html='<div class="field"><label class="field-label">Поиск по личным данным</label><input id="lifeosGlobalSearchInput" type="search" autocomplete="off" placeholder="Задача, мысль, проект, событие…" oninput="renderLifeOSGlobalSearch(this.value)"></div><div id="lifeosGlobalSearchResults"><div class="footnote">Введи минимум 2 символа. Поиск работает локально на устройстве.</div></div>';
 if(!window.openSheet)return;
 window.openSheet('Поиск по LIFEOS',html);
 setTimeout(function(){var input=document.getElementById('lifeosGlobalSearchInput');if(input)input.focus();},80);
};
window.renderLifeOSGlobalSearch=render;
window.openLifeOSSearchResult=function(type,id,date){
 if(window.closeSheet)window.closeSheet();
 if(type==='task'){window.navigate('tasks');setTimeout(function(){if(window.openEntityEditor)window.openEntityEditor('task',id);},180);return;}
 if(type==='project'){if(window.openProject)window.openProject(id);else window.navigate('projects');return;}
 if(type==='habit'){if(window.openHabitDetail)window.openHabitDetail(id);else window.navigate('habitList');return;}
 if(type==='journal'){window.navigate('journal');setTimeout(function(){if(window.editJournalEntry)window.editJournalEntry(id);},180);return;}
 if(type==='brain'){window.navigate('obsidian');setTimeout(function(){if(window.openBrainNote)window.openBrainNote(id);},180);return;}
 if(type==='calendar'){if(date&&window.selectLifeOSCalendarDate)window.selectLifeOSCalendarDate(date);else window.navigate('calendar');return;}
};
})();