'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
global.state={jarvis:{memory:{items:[]}}};
global.saved=0;
global.save=function(){global.saved++;};
require('../lifeos-jarvis-memory.js');
const memory=global.LIFEOS_JARVIS_MEMORY;
test('adds and deduplicates explicit memories',()=>{
 memory.clear();
 const first=memory.add('Моя цель — выучить JavaScript','Цель');
 const second=memory.add('Моя цель — выучить JavaScript','Проект');
 assert.equal(memory.list().length,1);
 assert.equal(second.id,first.id);
 assert.equal(memory.list()[0].category,'Проект');
});
test('retrieves relevant memories by query',()=>{
 memory.clear();
 memory.add('Пользователь изучает JavaScript','Обучение');
 memory.add('Предпочитает короткие ответы','Предпочтение');
 const found=memory.search('JavaScript',5);
 assert.equal(found.length,1);
 assert.match(found[0].text,/JavaScript/);
});
test('removes a memory by id',()=>{
 memory.clear();
 const item=memory.add('Удалить этот факт');
 assert.equal(memory.remove(item.id),true);
 assert.equal(memory.list().length,0);
 assert.equal(memory.remove(item.id),false);
});
test('caps stored memory at 500 entries',()=>{
 memory.clear();
 for(let i=0;i<505;i++)memory.add('Факт '+i);
 assert.equal(memory.list().length,500);
 assert.equal(memory.list().some(x=>x.text==='Факт 0'),false);
});
