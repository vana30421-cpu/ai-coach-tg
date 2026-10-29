'use strict';
/* ============================================================
   LIFE OS — CONTENT2.js v1
   ЧАСТЬ 1/4: ПРИВЫЧКИ — шаблоны, категории, 66 дней, расписание, микро-цели
   ============================================================ */

/* ============ КАТЕГОРИИ ПРИВЫЧЕК ============ */
var HABIT_CATEGORIES = [
  {id:'health',      emoji:'💪', name:'Здоровье',      color:'#3ddc97', desc:'Тело, сон, питание, движение'},
  {id:'mind',        emoji:'🧠', name:'Разум',         color:'#4dd4ff', desc:'Мышление, обучение, фокус'},
  {id:'emotion',     emoji:'❤️', name:'Эмоции',        color:'#ff6b6b', desc:'Стресс, настроение, отношения'},
  {id:'productivity',emoji:'⚡', name:'Продуктивность', color:'#ffa940', desc:'Время, задачи, дисциплина'},
  {id:'finance',     emoji:'💰', name:'Финансы',       color:'#ffcc4d', desc:'Бюджет, накопления, доход'},
  {id:'social',      emoji:'👥', name:'Социальное',    color:'#c4b5fd', desc:'Семья, друзья, связи'},
  {id:'spiritual',   emoji:'🕊', name:'Духовное',      color:'#b394ff', desc:'Смысл, ценности, практики'},
  {id:'digital',     emoji:'📱', name:'Цифровое',      color:'#ff88cc', desc:'Экран, детокс, данные'},
  {id:'home',        emoji:'🏠', name:'Быт',           color:'#a4e7ff', desc:'Порядок, среда, комфорт'},
  {id:'creative',    emoji:'🎨', name:'Творчество',    color:'#ff7ba9', desc:'Идеи, искусство, хобби'}
];

/* ============ 200+ ШАБЛОНОВ ПРИВЫЧЕК ============ */
/* Каждый шаблон:
   id, cat, emoji, title, desc,
   defaultType: 'daily' | 'weekly' | 'custom' | 'count'
   defaultTarget: число (для count) или null
   defaultDuration: 21 | 30 | 66 | 90 (дней)
   defaultTime: 'утро' | 'день' | 'вечер' | 'ночь' | null
   microGoals: массив коротких подцелей
   autoTrack: true/false (можно ли авто-трекать)
   integration: 'sleep' | 'screen' | 'water' | 'workout' | 'mood' | null
*/
var HABIT_TEMPLATES = [
  /* ===== ЗДОРОВЬЕ (30) ===== */
  {id:'h_sleep_7',    cat:'health', emoji:'😴', title:'Сон 7-9 часов',        desc:'Ложиться и вставать в одно время', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'ночь',  microGoals:['Ложиться до 23:00','Вставать до 7:00','Без телефона за час до сна'], autoTrack:true,  integration:'sleep'},
  {id:'h_water_8',    cat:'health', emoji:'💧', title:'8 стаканов воды',        desc:'Пить воду равномерно в течение дня', defaultType:'count',   defaultTarget:8,   defaultDuration:66, defaultTime:'день',  microGoals:['Стакан утром','Стакан перед едой','Стакан после тренировки'], autoTrack:true,  integration:'water'},
  {id:'h_walk_30',    cat:'health', emoji:'🚶', title:'Прогулка 30 минут',      desc:'Ежедневная ходьба на свежем воздухе', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['10 минут','20 минут','30 минут'], autoTrack:false, integration:null},
  {id:'h_cardio_150', cat:'health', emoji:'🏃', title:'Кардио 150 мин/нед',     desc:'Бег, велосипед, плавание, танцы', defaultType:'weekly',  defaultTarget:150,  defaultDuration:66, defaultTime:null,    microGoals:['30 мин ×3','45 мин ×3','60 мин ×2'], autoTrack:true,  integration:'workout'},
  {id:'h_strength_3', cat:'health', emoji:'🏋️', title:'Силовая 3×/нед',        desc:'Присед, жим, тяга, подтягивания', defaultType:'weekly',  defaultTarget:3,    defaultDuration:66, defaultTime:null,    microGoals:['1 тренировка','2 тренировки','3 тренировки'], autoTrack:true,  integration:'workout'},
  {id:'h_stretch_10', cat:'health', emoji:'🧘', title:'Растяжка 10 минут',      desc:'Утром или после тренировки', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'утро',  microGoals:['5 минут','10 минут','15 минут'], autoTrack:false, integration:null},
  {id:'h_veg_500',    cat:'health', emoji:'🥗', title:'500 г овощей/фруктов',  desc:'Пять порций в день', defaultType:'count',   defaultTarget:5,   defaultDuration:66, defaultTime:'день',  microGoals:['1 порция','3 порции','5 порций'], autoTrack:false, integration:null},
  {id:'h_protein',    cat:'health', emoji:'🍗', title:'Белок 1.6 г/кг',        desc:'Мясо, рыба, яйца, бобовые', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['Завтрак с белком','Обед с белком','Ужин с белком'], autoTrack:false, integration:null},
  {id:'h_no_sugar',   cat:'health', emoji:'🚫', title:'Без сахара',            desc:'Никаких сладостей и напитков с сахаром', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['День без','3 дня без','7 дней без'], autoTrack:false, integration:null},
  {id:'h_no_fastfood',cat:'health', emoji:'🍔', title:'Без фастфуда',          desc:'Никакой еды из сетей быстрого питания', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 день','3 дня','7 дней'], autoTrack:false, integration:null},
  {id:'h_cold_shower',cat:'health', emoji:'❄️', title:'Холодный душ',          desc:'2 минуты холодной воды', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'утро',  microGoals:['30 сек','1 мин','2 мин'], autoTrack:false, integration:null},
  {id:'h_brush_2',    cat:'health', emoji:'🦷', title:'Чистить зубы 2×/день',  desc:'Утром и перед сном', defaultType:'count',   defaultTarget:2,   defaultDuration:66, defaultTime:null,    microGoals:['1 раз','2 раза'], autoTrack:false, integration:null},
  {id:'h_floss',      cat:'health', emoji:'🧵', title:'Зубная нить',           desc:'Раз в день перед сном', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'вечер', microGoals:['1 день','7 дней','30 дней'], autoTrack:false, integration:null},
  {id:'h_sunscreen',  cat:'health', emoji:'☀️', title:'Солнцезащитный крем',   desc:'SPF 30+ перед выходом', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'утро',  microGoals:['Лицо','Шея','Руки'], autoTrack:false, integration:null},
  {id:'h_posture',    cat:'health', emoji:'🧍', title:'Осанка',                desc:'Следить за спиной в течение дня', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['Утро','День','Вечер'], autoTrack:false, integration:null},
  {id:'h_eye_gym',    cat:'health', emoji:'👁', title:'Гимнастика для глаз',   desc:'5 упражнений утром и вечером', defaultType:'count',   defaultTarget:2,   defaultDuration:66, defaultTime:'день',  microGoals:['Утром','Вечером'], autoTrack:false, integration:null},
  {id:'h_20_20_20',   cat:'health', emoji:'👁', title:'Правило 20-20-20',      desc:'Каждые 20 мин смотреть 20 сек на 6 м', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['Утро','День','Вечер'], autoTrack:false, integration:null},
  {id:'h_no_phone_bed',cat:'health',emoji:'📵', title:'Телефон вне спальни',   desc:'Зарядка в другой комнате', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'ночь',  microGoals:['1 ночь','7 ночей','30 ночей'], autoTrack:false, integration:'screen'},
  {id:'h_sleep_early',cat:'health', emoji:'🌙', title:'Сон до 23:00',          desc:'Ложиться спать до 23:00', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'ночь',  microGoals:['1 день','7 дней','30 дней'], autoTrack:true,  integration:'sleep'},
  {id:'h_morning_light',cat:'health',emoji:'🌅',title:'Утренний свет',         desc:'10 минут солнца утром', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'утро',  microGoals:['5 мин','10 мин','15 мин'], autoTrack:false, integration:null},
  {id:'h_no_coffee_after',cat:'health',emoji:'☕',title:'Кофе до 14:00',       desc:'Никакого кофеина после обеда', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 день','7 дней','30 дней'], autoTrack:false, integration:null},
  {id:'h_breakfast',  cat:'health', emoji:'🍳', title:'Завтрак',               desc:'Полноценный завтрак каждый день', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'утро',  microGoals:['1 день','7 дней','30 дней'], autoTrack:false, integration:null},
  {id:'h_no_late_eat',cat:'health', emoji:'🌙', title:'Не есть после 20:00',   desc:'Последний приём пищи до 20:00', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'вечер', microGoals:['1 день','7 дней','30 дней'], autoTrack:false, integration:null},
  {id:'h_vitamins',   cat:'health', emoji:'💊', title:'Витамины',              desc:'D3, омега-3, магний', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'утро',  microGoals:['1 день','7 дней','30 дней'], autoTrack:false, integration:null},
  {id:'h_massage',    cat:'health', emoji:'💆', title:'Массаж/самомассаж',     desc:'10 минут для тела', defaultType:'weekly',  defaultTarget:2,    defaultDuration:66, defaultTime:'вечер', microGoals:['1 раз','2 раза','3 раза'], autoTrack:false, integration:null},
  {id:'h_sauna',      cat:'health', emoji:'🧖', title:'Сауна/баня',            desc:'Раз в неделю', defaultType:'weekly',  defaultTarget:1,    defaultDuration:66, defaultTime:'вечер', microGoals:['1 раз/нед','2 раза/нед'], autoTrack:false, integration:null},
  {id:'h_swim',       cat:'health', emoji:'🏊', title:'Плавание',              desc:'Раз в неделю', defaultType:'weekly',  defaultTarget:1,    defaultDuration:66, defaultTime:null,    microGoals:['1 раз/нед','2 раза/нед'], autoTrack:false, integration:null},
  {id:'h_bike',       cat:'health', emoji:'🚴', title:'Велосипед',             desc:'Прогулки на велосипеде', defaultType:'weekly',  defaultTarget:2,    defaultDuration:66, defaultTime:null,    microGoals:['1 раз/нед','2 раза/нед','3 раза/нед'], autoTrack:false, integration:null},
  {id:'h_yoga',       cat:'health', emoji:'🧘', title:'Йога',                  desc:'Утром или вечером', defaultType:'weekly',  defaultTarget:3,    defaultDuration:66, defaultTime:null,    microGoals:['1 раз/нед','3 раза/нед','5 раз/нед'], autoTrack:false, integration:null},
  {id:'h_posture_check',cat:'health',emoji:'🧍', title:'Проверка осанки',      desc:'Каждый час проверять спину', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['Утро','День','Вечер'], autoTrack:false, integration:null},

  /* ===== РАЗУМ (25) ===== */
  {id:'h_read_20',    cat:'mind',   emoji:'📖', title:'Чтение 20 минут',       desc:'Книга, статья, учебник', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'вечер', microGoals:['10 мин','20 мин','30 мин'], autoTrack:false, integration:null},
  {id:'h_meditation_10',cat:'mind', emoji:'🧘', title:'Медитация 10 минут',    desc:'Утром или перед сном', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'утро',  microGoals:['5 мин','10 мин','15 мин'], autoTrack:false, integration:null},
  {id:'h_journal',    cat:'mind',   emoji:'📓', title:'Дневник вечером',       desc:'3 победы + 1 урок', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'вечер', microGoals:['1 запись','7 записей','30 записей'], autoTrack:false, integration:null},
  {id:'h_gratitude_3',cat:'mind',   emoji:'🙏', title:'3 благодарности',       desc:'Утром или вечером', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'вечер', microGoals:['1','2','3'], autoTrack:false, integration:null},
  {id:'h_deep_work_90',cat:'mind',  emoji:'🎯', title:'Deep Work 90 минут',    desc:'Одна задача без отвлечений', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'утро',  microGoals:['30 мин','60 мин','90 мин'], autoTrack:false, integration:null},
  {id:'h_learn_lang', cat:'mind',   emoji:'🇬🇧', title:'Английский 15 минут',  desc:'Anki, Duolingo, урок', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['5 мин','15 мин','30 мин'], autoTrack:false, integration:null},
  {id:'h_puzzle',     cat:'mind',   emoji:'🧩', title:'Головоломка',           desc:'Судоку, кроссворд, N-back', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1','2','3'], autoTrack:false, integration:null},
  {id:'h_speed_read', cat:'mind',   emoji:'📚', title:'Скорочтение 15 мин',    desc:'Тренировка скорости чтения', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['5 мин','10 мин','15 мин'], autoTrack:false, integration:null},
  {id:'h_memory',     cat:'mind',   emoji:'🧠', title:'Тренировка памяти',     desc:'Дворец памяти, Anki', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['5 мин','10 мин','15 мин'], autoTrack:false, integration:null},
  {id:'h_logic',      cat:'mind',   emoji:'🎲', title:'Логика',                desc:'Задачи на логику, шахматы', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 задача','3 задачи','5 задач'], autoTrack:false, integration:null},
  {id:'h_focus_25',   cat:'mind',   emoji:'🍅', title:'Помодоро 4×25',         desc:'4 помидора в день', defaultType:'count',   defaultTarget:4,   defaultDuration:66, defaultTime:'день',  microGoals:['1','2','4'], autoTrack:false, integration:null},
  {id:'h_note_ideas', cat:'mind',   emoji:'💡', title:'Записывать идеи',       desc:'Все идеи в заметки', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 идея','3 идеи','5 идей'], autoTrack:false, integration:null},
  {id:'h_review_week',cat:'mind',   emoji:'📊', title:'Ревью недели',          desc:'Воскресенье, 30 минут', defaultType:'weekly',  defaultTarget:1,    defaultDuration:66, defaultTime:'вечер', microGoals:['Ревью','План','Цели'], autoTrack:false, integration:null},
  {id:'h_review_month',cat:'mind',  emoji:'📈', title:'Ревью месяца',          desc:'1-е число каждого месяца', defaultType:'custom',  defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['Итоги','Уроки','План'], autoTrack:false, integration:null},
  {id:'h_plan_day',   cat:'mind',   emoji:'📝', title:'Планировать день',      desc:'Утром 5 минут', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'утро',  microGoals:['3 задачи','5 задач','7 задач'], autoTrack:false, integration:null},
  {id:'h_no_news',    cat:'mind',   emoji:'📰', title:'Без новостей',          desc:'Не читать новости', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 день','7 дней','30 дней'], autoTrack:false, integration:null},
  {id:'h_chess',      cat:'mind',   emoji:'♟',  title:'Шахматы',               desc:'1 партия в день', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 партия','3 партии','5 партий'], autoTrack:false, integration:null},
  {id:'h_typing',     cat:'mind',   emoji:'⌨️', title:'Слепая печать',         desc:'10 минут в день', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['5 мин','10 мин','15 мин'], autoTrack:false, integration:null},
  {id:'h_new_word',   cat:'mind',   emoji:'🔤', title:'10 новых слов',         desc:'Учить иностранные слова', defaultType:'count',   defaultTarget:10,  defaultDuration:66, defaultTime:'день',  microGoals:['3 слова','5 слов','10 слов'], autoTrack:false, integration:null},
  {id:'h_course',     cat:'mind',   emoji:'🎓', title:'Онлайн-курс',           desc:'30 минут в день', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['15 мин','30 мин','45 мин'], autoTrack:false, integration:null},
  {id:'h_podcast',    cat:'mind',   emoji:'🎧', title:'Подкаст',               desc:'1 эпизод в день', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 эпизод','2 эпизода'], autoTrack:false, integration:null},
  {id:'h_documentary',cat:'mind',   emoji:'🎬', title:'Документальный фильм',  desc:'2 в неделю', defaultType:'weekly',  defaultTarget:2,    defaultDuration:66, defaultTime:'вечер', microGoals:['1','2','3'], autoTrack:false, integration:null},
  {id:'h_mindmap',    cat:'mind',   emoji:'🗺', title:'Ментальная карта',      desc:'1 в неделю по теме', defaultType:'weekly',  defaultTarget:1,    defaultDuration:66, defaultTime:'день',  microGoals:['1 карта','3 карты','5 карт'], autoTrack:false, integration:null},
  {id:'h_solve_1',    cat:'mind',   emoji:'🧮', title:'Решить 1 задачу',       desc:'Математика, физика, код', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1','3','5'], autoTrack:false, integration:null},
  {id:'h_write_500',  cat:'mind',   emoji:'✍️', title:'Писать 500 слов',       desc:'Блог, дневник, книга', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['100 слов','300 слов','500 слов'], autoTrack:false, integration:null},

  /* ===== ЭМОЦИИ (20) ===== */
  {id:'h_mood_log',   cat:'emotion',emoji:'💭', title:'Дневник настроения',    desc:'Оценить настроение 1-10', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'вечер', microGoals:['Утро','День','Вечер'], autoTrack:true,  integration:'mood'},
  {id:'h_no_shout',   cat:'emotion',emoji:'🤫', title:'Не повышать голос',     desc:'Говорить спокойно весь день', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 день','7 дней','30 дней'], autoTrack:false, integration:null},
  {id:'h_pause_6',    cat:'emotion',emoji:'⏸',  title:'Пауза 6 секунд',        desc:'Перед реакцией', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['3 раза','5 раз','10 раз'], autoTrack:false, integration:null},
  {id:'h_compliment', cat:'emotion',emoji:'💐', title:'Комплимент',            desc:'1 в день близкому', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1','2','3'], autoTrack:false, integration:null},
  {id:'h_hug',        cat:'emotion',emoji:'🤗', title:'Объятия 20 секунд',     desc:'С близким человеком', defaultType:'count',   defaultTarget:3,   defaultDuration:66, defaultTime:'день',  microGoals:['1','3','5'], autoTrack:false, integration:null},
  {id:'h_laugh',      cat:'emotion',emoji:'😂', title:'Смеяться',              desc:'10 минут юмора в день', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 раз','3 раза','5 раз'], autoTrack:false, integration:null},
  {id:'h_cry_ok',     cat:'emotion',emoji:'💧', title:'Разрешить эмоции',      desc:'Не подавлять чувства', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['Заметить','Прожить','Отпустить'], autoTrack:false, integration:null},
  {id:'h_therapy',    cat:'emotion',emoji:'🛋', title:'Терапия',               desc:'1 сессия в неделю', defaultType:'weekly',  defaultTarget:1,    defaultDuration:66, defaultTime:'день',  microGoals:['1 раз/нед','2 раза/нед'], autoTrack:false, integration:null},
  {id:'h_no_compare', cat:'emotion',emoji:'🚫', title:'Не сравнивать себя',    desc:'Только с собой вчерашним', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['Утро','День','Вечер'], autoTrack:false, integration:null},
  {id:'h_forgive',    cat:'emotion',emoji:'🕊', title:'Прощать',               desc:'Отпускать обиды', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'вечер', microGoals:['1 раз','3 раза','7 раз'], autoTrack:false, integration:null},
  {id:'h_accept',     cat:'emotion',emoji:'🧘', title:'Принимать',             desc:'Не бороться с тем, что нельзя изменить', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 раз','3 раза','5 раз'], autoTrack:false, integration:null},
  {id:'h_self_kind',  cat:'emotion',emoji:'💖', title:'Самосострадание',       desc:'Говорить себе доброе', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 раз','3 раза','5 раз'], autoTrack:false, integration:null},
  {id:'h_no_drama',   cat:'emotion',emoji:'🎭', title:'Без драмы',             desc:'Не раздувать проблемы', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 день','7 дней','30 дней'], autoTrack:false, integration:null},
  {id:'h_breath_478', cat:'emotion',emoji:'🌬', title:'Дыхание 4-7-8',         desc:'3 цикла при стрессе', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 цикл','3 цикла','5 циклов'], autoTrack:false, integration:null},
  {id:'h_body_scan',  cat:'emotion',emoji:'🧘', title:'Сканирование тела',     desc:'10 минут', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'вечер', microGoals:['5 мин','10 мин','15 мин'], autoTrack:false, integration:null},
  {id:'h_nature_1h',  cat:'emotion',emoji:'🌳', title:'Природа 1 час',         desc:'Прогулка в парке/лесу', defaultType:'weekly',  defaultTarget:3,    defaultDuration:66, defaultTime:'день',  microGoals:['1 раз','3 раза','5 раз'], autoTrack:false, integration:null},
  {id:'h_pet',        cat:'emotion',emoji:'🐾', title:'Время с питомцем',      desc:'15 минут игры', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['5 мин','15 мин','30 мин'], autoTrack:false, integration:null},
  {id:'h_music_calm', cat:'emotion',emoji:'🎵', title:'Спокойная музыка',      desc:'10 минут расслабления', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'вечер', microGoals:['5 мин','10 мин','15 мин'], autoTrack:false, integration:null},
  {id:'h_warm_bath',  cat:'emotion',emoji:'🛁', title:'Тёплая ванна',          desc:'2 раза в неделю', defaultType:'weekly',  defaultTarget:2,    defaultDuration:66, defaultTime:'вечер', microGoals:['1 раз','2 раза','3 раза'], autoTrack:false, integration:null},
  {id:'h_aroma',      cat:'emotion',emoji:'🕯', title:'Ароматерапия',          desc:'Свеча или диффузор', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'вечер', microGoals:['1 раз','2 раза'], autoTrack:false, integration:null},

  /* ===== ПРОДУКТИВНОСТЬ (25) ===== */
  {id:'h_morning_ritual',cat:'productivity',emoji:'🌅',title:'Утренний ритуал',desc:'30 минут для себя', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'утро',  microGoals:['10 мин','20 мин','30 мин'], autoTrack:false, integration:null},
  {id:'h_no_phone_morning',cat:'productivity',emoji:'📵',title:'Утро без телефона',desc:'Первые 30 минут', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'утро',  microGoals:['10 мин','20 мин','30 мин'], autoTrack:false, integration:'screen'},
  {id:'h_3_tasks',    cat:'productivity',emoji:'✅',title:'3 главные задачи',  desc:'Утром выбрать 3', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'утро',  microGoals:['1','2','3'], autoTrack:false, integration:null},
  {id:'h_eat_frog',   cat:'productivity',emoji:'🐸',title:'Съесть лягушку',    desc:'Самое сложное — первым', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'утро',  microGoals:['1','3','5'], autoTrack:false, integration:null},
  {id:'h_time_block', cat:'productivity',emoji:'📅',title:'Time-blocking',     desc:'Планировать каждый час', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'утро',  microGoals:['3 блока','5 блоков','7 блоков'], autoTrack:false, integration:null},
  {id:'h_no_multitask',cat:'productivity',emoji:'🎯',title:'Без многозадачности',desc:'Одно дело за раз', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 дело','3 дела','5 дел'], autoTrack:false, integration:null},
  {id:'h_inbox_zero', cat:'productivity',emoji:'📧',title:'Inbox Zero',        desc:'Разбирать входящие', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'вечер', microGoals:['Утро','День','Вечер'], autoTrack:false, integration:null},
  {id:'h_no_procrast',cat:'productivity',emoji:'⏳',title:'Не откладывать',    desc:'2-минутное правило', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 раз','3 раза','5 раз'], autoTrack:false, integration:null},
  {id:'h_review_day', cat:'productivity',emoji:'📊',title:'Ревью дня',         desc:'5 минут вечером', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'вечер', microGoals:['3 победы','1 урок','1 цель'], autoTrack:false, integration:null},
  {id:'h_no_social_work',cat:'productivity',emoji:'📵',title:'Без соцсетей на работе',desc:'Только по делу', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 час','3 часа','весь день'], autoTrack:false, integration:'screen'},
  {id:'h_2min_rule',  cat:'productivity',emoji:'⚡',title:'2-минутное правило',desc:'Делать сразу, если <2 мин', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['3 раза','5 раз','10 раз'], autoTrack:false, integration:null},
  {id:'h_single_tab', cat:'productivity',emoji:'🖥',title:'Одна вкладка',      desc:'Не открывать 100 вкладок', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 час','3 часа','весь день'], autoTrack:false, integration:null},
  {id:'h_daily_goal', cat:'productivity',emoji:'🎯',title:'1 главная цель дня',desc:'Фокус на одном', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'утро',  microGoals:['1','3','5'], autoTrack:false, integration:null},
  {id:'h_clear_desk', cat:'productivity',emoji:'🧹',title:'Убирать стол',      desc:'Перед сном', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'вечер', microGoals:['1 раз','2 раза','3 раза'], autoTrack:false, integration:null},
  {id:'h_no_email_morning',cat:'productivity',emoji:'📧',title:'Без почты утром',desc:'До 10:00', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'утро',  microGoals:['1 день','7 дней','30 дней'], autoTrack:false, integration:null},
  {id:'h_focus_music',cat:'productivity',emoji:'🎧',title:'Музыка для фокуса', desc:'Lo-fi, классика', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['30 мин','60 мин','90 мин'], autoTrack:false, integration:null},
  {id:'h_say_no',     cat:'productivity',emoji:'🚫',title:'Говорить "нет"',    desc:'Отказывать без вины', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 раз','3 раза','5 раз'], autoTrack:false, integration:null},
  {id:'h_delegate',   cat:'productivity',emoji:'🤝',title:'Делегировать',      desc:'1 задача в день', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1','2','3'], autoTrack:false, integration:null},
  {id:'h_no_meeting', cat:'productivity',emoji:'📵',title:'Без встреч',        desc:'1 день без созвонов', defaultType:'weekly',  defaultTarget:1,    defaultDuration:66, defaultTime:'день',  microGoals:['1 день/нед','2 дня/нед'], autoTrack:false, integration:null},
  {id:'h_ship_it',    cat:'productivity',emoji:'🚀',title:'Завершать',         desc:'Доводить до конца', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1','3','5'], autoTrack:false, integration:null},
  {id:'h_no_perfect', cat:'productivity',emoji:'✨',title:'Не идеально',       desc:'Лучше сделано, чем идеально', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1','3','5'], autoTrack:false, integration:null},
  {id:'h_5min_start', cat:'productivity',emoji:'▶️',title:'Начать с 5 минут',  desc:'Только 5 минут', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 раз','3 раза','5 раз'], autoTrack:false, integration:null},
  {id:'h_evening_ritual',cat:'productivity',emoji:'🌙',title:'Вечерний ритуал',desc:'30 минут перед сном', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'вечер', microGoals:['10 мин','20 мин','30 мин'], autoTrack:false, integration:null},
  {id:'h_no_work_weekend',cat:'productivity',emoji:'🏖',title:'Без работы в выходные',desc:'Только отдых', defaultType:'weekly',  defaultTarget:2,    defaultDuration:66, defaultTime:null,    microGoals:['1 день','2 дня'], autoTrack:false, integration:null},
  {id:'h_weekly_plan',cat:'productivity',emoji:'📋',title:'План на неделю',    desc:'В воскресенье', defaultType:'weekly',  defaultTarget:1,    defaultDuration:66, defaultTime:'вечер', microGoals:['1','2'], autoTrack:false, integration:null},

  /* ===== ФИНАНСЫ (15) ===== */
  {id:'h_track_spend',cat:'finance',emoji:'💰', title:'Учёт расходов',         desc:'Каждая трата', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'вечер', microGoals:['1','3','5'], autoTrack:false, integration:null},
  {id:'h_save_20',    cat:'finance',emoji:'🏦', title:'Откладывать 20%',       desc:'С каждого дохода', defaultType:'custom',  defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['10%','20%','30%'], autoTrack:false, integration:null},
  {id:'h_no_impulse', cat:'finance',emoji:'🚫', title:'Без импульсивных покупок',desc:'Не покупать спонтанно', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 день','7 дней','30 дней'], autoTrack:false, integration:null},
  {id:'h_review_budget',cat:'finance',emoji:'📊',title:'Ревью бюджета',        desc:'Раз в неделю', defaultType:'weekly',  defaultTarget:1,    defaultDuration:66, defaultTime:'вечер', microGoals:['1 раз/нед','2 раза/нед'], autoTrack:false, integration:null},
  {id:'h_no_coffee_out',cat:'finance',emoji:'☕', title:'Кофе дома',           desc:'Не покупать в кофейне', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'утро',  microGoals:['1 день','7 дней','30 дней'], autoTrack:false, integration:null},
  {id:'h_no_taxi',    cat:'finance',emoji:'🚕', title:'Без такси',             desc:'Транспорт или ходьба', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 день','7 дней','30 дней'], autoTrack:false, integration:null},
  {id:'h_cook_home',  cat:'finance',emoji:'🍳', title:'Готовить дома',         desc:'Без доставки', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1','2','3'], autoTrack:false, integration:null},
  {id:'h_no_shopping',cat:'finance',emoji:'🛍', title:'Без шопинга',           desc:'Не покупать одежду', defaultType:'weekly',  defaultTarget:7,    defaultDuration:66, defaultTime:'день',  microGoals:['1 день','7 дней','30 дней'], autoTrack:false, integration:null},
  {id:'h_invest',     cat:'finance',emoji:'📈', title:'Инвестировать',         desc:'Пополнять портфель', defaultType:'weekly',  defaultTarget:1,    defaultDuration:66, defaultTime:'день',  microGoals:['1 раз/нед','1 раз/мес'], autoTrack:false, integration:null},
  {id:'h_read_fin',   cat:'finance',emoji:'📚', title:'Финансовая литература', desc:'30 минут в день', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['10 мин','30 мин','60 мин'], autoTrack:false, integration:null},
  {id:'h_side_income',cat:'finance',emoji:'💼', title:'Доп. доход',            desc:'1 час в день', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['30 мин','1 час','2 часа'], autoTrack:false, integration:null},
  {id:'h_no_debt',    cat:'finance',emoji:'📉', title:'Без новых долгов',      desc:'Не брать кредиты', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 день','7 дней','30 дней'], autoTrack:false, integration:null},
  {id:'h_save_emergency',cat:'finance',emoji:'🚨',title:'Подушка безопасности',desc:'Откладывать на 3-6 мес', defaultType:'custom',  defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 мес','3 мес','6 мес'], autoTrack:false, integration:null},
  {id:'h_no_lottery', cat:'finance',emoji:'🎰', title:'Без лотерей',           desc:'Не играть в азартные', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 день','7 дней','30 дней'], autoTrack:false, integration:null},
  {id:'h_price_check',cat:'finance',emoji:'🏷', title:'Сравнивать цены',       desc:'Перед покупкой', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 раз','3 раза','5 раз'], autoTrack:false, integration:null},

  /* ===== СОЦИАЛЬНОЕ (20) ===== */
  {id:'h_call_family',cat:'social', emoji:'📞', title:'Звонить близким',       desc:'Родители, друзья', defaultType:'weekly',  defaultTarget:3,    defaultDuration:66, defaultTime:'вечер', microGoals:['1 раз/нед','3 раза/нед','7 раз/нед'], autoTrack:false, integration:null},
  {id:'h_meet_friend',cat:'social', emoji:'👥', title:'Встреча с друзьями',    desc:'Живое общение', defaultType:'weekly',  defaultTarget:1,    defaultDuration:66, defaultTime:'день',  microGoals:['1 раз/нед','2 раза/нед'], autoTrack:false, integration:null},
  {id:'h_listen_70',  cat:'social', emoji:'👂', title:'Слушать 70%',           desc:'Не перебивать', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 разговор','3 разговора','5 разговоров'], autoTrack:false, integration:null},
  {id:'h_compliment_someone',cat:'social',emoji:'💐',title:'Комплимент',       desc:'1 в день', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1','2','3'], autoTrack:false, integration:null},
  {id:'h_help_someone',cat:'social', emoji:'🤝', title:'Помочь кому-то',       desc:'Бескорыстно', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 раз','2 раза','3 раза'], autoTrack:false, integration:null},
  {id:'h_no_phone_dinner',cat:'social',emoji:'📵',title:'Без телефона за едой',desc:'С семьёй/друзьями', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 приём','2 приёма','3 приёма'], autoTrack:false, integration:'screen'},
  {id:'h_thank_you',  cat:'social', emoji:'🙏', title:'Говорить спасибо',      desc:'3 раза в день', defaultType:'count',   defaultTarget:3,   defaultDuration:66, defaultTime:'день',  microGoals:['1','2','3'], autoTrack:false, integration:null},
  {id:'h_surprise',   cat:'social', emoji:'🎁', title:'Сюрприз близким',       desc:'Раз в неделю', defaultType:'weekly',  defaultTarget:1,    defaultDuration:66, defaultTime:'день',  microGoals:['1 раз/нед','2 раза/нед'], autoTrack:false, integration:null},
  {id:'h_ask_question',cat:'social',emoji:'❓', title:'Задать вопрос',         desc:'Проявлять интерес', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1','3','5'], autoTrack:false, integration:null},
  {id:'h_eye_contact',cat:'social', emoji:'👁', title:'Смотреть в глаза',      desc:'При разговоре', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 разговор','3 разговора','5 разговоров'], autoTrack:false, integration:null},
  {id:'h_no_gossip',  cat:'social', emoji:'🤐', title:'Не сплетничать',        desc:'Не обсуждать других', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 день','7 дней','30 дней'], autoTrack:false, integration:null},
  {id:'h_new_person', cat:'social', emoji:'🆕', title:'Новое знакомство',      desc:'Раз в неделю', defaultType:'weekly',  defaultTarget:1,    defaultDuration:66, defaultTime:'день',  microGoals:['1 раз/нед','2 раза/нед'], autoTrack:false, integration:null},
  {id:'h_apologize',  cat:'social', emoji:'🙇', title:'Извиняться',            desc:'Признавать ошибки', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 раз','3 раза','5 раз'], autoTrack:false, integration:null},
  {id:'h_share',      cat:'social', emoji:'📤', title:'Делиться',              desc:'Чем-то полезным', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 раз','3 раза','5 раз'], autoTrack:false, integration:null},
  {id:'h_invite',     cat:'social', emoji:'📨', title:'Приглашать в гости',    desc:'Раз в месяц', defaultType:'custom',  defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 раз/мес','2 раза/мес'], autoTrack:false, integration:null},
  {id:'h_no_interrupt',cat:'social',emoji:'✋', title:'Не перебивать',         desc:'Дослушать до конца', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 разговор','3 разговора','5 разговоров'], autoTrack:false, integration:null},
  {id:'h_remember',   cat:'social', emoji:'🧠', title:'Помнить о важном',      desc:'Дни рождения, события', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1','2','3'], autoTrack:false, integration:null},
  {id:'h_quality_time',cat:'social',emoji:'⏰', title:'Качественное время',    desc:'С близкими', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'вечер', microGoals:['30 мин','1 час','2 часа'], autoTrack:false, integration:null},
  {id:'h_ask_help',   cat:'social', emoji:'🆘', title:'Просить о помощи',      desc:'Не стесняться', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 раз','3 раза','5 раз'], autoTrack:false, integration:null},
  {id:'h_network',    cat:'social', emoji:'🌐', title:'Нетворкинг',            desc:'Новые контакты', defaultType:'weekly',  defaultTarget:3,    defaultDuration:66, defaultTime:'день',  microGoals:['1 раз/нед','3 раза/нед','5 раз/нед'], autoTrack:false, integration:null},

  /* ===== ДУХОВНОЕ (15) ===== */
  {id:'h_pray',       cat:'spiritual',emoji:'🙏',title:'Молитва',             desc:'Утром и вечером', defaultType:'count',   defaultTarget:2,   defaultDuration:66, defaultTime:'день',  microGoals:['Утром','Вечером'], autoTrack:false, integration:null},
  {id:'h_read_scripture',cat:'spiritual',emoji:'📖',title:'Чтение писания',   desc:'15 минут в день', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'утро',  microGoals:['5 мин','15 мин','30 мин'], autoTrack:false, integration:null},
  {id:'h_silence_10', cat:'spiritual',emoji:'🤫',title:'10 минут тишины',    desc:'Без телефона, музыки', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['5 мин','10 мин','15 мин'], autoTrack:false, integration:null},
  {id:'h_ikigai',     cat:'spiritual',emoji:'🌅',title:'Икигай',              desc:'Думать о смысле', defaultType:'weekly',  defaultTarget:1,    defaultDuration:66, defaultTime:'день',  microGoals:['1 раз/нед','2 раза/нед'], autoTrack:false, integration:null},
  {id:'h_memento',    cat:'spiritual',emoji:'💀',title:'Memento Mori',        desc:'Помнить о конечности', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'утро',  microGoals:['Утро','Вечер'], autoTrack:false, integration:null},
  {id:'h_nature',     cat:'spiritual',emoji:'🌳',title:'Время на природе',    desc:'Без телефона', defaultType:'weekly',  defaultTarget:3,    defaultDuration:66, defaultTime:'день',  microGoals:['1 раз/нед','3 раза/нед','7 раз/нед'], autoTrack:false, integration:null},
  {id:'h_fast',       cat:'spiritual',emoji:'🍽',title:'Пост',                desc:'Раз в неделю', defaultType:'weekly',  defaultTarget:1,    defaultDuration:66, defaultTime:'день',  microGoals:['1 раз/нед','2 раза/нед'], autoTrack:false, integration:null},
  {id:'h_volunteer',  cat:'spiritual',emoji:'❤️',title:'Волонтёрство',        desc:'Помощь другим', defaultType:'monthly', defaultTarget:1,    defaultDuration:66, defaultTime:'день',  microGoals:['1 раз/мес','2 раза/мес'], autoTrack:false, integration:null},
  {id:'h_donate',     cat:'spiritual',emoji:'💝',title:'Донатить',            desc:'10% дохода', defaultType:'monthly', defaultTarget:1,    defaultDuration:66, defaultTime:'день',  microGoals:['1 раз/мес','2 раза/мес'], autoTrack:false, integration:null},
  {id:'h_meditate_deep',cat:'spiritual',emoji:'🧘',title:'Глубокая медитация',desc:'30 минут', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'утро',  microGoals:['10 мин','20 мин','30 мин'], autoTrack:false, integration:null},
  {id:'h_affirmation',cat:'spiritual',emoji:'✨',title:'Аффирмации',          desc:'Утром вслух', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'утро',  microGoals:['3','5','10'], autoTrack:false, integration:null},
  {id:'h_visualize',  cat:'spiritual',emoji:'🔮',title:'Визуализация',        desc:'5 минут в день', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'утро',  microGoals:['3 мин','5 мин','10 мин'], autoTrack:false, integration:null},
  {id:'h_forgive_deep',cat:'spiritual',emoji:'🕊',title:'Прощение',           desc:'Отпускать старые обиды', defaultType:'weekly',  defaultTarget:1,    defaultDuration:66, defaultTime:'вечер', microGoals:['1 раз/нед','2 раза/нед'], autoTrack:false, integration:null},
  {id:'h_ritual',     cat:'spiritual',emoji:'🕯',title:'Свой ритуал',         desc:'Утром или вечером', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 раз','2 раза'], autoTrack:false, integration:null},
  {id:'h_life_meaning',cat:'spiritual',emoji:'🧭',title:'Думать о смысле',    desc:'Раз в неделю', defaultType:'weekly',  defaultTarget:1,    defaultDuration:66, defaultTime:'вечер', microGoals:['1 раз/нед','2 раза/нед'], autoTrack:false, integration:null},

  /* ===== ЦИФРОВОЕ (15) ===== */
  {id:'h_screen_2h',  cat:'digital', emoji:'📱', title:'Экран < 2 часов',     desc:'Соцсети и развлечения', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['4 ч','3 ч','2 ч'], autoTrack:true,  integration:'screen'},
  {id:'h_no_phone_1h',cat:'digital', emoji:'📵', title:'1 час без телефона',  desc:'В любое время дня', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['30 мин','1 час','2 часа'], autoTrack:false, integration:'screen'},
  {id:'h_no_social',  cat:'digital', emoji:'🚫', title:'Без соцсетей',        desc:'Не заходить в ленту', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 час','3 часа','весь день'], autoTrack:true,  integration:'screen'},
  {id:'h_digital_detox',cat:'digital',emoji:'🧘',title:'Цифровой детокс',    desc:'1 день в неделю', defaultType:'weekly',  defaultTarget:1,    defaultDuration:66, defaultTime:'день',  microGoals:['1 день/нед','2 дня/нед'], autoTrack:false, integration:'screen'},
  {id:'h_no_phone_eat',cat:'digital', emoji:'🍽', title:'Без телефона за едой',desc:'Все приёмы пищи', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 приём','2 приёма','3 приёма'], autoTrack:false, integration:'screen'},
  {id:'h_no_phone_toilet',cat:'digital',emoji:'🚽',title:'Без телефона в туалете',desc:'Только по делу', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 раз','3 раза','5 раз'], autoTrack:false, integration:'screen'},
  {id:'h_gray_scale', cat:'digital', emoji:'⚫', title:'Ч/б экран',           desc:'Оттенки серого', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 час','3 часа','весь день'], autoTrack:false, integration:'screen'},
  {id:'h_no_notif',   cat:'digital', emoji:'🔕', title:'Без уведомлений',     desc:'Только от людей', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 час','3 часа','весь день'], autoTrack:false, integration:'screen'},
  {id:'h_airplane',   cat:'digital', emoji:'✈️', title:'Авиарежим',           desc:'1 час в день', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['30 мин','1 час','2 часа'], autoTrack:false, integration:'screen'},
  {id:'h_unfollow',   cat:'digital', emoji:'🚪', title:'Отписаться',          desc:'От 1 канала в день', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1','3','5'], autoTrack:false, integration:null},
  {id:'h_no_shorts',  cat:'digital', emoji:'📹', title:'Без шортсов',         desc:'Не смотреть Reels/TikTok', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 час','3 часа','весь день'], autoTrack:true,  integration:'screen'},
  {id:'h_no_morning_phone',cat:'digital',emoji:'🌅',title:'Утро без телефона',desc:'Первый час', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'утро',  microGoals:['30 мин','1 час','2 часа'], autoTrack:false, integration:'screen'},
  {id:'h_no_night_phone',cat:'digital',emoji:'🌙',title:'Вечер без телефона',desc:'За час до сна', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'вечер', microGoals:['30 мин','1 час','2 часа'], autoTrack:false, integration:'screen'},
  {id:'h_off_notif_sleep',cat:'digital',emoji:'😴',title:'Отключать уведомления на ночь',desc:'С 21:00 до 7:00', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'ночь',  microGoals:['1 ночь','7 ночей','30 ночей'], autoTrack:false, integration:'screen'},
  {id:'h_check_time', cat:'digital', emoji:'⏱', title:'Проверять экранное время',desc:'Раз в день', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'вечер', microGoals:['1 раз','2 раза'], autoTrack:true,  integration:'screen'},

  /* ===== БЫТ (15) ===== */
  {id:'h_make_bed',   cat:'home',   emoji:'🛏', title:'Заправлять кровать',   desc:'Сразу после пробуждения', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'утро',  microGoals:['1 день','7 дней','30 дней'], autoTrack:false, integration:null},
  {id:'h_clean_15',   cat:'home',   emoji:'🧹', title:'Уборка 15 минут',      desc:'Каждый день', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'вечер', microGoals:['5 мин','15 мин','30 мин'], autoTrack:false, integration:null},
  {id:'h_dishes',     cat:'home',   emoji:'🍽', title:'Мыть посуду сразу',    desc:'Не оставлять на потом', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'вечер', microGoals:['1 день','7 дней','30 дней'], autoTrack:false, integration:null},
  {id:'h_laundry',    cat:'home',   emoji:'👕', title:'Стирка',               desc:'Раз в неделю', defaultType:'weekly',  defaultTarget:1,    defaultDuration:66, defaultTime:'день',  microGoals:['1 раз/нед','2 раза/нед'], autoTrack:false, integration:null},
  {id:'h_declutter',  cat:'home',   emoji:'📦', title:'Избавляться от лишнего',desc:'1 вещь в день', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1','3','5'], autoTrack:false, integration:null},
  {id:'h_plants',     cat:'home',   emoji:'🪴', title:'Поливать растения',    desc:'По расписанию', defaultType:'weekly',  defaultTarget:2,    defaultDuration:66, defaultTime:'день',  microGoals:['1 раз/нед','2 раза/нед'], autoTrack:false, integration:null},
  {id:'h_open_window',cat:'home',   emoji:'🪟', title:'Проветривать',         desc:'10 минут утром', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'утро',  microGoals:['5 мин','10 мин','15 мин'], autoTrack:false, integration:null},
  {id:'h_clean_desk', cat:'home',   emoji:'🖥', title:'Чистый рабочий стол',  desc:'Перед началом работы', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'утро',  microGoals:['1 раз','2 раза'], autoTrack:false, integration:null},
  {id:'h_no_clutter', cat:'home',   emoji:'✨', title:'Без хлама',            desc:'Всё на своих местах', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'вечер', microGoals:['1 раз','2 раза','3 раза'], autoTrack:false, integration:null},
  {id:'h_grocery',    cat:'home',   emoji:'🛒', title:'Список покупок',       desc:'Перед магазином', defaultType:'weekly',  defaultTarget:1,    defaultDuration:66, defaultTime:'день',  microGoals:['1 раз/нед','2 раза/нед'], autoTrack:false, integration:null},
  {id:'h_meal_prep',  cat:'home',   emoji:'🍱', title:'Готовить на неделю',   desc:'Воскресенье', defaultType:'weekly',  defaultTarget:1,    defaultDuration:66, defaultTime:'день',  microGoals:['1 раз/нед','2 раза/нед'], autoTrack:false, integration:null},
  {id:'h_trash',      cat:'home',   emoji:'🗑', title:'Выносить мусор',       desc:'Каждый день', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'вечер', microGoals:['1 раз','2 раза'], autoTrack:false, integration:null},
  {id:'h_clean_fridge',cat:'home',  emoji:'🧊', title:'Чистить холодильник',  desc:'Раз в неделю', defaultType:'weekly',  defaultTarget:1,    defaultDuration:66, defaultTime:'день',  microGoals:['1 раз/нед','2 раза/нед'], autoTrack:false, integration:null},
  {id:'h_wash_bed',   cat:'home',   emoji:'🛏', title:'Менять постель',       desc:'Раз в неделю', defaultType:'weekly',  defaultTarget:1,    defaultDuration:66, defaultTime:'день',  microGoals:['1 раз/нед','2 раза/нед'], autoTrack:false, integration:null},
  {id:'h_minimalism', cat:'home',   emoji:'🧘', title:'Минимализм',           desc:'1 вещь в день на выброс', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1','3','5'], autoTrack:false, integration:null},

  /* ===== ТВОРЧЕСТВО (15) ===== */
  {id:'h_draw_15',    cat:'creative',emoji:'✏️', title:'Рисовать 15 минут',   desc:'Скетч, дудл, набросок', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['5 мин','15 мин','30 мин'], autoTrack:false, integration:null},
  {id:'h_write_300',  cat:'creative',emoji:'✍️', title:'Писать 300 слов',     desc:'Блог, рассказ, дневник', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['100 слов','300 слов','500 слов'], autoTrack:false, integration:null},
  {id:'h_photo',      cat:'creative',emoji:'📷', title:'Фотографировать',     desc:'1 кадр в день', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['1 кадр','3 кадра','5 кадров'], autoTrack:false, integration:null},
  {id:'h_music_practice',cat:'creative',emoji:'🎸',title:'Играть на инструменте',desc:'15 минут в день', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['5 мин','15 мин','30 мин'], autoTrack:false, integration:null},
  {id:'h_sing',       cat:'creative',emoji:'🎤', title:'Петь',                desc:'5 минут в день', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['3 мин','5 мин','10 мин'], autoTrack:false, integration:null},
  {id:'h_dance',      cat:'creative',emoji:'💃', title:'Танцевать',           desc:'10 минут', defaultType:'daily',   defaultTarget:null, defaultDuration:66, defaultTime:'день',  microGoals:['5 мин','10 мин','15 мин'], autoTrack:false, integration:null},
  {id:'h_craft',      cat:'creative',emoji:'🧶', title:'Рукоделие',           desc:'Вязание, шитьё, оригами', defaultType:'weekly',  defaultTarget:3,    defaultDuration:66, defaultTime:'день',  microGoals:['1 раз/нед','3 раза/нед','7 раз/нед'], autoTrack:false, integration:null},
  {id:'h_cook_new',   cat:'creative',emoji:'🍳', title:'Новый рецепт',        desc:'Раз в неделю', defaultType:'weekly',  defaultTarget:1,    defaultDuration:66, defaultTime:'день',  microGoals:['1 раз/нед','2 раза/нед'], autoTrack:false, integration:null},
  {id:'h_blog',       cat:'creative',emoji:'📝', title:'Вести блог',          desc:'1 пост в неделю', defaultType:'weekly',  defaultTarget:1,    defaultDuration:66, defaultTime:'день',  microGoals:['1 пост/нед','2 поста/нед'], autoTrack:false, integration:null},
  {id:'h_video',      cat:'creative',emoji:'🎬', title:'Снимать видео',       desc:'1 в неделю', defaultType:'weekly',  defaultTarget:1,    defaultDuration:66, defaultTime:'день',  microGoals:['1 видео/нед','2 видео/нед'], autoTrack:false, integration:null},
  {id:'h_podcast_rec',cat:'creative',emoji:'🎙', title:'Записывать подкаст',  desc:'1 эпизод в неделю', defaultType:'weekly',  defaultTarget:1,    defaultDuration:66, defaultTime:'день',  microGoals:['1 эпизод/нед','2 эпизода/нед'], autoTrack:false, integration:null},
  {id:'h_poetry',     cat:'creative',emoji:'📜', title:'Поэзия',              desc:'1 стих в неделю', defaultType:'weekly',  defaultTarget:1,    defaultDuration:66, defaultTime:'день',  microGoals:['1 стих/нед','3 стиха/нед'], autoTrack:false, integration:null},
  {id:'h_idea',       cat:'creative',emoji:'💡', title:'Генерировать идеи',   desc:'10 идей в день', defaultType:'count',   defaultTarget:10,   defaultDuration:66, defaultTime:'день',  microGoals:['3 идеи','5 идей','10 идей'], autoTrack:false, integration:null},
  {id:'h_museum',     cat:'creative',emoji:'🏛', title:'Музей/выставка',      desc:'Раз в месяц', defaultType:'monthly', defaultTarget:1,    defaultDuration:66, defaultTime:'день',  microGoals:['1 раз/мес','2 раза/мес'], autoTrack:false, integration:null},
  {id:'h_theater',    cat:'creative',emoji:'🎭', title:'Театр/кино',          desc:'Раз в месяц', defaultType:'monthly', defaultTarget:1,    defaultDuration:66, defaultTime:'вечер', microGoals:['1 раз/мес','2 раза/мес'], autoTrack:false, integration:null}
];

/* ============ МИКРО-ЦЕЛИ (глобальные шаблоны) ============ */
var MICRO_GOALS_LIBRARY = {
  easy: [
    'Сделать 1 раз','Сделать 3 раза','Сделать 5 раз',
    '1 день','3 дня','7 дней',
    '5 минут','10 минут','15 минут',
    '1 страница','3 страницы','5 страниц'
  ],
  medium: [
    '1 неделя','2 недели','3 недели',
    '21 день','30 дней','45 дней',
    '30 минут','45 минут','60 минут',
    '1 глава','3 главы','5 глав'
  ],
  hard: [
    '66 дней','90 дней',
    '2 часа','3 часа','4 часа',
    '1 книга','2 книги','3 книги',
    '1 месяц','3 месяца','6 месяцев'
  ]
};

/* ============ ТИПЫ РАСПИСАНИЯ ============ */
var HABIT_SCHEDULE_TYPES = [
  {id:'daily',   name:'Ежедневно',       emoji:'📅', desc:'Каждый день'},
  {id:'weekly',  name:'Еженедельно',     emoji:'📆', desc:'N раз в неделю'},
  {id:'custom',  name:'Свой график',     emoji:'⚙️', desc:'Выбрать дни недели'},
  {id:'count',   name:'N раз в день',    emoji:'🔢', desc:'Счётчик в течение дня'}
];

/* ============ ДНИ НЕДЕЛИ ============ */
var WEEK_DAYS = [
  {id:1, short:'Пн', full:'Понедельник'},
  {id:2, short:'Вт', full:'Вторник'},
  {id:3, short:'Ср', full:'Среда'},
  {id:4, short:'Чт', full:'Четверг'},
  {id:5, short:'Пт', full:'Пятница'},
  {id:6, short:'Сб', full:'Суббота'},
  {id:7, short:'Вс', full:'Воскресенье'}
];

/* ============ ДЛИТЕЛЬНОСТЬ ФОРМИРОВАНИЯ ============ */
var HABIT_DURATIONS = [
  {id:21,  name:'21 день',  emoji:'🌱', desc:'Быстрый старт'},
  {id:30,  name:'30 дней',  emoji:'🌿', desc:'Классика'},
  {id:66,  name:'66 дней',  emoji:'🌳', desc:'Научный стандарт (Lally 2010)'},
  {id:90,  name:'90 дней',  emoji:'🏆', desc:'Глубокая интеграция'},
  {id:180, name:'180 дней', emoji:'💎', desc:'Полгода — это уже ты'},
  {id:365, name:'365 дней', emoji:'👑', desc:'Год — новая жизнь'}
];

/* ============ ВРЕМЯ ДНЯ ============ */
var HABIT_TIME_SLOTS = [
  {id:'morning', name:'Утро',   emoji:'🌅', range:'05:00–12:00'},
  {id:'day',     name:'День',   emoji:'☀️', range:'12:00–18:00'},
  {id:'evening', name:'Вечер',  emoji:'🌆', range:'18:00–22:00'},
  {id:'night',   name:'Ночь',   emoji:'🌙', range:'22:00–05:00'},
  {id:'any',     name:'Любое',  emoji:'⏰', range:'В течение дня'}
];

/* ============ АВТО-ТРЕКИНГ ============ */
var HABIT_AUTO_TRACK = [
  {id:'sleep',    name:'Сон',      emoji:'😴', desc:'Авто из модуля сна'},
  {id:'screen',   name:'Экран',    emoji:'📱', desc:'Авто из трекера экрана'},
  {id:'water',    name:'Вода',     emoji:'💧', desc:'Авто из счётчика воды'},
  {id:'workout',  name:'Тренировка',emoji:'🏋️',desc:'Авто из журнала тренировок'},
  {id:'mood',     name:'Настроение',emoji:'💭',desc:'Авто из дневника настроения'},
  {id:'steps',    name:'Шаги',     emoji:'🚶', desc:'Авто из трекера шагов'},
  {id:'reading',  name:'Чтение',   emoji:'📖', desc:'Авто из трекера чтения'}
];

/* ============ ЭКСПОРТ ============ */
window.HABIT_CATEGORIES = HABIT_CATEGORIES;
window.HABIT_TEMPLATES = HABIT_TEMPLATES;
window.MICRO_GOALS_LIBRARY = MICRO_GOALS_LIBRARY;
window.HABIT_SCHEDULE_TYPES = HABIT_SCHEDULE_TYPES;
window.WEEK_DAYS = WEEK_DAYS;
window.HABIT_DURATIONS = HABIT_DURATIONS;
window.HABIT_TIME_SLOTS = HABIT_TIME_SLOTS;
window.HABIT_AUTO_TRACK = HABIT_AUTO_TRACK;

console.log('[CONTENT2 1/4 ✅] HABITS: categories='+HABIT_CATEGORIES.length+' templates='+HABIT_TEMPLATES.length+' scheduleTypes='+HABIT_SCHEDULE_TYPES.length+' durations='+HABIT_DURATIONS.length);
/* ============================================================
   LIFE OS — CONTENT2.js v1
   ЧАСТЬ 2/4: ТРЕНИРОВКА УМА + АНТИСТРЕСС + СОН
   ============================================================ */

/* ============ ТРЕНИРОВКА УМА — КАТЕГОРИИ ============ */
var BRAIN_CATEGORIES = [
  {id:'speed',   emoji:'⚡', name:'Скорость',  color:'#ffa940', desc:'Реакция, быстрота мышления, скорость обработки'},
  {id:'memory',  emoji:'🧠', name:'Память',    color:'#4dd4ff', desc:'Кратковременная, долговременная, рабочая'},
  {id:'logic',   emoji:'🎲', name:'Логика',    color:'#b394ff', desc:'Дедукция, индукция, абдукция, головоломки'},
  {id:'focus',   emoji:'🎯', name:'Фокус',     color:'#3ddc97', desc:'Концентрация, внимание, переключение'}
];

/* ============ ТРЕНИРОВКА УМА — 120+ ИГР И УПРАЖНЕНИЙ ============ */
/* Каждая:
   id, cat, emoji, title, desc,
   type: 'test' | 'game' | 'exercise',
   difficulty: 1-5,
   duration: секунды (примерно),
   scoring: 'points' | 'time' | 'accuracy',
   maxScore: число (для points) или null,
   levels: массив уровней сложности,
   science: короткое научное обоснование
*/
var BRAIN_TRAINING = [
  /* ===== СКОРОСТЬ (30) ===== */
  {id:'bt_speed_1', cat:'speed', emoji:'🎨', title:'Цвет-слово (Струп)', desc:'Назови цвет, а не слово', type:'test', difficulty:2, duration:60, scoring:'accuracy', maxScore:100, levels:[1,2,3,4,5], science:'Эффект Струпа: конфликт между автоматическим чтением и называнием цвета'},
  {id:'bt_speed_2', cat:'speed', emoji:'🔢', title:'Быстрый счёт', desc:'Складывай числа за 60 секунд', type:'test', difficulty:2, duration:60, scoring:'points', maxScore:50, levels:[1,2,3,4,5], science:'Тренирует скорость обработки'},
  {id:'bt_speed_3', cat:'speed', emoji:'🔤', title:'Анаграммы', desc:'Составь слово из букв', type:'test', difficulty:3, duration:60, scoring:'points', maxScore:30, levels:[1,2,3,4,5], science:'Скорость вербальной обработки'},
  {id:'bt_speed_4', cat:'speed', emoji:'⚡', title:'Реакция', desc:'Нажми, когда появится сигнал', type:'test', difficulty:1, duration:30, scoring:'time', maxScore:null, levels:[1,2,3], science:'Простое время реакции'},
  {id:'bt_speed_5', cat:'speed', emoji:'🔀', title:'Стрелки', desc:'Нажми в сторону стрелки', type:'test', difficulty:2, duration:60, scoring:'points', maxScore:60, levels:[1,2,3,4,5], science:'Скорость моторной реакции'},
  {id:'bt_speed_6', cat:'speed', emoji:'🔢', title:'Чёт-нечет', desc:'Определи чётность числа', type:'test', difficulty:1, duration:60, scoring:'points', maxScore:80, levels:[1,2,3,4], science:'Скорость числовой обработки'},
  {id:'bt_speed_7', cat:'speed', emoji:'🎯', title:'Ловля', desc:'Кликни по цели', type:'game', difficulty:2, duration:60, scoring:'points', maxScore:40, levels:[1,2,3,4,5], science:'Скорость зрительно-моторной координации'},
  {id:'bt_speed_8', cat:'speed', emoji:'🟢', title:'Светофор', desc:'Реагируй по правилам', type:'test', difficulty:3, duration:60, scoring:'accuracy', maxScore:100, levels:[1,2,3,4,5], science:'Скорость принятия решений'},
  {id:'bt_speed_9', cat:'speed', emoji:'🎵', title:'Ритм', desc:'Повтори ритм', type:'test', difficulty:3, duration:60, scoring:'accuracy', maxScore:100, levels:[1,2,3,4], science:'Слухо-моторная синхронизация'},
  {id:'bt_speed_10', cat:'speed', emoji:'🔤', title:'Первая буква', desc:'Назови первую букву слова', type:'test', difficulty:2, duration:60, scoring:'points', maxScore:60, levels:[1,2,3,4], science:'Скорость вербальной обработки'},
  {id:'bt_speed_11', cat:'speed', emoji:'🃏', title:'Карты', desc:'Быстро найди пару', type:'game', difficulty:2, duration:120, scoring:'time', maxScore:null, levels:[1,2,3,4,5], science:'Скорость зрительного поиска'},
  {id:'bt_speed_12', cat:'speed', emoji:'🔢', title:'Математика на скорость', desc:'Простые примеры', type:'test', difficulty:2, duration:60, scoring:'points', maxScore:60, levels:[1,2,3,4,5], science:'Скорость арифметики'},
  {id:'bt_speed_13', cat:'speed', emoji:'🎯', title:'Двойная задача', desc:'Два задания одновременно', type:'test', difficulty:4, duration:60, scoring:'accuracy', maxScore:100, levels:[1,2,3,4,5], science:'Скорость переключения'},
  {id:'bt_speed_14', cat:'speed', emoji:'🔀', title:'Цветные точки', desc:'Определи, сколько точек', type:'test', difficulty:2, duration:60, scoring:'points', maxScore:60, levels:[1,2,3,4], science:'Субтитайзинг (мгновенное восприятие количества)'},
  {id:'bt_speed_15', cat:'speed', emoji:'🅰️', title:'Буква-цифра', desc:'Определи, буква или цифра', type:'test', difficulty:2, duration:60, scoring:'points', maxScore:80, levels:[1,2,3,4], science:'Скорость категоризации'},
  {id:'bt_speed_16', cat:'speed', emoji:'🔊', title:'Звук-цвет', desc:'Соотнеси звук и цвет', type:'test', difficulty:3, duration:60, scoring:'accuracy', maxScore:100, levels:[1,2,3], science:'Кросс-модальная обработка'},
  {id:'bt_speed_17', cat:'speed', emoji:'⏱', title:'Оценка времени', desc:'Угадай, когда прошло N секунд', type:'test', difficulty:3, duration:60, scoring:'accuracy', maxScore:100, levels:[1,2,3,4], science:'Внутренние часы'},
  {id:'bt_speed_18', cat:'speed', emoji:'🖱', title:'Точность клика', desc:'Кликни точно по цели', type:'game', difficulty:2, duration:60, scoring:'accuracy', maxScore:100, levels:[1,2,3,4], science:'Точность моторики'},
  {id:'bt_speed_19', cat:'speed', emoji:'↔️', title:'Стоп-сигнал', desc:'Останови движение', type:'test', difficulty:4, duration:60, scoring:'accuracy', maxScore:100, levels:[1,2,3], science:'Тормозной контроль'},
  {id:'bt_speed_20', cat:'speed', emoji:'🔢', title:'Цепочка', desc:'Продолжи последовательность', type:'test', difficulty:4, duration:60, scoring:'points', maxScore:20, levels:[1,2,3,4,5], science:'Скорость логических выводов'},
  {id:'bt_speed_21', cat:'speed', emoji:'🎨', title:'Оттенки', desc:'Отличи оттенки', type:'test', difficulty:3, duration:60, scoring:'points', maxScore:30, levels:[1,2,3,4], science:'Цветовое различение'},
  {id:'bt_speed_22', cat:'speed', emoji:'👁', title:'Периферийное зрение', desc:'Заметь появление на периферии', type:'test', difficulty:4, duration:60, scoring:'accuracy', maxScore:100, levels:[1,2,3], science:'Периферическое внимание'},
  {id:'bt_speed_23', cat:'speed', emoji:'🔤', title:'Рифмы', desc:'Найди рифму', type:'test', difficulty:3, duration:60, scoring:'points', maxScore:30, levels:[1,2,3], science:'Вербальная беглость'},
  {id:'bt_speed_24', cat:'speed', emoji:'📝', title:'Ассоциации', desc:'Назови ассоциацию', type:'test', difficulty:2, duration:60, scoring:'points', maxScore:40, levels:[1,2,3], science:'Скорость семантической памяти'},
  {id:'bt_speed_25', cat:'speed', emoji:'🎯', title:'Смена правил', desc:'Правила меняются', type:'test', difficulty:5, duration:60, scoring:'accuracy', maxScore:100, levels:[1,2,3], science:'Когнитивная гибкость'},
  {id:'bt_speed_26', cat:'speed', emoji:'🏃', title:'Гонка', desc:'Обои соперника (AI)', type:'game', difficulty:3, duration:60, scoring:'points', maxScore:100, levels:[1,2,3,4,5], science:'Соревновательная мотивация'},
  {id:'bt_speed_27', cat:'speed', emoji:'⚡', title:'Молния', desc:'Быстрые ответы на вопросы', type:'test', difficulty:3, duration:60, scoring:'points', maxScore:50, levels:[1,2,3,4], science:'Скорость семантического доступа'},
  {id:'bt_speed_28', cat:'speed', emoji:'🎲', title:'Случайные числа', desc:'Сложи два числа', type:'test', difficulty:2, duration:60, scoring:'points', maxScore:50, levels:[1,2,3,4,5], science:'Арифметическая скорость'},
  {id:'bt_speed_29', cat:'speed', emoji:'🔄', title:'Обратный отсчёт', desc:'Считай от 100 по 7', type:'test', difficulty:4, duration:60, scoring:'points', maxScore:15, levels:[1,2,3], science:'Рабочая память + скорость'},
  {id:'bt_speed_30', cat:'speed', emoji:'🎯', title:'Мишень', desc:'Кликни по движущейся цели', type:'game', difficulty:4, duration:60, scoring:'points', maxScore:50, levels:[1,2,3,4,5], science:'Динамическая точность'},

  /* ===== ПАМЯТЬ (30) ===== */
  {id:'bt_mem_1', cat:'memory', emoji:'🔢', title:'Цифры', desc:'Запомни последовательность цифр', type:'test', difficulty:2, duration:120, scoring:'points', maxScore:30, levels:[1,2,3,4,5], science:'Цифровая память (digit span)'},
  {id:'bt_mem_2', cat:'memory', emoji:'🔤', title:'Слова', desc:'Запомни список слов', type:'test', difficulty:2, duration:120, scoring:'points', maxScore:30, levels:[1,2,3,4,5], science:'Вербальная память'},
  {id:'bt_mem_3', cat:'memory', emoji:'🎨', title:'Цвета', desc:'Запомни последовательность цветов', type:'test', difficulty:3, duration:120, scoring:'points', maxScore:20, levels:[1,2,3,4], science:'Визуальная память'},
  {id:'bt_mem_4', cat:'memory', emoji:'🃏', title:'Пары', desc:'Найди пары карт', type:'game', difficulty:2, duration:180, scoring:'time', maxScore:null, levels:[1,2,3,4,5], science:'Кратковременная зрительная память'},
  {id:'bt_mem_5', cat:'memory', emoji:'🎯', title:'Точки', desc:'Запомни расположение точек', type:'test', difficulty:3, duration:120, scoring:'points', maxScore:20, levels:[1,2,3,4], science:'Пространственная память'},
  {id:'bt_mem_6', cat:'memory', emoji:'🔊', title:'Звуки', desc:'Запомни последовательность звуков', type:'test', difficulty:3, duration:120, scoring:'points', maxScore:20, levels:[1,2,3], science:'Слуховая память'},
  {id:'bt_mem_7', cat:'memory', emoji:'📝', title:'Текст', desc:'Запомни текст и ответь на вопросы', type:'test', difficulty:4, duration:180, scoring:'accuracy', maxScore:100, levels:[1,2,3], science:'Смысловая память'},
  {id:'bt_mem_8', cat:'memory', emoji:'🖼', title:'Картинки', desc:'Запомни, что было на картинке', type:'test', difficulty:3, duration:120, scoring:'points', maxScore:20, levels:[1,2,3,4], science:'Иконическая память'},
  {id:'bt_mem_9', cat:'memory', emoji:'🔀', title:'Обратный порядок', desc:'Повтори в обратном порядке', type:'test', difficulty:4, duration:120, scoring:'points', maxScore:20, levels:[1,2,3,4], science:'Рабочая память'},
  {id:'bt_mem_10', cat:'memory', emoji:'🧩', title:'N-back', desc:'Сравни с предыдущим', type:'test', difficulty:5, duration:180, scoring:'accuracy', maxScore:100, levels:[1,2,3,4,5], science:'Рабочая память (n-back task)'},
  {id:'bt_mem_11', cat:'memory', emoji:'🎭', title:'Лица', desc:'Запомни лица', type:'test', difficulty:3, duration:120, scoring:'points', maxScore:20, levels:[1,2,3], science:'Память на лица'},
  {id:'bt_mem_12', cat:'memory', emoji:'📅', title:'Даты', desc:'Запомни даты', type:'test', difficulty:4, duration:120, scoring:'points', maxScore:20, levels:[1,2,3], science:'Ассоциативная память'},
  {id:'bt_mem_13', cat:'memory', emoji:'🔤', title:'Анаграммы-2', desc:'Запомни и восстанови', type:'test', difficulty:3, duration:120, scoring:'points', maxScore:20, levels:[1,2,3]},
  {id:'bt_mem_14', cat:'memory', emoji:'🏛', title:'Дворец памяти', desc:'Размести объекты в комнате', type:'exercise', difficulty:4, duration:180, scoring:'points', maxScore:30, levels:[1,2,3,4], science:'Метод локусов'},
  {id:'bt_mem_15', cat:'memory', emoji:'🔗', title:'Ассоциации', desc:'Свяжи слова', type:'exercise', difficulty:3, duration:120, scoring:'points', maxScore:20, levels:[1,2,3]},
  {id:'bt_mem_16', cat:'memory', emoji:'🎵', title:'Мелодии', desc:'Запомни мелодию', type:'test', difficulty:4, duration:120, scoring:'points', maxScore:15, levels:[1,2,3], science:'Музыкальная память'},
  {id:'bt_mem_17', cat:'memory', emoji:'🔢', title:'Матрица', desc:'Запомни матрицу чисел', type:'test', difficulty:4, duration:120, scoring:'points', maxScore:20, levels:[1,2,3,4], science:'Пространственно-числовая память'},
  {id:'bt_mem_18', cat:'memory', emoji:'📚', title:'Список дел', desc:'Запомни список задач', type:'test', difficulty:3, duration:120, scoring:'points', maxScore:20, levels:[1,2,3], science:'Проспективная память'},
  {id:'bt_mem_19', cat:'memory', emoji:'🎬', title:'Сцены', desc:'Запомни детали сцены', type:'test', difficulty:4, duration:120, scoring:'points', maxScore:20, levels:[1,2,3], science:'Эпизодическая память'},
  {id:'bt_mem_20', cat:'memory', emoji:'🔢', title:'Числа наоборот', desc:'Назови число наоборот', type:'test', difficulty:3, duration:120, scoring:'points', maxScore:20, levels:[1,2,3,4], science:'Рабочая память'},
  {id:'bt_mem_21', cat:'memory', emoji:'🎨', title:'Цвета-слова', desc:'Запомни цвет каждого слова', type:'test', difficulty:4, duration:120, scoring:'points', maxScore:20, levels:[1,2,3]},
  {id:'bt_mem_22', cat:'memory', emoji:'🔤', title:'Пары слов', desc:'Запомни пары', type:'test', difficulty:4, duration:120, scoring:'points', maxScore:20, levels:[1,2,3,4], science:'Ассоциативная память'},
  {id:'bt_mem_23', cat:'memory', emoji:'🎯', title:'Позиции', desc:'Запомни позиции на клавиатуре', type:'test', difficulty:4, duration:120, scoring:'points', maxScore:20, levels:[1,2,3], science:'Моторная память'},
  {id:'bt_mem_24', cat:'memory', emoji:'📖', title:'Story recall', desc:'Перескажи историю', type:'test', difficulty:4, duration:180, scoring:'accuracy', maxScore:100, levels:[1,2,3], science:'Нарративная память'},
  {id:'bt_mem_25', cat:'memory', emoji:'🔢', title:'Двойная задача', desc:'Запомни + считай', type:'test', difficulty:5, duration:120, scoring:'points', maxScore:20, levels:[1,2,3], science:'Рабочая память под нагрузкой'},
  {id:'bt_mem_26', cat:'memory', emoji:'📸', title:'Фотопамять', desc:'Запомни 20 деталей', type:'test', difficulty:4, duration:180, scoring:'points', maxScore:20, levels:[1,2,3], science:'Эйдетическая память'},
  {id:'bt_mem_27', cat:'memory', emoji:'🎼', title:'Ноты', desc:'Запомни последовательность нот', type:'test', difficulty:4, duration:120, scoring:'points', maxScore:15, levels:[1,2,3]},
  {id:'bt_mem_28', cat:'memory', emoji:'📝', title:'Стих', desc:'Запомни стих', type:'test', difficulty:4, duration:180, scoring:'points', maxScore:20, levels:[1,2,3], science:'Вербальная память'},
  {id:'bt_mem_29', cat:'memory', emoji:'🎭', title:'Эмоции', desc:'Запомни эмоции на лицах', type:'test', difficulty:4, duration:120, scoring:'points', maxScore:20, levels:[1,2,3], science:'Эмоциональная память'},
  {id:'bt_mem_30', cat:'memory', emoji:'🔗', title:'Цепочка', desc:'Свяжи 20 слов в историю', type:'exercise', difficulty:5, duration:180, scoring:'points', maxScore:20, levels:[1,2,3], science:'Мнемотехника «Цепочка»'},

  /* ===== ЛОГИКА (30) ===== */
  {id:'bt_log_1', cat:'logic', emoji:'🧩', title:'Судоку', desc:'Заполни поле 9×9', type:'game', difficulty:4, duration:600, scoring:'time', maxScore:null, levels:[1,2,3,4,5], science:'Логическое мышление'},
  {id:'bt_log_2', cat:'logic', emoji:'🎲', title:'Логические задачи', desc:'Реши задачу', type:'test', difficulty:3, duration:120, scoring:'accuracy', maxScore:100, levels:[1,2,3,4,5], science:'Дедуктивное мышление'},
  {id:'bt_log_3', cat:'logic', emoji:'🔢', title:'Последовательности', desc:'Продолжи ряд', type:'test', difficulty:3, duration:120, scoring:'points', maxScore:20, levels:[1,2,3,4,5], science:'Индуктивное мышление'},
  {id:'bt_log_4', cat:'logic', emoji:'⚖️', title:'Аналогии', desc:'Найди аналогию', type:'test', difficulty:3, duration:120, scoring:'points', maxScore:30, levels:[1,2,3,4], science:'Абдуктивное мышление'},
  {id:'bt_log_5', cat:'logic', emoji:'🔍', title:'Найди отличие', desc:'Найди отличия', type:'test', difficulty:2, duration:120, scoring:'points', maxScore:20, levels:[1,2,3,4], science:'Зрительное внимание'},
  {id:'bt_log_6', cat:'logic', emoji:'♟', title:'Шахматные задачи', desc:'Мат в 1 ход', type:'test', difficulty:4, duration:180, scoring:'accuracy', maxScore:100, levels:[1,2,3,4,5], science:'Стратегическое мышление'},
  {id:'bt_log_7', cat:'logic', emoji:'🎲', title:'Кубики', desc:'Какой кубик получится', type:'test', difficulty:4, duration:120, scoring:'points', maxScore:20, levels:[1,2,3], science:'Пространственное мышление'},
  {id:'bt_log_8', cat:'logic', emoji:'🧭', title:'Лабиринт', desc:'Найди выход', type:'game', difficulty:3, duration:180, scoring:'time', maxScore:null, levels:[1,2,3,4], science:'Пространственное планирование'},
  {id:'bt_log_9', cat:'logic', emoji:'🔢', title:'Магический квадрат', desc:'Заполни квадрат', type:'test', difficulty:4, duration:180, scoring:'points', maxScore:20, levels:[1,2,3], science:'Числовая логика'},
  {id:'bt_log_10', cat:'logic', emoji:'⚖️', title:'Взвешивание', desc:'Найди фальшивую монету', type:'test', difficulty:5, duration:180, scoring:'accuracy', maxScore:100, levels:[1,2,3], science:'Логическое рассуждение'},
  {id:'bt_log_11', cat:'logic', emoji:'🎭', title:'Рыцари и лжецы', desc:'Кто врёт?', type:'test', difficulty:5, duration:180, scoring:'accuracy', maxScore:100, levels:[1,2,3], science:'Логика высказываний'},
  {id:'bt_log_12', cat:'logic', emoji:'🧩', title:'Пазл', desc:'Собери картинку', type:'game', difficulty:3, duration:300, scoring:'time', maxScore:null, levels:[1,2,3,4], science:'Визуально-пространственное мышление'},
  {id:'bt_log_13', cat:'logic', emoji:'🎯', title:'Nonogram', desc:'Японский кроссворд', type:'game', difficulty:5, duration:600, scoring:'time', maxScore:null, levels:[1,2,3,4,5], science:'Логическое мышление'},
  {id:'bt_log_14', cat:'logic', emoji:'🔢', title:'Kakuro', desc:'Числовой кроссворд', type:'game', difficulty:5, duration:600, scoring:'time', maxScore:null, levels:[1,2,3,4], science:'Числовая логика'},
  {id:'bt_log_15', cat:'logic', emoji:'🃏', title:'Судоку-мини', desc:'Поле 4×4', type:'game', difficulty:2, duration:120, scoring:'time', maxScore:null, levels:[1,2,3], science:'Логика для начинающих'},
  {id:'bt_log_16', cat:'logic', emoji:'🎲', title:'Ханойская башня', desc:'Переложи диски', type:'game', difficulty:3, duration:180, scoring:'time', maxScore:null, levels:[1,2,3,4], science:'Алгоритмическое мышление'},
  {id:'bt_log_17', cat:'logic', emoji:'🧩', title:'Танграм', desc:'Собери фигуру', type:'game', difficulty:3, duration:180, scoring:'time', maxScore:null, levels:[1,2,3,4], science:'Геометрическое мышление'},
  {id:'bt_log_18', cat:'logic', emoji:'🔢', title:'Числовой ребус', desc:'Расшифруй', type:'test', difficulty:4, duration:180, scoring:'points', maxScore:20, levels:[1,2,3], science:'Абстрактное мышление'},
  {id:'bt_log_19', cat:'logic', emoji:'🎯', title:'Логические цепочки', desc:'Найди лишнее', type:'test', difficulty:3, duration:120, scoring:'points', maxScore:30, levels:[1,2,3,4], science:'Категоризация'},
  {id:'bt_log_20', cat:'logic', emoji:'⚖️', title:'Пропорции', desc:'Найди пропорцию', type:'test', difficulty:3, duration:120, scoring:'points', maxScore:20, levels:[1,2,3], science:'Пропорциональное мышление'},
  {id:'bt_log_21', cat:'logic', emoji:'🔢', title:'Простые числа', desc:'Найди простые', type:'test', difficulty:3, duration:120, scoring:'points', maxScore:20, levels:[1,2,3], science:'Числовая логика'},
  {id:'bt_log_22', cat:'logic', emoji:'🎲', title:'Вероятность', desc:'Оцени вероятность', type:'test', difficulty:4, duration:180, scoring:'points', maxScore:20, levels:[1,2,3], science:'Вероятностное мышление'},
  {id:'bt_log_23', cat:'logic', emoji:'🧩', title:'Мозаика', desc:'Собери узор', type:'game', difficulty:4, duration:300, scoring:'time', maxScore:null, levels:[1,2,3], science:'Визуальное мышление'},
  {id:'bt_log_24', cat:'logic', emoji:'🔢', title:'Криптарифм', desc:'Буквы = цифры', type:'test', difficulty:5, duration:300, scoring:'time', maxScore:null, levels:[1,2,3], science:'Символическое мышление'},
  {id:'bt_log_25', cat:'logic', emoji:'♟', title:'Задача на мат', desc:'Мат в 2 хода', type:'test', difficulty:5, duration:300, scoring:'accuracy', maxScore:100, levels:[1,2,3], science:'Шахматное мышление'},
  {id:'bt_log_26', cat:'logic', emoji:'🎯', title:'Равенства', desc:'Расставь знаки', type:'test', difficulty:4, duration:180, scoring:'points', maxScore:20, levels:[1,2,3], science:'Комбинаторное мышление'},
  {id:'bt_log_27', cat:'logic', emoji:'🔤', title:'Словесные задачи', desc:'Реши словесную задачу', type:'test', difficulty:4, duration:180, scoring:'accuracy', maxScore:100, levels:[1,2,3], science:'Семантический анализ'},
  {id:'bt_log_28', cat:'logic', emoji:'🎲', title:'Кубик Рубика', desc:'Собери', type:'game', difficulty:5, duration:600, scoring:'time', maxScore:null, levels:[1,2,3,4,5], science:'Пространственное мышление'},
  {id:'bt_log_29', cat:'logic', emoji:'🧩', title:'Домино', desc:'Найди цепочку', type:'test', difficulty:3, duration:120, scoring:'points', maxScore:20, levels:[1,2,3], science:'Комбинаторное мышление'},
  {id:'bt_log_30', cat:'logic', emoji:'🎯', title:'Силлогизмы', desc:'Сделай вывод', type:'test', difficulty:4, duration:180, scoring:'accuracy', maxScore:100, levels:[1,2,3], science:'Дедуктивное мышление'},

  /* ===== ФОКУС (30) ===== */
  {id:'bt_foc_1', cat:'focus', emoji:'🎯', title:'Струп-2', desc:'Назови цвет, не слово', type:'test', difficulty:3, duration:60, scoring:'accuracy', maxScore:100, levels:[1,2,3,4,5], science:'Когнитивный контроль'},
  {id:'bt_foc_2', cat:'focus', emoji:'🔍', title:'Найди цифру', desc:'Найди все цифры по порядку', type:'test', difficulty:3, duration:120, scoring:'time', maxScore:null, levels:[1,2,3,4], science:'Визуальное внимание'},
  {id:'bt_foc_3', cat:'focus', emoji:'🎯', title:'Точка-вспышка', desc:'Заметь точку', type:'test', difficulty:3, duration:60, scoring:'points', maxScore:30, levels:[1,2,3], science:'Устойчивое внимание'},
  {id:'bt_foc_4', cat:'focus', emoji:'🔊', title:'Слушай и считай', desc:'Считай звуки', type:'test', difficulty:4, duration:60, scoring:'points', maxScore:20, levels:[1,2,3], science:'Слуховое внимание'},
  {id:'bt_foc_5', cat:'focus', emoji:'🎨', title:'Найди пару', desc:'Найди одинаковые', type:'test', difficulty:3, duration:120, scoring:'time', maxScore:null, levels:[1,2,3,4], science:'Зрительный поиск'},
  {id:'bt_foc_6', cat:'focus', emoji:'🔢', title:'Счёт по порядку', desc:'Расставь числа по порядку', type:'test', difficulty:3, duration:60, scoring:'time', maxScore:null, levels:[1,2,3,4], science:'Внимание и скорость'},
  {id:'bt_foc_7', cat:'focus', emoji:'🎯', title:'Медитация-фокус', desc:'Сосредоточься на дыхании', type:'exercise', difficulty:2, duration:300, scoring:'accuracy', maxScore:100, levels:[1,2,3,4], science:'Осознанность'},
  {id:'bt_foc_8', cat:'focus', emoji:'🖼', title:'Сравнение', desc:'Найди отличия', type:'test', difficulty:3, duration:180, scoring:'points', maxScore:20, levels:[1,2,3,4], science:'Зрительное внимание'},
  {id:'bt_foc_9', cat:'focus', emoji:'🎵', title:'Музыкальный фокус', desc:'Слушай и отмечай', type:'test', difficulty:4, duration:120, scoring:'accuracy', maxScore:100, levels:[1,2,3], science:'Слуховое внимание'},
  {id:'bt_foc_10', cat:'focus', emoji:'🔢', title:'Обратный счёт', desc:'Считай от 100 по 7', type:'test', difficulty:4, duration:180, scoring:'points', maxScore:15, levels:[1,2,3], science:'Устойчивое внимание'},
  {id:'bt_foc_11', cat:'focus', emoji:'🎨', title:'Цвета-помехи', desc:'Игнорируй отвлекающие', type:'test', difficulty:4, duration:60, scoring:'accuracy', maxScore:100, levels:[1,2,3,4], science:'Подавление помех'},
  {id:'bt_foc_12', cat:'focus', emoji:'🎯', title:'Множественные объекты', desc:'Следи за несколькими', type:'test', difficulty:5, duration:120, scoring:'points', maxScore:20, levels:[1,2,3], science:'Множественное внимание'},
  {id:'bt_foc_13', cat:'focus', emoji:'🔍', title:'Детектив', desc:'Найди улики', type:'game', difficulty:4, duration:300, scoring:'points', maxScore:30, levels:[1,2,3], science:'Концентрация'},
  {id:'bt_foc_14', cat:'focus', emoji:'🖱', title:'Слежение', desc:'Следи за мышью', type:'game', difficulty:3, duration:120, scoring:'time', maxScore:null, levels:[1,2,3,4], science:'Динамическое внимание'},
  {id:'bt_foc_15', cat:'focus', emoji:'🎯', title:'Тир', desc:'Стреляй по цели', type:'game', difficulty:3, duration:120, scoring:'points', maxScore:50, levels:[1,2,3,4], science:'Зрительно-моторная координация'},
  {id:'bt_foc_16', cat:'focus', emoji:'🔢', title:'Счёт слов', desc:'Считай слова с буквой А', type:'test', difficulty:4, duration:120, scoring:'points', maxScore:20, levels:[1,2,3], science:'Селективное внимание'},
  {id:'bt_foc_17', cat:'focus', emoji:'🎨', title:'Цветной текст', desc:'Определи цвет чернил', type:'test', difficulty:3, duration:60, scoring:'points', maxScore:60, levels:[1,2,3,4], science:'Эффект Струпа'},
  {id:'bt_foc_18', cat:'focus', emoji:'🎯', title:'Стабильность', desc:'Удержи взгляд на точке', type:'exercise', difficulty:3, duration:120, scoring:'time', maxScore:null, levels:[1,2,3], science:'Стабильность внимания'},
  {id:'bt_foc_19', cat:'focus', emoji:'🔊', title:'Шум', desc:'Работай в шуме', type:'exercise', difficulty:4, duration:180, scoring:'accuracy', maxScore:100, levels:[1,2,3], science:'Устойчивость к шуму'},
  {id:'bt_foc_20', cat:'focus', emoji:'🎯', title:'Двойная задача', desc:'Два дела одновременно', type:'test', difficulty:5, duration:120, scoring:'accuracy', maxScore:100, levels:[1,2,3], science:'Разделённое внимание'},
  {id:'bt_foc_21', cat:'focus', emoji:'🎨', title:'Поиск', desc:'Найди все буквы', type:'test', difficulty:3, duration:120, scoring:'time', maxScore:null, levels:[1,2,3,4], science:'Зрительный поиск'},
  {id:'bt_foc_22', cat:'focus', emoji:'🔢', title:'Bлиц-тест', desc:'Запомни и отметь', type:'test', difficulty:4, duration:120, scoring:'accuracy', maxScore:100, levels:[1,2,3], science:'Рабочая память + внимание'},
  {id:'bt_foc_23', cat:'focus', emoji:'🎯', title:'Медитация 10', desc:'10 минут медитации', type:'exercise', difficulty:3, duration:600, scoring:'time', maxScore:null, levels:[1,2,3], science:'Осознанность'},
  {id:'bt_foc_24', cat:'focus', emoji:'🎨', title:'Игнорирование', desc:'Игнорируй движение', type:'test', difficulty:4, duration:120, scoring:'accuracy', maxScore:100, levels:[1,2,3], science:'Подавление'},
  {id:'bt_foc_25', cat:'focus', emoji:'🔢', title:'Математика-фокус', desc:'Считай в уме', type:'test', difficulty:4, duration:120, scoring:'points', maxScore:30, levels:[1,2,3], science:'Внимание + счёт'},
  {id:'bt_foc_26', cat:'focus', emoji:'🎯', title:'Реакция-фокус', desc:'Быстро реагируй на сигнал', type:'test', difficulty:3, duration:60, scoring:'time', maxScore:null, levels:[1,2,3,4], science:'Внимание + скорость'},
  {id:'bt_foc_27', cat:'focus', emoji:'🎨', title:'Категории', desc:'Сортируй объекты', type:'test', difficulty:4, duration:120, scoring:'points', maxScore:30, levels:[1,2,3], science:'Селективное внимание'},
  {id:'bt_foc_28', cat:'focus', emoji:'🔍', title:'Скрытые объекты', desc:'Найди 10 объектов', type:'game', difficulty:4, duration:300, scoring:'points', maxScore:10, levels:[1,2,3], science:'Визуальное внимание'},
  {id:'bt_foc_29', cat:'focus', emoji:'🎯', title:'Точность', desc:'Попади в цель', type:'game', difficulty:3, duration:120, scoring:'accuracy', maxScore:100, levels:[1,2,3,4], science:'Точность + внимание'},
  {id:'bt_foc_30', cat:'focus', emoji:'🎯', title:'Внимание 5 минут', desc:'5 минут на одной задаче', type:'exercise', difficulty:3, duration:300, scoring:'time', maxScore:null, levels:[1,2,3], science:'Устойчивое внимание'}
];

/* ============ АНТИСТРЕСС — КАТЕГОРИИ ============ */
var ANTISTRESS_CATEGORIES = [
  {id:'breath',   emoji:'🌬', name:'Дыхание',      color:'#4dd4ff', desc:'Пранаяма, box breathing, 4-7-8'},
  {id:'meditation',emoji:'🧘', name:'Медитация',   color:'#b394ff', desc:'Осознанность, сканирование, метта'},
  {id:'body',     emoji:'💪', name:'Тело',         color:'#3ddc97', desc:'Массаж, ванна, тепло, холод'},
  {id:'grounding',emoji:'🌳', name:'Заземление',   color:'#7bc043', desc:'5-4-3-2-1, природа, ходьба'},
  {id:'sound',    emoji:'🎵', name:'Звук',         color:'#ffa940', desc:'Музыка, белый шум, природа'},
  {id:'cold',     emoji:'❄️', name:'Закаливание',  color:'#4dd4ff', desc:'Холодный душ, обливание, крио'},
  {id:'aroma',    emoji:'🕯', name:'Аромат',       color:'#ff88cc', desc:'Эфирные масла, свечи'},
  {id:'creative', emoji:'🎨', name:'Творчество',   color:'#ff7ba9', desc:'Рисование, письмо, музыка'}
];

/* ============ АНТИСТРЕСС — ПРАКТИКИ (60+) ============ */
var ANTISTRESS_PRACTICES = [
  /* Дыхание (12) */
  {id:'as_breath_478', cat:'breath', emoji:'🌬', title:'Дыхание 4-7-8', desc:'Вдох 4, задержка 7, выдох 8', duration:120, steps:['Сядь удобно','Вдох носом 4 сек','Задержка 7 сек','Выдох ртом 8 сек','Повтори 4 раза'], science:'Активирует парасимпатическую систему, снижает кортизол', effect:'Успокоение за 2 минуты', level:'easy'},
  {id:'as_breath_box', cat:'breath', emoji:'📦', title:'Box Breathing', desc:'4-4-4-4 (квадрат)', duration:120, steps:['Вдох 4','Задержка 4','Выдох 4','Задержка 4','Повтори 5 раз'], science:'Используется Navy SEALs для стрессовых ситуаций', effect:'Фокус + спокойствие', level:'easy'},
  {id:'as_breath_alt', cat:'breath', emoji:'🔄', title:'Попеременное дыхание', desc:'Нади Шодхана', duration:180, steps:['Закрой правую ноздрю','Вдох левой 4 сек','Закрой левую','Вдох правой 4 сек','Повтори 10 раз'], science:'Балансирует полушария, снижает тревогу', effect:'Ясность ума', level:'medium'},
  {id:'as_breath_belly', cat:'breath', emoji:'🎈', title:'Брюшное дыхание', desc:'Диафрагмальное', duration:180, steps:['Рука на живот','Вдох — живот надувается','Выдох — живот сжимается','10 циклов'], science:'Активирует вагус, снижает давление', effect:'Расслабление', level:'easy'},
  {id:'as_breath_ujjayi', cat:'breath', emoji:'🌊', title:'Уджайи', desc:'Дыхание океана', duration:180, steps:['Слегка сожми горло','Вдох со звуком океана','Выдох со звуком','10 циклов'], science:'Успокаивает ум, готовит к медитации', effect:'Глубокое расслабление', level:'medium'},
  {id:'as_breath_bhramari', cat:'breath', emoji:'🐝', title:'Бхрамари', desc:'Дыхание пчелы', duration:180, steps:['Закрой уши','Вдох носом','Выдох со звуком «ммм»','10 раз'], science:'Вибрация стимулирует блуждающий нерв', effect:'Снятие тревоги', level:'medium'},
  {id:'as_breath_kapalabhati', cat:'breath', emoji:'⚡', title:'Капалабхати', desc:'Дыхание огня', duration:120, steps:['Резкий выдох носом','Пассивный вдох','30 раз быстро','3 подхода'], science:'Энергизирует, очищает', effect:'Бодрость', level:'hard'},
  {id:'as_breath_sitali', cat:'breath', emoji:'❄️', title:'Ситали', desc:'Охлаждающее дыхание', duration:120, steps:['Язык трубочкой','Вдох через язык','Выдох носом','10 раз'], science:'Снижает температуру, успокаивает', effect:'Охлаждение', level:'medium'},
  {id:'as_breath_sigh', cat:'breath', emoji:'😮‍💨', title:'Физиологический вздох', desc:'Двойной вдох + длинный выдох', duration:60, steps:['Вдох носом','Ещё вдох','Длинный выдох ртом','3 раза'], science:'Быстрое снижение стресса (Huberman)', effect:'Мгновенное успокоение', level:'easy'},
  {id:'as_breath_cyclic', cat:'breath', emoji:'🌀', title:'Циклическое дыхание', desc:'Сильный вдох + пассивный выдох', duration:300, steps:['30 сильных вдохов','Задержка на выдохе','Повтори 3 цикла'], science:'Трансформация состояния', effect:'Глубокое расслабление', level:'hard'},
  {id:'as_breath_om', cat:'breath', emoji:'🕉', title:'Дыхание ОМ', desc:'Мантра на выдохе', duration:300, steps:['Вдох носом','Выдох «ОМ»','10 раз','Медитация 5 мин'], science:'Вибрация успокаивает нервную систему', effect:'Глубокое спокойствие', level:'medium'},
  {id:'as_breath_2to1', cat:'breath', emoji:'⚖️', title:'Дыхание 2:1', desc:'Выдох в 2 раза длиннее вдоха', duration:180, steps:['Вдох 4','Выдох 8','10 циклов'], science:'Активирует парасимпатику', effect:'Успокоение', level:'easy'},

  /* Медитация (12) */
  {id:'as_med_breath', cat:'meditation', emoji:'🧘', title:'Медитация на дыхании', desc:'10 минут наблюдения', duration:600, steps:['Сядь удобно','Закрой глаза','Наблюдай дыхание','Возвращайся при отвлечении'], science:'MBSR: снижает тревогу на 30%', effect:'Спокойствие', level:'easy'},
  {id:'as_med_body', cat:'meditation', emoji:'🧘', title:'Сканирование тела', desc:'10 минут', duration:600, steps:['Ляг','Внимание на стопы','Медленно вверх','Замечай ощущения'], science:'Снимает телесное напряжение', effect:'Расслабление', level:'easy'},
  {id:'as_med_metta', cat:'meditation', emoji:'💖', title:'Метта (любящая доброта)', desc:'10 минут', duration:600, steps:['Пожелай добра себе','Близкому','Нейтральному','Сложному человеку','Всем'], science:'Увеличивает окситоцин и сострадание', effect:'Тепло, связь', level:'medium'},
  {id:'as_med_mantra', cat:'meditation', emoji:'🕉', title:'Мантра-медитация', desc:'10 минут', duration:600, steps:['Повторяй мантру','ОМ / Со Хам','Возвращайся при отвлечении'], science:'Стабилизирует ум', effect:'Фокус', level:'easy'},
  {id:'as_med_visual', cat:'meditation', emoji:'🌊', title:'Визуализация', desc:'10 минут', duration:600, steps:['Закрой глаза','Представь спокойное место','Проживи 5 чувств','Побудь там'], science:'Активирует парасимпатику', effect:'Спокойствие', level:'easy'},
  {id:'as_med_silence', cat:'meditation', emoji:'🤫', title:'Медитация тишины', desc:'10 минут без объекта', duration:600, steps:['Просто сиди','Ничего не делай','Замечай пространство'], science:'Продвинутая практика', effect:'Глубокий покой', level:'hard'},
  {id:'as_med_walk', cat:'meditation', emoji:'🚶', title:'Медитация ходьбы', desc:'10 минут', duration:600, steps:['Медленно иди','Внимание на стопы','Замечай контакт с землёй'], science:'Осознанность в движении', effect:'Заземление', level:'easy'},
  {id:'as_med_eat', cat:'meditation', emoji:'🍎', title:'Медитация еды', desc:'1 приём пищи', duration:600, steps:['Без телефона','Замечай вкус','Жуй медленно','Благодари'], science:'Улучшает пищеварение', effect:'Насыщение', level:'easy'},
  {id:'as_med_sound', cat:'meditation', emoji:'🎵', title:'Медитация звука', desc:'10 минут', duration:600, steps:['Слушай все звуки','Не оценивай','Замечай тишину между'], science:'Открытое осознавание', effect:'Присутствие', level:'medium'},
  {id:'as_med_emotion', cat:'meditation', emoji:'❤️', title:'Медитация эмоций', desc:'10 минут', duration:600, steps:['Заметь эмоцию','Где в теле?','Не борись','Побудь с ней'], science:'ACT: принятие эмоций', effect:'Эмоциональная регуляция', level:'medium'},
  {id:'as_med_memento', cat:'meditation', emoji:'💀', title:'Memento Mori', desc:'5 минут', duration:300, steps:['Представь свою смерть','Что важно?','Что отпустить?'], science:'Стоицизм', effect:'Ясность', level:'medium'},
  {id:'as_med_gratitude', cat:'meditation', emoji:'🙏', title:'Медитация благодарности', desc:'5 минут', duration:300, steps:['3 вещи, за которые благодарен','Почувствуй','Пожелай добра'], science:'Повышает серотонин', effect:'Радость', level:'easy'},

  /* Тело (8) */
  {id:'as_body_massage', cat:'body', emoji:'💆', title:'Самомассаж', desc:'10 минут', duration:600, steps:['Массаж головы','Шеи','Плеч','Рук','Стоп'], science:'Снижает мышечное напряжение', effect:'Расслабление', level:'easy'},
  {id:'as_body_bath', cat:'body', emoji:'🛁', title:'Тёплая ванна', desc:'20 минут', duration:1200, steps:['Тёплая вода','Соль/масло','Свечи','20 минут'], science:'Снижает кортизол', effect:'Глубокое расслабление', level:'easy'},
  {id:'as_body_stretch', cat:'body', emoji:'🧘', title:'Растяжка', desc:'10 минут', duration:600, steps:['Шея','Плечи','Спина','Ноги','Стопы'], science:'Снимает зажимы', effect:'Гибкость', level:'easy'},
  {id:'as_body_warm', cat:'body', emoji:'🔥', title:'Тепло', desc:'10 минут', duration:600, steps:['Грелка/плед','Тёплый чай','Уютное место'], science:'Комфорт снижает тревогу', effect:'Уют', level:'easy'},
  {id:'as_body_compress', cat:'body', emoji:'🧊', title:'Холодный компресс', desc:'5 минут', duration:300, steps:['Холодная вода','Компресс на лицо','Дыши глубоко'], science:'Активирует вагус', effect:'Бодрость', level:'easy'},
  {id:'as_body_foam', cat:'body', emoji:'🎯', title:'Foam roller', desc:'10 минут', duration:600, steps:['Прокатать спину','Ноги','Ягодицы'], science:'Миофасциальный релиз', effect:'Снятие напряжения', level:'medium'},
  {id:'as_body_yoga', cat:'body', emoji:'🧘', title:'Йога 15 минут', desc:'Комплекс', duration:900, steps:['Приветствие солнцу','Наклоны','Скрутки','Шавасана'], science:'Снижает кортизол на 30%', effect:'Баланс', level:'medium'},
  {id:'as_body_sex', cat:'body', emoji:'❤️', title:'Близость', desc:'С партнёром', duration:1800, steps:['Внимание друг к другу','Без телефона','Забота'], science:'Окситоцин + эндорфины', effect:'Связь', level:'easy'},

  /* Заземление (8) */
  {id:'as_ground_54321', cat:'grounding', emoji:'🌳', title:'5-4-3-2-1', desc:'Заземление при тревоге', duration:180, steps:['5 вещей, которые видишь','4 — слышишь','3 — трогаешь','2 — нюхаешь','1 — чувствуешь на вкус'], science:'Активирует все сенсорные системы', effect:'Возврат в «здесь и сейчас»', level:'easy'},
  {id:'as_ground_walk', cat:'grounding', emoji:'🚶', title:'Прогулка 15 минут', desc:'Без телефона', duration:900, steps:['Иди спокойно','Смотри по сторонам','Замечай детали'], science:'Снижает руминацию', effect:'Ясность', level:'easy'},
  {id:'as_ground_nature', cat:'grounding', emoji:'🌲', title:'Природа 30 минут', desc:'Парк, лес, вода', duration:1800, steps:['Выйди на природу','Без телефона','Дыши глубоко'], science:'Снижает кортизол на 16%', effect:'Восстановление', level:'easy'},
  {id:'as_ground_barefoot', cat:'grounding', emoji:'🦶', title:'Босиком по земле', desc:'10 минут', duration:600, steps:['Сними обувь','Постой на земле/траве','Почувствуй опору'], science:'Earthing: снижает воспаление', effect:'Заземление', level:'easy'},
  {id:'as_ground_tree', cat:'grounding', emoji:'🌳', title:'Обнять дерево', desc:'5 минут', duration:300, steps:['Найди дерево','Обними','Дыши','Почувствуй'], science:'Снижает стресс', effect:'Связь с природой', level:'easy'},
  {id:'as_ground_object', cat:'grounding', emoji:'💎', title:'Объект заземления', desc:'Носи с собой', duration:60, steps:['Выбери камень/кольцо','При тревоге — потрогай','Сосредоточься на ощущении'], science:'Якорь в настоящем', effect:'Быстрое успокоение', level:'easy'},
  {id:'as_ground_water', cat:'grounding', emoji:'🌊', title:'Смотреть на воду', desc:'10 минут', duration:600, steps:['Найди воду','Смотри','Дыши'], science:'Визуальное успокоение', effect:'Покой', level:'easy'},
  {id:'as_ground_fire', cat:'grounding', emoji:'🔥', title:'Смотреть на огонь', desc:'10 минут', duration:600, steps:['Свеча/камин','Смотри','Дыши'], science:'Гипнотический эффект', effect:'Транс', level:'easy'},

  /* Звук (6) */
  {id:'as_sound_nature', cat:'sound', emoji:'🌧', title:'Звуки природы', desc:'15 минут', duration:900, steps:['Включи дождь/лес/океан','Закрой глаза','Слушай'], science:'Маскирует тревожные мысли', effect:'Расслабление', level:'easy'},
  {id:'as_sound_white', cat:'sound', emoji:'📻', title:'Белый шум', desc:'20 минут', duration:1200, steps:['Включи','Работай/отдыхай'], science:'Улучшает фокус', effect:'Концентрация', level:'easy'},
  {id:'as_sound_binaural', cat:'sound', emoji:'🎧', title:'Бинауральные ритмы', desc:'20 минут', duration:1200, steps:['Наушники','Включи 40Hz (фокус) или 6Hz (сон)'], science:'Синхронизация полушарий', effect:'Фокус/сон', level:'medium'},
  {id:'as_sound_music', cat:'sound', emoji:'🎵', title:'Спокойная музыка', desc:'15 минут', duration:900, steps:['Классика, lo-fi, ambient','Закрой глаза','Слушай'], science:'Снижает кортизол', effect:'Успокоение', level:'easy'},
  {id:'as_sound_chant', cat:'sound', emoji:'🕉', title:'Пение мантр', desc:'10 минут', duration:600, steps:['Включи мантру','Подпевай','Повторяй'], science:'Вибрация + дыхание', effect:'Покой', level:'easy'},
  {id:'as_sound_silence', cat:'sound', emoji:'🤫', title:'Тишина', desc:'10 минут', duration:600, steps:['Выключи всё','Побудь в тишине'], science:'Восстанавливает нервную систему', effect:'Ясность', level:'easy'},

  /* Закаливание (6) */
  {id:'as_cold_shower', cat:'cold', emoji:'❄️', title:'Холодный душ', desc:'2 минуты', duration:120, steps:['Начни с тёплой','Постепенно холодная','2 минуты','Дыши глубоко'], science:'Дофамин +250% на 2 часа', effect:'Бодрость, устойчивость', level:'hard'},
  {id:'as_cold_face', cat:'cold', emoji:'🧊', title:'Холодная вода на лицо', desc:'30 секунд', duration:30, steps:['Набери холодной воды','Опусти лицо','30 секунд'], science:'Рефлекс ныряния — активирует вагус', effect:'Быстрое успокоение', level:'easy'},
  {id:'as_cold_contrast', cat:'cold', emoji:'🔄', title:'Контрастный душ', desc:'3 цикла', duration:300, steps:['Тёплый 1 мин','Холодный 30 сек','Повтори 3 раза'], science:'Улучшает кровообращение', effect:'Энергия', level:'medium'},
  {id:'as_cold_ice', cat:'cold', emoji:'🧊', title:'Лёд в руке', desc:'2 минуты', duration:120, steps:['Возьми лёд','Держи','Дыши глубоко'], science:'Переключает внимание', effect:'Заземление', level:'easy'},
  {id:'as_cold_walk', cat:'cold', emoji:'🚶', title:'Прогулка на холоде', desc:'10 минут', duration:600, steps:['Оденься','Выйди','Дыши'], science:'Тренирует терморегуляцию', effect:'Бодрость', level:'medium'},
  {id:'as_cold_bath', cat:'cold', emoji:'🛁', title:'Холодная ванна', desc:'5 минут', duration:300, steps:['Холодная вода 10-15°C','5 минут','Дыши'], science:'Мощный выброс дофамина', effect:'Эйфория', level:'hard'},

  /* Аромат (4) */
  {id:'as_aroma_lavender', cat:'aroma', emoji:'💜', title:'Лаванда', desc:'10 минут', duration:600, steps:['Капни масло','Вдохни','Расслабься'], science:'Снижает тревогу', effect:'Сон', level:'easy'},
  {id:'as_aroma_peppermint', cat:'aroma', emoji:'🌿', title:'Мята', desc:'5 минут', duration:300, steps:['Вдохни','Почувствуй бодрость'], science:'Улучшает фокус', effect:'Бодрость', level:'easy'},
  {id:'as_aroma_candle', cat:'aroma', emoji:'🕯', title:'Свеча', desc:'15 минут', duration:900, steps:['Зажги свечу','Смотри','Дыши'], science:'Ритуал спокойствия', effect:'Уют', level:'easy'},
  {id:'as_aroma_diffuser', cat:'aroma', emoji:'💨', title:'Диффузор', desc:'30 минут', duration:1800, steps:['Залей масло','Включи','Работай/отдыхай'], science:'Атмосфера', effect:'Настроение', level:'easy'},

  /* Творчество (4) */
  {id:'as_creative_draw', cat:'creative', emoji:'🎨', title:'Рисовать', desc:'15 минут', duration:900, steps:['Возьми лист','Рисуй что угодно','Не оценивай'], science:'Арт-терапия', effect:'Выражение эмоций', level:'easy'},
  {id:'as_creative_write', cat:'creative', emoji:'✍️', title:'Свободное письмо', desc:'10 минут', duration:600, steps:['Пиши всё, что в голове','Без остановки','10 минут'], science:'Stream of consciousness', effect:'Ясность', level:'easy'},
  {id:'as_creative_music', cat:'creative', emoji:'🎸', title:'Играть музыку', desc:'15 минут', duration:900, steps:['Инструмент','Играй что хочешь'], science:'Активирует DMN', effect:'Радость', level:'easy'},
  {id:'as_creative_cook', cat:'creative', emoji:'🍳', title:'Готовить', desc:'30 минут', duration:1800, steps:['Рецепт','Готовь осознанно'], science:'Ритуал + творчество', effect:'Удовлетворение', level:'easy'}
];

/* ============ СОН — КАТЕГОРИИ ЗАПИСЕЙ ============ */
var SLEEP_QUALITY_OPTIONS = [
  {id:1, emoji:'😵', label:'Ужасно'},
  {id:2, emoji:'😣', label:'Плохо'},
  {id:3, emoji:'😕', label:'Так себе'},
  {id:4, emoji:'😐', label:'Средне'},
  {id:5, emoji:'🙂', label:'Нормально'},
  {id:6, emoji:'😊', label:'Хорошо'},
  {id:7, emoji:'😃', label:'Отлично'},
  {id:8, emoji:'😁', label:'Превосходно'},
  {id:9, emoji:'🤩', label:'Идеально'},
  {id:10,emoji:'🌟', label:'Божественно'}
];

var SLEEP_DISRUPTIONS = [
  {id:'noise',     emoji:'🔊', label:'Шум'},
  {id:'light',     emoji:'💡', label:'Свет'},
  {id:'heat',      emoji:'🔥', label:'Жарко'},
  {id:'cold',      emoji:'🥶', label:'Холодно'},
  {id:'partner',   emoji:'👥', label:'Партнёр'},
  {id:'kids',      emoji:'👶', label:'Дети'},
  {id:'pet',       emoji:'🐾', label:'Питомец'},
  {id:'nightmare', emoji:'😱', label:'Кошмар'},
  {id:'bathroom',  emoji:'🚽', label:'Туалет'},
  {id:'thirst',    emoji:'💧', label:'Жажда'},
  {id:'hunger',    emoji:'🍽', label:'Голод'},
  {id:'pain',      emoji:'🤕', label:'Боль'},
  {id:'thoughts',  emoji:'💭', label:'Мысли'},
  {id:'anxiety',   emoji:'😰', label:'Тревога'},
  {id:'phone',     emoji:'📱', label:'Телефон'},
  {id:'other',     emoji:'❓', label:'Другое'}
];

var SLEEP_IMPROVEMENTS = [
  {id:'no_phone',   emoji:'📵', label:'Без телефона'},
  {id:'no_caffeine',emoji:'☕', label:'Без кофеина после 14:00'},
  {id:'no_alcohol', emoji:'🍷', label:'Без алкоголя'},
  {id:'no_late_eat',emoji:'🍽', label:'Не есть после 20:00'},
  {id:'warm_bath',  emoji:'🛁', label:'Тёплая ванна'},
  {id:'reading',    emoji:'📖', label:'Чтение'},
  {id:'meditation', emoji:'🧘', label:'Медитация'},
  {id:'dark_room',  emoji:'🌑', label:'Тёмная комната'},
  {id:'cool_room',  emoji:'❄️', label:'Прохладная комната'},
  {id:'white_noise',emoji:'📻', label:'Белый шум'},
  {id:'exercise',   emoji:'🏃', label:'Спорт днём'},
  {id:'morning_light',emoji:'🌅', label:'Утренний свет'},
  {id:'consistent', emoji:'⏰', label:'Одно время'},
  {id:'magnesium',  emoji:'💊', label:'Магний'},
  {id:'no_nap',     emoji:'🚫', label:'Без дневного сна'},
  {id:'other',      emoji:'❓', label:'Другое'}
];

var SLEEP_DAYTIME_EFFECTS = [
  {id:'fresh',     emoji:'💪', label:'Свежесть'},
  {id:'sleepy',    emoji:'😴', label:'Сонливость'},
  {id:'focus',     emoji:'🎯', label:'Хороший фокус'},
  {id:'foggy',     emoji:'🌫', label:'Туман в голове'},
  {id:'energetic', emoji:'⚡', label:'Энергия'},
  {id:'tired',     emoji:'😩', label:'Усталость'},
  {id:'irritable', emoji:'😤', label:'Раздражительность'},
  {id:'calm',      emoji:'😌', label:'Спокойствие'},
  {id:'anxious',   emoji:'😰', label:'Тревожность'},
  {id:'motivated', emoji:'🚀', label:'Мотивация'},
  {id:'lazy',      emoji:'🦥', label:'Лень'},
  {id:'happy',     emoji:'😊', label:'Радость'}
];

var SLEEP_DAYTIME_FACTORS = [
  {id:'hard_work',   emoji:'💼', label:'Тяжёлая работа'},
  {id:'stress',      emoji:'😰', label:'Стресс'},
  {id:'conflict',    emoji:'⚔️', label:'Конфликт'},
  {id:'phone_after', emoji:'📱', label:'Телефон/ПК после сна'},
  {id:'screen_before',emoji:'📺', label:'Экран перед сном'},
  {id:'alcohol',     emoji:'🍷', label:'Алкоголь'},
  {id:'caffeine',    emoji:'☕', label:'Кофеин'},
  {id:'heavy_food',  emoji:'🍔', label:'Тяжёлая еда'},
  {id:'sport',       emoji:'🏋️', label:'Спорт'},
  {id:'nature',      emoji:'🌳', label:'Природа'},
  {id:'social',      emoji:'👥', label:'Общение'},
  {id:'alone',       emoji:'🧘', label:'Одиночество'},
  {id:'creativity',  emoji:'🎨', label:'Творчество'},
  {id:'learning',    emoji:'📚', label:'Учёба'},
  {id:'meditation',  emoji:'🧘', label:'Медитация'},
  {id:'nap',         emoji:'😴', label:'Дневной сон'},
  {id:'other',       emoji:'❓', label:'Другое'}
];

var SLEEP_RESET_FACTORS = [
  {id:'travel',      emoji:'✈️', label:'Путешествие'},
  {id:'night_work',  emoji:'🌙', label:'Ночная работа'},
  {id:'party',       emoji:'🎉', label:'Вечеринка'},
  {id:'sick',        emoji:'🤒', label:'Болезнь'},
  {id:'stress',      emoji:'😰', label:'Стресс'},
  {id:'screen',      emoji:'📱', label:'Экран'},
  {id:'caffeine',    emoji:'☕', label:'Кофеин'},
  {id:'alcohol',     emoji:'🍷', label:'Алкоголь'},
  {id:'other',       emoji:'❓', label:'Другое'}
];

/* ============ ЭКСПОРТ ============ */
window.BRAIN_CATEGORIES = BRAIN_CATEGORIES;
window.BRAIN_TRAINING = BRAIN_TRAINING;
window.ANTISTRESS_CATEGORIES = ANTISTRESS_CATEGORIES;
window.ANTISTRESS_PRACTICES = ANTISTRESS_PRACTICES;
window.SLEEP_QUALITY_OPTIONS = SLEEP_QUALITY_OPTIONS;
window.SLEEP_DISRUPTIONS = SLEEP_DISRUPTIONS;
window.SLEEP_IMPROVEMENTS = SLEEP_IMPROVEMENTS;
window.SLEEP_DAYTIME_EFFECTS = SLEEP_DAYTIME_EFFECTS;
window.SLEEP_DAYTIME_FACTORS = SLEEP_DAYTIME_FACTORS;
window.SLEEP_RESET_FACTORS = SLEEP_RESET_FACTORS;

console.log('[CONTENT2 2/4 ✅] BRAIN: categories='+BRAIN_CATEGORIES.length+' games='+BRAIN_TRAINING.length+' | ANTISTRESS: categories='+ANTISTRESS_CATEGORIES.length+' practices='+ANTISTRESS_PRACTICES.length+' | SLEEP: quality='+SLEEP_QUALITY_OPTIONS.length+' disruptions='+SLEEP_DISRUPTIONS.length+' improvements='+SLEEP_IMPROVEMENTS.length);
/* ============================================================
   LIFE OS — CONTENT2.js v1
   ЧАСТЬ 3/4: ИГРЫ (обучающие) + МАТЕРИАЛЫ + УВЕДОМЛЕНИЯ
   ============================================================ */

/* ============ ОБУЧАЮЩИЕ ИГРЫ ============ */
var LEARNING_GAMES = [
  /* ===== IT / КОД ===== */
  {id:'game_code_python', cat:'it', emoji:'🐍', title:'Python: Угадай вывод', desc:'Что выведет код?', type:'quiz', difficulty:2, duration:120, xp:15, science:'Активное обучение программированию'},
  {id:'game_code_js', cat:'it', emoji:'🟨', title:'JavaScript: Найди баг', desc:'Найди ошибку в коде', type:'quiz', difficulty:3, duration:180, xp:20},
  {id:'game_code_html', cat:'it', emoji:'📄', title:'HTML: Собери страницу', desc:'Соедини теги и содержимое', type:'match', difficulty:1, duration:120, xp:10},
  {id:'game_code_css', cat:'it', emoji:'🎨', title:'CSS: Подбери стиль', desc:'Что описывает свойство?', type:'quiz', difficulty:2, duration:120, xp:15},
  {id:'game_code_sql', cat:'it', emoji:'🗄', title:'SQL: Напиши запрос', desc:'Выбери правильный SELECT', type:'quiz', difficulty:3, duration:180, xp:20},
  {id:'game_code_git', cat:'it', emoji:'🌳', title:'Git: Что делает команда', desc:'git commit / push / pull', type:'quiz', difficulty:2, duration:120, xp:15},

  /* ===== ЯЗЫКИ ===== */
  {id:'game_lang_en', cat:'lang', emoji:'🇬🇧', title:'English: Перевод', desc:'Переведи слово', type:'quiz', difficulty:2, duration:120, xp:10},
  {id:'game_lang_es', cat:'lang', emoji:'🇪🇸', title:'Español: Перевод', desc:'Hola → ?', type:'quiz', difficulty:1, duration:120, xp:10},
  {id:'game_lang_de', cat:'lang', emoji:'🇩🇪', title:'Deutsch: Перевод', desc:'Hallo → ?', type:'quiz', difficulty:2, duration:120, xp:10},
  {id:'game_lang_fr', cat:'lang', emoji:'🇫🇷', title:'Français: Перевод', desc:'Bonjour → ?', type:'quiz', difficulty:2, duration:120, xp:10},
  {id:'game_lang_cn', cat:'lang', emoji:'🇨🇳', title:'中文: Перевод', desc:'你好 → ?', type:'quiz', difficulty:3, duration:120, xp:15},
  {id:'game_lang_word_order', cat:'lang', emoji:'🔤', title:'Порядок слов', desc:'Собери предложение', type:'sort', difficulty:3, duration:180, xp:15},

  /* ===== НАУКИ ===== */
  {id:'game_math_add', cat:'math', emoji:'➕', title:'Математика: Сложение', desc:'Сколько будет?', type:'quiz', difficulty:1, duration:60, xp:5},
  {id:'game_math_mul', cat:'math', emoji:'✖️', title:'Математика: Умножение', desc:'Сколько будет?', type:'quiz', difficulty:2, duration:60, xp:10},
  {id:'game_math_seq', cat:'math', emoji:'🔢', title:'Последовательности', desc:'Продолжи ряд', type:'quiz', difficulty:3, duration:120, xp:15},
  {id:'game_math_geom', cat:'math', emoji:'📐', title:'Геометрия', desc:'Найди площадь', type:'quiz', difficulty:2, duration:120, xp:15},
  {id:'game_phys_force', cat:'physics', emoji:'🍎', title:'Физика: Сила', desc:'F = m × a', type:'quiz', difficulty:2, duration:120, xp:15},
  {id:'game_phys_ohm', cat:'physics', emoji:'⚡', title:'Физика: Закон Ома', desc:'I = U / R', type:'quiz', difficulty:2, duration:120, xp:15},
  {id:'game_phys_energy', cat:'physics', emoji:'🔋', title:'Физика: Энергия', desc:'E = mc²', type:'quiz', difficulty:3, duration:120, xp:15},
  {id:'game_chem_elem', cat:'chemistry', emoji:'⚛️', title:'Химия: Элементы', desc:'Угадай символ', type:'quiz', difficulty:2, duration:120, xp:10},
  {id:'game_chem_formula', cat:'chemistry', emoji:'🧪', title:'Химия: Формулы', desc:'Сколько атомов?', type:'quiz', difficulty:3, duration:120, xp:15},
  {id:'game_bio_cell', cat:'biology', emoji:'🧬', title:'Биология: Клетка', desc:'Части клетки', type:'match', difficulty:2, duration:120, xp:10},
  {id:'game_bio_dna', cat:'biology', emoji:'🧬', title:'Биология: ДНК', desc:'Правила Чаргаффа', type:'quiz', difficulty:3, duration:120, xp:15},
  {id:'game_astro_planets', cat:'astro', emoji:'🪐', title:'Астрономия: Планеты', desc:'Порядок от Солнца', type:'sort', difficulty:2, duration:120, xp:10},
  {id:'game_astro_stars', cat:'astro', emoji:'⭐', title:'Астрономия: Звёзды', desc:'Типы звёзд', type:'quiz', difficulty:3, duration:120, xp:15},

  /* ===== ИСТОРИЯ ===== */
  {id:'game_hist_dates', cat:'history', emoji:'📅', title:'История: Даты', desc:'В каком году?', type:'quiz', difficulty:3, duration:120, xp:15},
  {id:'game_hist_people', cat:'history', emoji:'👤', title:'История: Личности', desc:'Кто это сделал?', type:'quiz', difficulty:3, duration:120, xp:15},
  {id:'game_hist_map', cat:'history', emoji:'🗺', title:'История: Карты', desc:'Где происходило?', type:'quiz', difficulty:4, duration:180, xp:20},

  /* ===== ЛОГИКА / МЫШЛЕНИЕ ===== */
  {id:'game_logic_riddles', cat:'logic', emoji:'🧩', title:'Загадки', desc:'Реши загадку', type:'quiz', difficulty:3, duration:120, xp:15},
  {id:'game_logic_pattern', cat:'logic', emoji:'🔷', title:'Паттерны', desc:'Найди закономерность', type:'quiz', difficulty:3, duration:120, xp:15},
  {id:'game_logic_lateral', cat:'logic', emoji:'💡', title:'Латеральное', desc:'Нестандартное решение', type:'quiz', difficulty:4, duration:180, xp:20},
  {id:'game_logic_deduction', cat:'logic', emoji:'🔍', title:'Дедукция', desc:'Кто виноват?', type:'quiz', difficulty:4, duration:180, xp:20},

  /* ===== ФИНАНСЫ ===== */
  {id:'game_fin_budget', cat:'finance', emoji:'💰', title:'Бюджет', desc:'Распредели 100', type:'sim', difficulty:2, duration:180, xp:15},
  {id:'game_fin_invest', cat:'finance', emoji:'📈', title:'Инвестиции', desc:'Куда вложить?', type:'quiz', difficulty:3, duration:180, xp:20},
  {id:'game_fin_tax', cat:'finance', emoji:'🧾', title:'Налоги', desc:'Сколько платить?', type:'quiz', difficulty:3, duration:120, xp:15},
  {id:'game_fin_compound', cat:'finance', emoji:'🔢', title:'Сложный процент', desc:'Посчитай', type:'quiz', difficulty:3, duration:180, xp:15},

  /* ===== ЗДОРОВЬЕ / БИОЛОГИЯ ЧЕЛОВЕКА ===== */
  {id:'game_health_macros', cat:'health', emoji:'🥗', title:'БЖУ', desc:'Посчитай калории', type:'quiz', difficulty:3, duration:180, xp:15},
  {id:'game_health_sleep', cat:'health', emoji:'😴', title:'Сон', desc:'Что улучшает сон?', type:'quiz', difficulty:2, duration:120, xp:10},
  {id:'game_health_hormones', cat:'health', emoji:'🧬', title:'Гормоны', desc:'Что за что отвечает?', type:'match', difficulty:3, duration:180, xp:15},
  {id:'game_health_first_aid', cat:'health', emoji:'🚑', title:'Первая помощь', desc:'Что делать?', type:'quiz', difficulty:4, duration:180, xp:20},

  /* ===== ЭТИКЕТ ===== */
  {id:'game_etiq_table', cat:'etiquette', emoji:'🍽', title:'Этикет за столом', desc:'Какой прибор?', type:'quiz', difficulty:2, duration:120, xp:10},
  {id:'game_etiq_business', cat:'etiquette', emoji:'💼', title:'Деловой этикет', desc:'Кто первый?', type:'quiz', difficulty:3, duration:120, xp:15},
  {id:'game_etiq_dress', cat:'etiquette', emoji:'👔', title:'Дресс-код', desc:'Что надеть?', type:'quiz', difficulty:3, duration:120, xp:15}
];

/* ============ МАТЕРИАЛЫ ОБУЧЕНИЯ ============ */
var LEARNING_MATERIALS = [
  /* ===== КНИГИ ===== */
  {id:'mat_book_1', cat:'book', emoji:'📚', title:'Думай медленно... решай быстро', author:'Даниэль Канеман', pages:653, topic:'Мышление', rating:5, desc:'Две системы мышления: быстрая интуитивная и медленная аналитическая', keyIdeas:['Система 1 и 2','Когнитивные искажения','Эффект якоря','Ошибка выжившего']},
  {id:'mat_book_2', cat:'book', emoji:'📚', title:'Атомные привычки', author:'Джеймс Клир', pages:320, topic:'Привычки', rating:5, desc:'Как формировать хорошие привычки и избавляться от плохих', keyIdeas:['1% в день','Cue-Craving-Response-Reward','Habit stacking','Среда > воля']},
  {id:'mat_book_3', cat:'book', emoji:'📚', title:'Глубокая работа', author:'Кэл Ньюпорт', pages:296, topic:'Продуктивность', rating:5, desc:'Как работать без отвлечений в мире помех', keyIdeas:['Deep Work vs Shallow Work','Ритуалы','Моно-задачи']},
  {id:'mat_book_4', cat:'book', emoji:'📚', title:'Поток', author:'Михай Чиксентмихайи', pages:464, topic:'Психология', rating:5, desc:'Психология оптимального опыта', keyIdeas:['Поток','Баланс сложности и навыка','Ясные цели']},
  {id:'mat_book_5', cat:'book', emoji:'📚', title:'Sapiens', author:'Юваль Ной Харари', pages:520, topic:'История', rating:5, desc:'Краткая история человечества', keyIdeas:['Когнитивная революция','Воображаемый порядок','Империи']},
  {id:'mat_book_6', cat:'book', emoji:'📚', title:'7 навыков высокоэффективных людей', author:'Стивен Кови', pages:432, topic:'Продуктивность', rating:5, desc:'Классика личной эффективности', keyIdeas:['Быть проактивным','Начинать с конца','Сначала понять']},
  {id:'mat_book_7', cat:'book', emoji:'📚', title:'Думай как математик', author:'Барбара Оакли', pages:336, topic:'Обучение', rating:4, desc:'Как решать задачи быстрее и эффективнее', keyIdeas:['Сфокусированное и рассеянное мышление','Chunking','Иллюзия компетентности']},
  {id:'mat_book_8', cat:'book', emoji:'📚', title:'Мозг и душа', author:'Крис Фрит', pages:288, topic:'Нейронауки', rating:4, desc:'Как нервная деятельность формирует наш внутренний мир', keyIdeas:['Мозг — предсказательная машина','Мы не видим реальность напрямую']},
  {id:'mat_book_9', cat:'book', emoji:'📚', title:'Тонкое искусство пофигизма', author:'Марк Мэнсон', pages:224, topic:'Психология', rating:4, desc:'Парадоксальный способ жить счастливо', keyIdeas:['Ценности','Ответственность','Отказ']},
  {id:'mat_book_10', cat:'book', emoji:'📚', title:'Богатый папа, бедный папа', author:'Роберт Кийосаки', pages:336, topic:'Финансы', rating:4, desc:'Что богатые говорят своим детям об деньгах', keyIdeas:['Активы и пассивы','Финансовое образование']},

  /* ===== КУРСЫ ===== */
  {id:'mat_course_1', cat:'course', emoji:'🎓', title:'Learning How to Learn', author:'Coursera (McMaster)', hours:15, topic:'Обучение', rating:5, desc:'Научно обоснованные методы обучения', keyIdeas:['Chunking','Spaced repetition','Pomodoro','Sleep and memory']},
  {id:'mat_course_2', cat:'course', emoji:'🎓', title:'CS50: Introduction to Computer Science', author:'Harvard', hours:100, topic:'IT', rating:5, desc:'Введение в программирование и CS', keyIdeas:['C, Python, SQL','Алгоритмы','Структуры данных']},
  {id:'mat_course_3', cat:'course', emoji:'🎓', title:'Neural Networks and Deep Learning', author:'DeepLearning.AI', hours:20, topic:'AI', rating:5, desc:'Нейронные сети с нуля', keyIdeas:['Forward/backward propagation','Градиентный спуск']},
  {id:'mat_course_4', cat:'course', emoji:'🎓', title:'The Science of Well-Being', author:'Yale (Laurie Santos)', hours:20, topic:'Психология', rating:5, desc:'Научно обоснованные практики счастья', keyIdeas:['Благодарность','Медитация','Социальные связи']},

  /* ===== ВИДЕО ===== */
  {id:'mat_video_1', cat:'video', emoji:'🎬', title:'Kurzgesagt', author:'YouTube', hours:1, topic:'Наука', rating:5, desc:'Анимации о науке, космосе, биологии', keyIdeas:['Сложное — просто']},
  {id:'mat_video_2', cat:'video', emoji:'🎬', title:'TED-Ed', author:'YouTube', hours:1, topic:'Разное', rating:5, desc:'Короткие образовательные видео', keyIdeas:['5-10 минут']},
  {id:'mat_video_3', cat:'video', emoji:'🎬', title:'3Blue1Brown', author:'YouTube', hours:1, topic:'Математика', rating:5, desc:'Математика через визуализацию', keyIdeas:['Линейная алгебра','Исчисление']},
  {id:'mat_video_4', cat:'video', emoji:'🎬', title:'Huberman Lab', author:'YouTube', hours:1, topic:'Нейронауки', rating:5, desc:'Наука о мозге, сне, дофамине', keyIdeas:['Протоколы','Сон','Фокус']},
  {id:'mat_video_5', cat:'video', emoji:'🎬', title:'Andrew Huberman Podcast', author:'YouTube', hours:3, topic:'Нейронауки', rating:5, desc:'Глубокие эпизоды о мозге и теле', keyIdeas:['Протоколы','Наука']},

  /* ===== ПОДКАСТЫ ===== */
  {id:'mat_pod_1', cat:'podcast', emoji:'🎧', title:'Huberman Lab', author:'Andrew Huberman', hours:1, topic:'Нейронауки', rating:5, desc:'Наука о мозге и теле', keyIdeas:['Протоколы']},
  {id:'mat_pod_2', cat:'podcast', emoji:'🎧', title:'The Tim Ferriss Show', author:'Tim Ferriss', hours:2, topic:'Продуктивность', rating:5, desc:'Интервью с лучшими', keyIdeas:['Ритуалы','Инструменты']},
  {id:'mat_pod_3', cat:'podcast', emoji:'🎧', title:'Lex Fridman Podcast', author:'Lex Fridman', hours:3, topic:'AI/Наука', rating:5, desc:'Глубокие интервью', keyIdeas:['AI','Философия']},

  /* ===== СТАТЬИ ===== */
  {id:'mat_art_1', cat:'article', emoji:'📄', title:'How to Learn Anything Faster', author:'Scott Young', minutes:15, topic:'Обучение', rating:5, desc:'Метод ультраобучения', keyIdeas:['Directness','Drill','Feedback']},
  {id:'mat_art_2', cat:'article', emoji:'📄', title:'The Science of Habit Formation', author:'Wendy Wood', minutes:20, topic:'Привычки', rating:5, desc:'Как формируются привычки', keyIdeas:['Контекст','Повторение']},
  {id:'mat_art_3', cat:'article', emoji:'📄', title:'How to Get Better at Anything', author:'James Clear', minutes:10, topic:'Продуктивность', rating:5, desc:'Практика и обратная связь', keyIdeas:['Deliberate practice']},

  /* ===== ИНСТРУМЕНТЫ ===== */
  {id:'mat_tool_1', cat:'tool', emoji:'🛠', title:'Anki', author:'Открытый', desc:'Карточки с интервальным повторением', topic:'Обучение', rating:5, keyIdeas:['Spaced repetition']},
  {id:'mat_tool_2', cat:'tool', emoji:'🛠', title:'Notion', author:'Notion Labs', desc:'Универсальный блокнот', topic:'Продуктивность', rating:5, keyIdeas:['Гибкость']},
  {id:'mat_tool_3', cat:'tool', emoji:'🛠', title:'Obsidian', author:'Open Source', desc:'Локальный граф знаний', topic:'Заметки', rating:5, keyIdeas:['Markdown','Связи']},
  {id:'mat_tool_4', cat:'tool', emoji:'🛠', title:'Forest', author:'Seekrtech', desc:'Помодоро с деревьями', topic:'Фокус', rating:4, keyIdeas:['Геймификация']},
  {id:'mat_tool_5', cat:'tool', emoji:'🛠', title:'Headspace / Calm', author:'Разное', desc:'Медитации и сон', topic:'Медитация', rating:4, keyIdeas:['Направленные медитации']}
];

/* ============ УВЕДОМЛЕНИЯ — ШАБЛОНЫ ============ */
var NOTIFICATION_TEMPLATES = [
  /* Привычки */
  {id:'notif_habit_morning', cat:'habit', emoji:'🌅', title:'Утренние привычки', text:'Пора выполнить утренние привычки', defaultTime:'07:00'},
  {id:'notif_habit_day',     cat:'habit', emoji:'☀️', title:'Дневные привычки', text:'Не забудь про дневные привычки', defaultTime:'13:00'},
  {id:'notif_habit_evening', cat:'habit', emoji:'🌆', title:'Вечерние привычки', text:'Вечерние привычки ждут', defaultTime:'19:00'},
  {id:'notif_habit_night',   cat:'habit', emoji:'🌙', title:'Ночные привычки', text:'Подготовься ко сну', defaultTime:'22:00'},

  /* Вода */
  {id:'notif_water_1', cat:'water', emoji:'💧', title:'Вода', text:'Выпей стакан воды', defaultTime:'09:00'},
  {id:'notif_water_2', cat:'water', emoji:'💧', title:'Вода', text:'Выпей стакан воды', defaultTime:'12:00'},
  {id:'notif_water_3', cat:'water', emoji:'💧', title:'Вода', text:'Выпей стакан воды', defaultTime:'15:00'},
  {id:'notif_water_4', cat:'water', emoji:'💧', title:'Вода', text:'Выпей стакан воды', defaultTime:'18:00'},

  /* Сон */
  {id:'notif_sleep_wind',  cat:'sleep', emoji:'😴', title:'Готовься ко сну', text:'Через час — спать. Убери телефон', defaultTime:'21:00'},
  {id:'notif_sleep_go',    cat:'sleep', emoji:'🌙', title:'Спать', text:'Пора спать. Ляг до 23:00', defaultTime:'22:30'},
  {id:'notif_sleep_wake',  cat:'sleep', emoji:'⏰', title:'Подъём', text:'Доброе утро! Пора вставать', defaultTime:'07:00'},

  /* Задачи */
  {id:'notif_task_morning', cat:'task', emoji:'📋', title:'Задачи на день', text:'Посмотри свои задачи', defaultTime:'08:00'},
  {id:'notif_task_review',  cat:'task', emoji:'📊', title:'Ревью дня', text:'Подведи итоги дня', defaultTime:'21:00'},

  /* Зрение */
  {id:'notif_eye_20', cat:'eye', emoji:'👁', title:'20-20-20', text:'Посмотри 20 сек на 6 метров', defaultTime:'каждые 20 мин'},

  /* Экран */
  {id:'notif_screen_check', cat:'screen', emoji:'📱', title:'Проверь экран', text:'Сколько ты сегодня в телефоне?', defaultTime:'20:00'},

  /* Тренировка ума */
  {id:'notif_brain_train', cat:'brain', emoji:'🧠', title:'Тренировка ума', text:'5 минут — и мозг свежий', defaultTime:'10:00'},

  /* Антистресс */
  {id:'notif_stress_breath', cat:'stress', emoji:'🌬', title:'Дыхание', text:'Сделай 4-7-8. 2 минуты', defaultTime:'14:00'},

  /* Обучение */
  {id:'notif_learn', cat:'learn', emoji:'🎓', title:'Обучение', text:'15 минут обучения', defaultTime:'18:00'},

  /* Отдых */
  {id:'notif_break', cat:'rest', emoji:'☕', title:'Перерыв', text:'Встань, разомнись 5 минут', defaultTime:'каждые 90 мин'}
];

/* ============ НАСТРОЙКИ УВЕДОМЛЕНИЙ ============ */
var NOTIFICATION_SETTINGS_DEFAULTS = {
  enabled: false,
  sound: false,
  vibration: true,
  habitMorning: true,
  habitDay: true,
  habitEvening: true,
  habitNight: true,
  water: true,
  sleep: true,
  tasks: true,
  eye: true,
  screen: true,
  brain: true,
  stress: true,
  learn: true,
  break: true,
  quietHours: {enabled: true, from: '23:00', to: '07:00'},
  customTimes: {}
};

/* ============ ЭКСПОРТ ============ */
window.LEARNING_GAMES = LEARNING_GAMES;
window.LEARNING_MATERIALS = LEARNING_MATERIALS;
window.NOTIFICATION_TEMPLATES = NOTIFICATION_TEMPLATES;
window.NOTIFICATION_SETTINGS_DEFAULTS = NOTIFICATION_SETTINGS_DEFAULTS;

console.log('[CONTENT2 3/4 ✅] GAMES: total='+LEARNING_GAMES.length+' | MATERIALS: total='+LEARNING_MATERIALS.length+' | NOTIFICATIONS: templates='+NOTIFICATION_TEMPLATES.length);
/* ============================================================
   LIFE OS — CONTENT2.js v1
   ЧАСТЬ 4/4: ХЕЛПЕРЫ + АГРЕГАТОРЫ + ЭКСПОРТ + ФИНАЛ
   ============================================================ */

/* ============ ХЕЛПЕРЫ ДЛЯ ПРИВЫЧЕК ============ */

/* Получить шаблон по id */
function getHabitTemplate(id){
  if(!id)return null;
  for(var i=0;i<HABIT_TEMPLATES.length;i++){
    if(HABIT_TEMPLATES[i].id===id)return HABIT_TEMPLATES[i];
  }
  return null;
}

/* Получить шаблоны по категории */
function getHabitTemplatesByCat(cat){
  if(!cat||cat==='all')return HABIT_TEMPLATES.slice();
  return HABIT_TEMPLATES.filter(function(t){return t.cat===cat});
}

/* Получить категорию по id */
function getHabitCategory(id){
  if(!id)return null;
  for(var i=0;i<HABIT_CATEGORIES.length;i++){
    if(HABIT_CATEGORIES[i].id===id)return HABIT_CATEGORIES[i];
  }
  return null;
}

/* Сколько привычек в каждой категории */
function getHabitCountByCat(){
  var counts={};
  HABIT_CATEGORIES.forEach(function(c){counts[c.id]=0});
  HABIT_TEMPLATES.forEach(function(t){if(counts[t.cat]!==undefined)counts[t.cat]++});
  return counts;
}

/* ============ ХЕЛПЕРЫ ДЛЯ ТРЕНИРОВКИ УМА ============ */

function getBrainGame(id){
  if(!id)return null;
  for(var i=0;i<BRAIN_TRAINING.length;i++){
    if(BRAIN_TRAINING[i].id===id)return BRAIN_TRAINING[i];
  }
  return null;
}

function getBrainGamesByCat(cat){
  if(!cat||cat==='all')return BRAIN_TRAINING.slice();
  return BRAIN_TRAINING.filter(function(g){return g.cat===cat});
}

function getBrainCategory(id){
  for(var i=0;i<BRAIN_CATEGORIES.length;i++){
    if(BRAIN_CATEGORIES[i].id===id)return BRAIN_CATEGORIES[i];
  }
  return null;
}

function getBrainCountByCat(){
  var counts={};
  BRAIN_CATEGORIES.forEach(function(c){counts[c.id]=0});
  BRAIN_TRAINING.forEach(function(g){if(counts[g.cat]!==undefined)counts[g.cat]++});
  return counts;
}

/* ============ ХЕЛПЕРЫ ДЛЯ АНТИСТРЕССА ============ */

function getAntistressPractice(id){
  if(!id)return null;
  for(var i=0;i<ANTISTRESS_PRACTICES.length;i++){
    if(ANTISTRESS_PRACTICES[i].id===id)return ANTISTRESS_PRACTICES[i];
  }
  return null;
}

function getAntistressByCat(cat){
  if(!cat||cat==='all')return ANTISTRESS_PRACTICES.slice();
  return ANTISTRESS_PRACTICES.filter(function(p){return p.cat===cat});
}

function getAntistressCategory(id){
  for(var i=0;i<ANTISTRESS_CATEGORIES.length;i++){
    if(ANTISTRESS_CATEGORIES[i].id===id)return ANTISTRESS_CATEGORIES[i];
  }
  return null;
}

function getAntistressCountByCat(){
  var counts={};
  ANTISTRESS_CATEGORIES.forEach(function(c){counts[c.id]=0});
  ANTISTRESS_PRACTICES.forEach(function(p){if(counts[p.cat]!==undefined)counts[p.cat]++});
  return counts;
}

/* ============ ХЕЛПЕРЫ ДЛЯ ИГР ============ */

function getLearningGame(id){
  if(!id)return null;
  for(var i=0;i<LEARNING_GAMES.length;i++){
    if(LEARNING_GAMES[i].id===id)return LEARNING_GAMES[i];
  }
  return null;
}

function getGamesByCat(cat){
  if(!cat||cat==='all')return LEARNING_GAMES.slice();
  return LEARNING_GAMES.filter(function(g){return g.cat===cat});
}

/* ============ ХЕЛПЕРЫ ДЛЯ МАТЕРИАЛОВ ============ */

function getLearningMaterial(id){
  if(!id)return null;
  for(var i=0;i<LEARNING_MATERIALS.length;i++){
    if(LEARNING_MATERIALS[i].id===id)return LEARNING_MATERIALS[i];
  }
  return null;
}

function getMaterialsByCat(cat){
  if(!cat||cat==='all')return LEARNING_MATERIALS.slice();
  return LEARNING_MATERIALS.filter(function(m){return m.cat===cat});
}

function getMaterialsByTopic(topic){
  if(!topic||topic==='all')return LEARNING_MATERIALS.slice();
  return LEARNING_MATERIALS.filter(function(m){return m.topic===topic});
}

/* ============ АГРЕГАТОР — «ЕДИНАЯ КАРТИНА» ============ */

/* Собирает все данные пользователя в единый объект.
   Используется движком «единая картина» в app.js.
   НЕ зависит от состояния — принимает его параметром. */
function buildUserSnapshot(state){
  if(!state||typeof state!=='object')return null;
  var today=function(){return new Date().toISOString().slice(0,10)};
  var yesterday=function(){var d=new Date();d.setDate(d.getDate()-1);return d.toISOString().slice(0,10)};
  var t=today(), y=yesterday();

  var snapshot={
    date: t,
    habits: {
      total: (state.habits||[]).length,
      completedToday: 0,
      activeStreak: 0,
      bestStreak: 0,
      byCategory: {}
    },
    sleep: {
      lastNight: null,
      avg7: null,
      avg30: null
    },
    screen: {
      today: (state.screenStats||{})[t]||0,
      yesterday: (state.screenStats||{})[y]||0,
      week: 0
    },
    tasks: {
      total: (state.tasks||[]).length,
      pending: 0,
      completedToday: 0,
      overdue: 0
    },
    mood: {
      today: null,
      avg7: null
    },
    water: {
      today: 0,
      goal: (state.settings&&state.settings.waterGoal)||8
    },
    workouts: {
      last7: 0,
      last30: 0
    },
    brain: {
      totalPlays: 0,
      todayPlays: 0,
      avgScore: null
    },
    antistress: {
      todayCount: 0,
      weekCount: 0
    },
    learning: {
      lessonsDone: Object.keys((state.levelProgress||{})).length,
      englishDone: Object.keys((state.englishProgress||{})).length,
      skillsDone: Object.keys((state.skillsProgress||{})).length,
      coursesInProgress: 0
    },
    xp: state.xp||0,
    streak: (state.stats&&state.stats.streak)||0,
    recommendations: []
  };

  /* Привычки */
  if(state.habits&&state.habits.length){
    state.habits.forEach(function(h){
      if(h.lastCompletedDate===t)snapshot.habits.completedToday++;
      if(h.streak>snapshot.habits.activeStreak)snapshot.habits.activeStreak=h.streak;
      if(h.bestStreak>snapshot.habits.bestStreak)snapshot.habits.bestStreak=h.bestStreak;
      var cat=h.category||'other';
      if(!snapshot.habits.byCategory[cat])snapshot.habits.byCategory[cat]={total:0,doneToday:0};
      snapshot.habits.byCategory[cat].total++;
      if(h.lastCompletedDate===t)snapshot.habits.byCategory[cat].doneToday++;
    });
  }

  /* Сон */
  if(state.sleepEntries&&state.sleepEntries.length){
    var lastNight=null;
    for(var i=state.sleepEntries.length-1;i>=0;i--){
      if(state.sleepEntries[i].date===y||state.sleepEntries[i].date===t){lastNight=state.sleepEntries[i];break}
    }
    snapshot.sleep.lastNight=lastNight;
    var last7=state.sleepEntries.slice(-7);
    var last30=state.sleepEntries.slice(-30);
    var sum7=0,c7=0,sum30=0,c30=0;
    last7.forEach(function(s){if(s.hours){sum7+=s.hours;c7++}});
    last30.forEach(function(s){if(s.hours){sum30+=s.hours;c30++}});
    snapshot.sleep.avg7=c7?Math.round(sum7/c7*10)/10:null;
    snapshot.sleep.avg30=c30?Math.round(sum30/c30*10)/10:null;
  }

  /* Экран за неделю */
  var week=0;
  for(var d=0;d<7;d++){
    var dt=new Date();dt.setDate(dt.getDate()-d);
    week+=(state.screenStats||{})[dt.toISOString().slice(0,10)]||0;
  }
  snapshot.screen.week=week;

  /* Задачи */
  if(state.tasks){
    state.tasks.forEach(function(task){
      if(task.status==='pending'){
        snapshot.tasks.pending++;
        if(task.dueDate&&task.dueDate.slice(0,10)<t)snapshot.tasks.overdue++;
      }
      if(task.status==='completed'&&task.completedAt&&task.completedAt.slice(0,10)===t)snapshot.tasks.completedToday++;
    });
  }

  /* Настроение */
  var moods=state.customMood||[];
  var todayMood=moods.find(function(m){return m.date===t});
  if(todayMood)snapshot.mood.today=todayMood.score;
  var last7M=moods.slice(-7);
  if(last7M.length){
    var sumM=0,cM=0;last7M.forEach(function(m){if(m.score){sumM+=m.score;cM++}});
    snapshot.mood.avg7=cM?Math.round(sumM/cM*10)/10:null;
  }

  /* Вода */
  var waterToday=(state.customWater||[]).find(function(w){return w.date===t});
  if(waterToday)snapshot.water.today=waterToday.count||0;

  /* Тренировки */
  var workouts=state.customWorkouts||[];
  var now=Date.now();
  workouts.forEach(function(w){
    var ts=new Date(w.date||w.created_at).getTime();
    if(now-ts<7*86400000)snapshot.workouts.last7++;
    if(now-ts<30*86400000)snapshot.workouts.last30++;
  });

  /* Тренировка ума */
  var brainPlays=state.brainPlays||[];
  snapshot.brain.totalPlays=brainPlays.length;
  var brainToday=brainPlays.filter(function(p){return p.date===t});
  snapshot.brain.todayPlays=brainToday.length;
  if(brainPlays.length){
    var sumB=0,cB=0;
    brainPlays.slice(-20).forEach(function(p){if(typeof p.score==='number'){sumB+=p.score;cB++}});
    snapshot.brain.avgScore=cB?Math.round(sumB/cB):null;
  }

  /* Антистресс */
  var asEntries=state.antistressEntries||[];
  snapshot.antistress.todayCount=asEntries.filter(function(e){return e.date===t}).length;
  var weekAgo=now-7*86400000;
  snapshot.antistress.weekCount=asEntries.filter(function(e){return new Date(e.date).getTime()>=weekAgo}).length;

  /* Обучение */
  var inProgress=0;
  (window.ALL_NEW_COURSES||[]).forEach(function(c){
    var key=c.id+'Progress';
    var done=Object.keys((state[key]||{})).length;
    if(done>0)inProgress++;
  });
  snapshot.learning.coursesInProgress=inProgress;

  /* Рекомендации */
  snapshot.recommendations=generateRecommendations(snapshot);

  return snapshot;
}

/* ============ ГЕНЕРАТОР РЕКОМЕНДАЦИЙ ============ */

function generateRecommendations(snap){
  var recs=[];
  if(!snap)return recs;

  /* Сон */
  if(snap.sleep.avg7!==null&&snap.sleep.avg7<7){
    recs.push({emoji:'😴', priority:1, title:'Сон меньше 7 часов', text:'Средний сон за неделю: '+snap.sleep.avg7+' ч. Ложись на 30 минут раньше.', action:'sleep'});
  }
  if(snap.sleep.avg7!==null&&snap.sleep.avg7>9){
    recs.push({emoji:'😴', priority:3, title:'Слишком много сна', text:'Средний сон за неделю: '+snap.sleep.avg7+' ч. Может быть признаком переутомления.', action:'sleep'});
  }

  /* Экран */
  if(snap.screen.today>240){
    recs.push({emoji:'📱', priority:1, title:'Много экрана', text:'Сегодня '+Math.round(snap.screen.today/60)+' ч. Попробуй час без телефона.', action:'screentracker'});
  }
  if(snap.screen.week>1400){
    recs.push({emoji:'📱', priority:2, title:'Экран за неделю', text:'За 7 дней: '+Math.round(snap.screen.week/60)+' ч. Пора на детокс.', action:'detoxcourse'});
  }

  /* Вода */
  if(snap.water.today<snap.water.goal*0.5){
    recs.push({emoji:'💧', priority:1, title:'Мало воды', text:'Сегодня '+snap.water.today+'/'+snap.water.goal+' стаканов. Выпей 2 стакана прямо сейчас.', action:'water'});
  }

  /* Задачи */
  if(snap.tasks.overdue>0){
    recs.push({emoji:'⚠️', priority:1, title:'Просроченные задачи', text:snap.tasks.overdue+' задач(и) просрочено. Разбери их.', action:'tasks'});
  }
  if(snap.tasks.pending>10){
    recs.push({emoji:'📋', priority:2, title:'Много задач', text:snap.tasks.pending+' активных задач. Используй матрицу Эйзенхауэра.', action:'matrix'});
  }

  /* Настроение */
  if(snap.mood.today!==null&&snap.mood.today<5){
    recs.push({emoji:'❤️', priority:1, title:'Низкое настроение', text:'Настроение '+snap.mood.today+'/10. Прогулка 20 минут или дыхание 4-7-8.', action:'antistress'});
  }
  if(snap.mood.avg7!==null&&snap.mood.avg7<5){
    recs.push({emoji:'❤️', priority:2, title:'Неделя на низком настроении', text:'Средний уровень: '+snap.mood.avg7+'/10. Обрати внимание на сон и активность.', action:'health'});
  }

  /* Привычки */
  if(snap.habits.total===0){
    recs.push({emoji:'🔄', priority:2, title:'Нет привычек', text:'Начни с 1-2 привычек. Выбери шаблон.', action:'habits'});
  } else if(snap.habits.completedToday===0){
    recs.push({emoji:'🔄', priority:1, title:'Привычки не выполнены', text:'Ни одна привычка не отмечена сегодня.', action:'habits'});
  } else if(snap.habits.completedToday<snap.habits.total*0.5){
    recs.push({emoji:'🔄', priority:2, title:'Меньше половины привычек', text:snap.habits.completedToday+'/'+snap.habits.total+' выполнено.', action:'habits'});
  }

  /* Тренировки */
  if(snap.workouts.last7<2){
    recs.push({emoji:'🏋️', priority:2, title:'Мало движения', text:'За неделю: '+snap.workouts.last7+' тренировок. Цель — 3-4.', action:'workouts'});
  }

  /* Тренировка ума */
  if(snap.brain.todayPlays===0){
    recs.push({emoji:'🧠', priority:3, title:'Тренировка ума', text:'5 минут игры — и мозг свежий. Попробуй.', action:'brain'});
  }

  /* Антистресс */
  if(snap.antistress.todayCount===0&&(snap.screen.today>180||snap.mood.today<6)){
    recs.push({emoji:'🌬', priority:2, title:'Пора расслабиться', text:'Дыхание 4-7-8 или медитация 10 минут.', action:'antistress'});
  }

  /* Обучение */
  if(snap.learning.lessonsDone+snap.learning.englishDone+snap.learning.skillsDone<3){
    recs.push({emoji:'🎓', priority:3, title:'Мало обучения', text:'Пройди 1 урок или 1 навык.', action:'learning'});
  }

  /* Сортировка по приоритету */
  recs.sort(function(a,b){return a.priority-b.priority});

  return recs.slice(0,5);
}

/* ============ ЦВЕТА ДЛЯ ЗАДАЧ ============ */
var TASK_COLORS = [
  {id:'tomato',    hex:'#d50000', name:'Помидор'},
  {id:'flamingo',  hex:'#e67c73', name:'Фламинго'},
  {id:'tangerine', hex:'#f4511e', name:'Мандарин'},
  {id:'banana',    hex:'#f6bf26', name:'Банан'},
  {id:'sage',      hex:'#33b679', name:'Шалфей'},
  {id:'basil',     hex:'#0b8043', name:'Базилик'},
  {id:'peacock',   hex:'#039be5', name:'Павлин'},
  {id:'blueberry', hex:'#3f51b5', name:'Черника'},
  {id:'lavender',  hex:'#7986cb', name:'Лаванда'},
  {id:'grape',     hex:'#8e24aa', name:'Виноград'},
  {id:'graphite',  hex:'#616161', name:'Графит'}
];

/* ============ ЭКСПОРТ ВСЕГО ============ */
window.getHabitTemplate = getHabitTemplate;
window.getHabitTemplatesByCat = getHabitTemplatesByCat;
window.getHabitCategory = getHabitCategory;
window.getHabitCountByCat = getHabitCountByCat;

window.getBrainGame = getBrainGame;
window.getBrainGamesByCat = getBrainGamesByCat;
window.getBrainCategory = getBrainCategory;
window.getBrainCountByCat = getBrainCountByCat;

window.getAntistressPractice = getAntistressPractice;
window.getAntistressByCat = getAntistressByCat;
window.getAntistressCategory = getAntistressCategory;
window.getAntistressCountByCat = getAntistressCountByCat;

window.getLearningGame = getLearningGame;
window.getGamesByCat = getGamesByCat;

window.getLearningMaterial = getLearningMaterial;
window.getMaterialsByCat = getMaterialsByCat;
window.getMaterialsByTopic = getMaterialsByTopic;

window.buildUserSnapshot = buildUserSnapshot;
window.generateRecommendations = generateRecommendations;

window.TASK_COLORS = TASK_COLORS;

console.log('[CONTENT2 ✅] ФИНАЛ: HABITS='+HABIT_TEMPLATES.length+' BRAIN='+BRAIN_TRAINING.length+' ANTISTRESS='+ANTISTRESS_PRACTICES.length+' GAMES='+LEARNING_GAMES.length+' MATERIALS='+LEARNING_MATERIALS.length+' NOTIFICATIONS='+NOTIFICATION_TEMPLATES.length+' COLORS='+TASK_COLORS.length);