'use strict';
(function(root,factory){
  var api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.LIFEOS_INTELLIGENCE_CORE=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  function list(value){return Array.isArray(value)?value:[];}
  function dateKey(value){
    if(!value)return '';
    var raw=String(value).slice(0,10);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(raw))return '';
    var parts=raw.split('-').map(Number),date=new Date(Date.UTC(parts[0],parts[1]-1,parts[2]));
    return date.getUTCFullYear()===parts[0]&&date.getUTCMonth()===parts[1]-1&&date.getUTCDate()===parts[2]?raw:'';
  }
  function numeric(value){
    if(value===null||value===undefined||(typeof value==='string'&&value.trim()===''))return null;
    var n=Number(value);return Number.isFinite(n)?n:null;
  }
  function average(values){
    var clean=values.filter(function(x){return x!==null&&Number.isFinite(x);});
    return clean.length?clean.reduce(function(a,b){return a+b;},0)/clean.length:null;
  }
  function pearson(pairs){
    if(pairs.length<7)return null;
    var xs=pairs.map(function(p){return p[0];}),ys=pairs.map(function(p){return p[1];});
    var ax=average(xs),ay=average(ys),num=0,dx=0,dy=0;
    pairs.forEach(function(p){var x=p[0]-ax,y=p[1]-ay;num+=x*y;dx+=x*x;dy+=y*y;});
    return dx&&dy?num/Math.sqrt(dx*dy):null;
  }
  function analyze(state,today){
    state=state&&typeof state==='object'?state:{};
    var localNow=new Date(),localToday=localNow.getFullYear()+'-'+String(localNow.getMonth()+1).padStart(2,'0')+'-'+String(localNow.getDate()).padStart(2,'0');
    var now=dateKey(today)||localToday;
    var tasks=list(state.tasks),inactiveStatuses={completed:true,done:true,cancelled:true,canceled:true,archived:true,deleted:true};
    var active=tasks.filter(function(t){var status=String(t&&t.status||'').trim().toLowerCase();return t&&!inactiveStatuses[status];});
    var overdue=active.filter(function(t){var due=dateKey(t.due_date||t.dueDate||t.deadline);return due&&due<now;});
    var sleeps=list(state.sleepEntries),moods=list(state.customMood);
    var sleepByDate={},moodByDate={};
    sleeps.forEach(function(x){var d=dateKey(x&&x.date),h=numeric(x&&(x.hours??x.durationHours));if(d&&h!==null&&h>0&&h<=24)sleepByDate[d]=h;});
    moods.forEach(function(x){var d=dateKey(x&&x.date),m=numeric(x&&(x.score??x.mood));if(d&&m!==null&&m>=0&&m<=10)moodByDate[d]=m;});
    var sleepValues=Object.keys(sleepByDate).sort().slice(-14).map(function(d){return sleepByDate[d];});
    var moodValues=Object.keys(moodByDate).sort().slice(-14).map(function(d){return moodByDate[d];});
    var paired=Object.keys(sleepByDate).filter(function(d){return Object.prototype.hasOwnProperty.call(moodByDate,d);}).sort().slice(-30).map(function(d){return [sleepByDate[d],moodByDate[d]];});
    var sleepMoodCorrelation=pearson(paired);
    var goals=list(state.customGoals||state.goals);
    var activeGoals=goals.filter(function(g){return g&&g.status!=='completed'&&g.completed!==true;});
    var habits=list(state.habits);
    var learningRecords=Object.keys(state).filter(function(k){return /Progress$/.test(k)&&state[k]&&typeof state[k]==='object';});
    var learningRecordCount=learningRecords.reduce(function(total,k){return total+Object.keys(state[k]).length;},0);
    var recommendations=[];
    function add(item){recommendations.push(item);}
    if(overdue.length)add({id:'overdue-tasks',level:'high',title:'Пересмотреть просроченные задачи',detail:'Есть '+overdue.length+' активных задач с прошедшим сроком. Сначала проверь, какие из них всё ещё актуальны.',why:'Сроки задач в сохранённом списке: '+overdue.length+' просрочено из '+active.length+' активных.',timeMinutes:5,successCriteria:'Для каждой просроченной задачи выбран статус: выполнить, перенести или отменить.',target:'tasks',confidence:'Высокая · прямые записи задач'});
    if(active.length>=9)add({id:'task-overload',level:'medium',title:'Снизить текущую нагрузку',detail:'В списке '+active.length+' активных задач. Большой список может затруднять выбор следующего действия.',why:'Количество активных задач превышает внутренний ориентир 8; это эвристика, а не диагноз перегрузки.',timeMinutes:5,successCriteria:'Выбраны не более трёх главных результатов на сегодня.',target:'tasks',confidence:'Средняя · количество задач'});
    if(sleepValues.length>=3){
      var sleepAvg=average(sleepValues);
      if(sleepAvg!==null&&sleepAvg<6.5)add({id:'sleep-review',level:'medium',title:'Проверить режим восстановления',detail:'Средняя продолжительность последних записанных ночей — '+sleepAvg.toFixed(1)+' ч. Сравни её со своим самочувствием и обычным режимом.',why:'Расчёт по '+sleepValues.length+' пользовательским записям сна; это не медицинская оценка.',timeMinutes:3,successCriteria:'Записаны время сна, пробуждения и самочувствие утром.',target:'sleep',confidence:'Средняя · самоотчёт пользователя'});
    }
    if(paired.length>=7&&sleepMoodCorrelation!==null&&Math.abs(sleepMoodCorrelation)>=0.55){
      add({id:'sleep-mood-pattern',level:'info',title:'Проверить связь сна и настроения',detail:'В записях заметна корреляция между продолжительностью сна и оценкой настроения (r='+sleepMoodCorrelation.toFixed(2)+'). Это наблюдаемая связь, не доказательство причинности.',why:'Сопоставлено '+paired.length+' дат, в которые есть обе записи.',timeMinutes:5,successCriteria:'В течение следующей недели продолжай отмечать сон и настроение, затем сравни динамику.',target:'stats',confidence:'Ограниченная · личные наблюдения, возможны смешивающие факторы'});
    }
    if(activeGoals.length&&active.length===0){
      add({id:'goal-next-action',level:'info',title:'Связать цель со следующим действием',detail:'Есть '+activeGoals.length+' активных целей, но нет активных задач, которые могли бы продвинуть их.',why:'В профиле целей есть незавершённые записи, а список активных задач пуст.',timeMinutes:5,successCriteria:'Для одной приоритетной цели создан следующий конкретный шаг.',target:'tasks',confidence:'Средняя · сравнение сохранённых целей и задач'});
    }
    var tracked={
      tasks:tasks.length,
      goals:goals.length,
      sleep:sleeps.length,
      mood:moods.length,
      habits:habits.length,
      learningRecords:learningRecordCount,
      calendar:list(state.calendarEvents).length
    };
    var available=Object.keys(tracked).filter(function(k){return tracked[k]>0;}).length;
    return {
      generatedAt:now,
      recommendations:recommendations,
      signals:{activeTasks:active.length,overdueTasks:overdue.length,activeGoals:activeGoals.length,sleepMoodPairedDays:paired.length,sleepMoodCorrelation:sleepMoodCorrelation},
      quality:{trackedSections:available,totalSections:Object.keys(tracked).length,coveragePercent:Math.round(available/Object.keys(tracked).length*100),tracked:tracked,missingSections:Object.keys(tracked).filter(function(k){return tracked[k]===0;})},
      limitations:['Результаты основаны только на сохранённых в LIFEOS записях.','Отсутствующие данные не считаются нулевыми.','Корреляции не доказывают причинность.','Пороговые значения — эвристики приложения, а не медицинские или психологические диагнозы.']
    };
  }
  return {analyze:analyze,version:'1.0.0'};
});
