'use strict';
/* AI HEALTH v33 — CONTENT (всё в одном: темы, домены, обучение, достижения, детокс, экран) */

/* ============ ТЕМЫ (50) ============ */
var THEMES=[
{id:'dark',emoji:'🌙',name:'Тёмная',color:'#000',effects:'stars'},
{id:'light',emoji:'☀️',name:'Светлая',color:'#f5f5fa',effects:'none'},
{id:'ocean',emoji:'🌊',name:'Океан',color:'#000814',effects:'waves'},
{id:'sakura',emoji:'🌸',name:'Сакура',color:'#1a0f14',effects:'petals'},
{id:'forest',emoji:'🌲',name:'Лес',color:'#0a1410',effects:'leaves'},
{id:'sunset',emoji:'🌅',name:'Закат',color:'#1a0a05',effects:'stars'},
{id:'ice',emoji:'❄️',name:'Лёд',color:'#0a1419',effects:'snow'},
{id:'amethyst',emoji:'💎',name:'Аметист',color:'#12061f',effects:'spark'},
{id:'pumpkin',emoji:'🎃',name:'Тыква',color:'#0d0500',effects:'dust'},
{id:'vampire',emoji:'🦇',name:'Вампир',color:'#0a0000',effects:'dust'},
{id:'ghost',emoji:'👻',name:'Призрак',color:'#0a0814',effects:'spark'},
{id:'web',emoji:'🕸',name:'Паутина',color:'#001410',effects:'stars'},
{id:'aurora',emoji:'🌌',name:'Аврора',color:'#050a15',effects:'waves'},
{id:'desert',emoji:'🏜',name:'Пустыня',color:'#1a1208',effects:'dust'},
{id:'cyber',emoji:'⚡',name:'Кибер',color:'#0a0014',effects:'spark'},
{id:'mono',emoji:'⚫',name:'Моно',color:'#0a0a0a',effects:'none'},
{id:'lava',emoji:'🔥',name:'Лава',color:'#140000',effects:'dust'},
{id:'mint',emoji:'🌿',name:'Мята',color:'#08140f',effects:'waves'},
{id:'coffee',emoji:'☕',name:'Кофе',color:'#1a0e08',effects:'dust'},
{id:'neon',emoji:'💡',name:'Неон',color:'#000',effects:'spark'},
{id:'sunrise',emoji:'🌄',name:'Рассвет',color:'#1a0d0a',effects:'stars'},
{id:'rain',emoji:'🌧',name:'Дождь',color:'#0a1018',effects:'rain'},
{id:'storm',emoji:'⛈',name:'Гроза',color:'#0a0a14',effects:'rain'},
{id:'crystal',emoji:'🔮',name:'Кристалл',color:'#0a1420',effects:'spark'},
{id:'ember',emoji:'🔥',name:'Угли',color:'#140800',effects:'dust'},
{id:'holo',emoji:'🌈',name:'Голограмма',color:'#000814',effects:'spark'},
{id:'moon',emoji:'🌕',name:'Луна',color:'#0a0a1a',effects:'stars'},
{id:'sand',emoji:'🏖',name:'Песок',color:'#1a1408',effects:'dust'},
{id:'sakura-night',emoji:'🌺',name:'Сакура-ночь',color:'#14081a',effects:'petals'},
{id:'deep',emoji:'🌊',name:'Глубина',color:'#000a14',effects:'waves'},
{id:'rose',emoji:'🌹',name:'Роза',color:'#1a0810',effects:'petals'},
{id:'bamboo',emoji:'🎋',name:'Бамбук',color:'#0a1408',effects:'leaves'},
{id:'cosmos',emoji:'🌠',name:'Космос',color:'#0a0014',effects:'stars'},
{id:'matrix',emoji:'💚',name:'Матрица',color:'#000a00',effects:'spark'},
{id:'gold',emoji:'🥇',name:'Золото',color:'#0a0800',effects:'spark'},
{id:'silver',emoji:'🥈',name:'Серебро',color:'#0a0a0f',effects:'stars'},
{id:'coral',emoji:'🐠',name:'Коралл',color:'#1a0e0a',effects:'waves'},
{id:'nebula',emoji:'🌫',name:'Туманность',color:'#0a0514',effects:'stars'},
{id:'polar',emoji:'🧊',name:'Полярная',color:'#0a1520',effects:'snow'},
{id:'jungle',emoji:'🌴',name:'Джунгли',color:'#0a1a0a',effects:'leaves'},
{id:'royal',emoji:'👑',name:'Королевская',color:'#0a0514',effects:'spark'},
{id:'forest-night',emoji:'🌲',name:'Ночной лес',color:'#08100a',effects:'fireflies'},
{id:'fire',emoji:'🔥',name:'Огонь',color:'#140600',effects:'dust'},
{id:'frost',emoji:'❄',name:'Мороз',color:'#0a1525',effects:'snow'},
{id:'spirit',emoji:'✨',name:'Дух',color:'#14082a',effects:'spark'},
{id:'time',emoji:'⏳',name:'Время',color:'#0a0e14',effects:'stars'},
{id:'money',emoji:'💰',name:'Деньги',color:'#0a1408',effects:'spark'},
{id:'love',emoji:'❤️',name:'Любовь',color:'#1a0810',effects:'hearts'},
{id:'zen',emoji:'🧘',name:'Дзен',color:'#0a1410',effects:'leaves'}
];

/* ============ ДОМЕНЫ (10) ============ */
var DOMAINS=[
{id:'physical',emoji:'💪',name:'Физическое',color:'#ff7ba9',desc:'Тело, сила, выносливость',metrics:[],learning:'Уровни 1-5 + 15 навыков Здоровья'},
{id:'mental',emoji:'🧠',name:'Ментальное',color:'#4dd4ff',desc:'Фокус, память, ясность',metrics:[],learning:'Модуль Память + IQ + 18 навыков'},
{id:'emotional',emoji:'❤️',name:'Эмоциональное',color:'#ff6b6b',desc:'Чувства, стресс',metrics:[],learning:'Модуль EQ + 12 навыков'},
{id:'spiritual',emoji:'🕊',name:'Духовное',color:'#b394ff',desc:'Смысл, ценности',metrics:[],learning:'Уровни 4-5 + 5 навыков'},
{id:'financial',emoji:'💰',name:'Финансовое',color:'#ffcc4d',desc:'Бюджет, инвестиции',metrics:[],learning:'Модуль Финансы + 10 навыков'},
{id:'career',emoji:'💼',name:'Карьерное',color:'#3ddc97',desc:'Навыки, позиция',metrics:[],learning:'8 навыков Карьеры'},
{id:'social',emoji:'👥',name:'Социальное',color:'#c4b5fd',desc:'Семья, друзья',metrics:[],learning:'10 навыков + 6 отношений'},
{id:'environment',emoji:'🏠',name:'Среда',color:'#a4e7ff',desc:'Пространство, свет',metrics:[],learning:'Уровни 1-2'},
{id:'recovery',emoji:'⏰',name:'Восстановление',color:'#4dd4ff',desc:'Сон, отдых',metrics:[],learning:'15 навыков Здоровья'},
{id:'digital',emoji:'📱',name:'Цифровое',color:'#ff88cc',desc:'Экран, детокс',metrics:[],learning:'30-дневный курс + 6 навыков'}
];

/* ============ МУДРОСТИ (30) ============ */
var DAILY_WISDOMS=[
{text:'Ты не ленивый. Ты либо устал, либо не видишь смысла, либо боишься.',author:'Неизвестный',apply:'Что из 3 — моё?'},
{text:'Дисциплина — это выбор между тем, что хочешь сейчас, и тем, что хочешь больше всего.',author:'Авраам Линкольн',apply:'Спроси: что я хочу больше всего?'},
{text:'Мы — то, что делаем постоянно. Совершенство — не действие, а привычка.',author:'Аристотель',apply:'Что ты делаешь каждый день?'},
{text:'Между стимулом и реакцией есть пространство. В нём — наша свобода.',author:'Виктор Франкл',apply:'Дыши 6 секунд перед реакцией'},
{text:'Счастье — это не то, что ты имеешь, а то, что ты чувствуешь.',author:'Даг Хэммершолд',apply:'Запиши 3 благодарности'},
{text:'Ты не можешь вернуться и изменить начало, но можешь начать сейчас и изменить конец.',author:'К.С. Льюис',apply:'Что ты можешь сделать за 2 минуты?'},
{text:'Единственный способ делать великую работу — любить то, что делаешь.',author:'Стив Джобс',apply:'Что ты делаешь с любовью?'},
{text:'Сложнее всего начать действовать, всё остальное зависит только от упорства.',author:'Амелия Эрхарт',apply:'Начни с 2 минут'},
{text:'Тот, кто владеет собой, владеет миром.',author:'Сенека',apply:'Где ты потерял контроль?'},
{text:'Мы становимся тем, о чём думаем.',author:'Будда',apply:'О чём ты думаешь сейчас?'},
{text:'Победа над собой — величайшая победа.',author:'Платон',apply:'В чём ты можешь превзойти себя?'},
{text:'Секрет перемен в том, чтобы сосредоточить всю свою энергию не на борьбе со старым, а на создании нового.',author:'Сократ',apply:'Что ты создаёшь вместо старого?'},
{text:'Если хочешь изменить мир — начни с себя.',author:'Махатма Ганди',apply:'Что ты изменишь сегодня?'},
{text:'Жизнь — это 10% того, что происходит с нами, и 90% того, как мы реагируем.',author:'Чарльз Свиндолл',apply:'Как ты реагируешь на проблему?'},
{text:'Каждый день — это новая возможность изменить свою жизнь.',author:'Неизвестный',apply:'Что ты изменишь сегодня?'},
{text:'Не сравнивай себя с другими. Сравнивай с собой вчерашним.',author:'Джордан Питерсон',apply:'Насколько ты вырос?'},
{text:'Успех — это сумма маленьких усилий, повторяемых день за днём.',author:'Роберт Кольер',apply:'Какое маленькое усилие ты сделаешь?'},
{text:'Всё, что ты можешь сделать, — это начать.',author:'Неизвестный',apply:'Что ты начнёшь сегодня?'},
{text:'Измени свои мысли — изменится твоя жизнь.',author:'Уэйн Дайер',apply:'О чём ты думаешь?'},
{text:'Великие дела не делаются в зоне комфорта.',author:'Неизвестный',apply:'Что ты сделаешь вне комфорта?'},
{text:'Страх — это не то, что ты должен бояться. Это то, что ты должен преодолеть.',author:'Неизвестный',apply:'Сделай одно страшное дело'},
{text:'Ты сильнее, чем кажется. Смелее, чем верится. Умнее, чем думается.',author:'А.А. Милн',apply:'Вспомни свою прошлую победу'},
{text:'Утро определяет день. Начни с правильной привычки.',author:'Робин Шарма',apply:'Сделай утренний ритуал'},
{text:'Не трать время на сожаления. Используй его на действие.',author:'Неизвестный',apply:'Что ты можешь сделать сейчас?'},
{text:'Ты — не свои мысли. Ты — тот, кто их наблюдает.',author:'Экхарт Толле',apply:'Наблюдай свои мысли'},
{text:'Действие — главный ключ к успеху.',author:'Пабло Пикассо',apply:'Сделай одно действие'},
{text:'Стресс — не то, что происходит, а то, что ты думаешь о происходящем.',author:'Эндрю Бернстейн',apply:'Что ты думаешь о проблеме?'},
{text:'Разница между тем, кто ты, и тем, кем хочешь быть — в том, что ты делаешь.',author:'Неизвестный',apply:'Что ты сделаешь сегодня?'},
{text:'Сон — основа всего. Приоритет №1.',author:'Мэттью Уокер',apply:'Спи сегодня 7-9 часов'},
{text:'Каждый день делай что-то, что тебя пугает.',author:'Элеонор Рузвельт',apply:'Что тебя пугает?'}
];

function getTodayWisdom(){
  try{
    if(!window.DAILY_WISDOMS||!window.DAILY_WISDOMS.length)return{text:'Начни.',author:'Неизвестный',apply:'Сейчас'};
    var i=Math.floor(Date.now()/86400000)%window.DAILY_WISDOMS.length;
    return window.DAILY_WISDOMS[i];
  }catch(e){return{text:'Начни.',author:'Неизвестный',apply:'Сейчас'}}
}

/* ============ ЧЕЛЛЕНДЖИ (20) ============ */
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
{id:'ch_sleep_early',title:'Сон до 23:00',desc:'Ляг спать до 23:00',reward:25,category:'health'},
{id:'ch_cold_shower',title:'Холодный душ',desc:'2 минуты холодной воды',reward:25,category:'health'},
{id:'ch_nature_30',title:'Природа 30 мин',desc:'Прогулка на природе',reward:20,category:'spiritual'},
{id:'ch_learn_lesson',title:'1 урок обучения',desc:'Пройди урок',reward:20,category:'mental'},
{id:'ch_1_goal',title:'Прогресс к цели',desc:'Сделай шаг к цели',reward:25,category:'productivity'},
{id:'ch_breathing_478',title:'Дыхание 4-7-8',desc:'4 цикла утром и вечером',reward:15,category:'emotional'},
{id:'ch_no_phone_bed',title:'Телефон вне спальни',desc:'Ночь без телефона',reward:25,category:'digital'}
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

/* ============ РЕЖИМЫ ============ */
var WORK_MODES=[
{id:'work',name:'Работа',emoji:'💼',desc:'Только задачи и продуктивность',color:'#5b9eff'},
{id:'rest',name:'Отдых',emoji:'🌿',desc:'Только досуг и здоровье',color:'#3ddc97'},
{id:'sleep',name:'Сон',emoji:'🌙',desc:'Только медитация и сон',color:'#a78bfa'},
{id:'study',name:'Учёба',emoji:'📚',desc:'Только обучение и английский',color:'#ffa940'}
];

/* ============ БАЗОВЫЙ ОПРОС (26) ============ */
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

/* ============ LEARNING_LEVELS (5 уровней) ============ */
var LEARNING_LEVELS=[
{id:'lvl1',num:1,emoji:'🌱',title:'Основы',subtitle:'Старт пути',desc:'Базовые принципы здоровья, продуктивности и мышления',
  modules:[
    {id:'m1_1',emoji:'💪',title:'Фундамент здоровья',desc:'Сон, вода, движение',
      lessons:[
        {title:'Сон — основа всего',theory:'**7-9 часов.** Медленный сон = факты, REM = эмоции.',practice:'Ляг сегодня на 30 мин раньше.'},
        {title:'Вода и гидратация',theory:'**30 мл/кг.** Утром 500 мл сразу.',practice:'8 стаканов сегодня.'},
        {title:'Движение каждый день',theory:'**150 мин кардио + 2 силовые в неделю.**',practice:'20 мин прогулка.'}
      ]},
    {id:'m1_2',emoji:'🧠',title:'Мышление',desc:'Базовые принципы',
      lessons:[
        {title:'Что такое продуктивность',theory:'**Результат, не занятость.**',practice:'3 главных дела на день.'},
        {title:'Приоритеты',theory:'**Матрица Эйзенхауэра.** Q2 — цель.',practice:'Разбери 5 задач по Q1-Q4.'},
        {title:'Привычки',theory:'**Петля: cue → craving → response → reward.** 66 дней.',practice:'1 новая привычка.'}
      ]},
    {id:'m1_3',emoji:'🎯',title:'Цели',desc:'Как ставить цели',
      lessons:[
        {title:'SMART-цели',theory:'**Specific, Measurable, Achievable, Relevant, Time-bound.**',practice:'1 цель по SMART.'},
        {title:'OKR',theory:'**Objectives + Key Results.**',practice:'1 цель + 3 KR.'},
        {title:'Долгосрочное планирование',theory:'**5 лет → 1 год → месяц → неделя.**',practice:'5-летний план.'}
      ]}
  ]},
{id:'lvl2',num:2,emoji:'⚡',title:'Практика',subtitle:'Углубление',desc:'Техники продуктивности, эмоционального интеллекта, финансов',
  modules:[
    {id:'m2_1',emoji:'🎯',title:'Deep Work',desc:'Глубокая работа',
      lessons:[
        {title:'Что такое Deep Work',theory:'**90 мин блок ×3-4 = 10 часов обычной.**',practice:'1 блок 90 мин.'},
        {title:'Pomodoro',theory:'**25/5 ×4 = 1 цикл.**',practice:'4 помидора.'},
        {title:'Time-blocking',theory:'**Каждое дело в слот.**',practice:'Заблокируй завтра.'}
      ]},
    {id:'m2_2',emoji:'❤️',title:'Эмоциональный интеллект',desc:'EQ',
      lessons:[
        {title:'5 компонентов EQ',theory:'**Самосознание, саморегуляция, мотивация, эмпатия, соц.навыки.**',practice:'Дневник эмоций.'},
        {title:'Саморегуляция',theory:'**Пауза 6 секунд.**',practice:'Пауза в конфликте.'},
        {title:'Эмпатия',theory:'**Слушай, не советуй.**',practice:'1 активное слушание.'}
      ]},
    {id:'m2_3',emoji:'💰',title:'Финансы',desc:'Основа',
      lessons:[
        {title:'50/30/20',theory:'**50% нужды, 30% желания, 20% сбережения.**',practice:'Посчитай бюджет.'},
        {title:'Подушка',theory:'**3-6 месяцев расходов.**',practice:'Открой отдельный счёт.'},
        {title:'Инвестиции',theory:'**Индексные фонды, DCA, долгосрочно.**',practice:'Изучи 3 фонда.'}
      ]}
  ]},
{id:'lvl3',num:3,emoji:'💎',title:'Мастерство',subtitle:'Продвинутый',desc:'Продвинутые техники, нейробиология, лидерство',
  modules:[
    {id:'m3_1',emoji:'🔬',title:'Нейробиология',desc:'Как работает мозг',
      lessons:[
        {title:'Нейропластичность',theory:'**Мозг меняется всю жизнь.**',practice:'Учи 1 навык 30 дней.'},
        {title:'Дофамин',theory:'**Предвкушение, не награда.**',practice:'Дофаминовое голодание 4 ч.'},
        {title:'Сон и память',theory:'**Консолидация во сне.**',practice:'Учи перед сном.'}
      ]},
    {id:'m3_2',emoji:'👑',title:'Лидерство',desc:'Вести людей',
      lessons:[
        {title:'Level 5 Leadership',theory:'**Скромность + воля.**',practice:'Развивай 1 человека.'},
        {title:'Делегирование',theory:'**Не делай сам.**',practice:'Отдай 3 задачи.'},
        {title:'SBI-фидбэк',theory:'**Situation-Behavior-Impact.**',practice:'Дай SBI 1 раз.'}
      ]},
    {id:'m3_3',emoji:'🌐',title:'Стратегия',desc:'Долгосрочное мышление',
      lessons:[
        {title:'Второй порядок',theory:'**А что потом? ×3.**',practice:'3 решения ×3 порядка.'},
        {title:'Инверсия',theory:'**Что мешает? Убери.**',practice:'Инверсия для 3 целей.'},
        {title:'Первые принципы',theory:'**До основы.**',practice:'Разбери 1 проблему.'}
      ]}
  ]},
{id:'lvl4',num:4,emoji:'🏆',title:'Мастер',subtitle:'Эксперт',desc:'Сложные системы, менторство, наследие',
  modules:[
    {id:'m4_1',emoji:'🎓',title:'Менторство',desc:'Обучать других',
      lessons:[
        {title:'Как быть ментором',theory:'**Вопросы > советы.**',practice:'Найди менти.'},
        {title:'GROW-модель',theory:'**Goal-Reality-Options-Will.**',practice:'Проведи 1 сессию.'},
        {title:'Обучение других',theory:'**Если не можешь объяснить — не понял.**',practice:'Объясни 3 темы.'}
      ]},
    {id:'m4_2',emoji:'🌍',title:'Системное мышление',desc:'Видеть целое',
      lessons:[
        {title:'Системы vs цели',theory:'**Изменение системы = результат.**',practice:'Анализ 3 систем.'},
        {title:'Обратные связи',theory:'**Петли усиления и баланса.**',practice:'Найди 3 петли.'},
        {title:'Точки воздействия',theory:'**Максимальный эффект.**',practice:'1 точка в жизни.'}
      ]},
    {id:'m4_3',emoji:'🕊',title:'Смысл',desc:'Зачем всё это',
      lessons:[
        {title:'Икигай',theory:'**4 сферы.**',practice:'4 списка.'},
        {title:'Логотерапия',theory:'**3 источника смысла.**',practice:'Найди своё.'},
        {title:'Наследие',theory:'**Что оставишь?**',practice:'Эпитафия.'}
      ]}
  ]},
{id:'lvl5',num:5,emoji:'🌟',title:'Легенда',subtitle:'Мастер жизни',desc:'Интеграция всего, мудрость, передача',
  modules:[
    {id:'m5_1',emoji:'🧘',title:'Мудрость',desc:'Глубина',
      lessons:[
        {title:'Стоицизм',theory:'**Дихотомия контроля.**',practice:'Вечером — что в моей власти.'},
        {title:'Memento Mori',theory:'**Помни о смерти.**',practice:'Пиши эпитафию.'},
        {title:'Присутствие',theory:'**Здесь и сейчас.**',practice:'10 мин тишины.'}
      ]},
    {id:'m5_2',emoji:'💫',title:'Интеграция',desc:'Всё вместе',
      lessons:[
        {title:'Баланс 10 доменов',theory:'**Все сферы важны.**',practice:'Оцени 10 доменов.'},
        {title:'Свой путь',theory:'**Уникальность.**',practice:'Опиши свой путь.'},
        {title:'Передача',theory:'**Учи других.**',practice:'Напиши гайд.'}
      ]},
    {id:'m5_3',emoji:'🚀',title:'Будущее',desc:'Что дальше',
      lessons:[
        {title:'Видение 10 лет',theory:'**Куда идёшь?**',practice:'Опиши 10 лет.'},
        {title:'Наследие',theory:'**Что после тебя?**',practice:'3 пункта наследия.'},
        {title:'Продолжение',theory:'**Путь бесконечен.**',practice:'План на год.'}
      ]}
  ]}
];

/* ============ ACHIEVEMENTS (33) ============ */
var ACHIEVEMENTS=[
{id:'first_task',icon:'✅',name:'Первая задача',check:function(s){return s.tasks.some(function(t){return t.status==='completed'})},progress:function(s){return s.tasks.filter(function(t){return t.status==='completed'}).length>0?1:0}},
{id:'first_lesson',icon:'🎓',name:'Первый урок',check:function(s){return Object.keys(s.levelProgress||{}).length>=1},progress:function(s){return Math.min(1,Object.keys(s.levelProgress||{}).length)}},
{id:'first_skill',icon:'💎',name:'Первый навык',check:function(s){return Object.keys(s.skillsProgress||{}).length>=1},progress:function(s){return Math.min(1,Object.keys(s.skillsProgress||{}).length)}},
{id:'first_water',icon:'💧',name:'Первая вода',check:function(s){return (s.customWater||[]).some(function(w){return w.count>=1})},progress:function(s){return s.customWater&&s.customWater.length>0?1:0}},
{id:'first_mood',icon:'💭',name:'Первое настроение',check:function(s){return (s.customMood||[]).length>=1},progress:function(s){return Math.min(1,(s.customMood||[]).length)}},
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
{id:'timer_10',icon:'⏱',name:'10 таймеров',check:function(s){return (s.timerSessions||[]).length>=10},progress:function(s){return Math.min(1,(s.timerSessions||[]).length/10)}},
{id:'focus_10',icon:'🎯',name:'10 фокусов',check:function(s){return (s.focusSessions||[]).length>=10},progress:function(s){return Math.min(1,(s.focusSessions||[]).length/10)}},
{id:'detox_7',icon:'📱',name:'7 дней детокса',check:function(s){return Object.keys(s.detoxCourseProgress||{}).length>=7},progress:function(s){return Math.min(1,Object.keys(s.detoxCourseProgress||{}).length/7)}},
{id:'detox_30',icon:'🏆',name:'30 дней детокса',check:function(s){return Object.keys(s.detoxCourseProgress||{}).length>=30},progress:function(s){return Math.min(1,Object.keys(s.detoxCourseProgress||{}).length/30)}},
{id:'xp_100',icon:'⭐',name:'100 XP',check:function(s){return (s.xp||0)>=100},progress:function(s){return Math.min(1,(s.xp||0)/100)}},
{id:'xp_1000',icon:'🌟',name:'1000 XP',check:function(s){return (s.xp||0)>=1000},progress:function(s){return Math.min(1,(s.xp||0)/1000)}},
{id:'xp_10000',icon:'✨',name:'10000 XP',check:function(s){return (s.xp||0)>=10000},progress:function(s){return Math.min(1,(s.xp||0)/10000)}},
{id:'level_5',icon:'🏅',name:'Уровень 5',check:function(s){return Math.floor((s.xp||0)/100)>=5},progress:function(s){return Math.min(1,Math.floor((s.xp||0)/100)/5)}},
{id:'level_10',icon:'👑',name:'Уровень 10',check:function(s){return Math.floor((s.xp||0)/100)>=10},progress:function(s){return Math.min(1,Math.floor((s.xp||0)/100)/10)}},
{id:'survey_done',icon:'📋',name:'Опрос пройден',check:function(s){return s.profile.surveyDone},progress:function(s){return s.profile.surveyDone?1:0}}
];

/* ============ COURSES (24 базовых) ============ */
var COURSES_LIBRARY=[
{id:'c_health_basics',emoji:'❤️',title:'Здоровье: база',category:'Здоровье',hours:6,lessons:[
{title:'Что такое здоровье',theory:'**Здоровье = физическое + ментальное + социальное.**',practice:'Оцени себя по 3 осям.'},
{title:'Сон — фундамент',theory:'**7-9 часов.**',practice:'Ляг раньше.'},
{title:'Питание',theory:'**500 г овощей, 1.6 г белка/кг.**',practice:'Добавь овощ.'},
{title:'Движение',theory:'**150 мин кардио + 2 силовые.**',practice:'20 мин прогулка.'},
{title:'Вода',theory:'**30 мл/кг.**',practice:'8 стаканов.'},
{title:'Стресс',theory:'**Кортизол убивает.**',practice:'Box breathing.'},
{title:'Восстановление',theory:'**7 видов отдыха.**',practice:'Определи дефицит.'},
{title:'Итог',theory:'**Система > мотивация.**',practice:'Составь план.'}
]},
{id:'c_sleep_master',emoji:'😴',title:'Мастер сна',category:'Здоровье',hours:4,lessons:[
{title:'Наука сна',theory:'**90-мин циклы.**'},
{title:'Циркадные ритмы',theory:'**Свет утром.**'},
{title:'Гигиена сна',theory:'**Темнота, 18-20°C.**'},
{title:'Экран и сон',theory:'**Синий свет.**'},
{title:'Кофеин',theory:'**8 часов полураспада.**'},
{title:'Ритуалы',theory:'**Одно время.**'},
{title:'Итог',theory:'**Сон = топливо.**'}
]},
{id:'c_fitness_master',emoji:'🏋️',title:'Мастер фитнеса',category:'Здоровье',hours:8,lessons:[
{title:'База',theory:'**Присед, становая, жим.**'},
{title:'Прогрессия',theory:'**+2.5 кг.**'},
{title:'Техника',theory:'**Спина прямая.**'},
{title:'Кардио',theory:'**Zone 2.**'},
{title:'Восстановление',theory:'**48 часов.**'},
{title:'Питание',theory:'**Белок 1.6-2.2 г/кг.**'},
{title:'Программа',theory:'**4 недели.**'},
{title:'Итог',theory:'**Регулярность.**'}
]},
{id:'c_productivity_master',emoji:'⚡',title:'Мастер продуктивности',category:'Продуктивность',hours:6,lessons:[
{title:'Что такое продуктивность',theory:'**Результат.**'},
{title:'Deep Work',theory:'**90 мин.**'},
{title:'Pomodoro',theory:'**25/5.**'},
{title:'Time-blocking',theory:'**Слоты.**'},
{title:'GTD',theory:'**5 шагов.**'},
{title:'Матрица Эйзенхауэра',theory:'**Q2 — цель.**'},
{title:'Eat That Frog',theory:'**Сложное первым.**'},
{title:'Итог',theory:'**Система.**'}
]},
{id:'c_deep_work',emoji:'🎯',title:'Deep Work',category:'Продуктивность',hours:4,lessons:[
{title:'Что такое Deep Work',theory:'**Концентрация.**'},
{title:'Стоимость переключения',theory:'**23 минуты.**'},
{title:'Ритуалы',theory:'**Одно место.**'},
{title:'Телефон',theory:'**Вне комнаты.**'},
{title:'Метрики',theory:'**Считай часы.**'},
{title:'Расписание',theory:'**3-4 часа.**'},
{title:'Итог',theory:'**Фокус.**'}
]},
{id:'c_memory_master',emoji:'🧠',title:'Мастер памяти',category:'Ментальное',hours:6,lessons:[
{title:'Типы памяти',theory:'**3 типа.**'},
{title:'Кривая Эббингауза',theory:'**58% за 20 мин.**'},
{title:'Локусы',theory:'**10 точек.**'},
{title:'Мнемоники',theory:'**Акроним.**'},
{title:'Чанкинг',theory:'**7±2.**'},
{title:'Активное припоминание',theory:'**Recall > Recognition.**'},
{title:'Интервалы',theory:'**Anki.**'},
{title:'Итог',theory:'**Система.**'}
]},
{id:'c_iq_boost',emoji:'🎯',title:'IQ-буст',category:'Ментальное',hours:6,lessons:[
{title:'Что такое IQ',theory:'**Fluid + crystallized.**'},
{title:'Логика',theory:'**Паттерны.**'},
{title:'Аналогии',theory:'**Связи.**'},
{title:'Рабочая память',theory:'**N-back.**'},
{title:'Критическое мышление',theory:'**5 вопросов.**'},
{title:'Математика',theory:'**Упрощения.**'},
{title:'Шахматы',theory:'**Стратегия.**'},
{title:'Итог',theory:'**Тренируется.**'}
]},
{id:'c_eq_master',emoji:'❤️',title:'Мастер EQ',category:'Эмоциональное',hours:6,lessons:[
{title:'Что такое EQ',theory:'**5 компонентов.**'},
{title:'Самосознание',theory:'**Дневник.**'},
{title:'Саморегуляция',theory:'**Пауза 6 сек.**'},
{title:'Мотивация',theory:'**Автономия.**'},
{title:'Эмпатия',theory:'**Слушай.**'},
{title:'Стресс',theory:'**Box breathing.**'},
{title:'Гнев',theory:'**Пауза + спорт.**'},
{title:'Итог',theory:'**Тренируется.**'}
]},
{id:'c_stress_master',emoji:'🌊',title:'Мастер стресса',category:'Эмоциональное',hours:4,lessons:[
{title:'Что такое стресс',theory:'**Реакция.**'},
{title:'Кортизол',theory:'**Убивает.**'},
{title:'Дыхание',theory:'**4-7-8.**'},
{title:'Спорт',theory:'**Сжигает.**'},
{title:'Медитация',theory:'**10 мин.**'},
{title:'Природа',theory:'**2 ч/нед.**'},
{title:'Сон',theory:'**Восстановление.**'},
{title:'Итог',theory:'**Управляем.**'}
]},
{id:'c_financial_literacy',emoji:'💰',title:'Финансовая грамотность',category:'Финансы',hours:6,lessons:[
{title:'Активы vs пассивы',theory:'**Активы приносят.**'},
{title:'Бюджет',theory:'**50/30/20.**'},
{title:'Подушка',theory:'**3-6 мес.**'},
{title:'Долги',theory:'**Лавина.**'},
{title:'Инвестиции',theory:'**Индексные.**'},
{title:'Сложный процент',theory:'**×2 за 7 лет.**'},
{title:'FIRE',theory:'**25×.**'},
{title:'Итог',theory:'**Система.**'}
]},
{id:'c_career_master',emoji:'💼',title:'Мастер карьеры',category:'Карьера',hours:6,lessons:[
{title:'Икигай',theory:'**4 сферы.**'},
{title:'Навыки',theory:'**T-shape.**'},
{title:'Резюме',theory:'**1 стр.**'},
{title:'Собеседование',theory:'**STAR.**'},
{title:'Переговоры',theory:'**Не сразу.**'},
{title:'Нетворкинг',theory:'**Дай первым.**'},
{title:'Бренд',theory:'**Публикуй.**'},
{title:'Итог',theory:'**План.**'}
]},
{id:'c_leadership',emoji:'👑',title:'Лидерство',category:'Карьера',hours:6,lessons:[
{title:'Level 5',theory:'**Скромность + воля.**'},
{title:'Видение',theory:'**WHY.**'},
{title:'Команда',theory:'**Развивай.**'},
{title:'Делегирование',theory:'**Не сам.**'},
{title:'Фидбэк',theory:'**SBI.**'},
{title:'Конфликты',theory:'**Сотрудничество.**'},
{title:'Кризис',theory:'**Спокойствие.**'},
{title:'Итог',theory:'**Служение.**'}
]},
{id:'c_english_a1',emoji:'🇬🇧',title:'English A1',category:'Английский',hours:20,lessons:[
{title:'Алфавит',theory:'**44 звука.**'},
{title:'Приветствия',theory:'**Hi, Hello.**'},
{title:'Числа',theory:'**1-100.**'},
{title:'Цвета',theory:'**Red, blue.**'},
{title:'Семья',theory:'**Mother, father.**'},
{title:'Еда',theory:'**Bread, water.**'},
{title:'To be',theory:'**am/is/are.**'},
{title:'Present Simple',theory:'**V(s/es).**'},
{title:'Итог A1',theory:'**Тест.**'}
]},
{id:'c_english_a2',emoji:'🇬🇧',title:'English A2',category:'Английский',hours:25,lessons:[
{title:'Past Simple',theory:'**V+ed.**'},
{title:'Неправильные',theory:'**go-went.**'},
{title:'Past Continuous',theory:'**was + V-ing.**'},
{title:'Future',theory:'**will.**'},
{title:'Сравнения',theory:'**-er/-est.**'},
{title:'Present Perfect',theory:'**have + V3.**'},
{title:'For/Since',theory:'**Длительность.**'},
{title:'Итог A2',theory:'**Тест.**'}
]},
{id:'c_english_b1',emoji:'🇬🇧',title:'English B1',category:'Английский',hours:30,lessons:[
{title:'Present Perfect Continuous',theory:'**have been + V-ing.**'},
{title:'Past Perfect',theory:'**had + V3.**'},
{title:'Модальные',theory:'**must, might.**'},
{title:'Used to',theory:'**Раньше.**'},
{title:'Условные 3',theory:'**If had... would have.**'},
{title:'Wish',theory:'**Хотел бы.**'},
{title:'Косвенная',theory:'**He said that.**'},
{title:'Итог B1',theory:'**Эссе.**'}
]},
{id:'c_english_b2',emoji:'🇬🇧',title:'English B2',category:'Английский',hours:35,lessons:[
{title:'Инверсия',theory:'**Never have I...**'},
{title:'Смешанные условные',theory:'**Had + would.**'},
{title:'Cleft',theory:'**It was... who.**'},
{title:'Subjunctive',theory:'**suggest he be.**'},
{title:'Фразовые',theory:'**put up with.**'},
{title:'Идиомы',theory:'**bite the bullet.**'},
{title:'Academic',theory:'**Hedging.**'},
{title:'Итог B2',theory:'**Эссе 300.**'}
]},
{id:'c_english_c1',emoji:'🇬🇧',title:'English C1',category:'Английский',hours:40,lessons:[
{title:'Nuances',theory:'**Оттенки.**'},
{title:'Idioms C1',theory:'**takes two to tango.**'},
{title:'Academic writing',theory:'**Hedging.**'},
{title:'Literary devices',theory:'**Metaphor.**'},
{title:'Register',theory:'**5 уровней.**'},
{title:'Essay',theory:'**400-500.**'},
{title:'Стилистика',theory:'**Anaphora.**'},
{title:'Итог C1',theory:'**Свобода.**'}
]},
{id:'c_screentime_course',emoji:'📱',title:'Экранный детокс',category:'Цифровое',hours:8,lessons:[
{title:'Проблема',theory:'**Дофаминовая яма.**'},
{title:'Замер',theory:'**Screen Time.**'},
{title:'Уведомления',theory:'**Отключи.**'},
{title:'Соцсети',theory:'**Лимит 30 мин.**'},
{title:'Утро',theory:'**30 мин без.**'},
{title:'Вечер',theory:'**2 часа без.**'},
{title:'Замены',theory:'**Хобби.**'},
{title:'Итог',theory:'**Свобода.**'}
]},
{id:'c_communication',emoji:'💬',title:'Коммуникация',category:'Отношения',hours:5,lessons:[
{title:'Активное слушание',theory:'**Парафраз.**'},
{title:'Я-сообщения',theory:'**"Я чувствую X."**'},
{title:'ННО',theory:'**4 шага.**'},
{title:'Границы',theory:'**"Нет" без вины.**'},
{title:'Конфликты',theory:'**Томас-Килманн.**'},
{title:'Small talk',theory:'**3 слоя.**'},
{title:'Публичная речь',theory:'**Hook.**'},
{title:'Итог',theory:'**Тренируется.**'}
]},
{id:'c_creativity',emoji:'🎨',title:'Креативность',category:'Творчество',hours:5,lessons:[
{title:'Что такое',theory:'**DMN.**'},
{title:'Скука',theory:'**Полезна.**'},
{title:'Прогулка',theory:'**+60% идей.**'},
{title:'SCAMPER',theory:'**7 приёмов.**'},
{title:'Mind map',theory:'**Ветви.**'},
{title:'Мозговой штурм',theory:'**Без критики.**'},
{title:'Сон',theory:'**REM.**'},
{title:'Итог',theory:'**Количество.**'}
]},
{id:'c_stoicism',emoji:'🏛',title:'Стоицизм',category:'Философия',hours:5,lessons:[
{title:'Что это',theory:'**Дихотомия.**'},
{title:'Марк Аврелий',theory:'**Размышления.**'},
{title:'Сенека',theory:'**Письма.**'},
{title:'Эпиктет',theory:'**Enchiridion.**'},
{title:'Premeditatio',theory:'**Худшее.**'},
{title:'Memento mori',theory:'**Помни.**'},
{title:'Вечер',theory:'**Рефлексия.**'},
{title:'Итог',theory:'**Спокойствие.**'}
]},
{id:'c_ikigai_course',emoji:'🌺',title:'Икигай',category:'Философия',hours:4,lessons:[
{title:'Что это',theory:'**Японский смысл.**'},
{title:'4 сферы',theory:'**Люблю, умею, платят, нужно.**'},
{title:'Пересечение',theory:'**Центр.**'},
{title:'Тест',theory:'**Попробуй.**'},
{title:'Работа',theory:'**Не только она.**'},
{title:'Отношения',theory:'**Тоже.**'},
{title:'Итог',theory:'**Смысл.**'}
]},
{id:'c_learning_how',emoji:'📚',title:'Как учиться',category:'Учёба',hours:5,lessons:[
{title:'Pomodoro',theory:'**25/5.**'},
{title:'Recall',theory:'**Припоминание.**'},
{title:'Feynman',theory:'**Объясни ребёнку.**'},
{title:'Anki',theory:'**Интервалы.**'},
{title:'Cornell',theory:'**Конспект.**'},
{title:'Mind map',theory:'**Структура.**'},
{title:'Сон',theory:'**Консолидация.**'},
{title:'Итог',theory:'**Система.**'}
]},
{id:'c_recovery_course',emoji:'🌿',title:'Восстановление',category:'Восстановление',hours:6,lessons:[
{title:'Что это',theory:'**7 видов отдыха.**'},
{title:'Физический',theory:'**Сон, еда.**'},
{title:'Ментальный',theory:'**Медитация.**'},
{title:'Сенсорный',theory:'**Тишина.**'},
{title:'Творческий',theory:'**Хобби.**'},
{title:'Эмоциональный',theory:'**Дневник.**'},
{title:'Социальный',theory:'**Друзья.**'},
{title:'Итог',theory:'**Часть работы.**'}
]},
{id:'c_neuro_basics',emoji:'🔬',title:'Нейробиология',category:'Нейро',hours:6,lessons:[
{title:'Нейропластичность',theory:'**Мозг меняется.**'},
{title:'Синапсы',theory:'**Связи.**'},
{title:'Хебб',theory:'**Fire together.**'},
{title:'Миелин',theory:'**Ускорение.**'},
{title:'Дофамин',theory:'**Предвкушение.**'},
{title:'Сон',theory:'**Консолидация.**'},
{title:'Спорт',theory:'**BDNF.**'},
{title:'Итог',theory:'**Оптимизируй.**'}
]}
];

/* ============ PATHS (12) ============ */
var PATHS_LIBRARY=[
{id:'p_health',emoji:'❤️',title:'Путь здоровья',category:'Здоровье',steps:[
{title:'Шаг 1: Осознание',desc:'Оцени здоровье',secret:'Замерь: вес, сон, шаги.'},
{title:'Шаг 2: Сон',desc:'Режим сна',secret:'Одно время.'},
{title:'Шаг 3: Питание',desc:'500 г овощей',secret:'Средиземноморская.'},
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
]}
];

/* ============ METHODS (30) ============ */
var METHODS_LIBRARY=[
{id:'m_pomodoro',emoji:'🍅',title:'Pomodoro',category:'Продуктивность',desc:'25/5 циклы.',steps:['Выбери задачу','Таймер 25','Работай','Перерыв 5','Повтори 4×','Перерыв 30'],base:'Франческо Чирилло'},
{id:'m_deep_work',emoji:'🎯',title:'Deep Work',category:'Продуктивность',desc:'Глубокая работа 90 мин.',steps:['Телефон вне','Одна задача','Таймер 90','Перерыв 15'],base:'Кэл Ньюпорт'},
{id:'m_gtd',emoji:'📥',title:'GTD',category:'Продуктивность',desc:'Getting Things Done.',steps:['Capture','Clarify','Organize','Reflect','Engage'],base:'Дэвид Аллен'},
{id:'m_eisenhower',emoji:'🔢',title:'Матрица Эйзенхауэра',category:'Продуктивность',desc:'4 квадранта.',steps:['Q1: делай','Q2: планируй','Q3: делегируй','Q4: удали'],base:'Дуайт Эйзенхауэр'},
{id:'m_eat_frog',emoji:'🐸',title:'Eat That Frog',category:'Продуктивность',desc:'Сложное первым.',steps:['Определи жабу','Съешь утром','Без телефона'],base:'Брайан Трейси'},
{id:'m_feynman',emoji:'👨‍🏫',title:'Метод Фейнмана',category:'Учёба',desc:'Объясни ребёнку.',steps:['Выбери тему','Объясни 12-летнему','Найди пробелы','Упрости'],base:'Ричард Фейнман'},
{id:'m_anki',emoji:'🃏',title:'Anki',category:'Учёба',desc:'Интервальное повторение.',steps:['Создай карточку','Оцени 1-4','Алгоритм','20 мин/день'],base:'SRS'},
{id:'m_cornell',emoji:'📝',title:'Cornell',category:'Учёба',desc:'Конспект с колонками.',steps:['Раздели лист','Конспект','Вопросы','Резюме'],base:'Уолтер Паук'},
{id:'m_mind_map',emoji:'🗺',title:'Mind Map',category:'Учёба',desc:'Визуальные карты.',steps:['Центр','Ветви','Подветви','Цвета'],base:'Тони Бьюзен'},
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
{id:'m_cold_shower',emoji:'❄️',title:'Холодный душ',category:'Здоровье',desc:'2 мин.',steps:['Тёплый','Холодный 30 сек','До 2 мин'],base:'Вим Хоф'},
{id:'m_16_8',emoji:'⏱',title:'Интервальное голодание',category:'Здоровье',desc:'16:8.',steps:['Ешь 8 ч','Голодай 16','Вода/чай'],base:'Наука'},
{id:'m_nvc',emoji:'💬',title:'ННО',category:'Отношения',desc:'Ненасильственное.',steps:['Наблюдение','Чувства','Потребности','Просьба'],base:'Маршалл Розенберг'},
{id:'m_sbi',emoji:'📝',title:'SBI',category:'Отношения',desc:'Фидбэк.',steps:['Situation','Behavior','Impact'],base:'CCL'}
];

/* ============ RECOVERY (20) ============ */
var RECOVERY_LIBRARY=[
{id:'r_sleep',emoji:'😴',title:'Сон',category:'Физическое',desc:'Главное восстановление.',how:'Режим, темнота, 18-20°C.',time:'7-9 ч'},
{id:'r_nap',emoji:'💤',title:'Дневной сон',category:'Физическое',desc:'20-30 мин.',how:'До 15:00.',time:'20-90 мин'},
{id:'r_walk',emoji:'🚶',title:'Прогулка',category:'Физическое',desc:'Свежий воздух.',how:'Без телефона.',time:'20-30 мин'},
{id:'r_massage',emoji:'💆',title:'Массаж',category:'Физическое',desc:'Расслабление.',how:'2×/мес.',time:'60 мин'},
{id:'r_sauna',emoji:'🔥',title:'Сауна',category:'Физическое',desc:'80-100°C.',how:'2-4×/нед.',time:'15-20 мин'},
{id:'r_stretch',emoji:'🤸',title:'Растяжка',category:'Физическое',desc:'Мобильность.',how:'10 мин/день.',time:'10 мин'},
{id:'r_yoga',emoji:'🧘',title:'Йога',category:'Физическое',desc:'Тело + дыхание.',how:'2-3×/нед.',time:'60 мин'},
{id:'r_meditation',emoji:'🧘',title:'Медитация',category:'Ментальное',desc:'10-20 мин.',how:'Осознанное дыхание.',time:'10-20 мин'},
{id:'r_journal',emoji:'📓',title:'Дневник',category:'Ментальное',desc:'Рефлексия.',how:'Утром 3 стр.',time:'15 мин'},
{id:'r_reading',emoji:'📖',title:'Чтение',category:'Ментальное',desc:'Художка.',how:'30 мин.',time:'30 мин'},
{id:'r_breathing',emoji:'🌬',title:'Дыхание',category:'Ментальное',desc:'Box, 4-7-8.',how:'5 мин.',time:'5 мин'},
{id:'r_silence',emoji:'🤫',title:'Тишина',category:'Сенсорное',desc:'Отдых от шума.',how:'1 ч/день.',time:'60 мин'},
{id:'r_dark',emoji:'🌑',title:'Темнота',category:'Сенсорное',desc:'Отдых глаз.',how:'Закрытые глаза.',time:'10 мин'},
{id:'r_digital_detox',emoji:'📱',title:'Цифровой детокс',category:'Сенсорное',desc:'Без экрана.',how:'1 ч/день.',time:'60 мин'},
{id:'r_hobby',emoji:'🎨',title:'Хобби',category:'Творческое',desc:'Руками.',how:'30 мин/день.',time:'30 мин'},
{id:'r_music',emoji:'🎵',title:'Музыка',category:'Творческое',desc:'Играть или слушать.',how:'30 мин.',time:'30 мин'},
{id:'r_therapy',emoji:'🛋',title:'Терапия',category:'Эмоциональное',desc:'С психологом.',how:'1×/нед.',time:'60 мин'},
{id:'r_talk',emoji:'💬',title:'Разговор',category:'Эмоциональное',desc:'С близким.',how:'15 мин.',time:'15 мин'},
{id:'r_friends',emoji:'👥',title:'Друзья',category:'Социальное',desc:'Живое общение.',how:'1×/нед.',time:'120 мин'},
{id:'r_family',emoji:'🏠',title:'Семья',category:'Социальное',desc:'Без телефонов.',how:'30 мин.',time:'30 мин'}
];

/* ============ ЭФФЕКТЫ ×250% ============ */
var LEARNING_EFFECTS={
  baseMultiplier:2.5,
  levels:[
    {level:1,name:'Новичок',xp:0,bonus:1.0},
    {level:2,name:'Ученик',xp:250,bonus:1.25},
    {level:3,name:'Практик',xp:750,bonus:1.5},
    {level:4,name:'Знаток',xp:1500,bonus:1.75},
    {level:5,name:'Мастер',xp:3000,bonus:2.0},
    {level:6,name:'Эксперт',xp:5000,bonus:2.25},
    {level:7,name:'Гуру',xp:8000,bonus:2.5},
    {level:8,name:'Легенда',xp:12000,bonus:2.75},
    {level:9,name:'Миф',xp:20000,bonus:3.0}
  ]
};

function applyLearningBonus(baseXP){return Math.round(baseXP*LEARNING_EFFECTS.baseMultiplier)}

/* ============ SCREEN TIPS (20) ============ */
var SCREEN_TIPS=[
{category:'🌅 Утро',title:'Утро без телефона',desc:'Первые 30 минут без экрана.',action:'Положи телефон в другую комнату.',effect:'+Фокус',time:'30 мин'},
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
{category:'📊 Метрики',title:'Цель — снижение 20%',desc:'Каждую неделю -20%.',action:'Записывай.',effect:'-Экран',time:'—'}
];

/* ============ DETOX COURSE (30 дней) ============ */
var DETOX_COURSE=[
{day:1,phase:'Подготовка',title:'Осознай проблему',subtitle:'Замерь экранное время',why:'Нельзя изменить то, что не измерено.',do:['Открой Screen Time','Запиши цифры','Топ-3 приложения','Цель на 30 дней'],effect:'Ясность'},
{day:2,phase:'Подготовка',title:'Убери соблазны',subtitle:'Среда решает',why:'Сила воли ограничена.',do:['Удали соцсети','Отключи уведомления','Чёрно-белый','Будильник'],effect:'-30%'},
{day:3,phase:'Подготовка',title:'Утро без телефона',subtitle:'30 мин — твои',why:'Утро задаёт тон.',do:['Телефон в комнате','30 мин без','Вода+свет','Только потом'],effect:'+Фокус'},
{day:4,phase:'Неделя 1',title:'Замечай импульсы',subtitle:'Счёт импульсов',why:'Импульс — не приказ.',do:['Счёт импульсов','Триггеры','Замена 2 мин'],effect:'+Контроль'},
{day:5,phase:'Неделя 1',title:'Еда без экрана',subtitle:'Осознанное питание',why:'Еда+экран=переедание.',do:['Телефон в комнате','Медленно','3 приёма'],effect:'+Пищеварение'},
{day:6,phase:'Неделя 1',title:'Прогулка без телефона',subtitle:'20 мин',why:'Внимание к телу.',do:['20 мин','Телефон дома','Детали'],effect:'+Настроение'},
{day:7,phase:'Неделя 1',title:'Ревью недели 1',subtitle:'Что получилось?',why:'Рефлексия — топливо.',do:['Цифры','Легко','Сложно','План 2'],effect:'+Осознанность'},
{day:8,phase:'Неделя 2',title:'Уведомления — в ноль',subtitle:'Только люди',why:'Уведомление = 23 мин фокуса.',do:['Соцсети off','Только звонки','Проверь'],effect:'+Фокус'},
{day:9,phase:'Неделя 2',title:'Соцсети 30 минут',subtitle:'В определённое время',why:'Ограничение > запрет.',do:['Лимит 30','В 18:00','Таймер'],effect:'-Тревога'},
{day:10,phase:'Неделя 2',title:'Чёрно-белый экран',subtitle:'Дофамин без цвета',why:'Цвет — магнит ленты.',do:['Чёрно-белый','День','Оцени'],effect:'-50%'},
{day:11,phase:'Неделя 2',title:'День без соцсетей',subtitle:'24 часа',why:'Проверка свободы.',do:['24 часа','Только звонки','Запиши'],effect:'+Свобода'},
{day:12,phase:'Неделя 2',title:'Глубокий час',subtitle:'60 мин Deep Work',why:'Мозг к глубине.',do:['Авиарежим 60','Одна задача','Перерыв 15'],effect:'+Продуктивность'},
{day:13,phase:'Неделя 2',title:'Вечер без экрана',subtitle:'За 2 часа',why:'Экран убивает мелатонин.',do:['2 часа off','Книга/душ','Телефон вне'],effect:'+Сон'},
{day:14,phase:'Неделя 2',title:'Ревью недели 2',subtitle:'Что изменилось?',why:'Замер прогресса.',do:['Цифры','Помогло','Мешает','План 3'],effect:'+Мотивация'},
{day:15,phase:'Неделя 3',title:'Приложение вместо ленты',subtitle:'Что вместо?',why:'Пустоту заполни.',do:['Приложение','20 мин','Читай'],effect:'+Развитие'},
{day:16,phase:'Неделя 3',title:'Хобби 30 минут',subtitle:'Руками',why:'Творчество = радость.',do:['30 мин','Рисование','Эмоции'],effect:'+Радость'},
{day:17,phase:'Неделя 3',title:'Спорт без наушников',subtitle:'Тело и мир',why:'Тишина = связь.',do:['30 мин','Без музыки','Тело'],effect:'+Настроение'},
{day:18,phase:'Неделя 3',title:'Живое общение',subtitle:'Звонок',why:'Голос = эмоции.',do:['2 звонка','15 мин','Слушай'],effect:'+Связи'},
{day:19,phase:'Неделя 3',title:'Природа 1 час',subtitle:'Лес, парк',why:'Природа = кортизол ↓.',do:['1 час','Телефон в сумке','Наблюдай'],effect:'-Стресс'},
{day:20,phase:'Неделя 3',title:'Дневник детокса',subtitle:'Что изменилось?',why:'Написание укрепляет.',do:['3 победы','3 трудности','Новое о себе'],effect:'+Рефлексия'},
{day:21,phase:'Неделя 3',title:'Ревью недели 3',subtitle:'Половина',why:'21 день — точка.',do:['Цифры','Норма','План 4'],effect:'+Привычка'},
{day:22,phase:'Неделя 4',title:'Утро-ритуал',subtitle:'Фиксируй',why:'Утро защищает.',do:['Вода+свет+дыхание','30 мин без','Только потом'],effect:'+Контроль'},
{day:23,phase:'Неделя 4',title:'Работа без отвлечений',subtitle:'90 мин',why:'Глубокая работа = суперсила.',do:['90 мин авиарежим','Одна задача','Метрики'],effect:'×2'},
{day:24,phase:'Неделя 4',title:'Вечер-ритуал',subtitle:'Тёплый свет + книга',why:'Защита сна.',do:['Свет 19:00','Книга 30','Телефон вне'],effect:'+Сон'},
{day:25,phase:'Неделя 4',title:'Один день офлайн',subtitle:'24 часа',why:'Проверка свободы.',do:['Выбери день','24 ч без','Планируй'],effect:'+Свобода'},
{day:26,phase:'Неделя 4',title:'Дофаминовое голодание',subtitle:'4 часа',why:'Возврат чувствительности.',do:['4 ч без соцсетей','Прогулка/медитация'],effect:'+Чувствительность'},
{day:27,phase:'Неделя 4',title:'Замена ленты на смысл',subtitle:'Зачем?',why:'Цель освобождает.',do:['Зачем ты в каждом','Удали без смысла'],effect:'+Осознанность'},
{day:28,phase:'Неделя 4',title:'Метрики месяца',subtitle:'Цифры',why:'Цифры — мотиватор.',do:['Старт vs сейчас','Снизилось','Улучшилось'],effect:'+Мотивация'},
{day:29,phase:'Неделя 4',title:'План на будущее',subtitle:'Как жить',why:'Детокс = образ жизни.',do:['Правила','Лимиты','Ритуалы','Один офлайн-день'],effect:'+Система'},
{day:30,phase:'Финал',title:'Свобода',subtitle:'Ты справился',why:'Телефон — инструмент.',do:['Отметь финал','Расскажи','Продолжай'],effect:'+Свобода'}
];

/* ============ ЭКСПОРТ ============ */
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
window.COURSES_LIBRARY=COURSES_LIBRARY;
window.PATHS_LIBRARY=PATHS_LIBRARY;
window.METHODS_LIBRARY=METHODS_LIBRARY;
window.RECOVERY_LIBRARY=RECOVERY_LIBRARY;
window.LEARNING_EFFECTS=LEARNING_EFFECTS;
window.applyLearningBonus=applyLearningBonus;
window.SCREEN_TIPS=SCREEN_TIPS;
window.DETOX_COURSE=DETOX_COURSE;
window.__SCREEN_TIPS=SCREEN_TIPS;
window.__DETOX_COURSE=DETOX_COURSE;
window.todayKey=todayKey;
window.yesterdayKey=yesterdayKey;

/* Детокс */
function getDetoxProgress(){try{var s=window.state||state;if(!s.detoxCourseProgress)s.detoxCourseProgress={};return s.detoxCourseProgress}catch(e){return{}}}
function getCurrentDay(){var p=getDetoxProgress();for(var i=1;i<=30;i++){if(!p[i])return i}return 30}
function getCompletedDaysCount(){var p=getDetoxProgress();var c=0;for(var i=1;i<=30;i++){if(p[i])c++}return c}
function isDayCompleted(day){return !!getDetoxProgress()[day]}
function markDayCompleted(day){try{var s=window.state||state;if(!s.detoxCourseProgress)s.detoxCourseProgress={};s.detoxCourseProgress[day]=true;if(typeof window.save==='function')window.save();return true}catch(e){return false}}
function canOpenDay(day){if(isDayCompleted(day))return true;return day<=getCurrentDay()}

window.getDetoxProgress=getDetoxProgress;
window.getCurrentDay=getCurrentDay;
window.getCompletedDaysCount=getCompletedDaysCount;
window.isDayCompleted=isDayCompleted;
window.markDayCompleted=markDayCompleted;
window.canOpenDay=canOpenDay;

console.log('[CONTENT] Loaded: THEMES='+THEMES.length+' DOMAINS='+DOMAINS.length+' LEVELS='+LEARNING_LEVELS.length+' ACHIEVEMENTS='+ACHIEVEMENTS.length+' COURSES='+COURSES_LIBRARY.length+' PATHS='+PATHS_LIBRARY.length+' METHODS='+METHODS_LIBRARY.length);