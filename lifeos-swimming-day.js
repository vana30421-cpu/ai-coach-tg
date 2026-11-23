(function(){
'use strict';
var DAY_NAMES=['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
var DAY_VALUES=[1,2,3,4,5,6,0];
function getSettings(){
  if(!state.schedule||typeof state.schedule!=='object')state.schedule={times:{},customEvents:[]};
  if(!Array.isArray(state.schedule.swimmingDays))state.schedule.swimmingDays=[];
  state.schedule.swimmingDays=state.schedule.swimmingDays.filter(function(day){return Number.isInteger(day)&&day>=0&&day<=6;});
  return state.schedule;
}
function localDateKey(){
  var value=typeof LIFE_SCHEDULE_DATE==='string'&&LIFE_SCHEDULE_DATE?LIFE_SCHEDULE_DATE:'';
  if(value)return value;
  var d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function renderPanel(){
  var root=document.getElementById('app');
  if(!root)return;
  var settings=getSettings(),selected=localDateKey(),date=new Date(selected+'T12:00:00'),weekday=date.getDay(),isSwimming=settings.swimmingDays.indexOf(weekday)>=0;
  var choices=DAY_VALUES.map(function(day,index){
    return '<label class="swim-day-choice" style="display:flex;align-items:center;gap:6px;padding:8px 10px;border:1px solid var(--glass-border);border-radius:12px;cursor:pointer"><input type="checkbox" value="'+day+'" '+(settings.swimmingDays.indexOf(day)>=0?'checked':'')+' onchange="lifeOSSetSwimmingDay('+day+',this.checked)" aria-label="Бассейн '+DAY_NAMES[index]+'"><span>'+DAY_NAMES[index]+'</span></label>';
  }).join('');
  var html='<section class="card mt-3 lifeos-swimming-day" aria-labelledby="swimDayTitle"><div class="row-between"><div><h2 id="swimDayTitle" style="margin:0">🏊 Режим дня с бассейном</h2><div class="footnote">Выбери дни — LIFEOS покажет отдельный порядок дел</div></div><span class="badge">'+(isSwimming?'Сегодня по плану':'Настройка')+'</span></div><div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin-top:12px">'+choices+'</div>';
  if(isSwimming){
    html+='<div class="mt-3"><div class="section-title">Порядок дня · '+date.toLocaleDateString('ru-RU',{weekday:'long',day:'numeric',month:'long'})+'</div><div class="list-row"><span>😌</span><span><b>После школы — 10 минут спокойной паузы</b><div class="footnote">Переключись с учёбы на отдых, не открывая ленту</div></span></div><div class="list-row"><span>😴</span><span><b>Дневной сон — 10 минут</b><div class="footnote">Короткий отдых с будильником</div></span></div><div class="list-row"><span>📋</span><span><b>Планирование — 5 минут</b><div class="footnote">Посмотри список уроков и выбери порядок</div></span></div><div class="list-row"><span>🎒</span><span><b>Подготовка к бассейну — 5 минут</b><div class="footnote">Собери необходимые вещи заранее</div></span></div><div class="list-row"><span>📚</span><span><b>До бассейна — приоритетные уроки</b><div class="footnote">Выполни сначала задания с ближайшим сроком или наибольшей сложностью</div></span></div><div class="list-row"><span>📖</span><span><b>После бассейна — оставшиеся уроки</b><div class="footnote">Продолжи по обычному плану, без автоматического уменьшения нагрузки</div></span></div></div>';
  }else{
    html+='<div class="footnote mt-3">'+(settings.swimmingDays.length?'На выбранную дату бассейн не запланирован.':'Отметь дни недели, когда у тебя бассейн.')+'</div>';
  }
  html+='</section>';
  root.insertAdjacentHTML('beforeend',html);
}
window.lifeOSSetSwimmingDay=function(day,enabled){
  day=Number(day);if(!Number.isInteger(day)||day<0||day>6)return;
  var settings=getSettings(),days=settings.swimmingDays;
  if(enabled&&days.indexOf(day)<0)days.push(day);
  if(!enabled)settings.swimmingDays=days.filter(function(value){return value!==day;});
  settings.swimmingDays.sort(function(a,b){return DAY_VALUES.indexOf(a)-DAY_VALUES.indexOf(b);});
  if(!save()){toast('Не удалось сохранить дни бассейна','error');return;}
  renderSchedule();
};
var original=window.renderSchedule;
if(typeof original==='function'){
  window.renderSchedule=function(){original.apply(this,arguments);renderPanel();};
}
window.renderSwimmingDayPanel=renderPanel;
})();