/* ═══ GOLD CURSOR + 3D EFFECTS (PERFORMANCE OPTIMIZED) ═══ */
(function(){
/* ─── SHARED STATE ─── */
var cx=0,cy=0,rx=0,ry=0;
var ticking=false;
var isTouch='ontouchstart' in window;

if(!isTouch){
/* ═══ GOLD CIRCLE CURSOR ═══ */
document.documentElement.style.cursor='none';
document.body.style.cursor='none';

/* Inner dot — solid gold circle */
var cur=document.createElement('div');
cur.id='goldCur';
cur.style.cssText='position:fixed;top:0;left:0;width:8px;height:8px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#e4bd51,#c6a15b 60%,#a8873a);pointer-events:none;z-index:99999;will-change:transform;transform:translate3d(-20px,-20px,0);box-shadow:0 0 6px rgba(228,189,81,.5),0 0 14px rgba(198,161,91,.2)';
document.body.appendChild(cur);

/* Outer ring — gold outline circle */
var ring=document.createElement('div');
ring.id='goldRing';
ring.style.cssText='position:fixed;top:0;left:0;width:36px;height:36px;border-radius:50%;border:1.5px solid rgba(198,161,91,.4);pointer-events:none;z-index:99998;will-change:transform;transform:translate3d(-50px,-50px,0);transition:width .4s cubic-bezier(.22,1,.36,1),height .4s cubic-bezier(.22,1,.36,1),border-color .3s,background .3s';
document.body.appendChild(ring);

var interactives='a,button,.work-card,.svc-card,.abt-value,.proof-item,.nav-link,.pill,.hamburger,.work-arrow,.svc-card-link,.abt-member-img';

/* Throttled mousemove */
document.addEventListener('mousemove',function(e){
  cx=e.clientX;cy=e.clientY;
  if(!ticking){
    ticking=true;
    requestAnimationFrame(function(){
      cur.style.transform='translate3d('+(cx-4)+'px,'+(cy-4)+'px,0)';
      ticking=false;
    });
  }
},{passive:true});

/* Smooth ring follow */
function cursorLoop(){
  rx+=(cx-rx)*0.1;ry+=(cy-ry)*0.1;
  ring.style.transform='translate3d('+(rx-18)+'px,'+(ry-18)+'px,0)';
  requestAnimationFrame(cursorLoop);
}
requestAnimationFrame(cursorLoop);

/* Hover — ring expands and glows */
document.addEventListener('mouseover',function(e){
  if(e.target.closest(interactives)){
    ring.style.width='56px';ring.style.height='56px';
    ring.style.borderColor='rgba(228,189,81,.8)';
    ring.style.background='rgba(228,189,81,.06)';
    ring.style.transform='translate3d('+(rx-28)+'px,'+(ry-28)+'px,0) scale(1.1)';
    cur.style.width='10px';cur.style.height='10px';
    cur.style.transform='translate3d('+(cx-5)+'px,'+(cy-5)+'px,0) scale(1.2)';
  } else {
    ring.style.width='36px';ring.style.height='36px';
    ring.style.borderColor='rgba(198,161,91,.4)';
    ring.style.background='transparent';
    cur.style.width='8px';cur.style.height='8px';
  }
});

document.addEventListener('mousedown',function(){ring.style.transform+=' scale(.85)';cur.style.transform+=' scale(.8)';});
document.addEventListener('mouseup',function(){ring.style.transform='translate3d('+(rx-18)+'px,'+(ry-18)+'px,0)';cur.style.transform='translate3d('+(cx-4)+'px,'+(cy-4)+'px,0)';});

document.addEventListener('mouseleave',function(){cur.style.opacity='0';ring.style.opacity='0';});
document.addEventListener('mouseenter',function(){cur.style.opacity='1';ring.style.opacity='1';});

/* ─── CLICK RIPPLE EFFECT ─── */
document.addEventListener('click',function(e){
  for(var i=0;i<3;i++){
    var ripple=document.createElement('div');
    ripple.style.cssText='position:fixed;border-radius:50%;pointer-events:none;z-index:99997;border:1.5px solid rgba(228,189,81,'+(0.7-i*0.2)+');width:0;height:0;left:'+e.clientX+'px;top:'+e.clientY+'px;transform:translate(-50%,-50%)';
    document.body.appendChild(ripple);
    (function(r,delay){
      setTimeout(function(){
        r.animate([
          {width:'0px',height:'0px',opacity:0.8,borderWidth:'2px'},
          {width:(60+d*30)+'px',height:(60+d*30)+'px',opacity:0,borderWidth:'0.5px'}
        ],{duration:600+d*200,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'});
        setTimeout(function(){r.remove();},800+d*200);
      },delay);
    })(ripple,i*80);
  }
  /* Gold sparkle burst */
  for(var j=0;j<6;j++){
    var spark=document.createElement('div');
    var angle=(j/6)*Math.PI*2;
    var dist=40+Math.random()*30;
    spark.style.cssText='position:fixed;width:3px;height:3px;border-radius:50%;background:#e4bd51;pointer-events:none;z-index:99997;left:'+e.clientX+'px;top:'+e.clientY+'px;box-shadow:0 0 4px rgba(228,189,81,.8)';
    document.body.appendChild(spark);
    (function(s,a,d){
      s.animate([
        {transform:'translate(-50%,-50%) translate(0,0) scale(1)',opacity:1},
        {transform:'translate(-50%,-50%) translate('+Math.cos(a)*d+'px,'+Math.sin(a)*d+'px) scale(0)',opacity:0}
      ],{duration:500,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'});
      setTimeout(function(){s.remove();},550);
    })(spark,angle,dist);
  }
});

}/* end touch check */

/* ═══ 3D CARD TILT (throttled) ═══ */
var tiltEls=document.querySelectorAll('.work-card,.svc-card,.abt-value');
tiltEls.forEach(function(el){
  var tiltTick=false;
  el.addEventListener('mousemove',function(e){
    if(tiltTick)return;tiltTick=true;
    requestAnimationFrame(function(){
      var r=el.getBoundingClientRect();
      var x=(e.clientX-r.left)/r.width-0.5;
      var y=(e.clientY-r.top)/r.height-0.5;
      el.style.transform='perspective(800px) rotateX('+(-y*12)+'deg) rotateY('+(x*12)+'deg) translateZ(10px)';
      tiltTick=false;
    });
  });
  el.addEventListener('mouseleave',function(){
    el.style.transition='transform .6s cubic-bezier(.22,1,.36,1)';
    el.style.transform='perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
  });
  el.addEventListener('mouseenter',function(){el.style.transition='transform .15s ease-out';});
});

/* ═══ MAGNETIC BUTTONS (throttled) ═══ */
var magBtns=document.querySelectorAll('.pill');
magBtns.forEach(function(btn){
  var btnTick=false;
  btn.addEventListener('mousemove',function(e){
    if(btnTick)return;btnTick=true;
    requestAnimationFrame(function(){
      var r=btn.getBoundingClientRect();
      var x=(e.clientX-r.left-r.width/2)*0.3;
      var y=(e.clientY-r.top-r.height/2)*0.3;
      btn.style.transform='translate('+x+'px,'+y+'px)';
      btnTick=false;
    });
  });
  btn.addEventListener('mouseleave',function(){btn.style.transition='transform .4s cubic-bezier(.22,1,.36,1)';btn.style.transform='translate(0)';});
  btn.addEventListener('mouseenter',function(){btn.style.transition='transform .1s ease-out';});
});

/* ═══ HERO MOUSE PARALLAX (throttled) ═══ */
var heroEl=document.querySelector('.hero,.svc-hero,.abt-hero');
if(heroEl){
  var heroH1=heroEl.querySelector('h1');
  var heroTag=heroEl.querySelector('.hero-tagline,.muted');
  var heroBg=heroEl.querySelector('.hero-bg,.svc-hero-bg,.abt-hero-bg');
  var heroTick=false;
  heroEl.addEventListener('mousemove',function(e){
    if(heroTick)return;heroTick=true;
    requestAnimationFrame(function(){
      var x=(e.clientX/window.innerWidth-0.5)*2;
      var y=(e.clientY/window.innerHeight-0.5)*2;
      if(heroH1)heroH1.style.transform='translate3d('+(x*8)+'px,'+(y*5)+'px,0)';
      if(heroTag)heroTag.style.transform='translate3d('+(x*4)+'px,'+(y*3)+'px,0)';
      if(heroBg)heroBg.style.transform='translate3d('+(x*-6)+'px,'+(y*-4)+'px,0) scale(1.05)';
      heroTick=false;
    });
  });
  heroEl.addEventListener('mouseleave',function(){
    if(heroH1)heroH1.style.transform='translate3d(0,0,0)';
    if(heroTag)heroTag.style.transform='translate3d(0,0,0)';
    if(heroBg)heroBg.style.transform='translate3d(0,0,0) scale(1.05)';
  });
}

/* ═══ 3D IMAGE TILT (throttled) ═══ */
var imgTilts=document.querySelectorAll('.about-img,.svc-circle,.abt-story-img,.abt-member-img');
imgTilts.forEach(function(el){
  var imgTick=false;
  el.addEventListener('mousemove',function(e){
    if(imgTick)return;imgTick=true;
    requestAnimationFrame(function(){
      var r=el.getBoundingClientRect();
      var x=(e.clientX-r.left)/r.width-0.5;
      var y=(e.clientY-r.top)/r.height-0.5;
      el.style.transform='perspective(600px) rotateX('+(-y*15)+'deg) rotateY('+(x*15)+'deg) scale(1.03)';
      imgTick=false;
    });
  });
  el.addEventListener('mouseleave',function(){el.style.transition='transform .6s cubic-bezier(.22,1,.36,1)';el.style.transform='perspective(600px) rotateX(0) rotateY(0) scale(1)';});
  el.addEventListener('mouseenter',function(){el.style.transition='transform .12s ease-out';});
});

/* ═══ PROOF ITEMS 3D (throttled) ═══ */
var proofCards=document.querySelectorAll('.proof-item');
proofCards.forEach(function(card){
  var proofTick=false;
  card.addEventListener('mousemove',function(e){
    if(proofTick)return;proofTick=true;
    requestAnimationFrame(function(){
      var r=card.getBoundingClientRect();
      var x=(e.clientX-r.left)/r.width-0.5;
      var y=(e.clientY-r.top)/r.height-0.5;
      card.style.transform='perspective(600px) rotateX('+(-y*8)+'deg) rotateY('+(x*8)+'deg) translateY(-4px)';
      proofTick=false;
    });
  });
  card.addEventListener('mouseleave',function(){card.style.transition='transform .5s cubic-bezier(.22,1,.36,1)';card.style.transform='perspective(600px) rotateX(0) rotateY(0) translateY(0)';});
  card.addEventListener('mouseenter',function(){card.style.transition='transform .12s ease-out';});
});

/* ═══ FLOATING ORBS (CSS only, no JS overhead) ═══ */
var hero=heroEl||document.querySelector('.hero');
if(hero && !hero.querySelector('.float-orb')){
  var orbStyle=document.createElement('style');
  orbStyle.textContent='@keyframes orbFloat{from{transform:translateY(0)}to{transform:translateY(-20px)}}.float-orb{position:absolute;border-radius:50%;pointer-events:none;background:radial-gradient(circle,rgba(198,161,91,.06),transparent 70%);animation:orbFloat 8s ease-in-out infinite alternate;z-index:1}';
  document.head.appendChild(orbStyle);
  for(var i=0;i<3;i++){
    var orb=document.createElement('div');
    orb.className='float-orb';
    orb.style.cssText='opacity:'+(0.04+i*0.015)+';width:'+(180+i*60)+'px;height:'+(180+i*60)+'px;left:'+(10+i*25)+'%;top:'+(15+i*20)+'%;animation-duration:'+(7+i*2)+'s;animation-delay:'+(i*0.6)+'s';
    hero.appendChild(orb);
  }
}

/* ═══ GOLDEN DUST PARTICLES (OPTIMIZED) ═══ */
var particleTargets=document.querySelectorAll('.hero,.svc-hero,.abt-hero');
particleTargets.forEach(function(heroSection){
  var canvas=document.createElement('canvas');
  canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:3';
  heroSection.style.position=heroSection.style.position||'relative';
  heroSection.appendChild(canvas);
  var ctx=canvas.getContext('2d');
  var particles=[];
  var count=25; /* reduced from 50 */
  var mouse={x:-9999,y:-9999};
  var animId=null;
  var visible=true;

  function resize(){
    var w=heroSection.offsetWidth,h=heroSection.offsetHeight;
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
  }
  resize();
  window.addEventListener('resize',resize);

  heroSection.addEventListener('mousemove',function(e){
    var r=canvas.getBoundingClientRect();
    mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;
  },{passive:true});
  heroSection.addEventListener('mouseleave',function(){mouse.x=-9999;mouse.y=-9999;},{passive:true});

  /* Pre-create particles */
  for(var i=0;i<count;i++){
    particles.push({
      x:Math.random()*2000,y:Math.random()*1200,
      size:Math.random()*1.5+0.5,
      speedX:(Math.random()-0.5)*0.2,
      speedY:(Math.random()-0.5)*0.15-0.05,
      opacity:Math.random()*0.4+0.1,
      pulse:Math.random()*6.28,
      pulseSpeed:Math.random()*0.015+0.005,
      hue:Math.random()>0.7?43:38
    });
  }

  /* Use a single offscreen circle to stamp particles instead of gradients */
  var stampSize=8;
  var stamp=document.createElement('canvas');
  stamp.width=stampSize*2;stamp.height=stampSize*2;
  var sctx=stamp.getContext('2d');
  var sg=sctx.createRadialGradient(stampSize,stampSize,0,stampSize,stampSize,stampSize);
  sg.addColorStop(0,'rgba(228,189,81,0.7)');
  sg.addColorStop(0.5,'rgba(198,161,91,0.2)');
  sg.addColorStop(1,'rgba(198,161,91,0)');
  sctx.fillStyle=sg;
  sctx.beginPath();sctx.arc(stampSize,stampSize,stampSize,0,6.28);sctx.fill();

  function animate(){
    if(!visible){animId=requestAnimationFrame(animate);return;}
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(var i=0;i<count;i++){
      var p=particles[i];
      p.pulse+=p.pulseSpeed;
      var alpha=p.opacity*(0.6+Math.sin(p.pulse)*0.4);

      /* Mouse repel (skip sqrt for perf) */
      var dx=p.x-mouse.x,dy=p.y-mouse.y;
      var d2=dx*dx+dy*dy;
      if(d2<14400){
        var d=Math.sqrt(d2);
        var force=(120-d)/120*1.5;
        p.x+=dx/d*force;p.y+=dy/d*force;
      }

      p.x+=p.speedX;p.y+=p.speedY;
      if(p.x<-10)p.x=canvas.width+10;
      if(p.x>canvas.width+10)p.x=-10;
      if(p.y<-10)p.y=canvas.height+10;
      if(p.y>canvas.height+10)p.y=-10;

      ctx.globalAlpha=alpha;
      ctx.drawImage(stamp,p.x-stampSize,p.y-stampSize);
    }
    ctx.globalAlpha=1;
    animId=requestAnimationFrame(animate);
  }

  /* Only animate when hero is visible */
  var heroObs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      visible=e.isIntersecting;
    });
  },{threshold:0});
  heroObs.observe(heroSection);

  animate();
});

})();
