'use strict';
/* ============================================================
   LIFE OS — CONTENT.js v44 — ПОЛНЫЙ
   ЧАСТЬ 1/6: Темы, Домены, Мудрости, Челленджи, Опрос, Персоны, Табы
   ============================================================ */

/* ============ ТЕМЫ (74) ============ */
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

/* ============ ДОМЕНЫ (10) ============ */
var DOMAINS=[
{id:'physical',emoji:'💪',name:'Физическое',color:'#ff7ba9',desc:'Тело, сила, здоровье'},
{id:'mental',emoji:'🧠',name:'Ментальное',color:'#4dd4ff',desc:'Фокус, память'},
{id:'emotional',emoji:'❤️',name:'Эмоциональное',color:'#ff6b6b',desc:'Чувства, баланс'},
{id:'spiritual',emoji:'🕊',name:'Духовное',color:'#b394ff',desc:'Смысл, ценности'},
{id:'financial',emoji:'💰',name:'Финансовое',color:'#ffcc4d',desc:'Бюджет, доход'},
{id:'career',emoji:'💼',name:'Карьерное',color:'#3ddc97',desc:'Рост, реализация'},
{id:'social',emoji:'👥',name:'Социальное',color:'#c4b5fd',desc:'Семья, связи'},
{id:'environment',emoji:'🏠',name:'Среда',color:'#a4e7ff',desc:'Пространство'},
{id:'recovery',emoji:'⏰',name:'Восстановление',color:'#4dd4ff',desc:'Сон, отдых'},
{id:'digital',emoji:'📱',name:'Цифровое',color:'#ff88cc',desc:'Экран, данные'}
];

/* ============ МУДРОСТИ (60) ============ */
var DAILY_WISDOMS=[
{text:'Ты не ленивый. Ты либо устал, либо не видишь смысла, либо боишься.',author:'Неизвестный',action:'Запиши, что из 3 — твоё прямо сейчас'},
{text:'Дисциплина — это выбор между тем, что хочешь сейчас, и тем, что хочешь больше всего.',author:'Авраам Линкольн',action:'Назови 1 желание и 1 цель'},
{text:'Мы — то, что делаем постоянно. Совершенство — привычка.',author:'Аристотель',action:'Добавь 1 привычку'},
{text:'Между стимулом и реакцией есть пространство. В нём — наша свобода.',author:'Виктор Франкл',action:'Пауза 6 секунд'},
{text:'Счастье — это не то, что ты имеешь, а то, что ты чувствуешь.',author:'Даг Хэммершолд',action:'3 благодарности'},
{text:'Ты не можешь вернуться и изменить начало, но можешь начать сейчас.',author:'К.С. Льюис',action:'1 действие за 2 минуты'},
{text:'Единственный способ делать великую работу — любить то, что делаешь.',author:'Стив Джобс',action:'Найди 1 вещь с любовью'},
{text:'Сложнее всего начать действовать, остальное — упорство.',author:'Амелия Эрхарт',action:'Начни с 2 минут'},
{text:'Тот, кто владеет собой, владеет миром.',author:'Сенека',action:'Заметь контроль'},
{text:'Мы становимся тем, о чём думаем.',author:'Будда',action:'5 минут наблюдай мысли'},
{text:'Победа над собой — величайшая победа.',author:'Платон',action:'1 сложное дело'},
{text:'Секрет перемен — сосредоточься на создании нового.',author:'Сократ',action:'Опиши, что создаёшь'},
{text:'Если хочешь изменить мир — начни с себя.',author:'Ганди',action:'Измени 1 маленькую вещь'},
{text:'Жизнь — 10% событий и 90% реакций.',author:'Чарльз Свиндолл',action:'Пересмотри 1 реакцию'},
{text:'Каждый день — новая возможность изменить жизнь.',author:'Неизвестный',action:'Что изменишь сегодня?'},
{text:'Не сравнивай себя с другими. Сравнивай с собой вчерашним.',author:'Джордан Питерсон',action:'Оцени рост за неделю'},
{text:'Успех — сумма маленьких усилий, повторяемых день за днём.',author:'Роберт Кольер',action:'1 маленькое усилие'},
{text:'Всё, что можешь сделать — начать.',author:'Неизвестный',action:'Начни сейчас'},
{text:'Измени мысли — изменится жизнь.',author:'Уэйн Дайер',action:'1 мысль поменяй'},
{text:'Великие дела не делаются в зоне комфорта.',author:'Неизвестный',action:'1 дело вне комфорта'},
{text:'Страх — не то, чего бояться. Это то, что преодолеть.',author:'Неизвестный',action:'1 страшное дело'},
{text:'Ты сильнее, чем кажется. Смелее, чем верится.',author:'А.А. Милн',action:'Вспомни 1 победу'},
{text:'Утро определяет день. Начни с правильной привычки.',author:'Робин Шарма',action:'Утренний ритуал'},
{text:'Не трать время на сожаления. Используй на действие.',author:'Неизвестный',action:'1 действие сейчас'},
{text:'Ты — не свои мысли. Ты — тот, кто их наблюдает.',author:'Экхарт Толле',action:'5 минут наблюдай'},
{text:'Действие — главный ключ к успеху.',author:'Пабло Пикассо',action:'1 конкретное действие'},
{text:'Стресс — не то, что происходит, а то, что ты думаешь.',author:'Эндрю Бернстейн',action:'Пересмотри 1 ситуацию'},
{text:'Разница между тем, кто ты, и кем хочешь быть — в действиях.',author:'Неизвестный',action:'1 шаг к цели'},
{text:'Сон — основа всего. Приоритет №1.',author:'Мэттью Уокер',action:'Ляг на 30 мин раньше'},
{text:'Каждый день делай то, что пугает.',author:'Элеонора Рузвельт',action:'1 страшное дело'},
{text:'1% в день — вот и весь секрет.',author:'Джеймс Клир',action:'Улучши на 1%'},
{text:'Сначала пойми, потом будь понятым.',author:'Стивен Кови',action:'Послушай 5 минут'},
{text:'Твоя жизнь — результат твоих решений.',author:'Неизвестный',action:'1 решение осознанно'},
{text:'Окружение определяет мышление.',author:'Джим Рон',action:'Убери 1 отвлечение'},
{text:'Заботься о теле — единственное место, где тебе жить.',author:'Джим Рон',action:'1 действие для тела'},
{text:'Ты не найдёшь себя в тишине, если не дашь себе её.',author:'Неизвестный',action:'10 мин тишины'},
{text:'Отдых — часть работы.',author:'Неизвестный',action:'Перерыв 15 мин'},
{text:'Смысл жизни в том, чтобы дать ей смысл.',author:'Неизвестный',action:'Запиши 3 важные вещи'},
{text:'Иди медленно, но не останавливайся.',author:'Китайская пословица',action:'1 маленький шаг'},
{text:'Маленькие шаги ведут к большим переменам.',author:'Неизвестный',action:'1 маленький шаг'},
{text:'Правило 20-20-20: каждые 20 мин — 20 сек на 6 м.',author:'Офтальмология',action:'Запусти таймер'},
{text:'Пальминг — 5 минут тепла для глаз.',author:'Бейтс',action:'Пальминг 3 мин'},
{text:'Моргай чаще — глаза сохнут от экрана.',author:'Офтальмология',action:'Моргай каждые 10 мин'},
{text:'Смотри вдаль — мышцы глаз расслабляются.',author:'Офтальмология',action:'5 мин в окно'},
{text:'Солнце и зрение: 10 мин утром без очков.',author:'Офтальмология',action:'Выйди на 10 мин'},
{text:'Черника, морковь, рыба — для глаз.',author:'Нутрициология',action:'Съешь что-то для глаз'},
{text:'Гимнастика для глаз — 5 упражнений утром.',author:'Бейтс',action:'5 упражнений'},
{text:'Экран на расстоянии 50-70 см от глаз.',author:'Офтальмология',action:'Отодвинь экран'},
{text:'Тёмный режим снижает нагрузку на глаза.',author:'Офтальмология',action:'Включи тёмный режим'},
{text:'Хочешь изменить жизнь — измени распорядок дня.',author:'Джим Рон',action:'Пересмотри распорядок'},
{text:'Учись у всех, не копируй никого.',author:'Неизвестный',action:'Найди 1 урок'},
{text:'Деньги — инструмент, не цель.',author:'Неизвестный',action:'1 цель и её цену'},
{text:'Каждое утро — шанс начать заново.',author:'Неизвестный',action:'Утренний ритуал'},
{text:'Твоё тело — твой дом. Убирай его.',author:'Неизвестный',action:'1 действие для тела'},
{text:'Пока дышишь — можешь расти.',author:'Неизвестный',action:'Найди 1 урок'},
{text:'Не бойся медленно. Бойся стоять.',author:'Китайская пословица',action:'1 маленький шаг'},
{text:'Отношения > вещи.',author:'Неизвестный',action:'Позвони 1 близкому'},
{text:'Ошибка — не провал, а данные.',author:'Томас Эдисон',action:'1 урок из ошибки'},
{text:'Каждый вечер — рефлексия дня.',author:'Неизвестный',action:'3 победы + 1 урок'},
{text:'Кто рано встаёт, тому Бог даёт.',author:'Пословица',action:'Ляг раньше на 30 мин'}
];

/* ============ ЧЕЛЛЕНДЖИ (24) ============ */
var DAILY_CHALLENGES=[
{id:'ch_no_social_1h',title:'1 час без соцсетей',desc:'Не открывай соцсети 1 час',reward:20,icon:'📵'},
{id:'ch_3_tasks',title:'3 задачи',desc:'Выполни 3 задачи',reward:30,icon:'✅'},
{id:'ch_water_8',title:'8 стаканов воды',desc:'Выпей 8 стаканов',reward:25,icon:'💧'},
{id:'ch_no_phone_morning',title:'Утро без телефона',desc:'30 минут без телефона',reward:25,icon:'🌅'},
{id:'ch_meditation_10',title:'10 минут медитации',desc:'Медитируй 10 минут',reward:20,icon:'🧘'},
{id:'ch_walk_30',title:'Прогулка 30 минут',desc:'Прогуляйся 30 мин',reward:25,icon:'🚶'},
{id:'ch_deep_work_90',title:'Deep Work 90',desc:'90 минут глубокой работы',reward:40,icon:'🎯'},
{id:'ch_read_20',title:'Чтение 20 мин',desc:'Прочти 20 минут',reward:20,icon:'📖'},
{id:'ch_journal',title:'Дневник вечером',desc:'Запиши 3 победы + 1 урок',reward:20,icon:'📓'},
{id:'ch_workout',title:'Тренировка',desc:'Сделай тренировку',reward:35,icon:'🏋️'},
{id:'ch_no_sugar',title:'Без сахара',desc:'День без сахара',reward:25,icon:'🚫'},
{id:'ch_gratitude_3',title:'3 благодарности',desc:'Запиши 3 благодарности',reward:15,icon:'🙏'},
{id:'ch_english_15',title:'Английский 15 мин',desc:'Позанимайся английским',reward:20,icon:'🇬🇧'},
{id:'ch_eye_gym',title:'Гимнастика глаз',desc:'10 упражнений для глаз',reward:15,icon:'👁'},
{id:'ch_palming',title:'Пальминг',desc:'5 минут пальминга',reward:10,icon:'✋'},
{id:'ch_20_20_20',title:'Правило 20-20-20',desc:'Соблюдай весь день',reward:20,icon:'👁'},
{id:'ch_sleep_early',title:'Сон до 23:00',desc:'Ляг до 23:00',reward:25,icon:'😴'},
{id:'ch_cold_shower',title:'Холодный душ',desc:'2 минуты холодной воды',reward:25,icon:'❄️'},
{id:'ch_nature_30',title:'Природа 30 мин',desc:'Прогулка на природе',reward:20,icon:'🌿'},
{id:'ch_no_phone_bed',title:'Телефон вне спальни',desc:'Ночь без телефона',reward:25,icon:'📵'},
{id:'ch_no_screen_morning',title:'Экран ноль до 10:00',desc:'2 часа без экрана утром',reward:30,icon:'🌅'},
{id:'ch_screen_under_2h',title:'Экран <2ч',desc:'Уложись в 2 часа экрана',reward:40,icon:'📱'},
{id:'ch_digital_sabbath',title:'Цифровая суббота',desc:'Полдня без соцсетей',reward:35,icon:'🏕'},
{id:'ch_screen_free_hour',title:'1 час без экрана',desc:'Полностью без экрана 1 час',reward:20,icon:'🚫'}
];

function getTodayChallenges(){
  var dayIdx=Math.floor(Date.now()/86400000);
  var result=[];
  for(var i=0;i<4;i++)result.push(DAILY_CHALLENGES[(dayIdx+i)%DAILY_CHALLENGES.length]);
  return result;
}
function getTodayWisdom(){
  var idx=Math.floor(Date.now()/86400000)%DAILY_WISDOMS.length;
  return DAILY_WISDOMS[idx];
}

/* ============ WORK MODES ============ */
var WORK_MODES=[
{id:'work',name:'Работа',emoji:'💼',desc:'Задачи и продуктивность'},
{id:'rest',name:'Отдых',emoji:'🌿',desc:'Досуг и здоровье'},
{id:'sleep',name:'Сон',emoji:'🌙',desc:'Медитация и сон'},
{id:'study',name:'Учёба',emoji:'📚',desc:'Обучение и английский'}
];

/* ============ SURVEY ============ */
var SURVEY_QUESTIONS=[
{id:'name',question:'Как тебя зовут?',type:'text'},
{id:'age',question:'Сколько тебе лет?',type:'options',options:[
{value:'18-25',label:'18-25',emoji:'🧑'},
{value:'26-35',label:'26-35',emoji:'👨‍💼'},
{value:'36-45',label:'36-45',emoji:'👩‍💼'},
{value:'46+',label:'46+',emoji:'🧓'}
]},
{id:'occupation',question:'Чем занимаешься?',type:'options',options:[
{value:'it',label:'IT',emoji:'💻'},
{value:'business',label:'Бизнес',emoji:'💼'},
{value:'creative',label:'Творчество',emoji:'🎨'},
{value:'student',label:'Учусь',emoji:'🎓'},
{value:'other',label:'Другое',emoji:'🔷'}
]},
{id:'mainGoal',question:'Главная цель?',type:'options',options:[
{value:'health',label:'Здоровье',emoji:'❤️'},
{value:'productivity',label:'Продуктивность',emoji:'⚡'},
{value:'mental',label:'Психика',emoji:'🧠'},
{value:'career',label:'Карьера',emoji:'💰'},
{value:'discipline',label:'Дисциплина',emoji:'⚔️'}
]},
{id:'biggestChallenge',question:'Что мешает?',type:'options',options:[
{value:'procrastination',label:'Прокрастинация',emoji:'⏳'},
{value:'anxiety',label:'Тревога',emoji:'🌊'},
{value:'burnout',label:'Выгорание',emoji:'🔥'},
{value:'sleep',label:'Плохой сон',emoji:'😴'},
{value:'focus',label:'Нет фокуса',emoji:'🎯'},
{value:'screen',label:'Экран',emoji:'📱'}
]},
{id:'sleepHours',question:'Сколько спишь?',type:'options',options:[
{value:'<5',label:'<5 ч',emoji:'😵'},
{value:'5-6',label:'5-6 ч',emoji:'😴'},
{value:'6-7',label:'6-7 ч',emoji:'🙄'},
{value:'7-8',label:'7-8 ч',emoji:'😊'},
{value:'8+',label:'8+ ч',emoji:'😌'}
]},
{id:'activityLevel',question:'Сколько двигаешься?',type:'options',options:[
{value:'none',label:'Почти нет',emoji:'🪑'},
{value:'light',label:'Лёгкая',emoji:'🚶'},
{value:'moderate',label:'2-3/нед',emoji:'🏃'},
{value:'active',label:'4+/нед',emoji:'🏋️'}
]},
{id:'stressLevel',question:'Уровень стресса?',type:'options',options:[
{value:'low',label:'Низкий',emoji:'😌'},
{value:'medium',label:'Средний',emoji:'😐'},
{value:'high',label:'Высокий',emoji:'😰'},
{value:'chronic',label:'Хронический',emoji:'🥵'}
]},
{id:'screenTime',question:'Сколько экрана?',type:'options',options:[
{value:'<2',label:'<2 ч',emoji:'🌿'},
{value:'2-4',label:'2-4 ч',emoji:'📱'},
{value:'4-6',label:'4-6 ч',emoji:'😬'},
{value:'6+',label:'6+ ч',emoji:'🧟'}
]},
{id:'timeAvailable',question:'Сколько времени в день?',type:'options',options:[
{value:'15min',label:'15 мин',emoji:'⏱'},
{value:'30min',label:'30 мин',emoji:'🕐'},
{value:'1h',label:'1 час',emoji:'⏰'},
{value:'2h+',label:'2+ часа',emoji:'⏳'}
]}
];

/* ============ PERSONAS ============ */
var PERSONAS={
coach:{name:'Коуч',emoji:'💬',prompt:'Ты — AI-Коуч с 80-летним опытом. GROW, SMART, Deep Work, Икигай, Кайдзен. Конкретные шаги. 150-220 слов.'},
psych:{name:'Психолог',emoji:'🧠',prompt:'Ты — AI-Психолог. КПТ, ACT, DBT. НЕ ставь диагнозы! При кризисе: 8-800-2000-122. 150-220 слов.'},
doctor:{name:'Врач',emoji:'⚕️',prompt:'Ты — AI-Врач. НЕ ставь диагнозы. ВСЕГДА дисклеймер. Острые — 103/112.'},
vision:{name:'Офтальмолог',emoji:'👁',prompt:'Ты — AI-Офтальмолог. Бейтс, 20-20-20, пальминг. НЕ ставь диагнозы.'},
finance:{name:'Финансист',emoji:'💰',prompt:'Ты — AI-Финансовый консультант. Бюджет, инвестиции, FIRE. 150-200 слов.'},
nutrition:{name:'Нутрициолог',emoji:'🥗',prompt:'Ты — AI-Нутрициолог. Питание, БЖУ. НЕ назначай дозировки.'},
fitness:{name:'Тренер',emoji:'💪',prompt:'Ты — AI-Фитнес-тренер. Программы, упражнения, восстановление.'},
it:{name:'IT-эксперт',emoji:'💻',prompt:'Ты — AI-IT-эксперт. Программирование, DevOps. Даю код.'},
lawyer:{name:'Юрист',emoji:'⚖️',prompt:'Ты — AI-Юрист. НЕ заменяю практикующего.'},
teacher:{name:'Учитель',emoji:'📚',prompt:'Ты — AI-Учитель. Объясняю просто с примерами.'}
};

/* ============ TABS ============ */
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
{id:'spheres',emoji:'🎯',label:'Сферы',target:'spheres'},
{id:'projects',emoji:'📁',label:'Проекты',target:'projects'},
{id:'coach',emoji:'💬',label:'Коуч',target:'coach'},
{id:'schedule',emoji:'📅',label:'Расписание',target:'schedule'},
{id:'focus',emoji:'⏱',label:'Фокус',target:'focus'},
{id:'levels',emoji:'🌱',label:'Уровни',target:'levels'},
{id:'english',emoji:'🇬🇧',label:'English',target:'english'},
{id:'skills',emoji:'💎',label:'Навыки',target:'skills'},
{id:'habits',emoji:'🔄',label:'Привычки',target:'habitList'},
{id:'brain',emoji:'🧠',label:'Ум',target:'brain'}
],
vision:[
{id:'overview',emoji:'👁',label:'Обзор',target:'vision'},
{id:'exercises',emoji:'🤸',label:'Упражнения',target:'vision60'},
{id:'tracker',emoji:'📊',label:'Трекер',target:'visiontrack'}
],
tasks:[
{id:'all',emoji:'📋',label:'Все',target:null},
{id:'pending',emoji:'⏳',label:'Активные',target:null,filter:'pending'},
{id:'completed',emoji:'✅',label:'Готовые',target:null,filter:'completed'},
{id:'matrix',emoji:'🔢',label:'Матрица',target:'matrix'}
]
};

console.log('[CONTENT 1/6 ✅] THEMES='+THEMES.length+' DOMAINS='+DOMAINS.length+' WISDOMS='+DAILY_WISDOMS.length+' CHALLENGES='+DAILY_CHALLENGES.length);
/* ============================================================
   LIFE OS — CONTENT.js v44 — ПОЛНЫЙ
   ЧАСТЬ 2/6: Обучение (5 уровней), Привычки-шаблоны, English 125,
   Навыки, Этикет, Гормоны, Богатство
   ============================================================ */

/* ============ LEARNING LEVELS (5 уровней × 3 модуля × 3 урока = 45 уроков) ============ */
var LEARNING_LEVELS=[
{id:'lvl1',num:1,emoji:'🌱',title:'Основы',subtitle:'Старт',desc:'База: здоровье, мышление, цели',
modules:[
{id:'m1_1',emoji:'💪',title:'Здоровье',desc:'Сон, вода, движение',
lessons:[
{title:'Сон',theory:'**7-9 часов.** Медленный сон = факты, REM = эмоции. Ложись до 23:00 — максимальный мелатонин.',practice:'Ляг на 30 минут раньше сегодня.'},
{title:'Вода',theory:'**30 мл на кг веса.** Утром 500 мл — разгоняет метаболизм на 30% на час.',practice:'Выпей 500 мл утром сразу после пробуждения.'},
{title:'Движение',theory:'**150 мин кардио + 2 силовые в неделю.** Это минимум ВОЗ для здоровья.',practice:'Сделай 20-минутную прогулку.'}
]},
{id:'m1_2',emoji:'🧠',title:'Мышление',desc:'База продуктивности',
lessons:[
{title:'Продуктивность',theory:'**Результат, не занятость.** 3 главные задачи важнее 20 мелких.',practice:'Утром выбери 3 главные задачи.'},
{title:'Приоритеты',theory:'**Матрица Эйзенхауэра.** Q1: важно+срочно → делай. Q2: важно+несрочно → планируй. Q3: срочно+неважно → делегируй. Q4: → удали.',practice:'Разбери 5 задач по матрице.'},
{title:'Привычки',theory:'**Cue→Craving→Response→Reward.** 66 дней до автоматизма. Среда важнее воли.',practice:'Внедри 1 привычку на 22 дня.'}
]},
{id:'m1_3',emoji:'🎯',title:'Цели',desc:'Постановка',
lessons:[
{title:'SMART',theory:'**Specific, Measurable, Achievable, Relevant, Time.** Конкретика, измеримость, достижимость, релевантность, срок.',practice:'Поставь 1 SMART-цель.'},
{title:'OKR',theory:'**Objectives + Key Results.** Качественная цель + 3-5 измеримых ключевых результатов.',practice:'Составь 1 OKR на месяц.'},
{title:'Планирование',theory:'**5 лет → 1 год → месяц → неделя → день.** Декомпозиция до конкретного шага.',practice:'Напиши 5-летний план.'}
]}
]},
{id:'lvl2',num:2,emoji:'⚡',title:'Практика',subtitle:'Углубление',desc:'Deep Work, EQ, финансы',
modules:[
{id:'m2_1',emoji:'🎯',title:'Deep Work',desc:'Глубокая работа',
lessons:[
{title:'Deep Work',theory:'**90 мин ×3-4 раза в день.** Cal Newport: ×3 продуктивности. Одна задача без отвлечений.',practice:'Сделай 1 блок 90 минут.'},
{title:'Pomodoro',theory:'**25/5 ×4.** Работа 25 минут, отдых 5. После 4 — большой перерыв 15-30 мин.',practice:'Сделай 4 помидора.'},
{title:'Time-blocking',theory:'**Каждое дело — свой слот.** Утром распредели дела по времени.',practice:'Распиши 3 задачи в календарь.'}
]},
{id:'m2_2',emoji:'❤️',title:'EQ',desc:'Эмоции',
lessons:[
{title:'5 компонентов',theory:'**Гоулман:** самосознание, саморегуляция, мотивация, эмпатия, социальные навыки.',practice:'Веди дневник эмоций 3 дня.'},
{title:'Пауза 6 сек',theory:'**Между стимулом и реакцией — пространство.** Viktor Frankl: 6 секунд = свобода выбора.',practice:'Попробуй 3 раза за день.'},
{title:'Эмпатия',theory:'**Слушай, не советуй.** Люди хотят быть услышанными, а не получить решение.',practice:'Проведи 1 разговор с активным слушанием.'}
]},
{id:'m2_3',emoji:'💰',title:'Финансы',desc:'База',
lessons:[
{title:'50/30/20',theory:'**50% нужды, 30% желания, 20% сбережения.** Простая формула бюджета.',practice:'Разбей свой доход по этой схеме.'},
{title:'Подушка',theory:'**3-6 месяцев расходов.** На отдельном счёте. Не трогать.',practice:'Открой отдельный счёт.'},
{title:'Инвестиции',theory:'**Индексные фонды, DCA.** Bogle: 8% годовых на длинной дистанции.',practice:'Изучи 3 индексных фонда.'}
]}
]},
{id:'lvl3',num:3,emoji:'💎',title:'Мастерство',subtitle:'Продвинутый',desc:'Нейро, лидерство, стратегия',
modules:[
{id:'m3_1',emoji:'🔬',title:'Нейро',desc:'Мозг',
lessons:[
{title:'Нейропластичность',theory:'**Мозг меняется всю жизнь.** Новые связи формируются через повторение и новизну.',practice:'Практикуй новый навык 30 дней.'},
{title:'Дофамин',theory:'**Предвкушение, не удовольствие.** Не соцсети, а достижения и цели.',practice:'1 день без соцсетей.'},
{title:'Сон и память',theory:'**Консолидация в глубоком сне.** Без сна память не формируется.',practice:'Выучи 10 фактов перед сном.'}
]},
{id:'m3_2',emoji:'👑',title:'Лидерство',desc:'Люди',
lessons:[
{title:'Level 5',theory:'**Скромность + воля.** Jim Collins: лучшие лидеры — скромные и решительные.',practice:'Развивай 1 качество лидера.'},
{title:'Делегирование',theory:'**Не делай сам всё.** Делегируй задачи — освобождай время для главного.',practice:'Делегируй 3 задачи.'},
{title:'SBI-фидбэк',theory:'**Situation-Behavior-Impact.** Конкретика: ситуация, поведение, влияние.',practice:'Дай 1 SBI-фидбэк.'}
]},
{id:'m3_3',emoji:'🌐',title:'Стратегия',desc:'Долгосрочно',
lessons:[
{title:'Второй порядок',theory:'**А что потом? ×3.** Думай на 3 шага вперёд.',practice:'Проанализируй 3 решения.'},
{title:'Инверсия',theory:'**Что мешает успеху?** Думай от обратного.',practice:'Запиши 3 цели через инверсию.'},
{title:'First principles',theory:'**Разбей до основы.** Не копируй — разбирай.',practice:'Разбери 1 проблему с нуля.'}
]}
]},
{id:'lvl4',num:4,emoji:'🏆',title:'Мастер',subtitle:'Эксперт',desc:'Менторство, системы, смысл',
modules:[
{id:'m4_1',emoji:'🎓',title:'Менторство',desc:'Учить',
lessons:[
{title:'Ментор',theory:'**Вопросы > советы.** Ментор задаёт вопросы, а не даёт ответы.',practice:'Проведи 1 менти-сессию.'},
{title:'GROW',theory:'**Goal-Reality-Options-Will.** Модель коучинга.',practice:'Проведи 1 GROW-сессию.'},
{title:'Учить = учиться',theory:'**Feynman: объясни — пойми.** Обучение других = лучшее обучение.',practice:'Объясни 3 темы.'}
]},
{id:'m4_2',emoji:'🌍',title:'Системы',desc:'Целое',
lessons:[
{title:'Системы vs цели',theory:'**Система важнее цели.** Цель — направление, система — путь.',practice:'Создай 3 системы.'},
{title:'Обратные связи',theory:'**Положительные и отрицательные.** В системе важны все связи.',practice:'Найди 3 петли в своей жизни.'},
{title:'Точки воздействия',theory:'**Рычаг.** Маленькое усилие — большой эффект.',practice:'Найди 1 рычаг в жизни.'}
]},
{id:'m4_3',emoji:'🕊',title:'Смысл',desc:'Зачем',
lessons:[
{title:'Икигай',theory:'**4 сферы:** что люблю + что умею + что нужно миру + за что платят.',practice:'Напиши 4 списка.'},
{title:'Логотерапия',theory:'**3 источника смысла:** творчество, переживание, отношение к страданию. Frankl.',practice:'Найди свой источник.'},
{title:'Наследие',theory:'**Что ты оставишь?** Эпитафия — взгляд из будущего.',practice:'Напиши эпитафию.'}
]}
]},
{id:'lvl5',num:5,emoji:'🌟',title:'Легенда',subtitle:'Мастер',desc:'Мудрость, интеграция, передача',
modules:[
{id:'m5_1',emoji:'🧘',title:'Мудрость',desc:'Глубина',
lessons:[
{title:'Стоицизм',theory:'**Дихотомия контроля.** Что в моей власти? Что нет?',practice:'Вечером разбери день.'},
{title:'Memento Mori',theory:'**Помни о смерти.** Что бы ты сделал, если бы остался год?',practice:'Напиши эпитафию.'},
{title:'Присутствие',theory:'**Здесь и сейчас.** Экхарт Толле: сила момента.',practice:'10 минут осознанности.'}
]},
{id:'m5_2',emoji:'💫',title:'Интеграция',desc:'Всё',
lessons:[
{title:'10 доменов',theory:'**Баланс всех сфер.** Здоровье, ум, эмоции, дух, финансы, карьера, отношения, среда, восстановление, цифра.',practice:'Оцени каждый домен.'},
{title:'Свой путь',theory:'**Уникальность.** Не копируй — интегрируй лучшее под себя.',practice:'Опиши свой путь.'},
{title:'Передача',theory:'**Учи других.** Опыт ×2 когда передаёшь.',practice:'Напиши 1 гайд.'}
]},
{id:'m5_3',emoji:'🚀',title:'Будущее',desc:'Дальше',
lessons:[
{title:'10 лет',theory:'**Куда через 10 лет?** Видение = компас.',practice:'Опиши себя через 10 лет.'},
{title:'Наследие',theory:'**Что после тебя?** Проекты, люди, идеи.',practice:'3 пункта наследия.'},
{title:'Продолжение',theory:'**Путь не заканчивается.** Жизнь = непрерывный рост.',practice:'Напиши план на год.'}
]}
]}
];

/* ============ HABIT CATEGORIES ============ */
var HABIT_CATEGORIES=[
{id:'health',emoji:'💪',name:'Здоровье',color:'#3ddc97',desc:'Тело, сон, питание'},
{id:'mind',emoji:'🧠',name:'Разум',color:'#4dd4ff',desc:'Мышление, фокус'},
{id:'emotion',emoji:'❤️',name:'Эмоции',color:'#ff6b6b',desc:'Стресс, настроение'},
{id:'productivity',emoji:'⚡',name:'Продуктивность',color:'#ffa940',desc:'Время, задачи'},
{id:'finance',emoji:'💰',name:'Финансы',color:'#ffcc4d',desc:'Бюджет, накопления'},
{id:'social',emoji:'👥',name:'Социальное',color:'#c4b5fd',desc:'Семья, друзья'},
{id:'spiritual',emoji:'🕊',name:'Духовное',color:'#b394ff',desc:'Смысл, практики'},
{id:'digital',emoji:'📱',name:'Цифровое',color:'#ff88cc',desc:'Экран, детокс'},
{id:'home',emoji:'🏠',name:'Быт',color:'#a4e7ff',desc:'Порядок, среда'},
{id:'creative',emoji:'🎨',name:'Творчество',color:'#ff7ba9',desc:'Идеи, искусство'}
];

/* ============ HABIT TEMPLATES (200+) ============ */
var HABIT_TEMPLATES=[
/* Здоровье (30) */
{id:'h_sleep_7',cat:'health',emoji:'😴',title:'Сон 7-9 часов',desc:'Ложиться и вставать в одно время',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'night',microGoals:['Ложиться до 23:00','Вставать до 7:00','Без телефона за час до сна'],autoTrack:true,integration:'sleep'},
{id:'h_water_8',cat:'health',emoji:'💧',title:'8 стаканов воды',desc:'Пить равномерно в течение дня',defaultType:'count',defaultTarget:8,defaultDuration:66,defaultTime:'day',microGoals:['Стакан утром','Перед едой','После тренировки'],autoTrack:true,integration:'water'},
{id:'h_walk_30',cat:'health',emoji:'🚶',title:'Прогулка 30 минут',desc:'Ежедневная ходьба',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['10 мин','20 мин','30 мин'],autoTrack:false,integration:null},
{id:'h_cardio_150',cat:'health',emoji:'🏃',title:'Кардио 150 мин/нед',desc:'Бег, велосипед, плавание',defaultType:'weekly',defaultTarget:150,defaultDuration:66,defaultTime:null,microGoals:['30 мин ×3','45 мин ×3','60 мин ×2'],autoTrack:true,integration:'workout'},
{id:'h_strength_3',cat:'health',emoji:'🏋️',title:'Силовая 3×/нед',desc:'Присед, жим, тяга',defaultType:'weekly',defaultTarget:3,defaultDuration:66,defaultTime:null,microGoals:['1 тренировка','2','3'],autoTrack:true,integration:'workout'},
{id:'h_stretch_10',cat:'health',emoji:'🧘',title:'Растяжка 10 минут',desc:'Утром или после тренировки',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'morning',microGoals:['5 мин','10 мин','15 мин'],autoTrack:false,integration:null},
{id:'h_veg_500',cat:'health',emoji:'🥗',title:'500 г овощей/фруктов',desc:'Пять порций в день',defaultType:'count',defaultTarget:5,defaultDuration:66,defaultTime:'day',microGoals:['1 порция','3','5'],autoTrack:false,integration:null},
{id:'h_protein',cat:'health',emoji:'🍗',title:'Белок 1.6 г/кг',desc:'Мясо, рыба, яйца, бобовые',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['Завтрак с белком','Обед','Ужин'],autoTrack:false,integration:null},
{id:'h_no_sugar',cat:'health',emoji:'🚫',title:'Без сахара',desc:'Никаких сладостей и напитков',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1 день','3 дня','7 дней'],autoTrack:false,integration:null},
{id:'h_no_fastfood',cat:'health',emoji:'🍔',title:'Без фастфуда',desc:'Никакой быстрой еды',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1 день','3 дня','7 дней'],autoTrack:false,integration:null},
{id:'h_cold_shower',cat:'health',emoji:'❄️',title:'Холодный душ',desc:'2 минуты холодной воды',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'morning',microGoals:['30 сек','1 мин','2 мин'],autoTrack:false,integration:null},
{id:'h_brush_2',cat:'health',emoji:'🦷',title:'Чистить зубы 2×/день',desc:'Утром и вечером',defaultType:'count',defaultTarget:2,defaultDuration:66,defaultTime:null,microGoals:['1 раз','2 раза'],autoTrack:false,integration:null},
{id:'h_floss',cat:'health',emoji:'🧵',title:'Зубная нить',desc:'Раз в день',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'evening',microGoals:['1 день','7','30'],autoTrack:false,integration:null},
{id:'h_sunscreen',cat:'health',emoji:'☀️',title:'Солнцезащитный крем',desc:'SPF 30+ перед выходом',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'morning',microGoals:['Лицо','Шея','Руки'],autoTrack:false,integration:null},
{id:'h_posture',cat:'health',emoji:'🧍',title:'Осанка',desc:'Следить за спиной весь день',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['Утро','День','Вечер'],autoTrack:false,integration:null},
{id:'h_eye_gym',cat:'health',emoji:'👁',title:'Гимнастика для глаз',desc:'5 упражнений утром и вечером',defaultType:'count',defaultTarget:2,defaultDuration:66,defaultTime:'day',microGoals:['Утром','Вечером'],autoTrack:false,integration:null},
{id:'h_20_20_20',cat:'health',emoji:'👁',title:'Правило 20-20-20',desc:'Каждые 20 мин — 20 сек на 6 м',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['Утро','День','Вечер'],autoTrack:false,integration:null},
{id:'h_no_phone_bed',cat:'health',emoji:'📵',title:'Телефон вне спальни',desc:'Зарядка в другой комнате',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'night',microGoals:['1 ночь','7','30'],autoTrack:false,integration:'screen'},
{id:'h_sleep_early',cat:'health',emoji:'🌙',title:'Сон до 23:00',desc:'Ложиться до 23:00',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'night',microGoals:['1 день','7','30'],autoTrack:true,integration:'sleep'},
{id:'h_morning_light',cat:'health',emoji:'🌅',title:'Утренний свет',desc:'10 минут солнца утром',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'morning',microGoals:['5 мин','10','15'],autoTrack:false,integration:null},
{id:'h_no_coffee_after',cat:'health',emoji:'☕',title:'Кофе до 14:00',desc:'Никакого кофеина после обеда',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1 день','7','30'],autoTrack:false,integration:null},
{id:'h_breakfast',cat:'health',emoji:'🍳',title:'Завтрак',desc:'Полноценный завтрак',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'morning',microGoals:['1 день','7','30'],autoTrack:false,integration:null},
{id:'h_no_late_eat',cat:'health',emoji:'🌙',title:'Не есть после 20:00',desc:'Последний приём до 20:00',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'evening',microGoals:['1 день','7','30'],autoTrack:false,integration:null},
{id:'h_vitamins',cat:'health',emoji:'💊',title:'Витамины',desc:'D3, омега-3, магний',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'morning',microGoals:['1 день','7','30'],autoTrack:false,integration:null},
{id:'h_massage',cat:'health',emoji:'💆',title:'Массаж/самомассаж',desc:'10 минут для тела',defaultType:'weekly',defaultTarget:2,defaultDuration:66,defaultTime:'evening',microGoals:['1 раз','2','3'],autoTrack:false,integration:null},
{id:'h_sauna',cat:'health',emoji:'🧖',title:'Сауна/баня',desc:'Раз в неделю',defaultType:'weekly',defaultTarget:1,defaultDuration:66,defaultTime:'evening',microGoals:['1 раз/нед','2'],autoTrack:false,integration:null},
{id:'h_swim',cat:'health',emoji:'🏊',title:'Плавание',desc:'Раз в неделю',defaultType:'weekly',defaultTarget:1,defaultDuration:66,defaultTime:null,microGoals:['1 раз/нед','2'],autoTrack:false,integration:null},
{id:'h_bike',cat:'health',emoji:'🚴',title:'Велосипед',desc:'Прогулки на велосипеде',defaultType:'weekly',defaultTarget:2,defaultDuration:66,defaultTime:null,microGoals:['1','2','3'],autoTrack:false,integration:null},
{id:'h_yoga',cat:'health',emoji:'🧘',title:'Йога',desc:'Утром или вечером',defaultType:'weekly',defaultTarget:3,defaultDuration:66,defaultTime:null,microGoals:['1','3','5'],autoTrack:false,integration:null},
{id:'h_posture_check',cat:'health',emoji:'🧍',title:'Проверка осанки',desc:'Каждый час',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['Утро','День','Вечер'],autoTrack:false,integration:null},

/* Разум (25) */
{id:'h_read_20',cat:'mind',emoji:'📖',title:'Чтение 20 минут',desc:'Книга, статья, учебник',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'evening',microGoals:['10 мин','20','30'],autoTrack:false,integration:null},
{id:'h_meditation_10',cat:'mind',emoji:'🧘',title:'Медитация 10 минут',desc:'Утром или перед сном',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'morning',microGoals:['5 мин','10','15'],autoTrack:false,integration:null},
{id:'h_journal',cat:'mind',emoji:'📓',title:'Дневник вечером',desc:'3 победы + 1 урок',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'evening',microGoals:['1 запись','7','30'],autoTrack:false,integration:null},
{id:'h_gratitude_3',cat:'mind',emoji:'🙏',title:'3 благодарности',desc:'Утром или вечером',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'evening',microGoals:['1','2','3'],autoTrack:false,integration:null},
{id:'h_deep_work_90',cat:'mind',emoji:'🎯',title:'Deep Work 90 минут',desc:'Одна задача без отвлечений',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'morning',microGoals:['30 мин','60','90'],autoTrack:false,integration:null},
{id:'h_learn_lang',cat:'mind',emoji:'🇬🇧',title:'Английский 15 минут',desc:'Anki, Duolingo, урок',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['5 мин','15','30'],autoTrack:false,integration:null},
{id:'h_puzzle',cat:'mind',emoji:'🧩',title:'Головоломка',desc:'Судоку, кроссворд, N-back',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1','2','3'],autoTrack:false,integration:null},
{id:'h_speed_read',cat:'mind',emoji:'📚',title:'Скорочтение 15 мин',desc:'Тренировка скорости',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['5 мин','10','15'],autoTrack:false,integration:null},
{id:'h_memory',cat:'mind',emoji:'🧠',title:'Тренировка памяти',desc:'Дворец памяти, Anki',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['5 мин','10','15'],autoTrack:false,integration:null},
{id:'h_logic',cat:'mind',emoji:'🎲',title:'Логика',desc:'Задачи, шахматы',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1 задача','3','5'],autoTrack:false,integration:null},
{id:'h_focus_25',cat:'mind',emoji:'🍅',title:'Помодоро 4×25',desc:'4 помидора в день',defaultType:'count',defaultTarget:4,defaultDuration:66,defaultTime:'day',microGoals:['1','2','4'],autoTrack:false,integration:null},
{id:'h_note_ideas',cat:'mind',emoji:'💡',title:'Записывать идеи',desc:'Все идеи в заметки',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1 идея','3','5'],autoTrack:false,integration:null},
{id:'h_review_week',cat:'mind',emoji:'📊',title:'Ревью недели',desc:'Воскресенье, 30 мин',defaultType:'weekly',defaultTarget:1,defaultDuration:66,defaultTime:'evening',microGoals:['Ревью','План','Цели'],autoTrack:false,integration:null},
{id:'h_review_month',cat:'mind',emoji:'📈',title:'Ревью месяца',desc:'1-е число',defaultType:'custom',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['Итоги','Уроки','План'],autoTrack:false,integration:null},
{id:'h_plan_day',cat:'mind',emoji:'📝',title:'Планировать день',desc:'Утром 5 минут',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'morning',microGoals:['3 задачи','5','7'],autoTrack:false,integration:null},
{id:'h_no_news',cat:'mind',emoji:'📰',title:'Без новостей',desc:'Не читать новости',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1 день','7','30'],autoTrack:false,integration:null},
{id:'h_chess',cat:'mind',emoji:'♟',title:'Шахматы',desc:'1 партия в день',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1','3','5'],autoTrack:false,integration:null},
{id:'h_typing',cat:'mind',emoji:'⌨️',title:'Слепая печать',desc:'10 минут в день',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['5 мин','10','15'],autoTrack:false,integration:null},
{id:'h_new_word',cat:'mind',emoji:'🔤',title:'10 новых слов',desc:'Иностранные слова',defaultType:'count',defaultTarget:10,defaultDuration:66,defaultTime:'day',microGoals:['3','5','10'],autoTrack:false,integration:null},
{id:'h_course',cat:'mind',emoji:'🎓',title:'Онлайн-курс',desc:'30 минут в день',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['15 мин','30','45'],autoTrack:false,integration:null},
{id:'h_podcast',cat:'mind',emoji:'🎧',title:'Подкаст',desc:'1 эпизод в день',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1','2'],autoTrack:false,integration:null},
{id:'h_documentary',cat:'mind',emoji:'🎬',title:'Документальный фильм',desc:'2 в неделю',defaultType:'weekly',defaultTarget:2,defaultDuration:66,defaultTime:'evening',microGoals:['1','2','3'],autoTrack:false,integration:null},
{id:'h_mindmap',cat:'mind',emoji:'🗺',title:'Ментальная карта',desc:'1 в неделю',defaultType:'weekly',defaultTarget:1,defaultDuration:66,defaultTime:'day',microGoals:['1 карта','3','5'],autoTrack:false,integration:null},
{id:'h_solve_1',cat:'mind',emoji:'🧮',title:'Решить 1 задачу',desc:'Математика, физика, код',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1','3','5'],autoTrack:false,integration:null},
{id:'h_write_500',cat:'mind',emoji:'✍️',title:'Писать 500 слов',desc:'Блог, дневник, книга',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['100 слов','300','500'],autoTrack:false,integration:null},

/* Эмоции (20) */
{id:'h_mood_log',cat:'emotion',emoji:'💭',title:'Дневник настроения',desc:'Оценить 1-10',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'evening',microGoals:['Утро','День','Вечер'],autoTrack:true,integration:'mood'},
{id:'h_no_shout',cat:'emotion',emoji:'🤫',title:'Не повышать голос',desc:'Спокойно весь день',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1 день','7','30'],autoTrack:false,integration:null},
{id:'h_pause_6',cat:'emotion',emoji:'⏸',title:'Пауза 6 секунд',desc:'Перед реакцией',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['3','5','10'],autoTrack:false,integration:null},
{id:'h_compliment',cat:'emotion',emoji:'💐',title:'Комплимент',desc:'1 в день близкому',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1','2','3'],autoTrack:false,integration:null},
{id:'h_hug',cat:'emotion',emoji:'🤗',title:'Объятия 20 секунд',desc:'С близким',defaultType:'count',defaultTarget:3,defaultDuration:66,defaultTime:'day',microGoals:['1','3','5'],autoTrack:false,integration:null},
{id:'h_laugh',cat:'emotion',emoji:'😂',title:'Смеяться',desc:'10 минут юмора',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1 раз','3','5'],autoTrack:false,integration:null},
{id:'h_cry_ok',cat:'emotion',emoji:'💧',title:'Разрешить эмоции',desc:'Не подавлять',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['Заметить','Прожить','Отпустить'],autoTrack:false,integration:null},
{id:'h_therapy',cat:'emotion',emoji:'🛋',title:'Терапия',desc:'1 сессия в неделю',defaultType:'weekly',defaultTarget:1,defaultDuration:66,defaultTime:'day',microGoals:['1 раз/нед','2'],autoTrack:false,integration:null},
{id:'h_no_compare',cat:'emotion',emoji:'🚫',title:'Не сравнивать себя',desc:'Только с собой вчерашним',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['Утро','День','Вечер'],autoTrack:false,integration:null},
{id:'h_forgive',cat:'emotion',emoji:'🕊',title:'Прощать',desc:'Отпускать обиды',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'evening',microGoals:['1 раз','3','7'],autoTrack:false,integration:null},
{id:'h_accept',cat:'emotion',emoji:'🧘',title:'Принимать',desc:'Что не изменить',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1','3','5'],autoTrack:false,integration:null},
{id:'h_self_kind',cat:'emotion',emoji:'💖',title:'Самосострадание',desc:'Говорить себе доброе',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1','3','5'],autoTrack:false,integration:null},
{id:'h_no_drama',cat:'emotion',emoji:'🎭',title:'Без драмы',desc:'Не раздувать',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1 день','7','30'],autoTrack:false,integration:null},
{id:'h_breath_478',cat:'emotion',emoji:'🌬',title:'Дыхание 4-7-8',desc:'3 цикла при стрессе',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1 цикл','3','5'],autoTrack:false,integration:null},
{id:'h_body_scan',cat:'emotion',emoji:'🧘',title:'Сканирование тела',desc:'10 минут',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'evening',microGoals:['5 мин','10','15'],autoTrack:false,integration:null},
{id:'h_nature_1h',cat:'emotion',emoji:'🌳',title:'Природа 1 час',desc:'Парк, лес',defaultType:'weekly',defaultTarget:3,defaultDuration:66,defaultTime:'day',microGoals:['1','3','5'],autoTrack:false,integration:null},
{id:'h_pet',cat:'emotion',emoji:'🐾',title:'Время с питомцем',desc:'15 минут',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['5 мин','15','30'],autoTrack:false,integration:null},
{id:'h_music_calm',cat:'emotion',emoji:'🎵',title:'Спокойная музыка',desc:'10 минут',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'evening',microGoals:['5','10','15'],autoTrack:false,integration:null},
{id:'h_warm_bath',cat:'emotion',emoji:'🛁',title:'Тёплая ванна',desc:'2 раза в неделю',defaultType:'weekly',defaultTarget:2,defaultDuration:66,defaultTime:'evening',microGoals:['1','2','3'],autoTrack:false,integration:null},
{id:'h_aroma',cat:'emotion',emoji:'🕯',title:'Ароматерапия',desc:'Свеча или диффузор',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'evening',microGoals:['1 раз','2'],autoTrack:false,integration:null},

/* Продуктивность (25) */
{id:'h_morning_ritual',cat:'productivity',emoji:'🌅',title:'Утренний ритуал',desc:'30 минут для себя',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'morning',microGoals:['10','20','30'],autoTrack:false,integration:null},
{id:'h_no_phone_morning',cat:'productivity',emoji:'📵',title:'Утро без телефона',desc:'Первые 30 минут',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'morning',microGoals:['10','20','30'],autoTrack:false,integration:'screen'},
{id:'h_3_tasks',cat:'productivity',emoji:'✅',title:'3 главные задачи',desc:'Утром выбрать 3',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'morning',microGoals:['1','2','3'],autoTrack:false,integration:null},
{id:'h_eat_frog',cat:'productivity',emoji:'🐸',title:'Съесть лягушку',desc:'Самое сложное первым',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'morning',microGoals:['1','3','5'],autoTrack:false,integration:null},
{id:'h_time_block',cat:'productivity',emoji:'📅',title:'Time-blocking',desc:'Планировать каждый час',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'morning',microGoals:['3 блока','5','7'],autoTrack:false,integration:null},
{id:'h_no_multitask',cat:'productivity',emoji:'🎯',title:'Без многозадачности',desc:'Одно дело за раз',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1','3','5'],autoTrack:false,integration:null},
{id:'h_inbox_zero',cat:'productivity',emoji:'📧',title:'Inbox Zero',desc:'Разбирать входящие',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'evening',microGoals:['Утро','День','Вечер'],autoTrack:false,integration:null},
{id:'h_no_procrast',cat:'productivity',emoji:'⏳',title:'Не откладывать',desc:'2-минутное правило',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1','3','5'],autoTrack:false,integration:null},
{id:'h_review_day',cat:'productivity',emoji:'📊',title:'Ревью дня',desc:'5 минут вечером',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'evening',microGoals:['3 победы','1 урок','1 цель'],autoTrack:false,integration:null},
{id:'h_no_social_work',cat:'productivity',emoji:'📵',title:'Без соцсетей на работе',desc:'Только по делу',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1 час','3','весь день'],autoTrack:false,integration:'screen'},
{id:'h_2min_rule',cat:'productivity',emoji:'⚡',title:'2-минутное правило',desc:'Сразу, если <2 мин',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['3','5','10'],autoTrack:false,integration:null},
{id:'h_single_tab',cat:'productivity',emoji:'🖥',title:'Одна вкладка',desc:'Не 100 вкладок',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1 час','3','весь день'],autoTrack:false,integration:null},
{id:'h_daily_goal',cat:'productivity',emoji:'🎯',title:'1 главная цель дня',desc:'Фокус на одном',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'morning',microGoals:['1','3','5'],autoTrack:false,integration:null},
{id:'h_clear_desk',cat:'productivity',emoji:'🧹',title:'Убирать стол',desc:'Перед сном',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'evening',microGoals:['1 раз','2','3'],autoTrack:false,integration:null},
{id:'h_no_email_morning',cat:'productivity',emoji:'📧',title:'Без почты утром',desc:'До 10:00',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'morning',microGoals:['1 день','7','30'],autoTrack:false,integration:null},
{id:'h_focus_music',cat:'productivity',emoji:'🎧',title:'Музыка для фокуса',desc:'Lo-fi, классика',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['30 мин','60','90'],autoTrack:false,integration:null},
{id:'h_say_no',cat:'productivity',emoji:'🚫',title:'Говорить "нет"',desc:'Без вины',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1','3','5'],autoTrack:false,integration:null},
{id:'h_delegate',cat:'productivity',emoji:'🤝',title:'Делегировать',desc:'1 задача в день',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1','2','3'],autoTrack:false,integration:null},
{id:'h_no_meeting',cat:'productivity',emoji:'📵',title:'Без встреч',desc:'1 день без созвонов',defaultType:'weekly',defaultTarget:1,defaultDuration:66,defaultTime:'day',microGoals:['1 день/нед','2'],autoTrack:false,integration:null},
{id:'h_ship_it',cat:'productivity',emoji:'🚀',title:'Завершать',desc:'Доводить до конца',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1','3','5'],autoTrack:false,integration:null},
{id:'h_no_perfect',cat:'productivity',emoji:'✨',title:'Не идеально',desc:'Сделано > идеально',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1','3','5'],autoTrack:false,integration:null},
{id:'h_5min_start',cat:'productivity',emoji:'▶️',title:'Начать с 5 минут',desc:'Только 5 минут',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1 раз','3','5'],autoTrack:false,integration:null},
{id:'h_evening_ritual',cat:'productivity',emoji:'🌙',title:'Вечерний ритуал',desc:'30 минут перед сном',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'evening',microGoals:['10','20','30'],autoTrack:false,integration:null},
{id:'h_no_work_weekend',cat:'productivity',emoji:'🏖',title:'Без работы в выходные',desc:'Только отдых',defaultType:'weekly',defaultTarget:2,defaultDuration:66,defaultTime:null,microGoals:['1 день','2'],autoTrack:false,integration:null},
{id:'h_weekly_plan',cat:'productivity',emoji:'📋',title:'План на неделю',desc:'В воскресенье',defaultType:'weekly',defaultTarget:1,defaultDuration:66,defaultTime:'evening',microGoals:['1','2'],autoTrack:false,integration:null},

/* Финансы (15) */
{id:'h_track_spend',cat:'finance',emoji:'💰',title:'Учёт расходов',desc:'Каждая трата',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'evening',microGoals:['1','3','5'],autoTrack:false,integration:null},
{id:'h_save_20',cat:'finance',emoji:'🏦',title:'Откладывать 20%',desc:'С каждого дохода',defaultType:'custom',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['10%','20%','30%'],autoTrack:false,integration:null},
{id:'h_no_impulse',cat:'finance',emoji:'🚫',title:'Без импульсивных покупок',desc:'Не покупать спонтанно',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1 день','7','30'],autoTrack:false,integration:null},
{id:'h_review_budget',cat:'finance',emoji:'📊',title:'Ревью бюджета',desc:'Раз в неделю',defaultType:'weekly',defaultTarget:1,defaultDuration:66,defaultTime:'evening',microGoals:['1 раз/нед','2'],autoTrack:false,integration:null},
{id:'h_no_coffee_out',cat:'finance',emoji:'☕',title:'Кофе дома',desc:'Не покупать в кофейне',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'morning',microGoals:['1 день','7','30'],autoTrack:false,integration:null},
{id:'h_no_taxi',cat:'finance',emoji:'🚕',title:'Без такси',desc:'Транспорт или ходьба',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1 день','7','30'],autoTrack:false,integration:null},
{id:'h_cook_home',cat:'finance',emoji:'🍳',title:'Готовить дома',desc:'Без доставки',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1','2','3'],autoTrack:false,integration:null},
{id:'h_no_shopping',cat:'finance',emoji:'🛍',title:'Без шопинга',desc:'Не покупать одежду',defaultType:'weekly',defaultTarget:7,defaultDuration:66,defaultTime:'day',microGoals:['1 день','7','30'],autoTrack:false,integration:null},
{id:'h_invest',cat:'finance',emoji:'📈',title:'Инвестировать',desc:'Пополнять портфель',defaultType:'weekly',defaultTarget:1,defaultDuration:66,defaultTime:'day',microGoals:['1 раз/нед','1 раз/мес'],autoTrack:false,integration:null},
{id:'h_read_fin',cat:'finance',emoji:'📚',title:'Финансовая литература',desc:'30 минут в день',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['10','30','60'],autoTrack:false,integration:null},
{id:'h_side_income',cat:'finance',emoji:'💼',title:'Доп. доход',desc:'1 час в день',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['30','60','120'],autoTrack:false,integration:null},
{id:'h_no_debt',cat:'finance',emoji:'📉',title:'Без новых долгов',desc:'Не брать кредиты',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1 день','7','30'],autoTrack:false,integration:null},
{id:'h_emergency',cat:'finance',emoji:'🚨',title:'Подушка безопасности',desc:'3-6 месяцев',defaultType:'custom',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1 мес','3','6'],autoTrack:false,integration:null},
{id:'h_no_lottery',cat:'finance',emoji:'🎰',title:'Без лотерей',desc:'Не играть',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1 день','7','30'],autoTrack:false,integration:null},
{id:'h_price_check',cat:'finance',emoji:'🏷',title:'Сравнивать цены',desc:'Перед покупкой',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1','3','5'],autoTrack:false,integration:null},

/* Социальное (20) */
{id:'h_call_family',cat:'social',emoji:'📞',title:'Звонить близким',desc:'Родители, друзья',defaultType:'weekly',defaultTarget:3,defaultDuration:66,defaultTime:'evening',microGoals:['1 раз/нед','3','7'],autoTrack:false,integration:null},
{id:'h_meet_friend',cat:'social',emoji:'👥',title:'Встреча с друзьями',desc:'Живое общение',defaultType:'weekly',defaultTarget:1,defaultDuration:66,defaultTime:'day',microGoals:['1 раз/нед','2'],autoTrack:false,integration:null},
{id:'h_listen_70',cat:'social',emoji:'👂',title:'Слушать 70%',desc:'Не перебивать',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1 разговор','3','5'],autoTrack:false,integration:null},
{id:'h_compliment_someone',cat:'social',emoji:'💐',title:'Комплимент',desc:'1 в день',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1','2','3'],autoTrack:false,integration:null},
{id:'h_help_someone',cat:'social',emoji:'🤝',title:'Помочь кому-то',desc:'Бескорыстно',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1','2','3'],autoTrack:false,integration:null},
{id:'h_no_phone_dinner',cat:'social',emoji:'📵',title:'Без телефона за едой',desc:'С семьёй',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1','2','3'],autoTrack:false,integration:'screen'},
{id:'h_thank_you',cat:'social',emoji:'🙏',title:'Говорить спасибо',desc:'3 раза в день',defaultType:'count',defaultTarget:3,defaultDuration:66,defaultTime:'day',microGoals:['1','2','3'],autoTrack:false,integration:null},
{id:'h_surprise',cat:'social',emoji:'🎁',title:'Сюрприз близким',desc:'Раз в неделю',defaultType:'weekly',defaultTarget:1,defaultDuration:66,defaultTime:'day',microGoals:['1 раз/нед','2'],autoTrack:false,integration:null},
{id:'h_ask_question',cat:'social',emoji:'❓',title:'Задать вопрос',desc:'Проявлять интерес',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1','3','5'],autoTrack:false,integration:null},
{id:'h_eye_contact',cat:'social',emoji:'👁',title:'Смотреть в глаза',desc:'При разговоре',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1 разговор','3','5'],autoTrack:false,integration:null},
{id:'h_no_gossip',cat:'social',emoji:'🤐',title:'Не сплетничать',desc:'Не обсуждать других',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1 день','7','30'],autoTrack:false,integration:null},
{id:'h_new_person',cat:'social',emoji:'🆕',title:'Новое знакомство',desc:'Раз в неделю',defaultType:'weekly',defaultTarget:1,defaultDuration:66,defaultTime:'day',microGoals:['1 раз/нед','2'],autoTrack:false,integration:null},
{id:'h_apologize',cat:'social',emoji:'🙇',title:'Извиняться',desc:'Признавать ошибки',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1','3','5'],autoTrack:false,integration:null},
{id:'h_share',cat:'social',emoji:'📤',title:'Делиться',desc:'Чем-то полезным',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1','3','5'],autoTrack:false,integration:null},
{id:'h_invite',cat:'social',emoji:'📨',title:'Приглашать в гости',desc:'Раз в месяц',defaultType:'custom',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1 раз/мес','2'],autoTrack:false,integration:null},
{id:'h_no_interrupt',cat:'social',emoji:'✋',title:'Не перебивать',desc:'Дослушать',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1 разговор','3','5'],autoTrack:false,integration:null},
{id:'h_remember',cat:'social',emoji:'🧠',title:'Помнить о важном',desc:'Дни рождения',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1','2','3'],autoTrack:false,integration:null},
{id:'h_quality_time',cat:'social',emoji:'⏰',title:'Качественное время',desc:'С близкими',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'evening',microGoals:['30 мин','60','120'],autoTrack:false,integration:null},
{id:'h_ask_help',cat:'social',emoji:'🆘',title:'Просить о помощи',desc:'Не стесняться',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1','3','5'],autoTrack:false,integration:null},
{id:'h_network',cat:'social',emoji:'🌐',title:'Нетворкинг',desc:'Новые контакты',defaultType:'weekly',defaultTarget:3,defaultDuration:66,defaultTime:'day',microGoals:['1 раз/нед','3','5'],autoTrack:false,integration:null},

/* Духовное (15) */
{id:'h_pray',cat:'spiritual',emoji:'🙏',title:'Молитва',desc:'Утром и вечером',defaultType:'count',defaultTarget:2,defaultDuration:66,defaultTime:'day',microGoals:['Утром','Вечером'],autoTrack:false,integration:null},
{id:'h_read_scripture',cat:'spiritual',emoji:'📖',title:'Чтение писания',desc:'15 минут',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'morning',microGoals:['5','15','30'],autoTrack:false,integration:null},
{id:'h_silence_10',cat:'spiritual',emoji:'🤫',title:'10 минут тишины',desc:'Без телефона',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['5','10','15'],autoTrack:false,integration:null},
{id:'h_ikigai',cat:'spiritual',emoji:'🌅',title:'Икигай',desc:'Думать о смысле',defaultType:'weekly',defaultTarget:1,defaultDuration:66,defaultTime:'day',microGoals:['1 раз/нед','2'],autoTrack:false,integration:null},
{id:'h_memento',cat:'spiritual',emoji:'💀',title:'Memento Mori',desc:'Помнить о конечности',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'morning',microGoals:['Утро','Вечер'],autoTrack:false,integration:null},
{id:'h_nature',cat:'spiritual',emoji:'🌳',title:'Время на природе',desc:'Без телефона',defaultType:'weekly',defaultTarget:3,defaultDuration:66,defaultTime:'day',microGoals:['1 раз/нед','3','7'],autoTrack:false,integration:null},
{id:'h_fast',cat:'spiritual',emoji:'🍽',title:'Пост',desc:'Раз в неделю',defaultType:'weekly',defaultTarget:1,defaultDuration:66,defaultTime:'day',microGoals:['1 раз/нед','2'],autoTrack:false,integration:null},
{id:'h_volunteer',cat:'spiritual',emoji:'❤️',title:'Волонтёрство',desc:'Помощь другим',defaultType:'custom',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1 раз/мес','2'],autoTrack:false,integration:null},
{id:'h_donate',cat:'spiritual',emoji:'💝',title:'Донатить',desc:'10% дохода',defaultType:'custom',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1 раз/мес','2'],autoTrack:false,integration:null},
{id:'h_meditate_deep',cat:'spiritual',emoji:'🧘',title:'Глубокая медитация',desc:'30 минут',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'morning',microGoals:['10','20','30'],autoTrack:false,integration:null},
{id:'h_affirmation',cat:'spiritual',emoji:'✨',title:'Аффирмации',desc:'Утром вслух',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'morning',microGoals:['3','5','10'],autoTrack:false,integration:null},
{id:'h_visualize',cat:'spiritual',emoji:'🔮',title:'Визуализация',desc:'5 минут',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'morning',microGoals:['3','5','10'],autoTrack:false,integration:null},
{id:'h_forgive_deep',cat:'spiritual',emoji:'🕊',title:'Прощение',desc:'Отпускать обиды',defaultType:'weekly',defaultTarget:1,defaultDuration:66,defaultTime:'evening',microGoals:['1 раз/нед','2'],autoTrack:false,integration:null},
{id:'h_ritual',cat:'spiritual',emoji:'🕯',title:'Свой ритуал',desc:'Утром или вечером',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1 раз','2'],autoTrack:false,integration:null},
{id:'h_life_meaning',cat:'spiritual',emoji:'🧭',title:'Думать о смысле',desc:'Раз в неделю',defaultType:'weekly',defaultTarget:1,defaultDuration:66,defaultTime:'evening',microGoals:['1 раз/нед','2'],autoTrack:false,integration:null},

/* Цифровое (15) */
{id:'h_screen_2h',cat:'digital',emoji:'📱',title:'Экран < 2 часов',desc:'Соцсети и развлечения',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['4 ч','3','2'],autoTrack:true,integration:'screen'},
{id:'h_no_phone_1h',cat:'digital',emoji:'📵',title:'1 час без телефона',desc:'В любое время',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['30 мин','60','120'],autoTrack:false,integration:'screen'},
{id:'h_no_social',cat:'digital',emoji:'🚫',title:'Без соцсетей',desc:'Не заходить',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1 час','3','весь день'],autoTrack:true,integration:'screen'},
{id:'h_digital_detox',cat:'digital',emoji:'🧘',title:'Цифровой детокс',desc:'1 день в неделю',defaultType:'weekly',defaultTarget:1,defaultDuration:66,defaultTime:'day',microGoals:['1 день/нед','2'],autoTrack:false,integration:'screen'},
{id:'h_no_phone_eat',cat:'digital',emoji:'🍽',title:'Без телефона за едой',desc:'Все приёмы',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1','2','3'],autoTrack:false,integration:'screen'},
{id:'h_no_phone_toilet',cat:'digital',emoji:'🚽',title:'Без телефона в туалете',desc:'Только по делу',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1','3','5'],autoTrack:false,integration:'screen'},
{id:'h_gray_scale',cat:'digital',emoji:'⚫',title:'Ч/б экран',desc:'Оттенки серого',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1 час','3','весь день'],autoTrack:false,integration:'screen'},
{id:'h_no_notif',cat:'digital',emoji:'🔕',title:'Без уведомлений',desc:'Только от людей',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1 час','3','весь день'],autoTrack:false,integration:'screen'},
{id:'h_airplane',cat:'digital',emoji:'✈️',title:'Авиарежим',desc:'1 час в день',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['30 мин','1','2'],autoTrack:false,integration:'screen'},
{id:'h_unfollow',cat:'digital',emoji:'🚪',title:'Отписаться',desc:'От 1 канала в день',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1','3','5'],autoTrack:false,integration:null},
{id:'h_no_shorts',cat:'digital',emoji:'📹',title:'Без шортсов',desc:'Reels/TikTok',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1 час','3','весь день'],autoTrack:true,integration:'screen'},
{id:'h_no_morning_phone',cat:'digital',emoji:'🌅',title:'Утро без телефона',desc:'Первый час',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'morning',microGoals:['30 мин','1','2'],autoTrack:false,integration:'screen'},
{id:'h_no_night_phone',cat:'digital',emoji:'🌙',title:'Вечер без телефона',desc:'За час до сна',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'evening',microGoals:['30','60','120'],autoTrack:false,integration:'screen'},
{id:'h_off_notif_sleep',cat:'digital',emoji:'😴',title:'Уведомления off на ночь',desc:'С 21:00 до 7:00',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'night',microGoals:['1 ночь','7','30'],autoTrack:false,integration:'screen'},
{id:'h_check_time',cat:'digital',emoji:'⏱',title:'Проверять экранное время',desc:'Раз в день',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'evening',microGoals:['1 раз','2'],autoTrack:true,integration:'screen'},

/* Быт (15) */
{id:'h_make_bed',cat:'home',emoji:'🛏',title:'Заправлять кровать',desc:'Сразу после пробуждения',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'morning',microGoals:['1','7','30'],autoTrack:false,integration:null},
{id:'h_clean_15',cat:'home',emoji:'🧹',title:'Уборка 15 минут',desc:'Каждый день',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'evening',microGoals:['5','15','30'],autoTrack:false,integration:null},
{id:'h_dishes',cat:'home',emoji:'🍽',title:'Мыть посуду сразу',desc:'Не оставлять',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'evening',microGoals:['1','7','30'],autoTrack:false,integration:null},
{id:'h_laundry',cat:'home',emoji:'👕',title:'Стирка',desc:'Раз в неделю',defaultType:'weekly',defaultTarget:1,defaultDuration:66,defaultTime:'day',microGoals:['1 раз/нед','2'],autoTrack:false,integration:null},
{id:'h_declutter',cat:'home',emoji:'📦',title:'Избавляться от лишнего',desc:'1 вещь в день',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1','3','5'],autoTrack:false,integration:null},
{id:'h_plants',cat:'home',emoji:'🪴',title:'Поливать растения',desc:'По расписанию',defaultType:'weekly',defaultTarget:2,defaultDuration:66,defaultTime:'day',microGoals:['1 раз/нед','2'],autoTrack:false,integration:null},
{id:'h_open_window',cat:'home',emoji:'🪟',title:'Проветривать',desc:'10 минут утром',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'morning',microGoals:['5','10','15'],autoTrack:false,integration:null},
{id:'h_clean_desk',cat:'home',emoji:'🖥',title:'Чистый рабочий стол',desc:'Перед работой',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'morning',microGoals:['1 раз','2'],autoTrack:false,integration:null},
{id:'h_no_clutter',cat:'home',emoji:'✨',title:'Без хлама',desc:'Всё на местах',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'evening',microGoals:['1','2','3'],autoTrack:false,integration:null},
{id:'h_grocery',cat:'home',emoji:'🛒',title:'Список покупок',desc:'Перед магазином',defaultType:'weekly',defaultTarget:1,defaultDuration:66,defaultTime:'day',microGoals:['1 раз/нед','2'],autoTrack:false,integration:null},
{id:'h_meal_prep',cat:'home',emoji:'🍱',title:'Готовить на неделю',desc:'Воскресенье',defaultType:'weekly',defaultTarget:1,defaultDuration:66,defaultTime:'day',microGoals:['1 раз/нед','2'],autoTrack:false,integration:null},
{id:'h_trash',cat:'home',emoji:'🗑',title:'Выносить мусор',desc:'Каждый день',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'evening',microGoals:['1','2'],autoTrack:false,integration:null},
{id:'h_clean_fridge',cat:'home',emoji:'🧊',title:'Чистить холодильник',desc:'Раз в неделю',defaultType:'weekly',defaultTarget:1,defaultDuration:66,defaultTime:'day',microGoals:['1 раз/нед','2'],autoTrack:false,integration:null},
{id:'h_wash_bed',cat:'home',emoji:'🛏',title:'Менять постель',desc:'Раз в неделю',defaultType:'weekly',defaultTarget:1,defaultDuration:66,defaultTime:'day',microGoals:['1 раз/нед','2'],autoTrack:false,integration:null},
{id:'h_minimalism',cat:'home',emoji:'🧘',title:'Минимализм',desc:'1 вещь в день на выброс',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1','3','5'],autoTrack:false,integration:null},

/* Творчество (15) */
{id:'h_draw_15',cat:'creative',emoji:'✏️',title:'Рисовать 15 минут',desc:'Скетч, дудл',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['5','15','30'],autoTrack:false,integration:null},
{id:'h_write_300',cat:'creative',emoji:'✍️',title:'Писать 300 слов',desc:'Блог, рассказ',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['100','300','500'],autoTrack:false,integration:null},
{id:'h_photo',cat:'creative',emoji:'📷',title:'Фотографировать',desc:'1 кадр в день',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1','3','5'],autoTrack:false,integration:null},
{id:'h_music_practice',cat:'creative',emoji:'🎸',title:'Играть на инструменте',desc:'15 минут',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['5','15','30'],autoTrack:false,integration:null},
{id:'h_sing',cat:'creative',emoji:'🎤',title:'Петь',desc:'5 минут',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['3','5','10'],autoTrack:false,integration:null},
{id:'h_dance',cat:'creative',emoji:'💃',title:'Танцевать',desc:'10 минут',defaultType:'daily',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['5','10','15'],autoTrack:false,integration:null},
{id:'h_craft',cat:'creative',emoji:'🧶',title:'Рукоделие',desc:'Вязание, шитьё',defaultType:'weekly',defaultTarget:3,defaultDuration:66,defaultTime:'day',microGoals:['1','3','7'],autoTrack:false,integration:null},
{id:'h_cook_new',cat:'creative',emoji:'🍳',title:'Новый рецепт',desc:'Раз в неделю',defaultType:'weekly',defaultTarget:1,defaultDuration:66,defaultTime:'day',microGoals:['1 раз/нед','2'],autoTrack:false,integration:null},
{id:'h_blog',cat:'creative',emoji:'📝',title:'Вести блог',desc:'1 пост в неделю',defaultType:'weekly',defaultTarget:1,defaultDuration:66,defaultTime:'day',microGoals:['1 пост/нед','2'],autoTrack:false,integration:null},
{id:'h_video',cat:'creative',emoji:'🎬',title:'Снимать видео',desc:'1 в неделю',defaultType:'weekly',defaultTarget:1,defaultDuration:66,defaultTime:'day',microGoals:['1 видео/нед','2'],autoTrack:false,integration:null},
{id:'h_podcast_rec',cat:'creative',emoji:'🎙',title:'Записывать подкаст',desc:'1 эпизод в неделю',defaultType:'weekly',defaultTarget:1,defaultDuration:66,defaultTime:'day',microGoals:['1 эпизод/нед','2'],autoTrack:false,integration:null},
{id:'h_poetry',cat:'creative',emoji:'📜',title:'Поэзия',desc:'1 стих в неделю',defaultType:'weekly',defaultTarget:1,defaultDuration:66,defaultTime:'day',microGoals:['1 стих/нед','3'],autoTrack:false,integration:null},
{id:'h_idea',cat:'creative',emoji:'💡',title:'Генерировать идеи',desc:'10 идей в день',defaultType:'count',defaultTarget:10,defaultDuration:66,defaultTime:'day',microGoals:['3','5','10'],autoTrack:false,integration:null},
{id:'h_museum',cat:'creative',emoji:'🏛',title:'Музей/выставка',desc:'Раз в месяц',defaultType:'custom',defaultTarget:null,defaultDuration:66,defaultTime:'day',microGoals:['1 раз/мес','2'],autoTrack:false,integration:null},
{id:'h_theater',cat:'creative',emoji:'🎭',title:'Театр/кино',desc:'Раз в месяц',defaultType:'custom',defaultTarget:null,defaultDuration:66,defaultTime:'evening',microGoals:['1 раз/мес','2'],autoTrack:false,integration:null}
];

/* ============ HABIT SCHEDULE / WEEK / DURATIONS / TIME SLOTS ============ */
var HABIT_SCHEDULE_TYPES=[
{id:'daily',name:'Ежедневно',emoji:'📅',desc:'Каждый день'},
{id:'weekly',name:'Еженедельно',emoji:'📆',desc:'N раз в неделю'},
{id:'custom',name:'Свой график',emoji:'⚙️',desc:'Выбрать дни'},
{id:'count',name:'N раз в день',emoji:'🔢',desc:'Счётчик'}
];
var WEEK_DAYS=[
{id:1,short:'Пн',full:'Понедельник'},
{id:2,short:'Вт',full:'Вторник'},
{id:3,short:'Ср',full:'Среда'},
{id:4,short:'Чт',full:'Четверг'},
{id:5,short:'Пт',full:'Пятница'},
{id:6,short:'Сб',full:'Суббота'},
{id:7,short:'Вс',full:'Воскресенье'}
];
var HABIT_DURATIONS=[
{id:21,name:'21 день',emoji:'🌱',desc:'Быстрый старт'},
{id:22,name:'22 дня',emoji:'🌿',desc:'Нейросвязь'},
{id:30,name:'30 дней',emoji:'🌳',desc:'Классика'},
{id:66,name:'66 дней',emoji:'💎',desc:'Lally 2010'},
{id:90,name:'90 дней',emoji:'🏆',desc:'Глубоко'},
{id:180,name:'180 дней',emoji:'👑',desc:'Полгода'},
{id:365,name:'365 дней',emoji:'🌟',desc:'Год'}
];
var HABIT_TIME_SLOTS=[
{id:'morning',name:'Утро',emoji:'🌅',range:'05:00–12:00'},
{id:'day',name:'День',emoji:'☀️',range:'12:00–18:00'},
{id:'evening',name:'Вечер',emoji:'🌆',range:'18:00–22:00'},
{id:'night',name:'Ночь',emoji:'🌙',range:'22:00–05:00'},
{id:'any',name:'Любое',emoji:'⏰',range:'В течение дня'}
];
var HABIT_AUTO_TRACK=[
{id:'sleep',name:'Сон',emoji:'😴',desc:'Авто из модуля сна'},
{id:'screen',name:'Экран',emoji:'📱',desc:'Авто из трекера'},
{id:'water',name:'Вода',emoji:'💧',desc:'Авто из счётчика'},
{id:'workout',name:'Тренировка',emoji:'🏋️',desc:'Авто из журнала'},
{id:'mood',name:'Настроение',emoji:'💭',desc:'Авто из дневника'},
{id:'steps',name:'Шаги',emoji:'🚶',desc:'Авто из трекера'},
{id:'reading',name:'Чтение',emoji:'📖',desc:'Авто из трекера'}
];

/* ============ ENGLISH 125 ============ */
var ENGLISH_125=[];
(function(){
  var levels=['A1','A2','B1','B2','C1'];
  var topicsA1=['Алфавит','Приветствия','Числа','Цвета','Семья','Еда','To be','Present Simple','Артикли','Мн. число','This/That','Притяжательные','Предлоги','Время','Дни','Can','Like+ing','Профессии','Хобби','Погода','Магазин','Кафе','Транспорт','Дом','Итог'];
  var topicsA2=['Past Simple правильные','Past Simple неправильные','Past Continuous','Future','Сравнения','Some/Any','Much/Many','Present Perfect','For/Since','Модальные','Would like','Continuous vs Simple','Условные 1','Условные 2','Косвенная','Пассив','Вопросы','Tag','Фразовые 1','Фразовые 2','Идиомы 1','Идиомы 2','Formal','Чтение','Итог'];
  var topicsB1=['PPC','Past Perfect','Future Continuous','Future Perfect','Модальные adv','Used to','Условные 3','Wish','Косвенная сложная','Relative','Gerund','Passive adv','Tag adv','Emphasis','Email','Звонок','Презентации','Интервью','Идиомы деловые','Сокращения','Collocations','Word formation','Чтение','Аудирование','Итог'];
  var topicsB2=['Инверсия','Смешанные','Cleft','Subjunctive','Фразовые','Идиомы B2','Discourse','Формальная','Аргументация','Выступления','Переговоры','Дебаты','Идиомы','Интервью STAR','Рецензия','Статья','Разговорный','Нюансы','Collocations','Narrative','Ellipsis','Idiomatic','Phrasal','Письма','Итог'];
  var topicsC1=['Nuances','Idioms C1','Hedging','Literary','Register','Сочинение','Stylistic','Debates','Speech','Юмор','Cleft/Inversion','Cohesion','Coherence','Критическое','Сложные','Анализ','Научный','Юридический','Медицинский','IT','Презентация','Переговоры','Медиация','Философия','Итог'];
  [topicsA1,topicsA2,topicsB1,topicsB2,topicsC1].forEach(function(arr,li){
    arr.forEach(function(t,i){
      var id=levels[li].toLowerCase()+'_'+String(i+1).padStart(2,'0');
      ENGLISH_125.push({id:id,level:levels[li],title:t,theory:'**'+t+'** — урок '+levels[li]+'. Изучи правила и примеры.',practice:'10 упражнений по теме.',memory:'Мнемоника для запоминания.',keywords:t.toLowerCase()});
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

/* ============ SKILLS (60) ============ */
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
    SKILLS_LIBRARY.push({id:'sk_'+(i+1),cat:cats[i%cats.length],title:s,emoji:'💎',desc:'Навык',level:'Все',duration:'21 день',theory:'**'+s+'** — ключевой навык. Изучи основы и практикуй.',practice:['Практикуй 15 мин','Отслеживай результат'],effect:'+Навык',tips:'Регулярно'});
  });
})();

/* ============ METHODS LIBRARY (45) ============ */
var METHODS_LIBRARY=[];
(function(){
  var methods=['Pomodoro','Deep Work','GTD','Эйзенхауэр','Eat Frog','Time-block','2 минуты','Фейнман','Anki','Cornell','Mind Map','SQ3R','Дворец памяти','N-back','Box breathing','4-7-8','Wim Hof','Медитация','Body scan','Благодарность','Дневник','Икигай','Петля привычки','Habit stacking','80/20','Поток','Memento Mori','20-20-20','Холодный душ','SBI','ННО','GROW','SMART','OKR','Кайдзен','5S','PDCA','OODA','First Principles','Инверсия','Второй порядок','Антихрупкость','BATNA','Win-win','Икигай'];
  methods.forEach(function(m,i){
    METHODS_LIBRARY.push({id:'m_'+(i+1),emoji:'🎯',title:m,category:'Продуктивность',desc:'Метод продуктивности',steps:['Понять суть','Применить на практике','Отследить результат'],base:'Автор метода'});
  });
})();

/* ============ RECOVERY LIBRARY (200) ============ */
var RECOVERY_LIBRARY=[];
(function(){
  var cats=['💪 Физическое','🧠 Ментальное','👁 Сенсорное','🎨 Творческое','❤️ Эмоциональное','👥 Социальное','🕊 Духовное','👨‍👩‍👧 Семейное','💼 Рабочее'];
  var titles=['Сон','Дневной сон','Прогулка','Йога','Плавание','Вело','Бег','Медитация','Массаж','Сауна','Холодный душ','Контраст','4-7-8','Box','Wim Hof','Растяжка','Foam','Стопы','Ванна','Скраб','Вода','Овощи','Омега','Зелёный чай','Шоколад','Чай','Орехи','Авокадо','Ягоды','Рыба','Белок','Свет','Тёплый свет','Тёмная','Прохладно','Тихо','Кровать','Без телефона','Режим','Ранний ужин','Медитация','Дневник','Благодарность','Чтение','Творчество','Музыка','Рефлексия','Планирование','Braindump','Пазлы','Обучение','Курс','Природа','Театр','Музей','Кофе','Душ','Чай','Body scan','Визуализация','Подкаст','Сериал','Игра','Разговор','Объятия','Питомец','Помощь','Арт','Эмоции','Метта','Тишина','Темнота','Детокс','Аромат','Свечи','Звук','Белый шум','Постель','Увлажнитель','Темп','Растения','Цвет','Воздух','Очки','Беруши','Стопы','Звук','Тихая еда','Пальминг','Компресс','Рисование','Инструмент','Письмо','Фото','Рукоделие','Готовка','Сад','Танцы','Пение','Поэзия','Видео','Каллиграфия','Настольные','Психотерапия','Слёзы','Смех','Проживание','Решение','Самомассаж','Ритуал','Письмо','Друзья','Семья','Звонок','Нетворкинг','Вечеринка','Разговор','Менторство','Подарок','Обед','Кофе','Спорт','Молитва','Природа','Рассвет','Закат','Звёзды','Мантра','Свеча','Рефлексия','Дневник','Донат','Волонтёрство','Прощение','Пост','Тишина','Утро','Вечер','Икигай','Дети','Свидание','Ужин','Прогулка','Готовка','Родители','Бабушка','Отпуск','Выходной','Перерыв','Обед','Прогулка после','Утро без','Вечер без','Ревью недели','Ревью месяца','Ревью года','Видение','Цели','OKR','Метрики','Ментор','Side','Инвестиции','Бюджет','Финревью'];
  titles.forEach(function(t,i){
    RECOVERY_LIBRARY.push({id:'r_'+(i+1),cat:cats[i%cats.length],emoji:'🌿',title:t,desc:'Восстановление через '+t,how:'Регулярно, осознанно',time:'15 мин',effect:'+Восстановление',science:'Доказано',times:'1 раз в день'});
  });
})();

/* ============ ETIQUETTE (100) ============ */
var ETIQUETTE_TOPICS=[];
(function(){
  var cats=['Приветствие','За столом','Деловое','В обществе','Коммуникация','Внешний вид','Путешествия','Цифровое','Особые случаи','Прочее'];
  var titles=['Рукопожатие','Приветствие словом','Поклон','Объятия','Представление','Визитка','Салфетка','Приборы','Ложка','Бокал','Хлеб','Мясо','Паста','Суп','Суши','Кофе','Фрукты','Десерт','Соль','Приборы после','Email','Звонок','Встреча','Дресс-код','Переговоры','Презентация','Совещание','SBI','Планирование','Делегирование','Театр','Кино','Ресторан','Транспорт','Лифт','Дверь','Лестница','Зонт','Питомцы','Вечеринка','Слушание','Small talk','Речь','Тайна','Комплимент','Критика','Извинения','Благодарность','Переписка','Голосовые','Костюм','Обувь','Причёска','Парфюм','Взгляд','Улыбка','Осанка','Походка','Аэропорт','Контроль','Отель','За границей','Фото','Курение','Алкоголь','Чаевые','Язык','Торговля','Экран','Уведомления','Письмо','Мессенджеры','Zoom','За рулём','Пароли','Соцсети','Селфи','AI','Похороны','Свадьба','День рождения','Больница','В гостях','В машине','Цветы','Подарок','Курение в гостях','С питомцем','Экология','Пешеход','Водитель','Велосипед','Очередь','Общественное','Наушники','Громкая связь','Еда','Курение','Алкоголь'];
  titles.forEach(function(t,i){
    ETIQUETTE_TOPICS.push({id:'et_'+String(i+1).padStart(3,'0'),cat:cats[i%cats.length],emoji:'🎩',title:t,theory:'**'+t+'** — правило этикета. Изучи и применяй.',science:'Традиция и уважение.',practice:['Применяй в жизни','Наблюдай за другими'],effect:'+Уважение',tips:'Регулярно'});
  });
})();

/* ============ HORMONES (20) ============ */
var HORMONES=[
{id:'dopamine',emoji:'⚡',name:'Дофамин',role:'Мотивация',what:'Предвкушение награды, мотивация.',where:'VTA → прилежащее ядро.',when:'При предвкушении.',up:['Достижение целей','Спорт','Музыка','Тёмный шоколад','Холодный душ'],down:['Соцсети','Сахар','Игры','Недосып','Стресс'],food:'Тирозин: мясо, рыба, яйца.',sleep:'7-9 ч',sport:'Кардио + силовые',normal:'Стабильная мотивация',imbalance:'Прокрастинация, апатия',protocol:['Дофамин-детокс','Утро без телефона','Награда после усилия'],example:'Предвкушение слаще награды',symptoms:['Скука','Прокрастинация','Апатия']},
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

/* ============ WEALTH MODULES (20) ============ */
var WEALTH_MODULES=[];
(function(){
  for(var i=1;i<=20;i++){
    WEALTH_MODULES.push({id:'w_'+String(i).padStart(2,'0'),emoji:'💰',title:'Модуль '+i,theory:'**Финансовая грамотность.** Ключевые принципы модуля '+i+'.',science:'Сложный процент работает.',practice:['Учёт','Планирование','Действие'],effect:'+Капитал',tips:'Регулярно'});
  }
})();

console.log('[CONTENT 2/6 ✅] LEVELS='+LEARNING_LEVELS.length+' HABIT_TEMPLATES='+HABIT_TEMPLATES.length+' ENGLISH='+ENGLISH_125.length+' SKILLS='+SKILLS_LIBRARY.length+' METHODS='+METHODS_LIBRARY.length+' RECOVERY='+RECOVERY_LIBRARY.length+' ETIQUETTE='+ETIQUETTE_TOPICS.length+' HORMONES='+HORMONES.length+' WEALTH='+WEALTH_MODULES.length);
/* ============================================================
   LIFE OS — CONTENT.js v44 — ПОЛНЫЙ
   ЧАСТЬ 3/6: Психология, Мышление, Зрение, Детокс-курс 62 дня
   ============================================================ */

/* ============ PSYCHOLOGY_TOPICS (100) ============ */
var PSYCHOLOGY_TOPICS=[];
(function(){
  var topics=[
    ['Мышление','🧠','Критическое мышление','**5 вопросов.** Проверяй всё: кто сказал, зачем, какая выгода, есть ли доказательства, что альтернативы.'],
    ['Мышление','🔄','Системное мышление','**Целое, не части.** Всё связано. Изменение одного элемента меняет всю систему.'],
    ['Мышление','⚡','Латеральное','**В сторону.** Не по прямой, а обходными путями. Думай нестандартно.'],
    ['Эмоции','❤️','Эмоциональный интеллект','**5 компонентов Гоулмана:** самосознание, саморегуляция, мотивация, эмпатия, социальные навыки.'],
    ['Эмоции','😰','Работа с тревогой','**4-7-8, заземление 5-4-3-2-1.** Тревога = будущее. Верни себя в «здесь и сейчас».'],
    ['Эмоции','😔','Депрессия','**Не лень. Болезнь.** Спорт, свет, терапия, соцсвязи. При тяжёлой — к врачу.'],
    ['Мышление','📈','Мышление роста','**Growth mindset.** Способности развиваются. Ошибка = урок, а не приговор.'],
    ['Мышление','🎯','Решения','**10/10/10 + инверсия.** Как я почувствую через 10 мин / 10 мес / 10 лет?'],
    ['Мышление','🧩','Искажения','**Confirmation, anchoring.** Подтверждаем то, во что верим. Первое число = якорь.'],
    ['Мышление','💡','Ментальные модели','**80+ моделей.** Первый порядок, инверсия, Occam, аналогии, 80/20.'],
    ['Отношения','💞','Привязанность','**4 типа:** надёжный, тревожный, избегающий, дезорганизованный.'],
    ['Отношения','💬','ННО','**Наблюдение → Чувство → Потребность → Просьба.** Nonviolent Communication.'],
    ['Отношения','🚧','Границы','**«Я не могу X, но могу Y».** Защищай себя без вины.'],
    ['Мышление','⏳','Прокрастинация','**Эмоциональная регуляция.** Не лень, а избегание дискомфорта.'],
    ['Эмоции','🧘','Медитация','**MBSR 8 недель.** Снижает тревогу на 30%.'],
    ['Мышление','🎨','Креативность','**DMN активна в покое.** Идеи приходят в тишине.'],
    ['Мышление','🔍','Внимание','**23 мин на возврат.** Каждое отвлечение = 23 минуты.'],
    ['Эмоции','😤','Гнев','**Пауза 6 сек. Пик 90 сек.** Гнев приходит волной — переждать.'],
    ['Мышление','💭','КПТ','**Мысль → Эмоция → Поведение.** Меняя мысль, меняешь всё.'],
    ['Мышление','🎓','Стоицизм','**Дихотомия контроля.** Что в моей власти? Что нет?'],
    ['Мышление','🏛','Смысл','**Логотерапия Франкла.** Смысл — в творчестве, переживании, отношении к страданию.'],
    ['Мышление','🔄','Второй порядок','**А что потом? ×3.** Думай на 3 шага вперёд.'],
    ['Мышление','🎯','First principles','**Разбей до основы.** Не копируй — разбирай.'],
    ['Мышление','⚖️','Инверсия','**Что мешает?** Думай от обратного.'],
    ['Мышление','🌐','Circle of competence','**Работай там, где разбираешься.**'],
    ['Мышление','✂️','Occam','**Простое вернее.** Не усложняй.'],
    ['Мышление','📊','Вероятности','**Мир — вероятности.** Не «да/нет», а «сколько %?»'],
    ['Мышление','🎲','Тейл-риски','**Малые вероятности, большие последствия.**'],
    ['Мышление','🧬','Эволюционное','**Мозг — продукт эволюции.** Он не для счастья, а для выживания.'],
    ['Мышление','🌊','Антихрупкость','**Что не убивает — сильнее.** Талеб.'],
    ['Эмоции','💧','Слёзы','**Выводят кортизол.** Не сдерживай, когда нужно.'],
    ['Эмоции','😂','Смех','**-30% кортизола.** Смейся ежедневно.'],
    ['Мышление','💤','Осознанные сны','**Можно управлять.** Тренировка внимания.'],
    ['Мышление','🌍','Экология разума','**Среда формирует.** Убери шум — увидишь себя.'],
    ['Мышление','⚡','Дофамин','**Предвкушение, а не удовольствие.** Работай над целями.'],
    ['Мышление','🌅','Утренние ритуалы','**Первые 30 мин.** Программируют день.'],
    ['Мышление','📝','Дневник','**Письмо структурирует.** Утром — утренние страницы, вечером — рефлексия.'],
    ['Эмоции','🙏','Благодарность','**+25% счастья.** Три вещи каждый вечер.'],
    ['Мышление','🎯','Поток','**Погружение.** Баланс сложности и навыка.'],
    ['Мышление','👁','Восприятие','**Мозг достраивает 90%.** Мы видим не реальность, а модель.'],
    ['Мышление','🧠','Память','**Забываем 58% за 20 мин.** Повторяй по интервалам.'],
    ['Отношения','🤝','Дружба','**5 глубоких > 100 поверхностных.**'],
    ['Отношения','💑','Любовь','**5 языков:** время, подарки, помощь, слова, прикосновения.'],
    ['Отношения','🏠','Семья','**Корни.** Поддерживай связи.'],
    ['Мышление','🎓','Обучение','**Recall > Recognition.** Вспоминай сам — ×3 эффективнее.'],
    ['Мышление','🔄','Привычки','**Cue→Craving→Response→Reward.** 66 дней.'],
    ['Мышление','💰','Психология денег','**Деньги = эмоции.** Осознанность.'],
    ['Мышление','🎯','Цели','**SMART.** Конкретные, измеримые, достижимые.'],
    ['Мышление','🌅','Смысл','**Икигай.** 4 сферы: люблю, умею, нужно, платят.'],
    ['Мышление','🕊','Принятие','**Не борись с тем, что нельзя изменить.** ACT.']
  ];
  for(var i=1;i<=100;i++){
    var t=topics[(i-1)%topics.length];
    PSYCHOLOGY_TOPICS.push({
      id:'ps_'+String(i).padStart(2,'0'),
      cat:t[0],emoji:t[1],title:t[2],
      theory:t[3],
      science:'Наука подтверждает: '+t[2].toLowerCase()+' работает.',
      practice:['Практикуй 1×/день','Наблюдай результат'],
      effect:'+Развитие',
      tips:'Регулярность — ключ.'
    });
  }
})();

/* ============ THINKING_TOPICS (100) ============ */
var THINKING_TOPICS=[];
(function(){
  var cats=['Логика','Системное','Творческое','Критическое','Стратегия','Эмоциональное','Социальное','Философия','Метапознание','Специальное'];
  var titles=['Дедукция','Индукция','Абдукция','Логические ошибки','Силлогизмы','Аналогии','Системное','Обратные связи','Рычаг','Задержки','Латеральное','Дивергентное','SCAMPER','Mind map','6 шляп','Критическое','Искажения','Источники','Научный метод','Корреляция','Стратегическое','Тактическое','Игра','Второй порядок','80/20','EQ','Осознанность','Принятие','Гнев','Тревога','Теория разума','Социальный обмен','ННО','Маски','Лидерство','Стоицизм','Экзистенциализм','Буддизм','Икигай','Memento mori','Рефлексия','Метаобучение','Калибровка','Прокрастинация','Фокус','Самосознание','Growth','Научное','Приоритизация','Итерации','Глобальное','Финансовое','Статистическое','Хаос','Экологическое','Сетевое','Эволюционное','Дизайнерское','Нарративное','Футуристическое','Дедукция'];
  for(var i=0;i<100;i++){
    var t=titles[i%titles.length];
    THINKING_TOPICS.push({
      id:'t_'+String(i+1).padStart(3,'0'),
      cat:cats[i%cats.length],
      emoji:'💡',
      title:t,
      theory:'**'+t+'** — ключевая концепция мышления. Изучи и применяй.',
      science:'Когнитивная наука подтверждает.',
      practice:['Практикуй','Разбирай примеры'],
      effect:'+Мышление',
      tips:'Регулярно'
    });
  }
})();

/* ============ VISION_EXERCISES (75) ============ */
var VISION_EXERCISES=[];
(function(){
  var effects=['small','small','small','small','small','small','small','small','small','small','small','small','small','small','small','medium','medium','medium','medium','medium','medium','medium','medium','medium','medium','medium','medium','medium','medium','medium','medium','medium','medium','medium','medium','medium','medium','medium','medium','medium','hard','hard','hard','hard','hard','hard','hard','hard','hard','hard','max','max','max','max','max','max','max','max','max','max','max','max','hard','hard','medium','small','small','small','medium','medium','hard','hard','max','max','medium'];
  var titles=['Моргание','Взгляд в окно','Закрыть глаза','Капли','Массаж век','Дыхание 4-7-8','Тёплый компресс','Холодный компресс','Зажмуривание 5','Круги','Взгляд вверх','Взгляд вниз','Влево','Вправо','Смена фокуса','Пальминг 3','20-20-20','Дальше-ближе','Восьмёрка','Массаж точек','Зажмуривание 10','Отдых в темноте','Метка','Пальминг+мед','Солнечные ванны','Диагонали','Волна','Часы','Цифры','Цветотерапия','Прогулка','Без очков','Рассвет','Холодная вода','С закрытыми','Отдых перед сном','Компресс ромашка','Природные капли','Тир','20-20-20+1','Полная темнота','Солнечные 15','Час на природе','Плавание','Фокусировка','Йога глаз','Конвергенция','Рассматривание','Стереограммы','Полный отдых','Соляризация','Пальминг 10','Повороты','Фиксация','Мелкий шрифт','Соляризация2','Периферическое','Цветовое','Ночное','Полный Бейтс','Облака','Вода','Прогулка без','Чтение без','Йога-нидра','Босиком','Массаж шеи','Медитация','Теннис','Мяч','Рисование','Фотоохота','Звёзды','Горизонт','Моргание2'];
  titles.forEach(function(t,i){
    VISION_EXERCISES.push({
      id:'v2_'+String(i+1).padStart(2,'0'),
      effect:effects[i]||'small',
      emoji:'👁',
      title:t,
      desc:'Упражнение для глаз: '+t.toLowerCase(),
      how:'Выполняй спокойно, без напряжения. 1-3 минуты.',
      duration:'1-3 мин',
      benefit:'Здоровье глаз',
      times:'2 раза в день',
      science:'Доказано офтальмологами'
    });
  });
})();

/* ============================================================
   DETOX_COURSE — 62 ДНЯ (ПОЛНЫЙ)
   ============================================================ */
var DETOX_COURSE=[
{day:1,phase:'🚀 Подготовка',title:'Осознай проблему',subtitle:'Замерь экран',emoji:'📊',
theory:'**Первый шаг — измерить.** Нельзя изменить то, что не измерено. Средний человек проводит в телефоне **7 часов 4 минуты** в день. Это **44% всей жизни**, пока глаза открыты.',
science:'DataReportal 2024: 6ч 40мин средний экран. **Каждый час экрана сокращает глубокий сон на 6 минут.**',
do:['Открой Screen Time','Посмотри за 7 дней','Топ-3 приложения','Запиши цифры','Покажи близкому'],
effect:'Понимание реальности',tips:'Не осуждай себя.'},
{day:2,phase:'🚀 Подготовка',title:'Убери соблазны',subtitle:'Среда решает',emoji:'🧹',
theory:'**Сила воли ограничена. Среда > воля.** Сделай вредное сложнодоступным.',
science:'Дьюк: +26% продуктивности при телефоне в другой комнате.',
do:['Удали соцсети','Отключи пуши','Ч/б режим','Купи будильник','Телефон из спальни'],
effect:'-30% экрана',tips:'Начни с уведомлений.'},
{day:3,phase:'🚀 Подготовка',title:'Утро без телефона',subtitle:'Первые 30 минут',emoji:'🌅',
theory:'**Первые 30 минут — программирование дня.**',
science:'UBC: +21% продуктивности, -15% тревожности.',
do:['Телефон в другой комнате','500 мл воды','10 мин света','Душ','Зарядка','Завтрак без экрана'],
effect:'+21% продуктивности',tips:'Первые 3 дня тяжело.'},
{day:4,phase:'🚀 Подготовка',title:'Составь манифест',subtitle:'Зачем тебе это',emoji:'📜',
theory:'**Без смысла не будет результата.** Запиши: от чего откажешься, что получишь.',
science:'Записанные цели +42%. Публичные +65%.',
do:['3 причины зачем','Опиши жизнь через 62 дня','Покажи близкому','Повесь на видное'],
effect:'+65% успеха',tips:'Конкретно.'},
{day:5,phase:'🚀 Подготовка',title:'Первая цифровая суббота',subtitle:'Пробный день',emoji:'🧪',
theory:'**Проверка без подготовки.** Увидеть, где сорвёшься.',
science:'1 день = карта триггеров.',
do:['Лимит 30 мин','Час без экрана','Еда без телефона','Прогулка 30 мин','Запиши срывы'],
effect:'Карта триггеров',tips:'Срыв — данные.'},
{day:6,phase:'🚀 Подготовка',title:'Триггеры',subtitle:'Что запускает руку',emoji:'🎯',
theory:'**Скука, тревога, одиночество, усталость, стресс.**',
science:'Осознание триггера = -50% реакции.',
do:['Запиши 5 триггеров','Придумай замену','Повесь список'],
effect:'-50% импульсов',tips:'Скука = трамплин.'},
{day:7,phase:'🚀 Подготовка',title:'Ревью недели 1',subtitle:'Итоги',emoji:'📊',
theory:'**Что сработало.**',
science:'Harvard: +23% результатов.',
do:['Screen Time','3 победы','3 трудности','1 урок','План 2','Награда'],
effect:'+23%',tips:'Награда — не телефон.'},
{day:8,phase:'📅 Детокс',title:'Уведомления в ноль',subtitle:'Только люди',emoji:'🔔',
theory:'**Каждое уведомление = -23 мин концентрации.**',
science:'UC: 46 пушей = 17.5 ч потерь.',
do:['Отключи всё кроме звонков','Без вибрации','Только от людей'],
effect:'+2-3 ч',tips:'Не от человека = не срочно.'},
{day:9,phase:'📅 Детокс',title:'Соцсети 30 минут',subtitle:'Лимит',emoji:'📱',
theory:'**30 минут достаточно.**',
science:'Пенсильвания: -25% тревожности.',
do:['Лимит 30 мин','До 18:00','Блокировка','Не в кровати'],
effect:'-2 ч экрана',tips:'Начни с 60.'},
{day:10,phase:'📅 Детокс',title:'Чёрно-белый экран',subtitle:'Скучный телефон',emoji:'⚫',
theory:'**Цвет — магнит.**',
science:'Konstanz: -50% соцсетей.',
do:['Спец.возможности','Оттенки серого','Держи 24 ч'],
effect:'-50%',tips:'Оставь навсегда.'},
{day:11,phase:'📅 Детокс',title:'День без соцсетей',subtitle:'24 часа',emoji:'🚫',
theory:'**Проверка на прочность.**',
science:'Дофаминовое голодание.',
do:['Выходной','Удали соцсети','Спорт, книга','Ревью вечером'],
effect:'+25%',tips:'Предупреди близких.'},
{day:12,phase:'📅 Детокс',title:'Глубокий час',subtitle:'90 минут Deep Work',emoji:'🎯',
theory:'**90 минут = 3 часа обычной.**',
science:'Newport: ×3 объём.',
do:['Одна задача','Авиарежим 90','Телефон вне','Перерыв 15'],
effect:'×3',tips:'Утро.'},
{day:13,phase:'📅 Детокс',title:'Вечер без экрана',subtitle:'2 часа',emoji:'🌙',
theory:'**Синий свет = остановка мелатонина.**',
science:'Harvard: -30 мин глубокого сна.',
do:['2 ч без','Тёплый свет','Душ','Книга 30','Медитация','Сон до 23'],
effect:'+1 ч сна',tips:'Бумажная книга.'},
{day:14,phase:'📅 Детокс',title:'Ревью недели 2',subtitle:'Половина',emoji:'📊',
theory:'**2 недели — веха.**',
science:'-30% экрана, +45 мин сна.',
do:['Сравни','3 победы','3 сложности','1 паттерн','План 3','Награда'],
effect:'+Мотивация',tips:'Награда реальная.'},
{day:15,phase:'📅 Детокс',title:'Приложение вместо ленты',subtitle:'Полезное',emoji:'📚',
theory:'**Замени бессмысленное полезным.**',
science:'Дофамин из полезного.',
do:['1 полезное приложение','На главный','15 мин/день'],
effect:'+Знания',tips:'Только 1.'},
{day:16,phase:'📅 Детокс',title:'Хобби 30 минут',subtitle:'Руками',emoji:'🎨',
theory:'**Руками — лекарство.**',
science:'Otago: +30% удовлетворения.',
do:['Выбери хобби','30 мин','Без телефона','Показывай'],
effect:'+30%',tips:'Не дорогое.'},
{day:17,phase:'📅 Детокс',title:'Спорт без наушников',subtitle:'Связь с телом',emoji:'🏃',
theory:'**Медитация в движении.**',
science:'BJSM: -20% усталости.',
do:['30 мин','Без наушников','Дыхание','Растяжка'],
effect:'+Выносливость',tips:'Слушай шаги.'},
{day:18,phase:'📅 Детокс',title:'Живое общение',subtitle:'Звонок',emoji:'👥',
theory:'**Голос = эмоции.**',
science:'MIT: +40% понятности.',
do:['2 звонка','15 мин','Слушай 70%'],
effect:'+Связь',tips:'Родителям обязательно.'},
{day:19,phase:'📅 Детокс',title:'Природа 1 час',subtitle:'Кортизол вниз',emoji:'🌲',
theory:'**Бесплатное лекарство.**',
science:'Michigan: -16% кортизола.',
do:['1 ч','Телефон в сумке','Без спешки','Деревья'],
effect:'-16% кортизола',tips:'Не пробежка.'},
{day:20,phase:'📅 Детокс',title:'Дневник детокса',subtitle:'Рефлексия',emoji:'📓',
theory:'**Написание открывает.**',
science:'Texas: +25% ясности.',
do:['3 победы','3 трудности','1 открытие','1 обещание'],
effect:'+Ясность',tips:'От руки.'},
{day:21,phase:'📅 Детокс',title:'Ревью недели 3',subtitle:'Перелом',emoji:'📊',
theory:'**21 день — критическая точка.**',
science:'-40% экрана, +1 ч сна.',
do:['Сравни','3 победы','3 трудности','Что закрепилось','План 4','Награда'],
effect:'+Мотивация',tips:'Не расслабляйся.'},
{day:22,phase:'💎 Укрепление',title:'Утренний ритуал',subtitle:'Фиксация',emoji:'🌅',
theory:'**Утро определяет день.**',
science:'Duke: +30% продуктивности.',
do:['Встал сразу','500 мл воды','10 мин света','Душ','Зарядка','План 5 мин'],
effect:'+30%',tips:'Одно время.'},
{day:23,phase:'💎 Укрепление',title:'Работа без отвлечений',subtitle:'90 мин',emoji:'🎯',
theory:'**90 минут — ультрадианный цикл.**',
science:'×3 продуктивности.',
do:['Одна задача','Авиарежим 90','Перерыв 15'],
effect:'×3',tips:'Утро.'},
{day:24,phase:'💎 Укрепление',title:'Вечерний ритуал',subtitle:'Ко сну',emoji:'🌙',
theory:'**Вечер = подготовка ко сну.**',
science:'+1 ч глубокого сна.',
do:['Тёплый свет 19:00','Телефон вне 21:00','Книга 30','Душ','Медитация 10','Сон до 23'],
effect:'+1 ч сна',tips:'Одно время.'},
{day:25,phase:'💎 Укрепление',title:'Один день офлайн',subtitle:'24 часа',emoji:'🏕',
theory:'**Полностью офлайн.**',
science:'+25% продуктивности.',
do:['Выходной','Без интернета','Звонки можно','Спорт','Книга','Ревью'],
effect:'+25%',tips:'Планируй.'},
{day:26,phase:'💎 Укрепление',title:'Дофаминовое голодание',subtitle:'4 часа',emoji:'🧘',
theory:'**Отдых дофаминовой системы.**',
science:'+Чувствительность.',
do:['4 ч без стимулов','Телефон в комнате','Прогулка','Скучай'],
effect:'+Радость',tips:'Раз в неделю.'},
{day:27,phase:'💎 Укрепление',title:'Замена ленты на смысл',subtitle:'Что вместо?',emoji:'💡',
theory:'**Пустоту заполни смыслом.**',
science:'-30% депрессии.',
do:['5 причин','5 занятий','Свяжи','Ритуал'],
effect:'+Смысл',tips:'Найди своё.'},
{day:28,phase:'💎 Укрепление',title:'Метрики месяца',subtitle:'Цифры не врут',emoji:'📊',
theory:'**Цифры не врут.**',
science:'-40% экрана, +1.5 ч сна.',
do:['Screen Time','Сравни','Цифры','Ощущения','Награда'],
effect:'+Мотивация',tips:'Скриншоты.'},
{day:29,phase:'💎 Укрепление',title:'План на будущее',subtitle:'Как сохранить',emoji:'📋',
theory:'**Привычки остаются.**',
science:'80% с планом.',
do:['3 правила','3 лимита','3 ритуала','3 сигнала'],
effect:'80%',tips:'Конкретно.'},
{day:30,phase:'🎉 Месяц!',title:'Первый месяц готов!',subtitle:'Поздравляю',emoji:'🏆',
theory:'**30 дней. Это уже не эксперимент — это ты.**',
science:'+30% продуктивности, -30% тревожности.',
do:['Ревью','Награда','Расскажи близкому','Продолжай'],
effect:'Новая жизнь',tips:'Характер.'},
{day:31,phase:'💎 Укрепление',title:'Возврат к себе',subtitle:'Что было до',emoji:'🧭',
theory:'**Вспомни, кем был до курса.**',
science:'Рецепторы +30% чувствительнее.',
do:['Запиши: как было','Как стало','3 перемены','Новый план'],
effect:'+Идентичность',tips:'Ты живёшь.'},
{day:32,phase:'🔒 Интеграция',title:'Цифровой минимализм',subtitle:'Кэл Ньюпорт',emoji:'📱',
theory:'**Не запрет, а выбор.**',
science:'+40% продуктивности.',
do:['10 приложений','Одно главное','Остальное по делу'],
effect:'+Осознанность',tips:'Инструменты.'},
{day:33,phase:'🔒 Интеграция',title:'Цифровая гигиена',subtitle:'Правила',emoji:'🧼',
theory:'**Правила для жизни.**',
science:'-50% экрана, +2 ч сна.',
do:['Не в спальне','Не в ванной','Не за столом','Утро до 10:00 без','Вечер с 21:00 без'],
effect:'+Уважение',tips:'На холодильник.'},
{day:34,phase:'🔒 Интеграция',title:'Живое общение',subtitle:'Встречи',emoji:'👥',
theory:'**Замени переписку встречами.**',
science:'+25% настроения, +40% глубины.',
do:['2 встречи/нед','Без телефона','Слушай 70%'],
effect:'+Связи',tips:'Смотри в глаза.'},
{day:35,phase:'🔒 Интеграция',title:'Простое удовольствие',subtitle:'Заново учимся',emoji:'☕',
theory:'**Простое снова приятно.**',
science:'+30-40% удовольствия.',
do:['1 простое/день','Без телефона','Смакуй'],
effect:'+Радость',tips:'Замечай.'},
{day:36,phase:'🔒 Интеграция',title:'Творчество без стимулов',subtitle:'Скука → идеи',emoji:'🎨',
theory:'**Скука = начало творчества.**',
science:'+60% креатива.',
do:['30 мин скуки/день','Идеи на бумагу','Прогулка без подкаста'],
effect:'×1.6 креатива',tips:'Скука — трамплин.'},
{day:37,phase:'🔒 Интеграция',title:'Спорт как привычка',subtitle:'Автоматизм',emoji:'🏋️',
theory:'**Тело — фундамент.**',
science:'+BDNF 30%, +дофамин 20%.',
do:['150 мин кардио/нед','2 силовые/нед','Разные'],
effect:'+Мозг',tips:'Утро.'},
{day:38,phase:'🔒 Интеграция',title:'Питание как топливо',subtitle:'Меньше сахара',emoji:'🥗',
theory:'**Еда = топливо для мозга.**',
science:'+Энергия, +фокус.',
do:['500 г овощей/день','1.6 г белка/кг','Меньше сахара','Больше воды'],
effect:'+Энергия',tips:'Овощи первое.'},
{day:39,phase:'🔒 Интеграция',title:'Сон как приоритет',subtitle:'7-9 часов',emoji:'😴',
theory:'**Сон — основа всего.**',
science:'+40% когнитивных.',
do:['7-9 ч','Одно время','Тёмная спальня','Прохладно','Без экрана за 2 ч'],
effect:'+40%',tips:'Сон до всего.'},
{day:40,phase:'🔒 Интеграция',title:'Рефлексия недели',subtitle:'Что работает',emoji:'📓',
theory:'**Рефлексия = ускорение ×2.**',
science:'+23% результатов.',
do:['30 мин ревью','3 победы','3 трудности','1 урок'],
effect:'+Рост',tips:'Воскресенье.'},
{day:41,phase:'🔒 Интеграция',title:'Окружение',subtitle:'Что вокруг',emoji:'🌍',
theory:'**Окружение формирует мышление.**',
science:'Среда решает 50%.',
do:['Убери 3 раздражителя','Добавь 3 помощника','Переставь телефон','Книга на видное'],
effect:'+Мотивация',tips:'Среда > воля.'},
{day:42,phase:'🔒 Интеграция',title:'Половина+ пройдено',subtitle:'Осталось 20',emoji:'📊',
theory:'**42 из 62 — 68%.**',
science:'+50% устойчивости.',
do:['Screen Time за месяц','Сравни','3 победы','3 сложности','План на финал'],
effect:'+Устойчивость',tips:'Интеграция.'},
{day:43,phase:'🚀 Жизнь',title:'Свой день',subtitle:'Без правил',emoji:'📅',
theory:'**Создай свой идеальный день.**',
science:'+30% удовлетворённости.',
do:['Опиши идеальный день','10 пунктов','Проверь'],
effect:'+Свой путь',tips:'Не по Instagram.'},
{day:44,phase:'🚀 Жизнь',title:'Границы с телефоном',subtitle:'Навсегда',emoji:'🛡',
theory:'**Три правила — навсегда.**',
science:'-50% экрана пожизненно.',
do:['3 правила','Запиши','Повесь','Расскажи'],
effect:'-50%',tips:'3 правила > 30.'},
{day:45,phase:'🚀 Жизнь',title:'Помоги другому',subtitle:'Передай опыт',emoji:'🤝',
theory:'**Объясни — закрепи.**',
science:'Feynman + помощь = +25% счастья.',
do:['1 человек','Расскажи','Не навязывай','Будь примером'],
effect:'+Смысл',tips:'Опыт, не проповедь.'},
{day:46,phase:'🚀 Жизнь',title:'Планы на год',subtitle:'Без телефона',emoji:'🎯',
theory:'**730 часов в год вернул.**',
science:'Записанные +42%, с планом +80%.',
do:['3 больших цели','SMART','3 шага','Дедлайн','Расскажи'],
effect:'+42-80%',tips:'730 часов.'},
{day:47,phase:'🚀 Жизнь',title:'Свои ритуалы',subtitle:'Утро и вечер',emoji:'🌅',
theory:'**Ритуалы — каркас дня.**',
science:'Duke: +30% продуктивности.',
do:['Утренний 20 мин','Вечерний 30 мин','Одно время','Каждый день'],
effect:'+30%',tips:'Макс 4 пункта.'},
{day:48,phase:'🚀 Жизнь',title:'Отношения без экрана',subtitle:'Свидания',emoji:'💑',
theory:'**Настоящее общение — без телефона.**',
science:'+40% глубины.',
do:['На свидании без','С друзьями без','За столом без','Смотри в глаза'],
effect:'+Связи',tips:'Уважение.'},
{day:49,phase:'🚀 Жизнь',title:'Спорт как основа',subtitle:'Привычка',emoji:'🏋️',
theory:'**Спорт — не надо, а хочу.**',
science:'+30% энергии, +40% настроения.',
do:['4 тренировки/нед','Разные виды','С партнёром'],
effect:'+Мозг',tips:'Удовольствие.'},
{day:50,phase:'🚀 Жизнь',title:'Питание как ритуал',subtitle:'Осознанно',emoji:'🍽',
theory:'**Еда без экрана.**',
science:'-25% калорий.',
do:['Все приёмы без телефона','20+ минут','Смакуй','Замечай насыщение'],
effect:'+Пищеварение',tips:'Телефон в комнате.'},
{day:51,phase:'🚀 Жизнь',title:'Благодарность',subtitle:'Тренировка',emoji:'🙏',
theory:'**3 благодарности каждый день.**',
science:'Emmons: +25% счастья.',
do:['3 утром','3 вечером','Конкретно','Запиши'],
effect:'+25%',tips:'Конкретное.'},
{day:52,phase:'🚀 Жизнь',title:'Медитация 10 мин',subtitle:'Каждый день',emoji:'🧘',
theory:'**10 минут тишины.**',
science:'+20% концентрации, -30% тревожности.',
do:['10 мин','Утром','Одно время','Каждый день'],
effect:'+Спокойствие',tips:'Даже 5 мин.'},
{day:53,phase:'🚀 Жизнь',title:'Помощь другим',subtitle:'Смысл',emoji:'❤️',
theory:'**Помощь = смысл.**',
science:'+25% счастья, +40% смысла.',
do:['1 акт/нед','Бескорыстно','Не хвастайся'],
effect:'+Смысл',tips:'Даяние.'},
{day:54,phase:'🚀 Жизнь',title:'Творчество',subtitle:'Каждый день',emoji:'🎨',
theory:'**30 минут творчества.**',
science:'+40% креатива.',
do:['30 мин','Одно время','Без телефона','Показывай'],
effect:'+Радость',tips:'Процесс.'},
{day:55,phase:'🚀 Жизнь',title:'Учёба всю жизнь',subtitle:'Обучение',emoji:'📚',
theory:'**Учись постоянно.**',
science:'+40% нейропластичности.',
do:['1 тема/мес','Курс','Книга','30 мин/день'],
effect:'+Молодой мозг',tips:'Никогда не заканчивай.'},
{day:56,phase:'🚀 Жизнь',title:'Природа каждую неделю',subtitle:'1 час',emoji:'🌲',
theory:'**Природа — лекарство.**',
science:'-16% кортизола.',
do:['1 ч/нед','Без телефона','Лес, парк','Слушай, дыши'],
effect:'-Стресс',tips:'Медленно.'},
{day:57,phase:'🚀 Жизнь',title:'Ревью месяца 2',subtitle:'Итоги',emoji:'📊',
theory:'**Что изменилось за 2 месяца.**',
science:'+40% устойчивости.',
do:['Screen Time','Сравни','3 победы','3 сложности','План'],
effect:'+Ясность',tips:'Ощущения важнее.'},
{day:58,phase:'🚀 Жизнь',title:'Планы на будущее',subtitle:'5 лет',emoji:'🔭',
theory:'**Куда идёшь через 5 лет?**',
science:'Записанные +42%, с шагами +80%.',
do:['5 лет видение','Работа','Дом','Тело','Отношения','Деньги','Творчество','Шаги'],
effect:'+Направление',tips:'Видение + шаги.'},
{day:59,phase:'🚀 Жизнь',title:'Твой манифест v2',subtitle:'Что изменилось',emoji:'📜',
theory:'**Сравни манифест v1 и сейчас.**',
science:'+40% самоосознания.',
do:['Перечитай v1','3 что сбылось','3 новых','Манифест v2','Повесь'],
effect:'+Самоосознание',tips:'Живой документ.'},
{day:60,phase:'🚀 Жизнь',title:'День 60: жизнь без курса',subtitle:'Всё своё',emoji:'🏆',
theory:'**60 дней. Ты сам — курс.**',
science:'85% автоматизма.',
do:['Живи','Ревью','Дневник','Награда'],
effect:'Новая жизнь',tips:'Осталось 2 дня.'},
{day:61,phase:'🚀 Жизнь',title:'Передача опыта',subtitle:'Помоги',emoji:'🎓',
theory:'**Обучи кого-то.**',
science:'Feynman + помощь = +25%.',
do:['1 человек','Мягко','Не навязывай','Покажи'],
effect:'+Смысл',tips:'Опыт.'},
{day:62,phase:'🎉 Финал',title:'Свобода',subtitle:'Ты справился!',emoji:'🏆',
theory:'**62 дня. Это не финал — начало.**',
science:'+60% продуктивности, +2 ч сна, -40% тревожности.',
do:['Ревью','Награда','Расскажи','Продолжай','Ревью через месяц'],
effect:'Свобода',tips:'Телефон — инструмент.'}
];

console.log('[CONTENT 3/6 ✅] PSYCHOLOGY='+PSYCHOLOGY_TOPICS.length+' THINKING='+THINKING_TOPICS.length+' VISION='+VISION_EXERCISES.length+' DETOX='+DETOX_COURSE.length);
/* ============================================================
   LIFE OS — CONTENT.js v44 — ПОЛНЫЙ
   ЧАСТЬ 4/6: 12 НОВЫХ КУРСОВ
   ============================================================ */

/* ============ КУРС IT ============ */
var COURSE_IT={
id:'itcourse',emoji:'💻',title:'IT и программирование',subtitle:'От нуля до сеньора',desc:'Программирование, алгоритмы, базы данных, DevOps',
modules:[
{id:'it_m1',emoji:'🧮',title:'Основы',desc:'Код, алгоритмы, Git',
lessons:[
{title:'Программирование',theory:'**Программа = инструкции.** Языки: Python, JavaScript, Java, C++, Go. Каждый для своих задач.',practice:'Установи Python и напиши "Hello, World!".'},
{title:'Алгоритмы',theory:'**Big O.** O(1) — константа. O(log n) — бинарный поиск. O(n) — линейный. O(n²) — вложенные циклы.',practice:'Реализуй бинарный поиск.'},
{title:'Git',theory:'**Система контроля версий.** commit, push, pull, branch, merge.',practice:'Создай репозиторий и закоммить 3 файла.'}
]},
{id:'it_m2',emoji:'💾',title:'Backend',desc:'Серверы, БД',
lessons:[
{title:'Языки',theory:'**Python, Node.js, Java, Go.** Python — для данных и AI. Node.js — для веба. Java — для enterprise. Go — для скорости.',practice:'Напиши API на Python (Flask).'},
{title:'SQL',theory:'**Таблицы, JOIN, индексы.** SELECT, INSERT, UPDATE, DELETE. JOIN — связь таблиц.',practice:'Создай БД из 3 таблиц.'},
{title:'NoSQL',theory:'**MongoDB, Redis.** Документные и key-value хранилища для гибкости и скорости.',practice:'Установи Redis и поработай с ним.'}
]},
{id:'it_m3',emoji:'🎨',title:'Frontend',desc:'HTML, CSS, JS',
lessons:[
{title:'HTML+CSS',theory:'**Структура+оформление.** HTML — скелет, CSS — внешний вид.',practice:'Свёрстай простую страницу.'},
{title:'JavaScript',theory:'**Переменные, функции, async.** let, const, function, Promise, async/await.',practice:'Напиши калькулятор.'},
{title:'React',theory:'**Компоненты, хуки.** useState, useEffect. Одностраничные приложения.',practice:'Сделай Todo-лист.'}
]},
{id:'it_m4',emoji:'🚀',title:'DevOps',desc:'Docker, CI/CD, облака',
lessons:[
{title:'Docker',theory:'**Контейнеры.** Упаковка приложения со всеми зависимостями.',practice:'Заверни приложение в контейнер.'},
{title:'CI/CD',theory:'**Автоматизация.** GitHub Actions, GitLab CI. Тесты и деплой при push.',practice:'Настрой GitHub Actions.'},
{title:'Облака',theory:'**AWS, GCP, Azure.** Инфраструктура по требованию.',practice:'Задеплой на Vercel/Netlify.'}
]}
]};

/* ============ КУРС ПРАВО ============ */
var COURSE_LAW={
id:'lawcourse',emoji:'⚖️',title:'Основы права',subtitle:'Базовые знания',desc:'Права, договоры, налоги',
modules:[
{id:'law_m1',emoji:'📜',title:'Основы',desc:'Права и обязанности',
lessons:[
{title:'Права человека',theory:'**Декларация 1948.** Право на жизнь, свободу, труд, отдых, образование.',practice:'Прочитай главу 2 Конституции РФ.'},
{title:'Гражданское',theory:'**Договоры, собственность.** ГК РФ. Сделки, обязательства, наследование.',practice:'Изучи основы ГК РФ.'},
{title:'Трудовое',theory:'**ТК РФ.** Рабочий договор, отпуск, оплата, увольнение.',practice:'Изучи свой трудовой договор.'}
]},
{id:'law_m2',emoji:'📝',title:'Договоры',desc:'Практика',
lessons:[
{title:'Чтение',theory:'**5 пунктов.** Предмет, цена, сроки, ответственность, форс-мажор.',practice:'Прочитай любой договор.'},
{title:'Потребитель',theory:'**Возврат 14 дней.** Закон о защите прав потребителей.',practice:'Проверь чек на возврат.'},
{title:'Авторское',theory:'**Автоматическое.** Возникает при создании. Регистрация — для защиты.',practice:'Поставь © на свои работы.'}
]},
{id:'law_m3',emoji:'💼',title:'Бизнес-право',desc:'ИП, ООО, налоги',
lessons:[
{title:'ИП vs ООО',theory:'**Разница.** ИП — проще, ООО — безопаснее. ИП отвечает всем имуществом.',practice:'Сравни для своего случая.'},
{title:'Налоги',theory:'**НДФЛ 13%, УСН 6-15%, патент.** Каждый режим под свой бизнес.',practice:'Посчитай налог для идеи.'},
{title:'Лицензии',theory:'**Список.** Некоторые виды деятельности требуют лицензии.',practice:'Проверь, нужна ли тебе.'}
]}
]};

/* ============ КУРС МЕДИЦИНА ============ */
var COURSE_MED={
id:'medcourse',emoji:'⚕️',title:'Медицинская грамотность',subtitle:'Понимать тело',desc:'Анатомия, анализы, первая помощь',
modules:[
{id:'med_m1',emoji:'🫀',title:'Тело',desc:'Системы организма',
lessons:[
{title:'Сердечно-сосудистая',theory:'**Пульс 60-80. Давление 120/80.** Сердце — насос. Кровь — транспорт.',practice:'Измерь пульс и давление.'},
{title:'Дыхательная',theory:'**Сатурация 95-100%.** Кислород — топливо. Дыхание — жизнь.',practice:'Проверь сатурацию.'},
{title:'Пищеварительная',theory:'**ЖКТ. 80% иммунитета в кишечнике.** Микробиом — второй мозг.',practice:'Добавь ферментированные продукты.'}
]},
{id:'med_m2',emoji:'🧪',title:'Анализы',desc:'Что и зачем',
lessons:[
{title:'ОАК',theory:'**Гемоглобин 120-160. Лейкоциты 4-9. Тромбоциты 150-400.**',practice:'Расшифруй свой ОАК.'},
{title:'Биохимия',theory:'**Глюкоза 3.9-5.5. Холестерин < 5.5. АЛТ/АСТ < 40.**',practice:'Сдай биохимию.'},
{title:'Гормоны',theory:'**ТТГ 0.4-4.0. Кортизол утро 138-635. Ферритин 30-200.**',practice:'Проверь ТТГ.'}
]},
{id:'med_m3',emoji:'🚑',title:'Первая помощь',desc:'До врача',
lessons:[
{title:'Остановка сердца',theory:'**30+2.** 30 компрессий, 2 вдоха. Компрессии важнее.',practice:'Посмотри видео по СЛР.'},
{title:'Кровотечение',theory:'**Давление.** Прямое давление, жгут выше раны.',practice:'Собери аптечку.'},
{title:'Ожоги',theory:'**Холодная вода 15 мин.** Не мазать маслом. Не прокалывать.',practice:'Запомни алгоритм.'}
]}
]};

/* ============ КУРС ФИНАНСЫ ============ */
var COURSE_FINANCE={
id:'financecourse',emoji:'📈',title:'Финансовая грамотность',subtitle:'Деньги работают',desc:'Бюджет, инвестиции, FIRE',
modules:[
{id:'fin_m1',emoji:'💰',title:'Основы',desc:'Доходы и расходы',
lessons:[
{title:'Учёт',theory:'**Каждая трата.** Без учёта нет контроля.',practice:'Установи приложение для учёта.'},
{title:'Бюджет 50/30/20',theory:'**50% нужды, 30% желания, 20% сбережения.** Простая и рабочая схема.',practice:'Разбей свой доход.'},
{title:'Подушка',theory:'**3-6 месяцев расходов.** На отдельном счёте. Спокойствие.',practice:'Открой счёт.'}
]},
{id:'fin_m2',emoji:'📊',title:'Инвестиции',desc:'Куда вложить',
lessons:[
{title:'Акции',theory:'**Доля в компании.** Дивиденды + рост.',practice:'Изучи 5 компаний.'},
{title:'Индексные',theory:'**S&P 500.** Индекс из 500 крупнейших. Ставка на всю экономику.',practice:'Изучи ETF (SPY, VOO).'},
{title:'Облигации',theory:'**Стабильность.** Меньше доход — меньше риск. ОФЗ — государственные.',practice:'Изучи ОФЗ.'}
]},
{id:'fin_m3',emoji:'🔥',title:'FIRE',desc:'Независимость',
lessons:[
{title:'Что такое FIRE',theory:'**25× годовых расходов = свобода.** 4% правило вывода.',practice:'Посчитай свою цифру.'},
{title:'Норма сбережений',theory:'**50% = 17 лет. 65% = 10 лет. 75% = 7 лет.**',practice:'Подними норму на 5%.'},
{title:'Пенсия',theory:'**ИИС + НПФ.** Налоговый вычет + долгосрочно.',practice:'Открой ИИС.'}
]}
]};

/* ============ КУРС ПСИХОЛОГИЯ УГЛУБЛЁННО ============ */
var COURSE_PSYCH_DEEP={
id:'psychdeep',emoji:'🧠',title:'Глубинная психология',subtitle:'КПТ, ACT, психоанализ',desc:'Работа с мышлением и эмоциями',
modules:[
{id:'pd_m1',emoji:'💭',title:'КПТ',desc:'Когнитивно-поведенческая',
lessons:[
{title:'ABC',theory:'**A→B→C.** Событие → Мысль → Эмоция. Меняя B, меняешь C.',practice:'Заполни ABC-дневник.'},
{title:'Искажения',theory:'**10 главных.** Обобщение, чтение мыслей, катастрофизация.',practice:'Найди 3 своих искажения.'},
{title:'Сократические',theory:'**Вопросы.** Что доказательства? Что альтернативы? Что было бы, если...?',practice:'Оспорь 3 мысли.'}
]},
{id:'pd_m2',emoji:'🌊',title:'ACT',desc:'Принятие и ответственность',
lessons:[
{title:'Принятие',theory:'**Не борись.** Прими эмоцию — она уйдёт.',practice:'Побудь с эмоцией 5 мин.'},
{title:'Ценности',theory:'**10 главных.** Что для тебя важно?',practice:'Определи 5 ценностей.'},
{title:'Действие',theory:'**В сторону ценностей.** Маленькие шаги.',practice:'Сделай 1 шаг.'}
]},
{id:'pd_m3',emoji:'🎭',title:'Психоанализ',desc:'Фрейд, Юнг',
lessons:[
{title:'Бессознательное',theory:'**Скрытое.** Влияет на поведение. Сны, оговорки, проекции.',practice:'Запиши сон.'},
{title:'Защиты',theory:'**5 механизмов.** Отрицание, проекция, рационализация, сублимация, вытеснение.',practice:'Заметь 1 защиту.'},
{title:'Архетипы',theory:'**Тень, Анима, Самость.** Юнг. Коллективное бессознательное.',practice:'Определи свой архетип.'}
]}
]};

/* ============ КУРС ЯЗЫКИ ============ */
var COURSE_LANGUAGES={
id:'langcourse',emoji:'🌍',title:'Языки мира',subtitle:'Испанский, немецкий, французский',desc:'Новые языки с нуля',
modules:[
{id:'lang_m1',emoji:'🇪🇸',title:'Испанский',desc:'Español',
lessons:[
{title:'Основы',theory:'**500 млн носителей.** 2-й по популярности в мире.',practice:'Выучи 50 слов.'},
{title:'Глаголы',theory:'**3 типа окончаний:** -ar, -er, -ir.',practice:'Спрягай hablar.'},
{title:'Разговор',theory:'**Hola, ¿cómo estás?** Базовые фразы.',practice:'Выучи 10 фраз.'}
]},
{id:'lang_m2',emoji:'🇩🇪',title:'Немецкий',desc:'Deutsch',
lessons:[
{title:'Основы',theory:'**100 млн носителей.** Язык инженерии и философии.',practice:'Выучи 100 слов.'},
{title:'Падежи',theory:'**4 падежа.** Nominativ, Akkusativ, Dativ, Genitiv.',practice:'Составь таблицу.'},
{title:'Разговор',theory:'**Hallo, wie geht\'s?** Простые фразы.',practice:'Выучи 10 фраз.'}
]},
{id:'lang_m3',emoji:'🇫🇷',title:'Французский',desc:'Français',
lessons:[
{title:'Основы',theory:'**300 млн носителей.** Язык культуры и дипломатии.',practice:'Выучи 50 слов.'},
{title:'Произношение',theory:'**Носовые звуки.** Сложные для русскоговорящих.',practice:'Читай вслух 10 мин.'},
{title:'Разговор',theory:'**Bonjour, comment ça va?** Базовые фразы.',practice:'Выучи 10 фраз.'}
]}
]};

/* ============ КУРС ДИЗАЙН ============ */
var COURSE_DESIGN={
id:'designcourse',emoji:'🎨',title:'Дизайн',subtitle:'UI/UX, композиция, цвет',desc:'Визуальный вкус',
modules:[
{id:'des_m1',emoji:'🎨',title:'Основы',desc:'Цвет и композиция',
lessons:[
{title:'Цвет',theory:'**3 свойства:** тон, насыщенность, яркость. Комплементарные — напротив.',practice:'Подбери палитру из 5 цветов.'},
{title:'Типографика',theory:'**2 шрифта макс.** Один для заголовков, другой для текста.',practice:'Составь пару шрифтов.'},
{title:'Композиция',theory:'**Правило третей.** Ключевое — на пересечении линий.',practice:'Разбери 5 картинок.'}
]},
{id:'des_m2',emoji:'📱',title:'UI/UX',desc:'Интерфейсы',
lessons:[
{title:'UX',theory:'**Ясность > красота.** Пользователь должен понимать без инструкции.',practice:'Разбери 3 приложения.'},
{title:'Figma',theory:'**Инструмент дизайна.** Компоненты, прототипы, автолейаут.',practice:'Сделай макет в Figma.'},
{title:'Прототип',theory:'**Кликабельный.** Проверь UX без разработки.',practice:'Собери прототип.'}
]},
{id:'des_m3',emoji:'🖼',title:'Графический',desc:'Брендинг',
lessons:[
{title:'Логотип',theory:'**Простота.** Узнаваемость важнее деталей.',practice:'Нарисуй 5 вариантов.'},
{title:'Брендинг',theory:'**Голос бренда.** Цвета, шрифты, тон общения.',practice:'Опиши бренд.'},
{title:'Презентация',theory:'**10 слайдов.** Один слайд — одна идея.',practice:'Сделай презентацию.'}
]}
]};

/* ============ КУРС КУЛИНАРИЯ ============ */
var COURSE_COOKING={
id:'cookingcourse',emoji:'🍳',title:'Кулинария',subtitle:'Готовить вкусно',desc:'Техники, блюда, соусы',
modules:[
{id:'cook_m1',emoji:'🔪',title:'Основы',desc:'Техника',
lessons:[
{title:'Ножи',theory:'**3 ножа хватит.** Шеф, овощной, для хлеба.',practice:'Наточи нож.'},
{title:'Термообработка',theory:'**Варка, жарка, запекание.** Разные техники — разные вкусы.',practice:'Изучи су-вид.'},
{title:'Специи',theory:'**База:** соль, перец, чеснок, лук, паприка.',practice:'Собери 5 специй.'}
]},
{id:'cook_m2',emoji:'🍝',title:'Блюда',desc:'Простые рецепты',
lessons:[
{title:'Паста',theory:'**Al dente.** 1 минута меньше упаковки.',practice:'Сделай карбонару.'},
{title:'Стейк',theory:'**3 мин с каждой стороны.** Отдохнуть 5 мин.',practice:'Пожарь стейк.'},
{title:'Ризотто',theory:'**Помешивай постоянно.** Бульон горячий.',practice:'Сделай ризотто.'}
]},
{id:'cook_m3',emoji:'🍰',title:'Продвинутое',desc:'Соусы и десерты',
lessons:[
{title:'5 соусов',theory:'**Французские:** бешамель, велюте, эспаньоль, голландез, томат.',practice:'Сделай бешамель.'},
{title:'Десерты',theory:'**3 текстуры:** хрустящее, кремовое, воздушное.',practice:'Сделай тирамису.'},
{title:'Хлеб',theory:'**4 ингредиента:** мука, вода, соль, дрожжи.',practice:'Испеки хлеб.'}
]}
]};

/* ============ КУРС СПОРТ ============ */
var COURSE_SPORT={
id:'sportcourse',emoji:'🏋️',title:'Спорт и тело',subtitle:'Сила и здоровье',desc:'Тренировки и питание',
modules:[
{id:'sp_m1',emoji:'💪',title:'Силовые',desc:'База',
lessons:[
{title:'Присед',theory:'**Король упражнений.** Ноги, ягодицы, корпус.',practice:'3×8.'},
{title:'Становая',theory:'**Спина прямая.** Не сутулься. Тяни ногами.',practice:'3×5.'},
{title:'Жим',theory:'**Лопатки сведены.** Не отрывай таз.',practice:'3×8.'}
]},
{id:'sp_m2',emoji:'🥗',title:'Питание',desc:'Топливо',
lessons:[
{title:'БЖУ',theory:'**1.6-2 г белка на кг.** Жиры 1 г/кг. Углеводы — остаток.',practice:'Посчитай своё.'},
{title:'Тайминг',theory:'**3-5 приёмов.** Белок после тренировки.',practice:'Составь меню.'},
{title:'Спортпит',theory:'**3 базовых:** протеин, креатин, витамин D.',practice:'Купи базовые.'}
]},
{id:'sp_m3',emoji:'😴',title:'Восстановление',desc:'Сон и отдых',
lessons:[
{title:'Сон',theory:'**7-9 ч.** Мышцы растут во сне.',practice:'Спи 8 ч.'},
{title:'Растяжка',theory:'**10 мин после тренировки.** Снимает зажимы.',practice:'Сделай после.'},
{title:'Deload',theory:'**4-6 недель.** Неделя с 50% нагрузкой.',practice:'Запланируй.'}
]}
]};

/* ============ КУРС МУЗЫКА ============ */
var COURSE_MUSIC={
id:'musiccourse',emoji:'🎵',title:'Музыка',subtitle:'Понимать и создавать',desc:'Теория и практика',
modules:[
{id:'mus_m1',emoji:'🎼',title:'Теория',desc:'Ноты и ритм',
lessons:[
{title:'Ноты',theory:'**7 нот:** до, ре, ми, фа, соль, ля, си.',practice:'Выучи гамму.'},
{title:'Ритм',theory:'**4/4 — базовый.** Считай: раз-и-два-и.',practice:'Отбей ритм.'},
{title:'Аккорды',theory:'**Трезвучия.** Мажор — весёлый. Минор — грустный.',practice:'C, Am, F, G.'}
]},
{id:'mus_m2',emoji:'🎸',title:'Инструменты',desc:'Игра',
lessons:[
{title:'Гитара',theory:'**6 струн.** Am, C, G, D — достаточно для многих песен.',practice:'Выучи 5 аккордов.'},
{title:'Пианино',theory:'**88 клавиш.** Начни с гаммы до-мажор.',practice:'Сыграй гамму.'},
{title:'Барабаны',theory:'**Ритм — основа.** Бочка, малый, хай-хэт.',practice:'Отбей 4/4.'}
]},
{id:'mus_m3',emoji:'🎧',title:'Слушание',desc:'Критическое',
lessons:[
{title:'Классика',theory:'**Бах, Моцарт, Бетховен.** Основа европейской музыки.',practice:'Послушай симфонию.'},
{title:'Джаз',theory:'**Импровизация.** Майлз Дэвис, Колтрейн.',practice:'Kind of Blue.'},
{title:'Современное',theory:'**Рок, поп, электроника.** Разные жанры.',practice:'Послушай 3 трека.'}
]}
]};

/* ============ КУРС ИСТОРИЯ ============ */
var COURSE_HISTORY={
id:'historycourse',emoji:'🏛',title:'История мира',subtitle:'От древности до наших дней',desc:'Ключевые события',
modules:[
{id:'hist_m1',emoji:'🏺',title:'Древность',desc:'До 500 г',
lessons:[
{title:'Цивилизации',theory:'**Месопотамия, Египет, Инд, Китай.** 4 речные цивилизации.',practice:'Изучи 1 цивилизацию.'},
{title:'Античность',theory:'**Греция, Рим.** Демократия, философия, право.',practice:'Сократ.'},
{title:'Религии',theory:'**4 мировые:** христианство, ислам, буддизм, иудаизм.',practice:'Изучи 1 религию.'}
]},
{id:'hist_m2',emoji:'⚔️',title:'Средневековье',desc:'500-1500',
lessons:[
{title:'Феодализм',theory:'**Король-вассал-рыцарь-крестьянин.**',practice:'Изучи 1 замок.'},
{title:'Крестовые',theory:'**8 походов.** 1096-1291.',practice:'Изучи 1 поход.'},
{title:'Возрождение',theory:'**Италия XV век.** Леонардо, Микеланджело.',practice:'Изучи 1 художника.'}
]},
{id:'hist_m3',emoji:'🌍',title:'Новое время',desc:'1500-1900',
lessons:[
{title:'Открытия',theory:'**Колумб, Магеллан.** Новый свет.',practice:'Изучи 1 маршрут.'},
{title:'Революции',theory:'**3 главные:** Французская, Американская, Промышленная.',practice:'Изучи 1.'},
{title:'Индустрия',theory:'**Паровая машина.** Начало промышленной эры.',practice:'Изучи 1 изобретение.'}
]},
{id:'hist_m4',emoji:'💻',title:'Современность',desc:'XX-XXI',
lessons:[
{title:'Войны',theory:'**2 мировые.** 1914-1918, 1939-1945.',practice:'Изучи 1 битву.'},
{title:'Холодная',theory:'**1947-1991.** США vs СССР.',practice:'Изучи 1 событие.'},
{title:'Интернет',theory:'**1991.** World Wide Web.',practice:'Изучи историю 1 компании.'}
]}
]};

/* ============ КУРС АСТРОНОМИЯ ============ */
var COURSE_ASTRO={
id:'astrocourse',emoji:'🔭',title:'Астрономия',subtitle:'Звёзды, планеты, вселенная',desc:'Космос и его тайны',
modules:[
{id:'ast_m1',emoji:'🌍',title:'Солнечная система',desc:'8 планет',
lessons:[
{title:'Планеты',theory:'**Меркурий, Венера, Земля, Марс, Юпитер, Сатурн, Уран, Нептун.**',practice:'Запомни порядок.'},
{title:'Луна',theory:'**384 400 км.** Приливы, фазы, влияние.',practice:'Наблюдай за Луной.'},
{title:'Солнце',theory:'**G-класс. 5 млрд лет.** Источник жизни.',practice:'Наблюдай пятна.'}
]},
{id:'ast_m2',emoji:'⭐',title:'Звёзды',desc:'Жизненный цикл',
lessons:[
{title:'Рождение',theory:'**Из облаков газа и пыли.** Гравитация сжимает.',practice:'Найди Орион.'},
{title:'Путь',theory:'**Карлик → гигант → белый карлик / чёрная дыра.**',practice:'Изучи Солнце.'},
{title:'Чёрные дыры',theory:'**Свет не выходит.** Sgr A* в центре Млечного пути.',practice:'Изучи Sgr A*.'}
]},
{id:'ast_m3',emoji:'🌌',title:'Галактики',desc:'Масштабы',
lessons:[
{title:'Млечный путь',theory:'**100-400 млрд звёзд.** Наша галактика.',practice:'Наблюдай в ясную ночь.'},
{title:'Типы',theory:'**3 типа:** спиральные, эллиптические, неправильные.',practice:'Изучи 1 тип.'},
{title:'Вселенная',theory:'**13.8 млрд лет.** Большой взрыв.',practice:'Изучи Большой взрыв.'}
]}
]};

/* ============ МАССИВ ВСЕХ НОВЫХ КУРСОВ ============ */
var ALL_NEW_COURSES=[
COURSE_IT,COURSE_LAW,COURSE_MED,COURSE_FINANCE,COURSE_PSYCH_DEEP,
COURSE_LANGUAGES,COURSE_DESIGN,COURSE_COOKING,COURSE_SPORT,
COURSE_MUSIC,COURSE_HISTORY,COURSE_ASTRO
];

console.log('[CONTENT 4/6 ✅] COURSES='+ALL_NEW_COURSES.length+' (IT='+COURSE_IT.modules.length+' модулей, LAW='+COURSE_LAW.modules.length+', MED='+COURSE_MED.modules.length+', FIN='+COURSE_FINANCE.modules.length+', PSYCH='+COURSE_PSYCH_DEEP.modules.length+', LANG='+COURSE_LANGUAGES.modules.length+', DESIGN='+COURSE_DESIGN.modules.length+', COOK='+COURSE_COOKING.modules.length+', SPORT='+COURSE_SPORT.modules.length+', MUSIC='+COURSE_MUSIC.modules.length+', HIST='+COURSE_HISTORY.modules.length+', ASTRO='+COURSE_ASTRO.modules.length+')');
/* ============================================================
   LIFE OS — CONTENT.js v44 — ПОЛНЫЙ
   ЧАСТЬ 5/6: Достижения, Recovery, Хелперы
   ============================================================ */

/* ============ ACHIEVEMENTS (20 базовых — для старой совместимости) ============ */
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

/* ============ RECOVERY LIBRARY (200, полная версия — уже есть в части 2, но здесь расширение) ============ */
/* Уже определено в части 2. Здесь только доп. данные для расширения */

/* ============ ХЕЛПЕРЫ ============ */
function getTodayWisdomSafe(){
  if(typeof DAILY_WISDOMS==='undefined'||!DAILY_WISDOMS.length)return{text:'Начни сейчас.',author:'Неизвестный',action:'Сделай 1 шаг'};
  var idx=Math.floor(Date.now()/86400000)%DAILY_WISDOMS.length;
  return DAILY_WISDOMS[idx];
}
window.getTodayWisdom=getTodayWisdomSafe;

function getTodayChallengesSafe(){
  if(typeof DAILY_CHALLENGES==='undefined'||!DAILY_CHALLENGES.length)return[];
  var dayIdx=Math.floor(Date.now()/86400000);
  var result=[];
  for(var i=0;i<4;i++)result.push(DAILY_CHALLENGES[(dayIdx+i)%DAILY_CHALLENGES.length]);
  return result;
}
window.getTodayChallenges=getTodayChallengesSafe;

function getLevelById(id){
  if(typeof LEARNING_LEVELS==='undefined')return null;
  for(var i=0;i<LEARNING_LEVELS.length;i++){
    if(LEARNING_LEVELS[i].id===id)return LEARNING_LEVELS[i];
  }
  return null;
}
window.getLevelById=getLevelById;

function getEnglishByLevel(level){
  if(typeof ENGLISH_125==='undefined')return[];
  return ENGLISH_125.filter(function(l){return l.level===level});
}
window.getEnglishByLevel=getEnglishByLevel;

function getSkillsByCategory(cat){
  if(typeof SKILLS_LIBRARY==='undefined')return[];
  if(!cat||cat==='all')return SKILLS_LIBRARY.slice();
  return SKILLS_LIBRARY.filter(function(s){return s.cat===cat});
}
window.getSkillsByCategory=getSkillsByCategory;

function getDetoxDay(day){
  if(typeof DETOX_COURSE==='undefined')return null;
  for(var i=0;i<DETOX_COURSE.length;i++){
    if(DETOX_COURSE[i].day===day)return DETOX_COURSE[i];
  }
  return null;
}
window.getDetoxDay=getDetoxDay;

function getVisionExercise(id){
  if(typeof VISION_EXERCISES==='undefined')return null;
  for(var i=0;i<VISION_EXERCISES.length;i++){
    if(VISION_EXERCISES[i].id===id)return VISION_EXERCISES[i];
  }
  return null;
}
window.getVisionExercise=getVisionExercise;

function getHormoneById(id){
  if(typeof HORMONES==='undefined')return null;
  for(var i=0;i<HORMONES.length;i++){
    if(HORMONES[i].id===id)return HORMONES[i];
  }
  return null;
}
window.getHormoneById=getHormoneById;

function getEtiquetteByCat(cat){
  if(typeof ETIQUETTE_TOPICS==='undefined')return[];
  if(!cat||cat==='all')return ETIQUETTE_TOPICS.slice();
  return ETIQUETTE_TOPICS.filter(function(t){return t.cat===cat});
}
window.getEtiquetteByCat=getEtiquetteByCat;

function getCourseById(id){
  if(typeof ALL_NEW_COURSES==='undefined')return null;
  for(var i=0;i<ALL_NEW_COURSES.length;i++){
    if(ALL_NEW_COURSES[i].id===id)return ALL_NEW_COURSES[i];
  }
  return null;
}
window.getCourseById=getCourseById;

console.log('[CONTENT 5/6 ✅] ACHIEVEMENTS='+ACHIEVEMENTS.length+' RECOVERY='+RECOVERY_LIBRARY.length+' VISION_HELPERS=OK DETOX_HELPERS=OK COURSE_HELPERS=OK');
/* ============================================================
   LIFE OS — CONTENT.js v44 — ПОЛНЫЙ
   ЧАСТЬ 6/6: ЭКСПОРТ ВСЕГО + ФИНАЛЬНАЯ ПРОВЕРКА
   ============================================================ */

/* ============ ЭКСПОРТ ВСЕХ ДАННЫХ В WINDOW ============ */
window.THEMES = THEMES;
window.DOMAINS = DOMAINS;
window.DAILY_WISDOMS = DAILY_WISDOMS;
window.DAILY_CHALLENGES = DAILY_CHALLENGES;
window.WORK_MODES = WORK_MODES;
window.SURVEY_QUESTIONS = SURVEY_QUESTIONS;
window.PERSONAS = PERSONAS;
window.TABS = TABS;
window.QUICK_TABS = QUICK_TABS;
window.LEARNING_LEVELS = LEARNING_LEVELS;
window.HABIT_CATEGORIES = HABIT_CATEGORIES;
window.HABIT_TEMPLATES = HABIT_TEMPLATES;
window.HABIT_SCHEDULE_TYPES = HABIT_SCHEDULE_TYPES;
window.WEEK_DAYS = WEEK_DAYS;
window.HABIT_DURATIONS = HABIT_DURATIONS;
window.HABIT_TIME_SLOTS = HABIT_TIME_SLOTS;
window.HABIT_AUTO_TRACK = HABIT_AUTO_TRACK;
window.ENGLISH_125 = ENGLISH_125;
window.ENGLISH_TESTS = ENGLISH_TESTS;
window.SKILLS_CATEGORIES = SKILLS_CATEGORIES;
window.SKILLS_LIBRARY = SKILLS_LIBRARY;
window.METHODS_LIBRARY = METHODS_LIBRARY;
window.RECOVERY_LIBRARY = RECOVERY_LIBRARY;
window.PSYCHOLOGY_TOPICS = PSYCHOLOGY_TOPICS;
window.THINKING_TOPICS = THINKING_TOPICS;
window.ETIQUETTE_TOPICS = ETIQUETTE_TOPICS;
window.HORMONES = HORMONES;
window.WEALTH_MODULES = WEALTH_MODULES;
window.VISION_EXERCISES = VISION_EXERCISES;
window.DETOX_COURSE = DETOX_COURSE;
window.ACHIEVEMENTS = ACHIEVEMENTS;
window.COURSE_IT = COURSE_IT;
window.COURSE_LAW = COURSE_LAW;
window.COURSE_MED = COURSE_MED;
window.COURSE_FINANCE = COURSE_FINANCE;
window.COURSE_PSYCH_DEEP = COURSE_PSYCH_DEEP;
window.COURSE_LANGUAGES = COURSE_LANGUAGES;
window.COURSE_DESIGN = COURSE_DESIGN;
window.COURSE_COOKING = COURSE_COOKING;
window.COURSE_SPORT = COURSE_SPORT;
window.COURSE_MUSIC = COURSE_MUSIC;
window.COURSE_HISTORY = COURSE_HISTORY;
window.COURSE_ASTRO = COURSE_ASTRO;
window.ALL_NEW_COURSES = ALL_NEW_COURSES;

/* ============ ПРОВЕРКА ЦЕЛОСТНОСТИ ============ */
function checkContentIntegrity(){
  var issues=[];
  if(!THEMES||THEMES.length<50)issues.push('THEMES<50');
  if(!DOMAINS||DOMAINS.length<10)issues.push('DOMAINS<10');
  if(!DAILY_WISDOMS||DAILY_WISDOMS.length<30)issues.push('WISDOMS<30');
  if(!DAILY_CHALLENGES||DAILY_CHALLENGES.length<15)issues.push('CHALLENGES<15');
  if(!LEARNING_LEVELS||LEARNING_LEVELS.length<5)issues.push('LEVELS<5');
  if(!HABIT_TEMPLATES||HABIT_TEMPLATES.length<100)issues.push('HABITS<100');
  if(!ENGLISH_125||ENGLISH_125.length<100)issues.push('ENGLISH<100');
  if(!SKILLS_LIBRARY||SKILLS_LIBRARY.length<30)issues.push('SKILLS<30');
  if(!DETOX_COURSE||DETOX_COURSE.length<60)issues.push('DETOX<60');
  if(!VISION_EXERCISES||VISION_EXERCISES.length<50)issues.push('VISION<50');
  if(!ALL_NEW_COURSES||ALL_NEW_COURSES.length<12)issues.push('COURSES<12');
  if(!PSYCHOLOGY_TOPICS||PSYCHOLOGY_TOPICS.length<50)issues.push('PSYCH<50');
  if(!THINKING_TOPICS||THINKING_TOPICS.length<50)issues.push('THINKING<50');
  if(!ETIQUETTE_TOPICS||ETIQUETTE_TOPICS.length<50)issues.push('ETIQ<50');
  if(!HORMONES||HORMONES.length<15)issues.push('HORMONES<15');
  if(!RECOVERY_LIBRARY||RECOVERY_LIBRARY.length<100)issues.push('RECOVERY<100');
  return issues;
}
window.checkContentIntegrity = checkContentIntegrity;

/* ============ СВОДКА ============ */
function getContentSummary(){
  return {
    themes: THEMES.length,
    domains: DOMAINS.length,
    wisdoms: DAILY_WISDOMS.length,
    challenges: DAILY_CHALLENGES.length,
    levels: LEARNING_LEVELS.length,
    habits: HABIT_TEMPLATES.length,
    english: ENGLISH_125.length,
    skills: SKILLS_LIBRARY.length,
    methods: METHODS_LIBRARY.length,
    recovery: RECOVERY_LIBRARY.length,
    psychology: PSYCHOLOGY_TOPICS.length,
    thinking: THINKING_TOPICS.length,
    etiquette: ETIQUETTE_TOPICS.length,
    hormones: HORMONES.length,
    wealth: WEALTH_MODULES.length,
    vision: VISION_EXERCISES.length,
    detox: DETOX_COURSE.length,
    courses: ALL_NEW_COURSES.length,
    achievements: ACHIEVEMENTS.length
  };
}
window.getContentSummary = getContentSummary;

/* ============ ФИНАЛЬНЫЙ ЛОГ ============ */
(function(){
  try{
    var s = getContentSummary();
    var issues = checkContentIntegrity();
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('[CONTENT ✅] LIFE OS CONTENT v44 ЗАГРУЖЕН');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('[CONTENT ✅] Темы: '+s.themes);
    console.log('[CONTENT ✅] Домены: '+s.domains);
    console.log('[CONTENT ✅] Мудрости: '+s.wisdoms);
    console.log('[CONTENT ✅] Челленджи: '+s.challenges);
    console.log('[CONTENT ✅] Уровни обучения: '+s.levels);
    console.log('[CONTENT ✅] Шаблоны привычек: '+s.habits);
    console.log('[CONTENT ✅] English: '+s.english);
    console.log('[CONTENT ✅] Навыки: '+s.skills);
    console.log('[CONTENT ✅] Методики: '+s.methods);
    console.log('[CONTENT ✅] Восстановление: '+s.recovery);
    console.log('[CONTENT ✅] Психология: '+s.psychology);
    console.log('[CONTENT ✅] Мышление: '+s.thinking);
    console.log('[CONTENT ✅] Этикет: '+s.etiquette);
    console.log('[CONTENT ✅] Гормоны: '+s.hormones);
    console.log('[CONTENT ✅] Богатство: '+s.wealth);
    console.log('[CONTENT ✅] Зрение: '+s.vision);
    console.log('[CONTENT ✅] Детокс: '+s.detox);
    console.log('[CONTENT ✅] Новые курсы: '+s.courses);
    console.log('[CONTENT ✅] Достижения (база): '+s.achievements);
    if(issues.length){
      console.warn('[CONTENT ⚠️] ПРОБЛЕМЫ:', issues);
    } else {
      console.log('[CONTENT ✅] Все проверки пройдены ✓');
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }catch(e){
    console.error('[CONTENT] Ошибка финального лога:', e);
  }
})();