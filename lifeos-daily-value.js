/* LIFEOS Daily Value Loop — immediate, varied offline actions */
(function(){
'use strict';
var KEY='lifeos_daily_value_v1';
var TASKS=[
{id:'js-output',cat:'Программирование',time:7,title:'Пойми одну команду JavaScript',body:'Открой урок с нуля и разберись, что делает console.log(). Измени текст вывода и объясни результат своими словами.',win:'Ты понимаешь одну реальную команду, а не просто прочитал теорию.'},
{id:'py-variable',cat:'Программирование',time:8,title:'Создай первую переменную',body:'Разбери пример name = "Егор" и придумай ещё две переменные. Предскажи, что выведет программа.',win:'Ты закрепил базовую конструкцию Python.'},
{id:'debug',cat:'Программирование',time:10,title:'Найди одну ошибку в коде',body:'Возьми небольшой знакомый пример, намеренно измени один символ и выясни, почему результат изменился.',win:'Практика чтения ошибок и отладки.'},
{id:'school-hard',cat:'Учёба',time:12,title:'Закрой самый неприятный учебный вопрос',body:'Выбери один вопрос из школы. Найди объяснение, запиши ответ в 3–5 предложениях и проверь себя без подсказки.',win:'Один конкретный пробел закрыт сегодня.'},
{id:'active-recall',cat:'Учёба',time:6,title:'Вспомни без подсказок',body:'Закрой конспект. Запиши 5 фактов по последней изученной теме, затем открой материал и проверь точность.',win:'Проверил реальное запоминание, а не знакомость текста.'},
{id:'teach-back',cat:'Учёба',time:8,title:'Объясни сложное простыми словами',body:'Выбери одну тему и объясни её так, будто рассказываешь новичку. Если застрял — найди именно этот пробел.',win:'Понимание стало глубже.'},
{id:'focus-sprint',cat:'Фокус',time:10,title:'Один короткий спринт без переключений',body:'Выбери одну задачу. На 10 минут убери лишние вкладки и уведомления. Не пытайся сделать всё — только следующий шаг.',win:'Получил измеримый кусок результата.'},
{id:'phone-reset',cat:'Фокус',time:5,title:'Убери одну цифровую ловушку',body:'Закрой развлекательные вкладки, отключи одно ненужное уведомление или убери ярлык, который отвлекает.',win:'Снизил один конкретный источник отвлечения.'},
{id:'desk-reset',cat:'Фокус',time:5,title:'Подготовь рабочее место',body:'Убери со стола лишнее, открой только нужные материалы и запиши одну задачу, с которой продолжишь.',win:'Начать работу стало проще.'},
{id:'plan-one',cat:'Планирование',time:5,title:'Определи главный результат дня',body:'Запиши один результат, который действительно сделает сегодняшний день полезнее. Разбей его на первый шаг до 10 минут.',win:'Есть ясный следующий шаг вместо длинного списка.'},
{id:'tomorrow',cat:'Планирование',time:7,title:'Подготовь завтрашний старт',body:'Выбери одну главную задачу на завтра, подготовь нужный файл или материалы и укажи время начала.',win:'Завтра будет легче начать.'},
{id:'finish-loop',cat:'Планирование',time:6,title:'Закрой одну незавершённую мелочь',body:'Выбери дело, которое занимает не больше 6 минут: ответить, сохранить, убрать, уточнить или отправить.',win:'Снял один открытый цикл с внимания.'},
{id:'explain',cat:'Коммуникация',time:8,title:'Сформулируй мысль ясно',body:'Возьми одну свою идею и изложи её по схеме: тезис → причина → пример. Убери лишние слова.',win:'Тренировка ясного мышления и речи.'},
{id:'question',cat:'Коммуникация',time:5,title:'Задай один сильный вопрос',body:'В текущей задаче найди неизвестное. Сформулируй вопрос, ответ на который позволит принять следующее решение.',win:'Перешёл от догадок к проверяемой информации.'},
{id:'english',cat:'Языки',time:8,title:'Используй 5 английских фраз',body:'Выбери одну знакомую тему, составь 5 собственных предложений и произнеси их вслух. Не копируй готовый текст.',win:'Язык применён, а не просто просмотрен.'},
{id:'vocab',cat:'Языки',time:6,title:'Закрепи 3 слова в контексте',body:'Выбери 3 слова, составь с каждым своё предложение и попробуй вспомнить перевод через пару минут.',win:'Слова связаны с реальным контекстом.'},
{id:'memory',cat:'Память',time:6,title:'Тренировка памяти без повторного чтения',body:'Посмотри на 7 предметов вокруг на 20 секунд, отвернись и перечисли их. Затем проверь себя.',win:'Получил короткую измеримую тренировку внимания и памяти.'},
{id:'observe',cat:'Мышление',time:7,title:'Отдели факт от предположения',body:'Возьми одно утверждение, в которое сейчас веришь. Запиши отдельно наблюдаемый факт, свою интерпретацию и способ проверки.',win:'Одно решение стало более обоснованным.'},
{id:'decision',cat:'Мышление',time:8,title:'Прими маленькое решение по критериям',body:'Определи цель, два критерия и два варианта. Выбери вариант и запиши, по какому признаку проверишь результат.',win:'Практика стратегического выбора.'},
{id:'create',cat:'Создание',time:12,title:'Создай маленький законченный результат',body:'Сделай мини-артефакт: схему, заметку, фрагмент кода, карточку или короткий конспект. Сохрани его.',win:'Есть созданный результат, который можно использовать.'},
{id:'project',cat:'Проект',time:10,title:'Продвинь один реальный проект',body:'Выбери проект и найди действие, которое можно завершить за 10 минут. Сделай его, а не расширяй список идей.',win:'Проект сдвинулся на один проверяемый шаг.'},
{id:'review',cat:'Рефлексия',time:5,title:'Зафиксируй сегодняшний прогресс',body:'Запиши: что сделал, что узнал и какой следующий шаг. Укажи только факты, без оценки себя.',win:'Прогресс виден и помогает продолжить.'},
{id:'gratitude',cat:'Восстановление',time:3,title:'Заметь, что уже получилось',body:'Назови один конкретный результат за сегодня и одну вещь, которая помогла его получить.',win:'Подкрепил полезное поведение конкретным фактом.'},
{id:'walk',cat:'Восстановление',time:10,title:'Сделай короткую прогулку',body:'Пройдись в комфортном темпе, по возможности без видео и ленты. Не нужно превращать прогулку в тренировку.',win:'Переключился и сменил обстановку.'},
{id:'screen-break',cat:'Самочувствие',time:2,title:'Дай глазам паузу от близкого экрана',body:'Отведи взгляд от экрана, посмотри вдаль на комфортное расстояние и спокойно поморгай. Не дави на глаза и не пытайся упражнениями исправить близорукость.',win:'Короткая пауза снижает непрерывную экранную нагрузку; это не лечение зрения.'},
{id:'water',cat:'Самочувствие',time:2,title:'Проверь базовые потребности',body:'Оцени, не хочется ли пить, размяться или сменить позу. Выбери только то, что действительно нужно сейчас.',win:'Отреагировал на актуальную потребность.'},
{id:'stretch',cat:'Самочувствие',time:4,title:'Смени позу и немного подвигайся',body:'Встань, спокойно разомни плечи и пройдись. Прекрати, если появляется боль или головокружение.',win:'Сделал короткий перерыв от неподвижной работы.'},
{id:'help',cat:'Отношения',time:5,title:'Сделай одно полезное действие для другого',body:'Помоги с небольшим делом, уточни как дела или объясни то, что человеку сейчас непонятно.',win:'Полезное действие вышло за пределы приложения.'},
{id:'curiosity',cat:'Любознательность',time:8,title:'Разберись в одном вопросе, который давно интересен',body:'Сформулируй вопрос, найди надёжный ответ и запиши вывод своими словами вместе с источником.',win:'Любопытство превратилось в знание.'},
{id:'organize',cat:'Порядок',time:5,title:'Упрости одну повторяющуюся мелочь',body:'Убери лишний шаг в привычном процессе: создай шаблон, разложи файлы или подготовь нужный материал заранее.',win:'Следующее выполнение станет проще.'},
{id:'resilience',cat:'Мышление',time:6,title:'Найди самый маленький шаг после ошибки',body:'Вспомни недавнюю ошибку без самокритики. Что именно произошло, что можно исправить и какой шаг сделать сейчас?',win:'Ошибка превращена в план действия.'},
{id:'read',cat:'Чтение',time:10,title:'Прочитай 2–3 страницы с вопросом',body:'Перед чтением сформулируй вопрос. После — ответь по памяти и запиши одну мысль, которую применишь.',win:'Чтение завершилось извлечённой пользой.'},
{id:'teach-code',cat:'Программирование',time:10,title:'Объясни одну строку кода',body:'Выбери одну строку из своего проекта. Разбери каждую часть и напиши комментарий своими словами.',win:'Код стал понятнее, а не просто скопирован.'},
{id:'math-step',cat:'Математика',time:10,title:'Разбери одну математическую задачу',body:'Выбери задачу подходящего уровня. Запиши, что дано, что требуется найти и первый шаг решения. После решения проверь ответ обратной подстановкой или оценкой.',win:'Одна задача решена с понятным ходом рассуждений.'},
{id:'mini-win',cat:'Действие',time:5,title:'Сделай то, что откладываешь меньше недели',body:'Выбери безопасное маленькое дело, которое занимает до 5 минут. Выполни его сразу и закрой.',win:'Сократил прокрастинацию конкретным действием.'}
];
function dateKey(d){var x=d||new Date();return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0');}
function read(){try{var s=JSON.parse(localStorage.getItem(KEY)||'{}');return s&&typeof s==='object'?s:{};}catch(e){return {};}}
function write(s){try{localStorage.setItem(KEY,JSON.stringify(s));}catch(e){}}
function dayDiff(a,b){return Math.round((new Date(b+'T12:00:00')-new Date(a+'T12:00:00'))/86400000);}
function hash(s){var h=0;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h);}
function choose(s,exclude){
 var today=dateKey(),recent=(s.history||[]).filter(function(x){return dayDiff(x.date,today)>=0&&dayDiff(x.date,today)<14;}).map(function(x){return x.id;});
 var blocked=recent.concat(exclude||[]),start=hash(today)%TASKS.length;
 for(var i=0;i<TASKS.length;i++){var t=TASKS[(start+i)%TASKS.length];if(blocked.indexOf(t.id)<0)return t;}
 return TASKS[(start+(exclude||[]).length)%TASKS.length];
}
function mount(){
 if(document.getElementById('lifeDailyLauncher'))return;
 var s=read(),today=dateKey();
 if(s.date!==today){s.history=s.history||[];if(s.date&&s.taskId)s.history.push({date:s.date,id:s.taskId});s.history=s.history.slice(-90);s.date=today;s.taskId=choose(s,[]).id;s.shown=[];s.done=false;write(s);}
 var style=document.createElement('style');style.textContent='#lifeDailyLauncher{position:fixed;z-index:900;right:14px;bottom:calc(92px + env(safe-area-inset-bottom,0px));border:1px solid rgba(120,170,255,.45);border-radius:999px;padding:11px 15px;background:linear-gradient(135deg,#2456a5,#5738a4);color:#fff;font:600 13px system-ui;box-shadow:0 8px 28px #0008;cursor:pointer}#lifeDailyPanel{position:fixed;z-index:1200;inset:0;background:#0009;display:none;align-items:flex-end;justify-content:center;padding:12px 12px calc(12px + env(safe-area-inset-bottom,0px));font-family:system-ui;color:#fff}#lifeDailyPanel.open{display:flex}#lifeDailyPanel .ld-card{width:min(100%,520px);max-height:86vh;overflow:auto;border:1px solid #ffffff2b;border-radius:26px;background:linear-gradient(155deg,#17243b,#151525 70%);padding:20px;box-shadow:0 20px 70px #000a}#lifeDailyPanel .ld-top{display:flex;justify-content:space-between;align-items:center;gap:12px}#lifeDailyPanel .ld-muted{color:#b9c6db;font-size:12px}#lifeDailyPanel h2{font-size:21px;line-height:1.2;margin:12px 0 8px}#lifeDailyPanel .ld-body{font-size:14px;line-height:1.55;color:#e0e8f5}#lifeDailyPanel .ld-win{margin:13px 0;padding:11px 12px;border-radius:14px;background:#ffffff0c;color:#cfe4ff;font-size:13px}#lifeDailyPanel .ld-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}#lifeDailyPanel button{border:1px solid #ffffff30;border-radius:13px;padding:11px 13px;background:#ffffff12;color:#fff;font-weight:600;font-size:13px}#lifeDailyPanel button.primary{background:#3978d7;border-color:#5795f0;flex:1}#lifeDailyPanel button:disabled{opacity:.55}#lifeDailyPanel .ld-stats{display:flex;gap:8px;margin-top:14px}#lifeDailyPanel .ld-stat{flex:1;border-radius:13px;background:#ffffff0d;padding:10px;font-size:12px;color:#c5d2e5}#lifeDailyPanel .ld-stat b{display:block;color:white;font-size:19px}#lifeDailyPanel .ld-quick{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px}#lifeDailyPanel .ld-quick button{text-align:left;line-height:1.4}#lifeDailyPanel .ld-quick small{display:block;color:#b9c6db;font-weight:400}';document.head.appendChild(style);
 var launch=document.createElement('button');launch.id='lifeDailyLauncher';launch.type='button';launch.textContent='⚡ Польза сейчас';launch.setAttribute('aria-label','Открыть ежедневную пользу');document.body.appendChild(launch);
 var panel=document.createElement('div');panel.id='lifeDailyPanel';panel.innerHTML='<section class="ld-card" role="dialog" aria-modal="true" aria-labelledby="ldTitle"><div class="ld-top"><div><div class="ld-muted">LIFEOS · ТВОЙ СЕГОДНЯШНИЙ ШАГ</div><div class="ld-muted" id="ldDate"></div></div><button type="button" id="ldClose" aria-label="Закрыть">✕</button></div><div class="ld-stats"><div class="ld-stat"><b id="ldCount">0</b>дней с пользой</div><div class="ld-stat"><b id="ldToday">—</b>сегодня</div></div><div id="ldTask"></div><div class="ld-actions"><button class="primary" id="ldDone">✓ Сохранить результат</button><button id="ldNext">Не подходит · другое</button></div><div class="ld-muted" style="margin-top:18px">Быстрые действия · без длинных курсов</div><div class="ld-quick"><button id="ldFocus">🎯 Фокус 10 минут<small>Один результат без переключений</small></button><button id="ldReflect">🧠 Разобрать проблему<small>Факт → причина → шаг</small></button></div></section>';document.body.appendChild(panel);
 function taskById(id){return TASKS.find(function(t){return t.id===id;})||TASKS[0];}
 function render(){
  s=read();if(s.date!==dateKey()){s.history=s.history||[];if(s.date&&s.taskId)s.history.push({date:s.date,id:s.taskId});s.history=s.history.slice(-90);s.date=dateKey();s.taskId=choose(s,[]).id;s.shown=[];s.done=false;write(s);}
  var t=taskById(s.taskId);document.getElementById('ldDate').textContent=new Date().toLocaleDateString('ru-RU',{weekday:'long',day:'numeric',month:'long'});
  document.getElementById('ldCount').textContent=(s.completedDates||[]).length;document.getElementById('ldToday').textContent=s.done?'Готово':'Не обязательно';
  document.getElementById('ldTask').innerHTML='<div class="ld-muted" style="margin-top:19px">'+t.cat+' · '+t.time+' минут</div><h2 id="ldTitle">'+t.title+'</h2><div class="ld-body">'+t.body+'</div><div class="ld-win">✦ Результат: '+t.win+'</div>';
  document.getElementById('ldDone').disabled=!!s.done;document.getElementById('ldDone').textContent=s.done?'✓ Результат сохранён':'✓ Сохранить результат';
 }
 launch.addEventListener('click',function(){render();panel.classList.add('open');});
 document.getElementById('ldClose').addEventListener('click',function(){panel.classList.remove('open');});
 panel.addEventListener('click',function(e){if(e.target===panel)panel.classList.remove('open');});
 document.getElementById('ldDone').addEventListener('click',function(){
  s=read();if(s.done)return;s.done=true;s.completedDates=s.completedDates||[];if(s.completedDates.indexOf(dateKey())<0)s.completedDates.push(dateKey());s.history=s.history||[];s.history.push({date:dateKey(),id:s.taskId});s.history=s.history.slice(-90);s.completedDates=s.completedDates.slice(-365);write(s);render();
 });
 document.getElementById('ldNext').addEventListener('click',function(){s=read();var t=choose(s,(s.shown||[]).concat([s.taskId]));s.shown=(s.shown||[]).concat([s.taskId]);s.taskId=t.id;write(s);render();});
 document.getElementById('ldFocus').addEventListener('click',function(){s=read();var t=TASKS.find(function(x){return x.id==='focus-sprint';});s.taskId=t.id;s.shown=(s.shown||[]).concat([s.taskId]);write(s);render();});
 document.getElementById('ldReflect').addEventListener('click',function(){s=read();var t=TASKS.find(function(x){return x.id==='observe';});s.taskId=t.id;s.shown=(s.shown||[]).concat([s.taskId]);write(s);render();});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
