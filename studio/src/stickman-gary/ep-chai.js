// 2026-11-07 IG reel "Being kind in this economy" (chai + samosa). Style: FLAT BRIGHT DESI CARTOON (reference style 2):
// thick outlines, saturated flat colours, filled chunky bodies, huge faces; plus one MACRO INSERT (the wallet).
// Kalu offers the auto driver a chai, has only Rs 10 for two, driver orders a samosa too. Ends on Kalu's silent crushed face.
import {W,H,INK,bind,setBoil,ease,back,lerp,clamp,line,shape,rect,oval,dot,text,drop,face,caption,groupWords,finish,ring} from './engine.js';
const META=await (await fetch('/data/meta.json')).json();
const ENV=await (await fetch('/data/env.json')).json();
export const DUR=META.dur;
const S=META.starts,E=META.ends;
let c,groups=[],words=[];
const KEYS=/^(chai|samosa|bees|rupaye\.?|chai,?)$/i;
export function init(ctxx,w){c=ctxx;bind(c);words=w;groups=groupWords(w)}
const pr=(t,a,b)=>clamp((t-a)/(b-a));
const LW=10;
const env=(k,t)=>{const a=ENV[k];if(!a)return 0;const i=Math.floor(t*30);return a[Math.min(a.length-1,Math.max(0,i))]||0};
const cam=(z,x,y,sh,t,fn,rot)=>{c.save();const dx=sh?Math.sin(t*71)*sh:0,dy=sh?Math.cos(t*93)*sh:0;c.translate(W/2+dx,H/2+dy);if(rot)c.rotate(rot);c.scale(z,z);c.translate(-x,-y);fn();c.restore()};
// ---------- palette ----------
const P={sky:'#7FD4F5',wallA:'#F47EA6',wallB:'#3FC1B0',wallC:'#FFB03B',road:'#9A8F86',pave:'#E8C9A0',
 kSkin:'#7A4A2E',kShirt:'#FFC531',kPant:'#2F5DA8',dSkin:'#B9784C',dShirt:'#C9A86A',dPant:'#6B5B45',cSkin:'#D99566',
 autoG:'#2DA44E',autoY:'#FFD60A',wood:'#B86B32',steel:'#C9D2DA'};
// thick capsule limb: black outline then colour
function limb(pts,w,col){c.lineCap='round';c.lineJoin='round';c.strokeStyle=INK;c.lineWidth=w+LW*2;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();c.strokeStyle=col;c.lineWidth=w;c.stroke()}
function hand(x,y,r,sk){oval(x,y,r,r*.92,sk,LW,INK,1.2)}
// head in local coords (centre 0,0). o: r, skin, hair:'kalu'|'driver'|'bald', mood params passed to engine face()
function head(o){
 const r=o.r,sk=o.skin;
 if(o.hair==='bald'){oval(-r*.98,-r*.05,r*.18,r*.3,'#2A1E18',LW,INK,1)}
 face({...o.f,r,skin:sk,lw:LW,hair:'none'});
 if(o.hair==='kalu'){ // black modern quiff with a funky flick
  shape([[-r*.86,-r*.35],[-r*.84,-r*.9],[-r*.35,-r*1.22],[r*.3,-r*1.5],[r*.95,-r*1.62],[r*.78,-r*1.28],[r*.98,-r*1.1],[r*.86,-r*.5],[r*.4,-r*.82],[-r*.25,-r*.72]],'#151515',LW,INK,1.6)}
 if(o.hair==='driver'){ // oiled side part
  shape([[-r*.86,-r*.25],[-r*.9,-r*.85],[-r*.4,-r*1.15],[r*.4,-r*1.12],[r*.88,-r*.8],[r*.84,-r*.36],[r*.35,-r*.78],[-r*.1,-r*.66],[-r*.45,-r*.82]],'#1E1A18',LW,INK,1.4);line([[-r*.38,-r*.84],[-r*.1,-r*1.12]],LW*.6,'#5A5550',.6)}
 if(o.hair==='bald'){line([[-r*.2,-r*.95],[r*.15,-r*1.0]],LW*.5,'#F3B183',.4)}
 if(o.stache){const y=r*.38;shape([[-r*.42,y+r*.02],[-r*.1,y-r*.1],[0,y-r*.04],[r*.1,y-r*.1],[r*.42,y+r*.02],[r*.2,y+r*.1],[0,y+r*.02],[-r*.2,y+r*.1]],'#1E1A18',LW*.7,INK,1)}
 if(o.sweat)for(let i=0;i<o.sweat;i++)drop(r*(.95+i*.12),-r*(.6-i*.45),1.4+i*.2);
 if(o.blush){c.save();c.globalAlpha=.35;oval(-r*.55,r*.25,r*.16,r*.09,'#FF5A6E',0);oval(r*.55,r*.25,r*.16,r*.09,'#FF5A6E',0);c.restore()}
}
// chunky person. x,y = between feet. arms: [[elbowDx,elbowDy,handDx,handDy],...] relative to shoulders; legs likewise from hips
function person(o){
 const s=o.s||1;c.save();c.translate(o.x,o.y-(o.hop||0));c.scale(s*(o.flip?-1:1),s);
 const legH=o.sit?0:230,hipY=-legH-(o.sit?0:0),tH=250,tW=o.tw||120,shY=hipY-tH,lean=o.lean||0;
 // legs
 const LG=o.legs||(o.sit?[[-50,0,90,40,140,180],[50,0,150,30,200,180]]:[[-40,0,-48,legH*.5,-55,legH],[40,0,48,legH*.5,55,legH]]);
 for(const l of LG){limb([[l[0],hipY+l[1]],[l[2],hipY+l[3]],[l[4],hipY+l[5]-18]],56,o.pant);shape([[l[4]-44,hipY+l[5]],[l[4]-36,hipY+l[5]-38],[l[4]+30,hipY+l[5]-40],[l[4]+56,hipY+l[5]-6],[l[4]+50,hipY+l[5]+4]],o.shoe||'#5B3A22',LW,INK,1)}
 c.save();c.translate(0,hipY);c.rotate(lean);c.translate(0,-hipY);
 // back arm then torso then front arm
 const A=o.arms||[[-30,110,-40,210],[30,110,40,210]];
 const arm=(a,sx)=>{const p0=[sx,shY+30],p1=[sx+a[0],shY+30+a[1]],p2=[sx+a[2],shY+30+a[3]];limb([p0,p1],58,o.shirt);limb([p1,p2],42,o.skin);hand(p2[0],p2[1],30,o.skin);if(a[4])a[4](p2[0],p2[1])};
 arm(A[0],-tW*.7);
 shape([[-tW*.82,shY+8],[tW*.82,shY+8],[tW*.98,shY+70],[tW*.9,hipY+8],[-tW*.9,hipY+8],[-tW*.98,shY+70]],o.shirt,LW,INK,1.6);
 if(o.belly)oval(0,hipY-70,tW*.92,90,o.shirt,LW,INK,1.4);
 if(o.collar)shape([[-34,shY+6],[0,shY+56],[34,shY+6]],o.collar,LW*.8,INK,.8);
 if(o.pocket)rect(tW*.25,shY+70,52,46,o.pocket,LW*.6,INK,.6);
 if(o.gamcha){shape([[-tW*.8,shY+2],[-tW*.35,shY+2],[-tW*.6,shY+170],[-tW*.9,shY+150]],'#D93B3B',LW*.8,INK,1);line([[-tW*.7,shY+10],[-tW*.78,shY+150]],6,'#FFFFFF',.5)}
 if(o.vest){shape([[-tW*.5,shY+8],[-tW*.3,shY+90],[tW*.3,shY+90],[tW*.5,shY+8]],o.skin,LW*.7,INK,.8)}
 // head
 c.save();c.translate(0,shY-(o.r||120)*.86);c.rotate(o.tilt||0);if(o.nod){c.translate(0,o.nod*30)}
 limb([[0,(o.r||120)*.7],[0,(o.r||120)*.95]],60,o.skin);
 head({r:o.r||120,skin:o.skin,hair:o.hair,f:o.f,stache:o.stache,sweat:o.sweat,blush:o.blush});
 c.restore();
 arm(A[1],tW*.7);
 c.restore();
 c.restore();
}
const mouthOf=(k,t,base='smile')=>{const a=env(k,t);return a>.12?{mouth:'open',open:clamp(a*1.3,.25,1)}:{mouth:base}};
// ---------- props ----------
function sun(x,y){oval(x,y,70,70,'#FFE14D',LW,INK,1.6)}
function cloud(x,y,s){for(const[a,b,r]of[[0,0,70],[80,-20,90],[170,10,70],[90,30,80]])oval(x+a*s,y+b*s,r*s,r*.7*s,'#fff',LW*.7,INK,1.4)}
function buildings(off=0){
 c.fillStyle=P.sky;c.fillRect(-800,-800,W+1600,2000);
 cloud(80-off*.2,300,1);cloud(700-off*.2,220,.8);sun(900-off*.1,330);
 const B=[[-700,P.wallC,520],[-260,P.wallA,640],[160,P.wallB,560],[560,P.wallA,700],[960,P.wallC,600],[1380,P.wallB,660]];
 for(const[x,col,h]of B){const X=x-off*.5;rect(X,1180-h,420,h+40,col,LW,INK,2);
  for(let r=0;r<2;r++)for(let k=0;k<2;k++){const wx=X+70+k*170,wy=1180-h+90+r*190;if(wy<1060){rect(wx,wy,110,120,'#FFF3D6',LW*.8,INK,1);line([[wx+55,wy],[wx+55,wy+120]],6,INK,.6);rect(wx-12,wy+120,134,18,'#7A4A2E',LW*.6,INK,.6)}}
  // little balcony plant
  oval(X+330,1180-h+60,36,28,'#2DA44E',LW*.7,INK,1)}
 c.fillStyle=P.pave;c.fillRect(-800,1180,W+1600,120);line([[-800,1180],[W+800,1180]],LW);
 c.fillStyle=P.road;c.fillRect(-800,1300,W+1600,1200);line([[-800,1300],[W+800,1300]],LW);
 for(let i=-4;i<8;i++)rect(i*300-off%300,1560,160,20,'#FFFFFF',0);
}
// auto rickshaw, side view facing left. origin = ground under the middle. seat at about (-20,-360)
function auto(x,y,wr=0,shake=0){
 c.save();c.translate(x,y+Math.sin(shake*40)*4*(shake>0?1:0));
 const wheel=(cx,r)=>{oval(cx,-r,r,r,'#2A2A2A',LW,INK,1.2);oval(cx,-r,r*.45,r*.45,P.steel,LW*.7,INK,.8);line([[cx-Math.cos(wr)*r*.45,-r-Math.sin(wr)*r*.45],[cx+Math.cos(wr)*r*.45,-r+Math.sin(wr)*r*.45]],6,INK,.5)};
 // canopy (black) and frame
 shape([[-300,-560],[-250,-640],[260,-640],[300,-560],[300,-500],[-300,-500]],'#1F1F1F',LW,INK,1.6);
 line([[-280,-500],[-300,-260]],14,INK,1);line([[280,-500],[280,-200]],14,INK,1);
 // body: green lower, yellow nose
 shape([[-330,-120],[-360,-240],[-330,-330],[-250,-400],[-120,-420],[-120,-120]],P.autoY,LW,INK,1.6);
 shape([[-140,-120],[-140,-300],[320,-300],[340,-220],[330,-120]],P.autoG,LW,INK,1.6);
 rect(30,-300,260,40,'#1F1F1F',LW*.8,INK,.8); // seat back
 shape([[-360,-250],[-410,-260],[-410,-215],[-358,-208]],'#FFF',LW*.8,INK,.8); // headlight
 line([[-210,-420],[-170,-470],[-110,-468]],12,INK,1); // handlebar
 wheel(-250,70);wheel(220,80);
 c.restore();
}
function stall(){
 // counter, kettle on stove, glass box with samosas, bench
 c.fillStyle='#FFE7B0';c.fillRect(-800,-800,W+1600,2000);
 rect(-800,180,W+1600,1100,'#F47EA6',0);
 // tin roof stripes
 for(let i=-6;i<12;i++)shape([[i*150,120],[i*150+150,120],[i*150+130,260],[i*150-20,260]],i%2?'#3FC1B0':'#FFFFFF',LW*.8,INK,1);
 line([[-800,260],[W+800,260]],LW);
 // shelf with jars
 rect(-200,420,1500,26,P.wood,LW,INK,1);
 for(let i=0;i<6;i++){const x=-120+i*220;shape([[x,420],[x+10,300],[x+120,300],[x+130,420]],'#CFF3F0',LW*.8,INK,1);oval(x+65,296,62,16,i%2?'#FF5A3C':'#FFC531',LW*.6,INK,.6);for(let k=0;k<3;k++)oval(x+35+k*30,390,16,16,i%2?'#FFB03B':'#E85D75',0)}
 // floor
 c.fillStyle='#C9B79C';c.fillRect(-800,1280,W+1600,1200);line([[-800,1280],[W+800,1280]],LW);
}
function counter(){c.save();c.translate(0,320);
 rect(-300,880,1680,420,P.wood,LW,INK,1.6);
 for(let i=0;i<8;i++)line([[-280+i*210,900],[-280+i*210,1290]],6,'#8A4E22',.8);
 rect(-320,860,1720,40,'#E0A060',LW,INK,1);c.translate(300,0);
 // stove + kettle
 rect(450,800,220,60,'#555',LW*.8,INK,.8);
 shape([[470,800],[490,640],[640,640],[660,800]],P.steel,LW,INK,1.4);oval(565,630,80,22,P.steel,LW,INK,1);oval(565,606,24,14,'#333',LW*.7,INK,.6);
 line([[470,700],[400,640],[395,610]],14,INK,1);line([[660,660],[720,700],[705,780]],12,INK,1);
 // samosa glass box
 c.save();c.translate(180,0);shape([[-420,860],[-400,690],[0,690],[20,860]],'rgba(200,240,255,.65)',LW,INK,1.2);
 for(const[x,y]of[[-330,830],[-240,830],[-150,830],[-60,830],[-290,770],[-200,770],[-110,770]])sam(x,y,1);
 c.restore();c.restore()}
function sam(x,y,s){shape([[x-46*s,y],[x,y-64*s],[x+46*s,y]],'#E8A33D',LW*.8,INK,1);line([[x-20*s,y-10*s],[x+8*s,y-40*s]],5,'#B8741E',.6)}
function glass(x,y,s=1,full=1,steam=0,t=0){
 c.save();c.translate(x,y);c.scale(s,s);
 shape([[-34,-90],[34,-90],[26,0],[-26,0]],'rgba(230,248,255,.85)',LW*.8,INK,.8);
 if(full>0)shape([[-31,-90+80*(1-full)],[31,-90+80*(1-full)],[26,0],[-26,0]],'#C98B4E',0);
 shape([[-34,-90],[34,-90],[26,0],[-26,0]],null,LW*.8,INK,.8);
 if(steam){c.save();c.globalAlpha=.7;for(let i=0;i<2;i++){const ph=t*3+i*2;line([[-12+i*24,-100],[-22+i*24+Math.sin(ph)*8,-150],[-8+i*24,-200]],7,'#FFFFFF',.6)}c.restore()}
 c.restore();
}
function note10(x,y,s,rot){c.save();c.translate(x,y);c.rotate(rot);c.scale(s,s);
 shape([[-170,-80],[-40,-96],[60,-74],[170,-88],[176,70],[60,86],[-60,66],[-176,84]],'#E8A06A',LW,INK,2.2);
 shape([[-140,-56],[140,-62],[144,52],[-146,56]],null,6,'#9A5A30',1.6);
 oval(-70,0,46,46,'#F2C09A',6,'#9A5A30',1);text('10',70,4,92,'#7A3E1C',{w:900});
 for(const q of[[-150,-70,-120,-20],[90,-80,60,-30],[120,50,150,10]])line([[q[0],q[1]],[q[2],q[3]]],5,'#9A5A30',.8);
 c.restore()}
function wallet(open,t){
 // macro view of hands opening a brown wallet. centre of the frame
 c.fillStyle='#FFE7B0';c.fillRect(-800,-800,W+1600,3000);
 c.save();c.globalAlpha=.4;for(let i=0;i<14;i++){const a=i/14*6.283;line([[540+Math.cos(a)*300,900+Math.sin(a)*300],[540+Math.cos(a)*900,900+Math.sin(a)*900]],30,'#FFFFFF',.4)}c.restore();
 const o=ease(open),L=lerp(0,-1,o);
 // inside
 rect(150,620,780,560,'#6B3A1E',LW,INK,1.6);
 rect(190,660,700,480,'#8A4E2A',LW*.7,INK,1);
 for(let i=0;i<3;i++)line([[200,760+i*40],[880,760+i*40]],6,'#5A2E16',.6);
 if(o>.4)note10(540,980,lerp(.6,1,ease(pr(o,.4,1))),-.08+Math.sin(t*3)*.01);
 // left flap swinging open
 c.save();c.translate(150,900);c.scale(Math.cos(o*Math.PI*.85)*1+.0001,1);rect(0,-280,390,560,'#7A4426',LW,INK,1.6);c.restore();
 // thumbs
 hand(150,1060,62,P.kSkin);hand(930,1060,62,P.kSkin);
 // a single dust mote floats out (empty-wallet gag)
 if(o>.6){const u=pr(t,META.ends[5]+.3,META.ends[5]+1.2);c.save();c.globalAlpha=1-u;for(let i=0;i<3;i++)oval(500+i*60+Math.sin(t*4+i)*10,760-u*260-i*30,8,8,'#E8D9C0',3,INK,.4);c.restore()}
}
// ---------- characters ----------
const kalu=(o)=>({r:118,skin:P.kSkin,shirt:P.kShirt,pant:P.kPant,hair:'kalu',shoe:'#F2F2F2',collar:'#E8A800',...o});
const driver=(o)=>({r:120,skin:P.dSkin,shirt:P.dShirt,pant:P.dPant,hair:'driver',stache:true,belly:true,gamcha:true,pocket:'#B8965A',tw:132,shoe:'#5B3A22',...o});
const chaiwala=(o)=>({r:124,skin:P.cSkin,shirt:'#F5F5F0',pant:'#3A6EA5',hair:'bald',stache:true,vest:true,tw:140,...o});
// driver seated in the auto (local to auto origin)
function driverInAuto(t,f,arms){person(driver({x:-20,y:-300,s:.95,sit:true,legs:[[-40,0,-150,10,-200,160]],arms:arms||[[-60,80,-170,-60],[60,90,-150,-50]],f}))}
// ---------- scenes ----------
const SC=[];const at=(a,b,fn)=>SC.push([a,b,fn]);
const t0=S[0],t1=S[1],t2=S[2],t3=S[3],t4=S[4],t5=S[5],t6=S[6];
const WAL=E[5]-.02,END=DUR;
// 1. wide street: auto rolls in, Kalu steps out and asks
at(0,t1-.05,(t)=>{const arr=ease(pr(t,0,.55)),ax=lerp(1400,560,arr);const z=lerp(1.0,1.18,ease(pr(t,.4,t1)));
 cam(z,560,1050,0,t,()=>{buildings(0);auto(ax,1430,-t*12*(1-arr),0);c.save();c.translate(ax,1430);driverInAuto(t,{brow:.2,eye:1,pupil:.32,look:[1,0],...mouthOf('d',t,'smile')});c.restore();
  if(t>.5){const u=ease(pr(t,.5,.9));person(kalu({x:lerp(ax+200,ax+420,u),y:1440,s:.95,f:{brow:.3,eye:1,pupil:.32,look:[-1,0],...mouthOf('k',t,'smile')},arms:[[-30,110,-70,190],[60,60,-60,-20]],blush:true}))}})});
// 2. driver close-up: shy polite no (hand wave)
at(t1-.05,t2-.04,(t)=>{const z=lerp(2.0,2.15,pr(t,t1,t2));const wave=Math.sin(t*14)*24;
 cam(z,450,960,0,t,()=>{buildings(60);auto(560,1430,0,0);c.save();c.translate(560,1430);driverInAuto(t,{brow:-.4,eye:.95,pupil:.3,look:[1,.1],...mouthOf('d',t,'smile')},[[-60,80,-170,-60],[110,-40,190+wave,-190]]);c.restore()})});
// 3. Kalu close-up: insists, hand on chest
at(t2-.04,t3-.02,(t)=>{const z=lerp(2.05,2.25,pr(t,t2,t3));
 cam(z,880,960,0,t,()=>{buildings(140);auto(560,1430,0,0);person(kalu({x:900,y:1440,s:.95,tilt:-.06,f:{brow:.6,eye:1.05,pupil:.3,look:[-1,0],...mouthOf('k',t,'grin')},arms:[[-30,110,-70,190],[-70,60,-60,-30]],blush:true}))})});
// 4. driver already out of the auto, rushing past Kalu toward the stall (hop, speed lines)
at(t3-.02,E[3]+.15,(t)=>{const u=pr(t,t3,E[3]),z=1.2;const dx=lerp(250,560,ease(u));
 cam(z,600,1080,3,t,()=>{buildings(260+u*120);auto(120,1430,0,0);
  person(driver({x:dx,y:1450,s:.92,hop:Math.abs(Math.sin(t*16))*22,lean:-.1,f:{brow:.9,eye:1.1,pupil:.3,look:[1,0],...mouthOf('d',t,'grin')},arms:[[60,60,150,-20],[-40,90,-120,40]]}));
  person(kalu({x:880,y:1440,s:.92,f:{brow:.9,eye:1.25,pupil:.22,look:[-1,0],mouth:'open',open:.35},arms:[[-30,110,-70,190],[-70,60,-60,-30]]}))});
 speedLines(t,900,7,320,.5)});
// stall layout: counter top y=1180, samosa box x 60-500 on the counter, kettle x 750-970, chaiwala behind at x 620
const STOOL=(x)=>{rect(x-90,1560,180,36,P.wood,LW,INK,1);line([[x-60,1596],[x-70,1760]],16,INK,1);line([[x+60,1596],[x+70,1760]],16,INK,1)};
const CW=(t,f,arms)=>person(chaiwala({x:620,y:1620,s:.9,f,arms:arms||[[60,90,120,160],[-60,90,-100,160]]}));
// 5. tea stall wide: both sipping, driver lounging on a stool slurping, chaiwala behind
at(E[3]+.15,t4-.05,(t)=>{const z=lerp(1.0,1.08,pr(t,E[3],t4));const sip=Math.sin(t*5)>.3;
 cam(z,540,1080,0,t,()=>{stall();CW(t,{brow:0,eye:.8,pupil:.34,look:[-1,0],mouth:'flat'});counter();STOOL(250);
  person(driver({x:250,y:1560,s:.92,sit:true,legs:[[-50,0,40,60,60,200],[50,0,140,20,120,200]],f:{eyes:'closed',brow:.2,mouth:sip?'open':'smile',open:.4},arms:[[-60,80,-120,40],[60,80,110,-30,(x,y)=>glass(x+20,y+10,.9,.7,1,t)]]}));
  person(kalu({x:830,y:1770,s:.92,f:{brow:.2,eye:1,pupil:.32,look:[-1,0],mouth:'smile'},arms:[[-30,110,-60,190],[-70,40,-80,-40,(x,y)=>glass(x-10,y+10,.9,.6,1,t)]],blush:true}))})});
// 6. chaiwala close-up: "Bees rupaye", palm out
at(t4-.05,t5-.04,(t)=>{const z=lerp(2.0,2.2,pr(t,t4,t5));
 cam(z,600,1120,0,t,()=>{stall();CW(t,{brow:-.2,eye:.8,pupil:.34,look:[-.3,.1],...mouthOf('c',t,'flat')},[[60,90,140,40],[-60,90,-100,160]]);counter()})});
// 7. Kalu proud, wallet out in front of his chest
const KX=560,KY=1760;
at(t5-.04,WAL,(t)=>{const z=lerp(1.85,2.05,pr(t,t5,WAL));const u=ease(pr(t,t5+.15,WAL-.1));
 cam(z,KX,KY-560,0,t,()=>{stall();counter();person(kalu({x:KX,y:KY,s:.95,f:{brow:.5,eye:1,pupil:.32,look:[0,0],...mouthOf('k',t,'grin')},arms:[[-30,110,-70,190],[60,90,lerp(80,-10,u),lerp(190,40,u),(x,y)=>rect(x-55,y-45,110,76,'#7A4426',LW*.8,INK,.8)]]}))})});
// 8. MACRO INSERT: wallet opens, one sad crumpled Rs 10 (BGM cuts out here)
at(WAL,WAL+.62,(t)=>{const u=pr(t,WAL,WAL+.45);const z=lerp(1.25,1.45,pr(t,WAL,WAL+.62));cam(z,540,920,0,t,()=>wallet(u,t))});
// 9. punch-in on Kalu realising (frozen, tiny pupils)
at(WAL+.62,t6-.02,(t)=>{const z=lerp(2.6,3.0,ease(pr(t,WAL+.62,t6)));
 cam(z,KX,KY-540,2,t,()=>{stall();counter();person(kalu({x:KX,y:KY,s:.95,sweat:1,f:{brow:.9,eye:1.35,pupil:.14,look:[0,0],mouth:'flat'},arms:[[-30,110,-70,190],[60,90,-10,40,(x,y)=>rect(x-55,y-45,110,76,'#7A4426',LW*.8,INK,.8)]]}))})});
// 10. payoff two-shot: driver lounging, already sliding open the samosa box; Kalu frozen in front
at(t6-.02,E[6]+.2,(t)=>{const z=lerp(1.0,1.08,pr(t,t6,E[6]));const reach=ease(pr(t,t6,t6+.8));
 cam(z,540,1080,0,t,()=>{stall();CW(t,{brow:.6,eye:1,pupil:.3,look:[-1,0],mouth:'flat'});counter();STOOL(250);
  person(driver({x:250,y:1560,s:.92,sit:true,legs:[[-50,0,40,60,60,200],[50,0,140,20,120,200]],f:{brow:.3,eye:.95,pupil:.32,look:[.6,-.2],...mouthOf('d',t,'grin')},arms:[[60,80,-90,40,(x,y)=>glass(x,y+20,.9,.1,0,t)],[40,-60,lerp(110,-60,reach),lerp(-30,-330,reach),(x,y)=>reach>.6&&sam(x-30,y-20,1.6)]]}));
  person(kalu({x:830,y:1880,s:1.12,sweat:2,f:{brow:.9,eye:1.35,pupil:.14,look:[-.8,0],mouth:'flat'},arms:[[-30,110,-70,190],[60,90,-10,40,(x,y)=>rect(x-55,y-45,110,76,'#7A4426',LW*.8,INK,.8)]]}))})});
// 11. silent crushed face, slow push-in, eye twitch, hard stop
at(E[6]+.2,END+.1,(t)=>{const u=ease(pr(t,E[6]+.2,END));const z=lerp(2.4,3.3,u);const tw=Math.sin(t*40)>.6&&t>E[6]+.7?1:0;
 cam(z,KX,KY-560+u*20,tw?3:0,t,()=>{stall();counter();person(kalu({x:KX,y:KY,s:.95,sweat:2,nod:u*.6,f:{brow:-1,eye:1.15,pupil:.24,look:[0,.5],mouth:'wobble'},arms:[[-30,110,-70,190],[30,110,40,210]]}));
  // heavy droopy lids (drawn over the eyes)
  const r=118,hx=KX,hy=KY+(-480-r*.86+u*.6*30)*.95;c.save();c.translate(hx,hy);c.scale(.95,.95);const ey=-r*.2,R=r*.34*1.15,X0=r*.33*1.15*.98,d=lerp(.45,.8,u);
  for(const q of[-1,1]){const X=q*X0;c.save();c.beginPath();c.ellipse(X,ey,R+6,R*1.12+6,0,0,7);c.clip();c.fillStyle=P.kSkin;c.fillRect(X-R-8,ey-R*1.2-8,2*R+16,d*2*R*1.12+8);c.restore();line([[X-R*.95,ey-R*1.12+d*2*R*1.12],[X+R*.95,ey-R*1.12+d*2*R*1.12]],LW,INK,.6)}c.restore()})});
function speedLines(t,y0,n=9,len=360,al=.75){c.save();c.globalAlpha=al;for(let i=0;i<n;i++){const y=y0+((i*97)%520)-120,x=((-(t*1900)+i*311)%1500+1500)%1500-200;line([[x,y],[x+len*(.5+((i*37)%10)/10),y]],8,'#FFFFFF',1)}c.restore()}
export function draw(t){setBoil(Math.floor(t*10));c.save();c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,W,H);c.fillStyle='#FFE7B0';c.fillRect(0,0,W,H);
 for(const[a,b,fn]of SC)if(t>=a&&t<b){fn(t);break}
 c.restore();
 text('Being kind in',W/2,250,78,'#FFFFFF',{stroke:'#000',sw:17});
 text('this economy',W/2,350,78,'#FFD93B',{stroke:'#000',sw:17});
 caption(groups,t,KEYS,1650);finish(t)}
export const cues=[];
