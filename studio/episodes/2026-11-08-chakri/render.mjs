// node render.mjs frames <dir> "t1,t2"  |  video out.mp4
import { createRequire } from 'node:module'; const { chromium } = createRequire((process.env.PW_FROM || '/') )('playwright');
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { spawn } from 'node:child_process';
const here = path.dirname(new URL(import.meta.url).pathname), studio = path.resolve(here, '../..');
const srv = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split('?')[0]); const f = u === '/' ? path.join(here, 'chakri.html') : path.join(studio, u); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return } r.writeHead(200, { 'Content-Type': f.endsWith('.js') ? 'text/javascript' : f.endsWith('.html') ? 'text/html' : 'application/octet-stream' }); r.end(fs.readFileSync(f)) }).listen(0);
await new Promise(r => srv.on('listening', r)); const port = srv.address().port;
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
p.on('pageerror', e => console.error('PAGEERR', e)); p.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()) });
await p.goto(`http://127.0.0.1:${port}/`); await p.waitForFunction('window.ready', { timeout: 60000 });
const [mode, a1, a2] = process.argv.slice(2);
const shot = async t => { await p.evaluate(t => window.draw(t), t); return p.screenshot({ type: 'jpeg', quality: 95 }) };
if (mode === 'frames') { fs.mkdirSync(a1, { recursive: true }); for (const t of a2.split(',')) fs.writeFileSync(`${a1}/f${(+t).toFixed(2)}.jpg`, await shot(+t)); }
if (mode === 'video') { const n = 4 * 30; const f = spawn('ffmpeg', ['-nostdin', '-v', 'error', '-y', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-crf', '17', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', a1], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < n; i++) { const j = await shot(i / 30 + .001); if (!f.stdin.write(j)) await new Promise(r => f.stdin.once('drain', r)); if (i % 20 == 0) console.log(i, n) } f.stdin.end(); await new Promise(r => f.on('close', r)); }
await b.close(); srv.close();
