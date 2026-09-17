'use strict';
/* SCREEN TIME — РЕАЛЬНЫЕ СОВЕТЫ ПО ДЕТОКСУ */

var SCREEN_TIPS=[
/* ДИАГНОСТИКА */
{id:'diag_1',category:'🔍 Диагностика',title:'Замерь реальное время',desc:'Screen Time (iOS) или Digital Wellbeing (Android). Запиши: общее, топ-5 приложений, соцсети.',action:'Запиши 3 цифры.',effect:'Осознание — первый шаг.',time:'5 минут'},
{id:'diag_2',category:'🔍 Диагностика',title:'Аудит приложений',desc:'Раздели: нужные, полезные, токсичные.',action:'Удали 3 токсичных.',effect:'Барьер.',time:'10 минут'},
{id:'diag_3',category:'🔍 Диагностика',title:'Триггеры',desc:'Когда тянешься к телефону?',action:'Дневник: время, эмоция.',effect:'Понимание 50%.',time:'3 дня'},
{id:'diag_4',category:'🔍 Диагностика',title:'Аудит недели',desc:'Общее за неделю × 52 = часы в году.',action:'__ ч/день × 365.',effect:'4 ч = 60 дней/год.',time:'5 минут'},
{id:'diag_5',category:'🔍 Диагностика',title:'Топ-3 убийцы',desc:'3 приложения, съедающие больше всего.',action:'Лимит 30 мин/день.',effect:'Фокус.',time:'5 минут'},
{id:'diag_6',category:'🔍 Диагностика',title:'Уведомления-аудит',desc:'Отключи всё кроме важных.',action:'Без звука.',effect:'-80%.',time:'10 минут'},
{id:'diag_7',category:'🔍 Диагностика',title:'Пики экрана',desc:'Когда больше всего в телефоне?',action:'Запиши 3 пика.',effect:'Паттерн.',time:'5 минут'},
{id:'diag_8',category:'🔍 Диагностика',title:'Сравнение с целями',desc:'Цели vs экран.',action:'Соотношение.',effect:'Мотивация.',time:'5 минут'},
/* УТРО */
{id:'morning_1',category:'🌅 Утро',title:'Телефон не будильник',desc:'Механический будильник. Телефон вне спальни.',action:'Купи будильник.',effect:'Утро без экрана.',time:'1 день'},
{id:'morning_2',category:'🌅 Утро',title:'Правило 30 минут',desc:'Не бери телефон 30 мин.',action:'Вода + свет + движение.',effect:'Кортизол без ямы.',time:'30 мин'},
{id:'morning_3',category:'🌅 Утро',title:'Свет вместо экрана',desc:'10 мин солнечного света.',action:'Выйди на балкон.',effect:'Сон, энергия.',time:'10 мин'},
{id:'morning_4',category:'🌅 Утро',title:'Утренние страницы',desc:'3 стр. от руки. Без правок.',action:'Блокнот 15 мин.',effect:'Ясность.',time:'15 мин'},
{id:'morning_5',category:'🌅 Утро',title:'Вода + дыхание',desc:'Стакан + 4-7-8 × 4.',action:'Сразу после пробуждения.',effect:'-Тревога.',time:'3 мин'},
{id:'morning_6',category:'🌅 Утро',title:'Движение 15 мин',desc:'Зарядка, прогулка, растяжка.',action:'15 мин движения.',effect:'BDNF.',time:'15 мин'},
{id:'morning_7',category:'🌅 Утро',title:'Завтрак без экрана',desc:'Ешь осознанно.',action:'Завтрак в тишине.',effect:'-Переедание.',time:'15 мин'},
{id:'morning_8',category:'🌅 Утро',title:'План на бумаге',desc:'3 главные задачи. От руки.',action:'Утром 5 мин.',effect:'Фокус.',time:'5 мин'},
/* ДЕНЬ */
{id:'day_1',category:'☀️ День',title:'Телефон вне комнаты',desc:'Во время работы.',action:'Ящик. 90 мин.',effect:'+40%.',time:'90 мин'},
{id:'day_2',category:'☀️ День',title:'Авиарежим 90 мин',desc:'Deep Work.',action:'Одна задача.',effect:'3-4 ч = 10 ч.',time:'90 мин'},
{id:'day_3',category:'☀️ День',title:'Серые уведомления',desc:'Без звука и вибрации.',action:'Только визуальные.',effect:'-50%.',time:'5 мин'},
{id:'day_4',category:'☀️ День',title:'20-20-20',desc:'Каждые 20 мин — 20 сек вдаль.',action:'Таймер.',effect:'-Усталость глаз.',time:'весь день'},
{id:'day_5',category:'☀️ День',title:'Перерывы без телефона',desc:'Встать, пройтись, вода, окно.',action:'Каждый час 5 мин.',effect:'Энергия.',time:'5×6 мин'},
{id:'day_6',category:'☀️ День',title:'Обед без экрана',desc:'Слушай тело.',action:'Обед 30 мин в тишине.',effect:'-Переедание.',time:'30 мин'},
{id:'day_7',category:'☀️ День',title:'Лимиты приложений',desc:'Лимит 30 мин на соцсети.',action:'Настройки.',effect:'Осознанность.',time:'5 мин'},
{id:'day_8',category:'☀️ День',title:'Удали приложения',desc:'Соцсети в браузере.',action:'Удали 3.',effect:'-70%.',time:'10 мин'},
{id:'day_9',category:'☀️ День',title:'Один экран',desc:'Нет ТВ + телефон + ноут.',action:'Только один.',effect:'+30%.',time:'весь день'},
{id:'day_10',category:'☀️ День',title:'Чтение вместо ленты',desc:'Вместо ленты — книга.',action:'20 мин.',effect:'+Знания.',time:'20 мин'},
{id:'day_11',category:'☀️ День',title:'Прогулка без телефона',desc:'20 мин ходьбы.',action:'Телефон дома.',effect:'+Креатив.',time:'20 мин'},
{id:'day_12',category:'☀️ День',title:'День без соцсетей',desc:'24 часа.',action:'Удали приложения.',effect:'Перезагрузка.',time:'24 ч'},
{id:'day_13',category:'☀️ День',title:'Аналоговые хобби',desc:'Спорт, рисование, музыка.',action:'30 мин.',effect:'+Удовольствие.',time:'30 мин'},
{id:'day_14',category:'☀️ День',title:'Звонок вместо текста',desc:'Живой голос.',action:'10 мин голосом.',effect:'+Связь.',time:'10 мин'},
/* ВЕЧЕР */
{id:'evening_1',category:'🌙 Вечер',title:'Цифровой закат',desc:'За 2 ч до сна — без экранов.',action:'21:00 — зарядка.',effect:'Сон глубже.',time:'2 ч'},
{id:'evening_2',category:'🌙 Вечер',title:'Ночной режим',desc:'После 20:00 — тёплый свет.',action:'Night Shift.',effect:'Мелатонин.',time:'весь вечер'},
{id:'evening_3',category:'🌙 Вечер',title:'Чтение перед сном',desc:'Книга на бумаге.',action:'30 мин.',effect:'Сон лучше.',time:'30 мин'},
{id:'evening_4',category:'🌙 Вечер',title:'Рефлексия дня',desc:'3 победы, 1 урок, 1 благодарность.',action:'Дневник 5 мин.',effect:'Ясность.',time:'5 мин'},
{id:'evening_5',category:'🌙 Вечер',title:'Медитация 10 мин',desc:'Body scan.',action:'10 мин.',effect:'Сон глубже.',time:'10 мин'},
{id:'evening_6',category:'🌙 Вечер',title:'Тёплый душ',desc:'За 1 ч до сна.',action:'10 мин.',effect:'Засыпание.',time:'10 мин'},
{id:'evening_7',category:'🌙 Вечер',title:'Спальня = храм',desc:'Темно, 18-20°C, тихо.',action:'Телефон вне.',effect:'Сон качественнее.',time:'5 мин'},
{id:'evening_8',category:'🌙 Вечер',title:'План на завтра',desc:'3 задачи. Запиши.',action:'5 мин.',effect:'Спокойный сон.',time:'5 мин'},
{id:'evening_9',category:'🌙 Вечер',title:'Музыка вместо сериала',desc:'Спокойная или тишина.',action:'Плейлист.',effect:'Расслабление.',time:'30 мин'},
{id:'evening_10',category:'🌙 Вечер',title:'Без новостей',desc:'Новости вечером = тревога.',action:'После 18:00 — нет.',effect:'Спокойный вечер.',time:'весь вечер'},
/* ВЫХОДНЫЕ */
{id:'weekend_1',category:'🎉 Выходные',title:'Детокс 24 ч',desc:'Один день без экранов.',action:'Телефон в ящик.',effect:'Перезагрузка.',time:'24 ч'},
{id:'weekend_2',category:'🎉 Выходные',title:'Природа 2 ч',desc:'Парк, лес, вода.',action:'Телефон в сумке.',effect:'-16% кортизол.',time:'2 ч'},
{id:'weekend_3',category:'🎉 Выходные',title:'Встреча с друзьями',desc:'Живое общение.',action:'Телефоны в карманах.',effect:'+Связь.',time:'2-3 ч'},
{id:'weekend_4',category:'🎉 Выходные',title:'Хобби-день',desc:'Целый день на хобби.',action:'3 ч без телефона.',effect:'+Удовольствие.',time:'3 ч'},
{id:'weekend_5',category:'🎉 Выходные',title:'Уборка и порядок',desc:'Физическая работа.',action:'1 ч.',effect:'+Ясность.',time:'1 ч'},
{id:'weekend_6',category:'🎉 Выходные',title:'Кулинарный эксперимент',desc:'Без рецепта в телефоне.',action:'1.5 ч.',effect:'+Навык.',time:'1.5 ч'},
{id:'weekend_7',category:'🎉 Выходные',title:'Спорт 1 ч',desc:'Зал, бассейн, бег.',action:'Телефон в шкафчике.',effect:'+Эндорфины.',time:'1 ч'},
{id:'weekend_8',category:'🎉 Выходные',title:'Книжный день',desc:'3 ч чтения.',action:'Бумага. Тишина.',effect:'+Знания.',time:'3 ч'},
{id:'weekend_9',category:'🎉 Выходные',title:'Музей',desc:'Живое искусство.',action:'2 ч.',effect:'+Вдохновение.',time:'2 ч'},
{id:'weekend_10',category:'🎉 Выходные',title:'Планирование',desc:'Воскресенье: цели, задачи.',action:'30 мин.',effect:'Фокус.',time:'30 мин'},
/* ПРИЛОЖЕНИЯ */
{id:'app_1',category:'📱 Приложения',title:'Forest',desc:'Сажаешь дерево.',action:'25 мин.',effect:'Геймификация.',time:'25 мин'},
{id:'app_2',category:'📱 Приложения',title:'Freedom',desc:'Блокирует всё.',action:'4 часа.',effect:'Барьер.',time:'4 ч'},
{id:'app_3',category:'📱 Приложения',title:'Screen Time',desc:'Встроенные.',action:'Лимиты.',effect:'Осознанность.',time:'10 мин'},
{id:'app_4',category:'📱 Приложения',title:'One Sec',desc:'Задержка.',action:'Соцсети.',effect:'-50%.',time:'5 мин'},
{id:'app_5',category:'📱 Приложения',title:'Cold Turkey',desc:'Для ПК.',action:'YouTube.',effect:'Фокус.',time:'весь день'},
{id:'app_6',category:'📱 Приложения',title:'Offtime',desc:'Авто-режимы.',action:'Работа/Сон.',effect:'Авто.',time:'10 мин'},
{id:'app_7',category:'📱 Приложения',title:'Moment',desc:'Семья.',action:'Отчёты.',effect:'Осознанность.',time:'5 мин'},
{id:'app_8',category:'📱 Приложения',title:'Flipd',desc:'Полный блок.',action:'2 ч.',effect:'Deep Work.',time:'2 ч'},
/* ПСИХОЛОГИЯ */
{id:'psych_1',category:'🧠 Психология',title:'Дофаминовая яма',desc:'Соцсети = быстрый дофамин.',action:'Голодание 4 ч.',effect:'Чувствительность.',time:'4 ч'},
{id:'psych_2',category:'🧠 Психология',title:'FOMO',desc:'Fear Of Missing Out.',action:'Лента не остановится.',effect:'Свобода.',time:'осознание'},
{id:'psych_3',category:'🧠 Психология',title:'Сравнение',desc:'Хайлайты других.',action:'Отпишись от 10.',effect:'-Тревога.',time:'10 мин'},
{id:'psych_4',category:'🧠 Психология',title:'Скука полезна',desc:'Креатив требует простоя.',action:'10 мин скуки.',effect:'+Креатив.',time:'10 мин'},
{id:'psych_5',category:'🧠 Психология',title:'Осознанность',desc:'Импульс приходит и уходит.',action:'Дыши 3 раза. Не бери.',effect:'Свобода выбора.',time:'3 мин'},
{id:'psych_6',category:'🧠 Психология',title:'Идентичность',desc:'"Я — человек, который не скроллит."',action:'3 фразы "Я — ...".',effect:'Долгосрочно.',time:'5 мин'},
{id:'psych_7',category:'🧠 Психология',title:'Награда за офлайн',desc:'Чай, книга после 2 ч.',action:'Перепрошивка.',effect:'Дофамин.',time:'весь день'},
{id:'psych_8',category:'🧠 Психология',title:'Соц.давление',desc:'Обязанность отвечать.',action:'"Я в детоксе до 18:00".',effect:'Свобода.',time:'разговор'},
{id:'psych_9',category:'🧠 Психология',title:'Тревога и экран',desc:'Порочный круг.',action:'Дыхание, прогулка.',effect:'Разрыв.',time:'5 мин'},
{id:'psych_10',category:'🧠 Психология',title:'Смысл вместо ленты',desc:'Лента заполняет пустоту.',action:'3 важные вещи.',effect:'Меньше зависимости.',time:'10 мин'},
/* ЗДОРОВЬЕ */
{id:'health_1',category:'❤️ Здоровье',title:'Глаза 20-20-20',desc:'20 сек вдаль.',action:'Таймер.',effect:'-Усталость.',time:'весь день'},
{id:'health_2',category:'❤️ Здоровье',title:'Осанка',desc:'Телефон на уровне глаз.',action:'Не сгибай шею.',effect:'-Боли.',time:'весь день'},
{id:'health_3',category:'❤️ Здоровье',title:'Синий свет',desc:'Блокирует мелатонин.',action:'Очки или Night Mode.',effect:'Сон.',time:'вечер'},
{id:'health_4',category:'❤️ Здоровье',title:'Запястье',desc:'Разминка каждые 30 мин.',action:'5 упражнений.',effect:'-Боль.',time:'2 мин'},
{id:'health_5',category:'❤️ Здоровье',title:'Экран и сон',desc:'-30% мелатонина.',action:'2 ч без экрана.',effect:'Сон глубже.',time:'2 ч'},
{id:'health_6',category:'❤️ Здоровье',title:'Прогулки',desc:'30 мин/день.',action:'Телефон в кармане.',effect:'+Сердце.',time:'30 мин'},
{id:'health_7',category:'❤️ Здоровье',title:'Вода',desc:'2 л/день.',action:'Бутылка на столе.',effect:'+Энергия.',time:'весь день'},
{id:'health_8',category:'❤️ Здоровье',title:'Медитация',desc:'10 мин/день.',action:'Headspace.',effect:'-Тревога.',time:'10 мин'},
{id:'health_9',category:'❤️ Здоровье',title:'Спорт',desc:'150 мин кардио + 2 силовые.',action:'Телефон в шкафчике.',effect:'+BDNF.',time:'1 ч'},
{id:'health_10',category:'❤️ Здоровье',title:'Сон 7-9 ч',desc:'Телефон вне спальни.',action:'Механический будильник.',effect:'Здоровье.',time:'ночь'},
/* СЕМЬЯ */
{id:'family_1',category:'👨‍👩‍👧 Семья',title:'Правила экрана детям',desc:'2-5 л: 1 ч. 6-12: 2 ч.',action:'Правила на холодильник.',effect:'Привычки.',time:'30 мин'},
{id:'family_2',category:'👨‍👩‍👧 Семья',title:'Зоны без телефонов',desc:'Кухня, спальня, машина.',action:'3 зоны.',effect:'Общение.',time:'осознание'},
{id:'family_3',category:'👨‍👩‍👧 Семья',title:'Час без экрана',desc:'Все без телефонов.',action:'Игра, прогулка.',effect:'+Связь.',time:'1 ч'},
{id:'family_4',category:'👨‍👩‍👧 Семья',title:'Пример родителей',desc:'Дети копируют.',action:'1 ч без телефона.',effect:'Дети учатся.',time:'1 ч'},
{id:'family_5',category:'👨‍👩‍👧 Семья',title:'Совместные хобби',desc:'Спорт, настолки.',action:'2×/нед.',effect:'+Связь.',time:'2 ч'},
/* РАБОТА */
{id:'work_1',category:'💼 Работа',title:'Deep Work блоки',desc:'2-3× 90 мин.',action:'Календарь.',effect:'+40%.',time:'3 ч'},
{id:'work_2',category:'💼 Работа',title:'Email 2×',desc:'10:00 и 16:00.',action:'Закрой почту.',effect:'+Фокус.',time:'30 мин'},
{id:'work_3',category:'💼 Работа',title:'Мессенджеры 3×',desc:'10, 13, 16.',action:'Не постоянно.',effect:'-80%.',time:'30 мин'},
{id:'work_4',category:'💼 Работа',title:'Один экран',desc:'Одна задача.',action:'Закрой лишнее.',effect:'+Фокус.',time:'весь день'},
{id:'work_5',category:'💼 Работа',title:'Помодоро',desc:'25/5. 4 цикла.',action:'Таймер.',effect:'+Продуктивность.',time:'2 ч'},
{id:'work_6',category:'💼 Работа',title:'Встречи без телефонов',desc:'Внимание на людях.',action:'Телефон в кармане.',effect:'+Уважение.',time:'встреча'},
{id:'work_7',category:'💼 Работа',title:'Конец дня',desc:'18:00 — ноут закрыт.',action:'Уведомления выкл.',effect:'+Баланс.',time:'вечер'},
{id:'work_8',category:'💼 Работа',title:'Отпуск без экрана',desc:'1 ч/день макс.',action:'Остальное — жизнь.',effect:'+Впечатления.',time:'отпуск'},
/* ИНСТРУМЕНТЫ */
{id:'tool_1',category:'🛠 Инструменты',title:'Механический будильник',desc:'Телефон вне спальни.',action:'Закажи.',effect:'Утро.',time:'1 день'},
{id:'tool_2',category:'🛠 Инструменты',title:'Наручные часы',desc:'Время без телефона.',action:'Носи.',effect:'-20%.',time:'весь день'},
{id:'tool_3',category:'🛠 Инструменты',title:'Блокнот',desc:'Записывай от руки.',action:'Всегда с собой.',effect:'+Память.',time:'весь день'},
{id:'tool_4',category:'🛠 Инструменты',title:'Книга вместо телефона',desc:'В очереди — читай.',action:'В сумке.',effect:'+Знания.',time:'весь день'},
{id:'tool_5',category:'🛠 Инструменты',title:'MP3-плеер',desc:'Отдельное устройство.',action:'Телефон для звонков.',effect:'-1 ч.',time:'весь день'},
{id:'tool_6',category:'🛠 Инструменты',title:'Настольные часы',desc:'Время видно.',action:'Поставь.',effect:'-Открытий.',time:'весь день'},
{id:'tool_7',category:'🛠 Инструменты',title:'Кнопочный телефон',desc:'На выходных.',action:'Купи.',effect:'+Свобода.',time:'выходные'},
{id:'tool_8',category:'🛠 Инструменты',title:'Календарь на стене',desc:'Планы видны.',action:'Повесь.',effect:'+Осознанность.',time:'весь день'}
];

var SCREEN_30_DAY_PLAN=[
{day:1,title:'Замер',task:'Запиши экранное время.',tip:'Осознание = 50%.'},
{day:2,title:'Уведомления',task:'Отключи всё кроме важного.',tip:'-80% отвлечений.'},
{day:3,title:'Удали 1',task:'Удали самое токсичное.',tip:'Барьер.'},
{day:4,title:'Будильник',task:'Купи механический.',tip:'Утро.'},
{day:5,title:'30 мин утром',task:'Не бери телефон.',tip:'Ясность.'},
{day:6,title:'Лимит',task:'Лимит 30 мин на соцсети.',tip:'Осознанность.'},
{day:7,title:'Детокс 4 ч',task:'4 ч без телефона.',tip:'Перезагрузка.'},
{day:8,title:'Авиарежим',task:'90 мин авиарежим.',tip:'+40%.'},
{day:9,title:'Обед без экрана',task:'Ешь осознанно.',tip:'-Переедание.'},
{day:10,title:'Прогулка',task:'30 мин без телефона.',tip:'+Креатив.'},
{day:11,title:'Удали 2',task:'Удали второе.',tip:'Барьер.'},
{day:12,title:'Чтение 20 мин',task:'Книга вместо ленты.',tip:'+Знания.'},
{day:13,title:'Хобби',task:'30 мин хобби.',tip:'+Удовольствие.'},
{day:14,title:'Цифровой закат',task:'2 ч без экрана.',tip:'Сон.'},
{day:15,title:'Детокс 8 ч',task:'8 ч офлайн.',tip:'Перезагрузка.'},
{day:16,title:'Встреча',task:'Живая встреча.',tip:'+Связь.'},
{day:17,title:'Природа 2 ч',task:'2 ч на природе.',tip:'-16% кортизол.'},
{day:18,title:'Удали 3',task:'Третье приложение.',tip:'Свобода.'},
{day:19,title:'Спорт 1 ч',task:'1 ч спорта.',tip:'+Эндорфины.'},
{day:20,title:'Медитация',task:'10 мин утром и вечером.',tip:'-Тревога.'},
{day:21,title:'Детокс 12 ч',task:'12 ч без телефона.',tip:'Перезагрузка.'},
{day:22,title:'Планирование',task:'30 мин от руки.',tip:'Фокус.'},
{day:23,title:'Книга 1 ч',task:'1 ч чтения.',tip:'+Знания.'},
{day:24,title:'Кулинария',task:'Новое блюдо.',tip:'+Навык.'},
{day:25,title:'Уборка',task:'1 ч уборки.',tip:'+Спокойствие.'},
{day:26,title:'Детокс 16 ч',task:'16 ч офлайн.',tip:'Перезагрузка.'},
{day:27,title:'Хобби 2 ч',task:'2 ч хобби.',tip:'+Удовольствие.'},
{day:28,title:'Звонки',task:'Позвони 3 близким.',tip:'+Связь.'},
{day:29,title:'Детокс 24 ч',task:'Полный день без экрана.',tip:'Свобода.'},
{day:30,title:'Итог',task:'Сравни с днём 1.',tip:'Прогресс.'}
];

var SCREEN_HABITS=[
{id:'h_morning_no_phone',title:'Утро без телефона 30 мин',icon:'🌅'},
{id:'h_no_phone_work',title:'Телефон вне комнаты на работе',icon:'💼'},
{id:'h_lunch_no_screen',title:'Обед без экрана',icon:'🍽'},
{id:'h_walk_30',title:'Прогулка 30 мин',icon:'🚶'},
{id:'h_read_20',title:'Чтение 20 мин',icon:'📚'},
{id:'h_no_screen_2h',title:'2 ч до сна без экрана',icon:'🌙'},
{id:'h_meditation_10',title:'Медитация 10 мин',icon:'🧘'},
{id:'h_sport',title:'Спорт 30+ мин',icon:'🏋️'},
{id:'h_journal',title:'Дневник вечером',icon:'📓'},
{id:'h_no_social_1day',title:'День без соцсетей',icon:'🚫'}
];

var SCREEN_MODES={
focus:{name:'Фокус',duration:90,blocked:['social','youtube','games'],icon:'🎯'},
work:{name:'Работа',duration:120,blocked:['social','youtube','games','news'],icon:'💼'},
sleep:{name:'Сон',duration:480,blocked:['all'],icon:'🌙'},
detox:{name:'Детокс',duration:1440,blocked:['all'],icon:'🚫'},
weekend:{name:'Выходные',duration:1440,blocked:['social','work'],icon:'🎉'}
};

function getScreenStats(){try{return JSON.parse(localStorage.getItem('screen_stats')||'{}')}catch(e){return{}}}
function saveScreenStats(data){try{localStorage.setItem('screen_stats',JSON.stringify(data))}catch(e){}}
function logScreenTime(minutes){var stats=getScreenStats();var today=new Date().toISOString().slice(0,10);if(!stats.daily)stats.daily={};if(!stats.daily[today])stats.daily[today]={minutes:0,entries:[]};stats.daily[today].minutes+=minutes;stats.daily[today].entries.push({time:new Date().toISOString(),minutes:minutes});saveScreenStats(stats)}
function getTodayScreenTime(){var stats=getScreenStats();var today=new Date().toISOString().slice(0,10);return stats.daily&&stats.daily[today]?stats.daily[today].minutes:0}
function getWeekScreenTime(){var stats=getScreenStats();if(!stats.daily)return 0;var total=0;var today=new Date();for(var i=0;i<7;i++){var d=new Date(today);d.setDate(d.getDate()-i);var key=d.toISOString().slice(0,10);if(stats.daily[key])total+=stats.daily[key].minutes}return total}
function toggleHabit(habitId){try{var habits=JSON.parse(localStorage.getItem('screen_habits')||'{}');var today=new Date().toISOString().slice(0,10);if(!habits[today])habits[today]=[];var idx=habits[today].indexOf(habitId);if(idx>=0)habits[today].splice(idx,1);else habits[today].push(habitId);localStorage.setItem('screen_habits',JSON.stringify(habits));return habits[today].indexOf(habitId)>=0}catch(e){return false}}
function isHabitDone(habitId){try{var habits=JSON.parse(localStorage.getItem('screen_habits')||'{}');var today=new Date().toISOString().slice(0,10);return habits[today]&&habits[today].indexOf(habitId)>=0}catch(e){return false}}
function getHabitStreak(habitId){try{var habits=JSON.parse(localStorage.getItem('screen_habits')||'{}');var streak=0;var today=new Date();for(var i=0;i<365;i++){var d=new Date(today);d.setDate(d.getDate()-i);var key=d.toISOString().slice(0,10);if(habits[key]&&habits[key].indexOf(habitId)>=0)streak++;else break}return streak}catch(e){return 0}}
function startScreenMode(modeId){var mode=SCREEN_MODES[modeId];if(!mode)return null;var endTime=new Date(Date.now()+mode.duration*60*1000);try{localStorage.setItem('screen_mode',JSON.stringify({id:modeId,start:new Date().toISOString(),end:endTime.toISOString(),blocked:mode.blocked}))}catch(e){}return mode}
function getActiveMode(){try{var data=JSON.parse(localStorage.getItem('screen_mode')||'null');if(!data)return null;if(new Date(data.end)<new Date()){localStorage.removeItem('screen_mode');return null}return data}catch(e){return null}}

window.__SCREEN_TIPS=SCREEN_TIPS;
window.__SCREEN_30_DAY_PLAN=SCREEN_30_DAY_PLAN;
window.__SCREEN_HABITS=SCREEN_HABITS;
window.__SCREEN_MODES=SCREEN_MODES;
window.__getScreenStats=getScreenStats;
window.__saveScreenStats=saveScreenStats;
window.__logScreenTime=logScreenTime;
window.__getTodayScreenTime=getTodayScreenTime;
window.__getWeekScreenTime=getWeekScreenTime;
window.__toggleHabit=toggleHabit;
window.__isHabitDone=isHabitDone;
window.__getHabitStreak=getHabitStreak;
window.__startScreenMode=startScreenMode;
window.__getActiveMode=getActiveMode;