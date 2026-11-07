// 2026-11-08 IG reel "Avg conversation between boys" in Desi Goggle-Eye Toon (kp_animatess grammar), 39 s.
// ONE plain scene, Kalu (left, brown) and Battery (right, specs) seated facing each other, both on screen the whole time.
// Sarcastically serious: dead-straight faces, NO laughing anywhere. Hair is part of the head drawing and never moves on its own.
// Gag: Kalu stands up FIRST (7.1-7.9), then says "M*darch*d" standing, and sits back down after it (11.3-11.9).
// Timeline: the owner's clip is 40.87 s. Two pauses are cut so the reel is 39 s and the last word "Bh*sdi ke" is on screen at 38.0 s:
//   cut A = clip 35.65-36.25, cut B = clip 38.60-40.27. The owner's audio must have the same two cuts (the preview file has them).
import { W, H, bind, lerp, clamp, ease, pr, label, captions, groupWords, finish } from '../toon/toon.js';
import { kpSeated, kpChair } from '../toon/kp.js';
const META = await (await fetch('/data/meta.json')).json();
const ENV = await (await fetch('/data/env.json')).json();
export const DUR = 39;
let c, groups = [];
const KEYS = /^(gaali|gaaliyan|kavita|lay|maatraayein|emotion|M\*darch\*d\.?|Bh\*sdi|samaaj|pasandida)/i;
const src = (t) => t < 35.65 ? t : t < 38.0 ? t + .6 : t + 2.27;     // reel time -> clip time (for the lip envelope)
function retime(w) {
  w = w.map(x => x.line === 2 ? { ...x, s: 8.3, e: 11.3 } : x);       // caption pops once he is standing and speaking
  const keep = w.filter(x => x.line !== 5), L5 = w.filter(x => x.line === 5), out = [...keep];
  const spread = (ws, a, b) => { const g = ws.map(x => x.w.replace(/\W/g, '').length + 1.5), T = g.reduce((p, q) => p + q, 0); let cu = 0; ws.forEach((x, i) => { const s0 = a + cu / T * (b - a); cu += g[i]; out.push({ ...x, s: +s0.toFixed(3), e: +(a + cu / T * (b - a)).toFixed(3) }) }) };
  spread(L5.slice(0, 13), 32.3, 36.2); spread(L5.slice(13, 17), 36.2, 37.2); spread(L5.slice(17), 38.0, 38.7);   // last word exactly at 38.0
  return out;
}
export function init(cx, w) { c = cx; bind(c); groups = groupWords(retime(w)) }
const env = (k, t) => { const a = ENV[k], i = Math.floor(src(t) * 30); return a && i < a.length ? (a[Math.max(0, i)] || 0) : 0 };
const blink = (t, ph) => ((t + ph) % 3.6) < .12;
const nz = (t, k) => Math.sin(t * 17.3 + k) * .5 + Math.sin(t * 9.1 + k * 2) * .5;
const KALU = { skin: '#8A5536', hair: 'kalu', hairCol: '#16110E', stubble: true, top: 'tee', topCol: '#2E8C86', pant: '#2E4766', shoe: '#F1F1EE' };
const BATT = { skin: '#C9976A', hair: 'battery', hairCol: '#2B1D16', specs: true, top: 'shirt', topCol: '#8C7BC4', pant: '#5E6470', shoe: '#3B3B40' };
const S = .86, FLOOR = 1700, KX = 300, BX = 780, HY = FLOOR - 272 * S;
const REST_N = { e: [16, 150], h: [124, 266], hand: 'rest' }, REST_F = { e: [8, 146], h: [96, 268], hand: 'rest' };
const OPEN = (t, k) => ({ e: [26, 146], h: [150, 70 + nz(t, k) * 32], hand: 'open' });
const HEART = { e: [10, 160], h: [80, 70], hand: 'open' };
const POINT_UP = (t) => ({ e: [70, 120], h: [118, -14 + Math.sin(t * 5) * 8], hand: 'point' });
const FIST_UP = (t) => ({ e: [78, 118], h: [112, -6 + Math.abs(Math.sin(t * 7)) * -22], hand: 'fist' });
const CHIN = { e: [96, 120], h: [96, -60], hand: 'fist' };
const lerpArm = (a, b, u) => ({ e: [lerp(a.e[0], b.e[0], u), lerp(a.e[1], b.e[1], u)], h: [lerp(a.h[0], b.h[0], u), lerp(a.h[1], b.h[1], u)], hand: u < .5 ? a.hand : b.hand });
function speak(k, t, rest, style = 'talk') { const a = env(k, t); if (a > .08) return { mouth: style, open: clamp(a * 1.0, .15, .72), wide: .21, wideNow: nz(t * 1.7, k === 'k' ? 1 : 5) * .3 }; return rest }
const smooth = (u) => { u = clamp(u, 0, 1); return u * u * (3 - 2 * u) };
// 0 seated .. 1 standing: rises 7.1-7.9 (during Battery's question), speaks standing, sits 11.3-11.9
const stand = (t) => smooth((t - 7.1) / .8) * (1 - smooth((t - 11.3) / .6));
function kaluState(t) {
  let f = { brow: .2, look: [.8, 0], mouth: 'flat' }, near = REST_N, far = REST_F, lean = 0, nod = 0, tilt = 0;
  if (t < 4) { f = { brow: -.1, lid: .2, look: [.8, -.1], ...speak('k', t, { mouth: 'flat' }) }; far = OPEN(t, 1); nod = Math.sin(t * 3) * .3 }                    // grave, pompous philosophy
  else if (t < 7.1) { f = { brow: .25, lid: .3, look: [.85, 0], mouth: 'flat' }; far = t > 5 && t < 6.6 ? CHIN : REST_F }                                       // listens like a judge, chin on fist
  else if (t < 8.4) { f = { closed: 'flat', brow: .5, mouth: 'flat' }; near = lerpArm(REST_N, HEART, smooth((t - 7.5) / .4)); lean = .02 }                      // rises, eyes shut, hand on heart: solemn oath
  else if (t < 11.3) { f = { brow: -.5, browUp: .4, lid: .08, look: [.85, 0], eye: 1.06, ...speak('k', t, { mouth: 'grit' }, 'talk') }; far = FIST_UP(t); lean = .07; tilt = -.05 }   // delivers the word with total conviction
  else if (t < 12.2) { f = { closed: 'flat', brow: .3, mouth: 'flat' }; lean = .02; nod = .5 }                                                                 // sits, one grave nod
  else if (t < 27) { f = { brow: .25, lid: .35, look: [.85, 0], mouth: 'flat' }; nod = Math.max(0, Math.sin(t * 2.2)) * .35; far = t > 18 && t < 23 ? CHIN : REST_F }   // listens, nodding gravely
  else if (t < 32) { f = { brow: .75, lid: .4, tears: t > 29.5, look: [.6, .2], ...speak('k', t, { mouth: 'sad' }) }; near = HEART; tilt = .04 }               // "woh emotion bhi dekho"
  else if (t < 37.2) { f = { brow: .1, browUp: .5, lid: .1, look: [.85, 0], ...speak('k', t, { mouth: 'flat' }) }; far = POINT_UP(t); lean = .04 }          // "achha Pandit ji..." formal question
  else if (t < 38.0) { f = { brow: .2, lid: .3, look: [.85, 0], mouth: 'flat' }; far = OPEN(t, 3); lean = -.02 }                                               // pause before the verdict
  else { f = { brow: -.4, lid: .1, look: [.85, 0], ...speak('k', t, { mouth: 'grit' }) }; far = OPEN(t, 3); lean = -.03 }                                      // "Bh*sdi ke." said like a scholar
  if (t >= 38.7) f = { closed: 'flat', brow: .2, mouth: 'flat' };                                                                                                 // mic-drop eyes shut
  if (!f.closed && blink(t, .3)) f = { ...f, closed: 'flat' };
  return { face: f, arms: { near, far }, lean, nod, headTilt: tilt, hop: 0, stand: stand(t) };
}
function battState(t) {
  let f = { brow: .25, look: [.8, 0], mouth: 'flat' }, near = REST_N, far = REST_F, lean = 0, nod = 0, tilt = 0;
  if (t < 4) { f = { brow: .3, lid: .2, look: [.8, 0], mouth: 'flat' }; nod = Math.max(0, Math.sin(t * 2.5)) * .4 }                                               // listens, deadpan nods
  else if (t < 7.2) { f = { brow: .5, browUp: .4, look: [.85, 0], ...speak('f', t, { mouth: 'flat' }) }; far = OPEN(t, 2); lean = .03 }                         // the loaded question
  else if (t < 9.6) { f = { brow: .8, browUp: 1, eye: 1.12, pupil: .6, look: [.85, -.55], mouth: 'flat' }; lean = .02 }                                         // Kalu stands up: wide-eyed stare, face stays flat
  else if (t < 11.9) { f = { brow: .15, lid: .3, look: [.85, -.3], mouth: 'flat' }; nod = t > 10.6 ? .5 : 0 }                                                  // one slow, respectful nod
  else if (t < 14.2) { f = { brow: .85, browUp: 1, eye: 1.1, look: [.85, 0], ...speak('f', t, { mouth: 'flat' }, 'talk') }; far = OPEN(t, 4) }                // "matlab Manoj bhai, poori kavita hai"
  else if (t < 20.5) { const sav = t > 15.6 && t < 17.4; f = sav ? { closed: 'flat', brow: .55, ...speak('f', t, { mouth: 'flat' }) } : { brow: .45, lid: .25, look: [.85, 0], ...speak('f', t, { mouth: 'flat' }) }; far = OPEN(t, 6); tilt = Math.sin(t * 1.8) * .05 }   // savours the poetry, solemn
  else if (t < 25) { f = { brow: -.1, lid: .2, look: [.85, -.1], ...speak('f', t, { mouth: 'flat' }) }; far = POINT_UP(t) }                                      // professor of maatraayein
  else if (t < 27) { f = { closed: 'flat', brow: .6, ...speak('f', t, { mouth: 'flat' }) }; far = POINT_UP(t); tilt = .05 }                                    // "maa... da..."
  else if (t < 32) { f = { brow: .7, lid: .35, look: [.85, 0], mouth: 'flat' }; nod = Math.max(0, Math.sin(t * 2)) * .5 }                                       // moved, hand on chin
  else if (t < 38.0) { f = { brow: .45, lid: .15, look: [.85, 0], mouth: 'flat' }; far = t > 34 ? CHIN : REST_F }                                              // waits for the verdict
  else { f = { brow: .6, browUp: 1, eye: 1.1, look: [.85, 0], mouth: 'flat' }; near = HEART; nod = t > 38.4 ? .6 : 0 }                                           // stunned respect, slow nod
  if (!f.closed && blink(t, 1.7)) f = { ...f, closed: 'flat' };
  return { face: f, arms: { near, far }, lean, nod, headTilt: tilt, hop: 0 };
}
function backdrop() {
  const g = c.createLinearGradient(0, 0, 0, FLOOR); g.addColorStop(0, '#F1ECE4'); g.addColorStop(1, '#E6DED2'); c.fillStyle = g; c.fillRect(-1000, -1000, 3100, FLOOR + 1000);
  c.fillStyle = '#D8CDBE'; c.fillRect(-1000, FLOOR, 3100, 2000); c.fillStyle = 'rgba(0,0,0,.07)'; c.fillRect(-1000, FLOOR, 3100, 8);
  c.save(); c.globalAlpha = .12; c.fillStyle = '#2a2420'; c.beginPath(); c.ellipse(540, FLOOR + 14, 470, 26, 0, 0, 7); c.fill(); c.restore();
}
export function draw(t) {
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
  const up = stand(t), z = 1.27 - .13 * up, cx = 540 + Math.sin(t * .35) * 8, cy = 1265 - 70 * up;   // pulls back a little while Kalu stands so his head clears the title
  c.translate(W / 2, H / 2); c.scale(z, z); c.translate(-cx, -cy);
  backdrop();
  kpChair(KX - 14 * S, HY + 14 * S, S, false); kpChair(BX + 14 * S, HY + 14 * S, S, true);
  kpSeated({ ...KALU, x: KX + 30 * up, y: HY, s: S, ...kaluState(t) });
  kpSeated({ ...BATT, x: BX, y: HY, s: S, flip: true, ...battState(t) });
  c.restore();
  label([['Avg conversation between ', '#111'], ['boys', '#D7261E']], W / 2, 260, 56);
  captions(groups, t, KEYS, 1700); finish(t);
}
export const cues = [];
