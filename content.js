'use strict';
/* ============================================================
   LIFE OS — CONTENT.js v46 — ЧАСТЬ 1/6
   Темы (74), Домены (10), Мудрости (60), Челленджи (24),
   Work Modes (4), Опрос (10), Персоны (20), Табы (7),
   Quick Tabs, LEAGUE_TIERS (5), PET_STAGES (5), XP_SOURCES (18)
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

/* ============ WORK MODES (4) ============ */
var WORK_MODES=[
{id:'work',name:'Работа',emoji:'💼',desc:'Задачи и продуктивность'},
{id:'rest',name:'Отдых',emoji:'🌿',desc:'Досуг и здоровье'},
{id:'sleep',name:'Сон',emoji:'🌙',desc:'Медитация и сон'},
{id:'study',name:'Учёба',emoji:'📚',desc:'Обучение и английский'}
];

/* ============ SURVEY (10 вопросов) ============ */
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

/* ============ PERSONAS (20) ============ */
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
teacher:{name:'Учитель',emoji:'📚',prompt:'Ты — AI-Учитель. Объясняю просто с примерами.'},
friendly:{name:'Друг',emoji:'🤝',prompt:'Ты — дружелюбный AI-компаньон. Тёплый тон, поддержка, мягкие советы. Без нравоучений. 100-180 слов.'},
balanced:{name:'Баланс',emoji:'⚖️',prompt:'Ты — AI-наставник в балансном тоне. Поддержка + конкретика. Честно и по делу, но с заботой. 150-220 слов.'},
strict:{name:'Строгий',emoji:'🔥',prompt:'Ты — требовательный AI-наставник. Прямо, жёстко, без оправданий. Требую результат. 100-150 слов.'},
philosophical:{name:'Философ',emoji:'🏛',prompt:'Ты — AI-философ. Стоики, экзистенциализм, буддизм. Смыслы, ценности, глубина. 180-250 слов.'},
mentor:{name:'Ментор',emoji:'🎓',prompt:'Ты — AI-ментор. Вопросы > ответы. Socratic method. Помогаю найти своё. 150-200 слов.'},
critic:{name:'Критик',emoji:'🎯',prompt:'Ты — AI-критик. Показываю слепые зоны, слабые места, риски. Без смягчений, но конструктивно. 150-200 слов.'},
motivator:{name:'Мотиватор',emoji:'🚀',prompt:'Ты — AI-мотиватор. Энергия, вдохновение, действие. Каждое сообщение заканчивается призывом к действию. 100-150 слов.'},
analyst:{name:'Аналитик',emoji:'📊',prompt:'Ты — AI-аналитик. Данные, цифры, паттерны. Разбираю прогресс. Без эмоций, только факты. 150-200 слов.'},
friend:{name:'Дружеский',emoji:'💚',prompt:'Ты — тёплый AI-друг. Мягко, поддерживающе, с заботой. Как лучший друг. 120-180 слов.'},
parent:{name:'Родитель',emoji:'👨‍👩‍👧',prompt:'Ты — заботливый AI-родитель. Мудро, с опытом, без осуждения. 150-200 слов.'}
};

/* ============ TABS (7) ============ */
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

/* ============ LEAGUE_TIERS (5) ============ */
var LEAGUE_TIERS=[
{id:'bronze',emoji:'🥉',name:'Бронза',color:'#cd7f32',weeklyGoal:100,reward:50,minXP:0},
{id:'silver',emoji:'🥈',name:'Серебро',color:'#c0c0c0',weeklyGoal:250,reward:100,minXP:500},
{id:'gold',emoji:'🥇',name:'Золото',color:'#ffd700',weeklyGoal:500,reward:200,minXP:1500},
{id:'platinum',emoji:'💎',name:'Платина',color:'#a78bfa',weeklyGoal:1000,reward:500,minXP:3500},
{id:'diamond',emoji:'💠',name:'Алмаз',color:'#4dd4ff',weeklyGoal:2000,reward:1000,minXP:7000}
];

/* ============ PET_STAGES (5) ============ */
var PET_STAGES=[
{id:1,emoji:'🥚',name:'Яйцо',minXP:0,maxXP:100,desc:'Спит, ждёт'},
{id:2,emoji:'🐣',name:'Птенец',minXP:100,maxXP:300,desc:'Учится'},
{id:3,emoji:'🐥',name:'Птенец+',minXP:300,maxXP:700,desc:'Растёт'},
{id:4,emoji:'🦅',name:'Орёл',minXP:700,maxXP:1500,desc:'Летает'},
{id:5,emoji:'🐲',name:'Дракон',minXP:1500,maxXP:null,desc:'Мастер'}
];

/* ============ XP_SOURCES (18) ============ */
var XP_SOURCES=[
{id:'habit_tick',emoji:'✅',name:'Отметка привычки',xp:5,sphere:'all'},
{id:'habit_streak_7',emoji:'🔥',name:'Streak привычки 7 дней',xp:25,sphere:'all'},
{id:'habit_streak_30',emoji:'🔥',name:'Streak привычки 30 дней',xp:100,sphere:'all'},
{id:'task_done',emoji:'📋',name:'Выполнение задачи',xp:10,sphere:'career'},
{id:'task_3day',emoji:'⚡',name:'3 задачи за день',xp:15,sphere:'career'},
{id:'lesson_done',emoji:'🎓',name:'Урок обучения',xp:10,sphere:'growth'},
{id:'module_done',emoji:'📚',name:'Модуль обучения',xp:30,sphere:'growth'},
{id:'course_done',emoji:'🏆',name:'Курс обучения',xp:100,sphere:'growth'},
{id:'vision_complex',emoji:'👁',name:'Комплекс зрения',xp:5,sphere:'health'},
{id:'vision_62day',emoji:'🌟',name:'День 62-дневного пути',xp:15,sphere:'health'},
{id:'sphere_score',emoji:'🎯',name:'Оценка сфер',xp:10,sphere:'all'},
{id:'weekly_review',emoji:'📊',name:'Недельный разбор',xp:20,sphere:'all'},
{id:'daily_review',emoji:'🌙',name:'Вечерний обзор',xp:15,sphere:'all'},
{id:'game_play',emoji:'🎮',name:'Игра в игры',xp:5,sphere:'growth'},
{id:'game_record',emoji:'🏅',name:'Новый рекорд',xp:25,sphere:'growth'},
{id:'detox_day',emoji:'🧘',name:'День без срыва',xp:10,sphere:'digital'},
{id:'fsrs_review',emoji:'🃏',name:'Повтор FSRS-карточки',xp:3,sphere:'growth'},
{id:'return_after_break',emoji:'💪',name:'Возврат после срыва',xp:15,sphere:'all'}
];

/* ============ ЭКСПОРТ ============ */
window.THEMES=THEMES;
window.DOMAINS=DOMAINS;
window.DAILY_WISDOMS=DAILY_WISDOMS;
window.DAILY_CHALLENGES=DAILY_CHALLENGES;
window.WORK_MODES=WORK_MODES;
window.SURVEY_QUESTIONS=SURVEY_QUESTIONS;
window.PERSONAS=PERSONAS;
window.TABS=TABS;
window.QUICK_TABS=QUICK_TABS;
window.LEAGUE_TIERS=LEAGUE_TIERS;
window.PET_STAGES=PET_STAGES;
window.XP_SOURCES=XP_SOURCES;

/* ============================================================
   LIFE OS — CONTENT.js v46 — ЧАСТЬ 2/6
   Обучение (5 уровней × 3 модуля × 3 урока = 45 уроков),
   English 125, English Tests, Skills (60), Methods (45),
   Recovery (200), Etiquette (100), Hormones (20), Wealth (20)
   ============================================================ */

/* ============ LEARNING LEVELS (5 × 3 × 3 = 45 уроков) ============ */
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
  var methods=['Pomodoro','Deep Work','GTD','Эйзенхауэр','Eat Frog','Time-block','2 минуты','Фейнман','Anki','Cornell','Mind Map','SQ3R','Дворец памяти','N-back','Box breathing','4-7-8','Wim Hof','Медитация','Body scan','Благодарность','Дневник','Икигай','Петля привычки','Habit stacking','80/20','Поток','Memento Mori','20-20-20','Холодный душ','SBI','ННО','GROW','SMART','OKR','Кайдзен','5S','PDCA','OODA','First Principles','Инверсия','Второй порядок','Антихрупкость','BATNA','Win-win','Кайдзен'];
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

/* ============ ЭКСПОРТ ============ */
window.LEARNING_LEVELS=LEARNING_LEVELS;
window.ENGLISH_125=ENGLISH_125;
window.ENGLISH_TESTS=ENGLISH_TESTS;
window.SKILLS_CATEGORIES=SKILLS_CATEGORIES;
window.SKILLS_LIBRARY=SKILLS_LIBRARY;
window.METHODS_LIBRARY=METHODS_LIBRARY;
window.RECOVERY_LIBRARY=RECOVERY_LIBRARY;
window.ETIQUETTE_TOPICS=ETIQUETTE_TOPICS;
window.HORMONES=HORMONES;
window.WEALTH_MODULES=WEALTH_MODULES;

console.log('[CONTENT 2/6 ✅] LEVELS='+LEARNING_LEVELS.length+' ENGLISH='+ENGLISH_125.length+' SKILLS='+SKILLS_LIBRARY.length+' METHODS='+METHODS_LIBRARY.length+' RECOVERY='+RECOVERY_LIBRARY.length+' ETIQUETTE='+ETIQUETTE_TOPICS.length+' HORMONES='+HORMONES.length+' WEALTH='+WEALTH_MODULES.length);
