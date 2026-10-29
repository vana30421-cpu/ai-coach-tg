'use strict';
/* ============================================================
   LIFE OS — APP-JARVIS.js v49
   Чаты с сессиями, Умный план дня, Анализ данных, Интеграции
   ============================================================ */

/* ============ 1. ЧАТЫ С СЕССИЯМИ (BEAM STYLE) ============ */
var currentChatSessionId = null;

function renderCoachChatList() {
  if (!state.jarvis) state.jarvis = { sessions: [] };
  if (!state.jarvis.sessions) state.jarvis.sessions = [];

  var html = '<div class="title-xl">💬 Джарвис</div>';
  
  // Кнопка нового чата
  html += '<button class="btn btn-primary" style="margin-bottom:15px;" onclick="startNewChatSession()">+ Новый чат</button>';

  if (state.jarvis.sessions.length === 0) {
    html += '<div class="card"><p class="text-secondary">Нет чатов. Создайте первый!</p></div>';
  } else {
    html += '<div class="card">';
    // Показываем последние чаты сверху
    state.jarvis.sessions.slice().reverse().forEach(function(sess) {
      html += '<div class="list-row" onclick="openChatSession(\'' + sess.id + '\')">';
      html += '<div class="list-icon">💬</div>';
      html += '<div><div style="font-weight:bold;">' + sess.title + '</div>';
      html += '<div class="text-secondary">' + (sess.messages ? sess.messages.length : 0) + ' сообщений · ' + sess.date + '</div></div>';
      html += '</div>';
    });
    html += '</div>';
  }

  document.getElementById('app').innerHTML = html;
}

function startNewChatSession() {
  var title = prompt('Название чата (например: "План на неделю"):');
  if (!title) return;
  
  if (!state.jarvis) state.jarvis = { sessions: [] };
  if (!state.jarvis.sessions) state.jarvis.sessions = [];

  var newSession = {
    id: Date.now().toString(),
    title: title,
    date: new Date().toISOString().slice(0,10),
    messages: []
  };
  
  state.jarvis.sessions.push(newSession);
  save();
  openChatSession(newSession.id);
}

function openChatSession(id) {
  currentChatSessionId = id;
  navigate('chatSession'); // Переход на экран чата
}

function renderChatSession() {
  if (!state.jarvis || !state.jarvis.sessions) return;
  var sess = state.jarvis.sessions.find(function(s) { return s.id === currentChatSessionId; });
  if (!sess) { navigate('coachChatList'); return; }

  var html = '<div class="title-xl">💬 ' + sess.title + '</div>';
  html += '<button class="btn" style="margin-bottom:15px; background:var(--glass-1); color:var(--text);" onclick="navigate(\'coachChatList\')">← Все чаты</button>';

  html += '<div class="card" id="chatBox" style="min-height:300px; max-height:60vh; overflow-y:auto; display:flex; flex-direction:column; gap:10px;">';
  if (!sess.messages || sess.messages.length === 0) {
    html += '<p class="text-secondary">Напишите сообщение, и Джарвис проанализирует ваши данные.</p>';
  } else {
    sess.messages.forEach(function(m) {
      var isUser = m.role === 'user';
      html += '<div style="align-self:' + (isUser ? 'flex-end' : 'flex-start') + '; background:' + (isUser ? 'var(--brand)' : 'var(--glass-1)') + '; padding:10px 15px; border-radius:15px; max-width:80%; color:' + (isUser ? '#fff' : 'var(--text)') + ';">';
      html += m.text;
      html += '</div>';
    });
  }
  html += '</div>';

  // Поле ввода
  html += '<div style="display:flex; gap:10px; margin-top:10px;">';
  html += '<input type="text" id="chatInput" placeholder="Спросите Джарвиса..." style="flex:1;" onkeydown="if(event.key===\'Enter\') sendJarvisMessage()">';
  html += '<button class="btn btn-primary" style="width:60px;" onclick="sendJarvisMessage()">➤</button>';
  html += '</div>';

  document.getElementById('app').innerHTML = html;
  
  // Прокрутка вниз
  var box = document.getElementById('chatBox');
  if (box) box.scrollTop = box.scrollHeight;
}

function sendJarvisMessage() {
  var input = document.getElementById('chatInput');
  if (!input) return;
  var text = input.value.trim();
  if (!text) return;
  input.value = '';

  var sess = state.jarvis.sessions.find(function(s) { return s.id === currentChatSessionId; });
  if (!sess) return;

  sess.messages.push({ role: 'user', text: text });
  save();
  renderChatSession();

  // Имитация ответа Джарвиса (сбор данных + анализ)
  setTimeout(function() {
    var reply = analyzeUserDataAndReply(text);
    sess.messages.push({ role: 'bot', text: reply });
    save();
    renderChatSession();
  }, 600);
}

function analyzeUserDataAndReply(text) {
  // Сбор данных (Context Builder)
  var pendingTasks = state.tasks.filter(function(t) { return t.status === 'pending'; }).length;
  var lastSleep = state.sleep && state.sleep.entries.length > 0 ? state.sleep.entries[state.sleep.entries.length - 1] : null;
  
  // Логика ответа
  if (text.toLowerCase().includes('план') || text.toLowerCase().includes('день')) {
    var plan = generateDailyPlan();
    if (plan.length === 0) return "У вас пока нет задач на сегодня. Отдохните или добавьте новую цель.";
    var res = "📋 Ваш умный план на сегодня:\n";
    plan.forEach(function(p) { res += "• " + p.icon + " " + p.title + "\n"; });
    return res;
  }

  if (text.toLowerCase().includes('сон')) {
    if (!lastSleep) return "Я пока не знаю, как вы спали. Запишите сон в разделе 'Сон', и я дам рекомендации.";
    return "Вы спали " + lastSleep.hours + " часов (качество " + lastSleep.quality + "/10). " + (lastSleep.hours < 7 ? "Это меньше нормы. Рекомендую лечь сегодня на час раньше." : "Отличный сон! Продолжайте в том же духе.");
  }

  if (text.toLowerCase().includes('задач')) {
    return "У вас " + pendingTasks + " активных задач. Рекомендую начать с самой приоритетной.";
  }

  return "Я проанализировал ваши данные. У вас " + pendingTasks + " задач и " + (lastSleep ? lastSleep.hours + " часов сна" : "нет записей о сне") + ". Чем еще могу помочь?";
}

/* ============ 2. УМНЫЙ ПЛАН ДНЯ ============ */
function generateDailyPlan() {
  var plan = [];
  var t = new Date().toISOString().slice(0,10);

  // 1. Задачи
  var pendingTasks = state.tasks.filter(function(task) { 
    return task.status === 'pending'; 
  });
  pendingTasks.slice(0, 3).forEach(function(task) {
    plan.push({ type: 'task', icon: '✅', title: task.title });
  });

  // 2. Привычки
  if (state.habits) {
    state.habits.slice(0, 2).forEach(function(h) {
      if (h.lastCompletedDate !== t) {
        plan.push({ type: 'habit', icon: '🔄', title: h.title });
      }
    });
  }

  // 3. Тренировка (из будущего контента)
  if (state.fitness && state.fitness.activeProgram) {
    plan.push({ type: 'workout', icon: '💪', title: 'Тренировка: ' + state.fitness.activeProgram });
  }

  return plan;
}

/* ============ 3. АНАЛИЗ ПРОФИЛЯ (PIP МЕХАНИКА) ============ */
function analyzeUserProfile() {
  if (!state.jarvis.profile) state.jarvis.profile = { strengths: [], weaknesses: [] };
  
  // Пример логики: если задач больше 10, записываем в слабые места
  var pending = state.tasks.filter(function(t) { return t.status === 'pending'; }).length;
  if (pending > 10 && state.jarvis.profile.weaknesses.indexOf('Много незавершенных задач') === -1) {
    state.jarvis.profile.weaknesses.push('Много незавершенных задач');
  }

  // Анализ сна
  if (state.sleep && state.sleep.entries.length > 3) {
    var avgHours = state.sleep.entries.reduce(function(sum, e) { return sum + e.hours; }, 0) / state.sleep.entries.length;
    if (avgHours < 7 && state.jarvis.profile.weaknesses.indexOf('Хронический недосып') === -1) {
      state.jarvis.profile.weaknesses.push('Хронический недосып');
    }
  }

  save();
}

/* ============ ИНТЕГРАЦИЯ С НАВИГАЦИЕЙ ============ */
// Добавляем новые экраны в общую навигацию
var originalNavigate = window.navigate;
window.navigate = function(page, silent) {
  if (page === 'coachChatList') { renderCoachChatList(); return; }
  if (page === 'chatSession') { renderChatSession(); return; }
  originalNavigate(page, silent);
};

// Добавляем кнопку чата на главный экран
var originalRenderDashboard = window.renderDashboard;
window.renderDashboard = function() {
  originalRenderDashboard();
  var app = document.getElementById('app');
  if (!app) return;
  
  var jarvisBtn = '<div class="card" style="background:linear-gradient(135deg, var(--brand-2), var(--brand)); color:white; margin-top:15px;">';
  jarvisBtn += '<h2>🤖 Джарвис на связи</h2>';
  jarvisBtn += '<p style="margin-bottom:10px;">Умный анализ ваших данных</p>';
  jarvisBtn += '<button class="btn" style="background:white; color:var(--brand);" onclick="navigate(\'coachChatList\')">Открыть чаты</button>';
  jarvisBtn += '</div>';

  app.innerHTML = jarvisBtn + app.innerHTML;
};

console.log('[JARVIS ✅] Модули: Чаты, Умный план, Анализ данных загружены');
