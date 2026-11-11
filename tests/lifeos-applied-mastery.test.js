'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('lifeos-applied-mastery.js','utf8');
const index=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const appSource=fs.readFileSync('app.js','utf8');
function fixture(){
 const values={lmRecall:{value:'Принцип проверяется на реальном примере.'},lmApply:{value:'Сегодня применю это в своей задаче.'}};
 const app={innerHTML:''};let xp=0,saved=0,sheet='';
 const sandbox={console,Date,Math,Number,String,Array,Object,JSON,RegExp,Promise,
  state:{},document:{readyState:'complete',querySelector(){return {value:'1'};},getElementById(id){return values[id]||null;},createElement(){return {innerHTML:'',};}},
  openSheet(t,h){sheet=h;},closeSheet(){},toast(){},save(){saved++;},addXP(n){xp+=n;},
  ALL_NEW_COURSES:[],setTimeout,clearTimeout,setInterval,clearInterval
 };
 sandbox.window=sandbox;sandbox.document.querySelector=()=>({value:'1'});
 vm.createContext(sandbox);vm.runInContext(source,sandbox);
 return {sandbox,values,get xp(){return xp;},get saved(){return saved;},get sheet(){return sheet;}};
}
test('applied mastery module is syntactically valid and adds five substantive courses',()=>{
 assert.doesNotThrow(()=>new vm.Script(source));
 const f=fixture(),api=f.sandbox.LIFEOS_APPLIED_MASTERY;
 assert.equal(api.courses.length,5);
 assert.ok(api.allLessons().length>=25);
 for(const id of ['finance_mastery','psychology_mastery','martial_arts_mastery','communication_mastery','business_growth'])
  assert.ok(api.courses.some(c=>c.id===id));
});
test('five-minute learning opens a real lesson with explanation, practice, visual and knowledge check',()=>{
 const f=fixture();f.sandbox.startLIFEOSFiveMinute();
 assert.match(f.sheet,/5-минутный урок/);
 assert.match(f.sheet,/<svg/);
 assert.match(f.sheet,/Проверка без подсказки/);
 assert.match(f.sheet,/Где применишь сегодня/);
});
test('micro-lesson progress is saved without replacing existing user data',()=>{
 const f=fixture();f.sandbox.state={tasks:[{id:'keep-me'}],microLearning:{progress:{legacy:{completed:true}},sessions:[]}};
 const row=f.sandbox.LIFEOS_APPLIED_MASTERY.allLessons()[0];
 f.sandbox.document.querySelector=()=>({value:String(row.lesson.quiz.correctIndex)});
 f.sandbox.completeLIFEOSMicroLesson(row.key);
 assert.equal(f.sandbox.state.tasks[0].id,'keep-me');
 assert.equal(f.sandbox.state.microLearning.progress.legacy.completed,true);
 assert.equal(f.sandbox.state.microLearning.progress[row.key].completed,true);
 assert.equal(f.sandbox.state.microLearning.sessions.length,1);
 assert.equal(f.xp,10);
 assert.ok(f.saved>0);
});
test('wrong answer is not marked as mastered',()=>{
 const f=fixture(),row=f.sandbox.LIFEOS_APPLIED_MASTERY.allLessons()[0];
 f.sandbox.document.querySelector=()=>({value:String((row.lesson.quiz.correctIndex+1)%3)});
 f.sandbox.completeLIFEOSMicroLesson(row.key);
 assert.notEqual(f.sandbox.state.microLearning.progress[row.key].completed,true);
 assert.equal(f.xp,0);
});
test('new curriculum is loaded by index and precached for offline use',()=>{
 assert.match(index,/lifeos-applied-mastery\.js\?v=20261111-1/);
 assert.match(sw,/lifeos-applied-mastery\.js/);
 assert.match(sw,/life-os-v170/);
});


test('five-minute academy is connected to the real learning navigation renderer',()=>{
 assert.match(appSource,/window\\.renderLearning\\s*=\\s*renderLearning/);
 assert.match(index,/app\\.js\\?v=20261111-2/);
 assert.match(index,/sw\\.js\\?v=20261111-170/);
});

test('learning renderer wrapper actually mounts the five-minute panel',()=>{
 const page={children:[],appendChild(node){this.children.push(node);}};
 const sandbox={console,Date,Math,Number,String,Array,Object,JSON,RegExp,Promise,state:{},
  document:{readyState:'complete',querySelector(selector){return selector==='#app .page'?page:{value:'1'};},getElementById(){return null;},createElement(){return {innerHTML:''};}},
  renderLearning(){page.rendered=true;},toast(){},save(){},addXP(){},closeSheet(){}};
 sandbox.window=sandbox;vm.createContext(sandbox);vm.runInContext(source,sandbox);
 sandbox.renderLearning();
 assert.equal(page.rendered,true);
 assert.equal(page.children.length,1);
 assert.match(page.children[0].innerHTML,/LIFEOS · 5 минут развития/);
});
