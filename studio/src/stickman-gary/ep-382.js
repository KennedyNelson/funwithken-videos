// 2026-11-06 "He Didn't Eat for 382 Days" (fast cut Stickman): a ginger Scot shrinks while his grumpy Stomach complains. Bright outdoors, no text but captions.
import {W,H,INK,bind,setBoil,ease,back,lerp,clamp,line,shape,rect,oval,dot,text,star,drop,man,face,walk,caption,groupWords,finish,ring} from './engine.js';
export const DUR=25.0;
const SKY='#BFE4F5',GRASS='#8FD16A',GRASS2='#6FBB55',PATH='#E8D4A0',PINK='#F6A5B8',PINK2='#F9C4D0',RED='#D9453A',YEL='#F7D84A',GREEN='#3E8F63';
const FLOOR=1340; let c,groups=[];
const KEYS=/^(man|three|eighty-two|days|food\.|real|Anyone\?|doctors|manager\.|lunch\.|kilos\.|welcome\.|spoon\.|fridge\.|Fridge\?|hospital\.|try|off\.|Scottish,|Water,|vitamins,|Hello\?)$/i;
export function init(ctxx,w){c=ctxx;bind(c);groups=groupWords(w)}
const pr=(t,a,b)=>clamp((t-a)/(b-a));
const cam=(z,x,y,sh,t,fn)=>{c.save();const dx=sh?Math.sin(t*71)*sh:0,dy=sh?Math.cos(t*93)*sh:0;c.translate(W/2+dx,H/2+dy);c.scale(z,z);c.translate(-x,-y);fn();c.restore()};
const MAN={r:122,body:GREEN,tw:60,legH:300,torso:230,neck:60,shoe:'#7A4B2A',skin:'#F2C9A5'};
const STO={kind:'potato',r:104,legH:120,torso:150,tw:92,neck:20,body:PINK,shoe:'#C75C7C',skin:PINK2};
const mF=(o={})=>({hair:'quiff',hairFill:'#C4601F',eye:1,pupil:.36,...o});
const mMan=(o,f={})=>man({...MAN,...o,face:mF(f)});
const mSto=(o,f={})=>man({...STO,...o,face:{kind:'potato',eye:1.1,pupil:.34,...f}});
const flap=(t,on)=>on?.35+.65*Math.abs(Math.sin(t*24)):.2;
const SPK=[[3.74,5.73],[8.98,10.94],[15.29,16.1],[16.24,18.58],[24.12,24.86]];
const talking=t=>SPK.some(([a,b])=>t>=a&&t<=b);
// ---------- backdrops ----------
function park(tint=SKY,hill=GRASS2){c.fillStyle=tint;c.fillRect(0,0,W,H);
 c.fillStyle=hill;c.beginPath();c.ellipse(260,FLOOR-60,560,230,0,Math.PI,0);c.fill();c.beginPath();c.ellipse(860,FLOOR-40,620,300,0,Math.PI,0);c.fill();
 c.fillStyle=GRASS;c.fillRect(0,FLOOR-50,W,H-FLOOR+50);shape([[380,FLOOR-50],[700,FLOOR-50],[1180,H+40],[-100,H+40]],PATH,0,INK,0);
 line([[-20,FLOOR-50],[W+20,FLOOR-54]],5,'#4b8f3a');cloud(210,260,1);cloud(800,170,.8)}
function cloud(x,y,s){for(const[a,b,r]of[[0,0,70],[80,-20,90],[170,10,70],[90,30,80]])oval(x+a*s,y+b*s,r*s,r*.7*s,'#fff',5,INK,1.4)}
function tree(x,s=1,col='#58B15E'){line([[x,FLOOR-40],[x+6,FLOOR-340*s]],12*s,'#6B4A2B',2);oval(x,FLOOR-430*s,150*s,125*s,col,7,INK,2.4);oval(x-70*s,FLOOR-340*s,90*s,70*s,col,7,INK,2)}
function sun(x,y,r,t){oval(x,y,r,r,'#FFD84A',7,INK,2);for(let i=0;i<12;i++){const a=i/12*6.283+t*.8;line([[x+Math.cos(a)*(r+16),y+Math.sin(a)*(r+16)],[x+Math.cos(a)*(r+54),y+Math.sin(a)*(r+54)]],6,INK,2)}}
function table(x,y=FLOOR+30,w=620){rect(x-w/2,y-170,w,32,'#B98C5E',7);line([[x-w/2+60,y-138],[x-w/2+40,y+40]],10);line([[x+w/2-60,y-138],[x+w/2-40,y+40]],10)}
function plate(x,y,dust=0){oval(x,y,120,28,'#FFFFFF',7,INK,1.6);oval(x,y-4,86,16,'#F1F1F1',0);if(dust>0){c.globalAlpha=dust;for(let i=0;i<5;i++)line([[x-50+i*25,y-10],[x-40+i*25,y-34-(i%2)*8]],3,'#9a9a9a',2);c.globalAlpha=1}}
function fork(x,y,rot=0){c.save();c.translate(x,y);c.rotate(rot);line([[0,0],[0,-90]],8);line([[-14,-90],[-14,-130]],6);line([[0,-90],[0,-132]],6);line([[14,-90],[14,-130]],6);c.restore()}
function hungerLines(x,y,t){for(let i=-1;i<=1;i++){const p=Math.sin(t*14+i)*6;line([[x+i*34+p,y],[x+i*34-p,y+46]],5,INK,3)}}
function doctor(x,y,s,t,o={}){c.save();c.translate(x,y);c.scale(s,s);const b=Math.sin(t*5+x)*8;
 line([[-30,0],[-30,-60]],7);line([[30,0],[30,-60]],7);shape([[-60,-60],[60,-60],[70,-200],[-70,-200]],'#FFFFFF',7,INK,2);rect(-26,-170,52,70,'#E4F2F8',5,INK,1);
 line([[-60,-170],[-95,-110+b]],7);line([[60,-170],[95,-130-b]],7);rect(88,-150-b,48,66,'#F7E7C0',5,INK,1);
 c.translate(0,-250);face({r:62,kind:'egg',skin:'#F2D2B0',eye:.9,pupil:.32,mouth:o.mouth||'smile',brow:.3,lw:5,hair:o.hair});
 if(o.bino){rect(-52,-30,50,26,'#444',4);rect(2,-30,50,26,'#444',4)}c.restore()}
function bush(x,y,s=1){oval(x,y,150*s,100*s,'#4FA45A',7,INK,2.4);oval(x-90*s,y+20*s,80*s,60*s,'#5BB566',7,INK,2);oval(x+95*s,y+20*s,80*s,60*s,'#5BB566',7,INK,2)}
function bell(x,y,hit){oval(x,y,64,40,'#E7C34A',6,INK,1.4);rect(x-70,y+24,140,26,'#8C6C3B',6,INK,1);dot(x,y-48,10);if(hit){for(let i=0;i<3;i++)line([[x+60+i*18,y-60+i*-8],[x+86+i*18,y-90+i*-14]],5,INK,2);star(x+34,y-100,26,YEL,6)}}
function fridgeProp(x,k,open=0){if(k<=0)return;c.save();c.translate(x,FLOOR+20);c.scale(k,k);rect(-130,-650,260,650,'#F4F6F8',8);line([[-130,-420],[130,-420]],7);rect(88,-590,18,100,'#999',4);rect(88,-380,18,140,'#999',4);if(open>0){c.fillStyle=`rgba(255,246,170,${open*.55})`;c.fillRect(-124,-644,248,218);}
 c.restore()}
function burger(x,y,t,run=0){c.save();c.translate(x,y);oval(0,-44,70,28,'#E3A55A',6,INK,1.6);rect(-72,-30,144,22,'#6B3B22',6,INK,1);rect(-76,-14,152,16,'#7BC36A',6,INK,1);oval(0,16,70,24,'#D99A4E',6,INK,1.6);
 const l=Math.sin(t*28)*18*run;line([[-26,34],[-30+l,80]],7);line([[26,34],[30-l,80]],7);dot(-20,-22,6);dot(20,-22,6);c.restore()}
function noSign(x,y,r,k){if(k<=0)return;c.save();c.translate(x,y);c.scale(k,k);oval(0,0,r,r,null,18,RED,2);line([[-r*.7,-r*.7],[r*.7,r*.7]],18,RED,1);c.restore()}
function pill(x,y,col,rot){c.save();c.translate(x,y);c.rotate(rot);rect(-36,-16,72,32,col,6,INK,1);line([[0,-16],[0,16]],4,INK,.6);c.restore()}
function glass(x,y,level){shape([[x-50,y-120],[x+50,y-120],[x+38,y],[x-38,y]],'rgba(255,255,255,.55)',7,INK,1.6);c.fillStyle='#6FB7E8';c.beginPath();c.moveTo(x-46+level*6,y-120+(1-level)*100);c.lineTo(x+46-level*6,y-120+(1-level)*100);c.lineTo(x+38,y-3);c.lineTo(x-38,y-3);c.closePath();c.fill()}
function spoon(x,y,rot,t){c.save();c.translate(x,y);c.rotate(rot);line([[0,60],[0,-70]],10,'#9AA5AD',1);oval(0,-110,46,60,'#C9D2D8',7,INK,1.4);oval(-14,-118,10,12,'#fff',3);oval(14,-118,10,12,'#fff',3);dot(-14,-116+Math.sin(t*3),4);dot(14,-116+Math.sin(t*3),4);line([[-14,-90],[14,-90]],4,INK,.6);c.restore()}
function sleepZ(x,y,t){for(let i=0;i<3;i++){const p=(t*.7+i*.33)%1;c.globalAlpha=1-p;text('z',x+i*30+p*40,y-i*40-p*80,48+i*10,INK,{w:900});c.globalAlpha=1}}
function stomachRumble(x,y,t){for(let i=0;i<3;i++){const a=Math.sin(t*20+i)*8;line([[x-70+a,y+i*26],[x-40-a,y+i*26+6],[x-10+a,y+i*26]],5,INK,1)}}
// ---------- scenes ----------
const S=[
[0,1.45,(t)=>{const u=pr(t,0,1.45);cam(1.05+.05*u,540,1000,0,t,()=>{park();tree(120,1.1);tree(980,1);sun(820,300,64,t);table(560);
  mMan({x:420,y:FLOOR+30,s:1,tw:150,arms:[[-60,110,-90,200],[60,110,60,175]]},{mouth:'smile',brow:.2,look:[.6,.2]});plate(640,FLOOR-140);fork(540,FLOOR-132,.15);
  mSto({x:860,y:FLOOR+40,s:.95,tw:130},{mouth:'smile',brow:.2,look:[-.7,.3]})})}],
[1.45,2.7,(t)=>{const u=pr(t,1.45,2.7);const seasons=['#BFE4F5','#F3C98B','#E8F0F6','#BFE4F5'];const k=Math.min(3,Math.floor(u*4));
  cam(1.1,540,1000,0,t,()=>{park(seasons[k]);tree(120,1.1,k==1?'#E88B3A':k==2?'#F4F8FA':'#58B15E');tree(980,1,k==1?'#E88B3A':k==2?'#F4F8FA':'#58B15E');
   if(k==1){for(let i=0;i<9;i++){const p=(t*1.5+i*.12)%1;shape([[100+i*110+p*40,-40+p*1500],[120+i*110+p*40,-10+p*1500],[100+i*110+p*40,20+p*1500]],'#E88B3A',4,INK,1)}}
   if(k==2){for(let i=0;i<22;i++){const p=(t*1.2+i*.083)%1;dot(40+i*48+Math.sin(p*9+i)*20,-20+p*1500,9,'#FFFFFF')}}
   if(k==0||k==3)sun(820,300,64,t);table(560);mMan({x:420,y:FLOOR+30,s:1,tw:150,arms:[[-60,110,-90,200],[60,110,60,175]]},{mouth:'flat',brow:.4,look:[.6,.2],lid:1});plate(640,FLOOR-140,k>=1?.8:0);
   mSto({x:860,y:FLOOR+40,s:.95,tw:130},{mouth:'flat',brow:.4,look:[-.7,.3]})})}],
[2.7,3.74,(t)=>{const u=pr(t,2.7,3.74);park('#CFE9F5');cam(1.4+.2*u,520,1000,2,t,()=>{table(560);
  mMan({x:420,y:FLOOR+30,s:1,tw:150,tilt:.12,arms:[[-60,110,-90,200],[60,110,60,175]]},{mouth:'wobble',eye:1.35,pupil:.2,look:[.7,.4],brow:.6});plate(640,FLOOR-140);fork(540,FLOOR-132,.15);hungerLines(430,520,t);
  mSto({x:860,y:FLOOR+40,s:.95,tw:130},{mouth:'wobble',eye:1.2,pupil:.2,look:[-.7,.3],brow:.6})});stomachRumble(800,1200,t)}],
[3.74,4.9,(t)=>{const u=pr(t,3.74,4.9);c.fillStyle='#F7C9D6';c.fillRect(0,0,W,H);for(let i=0;i<6;i++){const y=120+i*300;const p=[];for(let k=0;k<8;k++)p.push([-20+k*160,y+Math.sin(k*1.7+i)*40]);line(p,5,'#E7A3B6',3)}
  c.fillStyle='#E7A3B6';c.fillRect(0,FLOOR,W,H-FLOOR);line([[-20,FLOOR],[W+20,FLOOR]],6);
  cam(1.1+.1*u,540,1000,0,t,()=>{mMan({x:230,y:FLOOR+30,s:.6,tw:150,tilt:.2,arms:[[-60,110,-90,200],[60,110,60,175]]},{mouth:'flat',lid:1,look:[.5,.4],brow:.3});sleepZ(250,860,t);
   mSto({x:700,y:FLOOR+40,s:1.25,tw:92,arms:[[-70,10,-120,-160],[70,10,160,-120]]},{mouth:'open',open:flap(t,true),eye:1.3,pupil:.26,brow:-.4,look:[-.5,-.2]});
   for(let i=0;i<3;i++){const p=((t-3.9)*1.2+i*.3)%1;c.globalAlpha=1-p;oval(560-i*10,720,(100+p*340),(70+p*210),null,6,INK,2);c.globalAlpha=1}})}],
[4.9,5.85,(t)=>{const u=pr(t,4.9,5.85);c.fillStyle='#F7C9D6';c.fillRect(0,0,W,H);c.fillStyle='#E7A3B6';c.fillRect(0,FLOOR,W,H-FLOOR);line([[-20,FLOOR],[W+20,FLOOR]],6);
  cam(1.1,540,1000,0,t,()=>{mMan({x:230,y:FLOOR+30,s:.6,tw:150,tilt:.2,arms:[[-60,110,-90,200],[60,110,60,175]]},{mouth:'flat',lid:1,look:[.5,.4],brow:.3});sleepZ(250,860,t);
   mSto({x:680,y:FLOOR+40,s:1.25,tw:92,arms:[[-60,100,-90,190],[60,100,90,190]]},{mouth:'open',open:flap(t,t<5.73),eye:1.2,pupil:.3,brow:-.2,look:[Math.sin(t*4),.1]});
   const tx=lerp(1200,-200,u);c.save();c.translate(tx,FLOOR-70);c.rotate(-u*14);for(let i=0;i<7;i++){const a=i/7*Math.PI*2;line([[0,0],[Math.cos(a)*60,Math.sin(a)*60]],5,'#8B6A3E',2)}oval(0,0,56,56,null,5,'#8B6A3E',3);c.restore()})}],
[5.85,6.95,(t)=>{const u=pr(t,5.85,6.95);park('#C9E6F3');cam(1.05+.06*u,540,1000,0,t,()=>{shape([[-100,FLOOR-60],[300,FLOOR-330],[760,FLOOR-60]],'#9BC77F',7,INK,2);rect(640,FLOOR-480,260,300,'#B8B2A8',7,INK,2);line([[640,FLOOR-480],[670,FLOOR-540],[700,FLOOR-480],[740,FLOOR-540],[780,FLOOR-480],[820,FLOOR-540],[860,FLOOR-480],[900,FLOOR-540]],7);tree(100,1);
  mMan({x:420,y:FLOOR+30,s:1,tw:150,arms:[[-50,100,-90,170],[70,70,150,10]]},{mouth:'grin',brow:-.3,look:[.3,-.1]});
  shape([[300,FLOOR-250],[540,FLOOR-250],[560,FLOOR-130],[280,FLOOR-130]],'#C23B30',6,INK,2);for(let i=0;i<5;i++)line([[300+i*50,FLOOR-250],[290+i*55,FLOOR-130]],4,'#1F6B3E',2);line([[300,FLOOR-190],[560,FLOOR-190]],4,'#1F6B3E',2);
  mSto({x:860,y:FLOOR+40,s:.9,tw:130},{mouth:'smile',eye:1,look:[-.6,0]})})}],
[6.95,8.9,(t)=>{const u=pr(t,6.95,8.9);park('#C9E6F3');cam(1.05,540,1000,0,t,()=>{tree(80,1.2);tree(1000,1.1);bush(220,FLOOR-30,1.1);bush(860,FLOOR-20,1.2);
  mMan({x:540,y:FLOOR+30,s:.95,tw:150,arms:[[-50,100,-90,170],[60,100,100,180]]},{mouth:'wobble',eye:1.1,brow:.5,look:[Math.sin(t*3),0]});
  const p1=back(pr(t,7.0,7.3)),p2=back(pr(t,7.5,7.8)),p3=back(pr(t,8.0,8.3));
  if(p1>0)doctor(220,FLOOR-70+(1-p1)*260,.95*1,t,{bino:true});if(p2>0)doctor(860,FLOOR-60+(1-p2)*260,1.0,t,{mouth:'flat'});if(p3>0)doctor(700,FLOOR+120+(1-p3)*260,.8,t,{hair:undefined});
  mSto({x:380,y:FLOOR+80,s:.8,tw:130},{mouth:'smile',look:[.4,0]})})}],
[8.98,10.0,(t)=>{const u=pr(t,8.98,10.0);c.fillStyle='#CDE8F4';c.fillRect(0,0,W,H);c.fillStyle='#8FD16A';c.fillRect(0,FLOOR-40,W,H);line([[-20,FLOOR-40],[W+20,FLOOR-40]],5);
  cam(1.2+.1*u,600,1000,0,t,()=>{rect(380,FLOOR-210,520,50,'#B98C5E',7);rect(400,FLOOR-160,480,200,'#9B6F43',7);
   const hit=Math.floor(t*6)%2;bell(620,FLOOR-260,hit);
   mSto({x:820,y:FLOOR+60,s:1.15,tw:92,arms:[[-70,40,-130,-70+hit*70],[70,100,90,180]]},{mouth:'open',open:flap(t,talking(t)),eye:1.15,pupil:.3,brow:-.6,look:[-.6,.2]});
   mMan({x:210,y:FLOOR+30,s:.7,tw:150,tilt:.15},{mouth:'flat',lid:1,look:[.6,.4],brow:.3})})}],
[10.0,10.95,(t)=>{const u=pr(t,10.0,10.95);c.fillStyle='#CDE8F4';c.fillRect(0,0,W,H);c.fillStyle='#8FD16A';c.fillRect(0,FLOOR-40,W,H);
  cam(1.5+.2*u,820,880,5,t,()=>{mSto({x:820,y:FLOOR+60,s:1.15,tw:92,arms:[[-60,100,-90,190],[60,100,90,190]]},{mouth:'open',open:flap(t,talking(t)),eye:1.25,pupil:.22,brow:-.8,look:[-.5,0],veins:true});
   for(let i=0;i<4;i++){const p=(t*2+i*.25)%1;oval(740+i*34+Math.sin(i)*10,540-p*260,30*(1-p*.6),24*(1-p*.6),'#fff',4,INK,1)}});
  mMan({x:220,y:FLOOR+30,s:.5,tw:150,tilt:.15},{mouth:'flat',lid:1,look:[.6,.4]})}],
[11.06,12.15,(t)=>{const u=pr(t,11.06,12.15);park('#D8EEF8');cam(1.15,540,1050,0,t,()=>{table(540);glass(300,FLOOR-140,clamp(u*2));
  const pl=pr(t,11.4,12);plate(640,FLOOR-140);for(let i=0;i<3;i++){const p=clamp((t-11.5-i*.15)/.35);if(p>0)pill(560+i*70,FLOOR-140-Math.sin(p*Math.PI)*190-8+ (p>=1?0:0),['#F2A3A3','#F7D84A','#9ED6E8'][i],p*6)}
  mMan({x:200,y:FLOOR+30,s:.9,tw:150,arms:[[-50,100,-90,190],[60,100,100,170]]},{mouth:'smile',eye:1.1,look:[.6,.2]});mSto({x:900,y:FLOOR+50,s:.85,tw:130},{mouth:'flat',look:[-.6,.2]})})}],
[12.15,13.45,(t)=>{const u=pr(t,12.15,13.45);park('#D8EEF8');cam(1.15,540,1050,0,t,()=>{table(540);plate(560,FLOOR-140);
  const run=pr(t,12.7,13.4);burger(560+run*700,FLOOR-170+Math.sin(t*30)*(run>0?10:0),t,run>0?1:0);noSign(560,FLOOR-330,120,back(pr(t,12.25,12.5)));
  mMan({x:200,y:FLOOR+30,s:.9,tw:150,arms:[[-50,100,-90,190],[60,100,120,150]]},{mouth:'wobble',eye:1.2,pupil:.28,look:[.7,.2],brow:.5});mSto({x:960,y:FLOOR+50,s:.85,tw:130},{mouth:'wobble',eye:1.15,look:[-.6,.2]})})}],
[13.45,15.25,(t)=>{const u=pr(t,13.45,14.5),w=ease(u);park('#D8EEF8');cam(1.05,540,1000,0,t,()=>{tree(90,1.1);tree(990,1);
  const tw=lerp(150,60,w);const px=470,hipY=FLOOR+30-300;
  mMan({x:px,y:FLOOR+30,s:1,tw,arms:[[-60,110,-90,200],[60,110,80,200]]},{mouth:u<1?'open':'grin',open:.5,eye:1.2,pupil:.26,brow:.6,look:[0,.5]});
  const drop_=ease(pr(t,14.1,14.8)),lift=ease(pr(t,14.8,15.1));const ty=hipY+10+drop_*250-lift*250;shape([[px-tw-6,ty],[px+tw+6,ty],[px+tw*1.3,ty+260],[px+8,ty+260],[px,ty+60],[px-8,ty+260],[px-tw*1.3,ty+260]],'#4A5568',7,INK,2);
  if(u>.5){for(let i=0;i<6;i++){const p=((t-13.9)*1.5+i*.17)%1;c.globalAlpha=1-p;oval(px-190+i*76,hipY+60-p*80,36,24,'#fff',5,INK,1);c.globalAlpha=1}}
  mSto({x:930,y:FLOOR+50,s:.85,tw:130},{mouth:'open',open:.6,eye:1.25,pupil:.22,look:[-.7,.2],brow:.6})})}],
[15.29,16.18,(t)=>{park('#D8EEF8');cam(1.5+.1*pr(t,15.29,16.18),780,1000,0,t,()=>{tree(90,1.1);mMan({x:260,y:FLOOR+30,s:.75,tw:60,tilt:-.1},{mouth:'smile',eye:1.3,pupil:.3,brow:.6,look:[.7,0]});
  mSto({x:700,y:FLOOR+50,s:1.2,tw:92,arms:[[-70,70,-90,20],[70,70,90,20]]},{mouth:'grin',eye:.8,brow:-.5,look:[-.4,0]});star(900,860,46,YEL,6);star(560,780,32,YEL,6)})}],
[16.24,17.4,(t)=>{const u=pr(t,16.24,17.4);park('#D8EEF8');cam(1.15+.05*u,540,1050,0,t,()=>{table(560,FLOOR+30,640);
  mSto({x:300,y:FLOOR+50,s:1,tw:92,tilt:.08,arms:[[-50,100,-70,190],[60,60,140,40]]},{mouth:'open',open:flap(t,talking(t)),eye:1.1,brow:.2,look:[.8,.1]});spoon(640,FLOOR-190,.08+Math.sin(t*3)*.05,t);
  mMan({x:960,y:FLOOR+30,s:.7,tw:60,tilt:.1},{mouth:'smile',eye:1.2,look:[-.7,.1]})})}],
[17.4,18.7,(t)=>{const u=pr(t,17.4,18.7);park('#D8EEF8');cam(1.5+.2*u,640,1000,0,t,()=>{table(560,FLOOR+30,640);
  mSto({x:300,y:FLOOR+50,s:1,tw:92,tilt:.08,arms:[[-50,100,-70,190],[60,60,140,40]]},{mouth:'open',open:flap(t,talking(t)),eye:1.1,brow:-.2,look:[.8,.1]});spoon(640,FLOOR-190,.14,t);
  for(let i=0;i<3;i++)line([[790+i*22,FLOOR-380-i*10],[820+i*22,FLOOR-410-i*10]],5,INK,2)})}],
[18.7,19.8,(t)=>{const u=pr(t,18.7,19.8),ph=t*9,wk=walk(ph,1.0);park();cam(1.05,540,1000,0,t,()=>{tree(100,1.1);tree(990,1);sun(820,300,64,t);const x=lerp(260,640,u);
  mMan({x,y:FLOOR+30,s:1,tw:60,...wk,lean:.06},{mouth:'grin',eye:1,brow:-.4,look:[.6,0]});mSto({x:x+270,y:FLOOR+50,s:.8,tw:100,...walk(ph+1.2,.8)},{mouth:'smile',look:[-.5,0]})})}],
[19.8,20.97,(t)=>{const u=pr(t,19.8,20.97);park();cam(1.2+.15*u,540,1050,0,t,()=>{tree(990,1);
  mMan({x:440,y:FLOOR+30,s:1,tw:60,arms:[[-60,110,-90,200],[40,60,150,-150]]},{mouth:'grin',eye:1.1,brow:-.4,look:[.6,-.2]});star(250,820,30,YEL,6);star(680,740,24,YEL,6);
  mSto({x:860,y:FLOOR+50,s:.85,tw:130},{mouth:'smile',look:[-.6,.1]})})}],
[20.97,22.0,(t)=>{const u=pr(t,20.97,22.0);park('#E7F1F6');cam(1.1,540,1000,0,t,()=>{tree(100,1.1);
  mMan({x:420,y:FLOOR+30,s:1,tw:60,arms:[[-60,110,-90,200],[70,40,100,-180]]},{mouth:'wobble',eye:1.2,pupil:.28,brow:.6,look:[.5,0]});
  oval(530,FLOOR-640,56,56,'#F2C9A5',7,INK,1.4);noSign(560,FLOOR-980,140,back(pr(t,21.3,21.6)));
  mSto({x:860,y:FLOOR+50,s:.85,tw:130},{mouth:'wobble',look:[-.6,.1]})})}],
[22.0,22.9,(t)=>{const u=pr(t,22.0,22.9),k=back(pr(t,22.0,22.3));park('#D8EEF8');cam(1.05,540,1000,0,t,()=>{
  c.save();c.translate(560,FLOOR-30);c.scale(k,k);rect(-340,-620,680,620,'#F4F0E8',8);rect(-90,-760,180,150,'#F4F0E8',8);rect(-30,-740,60,110,RED,0);rect(-52,-715,104,60,RED,0);
  for(let r=0;r<3;r++)for(let q=0;q<4;q++)rect(-290+q*150,-560+r*160,100,100,'#CDE8F4',6,INK,1.4);rect(-70,-170,140,170,'#8C7BA0',7);c.restore();
  mMan({x:200,y:FLOOR+30,s:.75,tw:60,tilt:-.08,arms:[[-60,110,-90,200],[60,100,100,170]]},{mouth:'smile',look:[.8,-.2]});mSto({x:930,y:FLOOR+50,s:.75,tw:130},{mouth:'smile',look:[-.8,-.2]})})}],
[22.9,24.12,(t)=>{const u=pr(t,22.9,24.12),k=back(pr(t,23.0,23.4));park('#D8EEF8');cam(1.12+.05*u,640,1000,0,t,()=>{tree(100,1.1);fridgeProp(860,k,pr(t,23.4,23.8));
  mMan({x:260,y:FLOOR+30,s:1,tw:60,arms:[[-60,110,-90,200],[60,100,100,170]]},{mouth:'smile',eye:1.15,look:[.7,0],brow:-.2});
  mSto({x:560,y:FLOOR+50,s:.95,tw:100,arms:[[-60,100,-90,190],[60,100,90,190]]},{mouth:'smile',eye:1.1,look:[.8,0]})})}],
[24.12,99,(t)=>{park('#D8EEF8');const z=1.12+pr(t,24.12,24.9)*.5;cam(z,640,1000,0,t,()=>{tree(100,1.1);fridgeProp(860,1,1);
  mMan({x:240,y:FLOOR+30,s:1,tw:60,arms:[[-60,110,-90,200],[60,100,100,170]]},{mouth:'open',open:.6,eye:1.5,pupil:.2,look:[.7,0],brow:.7});
  mSto({x:560,y:FLOOR+50,s:.95,tw:100,arms:[[-60,100,-90,190],[60,100,90,190]]},{mouth:'open',open:flap(t,talking(t)),eye:1.55,pupil:.24,look:[.9,0],brow:.7});
  for(let i=0;i<3;i++)line([[600+i*22,FLOOR-420],[600+i*22,FLOOR-380+Math.sin(t*14+i)*10]],6,'#6FB7D6',2)})}],
];
export function draw(t){setBoil(Math.floor(t*10));c.save();c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,W,H);for(const s of S)if(t>=s[0]&&t<s[1]){s[2](t);break}c.restore();caption(groups,t,KEYS,1560);finish(t)}
export const cues=[];
