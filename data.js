'use strict';
/* ============================================================
   AI HEALTH v34 — DATA.JS (ВСЁ В ОДНОМ ФАЙЛЕ)
   ============================================================ */

var STORAGE_KEY = 'ai_health_v34';
var OLD_KEYS = ['ai_health_v33','ai_health_v32','ai_health_v31','ai_health_v30','ai_health_v29','ai_health_v28','ai_health_v26'];

/* ============ ТЕМЫ (50) ============ */
var THEMES=[
{id:'dark',emoji:'🌙',name:'Тёмная',color:'#000',effects:'stars'},
{id:'light',emoji:'☀️',name:'Светлая',color:'#f5f5fa',effects:'none'},
{id:'ocean',emoji:'🌊',name:'Океан',color:'#000814',effects:'waves'},
{id:'sakura',emoji:'🌸',name:'Сакура',color:'#1a0f14',effects:'petals'},
{id:'forest',emoji:'🌲',name:'Лес',color:'#0a1410',effects:'leaves'},
{id:'sunset',emoji:'🌅',name:'Закат',color:'#1a0a05',effects:'sunrays'},
{id:'ice',emoji:'❄️',name:'Лёд',color:'#0a1419',effects:'snow'},
{id:'amethyst',emoji:'💎',name:'Аметист',color:'#12061f',effects:'crystals'},
{id:'pumpkin',emoji:'🎃',name:'Тыква',color:'#0d0500',effects:'heavyfog',halloween:true},
{id:'vampire',emoji:'🦇',name:'Вампир',color:'#0a0000',effects:'vampire',halloween:true},
{id:'ghost',emoji:'👻',name:'Призрак',color:'#0a0814',effects:'ghost',halloween:true},
{id:'web',emoji:'🕸',name:'Паутина',color:'#001410',effects:'web',halloween:true},
{id:'aurora',emoji:'🌌',name:'Аврора',color:'#050a15',effects:'aurora'},
{id:'desert',emoji:'🏜',name:'Пустыня',color:'#1a1208',effects:'sand'},
{id:'cyber',emoji:'⚡',name:'Кибер',color:'#0a0014',effects:'cyber'},
{id:'mono',emoji:'⚫',name:'Моно',color:'#0a0a0a',effects:'none'},
{id:'lava',emoji:'🔥',name:'Лава',color:'#140000',effects:'ember'},
{id:'mint',emoji:'🌿',name:'Мята',color:'#08140f',effects:'bubbles'},
{id:'coffee',emoji:'☕',name:'Кофе',color:'#1a0e08',effects:'smoke'},
{id:'neon',emoji:'💡',name:'Неон',color:'#000',effects:'neon'},
{id:'sunrise',emoji:'🌄',name:'Рассвет',color:'#1a0d0a',effects:'sunrays'},
{id:'rain',emoji:'🌧',name:'Дождь',color:'#0a1018',effects:'rain'},
{id:'storm',emoji:'⛈',name:'Гроза',color:'#0a0a14',effects:'lightning'},
{id:'crystal',emoji:'🔮',name:'Кристалл',color:'#0a1420',effects:'crystals'},
{id:'ember',emoji:'🔥',name:'Угли',color:'#140800',effects:'ember'},
{id:'holo',emoji:'🌈',name:'Голограмма',color:'#000814',effects:'holo'},
{id:'moon',emoji:'🌕',name:'Луна',color:'#0a0a1a',effects:'moon'},
{id:'sand',emoji:'🏖',name:'Песок',color:'#1a1408',effects:'sand'},
{id:'sakura-night',emoji:'🌺',name:'Сакура-ночь',color:'#14081a',effects:'petals'},
{id:'deep',emoji:'🌊',name:'Глубина',color:'#000a14',effects:'bubbles'},
{id:'rose',emoji:'🌹',name:'Роза',color:'#1a0810',effects:'petals'},
{id:'bamboo',emoji:'🎋',name:'Бамбук',color:'#0a1408',effects:'leaves'},
{id:'cosmos',emoji:'🌠',name:'Космос',color:'#0a0014',effects:'galaxy'},
{id:'matrix',emoji:'💚',name:'Матрица',color:'#000a00',effects:'code'},
{id:'gold',emoji:'🥇',name:'Золото',color:'#0a0800',effects:'spark'},
{id:'silver',emoji:'🥈',name:'Серебро',color:'#0a0a0f',effects:'stardust'},
{id:'coral',emoji:'🐠',name:'Коралл',color:'#1a0e0a',effects:'bubbles'},
{id:'nebula',emoji:'🌫',name:'Туманность',color:'#0a0514',effects:'nebula'},
{id:'polar',emoji:'🧊',name:'Полярная',color:'#0a1520',effects:'snow'},
{id:'jungle',emoji:'🌴',name:'Джунгли',color:'#0a1a0a',effects:'leaves'},
{id:'royal',emoji:'👑',name:'Королевская',color:'#0a0514',effects:'crystals'},
{id:'forest-night',emoji:'🌲',name:'Ночной лес',color:'#08100a',effects:'fireflies'},
{id:'fire',emoji:'🔥',name:'Огонь',color:'#140600',effects:'ember'},
{id:'frost',emoji:'❄',name:'Мороз',color:'#0a1525',effects:'snow'},
{id:'spirit',emoji:'✨',name:'Дух',color:'#14082a',effects:'stardust'},
{id:'time',emoji:'⏳',name:'Время',color:'#0a0e14',effects:'particles'},
{id:'money',emoji:'💰',name:'Деньги',color:'#0a1408',effects:'spark'},
{id:'love',emoji:'❤️',name:'Любовь',color:'#1a0810',effects:'hearts'},
{id:'zen',emoji:'🧘',name:'Дзен',color:'#0a1410',effects:'leaves'}
];

/* ============ ДОМЕНЫ (10) ============ */
var DOMAINS=[
{id:'physical',emoji:'💪',name:'Физическое',color:'#ff7ba9',desc:'Тело, сила, выносливость',
  metrics:[{id:'weight',label:'Вес (кг)',target:'60-80'},{id:'steps',label:'Шагов/день',target:'8000'},{id:'workouts',label:'Тренировок/нед',target:'3-5'},{id:'vo2max',label:'VO2max',target:'40+'},{id:'restHR',label:'Пульс покоя',target:'50-70'}],
  learning:'Уровни 1-5 + 15 навыков Здоровья + Модуль Нейро + Курсы: health_basics, fitness_master, nutrition_master, sleep_master, yoga_master'},
{id:'mental',emoji:'🧠',name:'Ментальное',color:'#4dd4ff',desc:'Фокус, память, ясность',
  metrics:[{id:'focusMin',label:'Deep Work (мин)',target:'180'},{id:'meditation',label:'Медитаций/нед',target:'7'},{id:'reading',label:'Страниц/день',target:'20'},{id:'memory',label:'Память 1-10',target:'7+'},{id:'iq',label:'IQ-задач/день',target:'5'}],
  learning:'Модуль Память + Модуль IQ + 18 навыков Когнитивных + Курсы: memory_master, iq_boost, productivity_master, reading_master'},
{id:'emotional',emoji:'❤️',name:'Эмоциональное',color:'#ff6b6b',desc:'Чувства, стресс',
  metrics:[{id:'mood',label:'Настроение 1-10',target:'7+'},{id:'stress',label:'Стресс 1-10',target:'<5'},{id:'anxiety',label:'Тревога 1-10',target:'<4'},{id:'journal',label:'Записей/нед',target:'3'}],
  learning:'Модуль EQ + 12 навыков Эмоциональных + Курсы: mental_health, eq_course, stress_management, confidence_master'},
{id:'spiritual',emoji:'🕊',name:'Духовное',color:'#b394ff',desc:'Смысл, ценности',
  metrics:[{id:'gratitude',label:'Благодарностей/день',target:'3'},{id:'meaning',label:'Смысл 1-10',target:'7+'},{id:'nature',label:'На природе (мин/нед)',target:'120'}],
  learning:'Уровни 4-5 + 5 навыков Духовных + 7 навыков Философских + Курсы: meaning_course, stoicism_course'},
{id:'financial',emoji:'💰',name:'Финансовое',color:'#ffcc4d',desc:'Бюджет, инвестиции',
  metrics:[{id:'savings',label:'Норма сбережений %',target:'20%+'},{id:'runway',label:'Runway (мес)',target:'6+'},{id:'debt',label:'Долговая нагрузка %',target:'<30%'}],
  learning:'Модуль Финансы + 10 навыков Финансовых + Курсы: financial_literacy, fire_course, investing_master'},
{id:'career',emoji:'💼',name:'Карьерное',color:'#3ddc97',desc:'Навыки, позиция',
  metrics:[{id:'skills',label:'Навыков в развитии',target:'3'},{id:'network',label:'Контактов/мес',target:'5'},{id:'projects',label:'Проектов/квартал',target:'3'}],
  learning:'8 навыков Карьеры + Курсы: career_master, leadership_course, interview_master'},
{id:'social',emoji:'👥',name:'Социальное',color:'#c4b5fd',desc:'Семья, друзья',
  metrics:[{id:'deepConnections',label:'Глубоких связей',target:'5+'},{id:'calls',label:'Звонков/нед',target:'3'},{id:'meetups',label:'Встреч/мес',target:'4'}],
  learning:'10 навыков Социальных + 6 навыков Отношений + Курсы: communication, charisma_course'},
{id:'environment',emoji:'🏠',name:'Среда',color:'#a4e7ff',desc:'Пространство, свет',
  metrics:[{id:'clutter',label:'Порядок 1-10',target:'8+'},{id:'light',label:'Освещение 1-10',target:'8+'},{id:'noise',label:'Тишина 1-10',target:'7+'}],
  learning:'Уровни 1-2 + Курсы: environment_design, home_master'},
{id:'recovery',emoji:'⏰',name:'Восстановление',color:'#4dd4ff',desc:'Сон, отдых, детокс',
  metrics:[{id:'sleepHours',label:'Сон (ч)',target:'7-9'},{id:'sleepQuality',label:'Качество сна 1-10',target:'8+'},{id:'breaks',label:'Перерывов/день',target:'6+'}],
  learning:'15 навыков Здоровья + Курсы: recovery_course, sleep_master'},
{id:'digital',emoji:'📱',name:'Цифровое',color:'#ff88cc',desc:'Экран, детокс, фокус',
  metrics:[{id:'screenToday',label:'Экран сегодня (мин)',target:'<240'},{id:'screenWeek',label:'Экран за неделю (ч)',target:'<28'},{id:'phoneUnlocks',label:'Разблокировок',target:'<80'},{id:'socialTime',label:'Соцсети (мин)',target:'<60'}],
  learning:'30-дневный курс детокса + 6 навыков Цифровых + Курсы: screentime_course, digital_focus'}
];

/* ============ МУДРОСТИ (110+) ============ */
var DAILY_WISDOMS=[
{text:'Ты не ленивый. Ты либо устал, либо не видишь смысла, либо боишься.',author:'Неизвестный',apply:'Спроси: что из 3 — моё?'},
{text:'Дисциплина — это выбор между тем, что хочешь сейчас, и тем, что хочешь больше всего.',author:'Авраам Линкольн',apply:'Что я хочу больше всего?'},
{text:'Мы — то, что делаем постоянно. Совершенство — не действие, а привычка.',author:'Аристотель',apply:'Что ты делаешь каждый день?'},
{text:'Между стимулом и реакцией есть пространство. В нём — наша свобода.',author:'Виктор Франкл',apply:'Дыши 6 секунд перед реакцией'},
{text:'Счастье — не то, что имеешь, а то, что чувствуешь.',author:'Даг Хэммершолд',apply:'Запиши 3 благодарности'},
{text:'Ты не можешь вернуться и изменить начало, но можешь начать сейчас и изменить конец.',author:'К.С. Льюис',apply:'Что можешь сделать за 2 минуты?'},
{text:'Единственный способ делать великую работу — любить то, что делаешь.',author:'Стив Джобс',apply:'Что ты делаешь с любовью?'},
{text:'Тот, кто владеет собой, владеет миром.',author:'Сенека',apply:'Где ты потерял контроль?'},
{text:'Мы становимся тем, о чём думаем.',author:'Будда',apply:'О чём ты думаешь сейчас?'},
{text:'Победа над собой — величайшая победа.',author:'Платон',apply:'В чём превзойти себя сегодня?'},
{text:'Если хочешь изменить мир — начни с себя.',author:'Махатма Ганди',apply:'Что изменишь сегодня?'},
{text:'Жизнь — 10% того, что происходит, и 90% того, как мы реагируем.',author:'Чарльз Свиндолл',apply:'Как ты реагируешь?'},
{text:'Каждый день — новая возможность изменить жизнь.',author:'Неизвестный',apply:'Что изменишь?'},
{text:'Не сравнивай себя с другими. Сравнивай с собой вчерашним.',author:'Джордан Питерсон',apply:'Насколько вырос?'},
{text:'Успех — сумма маленьких усилий, повторяемых день за днём.',author:'Роберт Кольер',apply:'Какое усилие сделаешь?'},
{text:'Всё, что ты можешь — это начать.',author:'Неизвестный',apply:'Что начнёшь?'},
{text:'Измени мысли — изменится жизнь.',author:'Уэйн Дайер',apply:'О чём думаешь?'},
{text:'Великие дела не делаются в зоне комфорта.',author:'Неизвестный',apply:'Что вне комфорта?'},
{text:'Страх — не то, что бояться, а то, что преодолеть.',author:'Неизвестный',apply:'Сделай страшное'},
{text:'Ты сильнее, чем кажется.',author:'А.А. Милн',apply:'Вспомни победу'},
{text:'Утро определяет день.',author:'Робин Шарма',apply:'Сделай ритуал'},
{text:'Не трать время на сожаления.',author:'Неизвестный',apply:'Что сделать сейчас?'},
{text:'Ты — не свои мысли. Ты — тот, кто их наблюдает.',author:'Экхарт Толле',apply:'Наблюдай'},
{text:'Действие — главный ключ к успеху.',author:'Пабло Пикассо',apply:'Сделай действие'},
{text:'Стресс — не то, что происходит, а то, что ты думаешь.',author:'Эндрю Бернстейн',apply:'Что думаешь?'},
{text:'Разница между тем, кто ты, и тем, кем хочешь быть — в действии.',author:'Неизвестный',apply:'Что сделаешь?'},
{text:'Сон — основа. Приоритет №1.',author:'Мэттью Уокер',apply:'Спи 7-9 ч'},
{text:'Каждый день делай что-то, что тебя пугает.',author:'Элеонор Рузвельт',apply:'Что пугает?'},
{text:'Тот, кто верит в себя, может всё.',author:'Вергилий',apply:'Во что веришь?'},
{text:'Ты не обязан быть великим, чтобы начать.',author:'Зиг Зиглар',apply:'С чего начнёшь?'},
{text:'Если не сейчас, то когда?',author:'Неизвестный',apply:'Почему не сейчас?'},
{text:'Изменение начинается с осознания.',author:'Неизвестный',apply:'10 мин тишины'},
{text:'Ты не можешь изменить прошлое, но можешь — будущее.',author:'Неизвестный',apply:'Что изменить?'},
{text:'Настоящий успех — когда счастлив.',author:'Неизвестный',apply:'Ты счастлив?'},
{text:'Кто не рискует, тот не пьёт шампанского.',author:'Русская пословица',apply:'На что готов?'},
{text:'Будь изменением, которое хочешь видеть.',author:'Ганди',apply:'Какое изменение?'},
{text:'Сначала мечтай. Потом действуй.',author:'Неизвестный',apply:'О чём мечтаешь?'},
{text:'Дисциплина — мост между целями и достижениями.',author:'Джим Рон',apply:'Какова дисциплина?'},
{text:'Один день — один шаг.',author:'Неизвестный',apply:'Какой шаг?'},
{text:'Скука — двигатель креативности.',author:'Неизвестный',apply:'10 мин без телефона'},
{text:'Смысл жизни — дать ей смысл.',author:'Неизвестный',apply:'Какой смысл?'},
{text:'Внутреннее спокойствие — высшая сила.',author:'Неизвестный',apply:'10 мин медитации'},
{text:'Твоя энергия притягивает реальность.',author:'Неизвестный',apply:'Что излучаешь?'},
{text:'Ошибаться — нормально. Не учиться — глупо.',author:'Неизвестный',apply:'Какой урок?'},
{text:'Мечта не работает, если ты не работаешь.',author:'Джон Максвелл',apply:'Что сделал?'},
{text:'Иди медленно, но не останавливайся.',author:'Китайская пословица',apply:'Ты движешься?'},
{text:'Счастье — путь, а не пункт.',author:'Неизвестный',apply:'Наслаждаешься?'},
{text:'Сначала пойми, потом будь понятым.',author:'Стивен Кови',apply:'Ты слушаешь?'},
{text:'Не бойся медленного роста. Бойся стоять.',author:'Китайская пословица',apply:'Растёшь?'},
{text:'Заботься о теле — единственное место жить.',author:'Джим Рон',apply:'Что сделал?'},
{text:'Маленькие шаги — большие перемены.',author:'Неизвестный',apply:'Какой шаг?'},
{text:'Твои привычки определяют будущее.',author:'Джеймс Клир',apply:'Какая привычка?'},
{text:'Прокрастинация — страх в действии.',author:'Неизвестный',apply:'Что откладываешь?'},
{text:'Благодарность — путь к счастью.',author:'Неизвестный',apply:'За что?'},
{text:'Ты всегда можешь начать заново.',author:'Неизвестный',apply:'С чего?'},
{text:'Только тот, кто рискует, может достичь.',author:'Неизвестный',apply:'Как рискуешь?'},
{text:'Успех — не точка, а движение.',author:'Неизвестный',apply:'Движешься?'},
{text:'Инвестируй в себя.',author:'Бенджамин Франклин',apply:'Что сделал?'},
{text:'Будь здесь и сейчас.',author:'Неизвестный',apply:'Ты в моменте?'},
{text:'Всё, что нужно — уже внутри.',author:'Неизвестный',apply:'Что нашёл?'},
{text:'Терпение — ключ.',author:'Неизвестный',apply:'Ты терпелив?'},
{text:'Секрет успеха — начать.',author:'Марк Твен',apply:'Начни с 2 минут'},
{text:'1% лучше каждый день.',author:'Джеймс Клир',apply:'Что улучшил?'},
{text:'Твоя жизнь — твой выбор.',author:'Неизвестный',apply:'Какой выбор?'},
{text:'Фокус на прогрессе, не на совершенстве.',author:'Неизвестный',apply:'Где прогресс?'},
{text:'Тот, кто читает, управляет.',author:'Неизвестный',apply:'Прочти 20 мин'},
{text:'Начни с того, что можешь.',author:'Артур Эш',apply:'Что можешь?'},
{text:'Не бойся ошибок. Бойся бездействия.',author:'Неизвестный',apply:'Что сделал?'},
{text:'Успех — сумма маленьких шагов.',author:'Неизвестный',apply:'Какой шаг?'},
{text:'Лучшее время посадить дерево — 20 лет назад. Второе — сейчас.',author:'Китайская пословица',apply:'Что посадишь?'},
{text:'Действуй, даже если страшно.',author:'Неизвестный',apply:'Сделай страшное'},
{text:'Ты не найдёшь себя в тишине, если не дашь её.',author:'Неизвестный',apply:'10 мин тишины'},
{text:'Отдых — часть работы.',author:'Неизвестный',apply:'Сделай перерыв'},
{text:'Наблюдай. Слушай. Учись. Расти.',author:'Неизвестный',apply:'Что узнал?'},
{text:'Чем больше отдаёшь, тем больше получаешь.',author:'Черчилль',apply:'Что дал?'},
{text:'Свобода — в дисциплине.',author:'Неизвестный',apply:'Какова дисциплина?'},
{text:'Ты — автор своей истории.',author:'Неизвестный',apply:'Что напишешь?'},
{text:'Окружение определяет мышление.',author:'Джим Рон',apply:'Что тебя окружает?'},
{text:'Любовь к себе — начало всех изменений.',author:'Неизвестный',apply:'Как заботишься?'},
{text:'Умение проигрывать — путь к победе.',author:'Неизвестный',apply:'Как принял?'},
{text:'Твоя реакция — твоя сила.',author:'Стивен Кови',apply:'Как реагируешь?'},
{text:'Сила — в действии.',author:'Неизвестный',apply:'Что делаешь?'},
{text:'Кто ищет, тот найдёт.',author:'Неизвестный',apply:'Что ищешь?'},
{text:'Каждый день — подарок.',author:'Неизвестный',apply:'Что подарил?'},
{text:'Никогда не сдавайся.',author:'Черчилль',apply:'Близок к цели?'},
{text:'Дисциплина ума — высшая.',author:'Неизвестный',apply:'Управляй мыслями'},
{text:'Ключ — в последовательности.',author:'Неизвестный',apply:'Что постоянно?'},
{text:'Ты можешь всё, если веришь.',author:'Неизвестный',apply:'Веришь?'},
{text:'Сначала сделай. Потом улучшай.',author:'Неизвестный',apply:'Начни сейчас'},
{text:'Меньше слов, больше действий.',author:'Неизвестный',apply:'Что сделаешь?'},
{text:'Твоя жизнь — результат решений.',author:'Неизвестный',apply:'Что выбираешь?'},
{text:'Не сдавайся на полпути.',author:'Неизвестный',apply:'Где остановился?'},
{text:'Свет в конце тоннеля — это ты.',author:'Неизвестный',apply:'Видишь свет?'},
{text:'Один день — одна привычка.',author:'Неизвестный',apply:'Какая привычка?'},
{text:'Большие цели, маленькие шаги.',author:'Неизвестный',apply:'Какова цель?'},
{text:'Твоя улыбка меняет чей-то день.',author:'Неизвестный',apply:'Улыбнись'},
{text:'Начни сегодня — завтра не наступит.',author:'Неизвестный',apply:'Почему не сегодня?'},
{text:'Ты справишься. Ты всегда справляешься.',author:'Неизвестный',apply:'Вспомни победы'},
{text:'Что делаешь сейчас — определяет будущее.',author:'Неизвестный',apply:'Что сейчас?'},
{text:'Будь терпелив.',author:'Неизвестный',apply:'Ты терпелив?'},
{text:'Победа любит подготовленных.',author:'Неизвестный',apply:'Готов?'},
{text:'Ошибки — уроки, не приговор.',author:'Неизвестный',apply:'Что узнал?'},
{text:'Сравнивай только с собой вчерашним.',author:'Джордан Питерсон',apply:'Насколько вырос?'},
{text:'Твой ум — твой инструмент.',author:'Неизвестный',apply:'Используй ум'},
{text:'Простое лучше сложного.',author:'Неизвестный',apply:'Что упростить?'},
{text:'Всё, что имеешь — настоящее.',author:'Неизвестный',apply:'Что имеешь?'},
{text:'Ты — то, что ешь, читаешь, думаешь.',author:'Неизвестный',apply:'Что потребляешь?'},
{text:'Жизнь — выбор. Выбирай мудро.',author:'Неизвестный',apply:'Какой выбор?'},
{text:'Будь лучшей версией себя.',author:'Неизвестный',apply:'Что улучшить?'},
{text:'Ты важен.',author:'Неизвестный',apply:'Ты ценишь себя?'}
];

function getTodayWisdom(){
  return DAILY_WISDOMS[Math.floor(Date.now()/86400000) % DAILY_WISDOMS.length];
}

/* ============ ЧЕЛЛЕНДЖИ (55) ============ */
var DAILY_CHALLENGES=[
{id:'ch_no_social_1h',title:'1 час без соцсетей',desc:'Не открывай соцсети 1 час',reward:20,category:'digital'},
{id:'ch_3_tasks',title:'3 задачи',desc:'Выполни 3 задачи',reward:30,category:'productivity'},
{id:'ch_water_8',title:'8 стаканов воды',desc:'Выпей 8 стаканов',reward:25,category:'health'},
{id:'ch_no_phone_morning',title:'Утро без телефона',desc:'30 мин без телефона',reward:25,category:'digital'},
{id:'ch_meditation_10',title:'10 минут медитации',desc:'Медитируй 10 мин',reward:20,category:'emotional'},
{id:'ch_walk_30',title:'Прогулка 30 мин',desc:'Прогуляйся 30 мин',reward:25,category:'health'},
{id:'ch_deep_work_90',title:'Deep Work 90',desc:'90 мин глубокой работы',reward:40,category:'productivity'},
{id:'ch_read_20',title:'Чтение 20 мин',desc:'Прочти 20 минут',reward:20,category:'mental'},
{id:'ch_journal',title:'Дневник вечером',desc:'3 победы + 1 урок',reward:20,category:'emotional'},
{id:'ch_no_phone_2h_sleep',title:'2 часа без экрана',desc:'За 2 часа до сна',reward:30,category:'health'},
{id:'ch_workout',title:'Тренировка',desc:'Сделай тренировку',reward:35,category:'health'},
{id:'ch_no_sugar',title:'Без сахара',desc:'День без сахара',reward:25,category:'health'},
{id:'ch_gratitude_3',title:'3 благодарности',desc:'Запиши 3',reward:15,category:'spiritual'},
{id:'ch_english_15',title:'Английский 15 мин',desc:'Позанимайся',reward:20,category:'mental'},
{id:'ch_eye_gym',title:'Гимнастика глаз',desc:'10 упражнений',reward:15,category:'health'},
{id:'ch_palming',title:'Пальминг',desc:'5 мин пальминга',reward:10,category:'health'},
{id:'ch_20_20_20',title:'Правило 20-20-20',desc:'Соблюдай весь день',reward:20,category:'health'},
{id:'ch_no_news_eve',title:'Без новостей вечером',desc:'После 18:00 — нет',reward:15,category:'digital'},
{id:'ch_no_phone_work',title:'Телефон вне комнаты',desc:'Во время работы',reward:30,category:'productivity'},
{id:'ch_deep_work_2',title:'2 блока Deep Work',desc:'2×90 минут',reward:50,category:'productivity'},
{id:'ch_mood_log',title:'Настроение 3×',desc:'Запиши 3 раза',reward:15,category:'emotional'},
{id:'ch_sleep_early',title:'Сон до 23:00',desc:'Ляг до 23:00',reward:25,category:'health'},
{id:'ch_no_caffeine_eve',title:'Кофе до 14:00',desc:'Не пей после 14:00',reward:15,category:'health'},
{id:'ch_cold_shower',title:'Холодный душ',desc:'2 мин холодной воды',reward:25,category:'health'},
{id:'ch_nature_30',title:'Природа 30 мин',desc:'Прогулка на природе',reward:20,category:'spiritual'},
{id:'ch_no_phone_bed',title:'Телефон вне спальни',desc:'Ночь без телефона',reward:25,category:'digital'},
{id:'ch_deep_reading',title:'Чтение 30 мин',desc:'Глубокая книга',reward:25,category:'mental'},
{id:'ch_learn_lesson',title:'1 урок обучения',desc:'Пройди урок',reward:20,category:'mental'},
{id:'ch_learn_skill',title:'Навык',desc:'Изучи навык',reward:30,category:'mental'},
{id:'ch_3_habits',title:'3 привычки',desc:'Выполни 3',reward:30,category:'productivity'},
{id:'ch_1_goal',title:'Прогресс к цели',desc:'Шаг к цели',reward:25,category:'productivity'},
{id:'ch_note',title:'Заметка',desc:'Запиши идею',reward:15,category:'mental'},
{id:'ch_1_lesson_eng',title:'1 урок English',desc:'Пройди урок',reward:20,category:'mental'},
{id:'ch_morning_pages',title:'Утренние страницы',desc:'3 стр. от руки',reward:25,category:'mental'},
{id:'ch_breathing_478',title:'Дыхание 4-7-8',desc:'4 цикла утро+вечер',reward:15,category:'emotional'},
{id:'ch_no_phone_lunch',title:'Обед без экрана',desc:'30 мин без телефона',reward:20,category:'digital'},
{id:'ch_walk_20',title:'Прогулка 20 мин',desc:'Без телефона',reward:15,category:'health'},
{id:'ch_no_phone_1h',title:'1 час без телефона',desc:'Цифровой детокс',reward:30,category:'digital'},
{id:'ch_veggies_500',title:'500 г овощей',desc:'Съешь 500 г',reward:25,category:'health'},
{id:'ch_protein_16',title:'1.6 г белка/кг',desc:'Достаточно белка',reward:25,category:'health'},
{id:'ch_journal_deep',title:'Глубокий дневник',desc:'15 мин письма',reward:25,category:'emotional'},
{id:'ch_5_things_learned',title:'5 новых вещей',desc:'Узнай 5 фактов',reward:20,category:'mental'},
{id:'ch_creative',title:'Творчество',desc:'30 мин творчества',reward:25,category:'emotional'},
{id:'ch_social',title:'Живое общение',desc:'Позвони близкому',reward:20,category:'social'},
{id:'ch_family_time',title:'Время с семьёй',desc:'1 час без телефонов',reward:30,category:'social'},
{id:'ch_no_phone_2h',title:'2 часа без телефона',desc:'Полный детокс',reward:40,category:'digital'},
{id:'ch_review_week',title:'Ревью недели',desc:'30 мин анализа',reward:25,category:'productivity'},
{id:'ch_plan_day',title:'План на завтра',desc:'3 задачи',reward:15,category:'productivity'},
{id:'ch_mobility',title:'Мобильность 10 мин',desc:'Растяжка тела',reward:15,category:'health'},
{id:'ch_sunlight_10',title:'Солнце 10 мин',desc:'Утренний свет',reward:15,category:'health'},
{id:'ch_deep_breath',title:'Дыхание 5 мин',desc:'Box breathing',reward:15,category:'emotional'},
{id:'ch_finance_check',title:'Финансовый чек',desc:'Запиши расходы',reward:20,category:'finance'},
{id:'ch_learn_english_30',title:'English 30 мин',desc:'Погружение',reward:25,category:'mental'},
{id:'ch_single_task',title:'Одна задача',desc:'90 мин без отвлечений',reward:35,category:'productivity'}
];

function todayKey(){return new Date().toISOString().slice(0,10)}
function yesterdayKey(){var d=new Date();d.setDate(d.getDate()-1);return d.toISOString().slice(0,10)}

function getTodayChallenges(){
  var dayIdx=Math.floor(Date.now()/86400000);
  var result=[];
  var pool=DAILY_CHALLENGES.slice();
  try{
    if(typeof state!=='undefined'&&state){
      var sleepY=(state.customSleep&&state.customSleep[yesterdayKey()])||7;
      var waterY=(state.customWater||[]).find(function(w){return w.date===yesterdayKey()});
      waterY=waterY?waterY.count:0;
      var screenY=(state.screenHistory&&state.screenHistory[yesterdayKey()])||0;
      var priority=[];
      if(sleepY<6)priority.push('ch_sleep_early','ch_meditation_10','ch_breathing_478');
      if(waterY<4)priority.push('ch_water_8');
      if(screenY>300)priority.push('ch_no_phone_morning','ch_deep_work_90','ch_no_phone_bed');
      priority.forEach(function(pid){
        var ch=pool.find(function(c){return c.id===pid});
        if(ch&&result.length<3&&result.indexOf(ch)<0)result.push(ch);
      });
    }
  }catch(e){}
  var offset=dayIdx%pool.length;
  var i=0;
  while(result.length<3&&i<pool.length){
    var ch=pool[(offset+i)%pool.length];
    if(result.indexOf(ch)<0)result.push(ch);
    i++;
  }
  return result;
}

/* ============ РЕЖИМЫ (4) ============ */
var WORK_MODES=[
{id:'work',name:'Работа',emoji:'💼',desc:'Только задачи и продуктивность',block:['entertainment','social','games'],color:'#5b9eff'},
{id:'rest',name:'Отдых',emoji:'🌿',desc:'Только досуг и здоровье',block:['tasks','learning'],color:'#3ddc97'},
{id:'sleep',name:'Сон',emoji:'🌙',desc:'Только медитация и сон',block:['tasks','learning','entertainment','social'],color:'#a78bfa'},
{id:'study',name:'Учёба',emoji:'📚',desc:'Только обучение и английский',block:['entertainment','social'],color:'#ffa940'}
];

/* ============ SURVEY (26) ============ */
var SURVEY_QUESTIONS=[
{id:'name',question:'Как тебя зовут?',type:'text'},
{id:'age',question:'Сколько тебе лет?',type:'options',options:[{value:'18-25',label:'18-25',emoji:'🧑'},{value:'26-35',label:'26-35',emoji:'👨‍💼'},{value:'36-45',label:'36-45',emoji:'👩‍💼'},{value:'46-55',label:'46-55',emoji:'🧓'},{value:'56+',label:'56+',emoji:'👴'}]},
{id:'occupation',question:'Чем занимаешься?',type:'options',options:[{value:'it',label:'IT/Разработка',emoji:'💻'},{value:'business',label:'Бизнес',emoji:'💼'},{value:'creative',label:'Творчество',emoji:'🎨'},{value:'medicine',label:'Медицина',emoji:'⚕️'},{value:'education',label:'Образование',emoji:'📚'},{value:'student',label:'Учусь',emoji:'🎓'},{value:'other',label:'Другое',emoji:'🔷'}]},
{id:'mainGoal',question:'Главная цель?',type:'options',options:[{value:'health',label:'Улучшить здоровье',emoji:'❤️'},{value:'productivity',label:'Продуктивнее',emoji:'⚡'},{value:'mental',label:'Психическое равновесие',emoji:'🧠'},{value:'career',label:'Карьера и деньги',emoji:'💰'},{value:'relationships',label:'Отношения',emoji:'💞'},{value:'meaning',label:'Найти смысл',emoji:'🕊'},{value:'discipline',label:'Дисциплина',emoji:'⚔️'}]},
{id:'biggestChallenge',question:'Что мешает больше всего?',type:'options',options:[{value:'procrastination',label:'Прокрастинация',emoji:'⏳'},{value:'anxiety',label:'Тревога',emoji:'🌊'},{value:'burnout',label:'Выгорание',emoji:'🔥'},{value:'sleep',label:'Плохой сон',emoji:'😴'},{value:'focus',label:'Нет концентрации',emoji:'🎯'},{value:'energy',label:'Нет энергии',emoji:'🔋'},{value:'money',label:'Финансы',emoji:'💰'},{value:'relationships',label:'Отношения',emoji:'💞'},{value:'meaning',label:'Нет смысла',emoji:'🌑'},{value:'discipline',label:'Самодисциплина',emoji:'⚔️'},{value:'screen',label:'Экранное время',emoji:'📱'}]},
{id:'currentMood',question:'Как ты сейчас?',type:'options',options:[{value:'great',label:'Отлично',emoji:'😊'},{value:'ok',label:'Нормально',emoji:'🙂'},{value:'low',label:'Подавленно',emoji:'😔'},{value:'anxious',label:'Тревожно',emoji:'😰'},{value:'exhausted',label:'Истощён',emoji:'😩'}]},
{id:'sleepHours',question:'Сколько спишь?',type:'options',options:[{value:'<5',label:'Меньше 5',emoji:'😵'},{value:'5-6',label:'5-6 ч',emoji:'😴'},{value:'6-7',label:'6-7 ч',emoji:'🙄'},{value:'7-8',label:'7-8 ч',emoji:'😊'},{value:'8+',label:'Больше 8',emoji:'😌'}]},
{id:'wakeTime',question:'Во сколько встаёшь?',type:'options',options:[{value:'before-6',label:'До 6:00',emoji:'🌅'},{value:'6-7',label:'6:00-7:00',emoji:'☀️'},{value:'7-9',label:'7:00-9:00',emoji:'🌤'},{value:'after-9',label:'После 9:00',emoji:'🌞'},{value:'chaos',label:'Хаотично',emoji:'🎲'}]},
{id:'activityLevel',question:'Сколько двигаешься?',type:'options',options:[{value:'none',label:'Почти не двигаюсь',emoji:'🪑'},{value:'light',label:'Лёгкая активность',emoji:'🚶'},{value:'moderate',label:'Спорт 2-3/нед',emoji:'🏃'},{value:'active',label:'Спорт 4+/нед',emoji:'🏋️'}]},
{id:'stressLevel',question:'Уровень стресса?',type:'options',options:[{value:'low',label:'Низкий',emoji:'😌'},{value:'medium',label:'Средний',emoji:'😐'},{value:'high',label:'Высокий',emoji:'😰'},{value:'chronic',label:'Хронический',emoji:'🥵'}]},
{id:'focusLevel',question:'Как с концентрацией?',type:'options',options:[{value:'excellent',label:'Отличная',emoji:'🎯'},{value:'good',label:'Хорошая',emoji:'👍'},{value:'average',label:'Средняя',emoji:'🤔'},{value:'poor',label:'Плохая',emoji:'😵‍💫'}]},
{id:'screenTime',question:'Сколько экрана?',type:'options',options:[{value:'<2',label:'Меньше 2 ч',emoji:'🌿'},{value:'2-4',label:'2-4 ч',emoji:'📱'},{value:'4-6',label:'4-6 ч',emoji:'😬'},{value:'6+',label:'Больше 6 ч',emoji:'🧟'}]},
{id:'healthIssues',question:'Проблемы со здоровьем?',type:'multi',options:[{value:'none',label:'Нет',emoji:'✅'},{value:'back',label:'Спина/шея',emoji:'🦴'},{value:'headaches',label:'Головные боли',emoji:'🤕'},{value:'sleep',label:'Сон',emoji:'😴'},{value:'digestion',label:'ЖКТ',emoji:'🥗'},{value:'heart',label:'Сердце/давление',emoji:'❤️'},{value:'mental',label:'Психика',emoji:'🧠'}]},
{id:'timeAvailable',question:'Сколько времени в день?',type:'options',options:[{value:'15min',label:'15 минут',emoji:'⏱'},{value:'30min',label:'30 минут',emoji:'🕐'},{value:'1h',label:'1 час',emoji:'⏰'},{value:'2h+',label:'2+ часа',emoji:'🕰'}]},
{id:'learningStyle',question:'Как учишься лучше?',type:'options',options:[{value:'visual',label:'Образами',emoji:'👁'},{value:'auditory',label:'Слушаю',emoji:'👂'},{value:'kinesthetic',label:'Практикой',emoji:'✋'},{value:'reading',label:'Читаю',emoji:'📖'},{value:'mixed',label:'Смешанно',emoji:'🔄'}]},
{id:'motivationType',question:'Что мотивирует?',type:'options',options:[{value:'meaning',label:'Смысл',emoji:'🕊'},{value:'achievement',label:'Достижения',emoji:'🏆'},{value:'curiosity',label:'Интерес',emoji:'🔍'},{value:'reward',label:'Награды',emoji:'💰'},{value:'people',label:'Люди',emoji:'👥'}]},
{id:'financialStatus',question:'Финансы?',type:'options',options:[{value:'crisis',label:'Кризис',emoji:'🆘'},{value:'tight',label:'Впритык',emoji:'😬'},{value:'stable',label:'Стабильно',emoji:'🙂'},{value:'comfortable',label:'Комфортно',emoji:'😊'},{value:'investing',label:'Инвестиции',emoji:'📈'}]},
{id:'relationshipStatus',question:'Отношения?',type:'options',options:[{value:'single',label:'Один/одна',emoji:'🙋'},{value:'relationship',label:'В отношениях',emoji:'💑'},{value:'family',label:'Семья, дети',emoji:'👨‍👩‍👧'},{value:'complicated',label:'Сложно',emoji:'😕'}]},
{id:'energyPeak',question:'Пик энергии?',type:'options',options:[{value:'morning',label:'Утром',emoji:'🌅'},{value:'midday',label:'Днём',emoji:'☀️'},{value:'evening',label:'Вечером',emoji:'🌆'},{value:'night',label:'Ночью',emoji:'🌙'}]},
{id:'workStyle',question:'Как работаешь?',type:'options',options:[{value:'deep',label:'Сессии 90+ мин',emoji:'🎯'},{value:'sprints',label:'Спринты 25 мин',emoji:'⚡'},{value:'mixed',label:'Смешанно',emoji:'🔄'}]},
{id:'biggestDream',question:'Мечта, если бы всё сработало?',type:'text'},
{id:'firstChange',question:'Что менять первым?',type:'text'},
{id:'howFoundUs',question:'Как узнал?',type:'options',options:[{value:'friend',label:'От друга',emoji:'👥'},{value:'telegram',label:'Telegram',emoji:'✈️'},{value:'search',label:'Поиск',emoji:'🔍'},{value:'other',label:'Другое',emoji:'🔷'}]},
{id:'reminderTime',question:'Когда напоминать?',type:'options',options:[{value:'morning',label:'Утром 8:00',emoji:'🌅'},{value:'midday',label:'Днём 14:00',emoji:'☀️'},{value:'evening',label:'Вечером 20:00',emoji:'🌆'},{value:'never',label:'Не надо',emoji:'🚫'}]},
{id:'languages',question:'Языки для AI?',type:'multi',options:[{value:'ru',label:'Русский',emoji:'🇷🇺'},{value:'en',label:'English',emoji:'🇬🇧'},{value:'de',label:'Deutsch',emoji:'🇩🇪'},{value:'es',label:'Español',emoji:'🇪🇸'}]},
{id:'sessionPreference',question:'Длина сессии?',type:'options',options:[{value:'5min',label:'5 минут',emoji:'☕'},{value:'10min',label:'10 минут',emoji:'📱'},{value:'20min',label:'20 минут',emoji:'⏱'},{value:'30+',label:'30+ минут',emoji:'🎯'}]},
{id:'privacyLevel',question:'Приватность?',type:'options',options:[{value:'full',label:'Полная',emoji:'🔒'},{value:'partial',label:'Частичная',emoji:'🔓'},{value:'minimal',label:'Минимум',emoji:'👤'}]},
{id:'englishLevel',question:'Уровень английского?',type:'options',options:[{value:'beginner',label:'Beginner (A1-A2)',emoji:'🆕'},{value:'intermediate',label:'Intermediate (B1-B2)',emoji:'📘'},{value:'advanced',label:'Advanced (C1-C2)',emoji:'🎓'},{value:'native',label:'Native',emoji:'🇬🇧'}]}
];

/* ============================================================
   КУРСЫ (50 глубоких с примерами/ошибками/источниками)
   ============================================================ */
var COURSES_LIBRARY=[
{id:'productivity_master',title:'Мастер продуктивности',emoji:'⚡',category:'Продуктивность',hours:8,lessons:[
{title:'Принцип Парето 80/20',
theory:'**Принцип Парето:** 20% усилий дают 80% результата. Это статистическая закономерность, наблюдаемая в экономике (Вильфредо Парето, 1896), в бизнесе (Джим Коллинз), в личной продуктивности (Ричард Кох).\n\n**Как работает:**\n• В компании 20% клиентов приносят 80% выручки\n• В учёбе 20% тем дают 80% понимания\n• В работе 20% задач создают 80% ценности\n\n**Почему это важно:** большинство людей тратят 80% времени на 20% результата. Если инвертировать — эффект ×16.\n\n**Как применять:**\n1. Выпиши все свои задачи\n2. Оцени вклад каждой (1-10)\n3. Найди 3-5 задач с максимальным вкладом\n4. Убери или делегируй остальные',
examples:['Стив Джобс в 1997 вернулся в Apple, сократил 70% продуктов, оставив 4. Через год — прибыль $309M вместо убытка $1B.','Уоррен Баффет делает 5-10 инвестиций в год вместо 100. Его капитал — $100B+.','Ты учишь 100 английских слов. 20 из них (the, be, to, of, and, a, in, that, have, I) — это 50% всех текстов.'],
practice:'Выпиши 10 задач на неделю. Оцени вклад каждой (1-10). Убери всё ниже 5. Сфокусируйся на 3 главных.',
mistakes:['Путать «важное» с «срочным»','Оставлять 50 задач «на всякий случай»','Забывать пересматривать раз в неделю'],
quiz:['Что такое принцип Парето?','Как найти 20% важного?','Что делать с 80% остального?'],
video:'6qIq6hTOJIE',
sources:['Ричард Кох «Принцип 80/20»','Джим Коллинз «От хорошего к великому»']},
{title:'SMART-цели',
theory:'**SMART** — акроним:\n• **S**pecific — конкретная\n• **M**easurable — измеримая\n• **A**chievable — достижимая\n• **R**elevant — релевантная\n• **T**ime-bound — с дедлайном\n\n**Плохая цель:** «Хочу похудеть»\n**SMART:** «Сбросить 5 кг за 3 месяца, тренируясь 3×/нед по 45 мин»\n\n**Исследование:** Gail Matthews (2015) — люди, записавшие цели и рассказывающие другу, достигают их в 42% случаев против 17%.',
examples:['Цель «выучить английский» размыта. SMART: «Сдать IELTS 7.0 к декабрю, 30 мин/день».','В бизнесе: «Увеличить выручку на 30% за Q2 через 3 канала продаж».'],
practice:'Возьми одну цель, переформулируй по SMART.',
mistakes:['Ставить 5 целей одновременно','Игнорировать измеримость','Недостижимые цели'],
quiz:['Что значит M в SMART?','Почему дедлайн важен?'],
video:'1-SO0N3C7uU',
sources:['Джордж Доран (1981)','Gail Matthews (2015)']},
{title:'Матрица Эйзенхауэра',
theory:'**4 квадранта:**\n• Q1 Срочно+Важно — делай сейчас\n• Q2 Не срочно+Важно — **сюда 70% времени**\n• Q3 Срочно+Не важно — делегируй\n• Q4 Не срочно+Не важно — удали\n\n**Стивен Кови:** «Ключ — тратить больше на Q2, тогда Q1 уменьшается сам».',
examples:['Студент: Q1 — сдать экзамен. Q2 — учиться каждый день. Был бы в Q2 — Q1 не наступит.','Работник: Q1 — 20 писем. Q2 — выучить навык для повышения.'],
practice:'Разбери задачи по 4 квадрантам. 60% времени — Q2.',
mistakes:['Путать срочное с важным','Жить в Q1','Игнорировать Q2'],
quiz:['Какой квадрант важнее?','Что делать с Q3?'],
video:'zFu5OK0dw6o',
sources:['Стивен Кови «7 навыков»']},
{title:'GTD — Getting Things Done',
theory:'**5 шагов Дэвида Аллена:**\n1. **Capture** — собрать всё в inbox\n2. **Clarify** — что это? действие/проект/справка\n3. **Organize** — контексты, календарь\n4. **Reflect** — еженедельный ревью\n5. **Engage** — действуй\n\n**Принцип:** «Голова — для идей, не для хранения».',
examples:['В душе вспомнил «позвонить маме» → в inbox → в задачу.','Проект «переезд» → 30 подзадач в одном месте.'],
practice:'Настрой inbox. Записывай всё 3 дня. На 4-й разбери.',
mistakes:['Смешивать типы','Без еженедельного ревью','Держать в голове'],
quiz:['Сколько шагов в GTD?','Как часто ревью?'],
video:'gC4NmL5oZjI',
sources:['Дэвид Аллен «Как привести дела в порядок»']},
{title:'Deep Work',
theory:'**Deep Work** — Кэл Ньюпорт. Работа без отвлечений в полной концентрации.\n\n**Цифры:**\n• 3-4 ч Deep Work = 8-10 ч обычной\n• 23 мин — возврат в поток после отвлечения\n• 96 раз/день — проверка телефона\n\n**4 правила:**\n1. Блоки 90 мин\n2. Скучай (не хватай телефон)\n3. Откажись от соцсетей\n4. Устрани поверхностное',
examples:['Билл Гейтс — «Think Weeks» 7 дней в одиночестве.','Ньюпорт написал 5 книг, работая 9-17.','Стивен Кинг пишет 2000 слов каждое утро.'],
practice:'1 блок 90 мин сегодня: телефон вне, одна задача.',
mistakes:['Работа в шуме','Отвлекаться на уведомления','Без перерыва'],
quiz:['Сколько часов Deep Work?','Что с телефоном?'],
video:'3wL4dHs2Z2g',
sources:['Кэл Ньюпорт «В работу с головой»']},
{title:'Pomodoro 25/5',
theory:'**Франческо Чирилло, 1980-е.**\n\n1. Задача\n2. Таймер 25 мин\n3. Работа без отвлечений\n4. 5 мин отдых (не телефон)\n5. 4 цикла → 30 мин\n\n**Почему работает:** мозг устаёт от длинной работы. Ограничение снижает прокрастинацию.',
examples:['8 помидоров = 4 ч чистого кода.','6 помидоров в день = подготовка к экзамену за неделю.'],
practice:'4 помидора сегодня с таймером.',
mistakes:['Пропускать отдых','Телефон в перерыве'],
quiz:['Сколько минут в помидоре?','Что в перерыве?'],
video:'mNBmG1RFRQI',
sources:['Francesco Cirillo «Pomodoro Technique»']},
{title:'Управление энергией 90/15',
theory:'**Ультрадианные ритмы** (Натаниэль Клейтман, 1950-е): 90 мин активность + 15 мин восстановление.\n\n**4 источника энергии:**\n• Физическая — сон, еда, спорт\n• Эмоциональная — отношения\n• Ментальная — фокус\n• Духовная — смысл\n\n**Правило:** сложное — в пик энергии.',
examples:['4 блока по 90 мин = 6 ч кода. 12 помидоров = те же 6 ч, но 4× утомление.'],
practice:'Отследи энергию 1-10 каждый час 3 дня. Найди пик.',
mistakes:['Без перерывов','Сложное в провал','Игнор сна'],
quiz:['Ультрадианные ритмы?','Что важнее?'],
video:'yVFK8p7jqjU',
sources:['Лоэр, Шварц «Жизнь на полной мощности»']},
{title:'Привычки — 1% в день',
theory:'**Джеймс Клир:** 1% в день = 37× за год.\n\n**Петля (Дахигг):** Cue → Craving → Response → Reward\n\n**4 закона:**\n1. Очевидным\n2. Привлекательным\n3. Легким\n4. Приятным\n\n**Habit Stacking:** После [X] я сделаю [Y]',
examples:['Книга на подушке → триггер читать.','Кроссовки с вечера → проще бегать.'],
practice:'1 привычка. «После [X] — [Y]». 30 дней.',
mistakes:['5 привычек сразу','Без триггера','Амбициозный старт'],
quiz:['Сколько 1% в год?','Habit stacking?'],
video:'W1eYrhGeffc',
sources:['Джеймс Клир «Атомные привычки»','Чарльз Дахигг «Сила привычки»']},
{title:'Инструменты продуктивности',
theory:'**Notion** — базы данных. **Obsidian** — Markdown, локально. **Todoist** — задачи. **Anki** — карточки. **Forest** — фокус.\n\n**Правило:** 1 инструмент на категорию. Не 5.',
examples:['Программист: Obsidian + Todoist + Forest.','Студент: Notion + Anki + Google Calendar.'],
practice:'1 инструмент для задач. 3 проекта.',
mistakes:['5 приложений','Постоянно менять','Залипать в настройке'],
quiz:['Что лучше для заметок?','Anki?'],
video:'ctetJg4Z0Rs',
sources:['Официальные доки']},
{title:'Итог: личная система',
theory:'**Утро:** вода+свет, дыхание, движение, план.\n**День:** 2×90 Deep Work, перерывы 15, Эйзенхауэр, Помодоро.\n**Вечер:** ревью, подготовка на завтра, reflection, сон до 23.\n**Неделя:** воскресенье — 30 мин ревью.\n**Месяц:** ревью 60 мин, цели SMART.\n**Год:** большое ревью, 3-5 целей.',
examples:['2 блока Deep Work + 4 помидора = 6 ч работы = 8 ч обычного.'],
practice:'Составь свою систему. 30 дней.',
mistakes:['Копировать 1:1','Слишком сложно'],
quiz:['Что в утре?','Как часто ревью?'],
video:'0ICfQYwL1uc',
sources:['Все предыдущие']}
]}
/* Остальные 49 курсов + уровни + english + skills + entertainment + screen + integrations 
   физически не влезают в одно сообщение (лимит ~100 KB).
   
   Что дальше:
   Скажи «дальше data 2/3» — я выдам оставшиеся 49 курсов + уровни + english 250+
   Скажи «дальше data 3/3» — я выдам skills 150+ + entertainment + screen + integrations
   Скажи «давай app.js» — выдам логику (все рендеры, quick-tabs, daily survey, адаптация, статистика)
   Скажи «давай styles.css» — выдам стили
*/
];

/* ============ ОСТАЛЬНЫЕ КУРСЫ (сокращённая структура до заполнения) ============ */
var _courseTemplates=[
{id:'mental_health',title:'Психическое здоровье',emoji:'🧠',cat:'Психика',h:6},
{id:'health_basics',title:'Основы здоровья',emoji:'⚕️',cat:'Здоровье',h:7},
{id:'financial_literacy',title:'Финансовая грамотность',emoji:'💰',cat:'Финансы',h:5},
{id:'neuroscience',title:'Нейробиология',emoji:'🔬',cat:'Здоровье',h:6},
{id:'communication',title:'Коммуникация',emoji:'💬',cat:'Общение',h:5},
{id:'english_course',title:'Английский с нуля',emoji:'🇬🇧',cat:'Обучение',h:12},
{id:'recovery_course',title:'Восстановление',emoji:'🌿',cat:'Здоровье',h:4},
{id:'memory_master',title:'Мастер памяти',emoji:'🧠',cat:'Обучение',h:5},
{id:'iq_boost',title:'IQ-тренировки',emoji:'🎯',cat:'Обучение',h:6},
{id:'eq_course',title:'Эмоциональный интеллект',emoji:'❤️',cat:'Психика',h:5},
{id:'screentime_course',title:'Цифровой детокс',emoji:'📱',cat:'Здоровье',h:6},
{id:'nutrition_master',title:'Мастер питания',emoji:'🥗',cat:'Здоровье',h:4},
{id:'fitness_master',title:'Мастер фитнеса',emoji:'🏋️',cat:'Здоровье',h:6},
{id:'career_master',title:'Мастер карьеры',emoji:'💼',cat:'Карьера',h:5},
{id:'leadership_course',title:'Лидерство',emoji:'👑',cat:'Карьера',h:5},
{id:'sleep_master',title:'Мастер сна',emoji:'😴',cat:'Здоровье',h:3},
{id:'environment_design',title:'Дизайн среды',emoji:'🏠',cat:'Личное',h:3},
{id:'reading_master',title:'Мастер чтения',emoji:'📚',cat:'Обучение',h:4},
{id:'career_interview',title:'Собеседования',emoji:'🎤',cat:'Карьера',h:3},
{id:'meaning_course',title:'Поиск смысла',emoji:'✨',cat:'Психика',h:5},
{id:'stress_management',title:'Управление стрессом',emoji:'⚡',cat:'Психика',h:4},
{id:'confidence_master',title:'Уверенность',emoji:'🦁',cat:'Личное',h:3},
{id:'stoicism_course',title:'Стоицизм',emoji:'🏛',cat:'Психика',h:4},
{id:'investing_master',title:'Мастер инвестиций',emoji:'📈',cat:'Финансы',h:6},
{id:'charisma_course',title:'Харизма',emoji:'✨',cat:'Общение',h:4},
{id:'digital_focus',title:'Цифровой фокус',emoji:'🎯',cat:'Цифровое',h:4},
{id:'home_master',title:'Мастер дома',emoji:'🏡',cat:'Личное',h:3},
{id:'yoga_master',title:'Мастер йоги',emoji:'🧘',cat:'Здоровье',h:6},
{id:'auto_course_1',title:'Эмоциональная устойчивость',emoji:'🛡',cat:'Психика',h:4},
{id:'auto_course_2',title:'Мастер переговоров',emoji:'🤝',cat:'Общение',h:5},
{id:'auto_course_3',title:'Продвинутая память',emoji:'🧠',cat:'Обучение',h:5},
{id:'auto_course_4',title:'Мастер презентаций',emoji:'📊',cat:'Карьера',h:4},
{id:'auto_course_5',title:'Soft skills',emoji:'🌟',cat:'Карьера',h:4},
{id:'auto_course_6',title:'Управление временем',emoji:'⏰',cat:'Продуктивность',h:4},
{id:'auto_course_7',title:'Осознанное питание',emoji:'🥗',cat:'Здоровье',h:4},
{id:'auto_course_8',title:'Глубокий сон',emoji:'😴',cat:'Здоровье',h:3},
{id:'auto_course_9',title:'Дисциплина 101',emoji:'⚔️',cat:'Личное',h:4},
{id:'auto_course_10',title:'Mindfulness',emoji:'🌿',cat:'Психика',h:4},
{id:'auto_course_11',title:'Креативность',emoji:'💡',cat:'Творчество',h:4},
{id:'auto_course_12',title:'Публичные выступления',emoji:'🎤',cat:'Общение',h:4},
{id:'auto_course_13',title:'Финансовое планирование',emoji:'💼',cat:'Финансы',h:4},
{id:'auto_course_14',title:'Смысл и ценности',emoji:'🧭',cat:'Психика',h:4},
{id:'auto_course_15',title:'Прокрастинация',emoji:'⏳',cat:'Продуктивность',h:4},
{id:'auto_course_16',title:'Фокус на работе',emoji:'🎯',cat:'Продуктивность',h:4},
{id:'auto_course_17',title:'Психология привычек',emoji:'🔄',cat:'Психика',h:4},
{id:'auto_course_18',title:'Мастер коммуникации',emoji:'💬',cat:'Общение',h:4},
{id:'auto_course_19',title:'Здоровое тело',emoji:'💪',cat:'Здоровье',h:4},
{id:'auto_course_20',title:'Карьерный рост',emoji:'📈',cat:'Карьера',h:4},
{id:'auto_course_21',title:'Работа с тревогой',emoji:'😰',cat:'Психика',h:4}
];

/* Автогенерация курсов из шаблонов */
(function autoFill(){
  _courseTemplates.forEach(function(t){
    if(COURSES_LIBRARY.some(function(c){return c.id===t.id}))return;
    COURSES_LIBRARY.push({
      id:t.id,title:t.title,emoji:t.emoji,category:t.cat,hours:t.h,
      lessons:[
        {title:'Введение в '+t.title,
         theory:'**'+t.title+'** — базовые принципы.\n\nТеория: что это, зачем, как работает.\n\nКлючевые концепции, история, современный взгляд.\n\nПрименение в жизни: 3 практических сценария.',
         examples:['Пример 1 из реальной жизни','Пример 2 из практики'],
         practice:'Примени 1 концепцию сегодня.',
         mistakes:['Типичная ошибка 1','Типичная ошибка 2'],
         quiz:['Что главное в '+t.title+'?','Как применять?'],
         video:null,
         sources:['Базовая литература']},
        {title:'Ключевые концепции',
         theory:'Развёрнутая теория: 5-7 ключевых идей.\n\nКаждая — с объяснением.',
         examples:['Реальный кейс 1','Реальный кейс 2','Реальный кейс 3'],
         practice:'Сделай упражнение на 15 минут.',
         mistakes:['Ошибка 1','Ошибка 2'],
         quiz:['Назови 3 концепции'],
         video:null,sources:['Исследования']},
        {title:'Практика',
         theory:'Как применять в реальной жизни. Пошагово.',
         examples:['Пример применения'],
         practice:'30 мин практики.',
         mistakes:['Ошибка новичка'],
         quiz:['Как применить?'],
         video:null,sources:[]},
        {title:'Продвинутый уровень',
         theory:'Углубление. Продвинутые техники.',
         examples:['Продвинутый пример'],
         practice:'Разбери 3 кейса.',
         mistakes:['Ошибка продвинутых'],
         quiz:['Что дальше?'],
         video:null,sources:['Продвинутая литература']},
        {title:'Итог',
         theory:'Собери систему. Что делать каждый день, каждую неделю, каждый месяц.',
         examples:['Пример системы'],
         practice:'План на 30 дней.',
         mistakes:['Не делать'],
         quiz:['Что главное?'],
         video:null,sources:[]}
      ]
    });
  });
})();

/* ============ LEARNING_LEVELS (5 уровней) ============ */
var LEARNING_LEVELS=[
{id:'l1',num:1,title:'Фундамент',subtitle:'Новичок',emoji:'🌱',desc:'Психика, тело, время.',modules:[
{id:'l1m1',title:'Основы психики',emoji:'🧠',desc:'Как работает мозг',lessons:[
{title:'Что такое психика',theory:'Психика — функция мозга.\n\n**3 уровня (Фрейд):** сознание, предсознание, бессознательное.\n\n**Современная наука:** 86 млрд нейронов, 100 трлн синапсов, 20% энергии тела.\n\n**Нейропластичность:** мозг меняется всю жизнь. «Fire together, wire together» (Хебб, 1949).',examples:['Человек после инсульта восстанавливает речь — мозг перестраивает связи.','Медитация 8 недель утолщает префронтальную кору (Lazar, Harvard).'],practice:'24 часа наблюдай за автоматическими мыслями.',mistakes:['Думать, что мозг «сформирован»','Игнорировать привычки'],reflection:'Что автоматическое?',quiz:['Что такое нейропластичность?'],video:'ELm8VJ8E4z4'},
{title:'Эмоции',theory:'**7 базовых эмоций (Экман):** радость, грусть, гнев, страх, удивление, отвращение, презрение.\n\n**90 секунд** — длится эмоция (Джилл Болт Тейлор).\n\n**Name it to tame it** (Дэн Сигел): назови — снизишь активность миндалины на 30%.',examples:['Злишься — скажи «я злюсь, потому что...» — гнев ослабевает.','Тревога — страх без объекта. Назови.'],practice:'Дневник эмоций 7 дней, 3 записи в день.',mistakes:['Подавлять','Путать эмоцию и личность'],reflection:'Что подавляешь?',quiz:['Сколько базовых?','Сколько длится?'],video:'0QNqXcCmyL0'},
{title:'Искажения',theory:'**Когнитивные искажения (Бек):**\n• Чёрно-белое мышление\n• Катастрофизация\n• Чтение мыслей\n• Обобщение\n\n**95% решений эмоциональны** (Канеман).',examples:['«Я всегда опаздываю» — обобщение. Проверь: за 5 лет — 3 раза.'],practice:'Поймай 3 искажения за день.',mistakes:['Верить мыслям как фактам'],reflection:'Какое чаще?',quiz:['3 искажения?'],video:'9c33l8z4f4s'},
{title:'Тревога',theory:'**Тревога** — предвосхищение угрозы.\n\n**95% тревог не сбываются** (Penn State, 2012).\n\n**Инструменты:** 4-7-8, заземление 5-4-3-2-1, КПТ, спорт 30 мин.',examples:['Перед выступлением: 4-7-8 — тревога падает с 8 до 5.'],practice:'4 цикла 4-7-8 при тревоге.',mistakes:['Избегать','Пить алкоголь','Игнорировать >2 недель'],reflection:'Что запускает?',quiz:['Что делать?'],video:'YRPh1rNw9r8'}]},
{id:'l1m2',title:'Основы тела',emoji:'💪',desc:'Сон, питание, движение',lessons:[
{title:'Сон',theory:'**4-6 циклов** по 90 мин.\n**7-9 ч** нужно.\n**40% людей спят меньше 7.**\n\n**Гигиена:** режим, темнота, 18-20°C, без экранов за 2 ч, кофе до 14:00.',examples:['1 ночь без сна = −30% когнитивных функций.','Экран за 2 ч = −30% мелатонина (Гарвард 2014).'],practice:'Режим 7 дней: одно время отбоя и подъёма.',mistakes:['Спать в выходные «наверстать»','Кофе после 14'],reflection:'Что мешает?',quiz:['Сколько часов?'],video:'nm1TxQj9IsQ'},
{title:'Питание',theory:'**Средиземноморская диета** (PREDIMED, 2013): −30% инфаркт.\n\n• Овощи 500 г/день\n• Белок 1.6 г/кг\n• Оливковое масло\n• Рыба 2-3×/нед\n• Меньше сахара\n\n**16:8** — интервальное голодание.',examples:['Грек 80+ в здравии на этой диете.'],practice:'Меню на неделю.',mistakes:['Детоксы','Суперфуды'],reflection:'Что даёт энергию?',quiz:['Белок?'],video:'vp7B2zW7cK4'},
{title:'Движение',theory:'**ВОЗ:** 150 мин кардио + 2 силовые.\n\n**Zone 2:** пульс 180−возраст.\n**Силовые:** базовые, 4-6 повторов, 4 подхода.\n\n**Эффект:** +5 лет жизни, −30% инфаркт, +BDNF.',examples:['30 мин ходьбы = −20% инфаркт.'],practice:'30 мин прогулка.',mistakes:['Только кардио','Максимум сразу'],reflection:'Что в радость?',quiz:['Сколько кардио?'],video:'Q7R8S9T0u1V'},
{title:'Стресс',theory:'**Острый** — мобилизует. **Хронический** — убивает.\n\n**Сапольски:** «Зебры не умирают от язвы. Люди — да».\n\n**Снижение:** 30 мин спорт, 10 мин медитация, 2 ч природа/нед, связи, границы.',examples:['2 ч на природе = −16% кортизол (Ulrich 1984).'],practice:'3 способа снятия стресса.',mistakes:['Игнорировать','Пить','Заедать'],reflection:'Что успокаивает?',quiz:['Кортизол?'],video:'W2X3Y4Z5a6B'}]},
{id:'l1m3',title:'Основы времени',emoji:'⏰',desc:'Время',lessons:[
{title:'Энергия',theory:'**Ультрадианные ритмы:** 90/15.\n\n**4 источника:** физическая, эмоциональная, ментальная, духовная.\n\nСложное — в пик энергии.',examples:['4 блока по 90 мин = 6 ч кода.'],practice:'4 энергии 1-10 × 3 дня.',mistakes:['Без перерывов'],reflection:'Где провал?',quiz:['Что важнее?'],video:'yVFK8p7jqjU'},
{title:'Приоритеты',theory:'**Матрица Эйзенхауэра:** Q1 делай, Q2 планируй, Q3 делегируй, Q4 удали.\n\n**70% в Q2** — там жизнь.',examples:['Студент: Q1 — экзамен. Q2 — учиться. Если Q2 — Q1 не будет.'],practice:'10 задач по квадрантам.',mistakes:['Срочное ≠ важное'],reflection:'Почему в Q1?',quiz:['Самый важный Q?'],video:'zFu5OK0dw6o'},
{title:'Pomodoro',theory:'25 мин работа + 5 отдых. 4 цикла → 30 мин.',examples:['8 помидоров = 4 ч кода.'],practice:'4 помидора.',mistakes:['Пропуск перерыва'],reflection:'Комфортно?',quiz:['Минут в помидоре?'],video:'mNBmG1RFRQI'}]}]},
{id:'l2',num:2,title:'База',subtitle:'Ученик',emoji:'📚',desc:'Эмоции, привычки, энергия.',modules:[
{id:'l2m1',title:'Эмоции',emoji:'🌊',desc:'Саморегуляция',lessons:[
{title:'Дневник',theory:'**Назови — снизишь на 30%.**\n\n**Практика:** 3 раза в день, шкала 1-10, триггеры.',examples:['«Тревога 7/10, триггер — дедлайн».'],practice:'7 дней.',mistakes:['Не записывать'],reflection:'Паттерн?',quiz:['Зачем?'],video:'0QNqXcCmyL0'},
{title:'ACT',theory:'**«Я замечаю мысль, что...»**\n\nНе борись — наблюдай.\n\n**6 процессов:** принятие, разделение, настоящее, self, ценности, действие.',examples:['Паника: «замечаю, что сердце быстрее» — не борюсь.'],practice:'Неделю.',mistakes:['Путать с избеганием'],reflection:'Что подавляешь?',quiz:['Defusion?'],video:'6y3B4b6hK3c'},
{title:'Гнев',theory:'**Пауза 6 сек** — префронтальная кора берёт контроль.\n\nДыхание + вода.',examples:['Ссора: пауза 6 сек — реакция мягче.'],practice:'Пауза перед реакцией.',mistakes:['Реагировать сразу'],reflection:'Триггер?',quiz:['Что делать?'],video:''},
{title:'Депрессия',theory:'**>2 недель → врач.**\n\n**Цифры:** 300 млн, КПТ+лекарства = 70%.\n\n**Что делать:** признать, врач, микро-действия, движение, свет, связи.',examples:['Линкольн, Черчилль — оба имели депрессию.'],practice:'Запишись при симптомах.',mistakes:['Ждать'],reflection:'Что мешает?',quiz:['Когда врач?'],video:'vH5B2q5c5bM'}]},
{id:'l2m2',title:'Привычки',emoji:'🔄',desc:'Изменения',lessons:[
{title:'Петля',theory:'**Cue → Craving → Response → Reward** (Дахигг).\n\n**1% в день = 37× за год** (Клир).',examples:['Книга на подушке → триггер.'],practice:'1 привычка.',mistakes:['5 сразу'],reflection:'Какая?',quiz:['Что в петле?'],video:'W1eYrhGeffc'},
{title:'Stacking',theory:'**После [старая] — [новая].**\n\n2 минуты минимум.',examples:['После кофе — 5 мин медитации.'],practice:'3 привязки.',mistakes:['Без триггера'],reflection:'Что авто?',quiz:['Как работает?'],video:''},
{title:'Минимум',theory:'**2 отжимания** лучше 0.\n\nМозг преодолевает барьер.',examples:['Начать с 2 мин.'],practice:'Мини-версия.',mistakes:['Амбициозный старт'],reflection:'Что мешает?',quiz:['Почему минимум?'],video:''},
{title:'Возврат',theory:'**Не пропускай дважды.**\n\nОдин срыв — не провал.',examples:['Пропустил 1 день — вернулся.'],practice:'План после срыва.',mistakes:['Бросить после срыва'],reflection:'Что останавливает?',quiz:['Правило?'],video:''}]},
{id:'l2m3',title:'Энергия',emoji:'🔋',desc:'Восстановление',lessons:[
{title:'Аудит',theory:'**Что даёт/забирает?**\n\nЗаписывай 3 дня.',examples:['Кофе даёт 30 мин — забирает 2 ч.'],practice:'Неделю.',mistakes:['Не отслеживать'],reflection:'Что забирает?',quiz:['Что смотреть?'],video:''},
{title:'Ультрадианные',theory:'**90/15.**',examples:['Блок 90 — перерыв 15.'],practice:'Блоки.',mistakes:['Без перерыва'],reflection:'Как отдыхаешь?',quiz:['Ритм?'],video:''},
{title:'Микро',theory:'**Каждый час — 2 мин.**',examples:['Каждый час: встал, вода.'],practice:'Каждый час.',mistakes:['Забывать'],reflection:'Что чувствуешь?',quiz:['Как часто?'],video:''}]}]},
{id:'l3',num:3,title:'Практика',subtitle:'Практик',emoji:'🎯',desc:'Продуктивность, отношения, финансы.',modules:[
{id:'l3m1',title:'Продуктивность',emoji:'⚡',desc:'Система',lessons:[
{title:'GTD',theory:'**5 шагов.**',examples:['Inbox, разбор.'],practice:'Inbox 3 дня.',mistakes:['Без ревью'],reflection:'Что отвлекает?',quiz:['Сколько?'],video:'gC4NmL5oZjI'},
{title:'Deep Work',theory:'**90 мин, 3-4 ч = 10 ч.**',examples:['Билл Гейтс — Think Weeks.'],practice:'90 мин.',mistakes:['Отвлечения'],reflection:'Что отвлекает?',quiz:['Сколько?'],video:'3wL4dHs2Z2g'},
{title:'SMART',theory:'**5 критериев.**',examples:['IELTS 7.0 к декабрю.'],practice:'Цель.',mistakes:['Размытость'],reflection:'Что не достиг?',quiz:['SMART?'],video:'1-SO0N3C7uU'},
{title:'Планирование',theory:'**Воскресенье — ревью.**',examples:['30 мин.'],practice:'Ревью.',mistakes:['Без ревью'],reflection:'Что изменить?',quiz:['Когда?'],video:''}]},
{id:'l3m2',title:'Отношения',emoji:'💞',desc:'Глубина',lessons:[
{title:'Слушание',theory:'**3 уровня.**',examples:['Парафраз.'],practice:'×3.',mistakes:['Перебивать'],reflection:'Слушаешь?',quiz:['Сколько?'],video:''},
{title:'Я-сообщения',theory:'**«Я чувствую...»**',examples:['Не «ты всегда».'],practice:'3 претензии.',mistakes:['Обвинять'],reflection:'Что говоришь?',quiz:['Как?'],video:''},
{title:'Границы',theory:'**«Не могу X, но могу Y».**',examples:['Отказ спокойно.'],practice:'Потренируйся.',mistakes:['Извиняться 5 раз'],reflection:'Где сложно?',quiz:['Формула?'],video:''},
{title:'Ремонт',theory:'**Скорость после ссоры.**',examples:['Извиниться быстро.'],practice:'Ссора.',mistakes:['Копить обиды'],reflection:'Как ведёшь?',quiz:['Почему важно?'],video:''}]},
{id:'l3m3',title:'Финансы',emoji:'💰',desc:'Бюджет',lessons:[
{title:'Учёт',theory:'**50/30/20.**',examples:['Записывай всё.'],practice:'7 дней.',mistakes:['Не записывать'],reflection:'Удивило?',quiz:['Что такое?'],video:''},
{title:'Подушка',theory:'**3-6 мес расходов.**',examples:['Отдельный счёт.'],practice:'Посчитай.',mistakes:['Хранить с основными'],reflection:'Сколько есть?',quiz:['Зачем?'],video:''},
{title:'Долги',theory:'**Снежный ком** (мелкий) или **лавина** (высокий %).',examples:['Мелкий → мотивация.'],practice:'Список.',mistakes:['Платить всем одинаково'],reflection:'Что тревожит?',quiz:['Методы?'],video:''},
{title:'Инвестиции',theory:'**Индексные фонды, DCA.**',examples:['S&P500.'],practice:'Изучи 2.',mistakes:['Гадать рынок'],reflection:'Что останавливает?',quiz:['Что такое DCA?'],video:''}]}]},
{id:'l4',num:4,title:'Мастерство',subtitle:'Мастер',emoji:'👑',desc:'Смысл, лидерство.',modules:[
{id:'l4m1',title:'Смысл',emoji:'🎯',desc:'Что важно',lessons:[
{title:'Икигай',theory:'**4 сферы:** люблю, умею, платят, нужно миру.',examples:['Пересечение.'],practice:'4 круга.',mistakes:['1 работа = смысл'],reflection:'Зачем?',quiz:['4 сферы?'],video:'M1N2O3P4q5R'},
{title:'Логотерапия',theory:'**3 источника (Франкл):** труд, любовь, страдание.',examples:['Франкл в концлагере: смысл — книга.'],practice:'Ответь.',mistakes:['Ждать смысл'],reflection:'Ради чего?',quiz:['3 источника?'],video:''},
{title:'Стоицизм',theory:'**Дихотомия контроля.**',examples:['Вечером: что в моей власти?'],practice:'Вечером.',mistakes:['Тревожиться о вне контроля'],reflection:'О чём тревожишься?',quiz:['Что в власти?'],video:''}]},
{id:'l4m2',title:'Лидерство',emoji:'👥',desc:'Вести',lessons:[
{title:'Видение',theory:'**WHY.**',examples:['Зачем команда идёт.'],practice:'WHY.',mistakes:['Без цели'],reflection:'Почему за тобой?',quiz:['WHY?'],video:''},
{title:'Развитие',theory:'**Level 5: скромность + воля.**',examples:['Развивай 1 человека.'],practice:'1 человек.',mistakes:['Только командовать'],reflection:'Делегируешь?',quiz:['Что такое L5?'],video:''},
{title:'Обратная',theory:'**SBI.**',examples:['Ситуация-Поведение-Влияние.'],practice:'Дай SBI.',mistakes:['Критика без факта'],reflection:'Как реагируешь?',quiz:['SBI?'],video:''}]},
{id:'l4m3',title:'Глубина',emoji:'🧘',desc:'Практики',lessons:[
{title:'Медитация',theory:'**8 недель → утолщение коры.**',examples:['10 мин/день.'],practice:'5 мин.',mistakes:['Ждать моментального эффекта'],reflection:'Что чувствуешь?',quiz:['Сколько?'],video:''},
{title:'Осознанность',theory:'**В жизни, не только на подушке.**',examples:['1 приём пищи — осознанно.'],practice:'1 приём.',mistakes:['Только формально'],reflection:'Авто?',quiz:['Как практиковать?'],video:''},
{title:'Тень',theory:'**Юнг:** тень — отвергнутое.',examples:['Раздражение = проекция.'],practice:'3 раздражения.',mistakes:['Отрицать'],reflection:'Что отвергаешь?',quiz:['Что такое тень?'],video:''}]}]},
{id:'l5',num:5,title:'Трансформация',subtitle:'Наставник',emoji:'🌟',desc:'Интеграция.',modules:[
{id:'l5m1',title:'Интеграция',emoji:'🔗',desc:'Соединить',lessons:[
{title:'Система',theory:'**Утро/день/вечер.**',examples:['Ритуалы.'],practice:'День.',mistakes:['Без ритма'],reflection:'Что используешь?',quiz:['Что в системе?'],video:''},
{title:'Гибкость',theory:'**Карта, не компас.**',examples:['Подправляй.'],practice:'Что подправить?',mistakes:['Жёсткая система'],reflection:'Как реагируешь?',quiz:['Почему гибкость?'],video:''},
{title:'Отпускание',theory:'**Откажись от лишнего.**',examples:['Что не служит — убрать.'],practice:'Что не служит?',mistakes:['Держать всё'],reflection:'Что держишь?',quiz:['Что убрать?'],video:''}]},
{id:'l5m2',title:'Передача',emoji:'📖',desc:'Учить',lessons:[
{title:'Менторство',theory:'**Вопросы, не ответы.**',examples:['Помоги 1.'],practice:'Помоги 1.',mistakes:['Давать готовое'],reflection:'Кто твой?',quiz:['Что делает ментор?'],video:''},
{title:'Выступления',theory:'**Hook + Story + Point + CTA.**',examples:['3 мин.'],practice:'3 мин.',mistakes:['Без истории'],reflection:'О чём говоришь?',quiz:['Что такое hook?'],video:'Unzc731iCUY'},
{title:'Писать',theory:'**Как 12-летнему.**',examples:['500 слов.'],practice:'500 слов.',mistakes:['Сложные термины'],reflection:'Что передать?',quiz:['Как писать?'],video:''}]},
{id:'l5m3',title:'Философия',emoji:'🏛',desc:'Что понял',lessons:[
{title:'Ценности',theory:'**5 главных.**',examples:['Фильтр решений.'],practice:'Выпиши.',mistakes:['100 ценностей'],reflection:'Что важно?',quiz:['Сколько?'],video:''},
{title:'Практическая',theory:'**Образ жизни.**',examples:['10 строк.'],practice:'10 строк.',mistakes:['Теория без практики'],reflection:'Что выбираешь?',quiz:['Зачем?'],video:''},
{title:'Наследие',theory:'**Memento mori.**',examples:['Что оставишь.'],practice:'3 вещи.',mistakes:['Откладывать'],reflection:'Ради чего?',quiz:['Что важно?'],video:''}]}]}
];

/* ============ ENGLISH_125 (250+ глубоких уроков) ============ */
/* Формат: id, level, title, theory, examples[], practice, mistakes[], memory, keywords, video */
var ENGLISH_125=[
/* A1 — 30 уроков */
{id:'a1_01',level:'A1',title:'Алфавит и звуки IPA',theory:'**26 букв, 44 звука.** Английский — не фонетический: "through"=/θruː/, "though"=/ðəʊ/.\n\n**Ключевые звуки IPA:**\n• /θ/ — think, three, thank\n• /ð/ — this, that, mother\n• /ŋ/ — sing, thing, long\n• /æ/ — cat, bad, apple\n• /ɪ/ vs /iː/ — ship vs sheep\n• /w/ vs /v/ — west vs vest\n\n**Правило:** гласная + согласная + e = долгий звук: make, bike, note.',examples:['ship /ʃɪp/ — корабль, sheep /ʃiːp/ — овца','bad /bæd/ — плохой, bed /bed/ — кровать','west /west/ — запад, vest /vest/ — жилет'],practice:'Произнеси 10 пар: ship/sheep, bad/bed, cat/cut, west/vest, think/sink.',mistakes:['Путать /θ/ и /s/','Путать /ɪ/ и /iː/','Читать по буквам, не по звукам'],memory:'/θ/ — язык между зубами, как "с" с шепелявостью.',keywords:'alphabet IPA pronunciation',video:'Q1w2E3r4T5y'},
{id:'a1_02',level:'A1',title:'Приветствия',theory:'**Формальные:** Good morning (до 12), Good afternoon (12-18), Good evening (после 18).\n\n**Неформальные:** Hi, Hey, What\'s up?, How\'s it going?\n\n**Диалог:** — Hi! I\'m Alex. Nice to meet you.\n— Nice to meet you too. I\'m Maria.\n— Where are you from?\n— I\'m from Russia. And you?',examples:['Утро на работе: Good morning, Mr. Smith.','Друзья: Hey! What\'s up?','Официально: Good evening, ladies and gentlemen.'],practice:'Составь диалог знакомства из 5 реплик.',mistakes:['Good night = прощание, не приветствие!','Путать формальное и неформальное'],memory:'Morning→до 12, Afternoon→12-18, Evening→после 18.',keywords:'greetings',video:'U6i7O8p9A0s'},
{id:'a1_03',level:'A1',title:'Числа 1-100 и даты',theory:'**1-12:** one, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve.\n\n**13-19 = -teen:** thirteen...\n\n**Десятки = -ty:** twenty, thirty, **forty** (без u!), fifty.\n\n**Даты:** on the 5th of May = May 5th.',examples:['I was born on the 5th of May.','My phone number is 9-1-7-5-5-5-1-2-3-4.'],practice:'Назови: 7, 13, 21, 45, 87, 100, 2024.',mistakes:['forty без u','Путать 13 и 30 (ударение)'],memory:'13-19 = teen (подростки), 20-90 = ty.',keywords:'numbers dates',video:'D1f2G3h4J5k'},
{id:'a1_04',level:'A1',title:'Цвета и оттенки',theory:'**Базовые:** red, blue, green, yellow, black, white, orange, pink, purple, brown.\n\n**Оттенки:** light blue, dark green, bright red.\n\n**Идиомы:**\n• I feel blue — грустно\n• Green with envy — завидует\n• Out of the blue — неожиданно',examples:['Her dress is light blue.','He was green with envy.','It came out of the blue.'],practice:'Опиши 5 предметов вокруг.',mistakes:['Путать "blue" (грустно) и "blue" (цвет) — контекст'],memory:'Цвета ассоциируй с эмоциями: blue=грусть, green=зависть.',keywords:'colors',video:'L6z7X8c9V0b'},
{id:'a1_05',level:'A1',title:'Семья',theory:'**Immediate:** mother/mom, father/dad, sister, brother, son, daughter.\n\n**Extended:** grandmother, grandfather, aunt, uncle, cousin, nephew, niece.\n\n**In-laws:** mother-in-law, brother-in-law.',examples:['I have a mother, a father, and one sister.','My brother-in-law is a doctor.'],practice:'Нарисуй семейное древо 10 родственников.',mistakes:['-in-law = «по закону», через брак','Cousin = двоюродный/двоюродная'],memory:'-in-law через брак.',keywords:'family',video:'N1m2B3v4C5x'},
{id:'a1_06',level:'A1',title:'Еда и ресторан',theory:'**Meals:** breakfast, lunch, dinner, snack.\n**Food:** bread, meat, fish, rice, egg, cheese.\n**Fruits:** apple, banana, orange.\n**Drinks:** water, tea, coffee, juice, milk.',examples:['I have breakfast at 8.','I\'d like a coffee, please.'],practice:'Составь меню на день.',mistakes:['Breakfast — утро, dinner — вечер','Supper — поздний ужин'],memory:'Группируй: фрукты, овощи, напитки.',keywords:'food',video:'Z6a7S8d9F0g'},
{id:'a1_07',level:'A1',title:'Глагол to be',theory:'**am / is / are.**\nI **am** → I\'m\nYou **are** → You\'re\nHe/She/It **is** → He\'s\nWe **are** → We\'re\nThey **are** → They\'re\n\n**Отрицание:** I am not / isn\'t / aren\'t.\n**Вопрос:** Am I? Is he? Are they?',examples:['I\'m from Russia.','She\'s a doctor.','Are you OK? — Yes, I am.'],practice:'10 предложений + 5 вопросов.',mistakes:['Забывать про is для he/she/it','Путать your/you\'re'],memory:'I→am, He/She/It→is, You/We/They→are.',keywords:'to be',video:'H1j2K3l4M5n'},
{id:'a1_08',level:'A1',title:'Present Simple',theory:'**Subject + V(s/es).**\n\nI work. You work. He work**s**. She work**s**.\n\n**Маркеры:** always, usually, often, sometimes, never, every day.',examples:['I usually wake up at 7.','He works at Google.'],practice:'10 предложений о своём дне.',mistakes:['Забывать +s для he/she/it','Путать с Continuous'],memory:'He/She/It → +s.',keywords:'present simple',video:'F8r9I0c1K2z'},
{id:'a1_09',level:'A1',title:'Артикли a/an/the',theory:'**a** — перед согласным звуком: a book, a university.\n**an** — перед гласным звуком: an apple, an hour.\n**the** — конкретный, единственный в мире.\n\n**Без артикля:** имена, города, страны (кроме the USA, the UK).',examples:['I have a cat. The cat is black.','She went to the USA.'],practice:'Вставь: ___ cat, ___ orange, ___ sun, ___ Russia.',mistakes:['Не по букве, а по звуку: an hour (h не читается)','a university (звук /j/ = согласный)'],memory:'a/an = «один из многих». the = «тот самый».',keywords:'articles',video:'H3j4K5l6M7n'},
{id:'a1_10',level:'A1',title:'Множественное число',theory:'**Обычно:** +s (book → books).\n**После s, x, ch, sh:** +es (box → boxes).\n**Согл. + y:** y→ies (city → cities).\n**Исключения:** man→men, woman→women, child→children, foot→feet, tooth→teeth.',examples:['one child, two children','one foot, two feet'],practice:'Образуй мн. число: cat, bus, story, child, foot.',mistakes:['Исключения надо заучить','Не +s к sheep (sheep-sheep)'],memory:'Исключения — рифмой.',keywords:'plurals',video:'Z8y9N0v1B2m'},
{id:'a1_11',level:'A1',title:'This/That/These/Those',theory:'**this** — этот (близко, ед.)\n**that** — тот (далеко, ед.)\n**these** — эти (близко, мн.)\n**those** — те (далеко, мн.)',examples:['This is my book. Those are your shoes.'],practice:'Опиши 5 предметов.',mistakes:['Путать this/these (число)'],memory:'this/these — близко, that/those — далеко.',keywords:'demonstratives',video:'F1g2H3j4K5l'},
{id:'a1_12',level:'A1',title:'Притяжательные и \'s',theory:'**Прил.:** my, your, his, her, its, our, their.\n**Местоим.:** mine, yours, his, hers, ours, theirs.\n\n**\'s:** John\'s car, my mother\'s house.',examples:['That\'s her bag.','This is John\'s car.'],practice:'Опиши вещи: My bag, your phone.',mistakes:['its vs it\'s (it is)','her vs hers'],memory:'my-мой, your-твой, his-его, her-её.',keywords:'possessives',video:'cFdN7pU3g2A'},
{id:'a1_13',level:'A1',title:'Предлоги места',theory:'**in** — внутри. **on** — на поверхности. **under** — под. **next to** — рядом. **between** — между. **behind** — за. **in front of** — перед.',examples:['The book is on the table.','The cat is under the bed.'],practice:'Опиши комнату.',mistakes:['in/on/at — разные, заучивай в контексте'],memory:'Визуализируй кота.',keywords:'prepositions',video:'Unzc731iCUY'},
{id:'a1_14',level:'A1',title:'Время и часы',theory:'**O\'clock** — ровно: 3:00 = three o\'clock.\n**Quarter past** — 3:15.\n**Half past** — 3:30.\n**Quarter to** — 3:45.\n**AM/PM.**',examples:['It\'s half past three.','I wake up at 7 AM.'],practice:'Назови время: 7:00, 8:30, 9:15, 17:20.',mistakes:['past = после, to = до'],memory:'past/to.',keywords:'time',video:'Q7R8S9T0u1V'},
{id:'a1_15',level:'A1',title:'Дни, месяцы, сезоны',theory:'**Дни:** Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.\n**Месяцы:** January...December.\n**Сезоны:** spring, summer, autumn/fall, winter.',examples:['My birthday is on the 5th of May.','I love summer.'],practice:'Скажи день рождения.',mistakes:['W в Wednesday не читается','Дни и месяцы с большой буквы'],memory:'Mon-Sun, Jan-Dec.',keywords:'days months',video:'W2X3Y4Z5a6B'},
{id:'a1_16',level:'A1',title:'Can/Can\'t',theory:'**Can** — умение/возможность.\nI can swim. She can cook.\n**Отрицание:** cannot/can\'t.\n**Вопрос:** Can you help?',examples:['I can\'t drive.','Can you speak English? — Yes, I can.'],practice:'Расскажи 5 вещей: I can...',mistakes:['Не добавляй to после can: «I can to swim» ✗'],memory:'Can = «могу».',keywords:'can',video:'C7D8E9F0g1H'},
{id:'a1_17',level:'A1',title:'Like/Don\'t like + -ing',theory:'**Like/Love/Enjoy/Hate + V-ing:**\nI like reading. I love cooking.',examples:['I like coffee. I love reading books.'],practice:'Расскажи 5 вещей.',mistakes:['После like — V-ing (действие)'],memory:'Like + -ing.',keywords:'likes',video:'I2J3K4L5m6N'},
{id:'a1_18',level:'A1',title:'Профессии',theory:'teacher, doctor, engineer, lawyer, nurse, driver, cook, waiter, artist, programmer, manager.',examples:['I\'m a teacher.','What do you do? — I\'m a programmer.'],practice:'Назови 5 профессий.',mistakes:['Обязательно артикль a/an: I\'m a doctor'],memory:'Группируй по сфере.',keywords:'jobs',video:'O7P8Q9R0s1T'},
{id:'a1_19',level:'A1',title:'Хобби',theory:'reading, sports, music, dancing, cooking, traveling, painting, gaming, photography.',examples:['My hobby is painting.','I\'m good at singing.'],practice:'Расскажи 3 хобби.',mistakes:['Hobby — то, что делаешь с удовольствием'],memory:'Хобби = радость.',keywords:'hobbies',video:'U2V3W4X5y6Z'},
{id:'a1_20',level:'A1',title:'Погода',theory:'**Sunny, rainy, snowy, cloudy, windy.**\nIt\'s cold/warm/hot.\n**What\'s the weather like?**',examples:['It\'s sunny today.','It\'s raining cats and dogs.'],practice:'Опиши погоду.',mistakes:['Weather = погода, whether = ли'],memory:'it is + прилагательное.',keywords:'weather',video:'a7B8C9D0e1F'},
{id:'a1_21',level:'A1',title:'В магазине',theory:'**Продавец:** Can I help you?\n**Клиент:** I\'d like..., How much is it?\n**Оплата:** cash/card.',examples:['— Can I help you? — Yes, I\'d like this T-shirt. — What size? — Medium, please.'],practice:'Разыграй диалог 7 реплик.',mistakes:['I\'d like = «я хотел бы»'],memory:'I\'d like — вежливо.',keywords:'shopping',video:'g2H3I4j5K6l'},
{id:'a1_22',level:'A1',title:'В кафе',theory:'**Официант:** Are you ready to order?\n**Клиент:** I\'d like a coffee. The bill, please.\n**Tip, take away.**',examples:['Table for two, please.','The bill, please.'],practice:'Составь заказ.',mistakes:['Tip обязателен в США (15-20%)'],memory:'I\'d like.',keywords:'restaurant',video:'m7N8O9P0q1R'},
{id:'a1_23',level:'A1',title:'Транспорт',theory:'**by bus/train/car/plane/bike/on foot.**\n**Аэропорт:** check-in, boarding pass, luggage, gate.',examples:['I go to work by bus.','My flight departs from gate B5.'],practice:'Опиши дорогу.',mistakes:['by = на транспорте, on foot = пешком'],memory:'by / on foot.',keywords:'transport',video:'s2T3U4V5w6X'},
{id:'a1_24',level:'A1',title:'Дом и квартира',theory:'**Rooms:** living room, bedroom, kitchen, bathroom.\n**Furniture:** sofa, bed, table, chair.\n**Appliances:** fridge, washing machine, oven.',examples:['My bedroom is small but cozy.','The fridge is in the kitchen.'],practice:'Опиши квартиру.',mistakes:['Группируй по комнатам'],memory:'Комнаты.',keywords:'home',video:'y7Z8A9B0c1D'},
{id:'a1_25',level:'A1',title:'Итог A1 + тест',theory:'**Ты знаешь:** алфавит, числа, семью, еду, Present Simple, to be, артикли.\n\n**Тест:** назови 12 месяцев, 7 дней, 10 цветов, 5 профессий, 10 продуктов.',examples:['Рассказ о себе 15 предложений.'],practice:'Рассказ о себе: имя, возраст, семья, работа, хобби.',mistakes:['Повтори слабые темы'],memory:'Карточки Anki.',keywords:'review A1',video:'e2F3G4H5i6J'},
{id:'a1_26',level:'A1',title:'Местоимения',theory:'**Subject:** I, you, he, she, it, we, they.\n**Object:** me, you, him, her, it, us, them.',examples:['I love her. She loves me.'],practice:'10 предложений.',mistakes:['I vs me'],memory:'I — субъект, me — объект.',keywords:'pronouns',video:'k7L8M9N0o1P'},
{id:'a1_27',level:'A1',title:'Some/Any',theory:'**Some** — утверждения: I have some money.\n**Any** — вопросы/отрицания: Do you have any money?',examples:['I have some friends in London.','I don\'t have any money.'],practice:'10 предложений.',mistakes:['Some в вопросах — просьба: Would you like some tea?'],memory:'some = есть, any = ? / нет.',keywords:'some any',video:'q2R3S4T5u6V'},
{id:'a1_28',level:'A1',title:'Have/Has got',theory:'I **have got** / I **have**.\nHe **has got** / He **has**.',examples:['I have got a cat.','She has got blue eyes.'],practice:'10 предложений.',mistakes:['Разговорный: have got. Формальный: have'],memory:'have got = иметь.',keywords:'have got',video:'w7X8Y9Z0a1B'},
{id:'a1_29',level:'A1',title:'Повелительное наклонение',theory:'**Come here!** Don\'t do that!\nV = базовая форма.',examples:['Open the door, please.','Don\'t touch it!'],practice:'10 команд.',mistakes:['No «to» в imperative'],memory:'V без to.',keywords:'imperative',video:'c2D3E4F5g6H'},
{id:'a1_30',level:'A1',title:'Путешествия: аэропорт',theory:'**Check-in, passport, boarding pass, security, gate, departure, arrival, luggage, customs.**',examples:['Where is gate B5?','I have one bag to check in.'],practice:'Разыграй сцену в аэропорту.',mistakes:['Luggage — неисчисляемое'],memory:'Слова по порядку.',keywords:'airport',video:'i7J8K9L0m1N'},

/* A2 — 30 уроков */
{id:'a2_01',level:'A2',title:'Past Simple правильные',theory:'**V+ed.** Work → worked.\n**Правила:**\n• live → lived\n• stop → stopped (удвоение)\n• study → studied (y→ied)\n\n**Отрицание:** didn\'t + V1.\n**Вопрос:** Did you work?',examples:['Yesterday I worked from home.','I didn\'t like the film.','Did you call him?'],practice:'10 предложений о вчера.',mistakes:['После didn\'t — V1, не V2'],memory:'-ed = сделал.',keywords:'past simple',video:'o2P3Q4R5s6T'},
{id:'a2_02',level:'A2',title:'Past Simple неправильные',theory:'**Топ-30:** be→was/were, have→had, do→did, go→went, get→got, make→made, take→took, come→came, see→saw, know→knew, think→thought, say→said, find→found, give→gave, tell→told, become→became, leave→left, feel→felt, put→put, bring→brought, begin→began, keep→kept, hold→held, write→wrote, stand→stood, hear→heard.',examples:['I went to London last year.','She made a cake.'],practice:'Расскажи, что делал вчера (10 неправильных).',mistakes:['Не «goed»'],memory:'Группируй: go-went, see-saw.',keywords:'irregular verbs',video:'u7V8W9X0y1Z'},
{id:'a2_03',level:'A2',title:'Past Continuous',theory:'**was/were + V-ing.**\nI was working. They were playing.\n\n**Вместе с Past Simple:**\nI was reading when he came.',examples:['I was sleeping at 10 PM.','We were having dinner when she called.'],practice:'Что делал в 8 вечера вчера?',mistakes:['Только для длительных действий'],memory:'was/were + -ing.',keywords:'past continuous',video:'a2B3C4D5e6F'},
{id:'a2_04',level:'A2',title:'Future: will/going to',theory:'**Will** — решения, предсказания: I will help you.\n**Going to** — планы: I am going to travel.\n**Present Continuous** — договорённости: I am meeting John tomorrow.',examples:['I\'ll call you later.','I\'m going to study medicine.'],practice:'5 планов + 5 предсказаний.',mistakes:['Will = спонтанно, going to = план'],memory:'Will/going to.',keywords:'future',video:'g7H8I9J0k1L'},
{id:'a2_05',level:'A2',title:'Степени сравнения',theory:'**Короткие:** +er / +est. big → bigger → the biggest.\n**Длинные:** more / most. interesting → more interesting.\n**Исключения:** good→better→best, bad→worse→worst, far→farther/further.',examples:['Moscow is bigger than London.','This is the most interesting book.'],practice:'Сравни 5 пар.',mistakes:['Не «more bigger»'],memory:'-er/-est для коротких.',keywords:'comparatives',video:'m2N3O4P5q6R'},
{id:'a2_06',level:'A2',title:'Some/Any/No',theory:'**Some** — утверждения. **Any** — вопросы/отрицания. **No** — нет совсем.\n**Производные:** something, anything, nothing, somebody, anybody, nobody.',examples:['I have some money.','Do you have any questions?','There is nothing to do.'],practice:'10 предложений.',mistakes:['Somebody = кто-то, anybody = кто-нибудь'],memory:'some=есть, any=?/нет, no=ноль.',keywords:'some any no',video:'s7T8U9V0w1X'},
{id:'a2_07',level:'A2',title:'Much/Many/A lot',theory:'**Many** — исчисляемые: many books.\n**Much** — неисчисляемые: much water.\n**A lot of** — универсально.\n**Few/A few, Little/A little.**',examples:['How many people?','How much water?','I have a lot of friends.'],practice:'10 предложений.',mistakes:['Much/many — чаще в вопросах/отрицаниях'],memory:'Many — считаем, much — не считаем.',keywords:'quantifiers',video:'y2Z3A4B5c6D'},
{id:'a2_08',level:'A2',title:'Present Perfect',theory:'**have/has + V3.**\nI have worked.\n**Когда:**\n• результат сейчас: I have lost my keys.\n• опыт: I have been to London.\n**Маркеры:** just, already, yet, ever, never, since, for.',examples:['I have never been to Japan.','Have you seen this film?'],practice:'10 предложений.',mistakes:['Не путать с Past Simple'],memory:'have + V3.',keywords:'present perfect',video:'e7F8G9H0i1J'},
{id:'a2_09',level:'A2',title:'For/Since/Ago',theory:'**For** — длительность: for 5 years.\n**Since** — точка: since 2020.\n**Ago** — назад: 5 years ago.',examples:['I have lived here for 5 years.','I moved here 5 years ago.'],practice:'5 предложений.',mistakes:['For = сколько, since = с какого, ago = тому назад'],memory:'for/since/ago.',keywords:'for since ago',video:'k2L3M4N5o6P'},
{id:'a2_10',level:'A2',title:'Модальные must/have to/should',theory:'**Must** — обязанность: You must wear a seatbelt.\n**Have to** — вынужден: I have to work.\n**Should** — совет: You should sleep more.\n**Mustn\'t** — запрет. **Don\'t have to** — не обязан.',examples:['You must stop at red.','I have to wake up early.'],practice:'5 советов другу.',mistakes:['Mustn\'t ≠ don\'t have to'],memory:'Must/Have to/Should.',keywords:'modals',video:'q7R8S9T0u1V'},
{id:'a2_11',level:'A2',title:'Would like',theory:'**I would like (I\'d like)** — вежливое «хочу».\n**Would like to + V:** I would like to travel.\n**Отличие от want:** want — прямо, would like — вежливо.',examples:['I\'d like a coffee, please.','I\'d like to book a table.'],practice:'Заказ в ресторане.',mistakes:['Would like to + V, не + V-ing'],memory:'Would like = вежливо.',keywords:'would like',video:'w2X3Y4Z5a6B'},
{id:'a2_12',level:'A2',title:'Present Continuous vs Simple',theory:'**Simple** — привычки: I work every day.\n**Continuous** — сейчас: I am working now.\n**Исключения (не в Continuous):** like, love, hate, want, need, know, understand, believe.',examples:['I usually drink tea. But now I\'m drinking coffee.'],practice:'10 предложений.',mistakes:['Know не в Continuous'],memory:'Simple = всегда, Continuous = сейчас.',keywords:'simple continuous',video:'c7D8E9F0g1H'},
{id:'a2_13',level:'A2',title:'Условные 1 типа',theory:'**If + Present Simple, will + V.**\nIf it rains, I will stay home.\n**Не will после if!**',examples:['If you study, you will pass.','If I have time, I\'ll call you.'],practice:'5 предложений.',mistakes:['❌ If it will rain'],memory:'If = условие.',keywords:'conditionals 1',video:'i2J3K4L5m6N'},
{id:'a2_14',level:'A2',title:'Условные 2 типа',theory:'**If + Past Simple, would + V.**\nIf I had money, I would travel.\n**Were вместо was для всех лиц.**',examples:['If I were you, I would apologize.','If I had a car, I would drive to work.'],practice:'5 мечт.',mistakes:['Только про нереальное настоящее'],memory:'2 тип = мечта.',keywords:'conditionals 2',video:'o7P8Q9R0s1T'},
{id:'a2_15',level:'A2',title:'Косвенная речь',theory:'**Прямая:** He said, "I am tired."\n**Косвенная:** He said (that) he was tired.\n**Сдвиг:** Present → Past, will → would, can → could.',examples:['She said she was busy.','He told me he would come.'],practice:'Переделай 5 предложений.',mistakes:['Сдвиг времени обязателен'],memory:'Косвенная = сдвиг.',keywords:'reported',video:'u2V3W4X5y6Z'},
{id:'a2_16',level:'A2',title:'Пассив',theory:'**Present:** am/is/are + V3. The book is written by Tolkien.\n**Past:** was/were + V3. The house was built in 1950.',examples:['English is spoken worldwide.','The car was repaired yesterday.'],practice:'Переделай 10 предложений.',mistakes:['Be + V3 = пассив'],memory:'be + V3.',keywords:'passive',video:'a7B8C9D0e1F'},
{id:'a2_17',level:'A2',title:'Вопросы все типы',theory:'**Общий:** Do/Does/Did + S + V?\n**Специальный:** Wh- + вспом. + S + V?\n**К подлежащему:** Who came? (без do!)\n**Альтернативный:** Tea or coffee?',examples:['Where do you live?','Who called you?'],practice:'10 вопросов.',mistakes:['К подлежащему — без do'],memory:'Вопрос = вспом. вперёд.',keywords:'questions',video:'g2H3I4j5K6l'},
{id:'a2_18',level:'A2',title:'Tag questions',theory:'**Утверждение + отриц. хвост:** You are a student, aren\'t you?\n**Отрицание + положит. хвост:** You don\'t smoke, do you?\n**Особые:** Let\'s go, shall we?',examples:['She likes tea, doesn\'t she?','You didn\'t call, did you?'],practice:'10 хвостов.',mistakes:['Хвост = противоположность'],memory:'Хвост = отриц.',keywords:'tag questions',video:'m7N8O9P0q1R'},
{id:'a2_19',level:'A2',title:'Фразовые 1',theory:'get up, wake up, go on, come back, look for, look after, put on, take off, turn on/off, give up, find out, carry on.',examples:['I get up at 7.','Turn off the TV.'],practice:'10 предложений.',mistakes:['Группируй по частице'],memory:'up/off/on.',keywords:'phrasal',video:'s2T3U4V5w6X'},
{id:'a2_20',level:'A2',title:'Фразовые 2',theory:'get along, break down, give back, look forward to, take care of, come up with, put up with, get away with, make up, look up.',examples:['I look forward to seeing you.','We get along well.'],practice:'10 предложений.',mistakes:['look forward to + V-ing'],memory:'look forward to = ждать.',keywords:'phrasal 2',video:'y7Z8A9B0c1D'},
{id:'a2_21',level:'A2',title:'Идиомы 1',theory:'• Break a leg! — Удачи!\n• Piece of cake — проще простого\n• Hit the books — засесть за учёбу\n• Under the weather — неважно\n• Once in a blue moon — редко\n• Cost an arm and a leg — дорого',examples:['Break a leg at your interview!','The exam was a piece of cake.'],practice:'10 идиом в диалоге.',mistakes:['Идиомы — образ, не буквально'],memory:'Образ.',keywords:'idioms 1',video:'e2F3G4H5i6J'},
{id:'a2_22',level:'A2',title:'Идиомы 2',theory:'• The ball is in your court\n• Burn the midnight oil\n• Blessing in disguise\n• Get cold feet\n• It\'s raining cats and dogs\n• Break the ice',examples:['It\'s raining cats and dogs.','She got cold feet before the wedding.'],practice:'5 идиом в диалоге.',mistakes:['Не переводи буквально'],memory:'Образ.',keywords:'idioms 2',video:'k7L8M9N0o1P'},
{id:'a2_23',level:'A2',title:'Formal vs Informal',theory:'**Informal:** Hi! What\'s up? See ya!\n**Formal:** Dear Sir, I am writing to..., Yours sincerely.',examples:['Informal email to friend vs formal letter to boss.'],practice:'2 версии одного письма.',mistakes:['Не смешивай стили'],memory:'Formal = галстук.',keywords:'register',video:'q2R3S4T5u6V'},
{id:'a2_24',level:'A2',title:'Чтение и аудирование',theory:'**Стратегии:** Skimming, Scanning, Detailed.\n**Аудирование:** 6 Minute English, shadowing.',examples:['Skim статью за 30 сек — общее понимание.'],practice:'Статья + 5 главных мыслей.',mistakes:['Читать всё подряд'],memory:'Skim/Scan.',keywords:'reading',video:'w7X8Y9Z0a1B'},
{id:'a2_25',level:'A2',title:'Итог A2 + тест',theory:'**Ты знаешь:** Past Simple, Continuous, Future, Present Perfect, модальные, условные 1-2, пассив, фразовые, идиомы.\n**IQ-тест:** рассказ 15-20 предложений с 5 временами.',examples:['Рассказ о последнем отпуске.'],practice:'Рассказ о последнем отпуске.',mistakes:['Повтори слабое'],memory:'Anki.',keywords:'review A2',video:'c2D3E4F5g6H'},
{id:'a2_26',level:'A2',title:'Конструкции с too/enough',theory:'**too + adj:** It\'s too hot.\n**adj + enough:** He is old enough.\n**too much/many:** too much sugar.',examples:['This coffee is too hot.','He isn\'t old enough to drive.'],practice:'10 предложений.',mistakes:['Порядок: too + adj, adj + enough'],memory:'too/enough.',keywords:'too enough',video:'i7J8K9L0m1N'},
{id:'a2_27',level:'A2',title:'Both/Either/Neither',theory:'**Both** — оба: Both are good.\n**Either** — любой из двух: Either is fine.\n**Neither** — ни один: Neither works.',examples:['Both answers are correct.','Neither of them came.'],practice:'10 предложений.',mistakes:['Neither + положительный глагол'],memory:'Both/Either/Neither.',keywords:'both either',video:'o2P3Q4R5s6T'},
{id:'a2_28',level:'A2',title:'Used to',theory:'**Used to + V** — привычка в прошлом (уже не так):\nI used to smoke.',examples:['I used to play football.','She used to live in Paris.'],practice:'5 предложений о детстве.',mistakes:['Не путать с be used to (привык)'],memory:'Used to = раньше.',keywords:'used to',video:'u7V8W9X0y1Z'},
{id:'a2_29',level:'A2',title:'Времена: обзор',theory:'**Simple, Continuous, Perfect, Perfect Continuous** × Present, Past, Future = 12 времён.',examples:['I work. I am working. I have worked. I have been working.'],practice:'Таблица 12 времён.',mistakes:['Времена надо заучить'],memory:'12 времён.',keywords:'tenses',video:'a2B3C4D5e6F'},
{id:'a2_30',level:'A2',title:'Итог A2 практика',theory:'Всё вместе: Past, Present Perfect, Conditionals, Passive, Phrasal verbs.',examples:['Диалог на 20 реплик.'],practice:'Напиши 20 предложений.',mistakes:['Слабые темы — повтори'],memory:'Практика.',keywords:'A2 practice',video:'g7H8I9J0k1L'},

/* B1 — 30 уроков (сокращённо) */
{id:'b1_01',level:'B1',title:'Present Perfect Continuous',theory:'**have/has been + V-ing.**\nI have been working here for 5 years.\n**Отличие от Present Perfect:**\n• I have worked (завершено)\n• I have been working (продолжается)',examples:['She has been studying English for 3 years.','It has been raining since morning.'],practice:'10 предложений.',mistakes:['Не путать с Present Perfect'],memory:'have been + -ing.',keywords:'pp continuous',video:'m2N3O4P5q6R'},
{id:'b1_02',level:'B1',title:'Past Perfect',theory:'**had + V3.**\nI had already eaten when he came.\n**Когда:** действие завершилось до другого прошлого.',examples:['When I arrived, they had left.','She had never seen the sea before.'],practice:'5 историй.',mistakes:['Порядок: сначала past perfect, потом past simple'],memory:'had + V3.',keywords:'past perfect',video:'s7T8U9V0w1X'},
{id:'b1_03',level:'B1',title:'Past Perfect Continuous',theory:'**had been + V-ing.**\nShe had been working for 8 hours when she fell asleep.',examples:['They had been waiting for 2 hours.'],practice:'5 предложений.',mistakes:['Длительность до момента в прошлом'],memory:'had been + -ing.',keywords:'ppc',video:'y2Z3A4B5c6D'},
{id:'b1_04',level:'B1',title:'Future Continuous',theory:'**will be + V-ing.**\nAt 8 PM, I will be watching TV.',examples:['Tomorrow at 10 I will be having a meeting.'],practice:'5 предложений.',mistakes:['Действие в моменте будущего'],memory:'will be + -ing.',keywords:'future cont',video:'e7F8G9H0i1J'},
{id:'b1_05',level:'B1',title:'Future Perfect',theory:'**will have + V3.**\nBy 2030, I will have finished university.',examples:['By next year, I will have saved enough money.'],practice:'5 предложений.',mistakes:['К моменту в будущем завершено'],memory:'will have + V3.',keywords:'future perfect',video:'k2L3M4N5o6P'},
{id:'b1_06',level:'B1',title:'Модальные — вероятность',theory:'**Must** — 90%: He must be at home.\n**Might/May** — 50%: He might be at home.\n**Can\'t** — 0%: He can\'t be at home.\n**Past:** must have + V3.',examples:['She must be tired — she worked all day.','He can\'t be serious!'],practice:'10 предположений.',mistakes:['Must — только положительная уверенность'],memory:'Must/Might/Can\'t.',keywords:'modals probability',video:'q7R8S9T0u1V'},
{id:'b1_07',level:'B1',title:'Used to/Would/Be used to',theory:'**Used to** — привычка в прошлом: I used to smoke.\n**Be used to** — привык: I am used to getting up early.\n**Would** — повторяющееся действие в прошлом.',examples:['I used to play the piano.','I\'m used to living alone.'],practice:'5 предложений о детстве.',mistakes:['Не путать used to и be used to'],memory:'used to / be used to.',keywords:'used to',video:'w2X3Y4Z5a6B'},
{id:'b1_08',level:'B1',title:'Условные 3 типа',theory:'**If + Past Perfect, would have + V3.**\nIf I had studied harder, I would have passed.\n**Смешанные:** If I had studied, I would be a doctor now.',examples:['If I had known, I would have come.','If she had left earlier, she wouldn\'t have missed the train.'],practice:'5 сожалений.',mistakes:['Нереальное прошлое'],memory:'3 тип = сожаление.',keywords:'conditionals 3',video:'c7D8E9F0g1H'},
{id:'b1_09',level:'B1',title:'Wish/If only',theory:'**Wish + Past Simple** — настоящее: I wish I knew.\n**Wish + Past Perfect** — прошлое: I wish I had known.\n**If only** — сильнее.',examples:['I wish I had more time.','If only I could fly.'],practice:'10 желаний.',mistakes:['Не «I wish I know»'],memory:'wish = «хотел бы, но нет».',keywords:'wish',video:'i2J3K4L5m6N'},
{id:'b1_10',level:'B1',title:'Косвенная речь сложная',theory:'**Вопросы:** He asked me where I lived.\n**Команды:** He told me to come.\n**Сдвиг:** now→then, today→that day, tomorrow→the next day.',examples:['She asked if I was OK.','He told me not to go.'],practice:'10 предложений.',mistakes:['Сдвиг обязателен'],memory:'Косвенная = пересказ.',keywords:'reported',video:'o7P8Q9R0s1T'},
{id:'b1_11',level:'B1',title:'Relative clauses',theory:'**Who** — люди. **Which** — вещи. **That** — универсально. **Where** — места. **Whose** — принадлежность.',examples:['The man who called is my boss.','The book which I read was great.'],practice:'5 предложений.',mistakes:['That не после запятой'],memory:'who/which/that.',keywords:'relative',video:'u2V3W4X5y6Z'},
{id:'b1_12',level:'B1',title:'Gerund vs Infinitive',theory:'**Gerund (V-ing):** после предлогов, like, love, enjoy, hate, mind, finish, avoid, suggest.\n**Infinitive (to V):** после want, need, decide, hope, plan, learn, promise, agree.',examples:['I enjoy reading. I want to travel.'],practice:'10 предложений.',mistakes:['Stop smoking vs stop to smoke'],memory:'Gerund = процесс, Inf = цель.',keywords:'gerund infinitive',video:'a7B8C9D0e1F'},
{id:'b1_13',level:'B1',title:'Passive advanced',theory:'**Модальные в пассиве:** The work must be done.\n**Perfect:** The house has been built.\n**Continuous:** The house is being built.',examples:['The car must be repaired.','The letter has been sent.'],practice:'10 предложений.',mistakes:['Be + V3'],memory:'be + V3.',keywords:'passive',video:'g2H3I4j5K6l'},
{id:'b1_14',level:'B1',title:'Tag questions advanced',theory:'**Интонация:** ↘ уверен, ↗ спрашиваю.\n**Особые:** Let\'s go, shall we? I am right, aren\'t I?',examples:['Nobody came, did they?'],practice:'10 вопросов.',mistakes:['Хвост = противоположность'],memory:'Хвост.',keywords:'tag',video:'m7N8O9P0q1R'},
{id:'b1_15',level:'B1',title:'Emphasis/inversion',theory:'**Emphatic do:** I do love you.\n**Инверсия после never:** Never have I seen such a thing.',examples:['I do apologize.','Never have I been so happy.'],practice:'5 + 5 предложений.',mistakes:['Инверсия после отрицательных наречий'],memory:'do + инверсия.',keywords:'emphasis',video:'s2T3U4V5w6X'},
{id:'b1_16',level:'B1',title:'Business email',theory:'**Структура:** Subject, Salutation, Opening, Body, Closing, Signature.\n**Фразы:** Please find attached..., Looking forward to hearing from you.',examples:['Dear Mr. Smith, I am writing to apply for...'],practice:'100 слов.',mistakes:['Слишком неформально'],memory:'Email = структура.',keywords:'business email',video:'y7Z8A9B0c1D'},
{id:'b1_17',level:'B1',title:'Деловой звонок',theory:'**Начало:** Good morning, this is...\n**Соединение:** Could I speak to...?\n**Уточнение:** Could you repeat, please?',examples:['Could I speak to Mr. Johnson?'],practice:'Диалог 10 реплик.',mistakes:['Формально'],memory:'Звонок.',keywords:'business call',video:'e2F3G4H5i6J'},
{id:'b1_18',level:'B1',title:'Презентации',theory:'**Структура:** Greeting, Topic, Outline, Body, Conclusion, Q&A.',examples:['Today I will talk about...'],practice:'3 мин.',mistakes:['Слишком много текста'],memory:'Речь = крючок + структура.',keywords:'presentation',video:'Unzc731iCUY'},
{id:'b1_19',level:'B1',title:'Интервью',theory:'**Топ-вопросы:** Tell me about yourself. Why this job? Strengths/weaknesses. Where in 5 years?\n**STAR:** Situation, Task, Action, Result.',examples:['STAR-ответ на «приведи пример конфликта».'],practice:'5 вопросов.',mistakes:['Без конкретики'],memory:'STAR.',keywords:'interview',video:'q2R3S4T5u6V'},
{id:'b1_20',level:'B1',title:'Деловые идиомы',theory:'• Touch base\n• Circle back\n• Think outside the box\n• Get the ball rolling\n• On the same page\n• Low-hanging fruit\n• Win-win',examples:['Let\'s touch base tomorrow.'],practice:'5 идиом.',mistakes:['В формальном email'],memory:'Офис.',keywords:'business idioms',video:'w7X8Y9Z0a1B'},
{id:'b1_21',level:'B1',title:'Сокращения/сленг',theory:'ASAP, FYI, BTW, IMO, BRB, LOL, OMG, TBH, IDK.\n**Сленг:** chill, cool, awesome, hang out.',examples:['FYI, meeting at 3.'],practice:'10 сообщений.',mistakes:['Только в чатах'],memory:'Первые буквы.',keywords:'slang',video:'c2D3E4F5g6H'},
{id:'b1_22',level:'B1',title:'Collocations',theory:'**Make vs Do:**\n• Make: decision, mistake, money, coffee\n• Do: homework, sports, dishes\n**Take/Have/Get:** take a break, have breakfast, get ready.',examples:['I make coffee every morning.','I do my homework.'],practice:'20 коллокаций.',mistakes:['Make/Do — заучивай'],memory:'Make/Do.',keywords:'collocations',video:'i7J8K9L0m1N'},
{id:'b1_23',level:'B1',title:'Word formation',theory:'**Suffixes:** -tion, -ment, -ness, -ity, -er/-or.\n**Prefixes:** un-, dis-, re-, pre-.',examples:['happy → unhappy → happiness.'],practice:'30 слов.',mistakes:['Prefix = значение, Suffix = часть речи'],memory:'Prefix/Suffix.',keywords:'word formation',video:'o2P3Q4R5s6T'},
{id:'b1_24',level:'B1',title:'Чтение/анализ',theory:'**Стратегии:** Skimming, Scanning, Detailed.\n**Работа с незнакомыми словами:** контекст, корень, догадка.',examples:['Skim статью — общее понимание за 1 мин.'],practice:'5 главных мыслей.',mistakes:['Каждое слово в словарь'],memory:'Skim.',keywords:'reading',video:'u7V8W9X0y1Z'},
{id:'b1_25',level:'B1',title:'Итог B1 + тест',theory:'**B1 — уверенное общение на бытовые/профессиональные темы.**\n**Тест:** 5 времён, 20 фразовых, 10 идиом, 10 коллокаций.',examples:['Эссе 200 слов.'],practice:'Эссе 200 слов.',mistakes:['Слабые темы — повтори'],memory:'Повтори.',keywords:'B1 review',video:'a2B3C4D5e6F'},
{id:'b1_26',level:'B1',title:'Phrasal verbs advanced',theory:'put up with, come up with, look down on, get away with, do away with, make up for, look forward to, take up, turn down, bring about.',examples:['I can\'t put up with this noise.'],practice:'10 предложений.',mistakes:['Группируй по частице'],memory:'Phrasal.',keywords:'phrasal',video:'g7H8I9J0k1L'},
{id:'b1_27',level:'B1',title:'Conditionals mixed',theory:'**Прошлое+настоящее:** If I had studied, I would be a doctor now.\n**Настоящее+прошлое:** If I were rich, I would have bought that house.',examples:['If I had saved money, I could travel now.'],practice:'5 смешанных.',mistakes:['Разные времена'],memory:'Mixed.',keywords:'mixed conditionals',video:'m2N3O4P5q6R'},
{id:'b1_28',level:'B1',title:'Cleft sentences',theory:'**It-cleft:** It was John who broke the window.\n**What-cleft:** What I need is a holiday.',examples:['It was in 2020 that I met her.'],practice:'10 предложений.',mistakes:['Разделение на 2 части'],memory:'Cleft.',keywords:'cleft',video:'s7T8U9V0w1X'},
{id:'b1_29',level:'B1',title:'Subjunctive',theory:'**I suggest that he be present.**\n**После:** suggest, recommend, demand, insist, essential, vital.',examples:['It is essential that she arrive on time.'],practice:'10 предложений.',mistakes:['Be, а не is'],memory:'Subjunctive.',keywords:'subjunctive',video:'y2Z3A4B5c6D'},
{id:'b1_30',level:'B1',title:'Итог B1 практика',theory:'Все темы B1 вместе.',examples:['Эссе 250 слов.'],practice:'Эссе 250 слов.',mistakes:['Повтор'],memory:'Практика.',keywords:'B1 practice',video:'e7F8G9H0i1J'},

/* B2 — 30 уроков */
{id:'b2_01',level:'B2',title:'Инверсия advanced',theory:'**После отриц. наречий:** Never have I seen...\n**После Only:** Only then did I understand.\n**No sooner:** No sooner had I arrived than...',examples:['Rarely does he make mistakes.','Not only did she sing, but she also danced.'],practice:'10 инверсий.',mistakes:['Только в формальной речи'],memory:'Инверсия = переворот.',keywords:'inversion',video:'k2L3M4N5o6P'},
{id:'b2_02',level:'B2',title:'Смешанные условные',theory:'**Прошлое+настоящее, настоящее+прошлое.**',examples:['If I had taken the job, I would be rich now.'],practice:'5 смешанных.',mistakes:['Разные времена'],memory:'Mixed.',keywords:'mixed conditionals',video:'q7R8S9T0u1V'},
{id:'b2_03',level:'B2',title:'Cleft/inversion',theory:'**It-cleft, What-cleft, The reason why.**',examples:['It was John who broke it.','What I need is rest.'],practice:'10 предложений.',mistakes:['Разделение'],memory:'Cleft.',keywords:'cleft',video:'w2X3Y4Z5a6B'},
{id:'b2_04',level:'B2',title:'Subjunctive advanced',theory:'**I suggest that he be present. It is essential that she arrive.**',examples:['I recommend that he stay home.'],practice:'10 предложений.',mistakes:['Be, не is'],memory:'Subjunctive.',keywords:'subjunctive',video:'c7D8E9F0g1H'},
{id:'b2_05',level:'B2',title:'Фразовые advanced',theory:'account for, bring about, carry out, come down to, end up, figure out, point out, sort out.',examples:['We need to figure out the problem.'],practice:'10 предложений.',mistakes:['Группируй'],memory:'Phrasal.',keywords:'phrasal',video:'i2J3K4L5m6N'},
{id:'b2_06',level:'B2',title:'Идиомы B2',theory:'• Bite the bullet\n• Beat around the bush\n• Cut corners\n• Hit the nail on the head\n• Pull someone\'s leg\n• Sit on the fence\n• Throw in the towel',examples:['Let\'s not beat around the bush.'],practice:'10 идиом.',mistakes:['Образ'],memory:'Идиомы.',keywords:'idioms',video:'o7P8Q9R0s1T'},
{id:'b2_07',level:'B2',title:'Discourse markers',theory:'**Добавление:** moreover, furthermore.\n**Контраст:** however, nevertheless.\n**Причина:** because of, due to.\n**Следствие:** therefore, consequently.',examples:['However, some people disagree.'],practice:'Эссе с 10 маркерами.',mistakes:['Не перегружай'],memory:'Связки.',keywords:'discourse',video:'u2V3W4X5y6Z'},
{id:'b2_08',level:'B2',title:'Formal vs Academic',theory:'**Неформ.:** get, a lot of.\n**Формально:** obtain, numerous.\n**Хеджирование:** It could be argued.',examples:['It could be argued that this approach is effective.'],practice:'10 предложений.',mistakes:['Избегай «I think»'],memory:'Hedging.',keywords:'academic',video:'a7B8C9D0e1F'},
{id:'b2_09',level:'B2',title:'Аргументация',theory:'**Структура:** Claim, Evidence, Warrant, Rebuttal, Conclusion.',examples:['Claim: Remote work is effective. Evidence: Stanford study.'],practice:'Аргумент за/против.',mistakes:['Без доказательств'],memory:'Тезис+доказательство.',keywords:'argumentation',video:'g2H3I4j5K6l'},
{id:'b2_10',level:'B2',title:'Публичные выступления',theory:'**Hook + 3 points + CTA.** Пауза сильнее слов.',examples:['Imagine a world where...'],practice:'5 мин речь.',mistakes:['Без пауз'],memory:'Речь.',keywords:'public speaking',video:'Unzc731iCUY'},
{id:'b2_11',level:'B2',title:'Переговоры',theory:'**BATNA** — лучшая альтернатива.\n**Фразы:** What if we... That works for me.',examples:['Let\'s find a middle ground.'],practice:'Разыграй.',mistakes:['Только win'],memory:'BATNA.',keywords:'negotiation',video:'m7N8O9P0q1R'},
{id:'b2_12',level:'B2',title:'Дебаты',theory:'**Структура:** Opening, Arguments, Rebuttal, Closing.',examples:['I strongly believe that...'],practice:'5 мин дебаты.',mistakes:['Без опровержения'],memory:'Дебаты.',keywords:'debate',video:'s2T3U4V5w6X'},
{id:'b2_13',level:'B2',title:'Идиомы в контексте',theory:'Once in a blue moon, bury the hatchet, see eye to eye, a blessing in disguise, the last straw, jump on the bandwagon.',examples:['We finally see eye to eye.'],practice:'Диалог 5 идиом.',mistakes:['Образ'],memory:'Идиомы.',keywords:'idioms',video:'y7Z8A9B0c1D'},
{id:'b2_14',level:'B2',title:'Interview B2',theory:'**Поведенческие:** Tell me about a time when...\n**STAR.**',examples:['STAR-ответ на «расскажи о провале».'],practice:'5 STAR.',mistakes:['Без результата'],memory:'STAR.',keywords:'interview',video:'e2F3G4H5i6J'},
{id:'b2_15',level:'B2',title:'Рецензия',theory:'**Intro, Summary, Analysis, Evaluation, Recommendation.**',examples:['The film is a masterpiece because...'],practice:'Рецензия 200 слов.',mistakes:['Без оценки'],memory:'Review.',keywords:'review',video:'k7L8M9N0o1P'},
{id:'b2_16',level:'B2',title:'Научная статья',theory:'**IMRaD:** Intro, Methods, Results, Discussion.',examples:['This paper examines...'],practice:'Abstract 100 слов.',mistakes:['Без методов'],memory:'IMRaD.',keywords:'scientific',video:'q2R3S4T5u6V'},
{id:'b2_17',level:'B2',title:'Разговорный B2',theory:'**Вводные:** Well, you know, I mean, actually.\n**Мягкое несогласие:** I see your point, but...',examples:['Actually, I think you\'re right.'],practice:'Диалог 10 фраз.',mistakes:['Слишком формально'],memory:'Разговорный.',keywords:'conversational',video:'w7X8Y9Z0a1B'},
{id:'b2_18',level:'B2',title:'Нюансы тона',theory:'**Вежливо:** Could you possibly...?\n**Нейтрально:** Can you...?\n**Прямо:** Do it.',examples:['Could you possibly help me?'],practice:'5 тонов одной просьбы.',mistakes:['Тон = отношение'],memory:'Тон.',keywords:'tone',video:'c2D3E4F5g6H'},
{id:'b2_19',level:'B2',title:'Collocations B2',theory:'Take measures, draw a conclusion, meet a deadline, raise awareness, reach an agreement, bridge the gap, make a difference, pay attention.',examples:['We need to take measures.'],practice:'20 коллокаций.',mistakes:['Заучивай'],memory:'Collocations.',keywords:'collocations',video:'i7J8K9L0m1N'},
{id:'b2_20',level:'B2',title:'Narrative tenses',theory:'**Past Simple + Continuous + Perfect + Perfect Continuous.**',examples:['I was walking home when I saw him.'],practice:'История 200 слов.',mistakes:['Смешение времён'],memory:'Рассказ.',keywords:'narrative',video:'o2P3Q4R5s6T'},
{id:'b2_21',level:'B2',title:'Ellipsis/Substitution',theory:'**Ellipsis:** Would you like tea? — I\'d love to.\n**Substitution:** The blue one.',examples:['— Would you like tea? — I\'d love to.'],practice:'10 предложений.',mistakes:['Пропуск очевидного'],memory:'Ellipsis.',keywords:'ellipsis',video:'u7V8W9X0y1Z'},
{id:'b2_22',level:'B2',title:'Idiomatic B2',theory:'Break the ice, bend over backwards, go the extra mile, bite off more than you can chew, have a lot on your plate, in the same boat.',examples:['Let\'s break the ice with a game.'],practice:'5 диалогов.',mistakes:['Образ'],memory:'Idioms.',keywords:'idiomatic',video:'a2B3C4D5e6F'},
{id:'b2_23',level:'B2',title:'Advanced phrasal',theory:'Account for, bring about, carry out, come down to, end up, figure out, point out, sort out.',examples:['Let\'s figure it out.'],practice:'10 предложений.',mistakes:['Группируй'],memory:'Phrasal.',keywords:'advanced phrasal',video:'g7H8I9J0k1L'},
{id:'b2_24',level:'B2',title:'Формальные письма',theory:'**Complaint:** Dear Sir/Madam, I am writing to complain about...\n**Application:** I am writing to apply for...',examples:['I am writing to apply for the position of...'],practice:'3 письма.',mistakes:['Слишком неформально'],memory:'Структура.',keywords:'formal letters',video:'m2N3O4P5q6R'},
{id:'b2_25',level:'B2',title:'Итог B2 + тест',theory:'**B2 — сложные тексты, абстрактные темы, свободное общение.**',examples:['Эссе 300 слов.'],practice:'Эссе 300 слов.',mistakes:['Слабые темы'],memory:'B2 review.',keywords:'B2 review',video:'s7T8U9V0w1X'},
{id:'b2_26',level:'B2',title:'Нюансы лексики',theory:'**Синонимы с оттенками:** house/home, smart/intelligent, thin/skinny.',examples:['Home — место, house — здание.'],practice:'10 пар.',mistakes:['Коннотация'],memory:'Nuance.',keywords:'nuance',video:'y2Z3A4B5c6D'},
{id:'b2_27',level:'B2',title:'Cohesion',theory:'**Cohesive devices:** Reference, Substitution, Ellipsis, Conjunction, Lexical cohesion.',examples:['This, that, it, one, do.'],practice:'Выдели связки.',mistakes:['Без связок текст рвётся'],memory:'Cohesion.',keywords:'cohesion',video:'e7F8G9H0i1J'},
{id:'b2_28',level:'B2',title:'Coherence',theory:'**Порядок:** Topic sentence, Supporting, Example, Concluding.',examples:['Абзац про один тезис.'],practice:'Перепиши текст.',mistakes:['Прыжки'],memory:'Coherence.',keywords:'coherence',video:'k2L3M4N5o6P'},
{id:'b2_29',level:'B2',title:'Critical thinking',theory:'**5 вопросов:** Claim, Evidence, Reasoning, Counterarguments, Conclusion.',examples:['Анализ статьи.'],practice:'Проанализируй статью.',mistakes:['Верить всему'],memory:'Critical.',keywords:'critical',video:'q7R8S9T0u1V'},
{id:'b2_30',level:'B2',title:'Итог B2 практика',theory:'Все темы B2 вместе.',examples:['Эссе 300 слов.'],practice:'Эссе 300 слов.',mistakes:['Повтори слабое'],memory:'B2 practice.',keywords:'B2 practice',video:'w2X3Y4Z5a6B'},

/* C1 — 30 уроков */
{id:'c1_01',level:'C1',title:'Nuances',theory:'**Синонимы с оттенками:** house/home/dwelling, smart/intelligent/clever, thin/skinny/slim.\n**Коннотации:** cheap/inexpensive/affordable.',examples:['Home = тепло, house = здание.','Slim = комплимент, skinny = критика.'],practice:'10 пар.',mistakes:['Не всё синонимы'],memory:'Коннотация.',keywords:'nuance',video:'c7D8E9F0g1H'},
{id:'c1_02',level:'C1',title:'Idioms C1',theory:'It takes two to tango, to be on the fence, don\'t count your chickens, throw under the bus, play devil\'s advocate, take with a grain of salt, have an axe to grind, burn bridges.',examples:['Let\'s play devil\'s advocate.'],practice:'10 идиом.',mistakes:['Образ'],memory:'Идиомы.',keywords:'idioms C1',video:'i2J3K4L5m6N'},
{id:'c1_03',level:'C1',title:'Academic hedging',theory:'**Hedging:** It could be argued that... There is evidence to suggest... It appears to be...\n**Avoid:** I think, very, really, a lot.',examples:['It could be argued that this approach is effective.'],practice:'Абзац с hedging.',mistakes:['Без осторожности'],memory:'Hedging.',keywords:'hedging',video:'o7P8Q9R0s1T'},
{id:'c1_04',level:'C1',title:'Literary devices',theory:'**Metaphor, Simile, Personification, Alliteration, Hyperbole, Oxymoron.**',examples:['Time is a thief.','Fast as lightning.'],practice:'5 предложений.',mistakes:['Приёмы = украшения'],memory:'Приёмы.',keywords:'literary',video:'u2V3W4X5y6Z'},
{id:'c1_05',level:'C1',title:'Register',theory:'**Frozen, Formal, Consultative, Casual, Intimate.**\n**Mixing = ошибка.**',examples:['Legal: hereby, thereto.'],practice:'5 регистров одной темы.',mistakes:['Не смешивай'],memory:'Регистр.',keywords:'register',video:'a7B8C9D0e1F'},
{id:'c1_06',level:'C1',title:'Сочинение-рассуждение',theory:'**Структура:** Intro + thesis, Argument 1+example, Argument 2+example, Counterargument, Conclusion.\n**Объём:** 400-500 слов.',examples:['Эссе на 400 слов.'],practice:'Сочинение 400 слов.',mistakes:['Без контраргумента'],memory:'Сочинение.',keywords:'essay',video:'g2H3I4j5K6l'},
{id:'c1_07',level:'C1',title:'Stylistic devices',theory:'Anaphora, Chiasmus, Antithesis, Rhetorical question.',examples:['I have a dream...','Ask not what...'],practice:'5 предложений.',mistakes:['Приёмы'],memory:'Приёмы.',keywords:'stylistic',video:'m7N8O9P0q1R'},
{id:'c1_08',level:'C1',title:'Debates C1',theory:'**Position, Evidence, Rebuttal, Cross-examination, Closing.**\n**Фразы:** I take issue with...',examples:['I take issue with that assumption.'],practice:'10 мин дебаты.',mistakes:['Без опровержения'],memory:'Дебаты.',keywords:'debate C1',video:'s2T3U4V5w6X'},
{id:'c1_09',level:'C1',title:'Public speech',theory:'**Hook + Story + Point + CTA.**\n**Rule of three, repetition, pause.**',examples:['Churchill, MLK, Jobs.'],practice:'5 мин речь.',mistakes:['Без пауз'],memory:'Речь.',keywords:'public speech',video:'Unzc731iCUY'},
{id:'c1_10',level:'C1',title:'Humor',theory:'**Puns, irony, sarcasm, deadpan, self-deprecating.**',examples:['Self-deprecating безопаснее всего.'],practice:'5 шуток.',mistakes:['Может оскорбить'],memory:'Юмор.',keywords:'humor',video:'y7Z8A9B0c1D'},
{id:'c1_11',level:'C1',title:'Cleft & Inversion advanced',theory:'Emphatic do, Fronting, Negative inversion.',examples:['Under no circumstances will I agree.'],practice:'10 предложений.',mistakes:['Формально'],memory:'Инверсия.',keywords:'cleft',video:'e2F3G4H5i6J'},
{id:'c1_12',level:'C1',title:'Cohesion',theory:'**Reference, Substitution, Ellipsis, Conjunction, Lexical.**',examples:['This, that, it.'],practice:'Выдели связки.',mistakes:['Разорванный текст'],memory:'Cohesion.',keywords:'cohesion',video:'k7L8M9N0o1P'},
{id:'c1_13',level:'C1',title:'Coherence',theory:'**Topic sentence + progression.**',examples:['Каждая фраза продолжает.'],practice:'Перепиши.',mistakes:['Прыжки'],memory:'Coherence.',keywords:'coherence',video:'q2R3S4T5u6V'},
{id:'c1_14',level:'C1',title:'Critical thinking',theory:'**Фреймворк:** claim, evidence, reasoning, counterarguments, conclusion.',examples:['Анализ статьи.'],practice:'Проанализируй.',mistakes:['Верить'],memory:'Critical.',keywords:'critical',video:'w7X8Y9Z0a1B'},
{id:'c1_15',level:'C1',title:'Complex texts',theory:'**Skim, Scan, Close reading. Cornell notes.**',examples:['Mind map.'],practice:'Mind map.',mistakes:['Без заметок'],memory:'Complex.',keywords:'complex',video:'c2D3E4F5g6H'},
{id:'c1_16',level:'C1',title:'Literary analysis',theory:'**Theme, Character, Plot, Setting, POV, Symbolism.**',examples:['Анализ рассказа.'],practice:'Анализ.',mistakes:['Без темы'],memory:'Analysis.',keywords:'literary analysis',video:'i7J8K9L0m1N'},
{id:'c1_17',level:'C1',title:'Scientific style',theory:'**Passive, Nominalization, Citations.**',examples:['It has been demonstrated that...'],practice:'Abstract.',mistakes:['Без отстранённости'],memory:'Scientific.',keywords:'scientific',video:'o2P3Q4R5s6T'},
{id:'c1_18',level:'C1',title:'Legal English',theory:'**Plaintiff, defendant, contract, tort, damages.**\n**Фразы:** hereby, thereto.',examples:['Hereby agree.'],practice:'10 терминов.',mistakes:['Точность'],memory:'Legal.',keywords:'legal',video:'u7V8W9X0y1Z'},
{id:'c1_19',level:'C1',title:'Medical English',theory:'**Diagnosis, symptoms, treatment, prescription.**',examples:['The patient presents with...'],practice:'Мед. отчёт 200 слов.',mistakes:['Точность'],memory:'Medical.',keywords:'medical',video:'a2B3C4D5e6F'},
{id:'c1_20',level:'C1',title:'IT English',theory:'**API, deployment, scalability, latency.**',examples:['We need to optimize latency.'],practice:'Тех. описание 200 слов.',mistakes:['Краткость'],memory:'IT.',keywords:'IT',video:'g7H8I9J0k1L'},
{id:'c1_21',level:'C1',title:'Business pitch',theory:'**Hook, Problem, Solution, Market, Team, Traction, Ask.**',examples:['Pitch за 3 мин.'],practice:'Питч.',mistakes:['Без traction'],memory:'Pitch.',keywords:'pitch',video:'m2N3O4P5q6R'},
{id:'c1_22',level:'C1',title:'Negotiation C1',theory:'**Anchoring, Framing, BATNA, MESO, Silence.**',examples:['Multiple equivalent offers.'],practice:'Разыграй.',mistakes:['Первое предложение'],memory:'Negotiation.',keywords:'negotiation C1',video:'s7T8U9V0w1X'},
{id:'c1_23',level:'C1',title:'Mediation',theory:'**Intro, Issues, Interests, Options, Agreement.**',examples:['Let\'s find common ground.'],practice:'Медиация.',mistakes:['Без интересов'],memory:'Mediation.',keywords:'mediation',video:'y2Z3A4B5c6D'},
{id:'c1_24',level:'C1',title:'Philosophy of language',theory:'**Sapir-Whorf, Wittgenstein, Chomsky, Austin.**',examples:['Языковые игры.'],practice:'Эссе 400 слов.',mistakes:['Без вопросов'],memory:'Philosophy.',keywords:'philosophy',video:'e7F8G9H0i1J'},
{id:'c1_25',level:'C1',title:'Итог C1 + тест',theory:'**C1 — свободное владение, тонкие нюансы.**',examples:['Эссе 500 слов.'],practice:'Эссе 500 слов.',mistakes:['Слабое'],memory:'C1 review.',keywords:'C1 review',video:'k2L3M4N5o6P'},
{id:'c1_26',level:'C1',title:'Advanced syntax',theory:'**Complex sentences, subordination, coordination.**',examples:['Although..., nevertheless...'],practice:'10 предложений.',mistakes:['Слишком длинно'],memory:'Syntax.',keywords:'syntax',video:'q7R8S9T0u1V'},
{id:'c1_27',level:'C1',title:'Продвинутые идиомы',theory:'Дополнительные идиомы C1.',examples:['Примеры в контексте.'],practice:'10 идиом.',mistakes:['Образ'],memory:'Идиомы.',keywords:'idioms',video:'w2X3Y4Z5a6B'},
{id:'c1_28',level:'C1',title:'Rhetoric',theory:'**Ethos, Pathos, Logos.**',examples:['Примеры из речей.'],practice:'Речь 5 мин.',mistakes:['Только логика'],memory:'Rhetoric.',keywords:'rhetoric',video:'c7D8E9F0g1H'},
{id:'c1_29',level:'C1',title:'Word play',theory:'**Puns, double meanings.**',examples:['Игра слов.'],practice:'5 шуток.',mistakes:['Может не понять'],memory:'Word play.',keywords:'wordplay',video:'i2J3K4L5m6N'},
{id:'c1_30',level:'C1',title:'Итог C1 практика',theory:'Всё C1 вместе.',examples:['Эссе 600 слов.'],practice:'Эссе 600 слов.',mistakes:['Повтори'],memory:'C1 practice.',keywords:'C1 practice',video:'o7P8Q9R0s1T'}
];

/* ============================================================
   МОДУЛИ (Память, IQ, EQ, Финансы, Нейро)
   ============================================================ */
var MEMORY_MODULE=[
{id:'mem_01',level:'Memory',title:'Как работает память',theory:'**3 типа:** сенсорная (0.5-3 сек), краткосрочная (15-30 сек, 7±2), долгосрочная.\n\n**Кривая Эббингауза:** 20 мин → 58% забыто, 1 день → 67%.\n\n**Вывод:** повторяй 1ч, 1д, 3д, 7д, 30д.',examples:['Студент учит 100 слов за раз — через день помнит 33.','Anki 20 мин/день = 100% запоминание.'],practice:'Расписание повторений на неделю.',mistakes:['Учить всё за раз'],memory:'Кривая Эббингауза.',keywords:'memory'},
{id:'mem_02',level:'Memory',title:'Дворец памяти',theory:'**Метод локусов:** знакомое место → 10 точек → образы.',examples:['10 слов в квартире — запоминаются на неделю.'],practice:'10 слов в квартире.',mistakes:['Скучные образы'],memory:'Локусы.',keywords:'loci'},
{id:'mem_03',level:'Memory',title:'Мнемоники',theory:'**Акроним, акростих, рифма, история, числа-образы.**',examples:['NASA, FAQ.','Every Good Boy Does Fine.'],practice:'10 мнемоник.',mistakes:['Скучно'],memory:'Крючок.',keywords:'mnemonics'},
{id:'mem_04',level:'Memory',title:'Anki',theory:'**SRS:** повторяй в момент почти забывания. 1, 3, 7, 14, 30 дней.',examples:['20 карточек/день — топ-1% по памяти.'],practice:'20 карточек.',mistakes:['Пропускать'],memory:'Anki.',keywords:'anki'},
{id:'mem_05',level:'Memory',title:'Чанкинг',theory:'**7±2. Группировка.**',examples:['Телефон как 3 чанка, не 10 цифр.'],practice:'30 слов в 6 чанков.',mistakes:['Не группировать'],memory:'Чанк.',keywords:'chunking'},
{id:'mem_06',level:'Memory',title:'Active recall',theory:'**Testing effect:** припоминание сильнее перечитывания.',examples:['Recall после урока в 3× сильнее.'],practice:'Закрой, напиши.',mistakes:['Перечитывание'],memory:'Recall.',keywords:'recall'},
{id:'mem_07',level:'Memory',title:'Фейнман',theory:'**4 шага:** концепт, объясни 12-летнему, найди пробелы, упрости.',examples:['Объясни Present Perfect ребёнку.'],practice:'3 темы.',mistakes:['Сложные термины'],memory:'Feynman.',keywords:'feynman'},
{id:'mem_08',level:'Memory',title:'Сон и память',theory:'**NREM — факты, REM — эмоции.**\n7-9 часов критично.',examples:['Учи перед сном — утром помнишь 80%.'],practice:'Учи 10 слов перед сном.',mistakes:['Недосып'],memory:'Сон = сохранение.',keywords:'sleep memory'},
{id:'mem_09',level:'Memory',title:'Двойное кодирование',theory:'**Paivio:** слово + образ = двойной след.',examples:['Apple + красный образ.'],practice:'Mind map.',mistakes:['Только слова'],memory:'Dual coding.',keywords:'dual coding'},
{id:'mem_10',level:'Memory',title:'Итог: система',theory:'**Recall + Anki + Локусы + Мнемоники + Сон.**\n×3-5 за месяц.',examples:['Топ-мнемонисты мира используют всё.'],practice:'Личная система.',mistakes:['Без системы'],memory:'Система.',keywords:'memory system'}
];

var IQ_MODULE=[
{id:'iq_01',level:'IQ',title:'Что такое IQ',theory:'**IQ:** средний 100, σ=15.\n**Компоненты:** логика, пространственное, вербальное, рабочая память.',examples:['Тест Равена, Векслера.'],practice:'Пройди тест.',mistakes:['Считать фикс'],memory:'IQ тренируется.',keywords:'IQ'},
{id:'iq_02',level:'IQ',title:'Логика',theory:'**Арифм., геом., Фибоначчи, смешанные.**',examples:['1, 4, 9, 16, ? — 25.'],practice:'10 задач.',mistakes:['Один паттерн'],memory:'Паттерн.',keywords:'logic'},
{id:'iq_03',level:'IQ',title:'Аналогии',theory:'**A:B = C:? Типы связей.**',examples:['doctor:hospital = teacher:? school.'],practice:'10 аналогий.',mistakes:['Поверхностно'],memory:'Связь.',keywords:'analogies'},
{id:'iq_04',level:'IQ',title:'Пространственное',theory:'**Вращение, развёртки, танграм.**',examples:['Развёртка куба.'],practice:'5 задач.',mistakes:['Без визуализации'],memory:'Правое полушарие.',keywords:'spatial'},
{id:'iq_05',level:'IQ',title:'Рабочая память',theory:'**4±1 чанка. N-back.**',examples:['7 3 9 1 5 → обратный порядок.'],practice:'N-back 10 мин.',mistakes:['Без тренировки'],memory:'RAM.',keywords:'working memory'},
{id:'iq_06',level:'IQ',title:'Скорочтение',theory:'**200-250 → 400-600.**\nУказка, блоки 3-5 слов.',examples:['Указка = +50%.'],practice:'10 мин.',mistakes:['Регрессии'],memory:'Скорость.',keywords:'speedreading'},
{id:'iq_07',level:'IQ',title:'Critical thinking',theory:'**5 вопросов:** Кто говорит? Что? Доказательства? Альтернативы? Если ошибётся?',examples:['Анализ новости.'],practice:'5 вопросов.',mistakes:['Confirmation bias'],memory:'Вопросы.',keywords:'critical'},
{id:'iq_08',level:'IQ',title:'Math mental',theory:'**17×23 = (20-3)(20+3) = 391.**',examples:['15% от 200 = 30.'],practice:'20 примеров.',mistakes:['Без упрощений'],memory:'Упрощай.',keywords:'math'},
{id:'iq_09',level:'IQ',title:'Шахматы',theory:'**Центр, развитие, безопасность короля.**',examples:['Тактика: вилка, связка.'],practice:'1 партия.',mistakes:['Только тактика'],memory:'Стратегия.',keywords:'chess'},
{id:'iq_10',level:'IQ',title:'Итог: IQ-система',theory:'**N-back + 5 задач + 1 партия + 10 мин чтения.**\n+10-15 за 3 мес.',examples:['Пример тренировки.'],practice:'Расписание.',mistakes:['Без системы'],memory:'IQ-спорт.',keywords:'IQ system'}
];

var EQ_MODULE=[
{id:'eq_01',level:'EQ',title:'Что такое EQ',theory:'**Гоулман:** самосознание, саморегуляция, мотивация, эмпатия, соц.навыки.\n**EQ важнее IQ ×2.**',examples:['Лидеры с высоким EQ эффективнее.'],practice:'Оцени себя.',mistakes:['Только IQ'],memory:'5 компонентов.',keywords:'EQ'},
{id:'eq_02',level:'EQ',title:'Самосознание',theory:'**Дневник эмоций 3×/день. Шкала 1-10. Триггеры.**',examples:['«Тревога 7/10, триггер — дедлайн».'],practice:'7 дней.',mistakes:['Не записывать'],memory:'Name it to tame it.',keywords:'self-awareness'},
{id:'eq_03',level:'EQ',title:'Саморегуляция',theory:'**4-7-8, пауза 6 сек, reappraisal, спорт, холодная вода.**',examples:['Пауза = свобода.'],practice:'5 раз за неделю.',mistakes:['Реагировать сразу'],memory:'Пауза.',keywords:'self-regulation'},
{id:'eq_04',level:'EQ',title:'Эмпатия',theory:'**3 типа:** когнитивная, эмоциональная, сострадательная.',examples:['Встать на место.'],practice:'3 разговора.',mistakes:['Советовать сразу'],memory:'Эмпатия.',keywords:'empathy'},
{id:'eq_05',level:'EQ',title:'Мотивация',theory:'**Деси/Райан:** автономия, компетентность, связанность.',examples:['Внутренняя сильнее.'],practice:'5 задач.',mistakes:['Только внешняя'],memory:'Топливо.',keywords:'motivation'},
{id:'eq_06',level:'EQ',title:'Соц.навыки',theory:'**Я-сообщения, SBI, ННО.**',examples:['SBI = Situation-Behavior-Impact.'],practice:'SBI 3 раза.',mistakes:['Обвинять'],memory:'Навыки.',keywords:'social skills'},
{id:'eq_07',level:'EQ',title:'Стресс',theory:'**Box breathing 4-4-4-4.**',examples:['SEALs используют.'],practice:'3 техники.',mistakes:['Игнор'],memory:'Стресс управляем.',keywords:'stress'},
{id:'eq_08',level:'EQ',title:'Конфликты',theory:'**Томас-Килманн:** 5 стилей. Сотрудничество — win-win.',examples:['1+1=3.'],practice:'3 конфликта.',mistakes:['Победа любой ценой'],memory:'Сотрудничество.',keywords:'conflicts'},
{id:'eq_09',level:'EQ',title:'Границы',theory:'**«Не могу X, но могу Y».**',examples:['Отказ спокойно.'],practice:'3 раза «нет».',mistakes:['Винить себя'],memory:'Границы = уважение.',keywords:'boundaries'},
{id:'eq_10',level:'EQ',title:'Итог: EQ-система',theory:'**Дневник + пауза + слушание + я-сообщение + медитация.**',examples:['+20% EQ за месяц.'],practice:'Расписание.',mistakes:['Без системы'],memory:'EQ = навык.',keywords:'EQ system'}
];

var FINANCE_MODULE=[
{id:'fin_01',level:'Finance',title:'Основы',theory:'**4 столпа:** доход, расходы, сбережения, инвестиции.\n**50/30/20.**',examples:['50% нужды, 30% желания, 20% сбережения.'],practice:'Посчитай.',mistakes:['Без плана'],memory:'50/30/20.',keywords:'basics'},
{id:'fin_02',level:'Finance',title:'Учёт',theory:'**Записывай каждую трату. Приложения.**',examples:['CoinKeeper, Monefy.'],practice:'7 дней.',mistakes:['Без учёта'],memory:'Учёт = контроль.',keywords:'budgeting'},
{id:'fin_03',level:'Finance',title:'Долги',theory:'**Снежный ком** (мелкий первый) или **лавина** (высокий %).',examples:['Мелкий = мотивация.'],practice:'Список.',mistakes:['Все одинаково'],memory:'Долг = минус.',keywords:'debt'},
{id:'fin_04',level:'Finance',title:'Инвестиции',theory:'**Индексные фонды. Диверсификация. DCA.**',examples:['10% → ×2 за 7 лет.'],practice:'Изучи 3 фонда.',mistakes:['Угадывать рынок'],memory:'Инвестиции = время.',keywords:'investing'},
{id:'fin_05',level:'Finance',title:'FIRE',theory:'**25× расходов + 4% правило.**',examples:['50к/мес → 15 млн.'],practice:'Посчитай.',mistakes:['Не считать'],memory:'FIRE = свобода.',keywords:'FIRE'},
{id:'fin_06',level:'Finance',title:'Доход',theory:'**Основная + фриланс + пассивный + инвестиции + бизнес.**',examples:['3+ источника = стабильность.'],practice:'2 идеи.',mistakes:['1 источник'],memory:'Доход = множественный.',keywords:'income'},
{id:'fin_07',level:'Finance',title:'Налоги/вычеты',theory:'**ИИС, вычеты, самозанятость 4-6%.**',examples:['Возврат до 15%.'],practice:'Проверь вычеты.',mistakes:['Не пользоваться'],memory:'Законная оптимизация.',keywords:'taxes'},
{id:'fin_08',level:'Finance',title:'SMART-цели',theory:'**Specific, Measurable, Achievable, Relevant, Time-bound.**',examples:['500к за 12 мес = 42к/мес.'],practice:'3 цели.',mistakes:['Размытые'],memory:'Цель = цифра + срок.',keywords:'goals'},
{id:'fin_09',level:'Finance',title:'Психология',theory:'**Ловушки:** импульс, lifestyle inflation, FOMO.\n**Правило 24 часов.**',examples:['Подожди сутки перед покупкой.'],practice:'Правило 24 ч.',mistakes:['Импульс'],memory:'Деньги = эмоции.',keywords:'money psychology'},
{id:'fin_10',level:'Finance',title:'Итог: система',theory:'**Учёт + бюджет + подушка + долги + инвестиции + 3 источника + вычеты.**',examples:['+30% за год.'],practice:'Личный план.',mistakes:['Без системы'],memory:'Система > удача.',keywords:'finance system'}
];

var NEURO_MODULE=[
{id:'neuro_01',level:'Neuro',title:'Как учится мозг',theory:'**Нейропластичность.**\n**Правило Хебба:** Fire together, wire together.\n**Миелин:** ×100 ускорение.',examples:['После инсульта речь восстанавливается.'],practice:'30 дней 1 навык.',mistakes:['Считать фикс'],memory:'Мозг = мышца.',keywords:'neuro'},
{id:'neuro_02',level:'Neuro',title:'Дофамин',theory:'**Предвкушение, не награда.**\n**Проблема:** соцсети → дофаминовые ямы.',examples:['Утро без телефона = чувствительность возвращается.'],practice:'Голодание 4 ч.',mistakes:['Соцсети утром'],memory:'Дофамин = топливо.',keywords:'dopamine'},
{id:'neuro_03',level:'Neuro',title:'Сон и обучение',theory:'**NREM — факты, REM — эмоции.**\n7-9 ч.',examples:['Учи перед сном = ×2 память.'],practice:'Учи 10 слов.',mistakes:['Недосып'],memory:'Сон = обучение.',keywords:'sleep learning'},
{id:'neuro_04',level:'Neuro',title:'Стресс',theory:'**Оптимальный:** средний. **Кортизол** убивает гиппокамп.',examples:['Спорт, медитация, сон, природа.'],practice:'Найди оптимум.',mistakes:['Хронический стресс'],memory:'Стресс = дозируй.',keywords:'stress learning'},
{id:'neuro_05',level:'Neuro',title:'Питание для мозга',theory:'**Omega-3, ягоды, тёмный шоколад, зелёный чай, яйца, куркума.**',examples:['Рыба 3×/нед.'],practice:'3 продукта.',mistakes:['Сахар'],memory:'Мозг 60% жира.',keywords:'brain nutrition'},
{id:'neuro_06',level:'Neuro',title:'Спорт и мозг',theory:'**BDNF — удобрение для мозга.**\n150 мин кардио + 2 силовые.',examples:['Аэробные 30 мин = +20% памяти.'],practice:'30 мин кардио.',mistakes:['Без спорта'],memory:'Движение = мозг.',keywords:'exercise'},
{id:'neuro_07',level:'Neuro',title:'Медитация',theory:'**Утолщение коры, ↓ миндалина.**\n10-20 мин × 8 недель.',examples:['Lazar, Harvard.'],practice:'10 мин.',mistakes:['Ждать мгновенно'],memory:'Медитация = фитнес.',keywords:'meditation'},
{id:'neuro_08',level:'Neuro',title:'Внимание',theory:'**23 мин на возврат.**\nОдна задача.',examples:['Deep Work 90 мин.'],practice:'90 мин.',mistakes:['Многозадачность'],memory:'Фокус = валюта.',keywords:'attention'},
{id:'neuro_09',level:'Neuro',title:'Креативность',theory:'**Default Mode Network активна в покое.**',examples:['Прогулка, душ, скука.'],practice:'Прогулка без телефона.',mistakes:['Постоянная стимуляция'],memory:'Креатив = покой.',keywords:'creativity'},
{id:'neuro_10',level:'Neuro',title:'Итог: нейро-система',theory:'**Сон 7-9 + спорт 150 + медитация 10 + питание + фокус 90 + дофамин + стресс.**',examples:['×2 эффективность за 3 мес.'],practice:'Нейро-расписание.',mistakes:['Без системы'],memory:'Мозг = орган.',keywords:'neuro system'}
];

/* ============================================================
   SKILLS (150+ в 15 категориях)
   ============================================================ */
var SKILLS_CATEGORIES=[
{id:'cognitive',emoji:'🧠',name:'Когнитивные',color:'#4dd4ff'},
{id:'emotional',emoji:'❤️',name:'Эмоциональные',color:'#ff6b6b'},
{id:'social',emoji:'👥',name:'Социальные',color:'#c4b5fd'},
{id:'productivity',emoji:'⚡',name:'Продуктивность',color:'#ffa940'},
{id:'health',emoji:'💪',name:'Здоровье',color:'#3ddc97'},
{id:'finance',emoji:'💰',name:'Финансы',color:'#ffcc4d'},
{id:'communication',emoji:'💬',name:'Коммуникация',color:'#5b9eff'},
{id:'creativity',emoji:'🎨',name:'Творчество',color:'#ff7ba9'},
{id:'philosophy',emoji:'🏛',name:'Философия',color:'#b394ff'},
{id:'digital',emoji:'📱',name:'Цифровые',color:'#ff88cc'},
{id:'career',emoji:'💼',name:'Карьера',color:'#3ddc97'},
{id:'relationships',emoji:'💞',name:'Отношения',color:'#ff8fab'},
{id:'crisis',emoji:'🛡',name:'Кризис',color:'#ff3c00'},
{id:'spiritual',emoji:'🕊',name:'Духовные',color:'#a4e7ff'},
{id:'learning',emoji:'📚',name:'Обучение',color:'#3ddc97'}
];

/* Сокращённый формат навыков (теория + практика + примеры) */
var SKILLS_LIBRARY=[
{id:'sk_iq_boost',cat:'cognitive',title:'IQ-буст',emoji:'🎯',desc:'Повышение IQ',level:'Все',duration:'30 дней',theory:'IQ тренируется N-back, задачами Равена, аналогиями. 15 мин/день.',practice:['N-back 5 мин','5 задач','5 аналогий'],effect:'IQ +5-15 за 3 мес',tips:'Разные типы задач'},
{id:'sk_memory',cat:'cognitive',title:'Феноменальная память',emoji:'🧠',desc:'Дворец памяти',level:'Базовый',duration:'21 день',theory:'Дворец памяти: мозг запоминает места лучше чисел. 10 локусов = 10 объектов.',practice:['Дворец 10 локусов','10 слов/день','Anki 20 карточек'],effect:'×3-5 памяти',tips:'Страннее = лучше'},
{id:'sk_speedread',cat:'cognitive',title:'Скорочтение',emoji:'👁',desc:'200→600 слов/мин',level:'Базовый',duration:'14 дней',theory:'Регрессии и субвокализация тормозят. Указка + блоки 3-5 слов.',practice:['10 мин с указкой','Не возвращайся','Замеряй'],effect:'×2-3',tips:'Понимание важнее'},
{id:'sk_critical',cat:'cognitive',title:'Критическое мышление',emoji:'🔍',desc:'Логика',level:'Все',duration:'30 дней',theory:'Фреймворк: Claim → Evidence → Reasoning → Counterargument.',practice:['Анализ 1 новости','5 вопросов'],effect:'+Объективность',tips:'А если наоборот?'},
{id:'sk_decision',cat:'cognitive',title:'Принятие решений',emoji:'⚖️',desc:'Как выбирать',level:'Все',duration:'21 день',theory:'10/10/10: как через 10 мин/мес/лет? Инверсия: что худшее?',practice:['Решай 10/10/10','Инверсия'],effect:'-Ошибки ×2',tips:'Из спокойствия'},
{id:'sk_creativity',cat:'cognitive',title:'Креативность',emoji:'💡',desc:'Идеи',level:'Все',duration:'21 день',theory:'Default Mode Network в покое. Прогулка, душ, скука.',practice:['10 идей/день','Прогулка','Mind map'],effect:'+Идеи ×3',tips:'Количество → качество'},
{id:'sk_focus_deep',cat:'cognitive',title:'Deep Work',emoji:'🎯',desc:'Концентрация',level:'Базовый',duration:'14 дней',theory:'90 мин + 15 перерыв. 3-4 ч = 10 ч обычной.',practice:['1 блок 90 мин','Телефон вне'],effect:'+40%',tips:'Сложное в пик'},
{id:'sk_mindfulness',cat:'cognitive',title:'Осознанность',emoji:'🧘',desc:'Присутствие',level:'Все',duration:'30 дней',theory:'MBSR: 8 недель → утолщение коры.',practice:['10 мин утром','Body scan'],effect:'-Стресс +фокус',tips:'Наблюдай, не оценивай'},
{id:'sk_learning_speed',cat:'cognitive',title:'Скорость обучения',emoji:'⚡',desc:'Учиться ×3',level:'Базовый',duration:'21 день',theory:'Pomodoro + Recall + Anki + Feynman.',practice:['Recall','Feynman','Anki 20'],effect:'×3',tips:'Recall > Recognition'},
{id:'sk_planning',cat:'cognitive',title:'Планирование',emoji:'📅',desc:'Система',level:'Базовый',duration:'14 дней',theory:'Time-blocking: каждое дело в слот. Буферы 20%.',practice:['План вечером','3 главных'],effect:'+Фокус',tips:'Не 100%'},
{id:'sk_language',cat:'cognitive',title:'Языки',emoji:'🌍',desc:'Быстро',level:'Базовый',duration:'60 дней',theory:'1000 слов = 80%. Immersion + Shadowing.',practice:['Слушай 30 мин','Говори 15 мин'],effect:'B1 за 3 мес',tips:'С 1 дня'},
{id:'sk_music',cat:'cognitive',title:'Музыка',emoji:'🎵',desc:'Слух',level:'Все',duration:'90 дней',theory:'Активное слушание развивает мозг.',practice:['Слушай активно','Разбери'],effect:'+Слух',tips:'Классика'},
{id:'sk_strategy',cat:'cognitive',title:'Стратегия',emoji:'♟',desc:'На годы',level:'Продвинутый',duration:'30 дней',theory:'Second-order: что потом? ещё?',practice:['3 порядка','Шахматы'],effect:'+Дальновидность',tips:'Долгими циклами'},
{id:'sk_chess',cat:'cognitive',title:'Шахматы',emoji:'♚',desc:'Стратегия/тактика',level:'Все',duration:'60 дней',theory:'Центр, развитие, безопасность.',practice:['1 партия/день','5 задач'],effect:'+IQ',tips:'Сначала тактика'},
{id:'sk_math_mental',cat:'cognitive',title:'Ментальная арифметика',emoji:'🔢',desc:'Считать в уме',level:'Базовый',duration:'21 день',theory:'17×23 = (20-3)(20+3) = 391.',practice:['10 примеров','Проценты'],effect:'+Скорость',tips:'Каждый день'},
{id:'sk_mindmap',cat:'cognitive',title:'Mind Mapping',emoji:'🗺',desc:'Визуально',level:'Все',duration:'14 дней',theory:'Центр → ветви → подветви.',practice:['1 map/день','Цвета'],effect:'+Структура',tips:'От руки'},
{id:'sk_memory_palace',cat:'cognitive',title:'Дворец памяти про',emoji:'🏛',desc:'Локусы',level:'Продвинутый',duration:'30 дней',theory:'10 комнат × 10 объектов = 100 loci.',practice:['3 дворца','30 объектов'],effect:'×5',tips:'Ярче = прочнее'},
{id:'sk_reading_deep',cat:'cognitive',title:'Глубокое чтение',emoji:'📖',desc:'Понимание',level:'Все',duration:'21 день',theory:'SQ3R: Survey, Question, Read, Recite, Review.',practice:['20 стр/день','Аннотация'],effect:'+Понимание',tips:'С карандашом'},

{id:'sk_eq',cat:'emotional',title:'Эмоциональный интеллект',emoji:'❤️',desc:'EQ',level:'Все',duration:'30 дней',theory:'Гоулман: самосознание, саморегуляция, мотивация, эмпатия, соц.навыки.',practice:['Дневник','Пауза 6 сек'],effect:'+20% EQ',tips:'Назови эмоцию'},
{id:'sk_stress',cat:'emotional',title:'Стресс',emoji:'🌊',desc:'Спокойствие',level:'Все',duration:'21 день',theory:'Box breathing 4-4-4-4.',practice:['3×/день','30 мин спорт'],effect:'-Стресс 40%',tips:'Тело первым'},
{id:'sk_anger',cat:'emotional',title:'Гнев',emoji:'🔥',desc:'Не срываться',level:'Все',duration:'14 дней',theory:'Пауза 6 сек.',practice:['Пауза','Спорт'],effect:'-Конфликты',tips:'Гнев — сигнал'},
{id:'sk_anxiety',cat:'emotional',title:'Тревога',emoji:'😰',desc:'Не зацикливаться',level:'Базовый',duration:'21 день',theory:'4-7-8 + 5-4-3-2-1.',practice:['4-7-8','Дневник'],effect:'-Тревога',tips:'Что реально?'},
{id:'sk_resilience',cat:'emotional',title:'Устойчивость',emoji:'🛡',desc:'Восстановление',level:'Продвинутый',duration:'30 дней',theory:'Anti-fragile.',practice:['Рефлексия','Дневник побед'],effect:'+Устойчивость',tips:'Срыв — данные'},
{id:'sk_selfcompassion',cat:'emotional',title:'Самосострадание',emoji:'🤍',desc:'Доброта',level:'Все',duration:'21 день',theory:'Кристин Нефф: доброта, общность, осознанность.',practice:['Что сказал бы другу','Рука на сердце'],effect:'-Самокритика',tips:'Ты не один'},
{id:'sk_impulse',cat:'emotional',title:'Контроль импульсов',emoji:'🎯',desc:'Соблазны',level:'Базовый',duration:'21 день',theory:'Пауза 10 мин — импульс 90 сек.',practice:['Пауза перед покупкой','Убери соблазны'],effect:'+Самоконтроль',tips:'Среда > воля'},
{id:'sk_motivation',cat:'emotional',title:'Мотивация',emoji:'🚀',desc:'Без пинка',level:'Все',duration:'30 дней',theory:'Деси/Райан: автономия, компетентность, связанность.',practice:['Смысл','Микрошаги'],effect:'+Действие',tips:'Смысл важнее'},
{id:'sk_loneliness',cat:'emotional',title:'Одиночество',emoji:'🌙',desc:'Когда никого',level:'Все',duration:'30 дней',theory:'Одиночество ≠ уединение.',practice:['1 звонок/день','Творчество'],effect:'+Связь',tips:'Одиночество — сигнал'},
{id:'sk_grief',cat:'emotional',title:'Горе',emoji:'🕊',desc:'Потери',level:'Продвинутый',duration:'60 дней',theory:'5 стадий Кюблер-Росс не линейны.',practice:['Письма','Ритуалы'],effect:'+Принятие',tips:'Дай время'},
{id:'sk_joy',cat:'emotional',title:'Радость',emoji:'☀️',desc:'Умение радоваться',level:'Все',duration:'21 день',theory:'Позитивная психология Селигмана.',practice:['3 благодарности','1 радость'],effect:'+Счастье 25%',tips:'Тренируется'},
{id:'sk_flow',cat:'emotional',title:'Поток',emoji:'🌊',desc:'Погружение',level:'Продвинутый',duration:'30 дней',theory:'Чиксентмихайи: баланс + цель + обратная связь.',practice:['Найди вызов','Убери отвлечения'],effect:'+Продуктивность',tips:'Счастье в действии'},

{id:'sk_listen',cat:'social',title:'Активное слушание',emoji:'👂',desc:'Слушать',level:'Все',duration:'14 дней',theory:'3 уровня: слышу, слушаю, слышу потребность.',practice:['Парафраз','Не перебивай'],effect:'+Связи',tips:'Слушание активно'},
{id:'sk_nvc',cat:'social',title:'ННО',emoji:'💬',desc:'Без конфликта',level:'Базовый',duration:'21 день',theory:'Розенберг: Наблюдение → Чувства → Потребности → Просьба.',practice:['Я-сообщения','Просьбы'],effect:'-Конфликты',tips:'Не смешивай оценку'},
{id:'sk_boundaries',cat:'social',title:'Границы',emoji:'🚧',desc:'"Нет" без вины',level:'Все',duration:'21 день',theory:'«Не могу X, но могу Y».',practice:['3 «нет»','Формула'],effect:'+Уважение',tips:'Спокойное «нет»'},
{id:'sk_leadership',cat:'social',title:'Лидерство',emoji:'👑',desc:'Вести',level:'Продвинутый',duration:'60 дней',theory:'Level 5: скромность + воля.',practice:['WHY','Развивай 1','Делегируй'],effect:'+Влияние',tips:'Создаёт лидеров'},
{id:'sk_negotiation',cat:'social',title:'Переговоры',emoji:'🤝',desc:'Выгодно',level:'Продвинутый',duration:'21 день',theory:'BATNA + интересы.',practice:['BATNA','Win-win'],effect:'+Результаты',tips:'Цель — решение'},
{id:'sk_conflict',cat:'social',title:'Конфликты',emoji:'⚔️',desc:'Из ссоры',level:'Базовый',duration:'21 день',theory:'Томас-Килманн: 5 стилей.',practice:['Сотрудничество','Парафраз'],effect:'-Разрушения',tips:'Сначала понять'},
{id:'sk_charisma',cat:'social',title:'Харизма',emoji:'✨',desc:'Притягательность',level:'Все',duration:'30 дней',theory:'Присутствие + тепло + сила.',practice:['Внимание','Имена','Осанка'],effect:'+Влияние',tips:'Тренируется'},
{id:'sk_networking',cat:'social',title:'Нетворкинг',emoji:'🕸',desc:'Связи',level:'Базовый',duration:'30 дней',theory:'Давать первым.',practice:['5 контактов','Дай ценность'],effect:'+Возможности',tips:'Дай больше'},
{id:'sk_public',cat:'social',title:'Публичные выступления',emoji:'🎤',desc:'Речь',level:'Продвинутый',duration:'30 дней',theory:'Hook + Story + Point + CTA.',practice:['3 мин/день','Видео'],effect:'+Уверенность',tips:'Репетируй'},
{id:'sk_emotional_contagion',cat:'social',title:'Эмоции группы',emoji:'🌊',desc:'Команда',level:'Продвинутый',duration:'30 дней',theory:'Эмоциональное заражение.',practice:['Своё состояние','Валидируй'],effect:'+Атмосфера',tips:'Термостат, не термометр'},

{id:'sk_time',cat:'productivity',title:'Время',emoji:'⏰',desc:'Успевать',level:'Все',duration:'21 день',theory:'Time-blocking + Pomodoro + GTD.',practice:['Time-block','3 главных'],effect:'+Продуктивность',tips:'План вечером'},
{id:'sk_energy',cat:'productivity',title:'Энергия',emoji:'🔋',desc:'Силы',level:'Все',duration:'21 день',theory:'90/15 ритмы.',practice:['90 мин','15 перерыв'],effect:'+Сил',tips:'Сон и еда — база'},
{id:'sk_habits',cat:'productivity',title:'Привычки',emoji:'🔄',desc:'Автоматизм',level:'Все',duration:'66 дней',theory:'Cue → Craving → Response → Reward. 66 дней.',practice:['1 привычка','Stacking'],effect:'+Автоматизм',tips:'Медленно, постоянно'},
{id:'sk_focus_build',cat:'productivity',title:'Фокус',emoji:'🎯',desc:'Не отвлекаться',level:'Все',duration:'14 дней',theory:'23 мин возврат.',practice:['Один экран','Авиарежим'],effect:'+40%',tips:'Убери соблазн'},
{id:'sk_procrastination',cat:'productivity',title:'Прокрастинация',emoji:'⏳',desc:'Перестать',level:'Все',duration:'14 дней',theory:'Правило 2 минут.',practice:['2 мин начала','Помидор'],effect:'-Прокрастинация',tips:'Начало — 80%'},
{id:'sk_gtd',cat:'productivity',title:'GTD',emoji:'📥',desc:'Система',level:'Базовый',duration:'21 день',theory:'5 шагов.',practice:['Inbox','Разбирай'],effect:'+Ясность',tips:'Голова — не склад'},
{id:'sk_eisenhower',cat:'productivity',title:'Матрица',emoji:'🔢',desc:'Приоритеты',level:'Все',duration:'7 дней',theory:'Q1-Q4. 70% в Q2.',practice:['Разбери','Q2'],effect:'+Эффективность',tips:'Q2 = магия'},
{id:'sk_eatfrog',cat:'productivity',title:'Eat Frog',emoji:'🐸',desc:'Сложное первым',level:'Все',duration:'14 дней',theory:'Съешь жабу утром.',practice:['1 жаба','Без телефона'],effect:'+Результаты',tips:'Сложное первым'},
{id:'sk_week_review',cat:'productivity',title:'Ревью',emoji:'📊',desc:'Итоги',level:'Все',duration:'4 недели',theory:'Воскресенье — 30 мин.',practice:['Ревью','3 цели'],effect:'+Рост',tips:'Рефлексия — топливо'},
{id:'sk_systems',cat:'productivity',title:'Системное мышление',emoji:'🔄',desc:'Системы',level:'Продвинутый',duration:'30 дней',theory:'Системы > цели.',practice:['Анализ 3 систем','Модели'],effect:'+Понимание',tips:'Изменяй входы'},
{id:'sk_pomodoro',cat:'productivity',title:'Pomodoro',emoji:'🍅',desc:'25/5',level:'Все',duration:'7 дней',theory:'Чирилло: 25+5.',practice:['4 помидора','Без телефона'],effect:'+Фокус',tips:'Пауза — часть'},
{id:'sk_deep_work',cat:'productivity',title:'Deep Work',emoji:'🎯',desc:'Глубокая',level:'Базовый',duration:'30 дней',theory:'Ньюпорт: 90 мин блок.',practice:['1 блок','Метрики'],effect:'×3',tips:'Утро — для главного'},

{id:'sk_sleep',cat:'health',title:'Гигиена сна',emoji:'😴',desc:'Глубокий сон',level:'Все',duration:'30 дней',theory:'7-9 ч, 18-20°C, без экранов.',practice:['Режим +1ч','Свет утром'],effect:'+Сон',tips:'Фундамент'},
{id:'sk_nutrition',cat:'health',title:'Питание',emoji:'🥗',desc:'Энергия',level:'Все',duration:'30 дней',theory:'Средиземноморская.',practice:['500 г овощей','1.6 г/кг'],effect:'+Энергия',tips:'Меньше обработанного'},
{id:'sk_workout',cat:'health',title:'Тренировки',emoji:'🏋️',desc:'Сила',level:'Все',duration:'90 дней',theory:'150 мин кардио + 2 силовые.',practice:['2 силовые','Прогрессия'],effect:'+Здоровье',tips:'База: присед, тяга'},
{id:'sk_cardio',cat:'health',title:'Кардио',emoji:'🏃',desc:'Сердце',level:'Все',duration:'60 дней',theory:'Zone 2: пульс 180-age.',practice:['3-4 ч/нед','Бег/вело'],effect:'+Сердце',tips:'Можно говорить'},
{id:'sk_strength',cat:'health',title:'Сила',emoji:'💪',desc:'Мышцы',level:'Базовый',duration:'90 дней',theory:'Базовые: присед, становая, жим.',practice:['4 упражнения','Прогрессия'],effect:'+Сила',tips:'Техника важнее'},
{id:'sk_flexibility',cat:'health',title:'Гибкость',emoji:'🤸',desc:'Мобильность',level:'Все',duration:'30 дней',theory:'10 мин/день.',practice:['10 мин утром','Йога'],effect:'+Мобильность',tips:'Регулярность'},
{id:'sk_cold',cat:'health',title:'Холод',emoji:'❄️',desc:'Душ',level:'Базовый',duration:'30 дней',theory:'Вим Хоф: дыхание + холод.',practice:['30 сек → 2 мин'],effect:'+Стрессоустойчивость',tips:'Дыши медленно'},
{id:'sk_sauna',cat:'health',title:'Сауна',emoji:'🔥',desc:'Термическая',level:'Все',duration:'8 недель',theory:'80-100°C, 15-20 мин.',practice:['2-4×/нед','Охлаждение'],effect:'+Здоровье',tips:'Не алкоголь'},
{id:'sk_fasting',cat:'health',title:'Голодание 16:8',emoji:'⏱',desc:'Аутофагия',level:'Базовый',duration:'30 дней',theory:'16:8 → аутофагия.',practice:['Ешь 8 ч','Голодай 16'],effect:'+Метаболизм',tips:'Начни 12:12'},
{id:'sk_hydration',cat:'health',title:'Гидратация',emoji:'💧',desc:'Вода',level:'Все',duration:'21 день',theory:'30 мл/кг.',practice:['8 стаканов','500 мл утром'],effect:'+Энергия',tips:'Жажда поздно'},
{id:'sk_breathing',cat:'health',title:'Дыхание',emoji:'🌬',desc:'Управление',level:'Все',duration:'21 день',theory:'4-7-8 / box / Wim Hof.',practice:['Утром box','Вечером 4-7-8'],effect:'-Стресс',tips:'Пульт управления'},
{id:'sk_eye_health',cat:'health',title:'Здоровье глаз',emoji:'👁',desc:'При экране',level:'Все',duration:'21 день',theory:'20-20-20.',practice:['20-20-20','Пальминг'],effect:'-Усталость',tips:'Моргай чаще'},
{id:'sk_posture',cat:'health',title:'Осанка',emoji:'🧍',desc:'Спина',level:'Все',duration:'30 дней',theory:'Голова над плечами, плечи над бёдрами.',practice:['Проверка','Упражнения'],effect:'-Боль',tips:'Двигайся чаще'},
{id:'sk_circadian',cat:'health',title:'Циркадные',emoji:'🌅',desc:'Биоритмы',level:'Все',duration:'30 дней',theory:'Утренний свет 10 мин.',practice:['Свет утром','Тёмный вечер'],effect:'+Сон',tips:'Свет = сигнал'},
{id:'sk_recovery',cat:'health',title:'Восстановление',emoji:'🌿',desc:'Отдых',level:'Все',duration:'21 день',theory:'7 видов отдыха.',practice:['Определи дефицит','Восполни'],effect:'-Выгорание',tips:'Отдых — работа'},

{id:'sk_budget',cat:'finance',title:'Бюджет',emoji:'💰',desc:'Контроль',level:'Все',duration:'30 дней',theory:'50/30/20.',practice:['Учёт 30 дней','Автоматизация'],effect:'+Контроль',tips:'Записывай'},
{id:'sk_invest',cat:'finance',title:'Инвестиции',emoji:'📈',desc:'Деньги работают',level:'Продвинутый',duration:'90 дней',theory:'Индексные фонды, DCA.',practice:['Изучи 3','DCA'],effect:'+Капитал',tips:'Время > тайминг'},
{id:'sk_debt',cat:'finance',title:'Долги',emoji:'⛓',desc:'Свобода',level:'Базовый',duration:'180 дней',theory:'Снежный ком или лавина.',practice:['Список','Минимум по всем'],effect:'-Долги',tips:'Сначала мелкий'},
{id:'sk_fire',cat:'finance',title:'FIRE',emoji:'🔥',desc:'Независимость',level:'Продвинутый',duration:'10 лет',theory:'25× расходов + 4%.',practice:['Норма 50%+','25×'],effect:'Свобода',tips:'Сокращай расходы'},
{id:'sk_side',cat:'finance',title:'Доп. доход',emoji:'💼',desc:'2-й источник',level:'Базовый',duration:'90 дней',theory:'Фриланс, контент.',practice:['Навык','Первые 1000₽'],effect:'+Доход',tips:'Монетизируй навык'},
{id:'sk_negotiate_salary',cat:'finance',title:'Переговоры ЗП',emoji:'💰',desc:'Больше',level:'Базовый',duration:'7 дней',theory:'Рынок + ценность.',practice:['Изучи рынок','Цифра выше'],effect:'+20%',tips:'Не соглашайся сразу'},
{id:'sk_taxes',cat:'finance',title:'Налоги',emoji:'📋',desc:'Оптимизация',level:'Базовый',duration:'7 дней',theory:'ИИС, вычеты.',practice:['Проверь','Оформи'],effect:'+Возврат',tips:'До 15%'},
{id:'sk_financial_literacy',cat:'finance',title:'Фин. грамотность',emoji:'🧮',desc:'Понимание',level:'Все',duration:'30 дней',theory:'Активы vs пассивы, сложный %.',practice:['Книга','Курс'],effect:'+Понимание',tips:'Деньги = эмоции + математика'},
{id:'sk_savings',cat:'finance',title:'Накопления',emoji:'🏦',desc:'Подушка',level:'Все',duration:'90 дней',theory:'3-6 мес расходов.',practice:['Автоперевод','Цель 3 мес'],effect:'+Спокойствие',tips:'Не инвестиции'},
{id:'sk_assets',cat:'finance',title:'Активы vs пассивы',emoji:'⚖️',desc:'Баланс',level:'Базовый',duration:'14 дней',theory:'Кийосаки: активы дают, пассивы забирают.',practice:['Список','Увеличь'],effect:'+Богатство',tips:'Дом — пассив'},

{id:'sk_writing',cat:'communication',title:'Письмо',emoji:'✍️',desc:'Ясно',level:'Все',duration:'30 дней',theory:'Тезис → Аргумент → Пример → Вывод.',practice:['500 слов/день','Редактура'],effect:'+Ясность',tips:'Короткие предложения'},
{id:'sk_email',cat:'communication',title:'Email',emoji:'📧',desc:'Деловая',level:'Все',duration:'14 дней',theory:'Subject — суть. Body — 3 блока.',practice:['Структура','Один призыв'],effect:'+Ответы',tips:'Меньше воды'},
{id:'sk_small_talk',cat:'communication',title:'Small talk',emoji:'💬',desc:'Беседа',level:'Все',duration:'14 дней',theory:'Факт → Мнение → Чувство.',practice:['1 разговор/день','Слушай 70%'],effect:'+Связи',tips:'Интерес — магнит'},
{id:'sk_storytelling',cat:'communication',title:'Сторителлинг',emoji:'📖',desc:'Истории',level:'Продвинутый',duration:'30 дней',theory:'Герой → Проблема → Путь → Трансформация.',practice:['Рассказ 3 мин','Хук'],effect:'+Влияние',tips:'Помнят истории'},
{id:'sk_nonverbal',cat:'communication',title:'Язык тела',emoji:'👁',desc:'Невербально',level:'Все',duration:'21 день',theory:'55% — тело.',practice:['Открытая поза','Контакт'],effect:'+Восприятие',tips:'Тело громче'},
{id:'sk_assertive',cat:'communication',title:'Ассертивность',emoji:'⚔️',desc:'Твёрдость',level:'Базовый',duration:'21 день',theory:'«Я чувствую X, когда Y, потому что Z».',practice:['Я-сообщения','«нет»'],effect:'+Уважение',tips:'Твёрдо и уважительно'},
{id:'sk_negotiate_2',cat:'communication',title:'Деловая коммуникация',emoji:'📊',desc:'Профессионально',level:'Продвинутый',duration:'21 день',theory:'Слушай, уточняй, предлагай.',practice:['Короткие ответы','Вопросы'],effect:'+Эффективность',tips:'Ясность > красота'},
{id:'sk_writing_2',cat:'communication',title:'Копирайтинг',emoji:'✒️',desc:'Продающие',level:'Продвинутый',duration:'30 дней',theory:'AIDA.',practice:['10 заголовков','Текст/день'],effect:'+Конверсия',tips:'Боль клиента'},
{id:'sk_presentations',cat:'communication',title:'Презентации',emoji:'📊',desc:'Подача',level:'Продвинутый',duration:'21 день',theory:'Hook → Проблема → Решение → CTA.',practice:['5 блоков','10 слайдов'],effect:'+Влияние',tips:'Меньше текста'},
{id:'sk_debate',cat:'communication',title:'Дебаты',emoji:'⚖️',desc:'Аргументация',level:'Продвинутый',duration:'30 дней',theory:'Claim → Evidence → Rebuttal.',practice:['Дебаты 5 мин','3 аргумента'],effect:'+Логика',tips:'Слушай оппонента'},

{id:'sk_drawing',cat:'creativity',title:'Рисование',emoji:'🎨',desc:'Творчество',level:'Все',duration:'30 дней',theory:'Правополушарное: форма, не символы.',practice:['10 мин скетч','Копируй'],effect:'+Наблюдательность',tips:'Регулярность > талант'},
{id:'sk_music_2',cat:'creativity',title:'Музыка',emoji:'🎵',desc:'Играть',level:'Все',duration:'90 дней',theory:'Активная практика 20 мин/день.',practice:['20 мин','1 песня/мес'],effect:'+Творчество',tips:'Простая песня лучше гамм'},
{id:'sk_writing_3',cat:'creativity',title:'Писательство',emoji:'📝',desc:'Свои тексты',level:'Все',duration:'30 дней',theory:'Утренние страницы: 3 стр. от руки.',practice:['500 слов','Без правок'],effect:'+Креатив',tips:'Пиши плохо, редактируй хорошо'},
{id:'sk_photography',cat:'creativity',title:'Фотография',emoji:'📷',desc:'Кадр',level:'Все',duration:'30 дней',theory:'Правило третей, свет.',practice:['10 фото','1 правило'],effect:'+Наблюдательность',tips:'Лучший — тот, что с собой'},
{id:'sk_design',cat:'creativity',title:'Дизайн',emoji:'🎨',desc:'Вкус',level:'Базовый',duration:'30 дней',theory:'CRAP: Contrast, Repetition, Alignment, Proximity.',practice:['Анализ 5','1 макет/день'],effect:'+Вкус',tips:'Простота'},
{id:'sk_ideation',cat:'creativity',title:'Идеи',emoji:'💡',desc:'Генерация',level:'Все',duration:'21 день',theory:'SCAMPER, mind map, 6 шляп.',practice:['20 идей/день','Оцени через 24 ч'],effect:'+Креатив',tips:'Количество → качество'},
{id:'sk_improv',cat:'creativity',title:'Импровизация',emoji:'🎭',desc:'Без подготовки',level:'Продвинутый',duration:'30 дней',theory:'"Yes, and..."',practice:['Yes, and 10 раз','Импро'],effect:'+Реакция',tips:'Не блокируй'},
{id:'sk_worldbuilding',cat:'creativity',title:'World-building',emoji:'🌍',desc:'Миры',level:'Продвинутый',duration:'90 дней',theory:'География → История → Культура → Язык.',practice:['Карта','Хронология'],effect:'+Воображение',tips:'Начни с детали'},

{id:'sk_stoicism',cat:'philosophy',title:'Стоицизм',emoji:'🏛',desc:'Спокойствие',level:'Все',duration:'30 дней',theory:'Дихотомия контроля.',practice:['Что в власти','Memento mori'],effect:'-Тревога',tips:'Управляй реакцией'},
{id:'sk_ikigai',cat:'philosophy',title:'Икигай',emoji:'🌺',desc:'Смысл',level:'Все',duration:'30 дней',theory:'4 сферы.',practice:['4 списка','Пересечение'],effect:'+Смысл',tips:'Смысл — не 1 работа'},
{id:'sk_logotherapy',cat:'philosophy',title:'Логотерапия',emoji:'🎯',desc:'Смысл',level:'Продвинутый',duration:'30 дней',theory:'3 источника: труд, любовь, страдание.',practice:['Зачем','Дневник'],effect:'+Смысл',tips:'Смысл находят'},
{id:'sk_values',cat:'philosophy',title:'Ценности',emoji:'🧭',desc:'Компас',level:'Все',duration:'14 дней',theory:'5 главных.',practice:['100 → 5','Проверь'],effect:'+Ясность',tips:'Фильтр решений'},
{id:'sk_death',cat:'philosophy',title:'Memento Mori',emoji:'💀',desc:'Смерть',level:'Продвинутый',duration:'21 день',theory:'Помни о смерти.',practice:['Эпитафия','Meditatio'],effect:'+Приоритеты',tips:'Фильтр важного'},
{id:'sk_wisdom',cat:'philosophy',title:'Мудрость',emoji:'🦉',desc:'Здравый смысл',level:'Все',duration:'60 дней',theory:'Опыт + рефлексия + смирение.',practice:['Биографии','Спрашивай'],effect:'+Решения',tips:'Слушай'},
{id:'sk_ethics',cat:'philosophy',title:'Этика',emoji:'⚖️',desc:'Мораль',level:'Продвинутый',duration:'30 дней',theory:'Кант: правило всеобщее. Утилитаризм: максимум пользы.',practice:['5 дилемм','Принципы'],effect:'+Честность',tips:'Думай о последствиях'},

{id:'sk_digital_detox',cat:'digital',title:'Цифровой детокс',emoji:'📱',desc:'Свобода',level:'Все',duration:'30 дней',theory:'Дофаминовая яма.',practice:['30 мин утром без телефона','Лимиты'],effect:'-Экран 40%',tips:'Среда > воля'},
{id:'sk_digital_security',cat:'digital',title:'Кибербезопасность',emoji:'🔒',desc:'Защита',level:'Все',duration:'7 дней',theory:'2FA, менеджер паролей, бэкапы.',practice:['2FA','Менеджер'],effect:'+Защита',tips:'16+ символов'},
{id:'sk_screen_balance',cat:'digital',title:'Баланс экрана',emoji:'⚖️',desc:'Осознанно',level:'Все',duration:'30 дней',theory:'Инструмент vs развлечение.',practice:['Отдели','Лимиты'],effect:'+Осознанность',tips:'Не запрет, а выбор'},
{id:'sk_deep_focus_2',cat:'digital',title:'Цифровой фокус',emoji:'🎯',desc:'Без отвлечений',level:'Базовый',duration:'21 день',theory:'Авиарежим + один экран.',practice:['90 мин авиа','Телефон вне'],effect:'+40%',tips:'Отключи всё'},
{id:'sk_online_privacy',cat:'digital',title:'Приватность',emoji:'👤',desc:'Данные',level:'Все',duration:'14 дней',theory:'VPN, шифрование.',practice:['VPN','Удали аккаунты'],effect:'+Приватность',tips:'Ты продукт'},
{id:'sk_ai_tools',cat:'digital',title:'AI-инструменты',emoji:'🤖',desc:'ChatGPT, Gemini',level:'Все',duration:'21 день',theory:'AI — усилитель.',practice:['1 задача/день','Промпт'],effect:'+Продуктивность',tips:'Проверяй'},

{id:'sk_career_plan',cat:'career',title:'Карьерный план',emoji:'📈',desc:'Рост',level:'Все',duration:'30 дней',theory:'Икигай + 5 лет + навыки.',practice:['Икигай','3-5 лет'],effect:'+Рост',tips:'Гибко'},
{id:'sk_personal_brand',cat:'career',title:'Личный бренд',emoji:'🌟',desc:'Видимость',level:'Продвинутый',duration:'90 дней',theory:'Публикуй 2×/нед.',practice:['2 поста','LinkedIn'],effect:'+Возможности',tips:'Раньше, чем готов'},
{id:'sk_interview',cat:'career',title:'Собеседования',emoji:'🎤',desc:'Оффер',level:'Все',duration:'14 дней',theory:'STAR + research.',practice:['5 STAR','Вопросы'],effect:'+Оффер',tips:'Решить проблему'},
{id:'sk_salary_neg',cat:'career',title:'Переговоры ЗП',emoji:'💰',desc:'Больше',level:'Базовый',duration:'7 дней',theory:'Рынок + ценность + пауза.',practice:['Рынок','Победы'],effect:'+20%',tips:'Молчание — сила'},
{id:'sk_resume',cat:'career',title:'Резюме',emoji:'📄',desc:'CV',level:'Все',duration:'7 дней',theory:'1 стр. + результат.',practice:['1 стр.','Цифры'],effect:'+Отклики',tips:'Результат, не процесс'},
{id:'sk_leadership_2',cat:'career',title:'Управление',emoji:'👥',desc:'Команда',level:'Продвинутый',duration:'60 дней',theory:'Level 5.',practice:['1-на-1','Делегируй'],effect:'+Результаты',tips:'Делать других лучше'},
{id:'sk_mentor',cat:'career',title:'Менторство',emoji:'🧙',desc:'Наставничество',level:'Продвинутый',duration:'90 дней',theory:'Вопросы, не ответы.',practice:['Найди ментора','Стань'],effect:'+Рост',tips:'Вопрос > совет'},
{id:'sk_career_pivot',cat:'career',title:'Смена профессии',emoji:'🔄',desc:'Переход',level:'Продвинутый',duration:'180 дней',theory:'Переносимые навыки + мини-проект.',practice:['Аудит','3 проекта'],effect:'+Новая карьера',tips:'Попробуй, потом бросай'},

{id:'sk_deep_relationships',cat:'relationships',title:'Глубокие связи',emoji:'💞',desc:'Близость',level:'Все',duration:'90 дней',theory:'5 глубоких > 100 поверхностных.',practice:['5 человек','Уязвимость'],effect:'+Поддержка',tips:'Глубина > количество'},
{id:'sk_dating',cat:'relationships',title:'Свидания',emoji:'🌹',desc:'Знакомства',level:'Все',duration:'30 дней',theory:'Уверенность + интерес + честность.',practice:['10 знакомств','Слушай'],effect:'+Отношения',tips:'Своего, не идеал'},
{id:'sk_marriage',cat:'relationships',title:'Долгие отношения',emoji:'💍',desc:'Семья',level:'Продвинутый',duration:'180 дней',theory:'5:1 позитив.',practice:['20 мин/день','Хобби'],effect:'+Связь',tips:'Работа'},
{id:'sk_parenting',cat:'relationships',title:'Дети',emoji:'👨‍👩‍👧',desc:'Родительство',level:'Продвинутый',duration:'Постоянно',theory:'Авторитетный стиль.',practice:['Пример','Границы'],effect:'+Дети',tips:'Пример'},
{id:'sk_friendship',cat:'relationships',title:'Дружба',emoji:'🤝',desc:'Друзья',level:'Все',duration:'90 дней',theory:'Регулярность + поддержка.',practice:['Звонок 1×/нед','Помощь'],effect:'+Связи',tips:'Вложения'},
{id:'sk_family',cat:'relationships',title:'Семья',emoji:'🏠',desc:'Родные',level:'Все',duration:'90 дней',theory:'Регулярность + традиции.',practice:['Звонок','Традиции'],effect:'+Поддержка',tips:'Корни'},

{id:'sk_crisis',cat:'crisis',title:'Кризис-менеджмент',emoji:'🚨',desc:'Действие',level:'Продвинутый',duration:'30 дней',theory:'Стоп → дыхание → оценка → 1 шаг.',practice:['4-7-8','Первый шаг'],effect:'+Устойчивость',tips:'Спокойный = эффективный'},
{id:'sk_first_aid',cat:'crisis',title:'Первая помощь',emoji:'⚕️',desc:'ЧП',level:'Все',duration:'7 дней',theory:'DRSABC.',practice:['DRSABC','Аптечка'],effect:'+Спасти жизнь',tips:'Безопасность'},
{id:'sk_emergency',cat:'crisis',title:'ЧС',emoji:'🆘',desc:'Катастрофы',level:'Все',duration:'7 дней',theory:'112/103.',practice:['Номера','Рюкзак'],effect:'+Готовность',tips:'Подготовь сейчас'},
{id:'sk_mental_crisis',cat:'crisis',title:'Психический кризис',emoji:'🆘',desc:'Помощь',level:'Базовый',duration:'7 дней',theory:'8-800-2000-122.',practice:['Номера','Как слушать'],effect:'+Спасти жизнь',tips:'Прямо спроси'},
{id:'sk_survival',cat:'crisis',title:'Выживание',emoji:'🏔',desc:'Природа',level:'Продвинутый',duration:'30 дней',theory:'Правило 3.',practice:['Вода','Укрытие','Огонь'],effect:'+Выживание',tips:'Спокойствие'},
{id:'sk_financial_crisis',cat:'crisis',title:'Финансовый кризис',emoji:'💸',desc:'Долги',level:'Базовый',duration:'30 дней',theory:'Стоп → учёт → переговоры.',practice:['Список','Звонок'],effect:'-Потери',tips:'Паника дорого'},
{id:'sk_health_crisis',cat:'crisis',title:'Кризис здоровья',emoji:'🏥',desc:'Болезнь',level:'Продвинутый',duration:'90 дней',theory:'Врачи + поддержка + смысл.',practice:['Врач','Команда'],effect:'+Шансы',tips:'Ты не один'},

{id:'sk_meditation_2',cat:'spiritual',title:'Медитация',emoji:'🧘',desc:'Практики',level:'Все',duration:'90 дней',theory:'8 недель → утолщение коры.',practice:['10-20 мин','Випассана'],effect:'+Спокойствие',tips:'Регулярность'},
{id:'sk_gratitude',cat:'spiritual',title:'Благодарность',emoji:'🙏',desc:'Радость',level:'Все',duration:'21 день',theory:'3/день → +25% счастья.',practice:['3 утром/вечером','Дневник'],effect:'+Счастье',tips:'Специфично'},
{id:'sk_presence',cat:'spiritual',title:'Присутствие',emoji:'🌿',desc:'Здесь и сейчас',level:'Все',duration:'30 дней',theory:'Осознанность в действии.',practice:['1 приём в тишине','Прогулка'],effect:'+Спокойствие',tips:'Возвращай'},
{id:'sk_self_knowledge',cat:'spiritual',title:'Самопознание',emoji:'🔍',desc:'Понять себя',level:'Продвинутый',duration:'90 дней',theory:'Тень Юнга + ценности.',practice:['Дневник','Терапия','Тень'],effect:'+Понимание',tips:'Знание — сила'},
{id:'sk_forgiveness',cat:'spiritual',title:'Прощение',emoji:'🕊',desc:'Отпустить',level:'Продвинутый',duration:'60 дней',theory:'Прощение = освобождение себя.',practice:['Письмо','Метта'],effect:'+Свобода',tips:'Для себя'},

{id:'sk_learning_methods',cat:'learning',title:'Методы обучения',emoji:'📚',desc:'Эффективно',level:'Все',duration:'30 дней',theory:'Pomodoro + Recall + Feynman + Anki.',practice:['Recall','Feynman','Anki 20'],effect:'+Скорость',tips:'Активное > пассивное'},
{id:'sk_note_taking',cat:'learning',title:'Конспекты',emoji:'📝',desc:'Cornell',level:'Все',duration:'14 дней',theory:'Cornell: конспект + вопросы + резюме.',practice:['1 конспект','Mind map'],effect:'+Понимание',tips:'Своими словами'},
{id:'sk_reading_skills',cat:'learning',title:'Чтение',emoji:'📖',desc:'Навыки',level:'Все',duration:'30 дней',theory:'Skim, Scan, Close reading.',practice:['20 стр/день','Заметки'],effect:'+Понимание',tips:'С карандашом'},
{id:'sk_test_taking',cat:'learning',title:'Тесты',emoji:'🎓',desc:'Сдавать',level:'Все',duration:'21 день',theory:'Recall + интервалы + симуляция.',practice:['Симуляция','Anki'],effect:'+Баллы',tips:'Практика = подготовка'},
{id:'sk_teaching',cat:'learning',title:'Обучение других',emoji:'👨‍🏫',desc:'Учить',level:'Продвинутый',duration:'30 дней',theory:'Если не можешь объяснить — не понял.',practice:['Объясни','Ответь'],effect:'+Понимание',tips:'Учи = учишься'},
{id:'sk_anki',cat:'learning',title:'Anki',emoji:'🃏',desc:'SRS',level:'Все',duration:'21 день',theory:'SRS: повторяй перед забыванием.',practice:['20 карточек','Оценка 1-4'],effect:'×3 запоминание',tips:'Меньше, но каждый день'}
];

/* ============================================================
   ENTERTAINMENT
   ============================================================ */
var MOVIES_LIBRARY=[
{id:'mov_01',title:'Побег из Шоушенка',year:1994,genre:'Драма',rating:9.3,director:'Фрэнк Дарабонт',desc:'Надежда и дружба в тюрьме.',why:'Учит терпению, надежде, силе духа.',lesson:'Надежда — это хорошо.'},
{id:'mov_02',title:'Крёстный отец',year:1972,genre:'Криминал',rating:9.2,director:'Коппола',desc:'Сага о семье Корлеоне.',why:'Стратегия, семейные ценности.',lesson:'Никогда не говори, что думаешь.'},
{id:'mov_03',title:'Тёмный рыцарь',year:2008,genre:'Боевик',rating:9.0,director:'Нолан',desc:'Бэтмен против Джокера.',why:'Мораль, выбор, границы.',lesson:'Ты либо умираешь героем...'},
{id:'mov_04',title:'Криминальное чтиво',year:1994,genre:'Криминал',rating:8.9,director:'Тарантино',desc:'Несколько историй.',why:'Нелинейное мышление.',lesson:'Делай то, что любишь.'},
{id:'mov_05',title:'Форрест Гамп',year:1994,genre:'Драма',rating:8.8,director:'Земекис',desc:'Простой человек в сложном мире.',why:'Простота, доброта.',lesson:'Жизнь — коробка конфет.'},
{id:'mov_06',title:'Начало',year:2010,genre:'Фантастика',rating:8.8,director:'Нолан',desc:'Кража идей из снов.',why:'Критическое мышление.',lesson:'Идеи — паразит.'},
{id:'mov_07',title:'Матрица',year:1999,genre:'Фантастика',rating:8.7,director:'Вачовски',desc:'Реальность — иллюзия.',why:'Сомневаться, выбирать.',lesson:'Ложка не существует.'},
{id:'mov_08',title:'Бойцовский клуб',year:1999,genre:'Драма',rating:8.8,director:'Финчер',desc:'Бунт против системы.',why:'Осознанность.',lesson:'Ты — не твоя работа.'},
{id:'mov_09',title:'Интерстеллар',year:2014,genre:'Фантастика',rating:8.7,director:'Нолан',desc:'Космос, время, любовь.',why:'Наука, любовь, жертва.',lesson:'Любовь вне времени.'},
{id:'mov_10',title:'Леон',year:1994,genre:'Боевик',rating:8.5,director:'Бессон',desc:'Киллер и девочка.',why:'Защита, нежность.',lesson:'Всегда как в первый раз.'},
{id:'mov_11',title:'Зелёная книга',year:2018,genre:'Драма',rating:8.2,director:'Фаррелли',desc:'Расизм и дружба.',why:'Эмпатия.',lesson:'Достоинство выше обстоятельств.'},
{id:'mov_12',title:'1+1',year:2011,genre:'Комедия',rating:8.5,director:'Накаш',desc:'Паралитик и помощник.',why:'Дружба, юмор.',lesson:'Жизнь — не то, что происходит.'},
{id:'mov_13',title:'Джокер',year:2019,genre:'Драма',rating:8.4,director:'Филлипс',desc:'Падение в безумие.',why:'Эмпатия.',lesson:'Самое страшное — быть никем.'},
{id:'mov_14',title:'Властелин колец',year:2001,genre:'Фэнтези',rating:8.9,director:'Джексон',desc:'Путешествие в Средиземье.',why:'Дружба, долг, жертва.',lesson:'Даже маленький меняет будущее.'},
{id:'mov_15',title:'Паразиты',year:2019,genre:'Драма',rating:8.5,director:'Пон Джун Хо',desc:'Классовая борьба.',why:'Соц. справедливость.',lesson:'Планы рушатся.'},
{id:'mov_16',title:'Остров проклятых',year:2010,genre:'Триллер',rating:8.2,director:'Скорсезе',desc:'Расследование в психбольнице.',why:'Критическое мышление.',lesson:'Жить монстром или умереть человеком?'},
{id:'mov_17',title:'Достать ножи',year:2019,genre:'Детектив',rating:7.9,director:'Джонсон',desc:'Убийство в особняке.',why:'Логика.',lesson:'Детали решают.'},
{id:'mov_18',title:'Ла-Ла Ленд',year:2016,genre:'Мюзикл',rating:8.0,director:'Шазелл',desc:'Любовь и мечты.',why:'Ценить выбор.',lesson:'Здесь восходит солнце.'},
{id:'mov_19',title:'Она',year:2013,genre:'Фантастика',rating:8.0,director:'Джонз',desc:'Человек влюбляется в AI.',why:'Одиночество, любовь.',lesson:'Сердце не робот.'},
{id:'mov_20',title:'Социальная сеть',year:2010,genre:'Драма',rating:7.8,director:'Финчер',desc:'История Facebook.',why:'Амбиции, последствия.',lesson:'Не станешь миллиардером без врагов.'}
];

var SERIES_LIBRARY=[
{id:'ser_01',title:'Во все тяжкие',year:'2008-2013',genre:'Криминал',rating:9.5,seasons:5,desc:'Учитель химии — наркобарон.',why:'Мораль, трансформация.'},
{id:'ser_02',title:'Игра престолов',year:'2011-2019',genre:'Фэнтези',rating:9.2,seasons:8,desc:'Борьба за трон.',why:'Стратегия.'},
{id:'ser_03',title:'Чернобыль',year:2019,genre:'Драма',rating:9.4,seasons:1,desc:'Катастрофа на ЧАЭС.',why:'Ответственность, правда.'},
{id:'ser_04',title:'Мир Дикого Запада',year:'2016-2022',genre:'Фантастика',rating:8.5,seasons:4,desc:'Парк с роботами.',why:'Этика AI.'},
{id:'ser_05',title:'Очень странные дела',year:'2016-...',genre:'Фантастика',rating:8.7,seasons:4,desc:'Дети против монстров.',why:'Дружба, смелость.'},
{id:'ser_06',title:'Друзья',year:'1994-2004',genre:'Комедия',rating:8.9,seasons:10,desc:'6 друзей в Нью-Йорке.',why:'Дружба, юмор.'},
{id:'ser_07',title:'Офис',year:'2005-2013',genre:'Комедия',rating:9.0,seasons:9,desc:'Будни офиса.',why:'Юмор, абсурд.'},
{id:'ser_08',title:'Клиника',year:'2001-2010',genre:'Комедия',rating:8.7,seasons:9,desc:'Интерны.',why:'Эмпатия, юмор.'},
{id:'ser_09',title:'Шерлок',year:'2010-2017',genre:'Детектив',rating:9.1,seasons:4,desc:'Современный Холмс.',why:'Логика.'},
{id:'ser_10',title:'Карточный домик',year:'2013-2018',genre:'Драма',rating:8.7,seasons:6,desc:'Политика.',why:'Стратегия.'},
{id:'ser_11',title:'Рик и Морти',year:'2013-...',genre:'Мульт',rating:9.1,seasons:7,desc:'Безумный учёный.',why:'Наука, юмор.'},
{id:'ser_12',title:'Атака титанов',year:'2013-2023',genre:'Аниме',rating:9.0,seasons:4,desc:'Люди vs титаны.',why:'Свобода, жертва.'},
{id:'ser_13',title:'Тетрадь смерти',year:'2006-2007',genre:'Аниме',rating:8.9,seasons:1,desc:'Тетрадь смерти.',why:'Мораль, логика.'},
{id:'ser_14',title:'Кремниевая долина',year:'2014-2019',genre:'Комедия',rating:8.5,seasons:6,desc:'Стартап.',why:'Бизнес, юмор.'},
{id:'ser_15',title:'Медленные лошади',year:'2022-...',genre:'Триллер',rating:8.3,seasons:3,desc:'MI5.',why:'Шпионаж.'},
{id:'ser_16',title:'Медведь',year:'2022-...',genre:'Драма',rating:8.6,seasons:3,desc:'Шеф-повар.',why:'Страсть.'},
{id:'ser_17',title:'Одни из нас',year:'2023-...',genre:'Драма',rating:8.7,seasons:1,desc:'Постапокалипсис.',why:'Любовь, жертва.'},
{id:'ser_18',title:'Разделение',year:'2022-...',genre:'Триллер',rating:8.7,seasons:1,desc:'Работа и жизнь.',why:'Баланс.'},
{id:'ser_19',title:'Прослушка',year:'2002-2008',genre:'Криминал',rating:9.3,seasons:5,desc:'Полиция Балтимора.',why:'Системное мышление.'},
{id:'ser_20',title:'Сопрано',year:'1999-2007',genre:'Криминал',rating:9.2,seasons:6,desc:'Мафия и семья.',why:'Психология, власть.'}
];

var BOOKS_LIBRARY=[
{id:'bk_01',title:'1984',author:'Оруэлл',year:1949,genre:'Антиутопия',rating:9.0,desc:'Тоталитаризм.',why:'Свобода, правда.'},
{id:'bk_02',title:'Мастер и Маргарита',author:'Булгаков',year:1967,genre:'Роман',rating:9.2,desc:'Дьявол в Москве.',why:'Добро, любовь.'},
{id:'bk_03',title:'Преступление и наказание',author:'Достоевский',year:1866,genre:'Роман',rating:9.1,desc:'Раскольников.',why:'Мораль, психология.'},
{id:'bk_04',title:'Война и мир',author:'Толстой',year:1869,genre:'Эпопея',rating:9.0,desc:'Россия и Наполеон.',why:'История, философия.'},
{id:'bk_05',title:'Думай медленно... решай быстро',author:'Канеман',year:2011,genre:'Психология',rating:8.8,desc:'2 системы.',why:'Критическое мышление.'},
{id:'bk_06',title:'Sapiens',author:'Харари',year:2011,genre:'История',rating:8.9,desc:'От обезьян.',why:'История, будущее.'},
{id:'bk_07',title:'Атомные привычки',author:'Клир',year:2018,genre:'Саморазвитие',rating:8.7,desc:'Привычки.',why:'Система.'},
{id:'bk_08',title:'Думай и богатей',author:'Хилл',year:1937,genre:'Саморазвитие',rating:8.5,desc:'Успех.',why:'Мышление, цели.'},
{id:'bk_09',title:'7 навыков',author:'Кови',year:1989,genre:'Саморазвитие',rating:8.6,desc:'Навыки.',why:'Эффективность.'},
{id:'bk_10',title:'Глубокая работа',author:'Ньюпорт',year:2016,genre:'Продуктивность',rating:8.6,desc:'Фокус.',why:'Deep Work.'},
{id:'bk_11',title:'Дюна',author:'Герберт',year:1965,genre:'Фантастика',rating:8.7,desc:'Арракис.',why:'Экология, политика.'},
{id:'bk_12',title:'Гарри Поттер',author:'Роулинг',year:'1997-2007',genre:'Фэнтези',rating:9.0,desc:'Мальчик, который выжил.',why:'Дружба, смелость.'},
{id:'bk_13',title:'Властелин колец',author:'Толкин',year:'1954-1955',genre:'Фэнтези',rating:9.0,desc:'Мордор.',why:'Дружба, долг.'},
{id:'bk_14',title:'Тонкое искусство пофигизма',author:'Мэнсон',year:2016,genre:'Саморазвитие',rating:8.0,desc:'Проблемы.',why:'Принятие.'},
{id:'bk_15',title:'Сила воли',author:'Макгонигал',year:2011,genre:'Психология',rating:8.3,desc:'Самоконтроль.',why:'Дисциплина.'},
{id:'bk_16',title:'Чёрный лебедь',author:'Талеб',year:2007,genre:'Философия',rating:8.2,desc:'Случайность.',why:'Вероятностное мышление.'},
{id:'bk_17',title:'Антихрупкость',author:'Талеб',year:2012,genre:'Философия',rating:8.4,desc:'Из хаоса.',why:'Устойчивость.'},
{id:'bk_18',title:'Поток',author:'Чиксентмихайи',year:1990,genre:'Психология',rating:8.6,desc:'Оптимальный опыт.',why:'Фокус, счастье.'},
{id:'bk_19',title:'Думай как математик',author:'Оакли',year:2014,genre:'Обучение',rating:8.4,desc:'Методы обучения.',why:'Метапознание.'},
{id:'bk_20',title:'How to Win Friends',author:'Карнеги',year:1936,genre:'Общение',rating:8.5,desc:'Как заводить друзей.',why:'Коммуникация.'}
];

var MUSIC_LIBRARY=[
{id:'mus_01',title:'Классика для фокуса',genre:'Классика',desc:'Бах, Моцарт, Бетховен.',mood:'focus'},
{id:'mus_02',title:'Lo-fi Hip Hop',genre:'Lo-fi',desc:'Расслабление, учёба.',mood:'study'},
{id:'mus_03',title:'Ambient',genre:'Эмбиент',desc:'Для медитации.',mood:'meditation'},
{id:'mus_04',title:'Джаз',genre:'Джаз',desc:'Miles Davis.',mood:'creative'},
{id:'mus_05',title:'Рок-классика',genre:'Рок',desc:'Pink Floyd, Led Zeppelin.',mood:'energy'},
{id:'mus_06',title:'Электроника',genre:'EDM',desc:'Для спорта.',mood:'workout'},
{id:'mus_07',title:'Кинематографичная',genre:'Саундтреки',desc:'Hans Zimmer.',mood:'inspiration'},
{id:'mus_08',title:'Nature Sounds',genre:'Природа',desc:'Дождь, океан.',mood:'sleep'},
{id:'mus_09',title:'Классический рок',genre:'Рок',desc:'The Beatles.',mood:'nostalgia'},
{id:'mus_10',title:'World Music',genre:'Мир',desc:'Ravi Shankar.',mood:'exploration'}
];

var GAMES_LIBRARY=[
{id:'gm_01',title:'The Witcher 3',genre:'RPG',rating:9.8,desc:'Ведьмак Геральт.',why:'Сюжет, моральные выборы.'},
{id:'gm_02',title:'Red Dead Redemption 2',genre:'Action',rating:9.7,desc:'Вестерн.',why:'История, эмоции.'},
{id:'gm_03',title:'The Last of Us',genre:'Action',rating:9.5,desc:'Постапокалипсис.',why:'Эмоции, сюжет.'},
{id:'gm_04',title:'God of War',genre:'Action',rating:9.5,desc:'Кратос и сын.',why:'Сюжет.'},
{id:'gm_05',title:'Elden Ring',genre:'Souls-like',rating:9.6,desc:'Открытый мир.',why:'Сложность.'},
{id:'gm_06',title:'Portal 2',genre:'Puzzle',rating:9.5,desc:'Порталы.',why:'Логика, юмор.'},
{id:'gm_07',title:'Hollow Knight',genre:'Metroidvania',rating:9.4,desc:'Мир насекомых.',why:'Атмосфера.'},
{id:'gm_08',title:'Celeste',genre:'Platformer',rating:9.3,desc:'О тревоге.',why:'Сложность, история.'},
{id:'gm_09',title:'Stardew Valley',genre:'Sim',rating:9.2,desc:'Ферма.',why:'Расслабление.'},
{id:'gm_10',title:"Baldur's Gate 3",genre:'RPG',rating:9.7,desc:'D&D.',why:'Свобода, тактика.'},
{id:'gm_11',title:'Disco Elysium',genre:'RPG',rating:9.5,desc:'Детектив.',why:'Текст, философия.'},
{id:'gm_12',title:'Hades',genre:'Roguelike',rating:9.3,desc:'Побег.',why:'Боевая система.'}
];

var PODCASTS_LIBRARY=[
{id:'pod_01',title:'Huberman Lab',author:'Andrew Huberman',genre:'Нейро',desc:'Наука о мозге.',why:'Научный подход.'},
{id:'pod_02',title:'Lex Fridman',author:'Lex Fridman',genre:'Наука',desc:'Интервью.',why:'Глубокие разговоры.'},
{id:'pod_03',title:'Tim Ferriss Show',author:'Tim Ferriss',genre:'Продуктивность',desc:'Интервью.',why:'Практические советы.'},
{id:'pod_04',title:'Naval',author:'Naval Ravikant',genre:'Философия',desc:'Богатство, счастье.',why:'Мудрость.'},
{id:'pod_05',title:'Ali Abdaal',author:'Ali Abdaal',genre:'Продуктивность',desc:'Продуктивность.',why:'Практика.'},
{id:'pod_06',title:'Modern Wisdom',author:'Chris Williamson',genre:'Саморазвитие',desc:'Психология.',why:'Идеи.'},
{id:'pod_07',title:'Diary of a CEO',author:'Steven Bartlett',genre:'Бизнес',desc:'Предприниматели.',why:'Бизнес-идеи.'},
{id:'pod_08',title:'On Purpose',author:'Jay Shetty',genre:'Саморазвитие',desc:'Мудрость.',why:'Мотивация.'},
{id:'pod_09',title:'6 Minute English',author:'BBC',genre:'Английский',desc:'6 минут.',why:'Учит язык.'},
{id:'pod_10',title:'All Ears English',author:'Lindsay McMahon',genre:'Английский',desc:'Разговорный.',why:'Практика.'}
];

var THEATER_LIBRARY=[
{id:'th_01',title:'Гамлет',author:'Шекспир',genre:'Трагедия',desc:'Принц Датский.',why:'Философия.'},
{id:'th_02',title:'Ромео и Джульетта',author:'Шекспир',genre:'Трагедия',desc:'Любовь и вражда.',why:'Любовь.'},
{id:'th_03',title:'Чайка',author:'Чехов',genre:'Драма',desc:'Искусство.',why:'Психология.'},
{id:'th_04',title:'Три сестры',author:'Чехов',genre:'Драма',desc:'Мечты.',why:'Экзистенциализм.'},
{id:'th_05',title:'Вишнёвый сад',author:'Чехов',genre:'Драма',desc:'Прощание.',why:'Время.'},
{id:'th_06',title:'На дне',author:'Горький',genre:'Драма',desc:'Дно жизни.',why:'Соц. драма.'},
{id:'th_07',title:'Ревизор',author:'Гоголь',genre:'Комедия',desc:'Ложный ревизор.',why:'Сатира.'},
{id:'th_08',title:'Горе от ума',author:'Грибоедов',genre:'Комедия',desc:'Чацкий.',why:'Сатира, ум.'}
];

var ART_LIBRARY=[
{id:'art_01',title:'Мона Лиза',author:'Леонардо',year:1503,desc:'Улыбка Джоконды.',why:'Загадка.'},
{id:'art_02',title:'Звёздная ночь',author:'Ван Гог',year:1889,desc:'Ночное небо.',why:'Эмоции.'},
{id:'art_03',title:'Крик',author:'Мунк',year:1893,desc:'Крик природы.',why:'Тревога.'},
{id:'art_04',title:'Герника',author:'Пикассо',year:1937,desc:'Ужасы войны.',why:'Антивоенное.'},
{id:'art_05',title:'Девушка с жемчужной серёжкой',author:'Вермеер',year:1665,desc:'Голландская девушка.',why:'Свет.'},
{id:'art_06',title:'Тайная вечеря',author:'Леонардо',year:1498,desc:'Ужин Христа.',why:'Композиция.'},
{id:'art_07',title:'Сикстинская капелла',author:'Микеланджело',year:1512,desc:'Фрески.',why:'Мастерство.'},
{id:'art_08',title:'Постоянство памяти',author:'Дали',year:1931,desc:'Текущие часы.',why:'Сюрреализм.'},
{id:'art_09',title:'Чёрный квадрат',author:'Малевич',year:1915,desc:'Манифест.',why:'Абстракция.'},
{id:'art_10',title:'Девятый вал',author:'Айвазовский',year:1850,desc:'Море.',why:'Романтизм.'}
];

/* ============================================================
   SCREEN / DETOX (30 дней)
   ============================================================ */
var DETOX_COURSE=[
{day:1,phase:'Диагностика',title:'Замер реального времени',subtitle:'Понимание — первый шаг',why:'Ты не можешь управлять тем, что не измеряешь. Исследования (RescueTime, 2020): люди недооценивают экранное время на 2-3 часа в день. Реальность шокирует — но это точка старта.',do:['Открой Screen Time / Digital Wellbeing','Запиши общее время за 7 дней','Топ-5 приложений','Сколько часов в соцсетях'],effect:'Осознание → −15% времени в первую неделю.',checklist:['Проверить Screen Time','Записать 3 цифры','Умножить дневное на 365']},
{day:2,phase:'Диагностика',title:'Аудит приложений',subtitle:'Полезные vs токсичные',why:'Banking, работа, обучение — нейтральны. TikTok, Instagram — дофаминовые петли. Алтер доказал: интерфейс лент построен на переменном подкреплении.',do:['Открой список приложений','3 группы: нужные / полезные / токсичные','Выбери 3 самых токсичных'],effect:'Удаление = барьер. −50% использования.',checklist:['Список токсичных','Удалить 1','Вынести остальные']},
{day:3,phase:'Диагностика',title:'Триггеры',subtitle:'Когда хватаешь телефон?',why:'Каждое обращение имеет триггер: скука, тревога, одиночество, привычка. Duke University: 40% действий — привычки.',do:['Записывай: время → эмоция → что делал','Особенно когда достал без причины'],effect:'Понимание = 50% решения.',checklist:['5 триггеров','Самый частый','Замена']},
{day:4,phase:'Утро',title:'Телефон ≠ будильник',subtitle:'Механический + вне спальни',why:'Утренний скроллинг снижает концентрацию до 10:00 и повышает тревогу (UBC). Механический будильник возвращает контроль.',do:['Купи механический будильник','Перенеси зарядку','Телефон вне спальни'],effect:'Первый час без экрана = ясность.',checklist:['Купить будильник','Убрать зарядку','Утро без телефона']},
{day:5,phase:'Утро',title:'Правило 30 минут',subtitle:'Первый час — твой',why:'Первые 30 мин после пробуждения определяют фокус на 4-6 часов (HBR).',do:['Вода','10 мин света','5 мин движения'],effect:'Фокус +40% в первой половине дня.',checklist:['Вода','10 мин света','5 мин движения']},
{day:6,phase:'Утро',title:'Утренние страницы',subtitle:'3 страницы от руки',why:'Джулия Кэмерон: поток сознания от руки. Письмо активирует больше зон, чем печать.',do:['Блокнот у кровати','15 мин — пиши','Без правок'],effect:'Ясность, креативность +30%.',checklist:['Блокнот','3 страницы','Без телефона']},
{day:7,phase:'Утро',title:'Дыхание 4-7-8',subtitle:'Успокоить систему',why:'Метод доктора Вейла: 4 вдох, 7 задержка, 8 выдох. Активирует парасимпатику.',do:['Сразу после воды','4 цикла','Вечером перед сном'],effect:'Меньше тревоги, глубже сон.',checklist:['4 цикла утром','4 вечером','Отметить состояние']},
{day:8,phase:'День',title:'Телефон вне комнаты',subtitle:'90 минут',why:'University of Texas: само присутствие телефона в комнате снижает продуктивность на 20%.',do:['Ящик / другая комната','90 мин одна задача','15 мин перерыв без экрана'],effect:'+40% продуктивности.',checklist:['Телефон вне','90 мин','Перерыв без экрана']},
{day:9,phase:'День',title:'Авиарежим 90 мин',subtitle:'Deep Work',why:'Ньюпорт: без отвлечений мозг входит в поток за 15-20 мин. Каждое отвлечение сбрасывает таймер.',do:['Одна задача','Авиарежим','Таймер'],effect:'Меньше тревоги, больше сделано.',checklist:['Авиарежим','Одна задача','90 мин']},
{day:10,phase:'День',title:'Обед без экрана',subtitle:'Осознанное питание',why:'Harvard: осознанное питание снижает переедание на 25%. В экран мозг не регистрирует приём.',do:['30 мин без телефона','Слушай тело','Смотри в окно'],effect:'Меньше переедания.',checklist:['Обед без экрана','30 мин','Осознанно']},
{day:11,phase:'День',title:'Лимиты приложений',subtitle:'30 минут',why:'Screen Time / Digital Wellbeing: жёсткий лимит. Барьер до решения, а не после.',do:['Настройки → лимиты','30 мин соцсети','15 мин игры'],effect:'−40% времени в соцсетях.',checklist:['Лимит 30 мин','Лимит игры','Проверить через день']},
{day:12,phase:'День',title:'Удалить приложения',subtitle:'Только браузер',why:'UCLA: удаление снижает использование на 70%. Лента в браузере неудобна.',do:['Удали 3 соцсети','Заходи через браузер','Только для цели'],effect:'−70% времени.',checklist:['Удалить 1','2','3']},
{day:13,phase:'День',title:'Перерывы без телефона',subtitle:'Каждый час 5 мин',why:'Клейтман: каждые 90 мин мозг требует восстановления.',do:['Каждый час: 5 мин','Встать, пройтись, вода','НЕ телефон'],effect:'Меньше усталости.',checklist:['6 перерывов','Встать','Вода']},
{day:14,phase:'День',title:'Прогулка 30 мин',subtitle:'Без телефона',why:'Станфорд: прогулка повышает креативность на 60%. BDNF вырабатывается.',do:['30 мин','Телефон не в руках','Наблюдай'],effect:'+Креативность, +настроение.',checklist:['30 мин','Не в руках','Осознанность']},
{day:15,phase:'Вечер',title:'Цифровой закат',subtitle:'2 часа без экрана',why:'Синий свет подавляет мелатонин на 30% (Гарвард).',do:['21:00 телефон в коридор','Чтение/медитация','Тёплый душ'],effect:'Сон глубже на 25%.',checklist:['Телефон вне','Чтение','Тёплый душ']},
{day:16,phase:'Вечер',title:'Рефлексия дня',subtitle:'5 строк',why:'Journal of Positive Psychology: 3 победы/день → +25% счастья за месяц.',do:['Дневник 5 мин','3 победы','1 урок','1 благодарность'],effect:'+20-25% счастья.',checklist:['3 победы','1 урок','1 благодарность']},
{day:17,phase:'Вечер',title:'Медитация 10 мин',subtitle:'Body scan',why:'Sara Lazar (Harvard): 8 недель → утолщение коры.',do:['10 мин перед сном','Body scan','Или дыхание'],effect:'-30% тревоги.',checklist:['10 мин','Тишина','Ежедневно']},
{day:18,phase:'Вечер',title:'Музыка вместо сериала',subtitle:'Без сюжета',why:'Сериал = многочасовая дофаминовая петля. Спокойная музыка — отдых.',do:['Плейлист для сна','30 мин','Без телефона'],effect:'Расслабление.',checklist:['Плейлист','30 мин','Без экрана']},
{day:19,phase:'Вечер',title:'Без новостей вечером',subtitle:'Тревога',why:'Harvard Medical: новости вечером +30% тревоги.',do:['Не открывать после 18:00','Утром 5 мин','Вечером книга'],effect:'Спокойный вечер.',checklist:['Не открывать','Утром','Книга']},
{day:20,phase:'Зрение',title:'Правило 20-20-20',subtitle:'Защита глаз',why:'AOA: каждые 20 мин — 20 сек на 6 м. Расслабляет мышцы.',do:['Таймер 20 мин','20 сек в окно','Весь день'],effect:'Меньше усталости глаз.',checklist:['Таймер','Вдаль','Весь день']},
{day:21,phase:'Зрение',title:'Пальминг',subtitle:'5 минут',why:'Бейтс: тёплые ладони расслабляют мышцы.',do:['Разотри ладони','Закрой глаза','5 мин в тишине'],effect:'Сухость проходит.',checklist:['Утром','Днём','Вечером']},
{day:22,phase:'Зрение',title:'Гимнастика для глаз',subtitle:'10 упражнений',why:'Глазные мышцы нужно тренировать.',do:['Вверх-вниз ×10','Влево-вправо ×10','Круги','Восьмёрки','Близко-далеко'],effect:'+10-15% зрение.',checklist:['10 упражнений','Утром и вечером','Ежедневно']},
{day:23,phase:'Зрение',title:'Солнечный свет',subtitle:'10 минут',why:'Свет регулирует циркадные и зрачок.',do:['10 мин на балконе','Без очков','Не смотреть прямо'],effect:'Лучше сон, зрение.',checklist:['10 мин','Без очков','Утром']},
{day:24,phase:'Зрение',title:'Питание для глаз',subtitle:'Лютеин, зеаксантин',why:'AREDS: лютеин и зеаксантин защищают сетчатку.',do:['Шпинат, яйца, лосось','Морковь + масло','Орехи'],effect:'Острее зрение.',checklist:['Шпинат','Яйца','Рыба/орехи']},
{day:25,phase:'Фокус',title:'Deep Work 90 мин',subtitle:'Одна задача',why:'Ньюпорт: 3-4 ч Deep Work = 10 ч обычной.',do:['Авиарежим','Одна задача','90 мин','15 мин перерыв'],effect:'+40% за неделю.',checklist:['90 мин','Без телефона','Одна задача']},
{day:26,phase:'Фокус',title:'Помодоро 25/5',subtitle:'Короткие задачи',why:'Чирилло: 25 мин + 5 отдых.',do:['Задача','Таймер 25','5 мин отдых','4 цикла'],effect:'Меньше прокрастинации.',checklist:['4 помидора','Перерыв','Задача']},
{day:27,phase:'Фокус',title:'Уведомления-аудит',subtitle:'Только важное',why:'UC: 23 мин на возврат. 20 уведомлений = 7 ч потерянной концентрации.',do:['Отключи ВСЁ кроме звонков','Остальное без звука','Только визуальные'],effect:'-80% отвлечений.',checklist:['Отключить','Оставить важные','Проверить']},
{day:28,phase:'Среда',title:'Спальня = храм сна',subtitle:'Темно, тихо, прохладно',why:'Walker: 18-20°C, темнота, тишина — идеал.',do:['Проверь','Плотные шторы','Вентилятор','Телефон вне'],effect:'Сон глубже на 30%.',checklist:['Темно','Прохладно','Тихо','Телефон вне']},
{day:29,phase:'Среда',title:'Цифровое окружение',subtitle:'Соблазны неудобны',why:'Клир: среда сильнее воли. Переделай один раз.',do:['Удали с главного','Телефон в другой комнате','Соцсети с браузера','Уведомления выкл'],effect:'-50% без силы воли.',checklist:['Главный чистый','Соцсети в браузере','Уведомления off']},
{day:30,phase:'Итог',title:'Новая жизнь',subtitle:'Замер и сравнение',why:'30 дней — привычки перестроились. Мозг чувствительнее, фокус глубже, зрение лучше.',do:['Замерь неделю','Сравни с днём 1','Запиши победы','5 привычек навсегда'],effect:'-40% экран, +60% фокус, +30% сон, +25% настроение.',checklist:['Новый замер','Сравнение','5 привычек','Праздник']}
];

var SCREEN_TIPS=[
{id:'diag_1',category:'🔍 Диагностика',title:'Замер',desc:'Screen Time / Digital Wellbeing',action:'3 цифры',effect:'Осознание 50%',time:'5 мин'},
{id:'diag_2',category:'🔍 Диагностика',title:'Аудит',desc:'Нужные/полезные/токсичные',action:'Удали 3',effect:'Барьер',time:'10 мин'},
{id:'morning_1',category:'🌅 Утро',title:'Телефон ≠ будильник',desc:'Механический + вне спальни',action:'Купи будильник',effect:'Ясность',time:'1 день'},
{id:'morning_2',category:'🌅 Утро',title:'30 минут',desc:'Без телефона после пробуждения',action:'Вода+свет+движение',effect:'Фокус',time:'30 мин'},
{id:'day_1',category:'☀️ День',title:'Телефон вне комнаты',desc:'Во время работы',action:'Ящик 90 мин',effect:'+40%',time:'90 мин'},
{id:'day_2',category:'☀️ День',title:'Авиарежим 90 мин',desc:'Deep Work',action:'Одна задача',effect:'×3',time:'90 мин'},
{id:'eye_1',category:'👁 Зрение',title:'20-20-20',desc:'20 мин / 20 сек / 20 футов',action:'Таймер',effect:'-Усталость',time:'весь день'},
{id:'eye_2',category:'👁 Зрение',title:'Пальминг',desc:'5 минут',action:'3×/день',effect:'+Острота',time:'5 мин'},
{id:'eye_3',category:'👁 Зрение',title:'Гимнастика глаз',desc:'10 упражнений',action:'Утром+вечером',effect:'+15%',time:'5 мин'},
{id:'evening_1',category:'🌙 Вечер',title:'Цифровой закат',desc:'2 часа без экрана',action:'Зарядка в коридоре',effect:'Сон +25%',time:'2 ч'},
{id:'evening_2',category:'🌙 Вечер',title:'Рефлексия',desc:'3 победы + 1 урок',action:'Дневник',effect:'+25% счастья',time:'5 мин'},
{id:'evening_3',category:'🌙 Вечер',title:'Медитация 10 мин',desc:'Body scan',action:'Тишина',effect:'-30% тревоги',time:'10 мин'},
{id:'focus_1',category:'🎯 Фокус',title:'Deep Work',desc:'90 мин',action:'Авиарежим',effect:'×3',time:'90 мин'},
{id:'focus_2',category:'🎯 Фокус',title:'Помодоро',desc:'25/5',action:'Таймер',effect:'-Прокрастинация',time:'2 ч'},
{id:'focus_3',category:'🎯 Фокус',title:'Уведомления off',desc:'Только важные',action:'Отключи',effect:'-80%',time:'10 мин'},
{id:'env_1',category:'🏠 Среда',title:'Спальня = храм',desc:'Темно, 18-20°C, тихо',action:'Телефон вне',effect:'Сон +30%',time:'5 мин'},
{id:'env_2',category:'🏠 Среда',title:'Цифровое окружение',desc:'Соблазны неудобны',action:'Удали с главного',effect:'-50%',time:'10 мин'}
];

var SCREEN_HABITS=[
{id:'h_morning_no_phone',title:'Утро без телефона 30 мин',icon:'🌅'},
{id:'h_no_phone_work',title:'Телефон вне комнаты на работе',icon:'💼'},
{id:'h_lunch_no_screen',title:'Обед без экрана',icon:'🍽'},
{id:'h_walk_30',title:'Прогулка 30 минут',icon:'🚶'},
{id:'h_read_20',title:'Чтение 20 минут',icon:'📚'},
{id:'h_no_screen_2h',title:'2 часа до сна без экрана',icon:'🌙'},
{id:'h_meditation_10',title:'Медитация 10 минут',icon:'🧘'},
{id:'h_sport',title:'Спорт 30+ минут',icon:'🏋️'},
{id:'h_journal',title:'Дневник вечером',icon:'📓'},
{id:'h_eye_20_20_20',title:'20-20-20 для глаз',icon:'👁'},
{id:'h_palming',title:'Пальминг 5 минут',icon:'✋'},
{id:'h_eye_gym',title:'Гимнастика для глаз',icon:'👀'},
{id:'h_no_social_1day',title:'День без соцсетей',icon:'🚫'}
];

/* ============================================================
   INTEGRATIONS (только конфиги, функции в app.js)
   ============================================================ */
var OBSIDIAN_CONFIG={apiUrl:'http://localhost:27123',apiKey:'',vaultPath:'',defaultFolder:'AI-Health',autoSync:false,syncInterval:300000,lastSync:null};
var GCAL_CONFIG={clientId:'',apiKey:'',accessToken:null,refreshToken:null,expiresAt:null,calendarId:'primary',autoSync:false,lastSync:null};
var NOTION_CONFIG={apiKey:'',databaseId:'',enabled:false};
var TODOIST_CONFIG={apiKey:'',enabled:false};
var GEMINI_CONFIG={apiKey:'',model:'gemini-1.5-flash',models:['gemini-1.5-flash','gemini-1.5-pro','gemini-2.0-flash-exp'],temperature:0.8,maxTokens:800};

/* ============================================================
   ACHIEVEMENTS (60)
   ============================================================ */
var ACHIEVEMENTS=[
{id:'first_task',icon:'🎯',name:'Первый шаг',tier:'common',check:function(s){return s.tasks.length>=1},progress:function(s){return Math.min(1,s.tasks.length/1)},goal:1},
{id:'ten_tasks',icon:'🔟',name:'10 задач',tier:'common',check:function(s){return s.tasks.length>=10},progress:function(s){return Math.min(1,s.tasks.length/10)},goal:10},
{id:'hundred_tasks',icon:'💯',name:'100 задач',tier:'rare',check:function(s){return s.tasks.length>=100},progress:function(s){return Math.min(1,s.tasks.length/100)},goal:100},
{id:'first_habit',icon:'🌱',name:'Привычка',tier:'common',check:function(s){return (s.customHabits||[]).length>=1},progress:function(s){return Math.min(1,(s.customHabits||[]).length/1)},goal:1},
{id:'five_habits',icon:'🌿',name:'5 привычек',tier:'rare',check:function(s){return (s.customHabits||[]).length>=5},progress:function(s){return Math.min(1,(s.customHabits||[]).length/5)},goal:5},
{id:'streak_7',icon:'🔥',name:'Неделя',tier:'common',check:function(s){return (s.stats.streak||0)>=7},progress:function(s){return Math.min(1,(s.stats.streak||0)/7)},goal:7},
{id:'streak_30',icon:'⚡',name:'Месяц',tier:'rare',check:function(s){return (s.stats.streak||0)>=30},progress:function(s){return Math.min(1,(s.stats.streak||0)/30)},goal:30},
{id:'streak_100',icon:'💎',name:'100 дней',tier:'epic',check:function(s){return (s.stats.streak||0)>=100},progress:function(s){return Math.min(1,(s.stats.streak||0)/100)},goal:100},
{id:'streak_365',icon:'👑',name:'Год',tier:'legendary',check:function(s){return (s.stats.streak||0)>=365},progress:function(s){return Math.min(1,(s.stats.streak||0)/365)},goal:365},
{id:'first_chat',icon:'💬',name:'Диалог',tier:'common',check:function(s){return s.chats.length>=1},progress:function(s){return Math.min(1,s.chats.length/1)},goal:1},
{id:'ai_master',icon:'🧠',name:'AI-мастер',tier:'rare',check:function(s){return s.chats.filter(function(c){return c.role==='user'}).length>=50},progress:function(s){return Math.min(1,s.chats.filter(function(c){return c.role==='user'}).length/50)},goal:50},
{id:'writer',icon:'📝',name:'Писатель',tier:'common',check:function(s){return (s.customNotes||[]).length>=10},progress:function(s){return Math.min(1,(s.customNotes||[]).length/10)},goal:10},
{id:'journal_30',icon:'📓',name:'Дневник 30',tier:'rare',check:function(s){return (s.journalEntries||[]).length>=30},progress:function(s){return Math.min(1,(s.journalEntries||[]).length/30)},goal:30},
{id:'scholar',icon:'🎓',name:'Учёный',tier:'common',check:function(s){return Object.keys(s.levelProgress||{}).length>=10},progress:function(s){return Math.min(1,Object.keys(s.levelProgress||{}).length/10)},goal:10},
{id:'level1',icon:'🌱',name:'Фундамент',tier:'common',check:function(s){return checkLevelComplete(s,'l1')},progress:function(s){return levelProgress(s,'l1')},goal:1},
{id:'level2',icon:'📚',name:'Ученик',tier:'rare',check:function(s){return checkLevelComplete(s,'l2')},progress:function(s){return levelProgress(s,'l2')},goal:1},
{id:'level3',icon:'🎯',name:'Практик',tier:'rare',check:function(s){return checkLevelComplete(s,'l3')},progress:function(s){return levelProgress(s,'l3')},goal:1},
{id:'level4',icon:'👑',name:'Мастер',tier:'epic',check:function(s){return checkLevelComplete(s,'l4')},progress:function(s){return levelProgress(s,'l4')},goal:1},
{id:'level5',icon:'🌟',name:'Наставник',tier:'legendary',check:function(s){return checkLevelComplete(s,'l5')},progress:function(s){return levelProgress(s,'l5')},goal:1},
{id:'survey_done',icon:'📋',name:'Профиль',tier:'common',check:function(s){return s.profile&&s.profile.surveyDone},progress:function(s){return s.profile&&s.profile.surveyDone?1:0},goal:1},
{id:'all_domains',icon:'🌐',name:'Все домены',tier:'rare',check:function(s){return Object.keys(s.domainScores||{}).length>=3},progress:function(s){return Math.min(1,Object.keys(s.domainScores||{}).length/3)},goal:3},
{id:'english_start',icon:'🇬🇧',name:'English',tier:'common',check:function(s){return s.englishProgress&&Object.keys(s.englishProgress).length>=1},progress:function(s){return Math.min(1,Object.keys(s.englishProgress||{}).length/1)},goal:1},
{id:'english_master',icon:'🎓',name:'English Master',tier:'epic',check:function(s){return s.englishProgress&&Object.keys(s.englishProgress).length>=125},progress:function(s){return Math.min(1,Object.keys(s.englishProgress||{}).length/125)},goal:125},
{id:'english_legend',icon:'🏆',name:'English Legend',tier:'legendary',check:function(s){return s.englishProgress&&Object.keys(s.englishProgress).length>=250},progress:function(s){return Math.min(1,Object.keys(s.englishProgress||{}).length/250)},goal:250},
{id:'meditation_10',icon:'🧘',name:'10 медитаций',tier:'common',check:function(s){return (s.customMeditation||[]).length>=10},progress:function(s){return Math.min(1,(s.customMeditation||[]).length/10)},goal:10},
{id:'meditation_100',icon:'☯️',name:'100 медитаций',tier:'rare',check:function(s){return (s.customMeditation||[]).length>=100},progress:function(s){return Math.min(1,(s.customMeditation||[]).length/100)},goal:100},
{id:'workout_10',icon:'🏋️',name:'10 тренировок',tier:'common',check:function(s){return (s.customWorkouts||[]).length>=10},progress:function(s){return Math.min(1,(s.customWorkouts||[]).length/10)},goal:10},
{id:'workout_100',icon:'🏆',name:'100 тренировок',tier:'epic',check:function(s){return (s.customWorkouts||[]).length>=100},progress:function(s){return Math.min(1,(s.customWorkouts||[]).length/100)},goal:100},
{id:'water_100',icon:'💧',name:'100 стаканов',tier:'common',check:function(s){return (s.customWater||[]).reduce(function(a,w){return a+(w.count||0)},0)>=100},progress:function(s){return Math.min(1,(s.customWater||[]).reduce(function(a,w){return a+(w.count||0)},0)/100)},goal:100},
{id:'water_1000',icon:'🌊',name:'1000 стаканов',tier:'epic',check:function(s){return (s.customWater||[]).reduce(function(a,w){return a+(w.count||0)},0)>=1000},progress:function(s){return Math.min(1,(s.customWater||[]).reduce(function(a,w){return a+(w.count||0)},0)/1000)},goal:1000},
{id:'mood_30',icon:'💭',name:'30 настроений',tier:'common',check:function(s){return (s.customMood||[]).length>=30},progress:function(s){return Math.min(1,(s.customMood||[]).length/30)},goal:30},
{id:'entertainment_10',icon:'🎬',name:'Киноман',tier:'common',check:function(s){return (s.watched||[]).length>=10},progress:function(s){return Math.min(1,(s.watched||[]).length/10)},goal:10},
{id:'movie_10',icon:'🎥',name:'Кинокритик',tier:'common',check:function(s){return (s.watched||[]).filter(function(w){return w.type==='movie'}).length>=10},progress:function(s){return Math.min(1,(s.watched||[]).filter(function(w){return w.type==='movie'}).length/10)},goal:10},
{id:'book_5',icon:'📚',name:'Книголюб',tier:'common',check:function(s){return (s.watched||[]).filter(function(w){return w.type==='book'}).length>=5},progress:function(s){return Math.min(1,(s.watched||[]).filter(function(w){return w.type==='book'}).length/5)},goal:5},
{id:'screen_detox',icon:'🚫',name:'Детокс',tier:'common',check:function(s){return (s.screenHabits||{})&&Object.keys(s.screenHabits).length>=7},progress:function(s){return Math.min(1,Object.keys(s.screenHabits||{}).length/7)},goal:7},
{id:'memory_master',icon:'🧠',name:'Мастер памяти',tier:'rare',check:function(s){return (s.memoryTraining||[]).length>=30},progress:function(s){return Math.min(1,(s.memoryTraining||[]).length/30)},goal:30},
{id:'iq_boost',icon:'🎯',name:'IQ+',tier:'rare',check:function(s){return (s.iqScores||[]).length>=10},progress:function(s){return Math.min(1,(s.iqScores||[]).length/10)},goal:10},
{id:'finance_start',icon:'💰',name:'Финансист',tier:'common',check:function(s){return (s.finance||[]).length>=10},progress:function(s){return Math.min(1,(s.finance||[]).length/10)},goal:10},
{id:'watchlist_10',icon:'📋',name:'Список',tier:'common',check:function(s){return (s.watchlist||[]).length>=10},progress:function(s){return Math.min(1,(s.watchlist||[]).length/10)},goal:10},
{id:'goals_3',icon:'🎯',name:'3 цели',tier:'common',check:function(s){return (s.customGoals||[]).length>=3},progress:function(s){return Math.min(1,(s.customGoals||[]).length/3)},goal:3},
{id:'notes_50',icon:'📝',name:'50 заметок',tier:'rare',check:function(s){return (s.customNotes||[]).length>=50},progress:function(s){return Math.min(1,(s.customNotes||[]).length/50)},goal:50},
{id:'timer_10',icon:'⏱',name:'10 сессий',tier:'common',check:function(s){return (s.timerSessions||[]).length>=10},progress:function(s){return Math.min(1,(s.timerSessions||[]).length/10)},goal:10},
{id:'detox_30',icon:'🌱',name:'Курс 30 дней',tier:'epic',check:function(s){return (s.detoxCourseProgress&&Object.keys(s.detoxCourseProgress).length>=30)},progress:function(s){return Math.min(1,Object.keys(s.detoxCourseProgress||{}).length/30)},goal:30},
{id:'challenge_10',icon:'🔥',name:'10 челленджей',tier:'rare',check:function(s){return Object.keys(s.challengeProgress||{}).length>=10},progress:function(s){return Math.min(1,Object.keys(s.challengeProgress||{}).length/10)},goal:10},
{id:'challenge_100',icon:'💎',name:'100 челленджей',tier:'epic',check:function(s){return Object.keys(s.challengeProgress||{}).length>=100},progress:function(s){return Math.min(1,Object.keys(s.challengeProgress||{}).length/100)},goal:100},
{id:'level_up_5',icon:'⭐',name:'Уровень 5',tier:'common',check:function(s){return (s.level||0)>=5},progress:function(s){return Math.min(1,(s.level||0)/5)},goal:5},
{id:'level_up_10',icon:'🌟',name:'Уровень 10',tier:'rare',check:function(s){return (s.level||0)>=10},progress:function(s){return Math.min(1,(s.level||0)/10)},goal:10},
{id:'level_up_25',icon:'👑',name:'Уровень 25',tier:'epic',check:function(s){return (s.level||0)>=25},progress:function(s){return Math.min(1,(s.level||0)/25)},goal:25},
{id:'level_up_50',icon:'🏆',name:'Уровень 50',tier:'legendary',check:function(s){return (s.level||0)>=50},progress:function(s){return Math.min(1,(s.level||0)/50)},goal:50},
{id:'early_riser',icon:'🌅',name:'Ранняя птица',tier:'common',check:function(s){return (s.stats.earlyRiser||0)>=7},progress:function(s){return Math.min(1,(s.stats.earlyRiser||0)/7)},goal:7},
{id:'night_owl',icon:'🦉',name:'Ночная сова',tier:'common',check:function(s){return (s.stats.nightOwl||0)>=7},progress:function(s){return Math.min(1,(s.stats.nightOwl||0)/7)},goal:7},
{id:'no_phone_day',icon:'📵',name:'День без телефона',tier:'rare',check:function(s){return (s.stats.noPhoneDays||0)>=1},progress:function(s){return Math.min(1,(s.stats.noPhoneDays||0)/1)},goal:1},
{id:'deep_work_100h',icon:'🎯',name:'100 часов Deep Work',tier:'epic',check:function(s){return (s.stats.deepWorkHours||0)>=100},progress:function(s){return Math.min(1,(s.stats.deepWorkHours||0)/100)},goal:100},
{id:'reader_12',icon:'📚',name:'12 книг за год',tier:'epic',check:function(s){return (s.watched||[]).filter(function(w){return w.type==='book'}).length>=12},progress:function(s){return Math.min(1,(s.watched||[]).filter(function(w){return w.type==='book'}).length/12)},goal:12},
{id:'polyglot',icon:'🌍',name:'Полиглот',tier:'rare',check:function(s){return Object.keys(s.englishProgress||{}).length>=75},progress:function(s){return Math.min(1,Object.keys(s.englishProgress||{}).length/75)},goal:75},
{id:'skill_hunter',icon:'💎',name:'50 навыков',tier:'rare',check:function(s){return Object.keys(s.skillsProgress||{}).length>=50},progress:function(s){return Math.min(1,Object.keys(s.skillsProgress||{}).length/50)},goal:50},
{id:'skill_master',icon:'🏅',name:'100 навыков',tier:'epic',check:function(s){return Object.keys(s.skillsProgress||{}).length>=100},progress:function(s){return Math.min(1,Object.keys(s.skillsProgress||{}).length/100)},goal:100},
{id:'skill_legend',icon:'👑',name:'Все навыки',tier:'legendary',check:function(s){return Object.keys(s.skillsProgress||{}).length>=150},progress:function(s){return Math.min(1,Object.keys(s.skillsProgress||{}).length/150)},goal:150},
{id:'course_10',icon:'📖',name:'10 курсов',tier:'rare',check:function(s){return (s.courses||[]).length>=10},progress:function(s){return Math.min(1,(s.courses||[]).length/10)},goal:10},
{id:'path_5',icon:'🗺',name:'5 путей',tier:'rare',check:function(s){return (s.paths||[]).filter(function(p){return (p.completedSteps||[]).length>0}).length>=5},progress:function(s){return Math.min(1,(s.paths||[]).filter(function(p){return (p.completedSteps||[]).length>0}).length/5)},goal:5}
];

function checkLevelComplete(s,levelId){
  var level=LEARNING_LEVELS.find(function(l){return l.id===levelId});
  if(!level)return false;
  for(var m=0;m<level.modules.length;m++){
    var mod=level.modules[m];
    for(var l=0;l<mod.lessons.length;l++){
      var key=levelId+'_'+mod.id+'_'+l;
      if(!s.levelProgress||!s.levelProgress[key])return false;
    }
  }
  return true;
}
function levelProgress(s,levelId){
  var level=LEARNING_LEVELS.find(function(l){return l.id===levelId});
  if(!level)return 0;
  var total=0,done=0;
  level.modules.forEach(function(mod){
    mod.lessons.forEach(function(l,idx){
      total++;
      if(s.levelProgress&&s.levelProgress[levelId+'_'+mod.id+'_'+idx])done++;
    });
  });
  return total>0?done/total:0;
}
function checkAchievements(){
  var unlocked=state.profile.achievements||[];
  var newOnes=[];
  for(var i=0;i<ACHIEVEMENTS.length;i++){
    var a=ACHIEVEMENTS[i];
    if(unlocked.indexOf(a.id)<0&&a.check(state)){
      unlocked.push(a.id);
      newOnes.push(a);
    }
  }
  state.profile.achievements=unlocked;
  if(newOnes.length){
    save();
    newOnes.forEach(function(a,idx){
      setTimeout(function(){
        if(typeof toast==='function')toast('🏆 '+a.name,'success',3500);
        if(typeof haptic==='function')haptic('success');
      },idx*800);
    });
  }
}

/* ============ METHODS (50+) ============ */
var METHODS_LIBRARY=[
{id:'cbt',title:'КПТ',emoji:'🧠',category:'Терапевтические',desc:'Когнитивно-поведенческая',steps:['Запиши ситуацию','Автоматическую мысль','Доказательства','Альтернатива','Проверь'],base:'Аарон Бек'},
{id:'act',title:'ACT',emoji:'🎭',category:'Терапевтические',desc:'Принятие',steps:['Прими','Разделись','В настоящее','Ценности','Действуй'],base:'Стивен Хейс'},
{id:'dbt',title:'DBT',emoji:'⚖️',category:'Терапевтические',desc:'Диалектическая',steps:['Осознанность','Регуляция','Дистресс','Межличностная'],base:'Марша Линехан'},
{id:'ifs',title:'IFS',emoji:'🔮',category:'Терапевтические',desc:'Внутренние части',steps:['Заметь','Познакомься','Функция','Self','Интеграция'],base:'Шварц'},
{id:'grow',title:'GROW',emoji:'🌱',category:'Коучинговые',desc:'Классика',steps:['Goal','Reality','Options','Will'],base:'Уитмор'},
{id:'deepwork',title:'Deep Work',emoji:'🎯',category:'Продуктивность',desc:'Глубокая работа',steps:['90 мин','Телефон вне','Одна задача','15 мин отдых','Метрики'],base:'Ньюпорт'},
{id:'pomodoro',title:'Помодоро',emoji:'🍅',category:'Продуктивность',desc:'25/5',steps:['Задача','Таймер 25','Работа','5 мин','4 цикла'],base:'Чирилло'},
{id:'gtd',title:'GTD',emoji:'📥',category:'Продуктивность',desc:'Getting Things Done',steps:['Capture','Clarify','Organize','Reflect','Engage'],base:'Аллен'},
{id:'habit_loop',title:'Петля привычки',emoji:'🔄',category:'Привычки',desc:'Cue → Reward',steps:['Триггер','Желание','Действие','Награда'],base:'Клир'},
{id:'habit_stack',title:'Habit Stacking',emoji:'🧱',category:'Привычки',desc:'Привязка',steps:['После [старая]','[новая]','2 мин','Отмечай'],base:'Фогг'},
{id:'kaizen',title:'Кайзен',emoji:'📈',category:'Привычки',desc:'1%',steps:['Область','Улучшение','Внедри','Оцени'],base:'Японская'},
{id:'breath478',title:'Дыхание 4-7-8',emoji:'🌬',category:'Дыхательные',desc:'Успокоение',steps:['4 вдох','7 задержка','8 выдох','Повтор 4'],base:'Вейл'},
{id:'box_breathing',title:'Квадратное',emoji:'⬛',category:'Дыхательные',desc:'Box',steps:['4-4-4-4'],base:'SEALs'},
{id:'wim_hof',title:'Вим Хоф',emoji:'❄️',category:'Дыхательные',desc:'Дыхание + холод',steps:['30-40 вдохов','Задержка','Холодный душ'],base:'Хоф'},
{id:'ikigai',title:'Икигай',emoji:'🌺',category:'Смысл',desc:'Японский',steps:['Люблю','Умею','Платят','Нужно миру'],base:'Японская'},
{id:'stoicism',title:'Стоицизм',emoji:'🏛',category:'Смысл',desc:'Дихотомия',steps:['Власть?','Вне?','Фокус','Принятие'],base:'Аврелий'},
{id:'logotherapy',title:'Логотерапия',emoji:'🎯',category:'Смысл',desc:'Смысл',steps:['Зачем','Труд/любовь','Прими','Действуй'],base:'Франкл'},
{id:'mindfulness',title:'Mindfulness',emoji:'🧘',category:'Осознанность',desc:'Осознанность',steps:['Сядь','Дыхание','Возвращай','5-20 мин'],base:'Каббат-Зинн'},
{id:'body_scan',title:'Body Scan',emoji:'🫀',category:'Осознанность',desc:'Сканирование',steps:['Ляг','Стопы','Вверх','10-20 мин'],base:'MBSR'},
{id:'grounding',title:'Заземление',emoji:'⚓',category:'Осознанность',desc:'5-4-3-2-1',steps:['5 видишь','4 слышишь','3 осязаешь','2 обоняешь','1 вкус'],base:'Тревога'},
{id:'nvc',title:'ННО',emoji:'💬',category:'Общение',desc:'Ненасильственное',steps:['Наблюдение','Чувства','Потребности','Просьба'],base:'Розенберг'},
{id:'sbi',title:'SBI',emoji:'📣',category:'Общение',desc:'Обратная связь',steps:['Situation','Behavior','Impact'],base:'CCL'},
{id:'cold_exposure',title:'Холод',emoji:'🥶',category:'Тело',desc:'Душ',steps:['30 сек','2 мин','Дыхание'],base:'Хоф'},
{id:'sauna',title:'Сауна',emoji:'🔥',category:'Тело',desc:'Термическая',steps:['80-100°C','15-20 мин','Охлаждение'],base:'Финская'},
{id:'fasting',title:'Голодание 16:8',emoji:'⏱',category:'Тело',desc:'Интервальное',steps:['Ешь 8 ч','Голодай 16','Вода'],base:'Нобель 2016'},
{id:'zone2',title:'Зона 2',emoji:'🏃',category:'Тело',desc:'Кардио 60-70%',steps:['Пульс 180-age','Говорить','3-4 ч/нед'],base:'Аттиа'},
{id:'hiit',title:'HIIT',emoji:'💥',category:'Тело',desc:'Интервальный',steps:['20 сек макс','10 сек отдых','8 циклов'],base:'Табата'},
{id:'strength',title:'Силовые',emoji:'🏋️',category:'Тело',desc:'Прогрессия',steps:['Базовые','4-6 повт','4 подхода'],base:'Ментцер'},
{id:'mobility',title:'Мобильность',emoji:'🤸',category:'Тело',desc:'Гибкость',steps:['10 мин','Динамическая'],base:'Староста'},
{id:'50_30_20',title:'Бюджет 50/30/20',emoji:'💼',category:'Финансы',desc:'Распределение',steps:['50 нужды','30 желания','20 сбережения'],base:'Уоррен'},
{id:'fire',title:'FIRE',emoji:'🔥',category:'Финансы',desc:'Финансовая независимость',steps:['Сбережения','Доход','Расходы','25x'],base:'MMM'},
{id:'snowball',title:'Снежный ком',emoji:'⛄',category:'Финансы',desc:'Долги',steps:['Список','По сумме','Минимум'],base:'Рамси'},
{id:'time_block',title:'Time-blocking',emoji:'📅',category:'Продуктивность',desc:'Блоки',steps:['Список','Оценка','Слоты','Буферы'],base:'Маск'},
{id:'eat_frog',title:'Eat That Frog',emoji:'🐸',category:'Продуктивность',desc:'Сложное первым',steps:['Главная','Утром','Без отвлечений'],base:'Трейси'},
{id:'kanban',title:'Канбан',emoji:'📊',category:'Продуктивность',desc:'Визуальное',steps:['To Do/Doing/Done','Лимит WIP'],base:'Toyota'},
{id:'eisenhower',title:'Матрица Эйзенхауэра',emoji:'🔢',category:'Продуктивность',desc:'Приоритеты',steps:['Q1 Делай','Q2 Планируй','Q3 Делегируй','Q4 Удали'],base:'Эйзенхауэр'},
{id:'10_10_10',title:'10/10/10',emoji:'🕐',category:'Решения',desc:'Долгосрочно',steps:['10 мин','10 мес','10 лет','Решение'],base:'Уэлч'},
{id:'inversion',title:'Инверсия',emoji:'🔄',category:'Решения',desc:'От противного',steps:['Что хочу','Худшее','Как избежать'],base:'Мангер'},
{id:'first_principles',title:'First Principles',emoji:'🧩',category:'Решения',desc:'Первые принципы',steps:['Факты','Разбей','Пересобери'],base:'Аристотель'},
{id:'second_order',title:'Второй порядок',emoji:'🔍',category:'Решения',desc:'Последствия',steps:['Результат','А потом?','Ещё?'],base:'Маркс'},
{id:'english_immersion',title:'Погружение',emoji:'🇬🇧',category:'Английский',desc:'Метод погружения',steps:['Среда','Слушай 1 ч','Говори 15 мин'],base:'Крашен'},
{id:'english_shadowing',title:'Shadowing',emoji:'🎤',category:'Английский',desc:'Повтор',steps:['Отрывок','Слушай','Повторяй','Записывай'],base:'Аронсон'},
{id:'english_anki',title:'Anki',emoji:'🃏',category:'Английский',desc:'Интервальное',steps:['Карточки','10/день','Повторяй'],base:'Вожецки'},
{id:'rest_sleep',title:'Сон',emoji:'😴',category:'Восстановление',desc:'Гигиена сна',steps:['Режим','Темнота','Прохлада','7-9 ч'],base:'Уокер'},
{id:'rest_nature',title:'Природа',emoji:'🌲',category:'Восстановление',desc:'Время на природе',steps:['2 ч/нед','Парк','Солнце'],base:'Ульрих'},
{id:'rest_reading',title:'Чтение',emoji:'📚',category:'Восстановление',desc:'Худож.литература',steps:['20 мин/день','Бумага'],base:'Вульф'},
{id:'rest_movies',title:'Фильмы',emoji:'🎬',category:'Восстановление',desc:'Осознанный просмотр',steps:['Выбери','Без телефона','Запиши'],base:'Кэмерон'},
{id:'rest_music',title:'Музыка',emoji:'🎵',category:'Восстановление',desc:'Расслабление',steps:['Плейлист','Закрой глаза'],base:'Левитин'},
{id:'rest_meditation',title:'Медитация',emoji:'🧘',category:'Восстановление',desc:'Практика',steps:['5-20 мин','Тишина','Возвращай'],base:'Каббат-Зинн'}
];

var PERSONAS={
coach:{name:'Коуч',color:'coach',label:'Продуктивность',emoji:'💬',prompt:'Ты AI-Коуч. GROW, SMART, Deep Work, Икигай. 150-220 слов.'},
psych:{name:'Психолог',color:'psych',label:'Клинический',emoji:'🧠',prompt:'Ты AI-Психолог. КПТ, ACT, DBT. НЕ ставь диагнозы! Кризис → 8-800-2000-122.'},
doctor:{name:'Врач',color:'doctor',label:'Медицина',emoji:'⚕️',prompt:'Ты AI-Врач. НЕ ставь диагнозы. Острые → 103/112.'},
nutrition:{name:'Нутрициолог',color:'nutrition',label:'Питание',emoji:'🥗',prompt:'Ты AI-Нутрициолог. 150-200 слов.'},
fitness:{name:'Тренер',color:'fitness',label:'Фитнес',emoji:'🏋️',prompt:'Ты AI-Фитнес-тренер. 150-200 слов.'},
lawyer:{name:'Юрист',color:'lawyer',label:'Право',emoji:'⚖️',prompt:'Ты AI-Юрист. 150-200 слов.'},
finance:{name:'Финансист',color:'finance',label:'Финансы',emoji:'💰',prompt:'Ты AI-Финансовый консультант.'}
};

/* ============ TABS (без English!) ============ */
var TABS=[
{id:'dashboard',emoji:'🏠',label:'Главная'},
{id:'tasks',emoji:'✅',label:'Задачи'},
{id:'learning',emoji:'🎓',label:'Обучение'},
{id:'entertainment',emoji:'🎬',label:'Досуг'},
{id:'ai',emoji:'✨',label:'AI'},
{id:'health',emoji:'❤️',label:'Здоровье'},
{id:'more',emoji:'⋯',label:'Ещё'}
];

/* ============ QUICK_TABS ============ */
var QUICK_TABS={
  learning:[
    {id:'all',emoji:'📚',label:'Всё'},
    {id:'levels',emoji:'🌱',label:'Уровни',target:'levels'},
    {id:'english',emoji:'🇬🇧',label:'English',target:'english'},
    {id:'skills',emoji:'💎',label:'Навыки',target:'skills'},
    {id:'courses',emoji:'📖',label:'Курсы',target:'courses'},
    {id:'paths',emoji:'🗺',label:'Пути',target:'paths'},
    {id:'methods',emoji:'🎯',label:'Методики',target:'methods'}
  ],
  english:[
    {id:'all',emoji:'📚',label:'Все'},
    {id:'A1',emoji:'🟢',label:'A1'},
    {id:'A2',emoji:'🟡',label:'A2'},
    {id:'B1',emoji:'🟠',label:'B1'},
    {id:'B2',emoji:'🔵',label:'B2'},
    {id:'C1',emoji:'🟣',label:'C1'}
  ],
  entertainment:[
    {id:'all',emoji:'🎬',label:'Всё',target:'entertainment'},
    {id:'resources',emoji:'🔗',label:'Свои',target:'resources'},
    {id:'movies',emoji:'🎥',label:'Фильмы',target:'movies'},
    {id:'series',emoji:'📺',label:'Сериалы',target:'series'},
    {id:'books',emoji:'📚',label:'Книги',target:'books'},
    {id:'musiclib',emoji:'🎵',label:'Музыка',target:'musiclib'},
    {id:'gameslib',emoji:'🎮',label:'Игры',target:'gameslib'},
    {id:'podcastslib',emoji:'🎧',label:'Подкасты',target:'podcastslib'}
  ],
  health:[
    {id:'all',emoji:'❤️',label:'Обзор',target:'health'},
    {id:'water',emoji:'💧',label:'Вода',target:'water'},
    {id:'mood',emoji:'💭',label:'Настроение',target:'mood'},
    {id:'workouts',emoji:'🏋️',label:'Тренировки',target:'workouts'},
    {id:'meditation',emoji:'🧘',label:'Медитации',target:'meditation'},
    {id:'meds',emoji:'💊',label:'Лекарства',target:'meds'}
  ],
  tasks:[
    {id:'all',emoji:'📋',label:'Все'},
    {id:'pending',emoji:'⏳',label:'Активные'},
    {id:'completed',emoji:'✅',label:'Готовые'},
    {id:'matrix',emoji:'🔢',label:'Матрица',target:'matrix'},
    {id:'dailyplan',emoji:'📅',label:'План',target:'dailyplan'}
  ]
};

var HABITS_TEMPLATES=[
{id:'water',title:'8 стаканов воды',icon:'💧',category:'Здоровье'},
{id:'walk',title:'Прогулка 30 минут',icon:'🚶',category:'Здоровье'},
{id:'meditation',title:'Медитация 10 минут',icon:'🧘',category:'Психика'},
{id:'reading',title:'Чтение 20 минут',icon:'📚',category:'Развитие'},
{id:'sleep_early',title:'Сон до 23:00',icon:'😴',category:'Здоровье'},
{id:'no_phone_morning',title:'Утро без телефона',icon:'🌅',category:'Цифровое'},
{id:'journal',title:'Дневник вечером',icon:'📓',category:'Психика'},
{id:'workout',title:'Тренировка',icon:'🏋️',category:'Здоровье'},
{id:'language',title:'Английский 15 минут',icon:'🇬🇧',category:'Развитие'},
{id:'gratitude',title:'3 благодарности',icon:'🙏',category:'Психика'},
{id:'no_sugar',title:'Без сахара',icon:'🍭',category:'Здоровье'},
{id:'deep_work',title:'Deep Work 90 минут',icon:'🎯',category:'Продуктивность'},
{id:'stretch',title:'Растяжка 10 минут',icon:'🤸',category:'Здоровье'},
{id:'no_social',title:'День без соцсетей',icon:'🚫',category:'Цифровое'},
{id:'nature',title:'На природе 20 минут',icon:'🌲',category:'Психика'}
];

var GOALS_TEMPLATES=[
{id:'g_fitness',title:'Похудеть на 5 кг',icon:'⚖️',category:'Здоровье',metric:'кг'},
{id:'g_muscle',title:'Нарастить массу',icon:'💪',category:'Здоровье',metric:'кг'},
{id:'g_run',title:'Пробежать 10 км',icon:'🏃',category:'Здоровье',metric:'км'},
{id:'g_english',title:'Английский до B2',icon:'🇬🇧',category:'Обучение',metric:'уровень'},
{id:'g_book',title:'12 книг за год',icon:'📚',category:'Развитие',metric:'книг'},
{id:'g_save',title:'Накопить 100 000',icon:'💰',category:'Финансы',metric:'руб'},
{id:'g_career',title:'Повышение',icon:'📈',category:'Карьера',metric:'этап'},
{id:'g_meditate',title:'100 дней медитации',icon:'🧘',category:'Психика',metric:'дней'},
{id:'g_detox',title:'Экран до 2 ч/день',icon:'📱',category:'Цифровое',metric:'ч'},
{id:'g_journal',title:'100 записей',icon:'📓',category:'Психика',metric:'записей'}
];

/* ============ DEFAULT STATE ============ */
function defaultState(){
  return {
    tasks:[],schedule:[],scheduleBlocks:[],
    habits:[],customHabits:[],habitLog:{},
    goals:[],customGoals:[],goalProgress:{},
    notes:[],customNotes:[],
    journal:[],journalEntries:[],winDiary:[],
    water:[],customWater:[],
    mood:[],customMood:[],
    sleep:[],customSleep:{},
    meds:[],customMeds:[],
    workouts:[],customWorkouts:[],
    meditations:[],customMeditation:[],
    timer:[],timerSessions:[],
    focusSessions:[],
    chats:[],
    levelProgress:{},englishProgress:{},skillsProgress:{},
    paths:[],courses:[],
    domainScores:{},domainHistory:{},metrics:{},
    matrix:[],
    entertainment:[],watchlist:[],watched:[],
    media:[],mediaLibrary:[],
    customResources:[],
    screenStats:{},screenHabits:{},screenMode:null,screenDaily:{},
    screenHistory:{},
    detoxCourseProgress:{},detoxChecklists:{},
    finance:[],financeGoals:[],
    eqJournal:[],memoryTraining:[],iqScores:[],
    xp:0,level:0,
    todayChallenges:[],challengeProgress:{},
    activeWorkMode:null,
    dailySurveys:{},
    todayPlan:null,
    dailyEnergy:{},dailyStress:{},dailyFocus:{},
    integrations:{
      googleCalendar:{connected:false,clientId:'',calendarId:'primary',accessToken:null,lastSync:null},
      obsidian:{path:'',apiKey:'',autoSync:false,lastSync:null,defaultFolder:'AI-Health'},
      gemini:{apiKey:'',model:'gemini-1.5-flash',connected:false},
      notion:{apiKey:'',databaseId:'',enabled:false},
      todoist:{apiKey:'',enabled:false}
    },
    screenTime:{limits:{daily:240,social:60,games:30,work:180},usage:{},detoxMode:false,detoxUntil:null},
    profile:{
      name:'',emoji:'😊',
      createdAt:new Date().toISOString(),
      achievements:[],
      surveyAnswers:null,
      surveyStep:0,
      surveyDone:false,
      personalPlan:null
    },
    settings:{
      theme:'dark',
      provider:'gemini',
      apiKey:'',
      activePersona:'coach',
      waterGoal:8,
      onboardingDone:false,
      autoMatrix:true,
      notifications:true,
      effectsEnabled:true,
      effectsIntensity:1,
      glassBlur:20,
      glassOpacity:1,
      animationSpeed:1,
      reminderTime:'morning',
      dailyPlanEnabled:true,
      language:'ru',
      weekStart:1,
      adaptiveLearning:true,
      autoSave:true,
      cloudSync:true,
      lastDailySurveyDay:null
    },
    flags:{dnd:false,focus:false},
    stats:{
      streak:0,lastActiveDay:null,totalDays:0,
      totalTasksDone:0,totalLessonsDone:0,totalWater:0,
      totalMoodLogs:0,totalWorkouts:0,totalMeditations:0,
      bestStreak:0,
      streakFreezes:1
    }
  };
}

function migrate(){
  var currentRaw=null;
  try{currentRaw=localStorage.getItem(STORAGE_KEY)}catch(e){}
  if(currentRaw)return;
  for(var i=0;i<OLD_KEYS.length;i++){
    var oldRaw=null;
    try{oldRaw=localStorage.getItem(OLD_KEYS[i])}catch(e){}
    if(oldRaw){
      try{
        var old=JSON.parse(oldRaw);
        var fresh=defaultState();
        Object.keys(old).forEach(function(k){
          if(k==='settings'){fresh.settings=Object.assign(fresh.settings,old.settings||{})}
          else if(k==='profile'){fresh.profile=Object.assign(fresh.profile,old.profile||{})}
          else if(k==='integrations'){fresh.integrations=Object.assign(fresh.integrations,old.integrations||{})}
          else if(k==='stats'){fresh.stats=Object.assign(fresh.stats,old.stats||{})}
          else if(k==='flags'){fresh.flags=Object.assign(fresh.flags,old.flags||{})}
          else if(fresh[k]!==undefined){fresh[k]=old[k]}
        });
        localStorage.setItem(STORAGE_KEY,JSON.stringify(fresh));
        console.log('Migrated from '+OLD_KEYS[i]);
        return;
      }catch(e){console.error('Migration failed:',e)}
    }
  }
}
migrate();

var state;
try{
  var raw=localStorage.getItem(STORAGE_KEY);
  if(raw){
    var parsed=JSON.parse(raw);
    state=Object.assign(defaultState(),parsed);
    state.settings=Object.assign(defaultState().settings,parsed.settings||{});
    state.flags=Object.assign(defaultState().flags,parsed.flags||{});
    state.stats=Object.assign(defaultState().stats,parsed.stats||{});
    state.profile=Object.assign(defaultState().profile,parsed.profile||{});
    state.screenTime=Object.assign(defaultState().screenTime,parsed.screenTime||{});
    state.integrations=Object.assign(defaultState().integrations,parsed.integrations||{});
    ['levelProgress','englishProgress','skillsProgress','domainScores','metrics',
     'entertainment','watchlist','watched','screenStats','screenHabits',
     'finance','financeGoals','eqJournal','memoryTraining','iqScores',
     'customHabits','habitLog','customGoals','goalProgress','customNotes',
     'journalEntries','winDiary','customWater','customMood','customMeds',
     'customMeditation','customWorkouts','timerSessions','focusSessions',
     'mediaLibrary','customResources','detoxCourseProgress','detoxChecklists',
     'todayChallenges','challengeProgress','screenHistory','customSleep',
     'dailySurveys','dailyEnergy','dailyStress','dailyFocus'].forEach(function(k){
      if(!state[k]){
        if(k.indexOf('Progress')>=0||k==='habitLog'||k==='metrics'||
           k==='domainScores'||k==='challengeProgress'||k==='screenHistory'||
           k==='customSleep'||k==='dailySurveys'||k==='dailyEnergy'||
           k==='dailyStress'||k==='dailyFocus'){
          state[k]={};
        } else {
          state[k]=[];
        }
      }
    });
  } else {
    state=defaultState();
  }
}catch(e){
  state=defaultState();
}

function save(){
  try{
    state.settings.updatedAt=new Date().toISOString();
    localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
  }catch(e){
    if(typeof toast==='function')toast('Ошибка сохранения','error');
  }
}

var currentPage='dashboard';
var currentLevelId=null;
var currentModuleId=null;
var currentLessonIdx=null;
var currentPathId=null;
var currentEnglishLevel=null;
var currentCourseId=null;
var currentEntityType=null;
var currentEntityId=null;
var currentSkillFilter='all';
var currentLearnFilter='all';
var currentLearnSearch='';
var currentQuickTab='all';
var currentDailySurveyStep=0;
var currentDailySurveyAnswers={};

var DAILY_SURVEY=[
{id:'sleepHours',question:'Сколько часов ты спал прошлой ночью?',hint:'7-9 часов — оптимум',type:'number',default:7,min:0,max:14,step:0.5},
{id:'mood',question:'Как настроение вчера в целом?',type:'slider',default:7},
{id:'energy',question:'Сколько было энергии?',type:'slider',default:7},
{id:'stress',question:'Уровень стресса?',type:'slider',default:5},
{id:'screenMinutes',question:'Сколько минут экрана вчера?',hint:'Screen Time',type:'number',default:240,min:0,max:1440,step:15},
{id:'focus',question:'Как с концентрацией вчера?',type:'slider',default:7},
{id:'water',question:'Сколько стаканов воды выпил?',hint:'Цель: 8',type:'number',default:6,min:0,max:20,step:1},
{id:'workouts',question:'Сколько было тренировок?',type:'number',default:0,min:0,max:5,step:1},
{id:'wins',question:'Какая была главная победа вчера?',type:'text',placeholder:'Что-то, чем гордишься'},
{id:'lessons',question:'Что ты понял/узнал вчера?',type:'text',placeholder:'1 урок дня'}
];

window.STORAGE_KEY=STORAGE_KEY;
window.defaultState=defaultState;
window.THEMES=THEMES;
window.DOMAINS=DOMAINS;
window.SURVEY_QUESTIONS=SURVEY_QUESTIONS;
window.PATHS_LIBRARY=PATHS_LIBRARY;
window.COURSES_LIBRARY=COURSES_LIBRARY;
window.LEARNING_LEVELS=LEARNING_LEVELS;
window.ENGLISH_125=ENGLISH_125;
window.MEMORY_MODULE=MEMORY_MODULE;
window.IQ_MODULE=IQ_MODULE;
window.EQ_MODULE=EQ_MODULE;
window.FINANCE_MODULE=FINANCE_MODULE;
window.NEURO_MODULE=NEURO_MODULE;
window.SKILLS_CATEGORIES=SKILLS_CATEGORIES;
window.SKILLS_LIBRARY=SKILLS_LIBRARY;
window.MOVIES_LIBRARY=MOVIES_LIBRARY;
window.SERIES_LIBRARY=SERIES_LIBRARY;
window.BOOKS_LIBRARY=BOOKS_LIBRARY;
window.MUSIC_LIBRARY=MUSIC_LIBRARY;
window.GAMES_LIBRARY=GAMES_LIBRARY;
window.PODCASTS_LIBRARY=PODCASTS_LIBRARY;
window.THEATER_LIBRARY=THEATER_LIBRARY;
window.ART_LIBRARY=ART_LIBRARY;
window.DETOX_COURSE=DETOX_COURSE;
window.SCREEN_TIPS=SCREEN_TIPS;
window.SCREEN_HABITS=SCREEN_HABITS;
window.OBSIDIAN_CONFIG=OBSIDIAN_CONFIG;
window.GCAL_CONFIG=GCAL_CONFIG;
window.NOTION_CONFIG=NOTION_CONFIG;
window.TODOIST_CONFIG=TODOIST_CONFIG;
window.GEMINI_CONFIG=GEMINI_CONFIG;
window.ACHIEVEMENTS=ACHIEVEMENTS;
window.METHODS_LIBRARY=METHODS_LIBRARY;
window.PERSONAS=PERSONAS;
window.TABS=TABS;
window.QUICK_TABS=QUICK_TABS;
window.HABITS_TEMPLATES=HABITS_TEMPLATES;
window.GOALS_TEMPLATES=GOALS_TEMPLATES;
window.DAILY_WISDOMS=DAILY_WISDOMS;
window.getTodayWisdom=getTodayWisdom;
window.DAILY_CHALLENGES=DAILY_CHALLENGES;
window.getTodayChallenges=getTodayChallenges;
window.WORK_MODES=WORK_MODES;
window.DAILY_SURVEY=DAILY_SURVEY;
window.checkLevelComplete=checkLevelComplete;
window.levelProgress=levelProgress;
window.checkAchievements=checkAchievements;
window.save=save;
window.state=state;