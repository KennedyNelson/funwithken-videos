// ---------- scene v2: Kalu & Bettery (superkick edition) ----------
mkNoise();
const T=TIMX.T,A=TIMX.A,PV=A.pivot,KT=A.kick,END=A.end;
const bump=(t,t0,d)=>(t<t0||t>t0+d)?0:Math.sin((t-t0)/d*Math.PI);
function hex(c){return[1,3,5].map(i=>parseInt(c.slice(i,i+2),16))}
function mixc(a,b,u){const A=hex(a),B=hex(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*u).toString(16).padStart(2,'0')).join('')}
// ---- looks (funny hair) ----
KALU.onShirt=null;BETT.onShirt=null;
KALU.backHair=null;
KALU.hair=(t,P,rx,ry)=>{ // short black crop with a side part
  arcHair(rx,ry,Math.PI+0.1,2*Math.PI-0.1,0.16,'#161616');
  smooth([[-rx*0.92,-ry*0.45],[-rx*0.5,-ry*0.8],[rx*0.3,-ry*0.86],[rx*0.92,-ry*0.5],[rx*0.55,-ry*0.97],[-rx*0.6,-ry*0.98]],true,1.3,190);ctx.fillStyle='#161616';ctx.fill();stroke(7);
  pl([[-rx*0.25,-ry*1.12],[-rx*0.1,-ry*0.84]],4,'#555',0.4,191)};
BETT.hair=(t,P,rx,ry)=>{ // neat black hair, side-swept fringe
  arcHair(rx,ry,Math.PI+0.05,2*Math.PI-0.05,0.18,'#161616');
  smooth([[-rx*1.0,-ry*0.4],[-rx*0.7,-ry*0.85],[rx*0.1,-ry*0.95],[rx*0.95,-ry*0.45],[rx*0.9,-ry*0.85],[0,-ry*1.05],[-rx*0.8,-ry*0.95]],true,1.3,210);ctx.fillStyle='#161616';ctx.fill();stroke(7);
  smooth([[-rx*0.9,-ry*0.5],[-rx*0.2,-ry*0.62],[rx*0.5,-ry*0.8],[rx*0.1,-ry*0.9]],true,1.1,211);ctx.fillStyle='#161616';ctx.fill();stroke(6)};
BETT.mous=false;
// ---- background: minimal outdoor chai stall ----
const TUFTS=[[90,1250],[260,1215],[430,1262],[700,1205],[780,1275],[930,1230],[1010,1290],[40,1300],[600,1300]];
function tree(x,base,h,r,col){
  smooth([[x-34,base],[x-28,base-h*0.5],[x-40,base-h],[x+40,base-h],[x+28,base-h*0.5],[x+34,base]],true,2,700+x);ctx.fillStyle='#9b6b43';ctx.fill();stroke(8);
  pl([[x-6,base-h*0.2],[x+6,base-h*0.45]],5,'#6b4527',1,701);
  for(const[dx,dy,rr]of[[-r*0.55,-h-r*0.1,r*0.75],[r*0.55,-h-r*0.15,r*0.7],[0,-h-r*0.65,r*0.8],[0,-h+r*0.05,r*0.7]])blob(x+dx,base+dy,rr,rr*0.88,col,8,a=>0.05*Math.sin(5*a+x),2.2,710+dx)}
function bg(t){
  ctx.fillStyle='#cfe5ea';ctx.fillRect(-600,-1000,2400,2250);               // sky
  const hz=1190;
  ctx.fillStyle='#a8c98b';ctx.fillRect(-600,hz,2400,150);                     // grass band
  ctx.fillStyle='#dccfa6';ctx.fillRect(-600,hz+150,2400,1400);                // dirt path
  pl([[-500,hz],[540,hz-5],[1600,hz]],6,'#5d7a4a',2,200);
  pl([[-500,hz+150],[300,hz+146],[1600,hz+152]],6,'#a89b6a',2,201);
  // sun + clouds
  ctx.save();ctx.translate(880,250);for(let i=0;i<10;i++){const a=i/10*6.283+t*0.2;pl([[Math.cos(a)*105,Math.sin(a)*105],[Math.cos(a)*150,Math.sin(a)*150]],7,'#e0b92c',1,220+i)}blob(0,0,82,82,'#ffe58a',8,null,1.6,230);ctx.restore();
  blob(240+Math.sin(t*0.3)*10,330,110,44,'#fff',7,a=>0.06*Math.sin(4*a),2,240);blob(330+Math.sin(t*0.3)*10,310,70,38,'#fff',7,null,2,241);
  blob(640,170,90,34,'#fff',7,a=>0.06*Math.sin(3*a),2,242);
  // trees and bushes
  tree(95,1290,420,170,'#79b45a');tree(1000,1250,230,110,'#8cc06a');
  for(const[x,y,r]of[[330,1200,42],[372,1192,30],[860,1196,38],[895,1190,26]])blob(x,y,r,r*0.8,'#6fa650',7,null,1.6,250+x);
  for(const[x,y]of TUFTS){pl([[x-10,y],[x-14,y-24]],5,'#5d7a4a',0.6,260+x);pl([[x,y],[x,y-32]],5,'#5d7a4a',0.6,261+x);pl([[x+10,y],[x+16,y-22]],5,'#5d7a4a',0.6,262+x)}
  for(const[x,y]of[[200,1500],[520,1560],[880,1520],[760,1700]])blob(x,y,12,7,'#bfb184',5,null,1,270+x);
}
function mosaicBar(x,y,len,h){
  if(len<10)return;ctx.save();ctx.beginPath();ctx.roundRect(x,y-h/2,len,h,h/2);ctx.clip();
  const sq=h/3;for(let i=0;i*sq<len;i++)for(let j=0;j<3;j++){ctx.fillStyle=((i+j)%2)?'#9a9a9a':'#d4d4d4';ctx.fillRect(x+i*sq,y-h/2+j*sq,sq+1,sq+1)}
  ctx.restore();ctx.beginPath();ctx.roundRect(x,y-h/2,len,h,h/2);stroke(8)}
function star(x,y,r,fill,rot=0,n=5,inner=0.45){ctx.beginPath();for(let i=0;i<n*2;i++){const a=rot+i*Math.PI/n-Math.PI/2,rr=i%2?r*inner:r;ctx.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.lineWidth=6;ctx.strokeStyle=INK;ctx.lineJoin='round';ctx.stroke()}
function comic(s,x,y,size,col,rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.font=`900 ${size}px IB`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';ctx.lineWidth=size*0.22;ctx.strokeStyle='#000';ctx.strokeText(s,0,0);ctx.fillStyle=col;ctx.fillText(s,0,0);ctx.restore()}
// ---------- poses ----------
const CK=T.K2[1]-0.9;           // kulhad cracks
function poseK(t){
  const spk=env('K',t);const P={x:330,y:1450,sx:1,sy:1};
  const sad=true;
  P.lean=kf([[0,-0.08],[T.K1[0],-0.1],[T.K2[0],-0.06],[T.B2[0],-0.1],[PV-0.1,-0.1],[PV+0.4,0],[END,0.02]],t);
  P.tilt=kf([[0,0.12],[PV-0.1,0.12],[PV+0.3,-0.1],[END,-0.06]],t);
  P.bob=sad?Math.sin(t*2.2)*3:0;P.sy=1+(sad?Math.sin(t*2.2)*0.01:0);
  P.armL=[-125,-240];P.armR=t<CK+0.1?[118,-330]:[125,-250];
  if(t>=PV-0.5){P.armR=[kf([[PV-0.5,125],[PV+0.3,150]],t),kf([[PV-0.5,-250],[PV+0.3,-300]],t)];P.armL=[-120+kf([[PV-0.5,0],[T.K3[0]+0.5,62]],t),-250+kf([[PV-0.5,0],[T.K3[0]+0.5,36]],t)]}
  P.eye=sad?{bulge:1.1,pupil:0.55,veins:0,lx:0,ly:0.55}:{bulge:1,pupil:1,veins:0,lx:0.7,ly:0};
  P.brow=sad?{a:0.6,y:0}:{a:-0.2,y:-4};
  const sp=(t>=T.K1[0]&&t<=T.K1[1])||(t>=T.K2[0]&&t<=T.K2[1])||(t>=T.K3[0]&&t<=T.K3[1]);
  P.mouth=sp?{type:'open',o:Math.min(1,0.15+spk*0.9)}:{type:sad?'frown':'smirk',o:0};
  
  P.holdR=(tt)=>{
    if(tt<CK+0.1){ctx.save();ctx.translate(0,-8);smooth([[-34,-60],[34,-60],[26,0],[-26,0]],true,1,430);ctx.fillStyle='#b5683c';ctx.fill();stroke(7);ell(0,-60,34,8,'#7a3f20',5);
      if(tt>CK-0.05){pl([[-4,-60],[6,-30],[-6,-10],[2,0]],5,'#fff',0.4,431)}
      for(let i=0;i<2;i++){const ph=(tt*0.8+i/2)%1;ctx.save();ctx.globalAlpha=1-ph;pl([[-8+i*14,-72-ph*40],[2+i*14,-90-ph*40],[-10+i*14,-110-ph*40]],4,'#eee',0.4,432+i);ctx.restore()}
      ctx.restore()}
    else if(tt<CK+0.9){const u=(tt-CK-0.1);for(const s2 of[-1,1]){ctx.save();ctx.translate(s2*u*40,u*u*420);ctx.rotate(s2*u*3);smooth([[0,-60],[s2*34,-60],[s2*26,0],[0,0]],true,1,433);ctx.fillStyle='#b5683c';ctx.fill();stroke(7);ctx.restore()}}};
  return P}
function poseB(t){
  const spk=env('B',t);const P={x:760,y:1450,sx:1,sy:1};
  const RT=KT;
  P.x=kf([[0,760],[T.B2[0]-0.2,760],[T.B2[0]+0.1,700],[END,700]],t);
  P.lean=kf([[0,0.0],[T.B1[0]+0.1,-0.02],[T.B1[0]+0.3,-0.07],[T.B1[1],-0.07],[T.B1[1]+0.3,0],[T.B2[0]-0.2,0],[T.B2[0]+0.1,-0.05],[PV,-0.05],[PV+0.7,0],[RT,0],[RT+0.4,0.05],[END,0.05]],t);
  P.tilt=kf([[0,0],[T.B1[0]+0.2,-0.1],[T.B1[1],-0.1],[T.B2[0],-0.1],[PV,-0.05],[PV+0.7,0],[RT,0],[RT+0.3,0.28],[END,0.3]],t)+(t>=RT+0.3?Math.sin((t-RT-0.3)*6)*0.07:0);
  const sp=(t>=T.B1[0]&&t<=T.B1[1])||(t>=T.Bq[0]&&t<=T.Bq[1])||(t>=T.B2[0]&&t<=T.B2[1]);
  P.armR=[150,-250];P.armL=[-150,-250];
  if(t>=T.B2[0]-0.1&&t<PV+0.3){P.armL=[kf([[T.B2[0]-0.1,-150],[T.B2[0]+0.5,-215]],t),kf([[T.B2[0]-0.1,-250],[T.B2[0]+0.5,-400]],t)]}
  if(t>=PV+0.3&&t<RT){P.armL=[-150,-250];P.armR=[150,-250]}
  P.legs=null;
  P.skin='#e9c7a0';
  const L=t<PV;
  P.eye=t>=RT?{bulge:1,pupil:0.7,veins:0,lx:0,ly:0.7,lid:ease((t-RT)/0.2)*0.55}:L?{bulge:1,pupil:1,veins:0,lx:-0.7,ly:0.1}:{bulge:1,pupil:1,veins:0,lx:-0.5,ly:0.1};
  P.brow=t>=RT?{a:0.55,y:-6}:t<T.B1[0]?{a:0.3,y:0}:t<PV?{a:0.45,y:2}:{a:0.15,y:0};
  P.mouth=sp?{type:'open',o:Math.min(1,0.15+spk*0.9)}:t>=RT?{type:'frown',o:0}:t<PV?{type:'frown',o:0}:{type:'flat',o:0};
  P.sweat=0;P.glasses={y:t>=RT?kf([[RT,0],[RT+0.4,10]],t):0};P.shake=0;
  return P}
// ---------- camera ----------
function cam(t){
  // both characters stay in frame in every shot: gentle pushes and small pans only
  const seg=(a,b)=>Math.min(1,Math.max(0,(t-a)/(b-a)));
  let cx,cy,z;
  if(t>=KT){const u=seg(KT,END);cx=lerp(560,600,u);cy=1000;z=lerp(1.28,1.4,u)}
  else if(t<T.K1[0]-0.1){const u=seg(0,T.K1[0]-0.1);cx=540;cy=980;z=lerp(1.12,1.2,u)}
  else if(t<T.Bq[0]-0.1){const u=seg(T.K1[0],T.Bq[0]);cx=lerp(470,490,u);cy=990;z=lerp(1.22,1.32,u)}
  else if(t<T.K2[0]-0.05){const u=seg(T.Bq[0],T.K2[0]);cx=lerp(600,580,u);cy=990;z=lerp(1.22,1.32,u)}
  else if(t<T.B2[0]-0.1){const u=seg(T.K2[0],T.B2[0]);cx=lerp(480,500,u);cy=995;z=lerp(1.2,1.3,u)}
  else if(t<T.K3[0]-0.05){const u=seg(T.B2[0],T.K3[0]);cx=lerp(590,560,u);cy=1000;z=lerp(1.22,1.3,u)}
  else{const u=seg(T.K3[0],KT);cx=540;cy=1000;z=lerp(1.2,1.28,u)}
  return{cx,cy,z,sx:0,sy:0}}
// ---------- captions ----------
const CAP=[
 ['B1',['KALUU,','KYA HO GYA?'],[0]],
 ['K1',['YAAR BETTERY,','BREAKUP','HO GYA'],[1]],
 ['Bq',['KYU?'],[0]],
 ['K2',['BOL RHI THI,','BILKUL SERIOUS','NHI HU KISI BHI','CHEEZ KO LEKE'],[1]],
 ['B2',['CHOD USKO,','TU BATA','KAISA HE?'],[]],
 ['K3',['KALA HE,','LAMBA HE,','LEGA KYA?'],[0,1,2]]];
function captions(t){
  for(const[k,chunks,hi]of CAP){
    const[s,e]=T[k];if(t<s-0.05||t>e+(k==='K3'?0.1:0.25))continue;
    const tot=chunks.reduce((a,c)=>a+c.length,0);let acc=s-0.05;
    for(let i=0;i<chunks.length;i++){
      const d=(e-s+0.05)*chunks[i].length/tot,a0=acc,a1=i===chunks.length-1?e+0.25:acc+d;acc+=d;
      if(t>=a0&&t<a1){
        const u=ease((t-a0)/0.1);const col=hi.includes(i)?(k==='K3'?'#ffe14a':'#ff5a4a'):'#fff';
        const big=k==='K3'?1.15:1;
        ctx.save();ctx.translate(W/2,1590);ctx.scale((0.8+0.2*u)*big,(0.8+0.2*u)*big);
        ctx.font='900 84px IB';ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';ctx.lineWidth=20;ctx.strokeStyle='#000';ctx.strokeText(chunks[i],0,0);ctx.fillStyle=col;ctx.fillText(chunks[i],0,0);ctx.restore();
      }}}
}
// ---------- main draw ----------
function draw(t){
  FS=Math.floor(t*10);ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,W,H);
  const C=cam(t);
  ctx.save();ctx.translate(W/2+C.sx,H/2+C.sy);ctx.scale(C.z,C.z);ctx.translate(-C.cx,-C.cy);
  bg(t);
  const PK=poseK(t),PB=poseB(t);
  drawChar(KALU,t,PK);drawChar(BETT,t,PB);
  // censor bar gag on "lamba he"
  const L=kf([[T.K3[0]+0.2,0],[T.K3[0]+0.85,335],[T.K3[0]+1.05,300],[KT-0.05,300],[KT+0.1,0]],t);
  if(t>=T.K3[0]+0.2&&t<KT+0.1){mosaicBar(345,1238+Math.sin(t*30)*3,L,74)}
  ctx.restore();
  ctx.save();const ox=Math.floor(hs(1,2)*128+128),oy=Math.floor(hs(3,4)*128+128);
  for(let x=-256+ox%256;x<W;x+=256)for(let y=-256+oy%256;y<H;y+=256)ctx.drawImage(noiseCv,x,y);ctx.restore();
  captions(t);
}
window.draw=draw;window.READY=true;
