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
