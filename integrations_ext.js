'use strict';
/* AI HEALTH v33 — INTEGRATIONS EXT (Google Calendar, Obsidian, Notion, Todoist, Gemini) */

/* ============ БАЗОВЫЙ ХЕЛПЕР ============ */
function getState(){
  try{return window.state||state}catch(e){return null}
}
function getInt(key){
  var s=getState();
  if(!s||!s.integrations)return{};
  if(!s.integrations[key])s.integrations[key]={};
  return s.integrations[key];
}
function saveInt(){
  try{if(typeof window.save==='function')window.save()}catch(e){}
}
function toastInt(msg,type){
  try{if(typeof window.toast==='function')window.toast(msg,type||'info')}catch(e){}
}

/* ============ GOOGLE CALENDAR ============ */
function gcalConnect(clientId){
  var g=getInt('googleCalendar');
  g.clientId=clientId||g.clientId||'';
  if(!g.clientId){
    toastInt('Укажи Client ID','error');
    return false;
  }
  // OAuth-заглушка: в реальном приложении — Google Identity Services
  g.connected=true;
  g.lastSync=null;
  saveInt();
  toastInt('Google Calendar подключён (demo)','success');
  return true;
}
function gcalDisconnect(){
  var g=getInt('googleCalendar');
  g.connected=false;
  g.accessToken=null;
  g.lastSync=null;
  saveInt();
  toastInt('Google Calendar отключён','info');
}
function gcalSync(){
  var g=getInt('googleCalendar');
  if(!g.connected){
    toastInt('Сначала подключи','warning');
    return false;
  }
  // Demo: имитация синхронизации
  g.lastSync=new Date().toISOString();
  saveInt();
  toastInt('Синхронизация... (demo)','success');
  return true;
}
function gcalIsConnected(){
  return !!getInt('googleCalendar').connected;
}

/* ============ OBSIDIAN ============ */
function obsidianConnect(apiKey,folder){
  var o=getInt('obsidian');
  o.apiKey=(apiKey||'').trim();
  o.defaultFolder=(folder||'AI-Health').trim();
  if(!o.apiKey){
    toastInt('Укажи API Key','error');
    return false;
  }
  saveInt();
  toastInt('Obsidian подключён','success');
  return true;
}
function obsidianDisconnect(){
  var o=getInt('obsidian');
  o.apiKey='';
  o.lastSync=null;
  saveInt();
  toastInt('Obsidian отключён','info');
}
function obsidianExport(){
  var o=getInt('obsidian');
  if(!o.apiKey){
    toastInt('Сначала подключи','warning');
    return false;
  }
  // Demo: имитация экспорта
  o.lastSync=new Date().toISOString();
  saveInt();
  toastInt('Экспорт в Obsidian (demo)','success');
  return true;
}
function obsidianIsConnected(){
  return !!getInt('obsidian').apiKey;
}

/* ============ NOTION ============ */
function notionConnect(apiKey,databaseId){
  var n=getInt('notion');
  n.apiKey=(apiKey||'').trim();
  n.databaseId=(databaseId||'').trim();
  n.enabled=!!(n.apiKey&&n.databaseId);
  if(!n.enabled){
    toastInt('Заполни API Key и Database ID','error');
    return false;
  }
  saveInt();
  toastInt('Notion подключён','success');
  return true;
}
function notionDisconnect(){
  var n=getInt('notion');
  n.apiKey='';
  n.databaseId='';
  n.enabled=false;
  saveInt();
  toastInt('Notion отключён','info');
}
function notionIsConnected(){
  return !!getInt('notion').enabled;
}

/* ============ TODOIST ============ */
function todoistConnect(apiKey){
  var t=getInt('todoist');
  t.apiKey=(apiKey||'').trim();
  t.enabled=!!t.apiKey;
  if(!t.enabled){
    toastInt('Укажи API Key','error');
    return false;
  }
  saveInt();
  toastInt('Todoist подключён','success');
  return true;
}
function todoistDisconnect(){
  var t=getInt('todoist');
  t.apiKey='';
  t.enabled=false;
  saveInt();
  toastInt('Todoist отключён','info');
}
function todoistIsConnected(){
  return !!getInt('todoist').enabled;
}
function todoistExportTasks(){
  var t=getInt('todoist');
  if(!t.enabled){
    toastInt('Сначала подключи','warning');
    return false;
  }
  var tasks=[];
  try{
    var s=getState();
    tasks=(s.tasks||[]).filter(function(x){return x.status!=='completed'});
  }catch(e){}
  toastInt('Экспорт '+tasks.length+' задач в Todoist (demo)','success');
  return true;
}

/* ============ GEMINI ============ */
function geminiConnect(apiKey,model){
  var g=getInt('gemini');
  g.apiKey=(apiKey||'').trim();
  g.model=(model||g.model||'gemini-1.5-flash').trim();
  g.connected=!!g.apiKey;
  var s=getState();
  if(s&&s.settings)s.settings.apiKey=g.apiKey;
  saveInt();
  toastInt(g.connected?'Gemini подключён':'Укажи API Key',g.connected?'success':'error');
  return g.connected;
}
function geminiDisconnect(){
  var g=getInt('gemini');
  g.apiKey='';
  g.connected=false;
  var s=getState();
  if(s&&s.settings)s.settings.apiKey='';
  saveInt();
  toastInt('Gemini отключён','info');
}
function geminiIsConnected(){
  return !!getInt('gemini').apiKey;
}
async function geminiChat(prompt,systemPrompt){
  var g=getInt('gemini');
  if(!g.apiKey){
    toastInt('Gemini не подключён','warning');
    return null;
  }
  try{
    var model=g.model||'gemini-1.5-flash';
    var body={
      contents:[{role:'user',parts:[{text:prompt}]}]
    };
    if(systemPrompt)body.system_instruction={parts:[{text:systemPrompt}]};
    var resp=await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/'+model+':generateContent?key='+g.apiKey,
      {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}
    );
    var data=await resp.json();
    return (data.candidates&&data.candidates[0]&&data.candidates[0].content&&data.candidates[0].content.parts&&data.candidates[0].content.parts[0]&&data.candidates[0].content.parts[0].text)||null;
  }catch(e){
    toastInt('Ошибка Gemini','error');
    return null;
  }
}

/* ============ СТАТУС ВСЕХ ИНТЕГРАЦИЙ ============ */
function getAllIntegrationsStatus(){
  return{
    googleCalendar:gcalIsConnected(),
    obsidian:obsidianIsConnected(),
    notion:notionIsConnected(),
    todoist:todoistIsConnected(),
    gemini:geminiIsConnected()
  };
}
function renderIntegrationsExt(){
  var st=getAllIntegrationsStatus();
  var html='';
  // Google Calendar
  html+='<div class="card"><h2>📅 Google Calendar</h2>';
  if(st.googleCalendar){
    html+='<div class="footnote text-secondary mb-2">✓ Подключён</div>';
    html+='<button class="btn btn-primary btn-block mb-2" onclick="gcalSync()">🔄 Синхронизировать</button>';
    html+='<button class="btn btn-ghost btn-block" onclick="gcalDisconnect()">Отключить</button>';
  }else{
    html+='<div class="field"><label class="field-label">Client ID</label><input type="text" id="gcal-client" placeholder="xxx.apps.googleusercontent.com"/></div>';
    html+='<button class="btn btn-primary btn-block" onclick="gcalConnect((document.getElementById(\'gcal-client\')||{}).value)">🔗 Подключить</button>';
  }
  html+='</div>';
  // Obsidian
  html+='<div class="card"><h2>📓 Obsidian</h2>';
  if(st.obsidian){
    html+='<div class="footnote text-secondary mb-2">✓ Подключён</div>';
    html+='<button class="btn btn-primary btn-block mb-2" onclick="obsidianExport()">📤 Экспорт</button>';
    html+='<button class="btn btn-ghost btn-block" onclick="obsidianDisconnect()">Отключить</button>';
  }else{
    html+='<div class="field"><label class="field-label">API Key</label><input type="password" id="obs-key"/></div>';
    html+='<div class="field"><label class="field-label">Папка</label><input type="text" id="obs-folder" value="AI-Health"/></div>';
    html+='<button class="btn btn-primary btn-block" onclick="obsidianConnect((document.getElementById(\'obs-key\')||{}).value,(document.getElementById(\'obs-folder\')||{}).value)">🔗 Подключить</button>';
  }
  html+='</div>';
  // Notion
  html+='<div class="card"><h2>📝 Notion</h2>';
  if(st.notion){
    html+='<div class="footnote text-secondary mb-2">✓ Подключён</div>';
    html+='<button class="btn btn-ghost btn-block" onclick="notionDisconnect()">Отключить</button>';
  }else{
    html+='<div class="field"><label class="field-label">API Key</label><input type="password" id="not-key"/></div>';
    html+='<div class="field"><label class="field-label">Database ID</label><input type="text" id="not-db"/></div>';
    html+='<button class="btn btn-primary btn-block" onclick="notionConnect((document.getElementById(\'not-key\')||{}).value,(document.getElementById(\'not-db\')||{}).value)">🔗 Подключить</button>';
  }
  html+='</div>';
  // Todoist
  html+='<div class="card"><h2>✅ Todoist</h2>';
  if(st.todoist){
    html+='<div class="footnote text-secondary mb-2">✓ Подключён</div>';
    html+='<button class="btn btn-primary btn-block mb-2" onclick="todoistExportTasks()">📤 Экспорт задач</button>';
    html+='<button class="btn btn-ghost btn-block" onclick="todoistDisconnect()">Отключить</button>';
  }else{
    html+='<div class="field"><label class="field-label">API Key</label><input type="password" id="todo-key"/></div>';
    html+='<button class="btn btn-primary btn-block" onclick="todoistConnect((document.getElementById(\'todo-key\')||{}).value)">🔗 Подключить</button>';
  }
  html+='</div>';
  // Gemini
  html+='<div class="card"><h2>✨ Gemini AI</h2>';
  if(st.gemini){
    html+='<div class="footnote text-secondary mb-2">✓ Подключён</div>';
    html+='<button class="btn btn-ghost btn-block" onclick="geminiDisconnect()">Отключить</button>';
  }else{
    html+='<div class="field"><label class="field-label">API Key</label><input type="password" id="gem-key-ext"/></div>';
    html+='<div class="field"><label class="field-label">Модель</label><input type="text" id="gem-model" value="gemini-1.5-flash"/></div>';
    html+='<button class="btn btn-primary btn-block" onclick="geminiConnect((document.getElementById(\'gem-key-ext\')||{}).value,(document.getElementById(\'gem-model\')||{}).value)">🔗 Подключить</button>';
  }
  html+='</div>';
  return html;
}

/* ============ ЭКСПОРТ ============ */
window.gcalConnect=gcalConnect;
window.gcalDisconnect=gcalDisconnect;
window.gcalSync=gcalSync;
window.gcalIsConnected=gcalIsConnected;
window.obsidianConnect=obsidianConnect;
window.obsidianDisconnect=obsidianDisconnect;
window.obsidianExport=obsidianExport;
window.obsidianIsConnected=obsidianIsConnected;
window.notionConnect=notionConnect;
window.notionDisconnect=notionDisconnect;
window.notionIsConnected=notionIsConnected;
window.todoistConnect=todoistConnect;
window.todoistDisconnect=todoistDisconnect;
window.todoistIsConnected=todoistIsConnected;
window.todoistExportTasks=todoistExportTasks;
window.geminiConnect=geminiConnect;
window.geminiDisconnect=geminiDisconnect;
window.geminiIsConnected=geminiIsConnected;
window.geminiChat=geminiChat;
window.getAllIntegrationsStatus=getAllIntegrationsStatus;
window.renderIntegrationsExt=renderIntegrationsExt;