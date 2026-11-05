// KALU & BETTERY (Paper Atlas variant): two friends cut from paper, on a paper meadow.
import { ctx, W, H, TAU, clamp, lerp, eo, rnd, circle } from './core/lib.js';
import { L } from './core/timing.js';
import * as K from './core/kit.js';
import { ENV, TM } from './env.js';
const { P, cut, P_rr, P_poly, P_circ } = K;
const env = (who, t) => { const a = ENV[who === 'K' ? 'B' : 'K'], i = Math.floor(t * 100); return i >= 0 && i < a.length ? clamp(a[i] * 1.25) : 0; };
const blink = (t, o = 0) => (((t + o) % 3.1) < 0.12 ? 1 : 0);
const HAIR = '#241C1A';

function scene(t) {
  K.parchment(7);
  cut(P_circ(880, 330, 105), '#E2B84A', { shadow: 0.6 });
  for (const [cx, cy, s, sp] of [[220, 300, 1, 9], [650, 520, 0.8, 6], [1000, 640, 0.7, 7]]) { const x = ((cx + t * sp) % 1500) - 200; cut(() => { ctx.beginPath(); for (const [dx, dy, r] of [[-60, 10, 55], [0, -20, 75], [70, 8, 58]]) { ctx.moveTo(x + (dx + r) * s, cy + dy * s); ctx.arc(x + dx * s, cy + dy * s, r * s, 0, TAU); } }, '#F7F0DE', { shadow: 0.5, edge: 0 }); }
  cut(() => { ctx.beginPath(); ctx.moveTo(-300, 1080); ctx.quadraticCurveTo(300, 860, 800, 990); ctx.quadraticCurveTo(1100, 1060, 1400, 960); ctx.lineTo(1400, 1500); ctx.lineTo(-300, 1500); ctx.closePath(); }, '#9DAE74', { shadow: 1 });
  for (const [x, y, h, r] of [[130, 1230, 420, 150], [960, 1200, 260, 100]]) { cut(P_rr(x - h * 0.05, y - h, h * 0.1, h, 6), '#8A6446', { shadow: 0.6, edge: 4 }); for (const [dx, dy, k] of [[-0.55, -1.05, 0.85], [0.55, -1.1, 0.8], [0, -1.5, 1]]) cut(P_circ(x + dx * r, y + dy * h * 0.62, k * r), '#6E8C4F', { shadow: 0.8, edge: 5 }); }
  cut(() => { ctx.beginPath(); ctx.moveTo(-300, 1230); ctx.quadraticCurveTo(540, 1160, 1400, 1230); ctx.lineTo(1400, H + 300); ctx.lineTo(-300, H + 300); ctx.closePath(); }, '#7F9A5B', { shadow: 1 });
  cut(P_poly([[400, 1290], [700, 1290], [1000, H + 300], [60, H + 300]]), '#DDC796', { shadow: 0.8 });
  for (let i = 0; i < 12; i++) { const x = rnd(i * 3.1) * W, y = 1300 + rnd(i * 1.7) * 560; cut(P_circ(x, y, 12 + rnd(i) * 8), ['#C8952F', '#E9DCBC', '#A8322D'][i % 3], { shadow: 0.3, edge: 3 }); }
}

// a paper friend. ground at (x, y); s = scale. 700 units tall; head centre 600 up.
function friend(x, y, s, o) {
  const skin = o.skin, talk = o.talk || 0, lk = o.look || [0, 0];
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.dir || 1), s); ctx.translate(0, -(o.bob || 0)); ctx.rotate((o.lean || 0) * Math.PI / 180);
  for (const sx of [-42, 42]) { cut(P_rr(sx - 24, -270, 48, 250, 18), '#3D4A66', { shadow: 0.5, edge: 4 }); cut(() => { ctx.beginPath(); ctx.ellipse(sx + 8, -14, 46, 22, 0, 0, TAU); }, '#2B2430', { shadow: 0.4, edge: 4 }); }
  for (const sd of [-1, 1]) { ctx.save(); ctx.translate(sd * 100, -440); ctx.rotate(sd * (0.1 + (o.arm || 0) * (sd > 0 ? 1 : 0.3))); cut(P_rr(-20, 0, 40, 200, 20), o.shirt, { shadow: 0.5, edge: 4 }); cut(P_circ(0, 205, 26), skin, { shadow: 0.4, edge: 4 }); ctx.restore(); }
  cut(P_rr(-105, -490, 210, 260, 60), o.shirt, { shadow: 0.8 });
  cut(P_circ(0, -600, 135), skin, { shadow: 1 });
  cut(() => { ctx.beginPath(); ctx.moveTo(-136, -590); ctx.quadraticCurveTo(-140, -740, -10, -736); ctx.quadraticCurveTo(110, -736, 136, -600); ctx.quadraticCurveTo(70, -672, 0, -660); ctx.quadraticCurveTo(-80, -662, -136, -590); ctx.closePath(); }, HAIR, { shadow: 0.3, edge: 3 });
  const bl = o.blink || 0, ex = 50, ey = -596;
  for (const sd of [-1, 1]) {
    const cx = sd * ex;
    cut(() => { ctx.beginPath(); ctx.ellipse(cx, ey, 24, Math.max(2, 28 * (1 - bl * 0.9)), 0, 0, TAU); }, '#FFFDF4', { shadow: 0, edge: 0 });
    if (bl < 0.6) { circle(cx + lk[0] * 7, ey + lk[1] * 8, 10, '#241C1A'); }
    if (o.lid) { ctx.fillStyle = skin; ctx.beginPath(); ctx.rect(cx - 26, ey - 32, 52, 32 + 28 * o.lid); ctx.fill(); ctx.strokeStyle = '#241C1A'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(cx - 24, ey + 28 * o.lid); ctx.lineTo(cx + 24, ey + 28 * o.lid); ctx.stroke(); }
    ctx.strokeStyle = HAIR; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); const sad = o.sad || 0; ctx.moveTo(cx - 24, ey - 48 + (sd > 0 ? -sad * 14 : sad * 0)); ctx.lineTo(cx + 24, ey - 48 + (sd > 0 ? 0 : -sad * 14)); ctx.lineTo(cx + 24, ey - 48 + (sd > 0 ? 0 : -sad * 14)); ctx.stroke();
  }
  if (o.specs) { ctx.strokeStyle = '#3E2C1E'; ctx.lineWidth = 7; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.arc(sd * ex, ey, 40, 0, TAU); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(-ex + 40, ey); ctx.lineTo(ex - 40, ey); ctx.stroke(); }
  if (talk > 0.08) { ctx.fillStyle = '#4A1F26'; ctx.beginPath(); ctx.ellipse(0, -530, 26, 6 + 24 * talk, 0, 0, TAU); ctx.fill(); }
  else { ctx.strokeStyle = '#4A1F26'; ctx.lineWidth = 8; ctx.beginPath(); if (o.frown) { ctx.moveTo(-26, -516); ctx.quadraticCurveTo(0, -540, 26, -516); } else { ctx.moveTo(-24, -526); ctx.lineTo(24, -526); } ctx.stroke(); }
  ctx.restore();
}

export function buildShots() {
  const S = [], add = (o) => S.push(o), KT = TM.A.kick, cutAt = (i) => L(i) - 0.06;
  const hearK = (t) => t < 2.1 || (t > 4.6 && t < 5.7) || (t > 10.1 && t < 12.6);
  const KAL = (t) => ({ skin: '#7A4C33', shirt: '#D98A3D', sad: 1, frown: true, look: hearK(t) ? [0.8, 0.2] : [0.2, 0.7], blink: blink(t, 0.4), talk: env('K', t), lean: -1.5, bob: Math.sin(t * 2) * 3 });
  const BET = (t) => ({ skin: '#EBC6A0', shirt: '#4A6FA8', specs: true, dir: -1, sad: t < 5.7 ? 0.6 : 0, look: [-0.8, 0.1], blink: blink(t, 1.1), talk: env('B', t), bob: Math.sin(t * 2.3) * 3, arm: env('B', t) * 0.5 });
  const two = (t, xk, xb, s = 1, y = 1560) => { friend(xk, y, s, KAL(t)); friend(xb, y, s, BET(t)); };
  add({ id: 'wide', at: 0, cam: [540, 1100], zoom: 0.1, draw(lt, d, t) { scene(t); two(t, 290, 800); } });
  add({ id: 'k1', at: cutAt(1), cam: [330, 1000], zoom: 0.2, draw(lt, d, t) { scene(t); two(t, 330, 880); } });
  add({ id: 'bq', at: cutAt(2), cam: [760, 1000], zoom: 0.2, draw(lt, d, t) { scene(t); two(t, 200, 760); } });
  add({ id: 'k2', at: cutAt(3), cam: [540, 900], zoom: 0.08, draw(lt, d, t) { scene(t); friend(540, 2400, 2.5, KAL(t)); } });
  add({ id: 'b2', at: cutAt(4), cam: [540, 900], zoom: 0.08, draw(lt, d, t) { scene(t); friend(540, 2400, 2.5, { ...BET(t), sad: 0 }); } });
  add({ id: 'k3', at: cutAt(5), cam: [540, 900], zoom: 0.05, draw(lt, d, t) { scene(t); friend(540, 2400, 2.5, { ...KAL(t), blink: 0 }); } });
  add({ id: 'react', at: KT - 0.04, cam: [540, 960], zoom: 0.1, draw(lt, d, t) {
    const u = eo(clamp((t - KT) / 0.35)); scene(t);
    friend(540 + Math.sin((t - KT) * 3.2) * 10 * u, 2400 + 50 * u, 2.5, { ...BET(t), sad: 0, lid: 0.55 * u, look: [-0.2, 0.8], talk: 0, frown: true, blink: 0 });
  } });
  return { shots: S, cues: [] };
}
