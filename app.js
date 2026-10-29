'use strict';
/* ============================================================
   LIFE OS — APP.js v50 — ЧАСТЬ 1/2
   Ядро: State, Навигация, Сохранение, Базовые функции
   ============================================================ */

var STORAGE_KEY = 'life_os_v50';
var CURRENT_VERSION = '50';

/* ============ TELEGRAM SDK ============ */
var tg = null;
try {
  tg = window.Telegram && window.Telegram.WebApp;
  if (tg) {
    tg.expand(); tg.ready();
    if (tg.setHeaderColor) tg.setHeaderColor('#000000');
  }
} catch(e) {}

/* ============ УТИЛИТЫ ============ */
function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,6); }
function today(){ return new Date().toISOString().slice(0,10); }
function nowISO(){ return new Date().toISOString(); }
function esc(s){ return String(s || '').replace(/[&<>"']/g, function(c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
function getNowHHMM(){ var d=new Date(); return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); }

function toast(msg, type) {
  var c = document.getElementById('toasts');
  if (!c) return;
  var el = document.createElement('div');
  el.className = 'toast ' + (type || '');
  el.style.cssText = 'background:var(--glass-2); padding:12px 20px; border-radius:20px; margin-bottom:8px; color:white; font-size:14px; animation:slideUp 0.3s;';
  el.textContent = msg;
  c.appendChild(el);
  setTimeout(function(){ el.remove(); }, 3000);
}

function haptic(type) {
  try { if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred(type || 'light'); } catch(e) {}
}

/* ============ STATE ============ */
function defaultState() {
  return {
    settings: { theme: 'dark', version: CURRENT_VERSION, effectsEnabled: true },
    profile: { name: '', emoji: '👤' },
    stats: { streak: 0, lastActiveDay: null },
    gamification: { xp: 0, level: 1, gold: 0 },
    
    /* Контент */
    tasks: [],
    habits: [],
    projects: [],
    spheres: { lastScores: {} },
    
    /* Новое (v50) */
    sleep: {
      entries: [],
      settings: { targetHours: 8 }
    },
    jarvis: {
      sessions: [],
      profile: { weaknesses: [], strengths: [] },
      settings: { personality: 'balanced' }
    },
    pet: {
      name: 'Барсик',
      xp: 0,
      level: 1,
      emoji: '🐣'
    },
    detox: {
      cooldownActive: false,
      sleepModeActive: false
    }
  };
}

var state;
try {
  var saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    state = JSON.parse(saved);
    // Миграция (если старые данные, добавляем новые блоки)
    if (!state.sleep) state.sleep = defaultState().sleep;
    if (!state.jarvis) state.jarvis = defaultState().jarvis;
    if (!state.pet) state.pet = defaultState().pet;
    if (!state.detox) state.detox = defaultState().detox;
  } else {
    // Пробуем взять из старой версии
    var old = localStorage.getItem('life_os_v49') || localStorage.getItem('life_os_v48');
    if (old) {
      state = JSON.parse(old);
      if (!state.sleep) state.sleep = defaultState().sleep;
      if (!state.jarvis) state.jarvis = defaultState().jarvis;
      if (!state.pet) state.pet = defaultState().pet;
      if (!state.detox) state.detox = defaultState().detox;
    } else {
      state = defaultState();
    }
  }
} catch (e) {
  console.error('Ошибка загрузки state:', e);
  state = defaultState();
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e) {}
}

/* ============ НАВИГАЦИЯ (ЗАЩИТА ОТ БЕЛОГО ЭКРАНА) ============ */
var currentPage = 'dashboard';
var MAIN_PAGES = ['dashboard', 'tasks', 'habits', 'sleep', 'more'];

function navigate(page, silent) {
  if (!page) page = 'dashboard';
  currentPage = page;
  
  try { renderTabBar(); } catch(e) { console.error('TabBar:', e); }

  var main = document.getElementById('app');
  if (!main) return;
  main.innerHTML = '';

  // Список экранов (сюда добавляются новые из app-render и app-jarvis)
  var renderers = window.RENDERERS || {
    dashboard: renderDashboard,
    tasks: renderTasks,
    habits: renderHabits,
    sleep: renderSleep,
    more: renderMore
  };

  var fn = renderers[page];
  if (typeof fn !== 'function') {
    main.innerHTML = '<div class="title-xl">🚧 ' + page + '</div><div class="card">В разработке</div>';
    return;
  }

  try {
    fn();
  } catch (e) {
    console.error('Render [' + page + ']:', e);
    main.innerHTML = '<div class="card" style="border-left:4px solid red;"><h2 style="color:red;">⚠️ Ошибка</h2><p>' + e.message + '</p><button class="btn btn-primary mt-3" onclick="navigate(\'dashboard\')">На главную</button></div>';
  }
}

/* ============ ВЕРХНЯЯ ПАНЕЛЬ И ТАБ-БАР ============ */
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
  bar.innerHTML = tabs.map(function(t) {
    return '<button class="tab-item ' + (currentPage === t.id ? 'active' : '') + '" onclick="navigate(\'' + t.id + '\')">' +
           '<span class="tab-icon">' + t.icon + '</span><span class="tab-label">' + t.label + '</span></button>';
  }).join('');
}

function updateHeader() {
  var avatar = document.getElementById('headerAvatar');
  if (avatar && state.profile) avatar.textContent = state.profile.emoji || '👤';
}

/* ============ БАЗОВЫЕ ЭКРАНЫ (Заглушки для старых функций) ============ */
function renderDashboard() {
  var plan = [];
  if (typeof generateDailyPlan === 'function') plan = generateDailyPlan();
  
  var html = '<div class="title-xl">Главная</div>';
  
  // XP
  html += '<div class="card" style="background:linear-gradient(135deg, var(--brand), var(--brand-2)); color:white;">';
  html += '<h2>Уровень ' + state.gamification.level + '</h2>';
  html += '<p class="text-secondary" style="color:rgba(255,255,255,0.8)">XP: ' + state.gamification.xp + ' | Золото: ' + state.gamification.gold + ' 🪙</p>';
  html += '</div>';

  // Джарвис
  html += '<div class="card">';
  html += '<h2>🤖 Джарвис на связи</h2>';
  html += '<button class="btn btn-primary" onclick="navigate(\'coachChatList\')">Открыть чаты</button>';
  html += '</div>';

  // План дня
  if (plan.length > 0) {
    html += '<div class="card"><h2>📅 Умный план</h2>';
    plan.forEach(function(p) { html += '<div class="list-row">' + p.icon + ' ' + p.title + '</div>'; });
    html += '</div>';
  }

  // Кнопки перехода
  html += '<div class="card"><h2>Разделы</h2>';
  html += '<div style="display:flex; flex-wrap:wrap; gap:10px;">';
  html += '<button class="btn btn-ghost" onclick="navigate(\'trainingHub\')">💪 Тренировки</button>';
  html += '<button class="btn btn-ghost" onclick="navigate(\'stats\')">📊 Статистика</button>';
  html += '<button class="btn btn-ghost" onclick="navigate(\'settings\')">⚙️ Настройки</button>';
  html += '</div></div>';

  document.getElementById('app').innerHTML = html;
}

function renderTasks() {
  document.getElementById('app').innerHTML = '<div class="title-xl">✅ Задачи</div><div class="card">Логика задач в разработке (перенос из v49)</div>';
}

function renderHabits() {
  document.getElementById('app').innerHTML = '<div class="title-xl">🔄 Привычки</div><div class="card">Логика привычек в разработке (перенос из v49)</div>';
}

function renderSleep() {
  var html = '<div class="title-xl">😴 Сон</div>';
  html += '<div class="card"><h2>Последняя ночь</h2>';
  if (state.sleep.entries.length > 0) {
    var last = state.sleep.entries[state.sleep.entries.length - 1];
    html += '<p>Часов: <b>' + last.hours + '</b></p>';
    html += '<p>Качество: ' + last.quality + '/10</p>';
  } else {
    html += '<p>Нет данных.</p>';
  }
  html += '</div>';
  
  html += '<div class="card"><h2>Добавить</h2>';
  html += '<input type="number" id="sleep-hours" placeholder="Часы (например, 8)" style="margin-bottom:10px;" />';
  html += '<input type="number" id="sleep-quality" placeholder="Качество (1-10)" style="margin-bottom:10px;" />';
  html += '<button class="btn btn-primary" onclick="saveSleep()">💾 Сохранить</button>';
  html += '</div>';
  document.getElementById('app').innerHTML = html;
}

function saveSleep() {
  var h = parseFloat(document.getElementById('sleep-hours').value);
  var q = parseInt(document.getElementById('sleep-quality').value) || 5;
  if (!h) return toast('Введите часы', 'error');
  state.sleep.entries.push({ date: today(), hours: h, quality: q });
  save(); toast('Сон записан!', 'success'); renderSleep();
}

function renderMore() {
  var html = '<div class="title-xl">Ещё</div>';
  html += '<div class="card"><button class="btn btn-primary" onclick="navigate(\'settings\')">⚙️ Настройки</button></div>';
  document.getElementById('app').innerHTML = html;
}

/* ============ ЭКСПОРТ ДЛЯ ГЛОБАЛЬНОГО ДОСТУПА ============ */
window.state = state;
window.save = save;
window.navigate = navigate;
window.toast = toast;
window.esc = esc;
window.today = today;
window.renderTabBar = renderTabBar;
window.updateHeader = updateHeader;
window.renderDashboard = renderDashboard;
window.renderTasks = renderTasks;
window.renderHabits = renderHabits;
window.renderSleep = renderSleep;
window.renderMore = renderMore;

/* ============ ИНИЦИАЛИЗАЦИЯ ============ */
function init() {
  renderTabBar();
  navigate('dashboard');
  console.log('[APP v50] Ядро загружено. Ожидание модулей...');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/* ============================================================
   LIFE OS — APP.js v50 — ЧАСТЬ 2/2
   Логика сфер, задач, привычек, коуча, XP, графиков и PWA
   ============================================================ */

/* ============ 1. PWA И УСТАНОВКА ============ */
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

/* ============ 2. СФЕРЫ ЖИЗНИ ============ */
function renderSpheres() {
  // Если данных о сферах нет, берем из content3.js
  var spheres = window.LIFE_SPHERES || [];
  var scores = state.spheres.lastScores || {};
  var balance = window.getSpheresBalance ? window.getSpheresBalance(scores) : {avg: 0, balance: 0};

  var html = '<div class="title-xl">🎯 Сферы жизни</div>';
  
  html += '<div class="card card-gradient" style="text-align:center;">';
  html += '<h2>Общий баланс: ' + balance.avg + '/10</h2>';
  html += '<p>Гармония: ' + balance.balance + '%</p>';
  html += '</div>';

  html += '<div class="card"><h2>Оценить сферы</h2>';
  spheres.forEach(function(s) {
    var currentScore = scores[s.id] || 0;
    html += '<div style="margin-bottom:15px;">';
    html += '<label class="field-label">' + s.emoji + ' ' + s.name + '</label>';
    html += '<input type="range" min="0" max="10" value="' + currentScore + '" onchange="saveSphereScore(\'' + s.id + '\', this.value)" style="width:100%;" />';
    html += '</div>';
  });
  html += '</div>';

  document.getElementById('app').innerHTML = html;
}

function saveSphereScore(id, val) {
  if (!state.spheres) state.spheres = { lastScores: {} };
  if (!state.spheres.lastScores) state.spheres.lastScores = {};
  state.spheres.lastScores[id] = parseInt(val);
  addXP(5, 'sphere'); // Даем XP за оценку
  save();
  // Перерисовываем экран сфер, чтобы обновить баланс
  renderSpheres();
}

/* ============ 3. ЗАДАЧИ ============ */
function renderTasks() {
  var html = '<div class="title-xl">✅ Задачи</div>';
  html += '<button class="btn btn-primary mb-3" onclick="openTaskEditor()">+ Новая задача</button>';

  var pending = state.tasks.filter(function(t) { return t.status === 'pending'; });
  var done = state.tasks.filter(function(t) { return t.status === 'completed'; });

  html += '<div class="card"><h2>В процессе (' + pending.length + ')</h2>';
  if (pending.length === 0) html += '<p class="text-secondary">Нет активных задач</p>';
  pending.forEach(function(t) {
    html += '<div class="list-row" onclick="toggleTask(\'' + t.id + '\')">';
    html += '<div class="task-checkbox"></div>';
    html += '<div class="list-body"><div class="list-title">' + esc(t.title) + '</div></div>';
    html += '</div>';
  });
  html += '</div>';

  if (done.length > 0) {
    html += '<div class="card"><h2>Выполнено (' + done.length + ')</h2>';
    done.forEach(function(t) {
      html += '<div class="list-row" style="opacity:0.5;" onclick="toggleTask(\'' + t.id + '\')">';
      html += '<div class="task-checkbox checked">✓</div>';
      html += '<div class="list-body"><div class="list-title" style="text-decoration:line-through;">' + esc(t.title) + '</div></div>';
      html += '</div>';
    });
    html += '</div>';
  }

  document.getElementById('app').innerHTML = html;
}

function openTaskEditor() {
  var title = prompt('Название задачи:');
  if (!title) return;
  state.tasks.push({ id: uid(), title: title, status: 'pending', created_at: nowISO() });
  save(); renderTasks();
}

function toggleTask(id) {
  var t = state.tasks.find(function(x) { return x.id === id; });
  if (!t) return;
  if (t.status === 'pending') {
    t.status = 'completed';
    t.completedAt = nowISO();
    addXP(10, 'task');
    if (window.addPetXP) window.addPetXP(5);
    toast('✓ Выполнено', 'success');
  } else {
    t.status = 'pending';
  }
  save(); renderTasks();
}

/* ============ 4. ПРИВЫЧКИ ============ */
function renderHabits() {
  var html = '<div class="title-xl">🔄 Привычки</div>';
  
  // Берем привычки из state или показываем заглушку
  var myHabits = state.habits || [];
  
  if (myHabits.length === 0) {
    html += '<div class="card"><div class="empty"><div class="empty-icon">🔄</div><div class="empty-title">Нет привычек</div></div>';
    html += '<button class="btn btn-primary mt-3" onclick="navigate(\'habitCatalog\')">Добавить из каталога</button></div>';
  } else {
    html += '<div class="card">';
    myHabits.forEach(function(h) {
      var done = h.lastCompletedDate === today();
      html += '<div class="list-row" onclick="toggleHabit(\'' + h.id + '\')" style="' + (done ? 'opacity:0.5;' : '') + '">';
      html += '<div class="list-icon">' + (h.emoji || '✅') + '</div>';
      html += '<div class="list-body"><div class="list-title">' + esc(h.title) + '</div>';
      html += '<div class="list-subtitle">🔥 ' + (h.streak || 0) + ' дней</div></div>';
      html += '<div class="task-checkbox ' + (done ? 'checked' : '') + '">' + (done ? '✓' : '') + '</div>';
      html += '</div>';
    });
    html += '</div>';
  }
  
  html += '<button class="btn btn-primary btn-block mt-3" onclick="navigate(\'habitCatalog\')">📚 Каталог привычек</button>';
  document.getElementById('app').innerHTML = html;
}

function toggleHabit(id) {
  var h = state.habits.find(function(x) { return x.id === id; });
  if (!h) return;
  var t = today();
  if (h.lastCompletedDate === t) {
    h.lastCompletedDate = null;
    h.streak = Math.max(0, (h.streak || 1) - 1);
  } else {
    h.lastCompletedDate = t;
    h.streak = (h.streak || 0) + 1;
    addXP(5, 'habit');
    if (window.addPetXP) window.addPetXP(3);
    toast('✓ +5 XP', 'success');
  }
  save(); renderHabits();
}

function renderHabitCatalog() {
  var templates = window.HABIT_TEMPLATES || window.HABITS_WITH_WHY || [];
  var html = '<div class="title-xl">📚 Каталог привычек</div>';
  html += '<div class="card">';
  
  templates.slice(0, 50).forEach(function(t) {
    html += '<div class="list-row" onclick="addHabitFromTemplate(\'' + t.id + '\')">';
    html += '<div class="list-icon">' + (t.emoji || '✅') + '</div>';
    html += '<div class="list-body"><div class="list-title">' + esc(t.title) + '</div></div>';
    html += '<div class="list-chevron">+</div>';
    html += '</div>';
  });
  
  html += '</div>';
  document.getElementById('app').innerHTML = html;
}

function addHabitFromTemplate(id) {
  var templates = window.HABIT_TEMPLATES || window.HABITS_WITH_WHY || [];
  var tpl = templates.find(function(t) { return t.id === id; });
  if (!tpl) return;

  state.habits.push({
    id: uid(),
    templateId: id,
    title: tpl.title,
    emoji: tpl.emoji || '✅',
    category: tpl.cat || tpl.sphereId || 'health',
    streak: 0,
    lastCompletedDate: null,
    createdAt: nowISO()
  });
  save();
  toast('Привычка добавлена!', 'success');
  navigate('habits');
}

/* ============ 5. КОУЧ И СЕССИИ ============ */
function renderCoachChatList() {
  var sessions = (state.jarvis && state.jarvis.sessions) || [];
  var html = '<div class="title-xl">💬 Джарвис</div>';
  html += '<button class="btn btn-primary mb-3" onclick="startNewChatSession()">+ Новый чат</button>';

  if (sessions.length === 0) {
    html += '<div class="card"><p class="text-secondary">Нет чатов.</p></div>';
  } else {
    html += '<div class="card">';
    sessions.slice().reverse().forEach(function(s) {
      html += '<div class="list-row" onclick="openChatSession(\'' + s.id + '\')">';
      html += '<div class="list-icon">💬</div>';
      html += '<div class="list-body"><div class="list-title">' + esc(s.title) + '</div>';
      html += '<div class="list-subtitle">' + (s.messages ? s.messages.length : 0) + ' сообщений</div></div>';
      html += '</div>';
    });
    html += '</div>';
  }
  document.getElementById('app').innerHTML = html;
}

function startNewChatSession() {
  var title = prompt('Название чата (например, "План на день"):');
  if (!title) return;
  if (!state.jarvis) state.jarvis = { sessions: [] };
  if (!state.jarvis.sessions) state.jarvis.sessions = [];

  var sess = { id: uid(), title: title, date: today(), messages: [] };
  state.jarvis.sessions.push(sess);
  save();
  openChatSession(sess.id);
}

function openChatSession(id) {
  // Заглушка для экрана чата
  var sess = state.jarvis.sessions.find(function(s) { return s.id === id; });
  if (!sess) return;
  var html = '<div class="title-xl">💬 ' + esc(sess.title) + '</div>';
  html += '<button class="btn btn-ghost mb-3" onclick="navigate(\'coachChatList\')">← Назад</button>';
  html += '<div class="card" style="min-height:200px;"><p class="text-secondary">Чат с Джарвисом (интерфейс ввода в app-jarvis.js)</p></div>';
  document.getElementById('app').innerHTML = html;
}

/* ============ 6. XP И УРОВНИ ============ */
function addXP(amount, source) {
  if (!state.gamification) state.gamification = { xp: 0, level: 1, gold: 0 };
  state.gamification.xp += amount;
  state.gamification.gold += Math.floor(amount / 2);
  
  // Проверка уровня
  var newLevel = Math.floor(state.gamification.xp / 100) + 1;
  if (newLevel > state.gamification.level) {
    state.gamification.level = newLevel;
    toast('🎉 Новый уровень: ' + newLevel + '!', 'success');
  }
  save();
}

/* ============ 7. НАСТРОЙКИ ============ */
function renderSettings() {
  var html = '<div class="title-xl">⚙️ Настройки</div>';
  
  // PWA Установка
  html += '<div class="card" style="border:2px solid var(--brand);">';
  html += '<h2>📲 Установить на телефон</h2>';
  html += '<button class="btn btn-primary" onclick="installPWA()">Установить</button>';
  html += '</div>';

  // Смена имени
  html += '<div class="card"><h2>Профиль</h2>';
  html += '<div class="field"><label class="field-label">Имя</label><input type="text" value="' + esc(state.profile.name) + '" onchange="state.profile.name=this.value;save();" /></div>';
  html += '</div>';

  // Сброс
  html += '<div class="card"><h2>Данные</h2>';
  html += '<button class="btn btn-danger" onclick="if(confirm(\'Удалить всё?\')){localStorage.clear();location.reload();}">Сброс</button>';
  html += '</div>';

  document.getElementById('app').innerHTML = html;
}

/* ============ 8. РЕГИСТРАЦИЯ ЭКРАНОВ ============ */
// Глобальный объект для renderers (используется в navigate)
if (!window.RENDERERS) window.RENDERERS = {};

// Добавляем экраны из этой части
window.RENDERERS.dashboard = renderDashboard;
window.RENDERERS.tasks = renderTasks;
window.RENDERERS.habits = renderHabits;
window.RENDERERS.habitCatalog = renderHabitCatalog;
window.RENDERERS.sleep = renderSleep;
window.RENDERERS.spheres = renderSpheres;
window.RENDERERS.coachChatList = renderCoachChatList;
window.RENDERERS.settings = renderSettings;
window.RENDERERS.more = renderMore;

// Экспорт функций
window.installPWA = installPWA;
window.renderSpheres = renderSpheres;
window.saveSphereScore = saveSphereScore;
window.renderTasks = renderTasks;
window.openTaskEditor = openTaskEditor;
window.toggleTask = toggleTask;
window.renderHabits = renderHabits;
window.toggleHabit = toggleHabit;
window.renderHabitCatalog = renderHabitCatalog;
window.addHabitFromTemplate = addHabitFromTemplate;
window.renderCoachChatList = renderCoachChatList;
window.startNewChatSession = startNewChatSession;
window.openChatSession = openChatSession;
window.addXP = addXP;
window.renderSettings = renderSettings;
