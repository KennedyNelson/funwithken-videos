// 2026-11-07 IG reel v2 "Avg conversation between boys": the owner's interview clip replicated shot for shot with two
// original young Indian characters (Flat Vector style, realistic proportions), seated facing each other, plain background.
// Cuts follow the source clip exactly. The owner lays the original audio on top.
import { W, H, bind, lerp, clamp, ease, pr, label, captions, groupWords, finish } from '../toon/toon.js';
import { seated, chairSide } from '../toon/realfolk.js';
const META = await (await fetch('/data/meta.json')).json();
const ENV = await (await fetch('/data/env.json')).json();
export const DUR = META.dur;
let c, groups = [];
const KEYS = /^(gaali|gaaliyan|kavita|lay|maatraayein|emotion|M\*darch\*d\.?|Bh\*sdi|samaaj|pasandida)/i;
export function init(cx, w) { c = cx; bind(c); groups = groupWords(w) }
const env = (k, t) => { const a = ENV[k]; return a ? (a[Math.min(a.length - 1, Math.max(0, Math.floor(t * 30)))] || 0) : 0 };
const blink = (t, ph = 0) => ((t + ph) % 3.3) < .12 ? 1 : 0;
const cam = (z, x, y, fn) => { c.save(); c.translate(W / 2, H / 2); c.scale(z, z); c.translate(-x, -y); fn(); c.restore() };
// two original characters
const A = { skin: '#7E4E33', hair: '#141010', shirt: '#4A2D52', pant: '#3B4F6E', shoe: '#5A3A24', stubble: true };   // left, faces right
const B = { skin: '#B27A55', hair: '#171211', shirt: '#F3F3EF', pant: '#4E6280', shoe: '#E9E9E4' };                  // right, faces left
const AX = 250, BX = 830, SY = 1430, S = .92;
// source shot list: who is on screen
const SHOTS = [[0, 3.582, 'A'], [3.582, 7.982, 'B'], [7.982, 13.822, 'A'], [13.822, 16.582, 'B'], [16.582, 18.582, 'A'], [18.582, 21.542, 'B'], [21.542, 24.382, 'A'], [24.382, 26.862, 'B'], [26.862, 30.142, 'A'], [30.142, 32.182, 'B'], [32.182, 36.062, 'A'], [36.062, 37.822, 'B'], [37.822, 39.862, 'W'], [39.862, 99, 'B']];
// poses over time (degrees: [upperArmAngle, elbowBend, hand]); talking adds a small natural beat
function posesA(t) {
  const k = env('k', t), beat = Math.sin(t * 7) * 8 * (k > .1 ? 1 : 0);
  let far = [150, 150, 'fist'], near = k > .1 ? [16, 104 + beat, 'open'] : [12, 74, 'fist'], face = { open: k > .1 ? clamp(k * 1.2, .25, 1) : 0, smile: .15, brow: .4, lid: blink(t) * .95 }, tilt = 0;
  if (t > 7.98 && t < 13.8) { near = [12, 74, 'fist']; face.brow = .2 }                    // listening, fist still at the temple
  if (t > 11.9 && t < 13.8) { face.smile = .9; face.brow = .8 }                             // hears the answer, grins
  if (t > 13.8 && t < 16.6) { near = [18, 100 + Math.abs(Math.sin(t * 9)) * 20, 'open']; far = [18, 96 + Math.abs(Math.sin(t * 9 + 1)) * 20, 'open']; face.smile = .8 }   // "poori kavita hai"
  if (t > 21.5 && t < 31) { near = [12, 74, 'fist'] }
  if (t > 32.18 && t < 36.06) { face.smile = 1; face.open = .45 + Math.abs(Math.sin(t * 12)) * .3; face.lid = .45; tilt = -.12 + Math.sin(t * 12) * .03; near = [30, 110, 'fist'] }  // laughing
  if (t > 38.3) { near = [18, 102 + beat, 'open']; face.smile = .5; face.brow = -.2 }        // the answer, proudly
  return { arms: { far, near }, face, headTilt: tilt, lean: t > 32.18 && t < 36.06 ? -.06 : .03 };
}
function posesB(t) {
  const k = env('f', t), beat = Math.sin(t * 6.5) * 9 * (k > .1 ? 1 : 0);
  let far = k > .1 ? [14, 100 - beat * .6, 'open'] : [10, 76, 'fist'], near = k > .1 ? [18, 108 + beat, 'open'] : [12, 74, 'fist'], face = { open: k > .1 ? clamp(k * 1.2, .25, 1) : 0, smile: .1, brow: .2, lid: blink(t, 1.3) * .95 }, tilt = 0;
  if (t < 7.98) { near = [12, 74, 'fist']; far = [10, 76, 'fist']; face.brow = .3 }          // listening to the question
  if (t > 7.98 && t < 11.9) { near = [70, 131, 'fist']; face.lid = .35; face.brow = -.3 }    // chin rub, thinking
  if (t > 13.8 && t < 16.58) { near = [12, 74, 'fist']; far = [10, 76, 'fist']; face.smile = .3 }
  if (t > 22.6 && t < 24.4) { near = [72, 128, 'fist']; face.lid = .3 }                       // hand near the mouth
  if (t > 26.9 && t < 31) { face.lid = .5; face.brow = .6 }                                   // feeling the emotion
  if (t > 30.1 && t < 32.2) { near = [70, 131, 'fist']; face.lid = .2 }                       // chin rub
  if (t > 36.06 && t < 37.82) { near = [70, 131, 'fist']; face.smile = .3 }
  if (t > 38.3) { near = [12, 74, 'fist']; far = [10, 76, 'fist']; face.smile = .7; face.open = 0 }
  return { arms: { far, near }, face, headTilt: tilt, lean: .02 };
}
function backdrop() {
  const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#E9E4DC'); g.addColorStop(1, '#D9D2C7');
  c.fillStyle = g; c.fillRect(-2000, -2000, 6000, 6000);
  c.fillStyle = '#CFC6B8'; c.fillRect(-2000, 1730, 6000, 4000);
  c.fillStyle = 'rgba(0,0,0,.06)'; c.fillRect(-2000, 1730, 6000, 10);
  const r = c.createRadialGradient(540, 1100, 200, 540, 1100, 1100); r.addColorStop(0, 'rgba(255,255,255,.25)'); r.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = r; c.fillRect(-500, 0, 2100, 2200);
}
function scene(t) {
  backdrop();
  for (const [x, f] of [[AX, false], [BX, true]]) { c.save(); c.globalAlpha = .14; c.fillStyle = '#2a2420'; c.beginPath(); c.ellipse(x + (f ? -120 : 120), 1735, 230, 18, 0, 0, 7); c.fill(); c.restore() }
  chairSide(AX, SY, S, false); chairSide(BX, SY, S, true);
  seated({ ...A, x: AX, y: SY, s: S, ...posesA(t) });
  seated({ ...B, x: BX, y: SY, s: S, flip: true, ...posesB(t) });
}
export function draw(t) {
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
  const sh = SHOTS.find(s => t >= s[0] && t < s[1]) || SHOTS[SHOTS.length - 1];
  const u = ease(pr(t, sh[0], sh[1]));
  if (sh[2] === 'W') cam(lerp(1.3, 1.36, u), 540, 1260, () => scene(t));
  else if (sh[2] === 'A') cam(lerp(2.3, 2.38, u), AX + 140, 1110, () => scene(t));
  else cam(lerp(2.3, 2.38, u), BX - 140, 1110, () => scene(t));
  c.restore();
  label([['Avg conversation between ', '#111'], ['boys', '#D7261E']], W / 2, 260, 56);
  captions(groups, t, KEYS, 1640); finish(t);
}
export const cues = [];
