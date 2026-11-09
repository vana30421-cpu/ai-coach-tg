/* LIFEOS Jarvis Memory — explicit, searchable, local-first memory */
(function(root){
'use strict';
function state(){
 var app=root.state;if(!app)return null;
 if(!app.jarvis||typeof app.jarvis!=='object')app.jarvis={};
 if(!app.jarvis.memory||typeof app.jarvis.memory!=='object')app.jarvis.memory={items:[],updatedAt:null};
 if(!Array.isArray(app.jarvis.memory.items))app.jarvis.memory.items=[];
 return app.jarvis.memory;
}
function save(){if(root.save)root.save();}
function uid(){return root.uid?root.uid():'mem_'+Date.now().toString(36)+Math.random().toString(36).slice(2,7);}
function clean(value,max){return String(value==null?'':value).replace(/\s+/g,' ').trim().slice(0,max||500);}
function list(){var m=state();return m?m.items.slice().sort(function(a,b){return String(b.updatedAt||b.createdAt||'').localeCompare(String(a.updatedAt||a.createdAt||''));}):[];}
function add(text,category){
 var value=clean(text,500);if(!value)throw new Error('Напиши, что нужно запомнить.');
 var m=state();if(!m)throw new Error('Хранилище LIFEOS ещё не готово.');
 var normalized=value.toLowerCase();
 var old=m.items.find(function(x){return clean(x.text,500).toLowerCase()===normalized;});
 if(old){old.updatedAt=new Date().toISOString();old.category=clean(category||old.category,40)||'Факт';}
 else m.items.push({id:uid(),text:value,category:clean(category,40)||'Факт',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});
 if(m.items.length>500)m.items=m.items.slice(-500);
 m.updatedAt=new Date().toISOString();save();return old||m.items[m.items.length-1];
}
function remove(id){var m=state();if(!m)return false;var n=m.items.length;m.items=m.items.filter(function(x){return x.id!==id;});if(m.items.length!==n){m.updatedAt=new Date().toISOString();save();return true;}return false;}
function clear(){var m=state();if(!m)return;m.items=[];m.updatedAt=new Date().toISOString();save();}
function search(query,limit){
 var q=clean(query,300).toLowerCase().replace(/ё/g,'е'),terms=q.split(/[^a-zа-я0-9]+/i).filter(function(x){return x.length>1;});
 return list().map(function(item){
  var hay=(item.text+' '+item.category).toLowerCase().replace(/ё/g,'е'),score=0;
  terms.forEach(function(term){if(hay.indexOf(term)>=0)score+=term.length>5?3:1;});
  if(q&&hay.indexOf(q)>=0)score+=8;
  return {item:item,score:score};
 }).filter(function(x){return !q||x.score>0;}).sort(function(a,b){return b.score-a.score||String(b.item.updatedAt).localeCompare(String(a.item.updatedAt));}).slice(0,limit||8).map(function(x){return x.item;});
}
function context(query){
 return search(query,10).map(function(x){return {category:x.category,text:x.text,updatedAt:x.updatedAt};});
}
function render(){
 var items=list(),html='<section class="card mt-3" id="jarvisMemoryPanel"><div class="row-between"><div><div class="card-title">🧠 Постоянная память Джарвиса</div><div class="footnote">Сохраняет выбранные тобой факты в памяти этого устройства. Факты передаются ИИ только при включённом облачном режиме.</div></div><span class="badge badge-brand">'+items.length+'/500</span></div>';
 html+='<div class="field mt-2"><label class="field-label" for="jarvisMemoryText">Что запомнить</label><textarea id="jarvisMemoryText" rows="2" maxlength="500" placeholder="Например: моя главная цель — выучить JavaScript"></textarea></div>';
 html+='<div class="grid-2"><select id="jarvisMemoryCategory"><option>Факт</option><option>Цель</option><option>Предпочтение</option><option>Проект</option><option>Правило</option></select><button class="btn btn-primary" type="button" onclick="saveJarvisMemoryFromUI()">Сохранить в память</button></div>';
 html+='<div class="field mt-2"><input id="jarvisMemorySearch" type="search" placeholder="Поиск по памяти" oninput="filterJarvisMemory(this.value)"></div><div id="jarvisMemoryItems">';
 if(!items.length)html+='<div class="footnote">Память пока пуста. Добавляй только то, что действительно нужно учитывать в будущих разговорах.</div>';
 items.slice(0,30).forEach(function(x){html+=row(x);});
 html+='</div><div class="footnote mt-2">Хранение локальное: очистка данных браузера может удалить память. Экспорт и синхронизация между устройствами пока не подключены.</div></section>';
 return html;
}
function row(x){
 return '<div class="list-row jarvis-memory-row" data-memory-search="'+clean(x.text+' '+x.category,600).toLowerCase().replace(/&/g,'&amp;').replace(/"/g,'&quot;')+'"><div style="min-width:0;flex:1"><b>'+ (root.esc?root.esc(x.category):x.category)+'</b><div>'+ (root.esc?root.esc(x.text):x.text)+'</div><div class="footnote">'+(root.esc?root.esc(String(x.updatedAt||'').slice(0,10)):'')+'</div></div><button class="btn btn-ghost btn-xs" onclick="removeJarvisMemory(\''+x.id+'\')" aria-label="Удалить факт">✕</button></div>';
}
function filter(query){
 var nodes=document.querySelectorAll('.jarvis-memory-row'),q=clean(query,300).toLowerCase();
 for(var i=0;i<nodes.length;i++)nodes[i].style.display=(!q||nodes[i].getAttribute('data-memory-search').indexOf(q)>=0)?'':'none';
}
function saveFromUI(){
 var input=document.getElementById('jarvisMemoryText'),category=document.getElementById('jarvisMemoryCategory');
 try{var item=add(input&&input.value,category&&category.value);if(input)input.value='';if(root.toast)root.toast('Сохранено в памяти Джарвиса','success');if(root.renderJarvis)root.renderJarvis();}
 catch(e){if(root.toast)root.toast(e.message,'error');}
}
function removeFromUI(id){if(!remove(id))return;if(root.toast)root.toast('Запись удалена','success');if(root.renderJarvis)root.renderJarvis();}
root.LIFEOS_JARVIS_MEMORY={list:list,add:add,remove:remove,clear:clear,search:search,context:context,render:render};
root.saveJarvisMemoryFromUI=saveFromUI;
root.filterJarvisMemory=filter;
root.removeJarvisMemory=removeFromUI;
})(typeof window!=='undefined'?window:globalThis);
