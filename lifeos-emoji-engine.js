/* LIFEOS custom vector emoji layer — local SVG, no network/fonts/API */
(function(){
 'use strict';
 var icons={
 '🏠':['M3 11 12 3l9 8','M5 10v11h14V10','M9 21v-7h6v7'],
 '✅':['m5 12 4 4L19 6'],
 '🎓':['M2 9 12 4l10 5-10 5L2 9Z','M6 11v5c4 3 8 3 12 0v-5','M22 9v7'],
 '📅':['M4 5h16v16H4z','M8 3v4M16 3v4M4 10h16','M8 14h3M8 17h3'],
 '📊':['M4 20V11h4v9M10 20V5h4v15M16 20V8h4v12'],
 '👁️':['M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z','M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z'],
 '✨':['m12 2 2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2L12 2Z'],
 '🧠':['M12 4a4 4 0 0 0-7 3 4 4 0 0 0-1 7 4 4 0 0 0 5 6h3V4Z','M12 4a4 4 0 0 1 7 3 4 4 0 0 1 1 7 4 4 0 0 1-5 6h-3','M8 8v2m8-2v2M8 15h2m4 0h2'],
 '🎨':['M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1-4c-1-2 1-3 3-3h1a3 3 0 0 0 3-3c0-4-4-8-9-8Z','M7 11h.01M10 7h.01M15 7h.01M18 11h.01'],
 '⚡':['M13 2 4 14h7l-1 8 10-13h-7l1-7Z'],
 '🔎':['m20 20-5-5','M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z'],
 '👤':['M20 21a8 8 0 0 0-16 0','M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z'],
 '💎':['m12 2 8 6-8 14L4 8l8-6Z','M4 8h16M8 8l4 14 4-14'],
 '🚀':['M5 15c-2 1-3 4-3 6 2 0 5-1 6-3','M8 13 5 10l4-5c4-3 8-3 10-3 0 2 0 6-3 10l-5 4-3-3Z','M14 8h.01'],
 '🎯':['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z','M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z','M12 12h.01'],
 '💪':['M7 13V7a2 2 0 0 1 4 0v4-6a2 2 0 0 1 4 0v7-4a2 2 0 0 1 4 0v7c0 4-3 7-7 7h-1c-3 0-5-2-7-5l-2-3a2 2 0 0 1 3-2l2 2'],
 '❤️':['M20.8 8.5c0 5-8.8 11-8.8 11s-8.8-6-8.8-11A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8.8 2.5Z'],
 '🔥':['M12 22a7 7 0 0 0 7-7c0-4-3-6-4-10-2 2-3 4-3 6-2-1-3-3-3-5-4 4-5 7-5 10a8 8 0 0 0 8 6Z','M12 22a4 4 0 0 0 4-4c0-2-2-4-3-5-1 2-2 3-2 5a3 3 0 0 0 1 4Z'],
 '🌙':['M20 15A8 8 0 0 1 9 4a8 8 0 1 0 11 11Z'],
 '☀️':['M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4m0-12.8L17 7M7 17l-1.4 1.4','M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z'],
 '💧':['M12 2s7 8 7 13a7 7 0 0 1-14 0c0-5 7-13 7-13Z'],
 '🧘':['M12 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z','M12 7v6m0-4-6-3m6 3 6-3M12 13l-6 8m6-8 6 8'],
 '🏆':['M7 3h10v5a5 5 0 0 1-10 0V3Z','M7 5H3v3a5 5 0 0 0 5 5M17 5h4v3a5 5 0 0 1-5 5M12 13v6m-4 2h8'],
 '📚':['M4 4h5v16H4z','M10 4h5v16h-5z','M16 4h4v16h-4z'],
 '💡':['M9 18h6m-5 3h4m-5-6a7 7 0 1 1 6 0c-1 1-1 2-1 3h-4c0-1 0-2-1-3Z'],
 '⏱️':['M10 2h4m-2 4v6l4 2','M12 22a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z'],
 '🎵':['M9 18V5l12-2v13','M9 18a3 3 0 1 1-3-3c2 0 3 1 3 3Zm12-2a3 3 0 1 1-3-3c2 0 3 1 3 3Z'],
 '🛡️':['M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z','m9 12 2 2 4-5'],
 '💬':['M21 11a8 8 0 0 1-8 8H5l-3 3V11a8 8 0 1 1 19 0Z','M8 11h.01M12 11h.01M16 11h.01'],
 '🔒':['M5 10h14v11H5z','M8 10V7a4 4 0 0 1 8 0v3','M12 14v3'],
 '🌱':['M12 21v-9','M12 12C4 12 3 6 3 4c6-1 10 2 9 8','M12 15c0-6 5-9 9-9 0 5-2 9-9 9Z'],
 '🎮':['M6 8h12a4 4 0 0 1 4 4l-1 6a2 2 0 0 1-3 1l-3-3H9l-3 3a2 2 0 0 1-3-1l-1-6a4 4 0 0 1 4-4Z','M7 11v4m-2-2h4m7-1h.01m3 2h.01'],
 '🌈':['M3 18a9 9 0 0 1 18 0','M7 18a5 5 0 0 1 10 0','M10 18a2 2 0 0 1 4 0'],
'🏃':["M4 17c3-1 5-4 6-7l2 2 4 1","M12 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z","M3 21h6l3-5"],
'🏋️':["M3 8v8m3-10v12m12-12v12m3-10v8M6 12h12"],
'🥗':["M3 13h18a9 9 0 0 1-18 0Z","M12 4c-2 2-2 4 0 6m4-8-2 5"],
'🥇':["M7 3h10v5a5 5 0 0 1-10 0V3Z","M7 5H3v3a5 5 0 0 0 5 5M17 5h4v3a5 5 0 0 1-5 5M12 13v8m-4 0h8"],
'🧩':["M4 4h6v5h4V4h6v6h-5v4h5v6h-6v-5h-4v5H4v-6h5v-4H4z"],
'📝':["M5 3h10l4 4v14H5z","M14 3v5h5","m8 13 7-3m-7 7h8"],
'📈':["M3 19 9 13l4 3 8-10","M15 6h6v6"],
'🔔':["M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9","M10 21h4"],
'⏰':["M12 8v5l3 2","M12 22a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z","M5 2 2 5m17-3 3 3"],
'📍':["M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z","M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"],
'🎧':["M3 13v-2a9 9 0 0 1 18 0v2","M3 13h4v7H5a2 2 0 0 1-2-2v-5Zm18 0h-4v7h2a2 2 0 0 0 2-2v-5Z"],
'💻':["M4 4h16v12H4z","M2 20h20l-2-4H4z"],
'📱':["M7 2h10v20H7z","M10 18h4"],
'📖':["M3 5c4-2 7-1 9 1v15c-2-2-5-3-9-1z","M21 5c-4-2-7-1-9 1v15c2-2 5-3 9-1z"],
'🧭':["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z","m15 9-2 5-4 2 2-5z"],
'🎁':["M3 9h18v12H3z","M2 5h20v4H2z","M12 5v16","M12 5c-5 0-6-5-2-4 2 0 2 4 2 4Zm0 0c5 0 6-5 2-4-2 0-2 4-2 4Z"],
'🌟':["M12 2 14.5 9.5 22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"],
'💤':["M4 6h7L4 14h7M13 14h7l-7 7h7"],
'☕':["M4 8h13v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z","M17 10h2a3 3 0 0 1 0 6h-2","M7 3v3m5-3v3"],
 }; var skip='SCRIPT STYLE TEXTAREA INPUT SELECT OPTION CODE PRE SVG .emoji-native .emoji-picker .tab-icon .nav-glyph #headerAvatar';
 function svgFor(char){
  var paths=icons[char];if(!paths)return null;
  return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><defs><linearGradient id="lifeEmojiGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--brand,#9bbaff)"/><stop offset="1" stop-color="var(--brand-2,#b5a5ff)"/></linearGradient></defs>'+paths.map(function(d){return '<path d="'+d+'" />';}).join('')+'</svg>';
 }
 function transformTextNode(node){
  if(!node.nodeValue||!/[🏠✅🎓📅📊👁️✨🧠🎨⚡🔎👤💎🚀🎯💪❤️🔥🌙☀️💧🧘🏆📚💡⏱️🎵🛡️💬🔒🌱🎮🌈]/u.test(node.nodeValue))return;
  var parent=node.parentElement;if(!parent||parent.closest(skip))return;
  var text=node.nodeValue,fragment=document.createDocumentFragment(),changed=false;
  var keys=Object.keys(icons).sort(function(a,b){return b.length-a.length;});
  var i=0,last=0;
  while(i<text.length){
   var found=null;
   for(var k=0;k<keys.length;k++)if(text.slice(i,i+keys[k].length)===keys[k]){found=keys[k];break;}
   if(found){
    if(i>last)fragment.appendChild(document.createTextNode(text.slice(last,i)));
    var span=document.createElement('span');span.className='lifeos-custom-emoji';span.setAttribute('aria-label',found);span.innerHTML=svgFor(found);fragment.appendChild(span);
    i+=found.length;last=i;changed=true;
   }else i++;
  }
  if(changed){if(last<text.length)fragment.appendChild(document.createTextNode(text.slice(last)));node.parentNode.replaceChild(fragment,node);}
 }
 function scan(root){
  if(!root)return;
  var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  var nodes=[],n;while((n=walker.nextNode()))nodes.push(n);
  nodes.forEach(transformTextNode);
 }
 function start(){
  scan(document.getElementById('app'));scan(document.querySelector('.app-header'));scan(document.getElementById('tabBar'));
  var root=document.getElementById('app');if(root&&window.MutationObserver){var observer=new MutationObserver(function(records){records.forEach(function(r){r.addedNodes.forEach(function(n){if(n.nodeType===3)transformTextNode(n);else if(n.nodeType===1)scan(n);});});});observer.observe(root,{childList:true,subtree:true});}
  var header=document.querySelector('.app-header');if(header&&window.MutationObserver){var hObs=new MutationObserver(function(records){records.forEach(function(r){r.addedNodes.forEach(function(n){if(n.nodeType===3)transformTextNode(n);else if(n.nodeType===1)scan(n);});});});hObs.observe(header,{childList:true,subtree:true});}
  window.LIFEOS_CUSTOM_EMOJI={version:'1.0',count:Object.keys(icons).length,refresh:function(){scan(document.getElementById('app'));scan(document.querySelector('.app-header'));}};
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();