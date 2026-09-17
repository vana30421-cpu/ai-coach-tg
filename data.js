'use strict';
var STORAGE_KEY='ai_health_v28';
var THEMES=[
{id:'dark',emoji:'🌙',name:'Тёмная',color:'#000',effects:'stars'},
{id:'light',emoji:'☀️',name:'Светлая',color:'#f5f5fa',effects:'none'},
{id:'ocean',emoji:'🌊',name:'Океан',color:'#000814',effects:'rain'},
{id:'sakura',emoji:'🌸',name:'Сакура',color:'#1a0f14',effects:'petals'},
{id:'forest',emoji:'🌲',name:'Лес',color:'#0a1410',effects:'leaves'},
{id:'sunset',emoji:'🔥',name:'Закат',color:'#1a0a05',effects:'dust'},
{id:'ice',emoji:'❄️',name:'Лёд',color:'#0a1419',effects:'snow'},
{id:'amethyst',emoji:'✨',name:'Аметист',color:'#12061f',effects:'rain'},
{id:'pumpkin',emoji:'🎃',name:'Тыква',color:'#0d0500',effects:'bats',halloween:true},
{id:'vampire',emoji:'🧛',name:'Вампир',color:'#0a0000',effects:'bats',halloween:true},
{id:'ghost',emoji:'👻',name:'Призрак',color:'#0a0814',effects:'ghosts',halloween:true},
{id:'web',emoji:'🕷',name:'Паутина',color:'#001410',effects:'spiders',halloween:true}
];
var DOMAINS=[
{id:'physical',emoji:'💪',name:'Физическое',color:'#ff7ba9',desc:'Тело, сила, выносливость',metrics:[{id:'weight',label:'Вес (кг)',target:'60-80'},{id:'steps',label:'Шагов/день',target:'8000'},{id:'workouts',label:'Тренировок/нед',target:'3-5'},{id:'vo2max',label:'VO2max',target:'40+'},{id:'restHR',label:'Пульс покоя',target:'50-70'},{id:'flexibility',label:'Гибкость (см)',target:'+10'}]},
{id:'mental',emoji:'🧠',name:'Ментальное',color:'#4dd4ff',desc:'Фокус, память, ясность',metrics:[{id:'focusMin',label:'Deep Work (мин)',target:'180'},{id:'meditation',label:'Медитаций/нед',target:'7'},{id:'reading',label:'Страниц/день',target:'20'},{id:'learning',label:'Уроков/нед',target:'5'},{id:'memory',label:'Память 1-10',target:'7+'},{id:'iq',label:'IQ-задач/день',target:'5'}]},
{id:'emotional',emoji:'❤️',name:'Эмоциональное',color:'#ff6b6b',desc:'Чувства, стресс',metrics:[{id:'mood',label:'Настроение 1-10',target:'7+'},{id:'stress',label:'Стресс 1-10',target:'<5'},{id:'anxiety',label:'Тревога 1-10',target:'<4'},{id:'journal',label:'Записей/нед',target:'3'},{id:'eq',label:'EQ-практик/день',target:'1'}]},
{id:'spiritual',emoji:'🕊',name:'Духовное',color:'#b394ff',desc:'Смысл, ценности',metrics:[{id:'gratitude',label:'Благодарностей/день',target:'3'},{id:'meaning',label:'Смысл 1-10',target:'7+'},{id:'nature',label:'На природе (мин/нед)',target:'120'},{id:'values',label:'С ценностями 1-10',target:'8+'}]},
{id:'financial',emoji:'💰',name:'Финансовое',color:'#ffcc4d',desc:'Бюджет, инвестиции',metrics:[{id:'savings',label:'Норма сбережений %',target:'20%+'},{id:'runway',label:'Runway (мес)',target:'6+'},{id:'debt',label:'Долговая нагрузка %',target:'<30%'},{id:'invest',label:'Инвестиции %',target:'20%'}]},
{id:'career',emoji:'💼',name:'Карьерное',color:'#3ddc97',desc:'Навыки, позиция',metrics:[{id:'skills',label:'Навыков в развитии',target:'3'},{id:'network',label:'Контактов/мес',target:'5'},{id:'projects',label:'Проектов/квартал',target:'3'},{id:'visibility',label:'Публикаций/мес',target:'2'}]},
{id:'social',emoji:'👥',name:'Социальное',color:'#c4b5fd',desc:'Семья, друзья',metrics:[{id:'deepConnections',label:'Глубоких связей',target:'5+'},{id:'calls',label:'Звонков/нед',target:'3'},{id:'meetups',label:'Встреч/мес',target:'4'}]},
{id:'environment',emoji:'🏠',name:'Среда',color:'#a4e7ff',desc:'Пространство, свет',metrics:[{id:'clutter',label:'Порядок 1-10',target:'8+'},{id:'light',label:'Освещение 1-10',target:'8+'},{id:'noise',label:'Тишина 1-10',target:'7+'},{id:'ergonomics',label:'Эргономика 1-10',target:'8+'}]},
{id:'recovery',emoji:'⏰',name:'Восстановление',color:'#4dd4ff',desc:'Сон, отдых, детокс',metrics:[{id:'sleepHours',label:'Сон (ч)',target:'7-9'},{id:'sleepQuality',label:'Качество сна 1-10',target:'8+'},{id:'screenTime',label:'Экран (ч)',target:'<4'},{id:'breaks',label:'Перерывов/день',target:'6+'}]}
];
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
function defaultState(){return{
tasks:[],schedule:[],habits:[],goals:[],notes:[],timer:[],chats:[],mood:[],water:[],meds:[],workouts:[],meditations:[],journal:[],media:[],entertainment:[],
watchlist:[],watched:[],
screenStats:{},screenHabits:{},screenMode:null,
finance:[],financeGoals:[],
eqJournal:[],memoryTraining:[],iqScores:[],screenDaily:{},
matrix:[],paths:[],courses:[],levelProgress:{},englishProgress:{},scheduleBlocks:[],domainScores:{},domainHistory:{},metrics:{},
integrations:{
googleCalendar:{connected:false,clientId:'',calendarId:'primary',accessToken:null,lastSync:null},
obsidian:{path:'',apiKey:'',autoSync:false,lastSync:null},
gemini:{apiKey:'',model:'gemini-1.5-flash',connected:false},
notion:{apiKey:'',databaseId:'',enabled:false},
todoist:{apiKey:'',enabled:false}
},
screenTime:{limits:{daily:240,social:60,games:30,work:180},usage:{},detoxMode:false,detoxUntil:null,focusSessions:0},
profile:{name:'',emoji:'😊',createdAt:new Date().toISOString(),achievements:[],surveyAnswers:null,surveyStep:0,surveyDone:false,personalPlan:null},
settings:{theme:'dark',provider:'gemini',apiKey:'',activePersona:'coach',waterGoal:8,onboardingDone:false,autoMatrix:true,notifications:true,effectsEnabled:true,reminderTime:'morning'},
flags:{dnd:false,focus:false},
stats:{streak:0,lastActiveDay:null,totalDays:0}
}}
var PATHS_LIBRARY=[
{id:'procrastination',title:'Прокрастинация',emoji:'⏳',category:'Продуктивность',description:'7 шагов',steps:[{title:'Диагностика',desc:'Определи тип: страх, перфекционизм, перегруз.',secret:'Прокрастинация — защита от дискомфорта.'},{title:'Правило 2 минут',desc:'Начни с ≤2 минут.',secret:'Мозг за 90 секунд.'},{title:'Pomodoro',desc:'25/5, 4 цикла.',secret:'Снижает тревогу.'},{title:'Дедлайн',desc:'Скажи другу.',secret:'Усиливает мотивацию.'},{title:'Среда',desc:'Телефон в комнату.',secret:'Воля — ресурс.'},{title:'Награда',desc:'После задачи.',secret:'Дофамин.'},{title:'Рефлексия',desc:'Что работало?',secret:'66 дней.'}]},
{id:'anxiety',title:'Тревожность',emoji:'🌊',category:'Психика',description:'8 шагов',steps:[{title:'Сигналы',desc:'Тело — радар.',secret:'Древняя система.'},{title:'Дыхание 4-7-8',desc:'4 вдох, 7 задержка, 8 выдох.',secret:'Выключатель.'},{title:'Заземление',desc:'5-4-3-2-1.',secret:'В настоящее.'},{title:'Дневник',desc:'Запиши тревогу.',secret:'90% преувеличены.'},{title:'КПТ',desc:'Мысль → доказательства → альтернатива.',secret:'Объективность.'},{title:'Тело',desc:'Йога, прогулка.',secret:'Часть психики.'},{title:'Отказ',desc:'80% вне контроля.',secret:'Стоики.'},{title:'Помощь',desc:'К психотерапевту.',secret:'КПТ 80%.'}]},
{id:'burnout',title:'Выгорание',emoji:'🔥',category:'Психика',description:'7 шагов',steps:[{title:'Признать',desc:'Истощение.',secret:'Отрицание → принятие.'},{title:'Стоп',desc:'-50% нагрузки.',secret:'Недели.'},{title:'Сон',desc:'8-9 ч.',secret:'Фундамент.'},{title:'Питание',desc:'Белок, овощи.',secret:'Воспаление.'},{title:'Границы',desc:'"Нет" учись.',secret:'Да здоровью.'},{title:'Смысл',desc:'Что важно?',secret:'Разрыв.'},{title:'Система',desc:'Постепенно.',secret:'Многие сильнее.'}]},
{id:'sleep',title:'Плохой сон',emoji:'😴',category:'Здоровье',description:'6 шагов',steps:[{title:'Дневник',desc:'Записывай.',secret:'Улучшается.'},{title:'Циркадный',desc:'В одно время.',secret:'Свет утром.'},{title:'Ритуал',desc:'Без экранов.',secret:'Переход.'},{title:'Спальня',desc:'Темно 18-20°C.',secret:'Храм.'},{title:'Еда',desc:'Кофе до 14:00.',secret:'Алкоголь разрушает.'},{title:'Если не спится',desc:'Встань.',secret:'Кровать = сон.'}]},
{id:'money',title:'Финансы',emoji:'💰',category:'Финансы',description:'7 шагов',steps:[{title:'Инвентаризация',desc:'Активы и долги.',secret:'Реальность.'},{title:'50/30/20',desc:'Нужды/желания/сбережения.',secret:'Карта.'},{title:'Подушка',desc:'3-6 мес.',secret:'От паники.'},{title:'Долги',desc:'Снежный ком.',secret:'20-30%.'},{title:'Инвестиции',desc:'Индексы.',secret:'Баффет.'},{title:'Защита',desc:'Страхование.',secret:'Про жизнь.'},{title:'Доход',desc:'Второй источник.',secret:'Навал.'}]},
{id:'relationships',title:'Отношения',emoji:'💞',category:'Отношения',description:'7 шагов',steps:[{title:'Слушание',desc:'Понять, не ответить.',secret:'69% не решаются.'},{title:'Я-сообщения',desc:'"Я чувствую X".',secret:'"Ты" = защита.'},{title:'Банк',desc:'Ежедневный вклад.',secret:'5:1.'},{title:'Ремонт',desc:'Извинение без "но".',secret:'Победа = поражение.'},{title:'Границы',desc:'Спокойно.',secret:'Здоровье.'},{title:'Время',desc:'Час в день.',secret:'80% разводов.'},{title:'Терапия',desc:'Если годами.',secret:'ЭФТ 70%.'}]},
{id:'focus',title:'Концентрация',emoji:'🎯',category:'Продуктивность',description:'6 шагов',steps:[{title:'Один экран',desc:'Работа с одним.',secret:'40% потерь.'},{title:'Block time',desc:'90 минут.',secret:'Deep Work.'},{title:'Разогрев',desc:'5 мин простой.',secret:'Время.'},{title:'Ритуал',desc:'Музыка, чай.',secret:'Павлов.'},{title:'Защита',desc:'Табличка.',secret:'23 мин.'},{title:'Отдых',desc:'15 мин без экрана.',secret:'Умение.'}]},
{id:'motivation',title:'Мотивация',emoji:'🚀',category:'Продуктивность',description:'6 шагов',steps:[{title:'Типы',desc:'Внешняя vs внутренняя.',secret:'Внутренняя сильнее.'},{title:'Икигай',desc:'4 сферы.',secret:'Японская.'},{title:'Победы',desc:'Малые.',secret:'Топливо.'},{title:'Автономия',desc:'Выбирай.',secret:'Деси/Райан.'},{title:'Публично',desc:'Расскажи.',secret:'Ставка.'},{title:'Идентичность',desc:'"Я —"',secret:'Клир.'}]},
{id:'stress',title:'Стресс',emoji:'⚡',category:'Психика',description:'6 шагов',steps:[{title:'Различить',desc:'Острый vs хронический.',secret:'Сапольски.'},{title:'Медитация',desc:'5-10 мин.',secret:'-25% кортизола.'},{title:'Движение',desc:'30 мин.',secret:'Сжигает.'},{title:'Связи',desc:'Один контакт.',secret:'Антистресс.'},{title:'Границы',desc:'Уведомления выкл.',secret:'Доступность.'},{title:'Природа',desc:'2 ч/нед.',secret:'-16%.'}]},
{id:'depression',title:'Депрессия',emoji:'🌑',category:'Психика',description:'7 шагов',steps:[{title:'Признать',desc:'Болезнь.',secret:'300 млн.'},{title:'Врач',desc:'Психиатр + терапевт.',secret:'70%.'},{title:'Микро',desc:'Умыться.',secret:'Действия > чувства.'},{title:'Движение',desc:'Прогулка.',secret:'Антидепрессант.'},{title:'Ритм',desc:'Одинаковое время.',secret:'Циркадные.'},{title:'Связи',desc:'Звонок в день.',secret:'Топливо.'},{title:'Терпение',desc:'4-8 недель.',secret:'Восстановление.'}]},
{id:'career',title:'Карьера',emoji:'📈',category:'Карьера',description:'7 шагов',steps:[{title:'Направление',desc:'Икигай.',secret:'Пересечение.'},{title:'Навыки',desc:'Топ-3.',secret:'10000 часов.'},{title:'Портфолио',desc:'Проекты.',secret:'Резюме устарело.'},{title:'Нетворк',desc:'10 контактов.',secret:'85%.'},{title:'Видимость',desc:'LinkedIn.',secret:'Заметность.'},{title:'Переговоры',desc:'Зарплата.',secret:'Первое не лучшее.'},{title:'Рост',desc:'3-5 лет.',secret:'+20%.'}]},
{id:'selfdiscipline',title:'Самодисциплина',emoji:'⚔️',category:'Продуктивность',description:'7 шагов',steps:[{title:'Свобода',desc:'От импульсов.',secret:'Йонге.'},{title:'Одна привычка',desc:'1-2/мес.',secret:'37x.'},{title:'Триггеры',desc:'Привязка.',secret:'Habit stacking.'},{title:'Минимум',desc:'2 отжимания.',secret:'Ежедневно.'},{title:'Среда',desc:'Убери соблазны.',secret:'Сильнее воли.'},{title:'Ответственность',desc:'Партнёр.',secret:'Измеряется.'},{title:'Возврат',desc:'Не пропускай дважды.',secret:'Правило.'}]},
{id:'confidence',title:'Уверенность',emoji:'🦁',category:'Личное',description:'6 шагов',steps:[{title:'Навык',desc:'Не врождённое.',secret:'Бандура.'},{title:'Победы',desc:'Каждый день.',secret:'Сумма.'},{title:'Тело',desc:'Осанка.',secret:'Кадди.'},{title:'Знания',desc:'Эксперт.',secret:'Компетентность.'},{title:'Без сравнения',desc:'С собой.',secret:'Воровство.'},{title:'Принятие',desc:'Не идеален.',secret:'Уязвимость.'}]},
{id:'meaning',title:'Смысл жизни',emoji:'✨',category:'Психика',description:'7 шагов',steps:[{title:'Кризис',desc:'Этап.',secret:'Ялом.'},{title:'Memento',desc:'Смерть.',secret:'Стоики.'},{title:'3 источника',desc:'Труд, любовь, страдание.',secret:'Франкл.'},{title:'Действие',desc:'Руками.',secret:'Сартр.'},{title:'Связь',desc:'С большим.',secret:'Трансперсональная.'},{title:'Отпустить',desc:'Путь.',secret:'Камю.'},{title:'Практика',desc:'Ежедневно.',secret:'Путь.'}]},
{id:'nutrition',title:'Питание',emoji:'🥗',category:'Здоровье',description:'7 шагов',steps:[{title:'Принципы',desc:'Средиземноморская.',secret:'-30%.'},{title:'Белок',desc:'1.6 г/кг.',secret:'Сытость.'},{title:'Овощи',desc:'500 г.',secret:'Микробиом.'},{title:'Жиры',desc:'Оливковое.',secret:'Мозг.'},{title:'Сахар',desc:'Минимум.',secret:'Усталость.'},{title:'Режим',desc:'16:8.',secret:'Аутофагия.'},{title:'Вода',desc:'30 мл/кг.',secret:'-20%.'}]},
{id:'english',title:'Английский',emoji:'🇬🇧',category:'Обучение',description:'8 шагов',steps:[{title:'Уровень',desc:'A1-C2.',secret:'Старт.'},{title:'1000 слов',desc:'80% понимания.',secret:'Anki.'},{title:'Грамматика',desc:'12 времён.',secret:'Практика.'},{title:'Слушание',desc:'30 мин/день.',secret:'Пассив+актив.'},{title:'Говорение',desc:'15 мин/день.',secret:'С 1 дня.'},{title:'Чтение',desc:'20 мин/день.',secret:'Словарь.'},{title:'Письмо',desc:'Дневник.',secret:'Структура.'},{title:'Практика',desc:'30 мин/день.',secret:'Регулярность.'}]},
{id:'screentime',title:'Экранное время',emoji:'📱',category:'Здоровье',description:'8 шагов',steps:[{title:'Замер',desc:'Узнай реальное время.',secret:'Осознание = 50%.'},{title:'Аудит',desc:'Топ-3 приложения.',secret:'Удали токсичные.'},{title:'Утро',desc:'30 мин без телефона.',secret:'Кортизол.'},{title:'Deep Work',desc:'90 мин авиарежим.',secret:'+40%.'},{title:'Вечер',desc:'2 ч без экрана до сна.',secret:'Мелатонин.'},{title:'Детокс',desc:'24 ч раз в неделю.',secret:'Перезагрузка.'},{title:'Среда',desc:'Телефон вне спальни.',secret:'Зарядка в коридоре.'},{title:'Замена',desc:'Книга, спорт, хобби.',secret:'Дофамин.'}]}
];
var COURSES_LIBRARY=[
{id:'productivity_master',title:'Мастер продуктивности',emoji:'⚡',category:'Продуктивность',description:'Полный курс',lessons:[{title:'Введение',content:'80/20. 20% усилий — 80% результата.'},{title:'SMART и OKR',content:'SMART: Specific, Measurable, Achievable, Relevant, Time-bound. OKR: Objective + Key Results.'},{title:'Матрица',content:'Q1 делай, Q2 планируй, Q3 делегируй, Q4 удали.'},{title:'GTD',content:'Capture, Clarify, Organize, Reflect, Engage.'},{title:'Deep Work',content:'90 минут. Одна задача. Телефон далеко. 3-4 часа = 10 часов.'},{title:'Pomodoro',content:'25/5. 4 цикла. 30 минут отдых.'},{title:'Энергия',content:'Управляй энергией, не временем. 90/15.'},{title:'Привычки',content:'1% в день = 37x за год. Петля привычки.'},{title:'Инструменты',content:'Notion, Obsidian, Todoist, Google Calendar.'},{title:'Итог',content:'3 цели, 5 привычек, 1 система.'}]},
{id:'mental_health',title:'Психическое здоровье',emoji:'🧠',category:'Психика',description:'Научный подход',lessons:[{title:'Психика',content:'Функция мозга и тела. Пластичность.'},{title:'Эмоции',content:'7 базовых. 90 секунд. Сигналы.'},{title:'Тревога',content:'Предсказание. Дыхание 4-7-8. КПТ.'},{title:'Депрессия',content:'Болезнь. КПТ 70%. Движение. Свет.'},{title:'КПТ',content:'Мысль → эмоция. Искажения. Альтернатива.'},{title:'ACT',content:'Принятие. Разделение. Ценности. Действие.'},{title:'Травма',content:'EMDR. Терапия. Безопасность.'},{title:'Границы',content:'Спокойное "нет". Уважение.'},{title:'Смысл',content:'Франкл. Труд, любовь, страдание.'},{title:'Помощь',content:'>2 недель → специалист.'}]},
{id:'health_basics',title:'Основы здоровья',emoji:'⚕️',category:'Здоровье',description:'Доказательная медицина',lessons:[{title:'Сон',content:'7-9 часов. 4 стадии. Циркадные ритмы.'},{title:'Питание',content:'Средиземноморская. Белок 1.6 г/кг. Овощи 500 г.'},{title:'Микроэлементы',content:'D3, Omega-3, магний, цинк.'},{title:'Движение',content:'150 минут кардио. 2 силовые.'},{title:'Стресс',content:'Сапольски. Кортизол. Хронический стресс.'},{title:'Профилактика',content:'Чекап. Анализы. Вакцинация.'},{title:'Долголетие',content:'Аттиа. Зона 2. Сила. Белок. Сон.'},{title:'Психика=тело',content:'+40% инфаркт при депрессии.'},{title:'Мифы',content:'Детоксы. Суперфуды. Чудо-таблетки.'},{title:'Скорая',content:'FAST. 103. 112.'}]},
{id:'financial_literacy',title:'Финансовая грамотность',emoji:'💰',category:'Финансы',description:'От бюджета до инвестиций',lessons:[{title:'Психология',content:'Хаусел. Деньги — эмоции.'},{title:'Учёт',content:'50/30/20. Записывай. Автоматизируй.'},{title:'Подушка',content:'3-6 месяцев. Отдельный счёт.'},{title:'Долги',content:'Снежный ком. Лавина. Рефинансирование.'},{title:'Инвестиции',content:'Индексные фонды. Долгосрочно. Регулярно.'},{title:'Диверсификация',content:'100 - возраст = % акций.'},{title:'Налоги',content:'ИИС. Вычеты. Оптимизация.'},{title:'Доход',content:'Второй источник. Навык. Фриланс.'},{title:'Страхование',content:'Защитное. Жизнь, здоровье.'},{title:'Пенсия',content:'Сложный процент. Начни сейчас.'}]},
{id:'neuroscience',title:'Нейробиология',emoji:'🔬',category:'Здоровье',description:'Мозг и поведение',lessons:[{title:'Структура',content:'86 млрд нейронов. Кора, лимбическая система.'},{title:'Пластичность',content:'Всю жизнь. Fire together, wire together.'},{title:'Дофамин',content:'Мотивация. Предвкушение. Суперстимулы.'},{title:'Кортизол',content:'Утром высокий. Хронический стресс.'},{title:'Серотонин',content:'Солнце. Триптофан. Настроение.'},{title:'Окситоцин',content:'Связи. Объятия. Доверие.'},{title:'Сон',content:'Глимфатика. Очистка мозга.'},{title:'Питание',content:'Omega-3. Микробиом. Воспаление.'},{title:'Обучение',content:'Интервалы. Тестирование. Сон.'},{title:'Медитация',content:'Lazar. Утолщение коры.'}]},
{id:'communication',title:'Коммуникация',emoji:'💬',category:'Общение',description:'Умение говорить и слушать',lessons:[{title:'Слушание',content:'3 уровня. Парафраз. Эмпатия.'},{title:'Я-сообщения',content:'Формула. Примеры.'},{title:'ННО',content:'Наблюдение, чувства, потребности, просьба.'},{title:'Сложные разговоры',content:'Спокойствие. Пауза. Решение.'},{title:'Влияние',content:'Чалдини. 6 принципов.'},{title:'Выступления',content:'Hook. Структура. Репетиция.'},{title:'Конфликты',content:'Сотрудничество. Ремонт.'},{title:'Обратная связь',content:'SBI. Принятие.'},{title:'Переговоры',content:'BATNA. Интересы. Варианты.'},{title:'Этика',content:'24 часа. Уважение.'}]},
{id:'english_course',title:'Английский с нуля',emoji:'🇬🇧',category:'Обучение',description:'От Beginner до Advanced',lessons:[{title:'Алфавит и звуки',content:'26 букв. 44 звука. Транскрипция.'},{title:'Приветствия',content:'Hello! How are you? Nice to meet you.'},{title:'Числа и время',content:'1-100. Hours. Days.'},{title:'Present Simple',content:'I work. He works. Do you work?'},{title:'Past Simple',content:'I worked. Did you work?'},{title:'Future',content:'I will work. Going to.'},{title:'Present Perfect',content:'I have worked. Since/for.'},{title:'Модальные',content:'Can, must, should, may.'},{title:'Условные',content:'If I... I would...'},{title:'Фразовые глаголы',content:'Get up, give up, look after.'},{title:'Идиомы',content:'Break a leg. Piece of cake.'},{title:'Деловой английский',content:'Emails. Presentations.'},{title:'Академический',content:'Essays. Research.'},{title:'Свободное общение',content:'Debates. Discussions.'}]},
{id:'recovery_course',title:'Восстановление и отдых',emoji:'🌿',category:'Здоровье',description:'Наука отдыха',lessons:[{title:'Виды отдыха',content:'Физический, умственный, сенсорный, эмоциональный, социальный, творческий, духовный.'},{title:'Сон',content:'Гигиена сна. Циркадные ритмы. Мелатонин.'},{title:'Медитация',content:'5-20 минут. Виды. Эффекты.'},{title:'Природа',content:'2 часа в неделю. -16% кортизол.'},{title:'Фильмы и сериалы',content:'Осознанный просмотр. Не более 2 часов.'},{title:'Чтение',content:'20 минут в день. Художественная литература.'},{title:'Музыка',content:'Расслабление. Фокус. Настроение.'},{title:'Творчество',content:'Рисование, музыка, письмо. Поток.'},{title:'Хобби',content:'Радость. Смысл. Баланс.'},{title:'Цифровой детокс',content:'24 часа без экранов. Раз в неделю.'}]},
{id:'memory_master',title:'Мастер памяти',emoji:'🧠',category:'Обучение',description:'Как запоминать всё',lessons:[{title:'Как работает память',content:'3 типа памяти. Кривая Эббингауза.'},{title:'Дворец памяти',content:'Метод локусов. Древнегреческий.'},{title:'Мнемоники',content:'Акронимы, рифмы, истории.'},{title:'Интервальное повторение',content:'Anki. 1, 3, 7, 14, 30 дней.'},{title:'Чанкинг',content:'7±2 элемента. Группировка.'},{title:'Активное припоминание',content:'Testing effect. Recall > Recognition.'},{title:'Метод Фейнмана',content:'Объясни 12-летнему.'},{title:'Сон и память',content:'Консолидация. 7-9 часов.'},{title:'Двойное кодирование',content:'Paivio. Слова + образы.'},{title:'Система',content:'Комбинация всех техник.'}]},
{id:'iq_boost',title:'IQ-тренировки',emoji:'🎯',category:'Обучение',description:'Логика и мышление',lessons:[{title:'Что такое IQ',content:'Средний 100. σ = 15. Тест Равена.'},{title:'Логические последовательности',content:'Арифметические, геометрические, Фибоначчи.'},{title:'Аналогии',content:'A:B = C:? Типы связей.'},{title:'Пространственное мышление',content:'Вращение, развёртки, танграм.'},{title:'Рабочая память',content:'4±1 чанка. N-back.'},{title:'Скорочтение',content:'400-600 слов/мин. Без субвокализации.'},{title:'Критическое мышление',content:'5 вопросов. Ловушки.'},{title:'Математическое мышление',content:'Ментальная арифметика. Оценка.'},{title:'Шахматы',content:'Стратегия. Тактика. Планирование.'},{title:'Система',content:'10 мин N-back + 5 задач + 1 партия.'}]},
{id:'eq_course',title:'Эмоциональный интеллект',emoji:'❤️',category:'Психика',description:'EQ-навыки',lessons:[{title:'Что такое EQ',content:'Гоулман. 5 компонентов.'},{title:'Самосознание',content:'Дневник. Назови эмоцию.'},{title:'Саморегуляция',content:'Дыхание. Пауза 6 сек. Переоценка.'},{title:'Эмпатия',content:'3 типа. Активное слушание.'},{title:'Мотивация',content:'Деси/Райан. Автономия, компетентность, связанность.'},{title:'Социальные навыки',content:'Я-сообщения. SBI. ННО.'},{title:'Стресс',content:'Box breathing. Прогрессивная релаксация.'},{title:'Конфликты',content:'Томас-Килманн. 5 стилей.'},{title:'Границы',content:'Здоровое "нет". Формула.'},{title:'Система',content:'Дневник + пауза + слушание.'}]},
{id:'screentime_course',title:'Цифровой детокс',emoji:'📱',category:'Здоровье',description:'Меньше экрана — больше жизни',lessons:[{title:'Диагностика',content:'Замер. Аудит. Триггеры.'},{title:'Утро',content:'30 мин без телефона. Свет, вода, движение.'},{title:'Deep Work',content:'90 мин авиарежим. Одна задача.'},{title:'Вечер',content:'2 ч без экрана. Мелатонин.'},{title:'Детокс',content:'24 ч в неделю. Перезагрузка дофамина.'},{title:'Среда',content:'Телефон вне спальни. Будильник.'},{title:'Замены',content:'Книга, спорт, хобби. Аналоговые радости.'},{title:'Психология',content:'FOMO. Сравнение. Скука полезна.'},{title:'Инструменты',content:'Forest, Freedom, Screen Time.'},{title:'Система',content:'Привычки + правила + среда.'}]},
{id:'entertainment_course',title:'Осознанный досуг',emoji:'🎬',category:'Восстановление',description:'Кино, книги, музыка',lessons:[{title:'Зачем досуг',content:'Восстановление. Смысл. Радость.'},{title:'Фильмы',content:'Не более 2 часов. Без телефона. Записывай мысли.'},{title:'Сериалы',content:'1-2 серии в день. Не запоем.'},{title:'Книги',content:'20 мин/день. Бумага. Художественная.'},{title:'Музыка',content:'Плейлисты для настроения.'},{title:'Игры',content:'Не более 1 часа. Осознанно.'},{title:'Подкасты',content:'В дороге. На прогулке.'},{title:'Театр/искусство',content:'Раз в месяц. Живое.'},{title:'Детокс от досуга',content:'Иногда — тишина.'},{title:'Баланс',content:'Досуг = часть восстановления.'}]}
];
var LEARNING_LEVELS=[
{id:'l1',num:1,title:'Фундамент',subtitle:'Новичок',emoji:'🌱',desc:'Психика, тело, время.',modules:[
{id:'l1m1',title:'Основы психики',emoji:'🧠',desc:'Как работает мозг',lessons:[
{title:'Что такое психика',theory:'Психика — функция мозга и тела.\n\n**3 уровня:** сознание, подсознание, бессознательное. Мозг пластичен.',practice:'24 часа наблюдай за собой.',reflection:'Что автоматическое?'},
{title:'Эмоции как сигналы',theory:'Эмоция длится **90 сек**. 7 базовых (Экман). Между стимулом и реакцией — пауза.',practice:'Неделю дневник эмоций.',reflection:'Что подавляешь?'},
{title:'Искажения',theory:'95% решений эмоциональны (Канеман). 5 искажений.',practice:'Поймай 3.',reflection:'Какое чаще?'},
{title:'Тревога',theory:'Предсказание. Дыхание 4-7-8.',practice:'4 цикла.',reflection:'Что запускает?'}]},
{id:'l1m2',title:'Основы тела',emoji:'💪',desc:'Сон, питание, движение',lessons:[
{title:'Сон',theory:'4 стадии, 7-9 ч.',practice:'Режим неделю.',reflection:'Что мешает?'},
{title:'Питание',theory:'Средиземноморская.',practice:'3 дня записи.',reflection:'Что даёт энергию?'},
{title:'Движение',theory:'150 мин кардио.',practice:'15-мин прогулка.',reflection:'Что в радость?'},
{title:'Стресс',theory:'Сапольски.',practice:'3 способа.',reflection:'Что успокаивает?'}]},
{id:'l1m3',title:'Основы времени',emoji:'⏰',desc:'Время',lessons:[
{title:'Парадокс',theory:'Энергия важнее.',practice:'4 энергии 1-10.',reflection:'Где провал?'},
{title:'Приоритеты',theory:'Q1 делай, Q2 планируй.',practice:'10 задач.',reflection:'Почему в Q1?'},
{title:'Pomodoro',theory:'25/5.',practice:'4 помидора.',reflection:'Сколько комфортно?'}]}
]},
{id:'l2',num:2,title:'База',subtitle:'Ученик',emoji:'📚',desc:'Эмоции, привычки, энергия.',modules:[
{id:'l2m1',title:'Эмоции',emoji:'🌊',desc:'Саморегуляция',lessons:[
{title:'Дневник',theory:'Назови — снизишь силу на 30%.',practice:'7 дней.',reflection:'Паттерн?'},
{title:'ACT',theory:'"Я замечаю мысль, что..."',practice:'Неделю.',reflection:'Что подавляешь?'},
{title:'Гнев',theory:'Пауза 6 сек.',practice:'Практикуй.',reflection:'Что запускает?'},
{title:'Депрессия',theory:'>2 недель → врач.',practice:'Запишись.',reflection:'Что мешает?'}]},
{id:'l2m2',title:'Привычки',emoji:'🔄',desc:'Изменения',lessons:[
{title:'Петля',theory:'Cue → Craving → Response → Reward.',practice:'1 привычка.',reflection:'Какая?'},
{title:'Stacking',theory:'"После [старая] — [новая]".',practice:'3 привязки.',reflection:'Что авто?'},
{title:'Минимум',theory:'2 отжимания.',practice:'Мини-версия.',reflection:'Что мешает?'},
{title:'Возврат',theory:'Не пропускай дважды.',practice:'План.',reflection:'Что останавливает?'}]},
{id:'l2m3',title:'Энергия',emoji:'🔋',desc:'Восстановление',lessons:[
{title:'Аудит',theory:'Что даёт/забирает?',practice:'Неделю.',reflection:'Что забирает?'},
{title:'Ультрадианные',theory:'90/15.',practice:'Блоки.',reflection:'Как отдыхаешь?'},
{title:'Микро',theory:'Каждый час 2 мин.',practice:'Каждый час.',reflection:'Что чувствуешь?'}]}
]},
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
{title:'Инвестиции',theory:'Индексы.',practice:'Изучи 2.',reflection:'Что останавливает?'}]}
]},
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
{title:'Тень',theory:'Юнг.',practice:'3 раздражения.',reflection:'Что отвергаешь?'}]}
]},
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
{title:'Наследие',theory:'Memento.',practice:'3 вещи.',reflection:'Ради чего?'}]}
]}
];
var ENGLISH_LEVELS=[
{id:'eng_a1',title:'Beginner (A1)',emoji:'🟢',desc:'Основы: приветствия, числа, простые фразы',lessons:[
{title:'Приветствия',content:'Hello! Hi! Good morning! Good afternoon! Good evening! How are you? I am fine, thank you. Nice to meet you.',practice:'Поздоровайся с 3 людьми по-английски.'},
{title:'Числа 1-100',content:'One, two, three... ten, twenty, thirty... one hundred.',practice:'Посчитай от 1 до 20 вслух.'},
{title:'Цвета',content:'Red, blue, green, yellow, black, white, orange, purple, pink, brown.',practice:'Назови 5 цветов вокруг тебя.'},
{title:'Семья',content:'Mother, father, sister, brother, grandmother, grandfather, son, daughter.',practice:'Расскажи о семье: I have...'},
{title:'Еда',content:'Bread, milk, water, apple, banana, meat, fish, rice, egg, cheese.',practice:'Назови 5 продуктов в холодильнике.'},
{title:'Простое предложение',content:'I am... You are... He is... She is... We are... They are...',practice:'Составь 5 предложений о себе.'}]},
{id:'eng_a2',title:'Elementary (A2)',emoji:'🟡',desc:'Базовое общение',lessons:[
{title:'Present Simple',content:'I work. You work. He works. She works. Do you work? Does he work?',practice:'Напиши 10 предложений о своём дне.'},
{title:'Past Simple',content:'I worked. You worked. He worked. Did you work? I did not work.',practice:'Расскажи, что делал вчера.'},
{title:'Future Simple',content:'I will work. You will work. Will you work? I will not work.',practice:'Напиши 5 планов на будущее.'},
{title:'Present Continuous',content:'I am working. You are working. Is he working?',practice:'Опиши, что происходит сейчас.'},
{title:'Модальные глаголы',content:'Can, must, should, may, might. I can swim. You must go.',practice:'Напиши 5 предложений с модальными.'},
{title:'Вопросительные слова',content:'What? Where? When? Why? Who? How?',practice:'Задай 10 вопросов.'}]},
{id:'eng_b1',title:'Intermediate (B1)',emoji:'🟠',desc:'Уверенное общение',lessons:[
{title:'Present Perfect',content:'I have worked. She has worked. Have you worked?',practice:'Напиши 10 предложений о опыте.'},
{title:'Условные предложения',content:'If I had money, I would travel. If I were you, I would...',practice:'Напиши 5 условных.'},
{title:'Пассивный залог',content:'The book is written. The house was built.',practice:'Переделай 5 предложений в пассив.'},
{title:'Фразовые глаголы',content:'Get up, give up, look after, put on, take off, turn on/off.',practice:'Выучи 10 фразовых глаголов.'},
{title:'Идиомы',content:'Break a leg! Piece of cake. Hit the books.',practice:'Выучи 5 идиом.'},
{title:'Артикли',content:'A, an, the. Rules of usage.',practice:'Вставь артикли в 10 предложений.'}]},
{id:'eng_b2',title:'Upper-Intermediate (B2)',emoji:'🔵',desc:'Свободное общение',lessons:[
{title:'Сослагательное наклонение',content:'I wish I knew. If only I had known.',practice:'Напиши 5 предложений.'},
{title:'Инверсия',content:'Never have I seen. Not only did he...',practice:'Напиши 5 инверсий.'},
{title:'Сложные времена',content:'Past Perfect Continuous, Future Perfect.',practice:'Составь 10 предложений.'},
{title:'Словообразование',content:'Suffixes: -tion, -ment, -ness. Prefixes: un-, re-, dis-.',practice:'Образуй 20 слов.'},
{title:'Деловой английский',content:'Emails, presentations, negotiations.',practice:'Напиши деловое письмо.'},
{title:'Академический английский',content:'Essay structure, linking words.',practice:'Напиши эссе 200 слов.'}]},
{id:'eng_c1',title:'Advanced (C1)',emoji:'🟣',desc:'Продвинутый',lessons:[
{title:'Нюансы',content:'Nuances, connotations, register.',practice:'Анализ текста.'},
{title:'Стилистика',content:'Formal, informal, academic, business.',practice:'Напиши в 3 стилях.'},
{title:'Дискурс',content:'Cohesion, coherence, flow.',practice:'Напиши статью.'},
{title:'Литературный английский',content:'Metaphors, similes, imagery.',practice:'Напиши рассказ.'},
{title:'Дебаты',content:'Argumentation, rebuttal, persuasion.',practice:'Подготовь аргументы.'},
{title:'Культура',content:'British vs American, idioms, slang.',practice:'Сравни культуры.'}]}
];
var ENTERTAINMENT_LIBRARY=[
{id:'movies',emoji:'🎬',name:'Фильмы',desc:'20 лучших фильмов с описанием',tips:'Не более 2 часов. Без телефона. Записывай мысли.',count:20},
{id:'series',emoji:'📺',name:'Сериалы',desc:'20 культовых сериалов',tips:'1-2 серии в день. Не запоем.',count:20},
{id:'books',emoji:'📚',name:'Книги',desc:'20 книг, меняющих мышление',tips:'20 минут в день. Бумага. Без телефона.',count:20},
{id:'music',emoji:'🎵',name:'Музыка',desc:'10 плейлистов по настроению',tips:'Расслабление. Фокус. Настроение.',count:10},
{id:'games',emoji:'🎮',name:'Игры',desc:'12 игр с глубоким сюжетом',tips:'Не более 1 часа. Осознанно.',count:12},
{id:'podcasts',emoji:'🎧',name:'Подкасты',desc:'10 подкастов для развития',tips:'В дороге. На прогулке.',count:10},
{id:'theater',emoji:'🎭',name:'Театр',desc:'8 пьес мирового уровня',tips:'Раз в месяц. С близкими.',count:8},
{id:'art',emoji:'🎨',name:'Искусство',desc:'10 шедевров живописи',tips:'Раз в месяц. Вдохновение.',count:10}
];
var ACHIEVEMENTS=[
{id:'first_task',icon:'🎯',name:'Первый шаг',check:function(s){return s.tasks.length>=1}},
{id:'ten_tasks',icon:'🔟',name:'10 задач',check:function(s){return s.tasks.length>=10}},
{id:'hundred_tasks',icon:'💯',name:'100 задач',check:function(s){return s.tasks.length>=100}},
{id:'first_habit',icon:'🌱',name:'Привычка',check:function(s){return s.habits.length>=1}},
{id:'streak_7',icon:'🔥',name:'Неделя',check:function(s){return (s.stats.streak||0)>=7}},
{id:'streak_30',icon:'⚡',name:'Месяц',check:function(s){return (s.stats.streak||0)>=30}},
{id:'streak_100',icon:'💎',name:'100 дней',check:function(s){return (s.stats.streak||0)>=100}},
{id:'first_chat',icon:'💬',name:'Диалог',check:function(s){return s.chats.length>=1}},
{id:'ai_master',icon:'🧠',name:'AI-мастер',check:function(s){return s.chats.filter(function(c){return c.role==='user'}).length>=50}},
{id:'writer',icon:'📝',name:'Писатель',check:function(s){return s.notes.length>=10}},
{id:'scholar',icon:'🎓',name:'Учёный',check:function(s){return Object.keys(s.levelProgress||{}).length>=10}},
{id:'level1',icon:'🌱',name:'Фундамент',check:function(s){return checkLevelComplete(s,'l1')}},
{id:'level2',icon:'📚',name:'Ученик',check:function(s){return checkLevelComplete(s,'l2')}},
{id:'level3',icon:'🎯',name:'Практик',check:function(s){return checkLevelComplete(s,'l3')}},
{id:'level4',icon:'👑',name:'Мастер',check:function(s){return checkLevelComplete(s,'l4')}},
{id:'level5',icon:'🌟',name:'Наставник',check:function(s){return checkLevelComplete(s,'l5')}},
{id:'survey_done',icon:'📋',name:'Профиль',check:function(s){return s.profile&&s.profile.surveyDone}},
{id:'all_domains',icon:'🌐',name:'Все домены',check:function(s){return Object.keys(s.domainScores||{}).length>=3}},
{id:'english_start',icon:'🇬🇧',name:'English',check:function(s){return s.englishProgress&&Object.keys(s.englishProgress).length>=1}},
{id:'english_master',icon:'🎓',name:'English Master',check:function(s){return s.englishProgress&&Object.keys(s.englishProgress).length>=20}},
{id:'meditation_10',icon:'🧘',name:'10 медитаций',check:function(s){return (s.meditations||[]).length>=10}},
{id:'workout_10',icon:'🏋️',name:'10 тренировок',check:function(s){return (s.workouts||[]).length>=10}},
{id:'journal_10',icon:'📓',name:'10 записей',check:function(s){return (s.journal||[]).length>=10}},
{id:'water_100',icon:'💧',name:'100 стаканов',check:function(s){return (s.water||[]).reduce(function(a,w){return a+(w.count||0)},0)>=100}},
{id:'mood_30',icon:'💭',name:'30 настроений',check:function(s){return (s.mood||[]).length>=30}},
{id:'entertainment_10',icon:'🎬',name:'Киноман',check:function(s){return (s.entertainment||[]).length>=10}},
{id:'movie_10',icon:'🎥',name:'Кинокритик',check:function(s){return (s.watched||[]).filter(function(w){return w.type==='movie'}).length>=10}},
{id:'book_5',icon:'📚',name:'Книголюб',check:function(s){return (s.watched||[]).filter(function(w){return w.type==='book'}).length>=5}},
{id:'screen_detox',icon:'🚫',name:'Детокс',check:function(s){return (s.screenHabits||{})&&Object.keys(s.screenHabits).length>=7}},
{id:'memory_master',icon:'🧠',name:'Мастер памяти',check:function(s){return (s.memoryTraining||[]).length>=30}},
{id:'iq_boost',icon:'🎯',name:'IQ+',check:function(s){return (s.iqScores||[]).length>=10}},
{id:'finance_start',icon:'💰',name:'Финансист',check:function(s){return (s.finance||[]).length>=10}},
{id:'watchlist_10',icon:'📋',name:'Список',check:function(s){return (s.watchlist||[]).length>=10}}
];
function checkLevelComplete(s,levelId){var level=LEARNING_LEVELS.find(function(l){return l.id===levelId});if(!level)return false;for(var m=0;m<level.modules.length;m++){var mod=level.modules[m];for(var l=0;l<mod.lessons.length;l++){var key=levelId+'_'+mod.id+'_'+l;if(!s.levelProgress||!s.levelProgress[key])return false}}return true}
function checkAchievements(){var unlocked=state.profile.achievements||[];var newOnes=[];for(var i=0;i<ACHIEVEMENTS.length;i++){var a=ACHIEVEMENTS[i];if(unlocked.indexOf(a.id)<0&&a.check(state)){unlocked.push(a.id);newOnes.push(a)}}state.profile.achievements=unlocked;if(newOnes.length){save();newOnes.forEach(function(a,idx){setTimeout(function(){toast('🏆 '+a.name,'success',3500);playAchievementSound();haptic('success')},idx*800)})}}
var METHODS_LIBRARY=[
{id:'cbt',title:'КПТ',emoji:'🧠',category:'Терапевтические',desc:'Когнитивно-поведенческая',steps:['Запиши ситуацию','Автоматическую мысль','Доказательства за/против','Альтернатива','Проверь'],base:'Аарон Бек, 1960-е'},
{id:'act',title:'ACT',emoji:'🎭',category:'Терапевтические',desc:'Принятие и ответственность',steps:['Прими мысли','Разделись','Вернись в настоящее','Ценности','Действуй'],base:'Стивен Хейс'},
{id:'dbt',title:'DBT',emoji:'⚖️',category:'Терапевтические',desc:'Диалектическая',steps:['Осознанность','Регуляция эмоций','Переносимость дистресса','Межличностная'],base:'Марша Линехан'},
{id:'ifs',title:'IFS',emoji:'🔮',category:'Терапевтические',desc:'Внутренние части',steps:['Заметь часть','Познакомься','Найди функцию','Познакомь с Self','Интеграция'],base:'Ричард Шварц'},
{id:'grow',title:'GROW',emoji:'🌱',category:'Коучинговые',desc:'Классика',steps:['Goal','Reality','Options','Will'],base:'Джон Уитмор'},
{id:'deepwork',title:'Deep Work',emoji:'🎯',category:'Продуктивность',desc:'Глубокая работа',steps:['90 мин блок','Телефон в комнату','Одна задача','15 мин отдых','Метрики'],base:'Кэл Ньюпорт'},
{id:'pomodoro',title:'Помодоро',emoji:'🍅',category:'Продуктивность',desc:'25/5',steps:['Задача','Таймер 25','Работа','5 мин','4 цикла → 30'],base:'Чирилло'},
{id:'gtd',title:'GTD',emoji:'📥',category:'Продуктивность',desc:'Getting Things Done',steps:['Capture','Clarify','Organize','Reflect','Engage'],base:'Дэвид Аллен'},
{id:'habit_loop',title:'Петля привычки',emoji:'🔄',category:'Привычки',desc:'Cue → Reward',steps:['Триггер','Желание','Действие','Награда'],base:'Дахигг, Клир'},
{id:'habit_stack',title:'Habit Stacking',emoji:'🧱',category:'Привычки',desc:'Привязка',steps:['После [старая]','Я буду [новая]','2 минуты','Отмечай','Увеличивай'],base:'Фогг'},
{id:'kaizen',title:'Кайзен',emoji:'📈',category:'Привычки',desc:'1%',steps:['Область','Маленькое улучшение','Внедри','Оцени','Повтори'],base:'Японская'},
{id:'breath478',title:'Дыхание 4-7-8',emoji:'🌬',category:'Дыхательные',desc:'Успокоение',steps:['Вдох 4','Задержка 7','Выдох 8','Повтор 4'],base:'Эндрю Вейл'},
{id:'box_breathing',title:'Квадратное',emoji:'⬛',category:'Дыхательные',desc:'Box',steps:['Вдох 4','Задержка 4','Выдох 4','Задержка 4'],base:'Navy SEALs'},
{id:'wim_hof',title:'Вим Хоф',emoji:'❄️',category:'Дыхательные',desc:'Дыхание + холод',steps:['30-40 вдохов','Задержка','Восстановление','Холодный душ','Повтор'],base:'Вим Хоф'},
{id:'ikigai',title:'Икигай',emoji:'🌺',category:'Смысл',desc:'Японский смысл',steps:['Что люблю?','Что умею?','За что платят?','Что нужно миру?','Пересечение'],base:'Японская'},
{id:'stoicism',title:'Стоицизм',emoji:'🏛',category:'Смысл',desc:'Дихотомия',steps:['В моей власти?','Вне?','Фокус','Принятие','Действие'],base:'Марк Аврелий'},
{id:'logotherapy',title:'Логотерапия',emoji:'🎯',category:'Смысл',desc:'Смысл',steps:['"Зачем"','Труд/любовь/страдание','Прими','Ответственность','Действуй'],base:'Франкл'},
{id:'mindfulness',title:'Mindfulness',emoji:'🧘',category:'Осознанность',desc:'Осознанность',steps:['Сядь','Дыхание','Возвращай','5-20 мин','Ежедневно'],base:'Каббат-Зинн'},
{id:'body_scan',title:'Body Scan',emoji:'🫀',category:'Осознанность',desc:'Сканирование',steps:['Ляг','Стопы','Вверх','Ощущения','10-20 мин'],base:'MBSR'},
{id:'grounding',title:'Заземление',emoji:'⚓',category:'Осознанность',desc:'5-4-3-2-1',steps:['5 видишь','4 слышишь','3 осязаешь','2 обоняешь','1 вкус'],base:'При тревоге'},
{id:'nvc',title:'ННО',emoji:'💬',category:'Общение',desc:'Ненасильственное',steps:['Наблюдение','Чувства','Потребности','Просьба'],base:'Розенберг'},
{id:'sbi',title:'SBI',emoji:'📣',category:'Общение',desc:'Обратная связь',steps:['Situation','Behavior','Impact','Обсуждение','Договорённость'],base:'CCL'},
{id:'cold_exposure',title:'Холод',emoji:'🥶',category:'Тело',desc:'Холодный душ',steps:['30 сек','2 мин','Дыхание','Согревание','Регулярно'],base:'Вим Хоф'},
{id:'sauna',title:'Сауна',emoji:'🔥',category:'Тело',desc:'Термическая',steps:['80-100°C','15-20 мин','Охлаждение','2-4 раза','Гидратация'],base:'Финская'},
{id:'fasting',title:'Голодание 16:8',emoji:'⏱',category:'Тело',desc:'Интервальное',steps:['Схема','Ешь 8 ч','Голодай 16','Вода','Постепенно'],base:'Нобель 2016'},
{id:'zone2',title:'Зона 2',emoji:'🏃',category:'Тело',desc:'Кардио 60-70%',steps:['Пульс 180-age','Можно говорить','3-4 ч/нед','Бег/велосипед','Регулярно'],base:'Аттиа'},
{id:'hiit',title:'HIIT',emoji:'💥',category:'Тело',desc:'Интервальный',steps:['20 сек макс','10 сек отдых','8 циклов','1-2 мин пауза','Повтор'],base:'Табата'},
{id:'strength',title:'Силовые',emoji:'🏋️',category:'Тело',desc:'Прогрессия',steps:['Базовые','4-6 повт','4 подхода','Прогрессия','Восстановление'],base:'Ментцер'},
{id:'mobility',title:'Мобильность',emoji:'🤸',category:'Тело',desc:'Гибкость',steps:['10 мин','Динамическая','Основные суставы','Ежедневно'],base:'Староста'},
{id:'50_30_20',title:'Бюджет 50/30/20',emoji:'💼',category:'Финансы',desc:'Распределение',steps:['50 нужды','30 желания','20 сбережения','Авто','Проверка'],base:'Уоррен'},
{id:'fire',title:'FIRE',emoji:'🔥',category:'Финансы',desc:'Финансовая независимость',steps:['Норма сбережений','Доход','Расходы','Индексы','25x'],base:'Mr. Money Mustache'},
{id:'snowball',title:'Снежный ком',emoji:'⛄',category:'Финансы',desc:'Долги',steps:['Список','По сумме','Минимум','Мелкий → макс','Дальше'],base:'Рамси'},
{id:'time_block',title:'Time-blocking',emoji:'📅',category:'Продуктивность',desc:'Блоки',steps:['Список','Оценка','Слоты','Буферы','Корректировка'],base:'Маск'},
{id:'eat_frog',title:'Eat That Frog',emoji:'🐸',category:'Продуктивность',desc:'Сложное первым',steps:['Главная задача','Утром','Без отвлечений','Отдых'],base:'Трейси'},
{id:'kanban',title:'Канбан',emoji:'📊',category:'Продуктивность',desc:'Визуальное',steps:['To Do/Doing/Done','Лимит WIP','Двигай','Анализ','Оптимизация'],base:'Toyota'},
{id:'eisenhower',title:'Матрица Эйзенхауэра',emoji:'🔢',category:'Продуктивность',desc:'Приоритеты',steps:['Q1 Делай','Q2 Планируй','Q3 Делегируй','Q4 Удали'],base:'Эйзенхауэр'},
{id:'10_10_10',title:'10/10/10',emoji:'🕐',category:'Решения',desc:'Долгосрочно',steps:['10 минут','10 месяцев','10 лет','Решение'],base:'Сузи Уэлч'},
{id:'inversion',title:'Инверсия',emoji:'🔄',category:'Решения',desc:'От противного',steps:['Что хочу?','Что худшее?','Как избежать?','Действие'],base:'Мангер'},
{id:'first_principles',title:'First Principles',emoji:'🧩',category:'Решения',desc:'Первые принципы',steps:['Факты','Разбей','Пересобери','Решение'],base:'Аристотель'},
{id:'second_order',title:'Второй порядок',emoji:'🔍',category:'Решения',desc:'Последствия',steps:['Результат','А потом?','А ещё потом?','Решение'],base:'Маркс'},
{id:'english_immersion',title:'Погружение',emoji:'🇬🇧',category:'Английский',desc:'Метод погружения',steps:['Среда','Слушай 1 час','Говори 15 мин','Читай 20 мин','Пиши 10 мин'],base:'Крашен'},
{id:'english_shadowing',title:'Shadowing',emoji:'🎤',category:'Английский',desc:'Повтор за носителем',steps:['Выбери отрывок','Слушай','Повторяй одновременно','Записывай себя','Анализируй'],base:'Аронсон'},
{id:'english_anki',title:'Anki',emoji:'🃏',category:'Английский',desc:'Интервальное повторение',steps:['Создай карточки','10 новых/день','Повторяй','Оценивай','Регулярно'],base:'Вожецки'},
{id:'rest_sleep',title:'Сон',emoji:'😴',category:'Восстановление',desc:'Гигиена сна',steps:['Режим','Темнота','Прохлада','Без экранов','7-9 часов'],base:'Уокер'},
{id:'rest_nature',title:'Природа',emoji:'🌲',category:'Восстановление',desc:'Время на природе',steps:['2 часа/нед','Парк','Лес','Вода','Солнце'],base:'Ульрих'},
{id:'rest_reading',title:'Чтение',emoji:'📚',category:'Восстановление',desc:'Художественная литература',steps:['20 мин/день','Бумага','Без телефона','Удовольствие'],base:'Вульф'},
{id:'rest_movies',title:'Фильмы',emoji:'🎬',category:'Восстановление',desc:'Осознанный просмотр',steps:['Выбери фильм','Без телефона','Обсуди','Запиши мысли'],base:'Кэмерон'},
{id:'rest_music',title:'Музыка',emoji:'🎵',category:'Восстановление',desc:'Расслабление',steps:['Плейлист','Наушники','Закрой глаза','Слушай','Чувствуй'],base:'Левитин'},
{id:'rest_meditation',title:'Медитация',emoji:'🧘',category:'Восстановление',desc:'Практика',steps:['5-20 мин','Тишина','Дыхание','Возвращай','Ежедневно'],base:'Каббат-Зинн'}
];
var PERSONAS={
coach:{name:'Коуч',color:'coach',label:'Продуктивность 80 лет',emoji:'💬',prompt:'Ты — AI-Коуч с 80-летним опытом. GROW, SMART, Deep Work, Икигай, Стоицизм. 150-220 слов.'},
psych:{name:'Психолог',color:'psych',label:'Клинический 80 лет',emoji:'🧠',prompt:'Ты — AI-Психолог с 80-летним опытом. КПТ, ACT, DBT. НЕ ставь диагнозы! При кризисе → 8-800-2000-122. 150-220 слов.'},
doctor:{name:'Врач',color:'doctor',label:'Медицина 80 лет',emoji:'⚕️',prompt:'Ты — AI-Врач с 80-летним опытом. НЕ ставь диагнозы. ВСЕГДА дисклеймер. Острые → 103/112. 150-250 слов.'},
nutrition:{name:'Нутрициолог',color:'nutrition',label:'Питание 80 лет',emoji:'🥗',prompt:'Ты — AI-Нутрициолог с 80-летним опытом. 150-200 слов.'},
fitness:{name:'Тренер',color:'fitness',label:'Фитнес 80 лет',emoji:'🏋️',prompt:'Ты — AI-Фитнес-тренер с 80-летним опытом. 150-200 слов.'},
lawyer:{name:'Юрист',color:'lawyer',label:'Право 80 лет',emoji:'⚖️',prompt:'Ты — AI-Юрист с 80-летним опытом. 150-200 слов.'},
finance:{name:'Финансист',color:'finance',label:'Финансы 80 лет',emoji:'💰',prompt:'Ты — AI-Финансовый консультант с 80-летним опытом. 150-200 слов.'}
};
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
var currentPage='dashboard';
var currentLevelId=null;
var currentModuleId=null;
var currentLessonIdx=null;
var currentPathId=null;
var currentEnglishLevel=null;
var state;
try{var raw=localStorage.getItem(STORAGE_KEY);if(raw){var parsed=JSON.parse(raw);state=Object.assign(defaultState(),parsed);state.settings=Object.assign(defaultState().settings,parsed.settings||{});state.flags=Object.assign(defaultState().flags,parsed.flags||{});state.stats=Object.assign(defaultState().stats,parsed.stats||{});state.profile=Object.assign(defaultState().profile,parsed.profile||{});state.screenTime=Object.assign(defaultState().screenTime,parsed.screenTime||{});state.integrations=Object.assign(defaultState().integrations,parsed.integrations||{});if(!state.levelProgress)state.levelProgress={};if(!state.englishProgress)state.englishProgress={};if(!state.domainScores)state.domainScores={};if(!state.metrics)state.metrics={};if(!state.entertainment)state.entertainment=[];if(!state.watchlist)state.watchlist=[];if(!state.watched)state.watched=[];if(!state.screenStats)state.screenStats={};if(!state.screenHabits)state.screenHabits={};if(!state.finance)state.finance=[];if(!state.financeGoals)state.financeGoals=[];if(!state.eqJournal)state.eqJournal=[];if(!state.memoryTraining)state.memoryTraining=[];if(!state.iqScores)state.iqScores=[];if(!state.screenDaily)state.screenDaily={}}else{state=defaultState()}}catch(e){state=defaultState()}
function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}catch(e){}}
window.__DATA_READY=true;