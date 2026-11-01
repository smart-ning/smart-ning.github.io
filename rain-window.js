(function(){
  'use strict';
  var card=document.getElementById('rainCard'),audio=document.getElementById('rainAudio'),toggle=document.getElementById('rainToggle'),status=document.getElementById('rainStatus'),volume=document.getElementById('rainVolume'),volumeText=document.getElementById('rainVolumeText'),levelButtons=document.querySelectorAll('[data-rain]'),timerButtons=document.querySelectorAll('[data-minutes]');
  if(!card||!audio||!toggle)return;
  var level='windowRain',stopAt=0,timerTick;
  var settings={softRain:{src:'audio/soft-rain.mp3?v=20261101-1',label:'轻柔细雨'},windowRain:{src:'audio/window-rain.mp3?v=20261101-1',label:'窗边夜雨'},rainCurtain:{src:'audio/rain-curtain.mp3?v=20261101-1',label:'绵密雨幕'}};
  audio.volume=parseInt(volume.value,10)/100;
  function updateButton(playing){card.classList.toggle('playing',playing);toggle.setAttribute('aria-pressed',playing?'true':'false');toggle.innerHTML=playing?'<b>Ⅱ</b><span>暂停雨声</span>':'<b>▶</b><span>继续下雨</span>';status.textContent=playing?settings[level].label:'雨声已暂停'}
  function play(){var promise=audio.play();if(promise&&promise.then)promise.then(function(){updateButton(true);setMediaState('playing')}).catch(function(){updateButton(false);status.textContent='请再轻触一次开始播放'});else{updateButton(true);setMediaState('playing')}}
  function pause(){audio.pause();updateButton(false);setMediaState('paused')}
  toggle.onclick=function(){if(audio.paused)play();else pause()};
  volume.oninput=function(){audio.volume=parseInt(volume.value,10)/100;volumeText.textContent=volume.value+'%'};
  for(var i=0;i<levelButtons.length;i++)levelButtons[i].onclick=function(){
    var wasPlaying=!audio.paused;level=this.getAttribute('data-rain');
    for(var j=0;j<levelButtons.length;j++)levelButtons[j].classList.remove('selected');
    this.classList.add('selected');audio.src=settings[level].src;audio.load();
    status.textContent=settings[level].label;if(wasPlaying)play();setMediaMetadata()
  };
  function timerLabel(){if(!stopAt)return;var left=Math.max(0,Math.ceil((stopAt-Date.now())/60000));if(!left){stopAt=0;pause();status.textContent='定时结束，晚安';for(var k=0;k<timerButtons.length;k++)timerButtons[k].classList.remove('selected');clearInterval(timerTick)}else status.textContent=settings[level].label+' · '+left+'分钟'}
  for(var n=0;n<timerButtons.length;n++)timerButtons[n].onclick=function(){var minutes=parseInt(this.getAttribute('data-minutes'),10);stopAt=minutes?Date.now()+minutes*60000:0;for(var j=0;j<timerButtons.length;j++)timerButtons[j].classList.remove('selected');if(minutes)this.classList.add('selected');clearInterval(timerTick);if(minutes){if(audio.paused)play();timerLabel();timerTick=setInterval(timerLabel,30000)}else status.textContent=audio.paused?'等待入睡':settings[level].label};
  audio.addEventListener('play',function(){updateButton(true)});audio.addEventListener('pause',function(){if(!audio.ended)updateButton(false)});audio.addEventListener('error',function(){status.textContent='雨声加载失败，请检查网络后重试'});
  function setMediaMetadata(){if(!('mediaSession' in navigator)||!window.MediaMetadata)return;navigator.mediaSession.metadata=new MediaMetadata({title:settings[level].label,artist:'Healing Island',album:'晚安雨声',artwork:[{src:'apple-touch-icon.png',sizes:'180x180',type:'image/png'}]})}
  function setMediaState(state){if('mediaSession' in navigator)try{navigator.mediaSession.playbackState=state}catch(e){}}
  if('mediaSession' in navigator){try{navigator.mediaSession.setActionHandler('play',play);navigator.mediaSession.setActionHandler('pause',pause)}catch(e){}}
  setMediaMetadata();
}());
