'use strict';
/* ============================================================
   LIFE OS — APP.js v49
   Ядро: State, Навигация (без багов), PWA, Сон, Настройки Джарвиса
   ============================================================ */

var STORAGE_KEY = 'life_os_v49';
var CURRENT_VERSION = '49';

/* ============ DEFAULT STATE ============ */
function defaultState() {
  return {
    settings: { theme: 'dark', version: CURRENT_VERSION, effectsEnabled: true },
    profile: { name: '', emoji: '😊' },
    tasks: [],
    spheres: {},
    habits: [],
    gamification: { xp: 0, level: 1, gold: 0 },
    
    // Новые блоки из плана
    sleep: {
      entries: [], // { date, hours, quality, stages }
      settings: { targetHours: 8, bedtime: '23:00', wakeup: '07:00' }
    },
    jarvis: {
      sessions: [],
      profile: { strengths: [], weaknesses: [] },
      settings: JSON.parse(JSON.stringify(window.JARVIS_SETTINGS_DEFAULT || {}))
    }
  };
}

/* ============ STATE & SAVE ============ */
var state;
try {
  var saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    state = JSON.parse(saved);
    // Простая миграция: если новых полей нет, добавляем
    if (!state.sleep) state.sleep = defaultState().sleep;
    if (!state.jarvis) state.jarvis = defaultState().jarvis;
  } else {
    state = defaultState();
  }
} catch (e) {
  console.error('Ошибка загрузки state:', e);
  state = defaultState();
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) { console.error('Save error', e); }
}

/* ============ PWA INSTALL ============ */
var deferredPrompt = null;
window.addEventListener('beforeinstallprompt', function(e) {
  e.preventDefault();
  deferredPrompt = e;
});

function installPWA() {
  if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.addToHomeScreen) {
    window.Telegram.WebApp.addToHomeScreen();
    return;
  }
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function(r) {
      if (r.outcome === 'accepted') toast('✓ Установлено', 'success');
      deferredPrompt = null;
    });
  } else {
    toast('Откройте в Chrome для установки', 'info');
  }
}

/* ============ NAVIGATION (ЖЕЛЕЗОБЕТОННАЯ) ============ */
var currentPage = 'dashboard';
var MAIN_PAGES = ['dashboard', 'tasks', 'habits', 'sleep', 'more'];

function navigate(page, silent) {
  if (!page) page = 'dashboard';
  currentPage = page;
  
  try { renderTabBar(); } catch(e) { console.error(e); }

  var main = document.getElementById('app');
  if (!main) return;
  main.innerHTML = '';

  // Список доступных экранов
  var renderers = {
    dashboard: renderDashboard,
    tasks: renderTasks,
    habits: renderHabits,
    sleep: renderSleep,         // НОВЫЙ ЭКРАН
    jarvisSettings: renderJarvisSettings, // НОВЫЙ ЭКРАН
    stats: renderStats,
    profile: renderProfile,
    settings: renderSettings,
    more: renderMore
  };

  var fn = renderers[page];
  
  if (typeof fn !== 'function') {
    main.innerHTML = '<div class="title-xl">🚧 ' + page + '</div><div class="card">Раздел в разработке</div>';
    return;
  }

  // ГЛАВНАЯ ЗАЩИТА ОТ БЕЛОГО ЭКРАНА
  try {
    fn();
  } catch (e) {
    console.error('Render error [' + page + ']:', e);
    main.innerHTML = '<div class="card" style="border-left:4px solid red;">' +
      '<h2 style="color:red;">⚠️ Ошибка</h2>' +
      '<p>Раздел "' + page + '" упал:</p>' +
      '<pre style="background:rgba(0,0,0,0.3); padding:10px; border-radius:8px; font-size:12px; overflow-x:auto;">' + e.message + '</pre>' +
      '<button class="btn btn-primary mt-3" onclick="navigate(\'dashboard\')">На главную</button>' +
      '</div>';
  }
}

/* ============ TAB BAR ============ */
function renderTabBar() {
  var bar = document.getElementById('tabBar');
  if (!bar) return;
  var tabs = [
    { id: 'dashboard', icon: '🏠', label: 'Главная' },
    { id: 'tasks', icon: '✅', label: 'Задачи' },
    { id: 'habits', icon: '🔄', label: 'Привычки' },
    { id: 'sleep', icon: '😴', label: 'Сон' },
    { id: 'more', icon: '⋯', label: 'Ещё' }
  ];
  
  var html = '';
  tabs.forEach(function(t) {
    var active = currentPage === t.id ? 'active' : '';
    html += '<button class="tab-item ' + active + '" onclick="navigate(\'' + t.id + '\')">';
    html += '<span class="tab-icon">' + t.icon + '</span>';
    html += '<span class="tab-label">' + t.label + '</span>';
    html += '</button>';
  });
  bar.innerHTML = html;
}

/* ============ ЭКРАНЫ ============ */
function renderDashboard() {
  var html = '<div class="title-xl">Главная</div>';
  
  // Умный план (Заглушка для будущего Джарвиса)
  html += '<div class="card" style="background:linear-gradient(135deg, var(--brand), var(--brand-2)); color:white;">';
  html += '<h2>☀️ Доброе утро!</h2>';
  html += '<p>Твой умный план на сегодня формируется...</p>';
  html += '</div>';

  // XP
  html += '<div class="card">';
  html += '<h2>Уровень ' + state.gamification.level + '</h2>';
  html += '<div class="progress"><div class="progress-fill" style="width:' + (state.gamification.xp % 100) + '%"></div></div>';
  html += '<p class="text-secondary" style="margin-top:8px;">XP: ' + state.gamification.xp + ' | Золото: ' + state.gamification.gold + ' 🪙</p>';
  html += '</div>';

  // Быстрые действия
  html += '<div class="card"><h2>⚡ Быстро</h2>';
  html += '<button class="btn btn-primary" style="margin-bottom:10px;" onclick="navigate(\'jarvisSettings\')">⚙️ Настройки Джарвиса</button>';
  html += '<button class="btn btn-primary" onclick="navigate(\'sleep\')">😴 Записать сон</button>';
  html += '</div>';

  document.getElementById('app').innerHTML = html;
}

function renderSleep() {
  var html = '<div class="title-xl">😴 Сон и Восстановление</div>';
  
  html += '<div class="card">';
  html += '<h2>Последняя ночь</h2>';
  if (state.sleep.entries.length > 0) {
    var last = state.sleep.entries[state.sleep.entries.length - 1];
    html += '<p>Вы спали: <b>' + last.hours + ' часов</b></p>';
    html += '<p>Качество: ' + last.quality + '/10</p>';
  } else {
    html += '<p class="text-secondary">Нет данных. Добавьте первую запись.</p>';
  }
  html += '</div>';

  html += '<div class="card"><h2>Добавить запись</h2>';
  html += '<div class="field"><label class="field-label">Часы сна</label><input type="number" id="sleep-hours" placeholder="8" /></div>';
  html += '<div class="field"><label class="field-label">Качество (1-10)</label><input type="number" id="sleep-quality" placeholder="8" /></div>';
  html += '<button class="btn btn-primary" onclick="saveSleepEntry()">💾 Сохранить</button>';
  html += '</div>';
  
  // Советы по сну
  html += '<div class="card"><h2>💡 Советы</h2>';
  if (window.SLEEP_TIPS) {
    window.SLEEP_TIPS.forEach(function(tip) {
      html += '<div class="list-row"><div>' + tip + '</div></div>';
    });
  }
  html += '</div>';

  document.getElementById('app').innerHTML = html;
}

function saveSleepEntry() {
  var h = parseFloat(document.getElementById('sleep-hours').value);
  var q = parseInt(document.getElementById('sleep-quality').value);
  if (!h) return toast('Введите часы', 'error');
  
  state.sleep.entries.push({ date: new Date().toISOString().slice(0,10), hours: h, quality: q || 5 });
  save();
  toast('Сон записан!', 'success');
  navigate('sleep');
}

function renderJarvisSettings() {
  var html = '<div class="title-xl">⚙️ Настройки Джарвиса</div>';
  
  html += '<div class="card">';
  html += '<h2>Характер</h2>';
  var personalities = window.JARVIS_PERSONALITIES || [];
  personalities.forEach(function(p) {
    var active = state.jarvis.settings.personality === p.id;
    html += '<div class="list-row" style="border:1px solid ' + (active ? 'var(--brand)' : 'transparent') + ';" onclick="setJarvisPersonality(\'' + p.id + '\')">';
    html += '<div><b>' + p.name + '</b><br><span class="text-secondary">' + p.desc + '</span></div>';
    html += '</div>';
  });
  html += '</div>';

  html += '<div class="card">';
  html += '<h2>Интеграции</h2>';
  html += '<p class="text-secondary" style="margin-bottom:10px;">Подключение внешних сервисов для анализа.</p>';
  html += '<div class="list-row"><div>Google Calendar</div><div>' + (state.jarvis.settings.integrations.gcal ? '✅' : '❌') + '</div></div>';
  html += '<div class="list-row"><div>Perplexity API</div><div>' + (state.jarvis.settings.integrations.perplexity ? '✅' : '❌') + '</div></div>';
  html += '<div class="list-row"><div>DeepSeek API</div><div>' + (state.jarvis.settings.integrations.deepseek ? '✅' : '❌') + '</div></div>';
  html += '</div>';

  html += '<button class="btn btn-primary" onclick="navigate(\'dashboard\')">Назад</button>';
  document.getElementById('app').innerHTML = html;
}

function setJarvisPersonality(id) {
  state.jarvis.settings.personality = id;
  save();
  renderJarvisSettings();
}

/* ============ ЗАГЛУШКИ ============ */
function renderTasks() { document.getElementById('app').innerHTML = '<div class="title-xl">✅ Задачи</div><div class="card">В разработке</div>'; }
function renderHabits() { document.getElementById('app').innerHTML = '<div class="title-xl">🔄 Привычки</div><div class="card">В разработке</div>'; }
function renderStats() { document.getElementById('app').innerHTML = '<div class="title-xl">📊 Статистика</div><div class="card">В разработке</div>'; }
function renderProfile() { document.getElementById('app').innerHTML = '<div class="title-xl">👤 Профиль</div><div class="card">В разработке</div>'; }
function renderSettings() { document.getElementById('app').innerHTML = '<div class="title-xl">⚙️ Настройки</div><div class="card">В разработке</div>'; }
function renderMore() { 
  var html = '<div class="title-xl">Ещё</div>';
  html += '<div class="card"><button class="btn btn-primary" onclick="installPWA()">📲 Установить приложение</button></div>';
  document.getElementById('app').innerHTML = html; 
}

/* ============ TOAST ============ */
function toast(msg, type) {
  var c = document.getElementById('toasts');
  if (!c) return;
  var el = document.createElement('div');
  el.className = 'toast ' + (type || '');
  el.style = 'background:var(--glass-2); padding:12px 20px; border-radius:20px; margin-bottom:8px; color:white; font-size:14px;';
  el.textContent = msg;
  c.appendChild(el);
  setTimeout(function() { el.remove(); }, 3000);
}

/* ============ INIT ============ */
function init() {
  renderTabBar();
  navigate('dashboard');
  console.log('[INIT ✅] Приложение запущено без ошибок');
}

window.navigate = navigate;
window.installPWA = installPWA;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
