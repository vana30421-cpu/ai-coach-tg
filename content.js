'use strict';
/* ============================================================
   LIFE OS — CONTENT.js (полный)
   50 тем + эффекты + домены + мудрости + челленджи + режимы
   + опросы + PERSONAS + LEARNING_LEVELS + ACHIEVEMENTS
   + RECOVERY + SCREEN_TIPS + DETOX + VISION
   + COURSES_LIBRARY + PATHS_LIBRARY + METHODS_LIBRARY
   ============================================================ */

/* ============================================================
   ТЕМЫ (50)
   ============================================================ */
var THEMES=[
{id:'dark',emoji:'🌙',name:'Тёмная',bg:'#000',bg2:'#0b0b10',text:'#fff',text2:'rgba(255,255,255,.74)',brand:'#5b9eff',brand2:'#a78bfa',effect:'stars'},
{id:'light',emoji:'☀️',name:'Светлая',bg:'#f0f0f6',bg2:'#ffffff',text:'#000',text2:'rgba(0,0,0,.68)',brand:'#0a84ff',brand2:'#5e5ce6',effect:'none'},
{id:'ocean',emoji:'🌊',name:'Океан',bg:'#000814',bg2:'#001428',text:'#e0fbfc',text2:'rgba(224,251,252,.7)',brand:'#00b4d8',brand2:'#0077b6',effect:'waves'},
{id:'sakura',emoji:'🌸',name:'Сакура',bg:'#1a0f14',bg2:'#2a1a20',text:'#ffe5ec',text2:'rgba(255,229,236,.7)',brand:'#ff8fab',brand2:'#fb6f92',effect:'petals'},
{id:'forest',emoji:'🌲',name:'Лес',bg:'#0a1410',bg2:'#14241c',text:'#e8f5e9',text2:'rgba(232,245,233,.7)',brand:'#52b788',brand2:'#2d6a4f',effect:'leaves'},
{id:'sunset',emoji:'🌅',name:'Закат',bg:'#1a0a05',bg2:'#2a1510',text:'#fff5e6',text2:'rgba(255,245,230,.7)',brand:'#ff7b54',brand2:'#ffb26b',effect:'stars'},
{id:'ice',emoji:'❄️',name:'Лёд',bg:'#0a1419',bg2:'#152a33',text:'#e0f4ff',text2:'rgba(224,244,255,.7)',brand:'#4dd4ff',brand2:'#7ad7ff',effect:'snow'},
{id:'amethyst',emoji:'💎',name:'Аметист',bg:'#12061f',bg2:'#1e0d2f',text:'#f0e5ff',text2:'rgba(240,229,255,.7)',brand:'#b394ff',brand2:'#a78bfa',effect:'spark'},
{id:'pumpkin',emoji:'🎃',name:'Тыква',bg:'#0d0500',bg2:'#1a0d05',text:'#ffeedd',text2:'rgba(255,238,221,.7)',brand:'#ff9500',brand2:'#ff6b00',effect:'dust'},
{id:'vampire',emoji:'🦇',name:'Вампир',bg:'#0a0000',bg2:'#180505',text:'#ffdddd',text2:'rgba(255,221,221,.7)',brand:'#cc0000',brand2:'#8b0000',effect:'dust'},
{id:'ghost',emoji:'👻',name:'Призрак',bg:'#0a0814',bg2:'#14101f',text:'#f0f0ff',text2:'rgba(240,240,255,.7)',brand:'#b0b0ff',brand2:'#8888cc',effect:'spark'},
{id:'web',emoji:'🕸',name:'Паутина',bg:'#001410',bg2:'#002820',text:'#e0fff5',text2:'rgba(224,255,245,.7)',brand:'#00ff88',brand2:'#00aa66',effect:'stars'},
{id:'aurora',emoji:'🌌',name:'Аврора',bg:'#050a15',bg2:'#0a1525',text:'#e0f0ff',text2:'rgba(224,240,255,.7)',brand:'#7bffb5',brand2:'#a78bfa',effect:'waves'},
{id:'desert',emoji:'🏜',name:'Пустыня',bg:'#1a1208',bg2:'#2a1e0f',text:'#fff0dd',text2:'rgba(255,240,221,.7)',brand:'#d4a373',brand2:'#bc6c25',effect:'dust'},
{id:'cyber',emoji:'⚡',name:'Кибер',bg:'#0a0014',bg2:'#15001f',text:'#f0e0ff',text2:'rgba(240,224,255,.7)',brand:'#ff00ff',brand2:'#00ffff',effect:'spark'},
{id:'mono',emoji:'⚫',name:'Моно',bg:'#0a0a0a',bg2:'#141414',text:'#f0f0f0',text2:'rgba(240,240,240,.7)',brand:'#ffffff',brand2:'#cccccc',effect:'none'},
{id:'lava',emoji:'🔥',name:'Лава',bg:'#140000',bg2:'#280505',text:'#ffe0d0',text2:'rgba(255,224,208,.7)',brand:'#ff4400',brand2:'#ff2200',effect:'dust'},
{id:'mint',emoji:'🌿',name:'Мята',bg:'#08140f',bg2:'#0f2419',text:'#e0fff0',text2:'rgba(224,255,240,.7)',brand:'#3ddc97',brand2:'#4dd4ff',effect:'waves'},
{id:'coffee',emoji:'☕',name:'Кофе',bg:'#1a0e08',bg2:'#2a1a12',text:'#fff0e0',text2:'rgba(255,240,224,.7)',brand:'#c68a4e',brand2:'#8b5a2b',effect:'dust'},
{id:'neon',emoji:'💡',name:'Неон',bg:'#000',bg2:'#0a0a0a',text:'#fff',text2:'rgba(255,255,255,.7)',brand:'#00ff88',brand2:'#ff00ff',effect:'spark'},
{id:'sunrise',emoji:'🌄',name:'Рассвет',bg:'#1a0d0a',bg2:'#2a1a12',text:'#fff5e6',text2:'rgba(255,245,230,.7)',brand:'#ffa940',brand2:'#ff6b6b',effect:'stars'},
{id:'rain',emoji:'🌧',name:'Дождь',bg:'#0a1018',bg2:'#141e28',text:'#e0ecf5',text2:'rgba(224,236,245,.7)',brand:'#5b9eff',brand2:'#4dd4ff',effect:'rain'},
{id:'storm',emoji:'⛈',name:'Гроза',bg:'#0a0a14',bg2:'#14141f',text:'#e0e0f0',text2:'rgba(224,224,240,.7)',brand:'#8b8bff',brand2:'#5b5bff',effect:'rain'},
{id:'crystal',emoji:'🔮',name:'Кристалл',bg:'#0a1420',bg2:'#152538',text:'#e0f0ff',text2:'rgba(224,240,255,.7)',brand:'#4dd4ff',brand2:'#a78bfa',effect:'spark'},
{id:'ember',emoji:'🔥',name:'Угли',bg:'#140800',bg2:'#251205',text:'#ffe0c0',text2:'rgba(255,224,192,.7)',brand:'#ff6600',brand2:'#cc3300',effect:'dust'},
{id:'holo',emoji:'🌈',name:'Голограмма',bg:'#000814',bg2:'#001428',text:'#e0f0ff',text2:'rgba(224,240,255,.7)',brand:'#ff00ff',brand2:'#00ffff',effect:'spark'},
{id:'moon',emoji:'🌕',name:'Луна',bg:'#0a0a1a',bg2:'#14142a',text:'#f0f0ff',text2:'rgba(240,240,255,.7)',brand:'#c0c0ff',brand2:'#8888cc',effect:'stars'},
{id:'sand',emoji:'🏖',name:'Песок',bg:'#1a1408',bg2:'#2a2012',text:'#fff5e0',text2:'rgba(255,245,224,.7)',brand:'#d4b483',brand2:'#b8935a',effect:'dust'},
{id:'sakura-night',emoji:'🌺',name:'Сакура-ночь',bg:'#14081a',bg2:'#200d28',text:'#ffe5f0',text2:'rgba(255,229,240,.7)',brand:'#ff6b9d',brand2:'#cc4488',effect:'petals'},
{id:'deep',emoji:'🌊',name:'Глубина',bg:'#000a14',bg2:'#001428',text:'#d0f0ff',text2:'rgba(208,240,255,.7)',brand:'#0088cc',brand2:'#0055aa',effect:'waves'},
{id:'rose',emoji:'🌹',name:'Роза',bg:'#1a0810',bg2:'#2a1018',text:'#ffe5ec',text2:'rgba(255,229,236,.7)',brand:'#ff3366',brand2:'#cc0044',effect:'petals'},
{id:'bamboo',emoji:'🎋',name:'Бамбук',bg:'#0a1408',bg2:'#14240f',text:'#e8f5e0',text2:'rgba(232,245,224,.7)',brand:'#7bc043',brand2:'#4a8a2a',effect:'leaves'},
{id:'cosmos',emoji:'🌠',name:'Космос',bg:'#0a0014',bg2:'#15001f',text:'#f0e0ff',text2:'rgba(240,224,255,.7)',brand:'#b394ff',brand2:'#7b68ee',effect:'stars'},
{id:'matrix',emoji:'💚',name:'Матрица',bg:'#000a00',bg2:'#001400',text:'#d8ffd8',text2:'rgba(216,255,216,.7)',brand:'#00ff00',brand2:'#00aa00',effect:'spark'},
{id:'gold',emoji:'🥇',name:'Золото',bg:'#0a0800',bg2:'#1a1205',text:'#fff5d0',text2:'rgba(255,245,208,.7)',brand:'#ffcc00',brand2:'#ff9900',effect:'spark'},
{id:'silver',emoji:'🥈',name:'Серебро',bg:'#0a0a0f',bg2:'#14141f',text:'#f0f0f5',text2:'rgba(240,240,245,.7)',brand:'#c0c0c8',brand2:'#8888a0',effect:'stars'},
{id:'coral',emoji:'🐠',name:'Коралл',bg:'#1a0e0a',bg2:'#2a1a12',text:'#ffe5d5',text2:'rgba(255,229,213,.7)',brand:'#ff7b6b',brand2:'#ff5555',effect:'waves'},
{id:'nebula',emoji:'🌫',name:'Туманность',bg:'#0a0514',bg2:'#150d1f',text:'#e8e0ff',text2:'rgba(232,224,255,.7)',brand:'#9b7bff',brand2:'#5b4bcc',effect:'stars'},
{id:'polar',emoji:'🧊',name:'Полярная',bg:'#0a1520',bg2:'#152538',text:'#e0f4ff',text2:'rgba(224,244,255,.7)',brand:'#7bc8ff',brand2:'#4d99ff',effect:'snow'},
{id:'jungle',emoji:'🌴',name:'Джунгли',bg:'#0a1a0a',bg2:'#142a14',text:'#e0f5e0',text2:'rgba(224,245,224,.7)',brand:'#3ddc97',brand2:'#00aa66',effect:'leaves'},
{id:'royal',emoji:'👑',name:'Королевская',bg:'#0a0514',bg2:'#150d28',text:'#f0e5ff',text2:'rgba(240,229,255,.7)',brand:'#9b59b6',brand2:'#6b2d9b',effect:'spark'},
{id:'forest-night',emoji:'🌲',name:'Ночной лес',bg:'#08100a',bg2:'#101a12',text:'#d8e8d8',text2:'rgba(216,232,216,.7)',brand:'#4a9e4a',brand2:'#2a6e2a',effect:'dust'},
{id:'fire',emoji:'🔥',name:'Огонь',bg:'#140600',bg2:'#280f05',text:'#ffd5a0',text2:'rgba(255,213,160,.7)',brand:'#ff5500',brand2:'#cc2200',effect:'dust'},
{id:'frost',emoji:'❄',name:'Мороз',bg:'#0a1525',bg2:'#15253a',text:'#e0f0ff',text2:'rgba(224,240,255,.7)',brand:'#88ccff',brand2:'#5599ee',effect:'snow'},
{id:'spirit',emoji:'✨',name:'Дух',bg:'#14082a',bg2:'#200d40',text:'#f0e5ff',text2:'rgba(240,229,255,.7)',brand:'#c88bff',brand2:'#8855cc',effect:'spark'},
{id:'time',emoji:'⏳',name:'Время',bg:'#0a0e14',bg2:'#141a24',text:'#e0e8f0',text2:'rgba(224,232,240,.7)',brand:'#a0a8b8',brand2:'#707888',effect:'stars'},
{id:'money',emoji:'💰',name:'Деньги',bg:'#0a1408',bg2:'#142410',text:'#e8f5d8',text2:'rgba(232,245,216,.7)',brand:'#7bc043',brand2:'#4a8a2a',effect:'spark'},
{id:'love',emoji:'❤️',name:'Любовь',bg:'#1a0810',bg2:'#2a1020',text:'#ffe0e8',text2:'rgba(255,224,232,.7)',brand:'#ff3366',brand2:'#cc0044',effect:'petals'},
{id:'zen',emoji:'🧘',name:'Дзен',bg:'#0a1410',bg2:'#14241c',text:'#e0f0e8',text2:'rgba(224,240,232,.7)',brand:'#6b9e8b',brand2:'#4a7e6b',effect:'leaves'}
];

/* ============================================================
   ДОМЕНЫ (10)
   ============================================================ */
var DOMAINS=[
{id:'physical',emoji:'💪',name:'Физическое',color:'#ff7ba9',desc:'Тело, сила, выносливость'},
{id:'mental',emoji:'🧠',name:'Ментальное',color:'#4dd4ff',desc:'Фокус, память, ясность'},
{id:'emotional',emoji:'❤️',name:'Эмоциональное',color:'#ff6b6b',desc:'Чувства, стресс'},
{id:'spiritual',emoji:'🕊',name:'Духовное',color:'#b394ff',desc:'Смысл, ценности'},
{id:'financial',emoji:'💰',name:'Финансовое',color:'#ffcc4d',desc:'Бюджет, инвестиции'},
{id:'career',emoji:'💼',name:'Карьерное',color:'#3ddc97',desc:'Навыки, позиция'},
{id:'social',emoji:'👥',name:'Социальное',color:'#c4b5fd',desc:'Семья, друзья'},
{id:'environment',emoji:'🏠',name:'Среда',color:'#a4e7ff',desc:'Пространство, свет'},
{id:'recovery',emoji:'⏰',name:'Восстановление',color:'#4dd4ff',desc:'Сон, отдых'},
{id:'digital',emoji:'📱',name:'Цифровое',color:'#ff88cc',desc:'Экран, детокс'}
];

/* ============================================================
   МУДРОСТИ (50)
   ============================================================ */
var DAILY_WISDOMS=[
{text:'Ты не ленивый. Ты либо устал, либо не видишь смысла, либо боишься.',author:'Неизвестный',action:'Запиши, что из 3 — твоё прямо сейчас',apply:'Дневник'},
{text:'Дисциплина — это выбор между тем, что хочешь сейчас, и тем, что хочешь больше всего.',author:'Авраам Линкольн',action:'Назови 1 желание сейчас и 1 цель на год',apply:'Цели'},
{text:'Мы — то, что делаем постоянно. Совершенство — не действие, а привычка.',author:'Аристотель',action:'Добавь 1 привычку на сегодня',apply:'Привычки'},
{text:'Между стимулом и реакцией есть пространство. В нём — наша свобода.',author:'Виктор Франкл',action:'Сделай паузу 6 секунд перед следующей реакцией',apply:'Дыхание'},
{text:'Счастье — это не то, что ты имеешь, а то, что ты чувствуешь.',author:'Даг Хэммершолд',action:'Запиши 3 благодарности',apply:'Благодарность'},
{text:'Ты не можешь вернуться и изменить начало, но можешь начать сейчас и изменить конец.',author:'К.С. Льюис',action:'Сделай 1 действие в течение 2 минут',apply:'Действие'},
{text:'Единственный способ делать великую работу — любить то, что делаешь.',author:'Стив Джобс',action:'Найди 1 вещь, которую делаешь с любовью',apply:'Смысл'},
{text:'Сложнее всего начать действовать, всё остальное зависит только от упорства.',author:'Амелия Эрхарт',action:'Начни с 2 минут',apply:'Действие'},
{text:'Тот, кто владеет собой, владеет миром.',author:'Сенека',action:'Заметь, где потерял контроль сегодня',apply:'Дневник'},
{text:'Мы становимся тем, о чём думаем.',author:'Будда',action:'Понаблюдай 5 минут за мыслями',apply:'Медитация'},
{text:'Победа над собой — величайшая победа.',author:'Платон',action:'Сделай 1 сложное дело',apply:'Действие'},
{text:'Секрет перемен в том, чтобы сосредоточить всю свою энергию не на борьбе со старым, а на создании нового.',author:'Сократ',action:'Опиши, что ты создаёшь вместо старого',apply:'Цели'},
{text:'Если хочешь изменить мир — начни с себя.',author:'Махатма Ганди',action:'Измени 1 маленькую вещь сегодня',apply:'Привычки'},
{text:'Жизнь — это 10% того, что происходит с нами, и 90% того, как мы реагируем.',author:'Чарльз Свиндолл',action:'Пересмотри 1 реакцию сегодня',apply:'Дневник'},
{text:'Каждый день — это новая возможность изменить свою жизнь.',author:'Неизвестный',action:'Что ты изменишь сегодня?',apply:'План'},
{text:'Не сравнивай себя с другими. Сравнивай с собой вчерашним.',author:'Джордан Питерсон',action:'Оцени, насколько ты вырос за неделю',apply:'Статистика'},
{text:'Успех — это сумма маленьких усилий, повторяемых день за днём.',author:'Роберт Кольер',action:'Сделай 1 маленькое усилие сейчас',apply:'Привычки'},
{text:'Всё, что ты можешь сделать, — это начать.',author:'Неизвестный',action:'Начни прямо сейчас (2 минуты)',apply:'Действие'},
{text:'Измени свои мысли — изменится твоя жизнь.',author:'Уэйн Дайер',action:'Замени 1 негативную мысль на позитивную',apply:'КПТ'},
{text:'Великие дела не делаются в зоне комфорта.',author:'Неизвестный',action:'Сделай 1 дело вне комфорта',apply:'Действие'},
{text:'Страх — это не то, что ты должен бояться. Это то, что ты должен преодолеть.',author:'Неизвестный',action:'Сделай 1 страшное дело',apply:'Действие'},
{text:'Ты сильнее, чем кажется. Смелее, чем верится. Умнее, чем думается.',author:'А.А. Милн',action:'Вспомни 1 прошлую победу',apply:'Дневник'},
{text:'Утро определяет день. Начни с правильной привычки.',author:'Робин Шарма',action:'Сделай утренний ритуал',apply:'Привычки'},
{text:'Не трать время на сожаления. Используй его на действие.',author:'Неизвестный',action:'Сделай 1 действие сейчас',apply:'Действие'},
{text:'Ты — не свои мысли. Ты — тот, кто их наблюдает.',author:'Экхарт Толле',action:'5 минут наблюдай мысли',apply:'Медитация'},
{text:'Действие — главный ключ к успеху.',author:'Пабло Пикассо',action:'Сделай 1 конкретное действие',apply:'Действие'},
{text:'Стресс — не то, что происходит, а то, что ты думаешь о происходящем.',author:'Эндрю Бернстейн',action:'Пересмотри 1 стрессовую ситуацию',apply:'КПТ'},
{text:'Разница между тем, кто ты, и тем, кем хочешь быть — в том, что ты делаешь.',author:'Неизвестный',action:'Сделай 1 шаг к цели',apply:'Цели'},
{text:'Сон — основа всего. Приоритет №1.',author:'Мэттью Уокер',action:'Ляг на 30 мин раньше',apply:'Сон'},
{text:'Каждый день делай что-то, что тебя пугает.',author:'Элеонора Рузвельт',action:'Сделай 1 страшное дело',apply:'Действие'},
{text:'Один процент лучше каждый день — вот и весь секрет.',author:'Джеймс Клир',action:'Улучши 1 вещь на 1%',apply:'Привычки'},
{text:'Сначала пойми, потом будь понятым.',author:'Стивен Кови',action:'Активно послушай кого-то 5 минут',apply:'Общение'},
{text:'Твоя жизнь — результат твоих решений.',author:'Неизвестный',action:'Прими 1 решение осознанно',apply:'Решения'},
{text:'Окружение определяет мышление.',author:'Джим Рон',action:'Убери 1 отвлекающий фактор',apply:'Среда'},
{text:'Заботься о теле — это единственное место, где тебе жить.',author:'Джим Рон',action:'Сделай 1 действие для тела',apply:'Здоровье'},
{text:'Ты не найдёшь себя в тишине, если не дашь себе её.',author:'Неизвестный',action:'10 минут тишины без телефона',apply:'Тишина'},
{text:'Отдых — часть работы.',author:'Неизвестный',action:'Сделай перерыв 15 минут',apply:'Восстановление'},
{text:'Смысл жизни в том, чтобы дать ей смысл.',author:'Неизвестный',action:'Запиши 3 вещи, которые важны',apply:'Смысл'},
{text:'Иди медленно, но не останавливайся.',author:'Китайская пословица',action:'Сделай 1 маленький шаг',apply:'Действие'},
{text:'Маленькие шаги ведут к большим переменам.',author:'Неизвестный',action:'Сделай 1 маленький шаг',apply:'Привычки'},
{text:'Заботься о глазах — экран вредит зрению.',author:'Офтальмология',action:'Сделай гимнастику для глаз',apply:'Зрение'},
{text:'Правило 20-20-20: каждые 20 мин — 20 сек на 6 м.',author:'Офтальмология',action:'Запусти таймер 20-20-20',apply:'Зрение'},
{text:'Пальминг — 5 минут тепла для глаз.',author:'Бейтс',action:'Сделай пальминг 3 минуты',apply:'Зрение'},
{text:'Моргай чаще — глаза сохнут от экрана.',author:'Офтальмология',action:'Напомни себе моргать каждые 10 мин',apply:'Зрение'},
{text:'Смотри вдаль — мышцы глаз расслабляются.',author:'Офтальмология',action:'5 минут смотри в окно',apply:'Зрение'},
{text:'Солнце и зрение: 10 мин утром без очков.',author:'Офтальмология',action:'Выйди на 10 мин утром',apply:'Зрение'},
{text:'Черника, морковь, рыба — для глаз.',author:'Нутрициология',action:'Съешь что-то для глаз',apply:'Зрение'},
{text:'Гимнастика для глаз — 5 упражнений утром.',author:'Бейтс',action:'Сделай 5 упражнений',apply:'Зрение'},
{text:'Экран на расстоянии 50-70 см от глаз.',author:'Офтальмология',action:'Отодвинь экран',apply:'Зрение'},
{text:'Тёмный режим снижает нагрузку на глаза.',author:'Офтальмология',action:'Включи тёмный режим',apply:'Зрение'}
];

function getTodayWisdom(){
  try{
    if(!window.DAILY_WISDOMS||!window.DAILY_WISDOMS.length)return{text:'Начни.',author:'Неизвестный',action:'Сделай 1 шаг',apply:'Действие'};
    var i=Math.floor(Date.now()/86400000)%window.DAILY_WISDOMS.length;
    return window.DAILY_WISDOMS[i];
  }catch(e){return{text:'Начни.',author:'Неизвестный',action:'Сделай 1 шаг',apply:'Действие'}}
}

/* ============================================================
   ЧЕЛЛЕНДЖИ (55)
   ============================================================ */
var DAILY_CHALLENGES=[
{id:'ch_no_social_1h',title:'1 час без соцсетей',desc:'Не открывай соцсети 1 час',reward:20,category:'digital'},
{id:'ch_3_tasks',title:'3 задачи',desc:'Выполни 3 задачи',reward:30,category:'productivity'},
{id:'ch_water_8',title:'8 стаканов воды',desc:'Выпей 8 стаканов',reward:25,category:'health'},
{id:'ch_no_phone_morning',title:'Утро без телефона',desc:'30 минут без телефона',reward:25,category:'digital'},
{id:'ch_meditation_10',title:'10 минут медитации',desc:'Медитируй 10 минут',reward:20,category:'emotional'},
{id:'ch_walk_30',title:'Прогулка 30 минут',desc:'Прогуляйся 30 мин',reward:25,category:'health'},
{id:'ch_deep_work_90',title:'Deep Work 90',desc:'90 минут глубокой работы',reward:40,category:'productivity'},
{id:'ch_read_20',title:'Чтение 20 мин',desc:'Прочти 20 минут',reward:20,category:'mental'},
{id:'ch_journal',title:'Дневник вечером',desc:'Запиши 3 победы + 1 урок',reward:20,category:'emotional'},
{id:'ch_workout',title:'Тренировка',desc:'Сделай тренировку',reward:35,category:'health'},
{id:'ch_no_sugar',title:'Без сахара',desc:'День без сахара',reward:25,category:'health'},
{id:'ch_gratitude_3',title:'3 благодарности',desc:'Запиши 3 благодарности',reward:15,category:'spiritual'},
{id:'ch_english_15',title:'Английский 15 мин',desc:'Позанимайся английским',reward:20,category:'mental'},
{id:'ch_eye_gym',title:'Гимнастика глаз',desc:'10 упражнений для глаз',reward:15,category:'health'},
{id:'ch_palming',title:'Пальминг',desc:'5 минут пальминга',reward:10,category:'health'},
{id:'ch_20_20_20',title:'Правило 20-20-20',desc:'Соблюдай весь день',reward:20,category:'health'},
{id:'ch_sleep_early',title:'Сон до 23:00',desc:'Ляг спать до 23:00',reward:25,category:'health'},
{id:'ch_cold_shower',title:'Холодный душ',desc:'2 минуты холодной воды',reward:25,category:'health'},
{id:'ch_nature_30',title:'Природа 30 мин',desc:'Прогулка на природе',reward:20,category:'spiritual'},
{id:'ch_no_phone_bed',title:'Телефон вне спальни',desc:'Ночь без телефона',reward:25,category:'digital'},
{id:'ch_learn_lesson',title:'1 урок обучения',desc:'Пройди урок',reward:20,category:'mental'},
{id:'ch_1_goal',title:'Прогресс к цели',desc:'Сделай шаг к цели',reward:25,category:'productivity'},
{id:'ch_breathing_478',title:'Дыхание 4-7-8',desc:'4 цикла утром и вечером',reward:15,category:'emotional'},
{id:'ch_no_phone_lunch',title:'Обед без экрана',desc:'30 минут без телефона',reward:20,category:'digital'},
{id:'ch_walk_20',title:'Прогулка 20 мин',desc:'Без телефона',reward:15,category:'health'},
{id:'ch_no_phone_1h',title:'1 час без телефона',desc:'Полный цифровой детокс',reward:30,category:'digital'},
{id:'ch_veggies_500',title:'500 г овощей',desc:'Съешь 500 г овощей',reward:25,category:'health'},
{id:'ch_protein_16',title:'1.6 г белка/кг',desc:'Достаточно белка',reward:25,category:'health'},
{id:'ch_journal_deep',title:'Глубокий дневник',desc:'15 минут письма',reward:25,category:'emotional'},
{id:'ch_5_things_learned',title:'5 новых вещей',desc:'Узнай 5 новых фактов',reward:20,category:'mental'},
{id:'ch_creative',title:'Творчество',desc:'30 минут творчества',reward:25,category:'emotional'},
{id:'ch_social',title:'Живое общение',desc:'Позвони близкому',reward:20,category:'social'},
{id:'ch_family_time',title:'Время с семьёй',desc:'1 час без телефонов',reward:30,category:'social'},
{id:'ch_no_phone_2h',title:'2 часа без телефона',desc:'Полный детокс',reward:40,category:'digital'},
{id:'ch_review_week',title:'Ревью недели',desc:'30 минут анализа',reward:25,category:'productivity'},
{id:'ch_plan_day',title:'План на завтра',desc:'3 задачи',reward:15,category:'productivity'},
{id:'ch_mobility',title:'Мобильность 10 мин',desc:'Растяжка всего тела',reward:15,category:'health'},
{id:'ch_sunlight_10',title:'Солнце 10 мин',desc:'Утренний свет',reward:15,category:'health'},
{id:'ch_deep_breath',title:'Дыхание 5 мин',desc:'Box breathing',reward:15,category:'emotional'},
{id:'ch_finance_check',title:'Финансовый чек',desc:'Запиши расходы за день',reward:20,category:'finance'},
{id:'ch_learn_english_30',title:'English 30 мин',desc:'Погружение',reward:25,category:'mental'},
{id:'ch_single_task',title:'Одна задача',desc:'90 минут без отвлечений',reward:35,category:'productivity'},
{id:'ch_eye_break',title:'Перерыв для глаз',desc:'Каждые 30 мин — отдых',reward:15,category:'health'},
{id:'ch_no_phone_eve',title:'Вечер без телефона',desc:'2 часа до сна',reward:25,category:'digital'},
{id:'ch_hydration_check',title:'Проверка воды',desc:'Утром 500 мл',reward:15,category:'health'},
{id:'ch_stretch_morning',title:'Утренняя растяжка',desc:'10 минут',reward:15,category:'health'},
{id:'ch_mindful_meal',title:'Осознанная еда',desc:'1 приём без телефона',reward:20,category:'health'},
{id:'ch_kindness',title:'Доброе дело',desc:'Помоги кому-то',reward:25,category:'social'},
{id:'ch_learning_new',title:'Новый факт',desc:'Узнай 1 новое',reward:15,category:'mental'},
{id:'ch_clean_space',title:'Уборка 15 мин',desc:'Очисти 1 уголок',reward:20,category:'environment'},
{id:'ch_music',title:'Музыка 30 мин',desc:'Послушай или играй',reward:15,category:'emotional'},
{id:'ch_reading_night',title:'Чтение вечером',desc:'30 минут',reward:20,category:'mental'},
{id:'ch_smile',title:'Улыбка 5 раз',desc:'Улыбнись 5 людям',reward:15,category:'social'},
{id:'ch_no_news',title:'Без новостей',desc:'День без новостей',reward:20,category:'digital'}
];

function todayKey(){return new Date().toISOString().slice(0,10)}
function yesterdayKey(){var d=new Date();d.setDate(d.getDate()-1);return d.toISOString().slice(0,10)}

function getTodayChallenges(){
  var dayIdx=Math.floor(Date.now()/86400000);
  var pool=DAILY_CHALLENGES.slice();
  var result=[];
  var off=dayIdx%pool.length,i=0;
  while(result.length<3&&i<pool.length){
    var ch=pool[(off+i)%pool.length];
    if(result.indexOf(ch)<0)result.push(ch);
    i++;
  }
  return result;
}

/* ============================================================
   РЕЖИМЫ (4)
   ============================================================ */
var WORK_MODES=[
{id:'work',name:'Работа',emoji:'💼',desc:'Только задачи и продуктивность',color:'#5b9eff'},
{id:'rest',name:'Отдых',emoji:'🌿',desc:'Только досуг и здоровье',color:'#3ddc97'},
{id:'sleep',name:'Сон',emoji:'🌙',desc:'Только медитация и сон',color:'#a78bfa'},
{id:'study',name:'Учёба',emoji:'📚',desc:'Только обучение и английский',color:'#ffa940'}
];

/* ============================================================
   SURVEY (27)
   ============================================================ */
var SURVEY_QUESTIONS=[
{id:'name',question:'Как тебя зовут?',type:'text'},
{id:'age',question:'Сколько тебе лет?',type:'options',options:[{value:'18-25',label:'18-25',emoji:'🧑'},{value:'26-35',label:'26-35',emoji:'👨‍💼'},{value:'36-45',label:'36-45',emoji:'👩‍💼'},{value:'46-55',label:'46-55',emoji:'🧓'},{value:'56+',label:'56+',emoji:'👴'}]},
{id:'occupation',question:'Чем занимаешься?',type:'options',options:[{value:'it',label:'IT/Разработка',emoji:'💻'},{value:'business',label:'Бизнес',emoji:'💼'},{value:'creative',label:'Творчество',emoji:'🎨'},{value:'medicine',label:'Медицина',emoji:'⚕️'},{value:'education',label:'Образование',emoji:'📚'},{value:'student',label:'Учусь',emoji:'🎓'},{value:'other',label:'Другое',emoji:'🔷'}]},
{id:'mainGoal',question:'Главная цель?',type:'options',options:[{value:'health',label:'Улучшить здоровье',emoji:'❤️'},{value:'productivity',label:'Продуктивнее',emoji:'⚡'},{value:'mental',label:'Психическое равновесие',emoji:'🧠'},{value:'career',label:'Карьера и деньги',emoji:'💰'},{value:'relationships',label:'Отношения',emoji:'💞'},{value:'meaning',label:'Найти смысл',emoji:'🕊'},{value:'discipline',label:'Дисциплина',emoji:'⚔️'}]},
{id:'biggestChallenge',question:'Что мешает больше всего?',type:'options',options:[{value:'procrastination',label:'Прокрастинация',emoji:'⏳'},{value:'anxiety',label:'Тревога',emoji:'🌊'},{value:'burnout',label:'Выгорание',emoji:'🔥'},{value:'sleep',label:'Плохой сон',emoji:'😴'},{value:'focus',label:'Нет концентрации',emoji:'🎯'},{value:'energy',label:'Нет энергии',emoji:'🔋'},{value:'money',label:'Финансы',emoji:'💰'},{value:'screen',label:'Экранное время',emoji:'📱'}]},
{id:'currentMood',question:'Как ты сейчас?',type:'options',options:[{value:'great',label:'Отлично',emoji:'😊'},{value:'ok',label:'Нормально',emoji:'🙂'},{value:'low',label:'Подавленно',emoji:'😔'},{value:'anxious',label:'Тревожно',emoji:'😰'},{value:'exhausted',label:'Истощён',emoji:'😩'}]},
{id:'sleepHours',question:'Сколько спишь?',type:'options',options:[{value:'<5',label:'Меньше 5',emoji:'😵'},{value:'5-6',label:'5-6 ч',emoji:'😴'},{value:'6-7',label:'6-7 ч',emoji:'🙄'},{value:'7-8',label:'7-8 ч',emoji:'😊'},{value:'8+',label:'Больше 8',emoji:'😌'}]},
{id:'wakeTime',question:'Во сколько встаёшь?',type:'options',options:[{value:'before-6',label:'До 6:00',emoji:'🌅'},{value:'6-7',label:'6:00-7:00',emoji:'☀️'},{value:'7-9',label:'7:00-9:00',emoji:'🌤'},{value:'after-9',label:'После 9:00',emoji:'🌞'},{value:'chaos',label:'Хаотично',emoji:'🎲'}]},
{id:'activityLevel',question:'Сколько двигаешься?',type:'options',options:[{value:'none',label:'Почти не двигаюсь',emoji:'🪑'},{value:'light',label:'Лёгкая активность',emoji:'🚶'},{value:'moderate',label:'Спорт 2-3/нед',emoji:'🏃'},{value:'active',label:'Спорт 4+/нед',emoji:'🏋️'}]},
{id:'stressLevel',question:'Уровень стресса?',type:'options',options:[{value:'low',label:'Низкий',emoji:'😌'},{value:'medium',label:'Средний',emoji:'😐'},{value:'high',label:'Высокий',emoji:'😰'},{value:'chronic',label:'Хронический',emoji:'🥵'}]},
{id:'focusLevel',question:'Как с концентрацией?',type:'options',options:[{value:'excellent',label:'Отличная',emoji:'🎯'},{value:'good',label:'Хорошая',emoji:'👍'},{value:'average',label:'Средняя',emoji:'🤔'},{value:'poor',label:'Плохая',emoji:'😵‍💫'}]},
{id:'screenTime',question:'Сколько экрана?',type:'options',options:[{value:'<2',label:'Меньше 2 ч',emoji:'🌿'},{value:'2-4',label:'2-4 ч',emoji:'📱'},{value:'4-6',label:'4-6 ч',emoji:'😬'},{value:'6+',label:'Больше 6 ч',emoji:'🧟'}]},
{id:'healthIssues',question:'Есть проблемы со здоровьем?',type:'multi',options:[{value:'none',label:'Нет',emoji:'✅'},{value:'back',label:'Спина/шея',emoji:'🦴'},{value:'headaches',label:'Головные боли',emoji:'🤕'},{value:'sleep',label:'Сон',emoji:'😴'},{value:'digestion',label:'ЖКТ',emoji:'🥗'},{value:'heart',label:'Сердце/давление',emoji:'❤️'},{value:'mental',label:'Психика',emoji:'🧠'},{value:'eyes',label:'Зрение',emoji:'👁'}]},
{id:'timeAvailable',question:'Сколько времени в день?',type:'options',options:[{value:'15min',label:'15 минут',emoji:'⏱'},{value:'30min',label:'30 минут',emoji:'🕐'},{value:'1h',label:'1 час',emoji:'⏰'},{value:'2h',label:'2 часа',emoji:'🕰'},{value:'3h+',label:'3+ часа',emoji:'⏳'}]},
{id:'learningStyle',question:'Как учишься лучше?',type:'options',options:[{value:'visual',label:'Образами',emoji:'👁'},{value:'auditory',label:'Слушаю',emoji:'👂'},{value:'kinesthetic',label:'Практикой',emoji:'✋'},{value:'reading',label:'Читаю',emoji:'📖'},{value:'mixed',label:'Смешанно',emoji:'🔄'}]},
{id:'motivationType',question:'Что мотивирует?',type:'options',options:[{value:'meaning',label:'Смысл',emoji:'🕊'},{value:'achievement',label:'Достижения',emoji:'🏆'},{value:'curiosity',label:'Интерес',emoji:'🔍'},{value:'reward',label:'Награды',emoji:'💰'},{value:'people',label:'Люди',emoji:'👥'}]},
{id:'financialStatus',question:'Финансы?',type:'options',options:[{value:'crisis',label:'Кризис',emoji:'🆘'},{value:'tight',label:'Впритык',emoji:'😬'},{value:'stable',label:'Стабильно',emoji:'🙂'},{value:'comfortable',label:'Комфортно',emoji:'😊'},{value:'investing',label:'Инвестиции',emoji:'📈'}]},
{id:'relationshipStatus',question:'Отношения?',type:'options',options:[{value:'single',label:'Один/одна',emoji:'🙋'},{value:'relationship',label:'В отношениях',emoji:'💑'},{value:'family',label:'Семья, дети',emoji:'👨‍👩‍👧'},{value:'complicated',label:'Сложно',emoji:'😕'}]},
{id:'energyPeak',question:'Пик энергии?',type:'options',options:[{value:'morning',label:'Утром',emoji:'🌅'},{value:'midday',label:'Днём',emoji:'☀️'},{value:'evening',label:'Вечером',emoji:'🌆'},{value:'night',label:'Ночью',emoji:'🌙'}]},
{id:'workStyle',question:'Как работаешь лучше?',type:'options',options:[{value:'deep',label:'Сессии 90+ мин',emoji:'🎯'},{value:'sprints',label:'Спринты 25 мин',emoji:'⚡'},{value:'mixed',label:'Смешанно',emoji:'🔄'}]},
{id:'biggestDream',question:'Мечта, если бы всё сработало?',type:'text'},
{id:'firstChange',question:'Что менять первым?',type:'text'},
{id:'howFoundUs',question:'Как узнал?',type:'options',options:[{value:'friend',label:'От друга',emoji:'👥'},{value:'telegram',label:'Telegram',emoji:'✈️'},{value:'search',label:'Поиск',emoji:'🔍'},{value:'other',label:'Другое',emoji:'🔷'}]},
{id:'reminderTime',question:'Когда напоминать?',type:'options',options:[{value:'morning',label:'Утром 8:00',emoji:'🌅'},{value:'midday',label:'Днём 14:00',emoji:'☀️'},{value:'evening',label:'Вечером 20:00',emoji:'🌆'},{value:'never',label:'Не надо',emoji:'🚫'}]},
{id:'languages',question:'Языки для AI?',type:'multi',options:[{value:'ru',label:'Русский',emoji:'🇷🇺'},{value:'en',label:'English',emoji:'🇬🇧'},{value:'de',label:'Deutsch',emoji:'🇩🇪'},{value:'es',label:'Español',emoji:'🇪🇸'}]},
{id:'sessionPreference',question:'Длина сессии?',type:'options',options:[{value:'5min',label:'5 минут',emoji:'☕'},{value:'10min',label:'10 минут',emoji:'📱'},{value:'20min',label:'20 минут',emoji:'⏱'},{value:'30+',label:'30+ минут',emoji:'🎯'}]},
{id:'privacyLevel',question:'Приватность?',type:'options',options:[{value:'full',label:'Полная',emoji:'🔒'},{value:'partial',label:'Частичная',emoji:'🔓'},{value:'minimal',label:'Минимум',emoji:'👤'}]},
{id:'englishLevel',question:'Уровень английского?',type:'options',options:[{value:'beginner',label:'Beginner (A1-A2)',emoji:'🆕'},{value:'intermediate',label:'Intermediate (B1-B2)',emoji:'📘'},{value:'advanced',label:'Advanced (C1-C2)',emoji:'🎓'},{value:'native',label:'Native',emoji:'🇬🇧'}]},
{id:'visionLevel',question:'Как со зрением?',type:'options',options:[{value:'excellent',label:'Отлично',emoji:'👁'},{value:'good',label:'Хорошо',emoji:'👁‍🗨'},{value:'tired',label:'Устают глаза',emoji:'😑'},{value:'glasses',label:'Ношу очки',emoji:'👓'},{value:'lenses',label:'Линзы',emoji:'👀'}]}
];

/* ============================================================
   TABS (7)
   ============================================================ */
var TABS=[
{id:'dashboard',emoji:'🏠',label:'Главная'},
{id:'tasks',emoji:'✅',label:'Задачи'},
{id:'learning',emoji:'🎓',label:'Обучение'},
{id:'planning',emoji:'📅',label:'План'},
{id:'vision',emoji:'👁',label:'Зрение'},
{id:'ai',emoji:'✨',label:'AI'},
{id:'more',emoji:'⋯',label:'Ещё'}
];

/* ============================================================
   QUICK TABS
   ============================================================ */
var QUICK_TABS={
learning:[
{id:'all',emoji:'📚',label:'Всё',target:null},
{id:'plan',emoji:'🗓',label:'План',target:'learnplan'},
{id:'levels',emoji:'🌱',label:'Уровни',target:'levels'},
{id:'english',emoji:'🇬🇧',label:'English',target:'english'},
{id:'skills',emoji:'💎',label:'Навыки',target:'skills'},
{id:'courses',emoji:'📖',label:'Курсы',target:'courses'},
{id:'paths',emoji:'🗺',label:'Пути',target:'paths'},
{id:'methods',emoji:'🎯',label:'Методики',target:'methods'}
],
english:[
{id:'all',emoji:'📚',label:'Все',target:null},
{id:'A1',emoji:'🟢',label:'A1',target:null,filter:'A1'},
{id:'A2',emoji:'🟡',label:'A2',target:null,filter:'A2'},
{id:'B1',emoji:'🟠',label:'B1',target:null,filter:'B1'},
{id:'B2',emoji:'🔵',label:'B2',target:null,filter:'B2'},
{id:'C1',emoji:'🟣',label:'C1',target:null,filter:'C1'}
],
planning:[
{id:'today',emoji:'📅',label:'День',target:'plantoday'},
{id:'week',emoji:'🗓',label:'Неделя',target:'planweek'},
{id:'month',emoji:'📆',label:'Месяц',target:'planmonth'},
{id:'obsidian',emoji:'📓',label:'Obsidian',target:'obsidian'},
{id:'gcal',emoji:'📅',label:'Google Cal',target:'gcal'}
],
vision:[
{id:'overview',emoji:'👁',label:'Обзор',target:'vision'},
{id:'exercises',emoji:'🤸',label:'Упражнения',target:'visionex'},
{id:'tracker',emoji:'📊',label:'Трекер',target:'visiontrack'},
{id:'tips',emoji:'💡',label:'Советы',target:'visiontips'}
],
tasks:[
{id:'all',emoji:'📋',label:'Все',target:null},
{id:'pending',emoji:'⏳',label:'Активные',target:null,filter:'pending'},
{id:'completed',emoji:'✅',label:'Готовые',target:null,filter:'completed'},
{id:'matrix',emoji:'🔢',label:'Матрица',target:'matrix'},
{id:'dailyplan',emoji:'📅',label:'План',target:'dailyplan'}
]
};

/* ============================================================
   PERSONAS (7)
   ============================================================ */
var PERSONAS={
coach:{name:'Коуч',color:'coach',label:'Продуктивность 80 лет',emoji:'💬',prompt:'Ты — AI-Коуч с 80-летним опытом. GROW, SMART, Deep Work, Икигай. 150-220 слов.'},
psych:{name:'Психолог',color:'psych',label:'Клинический 80 лет',emoji:'🧠',prompt:'Ты — AI-Психолог. КПТ, ACT, DBT. НЕ ставь диагнозы! Кризис → 8-800-2000-122. 150-220 слов.'},
doctor:{name:'Врач',color:'doctor',label:'Медицина 80 лет',emoji:'⚕️',prompt:'Ты — AI-Врач. НЕ ставь диагнозы. ВСЕГДА дисклеймер. Острые → 103/112.'},
nutrition:{name:'Нутрициолог',color:'nutrition',label:'Питание 80 лет',emoji:'🥗',prompt:'Ты — AI-Нутрициолог. 150-200 слов.'},
fitness:{name:'Тренер',color:'fitness',label:'Фитнес 80 лет',emoji:'🏋️',prompt:'Ты — AI-Фитнес-тренер. 150-200 слов.'},
vision:{name:'Офтальмолог',color:'psych',label:'Зрение',emoji:'👁',prompt:'Ты — AI-Офтальмолог. Советы по зрению, гимнастика, профилактика. НЕ ставь диагнозы.'},
finance:{name:'Финансист',color:'finance',label:'Финансы 80 лет',emoji:'💰',prompt:'Ты — AI-Финансовый консультант. 150-200 слов.'}
};

/* ============================================================
   LEARNING_LEVELS (5×3×3 = 45)
   ============================================================ */
var LEARNING_LEVELS=[
{id:'lvl1',num:1,emoji:'🌱',title:'Основы',subtitle:'Старт пути',desc:'Базовые принципы',
  modules:[
    {id:'m1_1',emoji:'💪',title:'Здоровье',desc:'Сон, вода, движение',
      lessons:[
        {title:'Сон',theory:'**7-9 часов.** Медленный сон = факты, REM = эмоции.',practice:'Ляг раньше.'},
        {title:'Вода',theory:'**30 мл/кг.** Утром 500 мл.',practice:'8 стаканов.'},
        {title:'Движение',theory:'**150 мин кардио + 2 силовые.**',practice:'20 мин прогулка.'}
      ]},
    {id:'m1_2',emoji:'🧠',title:'Мышление',desc:'База',
      lessons:[
        {title:'Продуктивность',theory:'**Результат, не занятость.**',practice:'3 дела.'},
        {title:'Приоритеты',theory:'**Матрица Эйзенхауэра.**',practice:'5 задач.'},
        {title:'Привычки',theory:'**Петля привычки.** 66 дней.',practice:'1 привычка.'}
      ]},
    {id:'m1_3',emoji:'🎯',title:'Цели',desc:'Постановка',
      lessons:[
        {title:'SMART',theory:'**Specific, Measurable, Achievable, Relevant, Time.**',practice:'1 цель.'},
        {title:'OKR',theory:'**Objectives + Key Results.**',practice:'3 KR.'},
        {title:'Планирование',theory:'**5 лет → 1 год → месяц → неделя.**',practice:'5-летний план.'}
      ]}
  ]},
{id:'lvl2',num:2,emoji:'⚡',title:'Практика',subtitle:'Углубление',desc:'Техники',
  modules:[
    {id:'m2_1',emoji:'🎯',title:'Deep Work',desc:'Глубокая работа',
      lessons:[
        {title:'Deep Work',theory:'**90 мин блок ×3-4 = 10 часов.**',practice:'1 блок.'},
        {title:'Pomodoro',theory:'**25/5 ×4.**',practice:'4 помидора.'},
        {title:'Time-blocking',theory:'**Слоты.**',practice:'Заблокируй.'}
      ]},
    {id:'m2_2',emoji:'❤️',title:'EQ',desc:'Эмоции',
      lessons:[
        {title:'5 компонентов',theory:'**Самосознание, регуляция, мотивация, эмпатия, соц.**',practice:'Дневник.'},
        {title:'Пауза 6 сек',theory:'**Между стимулом и реакцией.**',practice:'Пауза.'},
        {title:'Эмпатия',theory:'**Слушай, не советуй.**',practice:'1 разговор.'}
      ]},
    {id:'m2_3',emoji:'💰',title:'Финансы',desc:'База',
      lessons:[
        {title:'50/30/20',theory:'**50% нужды, 30% желания, 20% сбережения.**',practice:'Бюджет.'},
        {title:'Подушка',theory:'**3-6 месяцев.**',practice:'Открой счёт.'},
        {title:'Инвестиции',theory:'**Индексные фонды, DCA.**',practice:'3 фонда.'}
      ]}
  ]},
{id:'lvl3',num:3,emoji:'💎',title:'Мастерство',subtitle:'Продвинутый',desc:'Техники+',
  modules:[
    {id:'m3_1',emoji:'🔬',title:'Нейро',desc:'Мозг',
      lessons:[
        {title:'Нейропластичность',theory:'**Мозг меняется.**',practice:'30 дней.'},
        {title:'Дофамин',theory:'**Предвкушение.**',practice:'Голодание 4ч.'},
        {title:'Сон и память',theory:'**Консолидация.**',practice:'Учи перед сном.'}
      ]},
    {id:'m3_2',emoji:'👑',title:'Лидерство',desc:'Люди',
      lessons:[
        {title:'Level 5',theory:'**Скромность + воля.**',practice:'Развивай 1.'},
        {title:'Делегирование',theory:'**Не делай сам.**',practice:'3 задачи.'},
        {title:'SBI-фидбэк',theory:'**Situation-Behavior-Impact.**',practice:'1 раз.'}
      ]},
    {id:'m3_3',emoji:'🌐',title:'Стратегия',desc:'Долгосрочно',
      lessons:[
        {title:'Второй порядок',theory:'**А что потом? ×3.**',practice:'3 решения.'},
        {title:'Инверсия',theory:'**Что мешает?**',practice:'3 цели.'},
        {title:'Первые принципы',theory:'**До основы.**',practice:'1 проблема.'}
      ]}
  ]},
{id:'lvl4',num:4,emoji:'🏆',title:'Мастер',subtitle:'Эксперт',desc:'Сложное',
  modules:[
    {id:'m4_1',emoji:'🎓',title:'Менторство',desc:'Учить',
      lessons:[
        {title:'Ментор',theory:'**Вопросы > советы.**',practice:'Найди менти.'},
        {title:'GROW',theory:'**Goal-Reality-Options-Will.**',practice:'1 сессия.'},
        {title:'Учить других',theory:'**Объясни — пойми.**',practice:'3 темы.'}
      ]},
    {id:'m4_2',emoji:'🌍',title:'Системы',desc:'Целое',
      lessons:[
        {title:'Системы vs цели',theory:'**Система = результат.**',practice:'3 системы.'},
        {title:'Обратные связи',theory:'**Петли.**',practice:'3 петли.'},
        {title:'Точки воздействия',theory:'**Максимум.**',practice:'1 точка.'}
      ]},
    {id:'m4_3',emoji:'🕊',title:'Смысл',desc:'Зачем',
      lessons:[
        {title:'Икигай',theory:'**4 сферы.**',practice:'4 списка.'},
        {title:'Логотерапия',theory:'**3 источника.**',practice:'Найди своё.'},
        {title:'Наследие',theory:'**Что оставишь?**',practice:'Эпитафия.'}
      ]}
  ]},
{id:'lvl5',num:5,emoji:'🌟',title:'Легенда',subtitle:'Мастер',desc:'Всё вместе',
  modules:[
    {id:'m5_1',emoji:'🧘',title:'Мудрость',desc:'Глубина',
      lessons:[
        {title:'Стоицизм',theory:'**Дихотомия.**',practice:'Вечером.'},
        {title:'Memento Mori',theory:'**Помни.**',practice:'Эпитафия.'},
        {title:'Присутствие',theory:'**Здесь и сейчас.**',practice:'10 мин.'}
      ]},
    {id:'m5_2',emoji:'💫',title:'Интеграция',desc:'Всё',
      lessons:[
        {title:'10 доменов',theory:'**Баланс.**',practice:'Оцени.'},
        {title:'Свой путь',theory:'**Уникальность.**',practice:'Опиши.'},
        {title:'Передача',theory:'**Учи.**',practice:'Гайд.'}
      ]},
    {id:'m5_3',emoji:'🚀',title:'Будущее',desc:'Дальше',
      lessons:[
        {title:'10 лет',theory:'**Куда?**',practice:'Опиши.'},
        {title:'Наследие',theory:'**После тебя.**',practice:'3 пункта.'},
        {title:'Продолжение',theory:'**Путь.**',practice:'План.'}
      ]}
  ]}
];

/* ============================================================
   ACHIEVEMENTS (33)
   ============================================================ */
var ACHIEVEMENTS=[
{id:'first_task',icon:'✅',name:'Первая задача',check:function(s){return s.tasks.some(function(t){return t.status==='completed'})},progress:function(s){return s.tasks.filter(function(t){return t.status==='completed'}).length>0?1:0}},
{id:'first_lesson',icon:'🎓',name:'Первый урок',check:function(s){return Object.keys(s.levelProgress||{}).length>=1},progress:function(s){return Math.min(1,Object.keys(s.levelProgress||{}).length)}},
{id:'first_skill',icon:'💎',name:'Первый навык',check:function(s){return Object.keys(s.skillsProgress||{}).length>=1},progress:function(s){return Math.min(1,Object.keys(s.skillsProgress||{}).length)}},
{id:'first_water',icon:'💧',name:'Первая вода',check:function(s){return (s.customWater||[]).some(function(w){return w.count>=1})},progress:function(s){return s.customWater&&s.customWater.length>0?1:0}},
{id:'first_mood',icon:'💭',name:'Первое настроение',check:function(s){return (s.customMood||[]).length>=1},progress:function(s){return Math.min(1,(s.customMood||[]).length)}},
{id:'first_eye',icon:'👁',name:'Первое упражнение для глаз',check:function(s){return (s.eyeExercises||[]).length>=1},progress:function(s){return Math.min(1,(s.eyeExercises||[]).length)}},
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
{id:'eye_10',icon:'👁',name:'10 упражнений глаз',check:function(s){return (s.eyeExercises||[]).length>=10},progress:function(s){return Math.min(1,(s.eyeExercises||[]).length/10)}},
{id:'eye_30',icon:'👀',name:'30 упражнений глаз',check:function(s){return (s.eyeExercises||[]).length>=30},progress:function(s){return Math.min(1,(s.eyeExercises||[]).length/30)}},
{id:'timer_10',icon:'⏱',name:'10 таймеров',check:function(s){return (s.timerSessions||[]).length>=10},progress:function(s){return Math.min(1,(s.timerSessions||[]).length/10)}},
{id:'focus_10',icon:'🎯',name:'10 фокусов',check:function(s){return (s.focusSessions||[]).length>=10},progress:function(s){return Math.min(1,(s.focusSessions||[]).length/10)}},
{id:'detox_7',icon:'📱',name:'7 дней детокса',check:function(s){return Object.keys(s.detoxCourseProgress||{}).length>=7},progress:function(s){return Math.min(1,Object.keys(s.detoxCourseProgress||{}).length/7)}},
{id:'detox_30',icon:'🏆',name:'30 дней детокса',check:function(s){return Object.keys(s.detoxCourseProgress||{}).length>=30},progress:function(s){return Math.min(1,Object.keys(s.detoxCourseProgress||{}).length/30)}},
{id:'xp_100',icon:'⭐',name:'100 XP',check:function(s){return (s.xp||0)>=100},progress:function(s){return Math.min(1,(s.xp||0)/100)}},
{id:'xp_1000',icon:'🌟',name:'1000 XP',check:function(s){return (s.xp||0)>=1000},progress:function(s){return Math.min(1,(s.xp||0)/1000)}},
{id:'survey_done',icon:'📋',name:'Опрос пройден',check:function(s){return s.profile.surveyDone},progress:function(s){return s.profile.surveyDone?1:0}}
];

/* ============================================================
   RECOVERY (20)
   ============================================================ */
var RECOVERY_LIBRARY=[
{id:'r_sleep',emoji:'😴',title:'Сон',category:'Физическое',desc:'Главное восстановление.',how:'Режим, темнота, 18-20°C.',time:'7-9 ч'},
{id:'r_nap',emoji:'💤',title:'Дневной сон',category:'Физическое',desc:'20-30 мин.',how:'До 15:00.',time:'20-90 мин'},
{id:'r_walk',emoji:'🚶',title:'Прогулка',category:'Физическое',desc:'Свежий воздух.',how:'Без телефона.',time:'20-30 мин'},
{id:'r_massage',emoji:'💆',title:'Массаж',category:'Физическое',desc:'Расслабление.',how:'2×/мес.',time:'60 мин'},
{id:'r_sauna',emoji:'🔥',title:'Сауна',category:'Физическое',desc:'80-100°C.',how:'2-4×/нед.',time:'15-20 мин'},
{id:'r_stretch',emoji:'🤸',title:'Растяжка',category:'Физическое',desc:'Мобильность.',how:'10 мин/день.',time:'10 мин'},
{id:'r_yoga',emoji:'🧘',title:'Йога',category:'Физическое',desc:'Тело + дыхание.',how:'2-3×/нед.',time:'60 мин'},
{id:'r_meditation',emoji:'🧘',title:'Медитация',category:'Ментальное',desc:'10-20 мин.',how:'Дыхание.',time:'10-20 мин'},
{id:'r_journal',emoji:'📓',title:'Дневник',category:'Ментальное',desc:'Рефлексия.',how:'3 стр.',time:'15 мин'},
{id:'r_reading',emoji:'📖',title:'Чтение',category:'Ментальное',desc:'Художка.',how:'30 мин.',time:'30 мин'},
{id:'r_breathing',emoji:'🌬',title:'Дыхание',category:'Ментальное',desc:'Box, 4-7-8.',how:'5 мин.',time:'5 мин'},
{id:'r_silence',emoji:'🤫',title:'Тишина',category:'Сенсорное',desc:'Отдых от шума.',how:'1 ч/день.',time:'60 мин'},
{id:'r_dark',emoji:'🌑',title:'Темнота',category:'Сенсорное',desc:'Отдых глаз.',how:'Закрытые глаза.',time:'10 мин'},
{id:'r_digital_detox',emoji:'📱',title:'Цифровой детокс',category:'Сенсорное',desc:'Без экрана.',how:'1 ч/день.',time:'60 мин'},
{id:'r_hobby',emoji:'🎨',title:'Хобби',category:'Творческое',desc:'Руками.',how:'30 мин.',time:'30 мин'},
{id:'r_music',emoji:'🎵',title:'Музыка',category:'Творческое',desc:'Играть или слушать.',how:'30 мин.',time:'30 мин'},
{id:'r_therapy',emoji:'🛋',title:'Терапия',category:'Эмоциональное',desc:'С психологом.',how:'1×/нед.',time:'60 мин'},
{id:'r_talk',emoji:'💬',title:'Разговор',category:'Эмоциональное',desc:'С близким.',how:'15 мин.',time:'15 мин'},
{id:'r_friends',emoji:'👥',title:'Друзья',category:'Социальное',desc:'Живое общение.',how:'1×/нед.',time:'120 мин'},
{id:'r_family',emoji:'🏠',title:'Семья',category:'Социальное',desc:'Без телефонов.',how:'30 мин.',time:'30 мин'}
];

/* ============================================================
   SCREEN_TIPS (30)
   ============================================================ */
var SCREEN_TIPS=[
{category:'🌅 Утро',title:'Утро без телефона',desc:'Первые 30 минут без экрана.',action:'Телефон в другую комнату.',effect:'+Фокус',time:'30 мин'},
{category:'🌅 Утро',title:'Солнечный свет',desc:'10 минут света утром.',action:'Выйди на балкон.',effect:'+Циркадные ритмы',time:'10 мин'},
{category:'🌅 Утро',title:'Вода вместо ленты',desc:'Стакан воды вместо новостей.',action:'Бутылка у кровати.',effect:'+Гидратация',time:'2 мин'},
{category:'📱 Соцсети',title:'Лимит 30 минут',desc:'Соцсети — не более 30 мин.',action:'Настрой лимит.',effect:'-Тревога',time:'—'},
{category:'📱 Соцсети',title:'Удали приложения',desc:'Соцсети с главного экрана.',action:'Замени на браузер.',effect:'-70%',time:'5 мин'},
{category:'📱 Соцсети',title:'Чёрно-белый режим',desc:'Экран чёрно-белым.',action:'Настройки → Спец.возможности.',effect:'-Дофамин',time:'1 мин'},
{category:'🔔 Уведомления',title:'Отключи лишнее',desc:'Только люди и звонки.',action:'Настройки → Уведомления.',effect:'-Отвлечения',time:'5 мин'},
{category:'🔔 Уведомления',title:'Авиарежим в работе',desc:'90 мин Deep Work.',action:'Включи авиарежим.',effect:'+Фокус',time:'90 мин'},
{category:'🌙 Вечер',title:'Экран за 2 часа',desc:'За 2 часа до сна.',action:'Книга, душ, медитация.',effect:'+Сон',time:'120 мин'},
{category:'🌙 Вечер',title:'Тёплый свет',desc:'Ночной режим с 19:00.',action:'Авто в настройках.',effect:'+Мелатонин',time:'—'},
{category:'🌙 Вечер',title:'Телефон вне спальни',desc:'Заряжай в другой комнате.',action:'Купи будильник.',effect:'+Сон',time:'—'},
{category:'🍽 Еда',title:'Еда без экрана',desc:'Без телефона.',action:'Телефон в комнате.',effect:'+Пищеварение',time:'20 мин'},
{category:'🍽 Еда',title:'Осознанное питание',desc:'Вкус, текстура, запах.',action:'Медленно.',effect:'+Насыщение',time:'—'},
{category:'🚶 Прогулки',title:'Прогулка без телефона',desc:'20 мин на улице.',action:'Оставь дома.',effect:'+Креатив',time:'20 мин'},
{category:'📚 Досуг',title:'Книга вместо ленты',desc:'30 мин чтения.',action:'Книга на тумбочке.',effect:'+Знания',time:'30 мин'},
{category:'📚 Досуг',title:'Хобби без экрана',desc:'Рисование, музыка.',action:'30 мин в день.',effect:'+Радость',time:'30 мин'},
{category:'🧘 Практики',title:'Медитация 10 мин',desc:'Вместо скролла.',action:'Таймер.',effect:'-Стресс',time:'10 мин'},
{category:'🧘 Практики',title:'Дыхание 4-7-8',desc:'Перед сном.',action:'4-7-8.',effect:'-Тревога',time:'5 мин'},
{category:'👥 Социальное',title:'Живое общение',desc:'Звонок вместо переписки.',action:'1 звонок/день.',effect:'+Связь',time:'15 мин'},
{category:'📊 Метрики',title:'Замерь экран',desc:'Реальные цифры.',action:'Screen Time.',effect:'+Осознанность',time:'5 мин'},
{category:'📊 Метрики',title:'Цель — снижение 20%',desc:'Каждую неделю -20%.',action:'Записывай.',effect:'-Экран',time:'—'},
{category:'🆘 Кризис',title:'Тяжело без телефона?',desc:'Это нормально — дофаминовая яма.',action:'Продержись 3 дня.',effect:'+Свобода',time:'72 часа'},
{category:'👁 Зрение',title:'20-20-20',desc:'Каждые 20 мин — 20 сек вдаль.',action:'Таймер 20-20-20.',effect:'-Усталость глаз',time:'20 сек'},
{category:'👁 Зрение',title:'Пальминг',desc:'5 минут тепла для глаз.',action:'Разотри ладони, прикрой.',effect:'-Напряжение',time:'5 мин'},
{category:'👁 Зрение',title:'Моргать',desc:'Каждые 10 мин.',action:'Напоминание.',effect:'+Увлажнение',time:'—'},
{category:'👁 Зрение',title:'Смотреть вдаль',desc:'5 минут в окно.',action:'Расслабь мышцы.',effect:'-Спазм',time:'5 мин'},
{category:'👁 Зрение',title:'Солнце 10 мин',desc:'Утром без очков.',action:'Выйди на улицу.',effect:'+Здоровье глаз',time:'10 мин'},
{category:'👁 Зрение',title:'Питание для глаз',desc:'Черника, морковь, рыба.',action:'Добавь в рацион.',effect:'+Зрение',time:'—'},
{category:'👁 Зрение',title:'Экран дальше',desc:'50-70 см от глаз.',action:'Отодвинь.',effect:'-Нагрузка',time:'—'},
{category:'👁 Зрение',title:'Тёмный режим',desc:'Снижает нагрузку.',action:'Включи.',effect:'-Усталость',time:'—'}
];

/* ============================================================
   VISION_EXERCISES (15)
   ============================================================ */
var VISION_EXERCISES=[
{id:'v_2020',emoji:'👁',title:'20-20-20',desc:'Каждые 20 мин смотри 20 сек на 6 метров.',how:'Таймер, окно, улица.',duration:'20 сек',benefit:'Расслабляет мышцы'},
{id:'v_palm',emoji:'✋',title:'Пальминг',desc:'Разотри ладони, прикрой глаза на 5 мин.',how:'Тепло ладоней, расслабься.',duration:'5 мин',benefit:'Отдых глаз'},
{id:'v_up_down',emoji:'⬆️',title:'Вверх-вниз',desc:'Медленно вверх-вниз 10 раз.',how:'Без движений головы.',duration:'1 мин',benefit:'Мышцы глаз'},
{id:'v_left_right',emoji:'⬅️',title:'Влево-вправо',desc:'Медленно влево-вправо 10 раз.',how:'Плавно.',duration:'1 мин',benefit:'Боковые мышцы'},
{id:'v_diag',emoji:'↗️',title:'Диагонали',desc:'По диагонали 10 раз.',how:'Медленно.',duration:'1 мин',benefit:'Косые мышцы'},
{id:'v_circle',emoji:'🔄',title:'Круги',desc:'По часовой и против 10 раз.',how:'Большой круг.',duration:'2 мин',benefit:'Разминка'},
{id:'v_far_near',emoji:'🔭',title:'Дальше-ближе',desc:'Палец к носу, потом вдаль 10 раз.',how:'Медленно.',duration:'2 мин',benefit:'Фокусировка'},
{id:'v_blink',emoji:'👁‍🗨',title:'Моргание',desc:'Быстро моргай 30 сек.',how:'Расслабь.',duration:'30 сек',benefit:'Увлажнение'},
{id:'v_squeeze',emoji:'😑',title:'Зажмуривание',desc:'Зажмурься на 3 сек, открой. 10 раз.',how:'Сильно.',duration:'1 мин',benefit:'Тонус'},
{id:'v_massage',emoji:'💆',title:'Массаж точек',desc:'Помассируй точки вокруг глаз.',how:'Пальцами.',duration:'2 мин',benefit:'Кровоток'},
{id:'v_sun',emoji:'☀️',title:'Солнечные ванны',desc:'10 мин утром без очков.',how:'Не смотри на солнце!',duration:'10 мин',benefit:'Здоровье'},
{id:'v_window',emoji:'🪟',title:'Смотреть в окно',desc:'5 мин смотри вдаль.',how:'Расслабься.',duration:'5 мин',benefit:'Спазм'},
{id:'v_read',emoji:'📖',title:'Чтение без напряга',desc:'Держи книгу 40 см.',how:'Свет сзади.',duration:'—',benefit:'Привычка'},
{id:'v_dark',emoji:'🌑',title:'Отдых в темноте',desc:'Закрой глаза 10 мин.',how:'Темнота.',duration:'10 мин',benefit:'Восстановление'},
{id:'v_water',emoji:'💧',title:'Увлажнение',desc:'Капли или умывание.',how:'2×/день.',duration:'1 мин',benefit:'Влага'}
];

/* ============================================================
   DETOX COURSE (30)
   ============================================================ */
var DETOX_COURSE=[
{day:1,phase:'Подготовка',title:'Осознай проблему',subtitle:'Замерь экран',why:'Нельзя изменить то, что не измерено.',do:['Screen Time','Цифры','Топ-3'],effect:'Ясность'},
{day:2,phase:'Подготовка',title:'Убери соблазны',subtitle:'Среда',why:'Сила воли ограничена.',do:['Удали соцсети','Уведомления off','Чёрно-белый','Будильник'],effect:'-30%'},
{day:3,phase:'Подготовка',title:'Утро без телефона',subtitle:'30 мин',why:'Утро задаёт тон.',do:['Телефон в комнате','30 мин','Вода+свет'],effect:'+Фокус'},
{day:4,phase:'Неделя 1',title:'Замечай импульсы',subtitle:'Счёт',why:'Импульс — не приказ.',do:['Счёт','Триггеры','Замена'],effect:'+Контроль'},
{day:5,phase:'Неделя 1',title:'Еда без экрана',subtitle:'Осознанно',why:'Еда+экран=переедание.',do:['Без телефона','Медленно','3 приёма'],effect:'+Пищеварение'},
{day:6,phase:'Неделя 1',title:'Прогулка без телефона',subtitle:'20 мин',why:'Внимание к телу.',do:['20 мин','Дома','Детали'],effect:'+Настроение'},
{day:7,phase:'Неделя 1',title:'Ревью недели 1',subtitle:'Итоги',why:'Рефлексия.',do:['Цифры','Легко','Сложно','План 2'],effect:'+Осознанность'},
{day:8,phase:'Неделя 2',title:'Уведомления — ноль',subtitle:'Люди',why:'23 мин фокуса.',do:['Соцсети off','Звонки','Проверь'],effect:'+Фокус'},
{day:9,phase:'Неделя 2',title:'Соцсети 30 мин',subtitle:'Время',why:'Ограничение > запрет.',do:['Лимит 30','18:00','Таймер'],effect:'-Тревога'},
{day:10,phase:'Неделя 2',title:'Чёрно-белый',subtitle:'Без цвета',why:'Цвет = магнит.',do:['Ч/Б','День','Оцени'],effect:'-50%'},
{day:11,phase:'Неделя 2',title:'День без соцсетей',subtitle:'24 часа',why:'Проверка.',do:['24 ч','Звонки','Запиши'],effect:'+Свобода'},
{day:12,phase:'Неделя 2',title:'Глубокий час',subtitle:'60 мин',why:'Глубина.',do:['Авиарежим 60','1 задача','Перерыв'],effect:'+Продуктивность'},
{day:13,phase:'Неделя 2',title:'Вечер без экрана',subtitle:'2 часа',why:'Мелатонин.',do:['2 ч off','Книга','Телефон вне'],effect:'+Сон'},
{day:14,phase:'Неделя 2',title:'Ревью недели 2',subtitle:'Итоги',why:'Замер.',do:['Цифры','Помогло','Мешает','План 3'],effect:'+Мотивация'},
{day:15,phase:'Неделя 3',title:'Приложение вместо ленты',subtitle:'Что?',why:'Пустоту заполни.',do:['Приложение','20 мин','Читай'],effect:'+Развитие'},
{day:16,phase:'Неделя 3',title:'Хобби 30 минут',subtitle:'Руками',why:'Радость.',do:['30 мин','Рисование','Эмоции'],effect:'+Радость'},
{day:17,phase:'Неделя 3',title:'Спорт без наушников',subtitle:'Тело',why:'Связь.',do:['30 мин','Без музыки','Тело'],effect:'+Настроение'},
{day:18,phase:'Неделя 3',title:'Живое общение',subtitle:'Звонок',why:'Голос=эмоции.',do:['2 звонка','15 мин','Слушай'],effect:'+Связи'},
{day:19,phase:'Неделя 3',title:'Природа 1 час',subtitle:'Лес',why:'Кортизол↓.',do:['1 час','Телефон в сумке','Наблюдай'],effect:'-Стресс'},
{day:20,phase:'Неделя 3',title:'Дневник детокса',subtitle:'Итоги',why:'Написание.',do:['3 победы','3 трудности','Новое'],effect:'+Рефлексия'},
{day:21,phase:'Неделя 3',title:'Ревью недели 3',subtitle:'Половина',why:'21 день.',do:['Цифры','Норма','План 4'],effect:'+Привычка'},
{day:22,phase:'Неделя 4',title:'Утро-ритуал',subtitle:'Фикс',why:'Защита.',do:['Вода+свет','30 мин','Потом'],effect:'+Контроль'},
{day:23,phase:'Неделя 4',title:'Работа без отвлечений',subtitle:'90 мин',why:'Суперсила.',do:['Авиарежим 90','1 задача','Метрики'],effect:'×2'},
{day:24,phase:'Неделя 4',title:'Вечер-ритуал',subtitle:'Свет+книга',why:'Защита сна.',do:['Свет 19:00','Книга 30','Телефон вне'],effect:'+Сон'},
{day:25,phase:'Неделя 4',title:'Один день офлайн',subtitle:'24 ч',why:'Проверка.',do:['Выбери','24 ч','Планируй'],effect:'+Свобода'},
{day:26,phase:'Неделя 4',title:'Дофаминовое голодание',subtitle:'4 часа',why:'Чувствительность.',do:['4 ч без','Прогулка'],effect:'+Чувствительность'},
{day:27,phase:'Неделя 4',title:'Замена ленты на смысл',subtitle:'Зачем?',why:'Цель.',do:['Зачем ты','Удали'],effect:'+Осознанность'},
{day:28,phase:'Неделя 4',title:'Метрики месяца',subtitle:'Цифры',why:'Мотиватор.',do:['Старт vs сейчас','Снизилось','Улучшилось'],effect:'+Мотивация'},
{day:29,phase:'Неделя 4',title:'План на будущее',subtitle:'Как',why:'Образ жизни.',do:['Правила','Лимиты','Ритуалы'],effect:'+Система'},
{day:30,phase:'Финал',title:'Свобода',subtitle:'Справился',why:'Инструмент.',do:['Финал','Расскажи','Продолжай'],effect:'+Свобода'}
];

/* ============================================================
   COURSES_LIBRARY (24 курса)
   ============================================================ */
var COURSES_LIBRARY=[
{id:'c_health_basics',emoji:'❤️',title:'Здоровье: база',category:'Здоровье',hours:6,lessons:[
{title:'Что такое здоровье',theory:'**Здоровье = физическое + ментальное + социальное.** ВОЗ: не только отсутствие болезней.',example:'Человек без болезней, но в депрессии — не здоров.',practice:'Оцени себя по 3 осям (1-10).',test:'Что входит в здоровье по ВОЗ?'},
{title:'Сон — фундамент',theory:'**7-9 часов.** Медленный сон = факты, REM = эмоции.',example:'После 5ч сна — реакция как у пьяного.',practice:'Ляг на 30 мин раньше.',test:'Сколько нужно спать?'},
{title:'Питание',theory:'**500 г овощей, 1.6 г белка/кг, оливковое масло.**',example:'Средиземноморская диета = +5 лет жизни.',practice:'Добавь овощ.',test:'Сколько белка на кг?'},
{title:'Движение',theory:'**150 мин кардио + 2 силовые.**',example:'Прогулка 30 мин = -30% риска инфаркта.',practice:'20 мин прогулка.',test:'Сколько кардио в неделю?'},
{title:'Вода',theory:'**30 мл/кг.** Утром 500 мл.',example:'Обезвоживание 2% = -20% фокуса.',practice:'8 стаканов.',test:'Сколько воды на кг?'},
{title:'Стресс',theory:'**Кортизол хронически убивает.**',example:'Хронический стресс = -10 лет жизни.',practice:'Box breathing 3×.',test:'Что такое кортизол?'},
{title:'Восстановление',theory:'**7 видов отдыха.**',example:'Отдых = часть работы, не лень.',practice:'Определи дефицит.',test:'Какие 7 видов отдыха?'},
{title:'Итог',theory:'**Система > мотивация.**',example:'Привычки работают без мотивации.',practice:'Составь план.',test:'Что важнее системы?'}
]},
{id:'c_sleep_master',emoji:'😴',title:'Мастер сна',category:'Здоровье',hours:4,lessons:[
{title:'Наука сна',theory:'**90-мин циклы.** 4-6 циклов = 7-9 часов.',example:'Прерывание цикла = разбитость.',practice:'Засыпай в 22:00.',test:'Сколько циклов?'},
{title:'Циркадные ритмы',theory:'**Свет утром = мелатонин вечером.**',example:'10 мин солнца утром = +1ч глубокого сна.',practice:'10 мин на свет.',test:'Что регулирует мелатонин?'},
{title:'Гигиена сна',theory:'**Темнота, 18-20°C, тишина.**',example:'Даже маленький свет = -50% мелатонина.',practice:'Затемни.',test:'Какая температура?'},
{title:'Экран и сон',theory:'**Синий свет подавляет мелатонин.**',example:'Телефон за час до сна = -30 мин сна.',practice:'За 2ч off.',test:'Что делает синий свет?'},
{title:'Кофеин',theory:'**8 часов полураспада.** До 14:00.',example:'Кофе в 16:00 = плохой сон в 23:00.',practice:'До 14:00.',test:'Сколько часов?'},
{title:'Алкоголь',theory:'**Убивает REM.**',example:'2 бокала = -20% REM.',practice:'Не пей.',test:'Что убивает алкоголь?'},
{title:'Ритуалы',theory:'**Одно время.**',example:'Мозг привыкает к режиму.',practice:'Ритуал 30 мин.',test:'Зачем ритуал?'}
]},
{id:'c_fitness_master',emoji:'🏋️',title:'Мастер фитнеса',category:'Здоровье',hours:8,lessons:[
{title:'База',theory:'**Присед, становая, жим, подтягивание.**',example:'Базовые = 80% результата.',practice:'Изучи технику.',test:'Назови 4 базовых.'},
{title:'Прогрессия',theory:'**+2.5 кг или +1 повтор.**',example:'Без прогрессии нет роста.',practice:'+2.5 кг.',test:'Как прогрессировать?'},
{title:'Техника',theory:'**Спина прямая.**',example:'Круглая спина = травма.',practice:'Следи.',test:'Что главное?'},
{title:'Кардио',theory:'**Zone 2.**',example:'Можешь говорить — правильно.',practice:'30 мин.',test:'Что такое Zone 2?'},
{title:'Восстановление',theory:'**48 часов.**',example:'Мышцы растут в отдыхе.',practice:'Спи 8ч.',test:'Сколько отдых?'},
{title:'Питание',theory:'**Белок 1.6-2.2 г/кг.**',example:'Без белка нет мышц.',practice:'Считай.',test:'Сколько белка?'},
{title:'Программа',theory:'**4 недели, потом смена.**',example:'Одинаковая нагрузка = плато.',practice:'Составь.',test:'Когда менять?'}
]},
{id:'c_productivity_master',emoji:'⚡',title:'Мастер продуктивности',category:'Продуктивность',hours:6,lessons:[
{title:'Что такое продуктивность',theory:'**Результат, не занятость.**',example:'8 часов работы = 2 задачи vs 2 часа = 5 задач.',practice:'3 главных.',test:'Что важно?'},
{title:'Deep Work',theory:'**90 мин ×3-4 = 10 часов.**',example:'Deep Work = 4x результат.',practice:'1 блок.',test:'Сколько в блоке?'},
{title:'Pomodoro',theory:'**25/5 ×4 = цикл.**',example:'Мозг устаёт через 25 мин.',practice:'4 помидора.',test:'Сколько в цикле?'},
{title:'Time-blocking',theory:'**Каждое дело в слот.**',example:'Без плана = хаос.',practice:'Заблокируй.',test:'Что в слот?'},
{title:'GTD',theory:'**Capture, Clarify, Organize, Reflect, Engage.**',example:'Голова не хранилище.',practice:'Inbox.',test:'5 шагов GTD?'},
{title:'Матрица',theory:'**Q1 делай, Q2 планируй, Q3 делегируй, Q4 удали.**',example:'70% времени в Q2.',practice:'Разбери.',test:'Что в Q2?'},
{title:'Eat That Frog',theory:'**Сложное первым.**',example:'Съел жабу утром = день свободен.',practice:'1 жаба.',test:'Когда жаба?'},
{title:'Итог',theory:'**Система > мотивация.**',example:'Дисциплина = свобода.',practice:'Составь план.',test:'Что важнее?'}
]},
{id:'c_deep_work',emoji:'🎯',title:'Deep Work',category:'Продуктивность',hours:4,lessons:[
{title:'Что такое',theory:'**Концентрация без отвлечений.**',example:'1 час Deep Work = 3 часа обычной.',practice:'1 блок 90 мин.',test:'Что такое Deep Work?'},
{title:'Стоимость переключения',theory:'**23 минуты.**',example:'Ответил на сообщение = 23 мин потеряно.',practice:'Авиарежим.',test:'Сколько минут?'},
{title:'Ритуалы',theory:'**Одно время, место.**',example:'Мозг входит в состояние быстрее.',practice:'Создай.',test:'Зачем ритуал?'},
{title:'Телефон',theory:'**В другой комнате.**',example:'Даже выключенный телефон снижает IQ на 10.',practice:'Убери.',test:'Где телефон?'},
{title:'Метрики',theory:'**Считай часы.**',example:'Что измеряешь — то улучшаешь.',practice:'Записывай.',test:'Зачем считать?'},
{title:'Расписание',theory:'**3-4 часа утром.**',example:'Утро = пик энергии.',practice:'Заблокируй.',test:'Когда Deep Work?'}
]},
{id:'c_memory_master',emoji:'🧠',title:'Мастер памяти',category:'Ментальное',hours:6,lessons:[
{title:'Типы памяти',theory:'**Сенсорная, краткосрочная, долгосрочная.**',example:'Краткосрочная = 7±2 элемента.',practice:'Заметь.',test:'Сколько в краткосрочной?'},
{title:'Кривая Эббингауза',theory:'**20 мин → 58% забыто.**',example:'Повторяй через 1ч, 1д, 3д, 7д.',practice:'Составь.',test:'Сколько забыто через 20 мин?'},
{title:'Локусы',theory:'**10 точек = 10 объектов.**',example:'Дворец памяти = ×10 запоминание.',practice:'Создай.',test:'Что такое локусы?'},
{title:'Мнемоники',theory:'**Акроним, рифма, история.**',example:'Every Good Boy Does Fine — ноты.',practice:'Придумай.',test:'Что такое мнемоника?'},
{title:'Чанкинг',theory:'**7±2 → группируй.**',example:'917-555-1234 вместо 10 цифр.',practice:'Сгруппируй.',test:'Что такое чанк?'},
{title:'Активное припоминание',theory:'**Recall > Recognition.**',example:'Закрыл книгу — вспомнил. В 3 раза сильнее перечитывания.',practice:'Вспомни.',test:'Что сильнее?'}
]},
{id:'c_iq_boost',emoji:'🎯',title:'IQ-буст',category:'Ментальное',hours:6,lessons:[
{title:'Что такое IQ',theory:'**Fluid + crystallized.**',example:'Fluid = логика, crystallized = знания.',practice:'Тест.',test:'2 типа IQ?'},
{title:'Логика',theory:'**Паттерны: +, ×, чередование.**',example:'1, 4, 9, 16, ? (25).',practice:'10 задач.',test:'Что искать?'},
{title:'Аналогии',theory:'**A:B = C:? Найди связь.**',example:'Врач:больница = учитель:школа.',practice:'10 аналогий.',test:'Что такое аналогия?'},
{title:'Рабочая память',theory:'**N-back.**',example:'Запомни N шагов назад.',practice:'Играй.',test:'Что такое N-back?'},
{title:'Критическое мышление',theory:'**5 вопросов.**',example:'Кто, что, доказательства, альтернативы, если ошибается.',practice:'Анализ.',test:'5 вопросов?'},
{title:'Математика',theory:'**Упрощения.**',example:'17×23 = (20-3)(20+3) = 400-9 = 391.',practice:'20 примеров.',test:'Как упростить?'}
]},
{id:'c_eq_master',emoji:'❤️',title:'Мастер EQ',category:'Эмоциональное',hours:6,lessons:[
{title:'Что такое EQ',theory:'**5 компонентов Гоулмана.**',example:'EQ важнее IQ в 2 раза для успеха.',practice:'Оцени.',test:'5 компонентов?'},
{title:'Самосознание',theory:'**Дневник эмоций.**',example:'Назови эмоцию — ослабь её.',practice:'3 раза.',test:'Что делать?'},
{title:'Саморегуляция',theory:'**Пауза 6 сек.**',example:'Между стимулом и реакцией — свобода.',practice:'Пауза.',test:'Сколько сек?'},
{title:'Мотивация',theory:'**Автономия, компетентность, связанность.**',example:'Внутренняя > внешняя.',practice:'Найди смысл.',test:'3 компонента?'},
{title:'Эмпатия',theory:'**Слушай, не советуй.**',example:'Парафраз = "я слышу тебя".',practice:'1 разговор.',test:'Что делать?'},
{title:'Стресс',theory:'**Box breathing 4-4-4-4.**',example:'Navy SEAL используют.',practice:'3×.',test:'Что такое box?'}
]},
{id:'c_stress_master',emoji:'🌊',title:'Мастер стресса',category:'Эмоциональное',hours:4,lessons:[
{title:'Что такое стресс',theory:'**Реакция, не событие.**',example:'Одно событие — разный стресс у разных людей.',practice:'Заметь.',test:'Что такое стресс?'},
{title:'Кортизол',theory:'**Хронический убивает.**',example:'Хронический стресс = -10 лет.',practice:'Снизь.',test:'Что такое кортизол?'},
{title:'Дыхание',theory:'**4-7-8, box.**',example:'Дыхание = пульт управления.',practice:'4-7-8.',test:'Что такое 4-7-8?'},
{title:'Спорт',theory:'**Сжигает кортизол.**',example:'30 мин спорта = -40% стресса.',practice:'30 мин.',test:'Что делает спорт?'},
{title:'Медитация',theory:'**10 мин/день.**',example:'8 недель = утолщение коры.',practice:'10 мин.',test:'Сколько медитации?'},
{title:'Природа',theory:'**2 ч/нед.**',example:'Прогулка в лесу = -16% кортизола.',practice:'2 ч.',test:'Сколько в неделю?'}
]},
{id:'c_anxiety_course',emoji:'😰',title:'Работа с тревогой',category:'Эмоциональное',hours:5,lessons:[
{title:'Что такое тревога',theory:'**Предсказание будущего.**',example:'Мозг рисует худший сценарий.',practice:'Заметь.',test:'Что такое тревога?'},
{title:'Тело',theory:'**Заземление 5-4-3-2-1.**',example:'5 вещей видишь, 4 слышишь, 3 трогаешь, 2 нюхаешь, 1 вкус.',practice:'Сделай.',test:'Что такое 5-4-3-2-1?'},
{title:'Дыхание',theory:'**4-7-8.**',example:'Активирует парасимпатику.',practice:'4 цикла.',test:'Что делает 4-7-8?'},
{title:'Мысли',theory:'**КПТ: мысль → альтернатива.**',example:'"Я не справлюсь" → "Я справлялся раньше".',practice:'Пересмотри.',test:'Что такое КПТ?'},
{title:'Избегание',theory:'**Усиливает тревогу.**',example:'Чем больше избегаешь — тем страшнее.',practice:'Иди навстречу.',test:'Что делает избегание?'},
{title:'Помощь',theory:'**8-800-2000-122.**',example:'Не оставляй одного.',practice:'Запомни.',test:'Какой номер?'}
]},
{id:'c_financial_literacy',emoji:'💰',title:'Финансовая грамотность',category:'Финансы',hours:6,lessons:[
{title:'Активы vs пассивы',theory:'**Активы приносят, пассивы забирают.**',example:'Квартира в аренду = актив. Своя = пассив.',practice:'Список.',test:'Что такое актив?'},
{title:'Бюджет 50/30/20',theory:'**50% нужды, 30% желания, 20% сбережения.**',example:'Зарплата 100к → 20к в сбережения.',practice:'Посчитай.',test:'Сколько в сбережения?'},
{title:'Подушка',theory:'**3-6 месяцев расходов.**',example:'Без подушки = стресс.',practice:'Открой счёт.',test:'Сколько месяцев?'},
{title:'Долги',theory:'**Лавина (высокий %) vs снежный ком (мелкий).**',example:'Лавина быстрее, ком мотивирует.',practice:'Выбери.',test:'2 метода?'},
{title:'Инвестиции',theory:'**Индексные фонды, DCA, долгосрочно.**',example:'S&P 500 = +10% в год в среднем.',practice:'Изучи.',test:'Что такое DCA?'},
{title:'Сложный процент',theory:'**10% → ×2 за 7 лет.**',example:'1000$ в 20 лет = 16000$ в 60.',practice:'Посчитай.',test:'Сколько лет до ×2?'}
]},
{id:'c_career_master',emoji:'💼',title:'Мастер карьеры',category:'Карьера',hours:6,lessons:[
{title:'Икигай',theory:'**Что люблю + умею + платят + нужно миру.**',example:'Пересечение = карьера мечты.',practice:'4 списка.',test:'4 сферы?'},
{title:'Навыки T-shape',theory:'**Глубина в 1 + ширина в 5.**',example:'Программист + дизайн + маркетинг.',practice:'Определи.',test:'Что такое T-shape?'},
{title:'Резюме',theory:'**1 стр., результат, не обязанности.**',example:'"Увеличил продажи на 30%", не "работал с клиентами".',practice:'Напиши.',test:'Что в резюме?'},
{title:'Собеседование',theory:'**STAR: Situation, Task, Action, Result.**',example:'Ответ структурой.',practice:'5 историй.',test:'Что такое STAR?'},
{title:'Переговоры',theory:'**Первое предложение не берут.**',example:'Проси больше — получишь больше.',practice:'Назови цифру.',test:'Что делать с первым?'},
{title:'Нетворкинг',theory:'**Дай первым.**',example:'Помоги — потом попросишь.',practice:'5 контактов.',test:'Что сначала?'}
]},
{id:'c_leadership',emoji:'👑',title:'Лидерство',category:'Карьера',hours:6,lessons:[
{title:'Level 5',theory:'**Скромность + воля.**',example:'Тихие лидеры = лучшие результаты.',practice:'Будь скромным.',test:'2 черты Level 5?'},
{title:'Видение',theory:'**WHY важнее WHAT.**',example:'Apple = "изменить мир", не "делать компьютеры".',practice:'Найди WHY.',test:'Что важнее?'},
{title:'Команда',theory:'**Развивай людей.**',example:'Твой успех = успех команды.',practice:'Развивай 1.',test:'Что делать?'},
{title:'Делегирование',theory:'**Не делай сам.**',example:'Делегируй то, что можешь научить.',practice:'Отдай 3.',test:'Что делегировать?'},
{title:'SBI-фидбэк',theory:'**Situation-Behavior-Impact.**',example:'"На встрече (S) ты перебил (B) — клиент замолчал (I)".',practice:'Дай SBI.',test:'Что такое SBI?'},
{title:'Кризис',theory:'**Спокойствие = сила.**',example:'Команда читает твоё состояние.',practice:'Дыши.',test:'Что делать в кризис?'}
]},
{id:'c_english_a1',emoji:'🇬🇧',title:'English A1',category:'Английский',hours:20,lessons:[
{title:'Алфавит и звуки',theory:'**26 букв, 44 звука.**',example:'/θ/ think, /ð/ this.',practice:'10 пар.',test:'Сколько звуков?'},
{title:'Приветствия',theory:'**Good morning (до 12), Good afternoon (12-18), Good evening.**',example:'Hi! I am Alex. Nice to meet you.',practice:'Диалог.',test:'Что до 12?'},
{title:'Числа 1-100',theory:'**13-19 = -teen, 20-90 = -ty.**',example:'thirTEEN vs THIRty.',practice:'Назови.',test:'Что такое 40?'},
{title:'Цвета',theory:'**red, blue, green...**',example:'I feel blue = грустно.',practice:'5 предметов.',test:'Что значит blue?'},
{title:'Семья',theory:'**mother, father, sister, brother.**',example:'-in-law = по браку.',practice:'Древо.',test:'Что такое cousin?'},
{title:'To be',theory:'**am / is / are.**',example:'I am, you are, he is.',practice:'10 предложений.',test:'Когда am?'}
]},
{id:'c_english_a2',emoji:'🇬🇧',title:'English A2',category:'Английский',hours:25,lessons:[
{title:'Past Simple',theory:'**V+ed.**',example:'work → worked.',practice:'10 предложений.',test:'Как образуется?'},
{title:'Неправильные',theory:'**go-went, have-had, do-did.**',example:'Топ-30 запомнить.',practice:'Рассказ.',test:'Что такое go в прошлом?'},
{title:'Past Continuous',theory:'**was/were + V-ing.**',example:'I was reading when he came.',practice:'Опиши.',test:'Формула?'},
{title:'Future',theory:'**will (решение) / going to (план).**',example:'I will help / I am going to travel.',practice:'5 планов.',test:'Что когда?'},
{title:'Сравнения',theory:'**-er/-est или more/most.**',example:'big → bigger → biggest.',practice:'5 пар.',test:'Что с big?'},
{title:'Present Perfect',theory:'**have + V3.**',example:'I have lost my keys (результат сейчас).',practice:'10.',test:'Когда использовать?'}
]},
{id:'c_english_b1',emoji:'🇬🇧',title:'English B1',category:'Английский',hours:30,lessons:[
{title:'Present Perfect Continuous',theory:'**have been + V-ing.**',example:'I have been working here for 5 years.',practice:'10.',test:'Формула?'},
{title:'Past Perfect',theory:'**had + V3.**',example:'I had eaten when he came.',practice:'5 историй.',test:'Когда?'},
{title:'Модальные',theory:'**must, might, can\'t.**',example:'He must be at home (90%).',practice:'10.',test:'Что уверен?'},
{title:'Used to',theory:'**Привычка в прошлом.**',example:'I used to smoke.',practice:'5.',test:'Что значит?'},
{title:'Условные 3',theory:'**If had + would have.**',example:'If I had studied, I would have passed.',practice:'5 сожалений.',test:'Формула?'},
{title:'Косвенная',theory:'**He said that...**',example:'He said, "I am tired" → He said he was tired.',practice:'10.',test:'Сдвиг времён?'}
]},
{id:'c_english_b2',emoji:'🇬🇧',title:'English B2',category:'Английский',hours:35,lessons:[
{title:'Инверсия',theory:'**Never have I...**',example:'Never have I seen such a thing.',practice:'10.',test:'Когда?'},
{title:'Смешанные условные',theory:'**Had + would.**',example:'If I had studied medicine, I would be a doctor now.',practice:'5.',test:'Смешанные?'},
{title:'Cleft',theory:'**It was... who.**',example:'It was John who broke the window.',practice:'10.',test:'Что такое cleft?'},
{title:'Subjunctive',theory:'**suggest that he be.**',example:'I suggest that he be present.',practice:'10.',test:'Форма?'},
{title:'Фразовые',theory:'**put up with.**',example:'Разделяемые и неразделяемые.',practice:'10.',test:'Что значит put up with?'},
{title:'Идиомы B2',theory:'**bite the bullet.**',example:'Решиться на сложное.',practice:'10.',test:'Что значит?'}
]},
{id:'c_english_c1',emoji:'🇬🇧',title:'English C1',category:'Английский',hours:40,lessons:[
{title:'Nuances',theory:'**Оттенки: house/home/dwelling.**',example:'Коннотации важны.',practice:'10 пар.',test:'Разница?'},
{title:'Idioms C1',theory:'**takes two to tango.**',example:'Обе стороны важны.',practice:'10.',test:'Что значит?'},
{title:'Academic writing',theory:'**Hedging: It could be argued.**',example:'Осторожность в утверждениях.',practice:'Абзац.',test:'Что такое hedging?'},
{title:'Literary devices',theory:'**Metaphor, simile, personification.**',example:'Time is a thief (метафора).',practice:'5.',test:'Что такое simile?'},
{title:'Register',theory:'**Frozen, formal, consultative, casual, intimate.**',example:'Разный тон для разных ситуаций.',practice:'5 версий.',test:'Сколько регистров?'},
{title:'Essay',theory:'**400-500 слов, структура.**',example:'Intro, argument, counter, conclusion.',practice:'Напиши.',test:'Что в counter?'}
]},
{id:'c_screentime_course',emoji:'📱',title:'Экранный детокс',category:'Цифровое',hours:8,lessons:[
{title:'Проблема',theory:'**Дофаминовая яма.**',example:'Соцсети = казино в кармане.',practice:'Заметь.',test:'Что такое яма?'},
{title:'Замер',theory:'**Screen Time.**',example:'Реальные цифры шокируют.',practice:'Замерь.',test:'Сколько у тебя?'},
{title:'Уведомления',theory:'**Отключи всё.**',example:'Каждое уведомление = 23 мин.',practice:'Off.',test:'Сколько мин?'},
{title:'Соцсети',theory:'**Лимит 30 мин.**',example:'Ограничение > запрет.',practice:'Настрой.',test:'Сколько?'},
{title:'Утро',theory:'**30 мин без телефона.**',example:'Утро = твоё.',practice:'Попробуй.',test:'Сколько мин?'},
{title:'Вечер',theory:'**2 часа без экрана.**',example:'Мелатонин.',practice:'Сделай.',test:'Сколько часов?'},
{title:'Замены',theory:'**Хобби, книга, спорт.**',example:'Пустоту надо заполнить.',practice:'Выбери.',test:'Что вместо?'},
{title:'Итог',theory:'**Свобода.**',example:'Телефон — инструмент.',practice:'Продолжай.',test:'Что главное?'}
]},
{id:'c_communication',emoji:'💬',title:'Коммуникация',category:'Отношения',hours:5,lessons:[
{title:'Активное слушание',theory:'**Парафраз.**',example:'"Я слышу тебя" вместо советов.',practice:'1 разговор.',test:'Что такое парафраз?'},
{title:'Я-сообщения',theory:'**"Я чувствую X, когда Y."**',example:'Не "ты всегда", а "я чувствую".',practice:'5 формул.',test:'Формула?'},
{title:'ННО',theory:'**Наблюдение → Чувства → Потребности → Просьба.**',example:'4 шага Розенберга.',practice:'1 ситуация.',test:'4 шага?'},
{title:'Границы',theory:'**"Нет" без вины.**',example:'Формула: "Я не могу X, но могу Y."',practice:'3 раза.',test:'Формула?'},
{title:'Конфликты',theory:'**5 стилей Томаса-Килманна.**',example:'Сотрудничество = win-win.',practice:'Разбери.',test:'Лучший стиль?'},
{title:'Small talk',theory:'**3 слоя: факт → мнение → чувство.**',example:'Погода → нравится → люблю.',practice:'1 разговор.',test:'3 слоя?'}
]},
{id:'c_creativity',emoji:'🎨',title:'Креативность',category:'Творчество',hours:5,lessons:[
{title:'Что такое',theory:'**DMN активна в покое.**',example:'Прогулка = +60% идей.',practice:'Прогулка.',test:'Что такое DMN?'},
{title:'Скука',theory:'**Полезна.**',example:'Мозг ищет новое.',practice:'10 мин скуки.',test:'Зачем скука?'},
{title:'Прогулка',theory:'**+60% идей.**',example:'Stanford исследование.',practice:'30 мин.',test:'Сколько %?'},
{title:'SCAMPER',theory:'**7 приёмов.**',example:'Substitute, Combine, Adapt...',practice:'Примени.',test:'Что такое SCAMPER?'},
{title:'Mind map',theory:'**Ветви от центра.**',example:'Тони Бьюзен.',practice:'1 карта.',test:'Что такое mind map?'},
{title:'Мозговой штурм',theory:'**Без критики.**',example:'Количество → качество.',practice:'20 идей.',test:'Правило?'}
]},
{id:'c_stoicism',emoji:'🏛',title:'Стоицизм',category:'Философия',hours:5,lessons:[
{title:'Что это',theory:'**Дихотомия контроля.**',example:'В моей власти / не в моей.',practice:'Разбери.',test:'Что такое дихотомия?'},
{title:'Марк Аврелий',theory:'**Размышления.**',example:'Император-философ.',practice:'Читай.',test:'Кто такой?'},
{title:'Сенека',theory:'**Письма.**',example:'"Мы страдаем больше в воображении."',practice:'Читай.',test:'Кто такой?'},
{title:'Эпиктет',theory:'**Enchiridion.**',example:'"Не события, а мнения о них."',practice:'Читай.',test:'Что главное?'},
{title:'Premeditatio',theory:'**Представь худшее.**',example:'Подготовка = спокойствие.',practice:'Сделай.',test:'Зачем?'},
{title:'Memento mori',theory:'**Помни о смерти.**',example:'Жизнь = ограниченный ресурс.',practice:'Эпитафия.',test:'Что значит?'}
]},
{id:'c_ikigai_course',emoji:'🌺',title:'Икигай',category:'Философия',hours:4,lessons:[
{title:'Что это',theory:'**Японский смысл.**',example:'Причина вставать утром.',practice:'Заметь.',test:'Что такое икигай?'},
{title:'4 сферы',theory:'**Люблю, умею, платят, нужно.**',example:'Пересечение всех 4.',practice:'4 списка.',test:'4 сферы?'},
{title:'Пересечение',theory:'**Центр = икигай.**',example:'Что объединяет?',practice:'Найди.',test:'Что в центре?'},
{title:'Работа',theory:'**Не только она.**',example:'Икигай шире карьеры.',practice:'Заметь.',test:'Только работа?'},
{title:'Отношения',theory:'**Тоже часть.**',example:'Смысл в людях.',practice:'Оцени.',test:'Что ещё?'},
{title:'Итог',theory:'**Смысл.**',example:'Не создают — находят.',practice:'Продолжай.',test:'Что главное?'}
]},
{id:'c_learning_how',emoji:'📚',title:'Как учиться',category:'Учёба',hours:5,lessons:[
{title:'Pomodoro',theory:'**25/5.**',example:'Фокус = короткие интервалы.',practice:'4.',test:'Сколько/перерыв?'},
{title:'Recall',theory:'**Припоминание.**',example:'Закрыл — вспомнил.',practice:'Вспомни.',test:'Что сильнее?'},
{title:'Feynman',theory:'**Объясни ребёнку.**',example:'Не можешь объяснить = не понял.',practice:'Объясни.',test:'Что делать?'},
{title:'Anki',theory:'**Интервалы.**',example:'20 карточек/день.',practice:'Создай.',test:'Сколько в день?'},
{title:'Cornell',theory:'**Конспект с колонками.**',example:'Заметки + вопросы + резюме.',practice:'Сделай.',test:'Что в колонках?'},
{title:'Mind map',theory:'**Ветви от центра.**',example:'Визуальная структура.',practice:'1 карта.',test:'Что такое mind map?'}
]},
{id:'c_recovery_course',emoji:'🌿',title:'Восстановление',category:'Восстановление',hours:6,lessons:[
{title:'Что это',theory:'**7 видов отдыха.**',example:'Физический, ментальный, сенсорный...',practice:'Определи.',test:'Сколько видов?'},
{title:'Физический',theory:'**Сон, еда, прогулка.**',example:'Без сна = не работает.',practice:'7-9ч.',test:'Что в физическом?'},
{title:'Ментальный',theory:'**Медитация, дневник.**',example:'Отдых от мыслей.',practice:'10 мин.',test:'Что в ментальном?'},
{title:'Сенсорный',theory:'**Тишина, темнота.**',example:'Отдых от шума.',practice:'1 ч.',test:'Что в сенсорном?'},
{title:'Творческий',theory:'**Хобби, музыка.**',example:'Руками.',practice:'30 мин.',test:'Что в творческом?'},
{title:'Социальный',theory:'**Друзья, семья.**',example:'Живое общение.',practice:'1×/нед.',test:'Что в социальном?'}
]},
{id:'c_neuro_basics',emoji:'🔬',title:'Нейробиология',category:'Нейро',hours:6,lessons:[
{title:'Нейропластичность',theory:'**Мозг меняется всю жизнь.**',example:'Новые нейроны в гиппокампе.',practice:'Учи 30 дней.',test:'Что это?'},
{title:'Синапсы',theory:'**Связи между нейронами.**',example:'Чем чаще — тем сильнее.',practice:'Повторяй.',test:'Что такое синапс?'},
{title:'Хебб',theory:'**Fire together, wire together.**',example:'Нейроны, активирующиеся вместе, соединяются.',practice:'Заметь.',test:'Правило Хебба?'},
{title:'Миелин',theory:'**Ускорение сигнала.**',example:'Миелин = в 100 раз быстрее.',practice:'Повторяй.',test:'Что делает миелин?'},
{title:'Дофамин',theory:'**Предвкушение, не награда.**',example:'Соцсети = дофаминовая яма.',practice:'Голодание.',test:'Что такое дофамин?'},
{title:'Сон',theory:'**Консолидация памяти.**',example:'Учи перед сном.',practice:'Спи 8ч.',test:'Что делает сон?'}
]}
];

/* ============================================================
   PATHS_LIBRARY (12 путей)
   ============================================================ */
var PATHS_LIBRARY=[
{id:'p_health',emoji:'❤️',title:'Путь здоровья',category:'Здоровье',steps:[
{title:'Шаг 1: Осознание',desc:'Оцени текущее здоровье',secret:'Замерь: вес, сон, шаги.'},
{title:'Шаг 2: Сон',desc:'Настрой режим сна',secret:'Одно время, темнота.'},
{title:'Шаг 3: Питание',desc:'500 г овощей, белок',secret:'Средиземноморская.'},
{title:'Шаг 4: Движение',desc:'150 мин кардио',secret:'Zone 2.'},
{title:'Шаг 5: Вода',desc:'8 стаканов',secret:'Утром 500 мл.'},
{title:'Шаг 6: Стресс',desc:'Медитация 10 мин',secret:'Box breathing.'},
{title:'Шаг 7: Восстановление',desc:'7 видов отдыха',secret:'Планируй.'},
{title:'Шаг 8: Чек-ап',desc:'1×/год',secret:'Зубы 2×/год.'}
]},
{id:'p_productivity',emoji:'⚡',title:'Путь продуктивности',category:'Продуктивность',steps:[
{title:'Шаг 1: Аудит',desc:'Неделя замеров',secret:'Где уходит?'},
{title:'Шаг 2: Deep Work',desc:'1 блок 90 мин',secret:'Телефон вне.'},
{title:'Шаг 3: Приоритеты',desc:'3 главных дела',secret:'Матрица.'},
{title:'Шаг 4: Планирование',desc:'Вечером на завтра',secret:'Time-block.'},
{title:'Шаг 5: Pomodoro',desc:'4 помидора',secret:'25/5.'},
{title:'Шаг 6: Отказы',desc:'Говори "нет"',secret:'Вежливо.'},
{title:'Шаг 7: Инструменты',desc:'Notion/Todoist',secret:'Один.'},
{title:'Шаг 8: Ревью',desc:'Недельный',secret:'Воскресенье.'}
]},
{id:'p_wealth',emoji:'💰',title:'Путь богатства',category:'Финансы',steps:[
{title:'Шаг 1: Учёт',desc:'Записывай траты',secret:'Каждая.'},
{title:'Шаг 2: Бюджет',desc:'50/30/20',secret:'Автоматизация.'},
{title:'Шаг 3: Подушка',desc:'3-6 мес',secret:'Отдельный счёт.'},
{title:'Шаг 4: Долги',desc:'Лавина',secret:'Высокий % первым.'},
{title:'Шаг 5: Инвестиции',desc:'20% дохода',secret:'Индексные.'},
{title:'Шаг 6: Доход',desc:'3+ источника',secret:'Фриланс.'},
{title:'Шаг 7: FIRE',desc:'25× расходов',secret:'Норма 50%.'},
{title:'Шаг 8: Вычеты',desc:'Верни налоги',secret:'До 15%.'}
]},
{id:'p_english',emoji:'🇬🇧',title:'Путь английского',category:'Английский',steps:[
{title:'Шаг 1: База',desc:'A1',secret:'Алфавит.'},
{title:'Шаг 2: Present',desc:'Simple',secret:'V(s/es).'},
{title:'Шаг 3: Past',desc:'Simple',secret:'V+ed.'},
{title:'Шаг 4: Perfect',desc:'have + V3',secret:'Результат.'},
{title:'Шаг 5: Speaking',desc:'15 мин',secret:'С 1 дня.'},
{title:'Шаг 6: Listening',desc:'30 мин',secret:'6 Minute.'},
{title:'Шаг 7: Reading',desc:'20 мин',secret:'Simple.'},
{title:'Шаг 8: Writing',desc:'Дневник',secret:'5 предложений.'}
]},
{id:'p_memory',emoji:'🧠',title:'Путь памяти',category:'Ментальное',steps:[
{title:'Шаг 1: Типы',desc:'3 типа',secret:'Сенсорная, кратко, долго.'},
{title:'Шаг 2: Локусы',desc:'10 точек',secret:'Квартира.'},
{title:'Шаг 3: Мнемоники',desc:'Акроним',secret:'История.'},
{title:'Шаг 4: Чанкинг',desc:'Группируй',secret:'7±2.'},
{title:'Шаг 5: Recall',desc:'Активно',secret:'Тест.'},
{title:'Шаг 6: Anki',desc:'20 карточек',secret:'День.'},
{title:'Шаг 7: Сон',desc:'Консолидация',secret:'Учи перед сном.'},
{title:'Шаг 8: Итог',desc:'×5 памяти',secret:'Система.'}
]},
{id:'p_eq',emoji:'❤️',title:'Путь EQ',category:'Эмоциональное',steps:[
{title:'Шаг 1: Осознание',desc:'Дневник эмоций',secret:'3 раза.'},
{title:'Шаг 2: Регуляция',desc:'Пауза 6 сек',secret:'Пауза.'},
{title:'Шаг 3: Мотивация',desc:'Автономия',secret:'Смысл.'},
{title:'Шаг 4: Эмпатия',desc:'Слушай',secret:'Не советуй.'},
{title:'Шаг 5: Соц.навыки',desc:'Я-сообщения',secret:'Формула.'},
{title:'Шаг 6: Стресс',desc:'Box breathing',secret:'4-4-4-4.'},
{title:'Шаг 7: Гнев',desc:'Пауза',secret:'Спорт.'},
{title:'Шаг 8: Итог',desc:'+20% EQ',secret:'Месяц.'}
]},
{id:'p_digital_detox',emoji:'📱',title:'Путь детокса',category:'Цифровое',steps:[
{title:'Шаг 1: Замер',desc:'Screen Time',secret:'Реальные цифры.'},
{title:'Шаг 2: Уведомления',desc:'Отключи',secret:'Всё лишнее.'},
{title:'Шаг 3: Утро',desc:'30 мин без',secret:'Телефон в комнате.'},
{title:'Шаг 4: Соцсети',desc:'Лимит 30 мин',secret:'Время.'},
{title:'Шаг 5: Вечер',desc:'2 часа без',secret:'Книга.'},
{title:'Шаг 6: Замены',desc:'Хобби',secret:'Заполни.'},
{title:'Шаг 7: Метрики',desc:'-20% в неделю',secret:'Трекер.'},
{title:'Шаг 8: Итог',desc:'Свобода',secret:'-60%.'}
]},
{id:'p_relationships',emoji:'💞',title:'Путь отношений',category:'Отношения',steps:[
{title:'Шаг 1: Самопознание',desc:'Ценности',secret:'5 главных.'},
{title:'Шаг 2: Слушание',desc:'Активное',secret:'Парафраз.'},
{title:'Шаг 3: Границы',desc:'"Нет" без вины',secret:'Формула.'},
{title:'Шаг 4: Конфликты',desc:'Сотрудничество',secret:'Win-win.'},
{title:'Шаг 5: Глубина',desc:'5 близких',secret:'Уязвимость.'},
{title:'Шаг 6: Регулярность',desc:'Встречи',secret:'Календарь.'},
{title:'Шаг 7: Поддержка',desc:'В трудности',secret:'Рядом.'},
{title:'Шаг 8: Итог',desc:'+Связи',secret:'90 дней.'}
]},
{id:'p_career',emoji:'💼',title:'Путь карьеры',category:'Карьера',steps:[
{title:'Шаг 1: Икигай',desc:'4 сферы',secret:'Пересечение.'},
{title:'Шаг 2: Навыки',desc:'T-shape',secret:'Глубина + ширина.'},
{title:'Шаг 3: Резюме',desc:'1 стр.',secret:'Результат.'},
{title:'Шаг 4: Собеседование',desc:'STAR',secret:'5 историй.'},
{title:'Шаг 5: Переговоры',desc:'+20%',secret:'Не сразу.'},
{title:'Шаг 6: Нетворк',desc:'5/мес',secret:'Дай первым.'},
{title:'Шаг 7: Бренд',desc:'Публикуй',secret:'2×/нед.'},
{title:'Шаг 8: Итог',desc:'Рост',secret:'Менторы.'}
]},
{id:'p_stoicism',emoji:'🏛',title:'Путь стоика',category:'Философия',steps:[
{title:'Шаг 1: Дихотомия',desc:'В моей власти?',secret:'Фокус.'},
{title:'Шаг 2: Чтение',desc:'Марк Аврелий',secret:'Размышления.'},
{title:'Шаг 3: Premeditatio',desc:'Худшее',secret:'Готов.'},
{title:'Шаг 4: Memento mori',desc:'Помни',secret:'Эпитафия.'},
{title:'Шаг 5: Пауза',desc:'6 сек',secret:'Реакция.'},
{title:'Шаг 6: Утро',desc:'Планируй',secret:'3 дела.'},
{title:'Шаг 7: Вечер',desc:'Рефлексия',secret:'Дневник.'},
{title:'Шаг 8: Итог',desc:'Спокойствие',secret:'30 дней.'}
]},
{id:'p_financial_freedom',emoji:'🦅',title:'Путь финансовой свободы',category:'Финансы',steps:[
{title:'Шаг 1: Цель',desc:'25× расходов',secret:'FIRE число.'},
{title:'Шаг 2: Норма',desc:'50%',secret:'Автоматизация.'},
{title:'Шаг 3: Доход',desc:'Расти',secret:'Навыки.'},
{title:'Шаг 4: Расходы',desc:'Сократи',secret:'Осознанно.'},
{title:'Шаг 5: Инвестиции',desc:'Диверсификация',secret:'Индекс.'},
{title:'Шаг 6: Налоги',desc:'Вычеты',secret:'ИИС.'},
{title:'Шаг 7: Подушка',desc:'6 мес',secret:'Не трогать.'},
{title:'Шаг 8: Итог',desc:'Свобода',secret:'10 лет.'}
]},
{id:'p_vision',emoji:'👁',title:'Путь зрения',category:'Здоровье',steps:[
{title:'Шаг 1: Замер',desc:'Оцени зрение',secret:'Тест у врача.'},
{title:'Шаг 2: 20-20-20',desc:'Каждые 20 мин',secret:'Таймер.'},
{title:'Шаг 3: Пальминг',desc:'5 мин тепла',secret:'Ладони.'},
{title:'Шаг 4: Гимнастика',desc:'10 упражнений',secret:'Утром.'},
{title:'Шаг 5: Питание',desc:'Черника, морковь',secret:'2×/нед.'},
{title:'Шаг 6: Свет',desc:'10 мин солнца',secret:'Утром.'},
{title:'Шаг 7: Экран',desc:'50-70 см',secret:'Отодвинь.'},
{title:'Шаг 8: Отдых',desc:'Каждый час',secret:'Закрой глаза.'}
]}
];

/* ============================================================
   METHODS_LIBRARY (30 методик)
   ============================================================ */
var METHODS_LIBRARY=[
{id:'m_pomodoro',emoji:'🍅',title:'Pomodoro',category:'Продуктивность',desc:'25/5 циклы.',steps:['Выбери задачу','Таймер 25','Работай','Перерыв 5','Повтори 4×','Перерыв 30'],base:'Франческо Чирилло'},
{id:'m_deep_work',emoji:'🎯',title:'Deep Work',category:'Продуктивность',desc:'Глубокая работа 90 мин.',steps:['Телефон вне','Одна задача','Таймер 90','Перерыв 15'],base:'Кэл Ньюпорт'},
{id:'m_gtd',emoji:'📥',title:'GTD',category:'Продуктивность',desc:'Getting Things Done.',steps:['Capture','Clarify','Organize','Reflect','Engage'],base:'Дэвид Аллен'},
{id:'m_eisenhower',emoji:'🔢',title:'Матрица Эйзенхауэра',category:'Продуктивность',desc:'4 квадранта.',steps:['Q1: делай','Q2: планируй','Q3: делегируй','Q4: удали'],base:'Дуайт Эйзенхауэр'},
{id:'m_eat_frog',emoji:'🐸',title:'Eat That Frog',category:'Продуктивность',desc:'Сложное первым.',steps:['Определи жабу','Съешь утром','Без телефона'],base:'Брайан Трейси'},
{id:'m_time_blocking',emoji:'📅',title:'Time-blocking',category:'Продуктивность',desc:'Каждое дело в слот.',steps:['Список дел','Оцени время','Слоты','Буферы 20%'],base:'Кэл Ньюпорт'},
{id:'m_2min',emoji:'⏱',title:'Правило 2 минут',category:'Продуктивность',desc:'Меньше 2 мин — сразу.',steps:['Задача <2 мин?','Делай сразу','Не откладывай'],base:'Дэвид Аллен'},
{id:'m_feynman',emoji:'👨‍🏫',title:'Метод Фейнмана',category:'Учёба',desc:'Объясни ребёнку.',steps:['Выбери тему','Объясни 12-летнему','Найди пробелы','Упрости'],base:'Ричард Фейнман'},
{id:'m_anki',emoji:'🃏',title:'Anki',category:'Учёба',desc:'Интервальное повторение.',steps:['Создай карточку','Оцени 1-4','Алгоритм','20 мин/день'],base:'SRS'},
{id:'m_cornell',emoji:'📝',title:'Cornell',category:'Учёба',desc:'Конспект с колонками.',steps:['Раздели лист','Конспект','Вопросы','Резюме'],base:'Уолтер Паук'},
{id:'m_mind_map',emoji:'🗺',title:'Mind Map',category:'Учёба',desc:'Визуальные карты.',steps:['Центр','Ветви','Подветви','Цвета'],base:'Тони Бьюзен'},
{id:'m_sq3r',emoji:'📖',title:'SQ3R',category:'Учёба',desc:'Чтение с пониманием.',steps:['Survey','Question','Read','Recite','Review'],base:'Фрэнсис Робинсон'},
{id:'m_memory_palace',emoji:'🏛',title:'Дворец памяти',category:'Ментальное',desc:'Метод локусов.',steps:['Выбери место','10 точек','Размести образы','Пройди мысленно'],base:'Цицерон'},
{id:'m_n_back',emoji:'🎯',title:'N-back',category:'Ментальное',desc:'Рабочая память.',steps:['Показ стимулов','Запомни N назад','Ответь','Уровень'],base:'Киршнер'},
{id:'m_box_breathing',emoji:'🌬',title:'Box breathing',category:'Эмоциональное',desc:'4-4-4-4.',steps:['Вдох 4','Задержка 4','Выдох 4','Задержка 4'],base:'Navy SEAL'},
{id:'m_478',emoji:'🌙',title:'Дыхание 4-7-8',category:'Эмоциональное',desc:'Для сна.',steps:['Вдох 4','Задержка 7','Выдох 8','Повтори 4'],base:'Эндрю Вейл'},
{id:'m_wim_hof',emoji:'❄️',title:'Wim Hof',category:'Здоровье',desc:'Дыхание + холод.',steps:['30 глубоких вдохов','Задержка','Выдох','Холодный душ'],base:'Вим Хоф'},
{id:'m_meditation',emoji:'🧘',title:'Медитация',category:'Духовное',desc:'10-20 мин/день.',steps:['Сядь','Дыхание','Наблюдай','Возвращай'],base:'MBSR'},
{id:'m_body_scan',emoji:'👁',title:'Body scan',category:'Духовное',desc:'Сканирование тела.',steps:['Ляг','Внимание на стопы','Вверх','Расслабь'],base:'Джон Кабат-Зинн'},
{id:'m_gratitude',emoji:'🙏',title:'Благодарность',category:'Духовное',desc:'3 пункта/день.',steps:['Утром','Вечером','Дневник','Скажи другим'],base:'Роберт Эммонс'},
{id:'m_journal',emoji:'📓',title:'Дневник',category:'Эмоциональное',desc:'Утренние страницы.',steps:['3 стр. от руки','Без правок','Каждый день'],base:'Джулия Кэмерон'},
{id:'m_ikigai',emoji:'🌺',title:'Икигай',category:'Философия',desc:'Японский смысл.',steps:['Люблю','Умею','Платят','Нужно'],base:'Япония'},
{id:'m_habit_loop',emoji:'🔄',title:'Петля привычки',category:'Продуктивность',desc:'Cue-craving-response-reward.',steps:['Cue','Craving','Response','Reward'],base:'Чарльз Дахигг'},
{id:'m_2min_rule',emoji:'⏱',title:'Правило 2 минут',category:'Продуктивность',desc:'Мини-версия привычки.',steps:['Начни 2 мин','Постепенно','Привязка'],base:'Джеймс Клир'},
{id:'m_habit_stacking',emoji:'📚',title:'Habit stacking',category:'Продуктивность',desc:'Привязка к старой.',steps:['Старая привычка','Новая','После X сделаю Y'],base:'Джеймс Клир'},
{id:'m_80_20',emoji:'📊',title:'Принцип 80/20',category:'Продуктивность',desc:'20% дают 80%.',steps:['Найди 20%','Фокус','Убери 80%'],base:'Парето'},
{id:'m_flow',emoji:'🌊',title:'Поток',category:'Эмоциональное',desc:'Полное погружение.',steps:['Сложность=навык','Цель','Фидбэк','Фокус'],base:'Чиксентмихайи'},
{id:'m_memento',emoji:'💀',title:'Memento Mori',category:'Философия',desc:'Помни о смерти.',steps:['Эпитафия','Meditatio','Приоритеты'],base:'Стоики'},
{id:'m_20_20_20',emoji:'👁',title:'20-20-20',category:'Здоровье',desc:'Для глаз.',steps:['Каждые 20 мин','20 сек','На 6 м'],base:'Офтальмология'},
{id:'m_cold_shower',emoji:'❄️',title:'Холодный душ',category:'Здоровье',desc:'2 мин.',steps:['Тёплый','Холодный 30 сек','До 2 мин'],base:'Вим Хоф'}
];

/* ============================================================
   ЭКСПОРТ
   ============================================================ */
window.THEMES=THEMES;
window.DOMAINS=DOMAINS;
window.DAILY_WISDOMS=DAILY_WISDOMS;
window.getTodayWisdom=getTodayWisdom;
window.DAILY_CHALLENGES=DAILY_CHALLENGES;
window.getTodayChallenges=getTodayChallenges;
window.WORK_MODES=WORK_MODES;
window.SURVEY_QUESTIONS=SURVEY_QUESTIONS;
window.TABS=TABS;
window.QUICK_TABS=QUICK_TABS;
window.PERSONAS=PERSONAS;
window.LEARNING_LEVELS=LEARNING_LEVELS;
window.ACHIEVEMENTS=ACHIEVEMENTS;
window.RECOVERY_LIBRARY=RECOVERY_LIBRARY;
window.SCREEN_TIPS=SCREEN_TIPS;
window.VISION_EXERCISES=VISION_EXERCISES;
window.DETOX_COURSE=DETOX_COURSE;
window.COURSES_LIBRARY=COURSES_LIBRARY;
window.PATHS_LIBRARY=PATHS_LIBRARY;
window.METHODS_LIBRARY=METHODS_LIBRARY;
window.__SCREEN_TIPS=SCREEN_TIPS;
window.__DETOX_COURSE=DETOX_COURSE;
window.todayKey=todayKey;
window.yesterdayKey=yesterdayKey;

console.log('[CONTENT] Loaded: THEMES='+THEMES.length+' LEVELS='+LEARNING_LEVELS.length+' COURSES='+COURSES_LIBRARY.length+' PATHS='+PATHS_LIBRARY.length+' METHODS='+METHODS_LIBRARY.length+' VISION='+VISION_EXERCISES.length);