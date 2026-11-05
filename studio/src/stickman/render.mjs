import {createRequire} from 'module';const require=createRequire(import.meta.url);
const {chromium}=require('playwright');import fs from 'fs';
const [,, mode, outDir, arg, scale] = process.argv;
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>{if(m.type()==='error')console.log('CON',m.text())});
await p.goto('file:///home/claude/reel/index.html');
await p.evaluate(async()=>{await document.fonts.load('900 40px IB');await document.fonts.load('800 40px IX')});
await p.waitForFunction('window.READY===true');
fs.mkdirSync(outDir,{recursive:true});
if(mode==='frames'){const ts=arg.split(',').map(Number);for(const t of ts){await p.evaluate(t=>draw(t),t);const d=await p.evaluate(()=>document.getElementById('c').toDataURL('image/jpeg',0.9));fs.writeFileSync(`${outDir}/t${t.toFixed(2)}.jpg`,Buffer.from(d.split(',')[1],'base64'))}}
else{const fps=24,n=Math.round((await p.evaluate(()=>A.end))*fps);for(let i=0;i<n;i++){await p.evaluate(t=>draw(t),i/fps);const d=await p.evaluate(()=>document.getElementById('c').toDataURL('image/jpeg',0.93));fs.writeFileSync(`${outDir}/${String(i).padStart(4,'0')}.jpg`,Buffer.from(d.split(',')[1],'base64'))}}
await b.close();
