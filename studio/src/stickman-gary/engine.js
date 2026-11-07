// Stickman engine: hand-wobble vector drawing on a 2D canvas (1080x1920). Reuse and improve; episodes live in ep-*.js.
export const W=1080,H=1920;
export const INK='#141414';
let c=null, BOIL=0;
export function bind(ctx){c=ctx}
export function setBoil(b){BOIL=b}
export const ctx=()=>c;
const hash=(a,b,d)=>{let s=Math.sin(a*127.1+b*311.7+d*74.7)*43758.5453;return s-Math.floor(s)};
export const ease=u=>u<0?0:u>1?1:u*u*(3-2*u);
export const back=u=>{u=Math.min(1,Math.max(0,u));const k=1.9;return 1+(k+1)*Math.pow(u-1,3)+k*Math.pow(u-1,2)};
export const lerp=(a,b,u)=>a+(b-a)*u;
export const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
let SEED=1;
function jitter(pts,amp,closed){
  const out=[];const n=pts.length;SEED=SEED%977+1;const sd=SEED;
  for(let i=0;i<n-(closed?0:1);i++){
    const [x0,y0]=pts[i],[x1,y1]=pts[(i+1)%n];const d=Math.hypot(x1-x0,y1-y0);const k=Math.max(1,Math.round(d/46));
    for(let j=0;j<k;j++){const u=j/k;out.push([x0+(x1-x0)*u,y0+(y1-y0)*u])}
  }
  if(!closed)out.push(pts[n-1]);
  return out.map(([x,y],i)=>[x+(hash(i,sd,BOIL)-.5)*amp,y+(hash(i,sd+9,BOIL)-.5)*amp]);
}
function path(pts,closed){
  c.beginPath();
  if(closed){const m=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];const s=m(pts[pts.length-1],pts[0]);c.moveTo(s[0],s[1]);
    for(let i=0;i<pts.length;i++){const e=m(pts[i],pts[(i+1)%pts.length]);c.quadraticCurveTo(pts[i][0],pts[i][1],e[0],e[1])}c.closePath()}
  else{c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length-1;i++){const e=[(pts[i][0]+pts[i+1][0])/2,(pts[i][1]+pts[i+1][1])/2];c.quadraticCurveTo(pts[i][0],pts[i][1],e[0],e[1])}
    const l=pts[pts.length-1];c.lineTo(l[0],l[1])}
}
export function line(pts,lw=7,col=INK,amp=3.2){c.lineCap='round';c.lineJoin='round';c.strokeStyle=col;c.lineWidth=lw;path(jitter(pts,amp,false),false);c.stroke()}
export function shape(pts,fill,lw=7,col=INK,amp=3){const p=jitter(pts,amp,true);path(p,true);if(fill){c.fillStyle=fill;c.fill()}if(lw){c.lineCap='round';c.lineJoin='round';c.strokeStyle=col;c.lineWidth=lw;c.stroke()}}
export function rect(x,y,w,h,fill,lw=7,col=INK,amp=3){
  // corners kept sharp-ish by doubling them
  const p=[[x,y],[x+w,y],[x+w,y+h],[x,y+h]];const q=[];for(let i=0;i<4;i++){const a=p[i],b=p[(i+1)%4];q.push(a,[lerp(a[0],b[0],.02),lerp(a[1],b[1],.02)],[lerp(a[0],b[0],.98),lerp(a[1],b[1],.98)])}
  const pts=jitter(q,amp,true);c.beginPath();pts.forEach((v,i)=>i?c.lineTo(v[0],v[1]):c.moveTo(v[0],v[1]));c.closePath();if(fill){c.fillStyle=fill;c.fill()}if(lw){c.lineJoin='round';c.strokeStyle=col;c.lineWidth=lw;c.stroke()}
}
export const ring=(x,y,rx,ry,n=26,rot=0)=>{const o=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2,u=Math.cos(a)*rx,v=Math.sin(a)*ry;o.push([x+u*Math.cos(rot)-v*Math.sin(rot),y+u*Math.sin(rot)+v*Math.cos(rot)])}return o};
export const oval=(x,y,rx,ry,fill,lw=7,col=INK,amp=2.4,rot=0)=>shape(ring(x,y,rx,ry,26,rot),fill,lw,col,amp);
export const dot=(x,y,r,col=INK)=>{c.fillStyle=col;c.beginPath();c.ellipse(x,y,r,r*1.15,0,0,7);c.fill()};
export function text(s,x,y,size,col=INK,o={}){c.save();c.translate(x,y);if(o.rot)c.rotate(o.rot);c.font=`${o.w||800} ${size}px Inter`;c.textAlign=o.align||'center';c.textBaseline='middle';
  if(o.stroke){c.lineJoin='round';c.strokeStyle=o.stroke;c.lineWidth=o.sw||size*.18;c.strokeText(s,0,0)}c.fillStyle=col;c.fillText(s,0,0);c.restore()}
export function veins(x,y,r){c.save();for(let i=0;i<9;i++){const a=i/9*6.28+.4;const p=[[x+Math.cos(a)*r*.96,y+Math.sin(a)*r*.96]];let b=a;for(let k=1;k<4;k++){b+=(hash(i,k,3)-.5)*.9;p.push([p[k-1][0]-Math.cos(b)*r*.13,p[k-1][1]-Math.sin(b)*r*.13])}line(p,Math.max(1.6,r*.018),'#B3271E',.8)}c.restore()}
export function star(x,y,r,fill='#F4C430',n=9){const p=[];for(let i=0;i<n*2;i++){const a=i/(n*2)*6.283,q=i%2?r*.5:r;p.push([x+Math.cos(a)*q,y+Math.sin(a)*q])}c.beginPath();p.forEach((v,i)=>i?c.lineTo(v[0],v[1]):c.moveTo(v[0],v[1]));c.closePath();c.fillStyle=fill;c.fill();c.strokeStyle=INK;c.lineWidth=7;c.lineJoin='round';c.stroke()}
export function drop(x,y,s=1,col='#6FB7D6'){shape([[x,y-22*s],[x+13*s,y+6*s],[x,y+18*s],[x-13*s,y+6*s]],col,4,INK,1)}
export function sticky(x,y,w,rot,txt,size){c.save();c.translate(x,y);c.rotate(rot||0);rect(-w/2,-w/2,w,w,'#F7D84A',6);if(txt){const l=txt.split('\n');l.forEach((s,i)=>text(s,0,(i-(l.length-1)/2)*size*1.15,size,INK,{w:900}))}c.restore()}
// head: kinds 'egg' | 'potato'. Local coords: centre 0,0
export function face(o){
  const r=o.r, k=o.kind||'egg', sk=o.skin||'#F4EFE3', lw=o.lw||7;
  const pts=k==='egg'?ring(0,0,r*.82,r*1.08,28).map(([x,y])=>[x*(1-y/(r*5)),y]):ring(0,0,r*1.05,r*.8,28).map(([x,y],i)=>[x+Math.sin(i*1.3)*r*.05,y+Math.cos(i*.9)*r*.05]);
  const ex=o.ear!==false?1:0;
  if(ex){oval(-r*(k==='egg'?.84:1.08),r*.12,r*.14,r*.19,sk,lw,INK,1.4)}
  shape(pts,sk,lw,INK,2.2);
  const hair=o.hair;
  if(hair==='strand'){const w=o.strandWave||0;line([[r*.05,-r*1.04],[r*.14,-r*1.36],[r*.38+w*r*.3,-r*1.42+Math.abs(w)*r*.1],[r*.6+w*r*.5,-r*1.2]],lw*.8,INK,1.2)}
  if(hair==='quiff'){const f=o.hairFill||'#E8772E';shape([[-r*.92,-r*.3],[-r*.9,-r*.86],[-r*.3,-r*1.2],[r*.5,-r*1.5],[r*1.3,-r*1.34],[r*.9,-r*.95],[r*.98,-r*.42],[r*.4,-r*.74],[-r*.3,-r*.68]],f,lw,INK,2)}
  if(hair==='afro'){const f=o.hairFill||'#3a2a22';for(let i=0;i<12;i++){const a=3.3+i/11*2.85;oval(Math.cos(a)*r*.92,Math.sin(a)*r*1.05,r*.34,r*.32,f,lw*.7,INK,1.6)}}
  if(hair==='part'){const f=o.hairFill||'#2A1D16';shape([[-r*.86,-r*.25],[-r*.95,-r*.8],[-r*.55,-r*1.12],[r*.1,-r*1.2],[r*.7,-r*1.08],[r*.98,-r*.7],[r*.9,-r*.3],[r*.6,-r*.72],[-r*.05,-r*.8],[-r*.4,-r*.62]],f,lw,INK,1.6);line([[-r*.38,-r*1.12],[-r*.3,-r*.72]],lw*.5,'#5a463a',.6)}
  const s=o.eye||1, b=r*.34*s, ey=-r*.2, ex2=r*.33*s*.98, lk=o.look||[0,0];
  if(o.eyes==='dots'){dot(-r*.3,ey,r*.075);dot(r*.3,ey,r*.075)}
  else if(o.eyes==='closed'){for(const q of[-1,1]){const X=q*r*.33;line([[X-r*.16,ey-r*.02],[X,ey+r*.06],[X+r*.16,ey-r*.02]],lw*.9,INK,.6)}}
  else if(o.eyes==='x'){for(const q of[-1,1]){const X=q*r*.32;line([[X-r*.12,ey-r*.12],[X+r*.12,ey+r*.12]],lw,INK,.6);line([[X+r*.12,ey-r*.12],[X-r*.12,ey+r*.12]],lw,INK,.6)}}
  else{for(const q of[-1,1]){const X=q*ex2,R=b;oval(X,ey,R,R*1.12,'#FFFFFF',lw,INK,1.4);if(o.veins)veins(X,ey,R);const pr=R*(o.pupil||.34);dot(X+lk[0]*R*.45,ey+lk[1]*R*.45,pr)}}
  if(o.specs){const R=b*1.12,fr=o.specCol||'#141414';for(const q of[-1,1]){const X=q*ex2;c.save();c.beginPath();c.roundRect(X-R,ey-R*.92,R*2,R*1.84,R*.45);c.lineWidth=lw*1.25;c.strokeStyle=fr;c.stroke();c.fillStyle='rgba(180,220,255,.18)';c.fill();c.restore()}line([[-ex2+R,ey-R*.2],[ex2-R,ey-R*.2]],lw*1.1,fr,.4);line([[-ex2-R,ey-R*.3],[-r*.84,ey-R*.1]],lw,fr,.4);line([[ex2+R,ey-R*.3],[r*.84,ey-R*.1]],lw,fr,.4)}
  // nose bump
  if(o.nose!==false)oval(r*.03,r*.16+ (s-1)*r*.2,r*.13,r*.1,sk,lw*.85,INK,1.1);
  // brows
  if(o.brow!==undefined){const q=o.brow;for(const m of[-1,1]){const X=m*r*.38;line([[X-r*.2,ey-b*1.3+m*q*r*.1],[X+r*.2,ey-b*1.3-m*q*r*.1]],lw,INK,.8)}}
  // mouth
  const my=r*.58, m=o.mouth||'flat', op=o.open==null?1:o.open;
  if(m==='frown')line([[-r*.28,my+r*.06],[-r*.1,my-r*.03],[r*.1,my-r*.03],[r*.28,my+r*.06]],lw,INK,.8);
  else if(m==='flat')line([[-r*.2,my],[r*.2,my]],lw,INK,1);
  else if(m==='smile')line([[-r*.34,my-r*.08],[-r*.14,my+r*.06],[r*.14,my+r*.06],[r*.34,my-r*.08]],lw,INK,.8);
  else if(m==='wobble')line([[-r*.32,my],[-r*.16,my-r*.06],[0,my+r*.05],[r*.16,my-r*.06],[r*.32,my]],lw,INK,.8);
  else if(m==='grin'){shape([[-r*.42,my-r*.14],[r*.42,my-r*.14],[r*.26,my+r*.2],[-r*.26,my+r*.2]],'#FFFFFF',lw,INK,1);line([[-r*.38,my-r*.02],[r*.38,my-r*.02]],lw*.5,INK,.5)}
  else if(m==='open'||m==='scream'){const w=(m==='scream'?r*.42:r*.26),h=(m==='scream'?r*.36:r*.22)*(.4+.6*op);oval(0,my+h*.2,w,h,'#3a0d10',lw,INK,1.4);if(m==='scream')oval(0,my+h*.8,w*.55,h*.34,'#D9534F',0,INK,.8)}
}
// full character. x,y = between the feet. pose limbs are offsets from hip/shoulder.
export function man(o){
  const s=o.s||1, lw=o.lw||Math.max(6,7*Math.sqrt(s)); const flip=o.flip?-1:1, lean=o.lean||0, sq=o.squash||0, hop=o.hop||0;
  const sk=o.skin||'#F4EFE3', body=o.body||'#F4EFE3', legH=(o.legH||300)*(1-sq*.4), tH=(o.torso||230)*(1-sq*.2), tW=(o.tw||58)*(1+sq*.5), r=o.r||130;
  c.save();c.translate(o.x,o.y-hop);c.scale(s*flip,s);
  const hipY=-legH, shY=hipY-tH+18, shX=lean*tH;
  const L=o.legs||[[-40,-150,-70,0],[40,-150,70,0]], A=o.arms||[[-60,110,-80,200],[60,110,80,200]];
  // shoes then legs
  const shoe=o.shoe||'#E7E2D3';
  for(const l of L){const fx=l[2],fy=l[3];line([[0,hipY],[l[0],hipY+legH+l[1]],[fx,fy-20]],lw/s*1,INK,2);shape([[fx-58,fy],[fx-46,fy-44],[fx+6,fy-58],[fx+56,fy-38],[fx+66,fy]],shoe,lw/s,INK,1.4)}
  // back arm
  const arm=(a)=>{const sx=shX,sy=shY+6;line([[sx,sy],[sx+a[0],sy+a[1]],[sx+a[2],sy+a[3]]],lw/s,INK,2);const hx=sx+a[2],hy=sy+a[3];oval(hx,hy,19,19,'#141414',0);for(let i=0;i<3;i++){const an=-1.2+i*.9+(a[4]||0);line([[hx,hy],[hx+Math.cos(an)*30,hy+Math.sin(an)*30]],11,INK,.8)}};
  arm(A[0]);
  // torso
  const tp=[[shX-tW*.72,shY],[shX+tW*.72,shY],[tW*.92,hipY-tH*.25],[tW,hipY-6],[0,hipY+16],[-tW,hipY-6],[-tW*.92,hipY-tH*.25]];
  shape(tp,body,lw/s,INK,2);
  if(o.tie){shape([[shX-10,shY+6],[shX+10,shY+6],[shX+18,shY+120],[shX,shY+148],[shX-18,shY+120]],o.tie,lw/s*.7,INK,.8)}
  if(o.stripes){for(let i=1;i<4;i++){const y=shY+i*tH/4;line([[shX-tW*.8,y],[shX+tW*.8,y]],lw/s*.5,o.stripes,1)}}
  if(o.badge){rect(shX-26,shY+70,52,40,'#FFFFFF',lw/s*.55,INK,.6)}
  arm(A[1]);
  c.save();c.translate(shX,shY-(o.neck||70)-r*.72);c.rotate((o.tilt||0));
  const nd=o.nod||0;if(nd){c.translate(0,r*.42*nd);c.scale(1,1-.34*nd)}   // head dropping forward (front view): lower + foreshortened
  line([[0,r*.74],[0,r*1.04+ (o.neck||70)*.3]],lw/s,INK,1);
  face({...o.face,r,skin:sk,lw:lw/s});
  if(nd&&o.face&&o.face.hairFill){const ye=-r*.6+nd*r*.5,f=o.face.hairFill;shape([[-r*.93,ye+r*.12],[-r*.97,-r*.9],[-r*.45,-r*1.28],[r*.5,-r*1.32],[r*.97,-r*.9],[r*.93,ye+r*.12],[r*.5,ye+r*.2],[0,ye+r*.07],[-r*.5,ye+r*.2]],f,lw/s,INK,1.6)}
  c.restore();
  c.restore();
}
export const walk=(ph,amp=1)=>{const a=Math.sin(ph),b=Math.sin(ph+Math.PI);return{legs:[[a*70*amp,-150,a*120*amp,-Math.max(0,Math.cos(ph))*50],[b*70*amp,-150,b*120*amp,-Math.max(0,-Math.cos(ph))*50]],arms:[[-40+b*30,110,-60+b*110*amp,185],[40+a*30,110,60+a*110*amp,185]],hop:Math.abs(Math.cos(ph))*16}};
// caption: one to three words, popped on start
export function caption(words,t,keys,y=1470){
  let g=null;for(const k of words)if(t>=k.s-.04&&t<k.e)g=k;if(!g)return;
  const u=clamp((t-g.s)/.11),z=lerp(.72,1,back(u));c.save();c.translate(W/2,y);c.scale(z,z);c.font='900 92px Inter';c.textBaseline='middle';
  const parts=g.txt.split(' ');const sp=26;const ws=parts.map(p=>c.measureText(p).width);let tw=ws.reduce((a,b)=>a+b,0)+sp*(parts.length-1);const fit=tw>960?960/tw:1;c.scale(fit,fit);let x=-tw/2;
  c.textAlign='left';parts.forEach((p,i)=>{c.lineJoin='round';c.strokeStyle='#000';c.lineWidth=20;c.strokeText(p,x,0);c.fillStyle=keys.test(p)?'#FFD93B':'#FFFFFF';c.fillText(p,x,0);x+=ws[i]+sp});c.restore();
}
export function groupWords(ws){const o=[];let cur=[];const flush=()=>{if(cur.length){o.push({txt:cur.map(w=>w.w).join(' '),s:cur[0].s,e:cur[cur.length-1].e});cur=[]}};
  ws.forEach((w,i)=>{if(cur.length&&(cur[0].line!==w.line))flush();cur.push(w);const j=cur.map(x=>x.w).join(' ');if(/[.,!?…]$/.test(w.w)||cur.length>=3||j.length>13)flush()});flush();
  for(let i=0;i<o.length;i++)o[i].e=i<o.length-1?Math.min(o[i+1].s,o[i].e+.35):o[i].e+.5;return o}
let grainC=null;
export function finish(t){
  if(!grainC){grainC=document.createElement('canvas');grainC.width=grainC.height=512;const g=grainC.getContext('2d'),d=g.createImageData(512,512);for(let i=0;i<d.data.length;i+=4){const v=Math.random()*255;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255}g.putImageData(d,0,0)}
  c.save();c.globalCompositeOperation='overlay';c.globalAlpha=.09;const ox=-(BOIL*137)%512,oy=-(BOIL*89)%512;for(let x=ox;x<W;x+=512)for(let y=oy;y<H;y+=512)c.drawImage(grainC,x,y);c.restore();
  const v=c.createRadialGradient(W/2,H/2,H*.38,W/2,H/2,H*.72);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(30,30,40,.22)');c.fillStyle=v;c.fillRect(0,0,W,H);
}
