/* LIFEOS Jarvis mobile quick assistant — additive PWA layer */
(function(){
  'use strict';
  if(window.__LIFEOS_JARVIS_MOBILE__)return;
  window.__LIFEOS_JARVIS_MOBILE__=true;

  var overlay=null,recognition=null,lastTranscript='';
  function el(tag,cls,text){
    var node=document.createElement(tag);
    if(cls)node.className=cls;
    if(text!==undefined)node.textContent=text;
    return node;
  }
  function submitToJarvis(text){
    var value=String(text||'').trim();
    if(!value)return;
    if(typeof window.navigate==='function')window.navigate('jarvis');
    var attempts=0;
    function deliver(){
      var input=document.getElementById('jarvisInput');
      if(input&&typeof window.sendJarvisMessage==='function'){
        input.value=value;
        input.dispatchEvent(new Event('input',{bubbles:true}));
        window.sendJarvisMessage();
        closeAssistant();
        return;
      }
      if(++attempts<12)requestAnimationFrame(deliver);
      else announce('Не удалось открыть диалог. Открой раздел «Джарвис» вручную.');
    }
    requestAnimationFrame(deliver);
  }
  function announce(message){
    var status=overlay&&overlay.querySelector('.lj-status');
    if(status)status.textContent=message;
  }
  function closeAssistant(){
    if(overlay){overlay.classList.remove('is-open');overlay.setAttribute('aria-hidden','true');}
    stopVoice();
  }
  function openAssistant(startVoice){
    if(!overlay)return;
    overlay.classList.add('is-open');overlay.setAttribute('aria-hidden','false');
    if(startVoice)startVoiceInput();
    else{var input=overlay.querySelector('.lj-input');if(input)input.focus({preventScroll:true});}
  }
  function stopVoice(){
    if(recognition){try{recognition.abort();}catch(e){}recognition=null;}
    var mic=overlay&&overlay.querySelector('.lj-mic');
    if(mic)mic.classList.remove('is-listening');
  }
  function startVoiceInput(){
    var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){announce('Голосовой ввод недоступен в этом браузере. Используй клавиатуру.');return;}
    stopVoice();
    try{
      recognition=new SR();
      recognition.lang='ru-RU';
      recognition.interimResults=false;
      recognition.maxAlternatives=1;
      recognition.onstart=function(){var mic=overlay.querySelector('.lj-mic');if(mic)mic.classList.add('is-listening');announce('Слушаю…');};
      recognition.onresult=function(event){
        var result=event.results&&event.results[0]&&event.results[0][0];
        lastTranscript=result?result.transcript:'';
        if(lastTranscript){announce('Распознано: '+lastTranscript);submitToJarvis(lastTranscript);}
      };
      recognition.onerror=function(event){announce(event.error==='not-allowed'?'Разреши доступ к микрофону в Chrome.':'Голосовой ввод завершился: '+event.error);};
      recognition.onend=function(){var mic=overlay&&overlay.querySelector('.lj-mic');if(mic)mic.classList.remove('is-listening');recognition=null;};
      recognition.start();
    }catch(error){announce('Не удалось запустить микрофон. Проверь разрешение Chrome.');}
  }
  function build(){
    var launcher=el('button','lj-launcher','J');
    launcher.type='button';launcher.setAttribute('aria-label','Открыть Джарвиса');launcher.addEventListener('click',function(){openAssistant(false);});
    overlay=el('section','lj-overlay');overlay.setAttribute('aria-hidden','true');overlay.setAttribute('aria-label','Мобильный ассистент LIFEOS');
    var panel=el('div','lj-panel');
    var handle=el('div','lj-handle');
    var head=el('div','lj-head');
    var brand=el('div','lj-brand');
    brand.append(el('span','lj-orb','J'),el('div','', 'JARVIS 3.0'));
    var close=el('button','lj-close','×');close.type='button';close.setAttribute('aria-label','Закрыть');close.addEventListener('click',closeAssistant);
    head.append(brand,close);
    var title=el('h2','lj-title','Чем помочь?');
    var subtitle=el('p','lj-subtitle','Голосовой помощник LIFEOS');
    var mic=el('button','lj-mic','');mic.type='button';mic.setAttribute('aria-label','Начать голосовой ввод');mic.append(el('span','','🎙'));mic.addEventListener('click',startVoiceInput);
    var status=el('p','lj-status','Нажми на микрофон или напиши команду');
    var form=el('form','lj-form');
    var input=el('input','lj-input');input.type='text';input.placeholder='Скажи Джарвису…';input.autocomplete='off';input.setAttribute('aria-label','Сообщение Джарвису');
    var send=el('button','lj-send','➤');send.type='submit';send.setAttribute('aria-label','Отправить');
    form.append(input,send);form.addEventListener('submit',function(event){event.preventDefault();submitToJarvis(input.value);input.value='';});
    var quick=el('div','lj-quick');
    [['Сводка дня','сводка'],['Мои задачи','покажи мои задачи'],['Продолжить обучение','открой обучение']].forEach(function(item){
      var b=el('button','lj-chip',item[0]);b.type='button';b.addEventListener('click',function(){submitToJarvis(item[1]);});quick.append(b);
    });
    panel.append(handle,head,title,subtitle,mic,status,form,quick);
    overlay.append(panel);
    overlay.addEventListener('click',function(event){if(event.target===overlay)closeAssistant();});
    document.body.append(launcher,overlay);
    window.LifeOSJarvisMobile={open:openAssistant,close:closeAssistant,startVoice:startVoiceInput,submit:submitToJarvis};
  }
  function installGesture(){
    var start=null;
    document.addEventListener('touchstart',function(event){
      if(event.touches.length!==1)return;
      var t=event.touches[0];
      if(t.clientY>window.innerHeight-34)start={x:t.clientX,y:t.clientY,time:Date.now()};
      else start=null;
    },{passive:true});
    document.addEventListener('touchend',function(event){
      if(!start||!event.changedTouches.length)return;
      var t=event.changedTouches[0],dy=start.y-t.clientY,dx=Math.abs(start.x-t.clientX),duration=Date.now()-start.time;
      if(dy>105&&dx<85&&duration<900){event.preventDefault();openAssistant(false);}
      start=null;
    },{passive:false});
  }
  function init(){
    if(!document.body){document.addEventListener('DOMContentLoaded',init,{once:true});return;}
    build();installGesture();
    try{
      var params=new URLSearchParams(location.search);
      if(params.get('page')==='jarvis'&&typeof window.navigate==='function')window.navigate('jarvis');
      if(params.get('voice')==='1'){history.replaceState(null,'',location.pathname+location.hash);openAssistant(true);}
    }catch(e){}
  }
  init();
})();