// 2026-11-07 YouTube "Mom Said 5 Minutes": Storybook Room style (richly shaded living room, thin-line stick figures).
// Mom says "leaving in 5 minutes", son is ready in 1 s, mom chats with aunty at the door for hours, then blames the son.
import {W,H,INK,bind,setBoil,ease,back,lerp,clamp,line,shape,rect,oval,dot,text,star,face,caption,groupWords,finish,ring} from './engine.js';
const META=await (await fetch('/data/meta.json')).json();
export const DUR=META.dur;
const LN=META.lines, ENV=META.env;
const S=i=>LN[i].start, E=i=>LN[i].end;
let c,groups=[],words=[];
const KEYS=/^(FIVE|READY!|already\?|two|hours\.|Sharma|EVERYTHING!|LYING|YOU!)$/;
export function init(ctxx,w){c=ctxx;bind(c);words=w;groups=groupWords(w)}
const pr=(t,a,b)=>clamp((t-a)/(b-a));
const speaking=(sp,t)=>LN.some(l=>l.sp===sp&&t>=l.start-.02&&t<=l.end+.02);
const env=t=>{const i=Math.floor(t*100);return ENV[Math.max(0,Math.min(ENV.length-1,i))]||0};
const mouthOpen=(sp,t)=>speaking(sp,t)?clamp(env(t)*1.6+.15):0;
const cam=(z,x,y,sh,t,fn,rot=0)=>{c.save();const dx=sh?Math.sin(t*71)*sh:0,dy=sh?Math.cos(t*93)*sh:0;c.translate(W/2+dx,H/2+dy);if(rot)c.rotate(rot);c.scale(z,z);c.translate(-x,-y);fn();c.restore()};
const LW=6;                       // thin storybook line for the figures
const BACK=1250, FRONT=1580;      // wall base line, front floor line
// ---------------- time of day ----------------
// 0 = sunny day, 1 = sunset, 2 = night
const tod=t=>t<7.0?0:t<9.9?lerp(0,1.35,ease(pr(t,7.0,9.9))):t<12.4?lerp(1.35,1.6,pr(t,9.9,12.4)):lerp(1.6,2,ease(pr(t,12.4,12.9)));
const hours=t=>t<7.0?pr(t,0,7)*.1:t<9.9?lerp(.1,2,ease(pr(t,7.0,9.9))):lerp(2,2.9,pr(t,9.9,DUR));
const growth=t=>t<7.0?0:t<9.9?ease(pr(t,7.0,9.9)):lerp(1,1.5,pr(t,9.9,DUR));
const mixc=(a,b,u)=>{const p=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16));const A=p(a),B=p(b);return'#'+A.map((v,i)=>Math.round(lerp(v,B[i],u)).toString(16).padStart(2,'0')).join('')};
function skyCols(d){const top=['#7CC8F2','#F28C5B','#1E2A5A'],bot=['#CDEBFA','#FFD38A','#3B4C86'];const k=Math.min(1,Math.floor(d)),u=d-k;return[mixc(top[k],top[Math.min(2,k+1)],u),mixc(bot[k],bot[Math.min(2,k+1)],u)]}
function sky(x,y,w,h,d,t){
 const[a,b]=skyCols(d);const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,a);g.addColorStop(1,b);c.fillStyle=g;c.fillRect(x,y,w,h);
 // sun goes down, moon comes up
 const su=clamp(d);const sx=x+w*.62,sy=y+h*(.25+.6*su);c.fillStyle=mixc('#FFE066','#FF8A3D',su);c.beginPath();c.arc(sx,sy,w*.11,0,7);c.fill();
 if(d>1.3){const m=pr(d,1.3,2);c.globalAlpha=m;c.fillStyle='#FFF6D8';c.beginPath();c.arc(x+w*.3,y+h*(.55-.3*m),w*.08,0,7);c.fill();c.fillStyle=a;c.beginPath();c.arc(x+w*.3+w*.035,y+h*(.55-.3*m)-w*.02,w*.07,0,7);c.fill();
  for(let i=0;i<7;i++){dot(x+((i*137)%100)/100*w,y+((i*61)%45)/100*h,3,'#FFFFFF')}c.globalAlpha=1}
 // neighbour houses + tree
 const hc=mixc('#E9A56B','#3A3550',clamp(d/2)),rc=mixc('#B5523B','#2A2340',clamp(d/2));
 for(const[hx,hw,hh]of[[.05,.38,.32],[.5,.42,.26]]){c.fillStyle=hc;c.fillRect(x+w*hx,y+h*(1-hh),w*hw,h*hh);c.fillStyle=rc;c.beginPath();c.moveTo(x+w*(hx-.03),y+h*(1-hh));c.lineTo(x+w*(hx+hw/2),y+h*(1-hh-.14));c.lineTo(x+w*(hx+hw+.03),y+h*(1-hh));c.fill();
  c.fillStyle=d>1.4?'#FFD86B':mixc('#BFE3F7','#FFD86B',clamp(d-.6));c.fillRect(x+w*(hx+hw*.3),y+h*(1-hh*.7),w*hw*.22,h*hh*.28)}
 c.fillStyle=mixc('#4FA956','#203A30',clamp(d/2));c.beginPath();c.ellipse(x+w*.92,y+h*.62,w*.16,h*.2,0,0,7);c.fill();
}
// ---------------- the room (world ~1600 x 1920) ----------------
function room(t){
 const d=tod(t);
 // wall with soft vertical shading + subtle wallpaper
 let g=c.createLinearGradient(0,0,1600,0);g.addColorStop(0,'#E9C9A2');g.addColorStop(.45,'#F6DDBB');g.addColorStop(1,'#E4C29A');c.fillStyle=g;c.fillRect(-800,-400,3200,BACK+400);
 c.globalAlpha=.18;for(let x=-760;x<2400;x+=120){for(let y=-360;y<BACK;y+=150){c.fillStyle='#C99B6E';c.beginPath();const o=((y/150)%2)*60;c.ellipse(x+o,y,10,16,0,0,7);c.fill()}}c.globalAlpha=1;
 g=c.createLinearGradient(0,0,0,BACK);g.addColorStop(0,'rgba(120,70,40,.18)');g.addColorStop(.25,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(-800,-400,3200,BACK+400);
 // skirting board
 rect(-800,BACK-36,3200,40,'#FFF4E4',5,INK,1.2);
 // floor: wooden boards with perspective
 g=c.createLinearGradient(0,BACK,0,1920);g.addColorStop(0,'#B9824F');g.addColorStop(1,'#93603A');c.fillStyle=g;c.fillRect(-800,BACK,3200,1200);
 c.strokeStyle='rgba(70,40,20,.35)';c.lineWidth=3;for(let i=-12;i<26;i++){c.beginPath();c.moveTo(800+(i-6)*120,BACK);c.lineTo(800+(i-6)*260,2100);c.stroke()}
 for(const y of[1330,1450,1620,1820]){c.beginPath();c.moveTo(-800,y);c.lineTo(2400,y);c.stroke()}
 // rug
 c.fillStyle='rgba(0,0,0,.12)';c.beginPath();c.ellipse(560,1530,560,150,0,0,7);c.fill();
 g=c.createRadialGradient(560,1510,40,560,1510,560);g.addColorStop(0,'#E77A6A');g.addColorStop(1,'#C2524A');c.fillStyle=g;c.beginPath();c.ellipse(560,1510,540,135,0,0,7);c.fill();
 c.strokeStyle='#F6D49A';c.lineWidth=8;c.beginPath();c.ellipse(560,1510,470,108,0,0,7);c.stroke();c.lineWidth=5;c.strokeStyle=INK;c.beginPath();c.ellipse(560,1510,540,135,0,0,7);c.stroke();
 // window with curtains (above the sofa)
 rect(150,420,400,470,null,0);sky(160,430,380,450,d,t);
 rect(150,420,400,470,null,10,'#FFFFFF',1);rect(150,420,400,470,null,4,INK,1.2);line([[350,420],[350,890]],8,'#FFFFFF',.6);line([[150,655],[550,655]],8,'#FFFFFF',.6);
 rect(130,890,440,26,'#FFF4E4',5,INK,1);
 for(const[x,dir]of[[110,1],[590,-1]]){g=c.createLinearGradient(x-50,0,x+50,0);g.addColorStop(0,'#3F8C8A');g.addColorStop(.5,'#5DB3AE');g.addColorStop(1,'#3F8C8A');
  shape([[x-50*dir,380],[x+70*dir,380],[x+48*dir,620],[x+80*dir,940],[x-50*dir,960]],g,5,INK,1.2);line([[x+10*dir,400],[x+5*dir,940]],3,'rgba(0,0,0,.25)',1)}
 line([[70,382],[630,382]],10,'#8B5A2B',.6);
 // wall clock (hands spin with the hours)
 const hr=hours(t);c.fillStyle='rgba(0,0,0,.12)';c.beginPath();c.arc(812,452,82,0,7);c.fill();oval(805,445,82,82,'#FFFDF6',6,INK,1.2);oval(805,445,70,70,null,3,'#C9A27A',.6);
 for(let i=0;i<12;i++){const a=i/12*6.283;line([[805+Math.cos(a)*58,445+Math.sin(a)*58],[805+Math.cos(a)*66,445+Math.sin(a)*66]],4,INK,.2)}
 const ha=-1.571+(4+hr)/12*6.283,ma=-1.571+hr*6.283;line([[805,445],[805+Math.cos(ha)*38,445+Math.sin(ha)*38]],9,INK,.3);line([[805,445],[805+Math.cos(ma)*58,445+Math.sin(ma)*58]],5,INK,.3);dot(805,445,7,'#D9534F');
 // framed picture
 // floor lamp (glows at night)
 const LX=-30;const lit=clamp(d-1);if(lit>0){const r=c.createRadialGradient(LX,760,10,LX,760,520);r.addColorStop(0,`rgba(255,214,140,${.55*lit})`);r.addColorStop(1,'rgba(255,214,140,0)');c.fillStyle=r;c.fillRect(LX-600,200,1200,1200)}
 line([[LX,BACK-20],[LX,800]],7,INK,.6);oval(LX,BACK-20,46,12,'#5a4636',5,INK,.6);shape([[LX-60,800],[LX+60,800],[LX+30,700],[LX-30,700]],mixc('#F6E3B4','#FFE69A',lit),5,INK,.8);
 // front door (right), open, outside visible
 const DX=1000,DW=320,DT=470;
 c.save();c.beginPath();c.rect(DX,DT,DW,BACK-DT);c.clip();sky(DX,DT,DW,(BACK-DT)*.75,d,t);
 c.fillStyle=mixc('#8ACB6E','#2E4A3A',clamp(d/2));c.fillRect(DX,DT+(BACK-DT)*.72,DW,(BACK-DT)*.3);c.fillStyle=mixc('#CFC6B8','#4D4A58',clamp(d/2));c.fillRect(DX,BACK-60,DW,60);c.restore();
 rect(DX-24,DT-24,DW+48,BACK-DT+24,null,22,'#FFF4E4',1);rect(DX-34,DT-34,DW+68,BACK-DT+34,null,5,INK,1);rect(DX,DT,DW,BACK-DT,null,5,INK,1);
 // open door leaf
 shape([[DX+DW,DT],[DX+DW+120,DT-40],[DX+DW+120,BACK+40],[DX+DW,BACK]],'#A0522D',5,INK,1);dot(DX+DW+100,860,9,'#F4C430');
 // sofa (teal, shaded) on the left
 c.fillStyle='rgba(0,0,0,.16)';c.beginPath();c.ellipse(420,1290,380,40,0,0,7);c.fill();
 g=c.createLinearGradient(0,980,0,1280);g.addColorStop(0,'#5BAFA8');g.addColorStop(1,'#3B8780');
 rect(70,980,700,190,g,6,INK,1.6);rect(60,1150,720,120,g,6,INK,1.6);
 for(const x of[40,730]){rect(x,1060,80,210,'#4A9C95',6,INK,1.4)}
 for(const[x,col]of[[200,'#F2C14E'],[560,'#E8607A']]){shape([[x-80,1000],[x+80,990],[x+90,1120],[x-90,1130]],col,5,INK,1.6)}
 line([[300,1170],[300,1260]],3,'rgba(0,0,0,.25)',1);line([[540,1170],[540,1260]],3,'rgba(0,0,0,.25)',1);
 for(const x of[90,750])line([[x,1270],[x,1300]],10,'#5a3a22',.4);
 // coffee table with snacks
 c.fillStyle='rgba(0,0,0,.16)';c.beginPath();c.ellipse(560,1470,230,30,0,0,7);c.fill();
 shape([[330,1360],[790,1360],[760,1400],[360,1400]],'#C98B55',5,INK,1);rect(360,1400,400,20,'#A86E3E',5,INK,1);
 for(const x of[380,740])line([[x,1420],[x,1480]],10,'#7A4B2A',.4);
 shape([[430,1290],[500,1282],[510,1364],[424,1366]],'#F4C430',5,INK,1);line([[440,1300],[495,1296]],4,'#D9534F',.4);
 rect(620,1310,46,54,'#FFFFFF',5,INK,.8);line([[666,1322],[684,1330],[666,1350]],5,INK,.4);
 // potted plant (grows over the hours)
 plant(t);
}
function plant(t){
 const gr=growth(t),px=900,py=BACK+40;
 c.fillStyle='rgba(0,0,0,.16)';c.beginPath();c.ellipse(px,py+8,70,14,0,0,7);c.fill();
 shape([[px-60,py-110],[px+60,py-110],[px+46,py],[px-46,py]],'#D9734A',5,INK,1);rect(px-68,py-130,136,26,'#E8865C',5,INK,.8);
 const n=5+Math.round(gr*4);for(let i=0;i<n;i++){const a=-2.6+i/(n-1)*2.0,L=(130+gr*260)*(.7+.3*Math.sin(i*2.1)),droop=gr*.5*(i/n);
  const p0=[px,py-125],p1=[px+Math.cos(a)*L*.6,py-125+Math.sin(a)*L*.6],p2=[px+Math.cos(a+droop)*L,py-125+Math.sin(a+droop)*L+gr*L*.25];
  line([p0,p1,p2],5,'#2F7A3A',1);oval(p2[0],p2[1],30+gr*10,16+gr*6,'#4FA956',4,INK,.8,a+droop);oval(p1[0],p1[1],22,12,'#58B15E',4,INK,.6,a)}
}
// ---------------- thin-line stick figure ----------------
// o.x,o.y = between the feet. local up = -y. joints: hip, shoulder; limbs: [elbow/knee dx,dy, hand/foot dx,dy] relative to shoulder/hip.
function stick(o){
 const s=o.s||1;c.save();c.translate(o.x,o.y);if(o.rot)c.rotate(o.rot);c.scale(s*(o.flip?-1:1),s);
 const hip=o.hip||[0,-210],sh=[hip[0]+(o.lean||0)*170,hip[1]-170],r=o.r||62;
 const L=o.legs||[[-22,105,-40,210],[22,105,40,210]],A=o.arms||[[-40,80,-55,160],[40,80,55,160]];
 const lw=LW/Math.sqrt(s);
 // dress / saree behind limbs
 if(o.saree){shape([[sh[0]-30,sh[1]+10],[sh[0]+30,sh[1]+10],[hip[0]+70,hip[1]+200],[hip[0]-70,hip[1]+200]],o.saree,lw,INK,1.4);
  shape([[sh[0]+28,sh[1]+6],[sh[0]-10,sh[1]+40],[hip[0]-60,hip[1]+40],[hip[0]-52,hip[1]+10]],o.pallu||'#F4C430',lw*.8,INK,1)}
 for(const l of L){line([[hip[0],hip[1]],[hip[0]+l[0],hip[1]+l[1]],[hip[0]+l[2],hip[1]+l[3]]],lw,INK,1.4);const fx=hip[0]+l[2],fy=hip[1]+l[3];
  if(o.shoes)shape([[fx-12,fy-12],[fx+40,fy-14],[fx+46,fy+4],[fx-14,fy+6]],o.shoes,lw*.8,INK,.6);else line([[fx-6,fy],[fx+26,fy]],lw,INK,.6)}
 if(o.shirt){shape([[sh[0]-34,sh[1]-4],[sh[0]+34,sh[1]-4],[hip[0]+30,hip[1]+6],[hip[0]-30,hip[1]+6]],o.shirt,lw,INK,1.2);if(o.collar){shape([[sh[0]-18,sh[1]-6],[sh[0],sh[1]+20],[sh[0]+18,sh[1]-6]],'#FFFFFF',lw*.7,INK,.4)}}
 else if(!o.saree)line([[sh[0],sh[1]],[hip[0],hip[1]]],lw,INK,1.4);
 if(o.shorts)shape([[hip[0]-30,hip[1]-6],[hip[0]+30,hip[1]-6],[hip[0]+40,hip[1]+60],[hip[0]+4,hip[1]+62],[hip[0],hip[1]+20],[hip[0]-4,hip[1]+62],[hip[0]-40,hip[1]+60]],o.shorts,lw*.8,INK,.8);
 for(const a of A){line([[sh[0],sh[1]],[sh[0]+a[0],sh[1]+a[1]],[sh[0]+a[2],sh[1]+a[3]]],lw,INK,1.2);oval(sh[0]+a[2],sh[1]+a[3],11,11,'#FFFFFF',lw*.8,INK,.4)}
 if(o.prop)o.prop(sh);
 c.save();c.translate(sh[0]+(o.hx||0),sh[1]-r-14);c.rotate(o.tilt||0);
 if(o.hairBack)o.hairBack(r,lw);
 face({ear:false,nose:false,skin:'#FFFFFF',lw,r,...o.face});
 if(o.hairFront)o.hairFront(r,lw);
 if(o.blush){c.globalAlpha=.35;dot(-r*.5,r*.25,r*.13,'#E8607A');dot(r*.5,r*.25,r*.13,'#E8607A');c.globalAlpha=1}
 c.restore();c.restore();
}
// hair
const sonHair=(slick)=>(r,lw)=>{if(slick){shape([[-r*.95,-r*.25],[-r*.85,-r*.85],[-r*.1,-r*1.12],[r*.8,-r*.95],[r*1.0,-r*.35],[r*.5,-r*.7],[-r*.4,-r*.65]],'#1A1A1A',lw,INK,.6);c.globalAlpha=.7;line([[-r*.3,-r*.9],[r*.3,-r*.95]],5,'#FFFFFF',.2);c.globalAlpha=1}
 else{shape([[-r*.95,-r*.2],[-r*1.05,-r*.7],[-r*.7,-r*1.15],[-r*.3,-r*.95],[0,-r*1.25],[r*.3,-r*.95],[r*.75,-r*1.15],[r*1.0,-r*.6],[r*.95,-r*.2],[r*.4,-r*.62],[-r*.4,-r*.6]],'#1A1A1A',lw,INK,1)}};
const momHair=(r,lw)=>{shape([[-r*1.0,-r*.1],[-r*.95,-r*.8],[-r*.2,-r*1.1],[r*.7,-r*.95],[r*1.0,-r*.1],[r*.6,-r*.7],[-r*.6,-r*.7]],'#2B1B16',lw,INK,.8);oval(r*.0,-r*1.18,r*.36,r*.28,'#2B1B16',lw,INK,.8);dot(0,-r*.95,r*.07,'#D9534F')};
const auntyHair=(r,lw)=>{for(let i=0;i<9;i++){const a=3.4+i/8*2.6;oval(Math.cos(a)*r*.92,Math.sin(a)*r*.95,r*.3,r*.27,'#6B3B2A',lw*.8,INK,.8)}};
const bindi=(r)=>dot(0,-r*.55,r*.06,'#D9534F');
// ---------------- characters ----------------
const MOMX=1110,AUNTX=1250,DOORY=BACK+10,DS=.86;
function son(t){
 if(t<2.98){ // lying on the sofa, phone up; pops up on "FIVE"
  const up=ease(pr(t,.75,1.05))*(1-ease(pr(t,2.7,2.95)));
  stick({x:640,y:1160,rot:-1.571+.18+up*.15,s:.92,shorts:'#4A7BD0',legs:[[-10,100,-20,200],[30,96,60,190]],arms:[[50,60,90,-20],[-40,70,-30,140]],
   prop:sh=>{rect(sh[0]+70,sh[1]-70,40,64,'#333',4,INK,.4);rect(sh[0]+75,sh[1]-64,30,52,'#8FD3F2',0)},
   face:{mouth:up>.5?'open':'flat',open:.5,eye:up>.5?1.25:.85,pupil:up>.5?.2:.36,look:up>.5?[1,-.2]:[.6,-.5],brow:up>.5?.6:-.2},hairFront:sonHair(false),tilt:-.15});
  return}
 if(t<3.06){ // whoosh
  c.save();c.globalAlpha=.8;for(let i=0;i<8;i++)line([[560+i*20,900+i*70],[1050+i*10,950+i*70]],10,'#FFFFFF',2);c.restore();return}
 const dressed={shirt:'#2FA6A0',collar:true,shoes:'#7A4B2A',hairFront:sonHair(true)};
 if(t<7.0){ // ready, proud, then waiting
  const bob=Math.sin(t*9)*6*(t<4.1?1:0),wait=pr(t,5.6,7.0);
  const f=t<4.1?{mouth:speaking('s',t)?'open':'grin',open:mouthOpen('s',t),eye:1.1,pupil:.3,brow:.3,look:[0,0]}:{mouth:wait>.5?'flat':'smile',eye:1,pupil:.32,brow:lerp(.2,-.5,wait),look:[1,0]};
  stick({x:790,y:FRONT-bob,s:1,...dressed,legs:[[-24,105,-36,210],[24,105,36,210]],arms:t<4.1?[[-60,40,-30,90],[60,40,30,90]]:[[-30,90,-36,170],[30,90,36,170]],face:f,blush:t<4.1});
  if(t<4.0){for(let i=0;i<4;i++){const a=t*4+i*1.57;star(790+Math.cos(a)*170,FRONT-430+Math.sin(a)*140,16+6*Math.sin(t*12+i),'#FFE066',4)}}
  return}
 if(t<9.0){ // sitting on the floor, chin on hand
  const sag=pr(t,8.3,9.0);
  stick({x:760,y:FRONT,s:1,...dressed,hip:[0,-40],lean:.1+sag*.2,legs:[[50,-60,140,0],[70,-40,170,0]],arms:[[50,40,70,-30],[-30,80,-50,150]],face:{mouth:'flat',eye:.95,pupil:.36,brow:-.6,look:[1,.2]},tilt:.25});
  return}
 // lying flat on the floor (head left), cat on the belly
 const late=t>17.4;
 const f=t<12.4?{mouth:speaking('s',t)?'open':'flat',open:mouthOpen('s',t)*.7,eye:.9,pupil:.34,brow:-.7,look:[0,-.6]}:
  (t>15.6?{mouth:'flat',eye:1.0,pupil:.3,brow:-.2,look:[0,0]}:{mouth:'wobble',eye:.9,pupil:.34,brow:-.7,look:[0,-.6]});
 stick({x:1010,y:1640,rot:-1.571,s:.95,...dressed,legs:[[-6,105,-10,210],[16,105,26,208]],arms:[[-60,60,-110,120],[30,80,40,160]],face:f});
 // eye-lid droop for the dead stare
 cat(t);
}
function cat(t){
 if(t<9.1)return;const walk=pr(t,9.1,9.75),cx=lerp(-160,730,ease(walk)),cy=lerp(1700,1588,ease(walk));const curled=walk>=1;
 c.save();c.translate(cx,cy);
 if(!curled){const ph=Math.sin(t*20);oval(0,0,70,40,'#F08A24',5,INK,1);for(const k of[-40,40])line([[k,20],[k+ph*12,58]],6,INK,.5);oval(70,-30,36,32,'#F08A24',5,INK,1);shape([[50,-55],[60,-80],[75,-58]],'#F08A24',4,INK,.4);shape([[78,-58],[95,-80],[100,-50]],'#F08A24',4,INK,.4);dot(82,-32,4);dot(96,-32,4);line([[-70,-5],[-110,-50+ph*10]],7,INK,.6)}
 else{const br=1+Math.sin(t*3)*.03;oval(0,0,80*br,48*br,'#F08A24',5,INK,1);line([[-40,-30],[-10,-40],[20,-30]],4,'#C25E10',.4);oval(-60,-10,34,30,'#F08A24',5,INK,1);shape([[-80,-30],[-74,-56],[-60,-36]],'#F08A24',4,INK,.4);shape([[-56,-36],[-44,-58],[-38,-30]],'#F08A24',4,INK,.4);
  for(const q of[-1,1])line([[-62+q*12,-12],[-56+q*12,-8]],4,INK,.2);line([[70,10],[40,40],[-20,44]],8,INK,.6);
  if(t>9.9){c.globalAlpha=.7;text('z',40+Math.sin(t*2)*6,-80-((t*30)%40),34,'#5a5a7a',{w:900});c.globalAlpha=1}}
 c.restore();
}
function cobweb(u){if(u<=0)return;c.save();c.globalAlpha=u*.85;const ax=1030,ay=1650,bx=742,by=1470;c.strokeStyle='#FFFFFF';c.lineWidth=3;
 for(let i=0;i<5;i++){c.beginPath();c.moveTo(ax,ay);c.lineTo(lerp(bx,ax,i*.12),by+i*16);c.stroke()}for(let k=1;k<4;k++){c.beginPath();for(let i=0;i<5;i++){const x=lerp(ax,lerp(bx,ax,i*.12),k/4),y=lerp(ay,by+i*16,k/4);i?c.lineTo(x,y):c.moveTo(x,y)}c.stroke()}c.restore()}
function mom(t){
 const talking=speaking('m',t),op=mouthOpen('m',t);
 if(t<17.4){
  let arms,f,tilt=0,lean=0,flip=true;
  if(t<3.0){arms=[[-40,-30,-10,-80],[40,80,50,160]];f={mouth:'open',open:Math.max(.35,op),eye:1.1,pupil:.3,brow:.4,look:[-1,0]};lean=-.12;tilt=.1}       // hand by mouth, shouting into the house
  else if(t<14.5){const laugh=t>5.4&&t<7.2;arms=laugh?[[-40,60,-10,120],[50,40,80,-10]]:[[-40,80,-50,160],[50,60,90,40]];f={mouth:talking?'open':(laugh?'grin':'smile'),open:op,eye:laugh?.8:1,pupil:.34,brow:.2,look:[1,0],eyes:laugh&&!talking?'closed':undefined};flip=false;tilt=laugh?Math.sin(t*14)*.08:0}
  else {const g=t<16.8;arms=g?[[-50,-30,-25,-130],[50,-30,25,-130]]:[[-40,80,-50,160],[50,60,90,40]];f={mouth:talking?'open':'open',open:Math.max(.5,op),eye:1.35,pupil:.2,brow:.8,look:[1,0]};flip=false}
  stick({x:MOMX,y:DOORY,s:DS,saree:'#E8607A',pallu:'#F4C430',arms,face:{...f},hairBack:momHair,hairFront:(r)=>bindi(r),tilt,lean,flip,blush:true,legs:[[-14,105,-26,210],[14,105,26,210]]});
  return}
 // storms in: angry, pointing down at the son
 const inU=ease(pr(t,17.4,17.7)),x=lerp(MOMX,1170,inU),y=lerp(DOORY,FRONT+30,inU),s=lerp(DS,1.02,inU);
 stick({x,y,s,saree:'#E8607A',pallu:'#F4C430',arms:[[-60,40,-150,90+Math.sin(t*18)*10],[40,60,60,-10]],face:{mouth:talking?'scream':'open',open:Math.max(.6,op),eye:1.3,pupil:.16,brow:-1,look:[-1,.6],veins:true},hairBack:momHair,hairFront:(r)=>bindi(r),flip:false,lean:-.12,tilt:.08,legs:[[-24,105,-40,210],[24,105,40,210]]});
}
function aunty(t){
 if(t<3.6)return;
 const inU=ease(pr(t,3.6,4.05)),x=lerp(1400,AUNTX,inU),talking=speaking('a',t),op=mouthOpen('a',t);
 let arms=[[-40,70,-50,150],[40,60,60,120]],f={mouth:talking?'open':'smile',open:op,eye:1,pupil:.34,brow:.2,look:[-1,0]},tilt=0;
 if(t>12.4&&t<14.5){arms=[[-50,20,-80,-40],[40,60,60,120]];f={...f,eye:.8,brow:.6,look:[-1,0]};tilt=-.15}                  // gossip whisper, hand by mouth
 if(t>17.4){arms=[[-50,-20,-60,-120+Math.sin(t*12)*20],[40,60,60,120]];f={mouth:'grin',eye:1,pupil:.34,brow:.3,look:[-1,0]}}   // still waving bye
 stick({x,y:DOORY,s:DS*.97,saree:'#8E5BD0',pallu:'#3FB6A8',arms,face:f,hairBack:auntyHair,hairFront:(r)=>bindi(r),flip:true,tilt,blush:true,
  prop:sh=>{oval(sh[0]+70,sh[1]+150,34,28,'#B5523B',4,INK,.4)},legs:[[-14,105,-26,210],[14,105,26,210]]});
}
function nightTint(t){const n=clamp(tod(t)-1);if(n<=0)return;c.save();c.globalAlpha=.16*n;c.fillStyle='#2A3570';c.fillRect(-800,-400,3200,2600);c.restore()}
function world(t){room(t);aunty(t);mom(t);son(t);nightTint(t)}
// ---------------- shots ----------------
const SHOTS=[
 [0,1.2,t=>cam(lerp(.84,.92,pr(t,0,1.2)),660,1120,0,t,()=>world(t))],
 [1.2,2.98,t=>cam(lerp(1.55,1.75,pr(t,1.2,2.98)),1080,1020,t<2.9?4:0,t,()=>world(t))],
 [2.98,3.06,t=>cam(1.3,lerp(560,790,pr(t,2.98,3.06)),1250,0,t,()=>world(t))],
 [3.06,4.0,t=>cam(lerp(1.75,1.55,ease(pr(t,3.06,3.4))),790,1300,0,t,()=>world(t))],
 [4.0,6.2,t=>cam(lerp(1.15,1.25,pr(t,4.0,6.2)),1000,1080,0,t,()=>world(t))],
 [6.2,7.0,t=>cam(lerp(1.7,1.9,pr(t,6.2,7.0)),790,1240,0,t,()=>world(t))],
 [7.0,7.7,t=>cam(2.25,350,655,0,t,()=>world(t))],
 [7.7,8.3,t=>cam(3.2,805,450,0,t,()=>world(t),Math.sin(t*20)*.02)],
 [8.3,9.0,t=>cam(1.45,820,1350,0,t,()=>world(t))],
 [9.0,9.9,t=>cam(1.1,700,1400,0,t,()=>world(t))],
 [9.9,12.4,t=>cam(lerp(1.75,2.0,pr(t,9.9,12.4)),680,1560,0,t,()=>world(t))],
 [12.4,14.5,t=>cam(lerp(1.45,1.6,pr(t,12.4,14.5)),1175,1000,0,t,()=>world(t))],
 [14.5,15.6,t=>cam(lerp(2.0,2.15,pr(t,14.5,15.6)),1115,960,3,t,()=>world(t))],
 [15.6,17.4,t=>cam(lerp(2.3,2.6,pr(t,15.6,17.4)),600,1630,0,t,()=>world(t))],
 [17.4,19.1,t=>cam(lerp(2.2,1.6,ease(pr(t,17.4,17.7))),1050,1250,t<19?5:0,t,()=>world(t))],
 [19.1,99,t=>{const u=ease(pr(t,19.1,20.4));cam(lerp(2.4,1.0,u),lerp(600,770,u),lerp(1630,1290,u),0,t,()=>world(t))}],
];
export function draw(t){setBoil(Math.floor(t*10));c.save();c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,W,H);
 for(const[a,b,fn]of SHOTS)if(t>=a&&t<b){fn(t);break}
 c.restore();
 // storybook setup label at the top
 c.save();c.fillStyle='rgba(255,255,255,.95)';c.strokeStyle=INK;c.lineWidth=5;const bx=110,by=150,bw=W-220,bh=200;c.beginPath();c.roundRect(bx,by,bw,bh,40);c.fill();c.stroke();c.restore();
 text('When mom says',W/2,by+62,62,INK,{w:800});text('"leaving in 5 minutes"',W/2,by+140,66,'#D9534F',{w:900});
 caption(groups,t,KEYS,1700);finish(t)}
export const cues=[];
