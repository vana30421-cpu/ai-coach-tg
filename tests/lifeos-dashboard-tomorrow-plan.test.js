'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'lifeos-ulty-design.css'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');

test('dashboard exposes an editable tomorrow plan with three priorities and schedule fields',()=>{
 assert.match(app,/План на завтра/);
 for(const id of ['tomorrowPriority1','tomorrowPriority2','tomorrowPriority3','tomorrowSchedule','tomorrowPrep']){
  assert.match(app,new RegExp('id="'+id+'"'));
 }
 assert.match(app,/onclick="saveTomorrowPlan\(\)"/);
 assert.match(app,/window\.saveTomorrowPlan = saveTomorrowPlan/);
});

test('tomorrow plan uses a local calendar date and persists per date without replacing other days',()=>{
 assert.match(app,/tomorrowDate\.setDate\(tomorrowDate\.getDate\(\)\+1\)/);
 assert.match(app,/state\.tomorrowPlans\[key\]=plan/);
 assert.match(app,/if\(!save\(\)\)/);
 assert.match(app,/while\(keys\.length>90\)/);
 assert.match(app,/esc\(tomorrowPlan\.(?:priority1|priority2|priority3|schedule|preparation)/);
});

test('ambient aurora animation is enabled while reduced-motion remains respected',()=>{
 assert.match(css,/body::before\{[^}]*animation:auroraShift 25s ease-in-out infinite alternate!important/s);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.doesNotMatch(css,/body::before\{[^}]*animation:none!important/s);
});

test('front-end asset and offline cache versions are advanced together',()=>{
 assert.match(html,/lifeos-ulty-design\.css\?v=20261114-8/);
 assert.match(html,/LIFEOS-20261114-8/);
 assert.match(sw,/const CACHE='life-os-v203'/);
});


test('Android reduced-motion keeps theme particles visible in the viewport without forced motion',()=>{
 assert.match(app,/--life-static-y/);
 assert.match(css,/#themeEffect \.life-effect\{[^}]*top:var\(--life-static-y,50vh\)!important;[^}]*animation:none!important/s);
 assert.match(css,/body\.life-motion-override:not\(\.life-disable-motion\) #themeEffect \.life-effect\{[^}]*animation:lifeFloat[^}]*!important/s);
 assert.match(css,/body\.life-disable-motion\.life-motion-override #themeEffect \.life-effect[^}]*animation:none!important/s);
});

test('Android effects retain an explicit motion opt-in and new offline asset versions',()=>{
 assert.match(app,/effectsMotionOverride===true/);
 assert.match(html,/lifeos-ulty-design\.css\?v=20261114-9/);
 assert.match(html,/lifeos-effects-v2\.js\?v=20261114-4/);
 assert.match(sw,/const CACHE='life-os-v204'/);
});
