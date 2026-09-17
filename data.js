'use strict';
/* AI HEALTH v32 — DATA + MIGRATION */

var STORAGE_KEY = 'ai_health_v32';
var OLD_KEYS = ['ai_health_v31','ai_health_v30','ai_health_v29','ai_health_v28','ai_health_v26'];

/* ============ THEMES (45+) ============ */
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
{id:'love',emoji:'❤️',name:'Любовь',color:'#1a0810',effects:'hearts'}
];

/* ============ DOMAINS (10) + обучение по домену ============ */
var DOMAINS=[
{id:'physical',emoji:'💪',name:'Физическое',color:'#ff7ba9',desc:'Тело, сила, выносливость',
  metrics:[{id:'weight',label:'Вес (кг)',target:'60-80'},{id:'steps',label:'Шагов/день',target:'8000'},{id:'workouts',label:'Тренировок/нед',target:'3-5'},{id:'vo2max',label:'VO2max',target:'40+'},{id:'restHR',label:'Пульс покоя',target:'50-70'}],
  learning:'5 уровней (Фундамент→Трансформация) + 10 навыков Здоровья + Модуль Нейро (10 уроков) + Курсы: health_basics, nutrition_master, fitness_master'},
{id:'mental',emoji:'🧠',name:'Ментальное',color:'#4dd4ff',desc:'Фокус, память, ясность',
  metrics:[{id:'focusMin',label:'Deep Work (мин)',target:'180'},{id:'meditation',label:'Медитаций/нед',target:'7'},{id:'reading',label:'Страниц/день',target:'20'},{id:'memory',label:'Память 1-10',target:'7+'},{id:'iq',label:'IQ-задач/день',target:'5'}],
  learning:'Модуль Память (10) + Модуль IQ (10) + 15 навыков Когнитивных + Курсы: memory_master, iq_boost, productivity_master'},
{id:'emotional',emoji:'❤️',name:'Эмоциональное',color:'#ff6b6b',desc:'Чувства, стресс',
  metrics:[{id:'mood',label:'Настроение 1-10',target:'7+'},{id:'stress',label:'Стресс 1-10',target:'<5'},{id:'anxiety',label:'Тревога 1-10',target:'<4'},{id:'journal',label:'Записей/нед',target:'3'}],
  learning:'Модуль EQ (10) + 10 навыков Эмоциональных + Курс: mental_health, eq_course'},
{id:'spiritual',emoji:'🕊',name:'Духовное',color:'#b394ff',desc:'Смысл, ценности',
  metrics:[{id:'gratitude',label:'Благодарностей/день',target:'3'},{id:'meaning',label:'Смысл 1-10',target:'7+'},{id:'nature',label:'На природе (мин/нед)',target:'120'}],
  learning:'Уровень 4-5 + 4 навыка Духовных + 5 навыков Философских + Курс: meaning_course'},
{id:'financial',emoji:'💰',name:'Финансовое',color:'#ffcc4d',desc:'Бюджет, инвестиции',
  metrics:[{id:'savings',label:'Норма сбережений %',target:'20%+'},{id:'runway',label:'Runway (мес)',target:'6+'},{id:'debt',label:'Долговая нагрузка %',target:'<30%'}],
  learning:'Модуль Финансы (10) + 8 навыков Финансовых + Курс: financial_literacy, fire_course'},
{id:'career',emoji:'💼',name:'Карьерное',color:'#3ddc97',desc:'Навыки, позиция',
  metrics:[{id:'skills',label:'Навыков в развитии',target:'3'},{id:'network',label:'Контактов/мес',target:'5'},{id:'projects',label:'Проектов/квартал',target:'3'}],
  learning:'6 навыков Карьеры + Курс: career_master, leadership_course'},
{id:'social',emoji:'👥',name:'Социальное',color:'#c4b5fd',desc:'Семья, друзья',
  metrics:[{id:'deepConnections',label:'Глубоких связей',target:'5+'},{id:'calls',label:'Звонков/нед',target:'3'},{id:'meetups',label:'Встреч/мес',target:'4'}],
  learning:'10 навыков Социальных + 5 навыков Отношений + Курс: communication'},
{id:'environment',emoji:'🏠',name:'Среда',color:'#a4e7ff',desc:'Пространство, свет',
  metrics:[{id:'clutter',label:'Порядок 1-10',target:'8+'},{id:'light',label:'Освещение 1-10',target:'8+'},{id:'noise',label:'Тишина 1-10',target:'7+'}],
  learning:'Уровень 1-2 + Курс: environment_design'},
{id:'recovery',emoji:'⏰',name:'Восстановление',color:'#4dd4ff',desc:'Сон, отдых, детокс',
  metrics:[{id:'sleepHours',label:'Сон (ч)',target:'7-9'},{id:'sleepQuality',label:'Качество сна 1-10',target:'8+'},{id:'breaks',label:'Перерывов/день',target:'6+'}],
  learning:'10 навыков Здоровья + Курс: recovery_course, sleep_master'},
{id:'digital',emoji:'📱',name:'Цифровое',color:'#ff88cc',desc:'Экран, детокс, фокус',
  metrics:[{id:'screenToday',label:'Экран сегодня (мин)',target:'<240'},{id:'screenWeek',label:'Экран за неделю (ч)',target:'<28'},{id:'phoneUnlocks',label:'Разблокировок',target:'<80'},{id:'socialTime',label:'Соцсети (мин)',target:'<60'}],
  learning:'30-дневный курс детокса + 5 навыков Цифровых + Курс: screentime_course'}
];

/* ============ МУДРОСТИ ДНЯ (100+) ============ */
var DAILY_WISDOMS=[
{text:'Ты не ленивый. Ты либо устал, либо не видишь смысла, либо боишься.',author:'Неизвестный',apply:'Спроси себя: что из 3 — моё?'},
{text:'Дисциплина — это выбор между тем, что хочешь сейчас, и тем, что хочешь больше всего.',author:'Авраам Линкольн',apply:'Спроси: что я хочу больше всего?'},
{text:'Мы — то, что делаем постоянно. Совершенство — не действие, а привычка.',author:'Аристотель',apply:'Что ты делаешь каждый день?'},
{text:'Между стимулом и реакцией есть пространство. В нём — наша свобода.',author:'Виктор Франкл',apply:'Дыши 6 секунд перед реакцией'},
{text:'Счастье — это не то, что ты имеешь, а то, что ты чувствуешь.',author:'Даг Хэммершолд',apply:'Запиши 3 благодарности'},
{text:'Ты не можешь вернуться и изменить начало, но можешь начать сейчас и изменить конец.',author:'К.С. Льюис',apply:'Что ты можешь сделать за 2 минуты?'},
{text:'Не откладывай на завтра то, что можно отложить на послезавтра — но и не откладывай то, что важно.',author:'Уоррен Баффет',apply:'Что твоя 1 главная задача?'},
{text:'Единственный способ делать великую работу — любить то, что делаешь.',author:'Стив Джобс',apply:'Что ты делаешь с любовью?'},
{text:'Сложнее всего начать действовать, всё остальное зависит только от упорства.',author:'Амелия Эрхарт',apply:'Начни с 2 минут'},
{text:'Тот, кто владеет собой, владеет миром.',author:'Сенека',apply:'Где ты потерял контроль?'},
{text:'Мы становимся тем, о чём думаем.',author:'Будда',apply:'О чём ты думаешь сейчас?'},
{text:'Победа над собой — величайшая победа.',author:'Платон',apply:'В чём ты можешь превзойти себя сегодня?'},
{text:'Секрет перемен в том, чтобы сосредоточить всю свою энергию не на борьбе со старым, а на создании нового.',author:'Сократ',apply:'Что ты создаёшь вместо старого?'},
{text:'Если хочешь изменить мир — начни с себя.',author:'Махатма Ганди',apply:'Что ты изменишь сегодня?'},
{text:'Жизнь — это 10% того, что происходит с нами, и 90% того, как мы реагируем.',author:'Чарльз Свиндолл',apply:'Как ты реагируешь на проблему?'},
{text:'Каждый день — это новая возможность изменить свою жизнь.',author:'Неизвестный',apply:'Что ты изменишь сегодня?'},
{text:'Не сравнивай себя с другими. Сравнивай с собой вчерашним.',author:'Джордан Питерсон',apply:'Насколько ты вырос?'},
{text:'Успех — это сумма маленьких усилий, повторяемых день за днём.',author:'Роберт Кольер',apply:'Какое маленькое усилие ты сделаешь?'},
{text:'Всё, что ты можешь сделать, — это начать.',author:'Неизвестный',apply:'Что ты начнёшь сегодня?'},
{text:'Измени свои мысли — изменится твоя жизнь.',author:'Уэйн Дайер',apply:'О чём ты думаешь?'},
{text:'Великие дела не делаются в зоне комфорта.',author:'Неизвестный',apply:'Что ты можешь сделать сегодня вне комфорта?'},
{text:'Страх — это не то, что ты должен бояться. Это то, что ты должен преодолеть.',author:'Неизвестный',apply:'Сделай одно страшное дело сегодня'},
{text:'Ты сильнее, чем кажется. Смелее, чем верится. Умнее, чем думается.',author:'А.А. Милн',apply:'Вспомни свою прошлую победу'},
{text:'Утро определяет день. Начни с правильной привычки.',author:'Робин Шарма',apply:'Сделай утренний ритуал'},
{text:'Не трать время на сожаления. Используй его на действие.',author:'Неизвестный',apply:'Что ты можешь сделать сейчас?'},
{text:'Ты — не свои мысли. Ты — тот, кто их наблюдает.',author:'Экхарт Толле',apply:'Наблюдай свои мысли'},
{text:'Действие — главный ключ к успеху.',author:'Пабло Пикассо',apply:'Сделай одно действие'},
{text:'Стресс — не то, что происходит, а то, что ты думаешь о происходящем.',author:'Эндрю Бернстейн',apply:'Что ты думаешь о проблеме?'},
{text:'Разница между тем, кто ты, и тем, кем хочешь быть — в том, что ты делаешь.',author:'Неизвестный',apply:'Что ты сделаешь сегодня?'},
{text:'Сон — основа всего. Приоритет №1.',author:'Мэттью Уокер',apply:'Спи сегодня 7-9 часов'},
{text:'Каждый день делай что-то, что тебя пугает.',author:'Элеонор Рузвельт',apply:'Что тебя пугает?'},
{text:'Тот, кто верит в себя, может сделать всё.',author:'Вергилий',apply:'Во что ты веришь?'},
{text:'Ты не обязан быть великим, чтобы начать. Но ты должен начать, чтобы стать великим.',author:'Зиг Зиглар',apply:'С чего начнёшь?'},
{text:'Если не сейчас, то когда?',author:'Неизвестный',apply:'Почему не сейчас?'},
{text:'Изменение начинается с осознания. Осознание начинается с тишины.',author:'Неизвестный',apply:'10 минут тишины'},
{text:'Ты не можешь изменить прошлое, но можешь изменить будущее.',author:'Неизвестный',apply:'Что ты можешь изменить?'},
{text:'Настоящий успех — это когда ты счастлив, а не когда ты победил.',author:'Неизвестный',apply:'Ты счастлив?'},
{text:'Кто не рискует, тот не пьёт шампанского.',author:'Русская пословица',apply:'На что ты готов?'},
{text:'Будь тем изменением, которое хочешь видеть в мире.',author:'Махатма Ганди',apply:'Какое изменение ты хочешь?'},
{text:'Сначала мечтай. Потом действуй.',author:'Неизвестный',apply:'О чём ты мечтаешь?'},
{text:'Дисциплина — мост между целями и достижениями.',author:'Джим Рон',apply:'Какова твоя дисциплина?'},
{text:'Один день — один шаг. И так каждый день.',author:'Неизвестный',apply:'Какой твой шаг?'},
{text:'Не тот умен, кто много знает, а тот, кто знает нужное.',author:'Эсхил',apply:'Что тебе действительно нужно?'},
{text:'Скука — двигатель креативности.',author:'Неизвестный',apply:'10 минут без телефона'},
{text:'Смысл жизни в том, чтобы дать ей смысл.',author:'Неизвестный',apply:'Какой смысл ты выбираешь?'},
{text:'Внутреннее спокойствие — высшая форма силы.',author:'Неизвестный',apply:'10 минут медитации'},
{text:'Твоя энергия притягивает твою реальность.',author:'Неизвестный',apply:'Что ты излучаешь?'},
{text:'Ошибаться — нормально. Не учиться на ошибках — глупо.',author:'Неизвестный',apply:'Какую ошибку ты извлёк?'},
{text:'Мечта не работает, если ты не работаешь.',author:'Джон Максвелл',apply:'Что ты сделал для мечты?'},
{text:'Иди медленно, но не останавливайся.',author:'Китайская пословица',apply:'Ты двигаешься вперёд?'},
{text:'Счастье — это путь, а не пункт назначения.',author:'Неизвестный',apply:'Ты наслаждаешься путём?'},
{text:'Сначала пойми, потом будь понятым.',author:'Стивен Кови',apply:'Ты слушаешь?'},
{text:'Не бойся медленного роста. Бойся стоять на месте.',author:'Китайская пословица',apply:'Растёшь ли ты?'},
{text:'Заботься о теле — это единственное место, где тебе жить.',author:'Джим Рон',apply:'Что ты сделал для тела сегодня?'},
{text:'Маленькие шаги ведут к большим переменам.',author:'Неизвестный',apply:'Какой маленький шаг ты сделаешь?'},
{text:'Каждое утро у тебя есть два выбора: продолжать спать с мечтами или встать и chase them.',author:'Неизвестный',apply:'Что выберешь?'},
{text:'Твои привычки определяют твоё будущее.',author:'Джеймс Клир',apply:'Какая привычка работает на тебя?'},
{text:'Не откладывай. Прокрастинация — это страх в действии.',author:'Неизвестный',apply:'Что ты откладываешь?'},
{text:'Благодарность — путь к счастью.',author:'Неизвестный',apply:'За что ты благодарен?'},
{text:'Ты всегда можешь начать заново. Всегда.',author:'Неизвестный',apply:'С чего ты начнёшь заново?'},
{text:'Только тот, кто рискует, может достичь.',author:'Неизвестный',apply:'Как ты рискуешь?'},
{text:'Успех — это не конечная точка, а постоянное движение.',author:'Неизвестный',apply:'Ты движешься?'},
{text:'Инвестируй в себя — это лучшая инвестиция.',author:'Бенджамин Франклин',apply:'Что ты сделал для себя?'},
{text:'Будь здесь и сейчас. Прошлое — история, будущее — загадка.',author:'Неизвестный',apply:'Ты в моменте?'},
{text:'Всё, что тебе нужно, уже внутри тебя.',author:'Неизвестный',apply:'Что ты нашёл внутри?'},
{text:'Терпение — ключ ко всему.',author:'Неизвестный',apply:'Ты терпелив?'},
{text:'Секрет успеха — начать.',author:'Марк Твен',apply:'Начни с 2 минут'},
{text:'Один процент лучше каждый день — вот и весь секрет.',author:'Джеймс Клир',apply:'Что ты улучшил на 1%?'},
{text:'Твоя жизнь — твой выбор. Никто не сделает это за тебя.',author:'Неизвестный',apply:'Какой выбор ты делаешь?'},
{text:'Сосредоточься на прогрессе, а не на совершенстве.',author:'Неизвестный',apply:'Где у тебя прогресс?'},
{text:'Тот, кто читает, управляет.',author:'Неизвестный',apply:'Прочти 20 минут'},
{text:'Начни с того, что можешь, используй то, что имеешь.',author:'Артур Эш',apply:'Что ты можешь сейчас?'},
{text:'Не бойся ошибок. Бойся ничего не делать.',author:'Неизвестный',apply:'Что ты сделал сегодня?'},
{text:'Успех — это сумма маленьких шагов, сделанных ежедневно.',author:'Неизвестный',apply:'Какой твой шаг?'},
{text:'Лучшее время посадить дерево было 20 лет назад. Второе лучшее — сейчас.',author:'Китайская пословица',apply:'Что ты посадишь сейчас?'},
{text:'Действуй, даже если страшно. Особенно если страшно.',author:'Неизвестный',apply:'Сделай страшное дело'},
{text:'Ты не найдёшь себя в тишине, если не дашь себе её.',author:'Неизвестный',apply:'10 минут тишины'},
{text:'Отдых — часть работы.',author:'Неизвестный',apply:'Сделай перерыв'},
{text:'Наблюдай. Слушай. Учись. Расти.',author:'Неизвестный',apply:'Что ты узнал сегодня?'},
{text:'Чем больше ты отдаёшь, тем больше получаешь.',author:'Уинстон Черчилль',apply:'Что ты дал сегодня?'},
{text:'Свобода — в дисциплине.',author:'Неизвестный',apply:'Какова твоя дисциплина?'},
{text:'Ты — автор своей истории.',author:'Неизвестный',apply:'Что ты напишешь сегодня?'},
{text:'Окружение определяет мышление.',author:'Джим Рон',apply:'Что тебя окружает?'},
{text:'Любовь к себе — начало всех изменений.',author:'Неизвестный',apply:'Как ты заботишься о себе?'},
{text:'Умение проигрывать — путь к победе.',author:'Неизвестный',apply:'Как ты принял поражение?'},
{text:'Твоя реакция на события — твоя сила.',author:'Стивен Кови',apply:'Как ты реагируешь?'},
{text:'Сила — в действии, не в мыслях.',author:'Неизвестный',apply:'Что ты делаешь?'},
{text:'Кто ищет, тот всегда найдёт.',author:'Неизвестный',apply:'Что ты ищешь?'},
{text:'Каждый день — это подарок.',author:'Неизвестный',apply:'Что ты подарил себе?'},
{text:'Никогда не сдавайся.',author:'Уинстон Черчилль',apply:'Ты близок к цели?'},
{text:'Дисциплина ума — высшая форма дисциплины.',author:'Неизвестный',apply:'Управляй мыслями'},
{text:'Ключ к успеху — в последовательности.',author:'Неизвестный',apply:'Что ты делаешь постоянно?'},
{text:'Ты можешь всё, если веришь.',author:'Неизвестный',apply:'Ты веришь?'},
{text:'Сначала сделай. Потом подумай, как сделать лучше.',author:'Неизвестный',apply:'Начни сейчас'},
{text:'Меньше слов, больше действий.',author:'Неизвестный',apply:'Что ты сделаешь?'},
{text:'Твоя жизнь — результат твоих решений.',author:'Неизвестный',apply:'Что ты выбираешь?'},
{text:'Не сдавайся на полпути.',author:'Неизвестный',apply:'Где ты остановился?'},
{text:'Свет в конце тоннеля — это ты.',author:'Неизвестный',apply:'Ты видишь свет?'},
{text:'Один день — одна новая привычка.',author:'Неизвестный',apply:'Какая твоя новая привычка?'},
{text:'Ставь большие цели и делай маленькие шаги.',author:'Неизвестный',apply:'Какова твоя цель?'},
{text:'Твоя улыбка может изменить чей-то день.',author:'Неизвестный',apply:'Улыбнись кому-то'},
{text:'Начни сегодня, потому что завтра никогда не наступит.',author:'Неизвестный',apply:'Почему не сегодня?'},
{text:'Ты справишься. Ты всегда справляешься.',author:'Неизвестный',apply:'Вспомни прошлые победы'},
{text:'То, что ты делаешь сейчас — определяет твоё будущее.',author:'Неизвестный',apply:'Что ты делаешь сейчас?'},
{text:'Будь терпелив. Всё приходит вовремя.',author:'Неизвестный',apply:'Ты терпелив?'},
{text:'Победа любит подготовленных.',author:'Неизвестный',apply:'Ты готов?'},
{text:'Ошибки — это уроки, не приговор.',author:'Неизвестный',apply:'Что ты узнал?'},
{text:'Сравнивай себя только с собой вчерашним.',author:'Джордан Питерсон',apply:'Насколько ты вырос?'},
{text:'Твой ум — твой самый мощный инструмент.',author:'Неизвестный',apply:'Используй ум сегодня'},
{text:'Простое лучше сложного.',author:'Неизвестный',apply:'Что можно упростить?'},
{text:'Всё, что ты имеешь — настоящее.',author:'Неизвестный',apply:'Что ты имеешь?'},
{text:'Ты — то, что ты ешь, читаешь и думаешь.',author:'Неизвестный',apply:'Что ты потребляешь?'},
{text:'Жизнь — это выбор. Выбирай мудро.',author:'Неизвестный',apply:'Какой выбор ты делаешь?'},
{text:'Будь лучшей версией себя.',author:'Неизвестный',apply:'Что ты можешь улучшить?'},
{text:'Ты важен. Не забывай об этом.',author:'Неизвестный',apply:'Ты ценишь себя?'}
];

function getTodayWisdom(){
  var dayIdx = Math.floor(Date.now() / 86400000) % DAILY_WISDOMS.length;
  return DAILY_WISDOMS[dayIdx];
}

/* ============ ЕЖЕДНЕВНЫЕ ЧЕЛЛЕНДЖИ (50) ============ */
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
{id:'ch_no_phone_2h_sleep',title:'2 часа без экрана',desc:'За 2 часа до сна',reward:30,category:'health'},
{id:'ch_workout',title:'Тренировка',desc:'Сделай тренировку',reward:35,category:'health'},
{id:'ch_no_sugar',title:'Без сахара',desc:'День без сахара',reward:25,category:'health'},
{id:'ch_gratitude_3',title:'3 благодарности',desc:'Запиши 3 благодарности',reward:15,category:'spiritual'},
{id:'ch_english_15',title:'Английский 15 мин',desc:'Позанимайся английским',reward:20,category:'mental'},
{id:'ch_eye_gym',title:'Гимнастика глаз',desc:'10 упражнений для глаз',reward:15,category:'health'},
{id:'ch_palming',title:'Пальминг',desc:'5 минут пальминга',reward:10,category:'health'},
{id:'ch_20_20_20',title:'Правило 20-20-20',desc:'Соблюдай весь день',reward:20,category:'health'},
{id:'ch_no_news_eve',title:'Без новостей вечером',desc:'После 18:00 — нет',reward:15,category:'digital'},
{id:'ch_no_phone_work',title:'Телефон вне комнаты',desc:'Во время работы',reward:30,category:'productivity'},
{id:'ch_deep_work_2',title:'2 блока Deep Work',desc:'2×90 минут',reward:50,category:'productivity'},
{id:'ch_mood_log',title:'Настроение 3×',desc:'Запиши 3 раза',reward:15,category:'emotional'},
{id:'ch_sleep_early',title:'Сон до 23:00',desc:'Ляг спать до 23:00',reward:25,category:'health'},
{id:'ch_no_caffeine_eve',title:'Кофе до 14:00',desc:'Не пей кофе после 14:00',reward:15,category:'health'},
{id:'ch_cold_shower',title:'Холодный душ',desc:'2 минуты холодной воды',reward:25,category:'health'},
{id:'ch_nature_30',title:'Природа 30 мин',desc:'Прогулка на природе',reward:20,category:'spiritual'},
{id:'ch_no_phone_bed',title:'Телефон вне спальни',desc:'Ночь без телефона',reward:25,category:'digital'},
{id:'ch_deep_reading',title:'Чтение 30 мин',desc:'Глубокая книга',reward:25,category:'mental'},
{id:'ch_learn_lesson',title:'1 урок обучения',desc:'Пройди урок',reward:20,category:'mental'},
{id:'ch_learn_skill',title:'Навык',desc:'Изучи навык',reward:30,category:'mental'},
{id:'ch_3_habits',title:'3 привычки',desc:'Выполни 3 привычки',reward:30,category:'productivity'},
{id:'ch_1_goal',title:'Прогресс к цели',desc:'Сделай шаг к цели',reward:25,category:'productivity'},
{id:'ch_note',title:'Заметка',desc:'Запиши идею',reward:15,category:'mental'},
{id:'ch_1_lesson_eng',title:'1 урок English',desc:'Пройди урок',reward:20,category:'mental'},
{id:'ch_morning_pages',title:'Утренние страницы',desc:'3 страницы от руки',reward:25,category:'mental'},
{id:'ch_breathing_478',title:'Дыхание 4-7-8',desc:'4 цикла утром и вечером',reward:15,category:'emotional'},
{id:'ch_no_phone_lunch',title:'Обед без экрана',desc:'30 минут без телефона',reward:20,category:'digital'},
{id:'ch_walk_20',title:'Прогулка 20 мин',desc:'Без телефона',reward:15,category:'health'},
{id:'ch_no_phone_1h',title:'1 час без телефона',desc:'Полный цифровой детокс',reward:30,category:'digital'},
{id:'ch_veggies_500',title:'500 г овощей',desc:'Съешь 500 г овощей',reward:25,category:'health'},
{id:'ch_protein_16',title:'1.6 г белка/кг',desc:'Достаточно белка',reward:25,category:'health'},
{id:'ch_no_alcohol',title:'Без алкоголя',desc:'День без алкоголя',reward:20,category:'health'},
{id:'ch_no_smoking',title:'Без сигарет',desc:'День без курения',reward:35,category:'health'},
{id:'ch_journal_deep',title:'Глубокий дневник',desc:'15 минут письма',reward:25,category:'emotional'},
{id:'ch_5_things_learned',title:'5 новых вещей',desc:'Узнай 5 новых фактов',reward:20,category:'mental'},
{id:'ch_creative',title:'Творчество',desc:'30 минут творчества',reward:25,category:'emotional'},
{id:'ch_social',title:'Живое общение',desc:'Позвони близкому',reward:20,category:'social'},
{id:'ch_family_time',title:'Время с семьёй',desc:'1 час без телефонов',reward:30,category:'social'},
{id:'ch_no_phone_2h',title:'2 часа без телефона',desc:'Полный детокс',reward:40,category:'digital'},
{id:'ch_review_week',title:'Ревью недели',desc:'30 минут анализа',reward:25,category:'productivity'},
{id:'ch_plan_day',title:'План на завтра',desc:'3 задачи',reward:15,category:'productivity'}
];

function getTodayChallenges(){
  var dayIdx = Math.floor(Date.now() / 86400000);
  var result = [];
  for(var i=0;i<3;i++){
    result.push(DAILY_CHALLENGES[(dayIdx*3+i) % DAILY_CHALLENGES.length]);
  }
  return result;
}

/* ============ РЕЖИМЫ РАБОТЫ (4) ============ */
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
{id:'healthIssues',question:'Есть проблемы со здоровьем?',type:'multi',options:[{value:'none',label:'Нет',emoji:'✅'},{value:'back',label:'Спина/шея',emoji:'🦴'},{value:'headaches',label:'Головные боли',emoji:'🤕'},{value:'sleep',label:'Сон',emoji:'😴'},{value:'digestion',label:'ЖКТ',emoji:'🥗'},{value:'heart',label:'Сердце/давление',emoji:'❤️'},{value:'mental',label:'Психика',emoji:'🧠'}]},
{id:'timeAvailable',question:'Сколько времени в день?',type:'options',options:[{value:'15min',label:'15 минут',emoji:'⏱'},{value:'30min',label:'30 минут',emoji:'🕐'},{value:'1h',label:'1 час',emoji:'⏰'},{value:'2h+',label:'2+ часа',emoji:'🕰'}]},
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
{id:'englishLevel',question:'Уровень английского?',type:'options',options:[{value:'beginner',label:'Beginner (A1-A2)',emoji:'🆕'},{value:'intermediate',label:'Intermediate (B1-B2)',emoji:'📘'},{value:'advanced',label:'Advanced (C1-C2)',emoji:'🎓'},{value:'native',label:'Native',emoji:'🇬🇧'}]}
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
    detoxCourseProgress:{},detoxChecklists:{},
    finance:[],financeGoals:[],
    eqJournal:[],memoryTraining:[],iqScores:[],
    xp:0,level:0,
    todayChallenges:[],challengeProgress:{},
    activeWorkMode:null,
    screenHistory:{},
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
      cloudSync:true
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

/* ============ MIGRATION ============ */
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
        if(old.notes&&old.notes.length&&(!fresh.customNotes||fresh.customNotes.length===0)){
          fresh.customNotes=old.notes.map(function(n){return Object.assign({},n)});
        }
        if(old.journal&&old.journal.length&&(!fresh.journalEntries||fresh.journalEntries.length===0)){
          fresh.journalEntries=old.journal.map(function(j){return Object.assign({},j)});
        }
        localStorage.setItem(STORAGE_KEY,JSON.stringify(fresh));
        console.log('Migrated from '+OLD_KEYS[i]);
        return;
      }catch(e){console.error('Migration failed:',e)}
    }
  }
}
migrate();

/* ============ LOAD STATE ============ */
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
     'todayChallenges','challengeProgress','screenHistory'].forEach(function(k){
      if(!state[k]){
        if(k.indexOf('Progress')>=0||k==='habitLog'||k==='metrics'||
           k==='domainScores'||k==='challengeProgress'||k==='screenHistory'){
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

/* ============ PATHS (22) ============ */
var PATHS_LIBRARY=[
{id:'procrastination',title:'Прокрастинация',emoji:'⏳',category:'Продуктивность',steps:[{title:'Диагностика',desc:'Определи тип',secret:'Защита от дискомфорта.'},{title:'Правило 2 минут',desc:'Начни с малого',secret:'90 секунд.'},{title:'Pomodoro',desc:'25/5',secret:'Снижает тревогу.'},{title:'Дедлайн',desc:'Скажи другу',secret:'Мотивация.'},{title:'Среда',desc:'Телефон в комнату',secret:'Воля — ресурс.'},{title:'Награда',desc:'После задачи',secret:'Дофамин.'},{title:'Рефлексия',desc:'Что работало',secret:'66 дней.'}]},
{id:'anxiety',title:'Тревожность',emoji:'🌊',category:'Психика',steps:[{title:'Сигналы',desc:'Тело — радар',secret:'Древняя система.'},{title:'4-7-8',desc:'Дыхание',secret:'Выключатель.'},{title:'Заземление',desc:'5-4-3-2-1',secret:'В настоящее.'},{title:'Дневник',desc:'Запиши тревогу',secret:'90% преувеличены.'},{title:'КПТ',desc:'Мысль → альтернатива',secret:'Объективность.'},{title:'Тело',desc:'Йога',secret:'Часть психики.'},{title:'Отказ',desc:'80% вне контроля',secret:'Стоики.'},{title:'Помощь',desc:'К психотерапевту',secret:'КПТ 80%.'}]},
{id:'burnout',title:'Выгорание',emoji:'🔥',category:'Психика',steps:[{title:'Признать',desc:'Истощение',secret:'Отрицание.'},{title:'Стоп',desc:'-50% нагрузки',secret:'Недели.'},{title:'Сон',desc:'8-9 ч',secret:'Фундамент.'},{title:'Питание',desc:'Белок, овощи',secret:'Воспаление.'},{title:'Границы',desc:'Учись "нет"',secret:'Здоровье.'},{title:'Смысл',desc:'Что важно',secret:'Разрыв.'},{title:'Система',desc:'Постепенно',secret:'Многие сильнее.'}]},
{id:'sleep',title:'Плохой сон',emoji:'😴',category:'Здоровье',steps:[{title:'Дневник',desc:'Записывай',secret:'Улучшается.'},{title:'Циркадный',desc:'В одно время',secret:'Свет утром.'},{title:'Ритуал',desc:'Без экранов',secret:'Переход.'},{title:'Спальня',desc:'18-20°C',secret:'Храм.'},{title:'Еда',desc:'Кофе до 14:00',secret:'Алкоголь.'},{title:'Не спится',desc:'Встань',secret:'Кровать = сон.'}]},
{id:'money',title:'Финансы',emoji:'💰',category:'Финансы',steps:[{title:'Инвентаризация',desc:'Активы и долги',secret:'Реальность.'},{title:'50/30/20',desc:'Распределение',secret:'Карта.'},{title:'Подушка',desc:'3-6 мес',secret:'От паники.'},{title:'Долги',desc:'Снежный ком',secret:'20-30%.'},{title:'Инвестиции',desc:'Индексы',secret:'Баффет.'},{title:'Защита',desc:'Страхование',secret:'Про жизнь.'},{title:'Доход',desc:'2-й источник',secret:'Навал.'}]},
{id:'relationships',title:'Отношения',emoji:'💞',category:'Отношения',steps:[{title:'Слушание',desc:'Понять',secret:'69%.'},{title:'Я-сообщения',desc:'"Я чувствую"',secret:'Не "ты".'},{title:'Банк',desc:'Ежедневно',secret:'5:1.'},{title:'Ремонт',desc:'Извинение',secret:'Победа = поражение.'},{title:'Границы',desc:'Спокойно',secret:'Здоровье.'},{title:'Время',desc:'Час/день',secret:'80% разводов.'},{title:'Терапия',desc:'Если годами',secret:'ЭФТ 70%.'}]},
{id:'focus',title:'Концентрация',emoji:'🎯',category:'Продуктивность',steps:[{title:'Один экран',desc:'Работа с одним',secret:'40% потерь.'},{title:'Block time',desc:'90 минут',secret:'Deep Work.'},{title:'Разогрев',desc:'5 мин',secret:'Время.'},{title:'Ритуал',desc:'Музыка',secret:'Павлов.'},{title:'Защита',desc:'Табличка',secret:'23 мин.'},{title:'Отдых',desc:'15 мин',secret:'Умение.'}]},
{id:'motivation',title:'Мотивация',emoji:'🚀',category:'Продуктивность',steps:[{title:'Типы',desc:'Внешняя vs внутренняя',secret:'Внутренняя сильнее.'},{title:'Икигай',desc:'4 сферы',secret:'Японская.'},{title:'Победы',desc:'Малые',secret:'Топливо.'},{title:'Автономия',desc:'Выбирай',secret:'Деси/Райан.'},{title:'Публично',desc:'Расскажи',secret:'Ставка.'},{title:'Идентичность',desc:'"Я —"',secret:'Клир.'}]},
{id:'stress',title:'Стресс',emoji:'⚡',category:'Психика',steps:[{title:'Различить',desc:'Острый/хронический',secret:'Сапольски.'},{title:'Медитация',desc:'5-10 мин',secret:'-25% кортизола.'},{title:'Движение',desc:'30 мин',secret:'Сжигает.'},{title:'Связи',desc:'1 контакт',secret:'Антистресс.'},{title:'Границы',desc:'Уведомления',secret:'Доступность.'},{title:'Природа',desc:'2 ч/нед',secret:'-16%.'}]},
{id:'depression',title:'Депрессия',emoji:'🌑',category:'Психика',steps:[{title:'Признать',desc:'Болезнь',secret:'300 млн.'},{title:'Врач',desc:'Психиатр',secret:'70%.'},{title:'Микро',desc:'Умыться',secret:'Действия.'},{title:'Движение',desc:'Прогулка',secret:'Антидепрессант.'},{title:'Ритм',desc:'Одинаково',secret:'Циркадные.'},{title:'Связи',desc:'Звонок',secret:'Топливо.'},{title:'Терпение',desc:'4-8 недель',secret:'Восстановление.'}]},
{id:'career',title:'Карьера',emoji:'📈',category:'Карьера',steps:[{title:'Направление',desc:'Икигай',secret:'Пересечение.'},{title:'Навыки',desc:'Топ-3',secret:'10000 часов.'},{title:'Портфолио',desc:'Проекты',secret:'Резюме устарело.'},{title:'Нетворк',desc:'10 контактов',secret:'85%.'},{title:'Видимость',desc:'LinkedIn',secret:'Заметность.'},{title:'Переговоры',desc:'Зарплата',secret:'Первое не лучшее.'},{title:'Рост',desc:'3-5 лет',secret:'+20%.'}]},
{id:'selfdiscipline',title:'Дисциплина',emoji:'⚔️',category:'Продуктивность',steps:[{title:'Свобода',desc:'От импульсов',secret:'Йонге.'},{title:'1 привычка',desc:'1-2/мес',secret:'37x.'},{title:'Триггеры',desc:'Привязка',secret:'Stacking.'},{title:'Минимум',desc:'2 отжимания',secret:'Ежедневно.'},{title:'Среда',desc:'Убери соблазны',secret:'Сильнее воли.'},{title:'Ответственность',desc:'Партнёр',secret:'Измеряется.'},{title:'Возврат',desc:'Не дважды',secret:'Правило.'}]},
{id:'confidence',title:'Уверенность',emoji:'🦁',category:'Личное',steps:[{title:'Навык',desc:'Не врождённое',secret:'Бандура.'},{title:'Победы',desc:'Каждый день',secret:'Сумма.'},{title:'Тело',desc:'Осанка',secret:'Кадди.'},{title:'Знания',desc:'Эксперт',secret:'Компетентность.'},{title:'Без сравнения',desc:'С собой',secret:'Воровство.'},{title:'Принятие',desc:'Не идеален',secret:'Уязвимость.'}]},
{id:'meaning',title:'Смысл',emoji:'✨',category:'Психика',steps:[{title:'Кризис',desc:'Этап',secret:'Ялом.'},{title:'Memento',desc:'Смерть',secret:'Стоики.'},{title:'3 источника',desc:'Труд, любовь, страдание',secret:'Франкл.'},{title:'Действие',desc:'Руками',secret:'Сартр.'},{title:'Связь',desc:'С большим',secret:'Трансперсональная.'},{title:'Отпустить',desc:'Путь',secret:'Камю.'},{title:'Практика',desc:'Ежедневно',secret:'Путь.'}]},
{id:'nutrition',title:'Питание',emoji:'🥗',category:'Здоровье',steps:[{title:'Принципы',desc:'Средиземноморская',secret:'-30%.'},{title:'Белок',desc:'1.6 г/кг',secret:'Сытость.'},{title:'Овощи',desc:'500 г',secret:'Микробиом.'},{title:'Жиры',desc:'Оливковое',secret:'Мозг.'},{title:'Сахар',desc:'Минимум',secret:'Усталость.'},{title:'16:8',desc:'Режим',secret:'Аутофагия.'},{title:'Вода',desc:'30 мл/кг',secret:'-20%.'}]},
{id:'english',title:'Английский',emoji:'🇬🇧',category:'Обучение',steps:[{title:'Уровень',desc:'A1-C2',secret:'Старт.'},{title:'1000 слов',desc:'80%',secret:'Anki.'},{title:'Грамматика',desc:'12 времён',secret:'Практика.'},{title:'Слушание',desc:'30 мин/день',secret:'Пассив+актив.'},{title:'Говорение',desc:'15 мин/день',secret:'С 1 дня.'},{title:'Чтение',desc:'20 мин/день',secret:'Словарь.'},{title:'Письмо',desc:'Дневник',secret:'Структура.'},{title:'Практика',desc:'30 мин/день',secret:'Регулярность.'}]},
{id:'screentime',title:'Экранное время',emoji:'📱',category:'Здоровье',steps:[{title:'Замер',desc:'Узнай время',secret:'Осознание 50%.'},{title:'Аудит',desc:'Топ-3',secret:'Удали токсичные.'},{title:'Утро',desc:'30 мин без телефона',secret:'Кортизол.'},{title:'Deep Work',desc:'90 мин',secret:'+40%.'},{title:'Вечер',desc:'2 ч без экрана',secret:'Мелатонин.'},{title:'Детокс',desc:'24 ч',secret:'Перезагрузка.'},{title:'Среда',desc:'Телефон вне спальни',secret:'Зарядка в коридоре.'},{title:'Замена',desc:'Книга, спорт',secret:'Дофамин.'}]},
{id:'memory',title:'Память',emoji:'🧠',category:'Обучение',steps:[{title:'Эббингауз',desc:'Кривая забывания',secret:'1ч, 1д, 3д.'},{title:'Локусы',desc:'Дворец',secret:'Древнегреческий.'},{title:'Мнемоники',desc:'Ассоциации',secret:'Страннее = лучше.'},{title:'Anki',desc:'Интервальное',secret:'20 мин/день.'},{title:'Чанкинг',desc:'Группировка',secret:'7±2.'},{title:'Recall',desc:'Припоминание',secret:'Testing effect.'},{title:'Фейнман',desc:'Объясни',secret:'Проверка.'},{title:'Сон',desc:'Консолидация',secret:'7-9.'},{title:'Двойное',desc:'Слова+образы',secret:'Paivio.'},{title:'Система',desc:'Комбо',secret:'×3-5.'}]},
{id:'critical_thinking',title:'Критическое мышление',emoji:'🔍',category:'Мышление',steps:[{title:'Основа',desc:'Claim → Evidence',secret:'Не верь сразу.'},{title:'Ловушки',desc:'Confirmation bias',secret:'Проверяй.'},{title:'Источники',desc:'Кто говорит?',secret:'Авторитет.'},{title:'Логика',desc:'Валидность',secret:'Формальная.'},{title:'Альтернативы',desc:'А если наоборот?',secret:'Инверсия.'},{title:'Вывод',desc:'Взвешенно',secret:'Не спеши.'}]},
{id:'emotional_intelligence',title:'Эмоциональный интеллект',emoji:'❤️',category:'Психика',steps:[{title:'Осознание',desc:'Назови эмоцию',secret:'Name it to tame it.'},{title:'Регуляция',desc:'Дыхание, пауза',secret:'6 сек.'},{title:'Мотивация',desc:'Внутренняя',secret:'Смысл.'},{title:'Эмпатия',desc:'3 типа',secret:'Когнитивная, эмоц., сострад.'},{title:'Навыки',desc:'SBI, ННО',secret:'Я-сообщения.'},{title:'Границы',desc:'Спокойное нет',secret:'Уважение.'}]},
{id:'productivity_mastery',title:'Мастерство продуктивности',emoji:'⚡',category:'Продуктивность',steps:[{title:'GTD',desc:'Capture-Clarify',secret:'Голова не хранилище.'},{title:'Deep Work',desc:'90 мин',secret:'×3.'},{title:'Pomodoro',desc:'25/5',secret:'4 цикла.'},{title:'Time-block',desc:'Слоты',secret:'Буферы.'},{title:'Eisenhower',desc:'Q1-Q4',secret:'70% Q2.'},{title:'Eat Frog',desc:'Сложное первым',secret:'Утром.'},{title:'Ревью',desc:'Воскресенье',secret:'30 мин.'}]},
{id:'financial_freedom',title:'Финансовая свобода',emoji:'💰',category:'Финансы',steps:[{title:'Учёт',desc:'Каждая трата',secret:'50/30/20.'},{title:'Подушка',desc:'3-6 мес',secret:'Отдельный счёт.'},{title:'Долги',desc:'Лавина',secret:'Высокий %.'},{title:'Инвестиции',desc:'Индексы',secret:'DCA.'},{title:'Доход',desc:'2-й источник',secret:'Фриланс.'},{title:'FIRE',desc:'25× расходов',secret:'4% правило.'},{title:'Защита',desc:'Страховка',secret:'Про жизнь.'}]}
];

/* ============ COURSES (50 реальных с уроками/тестами/видео) ============ */
var COURSES_LIBRARY=[
{id:'productivity_master',title:'Мастер продуктивности',emoji:'⚡',category:'Продуктивность',hours:8,lessons:[
{title:'Введение в продуктивность',content:'80/20. 20% усилий — 80% результата.',practice:'Выпиши 3 задачи, дающие 80%.',quiz:['Что такое принцип Парето?','Как найти 20% важного?']},
{title:'SMART-цели',content:'Specific, Measurable, Achievable, Relevant, Time-bound.',practice:'Поставь 1 SMART-цель.',quiz:['Что значит M в SMART?']},
{title:'Матрица Эйзенхауэра',content:'Q1 делай, Q2 планируй, Q3 делегируй, Q4 удали.',practice:'Разбери 10 задач.',quiz:['Куда отнести «позвонить маме»?']},
{title:'GTD',content:'Capture, Clarify, Organize, Reflect, Engage.',practice:'Inbox 3 дня.',quiz:['Сколько шагов в GTD?']},
{title:'Deep Work',content:'90 минут. Одна задача. 3-4 ч = 10 ч.',practice:'1 блок 90 мин.',quiz:['Сколько часов Deep Work в день?']},
{title:'Pomodoro',content:'25/5. 4 цикла. 30 мин отдых.',practice:'4 помидора.',quiz:['Сколько минут в помидоре?']},
{title:'Управление энергией',content:'90/15. Ультрадианные ритмы.',practice:'Отследи энергию 3 дня.',quiz:['Что важнее — время или энергия?']},
{title:'Привычки',content:'Cue → Craving → Response → Reward. 1% в день = 37x.',practice:'1 привычка на 30 дней.',quiz:['Сколько в 1% в день за год?']},
{title:'Инструменты',content:'Notion, Obsidian, Todoist.',practice:'Настрой 1 инструмент.',quiz:['Что лучше для заметок?']},
{title:'Итог',content:'3 цели, 5 привычек, 1 система.',practice:'Составь план на месяц.',quiz:['Сколько привычек достаточно?']}
]},
{id:'mental_health',title:'Психическое здоровье',emoji:'🧠',category:'Психика',hours:6,lessons:[
{title:'Психика',content:'Функция мозга. Пластичность всю жизнь.',practice:'24 ч наблюдай.',quiz:['Что такое нейропластичность?']},
{title:'Эмоции',content:'7 базовых. 90 секунд. Сигналы.',practice:'Дневник эмоций.',quiz:['Сколько длится эмоция?']},
{title:'Тревога',content:'Дыхание 4-7-8. КПТ.',practice:'4 цикла.',quiz:['Что делать при тревоге?']},
{title:'Депрессия',content:'Болезнь. КПТ 70%. Движение.',practice:'Прогулка.',quiz:['Когда идти к врачу?']},
{title:'КПТ',content:'Мысль → эмоция. Искажения → альтернатива.',practice:'Заполни 1 таблицу.',quiz:['Что такое когнитивное искажение?']},
{title:'ACT',content:'Принятие. Ценности. Действие.',practice:'3 ценности.',quiz:['Что такое когнитивное разделение?']},
{title:'Травма',content:'EMDR. Терапия. Безопасность.',practice:'Найди терапевта.',quiz:['Что такое ПТСР?']},
{title:'Границы',content:'Спокойное «нет». Уважение.',practice:'Скажи «нет» 3 раза.',quiz:['Как сказать «нет» без вины?']},
{title:'Смысл',content:'Франкл. Труд, любовь, страдание.',practice:'Напиши «зачем».',quiz:['3 источника смысла?']},
{title:'Помощь',content:'>2 недель → специалист.',practice:'Запишись.',quiz:['Когда обращаться к специалисту?']}
]},
{id:'health_basics',title:'Основы здоровья',emoji:'⚕️',category:'Здоровье',hours:7,lessons:[
{title:'Сон',content:'7-9 часов. 4 стадии. Циркадные ритмы.',practice:'Режим 7 дней.',quiz:['Сколько часов сна нужно?']},
{title:'Питание',content:'Средиземноморская. Белок 1.6 г/кг. Овощи 500 г.',practice:'Составь меню.',quiz:['Сколько белка на кг веса?']},
{title:'Микроэлементы',content:'D3, Omega-3, магний, цинк.',practice:'Проверь анализы.',quiz:['Зачем D3?']},
{title:'Движение',content:'150 мин кардио + 2 силовые.',practice:'3 тренировки.',quiz:['Сколько кардио в неделю?']},
{title:'Стресс',content:'Сапольски. Кортизол. Хронический стресс.',practice:'3 способа снятия.',quiz:['Что делает кортизол?']},
{title:'Профилактика',content:'Чекап. Анализы. Вакцинация.',practice:'Запишись на чекап.',quiz:['Что проверять ежегодно?']},
{title:'Долголетие',content:'Аттиа. Зона 2. Сила. Белок. Сон.',practice:'Введи 1 привычку.',quiz:['Что такое Zone 2?']},
{title:'Психика=тело',content:'+40% инфаркт при депрессии.',practice:'Медитация 10 мин.',quiz:['Связь психики и тела?']},
{title:'Мифы',content:'Детоксы. Суперфуды. Чудо-таблетки.',practice:'Проверь 3 мифа.',quiz:['Работают ли детоксы?']},
{title:'Скорая',content:'FAST. 103. 112.',practice:'Выучи признаки инсульта.',quiz:['Что означает FAST?']}
]},
{id:'financial_literacy',title:'Финансовая грамотность',emoji:'💰',category:'Финансы',hours:5,lessons:[
{title:'Психология денег',content:'Хаусел. Деньги — эмоции.',practice:'Запиши 3 ошибки.',quiz:['Почему мы тратим импульсивно?']},
{title:'Учёт',content:'50/30/20. Записывай каждую трату.',practice:'30 дней учёта.',quiz:['Что такое 50/30/20?']},
{title:'Подушка',content:'3-6 месяцев. Отдельный счёт.',practice:'Посчитай размер.',quiz:['Зачем подушка?']},
{title:'Долги',content:'Снежный ком. Лавина. Рефинанс.',practice:'Составь план.',quiz:['Что такое лавина?']},
{title:'Инвестиции',content:'Индексные фонды. Долгосрочно. DCA.',practice:'Изучи 3 фонда.',quiz:['Что такое DCA?']},
{title:'Диверсификация',content:'100 - возраст = % акций.',practice:'Распредели портфель.',quiz:['Правило распределения?']},
{title:'Налоги',content:'ИИС. Вычеты. Оптимизация.',practice:'Проверь вычеты.',quiz:['Сколько даёт ИИС?']},
{title:'Доход',content:'Второй источник. Навык. Фриланс.',practice:'Найди идею.',quiz:['Зачем 2-й доход?']},
{title:'Страхование',content:'Защитное. Жизнь, здоровье.',practice:'Проверь полисы.',quiz:['Что страховать обязательно?']},
{title:'Пенсия',content:'Сложный процент. Начни сейчас.',practice:'Посчитай накопления.',quiz:['Как работает сложный процент?']}
]},
{id:'neuroscience',title:'Нейробиология',emoji:'🔬',category:'Здоровье',hours:6,lessons:[
{title:'Структура',content:'86 млрд нейронов. Кора, лимбическая система.',practice:'Схема мозга.',quiz:['За что отвечает миндалина?']},
{title:'Пластичность',content:'Всю жизнь. Fire together, wire together.',practice:'30 дней 1 навык.',quiz:['Правило Хебба?']},
{title:'Дофамин',content:'Мотивация. Предвкушение. Суперстимулы.',practice:'Голодание 4 ч.',quiz:['Что делает дофамин?']},
{title:'Кортизол',content:'Утром высокий. Хронический стресс.',practice:'Дневник стресса.',quiz:['Что убивает кортизол?']},
{title:'Серотонин',content:'Солнце. Триптофан. Настроение.',practice:'10 мин солнца.',quiz:['Как поднять серотонин?']},
{title:'Окситоцин',content:'Связи. Объятия. Доверие.',practice:'Обними близкого.',quiz:['Что выделяется при объятиях?']},
{title:'Сон',content:'Глимфатика. Очистка мозга.',practice:'7-9 часов.',quiz:['Что происходит с мозгом во сне?']},
{title:'Питание',content:'Omega-3. Микробиом. Воспаление.',practice:'Добавь рыбу.',quiz:['Что есть для мозга?']},
{title:'Обучение',content:'Интервалы. Тестирование. Сон.',practice:'Anki 20 карточек.',quiz:['Что усиливает обучение?']},
{title:'Медитация',content:'Lazar. Утолщение коры.',practice:'10 мин.',quiz:['Как медитация меняет мозг?']}
]},
{id:'communication',title:'Коммуникация',emoji:'💬',category:'Общение',hours:5,lessons:[
{title:'Слушание',content:'3 уровня. Парафраз. Эмпатия.',practice:'3 разговора.',quiz:['Сколько уровней слушания?']},
{title:'Я-сообщения',content:'Формула. Примеры.',practice:'3 претензии.',quiz:['Как говорить без «ты»?']},
{title:'ННО',content:'Наблюдение, чувства, потребности, просьба.',practice:'ННО в конфликте.',quiz:['4 шага ННО?']},
{title:'Сложные разговоры',content:'Спокойствие. Пауза. Решение.',practice:'1 сложный разговор.',quiz:['Что делать перед сложным разговором?']},
{title:'Влияние',content:'Чалдини. 6 принципов.',practice:'Применяй 1.',quiz:['6 принципов влияния?']},
{title:'Выступления',content:'Hook. Структура. Репетиция.',practice:'Речь 3 мин.',quiz:['Что такое hook?']},
{title:'Конфликты',content:'Сотрудничество. Ремонт.',practice:'3 конфликта.',quiz:['5 стилей конфликтов?']},
{title:'Обратная связь',content:'SBI. Принятие.',practice:'SBI 3 раза.',quiz:['Что такое SBI?']},
{title:'Переговоры',content:'BATNA. Интересы. Варианты.',practice:'Разыграй.',quiz:['Что такое BATNA?']},
{title:'Этика',content:'24 часа. Уважение.',practice:'Правило 24 ч.',quiz:['Правило этичной коммуникации?']}
]},
{id:'english_course',title:'Английский с нуля',emoji:'🇬🇧',category:'Обучение',hours:12,lessons:[
{title:'Алфавит и звуки',content:'26 букв. 44 звука.',practice:'Произнеси 10 слов.',quiz:['Сколько звуков в английском?']},
{title:'Приветствия',content:'Hello! How are you? Nice to meet you.',practice:'Диалог 5 реплик.',quiz:['Как поздороваться формально?']},
{title:'Числа и время',content:'1-100. Hours. Days.',practice:'Назови время.',quiz:['Как сказать 3:30?']},
{title:'Present Simple',content:'I work. He works. Do you work?',practice:'10 предложений.',quiz:['Когда +s?']},
{title:'Past Simple',content:'I worked. Did you work?',practice:'Что делал вчера.',quiz:['Форма вопроса?']},
{title:'Future',content:'I will work. Going to.',practice:'5 планов.',quiz:['Разница will / going to?']},
{title:'Present Perfect',content:'I have worked. Since/for.',practice:'10 предложений.',quiz:['Когда использовать?']},
{title:'Модальные',content:'Can, must, should, may.',practice:'5 предложений.',quiz:['Разница must / should?']},
{title:'Условные',content:'If I... I would...',practice:'5 условных.',quiz:['3 типа условных?']},
{title:'Фразовые глаголы',content:'Get up, give up, look after.',practice:'10 глаголов.',quiz:['Что такое фразовый глагол?']},
{title:'Идиомы',content:'Break a leg. Piece of cake.',practice:'5 идиом.',quiz:['Что значит Break a leg?']},
{title:'Деловой английский',content:'Emails. Presentations.',practice:'Напиши email.',quiz:['Структура письма?']},
{title:'Академический',content:'Essays. Research.',practice:'Эссе 200 слов.',quiz:['Что такое thesis?']},
{title:'Свободное общение',content:'Debates. Discussions.',practice:'Диалог 5 мин.',quiz:['Как выразить мнение?']}
]},
{id:'recovery_course',title:'Восстановление и отдых',emoji:'🌿',category:'Здоровье',hours:4,lessons:[
{title:'Виды отдыха',content:'7 типов отдыха.',practice:'Определи свой дефицит.',quiz:['Сколько видов отдыха?']},
{title:'Сон',content:'Гигиена сна. Циркадные.',practice:'Режим неделю.',quiz:['Правила гигиены сна?']},
{title:'Медитация',content:'5-20 минут. Виды. Эффекты.',practice:'10 мин.',quiz:['Что даёт медитация?']},
{title:'Природа',content:'2 часа в неделю. -16% кортизол.',practice:'Прогулка в парке.',quiz:['Сколько нужно на природе?']},
{title:'Фильмы и сериалы',content:'Осознанный просмотр. Не более 2 часов.',practice:'1 фильм без телефона.',quiz:['Правила просмотра?']},
{title:'Чтение',content:'20 минут в день.',practice:'20 мин книги.',quiz:['Что читать для мозга?']},
{title:'Музыка',content:'Расслабление. Фокус. Настроение.',practice:'Плейлист для сна.',quiz:['Какая музыка для сна?']},
{title:'Творчество',content:'Рисование, музыка, письмо. Поток.',practice:'30 мин творчества.',quiz:['Что такое поток?']},
{title:'Хобби',content:'Радость. Смысл. Баланс.',practice:'Займись хобби.',quiz:['Зачем хобби?']},
{title:'Цифровой детокс',content:'24 часа без экранов. Раз в неделю.',practice:'1 день детокса.',quiz:['Как провести детокс?']}
]},
{id:'memory_master',title:'Мастер памяти',emoji:'🧠',category:'Обучение',hours:5,lessons:[
{title:'Как работает память',content:'3 типа. Кривая Эббингауза.',practice:'Расписание повторений.',quiz:['Что такое кривая Эббингауза?']},
{title:'Дворец памяти',content:'Метод локусов.',practice:'10 слов в квартире.',quiz:['Что такое метод локусов?']},
{title:'Мнемоники',content:'Акронимы, рифмы, истории.',practice:'10 мнемоник.',quiz:['Что такое акроним?']},
{title:'Интервальное повторение',content:'Anki. 1, 3, 7, 14, 30.',practice:'20 карточек.',quiz:['Что такое SRS?']},
{title:'Чанкинг',content:'7±2. Группировка.',practice:'30 слов в 6 чанков.',quiz:['Сколько элементов в краткосрочной памяти?']},
{title:'Активное припоминание',content:'Testing effect. Recall > Recognition.',practice:'Recall после урока.',quiz:['Что эффективнее — recall или повторное чтение?']},
{title:'Метод Фейнмана',content:'Объясни 12-летнему.',practice:'Объясни 3 темы.',quiz:['4 шага метода Фейнмана?']},
{title:'Сон и память',content:'Консолидация. 7-9 часов.',practice:'Учи перед сном.',quiz:['Когда учить для памяти?']},
{title:'Двойное кодирование',content:'Paivio. Слова + образы.',practice:'Mind map.',quiz:['Что такое dual coding?']},
{title:'Система',content:'Комбинация всех техник.',practice:'Личная система.',quiz:['Что главное в системе?']}
]},
{id:'iq_boost',title:'IQ-тренировки',emoji:'🎯',category:'Обучение',hours:6,lessons:[
{title:'Что такое IQ',content:'Средний 100. σ = 15.',practice:'Пройди тест.',quiz:['Средний IQ?']},
{title:'Логические последовательности',content:'Арифм., геом., Фибоначчи.',practice:'Реши 10.',quiz:['Что такое Фибоначчи?']},
{title:'Аналогии',content:'A:B = C:? Типы связей.',practice:'Реши 10.',quiz:['Что такое аналогия?']},
{title:'Пространственное мышление',content:'Вращение, развёртки.',practice:'Развёртка куба.',quiz:['За что отвечает правое полушарие?']},
{title:'Рабочая память',content:'4±1 чанка. N-back.',practice:'N-back 10 мин.',quiz:['Что такое N-back?']},
{title:'Скорочтение',content:'400-600 слов/мин.',practice:'10 мин с указкой.',quiz:['Средняя скорость чтения?']},
{title:'Критическое мышление',content:'5 вопросов.',practice:'Анализ новости.',quiz:['5 вопросов критики?']},
{title:'Математическое мышление',content:'Ментальная арифметика.',practice:'20 примеров.',quiz:['Как считать 17×23 в уме?']},
{title:'Шахматы',content:'Стратегия. Тактика.',practice:'1 партия.',quiz:['Что такое вилка?']},
{title:'Система',content:'N-back + задачи + партия.',practice:'Расписание.',quiz:['Как тренировать IQ?']}
]},
{id:'eq_course',title:'Эмоциональный интеллект',emoji:'❤️',category:'Психика',hours:5,lessons:[
{title:'Что такое EQ',content:'Гоулман. 5 компонентов.',practice:'Оцени EQ.',quiz:['5 компонентов EQ?']},
{title:'Самосознание',content:'Дневник. Назови эмоцию.',practice:'7 дней дневника.',quiz:['Что такое name it to tame it?']},
{title:'Саморегуляция',content:'Дыхание. Пауза 6 сек.',practice:'Пауза в конфликте.',quiz:['Что делать при гневе?']},
{title:'Эмпатия',content:'3 типа.',practice:'3 разговора.',quiz:['3 типа эмпатии?']},
{title:'Мотивация',content:'Деси/Райан.',practice:'Внутренний смысл.',quiz:['3 базовые потребности?']},
{title:'Социальные навыки',content:'Я-сообщения. SBI. ННО.',practice:'SBI 3 раза.',quiz:['Что такое SBI?']},
{title:'Стресс',content:'Box breathing.',practice:'3 техники.',quiz:['Как успокоиться быстро?']},
{title:'Конфликты',content:'Томас-Килманн. 5 стилей.',practice:'3 конфликта.',quiz:['Лучший стиль конфликта?']},
{title:'Границы',content:'Здоровое «нет».',practice:'3 «нет».',quiz:['Как сказать «нет»?']},
{title:'Система',content:'Дневник + пауза + слушание.',practice:'Расписание.',quiz:['Как развивать EQ?']}
]},
{id:'screentime_course',title:'Цифровой детокс',emoji:'📱',category:'Здоровье',hours:6,lessons:[
{title:'Диагностика',content:'Замер. Аудит. Триггеры.',practice:'Замерь время.',quiz:['Зачем замерять?']},
{title:'Утро',content:'30 мин без телефона.',practice:'Утро без телефона.',quiz:['Почему утро важно?']},
{title:'Deep Work',content:'90 мин авиарежим.',practice:'1 блок.',quiz:['Что даёт Deep Work?']},
{title:'Вечер',content:'2 ч без экрана.',practice:'Вечер без экрана.',quiz:['Зачем вечерний детокс?']},
{title:'Детокс',content:'24 ч в неделю.',practice:'1 день.',quiz:['Сколько длится детокс?']},
{title:'Среда',content:'Телефон вне спальни.',practice:'Ночь без телефона.',quiz:['Где должен быть телефон ночью?']},
{title:'Замены',content:'Книга, спорт, хобби.',practice:'1 замена.',quiz:['Что вместо телефона?']},
{title:'Психология',content:'FOMO. Сравнение. Скука.',practice:'Отпишись от 10.',quiz:['Что такое FOMO?']},
{title:'Инструменты',content:'Forest, Freedom, Screen Time.',practice:'Установи Forest.',quiz:['Что делает Forest?']},
{title:'Система',content:'Привычки + правила + среда.',practice:'Личная система.',quiz:['Что главное в системе?']}
]},
{id:'nutrition_master',title:'Мастер питания',emoji:'🥗',category:'Здоровье',hours:4,lessons:[
{title:'Средиземноморская',content:'Овощи, рыба, оливковое масло.',practice:'Составь меню.',quiz:['Основа диеты?']},
{title:'Белок',content:'1.6 г/кг. Сытость.',practice:'Посчитай норму.',quiz:['Сколько белка?']},
{title:'Овощи',content:'500 г/день. Микробиом.',practice:'500 г овощей.',quiz:['Сколько овощей?']},
{title:'Жиры',content:'Оливковое, орехи, авокадо.',practice:'Замени масло.',quiz:['Какие жиры полезны?']},
{title:'Сахар',content:'Минимум. Усталость.',practice:'Без сахара 1 день.',quiz:['Что делает сахар?']},
{title:'16:8',content:'Интервальное голодание.',practice:'12:12 первый день.',quiz:['Что такое 16:8?']},
{title:'Вода',content:'30 мл/кг.',practice:'8 стаканов.',quiz:['Сколько воды?']},
{title:'Витамины',content:'D3, Omega-3, магний.',practice:'Проверь анализы.',quiz:['Зачем D3?']},
{title:'Ошибки',content:'Детоксы, суперфуды.',practice:'Разбери 3.',quiz:['Работают ли детоксы?']},
{title:'Система',content:'План на неделю.',practice:'Составь план.',quiz:['Что в основе?']}
]},
{id:'fitness_master',title:'Мастер фитнеса',emoji:'🏋️',category:'Здоровье',hours:6,lessons:[
{title:'Зона 2',content:'Кардио 60-70%.',practice:'30 мин.',quiz:['Что такое Zone 2?']},
{title:'HIIT',content:'20/10 × 8.',practice:'1 сессия.',quiz:['Что такое HIIT?']},
{title:'Силовые',content:'Базовые. 4-6 повторов.',practice:'Присед, тяга, жим.',quiz:['Базовые упражнения?']},
{title:'Прогрессия',content:'+5% в неделю.',practice:'Расписание.',quiz:['Что такое прогрессия?']},
{title:'Восстановление',content:'48 ч между тренировками.',practice:'Отдых 1 день.',quiz:['Сколько отдыхать?']},
{title:'Мобильность',content:'10 мин/день.',practice:'Упражнения.',quiz:['Зачем мобильность?']},
{title:'Техника',content:'Присед, тяга.',practice:'Записывай себя.',quiz:['Что важнее техника или вес?']},
{title:'Питание',content:'До/после тренировки.',practice:'План.',quiz:['Что есть до тренировки?']},
{title:'Программа',content:'Push-Pull-Legs.',practice:'Составь.',quiz:['Что такое PPL?']},
{title:'Система',content:'Годовой план.',practice:'Запиши.',quiz:['Что главное?']}
]},
{id:'career_master',title:'Мастер карьеры',emoji:'💼',category:'Карьера',hours:5,lessons:[
{title:'Икигай',content:'4 сферы.',practice:'4 круга.',quiz:['Что такое икигай?']},
{title:'Навыки',content:'Топ-3.',practice:'Выбери 3.',quiz:['Сколько навыков одновременно?']},
{title:'Портфолио',content:'Проекты > резюме.',practice:'3 проекта.',quiz:['Что важнее портфолио или резюме?']},
{title:'Нетворк',content:'10 контактов.',practice:'5 новых.',quiz:['Сколько контактов в месяц?']},
{title:'Видимость',content:'LinkedIn, Twitter.',practice:'1 пост.',quiz:['Зачем публиковать?']},
{title:'Переговоры',content:'Зарплата. Первое не лучшее.',practice:'Собери победы.',quiz:['Что делать на переговорах?']},
{title:'Менторство',content:'Найди ментора.',practice:'Подойди к 1.',quiz:['Зачем ментор?']},
{title:'Год',content:'План роста.',practice:'Запиши.',quiz:['Что главное?']},
{title:'5 лет',content:'Где через 5 лет?',practice:'Запиши.',quiz:['Как планировать?']},
{title:'Система',content:'Ревью квартала.',practice:'Календарь.',quiz:['Как часто ревью?']}
]},
{id:'leadership_course',title:'Лидерство',emoji:'👑',category:'Карьера',hours:5,lessons:[
{title:'Level 5',content:'Скромность + воля.',practice:'Оцени себя.',quiz:['Что такое Level 5?']},
{title:'Видение',content:'WHY.',practice:'Напиши WHY.',quiz:['Что такое WHY?']},
{title:'Развитие',content:'1 человек.',practice:'Развивай.',quiz:['Что развивать?']},
{title:'Делегирование',content:'Делай через других.',practice:'Делегируй 3.',quiz:['Что делегировать?']},
{title:'Обратная связь',content:'SBI.',practice:'SBI 3 раза.',quiz:['Что такое SBI?']},
{title:'Защита',content:'Защищай команду.',practice:'Найди 1.',quiz:['Что главное?']},
{title:'1-на-1',content:'Ежемесячно.',practice:'Проведи.',quiz:['Как часто 1-на-1?']},
{title:'Служение',content:'Servant leadership.',practice:'Помоги.',quiz:['Что такое servant?']},
{title:'Кризис',content:'Спокойствие.',practice:'План.',quiz:['Что в кризисе?']},
{title:'Система',content:'Ревью.',practice:'Календарь.',quiz:['Как развивать?']}
]},
{id:'sleep_master',title:'Мастер сна',emoji:'😴',category:'Здоровье',hours:3,lessons:[
{title:'Циклы',content:'90 мин. 4-6 стадий.',practice:'Замерь.',quiz:['Сколько циклов в ночи?']},
{title:'Мелатонин',content:'Свет. Экран.',practice:'2 часа без экрана.',quiz:['Что подавляет мелатонин?']},
{title:'Спальня',content:'18-20°C. Темно. Тихо.',practice:'Проверь.',quiz:['Температура спальни?']},
{title:'Кофеин',content:'До 14:00.',practice:'Не пей после 14.',quiz:['Когда кофе?']},
{title:'Еда',content:'3 часа до сна.',practice:'Ранний ужин.',quiz:['Когда ужин?']},
{title:'Алкоголь',content:'Разрушает сон.',practice:'Откажись.',quiz:['Как алкоголь влияет?']},
{title:'Спорт',content:'4-5 часов до сна.',practice:'Утренняя тренировка.',quiz:['Когда спорт для сна?']},
{title:'Ритуал',content:'30 мин перед сном.',practice:'План.',quiz:['Что в ритуале?']},
{title:'Не спится',content:'Встань.',practice:'Правило 20 мин.',quiz:['Что делать, если не спится?']},
{title:'Система',content:'30 дней.',practice:'Дневник.',quiz:['Что главное?']}
]},
{id:'environment_design',title:'Дизайн среды',emoji:'🏠',category:'Личное',hours:3,lessons:[
{title:'Порядок',content:'Порядок = ясность.',practice:'Уборка 1 час.',quiz:['Что даёт порядок?']},
{title:'Свет',content:'Утром яркий, вечером тёплый.',practice:'Лампы.',quiz:['Что утром?']},
{title:'Тишина',content:'Наушники, шторы, ковры.',practice:'Проверь.',quiz:['Как сделать тихо?']},
{title:'Эргономика',content:'Стол, стул, монитор.',practice:'Проверь.',quiz:['Как поставить монитор?']},
{title:'Растения',content:'Зелень улучшает воздух.',practice:'Купи 3.',quiz:['Зачем растения?']},
{title:'Запахи',content:'Ароматы для фокуса.',practice:'Попробуй.',quiz:['Какой аромат для фокуса?']},
{title:'Соблазны',content:'Убери телефон.',practice:'В ящик.',quiz:['Где хранить телефон?']},
{title:'Инструменты',content:'1 задача — 1 место.',practice:'Организуй.',quiz:['Что где лежит?']},
{title:'Минимализм',content:'Меньше — больше.',practice:'Выброси 10.',quiz:['Что оставить?']},
{title:'Система',content:'Ежедневно 10 мин.',practice:'Привычка.',quiz:['Как поддерживать?']}
]},
{id:'reading_master',title:'Мастер чтения',emoji:'📚',category:'Обучение',hours:4,lessons:[
{title:'Скорочтение',content:'400-600 слов/мин.',practice:'10 мин.',quiz:['Средняя скорость?']},
{title:'Активное чтение',content:'Заметки, вопросы.',practice:'20 стр.',quiz:['Что важнее чтения?']},
{title:'Skim/Scan',content:'Общее vs точное.',practice:'2 статьи.',quiz:['Что такое skim?']},
{title:'Книги для развития',content:'10 книг.',practice:'Выбери 1.',quiz:['Какую книгу начать?']},
{title:'Конспекты',content:'Cornell.',practice:'1 конспект.',quiz:['Что такое Cornell?']},
{title:'Mind map',content:'Визуальная схема.',practice:'Нарисуй.',quiz:['Как делать mind map?']},
{title:'Художественная',content:'20 мин/день.',practice:'Начни.',quiz:['Зачем художка?']},
{title:'Практика',content:'Применяй сразу.',practice:'1 действие.',quiz:['Что главное?']},
{title:'Ревью',content:'Раз в месяц.',practice:'Перечитай.',quiz:['Зачем перечитывать?']},
{title:'Система',content:'Книга в месяц.',practice:'План.',quiz:['Сколько в год?']}
]},
{id:'career_interview',title:'Собеседования',emoji:'🎤',category:'Карьера',hours:3,lessons:[
{title:'Типы',content:'Поведенческие, кейсы.',practice:'Определи.',quiz:['Что такое behavioral?']},
{title:'STAR',content:'Situation, Task, Action, Result.',practice:'5 историй.',quiz:['Что такое STAR?']},
{title:'Резюме',content:'1 страница.',practice:'Обнови.',quiz:['Сколько страниц?']},
{title:'Самопрезентация',content:'2 минуты.',practice:'Запиши себя.',quiz:['Как рассказывать о себе?']},
{title:'Слабые',content:'Честно + рост.',practice:'3 примера.',quiz:['Как отвечать про слабости?']},
{title:'Вопросы',content:'Готовь 5.',practice:'Запиши.',quiz:['Зачем вопросы?']},
{title:'Компания',content:'Изучи.',practice:'30 мин research.',quiz:['Что искать?']},
{title:'Зарплата',content:'Обсуждай в конце.',practice:'Практика.',quiz:['Когда обсуждать?']},
{title:'Письмо',content:'Follow-up.',practice:'Напиши.',quiz:['Зачем follow-up?']},
{title:'Система',content:'5 интервью.',practice:'План.',quiz:['Что главное?']}
]},
{id:'meaning_course',title:'Поиск смысла',emoji:'✨',category:'Психика',hours:5,lessons:[
{title:'Экзистенциальный кризис',content:'Норма.',practice:'Запиши.',quiz:['Что такое кризис?']},
{title:'Memento mori',content:'Смерть.',practice:'Эпитафия.',quiz:['Зачем помнить смерть?']},
{title:'Икигай',content:'4 сферы.',practice:'4 круга.',quiz:['4 сферы?']},
{title:'Логотерапия',content:'Франкл.',practice:'Зачем.',quiz:['3 источника смысла?']},
{title:'Стоицизм',content:'Дихотомия.',practice:'Вечером.',quiz:['Что в моей власти?']},
{title:'Ценности',content:'5 главных.',practice:'Выпиши.',quiz:['Сколько ценностей?']},
{title:'Действие',content:'Сартр.',practice:'1 шаг.',quiz:['Кто создаёт смысл?']},
{title:'Связь',content:'С большим.',practice:'Найди.',quiz:['Что такое трансцендентное?']},
{title:'Практика',content:'Ежедневно.',practice:'Ритуал.',quiz:['Что главное?']},
{title:'Наследие',content:'Что оставишь?',practice:'3 вещи.',quiz:['Какой след?']}
]},
{id:'stress_management',title:'Управление стрессом',emoji:'⚡',category:'Психика',hours:4,lessons:[
{title:'Различить',content:'Острый vs хронический.',practice:'Дневник.',quiz:['Что такое хронический?']},
{title:'Сапольски',content:'Почему зебры не болеют.',practice:'Пойми.',quiz:['Что делает кортизол?']},
{title:'Дыхание',content:'4-7-8, box.',practice:'3 техники.',quiz:['Как дышать при стрессе?']},
{title:'Медитация',content:'5-10 мин.',practice:'10 мин.',quiz:['Как медитировать?']},
{title:'Спорт',content:'30 мин.',practice:'Прогулка.',quiz:['Зачем спорт?']},
{title:'Природа',content:'2 ч/нед.',practice:'В парк.',quiz:['Сколько на природе?']},
{title:'Связи',content:'1 контакт.',practice:'Позвони.',quiz:['Зачем связи?']},
{title:'Границы',content:'Уведомления выкл.',practice:'Отключи.',quiz:['Что отключить?']},
{title:'Сон',content:'7-9 ч.',practice:'Режим.',quiz:['Сколько сна?']},
{title:'Система',content:'Личная.',practice:'Напиши.',quiz:['Что главное?']}
]},
{id:'confidence_master',title:'Уверенность',emoji:'🦁',category:'Личное',hours:3,lessons:[
{title:'Навык',content:'Не врождённое.',practice:'Бандура.',quiz:['Что такое self-efficacy?']},
{title:'Победы',content:'Каждый день.',practice:'3 победы.',quiz:['Что писать?']},
{title:'Тело',content:'Осанка.',practice:'Спи прямо.',quiz:['Что делает поза?']},
{title:'Знания',content:'Эксперт.',practice:'20 часов.',quiz:['Как стать экспертом?']},
{title:'Без сравнения',content:'С собой.',practice:'Сравни.',quiz:['Зачем?']},
{title:'Принятие',content:'Не идеален.',practice:'Ошибку.',quiz:['Что такое уязвимость?']},
{title:'Публично',content:'Выступай.',practice:'3 мин.',quiz:['Зачем выступать?']},
{title:'Отказ',content:'Учись.',practice:'3 раза.',quiz:['Как относиться к отказу?']},
{title:'Риск',content:'Действуй.',practice:'1 риск.',quiz:['Что такое зона роста?']},
{title:'Система',content:'Ежедневно.',practice:'Ритуал.',quiz:['Что главное?']}
]},
{id:'environment_design',title:'Среда для жизни',emoji:'🏠',category:'Личное',hours:3,lessons:[
{title:'Принцип',content:'Среда > воля.',practice:'Убери 3.',quiz:['Что сильнее?']},
{title:'Стол',content:'Только нужное.',practice:'Очисти.',quiz:['Что на столе?']},
{title:'Кровать',content:'Только сон.',practice:'Правило.',quiz:['Что нельзя?']},
{title:'Кухня',content:'Здоровое на видном.',practice:'Разложи.',quiz:['Что видно?']},
{title:'Ванная',content:'Минимум.',practice:'Убери.',quiz:['Что лишнее?']},
{title:'Одежда',content:'Капсула.',practice:'Разбери.',quiz:['Что носить?']},
{title:'Цифра',content:'Телефон в ящик.',practice:'Правило.',quiz:['Где телефон?']},
{title:'Свет',content:'Яркий утром.',practice:'Проверь.',quiz:['Зачем свет?']},
{title:'Растения',content:'3 в комнате.',practice:'Купи.',quiz:['Зачем зелень?']},
{title:'Система',content:'10 мин/день.',practice:'Ритуал.',quiz:['Что главное?']}
]},
{id:'adaptation_master',title:'Мастер адаптации',emoji:'🔄',category:'Личное',hours:4,lessons:[
{title:'Принцип',content:'Изменения — норма.',practice:'Анализ.',quiz:['Что такое адаптация?']},
{title:'Гибкость',content:'Не ломаться.',practice:'3 сценария.',quiz:['Что такое гибкость?']},
{title:'Планы Б',content:'Всегда есть.',practice:'Сделай.',quiz:['Зачем план Б?']},
{title:'Ошибки',content:'Учись.',practice:'3 ошибки.',quiz:['Что делать с ошибками?']},
{title:'Обратная связь',content:'Бери.',practice:'3 запроса.',quiz:['Зачем обратная связь?']},
{title:'Приоритеты',content:'Меняй.',practice:'Ревью.',quiz:['Как менять?']},
{title:'Тайм-аут',content:'Бери.',practice:'1 день.',quiz:['Зачем пауза?']},
{title:'Помощь',content:'Проси.',practice:'1 раз.',quiz:['Что такое уязвимость?']},
{title:'Ресурсы',content:'Найди.',practice:'3.',quiz:['Что помогает?']},
{title:'Система',content:'Живая.',practice:'Обновляй.',quiz:['Что главное?']}
]}
];

/* ============ LEARNING_LEVELS (5) ============ */
var LEARNING_LEVELS=[
{id:'l1',num:1,title:'Фундамент',subtitle:'Новичок',emoji:'🌱',desc:'Психика, тело, время.',modules:[
{id:'l1m1',title:'Основы психики',emoji:'🧠',desc:'Как работает мозг',lessons:[
{title:'Что такое психика',theory:'Психика — функция мозга.\n\n**3 уровня:** сознание, подсознание, бессознательное.',practice:'24 часа наблюдай.',reflection:'Что автоматическое?'},
{title:'Эмоции',theory:'Эмоция длится **90 сек**.',practice:'Дневник эмоций.',reflection:'Что подавляешь?'},
{title:'Искажения',theory:'95% решений эмоциональны.',practice:'Поймай 3.',reflection:'Какое чаще?'},
{title:'Тревога',theory:'Дыхание 4-7-8.',practice:'4 цикла.',reflection:'Что запускает?'}]},
{id:'l1m2',title:'Основы тела',emoji:'💪',desc:'Сон, питание, движение',lessons:[
{title:'Сон',theory:'4 стадии, 7-9 ч.',practice:'Режим неделю.',reflection:'Что мешает?'},
{title:'Питание',theory:'Средиземноморская.',practice:'3 дня записи.',reflection:'Что даёт энергию?'},
{title:'Движение',theory:'150 мин кардио.',practice:'15-мин прогулка.',reflection:'Что в радость?'},
{title:'Стресс',theory:'Сапольски.',practice:'3 способа.',reflection:'Что успокаивает?'}]},
{id:'l1m3',title:'Основы времени',emoji:'⏰',desc:'Время',lessons:[
{title:'Энергия',theory:'Энергия важнее времени.',practice:'4 энергии 1-10.',reflection:'Где провал?'},
{title:'Приоритеты',theory:'Q1-Q4.',practice:'10 задач.',reflection:'Почему в Q1?'},
{title:'Pomodoro',theory:'25/5.',practice:'4 помидора.',reflection:'Комфортно?'}]}]},
{id:'l2',num:2,title:'База',subtitle:'Ученик',emoji:'📚',desc:'Эмоции, привычки, энергия.',modules:[
{id:'l2m1',title:'Эмоции',emoji:'🌊',desc:'Саморегуляция',lessons:[
{title:'Дневник',theory:'Назови — снизишь на 30%.',practice:'7 дней.',reflection:'Паттерн?'},
{title:'ACT',theory:'"Я замечаю мысль, что..."',practice:'Неделю.',reflection:'Что подавляешь?'},
{title:'Гнев',theory:'Пауза 6 сек.',practice:'Практикуй.',reflection:'Триггер?'},
{title:'Депрессия',theory:'>2 недель → врач.',practice:'Запишись.',reflection:'Что мешает?'}]},
{id:'l2m2',title:'Привычки',emoji:'🔄',desc:'Изменения',lessons:[
{title:'Петля',theory:'Cue → Reward.',practice:'1 привычка.',reflection:'Какая?'},
{title:'Stacking',theory:'После [старая] — [новая].',practice:'3 привязки.',reflection:'Что авто?'},
{title:'Минимум',theory:'2 отжимания.',practice:'Мини-версия.',reflection:'Что мешает?'},
{title:'Возврат',theory:'Не пропускай дважды.',practice:'План.',reflection:'Что останавливает?'}]},
{id:'l2m3',title:'Энергия',emoji:'🔋',desc:'Восстановление',lessons:[
{title:'Аудит',theory:'Что даёт/забирает?',practice:'Неделю.',reflection:'Что забирает?'},
{title:'Ультрадианные',theory:'90/15.',practice:'Блоки.',reflection:'Как отдыхаешь?'},
{title:'Микро',theory:'Каждый час 2 мин.',practice:'Каждый час.',reflection:'Что чувствуешь?'}]}]},
{id:'l3',num:3,title:'Практика',subtitle:'Практик',emoji:'🎯',desc:'Продуктивность, отношения, финансы.',modules:[
{id:'l3m1',title:'Продуктивность',emoji:'⚡',desc:'Система',lessons:[
{title:'GTD',theory:'5 шагов.',practice:'Inbox 3 дня.',reflection:'Что отвлекает?'},
{title:'Deep Work',theory:'3-4 ч.',practice:'90 мин.',reflection:'Что отвлекает?'},
{title:'SMART',theory:'5 критериев.',practice:'Цель.',reflection:'Что не достиг?'},
{title:'Планирование',theory:'Воскресенье.',practice:'Ревью.',reflection:'Что изменить?'}]},
{id:'l3m2',title:'Отношения',emoji:'💞',desc:'Глубина',lessons:[
{title:'Слушание',theory:'3 уровня.',practice:'Парафраз ×3.',reflection:'Слушаешь?'},
{title:'Я-сообщения',theory:'Формула.',practice:'3 претензии.',reflection:'Что говоришь?'},
{title:'Границы',theory:'"Не могу X, но могу Y".',practice:'Потренируйся.',reflection:'Где сложно?'},
{title:'Ремонт',theory:'Скорость.',practice:'Ссора.',reflection:'Как ведёшь?'}]},
{id:'l3m3',title:'Финансы',emoji:'💰',desc:'Бюджет',lessons:[
{title:'Учёт',theory:'50/30/20.',practice:'7 дней.',reflection:'Удивило?'},
{title:'Подушка',theory:'3-6 мес.',practice:'Посчитай.',reflection:'Сколько есть?'},
{title:'Долги',theory:'Снежный ком.',practice:'Список.',reflection:'Что тревожит?'},
{title:'Инвестиции',theory:'Индексы.',practice:'Изучи 2.',reflection:'Что останавливает?'}]}]},
{id:'l4',num:4,title:'Мастерство',subtitle:'Мастер',emoji:'👑',desc:'Смысл, лидерство.',modules:[
{id:'l4m1',title:'Смысл',emoji:'🎯',desc:'Что важно',lessons:[
{title:'Икигай',theory:'4 сферы.',practice:'4 круга.',reflection:'Зачем?'},
{title:'Логотерапия',theory:'3 источника.',practice:'Ответь.',reflection:'Ради чего?'},
{title:'Стоицизм',theory:'Дихотомия.',practice:'Вечером.',reflection:'О чём тревожишься?'}]},
{id:'l4m2',title:'Лидерство',emoji:'👥',desc:'Вести',lessons:[
{title:'Видение',theory:'WHY.',practice:'WHY.',reflection:'Почему за тобой?'},
{title:'Развитие',theory:'Level 5.',practice:'1 человек.',reflection:'Делегируешь?'},
{title:'Обратная',theory:'SBI.',practice:'Дай SBI.',reflection:'Как реагируешь?'}]},
{id:'l4m3',title:'Глубина',emoji:'🧘',desc:'Практики',lessons:[
{title:'Медитация',theory:'8 недель.',practice:'5 мин.',reflection:'Что чувствуешь?'},
{title:'Осознанность',theory:'В жизни.',practice:'1 приём.',reflection:'Авто?'},
{title:'Тень',theory:'Юнг.',practice:'3 раздражения.',reflection:'Что отвергаешь?'}]}]},
{id:'l5',num:5,title:'Трансформация',subtitle:'Наставник',emoji:'🌟',desc:'Интеграция.',modules:[
{id:'l5m1',title:'Интеграция',emoji:'🔗',desc:'Соединить',lessons:[
{title:'Система',theory:'Утро/день/вечер.',practice:'День.',reflection:'Что используешь?'},
{title:'Гибкость',theory:'Карта.',practice:'Что подправить?',reflection:'Как реагируешь?'},
{title:'Отпускание',theory:'Откажись.',practice:'Что не служит?',reflection:'Что держишь?'}]},
{id:'l5m2',title:'Передача',emoji:'📖',desc:'Учить',lessons:[
{title:'Менторство',theory:'Вопросы.',practice:'Помоги 1.',reflection:'Кто твой?'},
{title:'Выступления',theory:'Hook.',practice:'3 мин.',reflection:'О чём говоришь?'},
{title:'Писать',theory:'Как 12-летнему.',practice:'500 слов.',reflection:'Что передать?'}]},
{id:'l5m3',title:'Философия',emoji:'🏛',desc:'Что понял',lessons:[
{title:'Ценности',theory:'5 главных.',practice:'Выпиши.',reflection:'Что важно?'},
{title:'Практическая',theory:'Образ жизни.',practice:'10 строк.',reflection:'Что выбираешь?'},
{title:'Наследие',theory:'Memento.',practice:'3 вещи.',reflection:'Ради чего?'}]}]}
];

/* ============ ENGLISH_LEVELS ============ */
var ENGLISH_LEVELS=[
{id:'eng_a1',title:'Beginner (A1)',emoji:'🟢',desc:'Основы',lessons:[
{title:'Приветствия',content:'Hello! Hi! Good morning!',practice:'Поздоровайся с 3 людьми.'},
{title:'Числа 1-100',content:'One, two, three...',practice:'Посчитай от 1 до 20.'},
{title:'Цвета',content:'Red, blue, green...',practice:'Назови 5 цветов.'},
{title:'Семья',content:'Mother, father, sister...',practice:'Расскажи о семье.'},
{title:'Еда',content:'Bread, milk, water...',practice:'Назови 5 продуктов.'},
{title:'To be',content:'I am... You are...',practice:'5 предложений о себе.'}]},
{id:'eng_a2',title:'Elementary (A2)',emoji:'🟡',desc:'Базовое',lessons:[
{title:'Present Simple',content:'I work. He works.',practice:'10 предложений.'},
{title:'Past Simple',content:'I worked.',practice:'Что делал вчера.'},
{title:'Future Simple',content:'I will work.',practice:'5 планов.'},
{title:'Continuous',content:'I am working.',practice:'Что сейчас.'},
{title:'Модальные',content:'Can, must, should.',practice:'5 предложений.'},
{title:'Вопросы',content:'What? Where? Why?',practice:'10 вопросов.'}]},
{id:'eng_b1',title:'Intermediate (B1)',emoji:'🟠',desc:'Уверенное',lessons:[
{title:'Present Perfect',content:'I have worked.',practice:'10 о опыте.'},
{title:'Условные',content:'If I had money...',practice:'5 условных.'},
{title:'Пассив',content:'The book is written.',practice:'5 в пассив.'},
{title:'Фразовые',content:'Get up, give up...',practice:'10 глаголов.'},
{title:'Идиомы',content:'Break a leg!',practice:'5 идиом.'},
{title:'Артикли',content:'A, an, the.',practice:'10 предложений.'}]},
{id:'eng_b2',title:'Upper-Intermediate (B2)',emoji:'🔵',desc:'Свободное',lessons:[
{title:'Subjunctive',content:'I wish I knew.',practice:'5 предложений.'},
{title:'Инверсия',content:'Never have I seen.',practice:'5 инверсий.'},
{title:'Сложные времена',content:'Past Perfect Continuous.',practice:'10 предложений.'},
{title:'Словообразование',content:'-tion, -ment, -ness.',practice:'20 слов.'},
{title:'Деловой',content:'Emails, presentations.',practice:'Письмо.'},
{title:'Академический',content:'Essay structure.',practice:'Эссе 200 слов.'}]},
{id:'eng_c1',title:'Advanced (C1)',emoji:'🟣',desc:'Продвинутый',lessons:[
{title:'Нюансы',content:'Nuances, connotations.',practice:'Анализ.'},
{title:'Стилистика',content:'Formal, informal.',practice:'3 стиля.'},
{title:'Дискурс',content:'Cohesion, coherence.',practice:'Статья.'},
{title:'Литературный',content:'Metaphors, similes.',practice:'Рассказ.'},
{title:'Дебаты',content:'Argumentation.',practice:'Аргументы.'},
{title:'Культура',content:'British vs American.',practice:'Сравни.'}]}
];

/* ============ ENTERTAINMENT_LIBRARY ============ */
var ENTERTAINMENT_LIBRARY=[
{id:'movies',emoji:'🎬',name:'Фильмы',desc:'20 лучших',tips:'Не более 2 часов.',count:20},
{id:'series',emoji:'📺',name:'Сериалы',desc:'20 культовых',tips:'1-2 серии.',count:20},
{id:'books',emoji:'📚',name:'Книги',desc:'20 книг',tips:'20 мин/день.',count:20},
{id:'music',emoji:'🎵',name:'Музыка',desc:'10 плейлистов',tips:'Расслабление.',count:10},
{id:'games',emoji:'🎮',name:'Игры',desc:'12 игр',tips:'Не более 1 часа.',count:12},
{id:'podcasts',emoji:'🎧',name:'Подкасты',desc:'10 подкастов',tips:'В дороге.',count:10},
{id:'theater',emoji:'🎭',name:'Театр',desc:'8 пьес',tips:'Раз в месяц.',count:8},
{id:'art',emoji:'🎨',name:'Искусство',desc:'10 шедевров',tips:'Раз в месяц.',count:10}
];

/* ============ ACHIEVEMENTS (60) с прогрессом ============ */
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
{id:'english_master',icon:'🎓',name:'English Master',tier:'epic',check:function(s){return s.englishProgress&&Object.keys(s.englishProgress).length>=50},progress:function(s){return Math.min(1,Object.keys(s.englishProgress||{}).length/50)},goal:50},
{id:'english_legend',icon:'🏆',name:'English Legend',tier:'legendary',check:function(s){return s.englishProgress&&Object.keys(s.englishProgress).length>=125},progress:function(s){return Math.min(1,Object.keys(s.englishProgress||{}).length/125)},goal:125},
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
{id:'skill_legend',icon:'👑',name:'Все навыки',tier:'legendary',check:function(s){return Object.keys(s.skillsProgress||{}).length>=(window.__SKILLS_LIBRARY?window.__SKILLS_LIBRARY.length:150)},progress:function(s){return Math.min(1,Object.keys(s.skillsProgress||{}).length/(window.__SKILLS_LIBRARY?window.__SKILLS_LIBRARY.length:150))},goal:150},
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

/* ============ METHODS ============ */
var METHODS_LIBRARY=[
{id:'cbt',title:'КПТ',emoji:'🧠',category:'Терапевтические',desc:'Когнитивно-поведенческая',steps:['Запиши ситуацию','Автоматическую мысль','Доказательства','Альтернатива','Проверь'],base:'Аарон Бек'},
{id:'act',title:'ACT',emoji:'🎭',category:'Терапевтические',desc:'Принятие и ответственность',steps:['Прими','Разделись','В настоящее','Ценности','Действуй'],base:'Стивен Хейс'},
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
{id:'cold_exposure',title:'Холод',emoji:'🥶',category:'Тело',desc:'Холодный душ',steps:['30 сек','2 мин','Дыхание'],base:'Хоф'},
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

/* ============ PERSONAS ============ */
var PERSONAS={
coach:{name:'Коуч',color:'coach',label:'Продуктивность 80 лет',emoji:'💬',prompt:'Ты — AI-Коуч с 80-летним опытом. GROW, SMART, Deep Work, Икигай. 150-220 слов.'},
psych:{name:'Психолог',color:'psych',label:'Клинический 80 лет',emoji:'🧠',prompt:'Ты — AI-Психолог. КПТ, ACT, DBT. НЕ ставь диагнозы! Кризис → 8-800-2000-122. 150-220 слов.'},
doctor:{name:'Врач',color:'doctor',label:'Медицина 80 лет',emoji:'⚕️',prompt:'Ты — AI-Врач. НЕ ставь диагнозы. ВСЕГДА дисклеймер. Острые → 103/112. 150-250 слов.'},
nutrition:{name:'Нутрициолог',color:'nutrition',label:'Питание 80 лет',emoji:'🥗',prompt:'Ты — AI-Нутрициолог. 150-200 слов.'},
fitness:{name:'Тренер',color:'fitness',label:'Фитнес 80 лет',emoji:'🏋️',prompt:'Ты — AI-Фитнес-тренер. 150-200 слов.'},
lawyer:{name:'Юрист',color:'lawyer',label:'Право 80 лет',emoji:'⚖️',prompt:'Ты — AI-Юрист. 150-200 слов.'},
finance:{name:'Финансист',color:'finance',label:'Финансы 80 лет',emoji:'💰',prompt:'Ты — AI-Финансовый консультант. 150-200 слов.'}
};

/* ============ TABS ============ */
var TABS=[
{id:'dashboard',emoji:'🏠',label:'Главная'},
{id:'tasks',emoji:'✅',label:'Задачи'},
{id:'learning',emoji:'🎓',label:'Обучение'},
{id:'english',emoji:'🇬🇧',label:'English'},
{id:'entertainment',emoji:'🎬',label:'Досуг'},
{id:'ai',emoji:'✨',label:'AI'},
{id:'health',emoji:'❤️',label:'Здоровье'},
{id:'more',emoji:'⋯',label:'Ещё'}
];

/* ============ TEMPLATES ============ */
var HABITS_TEMPLATES=[
{id:'water',title:'Выпить 8 стаканов воды',icon:'💧',category:'Здоровье'},
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

/* ============ GLOBALS ============ */
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

window.__DATA_READY=true;
window.STORAGE_KEY=STORAGE_KEY;
window.defaultState=defaultState;
window.THEMES=THEMES;
window.DOMAINS=DOMAINS;
window.SURVEY_QUESTIONS=SURVEY_QUESTIONS;
window.PATHS_LIBRARY=PATHS_LIBRARY;
window.COURSES_LIBRARY=COURSES_LIBRARY;
window.LEARNING_LEVELS=LEARNING_LEVELS;
window.ENGLISH_LEVELS=ENGLISH_LEVELS;
window.ENTERTAINMENT_LIBRARY=ENTERTAINMENT_LIBRARY;
window.ACHIEVEMENTS=ACHIEVEMENTS;
window.METHODS_LIBRARY=METHODS_LIBRARY;
window.PERSONAS=PERSONAS;
window.TABS=TABS;
window.HABITS_TEMPLATES=HABITS_TEMPLATES;
window.GOALS_TEMPLATES=GOALS_TEMPLATES;
window.DAILY_WISDOMS=DAILY_WISDOMS;
window.getTodayWisdom=getTodayWisdom;
window.DAILY_CHALLENGES=DAILY_CHALLENGES;
window.getTodayChallenges=getTodayChallenges;
window.WORK_MODES=WORK_MODES;
window.checkLevelComplete=checkLevelComplete;
window.levelProgress=levelProgress;
window.checkAchievements=checkAchievements;
window.save=save;
window.state=state;