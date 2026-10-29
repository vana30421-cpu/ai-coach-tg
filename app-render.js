'use strict';
/* ============================================================
   LIFE OS — APP-RENDER.js v49 (FIXED)
   ============================================================ */

/* ============ 1. БЕЗОПАСНАЯ ОТРИСОВКА ГЛАВНОЙ ============ */
function forceRenderDashboard() {
  var app = document.getElementById('app');
  if (!app) return;

  // Базовый HTML главной
  var html = '<div class="title-xl">Главная</div>';
  
  // XP и Уровень (с защитой)
  try {
    var lvl = state && state.gamification ? state.gamification.level : 1;
    var xp = state && state.gamification ? state.gamification.xp : 0;
    var gold = state && state.gamification ? state.gamification.gold : 0;
    
    html += '<div class="card">';
    html += '<h2>Уровень ' + lvl + '</h2>';
    html += '<div class="progress"><div class="progress-fill" style="width:' + (xp % 100) + '%"></div></div>';
    html += '<p class="text-secondary" style="margin-top:8px;">XP: ' + xp + ' | Золото: ' + gold + ' 🪙</p>';
    html += '</div>';
  } catch(e) { console.error('XP Error:', e); }

  // Блок Джарвиса
  try {
    html += '<div class="card" style="background:linear-gradient(135deg, #a78bfa, #5b9eff); color:white;">';
    html += '<h2>🤖 Джарвис на связи</h2>';
    html += '<p style="margin-bottom:10px; opacity:0.9;">Умный анализ ваших данных</p>';
    html += '<button class="btn" style="background:white; color:#5b9eff;" onclick="navigate(\'coachChatList\')">Открыть чаты</button>';
    html += '</div>';
  } catch(e) { console.error('Jarvis Block Error:', e); }

  // Блок Тренировок
  try {
    html += '<div class="card">';
    html += '<h2>💪 Тренировки</h2>';
    html += '<button class="btn btn-primary" onclick="navigate(\'trainingTest\')">Пройти тест (30 вопросов)</button>';
    html += '</div>';
  } catch(e) { console.error('Training Block Error:', e); }

  // Блок Музыки и Книг
  try {
    html += '<div class="card">';
    html += '<h2>🎵 Музыка и Книги</h2>';
    html += '<div style="display:flex; gap:10px; margin-top:10px;">';
    html += '<button class="btn btn-primary" style="flex:1;" onclick="navigate(\'music\')">Музыка</button>';
    html += '<button class="btn btn-primary" style="flex:1;" onclick="navigate(\'books\')">Книги</button>';
    html += '</div>';
    html += '</div>';
  } catch(e) { console.error('Music Block Error:', e); }

  // Блок Питомца и Детокса
  try {
    html += '<div class="card">';
    html += '<h2>🎮 Геймификация и Детокс</h2>';
    html += '<div style="display:flex; gap:10px; margin-top:10px;">';
    html += '<button class="btn btn-primary" style="flex:1;" onclick="navigate(\'pet\')">🐣 Питомец</button>';
    html += '<button class="btn btn-primary" style="flex:1; background:var(--danger);" onclick="navigate(\'detox\')">🧘 Детокс</button>';
    html += '</div>';
    html += '</div>';
  } catch(e) { console.error('Pet Block Error:', e); }

  // Блок Сна
  try {
    html += '<div class="card">';
    html += '<h2>😴 Сон</h2>';
    html += '<button class="btn btn-primary" onclick="navigate(\'sleep\')">Записать сон</button>';
    html += '</div>';
  } catch(e) { console.error('Sleep Block Error:', e); }

  app.innerHTML = html;
}

// Переопределяем стандартный рендер главной
window.renderDashboard = forceRenderDashboard;


/* ============ 2. ЭКРАН ТРЕНИРОВОК (ОПРОС) ============ */
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
    var el = document.getElementById('test-' + q.id);
    if (el && el.value) answers[q.id] = el.value;
  });

  if (Object.keys(answers).length < 5) {
    alert('Ответьте хотя бы на 5 вопросов.');
    return;
  }

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

/* ============ 4. ЭКРАН МУЗЫКИ ============ */
function renderMusicHub() {
  var playlists = window.MUSIC_PLAYLISTS || [];
  var html = '<div class="title-xl">🎵 Музыка</div>';
  html += '<button class="btn" style="margin-bottom:15px; background:var(--glass-1); color:var(--text);" onclick="navigate(\'dashboard\')">← На главную</button>';

  playlists.forEach(function(p) {
    html += '<div class="card">';
    html += '<h2>' + p.emoji + ' ' + p.title + '</h2>';
    html += '<p class="text-secondary" style="margin-bottom:10px;">' + p.desc + '</p>';
    html += '<a href="' + p.link + '" target="_blank" class="btn btn-primary" style="text-decoration:none; display:flex;">Открыть плейлист</a>';
    html += '</div>';
  });

  document.getElementById('app').innerHTML = html;
}

/* ============ 5. ЭКРАН КНИГ ============ */
function renderBooksHub() {
  var books = window.BOOKS_LIBRARY || [];
  var html = '<div class="title-xl">📚 Книги</div>';
  html += '<button class="btn" style="margin-bottom:15px; background:var(--glass-1); color:var(--text);" onclick="navigate(\'dashboard\')">← На главную</button>';

  books.forEach(function(b) {
    html += '<div class="card">';
    html += '<h2>' + b.emoji + ' ' + b.title + '</h2>';
    html += '<p class="text-secondary" style="font-size:12px; margin-bottom:5px;">' + b.author + '</p>';
    html += '<p class="text-secondary" style="margin-bottom:10px; font-size:13px;">' + b.desc + '</p>';
    html += '<div style="background:var(--glass-1); border-left:3px solid var(--brand); padding:10px; border-radius:5px; font-size:13px;">';
    html += '<b>💡 Главная мысль:</b> ' + b.keyTakeaway;
    html += '</div>';
    html += '</div>';
  });

  document.getElementById('app').innerHTML = html;
}

/* ============ 6. ПИТОМЕЦ ============ */
if (!state.pet) {
  state.pet = { name: 'Барсик', xp: 0, level: 1, emoji: '🐣' };
  save();
}

function renderPet() {
  var pet = state.pet;
  var xpNeeded = pet.level * 100;
  var progress = Math.min(100, (pet.xp / xpNeeded) * 100);

  var html = '<div class="title-xl">🐣 Питомец</div>';
  html += '<button class="btn" style="margin-bottom:15px; background:var(--glass-1); color:var(--text);" onclick="navigate(\'dashboard\')">← На главную</button>';
  
  html += '<div class="card" style="text-align:center; padding:30px 15px;">';
  html += '<div style="font-size:80px; margin-bottom:15px;">' + pet.emoji + '</div>';
  html += '<h2>' + pet.name + '</h2>';
  html += '<p class="text-secondary">Уровень ' + pet.level + '</p>';
  html += '<div class="progress" style="margin-top:15px; height:12px;"><div class="progress-fill" style="width:' + progress + '%;"></div></div>';
  html += '<p class="text-secondary" style="font-size:12px; margin-top:5px;">' + pet.xp + ' / ' + xpNeeded + ' XP</p>';
  html += '</div>';

  html += '<div class="card">';
  html += '<button class="btn btn-primary" style="margin-bottom:10px;" onclick="playWithPet()">🎾 Поиграть (+10 XP)</button>';
  html += '<button class="btn" style="background:var(--glass-1); color:var(--text);" onclick="feedPet()">🍎 Покормить (-50 XP)</button>';
  html += '</div>';

  document.getElementById('app').innerHTML = html;
}

function playWithPet() {
  state.pet.xp += 10;
  if (state.pet.xp >= state.pet.level * 100) {
    state.pet.level++;
    state.pet.xp = 0;
    state.pet.emoji = state.pet.level > 2 ? '🐥' : '🐣';
    toast('Эволюция!', 'success');
  } else {
    toast('+10 XP', 'success');
  }
  save();
  renderPet();
}

function feedPet() {
  if (state.pet.xp >= 50) {
    state.pet.xp -= 50;
    toast('Питомец сыт!', 'success');
    save();
    renderPet();
  } else {
    toast('Недостаточно XP', 'error');
  }
}

/* ============ 7. ДЕТОКС ============ */
if (!state.detox) {
  state.detox = { cooldownActive: false, sleepModeActive: false, stats: { cooldownCount: 0 } };
  save();
}

function renderDetox() {
  var html = '<div class="title-xl">🧘 Детокс</div>';
  html += '<button class="btn" style="margin-bottom:15px; background:var(--glass-1); color:var(--text);" onclick="navigate(\'dashboard\')">← На главную</button>';

  html += '<div class="card">';
  html += '<h2>❄️ Кулдаун (10 мин)</h2>';
  if (state.detox.cooldownActive) {
    html += '<button class="btn btn-danger">Заблокировано</button>';
  } else {
    html += '<button class="btn btn-primary" onclick="state.detox.cooldownActive=true; save(); renderDetox();">Запустить</button>';
  }
  html += '</div>';

  html += '<div class="card">';
  html += '<h2>🌙 Режим сна</h2>';
  html += '<button class="btn ' + (state.detox.sleepModeActive ? 'btn-success' : 'btn-primary') + '" onclick="state.detox.sleepModeActive=!state.detox.sleepModeActive; save(); renderDetox();">' + (state.detox.sleepModeActive ? 'Включен' : 'Включить') + '</button>';
  html += '</div>';

  document.getElementById('app').innerHTML = html;
}

/* ============ 8. ОБНОВЛЕНИЕ НАВИГАЦИИ ============ */
var baseNavigate = window.navigate;
window.navigate = function(page, silent) {
  if (page === 'trainingTest') { renderTrainingTest(); return; }
  if (page === 'trainingHub') { renderTrainingHub(); return; }
  if (page === 'music') { renderMusicHub(); return; }
  if (page === 'books') { renderBooksHub(); return; }
  if (page === 'pet') { renderPet(); return; }
  if (page === 'detox') { renderDetox(); return; }
  
  // Для остальных страниц (dashboard, tasks, sleep, settings) вызываем базу
  baseNavigate(page, silent);
};

console.log('[RENDER ✅] Все экраны загружены и защищены от ошибок');
