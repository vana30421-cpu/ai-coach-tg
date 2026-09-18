'use strict';
/* AI HEALTH v33 — CONTENT FIX (LEARNING_LEVELS, ACHIEVEMENTS, эффекты, fallback) */

/* ============ LEARNING_LEVELS ============ */
if(typeof window.LEARNING_LEVELS==='undefined'||!Array.isArray(window.LEARNING_LEVELS)||!window.LEARNING_LEVELS.length){
  window.LEARNING_LEVELS=[
    {id:'lvl1',num:1,emoji:'🌱',title:'Основы',subtitle:'Старт пути',desc:'Базовые принципы здоровья, продуктивности и мышления',
      modules:[
        {id:'m1_1',emoji:'💪',title:'Фундамент здоровья',desc:'Сон, вода, движение',
          lessons:[
            {title:'Сон — основа всего',theory:'**7-9 часов.** Медленный сон = факты, REM = эмоции.',practice:'Ляг сегодня на 30 мин раньше.'},
            {title:'Вода и гидратация',theory:'**30 мл/кг.** Утром 500 мл сразу.',practice:'8 стаканов сегодня.'},
            {title:'Движение каждый день',theory:'**150 мин кардио + 2 силовые в неделю.**',practice:'20 мин прогулка.'}
          ]},
        {id:'m1_2',emoji:'🧠',title:'Мышление',desc:'Базовые принципы',
          lessons:[
            {title:'Что такое продуктивность',theory:'**Результат, не занятость.**',practice:'3 главных дела на день.'},
            {title:'Приоритеты',theory:'**Матрица Эйзенхауэра.** Q2 — цель.',practice:'Разбери 5 задач по Q1-Q4.'},
            {title:'Привычки',theory:'**Петля: cue → craving → response → reward.** 66 дней.',practice:'1 новая привычка.'}
          ]},
        {id:'m1_3',emoji:'🎯',title:'Цели',desc:'Как ставить цели',
          lessons:[
            {title:'SMART-цели',theory:'**Specific, Measurable, Achievable, Relevant, Time-bound.**',practice:'1 цель по SMART.'},
            {title:'OKR',theory:'**Objectives + Key Results.**',practice:'1 цель + 3 KR.'},
            {title:'Долгосрочное планирование',theory:'**5 лет → 1 год → месяц → неделя.**',practice:'5-летний план.'}
          ]}
      ]},
    {id:'lvl2',num:2,emoji:'⚡',title:'Практика',subtitle:'Углубление',desc:'Техники продуктивности, эмоционального интеллекта, финансов',
      modules:[
        {id:'m2_1',emoji:'🎯',title:'Deep Work',desc:'Глубокая работа',
          lessons:[
            {title:'Что такое Deep Work',theory:'**90 мин блок ×3-4 = 10 часов обычной.**',practice:'1 блок 90 мин.'},
            {title:'Pomodoro',theory:'**25/5 ×4 = 1 цикл.**',practice:'4 помидора.'},
            {title:'Time-blocking',theory:'**Каждое дело в слот.**',practice:'Заблокируй завтра.'}
          ]},
        {id:'m2_2',emoji:'❤️',title:'Эмоциональный интеллект',desc:'EQ',
          lessons:[
            {title:'5 компонентов EQ',theory:'**Самосознание, саморегуляция, мотивация, эмпатия, соц.навыки.**',practice:'Дневник эмоций.'},
            {title:'Саморегуляция',theory:'**Пауза 6 секунд.**',practice:'Пауза в конфликте.'},
            {title:'Эмпатия',theory:'**Слушай, не советуй.**',practice:'1 активное слушание.'}
          ]},
        {id:'m2_3',emoji:'💰',title:'Финансы',desc:'Основа',
          lessons:[
            {title:'50/30/20',theory:'**50% нужды, 30% желания, 20% сбережения.**',practice:'Посчитай бюджет.'},
            {title:'Подушка',theory:'**3-6 месяцев расходов.**',practice:'Открой отдельный счёт.'},
            {title:'Инвестиции',theory:'**Индексные фонды, DCA, долгосрочно.**',practice:'Изучи 3 фонда.'}
          ]}
      ]},
    {id:'lvl3',num:3,emoji:'💎',title:'Мастерство',subtitle:'Продвинутый',desc:'Продвинутые техники, нейробиология, лидерство',
      modules:[
        {id:'m3_1',emoji:'🔬',title:'Нейробиология',desc:'Как работает мозг',
          lessons:[
            {title:'Нейропластичность',theory:'**Мозг меняется всю жизнь.**',practice:'Учи 1 навык 30 дней.'},
            {title:'Дофамин',theory:'**Предвкушение, не награда.**',practice:'Дофаминовое голодание 4 ч.'},
            {title:'Сон и память',theory:'**Консолидация во сне.**',practice:'Учи перед сном.'}
          ]},
        {id:'m3_2',emoji:'👑',title:'Лидерство',desc:'Вести людей',
          lessons:[
            {title:'Level 5 Leadership',theory:'**Скромность + воля.**',practice:'Развивай 1 человека.'},
            {title:'Делегирование',theory:'**Не делай сам.**',practice:'Отдай 3 задачи.'},
            {title:'SBI-фидбэк',theory:'**Situation-Behavior-Impact.**',practice:'Дай SBI 1 раз.'}
          ]},
        {id:'m3_3',emoji:'🌐',title:'Стратегия',desc:'Долгосрочное мышление',
          lessons:[
            {title:'Второй порядок',theory:'**А что потом? ×3.**',practice:'3 решения ×3 порядка.'},
            {title:'Инверсия',theory:'**Что мешает? Убери.**',practice:'Инверсия для 3 целей.'},
            {title:'Первые принципы',theory:'**До основы.**',practice:'Разбери 1 проблему.'}
          ]}
      ]},
    {id:'lvl4',num:4,emoji:'🏆',title:'Мастер',subtitle:'Эксперт',desc:'Сложные системы, менторство, наследие',
      modules:[
        {id:'m4_1',emoji:'🎓',title:'Менторство',desc:'Обучать других',
          lessons:[
            {title:'Как быть ментором',theory:'**Вопросы > советы.**',practice:'Найди менти.'},
            {title:'GROW-модель',theory:'**Goal-Reality-Options-Will.**',practice:'Проведи 1 сессию.'},
            {title:'Обучение других',theory:'**Если не можешь объяснить — не понял.**',practice:'Объясни 3 темы.'}
          ]},
        {id:'m4_2',emoji:'🌍',title:'Системное мышление',desc:'Видеть целое',
          lessons:[
            {title:'Системы vs цели',theory:'**Изменение системы = результат.**',practice:'Анализ 3 систем.'},
            {title:'Обратные связи',theory:'**Петли усиления и баланса.**',practice:'Найди 3 петли.'},
            {title:'Точки воздействия',theory:'**Максимальный эффект.**',practice:'1 точка в жизни.'}
          ]},
        {id:'m4_3',emoji:'🕊',title:'Смысл',desc:'Зачем всё это',
          lessons:[
            {title:'Икигай',theory:'**4 сферы.**',practice:'4 списка.'},
            {title:'Логотерапия',theory:'**3 источника смысла.**',practice:'Найди своё.'},
            {title:'Наследие',theory:'**Что оставишь?**',practice:'Эпитафия.'}
          ]}
      ]},
    {id:'lvl5',num:5,emoji:'🌟',title:'Легенда',subtitle:'Мастер жизни',desc:'Интеграция всего, мудрость, передача',
      modules:[
        {id:'m5_1',emoji:'🧘',title:'Мудрость',desc:'Глубина',
          lessons:[
            {title:'Стоицизм',theory:'**Дихотомия контроля.**',practice:'Вечером — что в моей власти.'},
            {title:'Memento Mori',theory:'**Помни о смерти.**',practice:'Пиши эпитафию.'},
            {title:'Присутствие',theory:'**Здесь и сейчас.**',practice:'10 мин тишины.'}
          ]},
        {id:'m5_2',emoji:'💫',title:'Интеграция',desc:'Всё вместе',
          lessons:[
            {title:'Баланс 10 доменов',theory:'**Все сферы важны.**',practice:'Оцени 10 доменов.'},
            {title:'Свой путь',theory:'**Уникальность.**',practice:'Опиши свой путь.'},
            {title:'Передача',theory:'**Учи других.**',practice:'Напиши гайд.'}
          ]},
        {id:'m5_3',emoji:'🚀',title:'Будущее',desc:'Что дальше',
          lessons:[
            {title:'Видение 10 лет',theory:'**Куда идёшь?**',practice:'Опиши 10 лет.'},
            {title:'Наследие',theory:'**Что после тебя?**',practice:'3 пункта наследия.'},
            {title:'Продолжение',theory:'**Путь бесконечен.**',practice:'План на год.'}
          ]}
      ]}
  ];
}

/* ============ ACHIEVEMENTS ============ */
if(typeof window.ACHIEVEMENTS==='undefined'||!Array.isArray(window.ACHIEVEMENTS)||!window.ACHIEVEMENTS.length){
  window.ACHIEVEMENTS=[
    {id:'first_task',icon:'✅',name:'Первая задача',check:function(s){return s.tasks.some(function(t){return t.status==='completed'})},progress:function(s){return s.tasks.filter(function(t){return t.status==='completed'}).length>0?1:0}},
    {id:'first_lesson',icon:'🎓',name:'Первый урок',check:function(s){return Object.keys(s.levelProgress||{}).length>=1},progress:function(s){return Math.min(1,Object.keys(s.levelProgress||{}).length)}},
    {id:'first_skill',icon:'💎',name:'Первый навык',check:function(s){return Object.keys(s.skillsProgress||{}).length>=1},progress:function(s){return Math.min(1,Object.keys(s.skillsProgress||{}).length)}},
    {id:'first_water',icon:'💧',name:'Первая вода',check:function(s){return (s.customWater||[]).some(function(w){return w.count>=1})},progress:function(s){return s.customWater&&s.customWater.length>0?1:0}},
    {id:'first_mood',icon:'💭',name:'Первое настроение',check:function(s){return (s.customMood||[]).length>=1},progress:function(s){return Math.min(1,(s.customMood||[]).length)}},
    {id:'tasks_10',icon:'🔥',name:'10 задач',check:function(s){return s.tasks.filter(function(t){return t.status==='completed'}).length>=10},progress:function(s){return Math.min(1,s.tasks.filter(function(t){return t.status==='completed'}).length/10)}},
    {id:'tasks_50',icon:'⚡',name:'50 задач',check:function(s){return s.tasks.filter(function(t){return t.status==='completed'}).length>=50},progress:function(s){return Math.min(1,s.tasks.filter(function(t){return t.status==='completed'}).length/50)}},
    {id:'tasks_100',icon:'💯',name:'100 задач',check:function(s){return s.tasks.filter(function(t){return t.status==='completed'}).length>=100},progress:function(s){return Math.min(1,s.tasks.filter(function(t){return t.status==='completed'}).length/100)}},
    {id:'lessons_10',icon:'📚',name:'10 уроков',check:function(s){return Object.keys(s.levelProgress||{}).length>=10},progress:function(s){return Math.min(1,Object.keys(s.levelProgress||{}).length/10)}},
    {id:'lessons_50',icon:'📖',name:'50 уроков',check:function(s){return Object.keys(s.levelProgress||{}).length>=50},progress:function(s){return Math.min(1,Object.keys(s.levelProgress||{}).length/50)}},
    {id:'lessons_100',icon:'🎓',name:'100 уроков',check:function(s){return Object.keys(s.levelProgress||{}).length>=100},progress:function(s){return Math.min(1,Object.keys(s.levelProgress||{}).length/100)}},
    {id:'skills_10',icon:'💎',name:'10 навыков',check:function(s){return Object.keys(s.skillsProgress||{}).length>=10},progress:function(s){return Math.min(1,Object.keys(s.skillsProgress||{}).length/10)}},
    {id:'skills_30',icon:'👑',name:'30 навыков',check:function(s){return Object.keys(s.skillsProgress||{}).length>=30},progress:function(s){return Math.min(1,Object.keys(s.skillsProgress||{}).length/30)}},
    {id:'english_10',icon:'🇬🇧',name:'10 English',check:function(s){return Object.keys(s.englishProgress||{}).length>=10},progress:function(s){return Math.min(1,Object.keys(s.englishProgress||{}).length/10)}},
    {id:'streak_3',icon:'🔥',name:'3 дня streak',check:function(s){return (s.stats.streak||0)>=3},progress:function(s){return Math.min(1,(s.stats.streak||0)/3)}},
    {id:'streak_7',icon:'🔥',name:'7 дней streak',check:function(s){return (s.stats.streak||0)>=7},progress:function(s){return Math.min(1,(s.stats.streak||0)/7)}},
    {id:'streak_30',icon:'🔥',name:'30 дней streak',check:function(s){return (s.stats.streak||0)>=30},progress:function(s){return Math.min(1,(s.stats.streak||0)/30)}},
    {id:'streak_100',icon:'🔥',name:'100 дней streak',check:function(s){return (s.stats.streak||0)>=100},progress:function(s){return Math.min(1,(s.stats.streak||0)/100)}},
    {id:'water_100',icon:'💧',name:'100 стаканов',check:function(s){return (s.stats.totalWater||0)>=100},progress:function(s){return Math.min(1,(s.stats.totalWater||0)/100)}},
    {id:'water_500',icon:'🌊',name:'500 стаканов',check:function(s){return (s.stats.totalWater||0)>=500},progress:function(s){return Math.min(1,(s.stats.totalWater||0)/500)}},
    {id:'mood_30',icon:'💭',name:'30 настроений',check:function(s){return (s.stats.totalMoodLogs||0)>=30},progress:function(s){return Math.min(1,(s.stats.totalMoodLogs||0)/30)}},
    {id:'workout_10',icon:'🏋️',name:'10 тренировок',check:function(s){return (s.customWorkouts||[]).length>=10},progress:function(s){return Math.min(1,(s.customWorkouts||[]).length/10)}},
    {id:'meditation_10',icon:'🧘',name:'10 медитаций',check:function(s){return (s.customMeditation||[]).length>=10},progress:function(s){return Math.min(1,(s.customMeditation||[]).length/10)}},
    {id:'timer_10',icon:'⏱',name:'10 таймеров',check:function(s){return (s.timerSessions||[]).length>=10},progress:function(s){return Math.min(1,(s.timerSessions||[]).length/10)}},
    {id:'focus_10',icon:'🎯',name:'10 фокусов',check:function(s){return (s.focusSessions||[]).length>=10},progress:function(s){return Math.min(1,(s.focusSessions||[]).length/10)}},
    {id:'detox_7',icon:'📱',name:'7 дней детокса',check:function(s){return Object.keys(s.detoxCourseProgress||{}).length>=7},progress:function(s){return Math.min(1,Object.keys(s.detoxCourseProgress||{}).length/7)}},
    {id:'detox_30',icon:'🏆',name:'30 дней детокса',check:function(s){return Object.keys(s.detoxCourseProgress||{}).length>=30},progress:function(s){return Math.min(1,Object.keys(s.detoxCourseProgress||{}).length/30)}},
    {id:'xp_100',icon:'⭐',name:'100 XP',check:function(s){return (s.xp||0)>=100},progress:function(s){return Math.min(1,(s.xp||0)/100)}},
    {id:'xp_1000',icon:'🌟',name:'1000 XP',check:function(s){return (s.xp||0)>=1000},progress:function(s){return Math.min(1,(s.xp||0)/1000)}},
    {id:'xp_10000',icon:'✨',name:'10000 XP',check:function(s){return (s.xp||0)>=10000},progress:function(s){return Math.min(1,(s.xp||0)/10000)}},
    {id:'level_5',icon:'🏅',name:'Уровень 5',check:function(s){return Math.floor((s.xp||0)/100)>=5},progress:function(s){return Math.min(1,Math.floor((s.xp||0)/100)/5)}},
    {id:'level_10',icon:'👑',name:'Уровень 10',check:function(s){return Math.floor((s.xp||0)/100)>=10},progress:function(s){return Math.min(1,Math.floor((s.xp||0)/100)/10)}},
    {id:'survey_done',icon:'📋',name:'Опрос пройден',check:function(s){return s.profile.surveyDone},progress:function(s){return s.profile.surveyDone?1:0}},
    {id:'all_domains',icon:'🌐',name:'Все домены',check:function(s){var t=s.domainScores&&s.domainScores[new Date().toISOString().slice(0,10)]||{};return Object.keys(t).length>=10},progress:function(s){var t=s.domainScores&&s.domainScores[new Date().toISOString().slice(0,10)]||{};return Math.min(1,Object.keys(t).length/10)}}
  ];
}

/* Fallback */
if(typeof window.COURSES_LIBRARY==='undefined')window.COURSES_LIBRARY=[];
if(typeof window.PATHS_LIBRARY==='undefined')window.PATHS_LIBRARY=[];
if(typeof window.METHODS_LIBRARY==='undefined')window.METHODS_LIBRARY=[];

/* ============ ФИКС ЭФФЕКТОВ ============ */
(function(){
  var origStart=window.startEffects;
  window.startEffects=function(){
    try{if(typeof origStart==='function')origStart()}catch(e){}
    setTimeout(function(){
      var overlay=document.getElementById('themeEffect');
      if(!overlay)return;
      if(overlay.children.length===0){
        for(var i=0;i<60;i++){
          var s=document.createElement('div');
          s.className='effect-star';
          s.style.left=Math.random()*100+'%';
          s.style.top=Math.random()*100+'%';
          s.style.animationDelay=Math.random()*3+'s';
          overlay.appendChild(s);
        }
      }
    },100);
  };
})();

/* Лог */
setTimeout(function(){
  console.log('[CONTENT FIX] LEARNING_LEVELS:',(window.LEARNING_LEVELS||[]).length);
  console.log('[CONTENT FIX] ACHIEVEMENTS:',(window.ACHIEVEMENTS||[]).length);
  console.log('[CONTENT FIX] COURSES_LIBRARY:',(window.COURSES_LIBRARY||[]).length);
  console.log('[CONTENT FIX] PATHS_LIBRARY:',(window.PATHS_LIBRARY||[]).length);
  console.log('[CONTENT FIX] METHODS_LIBRARY:',(window.METHODS_LIBRARY||[]).length);
},500);