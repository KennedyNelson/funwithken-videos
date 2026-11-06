// 2026-11-07 IG reel "Personal space: girls vs boys" on a scooter. Bright Indian street, voices + light BGM only, no SFX.
// Part 1: two girls, the friend sits too close, the rider complains, friend scoots back. Part 2: five boys, four sitting, one flat like a bullet (silent).
import {W,H,INK,bind,setBoil,ease,back,lerp,clamp,line,shape,rect,oval,dot,text,drop,face,man,caption,groupWords,finish,ring} from './engine.js';
const META=await (await fetch('/data/meta.json')).json();
export const DUR=META.dur;
const ROAD=1250,SX=540,FOOT=1110;
let c,groups=[],words=[],LS=0,LE=0,TB=0;
const KEYS=/^(congested|peeche|hai!?)$/i;
export function init(ctxx,w){c=ctxx;bind(c);words=w;groups=groupWords(w);LS=w[0].s;LE=w[w.length-1].e;TB=META.tb}
const pr=(t,a,b)=>clamp((t-a)/(b-a));
const talk=(t)=>words.some(w=>t>=w.s-.03&&t<=w.e+.05);
const flap=(t,on)=>on?.3+.7*Math.abs(Math.sin(t*22)):.12;
const cam=(z,x,y,sh,t,fn,rot)=>{c.save();const dx=sh?Math.sin(t*71)*sh:0,dy=sh?Math.cos(t*93)*sh:0;c.translate(W/2+dx,H/2+dy);if(rot)c.rotate(rot);c.scale(z,z);c.translate(-x,-y);fn();c.restore()};
const tile=(off,w,fn)=>{const k0=Math.floor((-700-off)/w);for(let k=k0;off+k*w<W+700;k++)fn(off+k*w,k)};
const md=(a,n)=>((a%n)+n)%n;
const PAST=['#F9D6D5','#FFE9A8','#CDEBD3','#CFE3F7','#F8D0E6','#FDDDB5'];
const AWN=[['#E8607A','#FFFFFF'],['#3E8F63','#FFFFFF'],['#F4A62A','#FFFFFF'],['#4A7BD0','#FFFFFF']];
function cloud(x,y,s){for(const[a,b,r]of[[0,0,70],[80,-20,90],[170,10,70],[90,30,80]])oval(x+a*s,y+b*s,r*s,r*.7*s,'#fff',5,INK,1.4)}
// scrolling bright street. sc = distance scrolled to the left (px)
function street(sc,o={}){
 c.fillStyle='#8FD3F2';c.fillRect(-900,-600,W+1800,FOOT+700);
 tile(-(sc*.08)%1400,1400,(x,k)=>cloud(x+200,360+md(k,2)*90,1));
 oval(900-(sc*.03)%300,420,64,64,'#FFD84A',7,INK,2);
 // far skyline
 tile(-(sc*.25)%1500,1500,(x,k)=>{[[0,380,200],[210,520,170],[390,300,220],[620,460,190],[820,350,230],[1060,540,160],[1230,330,240]].forEach(([dx,h,w],i)=>{rect(x+dx,FOOT-h,w,h+40,PAST[md(i+k,6)],6,INK,2);for(let r=0;r<Math.floor(h/130);r++)for(let q=0;q<2;q++)rect(x+dx+30+q*(w/2-5),FOOT-h+40+r*120,w/4,64,'#9AD8F5',5,INK,1)})});
 // mid shops
 tile(-(sc*.6)%1100,1100,(x,k)=>{[[0,330],[370,360],[760,320]].forEach(([dx,w],i)=>{const sx=x+dx,[a,b]=AWN[md(i+k,4)];
   rect(sx,FOOT-330,w-24,330,PAST[md(i*2+k+1,6)],7,INK,2);rect(sx+24,FOOT-170,w-72,170,'#5A4636',6,INK,1.5);
   for(let s=0;s<6;s++){shape([[sx-8+s*(w-8)/6,FOOT-300],[sx-8+(s+1)*(w-8)/6,FOOT-300],[sx-8+(s+1)*(w-8)/6,FOOT-230],[sx-8+s*(w-8)/6,FOOT-230]],s%2?b:a,5,INK,1)}
   rect(sx+30,FOOT-130,70,110,'#FFD93B',5,INK,1);rect(sx+w-120,FOOT-150,60,130,'#E8607A',5,INK,1)})});
 // footpath + road
 c.fillStyle='#E7DABB';c.fillRect(-900,FOOT,W+1800,110);line([[-900,FOOT],[W+900,FOOT]],6);
 c.fillStyle='#7E8896';c.fillRect(-900,FOOT+110,W+1800,H);line([[-900,FOOT+110],[W+900,FOOT+110]],6);
 tile(-(sc)%260,260,(x)=>rect(x,ROAD+170,150,16,'#FFFFFF',0));
}
// ---------- scooter (local coords: origin on the ground between wheels, y up is negative, faces +x) ----------
function wheel(cx,cy,r,rot){oval(cx,cy,r,r,'#3A3A3A',9,INK,1.6);oval(cx,cy,r*.5,r*.5,'#D5DCE4',6,INK,1.2);for(let i=0;i<3;i++){const a=rot+i*Math.PI/3.0*2/2;line([[cx-Math.cos(a)*r*.5,cy-Math.sin(a)*r*.5],[cx+Math.cos(a)*r*.5,cy+Math.sin(a)*r*.5]],5,INK,.8)}}
function scooterBody(rot,col='#2FA6A0'){
 wheel(-150,-62,62,rot);wheel(190,-62,62,rot);
 shape([[-235,-122],[-218,-250],[-110,-262],[14,-252],[14,-132],[-60,-102],[-165,-96]],col,8,INK,2);
 shape([[-205,-258],[-195,-284],[4,-284],[22,-260]],'#2B2B2B',7,INK,1.4);
 shape([[-26,-134],[158,-134],[158,-104],[-26,-104]],col,7,INK,1.6);
 shape([[132,-106],[168,-330],[208,-330],[222,-106]],col,8,INK,2);
 shape([[118,-150],[190,-172],[262,-130],[252,-108],[150,-120]],col,7,INK,1.6);
 line([[190,-330],[170,-392],[120,-396]],10,INK,1.4);oval(226,-286,22,26,'#FFE066',6,INK,1.2);
 // little grab rail at the back
 line([[-226,-262],[-262,-262],[-262,-232],[-228,-226]],8,INK,1);
}
const ik=(a,b,L1,L2,dir)=>{let dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy);const m=L1+L2-1;if(d>m){dx*=m/d;dy*=m/d;d=m}if(d<1)d=1;
 const aa=(L1*L1-L2*L2+d*d)/(2*d),h=Math.sqrt(Math.max(0,L1*L1-aa*aa));
 return {mid:[a[0]+dx*aa/d+dir*h*(-dy/d),a[1]+dy*aa/d+dir*h*(dx/d)],end:[a[0]+dx,a[1]+dy]}};
// seated person in side view. o: x,y = hip (scooter coords), lean, face, hand(s), feet, hair(), col, skin, part:'body'|'arms'
function sitter(o,part){
 const L=115,r=o.r||64,lean=o.lean||0,Lt=o.torso||125,sk=o.skin||'#F4EFE3',col=o.col||'#E8607A';
 c.save();c.translate(o.x,o.y);
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
  for(const h of (o.hands||[])){const s0=[sh[0]+(h.sx||0),sh[1]+(h.sy||0)];const k=ik(s0,[h.x-o.x,h.y-o.y],95,95,h.dir||1);if(part!=='hands')line([s0,k.mid,k.end],8,INK,1.5);if(part!=='armsOnly')dot(k.end[0],k.end[1],17)}
 }
 c.restore();
}
const bun=r=>{oval(-r*.1,-r*1.28,r*.36,r*.3,'#2B1B16',6,INK,1.4)};
const longHair=r=>{shape([[-r*1.0,-r*.8],[-r*.2,-r*1.15],[r*.9,-r*.8],[r*.95,r*.2],[r*.6,r*1.9],[-r*.9,r*1.95],[-r*1.1,r*.3]],'#5A3A22',7,INK,1.8)};
// ---------- the two rides ----------
function girlsRide(t,fr){ // fr: friend position 0 = too close, 1 = far back
 const bounce=Math.sin(t*16)*3,wr=-t*9;
 c.save();c.translate(0,bounce);scooterBody(wr);
 const tk=talk(t),fx=lerp(-165,-262,fr),flean=lerp(.28,-.04,fr);
 const rFace=t<LS+.0?{brow:.2,mouth:'smile',look:[1,0]}:t<LE+.05?{brow:-.9,eye:1.05,pupil:.3,mouth:tk?'open':'flat',open:flap(t,tk),look:[-1,.1]}:{brow:.5,mouth:'smile',eye:1,pupil:.34,look:[1,0],eyes:undefined};
 // friend (behind): leans in, then perches on the tail
 const slide=t>LE-.05,fFace=fr<.5?{brow:.3,mouth:'grin',eye:1.05,pupil:.32,look:[1,0]}:{brow:.8,mouth:'wobble',eye:1.15,pupil:.26,look:[1,.2]};
 sitter({x:fx,y:-285,lean:flean,face:{hair:'quiff',hairFill:'#5A3A22',...fFace},skin:'#E9B48E',col:'#F2A93B',hairBack:longHair,feet:[[lerp(-105,-300,fr),lerp(-150,-125,fr)]],tilt:lerp(.1,0,fr)},'body');
 sitter({x:-55,y:-285,lean:.18,face:{hair:'afro',hairFill:'#2B1B16',...rFace},skin:'#F2C9A5',col:'#E8607A',hairFront:bun,feet:[[120,-132]]},'body');
 // friend's hands: waist when close, back rail when far
 sitter({x:fx,y:-285,lean:flean,hands:[fr<.5?{x:-80,y:-300,dir:-1}:{x:-250,y:-255,dir:1}],skin:'#E9B48E'},'arms');
 sitter({x:-55,y:-285,lean:.18,hands:[{x:125,y:-392}]},'arms');
 c.restore();
}
// five boys: four sitting, one flat across their laps like a bullet
const BOYS=[
 {x:-205,col:'#8E5BD0',skin:'#F2C9A5',face:{hair:'quiff',hairFill:'#2B2B2B',brow:-.4,eye:1.25,pupil:.2,mouth:'flat',look:[1,-.2]}},
 {x:-125,col:'#D9534F',skin:'#8A5A3C',face:{hair:'quiff',hairFill:'#1A1A1A',eyes:'closed',brow:0,mouth:'flat',look:[1,0]}},
 {x:-45,col:'#3E8F63',skin:'#C68A5E',face:{hair:'quiff',hairFill:'#3A2A22',brow:.1,eye:.95,pupil:.3,mouth:'smile',look:[1,0]}},
 {x:35,col:'#4A7BD0',skin:'#E8B98F',face:{hair:'quiff',hairFill:'#1A1A1A',brow:.5,eye:1,pupil:.3,mouth:'flat',look:[1,0]}}];
function bullet(x,y,wind){ // flat boy, superman pose, belly down; centre at (x,y)
 c.save();c.translate(x,y);
 const sk='#D9A47A';
 line([[-80,-6],[-215,4]],10,INK,2);line([[-80,12],[-215,24]],10,INK,2);
 for(const dy of[4,24])shape([[-215,dy-12],[-250,dy-14],[-262,dy+10],[-215,dy+14]],'#EDEDED',6,INK,1);
 shape([[-100,-30],[60,-28],[74,0],[60,28],[-100,30]],'#F08A24',8,INK,2);
 line([[40,-6],[200,-26],[255,-30]],9,INK,1.6);dot(258,-30,16);line([[40,8],[190,-2],[245,-4]],9,INK,1.6);dot(248,-4,16);
 c.save();c.translate(104,-6);c.rotate(.04);
 // flying hair
 if(wind){for(let i=0;i<3;i++)line([[-62,-26+i*14],[-130-i*20,-20+i*16+Math.sin(wind*30+i)*6]],7,INK,1)}
 face({hair:'quiff',hairFill:'#2A2A2A',brow:0,eye:.92,pupil:.3,mouth:'flat',look:[1,0],r:62,skin:sk,lw:7});c.restore();
 c.restore();
}
function boysRide(t,u){ // u: time since arrival
 const bounce=Math.sin(t*20)*4,wr=-t*10;
 c.save();c.translate(0,bounce);c.rotate(-.03);scooterBody(wr,'#D9534F');
 const HB=(b,i)=>({x:b.x,y:-285,lean:.05+i*.01,hands:i===3?[{x:125,y:-392},{x:b.x+8,y:-640,dir:-1}]:[{x:b.x+14,y:-640,dir:-1},{x:b.x-14,y:-640,dir:1}],skin:b.skin});
 BOYS.forEach((b,i)=>sitter(HB(b,i),'armsOnly'));
 BOYS.forEach((b,i)=>sitter({x:b.x,y:-285,lean:.05+i*.01,r:60,face:b.face,skin:b.skin,col:b.col,feet:[i===3?[110,-132]:[b.x+25,-160]],shoe:'#EDEDED'},'body'));
 bullet(-40,-655,t);
 BOYS.forEach((b,i)=>sitter(HB(b,i),'hands'));
 // sweat on the rear boy
 const p=(t*1.6)%1;drop(-262,-520+p*80,.9);
 c.restore();
}
function ride(kind,x,y,s,flip,t,fr,u){c.save();c.translate(x,y);c.scale(flip*s,s);kind==='g'?girlsRide(t,fr):boysRide(t,u);c.restore()}
function speedLines(t,y0,n=9,len=360,al=.75){c.save();c.globalAlpha=al;for(let i=0;i<n;i++){const y=y0+((i*97)%520)-120,x=((-(t*1900)+i*311)%1500+1500)%1500-200;line([[x,y],[x+len*(.5+((i*37)%10)/10),y]],6,'#FFFFFF',1)}c.restore()}
// ---------- tea stall + uncle ----------
function teaStall(t){
 c.fillStyle='#8FD3F2';c.fillRect(-300,-300,W+600,H+600);
 rect(-60,FOOT-760,W+120,760,'#FDDDB5',7,INK,2);
 for(let s=0;s<8;s++)shape([[-60+s*(W+120)/8,FOOT-760],[-60+(s+1)*(W+120)/8,FOOT-760],[-60+(s+1)*(W+120)/8,FOOT-640],[-60+s*(W+120)/8,FOOT-640]],s%2?'#FFFFFF':'#E8607A',6,INK,1);
 for(let i=0;i<7;i++){const x=60+i*150;line([[x,FOOT-640],[x,FOOT-590]],4);rect(x-34,FOOT-590,68,92,['#FFD93B','#4A7BD0','#E8607A'][i%3],5,INK,1)}
 rect(-60,FOOT-190,W+120,190,'#B98C5E',8,INK,2);
 // kettle + glasses
 oval(190,FOOT-262,70,70,'#C9CFD6',7,INK,1.6);line([[250,FOOT-262],[320,FOOT-300]],10);line([[140,FOOT-318],[240,FOOT-318]],8);
 for(let i=0;i<4;i++)rect(600+i*58,FOOT-248,36,58,'#E9F7FF',5,INK,.8);
 c.fillStyle='#E7DABB';c.fillRect(-300,FOOT,W+600,100);c.fillStyle='#7E8896';c.fillRect(-300,FOOT+100,W+600,H);
}
function uncle(t,u){ // u seconds into shot
 const see=ease(pr(u,.55,.7));
 const hand=[40,-210+see*10];
 const face0={hair:'strand',brow:see*.9,eye:1+.7*see,pupil:.34-.2*see,mouth:see>.5?'scream':'flat',open:.5+.5*Math.abs(Math.sin(u*14)),look:[lerp(0,-1,see),lerp(.4,0,see)]};
 man({x:540,y:FOOT+240,s:1.08,body:'#EFE6CF',skin:'#B9805A',legH:240,torso:230,legs:[[-40,-120,-60,0],[40,-120,60,0]],arms:[[-60,110,-70,200],[70,70,40,-8]],tilt:.1*see,face:face0});
 // the glass + tea running over once he sees them
 const hx=540+ (40)*1.08, hy=FOOT+240-(240+230-18+6-8)*1.08+8;
 rect(hx-26,hy-40+see*12,52,70,'#E9F7FF',6,INK,.8);
 if(see>0){for(let i=0;i<5;i++){const p=((u-.7)*2.2+i*.2)%1;if(u>.7)drop(hx-34-i*4,hy+30+p*220,.8,'#B0763C')}}
}
export function draw(t){setBoil(Math.floor(t*10));c.save();c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,W,H);
 const sc=t*(t<TB?820:1000);
 const b1=TB,b2=TB+1.6,b3=TB+3.0,b4=TB+4.2,b5=TB+5.3,b6=TB+6.1;
 const t1=LS+.1,t2=LS+1.45,t3=LE-.1;
 const fr=t<LE-.05?0:back(pr(t,LE-.05,LE+.5));
 const fre=clamp(fr,0,1.12);
 if(t<t1){ // wide: they ride along, friend way too close
  cam(1.42,SX-30,ROAD-330,2,t,()=>{street(sc);ride('g',SX,ROAD,1,1,t,0)});
 }else if(t<t2){ // close-up on the rider's face, friend's grin looming behind
  const z=lerp(2.0,2.3,pr(t,t1,t2));
  cam(z,SX-90,ROAD-540,3,t,()=>{street(sc);ride('g',SX,ROAD,1,1,t,0)});
 }else if(t<t3){ // glare while she says it; sweat drops, friend still on her shoulder
  const u=pr(t,t2,t3);
  cam(lerp(2.4,2.9,u),SX-100,ROAD-555,5,t,()=>{street(sc);ride('g',SX,ROAD,1,1,t,0);drop(SX-30,ROAD-640+(t*3%1)*60,1.1)});
 }else if(t<TB-.12){ // wide: friend slides back to the very tail; big polite gap
  const u=pr(t,t3,TB);
  cam(lerp(1.25,1.4,u),SX-80,ROAD-340,0,t,()=>{street(sc);ride('g',SX,ROAD,1,1,t,fre)});
 }else if(t<TB+.08){ // whip pan
  const u=pr(t,TB-.12,TB+.08);
  cam(1.1,SX+u*1400-700,ROAD-330,0,t,()=>{street(sc);ride('g',SX,ROAD,1,1,t,1)});
  c.save();c.globalAlpha=.55;for(let i=0;i<12;i++)line([[-100,200+i*150],[W+100,200+i*150]],24,'#FFFFFF',1);c.restore();
 }else if(t<b2){ // boys arrive: scooter rolls into frame with the bullet on top
  const u=pr(t,TB+.08,b2),x=lerp(-420,SX,ease(u));
  cam(1.05,SX,ROAD-390,2,t,()=>{street(sc);ride('b',x,ROAD,1,1,t,0,u)});speedLines(t,ROAD-300,7,300,.5);
 }else if(t<b3){ // close-up: the bullet's deadpan face, hair flying
  const u=pr(t,b2,b3);
  cam(lerp(2.3,2.9,u),SX+40,ROAD-655,4,t,()=>{street(sc);ride('b',SX,ROAD,1,1,t,0,1)});speedLines(t,ROAD-760,9,420,.8);
 }else if(t<b4){ // reaction: uncle at the tea stall
  const u=t-b3;
  cam(1.0+.1*pr(t,b3,b4),540,FOOT-200,u>.6?3:0,t,()=>{teaStall(t);uncle(t,u)});
 }else if(t<b5){ // reaction: the girls from the other side, jaws dropped (friend still hanging off the tail)
  const u=pr(t,b4,b5);
  cam(1.15,SX,ROAD-320,2,t,()=>{street(-sc*.8);c.save();c.translate(lerp(1200,-100,u)*.0+0,0);c.restore();girlsLook(t,u)});
 }else if(t<b6){ // macro: the four sitting boys, squeezed together, all deadpan
  fourFaces(t,t-b5);
 }else{ // hero: the bullet, long slow push-in, hard stop on the last frame
  const u=pr(t,b6,DUR);
  cam(lerp(1.1,1.45,u),SX-20,ROAD-420,3,t,()=>{street(sc);ride('b',SX,ROAD,1,1,t,0,1)});speedLines(t,ROAD-450,8,360,.55);
 }
 c.restore();
 text('Personal space:',W/2,300,74,'#FFFFFF',{stroke:'#000',sw:16});
 text('girls vs boys',W/2,390,74,'#FFD93B',{stroke:'#000',sw:16});
 caption(groups,t,KEYS,1640);finish(t)}
// the girls pass the other way, both staring at the boys
function girlsLook(t,u){
 c.save();c.translate(lerp(560,470,ease(u)),ROAD);c.scale(-1,1);
 const wr=-t*9;scooterBody(wr);
 sitter({x:-318,y:-285,lean:-.04,face:{hair:'quiff',hairFill:'#5A3A22',brow:.9,eye:1.5,pupil:.16,mouth:'scream',open:.9,look:[-.2,0]},skin:'#E9B48E',col:'#F2A93B',hairBack:longHair,feet:[[-335,-110]]},'body');
 sitter({x:-55,y:-285,lean:.0,face:{hair:'afro',hairFill:'#2B1B16',brow:.9,eye:1.5,pupil:.16,mouth:'open',open:1,look:[-.3,0]},skin:'#F2C9A5',col:'#E8607A',hairFront:bun,feet:[[120,-132]]},'body');
 sitter({x:-318,y:-285,lean:-.04,hands:[{x:-250,y:-255,dir:1}],skin:'#E9B48E'},'arms');
 sitter({x:-55,y:-285,lean:0,hands:[{x:125,y:-392}]},'arms');
 c.restore();
}
function fourFaces(t,u){
 cam(2.3,SX-120,ROAD-380,0,t,()=>street(t*1400));c.fillStyle='rgba(255,255,255,.18)';c.fillRect(0,0,W,H);speedLines(t,700,10,420,.6);
 c.save();c.translate(W/2+Math.sin(t*60)*4,H/2+Math.cos(t*80)*4);c.scale(1+.05*u,1+.05*u);c.translate(-W/2,-H/2);
 const F=[{x:760,y:930,sk:'#F2C9A5',f:{hair:'quiff',hairFill:'#2B2B2B',brow:-.4,eye:1.3,pupil:.18,mouth:'flat',look:[-.4,.1]},tilt:.12,r:170},
          {x:600,y:960,sk:'#C68A5E',f:{hair:'quiff',hairFill:'#3A2A22',brow:.1,eye:1,pupil:.3,mouth:'smile',look:[-.3,0]},tilt:-.06,r:175},
          {x:430,y:945,sk:'#8A5A3C',f:{hair:'quiff',hairFill:'#1A1A1A',eyes:'closed',brow:0,mouth:'flat'},tilt:.05,r:175},
          {x:290,y:970,sk:'#E8B98F',f:{hair:'quiff',hairFill:'#1A1A1A',brow:.5,eye:1,pupil:.3,mouth:'flat',look:[0,0]},tilt:-.1,r:180}];
 F.forEach(o=>{c.save();c.translate(o.x,o.y);c.rotate(o.tilt);face({...o.f,r:o.r,skin:o.sk,lw:9});c.restore()});
 // a hand squashing a cheek, a sweat drop, the bullet's sock-feet poking in at the bottom
 line([[60,1230],[170,1130],[250,1050]],11,INK,2);dot(255,1045,24);
 drop(870,780+((t*2)%1)*90,1.4);
 c.restore();
}
export const cues=[];
