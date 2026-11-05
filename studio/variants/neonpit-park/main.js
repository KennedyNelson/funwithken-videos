// Neon Pit variant of the Kalu & Bettery reel.
import { W, H, clamp, lerp, seg, eob } from './core/lib.js';
import { makeEngine, RES, AA } from './core/engine.js';
import { buildShots } from './shots.js';
import { CAPS } from './caps.js';
import { TM } from './env.js';

const cv = document.getElementById('cv'), GL = document.getElementById('gl'), ctx = cv.getContext('2d');
const OP = (window.OP = { ready: false });
const CAPCOL = { K: '#F6F1FF', B: '#FFD2B0' };
function drawCaption(t) {
  const c = CAPS.find((c) => t >= c[1] && t < c[2] + 0.12); if (!c) return;
  const lt = t - c[1], a = seg(lt, 0, 0.1), sc = lt < 0.18 ? lerp(0.94, 1, eob(seg(lt, 0, 0.18))) : 1;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(540, 1235); ctx.scale(sc, sc); ctx.font = '800 64px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const mw = ctx.measureText(c[3]).width + 70, mh = 96; ctx.fillStyle = 'rgba(20,20,30,.55)'; ctx.beginPath(); ctx.roundRect(-mw / 2, -mh / 2, mw, mh, 34); ctx.fill();
  ctx.fillStyle = CAPCOL[c[0]]; ctx.fillText(c[3], 0, 3); ctx.restore(); ctx.globalAlpha = 1;
}
let SHOTS = [], DUR = TM.A.end;
function draw(t) {
  t = clamp(t, 0, DUR - 1e-4); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
  let i = SHOTS.length - 1; while (i > 0 && SHOTS[i].at > t) i--; const sh = SHOTS[i], end = i < SHOTS.length - 1 ? SHOTS[i + 1].at : DUR, d = end - sh.at, lt = t - sh.at;
  ctx.save(); sh.draw(lt, d, t, () => ctx.drawImage(GL, 0, 0, W, H)); ctx.restore();
  const fade = clamp(t / 0.25); if (fade < 1) { ctx.fillStyle = '#000'; ctx.globalAlpha = 1 - fade; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
  drawCaption(t);
}
(async () => {
  try {
    await document.fonts.load('800 100px Inter'); await document.fonts.load('900 100px Inter');
    GL.width = Math.round(1080 * RES); GL.height = Math.round(1920 * RES);
    const E = makeEngine(GL, { w: GL.width, h: GL.height, samples: AA });
    const { shots, cues } = buildShots(E); shots.sort((a, b) => a.at - b.at); SHOTS = shots;
    OP.duration = () => DUR; OP.draw = draw; OP.frame = (t, q = 0.92) => { draw(t); return cv.toDataURL('image/jpeg', q); };
    OP.shots = () => shots.map((s, i) => ({ id: s.id, at: +s.at.toFixed(3), end: +(i < shots.length - 1 ? shots[i + 1].at : DUR).toFixed(3), note: s.note || '' }));
    OP.captions = () => CAPS.map((c) => ({ s: c[1], e: c[2], text: c[3] })); OP.cues = () => cues.slice().sort((a, b) => a.t - b.t);
    OP.ready = true;
    const q = new URLSearchParams(location.search); if (!q.has('capture') && q.has('t')) draw(+q.get('t'));
  } catch (e) { OP.bootError = String(e && e.stack || e); console.error(e); }
})();
