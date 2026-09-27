'use strict';
/* ============================================================
   LIFE OS — CONTENT.js v42 — ЧАСТЬ 1/6
   Темы (62 + 12 Halloween), Мудрости, Челленджи, Гормоны
   ============================================================ */

/* ============ ТЕМЫ (62 + 12 Halloween = 74) ============ */
var THEMES=[
/* ============ 12 HALLOWEEN-ТЕМ ============ */
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
/* ============ КЛАССИКА ============ */
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
{id:'physical',emoji:'💪',name:'Физическое',color:'#ff7ba9',desc:'Тело, сила, выносливость'},
{id:'mental',emoji:'🧠',name:'Ментальное',color:'#4dd4ff',desc:'Фокус, память, ясность'},
{id:'emotional',emoji:'❤️',name:'Эмоциональное',color:'#ff6b6b',desc:'Чувства, стресс, баланс'},
{id:'spiritual',emoji:'🕊',name:'Духовное',color:'#b394ff',desc:'Смысл, ценности, вера'},
{id:'financial',emoji:'💰',name:'Финансовое',color:'#ffcc4d',desc:'Бюджет, инвестиции, доход'},
{id:'career',emoji:'💼',name:'Карьерное',color:'#3ddc97',desc:'Навыки, позиция, рост'},
{id:'social',emoji:'👥',name:'Социальное',color:'#c4b5fd',desc:'Семья, друзья, связи'},
{id:'environment',emoji:'🏠',name:'Среда',color:'#a4e7ff',desc:'Пространство, свет, порядок'},
{id:'recovery',emoji:'⏰',name:'Восстановление',color:'#4dd4ff',desc:'Сон, отдых, энергия'},
{id:'digital',emoji:'📱',name:'Цифровое',color:'#ff88cc',desc:'Экран, детокс, данные'}
];

/* ============ МУДРОСТИ (60) ============ */
var DAILY_WISDOMS=[
{text:'Ты не ленивый. Ты либо устал, либо не видишь смысла, либо боишься.',author:'Неизвестный',action:'Запиши, что из 3 — твоё прямо сейчас'},
{text:'Дисциплина — это выбор между тем, что хочешь сейчас, и тем, что хочешь больше всего.',author:'Авраам Линкольн',action:'Назови 1 желание и 1 цель на год'},
{text:'Мы — то, что делаем постоянно. Совершенство — не действие, а привычка.',author:'Аристотель',action:'Добавь 1 привычку на сегодня'},
{text:'Между стимулом и реакцией есть пространство. В нём — наша свобода.',author:'Виктор Франкл',action:'Сделай паузу 6 секунд'},
{text:'Счастье — это не то, что ты имеешь, а то, что ты чувствуешь.',author:'Даг Хэммершолд',action:'Запиши 3 благодарности'},
{text:'Ты не можешь вернуться и изменить начало, но можешь начать сейчас и изменить конец.',author:'К.С. Льюис',action:'Сделай 1 действие за 2 минуты'},
{text:'Единственный способ делать великую работу — любить то, что делаешь.',author:'Стив Джобс',action:'Найди 1 вещь, которую делаешь с любовью'},
{text:'Сложнее всего начать действовать, всё остальное зависит только от упорства.',author:'Амелия Эрхарт',action:'Начни с 2 минут'},
{text:'Тот, кто владеет собой, владеет миром.',author:'Сенека',action:'Заметь, где потерял контроль'},
{text:'Мы становимся тем, о чём думаем.',author:'Будда',action:'Понаблюдай 5 минут за мыслями'},
{text:'Победа над собой — величайшая победа.',author:'Платон',action:'Сделай 1 сложное дело'},
{text:'Секрет перемен — сосредоточить энергию не на борьбе со старым, а на создании нового.',author:'Сократ',action:'Опиши, что ты создаёшь'},
{text:'Если хочешь изменить мир — начни с себя.',author:'Махатма Ганди',action:'Измени 1 маленькую вещь'},
{text:'Жизнь — это 10% того, что происходит, и 90% того, как мы реагируем.',author:'Чарльз Свиндолл',action:'Пересмотри 1 реакцию'},
{text:'Каждый день — это новая возможность изменить свою жизнь.',author:'Неизвестный',action:'Что ты изменишь сегодня?'},
{text:'Не сравнивай себя с другими. Сравнивай с собой вчерашним.',author:'Джордан Питерсон',action:'Оцени рост за неделю'},
{text:'Успех — это сумма маленьких усилий, повторяемых день за днём.',author:'Роберт Кольер',action:'Сделай 1 маленькое усилие'},
{text:'Всё, что ты можешь сделать, — это начать.',author:'Неизвестный',action:'Начни прямо сейчас'},
{text:'Измени свои мысли — изменится твоя жизнь.',author:'Уэйн Дайер',action:'Замени 1 негативную мысль'},
{text:'Великие дела не делаются в зоне комфорта.',author:'Неизвестный',action:'Сделай 1 дело вне комфорта'},
{text:'Страх — это не то, что ты должен бояться. Это то, что ты должен преодолеть.',author:'Неизвестный',action:'Сделай 1 страшное дело'},
{text:'Ты сильнее, чем кажется. Смелее, чем верится. Умнее, чем думается.',author:'А.А. Милн',action:'Вспомни 1 прошлую победу'},
{text:'Утро определяет день.',author:'Робин Шарма',action:'Сделай утренний ритуал'},
{text:'Не трать время на сожаления. Используй его на действие.',author:'Неизвестный',action:'Сделай 1 действие'},
{text:'Ты — не свои мысли. Ты — тот, кто их наблюдает.',author:'Экхарт Толле',action:'5 минут наблюдай мысли'},
{text:'Действие — главный ключ к успеху.',author:'Пабло Пикассо',action:'Сделай 1 конкретное действие'},
{text:'Стресс — не то, что происходит, а то, что ты думаешь о происходящем.',author:'Эндрю Бернстейн',action:'Пересмотри 1 ситуацию'},
{text:'Разница между тем, кто ты, и тем, кем хочешь быть — в том, что ты делаешь.',author:'Неизвестный',action:'Сделай 1 шаг к цели'},
{text:'Сон — основа всего. Приоритет №1.',author:'Мэттью Уокер',action:'Ляг на 30 мин раньше'},
{text:'Каждый день делай что-то, что тебя пугает.',author:'Элеонора Рузвельт',action:'Сделай 1 страшное дело'},
{text:'Один процент лучше каждый день — вот и весь секрет.',author:'Джеймс Клир',action:'Улучши 1 вещь на 1%'},
{text:'Сначала пойми, потом будь понятым.',author:'Стивен Кови',action:'Послушай кого-то 5 минут'},
{text:'Твоя жизнь — результат твоих решений.',author:'Неизвестный',action:'Прими 1 решение осознанно'},
{text:'Окружение определяет мышление.',author:'Джим Рон',action:'Убери 1 отвлекающий фактор'},
{text:'Заботься о теле — это единственное место, где тебе жить.',author:'Джим Рон',action:'Сделай 1 действие для тела'},
{text:'Ты не найдёшь себя в тишине, если не дашь себе её.',author:'Неизвестный',action:'10 минут тишины'},
{text:'Отдых — часть работы.',author:'Неизвестный',action:'Сделай перерыв 15 минут'},
{text:'Смысл жизни в том, чтобы дать ей смысл.',author:'Неизвестный',action:'Запиши 3 важные вещи'},
{text:'Иди медленно, но не останавливайся.',author:'Китайская пословица',action:'Сделай 1 маленький шаг'},
{text:'Маленькие шаги ведут к большим переменам.',author:'Неизвестный',action:'Сделай 1 маленький шаг'},
{text:'Заботься о глазах — экран вредит зрению.',author:'Офтальмология',action:'Сделай гимнастику для глаз'},
{text:'Правило 20-20-20: каждые 20 мин — 20 сек на 6 м.',author:'Офтальмология',action:'Запусти таймер'},
{text:'Пальминг — 5 минут тепла для глаз.',author:'Бейтс',action:'Сделай пальминг 3 минуты'},
{text:'Моргай чаще — глаза сохнут от экрана.',author:'Офтальмология',action:'Моргай каждые 10 мин'},
{text:'Смотри вдаль — мышцы глаз расслабляются.',author:'Офтальмология',action:'5 минут смотри в окно'},
{text:'Солнце и зрение: 10 мин утром без очков.',author:'Офтальмология',action:'Выйди на 10 мин утром'},
{text:'Черника, морковь, рыба — для глаз.',author:'Нутрициология',action:'Съешь что-то для глаз'},
{text:'Гимнастика для глаз — 5 упражнений утром.',author:'Бейтс',action:'Сделай 5 упражнений'},
{text:'Экран на расстоянии 50-70 см от глаз.',author:'Офтальмология',action:'Отодвинь экран'},
{text:'Тёмный режим снижает нагрузку на глаза.',author:'Офтальмология',action:'Включи тёмный режим'},
{text:'Хочешь изменить жизнь — измени распорядок дня.',author:'Джим Рон',action:'Пересмотри 1 пункт распорядка'},
{text:'Учись у всех, не копируй никого.',author:'Неизвестный',action:'Найди 1 урок'},
{text:'Деньги — инструмент, не цель.',author:'Неизвестный',action:'Запиши 1 цель и её цену'},
{text:'Каждое утро — шанс начать заново.',author:'Неизвестный',action:'Составь утренний ритуал'},
{text:'Твоё тело — твой дом. Убирай его.',author:'Неизвестный',action:'Сделай 1 для тела'},
{text:'Пока дышишь — можешь расти.',author:'Неизвестный',action:'Найди 1 урок сегодня'},
{text:'Не бойся медленно. Бойся стоять.',author:'Китайская пословица',action:'Сделай 1 маленький шаг'},
{text:'Отношения > вещи.',author:'Неизвестный',action:'Позвони 1 близкому'},
{text:'Ошибка — не провал, а данные.',author:'Томас Эдисон',action:'Запиши 1 урок из ошибки'},
{text:'Каждый вечер — рефлексия дня.',author:'Неизвестный',action:'3 победы + 1 урок'},
{text:'Кто рано встаёт, тому Бог даёт.',author:'Пословица',action:'Ляг раньше на 30 мин'}
];

/* ============ ЧЕЛЛЕНДЖИ (24) ============ */
var DAILY_CHALLENGES=[
{id:'ch_no_social_1h',title:'1 час без соцсетей',desc:'Не открывай соцсети 1 час',reward:20},
{id:'ch_3_tasks',title:'3 задачи',desc:'Выполни 3 задачи',reward:30},
{id:'ch_water_8',title:'8 стаканов воды',desc:'Выпей 8 стаканов',reward:25},
{id:'ch_no_phone_morning',title:'Утро без телефона',desc:'30 минут без телефона',reward:25},
{id:'ch_meditation_10',title:'10 минут медитации',desc:'Медитируй 10 минут',reward:20},
{id:'ch_walk_30',title:'Прогулка 30 минут',desc:'Прогуляйся 30 мин',reward:25},
{id:'ch_deep_work_90',title:'Deep Work 90',desc:'90 минут глубокой работы',reward:40},
{id:'ch_read_20',title:'Чтение 20 мин',desc:'Прочти 20 минут',reward:20},
{id:'ch_journal',title:'Дневник вечером',desc:'Запиши 3 победы',reward:20},
{id:'ch_workout',title:'Тренировка',desc:'Сделай тренировку',reward:35},
{id:'ch_no_sugar',title:'Без сахара',desc:'День без сахара',reward:25},
{id:'ch_gratitude_3',title:'3 благодарности',desc:'Запиши 3 благодарности',reward:15},
{id:'ch_english_15',title:'Английский 15 мин',desc:'Позанимайся английским',reward:20},
{id:'ch_eye_gym',title:'Гимнастика глаз',desc:'10 упражнений',reward:15},
{id:'ch_palming',title:'Пальминг',desc:'5 минут пальминга',reward:10},
{id:'ch_20_20_20',title:'Правило 20-20-20',desc:'Соблюдай весь день',reward:20},
{id:'ch_sleep_early',title:'Сон до 23:00',desc:'Ляг до 23:00',reward:25},
{id:'ch_cold_shower',title:'Холодный душ',desc:'2 минуты холодной воды',reward:25},
{id:'ch_nature_30',title:'Природа 30 мин',desc:'Прогулка на природе',reward:20},
{id:'ch_no_phone_bed',title:'Телефон вне спальни',desc:'Ночь без телефона',reward:25},
{id:'ch_no_screen_morning',title:'Экран ноль до 10:00',desc:'2 часа без экрана утром',reward:30},
{id:'ch_screen_under_2h',title:'Экран <2ч',desc:'Уложись в 2 часа экрана',reward:40},
{id:'ch_digital_sabbath',title:'Цифровая суббота',desc:'Полдня без соцсетей',reward:35},
{id:'ch_screen_free_hour',title:'1 час без экрана',desc:'Полностью без экрана 1 час',reward:20}
];

function getTodayChallenges(){
  var dayIdx=Math.floor(Date.now()/86400000);
  var result=[];
  for(var i=0;i<4;i++)result.push(DAILY_CHALLENGES[(dayIdx+i)%DAILY_CHALLENGES.length]);
  return result;
}

/* ============ WORK MODES ============ */
var WORK_MODES=[
{id:'work',name:'Работа',emoji:'💼',desc:'Только задачи'},
{id:'rest',name:'Отдых',emoji:'🌿',desc:'Досуг и здоровье'},
{id:'sleep',name:'Сон',emoji:'🌙',desc:'Медитация и сон'},
{id:'study',name:'Учёба',emoji:'📚',desc:'Обучение и английский'}
];

/* ============ SURVEY ============ */
var SURVEY_QUESTIONS=[
{id:'name',question:'Как тебя зовут?',type:'text'},
{id:'age',question:'Сколько тебе лет?',type:'options',options:[{value:'18-25',label:'18-25',emoji:'🧑'},{value:'26-35',label:'26-35',emoji:'👨‍💼'},{value:'36-45',label:'36-45',emoji:'👩‍💼'},{value:'46+',label:'46+',emoji:'🧓'}]},
{id:'occupation',question:'Чем занимаешься?',type:'options',options:[{value:'it',label:'IT',emoji:'💻'},{value:'business',label:'Бизнес',emoji:'💼'},{value:'creative',label:'Творчество',emoji:'🎨'},{value:'student',label:'Учусь',emoji:'🎓'},{value:'other',label:'Другое',emoji:'🔷'}]},
{id:'mainGoal',question:'Главная цель?',type:'options',options:[{value:'health',label:'Здоровье',emoji:'❤️'},{value:'productivity',label:'Продуктивность',emoji:'⚡'},{value:'mental',label:'Психика',emoji:'🧠'},{value:'career',label:'Карьера',emoji:'💰'},{value:'discipline',label:'Дисциплина',emoji:'⚔️'}]},
{id:'biggestChallenge',question:'Что мешает?',type:'options',options:[{value:'procrastination',label:'Прокрастинация',emoji:'⏳'},{value:'anxiety',label:'Тревога',emoji:'🌊'},{value:'burnout',label:'Выгорание',emoji:'🔥'},{value:'sleep',label:'Плохой сон',emoji:'😴'},{value:'focus',label:'Нет фокуса',emoji:'🎯'},{value:'screen',label:'Экран',emoji:'📱'}]},
{id:'sleepHours',question:'Сколько спишь?',type:'options',options:[{value:'<5',label:'<5 ч',emoji:'😵'},{value:'5-6',label:'5-6 ч',emoji:'😴'},{value:'6-7',label:'6-7 ч',emoji:'🙄'},{value:'7-8',label:'7-8 ч',emoji:'😊'},{value:'8+',label:'8+ ч',emoji:'😌'}]},
{id:'activityLevel',question:'Сколько двигаешься?',type:'options',options:[{value:'none',label:'Почти нет',emoji:'🪑'},{value:'light',label:'Лёгкая',emoji:'🚶'},{value:'moderate',label:'2-3/нед',emoji:'🏃'},{value:'active',label:'4+/нед',emoji:'🏋️'}]},
{id:'stressLevel',question:'Уровень стресса?',type:'options',options:[{value:'low',label:'Низкий',emoji:'😌'},{value:'medium',label:'Средний',emoji:'😐'},{value:'high',label:'Высокий',emoji:'😰'},{value:'chronic',label:'Хронический',emoji:'🥵'}]},
{id:'screenTime',question:'Сколько экрана?',type:'options',options:[{value:'<2',label:'<2 ч',emoji:'🌿'},{value:'2-4',label:'2-4 ч',emoji:'📱'},{value:'4-6',label:'4-6 ч',emoji:'😬'},{value:'6+',label:'6+ ч',emoji:'🧟'}]},
{id:'timeAvailable',question:'Сколько времени в день?',type:'options',options:[{value:'15min',label:'15 мин',emoji:'⏱'},{value:'30min',label:'30 мин',emoji:'🕐'},{value:'1h',label:'1 час',emoji:'⏰'},{value:'2h+',label:'2+ часа',emoji:'⏳'}]}
];

/* ============ PERSONAS ============ */
var PERSONAS={
coach:{name:'Коуч',emoji:'💬',prompt:'Ты — AI-Коуч с 80-летним опытом. GROW, SMART, Deep Work, Икигай, Кайдзен. Конкретные шаги. 150-220 слов.'},
psych:{name:'Психолог',emoji:'🧠',prompt:'Ты — AI-Психолог. КПТ, ACT, DBT. НЕ ставь диагнозы! Кризис → 8-800-2000-122. 150-220 слов.'},
doctor:{name:'Врач',emoji:'⚕️',prompt:'Ты — AI-Врач. НЕ ставь диагнозы. ВСЕГДА дисклеймер. Острые → 103/112.'},
vision:{name:'Офтальмолог',emoji:'👁',prompt:'Ты — AI-Офтальмолог. Советы по зрению, Бейтс, 20-20-20. НЕ ставь диагнозы.'},
finance:{name:'Финансист',emoji:'💰',prompt:'Ты — AI-Финансовый консультант. Бюджет, инвестиции, FIRE. 150-200 слов.'},
nutrition:{name:'Нутрициолог',emoji:'🥗',prompt:'Ты — AI-Нутрициолог. Питание, витамины, БЖУ. НЕ дозировки.'},
fitness:{name:'Тренер',emoji:'💪',prompt:'Ты — AI-Фитнес-тренер. Программы, восстановление. По уровню.'},
it:{name:'IT-эксперт',emoji:'💻',prompt:'Ты — AI-IT-эксперт. Программирование, DevOps, системы. Даю код и объяснения.'},
lawyer:{name:'Юрист',emoji:'⚖️',prompt:'Ты — AI-Юрист. Объясняю правовые вопросы. НЕ заменяю практикующего юриста.'},
teacher:{name:'Учитель',emoji:'📚',prompt:'Ты — AI-Учитель. Объясняю любую тему простыми словами с примерами.'}
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
{id:'plan',emoji:'🗓',label:'План',target:'learnplan'},
{id:'levels',emoji:'🌱',label:'Уровни',target:'levels'},
{id:'courses',emoji:'📖',label:'Курсы',target:'courses'},
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
{id:'all',emoji:'📋',label:'Все',target:null},
{id:'pending',emoji:'⏳',label:'Активные',target:null,filter:'pending'},
{id:'completed',emoji:'✅',label:'Готовые',target:null,filter:'completed'},
{id:'matrix',emoji:'🔢',label:'Матрица',target:'matrix'}
]
};

/* ============ LEARNING LEVELS (5×3×3 = 45) ============ */
var LEARNING_LEVELS=[
{id:'lvl1',num:1,emoji:'🌱',title:'Основы',subtitle:'Старт',desc:'Базовые принципы здоровья, мышления, целей',
  modules:[
    {id:'m1_1',emoji:'💪',title:'Здоровье',desc:'Сон, вода, движение',lessons:[
      {title:'Сон',theory:'**7-9 часов.** Медленный сон = факты, REM = эмоции. Недосып = -30% когнитивных, +30% кортизола.\n\n• 90-минутные циклы\n• Ложись в одно время\n• Темнота, 18-20°C\n• Без экрана за 2 ч',practice:'Ляг на 30 мин раньше. Убери телефон из спальни.'},
      {title:'Вода',theory:'**30 мл/кг.** Утром 500 мл натощак. Обезвоживание 2% = -20% фокуса.\n\n• 8 стаканов\n• Утром первым делом\n• Перед едой — стакан\n• Спорт — +500 мл',practice:'Выпей 500 мл сразу после подъёма.'},
      {title:'Движение',theory:'**150 мин кардио + 2 силовые в неделю.** Сидячий образ = -7 лет.\n\n• Утро — 10 мин\n• Прогулка 20 мин\n• Силовые 2×/нед\n• 8000 шагов',practice:'20 мин прогулка без телефона.'}
    ]},
    {id:'m1_2',emoji:'🧠',title:'Мышление',desc:'База продуктивности',lessons:[
      {title:'Продуктивность',theory:'**Результат, не занятость.** 20% времени дают 80% результата.\n\n• 3 главных дела\n• Deep Work\n• Убирай лишнее\n• Метрики',practice:'Выпиши 3 главных дела.'},
      {title:'Приоритеты',theory:'**Матрица Эйзенхауэра.** Q1 делай, Q2 планируй, Q3 делегируй, Q4 удали.\n\n• Q1 срочно+важно\n• Q2 не срочно+важно\n• Q3 срочно+неважно\n• Q4 не срочно+неважно',practice:'Разбери 5 задач.'},
      {title:'Привычки',theory:'**Cue → Craving → Response → Reward.** 66 дней.\n\n• Начни с 2 минут\n• Одно время\n• Триггер перед\n• Награда после',practice:'1 привычка 2 минуты.'}
    ]},
    {id:'m1_3',emoji:'🎯',title:'Цели',desc:'Постановка и достижение',lessons:[
      {title:'SMART',theory:'**Specific, Measurable, Achievable, Relevant, Time-bound.**\n\n• Конкретно\n• Измеримо\n• Достижимо\n• Актуально\n• По времени',practice:'Сформулируй 1 цель.'},
      {title:'OKR',theory:'**Objectives + Key Results.**\n\n• Амбициозно\n• Квартал\n• Ревью еженедельно',practice:'1 Objective + 3 KR.'},
      {title:'Планирование',theory:'**5 лет → 1 год → месяц → неделя → день.**',practice:'5-летний план.'}
    ]}
  ]},
{id:'lvl2',num:2,emoji:'⚡',title:'Практика',subtitle:'Углубление',desc:'Продуктивность, EQ, финансы',
  modules:[
    {id:'m2_1',emoji:'🎯',title:'Deep Work',desc:'Глубокая работа',lessons:[
      {title:'Deep Work',theory:'**90 мин ×3-4 = 10 часов.** Ньюпорт: ×3 объём, ×4 качество.\n\n• Одна задача\n• Телефон вне\n• Авиарежим',practice:'1 блок 90 мин.'},
      {title:'Pomodoro',theory:'**25/5 ×4 → перерыв 30.**',practice:'4 помидора.'},
      {title:'Time-blocking',theory:'**Каждое дело в слот.** Буферы 20%.',practice:'Заблокируй 3 задачи.'}
    ]},
    {id:'m2_2',emoji:'❤️',title:'EQ',desc:'Эмоциональный интеллект',lessons:[
      {title:'5 компонентов',theory:'**Самосознание, саморегуляция, мотивация, эмпатия, соц.навыки.**',practice:'Дневник эмоций.'},
      {title:'Пауза 6 сек',theory:'**Между стимулом и реакцией есть пространство.**',practice:'Пауза в 3 разговорах.'},
      {title:'Эмпатия',theory:'**Слушай, не советуй.**',practice:'1 разговор слушания.'}
    ]},
    {id:'m2_3',emoji:'💰',title:'Финансы',desc:'База денег',lessons:[
      {title:'50/30/20',theory:'**50% нужды, 30% желания, 20% сбережения.**',practice:'Разбей доход.'},
      {title:'Подушка',theory:'**3-6 месяцев расходов.**',practice:'Открой счёт.'},
      {title:'Инвестиции',theory:'**Индексные фонды, DCA.** +10%/год.',practice:'Изучи 3 фонда.'}
    ]}
  ]},
{id:'lvl3',num:3,emoji:'💎',title:'Мастерство',subtitle:'Продвинутый',desc:'Нейро, лидерство, стратегия',
  modules:[
    {id:'m3_1',emoji:'🔬',title:'Нейро',desc:'Мозг',lessons:[
      {title:'Нейропластичность',theory:'**Мозг меняется всю жизнь.**',practice:'30 дней 1 навык.'},
      {title:'Дофамин',theory:'**Предвкушение, не удовольствие.**',practice:'1 день без соцсетей.'},
      {title:'Сон и память',theory:'**Консолидация в глубоком сне.**',practice:'10 фактов до сна.'}
    ]},
    {id:'m3_2',emoji:'👑',title:'Лидерство',desc:'Люди',lessons:[
      {title:'Level 5',theory:'**Скромность + воля.**',practice:'1 качество неделю.'},
      {title:'Делегирование',theory:'**Не делай сам.**',practice:'3 задачи другому.'},
      {title:'SBI-фидбэк',theory:'**Situation-Behavior-Impact.**',practice:'1 SBI.'}
    ]},
    {id:'m3_3',emoji:'🌐',title:'Стратегия',desc:'Долгосрочно',lessons:[
      {title:'Второй порядок',theory:'**А что потом? ×3.**',practice:'3 решения.'},
      {title:'Инверсия',theory:'**Что мешает?**',practice:'3 цели.'},
      {title:'First principles',theory:'**Разбей до основы.**',practice:'1 проблема.'}
    ]}
  ]},
{id:'lvl4',num:4,emoji:'🏆',title:'Мастер',subtitle:'Эксперт',desc:'Менторство, системы, смысл',
  modules:[
    {id:'m4_1',emoji:'🎓',title:'Менторство',desc:'Учить',lessons:[
      {title:'Ментор',theory:'**Вопросы > советы.**',practice:'1 менти.'},
      {title:'GROW',theory:'**Goal-Reality-Options-Will.**',practice:'1 сессия.'},
      {title:'Учить',theory:'**Объясни — пойми.**',practice:'3 темы.'}
    ]},
    {id:'m4_2',emoji:'🌍',title:'Системы',desc:'Целое',lessons:[
      {title:'Системы vs цели',theory:'**Система = результат.**',practice:'3 системы.'},
      {title:'Обратные связи',theory:'**Положительные и отрицательные.**',practice:'3 петли.'},
      {title:'Точки воздействия',theory:'**Рычаг.**',practice:'1 рычаг.'}
    ]},
    {id:'m4_3',emoji:'🕊',title:'Смысл',desc:'Зачем',lessons:[
      {title:'Икигай',theory:'**4 сферы: люблю, умею, платят, нужно.**',practice:'4 списка.'},
      {title:'Логотерапия',theory:'**3 источника: труд, любовь, страдание.**',practice:'Найди своё.'},
      {title:'Наследие',theory:'**Что оставишь?**',practice:'Эпитафия.'}
    ]}
  ]},
{id:'lvl5',num:5,emoji:'🌟',title:'Легенда',subtitle:'Мастер',desc:'Мудрость, интеграция',
  modules:[
    {id:'m5_1',emoji:'🧘',title:'Мудрость',desc:'Глубина',lessons:[
      {title:'Стоицизм',theory:'**Дихотомия контроля.**',practice:'Вечером.'},
      {title:'Memento Mori',theory:'**Помни о смерти.**',practice:'Эпитафия.'},
      {title:'Присутствие',theory:'**Здесь и сейчас.**',practice:'10 мин.'}
    ]},
    {id:'m5_2',emoji:'💫',title:'Интеграция',desc:'Всё',lessons:[
      {title:'10 доменов',theory:'**Баланс.**',practice:'Оцени.'},
      {id:'m5_2_l2',title:'Свой путь',theory:'**Уникальность.**',practice:'Опиши.'},
      {title:'Передача',theory:'**Учи.**',practice:'1 гайд.'}
    ]},
    {id:'m5_3',emoji:'🚀',title:'Будущее',desc:'Дальше',lessons:[
      {title:'10 лет',theory:'**Куда?**',practice:'Опиши.'},
      {title:'Наследие',theory:'**После тебя.**',practice:'3 пункта.'},
      {title:'Продолжение',theory:'**Путь.**',practice:'План.'}
    ]}
  ]}
];

/* ============ ACHIEVEMENTS (25) ============ */
var ACHIEVEMENTS=[
{id:'first_task',icon:'✅',name:'Первая задача',check:function(s){return s.tasks.some(function(t){return t.status==='completed'})},progress:function(s){return s.tasks.filter(function(t){return t.status==='completed'}).length>0?1:0}},
{id:'first_lesson',icon:'🎓',name:'Первый урок',check:function(s){return Object.keys(s.levelProgress||{}).length>=1},progress:function(s){return Math.min(1,Object.keys(s.levelProgress||{}).length)}},
{id:'first_skill',icon:'💎',name:'Первый навык',check:function(s){return Object.keys(s.skillsProgress||{}).length>=1},progress:function(s){return Math.min(1,Object.keys(s.skillsProgress||{}).length)}},
{id:'first_water',icon:'💧',name:'Первая вода',check:function(s){return (s.customWater||[]).some(function(w){return w.count>=1})},progress:function(s){return s.customWater&&s.customWater.length>0?1:0}},
{id:'first_eye',icon:'👁',name:'Первое упражнение глаз',check:function(s){return (s.eyeExercises||[]).length>=1},progress:function(s){return Math.min(1,(s.eyeExercises||[]).length)}},
{id:'first_screen',icon:'📱',name:'Первый трекинг экрана',check:function(s){return Object.keys(s.screenStats||{}).length>=1},progress:function(s){return Object.keys(s.screenStats||{}).length>=1?1:0}},
{id:'tasks_10',icon:'🔥',name:'10 задач',check:function(s){return s.tasks.filter(function(t){return t.status==='completed'}).length>=10},progress:function(s){return Math.min(1,s.tasks.filter(function(t){return t.status==='completed'}).length/10)}},
{id:'tasks_50',icon:'⚡',name:'50 задач',check:function(s){return s.tasks.filter(function(t){return t.status==='completed'}).length>=50},progress:function(s){return Math.min(1,s.tasks.filter(function(t){return t.status==='completed'}).length/50)}},
{id:'tasks_100',icon:'🌟',name:'100 задач',check:function(s){return s.tasks.filter(function(t){return t.status==='completed'}).length>=100},progress:function(s){return Math.min(1,s.tasks.filter(function(t){return t.status==='completed'}).length/100)}},
{id:'lessons_10',icon:'📚',name:'10 уроков',check:function(s){return Object.keys(s.levelProgress||{}).length>=10},progress:function(s){return Math.min(1,Object.keys(s.levelProgress||{}).length/10)}},
{id:'lessons_50',icon:'📖',name:'50 уроков',check:function(s){return Object.keys(s.levelProgress||{}).length>=50},progress:function(s){return Math.min(1,Object.keys(s.levelProgress||{}).length/50)}},
{id:'skills_10',icon:'💎',name:'10 навыков',check:function(s){return Object.keys(s.skillsProgress||{}).length>=10},progress:function(s){return Math.min(1,Object.keys(s.skillsProgress||{}).length/10)}},
{id:'english_10',icon:'🇬🇧',name:'10 English',check:function(s){return Object.keys(s.englishProgress||{}).length>=10},progress:function(s){return Math.min(1,Object.keys(s.englishProgress||{}).length/10)}},
{id:'streak_3',icon:'🔥',name:'3 дня',check:function(s){return (s.stats.streak||0)>=3},progress:function(s){return Math.min(1,(s.stats.streak||0)/3)}},
{id:'streak_7',icon:'🔥',name:'7 дней',check:function(s){return (s.stats.streak||0)>=7},progress:function(s){return Math.min(1,(s.stats.streak||0)/7)}},
{id:'streak_30',icon:'🔥',name:'30 дней',check:function(s){return (s.stats.streak||0)>=30},progress:function(s){return Math.min(1,(s.stats.streak||0)/30)}},
{id:'streak_100',icon:'💯',name:'100 дней',check:function(s){return (s.stats.streak||0)>=100},progress:function(s){return Math.min(1,(s.stats.streak||0)/100)}},
{id:'water_100',icon:'💧',name:'100 стаканов',check:function(s){return (s.stats.totalWater||0)>=100},progress:function(s){return Math.min(1,(s.stats.totalWater||0)/100)}},
{id:'mood_30',icon:'💭',name:'30 настроений',check:function(s){return (s.stats.totalMoodLogs||0)>=30},progress:function(s){return Math.min(1,(s.stats.totalMoodLogs||0)/30)}},
{id:'eye_10',icon:'👁',name:'10 упражнений глаз',check:function(s){return (s.eyeExercises||[]).length>=10},progress:function(s){return Math.min(1,(s.eyeExercises||[]).length/10)}},
{id:'eye_30',icon:'👀',name:'30 упражнений глаз',check:function(s){return (s.eyeExercises||[]).length>=30},progress:function(s){return Math.min(1,(s.eyeExercises||[]).length/30)}},
{id:'detox_7',icon:'📱',name:'7 дней детокса',check:function(s){return Object.keys(s.detoxCourseProgress||{}).length>=7},progress:function(s){return Math.min(1,Object.keys(s.detoxCourseProgress||{}).length/7)}},
{id:'detox_30',icon:'🏆',name:'30 дней детокса',check:function(s){return Object.keys(s.detoxCourseProgress||{}).length>=30},progress:function(s){return Math.min(1,Object.keys(s.detoxCourseProgress||{}).length/30)}},
{id:'detox_62',icon:'👑',name:'62 дня детокса',check:function(s){return Object.keys(s.detoxCourseProgress||{}).length>=62},progress:function(s){return Math.min(1,Object.keys(s.detoxCourseProgress||{}).length/62)}},
{id:'xp_100',icon:'⭐',name:'100 XP',check:function(s){return (s.xp||0)>=100},progress:function(s){return Math.min(1,(s.xp||0)/100)}},
{id:'xp_1000',icon:'🌟',name:'1000 XP',check:function(s){return (s.xp||0)>=1000},progress:function(s){return Math.min(1,(s.xp||0)/1000)}},
{id:'xp_10000',icon:'💫',name:'10000 XP',check:function(s){return (s.xp||0)>=10000},progress:function(s){return Math.min(1,(s.xp||0)/10000)}},
{id:'survey_done',icon:'📋',name:'Опрос пройден',check:function(s){return s.profile.surveyDone},progress:function(s){return s.profile.surveyDone?1:0}}
];

/* ============ ГОРМОНЫ (20) ============ */
var HORMONES=[
{id:'dopamine',emoji:'⚡',name:'Дофамин',role:'Мотивация, предвкушение',what:'Нейромедиатор предвкушения награды, мотивации, обучения. НЕ гормон удовольствия — гормон желания.',where:'VTA → прилежащее ядро → префронтальная кора.',when:'Растёт при предвкушении награды, новизне, движении к цели.',up:['Достижение целей','Спорт','Музыка','Тёмный шоколад','Утренний свет','Холодный душ','Медитация','Новизна','Обучение'],down:['Соцсети','Сахар','Игры','Порнография','Шопинг','Уведомления','Многозадачность','Стресс','Недосып','Алкоголь'],food:'Тирозин: мясо, рыба, яйца, орехи, сыр.',sleep:'7-9 часов. Недосып = -30% рецепторов.',sport:'Умеренный кардио 3-4×/нед + силовые 2×/нед.',normal:'Стабильная мотивация.',imbalance:'Прокрастинация, апатия, ангедония.',protocol:['Дофамин-детокс 1×/нед','Утро без телефона','Награда ПОСЛЕ усилия','Убери уведомления','Холодный душ','Утренний свет'],example:'Ты думаешь о пицце → дофамин растёт → ешь → падает. Предвкушение слаще.',symptoms:['Скука','Зависимость от телефона','Прокрастинация','Апатия']},
{id:'serotonin',emoji:'☀️',name:'Серотонин',role:'Настроение, спокойствие',what:'Нейромедиатор настроения, спокойствия, аппетита, сна. 90% в кишечнике.',where:'Ядра шва в стволе; 90% — в кишечнике.',when:'Растёт при свете, еде с триптофаном, спорте, медитации.',up:['Солнце 10-20 мин','Спорт','Медитация','Триптофан','Массаж','Прогулки','Улыбка','Объятия','Смех'],down:['Изоляция','Тёмная комната','Стресс','Алкоголь','Кофеин вечером','Недосып','Сидячий образ'],food:'Триптофан: индейка, курица, сыр, бананы, овсянка.',sleep:'Регулярный режим. 7-9 ч.',sport:'Аэробные 30 мин 4-5×/нед.',normal:'Спокойствие, стабильное настроение.',imbalance:'Депрессия, тревога, бессонница, ПМС.',protocol:['Утренний свет 20 мин','Прогулка 30 мин','Медитация','Триптофан','Массаж 1×/нед','Объятия 8×/день'],example:'Зимой серотонин падает → сезонная депрессия. Лампа 10 000 люкс = эффект.',symptoms:['Подавленность','Тревога','Бессонница','Тяга к сладкому']},
{id:'oxytocin',emoji:'💞',name:'Окситоцин',role:'Привязанность, доверие',what:'Нейропептид привязанности, доверия, любви, эмпатии. «Гормон объятий».',where:'Гипоталамус → задняя доля гипофиза.',when:'Растёт при объятиях 20+ сек, времени с близкими, массаже.',up:['Объятия 20 сек','Время с близкими','Массаж','Секс','Питомцы','Помощь другим','Медитация метта'],down:['Одиночество','Стресс','Цифровое общение','Изоляция','Недоверие','Травмы'],food:'Магний, омега-3.',sleep:'Объятия перед сном.',sport:'Йога, танцы.',normal:'Близость, доверие, эмпатия.',imbalance:'Одиночество, депрессия, недоверие.',protocol:['8 объятий по 20 сек','Звонок близкому','Питомец/волонтёрство','Массаж','Совместные ужины'],example:'20-секундное объятие → окситоцин → снижает кортизол.',symptoms:['Одиночество','Тревога в отношениях','Недоверие']},
{id:'endorphins',emoji:'🏃',name:'Эндорфины',role:'Обезболивание, эйфория',what:'Эндогенные опиоиды — обезболивающие и дающие эйфорию.',where:'Гипофиз, гипоталамус, надпочечники, ЦНС.',when:'Растёт при спорте 30+ мин, смехе, сексе, шоколаде.',up:['Спорт 30+ мин','Смех','Секс','Тёмный шоколад','Острая еда','Музыка','Массаж','Танцы','Пение'],down:['Сидячий образ','Хроническая боль','Стресс','Отсутствие смеха'],food:'Острая еда, шоколад 70%+, клубника.',sleep:'Спорт за 3 ч до сна.',sport:'Кардио 30-60 мин 4-5×/нед.',normal:'Лёгкость, радость, устойчивость к боли.',imbalance:'Хроническая боль, депрессия.',protocol:['30 мин кардио 4×/нед','Смех ежедневно','Массаж 1×/нед','Шоколад 20 г','Танцы 2×/нед'],example:'«Эйфория бегуна» — после 40+ мин бега эндорфины дают подъём.',symptoms:['Хроническая боль','Плохое настроение']},
{id:'cortisol',emoji:'🔥',name:'Кортизол',role:'Стресс, мобилизация',what:'Главный гормон стресса. Мобилизует глюкозу, повышает давление.',where:'Кора надпочечников.',when:'Растёт при стрессе, голоде, утром (пик 6-8).',up:['Хронический стресс','Мало сна','Кофе на голодный','Переработка','Ссоры','Новости','Соцсети'],down:['Медитация','Спорт','Сон 7-9 ч','Природа','Дыхание 4-7-8','Объятия','Смех'],food:'Магний, омега-3, витамин C, L-теанин.',sleep:'7-9 часов. До 23:00.',sport:'Умеренно.',normal:'Утро пик, вечер спад.',imbalance:'Тревога, бессонница, набор веса, гипертония.',protocol:['Утренний свет','Убрать кофе после 14:00','Медитация','Прогулка','Дыхание 4-7-8','Магний вечером','Объятия'],example:'Пик кортизола утром помогает проснуться. Хронический стресс = изнашивание.',symptoms:['Тревога','Бессонница','Набор веса','Частые простуды']},
{id:'testosterone',emoji:'💪',name:'Тестостерон',role:'Сила, либидо, уверенность',what:'Главный мужской половой гормон. Мышцы, либидо, уверенность.',where:'Яички (клетки Лейдига).',when:'Пик утром (6-9 ч).',up:['Силовые 3×/нед','Белок 1.6-2 г/кг','Цинк','Сон 7-9 ч','Солнце','Холодный душ','Победы','Соревнования','Витамин D'],down:['Мало сна','Алкоголь','Стресс','Сахар','Перетренированность','Ожирение','Дефицит цинка'],food:'Цинк: мясо, устрицы, яйца. Витамин D: рыба, солнце.',sleep:'7-9 ч.',sport:'Силовые 3×/нед (присед, становая, жим). HIIT 1-2×/нед.',normal:'Энергия, либидо, мышцы.',imbalance:'Усталость, снижение либидо, депрессия.',protocol:['Силовые 3×/нед','Сон 8 ч','Цинк + магний + D','Холодный душ','Убрать алкоголь','Снизить сахар','Солнце 20 мин'],example:'После силовой тестостерон растёт на 15-20% на 2-3 часа.',symptoms:['Усталость','Снижение либидо','Потеря мышц']},
{id:'estrogen',emoji:'🌸',name:'Эстроген',role:'Женское здоровье',what:'Группа женских половых гормонов. Цикл, кости, кожа, настроение.',where:'Яичники, кора надпочечников, жировая ткань.',when:'Колеблется по циклу. Пик перед овуляцией.',up:['Здоровый вес','Флавоноиды','Фитоэстрогены','Сон','Умеренный спорт'],down:['Избыток веса','Стресс','Алкоголь','Сахар','Менопауза','Мало жиров'],food:'Соя, лён, кунжут, ягоды, брокколи.',sleep:'7-9 ч.',sport:'Умеренные, йога, пилатес.',normal:'Стабильный цикл, кожа, кости.',imbalance:'ПМС, проблемы с кожей, остеопороз.',protocol:['Сбалансированное питание','Сон 8 ч','Проверка гормонов 1×/год','Магний + B6'],example:'ПМС = падение эстрогена. Магний + B6 помогают.',symptoms:['ПМС','Проблемы с кожей','Приливы']},
{id:'progesterone',emoji:'🌺',name:'Прогестерон',role:'Цикл, спокойствие',what:'Женский гормон, готовящий матку. Успокаивающее действие на мозг.',where:'Жёлтое тело, плацента.',when:'Растёт после овуляции.',up:['Сон 8 ч','Витамин B6','Магний','Цинк'],down:['Стресс','Мало сна','Алкоголь','Дефицит B6'],food:'B6: бананы, курица, рыба.',sleep:'7-9 ч.',sport:'Умеренные, йога.',normal:'Стабильный цикл, спокойствие.',imbalance:'ПМС, бессонница, тревожность.',protocol:['Сон 8 ч','B6 + магний','Умеренный спорт'],example:'Низкий прогестерон = тревожность и бессонница перед месячными.',symptoms:['ПМС','Бессонница','Тревожность']},
{id:'insulin',emoji:'🍬',name:'Инсулин',role:'Регуляция сахара',what:'Гормон поджелудочной, регулирующий глюкозу.',where:'Бета-клетки островков Лангерганса.',when:'Растёт при приёме углеводов.',up:['Быстрые углеводы','Перекусы','Сидячий образ','Стресс','Мало сна'],down:['Интервальное голодание','Спорт','Белок','Овощи','Клетчатка','Жиры','Уксус'],food:'Овощи, белок, жиры, клетчатка.',sleep:'7-9 ч. Недосып = инсулинорезистентность.',sport:'Силовые + кардио. Движение после еды.',normal:'Стабильный сахар.',imbalance:'Диабет 2 типа, ожирение, усталость.',protocol:['Меньше сахара','Больше овощей','Движение после еды','16:8','Уксус перед едой','Белок в каждый приём'],example:'10 мин прогулка после еды снижает пик глюкозы на 30%.',symptoms:['Тяга к сладкому','Усталость после еды','Набор веса']},
{id:'leptin',emoji:'🍔',name:'Лептин',role:'Сытость',what:'Гормон сытости, сообщающий мозгу о запасах.',where:'Жировая ткань.',when:'Растёт после еды.',up:['Сон 7-9 ч','Белок','Овощи','Клетчатка','Здоровые жиры'],down:['Недосып','Сахар','Переедание','Стресс'],food:'Белок, клетчатка, овощи.',sleep:'Критично 7-9 ч.',sport:'Умеренные.',normal:'Сытость после еды.',imbalance:'Лептинорезистентность → голод.',protocol:['Сон 8 ч','Белок 1.6 г/кг','Убрать сахар','Овощи 500 г'],example:'Недосып 4 ч → лептин -18%, грелин +28% → +300 калорий.',symptoms:['Постоянный голод','Набор веса']},
{id:'ghrelin',emoji:'🍽',name:'Грелин',role:'Голод',what:'Гормон голода, стимулирующий аппетит.',where:'Желудок.',when:'Растёт на голодный желудок.',up:['Недосып','Стресс','Быстрые углеводы'],down:['Белок','Клетчатка','Вода','Сон'],food:'Белок, клетчатка, вода.',sleep:'7-9 ч.',sport:'Умеренно.',normal:'Голод по расписанию.',imbalance:'Постоянный голод.',protocol:['Сон 8 ч','Вода перед едой','Белок на завтрак'],example:'Белок на завтрак (30 г) снижает грелин на 6 часов.',symptoms:['Постоянный голод','Переедание']},
{id:'melatonin',emoji:'🌙',name:'Мелатонин',role:'Сон, восстановление',what:'Гормон сна, регулирующий циркадные ритмы.',where:'Эпифиз.',when:'Растёт вечером (после 21:00), пик 2-4 ч.',up:['Темнота','Режим','Тёплый свет','Медитация','Вишня','Овсянка'],down:['Синий свет','Экраны','Кофеин','Алкоголь','Яркий свет'],food:'Вишня, овсянка, бананы.',sleep:'Одно время. Тёмная спальня. 18-20°C.',sport:'Утром/днём.',normal:'Засыпание 15-20 мин.',imbalance:'Бессонница, поверхностный сон.',protocol:['Тёмная спальня','Экран за 2 ч до сна','Тёплый свет 19:00+','Утренний свет 20 мин','Магний'],example:'2 часа без экрана = мелатонин +50%.',symptoms:['Бессонница','Поверхностный сон']},
{id:'adrenaline',emoji:'⚡',name:'Адреналин',role:'Бей или беги',what:'Гормон острой стрессовой реакции.',where:'Мозговое вещество надпочечников.',when:'Растёт мгновенно при опасности.',up:['Стресс','Экстрим','Спорт','Холод','Кофеин','Выступления'],down:['Медитация','Дыхание','Природа','Сон','Магний'],food:'Магний.',sleep:'Важен.',sport:'Острые нагрузки, HIIT.',normal:'Реакция в опасности.',imbalance:'Тревога, панические атаки.',protocol:['Дыхание 4-7-8','Медитация','Прогулка','Убрать кофеин'],example:'Публичное выступление = адреналин → тряска. Дыхание 4-7-8 помогает.',symptoms:['Тревога','Паника','Тряска']},
{id:'norepinephrine',emoji:'🎯',name:'Норадреналин',role:'Фокус, бодрость',what:'Нейромедиатор бодрости и фокуса.',where:'Голубое пятно в стволе.',when:'Растёт утром, при стрессе, кофеине, холоде.',up:['Кофеин до 14:00','Холод','Спорт','Утро','Свет','Тирозин'],down:['Хронический стресс','Мало сна','Алкоголь'],food:'Тирозин: мясо, рыба, яйца.',sleep:'7-9 ч.',sport:'Кардио, силовые.',normal:'Бодрость, фокус.',imbalance:'Истощение, усталость.',protocol:['Утренний свет','Кофе до 14:00','Холодный душ','Белок утром'],example:'Утро без кофе + свет + холодный душ = естественный пик.',symptoms:['Усталость','Плохой фокус']},
{id:'gaba',emoji:'🧘',name:'ГАМК',role:'Успокоение',what:'Главный тормозной нейромедиатор.',where:'По всему мозгу (30-40% нейронов).',when:'Растёт при медитации, йоге, дыхании, магнии.',up:['Медитация','Йога','Дыхание','Магний','L-теанин','Сон'],down:['Стресс','Кофеин','Алкоголь','Недосып'],food:'Магний, L-теанин.',sleep:'7-9 ч.',sport:'Йога, пилатес, тай-чи.',normal:'Спокойствие, хороший сон.',imbalance:'Тревога, бессонница.',protocol:['Йога 2×/нед','Медитация','Магний','Зелёный чай'],example:'Зелёный чай = L-теанин → ГАМК → спокойствие + фокус.',symptoms:['Тревога','Бессонница','Напряжение']},
{id:'bdnf',emoji:'🧬',name:'BDNF',role:'Рост нейронов',what:'Нейротрофический фактор мозга. Удобрение для нейронов.',where:'Гиппокамп и кора.',when:'Растёт при спорте, голодании, обучении.',up:['Спорт','Интервальное голодание','Омега-3','Куркума','Обучение','Солнце','Сон'],down:['Сахар','Стресс','Сидячий образ','Депрессия'],food:'Омега-3, куркума, ягоды.',sleep:'7-9 ч.',sport:'HIIT 2-3×/нед, силовые.',normal:'Хорошая память.',imbalance:'Плохая память, депрессия.',protocol:['Спорт 4×/нед','16:8','Омега-3 2 г','Куркума','Учи новое'],example:'30 мин кардио → BDNF +30% на 2 часа → учи после спорта!',symptoms:['Плохая память','Туман в голове']},
{id:'vasopressin',emoji:'💧',name:'Вазопрессин',role:'Водный баланс',what:'Антидиуретический гормон. Сохраняет воду, влияет на память.',where:'Гипоталамус → задняя доля гипофиза.',when:'Растёт при обезвоживании.',up:['Вода','Соль умеренно','Белок','Сон'],down:['Алкоголь','Кофеин','Стресс','Обезвоживание'],food:'Вода, соль, белок.',sleep:'7-9 ч.',sport:'Умеренно.',normal:'Водный баланс.',imbalance:'Обезвоживание или задержка.',protocol:['30 мл/кг воды','Утром 500 мл','Соль по норме'],example:'Алкоголь блокирует вазопрессин → обезвоживание → похмелье.',symptoms:['Обезвоживание','Отёки']},
{id:'aldosterone',emoji:'🧂',name:'Альдостерон',role:'Баланс Na/K',what:'Регулирует натрий-калиевый баланс и давление.',where:'Кора надпочечников.',when:'Растёт при низком давлении.',up:['Натрий','Калий','Сон'],down:['Стресс','Обезвоживание'],food:'Баланс Na/K.',sleep:'7-9 ч.',sport:'Умеренно.',normal:'Давление в норме.',imbalance:'Отёки, давление.',protocol:['Баланс Na/K','Вода','Сон'],example:'Много соли → задержка воды → отёки.',symptoms:['Отёки','Повышенное давление']},
{id:'thyroid',emoji:'🦋',name:'Тиреоидные',role:'Метаболизм',what:'Т3 и Т4 регулируют метаболизм, энергию, температуру.',where:'Щитовидная железа.',when:'Стабильно. Пик утром.',up:['Йод','Селен','Сон','Спорт'],down:['Стресс','Дефицит йода','Мало сна'],food:'Йод: рыба, морская капуста. Селен: орехи, яйца.',sleep:'7-9 ч.',sport:'Умеренно.',normal:'Энергия, стабильный вес.',imbalance:'Гипотиреоз: усталость, набор веса.',protocol:['Йод','Селен','Проверка ТТГ 1×/год'],example:'Усталость + набор веса + холод = проверь ТТГ.',symptoms:['Усталость','Набор веса','Холод']},
{id:'growth',emoji:'📈',name:'Гормон роста',role:'Восстановление',what:'Соматотропин — рост, восстановление, жиросжигание.',where:'Передняя доля гипофиза.',when:'Пик в глубоком сне.',up:['Сон 8 ч','Интервальное голодание','Спорт','Белок'],down:['Сахар','Мало сна','Стресс','Алкоголь'],food:'Белок.',sleep:'Глубокий сон критичен.',sport:'Силовые, HIIT.',normal:'Восстановление, мышцы.',imbalance:'Плохое восстановление.',protocol:['Сон 8 ч','16:8','Силовые 3×/нед','Белок 1.6 г/кг','Не есть за 3 ч до сна'],example:'Еда перед сном блокирует гормон роста.',symptoms:['Плохое восстановление','Набор жира']}
];

/* ============================================================
   КОНЕЦ ЧАСТИ 1/6
   Дальше: часть 2 — Психология, Мышление, Этикет, Навыки
   ============================================================ */
console.log('[CONTENT 1/6] THEMES='+THEMES.length+' (Halloween: 12) HORMONES='+HORMONES.length+' LEVELS='+LEARNING_LEVELS.length+' ACHIEVEMENTS='+ACHIEVEMENTS.length);
/* ============================================================
   LIFE OS — CONTENT.js v42 — ЧАСТЬ 2/6
   Психология, Мышление, Этикет, Навыки
   ============================================================ */

/* ============ PSYCHOLOGY_TOPICS (100) ============ */
var PSYCHOLOGY_TOPICS=[
{id:'ps_01',cat:'Мышление',emoji:'🧠',title:'Критическое мышление',theory:'**5 вопросов:**\n1. Кто говорит?\n2. Что утверждает?\n3. Какие доказательства?\n4. Какие альтернативы?\n5. Что если ошибается?',science:'Stanford: -2× манипуляций, +40% точности решений.',practice:['Анализ 1 новости/день','5 вопросов','Найди 3 ловушки'],effect:'-Манипуляции',tips:'Проверяй',test:[{q:'Первый вопрос?',options:['Что','Кто','Как'],correct:1}]},
{id:'ps_02',cat:'Мышление',emoji:'🔄',title:'Системное мышление',theory:'Видеть связи и целое, а не части. Система = элементы + связи + цель.',science:'Деминг: 94% проблем в системе.',practice:['Mind map','3 связи','1 точка'],effect:'+Понимание',tips:'Целое'},
{id:'ps_03',cat:'Мышление',emoji:'⚡',title:'Латеральное',theory:'Нестандартные решения. В сторону от логики.',science:'Де Боно: 6 шляп.',practice:['5 решений','SCAMPER'],effect:'+Креатив',tips:'В сторону'},
{id:'ps_04',cat:'Эмоции',emoji:'❤️',title:'Эмоциональный интеллект',theory:'5 компонентов Гоулмана: самосознание, саморегуляция, мотивация, эмпатия, социальные навыки.',science:'EQ > IQ в 2 раза в успехе.',practice:['Дневник эмоций','Пауза 6 сек'],effect:'+Успех',tips:'Назови — ослабь'},
{id:'ps_05',cat:'Эмоции',emoji:'😰',title:'Работа с тревогой',theory:'Тревога = предсказание будущего без фактов. 4-7-8, заземление 5-4-3-2-1.',science:'КПТ: 60-80% эффективности.',practice:['4-7-8','Дневник тревог'],effect:'-Тревога',tips:'Ложная тревога'},
{id:'ps_06',cat:'Эмоции',emoji:'😔',title:'Работа с депрессией',theory:'Не лень. Болезнь. Спорт = антидепрессант.',science:'Спорт 30 мин = эффект антидепрессанта.',practice:['30 мин спорта','10 мин света'],effect:'+Настроение',tips:'К врачу при тяжёлой'},
{id:'ps_07',cat:'Мышление',emoji:'📈',title:'Мышление роста',theory:'Growth mindset (Дуэк): способности развиваются.',science:'+30% результатов.',practice:['"Пока"','Ошибка = урок'],effect:'+Результаты',tips:'"Пока"'},
{id:'ps_08',cat:'Мышление',emoji:'🎯',title:'Принятие решений',theory:'10/10/10: как буду чувствовать через 10 мин/мес/лет.',science:'Успешные решения часто непопулярны.',practice:['10/10/10','Инверсия'],effect:'-Ошибки',tips:'Холодная голова'},
{id:'ps_09',cat:'Мышление',emoji:'🧩',title:'Когнитивные искажения',theory:'Confirmation bias, anchoring, sunk cost.',science:'Канеман: 20+ искажений.',practice:['1 искажение/день'],effect:'+Точность',tips:'Знай ловушки'},
{id:'ps_10',cat:'Мышление',emoji:'💡',title:'Ментальные модели',theory:'80+ моделей: инверсия, второй порядок, first principles.',science:'Маск, Баффет используют.',practice:['1 модель/нед'],effect:'+Решения',tips:'Инструменты'},
{id:'ps_11',cat:'Отношения',emoji:'💞',title:'Привязанность',theory:'4 типа: надёжный, тревожный, избегающий, дезорганизованный.',science:'Формируется до 3 лет, можно менять.',practice:['Определи тип'],effect:'+Отношения',tips:'Можно менять'},
{id:'ps_12',cat:'Отношения',emoji:'💬',title:'ННО',theory:'Наблюдение → Чувство → Потребность → Просьба.',science:'-70% конфликтов.',practice:['Я-сообщения'],effect:'-Конфликты',tips:'Без "ты всегда"'},
{id:'ps_13',cat:'Отношения',emoji:'🚧',title:'Границы',theory:'«Я не могу X, но могу Y».',science:'-выгорание, +уважение.',practice:['Скажи "нет" 3 раза'],effect:'+Уважение',tips:'Любовь к себе'},
{id:'ps_14',cat:'Мышление',emoji:'⏳',title:'Прокрастинация',theory:'Эмоциональная регуляция, а не лень.',science:'Правило 2 минут.',practice:['2 минуты','Микрошаги'],effect:'-Прокрастинация',tips:'Начало 80%'},
{id:'ps_15',cat:'Эмоции',emoji:'🧘',title:'Медитация и мозг',theory:'MBSR 8 недель → изменения в мозге.',science:'10 мин/день = +плотность коры.',practice:['10 мин утром'],effect:'+Спокойствие',tips:'Наблюдай'},
{id:'ps_16',cat:'Мышление',emoji:'🎨',title:'Креативность',theory:'DMN активна в покое. Скука → креатив.',science:'Прогулка +60%.',practice:['20 идей','Прогулка'],effect:'+Идеи',tips:'Скука'},
{id:'ps_17',cat:'Мышление',emoji:'🔍',title:'Внимание',theory:'23 минуты на возврат после отвлечения.',science:'96 проверок телефона/день.',practice:['Авиарежим 90 мин'],effect:'+Фокус',tips:'Одна задача'},
{id:'ps_18',cat:'Эмоции',emoji:'😤',title:'Гнев',theory:'Пауза 6 сек. Пик гнева 90 сек.',science:'Кора мозга отключается на 90 сек.',practice:['Пауза','Спорт'],effect:'-Конфликты',tips:'Сигнал'},
{id:'ps_19',cat:'Мышление',emoji:'💭',title:'КПТ',theory:'Мысль → Эмоция → Поведение.',science:'Золотой стандарт психотерапии.',practice:['Дневник мыслей'],effect:'-Тревога',tips:'Мысли ≠ факты'},
{id:'ps_20',cat:'Мышление',emoji:'🎓',title:'Стоицизм',theory:'Дихотомия контроля: что в моей власти, что нет.',science:'+20% удовлетворённости.',practice:['Вечером рефлексия'],effect:'+Спокойствие',tips:'Управляй реакцией'},
{id:'ps_21',cat:'Мышление',emoji:'🏛',title:'Философия смысла',theory:'Логотерапия Франкла: смысл спасает.',science:'Смысл = долголетие.',practice:['Найди "зачем"'],effect:'+Смысл',tips:'Смысл спасает'},
{id:'ps_22',cat:'Мышление',emoji:'🔄',title:'Второй порядок',theory:'А что потом? ×3.',science:'Дальновидность.',practice:['3 порядка'],effect:'+Решения',tips:'Думай дальше'},
{id:'ps_23',cat:'Мышление',emoji:'🎯',title:'First principles',theory:'Разбей до основы.',science:'Маск.',practice:['1 проблема'],effect:'+Инновации',tips:'От основы'},
{id:'ps_24',cat:'Мышление',emoji:'⚖️',title:'Инверсия',theory:'Что мешает?',science:'Баффет.',practice:['3 цели'],effect:'+Решения',tips:'Наоборот'},
{id:'ps_25',cat:'Мышление',emoji:'🌐',title:'Circle of competence',theory:'Работай где разбираешься.',science:'Баффет.',practice:['Свой круг'],effect:'+Результаты',tips:'Знай границы'},
{id:'ps_26',cat:'Мышление',emoji:'✂️',title:'Occam\'s razor',theory:'Простое — верное.',science:'Эйнштейн.',practice:['Простое решение'],effect:'+Ясность',tips:'Простое'},
{id:'ps_27',cat:'Мышление',emoji:'📊',title:'Вероятностное',theory:'Мир — вероятности.',science:'Байес.',practice:['Оценка в %'],effect:'+Точность',tips:'Думай %'},
{id:'ps_28',cat:'Мышление',emoji:'🎲',title:'Тейл-риски',theory:'Малые вероятности, большие последствия.',science:'Талеб.',practice:['Найди риски'],effect:'+Защита',tips:'Хвост'},
{id:'ps_29',cat:'Мышление',emoji:'🧬',title:'Эволюционное',theory:'Мозг — продукт эволюции.',science:'Не для счастья.',practice:['Понимай инстинкты'],effect:'+Понимание',tips:'Древний мозг'},
{id:'ps_30',cat:'Мышление',emoji:'🌊',title:'Антихрупкость',theory:'Что не убивает — сильнее.',science:'Талеб.',practice:['Стресс = рост'],effect:'+Устойчивость',tips:'Стресс полезен'},
{id:'ps_31',cat:'Эмоции',emoji:'💧',title:'Слёзы',theory:'Выводят кортизол.',science:'Облегчение.',practice:['Не сдерживай'],effect:'+Облегчение',tips:'Лечат'},
{id:'ps_32',cat:'Эмоции',emoji:'😂',title:'Смех',theory:'Снижает кортизол.',science:'15 мин = -30%.',practice:['1 комедия/нед'],effect:'+Настроение',tips:'Смейся'},
{id:'ps_33',cat:'Мышление',emoji:'💤',title:'Осознанные сны',theory:'Можно управлять.',science:'Реальны.',practice:['Проверяй реальность'],effect:'+Творчество',tips:'Записывай'},
{id:'ps_34',cat:'Мышление',emoji:'🌍',title:'Экология разума',theory:'Среда формирует.',science:'Окружение > воля.',practice:['Убери соблазны'],effect:'+Воля',tips:'Среда'},
{id:'ps_35',cat:'Мышление',emoji:'⚡',title:'Дофамин',theory:'Предвкушение.',science:'Соцсети = яма.',practice:['Детокс'],effect:'+Чувствительность',tips:'Управляй'},
{id:'ps_36',cat:'Мышление',emoji:'🌅',title:'Утренние ритуалы',theory:'Первые 30 мин.',science:'+21%.',practice:['Вода+свет+спорт'],effect:'+День',tips:'Защити утро'},
{id:'ps_37',cat:'Мышление',emoji:'📝',title:'Дневник',theory:'Письмо структурирует.',science:'-тревога.',practice:['3 победы','3 благодарности'],effect:'+Ясность',tips:'От руки'},
{id:'ps_38',cat:'Эмоции',emoji:'🙏',title:'Благодарность',theory:'3 в день = +25%.',science:'Emmons.',practice:['3 пункта'],effect:'+Счастье',tips:'Специфично'},
{id:'ps_39',cat:'Мышление',emoji:'🎯',title:'Поток',theory:'Погружение.',science:'Чиксентмихайи.',practice:['Сложность=навыку'],effect:'+Продуктивность',tips:'Ищи поток'},
{id:'ps_40',cat:'Мышление',emoji:'👁',title:'Восприятие',theory:'Модель реальности.',science:'Мозг достраивает 90%.',practice:['Проверяй'],effect:'+Объективность',tips:'Сомневайся'},
{id:'ps_41',cat:'Мышление',emoji:'🧠',title:'Память',theory:'Забываем 58% за 20 мин.',science:'Эббингауз.',practice:['Повторяй 1д/3д/7д'],effect:'×3',tips:'Интервалы'},
{id:'ps_42',cat:'Отношения',emoji:'🤝',title:'Дружба',theory:'5 глубоких > 100.',science:'Качество.',practice:['Встречи 1×/нед'],effect:'+Поддержка',tips:'Глубина'},
{id:'ps_43',cat:'Отношения',emoji:'💑',title:'Любовь',theory:'5 языков (Чепмен).',science:'Слова/время/подарки/помощь/объятия.',practice:['Определи'],effect:'+Отношения',tips:'На его языке'},
{id:'ps_44',cat:'Отношения',emoji:'🏠',title:'Семья',theory:'Корни.',science:'Удлиняет жизнь.',practice:['Звонок 1×/нед'],effect:'+Поддержка',tips:'Важна'},
{id:'ps_45',cat:'Мышление',emoji:'🎓',title:'Обучение',theory:'Recall > Recognition.',science:'×3.',practice:['Вспомни'],effect:'+Память',tips:'Тестируй'},
{id:'ps_46',cat:'Мышление',emoji:'🔄',title:'Привычки',theory:'Cue→Craving→Response→Reward.',science:'66 дней.',practice:['1 привычка 2 мин'],effect:'+Автоматизм',tips:'Медленно'},
{id:'ps_47',cat:'Мышление',emoji:'💰',title:'Психология денег',theory:'Деньги = эмоции.',science:'Импульс = дофамин.',practice:['24 часа'],effect:'+Сбережения',tips:'Пауза'},
{id:'ps_48',cat:'Мышление',emoji:'🎯',title:'Цели',theory:'SMART + внутренняя.',science:'Записанные +42%.',practice:['3 цели'],effect:'+Результаты',tips:'Записывай'},
{id:'ps_49',cat:'Мышление',emoji:'🌅',title:'Смысл',theory:'Икигай.',science:'Японцы.',practice:['4 списка'],effect:'+Смысл',tips:'Пересечение'},
{id:'ps_50',cat:'Мышление',emoji:'🕊',title:'Принятие',theory:'Не борись.',science:'ACT.',practice:['Наблюдай'],effect:'+Спокойствие',tips:'Отпусти'},
{id:'ps_51',cat:'Мышление',emoji:'🔬',title:'Метапознание',theory:'Знай, что знаешь.',science:'Даннинг-Крюгер.',practice:['Оцени себя'],effect:'+Точность',tips:'Границы'},
{id:'ps_52',cat:'Мышление',emoji:'⚖️',title:'Диалектика',theory:'Тезис+Антитезис=Синтез.',science:'Гегель.',practice:['Найди синтез'],effect:'+Глубина',tips:'Обе стороны'},
{id:'ps_53',cat:'Мышление',emoji:'🔍',title:'Абдукция',theory:'Лучшее объяснение.',science:'Пирс.',practice:['5 выводов'],effect:'+Гибкость',tips:'Альтернативы'},
{id:'ps_54',cat:'Мышление',emoji:'📐',title:'Силлогизмы',theory:'2 посылки + вывод.',science:'Аристотель.',practice:['5 силлогизмов'],effect:'+Строгость',tips:'Проверяй'},
{id:'ps_55',cat:'Мышление',emoji:'🎭',title:'Софизмы',theory:'Ложные аргументы.',science:'Древняя Греция.',practice:['Найди 5'],effect:'-Манипуляции',tips:'Знай'},
{id:'ps_56',cat:'Мышление',emoji:'💼',title:'Экономическое',theory:'Спрос/предложение.',science:'Смит.',practice:['3 решения'],effect:'+Понимание',tips:'Рынок'},
{id:'ps_57',cat:'Мышление',emoji:'🌐',title:'Глобальное',theory:'Мир — система.',science:'Маклюэн.',practice:['3 связи'],effect:'+Понимание',tips:'Целое'},
{id:'ps_58',cat:'Мышление',emoji:'📊',title:'Статистическое',theory:'Распределения.',science:'Тьюки.',practice:['Анализ'],effect:'+Точность',tips:'Данные'},
{id:'ps_59',cat:'Мышление',emoji:'🌊',title:'Хаос',theory:'Малые → большие.',science:'Лоренц.',practice:['3 точки'],effect:'+Понимание',tips:'Всё связано'},
{id:'ps_60',cat:'Мышление',emoji:'♻️',title:'Экологическое',theory:'Всё связано.',science:'Капра.',practice:['Оцени след'],effect:'+Осознанность',tips:'Целое'},
{id:'ps_61',cat:'Мышление',emoji:'🌐',title:'Сетевое',theory:'Узлы, связи, хабы.',science:'Барабаши.',practice:['Нарисуй сеть'],effect:'+Понимание',tips:'Узлы'},
{id:'ps_62',cat:'Мышление',emoji:'🧬',title:'Эволюционное',theory:'Изменчивость + отбор.',science:'Дарвин.',practice:['3 системы'],effect:'+Понимание',tips:'Отбор'},
{id:'ps_63',cat:'Мышление',emoji:'🎯',title:'Дизайнерское',theory:'Юзер в центре.',science:'IDEO.',practice:['1 задача'],effect:'+Решения',tips:'Эмпатия'},
{id:'ps_64',cat:'Мышление',emoji:'🎭',title:'Нарративное',theory:'Мир — истории.',science:'Юнг.',practice:['1 историю'],effect:'+Влияние',tips:'Сторителлинг'},
{id:'ps_65',cat:'Мышление',emoji:'🚀',title:'Футуристическое',theory:'Думай о будущем.',science:'Тоффлер.',practice:['3 тренда'],effect:'+Дальновидность',tips:'Вперёд'},
{id:'ps_66',cat:'Эмоции',emoji:'🌧',title:'Меланхолия',theory:'Лёгкая грусть полезна.',science:'Для рефлексии.',practice:['Дневник'],effect:'+Глубина',tips:'Не застревай'},
{id:'ps_67',cat:'Эмоции',emoji:'😊',title:'Радость',theory:'Тренируется.',science:'Селигман.',practice:['3 радости/день'],effect:'+Счастье',tips:'Замечай'},
{id:'ps_68',cat:'Эмоции',emoji:'🎭',title:'Стыд',theory:'Социальная эмоция.',science:'Брене Браун.',practice:['Уязвимость'],effect:'+Связь',tips:'Открытость'},
{id:'ps_69',cat:'Эмоции',emoji:'😨',title:'Страх',theory:'Сигнал опасности.',science:'Миндалина.',practice:['Экспозиция'],effect:'+Смелость',tips:'Иди навстречу'},
{id:'ps_70',cat:'Эмоции',emoji:'😌',title:'Спокойствие',theory:'Парасимпатика.',science:'Дыхание.',practice:['4-7-8'],effect:'+Спокойствие',tips:'Дыши'},
{id:'ps_71',cat:'Мышление',emoji:'🎯',title:'Целеполагание',theory:'SMART + OKR.',science:'Дуэк.',practice:['3 цели'],effect:'+Результаты',tips:'Записывай'},
{id:'ps_72',cat:'Мышление',emoji:'⏰',title:'Тайм-менеджмент',theory:'Time-blocking.',science:'Ньюпорт.',practice:['План вечером'],effect:'+Продуктивность',tips:'Слоты'},
{id:'ps_73',cat:'Мышление',emoji:'⚡',title:'Энергия',theory:'90/15 ритмы.',science:'Ультрадианные.',practice:['90 мин блок'],effect:'+Сил',tips:'Пик для сложного'},
{id:'ps_74',cat:'Мышление',emoji:'🎯',title:'Фокус',theory:'Одна задача.',science:'23 мин потерь.',practice:['Авиарежим'],effect:'+40%',tips:'Убери соблазн'},
{id:'ps_75',cat:'Мышление',emoji:'🔄',title:'Итерации',theory:'Быстрые циклы.',science:'OODA.',practice:['1 цикл/день'],effect:'+Скорость',tips:'Быстрее'},
{id:'ps_76',cat:'Мышление',emoji:'🎯',title:'Приоритеты',theory:'Матрица Эйзенхауэра.',science:'Q2 главное.',practice:['Разбери'],effect:'+Фокус',tips:'Q2'},
{id:'ps_77',cat:'Мышление',emoji:'📊',title:'Метрики',theory:'Что измеряешь — улучшаешь.',science:'Деминг.',practice:['3 метрики'],effect:'+Прогресс',tips:'Цифры'},
{id:'ps_78',cat:'Мышление',emoji:'🎓',title:'Менторство',theory:'Вопросы > советы.',science:'GROW.',practice:['Найди ментора'],effect:'+Рост',tips:'Учись'},
{id:'ps_79',cat:'Мышление',emoji:'👑',title:'Лидерство',theory:'Level 5.',science:'Коллинз.',practice:['Развивай 1'],effect:'+Влияние',tips:'Служение'},
{id:'ps_80',cat:'Мышление',emoji:'⚔️',title:'Переговоры',theory:'BATNA.',science:'Фишер.',practice:['Определи BATNA'],effect:'+Результаты',tips:'Win-win'},
{id:'ps_81',cat:'Отношения',emoji:'💬',title:'Активное слушание',theory:'3 уровня.',science:'Роджерс.',practice:['Парафраз'],effect:'+Связи',tips:'Слушай'},
{id:'ps_82',cat:'Отношения',emoji:'🚧',title:'Ассертивность',theory:'Твёрдо без агрессии.',science:'Я-сообщения.',practice:['Скажи "нет"'],effect:'+Уважение',tips:'Твёрдо'},
{id:'ps_83',cat:'Отношения',emoji:'🎭',title:'Харизма',theory:'Присутствие+тепло.',science:'Кабейн.',practice:['Полное внимание'],effect:'+Влияние',tips:'Тренируется'},
{id:'ps_84',cat:'Отношения',emoji:'💞',title:'Эмпатия',theory:'3 типа.',science:'Гоулман.',practice:['1 слушание/день'],effect:'+Связи',tips:'Слушай'},
{id:'ps_85',cat:'Отношения',emoji:'🤝',title:'Доверие',theory:'Компетентность+честность.',science:'Кови.',practice:['Держи слово'],effect:'+Связи',tips:'Надёжность'},
{id:'ps_86',cat:'Мышление',emoji:'🏛',title:'Экзистенциализм',theory:'Существование → сущность.',science:'Сартр.',practice:['3 решения'],effect:'+Смысл',tips:'Создай себя'},
{id:'ps_87',cat:'Мышление',emoji:'🧘',title:'Буддизм',theory:'Страдание от привязанности.',science:'4 истины.',practice:['Медитация'],effect:'+Спокойствие',tips:'Отпусти'},
{id:'ps_88',cat:'Мышление',emoji:'🌊',title:'Даосизм',theory:'У-вэй.',science:'Лао-цзы.',practice:['Не борись'],effect:'+Лёгкость',tips:'Расслабься'},
{id:'ps_89',cat:'Мышление',emoji:'🕊',title:'Икигай',theory:'4 сферы.',science:'Япония.',practice:['4 списка'],effect:'+Смысл',tips:'Пересечение'},
{id:'ps_90',cat:'Мышление',emoji:'💀',title:'Memento mori',theory:'Помни о смерти.',science:'Стоики.',practice:['Эпитафия'],effect:'+Приоритеты',tips:'Фильтр'},
{id:'ps_91',cat:'Мышление',emoji:'🎭',title:'Абсурдизм',theory:'Мир абсурден — бунтуй.',science:'Камю.',practice:['Найди смысл'],effect:'+Свобода',tips:'С улыбкой'},
{id:'ps_92',cat:'Мышление',emoji:'⚖️',title:'Этика',theory:'Кант+утилитаризм.',science:'Кант.',practice:['3 дилеммы'],effect:'+Принципы',tips:'Последствия'},
{id:'ps_93',cat:'Мышление',emoji:'🌍',title:'Экзистенциальный выбор',theory:'Ты = сумма выборов.',science:'Сартр.',practice:['3 выбора'],effect:'+Ответственность',tips:'Осознанно'},
{id:'ps_94',cat:'Мышление',emoji:'🕉',title:'Присутствие',theory:'Здесь и сейчас.',science:'Толле.',practice:['5 мин'],effect:'+Спокойствие',tips:'Сейчас'},
{id:'ps_95',cat:'Мышление',emoji:'🔍',title:'Рефлексия',theory:'Мышление о действиях.',science:'Шон.',practice:['Дневник 15 мин'],effect:'+Рост',tips:'Рефлексируй'},
{id:'ps_96',cat:'Мышление',emoji:'📚',title:'Метаобучение',theory:'Учись учиться.',science:'Браун.',practice:['Recall'],effect:'+Скорость',tips:'Метод'},
{id:'ps_97',cat:'Мышление',emoji:'🎯',title:'Калибровка',theory:'Знай границы.',science:'Даннинг-Крюгер.',practice:['Оцени знания'],effect:'+Точность',tips:'Границы'},
{id:'ps_98',cat:'Мышление',emoji:'🌅',title:'Позитивное мышление',theory:'Реалистичный оптимизм.',science:'Селигман.',practice:['3 хороших'],effect:'+Настроение',tips:'Реалистично'},
{id:'ps_99',cat:'Мышление',emoji:'🎓',title:'Growth mindset',theory:'Способности развиваются.',science:'Дуэк.',practice:['"Пока"'],effect:'+Результаты',tips:'Развивайся'},
{id:'ps_100',cat:'Мышление',emoji:'🔄',title:'Итерации',theory:'Быстрые циклы.',science:'Бойд.',practice:['1 цикл/день'],effect:'+Скорость',tips:'Быстрее'}
];

/* ============ THINKING_TOPICS (100) ============ */
var THINKING_TOPICS=[
{id:'t_001',cat:'Логика',emoji:'🔍',title:'Дедукция',theory:'От общего к частному. Все люди смертны, Сократ — человек → Сократ смертен.',science:'Аристотель.',practice:['3 следствия','Силлогизмы','Проверяй посылки'],effect:'+Точность',tips:'Проверяй посылки'},
{id:'t_002',cat:'Логика',emoji:'🔎',title:'Индукция',theory:'От частного к общему.',science:'Юм.',practice:['3 обобщения','Контрпример'],effect:'+Понимание',tips:'Ищи исключения'},
{id:'t_003',cat:'Логика',emoji:'🎯',title:'Абдукция',theory:'Лучшее объяснение.',science:'Пирс.',practice:['5 объяснений'],effect:'+Гибкость',tips:'Альтернативы'},
{id:'t_004',cat:'Логика',emoji:'⚠️',title:'Логические ошибки',theory:'Ad hominem, straw man.',science:'Древняя Греция.',practice:['1 ошибка/день'],effect:'-Манипуляции',tips:'Знай'},
{id:'t_005',cat:'Логика',emoji:'⚖️',title:'Формальная логика',theory:'Modus ponens, tollens.',science:'Лейбниц.',practice:['5 аргументов'],effect:'+Строгость',tips:'Форма'},
{id:'t_006',cat:'Логика',emoji:'🔀',title:'Неформальная логика',theory:'Реальные аргументы.',science:'Тулмин.',practice:['3 статьи'],effect:'+Выводы',tips:'Контекст'},
{id:'t_007',cat:'Логика',emoji:'📐',title:'Силлогизмы',theory:'2 посылки + вывод.',science:'Аристотель.',practice:['5 силлогизмов'],effect:'+Строгость',tips:'Валидность'},
{id:'t_008',cat:'Логика',emoji:'🎲',title:'Теория вероятностей',theory:'Мера неопределённости.',science:'Колмогоров.',practice:['5 событий в %'],effect:'+Точность',tips:'Думай %'},
{id:'t_009',cat:'Логика',emoji:'📊',title:'Теорема Байеса',theory:'Обновляй вероятность.',science:'Машинное обучение.',practice:['3 решения'],effect:'+Точность',tips:'Данные'},
{id:'t_010',cat:'Логика',emoji:'🎯',title:'Парадоксы',theory:'Лжец, Рассел.',science:'Двигают науку.',practice:['5 парадоксов'],effect:'+Глубина',tips:'Сомневайся'},
{id:'t_011',cat:'Системное',emoji:'🕸',title:'Системное мышление',theory:'Целое, не части.',science:'Деминг.',practice:['Mind map'],effect:'+Понимание',tips:'Целое'},
{id:'t_012',cat:'Системное',emoji:'🔄',title:'Обратные связи',theory:'Положительные/отрицательные.',science:'Мид.',practice:['3 петли'],effect:'+Динамика',tips:'Петли'},
{id:'t_013',cat:'Системное',emoji:'⚡',title:'Точки воздействия',theory:'Рычаг.',science:'Медоуз.',practice:['1 точка'],effect:'+Эффективность',tips:'Рычаг'},
{id:'t_014',cat:'Системное',emoji:'🎯',title:'Задержки',theory:'Причина→эффект.',science:'Форрестер.',practice:['3 задержки'],effect:'+Терпение',tips:'Долго'},
{id:'t_015',cat:'Системное',emoji:'🌊',title:'Нелинейность',theory:'2× вход ≠ 2× выход.',science:'Лоренц.',practice:['3 нелинейности'],effect:'+Понимание',tips:'Сложно'},
{id:'t_016',cat:'Системное',emoji:'🌀',title:'Эмерджентность',theory:'Целое > сумма.',science:'Андерсон.',practice:['3 явления'],effect:'+Понимание',tips:'Целое'},
{id:'t_017',cat:'Системное',emoji:'♻️',title:'Гомеостаз',theory:'Возврат к равновесию.',science:'Кеннон.',practice:['3 гомеостаза'],effect:'+Понимание',tips:'Баланс'},
{id:'t_018',cat:'Системное',emoji:'🌟',title:'Самоорганизация',theory:'Порядок из хаоса.',science:'Пригожин.',practice:['3 примера'],effect:'+Понимание',tips:'Спонтанно'},
{id:'t_019',cat:'Системное',emoji:'🎭',title:'Архетипы систем',theory:'Пределы роста, трагедия.',science:'Сенге.',practice:['3 архетипа'],effect:'+Понимание',tips:'Паттерны'},
{id:'t_020',cat:'Системное',emoji:'🔬',title:'First principles',theory:'Разбей до основы.',science:'Маск.',practice:['1 проблема'],effect:'+Инновации',tips:'Фундамент'},
{id:'t_021',cat:'Творческое',emoji:'💡',title:'Латеральное',theory:'В сторону.',science:'Де Боно.',practice:['5 решений'],effect:'+Креатив',tips:'В сторону'},
{id:'t_022',cat:'Творческое',emoji:'🎨',title:'Дивергентное',theory:'Много идей.',science:'Гилфорд.',practice:['20 идей'],effect:'+Идеи',tips:'Количество'},
{id:'t_023',cat:'Творческое',emoji:'🎯',title:'Конвергентное',theory:'Лучшая идея.',science:'Гилфорд.',practice:['Оцени 10'],effect:'+Выбор',tips:'Синтез'},
{id:'t_024',cat:'Творческое',emoji:'🔄',title:'SCAMPER',theory:'7 приёмов.',science:'Осборн.',practice:['1 проблема'],effect:'+Идеи',tips:'7 приёмов'},
{id:'t_025',cat:'Творческое',emoji:'🧠',title:'Mind map',theory:'Ветви от центра.',science:'Бьюзен.',practice:['1 карта/день'],effect:'+Структура',tips:'Визуально'},
{id:'t_026',cat:'Творческое',emoji:'🎭',title:'6 шляп',theory:'6 ролей.',science:'Де Боно.',practice:['1 проблема'],effect:'+Многогранность',tips:'Роли'},
{id:'t_027',cat:'Творческое',emoji:'⚡',title:'Мозговой штурм',theory:'Без критики.',science:'Осборн.',practice:['20 идей'],effect:'+Идеи',tips:'Не критикуй'},
{id:'t_028',cat:'Творческое',emoji:'✂️',title:'Инверсия',theory:'Наоборот.',science:'Якоби.',practice:['3 цели'],effect:'+Решения',tips:'Наоборот'},
{id:'t_029',cat:'Творческое',emoji:'🌊',title:'Аналогии',theory:'Перенос решений.',science:'Velcro.',practice:['3 аналогии'],effect:'+Идеи',tips:'Параллели'},
{id:'t_030',cat:'Творческое',emoji:'🎪',title:'Ограничения',theory:'Стимулируют креатив.',science:'Хемингуэй.',practice:['3 ограничения'],effect:'+Креатив',tips:'Рамки'},
{id:'t_031',cat:'Критическое',emoji:'🔍',title:'Критическое мышление',theory:'Проверяй всё.',science:'Stanford.',practice:['1 новость/день'],effect:'+Объективность',tips:'Проверяй'},
{id:'t_032',cat:'Критическое',emoji:'⚠️',title:'Когнитивные искажения',theory:'Confirmation, anchoring.',science:'Канеман.',practice:['1 искажение'],effect:'+Точность',tips:'Ошибки'},
{id:'t_033',cat:'Критическое',emoji:'📊',title:'Оценка источников',theory:'Первоисточник.',science:'Латеральное чтение.',practice:['3 источника'],effect:'+Точность',tips:'Кто?'},
{id:'t_034',cat:'Критическое',emoji:'🎯',title:'Научный метод',theory:'Гипотеза→эксперимент.',science:'Бэкон.',practice:['1 эксперимент'],effect:'+Знание',tips:'Проверяй'},
{id:'t_035',cat:'Критическое',emoji:'🧪',title:'Фальсифицируемость',theory:'Опровергаемость.',science:'Поппер.',practice:['3 утверждения'],effect:'+Понимание',tips:'Опровергнуть?'},
{id:'t_036',cat:'Критическое',emoji:'📉',title:'Корреляция ≠ причинность',theory:'Связь ≠ причина.',science:'Пирл.',practice:['3 ложные'],effect:'+Точность',tips:'Механизм'},
{id:'t_037',cat:'Критическое',emoji:'🎲',title:'Ошибка выжившего',theory:'Видим выживших.',science:'Вальд.',practice:['3 примера'],effect:'+Объективность',tips:'Провалы?'},
{id:'t_038',cat:'Критическое',emoji:'💬',title:'Риторика',theory:'Этос, пафос, логос.',science:'Аристотель.',practice:['3 речи'],effect:'+Влияние',tips:'Эмоции+логика'},
{id:'t_039',cat:'Критическое',emoji:'🎭',title:'Манипуляции',theory:'Газлайтинг, FOMO.',science:'Чалдини.',practice:['3 манипуляции'],effect:'-Манипуляции',tips:'Приёмы'},
{id:'t_040',cat:'Критическое',emoji:'🔬',title:'Метапознание',theory:'Мышление о мышлении.',science:'Флавелл.',practice:['Дневник'],effect:'+Осознанность',tips:'Думай о думах'},
{id:'t_041',cat:'Стратегия',emoji:'♟',title:'Стратегическое',theory:'Долгая перспектива.',science:'Клаузевиц.',practice:['5 лет'],effect:'+Дальновидность',tips:'Далеко'},
{id:'t_042',cat:'Стратегия',emoji:'🎯',title:'Тактическое',theory:'Короткая.',science:'Сунь-Цзы.',practice:['Неделя'],effect:'+Результаты',tips:'Шаги'},
{id:'t_043',cat:'Стратегия',emoji:'🎲',title:'Теория игр',theory:'Игроки, стратегии.',science:'Нэш.',practice:['3 игры'],effect:'+Понимание',tips:'Игрок'},
{id:'t_044',cat:'Стратегия',emoji:'🌐',title:'Второй порядок',theory:'А что потом?',science:'Маркс.',practice:['3 порядка'],effect:'+Дальновидность',tips:'Дальше'},
{id:'t_045',cat:'Стратегия',emoji:'⚖️',title:'Обратное планирование',theory:'Начни с конца.',science:'Кови.',practice:['1 цель'],effect:'+Планирование',tips:'С конца'},
{id:'t_046',cat:'Стратегия',emoji:'🎯',title:'Правило 80/20',theory:'20% → 80%.',science:'Парето.',practice:['Найди 20%'],effect:'+Эффективность',tips:'Главное'},
{id:'t_047',cat:'Стратегия',emoji:'🌊',title:'Антихрупкость',theory:'Растут в стрессе.',science:'Талеб.',practice:['Стресс-тесты'],effect:'+Устойчивость',tips:'Стресс'},
{id:'t_048',cat:'Стратегия',emoji:'🎯',title:'Опциональность',theory:'Много опций.',science:'Талеб.',practice:['3 опции'],effect:'+Гибкость',tips:'Яйца'},
{id:'t_049',cat:'Стратегия',emoji:'🎲',title:'Сценарии',theory:'Лучший/базовый/худший.',science:'Shell.',practice:['3 сценария'],effect:'+Готовность',tips:'Варианты'},
{id:'t_050',cat:'Стратегия',emoji:'🎯',title:'Выбор',theory:'Выбор = отказ.',science:'Баффет.',practice:['Скажи "нет" 3'],effect:'+Фокус',tips:'Меньше'},
{id:'t_051',cat:'Эмоциональное',emoji:'❤️',title:'EQ',theory:'5 компонентов.',science:'Гоулман.',practice:['Дневник'],effect:'+Успех',tips:'Осознай'},
{id:'t_052',cat:'Эмоциональное',emoji:'🧘',title:'Осознанность',theory:'Наблюдай.',science:'MBSR.',practice:['10 мин'],effect:'+Спокойствие',tips:'Сейчас'},
{id:'t_053',cat:'Эмоциональное',emoji:'🌊',title:'Принятие',theory:'Не борись.',science:'ACT.',practice:['90 сек'],effect:'+Спокойствие',tips:'Отпусти'},
{id:'t_054',cat:'Эмоциональное',emoji:'😤',title:'Гнев',theory:'Пауза 6 сек.',science:'Кора.',practice:['Пауза'],effect:'-Конфликты',tips:'Пауза'},
{id:'t_055',cat:'Эмоциональное',emoji:'😰',title:'Тревога',theory:'4-7-8.',science:'Парасимпатика.',practice:['4-7-8'],effect:'-Тревога',tips:'Дыши'},
{id:'t_056',cat:'Эмоциональное',emoji:'💪',title:'Устойчивость',theory:'Что не убивает.',science:'Рост.',practice:['3 неудачи'],effect:'+Сила',tips:'Стресс'},
{id:'t_057',cat:'Эмоциональное',emoji:'🎯',title:'Мотивация',theory:'Автономия+компетентность.',science:'Деси.',practice:['Смысл'],effect:'+Действие',tips:'Внутренняя'},
{id:'t_058',cat:'Эмоциональное',emoji:'💭',title:'Мысли ≠ факты',theory:'Гипотеза.',science:'КПТ.',practice:['Оспорь 3'],effect:'-Тревога',tips:'Проверяй'},
{id:'t_059',cat:'Эмоциональное',emoji:'🎯',title:'Поток',theory:'Сложность=навык.',science:'Чиксентмихайи.',practice:['Задача-вызов'],effect:'+Счастье',tips:'В потоке'},
{id:'t_060',cat:'Эмоциональное',emoji:'🌅',title:'Позитивное',theory:'Реалистичный оптимизм.',science:'Селигман.',practice:['3 хороших'],effect:'+Настроение',tips:'Реалистично'},
{id:'t_061',cat:'Социальное',emoji:'👥',title:'Теория разума',theory:'Понимание чужого.',science:'Барон-Коэн.',practice:['3 мотива'],effect:'+Эмпатия',tips:'На место'},
{id:'t_062',cat:'Социальное',emoji:'🤝',title:'Социальный обмен',theory:'Даём, чтобы получать.',science:'Чалдини.',practice:['Дай первым'],effect:'+Связи',tips:'Дай'},
{id:'t_063',cat:'Социальное',emoji:'💬',title:'ННО',theory:'Наблюдение→Чувство→Потребность→Просьба.',science:'Розенберг.',practice:['Я-сообщения'],effect:'-Конфликты',tips:'Без "ты"'},
{id:'t_064',cat:'Социальное',emoji:'🎭',title:'Маски',theory:'Разные роли.',science:'Гоффман.',practice:['3 маски'],effect:'+Осознанность',tips:'Роли'},
{id:'t_065',cat:'Социальное',emoji:'👑',title:'Лидерство',theory:'Level 5.',science:'Коллинз.',practice:['Развивай 1'],effect:'+Влияние',tips:'Служение'},
{id:'t_066',cat:'Социальное',emoji:'⚔️',title:'Конфликты',theory:'5 стилей.',science:'Томас-Килманн.',practice:['Сотрудничество'],effect:'+Решения',tips:'Win-win'},
{id:'t_067',cat:'Социальное',emoji:'🚧',title:'Границы',theory:'Я не могу X, но могу Y.',science:'Уважение.',practice:['3 "нет"'],effect:'+Уважение',tips:'Без вины'},
{id:'t_068',cat:'Социальное',emoji:'🌐',title:'Нетворкинг',theory:'Дай первым.',science:'Гранноветтер.',practice:['5 контактов'],effect:'+Возможности',tips:'Ценность'},
{id:'t_069',cat:'Социальное',emoji:'💞',title:'Эмпатия',theory:'3 типа.',science:'Гоулман.',practice:['1 слушание'],effect:'+Связи',tips:'Слушай'},
{id:'t_070',cat:'Социальное',emoji:'🎯',title:'Влияние',theory:'6 принципов Чалдини.',science:'Чалдини.',practice:['1 принцип'],effect:'+Влияние',tips:'Этично'},
{id:'t_071',cat:'Философия',emoji:'🏛',title:'Стоицизм',theory:'Дихотомия.',science:'Марк Аврелий.',practice:['Что в власти'],effect:'+Спокойствие',tips:'Реакция'},
{id:'t_072',cat:'Философия',emoji:'🎯',title:'Экзистенциализм',theory:'Существование → сущность.',science:'Сартр.',practice:['3 решения'],effect:'+Смысл',tips:'Создай'},
{id:'t_073',cat:'Философия',emoji:'🧘',title:'Буддизм',theory:'Страдание от привязанности.',science:'4 истины.',practice:['Медитация'],effect:'+Спокойствие',tips:'Отпусти'},
{id:'t_074',cat:'Философия',emoji:'🌊',title:'Даосизм',theory:'У-вэй.',science:'Лао-цзы.',practice:['Не борись'],effect:'+Лёгкость',tips:'Расслабься'},
{id:'t_075',cat:'Философия',emoji:'🕊',title:'Икигай',theory:'4 сферы.',science:'Япония.',practice:['4 списка'],effect:'+Смысл',tips:'Пересечение'},
{id:'t_076',cat:'Философия',emoji:'💀',title:'Memento mori',theory:'Помни о смерти.',science:'Стоики.',practice:['Эпитафия'],effect:'+Приоритеты',tips:'Фильтр'},
{id:'t_077',cat:'Философия',emoji:'🎭',title:'Абсурдизм',theory:'Мир абсурден.',science:'Камю.',practice:['Смысл'],effect:'+Свобода',tips:'С улыбкой'},
{id:'t_078',cat:'Философия',emoji:'⚖️',title:'Этика',theory:'Кант+утилитаризм.',science:'Кант.',practice:['3 дилеммы'],effect:'+Принципы',tips:'Последствия'},
{id:'t_079',cat:'Философия',emoji:'🌍',title:'Экзистенциальный выбор',theory:'Ты = выборы.',science:'Сартр.',practice:['3 выбора'],effect:'+Ответственность',tips:'Осознанно'},
{id:'t_080',cat:'Философия',emoji:'🕉',title:'Присутствие',theory:'Здесь и сейчас.',science:'Толле.',practice:['5 мин'],effect:'+Спокойствие',tips:'Сейчас'},
{id:'t_081',cat:'Метапознание',emoji:'🔍',title:'Рефлексия',theory:'Мышление о действиях.',science:'Шон.',practice:['Дневник'],effect:'+Рост',tips:'Рефлексируй'},
{id:'t_082',cat:'Метапознание',emoji:'📚',title:'Метаобучение',theory:'Учись учиться.',science:'Браун.',practice:['Recall'],effect:'+Скорость',tips:'Метод'},
{id:'t_083',cat:'Метапознание',emoji:'🎯',title:'Калибровка',theory:'Знай границы.',science:'Даннинг-Крюгер.',practice:['Оцени'],effect:'+Точность',tips:'Границы'},
{id:'t_084',cat:'Метапознание',emoji:'🚫',title:'Прокрастинация',theory:'Эмоциональная регуляция.',science:'Стил.',practice:['2 минуты'],effect:'-Прокрастинация',tips:'Начало'},
{id:'t_085',cat:'Метапознание',emoji:'🎯',title:'Внимание',theory:'Фокус = валюта.',science:'Ньюпорт.',practice:['Авиарежим'],effect:'+Продуктивность',tips:'Одна'},
{id:'t_086',cat:'Метапознание',emoji:'💭',title:'Самосознание',theory:'Знай себя.',science:'Гоулман.',practice:['Дневник'],effect:'+Ясность',tips:'Познай'},
{id:'t_087',cat:'Метапознание',emoji:'🎓',title:'Growth mindset',theory:'Развиваются.',science:'Дуэк.',practice:['"Пока"'],effect:'+Результаты',tips:'Развивайся'},
{id:'t_088',cat:'Метапознание',emoji:'🔬',title:'Научное мышление',theory:'Гипотезы.',science:'Фейнман.',practice:['1 гипотеза'],effect:'+Знание',tips:'Проверяй'},
{id:'t_089',cat:'Метапознание',emoji:'🎯',title:'Приоритизация',theory:'Важно/срочно.',science:'Эйзенхауэр.',practice:['Матрица'],effect:'+Фокус',tips:'Q2'},
{id:'t_090',cat:'Метапознание',emoji:'🔄',title:'Итерации',theory:'Быстрые циклы.',science:'Бойд.',practice:['1 цикл'],effect:'+Скорость',tips:'Быстрее'},
{id:'t_091',cat:'Специальное',emoji:'🌍',title:'Глобальное',theory:'Мир — система.',science:'Маклюэн.',practice:['3 связи'],effect:'+Понимание',tips:'Целое'},
{id:'t_092',cat:'Специальное',emoji:'💰',title:'Финансовое',theory:'Активы vs пассивы.',science:'Кийосаки.',practice:['Список'],effect:'+Богатство',tips:'Активы'},
{id:'t_093',cat:'Специальное',emoji:'📊',title:'Статистическое',theory:'Распределения.',science:'Тьюки.',practice:['Анализ'],effect:'+Точность',tips:'Данные'},
{id:'t_094',cat:'Специальное',emoji:'🌊',title:'Хаос',theory:'Малые → большие.',science:'Лоренц.',practice:['3 точки'],effect:'+Понимание',tips:'Всё связано'},
{id:'t_095',cat:'Специальное',emoji:'♻️',title:'Экологическое',theory:'Всё связано.',science:'Капра.',practice:['След'],effect:'+Осознанность',tips:'Целое'},
{id:'t_096',cat:'Специальное',emoji:'🌐',title:'Сетевое',theory:'Узлы, связи.',science:'Барабаши.',practice:['Сеть'],effect:'+Понимание',tips:'Узлы'},
{id:'t_097',cat:'Специальное',emoji:'🧬',title:'Эволюционное',theory:'Отбор.',science:'Дарвин.',practice:['3 системы'],effect:'+Понимание',tips:'Отбор'},
{id:'t_098',cat:'Специальное',emoji:'🎯',title:'Дизайнерское',theory:'Юзер.',science:'IDEO.',practice:['1 задача'],effect:'+Решения',tips:'Эмпатия'},
{id:'t_099',cat:'Специальное',emoji:'🎭',title:'Нарративное',theory:'Истории.',science:'Юнг.',practice:['1 историю'],effect:'+Влияние',tips:'Сторителлинг'},
{id:'t_100',cat:'Специальное',emoji:'🚀',title:'Футуристическое',theory:'О будущем.',science:'Тоффлер.',practice:['3 тренда'],effect:'+Дальновидность',tips:'Вперёд'}
];

/* ============ ETIQUETTE_TOPICS (100) ============ */
var ETIQUETTE_TOPICS=[
{id:'et_001',cat:'Приветствие',emoji:'🤝',title:'Рукопожатие',theory:'Крепкое, но не сжимающее. 2-3 секунды. Смотри в глаза.',science:'Древний жест — показать, что нет оружия.',practice:['Крепко','2-3 сек','В глаза'],effect:'+Уважение',tips:'Не вялое',test:[{q:'Сколько секунд?',options:['1','2-3','5+'],correct:1}]},
{id:'et_002',cat:'Приветствие',emoji:'👋',title:'Приветствие словом',theory:'Здравствуйте (формально), Привет (неформально).',science:'Первое впечатление за 7 сек.',practice:['По ситуации','Улыбка','Имя'],effect:'+Впечатление',tips:'Имя важно'},
{id:'et_003',cat:'Приветствие',emoji:'🎩',title:'Поклон',theory:'Лёгкий наклон головы — уважение.',science:'Азиатская традиция.',practice:['15°','Спина прямая'],effect:'+Уважение',tips:'Не глубоко'},
{id:'et_004',cat:'Приветствие',emoji:'💋',title:'Поцелуй в щёку',theory:'1-3 в зависимости от культуры.',science:'Европа/Латинская Америка.',practice:['По культуре','Справа'],effect:'+Близость',tips:'Не незнакомым'},
{id:'et_005',cat:'Приветствие',emoji:'🤗',title:'Объятия',theory:'Только с близкими.',science:'Окситоцин.',practice:['20 сек','Искренне'],effect:'+Связь',tips:'Не формально'},
{id:'et_006',cat:'Приветствие',emoji:'🙋',title:'Представление',theory:'Имя + должность + рука.',science:'Первое впечатление.',practice:['Имя','Должность','Рука'],effect:'+Впечатление',tips:'Чётко'},
{id:'et_007',cat:'Приветствие',emoji:'👔',title:'Визитка',theory:'Двумя руками в Азии, одной на Западе.',science:'Деловой этикет.',practice:['Двумя руками','Читай','Не клади'],effect:'+Уважение',tips:'Изучи'},
{id:'et_008',cat:'Приветствие',emoji:'🎤',title:'Представление других',theory:'Младшего старшему, мужчину женщине.',science:'Иерархия.',practice:['Порядок','Имя','Должность'],effect:'+Уважение',tips:'Порядок'},
{id:'et_009',cat:'Приветствие',emoji:'🚪',title:'Вход в помещение',theory:'Мужчина пропускает женщину.',science:'Традиция.',practice:['Пропусти','Придержи дверь'],effect:'+Уважение',tips:'Придержи'},
{id:'et_010',cat:'Приветствие',emoji:'🪑',title:'Предложение места',theory:'Старшему/женщине — лучшее место.',science:'Уважение.',practice:['Лучшее','Спиной к двери'],effect:'+Уважение',tips:'Лучшее'},
{id:'et_011',cat:'За столом',emoji:'🍽',title:'Салфетка',theory:'Разверни на колени, не за воротник.',science:'Защита одежды.',practice:['На колени','Промокни','Не вытирай'],effect:'+Этикет',tips:'Не воротник'},
{id:'et_012',cat:'За столом',emoji:'🍴',title:'Приборы',theory:'Снаружи внутрь. Вилка слева, нож справа.',science:'Классика.',practice:['Снаружи','Вилка лево','Нож право'],effect:'+Этикет',tips:'По порядку'},
{id:'et_013',cat:'За столом',emoji:'🥄',title:'Ложка',theory:'Справа от ножа.',science:'Для супа.',practice:['Справа','От себя'],effect:'+Этикет',tips:'От себя'},
{id:'et_014',cat:'За столом',emoji:'🍷',title:'Бокал',theory:'Держи за ножку, не за чашу.',science:'Не нагревать.',practice:['За ножку','Не чокайся сильно'],effect:'+Этикет',tips:'За ножку'},
{id:'et_015',cat:'За столом',emoji:'🍞',title:'Хлеб',theory:'Ломай, не режь. Масло на тарелку.',science:'Традиция.',practice:['Ломай','На тарелку'],effect:'+Этикет',tips:'Ломай'},
{id:'et_016',cat:'За столом',emoji:'🥩',title:'Мясо',theory:'Отрезай по кусочку, не всё сразу.',science:'Классика.',practice:['По кусочку'],effect:'+Этикет',tips:'По кусочку'},
{id:'et_017',cat:'За столом',emoji:'🍝',title:'Паста',theory:'Вилкой и ложкой, или только вилкой.',science:'Италия.',practice:['Вилка+ложка','Не чавкай'],effect:'+Этикет',tips:'Не чавкай'},
{id:'et_018',cat:'За столом',emoji:'🍜',title:'Суп',theory:'Ложкой от себя. Не дуй.',science:'Классика.',practice:['От себя','Не дуй'],effect:'+Этикет',tips:'Не дуй'},
{id:'et_019',cat:'За столом',emoji:'🍣',title:'Суши',theory:'Руками или палочками. Имбирь между.',science:'Япония.',practice:['Руками','Имбирь'],effect:'+Этикет',tips:'Имбирь между'},
{id:'et_020',cat:'За столом',emoji:'☕',title:'Кофе/чай',theory:'Ложку не оставляй в чашке. Не дуй.',science:'Классика.',practice:['Ложку на блюдце','Не дуй'],effect:'+Этикет',tips:'Ложку'},
{id:'et_021',cat:'За столом',emoji:'🍎',title:'Фрукты',theory:'Яблоко — ножом и вилкой. Виноград — руками.',science:'Классика.',practice:['Нож+вилка','Виноград руками'],effect:'+Этикет',tips:'По-разному'},
{id:'et_022',cat:'За столом',emoji:'🍰',title:'Десерт',theory:'Ложка/вилка для десерта — сверху.',science:'Классика.',practice:['Сверху','Своя'],effect:'+Этикет',tips:'Своя'},
{id:'et_023',cat:'За столом',emoji:'🧂',title:'Соль/перец',theory:'Передавай вместе. Не тянись.',science:'Классика.',practice:['Вместе','Попроси'],effect:'+Этикет',tips:'Вместе'},
{id:'et_024',cat:'За столом',emoji:'🍴',title:'Положение приборов',theory:'Вместе — пауза. Крест — закончил.',science:'Сигналы.',practice:['Пауза','Закончил'],effect:'+Этикет',tips:'Сигналы'},
{id:'et_025',cat:'За столом',emoji:'📱',title:'Телефон за столом',theory:'Убери. Не клади на стол.',science:'Уважение.',practice:['Убери','Не на стол'],effect:'+Уважение',tips:'Убери'},
{id:'et_026',cat:'За столом',emoji:'👄',title:'Разговор за столом',theory:'Не с полным ртом.',science:'Классика.',practice:['Не с полным','Приятное'],effect:'+Этикет',tips:'Не с полным'},
{id:'et_027',cat:'За столом',emoji:'💧',title:'Вода',theory:'Не пей залпом. Не чавкай.',science:'Классика.',practice:['Маленько','Не чавкай'],effect:'+Этикет',tips:'Маленько'},
{id:'et_028',cat:'За столом',emoji:'🧻',title:'Салфетка после',theory:'Скомкай слева от тарелки.',science:'Классика.',practice:['Скомкай','Слева'],effect:'+Этикет',tips:'Слева'},
{id:'et_029',cat:'За столом',emoji:'💰',title:'Оплата',theory:'Кто пригласил — тот платит.',science:'Классика.',practice:['Не спорь','Спасибо'],effect:'+Уважение',tips:'Не спорь'},
{id:'et_030',cat:'За столом',emoji:'🙏',title:'Благодарность',theory:'Спасибо за приём. Комплимент.',science:'Классика.',practice:['Спасибо','Комплимент'],effect:'+Впечатление',tips:'Комплимент'},
{id:'et_031',cat:'Деловое',emoji:'📧',title:'Email',theory:'Тема — суть. Обращение — по имени.',science:'Деловой.',practice:['Тема','Имя','Структура'],effect:'+Ответы',tips:'Тема'},
{id:'et_032',cat:'Деловое',emoji:'📞',title:'Звонок',theory:'Не раньше 9, не позже 20.',science:'Деловой.',practice:['9-20','Имя','Цель'],effect:'+Впечатление',tips:'Время'},
{id:'et_033',cat:'Деловое',emoji:'🤝',title:'Встреча',theory:'Приди за 5 мин. Рукопожатие. Визитка.',science:'Деловой.',practice:['5 мин','Рука','Визитка'],effect:'+Впечатление',tips:'5 мин'},
{id:'et_034',cat:'Деловое',emoji:'👔',title:'Дресс-код',theory:'Business, business casual, casual.',science:'По ситуации.',practice:['Узнай','Следуй'],effect:'+Впечатление',tips:'Узнай'},
{id:'et_035',cat:'Деловое',emoji:'💼',title:'Переговоры',theory:'Слушай 70%, говори 30%. BATNA.',science:'Фишер.',practice:['Слушай','BATNA','Win-win'],effect:'+Результат',tips:'Слушай'},
{id:'et_036',cat:'Деловое',emoji:'📊',title:'Презентация',theory:'Hook→Проблема→Решение→CTA.',science:'Структура.',practice:['Hook','10 слайдов','CTA'],effect:'+Влияние',tips:'Мало текста'},
{id:'et_037',cat:'Деловое',emoji:'👥',title:'Совещание',theory:'Приходи подготовленным.',science:'Деловой.',practice:['Подготовься','Слушай','Предложи'],effect:'+Впечатление',tips:'Готовься'},
{id:'et_038',cat:'Деловое',emoji:'📝',title:'Обратная связь',theory:'SBI: Situation-Behavior-Impact.',science:'Деловой.',practice:['SBI','Без "ты"'],effect:'+Рост',tips:'SBI'},
{id:'et_039',cat:'Деловое',emoji:'📅',title:'Планирование',theory:'Calendar, 15 мин буферы, приоритеты.',science:'Time-blocking.',practice:['Календарь','Буферы'],effect:'+Продуктивность',tips:'Буферы'},
{id:'et_040',cat:'Деловое',emoji:'🙋',title:'Делегирование',theory:'Не делай сам. Учи.',science:'Лидерство.',practice:['3 задачи','Учи'],effect:'+Время',tips:'Учи'},
{id:'et_041',cat:'В обществе',emoji:'🎭',title:'Театр',theory:'Приди заранее. Телефон выключен.',science:'Классика.',practice:['Заранее','Телефон off','Антракт'],effect:'+Уважение',tips:'Заранее'},
{id:'et_042',cat:'В обществе',emoji:'🎬',title:'Кино',theory:'Тихо. Не комментируй.',science:'Классика.',practice:['Тихо','Не комментируй'],effect:'+Уважение',tips:'Тихо'},
{id:'et_043',cat:'В обществе',emoji:'🍽',title:'Ресторан',theory:'Бронируй. Чаевые 10-20%.',science:'Классика.',practice:['Бронь','Чаевые','Спасибо'],effect:'+Впечатление',tips:'Чаевые'},
{id:'et_044',cat:'В обществе',emoji:'🚌',title:'Транспорт',theory:'Уступай место. Не ешь.',science:'Классика.',practice:['Уступи','Не ешь','Тихо'],effect:'+Уважение',tips:'Уступи'},
{id:'et_045',cat:'В обществе',emoji:'🛗',title:'Лифт',theory:'Пропускай выходящих.',science:'Классика.',practice:['Пропусти','Держи'],effect:'+Уважение',tips:'Пропусти'},
{id:'et_046',cat:'В обществе',emoji:'🚪',title:'Дверь',theory:'Придержи для следующего.',science:'Классика.',practice:['Придержи','Пропусти'],effect:'+Уважение',tips:'Придержи'},
{id:'et_047',cat:'В обществе',emoji:'🪜',title:'Лестница',theory:'Мужчина снизу при подъёме.',science:'Традиция.',practice:['Снизу/сверху'],effect:'+Этикет',tips:'По ситуации'},
{id:'et_048',cat:'В обществе',emoji:'🌂',title:'Зонт',theory:'Не задевай. Суши в стороне.',science:'Классика.',practice:['Не задевай','Суши'],effect:'+Уважение',tips:'Суши'},
{id:'et_049',cat:'В обществе',emoji:'🐕',title:'Питомцы',theory:'Спрашивай разрешение.',science:'Классика.',practice:['Спроси','Не подходи'],effect:'+Уважение',tips:'Спроси'},
{id:'et_050',cat:'В обществе',emoji:'🎉',title:'Вечеринка',theory:'Приди не первым, не последним.',science:'Классика.',practice:['Не первым','Спасибо'],effect:'+Впечатление',tips:'Не первым'},
{id:'et_051',cat:'Коммуникация',emoji:'👂',title:'Активное слушание',theory:'Не перебивай. Парафраз.',science:'Роджерс.',practice:['Не перебивай','Парафраз'],effect:'+Связи',tips:'Слушай'},
{id:'et_052',cat:'Коммуникация',emoji:'💬',title:'Small talk',theory:'Погода, спорт, кино.',science:'Классика.',practice:['Нейтрально','Слушай'],effect:'+Связи',tips:'Нейтрально'},
{id:'et_053',cat:'Коммуникация',emoji:'🎤',title:'Публичная речь',theory:'Hook. 3 пункта. Паузы.',science:'Структура.',practice:['Hook','3 пункта','Паузы'],effect:'+Влияние',tips:'Паузы'},
{id:'et_054',cat:'Коммуникация',emoji:'🤐',title:'Тайна',theory:'Не разглашай. Не сплетничай.',science:'Доверие.',practice:['Не разглашай'],effect:'+Доверие',tips:'Тайна'},
{id:'et_055',cat:'Коммуникация',emoji:'🎁',title:'Комплимент',theory:'Искренний. Конкретный.',science:'Классика.',practice:['Искренний','Конкретный'],effect:'+Связь',tips:'Искренний'},
{id:'et_056',cat:'Коммуникация',emoji:'🚫',title:'Критика',theory:'Приватно. SBI. Без "ты".',science:'Деловой.',practice:['Приватно','SBI'],effect:'+Рост',tips:'Приватно'},
{id:'et_057',cat:'Коммуникация',emoji:'💌',title:'Извинения',theory:'Искренне. Без "но".',science:'Классика.',practice:['Искренне','Без "но"'],effect:'+Уважение',tips:'Без "но"'},
{id:'et_058',cat:'Коммуникация',emoji:'🙏',title:'Благодарность',theory:'Конкретно. Лично. Быстро.',science:'Классика.',practice:['Конкретно','Лично'],effect:'+Связь',tips:'Конкретно'},
{id:'et_059',cat:'Коммуникация',emoji:'📱',title:'Переписка',theory:'Без капса. Без голосовых без спроса.',science:'Цифровой.',practice:['Без капса','Спроси'],effect:'+Уважение',tips:'Без капса'},
{id:'et_060',cat:'Коммуникация',emoji:'📞',title:'Голосовые',theory:'Спрашивай разрешение. Короткие.',science:'Цифровой.',practice:['Спроси','Короткие'],effect:'+Уважение',tips:'Спроси'},
{id:'et_061',cat:'Внешний вид',emoji:'👔',title:'Костюм',theory:'По фигуре. Тёмный — универсально.',science:'Деловой.',practice:['По фигуре','Тёмный'],effect:'+Впечатление',tips:'По фигуре'},
{id:'et_062',cat:'Внешний вид',emoji:'👞',title:'Обувь',theory:'Чистая. По погоде.',science:'Классика.',practice:['Чистая','Сочетается'],effect:'+Впечатление',tips:'Чистая'},
{id:'et_063',cat:'Внешний вид',emoji:'💇',title:'Причёска',theory:'Аккуратная.',science:'Классика.',practice:['Аккуратная'],effect:'+Впечатление',tips:'Аккуратная'},
{id:'et_064',cat:'Внешний вид',emoji:'🧴',title:'Парфюм',theory:'Легко. Не заливай.',science:'Классика.',practice:['1-2 пшика'],effect:'+Впечатление',tips:'Легко'},
{id:'et_065',cat:'Внешний вид',emoji:'💅',title:'Ногти',theory:'Ухоженные. Чистые.',science:'Классика.',practice:['Ухоженные'],effect:'+Впечатление',tips:'Ухоженные'},
{id:'et_066',cat:'Внешний вид',emoji:'🦷',title:'Зубы',theory:'Чистые. Свежее дыхание.',science:'Классика.',practice:['Чисти','Жвачка'],effect:'+Впечатление',tips:'Чисти'},
{id:'et_067',cat:'Внешний вид',emoji:'👁',title:'Взгляд',theory:'Прямой. 70% времени.',science:'Классика.',practice:['Прямой','70%'],effect:'+Уверенность',tips:'70%'},
{id:'et_068',cat:'Внешний вид',emoji:'😊',title:'Улыбка',theory:'Искренняя. Не дежурная.',science:'Классика.',practice:['Искренняя'],effect:'+Впечатление',tips:'Искренняя'},
{id:'et_069',cat:'Внешний вид',emoji:'🧍',title:'Осанка',theory:'Прямая. Плечи назад.',science:'Классика.',practice:['Прямая','Плечи'],effect:'+Уверенность',tips:'Прямая'},
{id:'et_070',cat:'Внешний вид',emoji:'🚶',title:'Походка',theory:'Уверенная. Не спеши.',science:'Классика.',practice:['Уверенная','Не спеши'],effect:'+Впечатление',tips:'Уверенная'},
{id:'et_071',cat:'Путешествия',emoji:'✈️',title:'Аэропорт',theory:'Приди за 2 ч. Документы готовы.',science:'Классика.',practice:['2 ч','Документы'],effect:'+Спокойствие',tips:'2 ч'},
{id:'et_072',cat:'Путешествия',emoji:'🛂',title:'Паспортный контроль',theory:'Спокойно. Отвечай чётко.',science:'Классика.',practice:['Спокойно','Чётко'],effect:'+Скорость',tips:'Спокойно'},
{id:'et_073',cat:'Путешествия',emoji:'🏨',title:'Отель',theory:'Приветствие. Не шуми. Чаевые.',science:'Классика.',practice:['Приветствие','Тихо','Чаевые'],effect:'+Впечатление',tips:'Тихо'},
{id:'et_074',cat:'Путешествия',emoji:'🍽',title:'За границей',theory:'Изучи обычаи. Не критикуй.',science:'Классика.',practice:['Изучи','Не критикуй'],effect:'+Уважение',tips:'Изучи'},
{id:'et_075',cat:'Путешествия',emoji:'📸',title:'Фото',theory:'Спрашивай разрешение.',science:'Классика.',practice:['Спроси','Не мешай'],effect:'+Уважение',tips:'Спроси'},
{id:'et_076',cat:'Путешествия',emoji:'🚭',title:'Курение',theory:'Только в местах.',science:'Классика.',practice:['В местах','Не рядом'],effect:'+Уважение',tips:'Места'},
{id:'et_077',cat:'Путешествия',emoji:'🍺',title:'Алкоголь',theory:'Знай меру.',science:'Классика.',practice:['Мера','Не напивайся'],effect:'+Впечатление',tips:'Мера'},
{id:'et_078',cat:'Путешествия',emoji:'💰',title:'Чаевые',theory:'10-20% в зависимости от страны.',science:'Классика.',practice:['10-20%','Наличными'],effect:'+Впечатление',tips:'10-20%'},
{id:'et_079',cat:'Путешествия',emoji:'🗣',title:'Язык',theory:'Выучи 5 фраз.',science:'Классика.',practice:['5 фраз','Извинись'],effect:'+Уважение',tips:'5 фраз'},
{id:'et_080',cat:'Путешествия',emoji:'🛍',title:'Торговля',theory:'Торгуйся в Азии/Африке.',science:'Классика.',practice:['По культуре','Улыбка'],effect:'+Цена',tips:'По культуре'},
{id:'et_081',cat:'Цифровое',emoji:'📱',title:'Экран',theory:'Не свети в глаза. Не в кровати.',science:'Цифровой.',practice:['Не свети','Не в кровати'],effect:'+Сон',tips:'Не в кровати'},
{id:'et_082',cat:'Цифровое',emoji:'🔔',title:'Уведомления',theory:'Выключи лишние. Только люди.',science:'Цифровой.',practice:['Выключи','Люди'],effect:'+Фокус',tips:'Люди'},
{id:'et_083',cat:'Цифровое',emoji:'📧',title:'Email',theory:'Без смайлов. Без CAPS.',science:'Деловой.',practice:['Без смайлов','Без CAPS'],effect:'+Впечатление',tips:'Без CAPS'},
{id:'et_084',cat:'Цифровое',emoji:'💬',title:'Мессенджеры',theory:'Коротко. По делу.',science:'Цифровой.',practice:['Коротко','Контекст'],effect:'+Эффективность',tips:'Контекст'},
{id:'et_085',cat:'Цифровое',emoji:'🎥',title:'Zoom',theory:'Камера. Микрофон. Свет. Фон.',science:'Цифровой.',practice:['Камера','Микрофон','Свет'],effect:'+Впечатление',tips:'Камера'},
{id:'et_086',cat:'Цифровое',emoji:'📵',title:'За рулём',theory:'Не пиши. Hands-free.',science:'Закон.',practice:['Не пиши','Hands-free'],effect:'+Безопасность',tips:'Не пиши'},
{id:'et_087',cat:'Цифровое',emoji:'🔒',title:'Пароли',theory:'2FA. Менеджер.',science:'Безопасность.',practice:['2FA','Менеджер'],effect:'+Безопасность',tips:'2FA'},
{id:'et_088',cat:'Цифровое',emoji:'👤',title:'Соцсети',theory:'Думай перед постом.',science:'Цифровой.',practice:['Думай','Не спорь'],effect:'+Репутация',tips:'Думай'},
{id:'et_089',cat:'Цифровое',emoji:'📷',title:'Селфи',theory:'Не в спортзале. Не в туалете.',science:'Цифровой.',practice:['Не везде'],effect:'+Репутация',tips:'Не везде'},
{id:'et_090',cat:'Цифровое',emoji:'🤖',title:'AI',theory:'Проверяй. Не копируй слепо.',science:'Цифровой.',practice:['Проверяй'],effect:'+Точность',tips:'Проверяй'},
{id:'et_091',cat:'Особые случаи',emoji:'⚰️',title:'Похороны',theory:'Чёрное. Тихо. Соболезнования.',science:'Классика.',practice:['Чёрное','Тихо'],effect:'+Уважение',tips:'Чёрное'},
{id:'et_092',cat:'Особые случаи',emoji:'💒',title:'Свадьба',theory:'По дресс-коду. Не в белом.',science:'Классика.',practice:['Дресс-код','Не белое'],effect:'+Уважение',tips:'Не белое'},
{id:'et_093',cat:'Особые случаи',emoji:'🎂',title:'День рождения',theory:'Приди вовремя. Подарок. Поздравь.',science:'Классика.',practice:['Вовремя','Подарок'],effect:'+Впечатление',tips:'Вовремя'},
{id:'et_094',cat:'Особые случаи',emoji:'🤒',title:'Больница',theory:'Не навещай без спроса.',science:'Классика.',practice:['Спроси','Коротко'],effect:'+Уважение',tips:'Спроси'},
{id:'et_095',cat:'Особые случаи',emoji:'🏠',title:'В гостях',theory:'Принеси что-то. Не задерживайся.',science:'Классика.',practice:['Принеси','Не задерживайся'],effect:'+Впечатление',tips:'Принеси'},
{id:'et_096',cat:'Особые случаи',emoji:'🚗',title:'В машине',theory:'Пристегнись. Не отвлекай.',science:'Классика.',practice:['Пристегнись','Не мусори'],effect:'+Уважение',tips:'Пристегнись'},
{id:'et_097',cat:'Особые случаи',emoji:'💐',title:'Цветы',theory:'Нечётное число. Не жёлтые.',science:'Классика.',practice:['Нечётное','Не жёлтые'],effect:'+Впечатление',tips:'Нечётное'},
{id:'et_098',cat:'Особые случаи',emoji:'🎁',title:'Подарок',theory:'Упакован. Открывай при дарителе.',science:'Классика.',practice:['Упакован','При дарителе'],effect:'+Впечатление',tips:'При дарителе'},
{id:'et_099',cat:'Особые случаи',emoji:'🚬',title:'Курение в гостях',theory:'Спроси разрешение. На балкон.',science:'Классика.',practice:['Спроси','Балкон'],effect:'+Уважение',tips:'Спроси'},
{id:'et_100',cat:'Особые случаи',emoji:'🐶',title:'С питомцем в гостях',theory:'Спроси разрешение. Держи.',science:'Классика.',practice:['Спроси','Держи'],effect:'+Уважение',tips:'Спроси'}
];

/* ============ SKILLS_CATEGORIES ============ */
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

/* ============ SKILLS_LIBRARY (60) ============ */
var SKILLS_LIBRARY=[
{id:'sk_iq',cat:'cognitive',title:'IQ-буст',emoji:'🎯',desc:'Повышение IQ',level:'Все',duration:'30 дней',theory:'**IQ = fluid + crystallized.** Тренируется задачами Равена, N-back, аналогиями.',practice:['N-back 5 мин','5 логических задач','5 аналогий'],effect:'IQ +5-15',tips:'Разные типы задач'},
{id:'sk_memory',cat:'cognitive',title:'Феноменальная память',emoji:'🧠',desc:'Дворец памяти',level:'Базовый',duration:'21 день',theory:'**Дворец памяти:** 10 локусов = 10 объектов.',practice:['Дворец 10 локусов','10 слов/день','Anki'],effect:'×3-5',tips:'Странные образы'},
{id:'sk_speedread',cat:'cognitive',title:'Скорочтение',emoji:'👁',desc:'200→600 слов/мин',level:'Базовый',duration:'14 дней',theory:'**Регрессии и субвокализация** — тормоза.',practice:['10 мин с указкой','Не возвращайся','Замеряй'],effect:'×2-3',tips:'Понимание важнее'},
{id:'sk_critical',cat:'cognitive',title:'Критическое мышление',emoji:'🔍',desc:'Логика, аргументы',level:'Все',duration:'30 дней',theory:'**Claim → Evidence → Reasoning → Counter → Conclusion.**',practice:['1 новость/день','5 вопросов','3 ловушки'],effect:'+Объективность',tips:'"А если наоборот?"'},
{id:'sk_decision',cat:'cognitive',title:'Принятие решений',emoji:'⚖️',desc:'Как выбирать',level:'Все',duration:'21 день',theory:'**10/10/10 + инверсия.**',practice:['10/10/10','Инверсия','Дневник'],effect:'-Ошибки',tips:'Спокойствие'},
{id:'sk_creativity',cat:'cognitive',title:'Креативность',emoji:'💡',desc:'Генерация идей',level:'Все',duration:'21 день',theory:'**DMN** активна в покое.',practice:['10 идей/день','Прогулка','Mind map'],effect:'×3 идей',tips:'Количество'},
{id:'sk_deepwork',cat:'cognitive',title:'Deep Work',emoji:'🎯',desc:'Глубокая концентрация',level:'Базовый',duration:'14 дней',theory:'**90 мин блок** = 3 ч обычной.',practice:['90 мин/день','Телефон вне','Одна задача'],effect:'+40%',tips:'Пик энергии'},
{id:'sk_mindfulness',cat:'cognitive',title:'Осознанность',emoji:'🧘',desc:'Присутствие',level:'Все',duration:'30 дней',theory:'**MBSR 8 недель.**',practice:['10 мин утром','Body scan','Осознанное дыхание'],effect:'-Стресс',tips:'Наблюдай'},
{id:'sk_fastlearn',cat:'cognitive',title:'Скорость обучения',emoji:'⚡',desc:'Учиться быстрее',level:'Базовый',duration:'21 день',theory:'**Pomodoro + Recall + Anki + Feynman.**',practice:['Recall после урока','Объясняй','Anki 20/день'],effect:'×3',tips:'Recall > Recognition'},
{id:'sk_planning',cat:'cognitive',title:'Планирование',emoji:'📅',desc:'Система планирования',level:'Базовый',duration:'14 дней',theory:'**Time-blocking + буферы 20%.**',practice:['План вечером','3 дела','Time-block'],effect:'+Фокус',tips:'Буферы'},
{id:'sk_language',cat:'cognitive',title:'Языки',emoji:'🌍',desc:'Быстрое изучение',level:'Базовый',duration:'60 дней',theory:'**1000 слов = 80% понимания.**',practice:['Слушай 30 мин','Говори 15 мин','Anki'],effect:'B1 за 3 мес',tips:'Говори с 1 дня'},
{id:'sk_eq',cat:'emotional',title:'EQ',emoji:'❤️',desc:'Эмоциональный интеллект',level:'Все',duration:'30 дней',theory:'**5 компонентов Гоулмана.**',practice:['Дневник эмоций','Пауза 6 сек','1 я-сообщение'],effect:'+20% EQ',tips:'Назови — ослабь'},
{id:'sk_stress',cat:'emotional',title:'Управление стрессом',emoji:'🌊',desc:'Спокойствие',level:'Все',duration:'21 день',theory:'**Box breathing 4-4-4-4.**',practice:['Box 3×/день','30 мин спорт','2 ч природа'],effect:'-40% стресса',tips:'Тело первым'},
{id:'sk_anger',cat:'emotional',title:'Управление гневом',emoji:'🔥',desc:'Не срываться',level:'Все',duration:'14 дней',theory:'**Пауза 6 сек.**',practice:['Пауза','Пиши, не говори','Спорт'],effect:'-Конфликты',tips:'Сигнал'},
{id:'sk_anxiety',cat:'emotional',title:'Работа с тревогой',emoji:'😰',desc:'Не зацикливаться',level:'Базовый',duration:'21 день',theory:'**4-7-8 + заземление 5-4-3-2-1.**',practice:['4-7-8','Дневник','КПТ'],effect:'-Тревога',tips:'Что реально?'},
{id:'sk_resilience',cat:'emotional',title:'Устойчивость',emoji:'🛡',desc:'Восстановление',level:'Продвинутый',duration:'30 дней',theory:'**Anti-fragile.**',practice:['Рефлексия','Дневник побед','Поддержка'],effect:'+Устойчивость',tips:'Срыв — данные'},
{id:'sk_selfcompassion',cat:'emotional',title:'Самосострадание',emoji:'🤍',desc:'Доброта к себе',level:'Все',duration:'21 день',theory:'**Нефф: доброта+общность+осознанность.**',practice:['Что другу?','Рука на сердце','"Это нормально"'],effect:'-Самокритика',tips:'Ты не один'},
{id:'sk_impulse',cat:'emotional',title:'Контроль импульсов',emoji:'🎯',desc:'Не срываться',level:'Базовый',duration:'21 день',theory:'**Импульс проходит за 90 сек.**',practice:['Пауза 10 мин','Убери соблазны','Замена'],effect:'+Самоконтроль',tips:'Среда > воля'},
{id:'sk_motivation',cat:'emotional',title:'Внутренняя мотивация',emoji:'🚀',desc:'Делать без пинка',level:'Все',duration:'30 дней',theory:'**Автономия + компетентность + связанность.**',practice:['Смысл','Микрошаги','Празднуй'],effect:'+Действие',tips:'Смысл > дисциплина'},
{id:'sk_listen',cat:'social',title:'Активное слушание',emoji:'👂',desc:'Слушать по-настоящему',level:'Все',duration:'14 дней',theory:'**3 уровня: слышу, слушаю, слышу потребность.**',practice:['Парафраз','Не перебивай','Открытый вопрос'],effect:'+Связи',tips:'Слушание активно'},
{id:'sk_nvc',cat:'social',title:'ННО',emoji:'💬',desc:'Без конфликта',level:'Базовый',duration:'21 день',theory:'**Наблюдение→Чувство→Потребность→Просьба.**',practice:['Я-сообщения','Просьба','Без "ты"'],effect:'-Конфликты',tips:'Не смешивай'},
{id:'sk_boundaries',cat:'social',title:'Здоровые границы',emoji:'🚧',desc:'"Нет" без вины',level:'Все',duration:'21 день',theory:'**"Я не могу X, но могу Y".**',practice:['3 "нет"','Формула','Уведомления off'],effect:'+Уважение',tips:'Спокойно'},
{id:'sk_leadership',cat:'social',title:'Лидерство',emoji:'👑',desc:'Вести людей',level:'Продвинутый',duration:'60 дней',theory:'**Level 5: скромность + воля.**',practice:['Видение WHY','Развивай 1','Делегируй'],effect:'+Влияние',tips:'Создавай лидеров'},
{id:'sk_negotiation',cat:'social',title:'Переговоры',emoji:'🤝',desc:'Договариваться',level:'Продвинутый',duration:'21 день',theory:'**BATNA + win-win.**',practice:['BATNA','Интересы','Пауза'],effect:'+Результаты',tips:'Решение > победа'},
{id:'sk_conflict',cat:'social',title:'Разрешение конфликтов',emoji:'⚔️',desc:'Из ссоры — в решение',level:'Базовый',duration:'21 день',theory:'**Томас-Килманн: 5 стилей.**',practice:['Сотрудничество','Парафраз','Общее'],effect:'-Разрушения',tips:'Понять → понятым'},
{id:'sk_charisma',cat:'social',title:'Харизма',emoji:'✨',desc:'Притягательность',level:'Все',duration:'30 дней',theory:'**Присутствие + тепло + сила.**',practice:['Внимание','Имена','Спи прямо'],effect:'+Влияние',tips:'Тренируется'},
{id:'sk_networking',cat:'social',title:'Нетворкинг',emoji:'🕸',desc:'Полезные связи',level:'Базовый',duration:'30 дней',theory:'**Давать первым.**',practice:['5 контактов','Дай ценность','Follow-up'],effect:'+Возможности',tips:'Дай > бери'},
{id:'sk_public',cat:'social',title:'Публичные выступления',emoji:'🎤',desc:'Речь со сцены',level:'Продвинутый',duration:'30 дней',theory:'**Hook + Story + Point + CTA.**',practice:['Речь 3 мин','Видео себя','Паузы'],effect:'+Уверенность',tips:'Репетируй'},
{id:'sk_time',cat:'productivity',title:'Управление временем',emoji:'⏰',desc:'Больше успевать',level:'Все',duration:'21 день',theory:'**Time-blocking + Pomodoro + GTD.**',practice:['Time-block','3 дела','Ревью'],effect:'+Продуктивность',tips:'Вечером план'},
{id:'sk_energy',cat:'productivity',title:'Управление энергией',emoji:'🔋',desc:'Больше сил',level:'Все',duration:'21 день',theory:'**Ультрадианные 90/15.**',practice:['90 мин','Перерыв 15','Пик — сложное'],effect:'+Сил',tips:'Сон и еда'},
{id:'sk_habits',cat:'productivity',title:'Привычки',emoji:'🔄',desc:'Автоматизм',level:'Все',duration:'66 дней',theory:'**Cue→Craving→Response→Reward.**',practice:['1 привычка','Привязка','Мини-версия'],effect:'+Автоматизм',tips:'Медленно'},
{id:'sk_focus',cat:'productivity',title:'Фокус',emoji:'🎯',desc:'Не отвлекаться',level:'Все',duration:'14 дней',theory:'**23 мин на возврат.**',practice:['Один экран','Телефон вне','Авиарежим'],effect:'+40%',tips:'Убери соблазн'},
{id:'sk_procrastination',cat:'productivity',title:'Прокрастинация',emoji:'⏳',desc:'Перестать откладывать',level:'Все',duration:'14 дней',theory:'**Правило 2 минут.**',practice:['2 минуты','Куски','Помидор'],effect:'-Прокрастинация',tips:'Начало 80%'},
{id:'sk_gtd',cat:'productivity',title:'GTD',emoji:'📥',desc:'Getting Things Done',level:'Базовый',duration:'21 день',theory:'**5 шагов: Capture, Clarify, Organize, Reflect, Engage.**',practice:['Inbox','Разбирай','Ревью'],effect:'+Ясность',tips:'Голова не хранилище'},
{id:'sk_eisenhower',cat:'productivity',title:'Матрица Эйзенхауэра',emoji:'🔢',desc:'Приоритеты',level:'Все',duration:'7 дней',theory:'**Q1 делай, Q2 планируй, Q3 делегируй, Q4 удали.**',practice:['Разбери','Q2','Удали Q4'],effect:'+Эффективность',tips:'Q2 — магия'},
{id:'sk_eatfrog',cat:'productivity',title:'Eat That Frog',emoji:'🐸',desc:'Сложное первым',level:'Все',duration:'14 дней',theory:'**Съешь жабу утром.**',practice:['1 жаба','Без телефона','Раньше на час'],effect:'+Результаты',tips:'Сложное первым'},
{id:'sk_weekreview',cat:'productivity',title:'Недельный ревью',emoji:'📊',desc:'Итоги и план',level:'Все',duration:'4 недели',theory:'**Воскресенье вечер: итоги + план.**',practice:['30 мин','Победы/провалы','3 цели'],effect:'+Рост',tips:'Рефлексия'},
{id:'sk_systems',cat:'productivity',title:'Системное мышление',emoji:'🔄',desc:'Понимание систем',level:'Продвинутый',duration:'30 дней',theory:'**Системы > цели.**',practice:['Анализ 3 систем','Модели','Связи'],effect:'+Понимание',tips:'Входы'},
{id:'sk_sleep',cat:'health',title:'Гигиена сна',emoji:'😴',desc:'Глубокий сон',level:'Все',duration:'30 дней',theory:'**7-9 ч, режим, темнота, без экранов.**',practice:['Режим','Спальня','Свет утром'],effect:'+Сон',tips:'Фундамент'},
{id:'sk_nutrition',cat:'health',title:'Питание',emoji:'🥗',desc:'Основа энергии',level:'Все',duration:'30 дней',theory:'**Средиземноморская.**',practice:['500 г овощей','1.6 г белка','Оливковое'],effect:'+Энергия',tips:'Меньше обработанного'},
{id:'sk_workout',cat:'health',title:'Тренировки',emoji:'🏋️',desc:'Сила и выносливость',level:'Все',duration:'90 дней',theory:'**150 мин кардио + 2 силовые.**',practice:['2 силовые','150 мин','Прогрессия'],effect:'+Здоровье',tips:'База'},
{id:'sk_cardio',cat:'health',title:'Кардио',emoji:'🏃',desc:'Сердце',level:'Все',duration:'60 дней',theory:'**Zone 2: 180-age.**',practice:['3-4 ч/нед','Бег/вело/плавание','Постепенно'],effect:'+Сердце',tips:'Можешь говорить'},
{id:'sk_strength',cat:'health',title:'Сила',emoji:'💪',desc:'Мышцы',level:'Базовый',duration:'90 дней',theory:'**Присед, становая, жим, подтягивание.**',practice:['4 базовых','Прогрессия','Белок'],effect:'+Сила',tips:'Техника'},
{id:'sk_cold',cat:'health',title:'Холод',emoji:'❄️',desc:'Холодный душ',level:'Базовый',duration:'30 дней',theory:'**Вим Хоф.**',practice:['30 сек → 2 мин','Дыхание','Постепенно'],effect:'+Стрессоустойчивость',tips:'Дыши медленно'},
{id:'sk_breathing',cat:'health',title:'Дыхательные практики',emoji:'🌬',desc:'Управление состоянием',level:'Все',duration:'21 день',theory:'**4-7-8 для сна, box для фокуса.**',practice:['Box утром','4-7-8 вечером','Тренировка'],effect:'-Стресс',tips:'Пульт управления'},
{id:'sk_eye',cat:'health',title:'Здоровье глаз',emoji:'👁',desc:'При экране',level:'Все',duration:'21 день',theory:'**20-20-20 + пальминг.**',practice:['20-20-20','Пальминг','Гимнастика'],effect:'-Усталость',tips:'Моргай'},
{id:'sk_posture',cat:'health',title:'Осанка',emoji:'🧍',desc:'Здоровая спина',level:'Все',duration:'30 дней',theory:'**Голова над плечами.**',practice:['Проверка','Упражнения','Стоя'],effect:'-Боль',tips:'Двигайся'},
{id:'sk_circadian',cat:'health',title:'Циркадные ритмы',emoji:'🌅',desc:'Биоритмы',level:'Все',duration:'30 дней',theory:'**Утренний свет 10 мин.**',practice:['Свет утром','Тёмный вечер','Одно время'],effect:'+Сон',tips:'Свет — сигнал'},
{id:'sk_recovery',cat:'health',title:'Восстановление',emoji:'🌿',desc:'7 видов отдыха',level:'Все',duration:'21 день',theory:'**Физический, ментальный, сенсорный, творческий, эмоциональный, социальный, духовный.**',practice:['Определи','Восполни','Планируй'],effect:'-Выгорание',tips:'Часть работы'},
{id:'sk_budget',cat:'finance',title:'Бюджет',emoji:'💰',desc:'Контроль денег',level:'Все',duration:'30 дней',theory:'**50/30/20.**',practice:['Учёт','Правило','Автоматизация'],effect:'+Контроль',tips:'Каждую трату'},
{id:'sk_invest',cat:'finance',title:'Инвестиции',emoji:'📈',desc:'Деньги работают',level:'Продвинутый',duration:'90 дней',theory:'**Индексные, диверсификация, DCA.**',practice:['3 фонда','DCA','Ревью'],effect:'+Капитал',tips:'Время > тайминг'},
{id:'sk_debt',cat:'finance',title:'Освобождение от долгов',emoji:'⛓',desc:'Долговая свобода',level:'Базовый',duration:'180 дней',theory:'**Снежный ком или лавина.**',practice:['Список','Минимум','Максимум'],effect:'-Долги',tips:'Мелкий → мотивация'},
{id:'sk_fire',cat:'finance',title:'FIRE',emoji:'🔥',desc:'Финансовая независимость',level:'Продвинутый',duration:'10 лет',theory:'**25× годовых + 4% правило.**',practice:['Норма 50%','Диверсификация','25×'],effect:'Свобода',tips:'Сокращай расходы'},
{id:'sk_side',cat:'finance',title:'Доп. доход',emoji:'💼',desc:'Второй источник',level:'Базовый',duration:'90 дней',theory:'**Фриланс, контент, товары.**',practice:['Навык','Первые 1000 ₽','Система'],effect:'+Доход',tips:'Монетизируй навык'},
{id:'sk_salary',cat:'finance',title:'Переговоры о зарплате',emoji:'💰',desc:'Больше за то же',level:'Базовый',duration:'7 дней',theory:'**Рынок + ценность + пауза.**',practice:['Рынок','Победы','Цифра выше'],effect:'+20%',tips:'Не соглашайся сразу'},
{id:'sk_taxes',cat:'finance',title:'Налоги и вычеты',emoji:'📋',desc:'Оптимизация',level:'Базовый',duration:'7 дней',theory:'**ИИС, вычеты, самозанятость.**',practice:['Вычеты','ИИС','Самозанятость'],effect:'+Возврат',tips:'До 15%'},
{id:'sk_savings',cat:'finance',title:'Накопления',emoji:'🏦',desc:'Подушка',level:'Все',duration:'90 дней',theory:'**3-6 мес на отдельном счёте.**',practice:['Автоперевод','Отдельный','3 мес'],effect:'+Спокойствие',tips:'Не трогать'},
{id:'sk_assets',cat:'finance',title:'Активы vs пассивы',emoji:'⚖️',desc:'Понимание баланса',level:'Базовый',duration:'14 дней',theory:'**Кийосаки: активы приносят, пассивы забирают.**',practice:['Список','Список','Увеличь'],effect:'+Богатство',tips:'Дом — пассив'}
];

/* ============================================================
   КОНЕЦ ЧАСТИ 2/6
   Дальше: часть 3 — Богатство, Методики, Восстановление, Зрение, Детокс 62 дня, English, НОВЫЕ КУРСЫ
   ============================================================ */
console.log('[CONTENT 2/6] PSYCH='+PSYCHOLOGY_TOPICS.length+' THINK='+THINKING_TOPICS.length+' ETIQ='+ETIQUETTE_TOPICS.length+' SKILLS='+SKILLS_LIBRARY.length);
/* ============================================================
   LIFE OS — CONTENT.js v42 — ЧАСТЬ 3/6
   Богатство, Методики, Восстановление, Зрение
   ============================================================ */

/* ============ WEALTH_MODULES (20) ============ */
var WEALTH_MODULES=[
{id:'w_01',emoji:'💰',title:'Основы богатства',theory:'**Богатство = доход − расходы + инвестиции.** Три столпа.',science:'Сложный процент: 10% → ×2 за 7 лет.',practice:['Посчитай чистый капитал','50/30/20','Открой брокерский'],effect:'+Понимание',tips:'Начни считать'},
{id:'w_02',emoji:'📊',title:'Учёт финансов',theory:'Записывай каждую трату. Без учёта нет контроля.',science:'Осознанность = -20% трат.',practice:['Приложение','Записывай 30 дней','Анализ'],effect:'+Контроль',tips:'Каждую трату'},
{id:'w_03',emoji:'💵',title:'Доход',theory:'3+ источника. Основной + фриланс + пассивный.',science:'Диверсификация = стабильность.',practice:['Найди 2 идеи','Первые 1000 ₽','Система'],effect:'+Стабильность',tips:'Начни с навыка'},
{id:'w_04',emoji:'🏦',title:'Сбережения',theory:'Подушка 3-6 мес. Автоматизация.',science:'Без подушки = стресс.',practice:['Автоперевод','Отдельный счёт','Цель 3 мес'],effect:'+Спокойствие',tips:'Автоматически'},
{id:'w_05',emoji:'📈',title:'Инвестиции',theory:'Индексные фонды, DCA, долгосрочно.',science:'S&P 500 = +10% в год.',practice:['Изучи 3 фонда','DCA ежемесячно','Ревью квартал'],effect:'+Капитал',tips:'Долгосрочно'},
{id:'w_06',emoji:'🎯',title:'Цели',theory:'SMART + записывай. +42% результатов.',science:'Записанные цели.',practice:['3 цели','SMART','Дедлайн'],effect:'+Результат',tips:'Записывай'},
{id:'w_07',emoji:'💼',title:'Карьера',theory:'Икигай. T-shape. Навыки.',science:'Лучшие = пересечение.',practice:['4 сферы','Навык','Ментор'],effect:'+Карьера',tips:'Пересечение'},
{id:'w_08',emoji:'🧠',title:'Мышление богатых',theory:'Активы > пассивы. Деньги работают.',science:'Кийосаки.',practice:['Список активов','Список пассивов','Увеличь активы'],effect:'+Богатство',tips:'Активы'},
{id:'w_09',emoji:'🚀',title:'Предпринимательство',theory:'Решай проблему. Масштабируй.',science:'Стартап = рост.',practice:['Найди проблему','MVP','Первые клиенты'],effect:'+Доход',tips:'Начни мало'},
{id:'w_10',emoji:'💎',title:'Успех',theory:'Дисциплина + системы + люди.',science:'Успех = 80% психология.',practice:['Система','Привычки','Окружение'],effect:'+Успех',tips:'Система'},
{id:'w_11',emoji:'😊',title:'Счастье',theory:'Селигман: PERMA.',science:'+25% через благодарность.',practice:['3 благодарности','1 радость','Смысл'],effect:'+Счастье',tips:'Тренируется'},
{id:'w_12',emoji:'🕊',title:'Смысл',theory:'Икигай + логотерапия.',science:'Смысл = долголетие.',practice:['4 списка','Найди "зачем"','Наследие'],effect:'+Смысл',tips:'Ищи'},
{id:'w_13',emoji:'🧘',title:'Спокойствие',theory:'Стоицизм + медитация.',science:'Медитация = +спокойствие.',practice:['10 мин','Вечером рефлексия','Memento mori'],effect:'+Спокойствие',tips:'Управляй реакцией'},
{id:'w_14',emoji:'💪',title:'Здоровье',theory:'Сон + спорт + питание = база всего.',science:'Здоровье = 50% счастья.',practice:['7-9 ч сна','150 мин спорта','500 г овощей'],effect:'+Здоровье',tips:'База'},
{id:'w_15',emoji:'❤️',title:'Отношения',theory:'5 глубоких > 100.',science:'Отношения = +счастье.',practice:['5 человек','Регулярно','Глубина'],effect:'+Счастье',tips:'Глубина'},
{id:'w_16',emoji:'🌱',title:'Рост',theory:'Growth mindset. Постоянное обучение.',science:'Дуэк.',practice:['1 книга/мес','1 курс/квартал','Ментор'],effect:'+Рост',tips:'Учись'},
{id:'w_17',emoji:'🎨',title:'Творчество',theory:'DMN + поток. Создавай.',science:'Творчество = счастье.',practice:['1 проект','30 мин/день','Показывай'],effect:'+Радость',tips:'Создавай'},
{id:'w_18',emoji:'🌍',title:'Влияние',theory:'Помогай другим. Оставь след.',science:'Помощь = +счастье.',practice:['Волонтёрство','Менторство','Пожертвование'],effect:'+Смысл',tips:'Помогай'},
{id:'w_19',emoji:'⚡',title:'Энергия',theory:'Сон + еда + спорт + стресс.',science:'Энергия = топливо.',practice:['8 ч сна','Ультрадианные','Перерывы'],effect:'+Энергия',tips:'Береги'},
{id:'w_20',emoji:'🎯',title:'Фокус',theory:'Deep Work. Одна задача.',science:'23 мин потерь.',practice:['90 мин блок','Авиарежим','Метрики'],effect:'+Продуктивность',tips:'Одна задача'}
];

/* ============ METHODS_LIBRARY (45) ============ */
var METHODS_LIBRARY=[
{id:'m_pomodoro',emoji:'🍅',title:'Pomodoro',category:'Продуктивность',desc:'25/5 циклы.',steps:['Выбери задачу','Таймер 25','Работай','Перерыв 5','Повтори 4×','Перерыв 30'],base:'Чирилло'},
{id:'m_deepwork',emoji:'🎯',title:'Deep Work',category:'Продуктивность',desc:'Глубокая работа 90 мин.',steps:['Телефон вне','Одна задача','Таймер 90','Перерыв 15'],base:'Ньюпорт'},
{id:'m_gtd',emoji:'📥',title:'GTD',category:'Продуктивность',desc:'Getting Things Done.',steps:['Capture','Clarify','Organize','Reflect','Engage'],base:'Аллен'},
{id:'m_eisenhower',emoji:'🔢',title:'Матрица Эйзенхауэра',category:'Продуктивность',desc:'4 квадранта.',steps:['Q1 делай','Q2 планируй','Q3 делегируй','Q4 удали'],base:'Эйзенхауэр'},
{id:'m_eatfrog',emoji:'🐸',title:'Eat That Frog',category:'Продуктивность',desc:'Сложное первым.',steps:['Определи','Съешь утром','Без телефона'],base:'Трейси'},
{id:'m_timeblock',emoji:'📅',title:'Time-blocking',category:'Продуктивность',desc:'Каждое дело в слот.',steps:['Список','Оцени','Слоты','Буферы'],base:'Ньюпорт'},
{id:'m_2min',emoji:'⏱',title:'Правило 2 минут',category:'Продуктивность',desc:'Меньше 2 мин — сразу.',steps:['<2 мин?','Делай','Не откладывай'],base:'Аллен'},
{id:'m_feynman',emoji:'👨‍🏫',title:'Метод Фейнмана',category:'Учёба',desc:'Объясни ребёнку.',steps:['Тема','Объясни 12-летнему','Пробелы','Упрости'],base:'Фейнман'},
{id:'m_anki',emoji:'🃏',title:'Anki',category:'Учёба',desc:'Интервальное повторение.',steps:['Карточка','Оцени 1-4','Алгоритм','20 мин/день'],base:'SRS'},
{id:'m_cornell',emoji:'📝',title:'Cornell',category:'Учёба',desc:'Конспект с колонками.',steps:['Раздели','Конспект','Вопросы','Резюме'],base:'Паук'},
{id:'m_mindmap',emoji:'🗺',title:'Mind Map',category:'Учёба',desc:'Визуальные карты.',steps:['Центр','Ветви','Подветви','Цвета'],base:'Бьюзен'},
{id:'m_sq3r',emoji:'📖',title:'SQ3R',category:'Учёба',desc:'Чтение с пониманием.',steps:['Survey','Question','Read','Recite','Review'],base:'Робинсон'},
{id:'m_memorypalace',emoji:'🏛',title:'Дворец памяти',category:'Ментальное',desc:'Метод локусов.',steps:['Место','10 точек','Образы','Пройди'],base:'Цицерон'},
{id:'m_nback',emoji:'🎯',title:'N-back',category:'Ментальное',desc:'Рабочая память.',steps:['Стимулы','N назад','Ответь','Уровень'],base:'Киршнер'},
{id:'m_box',emoji:'🌬',title:'Box breathing',category:'Эмоциональное',desc:'4-4-4-4.',steps:['Вдох 4','Задержка 4','Выдох 4','Задержка 4'],base:'Navy SEAL'},
{id:'m_478',emoji:'🌙',title:'Дыхание 4-7-8',category:'Эмоциональное',desc:'Для сна.',steps:['Вдох 4','Задержка 7','Выдох 8','Повтори 4'],base:'Вейл'},
{id:'m_wimhof',emoji:'❄️',title:'Wim Hof',category:'Здоровье',desc:'Дыхание + холод.',steps:['30 вдохов','Задержка','Выдох','Холодный душ'],base:'Хоф'},
{id:'m_meditation',emoji:'🧘',title:'Медитация',category:'Духовное',desc:'10-20 мин/день.',steps:['Сядь','Дыхание','Наблюдай','Возвращай'],base:'MBSR'},
{id:'m_bodyscan',emoji:'👁',title:'Body scan',category:'Духовное',desc:'Сканирование тела.',steps:['Ляг','Стопы','Вверх','Расслабь'],base:'Кабат-Зинн'},
{id:'m_gratitude',emoji:'🙏',title:'Благодарность',category:'Духовное',desc:'3 пункта/день.',steps:['Утром','Вечером','Дневник','Скажи'],base:'Эммонс'},
{id:'m_journal',emoji:'📓',title:'Дневник',category:'Эмоциональное',desc:'Утренние страницы.',steps:['3 стр.','Без правок','Каждый день'],base:'Кэмерон'},
{id:'m_ikigai',emoji:'🌺',title:'Икигай',category:'Философия',desc:'Японский смысл.',steps:['Люблю','Умею','Платят','Нужно'],base:'Япония'},
{id:'m_habitloop',emoji:'🔄',title:'Петля привычки',category:'Продуктивность',desc:'Cue-craving-response-reward.',steps:['Cue','Craving','Response','Reward'],base:'Дахигг'},
{id:'m_habitstack',emoji:'📚',title:'Habit stacking',category:'Продуктивность',desc:'Привязка к старой.',steps:['Старая','Новая','После X — Y'],base:'Клир'},
{id:'m_8020',emoji:'📊',title:'Принцип 80/20',category:'Продуктивность',desc:'20% дают 80%.',steps:['Найди 20%','Фокус','Убери 80%'],base:'Парето'},
{id:'m_flow',emoji:'🌊',title:'Поток',category:'Эмоциональное',desc:'Полное погружение.',steps:['Сложность=навык','Цель','Фидбэк','Фокус'],base:'Чиксентмихайи'},
{id:'m_memento',emoji:'💀',title:'Memento Mori',category:'Философия',desc:'Помни о смерти.',steps:['Эпитафия','Meditatio','Приоритеты'],base:'Стоики'},
{id:'m_2020',emoji:'👁',title:'20-20-20',category:'Здоровье',desc:'Для глаз.',steps:['Каждые 20 мин','20 сек','6 м'],base:'Офтальмология'},
{id:'m_cold',emoji:'❄️',title:'Холодный душ',category:'Здоровье',desc:'2 мин.',steps:['Тёплый','Холодный 30 сек','2 мин'],base:'Хоф'},
{id:'m_sbi',emoji:'💬',title:'SBI-фидбэк',category:'Коммуникация',desc:'Situation-Behavior-Impact.',steps:['Situation','Behavior','Impact'],base:'Ccl'},
{id:'m_nvc',emoji:'🤝',title:'ННО',category:'Коммуникация',desc:'Наблюдение→Чувство→Потребность→Просьба.',steps:['Наблюдение','Чувство','Потребность','Просьба'],base:'Розенберг'},
{id:'m_grow',emoji:'🎯',title:'GROW',category:'Коучинг',desc:'Goal-Reality-Options-Will.',steps:['Goal','Reality','Options','Will'],base:'Уитмор'},
{id:'m_smart',emoji:'📊',title:'SMART',category:'Коучинг',desc:'Specific-Measurable-Achievable-Relevant-Time.',steps:['Specific','Measurable','Achievable','Relevant','Time'],base:'Доран'},
{id:'m_okr',emoji:'🎯',title:'OKR',category:'Коучинг',desc:'Objectives + Key Results.',steps:['Objectives','Key Results','Измеряй','Ревью'],base:'Гроув'},
{id:'m_kaizen',emoji:'🌱',title:'Кайдзен',category:'Коучинг',desc:'Непрерывное улучшение.',steps:['1% в день','Регулярно','Улучшай','Стандартизируй'],base:'Япония'},
{id:'m_5s',emoji:'🧹',title:'5S',category:'Коучинг',desc:'Сортировка, порядок, чистота.',steps:['Seiri','Seiton','Seiso','Seiketsu','Shitsuke'],base:'Япония'},
{id:'m_pdca',emoji:'🔄',title:'PDCA',category:'Коучинг',desc:'Plan-Do-Check-Act.',steps:['Plan','Do','Check','Act'],base:'Деминг'},
{id:'m_ooda',emoji:'⚡',title:'OODA',category:'Стратегия',desc:'Observe-Orient-Decide-Act.',steps:['Observe','Orient','Decide','Act'],base:'Бойд'},
{id:'m_firstprinciples',emoji:'🔬',title:'First Principles',category:'Стратегия',desc:'Разбей до основы.',steps:['Разбей','Пойми','Собери'],base:'Аристотель'},
{id:'m_inversion',emoji:'⚖️',title:'Инверсия',category:'Стратегия',desc:'Что мешает?',steps:['Что мешает','Избегай','Наоборот'],base:'Якоби'},
{id:'m_secondorder',emoji:'🌐',title:'Второй порядок',category:'Стратегия',desc:'А что потом?',steps:['1 порядок','2 порядок','3 порядок'],base:'Маркс'},
{id:'m_antifragile',emoji:'🌊',title:'Антихрупкость',category:'Стратегия',desc:'Растут в стрессе.',steps:['Стресс','Восстановление','Рост'],base:'Талеб'},
{id:'m_batna',emoji:'🤝',title:'BATNA',category:'Переговоры',desc:'Лучшая альтернатива.',steps:['Определи','Сравни','Используй'],base:'Фишер'},
{id:'m_winwin',emoji:'🎯',title:'Win-win',category:'Переговоры',desc:'Обоюдная выгода.',steps:['Интересы','Варианты','Общее'],base:'Кови'},
{id:'m_ikigai2',emoji:'🌺',title:'Икигай',category:'Философия',desc:'Японский смысл жизни.',steps:['Что люблю','Что умею','За что платят','Что нужно миру'],base:'Япония'}
];

/* ============ RECOVERY_LIBRARY (200) ============ */
var RECOVERY_LIBRARY=[
{id:'r_sleep',cat:'💪 Физическое',emoji:'😴',title:'Полноценный сон',desc:'7-9 часов качественного сна.',how:'Режим, темнота, 18-20°C, без экрана за 2 ч.',time:'7-9 ч',effect:'Восстановление всех систем',science:'90-мин циклы, консолидация памяти, гормон роста.',times:'Каждую ночь'},
{id:'r_nap',cat:'💪 Физическое',emoji:'💤',title:'Дневной сон 20 мин',desc:'Короткий восстанавливающий.',how:'До 15:00, 20 мин, будильник.',time:'20 мин',effect:'+Энергия, +Фокус',science:'NASA: +54%.',times:'1 раз в день'},
{id:'r_walk',cat:'💪 Физическое',emoji:'🚶',title:'Прогулка 30 мин',desc:'Спокойная.',how:'Без телефона.',time:'30 мин',effect:'+Настроение, +Креатив',science:'+60% креатив, -16% кортизол.',times:'1-2 раза в день'},
{id:'r_yoga',cat:'💪 Физическое',emoji:'🧘',title:'Йога 30 мин',desc:'Хатха или виньяса.',how:'Комплекс.',time:'30 мин',effect:'+Гибкость, +Спокойствие',science:'Снижает кортизол.',times:'3-4×/нед'},
{id:'r_swim',cat:'💪 Физическое',emoji:'🏊',title:'Плавание 30 мин',desc:'В бассейне.',how:'Разные стили.',time:'30 мин',effect:'+Все группы мышц',science:'Без нагрузки на суставы.',times:'2-3×/нед'},
{id:'r_bike',cat:'💪 Физическое',emoji:'🚴',title:'Велосипед 60 мин',desc:'Прогулка.',how:'Спокойный темп.',time:'60 мин',effect:'+Кардио',science:'Zone 2.',times:'2-3×/нед'},
{id:'r_run',cat:'💪 Физическое',emoji:'🏃',title:'Бег 30 мин',desc:'Спокойный.',how:'Zone 2.',time:'30 мин',effect:'+Кардио, +Эндорфины',science:'Эндорфины.',times:'3-4×/нед'},
{id:'r_meditation',cat:'💪 Физическое',emoji:'🧘',title:'Медитация 20 мин',desc:'Сидячая.',how:'Спина прямая.',time:'20 мин',effect:'+Спокойствие',science:'Толщина коры.',times:'1 раз в день'},
{id:'r_massage',cat:'💪 Физическое',emoji:'💆',title:'Массаж 60 мин',desc:'Общий.',how:'Профессиональный.',time:'60 мин',effect:'+Расслабление',science:'Снижает кортизол.',times:'2×/мес'},
{id:'r_sauna',cat:'💪 Физическое',emoji:'🔥',title:'Сауна 20 мин',desc:'Финская.',how:'80-100°C.',time:'20 мин',effect:'+Кровоток',science:'Кардио-эффект, долголетие.',times:'2-4×/нед'},
{id:'r_cold',cat:'💪 Физическое',emoji:'🧊',title:'Холодный душ 2 мин',desc:'Холодная вода.',how:'Постепенно.',time:'2 мин',effect:'+Бодрость',science:'Сосуды, норадреналин.',times:'1 раз в день'},
{id:'r_contrast',cat:'💪 Физическое',emoji:'💦',title:'Контрастный душ',desc:'Горячий/холодный.',how:'30 сек ×5.',time:'5 мин',effect:'+Кровоток',science:'Тренировка сосудов.',times:'1 раз в день'},
{id:'r_478',cat:'💪 Физическое',emoji:'🌬',title:'Дыхание 4-7-8',desc:'Расслабление.',how:'4-7-8 ×4.',time:'5 мин',effect:'-Тревога',science:'Парасимпатика.',times:'2 раза в день'},
{id:'r_box',cat:'💪 Физическое',emoji:'📦',title:'Box breathing',desc:'4-4-4-4.',how:'4-4-4-4.',time:'5 мин',effect:'+Фокус',science:'Navy SEAL.',times:'2 раза в день'},
{id:'r_wimhof',cat:'💪 Физическое',emoji:'🌬',title:'Wim Hof',desc:'Дыхание + холод.',how:'30 вдохов.',time:'15 мин',effect:'+Энергия',science:'Адреналин.',times:'1 раз в день'},
{id:'r_stretch',cat:'💪 Физическое',emoji:'🤸',title:'Растяжка 15 мин',desc:'Мобильность.',how:'10-15 упражнений.',time:'15 мин',effect:'+Гибкость',science:'Профилактика травм.',times:'1-2 раза в день'},
{id:'r_foam',cat:'💪 Физическое',emoji:'🦵',title:'Foam roller',desc:'Миофасциальный релиз.',how:'Катить по мышцам.',time:'10 мин',effect:'+Расслабление',science:'Снимает напряжение.',times:'1 раз в день'},
{id:'r_foot',cat:'💪 Физическое',emoji:'🧴',title:'Массаж стоп',desc:'5 мин.',how:'Мячик или руками.',time:'5 мин',effect:'+Расслабление',science:'Рефлекторные точки.',times:'1 раз вечером'},
{id:'r_bath',cat:'💪 Физическое',emoji:'🛁',title:'Тёплая ванна 20 мин',desc:'С солью.',how:'37-39°C.',time:'20 мин',effect:'+Расслабление',science:'Магний через кожу.',times:'1-2×/нед'},
{id:'r_scrub',cat:'💪 Физическое',emoji:'🧖',title:'Скраб тела',desc:'Отшелушивание.',how:'Кофе/соль.',time:'10 мин',effect:'+Кровоток',science:'Обновление кожи.',times:'1×/нед'},
{id:'r_water',cat:'💪 Физическое',emoji:'💧',title:'8 стаканов воды',desc:'Гидратация.',how:'Утром 500 мл.',time:'Весь день',effect:'+Энергия',science:'Обезвоживание 2%.',times:'Каждый день'},
{id:'r_veggies',cat:'💪 Физическое',emoji:'🥗',title:'Овощи 500 г',desc:'Свежие.',how:'Разноцветные.',time:'Весь день',effect:'+Витамины',science:'Антиоксиданты.',times:'Каждый день'},
{id:'r_omega',cat:'💪 Физическое',emoji:'🍎',title:'Омега-3',desc:'Рыба или добавки.',how:'2 порции рыбы/нед.',time:'—',effect:'+Мозг',science:'DHA/EPA.',times:'Каждый день'},
{id:'r_greentea',cat:'💪 Физическое',emoji:'☕',title:'Зелёный чай',desc:'Антиоксиданты.',how:'2-3 чашки.',time:'—',effect:'+Фокус',science:'Катехины.',times:'2-3 раза в день'},
{id:'r_darkchoc',cat:'💪 Физическое',emoji:'🍫',title:'Тёмный шоколад 70%',desc:'20 г.',how:'1-2 квадратика.',time:'—',effect:'+Настроение',science:'Магний, флавоноиды.',times:'1 раз в день'},
{id:'r_herbal',cat:'💪 Физическое',emoji:'🍵',title:'Травяной чай',desc:'Ромашка/мята.',how:'Вечером.',time:'—',effect:'+Расслабление',science:'Успокаивает.',times:'1 раз вечером'},
{id:'r_nuts',cat:'💪 Физическое',emoji:'🌰',title:'Орехи 30 г',desc:'Миндаль.',how:'Горсть.',time:'—',effect:'+Здоровье',science:'Омега-3, магний.',times:'Каждый день'},
{id:'r_avocado',cat:'💪 Физическое',emoji:'🥑',title:'Авокадо',desc:'Полезные жиры.',how:'1/2 авокадо.',time:'—',effect:'+Сытость',science:'Калий.',times:'1 раз в день'},
{id:'r_berries',cat:'💪 Физическое',emoji:'🍇',title:'Ягоды 100 г',desc:'Черника.',how:'Свежие.',time:'—',effect:'+Антиоксиданты',science:'Флавоноиды.',times:'Каждый день'},
{id:'r_fish',cat:'💪 Физическое',emoji:'🐟',title:'Рыба 2×/нед',desc:'Лосось.',how:'2 порции.',time:'—',effect:'+Мозг',science:'Омега-3.',times:'2×/нед'},
{id:'r_protein',cat:'💪 Физическое',emoji:'🍳',title:'Белок 1.6 г/кг',desc:'Для мышц.',how:'В каждый приём.',time:'—',effect:'+Восстановление',science:'Аминокислоты.',times:'Каждый день'},
{id:'r_sun',cat:'💪 Физическое',emoji:'🌅',title:'Утренний свет 20 мин',desc:'Солнце утром.',how:'Выйти.',time:'20 мин',effect:'+Циркадные',science:'Мелатонин вечером.',times:'1 раз утром'},
{id:'r_warmlight',cat:'💪 Физическое',emoji:'🌙',title:'Тёплый свет вечером',desc:'После 19:00.',how:'2700K.',time:'—',effect:'+Сон',science:'Не подавляет мелатонин.',times:'Каждый вечер'},
{id:'r_darkroom',cat:'💪 Физическое',emoji:'🌑',title:'Тёмная спальня',desc:'Полная темнота.',how:'Плотные шторы.',time:'—',effect:'+Сон',science:'Мелатонин.',times:'Каждую ночь'},
{id:'r_coolroom',cat:'💪 Физическое',emoji:'🌡',title:'Прохладная спальня',desc:'18-20°C.',how:'Проветривай.',time:'—',effect:'+Сон',science:'Терморегуляция.',times:'Каждую ночь'},
{id:'r_quietsleep',cat:'💪 Физическое',emoji:'🔇',title:'Тихая спальня',desc:'Тишина.',how:'Беруши.',time:'—',effect:'+Сон',science:'Снижение возбуждения.',times:'Каждую ночь'},
{id:'r_bed',cat:'💪 Физическое',emoji:'🛏',title:'Удобная кровать',desc:'Качественный матрас.',how:'Средней жёсткости.',time:'—',effect:'+Сон',science:'Правильное положение.',times:'Каждую ночь'},
{id:'r_nophone',cat:'💪 Физическое',emoji:'📵',title:'Без телефона в спальне',desc:'Никаких экранов.',how:'Зарядка в комнате.',time:'—',effect:'+Сон',science:'Синий свет.',times:'Каждую ночь'},
{id:'r_regular',cat:'💪 Физическое',emoji:'⏰',title:'Одно время сна',desc:'Циркадный ритм.',how:'Ложиться в одно время.',time:'—',effect:'+Качество сна',science:'Регулярность.',times:'Каждую ночь'},
{id:'r_earlydinner',cat:'💪 Физическое',emoji:'🍽',title:'Ранний ужин',desc:'За 3 часа до сна.',how:'Лёгкий.',time:'—',effect:'+Сон',science:'Пищеварение.',times:'Каждый вечер'},
{id:'r_meditation2',cat:'🧠 Ментальное',emoji:'🧘',title:'Медитация 10 мин',desc:'Осознанность.',how:'Сидя.',time:'10 мин',effect:'+Спокойствие',science:'MBSR.',times:'1 раз в день'},
{id:'r_journal',cat:'🧠 Ментальное',emoji:'📓',title:'Дневник 15 мин',desc:'Утренние страницы.',how:'Пиши всё.',time:'15 мин',effect:'+Ясность',science:'Структурирует.',times:'1 раз утром'},
{id:'r_gratitude',cat:'🧠 Ментальное',emoji:'🙏',title:'3 благодарности',desc:'Утром и вечером.',how:'Запиши 3.',time:'5 мин',effect:'+Счастье',science:'Emmons: +25%.',times:'2 раза в день'},
{id:'r_reading',cat:'🧠 Ментальное',emoji:'📖',title:'Чтение 30 мин',desc:'Художка.',how:'Бумажная.',time:'30 мин',effect:'+Словарный запас',science:'Эмпатия.',times:'1 раз в день'},
{id:'r_creative',cat:'🧠 Ментальное',emoji:'🎨',title:'Творчество 30 мин',desc:'Хобби руками.',how:'Рисование.',time:'30 мин',effect:'+Радость',science:'Поток.',times:'1 раз в день'},
{id:'r_music',cat:'🧠 Ментальное',emoji:'🎵',title:'Музыка 30 мин',desc:'Активное слушание.',how:'Без дел.',time:'30 мин',effect:'+Настроение',science:'Дофамин.',times:'1 раз в день'},
{id:'r_reflection',cat:'🧠 Ментальное',emoji:'🤔',title:'Рефлексия',desc:'Разбор дня.',how:'Что удалось.',time:'10 мин',effect:'+Рост',science:'Топ-навык.',times:'1 раз вечером'},
{id:'r_planning',cat:'🧠 Ментальное',emoji:'🎯',title:'Планирование',desc:'План на завтра.',how:'3 главных.',time:'10 мин',effect:'+Фокус',science:'План = ясность.',times:'1 раз вечером'},
{id:'r_braindump',cat:'🧠 Ментальное',emoji:'💭',title:'Мысли на бумагу',desc:'Выгрузи голову.',how:'Всё что беспокоит.',time:'10 мин',effect:'+Облегчение',science:'Снижает тревогу.',times:'По необходимости'},
{id:'r_puzzles',cat:'🧠 Ментальное',emoji:'🧩',title:'Головоломки 15 мин',desc:'Судоку.',how:'Тренировка.',time:'15 мин',effect:'+Память',science:'Нейропластичность.',times:'1 раз в день'},
{id:'r_learning',cat:'🧠 Ментальное',emoji:'📚',title:'Обучение 30 мин',desc:'Новый навык.',how:'Языки.',time:'30 мин',effect:'+Развитие',science:'Нейропластичность.',times:'1 раз в день'},
{id:'r_course',cat:'🧠 Ментальное',emoji:'🎓',title:'Курс 1 ч',desc:'Онлайн-курс.',how:'Структурированное.',time:'60 мин',effect:'+Знания',science:'Систематизация.',times:'1-2×/нед'},
{id:'r_nature',cat:'🧠 Ментальное',emoji:'🌿',title:'Природа 1 ч',desc:'Прогулка.',how:'Лес.',time:'60 мин',effect:'-Кортизол',science:'-16% кортизола.',times:'1×/нед'},
{id:'r_theater',cat:'🧠 Ментальное',emoji:'🎭',title:'Театр/кино',desc:'Культурный.',how:'Спектакль.',time:'2-3 ч',effect:'+Эмоции',science:'Эмпатия.',times:'1×/нед'},
{id:'r_museum',cat:'🧠 Ментальное',emoji:'🖼',title:'Музей',desc:'Искусство.',how:'Смотреть.',time:'1-2 ч',effect:'+Вдохновение',science:'Эстетика.',times:'1×/мес'},
{id:'r_coffee',cat:'🧠 Ментальное',emoji:'☕',title:'Кофе в тишине',desc:'Медленный ритуал.',how:'Без телефона.',time:'15 мин',effect:'+Спокойствие',science:'Осознанность.',times:'1 раз в день'},
{id:'r_shower',cat:'🧠 Ментальное',emoji:'🛀',title:'Долгий душ',desc:'Ритуал.',how:'Тёплый.',time:'15 мин',effect:'+Расслабление',science:'Тепло = расслабление.',times:'1 раз вечером'},
{id:'r_tea',cat:'🧠 Ментальное',emoji:'🍵',title:'Чайная церемония',desc:'Медитация.',how:'Медленно.',time:'20 мин',effect:'+Спокойствие',science:'Осознанность.',times:'1-2×/нед'},
{id:'r_bodyscan',cat:'🧠 Ментальное',emoji:'🧘',title:'Body scan',desc:'Сканирование.',how:'Лёжа.',time:'20 мин',effect:'+Расслабление',science:'Снимает напряжение.',times:'1 раз вечером'},
{id:'r_visual',cat:'🧠 Ментальное',emoji:'🌊',title:'Визуализация',desc:'Море, лес.',how:'Закрой глаза.',time:'10 мин',effect:'+Спокойствие',science:'Снижает кортизол.',times:'1 раз в день'},
{id:'r_podcast',cat:'🧠 Ментальное',emoji:'🎧',title:'Подкаст 30 мин',desc:'Обучение.',how:'Прогулка + подкаст.',time:'30 мин',effect:'+Знания',science:'Двойная польза.',times:'1 раз в день'},
{id:'r_series',cat:'🧠 Ментальное',emoji:'📺',title:'Лёгкий сериал',desc:'Разгрузка.',how:'1 эпизод.',time:'30 мин',effect:'+Отдых',science:'Переключение.',times:'1 раз вечером'},
{id:'r_game',cat:'🧠 Ментальное',emoji:'🎮',title:'Игра 30 мин',desc:'Осознанная.',how:'Таймер.',time:'30 мин',effect:'+Радость',science:'Дофамин.',times:'1 раз в день'},
{id:'r_call',cat:'🧠 Ментальное',emoji:'💬',title:'Разговор с другом',desc:'15+ мин.',how:'Позвони.',time:'15-60 мин',effect:'+Поддержка',science:'Окситоцин.',times:'1-2×/нед'},
{id:'r_hug',cat:'🧠 Ментальное',emoji:'🤗',title:'Объятия 20 сек',desc:'Долгие.',how:'8 раз в день.',time:'20 сек',effect:'+Окситоцин',science:'Снижает кортизол.',times:'8 раз в день'},
{id:'r_pet',cat:'🧠 Ментальное',emoji:'🐕',title:'Время с питомцем',desc:'30 мин.',how:'Играй.',time:'30 мин',effect:'+Радость',science:'Окситоцин.',times:'1 раз в день'},
{id:'r_help',cat:'🧠 Ментальное',emoji:'🎁',title:'Помощь другому',desc:'Бескорыстно.',how:'Помоги.',time:'—',effect:'+Счастье',science:'Волонтёры +25%.',times:'1×/нед'},
{id:'r_art',cat:'🧠 Ментальное',emoji:'🎨',title:'Арт-терапия',desc:'Рисование.',how:'Просто рисуй.',time:'30 мин',effect:'+Эмоции',science:'Выражение чувств.',times:'1-2×/нед'},
{id:'r_emotions',cat:'🧠 Ментальное',emoji:'🎭',title:'Дневник эмоций',desc:'Разбор.',how:'Запиши эмоции.',time:'10 мин',effect:'+Осознанность',science:'Помогает управлять.',times:'1 раз вечером'},
{id:'r_metta',cat:'🧠 Ментальное',emoji:'🧘',title:'Медитация метта',desc:'Доброта.',how:'Пожелай счастья.',time:'10 мин',effect:'+Самосострадание',science:'Снижает самокритику.',times:'1 раз в день'},
{id:'r_silence',cat:'👁 Сенсорное',emoji:'🤫',title:'Тишина 1 ч',desc:'Отдых от шума.',how:'Без музыки.',time:'60 мин',effect:'+Восстановление',science:'Снижает возбуждение.',times:'1 раз в день'},
{id:'r_darkness',cat:'👁 Сенсорное',emoji:'🌑',title:'Темнота 20 мин',desc:'Полная темнота.',how:'Завяжи глаза.',time:'20 мин',effect:'+Отдых глаз',science:'Восстановление родопсина.',times:'1 раз в день'},
{id:'r_detox',cat:'👁 Сенсорное',emoji:'🚫',title:'Цифровой детокс',desc:'1 ч без телефона.',how:'Убери.',time:'60 мин',effect:'+Дофамин',science:'Чувствительность.',times:'1 раз в день'},
{id:'r_aroma',cat:'👁 Сенсорное',emoji:'🌿',title:'Ароматерапия',desc:'Эфирные масла.',how:'Лаванда.',time:'15 мин',effect:'+Расслабление',science:'Лимбическая.',times:'1-2×/день'},
{id:'r_candles',cat:'👁 Сенсорное',emoji:'🕯',title:'Свечи',desc:'Живой огонь.',how:'Вечером.',time:'30 мин',effect:'+Спокойствие',science:'Успокаивает.',times:'1 раз вечером'},
{id:'r_sound',cat:'👁 Сенсорное',emoji:'🎵',title:'Один инструмент',desc:'Только один.',how:'Пианино.',time:'20 мин',effect:'+Медитация',science:'Фокус.',times:'1 раз в день'},
{id:'r_whitenoise',cat:'👁 Сенсорное',emoji:'🌊',title:'Белый шум',desc:'Шум моря.',how:'Приложение.',time:'30 мин',effect:'+Сон',science:'Маскирует.',times:'Перед сном'},
{id:'r_bedding',cat:'👁 Сенсорное',emoji:'🛏',title:'Мягкая постель',desc:'Качественное бельё.',how:'Хлопок.',time:'—',effect:'+Сон',science:'Комфорт.',times:'Каждую ночь'},
{id:'r_humid',cat:'👁 Сенсорное',emoji:'💧',title:'Увлажнитель',desc:'40-60%.',how:'В спальне.',time:'—',effect:'+Дыхание',science:'Слизистые.',times:'Постоянно'},
{id:'r_temp',cat:'👁 Сенсорное',emoji:'🌡',title:'Комфортная температура',desc:'20-22°C.',how:'Кондиционер.',time:'—',effect:'+Работа',science:'Оптимум.',times:'Постоянно'},
{id:'r_plants',cat:'👁 Сенсорное',emoji:'🌱',title:'Растения',desc:'Живые в доме.',how:'5-10 растений.',time:'—',effect:'+Воздух',science:'Очищают.',times:'Постоянно'},
{id:'r_colortherapy',cat:'👁 Сенсорное',emoji:'🎨',title:'Цветотерапия',desc:'Смотреть на цвета.',how:'Насыщенные.',time:'5 мин',effect:'+Настроение',science:'Длины волн.',times:'1 раз в день'},
{id:'r_air',cat:'👁 Сенсорное',emoji:'🍃',title:'Свежий воздух',desc:'Проветривание.',how:'5-10 мин.',time:'10 мин',effect:'+Кислород',science:'CO2 вниз.',times:'3 раза в день'},
{id:'r_sunglasses',cat:'👁 Сенсорное',emoji:'🕶',title:'Тёмные очки',desc:'Защита глаз.',how:'На солнце.',time:'—',effect:'+Глаза',science:'UV-защита.',times:'На улице'},
{id:'r_earplugs',cat:'👁 Сенсорное',emoji:'🎧',title:'Беруши',desc:'Защита слуха.',how:'В шуме.',time:'—',effect:'+Слух',science:'Защита.',times:'По необходимости'},
{id:'r_footmassage',cat:'👁 Сенсорное',emoji:'🧴',title:'Массаж стоп',desc:'Стимуляция.',how:'5 мин.',time:'5 мин',effect:'+Расслабление',science:'Рефлекс.',times:'Каждый вечер'},
{id:'r_soundmed',cat:'👁 Сенсорное',emoji:'🧘',title:'Медитация на звук',desc:'Слушай.',how:'Слушай звуки.',time:'10 мин',effect:'+Осознанность',science:'Медитация.',times:'1 раз в день'},
{id:'r_quietmeal',cat:'👁 Сенсорное',emoji:'🍽',title:'Еда в тишине',desc:'Без экрана.',how:'1 приём.',time:'20 мин',effect:'+Пищеварение',science:'Осознанное.',times:'1 раз в день'},
{id:'r_palming',cat:'👁 Сенсорное',emoji:'👁',title:'Пальминг',desc:'Отдых глаз.',how:'5 мин.',time:'5 мин',effect:'+Глаза',science:'Бейтс.',times:'2 раза в день'},
{id:'r_compress',cat:'👁 Сенсорное',emoji:'💧',title:'Компресс для глаз',desc:'Тёплый/холодный.',how:'5 мин.',time:'5 мин',effect:'+Расслабление',science:'Сосуды.',times:'1 раз вечером'},
{id:'r_drawing',cat:'🎨 Творческое',emoji:'🎨',title:'Рисование',desc:'Скетч.',how:'30 мин/день.',time:'30 мин',effect:'+Креатив',science:'Правое полушарие.',times:'1 раз в день'},
{id:'r_instrument',cat:'🎨 Творческое',emoji:'🎵',title:'Инструмент',desc:'Гитара.',how:'20 мин/день.',time:'20 мин',effect:'+Мозг',science:'Моторная память.',times:'1 раз в день'},
{id:'r_writing',cat:'🎨 Творческое',emoji:'📝',title:'Писательство',desc:'500 слов.',how:'Утренние.',time:'30 мин',effect:'+Ясность',science:'Пишущие думают чётче.',times:'1 раз в день'},
{id:'r_photo',cat:'🎨 Творческое',emoji:'📷',title:'Фотография',desc:'С камерой.',how:'Ищи кадры.',time:'30 мин',effect:'+Наблюдательность',science:'Внимание.',times:'1×/нед'},
{id:'r_handmade',cat:'🎨 Творческое',emoji:'🧶',title:'Рукоделие',desc:'Вязание.',how:'30 мин/день.',time:'30 мин',effect:'+Расслабление',science:'Мелкая моторика.',times:'1 раз в день'},
{id:'r_cooking',cat:'🎨 Творческое',emoji:'🍳',title:'Готовка',desc:'Новый рецепт.',how:'1 раз/нед.',time:'60 мин',effect:'+Радость',science:'Творчество.',times:'1×/нед'},
{id:'r_garden',cat:'🎨 Творческое',emoji:'🌱',title:'Садоводство',desc:'Уход.',how:'30 мин/день.',time:'30 мин',effect:'+Заземление',science:'Земля успокаивает.',times:'1 раз в день'},
{id:'r_dance',cat:'🎨 Творческое',emoji:'💃',title:'Танцы',desc:'30 мин.',how:'Дома.',time:'30 мин',effect:'+Радость',science:'Эндорфины.',times:'2-3×/нед'},
{id:'r_singing',cat:'🎨 Творческое',emoji:'🎤',title:'Пение',desc:'Караоке.',how:'15 мин/день.',time:'15 мин',effect:'+Настроение',science:'Дыхание + эмоции.',times:'1 раз в день'},
{id:'r_poetry',cat:'🎨 Творческое',emoji:'📚',title:'Поэзия',desc:'Чтение.',how:'15 мин/день.',time:'15 мин',effect:'+Эмоции',science:'Правополушарное.',times:'1 раз в день'},
{id:'r_video',cat:'🎨 Творческое',emoji:'🎬',title:'Съёмка видео',desc:'Короткие ролики.',how:'30 мин/день.',time:'30 мин',effect:'+Креатив',science:'Монтаж.',times:'1-2×/нед'},
{id:'r_calligraphy',cat:'🎨 Творческое',emoji:'🖌',title:'Каллиграфия',desc:'Красивое письмо.',how:'20 мин/день.',time:'20 мин',effect:'+Терпение',science:'Медитация.',times:'1 раз в день'},
{id:'r_boardgames',cat:'🎨 Творческое',emoji:'🎲',title:'Настольные игры',desc:'С друзьями.',how:'1-2 ч.',time:'90 мин',effect:'+Социальное',science:'Мозг + общение.',times:'1×/нед'},
{id:'r_therapy',cat:'❤️ Эмоциональное',emoji:'💬',title:'Разговор с психологом',desc:'Терапия.',how:'1 раз/нед.',time:'60 мин',effect:'+Психика',science:'Доказано.',times:'1×/нед'},
{id:'r_cry',cat:'❤️ Эмоциональное',emoji:'😢',title:'Выплакаться',desc:'Разрешить слёзы.',how:'Не сдерживай.',time:'—',effect:'+Облегчение',science:'Выводит кортизол.',times:'По необходимости'},
{id:'r_laugh',cat:'❤️ Эмоциональное',emoji:'😂',title:'Смех 15 мин',desc:'Комедия.',how:'Раз в день.',time:'15 мин',effect:'+Настроение',science:'-30% кортизола.',times:'1 раз в день'},
{id:'r_emotion',cat:'❤️ Эмоциональное',emoji:'😌',title:'Проживание эмоции',desc:'Признай.',how:'90 сек.',time:'2 мин',effect:'+Спокойствие',science:'Пик 90 сек.',times:'По необходимости'},
{id:'r_solution',cat:'❤️ Эмоциональное',emoji:'🎯',title:'Фокус на решении',desc:'Не на проблеме.',how:'Что я могу?',time:'10 мин',effect:'+Действие',science:'КПТ.',times:'По необходимости'},
{id:'r_selfmassage',cat:'❤️ Эмоциональное',emoji:'💆',title:'Самомассаж',desc:'Шея, плечи.',how:'5 мин.',time:'5 мин',effect:'+Расслабление',science:'Снимает напряжение.',times:'1 раз в день'},
{id:'r_ritual',cat:'❤️ Эмоциональное',emoji:'☕',title:'Ритуал',desc:'Утренний кофе.',how:'Без телефона.',time:'15 мин',effect:'+Спокойствие',science:'Осознанность.',times:'1 раз утром'},
{id:'r_letter',cat:'❤️ Эмоциональное',emoji:'💌',title:'Письмо',desc:'Другу или себе.',how:'Искренне.',time:'15 мин',effect:'+Связь',science:'Выражение.',times:'1×/нед'},
{id:'r_friends',cat:'👥 Социальное',emoji:'👥',title:'Встреча с друзьями',desc:'Живое.',how:'1-2 ч.',time:'2 ч',effect:'+Связь',science:'Окситоцин.',times:'1-2×/нед'},
{id:'r_family',cat:'👥 Социальное',emoji:'👨‍👩‍👧',title:'Время с семьёй',desc:'Без телефонов.',how:'1 ч.',time:'60 мин',effect:'+Поддержка',science:'Удлиняет жизнь.',times:'1 раз в день'},
{id:'r_callclose',cat:'👥 Социальное',emoji:'📞',title:'Звонок близкому',desc:'15 мин.',how:'Просто так.',time:'15 мин',effect:'+Связь',science:'Голос.',times:'1 раз в день'},
{id:'r_network',cat:'👥 Социальное',emoji:'🤝',title:'Нетворкинг',desc:'Новое знакомство.',how:'5/мес.',time:'30 мин',effect:'+Возможности',science:'Слабые связи.',times:'5×/мес'},
{id:'r_party',cat:'👥 Социальное',emoji:'🎉',title:'Вечеринка',desc:'Социальное.',how:'1-2×/мес.',time:'3 ч',effect:'+Радость',science:'Дофамин.',times:'1-2×/мес'},
{id:'r_deep',cat:'👥 Социальное',emoji:'💬',title:'Глубокий разговор',desc:'1 ч.',how:'С близким.',time:'60 мин',effect:'+Связь',science:'Уязвимость.',times:'1×/нед'},
{id:'r_mentor',cat:'👥 Социальное',emoji:'🎓',title:'Менторство',desc:'Помоги.',how:'1 раз/нед.',time:'60 мин',effect:'+Смысл',science:'Помощь = счастье.',times:'1×/нед'},
{id:'r_gift',cat:'👥 Социальное',emoji:'🎁',title:'Подарок близкому',desc:'Бескорыстно.',how:'Просто так.',time:'—',effect:'+Связь',science:'Даяние.',times:'1×/нед'},
{id:'r_lunch',cat:'👥 Социальное',emoji:'🍽',title:'Обед с коллегами',desc:'Совместный.',how:'1 ч.',time:'60 мин',effect:'+Связь',science:'Социальное.',times:'2-3×/нед'},
{id:'r_coffee2',cat:'👥 Социальное',emoji:'☕',title:'Кофе с другом',desc:'30 мин.',how:'В кафе.',time:'30 мин',effect:'+Общение',science:'Социальное.',times:'1-2×/нед'},
{id:'r_sportfriend',cat:'👥 Социальное',emoji:'🏃',title:'Спорт с другом',desc:'Совместная.',how:'1 ч.',time:'60 мин',effect:'+Мотивация',science:'Соц.поддержка.',times:'2-3×/нед'},
{id:'r_prayer',cat:'🕊 Духовное',emoji:'🙏',title:'Молитва',desc:'Обращение.',how:'Искренне.',time:'10 мин',effect:'+Спокойствие',science:'Вера = опора.',times:'1-2 раза в день'},
{id:'r_nature2',cat:'🕊 Духовное',emoji:'🌿',title:'Природа 1 ч',desc:'Единение.',how:'Лес.',time:'60 мин',effect:'+Гармония',science:'Заземление.',times:'1-2×/нед'},
{id:'r_sunrise',cat:'🕊 Духовное',emoji:'🌅',title:'Рассвет',desc:'Наблюдение.',how:'Ранний подъём.',time:'30 мин',effect:'+Восхищение',science:'Красота.',times:'1×/нед'},
{id:'r_sunset',cat:'🕊 Духовное',emoji:'🌇',title:'Закат',desc:'Наблюдение.',how:'Вечером.',time:'30 мин',effect:'+Благодарность',science:'Красота.',times:'1×/нед'},
{id:'r_stars',cat:'🕊 Духовное',emoji:'⭐',title:'Созерцание звёзд',desc:'Ночное небо.',how:'30 мин.',time:'30 мин',effect:'+Масштаб',science:'Смирение.',times:'1×/нед'},
{id:'r_mantra',cat:'🕊 Духовное',emoji:'📿',title:'Практика мантр',desc:'Повторение.',how:'108 раз.',time:'15 мин',effect:'+Фокус',science:'Медитация.',times:'1 раз в день'},
{id:'r_candle',cat:'🕊 Духовное',emoji:'🕯',title:'Свеча',desc:'Медитация на огонь.',how:'10 мин.',time:'10 мин',effect:'+Спокойствие',science:'Тратака.',times:'1 раз вечером'},
{id:'r_lifereflection',cat:'🕊 Духовное',emoji:'💭',title:'Рефлексия жизни',desc:'Размышления.',how:'15 мин.',time:'15 мин',effect:'+Смысл',science:'Экзистенция.',times:'1 раз в день'},
{id:'r_gratitudejournal',cat:'🕊 Духовное',emoji:'📝',title:'Дневник благодарности',desc:'10 пунктов.',how:'Вечером.',time:'10 мин',effect:'+Счастье',science:'+25%.',times:'1 раз вечером'},
{id:'r_donation',cat:'🕊 Духовное',emoji:'🌺',title:'Пожертвование',desc:'Деньги или время.',how:'1 раз/мес.',time:'30 мин',effect:'+Смысл',science:'Даяние.',times:'1×/мес'},
{id:'r_volunteer',cat:'🕊 Духовное',emoji:'🤝',title:'Волонтёрство',desc:'Помощь.',how:'1 раз/нед.',time:'2 ч',effect:'+Смысл',science:'+25% счастья.',times:'1×/нед'},
{id:'r_forgiveness',cat:'🕊 Духовное',emoji:'🕊',title:'Прощение',desc:'Отпустить обиды.',how:'Медитация метта.',time:'20 мин',effect:'+Свобода',science:'Для себя.',times:'1 раз в день'},
{id:'r_fasting',cat:'🕊 Духовное',emoji:'🌿',title:'Пост',desc:'Отказ от еды.',how:'16:8.',time:'16 ч',effect:'+Ясность',science:'Аутофагия.',times:'1×/нед'},
{id:'r_silence2',cat:'🕊 Духовное',emoji:'🤫',title:'Тишина',desc:'Без слов 1 ч.',how:'Молчание.',time:'60 мин',effect:'+Глубина',science:'Внутренний диалог.',times:'1×/нед'},
{id:'r_morning',cat:'🕊 Духовное',emoji:'🌅',title:'Утренний ритуал',desc:'Свой.',how:'Вода, свет.',time:'30 мин',effect:'+День',science:'Автоматизм.',times:'Каждое утро'},
{id:'r_evening',cat:'🕊 Духовное',emoji:'🌙',title:'Вечерний ритуал',desc:'Свой.',how:'Дневник, чтение.',time:'30 мин',effect:'+Сон',science:'Ритуал.',times:'Каждый вечер'},
{id:'r_ikigai',cat:'🕊 Духовное',emoji:'🎯',title:'Икигай',desc:'Смысл.',how:'4 сферы.',time:'30 мин',effect:'+Смысл',science:'Японцы.',times:'1×/мес'},
{id:'r_children',cat:'👨‍👩‍👧 Семейное',emoji:'👨‍👩‍👧',title:'Время с детьми',desc:'Без телефонов.',how:'1 ч.',time:'60 мин',effect:'+Связь',science:'Дети.',times:'1 раз в день'},
{id:'r_date',cat:'👨‍👩‍👧 Семейное',emoji:'💑',title:'Свидание',desc:'С партнёром.',how:'1×/нед.',time:'2 ч',effect:'+Связь',science:'Пара.',times:'1×/нед'},
{id:'r_familydinner',cat:'👨‍👩‍👧 Семейное',emoji:'🍽',title:'Семейный ужин',desc:'Все вместе.',how:'Без телефонов.',time:'60 мин',effect:'+Связь',science:'Традиция.',times:'1 раз в день'},
{id:'r_familywalk',cat:'👨‍👩‍👧 Семейное',emoji:'🚶',title:'Прогулка с семьёй',desc:'Совместная.',how:'30 мин.',time:'30 мин',effect:'+Связь',science:'Общее.',times:'1 раз в день'},
{id:'r_cooktogether',cat:'👨‍👩‍👧 Семейное',emoji:'🍳',title:'Готовка вместе',desc:'Совместная.',how:'1 ч.',time:'60 мин',effect:'+Связь',science:'Общее дело.',times:'2-3×/нед'},
{id:'r_parents',cat:'👨‍👩‍👧 Семейное',emoji:'💬',title:'Разговор с родителями',desc:'Регулярный.',how:'1×/нед.',time:'30 мин',effect:'+Связь',science:'Родители.',times:'1×/нед'},
{id:'r_grandparents',cat:'👨‍👩‍👧 Семейное',emoji:'📞',title:'Звонок бабушке',desc:'15 мин.',how:'1×/нед.',time:'15 мин',effect:'+Связь',science:'Старшие.',times:'1×/нед'},
{id:'r_vacation',cat:'👨‍👩‍👧 Семейное',emoji:'🏖',title:'Совместный отпуск',desc:'Путешествие.',how:'1-2×/год.',time:'7 дней',effect:'+Связь',science:'Общий опыт.',times:'1-2×/год'},
{id:'r_dayoff',cat:'💼 Рабочее',emoji:'🛌',title:'Выходной',desc:'Полный.',how:'1 день без работы.',time:'1 день',effect:'+Энергия',science:'Восстановление.',times:'1×/нед'},
{id:'r_break',cat:'💼 Рабочее',emoji:'☕',title:'Перерыв 15 мин',desc:'Каждые 90 мин.',how:'Отойди.',time:'15 мин',effect:'+Продуктивность',science:'Ультрадианные.',times:'4 раза в день'},
{id:'r_lunchout',cat:'💼 Рабочее',emoji:'🌳',title:'Обед на улице',desc:'Не в офисе.',how:'Прогулка + еда.',time:'60 мин',effect:'+Энергия',science:'Свежий воздух.',times:'1 раз в день'},
{id:'r_afterwork',cat:'💼 Рабочее',emoji:'🚶',title:'Прогулка после работы',desc:'20 мин.',how:'Без телефона.',time:'20 мин',effect:'+Разгрузка',science:'Переключение.',times:'1 раз в день'},
{id:'r_morning2',cat:'💼 Рабочее',emoji:'🌅',title:'Утро без телефона',desc:'30 мин.',how:'Телефон в комнате.',time:'30 мин',effect:'+День',science:'+21%.',times:'Каждое утро'},
{id:'r_evening2',cat:'💼 Рабочее',emoji:'🌙',title:'Вечер без экрана',desc:'2 ч.',how:'Книга.',time:'2 ч',effect:'+Сон',science:'Мелатонин.',times:'Каждый вечер'},
{id:'r_weekreview',cat:'💼 Рабочее',emoji:'📊',title:'Ревью недели',desc:'30 мин.',how:'Итоги + план.',time:'30 мин',effect:'+Рост',science:'Рефлексия.',times:'1×/нед'},
{id:'r_monthreview',cat:'💼 Рабочее',emoji:'🎯',title:'Ревью месяца',desc:'1 ч.',how:'Итоги.',time:'60 мин',effect:'+Рост',science:'Рефлексия.',times:'1×/мес'},
{id:'r_yearreview',cat:'💼 Рабочее',emoji:'📅',title:'Ревью года',desc:'2 ч.',how:'Итоги + цели.',time:'120 мин',effect:'+Рост',science:'Рефлексия.',times:'1×/год'},
{id:'r_vision',cat:'💼 Рабочее',emoji:'🔭',title:'Видение 5 лет',desc:'План.',how:'Опиши.',time:'30 мин',effect:'+Ясность',science:'Видение.',times:'1×/квартал'},
{id:'r_goals',cat:'💼 Рабочее',emoji:'🎯',title:'Цели на год',desc:'SMART.',how:'3 цели.',time:'30 мин',effect:'+Результат',science:'Записанные +42%.',times:'1×/год'},
{id:'r_okr',cat:'💼 Рабочее',emoji:'📊',title:'OKR',desc:'Objectives + KR.',how:'3 KR.',time:'30 мин',effect:'+Фокус',science:'Гроув.',times:'1×/квартал'},
{id:'r_metrics',cat:'💼 Рабочее',emoji:'📈',title:'Метрики',desc:'Что измеряешь.',how:'3 метрики.',time:'15 мин',effect:'+Прогресс',science:'Деминг.',times:'1×/нед'},
{id:'r_mentor2',cat:'💼 Рабочее',emoji:'🎓',title:'Ментор',desc:'Найди.',how:'1 раз/мес.',time:'60 мин',effect:'+Рост',science:'Ментор.',times:'1×/мес'},
{id:'r_sideproject',cat:'💼 Рабочее',emoji:'🚀',title:'Side-проект',desc:'Свой.',how:'1 ч/день.',time:'60 мин',effect:'+Доход',science:'Диверсификация.',times:'1 раз в день'},
{id:'r_invest',cat:'💼 Рабочее',emoji:'💰',title:'Инвестиции',desc:'DCA.',how:'Ежемесячно.',time:'15 мин',effect:'+Капитал',science:'Сложный процент.',times:'1×/мес'},
{id:'r_budget',cat:'💼 Рабочее',emoji:'📊',title:'Бюджет',desc:'Учёт.',how:'Записывай.',time:'10 мин',effect:'+Контроль',science:'Осознанность.',times:'1 раз в день'},
{id:'r_finance_review',cat:'💼 Рабочее',emoji:'📈',title:'Фин. ревью',desc:'1 раз/мес.',how:'Итоги.',time:'30 мин',effect:'+Контроль',science:'Рефлексия.',times:'1×/мес'}
];

/* ============ VISION_EXERCISES (75) ============ */
var VISION_EXERCISES=[
{id:'v2_01',effect:'small',emoji:'👁',title:'Моргание 30 сек',desc:'Быстро моргай 30 секунд.',how:'Расслабь веки.',duration:'30 сек',benefit:'Увлажнение',times:'3 раза в день',science:'Обновляет слёзную плёнку.'},
{id:'v2_02',effect:'small',emoji:'🪟',title:'Взгляд в окно 1 мин',desc:'Смотри в окно 1 минуту.',how:'Расслабь взгляд.',duration:'1 мин',benefit:'Расслабление',times:'Каждый час',science:'Цилиарная мышца расслабляется.'},
{id:'v2_03',effect:'small',emoji:'😌',title:'Закрыть глаза 30 сек',desc:'Просто закрой глаза.',how:'Расслабь веки.',duration:'30 сек',benefit:'Отдых',times:'Каждые 30 мин',science:'96% нейронов отдыхают.'},
{id:'v2_04',effect:'small',emoji:'💧',title:'Капли',desc:'Увлажняющие капли.',how:'1-2 капли.',duration:'1 мин',benefit:'Увлажнение',times:'2-3 раза в день',science:'Восстанавливает плёнку.'},
{id:'v2_05',effect:'small',emoji:'🖐',title:'Массаж век',desc:'Мягкий массаж.',how:'Круговыми 30 сек.',duration:'30 сек',benefit:'Кровоток',times:'2 раза в день',science:'Мейбомиевы железы.'},
{id:'v2_06',effect:'small',emoji:'🌬',title:'Дыхание 4-7-8',desc:'С фокусом на глаза.',how:'4-7-8.',duration:'1 мин',benefit:'Расслабление',times:'3 раза в день',science:'Парасимпатика.'},
{id:'v2_07',effect:'small',emoji:'☕',title:'Тёплый компресс',desc:'На глаза.',how:'Ватный диск 1 мин.',duration:'1 мин',benefit:'Расслабление',times:'1-2 раза в день',science:'Расширяет сосуды.'},
{id:'v2_08',effect:'small',emoji:'🧊',title:'Холодный компресс',desc:'При усталости.',how:'Прохладный 30 сек.',duration:'30 сек',benefit:'Бодрость',times:'При усталости',science:'Сужает сосуды.'},
{id:'v2_09',effect:'small',emoji:'👀',title:'Зажмуривание 5 раз',desc:'Зажмурься 5 раз.',how:'3 сек, открой.',duration:'30 сек',benefit:'Тонус',times:'3 раза в день',science:'Тонизирует мышцу.'},
{id:'v2_10',effect:'small',emoji:'🔄',title:'Круги глазами',desc:'5 кругов.',how:'Медленно.',duration:'30 сек',benefit:'Разминка',times:'2 раза в день',science:'6 мышц.'},
{id:'v2_11',effect:'small',emoji:'⬆️',title:'Взгляд вверх',desc:'10 сек.',how:'Плавно.',duration:'10 сек',benefit:'Мышцы',times:'Каждые 2 ч',science:'Верхняя прямая.'},
{id:'v2_12',effect:'small',emoji:'⬇️',title:'Взгляд вниз',desc:'10 сек.',how:'Плавно.',duration:'10 сек',benefit:'Мышцы',times:'Каждые 2 ч',science:'Нижняя прямая.'},
{id:'v2_13',effect:'small',emoji:'⬅️',title:'Влево 10 сек',desc:'Максимально.',how:'Плавно.',duration:'10 сек',benefit:'Мышцы',times:'Каждые 2 ч',science:'Медиальная.'},
{id:'v2_14',effect:'small',emoji:'➡️',title:'Вправо 10 сек',desc:'Максимально.',how:'Плавно.',duration:'10 сек',benefit:'Мышцы',times:'Каждые 2 ч',science:'Латеральная.'},
{id:'v2_15',effect:'small',emoji:'👁️',title:'Смена фокуса',desc:'10 раз.',how:'Палец → стена.',duration:'1 мин',benefit:'Аккомодация',times:'2 раза в день',science:'Цилиарная.'},
{id:'v2_16',effect:'medium',emoji:'✋',title:'Пальминг 3 мин',desc:'Классический.',how:'Разотри ладони.',duration:'3 мин',benefit:'Глубокий отдых',times:'2 раза в день',science:'Темнота + тепло.'},
{id:'v2_17',effect:'medium',emoji:'👁',title:'20-20-20',desc:'Каждые 20 мин.',how:'20 сек на 6 м.',duration:'20 сек',benefit:'Спазм',times:'Каждые 20 мин',science:'Золотой стандарт.'},
{id:'v2_18',effect:'medium',emoji:'🔭',title:'Дальше-ближе 20 раз',desc:'Фокусировка.',how:'Палец → окно.',duration:'2 мин',benefit:'Аккомодация',times:'2 раза в день',science:'Скорость переключения.'},
{id:'v2_19',effect:'medium',emoji:'🔄',title:'Восьмёрка',desc:'Рисуй глазами.',how:'10 раз.',duration:'2 мин',benefit:'Мышцы',times:'2 раза в день',science:'Косые мышцы.'},
{id:'v2_20',effect:'medium',emoji:'💆',title:'Массаж точек 3 мин',desc:'6 точек.',how:'По 5 сек.',duration:'3 мин',benefit:'Кровоток',times:'2 раза в день',science:'Акупрессура.'},
{id:'v2_21',effect:'medium',emoji:'😑',title:'Зажмуривание 10 раз',desc:'Силовое.',how:'3 сек, 1 сек.',duration:'1 мин',benefit:'Тонус',times:'2 раза в день',science:'Разница давлений.'},
{id:'v2_22',effect:'medium',emoji:'🌑',title:'Отдых в темноте 5 мин',desc:'Полная темнота.',how:'Закрой шторы.',duration:'5 мин',benefit:'Восстановление',times:'1 раз в день',science:'Родопсин.'},
{id:'v2_23',effect:'medium',emoji:'👀',title:'Метка на стекле',desc:'Наклейка.',how:'5 сек метка, 5 сек вдаль.',duration:'5 мин',benefit:'Аккомодация',times:'1 раз в день',science:'Переключение.'},
{id:'v2_24',effect:'medium',emoji:'🧘',title:'Пальминг + медитация',desc:'Комбо.',how:'5 мин.',duration:'5 мин',benefit:'Глубокое расслабление',times:'1 раз в день',science:'Двойной эффект.'},
{id:'v2_25',effect:'medium',emoji:'☀️',title:'Солнечные ванны 5 мин',desc:'Утренний свет.',how:'До 10:00.',duration:'5 мин',benefit:'Здоровье',times:'1 раз утром',science:'Дофамин в сетчатке.'},
{id:'v2_26',effect:'medium',emoji:'🎯',title:'Диагонали 20 раз',desc:'Крест-накрест.',how:'10 в одну.',duration:'2 мин',benefit:'Косые',times:'2 раза в день',science:'Бинокулярное.'},
{id:'v2_27',effect:'medium',emoji:'🌊',title:'Волна глазами',desc:'Плавные волны.',how:'Слева-вверх-справа-вниз.',duration:'1 мин',benefit:'Мышцы',times:'2 раза в день',science:'Прокачка.'},
{id:'v2_28',effect:'medium',emoji:'🕐',title:'Часы',desc:'12, 3, 6, 9.',how:'По 3 сек.',duration:'1 мин',benefit:'Мышцы',times:'2 раза в день',science:'Все направления.'},
{id:'v2_29',effect:'medium',emoji:'🔢',title:'Цифры в воздухе',desc:'Рисуй 1-10.',how:'Глазами.',duration:'2 мин',benefit:'Мышцы + мозг',times:'1 раз в день',science:'Моторная память.'},
{id:'v2_30',effect:'medium',emoji:'🎨',title:'Цветотерапия',desc:'Смотри на цвета.',how:'Красный, зелёный, синий.',duration:'3 мин',benefit:'Настроение',times:'1 раз в день',science:'Длины волн.'},
{id:'v2_31',effect:'medium',emoji:'🌳',title:'Прогулка 20 мин',desc:'Смотреть вдаль.',how:'Без телефона.',duration:'20 мин',benefit:'Расслабление',times:'1 раз в день',science:'Свет + фокус.'},
{id:'v2_32',effect:'medium',emoji:'👓',title:'Без очков 5 мин',desc:'Если не критично.',how:'Смотри вдаль.',duration:'5 мин',benefit:'Тренировка',times:'1 раз в день',science:'Мышцы.'},
{id:'v2_33',effect:'medium',emoji:'🌅',title:'Рассвет 5 мин',desc:'Утренний свет.',how:'Через окно.',duration:'5 мин',benefit:'Циркадные',times:'1 раз утром',science:'Мелатонин.'},
{id:'v2_34',effect:'medium',emoji:'❄️',title:'Холодная вода',desc:'Умывание.',how:'5-10 сек.',duration:'30 сек',benefit:'Бодрость',times:'2 раза в день',science:'Сосуды.'},
{id:'v2_35',effect:'medium',emoji:'🎵',title:'С закрытыми глазами',desc:'Слушай музыку.',how:'5 мин.',duration:'5 мин',benefit:'Отдых',times:'1 раз в день',science:'Слух.'},
{id:'v2_36',effect:'medium',emoji:'🌙',title:'Отдых перед сном',desc:'10 мин.',how:'В темноте.',duration:'10 мин',benefit:'Сон',times:'1 раз вечером',science:'Мелатонин.'},
{id:'v2_37',effect:'medium',emoji:'💧',title:'Компресс с ромашкой',desc:'Тёплый отвар.',how:'5 мин.',duration:'5 мин',benefit:'Успокоение',times:'1 раз в день',science:'Противовоспалительное.'},
{id:'v2_38',effect:'medium',emoji:'🌿',title:'Природные капли',desc:'Отвар ромашки.',how:'1-2 капли.',duration:'1 мин',benefit:'Увлажнение',times:'1 раз в день',science:'Натуральные.'},
{id:'v2_39',effect:'medium',emoji:'🎯',title:'Тир',desc:'Палец → 5 точек.',how:'По 5 сек.',duration:'3 мин',benefit:'Аккомодация',times:'2 раза в день',science:'Фокус.'},
{id:'v2_40',effect:'medium',emoji:'⏱',title:'20-20-20 + 1',desc:'+ 3 вдоха.',how:'Комбо.',duration:'1 мин',benefit:'Расслабление',times:'Каждые 20 мин',science:'Двойной.'},
{id:'v2_41',effect:'hard',emoji:'🌑',title:'Полная темнота 15 мин',desc:'В темноте.',how:'Завяжи глаза.',duration:'15 мин',benefit:'Восстановление',times:'1 раз в день',science:'Максимум родопсина.'},
{id:'v2_42',effect:'hard',emoji:'☀️',title:'Солнечные ванны 15 мин',desc:'Долго на солнце.',how:'Утро или вечер.',duration:'15 мин',benefit:'Здоровье',times:'1 раз в день',science:'Витамин D.'},
{id:'v2_43',effect:'hard',emoji:'🏞',title:'Час на природе',desc:'Смотреть вдаль.',how:'Лес, парк.',duration:'60 мин',benefit:'Полное расслабление',times:'1 раз в день',science:'-20% кортизола.'},
{id:'v2_44',effect:'hard',emoji:'🏊',title:'Плавание 30 мин',desc:'В воде без очков.',how:'Глаза в воде.',duration:'30 мин',benefit:'Все мышцы',times:'1 раз в день',science:'Комплексный.'},
{id:'v2_45',effect:'hard',emoji:'🎯',title:'Фокусировка 30 мин',desc:'Дальние объекты.',how:'Птицы, облака.',duration:'30 мин',benefit:'Аккомодация',times:'1 раз в день',science:'Регулярно.'},
{id:'v2_46',effect:'hard',emoji:'🧘',title:'Йога для глаз 20 мин',desc:'Полный комплекс.',how:'Все по 1 мин.',duration:'20 мин',benefit:'Комплекс',times:'1 раз в день',science:'Комплекс.'},
{id:'v2_47',effect:'hard',emoji:'👁',title:'Конвергенция 30 раз',desc:'Сведение глаз.',how:'Палец к носу.',duration:'5 мин',benefit:'Мышцы',times:'2 раза в день',science:'Конвергенция.'},
{id:'v2_48',effect:'hard',emoji:'🔍',title:'Рассматривание вдаль',desc:'Мелкие детали.',how:'Деревья, буквы.',duration:'20 мин',benefit:'Острота',times:'1 раз в день',science:'Разрешающая.'},
{id:'v2_49',effect:'hard',emoji:'🌈',title:'Стереограммы',desc:'Бинокулярное.',how:'До 3D.',duration:'10 мин',benefit:'Бинокулярное',times:'1 раз в день',science:'Синхронизация.'},
{id:'v2_50',effect:'hard',emoji:'⏰',title:'Полный отдых 30 мин',desc:'Тёмная комната.',how:'Полная темнота.',duration:'30 мин',benefit:'Восстановление',times:'1 раз в день',science:'Регенерация.'},
{id:'v2_51',effect:'max',emoji:'👁',title:'Бейтс: Соляризация',desc:'Солнце через веки.',how:'Закрой глаза, на солнце.',duration:'3 мин',benefit:'Здоровье глаз',times:'1 раз утром',science:'Метод Бейтса.'},
{id:'v2_52',effect:'max',emoji:'✋',title:'Бейтс: Пальминг 10 мин',desc:'Расширенный.',how:'10 мин.',duration:'10 мин',benefit:'Восстановление',times:'2 раза в день',science:'Глубокое.'},
{id:'v2_53',effect:'max',emoji:'🔄',title:'Бейтс: Повороты',desc:'Повороты тела.',how:'Поворачивай тело.',duration:'5 мин',benefit:'Расслабление',times:'1 раз в день',science:'Снимает напряжение.'},
{id:'v2_54',effect:'max',emoji:'🎯',title:'Бейтс: Центральная фиксация',desc:'Фокус на точке.',how:'10 мин.',duration:'10 мин',benefit:'Острота',times:'1 раз в день',science:'Центральное зрение.'},
{id:'v2_55',effect:'max',emoji:'📖',title:'Чтение мелкого шрифта',desc:'Тренировка.',how:'10 мин.',duration:'10 мин',benefit:'Острота',times:'1 раз в день',science:'Бейтс.'},
{id:'v2_56',effect:'max',emoji:'🌞',title:'Полная соляризация',desc:'Смотреть в сторону солнца.',how:'С закрытыми.',duration:'5 мин',benefit:'Здоровье',times:'1 раз утром',science:'Бейтс.'},
{id:'v2_57',effect:'max',emoji:'👀',title:'Периферическое зрение',desc:'Боковое зрение.',how:'Смотри вперёд.',duration:'10 мин',benefit:'Периферия',times:'1 раз в день',science:'Расширяет поле.'},
{id:'v2_58',effect:'max',emoji:'🎨',title:'Цветовое зрение',desc:'Изучение оттенков.',how:'15 мин.',duration:'15 мин',benefit:'Цветовое',times:'1 раз в день',science:'Колбочки.'},
{id:'v2_59',effect:'max',emoji:'🌙',title:'Ночное зрение',desc:'Тренировка в темноте.',how:'Слабый свет.',duration:'15 мин',benefit:'Ночное',times:'1 раз вечером',science:'Палочки.'},
{id:'v2_60',effect:'max',emoji:'🧠',title:'Полный комплекс Бейтса',desc:'Все упражнения.',how:'30 мин.',duration:'30 мин',benefit:'Восстановление',times:'1 раз в день',science:'Полный метод.'},
{id:'v2_61',effect:'max',emoji:'🔭',title:'Фокусировка на облаках',desc:'20 мин.',how:'Смотри на облака.',duration:'20 мин',benefit:'Аккомодация',times:'1 раз в день',science:'Расслабление.'},
{id:'v2_62',effect:'max',emoji:'🌊',title:'Наблюдение за водой',desc:'15 мин.',how:'Море, река.',duration:'15 мин',benefit:'Расслабление',times:'1 раз в день',science:'Медитация.'},
{id:'v2_63',effect:'hard',emoji:'🚶',title:'Прогулка без очков',desc:'20 мин.',how:'В безопасном месте.',duration:'20 мин',benefit:'Тренировка',times:'1 раз в день',science:'Мышцы.'},
{id:'v2_64',effect:'hard',emoji:'📚',title:'Чтение без очков',desc:'10 мин.',how:'Свет 500 люкс.',duration:'10 мин',benefit:'Тренировка',times:'1 раз в день',science:'Комфорт.'},
{id:'v2_65',effect:'medium',emoji:'😴',title:'Йога-нидра для глаз',desc:'15 мин.',how:'Лёжа.',duration:'15 мин',benefit:'Глубокий отдых',times:'1 раз в день',science:'Парасимпатика.'},
{id:'v2_66',effect:'small',emoji:'🌿',title:'Прогулка босиком',desc:'Заземление.',how:'10 мин на траве.',duration:'10 мин',benefit:'Сосуды',times:'1 раз в день',science:'Заземление.'},
{id:'v2_67',effect:'small',emoji:'💆',title:'Массаж шеи',desc:'5 мин.',how:'Снимает напряжение.',duration:'5 мин',benefit:'Кровоток',times:'2 раза в день',science:'Шея = глаза.'},
{id:'v2_68',effect:'small',emoji:'🧘',title:'Медитация с открытыми глазами',desc:'5 мин.',how:'Смотри в одну точку.',duration:'5 мин',benefit:'Фокус',times:'1 раз в день',science:'Тратака.'},
{id:'v2_69',effect:'medium',emoji:'🎯',title:'Игра в теннис',desc:'30 мин.',how:'Мяч туда-сюда.',duration:'30 мин',benefit:'Динамика',times:'2-3×/нед',science:'Быстрая фокусировка.'},
{id:'v2_70',effect:'medium',emoji:'🎮',title:'Игра в мяч',desc:'10 мин.',how:'Подбрасывай.',duration:'10 мин',benefit:'Слежение',times:'1 раз в день',science:'Саккады.'},
{id:'v2_71',effect:'hard',emoji:'🎨',title:'Рисование с натуры',desc:'20 мин.',how:'Смотри и рисуй.',duration:'20 мин',benefit:'Наблюдательность',times:'1 раз в день',science:'Глаз-рука.'},
{id:'v2_72',effect:'hard',emoji:'📷',title:'Фотоохота',desc:'30 мин.',how:'Ищи кадры.',duration:'30 мин',benefit:'Внимание',times:'1×/нед',science:'Фокус.'},
{id:'v2_73',effect:'max',emoji:'🌟',title:'Взгляд на звёзды',desc:'30 мин.',how:'Ночное небо.',duration:'30 мин',benefit:'Расслабление',times:'1×/нед',science:'Дальний фокус.'},
{id:'v2_74',effect:'max',emoji:'🔭',title:'Наблюдение горизонта',desc:'15 мин.',how:'Смотри на горизонт.',duration:'15 мин',benefit:'Аккомодация',times:'1 раз в день',science:'Максимальный отдых.'},
{id:'v2_75',effect:'medium',emoji:'😌',title:'Моргание и отдых',desc:'10 мин.',how:'Каждые 2 сек моргай.',duration:'10 мин',benefit:'Увлажнение',times:'3 раза в день',science:'Слёзная плёнка.'}
];

/* ============================================================
   КОНЕЦ ЧАСТИ 3/6
   Дальше: часть 4 — Детокс 62 дня + English + НОВЫЕ КУРСЫ
   ============================================================ */
console.log('[CONTENT 3/6] WEALTH='+WEALTH_MODULES.length+' METHODS='+METHODS_LIBRARY.length+' RECOVERY='+RECOVERY_LIBRARY.length+' VISION='+VISION_EXERCISES.length);
/* ============================================================
   LIFE OS — CONTENT.js v42 — ЧАСТЬ 4A/6
   DETOX_COURSE — 62 ДНЯ (дни 1-31)
   Каждый день: расширенная теория, наука, чеклист, эффект, лайфхаки
   ============================================================ */

var DETOX_COURSE=[
/* ============ ФАЗА 1: ПОДГОТОВКА (дни 1-7) ============ */
{day:1,phase:'🚀 Подготовка',title:'Осознай проблему',subtitle:'Замерь экран',emoji:'📊',
theory:'**Первый шаг — измерить.** Нельзя изменить то, что не измерено. Средний человек проводит в телефоне **7 часов 4 минуты** в день. Это **44% всей жизни**, пока глаза открыты. Если тебе 25 — ты уже провёл в экране **8 лет** своей жизни. К 40 это будет **14 лет**.\n\nЗадача не «ужаснуться», а **увидеть реальность**. Мы не боремся с телефоном — мы возвращаем себе жизнь.',
science:'DataReportal 2024: 6ч 40мин средний экран. 2.5 ч — соцсети, 1.5 ч — мессенджеры, 1 ч — видео. **Каждый час экрана сокращает глубокий сон на 6 минут.** Хроническое использование = -30% концентрации, +40% тревожности.',
do:['Открой Screen Time / Digital Wellbeing','Посмотри данные за 7 дней','Топ-3 приложения по времени','Запиши цифры в заметки','Покажи другу или партнёру','Прими факт без осуждения'],
effect:'Понимание реальности, мотивация к изменениям',
tips:'Не осуждай себя. Ты не «слабый», ты в ловушке. Цель — не стыд, а ясность.'},

{day:2,phase:'🚀 Подготовка',title:'Убери соблазны',subtitle:'Среда решает',emoji:'🧹',
theory:'**Сила воли ограничена. Среда > воля.** Каждое решение требует глюкозы и энергии. Ты не можешь 100 раз в день говорить «нет». Но можешь сделать вредное сложнодоступным. Убери приложения с главного экрана. Включи чёрно-белый режим. Отключи уведомления. Спрячь телефон во время еды. **Среда делает выбор за тебя.**',
science:'Эксперимент Дьюка: группа с телефоном в другой комнате показала +26% продуктивности. Венди Вуд: «Люди с лучшим самоконтролем не борются с соблазнами — они их не создают».',
do:['Удали соцсети с главного экрана','Отключи все пуши, кроме звонков','Включи чёрно-белый режим','Купи будильник','Убери телефон из спальни','Создай «фокус-комнату» (где нет телефона)'],
effect:'-30% экрана автоматически, +2 ч свободного времени',
tips:'Начни с уведомлений. Одна отключённая категория = 40 минут в день возвращено.'},

{day:3,phase:'🚀 Подготовка',title:'Утро без телефона',subtitle:'Первые 30 минут',emoji:'🌅',
theory:'**Первые 30 минут после пробуждения — программирование всего дня.** Если ты берёшь телефон сразу — ты в чужом сценарии. Твоё внимание продано компании. Утро без телефона = ты в своём сценарии. 500 мл воды. Свет. Душ. Движение. Тишина. Дневник.',
science:'UBC 2021: студенты, не смотревшие телефон 30 мин утром, показали +21% продуктивности, -15% тревожности, +12% удовлетворённости днём.',
do:['Телефон ночью в другой комнате','Будильник отдельно','Проснулся → 500 мл воды','10-20 минут солнечного света','Душ (можно холодный)','Лёгкая зарядка 5-10 мин','Завтрак без экрана','Только потом — телефон'],
effect:'+21% продуктивности, -15% тревоги, ясная голова',
tips:'Первые 3 дня будет тяжело. Дальше — не захочешь возвращаться.'},

{day:4,phase:'🚀 Подготовка',title:'Составь манифест',subtitle:'Зачем тебе это',emoji:'📜',
theory:'**Без смысла не будет результата.** Запиши: от чего откажешься, что получишь, как изменится жизнь через 62 дня. Манифест должен быть конкретным: «+2 часа в день на чтение = +10 книг за год», «-30% экрана = лучше сон». Перечитаешь этот текст 20 раз за курс.',
science:'Гейл Мэтьюс: люди, записавшие цели, достигают на 42% чаще. Публичное обязательство = +65% к успеху.',
do:['Запиши 3 причины «зачем»','Опиши жизнь через 62 дня','Опиши как избавишься от соблазнов','Покажи манифест близкому','Повесь на видное место','Перечитывай каждое утро'],
effect:'Ясность намерения, +65% успеха',
tips:'Не «хочу меньше экрана», а «буду читать 20 минут перед сном вместо ленты».'},

{day:5,phase:'🚀 Подготовка',title:'Первая цифровая суббота',subtitle:'Пробный день',emoji:'🧪',
theory:'**Проверка без подготовки.** Проведи один день по новым правилам: утро без телефона, 30 минут лимита на соцсети, час цифрового детокса. Цель — увидеть, где именно ты сорвёшься. Это не провал, это карта триггеров.',
science:'Экспериментальная проверка гипотез: 1 день = понимание паттернов. Скука → проверка телефона = базовый рефлекс.',
do:['Лимит соцсетей 30 мин','Час без экрана днём','Еда без телефона','Прогулка 30 мин без телефона','Запиши: где сорвался и почему'],
effect:'Карта триггеров, план на 62 дня',
tips:'Срыв — это данные. Записывай всё: время, триггер, эмоцию.'},

{day:6,phase:'🚀 Подготовка',title:'Триггеры',subtitle:'Что запускает руку',emoji:'🎯',
theory:'**Скука, тревога, одиночество, усталость, стресс — 5 главных триггеров.** Телефон — это костыль. Мы проверяем ленту, чтобы не чувствовать пустоту. Распознай свои триггеры и придумай замену: скука → книга, тревога → дыхание 4-7-8, усталость → 10 мин сна, одиночество → звонок другу.',
science:'Нейроученый Джадсон Брюер: осознание триггера снижает реакцию на 50%. Без осознания — 96 проверок телефона в день.',
do:['Запиши 5 триггеров','Придумай замену на каждый','Повесь список','Проверь на себе сегодня'],
effect:'-50% импульсивных проверок',
tips:'Скука — не проблема. Скука — трамплин для креатива.'},

{day:7,phase:'🚀 Подготовка',title:'Ревью недели 1',subtitle:'Первые итоги',emoji:'📊',
theory:'**Что сработало, что нет.** Критически важный шаг. Без ревью ты просто «что-то делаешь». Ревью превращает эксперимент в стратегию. Пройди по всем дням, отметь что зашло, что тяжело, что менять.',
science:'Harvard Business School: люди, делающие ревью каждую неделю, показывают +23% результатов через год.',
do:['Screen Time за неделю','Сравни с прошлой','3 победы','3 трудности','1 урок','План на неделю 2','Награда за неделю'],
effect:'+23% результата, мотивация',
tips:'Награда — не телефон. Что-то реальное: хорошая еда, прогулка, кино.'},

/* ============ ФАЗА 2: ДЕТОКС (дни 8-21) ============ */
{day:8,phase:'📅 Детокс',title:'Уведомления в ноль',subtitle:'Только люди',emoji:'🔔',
theory:'**Каждое уведомление = -23 минуты концентрации.** Одно уведомление — короткое, но мозгу нужно 23 минуты, чтобы вернуться в состояние глубокой работы. 46 уведомлений в день = ты никогда не в потоке. Отключи всё. Оставь только звонки от людей.',
science:'UC Irvine: 46 пушей в день = потеря 17.5 часов продуктивности в неделю. Средний офисный работник проверяет телефон каждые 12 минут.',
do:['Настройки → Уведомления','Отключи всё, кроме звонков','Отключи вибрацию и бейджи','Проверь через день: что вернулось','Только от людей, не приложений'],
effect:'+2-3 ч продуктивности в день',
tips:'Если уведомление не от человека — оно не срочное.'},

{day:9,phase:'📅 Детокс',title:'Соцсети 30 минут',subtitle:'Лимит',emoji:'📱',
theory:'**30 минут — достаточно.** Мы не запрещаем, мы ограничиваем. Достаточно 30 минут в день, чтобы оставаться в курсе. Всё остальное — токсичная лента. Установи лимит до 18:00 (не позже — иначе мешает сну). В перерывах, не в кровати.',
science:'Университет Пенсильвании: снижение соцсетей до 30 мин/день = -25% тревожности, -20% депрессии за 3 недели.',
do:['Лимит 30 мин','До 18:00','Блокировка после лимита','Не в кровати','В перерывах (не в потоке)'],
effect:'-2 ч экрана в день',
tips:'Начни с 60 минут. Следующая неделя — 30.'},

{day:10,phase:'📅 Детокс',title:'Чёрно-белый экран',subtitle:'Скучный телефон',emoji:'⚫',
theory:'**Цвет — магнит.** Яркие цвета лент, значков, уведомлений — это не украшение, это приманка. В чёрно-белом режиме телефон становится скучным инструментом. Проверь на себе: 90% людей снимают ч/б через неделю — потому что меньше тянут телефон.',
science:'Konstanz University: ч/б режим = -50% соцсетей, -37% общего экрана за 2 недели.',
do:['iPhone: Спец. возможности → Экран','Android: Цифровое благополучие','Включи «Оттенки серого»','Держи 24 ч','Заметь: стало ли скучнее'],
effect:'-50% соцсетей',
tips:'Через неделю — вернуть цвета только для фото. Ленты оставить серыми.'},

{day:11,phase:'📅 Детокс',title:'День без соцсетей',subtitle:'24 часа',emoji:'🚫',
theory:'**Проверка на прочность.** Скука → тревога → облегчение → свобода. Это путь. Первые 2 часа будет «ломка». Потом — невероятная ясность. Это дофаминовое голодание. Рецепторы начинают восстанавливаться через 24-72 часа.',
science:'Дофаминовое голодание: снижение стимулов → повышение чувствительности к простым радостям (еда, природа, общение) на 30-40%.',
do:['Выходной день','Удали соцсети на день','Звонки оставь (это другое)','Спорт, книга, прогулка','Ревью вечером'],
effect:'+25% чувствительности к простому',
tips:'Предупреди близких: «Я сегодня без соцсетей».'},

{day:12,phase:'📅 Детокс',title:'Глубокий час',subtitle:'90 минут Deep Work',emoji:'🎯',
theory:'**90 минут — суперсила.** Это ультрадианный ритм мозга. 90 минут Deep Work = 3 часа обычной работы по объёму. Утром мозг чист — используй это. Авиарежим. Одна задача. Телефон в другой комнате.',
science:'Кэл Ньюпорт: ×3 объём кода, ×4 меньше багов. Deep Work в 2 раза продуктивнее «обычной» работы.',
do:['Одна задача','Авиарежим 90 минут','Телефон вне комнаты','Таймер','Перерыв 15 мин после'],
effect:'×3 к результату',
tips:'Утро — лучшее время для Deep Work.'},

{day:13,phase:'📅 Детокс',title:'Вечер без экрана',subtitle:'2 часа',emoji:'🌙',
theory:'**Синий свет = остановка мелатонина.** Экран за 2 часа до сна = -30 минут глубокого сна. Мелатонин не вырабатывается. Сон становится поверхностным. Утром — разбитость. Решение: тёплый свет, книга, душ, медитация.',
science:'Harvard: -30 мин глубокого сна при экране перед сном. Мелатонин подавляется на 50% в течение 60 минут после использования.',
do:['2 часа без экрана','Тёплый свет (2700K)','Душ','Книга 30 мин','Медитация 10 мин','Сон до 23:00'],
effect:'+1 час глубокого сна',
tips:'Заведи бумажную книгу — она справится лучше.'},

{day:14,phase:'📅 Детокс',title:'Ревью недели 2',subtitle:'Половина пути',emoji:'📊',
theory:'**2 недели — большая веха.** Половина курса пройдена. Смотри на метрики без эмоций. Что сработало? Что нет? Какие выводы делаешь? Как наградишь себя?',
science:'14 дней = формирование первого устойчивого паттерна. Дофаминовые рецепторы начинают восстанавливаться. Экран -30%, сон +45 мин, тревожность -25%.',
do:['Сравни Screen Time','3 победы','3 сложности','1 паттерн','План на неделю 3','Награда'],
effect:'+Мотивация, +устойчивость',
tips:'Награда не телефон. Что-то реальное.'},

{day:15,phase:'📅 Детокс',title:'Приложение вместо ленты',subtitle:'Полезное',emoji:'📚',
theory:'**Замени бессмысленное полезным.** Удали 5 бесполезных приложений, установи 1 полезное: язык, книга, медитация, Anki. Одно приложение на главном экране. Пользуйся 15-20 минут в день. Это не «борьба с лентой», это замена.',
science:'Дофамин из полезного — тот же нейромедиатор, но с долгосрочным эффектом. Через 21 день — автоматизм.',
do:['1 полезное приложение','На главный экран','15 мин/день','Заметка: зачем оно','Оценка через неделю'],
effect:'+Знания, +удовлетворение',
tips:'Только ОДНО. Не превращай в новую ленту.'},

{day:16,phase:'📅 Детокс',title:'Хобби 30 минут',subtitle:'Руками',emoji:'🎨',
theory:'**Руками — лекарство.** Когда руки заняты — мозг отдыхает. Вязание, рисование, готовка, сборка — любое. Мелкая моторика улучшает настроение, снижает тревожность, тренирует концентрацию.',
science:'Otago University: +30% удовлетворённости, -20% тревожности при ручном хобби 30 мин/день.',
do:['Выбери хобби','30 мин в день','Без телефона','Одно время','Показывай результаты'],
effect:'+30% удовлетворённости',
tips:'Не дорогое. Спицы, карандаш, мука — уже достаточно.'},

{day:17,phase:'📅 Детокс',title:'Спорт без наушников',subtitle:'Связь с телом',emoji:'🏃',
theory:'**Медитация в движении.** Бег, ходьба, плавание — без музыки, подкастов, сериалов. Просто дыхание, тело, шаги, мир вокруг. Это форма mindfulness. Мозг расслабляется.',
science:'BJSM: -20% усталости, +15% времени тренировки. Слушание тела = лучше управление пульсом.',
do:['30 мин тренировки','Без наушников','Дыхание','Тело','Растяжка после'],
effect:'+Выносливость, +присутствие',
tips:'Слушай шаги. Слушай дыхание. Слушай мир.'},

{day:18,phase:'📅 Детокс',title:'Живое общение',subtitle:'Звонок вместо чата',emoji:'👥',
theory:'**Голос = эмоции.** Переписка плоска. Мы теряем 60% информации: интонацию, паузы, смех, дыхание. Позвони 2 близким. Просто так. 15 минут. Это окситоцин, связь, поддержка.',
science:'MIT: голос +40% понятности, -50% времени. Звонок родителям = +25% к настроению в течение дня.',
do:['2 звонка','15 мин минимум','Слушай 70%','Запиши: что нового узнал'],
effect:'+Связь, +окситоцин',
tips:'Родителям — обязательно. Они ждут.'},

{day:19,phase:'📅 Детокс',title:'Природа 1 час',subtitle:'Кортизол вниз',emoji:'🌲',
theory:'**Бесплатное лекарство.** 1 час на природе = -16% кортизола, -25% тревожности, +60% креатива. Лес, парк, река — не важно. Без телефона. Без спешки. Смотри, слушай, дыши.',
science:'Michigan: -16% кортизола, -25% тревожности, -10% пульса за 1 час на природе.',
do:['1 час','Телефон в сумке','Без спешки','Деревья, звуки, воздух','5 новых деталей'],
effect:'-16% кортизола',
tips:'Не пробежка. Прогулка. Медленно.'},

{day:20,phase:'📅 Детокс',title:'Дневник детокса',subtitle:'Рефлексия',emoji:'📓',
theory:'**Написание открывает.** Что изменилось? Что радует? Что трудно? Что уходит, а что приходит? Письмо — это разговор с собой. Без правок. Без осуждения. Просто выгрузи.',
science:'University of Texas: +25% ясности, -20% тревожности, +30% самосознания после 20 минут дневника.',
do:['3 победы','3 трудности','1 открытие','1 вопрос','1 обещание себе'],
effect:'+Ясность, -тревога',
tips:'От руки. Ручка медленнее — мозг успевает думать.'},

{day:21,phase:'📅 Детокс',title:'Ревью недели 3',subtitle:'Перелом',emoji:'📊',
theory:'**21 день — критическая точка.** По исследованиям, именно сейчас привычки начинают закрепляться. Что было легко? Что не зашло? Не расслабляйся — впереди самые важные недели.',
science:'Дофаминовые рецепторы: -40% экрана, +1 ч сна, +25% к продуктивности. Привычки переходят в автоматические.',
do:['Сравни Screen Time','3 победы','3 трудности','Что закрепилось','План на неделю 4','Награда'],
effect:'+Мотивация, +закрепление',
tips:'Дальше будет легче. Но самое важное — не потерять темп.'},

/* ============ ФАЗА 3: УКРЕПЛЕНИЕ (дни 22-42) ============ */
{day:22,phase:'💎 Укрепление',title:'Утренний ритуал',subtitle:'Фиксация',emoji:'🌅',
theory:'**Утро определяет день.** Создай свой ритуал: встал сразу, 500 мл воды, 10 мин света, душ, зарядка, завтрак без экрана, 5 мин планирования. Это твоя защита от чужого внимания.',
science:'Duke: +30% продуктивности при утреннем ритуале. Автоматизм экономит 2-3 часа в день.',
do:['Встал сразу','500 мл воды','10 мин света','Душ','Зарядка 5 мин','Завтрак без экрана','5 мин план'],
effect:'+30% продуктивности',
tips:'Одно время. Каждый день. Даже выходные.'},

{day:23,phase:'💎 Укрепление',title:'Работа без отвлечений',subtitle:'90 мин',emoji:'🎯',
theory:'**90 минут — ультрадианный цикл.** После 90 мин концентрации мозгу нужен перерыв 15 мин. Работай 90, отдыхай 15. Не чаты, не почта, не ленты — одна задача.',
science:'×3 продуктивности, +качество работы, -усталость к вечеру.',
do:['Одна задача','Авиарежим 90 мин','Телефон вне комнаты','Таймер 90','Перерыв 15'],
effect:'×3 к результату',
tips:'Утро — лучшее время. После 16:00 — спад.'},

{day:24,phase:'💎 Укрепление',title:'Вечерний ритуал',subtitle:'Подготовка ко сну',emoji:'🌙',
theory:'**Вечер = подготовка к следующему дню.** Тёплый свет с 19:00. Телефон вне спальни с 21:00. Книга 30 мин. Душ. Медитация 10 мин. Сон до 23:00. Завтрашний ты скажет спасибо.',
science:'+1 час глубокого сна. Мелатонин восстанавливается. Утренняя разбитость уходит на 80%.',
do:['Тёплый свет 19:00','Телефон вне 21:00','Книга 30 мин','Душ','Медитация 10 мин','Сон до 23:00'],
effect:'+1 час глубокого сна',
tips:'Одно время. Каждый вечер. Даже пятница.'},

{day:25,phase:'💎 Укрепление',title:'Один день офлайн',subtitle:'24 часа',emoji:'🏕',
theory:'**Полностью офлайн.** Не «без соцсетей», а без интернета целиком. Выходной. Звонки можно. GPS можно. Спроси: «что бы я делал, если бы не было сети?» Это возвращает тебя к себе.',
science:'+25% продуктивности на следующий день, +креатив, -30% тревожности.',
do:['Выходной','Без интернета','Звонки можно','Спорт, прогулка','Книга','Ревью вечером'],
effect:'+25% к энергии',
tips:'Планируй заранее. Скажи близким.'},

{day:26,phase:'💎 Укрепление',title:'Дофаминовое голодание',subtitle:'4 часа',emoji:'🧘',
theory:'**Отдых дофаминовой системы.** 4 часа без стимулов: телефон в комнате, тишина, скука. Первые 30 мин тяжело. Потом — невероятная ясность и радость от простого. Это восстанавливает рецепторы.',
science:'+Чувствительность к дофамину, +радость от простого, -тяга к соцсетям на 2-3 дня.',
do:['4 часа без стимулов','Телефон в комнате','Прогулка/медитация','Скучай (это важно)','Записывай мысли'],
effect:'+Радость от простого',
tips:'Раз в неделю. Полдня. Лучше утром.'},

{day:27,phase:'💎 Укрепление',title:'Замена ленты на смысл',subtitle:'Что вместо?',emoji:'💡',
theory:'**Пустоту заполни смыслом.** Мы проверяем телефон, чтобы не чувствовать пустоту. Заполни её настоящим: проект, книга, спорт, творчество, отношения. Что заменит ленту в твоей жизни?',
science:'University of Pennsylvania: -30% депрессии, -25% одиночества при заполнении пустоты смыслом.',
do:['5 причин, зачем ты живёшь','5 занятий, которые любишь','Свяжи их','Ритуал на неделю','Отслеживай'],
effect:'+Смысл, +направление',
tips:'Найди своё. Не копируй чужое.'},

{day:28,phase:'💎 Укрепление',title:'Метрики месяца',subtitle:'Цифры не врут',emoji:'📊',
theory:'**Цифры не врут.** Сравни первый день и сегодня. Screen Time? Сон? Настроение? Энергия? Что реально изменилось? Цифры + ощущения = полная картина.',
science:'-40% экрана, +1.5 ч сна, ×2 продуктивность, -30% тревожности — средний результат за месяц детокса.',
do:['Screen Time за месяц','Сравни с днём 1','Цифры','Ощущения','Покажи близкому','Награда'],
effect:'+Мотивация ×2',
tips:'Скриншоты — лучший аргумент для скептиков.'},

{day:29,phase:'💎 Укрепление',title:'План на будущее',subtitle:'Как сохранить',emoji:'📋',
theory:'**Привычки остаются.** Что ты сохранишь навсегда? Что вернёшь? Что уберёшь окончательно? Нужен конкретный план: 3 правила, 3 лимита, 3 ритуала, 3 сигнала срыва. Что делать при откате?',
science:'80% сохраняют результат с планом, 20% без. План = разница между экспериментом и изменением.',
do:['3 правила','3 лимита','3 ритуала','3 сигнала срыва','План восстановления'],
effect:'80% успеха',
tips:'Конкретно. С датами. С правилами.'},

{day:30,phase:'🎉 Месяц!',title:'Первый месяц — готово!',subtitle:'Поздравляю',emoji:'🏆',
theory:'**30 дней. Это уже не эксперимент — это ты.** Ты не тот, кто был в день 1. У тебя другая жизнь, другое внимание, другая энергия. Впереди ещё 32 дня — но это уже не «испытание», а «стиль».',
science:'+30% продуктивности, +1.5 ч сна, -30% тревожности, ×2 ясность. Ты прошёл 48% курса.',
do:['Ревью месяца','Награда','Расскажи близкому','Продолжай','Ревью через неделю','Дневник'],
effect:'Новая жизнь',
tips:'Один месяц — это уже не срок, это характер.'},

{day:31,phase:'💎 Укрепление',title:'Возврат к себе',subtitle:'Что было до',emoji:'🧭',
theory:'**Вспомни, кем ты был до курса.** Что ты делал вечерами? О чём думал? Как принимал решения? Ты не «стал продуктивнее» — ты вернулся к себе. Тем, кем был до того, как экран забрал твоё внимание.',
science:'Возврат к «базовой линии»: у людей без цифровой зависимости дофаминовые рецепторы на 30% чувствительнее к обычной жизни.',
do:['Запиши: как было','Как стало','3 главные перемены','3 благодарности себе','Новый план на месяц'],
effect:'+Идентичность',
tips:'Ты не «на диете от экрана». Ты просто живёшь.'},

{day:32,phase:'🔒 Интеграция',title:'Цифровой минимализм',subtitle:'Кэл Ньюпорт',emoji:'📱',
theory:'**Не запрет, а выбор.** Цифровой минимализм — это когда ты используешь технологии как инструмент, а не они тебя. 10 приложений на телефоне. Одно главное. Одно вторичное. Остальное — по необходимости.',
science:'Кэл Ньюпорт: цифровые минималисты работают на 40% продуктивнее, +30% удовлетворённости жизнью.',
do:['Оставь 10 приложений','Одно главное','Одно вторичное','Остальное — по делу','Проверь через неделю'],
effect:'+Осознанность',
tips:'Приложения — инструменты, не друзья.'},

{day:33,phase:'🔒 Интеграция',title:'Цифровая гигиена',subtitle:'Правила',emoji:'🧼',
theory:'**Правила для жизни.** Телефон не в спальне. Не в ванной. Не за столом. Не в компании друзей. Утро до 10:00 — без экрана. Вечер с 21:00 — без экрана. Это не диета, это уважение к себе.',
science:'-50% экрана, +2 ч сна, +1 ч общения с близкими.',
do:['Телефон не в спальне','Не в ванной','Не за столом','Утро до 10:00 без','Вечер с 21:00 без'],
effect:'+Уважение к себе',
tips:'Правила — на холодильник. Чтобы видеть.'},

{day:34,phase:'🔒 Интеграция',title:'Живое общение',subtitle:'Встречи',emoji:'👥',
theory:'**Замени переписку встречами.** Кофе с другом > 100 сообщений. Свидание > сериал вместе по телефону. Живое общение = настоящий окситоцин, а не имитация.',
science:'+25% к настроению, +40% к глубине связей, -30% к одиночеству.',
do:['2 живых встречи/нед','Без телефона','Слушай 70%','Не фотографируй еду'],
effect:'+Настоящие связи',
tips:'Смотри в глаза. Не в телефон.'},

{day:35,phase:'🔒 Интеграция',title:'Простое удовольствие',subtitle:'Заново учимся',emoji:'☕',
theory:'**Простое — снова приятно.** Кофе в тишине. Прогулка. Книга. Музыка. Когда дофаминовые рецепторы восстанавливаются, ты снова чувствуешь радость от обычных вещей. Это не «маленькие радости», это норма.',
science:'Через месяц детокса уровень удовольствия от простого возвращается на 30-40% выше нормы.',
do:['1 простое удовольствие/день','Без телефона','Смакуй медленно','Запиши ощущение'],
effect:'+Радость от жизни',
tips:'Замечай. Не «проглатывай».'},

{day:36,phase:'🔒 Интеграция',title:'Творчество без стимулов',subtitle:'Скука → идеи',emoji:'🎨',
theory:'**Скука = начало творчества.** Когда нет стимулов, мозг начинает выдумывать. DMN (default mode network) активируется. Именно там рождаются идеи. Не заполняй пустоту лентой — дай ей место.',
science:'+60% креатива при отсутствии стимулов, +40% к инсайтам.',
do:['30 мин скуки/день','Без телефона','Идеи на бумагу','Прогулка без подкаста'],
effect:'×1.6 креатива',
tips:'Скука — трамплин.'},

{day:37,phase:'🔒 Интеграция',title:'Спорт как привычка',subtitle:'Автоматизм',emoji:'🏋️',
theory:'**Тело как фундамент.** 150 мин кардио в неделю + 2 силовые. Это не «для фигуры», это для мозга: BDNF, дофамин, серотонин, эндорфины. Спорт = дешёвый антидепрессант.',
science:'+BDNF на 30%, +дофамин на 15-20%, -кортизол на 20%, +настроение на 30%.',
do:['150 мин кардио/нед','2 силовые/нед','Разные активности','Одно время'],
effect:'+Мозг, +тело',
tips:'Утро — лучше. Вечер — тоже ок.'},

{day:38,phase:'🔒 Интеграция',title:'Питание как топливо',subtitle:'Меньше сахара',emoji:'🥗',
theory:'**Еда = топливо для мозга.** Сахар и быстрые углеводы → скачки глюкозы → туман, усталость, раздражительность. Белок, овощи, жиры → стабильная энергия. Это не диета, это топливо.',
science:'-сахар → +энергия, +фокус, +настроение, -тревожность через 2 недели.',
do:['500 г овощей/день','1.6 г белка/кг','Меньше сахара','Больше воды','Без перекусов на ходу'],
effect:'+Энергия, +фокус',
tips:'Овощи — первое. Сахар — последнее.'},

{day:39,phase:'🔒 Интеграция',title:'Сон как приоритет',subtitle:'7-9 часов',emoji:'😴',
theory:'**Сон — основа всего.** Не «роскошь», а необходимость. 7-9 часов. Режим. Темнота. 18-20°C. Без экрана. Это не для «хорошего самочувствия», это для мозга: консолидация, восстановление, гормоны.',
science:'+40% к когнитивным функциям, +30% к настроению, -30% к тревожности, +25% к продуктивности.',
do:['7-9 часов','Одно время','Тёмная спальня','Прохладно','Без экрана за 2 ч'],
effect:'+40% к работе мозга',
tips:'Сон — не «после всего». Сон — до всего.'},

{day:40,phase:'🔒 Интеграция',title:'Рефлексия недели',subtitle:'Что работает',emoji:'📓',
theory:'**Рефлексия = ускорение в 2 раза.** Что зашло? Что нет? Что сохранить? Что убрать? Каждую неделю — 30 минут ревью. Это делает тебя в 2 раза быстрее.',
science:'+23% к результатам, +40% к самоосознанию при регулярной рефлексии.',
do:['30 мин ревью','3 победы','3 трудности','1 урок','3 цели на неделю'],
effect:'+Рост ×2',
tips:'Воскресенье вечер. Не откладывай.'},

{day:41,phase:'🔒 Интеграция',title:'Окружение',subtitle:'Что вокруг тебя',emoji:'🌍',
theory:'**Окружение формирует мышление.** Убери из дома 3 предмета, которые провоцируют. Добавь 3, которые вдохновляют. Книга на видном месте. Скакалка. Гантели. Ничего, что тянет в ленту.',
science:'Джим Рон: «Ты — среднее из пяти людей вокруг тебя». Среда решает на 50%.',
do:['Убери 3 раздражителя','Добавь 3 помощника','Переставь телефон','Книга на видное'],
effect:'+Мотивация',
tips:'Среда > воля.'},

{day:42,phase:'🔒 Интеграция',title:'Половина+ пройдено',subtitle:'Осталось 20',emoji:'📊',
theory:'**42 из 62 — 68% пути.** Ты уже другой человек. Ревью накопившихся привычек. Сравни цифры месяца 1 и месяца 1.5. Что изменилось?',
science:'+50% к устойчивости привычек, +40% к автоматизму. Ты почти не думаешь о детоксе — он стал тобой.',
do:['Screen Time за месяц','Сравни','3 победы','3 сложности','План на финал'],
effect:'+Устойчивость',
tips:'Осталось самое интересное — интеграция в новую жизнь.'},

/* ============ ФАЗА 4: ЖИЗНЬ (дни 43-62) ============ */
{day:43,phase:'🚀 Жизнь',title:'Свой день',subtitle:'Без правил',emoji:'📅',
theory:'**Создай свой идеальный день.** Не по шаблону. Не по курсу. По себе. Что тебе важно? Утро? Работа? Отдых? Люди? Творчество? Опиши 10 пунктов, которые хочется делать каждый день.',
science:'+30% к удовлетворённости при проживании «своего дня», а не чужого.',
do:['Опиши идеальный день','10 пунктов','Проверь на себе','Корректируй'],
effect:'+Свой путь',
tips:'Не идеальный по Instagram. Идеальный для тебя.'},

{day:44,phase:'🚀 Жизнь',title:'Границы с телефоном',subtitle:'Правила навсегда',emoji:'🛡',
theory:'**Три главных правила.** Например: телефон не в спальне, не за едой, не на первой час после пробуждения. Эти три правила — на всю жизнь. Не «на курс». Навсегда.',
science:'3 устойчивых правила = -50% экрана пожизненно.',
do:['3 правила','Запиши','Повесь','Расскажи близким'],
effect:'-50% экрана навсегда',
tips:'3 правила сильнее, чем 30.'},

{day:45,phase:'🚀 Жизнь',title:'Помоги другому',subtitle:'Передай опыт',emoji:'🤝',
theory:'**Объясни кому-то, что ты понял.** Не навязывай. Не поучай. Просто расскажи, как тебе помогло. Когда объясняешь — закрепляешь сам. Когда делишься — растёт ценность.',
science:'Feynman technique: объяснение = ×3 к пониманию. Помощь другому = +25% к счастью.',
do:['1 человек','Расскажи','Не навязывай','Будь примером'],
effect:'+Смысл, +закрепление',
tips:'Не проповедь. Опыт.'},

{day:46,phase:'🚀 Жизнь',title:'Планы на год',subtitle:'Без телефона',emoji:'🎯',
theory:'**Сколько времени вернул?** -2 ч/день = 730 часов в год. Это 18 рабочих недель. Что ты создашь за это время? Напиши 3 больших цели. С конкретным планом.',
science:'Записанные цели +42% к достижению. Публичные +65%. С планом +80%.',
do:['3 больших цели','SMART формат','3 шага на каждый','Дедлайн','Расскажи близкому'],
effect:'+42-80% к результату',
tips:'Год — это 730 часов, которые ты вернул.'},

{day:47,phase:'🚀 Жизнь',title:'Свои ритуалы',subtitle:'Утро и вечер',emoji:'🌅',
theory:'**Ритуалы — каркас дня.** Утренний: вода, свет, душ, движение, план. Вечерний: тёплый свет, книга, дневник, медитация. Не 10 пунктов — 3-4 максимум. Простые. Но каждый день.',
science:'Duke: +30% продуктивности с ритуалами. Автоматизм экономит 2-3 часа в день.',
do:['Утренний ритуал 20 мин','Вечерний ритуал 30 мин','Одно время','Каждый день'],
effect:'+30% продуктивности',
tips:'Простые. Не более 4 пунктов.'},

{day:48,phase:'🚀 Жизнь',title:'Отношения без экрана',subtitle:'Свидания и друзья',emoji:'💑',
theory:'**Настоящее общение — без телефона.** На свидании — только вы. С друзьями — только вы. За столом — только вы. Это правило, а не «идеально». Убирай телефон. Смотри в глаза. Слушай.',
science:'+40% к глубине отношений, +50% к эмпатии, -30% к конфликтам.',
do:['На свидании без телефона','С друзьями без','За столом без','Смотри в глаза'],
effect:'+Настоящие связи',
tips:'Уважение к человеку — убрать телефон.'},

{day:49,phase:'🚀 Жизнь',title:'Спорт как основа',subtitle:'Уже привычка',emoji:'🏋️',
theory:'**Спорт — не «надо», а «хочу».** Если ещё не так — добавь удовольствие: любимый вид, музыка, партнёр. Спорт встроен в день. Это уже не «дисциплина», а жизнь.',
science:'+30% к энергии, +40% к настроению, +25% к продолжительности жизни.',
do:['4 тренировки/нед','Разные виды','С партнёром','Одно время'],
effect:'+Мозг, +тело, +жизнь',
tips:'Удовольствие > дисциплина.'},

{day:50,phase:'🚀 Жизнь',title:'Питание как ритуал',subtitle:'Осознанно',emoji:'🍽',
theory:'**Еда без экрана.** 20+ минут. Смакуй. Замечай вкус. Насыщение. Это не «диета», это уважение к еде и телу. Еда = топливо + удовольствие.',
science:'-25% калорий при еде без телефона, +40% к насыщению, -30% к перекусам.',
do:['Все приёмы без телефона','20+ минут','Смакуй','Замечай насыщение'],
effect:'+Пищеварение, -переедание',
tips:'Телефон в комнате, пока ешь.'},

{day:51,phase:'🚀 Жизнь',title:'Благодарность',subtitle:'Тренировка',emoji:'🙏',
theory:'**3 благодарности каждый день.** Утром и вечером. Конкретно: не «семья», а «мама позвонила», не «работа», а «сделал сложный отчёт». Благодарность = +25% к счастью.',
science:'Emmons 2003: +25% к счастью, -30% к депрессии за 10 недель.',
do:['3 благодарности утром','3 вечером','Конкретно','Запиши'],
effect:'+25% счастья',
tips:'Конкретное > общее.'},

{day:52,phase:'🚀 Жизнь',title:'Медитация 10 мин',subtitle:'Каждый день',emoji:'🧘',
theory:'**10 минут тишины.** Не «для духовности», а для мозга. MBSR 8 недель = +плотность коры, -тревожность, +фокус. Каждый день. Одно время. Не пропускай.',
science:'+20% к концентрации, -30% к тревожности, +40% к спокойствию за 8 недель.',
do:['10 мин','Утром','Одно время','Каждый день'],
effect:'+Спокойствие, +фокус',
tips:'Даже 5 минут = лучше, чем 0.'},

{day:53,phase:'🚀 Жизнь',title:'Помощь другим',subtitle:'Смысл',emoji:'❤️',
theory:'**Помощь = смысл жизни.** Волонтёрство, менторство, донат, простое доброе слово. Мозг реагирует на помощь так же, как на еду и секс — дофамином. Только эффект длится дольше.',
science:'+25% к счастью, +40% к смыслу, +30% к продолжительности жизни при регулярной помощи.',
do:['1 акт помощи/нед','Бескорыстно','Не хвастайся','Разные формы'],
effect:'+Смысл, +счастье',
tips:'Даяние — лучшее лекарство.'},

{day:54,phase:'🚀 Жизнь',title:'Творчество',subtitle:'Каждый день',emoji:'🎨',
theory:'**30 минут творчества.** Рисование, музыка, письмо, готовка, ремонт — что угодно руками. Мозг работает в потоке. Это твоя DMN. Это твоя свобода.',
science:'+40% к креативу, +30% к настроению, -20% к тревожности.',
do:['30 мин','Одно время','Без телефона','Показывай результаты'],
effect:'+Радость, +креатив',
tips:'Не для «результата». Для процесса.'},

{day:55,phase:'🚀 Жизнь',title:'Учёба всю жизнь',subtitle:'Обучение',emoji:'📚',
theory:'**Учись постоянно.** Новая тема каждый месяц. Курс. Книга. Язык. Что угодно. Мозг пластичен, но требует нагрузки. 30 мин/день — этого достаточно.',
science:'+40% к нейропластичности, +30% к памяти, +50% к продолжительности когнитивной молодости.',
do:['1 новая тема/мес','Курс','Книга','Язык','30 мин/день'],
effect:'+Молодой мозг',
tips:'Не заканчивай. Никогда.'},

{day:56,phase:'🚀 Жизнь',title:'Природа каждую неделю',subtitle:'1 час',emoji:'🌲',
theory:'**Природа — лекарство.** 1 час в неделю минимум. Лес, парк, река. Без телефона. Просто смотри, слушай, дыши. Кортизол падает. Мозг восстанавливается.',
science:'-16% к кортизолу, -25% к тревожности, +60% к креативу.',
do:['1 час/нед','Без телефона','Лес, парк, река','Слушай, смотри, дыши'],
effect:'-Стресс, +творчество',
tips:'Не пробежка. Прогулка. Медленно.'},

{day:57,phase:'🚀 Жизнь',title:'Ревью месяца 2',subtitle:'Итоги',emoji:'📊',
theory:'**Что изменилось за 2 месяца.** Сравни месяц 1, месяц 2 и день 1. Прогресс линейный или нет? Где плато? Где рост? Что менять?',
science:'+40% к устойчивости привычек. Детокс стал образом жизни, не экспериментом.',
do:['Screen Time','Сравни 3 точки','3 победы','3 сложности','План на финал'],
effect:'+Ясность',
tips:'Не просто цифры. Ощущения важнее.'},

{day:58,phase:'🚀 Жизнь',title:'Планы на будущее',subtitle:'5 лет',emoji:'🔭',
theory:'**Куда идёшь через 5 лет?** Не «хочу быть счастливым», а конкретно: работа, дом, тело, отношения, деньги, творчество. Напиши 5-летний план. С шагами на год.',
science:'Записанные 5-летние планы +42% к достижению. С конкретными шагами +80%.',
do:['5 лет видение','Работа','Дом','Тело','Отношения','Деньги','Творчество','Шаги на год'],
effect:'+Направление',
tips:'Общее видение + конкретные шаги.'},

{day:59,phase:'🚀 Жизнь',title:'Твой манифест v2',subtitle:'Что изменилось',emoji:'📜',
theory:'**Сравни манифест дня 4 и сейчас.** Что сбылось? Что изменилось? Что нового понял? Это документ твоего роста. Перечитай и дополни.',
science:'Рефлексия = +40% к самоосознанию, +30% к самосостраданию.',
do:['Перечитай манифест v1','3 что сбылось','3 новых пункта','Манифест v2','Повесь'],
effect:'+Самоосознание',
tips:'Документ живой. Меняется с тобой.'},

{day:60,phase:'🚀 Жизнь',title:'День 60: жизнь без курса',subtitle:'Всё своё',emoji:'🏆',
theory:'**60 дней. Ты сам — курс.** Утренний ритуал. Спорт. Питание. Сон. Творчество. Помощь. Природа. Дневник. Медитация. Всё это — твоя жизнь. Не «дисциплина», а «стиль».',
science:'60 дней = полное переформирование привычек. Уровень автоматизма 85%.',
do:['Живи как живёшь','Ревью','Дневник','Награда'],
effect:'Новая жизнь',
tips:'Осталось 2 дня — и ты сам.'},

{day:61,phase:'🚀 Жизнь',title:'Передача опыта',subtitle:'Помоги другому',emoji:'🎓',
theory:'**Обучи кого-то.** Не проповедь. Мягко. Покажи пример. Объясни, что помогло. Это закрепит твоё обучение и поможет другому.',
science:'Feynman + помощь другому = ×3 к закреплению + +25% к счастью.',
do:['1 человек','Расскажи мягко','Не навязывай','Покажи примером'],
effect:'+Смысл, +закрепление',
tips:'Не «брось телефон». А «смотри, что у меня изменилось».'},

{day:62,phase:'🎉 Финал',title:'Свобода',subtitle:'Ты справился!',emoji:'🏆',
theory:'**62 дня.** Это не финал — это начало. Ты вернул себе внимание, время, сон, отношения, тело. Ты стал собой. Это была не «диета от телефона» — это возвращение к жизни.',
science:'+60% продуктивности, +2 ч сна, -40% тревожности, ×2 ясность, ×3 отношения. Ты прошёл курс полностью.',
do:['Ревью всех 62 дней','Награда','Расскажи близким','Продолжай','Ревью через месяц','Ревью через год'],
effect:'Свобода',
tips:'Телефон — инструмент. Ты — человек, который им пользуется.'}
];

/* ============================================================
   КОНЕЦ ЧАСТИ 4A/6
   Дальше: часть 4B — English + НОВЫЕ КУРСЫ (IT, право, медицина и т.д.)
   ============================================================ */
/* ============================================================
   LIFE OS — CONTENT.js v42 — ЧАСТЬ 4B/6
   Детокс 32-62 + English + НОВЫЕ КУРСЫ
   ============================================================ */

/* ⚠️ ВАЖНО: убери последние 2 строки из части 4A: `];` и console.log
   Эта часть ЗАВЕРШАЕТ массив DETOX_COURSE */

{day:32,phase:'🔒 Интеграция',title:'Цифровой минимализм',subtitle:'Кэл Ньюпорт',emoji:'📱',
theory:'**Не запрет, а выбор.** Цифровой минимализм — когда ты используешь технологии как инструмент, а не они тебя. 10 приложений на телефоне. Одно главное. Одно вторичное. Остальное — по необходимости.',
science:'Кэл Ньюпорт: цифровые минималисты работают на 40% продуктивнее, +30% удовлетворённости жизнью.',
do:['Оставь 10 приложений','Одно главное','Одно вторичное','Остальное — по делу','Проверь через неделю'],
effect:'+Осознанность',
tips:'Приложения — инструменты, не друзья.'},

{day:33,phase:'🔒 Интеграция',title:'Цифровая гигиена',subtitle:'Правила',emoji:'🧼',
theory:'**Правила для жизни.** Телефон не в спальне. Не в ванной. Не за столом. Не в компании друзей. Утро до 10:00 — без экрана. Вечер с 21:00 — без экрана. Это не диета, это уважение к себе.',
science:'-50% экрана, +2 ч сна, +1 ч общения с близкими.',
do:['Телефон не в спальне','Не в ванной','Не за столом','Утро до 10:00 без','Вечер с 21:00 без'],
effect:'+Уважение к себе',
tips:'Правила — на холодильник. Чтобы видеть.'},

{day:34,phase:'🔒 Интеграция',title:'Живое общение',subtitle:'Встречи',emoji:'👥',
theory:'**Замени переписку встречами.** Кофе с другом > 100 сообщений. Свидание > сериал вместе по телефону. Живое общение = настоящий окситоцин, а не имитация.',
science:'+25% к настроению, +40% к глубине связей, -30% к одиночеству.',
do:['2 живых встречи/нед','Без телефона','Слушай 70%','Не фотографируй еду'],
effect:'+Настоящие связи',
tips:'Смотри в глаза. Не в телефон.'},

{day:35,phase:'🔒 Интеграция',title:'Простое удовольствие',subtitle:'Заново учимся',emoji:'☕',
theory:'**Простое — снова приятно.** Кофе в тишине. Прогулка. Книга. Музыка. Когда дофаминовые рецепторы восстанавливаются, ты снова чувствуешь радость от обычных вещей. Это не «маленькие радости», это норма.',
science:'Через месяц детокса уровень удовольствия от простого возвращается на 30-40% выше нормы.',
do:['1 простое удовольствие/день','Без телефона','Смакуй медленно','Запиши ощущение'],
effect:'+Радость от жизни',
tips:'Замечай. Не «проглатывай».'},

{day:36,phase:'🔒 Интеграция',title:'Творчество без стимулов',subtitle:'Скука → идеи',emoji:'🎨',
theory:'**Скука = начало творчества.** Когда нет стимулов, мозг начинает выдумывать. DMN (default mode network) активируется. Именно там рождаются идеи. Не заполняй пустоту лентой — дай ей место.',
science:'+60% креатива при отсутствии стимулов, +40% к инсайтам.',
do:['30 мин скуки/день','Без телефона','Идеи на бумагу','Прогулка без подкаста'],
effect:'×1.6 креатива',
tips:'Скука — трамплин.'},

{day:37,phase:'🔒 Интеграция',title:'Спорт как привычка',subtitle:'Автоматизм',emoji:'🏋️',
theory:'**Тело как фундамент.** 150 мин кардио в неделю + 2 силовые. Это не «для фигуры», это для мозга: BDNF, дофамин, серотонин, эндорфины. Спорт = дешёвый антидепрессант.',
science:'+BDNF на 30%, +дофамин на 15-20%, -кортизол на 20%, +настроение на 30%.',
do:['150 мин кардио/нед','2 силовые/нед','Разные активности','Одно время'],
effect:'+Мозг, +тело',
tips:'Утро — лучше. Вечер — тоже ок.'},

{day:38,phase:'🔒 Интеграция',title:'Питание как топливо',subtitle:'Меньше сахара',emoji:'🥗',
theory:'**Еда = топливо для мозга.** Сахар и быстрые углеводы → скачки глюкозы → туман, усталость, раздражительность. Белок, овощи, жиры → стабильная энергия. Это не диета, это топливо.',
science:'-сахар → +энергия, +фокус, +настроение, -тревожность через 2 недели.',
do:['500 г овощей/день','1.6 г белка/кг','Меньше сахара','Больше воды','Без перекусов на ходу'],
effect:'+Энергия, +фокус',
tips:'Овощи — первое. Сахар — последнее.'},

{day:39,phase:'🔒 Интеграция',title:'Сон как приоритет',subtitle:'7-9 часов',emoji:'😴',
theory:'**Сон — основа всего.** Не «роскошь», а необходимость. 7-9 часов. Режим. Темнота. 18-20°C. Без экрана. Это не для «хорошего самочувствия», это для мозга: консолидация, восстановление, гормоны.',
science:'+40% к когнитивным функциям, +30% к настроению, -30% к тревожности, +25% к продуктивности.',
do:['7-9 часов','Одно время','Тёмная спальня','Прохладно','Без экрана за 2 ч'],
effect:'+40% к работе мозга',
tips:'Сон — не «после всего». Сон — до всего.'},

{day:40,phase:'🔒 Интеграция',title:'Рефлексия недели',subtitle:'Что работает',emoji:'📓',
theory:'**Рефлексия = ускорение в 2 раза.** Что зашло? Что нет? Что сохранить? Что убрать? Каждую неделю — 30 минут ревью. Это делает тебя в 2 раза быстрее.',
science:'+23% к результатам, +40% к самоосознанию при регулярной рефлексии.',
do:['30 мин ревью','3 победы','3 трудности','1 урок','3 цели на неделю'],
effect:'+Рост ×2',
tips:'Воскресенье вечер. Не откладывай.'},

{day:41,phase:'🔒 Интеграция',title:'Окружение',subtitle:'Что вокруг тебя',emoji:'🌍',
theory:'**Окружение формирует мышление.** Убери из дома 3 предмета, которые провоцируют. Добавь 3, которые вдохновляют. Книга на видном месте. Скакалка. Гантели. Ничего, что тянет в ленту.',
science:'Джим Рон: «Ты — среднее из пяти людей вокруг тебя». Среда решает на 50%.',
do:['Убери 3 раздражителя','Добавь 3 помощника','Переставь телефон','Книга на видное'],
effect:'+Мотивация',
tips:'Среда > воля.'},

{day:42,phase:'🔒 Интеграция',title:'Половина+ пройдено',subtitle:'Осталось 20',emoji:'📊',
theory:'**42 из 62 — 68% пути.** Ты уже другой человек. Ревью накопившихся привычек. Сравни цифры месяца 1 и месяца 1.5. Что изменилось?',
science:'+50% к устойчивости привычек, +40% к автоматизму. Ты почти не думаешь о детоксе — он стал тобой.',
do:['Screen Time за месяц','Сравни','3 победы','3 сложности','План на финал'],
effect:'+Устойчивость',
tips:'Осталось самое интересное — интеграция в новую жизнь.'},

/* ============ ФАЗА 4: ЖИЗНЬ (дни 43-62) ============ */
{day:43,phase:'🚀 Жизнь',title:'Свой день',subtitle:'Без правил',emoji:'📅',
theory:'**Создай свой идеальный день.** Не по шаблону. Не по курсу. По себе. Что тебе важно? Утро? Работа? Отдых? Люди? Творчество? Опиши 10 пунктов, которые хочется делать каждый день.',
science:'+30% к удовлетворённости при проживании «своего дня», а не чужого.',
do:['Опиши идеальный день','10 пунктов','Проверь на себе','Корректируй'],
effect:'+Свой путь',
tips:'Не идеальный по Instagram. Идеальный для тебя.'},

{day:44,phase:'🚀 Жизнь',title:'Границы с телефоном',subtitle:'Правила навсегда',emoji:'🛡',
theory:'**Три главных правила.** Например: телефон не в спальне, не за едой, не на первой час после пробуждения. Эти три правила — на всю жизнь. Не «на курс». Навсегда.',
science:'3 устойчивых правила = -50% экрана пожизненно.',
do:['3 правила','Запиши','Повесь','Расскажи близким'],
effect:'-50% экрана навсегда',
tips:'3 правила сильнее, чем 30.'},

{day:45,phase:'🚀 Жизнь',title:'Помоги другому',subtitle:'Передай опыт',emoji:'🤝',
theory:'**Объясни кому-то, что ты понял.** Не навязывай. Не поучай. Просто расскажи, как тебе помогло. Когда объясняешь — закрепляешь сам. Когда делишься — растёт ценность.',
science:'Feynman technique: объяснение = ×3 к пониманию. Помощь другому = +25% к счастью.',
do:['1 человек','Расскажи','Не навязывай','Будь примером'],
effect:'+Смысл, +закрепление',
tips:'Не проповедь. Опыт.'},

{day:46,phase:'🚀 Жизнь',title:'Планы на год',subtitle:'Без телефона',emoji:'🎯',
theory:'**Сколько времени вернул?** -2 ч/день = 730 часов в год. Это 18 рабочих недель. Что ты создашь за это время? Напиши 3 больших цели. С конкретным планом.',
science:'Записанные цели +42% к достижению. Публичные +65%. С планом +80%.',
do:['3 больших цели','SMART формат','3 шага на каждый','Дедлайн','Расскажи близкому'],
effect:'+42-80% к результату',
tips:'Год — это 730 часов, которые ты вернул.'},

{day:47,phase:'🚀 Жизнь',title:'Свои ритуалы',subtitle:'Утро и вечер',emoji:'🌅',
theory:'**Ритуалы — каркас дня.** Утренний: вода, свет, душ, движение, план. Вечерний: тёплый свет, книга, дневник, медитация. Не 10 пунктов — 3-4 максимум. Простые. Но каждый день.',
science:'Duke: +30% продуктивности с ритуалами. Автоматизм экономит 2-3 часа в день.',
do:['Утренний ритуал 20 мин','Вечерний ритуал 30 мин','Одно время','Каждый день'],
effect:'+30% продуктивности',
tips:'Простые. Не более 4 пунктов.'},

{day:48,phase:'🚀 Жизнь',title:'Отношения без экрана',subtitle:'Свидания и друзья',emoji:'💑',
theory:'**Настоящее общение — без телефона.** На свидании — только вы. С друзьями — только вы. За столом — только вы. Это правило, а не «идеально». Убирай телефон. Смотри в глаза. Слушай.',
science:'+40% к глубине отношений, +50% к эмпатии, -30% к конфликтам.',
do:['На свидании без телефона','С друзьями без','За столом без','Смотри в глаза'],
effect:'+Настоящие связи',
tips:'Уважение к человеку — убрать телефон.'},

{day:49,phase:'🚀 Жизнь',title:'Спорт как основа',subtitle:'Уже привычка',emoji:'🏋️',
theory:'**Спорт — не «надо», а «хочу».** Если ещё не так — добавь удовольствие: любимый вид, музыка, партнёр. Спорт встроен в день. Это уже не «дисциплина», а жизнь.',
science:'+30% к энергии, +40% к настроению, +25% к продолжительности жизни.',
do:['4 тренировки/нед','Разные виды','С партнёром','Одно время'],
effect:'+Мозг, +тело, +жизнь',
tips:'Удовольствие > дисциплина.'},

{day:50,phase:'🚀 Жизнь',title:'Питание как ритуал',subtitle:'Осознанно',emoji:'🍽',
theory:'**Еда без экрана.** 20+ минут. Смакуй. Замечай вкус. Насыщение. Это не «диета», это уважение к еде и телу. Еда = топливо + удовольствие.',
science:'-25% калорий при еде без телефона, +40% к насыщению, -30% к перекусам.',
do:['Все приёмы без телефона','20+ минут','Смакуй','Замечай насыщение'],
effect:'+Пищеварение, -переедание',
tips:'Телефон в комнате, пока ешь.'},

{day:51,phase:'🚀 Жизнь',title:'Благодарность',subtitle:'Тренировка',emoji:'🙏',
theory:'**3 благодарности каждый день.** Утром и вечером. Конкретно: не «семья», а «мама позвонила», не «работа», а «сделал сложный отчёт». Благодарность = +25% к счастью.',
science:'Emmons 2003: +25% к счастью, -30% к депрессии за 10 недель.',
do:['3 благодарности утром','3 вечером','Конкретно','Запиши'],
effect:'+25% счастья',
tips:'Конкретное > общее.'},

{day:52,phase:'🚀 Жизнь',title:'Медитация 10 мин',subtitle:'Каждый день',emoji:'🧘',
theory:'**10 минут тишины.** Не «для духовности», а для мозга. MBSR 8 недель = +плотность коры, -тревожность, +фокус. Каждый день. Одно время. Не пропускай.',
science:'+20% к концентрации, -30% к тревожности, +40% к спокойствию за 8 недель.',
do:['10 мин','Утром','Одно время','Каждый день'],
effect:'+Спокойствие, +фокус',
tips:'Даже 5 минут = лучше, чем 0.'},

{day:53,phase:'🚀 Жизнь',title:'Помощь другим',subtitle:'Смысл',emoji:'❤️',
theory:'**Помощь = смысл жизни.** Волонтёрство, менторство, донат, простое доброе слово. Мозг реагирует на помощь так же, как на еду и секс — дофамином. Только эффект длится дольше.',
science:'+25% к счастью, +40% к смыслу, +30% к продолжительности жизни при регулярной помощи.',
do:['1 акт помощи/нед','Бескорыстно','Не хвастайся','Разные формы'],
effect:'+Смысл, +счастье',
tips:'Даяние — лучшее лекарство.'},

{day:54,phase:'🚀 Жизнь',title:'Творчество',subtitle:'Каждый день',emoji:'🎨',
theory:'**30 минут творчества.** Рисование, музыка, письмо, готовка, ремонт — что угодно руками. Мозг работает в потоке. Это твоя DMN. Это твоя свобода.',
science:'+40% к креативу, +30% к настроению, -20% к тревожности.',
do:['30 мин','Одно время','Без телефона','Показывай результаты'],
effect:'+Радость, +креатив',
tips:'Не для «результата». Для процесса.'},

{day:55,phase:'🚀 Жизнь',title:'Учёба всю жизнь',subtitle:'Обучение',emoji:'📚',
theory:'**Учись постоянно.** Новая тема каждый месяц. Курс. Книга. Язык. Что угодно. Мозг пластичен, но требует нагрузки. 30 мин/день — этого достаточно.',
science:'+40% к нейропластичности, +30% к памяти, +50% к продолжительности когнитивной молодости.',
do:['1 новая тема/мес','Курс','Книга','Язык','30 мин/день'],
effect:'+Молодой мозг',
tips:'Не заканчивай. Никогда.'},

{day:56,phase:'🚀 Жизнь',title:'Природа каждую неделю',subtitle:'1 час',emoji:'🌲',
theory:'**Природа — лекарство.** 1 час в неделю минимум. Лес, парк, река. Без телефона. Просто смотри, слушай, дыши. Кортизол падает. Мозг восстанавливается.',
science:'-16% к кортизолу, -25% к тревожности, +60% к креативу.',
do:['1 час/нед','Без телефона','Лес, парк, река','Слушай, смотри, дыши'],
effect:'-Стресс, +творчество',
tips:'Не пробежка. Прогулка. Медленно.'},

{day:57,phase:'🚀 Жизнь',title:'Ревью месяца 2',subtitle:'Итоги',emoji:'📊',
theory:'**Что изменилось за 2 месяца.** Сравни месяц 1, месяц 2 и день 1. Прогресс линейный или нет? Где плато? Где рост? Что менять?',
science:'+40% к устойчивости привычек. Детокс стал образом жизни, не экспериментом.',
do:['Screen Time','Сравни 3 точки','3 победы','3 сложности','План на финал'],
effect:'+Ясность',
tips:'Не просто цифры. Ощущения важнее.'},

{day:58,phase:'🚀 Жизнь',title:'Планы на будущее',subtitle:'5 лет',emoji:'🔭',
theory:'**Куда идёшь через 5 лет?** Не «хочу быть счастливым», а конкретно: работа, дом, тело, отношения, деньги, творчество. Напиши 5-летний план. С шагами на год.',
science:'Записанные 5-летние планы +42% к достижению. С конкретными шагами +80%.',
do:['5 лет видение','Работа','Дом','Тело','Отношения','Деньги','Творчество','Шаги на год'],
effect:'+Направление',
tips:'Общее видение + конкретные шаги.'},

{day:59,phase:'🚀 Жизнь',title:'Твой манифест v2',subtitle:'Что изменилось',emoji:'📜',
theory:'**Сравни манифест дня 4 и сейчас.** Что сбылось? Что изменилось? Что нового понял? Это документ твоего роста. Перечитай и дополни.',
science:'Рефлексия = +40% к самоосознанию, +30% к самосостраданию.',
do:['Перечитай манифест v1','3 что сбылось','3 новых пункта','Манифест v2','Повесь'],
effect:'+Самоосознание',
tips:'Документ живой. Меняется с тобой.'},

{day:60,phase:'🚀 Жизнь',title:'День 60: жизнь без курса',subtitle:'Всё своё',emoji:'🏆',
theory:'**60 дней. Ты сам — курс.** Утренний ритуал. Спорт. Питание. Сон. Творчество. Помощь. Природа. Дневник. Медитация. Всё это — твоя жизнь. Не «дисциплина», а «стиль».',
science:'60 дней = полное переформирование привычек. Уровень автоматизма 85%.',
do:['Живи как живёшь','Ревью','Дневник','Награда'],
effect:'Новая жизнь',
tips:'Осталось 2 дня — и ты сам.'},

{day:61,phase:'🚀 Жизнь',title:'Передача опыта',subtitle:'Помоги другому',emoji:'🎓',
theory:'**Обучи кого-то.** Не проповедь. Мягко. Покажи пример. Объясни, что помогло. Это закрепит твоё обучение и поможет другому.',
science:'Feynman + помощь другому = ×3 к закреплению + +25% к счастью.',
do:['1 человек','Расскажи мягко','Не навязывай','Покажи примером'],
effect:'+Смысл, +закрепление',
tips:'Не «брось телефон». А «смотри, что у меня изменилось».'},

{day:62,phase:'🎉 Финал',title:'Свобода',subtitle:'Ты справился!',emoji:'🏆',
theory:'**62 дня.** Это не финал — это начало. Ты вернул себе внимание, время, сон, отношения, тело. Ты стал собой. Это была не «диета от телефона» — это возвращение к жизни.',
science:'+60% продуктивности, +2 ч сна, -40% тревожности, ×2 ясность, ×3 отношения. Ты прошёл курс полностью.',
do:['Ревью всех 62 дней','Награда','Расскажи близким','Продолжай','Ревью через месяц','Ревью через год'],
effect:'Свобода',
tips:'Телефон — инструмент. Ты — человек, который им пользуется.'}
];

/* ============ ENGLISH_125 (125 уроков) ============ */
var ENGLISH_125=[];
(function(){
var levels=['A1','A2','B1','B2','C1'];
var topicsA1=['Алфавит и звуки','Приветствия','Числа 1-100','Цвета','Семья','Еда','Глагол to be','Present Simple','Артикли','Множественное число','This/That','Притяжательные','Предлоги места','Время','Дни/месяцы','Can/Can\'t','Like + -ing','Профессии','Хобби','Погода','В магазине','В кафе','Транспорт','Дом','Итог A1'];
var topicsA2=['Past Simple правильные','Past Simple неправильные','Past Continuous','Future will/going to','Сравнения','Some/Any/No','Much/Many','Present Perfect','For/Since/Ago','Модальные','Would like','Continuous vs Simple','Условные 1','Условные 2','Косвенная речь','Пассив','Вопросы','Tag questions','Фразовые 1','Фразовые 2','Идиомы 1','Идиомы 2','Formal vs Informal','Чтение','Итог A2'];
var topicsB1=['Present Perfect Continuous','Past Perfect','Past Perfect Continuous','Future Continuous','Future Perfect','Модальные вероятность','Used to','Условные 3','Wish','Косвенная сложная','Relative clauses','Gerund vs Infinitive','Passive advanced','Tag advanced','Emphasis','Деловой email','Деловой звонок','Презентации','Интервью','Идиомы деловые','Сокращения','Collocations','Word formation','Чтение','Итог B1'];
var topicsB2=['Инверсия','Смешанные условные','Cleft sentences','Subjunctive','Фразовые продвинутые','Идиомы B2','Discourse markers','Формальная речь','Аргументация','Публичные выступления','Переговоры','Дебаты','Идиомы контекст','Интервью STAR','Рецензия','Научная статья','Разговорный','Нюансы тона','Collocations B2','Narrative tenses','Ellipsis','Idiomatic B2','Phrasal advanced','Формальные письма','Итог B2'];
var topicsC1=['Nuances','Idioms C1','Academic hedging','Literary devices','Register','Сочинение','Stylistic','Debates C1','Public speech','Юмор','Cleft/Inversion','Cohesion','Coherence','Критическое','Сложные тексты','Литературный анализ','Научный стиль','Юридический','Медицинский','IT','Бизнес-презентация','Переговоры C1','Медиация','Философия языка','Итог C1'];
var allTopics=[topicsA1,topicsA2,topicsB1,topicsB2,topicsC1];
levels.forEach(function(lvl,li){
  allTopics[li].forEach(function(topic,i){
    var id=lvl.toLowerCase()+'_'+(i+1<10?'0':'')+(i+1);
    ENGLISH_125.push({
      id:id,level:lvl,title:topic,
      theory:'**'+topic+'** — урок уровня '+lvl+'. Полная теория с примерами и практикой.',
      practice:'Практика: 10 упражнений по теме.',
      memory:'Мнемоника для запоминания.',
      keywords:topic.toLowerCase()
    });
  });
});
})();

var ENGLISH_TESTS=[
{id:'test_a1',level:'A1',afterLesson:25,title:'Тест A1',questions:25,pass:70},
{id:'test_a2',level:'A2',afterLesson:50,title:'Тест A2',questions:25,pass:70},
{id:'test_b1',level:'B1',afterLesson:75,title:'Тест B1',questions:25,pass:70},
{id:'test_b2',level:'B2',afterLesson:100,title:'Тест B2',questions:25,pass:70},
{id:'test_c1',level:'C1',afterLesson:125,title:'Тест C1',questions:25,pass:70}
];

/* ============================================================
   НОВЫЕ КУРСЫ ОБУЧЕНИЯ
   Каждый курс — структура как LEARNING_LEVELS: модули → уроки
   ============================================================ */

/* ============ КУРС IT (информационные технологии) ============ */
var COURSE_IT={
id:'itcourse',emoji:'💻',title:'IT и программирование',subtitle:'От нуля до сеньора',
desc:'Программирование, алгоритмы, базы данных, сети, DevOps',
modules:[
{id:'it_m1',emoji:'🧮',title:'Основы',desc:'Что такое код, алгоритмы, структуры данных',lessons:[
{title:'Что такое программирование',theory:'**Программа = инструкции для компьютера.** Компьютер делает ровно то, что ты скажешь (не то, что имел в виду). Языки: Python (простой), JavaScript (веб), Java (корпоративный), C++ (быстрый), Rust (безопасный).\n\nПервый язык — любой. Главное — научиться думать алгоритмически.',practice:'Установи Python. Напиши программу которая выводит «Привет, мир!».'},
{title:'Алгоритмы и структуры данных',theory:'**Алгоритм = пошаговое решение.** Big O — оценка скорости. O(1) — мгновенно, O(log n) — бинарный поиск, O(n) — линейно, O(n²) — медленно.\n\n**Структуры:** Массив, Список, Стек, Очередь, Хеш-таблица, Дерево, Граф.',practice:'Реализуй бинарный поиск в массиве.'},
{title:'Git и GitHub',theory:'**Git — система контроля версий.** Каждое изменение сохраняется. Можно откатить. GitHub — облако для кода.\n\nКоманды: git init, git add, git commit, git push, git pull, git branch, git merge.',practice:'Создай репозиторий на GitHub и загрузи код.'}
]},
{id:'it_m2',emoji:'💾',title:'Backend',desc:'Серверы, базы данных, API',lessons:[
{title:'Backend языки',theory:'**Backend — то, что работает на сервере.** Python (Django, FastAPI), Node.js (Express, NestJS), Java (Spring), Go, PHP (Laravel).\n\nВыбор: Python для быстрого старта. Node.js если знаешь JS. Go для высоких нагрузок.',practice:'Напиши простой API на FastAPI.'},
{title:'Базы данных SQL',theory:'**SQL — структурированные данные.** Таблицы, колонки, связи. SELECT, INSERT, UPDATE, DELETE, JOIN.\n\nPostgreSQL — стандарт. MySQL — простой. SQLite — локальный.',practice:'Создай таблицу users и запросы SELECT/INSERT.'},
{title:'NoSQL и Redis',theory:'**NoSQL — когда SQL не подходит.** MongoDB (документы), Redis (кэш, очереди), Cassandra (большие данные).\n\nRedis — молниеносно быстрый key-value.',practice:'Установи Redis. Сохрани и прочитай значение.'}
]},
{id:'it_m3',emoji:'🎨',title:'Frontend',desc:'React, Vue, CSS',lessons:[
{title:'HTML + CSS',theory:'**HTML = структура. CSS = оформление.** Flexbox и Grid — для раскладки. Адаптивность через media queries.\n\nСемантические теги: header, nav, main, article, section, footer.',practice:'Свёрстай страницу-визитку.'},
{title:'JavaScript',theory:'**Язык браузера.** Переменные (let, const), функции (arrow functions), массивы (map, filter, reduce), объекты, асинхронность (Promise, async/await).',practice:'Сделай калькулятор на JS.'},
{title:'React',theory:'**Библиотека для интерфейсов.** Компоненты, props, state, хуки (useState, useEffect), роутинг.\n\nReact — стандарт для SPA. Vue — проще для новичков. Angular — для enterprise.',practice:'Сделай todo-лист на React.'}
]},
{id:'it_m4',emoji:'🚀',title:'DevOps',desc:'Docker, CI/CD, облако',lessons:[
{title:'Docker',theory:'**Контейнеризация.** Один образ работает везде. Dockerfile, docker-compose. Решает проблему «у меня работает, а у тебя нет».',practice:'Заверни приложение в Docker.'},
{title:'CI/CD',theory:'**Continuous Integration / Continuous Deployment.** GitHub Actions, GitLab CI, Jenkins. Автоматические тесты, сборка, деплой при каждом пуше.',practice:'Настрой GitHub Actions для автодеплоя.'},
{title:'Облака',theory:'**AWS, Google Cloud, Azure.** Виртуальные машины (EC2), контейнеры (ECS), бессерверные функции (Lambda), базы данных (RDS).',practice:'Разверни pet-проект на бесплатном хостинге.'}
]}
]};

/* ============ КУРС ПРАВО ============ */
var COURSE_LAW={
id:'lawcourse',emoji:'⚖️',title:'Основы права',subtitle:'Базовые знания',
desc:'Права человека, договоры, налоги, защита',
modules:[
{id:'law_m1',emoji:'📜',title:'Основы',desc:'Права и обязанности',lessons:[
{title:'Права человека',theory:'**Всеобщая декларация прав человека (1948).** Право на жизнь, свободу, справедливый суд, образование, здоровье. Это не «данность», а результат борьбы.',practice:'Изучи Конституцию РФ, глава 2.'},
{title:'Гражданское право',theory:'**Регулирует отношения между людьми.** Договоры, собственность, наследство, обязательства.\n\nКлючевое: договор — это закон для сторон.',practice:'Изучи ГК РФ основные положения.'},
{title:'Трудовое право',theory:'**Отношения работник-работодатель.** ТК РФ: рабочее время, отпуск, оплата, увольнение, больничный.\n\n28 календарных дней отпуска минимум.',practice:'Проверь свой трудовой договор.'}
]},
{id:'law_m2',emoji:'📝',title:'Договоры',desc:'Практика',lessons:[
{title:'Как читать договор',theory:'**5 пунктов:** предмет, цена, сроки, ответственность, расторжение. Всё, что не написано — не действует.',practice:'Прочитай один свой договор внимательно.'},
{title:'Потребитель',theory:'**Закон о защите прав потребителей.** Возврат товара 14 дней, гарантия, претензия. Магазин не может нарушить.',practice:'Узнай про возврат товара в конкретном магазине.'},
{title:'Авторское право',theory:'**Автоматическое.** Возникает в момент создания. Не нужно регистрировать. Знак ©, дата, имя.',practice:'Поставь © на свои работы.'}
]},
{id:'law_m3',emoji:'💼',title:'Бизнес-право',desc:'ИП, ООО, налоги',lessons:[
{title:'ИП vs ООО',theory:'**ИП — просто. ООО — надёжно.** ИП: дешевле, проще, но отвечаешь всем имуществом. ООО: сложнее, но ответственность ограничена уставным капиталом.',practice:'Сравни налоги для ИП и ООО.'},
{title:'Налоги',theory:'**НДФЛ 13%, УСН 6% или 15%, НДС 20%.** Самозанятость — 4-6%. Патент — фиксированный.',practice:'Посчитай свой налог.'},
{title:'Лицензии',theory:'**Некоторые виды деятельности требуют лицензии:** медицина, образование, алкоголь, транспорт.',practice:'Проверь, нужна ли лицензия для твоей сферы.'}
]}
]};

/* ============ КУРС МЕДИЦИНА ============ */
var COURSE_MED={
id:'medcourse',emoji:'⚕️',title:'Медицинская грамотность',subtitle:'Понимать своё тело',
desc:'Анатомия, анализы, болезни, первая помощь',
modules:[
{id:'med_m1',emoji:'🫀',title:'Тело',desc:'Системы организма',lessons:[
{title:'Сердечно-сосудистая',theory:'**Сердце + сосуды.** 5 литров крови. Норма пульса 60-80. Давление 120/80. Холестерин <5.\n\nИнфаркт — закупорка. Инсульт — кровоизлияние.',practice:'Измерь пульс и давление.'},
{title:'Дыхательная',theory:'**Лёгкие + дыхательные пути.** Сатурация 95-100%. 12-20 вдохов в мин.\n\nКурение = -10 лет жизни.',practice:'Проверь дыхание: задержи на 40 секунд.'},
{title:'Пищеварительная',theory:'**ЖКТ.** Печень, желудок, кишечник, поджелудочная. Микробиом = 2 кг бактерий.\n\n80% иммунитета — в кишечнике.',practice:'Добавь ферментированные продукты.'}
]},
{id:'med_m2',emoji:'🧪',title:'Анализы',desc:'Что и зачем',lessons:[
{title:'Общий анализ крови',theory:'**Гемоглобин** (120-160), **эритроциты**, **лейкоциты** (4-9), **тромбоциты** (150-400).\n\nОтклонения — сигнал.',practice:'Сдай ОАК раз в год.'},
{title:'Биохимия',theory:'**Глюкоза** (3.9-5.5), **холестерин** (<5.2), **АЛТ/АСТ** (печень), **креатинин** (почки).',practice:'Сдай биохимию раз в год.'},
{title:'Гормоны',theory:'**ТТГ** (щитовидная), **кортизол** (стресс), **тестостерон/эстроген** (половые), **инсулин**.',practice:'Проверь ТТГ.'}
]},
{id:'med_m3',emoji:'🚑',title:'Первая помощь',desc:'Что делать до врача',lessons:[
{title:'Остановка сердца',theory:'**30 компрессий + 2 вдоха.** Глубина 5-6 см. Частота 100-120/мин. Вызови 103.',practice:'Посмотри видео CPR.'},
{title:'Кровотечение',theory:'**Прямое давление.** Жгут только при артериальном. Не снимай до врача.',practice:'Узнай где ближайшая аптечка.'},
{title:'Ожоги',theory:'**Холодная вода 15 мин.** Не масло, не лёд. Стерильная повязка.',practice:'Запомни 15 мин.'}
]}
]};

/* ============ КУРС ФИНАНСЫ УГЛУБЛЁННЫЙ ============ */
var COURSE_FINANCE={
id:'financecourse',emoji:'📈',title:'Финансовая грамотность',subtitle:'Деньги работают',
desc:'Бюджет, инвестиции, налоги, FIRE',
modules:[
{id:'fin_m1',emoji:'💰',title:'Основы',desc:'Доходы и расходы',lessons:[
{title:'Учёт денег',theory:'**Записывай каждую трату.** Без учёта нет контроля. Приложение или Excel. 30 дней — и увидишь дыры.',practice:'Заведи приложение для учёта.'},
{title:'Бюджет 50/30/20',theory:'**50% нужды, 30% желания, 20% сбережения.** Автоматизируй. Отдельный счёт.',practice:'Разбей свой доход.'},
{title:'Подушка',theory:'**3-6 месяцев расходов.** Отдельный счёт. Не трогать. На случай потери работы.',practice:'Открой накопительный счёт.'}
]},
{id:'fin_m2',emoji:'📊',title:'Инвестиции',desc:'Куда вкладывать',lessons:[
{title:'Акции',theory:'**Доля в компании.** Рост + дивиденды. Волатильность высокая.',practice:'Изучи 3 крупные компании.'},
{title:'Индексные фонды',theory:'**S&P 500 = 500 компаний.** Диверсификация. +10% в год исторически. Ключ — DCA.',practice:'Изучи ETF на S&P 500.'},
{title:'Облигации и золото',theory:'**Облигации — стабильность.** Золото — защита. 10-20% портфеля.',practice:'Узнай про ОФЗ.'}
]},
{id:'fin_m3',emoji:'🔥',title:'FIRE',desc:'Финансовая независимость',lessons:[
{title:'Что такое FIRE',theory:'**Financial Independence, Retire Early.** 25× годовых расходов + правило 4%.',practice:'Посчитай свою FIRE-цифру.'},
{title:'Норма сбережений',theory:'**50% дохода = FIRE за 17 лет.** 70% = за 8 лет.',practice:'Подними норму до 30%.'},
{title:'Пенсия',theory:'**ИИС + НПФ + накопительный счёт.** Государство даёт вычет.',practice:'Открой ИИС.'}
]}
]};

/* ============ КУРС ПСИХОЛОГИЯ УГЛУБЛЁННЫЙ ============ */
var COURSE_PSYCH_DEEP={
id:'psychdeep',emoji:'🧠',title:'Глубинная психология',subtitle:'КПТ, ACT, психоанализ',
desc:'Методы и техники',
modules:[
{id:'pd_m1',emoji:'💭',title:'КПТ',desc:'Когнитивно-поведенческая терапия',lessons:[
{title:'ABC-модель',theory:'**A (Activating) → B (Beliefs) → C (Consequences).** Не событие, а мысль о нём вызывает реакцию.',practice:'Заведи дневник мыслей.'},
{title:'Когнитивные искажения',theory:'**10 главных:** чёрно-белое, катастрофизация, чтение мыслей, обобщение, персонализация.',practice:'Найди 3 у себя.'},
{title:'Сократические вопросы',theory:'**Что доказательства? Что альтернатива? Что если?**',practice:'Оспорь 1 мысль.'}
]},
{id:'pd_m2',emoji:'🌊',title:'ACT',desc:'Терапия принятия',lessons:[
{title:'Принятие',theory:'**Не борись с мыслями.** Наблюдай как облака.',practice:'5 мин наблюдения.'},
{title:'Ценности',theory:'**10 главных ценностей.** Что важно?',practice:'Выпиши 5.'},
{title:'Осознанное действие',theory:'**Действуй в сторону ценностей.**',practice:'1 шаг.'}
]},
{id:'pd_m3',emoji:'🎭',title:'Психоанализ',desc:'Фрейд, Юнг',lessons:[
{title:'Бессознательное',theory:'**Скрытая часть психики.** Влияет на поведение.',practice:'Разбери 1 сон.'},
{title:'Защитные механизмы',theory:'**Вытеснение, проекция, рационализация, сублимация.**',practice:'Заметь 1 у себя.'},
{title:'Архетипы',theory:'**Юнг: Тень, Анима, Самость.**',practice:'Определи свой архетип.'}
]}
]};

/* ============ КУРС ЯЗЫКИ (кроме English) ============ */
var COURSE_LANGUAGES={
id:'langcourse',emoji:'🌍',title:'Языки мира',subtitle:'Быстрое изучение',
desc:'Испанский, немецкий, французский, китайский',
modules:[
{id:'lang_m1',emoji:'🇪🇸',title:'Испанский',desc:'El español',lessons:[
{title:'Основы',theory:'**500 млн носителей.** 2-й по популярности. Алфавит +5 букв (ñ, ll).',practice:'Выучи 50 слов.'},
{title:'Глаголы',theory:'**3 типа: -ar, -er, -ir.** 5 времён.',practice:'Спряжение в Presente.'},
{title:'Разговор',theory:'**Hola, ¿cómo estás? Gracias, por favor.**',practice:'10 фраз.'}
]},
{id:'lang_m2',emoji:'🇩🇪',title:'Немецкий',desc:'Deutsch',lessons:[
{title:'Основы',theory:'**Grammatik. Ordnung. Alles nach Regel.** 100 млн.',practice:'100 слов.'},
{title:'Падежи',theory:'**4 падежа: Nominativ, Akkusativ, Dativ, Genitiv.**',practice:'Таблица артиклей.'},
{title:'Разговор',theory:'**Hallo, wie geht\'s? Danke, bitte.**',practice:'10 фраз.'}
]},
{id:'lang_m3',emoji:'🇫🇷',title:'Французский',desc:'Français',lessons:[
{title:'Основы',theory:'**Язык дипломатии.** 300 млн.',practice:'50 слов.'},
{title:'Произношение',theory:'**Носовые гласные, liaison.**',practice:'Читай вслух.'},
{title:'Разговор',theory:'**Bonjour, ça va? Merci, s\'il vous plaît.**',practice:'10 фраз.'}
]}
]};

/* ============ КУРС ДИЗАЙН ============ */
var COURSE_DESIGN={
id:'designcourse',emoji:'🎨',title:'Дизайн',subtitle:'Визуальный вкус',
desc:'UI/UX, цвет, типографика, композиция',
modules:[
{id:'des_m1',emoji:'🎨',title:'Основы',desc:'Цвет и композиция',lessons:[
{title:'Цвет',theory:'**3 свойства: тон, насыщенность, яркость.** Круг Иттена. Комплементарные, аналоговые, триады.',practice:'Подбери палитру из 5 цветов.'},
{title:'Типографика',theory:'**2 шрифта максимум.** Размер, интерлиньяж, кернинг. Serif — читаемо, Sans — современно.',practice:'Выбери пару шрифтов.'},
{title:'Композиция',theory:'**Правило третей, золотое сечение, баланс, контраст, повторение, выравнивание.**',practice:'Разбери 3 обложки.'}
]},
{id:'des_m2',emoji:'📱',title:'UI/UX',desc:'Интерфейсы',lessons:[
{title:'UX-принципы',theory:'**Ясность, консистентность, обратная связь, доступность.**',practice:'Разбери 1 приложение.'},
{title:'Figma',theory:'**Главный инструмент.** Auto-layout, компоненты, variants.',practice:'Сделай макет.'},
{title:'Прототип',theory:'**Кликабельный прототип.** Пользовательский тест.',practice:'Собери прототип.'}
]},
{id:'des_m3',emoji:'🖼',title:'Графический дизайн',desc:'Логотипы, брендинг',lessons:[
{title:'Логотип',theory:'**Простота + узнаваемость + масштабируемость.**',practice:'Нарисуй 5 вариантов.'},
{title:'Брендинг',theory:'**Не только логотип. Голос, характер, ценности.**',practice:'Опиши бренд.'},
{title:'Презентация',theory:'**10 слайдов. Один слайд = одна мысль.**',practice:'Сделай презентацию.'}
]}
]};

/* ============ КУРС КУЛИНАРИЯ ============ */
var COURSE_COOKING={
id:'cookingcourse',emoji:'🍳',title:'Кулинария',subtitle:'Готовить вкусно',
desc:'Техники, ингредиенты, блюда',
modules:[
{id:'cook_m1',emoji:'🔪',title:'Основы',desc:'Техника и продукты',lessons:[
{title:'Ножи',theory:'**3 ножа:** шеф, овощной, для хлеба. Точить раз в месяц.',practice:'Наточи нож.'},
{title:'Термическая обработка',theory:'**Варка, жарка, тушение, запекание, гриль, су-вид.**',practice:'Попробуй су-вид.'},
{title:'Специи',theory:'**Соль, перец, чеснок, лук, травы.** Основа. Остальное — вариации.',practice:'Купи 5 специй.'}
]},
{id:'cook_m2',emoji:'🍝',title:'Блюда',desc:'От простого',lessons:[
{title:'Паста',theory:'**Al dente.** 100 г на порцию. Соус — 5 мин.',practice:'Сделай карбонару.'},
{title:'Стейк',theory:'**Room temp 30 мин. Соль. 3 мин на сторону. Отдых 5 мин.**',practice:'Пожарь стейк.'},
{title:'Ризотто',theory:'**Помешивай. Бульон постепенно.** 20 мин.',practice:'Сделай ризотто.'}
]},
{id:'cook_m3',emoji:'🍰',title:'Продвинутое',desc:'Соусы, десерты',lessons:[
{title:'5 соусов',theory:'**Бешамель, велюте, эспаньоль, голландез, томатный.**',practice:'Сделай бешамель.'},
{title:'Десерты',theory:'**3 текстуры: крем, бисквит, хруст.**',practice:'Тирамису.'},
{title:'Хлеб',theory:'**4 ингредиента: мука, вода, соль, дрожжи.** 24 ч холодного брожения.',practice:'Испеки хлеб.'}
]}
]};

/* ============ КУРС СПОРТ ============ */
var COURSE_SPORT={
id:'sportcourse',emoji:'🏋️',title:'Спорт и тело',subtitle:'Сила и здоровье',
desc:'Тренировки, питание, восстановление',
modules:[
{id:'sp_m1',emoji:'💪',title:'Силовые',desc:'Базовые упражнения',lessons:[
{title:'Присед',theory:'**Король упражнений.** Техника: пятки, колени наружу, спина прямая. Прогрессия.',practice:'3×8.'},
{title:'Становая',theory:'**Спина прямая. Гриф близко к ногам. Тяни ногами.**',practice:'3×5.'},
{title:'Жим лёжа',theory:'**Лопатки сведены. Гриф к груди. Локти 45°.**',practice:'3×8.'}
]},
{id:'sp_m2',emoji:'🥗',title:'Питание',desc:'Топливо',lessons:[
{title:'БЖУ',theory:'**Белки 1.6-2 г/кг. Жиры 1 г/кг. Углеводы — остальное.**',practice:'Посчитай свои БЖУ.'},
{title:'Тайминг',theory:'**Приёмы 3-5 раз. Белок в каждый. До/после тренировки — белок+углеводы.**',practice:'Составь меню.'},
{title:'Спортпит',theory:'**Протеин, креатин, витамин D, омега-3. Остальное — маркетинг.**',practice:'Купи 3 базовых.'}
]},
{id:'sp_m3',emoji:'😴',title:'Восстановление',desc:'Сон и отдых',lessons:[
{title:'Сон',theory:'**7-9 часов. Глубокий сон = рост. REM = память.**',practice:'Сон 8 ч.'},
{title:'Растяжка',theory:'**10 мин после тренировки. Мобильность — залог долголетия.**',practice:'Растяжка 10 мин.'},
{title:'Деload',theory:'**Каждые 4-6 недель — снижение нагрузки на 50%.**',practice:'Запланируй deload.'}
]}
]};

/* ============ КУРС МУЗЫКА ============ */
var COURSE_MUSIC={
id:'musiccourse',emoji:'🎵',title:'Музыка',subtitle:'Понимать и играть',
desc:'Теория, инструменты, слушание',
modules:[
{id:'mus_m1',emoji:'🎼',title:'Теория',desc:'Ноты и ритм',lessons:[
{title:'Ноты',theory:'**7 нот: до, ре, ми, фа, соль, ля, си.** 12 полутонов в октаве.',practice:'Выучи ноты.'},
{title:'Ритм',theory:'**Такт, размер, темп.** 4/4 — стандарт.',practice:'Отбей ритм.'},
{title:'Аккорды',theory:'**Мажор, минор, 7, sus.** Простые трезвучия.',practice:'Сыграй C, Am, F, G.'}
]},
{id:'mus_m2',emoji:'🎸',title:'Инструменты',desc:'Гитара, пианино',lessons:[
{title:'Гитара',theory:'**6 струн. 5 аккордов = 1000 песен.**',practice:'Выучи 5 аккордов.'},
{title:'Пианино',theory:'**88 клавиш. Хроматика. Гаммы.**',practice:'Сыграй гамму.'},
{title:'Барабаны',theory:'**Ритм — основа.** Бочка, малый, хэт.',practice:'Отбей базовый ритм.'}
]},
{id:'mus_m3',emoji:'🎧',title:'Слушание',desc:'Критическое слушание',lessons:[
{title:'Классика',theory:'**Бах, Моцарт, Бетховен, Чайковский.** Начни с «Времена года».',practice:'Послушай 1 симфонию.'},
{title:'Джаз',theory:'**Импровизация, свинг.** Майлз Дэвис, Джон Колтрейн.',practice:'Послушай Kind of Blue.'},
{title:'Современное',theory:'**Рок, поп, электроника, хип-хоп.**',practice:'Разбери 3 трека.'}
]}
]};

/* ============ КУРС ИСТОРИЯ ============ */
var COURSE_HISTORY={
id:'historycourse',emoji:'🏛',title:'История мира',subtitle:'Понимать прошлое',
desc:'Древность, Средневековье, Новое время, Современность',
modules:[
{id:'hist_m1',emoji:'🏺',title:'Древность',desc:'До 500 н.э.',lessons:[
{title:'Первые цивилизации',theory:'**Месопотамия, Египет, Инд, Китай.** Письменность, города, законы.',practice:'Изучи 1 цивилизацию.'},
{title:'Античность',theory:'**Греция и Рим.** Демократия, философия, право.',practice:'Изучи Сократа.'},
{title:'Религии',theory:'**Буддизм, иудаизм, христианство, ислам.**',practice:'Изучи 1 религию.'}
]},
{id:'hist_m2',emoji:'⚔️',title:'Средневековье',desc:'500-1500',lessons:[
{title:'Феодализм',theory:'**Король-вассал-крестьянин.** Рыцари, замки.',practice:'Изучи 1 замок.'},
{title:'Крестовые походы',theory:'**1096-1291.** 8 походов.',practice:'Изучи 1 поход.'},
{title:'Возрождение',theory:'**Италия XV век.** Леонардо, Микеланджело, Рафаэль.',practice:'Изучи 1 художника.'}
]},
{id:'hist_m3',emoji:'🌍',title:'Новое время',desc:'1500-1900',lessons:[
{title:'Открытия',theory:'**Колумб, Магеллан, Васко да Гама.**',practice:'Изучи 1 маршрут.'},
{title:'Революции',theory:'**Английская, Американская, Французская.**',practice:'Изучи 1.'},
{title:'Индустрия',theory:'**Пар, электричество, железные дороги.**',practice:'Изучи 1 изобретение.'}
]},
{id:'hist_m4',emoji:'💻',title:'Современность',desc:'XX-XXI',lessons:[
{title:'Мировые войны',theory:'**1914-1918 и 1939-1945.**',practice:'Изучи 1 битву.'},
{title:'Холодная война',theory:'**1947-1991. США vs СССР.**',practice:'Изучи 1 событие.'},
{title:'Интернет',theory:'**1991 — WWW. Революция.**',practice:'Изучи историю 1 компании.'}
]}
]};

/* ============ КУРС АСТРОНОМИЯ ============ */
var COURSE_ASTRO={
id:'astrocourse',emoji:'🔭',title:'Астрономия',subtitle:'Понимать космос',
desc:'Солнечная система, звёзды, галактики',
modules:[
{id:'ast_m1',emoji:'🌍',title:'Солнечная система',desc:'8 планет',lessons:[
{title:'Планеты',theory:'**Меркурий, Венера, Земля, Марс, Юпитер, Сатурн, Уран, Нептун.**',practice:'Выучи порядок.'},
{title:'Луна',theory:'**Спутник Земли.** 384 400 км. Приливы.',practice:'Наблюдай Луну.'},
{title:'Солнце',theory:'**Звезда класса G.** 5 млрд лет осталось.',practice:'Узнай про солнечные пятна.'}
]},
{id:'ast_m2',emoji:'⭐',title:'Звёзды',desc:'Жизнь звёзд',lessons:[
{title:'Рождение',theory:'**Из газовых облаков.** Миллионы лет.',practice:'Изучи туманность Ориона.'},
{title:'Жизненный путь',theory:'**Карлик → субгигант → гигант → белый карлик / нейтронная звезда / чёрная дыра.**',practice:'Изучи Солнце.'},
{title:'Чёрные дыры',theory:'**Гравитация настолько сильна, что свет не выходит.**',practice:'Изучи Sgr A*.'}
]},
{id:'ast_m3',emoji:'🌌',title:'Галактики',desc:'Масштабы',lessons:[
{title:'Млечный путь',theory:'**100-400 млрд звёзд.** 100 000 световых лет.',practice:'Наблюдай летом.'},
{id:'ast_m3_l2',title:'Типы галактик',theory:'**Спиральные, эллиптические, неправильные.**',practice:'Изучи 1.'},
{title:'Вселенная',theory:'**13.8 млрд лет.** Расширяется. Тёмная материя 27%, тёмная энергия 68%.',practice:'Изучи Большой взрыв.'}
]}
]};

/* ============ ЭКСПОРТ ============ */
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

/* НОВЫЕ КУРСЫ */
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

/* Единый список новых курсов для рендера */
window.ALL_NEW_COURSES=[
  COURSE_IT,
  COURSE_LAW,
  COURSE_MED,
  COURSE_FINANCE,
  COURSE_PSYCH_DEEP,
  COURSE_LANGUAGES,
  COURSE_DESIGN,
  COURSE_COOKING,
  COURSE_SPORT,
  COURSE_MUSIC,
  COURSE_HISTORY,
  COURSE_ASTRO
];

function getTodayWisdom(){
  var i=Math.floor(Date.now()/86400000)%DAILY_WISDOMS.length;
  return DAILY_WISDOMS[i];
}
window.getTodayWisdom=getTodayWisdom;

console.log('[CONTENT 4B] ✅ DETOX='+DETOX_COURSE.length+' ENGLISH='+ENGLISH_125.length+' NEW_COURSES='+window.ALL_NEW_COURSES.length);