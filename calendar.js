'use strict';
/* ============================================================
   LIFE OS — CALENDAR.js
   Полная копия Google Calendar (месяц/неделя/день)
   + Создание событий: конца/цвет/уведомления/описание/повтор
   ============================================================ */

/* ============ STORAGE ============ */
var CAL_KEY = 'life_os_calendar_v1';

function calLoad(){
  try{
    var raw = localStorage.getItem(CAL_KEY);
    if(!raw) return [];
    var arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  }catch(e){ return []; }
}

function calSave(events){
  try{ localStorage.setItem(CAL_KEY, JSON.stringify(events)); }
  catch(e){ console.error('calSave:', e); }
}

function calNextId(){
  return 'ev_' + Date.now().toString(36) + Math.random().toString(36).slice(2,8);
}

/* ============ GOOGLE COLORS ============ */
var CAL_COLORS = [
  {id:'tomato',    name:'Помидор',   hex:'#d50000'},
  {id:'flamingo',  name:'Фламинго',  hex:'#e67c73'},
  {id:'tangerine', name:'Мандарин',  hex:'#f4511e'},
  {id:'banana',    name:'Банан',     hex:'#f6bf26'},
  {id:'sage',      name:'Шалфей',    hex:'#33b679'},
  {id:'basil',     name:'Базилик',   hex:'#0b8043'},
  {id:'peacock',   name:'Павлин',    hex:'#039be5'},
  {id:'blueberry', name:'Черника',   hex:'#3f51b5'},
  {id:'lavender',  name:'Лаванда',   hex:'#7986cb'},
  {id:'grape',     name:'Виноград',  hex:'#8e24aa'},
  {id:'graphite',  name:'Графит',    hex:'#616161'}
];

function calColorHex(id){
  var c = CAL_COLORS.find(function(x){return x.id===id});
  return c ? c.hex : '#5b9eff';
}

/* ============ NOTIFICATION PRESETS ============ */
var CAL_NOTIFICATIONS = [
  {value:0,     label:'Не напоминать'},
  {value:5,     label:'За 5 минут'},
  {value:10,    label:'За 10 минут'},
  {value:15,    label:'За 15 минут'},
  {value:30,    label:'За 30 минут'},
  {value:60,    label:'За 1 час'},
  {value:120,   label:'За 2 часа'},
  {value:1440,  label:'За 1 день'},
  {value:2880,  label:'За 2 дня'},
  {value:10080, label:'За 1 неделю'}
];

/* ============ REPEAT ============ */
var CAL_REPEATS = [
  {value:'none',    label:'Не повторять'},
  {value:'daily',   label:'Каждый день'},
  {value:'weekday', label:'По будням (Пн-Пт)'},
  {value:'weekly',  label:'Каждую неделю'},
  {value:'biweekly',label:'Каждые 2 недели'},
  {value:'monthly', label:'Каждый месяц'},
  {value:'yearly',  label:'Каждый год'}
];

/* ============ DATE UTILS ============ */
function calPad(n){return String(n).padStart(2,'0')}
function calTodayISO(){
  var d = new Date();
  return d.getFullYear()+'-'+calPad(d.getMonth()+1)+'-'+calPad(d.getDate());
}
function calISO(date){
  return date.getFullYear()+'-'+calPad(date.getMonth()+1)+'-'+calPad(date.getDate());
}
function calParseISO(iso){
  var parts = (iso||'').split('-');
  if(parts.length!==3) return new Date();
  return new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]));
}
function calDaysInMonth(y,m){return new Date(y, m+1, 0).getDate()}
function calMonthName(m){
  var names=['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
  return names[m];
}
function calMonthNameShort(m){
  var names=['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];
  return names[m];
}
function calWeekDayName(d){
  var names=['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
  return names[d];
}
function calWeekDayNameFull(d){
  var names=['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'];
  return names[d];
}
function calStartOfWeek(date){
  var d = new Date(date);
  var day = d.getDay();
  var diff = d.getDate() - day + (day===0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0,0,0,0);
  return d;
}

/* ============ VIEW STATE ============ */
var CAL_VIEW = 'month';
var CAL_CURSOR = new Date();

/* ============ EVENT HELPERS ============ */
function calEventsOnDate(dateISO){
  var all = calLoad();
  return all.filter(function(ev){
    var start = (ev.start||'').slice(0,10);
    var end = (ev.end||ev.start||'').slice(0,10);
    if(start && end && start !== end){
      return dateISO >= start && dateISO <= end;
    }
    return start === dateISO;
  }).sort(function(a,b){ return (a.start||'').localeCompare(b.start||''); });
}

function calFormatTime(iso){
  if(!iso) return '';
  var t = iso.slice(11,16);
  return t || '';
}

function calNotifLabel(v){
  var n = CAL_NOTIFICATIONS.find(function(x){return x.value===v});
  return n ? n.label : '—';
}
function calRepeatLabel(v){
  var r = CAL_REPEATS.find(function(x){return x.value===v});
  return r ? r.label : '';
}

function calEscape(s){
  return String(s==null?'':s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

/* ============ MAIN RENDER ============ */
function renderGcal(){
  var app = document.getElementById('app');
  if(!app) return;

  var html = '<div class="page cal-page">';

  html += '<div class="cal-toolbar">';
  html += '<button class="cal-nav-btn" onclick="calNavigate(\'prev\')">‹</button>';
  html += '<button class="cal-today-btn" onclick="calGoToday()">Сегодня</button>';
  html += '<button class="cal-nav-btn" onclick="calNavigate(\'next\')">›</button>';
  html += '<div class="cal-title">' + calGetTitle() + '</div>';
  html += '<div class="cal-views">';
  html += '<button class="cal-view-btn '+(CAL_VIEW==='day'?'active':'')+'" onclick="calSetView(\'day\')">День</button>';
  html += '<button class="cal-view-btn '+(CAL_VIEW==='week'?'active':'')+'" onclick="calSetView(\'week\')">Нед</button>';
  html += '<button class="cal-view-btn '+(CAL_VIEW==='month'?'active':'')+'" onclick="calSetView(\'month\')">Мес</button>';
  html += '</div>';
  html += '</div>';

  html += '<button class="btn btn-primary btn-block cal-add-btn" onclick="openEventEditor(null)">➕ Новое событие</button>';

  if(CAL_VIEW === 'month') html += calRenderMonth();
  else if(CAL_VIEW === 'week') html += calRenderWeek();
  else html += calRenderDay();

  html += calRenderLegend();

  html += '<div class="card" style="margin-top:14px;"><h2>📅 Google Calendar</h2>';
  html += '<div class="footnote text-secondary mb-2">Создать событие сразу в Google</div>';
  html += '<button class="btn btn-ghost btn-block" onclick="openEventEditor(null,true)">📤 Открыть в Google Calendar</button>';
  html += '<button class="btn btn-ghost btn-block mt-2" onclick="window.open(\'https://calendar.google.com\',\'_blank\')">↗ Открыть сайт</button>';
  html += '</div>';

  html += '</div>';
  app.innerHTML = html;
}

function calGetTitle(){
  if(CAL_VIEW === 'month'){
    return calMonthName(CAL_CURSOR.getMonth()) + ' ' + CAL_CURSOR.getFullYear();
  }
  if(CAL_VIEW === 'week'){
    var s = calStartOfWeek(CAL_CURSOR);
    var e = new Date(s); e.setDate(s.getDate()+6);
    return s.getDate() + ' ' + calMonthNameShort(s.getMonth()) + ' – ' + e.getDate() + ' ' + calMonthNameShort(e.getMonth());
  }
  return CAL_CURSOR.getDate() + ' ' + calMonthName(CAL_CURSOR.getMonth()) + ' ' + CAL_CURSOR.getFullYear();
}

function calNavigate(dir){
  if(CAL_VIEW === 'month'){
    CAL_CURSOR = new Date(CAL_CURSOR.getFullYear(), CAL_CURSOR.getMonth() + (dir==='next'?1:-1), 1);
  } else if(CAL_VIEW === 'week'){
    CAL_CURSOR = new Date(CAL_CURSOR);
    CAL_CURSOR.setDate(CAL_CURSOR.getDate() + (dir==='next'?7:-7));
  } else {
    CAL_CURSOR = new Date(CAL_CURSOR);
    CAL_CURSOR.setDate(CAL_CURSOR.getDate() + (dir==='next'?1:-1));
  }
  renderGcal();
}

function calGoToday(){ CAL_CURSOR = new Date(); renderGcal(); }
function calSetView(v){ CAL_VIEW = v; renderGcal(); }

/* ============ MONTH VIEW ============ */
function calRenderMonth(){
  var y = CAL_CURSOR.getFullYear();
  var m = CAL_CURSOR.getMonth();
  var first = new Date(y, m, 1);
  var firstDay = first.getDay();
  var offset = firstDay === 0 ? 6 : firstDay - 1;
  var days = calDaysInMonth(y, m);
  var todayISO = calTodayISO();

  var html = '<div class="cal-month">';
  html += '<div class="cal-month-head">';
  ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].forEach(function(d){
    html += '<div class="cal-month-head-cell">' + d + '</div>';
  });
  html += '</div>';
  html += '<div class="cal-month-grid">';

  var prevMonth = new Date(y, m, 0);
  var prevDays = prevMonth.getDate();
  for(var i = offset - 1; i >= 0; i--){
    var dnum = prevDays - i;
    html += '<div class="cal-month-cell cal-other-month"><div class="cal-day-num">' + dnum + '</div></div>';
  }

  for(var d = 1; d <= days; d++){
    var iso = y + '-' + calPad(m+1) + '-' + calPad(d);
    var evs = calEventsOnDate(iso);
    var isToday = iso === todayISO;
    var cls = 'cal-month-cell';
    if(isToday) cls += ' cal-today';
    html += '<div class="' + cls + '" onclick="calOpenDay(\'' + iso + '\')">';
    html += '<div class="cal-day-num">' + d + '</div>';
    if(evs.length){
      html += '<div class="cal-day-events">';
      var show = evs.slice(0,3);
      show.forEach(function(ev){
        html += '<div class="cal-event-dot" style="background:' + calColorHex(ev.color) + '"></div>';
      });
      if(evs.length > 3){
        html += '<div class="cal-day-more">+' + (evs.length - 3) + '</div>';
      }
      html += '</div>';
    }
    html += '</div>';
  }

  var totalCells = offset + days;
  var remaining = (7 - (totalCells % 7)) % 7;
  for(var n = 1; n <= remaining; n++){
    html += '<div class="cal-month-cell cal-other-month"><div class="cal-day-num">' + n + '</div></div>';
  }

  html += '</div></div>';
  return html;
}

/* ============ WEEK VIEW ============ */
function calRenderWeek(){
  var start = calStartOfWeek(CAL_CURSOR);
  var todayISO = calTodayISO();
  var html = '<div class="cal-week">';

  for(var i = 0; i < 7; i++){
    var d = new Date(start);
    d.setDate(start.getDate() + i);
    var iso = calISO(d);
    var evs = calEventsOnDate(iso);
    var isToday = iso === todayISO;
    var cls = 'cal-week-day';
    if(isToday) cls += ' cal-today';
    html += '<div class="' + cls + '" onclick="calOpenDay(\'' + iso + '\')">';
    html += '<div class="cal-week-day-head">';
    html += '<div class="cal-week-day-name">' + calWeekDayName(d.getDay()) + '</div>';
    html += '<div class="cal-week-day-num">' + d.getDate() + ' ' + calMonthNameShort(d.getMonth()) + '</div>';
    html += '</div>';
    if(evs.length){
      html += '<div class="cal-week-events">';
      evs.forEach(function(ev){
        html += '<div class="cal-week-event" style="border-left-color:' + calColorHex(ev.color) + '">';
        if(ev.start && ev.start.length > 10){
          html += '<div class="cal-week-event-time">' + calFormatTime(ev.start) + '</div>';
        }
        html += '<div class="cal-week-event-title">' + calEscape(ev.title||'Событие') + '</div>';
        html += '</div>';
      });
      html += '</div>';
    } else {
      html += '<div class="cal-week-empty">—</div>';
    }
    html += '</div>';
  }

  html += '</div>';
  return html;
}

/* ============ DAY VIEW ============ */
function calRenderDay(){
  var iso = calISO(CAL_CURSOR);
  var evs = calEventsOnDate(iso);
  var d = calParseISO(iso);
  var html = '<div class="cal-day">';
  html += '<div class="cal-day-header">';
  html += '<div class="cal-day-header-name">' + calWeekDayNameFull(d.getDay()) + '</div>';
  html += '<div class="cal-day-header-date">' + d.getDate() + ' ' + calMonthName(d.getMonth()) + ' ' + d.getFullYear() + '</div>';
  html += '</div>';

  if(evs.length === 0){
    html += '<div class="empty"><div class="empty-icon">📅</div><div class="empty-title">Нет событий</div><div class="empty-text">Нажми "Новое событие"</div></div>';
  } else {
    evs.forEach(function(ev){
      html += calRenderEventCard(ev);
    });
  }
  html += '</div>';
  return html;
}

function calRenderEventCard(ev){
  var color = calColorHex(ev.color);
  var html = '<div class="cal-event-card" style="border-left-color:' + color + '" onclick="openEventEditor(\''+ev.id+'\')">';
  html += '<div class="cal-event-card-time">';
  if(ev.start && ev.start.length > 10){
    html += calFormatTime(ev.start);
    if(ev.end && ev.end.length > 10 && ev.end.slice(0,10) === ev.start.slice(0,10)){
      html += ' – ' + calFormatTime(ev.end);
    }
  } else {
    html += 'Весь день';
  }
  html += '</div>';
  html += '<div class="cal-event-card-body">';
  html += '<div class="cal-event-card-title">' + calEscape(ev.title || 'Событие') + '</div>';
  if(ev.description){
    html += '<div class="cal-event-card-desc">' + calEscape(ev.description).slice(0, 100) + '</div>';
  }
  var badges = [];
  if(ev.notify > 0) badges.push('🔔 ' + calNotifLabel(ev.notify));
  if(ev.repeat && ev.repeat !== 'none') badges.push('🔁 ' + calRepeatLabel(ev.repeat));
  if(badges.length){
    html += '<div class="cal-event-card-badges">' + badges.join(' · ') + '</div>';
  }
  html += '</div>';
  html += '</div>';
  return html;
}

function calRenderLegend(){
  var html = '<div class="card" style="margin-top:14px;"><h2>🎨 Цвета</h2>';
  html += '<div class="cal-legend">';
  CAL_COLORS.forEach(function(c){
    html += '<div class="cal-legend-item"><span class="cal-legend-dot" style="background:' + c.hex + '"></span>' + c.name + '</div>';
  });
  html += '</div></div>';
  return html;
}

function calOpenDay(iso){
  CAL_CURSOR = calParseISO(iso);
  CAL_VIEW = 'day';
  renderGcal();
}

/* ============ EVENT EDITOR ============ */
function openEventEditor(id, forceGoogle){
  var events = calLoad();
  var ev = id ? events.find(function(x){return x.id===id}) : null;

  var isNew = !ev;
  var now = new Date();
  var defaultStart = calISO(now) + 'T' + calPad(now.getHours()) + ':' + calPad(now.getMinutes());

  var title = ev ? (ev.title||'') : '';
  var start = ev ? (ev.start||defaultStart) : defaultStart;
  var end = ev ? (ev.end||defaultStart) : '';
  var color = ev ? (ev.color||'peacock') : 'peacock';
  var notify = ev ? (ev.notify!==undefined?ev.notify:30) : 30;
  var repeat = ev ? (ev.repeat||'none') : 'none';
  var description = ev ? (ev.description||'') : '';

  var html = '';

  html += '<div class="field"><label class="field-label">Название</label>';
  html += '<input type="text" id="cev-title" value="' + calEscape(title) + '" placeholder="Встреча, задача..."/></div>';

  html += '<div class="field"><label class="field-label">Описание</label>';
  html += '<textarea id="cev-desc" placeholder="Заметки...">' + calEscape(description) + '</textarea></div>';

  html += '<div class="field"><label class="field-label">Начало</label>';
  html += '<input type="datetime-local" id="cev-start" value="' + start + '"/></div>';

  html += '<div class="field"><label class="field-label">Конец <span style="text-transform:none;font-weight:500;color:var(--text-3);">(необязательно)</span></label>';
  html += '<input type="datetime-local" id="cev-end" value="' + end + '"/></div>';

  html += '<div class="field"><label class="field-label">Цвет</label>';
  html += '<div class="cal-color-picker">';
  CAL_COLORS.forEach(function(c){
    var active = c.id === color;
    html += '<button type="button" class="cal-color-btn' + (active ? ' active' : '') + '" data-color="' + c.id + '" onclick="calPickColor(\'' + c.id + '\')" title="' + c.name + '" style="background:' + c.hex + '"></button>';
  });
  html += '</div>';
  html += '<input type="hidden" id="cev-color" value="' + color + '"/>';
  html += '</div>';

  html += '<div class="field"><label class="field-label">Напоминание</label>';
  html += '<select id="cev-notify">';
  CAL_NOTIFICATIONS.forEach(function(n){
    html += '<option value="' + n.value + '"' + (n.value===notify?' selected':'') + '>' + n.label + '</option>';
  });
  html += '</select></div>';

  html += '<div class="field"><label class="field-label">Повтор</label>';
  html += '<select id="cev-repeat">';
  CAL_REPEATS.forEach(function(r){
    html += '<option value="' + r.value + '"' + (r.value===repeat?' selected':'') + '>' + r.label + '</option>';
  });
  html += '</select></div>';

  html += '<button class="btn btn-primary btn-block mt-3" onclick="saveEvent(' + (id ? '\'' + id + '\'' : 'null') + ')">' + (isNew ? '➕ Создать' : '💾 Сохранить') + '</button>';

  if(!isNew){
    html += '<button class="btn btn-ghost btn-block mt-2" onclick="googleExportEvent(\'' + id + '\')">📤 Открыть в Google Calendar</button>';
    html += '<button class="btn btn-danger btn-block mt-2" onclick="deleteEvent(\'' + id + '\')">🗑 Удалить</button>';
  } else if(forceGoogle){
    html += '<button class="btn btn-ghost btn-block mt-2" onclick="googleCreateFromForm()">📤 Открыть в Google Calendar</button>';
  }

  openSheet(isNew ? 'Новое событие' : 'Событие', html);
}

function calPickColor(id){
  var inp = document.getElementById('cev-color');
  if(inp) inp.value = id;
  document.querySelectorAll('.cal-color-btn').forEach(function(b){
    if(b.getAttribute('data-color')===id) b.classList.add('active');
    else b.classList.remove('active');
  });
}

function saveEvent(id){
  var title = (document.getElementById('cev-title')||{}).value||'';
  if(!title.trim()){ toast('Введи название','error'); return; }
  var description = (document.getElementById('cev-desc')||{}).value||'';
  var start = (document.getElementById('cev-start')||{}).value||'';
  var end = (document.getElementById('cev-end')||{}).value||'';
  var color = (document.getElementById('cev-color')||{}).value||'peacock';
  var notify = parseInt((document.getElementById('cev-notify')||{}).value||'0');
  var repeat = (document.getElementById('cev-repeat')||{}).value||'none';

  if(!start){ toast('Укажи начало','error'); return; }
  if(end && end < start){ toast('Конец раньше начала','error'); return; }

  var events = calLoad();
  if(id){
    var ev = events.find(function(x){return x.id===id});
    if(!ev) return;
    ev.title = title.trim();
    ev.description = description;
    ev.start = start;
    ev.end = end;
    ev.color = color;
    ev.notify = notify;
    ev.repeat = repeat;
    ev.updatedAt = new Date().toISOString();
  } else {
    events.push({
      id: calNextId(),
      title: title.trim(),
      description: description,
      start: start,
      end: end,
      color: color,
      notify: notify,
      repeat: repeat,
      createdAt: new Date().toISOString()
    });
  }

  calSave(events);
  haptic('success');
  closeSheet();
  toast(id ? '💾 Сохранено' : '✓ Создано','success');
  renderGcal();
}

function deleteEvent(id){
  if(!confirm('Удалить событие?')) return;
  var events = calLoad().filter(function(x){return x.id!==id});
  calSave(events);
  closeSheet();
  toast('Удалено','info');
  renderGcal();
}

/* ============ GOOGLE EXPORT ============ */
function googleExportEvent(id){
  var ev = calLoad().find(function(x){return x.id===id});
  if(!ev) return;
  var url = calBuildGoogleUrl(ev);
  window.open(url,'_blank');
}

function googleCreateFromForm(){
  var title = (document.getElementById('cev-title')||{}).value||'';
  if(!title.trim()){ toast('Введи название','error'); return; }
  var description = (document.getElementById('cev-desc')||{}).value||'';
  var start = (document.getElementById('cev-start')||{}).value||'';
  var end = (document.getElementById('cev-end')||{}).value||'';
  var notify = parseInt((document.getElementById('cev-notify')||{}).value||'0');
  var repeat = (document.getElementById('cev-repeat')||{}).value||'none';

  var ev = {title:title, description:description, start:start, end:end, notify:notify, repeat:repeat};
  var url = calBuildGoogleUrl(ev);
  window.open(url,'_blank');
}

function calBuildGoogleUrl(ev){
  if(!ev || !ev.start) return 'https://calendar.google.com';

  function gfmt(iso){
    if(!iso) return '';
    var s = iso.replace(/[-:]/g,'');
    if(s.length === 13) s += '00';
    return s;
  }

  var start = gfmt(ev.start);
  var end = ev.end ? gfmt(ev.end) : gfmt(ev.start);
  if(!ev.end){
    var d = new Date(ev.start);
    d.setHours(d.getHours()+1);
    end = gfmt(d.getFullYear()+'-'+calPad(d.getMonth()+1)+'-'+calPad(d.getDate())+'T'+calPad(d.getHours())+':'+calPad(d.getMinutes()));
  }

  var repeatRule = '';
  if(ev.repeat && ev.repeat !== 'none'){
    var map = {
      daily:'RRULE:FREQ=DAILY',
      weekday:'RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR',
      weekly:'RRULE:FREQ=WEEKLY',
      biweekly:'RRULE:FREQ=WEEKLY;INTERVAL=2',
      monthly:'RRULE:FREQ=MONTHLY',
      yearly:'RRULE:FREQ=YEARLY'
    };
    repeatRule = map[ev.repeat] || '';
  }

  var params = {
    action: 'TEMPLATE',
    text: ev.title || 'Событие',
    dates: start + '/' + end,
    details: ev.description || '',
    sf: 'true'
  };
  if(repeatRule) params.recur = repeatRule;

  return 'https://calendar.google.com/calendar/render?' + Object.keys(params).map(function(k){
    return k + '=' + encodeURIComponent(params[k]);
  }).join('&');
}

/* ============ EXPORTS ============ */
window.renderGcal = renderGcal;
window.calNavigate = calNavigate;
window.calGoToday = calGoToday;
window.calSetView = calSetView;
window.calOpenDay = calOpenDay;
window.openEventEditor = openEventEditor;
window.saveEvent = saveEvent;
window.deleteEvent = deleteEvent;
window.calPickColor = calPickColor;
window.googleExportEvent = googleExportEvent;
window.googleCreateFromForm = googleCreateFromForm;
window.CAL_COLORS = CAL_COLORS;
window.CAL_NOTIFICATIONS = CAL_NOTIFICATIONS;
window.CAL_REPEATS = CAL_REPEATS;
window.calLoad = calLoad;
window.calSave = calSave;
window.calTodayISO = calTodayISO;

console.log('[CALENDAR] loaded');