'use strict';
/* INTEGRATIONS EXTENDED — OBSIDIAN, GOOGLE CALENDAR, NOTION, TODOIST, GEMINI */

var OBSIDIAN_CONFIG={
  apiUrl:'http://localhost:27123',
  apiKey:'',
  vaultPath:'',
  defaultFolder:'AI-Health',
  autoSync:false,
  syncInterval:300000,
  lastSync:null,
  templates:{
    note:'# {{title}}\n\nДата: {{date}}\nТеги: {{tags}}\n\n{{content}}',
    task:'- [ ] {{title}} #task #{{priority}} 📅 {{date}}',
    journal:'# {{date}}\n\n## Победы\n- \n\n## Уроки\n- \n\n## Благодарности\n- ',
    learning:'# {{title}}\n\nУровень: {{level}}\nУрок: {{lesson}}\n\n## Теория\n{{theory}}\n\n## Практика\n{{practice}}\n\n## Рефлексия\n{{reflection}}'
  }
};

var OBSIDIAN_API={
  async ping(){
    try{
      var resp=await fetch(OBSIDIAN_CONFIG.apiUrl+'/',{
        method:'GET',
        headers:{'Authorization':'Bearer '+OBSIDIAN_CONFIG.apiKey}
      });
      return resp.ok;
    }catch(e){return false}
  },
  async saveNote(path,content){
    try{
      var resp=await fetch(OBSIDIAN_CONFIG.apiUrl+'/vault/'+encodeURIComponent(path),{
        method:'PUT',
        headers:{
          'Authorization':'Bearer '+OBSIDIAN_CONFIG.apiKey,
          'Content-Type':'text/markdown'
        },
        body:content
      });
      return resp.ok;
    }catch(e){return false}
  },
  async readNote(path){
    try{
      var resp=await fetch(OBSIDIAN_CONFIG.apiUrl+'/vault/'+encodeURIComponent(path),{
        headers:{'Authorization':'Bearer '+OBSIDIAN_CONFIG.apiKey}
      });
      if(!resp.ok)return null;
      return await resp.text();
    }catch(e){return null}
  },
  async deleteNote(path){
    try{
      var resp=await fetch(OBSIDIAN_CONFIG.apiUrl+'/vault/'+encodeURIComponent(path),{
        method:'DELETE',
        headers:{'Authorization':'Bearer '+OBSIDIAN_CONFIG.apiKey}
      });
      return resp.ok;
    }catch(e){return false}
  },
  async search(query){
    try{
      var resp=await fetch(OBSIDIAN_CONFIG.apiUrl+'/search/simple/?query='+encodeURIComponent(query),{
        headers:{'Authorization':'Bearer '+OBSIDIAN_CONFIG.apiKey}
      });
      if(!resp.ok)return [];
      return await resp.json();
    }catch(e){return []}
  },
  async listFiles(folder){
    try{
      var resp=await fetch(OBSIDIAN_CONFIG.apiUrl+'/vault/'+encodeURIComponent(folder||'')+'/',{
        headers:{'Authorization':'Bearer '+OBSIDIAN_CONFIG.apiKey}
      });
      if(!resp.ok)return [];
      return await resp.json();
    }catch(e){return []}
  }
};

async function syncTasksToObsidian(){
  if(!OBSIDIAN_CONFIG.apiKey)return false;
  var tasks=state.tasks||[];
  var content='# Задачи AI Health\n\nОбновлено: '+new Date().toLocaleString('ru')+'\n\n';
  var pending=tasks.filter(function(t){return t.status==='pending'});
  var done=tasks.filter(function(t){return t.status==='completed'});
  content+='## Активные ('+pending.length+')\n\n';
  pending.forEach(function(t){
    content+='- [ ] '+t.title+' #'+t.priority+' ⏱'+t.planned_time+'мин\n';
  });
  content+='\n## Выполненные ('+done.length+')\n\n';
  done.slice(-20).forEach(function(t){
    content+='- [x] '+t.title+'\n';
  });
  var path=OBSIDIAN_CONFIG.defaultFolder+'/Tasks.md';
  return await OBSIDIAN_API.saveNote(path,content);
}

async function syncNotesToObsidian(){
  if(!OBSIDIAN_CONFIG.apiKey)return false;
  var notes=state.notes||[];
  var ok=0;
  for(var i=0;i<notes.length;i++){
    var n=notes[i];
    var content='# '+n.title+'\n\nДата: '+n.created_at+'\n\n'+n.content;
    var path=OBSIDIAN_CONFIG.defaultFolder+'/Notes/'+sanitizeFilename(n.title)+'.md';
    if(await OBSIDIAN_API.saveNote(path,content))ok++;
  }
  return ok;
}

async function syncLearningToObsidian(){
  if(!OBSIDIAN_CONFIG.apiKey)return false;
  var content='# Прогресс обучения\n\nОбновлено: '+new Date().toLocaleString('ru')+'\n\n';
  if(typeof LEARNING_LEVELS!=='undefined'){
    LEARNING_LEVELS.forEach(function(level){
      var p=(typeof getLevelProgress==='function')?getLevelProgress(level.id):{done:0,total:0,pct:0};
      content+='## '+level.emoji+' '+level.title+' — '+p.pct+'%\n\n';
      content+='Прогресс: '+p.done+'/'+p.total+'\n\n';
    });
  }
  if(state.englishProgress){
    content+='## 🇬🇧 English\n\n';
    content+='Уроков изучено: '+Object.keys(state.englishProgress).length+'\n\n';
  }
  var path=OBSIDIAN_CONFIG.defaultFolder+'/Learning.md';
  return await OBSIDIAN_API.saveNote(path,content);
}

async function syncJournalToObsidian(){
  if(!OBSIDIAN_CONFIG.apiKey)return false;
  var journal=state.journalEntries||state.journal||[];
  var ok=0;
  for(var i=0;i<journal.length;i++){
    var j=journal[i];
    var content='# '+(j.date||new Date().toISOString().slice(0,10))+'\n\n'+(j.content||'');
    var path=OBSIDIAN_CONFIG.defaultFolder+'/Journal/'+(j.date||new Date().toISOString().slice(0,10))+'.md';
    if(await OBSIDIAN_API.saveNote(path,content))ok++;
  }
  return ok;
}

async function syncAllToObsidian(){
  if(!OBSIDIAN_CONFIG.apiKey){
    if(typeof toast==='function')toast('Obsidian API key не настроен','error');
    return false;
  }
  if(typeof toast==='function')toast('Синхронизация...','info');
  var results=[];
  results.push(await syncTasksToObsidian());
  results.push(await syncNotesToObsidian());
  results.push(await syncLearningToObsidian());
  results.push(await syncJournalToObsidian());
  OBSIDIAN_CONFIG.lastSync=new Date().toISOString();
  saveObsidianConfig();
  var okCount=results.filter(function(r){return r}).length;
  if(typeof toast==='function')toast('Синхронизировано: '+okCount+'/4','success');
  return true;
}

async function importFromObsidian(folder){
  var files=await OBSIDIAN_API.listFiles(folder);
  if(!files||files.length===0){
    if(typeof toast==='function')toast('Файлы не найдены','warning');
    return 0;
  }
  var imported=0;
  for(var i=0;i<files.length;i++){
    var f=files[i];
    if(f.endsWith('.md')){
      var content=await OBSIDIAN_API.readNote(folder+'/'+f);
      if(content){
        if(!state.customNotes)state.customNotes=[];
        state.customNotes.push({
          id:(typeof uid==='function'?uid():Date.now().toString(36)),
          title:f.replace('.md',''),
          content:content,
          created_at:(typeof nowISO==='function'?nowISO():new Date().toISOString()),
          source:'obsidian'
        });
        imported++;
      }
    }
  }
  if(imported>0&&typeof save==='function')save();
  if(typeof toast==='function')toast('Импортировано: '+imported,'success');
  return imported;
}

function sanitizeFilename(name){
  return String(name).replace(/[^a-zA-Z0-9а-яА-Я\s\-_]/g,'').trim()||'untitled';
}

function saveObsidianConfig(){
  try{
    localStorage.setItem('obsidian_config',JSON.stringify(OBSIDIAN_CONFIG));
  }catch(e){}
}

function loadObsidianConfig(){
  try{
    var data=JSON.parse(localStorage.getItem('obsidian_config')||'null');
    if(data)Object.assign(OBSIDIAN_CONFIG,data);
  }catch(e){}
}

/* GOOGLE CALENDAR */
var GCAL_CONFIG={
  clientId:'',
  apiKey:'',
  accessToken:null,
  refreshToken:null,
  expiresAt:null,
  calendarId:'primary',
  autoSync:false,
  lastSync:null
};

var GCAL_API={
  async authorize(){
    if(!GCAL_CONFIG.clientId){
      if(typeof toast==='function')toast('Client ID не настроен','error');
      return false;
    }
    var redirectUri=window.location.origin+window.location.pathname;
    var scope='https://www.googleapis.com/auth/calendar';
    var url='https://accounts.google.com/o/oauth2/v2/auth?'+
      'client_id='+encodeURIComponent(GCAL_CONFIG.clientId)+
      '&redirect_uri='+encodeURIComponent(redirectUri)+
      '&response_type=token'+
      '&scope='+encodeURIComponent(scope)+
      '&include_granted_scopes=true';
    window.location.href=url;
    return true;
  },
  checkTokenFromUrl(){
    if(window.location.hash){
      var params=new URLSearchParams(window.location.hash.substring(1));
      var token=params.get('access_token');
      var expiresIn=params.get('expires_in');
      if(token){
        GCAL_CONFIG.accessToken=token;
        GCAL_CONFIG.expiresAt=Date.now()+(parseInt(expiresIn)||3600)*1000;
        saveGCalConfig();
        history.replaceState(null,'',window.location.pathname);
        if(typeof toast==='function')toast('Google Calendar подключён','success');
        return true;
      }
    }
    return false;
  },
  isAuthorized(){
    return GCAL_CONFIG.accessToken&&GCAL_CONFIG.expiresAt>Date.now();
  },
  async createEvent(event){
    if(!this.isAuthorized())return null;
    try{
      var resp=await fetch('https://www.googleapis.com/calendar/v3/calendars/'+GCAL_CONFIG.calendarId+'/events',{
        method:'POST',
        headers:{
          'Authorization':'Bearer '+GCAL_CONFIG.accessToken,
          'Content-Type':'application/json'
        },
        body:JSON.stringify(event)
      });
      return await resp.json();
    }catch(e){return null}
  },
  async listEvents(timeMin,timeMax){
    if(!this.isAuthorized())return [];
    try{
      var url='https://www.googleapis.com/calendar/v3/calendars/'+GCAL_CONFIG.calendarId+'/events?'+
        'timeMin='+encodeURIComponent(timeMin||new Date().toISOString())+
        '&timeMax='+encodeURIComponent(timeMax||new Date(Date.now()+7*86400000).toISOString())+
        '&singleEvents=true&orderBy=startTime';
      var resp=await fetch(url,{
        headers:{'Authorization':'Bearer '+GCAL_CONFIG.accessToken}
      });
      var data=await resp.json();
      return data.items||[];
    }catch(e){return []}
  },
  async updateEvent(eventId,event){
    if(!this.isAuthorized())return null;
    try{
      var resp=await fetch('https://www.googleapis.com/calendar/v3/calendars/'+GCAL_CONFIG.calendarId+'/events/'+eventId,{
        method:'PATCH',
        headers:{
          'Authorization':'Bearer '+GCAL_CONFIG.accessToken,
          'Content-Type':'application/json'
        },
        body:JSON.stringify(event)
      });
      return await resp.json();
    }catch(e){return null}
  },
  async deleteEvent(eventId){
    if(!this.isAuthorized())return false;
    try{
      var resp=await fetch('https://www.googleapis.com/calendar/v3/calendars/'+GCAL_CONFIG.calendarId+'/events/'+eventId,{
        method:'DELETE',
        headers:{'Authorization':'Bearer '+GCAL_CONFIG.accessToken}
      });
      return resp.ok;
    }catch(e){return false}
  }
};

async function syncTasksToGCal(){
  if(!GCAL_API.isAuthorized()){
    if(typeof toast==='function')toast('Сначала авторизуйся','error');
    return 0;
  }
  var tasks=(state.tasks||[]).filter(function(t){return t.status==='pending'&&t.due_date});
  var ok=0;
  for(var i=0;i<tasks.length;i++){
    var t=tasks[i];
    var event={
      summary:t.title,
      description:'Приоритет: '+t.priority+'\nВремя: '+t.planned_time+' мин',
      start:{dateTime:t.due_date,timeZone:'Europe/Moscow'},
      end:{dateTime:new Date(new Date(t.due_date).getTime()+(t.planned_time||30)*60000).toISOString(),timeZone:'Europe/Moscow'},
      reminders:{useDefault:false,overrides:[{method:'popup',minutes:15}]}
    };
    var result=await GCAL_API.createEvent(event);
    if(result&&result.id)ok++;
  }
  GCAL_CONFIG.lastSync=new Date().toISOString();
  saveGCalConfig();
  if(typeof toast==='function')toast('Синхронизировано: '+ok,'success');
  return ok;
}

async function importFromGCal(){
  if(!GCAL_API.isAuthorized()){
    if(typeof toast==='function')toast('Сначала авторизуйся','error');
    return 0;
  }
  var events=await GCAL_API.listEvents();
  var imported=0;
  for(var i=0;i<events.length;i++){
    var e=events[i];
    var exists=(state.tasks||[]).some(function(t){return t.gcal_id===e.id});
    if(!exists){
      state.tasks.push({
        id:(typeof uid==='function'?uid():Date.now().toString(36)),
        title:e.summary||'Событие',
        planned_time:30,
        actual_time:0,
        status:'pending',
        priority:'medium',
        category:'Google Calendar',
        due_date:e.start.dateTime||e.start.date,
        gcal_id:e.id,
        created_at:(typeof nowISO==='function'?nowISO():new Date().toISOString())
      });
      imported++;
    }
  }
  if(imported>0&&typeof save==='function')save();
  if(typeof toast==='function')toast('Импортировано: '+imported,'success');
  return imported;
}

async function createGCalEventFromTask(taskId){
  var t=(state.tasks||[]).find(function(x){return x.id===taskId});
  if(!t)return null;
  if(!t.due_date){
    if(typeof toast==='function')toast('Нет даты у задачи','warning');
    return null;
  }
  var event={
    summary:t.title,
    description:'AI Health Task\nПриоритет: '+t.priority,
    start:{dateTime:t.due_date,timeZone:'Europe/Moscow'},
    end:{dateTime:new Date(new Date(t.due_date).getTime()+(t.planned_time||30)*60000).toISOString(),timeZone:'Europe/Moscow'}
  };
  var result=await GCAL_API.createEvent(event);
  if(result&&result.id){
    t.gcal_id=result.id;
    if(typeof save==='function')save();
    if(typeof toast==='function')toast('Событие создано','success');
  }
  return result;
}

function saveGCalConfig(){
  try{
    localStorage.setItem('gcal_config',JSON.stringify(GCAL_CONFIG));
  }catch(e){}
}

function loadGCalConfig(){
  try{
    var data=JSON.parse(localStorage.getItem('gcal_config')||'null');
    if(data)Object.assign(GCAL_CONFIG,data);
  }catch(e){}
}

/* NOTION */
var NOTION_CONFIG={
  apiKey:'',
  databaseId:'',
  enabled:false
};

var NOTION_API={
  async createPage(title,content){
    if(!NOTION_CONFIG.apiKey||!NOTION_CONFIG.databaseId)return null;
    try{
      var resp=await fetch('https://api.notion.com/v1/pages',{
        method:'POST',
        headers:{
          'Authorization':'Bearer '+NOTION_CONFIG.apiKey,
          'Content-Type':'application/json',
          'Notion-Version':'2022-06-28'
        },
        body:JSON.stringify({
          parent:{database_id:NOTION_CONFIG.databaseId},
          properties:{
            Name:{title:[{text:{content:title}}]}
          },
          children:[{
            object:'block',
            type:'paragraph',
            paragraph:{rich_text:[{type:'text',text:{content:content}}]}
          }]
        })
      });
      return await resp.json();
    }catch(e){return null}
  }
};

/* TODOIST */
var TODOIST_CONFIG={
  apiKey:'',
  enabled:false
};

var TODOIST_API={
  async createTask(content,priority,dueString){
    if(!TODOIST_CONFIG.apiKey)return null;
    try{
      var resp=await fetch('https://api.todoist.com/rest/v2/tasks',{
        method:'POST',
        headers:{
          'Authorization':'Bearer '+TODOIST_CONFIG.apiKey,
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          content:content,
          priority:priority||1,
          due_string:dueString||'today'
        })
      });
      return await resp.json();
    }catch(e){return null}
  },
  async getTasks(){
    if(!TODOIST_CONFIG.apiKey)return [];
    try{
      var resp=await fetch('https://api.todoist.com/rest/v2/tasks',{
        headers:{'Authorization':'Bearer '+TODOIST_CONFIG.apiKey}
      });
      return await resp.json();
    }catch(e){return []}
  }
};

/* GEMINI */
var GEMINI_CONFIG={
  apiKey:'',
  model:'gemini-1.5-flash',
  models:['gemini-1.5-flash','gemini-1.5-pro','gemini-2.0-flash-exp'],
  temperature:0.8,
  maxTokens:800
};

async function callGeminiExtended(prompt,history){
  if(!GEMINI_CONFIG.apiKey)return null;
  try{
    var contents=[];
    if(history){
      history.forEach(function(m){
        contents.push({role:m.role==='user'?'user':'model',parts:[{text:m.text}]});
      });
    }
    contents.push({role:'user',parts:[{text:prompt}]});
    var resp=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+GEMINI_CONFIG.model+':generateContent?key='+GEMINI_CONFIG.apiKey,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        contents:contents,
        generationConfig:{
          temperature:GEMINI_CONFIG.temperature,
          maxOutputTokens:GEMINI_CONFIG.maxTokens
        }
      })
    });
    var data=await resp.json();
    return data.candidates&&data.candidates[0]&&data.candidates[0].content&&data.candidates[0].content.parts&&data.candidates[0].content.parts[0]?data.candidates[0].content.parts[0].text:null;
  }catch(e){return null}
}

function initIntegrationsExt(){
  loadObsidianConfig();
  loadGCalConfig();
  if(GCAL_API.checkTokenFromUrl()){
    if(typeof toast==='function')toast('Google Calendar подключён','success');
  }
}

window.__OBSIDIAN_CONFIG=OBSIDIAN_CONFIG;
window.__OBSIDIAN_API=OBSIDIAN_API;
window.__syncAllToObsidian=syncAllToObsidian;
window.__syncTasksToObsidian=syncTasksToObsidian;
window.__syncNotesToObsidian=syncNotesToObsidian;
window.__syncLearningToObsidian=syncLearningToObsidian;
window.__syncJournalToObsidian=syncJournalToObsidian;
window.__importFromObsidian=importFromObsidian;
window.__saveObsidianConfig=saveObsidianConfig;
window.__GCAL_CONFIG=GCAL_CONFIG;
window.__GCAL_API=GCAL_API;
window.__syncTasksToGCal=syncTasksToGCal;
window.__importFromGCal=importFromGCal;
window.__createGCalEventFromTask=createGCalEventFromTask;
window.__saveGCalConfig=saveGCalConfig;
window.__NOTION_CONFIG=NOTION_CONFIG;
window.__NOTION_API=NOTION_API;
window.__TODOIST_CONFIG=TODOIST_CONFIG;
window.__TODOIST_API=TODOIST_API;
window.__GEMINI_CONFIG=GEMINI_CONFIG;
window.__callGeminiExtended=callGeminiExtended;
window.__initIntegrationsExt=initIntegrationsExt;