(function(){
  'use strict';
  var $=function(id){return document.getElementById(id)},DAY=86400000;
  function nextNewYear(){var d=new Date();return(d.getFullYear()+1)+'-01-01'}
  var counts;
  try{counts=JSON.parse(localStorage.getItem('wi-countdowns')||'null')}catch(e){counts=null}
  if(!counts||!counts.length){counts=[{name:localStorage.getItem('wi-target-name')||'距离新年',date:localStorage.getItem('wi-target-date')||nextNewYear()},{name:'重要日子二',date:''},{name:'重要日子三',date:''}]}
  while(counts.length<3)counts.push({name:'重要日子'+(counts.length+1),date:''});
  var active=0;
  function parseDate(value){var p=value.split('-');return new Date(parseInt(p[0],10),parseInt(p[1],10)-1,parseInt(p[2],10))}
  function dateText(value){var p=value.split('-');return p[0]+'年'+parseInt(p[1],10)+'月'+parseInt(p[2],10)+'日'}
  function render(){
    var now=new Date(),today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
    for(var i=0;i<3;i++){
      var c=counts[i],name=$('countName'+i),date=$('countDate'+i),days=$('countDays'+i),state=$('countState'+i),card=document.querySelector('.date-ticket[data-slot="'+i+'"]');
      name.textContent=c.name||('重要日子'+(i+1));card.classList.remove('is-today','is-past','is-empty');
      if(!c.date){date.textContent='尚未设置';days.textContent='＋';state.textContent='添加';card.classList.add('is-empty');continue}
      var end=parseDate(c.date),left=Math.round((end-today)/DAY),distance=Math.abs(left);date.textContent=dateText(c.date);days.textContent=String(distance);
      if(left>0)state.textContent='还有';else if(left<0){state.textContent='已经';card.classList.add('is-past')}else{state.textContent='就是今天';card.classList.add('is-today')}
    }
  }
  function openEditor(slot){active=slot;$('eventInput').value=counts[slot].name||'';$('dateInput').value=counts[slot].date||'';$('countPanel').className='edit-panel open';$('countPanel').setAttribute('aria-hidden','false')}
  var items=document.querySelectorAll('.date-ticket');for(var i=0;i<items.length;i++)items[i].onclick=function(){openEditor(parseInt(this.getAttribute('data-slot'),10))};
  $('cancelCount').onclick=function(){$('countPanel').className='edit-panel';$('countPanel').setAttribute('aria-hidden','true')};
  $('saveCount').onclick=function(){var name=$('eventInput').value.trim(),date=$('dateInput').value;if(!name||!date){$('toast').textContent='请把名称和日期都填好';$('toast').className='toast show';setTimeout(function(){$('toast').className='toast'},1500);return}counts[active]={name:name,date:date};localStorage.setItem('wi-countdowns',JSON.stringify(counts));render();$('countPanel').className='edit-panel';$('countPanel').setAttribute('aria-hidden','true')};
  render();
}());
