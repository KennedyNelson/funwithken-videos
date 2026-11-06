// 2026-11-07 IG reel "Personal space: girls vs boys" v2. TWO scenes only: girls (0-4 s), boys (4 s on). Green roadside, no buildings.
// Boys ride until BRAKE (10 s), then funny get-off. Voice only, NO BGM (the owner adds an Instagram audio later).
import {W,H,INK,bind,setBoil,ease,back,lerp,clamp,line,shape,rect,oval,dot,text,drop,face,caption,groupWords,finish,ring} from './engine.js';
const META=await (await fetch('/data/meta.json')).json();
export const DUR=META.dur;
const ROAD=1250,SX=540,FOOT=1110,TB=META.tb,BR=META.brake;
let c,groups=[],words=[],LS=0,LE=0;
const KEYS=/^(congested|peeche|hai!?)$/i;
export function init(ctxx,w){c=ctxx;bind(c);words=w;groups=groupWords(w);LS=w[0].s;LE=w[w.length-1].e}
const pr=(t,a,b)=>clamp((t-a)/(b-a));
const md=(a,n)=>((a%n)+n)%n;
const talk=(t)=>words.some(w=>t>=w.s-.03&&t<=w.e+.05);
const flap=(t,on)=>on?.3+.7*Math.abs(Math.sin(t*22)):.12;
const cam=(z,x,y,sh,t,fn,rot)=>{c.save();const dx=sh?Math.sin(t*71)*sh:0,dy=sh?Math.cos(t*93)*sh:0;c.translate(W/2+dx,H/2+dy);if(rot)c.rotate(rot);c.scale(z,z);c.translate(-x,-y);fn();c.restore()};
const tile=(off,w,fn)=>{const k0=Math.floor((-700-off)/w);for(let k=k0;off+k*w<W+700;k++)fn(off+k*w,k)};
function cloud(x,y,s){for(const[a,b,r]of[[0,0,70],[80,-20,90],[170,10,70],[90,30,80]])oval(x+a*s,y+b*s,r*s,r*.7*s,'#fff',5,INK,1.4)}
// scroll distance (px) of the street: steady, then brakes to a stop
const SPD=(t)=>t<TB?820:1000;
function scrollAt(t){const a=Math.min(t,TB)*820+Math.max(0,Math.min(t,BR)-TB)*1000;if(t<=BR)return a;const D=.7,tau=t-BR;if(tau<=D){const u=tau/D;return a+1000*(tau-D*(u**3-u**4/2))}return a+1000*D*.5}
// ---------- green roadside ----------
function tree(x,s,k){line([[x,FOOT-30],[x+4,FOOT-300*s]],14*s,'#6B4A2B',2);oval(x,FOOT-370*s,130*s,112*s,k%2?'#58B15E':'#4FA956',7,INK,2.2);oval(x-62*s,FOOT-300*s,82*s,64*s,k%2?'#58B15E':'#4FA956',7,INK,1.8);oval(x+70*s,FOOT-310*s,78*s,60*s,k%2?'#63BD66':'#58B15E',7,INK,1.8)}
function street(sc){
 c.fillStyle='#8FD3F2';c.fillRect(-900,-600,W+1800,FOOT+700);
 tile(-(sc*.08)%1400,1400,(x,k)=>cloud(x+200,360+md(k,2)*90,1));
 oval(900-(sc*.03)%300,420,64,64,'#FFD84A',7,INK,2);
 // far hills
 tile(-(sc*.12)%1300,1300,(x)=>{c.fillStyle='#8FD97F';c.beginPath();c.ellipse(x+320,FOOT,520,300,0,Math.PI,0);c.fill();line([[x-200,FOOT],[x+320,FOOT-300],[x+840,FOOT]],5,INK,1);c.fillStyle='#74C86A';c.beginPath();c.ellipse(x+960,FOOT,460,230,0,Math.PI,0);c.fill()});
 // trees and bushes
 tile(-(sc*.45)%900,900,(x,k)=>{tree(x+140,1.0,k);tree(x+520,.8,k+1);tree(x+800,1.1,k+2);oval(x+330,FOOT-40,90,60,'#4FA956',7,INK,2);oval(x+690,FOOT-36,70,50,'#58B15E',7,INK,2)});
 // grass verge
 c.fillStyle='#86D46C';c.fillRect(-900,FOOT-20,W+1800,150);c.fillStyle='#74C45E';c.fillRect(-900,FOOT+60,W+1800,70);line([[-900,FOOT-20],[W+900,FOOT-20]],6);
 tile(-(sc*.95)%170,170,(x,k)=>{const h=18+md(k,3)*8;line([[x,FOOT+110],[x-8,FOOT+110-h],[x+4,FOOT+110-h*1.4]],5,'#3E8F3E',1);line([[x+14,FOOT+110],[x+22,FOOT+110-h],[x+14,FOOT+110-h*1.5]],5,'#3E8F3E',1)});
 tile(-(sc*.95)%310,310,(x,k)=>{const y=FOOT+30+md(k,3)*26;for(let i=0;i<5;i++){const a=i/5*6.283;oval(x+Math.cos(a)*11,y+Math.sin(a)*11,8,8,'#FFFFFF',3,INK,.6)}dot(x,y,7,'#FFD93B')});
 // road
 c.fillStyle='#7E8896';c.fillRect(-900,FOOT+130,W+1800,H);line([[-900,FOOT+130],[W+900,FOOT+130]],6);
 tile(-(sc)%260,260,(x)=>rect(x,ROAD+170,150,16,'#FFFFFF',0));
}
// ---------- scooter (local: origin on the ground between wheels, up is -y, faces +x) ----------
function wheel(cx,cy,r,rot){oval(cx,cy,r,r,'#3A3A3A',9,INK,1.6);oval(cx,cy,r*.5,r*.5,'#D5DCE4',6,INK,1.2);for(let i=0;i<3;i++){const a=rot+i*Math.PI/3.0;line([[cx-Math.cos(a)*r*.5,cy-Math.sin(a)*r*.5],[cx+Math.cos(a)*r*.5,cy+Math.sin(a)*r*.5]],5,INK,.8)}}
function scooterBody(rot,col='#2FA6A0'){
 wheel(-150,-62,62,rot);wheel(190,-62,62,rot);
 shape([[-235,-122],[-218,-250],[-110,-262],[14,-252],[14,-132],[-60,-102],[-165,-96]],col,8,INK,2);
 shape([[-205,-258],[-195,-284],[4,-284],[22,-260]],'#2B2B2B',7,INK,1.4);
 shape([[-26,-134],[158,-134],[158,-104],[-26,-104]],col,7,INK,1.6);
 shape([[132,-106],[168,-330],[208,-330],[222,-106]],col,8,INK,2);
 shape([[118,-150],[190,-172],[262,-130],[252,-108],[150,-120]],col,7,INK,1.6);
 line([[190,-330],[170,-392],[120,-396]],10,INK,1.4);oval(226,-286,22,26,'#FFE066',6,INK,1.2);
 line([[-226,-262],[-262,-262],[-262,-232],[-228,-226]],8,INK,1);
}
const ik=(a,b,L1,L2,dir)=>{let dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy);const m=L1+L2-1;if(d>m){dx*=m/d;dy*=m/d;d=m}if(d<1)d=1;
 const aa=(L1*L1-L2*L2+d*d)/(2*d),h=Math.sqrt(Math.max(0,L1*L1-aa*aa));
 return {mid:[a[0]+dx*aa/d+dir*h*(-dy/d),a[1]+dy*aa/d+dir*h*(dx/d)],end:[a[0]+dx,a[1]+dy]}};
// person in side view. x,y = hip; feet / hands are ABSOLUTE targets (same coordinate frame as x,y). rot turns the whole body about the hip.
function sitter(o,part){
 const L=115,r=o.r||64,lean=o.lean||0,Lt=o.torso||125,sk=o.skin||'#F4EFE3',col=o.col||'#E8607A';
 c.save();c.translate(o.x,o.y);if(o.rot)c.rotate(o.rot);
 const sh=[Math.sin(lean)*Lt,-Math.cos(lean)*Lt],n=[Math.cos(lean),Math.sin(lean)];
 if(part==='body'){
  for(const f of (o.feet||[[110,-132]])){const k=ik([0,0],[f[0]-o.x,f[1]-o.y],L,L,-1);line([[0,0],k.mid,k.end],8,INK,1.5);const [fx,fy]=k.end;shape([[fx-10,fy],[fx-6,fy-26],[fx+30,fy-30],[fx+50,fy-12],[fx+52,fy+6],[fx-10,fy+6]],o.shoe||'#F4EFE3',6,INK,1)}
  shape([[-n[0]*48,-n[1]*48+6],[n[0]*48,n[1]*48+6],[sh[0]+n[0]*38,sh[1]+n[1]*38],[sh[0]-n[0]*38,sh[1]-n[1]*38]],col,8,INK,2);
  const hc=[sh[0]+Math.sin(lean)*(r*.95+10)+(o.hx||0),sh[1]-Math.cos(lean)*(r*.95+10)+(o.hy||0)];
  c.save();c.translate(hc[0],hc[1]);c.rotate(o.tilt||0);
  if(o.hairBack)o.hairBack(r);
  face({...o.face,r,skin:sk,lw:7});
  if(o.hairFront)o.hairFront(r);
  c.restore();
 }else{
  for(const h of (o.hands||[])){const s0=[sh[0]+(h.sx||0),sh[1]+(h.sy||0)];const k=ik(s0,[h.x-o.x,h.y-o.y],95,95,h.dir||1);line([s0,k.mid,k.end],8,INK,1.5);dot(k.end[0],k.end[1],17)}
 }
 c.restore();
}
const bun=r=>{oval(-r*.1,-r*1.28,r*.36,r*.3,'#2B1B16',6,INK,1.4)};
const longHair=r=>{shape([[-r*1.0,-r*.8],[-r*.2,-r*1.15],[r*.9,-r*.8],[r*.95,r*.2],[r*.6,r*1.9],[-r*.9,r*1.95],[-r*1.1,r*.3]],'#5A3A22',7,INK,1.8)};
// ---------- scene 1: the girls ----------
function girlsRide(t,fr){
 const bounce=Math.sin(t*16)*3,wr=-t*9;
 c.save();c.translate(0,bounce);scooterBody(wr);
 const tk=talk(t),fx=lerp(-165,-262,fr),flean=lerp(.28,-.04,fr);
 const rFace=t<LS?{brow:.2,mouth:'smile',look:[1,0]}:t<LE+.05?{brow:-1,eye:1.05,pupil:.3,mouth:tk?'open':'flat',open:flap(t,tk),look:[-1,.1]}:{brow:.5,mouth:'smile',eye:1,pupil:.34,look:[1,0]};
 const fFace=fr<.5?{brow:.3,mouth:'grin',eye:1.05,pupil:.32,look:[1,0]}:{brow:.8,mouth:'wobble',eye:1.15,pupil:.26,look:[1,.2]};
 const F={x:fx,y:-285,lean:flean,face:{hair:'quiff',hairFill:'#5A3A22',...fFace},skin:'#E9B48E',col:'#F2A93B',hairBack:longHair,feet:[[lerp(-105,-300,fr),lerp(-150,-125,fr)]],tilt:lerp(.1,0,fr)};
 sitter(F,'body');
 sitter({x:-55,y:-285,lean:.18,face:{hair:'afro',hairFill:'#2B1B16',...rFace},skin:'#F2C9A5',col:'#E8607A',hairFront:bun,feet:[[120,-132]]},'body');
 sitter({...F,hands:[fr<.5?{x:-80,y:-300,dir:-1}:{x:-250,y:-255,dir:1}]},'arms');
 sitter({x:-55,y:-285,lean:.18,hands:[{x:125,y:-392}]},'arms');
 c.restore();
}
// ---------- scene 2: the boys ----------
const BOYS=[
 {x:-205,col:'#8E5BD0',skin:'#F2C9A5',hair:'#2B2B2B',f:{brow:-.4,eye:1.25,pupil:.2,mouth:'flat',look:[1,-.2]}},
 {x:-125,col:'#D9534F',skin:'#8A5A3C',hair:'#1A1A1A',f:{eyes:'closed',brow:0,mouth:'flat',look:[1,0]}},
 {x:-45,col:'#3E8F63',skin:'#C68A5E',hair:'#3A2A22',f:{brow:.1,eye:.95,pupil:.3,mouth:'smile',look:[1,0]}},
 {x:35,col:'#4A7BD0',skin:'#E8B98F',hair:'#1A1A1A',f:{brow:.5,eye:1,pupil:.3,mouth:'flat',look:[1,0]}}];
// the flat boy ("bullet"), belly down, superman pose, centre at (x,y). headUp turns the head up toward the camera.
function bullet(x,y,wind,headUp=0){
 c.save();c.translate(x,y);
 line([[-80,-6],[-215,4]],10,INK,2);line([[-80,12],[-215,24]],10,INK,2);
 for(const dy of[4,24])shape([[-215,dy-12],[-250,dy-14],[-262,dy+10],[-215,dy+14]],'#EDEDED',6,INK,1);
 shape([[-100,-30],[60,-28],[74,0],[60,28],[-100,30]],'#F08A24',8,INK,2);
 line([[40,-6],[200,-26],[255,-30]],9,INK,1.6);dot(258,-30,16);line([[40,8],[190,-2],[245,-4]],9,INK,1.6);dot(248,-4,16);
 c.save();c.translate(104,-6);c.rotate(.04-headUp);
 if(wind){for(let i=0;i<3;i++)line([[-62,-26+i*14],[-130-i*20,-20+i*16+Math.sin(wind*30+i)*6]],7,INK,1)}
 face({hair:'quiff',hairFill:'#2A2A2A',brow:headUp?.3:0,eye:headUp?1.1:.92,pupil:.3,mouth:'flat',look:headUp?[0,0]:[1,0],r:62,skin:'#D9A47A',lw:7});c.restore();
 c.restore();
}
function puff(x,y,u){if(u<=0||u>=1)return;c.save();c.globalAlpha=.85*(1-u);for(let i=0;i<4;i++)oval(x+(i-1.5)*34*(.4+u),y-10-u*30-(i%2)*14,26+u*34,20+u*26,'#FFFFFF',5,INK,1);c.restore()}
// exit schedule (local coords, ground contact y = G)
const G=55,HIP=-188;                       // standing hip height above the ground line
const T_DROP=BR+1.2,T_PUR=BR+1.55,T_RED=BR+1.95,T_GRN=BR+2.35,T_BLU=BR+2.8,T_ROLL=BR+3.2;
function stand(x,ph,run){ // legs for a standing figure; run: gait phase
 if(run!==undefined){const a=Math.sin(run),b=-a;return [[x+a*60+10,G-Math.max(0,Math.cos(run))*50],[x+b*60+10,G-Math.max(0,-Math.cos(run))*50]]}
 return [[x+30,G],[x-14,G]]}
function boyLook(i,t,riding){ // faces: deadpan while riding, then shocked / dazed
 const b=BOYS[i],after=t>BR+.7;
 if(!after)return {hair:'quiff',hairFill:b.hair,...b.f};
 return {hair:'quiff',hairFill:b.hair,brow:.7,eye:1.3,pupil:.16,mouth:'open',open:.6,look:[0,0]};
}
function boysScene(t){
 const brk=pr(t,BR,BR+.7),bump=Math.sin(Math.PI*pr(t,BR,BR+.9))*(1-ease(pr(t,BR+.5,BR+.9)))+0;
 const bounce=Math.sin(t*20)*4*(1-brk),wr=-(scrollAt(t))/62;
 const enter=pr(t,TB+.05,TB+.75),sxo=lerp(-480,0,ease(enter));
 const rollX=t>T_ROLL?700*Math.pow(t-T_ROLL,2):0;
 const tilt=-.03*(1-ease(brk));
 const lean=.05+.38*bump;
 // scooter (rolls away riderless at the end)
 c.save();c.translate(sxo+rollX,0);c.translate(0,bounce);c.rotate(tilt);scooterBody(wr-rollX/62,'#D9534F');c.restore();
 // who is still on the scooter
 const onS=[t<T_PUR,t<T_RED,t<T_GRN,t<T_BLU];
 c.save();c.translate(sxo,bounce);c.rotate(tilt);
 const seated=BOYS.map((b,i)=>({i,b})).filter(o=>onS[o.i]);
 const dropped=t>=T_DROP;
 const rest=(b)=>[{x:b.x+20,y:-300,dir:-1}];
 const mk=(b,i)=>({x:b.x,y:-285,lean:lean+i*.01,r:60,face:boyLook(i,t),skin:b.skin,col:b.col,feet:[i===3?[110,-132]:[b.x+25,-160]],shoe:'#EDEDED'});
 seated.forEach(({i,b})=>sitter(mk(b,i),'body'));
 if(!dropped)bullet(-20+30*bump,-338+8*bump,t);
 seated.forEach(({i,b})=>sitter({...mk(b,i),hands:dropped?rest(b):(i===3?[{x:125,y:-392},{x:b.x+6,y:-332,dir:-1}]:[{x:b.x+14,y:-332,dir:-1}])},'arms'));
 if(t<T_PUR||t<T_RED){const p=(t*1.6)%1;if(t<T_PUR)drop(-262,-520+p*80,.9)}
 c.restore();
 // ---- after the stop: everyone leaves the scooter in a different silly way (static frame) ----
 c.save();c.translate(sxo,0);
 // the flat boy drops to the road, bounces once, then lifts his head and looks at the camera
 if(dropped){const tau=t-T_DROP,gy=G-30,y0=-338;let y;const fall=.42;
  if(tau<fall)y=lerp(y0,gy,tau*tau/(fall*fall));else{const b=tau-fall;y=gy-Math.abs(Math.sin(b*9))*28*Math.exp(-b*3.6)}
  const x=-20+30+50*ease(pr(tau,0,fall+.2));
  bullet(x,y,0,ease(pr(t,BR+3.1,BR+3.6))*.55);
  puff(x-60,G+10,pr(tau,fall,fall+.5));puff(x+90,G+10,pr(tau,fall+.1,fall+.6))}
 // purple: backflip off the tail
 if(t>=T_PUR){const u=pr(t,T_PUR,T_PUR+.8),b=BOYS[0];const x=lerp(b.x,-420,ease(u)),y=lerp(-285,HIP+G,u)-Math.sin(Math.PI*u)*210,rot=-6.283*ease(u);
  const landed=u>=1;sitter({x,y,rot:landed?0:rot,lean:landed?0:.05,r:60,face:boyLook(0,t),skin:b.skin,col:b.col,feet:landed?stand(x):[[x+20,y+225],[x-20,y+225]],shoe:'#EDEDED'},'body');
  sitter({x,y,rot:landed?0:rot,lean:0,hands:landed?[{x:x+45,y:y-290,dir:-1},{x:x-45,y:y-290,dir:1}]:[{x:x+60,y:y-200,dir:-1}]},'arms');
  if(landed)puff(x,G+8,pr(t,T_PUR+.8,T_PUR+1.3))}
 // red: slides down the back and sits on the road, dazed
 if(t>=T_RED){const u=pr(t,T_RED,T_RED+.6),b=BOYS[1],e=ease(u);const x=lerp(b.x,-300,e),y=lerp(-285,G-32,e*e),rot=-.5*Math.sin(Math.PI*u)-.1*u;
  sitter({x,y,rot,lean:.12,r:60,face:u<1?boyLook(1,t):{hair:'quiff',hairFill:b.hair,eyes:'x',brow:0,mouth:'wobble'},skin:b.skin,col:b.col,feet:[[x+110,G-4],[x+80,G-4]],shoe:'#EDEDED'},'body');
  sitter({x,y,rot,lean:.12,hands:[{x:x+70,y:y-30,dir:1}]},'arms');
  if(u>=1){const k=pr(t,T_RED+.6,T_RED+1.4);for(let i=0;i<3;i++){const a=t*7+i*2.1;star(x-10+Math.cos(a)*60,y-230+Math.sin(a)*14,15,'#F4C430',5)}puff(x-30,G+8,k)}}
 // green: jumps off the front, trips and face-plants
 if(t>=T_GRN){const u=pr(t,T_GRN,T_GRN+.55),v=ease(pr(t,T_GRN+.55,T_GRN+1.05)),b=BOYS[2];
  const x=lerp(b.x,170,ease(u))+50*v,y=u<1?lerp(-285,HIP+G,u)-Math.sin(Math.PI*u)*140:lerp(HIP+G,G-48,v),rot=1.5*v;
  const fl=u<1?[[x+20,y+225],[x-20,y+225]]:[[x,y+226],[x-30,y+226]];
  sitter({x,y,rot,lean:0,r:60,face:v>.9?{hair:'quiff',hairFill:b.hair,eyes:'x',brow:0,mouth:'wobble'}:boyLook(2,t),skin:b.skin,col:b.col,feet:fl,shoe:'#EDEDED'},'body');
  sitter({x,y,rot,lean:0,hands:[{x:x+60,y:y-170,dir:1},{x:x+30,y:y-250,dir:-1}]},'arms');
  puff(x+30,G+8,pr(t,T_GRN+1.0,T_GRN+1.5))}
 // blue (driver): steps off, looks at the empty road, the scooter rolls away riderless, he runs after it
 if(t>=T_BLU){const u=pr(t,T_BLU,T_BLU+.5),b=BOYS[3];const run=t>T_ROLL+.15;
  const sx=sxo; // run in the same frame
  const x=run?lerp(110,1100,ease(pr(t,T_ROLL+.15,DUR+.4)))*1:lerp(35,110,ease(u)),y=run?HIP+G-Math.abs(Math.sin((t-T_ROLL)*14))*26:lerp(-285,HIP+G,u)-Math.sin(Math.PI*u)*90;
  sitter({x,y,rot:run?.12:0,lean:run?.2:0,r:60,face:run?{hair:'quiff',hairFill:b.hair,brow:.9,eye:1.4,pupil:.16,mouth:'scream',open:1,look:[1,0]}:boyLook(3,t),skin:b.skin,col:b.col,feet:run?stand(x,0,(t-T_ROLL)*14):stand(x),shoe:'#EDEDED'},'body');
  sitter({x,y,rot:run?.12:0,lean:run?.2:0,hands:run?[{x:x+110,y:y-250+Math.sin(t*14)*30,dir:-1},{x:x+90,y:y-210,dir:1}]:[{x:x+10,y:y-170,dir:1},{x:x+40,y:y-300,dir:-1}]},'arms')}
 c.restore();
}
function star(x,y,r,fill,n){const p=[];for(let i=0;i<n*2;i++){const a=i/(n*2)*6.283-1.57,q=i%2?r*.5:r;p.push([x+Math.cos(a)*q,y+Math.sin(a)*q])}shape(p,fill,4,INK,.6)}
export function draw(t){setBoil(Math.floor(t*10));c.save();c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,W,H);
 const sc=scrollAt(t);
 if(t<TB-.1){ // scene 1: girls. slow push-in on the faces, then back out as the friend scoots away
  const fr=t<LE-.05?0:back(pr(t,LE-.05,LE+.55)),fre=clamp(fr,0,1.12);
  const e1=ease(pr(t,0,1.7)),e2=ease(pr(t,LE-.1,LE+.8));
  const z=lerp(lerp(1.4,2.15,e1),1.3,e2),cx=lerp(lerp(SX-30,SX-95,e1),SX-80,e2),cy=lerp(lerp(ROAD-330,ROAD-545,e1),ROAD-340,e2);
  cam(z,cx,cy,t<LE?4:1,t,()=>{street(sc);c.save();c.translate(SX,ROAD);girlsRide(t,fre);c.restore();if(t>.9&&t<LE)drop(SX-35,ROAD-640+((t*3)%1)*60,1.1)});
 }else if(t<TB+.1){ // whip pan between the two scenes
  const u=pr(t,TB-.1,TB+.1);
  cam(1.3,SX-80+u*1500,ROAD-340,0,t,()=>{street(sc);c.save();c.translate(SX,ROAD);girlsRide(t,1);c.restore()});
  c.save();c.globalAlpha=.6;for(let i=0;i<12;i++)line([[-100,200+i*150],[W+100,200+i*150]],24,'#FFFFFF',1);c.restore();
 }else{ // scene 2: the boys, then the get-off (camera pulls back to show everybody)
  const pull=ease(pr(t,BR,BR+1.1)),push=pr(t,TB,Math.min(BR,DUR));
  const z=lerp(lerp(1.12,1.28,push),1.0,pull),cx=lerp(SX-30,SX-110,pull),cy=lerp(ROAD-300,ROAD-230,pull);
  cam(z,cx,cy,t<BR?2:0,t,()=>{street(sc);c.save();c.translate(SX,ROAD);boysScene(t);c.restore()});
  if(t<BR)speedLines(t,ROAD-420,6,300,.45);
 }
 c.restore();
 text('Personal space:',W/2,300,74,'#FFFFFF',{stroke:'#000',sw:16});
 text('girls vs boys',W/2,390,74,'#FFD93B',{stroke:'#000',sw:16});
 caption(groups,t,KEYS,1640);finish(t)}
function speedLines(t,y0,n=9,len=360,al=.75){c.save();c.globalAlpha=al;for(let i=0;i<n;i++){const y=y0+((i*97)%520)-120,x=((-(t*1900)+i*311)%1500+1500)%1500-200;line([[x,y],[x+len*(.5+((i*37)%10)/10),y]],6,'#FFFFFF',1)}c.restore()}
export const cues=[];
