'use strict';
/* ============================================================
   LIFE OS — MEDICAL.js
   ИИ-Врач: показатели, история, анализ, советы
   ============================================================ */

var MED_KEY = 'life_os_medical_v1';

function medLoad(){
  try{
    var raw = localStorage.getItem(MED_KEY);
    if(!raw) return {metrics:[], entries:[]};
    var parsed = JSON.parse(raw);
    if(!parsed.metrics) parsed.metrics = [];
    if(!parsed.entries) parsed.entries = [];
    return parsed;
  }catch(e){ return {metrics:[], entries:[]}; }
}

function medSave(data){
  try{ localStorage.setItem(MED_KEY, JSON.stringify(data)); }
  catch(e){ console.error('medSave:', e); }
}

function medNextId(){
  return 'm_' + Date.now().toString(36) + Math.random().toString(36).slice(2,8);
}

/* ============ МЕТРИКИ ============ */
var MED_METRICS = [
  {id:'bp_sys',   name:'Давление систолическое', unit:'мм рт.ст.', icon:'💓', min:80,  max:220, normal:[110,130], warn:[90,140],   danger:[80,180]},
  {id:'bp_dia',   name:'Давление диастолическое', unit:'мм рт.ст.', icon:'💓', min:40,  max:140, normal:[70,85],   warn:[60,90],    danger:[50,110]},
  {id:'pulse',    name:'Пульс',                   unit:'уд/мин',    icon:'❤️', min:30,  max:200, normal:[60,80],   warn:[50,100],   danger:[40,140]},
  {id:'temp',     name:'Температура',             unit:'°C',        icon:'🌡',  min:34,  max:42,  normal:[36.3,37.0], warn:[35.5,37.5], danger:[35,38.5]},
  {id:'weight',   name:'Вес',                     unit:'кг',        icon:'⚖️', min:20,  max:300, normal:[0,999],    warn:[0,999],    danger:[0,999]},
  {id:'height',   name:'Рост',                    unit:'см',        icon:'📏', min:100, max:250, normal:[0,999],    warn:[0,999],    danger:[0,999]},
  {id:'sugar',    name:'Сахар крови',             unit:'ммоль/л',   icon:'🩸', min:2,   max:30,  normal:[3.9,5.5], warn:[3.3,6.9],  danger:[2.8,11]},
  {id:'oxygen',   name:'Сатурация (SpO2)',        unit:'%',         icon:'🫁', min:70,  max:100, normal:[95,100],  warn:[92,100],   danger:[88,100]},
  {id:'sleep',    name:'Сон за ночь',             unit:'часов',     icon:'😴', min:0,   max:16,  normal:[7,9],     warn:[6,10],     danger:[4,12]},
  {id:'steps',    name:'Шаги за день',            unit:'шагов',     icon:'🚶', min:0,   max:50000,normal:[8000,20000],warn:[4000,30000],danger:[0,50000]},
  {id:'water',    name:'Вода за день',            unit:'мл',        icon:'💧', min:0,   max:6000, normal:[1500,3000],warn:[1000,4000],danger:[0,6000]},
  {id:'hrv',      name:'HRV',                     unit:'мс',        icon:'📊', min:10,  max:200, normal:[50,120],  warn:[30,150],   danger:[10,200]},
  {id:'calories', name:'Калории',                 unit:'ккал',      icon:'🍎', min:500, max:5000,normal:[1500,2800],warn:[1200,3500],danger:[500,5000]}
];

/* ============ ГЛАВНАЯ ============ */
function renderMedical(){
  var app = document.getElementById('app');
  if(!app) return;
  var data = medLoad();

  var html = '<div class="page">';
  html += '<div class="title-xl">🏥 Медицина</div>';

  html += '<div class="card card-gradient">';
  html += '<div style="font-size:36px;text-align:center;margin-bottom:6px;">⚕️</div>';
  html += '<div style="text-align:center;font-size:16px;font-weight:800;margin-bottom:6px;">ИИ-Врач</div>';
  html += '<div style="text-align:center;opacity:.9;font-size:12px;">Слежу за твоим здоровьем 24/7</div>';
  html += '</div>';

  html += '<button class="btn btn-primary btn-block" onclick="openMedAddEntry()">➕ Добавить замер</button>';

  html += '<div class="card" style="margin-top:14px;"><h2>📊 Последние показатели</h2>';
  var hasAny = false;
  MED_METRICS.forEach(function(m){
    var last = medGetLast(data, m.id);
    if(last){
      hasAny = true;
      var status = medStatus(m, last.value);
      var color = status==='ok'?'var(--success)':status==='warn'?'var(--warning)':'var(--danger)';
      var emoji = status==='ok'?'✅':status==='warn'?'⚠️':'🚨';
      html += '<div class="list-row" onclick="openMedMetricDetail(\''+m.id+'\')">';
      html += '<div class="list-icon">'+m.icon+'</div>';
      html += '<div class="list-body"><div class="list-title">'+m.name+'</div>';
      html += '<div class="list-subtitle">'+last.value+' '+m.unit+' · '+last.date+'</div></div>';
      html += '<div style="font-size:18px;color:'+color+';">'+emoji+'</div>';
      html += '</div>';
    }
  });
  if(!hasAny){
    html += '<div class="empty"><div class="empty-icon">📋</div><div class="empty-title">Нет данных</div><div class="empty-text">Добавь первый замер</div></div>';
  }
  html += '</div>';

  if(hasAny){
    html += '<div class="card"><h2>🤖 Анализ ИИ-врача</h2>';
    var analysis = medAIAnalyze(data);
    analysis.forEach(function(item){
      var color = item.level==='good'?'var(--success)':item.level==='warn'?'var(--warning)':'var(--danger)';
      html += '<div style="background:var(--glass-2);border-left:3px solid '+color+';border-radius:10px;padding:10px 12px;margin-bottom:8px;">';
      html += '<div style="font-size:13px;font-weight:700;margin-bottom:4px;">'+item.title+'</div>';
      html += '<div class="footnote text-secondary" style="line-height:1.5;">'+item.text+'</div>';
      html += '</div>';
    });
    html += '</div>';
  }

  html += '<div class="card"><h2>📈 Все показатели</h2>';
  MED_METRICS.forEach(function(m){
    var count = data.entries.filter(function(e){return e.metricId===m.id}).length;
    html += '<div class="list-row" onclick="openMedMetricDetail(\''+m.id+'\')">';
    html += '<div class="list-icon">'+m.icon+'</div>';
    html += '<div class="list-body"><div class="list-title">'+m.name+'</div>';
    html += '<div class="list-subtitle">'+m.unit+' · '+count+' замеров</div></div>';
    html += '<div class="list-chevron">›</div></div>';
  });
  html += '</div>';

  html += '<div class="card"><h2>🗄 Данные</h2>';
  html += '<button class="btn btn-ghost btn-block" onclick="medExport()">📤 Экспорт JSON</button>';
  html += '<button class="btn btn-danger btn-block mt-2" onclick="medReset()">🗑 Сбросить всё</button>';
  html += '</div>';

  html += '<div class="card" style="background:rgba(255,107,107,.08);border-color:rgba(255,107,107,.3);">';
  html += '<div style="font-size:12px;color:var(--text-2);line-height:1.5;">⚠️ ИИ-врач не заменяет живого врача. При острых состояниях — <b>103 / 112</b>.</div>';
  html += '</div>';

  html += '</div>';
  app.innerHTML = html;
}

/* ============ HELPERS ============ */
function medGetLast(data, metricId){
  var list = data.entries.filter(function(e){return e.metricId===metricId});
  if(!list.length) return null;
  return list[list.length-1];
}

function medStatus(m, val){
  var v = parseFloat(val);
  if(!m.normal) return 'ok';
  if(m.id==='weight' || m.id==='height') return 'ok';
  var n = m.normal, w = m.warn, d = m.danger;
  if(v >= d[0] && v <= d[1]){
    if(v >= w[0] && v <= w[1]){
      if(v >= n[0] && v <= n[1]) return 'ok';
      return 'warn';
    }
    return 'danger';
  }
  return 'danger';
}

function medStatusLabel(s){
  if(s==='ok') return 'Норма';
  if(s==='warn') return 'Внимание';
  return 'Опасно';
}

/* ============ AI АНАЛИЗ ============ */
function medAIAnalyze(data){
  var results = [];
  var last = {};
  MED_METRICS.forEach(function(m){
    var l = medGetLast(data, m.id);
    if(l) last[m.id] = l;
  });

  if(last.bp_sys && last.bp_dia){
    var sys = parseFloat(last.bp_sys.value);
    var dia = parseFloat(last.bp_dia.value);
    if(sys >= 140 || dia >= 90){
      results.push({level:'danger', title:'🚨 Высокое давление', text:'Твоё давление '+sys+'/'+dia+'. Это выше нормы. Отдохни, не нервничай, измерь ещё раз через 15 минут. Если не падает — обратись к врачу.'});
    } else if(sys < 100 || dia < 60){
      results.push({level:'warn', title:'⚠️ Низкое давление', text:'Давление '+sys+'/'+dia+'. Пей больше воды, не вставай резко. Если кружится голова — приляг.'});
    } else {
      results.push({level:'good', title:'✅ Давление в норме', text:'Давление '+sys+'/'+dia+' — хорошо.'});
    }
  }

  if(last.pulse){
    var p = parseFloat(last.pulse.value);
    if(p > 100){
      results.push({level:'warn', title:'⚠️ Тахикардия', text:'Пульс '+p+' уд/мин. Возможно, ты нервничаешь или переутомился. Подыши 4-7-8, отдохни.'});
    } else if(p < 55){
      results.push({level:'warn', title:'⚠️ Брадикардия', text:'Пульс '+p+' уд/мин. Если ты не спортсмен — обрати внимание.'});
    } else {
      results.push({level:'good', title:'✅ Пульс в норме', text:'Пульс '+p+' уд/мин — отлично.'});
    }
  }

  if(last.temp){
    var t = parseFloat(last.temp.value);
    if(t >= 37.5){
      results.push({level:'danger', title:'🚨 Повышенная температура', text:'Температура '+t+'°C. Пей много воды, отдыхай. Если >38.5°C — жаропонижающее и к врачу.'});
    } else if(t < 36){
      results.push({level:'warn', title:'⚠️ Пониженная температура', text:'Температура '+t+'°C. Возможно, переохлаждение или упадок сил.'});
    }
  }

  if(last.sugar){
    var s = parseFloat(last.sugar.value);
    if(s > 7){
      results.push({level:'danger', title:'🚨 Высокий сахар', text:'Сахар '+s+' ммоль/л. Если натощак >7 — нужно к эндокринологу. Убери быстрые углеводы.'});
    } else if(s < 3.5){
      results.push({level:'danger', title:'🚨 Низкий сахар', text:'Сахар '+s+' ммоль/л — гипогликемия. Срочно съешь что-то сладкое.'});
    } else if(s >= 5.6){
      results.push({level:'warn', title:'⚠️ Сахар на верхней границе', text:'Сахар '+s+' ммоль/л. Следи за питанием, меньше сладкого.'});
    }
  }

  if(last.oxygen){
    var o = parseFloat(last.oxygen.value);
    if(o < 94){
      results.push({level:'danger', title:'🚨 Низкая сатурация', text:'SpO2 '+o+'%. Это опасно. Срочно к врачу.'});
    } else if(o < 96){
      results.push({level:'warn', title:'⚠️ Сатурация снижена', text:'SpO2 '+o+'%. Подыши свежим воздухом, проверь ещё раз.'});
    }
  }

  if(last.sleep){
    var sl = parseFloat(last.sleep.value);
    if(sl < 6){
      results.push({level:'warn', title:'😴 Мало сна', text:'Ты спал '+sl+' ч. Нужно 7-9. Ляг сегодня раньше, убери экран за 2 часа до сна.'});
    } else if(sl >= 7 && sl <= 9){
      results.push({level:'good', title:'✅ Сон в норме', text:'Сон '+sl+' ч — отлично.'});
    }
  }

  if(last.water){
    var w = parseFloat(last.water.value);
    if(w < 1500){
      results.push({level:'warn', title:'💧 Мало воды', text:'Ты выпил '+w+' мл. Нужно 1500-3000. Поставь бутылку на стол.'});
    }
  }

  if(last.steps){
    var st = parseFloat(last.steps.value);
    if(st < 4000){
      results.push({level:'warn', title:'🚶 Мало движения', text:'Ты прошёл '+st+' шагов. Цель — 8000+. Прогуляйся 20 минут.'});
    } else if(st >= 8000){
      results.push({level:'good', title:'✅ Хорошая активность', text:st+' шагов — молодец.'});
    }
  }

  if(!results.length){
    results.push({level:'good', title:'👋 Начни измерять', text:'Добавь первые замеры — и я дам персональные советы.'});
  }

  return results;
}

/* ============ ДОБАВИТЬ ЗАМЕР ============ */
function openMedAddEntry(){
  var html = '';
  html += '<div class="field"><label class="field-label">Дата</label>';
  html += '<input type="date" id="med-date" value="'+calTodayISO()+'"/></div>';

  html += '<div class="field"><label class="field-label">Что измерить</label>';
  html += '<select id="med-metric">';
  MED_METRICS.forEach(function(m){
    html += '<option value="'+m.id+'">'+m.icon+' '+m.name+' ('+m.unit+')</option>';
  });
  html += '</select></div>';

  html += '<div class="field"><label class="field-label">Значение</label>';
  html += '<input type="number" id="med-value" step="0.1" placeholder="Введи число"/></div>';

  html += '<button class="btn btn-primary btn-block mt-3" onclick="medSaveEntry()">💾 Сохранить</button>';

  openSheet('Новый замер', html);
}

function medSaveEntry(){
  var date = (document.getElementById('med-date')||{}).value || calTodayISO();
  var metricId = (document.getElementById('med-metric')||{}).value;
  var value = parseFloat((document.getElementById('med-value')||{}).value);

  if(isNaN(value)){ toast('Введи число','error'); return; }

  var data = medLoad();
  data.entries.push({
    id: medNextId(),
    metricId: metricId,
    value: value,
    date: date,
    timestamp: new Date().toISOString()
  });
  medSave(data);
  closeSheet();
  toast('✓ Сохранено','success');
  haptic('success');
  renderMedical();
}

/* ============ ДЕТАЛИ МЕТРИКИ ============ */
function openMedMetricDetail(metricId){
  var m = MED_METRICS.find(function(x){return x.id===metricId});
  if(!m) return;
  var data = medLoad();
  var list = data.entries.filter(function(e){return e.metricId===metricId}).slice().reverse();

  var html = '';
  html += '<div style="text-align:center;margin-bottom:16px;">';
  html += '<div style="font-size:48px;">'+m.icon+'</div>';
  html += '<div style="font-size:20px;font-weight:800;">'+m.name+'</div>';
  html += '<div class="footnote text-secondary">'+m.unit+' · Норма: '+m.normal[0]+'–'+m.normal[1]+'</div>';
  html += '</div>';

  html += '<button class="btn btn-primary btn-block" onclick="closeSheet();setTimeout(function(){medQuickAdd(\''+metricId+'\')},200)">➕ Добавить замер</button>';

  if(list.length){
    html += '<div class="card" style="margin-top:12px;"><h2>История ('+list.length+')</h2>';
    list.slice(0,50).forEach(function(e){
      var status = medStatus(m, e.value);
      var emoji = status==='ok'?'✅':status==='warn'?'⚠️':'🚨';
      html += '<div class="stat-row"><span class="stat-row-label">'+e.date+'</span>';
      html += '<span class="stat-row-value">'+e.value+' '+m.unit+' '+emoji+'</span></div>';
    });
    html += '</div>';
  } else {
    html += '<div class="empty"><div class="empty-icon">📋</div><div class="empty-title">Нет замеров</div></div>';
  }

  openSheet(m.name, html);
}

function medQuickAdd(metricId){
  var m = MED_METRICS.find(function(x){return x.id===metricId});
  if(!m) return;
  var html = '<div class="field"><label class="field-label">Значение ('+m.unit+')</label>';
  html += '<input type="number" id="med-q-value" step="0.1" autofocus/></div>';
  html += '<button class="btn btn-primary btn-block mt-3" onclick="medSaveQuick(\''+metricId+'\')">💾 Сохранить</button>';
  openSheet(m.name, html);
}

function medSaveQuick(metricId){
  var v = parseFloat((document.getElementById('med-q-value')||{}).value);
  if(isNaN(v)){ toast('Введи число','error'); return; }
  var data = medLoad();
  data.entries.push({
    id: medNextId(),
    metricId: metricId,
    value: v,
    date: calTodayISO(),
    timestamp: new Date().toISOString()
  });
  medSave(data);
  closeSheet();
  toast('✓ Сохранено','success');
  haptic('success');
  renderMedical();
}

/* ============ ЭКСПОРТ / СБРОС ============ */
function medExport(){
  var data = medLoad();
  var blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url; a.download = 'medical-'+calTodayISO()+'.json';
  a.click(); URL.revokeObjectURL(url);
  toast('Экспорт готов','success');
}

function medReset(){
  if(!confirm('Удалить все медицинские данные?')) return;
  medSave({metrics:[], entries:[]});
  toast('Сброшено','info');
  renderMedical();
}

/* ============ EXPORTS ============ */
window.renderMedical = renderMedical;
window.openMedAddEntry = openMedAddEntry;
window.medSaveEntry = medSaveEntry;
window.openMedMetricDetail = openMedMetricDetail;
window.medQuickAdd = medQuickAdd;
window.medSaveQuick = medSaveQuick;
window.medExport = medExport;
window.medReset = medReset;
window.MED_METRICS = MED_METRICS;

console.log('[MEDICAL] loaded: '+MED_METRICS.length+' metrics');