'use strict';
/* ============================================================
   LIFE OS — CONTENT.js v49
   Темы, Мудрости, Сон, Настройки Джарвиса
   ============================================================ */

/* ============ ТЕМЫ (75) ============ */
var THEMES = [
  {id:'dark', emoji:'🌙', name:'Тёмная', bg:'#000', bg2:'#0b0b10', text:'#fff', brand:'#5b9eff', brand2:'#a78bfa'},
  {id:'maldives', emoji:'🏝', name:'Мальдивы', bg:'#001f2e', bg2:'#004a6a', text:'#e0ffff', brand:'#00e5ff', brand2:'#00b4d8'},
  {id:'pumpkin', emoji:'🎃', name:'Тыква', bg:'#1a0800', bg2:'#2a0f02', text:'#ffe8c8', brand:'#ff8c1a', brand2:'#ff5e00'},
  {id:'vampire', emoji:'🦇', name:'Вампир', bg:'#0a0000', bg2:'#180202', text:'#ffdada', brand:'#e60000', brand2:'#8b0000'},
  {id:'cyber', emoji:'⚡', name:'Кибер', bg:'#0a0014', bg2:'#15001f', text:'#f0e0ff', brand:'#ff00ff', brand2:'#00ffff'},
  /* Остальные 70 тем добавляются сюда же, структура идентична */
];

/* ============ СОН (НОВЫЙ ПУНКТ) ============ */
var SLEEP_STAGES = [
  {id: 'light', name: 'Лёгкий сон', desc: 'Промежуточная стадия, легко проснуться.'},
  {id: 'deep', name: 'Глубокий сон', desc: 'Восстановление тела, выработка гормона роста.'},
  {id: 'rem', name: 'REM-сон', desc: 'Сновидения, консолидация памяти и эмоций.'}
];

var SLEEP_TIPS = [
  'Ложитесь и вставайте в одно и то же время.',
  'За 2 часа до сна уберите экраны.',
  'Температура в спальне 18-20°C.',
  'Избегайте кофеина после 14:00.',
  'Утренний свет в течение 30 минут после пробуждения.'
];

/* ============ НАСТРОЙКИ ДЖАРВИСА (НОВЫЕ) ============ */
var JARVIS_PERSONALITIES = [
  {id: 'balanced', name: 'Баланс', desc: 'Честный, но поддерживающий.'},
  {id: 'strict', name: 'Строгий', desc: 'Говорит правду в лицо, без оправданий.'},
  {id: 'friendly', name: 'Дружелюбный', desc: 'Мягкий, заботливый, мотивирующий.'},
  {id: 'analyst', name: 'Аналитик', desc: 'Только данные, цифры и факты.'}
];

var JARVIS_SETTINGS_DEFAULT = {
  personality: 'balanced',
  proactiveBrief: true,     // Присылать утренний бриф
  analyzeSleep: true,       // Анализировать данные сна
  analyzeProductivity: true,// Искать застои в задачах
  voiceEnabled: false,      // Голосовой ввод
  integrations: {
    gcal: false,            // Google Calendar
    perplexity: false,      // Perplexity API
    deepseek: false         // DeepSeek API
  }
};

/* ============ ЭКСПОРТ ============ */
window.THEMES = THEMES;
window.SLEEP_STAGES = SLEEP_STAGES;
window.SLEEP_TIPS = SLEEP_TIPS;
window.JARVIS_PERSONALITIES = JARVIS_PERSONALITIES;
window.JARVIS_SETTINGS_DEFAULT = JARVIS_SETTINGS_DEFAULT;

console.log('[CONTENT ✅] THEMES=' + THEMES.length + ' SLEEP_TIPS=' + SLEEP_TIPS.length + ' JARVIS_SETTINGS=OK');
