// 2026-11-07 IG reel v2 "Never let go": bright Stickman hang, 3 lines, then Moody-Mono-style cinematic SIDE-VIEW: head drops, he holds forever.
import {W,H,INK,bind,setBoil,ease,back,lerp,clamp,line,shape,rect,oval,dot,text,star,drop,man,face,caption,groupWords,finish,ring} from './engine.js';
let c,groups=[],words=[],LS=[],LE=[],TS=8,DUR=11.1;
export {DUR};
const FLOOR=1330,BARY=420,KX=490,FX=900,S=.85;
const KEYS=/^(mom's|cliff!|grip\.\.\.|can't\.\.\.|ten|seconds!)$/i;
export function init(ctxx,w){c=ctxx;bind(c);words=w;groups=groupWords(w);for(let i=0;i<3;i++){const ws=w.filter(x=>x.line===i);LS[i]=ws[0].s;LE[i]=ws[ws.length-1].e}TS=LE[2]+.34;DUR=TS+3.7}
const pr=(t,a,b)=>clamp((t-a)/(b-a));
const talk=(ln,t)=>words.some(w=>w.line===ln&&t>=w.s-.03&&t<=w.e+.05);
const flap=(t,on)=>on?.3+.7*Math.abs(Math.sin(t*22)):.15;
const cam=(z,x,y,sh,t,fn,rot=0)=>{c.save();const dx=sh?Math.sin(t*71)*sh:0,dy=sh?Math.cos(t*93)*sh:0;c.translate(W/2+dx,H/2+dy);c.rotate(rot);c.scale(z,z);c.translate(-x,-y);fn();c.restore()};
function cloud(x,y,s){for(const[a,b,r]of[[0,0,70],[80,-20,90],[170,10,70],[90,30,80]])oval(x+a*s,y+b*s,r*s,r*.7*s,'#fff',5,INK,1.4)}
function tree(x,s=1,col='#58B15E'){line([[x,FLOOR-80],[x+6,FLOOR-380*s]],12*s,'#6B4A2B',2);oval(x,FLOOR-470*s,150*s,125*s,col,7,INK,2.4);oval(x-70*s,FLOOR-380*s,90*s,70*s,col,7,INK,2)}
function bg(t){c.fillStyle='#BFE4F5';c.fillRect(-900,-900,W+1800,H+1800);
 c.fillStyle='#6FBB55';c.beginPath();c.ellipse(260,FLOOR-110,560,230,0,Math.PI,0);c.fill();c.beginPath();c.ellipse(860,FLOOR-90,620,300,0,Math.PI,0);c.fill();
 c.fillStyle='#8FD16A';c.fillRect(-900,FLOOR-100,W+1800,H);
 oval(930,300,64,64,'#FFD84A',7,INK,2);cloud(200,260,1);cloud(760,160,.8);tree(60,1.1);tree(1030,1);
 line([[210,FLOOR-80],[210,BARY]],22,INK,1.4);line([[790,FLOOR-80],[790,BARY]],22,INK,1.4);line([[190,BARY],[810,BARY]],24,'#8a8f99',1.2);line([[190,BARY-6],[810,BARY-6]],6,'#d6dae0',1)}
function kalu(t){
 const tr=clamp(t/7), shk=Math.sin(t*38)*(2+tr*9)*(talk(1,t)?1.4:1);
 let f,arms=[[-30,-200,-45,-420],[30,-200,45,-420]];
 if(t<LS[1])f={mouth:'flat',brow:.4,eye:1.05,pupil:.3,look:[0,-.3]};
 else if(t<LS[2])f={mouth:talk(1,t)?'open':'wobble',open:flap(t,talk(1,t)),brow:1,eye:1.3,pupil:.18,look:[0,-.4]};
 else f={mouth:'flat',brow:lerp(.9,-.6,pr(t,LS[2]+1,LE[2])),eye:lerp(1.3,1.45,pr(t,LS[2]+.4,LS[2]+1.3)),pupil:.22,look:[0,-.1]};
 const sag=Math.min(1,t/7)*28;
 man({r:122,body:'#3E8F63',tw:60,legH:300,torso:230,neck:60,shoe:'#7A4B2A',skin:'#8A5A3C',x:KX+shk,y:BARY+787+sag*S,s:S,arms,legs:[[-14,-150,-34+Math.sin(t*3)*14,-4],[14,-150,34-Math.sin(t*3)*14,-4]],face:{hair:'quiff',hairFill:'#1A1A1A',...f}});
 if(t>LS[1]){for(let i=0;i<3;i++){const p=(t*1.4+i*.33)%1;drop(KX-70+i*70+shk,BARY+330+p*200,.8,'#8FD3F4')}}}
function friend(t){
 const hype=Math.abs(Math.sin(t*9));let arms,f;
 if(t<LS[1]){arms=[[-50,-90,-80,-230*(.6+.4*hype)],[50,-90,80,-230*(.6+.4*(1-hype))]];f={mouth:talk(0,t)?'open':'smile',open:flap(t,talk(0,t)),brow:.1,look:[-.6,-.6]}}
 else if(t<LS[2]){arms=[[-50,-60,-70,-140],[50,-60,70,-140]];f={mouth:'wobble',brow:.7,eye:1.2,look:[-.6,-.7]}}
 else{arms=[[-50,40,-110,-40],[50,40,-130,-70]];f={mouth:talk(2,t)?'open':'flat',open:flap(t,talk(2,t)),brow:.9,eye:1.35,pupil:.22,look:[-.6,-.8]}}
 man({r:116,body:'#E8772E',tw:56,legH:300,torso:220,neck:58,shoe:'#EDEDED',skin:'#E8B98F',x:FX,y:FLOOR+10,s:S,flip:true,arms,tilt:-.08,legs:[[-30,-150,-60,0],[30,-150,60,0]],face:{hair:'strand',eye:1,pupil:.34,...f}})}
// ---------- cinematic: Moody-Mono-style side view ----------
function bgCin(t){
 const g=c.createLinearGradient(0,-700,0,FLOOR+200);g.addColorStop(0,'#14102a');g.addColorStop(.45,'#6a2b55');g.addColorStop(.8,'#f08a3c');g.addColorStop(1,'#ffd07a');c.fillStyle=g;c.fillRect(-1400,-1400,W+2800,H+3000);
 c.fillStyle='#ffe2a0';c.beginPath();c.arc(KX+210,BARY+560,250,0,7);c.fill();
 const r=c.createRadialGradient(KX+210,BARY+560,100,KX+210,BARY+560,900);r.addColorStop(0,'rgba(255,200,120,.7)');r.addColorStop(1,'rgba(255,120,60,0)');c.fillStyle=r;c.fillRect(-1400,-1400,W+2800,H+3000);
 c.fillStyle='#1c0f22';c.beginPath();c.ellipse(120,FLOOR+100,700,260,0,Math.PI,0);c.fill();c.beginPath();c.ellipse(980,FLOOR+120,760,330,0,Math.PI,0);c.fill();
 c.fillStyle='#120817';c.fillRect(-1400,FLOOR+90,W+2800,1200);
 for(let i=0;i<30;i++){const p=(t*.1+i*.137)%1;c.globalAlpha=.6*(1-Math.abs(p-.5)*2);dot((i*151)%W+Math.sin(t*.8+i)*40-100,FLOOR+100-p*1500,3+(i%3),'#FFE3A0');c.globalAlpha=1}}
function kaluSide(u){
 const D='#0e0812', P=0; const drop_=ease(pr(u,1.15,1.6))*.95+Math.sin(pr(u,1.6,2)*Math.PI)*.04*(u<2?1:0);
 const tremble=u<1.15?Math.sin(u*40)*2.2:0, sx=KX+tremble;
 const sy=BARY+400, hy=sy+235; // shoulder, hip
 // bar end-on
 const bx=sx-70;oval(bx,BARY,24,24,'#2a1a30',7,D,1);
 // legs (hanging, slightly bent), far leg first
 const lg=(dx,k)=>{line([[sx+dx,hy],[sx+dx+10*k,hy+150],[sx+dx+22*k,hy+290]],24,'#2d2b33',2);shape([[sx+dx+4*k,hy+290],[sx+dx+80*k,hy+300],[sx+dx+92*k,hy+322],[sx+dx-6*k,hy+324]],'#7A4B2A',7,D,1.4)};
 lg(-12,.8);
 // far arm
 line([[sx-4,sy-8],[bx+10,sy-200],[bx,BARY]],24,'#2f7550',1.6);
 // torso (side)
 shape([[sx-34,sy-10],[sx+24,sy-24],[sx+46,sy+90],[sx+36,hy-6],[sx-30,hy+6],[sx-40,sy+100]],'#3E8F63',7,D,1.5);
 lg(14,1);
 // head: rotates about the neck point
 c.save();c.translate(sx+8,sy-34);c.rotate(drop_);
 const R=112; // head centre relative to neck: up and slightly forward
 oval(10,-96,R*.95,R*1.05,'#8A5A3C',7,D,1.6);
 // hair
 shape([[-98,-110],[-90,-190],[-20,-218],[60,-212],[96,-170],[70,-176],[10,-166],[-40,-150],[-82,-118]],'#1A1A1A',7,D,1.5);
 oval(-70,-90,18,26,'#8A5A3C',6,D,1);          // ear
 // nose + mouth (facing right)
 shape([[96,-108],[128,-86],[100,-78]],'#8A5A3C',6,D,.8);
 const shut=u>1.0;
 if(!shut){oval(60,-112,17,19,'#fff',5,D,.8);dot(66,-110,7)}else{line([[40,-108],[78,-104]],8,D,.6)}
 line([[30,-148],[84,-130]],9,D,.6);                 // brow angled down toward the nose = determined
 line([[66,-46],[104,-52]],8,D,.6);                  // clenched mouth
 if(shut){line([[88,-80],[104,-72]],5,D,.5);line([[36,-62],[60,-58]],5,D,.5)} // strain lines
 c.restore();
 // near arm, in front, straight and locked
 line([[sx+6,sy-6],[bx+22,sy-210],[bx+10,BARY+8]],26,'#3E8F63',1.6);line([[sx+6,sy-6],[bx+22,sy-210],[bx+10,BARY+8]],8,'#56ad7f',1);
 oval(bx+10,BARY+6,26,24,'#8A5A3C',7,D,1);}
export function draw(t){setBoil(Math.floor(t*10));c.save();c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,W,H);
 const cin=t>=TS,u=t-TS;
 let z,x,y,sh=0;
 if(!cin){
  if(t<LE[0]+.15){const k=pr(t,0,LE[0]+.15);z=1+.08*k;x=540;y=860}
  else if(t<LS[1]+1.3){const k=pr(t,LE[0]+.15,LS[1]+1.3);z=2+.25*k;x=KX+10;y=700;sh=1+4*k}
  else if(t<LE[1]+.1){z=3;x=KX;y=520;sh=6}
  else if(t<LS[2]+.15){z=1.9;x=FX-20;y=900}
  else if(t<LE[2]){const k=pr(t,LS[2],LE[2]);z=2.4+.3*k;x=FX-10;y=800}
  else{z=3.4;x=KX;y=700;sh=2}
  cam(z,x,y,sh,t,()=>{bg(t);friend(t);kalu(t)});
 }else{
  // side view: medium shot, then slow pull-back to reveal the silhouette against the sun
  z=u<1.8?1.45+.1*pr(u,0,1.8):lerp(1.55,.95,ease(pr(u,1.8,3.7)));x=KX+40;y=u<1.8?760:lerp(760,940,ease(pr(u,1.8,3.7)));
  cam(z,x,y,0,t,()=>{bgCin(t);kaluSide(u)});
 }
 c.restore();
 if(cin){c.save();
  c.globalCompositeOperation='saturation';c.globalAlpha=.55;c.fillStyle='#808080';c.fillRect(0,0,W,H);c.globalCompositeOperation='source-over';c.globalAlpha=.16;c.fillStyle='#ffb060';c.fillRect(0,0,W,H);c.globalAlpha=1;
  c.fillStyle='rgba(20,8,30,.25)';c.fillRect(0,0,W,H);
  const v=c.createRadialGradient(W/2,H/2,H*.2,W/2,H/2,H*.65);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.7)');c.fillStyle=v;c.fillRect(0,0,W,H);
  const bh=190*ease(pr(u,0,.3));c.fillStyle='#000';c.fillRect(0,0,W,bh);c.fillRect(0,H-bh,W,bh);c.restore()}
 else{const a=1-ease(pr(t,TS-.4,TS-.05));c.save();c.globalAlpha=a;text('POV: your grip is giving up',W/2,300,62,'#FFFFFF',{stroke:'#000',sw:15});c.restore();caption(groups,t,KEYS,1620)}
 finish(t)}
export const cues=[];
