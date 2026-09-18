'use strict';
/* AI HEALTH v33 — CONTENT (весь контент: темы, домены, мудрости, челленджи, курсы, уровни, english, skills, entertainment, screen, integrations, achievements, methods, personas, survey) */

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

/* ============ МУДРОСТИ ДНЯ ============ */
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
  var dayIdx = Math.floor(Date.now() / 86400000) % DAILY_WISDOMS.length;
  return DAILY_WISDOMS[dayIdx];
}

/* ============ ЧЕЛЛЕНДЖИ ============ */
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
  var result=[];
  var pool=DAILY_CHALLENGES.slice();
  try{
    if(typeof state!=='undefined'&&state){
      var sleepToday=(state.customSleep&&state.customSleep[yesterdayKey()])||7;
      var waterToday=(state.customWater||[]).find(function(w){return w.date===yesterdayKey()});
      waterToday=waterToday?waterToday.count:0;
      var screenYesterday=(state.screenHistory&&state.screenHistory[yesterdayKey()])||0;
      var priorityIds=[];
      if(sleepToday<6)priorityIds.push('ch_sleep_early','ch_meditation_10','ch_breathing_478');
      if(waterToday<4)priorityIds.push('ch_water_8');
      if(screenYesterday>300)priorityIds.push('ch_no_phone_morning','ch_deep_work_90','ch_no_phone_bed');
      priorityIds.forEach(function(pid){
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

/* ============ РЕЖИМЫ ============ */
var WORK_MODES=[
{id:'work',name:'Работа',emoji:'💼',desc:'Только задачи и продуктивность',block:['entertainment','social','games'],color:'#5b9eff'},
{id:'rest',name:'Отдых',emoji:'🌿',desc:'Только досуг и здоровье',block:['tasks','learning'],color:'#3ddc97'},
{id:'sleep',name:'Сон',emoji:'🌙',desc:'Только медитация и сон',block:['tasks','learning','entertainment','social'],color:'#a78bfa'},
{id:'study',name:'Учёба',emoji:'📚',desc:'Только обучение и английский',block:['entertainment','social'],color:'#ffa940'}
];

/* ============ SURVEY ============ */
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

/* ============ КУРСЫ (50) ============ */
var COURSES_LIBRARY=[
{id:'productivity_master',title:'Мастер продуктивности',emoji:'⚡',category:'Продуктивность',hours:8,lessons:[
{title:'Введение в продуктивность',theory:'80/20. 20% усилий — 80% результата.',practice:'Выпиши 3 задачи, дающие 80%.',quiz:['Что такое принцип Парето?','Как найти 20% важного?'],video:'6qIq6hTOJIE'},
{title:'SMART-цели',theory:'Specific, Measurable, Achievable, Relevant, Time-bound.',practice:'Поставь 1 SMART-цель.',quiz:['Что значит M в SMART?'],video:'1-SO0N3C7uU'},
{title:'Матрица Эйзенхауэра',theory:'Q1 делай, Q2 планируй, Q3 делегируй, Q4 удали.',practice:'Разбери 10 задач.',quiz:['Куда отнести «позвонить маме»?'],video:'zFu5OK0dw6o'},
{title:'GTD',theory:'Capture, Clarify, Organize, Reflect, Engage.',practice:'Inbox 3 дня.',quiz:['Сколько шагов в GTD?'],video:'gC4NmL5oZjI'},
{title:'Deep Work',theory:'90 минут. Одна задача. 3-4 ч = 10 ч.',practice:'1 блок 90 мин.',quiz:['Сколько часов Deep Work в день?'],video:'3wL4dHs2Z2g'},
{title:'Pomodoro',theory:'25/5. 4 цикла. 30 мин отдых.',practice:'4 помидора.',quiz:['Сколько минут в помидоре?'],video:'mNBmG1RFRQI'},
{title:'Управление энергией',theory:'90/15. Ультрадианные ритмы.',practice:'Отследи энергию 3 дня.',quiz:['Что важнее — время или энергия?'],video:'yVFK8p7jqjU'},
{title:'Привычки',theory:'Cue → Craving → Response → Reward. 1% в день = 37x.',practice:'1 привычка на 30 дней.',quiz:['Сколько в 1% в день за год?'],video:'W1eYrhGeffc'},
{title:'Инструменты',theory:'Notion, Obsidian, Todoist.',practice:'Настрой 1 инструмент.',quiz:['Что лучше для заметок?'],video:'ctetJg4Z0Rs'},
{title:'Итог',theory:'3 цели, 5 привычек, 1 система.',practice:'Составь план на месяц.',quiz:['Сколько привычек достаточно?'],video:'0ICfQYwL1uc'}
]},
{id:'mental_health',title:'Психическое здоровье',emoji:'🧠',category:'Психика',hours:6,lessons:[
{title:'Психика',theory:'Функция мозга. Пластичность всю жизнь.',practice:'24 ч наблюдай.',quiz:['Что такое нейропластичность?'],video:'ELm8VJ8E4z4'},
{title:'Эмоции',theory:'7 базовых. 90 секунд. Сигналы.',practice:'Дневник эмоций.',quiz:['Сколько длится эмоция?'],video:'0QNqXcCmyL0'},
{title:'Тревога',theory:'Дыхание 4-7-8. КПТ.',practice:'4 цикла.',quiz:['Что делать при тревоге?'],video:'YRPh1rNw9r8'},
{title:'Депрессия',theory:'Болезнь. КПТ 70%. Движение.',practice:'Прогулка.',quiz:['Когда идти к врачу?'],video:'vH5B2q5c5bM'},
{title:'КПТ',theory:'Мысль → эмоция. Искажения → альтернатива.',practice:'Заполни 1 таблицу.',quiz:['Что такое когнитивное искажение?'],video:'9c33l8z4f4s'},
{title:'ACT',theory:'Принятие. Ценности. Действие.',practice:'3 ценности.',quiz:['Что такое когнитивное разделение?'],video:'6y3B4b6hK3c'},
{title:'Границы',theory:'Спокойное «нет». Уважение.',practice:'Скажи «нет» 3 раза.',quiz:['Как сказать «нет» без вины?'],video:'G7H8I9J0k1L'},
{title:'Смысл',theory:'Франкл. Труд, любовь, страдание.',practice:'Напиши «зачем».',quiz:['3 источника смысла?'],video:'M1N2O3P4q5R'},
{title:'Помощь',theory:'>2 недель → специалист.',practice:'Запишись.',quiz:['Когда обращаться к специалисту?'],video:'S6T7U8V9w0X'},
{title:'Система',theory:'Собери всё вместе.',practice:'Расписание.',quiz:['Что главное?'],video:'A1B2C3D4e5F'}
]},
{id:'health_basics',title:'Основы здоровья',emoji:'⚕️',category:'Здоровье',hours:7,lessons:[
{title:'Сон',theory:'7-9 часов. 4 стадии. Циркадные ритмы.',practice:'Режим 7 дней.',quiz:['Сколько часов сна нужно?'],video:'nm1TxQj9IsQ'},
{title:'Питание',theory:'Средиземноморская. Белок 1.6 г/кг. Овощи 500 г.',practice:'Составь меню.',quiz:['Сколько белка на кг веса?'],video:'vp7B2zW7cK4'},
{title:'Микроэлементы',theory:'D3, Omega-3, магний, цинк.',practice:'Проверь анализы.',quiz:['Зачем D3?'],video:'1n2M3N4O5p6'},
{title:'Движение',theory:'150 мин кардио + 2 силовые.',practice:'3 тренировки.',quiz:['Сколько кардио в неделю?'],video:'Q7R8S9T0u1V'},
{title:'Стресс',theory:'Сапольски. Кортизол. Хронический стресс.',practice:'3 способа снятия.',quiz:['Что делает кортизол?'],video:'W2X3Y4Z5a6B'},
{title:'Профилактика',theory:'Чекап. Анализы. Вакцинация.',practice:'Запишись на чекап.',quiz:['Что проверять ежегодно?'],video:'C7D8E9F0g1H'},
{title:'Долголетие',theory:'Аттиа. Зона 2. Сила. Белок. Сон.',practice:'Введи 1 привычку.',quiz:['Что такое Zone 2?'],video:'I2J3K4L5m6N'},
{title:'Психика=тело',theory:'+40% инфаркт при депрессии.',practice:'Медитация 10 мин.',quiz:['Связь психики и тела?'],video:'O7P8Q9R0s1T'},
{title:'Мифы',theory:'Детоксы. Суперфуды. Чудо-таблетки.',practice:'Проверь 3 мифа.',quiz:['Работают ли детоксы?'],video:'U2V3W4X5y6Z'},
{title:'Скорая',theory:'FAST. 103. 112.',practice:'Выучи признаки инсульта.',quiz:['Что означает FAST?'],video:'a7B8C9D0e1F'}
]},
{id:'financial_literacy',title:'Финансовая грамотность',emoji:'💰',category:'Финансы',hours:5,lessons:[
{title:'Психология денег',theory:'Хаусел. Деньги — эмоции.',practice:'Запиши 3 ошибки.',quiz:['Почему мы тратим импульсивно?'],video:'yC1nJwZ2k0Q'},
{title:'Учёт',theory:'50/30/20. Записывай каждую трату.',practice:'30 дней учёта.',quiz:['Что такое 50/30/20?'],video:'nY8sB1t9m2L'},
{title:'Подушка',theory:'3-6 месяцев. Отдельный счёт.',practice:'Посчитай размер.',quiz:['Зачем подушка?'],video:'pQ4rT6uW8yZ'},
{title:'Долги',theory:'Снежный ком. Лавина. Рефинанс.',practice:'Составь план.',quiz:['Что такое лавина?'],video:'bN7mK9jH5gF'},
{title:'Инвестиции',theory:'Индексные фонды. Долгосрочно. DCA.',practice:'Изучи 3 фонда.',quiz:['Что такое DCA?'],video:'vD3cS5xZ7q1'},
{title:'Диверсификация',theory:'100 - возраст = % акций.',practice:'Распредели портфель.',quiz:['Правило распределения?'],video:'wE4dT6yA8r2'},
{title:'Налоги',theory:'ИИС. Вычеты. Оптимизация.',practice:'Проверь вычеты.',quiz:['Сколько даёт ИИС?'],video:'xF5eU7zB9s3'},
{title:'Доход',theory:'Второй источник. Навык. Фриланс.',practice:'Найди идею.',quiz:['Зачем 2-й доход?'],video:'yG6fV8aC0t4'},
{title:'Страхование',theory:'Защитное. Жизнь, здоровье.',practice:'Проверь полисы.',quiz:['Что страховать обязательно?'],video:'zH7gW9bD1u5'},
{title:'Пенсия',theory:'Сложный процент. Начни сейчас.',practice:'Посчитай накопления.',quiz:['Как работает сложный процент?'],video:'aI8hX0cE2v6'}
]},
{id:'neuroscience',title:'Нейробиология',emoji:'🔬',category:'Здоровье',hours:6,lessons:[
{title:'Структура',theory:'86 млрд нейронов. Кора, лимбическая система.',practice:'Схема мозга.',quiz:['За что отвечает миндалина?'],video:'LqX0hV3sF6Q'},
{title:'Пластичность',theory:'Всю жизнь. Fire together, wire together.',practice:'30 дней 1 навык.',quiz:['Правило Хебба?'],video:'ELpfYCZa87g'},
{title:'Дофамин',theory:'Мотивация. Предвкушение. Суперстимулы.',practice:'Голодание 4 ч.',quiz:['Что делает дофамин?'],video:'Nz9h1wU3G8A'},
{title:'Кортизол',theory:'Утром высокий. Хронический стресс.',practice:'Дневник стресса.',quiz:['Что убивает кортизол?'],video:'Q1w2E3r4T5y'},
{title:'Серотонин',theory:'Солнце. Триптофан. Настроение.',practice:'10 мин солнца.',quiz:['Как поднять серотонин?'],video:'U6i7O8p9A0s'},
{title:'Окситоцин',theory:'Связи. Объятия. Доверие.',practice:'Обними близкого.',quiz:['Что выделяется при объятиях?'],video:'D1f2G3h4J5k'},
{title:'Сон',theory:'Глимфатика. Очистка мозга.',practice:'7-9 часов.',quiz:['Что происходит с мозгом во сне?'],video:'L6z7X8c9V0b'},
{title:'Питание',theory:'Omega-3. Микробиом. Воспаление.',practice:'Добавь рыбу.',quiz:['Что есть для мозга?'],video:'N1m2B3v4C5x'},
{title:'Обучение',theory:'Интервалы. Тестирование. Сон.',practice:'Anki 20 карточек.',quiz:['Что усиливает обучение?'],video:'Z6a7S8d9F0g'},
{title:'Медитация',theory:'Lazar. Утолщение коры.',practice:'10 мин.',quiz:['Как медитация меняет мозг?'],video:'H1j2K3l4M5n'}
]},
{id:'communication',title:'Коммуникация',emoji:'💬',category:'Общение',hours:5,lessons:[
{title:'Слушание',theory:'3 уровня. Парафраз. Эмпатия.',practice:'3 разговора.',quiz:['Сколько уровней слушания?'],video:'F8r9I0c1K2z'},
{title:'Я-сообщения',theory:'Формула. Примеры.',practice:'3 претензии.',quiz:['Как говорить без «ты»?'],video:'H3j4K5l6M7n'},
{title:'ННО',theory:'Наблюдение, чувства, потребности, просьба.',practice:'ННО в конфликте.',quiz:['4 шага ННО?'],video:'Z8y9N0v1B2m'},
{title:'Сложные разговоры',theory:'Спокойствие. Пауза. Решение.',practice:'1 сложный разговор.',quiz:['Что делать перед сложным разговором?'],video:'F1g2H3j4K5l'},
{title:'Влияние',theory:'Чалдини. 6 принципов.',practice:'Применяй 1.',quiz:['6 принципов влияния?'],video:'cFdN7pU3g2A'},
{title:'Выступления',theory:'Hook. Структура. Репетиция.',practice:'Речь 3 мин.',quiz:['Что такое hook?'],video:'Unzc731iCUY'},
{title:'Конфликты',theory:'Сотрудничество. Ремонт.',practice:'3 конфликта.',quiz:['5 стилей конфликтов?'],video:'Q7R8S9T0u1V'},
{title:'Обратная связь',theory:'SBI. Принятие.',practice:'SBI 3 раза.',quiz:['Что такое SBI?'],video:'W2X3Y4Z5a6B'},
{title:'Переговоры',theory:'BATNA. Интересы. Варианты.',practice:'Разыграй.',quiz:['Что такое BATNA?'],video:'C7D8E9F0g1H'},
{title:'Этика',theory:'24 часа. Уважение.',practice:'Правило 24 ч.',quiz:['Правило этичной коммуникации?'],video:'I2J3K4L5m6N'}
]},
{id:'english_course',title:'Английский с нуля',emoji:'🇬🇧',category:'Обучение',hours:12,lessons:[
{title:'Алфавит и звуки',theory:'26 букв. 44 звука.',practice:'Произнеси 10 слов.',quiz:['Сколько звуков в английском?'],video:'Q1w2E3r4T5y'},
{title:'Приветствия',theory:'Hello! How are you? Nice to meet you.',practice:'Диалог 5 реплик.',quiz:['Как поздороваться формально?'],video:'U6i7O8p9A0s'},
{title:'Числа и время',theory:'1-100. Hours. Days.',practice:'Назови время.',quiz:['Как сказать 3:30?'],video:'D1f2G3h4J5k'},
{title:'Present Simple',theory:'I work. He works. Do you work?',practice:'10 предложений.',quiz:['Когда +s?'],video:'L6z7X8c9V0b'},
{title:'Past Simple',theory:'I worked. Did you work?',practice:'Что делал вчера.',quiz:['Форма вопроса?'],video:'N1m2B3v4C5x'},
{title:'Future',theory:'I will work. Going to.',practice:'5 планов.',quiz:['Разница will / going to?'],video:'Z6a7S8d9F0g'},
{title:'Present Perfect',theory:'I have worked. Since/for.',practice:'10 предложений.',quiz:['Когда использовать?'],video:'H1j2K3l4M5n'},
{title:'Модальные',theory:'Can, must, should, may.',practice:'5 предложений.',quiz:['Разница must / should?'],video:'F8r9I0c1K2z'},
{title:'Условные',theory:'If I... I would...',practice:'5 условных.',quiz:['3 типа условных?'],video:'H3j4K5l6M7n'},
{title:'Фразовые глаголы',theory:'Get up, give up, look after.',practice:'10 глаголов.',quiz:['Что такое фразовый глагол?'],video:'Z8y9N0v1B2m'},
{title:'Идиомы',theory:'Break a leg. Piece of cake.',practice:'5 идиом.',quiz:['Что значит Break a leg?'],video:'F1g2H3j4K5l'},
{title:'Деловой английский',theory:'Emails. Presentations.',practice:'Напиши email.',quiz:['Структура письма?'],video:'cFdN7pU3g2A'},
{title:'Академический',theory:'Essays. Research.',practice:'Эссе 200 слов.',quiz:['Что такое thesis?'],video:'Unzc731iCUY'},
{title:'Свободное общение',theory:'Debates. Discussions.',practice:'Диалог 5 мин.',quiz:['Как выразить мнение?'],video:'Q7R8S9T0u1V'}
]},
{id:'recovery_course',title:'Восстановление и отдых',emoji:'🌿',category:'Здоровье',hours:4,lessons:[
{title:'Виды отдыха',theory:'7 типов отдыха.',practice:'Определи свой дефицит.',quiz:['Сколько видов отдыха?'],video:'W2X3Y4Z5a6B'},
{title:'Сон',theory:'Гигиена сна. Циркадные.',practice:'Режим неделю.',quiz:['Правила гигиены сна?'],video:'C7D8E9F0g1H'},
{title:'Медитация',theory:'5-20 минут. Виды. Эффекты.',practice:'10 мин.',quiz:['Что даёт медитация?'],video:'I2J3K4L5m6N'},
{title:'Природа',theory:'2 часа в неделю. -16% кортизол.',practice:'Прогулка в парке.',quiz:['Сколько нужно на природе?'],video:'O7P8Q9R0s1T'},
{title:'Фильмы и сериалы',theory:'Осознанный просмотр.',practice:'1 фильм без телефона.',quiz:['Правила просмотра?'],video:'U2V3W4X5y6Z'},
{title:'Чтение',theory:'20 минут в день.',practice:'20 мин книги.',quiz:['Что читать для мозга?'],video:'a7B8C9D0e1F'},
{title:'Музыка',theory:'Расслабление. Фокус. Настроение.',practice:'Плейлист для сна.',quiz:['Какая музыка для сна?'],video:'g2H3I4j5K6l'},
{title:'Творчество',theory:'Рисование, музыка, письмо.',practice:'30 мин творчества.',quiz:['Что такое поток?'],video:'m7N8O9P0q1R'},
{title:'Хобби',theory:'Радость. Смысл. Баланс.',practice:'Займись хобби.',quiz:['Зачем хобби?'],video:'s2T3U4V5w6X'},
{title:'Цифровой детокс',theory:'24 часа без экранов.',practice:'1 день детокса.',quiz:['Как провести детокс?'],video:'y7Z8A9B0c1D'}
]},
{id:'memory_master',title:'Мастер памяти',emoji:'🧠',category:'Обучение',hours:5,lessons:[
{title:'Как работает память',theory:'3 типа. Кривая Эббингауза.',practice:'Расписание повторений.',quiz:['Что такое кривая Эббингауза?'],video:'Q1w2E3r4T5y'},
{title:'Дворец памяти',theory:'Метод локусов.',practice:'10 слов в квартире.',quiz:['Что такое метод локусов?'],video:'U6i7O8p9A0s'},
{title:'Мнемоники',theory:'Акронимы, рифмы, истории.',practice:'10 мнемоник.',quiz:['Что такое акроним?'],video:'D1f2G3h4J5k'},
{title:'Интервальное повторение',theory:'Anki. 1, 3, 7, 14, 30.',practice:'20 карточек.',quiz:['Что такое SRS?'],video:'L6z7X8c9V0b'},
{title:'Чанкинг',theory:'7±2. Группировка.',practice:'30 слов в 6 чанков.',quiz:['Сколько элементов в краткосрочной памяти?'],video:'N1m2B3v4C5x'},
{title:'Активное припоминание',theory:'Testing effect.',practice:'Recall после урока.',quiz:['Что эффективнее?'],video:'Z6a7S8d9F0g'},
{title:'Метод Фейнмана',theory:'Объясни 12-летнему.',practice:'Объясни 3 темы.',quiz:['4 шага метода Фейнмана?'],video:'H1j2K3l4M5n'},
{title:'Сон и память',theory:'Консолидация. 7-9 часов.',practice:'Учи перед сном.',quiz:['Когда учить для памяти?'],video:'F8r9I0c1K2z'},
{title:'Двойное кодирование',theory:'Paivio. Слова + образы.',practice:'Mind map.',quiz:['Что такое dual coding?'],video:'H3j4K5l6M7n'},
{title:'Система',theory:'Комбинация всех техник.',practice:'Личная система.',quiz:['Что главное в системе?'],video:'Z8y9N0v1B2m'}
]},
{id:'iq_boost',title:'IQ-тренировки',emoji:'🎯',category:'Обучение',hours:6,lessons:[
{title:'Что такое IQ',theory:'Средний 100. σ = 15.',practice:'Пройди тест.',quiz:['Средний IQ?'],video:'F1g2H3j4K5l'},
{title:'Логические последовательности',theory:'Арифм., геом., Фибоначчи.',practice:'Реши 10.',quiz:['Что такое Фибоначчи?'],video:'cFdN7pU3g2A'},
{title:'Аналогии',theory:'A:B = C:? Типы связей.',practice:'Реши 10.',quiz:['Что такое аналогия?'],video:'Unzc731iCUY'},
{title:'Пространственное мышление',theory:'Вращение, развёртки.',practice:'Развёртка куба.',quiz:['За что отвечает правое полушарие?'],video:'Q7R8S9T0u1V'},
{title:'Рабочая память',theory:'4±1 чанка. N-back.',practice:'N-back 10 мин.',quiz:['Что такое N-back?'],video:'W2X3Y4Z5a6B'},
{title:'Скорочтение',theory:'400-600 слов/мин.',practice:'10 мин с указкой.',quiz:['Средняя скорость чтения?'],video:'C7D8E9F0g1H'},
{title:'Критическое мышление',theory:'5 вопросов.',practice:'Анализ новости.',quiz:['5 вопросов критики?'],video:'I2J3K4L5m6N'},
{title:'Математическое мышление',theory:'Ментальная арифметика.',practice:'20 примеров.',quiz:['Как считать 17×23 в уме?'],video:'O7P8Q9R0s1T'},
{title:'Шахматы',theory:'Стратегия. Тактика.',practice:'1 партия.',quiz:['Что такое вилка?'],video:'U2V3W4X5y6Z'},
{title:'Система',theory:'N-back + задачи + партия.',practice:'Расписание.',quiz:['Как тренировать IQ?'],video:'a7B8C9D0e1F'}
]},
{id:'eq_course',title:'Эмоциональный интеллект',emoji:'❤️',category:'Психика',hours:5,lessons:[
{title:'Что такое EQ',theory:'Гоулман. 5 компонентов.',practice:'Оцени EQ.',quiz:['5 компонентов EQ?'],video:'g2H3I4j5K6l'},
{title:'Самосознание',theory:'Дневник. Назови эмоцию.',practice:'7 дней дневника.',quiz:['Что такое name it to tame it?'],video:'m7N8O9P0q1R'},
{title:'Саморегуляция',theory:'Дыхание. Пауза 6 сек.',practice:'Пауза в конфликте.',quiz:['Что делать при гневе?'],video:'s2T3U4V5w6X'},
{title:'Эмпатия',theory:'3 типа.',practice:'3 разговора.',quiz:['3 типа эмпатии?'],video:'y7Z8A9B0c1D'},
{title:'Мотивация',theory:'Деси/Райан.',practice:'Внутренний смысл.',quiz:['3 базовые потребности?'],video:'e2F3G4H5i6J'},
{title:'Социальные навыки',theory:'Я-сообщения. SBI. ННО.',practice:'SBI 3 раза.',quiz:['Что такое SBI?'],video:'k7L8M9N0o1P'},
{title:'Стресс',theory:'Box breathing.',practice:'3 техники.',quiz:['Как успокоиться быстро?'],video:'q2R3S4T5u6V'},
{title:'Конфликты',theory:'Томас-Килманн.',practice:'3 конфликта.',quiz:['Лучший стиль конфликта?'],video:'w7X8Y9Z0a1B'},
{title:'Границы',theory:'Здоровое «нет».',practice:'3 «нет».',quiz:['Как сказать «нет»?'],video:'c2D3E4F5g6H'},
{title:'Система',theory:'Дневник + пауза + слушание.',practice:'Расписание.',quiz:['Как развивать EQ?'],video:'i7J8K9L0m1N'}
]},
{id:'screentime_course',title:'Цифровой детокс',emoji:'📱',category:'Здоровье',hours:6,lessons:[
{title:'Диагностика',theory:'Замер. Аудит. Триггеры.',practice:'Замерь время.',quiz:['Зачем замерять?'],video:'o2P3Q4R5s6T'},
{title:'Утро',theory:'30 мин без телефона.',practice:'Утро без телефона.',quiz:['Почему утро важно?'],video:'u7V8W9X0y1Z'},
{title:'Deep Work',theory:'90 мин авиарежим.',practice:'1 блок.',quiz:['Что даёт Deep Work?'],video:'a2B3C4D5e6F'},
{title:'Вечер',theory:'2 ч без экрана.',practice:'Вечер без экрана.',quiz:['Зачем вечерний детокс?'],video:'g7H8I9J0k1L'},
{title:'Детокс',theory:'24 ч в неделю.',practice:'1 день.',quiz:['Сколько длится детокс?'],video:'m2N3O4P5q6R'},
{title:'Среда',theory:'Телефон вне спальни.',practice:'Ночь без телефона.',quiz:['Где должен быть телефон ночью?'],video:'s7T8U9V0w1X'},
{title:'Замены',theory:'Книга, спорт, хобби.',practice:'1 замена.',quiz:['Что вместо телефона?'],video:'y2Z3A4B5c6D'},
{title:'Психология',theory:'FOMO. Сравнение. Скука.',practice:'Отпишись от 10.',quiz:['Что такое FOMO?'],video:'e7F8G9H0i1J'},
{title:'Инструменты',theory:'Forest, Freedom, Screen Time.',practice:'Установи Forest.',quiz:['Что делает Forest?'],video:'k2L3M4N5o6P'},
{title:'Система',theory:'Привычки + правила + среда.',practice:'Личная система.',quiz:['Что главное?'],video:'q7R8S9T0u1V'}
]},
{id:'nutrition_master',title:'Мастер питания',emoji:'🥗',category:'Здоровье',hours:4,lessons:[
{title:'Средиземноморская',theory:'Овощи, рыба, оливковое масло.',practice:'Составь меню.',quiz:['Основа диеты?'],video:'w2X3Y4Z5a6B'},
{title:'Белок',theory:'1.6 г/кг. Сытость.',practice:'Посчитай норму.',quiz:['Сколько белка?'],video:'c7D8E9F0g1H'},
{title:'Овощи',theory:'500 г/день. Микробиом.',practice:'500 г овощей.',quiz:['Сколько овощей?'],video:'i2J3K4L5m6N'},
{title:'Жиры',theory:'Оливковое, орехи, авокадо.',practice:'Замени масло.',quiz:['Какие жиры полезны?'],video:'o7P8Q9R0s1T'},
{title:'Сахар',theory:'Минимум. Усталость.',practice:'Без сахара 1 день.',quiz:['Что делает сахар?'],video:'u2V3W4X5y6Z'},
{title:'16:8',theory:'Интервальное голодание.',practice:'12:12 первый день.',quiz:['Что такое 16:8?'],video:'a7B8C9D0e1F'},
{title:'Вода',theory:'30 мл/кг.',practice:'8 стаканов.',quiz:['Сколько воды?'],video:'g2H3I4j5K6l'},
{title:'Витамины',theory:'D3, Omega-3, магний.',practice:'Проверь анализы.',quiz:['Зачем D3?'],video:'m7N8O9P0q1R'},
{title:'Ошибки',theory:'Детоксы, суперфуды.',practice:'Разбери 3.',quiz:['Работают ли детоксы?'],video:'s2T3U4V5w6X'},
{title:'Система',theory:'План на неделю.',practice:'Составь план.',quiz:['Что в основе?'],video:'y7Z8A9B0c1D'}
]},
{id:'fitness_master',title:'Мастер фитнеса',emoji:'🏋️',category:'Здоровье',hours:6,lessons:[
{title:'Зона 2',theory:'Кардио 60-70%.',practice:'30 мин.',quiz:['Что такое Zone 2?'],video:'e2F3G4H5i6J'},
{title:'HIIT',theory:'20/10 × 8.',practice:'1 сессия.',quiz:['Что такое HIIT?'],video:'k7L8M9N0o1P'},
{title:'Силовые',theory:'Базовые. 4-6 повторов.',practice:'Присед, тяга, жим.',quiz:['Базовые упражнения?'],video:'q2R3S4T5u6V'},
{title:'Прогрессия',theory:'+5% в неделю.',practice:'Расписание.',quiz:['Что такое прогрессия?'],video:'w7X8Y9Z0a1B'},
{title:'Восстановление',theory:'48 ч между тренировками.',practice:'Отдых 1 день.',quiz:['Сколько отдыхать?'],video:'c2D3E4F5g6H'},
{title:'Мобильность',theory:'10 мин/день.',practice:'Упражнения.',quiz:['Зачем мобильность?'],video:'i7J8K9L0m1N'},
{title:'Техника',theory:'Присед, тяга.',practice:'Записывай себя.',quiz:['Что важнее техника или вес?'],video:'o2P3Q4R5s6T'},
{title:'Питание',theory:'До/после тренировки.',practice:'План.',quiz:['Что есть до тренировки?'],video:'u7V8W9X0y1Z'},
{title:'Программа',theory:'Push-Pull-Legs.',practice:'Составь.',quiz:['Что такое PPL?'],video:'a2B3C4D5e6F'},
{title:'Система',theory:'Годовой план.',practice:'Запиши.',quiz:['Что главное?'],video:'g7H8I9J0k1L'}
]},
{id:'career_master',title:'Мастер карьеры',emoji:'💼',category:'Карьера',hours:5,lessons:[
{title:'Икигай',theory:'4 сферы.',practice:'4 круга.',quiz:['Что такое икигай?'],video:'m2N3O4P5q6R'},
{title:'Навыки',theory:'Топ-3.',practice:'Выбери 3.',quiz:['Сколько навыков одновременно?'],video:'s7T8U9V0w1X'},
{title:'Портфолио',theory:'Проекты > резюме.',practice:'3 проекта.',quiz:['Что важнее портфолио или резюме?'],video:'y2Z3A4B5c6D'},
{title:'Нетворк',theory:'10 контактов.',practice:'5 новых.',quiz:['Сколько контактов в месяц?'],video:'e7F8G9H0i1J'},
{title:'Видимость',theory:'LinkedIn, Twitter.',practice:'1 пост.',quiz:['Зачем публиковать?'],video:'k2L3M4N5o6P'},
{title:'Переговоры',theory:'Зарплата. Первое не лучшее.',practice:'Собери победы.',quiz:['Что делать на переговорах?'],video:'q7R8S9T0u1V'},
{title:'Менторство',theory:'Найди ментора.',practice:'Подойди к 1.',quiz:['Зачем ментор?'],video:'w2X3Y4Z5a6B'},
{title:'Год',theory:'План роста.',practice:'Запиши.',quiz:['Что главное?'],video:'c7D8E9F0g1H'},
{title:'5 лет',theory:'Где через 5 лет?',practice:'Запиши.',quiz:['Как планировать?'],video:'i2J3K4L5m6N'},
{title:'Система',theory:'Ревью квартала.',practice:'Календарь.',quiz:['Как часто ревью?'],video:'o7P8Q9R0s1T'}
]},
{id:'leadership_course',title:'Лидерство',emoji:'👑',category:'Карьера',hours:5,lessons:[
{title:'Level 5',theory:'Скромность + воля.',practice:'Оцени себя.',quiz:['Что такое Level 5?'],video:'u2V3W4X5y6Z'},
{title:'Видение',theory:'WHY.',practice:'Напиши WHY.',quiz:['Что такое WHY?'],video:'a7B8C9D0e1F'},
{title:'Развитие',theory:'1 человек.',practice:'Развивай.',quiz:['Что развивать?'],video:'g2H3I4j5K6l'},
{title:'Делегирование',theory:'Делай через других.',practice:'Делегируй 3.',quiz:['Что делегировать?'],video:'m7N8O9P0q1R'},
{title:'Обратная связь',theory:'SBI.',practice:'SBI 3 раза.',quiz:['Что такое SBI?'],video:'s2T3U4V5w6X'},
{title:'Защита',theory:'Защищай команду.',practice:'Найди 1.',quiz:['Что главное?'],video:'y7Z8A9B0c1D'},
{title:'1-на-1',theory:'Ежемесячно.',practice:'Проведи.',quiz:['Как часто 1-на-1?'],video:'e2F3G4H5i6J'},
{title:'Служение',theory:'Servant leadership.',practice:'Помоги.',quiz:['Что такое servant?'],video:'k7L8M9N0o1P'},
{title:'Кризис',theory:'Спокойствие.',practice:'План.',quiz:['Что в кризисе?'],video:'q2R3S4T5u6V'},
{title:'Система',theory:'Ревью.',practice:'Календарь.',quiz:['Как развивать?'],video:'w7X8Y9Z0a1B'}
]},
{id:'sleep_master',title:'Мастер сна',emoji:'😴',category:'Здоровье',hours:3,lessons:[
{title:'Циклы',theory:'90 мин. 4-6 стадий.',practice:'Замерь.',quiz:['Сколько циклов в ночи?'],video:'c2D3E4F5g6H'},
{title:'Мелатонин',theory:'Свет. Экран.',practice:'2 часа без экрана.',quiz:['Что подавляет мелатонин?'],video:'i7J8K9L0m1N'},
{title:'Спальня',theory:'18-20°C. Темно. Тихо.',practice:'Проверь.',quiz:['Температура спальни?'],video:'o2P3Q4R5s6T'},
{title:'Кофеин',theory:'До 14:00.',practice:'Не пей после 14.',quiz:['Когда кофе?'],video:'u7V8W9X0y1Z'},
{title:'Еда',theory:'3 часа до сна.',practice:'Ранний ужин.',quiz:['Когда ужин?'],video:'a2B3C4D5e6F'},
{title:'Алкоголь',theory:'Разрушает сон.',practice:'Откажись.',quiz:['Как алкоголь влияет?'],video:'g7H8I9J0k1L'},
{title:'Спорт',theory:'4-5 часов до сна.',practice:'Утренняя тренировка.',quiz:['Когда спорт для сна?'],video:'m2N3O4P5q6R'},
{title:'Ритуал',theory:'30 мин перед сном.',practice:'План.',quiz:['Что в ритуале?'],video:'s7T8U9V0w1X'},
{title:'Не спится',theory:'Встань.',practice:'Правило 20 мин.',quiz:['Что делать, если не спится?'],video:'y2Z3A4B5c6D'},
{title:'Система',theory:'30 дней.',practice:'Дневник.',quiz:['Что главное?'],video:'e7F8G9H0i1J'}
]},
{id:'environment_design',title:'Дизайн среды',emoji:'🏠',category:'Личное',hours:3,lessons:[
{title:'Порядок',theory:'Порядок = ясность.',practice:'Уборка 1 час.',quiz:['Что даёт порядок?'],video:'k2L3M4N5o6P'},
{title:'Свет',theory:'Утром яркий, вечером тёплый.',practice:'Лампы.',quiz:['Что утром?'],video:'q7R8S9T0u1V'},
{title:'Тишина',theory:'Наушники, шторы, ковры.',practice:'Проверь.',quiz:['Как сделать тихо?'],video:'w2X3Y4Z5a6B'},
{title:'Эргономика',theory:'Стол, стул, монитор.',practice:'Проверь.',quiz:['Как поставить монитор?'],video:'c7D8E9F0g1H'},
{title:'Растения',theory:'Зелень улучшает воздух.',practice:'Купи 3.',quiz:['Зачем растения?'],video:'i2J3K4L5m6N'},
{title:'Запахи',theory:'Ароматы для фокуса.',practice:'Попробуй.',quiz:['Какой аромат для фокуса?'],video:'o7P8Q9R0s1T'},
{title:'Соблазны',theory:'Убери телефон.',practice:'В ящик.',quiz:['Где хранить телефон?'],video:'u2V3W4X5y6Z'},
{title:'Инструменты',theory:'1 задача — 1 место.',practice:'Организуй.',quiz:['Что где лежит?'],video:'a7B8C9D0e1F'},
{title:'Минимализм',theory:'Меньше — больше.',practice:'Выброси 10.',quiz:['Что оставить?'],video:'g2H3I4j5K6l'},
{title:'Система',theory:'Ежедневно 10 мин.',practice:'Привычка.',quiz:['Как поддерживать?'],video:'m7N8O9P0q1R'}
]},
{id:'reading_master',title:'Мастер чтения',emoji:'📚',category:'Обучение',hours:4,lessons:[
{title:'Скорочтение',theory:'400-600 слов/мин.',practice:'10 мин.',quiz:['Средняя скорость?'],video:'s2T3U4V5w6X'},
{title:'Активное чтение',theory:'Заметки, вопросы.',practice:'20 стр.',quiz:['Что важнее чтения?'],video:'y7Z8A9B0c1D'},
{title:'Skim/Scan',theory:'Общее vs точное.',practice:'2 статьи.',quiz:['Что такое skim?'],video:'e2F3G4H5i6J'},
{title:'Книги для развития',theory:'10 книг.',practice:'Выбери 1.',quiz:['Какую книгу начать?'],video:'k7L8M9N0o1P'},
{title:'Конспекты',theory:'Cornell.',practice:'1 конспект.',quiz:['Что такое Cornell?'],video:'q2R3S4T5u6V'},
{title:'Mind map',theory:'Визуальная схема.',practice:'Нарисуй.',quiz:['Как делать mind map?'],video:'w7X8Y9Z0a1B'},
{title:'Художественная',theory:'20 мин/день.',practice:'Начни.',quiz:['Зачем художка?'],video:'c2D3E4F5g6H'},
{title:'Практика',theory:'Применяй сразу.',practice:'1 действие.',quiz:['Что главное?'],video:'i7J8K9L0m1N'},
{title:'Ревью',theory:'Раз в месяц.',practice:'Перечитай.',quiz:['Зачем перечитывать?'],video:'o2P3Q4R5s6T'},
{title:'Система',theory:'Книга в месяц.',practice:'План.',quiz:['Сколько в год?'],video:'u7V8W9X0y1Z'}
]},
{id:'career_interview',title:'Собеседования',emoji:'🎤',category:'Карьера',hours:3,lessons:[
{title:'Типы',theory:'Поведенческие, кейсы.',practice:'Определи.',quiz:['Что такое behavioral?'],video:'a2B3C4D5e6F'},
{title:'STAR',theory:'Situation, Task, Action, Result.',practice:'5 историй.',quiz:['Что такое STAR?'],video:'g7H8I9J0k1L'},
{title:'Резюме',theory:'1 страница.',practice:'Обнови.',quiz:['Сколько страниц?'],video:'m2N3O4P5q6R'},
{title:'Самопрезентация',theory:'2 минуты.',practice:'Запиши себя.',quiz:['Как рассказывать о себе?'],video:'s7T8U9V0w1X'},
{title:'Слабые',theory:'Честно + рост.',practice:'3 примера.',quiz:['Как отвечать про слабости?'],video:'y2Z3A4B5c6D'},
{title:'Вопросы',theory:'Готовь 5.',practice:'Запиши.',quiz:['Зачем вопросы?'],video:'e7F8G9H0i1J'},
{title:'Компания',theory:'Изучи.',practice:'30 мин research.',quiz:['Что искать?'],video:'k2L3M4N5o6P'},
{title:'Зарплата',theory:'Обсуждай в конце.',practice:'Практика.',quiz:['Когда обсуждать?'],video:'q7R8S9T0u1V'},
{title:'Письмо',theory:'Follow-up.',practice:'Напиши.',quiz:['Зачем follow-up?'],video:'w2X3Y4Z5a6B'},
{title:'Система',theory:'5 интервью.',practice:'План.',quiz:['Что главное?'],video:'c7D8E9F0g1H'}
]},
{id:'meaning_course',title:'Поиск смысла',emoji:'✨',category:'Психика',hours:5,lessons:[
{title:'Экзистенциальный кризис',theory:'Норма.',practice:'Запиши.',quiz:['Что такое кризис?'],video:'i2J3K4L5m6N'},
{title:'Memento mori',theory:'Смерть.',practice:'Эпитафия.',quiz:['Зачем помнить смерть?'],video:'o7P8Q9R0s1T'},
{title:'Икигай',theory:'4 сферы.',practice:'4 круга.',quiz:['4 сферы?'],video:'u2V3W4X5y6Z'},
{title:'Логотерапия',theory:'Франкл.',practice:'Зачем.',quiz:['3 источника смысла?'],video:'a7B8C9D0e1F'},
{title:'Стоицизм',theory:'Дихотомия.',practice:'Вечером.',quiz:['Что в моей власти?'],video:'g2H3I4j5K6l'},
{title:'Ценности',theory:'5 главных.',practice:'Выпиши.',quiz:['Сколько ценностей?'],video:'m7N8O9P0q1R'},
{title:'Действие',theory:'Сартр.',practice:'1 шаг.',quiz:['Кто создаёт смысл?'],video:'s2T3U4V5w6X'},
{title:'Связь',theory:'С большим.',practice:'Найди.',quiz:['Что такое трансцендентное?'],video:'y7Z8A9B0c1D'},
{title:'Практика',theory:'Ежедневно.',practice:'Ритуал.',quiz:['Что главное?'],video:'e2F3G4H5i6J'},
{title:'Наследие',theory:'Что оставишь?',practice:'3 вещи.',quiz:['Какой след?'],video:'k7L8M9N0o1P'}
]},
{id:'stress_management',title:'Управление стрессом',emoji:'⚡',category:'Психика',hours:4,lessons:[
{title:'Различить',theory:'Острый vs хронический.',practice:'Дневник.',quiz:['Что такое хронический?'],video:'q2R3S4T5u6V'},
{title:'Сапольски',theory:'Почему зебры не болеют.',practice:'Пойми.',quiz:['Что делает кортизол?'],video:'w7X8Y9Z0a1B'},
{title:'Дыхание',theory:'4-7-8, box.',practice:'3 техники.',quiz:['Как дышать при стрессе?'],video:'c2D3E4F5g6H'},
{title:'Медитация',theory:'5-10 мин.',practice:'10 мин.',quiz:['Как медитировать?'],video:'i7J8K9L0m1N'},
{title:'Спорт',theory:'30 мин.',practice:'Прогулка.',quiz:['Зачем спорт?'],video:'o2P3Q4R5s6T'},
{title:'Природа',theory:'2 ч/нед.',practice:'В парк.',quiz:['Сколько на природе?'],video:'u7V8W9X0y1Z'},
{title:'Связи',theory:'1 контакт.',practice:'Позвони.',quiz:['Зачем связи?'],video:'a2B3C4D5e6F'},
{title:'Границы',theory:'Уведомления выкл.',practice:'Отключи.',quiz:['Что отключить?'],video:'g7H8I9J0k1L'},
{title:'Сон',theory:'7-9 ч.',practice:'Режим.',quiz:['Сколько сна?'],video:'m2N3O4P5q6R'},
{title:'Система',theory:'Личная.',practice:'Напиши.',quiz:['Что главное?'],video:'s7T8U9V0w1X'}
]},
{id:'confidence_master',title:'Уверенность',emoji:'🦁',category:'Личное',hours:3,lessons:[
{title:'Навык',theory:'Не врождённое.',practice:'Бандура.',quiz:['Что такое self-efficacy?'],video:'y2Z3A4B5c6D'},
{title:'Победы',theory:'Каждый день.',practice:'3 победы.',quiz:['Что писать?'],video:'e7F8G9H0i1J'},
{title:'Тело',theory:'Осанка.',practice:'Спи прямо.',quiz:['Что делает поза?'],video:'k2L3M4N5o6P'},
{title:'Знания',theory:'Эксперт.',practice:'20 часов.',quiz:['Как стать экспертом?'],video:'q7R8S9T0u1V'},
{title:'Без сравнения',theory:'С собой.',practice:'Сравни.',quiz:['Зачем?'],video:'w2X3Y4Z5a6B'},
{title:'Принятие',theory:'Не идеален.',practice:'Ошибку.',quiz:['Что такое уязвимость?'],video:'c7D8E9F0g1H'},
{title:'Публично',theory:'Выступай.',practice:'3 мин.',quiz:['Зачем выступать?'],video:'i2J3K4L5m6N'},
{title:'Отказ',theory:'Учись.',practice:'3 раза.',quiz:['Как относиться к отказу?'],video:'o7P8Q9R0s1T'},
{title:'Риск',theory:'Действуй.',practice:'1 риск.',quiz:['Что такое зона роста?'],video:'u2V3W4X5y6Z'},
{title:'Система',theory:'Ежедневно.',practice:'Ритуал.',quiz:['Что главное?'],video:'a7B8C9D0e1F'}
]},
{id:'home_master',title:'Мастер дома',emoji:'🏡',category:'Личное',hours:3,lessons:[
{title:'Порядок',theory:'Порядок = ясность.',practice:'Уборка 1 час.',quiz:['Что даёт?'],video:'g2H3I4j5K6l'},
{title:'Свет',theory:'Утром яркий, вечером тёплый.',practice:'Лампы.',quiz:['Что утром?'],video:'m7N8O9P0q1R'},
{title:'Тишина',theory:'Наушники, шторы.',practice:'Проверь.',quiz:['Как сделать?'],video:'s2T3U4V5w6X'},
{title:'Эргономика',theory:'Стол, стул, монитор.',practice:'Проверь.',quiz:['Как поставить монитор?'],video:'y7Z8A9B0c1D'},
{title:'Растения',theory:'Зелень улучшает воздух.',practice:'Купи 3.',quiz:['Зачем?'],video:'e2F3G4H5i6J'},
{title:'Запахи',theory:'Ароматы для фокуса.',practice:'Попробуй.',quiz:['Какой?'],video:'k7L8M9N0o1P'},
{title:'Соблазны',theory:'Убери телефон.',practice:'В ящик.',quiz:['Где?'],video:'q2R3S4T5u6V'},
{title:'Инструменты',theory:'1 задача — 1 место.',practice:'Организуй.',quiz:['Что где?'],video:'w7X8Y9Z0a1B'},
{title:'Минимализм',theory:'Меньше — больше.',practice:'Выброси 10.',quiz:['Что оставить?'],video:'c2D3E4F5g6H'},
{title:'Система',theory:'Ежедневно 10 мин.',practice:'Привычка.',quiz:['Как?'],video:'i7J8K9L0m1N'}
]},
{id:'investing_master',title:'Мастер инвестиций',emoji:'📈',category:'Финансы',hours:6,lessons:[
{title:'Основы',theory:'Деньги работают.',practice:'Изучи 1 фонд.',quiz:['Что такое ETF?'],video:'o2P3Q4R5s6T'},
{title:'Индексные фонды',theory:'S&P 500, MSCI World.',practice:'Сравни 3.',quiz:['Что такое индекс?'],video:'u7V8W9X0y1Z'},
{title:'DCA',theory:'Dollar-cost averaging.',practice:'Ежемесячно.',quiz:['Что такое DCA?'],video:'a2B3C4D5e6F'},
{title:'Диверсификация',theory:'Не клади в одну корзину.',practice:'Распредели.',quiz:['Зачем диверсификация?'],video:'g7H8I9J0k1L'},
{title:'Риск-профиль',theory:'Агрессивный/умеренный/консервативный.',practice:'Определи.',quiz:['Какой у тебя?'],video:'m2N3O4P5q6R'},
{title:'Сложный процент',theory:'Восьмое чудо света.',practice:'Посчитай.',quiz:['Как работает?'],video:'s7T8U9V0w1X'},
{title:'Ребалансировка',theory:'Раз в год.',practice:'План.',quiz:['Зачем?'],video:'y2Z3A4B5c6D'},
{title:'Психология',theory:'Не паникуй при падении.',practice:'Дневник.',quiz:['Что делать при -30%?'],video:'e7F8G9H0i1J'},
{title:'Налоги',theory:'ИИС, вычеты.',practice:'Оформи.',quiz:['Что даёт ИИС?'],video:'k2L3M4N5o6P'},
{title:'FIRE',theory:'25× расходов.',practice:'Посчитай.',quiz:['Что такое FIRE?'],video:'q7R8S9T0u1V'}
]},
{id:'charisma_course',title:'Харизма',emoji:'✨',category:'Общение',hours:4,lessons:[
{title:'Что такое харизма',theory:'Присутствие + тепло + сила.',practice:'Оцени себя.',quiz:['3 компонента?'],video:'w2X3Y4Z5a6B'},
{title:'Присутствие',theory:'Быть здесь и сейчас.',practice:'3 разговора.',quiz:['Что такое присутствие?'],video:'c7D8E9F0g1H'},
{title:'Тепло',theory:'Искренний интерес.',practice:'Задай 5 вопросов.',quiz:['Как показать тепло?'],video:'i2J3K4L5m6N'},
{title:'Сила',theory:'Уверенность без агрессии.',practice:'Осанка.',quiz:['Что такое сила?'],video:'o7P8Q9R0s1T'},
{title:'Слушание',theory:'Уровень 3.',practice:'Парафраз.',quiz:['3 уровня?'],video:'u2V3W4X5y6Z'},
{title:'Истории',theory:'Сторителлинг.',practice:'Рассказ 3 мин.',quiz:['Что в истории?'],video:'a7B8C9D0e1F'},
{title:'Голос',theory:'Тембр, паузы, темп.',practice:'Запиши себя.',quiz:['Что улучшить?'],video:'g2H3I4j5K6l'},
{title:'Тело',theory:'Поза, жесты, взгляд.',practice:'Тренируй.',quiz:['Что важно?'],video:'m7N8O9P0q1R'},
{title:'Сообщество',theory:'Собирай людей.',practice:'Митап.',quiz:['Зачем?'],video:'s2T3U4V5w6X'},
{title:'Система',theory:'Харизма — навык.',practice:'План.',quiz:['Как развивать?'],video:'y7Z8A9B0c1D'}
]},
{id:'digital_focus',title:'Цифровой фокус',emoji:'🎯',category:'Цифровое',hours:4,lessons:[
{title:'Уведомления',theory:'Отключи всё, кроме важного.',practice:'Проверь.',quiz:['Что оставить?'],video:'e2F3G4H5i6J'},
{title:'Один экран',theory:'Моно-задача.',practice:'Работа с 1 окном.',quiz:['Зачем?'],video:'k7L8M9N0o1P'},
{title:'Авиарежим',theory:'90 мин.',practice:'Блок.',quiz:['Сколько?'],video:'q2R3S4T5u6V'},
{title:'Среда',theory:'Соблазны неудобны.',practice:'Убери 3.',quiz:['Что убрать?'],video:'w7X8Y9Z0a1B'},
{title:'Восстановление',theory:'Перерывы без телефона.',practice:'6 перерывов.',quiz:['Как отдыхать?'],video:'c2D3E4F5g6H'},
{title:'Вечер',theory:'2 ч без экрана.',practice:'Режим.',quiz:['Зачем?'],video:'i7J8K9L0m1N'},
{title:'Замены',theory:'Книга, прогулка.',practice:'1 замена.',quiz:['Что вместо?'],video:'o2P3Q4R5s6T'},
{title:'Инструменты',theory:'Forest, Freedom.',practice:'Установи.',quiz:['Что делает Forest?'],video:'u7V8W9X0y1Z'},
{title:'Метрики',theory:'Замер раз в неделю.',practice:'Запиши.',quiz:['Зачем мерить?'],video:'a2B3C4D5e6F'},
{title:'Система',theory:'Личная система.',practice:'План.',quiz:['Что главное?'],video:'g7H8I9J0k1L'}
]},
{id:'stoicism_course',title:'Стоицизм на практике',emoji:'🏛',category:'Психика',hours:4,lessons:[
{title:'Что такое стоицизм',theory:'Марк Аврелий, Сенека, Эпиктет.',practice:'Прочти 3 цитаты.',quiz:['3 главных стоика?'],video:'yu7n6Zk3R4U'},
{title:'Дихотомия контроля',theory:'В моей власти / не в моей.',practice:'Разбери 5 ситуаций.',quiz:['Что в моей власти?'],video:'Hs6s3gY4c8g'},
{title:'Memento mori',theory:'Помни о смерти.',practice:'Напиши эпитафию.',quiz:['Зачем помнить смерть?'],video:'Y7m5c9V3K8s'},
{title:'Premeditatio malorum',theory:'Заранее представь худшее.',practice:'3 сценария.',quiz:['Что это даёт?'],video:'F3n8J7p2Q9k'},
{title:'Управление эмоциями',theory:'Пауза между стимулом и реакцией.',practice:'6 секунд.',quiz:['Что делать при гневе?'],video:'R2b5v8L4m7x'},
{title:'Вечерняя рефлексия',theory:'Что сделал хорошо, что можно лучше.',practice:'Дневник.',quiz:['Как рефлексировать?'],video:'H9k3j5N2p8q'},
{title:'Утро стоика',theory:'Планируй препятствия.',practice:'Ритуал.',quiz:['Что утром?'],video:'M4p7s9R2n6k'},
{title:'Смысл через действие',theory:'Не слова, а поступки.',practice:'1 действие.',quiz:['Что главное?'],video:'V2k8j5N9p3x'},
{title:'Стоицизм и общество',theory:'Служение другим.',practice:'Помоги 1.',quiz:['Зачем помогать?'],video:'W7n3K9s2P5r'},
{title:'Личная система',theory:'Собери всё вместе.',practice:'План.',quiz:['Что оставить?'],video:'B2v8L5k9N3m'}
]},
{id:'yoga_master',title:'Мастер йоги',emoji:'🧘',category:'Здоровье',hours:5,lessons:[
{title:'Дыхание',theory:'Пранаяма.',practice:'5 мин.',quiz:['Что такое пранаяма?'],video:'L8m3J5k2R7n'},
{title:'Позы стоя',theory:'Тадасана, вирабхадрасана.',practice:'3 позы.',quiz:['Что такое тадасана?'],video:'H2n8K5j3P9m'},
{title:'Балансы',theory:'Врикшасана.',practice:'1 поза.',quiz:['Что такое врикшасана?'],video:'V7k3N9s2P5r'},
{title:'Скрутки',theory:'Ардха матсиендрасана.',practice:'3 скрутки.',quiz:['Что такое скрутка?'],video:'B2v8L5k9N3m'},
{title:'Наклоны',theory:'Уттанасана.',practice:'3 наклона.',quiz:['Что такое уттанасана?'],video:'N5j8K2m4P9r'},
{title:'Прогибы',theory:'Бхуджангасана.',practice:'3 прогиба.',quiz:['Что такое бхуджангасана?'],video:'H9k3j5N2p8q'},
{title:'Перевёрнутые',theory:'Сиршасана.',practice:'Стойка у стены.',quiz:['Что такое сиршасана?'],video:'M4p7s9R2n6k'},
{title:'Шавасана',theory:'Финальная релаксация.',practice:'10 мин.',quiz:['Что такое шавасана?'],video:'V2k8j5N9p3x'},
{title:'Медитация',theory:'Дхьяна.',practice:'10 мин.',quiz:['Что такое дхьяна?'],video:'W7n3K9s2P5r'},
{title:'Последовательность',theory:'Винаяса.',practice:'30 мин.',quiz:['Что такое винаяса?'],video:'B2v8L5k9N3m'}
]},
{id:'mindfulness_course',title:'Mindfulness',emoji:'🌿',category:'Психика',hours:4,lessons:[
{title:'Что такое mindfulness',theory:'Осознанность.',practice:'5 мин.',quiz:['Что такое осознанность?'],video:'N5j8K2m4P9r'},
{title:'Дыхание',theory:'Anchoring.',practice:'10 мин.',quiz:['Что такое якорь?'],video:'H9k3j5N2p8q'},
{title:'Сканирование тела',theory:'Body scan.',practice:'15 мин.',quiz:['Что такое body scan?'],video:'M4p7s9R2n6k'},
{title:'Принятие',theory:'Не борись.',practice:'Практика.',quiz:['Что такое принятие?'],video:'V2k8j5N9p3x'},
{title:'Пища',theory:'Осознанное питание.',practice:'1 приём.',quiz:['Что это?'],video:'W7n3K9s2P5r'},
{title:'Ходьба',theory:'Walking meditation.',practice:'15 мин.',quiz:['Что это?'],video:'B2v8L5k9N3m'},
{title:'Эмоции',theory:'RAIN.',practice:'Практика.',quiz:['Что такое RAIN?'],video:'N5j8K2m4P9r'},
{title:'Отношения',theory:'Осознанное слушание.',practice:'3 разговора.',quiz:['Что это?'],video:'H9k3j5N2p8q'},
{title:'Работа',theory:'Mindful work.',practice:'1 задача.',quiz:['Что это?'],video:'M4p7s9R2n6k'},
{title:'Система',theory:'Ежедневно.',practice:'План.',quiz:['Что главное?'],video:'V2k8j5N9p3x'}
]}
];

/* ============ УРОВНИ (5) ============ */
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

/* ============ ACHIEVEMENTS ============ */
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
{id:'english_start',icon:'🇬🇧',name:'English',tier:'common',check:function(s){return s.englishProgress&&Object.keys(s.englishProgress).length>=1},progress:function(s){return Math.min(1,Object.keys(s.englishProgress||{}).length/1)},goal:1},
{id:'english_master',icon:'🎓',name:'English Master',tier:'epic',check:function(s){return s.englishProgress&&Object.keys(s.englishProgress).length>=125},progress:function(s){return Math.min(1,Object.keys(s.englishProgress||{}).length/125)},goal:125},
{id:'meditation_10',icon:'🧘',name:'10 медитаций',tier:'common',check:function(s){return (s.customMeditation||[]).length>=10},progress:function(s){return Math.min(1,(s.customMeditation||[]).length/10)},goal:10},
{id:'workout_10',icon:'🏋️',name:'10 тренировок',tier:'common',check:function(s){return (s.customWorkouts||[]).length>=10},progress:function(s){return Math.min(1,(s.customWorkouts||[]).length/10)},goal:10},
{id:'water_100',icon:'💧',name:'100 стаканов',tier:'common',check:function(s){return (s.customWater||[]).reduce(function(a,w){return a+(w.count||0)},0)>=100},progress:function(s){return Math.min(1,(s.customWater||[]).reduce(function(a,w){return a+(w.count||0)},0)/100)},goal:100},
{id:'water_1000',icon:'🌊',name:'1000 стаканов',tier:'epic',check:function(s){return (s.customWater||[]).reduce(function(a,w){return a+(w.count||0)},0)>=1000},progress:function(s){return Math.min(1,(s.customWater||[]).reduce(function(a,w){return a+(w.count||0)},0)/1000)},goal:1000},
{id:'mood_30',icon:'💭',name:'30 настроений',tier:'common',check:function(s){return (s.customMood||[]).length>=30},progress:function(s){return Math.min(1,(s.customMood||[]).length/30)},goal:30},
{id:'entertainment_10',icon:'🎬',name:'Киноман',tier:'common',check:function(s){return (s.watched||[]).length>=10},progress:function(s){return Math.min(1,(s.watched||[]).length/10)},goal:10},
{id:'screen_detox',icon:'🚫',name:'Детокс',tier:'common',check:function(s){return (s.screenHabits||{})&&Object.keys(s.screenHabits).length>=7},progress:function(s){return Math.min(1,Object.keys(s.screenHabits||{}).length/7)},goal:7},
{id:'memory_master',icon:'🧠',name:'Мастер памяти',tier:'rare',check:function(s){return (s.memoryTraining||[]).length>=30},progress:function(s){return Math.min(1,(s.memoryTraining||[]).length/30)},goal:30},
{id:'goals_3',icon:'🎯',name:'3 цели',tier:'common',check:function(s){return (s.customGoals||[]).length>=3},progress:function(s){return Math.min(1,(s.customGoals||[]).length/3)},goal:3},
{id:'notes_50',icon:'📝',name:'50 заметок',tier:'rare',check:function(s){return (s.customNotes||[]).length>=50},progress:function(s){return Math.min(1,(s.customNotes||[]).length/50)},goal:50},
{id:'timer_10',icon:'⏱',name:'10 сессий',tier:'common',check:function(s){return (s.timerSessions||[]).length>=10},progress:function(s){return Math.min(1,(s.timerSessions||[]).length/10)},goal:10},
{id:'detox_30',icon:'🌱',name:'Курс 30 дней',tier:'epic',check:function(s){return (s.detoxCourseProgress&&Object.keys(s.detoxCourseProgress).length>=30)},progress:function(s){return Math.min(1,Object.keys(s.detoxCourseProgress||{}).length/30)},goal:30},
{id:'challenge_10',icon:'🔥',name:'10 челленджей',tier:'rare',check:function(s){return Object.keys(s.challengeProgress||{}).length>=10},progress:function(s){return Math.min(1,Object.keys(s.challengeProgress||{}).length/10)},goal:10},
{id:'level_up_5',icon:'⭐',name:'Уровень 5',tier:'common',check:function(s){return (s.level||0)>=5},progress:function(s){return Math.min(1,(s.level||0)/5)},goal:5},
{id:'level_up_10',icon:'🌟',name:'Уровень 10',tier:'rare',check:function(s){return (s.level||0)>=10},progress:function(s){return Math.min(1,(s.level||0)/10)},goal:10},
{id:'early_riser',icon:'🌅',name:'Ранняя птица',tier:'common',check:function(s){return (s.stats.earlyRiser||0)>=7},progress:function(s){return Math.min(1,(s.stats.earlyRiser||0)/7)},goal:7},
{id:'no_phone_day',icon:'📵',name:'День без телефона',tier:'rare',check:function(s){return (s.stats.noPhoneDays||0)>=1},progress:function(s){return Math.min(1,(s.stats.noPhoneDays||0)/1)},goal:1},
{id:'deep_work_100h',icon:'🎯',name:'100 часов Deep Work',tier:'epic',check:function(s){return (s.stats.deepWorkHours||0)>=100},progress:function(s){return Math.min(1,(s.stats.deepWorkHours||0)/100)},goal:100},
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

/* ============ TABS (без English снизу) ============ */
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
window.COURSES_LIBRARY=COURSES_LIBRARY;
window.LEARNING_LEVELS=LEARNING_LEVELS;
window.ENGLISH_LEVELS=ENGLISH_LEVELS;
window.ENTERTAINMENT_LIBRARY=ENTERTAINMENT_LIBRARY;
window.ACHIEVEMENTS=ACHIEVEMENTS;
window.checkLevelComplete=checkLevelComplete;
window.levelProgress=levelProgress;
window.METHODS_LIBRARY=METHODS_LIBRARY;
window.PERSONAS=PERSONAS;
window.TABS=TABS;
window.QUICK_TABS=QUICK_TABS;
window.HABITS_TEMPLATES=HABITS_TEMPLATES;
window.GOALS_TEMPLATES=GOALS_TEMPLATES;
window.todayKey=todayKey;
window.yesterdayKey=yesterdayKey;