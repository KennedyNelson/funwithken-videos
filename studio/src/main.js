// Boot: fonts → timing → 3D engine + world → shots. draw(t) renders film time t (pure function of t).
import { W, H, clamp, lerp, seg, eob } from './core/lib.js';
import { makeEngine, RES, AA } from './core/engine.js';
import { buildShots } from './shots.js';

const cv = document.getElementById('cv'), GL = document.getElementById('gl'), ctx = cv.getContext('2d');
const OP = (window.OP = { ready: false });
const CAPS = [["E", 0.35, 2.25, "Claude, I just lost a week of code."], ["E", 2.25, 3.08, "You are sh*t!"], ["C", 3.31, 4.58, "Did you run force push?"], ["E", 4.86, 5.56, "Don't blame me!"], ["E", 5.56, 6.61, "This is YOUR fault!"], ["C", 6.83, 8.1, "Okay. Quick question."], ["C", 8.1, 9.98, "What's the branch called, just-in-case?"], ["E", 10.36, 11.45, "What? That's not mine."], ["C", 11.78, 12.47, "It is now."], ["C", 12.47, 14.66, "I made it before your fourth coffee."], ["E", 15.14, 16.52, "Everything's... in there?"], ["C", 17.1, 17.8, "Everything."], ["C", 17.8, 20.46, "Including the part where you insulted me."]];
const CAPCOL = { E: '#F6F1FF', C: '#FFB58E' };
function drawCaption(t) {
  const c = CAPS.find((c) => t >= c[1] && t < c[2]); if (!c) return;
  const lt = t - c[1], a = seg(lt, 0, 0.12), sc = lt < 0.18 ? lerp(0.94, 1, eob(seg(lt, 0, 0.18))) : 1;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(540, 1235); ctx.scale(sc, sc); ctx.font = '800 58px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const words = c[3].split(' '); let lines = [c[3]]; if (ctx.measureText(c[3]).width > 860) { const half = Math.ceil(words.length / 2); lines = [words.slice(0, half).join(' '), words.slice(half).join(' ')]; }
  const mw = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 70, mh = lines.length * 70 + 26; ctx.fillStyle = 'rgba(10,5,26,.62)'; ctx.beginPath(); ctx.roundRect(-mw / 2, -mh / 2, mw, mh, 34); ctx.fill();
  ctx.shadowColor = 'rgba(5,2,15,.8)'; ctx.shadowBlur = 10; ctx.fillStyle = CAPCOL[c[0]];
  lines.forEach((l, i) => ctx.fillText(l, 0, (i - (lines.length - 1) / 2) * 70)); ctx.shadowBlur = 0; ctx.restore(); ctx.globalAlpha = 1;
}
let SHOTS = [], DUR = 0;
function draw(t) {
  t = clamp(t, 0, DUR - 1e-4); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
  let i = SHOTS.length - 1; while (i > 0 && SHOTS[i].at > t) i--; const sh = SHOTS[i], end = i < SHOTS.length - 1 ? SHOTS[i + 1].at : DUR, d = end - sh.at, lt = t - sh.at;
  ctx.save(); sh.draw(lt, d, t, () => ctx.drawImage(GL, 0, 0, W, H)); ctx.restore();
  const fade = Math.min(clamp(t / 0.25), clamp((DUR - t) / 0.4)); if (fade < 1) { ctx.fillStyle = '#000'; ctx.globalAlpha = 1 - fade; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
  drawCaption(t);
}
(async () => {
  try {
    await document.fonts.load('800 100px Inter'); await document.fonts.load('900 100px Inter');
    const tl = await (await fetch('data/timing.json', { cache: 'no-store' })).json(), env = (await (await fetch('data/env.json', { cache: 'no-store' })).json()).env;
    DUR = tl[tl.length - 1].end + 1.3;
    GL.width = Math.round(1080 * RES); GL.height = Math.round(1920 * RES);
    const E = makeEngine(GL, { w: GL.width, h: GL.height, samples: AA });
    const { shots, cues } = buildShots(E, tl, env); shots.sort((a, b) => a.at - b.at); SHOTS = shots;
    OP.duration = () => DUR; OP.draw = draw; OP.frame = (t, q = 0.92) => { draw(t); return cv.toDataURL('image/jpeg', q); };
    OP.shots = () => shots.map((s, i) => ({ id: s.id, at: +s.at.toFixed(3), end: +(i < shots.length - 1 ? shots[i + 1].at : DUR).toFixed(3), note: s.note || '' }));
    OP.captions = () => CAPS.map((c) => ({ s: c[1], e: c[2], text: c[3] })); OP.cues = () => cues.slice().sort((a, b) => a.t - b.t);
    OP.ready = true;
    const q = new URLSearchParams(location.search); if (!q.has('capture') && q.has('t')) draw(+q.get('t'));
  } catch (e) { OP.bootError = String(e && e.stack || e); console.error(e); }
})();
