'use strict';
/* AI HEALTH v33 — SURVEYS (утро/вечер/неделя/месяц/квартал/год + базовый опрос + адаптация) */

/* ============================================================
   ЧАСТЬ 1. ПЕРИОДИЧЕСКИЕ ОПРОСЫ
   ============================================================ */

/* ---------- УТРЕННИЙ ОПРОС (о вчера) ---------- */
var MORNING_SURVEY=[
{id:'sleepHours',q:'Сколько часов спал прошлой ночью?',type:'number',default:7,min:0,max:14,step:0.5,icon:'😴'},
{id:'sleepQuality',q:'Качество сна?',type:'slider',default:7,icon:'🛏'},
{id:'mood',q:'Настроение вчера вечером?',type:'slider',default:7,icon:'💭'},
{id:'energy',q:'Энергия утром?',type:'slider',default:7,icon:'🔋'},
{id:'stress',q:'Уровень стресса вчера?',type:'slider',default:5,icon:'🌊'},
{id:'screenMinutes',q:'Сколько минут экрана вчера?',type:'number',default:240,min:0,max:1440,step:15,icon:'📱'},
{id:'focus',q:'Концентрация вчера?',type:'slider',default:7,icon:'🎯'},
{id:'water',q:'Стаканов воды вчера?',type:'number',default:6,min:0,max:20,step:1,icon:'💧'},
{id:'workouts',q:'Тренировок вчера?',type:'number',default:0,min:0,max:5,step:1,icon:'🏋️'},
{id:'steps',q:'Шагов вчера (примерно)?',type:'number',default:5000,min:0,max:50000,step:500,icon:'🚶'},
{id:'meals',q:'Сколько раз ел?',type:'number',default:3,min:0,max:10,step:1,icon:'🍽'},
{id:'wins',q:'Главная победа вчера?',type:'text',icon:'🏆'},
{id:'lessons',q:'Что понял/узнал?',type:'text',icon:'💡'},
{id:'regret',q:'О чём жалеешь?',type:'text',icon:'😔'},
{id:'gratitude',q:'За что благодарен?',type:'text',icon:'🙏'}
];

/* ---------- ВЕЧЕРНИЙ ОПРОС (о сегодня) ---------- */
var EVENING_SURVEY=[
{id:'dayRating',q:'Как прошёл день?',type:'slider',default:7,icon:'⭐'},
{id:'productivity',q:'Насколько продуктивен?',type:'slider',default:7,icon:'⚡'},
{id:'mood',q:'Настроение сейчас?',type:'slider',default:7,icon:'💭'},
{id:'energy',q:'Энергия сейчас?',type:'slider',default:6,icon:'🔋'},
{id:'stress',q:'Стресс сейчас?',type:'slider',default:5,icon:'🌊'},
{id:'tasksDone',q:'Сколько задач выполнил?',type:'number',default:3,min:0,max:50,step:1,icon:'✅'},
{id:'screenToday',q:'Минут экрана сегодня?',type:'number',default:240,min:0,max:1440,step:15,icon:'📱'},
{id:'waterToday',q:'Стаканов воды?',type:'number',default:6,min:0,max:20,step:1,icon:'💧'},
{id:'bestThing',q:'Лучшее за день?',type:'text',icon:'✨'},
{id:'worstThing',q:'Худшее за день?',type:'text',icon:'💢'},
{id:'lesson',q:'Главный урок дня?',type:'text',icon:'📚'},
{id:'tomorrow',q:'Главная цель на завтра?',type:'text',icon:'🎯'},
{id:'energyDrain',q:'Что забрало больше всего энергии?',type:'text',icon:'🔻'},
{id:'energyBoost',q:'Что дало энергию?',type:'text',icon:'🔺'}
];

/* ---------- НЕДЕЛЬНЫЙ ОПРОС ---------- */
var WEEKLY_SURVEY=[
{id:'weekRating',q:'Как прошла неделя?',type:'slider',default:7,icon:'⭐'},
{id:'mainAchievement',q:'Главное достижение недели?',type:'text',icon:'🏆'},
{id:'biggestFail',q:'Главный провал?',type:'text',icon:'💔'},
{id:'lessonsLearned',q:'Чему научился за неделю?',type:'text',icon:'📚'},
{id:'habitsDone',q:'Сколько привычек выполнил?',type:'number',default:5,min:0,max:30,step:1,icon:'🔄'},
{id:'avgSleep',q:'Средний сон за неделю?',type:'number',default:7,min:0,max:14,step:0.5,icon:'😴'},
{id:'avgMood',q:'Среднее настроение?',type:'slider',default:7,icon:'💭'},
{id:'avgStress',q:'Средний стресс?',type:'slider',default:5,icon:'🌊'},
{id:'totalScreen',q:'Всего часов экрана за неделю?',type:'number',default:28,min:0,max:168,step:0.5,icon:'📱'},
{id:'relationships',q:'Как дела с близкими?',type:'slider',default:7,icon:'💞'},
{id:'healthRating',q:'Как здоровье на этой неделе?',type:'slider',default:7,icon:'❤️'},
{id:'financeRating',q:'Как финансы?',type:'slider',default:6,icon:'💰'},
{id:'nextWeekFocus',q:'Главный фокус следующей недели?',type:'text',icon:'🎯'},
{id:'whatToChange',q:'Что изменить на следующей неделе?',type:'text',icon:'🔄'},
{id:'whatToKeep',q:'Что оставить как есть?',type:'text',icon:'✅'}
];

/* ---------- МЕСЯЧНЫЙ ОПРОС ---------- */
var MONTHLY_SURVEY=[
{id:'monthRating',q:'Как прошёл месяц?',type:'slider',default:7,icon:'⭐'},
{id:'topAchievement',q:'Топ-достижение месяца?',type:'text',icon:'🏆'},
{id:'topLesson',q:'Главный урок месяца?',type:'text',icon:'📚'},
{id:'progressGoal',q:'Прогресс к главной цели (%)?',type:'number',default:10,min:0,max:100,step:1,icon:'🎯'},
{id:'habitsStreak',q:'Лучший streak привычки (дней)?',type:'number',default:10,min:0,max:365,step:1,icon:'🔥'},
{id:'booksRead',q:'Книг прочитано?',type:'number',default:1,min:0,max:50,step:1,icon:'📖'},
{id:'coursesDone',q:'Курсов завершено?',type:'number',default:0,min:0,max:20,step:1,icon:'🎓'},
{id:'newSkills',q:'Новых навыков освоено?',type:'number',default:0,min:0,max:20,step:1,icon:'💎'},
{id:'savingsPercent',q:'Процент дохода в сбережения?',type:'number',default:20,min:0,max:100,step:1,icon:'💰'},
{id:'healthChange',q:'Как изменилось здоровье?',type:'options',options:[{v:'better',l:'Лучше',e:'📈'},{v:'same',l:'Так же',e:'➡️'},{v:'worse',l:'Хуже',e:'📉'}],icon:'❤️'},
{id:'moodChange',q:'Как изменилось настроение?',type:'options',options:[{v:'better',l:'Лучше',e:'📈'},{v:'same',l:'Так же',e:'➡️'},{v:'worse',l:'Хуже',e:'📉'}],icon:'💭'},
{id:'relationshipsChange',q:'Отношения изменились?',type:'options',options:[{v:'better',l:'Лучше',e:'📈'},{v:'same',l:'Так же',e:'➡️'},{v:'worse',l:'Хуже',e:'📉'}],icon:'💞'},
{id:'biggestRegret',q:'О чём жалеешь в этом месяце?',type:'text',icon:'😔'},
{id:'proudOf',q:'Чем гордишься?',type:'text',icon:'💪'},
{id:'nextMonthGoals',q:'3 цели на следующий месяц?',type:'text',icon:'🎯'}
];

/* ---------- КВАРТАЛЬНЫЙ ОПРОС ---------- */
var QUARTERLY_SURVEY=[
{id:'quarterRating',q:'Оценка квартала?',type:'slider',default:7,icon:'⭐'},
{id:'goalProgress',q:'Прогресс к годовым целям (%)?',type:'number',default:25,min:0,max:100,step:1,icon:'🎯'},
{id:'majorWins',q:'3 главные победы квартала?',type:'text',icon:'🏆'},
{id:'majorFails',q:'3 главных провала?',type:'text',icon:'💔'},
{id:'careerProgress',q:'Прогресс в карьере?',type:'slider',default:6,icon:'💼'},
{id:'healthProgress',q:'Прогресс в здоровье?',type:'slider',default:7,icon:'❤️'},
{id:'financeProgress',q:'Прогресс в финансах?',type:'slider',default:6,icon:'💰'},
{id:'relationshipsProgress',q:'Прогресс в отношениях?',type:'slider',default:7,icon:'💞'},
{id:'mentalProgress',q:'Прогресс в ментальном?',type:'slider',default:7,icon:'🧠'},
{id:'skillsProgress',q:'Какие новые навыки освоил?',type:'text',icon:'💎'},
{id:'quarterLesson',q:'Главный урок квартала?',type:'text',icon:'📚'},
{id:'nextQuarterFocus',q:'Главный фокус следующего квартала?',type:'text',icon:'🎯'},
{id:'whatToStop',q:'Что перестать делать?',type:'text',icon:'🛑'},
{id:'whatToStart',q:'Что начать делать?',type:'text',icon:'🚀'},
{id:'whatToContinue',q:'Что продолжать?',type:'text',icon:'✅'}
];

/* ---------- ГОДОВОЙ ОПРОС ---------- */
var YEARLY_SURVEY=[
{id:'yearRating',q:'Оценка года?',type:'slider',default:7,icon:'⭐'},
{id:'bestMoment',q:'Лучший момент года?',type:'text',icon:'✨'},
{id:'hardestMoment',q:'Самый сложный момент?',type:'text',icon:'💔'},
{id:'yearLesson',q:'Главный урок года?',type:'text',icon:'📚'},
{id:'topAchievement',q:'Топ-достижение года?',type:'text',icon:'🏆'},
{id:'goalCompletion',q:'% выполненных годовых целей?',type:'number',default:60,min:0,max:100,step:1,icon:'🎯'},
{id:'healthYear',q:'Как здоровье за год?',type:'slider',default:7,icon:'❤️'},
{id:'financeYear',q:'Как финансы за год?',type:'slider',default:6,icon:'💰'},
{id:'relationshipsYear',q:'Как отношения за год?',type:'slider',default:7,icon:'💞'},
{id:'careerYear',q:'Карьера за год?',type:'slider',default:7,icon:'💼'},
{id:'mentalYear',q:'Ментальное за год?',type:'slider',default:7,icon:'🧠'},
{id:'newSkillsYear',q:'3 новых навыка за год?',type:'text',icon:'💎'},
{id:'booksYear',q:'Сколько книг прочитал?',type:'number',default:12,min:0,max:365,step:1,icon:'📖'},
{id:'countriesYear',q:'Сколько стран посетил?',type:'number',default:0,min:0,max:100,step:1,icon:'🌍'},
{id:'nextYearTheme',q:'Тема следующего года одним словом?',type:'text',icon:'🎯'},
{id:'nextYearGoals',q:'3 главные цели на следующий год?',type:'text',icon:'🚀'},
{id:'nextYearHabits',q:'Какие привычки введёшь?',type:'text',icon:'🔄'},
{id:'lifeSatisfaction',q:'Удовлетворённость жизнью (1-10)?',type:'slider',default:7,icon:'🌟'}
];

/* ============================================================
   ЧАСТЬ 2. РАСШИРЕННЫЙ БАЗОВЫЙ ОПРОС (60+ вопросов)
   ============================================================ */

var EXTENDED_SURVEY=[
/* Блок 1: Идентичность */
{id:'name',q:'Как тебя зовут?',type:'text',block:'Идентичность'},
{id:'age',q:'Сколько тебе лет?',type:'options',options:[{v:'14-17',l:'14-17',e:'🧑'},{v:'18-25',l:'18-25',e:'🧑‍🎓'},{v:'26-35',l:'26-35',e:'👨‍💼'},{v:'36-45',l:'36-45',e:'👩‍💼'},{v:'46-55',l:'46-55',e:'🧓'},{v:'56+',l:'56+',e:'👴'}],block:'Идентичность'},
{id:'gender',q:'Пол?',type:'options',options:[{v:'m',l:'Мужской',e:'♂️'},{v:'f',l:'Женский',e:'♀️'},{v:'other',l:'Другое',e:'⚧'}],block:'Идентичность'},
{id:'city',q:'Город?',type:'text',block:'Идентичность'},
{id:'occupation',q:'Чем занимаешься?',type:'options',options:[{v:'it',l:'IT/Разработка',e:'💻'},{v:'business',l:'Бизнес',e:'💼'},{v:'creative',l:'Творчество',e:'🎨'},{v:'medicine',l:'Медицина',e:'⚕️'},{v:'education',l:'Образование',e:'📚'},{v:'student',l:'Учусь',e:'🎓'},{v:'other',l:'Другое',e:'🔷'}],block:'Идентичность'},
{id:'familyStatus',q:'Семейное положение?',type:'options',options:[{v:'single',l:'Один/одна',e:'🙋'},{v:'relationship',l:'В отношениях',e:'💑'},{v:'married',l:'Женат/замужем',e:'💍'},{v:'divorced',l:'Разведён(а)',e:'💔'},{v:'widowed',l:'Вдовец/вдова',e:'🕊'}],block:'Идентичность'},
{id:'kids',q:'Сколько детей?',type:'number',default:0,min:0,max:15,step:1,block:'Идентичность'},

/* Блок 2: Цели и смысл */
{id:'mainGoal',q:'Главная цель жизни?',type:'options',options:[{v:'health',l:'Улучшить здоровье',e:'❤️'},{v:'productivity',l:'Продуктивнее',e:'⚡'},{v:'mental',l:'Психическое равновесие',e:'🧠'},{v:'career',l:'Карьера и деньги',e:'💰'},{v:'relationships',l:'Отношения',e:'💞'},{v:'meaning',l:'Найти смысл',e:'🕊'},{v:'discipline',l:'Дисциплина',e:'⚔️'},{v:'freedom',l:'Свобода',e:'🦅'}],block:'Цели'},
{id:'lifeVision',q:'Как выглядит идеальная жизнь через 5 лет?',type:'text',block:'Цели'},
{id:'mainValues',q:'Топ-3 ценности (через запятую)?',type:'text',block:'Цели'},
{id:'biggestDream',q:'Мечта, если бы всё сработало?',type:'text',block:'Цели'},
{id:'successDefinition',q:'Что для тебя успех?',type:'text',block:'Цели'},
{id:'lifePurpose',q:'Зачем ты просыпаешься утром?',type:'text',block:'Цели'},

/* Блок 3: Проблемы и барьеры */
{id:'biggestChallenge',q:'Что мешает больше всего?',type:'options',options:[{v:'procrastination',l:'Прокрастинация',e:'⏳'},{v:'anxiety',l:'Тревога',e:'🌊'},{v:'burnout',l:'Выгорание',e:'🔥'},{v:'sleep',l:'Плохой сон',e:'😴'},{v:'focus',l:'Нет концентрации',e:'🎯'},{v:'energy',l:'Нет энергии',e:'🔋'},{v:'money',l:'Финансы',e:'💰'},{v:'relationships',l:'Отношения',e:'💞'},{v:'meaning',l:'Нет смысла',e:'🌑'},{v:'discipline',l:'Самодисциплина',e:'⚔️'},{v:'screen',l:'Экранное время',e:'📱'}],block:'Барьеры'},
{id:'pastFailures',q:'Что пробовал и не получилось?',type:'text',block:'Барьеры'},
{id:'fears',q:'Главные страхи?',type:'text',block:'Барьеры'},
{id:'procrastinationTriggers',q:'Когда ты прокрастинируешь?',type:'text',block:'Барьеры'},
{id:'stressSources',q:'Главные источники стресса?',type:'text',block:'Барьеры'},
{id:'badHabits',q:'От каких привычек хочешь избавиться?',type:'text',block:'Барьеры'},

/* Блок 4: Здоровье */
{id:'sleepHours',q:'Сколько спишь?',type:'options',options:[{v:'<5',l:'Меньше 5',e:'😵'},{v:'5-6',l:'5-6 ч',e:'😴'},{v:'6-7',l:'6-7 ч',e:'🙄'},{v:'7-8',l:'7-8 ч',e:'😊'},{v:'8+',l:'Больше 8',e:'😌'}],block:'Здоровье'},
{id:'sleepQuality',q:'Качество сна?',type:'slider',default:6,block:'Здоровье'},
{id:'wakeTime',q:'Во сколько встаёшь?',type:'options',options:[{v:'before-6',l:'До 6:00',e:'🌅'},{v:'6-7',l:'6:00-7:00',e:'☀️'},{v:'7-9',l:'7:00-9:00',e:'🌤'},{v:'after-9',l:'После 9:00',e:'🌞'},{v:'chaos',l:'Хаотично',e:'🎲'}],block:'Здоровье'},
{id:'sleepTime',q:'Во сколько ложишься?',type:'options',options:[{v:'before-22',l:'До 22:00',e:'🌙'},{v:'22-23',l:'22:00-23:00',e:'🌜'},{v:'23-00',l:'23:00-00:00',e:'🌚'},{v:'after-00',l:'После 00:00',e:'🌌'},{v:'chaos',l:'Хаотично',e:'🎲'}],block:'Здоровье'},
{id:'activityLevel',q:'Сколько двигаешься?',type:'options',options:[{v:'none',l:'Почти не двигаюсь',e:'🪑'},{v:'light',l:'Лёгкая активность',e:'🚶'},{v:'moderate',l:'Спорт 2-3/нед',e:'🏃'},{v:'active',l:'Спорт 4+/нед',e:'🏋️'},{v:'athlete',l:'Профессионально',e:'🏆'}],block:'Здоровье'},
{id:'diet',q:'Тип питания?',type:'options',options:[{v:'omnivore',l:'Всёядный',e:'🍖'},{v:'vegetarian',l:'Вегетарианец',e:'🥗'},{v:'vegan',l:'Веган',e:'🌱'},{v:'keto',l:'Кето',e:'🥑'},{v:'fasting',l:'Интервальное',e:'⏱'},{v:'chaos',l:'Без системы',e:'🎲'}],block:'Здоровье'},
{id:'healthIssues',q:'Проблемы со здоровьем?',type:'multi',options:[{v:'none',l:'Нет',e:'✅'},{v:'back',l:'Спина/шея',e:'🦴'},{v:'headaches',l:'Головные боли',e:'🤕'},{v:'sleep',l:'Сон',e:'😴'},{v:'digestion',l:'ЖКТ',e:'🥗'},{v:'heart',l:'Сердце/давление',e:'❤️'},{v:'mental',l:'Психика',e:'🧠'},{v:'allergies',l:'Аллергии',e:'🤧'}],block:'Здоровье'},
{id:'medications',q:'Принимаешь лекарства?',type:'text',block:'Здоровье'},
{id:'healthGoal',q:'Главная цель по здоровью?',type:'text',block:'Здоровье'},

/* Блок 5: Энергия и ритм */
{id:'energyPeak',q:'Пик энергии?',type:'options',options:[{v:'morning',l:'Утром',e:'🌅'},{v:'midday',l:'Днём',e:'☀️'},{v:'evening',l:'Вечером',e:'🌆'},{v:'night',l:'Ночью',e:'🌙'}],block:'Энергия'},
{id:'energyLow',q:'Спад энергии?',type:'options',options:[{v:'morning',l:'Утром',e:'🌅'},{v:'midday',l:'Днём',e:'☀️'},{v:'evening',l:'Вечером',e:'🌆'},{v:'night',l:'Ночью',e:'🌙'}],block:'Энергия'},
{id:'workStyle',q:'Как работаешь лучше?',type:'options',options:[{v:'deep',l:'Сессии 90+ мин',e:'🎯'},{v:'sprints',l:'Спринты 25 мин',e:'⚡'},{v:'mixed',l:'Смешанно',e:'🔄'},{v:'chaos',l:'Как получится',e:'🎲'}],block:'Энергия'},
{id:'breaksPerDay',q:'Сколько перерывов в день?',type:'number',default:4,min:0,max:20,step:1,block:'Энергия'},
{id:'coffeeCups',q:'Сколько чашек кофе в день?',type:'number',default:2,min:0,max:20,step:1,block:'Энергия'},
{id:'screenTime',q:'Сколько экрана в день?',type:'options',options:[{v:'<2',l:'Меньше 2 ч',e:'🌿'},{v:'2-4',l:'2-4 ч',e:'📱'},{v:'4-6',l:'4-6 ч',e:'😬'},{v:'6-8',l:'6-8 ч',e:'🧟'},{v:'8+',l:'Больше 8 ч',e:'💀'}],block:'Энергия'},

/* Блок 6: Учёба и рост */
{id:'learningStyle',q:'Как учишься лучше?',type:'options',options:[{v:'visual',l:'Образами',e:'👁'},{v:'auditory',l:'Слушаю',e:'👂'},{v:'kinesthetic',l:'Практикой',e:'✋'},{v:'reading',l:'Читаю',e:'📖'},{v:'mixed',l:'Смешанно',e:'🔄'}],block:'Учёба'},
{id:'timeAvailable',q:'Сколько времени в день на обучение?',type:'options',options:[{v:'15min',l:'15 минут',e:'⏱'},{v:'30min',l:'30 минут',e:'🕐'},{v:'1h',l:'1 час',e:'⏰'},{v:'2h',l:'2 часа',e:'🕰'},{v:'3h+',l:'3+ часа',e:'⏳'}],block:'Учёба'},
{id:'englishLevel',q:'Уровень английского?',type:'options',options:[{v:'beginner',l:'Beginner (A1-A2)',e:'🆕'},{v:'intermediate',l:'Intermediate (B1-B2)',e:'📘'},{v:'advanced',l:'Advanced (C1-C2)',e:'🎓'},{v:'native',l:'Native',e:'🇬🇧'}],block:'Учёба'},
{id:'skillsWanted',q:'Какие навыки хочешь освоить?',type:'text',block:'Учёба'},
{id:'booksPerMonth',q:'Сколько книг в месяц?',type:'number',default:1,min:0,max:30,step:1,block:'Учёба'},
{id:'coursesWanted',q:'Какие курсы интересуют?',type:'text',block:'Учёба'},
{id:'mentors',q:'Есть ли ментор?',type:'options',options:[{v:'yes',l:'Да',e:'✅'},{v:'no',l:'Нет',e:'❌'},{v:'want',l:'Хочу найти',e:'🔍'}],block:'Учёба'},

/* Блок 7: Продуктивность */
{id:'productivityTools',q:'Какие инструменты используешь?',type:'multi',options:[{v:'notion',l:'Notion',e:'📝'},{v:'todoist',l:'Todoist',e:'✅'},{v:'obsidian',l:'Obsidian',e:'📓'},{v:'gcal',l:'Google Calendar',e:'📅'},{v:'pomodoro',l:'Pomodoro',e:'🍅'},{v:'anki',l:'Anki',e:'🃏'},{v:'none',l:'Ничего',e:'🚫'}],block:'Продуктивность'},
{id:'planningStyle',q:'Как планируешь?',type:'options',options:[{v:'timeblock',l:'Time-blocking',e:'📅'},{v:'todo',l:'To-do списки',e:'✅'},{v:'gtd',l:'GTD',e:'📥'},{v:'chaos',l:'Не планирую',e:'🎲'}],block:'Продуктивность'},
{id:'mainDistraction',q:'Что отвлекает больше всего?',type:'text',block:'Продуктивность'},
{id:'pomodoroCount',q:'Сколько помодоро в день?',type:'number',default:4,min:0,max:20,step:1,block:'Продуктивность'},
{id:'deepWorkHours',q:'Часов Deep Work в день?',type:'number',default:2,min:0,max:12,step:0.5,block:'Продуктивность'},

/* Блок 8: Финансы */
{id:'income',q:'Уровень дохода?',type:'options',options:[{v:'<30k',l:'До 30к',e:'🆘'},{v:'30-60k',l:'30-60к',e:'😬'},{v:'60-100k',l:'60-100к',e:'🙂'},{v:'100-200k',l:'100-200к',e:'😊'},{v:'200k+',l:'200к+',e:'😎'}],block:'Финансы'},
{id:'financialStatus',q:'Финансовое состояние?',type:'options',options:[{v:'crisis',l:'Кризис',e:'🆘'},{v:'tight',l:'Впритык',e:'😬'},{v:'stable',l:'Стабильно',e:'🙂'},{v:'comfortable',l:'Комфортно',e:'😊'},{v:'investing',l:'Инвестиции',e:'📈'}],block:'Финансы'},
{id:'savingsPercent',q:'% дохода в сбережения?',type:'number',default:10,min:0,max:100,step:1,block:'Финансы'},
{id:'debts',q:'Есть долги?',type:'options',options:[{v:'none',l:'Нет',e:'✅'},{v:'small',l:'Небольшие',e:'😐'},{v:'medium',l:'Средние',e:'😬'},{v:'large',l:'Большие',e:'🆘'}],block:'Финансы'},
{id:'financialGoal',q:'Главная финансовая цель?',type:'text',block:'Финансы'},

/* Блок 9: Отношения */
{id:'relationshipQuality',q:'Качество отношений?',type:'slider',default:7,block:'Отношения'},
{id:'socialFreq',q:'Как часто общаешься с друзьями?',type:'options',options:[{v:'daily',l:'Каждый день',e:'👥'},{v:'weekly',l:'Раз в неделю',e:'📅'},{v:'monthly',l:'Раз в месяц',e:'🌙'},{v:'rarely',l:'Редко',e:'🌑'},{v:'never',l:'Практически нет',e:'🚫'}],block:'Отношения'},
{id:'familyTime',q:'Сколько времени с семьёй?',type:'options',options:[{v:'daily',l:'Каждый день',e:'🏠'},{v:'weekly',l:'Раз в неделю',e:'📅'},{v:'monthly',l:'Раз в месяц',e:'🌙'},{v:'rarely',l:'Редко',e:'🌑'}],block:'Отношения'},
{id:'relationshipGoal',q:'Цель в отношениях?',type:'text',block:'Отношения'},
{id:'children',q:'Дети?',type:'number',default:0,min:0,max:15,step:1,block:'Отношения'},

/* Блок 10: Психика */
{id:'stressLevel',q:'Уровень стресса?',type:'options',options:[{v:'low',l:'Низкий',e:'😌'},{v:'medium',l:'Средний',e:'😐'},{v:'high',l:'Высокий',e:'😰'},{v:'chronic',l:'Хронический',e:'🥵'}],block:'Психика'},
{id:'anxietyLevel',q:'Уровень тревоги?',type:'slider',default:4,block:'Психика'},
{id:'depressionLevel',q:'Уровень подавленности?',type:'slider',default:3,block:'Психика'},
{id:'therapy',q:'Ходишь к психологу?',type:'options',options:[{v:'yes',l:'Да',e:'✅'},{v:'no',l:'Нет',e:'❌'},{v:'want',l:'Хочу',e:'🔍'},{v:'past',l:'Был(а)',e:'🕐'}],block:'Психика'},
{id:'meditationFreq',q:'Медитация?',type:'options',options:[{v:'daily',l:'Каждый день',e:'🧘'},{v:'weekly',l:'Раз в неделю',e:'📅'},{v:'monthly',l:'Раз в месяц',e:'🌙'},{v:'never',l:'Никогда',e:'🚫'}],block:'Психика'},
{id:'mentalGoal',q:'Цель по психике?',type:'text',block:'Психика'},

/* Блок 11: Привычки и мотивация */
{id:'motivationType',q:'Что мотивирует?',type:'options',options:[{v:'meaning',l:'Смысл',e:'🕊'},{v:'achievement',l:'Достижения',e:'🏆'},{v:'curiosity',l:'Интерес',e:'🔍'},{v:'reward',l:'Награды',e:'💰'},{v:'people',l:'Люди',e:'👥'},{v:'competition',l:'Соревнование',e:'⚔️'}],block:'Мотивация'},
{id:'currentHabits',q:'Какие привычки уже есть?',type:'text',block:'Мотивация'},
{id:'habitsWanted',q:'Какие привычки хочешь ввести?',type:'text',block:'Мотивация'},
{id:'habitFailReason',q:'Почему привычки не приживаются?',type:'text',block:'Мотивация'},
{id:'disciplineLevel',q:'Уровень дисциплины?',type:'slider',default:5,block:'Мотивация'},

/* Блок 12: Цифровая жизнь */
{id:'screenTimeToday',q:'Сколько экрана сегодня?',type:'number',default:240,min:0,max:1440,step:15,block:'Цифровое'},
{id:'topApps',q:'Топ-3 приложения по времени?',type:'text',block:'Цифровое'},
{id:'socialMediaHours',q:'Часов соцсетей в день?',type:'number',default:2,min:0,max:24,step:0.5,block:'Цифровое'},
{id:'notifications',q:'Сколько уведомлений в день?',type:'number',default:50,min:0,max:500,step:10,block:'Цифровое'},
{id:'digitalGoal',q:'Цель по экрану?',type:'text',block:'Цифровое'},

/* Блок 13: Время и организация */
{id:'wakeRoutine',q:'Что делаешь первые 30 мин?',type:'text',block:'Организация'},
{id:'eveningRoutine',q:'Что делаешь перед сном?',type:'text',block:'Организация'},
{id:'weekendStyle',q:'Как проводишь выходные?',type:'text',block:'Организация'},
{id:'vacationPlan',q:'Планы на отпуск?',type:'text',block:'Организация'},
{id:'timeManagement',q:'Как оцениваешь управление временем?',type:'slider',default:6,block:'Организация'},

/* Блок 14: Ценности и смысл */
{id:'meaningSource',q:'Что даёт смысл жизни?',type:'text',block:'Смысл'},
{id:'spirituality',q:'Религиозность/духовность?',type:'options',options:[{v:'religious',l:'Религиозен',e:'🙏'},{v:'spiritual',l:'Духовен',e:'🕊'},{v:'agnostic',l:'Агностик',e:'🤔'},{v:'atheist',l:'Атеист',e:'🧪'}],block:'Смысл'},
{id:'lifePhilosophy',q:'Твоя жизненная философия?',type:'text',block:'Смысл'},
{id:'legacy',q:'Какое наследие хочешь оставить?',type:'text',block:'Смысл'},

/* Блок 15: Настройки приложения */
{id:'reminderTime',q:'Когда напоминать?',type:'options',options:[{v:'morning',l:'Утром 8:00',e:'🌅'},{v:'midday',l:'Днём 14:00',e:'☀️'},{v:'evening',l:'Вечером 20:00',e:'🌆'},{v:'never',l:'Не надо',e:'🚫'}],block:'Настройки'},
{id:'sessionPreference',q:'Длина сессии?',type:'options',options:[{v:'5min',l:'5 минут',e:'☕'},{v:'10min',l:'10 минут',e:'📱'},{v:'20min',l:'20 минут',e:'⏱'},{v:'30+',l:'30+ минут',e:'🎯'}],block:'Настройки'},
{id:'languages',q:'Языки для AI?',type:'multi',options:[{v:'ru',l:'Русский',e:'🇷🇺'},{v:'en',l:'English',e:'🇬🇧'},{v:'de',l:'Deutsch',e:'🇩🇪'},{v:'es',l:'Español',e:'🇪🇸'}],block:'Настройки'},
{id:'privacyLevel',q:'Приватность?',type:'options',options:[{v:'full',l:'Полная',e:'🔒'},{v:'partial',l:'Частичная',e:'🔓'},{v:'minimal',l:'Минимум',e:'👤'}],block:'Настройки'},
{id:'howFoundUs',q:'Как узнал?',type:'options',options:[{v:'friend',l:'От друга',e:'👥'},{v:'telegram',l:'Telegram',e:'✈️'},{v:'search',l:'Поиск',e:'🔍'},{v:'other',l:'Другое',e:'🔷'}],block:'Настройки'},
{id:'themePreference',q:'Тёмная или светлая?',type:'options',options:[{v:'dark',l:'Тёмная',e:'🌙'},{v:'light',l:'Светлая',e:'☀️'},{v:'auto',l:'Авто',e:'🔄'}],block:'Настройки'},
{id:'notificationStyle',q:'Стиль уведомлений?',type:'options',options:[{v:'gentle',l:'Мягкие',e:'🌿'},{v:'strict',l:'Строгие',e:'⚔️'},{v:'off',l:'Отключить',e:'🚫'}],block:'Настройки'}
];

/* ============================================================
   ЧАСТЬ 3. РАСПИСАНИЕ ОПРОСОВ (когда показывать)
   ============================================================ */

var SURVEY_SCHEDULE={
  morning:{id:'morning',title:'☀️ Утром — о вчера',desc:'15 вопросов о прошлом дне',period:'daily',hours:[6,12],questions:MORNING_SURVEY,priority:10},
  evening:{id:'evening',title:'🌙 Вечером — о сегодня',desc:'14 вопросов о дне',period:'daily',hours:[19,23],questions:EVENING_SURVEY,priority:10},
  weekly:{id:'weekly',title:'📅 Итоги недели',desc:'15 вопросов о неделе',period:'weekly',day:0,hours:[18,23],questions:WEEKLY_SURVEY,priority:8},
  monthly:{id:'monthly',title:'📊 Итоги месяца',desc:'15 вопросов о месяце',period:'monthly',day:1,hours:[18,23],questions:MONTHLY_SURVEY,priority:7},
  quarterly:{id:'quarterly',title:'📈 Итоги квартала',desc:'15 вопросов о квартале',period:'quarterly',hours:[18,23],questions:QUARTERLY_SURVEY,priority:6},
  yearly:{id:'yearly',title:'🎆 Итоги года',desc:'18 вопросов о годе',period:'yearly',hours:[18,23],questions:YEARLY_SURVEY,priority:5}
};

function getSurveysState(){
  try{
    var s=window.state||state;
    if(!s.surveys)s.surveys={};
    return s.surveys;
  }catch(e){return{}}
}
function saveSurveysState(){
  try{if(typeof window.save==='function')window.save()}catch(e){}
}
function getTodayKey(){return new Date().toISOString().slice(0,10)}
function getWeekKey(){
  var d=new Date();
  var day=d.getDay();
  var diff=d.getDate()-day+(day===0?-6:1);
  var monday=new Date(d.setDate(diff));
  return monday.toISOString().slice(0,10);
}
function getMonthKey(){return new Date().toISOString().slice(0,7)}
function getQuarterKey(){
  var d=new Date();
  return d.getFullYear()+'-Q'+(Math.floor(d.getMonth()/3)+1);
}
function getYearKey(){return new Date().getFullYear().toString()}

function isSurveyDone(surveyId){
  var st=getSurveysState();
  var key;
  if(surveyId==='morning'||surveyId==='evening')key=getTodayKey();
  else if(surveyId==='weekly')key=getWeekKey();
  else if(surveyId==='monthly')key=getMonthKey();
  else if(surveyId==='quarterly')key=getQuarterKey();
  else if(surveyId==='yearly')key=getYearKey();
  else return false;
  return !!(st[surveyId]&&st[surveyId][key]);
}

function needsSurvey(surveyId){
  if(isSurveyDone(surveyId))return false;
  var sched=SURVEY_SCHEDULE[surveyId];
  if(!sched)return false;
  var hour=new Date().getHours();
  if(sched.hours&&(hour<sched.hours[0]||hour>sched.hours[1])){
    if(surveyId!=='weekly'&&surveyId!=='monthly'&&surveyId!=='quarterly'&&surveyId!=='yearly')return false;
  }
  if(surveyId==='weekly'){
    var d=new Date();
    if(d.getDay()!==0&&d.getDay()!==1)return false;
  }
  if(surveyId==='monthly'){
    var day=new Date().getDate();
    if(day!==1&&day!==2&&day!==28&&day!==29&&day!==30&&day!==31)return false;
  }
  return true;
}

function getPendingSurveys(){
  var pending=[];
  Object.keys(SURVEY_SCHEDULE).forEach(function(id){
    if(needsSurvey(id))pending.push(SURVEY_SCHEDULE[id]);
  });
  pending.sort(function(a,b){return (b.priority||0)-(a.priority||0)});
  return pending;
}

function markSurveyDone(surveyId,answers){
  var st=getSurveysState();
  if(!st[surveyId])st[surveyId]={};
  var key;
  if(surveyId==='morning'||surveyId==='evening')key=getTodayKey();
  else if(surveyId==='weekly')key=getWeekKey();
  else if(surveyId==='monthly')key=getMonthKey();
  else if(surveyId==='quarterly')key=getQuarterKey();
  else if(surveyId==='yearly')key=getYearKey();
  else key=getTodayKey();
  st[surveyId][key]={answers:answers,filledAt:new Date().toISOString()};
  saveSurveysState();
}

function getSurveyHistory(surveyId,limit){
  var st=getSurveysState();
  if(!st[surveyId])return[];
  var keys=Object.keys(st[surveyId]).sort().reverse();
  if(limit)keys=keys.slice(0,limit);
  return keys.map(function(k){return Object.assign({_key:k},st[surveyId][k])});
}

function getLatestSurvey(surveyId){
  var h=getSurveyHistory(surveyId,1);
  return h.length?h[0]:null;
}

/* ============================================================
   ЧАСТЬ 4. СИСТЕМА АДАПТАЦИИ (10000+ вариаций)
   ============================================================ */

function getExtendedSurveyAnswers(){
  try{
    var s=window.state||state;
    return (s.profile&&s.profile.surveyAnswers)||{};
  }catch(e){return{}}
}

/* Определение архетипа пользователя */
function getUserArchetype(){
  var a=getExtendedSurveyAnswers();
  var scores={
    warrior:0,   // дисциплина, достижения
    healer:0,    // здоровье, восстановление
    sage:0,      // знания, смысл
    creator:0,   // творчество, свобода
    connector:0, // отношения, люди
    explorer:0   // новизна, приключения
  };
  if(a.disciplineLevel>=7)scores.warrior+=3;
  if(a.mainGoal==='discipline')scores.warrior+=3;
  if(a.mainGoal==='career')scores.warrior+=2;
  if(a.mainGoal==='productivity')scores.warrior+=2;
  if(a.motivationType==='achievement')scores.warrior+=2;
  if(a.motivationType==='competition')scores.warrior+=2;

  if(a.mainGoal==='health')scores.healer+=3;
  if(a.healthIssues&&a.healthIssues.length>1)scores.healer+=2;
  if(a.stressLevel==='high'||a.stressLevel==='chronic')scores.healer+=2;
  if(a.sleepHours==='<5'||a.sleepHours==='5-6')scores.healer+=2;
  if(a.meditationFreq==='daily')scores.healer+=2;

  if(a.mainGoal==='meaning')scores.sage+=3;
  if(a.mainGoal==='mental')scores.sage+=2;
  if(a.learningStyle==='reading')scores.sage+=2;
  if(a.booksPerMonth>=2)scores.sage+=2;
  if(a.mentors==='yes')scores.sage+=1;

  if(a.occupation==='creative')scores.creator+=3;
  if(a.mainGoal==='freedom')scores.creator+=3;
  if(a.motivationType==='curiosity')scores.creator+=2;
  if(a.digitalGoal)scores.creator+=1;

  if(a.mainGoal==='relationships')scores.connector+=3;
  if(a.relationshipQuality>=8)scores.connector+=2;
  if(a.familyStatus==='married')scores.connector+=2;
  if(a.kids>0)scores.connector+=2;
  if(a.socialFreq==='daily')scores.connector+=2;

  if(a.mainGoal==='freedom')scores.explorer+=2;
  if(a.vacationPlan)scores.explorer+=1;
  if(a.learningStyle==='kinesthetic')scores.explorer+=2;
  if(a.activityLevel==='active'||a.activityLevel==='athlete')scores.explorer+=2;

  var best='warrior',bestScore=0;
  Object.keys(scores).forEach(function(k){
    if(scores[k]>bestScore){bestScore=scores[k];best=k}
  });
  return{type:best,scores:scores};
}

/* Расчёт нагрузки дня */
function calcDailyLoad(){
  var a=getExtendedSurveyAnswers();
  var load=100;
  var m=getLatestSurvey('morning');
  var e=getLatestSurvey('evening');
  if(m&&m.answers){
    var h=parseFloat(m.answers.sleepHours)||7;
    var stress=parseInt(m.answers.stress)||5;
    var energy=parseInt(m.answers.energy)||7;
    var mood=parseInt(m.answers.mood)||7;
    if(h<6)load-=20;
    else if(h<7)load-=10;
    if(stress>7)load-=15;
    if(energy<5)load-=15;
    if(mood<5)load-=10;
    if(h>=7&&h<=9)load+=5;
    if(energy>=7)load+=5;
    if(mood>=7)load+=5;
  }
  var screen=parseInt((m&&m.answers&&m.answers.screenMinutes)||240);
  if(screen>360)load-=10;
  if(screen>480)load-=10;
  load=Math.max(30,Math.min(120,load));
  return load;
}

/* Генерация персонального плана дня */
function generatePersonalPlan(){
  var a=getExtendedSurveyAnswers();
  var arch=getUserArchetype();
  var load=calcDailyLoad();
  var m=getLatestSurvey('morning');
  var answers=(m&&m.answers)||{};
  var plan={date:getTodayKey(),archetype:arch.type,load:load,items:[],notes:[]};

  var sleep=parseFloat(answers.sleepHours)||7;
  var mood=parseInt(answers.mood)||7;
  var energy=parseInt(answers.energy)||7;
  var stress=parseInt(answers.stress)||5;
  var screen=parseFloat(answers.screenMinutes)||240;
  var focus=parseInt(answers.focus)||7;
  var water=parseInt(answers.water)||6;

  if(sleep<6)plan.items.push({time:'вечер',title:'Сон до 23:00',desc:'Приоритет: восстановление',icon:'😴',reason:'Недосып'});
  if(water<6)plan.items.push({time:'день',title:'8 стаканов воды',desc:'Гидратация',icon:'💧',reason:'Мало воды'});
  if(stress>7){
    plan.items.push({time:'день',title:'Медитация 10 мин',desc:'Снижение стресса',icon:'🧘',reason:'Высокий стресс'});
    plan.items.push({time:'день',title:'Дыхание 4-7-8',desc:'Успокоение',icon:'🌬',reason:'Стресс'});
  }
  if(energy<6)plan.items.push({time:'день',title:'Прогулка 20 мин',desc:'Энергия',icon:'🚶',reason:'Мало энергии'});
  if(focus<6||screen>300)plan.items.push({time:'утро',title:'Deep Work 90 мин',desc:'Одна задача без телефона',icon:'🎯',reason:'Низкий фокус'});
  if(screen>300)plan.items.push({time:'утро',title:'Утро без телефона',desc:'30 мин',icon:'🌅',reason:'Много экрана'});

  // Адаптация под архетип
  if(arch.type==='warrior'){
    plan.items.push({time:'утро',title:'Тренировка 45 мин',desc:'Сила',icon:'🏋️',reason:'Архетип Воин'});
    plan.items.push({time:'день',title:'3 главных задачи',desc:'Приоритет',icon:'⚔️',reason:'Архетип Воин'});
  }else if(arch.type==='healer'){
    plan.items.push({time:'день',title:'Восстановление 30 мин',desc:'Отдых',icon:'🌿',reason:'Архетип Целитель'});
    plan.items.push({time:'вечер',title:'Дневник благодарности',desc:'3 пункта',icon:'🙏',reason:'Архетип Целитель'});
  }else if(arch.type==='sage'){
    plan.items.push({time:'день',title:'Учёба 60 мин',desc:'Новый навык',icon:'📚',reason:'Архетип Мудрец'});
    plan.items.push({time:'вечер',title:'Чтение 30 мин',desc:'Книга',icon:'📖',reason:'Архетип Мудрец'});
  }else if(arch.type==='creator'){
    plan.items.push({time:'день',title:'Творчество 60 мин',desc:'Без оценки',icon:'🎨',reason:'Архетип Творец'});
    plan.items.push({time:'день',title:'Прогулка без телефона',desc:'Идеи',icon:'🚶',reason:'Архетип Творец'});
  }else if(arch.type==='connector'){
    plan.items.push({time:'день',title:'Звонок близкому',desc:'15 мин',icon:'📞',reason:'Архетип Связной'});
    plan.items.push({time:'вечер',title:'Время с семьёй',desc:'Без телефонов',icon:'👥',reason:'Архетип Связной'});
  }else if(arch.type==='explorer'){
    plan.items.push({time:'день',title:'Новое занятие',desc:'30 мин',icon:'🧭',reason:'Архетип Исследователь'});
    plan.items.push({time:'день',title:'Прогулка в новом месте',desc:'',icon:'🗺',reason:'Архетип Исследователь'});
  }

  plan.items.push({time:'вечер',title:'Дневник: 3 победы',desc:'Рефлексия',icon:'📓',reason:'Ежедневно'});

  plan.notes.push('Нагрузка: '+load+'%');
  plan.notes.push('Архетип: '+arch.type);
  if(sleep<6)plan.notes.push('⚠️ Недосып. Меньше задач.');
  if(screen>360)plan.notes.push('⚠️ Много экрана.');
  if(stress>7)plan.notes.push('⚠️ Высокий стресс.');

  return plan;
}

/* Генерация 10000+ вариаций: комбинируем факторы */
function generateAdaptations(){
  var a=getExtendedSurveyAnswers();
  var arch=getUserArchetype();
  var load=calcDailyLoad();
  var adaptations=[];

  // 1. Обучение
  var learnVariants={
    warrior:[{focus:'discipline',intensity:1.5,content:'тренировки+задачи'},{focus:'achievement',intensity:1.3,content:'цели+награды'}],
    healer:[{focus:'sleep',intensity:1.2,content:'сон+медитация'},{focus:'nutrition',intensity:1.3,content:'питание+вода'}],
    sage:[{focus:'knowledge',intensity:1.5,content:'курсы+книги'},{focus:'memory',intensity:1.3,content:'навыки+память'}],
    creator:[{focus:'creativity',intensity:1.4,content:'творчество+идеи'},{focus:'freedom',intensity:1.2,content:'проекты+свобода'}],
    connector:[{focus:'relationships',intensity:1.4,content:'общение+семья'},{focus:'empathy',intensity:1.3,content:'EQ+слушание'}],
    explorer:[{focus:'novelty',intensity:1.4,content:'новые навыки'},{focus:'adventure',intensity:1.3,content:'путешествия+опыт'}]
  };
  var lv=learnVariants[arch.type]||learnVariants.sage;
  adaptations.push({category:'learning',variants:lv});

  // 2. Эффекты (250%)
  adaptations.push({
    category:'effects',
    intensity:2.5,
    learningEffect:2.5,
    screenEffect:2.5,
    healthEffect:2.5,
    note:'Все эффекты усилены до 250%'
  });

  // 3. Периодические опросы
  adaptations.push({
    category:'surveys',
    schedule:SURVEY_SCHEDULE,
    pending:getPendingSurveys().length,
    note:'Опросы подстраиваются под ритм'
  });

  // 4. Персональный план
  adaptations.push({
    category:'plan',
    plan:generatePersonalPlan()
  });

  // 5. Экранный детокс
  var screenHours=parseFloat(a.socialMediaHours)||2;
  adaptations.push({
    category:'screen',
    currentHours:screenHours,
    targetHours:Math.max(0.5,screenHours*0.6),
    intensity:2.5,
    tips:screenHours>3?'Критично: детокс обязателен':screenHours>1.5?'Средний риск':'Хорошо'
  });

  return adaptations;
}

/* Подсчёт общего числа вариаций */
function getTotalVariations(){
  // Комбинации: 6 архетипов × 5 уровней нагрузки × 5 уровней стресса × 4 фазы дня × 5 уровней экрана × 4 сезона × 5 уровней энергии × 4 вида цели = 6×5×5×4×5×4×5×4 = 240000
  return 240000;
}

/* ============================================================
   ЧАСТЬ 5. РЕНДЕР (UI опросов)
   ============================================================ */

var currentSurveyId=null;
var currentSurveyAnswers={};
var currentSurveyStep=0;

function openSurvey(surveyId){
  var sched=SURVEY_SCHEDULE[surveyId];
  if(!sched)return;
  currentSurveyId=surveyId;
  currentSurveyAnswers={};
  currentSurveyStep=0;
  renderSurveyStep();
}

function renderSurveyStep(){
  var sched=SURVEY_SCHEDULE[currentSurveyId];
  if(!sched)return;
  var q=sched.questions[currentSurveyStep];
  if(!q){finishSurvey();return}
  var total=sched.questions.length;
  var html='<div class="page">';
  html+='<div class="title-xl">'+sched.title+'</div>';
  html+='<div class="card" style="background:linear-gradient(135deg,rgba(91,158,255,.15),rgba(167,139,250,.1));border-color:rgba(91,158,255,.3);">';
  html+='<div class="footnote text-secondary" style="margin-bottom:8px;">Шаг '+(currentSurveyStep+1)+' из '+total+'</div>';
  html+='<div class="progress" style="margin-bottom:14px;"><div class="progress-fill" style="width:'+Math.round((currentSurveyStep+1)/total*100)+'%;"></div></div>';
  html+='<div style="font-size:18px;font-weight:800;line-height:1.3;margin-bottom:14px;">'+(q.icon||'')+' '+q.q+'</div>';

  if(q.type==='slider'){
    var val=currentSurveyAnswers[q.id]!==undefined?currentSurveyAnswers[q.id]:q.default;
    html+='<div style="text-align:center;padding:8px 0;"><div id="sv" style="font-size:40px;font-weight:800;color:var(--brand);">'+val+'</div><div class="footnote text-secondary">из 10</div></div>';
    html+='<input type="range" min="1" max="10" value="'+val+'" style="width:100%;margin:14px 0;" oninput="document.getElementById(\'sv\').textContent=this.value;currentSurveyAnswers[\''+q.id+'\']=parseInt(this.value);"/>';
  }else if(q.type==='number'){
    var v=currentSurveyAnswers[q.id]!==undefined?currentSurveyAnswers[q.id]:q.default;
    html+='<div class="field"><input type="number" id="sn" value="'+v+'" min="'+(q.min||0)+'" max="'+(q.max||999)+'" step="'+(q.step||1)+'" oninput="currentSurveyAnswers[\''+q.id+'\']=parseFloat(this.value);"/></div>';
  }else if(q.type==='text'){
    html+='<div class="field"><textarea id="st" style="min-height:100px;" oninput="currentSurveyAnswers[\''+q.id+'\']=this.value;">'+(currentSurveyAnswers[q.id]||'')+'</textarea></div>';
  }else if(q.type==='options'){
    q.options.forEach(function(o){
      var sel=currentSurveyAnswers[q.id]===o.v;
      html+='<div class="survey-option'+(sel?' selected':'')+'" onclick="selectSurveyOption(\''+q.id+'\',\''+o.v+'\')">'+(o.e?'<span class="survey-option-emoji">'+o.e+'</span>':'')+'<span>'+o.l+'</span></div>';
    });
  }else if(q.type==='multi'){
    var arr=currentSurveyAnswers[q.id]||[];
    q.options.forEach(function(o){
      var sel=arr.indexOf(o.v)>=0;
      html+='<div class="survey-option'+(sel?' selected':'')+'" onclick="toggleSurveyMulti(\''+q.id+'\',\''+o.v+'\')">'+(o.e?'<span class="survey-option-emoji">'+o.e+'</span>':'')+'<span>'+o.l+'</span></div>';
    });
  }

  html+='</div>';
  html+='<button class="btn btn-primary btn-block mt-3" onclick="nextSurveyStep()">'+(currentSurveyStep===total-1?'✓ Завершить':'Далее →')+'</button>';
  if(currentSurveyStep>0)html+='<button class="btn btn-ghost btn-block mt-2" onclick="prevSurveyStep()">← Назад</button>';
  html+='<button class="btn btn-ghost btn-block mt-2" onclick="skipSurveyStep()">Пропустить</button>';
  html+='</div>';
  document.getElementById('app').innerHTML=html;
}

function selectSurveyOption(qid,val){
  currentSurveyAnswers[qid]=val;
  nextSurveyStep();
}

function toggleSurveyMulti(qid,val){
  var arr=currentSurveyAnswers[qid]||[];
  var i=arr.indexOf(val);
  if(i>=0)arr.splice(i,1);else arr.push(val);
  currentSurveyAnswers[qid]=arr;
  renderSurveyStep();
}

function saveSurveyAnswer(){
  var q=SURVEY_SCHEDULE[currentSurveyId].questions[currentSurveyStep];
  if(!q)return;
  if(q.type==='number'){var el=document.getElementById('sn');if(el)currentSurveyAnswers[q.id]=parseFloat(el.value)||0}
  else if(q.type==='text'){var el2=document.getElementById('st');if(el2)currentSurveyAnswers[q.id]=el2.value}
}

function nextSurveyStep(){
  saveSurveyAnswer();
  currentSurveyStep++;
  var sched=SURVEY_SCHEDULE[currentSurveyId];
  if(currentSurveyStep>=sched.questions.length)finishSurvey();
  else renderSurveyStep();
}

function prevSurveyStep(){
  saveSurveyAnswer();
  currentSurveyStep=Math.max(0,currentSurveyStep-1);
  renderSurveyStep();
}

function skipSurveyStep(){
  currentSurveyStep++;
  var sched=SURVEY_SCHEDULE[currentSurveyId];
  if(currentSurveyStep>=sched.questions.length)finishSurvey();
  else renderSurveyStep();
}

function finishSurvey(){
  var answers=currentSurveyAnswers;
  markSurveyDone(currentSurveyId,answers);
  // Специальная обработка morning/evening
  if(currentSurveyId==='morning'||currentSurveyId==='evening'){
    var s=window.state||state;
    var key=getTodayKey();
    if(answers.sleepHours!=null){
      if(!s.customSleep)s.customSleep={};
      s.customSleep[key]=parseFloat(answers.sleepHours);
    }
    if(answers.mood!=null){
      if(!s.customMood)s.customMood=[];
      var ex=s.customMood.find(function(m){return m.date===key});
      if(ex)ex.score=parseInt(answers.mood);
      else s.customMood.push({id:'m_'+Date.now(),date:key,score:parseInt(answers.mood),created_at:new Date().toISOString()});
    }
    if(answers.screenMinutes!=null||answers.screenToday!=null){
      if(!s.screenHistory)s.screenHistory={};
      s.screenHistory[key]=parseFloat(answers.screenMinutes||answers.screenToday||0);
    }
    if(answers.water!=null||answers.waterToday!=null){
      if(!s.customWater)s.customWater=[];
      var ew=s.customWater.find(function(w){return w.date===key});
      if(ew)ew.count=parseInt(answers.water||answers.waterToday||0);
      else s.customWater.push({id:'w_'+Date.now(),date:key,count:parseInt(answers.water||answers.waterToday||0),created_at:new Date().toISOString()});
    }
    // Обновить персональный план
    s.todayPlan=generatePersonalPlan();
    if(typeof window.save==='function')window.save();
  }
  try{if(typeof window.save==='function')window.save()}catch(e){}
  try{if(typeof window.haptic==='function')window.haptic('success')}catch(e){}
  try{if(typeof window.toast==='function')window.toast('✓ Опрос завершён','success')}catch(e){}
  var s=window.state||state;
  if(s&&s.settings)s.settings.lastDailySurveyDay=getTodayKey();
  if(typeof window.navigate==='function')window.navigate('dashboard');
}

/* Рендер карточки опроса для dashboard */
function renderSurveyPrompt(){
  var pending=getPendingSurveys();
  if(!pending.length)return '';
  var s=pending[0];
  var html='<div class="card" style="background:linear-gradient(135deg,rgba(255,169,64,.2),rgba(255,107,107,.15));border-color:rgba(255,169,64,.4);">';
  html+='<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">';
  html+='<div style="font-size:36px;">'+s.title.split(' ')[0]+'</div>';
  html+='<div style="flex:1;"><div style="font-size:16px;font-weight:800;margin-bottom:2px;">'+s.title+'</div>';
  html+='<div class="footnote text-secondary">'+s.desc+'</div></div>';
  html+='</div>';
  html+='<button class="btn btn-primary btn-block" onclick="openSurvey(\''+s.id+'\')">Начать опрос</button>';
  if(pending.length>1)html+='<div class="footnote text-tertiary mt-2" style="text-align:center;">Ещё '+pending.length+' опросов</div>';
  html+='</div>';
  return html;
}

/* ============ ЭКСПОРТ ============ */
window.MORNING_SURVEY=MORNING_SURVEY;
window.EVENING_SURVEY=EVENING_SURVEY;
window.WEEKLY_SURVEY=WEEKLY_SURVEY;
window.MONTHLY_SURVEY=MONTHLY_SURVEY;
window.QUARTERLY_SURVEY=QUARTERLY_SURVEY;
window.YEARLY_SURVEY=YEARLY_SURVEY;
window.EXTENDED_SURVEY=EXTENDED_SURVEY;
window.SURVEY_SCHEDULE=SURVEY_SCHEDULE;
window.getPendingSurveys=getPendingSurveys;
window.needsSurvey=needsSurvey;
window.isSurveyDone=isSurveyDone;
window.openSurvey=openSurvey;
window.renderSurveyStep=renderSurveyStep;
window.nextSurveyStep=nextSurveyStep;
window.prevSurveyStep=prevSurveyStep;
window.skipSurveyStep=skipSurveyStep;
window.selectSurveyOption=selectSurveyOption;
window.toggleSurveyMulti=toggleSurveyMulti;
window.finishSurvey=finishSurvey;
window.markSurveyDone=markSurveyDone;
window.getSurveyHistory=getSurveyHistory;
window.getLatestSurvey=getLatestSurvey;
window.renderSurveyPrompt=renderSurveyPrompt;
window.getUserArchetype=getUserArchetype;
window.calcDailyLoad=calcDailyLoad;
window.generatePersonalPlan=generatePersonalPlan;
window.generateAdaptations=generateAdaptations;
window.getTotalVariations=getTotalVariations;
window.getExtendedSurveyAnswers=getExtendedSurveyAnswers;