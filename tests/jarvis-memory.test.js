'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {webcrypto}=require('node:crypto');
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

test('deleting a memory creates a tombstone so another device cannot restore it',()=>{
 memory.clear();
 const item=memory.add('Удаляемая запись');
 assert.equal(memory.remove(item.id),true);
 assert.ok(global.state.jarvis.memory.deleted.memory.includes(item.id));
});
test('cloud sync encrypts the payload before upload and restores it on another device',async()=>{
 const source=fs.readFileSync(require.resolve('../lifeos-jarvis-memory.js'),'utf8');
 const id=Buffer.alloc(18,7).toString('base64url');
 const key=Buffer.alloc(32,9).toString('base64url');
 let stored=null;
 const sandbox={
  state:{jarvis:{apiUrl:'https://worker.example/',accessCode:'test-code',memory:{items:[{id:'mem-1',text:'Секретный факт',category:'Факт',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()},],deleted:{memory:[],customSkills:[],reminders:[]},sync:{id,key,lastSyncAt:null}},customSkills:[],reminders:[]}},
  crypto:webcrypto,URL,Uint8Array,TextEncoder,TextDecoder,Date,Math,JSON,String,Number,Array,Object,Promise,
  btoa:value=>Buffer.from(value,'binary').toString('base64'),
  atob:value=>Buffer.from(value,'base64').toString('binary'),
  save(){},
  fetch:async(url,options)=>{
   if(options.method==='GET')return new Response(JSON.stringify({payload:stored}),{status:200,headers:{'Content-Type':'application/json'}});
   const body=JSON.parse(options.body);assert.equal(body.action,'memory:save');assert.equal(body.memoryId,id);assert.ok(!body.payload.includes('Секретный факт'));stored=body.payload;
   return new Response(JSON.stringify({ok:true,saved:true}),{status:200,headers:{'Content-Type':'application/json'}});
  }
 };
 sandbox.window=sandbox;
 vm.runInNewContext(source,sandbox,{filename:'lifeos-jarvis-memory.js'});
 await sandbox.LIFEOS_JARVIS_MEMORY.sync();
 assert.ok(stored);
 sandbox.state.jarvis.memory.items=[];
 await sandbox.LIFEOS_JARVIS_MEMORY.sync();
 assert.equal(sandbox.state.jarvis.memory.items[0].text,'Секретный факт');
});
