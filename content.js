'use strict';
/* AI HEALTH v33 — CONTENT (ядро: темы, домены, мудрости, челленджи, режимы, survey, курсы, уровни, achievements, methods, personas, TABS, QUICK_TABS, шаблоны) */

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
{id:'pumpkin',emoji:'🎃',name:'Тыква',color:'#0d0500',effects:'heavyfog'},
{id:'vampire',emoji:'🦇',name:'Вампир',color:'#0a0000',effects:'vampire'},
{id:'ghost',emoji:'👻',name:'Призрак',color:'#0a0814',effects:'ghost'},
{id:'web',emoji:'🕸',name:'Паутина',color:'#001410',effects:'web'},
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
learning:'Уровни 1-5 + 15 навыков Здоровья + Модуль Нейро + Курсы: health_basics, fitness_master, nutrition_master, sleep_master'},
{id:'mental',emoji:'🧠',name:'Ментальное',color:'#4dd4ff',desc:'Фокус, память, ясность',
metrics:[{id:'focusMin',label:'Deep Work (мин)',target:'180'},{id:'meditation',label:'Медитаций/нед',target:'7'},{id:'reading',label:'Страниц/день',target:'20'},{id:'memory',label:'Память 1-10',target:'7+'},{id:'iq',label:'IQ-задач/день',target:'5'}],
learning:'Модуль Память + Модуль IQ + 18 навыков Когнитивных + Курсы: memory_master, iq_boost, productivity_master'},
{id:'emotional',emoji:'❤️',name:'Эмоциональное',color:'#ff6b6b',desc:'Чувства, стресс',
metrics:[{id:'mood',label:'Настроение 1-10',target:'7+'},{id:'stress',label:'Стресс 1-10',target:'<5'},{id:'anxiety',label:'Тревога 1-10',target:'<4'},{id:'journal',label:'Записей/нед',target:'3'}],
learning:'Модуль EQ + 12 навыков Эмоциональных + Курсы: mental_health, eq_course, stress_management'},
{id:'spiritual',emoji:'🕊',name:'Духовное',color:'#b394ff',desc:'Смысл, ценности',
metrics:[{id:'gratitude',label:'Благодарностей/день',target:'3'},{id:'meaning',label:'Смысл 1-10',target:'7+'},{id:'nature',label:'На природе (мин/нед)',target:'120'}],
learning:'Уровни 4-5 + 5 навыков Духовных + Курсы: meaning_course, stoicism_course'},
{id:'financial',emoji:'💰',name:'Финансовое',color:'#ffcc4d',desc:'Бюджет, инвестиции',
metrics:[{id:'savings',label:'Сбережений %',target:'20%+'},{id:'runway',label:'Runway (мес)',target:'6+'},{id:'debt',label:'Долговая нагрузка %',target:'<30%'}],
learning:'Модуль Финансы + 10 навыков Финансовых + Курсы: financial_literacy, fire_course'},
{id:'career',emoji:'💼',name:'Карьерное',color:'#3ddc97',desc:'Навыки, позиция',
metrics:[{id:'skills',label:'Навыков в развитии',target:'3'},{id:'network',label:'Контактов/мес',target:'5'},{id:'projects',label:'Проектов/квартал',target:'3'}],
learning:'8 навыков Карьеры + Курсы: career_master, leadership_course'},
{id:'social',emoji:'👥',name:'Социальное',color:'#c4b5fd',desc:'Семья, друзья',
metrics:[{id:'deepConnections',label:'Глубоких связей',target:'5+'},{id:'calls',label:'Звонков/нед',target:'3'},{id:'meetups',label:'Встреч/мес',target:'4'}],
learning:'10 навыков Социальных + 6 Отношений + Курсы: communication'},
{id:'environment',emoji:'🏠',name:'Среда',color:'#a4e7ff',desc:'Пространство, свет',
metrics:[{id:'clutter',label:'Порядок 1-10',target:'8+'},{id:'light',label:'Освещение 1-10',target:'8+'},{id:'noise',label:'Тишина 1-10',target:'7+'}],
learning:'Уровни 1-2 + Курсы: environment_design, home_master'},
{id:'recovery',emoji:'⏰',name:'Восстановление',color:'#4dd4ff',desc:'Сон, отдых',
metrics:[{id:'sleepHours',label:'Сон (ч)',target:'7-9'},{id:'sleepQuality',label:'Качество сна 1-10',target:'8+'},{id:'breaks',label:'Перерывов/день',target:'6+'}],
learning:'15 навыков Здоровья + Курсы: recovery_course, sleep_master'},
{id:'digital',emoji:'📱',name:'Цифровое',color:'#ff88cc',desc:'Экран, детокс',
metrics:[{id:'screenToday',label:'Экран (мин)',target:'<240'},{id:'screenWeek',label:'Экран/нед (ч)',target:'<28'},{id:'phoneUnlocks',label:'Разблокировок',target:'<80'}],
learning:'30-дневный курс детокса + 6 навыков Цифровых + Курсы: screentime_course'}
];

/* ============ МУДРОСТИ ДНЯ (110) ============ */
var DAILY_WISDOMS=[
{text:'Ты не ленивый. Ты либо устал, либо не видишь смысла, либо боишься.',author:'Неизвестный',apply:'Спроси себя: что из 3 — моё?'},
{text:'Дисциплина — это выбор между тем, что хочешь сейчас, и тем, что хочешь больше всего.',author:'Авраам Линкольн',apply:'Спроси: что я хочу больше всего?'},
{text:'Мы — то, что делаем постоянно. Совершенство — не действие, а привычка.',author:'Аристотель',apply:'Что ты делаешь каждый день?'},
{text:'Между стимулом и реакцией есть пространство. В нём — наша свобода.',author:'Виктор Франкл',apply:'Дыши 6 секунд перед реакцией'},
{text:'Счастье — это не то, что ты имеешь, а то, что ты чувствуешь.',author:'Даг Хэммершолд',apply:'Запиши 3 благодарности'},
{text:'Ты не можешь вернуться и изменить начало, но можешь начать сейчас и изменить конец.',author:'К.С. Льюис',apply:'Что ты можешь сделать за 2 минуты?'},
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
  try{
    if(!window.DAILY_WISDOMS||!window.DAILY_WISDOMS.length)return{text:'Начни.',author:'Неизвестный',apply:'Сейчас'};
    var i=Math.floor(Date.now()/86400000)%window.DAILY_WISDOMS.length;
    return window.DAILY_WISDOMS[i];
  }catch(e){return{text:'Начни.',author:'Неизвестный',apply:'Сейчас'}}
}

/* ============ ЧЕЛЛЕНДЖИ (55, без алкоголя/курения) ============ */
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
{id:'ch_single_task',title:'Одна задача',desc:'90 минут без отвлечений',reward:35,category:'productivity'}
];

function todayKey(){return new Date().toISOString().slice(0,10)}
function yesterdayKey(){var d=new Date();d.setDate(d.getDate()-1);return d.toISOString().slice(0,10)}

function getTodayChallenges(){
  var dayIdx=Math.floor(Date.now()/86400000);
  var result=[],pool=DAILY_CHALLENGES.slice(),s=null;
  try{if(window.state)s=window.state;else if(typeof state!=='undefined'&&state)s=state}catch(e){}
  if(s){
    try{
      var yK=yesterdayKey();
      var sleepToday=(s.customSleep&&s.customSleep[yK])||7;
      var wT=(s.customWater||[]).find(function(w){return w.date===yK});
      wT=wT?wT.count:0;
      var scY=(s.screenHistory&&s.screenHistory[yK])||0;
      var pri=[];
      if(sleepToday<6)pri.push('ch_sleep_early','ch_meditation_10','ch_breathing_478');
      if(wT<4)pri.push('ch_water_8');
      if(scY>300)pri.push('ch_no_phone_morning','ch_deep_work_90','ch_no_phone_bed');
      pri.forEach(function(id){
        var ch=pool.find(function(c){return c.id===id});
        if(ch&&result.length<3&&result.indexOf(ch)<0)result.push(ch);
      });
    }catch(e){}
  }
  var off=dayIdx%pool.length,i=0;
  while(result.length<3&&i<pool.length){
    var ch=pool[(off+i)%pool.length];
    if(result.indexOf(ch)<0)result.push(ch);
    i++;
  }
  return result;
}

/* ============ РЕЖИМЫ ============ */
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

/* ============ TABS ============ */
var TABS=[
{id:'dashboard',emoji:'🏠',label:'Главная'},
{id:'tasks',emoji:'✅',label:'Задачи'},
{id:'learning',emoji:'🎓',label:'Обучение'},
{id:'entertainment',emoji:'🎬',label:'Досуг'},
{id:'ai',emoji:'✨',label:'AI'},
{id:'health',emoji:'❤️',label:'Здоровье'},
{id:'more',emoji:'⋯',label:'Ещё'}
];

/* ============ QUICK TABS ============ */
var QUICK_TABS={
learning:[
{id:'all',emoji:'📚',label:'Всё',target:null},
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
{id:'all',emoji:'📋',label:'Все',target:null},
{id:'pending',emoji:'⏳',label:'Активные',target:null,filter:'pending'},
{id:'completed',emoji:'✅',label:'Готовые',target:null,filter:'completed'},
{id:'matrix',emoji:'🔢',label:'Матрица',target:'matrix'},
{id:'dailyplan',emoji:'📅',label:'План',target:'dailyplan'}
]
};

/* ============ PERSONAS ============ */
var PERSONAS={
coach:{name:'Коуч',color:'coach',label:'Продуктивность 80 лет',emoji:'💬',prompt:'Ты — AI-Коуч с 80-летним опытом. GROW, SMART, Deep Work, Икигай. 150-220 слов.'},
psych:{name:'Психолог',color:'psych',label:'Клинический 80 лет',emoji:'🧠',prompt:'Ты — AI-Психолог. КПТ, ACT, DBT. НЕ ставь диагнозы! Кризис → 8-800-2000-122. 150-220 слов.'},
doctor:{name:'Врач',color:'doctor',label:'Медицина 80 лет',emoji:'⚕️',prompt:'Ты — AI-Врач. НЕ ставь диагнозы. ВСЕГДА дисклеймер. Острые → 103/112.'},
nutrition:{name:'Нутрициолог',color:'nutrition',label:'Питание 80 лет',emoji:'🥗',prompt:'Ты — AI-Нутрициолог. 150-200 слов.'},
fitness:{name:'Тренер',color:'fitness',label:'Фитнес 80 лет',emoji:'🏋️',prompt:'Ты — AI-Фитнес-тренер. 150-200 слов.'},
lawyer:{name:'Юрист',color:'lawyer',label:'Право 80 лет',emoji:'⚖️',prompt:'Ты — AI-Юрист. 150-200 слов.'},
finance:{name:'Финансист',color:'finance',label:'Финансы 80 лет',emoji:'💰',prompt:'Ты — AI-Финансовый консультант. 150-200 слов.'}
};

/* ============ HABITS/GOALS TEMPLATES ============ */
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

/* ============ ЭКСПОРТ ============ */
window.__CONTENT_READY=true;
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
window.HABITS_TEMPLATES=HABITS_TEMPLATES;
window.GOALS_TEMPLATES=GOALS_TEMPLATES;
window.todayKey=todayKey;
window.yesterdayKey=yesterdayKey;