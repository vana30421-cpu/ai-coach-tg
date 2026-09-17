'use strict';
/* AI HEALTH v30 — DATA + MIGRATION */

var STORAGE_KEY = 'ai_health_v30';
var OLD_KEYS = ['ai_health_v29','ai_health_v28','ai_health_v26'];

/* ============ THEMES (45+) ============ */
var THEMES=[
{id:'dark',emoji:'🌙',name:'Тёмная',color:'#000',effects:'stars',bg:'#000'},
{id:'light',emoji:'☀️',name:'Светлая',color:'#f5f5fa',effects:'none',bg:'#f0f0f6'},
{id:'ocean',emoji:'🌊',name:'Океан',color:'#000814',effects:'waves',bg:'#000814'},
{id:'sakura',emoji:'🌸',name:'Сакура',color:'#1a0f14',effects:'petals',bg:'#1a0f14'},
{id:'forest',emoji:'🌲',name:'Лес',color:'#0a1410',effects:'leaves',bg:'#0a1410'},
{id:'sunset',emoji:'🌅',name:'Закат',color:'#1a0a05',effects:'sunrays',bg:'#1a0a05'},
{id:'ice',emoji:'❄️',name:'Лёд',color:'#0a1419',effects:'snow',bg:'#0a1419'},
{id:'amethyst',emoji:'💎',name:'Аметист',color:'#12061f',effects:'crystals',bg:'#12061f'},
{id:'pumpkin',emoji:'🎃',name:'Тыква',color:'#0d0500',effects:'bats',bg:'#0d0500',halloween:true},
{id:'vampire',emoji:'🦇',name:'Вампир',color:'#0a0000',effects:'bats',bg:'#0a0000',halloween:true},
{id:'ghost',emoji:'👻',name:'Призрак',color:'#0a0814',effects:'fog',bg:'#0a0814',halloween:true},
{id:'web',emoji:'🕸',name:'Паутина',color:'#001410',effects:'spiders',bg:'#001410',halloween:true},
{id:'aurora',emoji:'🌌',name:'Аврора',color:'#050a15',effects:'aurora',bg:'#050a15'},
{id:'desert',emoji:'🏜',name:'Пустыня',color:'#1a1208',effects:'sand',bg:'#1a1208'},
{id:'cyber',emoji:'⚡',name:'Кибер',color:'#0a0014',effects:'cyber',bg:'#0a0014'},
{id:'mono',emoji:'⚫',name:'Моно',color:'#0a0a0a',effects:'none',bg:'#0a0a0a'},
{id:'lava',emoji:'🔥',name:'Лава',color:'#140000',effects:'ember',bg:'#140000'},
{id:'mint',emoji:'🌿',name:'Мята',color:'#08140f',effects:'bubbles',bg:'#08140f'},
{id:'coffee',emoji:'☕',name:'Кофе',color:'#1a0e08',effects:'smoke',bg:'#1a0e08'},
{id:'neon',emoji:'💡',name:'Неон',color:'#000',effects:'neon',bg:'#000'},
{id:'sunrise',emoji:'🌄',name:'Рассвет',color:'#1a0d0a',effects:'sunrays',bg:'#1a0d0a'},
{id:'rain',emoji:'🌧',name:'Дождь',color:'#0a1018',effects:'rain',bg:'#0a1018'},
{id:'storm',emoji:'⛈',name:'Гроза',color:'#0a0a14',effects:'lightning',bg:'#0a0a14'},
{id:'crystal',emoji:'🔮',name:'Кристалл',color:'#0a1420',effects:'crystals',bg:'#0a1420'},
{id:'ember',emoji:'🔥',name:'Угли',color:'#140800',effects:'ember',bg:'#140800'},
{id:'holo',emoji:'🌈',name:'Голограмма',color:'#000814',effects:'holo',bg:'#000814'},
{id:'moon',emoji:'🌕',name:'Луна',color:'#0a0a1a',effects:'moon',bg:'#0a0a1a'},
{id:'sand',emoji:'🏖',name:'Песок',color:'#1a1408',effects:'sand',bg:'#1a1408'},
{id:'sakura-night',emoji:'🌺',name:'Сакура-ночь',color:'#14081a',effects:'petals',bg:'#14081a'},
{id:'deep',emoji:'🌊',name:'Глубина',color:'#000a14',effects:'bubbles',bg:'#000a14'},
{id:'rose',emoji:'🌹',name:'Роза',color:'#1a0810',effects:'petals',bg:'#1a0810'},
{id:'bamboo',emoji:'🎋',name:'Бамбук',color:'#0a1408',effects:'leaves',bg:'#0a1408'},
{id:'cosmos',emoji:'🌠',name:'Космос',color:'#0a0014',effects:'galaxy',bg:'#0a0014'},
{id:'matrix',emoji:'💚',name:'Матрица',color:'#000a00',effects:'code',bg:'#000a00'},
{id:'gold',emoji:'🥇',name:'Золото',color:'#0a0800',effects:'spark',bg:'#0a0800'},
{id:'silver',emoji:'🥈',name:'Серебро',color:'#0a0a0f',effects:'stardust',bg:'#0a0a0f'},
{id:'coral',emoji:'🐠',name:'Коралл',color:'#1a0e0a',effects:'bubbles',bg:'#1a0e0a'},
{id:'nebula',emoji:'🌫',name:'Туманность',color:'#0a0514',effects:'nebula',bg:'#0a0514'},
{id:'polar',emoji:'🧊',name:'Полярная',color:'#0a1520',effects:'snow',bg:'#0a1520'},
{id:'jungle',emoji:'🌴',name:'Джунгли',color:'#0a1a0a',effects:'leaves',bg:'#0a1a0a'},
{id:'royal',emoji:'👑',name:'Королевская',color:'#0a0514',effects:'crystals',bg:'#0a0514'},
{id:'forest-night',emoji:'🌲',name:'Ночной лес',color:'#08100a',effects:'fireflies',bg:'#08100a'},
{id:'fire',emoji:'🔥',name:'Огонь',color:'#140600',effects:'ember',bg:'#140600'},
{id:'frost',emoji:'❄',name:'Мороз',color:'#0a1525',effects:'snow',bg:'#0a1525'},
{id:'spirit',emoji:'✨',name:'Дух',color:'#14082a',effects:'stardust',bg:'#14082a'},
{id:'time',emoji:'⏳',name:'Время',color:'#0a0e14',effects:'particles',bg:'#0a0e14'},
{id:'money',emoji:'💰',name:'Деньги',color:'#0a1408',effects:'spark',bg:'#0a1408'},
{id:'love',emoji:'❤️',name:'Любовь',color:'#1a0810',effects:'hearts',bg:'#1a0810'}
];

/* ============ DOMAINS (10) ============ */
var DOMAINS=[
{id:'physical',emoji:'💪',name:'Физическое',color:'#ff7ba9',desc:'Тело, сила, выносливость',metrics:[{id:'weight',label:'Вес (кг)',target:'60-80'},{id:'steps',label:'Шагов/день',target:'8000'},{id:'workouts',label:'Тренировок/нед',target:'3-5'},{id:'vo2max',label:'VO2max',target:'40+'},{id:'restHR',label:'Пульс покоя',target:'50-70'}]},
{id:'mental',emoji:'🧠',name:'Ментальное',color:'#4dd4ff',desc:'Фокус, память, ясность',metrics:[{id:'focusMin',label:'Deep Work (мин)',target:'180'},{id:'meditation',label:'Медитаций/нед',target:'7'},{id:'reading',label:'Страниц/день',target:'20'},{id:'memory',label:'Память 1-10',target:'7+'},{id:'iq',label:'IQ-задач/день',target:'5'}]},
{id:'emotional',emoji:'❤️',name:'Эмоциональное',color:'#ff6b6b',desc:'Чувства, стресс',metrics:[{id:'mood',label:'Настроение 1-10',target:'7+'},{id:'stress',label:'Стресс 1-10',target:'<5'},{id:'anxiety',label:'Тревога 1-10',target:'<4'},{id:'journal',label:'Записей/нед',target:'3'}]},
{id:'spiritual',emoji:'🕊',name:'Духовное',color:'#b394ff',desc:'Смысл, ценности',metrics:[{id:'gratitude',label:'Благодарностей/день',target:'3'},{id:'meaning',label:'Смысл 1-10',target:'7+'},{id:'nature',label:'На природе (мин/нед)',target:'120'}]},
{id:'financial',emoji:'💰',name:'Финансовое',color:'#ffcc4d',desc:'Бюджет, инвестиции',metrics:[{id:'savings',label:'Норма сбережений %',target:'20%+'},{id:'runway',label:'Runway (мес)',target:'6+'},{id:'debt',label:'Долговая нагрузка %',target:'<30%'}]},
{id:'career',emoji:'💼',name:'Карьерное',color:'#3ddc97',desc:'Навыки, позиция',metrics:[{id:'skills',label:'Навыков в развитии',target:'3'},{id:'network',label:'Контактов/мес',target:'5'},{id:'projects',label:'Проектов/квартал',target:'3'}]},
{id:'social',emoji:'👥',name:'Социальное',color:'#c4b5fd',desc:'Семья, друзья',metrics:[{id:'deepConnections',label:'Глубоких связей',target:'5+'},{id:'calls',label:'Звонков/нед',target:'3'},{id:'meetups',label:'Встреч/мес',target:'4'}]},
{id:'environment',emoji:'🏠',name:'Среда',color:'#a4e7ff',desc:'Пространство, свет',metrics:[{id:'clutter',label:'Порядок 1-10',target:'8+'},{id:'light',label:'Освещение 1-10',target:'8+'},{id:'noise',label:'Тишина 1-10',target:'7+'}]},
{id:'recovery',emoji:'⏰',name:'Восстановление',color:'#4dd4ff',desc:'Сон, отдых, детокс',metrics:[{id:'sleepHours',label:'Сон (ч)',target:'7-9'},{id:'sleepQuality',label:'Качество сна 1-10',target:'8+'},{id:'breaks',label:'Перерывов/день',target:'6+'}]},
{id:'digital',emoji:'📱',name:'Цифровое',color:'#ff88cc',desc:'Экран, детокс, фокус',metrics:[{id:'screenToday',label:'Экран сегодня (мин)',target:'<240'},{id:'screenWeek',label:'Экран за неделю (ч)',target:'<28'},{id:'phoneUnlocks',label:'Разблокировок',target:'<80'},{id:'socialTime',label:'Соцсети (мин)',target:'<60'}]}
];

/* ============ SURVEY (26 вопросов) ============ */
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

/* ============ DEFAULT STATE (расширенный) ============ */
function defaultState(){
  return {
    /* Задачи с гибкими полями */
    tasks:[],
    /* Календарь */
    schedule:[],
    scheduleBlocks:[],
    /* Привычки и цели */
    habits:[], customHabits:[], habitLog:{},
    goals:[], customGoals:[], goalProgress:{},
    /* Заметки и дневник */
    notes:[], customNotes:[],
    journal:[], journalEntries:[],
    /* Здоровье */
    water:[], customWater:[],
    mood:[], customMood:[],
    meds:[], customMeds:[],
    workouts:[], customWorkouts:[],
    meditations:[], customMeditation:[],
    /* Таймер */
    timer:[], timerSessions:[],
    /* Фокус */
    focusSessions:[],
    /* AI */
    chats:[],
    /* Обучение */
    levelProgress:{}, englishProgress:{}, skillsProgress:{},
    paths:[], courses:[],
    /* Домены */
    domainScores:{}, domainHistory:{}, metrics:{},
    /* Матрица */
    matrix:[],
    /* Досуг */
    entertainment:[], watchlist:[], watched:[],
    media:[], mediaLibrary:[],
    /* Экран */
    screenStats:{}, screenHabits:{}, screenMode:null, screenDaily:{},
    /* Финансы */
    finance:[], financeGoals:[],
    /* EQ / Память / IQ */
    eqJournal:[], memoryTraining:[], iqScores:[],
    /* Интеграции */
    integrations:{
      googleCalendar:{connected:false,clientId:'',calendarId:'primary',accessToken:null,lastSync:null},
      obsidian:{path:'',apiKey:'',autoSync:false,lastSync:null,defaultFolder:'AI-Health'},
      gemini:{apiKey:'',model:'gemini-1.5-flash',connected:false},
      notion:{apiKey:'',databaseId:'',enabled:false},
      todoist:{apiKey:'',enabled:false}
    },
    screenTime:{limits:{daily:240,social:60,games:30,work:180},usage:{},detoxMode:false,detoxUntil:null},
    profile:{name:'',emoji:'😊',createdAt:new Date().toISOString(),achievements:[],surveyAnswers:null,surveyStep:0,surveyDone:false,personalPlan:null},
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
      glassBlur:24,
      glassOpacity:1,
      animationSpeed:1,
      reminderTime:'morning',
      dailyPlanEnabled:true,
      language:'ru',
      weekStart:1
    },
    flags:{dnd:false,focus:false},
    stats:{
      streak:0,lastActiveDay:null,totalDays:0,
      totalTasksDone:0,totalLessonsDone:0,totalWater:0,
      totalMoodLogs:0,totalWorkouts:0,totalMeditations:0,
      bestStreak:0
    }
  }
}

/* ============ MIGRATION v28/v29 → v30 ============ */
function migrate(){
  var currentRaw=null;
  try{currentRaw=localStorage.getItem(STORAGE_KEY)}catch(e){}
  if(currentRaw)return; // уже есть v30
  for(var i=0;i<OLD_KEYS.length;i++){
    var oldRaw=null;
    try{oldRaw=localStorage.getItem(OLD_KEYS[i])}catch(e){}
    if(oldRaw){
      try{
        var old=JSON.parse(oldRaw);
        var fresh=defaultState();
        // Переносим всё что есть
        Object.keys(old).forEach(function(k){
          if(k==='settings'){
            fresh.settings=Object.assign(fresh.settings,old.settings||{});
          } else if(k==='profile'){
            fresh.profile=Object.assign(fresh.profile,old.profile||{});
          } else if(k==='integrations'){
            fresh.integrations=Object.assign(fresh.integrations,old.integrations||{});
          } else if(k==='stats'){
            fresh.stats=Object.assign(fresh.stats,old.stats||{});
          } else if(k==='flags'){
            fresh.flags=Object.assign(fresh.flags,old.flags||{});
          } else if(fresh[k]!==undefined){
            fresh[k]=old[k];
          }
        });
        // Перенос заметок старых в новые
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
    /* Гарантируем поля */
    if(!state.levelProgress)state.levelProgress={};
    if(!state.englishProgress)state.englishProgress={};
    if(!state.skillsProgress)state.skillsProgress={};
    if(!state.domainScores)state.domainScores={};
    if(!state.metrics)state.metrics={};
    if(!state.entertainment)state.entertainment=[];
    if(!state.watchlist)state.watchlist=[];
    if(!state.watched)state.watched=[];
    if(!state.screenStats)state.screenStats={};
    if(!state.screenHabits)state.screenHabits={};
    if(!state.finance)state.finance=[];
    if(!state.financeGoals)state.financeGoals=[];
    if(!state.eqJournal)state.eqJournal=[];
    if(!state.memoryTraining)state.memoryTraining=[];
    if(!state.iqScores)state.iqScores=[];
    if(!state.customHabits)state.customHabits=[];
    if(!state.habitLog)state.habitLog={};
    if(!state.customGoals)state.customGoals=[];
    if(!state.goalProgress)state.goalProgress={};
    if(!state.customNotes)state.customNotes=[];
    if(!state.journalEntries)state.journalEntries=[];
    if(!state.customWater)state.customWater=[];
    if(!state.customMood)state.customMood=[];
    if(!state.customMeds)state.customMeds=[];
    if(!state.customMeditation)state.customMeditation=[];
    if(!state.customWorkouts)state.customWorkouts=[];
    if(!state.timerSessions)state.timerSessions=[];
    if(!state.focusSessions)state.focusSessions=[];
    if(!state.mediaLibrary)state.mediaLibrary=[];
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

/* ============ PATH LIBRARY (17) ============ */
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
{id:'memory',title:'Память',emoji:'🧠',category:'Обучение',steps:[{title:'Эббингауз',desc:'Кривая забывания',secret:'1ч, 1д, 3д.'},{title:'Локусы',desc:'Дворец',secret:'Древнегреческий.'},{title:'Мнемоники',desc:'Ассоциации',secret:'Страннее = лучше.'},{title:'Anki',desc:'Интервальное',secret:'20 мин/день.'},{title:'Чанкинг',desc:'Группировка',secret:'7±2.'},{title:'Recall',desc:'Припоминание',secret:'Testing effect.'},{title:'Фейнман',desc:'Объясни',secret:'Проверка.'},{title:'Сон',desc:'Консолидация',secret:'7-9.'},{title:'Двойное',desc:'Слова+образы',secret:'Paivio.'},{title:'Система',desc:'Комбо',secret:'×3-5.'}]}
];

/* ============ COURSES (12) ============ */
var COURSES_LIBRARY=[
{id:'productivity_master',title:'Мастер продуктивности',emoji:'⚡',category:'Продуктивность',lessons:[{title:'Введение',content:'80/20. 20% усилий — 80% результата.'},{title:'SMART и OKR',content:'SMART + Key Results.'},{title:'Матрица',content:'Q1 делай, Q2 планируй, Q3 делегируй, Q4 удали.'},{title:'GTD',content:'Capture, Clarify, Organize, Reflect, Engage.'},{title:'Deep Work',content:'90 минут. 3-4 часа = 10 часов.'},{title:'Pomodoro',content:'25/5. 4 цикла.'},{title:'Энергия',content:'Управляй энергией. 90/15.'},{title:'Привычки',content:'1% в день = 37x за год.'},{title:'Инструменты',content:'Notion, Obsidian, Todoist.'},{title:'Итог',content:'3 цели, 5 привычек, 1 система.'}]},
{id:'mental_health',title:'Психическое здоровье',emoji:'🧠',category:'Психика',lessons:[{title:'Психика',content:'Функция мозга. Пластичность.'},{title:'Эмоции',content:'7 базовых. 90 секунд.'},{title:'Тревога',content:'Дыхание 4-7-8. КПТ.'},{title:'Депрессия',content:'Болезнь. КПТ 70%.'},{title:'КПТ',content:'Мысль → эмоция.'},{title:'ACT',content:'Принятие. Ценности.'},{title:'Травма',content:'EMDR.'},{title:'Границы',content:'Спокойное "нет".'},{title:'Смысл',content:'Франкл.'},{title:'Помощь',content:'>2 недель → специалист.'}]},
{id:'health_basics',title:'Основы здоровья',emoji:'⚕️',category:'Здоровье',lessons:[{title:'Сон',content:'7-9 часов.'},{title:'Питание',content:'Средиземноморская.'},{title:'Микроэлементы',content:'D3, Omega-3, магний.'},{title:'Движение',content:'150 мин кардио.'},{title:'Стресс',content:'Сапольски.'},{title:'Профилактика',content:'Чекап.'},{title:'Долголетие',content:'Аттиа.'},{title:'Психика=тело',content:'+40% инфаркт.'},{title:'Мифы',content:'Детоксы.'},{title:'Скорая',content:'FAST. 103.'}]},
{id:'financial_literacy',title:'Финансовая грамотность',emoji:'💰',category:'Финансы',lessons:[{title:'Психология',content:'Хаусел.'},{title:'Учёт',content:'50/30/20.'},{title:'Подушка',content:'3-6 месяцев.'},{title:'Долги',content:'Снежный ком.'},{title:'Инвестиции',content:'Индексные фонды.'},{title:'Диверсификация',content:'100 - возраст.'},{title:'Налоги',content:'ИИС.'},{title:'Доход',content:'2-й источник.'},{title:'Страхование',content:'Защитное.'},{title:'Пенсия',content:'Сложный процент.'}]},
{id:'neuroscience',title:'Нейробиология',emoji:'🔬',category:'Здоровье',lessons:[{title:'Структура',content:'86 млрд нейронов.'},{title:'Пластичность',content:'Fire together, wire together.'},{title:'Дофамин',content:'Мотивация.'},{title:'Кортизол',content:'Хронический стресс.'},{title:'Серотонин',content:'Настроение.'},{title:'Окситоцин',content:'Связи.'},{title:'Сон',content:'Глимфатика.'},{title:'Питание',content:'Omega-3.'},{title:'Обучение',content:'Интервалы.'},{title:'Медитация',content:'Утолщение коры.'}]},
{id:'communication',title:'Коммуникация',emoji:'💬',category:'Общение',lessons:[{title:'Слушание',content:'3 уровня.'},{title:'Я-сообщения',content:'Формула.'},{title:'ННО',content:'Наблюдение, чувства.'},{title:'Сложные разговоры',content:'Пауза.'},{title:'Влияние',content:'Чалдини.'},{title:'Выступления',content:'Hook.'},{title:'Конфликты',content:'Сотрудничество.'},{title:'Обратная связь',content:'SBI.'},{title:'Переговоры',content:'BATNA.'},{title:'Этика',content:'Уважение.'}]},
{id:'english_course',title:'Английский с нуля',emoji:'🇬🇧',category:'Обучение',lessons:[{title:'Алфавит',content:'26 букв. 44 звука.'},{title:'Приветствия',content:'Hello!'},{title:'Числа',content:'1-100.'},{title:'Present Simple',content:'I work.'},{title:'Past Simple',content:'I worked.'},{title:'Future',content:'Will.'},{title:'Present Perfect',content:'Have worked.'},{title:'Модальные',content:'Can, must.'},{title:'Условные',content:'If...'},{title:'Фразовые',content:'Get up.'},{title:'Идиомы',content:'Break a leg.'},{title:'Деловой',content:'Emails.'},{title:'Академический',content:'Essays.'},{title:'Свободное',content:'Debates.'}]},
{id:'recovery_course',title:'Восстановление',emoji:'🌿',category:'Здоровье',lessons:[{title:'Виды отдыха',content:'7 типов.'},{title:'Сон',content:'Гигиена.'},{title:'Медитация',content:'5-20 минут.'},{title:'Природа',content:'2 часа/нед.'},{title:'Фильмы',content:'Осознанный просмотр.'},{title:'Чтение',content:'20 минут.'},{title:'Музыка',content:'Расслабление.'},{title:'Творчество',content:'Поток.'},{title:'Хобби',content:'Баланс.'},{title:'Детокс',content:'24 часа.'}]},
{id:'memory_master',title:'Мастер памяти',emoji:'🧠',category:'Обучение',lessons:[{title:'Память',content:'3 типа.'},{title:'Дворец',content:'Метод локусов.'},{title:'Мнемоники',content:'Ассоциации.'},{title:'Anki',content:'Интервалы.'},{title:'Чанкинг',content:'7±2.'},{title:'Recall',content:'Припоминание.'},{title:'Фейнман',content:'Объясни.'},{title:'Сон',content:'Консолидация.'},{title:'Кодирование',content:'Paivio.'},{title:'Система',content:'Комбо.'}]},
{id:'iq_boost',title:'IQ-тренировки',emoji:'🎯',category:'Обучение',lessons:[{title:'IQ',content:'Средний 100.'},{title:'Последовательности',content:'Паттерны.'},{title:'Аналогии',content:'Связи.'},{title:'Пространственное',content:'Вращение.'},{title:'Рабочая память',content:'N-back.'},{title:'Скорочтение',content:'400-600 слов.'},{title:'Критическое',content:'5 вопросов.'},{title:'Математика',content:'Ментальная.'},{title:'Шахматы',content:'Стратегия.'},{title:'Система',content:'N-back+задачи.'}]},
{id:'eq_course',title:'Эмоциональный интеллект',emoji:'❤️',category:'Психика',lessons:[{title:'EQ',content:'Гоулман.'},{title:'Самосознание',content:'Дневник.'},{title:'Саморегуляция',content:'Дыхание.'},{title:'Эмпатия',content:'3 типа.'},{title:'Мотивация',content:'Деси/Райан.'},{title:'Соц.навыки',content:'SBI.'},{title:'Стресс',content:'Box breathing.'},{title:'Конфликты',content:'Стили.'},{title:'Границы',content:'Формула.'},{title:'Система',content:'Дневник+пауза.'}]},
{id:'screentime_course',title:'Цифровой детокс',emoji:'📱',category:'Здоровье',lessons:[{title:'Диагностика',content:'Замер.'},{title:'Утро',content:'30 мин.'},{title:'Deep Work',content:'90 мин.'},{title:'Вечер',content:'2 ч.'},{title:'Детокс',content:'24 ч.'},{title:'Среда',content:'Телефон вне.'},{title:'Замены',content:'Книга.'},{title:'Психология',content:'FOMO.'},{title:'Инструменты',content:'Forest.'},{title:'Система',content:'Привычки.'}]}
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

/* ============ ACHIEVEMENTS ============ */
var ACHIEVEMENTS=[
{id:'first_task',icon:'🎯',name:'Первый шаг',check:function(s){return s.tasks.length>=1}},
{id:'ten_tasks',icon:'🔟',name:'10 задач',check:function(s){return s.tasks.length>=10}},
{id:'hundred_tasks',icon:'💯',name:'100 задач',check:function(s){return s.tasks.length>=100}},
{id:'first_habit',icon:'🌱',name:'Привычка',check:function(s){return (s.customHabits||[]).length>=1}},
{id:'five_habits',icon:'🌿',name:'5 привычек',check:function(s){return (s.customHabits||[]).length>=5}},
{id:'streak_7',icon:'🔥',name:'Неделя',check:function(s){return (s.stats.streak||0)>=7}},
{id:'streak_30',icon:'⚡',name:'Месяц',check:function(s){return (s.stats.streak||0)>=30}},
{id:'streak_100',icon:'💎',name:'100 дней',check:function(s){return (s.stats.streak||0)>=100}},
{id:'streak_365',icon:'👑',name:'Год',check:function(s){return (s.stats.streak||0)>=365}},
{id:'first_chat',icon:'💬',name:'Диалог',check:function(s){return s.chats.length>=1}},
{id:'ai_master',icon:'🧠',name:'AI-мастер',check:function(s){return s.chats.filter(function(c){return c.role==='user'}).length>=50}},
{id:'writer',icon:'📝',name:'Писатель',check:function(s){return (s.customNotes||[]).length>=10}},
{id:'journal_30',icon:'📓',name:'Дневник 30',check:function(s){return (s.journalEntries||[]).length>=30}},
{id:'scholar',icon:'🎓',name:'Учёный',check:function(s){return Object.keys(s.levelProgress||{}).length>=10}},
{id:'level1',icon:'🌱',name:'Фундамент',check:function(s){return checkLevelComplete(s,'l1')}},
{id:'level2',icon:'📚',name:'Ученик',check:function(s){return checkLevelComplete(s,'l2')}},
{id:'level3',icon:'🎯',name:'Практик',check:function(s){return checkLevelComplete(s,'l3')}},
{id:'level4',icon:'👑',name:'Мастер',check:function(s){return checkLevelComplete(s,'l4')}},
{id:'level5',icon:'🌟',name:'Наставник',check:function(s){return checkLevelComplete(s,'l5')}},
{id:'survey_done',icon:'📋',name:'Профиль',check:function(s){return s.profile&&s.profile.surveyDone}},
{id:'all_domains',icon:'🌐',name:'Все домены',check:function(s){return Object.keys(s.domainScores||{}).length>=3}},
{id:'english_start',icon:'🇬🇧',name:'English',check:function(s){return s.englishProgress&&Object.keys(s.englishProgress).length>=1}},
{id:'english_master',icon:'🎓',name:'English Master',check:function(s){return s.englishProgress&&Object.keys(s.englishProgress).length>=50}},
{id:'english_legend',icon:'🏆',name:'English Legend',check:function(s){return s.englishProgress&&Object.keys(s.englishProgress).length>=125}},
{id:'meditation_10',icon:'🧘',name:'10 медитаций',check:function(s){return (s.customMeditation||[]).length>=10}},
{id:'meditation_100',icon:'☯️',name:'100 медитаций',check:function(s){return (s.customMeditation||[]).length>=100}},
{id:'workout_10',icon:'🏋️',name:'10 тренировок',check:function(s){return (s.customWorkouts||[]).length>=10}},
{id:'workout_100',icon:'🏆',name:'100 тренировок',check:function(s){return (s.customWorkouts||[]).length>=100}},
{id:'water_100',icon:'💧',name:'100 стаканов',check:function(s){return (s.customWater||[]).reduce(function(a,w){return a+(w.count||0)},0)>=100}},
{id:'water_1000',icon:'🌊',name:'1000 стаканов',check:function(s){return (s.customWater||[]).reduce(function(a,w){return a+(w.count||0)},0)>=1000}},
{id:'mood_30',icon:'💭',name:'30 настроений',check:function(s){return (s.customMood||[]).length>=30}},
{id:'entertainment_10',icon:'🎬',name:'Киноман',check:function(s){return (s.watched||[]).length>=10}},
{id:'movie_10',icon:'🎥',name:'Кинокритик',check:function(s){return (s.watched||[]).filter(function(w){return w.type==='movie'}).length>=10}},
{id:'book_5',icon:'📚',name:'Книголюб',check:function(s){return (s.watched||[]).filter(function(w){return w.type==='book'}).length>=5}},
{id:'screen_detox',icon:'🚫',name:'Детокс',check:function(s){return (s.screenHabits||{})&&Object.keys(s.screenHabits).length>=7}},
{id:'memory_master',icon:'🧠',name:'Мастер памяти',check:function(s){return (s.memoryTraining||[]).length>=30}},
{id:'iq_boost',icon:'🎯',name:'IQ+',check:function(s){return (s.iqScores||[]).length>=10}},
{id:'finance_start',icon:'💰',name:'Финансист',check:function(s){return (s.finance||[]).length>=10}},
{id:'watchlist_10',icon:'📋',name:'Список',check:function(s){return (s.watchlist||[]).length>=10}},
{id:'goals_3',icon:'🎯',name:'3 цели',check:function(s){return (s.customGoals||[]).length>=3}},
{id:'notes_50',icon:'📝',name:'50 заметок',check:function(s){return (s.customNotes||[]).length>=50}},
{id:'timer_10',icon:'⏱',name:'10 сессий',check:function(s){return (s.timerSessions||[]).length>=10}}
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
        if(typeof playAchievementSound==='function')playAchievementSound();
        if(typeof haptic==='function')haptic('success');
      },idx*800);
    });
  }
}

/* ============ METHODS (50+) ============ */
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

window.__DATA_READY=true;
window.STORAGE_KEY=STORAGE_KEY;
window.defaultState=defaultState;
window.THEMES=THEMES;
window.DOMAINS=DOMAINS;
window.SURVEY_QUESTIONS=SURVEY_QUESTIONS;
window.PATHS_LIBRARY=PATHS_LIBRARY;
window.COURSES_LIBRARY=COURSES_LIBRARY;
window.LEARNING_LEVELS=LEARNING_LEVELS;
window.ACHIEVEMENTS=ACHIEVEMENTS;
window.METHODS_LIBRARY=METHODS_LIBRARY;
window.PERSONAS=PERSONAS;
window.TABS=TABS;
window.HABITS_TEMPLATES=HABITS_TEMPLATES;
window.GOALS_TEMPLATES=GOALS_TEMPLATES;
window.checkLevelComplete=checkLevelComplete;
window.checkAchievements=checkAchievements;
window.save=save;