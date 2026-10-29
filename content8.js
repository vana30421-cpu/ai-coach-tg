'use strict';
/* ============================================================
   LIFE OS — CONTENT8.js v49
   Музыка, Книги, Данные для графиков Beam (Velocity, Heatmap)
   ============================================================ */

/* ============ МУЗЫКА (Плейлисты под задачи) ============ */
var MUSIC_PLAYLISTS = [
  {
    id: 'focus',
    title: 'Глубокий фокус',
    emoji: '🎧',
    desc: 'Lo-fi, Ambient, Бинауральные ритмы. Помогает войти в состояние потока.',
    link: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ', // Пример ссылки
    tracks: ['Lo-fi Beats', 'Deep Focus', 'Instrumental Study']
  },
  {
    id: 'workout',
    title: 'Тренировка (БИ/Фитнес)',
    emoji: '💪',
    desc: 'Высокий BPM, Hard Rock, Phonk. Для максимальной отдачи.',
    link: 'https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP',
    tracks: ['Phonk Motivation', 'Beast Mode', 'Rock Workout']
  },
  {
    id: 'sleep',
    title: 'Глубокий сон',
    emoji: '😴',
    desc: 'Медленные частоты, пианино, звуки природы. Для быстрого засыпания.',
    link: 'https://open.spotify.com/playlist/37i9dQZF1DWZd79rJ6a7lp',
    tracks: ['Deep Sleep', 'Rain Sounds', 'Delta Waves']
  },
  {
    id: 'relax',
    title: 'Снятие стресса',
    emoji: '🌿',
    desc: 'Классика, джаз, акустика. Для восстановления после рабочего дня.',
    link: 'https://open.spotify.com/playlist/37i9dQZF1DWZ8ixZ7tA1bT',
    tracks: ['Peaceful Piano', 'Jazz Relax', 'Acoustic Chill']
  }
];

/* ============ КНИГИ (Подробный раздел) ============ */
var BOOKS_LIBRARY = [
  {
    id: 'b1',
    title: 'Думай медленно... решай быстро',
    author: 'Даниэль Канеман',
    category: 'Мышление',
    emoji: '🧠',
    status: 'to_read',
    desc: 'Фундаментальный труд о двух системах мышления: быстрой интуитивной и медленной рациональной.',
    keyTakeaway: 'Мы часто принимаем решения на автопилоте и подвержены когнитивным искажениям.'
  },
  {
    id: 'b2',
    title: 'Атомные привычки',
    author: 'Джеймс Клир',
    category: 'Привычки',
    emoji: '🔄',
    status: 'reading',
    desc: 'Как формировать хорошие привычки и избавляться от плохих через систему маленьких шагов.',
    keyTakeaway: '1% улучшений каждый день = 37-кратный рост за год. Среда важнее силы воли.'
  },
  {
    id: 'b3',
    title: 'Глубокая работа',
    author: 'Кэл Ньюпорт',
    category: 'Продуктивность',
    emoji: '🎯',
    status: 'read',
    desc: 'Как работать без отвлечений в мире, который постоянно требует внимания.',
    keyTakeaway: 'Deep Work (глубокая работа) — это суперсила XXI века. 90 минут фокуса = 3 часа обычной работы.'
  },
  {
    id: 'b4',
    title: 'Sapiens. Краткая история человечества',
    author: 'Юваль Ной Харари',
    category: 'История',
    emoji: '🌍',
    status: 'to_read',
    desc: 'Как Homo sapiens стал доминирующим видом на планете.',
    keyTakeaway: 'Наша сила — в способности верить в общие мифы (деньги, религия, государства).'
  },
  {
    id: 'b5',
    title: 'Стоицизм на каждый день',
    author: 'Райан Холидей',
    category: 'Философия',
    emoji: '🏛',
    status: 'reading',
    desc: '366 размышлений о мудрости, стойкости и искусстве жить.',
    keyTakeaway: 'Мы не контролируем события, но контролируем свою реакцию на них.'
  }
];

/* ============ СТАТЬИ И ВИДЕО (Для обучения) ============ */
var LEARNING_RESOURCES = [
  {
    id: 'res1',
    type: 'video',
    title: 'Как учиться быстрее (метод Фейнмана)',
    source: 'YouTube',
    link: 'https://www.youtube.com/results?search_query=feynman+technique',
    desc: 'Объяснение техники обучения через объяснение простыми словами.'
  },
  {
    id: 'res2',
    type: 'article',
    title: 'Наука о сне: что происходит с мозгом',
    source: 'Huberman Lab',
    link: 'https://www.hubermanlab.com/',
    desc: 'Почему глубокий сон критически важен для памяти и восстановления.'
  },
  {
    id: 'res3',
    type: 'video',
    title: 'Бокс: база для новичков',
    source: 'YouTube',
    link: 'https://www.youtube.com/results?search_query=boxing+basics',
    desc: 'Основы стойки, передвижения и прямых ударов.'
  }
];

/* ============ ДАННЫЕ ДЛЯ ГРАФИКОВ BEAM ============ */
// Эти данные будут использоваться для отрисовки в app-render.js
var BEAM_METRICS = {
  velocity: {
    label: 'Скорость (задач в день)',
    color: '#5b9eff',
    // Пример: последние 7 дней (генерируется динамически в app.js)
    defaultData: [0, 0, 0, 0, 0, 0, 0]
  },
  cycleTime: {
    label: 'Время выполнения (дни)',
    color: '#a78bfa',
    defaultData: 0
  },
  workBalance: {
    label: 'Баланс работы',
    segments: [
      { name: 'Работа', color: '#ffa940' },
      { name: 'Личное', color: '#3ddc97' },
      { name: 'Восстановление', color: '#5b9eff' }
    ]
  }
};

/* ============ ЭКСПОРТ ============ */
window.MUSIC_PLAYLISTS = MUSIC_PLAYLISTS;
window.BOOKS_LIBRARY = BOOKS_LIBRARY;
window.LEARNING_RESOURCES = LEARNING_RESOURCES;
window.BEAM_METRICS = BEAM_METRICS;

console.log('[CONTENT8 ✅] MUSIC=' + MUSIC_PLAYLISTS.length + ' BOOKS=' + BOOKS_LIBRARY.length + ' RESOURCES=' + LEARNING_RESOURCES.length);
