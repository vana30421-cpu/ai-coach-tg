'use strict';
/* ============================================================
   LIFE OS — APP-RENDER.js v49
   Экраны: Главная, Тренировки, Графики Beam, Дневник
   ============================================================ */

/* ============ 1. ОТРИСОВКА ГЛАВНОЙ (ПЕРЕХВАТ) ============ */
// Переопределяем главную, чтобы добавить красивые блоки
var originalRenderDashboard = window.renderDashboard;
window.renderDashboard = function() {
  if (!originalRenderDashboard) return;
  originalRenderDashboard(); // Рисуем базу

  var app = document.getElementById('app');
  if (!app) return;

  var extraHtml = '';

  // Блок Джарвиса
  extraHtml += '<div class="card" style="background:linear-gradient(135deg, #a78bfa, #5b9eff); color:white; margin-top:15px;">';
  extraHtml += '<h2>🤖 Джарвис на связи</h2>';
  extraHtml += '<p style="margin-bottom:10px; opacity:0.9;">Умный анализ ваших данных</p>';
  extraHtml += '<button class="btn" style="background:white; color:#5b9eff;" onclick="navigate(\'coachChatList\')">Открыть чаты</button>';
  extraHtml += '</div>';

  // Блок Тренировок
  extraHtml += '<div class="card">';
  extraHtml += '<h2>💪 Тренировки</h2>';
  extraHtml += '<p class="text-secondary" style="margin-bottom:10px;">Профессиональные программы по БИ и фитнесу.</p>';
  extraHtml += '<button class="btn btn-primary" onclick="navigate(\'trainingTest\')">Пройти тест (30 вопросов)</button>';
  extraHtml += '</div>';

  // Блок Графиков
  extraHtml += '<div class="card">';
  extraHtml += '<h2>📊 Активность</h2>';
  extraHtml += '<p class="text-secondary">Ваш прогресс за последние дни</p>';
  extraHtml += '<div style="margin-top:10px;">';
  extraHtml += renderHeatmap(); // Рисуем сетку активности
  extraHtml += '</div>';
  extraHtml += '</div>';

  app.innerHTML += extraHtml;
};

/* ============ 2. ЭКРАН ТРЕНИРОВОК (ОПРОС) ============ */
var currentTestAnswers = {};

function renderTrainingTest() {
  var questions = window.FITNESS_DIAGNOSTIC || [];
  var html = '<div class="title-xl">💪 Тест на уровень</div>';
  html += '<p class="text-secondary" style="margin-bottom:15px;">Ответьте на вопросы, чтобы мы подобрали программу.</p>';

  html += '<div class="card">';
  questions.forEach(function(q, index) {
    html += '<div class="field">';
    html += '<label class="field-label">' + (index + 1) + '. ' + q.text + '</label>';
    html += '<select id="test-' + q.id + '">';
    html += '<option value="">-- Выберите --</option>';
    q.options.forEach(function(opt) {
      html += '<option value="' + opt + '">' + opt + '</option>';
    });
    html += '</select>';
    html += '</div>';
  });
  html += '<button class="btn btn-primary" onclick="finishTrainingTest()">Показать программы</button>';
  html += '</div>';

  document.getElementById('app').innerHTML = html;
}

function finishTrainingTest() {
  var questions = window.FITNESS_DIAGNOSTIC || [];
  var answers = {};
  questions.forEach(function(q) {
    var val = document.getElementById('test-' + q.id).value;
    if (val) answers[q.id] = val;
  });

  if (Object.keys(answers).length < 5) {
    alert('Ответьте хотя бы на 5 вопросов.');
    return;
  }

  // Сохраняем ответы и переходим к списку
  if (!state.fitness) state.fitness = {};
  state.fitness.answers = answers;
  save();

  navigate('trainingHub');
}

/* ============ 3. ЭКРАН ПРОГРАММ ТРЕНИРОВОК ============ */
function renderTrainingHub() {
  var programs = window.WORKOUT_PROGRAMS || [];
  var html = '<div class="title-xl">💪 Ваши тренировки</div>';
  html += '<button class="btn" style="margin-bottom:15px; background:var(--glass-1); color:var(--text);" onclick="navigate(\'trainingTest\')">← Пройти тест заново</button>';

  if (programs.length === 0) {
    html += '<div class="card">Нет программ</div>';
  } else {
    programs.forEach(function(p) {
      html += '<div class="card">';
      html += '<h2>' + p.title + '</h2>';
      html += '<p class="text-secondary" style="margin-bottom:10px;">' + p.desc + '</p>';
      html += '<div style="display:flex; gap:10px; font-size:12px; margin-bottom:10px; color:var(--text-2);">';
      html += '<span>⏱ ' + p.duration + ' мин</span>';
      html += '<span>📅 ' + p.days + ' дн/нед</span>';
      html += '</div>';
      html += '<div style="background:var(--glass-1); padding:10px; border-radius:10px;">';
      p.exercises.forEach(function(ex) {
        html += '<div style="margin-bottom:5px;">• ' + ex + '</div>';
      });
      html += '</div>';
      html += '</div>';
    });
  }

  document.getElementById('app').innerHTML = html;
}

/* ============ 4. ГРАФИКИ BEAM (HEATMAP) ============ */
function renderHeatmap() {
  // Простая генерация сетки активности
  var html = '<div style="display:grid; grid-template-columns:repeat(7, 1fr); gap:4px;">';
  for (var i = 0; i < 28; i++) {
    var intensity = Math.floor(Math.random() * 4); // 0-3
    var colors = ['var(--glass-1)', 'rgba(91,158,255,0.3)', 'rgba(91,158,255,0.6)', 'rgba(91,158,255,1)'];
    html += '<div style="aspect-ratio:1; background:' + colors[intensity] + '; border-radius:4px;"></div>';
  }
  html += '</div>';
  return html;
}

/* ============ 5. ДНЕВНИК (STOIC STYLE) ============ */
function renderDiary() {
  var html = '<div class="title-xl">📓 Дневник</div>';
  
  html += '<div class="card">';
  html += '<h2>☀️ Утро</h2>';
  html += '<p class="text-secondary">Запишите цели на день.</p>';
  html += '<textarea placeholder="Что важно сделать сегодня?" style="margin-top:10px;"></textarea>';
  html += '</div>';

  html += '<div class="card">';
  html += '<h2>🌙 Вечер</h2>';
  html += '<p class="text-secondary">Что получилось? За что благодарны?</p>';
  html += '<textarea placeholder="Итоги дня..." style="margin-top:10px;"></textarea>';
  html += '</div>';

  document.getElementById('app').innerHTML = html;
}

/* ============ 6. НАВИГАЦИЯ (ДОБАВЛЯЕМ ЭКРАНЫ) ============ */
var originalNavigate = window.navigate;
window.navigate = function(page, silent) {
  if (page === 'trainingTest') { renderTrainingTest(); return; }
  if (page === 'trainingHub') { renderTrainingHub(); return; }
  if (page === 'diary') { renderDiary(); return; }
  originalNavigate(page, silent);
};

console.log('[RENDER ✅] Экраны тренировок, графиков и дневника добавлены');

/* ============ 7. ЭКРАН МУЗЫКИ ============ */
function renderMusicHub() {
  var playlists = window.MUSIC_PLAYLISTS || [];
  var html = '<div class="title-xl">🎵 Музыка</div>';
  html += '<p class="text-secondary" style="margin-bottom:15px;">Плейлисты, подобранные под ваши задачи.</p>';

  playlists.forEach(function(p) {
    html += '<div class="card">';
    html += '<h2>' + p.emoji + ' ' + p.title + '</h2>';
    html += '<p class="text-secondary" style="margin-bottom:10px;">' + p.desc + '</p>';
    
    // Теги треков
    html += '<div style="display:flex; gap:5px; flex-wrap:wrap; margin-bottom:10px;">';
    p.tracks.forEach(function(t) {
      html += '<span style="background:var(--glass-1); padding:4px 8px; border-radius:8px; font-size:11px;">' + t + '</span>';
    });
    html += '</div>';

    html += '<a href="' + p.link + '" target="_blank" class="btn btn-primary" style="text-decoration:none; display:flex;">Открыть в Spotify</a>';
    html += '</div>';
  });

  document.getElementById('app').innerHTML = html;
}

/* ============ 8. ЭКРАН КНИГ ============ */
var currentBookFilter = 'all';

function renderBooksHub() {
  var books = window.BOOKS_LIBRARY || [];
  
  var html = '<div class="title-xl">📚 Книги</div>';
  
  // Фильтры
  html += '<div style="display:flex; gap:10px; margin-bottom:15px; overflow-x:auto; padding-bottom:5px;">';
  var filters = [
    { id: 'all', name: 'Все' },
    { id: 'reading', name: 'Читаю' },
    { id: 'to_read', name: 'Хочу' },
    { id: 'read', name: 'Прочитано' }
  ];
  filters.forEach(function(f) {
    var active = currentBookFilter === f.id;
    html += '<button class="btn" style="min-height:30px; padding:5px 15px; font-size:12px; width:auto; ' + (active ? 'background:var(--brand); color:#fff;' : 'background:var(--glass-1); color:var(--text);') + '" onclick="setBookFilter(\'' + f.id + '\')">' + f.name + '</button>';
  });
  html += '</div>';

  var filtered = currentBookFilter === 'all' ? books : books.filter(function(b) { return b.status === currentBookFilter; });

  filtered.forEach(function(b) {
    var statusText = b.status === 'reading' ? '📖 Читаю' : b.status === 'to_read' ? '🎯 Хочу прочитать' : '✅ Прочитано';
    html += '<div class="card">';
    html += '<div style="display:flex; gap:10px;">';
    html += '<div style="font-size:30px;">' + b.emoji + '</div>';
    html += '<div>';
    html += '<h2 style="margin-bottom:5px;">' + b.title + '</h2>';
    html += '<p class="text-secondary" style="font-size:12px; margin-bottom:5px;">' + b.author + ' · ' + b.category + '</p>';
    html += '<span style="font-size:11px; font-weight:bold; color:var(--brand);">' + statusText + '</span>';
    html += '</div>';
    html += '</div>';
    html += '<p class="text-secondary" style="margin-top:10px; margin-bottom:10px; font-size:13px;">' + b.desc + '</p>';
    
    // Главная мысль
    html += '<div style="background:var(--glass-1); border-left:3px solid var(--brand); padding:10px; border-radius:5px; font-size:13px;">';
    html += '<b>💡 Главная мысль:</b> ' + b.keyTakeaway;
    html += '</div>';
    html += '</div>';
  });

  document.getElementById('app').innerHTML = html;
}

function setBookFilter(id) {
  currentBookFilter = id;
  renderBooksHub();
}

/* ============ 9. ОБНОВЛЕНИЕ НАВИГАЦИИ ============ */
// Перехватываем navigate, чтобы добавить новые экраны (Музыка и Книги)
var previousNavigate = window.navigate;
window.navigate = function(page, silent) {
  if (page === 'music') { renderMusicHub(); return; }
  if (page === 'books') { renderBooksHub(); return; }
  previousNavigate(page, silent);
};

/* ============ 10. КНОПКИ НА ГЛАВНОМ ЭКРАНЕ ============ */
// Добавляем кнопки Музыки и Книг на главную
var previousDashboard = window.renderDashboard;
window.renderDashboard = function() {
  previousDashboard();
  
  var app = document.getElementById('app');
  if (!app) return;

  var extra = '';
  
  // Кнопки Музыки и Книг
  extra += '<div class="card">';
  extra += '<h2>🎵 Музыка и Книги</h2>';
  extra += '<div style="display:flex; gap:10px; margin-top:10px;">';
  extra += '<button class="btn btn-primary" style="flex:1;" onclick="navigate(\'music\')">Музыка</button>';
  extra += '<button class="btn btn-primary" style="flex:1;" onclick="navigate(\'books\')">Книги</button>';
  extra += '</div>';
  extra += '</div>';

  app.innerHTML += extra;
};

console.log('[RENDER ✅] Экраны Музыки и Книг добавлены');

/* ============ 11. ПИТОМЕЦ (МЕХАНИКА FINCH) ============ */
// Инициализация питомца, если его нет
if (!state.pet) {
  state.pet = {
    name: 'Барсик',
    xp: 0,
    level: 1,
    hunger: 100,
    mood: 'happy',
    emoji: '🐣'
  };
  save();
}

function renderPet() {
  var pet = state.pet;
  var xpNeeded = pet.level * 100;
  var progress = (pet.xp / xpNeeded) * 100;

  var html = '<div class="title-xl">🐣 Питомец</div>';
  
  html += '<div class="card" style="text-align:center; padding:30px 15px;">';
  html += '<div style="font-size:80px; margin-bottom:15px; animation: slideUp 0.5s ease-out;">' + pet.emoji + '</div>';
  html += '<h2>' + pet.name + '</h2>';
  html += '<p class="text-secondary">Уровень ' + pet.level + '</p>';
  
  // Прогресс-бар XP
  html += '<div class="progress" style="margin-top:15px; height:12px;">';
  html += '<div class="progress-fill" style="width:' + progress + '%;"></div>';
  html += '</div>';
  html += '<p class="text-secondary" style="font-size:12px; margin-top:5px;">' + pet.xp + ' / ' + xpNeeded + ' XP</p>';
  html += '</div>';

  // Кнопки взаимодействия
  html += '<div class="card">';
  html += '<h2>Взаимодействие</h2>';
  html += '<button class="btn btn-primary" style="margin-bottom:10px;" onclick="feedPet()">🍎 Покормить (Тратит 50 XP)</button>';
  html += '<button class="btn" style="background:var(--glass-1); color:var(--text);" onclick="playWithPet()">🎾 Поиграть (Дает энергию)</button>';
  html += '</div>';

  document.getElementById('app').innerHTML = html;
}

function feedPet() {
  if (state.pet.xp >= 50) {
    state.pet.xp -= 50;
    state.pet.hunger = 100;
    state.pet.mood = 'happy';
    state.pet.emoji = state.pet.level > 2 ? '🐥' : '🐣';
    save();
    toast('Питомец сыт!', 'success');
    renderPet();
  } else {
    toast('Недостаточно XP. Выполняйте привычки!', 'error');
  }
}

function playWithPet() {
  state.pet.xp += 10;
  if (state.pet.xp >= state.pet.level * 100) {
    state.pet.level++;
    state.pet.xp = 0;
    state.pet.emoji = state.pet.level > 3 ? '🦅' : '🐥';
    toast('Питомец эволюционировал!', 'success');
  } else {
    toast('Питомец доволен (+10 XP)!', 'success');
  }
  save();
  renderPet();
}

// Начисление XP питомцу за выполненные задачи (хук)
var originalToggleTask = window.toggleTask;
window.toggleTask = function(id) {
  if (originalToggleTask) originalToggleTask(id);
  if (state.pet) {
    state.pet.xp += 5; // Даем 5 XP питомцу
    save();
  }
};


/* ============ 12. ЭКРАННЫЙ ДЕТОКС (SCREENZEN) ============ */
if (!state.detox) {
  state.detox = {
    cooldownActive: false,
    sleepModeActive: false,
    stats: { cooldownCount: 0, screenMinutes: 0 }
  };
  save();
}

function renderDetox() {
  var html = '<div class="title-xl">🧘 Детокс</div>';
  html += '<p class="text-secondary" style="margin-bottom:15px;">Инструменты для контроля экранного времени и снятия зависимости.</p>';

  // Период охлаждения
  html += '<div class="card">';
  html += '<h2>❄️ Период охлаждения</h2>';
  html += '<p class="text-secondary" style="margin-bottom:10px;">Блокировка приложения на 10 минут для снятия импульса.</p>';
  if (state.detox.cooldownActive) {
    html += '<button class="btn btn-danger">Заблокировано (идет время)</button>';
  } else {
    html += '<button class="btn btn-primary" onclick="startCooldown()">Запустить кулдаун (10 мин)</button>';
  }
  html += '</div>';

  // Режим сна
  html += '<div class="card">';
  html += '<h2>🌙 Режим сна</h2>';
  html += '<p class="text-secondary" style="margin-bottom:10px;">Блокировка экрана с 22:00 до 07:00.</p>';
  html += '<button class="btn ' + (state.detox.sleepModeActive ? 'btn-success' : 'btn-primary') + '" onclick="toggleSleepMode()">' + (state.detox.sleepModeActive ? '✅ Включен' : 'Включить') + '</button>';
  html += '</div>';

  // Статистика
  html += '<div class="card">';
  html += '<h2>📊 Статистика</h2>';
  html += '<div style="display:flex; justify-content:space-between; margin-bottom:10px;">';
  html += '<div>Кулдаунов:</div><div><b>' + state.detox.stats.cooldownCount + '</b></div>';
  html += '</div>';
  html += '<div style="display:flex; justify-content:space-between;">';
  html += '<div>Экранное время:</div><div><b>' + state.detox.stats.screenMinutes + ' мин</b></div>';
  html += '</div>';
  html += '</div>';

  document.getElementById('app').innerHTML = html;
}

function startCooldown() {
  state.detox.cooldownActive = true;
  state.detox.stats.cooldownCount++;
  save();
  toast('Детокс активирован на 10 минут!', 'warning');
  renderDetox();
  
  // Простая симуляция окончания
  setTimeout(function() {
    state.detox.cooldownActive = false;
    save();
    if (window.currentPage === 'detox') renderDetox();
  }, 10 * 60 * 1000);
}

function toggleSleepMode() {
  state.detox.sleepModeActive = !state.detox.sleepModeActive;
  save();
  renderDetox();
}


/* ============ 13. ОБНОВЛЕНИЕ НАВИГАЦИИ И ГЛАВНОЙ ============ */
// Перехватываем navigate
var prevNav = window.navigate;
window.navigate = function(page, silent) {
  if (page === 'pet') { renderPet(); return; }
  if (page === 'detox') { renderDetox(); return; }
  prevNav(page, silent);
};

// Добавляем кнопки на главную
var prevDash = window.renderDashboard;
window.renderDashboard = function() {
  prevDash();
  
  var app = document.getElementById('app');
  if (!app) return;

  var extra = '';
  
  extra += '<div class="card">';
  extra += '<h2>🎮 Геймификация и Детокс</h2>';
  extra += '<div style="display:flex; gap:10px; margin-top:10px;">';
  extra += '<button class="btn btn-primary" style="flex:1;" onclick="navigate(\'pet\')">🐣 Питомец</button>';
  extra += '<button class="btn btn-primary" style="flex:1; background:var(--danger);" onclick="navigate(\'detox\')">🧘 Детокс</button>';
  extra += '</div>';
  extra += '</div>';

  app.innerHTML += extra;
};

console.log('[RENDER ✅] Питомец и Детокс добавлены');
