// KALU & BETTERY (Stick Story variant): black stick friends, big white eyes, a flat sunny meadow.
import { ctx, W, H, clamp, lerp, seg, eo, eio, rnd, rr, circle, ell, line } from './core/lib.js';
import { L } from './core/timing.js';
import * as K from './core/kit.js';
import { ENV, TM } from './env.js';
const { P, GROUND } = K;
const env = (who, t) => { const a = ENV[who === 'K' ? 'B' : 'K'], i = Math.floor(t * 100); return i >= 0 && i < a.length ? clamp(a[i] * 1.25) : 0; };
const blink = (t, o = 0) => (((t + o) % 3.1) < 0.12 ? 1 : 0);

function tree(x, y, h, r, t, seed) {
  ctx.fillStyle = '#7A5238'; ctx.fillRect(x - h * 0.05, y - h, h * 0.1, h);
  const sw = Math.sin(t * 1.3 + seed) * 6;
  for (const [dx, dy, rr2, c] of [[-0.6, -1.05, 0.85, '#5E9E4C'], [0.6, -1.1, 0.8, '#5E9E4C'], [0, -1.55, 1, '#6DB35A'], [0, -1.15, 0.95, '#6DB35A']]) circle(x + dx * r + sw, y + dy * h * 0.62, rr2 * r, c);
}
function meadow(t) {
  ctx.fillStyle = P.sky; ctx.fillRect(-300, -300, W + 600, 1300);
  circle(880, 330, 110, '#FFE9A8'); circle(880, 330, 80, '#FFD870');
  for (const [cx, cy, s, sp] of [[220, 300, 1, 9], [640, 520, 0.8, 6], [1000, 640, 0.7, 7]]) { const x = ((cx + t * sp) % 1500) - 200; for (const [dx, dy, r] of [[-60, 10, 55], [0, -20, 75], [70, 8, 58]]) circle(x + dx * s, cy + dy * s, r * s, '#FFFFFF'); }
  ctx.beginPath(); ctx.moveTo(-300, 1010); ctx.quadraticCurveTo(300, 840, 800, 960); ctx.quadraticCurveTo(1100, 1020, 1400, 930); ctx.lineTo(1400, 1300); ctx.lineTo(-300, 1300); ctx.closePath(); ctx.fillStyle = '#8CC56E'; ctx.fill();
  tree(130, 1230, 420, 150, t, 1); tree(960, 1200, 260, 100, t, 2);
  ctx.fillStyle = '#6DB35A'; ctx.fillRect(-300, 1180, W + 600, H); ctx.fillStyle = '#5FA34E'; for (let y = 1290; y < H + 200; y += 130) ctx.fillRect(-300, y, W + 600, 10);
  ctx.beginPath(); ctx.moveTo(380, 1320); ctx.lineTo(700, 1320); ctx.lineTo(980, H + 200); ctx.lineTo(60, H + 200); ctx.closePath(); ctx.fillStyle = '#DCCFA6'; ctx.fill();
  for (let i = 0; i < 24; i++) { const x = rnd(i * 3.1) * W, y = 1260 + rnd(i * 1.7) * 560; line([[x, y], [x - 8, y - 26]], '#4F8F3E', 5); line([[x, y], [x + 8, y - 24]], '#4F8F3E', 5); }
}

export function buildShots() {
  const S = [], add = (o) => (S.push(o)), KT = TM.A.kick;
  const hearK = (t) => t < 2.1 || (t > 4.6 && t < 5.7) || (t > 10.1 && t < 12.6);
  const kalu = (t, x, extra = {}) => K.person({ x, y: GROUND, h: 840, dir: 1, mood: 'worried', look: hearK(t) ? [0.8, 0.2] : [0.2, 0.7], blink: blink(t, 0.4), talk: env('K', t), lean: -2, arms: { L: [-6, 12], R: [8, 14] }, ...extra });
  const bett = (t, x, extra = {}) => K.person({ x, y: GROUND, h: 840, dir: -1, specs: true, mood: t < 5.7 ? 'worried' : 'calm', look: [-0.8, 0.1], blink: blink(t, 1.1), talk: env('B', t), arms: { L: [-6, 12], R: [10 + env('B', t) * 25, 18] }, ...extra });
  const cut = (i) => L(i) - 0.06;
  add({ id: 'wide', at: 0, cam: [540, 1100], zoom: 0.1, draw(lt, d, t) { meadow(t); kalu(t, 290); bett(t, 800); } });
  add({ id: 'k1', at: cut(1), cam: [330, 1000], zoom: 0.22, draw(lt, d, t) { meadow(t); kalu(t, 330); bett(t, 880); } });
  add({ id: 'bq', at: cut(2), cam: [760, 1000], zoom: 0.22, draw(lt, d, t) { meadow(t); kalu(t, 200); bett(t, 760); } });
  add({ id: 'k2', at: cut(3), cam: [540, 900], zoom: 0.1, draw(lt, d, t) { meadow(t); K.bigHead(540, 930, 380, { dir: 1, mood: 'worried', look: [0.1, 0.6], blink: blink(t, 0.4), talk: env('K', t) }); } });
  add({ id: 'b2', at: cut(4), cam: [540, 900], zoom: 0.1, draw(lt, d, t) { meadow(t); K.bigHead(540, 930, 380, { dir: -1, specs: true, mood: 'calm', look: [-0.6, 0.1], blink: blink(t, 1.1), talk: env('B', t) }); } });
  add({ id: 'k3', at: cut(5), cam: [540, 900], zoom: 0.06, draw(lt, d, t) { meadow(t); K.bigHead(540, 930, 380, { dir: 1, mood: 'worried', look: [0.1, 0.6], blink: 0, talk: env('K', t) }); } });
  add({ id: 'react', at: KT - 0.04, cam: [540, 960], zoom: 0.1, draw(lt, d, t) {
    const u = eo(clamp((t - KT) / 0.35)); meadow(t);
    K.bigHead(540 + Math.sin((t - KT) * 3.2) * 10 * u, 930 + 60 * u, 400, { dir: -1, specs: true, mood: 'sleepy', look: [-0.2, 0.8], blink: 0, talk: 0 });
  } });
  return { shots: S, cues: [] };
}
