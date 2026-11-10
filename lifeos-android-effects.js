/* LIFEOS Android-native theme effects v1.0 — isolated, offline, fail-safe */
(function(){
 'use strict';
 var ROOT_ID='themeEffect',OWN='.lifeos-native-particle',KEY='life_os_v45';
 var THEMES={
  sakura:['🌸','✧','❀'], 'sakura-night':['🌸','✧','❀'], rose:['✧','❀','♡'],
  forest:['🍃','✦','❧'],'forest-night':['🍃','✦','❧'], bamboo:['🍃','✧','❧'],
  ocean:['◌','○','✦'],'underwater':['◌','○','✧'],'deep-sea':['◌','○','✦'],
  ice:['❄','✧','❅'],frost:['❄','✧','❅'],polar:['❄','✧','❅'],rain:['⋰','·','✧'],storm:['ϟ','✧','·'],
  fire:['✦','•','✧'],lava:['✦','•','✧'],sunset:['✧','•','✦'],sunrise:['✧','•','✦'],
  aurora:['✦','✧','⋆'],cosmos:['✦','⋆','✧'],galaxy:['✦','⋆','✧'],starlight:['✦','⋆','✧'],
  pumpkin:['✦','·','✧'],vampire:['✧','·','✦'],ghost:['✧','⋆','·'],witch:['✦','✧','⋆']
 };
 var fallback=['✦','·','✧','⋆'];
 function settings(){
  try{var x=JSON.parse(localStorage.getItem(KEY)||'{}');return x&&x.settings?x.settings:{};}catch(e){return {};}
 }
 function enabled(){
  var s=settings();
  return s.effectsEnabled!==false&&s.themeEffects!==false&&document.body.getAttribute('data-lifeos-effects')!=='off';
 }
 function theme(){
  var m=(document.body.className||'').match(/(?:^|\s)theme-([a-z0-9-]+)/);
  return m?m[1]:'dark';
 }
 function symbols(){
  var t=theme();
  return THEMES[t]||fallback;
 }
 function makeParticle(root,items,index){
  var el=document.createElement('span');
  el.className='lifeos-native-particle';
  el.setAttribute('aria-hidden','true');
  el.textContent=items[index%items.length];
  var rand=function(min,max){return Math.random()*(max-min)+min;};
  el.style.setProperty('--life-x',rand(2,98).toFixed(2)+'vw');
  el.style.setProperty('--life-drift',rand(-70,70).toFixed(0)+'px');
  el.style.setProperty('--life-duration',rand(15,31).toFixed(1)+'s');
  el.style.setProperty('--life-delay',(-rand(0,28)).toFixed(1)+'s');
  el.style.setProperty('--life-size',rand(10,21).toFixed(0)+'px');
  el.style.setProperty('--life-opacity',rand(.25,.58).toFixed(2));
  root.appendChild(el);
 }
 function render(){
  try{
   var root=document.getElementById(ROOT_ID);
   if(!root)return;
   root.querySelectorAll(OWN).forEach(function(n){n.remove();});
   if(!enabled())return;
   var items=symbols();
   var count=Math.min(20,Math.max(12,Math.round((window.innerWidth||360)/24)));
   for(var i=0;i<count;i++)makeParticle(root,items,i);
  }catch(e){console.warn('[LIFEOS effects] safely skipped:',e);}
 }
 function start(){
  render();
  if(window.MutationObserver){
   var observer=new MutationObserver(function(){render();});
   observer.observe(document.body,{attributes:true,attributeFilter:['class','data-lifeos-effects']});
  }
  window.addEventListener('storage',render,{passive:true});
  document.addEventListener('visibilitychange',function(){if(!document.hidden)render();},{passive:true});
  window.addEventListener('resize',function(){clearTimeout(window.__lifeosEffectsResize);window.__lifeosEffectsResize=setTimeout(render,250);},{passive:true});
  window.LIFEOS_ANDROID_EFFECTS={refresh:render,version:'1.0',enabled:enabled};
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();