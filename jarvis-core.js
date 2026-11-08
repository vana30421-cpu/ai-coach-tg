(function(root){
  'use strict';
  function normalize(text){return String(text||'').toLowerCase().replace(/ё/g,'е').trim().replace(/\s+/g,' ');}
  var routes=[
    {id:'dashboard',keys:['главная','главную','домой','дашборд']},
    {id:'tasks',keys:['задачи','задачам','задач']},
    {id:'learning',keys:['обучение','учеба','учиться','уроки']},
    {id:'memory',keys:['память','запоминание','мнемоника']},
    {id:'vision',keys:['зрение','глаза','глаз']},
    {id:'health',keys:['здоровье','самочувствие']},
    {id:'sleep',keys:['сон','спать','режим сна','трекер сна']},
    {id:'walks',keys:['прогулки','прогулка','ходьба']},
    {id:'focus',keys:['фокус','концентрация','помодоро']},
    {id:'schedule',keys:['расписание','план дня','планирование','календарь']},
    {id:'fsrs',keys:['карточки','повторение','fsrs']},
    {id:'coach',keys:['коуч','коучинг']},
    {id:'stats',keys:['статистика','прогресс','отчет']},
    {id:'habitList',keys:['привычки','привычку']},
    {id:'projects',keys:['проекты','проект']},
    {id:'finance',keys:['финансы','деньги','бюджет']},
    {id:'brain',keys:['тренировка мозга','игры для мозга']},
    {id:'settings',keys:['настройки','параметры']}
  ];
  function parseCommand(input){
    var text=normalize(input),m;
    if(!text)return {type:'empty'};
    m=text.match(/^(?:добавь|создай|запиши|поставь)\s+(?:задачу|дело)(?:\s*[:—-]\s*|\s+)(.+)$/i);
    if(m&&m[1])return {type:'add_task',title:m[1].trim().slice(0,160)};
    if(/^(?:покажи|список|мои)\s*(?:задачи|дела)?$/.test(text)||/покажи мои задачи|список задач/.test(text))return {type:'list_tasks'};
    if(/^(?:сводка|мой день|как дела|статус|итоги дня)$/.test(text))return {type:'summary'};
    m=text.match(/^(?:фокус|помодоро|таймер)(?:\s+(\d{1,3}))?$/);
    if(m)return {type:'focus',minutes:m[1]?Math.max(5,Math.min(90,Number(m[1])||25)):null};
    m=text.match(/^(?:выполни|заверши|отметь)\s+(?:задачу\s*)?(\d+)$/);
    if(m)return {type:'complete_task',index:Number(m[1])};
    if(/^(?:очисти|удали)\s+(?:историю|диалог|чат)$/.test(text))return {type:'clear_chat'};
    m=text.match(/^(?:режим|работай как)\s+(планировщик|коуч|наставник|строгий|спокойный)$/);
    if(m)return {type:'set_mode',mode:m[1]};
    if(/^(?:помощь|что умеешь|команды)$/.test(text))return {type:'help'};
    for(var i=0;i<routes.length;i++){
      for(var k=0;k<routes[i].keys.length;k++){
        var key=normalize(routes[i].keys[k]);
        if(text==='открой '+key||text==='перейди в '+key||text==='открой раздел '+key||text==='покажи '+key)return {type:'navigate',page:routes[i].id};
      }
    }
    if(/тест|самооцен\w*|проверка состояния/.test(text))return {type:'checkin'};
    if(/методик|научн|техник/.test(text))return {type:'methods'};
    return {type:'chat',text:String(input).trim().slice(0,1000)};
  }
  var api={normalize:normalize,parseCommand:parseCommand};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.LifeOSJarvisCore=api;
})(typeof window!=='undefined'?window:globalThis);
