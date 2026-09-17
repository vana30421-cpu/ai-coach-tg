'use strict';
/* ENTERTAINMENT — ПОЛНЫЙ ДОСУГ */

var MOVIES_LIBRARY=[
{id:'mov_01',title:'Побег из Шоушенка',year:1994,genre:'Драма',rating:9.3,director:'Фрэнк Дарабонт',desc:'История надежды и дружбы в тюрьме.',why:'Учит терпению, надежде, силе духа.',lesson:'Надежда — это хорошо, возможно, самое лучшее.'},
{id:'mov_02',title:'Крёстный отец',year:1972,genre:'Криминал',rating:9.2,director:'Фрэнсис Форд Коппола',desc:'Сага о семье Корлеоне.',why:'Учит стратегии, семейным ценностям.',lesson:'Никогда не говори людям, что думаешь.'},
{id:'mov_03',title:'Тёмный рыцарь',year:2008,genre:'Боевик',rating:9.0,director:'Кристофер Нолан',desc:'Бэтмен против Джокера.',why:'Учит морали, выбору, границам.',lesson:'Ты либо умираешь героем, либо живёшь до того, как станешь злодеем.'},
{id:'mov_04',title:'Криминальное чтиво',year:1994,genre:'Криминал',rating:8.9,director:'Квентин Тарантино',desc:'Несколько историй, переплетённых вместе.',why:'Учит нелинейному мышлению, диалогам.',lesson:'Делай то, что любишь.'},
{id:'mov_05',title:'Форрест Гамп',year:1994,genre:'Драма',rating:8.8,director:'Роберт Земекис',desc:'Простой человек в сложном мире.',why:'Учит простоте, доброте, настойчивости.',lesson:'Жизнь — как коробка шоколадных конфет.'},
{id:'mov_06',title:'Начало',year:2010,genre:'Фантастика',rating:8.8,director:'Кристофер Нолан',desc:'Кража идей из снов. Что реально?',why:'Учит критическому мышлению.',lesson:'Идеи — самый стойкий паразит.'},
{id:'mov_07',title:'Матрица',year:1999,genre:'Фантастика',rating:8.7,director:'Сёстры Вачовски',desc:'Реальность — иллюзия. Выбор — свобода.',why:'Учит сомневаться, выбирать, расти.',lesson:'Ложка не существует.'},
{id:'mov_08',title:'Бойцовский клуб',year:1999,genre:'Драма',rating:8.8,director:'Дэвид Финчер',desc:'Потеря поколения. Бунт против системы.',why:'Учит осознанности.',lesson:'Ты — не твоя работа. Ты — не твои деньги.'},
{id:'mov_09',title:'Интерстеллар',year:2014,genre:'Фантастика',rating:8.7,director:'Кристофер Нолан',desc:'Космос, время, любовь, выживание.',why:'Учит науке, любви, жертве.',lesson:'Любовь — единственное, что мы способны воспринимать вне времени.'},
{id:'mov_10',title:'Леон',year:1994,genre:'Боевик',rating:8.5,director:'Люк Бессон',desc:'Киллер и девочка. Неожиданная дружба.',why:'Учит защите, нежности, выбору.',lesson:'Всегда как в первый раз.'},
{id:'mov_11',title:'Зелёная книга',year:2018,genre:'Драма',rating:8.2,director:'Питер Фаррелли',desc:'Расизм и дружба в 1960-х.',why:'Учит эмпатии.',lesson:'Достоинство выше обстоятельств.'},
{id:'mov_12',title:'1+1 (Неприкасаемые)',year:2011,genre:'Комедия',rating:8.5,director:'Оливье Накаш',desc:'Богатый паралитик и его помощник.',why:'Учит дружбе, юмору, жизни.',lesson:'Жизнь — это не то, что с тобой происходит.'},
{id:'mov_13',title:'Джокер',year:2019,genre:'Драма',rating:8.4,director:'Тодд Филлипс',desc:'Падение человека в безумие.',why:'Учит эмпатии к психическим болезням.',lesson:'Самое страшное — быть никем.'},
{id:'mov_14',title:'Властелин колец',year:2001,genre:'Фэнтези',rating:8.9,director:'Питер Джексон',desc:'Эпическое путешествие в Средиземье.',why:'Учит дружбе, долгу, жертве.',lesson:'Даже самый маленький может изменить будущее.'},
{id:'mov_15',title:'Паразиты',year:2019,genre:'Драма',rating:8.5,director:'Пон Джун Хо',desc:'Бедная семья и богатая. Классовая борьба.',why:'Учит социальной справедливости.',lesson:'Планы — это то, что рушится.'},
{id:'mov_16',title:'Остров проклятых',year:2010,genre:'Триллер',rating:8.2,director:'Мартин Скорсезе',desc:'Расследование в психбольнице.',why:'Учит критическому мышлению.',lesson:'Жить как монстр или умереть как человек?'},
{id:'mov_17',title:'Достать ножи',year:2019,genre:'Детектив',rating:7.9,director:'Райан Джонсон',desc:'Расследование убийства в особняке.',why:'Учит логике, наблюдательности.',lesson:'Детали решают всё.'},
{id:'mov_18',title:'Ла-Ла Ленд',year:2016,genre:'Мюзикл',rating:8.0,director:'Дэмьен Шазелл',desc:'Любовь и мечты в Лос-Анджелесе.',why:'Учит ценить выбор, мечты, любовь.',lesson:'Здесь восходит солнце, они говорят.'},
{id:'mov_19',title:'Она',year:2013,genre:'Фантастика',rating:8.0,director:'Спайк Джонз',desc:'Человек влюбляется в AI.',why:'Учит одиночеству, любви, будущему.',lesson:'Сердце не робот.'},
{id:'mov_20',title:'Социальная сеть',year:2010,genre:'Драма',rating:7.8,director:'Дэвид Финчер',desc:'История создания Facebook.',why:'Учит амбициям, последствиям успеха.',lesson:'Ты не станешь миллиардером, не заведя врагов.'}
];

var SERIES_LIBRARY=[
{id:'ser_01',title:'Во все тяжкие',year:'2008-2013',genre:'Криминал',rating:9.5,seasons:5,desc:'Учитель химии становится наркобароном.',why:'Учит последствиям, морали, трансформации.',lesson:'Я — тот, кто стучится в дверь.'},
{id:'ser_02',title:'Игра престолов',year:'2011-2019',genre:'Фэнтези',rating:9.2,seasons:8,desc:'Борьба за Железный трон.',why:'Учит стратегии, политике, выживанию.',lesson:'Хаос — это лестница.'},
{id:'ser_03',title:'Чернобыль',year:2019,genre:'Драма',rating:9.4,seasons:1,desc:'Катастрофа на ЧАЭС.',why:'Учит ответственности, правде, науке.',lesson:'Что стоит жизнь? Ничего.'},
{id:'ser_04',title:'Мир Дикого Запада',year:'2016-2022',genre:'Фантастика',rating:8.5,seasons:4,desc:'Парк с роботами. Сознание и свобода.',why:'Учит этике AI, свободе воли.',lesson:'Эти насильственные наслаждения не для меня.'},
{id:'ser_05',title:'Очень странные дела',year:'2016-...',genre:'Фантастика',rating:8.7,seasons:4,desc:'Дети против монстров из параллельного мира.',why:'Учит дружбе, смелости, 80-м.',lesson:'Друзья не бросают друзей.'},
{id:'ser_06',title:'Друзья',year:'1994-2004',genre:'Комедия',rating:8.9,seasons:10,desc:'6 друзей в Нью-Йорке.',why:'Учит дружбе, юмору, жизни.',lesson:'Я буду там для тебя.'},
{id:'ser_07',title:'Офис',year:'2005-2013',genre:'Комедия',rating:9.0,seasons:9,desc:'Будни офиса в Скрэнтоне.',why:'Учит юмору, абсурду, человечности.',lesson:'Это то, что она сказала.'},
{id:'ser_08',title:'Клиника',year:'2001-2010',genre:'Комедия',rating:8.7,seasons:9,desc:'Интерны в больнице.',why:'Учит эмпатии, юмору, дружбе.',lesson:'Всё будет хорошо.'},
{id:'ser_09',title:'Шерлок',year:'2010-2017',genre:'Детектив',rating:9.1,seasons:4,desc:'Современный Шерлок Холмс.',why:'Учит логике, наблюдательности.',lesson:'Дедукция — это искусство.'},
{id:'ser_10',title:'Карточный домик',year:'2013-2018',genre:'Драма',rating:8.7,seasons:6,desc:'Политические интриги.',why:'Учит стратегии, манипуляции.',lesson:'Власть — это всё.'},
{id:'ser_11',title:'Рик и Морти',year:'2013-...',genre:'Мультфильм',rating:9.1,seasons:7,desc:'Приключения безумного учёного.',why:'Учит науке, юмору, философии.',lesson:'Wubba lubba dub dub.'},
{id:'ser_12',title:'Атака титанов',year:'2013-2023',genre:'Аниме',rating:9.0,seasons:4,desc:'Люди против титанов.',why:'Учит свободе, жертве, правде.',lesson:'Я просто хочу быть свободным.'},
{id:'ser_13',title:'Тетрадь смерти',year:'2006-2007',genre:'Аниме',rating:8.9,seasons:1,desc:'Тетрадь, убивающая людей.',why:'Учит морали, логике, последствиям.',lesson:'Я стану богом нового мира.'},
{id:'ser_14',title:'Кремниевая долина',year:'2014-2019',genre:'Комедия',rating:8.5,seasons:6,desc:'Стартап в Кремниевой долине.',why:'Учит бизнесу, юмору, технологиям.',lesson:'Делай мир лучше.'},
{id:'ser_15',title:'Медленные лошади',year:'2022-...',genre:'Триллер',rating:8.3,seasons:3,desc:'MI5 и изгнанные агенты.',why:'Учит шпионажу, интригам.',lesson:'Никому не верь.'},
{id:'ser_16',title:'Медведь',year:'2022-...',genre:'Драма',rating:8.6,seasons:3,desc:'Шеф-повар и ресторан.',why:'Учит страсти, командной работе.',lesson:'Yes, chef!'},
{id:'ser_17',title:'Одни из нас',year:'2023-...',genre:'Драма',rating:8.7,seasons:1,desc:'Постапокалипсис. Грибок и люди.',why:'Учит любви, жертве, выживанию.',lesson:'Ты всегда найдёшь что-то, за что стоит бороться.'},
{id:'ser_18',title:'Разделение',year:'2022-...',genre:'Триллер',rating:8.7,seasons:1,desc:'Работа и жизнь разделены в мозге.',why:'Учит балансу, этике работы.',lesson:'Кто ты на самом деле?'},
{id:'ser_19',title:'Прослушка',year:'2002-2008',genre:'Криминал',rating:9.3,seasons:5,desc:'Полиция и улицы Балтимора.',why:'Учит системному мышлению.',lesson:'Игра — это игра.'},
{id:'ser_20',title:'Сопрано',year:'1999-2007',genre:'Криминал',rating:9.2,seasons:6,desc:'Мафия и семья.',why:'Учит психологии, власти.',lesson:'Семья — это всё.'}
];

var BOOKS_LIBRARY=[
{id:'bk_01',title:'1984',author:'Джордж Оруэлл',year:1949,genre:'Антиутопия',rating:9.0,desc:'Тоталитарное общество. Большой Брат следит.',why:'Учит свободе, правде, критическому мышлению.',lesson:'Свобода — это возможность сказать, что дважды два — четыре.'},
{id:'bk_02',title:'Мастер и Маргарита',author:'Михаил Булгаков',year:1967,genre:'Роман',rating:9.2,desc:'Дьявол в Москве. Любовь и мистика.',why:'Учит добру, любви, вере.',lesson:'Рукописи не горят.'},
{id:'bk_03',title:'Преступление и наказание',author:'Фёдор Достоевский',year:1866,genre:'Роман',rating:9.1,desc:'Раскольников и его совесть.',why:'Учит морали, психологии, искуплению.',lesson:'Я хотел стать Наполеоном.'},
{id:'bk_04',title:'Война и мир',author:'Лев Толстой',year:1869,genre:'Роман-эпопея',rating:9.0,desc:'Россия в эпоху Наполеона.',why:'Учит истории, философии, жизни.',lesson:'Нет величия там, где нет простоты.'},
{id:'bk_05',title:'Думай медленно... решай быстро',author:'Даниэль Канеман',year:2011,genre:'Психология',rating:8.8,desc:'2 системы мышления. Иррациональность.',why:'Учит критическому мышлению, решениям.',lesson:'Мы не рациональны.'},
{id:'bk_06',title:'Sapiens',author:'Юваль Ной Харари',year:2011,genre:'История',rating:8.9,desc:'От обезьян до богов.',why:'Учит истории, антропологии, будущему.',lesson:'Мы — единственные животные, верящие в вымысел.'},
{id:'bk_07',title:'Атомные привычки',author:'Джеймс Клир',year:2018,genre:'Саморазвитие',rating:8.7,desc:'Как формировать привычки.',why:'Учит системе, дисциплине.',lesson:'1% лучше каждый день.'},
{id:'bk_08',title:'Думай и богатей',author:'Наполеон Хилл',year:1937,genre:'Саморазвитие',rating:8.5,desc:'Принципы успеха.',why:'Учит мышлению, целям.',lesson:'Что разум может постичь, то он может достичь.'},
{id:'bk_09',title:'7 навыков высокоэффективных людей',author:'Стивен Кови',year:1989,genre:'Саморазвитие',rating:8.6,desc:'7 навыков успеха.',why:'Учит эффективности, принципам.',lesson:'Начинай с конца в уме.'},
{id:'bk_10',title:'Глубокая работа',author:'Кэл Ньюпорт',year:2016,genre:'Продуктивность',rating:8.6,desc:'Фокус в мире отвлечений.',why:'Учит концентрации, Deep Work.',lesson:'Фокус — новая суперсила.'},
{id:'bk_11',title:'Мышление, быстрое и медленное',author:'Даниэль Канеман',year:2011,genre:'Психология',rating:8.8,desc:'Иррациональность решений.',why:'Учит критическому мышлению.',lesson:'Интуиция обманывает.'},
{id:'bk_12',title:'Дюна',author:'Фрэнк Герберт',year:1965,genre:'Фантастика',rating:8.7,desc:'Планета Арракис и пряность.',why:'Учит экологии, политике, религии.',lesson:'Страх — убийца разума.'},
{id:'bk_13',title:'Гарри Поттер',author:'Дж. К. Роулинг',year:'1997-2007',genre:'Фэнтези',rating:9.0,desc:'Мальчик, который выжил.',why:'Учит дружбе, смелости, любви.',lesson:'Счастье можно найти даже в тёмные времена.'},
{id:'bk_14',title:'Властелин колец',author:'Дж. Р. Р. Толкин',year:'1954-1955',genre:'Фэнтези',rating:9.0,desc:'Путешествие в Мордор.',why:'Учит дружбе, долгу, жертве.',lesson:'Даже самый маленький может изменить будущее.'},
{id:'bk_15',title:'Игра в бисер',author:'Герман Гессе',year:1943,genre:'Роман',rating:8.5,desc:'Интеллектуальная утопия.',why:'Учит философии, культуре.',lesson:'Каждое начало — это магия.'},
{id:'bk_16',title:'Тонкое искусство пофигизма',author:'Марк Мэнсон',year:2016,genre:'Саморазвитие',rating:8.0,desc:'Как жить с проблемами.',why:'Учит принятию, ценностям.',lesson:'Проблемы не исчезают. Меняются.'},
{id:'bk_17',title:'Сила воли',author:'Келли Макгонигал',year:2011,genre:'Психология',rating:8.3,desc:'Как развить самоконтроль.',why:'Учит дисциплине, нейробиологии.',lesson:'Сила воли — это мышца.'},
{id:'bk_18',title:'Чёрный лебедь',author:'Нассим Талеб',year:2007,genre:'Философия',rating:8.2,desc:'Непредсказуемость и случайность.',why:'Учит вероятностному мышлению.',lesson:'Мы не знаем того, чего не знаем.'},
{id:'bk_19',title:'Антихрупкость',author:'Нассим Талеб',year:2012,genre:'Философия',rating:8.4,desc:'Как извлекать пользу из хаоса.',why:'Учит устойчивости, росту.',lesson:'Что нас не убивает, делает сильнее.'},
{id:'bk_20',title:'Поток',author:'Михай Чиксентмихайи',year:1990,genre:'Психология',rating:8.6,desc:'Психология оптимального опыта.',why:'Учит фокусу, счастью.',lesson:'Счастье — в потоке.'}
];

var MUSIC_LIBRARY=[
{id:'mus_01',title:'Классика для фокуса',genre:'Классика',desc:'Бах, Моцарт, Бетховен. Для Deep Work.',artists:['Bach','Mozart','Beethoven'],mood:'focus'},
{id:'mus_02',title:'Lo-fi Hip Hop',genre:'Lo-fi',desc:'Расслабление, учёба, работа.',artists:['ChilledCow','Nujabes'],mood:'study'},
{id:'mus_03',title:'Ambient',genre:'Эмбиент',desc:'Фон для медитации.',artists:['Brian Eno','Aphex Twin'],mood:'meditation'},
{id:'mus_04',title:'Джаз',genre:'Джаз',desc:'Miles Davis, Coltrane. Для креатива.',artists:['Miles Davis','John Coltrane'],mood:'creative'},
{id:'mus_05',title:'Рок-классика',genre:'Рок',desc:'Pink Floyd, Led Zeppelin, Queen.',artists:['Pink Floyd','Led Zeppelin','Queen'],mood:'energy'},
{id:'mus_06',title:'Электроника',genre:'EDM',desc:'Для спорта.',artists:['Daft Punk','The Chemical Brothers'],mood:'workout'},
{id:'mus_07',title:'Кинематографичная',genre:'Саундтреки',desc:'Hans Zimmer, Ennio Morricone.',artists:['Hans Zimmer','Ennio Morricone'],mood:'inspiration'},
{id:'mus_08',title:'Nature Sounds',genre:'Природа',desc:'Дождь, океан, лес. Для сна.',artists:['Nature','Rain Sounds'],mood:'sleep'},
{id:'mus_09',title:'Классический рок',genre:'Рок',desc:'The Beatles, The Rolling Stones.',artists:['The Beatles','The Rolling Stones'],mood:'nostalgia'},
{id:'mus_10',title:'World Music',genre:'Мир',desc:'Разные культуры.',artists:['Ravi Shankar','Youssou N\'Dour'],mood:'exploration'}
];

var GAMES_LIBRARY=[
{id:'gm_01',title:'The Witcher 3',genre:'RPG',rating:9.8,desc:'Ведьмак Геральт и его приключения.',why:'Сюжет, моральные выборы, мир.',time:'100+ часов'},
{id:'gm_02',title:'Red Dead Redemption 2',genre:'Action',rating:9.7,desc:'Вестерн. Артур Морган.',why:'История, эмоции, открытый мир.',time:'60+ часов'},
{id:'gm_03',title:'The Last of Us',genre:'Action',rating:9.5,desc:'Постапокалипсис. Джоэл и Элли.',why:'Эмоции, сюжет.',time:'15 часов'},
{id:'gm_04',title:'God of War',genre:'Action',rating:9.5,desc:'Кратос и его сын.',why:'Сюжет, боевая система.',time:'25 часов'},
{id:'gm_05',title:'Elden Ring',genre:'Souls-like',rating:9.6,desc:'Открытый мир от FromSoftware.',why:'Сложность, исследование.',time:'80+ часов'},
{id:'gm_06',title:'Portal 2',genre:'Puzzle',rating:9.5,desc:'Головоломки с порталами.',why:'Логика, юмор.',time:'10 часов'},
{id:'gm_07',title:'Hollow Knight',genre:'Metroidvania',rating:9.4,desc:'Метроидвания в мире насекомых.',why:'Атмосфера, сложность.',time:'30 часов'},
{id:'gm_08',title:'Celeste',genre:'Platformer',rating:9.3,desc:'Платформер о тревоге.',why:'Сложность, история.',time:'10 часов'},
{id:'gm_09',title:'Stardew Valley',genre:'Simulation',rating:9.2,desc:'Ферма, отношения, жизнь.',why:'Расслабление, рутина.',time:'50+ часов'},
{id:'gm_10',title:'Baldur\'s Gate 3',genre:'RPG',rating:9.7,desc:'D&D в цифре.',why:'Свобода, сюжет, тактика.',time:'100+ часов'},
{id:'gm_11',title:'Disco Elysium',genre:'RPG',rating:9.5,desc:'Детектив с философией.',why:'Текст, философия.',time:'30 часов'},
{id:'gm_12',title:'Hades',genre:'Roguelike',rating:9.3,desc:'Побег из подземного мира.',why:'Боевая система, сюжет.',time:'30 часов'}
];

var PODCASTS_LIBRARY=[
{id:'pod_01',title:'Huberman Lab',author:'Andrew Huberman',genre:'Нейробиология',desc:'Наука о мозге, сне, фокусе.',why:'Научный подход к здоровью.',episodes:'200+'},
{id:'pod_02',title:'Lex Fridman Podcast',author:'Lex Fridman',genre:'Наука/Философия',desc:'Интервью с учёными.',why:'Глубокие разговоры.',episodes:'400+'},
{id:'pod_03',title:'The Tim Ferriss Show',author:'Tim Ferriss',genre:'Продуктивность',desc:'Интервью с успешными людьми.',why:'Практические советы.',episodes:'700+'},
{id:'pod_04',title:'Naval',author:'Naval Ravikant',genre:'Философия',desc:'О богатстве и счастье.',why:'Мудрость.',episodes:'50+'},
{id:'pod_05',title:'Deep Dive with Ali Abdaal',author:'Ali Abdaal',genre:'Продуктивность',desc:'Продуктивность и жизнь.',why:'Практика.',episodes:'100+'},
{id:'pod_06',title:'Modern Wisdom',author:'Chris Williamson',genre:'Саморазвитие',desc:'Психология и философия.',why:'Идеи.',episodes:'500+'},
{id:'pod_07',title:'The Diary of a CEO',author:'Steven Bartlett',genre:'Бизнес',desc:'Интервью с предпринимателями.',why:'Бизнес-идеи.',episodes:'200+'},
{id:'pod_08',title:'On Purpose',author:'Jay Shetty',genre:'Саморазвитие',desc:'Мудрость и смысл.',why:'Мотивация.',episodes:'400+'},
{id:'pod_09',title:'6 Minute English',author:'BBC',genre:'Английский',desc:'6 минут английского.',why:'Учит язык.',episodes:'1000+'},
{id:'pod_10',title:'All Ears English',author:'Lindsay McMahon',genre:'Английский',desc:'Разговорный английский.',why:'Практика.',episodes:'1000+'}
];

var THEATER_LIBRARY=[
{id:'th_01',title:'Гамлет',author:'Шекспир',genre:'Трагедия',desc:'Принц Датский и месть.',why:'Философия, психология.'},
{id:'th_02',title:'Ромео и Джульетта',author:'Шекспир',genre:'Трагедия',desc:'Любовь и вражда.',why:'Любовь, судьба.'},
{id:'th_03',title:'Чайка',author:'Чехов',genre:'Драма',desc:'Жизнь и искусство.',why:'Психология, искусство.'},
{id:'th_04',title:'Три сестры',author:'Чехов',genre:'Драма',desc:'Мечты и реальность.',why:'Экзистенциализм.'},
{id:'th_05',title:'Вишнёвый сад',author:'Чехов',genre:'Драма',desc:'Прощание с прошлым.',why:'Время, изменения.'},
{id:'th_06',title:'На дне',author:'Горький',genre:'Драма',desc:'Люди на дне жизни.',why:'Социальная драма.'},
{id:'th_07',title:'Ревизор',author:'Гоголь',genre:'Комедия',desc:'Ложный ревизор.',why:'Сатира, юмор.'},
{id:'th_08',title:'Горе от ума',author:'Грибоедов',genre:'Комедия',desc:'Чацкий и общество.',why:'Сатира, ум.'}
];

var ART_LIBRARY=[
{id:'art_01',title:'Мона Лиза',author:'Леонардо да Винчи',year:1503,genre:'Живопись',desc:'Улыбка Джоконды.',why:'Загадка, техника.'},
{id:'art_02',title:'Звёздная ночь',author:'Винсент ван Гог',year:1889,genre:'Постимпрессионизм',desc:'Ночное небо.',why:'Эмоции, цвет.'},
{id:'art_03',title:'Крик',author:'Эдвард Мунк',year:1893,genre:'Экспрессионизм',desc:'Крик природы.',why:'Тревога, эмоции.'},
{id:'art_04',title:'Герника',author:'Пабло Пикассо',year:1937,genre:'Кубизм',desc:'Ужасы войны.',why:'Антивоенное искусство.'},
{id:'art_05',title:'Девушка с жемчужной серёжкой',author:'Ян Вермеер',year:1665,genre:'Барокко',desc:'Голландская девушка.',why:'Свет, детали.'},
{id:'art_06',title:'Тайная вечеря',author:'Леонардо да Винчи',year:1498,genre:'Ренессанс',desc:'Последний ужин Христа.',why:'Композиция, символизм.'},
{id:'art_07',title:'Сикстинская капелла',author:'Микеланджело',year:1512,genre:'Ренессанс',desc:'Фрески Ватикана.',why:'Масштаб, мастерство.'},
{id:'art_08',title:'Постоянство памяти',author:'Сальвадор Дали',year:1931,genre:'Сюрреализм',desc:'Текущие часы.',why:'Время, сюрреализм.'},
{id:'art_09',title:'Чёрный квадрат',author:'Казимир Малевич',year:1915,genre:'Супрематизм',desc:'Конец старого искусства.',why:'Абстракция, манифест.'},
{id:'art_10',title:'Девятый вал',author:'Иван Айвазовский',year:1850,genre:'Маринизм',desc:'Море и люди.',why:'Романтизм, природа.'}
];

function getRandomMovie(){return MOVIES_LIBRARY[Math.floor(Math.random()*MOVIES_LIBRARY.length)]}
function getRandomSeries(){return SERIES_LIBRARY[Math.floor(Math.random()*SERIES_LIBRARY.length)]}
function getRandomBook(){return BOOKS_LIBRARY[Math.floor(Math.random()*BOOKS_LIBRARY.length)]}
function getRandomGame(){return GAMES_LIBRARY[Math.floor(Math.random()*GAMES_LIBRARY.length)]}
function getRandomPodcast(){return PODCASTS_LIBRARY[Math.floor(Math.random()*PODCASTS_LIBRARY.length)]}
function searchMovies(query){var q=query.toLowerCase();return MOVIES_LIBRARY.filter(function(m){return m.title.toLowerCase().indexOf(q)>=0||m.genre.toLowerCase().indexOf(q)>=0||m.director.toLowerCase().indexOf(q)>=0})}
function searchBooks(query){var q=query.toLowerCase();return BOOKS_LIBRARY.filter(function(b){return b.title.toLowerCase().indexOf(q)>=0||b.author.toLowerCase().indexOf(q)>=0||b.genre.toLowerCase().indexOf(q)>=0})}
function filterByGenre(list,genre){return list.filter(function(i){return i.genre===genre})}
function getTopRated(list,minRating){return list.filter(function(i){return i.rating>=(minRating||8.5)}).sort(function(a,b){return b.rating-a.rating})}
function addToWatchlist(item,type){if(!state.watchlist)state.watchlist=[];var exists=state.watchlist.some(function(w){return w.id===item.id});if(exists){if(typeof toast==='function')toast('Уже в списке','warning');return false}state.watchlist.push({id:item.id,title:item.title,type:type,added_at:new Date().toISOString(),status:'planned'});if(typeof save==='function')save();if(typeof toast==='function')toast('Добавлено в список','success');return true}
function markAsWatched(itemId,rating,notes){if(!state.watched)state.watched=[];var item=(state.watchlist||[]).find(function(w){return w.id===itemId});if(!item)return false;state.watched.push({id:itemId,title:item.title,type:item.type,rating:rating||0,notes:notes||'',watched_at:new Date().toISOString()});state.watchlist=state.watchlist.filter(function(w){return w.id!==itemId});if(typeof save==='function')save();if(typeof toast==='function')toast('Отмечено как просмотрено','success');return true}
function getRecommendations(mood){var recs={};if(mood==='focus'){recs.music=MUSIC_LIBRARY.filter(function(m){return m.mood==='focus'});recs.podcasts=PODCASTS_LIBRARY.slice(0,3)}else if(mood==='relax'){recs.movies=MOVIES_LIBRARY.filter(function(m){return m.genre==='Комедия'||m.genre==='Драма'}).slice(0,3);recs.music=MUSIC_LIBRARY.filter(function(m){return m.mood==='meditation'})}else if(mood==='learn'){recs.books=BOOKS_LIBRARY.filter(function(b){return b.genre==='Саморазвитие'||b.genre==='Психология'}).slice(0,3);recs.podcasts=PODCASTS_LIBRARY.filter(function(p){return p.genre==='Нейробиология'})}else if(mood==='inspire'){recs.movies=MOVIES_LIBRARY.filter(function(m){return m.rating>=8.8}).slice(0,3);recs.books=BOOKS_LIBRARY.filter(function(b){return b.rating>=8.8}).slice(0,3)}return recs}
function getEntertainmentStats(){var stats={movies_watched:(state.watched||[]).filter(function(w){return w.type==='movie'}).length,series_watched:(state.watched||[]).filter(function(w){return w.type==='series'}).length,books_read:(state.watched||[]).filter(function(w){return w.type==='book'}).length,games_played:(state.watched||[]).filter(function(w){return w.type==='game'}).length,avg_rating:0,total:(state.watched||[]).length,watchlist:(state.watchlist||[]).length};var ratings=(state.watched||[]).filter(function(w){return w.rating>0});if(ratings.length>0){stats.avg_rating=Math.round(ratings.reduce(function(a,w){return a+w.rating},0)/ratings.length*10)/10}return stats}

window.__MOVIES_LIBRARY=MOVIES_LIBRARY;
window.__SERIES_LIBRARY=SERIES_LIBRARY;
window.__BOOKS_LIBRARY=BOOKS_LIBRARY;
window.__MUSIC_LIBRARY=MUSIC_LIBRARY;
window.__GAMES_LIBRARY=GAMES_LIBRARY;
window.__PODCASTS_LIBRARY=PODCASTS_LIBRARY;
window.__THEATER_LIBRARY=THEATER_LIBRARY;
window.__ART_LIBRARY=ART_LIBRARY;
window.__getRandomMovie=getRandomMovie;
window.__getRandomSeries=getRandomSeries;
window.__getRandomBook=getRandomBook;
window.__getRandomGame=getRandomGame;
window.__getRandomPodcast=getRandomPodcast;
window.__searchMovies=searchMovies;
window.__searchBooks=searchBooks;
window.__filterByGenre=filterByGenre;
window.__getTopRated=getTopRated;
window.__addToWatchlist=addToWatchlist;
window.__markAsWatched=markAsWatched;
window.__getRecommendations=getRecommendations;
window.__getEntertainmentStats=getEntertainmentStats;