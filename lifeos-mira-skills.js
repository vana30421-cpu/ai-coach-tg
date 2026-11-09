/* LIFEOS Mira-inspired skill catalog — local-first, additive */
(function(root){
'use strict';
var skills=[
{id:'briefing',icon:'🌅',name:'Ежедневная сводка',group:'Продуктивность',desc:'Приоритеты, задачи, календарь и состояние за день',page:'jarvis',prompt:'Составь короткую ежедневную сводку по моим данным LIFEOS: приоритеты, задачи, привычки, календарь, обучение и один следующий шаг.'},
{id:'task-manager',icon:'✅',name:'Менеджер задач',group:'Продуктивность',desc:'Разбор поручений, сроки и следующие действия',page:'tasks',prompt:'Разбери мои активные задачи: выдели 3 главных приоритета, просрочки и конкретный следующий шаг.'},
{id:'habit-coach',icon:'🔥',name:'Трекер привычек',group:'Продуктивность',desc:'Регулярность, серии и мягкая корректировка',page:'habitList',prompt:'Проанализируй мои привычки по данным LIFEOS и предложи одно небольшое улучшение без перегруза.'},
{id:'meeting-prep',icon:'📅',name:'Подготовка ко встрече',group:'Продуктивность',desc:'План встречи и список вопросов по календарю',page:'schedule',prompt:'Подготовь меня к ближайшим событиям из моего календаря: цель, вопросы и что подготовить.'},
{id:'motivation',icon:'⚡',name:'Персональная мотивация',group:'Саморазвитие',desc:'Короткий импульс на основе текущих целей',page:'jarvis',prompt:'Дай персональную мотивацию на сегодня, опираясь на мои цели и прогресс LIFEOS. Без общих фраз — одно действие на 10 минут.'},
{id:'memory',icon:'🧠',name:'Тренер памяти',group:'Обучение',desc:'Рабочая, кратковременная и долговременная память',page:'memory',prompt:'Составь тренировку памяти на 10 минут с измерением точности и постепенным усложнением.'},
{id:'language',icon:'🗣️',name:'Языковой репетитор',group:'Обучение',desc:'Практика диалога, исправления и интервальное повторение',page:'english',prompt:'Проведи со мной короткий урок английского: сначала проверь уровень одним заданием, затем адаптируй сложность и исправляй ошибки.'},
{id:'study',icon:'🎓',name:'Учебный наставник',group:'Обучение',desc:'Объяснение, проверка знаний и план повторения',page:'learning',prompt:'Стань моим преподавателем: объясняй тему короткими шагами, проверяй понимание вопросами и подбирай следующее упражнение.'},
{id:'fitness',icon:'🏋️',name:'Фитнес-наставник',group:'Здоровье',desc:'План тренировок и отслеживание выполнения',page:'workouts',prompt:'Помоги составить безопасный план физической активности с постепенной нагрузкой и учётом моих записей LIFEOS.'},
{id:'sleep',icon:'🌙',name:'Анализ сна',group:'Здоровье',desc:'Динамика сна и привычки восстановления',page:'sleep',prompt:'Проанализируй только записанные данные сна в LIFEOS. Покажи тенденции, пробелы и одно реалистичное изменение.'},
{id:'stress',icon:'🌿',name:'Антистресс-помощник',group:'Здоровье',desc:'Короткие практики саморегуляции и дневник',page:'antistress',prompt:'Подбери короткую практику саморегуляции на 2–5 минут и объясни, как оценить её эффект.'},
{id:'nutrition',icon:'🥗',name:'Планировщик питания',group:'Здоровье',desc:'Идеи меню и список продуктов',page:'health',prompt:'Помоги составить простой сбалансированный план питания на день и список продуктов. Сначала уточни ограничения, если они критичны.'},
{id:'second-brain',icon:'📚',name:'Секретарь второго мозга',group:'Знания',desc:'Структурирование заметок, идей и ссылок',page:'obsidian',prompt:'Помоги структурировать новую идею для второго мозга: заголовок, краткое содержание, теги, связи и следующий шаг.'},
{id:'weekly-review',icon:'📈',name:'Еженедельный обзор',group:'Аналитика',desc:'Итоги, прогресс, узкие места и план недели',page:'weeklyReview',prompt:'Сделай еженедельный обзор по сохранённым данным LIFEOS: достижения, незавершённое, динамика, ограничения данных и 3 приоритета следующей недели.'},
{id:'metrics',icon:'📊',name:'Мониторинг показателей',group:'Аналитика',desc:'Тренды статистики и качество данных',page:'stats',prompt:'Разбери мою статистику LIFEOS: сравни доступные периоды, отдели реальные изменения от недостатка записей и предложи действия.'},
{id:'screen',icon:'📱',name:'Цифровой баланс',group:'Аналитика',desc:'Экранное время и цифровые привычки',page:'screentracker',prompt:'Проанализируй мои записи экранного времени и предложи реалистичный план цифрового баланса.'},
{id:'projects',icon:'🗂️',name:'Координатор проектов',group:'Работа',desc:'Статусы, блокеры и ближайшие шаги',page:'projects',prompt:'Проанализируй мои проекты LIFEOS: покажи зависшие задачи, блокеры и следующие конкретные шаги.'},
{id:'finance',icon:'💰',name:'Финансовый обзор',group:'Работа',desc:'Сводка записей доходов и расходов',page:'finance',prompt:'Сделай обзор только тех финансовых записей, которые сохранены в LIFEOS. Не додумывай отсутствующие суммы.'}
];
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function render(){
 var groups={},html='<section class="card mt-3" id="miraSkills"><div class="row-between"><div><div class="card-title">✦ Навыки LIFEOS · Mira-inspired</div><div class="footnote">Готовые сценарии. Навык использует данные LIFEOS и доступные разделы.</div></div><span class="badge badge-brand">'+skills.length+' навыков</span></div>';
 skills.forEach(function(s){(groups[s.group]||(groups[s.group]=[])).push(s);});
 Object.keys(groups).forEach(function(group){
  html+='<div class="section-title mt-3">'+esc(group)+'</div><div class="grid-2">';
  groups[group].forEach(function(s){
   html+='<button type="button" class="card" style="text-align:left;min-width:0" onclick="runLifeOSMiraSkill(\''+s.id+'\')"><div style="font-size:24px">'+s.icon+'</div><b>'+esc(s.name)+'</b><div class="footnote">'+esc(s.desc)+'</div></button>';
  });
  html+='</div>';
 });
 html+='<div class="footnote mt-2">Внешние сервисы (почта, GitHub, Notion и другие) подключаются отдельно через OAuth и серверные разрешения; этот каталог не имитирует подключение.</div></section>';
 return html;
}
function run(id){
 var skill=skills.find(function(s){return s.id===id;});if(!skill)return;
 try{
  var st=root.state;if(st){if(!st.miraSkills||typeof st.miraSkills!=='object')st.miraSkills={};if(!st.miraSkills.usage)st.miraSkills.usage={};var row=st.miraSkills.usage[id]||{count:0};row.count=(Number(row.count)||0)+1;row.lastUsedAt=root.nowISO?root.nowISO():new Date().toISOString();st.miraSkills.usage[id]=row;if(root.save)root.save();}
 }catch(e){}
 if(skill.page&&root.navigate)root.navigate(skill.page);
 if(root.jarvisQuick)root.jarvisQuick(skill.prompt);
}
root.LIFEOS_MIRA_SKILLS=skills;
root.renderMiraSkillsPanel=render;
root.runLifeOSMiraSkill=run;
})(typeof window!=='undefined'?window:globalThis);
