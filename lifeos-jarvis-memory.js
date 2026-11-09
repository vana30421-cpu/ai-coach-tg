/* LIFEOS Jarvis Memory — explicit, searchable, local-first memory */
(function(root){
'use strict';
function state(){
 var app=root.state;if(!app)return null;
 if(!app.jarvis||typeof app.jarvis!=='object')app.jarvis={};
 if(!app.jarvis.memory||typeof app.jarvis.memory!=='object')app.jarvis.memory={items:[],updatedAt:null};
 if(!Array.isArray(app.jarvis.memory.items))app.jarvis.memory.items=[];
 if(!app.jarvis.memory.sync||typeof app.jarvis.memory.sync!=='object')app.jarvis.memory.sync={id:'',key:'',lastSyncAt:null};
 return app.jarvis.memory;
}
function save(){if(root.save)root.save();}
function uid(){return root.uid?root.uid():'mem_'+Date.now().toString(36)+Math.random().toString(36).slice(2,7);}
function safeId(value){var id=clean(value,100);return /^[a-zA-Z0-9_-]{1,100}$/.test(id)?id:uid();}
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
 html+='</div><div class="footnote mt-2">Локальная память сохраняется на этом устройстве. Для синхронизации между устройствами создай секретный ключ и настрой KV на Worker.</div>';
 html+=renderMemorySync();
 html+='</section>';
 html+=renderCustomSkills();
 html+=renderReminders();
 return html;
}
function b64url(bytes){
 var binary='';for(var i=0;i<bytes.length;i++)binary+=String.fromCharCode(bytes[i]);
 return root.btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
function unb64url(value){
 var text=String(value||'').replace(/-/g,'+').replace(/_/g,'/');while(text.length%4)text+='=';
 var binary=root.atob(text),bytes=new Uint8Array(binary.length);for(var i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);return bytes;
}
function syncSecret(){
 var sync=state()&&state().sync;return sync&&sync.id&&sync.key?sync.id+'.'+sync.key:'';
}
function renderMemorySync(){
 var sync=state().sync,secret=syncSecret();
 return '<div class="card mt-2"><b>🔐 Синхронизация между устройствами</b><div class="footnote mt-1">Данные шифруются в браузере AES‑GCM. Worker хранит только зашифрованный файл; ключ шифрования ему не отправляется. Секретный ключ сохрани отдельно — восстановить его нельзя.</div><div class="field mt-2"><input id="jarvisMemorySyncKey" type="text" autocomplete="off" spellcheck="false" maxlength="100" value="'+(root.esc?root.esc(secret):secret)+'" placeholder="Вставь ключ синхронизации с другого устройства"></div><div class="grid-2"><button class="btn btn-ghost" onclick="createJarvisMemorySyncKey()">Создать ключ</button><button class="btn btn-ghost" onclick="applyJarvisMemorySyncKey()">Применить ключ</button></div><div class="grid-2 mt-2"><button class="btn btn-ghost" onclick="copyJarvisMemorySyncKey()">Скопировать ключ</button><button class="btn btn-primary" onclick="syncJarvisMemory()">Синхронизировать</button></div><div class="footnote mt-2">'+(sync.lastSyncAt?'Последняя синхронизация: '+(root.esc?root.esc(new Date(sync.lastSyncAt).toLocaleString()):sync.lastSyncAt):'Пока не синхронизировалась')+'</div></div>';
}
function createSyncKey(){
 var m=state();if(!root.crypto||!root.crypto.getRandomValues){if(root.toast)root.toast('Браузер не поддерживает защищённую генерацию ключей','error');return;}
 m.sync={id:b64url(root.crypto.getRandomValues(new Uint8Array(18))),key:b64url(root.crypto.getRandomValues(new Uint8Array(32))),lastSyncAt:null};save();
 if(root.renderJarvis)root.renderJarvis();
 if(root.toast)root.toast('Ключ создан. Скопируй его и сохрани в надёжном месте.','success');
}
function applySyncKey(){
 var input=root.document&&root.document.getElementById('jarvisMemorySyncKey'),value=clean(input&&input.value,100),parts=value.split('.');
 if(parts.length!==2||!/^[A-Za-z0-9_-]{20,64}$/.test(parts[0])||!/^[A-Za-z0-9_-]{40,50}$/.test(parts[1])){if(root.toast)root.toast('Неверный ключ. Формат: ID.КЛЮЧ','warning');return;}
 try{if(unb64url(parts[0]).length!==18||unb64url(parts[1]).length!==32)throw new Error('invalid key');}catch(e){if(root.toast)root.toast('Ключ повреждён. Проверь скопированный текст.','warning');return;}
 var m=state();m.sync={id:parts[0],key:parts[1],lastSyncAt:null};save();if(root.renderJarvis)root.renderJarvis();if(root.toast)root.toast('Ключ синхронизации применён','success');
}
async function copySyncKey(){
 var secret=syncSecret();if(!secret){if(root.toast)root.toast('Сначала создай ключ синхронизации','warning');return;}
 try{await root.navigator.clipboard.writeText(secret);if(root.toast)root.toast('Секретный ключ скопирован. Сохрани его отдельно.','success');}
 catch(e){var input=root.document&&root.document.getElementById('jarvisMemorySyncKey');if(input){input.focus();input.select();if(root.toast)root.toast('Выделил ключ — скопируй его вручную','info');}else if(root.toast)root.toast('Не удалось скопировать ключ','error');}
}
function mergeById(local,remote,stamp){
 var map={};(Array.isArray(local)?local:[]).concat(Array.isArray(remote)?remote:[]).forEach(function(item){
  if(!item||typeof item!=='object'||!item.id)return;
  var old=map[item.id],a=Date.parse(item[stamp]||item.updatedAt||item.createdAt||0)||0,b=old?Date.parse(old[stamp]||old.updatedAt||old.createdAt||0)||0:0;
  if(!old||a>=b)map[item.id]=item;
 });return Object.keys(map).map(function(id){return map[id];});
}
async async function syncMemory(){
 var m=state(),sync=m.sync,d=root.state&&root.state.jarvis||{};
 if(!sync.id||!sync.key)throw new Error('Сначала создай или примени ключ синхронизации.');
 if(!d.apiUrl||!d.accessCode)throw new Error('Сначала настрой URL Worker и код доступа Джарвиса.');
 if(!root.crypto||!root.crypto.subtle)throw new Error('Нужен защищённый контекст HTTPS и поддержка Web Crypto.');
 var key=await root.crypto.subtle.importKey('raw',unb64url(sync.key),{name:'AES-GCM'},false,['encrypt','decrypt']);
 var url=new URL(d.apiUrl);url.searchParams.set('action','memory:get');url.searchParams.set('id',sync.id);
 var headers={'X-Jarvis-Access-Code':String(d.accessCode)};
 var response=await root.fetch(url.toString(),{method:'GET',headers:headers});
 var result=await response.json().catch(function(){return {};});
 if(!response.ok)throw new Error(result.message||'Не удалось прочитать облачную память ('+response.status+').');
 var remote={memory:[],customSkills:[],reminders:[]};
 if(result.payload){
  var packed=unb64url(result.payload);if(packed.length<29)throw new Error('Облачная копия повреждена.');
  var iv=packed.slice(0,12),cipher=packed.slice(12),plain=await root.crypto.subtle.decrypt({name:'AES-GCM',iv:iv},key,cipher);
  remote=JSON.parse(new TextDecoder().decode(plain));
  if(!remote||remote.version!==1)throw new Error('Формат облачной копии не поддерживается.');
 }
 var merged={version:1,memory:mergeById(m.items,remote.memory,'updatedAt').slice(-500),customSkills:mergeById(customSkills(),remote.customSkills,'createdAt').slice(-30),reminders:mergeById(reminders(),remote.reminders,'createdAt').slice(-100)};
 var ivOut=root.crypto.getRandomValues(new Uint8Array(12)),plainOut=new TextEncoder().encode(JSON.stringify(merged)),cipherOut=await root.crypto.subtle.encrypt({name:'AES-GCM',iv:ivOut},key,plainOut),packedOut=new Uint8Array(ivOut.length+cipherOut.byteLength);packedOut.set(ivOut);packedOut.set(new Uint8Array(cipherOut),ivOut.length);
 var payload=b64url(packedOut);if(payload.length>700000)throw new Error('Облачная копия слишком большая. Удали лишние записи или экспортируй архив локально.');
 var saveResponse=await root.fetch(d.apiUrl,{method:'POST',headers:Object.assign({'Content-Type':'application/json'},headers),body:JSON.stringify({action:'memory:save',memoryId:sync.id,payload:payload})});
 var saved=await saveResponse.json().catch(function(){return {};});
 if(!saveResponse.ok)throw new Error(saved.message||'Не удалось записать облачную память ('+saveResponse.status+').');
 m.items=merged.memory;m.updatedAt=new Date().toISOString();root.state.jarvis.customSkills=merged.customSkills;root.state.jarvis.reminders=merged.reminders;
 sync.lastSyncAt=new Date().toISOString();save();if(root.renderJarvis)root.renderJarvis();
 return merged;
}
async function syncFromUI(){
 var button=root.document&&root.document.querySelector('#jarvisMemoryPanel button[onclick="syncJarvisMemory()"]');
 if(button){button.disabled=true;button.textContent='Синхронизация…';}
 try{await syncMemory();if(root.toast)root.toast('Память синхронизирована','success');}
 catch(e){if(root.toast)root.toast(String(e.message||e),'error');}
 finally{if(button){button.disabled=false;button.textContent='Синхронизировать память';}}
}
\nfunction row(x){
 return '<div class="list-row jarvis-memory-row" data-memory-search="'+(root.esc?root.esc(clean(x.text+' '+x.category,600).toLowerCase()):clean(x.text+' '+x.category,600).toLowerCase())+'"><div style="min-width:0;flex:1"><b>'+ (root.esc?root.esc(x.category):x.category)+'</b><div>'+ (root.esc?root.esc(x.text):x.text)+'</div><div class="footnote">'+(root.esc?root.esc(String(x.updatedAt||'').slice(0,10)):'')+'</div></div><button class="btn btn-ghost btn-xs" onclick="removeJarvisMemory(\''+x.id+'\')" aria-label="Удалить факт">✕</button></div>';
}

function customSkills(){
 var app=root.state;if(!app)return [];
 if(!app.jarvis)app.jarvis={};
 if(!Array.isArray(app.jarvis.customSkills))app.jarvis.customSkills=[];
 return app.jarvis.customSkills;
}
function renderCustomSkills(){
 var skills=customSkills(),html='<section class="card mt-3"><div class="card-title">🛠️ Конструктор навыков</div><div class="footnote">Создавай собственные сценарии Джарвиса. Навык отправляет сохранённую инструкцию в диалог ИИ.</div>';
 html+='<div class="field mt-2"><label class="field-label" for="jarvisSkillName">Название</label><input id="jarvisSkillName" maxlength="60" placeholder="Например: Подготовка к экзамену"></div><div class="field"><label class="field-label" for="jarvisSkillPrompt">Инструкция навыка</label><textarea id="jarvisSkillPrompt" rows="3" maxlength="1200" placeholder="Опиши, что должен делать Джарвис"></textarea></div><button class="btn btn-primary btn-block" onclick="saveJarvisCustomSkill()">Создать навык</button>';
 skills.slice(0,30).forEach(function(x){html+='<div class="list-row"><div style="min-width:0;flex:1"><b>'+ (root.esc?root.esc(x.name):x.name)+'</b><div class="footnote">'+(root.esc?root.esc(x.prompt):x.prompt)+'</div></div><button class="btn btn-primary btn-xs" onclick="runJarvisCustomSkill(\''+x.id+'\')">Запуск</button><button class="btn btn-ghost btn-xs" onclick="deleteJarvisCustomSkill(\''+x.id+'\')">✕</button></div>';});
 html+='<div class="grid-2 mt-2"><button class="btn btn-ghost" onclick="exportJarvisData()">Экспорт данных</button><label class="btn btn-ghost" style="text-align:center">Импорт JSON<input type="file" accept="application/json,.json" onchange="importJarvisData(this)" style="display:none"></label></div></section>';return html;
}
function exportData(){
 var app=root.state||{},payload={version:1,exportedAt:new Date().toISOString(),memory:state()?state().items:[],customSkills:customSkills(),reminders:reminders()};
 try{var blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='lifeos-jarvis-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();URL.revokeObjectURL(url);if(root.toast)root.toast('Резервная копия подготовлена','success');}catch(e){if(root.toast)root.toast('Не удалось экспортировать данные','error');}
}
function importData(input){
 var file=input&&input.files&&input.files[0];if(!file)return;
 if(file.size>1024*1024){if(root.toast)root.toast('Файл больше 1 МБ','warning');input.value='';return;}
 var reader=new FileReader();reader.onload=function(){
  try{
   var data=JSON.parse(String(reader.result||'{}'));if(!data||data.version!==1)throw new Error('Неподдерживаемый формат резервной копии');
   var m=state(),existing={};m.items.forEach(function(x){existing[x.id]=true;});
   (Array.isArray(data.memory)?data.memory:[]).slice(0,500).forEach(function(x){if(x&&typeof x.text==='string'&&clean(x.text,500)){var id=safeId(x.id);if(!existing[id]){m.items.push({id:id,text:clean(x.text,500),category:clean(x.category,40)||'Факт',createdAt:x.createdAt||new Date().toISOString(),updatedAt:x.updatedAt||new Date().toISOString()});existing[id]=true;}}});
   var skills=customSkills(),skillIds={};skills.forEach(function(x){skillIds[x.id]=true;});
   (Array.isArray(data.customSkills)?data.customSkills:[]).slice(0,30).forEach(function(x){if(x&&typeof x.name==='string'&&typeof x.prompt==='string'&&clean(x.name,60)&&clean(x.prompt,1200)){var id=safeId(x.id);if(!skillIds[id]){skills.push({id:id,name:clean(x.name,60),prompt:clean(x.prompt,1200),createdAt:x.createdAt||new Date().toISOString()});skillIds[id]=true;}}});
   var remindersList=reminders(),reminderIds={};remindersList.forEach(function(x){reminderIds[x.id]=true;});
   (Array.isArray(data.reminders)?data.reminders:[]).slice(0,100).forEach(function(x){if(x&&typeof x.text==='string'&&clean(x.text,160)&&Number.isFinite(Date.parse(x.at))){var id=safeId(x.id);if(!reminderIds[id]){remindersList.push({id:id,text:clean(x.text,160),at:new Date(x.at).toISOString(),done:!!x.done,createdAt:x.createdAt||new Date().toISOString()});reminderIds[id]=true;}}});
   if(m.items.length>500)m.items=m.items.slice(-500);if(skills.length>30)skills.splice(30);if(remindersList.length>100)remindersList.splice(0,remindersList.length-100);
   save();if(root.toast)root.toast('Импорт завершён: память, навыки и напоминания объединены','success');if(root.renderJarvis)root.renderJarvis();
  }catch(e){if(root.toast)root.toast('Ошибка импорта: '+String(e.message||e),'error');}
  input.value='';
 };reader.onerror=function(){if(root.toast)root.toast('Не удалось прочитать файл','error');input.value='';};reader.readAsText(file);
}
function saveSkillFromUI(){
 var n=document.getElementById('jarvisSkillName'),p=document.getElementById('jarvisSkillPrompt'),name=clean(n&&n.value,60),prompt=clean(p&&p.value,1200);
 if(!name||!prompt){if(root.toast)root.toast('Укажи название и инструкцию навыка','warning');return;}
 var list=customSkills();if(list.length>=30){if(root.toast)root.toast('Максимум 30 собственных навыков','warning');return;}
 list.push({id:uid(),name:name,prompt:prompt,createdAt:new Date().toISOString()});save();if(root.toast)root.toast('Навык создан','success');if(root.renderJarvis)root.renderJarvis();
}
function runSkill(id){var x=customSkills().find(function(s){return s.id===id;});if(!x)return;var enabled=!!(root.state&&root.state.jarvis&&root.state.jarvis.cloudAIEnabled);if(!enabled){if(root.toast)root.toast('Для запуска навыка включи облачный ИИ в настройках Джарвиса','warning');if(root.navigate)root.navigate('ai');return;}if(root.jarvisQuick)root.jarvisQuick(x.prompt);}
function deleteSkill(id){var app=root.state;if(!app||!app.jarvis)return;app.jarvis.customSkills=customSkills().filter(function(x){return x.id!==id;});save();if(root.renderJarvis)root.renderJarvis();}
function reminders(){
 var app=root.state;if(!app)return [];
 if(!app.jarvis)app.jarvis={};
 if(!Array.isArray(app.jarvis.reminders))app.jarvis.reminders=[];
 return app.jarvis.reminders;
}
function renderReminders(){
 var rows=reminders(),html='<section class="card mt-3"><div class="card-title">⏰ Напоминания Джарвиса</div><div class="footnote">Уведомления срабатывают, пока LIFEOS открыт в браузере. Для надёжной доставки при закрытом приложении нужен серверный планировщик.</div><div class="field mt-2"><label class="field-label" for="jarvisReminderText">О чём напомнить</label><input id="jarvisReminderText" maxlength="160" placeholder="Например: повторить английские слова"></div><div class="field"><label class="field-label" for="jarvisReminderAt">Дата и время</label><input id="jarvisReminderAt" type="datetime-local"></div><button class="btn btn-primary btn-block" onclick="saveJarvisReminder()">Добавить напоминание</button>';
 rows.filter(function(x){return !x.done;}).sort(function(a,b){return String(a.at).localeCompare(String(b.at));}).slice(0,20).forEach(function(x){html+='<div class="list-row"><div style="flex:1;min-width:0"><b>'+(root.esc?root.esc(x.text):x.text)+'</b><div class="footnote">'+(root.esc?root.esc(new Date(x.at).toLocaleString()):x.at)+'</div></div><button class="btn btn-ghost btn-xs" onclick="deleteJarvisReminder(\''+x.id+'\')">✕</button></div>';});
 html+='</section>';return html;
}
function saveReminderFromUI(){
 var t=document.getElementById('jarvisReminderText'),d=document.getElementById('jarvisReminderAt'),text=clean(t&&t.value,160),at=d&&d.value?new Date(d.value):null;
 if(!text||!at||!Number.isFinite(at.getTime())||at.getTime()<=Date.now()){if(root.toast)root.toast('Укажи текст и время в будущем','warning');return;}
 var list=reminders();list.push({id:uid(),text:text,at:at.toISOString(),done:false,createdAt:new Date().toISOString()});save();
 if(root.Notification&&root.Notification.permission==='default')root.Notification.requestPermission().catch(function(){});
 if(root.toast)root.toast('Напоминание сохранено','success');if(root.renderJarvis)root.renderJarvis();
}
function deleteReminder(id){var app=root.state;if(!app||!app.jarvis)return;app.jarvis.reminders=reminders().filter(function(x){return x.id!==id;});save();if(root.renderJarvis)root.renderJarvis();}
function checkReminders(){
 var due=reminders().filter(function(x){return !x.done&&new Date(x.at).getTime()<=Date.now();});
 due.forEach(function(x){x.done=true;try{if(root.Notification&&root.Notification.permission==='granted')new root.Notification('LIFEOS · Джарвис',{body:x.text,tag:'lifeos-'+x.id});}catch(e){}if(root.toast)root.toast('⏰ '+x.text,'info',6000);});
 if(due.length)save();
}

function filter(query){
 var container=root.document&&root.document.getElementById('jarvisMemoryItems');if(!container)return;
 var matches=search(query,100);
 container.innerHTML=matches.length?matches.map(row).join(''):'<div class="footnote">Ничего не найдено.</div>';
}
function saveFromUI(){
 var input=document.getElementById('jarvisMemoryText'),category=document.getElementById('jarvisMemoryCategory');
 try{var item=add(input&&input.value,category&&category.value);if(input)input.value='';if(root.toast)root.toast('Сохранено в памяти Джарвиса','success');if(root.renderJarvis)root.renderJarvis();}
 catch(e){if(root.toast)root.toast(e.message,'error');}
}
function removeFromUI(id){if(!remove(id))return;if(root.toast)root.toast('Запись удалена','success');if(root.renderJarvis)root.renderJarvis();}
root.LIFEOS_JARVIS_MEMORY={list:list,add:add,remove:remove,clear:clear,search:search,context:context,render:render};
root.createJarvisMemorySyncKey=createSyncKey;
root.copyJarvisMemorySyncKey=copySyncKey;
root.applyJarvisMemorySyncKey=applySyncKey;
root.syncJarvisMemory=syncFromUI;
root.saveJarvisMemoryFromUI=saveFromUI;
root.filterJarvisMemory=filter;
root.removeJarvisMemory=removeFromUI;
root.exportJarvisData=exportData;
root.importJarvisData=importData;
root.saveJarvisCustomSkill=saveSkillFromUI;
root.runJarvisCustomSkill=runSkill;
root.deleteJarvisCustomSkill=deleteSkill;
root.saveJarvisReminder=saveReminderFromUI;
root.deleteJarvisReminder=deleteReminder;
if(root.document){checkReminders();root.setInterval(checkReminders,30000);root.addEventListener('focus',checkReminders);root.document.addEventListener('visibilitychange',function(){if(!root.document.hidden)checkReminders();});}
})(typeof window!=='undefined'?window:globalThis);
