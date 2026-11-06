// 2026-11-07 IG reel "Never let go": Kalu dead-hangs, friend hypes, grip fails, mom line flips the mood to cinematic.
import {W,H,INK,bind,setBoil,ease,back,lerp,clamp,line,shape,rect,oval,dot,text,star,drop,man,face,walk,caption,groupWords,finish,ring} from './engine.js';
let c,groups=[],words=[],LS=[],LE=[],TS=11.7,DUR=14.8;
export {DUR};
const FLOOR=1330,BARY=420,KX=490,FX=900,S=.85;
const KEYS=/^(mom's|cliff!|drop!|grip\.\.\.|can't\.\.\.|hoga\.\.\.|ten)$/i;
export function init(ctxx,w){c=ctxx;bind(c);words=w;groups=groupWords(w);for(let i=0;i<5;i++){const ws=w.filter(x=>x.line===i);LS[i]=ws[0].s;LE[i]=ws[ws.length-1].e}TS=LE[4]+.34;DUR=TS+3.1}
const pr=(t,a,b)=>clamp((t-a)/(b-a));
const talk=(ln,t)=>words.some(w=>w.line===ln&&t>=w.s-.03&&t<=w.e+.05);
const flap=(t,on)=>on?.3+.7*Math.abs(Math.sin(t*22)):.15;
const cam=(z,x,y,sh,t,fn,rot=0)=>{c.save();const dx=sh?Math.sin(t*71)*sh:0,dy=sh?Math.cos(t*93)*sh:0;c.translate(W/2+dx,H/2+dy);c.rotate(rot);c.scale(z,z);c.translate(-x,-y);fn();c.restore()};
function cloud(x,y,s){for(const[a,b,r]of[[0,0,70],[80,-20,90],[170,10,70],[90,30,80]])oval(x+a*s,y+b*s,r*s,r*.7*s,'#fff',5,INK,1.4)}
function tree(x,s=1,col='#58B15E'){line([[x,FLOOR-80],[x+6,FLOOR-380*s]],12*s,'#6B4A2B',2);oval(x,FLOOR-470*s,150*s,125*s,col,7,INK,2.4);oval(x-70*s,FLOOR-380*s,90*s,70*s,col,7,INK,2)}
function bg(cin,t){
 if(!cin){c.fillStyle='#BFE4F5';c.fillRect(-900,-900,W+1800,H+1800);
  c.fillStyle='#6FBB55';c.beginPath();c.ellipse(260,FLOOR-110,560,230,0,Math.PI,0);c.fill();c.beginPath();c.ellipse(860,FLOOR-90,620,300,0,Math.PI,0);c.fill();
  c.fillStyle='#8FD16A';c.fillRect(-900,FLOOR-100,W+1800,H);
  oval(930,300,64,64,'#FFD84A',7,INK,2);cloud(200,260,1);cloud(760,160,.8);tree(60,1.1);tree(1030,1)}
 else{const g=c.createLinearGradient(0,-600,0,FLOOR);g.addColorStop(0,'#1a1038');g.addColorStop(.45,'#7b2f5e');g.addColorStop(.8,'#f08a3c');g.addColorStop(1,'#ffd07a');c.fillStyle=g;c.fillRect(-900,-900,W+1800,H+1800);
  const r=c.createRadialGradient(KX,BARY+120,20,KX,BARY+120,700);r.addColorStop(0,'rgba(255,214,130,.95)');r.addColorStop(.35,'rgba(255,150,70,.45)');r.addColorStop(1,'rgba(255,120,60,0)');c.fillStyle=r;c.fillRect(-900,-900,W+1800,H+1800);
  c.fillStyle='#24102a';c.beginPath();c.ellipse(240,FLOOR-110,600,260,0,Math.PI,0);c.fill();c.beginPath();c.ellipse(900,FLOOR-90,680,320,0,Math.PI,0);c.fill();
  c.fillStyle='#1a0c1f';c.fillRect(-900,FLOOR-100,W+1800,H);
  for(let i=0;i<26;i++){const p=(t*.12+i*.173)%1;c.globalAlpha=.55*(1-Math.abs(p-.5)*2);dot((i*137)%W+Math.sin(t+i)*30,FLOOR-p*1300,3+(i%3),'#FFE3A0');c.globalAlpha=1}}
 // pull-up bar
 const ink=cin?'#0c0610':INK;
 line([[210,FLOOR-80],[210,BARY]],22,ink,1.4);line([[790,FLOOR-80],[790,BARY]],22,ink,1.4);line([[190,BARY],[810,BARY]],24,cin?'#1a0e1e':'#8a8f99',1.2);if(!cin)line([[190,BARY-6],[810,BARY-6]],6,'#d6dae0',1)}
function kalu(t,cin,tt){
 // state
 const tr=clamp(t/9)*(t<LS[4]?1:.4); const shk=Math.sin(t*38)*(2+tr*9)*(talk(1,t)||talk(3,t)?1.4:1);
 let f,arms=[[-30,-200,-45,-420],[30,-200,45,-420]],tilt=0,squash=0,neckV=60;
 const lookF=t>=LS[4]&&t<TS;
 if(t<LS[1])f={mouth:'flat',brow:.4,eye:1.05,pupil:.3,look:[0,-.3]};
 else if(t<LS[2])f={mouth:'open',open:flap(t,talk(1,t)),brow:.9,eye:1.25,pupil:.2,look:[0,-.4]};
 else if(t<LS[3])f={mouth:'grin',brow:.8,eye:1.2,pupil:.2,look:[0,-.4]};
 else if(t<LS[4])f={mouth:talk(3,t)?'open':'wobble',open:flap(t,talk(3,t)),brow:1,eye:1.35,pupil:.16,look:[0,-.3]};
 else if(t<TS)f={mouth:'flat',brow:lerp(.9,-.5,pr(t,LS[4]+.9,LE[4])),eye:lerp(1.3,1.45,pr(t,LS[4]+.4,LS[4]+1.3)),pupil:.22,look:[0,-.1]};
 else{const d=ease(pr(t,TS+.5,TS+1.5));f={mouth:'flat',brow:-.6,eyes:d>.3?'dots':undefined,eye:1,pupil:.3,look:[0,.4]};tilt=.8*d;squash=.05*d;neckV=60-48*d}
 const sag=t<TS?Math.min(1,t/10)*28:28;
 man({r:122,body:'#3E8F63',tw:60,legH:300,torso:230,neck:neckV,shoe:'#7A4B2A',skin:'#8A5A3C',x:KX+shk,y:BARY+787+sag*S,s:S,arms,tilt,squash,legs:[[-14,-150,-34+Math.sin(t*3)*14,-4],[14,-150,34-Math.sin(t*3)*14,-4]],face:{hair:'quiff',hairFill:'#1A1A1A',...f}});
 // sweat / tears
 if(t>LS[1]&&t<TS){for(let i=0;i<3;i++){const p=(t*1.4+i*.33)%1;drop(KX-70+i*70+shk,BARY+330+p*200,.8,'#8FD3F4')}}
 if(t>=LS[3]&&t<TS){for(let i=0;i<2;i++){const p=(t*1.2+i*.5)%1;drop(i?KX+44:KX-52,BARY+350+p*150,.9,'#6FB7E8')}}
 return}
function friend(t){
 const hype=t<LS[1]?Math.abs(Math.sin(t*9)):t<LS[2]?0:t<LS[3]?Math.abs(Math.sin(t*10)):0;
 let arms,f;
 if(t<LS[1]){arms=[[-50,-90,-80,-230*(.6+.4*hype)],[50,-90,80,-230*(.6+.4*(1-hype))]];f={mouth:talk(0,t)?'open':'smile',open:flap(t,talk(0,t)),brow:.1,look:[-.6,-.6]}}
 else if(t<LS[2]){arms=[[-50,-60,-70,-140],[50,-60,70,-140]];f={mouth:'flat',brow:.3,look:[-.6,-.7]}}
 else if(t<LS[3]){arms=[[-50,-70,-90,-210*(.6+.4*hype)],[50,-70,90,-190]];f={mouth:talk(2,t)?'scream':'grin',open:flap(t,talk(2,t)),brow:.8,eye:1.2,look:[-.6,-.7]}}
 else if(t<LS[4]){arms=[[-50,-60,-70,-140],[50,-60,70,-140]];f={mouth:'wobble',brow:.9,eye:1.3,look:[-.6,-.7]}}
 else{arms=[[-50,40,-110,-40],[50,40,-130,-70]];f={mouth:talk(4,t)?'open':'flat',open:flap(t,talk(4,t)),brow:.9,eye:1.35,pupil:.22,look:[-.6,-.8]}}
 man({r:116,body:'#E8772E',tw:56,legH:300,torso:220,neck:58,shoe:'#EDEDED',skin:'#E8B98F',x:FX,y:FLOOR+10,s:S,flip:true,arms,tilt:-.08,legs:[[-30,-150,-60,0],[30,-150,60,0]],face:{hair:'strand',eye:1,pupil:.34,...f}})}
export function draw(t){setBoil(Math.floor(t*10));c.save();c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,W,H);
 const cin=t>=TS, u=t-TS;
 let z,x,y,sh=0,rot=0;
 if(!cin){
  if(t<LE[0]+.15){const k=pr(t,0,LE[0]+.15);z=1+.08*k;x=540;y=860}
  else if(t<LE[1]+.05){const k=pr(t,LE[0]+.15,LE[1]);z=2+.25*k;x=KX+10;y=700;sh=1+4*k}
  else if(t<LE[2]+.05){const k=pr(t,LE[1],LE[2]);z=1.9+.15*k;x=FX-20;y=900}
  else if(t<LE[3]+.2){ if(t<LS[3]+.9){z=3;x=KX;y=520;sh=6}else{z=2.3;x=KX;y=700;sh=4} }
  else if(t<LE[4]-.0 && t>=LS[4]-.02){ if(t<LE[4]+.0&&t<LS[4]+1.6){const k=pr(t,LS[4],LS[4]+1.6);z=2.4+.3*k;x=FX-10;y=800} else {z=3.4;x=KX;y=700;sh=2} }
  else {z=1.6;x=KX;y=700}
  if(t>=LE[3]+.2&&t<LS[4]){z=1.5;x=540;y=860}
 }else{
  if(u<1.3){z=1.15+.2*pr(u,0,1.3);x=KX;y=lerp(900,820,pr(u,0,1.3));rot=.07}
  else{const k=pr(u,1.3,3.1);z=2.2+.4*ease(k);x=KX;y=lerp(640,610,k);rot=.05*(1-k)}
 }
 cam(z,x,y,sh,t,()=>{bg(cin,t);if(!cin)friend(t);kalu(t,cin,u)},rot);
 c.restore();
 if(cin){c.save();c.fillStyle='rgba(30,10,40,.28)';c.fillRect(0,0,W,H);
  const v=c.createRadialGradient(W/2,H/2,H*.22,W/2,H/2,H*.65);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.65)');c.fillStyle=v;c.fillRect(0,0,W,H);
  const bh=190*ease(pr(u,0,.35));c.fillStyle='#000';c.fillRect(0,0,W,bh);c.fillRect(0,H-bh,W,bh);c.restore()}
 else{const a=1-ease(pr(t,TS-.4,TS-.05));c.save();c.globalAlpha=a;text('POV: your grip is giving up',W/2,300,62,'#FFFFFF',{stroke:'#000',sw:15});c.restore();caption(groups,t,KEYS,1620)}
 finish(t)}
export const cues=[];
