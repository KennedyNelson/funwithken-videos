// 2026-11-06 IG reel "cool boyfriend": girlfriend confesses, Kalu is proud, the boy walks by. Bright park bench, no SFX, no extra text but setup line + captions.
import {W,H,INK,bind,setBoil,ease,back,lerp,clamp,line,shape,rect,oval,dot,text,star,drop,man,face,walk,caption,groupWords,finish,ring} from './engine.js';
export const DUR=14.33;
const SKY='#BFE4F5',GRASS='#8FD16A',GRASS2='#6FBB55',PATH='#E8D4A0',YEL='#F7D84A';
const FLOOR=1300,SEAT=FLOOR-160;let c,groups=[],words=[];
const KEYS=/^(slept|know\.|past\.|care|chutiye|saath\?|guy\.\.\.)$/i;
let LS=[],LE=[],tSlept=0;
export function init(ctxx,w){c=ctxx;bind(c);words=w;groups=groupWords(w);for(let i=0;i<6;i++){const ws=w.filter(x=>x.line===i);LS[i]=ws[0].s;LE[i]=ws[ws.length-1].e}tSlept=w.filter(x=>x.line===4&&x.w==='slept')[0].s}
const pr=(t,a,b)=>clamp((t-a)/(b-a));
const talk=(ln,t)=>words.some(w=>w.line===ln&&t>=w.s-.03&&t<=w.e+.05);
const flap=(t,on)=>on?.3+.7*Math.abs(Math.sin(t*22)):.15;
const cam=(z,x,y,sh,t,fn)=>{c.save();const dx=sh?Math.sin(t*71)*sh:0,dy=sh?Math.cos(t*93)*sh:0;c.translate(W/2+dx,H/2+dy);c.scale(z,z);c.translate(-x,-y);fn();c.restore()};
function cloud(x,y,s){for(const[a,b,r]of[[0,0,70],[80,-20,90],[170,10,70],[90,30,80]])oval(x+a*s,y+b*s,r*s,r*.7*s,'#fff',5,INK,1.4)}
function tree(x,s=1){line([[x,FLOOR-80],[x+6,FLOOR-380*s]],12*s,'#6B4A2B',2);oval(x,FLOOR-470*s,150*s,125*s,'#58B15E',7,INK,2.4);oval(x-70*s,FLOOR-380*s,90*s,70*s,'#58B15E',7,INK,2)}
function sun(x,y,r,t){oval(x,y,r,r,'#FFD84A',7,INK,2);for(let i=0;i<12;i++){const a=i/12*6.283+t*.8;line([[x+Math.cos(a)*(r+16),y+Math.sin(a)*(r+16)],[x+Math.cos(a)*(r+54),y+Math.sin(a)*(r+54)]],6,INK,2)}}
function park(t){c.fillStyle=SKY;c.fillRect(-300,-300,W+600,H+600);
 c.fillStyle=GRASS2;c.beginPath();c.ellipse(260,FLOOR-110,560,230,0,Math.PI,0);c.fill();c.beginPath();c.ellipse(860,FLOOR-90,620,300,0,Math.PI,0);c.fill();
 c.fillStyle=GRASS;c.fillRect(-300,FLOOR-100,W+600,H-FLOOR+400);
 shape([[-400,FLOOR-100],[1500,FLOOR-100],[1500,FLOOR-30],[-400,FLOOR-30]],PATH,0,INK,0);
 line([[-300,FLOOR-100],[W+300,FLOOR-104]],5,'#4b8f3a');cloud(210,330,1);cloud(800,230,.8);sun(900,420,64,t);tree(90,1.1);tree(1010,1)}
function bench(){rect(190,SEAT-250,690,60,'#B98C5E',7);rect(190,SEAT-170,690,40,'#B98C5E',7);rect(170,SEAT,730,34,'#A57547',7);
 line([[240,SEAT+34],[230,FLOOR+40]],12);line([[830,SEAT+34],[840,FLOOR+40]],12)}
const SIT=[[110,-160,125,0],[150,-160,175,0]];
const KAL={r:120,body:'#3E8F63',tw:60,legH:160,torso:230,neck:60,shoe:'#7A4B2A',skin:'#8A5A3C',legs:SIT};
const GF={r:112,body:'#E8607A',tw:56,legH:160,torso:215,neck:58,shoe:'#F4EFE3',skin:'#F2C9A5',legs:SIT};
const BOY={r:120,body:'#4A7BD0',tw:60,legH:300,torso:230,neck:60,shoe:'#EDEDED',skin:'#E8B98F'};
const kF=(o={})=>({hair:'quiff',hairFill:'#1A1A1A',eye:1,pupil:.36,...o});
const gF=(o={})=>({hair:'afro',hairFill:'#2B1B16',eye:1,pupil:.36,...o});
export function draw(t){setBoil(Math.floor(t*10));c.save();c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,W,H);
 // camera: wide until the boy appears, snap-push on Kalu for the reaction
 const tZ=tSlept-.1,z=1.25+.4*ease(pr(t,tZ,tZ+.5))+.1*pr(t,LS[5],DUR);
 cam(z,lerp(540,430,ease(pr(t,tZ,tZ+.5))),lerp(1010,880,ease(pr(t,tZ,tZ+.5))),0,t,()=>{
  park(t);
  // boy walks right-to-left on the path behind the bench
  const bx=540-380*(t-(LS[5]+.15)), bw=walk(t*7.5,.8);
  if(bx<1250)man({...BOY,x:bx,y:FLOOR-50,s:.85,flip:-1,...bw,face:{hair:'quiff',hairFill:'#6B4A2B',mouth:'smile',brow:.2,eye:1,pupil:.34,look:[-.5,0]}});
  bench();
  const kT=talk(0,t)||talk(2,t)||talk(4,t),k5=talk(5,t),gT=talk(1,t)||talk(3,t);
  let kf,ko={x:370,y:FLOOR+10,s:1};
  const tS=tSlept-.1,seeBoy=pr(t,tS,tS+.4),cry=t>=LS[5];
  const idle=[[-60,110,-80,200],[60,110,60,190]];
  if(t<LS[2])kf=kF({mouth:kT?'open':'smile',open:flap(t,kT),brow:.3,look:[.7,.2]}),ko.arms=[[-60,110,-80,200],[60,110,20,170]],ko.lean=.03;
  else if(t<LS[4])kf=kF({mouth:kT?'open':'smile',open:flap(t,kT),brow:-.3,look:[.7,.2]}),ko.arms=[[-60,110,-80,200],[60,70+Math.sin(t*5)*6,110,10]];
  else if(t<tS)kf=kF({mouth:kT?'open':'smile',open:flap(t,kT),brow:-.5,look:[.7,.2]}),ko.lean=-.04,ko.arms=[[-60,110,-80,200],[70,40+Math.sin(t*6)*8,150,-30+Math.sin(t*6)*18]];
  else if(!cry)kf=kF({mouth:kT?'open':'flat',open:flap(t,kT),brow:.7,eye:1.25,pupil:.2,look:[1,-.45]}),ko.tilt=.1*seeBoy,ko.lean=-.04+.04*seeBoy,ko.arms=idle;
  else{const u=pr(t,LS[5]+.05,LS[5]+.5);kf=kF({mouth:k5?'open':'wobble',open:flap(t,k5),brow:.9,eye:1.4,pupil:.16,look:[1,-.35]});ko.squash=.25*ease(u);ko.lean=.1*ease(u);ko.tilt=.25*ease(u);ko.arms=[[-60,110,-60,200],[60,110,50,200]]}
  man({...KAL,...ko,face:kf});
  if(cry){for(let i=0;i<4;i++){const p=(t*1.6+i*.25)%1;drop(i%2?452:350,820+p*130,.9,'#6FB7E8')}}
  const gf=t<LS[3]?gF({mouth:gT?'open':'flat',open:flap(t,gT),brow:t<LS[1]?.2:.9,look:[.7,.2]}):t<LE[3]+.1?gF({mouth:gT?'open':'flat',open:flap(t,gT),brow:.9,look:[.2,.5]}):gF({mouth:'smile',brow:.6,look:[t>tS?-.2:.7,.3]});
  man({...GF,x:705,y:FLOOR+10,s:1,flip:true,tilt:t<LE[3]?.05:0,arms:[[-60,110,-80,190],[60,110,40,200]],face:gf});
 });
 c.restore();
 // setup line (the caption of the reel)
 text('POV: the "mature"',W/2,300,70,'#FFFFFF',{stroke:'#000',sw:16});
 text('boyfriend',W/2,386,70,'#FFD93B',{stroke:'#000',sw:16});
 caption(groups,t,KEYS,1620);finish(t)}
export const cues=[];
