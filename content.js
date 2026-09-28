'use strict';
/* LIFE OS — CONTENT.js v42 */

var THEMES=[
{id:'pumpkin',emoji:'🎃',name:'Тыква',bg:'#1a0800',bg2:'#2a0f02',text:'#ffe8c8',brand:'#ff8c1a',brand2:'#ff5e00',effect:'pumpkin'},
{id:'vampire',emoji:'🦇',name:'Вампир',bg:'#0a0000',bg2:'#180202',text:'#ffdada',brand:'#e60000',brand2:'#8b0000',effect:'bats'},
{id:'ghost',emoji:'👻',name:'Призрак',bg:'#08061a',bg2:'#0f0c2a',text:'#e8e5ff',brand:'#a89bff',brand2:'#7a6bff',effect:'ghosts'},
{id:'web',emoji:'🕸',name:'Паутина',bg:'#001008',bg2:'#001c10',text:'#d8ffe8',brand:'#00ff88',brand2:'#00aa55',effect:'spiderweb'},
{id:'harvest',emoji:'🌾',name:'Урожай',bg:'#1a1005',bg2:'#2a1a08',text:'#ffe4b5',brand:'#c8901e',brand2:'#8b6000',effect:'leaves'},
{id:'witch',emoji:'🧙',name:'Ведьма',bg:'#0f0518',bg2:'#1a0a28',text:'#e8d8ff',brand:'#9b59d0',brand2:'#6b2d9b',effect:'sparkles'},
{id:'zombie',emoji:'🧟',name:'Зомби',bg:'#0a0f05',bg2:'#151a0a',text:'#d8ffb0',brand:'#7ba832',brand2:'#4a6e1a',effect:'fog'},
{id:'skull',emoji:'💀',name:'Череп',bg:'#0a0a0a',bg2:'#151515',text:'#e8e8e8',brand:'#c0c0c0',brand2:'#808080',effect:'bones'},
{id:'blood',emoji:'🩸',name:'Кровь',bg:'#100000',bg2:'#200000',text:'#ffcccc',brand:'#c00000',brand2:'#800000',effect:'drops'},
{id:'candle',emoji:'🕯',name:'Свеча',bg:'#140a00',bg2:'#221408',text:'#ffe8b8',brand:'#e8a838',brand2:'#b87818',effect:'candles'},
{id:'raven',emoji:'🐦‍⬛',name:'Ворон',bg:'#050510',bg2:'#0a0a1a',text:'#d0d0e8',brand:'#5b5b9b',brand2:'#3a3a6b',effect:'feathers'},
{id:'midnight',emoji:'🌑',name:'Полночь',bg:'#000000',bg2:'#0a0a12',text:'#d8d8e8',brand:'#3a3a5a',brand2:'#1a1a3a',effect:'stars'},
{id:'dark',emoji:'🌙',name:'Тёмная',bg:'#000',bg2:'#0b0b10',text:'#fff',brand:'#5b9eff',brand2:'#a78bfa',effect:'stars'},
{id:'light',emoji:'☀️',name:'Светлая',bg:'#f0f0f6',bg2:'#fff',text:'#000',brand:'#0a84ff',brand2:'#5e5ce6',effect:'none'},
{id:'ocean',emoji:'🌊',name:'Океан',bg:'#000814',bg2:'#001428',text:'#e0fbfc',brand:'#00b4d8',brand2:'#0077b6',effect:'waves'},
{id:'sakura',emoji:'🌸',name:'Сакура',bg:'#1a0f14',bg2:'#2a1a20',text:'#ffe5ec',brand:'#ff8fab',brand2:'#fb6f92',effect:'petals'},
{id:'forest',emoji:'🌲',name:'Лес',bg:'#0a1410',bg2:'#14241c',text:'#e8f5e9',brand:'#52b788',brand2:'#2d6a4f',effect:'leaves'},
{id:'sunset',emoji:'🌅',name:'Закат',bg:'#1a0a05',bg2:'#2a1510',text:'#fff5e6',brand:'#ff7b54',brand2:'#ffb26b',effect:'stars'},
{id:'ice',emoji:'❄️',name:'Лёд',bg:'#0a1419',bg2:'#152a33',text:'#e0f4ff',brand:'#4dd4ff',brand2:'#7ad7ff',effect:'snow'},
{id:'amethyst',emoji:'💎',name:'Аметист',bg:'#12061f',bg2:'#1e0d2f',text:'#f0e5ff',brand:'#b394ff',brand2:'#a78bfa',effect:'sparkles'},
{id:'aurora',emoji:'🌌',name:'Аврора',bg:'#050a15',bg2:'#0a1525',text:'#e0f0ff',brand:'#7bffb5',brand2:'#a78bfa',effect:'aurora'},
{id:'desert',emoji:'🏜',name:'Пустыня',bg:'#1a1208',bg2:'#2a1e0f',text:'#fff0dd',brand:'#d4a373',brand2:'#bc6c25',effect:'dust'},
{id:'cyber',emoji:'⚡',name:'Кибер',bg:'#0a0014',bg2:'#15001f',text:'#f0e0ff',brand:'#ff00ff',brand2:'#00ffff',effect:'sparkles'},
{id:'mono',emoji:'⚫',name:'Моно',bg:'#0a0a0a',bg2:'#141414',text:'#f0f0f0',brand:'#ffffff',brand2:'#cccccc',effect:'none'},
{id:'lava',emoji:'🔥',name:'Лава',bg:'#140000',bg2:'#280505',text:'#ffe0d0',brand:'#ff4400',brand2:'#ff2200',effect:'fire'},
{id:'mint',emoji:'🌿',name:'Мята',bg:'#08140f',bg2:'#0f2419',text:'#e0fff0',brand:'#3ddc97',brand2:'#4dd4ff',effect:'bubbles'},
{id:'coffee',emoji:'☕',name:'Кофе',bg:'#1a0e08',bg2:'#2a1a12',text:'#fff0e0',brand:'#c68a4e',brand2:'#8b5a2b',effect:'dust'},
{id:'neon',emoji:'💡',name:'Неон',bg:'#000',bg2:'#0a0a0a',text:'#fff',brand:'#00ff88',brand2:'#ff00ff',effect:'sparkles'},
{id:'sunrise',emoji:'🌄',name:'Рассвет',bg:'#1a0d0a',bg2:'#2a1a12',text:'#fff5e6',brand:'#ffa940',brand2:'#ff6b6b',effect:'stars'},
{id:'rain',emoji:'🌧',name:'Дождь',bg:'#0a1018',bg2:'#141e28',text:'#e0ecf5',brand:'#5b9eff',brand2:'#4dd4ff',effect:'rain'},
{id:'storm',emoji:'⛈',name:'Гроза',bg:'#0a0a14',bg2:'#14141f',text:'#e0e0f0',brand:'#8b8bff',brand2:'#5b5bff',effect:'lightning'},
{id:'crystal',emoji:'🔮',name:'Кристалл',bg:'#0a1420',bg2:'#152538',text:'#e0f0ff',brand:'#4dd4ff',brand2:'#a78bfa',effect:'sparkles'},
{id:'holo',emoji:'🌈',name:'Голограмма',bg:'#000814',bg2:'#001428',text:'#e0f0ff',brand:'#ff00ff',brand2:'#00ffff',effect:'sparkles'},
{id:'moon',emoji:'🌕',name:'Луна',bg:'#0a0a1a',bg2:'#14142a',text:'#f0f0ff',brand:'#c0c0ff',brand2:'#8888cc',effect:'stars'},
{id:'sand',emoji:'🏖',name:'Песок',bg:'#1a1408',bg2:'#2a2012',text:'#fff5e0',brand:'#d4b483',brand2:'#b8935a',effect:'dust'},
{id:'sakura-night',emoji:'🌺',name:'Сакура-ночь',bg:'#14081a',bg2:'#200d28',text:'#ffe5f0',brand:'#ff6b9d',brand2:'#cc4488',effect:'petals'},
{id:'deep',emoji:'🌊',name:'Глубина',bg:'#000a14',bg2:'#001428',text:'#d0f0ff',brand:'#0088cc',brand2:'#0055aa',effect:'waves'},
{id:'rose',emoji:'🌹',name:'Роза',bg:'#1a0810',bg2:'#2a1018',text:'#ffe5ec',brand:'#ff3366',brand2:'#cc0044',effect:'petals'},
{id:'bamboo',emoji:'🎋',name:'Бамбук',bg:'#0a1408',bg2:'#14240f',text:'#e8f5e0',brand:'#7bc043',brand2:'#4a8a2a',effect:'leaves'},
{id:'cosmos',emoji:'🌠',name:'Космос',bg:'#0a0014',bg2:'#15001f',text:'#f0e0ff',brand:'#b394ff',brand2:'#7b68ee',effect:'stars'},
{id:'matrix',emoji:'💚',name:'Матрица',bg:'#000a00',bg2:'#001400',text:'#d8ffd8',brand:'#00ff00',brand2:'#00aa00',effect:'sparkles'},
{id:'gold',emoji:'🥇',name:'Золото',bg:'#0a0800',bg2:'#1a1205',text:'#fff5d0',brand:'#ffcc00',brand2:'#ff9900',effect:'sparkles'},
{id:'silver',emoji:'🥈',name:'Серебро',bg:'#0a0a0f',bg2:'#14141f',text:'#f0f0f5',brand:'#c0c0c8',brand2:'#8888a0',effect:'stars'},
{id:'coral',emoji:'🐠',name:'Коралл',bg:'#1a0e0a',bg2:'#2a1a12',text:'#ffe5d5',brand:'#ff7b6b',brand2:'#ff5555',effect:'bubbles'},
{id:'nebula',emoji:'🌫',name:'Туманность',bg:'#0a0514',bg2:'#150d1f',text:'#e8e0ff',brand:'#9b7bff',brand2:'#5b4bcc',effect:'stars'},
{id:'polar',emoji:'🧊',name:'Полярная',bg:'#0a1520',bg2:'#152538',text:'#e0f4ff',brand:'#7bc8ff',brand2:'#4d99ff',effect:'snow'},
{id:'jungle',emoji:'🌴',name:'Джунгли',bg:'#0a1a0a',bg2:'#142a14',text:'#e0f5e0',brand:'#3ddc97',brand2:'#00aa66',effect:'leaves'},
{id:'royal',emoji:'👑',name:'Королевская',bg:'#0a0514',bg2:'#150d28',text:'#f0e5ff',brand:'#9b59b6',brand2:'#6b2d9b',effect:'sparkles'},
{id:'forest-night',emoji:'🌲',name:'Ночной лес',bg:'#08100a',bg2:'#101a12',text:'#d8e8d8',brand:'#4a9e4a',brand2:'#2a6e2a',effect:'dust'},
{id:'fire',emoji:'🔥',name:'Огонь',bg:'#140600',bg2:'#280f05',text:'#ffd5a0',brand:'#ff5500',brand2:'#cc2200',effect:'fire'},
{id:'frost',emoji:'❄',name:'Мороз',bg:'#0a1525',bg2:'#15253a',text:'#e0f0ff',brand:'#88ccff',brand2:'#5599ee',effect:'snow'},
{id:'spirit',emoji:'✨',name:'Дух',bg:'#14082a',bg2:'#200d40',text:'#f0e5ff',brand:'#c88bff',brand2:'#8855cc',effect:'sparkles'},
{id:'time',emoji:'⏳',name:'Время',bg:'#0a0e14',bg2:'#141a24',text:'#e0e8f0',brand:'#a0a8b8',brand2:'#707888',effect:'stars'},
{id:'money',emoji:'💰',name:'Деньги',bg:'#0a1408',bg2:'#142410',text:'#e8f5d8',brand:'#7bc043',brand2:'#4a8a2a',effect:'sparkles'},
{id:'love',emoji:'❤️',name:'Любовь',bg:'#1a0810',bg2:'#2a1020',text:'#ffe0e8',brand:'#ff3366',brand2:'#cc0044',effect:'petals'},
{id:'zen',emoji:'🧘',name:'Дзен',bg:'#0a1410',bg2:'#14241c',text:'#e0f0e8',brand:'#6b9e8b',brand2:'#4a7e6b',effect:'leaves'},
{id:'paper',emoji:'📜',name:'Пергамент',bg:'#1a1408',bg2:'#2a2012',text:'#f5ecd0',brand:'#c4a35a',brand2:'#8b6f3a',effect:'dust'},
{id:'steel',emoji:'⚙️',name:'Сталь',bg:'#0f1418',bg2:'#1a2028',text:'#e0e8f0',brand:'#8b9eb0',brand2:'#5b6e80',effect:'sparkles'},
{id:'fireflies',emoji:'✨',name:'Светлячки',bg:'#050a05',bg2:'#0a140a',text:'#f0ffe0',brand:'#c8ff5b',brand2:'#88cc22',effect:'fireflies'},
{id:'underwater',emoji:'🐟',name:'Под водой',bg:'#001428',bg2:'#002a4a',text:'#d0f0ff',brand:'#4dd4ff',brand2:'#0088cc',effect:'bubbles'},
{id:'starlight',emoji:'⭐',name:'Звёздный свет',bg:'#0a0a2a',bg2:'#141445',text:'#f0f0ff',brand:'#ffd700',brand2:'#ff88cc',effect:'stars'},
{id:'lotus',emoji:'🪷',name:'Лотос',bg:'#1a0f1a',bg2:'#2a1a2a',text:'#ffe5ff',brand:'#ff88cc',brand2:'#cc44aa',effect:'petals'},
{id:'citrus',emoji:'🍊',name:'Цитрус',bg:'#1a1000',bg2:'#2a1a00',text:'#fff5d0',brand:'#ff9500',brand2:'#ff5500',effect:'sparkles'},
{id:'lavender',emoji:'💜',name:'Лаванда',bg:'#12061f',bg2:'#1e0d2f',text:'#f0e5ff',brand:'#c8a8ff',brand2:'#9b59b6',effect:'petals'},
{id:'smoke',emoji:'💨',name:'Дым',bg:'#0a0a0a',bg2:'#151515',text:'#e0e0e0',brand:'#888888',brand2:'#555555',effect:'fog'},
{id:'velvet',emoji:'🍷',name:'Бархат',bg:'#1a0510',bg2:'#2a0818',text:'#ffe0e8',brand:'#9b1a4a',brand2:'#6b0a2a',effect:'petals'},
{id:'galaxy',emoji:'🌌',name:'Галактика',bg:'#05001a',bg2:'#0a002a',text:'#e8e0ff',brand:'#a855f7',brand2:'#6366f1',effect:'stars'},
{id:'bubblegum',emoji:'🍬',name:'Баблгам',bg:'#1a0a1a',bg2:'#2a1028',text:'#ffe0ff',brand:'#ff66cc',brand2:'#cc44aa',effect:'bubbles'},
{id:'cyberpunk',emoji:'🌆',name:'Киберпанк',bg:'#0a0014',bg2:'#15001f',text:'#f0e0ff',brand:'#ff0088',brand2:'#00ffff',effect:'sparkles'},
{id:'atomic',emoji:'☢️',name:'Атом',bg:'#141400',bg2:'#282800',text:'#ffffb0',brand:'#ffff00',brand2:'#ffaa00',effect:'sparkles'},
{id:'deep-sea',emoji:'🌊',name:'Глубокое море',bg:'#000514',bg2:'#000a28',text:'#d0e8ff',brand:'#00aaff',brand2:'#0055aa',effect:'bubbles'},
{id:'neon-pink',emoji:'💗',name:'Неон-розовый',bg:'#14000a',bg2:'#280018',text:'#ffe0f0',brand:'#ff0088',brand2:'#cc0066',effect:'sparkles'},
{id:'mint-fresh',emoji:'🌱',name:'Свежая мята',bg:'#08140f',bg2:'#0f2419',text:'#e0fff0',brand:'#3ddc97',brand2:'#4dd4ff',effect:'bubbles'}
];

var DOMAINS=[
{id:'physical',emoji:'💪',name:'Физическое',color:'#ff7ba9',desc:'Тело, сила'},
{id:'mental',emoji:'🧠',name:'Ментальное',color:'#4dd4ff',desc:'Фокус, память'},
{id:'emotional',emoji:'❤️',name:'Эмоциональное',color:'#ff6b6b',desc:'Чувства'},
{id:'spiritual',emoji:'🕊',name:'Духовное',color:'#b394ff',desc:'Смысл'},
{id:'financial',emoji:'💰',name:'Финансовое',color:'#ffcc4d',desc:'Бюджет'},
{id:'career',emoji:'💼',name:'Карьерное',color:'#3ddc97',desc:'Навыки'},
{id:'social',emoji:'👥',name:'Социальное',color:'#c4b5fd',desc:'Связи'},
{id:'environment',emoji:'🏠',name:'Среда',color:'#a4e7ff',desc:'Пространство'},
{id:'recovery',emoji:'⏰',name:'Восстановление',color:'#4dd4ff',desc:'Сон'},
{id:'digital',emoji:'📱',name:'Цифровое',color:'#ff88cc',desc:'Экран'}
];

var DAILY_WISDOMS=[
{text:'Ты не ленивый. Ты либо устал, либо не видишь смысла, либо боишься.',author:'Неизвестный',action:'Запиши, что из 3 — твоё'},
{text:'Дисциплина — это выбор между тем, что хочешь сейчас, и тем, что хочешь больше всего.',author:'Линкольн',action:'Назови 1 желание и 1 цель'},
{text:'Мы — то, что делаем постоянно. Совершенство — привычка.',author:'Аристотель',action:'Добавь 1 привычку'},
{text:'Между стимулом и реакцией есть пространство. В нём — наша свобода.',author:'Франкл',action:'Пауза 6 секунд'},
{text:'Счастье — это не то, что ты имеешь, а то, что ты чувствуешь.',author:'Хэммершолд',action:'3 благодарности'},
{text:'Ты не можешь вернуться и изменить начало, но можешь начать сейчас.',author:'Льюис',action:'1 действие за 2 минуты'},
{text:'Единственный способ делать великую работу — любить то, что делаешь.',author:'Джобс',action:'Найди 1 вещь с любовью'},
{text:'Сложнее всего начать действовать, остальное — упорство.',author:'Эрхарт',action:'Начни с 2 минут'},
{text:'Тот, кто владеет собой, владеет миром.',author:'Сенека',action:'Заметь контроль'},
{text:'Мы становимся тем, о чём думаем.',author:'Будда',action:'5 минут наблюдай мысли'},
{text:'Победа над собой — величайшая победа.',author:'Платон',action:'1 сложное дело'},
{text:'Если хочешь изменить мир — начни с себя.',author:'Ганди',action:'Измени 1 маленькую вещь'},
{text:'Жизнь — 10% событий и 90% реакций.',author:'Свиндолл',action:'Пересмотри 1 реакцию'},
{text:'Не сравнивай себя с другими. Сравнивай с собой вчерашним.',author:'Питерсон',action:'Оцени рост'},
{text:'Успех — сумма маленьких усилий день за днём.',author:'Кольер',action:'1 маленькое усилие'},
{text:'Всё, что можешь сделать, — начать.',author:'Неизвестный',action:'Начни сейчас'},
{text:'Измени мысли — изменится жизнь.',author:'Дайер',action:'1 мысль поменяй'},
{text:'Великие дела не делаются в зоне комфорта.',author:'Неизвестный',action:'1 дело вне комфорта'},
{text:'Один процент лучше каждый день — вот и весь секрет.',author:'Клир',action:'Улучши на 1%'},
{text:'Заботься о теле — единственное место, где тебе жить.',author:'Рон',action:'1 действие для тела'}
];

var DAILY_CHALLENGES=[
{id:'ch_no_social_1h',title:'1 час без соцсетей',desc:'Не открывай соцсети 1 час',reward:20},
{id:'ch_3_tasks',title:'3 задачи',desc:'Выполни 3 задачи',reward:30},
{id:'ch_water_8',title:'8 стаканов воды',desc:'Выпей 8 стаканов',reward:25},
{id:'ch_no_phone_morning',title:'Утро без телефона',desc:'30 мин без телефона',reward:25},
{id:'ch_meditation_10',title:'10 мин медитации',desc:'Медитируй 10 мин',reward:20},
{id:'ch_walk_30',title:'Прогулка 30 мин',desc:'Прогуляйся 30 мин',reward:25},
{id:'ch_deep_work_90',title:'Deep Work 90',desc:'90 мин глубокой работы',reward:40},
{id:'ch_read_20',title:'Чтение 20 мин',desc:'Прочти 20 мин',reward:20},
{id:'ch_journal',title:'Дневник вечером',desc:'Запиши 3 победы',reward:20},
{id:'ch_workout',title:'Тренировка',desc:'Сделай тренировку',reward:35},
{id:'ch_no_sugar',title:'Без сахара',desc:'День без сахара',reward:25},
{id:'ch_gratitude_3',title:'3 благодарности',desc:'Запиши 3 благодарности',reward:15},
{id:'ch_english_15',title:'Английский 15 мин',desc:'Позанимайся',reward:20},
{id:'ch_eye_gym',title:'Гимнастика глаз',desc:'10 упражнений',reward:15},
{id:'ch_palming',title:'Пальминг',desc:'5 минут пальминга',reward:10},
{id:'ch_20_20_20',title:'Правило 20-20-20',desc:'Соблюдай весь день',reward:20},
{id:'ch_sleep_early',title:'Сон до 23:00',desc:'Ляг до 23:00',reward:25},
{id:'ch_cold_shower',title:'Холодный душ',desc:'2 минуты',reward:25},
{id:'ch_nature_30',title:'Природа 30 мин',desc:'Прогулка на природе',reward:20},
{id:'ch_no_phone_bed',title:'Телефон вне спальни',desc:'Ночь без телефона',reward:25}
];

function getTodayChallenges(){
  var i=Math.floor(Date.now()/86400000);
  var r=[];for(var j=0;j<4;j++)r.push(DAILY_CHALLENGES[(i+j)%DAILY_CHALLENGES.length]);
  return r;
}

var WORK_MODES=[
{id:'work',name:'Работа',emoji:'💼',desc:'Задачи'},
{id:'rest',name:'Отдых',emoji:'🌿',desc:'Досуг'},
{id:'sleep',name:'Сон',emoji:'🌙',desc:'Медитация'},
{id:'study',name:'Учёба',emoji:'📚',desc:'Обучение'}
];

var SURVEY_QUESTIONS=[
{id:'name',question:'Как тебя зовут?',type:'text'},
{id:'age',question:'Возраст?',type:'options',options:[{value:'18-25',label:'18-25',emoji:'🧑'},{value:'26-35',label:'26-35',emoji:'👨‍💼'},{value:'36-45',label:'36-45',emoji:'👩‍💼'},{value:'46+',label:'46+',emoji:'🧓'}]},
{id:'occupation',question:'Чем занимаешься?',type:'options',options:[{value:'it',label:'IT',emoji:'💻'},{value:'business',label:'Бизнес',emoji:'💼'},{value:'creative',label:'Творчество',emoji:'🎨'},{value:'student',label:'Учусь',emoji:'🎓'},{value:'other',label:'Другое',emoji:'🔷'}]},
{id:'mainGoal',question:'Главная цель?',type:'options',options:[{value:'health',label:'Здоровье',emoji:'❤️'},{value:'productivity',label:'Продуктивность',emoji:'⚡'},{value:'mental',label:'Психика',emoji:'🧠'},{value:'career',label:'Карьера',emoji:'💰'},{value:'discipline',label:'Дисциплина',emoji:'⚔️'}]},
{id:'sleepHours',question:'Сколько спишь?',type:'options',options:[{value:'<5',label:'<5ч',emoji:'😵'},{value:'5-6',label:'5-6ч',emoji:'😴'},{value:'6-7',label:'6-7ч',emoji:'🙄'},{value:'7-8',label:'7-8ч',emoji:'😊'},{value:'8+',label:'8+ч',emoji:'😌'}]}
];

var PERSONAS={
coach:{name:'Коуч',emoji:'💬',prompt:'Ты — AI-Коуч. GROW, SMART, Deep Work. Конкретные шаги.'},
psych:{name:'Психолог',emoji:'🧠',prompt:'Ты — AI-Психолог. КПТ, ACT. НЕ ставь диагнозы! Кризис → 8-800-2000-122.'},
doctor:{name:'Врач',emoji:'⚕️',prompt:'Ты — AI-Врач. НЕ ставь диагнозы. ВСЕГДА дисклеймер. Острые → 103.'},
vision:{name:'Офтальмолог',emoji:'👁',prompt:'Ты — AI-Офтальмолог. Советы по зрению.'},
finance:{name:'Финансист',emoji:'💰',prompt:'Ты — AI-Финансист. Бюджет, инвестиции, FIRE.'},
it:{name:'IT',emoji:'💻',prompt:'Ты — AI-IT-эксперт.'},
lawyer:{name:'Юрист',emoji:'⚖️',prompt:'Ты — AI-Юрист. НЕ заменяю практикующего.'},
teacher:{name:'Учитель',emoji:'📚',prompt:'Ты — AI-Учитель. Объясняю просто.'}
};

var TABS=[
{id:'dashboard',emoji:'🏠',label:'Главная'},
{id:'tasks',emoji:'✅',label:'Задачи'},
{id:'learning',emoji:'🎓',label:'Обучение'},
{id:'calendar',emoji:'📅',label:'Календарь'},
{id:'vision',emoji:'👁',label:'Зрение'},
{id:'ai',emoji:'✨',label:'AI'},
{id:'more',emoji:'⋯',label:'Ещё'}
];

var QUICK_TABS={
learning:[
{id:'plan',emoji:'🗓',label:'План',target:'learnplan'},
{id:'levels',emoji:'🌱',label:'Уровни',target:'levels'},
{id:'english',emoji:'🇬🇧',label:'English',target:'english'},
{id:'skills',emoji:'💎',label:'Навыки',target:'skills'},
{id:'methods',emoji:'🎯',label:'Методики',target:'methods'},
{id:'psychology',emoji:'🧠',label:'Психология',target:'psychology'},
{id:'thinking',emoji:'💡',label:'Мышление',target:'thinking'},
{id:'etiquette',emoji:'🎩',label:'Этикет',target:'etiquette'},
{id:'hormones',emoji:'🧬',label:'Гормоны',target:'hormones'},
{id:'wealth',emoji:'💰',label:'Богатство',target:'wealth'},
{id:'it',emoji:'💻',label:'IT',target:'itcourse'},
{id:'law',emoji:'⚖️',label:'Право',target:'lawcourse'},
{id:'medicine',emoji:'⚕️',label:'Медицина',target:'medcourse'}
],
vision:[
{id:'overview',emoji:'👁',label:'Обзор',target:'vision'},
{id:'exercises',emoji:'🤸',label:'Упражнения',target:'visionex'},
{id:'tracker',emoji:'📊',label:'Трекер',target:'visiontrack'},
{id:'60',emoji:'🎯',label:'75 упражнений',target:'vision60'}
],
tasks:[
{id:'all',emoji:'📋',label:'Все'},
{id:'pending',emoji:'⏳',label:'Активные',filter:'pending'},
{id:'completed',emoji:'✅',label:'Готовые',filter:'completed'},
{id:'matrix',emoji:'🔢',label:'Матрица',target:'matrix'}
]
};

/* LEARNING LEVELS — коротко */
var LEARNING_LEVELS=[
{id:'lvl1',num:1,emoji:'🌱',title:'Основы',subtitle:'Старт',desc:'База',modules:[
{id:'m1_1',emoji:'💪',title:'Здоровье',desc:'Сон, вода, движение',lessons:[
{title:'Сон',theory:'7-9 часов. Медленный сон = факты, REM = эмоции.',practice:'Ляг на 30 мин раньше.'},
{title:'Вода',theory:'30 мл/кг. Утром 500 мл.',practice:'500 мл утром.'},
{title:'Движение',theory:'150 мин кардио + 2 силовые.',practice:'20 мин прогулка.'}
]},
{id:'m1_2',emoji:'🧠',title:'Мышление',desc:'База продуктивности',lessons:[
{title:'Продуктивность',theory:'Результат, не занятость.',practice:'3 главных дела.'},
{title:'Приоритеты',theory:'Матрица Эйзенхауэра.',practice:'Разбери 5 задач.'},
{title:'Привычки',theory:'Cue→Craving→Response→Reward. 66 дней.',practice:'1 привычка.'}
]},
{id:'m1_3',emoji:'🎯',title:'Цели',desc:'Постановка',lessons:[
{title:'SMART',theory:'Specific, Measurable, Achievable, Relevant, Time.',practice:'1 цель.'},
{title:'OKR',theory:'Objectives + Key Results.',practice:'1 OKR.'},
{title:'Планирование',theory:'5 лет → 1 год → месяц → неделя → день.',practice:'5-летний план.'}
]}
]},
{id:'lvl2',num:2,emoji:'⚡',title:'Практика',subtitle:'Углубление',desc:'Продуктивность, EQ, финансы',modules:[
{id:'m2_1',emoji:'🎯',title:'Deep Work',desc:'Глубокая работа',lessons:[
{title:'Deep Work',theory:'90 мин ×3-4.',practice:'1 блок 90 мин.'},
{title:'Pomodoro',theory:'25/5 ×4.',practice:'4 помидора.'},
{title:'Time-blocking',theory:'Каждое дело в слот.',practice:'3 задачи в календарь.'}
]},
{id:'m2_2',emoji:'❤️',title:'EQ',desc:'Эмоции',lessons:[
{title:'5 компонентов',theory:'Гоулман.',practice:'Дневник эмоций.'},
{title:'Пауза 6 сек',theory:'Пространство между стимулом и реакцией.',practice:'3 раза.'},
{title:'Эмпатия',theory:'Слушай, не советуй.',practice:'1 разговор.'}
]},
{id:'m2_3',emoji:'💰',title:'Финансы',desc:'База',lessons:[
{title:'50/30/20',theory:'50 нужды, 30 желания, 20 сбережения.',practice:'Разбей доход.'},
{title:'Подушка',theory:'3-6 мес расходов.',practice:'Открой счёт.'},
{title:'Инвестиции',theory:'Индексные фонды, DCA.',practice:'Изучи 3 фонда.'}
]}
]},
{id:'lvl3',num:3,emoji:'💎',title:'Мастерство',subtitle:'Продвинутый',desc:'Нейро, лидерство',modules:[
{id:'m3_1',emoji:'🔬',title:'Нейро',desc:'Мозг',lessons:[
{title:'Нейропластичность',theory:'Мозг меняется всю жизнь.',practice:'30 дней навык.'},
{title:'Дофамин',theory:'Предвкушение, не удовольствие.',practice:'1 день без соцсетей.'},
{title:'Сон и память',theory:'Консолидация в глубоком сне.',practice:'10 фактов перед сном.'}
]},
{id:'m3_2',emoji:'👑',title:'Лидерство',desc:'Люди',lessons:[
{title:'Level 5',theory:'Скромность + воля.',practice:'1 качество.'},
{title:'Делегирование',theory:'Не делай сам.',practice:'3 задачи.'},
{title:'SBI-фидбэк',theory:'Situation-Behavior-Impact.',practice:'1 SBI.'}
]},
{id:'m3_3',emoji:'🌐',title:'Стратегия',desc:'Долгосрочно',lessons:[
{title:'Второй порядок',theory:'А что потом? ×3.',practice:'3 решения.'},
{title:'Инверсия',theory:'Что мешает?',practice:'3 цели.'},
{title:'First principles',theory:'Разбей до основы.',practice:'1 проблема.'}
]}
]},
{id:'lvl4',num:4,emoji:'🏆',title:'Мастер',subtitle:'Эксперт',desc:'Менторство, системы',modules:[
{id:'m4_1',emoji:'🎓',title:'Менторство',desc:'Учить',lessons:[
{title:'Ментор',theory:'Вопросы > советы.',practice:'1 менти.'},
{title:'GROW',theory:'Goal-Reality-Options-Will.',practice:'1 сессия.'},
{title:'Учить',theory:'Объясни — пойми.',practice:'3 темы.'}
]},
{id:'m4_2',emoji:'🌍',title:'Системы',desc:'Целое',lessons:[
{title:'Системы vs цели',theory:'Система = результат.',practice:'3 системы.'},
{title:'Обратные связи',theory:'Положительные/отрицательные.',practice:'3 петли.'},
{title:'Точки воздействия',theory:'Рычаг.',practice:'1 рычаг.'}
]},
{id:'m4_3',emoji:'🕊',title:'Смысл',desc:'Зачем',lessons:[
{title:'Икигай',theory:'4 сферы.',practice:'4 списка.'},
{title:'Логотерапия',theory:'3 источника.',practice:'Найди своё.'},
{title:'Наследие',theory:'Что оставишь?',practice:'Эпитафия.'}
]}
]},
{id:'lvl5',num:5,emoji:'🌟',title:'Легенда',subtitle:'Мастер',desc:'Мудрость',modules:[
{id:'m5_1',emoji:'🧘',title:'Мудрость',desc:'Глубина',lessons:[
{title:'Стоицизм',theory:'Дихотомия контроля.',practice:'Вечером.'},
{title:'Memento Mori',theory:'Помни о смерти.',practice:'Эпитафия.'},
{title:'Присутствие',theory:'Здесь и сейчас.',practice:'10 мин.'}
]},
{id:'m5_2',emoji:'💫',title:'Интеграция',desc:'Всё',lessons:[
{title:'10 доменов',theory:'Баланс.',practice:'Оцени.'},
{title:'Свой путь',theory:'Уникальность.',practice:'Опиши.'},
{title:'Передача',theory:'Учи.',practice:'1 гайд.'}
]},
{id:'m5_3',emoji:'🚀',title:'Будущее',desc:'Дальше',lessons:[
{title:'10 лет',theory:'Куда?',practice:'Опиши.'},
{title:'Наследие',theory:'После тебя.',practice:'3 пункта.'},
{title:'Продолжение',theory:'Путь.',practice:'План.'}
]}
]}
];

/* ACHIEVEMENTS */
var ACHIEVEMENTS=[
{id:'first_task',icon:'✅',name:'Первая задача',check:function(s){return s.tasks.some(function(t){return t.status==='completed'})},progress:function(s){return s.tasks.filter(function(t){return t.status==='completed'}).length>0?1:0}},
{id:'first_lesson',icon:'🎓',name:'Первый урок',check:function(s){return Object.keys(s.levelProgress||{}).length>=1},progress:function(s){return Math.min(1,Object.keys(s.levelProgress||{}).length)}},
{id:'first_skill',icon:'💎',name:'Первый навык',check:function(s){return Object.keys(s.skillsProgress||{}).length>=1},progress:function(s){return Math.min(1,Object.keys(s.skillsProgress||{}).length)}},
{id:'first_water',icon:'💧',name:'Первая вода',check:function(s){return (s.customWater||[]).some(function(w){return w.count>=1})},progress:function(s){return s.customWater&&s.customWater.length>0?1:0}},
{id:'first_eye',icon:'👁',name:'Первое упражнение глаз',check:function(s){return (s.eyeExercises||[]).length>=1},progress:function(s){return Math.min(1,(s.eyeExercises||[]).length)}},
{id:'first_screen',icon:'📱',name:'Первый трекинг экрана',check:function(s){return Object.keys(s.screenStats||{}).length>=1},progress:function(s){return Object.keys(s.screenStats||{}).length>=1?1:0}},
{id:'tasks_10',icon:'🔥',name:'10 задач',check:function(s){return s.tasks.filter(function(t){return t.status==='completed'}).length>=10},progress:function(s){return Math.min(1,s.tasks.filter(function(t){return t.status==='completed'}).length/10)}},
{id:'tasks_50',icon:'⚡',name:'50 задач',check:function(s){return s.tasks.filter(function(t){return t.status==='completed'}).length>=50},progress:function(s){return Math.min(1,s.tasks.filter(function(t){return t.status==='completed'}).length/50)}},
{id:'lessons_10',icon:'📚',name:'10 уроков',check:function(s){return Object.keys(s.levelProgress||{}).length>=10},progress:function(s){return Math.min(1,Object.keys(s.levelProgress||{}).length/10)}},
{id:'lessons_50',icon:'📖',name:'50 уроков',check:function(s){return Object.keys(s.levelProgress||{}).length>=50},progress:function(s){return Math.min(1,Object.keys(s.levelProgress||{}).length/50)}},
{id:'skills_10',icon:'💎',name:'10 навыков',check:function(s){return Object.keys(s.skillsProgress||{}).length>=10},progress:function(s){return Math.min(1,Object.keys(s.skillsProgress||{}).length/10)}},
{id:'english_10',icon:'🇬🇧',name:'10 English',check:function(s){return Object.keys(s.englishProgress||{}).length>=10},progress:function(s){return Math.min(1,Object.keys(s.englishProgress||{}).length/10)}},
{id:'streak_3',icon:'🔥',name:'3 дня',check:function(s){return (s.stats.streak||0)>=3},progress:function(s){return Math.min(1,(s.stats.streak||0)/3)}},
{id:'streak_7',icon:'🔥',name:'7 дней',check:function(s){return (s.stats.streak||0)>=7},progress:function(s){return Math.min(1,(s.stats.streak||0)/7)}},
{id:'streak_30',icon:'🔥',name:'30 дней',check:function(s){return (s.stats.streak||0)>=30},progress:function(s){return Math.min(1,(s.stats.streak||0)/30)}},
{id:'water_100',icon:'💧',name:'100 стаканов',check:function(s){return (s.stats.totalWater||0)>=100},progress:function(s){return Math.min(1,(s.stats.totalWater||0)/100)}},
{id:'eye_10',icon:'👁',name:'10 упражнений глаз',check:function(s){return (s.eyeExercises||[]).length>=10},progress:function(s){return Math.min(1,(s.eyeExercises||[]).length/10)}},
{id:'detox_7',icon:'📱',name:'7 дней детокса',check:function(s){return Object.keys(s.detoxCourseProgress||{}).length>=7},progress:function(s){return Math.min(1,Object.keys(s.detoxCourseProgress||{}).length/7)}},
{id:'detox_30',icon:'🏆',name:'30 дней детокса',check:function(s){return Object.keys(s.detoxCourseProgress||{}).length>=30},progress:function(s){return Math.min(1,Object.keys(s.detoxCourseProgress||{}).length/30)}},
{id:'xp_100',icon:'⭐',name:'100 XP',check:function(s){return (s.xp||0)>=100},progress:function(s){return Math.min(1,(s.xp||0)/100)}}
];

/* ГОРМОНЫ — коротко */
var HORMONES=[
{id:'dopamine',emoji:'⚡',name:'Дофамин',role:'Мотивация',what:'Предвкушение награды, мотивация.',where:'VTA → прилежащее ядро.',when:'При предвкушении.',up:['Достижение целей','Спорт','Музыка','Тёмный шоколад','Холодный душ'],down:['Соцсети','Сахар','Игры','Недосып','Стресс'],food:'Тирозин: мясо, рыба, яйца.',sleep:'7-9 ч',sport:'Кардио + силовые',normal:'Стабильная мотивация',imbalance:'Прокрастинация, апатия',protocol:['Дофамин-детокс','Утро без телефона','Награда после усилия'],example:'Предвкушение слаще',symptoms:['Скука','Прокрастинация','Апатия']},
{id:'serotonin',emoji:'☀️',name:'Серотонин',role:'Настроение',what:'Настроение, спокойствие.',where:'Ядра шва; 90% в кишечнике.',when:'Свет, еда с триптофаном.',up:['Солнце','Спорт','Медитация','Триптофан'],down:['Изоляция','Стресс','Алкоголь','Недосып'],food:'Триптофан: индейка, сыр, бананы',sleep:'7-9 ч',sport:'Аэробные',normal:'Спокойствие',imbalance:'Депрессия, тревога',protocol:['Утренний свет','Прогулка','Медитация'],example:'Зимой падает → депрессия',symptoms:['Подавленность','Тревога','Бессонница']},
{id:'oxytocin',emoji:'💞',name:'Окситоцин',role:'Привязанность',what:'Доверие, любовь.',where:'Гипоталамус → гипофиз.',when:'Объятия 20+ сек.',up:['Объятия','Время с близкими','Массаж','Секс','Питомцы'],down:['Одиночество','Стресс','Изоляция'],food:'Магний, омега-3',sleep:'Объятия перед сном',sport:'Йога, танцы',normal:'Близость',imbalance:'Одиночество',protocol:['8 объятий/день','Звонок близкому'],example:'20-сек объятие снижает кортизол',symptoms:['Одиночество','Недоверие']},
{id:'cortisol',emoji:'🔥',name:'Кортизол',role:'Стресс',what:'Гормон стресса.',where:'Кора надпочечников.',when:'Стресс, утро.',up:['Стресс','Мало сна','Кофе на голодный'],down:['Медитация','Спорт','Сон','Природа'],food:'Магний, омега-3',sleep:'7-9 ч',sport:'Умеренно',normal:'Утро пик, вечер спад',imbalance:'Тревога, бессонница',protocol:['Утренний свет','Убрать кофе после 14:00'],example:'Хронический = изнашивание',symptoms:['Тревога','Бессонница','Набор веса']},
{id:'melatonin',emoji:'🌙',name:'Мелатонин',role:'Сон',what:'Регулирует сон.',where:'Эпифиз.',when:'Вечером, пик 2-4 ч',up:['Темнота','Режим','Тёплый свет'],down:['Синий свет','Экраны','Кофеин'],food:'Вишня, овсянка',sleep:'Одно время, темнота',sport:'Утром',normal:'Засыпание 15-20 мин',imbalance:'Бессонница',protocol:['Тёмная спальня','Экран за 2 ч до сна'],example:'2 ч без экрана = +50%',symptoms:['Бессонница']},
{id:'testosterone',emoji:'💪',name:'Тестостерон',role:'Сила',what:'Мышцы, либидо.',where:'Яички.',when:'Утром.',up:['Силовые','Белок','Цинк','Сон','Солнце'],down:['Мало сна','Алкоголь','Стресс','Сахар'],food:'Цинк: мясо, яйца',sleep:'7-9 ч',sport:'Силовые 3×/нед',normal:'Энергия, либидо',imbalance:'Усталость',protocol:['Силовые 3×/нед','Сон 8 ч','Цинк'],example:'После силовой +15-20%',symptoms:['Усталость','Снижение либидо']},
{id:'insulin',emoji:'🍬',name:'Инсулин',role:'Сахар',what:'Регулирует глюкозу.',where:'Бета-клетки поджелудочной.',when:'При углеводах.',up:['Быстрые углеводы','Перекусы'],down:['Голодание','Спорт','Белок','Овощи'],food:'Овощи, белок, жиры',sleep:'7-9 ч',sport:'Силовые + кардио',normal:'Стабильный сахар',imbalance:'Диабет 2 типа',protocol:['Меньше сахара','Движение после еды'],example:'10 мин прогулка = -30% пика',symptoms:['Тяга к сладкому']},
{id:'leptin',emoji:'🍔',name:'Лептин',role:'Сытость',what:'Сытость.',where:'Жировая ткань.',when:'После еды.',up:['Сон','Белок','Овощи'],down:['Недосып','Сахар','Стресс'],food:'Белок, клетчатка',sleep:'Критично 7-9 ч',sport:'Умеренно',normal:'Сытость',imbalance:'Голод',protocol:['Сон 8 ч','Белок 1.6 г/кг'],example:'Недосып → +300 калорий',symptoms:['Постоянный голод']},
{id:'adrenaline',emoji:'⚡',name:'Адреналин',role:'Бей или беги',what:'Острая реакция.',where:'Надпочечники.',when:'Опасность.',up:['Стресс','Экстрим','Холод','Кофеин'],down:['Медитация','Дыхание','Природа'],food:'Магний',sleep:'Важен',sport:'HIIT',normal:'Реакция в опасности',imbalance:'Панические атаки',protocol:['Дыхание 4-7-8','Медитация'],example:'Выступление → тряска',symptoms:['Тревога','Паника']},
{id:'gaba',emoji:'🧘',name:'ГАМК',role:'Успокоение',what:'Тормозной.',where:'Мозг.',when:'Медитация, магний.',up:['Медитация','Йога','Магний','L-теанин'],down:['Стресс','Кофеин','Недосып'],food:'Магний, L-теанин',sleep:'7-9 ч',sport:'Йога',normal:'Спокойствие',imbalance:'Тревога',protocol:['Йога 2×/нед','Магний'],example:'Зелёный чай → спокойствие',symptoms:['Тревога','Бессонница']},
{id:'bdnf',emoji:'🧬',name:'BDNF',role:'Рост нейронов',what:'Удобрение мозга.',where:'Гиппокамп.',when:'Спорт, обучение.',up:['Спорт','Голодание','Омега-3','Куркума'],down:['Сахар','Стресс','Сидячий'],food:'Омега-3, куркума',sleep:'7-9 ч',sport:'HIIT 2-3×/нед',normal:'Хорошая память',imbalance:'Плохая память',protocol:['Спорт 4×/нед','Омега-3 2 г'],example:'30 мин кардио → +30% на 2 ч',symptoms:['Плохая память']},
{id:'norepinephrine',emoji:'🎯',name:'Норадреналин',role:'Фокус',what:'Бодрость.',where:'Голубое пятно.',when:'Утро, стресс.',up:['Кофеин до 14:00','Холод','Спорт'],down:['Стресс','Мало сна','Алкоголь'],food:'Тирозин',sleep:'7-9 ч',sport:'Кардио',normal:'Бодрость',imbalance:'Истощение',protocol:['Утренний свет','Кофе до 14:00'],example:'Утро без кофе + свет',symptoms:['Усталость']},
{id:'endorphins',emoji:'🏃',name:'Эндорфины',role:'Эйфория',what:'Обезболивание.',where:'Гипофиз.',when:'Спорт, смех.',up:['Спорт 30+ мин','Смех','Секс','Шоколад'],down:['Сидячий','Хроническая боль','Стресс'],food:'Острая еда, шоколад',sleep:'Спорт за 3 ч до сна',sport:'Кардио',normal:'Лёгкость',imbalance:'Хроническая боль',protocol:['30 мин кардио','Смех'],example:'Эйфория бегуна',symptoms:['Хроническая боль']},
{id:'estrogen',emoji:'🌸',name:'Эстроген',role:'Женское здоровье',what:'Цикл, кости.',where:'Яичники.',when:'По циклу.',up:['Здоровый вес','Флавоноиды','Фитоэстрогены'],down:['Избыток веса','Стресс','Алкоголь'],food:'Соя, лён, ягоды',sleep:'7-9 ч',sport:'Умеренные',normal:'Стабильный цикл',imbalance:'ПМС',protocol:['Сбалансированное питание','Сон 8 ч'],example:'ПМС = падение эстрогена',symptoms:['ПМС']},
{id:'progesterone',emoji:'🌺',name:'Прогестерон',role:'Спокойствие',what:'Готовит матку.',where:'Жёлтое тело.',when:'После овуляции.',up:['Сон 8 ч','B6','Магний'],down:['Стресс','Алкоголь'],food:'B6: бананы, курица',sleep:'7-9 ч',sport:'Умеренные',normal:'Спокойствие',imbalance:'ПМС',protocol:['Сон 8 ч','B6 + магний'],example:'Низкий = тревожность',symptoms:['ПМС','Бессонница']},
{id:'ghrelin',emoji:'🍽',name:'Грелин',role:'Голод',what:'Голод.',where:'Желудок.',when:'На голодный.',up:['Недосып','Стресс','Быстрые углеводы'],down:['Белок','Клетчатка','Вода','Сон'],food:'Белок, клетчатка',sleep:'7-9 ч',sport:'Умеренно',normal:'Голод по расписанию',imbalance:'Постоянный голод',protocol:['Сон 8 ч','Вода перед едой'],example:'Белок на завтрак = -6 ч голод',symptoms:['Постоянный голод']},
{id:'vasopressin',emoji:'💧',name:'Вазопрессин',role:'Водный баланс',what:'Сохраняет воду.',where:'Гипоталамус → гипофиз.',when:'Обезвоживание.',up:['Вода','Соль','Белок','Сон'],down:['Алкоголь','Кофеин','Стресс'],food:'Вода, соль',sleep:'7-9 ч',sport:'Умеренно',normal:'Водный баланс',imbalance:'Обезвоживание',protocol:['30 мл/кг воды'],example:'Алкоголь → похмелье',symptoms:['Обезвоживание']},
{id:'aldosterone',emoji:'🧂',name:'Альдостерон',role:'Баланс Na/K',what:'Давление.',where:'Кора надпочечников.',when:'Низкое давление.',up:['Натрий','Калий','Сон'],down:['Стресс','Обезвоживание'],food:'Баланс Na/K',sleep:'7-9 ч',sport:'Умеренно',normal:'Давление в норме',imbalance:'Отёки',protocol:['Баланс Na/K'],example:'Много соли = отёки',symptoms:['Отёки']},
{id:'thyroid',emoji:'🦋',name:'Тиреоидные',role:'Метаболизм',what:'Энергия.',where:'Щитовидная железа.',when:'Стабильно.',up:['Йод','Селен','Сон','Спорт'],down:['Стресс','Дефицит йода'],food:'Йод: рыба, водоросли',sleep:'7-9 ч',sport:'Умеренно',normal:'Энергия',imbalance:'Гипотиреоз',protocol:['Йод','Селен','ТТГ 1×/год'],example:'Усталость + холод = ТТГ',symptoms:['Усталость','Набор веса']},
{id:'growth',emoji:'📈',name:'Гормон роста',role:'Восстановление',what:'Рост, восстановление.',where:'Гипофиз.',when:'Глубокий сон.',up:['Сон 8 ч','Голодание','Спорт'],down:['Сахар','Мало сна','Стресс'],food:'Белок',sleep:'Глубокий сон',sport:'Силовые',normal:'Восстановление',imbalance:'Плохое восстановление',protocol:['Сон 8 ч','16:8'],example:'Еда перед сном = блок',symptoms:['Плохое восстановление']}
];

/* ============================================================
   PSYCHOLOGY_TOPICS — 100 коротких
   ============================================================ */
var PSYCHOLOGY_TOPICS=[];
(function(){
var topics=[
['Мышление','🧠','Критическое мышление','5 вопросов. Проверяй всё.'],
['Мышление','🔄','Системное мышление','Целое, не части.'],
['Мышление','⚡','Латеральное','В сторону.'],
['Эмоции','❤️','Эмоциональный интеллект','5 компонентов Гоулмана.'],
['Эмоции','😰','Работа с тревогой','4-7-8, заземление 5-4-3-2-1.'],
['Эмоции','😔','Депрессия','Не лень. Болезнь. Спорт.'],
['Мышление','📈','Мышление роста','Growth mindset.'],
['Мышление','🎯','Решения','10/10/10 + инверсия.'],
['Мышление','🧩','Искажения','Confirmation, anchoring.'],
['Мышление','💡','Ментальные модели','80+ моделей.'],
['Отношения','💞','Привязанность','4 типа.'],
['Отношения','💬','ННО','Наблюдение → Чувство → Потребность → Просьба.'],
['Отношения','🚧','Границы','«Я не могу X, но могу Y».'],
['Мышление','⏳','Прокрастинация','Эмоциональная регуляция.'],
['Эмоции','🧘','Медитация','MBSR 8 недель.'],
['Мышление','🎨','Креативность','DMN активна в покое.'],
['Мышление','🔍','Внимание','23 мин на возврат.'],
['Эмоции','😤','Гнев','Пауза 6 сек. Пик 90 сек.'],
['Мышление','💭','КПТ','Мысль → Эмоция → Поведение.'],
['Мышление','🎓','Стоицизм','Дихотомия контроля.'],
['Мышление','🏛','Смысл','Логотерапия Франкла.'],
['Мышление','🔄','Второй порядок','А что потом? ×3.'],
['Мышление','🎯','First principles','Разбей до основы.'],
['Мышление','⚖️','Инверсия','Что мешает?'],
['Мышление','🌐','Circle of competence','Работай где разбираешься.'],
['Мышление','✂️','Occam','Простое вернее.'],
['Мышление','📊','Вероятности','Мир — вероятности.'],
['Мышление','🎲','Тейл-риски','Малые вероятности, большие последствия.'],
['Мышление','🧬','Эволюционное','Мозг — продукт эволюции.'],
['Мышление','🌊','Антихрупкость','Что не убивает — сильнее.'],
['Эмоции','💧','Слёзы','Выводят кортизол.'],
['Эмоции','😂','Смех','-30% кортизола.'],
['Мышление','💤','Осознанные сны','Можно управлять.'],
['Мышление','🌍','Экология разума','Среда формирует.'],
['Мышление','⚡','Дофамин','Предвкушение.'],
['Мышление','🌅','Утренние ритуалы','Первые 30 мин.'],
['Мышление','📝','Дневник','Письмо структурирует.'],
['Эмоции','🙏','Благодарность','+25% счастья.'],
['Мышление','🎯','Поток','Погружение.'],
['Мышление','👁','Восприятие','Мозг достраивает 90%.'],
['Мышление','🧠','Память','Забываем 58% за 20 мин.'],
['Отношения','🤝','Дружба','5 глубоких > 100.'],
['Отношения','💑','Любовь','5 языков.'],
['Отношения','🏠','Семья','Корни.'],
['Мышление','🎓','Обучение','Recall > Recognition.'],
['Мышление','🔄','Привычки','Cue→Craving→Response→Reward.'],
['Мышление','💰','Психология денег','Деньги = эмоции.'],
['Мышление','🎯','Цели','SMART.'],
['Мышление','🌅','Смысл','Икигай.'],
['Мышление','🕊','Принятие','Не борись.']
];
for(var i=1;i<=100;i++){
  var t=topics[(i-1)%topics.length];
  PSYCHOLOGY_TOPICS.push({id:'ps_'+String(i).padStart(2,'0'),cat:t[0],emoji:t[1],title:t[2],theory:t[3],science:'Наука подтверждает.',practice:['Практикуй 1×/день','Наблюдай результат'],effect:'+Развитие',tips:'Регулярно'});
}
})();

/* THINKING_TOPICS — 100 коротких */
var THINKING_TOPICS=[];
(function(){
var cats=['Логика','Системное','Творческое','Критическое','Стратегия','Эмоциональное','Социальное','Философия','Метапознание','Специальное'];
var titles=['Дедукция','Индукция','Абдукция','Логические ошибки','Силлогизмы','Аналогии','Системное','Обратные связи','Рычаг','Задержки','Латеральное','Дивергентное','SCAMPER','Mind map','6 шляп','Критическое','Искажения','Источники','Научный метод','Корреляция','Стратегическое','Тактическое','Игра','Второй порядок','80/20','EQ','Осознанность','Принятие','Гнев','Тревога','Теория разума','Социальный обмен','ННО','Маски','Лидерство','Стоицизм','Экзистенциализм','Буддизм','Икигай','Memento mori','Рефлексия','Метаобучение','Калибровка','Прокрастинация','Фокус','Самосознание','Growth','Научное','Приоритизация','Итерации','Глобальное','Финансовое','Статистическое','Хаос','Экологическое','Сетевое','Эволюционное','Дизайнерское','Нарративное','Футуристическое'];
for(var i=0;i<100;i++){
  var t=titles[i%titles.length];
  THINKING_TOPICS.push({id:'t_'+String(i+1).padStart(3,'0'),cat:cats[i%cats.length],emoji:'💡',title:t,theory:'**'+t+'** — ключевая концепция мышления.',science:'Наука подтверждает.',practice:['Практикуй','Разбирай примеры'],effect:'+Мышление',tips:'Регулярно'});
}
})();

/* ETIQUETTE_TOPICS — 100 коротких */
var ETIQUETTE_TOPICS=[];
(function(){
var cats=['Приветствие','За столом','Деловое','В обществе','Коммуникация','Внешний вид','Путешествия','Цифровое','Особые случаи','Прочее'];
var titles=['Рукопожатие','Приветствие словом','Поклон','Объятия','Представление','Визитка','Салфетка','Приборы','Ложка','Бокал','Хлеб','Мясо','Паста','Суп','Суши','Кофе','Фрукты','Десерт','Соль','Приборы после','Email','Звонок','Встреча','Дресс-код','Переговоры','Презентация','Совещание','SBI','Планирование','Делегирование','Театр','Кино','Ресторан','Транспорт','Лифт','Дверь','Лестница','Зонт','Питомцы','Вечеринка','Слушание','Small talk','Речь','Тайна','Комплимент','Критика','Извинения','Благодарность','Переписка','Голосовые','Костюм','Обувь','Причёска','Парфюм','Взгляд','Улыбка','Осанка','Походка','Аэропорт','Контроль','Отель','За границей','Фото','Курение','Алкоголь','Чаевые','Язык','Торговля','Экран','Уведомления','Письмо','Мессенджеры','Zoom','За рулём','Пароли','Соцсети','Селфи','AI','Похороны','Свадьба','День рождения','Больница','В гостях','В машине','Цветы','Подарок','Курение в гостях','С питомцем','Приветствие словом','Рукопожатие','Экология','Пешеход','Водитель','Велосипед','Очередь','Общественное','Наушники','Громкая связь','Еда','Курение','Алкоголь'];
for(var i=0;i<100;i++){
  var t=titles[i%titles.length];
  ETIQUETTE_TOPICS.push({id:'et_'+String(i+1).padStart(3,'0'),cat:cats[i%cats.length],emoji:'🎩',title:t,theory:'**'+t+'** — правило этикета.',science:'Традиция.',practice:['Применяй в жизни'],effect:'+Уважение',tips:'Регулярно'});
}
})();

/* WEALTH, SKILLS, METHODS, RECOVERY, VISION — коротко */
var WEALTH_MODULES=[];
for(var _i=1;_i<=20;_i++){
  WEALTH_MODULES.push({id:'w_'+String(_i).padStart(2,'0'),emoji:'💰',title:'Модуль '+_i,theory:'**Финансовая грамотность.** Ключевые принципы.',science:'Сложный процент.',practice:['Учёт','Планирование','Действие'],effect:'+Капитал',tips:'Регулярно'});
}

var SKILLS_CATEGORIES=[
{id:'cognitive',emoji:'🧠',name:'Когнитивные'},
{id:'emotional',emoji:'❤️',name:'Эмоциональные'},
{id:'social',emoji:'👥',name:'Социальные'},
{id:'productivity',emoji:'⚡',name:'Продуктивность'},
{id:'health',emoji:'💪',name:'Здоровье'},
{id:'finance',emoji:'💰',name:'Финансы'},
{id:'communication',emoji:'💬',name:'Коммуникация'},
{id:'creativity',emoji:'🎨',name:'Творчество'},
{id:'philosophy',emoji:'🏛',name:'Философия'},
{id:'digital',emoji:'📱',name:'Цифровые'}
];

var SKILLS_LIBRARY=[];
(function(){
var skills=['IQ-буст','Память','Скорочтение','Критическое','Решения','Креативность','Deep Work','Осознанность','Скорообучение','Планирование','Языки','EQ','Стресс','Гнев','Тревога','Устойчивость','Самосострадание','Импульсы','Мотивация','Слушание','ННО','Границы','Лидерство','Переговоры','Конфликты','Харизма','Нетворкинг','Выступления','Время','Энергия','Привычки','Фокус','Прокрастинация','GTD','Эйзенхауэр','Eat Frog','Ревью','Системы','Сон','Питание','Тренировки','Кардио','Сила','Холод','Дыхание','Глаза','Осанка','Циркадные','Восстановление','Бюджет','Инвестиции','Долги','FIRE','Side-доход','Зарплата','Налоги','Накопления','Активы','Внимание','Интуиция'];
var cats=['cognitive','emotional','social','productivity','health','finance','communication','creativity','philosophy','digital'];
skills.forEach(function(s,i){
  SKILLS_LIBRARY.push({id:'sk_'+(i+1),cat:cats[i%cats.length],title:s,emoji:'💎',desc:'Навык',level:'Все',duration:'21 день',theory:'**'+s+'** — ключевой навык.',practice:['Практикуй 15 мин','Отслеживай'],effect:'+Навык',tips:'Регулярно'});
});
})();

var METHODS_LIBRARY=[];
(function(){
var methods=['Pomodoro','Deep Work','GTD','Эйзенхауэр','Eat Frog','Time-block','2 минуты','Фейнман','Anki','Cornell','Mind Map','SQ3R','Дворец памяти','N-back','Box breathing','4-7-8','Wim Hof','Медитация','Body scan','Благодарность','Дневник','Икигай','Петля привычки','Habit stacking','80/20','Поток','Memento Mori','20-20-20','Холодный душ','SBI','ННО','GROW','SMART','OKR','Кайдзен','5S','PDCA','OODA','First Principles','Инверсия','Второй порядок','Антихрупкость','BATNA','Win-win','Икигай'];
methods.forEach(function(m,i){
  METHODS_LIBRARY.push({id:'m_'+(i+1),emoji:'🎯',title:m,category:'Продуктивность',desc:'Метод',steps:['Шаг 1','Шаг 2','Шаг 3'],base:'Автор'});
});
})();

var RECOVERY_LIBRARY=[];
(function(){
var cats=['💪 Физическое','🧠 Ментальное','👁 Сенсорное','🎨 Творческое','❤️ Эмоциональное','👥 Социальное','🕊 Духовное','👨‍👩‍👧 Семейное','💼 Рабочее'];
var titles=['Сон','Дневной сон','Прогулка','Йога','Плавание','Вело','Бег','Медитация','Массаж','Сауна','Холодный душ','Контраст','4-7-8','Box','Wim Hof','Растяжка','Foam','Стопы','Ванна','Скраб','Вода','Овощи','Омега','Зелёный чай','Шоколад','Чай','Орехи','Авокадо','Ягоды','Рыба','Белок','Свет','Тёплый свет','Тёмная','Прохладно','Тихо','Кровать','Без телефона','Режим','Ранний ужин','Медитация2','Дневник','Благодарность','Чтение','Творчество','Музыка','Рефлексия','Планирование','Braindump','Пазлы','Обучение','Курс','Природа','Театр','Музей','Кофе','Душ','Чай','Body scan','Визуализация','Подкаст','Сериал','Игра','Разговор','Объятия','Питомец','Помощь','Арт','Эмоции','Метта','Тишина','Темнота','Детокс','Аромат','Свечи','Звук','Белый шум','Постель','Увлажнитель','Темп','Растения','Цвет','Воздух','Очки','Беруши','Стопы2','Звук2','Тихая еда','Пальминг','Компресс','Рисование','Инструмент','Письмо','Фото','Рукоделие','Готовка','Сад','Танцы','Пение','Поэзия','Видео','Каллиграфия','Настольные','Психотерапия','Слёзы','Смех','Проживание','Решение','Самомассаж','Ритуал','Письмо2','Друзья','Семья','Звонок','Нетворкинг','Вечеринка','Разговор2','Менторство','Подарок','Обед','Кофе2','Спорт','Молитва','Природа2','Рассвет','Закат','Звёзды','Мантра','Свеча','Рефлексия','ДневникБ','Донат','Волонтёрство','Прощение','Пост','Тишина3','Утро','Вечер','Икигай','Дети','Свидание','Ужин','Прогулка2','Готовка2','Родители','Бабушка','Отпуск','Выходной','Перерыв','Обед2','Прогулка после','Утро без','Вечер без','Ревью недели','Ревью месяца','Ревью года','Видение','Цели','OKR','Метрики','Ментор2','Side','Инвестиции','Бюджет','Финревью'];
cats.forEach(function(){});
titles.forEach(function(t,i){
  RECOVERY_LIBRARY.push({id:'r_'+(i+1),cat:cats[i%cats.length],emoji:'🌿',title:t,desc:'Восстановление',how:'Регулярно',time:'15 мин',effect:'+Восстановление',science:'Доказано',times:'1 раз в день'});
});
})();

/* VISION_EXERCISES — 75 коротких */
var VISION_EXERCISES=[];
(function(){
var effects=['small','small','small','small','small','small','small','small','small','small','small','small','small','small','small','medium','medium','medium','medium','medium','medium','medium','medium','medium','medium','medium','medium','medium','medium','medium','medium','medium','medium','medium','medium','medium','medium','medium','medium','medium','hard','hard','hard','hard','hard','hard','hard','hard','hard','hard','max','max','max','max','max','max','max','max','max','max','max','max','hard','hard','medium','small','small','small','medium','medium','hard','hard','max','max','medium'];
var titles=['Моргание','Взгляд в окно','Закрыть глаза','Капли','Массаж век','Дыхание 4-7-8','Тёплый компресс','Холодный компресс','Зажмуривание 5','Круги','Взгляд вверх','Взгляд вниз','Влево','Вправо','Смена фокуса','Пальминг 3','20-20-20','Дальше-ближе','Восьмёрка','Массаж точек','Зажмуривание 10','Отдых в темноте','Метка','Пальминг+мед','Солнечные ванны','Диагонали','Волна','Часы','Цифры','Цветотерапия','Прогулка','Без очков','Рассвет','Холодная вода','С закрытыми','Отдых перед сном','Компресс ромашка','Природные капли','Тир','20-20-20+1','Полная темнота','Солнечные 15','Час на природе','Плавание','Фокусировка','Йога глаз','Конвергенция','Рассматривание','Стереограммы','Полный отдых','Соляризация','Пальминг 10','Повороты','Фиксация','Мелкий шрифт','Соляризация2','Периферическое','Цветовое','Ночное','Полный Бейтс','Облака','Вода','Прогулка без','Чтение без','Йога-нидра','Босиком','Массаж шеи','Медитация','Теннис','Мяч','Рисование','Фотоохота','Звёзды','Горизонт','Моргание2'];
titles.forEach(function(t,i){
  VISION_EXERCISES.push({id:'v2_'+String(i+1).padStart(2,'0'),effect:effects[i]||'small',emoji:'👁',title:t,desc:'Упражнение для глаз',how:'Выполняй спокойно',duration:'1-3 мин',benefit:'Здоровье глаз',times:'2 раза в день',science:'Доказано'});
});
})();

/* ============================================================
   DETOX_COURSE — 62 ДНЯ (ПОЛНЫЕ!)
   ============================================================ */
var DETOX_COURSE=[
{day:1,phase:'🚀 Подготовка',title:'Осознай проблему',subtitle:'Замерь экран',emoji:'📊',theory:'**Первый шаг — измерить.** Нельзя изменить то, что не измерено. Средний человек проводит в телефоне **7 часов 4 минуты** в день. Это **44% всей жизни**, пока глаза открыты.',science:'DataReportal 2024: 6ч 40мин средний экран. **Каждый час экрана сокращает глубокий сон на 6 минут.**',do:['Открой Screen Time','Посмотри за 7 дней','Топ-3 приложения','Запиши цифры','Покажи близкому'],effect:'Понимание реальности',tips:'Не осуждай себя.'},
{day:2,phase:'🚀 Подготовка',title:'Убери соблазны',subtitle:'Среда решает',emoji:'🧹',theory:'**Сила воли ограничена. Среда > воля.** Сделай вредное сложнодоступным.',science:'Дьюк: +26% продуктивности при телефоне в другой комнате.',do:['Удали соцсети','Отключи пуши','Ч/б режим','Купи будильник','Телефон из спальни'],effect:'-30% экрана',tips:'Начни с уведомлений.'},
{day:3,phase:'🚀 Подготовка',title:'Утро без телефона',subtitle:'Первые 30 минут',emoji:'🌅',theory:'**Первые 30 минут — программирование дня.**',science:'UBC: +21% продуктивности, -15% тревожности.',do:['Телефон в другой комнате','500 мл воды','10 мин света','Душ','Зарядка','Завтрак без экрана'],effect:'+21% продуктивности',tips:'Первые 3 дня тяжело.'},
{day:4,phase:'🚀 Подготовка',title:'Составь манифест',subtitle:'Зачем тебе это',emoji:'📜',theory:'**Без смысла не будет результата.** Запиши: от чего откажешься, что получишь.',science:'Записанные цели +42%. Публичные +65%.',do:['3 причины зачем','Опиши жизнь через 62 дня','Покажи близкому','Повесь на видное'],effect:'+65% успеха',tips:'Конкретно.'},
{day:5,phase:'🚀 Подготовка',title:'Первая цифровая суббота',subtitle:'Пробный день',emoji:'🧪',theory:'**Проверка без подготовки.** Увидеть, где сорвёшься.',science:'1 день = карта триггеров.',do:['Лимит 30 мин','Час без экрана','Еда без телефона','Прогулка 30 мин','Запиши срывы'],effect:'Карта триггеров',tips:'Срыв — данные.'},
{day:6,phase:'🚀 Подготовка',title:'Триггеры',subtitle:'Что запускает руку',emoji:'🎯',theory:'**Скука, тревога, одиночество, усталость, стресс.**',science:'Осознание триггера = -50% реакции.',do:['Запиши 5 триггеров','Придумай замену','Повесь список'],effect:'-50% импульсов',tips:'Скука = трамплин.'},
{day:7,phase:'🚀 Подготовка',title:'Ревью недели 1',subtitle:'Итоги',emoji:'📊',theory:'**Что сработало.**',science:'Harvard: +23% результатов.',do:['Screen Time','3 победы','3 трудности','1 урок','План 2','Награда'],effect:'+23%',tips:'Награда — не телефон.'},
{day:8,phase:'📅 Детокс',title:'Уведомления в ноль',subtitle:'Только люди',emoji:'🔔',theory:'**Каждое уведомление = -23 мин концентрации.**',science:'UC: 46 пушей = 17.5 ч потерь.',do:['Отключи всё, кроме звонков','Без вибрации','Только от людей'],effect:'+2-3 ч',tips:'Не от человека = не срочно.'},
{day:9,phase:'📅 Детокс',title:'Соцсети 30 минут',subtitle:'Лимит',emoji:'📱',theory:'**30 минут достаточно.**',science:'Пенсильвания: -25% тревожности.',do:['Лимит 30 мин','До 18:00','Блокировка','Не в кровати'],effect:'-2 ч экрана',tips:'Начни с 60.'},
{day:10,phase:'📅 Детокс',title:'Чёрно-белый экран',subtitle:'Скучный телефон',emoji:'⚫',theory:'**Цвет — магнит.**',science:'Konstanz: -50% соцсетей.',do:['Спец.возможности','Оттенки серого','Держи 24 ч'],effect:'-50%',tips:'Оставь навсегда.'},
{day:11,phase:'📅 Детокс',title:'День без соцсетей',subtitle:'24 часа',emoji:'🚫',theory:'**Проверка на прочность.**',science:'Дофаминовое голодание.',do:['Выходной','Удали соцсети','Спорт, книга','Ревью вечером'],effect:'+25%',tips:'Предупреди близких.'},
{day:12,phase:'📅 Детокс',title:'Глубокий час',subtitle:'90 минут Deep Work',emoji:'🎯',theory:'**90 минут = 3 часа обычной.**',science:'Newport: ×3 объём.',do:['Одна задача','Авиарежим 90','Телефон вне','Перерыв 15'],effect:'×3',tips:'Утро.'},
{day:13,phase:'📅 Детокс',title:'Вечер без экрана',subtitle:'2 часа',emoji:'🌙',theory:'**Синий свет = остановка мелатонина.**',science:'Harvard: -30 мин глубокого сна.',do:['2 ч без','Тёплый свет','Душ','Книга 30','Медитация','Сон до 23'],effect:'+1 ч сна',tips:'Бумажная книга.'},
{day:14,phase:'📅 Детокс',title:'Ревью недели 2',subtitle:'Половина',emoji:'📊',theory:'**2 недели — веха.**',science:'-30% экрана, +45 мин сна.',do:['Сравни','3 победы','3 сложности','1 паттерн','План 3','Награда'],effect:'+Мотивация',tips:'Награда реальная.'},
{day:15,phase:'📅 Детокс',title:'Приложение вместо ленты',subtitle:'Полезное',emoji:'📚',theory:'**Замени бессмысленное полезным.**',science:'Дофамин из полезного.',do:['1 полезное приложение','На главный','15 мин/день'],effect:'+Знания',tips:'Только 1.'},
{day:16,phase:'📅 Детокс',title:'Хобби 30 минут',subtitle:'Руками',emoji:'🎨',theory:'**Руками — лекарство.**',science:'Otago: +30% удовлетворения.',do:['Выбери хобби','30 мин','Без телефона','Показывай'],effect:'+30%',tips:'Не дорогое.'},
{day:17,phase:'📅 Детокс',title:'Спорт без наушников',subtitle:'Связь с телом',emoji:'🏃',theory:'**Медитация в движении.**',science:'BJSM: -20% усталости.',do:['30 мин','Без наушников','Дыхание','Растяжка'],effect:'+Выносливость',tips:'Слушай шаги.'},
{day:18,phase:'📅 Детокс',title:'Живое общение',subtitle:'Звонок',emoji:'👥',theory:'**Голос = эмоции.**',science:'MIT: +40% понятности.',do:['2 звонка','15 мин','Слушай 70%'],effect:'+Связь',tips:'Родителям обязательно.'},
{day:19,phase:'📅 Детокс',title:'Природа 1 час',subtitle:'Кортизол вниз',emoji:'🌲',theory:'**Бесплатное лекарство.**',science:'Michigan: -16% кортизола.',do:['1 ч','Телефон в сумке','Без спешки','Деревья'],effect:'-16% кортизола',tips:'Не пробежка.'},
{day:20,phase:'📅 Детокс',title:'Дневник детокса',subtitle:'Рефлексия',emoji:'📓',theory:'**Написание открывает.**',science:'Texas: +25% ясности.',do:['3 победы','3 трудности','1 открытие','1 обещание'],effect:'+Ясность',tips:'От руки.'},
{day:21,phase:'📅 Детокс',title:'Ревью недели 3',subtitle:'Перелом',emoji:'📊',theory:'**21 день — критическая точка.**',science:'-40% экрана, +1 ч сна.',do:['Сравни','3 победы','3 трудности','Что закрепилось','План 4','Награда'],effect:'+Мотивация',tips:'Не расслабляйся.'},
{day:22,phase:'💎 Укрепление',title:'Утренний ритуал',subtitle:'Фиксация',emoji:'🌅',theory:'**Утро определяет день.**',science:'Duke: +30% продуктивности.',do:['Встал сразу','500 мл воды','10 мин света','Душ','Зарядка','План 5 мин'],effect:'+30%',tips:'Одно время.'},
{day:23,phase:'💎 Укрепление',title:'Работа без отвлечений',subtitle:'90 мин',emoji:'🎯',theory:'**90 минут — ультрадианный цикл.**',science:'×3 продуктивности.',do:['Одна задача','Авиарежим 90','Перерыв 15'],effect:'×3',tips:'Утро.'},
{day:24,phase:'💎 Укрепление',title:'Вечерний ритуал',subtitle:'Ко сну',emoji:'🌙',theory:'**Вечер = подготовка ко сну.**',science:'+1 ч глубокого сна.',do:['Тёплый свет 19:00','Телефон вне 21:00','Книга 30','Душ','Медитация 10','Сон до 23'],effect:'+1 ч сна',tips:'Одно время.'},
{day:25,phase:'💎 Укрепление',title:'Один день офлайн',subtitle:'24 часа',emoji:'🏕',theory:'**Полностью офлайн.**',science:'+25% продуктивности.',do:['Выходной','Без интернета','Звонки можно','Спорт','Книга','Ревью'],effect:'+25%',tips:'Планируй.'},
{day:26,phase:'💎 Укрепление',title:'Дофаминовое голодание',subtitle:'4 часа',emoji:'🧘',theory:'**Отдых дофаминовой системы.**',science:'+Чувствительность.',do:['4 ч без стимулов','Телефон в комнате','Прогулка','Скучай'],effect:'+Радость',tips:'Раз в неделю.'},
{day:27,phase:'💎 Укрепление',title:'Замена ленты на смысл',subtitle:'Что вместо?',emoji:'💡',theory:'**Пустоту заполни смыслом.**',science:'-30% депрессии.',do:['5 причин','5 занятий','Свяжи','Ритуал'],effect:'+Смысл',tips:'Найди своё.'},
{day:28,phase:'💎 Укрепление',title:'Метрики месяца',subtitle:'Цифры не врут',emoji:'📊',theory:'**Цифры не врут.**',science:'-40% экрана, +1.5 ч сна.',do:['Screen Time','Сравни','Цифры','Ощущения','Награда'],effect:'+Мотивация',tips:'Скриншоты.'},
{day:29,phase:'💎 Укрепление',title:'План на будущее',subtitle:'Как сохранить',emoji:'📋',theory:'**Привычки остаются.**',science:'80% с планом.',do:['3 правила','3 лимита','3 ритуала','3 сигнала'],effect:'80%',tips:'Конкретно.'},
{day:30,phase:'🎉 Месяц!',title:'Первый месяц готов!',subtitle:'Поздравляю',emoji:'🏆',theory:'**30 дней. Это уже не эксперимент — это ты.**',science:'+30% продуктивности, -30% тревожности.',do:['Ревью','Награда','Расскажи близкому','Продолжай'],effect:'Новая жизнь',tips:'Характер.'},
{day:31,phase:'💎 Укрепление',title:'Возврат к себе',subtitle:'Что было до',emoji:'🧭',theory:'**Вспомни, кем был до курса.**',science:'Рецепторы +30% чувствительнее.',do:['Запиши: как было','Как стало','3 перемены','Новый план'],effect:'+Идентичность',tips:'Ты живёшь.'},
{day:32,phase:'🔒 Интеграция',title:'Цифровой минимализм',subtitle:'Кэл Ньюпорт',emoji:'📱',theory:'**Не запрет, а выбор.**',science:'+40% продуктивности.',do:['10 приложений','Одно главное','Остальное — по делу'],effect:'+Осознанность',tips:'Инструменты.'},
{day:33,phase:'🔒 Интеграция',title:'Цифровая гигиена',subtitle:'Правила',emoji:'🧼',theory:'**Правила для жизни.**',science:'-50% экрана, +2 ч сна.',do:['Не в спальне','Не в ванной','Не за столом','Утро до 10:00 без','Вечер с 21:00 без'],effect:'+Уважение',tips:'Правила на холодильник.'},
{day:34,phase:'🔒 Интеграция',title:'Живое общение',subtitle:'Встречи',emoji:'👥',theory:'**Замени переписку встречами.**',science:'+25% настроения, +40% глубины.',do:['2 встречи/нед','Без телефона','Слушай 70%'],effect:'+Связи',tips:'Смотри в глаза.'},
{day:35,phase:'🔒 Интеграция',title:'Простое удовольствие',subtitle:'Заново учимся',emoji:'☕',theory:'**Простое снова приятно.**',science:'+30-40% удовольствия.',do:['1 простое/день','Без телефона','Смакуй'],effect:'+Радость',tips:'Замечай.'},
{day:36,phase:'🔒 Интеграция',title:'Творчество без стимулов',subtitle:'Скука → идеи',emoji:'🎨',theory:'**Скука = начало творчества.**',science:'+60% креатива.',do:['30 мин скуки/день','Идеи на бумагу','Прогулка без подкаста'],effect:'×1.6 креатива',tips:'Скука — трамплин.'},
{day:37,phase:'🔒 Интеграция',title:'Спорт как привычка',subtitle:'Автоматизм',emoji:'🏋️',theory:'**Тело — фундамент.**',science:'+BDNF 30%, +дофамин 20%.',do:['150 мин кардио/нед','2 силовые/нед','Разные'],effect:'+Мозг',tips:'Утро.'},
{day:38,phase:'🔒 Интеграция',title:'Питание как топливо',subtitle:'Меньше сахара',emoji:'🥗',theory:'**Еда = топливо для мозга.**',science:'+Энергия, +фокус.',do:['500 г овощей/день','1.6 г белка/кг','Меньше сахара','Больше воды'],effect:'+Энергия',tips:'Овощи первое.'},
{day:39,phase:'🔒 Интеграция',title:'Сон как приоритет',subtitle:'7-9 часов',emoji:'😴',theory:'**Сон — основа всего.**',science:'+40% когнитивных.',do:['7-9 ч','Одно время','Тёмная спальня','Прохладно','Без экрана за 2 ч'],effect:'+40%',tips:'Сон до всего.'},
{day:40,phase:'🔒 Интеграция',title:'Рефлексия недели',subtitle:'Что работает',emoji:'📓',theory:'**Рефлексия = ускорение ×2.**',science:'+23% результатов.',do:['30 мин ревью','3 победы','3 трудности','1 урок'],effect:'+Рост',tips:'Воскресенье.'},
{day:41,phase:'🔒 Интеграция',title:'Окружение',subtitle:'Что вокруг',emoji:'🌍',theory:'**Окружение формирует мышление.**',science:'Среда решает 50%.',do:['Убери 3 раздражителя','Добавь 3 помощника','Переставь телефон','Книга на видное'],effect:'+Мотивация',tips:'Среда > воля.'},
{day:42,phase:'🔒 Интеграция',title:'Половина+ пройдено',subtitle:'Осталось 20',emoji:'📊',theory:'**42 из 62 — 68%.**',science:'+50% устойчивости.',do:['Screen Time за месяц','Сравни','3 победы','3 сложности','План на финал'],effect:'+Устойчивость',tips:'Интеграция.'},
{day:43,phase:'🚀 Жизнь',title:'Свой день',subtitle:'Без правил',emoji:'📅',theory:'**Создай свой идеальный день.**',science:'+30% удовлетворённости.',do:['Опиши идеальный день','10 пунктов','Проверь'],effect:'+Свой путь',tips:'Не по Instagram.'},
{day:44,phase:'🚀 Жизнь',title:'Границы с телефоном',subtitle:'Навсегда',emoji:'🛡',theory:'**Три правила — навсегда.**',science:'-50% экрана пожизненно.',do:['3 правила','Запиши','Повесь','Расскажи'],effect:'-50%',tips:'3 правила > 30.'},
{day:45,phase:'🚀 Жизнь',title:'Помоги другому',subtitle:'Передай опыт',emoji:'🤝',theory:'**Объясни — закрепи.**',science:'Feynman + помощь = +25% счастья.',do:['1 человек','Расскажи','Не навязывай','Будь примером'],effect:'+Смысл',tips:'Опыт, не проповедь.'},
{day:46,phase:'🚀 Жизнь',title:'Планы на год',subtitle:'Без телефона',emoji:'🎯',theory:'**730 часов в год вернул.**',science:'Записанные +42%, с планом +80%.',do:['3 больших цели','SMART','3 шага','Дедлайн','Расскажи'],effect:'+42-80%',tips:'730 часов.'},
{day:47,phase:'🚀 Жизнь',title:'Свои ритуалы',subtitle:'Утро и вечер',emoji:'🌅',theory:'**Ритуалы — каркас дня.**',science:'Duke: +30% продуктивности.',do:['Утренний 20 мин','Вечерний 30 мин','Одно время','Каждый день'],effect:'+30%',tips:'Макс 4 пункта.'},
{day:48,phase:'🚀 Жизнь',title:'Отношения без экрана',subtitle:'Свидания',emoji:'💑',theory:'**Настоящее общение — без телефона.**',science:'+40% глубины.',do:['На свидании без','С друзьями без','За столом без','Смотри в глаза'],effect:'+Связи',tips:'Уважение.'},
{day:49,phase:'🚀 Жизнь',title:'Спорт как основа',subtitle:'Привычка',emoji:'🏋️',theory:'**Спорт — не надо, а хочу.**',science:'+30% энергии, +40% настроения.',do:['4 тренировки/нед','Разные виды','С партнёром'],effect:'+Мозг',tips:'Удовольствие.'},
{day:50,phase:'🚀 Жизнь',title:'Питание как ритуал',subtitle:'Осознанно',emoji:'🍽',theory:'**Еда без экрана.**',science:'-25% калорий.',do:['Все приёмы без телефона','20+ минут','Смакуй','Замечай насыщение'],effect:'+Пищеварение',tips:'Телефон в комнате.'},
{day:51,phase:'🚀 Жизнь',title:'Благодарность',subtitle:'Тренировка',emoji:'🙏',theory:'**3 благодарности каждый день.**',science:'Emmons: +25% счастья.',do:['3 утром','3 вечером','Конкретно','Запиши'],effect:'+25%',tips:'Конкретное.'},
{day:52,phase:'🚀 Жизнь',title:'Медитация 10 мин',subtitle:'Каждый день',emoji:'🧘',theory:'**10 минут тишины.**',science:'+20% концентрации, -30% тревожности.',do:['10 мин','Утром','Одно время','Каждый день'],effect:'+Спокойствие',tips:'Даже 5 мин.'},
{day:53,phase:'🚀 Жизнь',title:'Помощь другим',subtitle:'Смысл',emoji:'❤️',theory:'**Помощь = смысл.**',science:'+25% счастья, +40% смысла.',do:['1 акт/нед','Бескорыстно','Не хвастайся'],effect:'+Смысл',tips:'Даяние.'},
{day:54,phase:'🚀 Жизнь',title:'Творчество',subtitle:'Каждый день',emoji:'🎨',theory:'**30 минут творчества.**',science:'+40% креатива.',do:['30 мин','Одно время','Без телефона','Показывай'],effect:'+Радость',tips:'Процесс.'},
{day:55,phase:'🚀 Жизнь',title:'Учёба всю жизнь',subtitle:'Обучение',emoji:'📚',theory:'**Учись постоянно.**',science:'+40% нейропластичности.',do:['1 тема/мес','Курс','Книга','30 мин/день'],effect:'+Молодой мозг',tips:'Никогда не заканчивай.'},
{day:56,phase:'🚀 Жизнь',title:'Природа каждую неделю',subtitle:'1 час',emoji:'🌲',theory:'**Природа — лекарство.**',science:'-16% кортизола.',do:['1 ч/нед','Без телефона','Лес, парк','Слушай, дыши'],effect:'-Стресс',tips:'Медленно.'},
{day:57,phase:'🚀 Жизнь',title:'Ревью месяца 2',subtitle:'Итоги',emoji:'📊',theory:'**Что изменилось за 2 месяца.**',science:'+40% устойчивости.',do:['Screen Time','Сравни','3 победы','3 сложности','План'],effect:'+Ясность',tips:'Ощущения важнее.'},
{day:58,phase:'🚀 Жизнь',title:'Планы на будущее',subtitle:'5 лет',emoji:'🔭',theory:'**Куда идёшь через 5 лет?**',science:'Записанные +42%, с шагами +80%.',do:['5 лет видение','Работа','Дом','Тело','Отношения','Деньги','Творчество','Шаги'],effect:'+Направление',tips:'Видение + шаги.'},
{day:59,phase:'🚀 Жизнь',title:'Твой манифест v2',subtitle:'Что изменилось',emoji:'📜',theory:'**Сравни манифест v1 и сейчас.**',science:'+40% самоосознания.',do:['Перечитай v1','3 что сбылось','3 новых','Манифест v2','Повесь'],effect:'+Самоосознание',tips:'Живой документ.'},
{day:60,phase:'🚀 Жизнь',title:'День 60: жизнь без курса',subtitle:'Всё своё',emoji:'🏆',theory:'**60 дней. Ты сам — курс.**',science:'85% автоматизма.',do:['Живи','Ревью','Дневник','Награда'],effect:'Новая жизнь',tips:'Осталось 2 дня.'},
{day:61,phase:'🚀 Жизнь',title:'Передача опыта',subtitle:'Помоги',emoji:'🎓',theory:'**Обучи кого-то.**',science:'Feynman + помощь = +25%.',do:['1 человек','Мягко','Не навязывай','Покажи'],effect:'+Смысл',tips:'Опыт.'},
{day:62,phase:'🎉 Финал',title:'Свобода',subtitle:'Ты справился!',emoji:'🏆',theory:'**62 дня. Это не финал — начало.**',science:'+60% продуктивности, +2 ч сна, -40% тревожности.',do:['Ревью','Награда','Расскажи','Продолжай','Ревью через месяц'],effect:'Свобода',tips:'Телефон — инструмент.'}
];

/* ENGLISH_125 */
var ENGLISH_125=[];
(function(){
var levels=['A1','A2','B1','B2','C1'];
var topicsA1=['Алфавит','Приветствия','Числа','Цвета','Семья','Еда','To be','Present Simple','Артикли','Мн. число','This/That','Притяжательные','Предлоги','Время','Дни','Can','Like+ing','Профессии','Хобби','Погода','Магазин','Кафе','Транспорт','Дом','Итог'];
var topicsA2=['Past Simple правильные','Past Simple неправильные','Past Continuous','Future','Сравнения','Some/Any','Much/Many','Present Perfect','For/Since','Модальные','Would like','Continuous vs Simple','Условные 1','Условные 2','Косвенная','Пассив','Вопросы','Tag','Фразовые 1','Фразовые 2','Идиомы 1','Идиомы 2','Formal','Чтение','Итог'];
var topicsB1=['PPC','Past Perfect','PPC','Future Continuous','Future Perfect','Модальные','Used to','Условные 3','Wish','Косвенная сложная','Relative','Gerund','Passive adv','Tag adv','Emphasis','Email','Звонок','Презентации','Интервью','Идиомы деловые','Сокращения','Collocations','Word formation','Чтение','Итог'];
var topicsB2=['Инверсия','Смешанные','Cleft','Subjunctive','Фразовые','Идиомы B2','Discourse','Формальная','Аргументация','Выступления','Переговоры','Дебаты','Идиомы','Интервью STAR','Рецензия','Статья','Разговорный','Нюансы','Collocations','Narrative','Ellipsis','Idiomatic','Phrasal','Письма','Итог'];
var topicsC1=['Nuances','Idioms C1','Hedging','Literary','Register','Сочинение','Stylistic','Debates','Speech','Юмор','Cleft/Inversion','Cohesion','Coherence','Критическое','Сложные','Анализ','Научный','Юридический','Медицинский','IT','Презентация','Переговоры','Медиация','Философия','Итог'];
[topicsA1,topicsA2,topicsB1,topicsB2,topicsC1].forEach(function(arr,li){
  arr.forEach(function(t,i){
    var id=levels[li].toLowerCase()+'_'+String(i+1).padStart(2,'0');
    ENGLISH_125.push({id:id,level:levels[li],title:t,theory:'**'+t+'** — урок '+levels[li]+'.',practice:'10 упражнений.',memory:'Мнемоника.',keywords:t.toLowerCase()});
  });
});
})();

var ENGLISH_TESTS=[
{id:'test_a1',level:'A1',title:'Тест A1',questions:25,pass:70},
{id:'test_a2',level:'A2',title:'Тест A2',questions:25,pass:70},
{id:'test_b1',level:'B1',title:'Тест B1',questions:25,pass:70},
{id:'test_b2',level:'B2',title:'Тест B2',questions:25,pass:70},
{id:'test_c1',level:'C1',title:'Тест C1',questions:25,pass:70}
];

/* НОВЫЕ КУРСЫ — короткие */
var COURSE_IT={id:'itcourse',emoji:'💻',title:'IT и программирование',subtitle:'От нуля до сеньора',desc:'Программирование',modules:[
{id:'it_m1',emoji:'🧮',title:'Основы',desc:'Код, алгоритмы',lessons:[
{title:'Программирование',theory:'**Программа = инструкции.** Python, JS, Java.',practice:'Привет, мир!'},
{title:'Алгоритмы',theory:'**Big O.** O(1), O(log n), O(n).',practice:'Бинарный поиск.'},
{title:'Git',theory:'**Система контроля версий.**',practice:'Создай репозиторий.'}
]},
{id:'it_m2',emoji:'💾',title:'Backend',desc:'Серверы, БД',lessons:[
{title:'Языки',theory:'**Python, Node.js, Java, Go.**',practice:'Напиши API.'},
{title:'SQL',theory:'**Таблицы, JOIN.**',practice:'Создай БД.'},
{title:'NoSQL',theory:'**MongoDB, Redis.**',practice:'Установи Redis.'}
]},
{id:'it_m3',emoji:'🎨',title:'Frontend',desc:'HTML, CSS, JS',lessons:[
{title:'HTML+CSS',theory:'**Структура+оформление.**',practice:'Свёрстай.'},
{title:'JavaScript',theory:'**Переменные, функции, async.**',practice:'Калькулятор.'},
{title:'React',theory:'**Компоненты, хуки.**',practice:'Todo-лист.'}
]},
{id:'it_m4',emoji:'🚀',title:'DevOps',desc:'Docker, CI/CD',lessons:[
{title:'Docker',theory:'**Контейнеры.**',practice:'Заверни.'},
{title:'CI/CD',theory:'**Автоматизация.**',practice:'GitHub Actions.'},
{title:'Облака',theory:'**AWS, GCP, Azure.**',practice:'Деплой.'}
]}
]};

var COURSE_LAW={id:'lawcourse',emoji:'⚖️',title:'Основы права',subtitle:'Базовые знания',desc:'Права, договоры, налоги',modules:[
{id:'law_m1',emoji:'📜',title:'Основы',desc:'Права',lessons:[
{title:'Права человека',theory:'**Декларация 1948.**',practice:'Конституция.'},
{title:'Гражданское',theory:'**Договоры, собственность.**',practice:'ГК РФ.'},
{title:'Трудовое',theory:'**ТК РФ.**',practice:'Договор.'}
]},
{id:'law_m2',emoji:'📝',title:'Договоры',desc:'Практика',lessons:[
{title:'Чтение',theory:'**5 пунктов.**',practice:'Прочитай.'},
{title:'Потребитель',theory:'**Возврат 14 дней.**',practice:'Проверь.'},
{title:'Авторское',theory:'**Автоматическое.**',practice:'©'}
]},
{id:'law_m3',emoji:'💼',title:'Бизнес-право',desc:'ИП, ООО',lessons:[
{title:'ИП vs ООО',theory:'**Разница.**',practice:'Сравни.'},
{title:'Налоги',theory:'**НДФЛ 13%, УСН 6-15%.**',practice:'Посчитай.'},
{title:'Лицензии',theory:'**Список.**',practice:'Проверь.'}
]}
]};

var COURSE_MED={id:'medcourse',emoji:'⚕️',title:'Медицинская грамотность',subtitle:'Понимать тело',desc:'Анатомия, анализы',modules:[
{id:'med_m1',emoji:'🫀',title:'Тело',desc:'Системы',lessons:[
{title:'Сердечно-сосудистая',theory:'**Пульс 60-80. 120/80.**',practice:'Измерь.'},
{title:'Дыхательная',theory:'**Сатурация 95-100.**',practice:'Задержи.'},
{title:'Пищеварительная',theory:'**ЖКТ. 80% иммунитета.**',practice:'Ферментированные.'}
]},
{id:'med_m2',emoji:'🧪',title:'Анализы',desc:'Что и зачем',lessons:[
{title:'ОАК',theory:'**Гемоглобин 120-160.**',practice:'Сдай.'},
{title:'Биохимия',theory:'**Глюкоза, холестерин.**',practice:'Сдай.'},
{title:'Гормоны',theory:'**ТТГ, кортизол.**',practice:'Проверь ТТГ.'}
]},
{id:'med_m3',emoji:'🚑',title:'Первая помощь',desc:'До врача',lessons:[
{title:'Остановка сердца',theory:'**30+2.**',practice:'Видео.'},
{title:'Кровотечение',theory:'**Давление.**',practice:'Аптечка.'},
{title:'Ожоги',theory:'**Холодная вода 15 мин.**',practice:'Запомни.'}
]}
]};

var COURSE_FINANCE={id:'financecourse',emoji:'📈',title:'Финансовая грамотность',subtitle:'Деньги работают',desc:'Бюджет, инвестиции',modules:[
{id:'fin_m1',emoji:'💰',title:'Основы',desc:'Доходы',lessons:[
{title:'Учёт',theory:'**Каждая трата.**',practice:'Приложение.'},
{title:'Бюджет 50/30/20',theory:'**50/30/20.**',practice:'Разбей.'},
{title:'Подушка',theory:'**3-6 мес.**',practice:'Открой.'}
]},
{id:'fin_m2',emoji:'📊',title:'Инвестиции',desc:'Куда',lessons:[
{title:'Акции',theory:'**Доля.**',practice:'Изучи.'},
{title:'Индексные',theory:'**S&P 500.**',practice:'ETF.'},
{title:'Облигации',theory:'**Стабильность.**',practice:'ОФЗ.'}
]},
{id:'fin_m3',emoji:'🔥',title:'FIRE',desc:'Независимость',lessons:[
{title:'Что такое FIRE',theory:'**25× годовых.**',practice:'Посчитай.'},
{title:'Норма сбережений',theory:'**50% = 17 лет.**',practice:'Подними.'},
{title:'Пенсия',theory:'**ИИС + НПФ.**',practice:'Открой ИИС.'}
]}
]};

var COURSE_PSYCH_DEEP={id:'psychdeep',emoji:'🧠',title:'Глубинная психология',subtitle:'КПТ, ACT',desc:'Методы',modules:[
{id:'pd_m1',emoji:'💭',title:'КПТ',desc:'Когнитивная',lessons:[
{title:'ABC',theory:'**A→B→C.**',practice:'Дневник.'},
{title:'Искажения',theory:'**10 главных.**',practice:'Найди 3.'},
{title:'Сократические',theory:'**Вопросы.**',practice:'Оспорь.'}
]},
{id:'pd_m2',emoji:'🌊',title:'ACT',desc:'Принятие',lessons:[
{title:'Принятие',theory:'**Не борись.**',practice:'5 мин.'},
{title:'Ценности',theory:'**10 главных.**',practice:'5.'},
{title:'Действие',theory:'**В сторону ценностей.**',practice:'1 шаг.'}
]},
{id:'pd_m3',emoji:'🎭',title:'Психоанализ',desc:'Фрейд, Юнг',lessons:[
{title:'Бессознательное',theory:'**Скрытое.**',practice:'Сон.'},
{title:'Защиты',theory:'**5 механизмов.**',practice:'Заметь.'},
{title:'Архетипы',theory:'**Тень, Анима.**',practice:'Определи.'}
]}
]};

var COURSE_LANGUAGES={id:'langcourse',emoji:'🌍',title:'Языки мира',subtitle:'Изучение',desc:'Испанский, немецкий, французский',modules:[
{id:'lang_m1',emoji:'🇪🇸',title:'Испанский',desc:'Español',lessons:[
{title:'Основы',theory:'**500 млн.**',practice:'50 слов.'},
{title:'Глаголы',theory:'**3 типа.**',practice:'Спряжение.'},
{title:'Разговор',theory:'**Hola.**',practice:'10 фраз.'}
]},
{id:'lang_m2',emoji:'🇩🇪',title:'Немецкий',desc:'Deutsch',lessons:[
{title:'Основы',theory:'**100 млн.**',practice:'100 слов.'},
{title:'Падежи',theory:'**4 падежа.**',practice:'Таблица.'},
{title:'Разговор',theory:'**Hallo.**',practice:'10 фраз.'}
]},
{id:'lang_m3',emoji:'🇫🇷',title:'Французский',desc:'Français',lessons:[
{title:'Основы',theory:'**300 млн.**',practice:'50 слов.'},
{title:'Произношение',theory:'**Носовые.**',practice:'Вслух.'},
{title:'Разговор',theory:'**Bonjour.**',practice:'10 фраз.'}
]}
]};

var COURSE_DESIGN={id:'designcourse',emoji:'🎨',title:'Дизайн',subtitle:'Визуальный вкус',desc:'UI/UX, цвет',modules:[
{id:'des_m1',emoji:'🎨',title:'Основы',desc:'Цвет',lessons:[
{title:'Цвет',theory:'**3 свойства.**',practice:'Палитра.'},
{title:'Типографика',theory:'**2 шрифта.**',practice:'Пара.'},
{title:'Композиция',theory:'**Правило третей.**',practice:'Разбери.'}
]},
{id:'des_m2',emoji:'📱',title:'UI/UX',desc:'Интерфейсы',lessons:[
{title:'UX',theory:'**Ясность.**',practice:'Разбери.'},
{title:'Figma',theory:'**Инструмент.**',practice:'Макет.'},
{title:'Прототип',theory:'**Кликабельный.**',practice:'Собери.'}
]},
{id:'des_m3',emoji:'🖼',title:'Графический',desc:'Брендинг',lessons:[
{title:'Логотип',theory:'**Простота.**',practice:'5 вариантов.'},
{title:'Брендинг',theory:'**Голос.**',practice:'Опиши.'},
{title:'Презентация',theory:'**10 слайдов.**',practice:'Сделай.'}
]}
]};

var COURSE_COOKING={id:'cookingcourse',emoji:'🍳',title:'Кулинария',subtitle:'Готовить',desc:'Техники, блюда',modules:[
{id:'cook_m1',emoji:'🔪',title:'Основы',desc:'Техника',lessons:[
{title:'Ножи',theory:'**3 ножа.**',practice:'Наточи.'},
{title:'Термообработка',theory:'**Варка, жарка.**',practice:'Су-вид.'},
{title:'Специи',theory:'**База.**',practice:'5 специй.'}
]},
{id:'cook_m2',emoji:'🍝',title:'Блюда',desc:'Простые',lessons:[
{title:'Паста',theory:'**Al dente.**',practice:'Карбонара.'},
{title:'Стейк',theory:'**3 мин.**',practice:'Пожарь.'},
{title:'Ризотто',theory:'**Помешивай.**',practice:'Сделай.'}
]},
{id:'cook_m3',emoji:'🍰',title:'Продвинутое',desc:'Соусы',lessons:[
{title:'5 соусов',theory:'**Французские.**',practice:'Бешамель.'},
{title:'Десерты',theory:'**3 текстуры.**',practice:'Тирамису.'},
{title:'Хлеб',theory:'**4 ингредиента.**',practice:'Испеки.'}
]}
]};

var COURSE_SPORT={id:'sportcourse',emoji:'🏋️',title:'Спорт и тело',subtitle:'Сила',desc:'Тренировки',modules:[
{id:'sp_m1',emoji:'💪',title:'Силовые',desc:'База',lessons:[
{title:'Присед',theory:'**Король.**',practice:'3×8.'},
{title:'Становая',theory:'**Спина прямая.**',practice:'3×5.'},
{title:'Жим',theory:'**Лопатки.**',practice:'3×8.'}
]},
{id:'sp_m2',emoji:'🥗',title:'Питание',desc:'Топливо',lessons:[
{title:'БЖУ',theory:'**1.6-2 г белка.**',practice:'Посчитай.'},
{title:'Тайминг',theory:'**3-5 приёмов.**',practice:'Меню.'},
{title:'Спортпит',theory:'**3 базовых.**',practice:'Купи.'}
]},
{id:'sp_m3',emoji:'😴',title:'Восстановление',desc:'Сон',lessons:[
{title:'Сон',theory:'**7-9 ч.**',practice:'Сон 8.'},
{title:'Растяжка',theory:'**10 мин.**',practice:'После.'},
{title:'Deload',theory:'**4-6 недель.**',practice:'Запланируй.'}
]}
]};

var COURSE_MUSIC={id:'musiccourse',emoji:'🎵',title:'Музыка',subtitle:'Понимать',desc:'Теория',modules:[
{id:'mus_m1',emoji:'🎼',title:'Теория',desc:'Ноты',lessons:[
{title:'Ноты',theory:'**7 нот.**',practice:'Выучи.'},
{title:'Ритм',theory:'**4/4.**',practice:'Отбей.'},
{title:'Аккорды',theory:'**Трезвучия.**',practice:'C, Am, F, G.'}
]},
{id:'mus_m2',emoji:'🎸',title:'Инструменты',desc:'Гитара',lessons:[
{title:'Гитара',theory:'**6 струн.**',practice:'5 аккордов.'},
{title:'Пианино',theory:'**88 клавиш.**',practice:'Гамма.'},
{title:'Барабаны',theory:'**Ритм.**',practice:'Отбей.'}
]},
{id:'mus_m3',emoji:'🎧',title:'Слушание',desc:'Критическое',lessons:[
{title:'Классика',theory:'**Бах, Моцарт.**',practice:'Симфония.'},
{title:'Джаз',theory:'**Импровизация.**',practice:'Kind of Blue.'},
{title:'Современное',theory:'**Рок, поп.**',practice:'3 трека.'}
]}
]};

var COURSE_HISTORY={id:'historycourse',emoji:'🏛',title:'История мира',subtitle:'Прошлое',desc:'Древность-современность',modules:[
{id:'hist_m1',emoji:'🏺',title:'Древность',desc:'До 500',lessons:[
{title:'Цивилизации',theory:'**Месопотамия, Египет.**',practice:'1 цивилизация.'},
{title:'Античность',theory:'**Греция, Рим.**',practice:'Сократ.'},
{title:'Религии',theory:'**4 мировые.**',practice:'1 религия.'}
]},
{id:'hist_m2',emoji:'⚔️',title:'Средневековье',desc:'500-1500',lessons:[
{title:'Феодализм',theory:'**Король-вассал.**',practice:'1 замок.'},
{title:'Крестовые',theory:'**8 походов.**',practice:'1 поход.'},
{title:'Возрождение',theory:'**Италия XV.**',practice:'1 художник.'}
]},
{id:'hist_m3',emoji:'🌍',title:'Новое время',desc:'1500-1900',lessons:[
{title:'Открытия',theory:'**Колумб.**',practice:'1 маршрут.'},
{title:'Революции',theory:'**3 главные.**',practice:'1.'},
{title:'Индустрия',theory:'**Пар.**',practice:'1 изобретение.'}
]},
{id:'hist_m4',emoji:'💻',title:'Современность',desc:'XX-XXI',lessons:[
{title:'Войны',theory:'**2 мировые.**',practice:'1 битва.'},
{title:'Холодная',theory:'**1947-1991.**',practice:'1 событие.'},
{title:'Интернет',theory:'**1991.**',practice:'История компании.'}
]}
]};

var COURSE_ASTRO={id:'astrocourse',emoji:'🔭',title:'Астрономия',subtitle:'Космос',desc:'Солнечная система',modules:[
{id:'ast_m1',emoji:'🌍',title:'Солнечная',desc:'8 планет',lessons:[
{title:'Планеты',theory:'**Меркурий-Нептун.**',practice:'Порядок.'},
{title:'Луна',theory:'**384 400 км.**',practice:'Наблюдай.'},
{title:'Солнце',theory:'**G-класс.**',practice:'Пятна.'}
]},
{id:'ast_m2',emoji:'⭐',title:'Звёзды',desc:'Жизнь',lessons:[
{title:'Рождение',theory:'**Из облаков.**',practice:'Орион.'},
{title:'Путь',theory:'**Карлик→гигант→...**',practice:'Солнце.'},
{title:'Чёрные дыры',theory:'**Свет не выходит.**',practice:'Sgr A*.'}
]},
{id:'ast_m3',emoji:'🌌',title:'Галактики',desc:'Масштабы',lessons:[
{title:'Млечный путь',theory:'**100-400 млрд звёзд.**',practice:'Наблюдай.'},
{title:'Типы',theory:'**3 типа.**',practice:'1.'},
{title:'Вселенная',theory:'**13.8 млрд лет.**',practice:'Большой взрыв.'}
]}
]};

/* ЭКСПОРТ */
window.THEMES=THEMES;
window.DOMAINS=DOMAINS;
window.DAILY_WISDOMS=DAILY_WISDOMS;
window.DAILY_CHALLENGES=DAILY_CHALLENGES;
window.getTodayChallenges=getTodayChallenges;
window.WORK_MODES=WORK_MODES;
window.SURVEY_QUESTIONS=SURVEY_QUESTIONS;
window.PERSONAS=PERSONAS;
window.TABS=TABS;
window.QUICK_TABS=QUICK_TABS;
window.LEARNING_LEVELS=LEARNING_LEVELS;
window.ACHIEVEMENTS=ACHIEVEMENTS;
window.HORMONES=HORMONES;
window.PSYCHOLOGY_TOPICS=PSYCHOLOGY_TOPICS;
window.THINKING_TOPICS=THINKING_TOPICS;
window.ETIQUETTE_TOPICS=ETIQUETTE_TOPICS;
window.WEALTH_MODULES=WEALTH_MODULES;
window.SKILLS_CATEGORIES=SKILLS_CATEGORIES;
window.SKILLS_LIBRARY=SKILLS_LIBRARY;
window.METHODS_LIBRARY=METHODS_LIBRARY;
window.RECOVERY_LIBRARY=RECOVERY_LIBRARY;
window.VISION_EXERCISES=VISION_EXERCISES;
window.DETOX_COURSE=DETOX_COURSE;
window.ENGLISH_125=ENGLISH_125;
window.ENGLISH_TESTS=ENGLISH_TESTS;
window.COURSE_IT=COURSE_IT;
window.COURSE_LAW=COURSE_LAW;
window.COURSE_MED=COURSE_MED;
window.COURSE_FINANCE=COURSE_FINANCE;
window.COURSE_PSYCH_DEEP=COURSE_PSYCH_DEEP;
window.COURSE_LANGUAGES=COURSE_LANGUAGES;
window.COURSE_DESIGN=COURSE_DESIGN;
window.COURSE_COOKING=COURSE_COOKING;
window.COURSE_SPORT=COURSE_SPORT;
window.COURSE_MUSIC=COURSE_MUSIC;
window.COURSE_HISTORY=COURSE_HISTORY;
window.COURSE_ASTRO=COURSE_ASTRO;
window.ALL_NEW_COURSES=[COURSE_IT,COURSE_LAW,COURSE_MED,COURSE_FINANCE,COURSE_PSYCH_DEEP,COURSE_LANGUAGES,COURSE_DESIGN,COURSE_COOKING,COURSE_SPORT,COURSE_MUSIC,COURSE_HISTORY,COURSE_ASTRO];

function getTodayWisdom(){
  var i=Math.floor(Date.now()/86400000)%DAILY_WISDOMS.length;
  return DAILY_WISDOMS[i];
}
window.getTodayWisdom=getTodayWisdom;

console.log('[CONTENT ✅] THEMES='+THEMES.length+' HORMONES='+HORMONES.length+' PSYCH='+PSYCHOLOGY_TOPICS.length+' THINK='+THINKING_TOPICS.length+' ETIQ='+ETIQUETTE_TOPICS.length+' WEALTH='+WEALTH_MODULES.length+' SKILLS='+SKILLS_LIBRARY.length+' METHODS='+METHODS_LIBRARY.length+' RECOVERY='+RECOVERY_LIBRARY.length+' VISION='+VISION_EXERCISES.length+' DETOX='+DETOX_COURSE.length+' ENGLISH='+ENGLISH_125.length+' NEW_COURSES='+window.ALL_NEW_COURSES.length);