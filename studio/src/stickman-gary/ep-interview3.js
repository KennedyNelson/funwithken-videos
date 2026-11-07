// 2026-11-08 IG reel v3 "Avg conversation between boys": ONE scene, Kalu (A, left) and Battery (B, right) seated facing each
// other, both on screen the whole time. Style: Desi Goggle-Eye Toon (kp_animatess grammar). Lip-sync from the clip's speech
// envelope masked to the owner's speaker timestamps; expressions follow the meaning of each line. Owner adds the audio.
import { W, H, bind, lerp, clamp, ease, pr, label, captions, groupWords, finish } from '../toon/toon.js';
import { kpSeated, kpChair } from '../toon/kp.js';
const META = await (await fetch('/data/meta.json')).json();
const ENV = await (await fetch('/data/env.json')).json();
export const DUR = META.dur;
let c, groups = [];
const KEYS = /^(gaali|gaaliyan|kavita|lay|maatraayein|emotion|M\*darch\*d\.?|Bh\*sdi|samaaj|pasandida)/i;
export function init(cx, w) { c = cx; bind(c); groups = groupWords(w) }
const env = (k, t) => { const a = ENV[k]; return a ? (a[Math.min(a.length - 1, Math.max(0, Math.floor(t * 30)))] || 0) : 0 };
const blink = (t, ph) => ((t + ph) % 3.6) < .12;
const nz = (t, k) => Math.sin(t * 17.3 + k) * .5 + Math.sin(t * 9.1 + k * 2) * .5;
const KALU = { skin: '#8A5536', hair: 'kalu', hairCol: '#16110E', stubble: true, top: 'tee', topCol: '#2E8C86', pant: '#2E4766', shoe: '#F1F1EE' };
const BATT = { skin: '#C9976A', hair: 'battery', hairCol: '#2B1D16', specs: true, top: 'shirt', topCol: '#8C7BC4', pant: '#5E6470', shoe: '#3B3B40' };
const S = .86, FLOOR = 1700, KX = 300, BX = 780, HY = FLOOR - 272 * S;
// arm presets (relative to the shoulder)
const REST_N = { e: [16, 150], h: [124, 266], hand: 'rest' }, REST_F = { e: [8, 146], h: [96, 268], hand: 'rest' };
const OPEN = (t, k) => ({ e: [26, 146], h: [150, 70 + nz(t, k) * 32], hand: 'open' });
const HEART = { e: [10, 160], h: [80, 70], hand: 'open' };
const POINT_UP = (t) => ({ e: [70, 120], h: [118, -14 + Math.sin(t * 5) * 8], hand: 'point' });
const FIST_UP = (t) => ({ e: [78, 118], h: [112, -6 + Math.abs(Math.sin(t * 7)) * -22], hand: 'fist' });
const CHIN = { e: [96, 120], h: [96, -60], hand: 'fist' };
const SLAP = (t) => ({ e: [16, 150], h: [124, 266 - Math.abs(Math.sin(t * 11)) * 50], hand: 'open' });
// mouth from the voice: open by the envelope, small width variation so it reads as real speech
function speak(k, t, rest, style = 'talk') { const a = env(k, t); if (a > .08) return { mouth: style, open: clamp(a * 1.25, .2, 1), wideNow: nz(t * 1.7, k === 'k' ? 1 : 5) * .5 + .3 }; return rest }
function kaluState(t) {
  let f = { brow: .2, look: [.75, 0], mouth: 'smile' }, near = REST_N, far = REST_F, lean = 0, nod = 0, tilt = 0, hop = 0;
  if (t < 4) { f = { brow: .45, lid: .15, look: [.8, -.1], ...speak('k', t, { mouth: 'smirk' }) }; far = OPEN(t, 1); nod = Math.sin(t * 3) * .4 }                                   // the samaaj philosophy, wise
  else if (t < 8) { f = { brow: t > 6.4 ? .35 : .2, lid: t > 6.4 ? .3 : .1, look: [.85, 0], mouth: t > 6.4 ? 'smirk' : 'smile' }; far = t > 5 && t < 6.4 ? CHIN : REST_F }        // listens, then knows the answer
  else if (t < 12) {
    if (t < 8.7) { f = { closed: 'flat', brow: .6, mouth: 'flat' }; lean = .02 }                                                                                                   // savours it before saying it
    else if (t < 11.1) { f = { brow: -.45, browUp: .4, look: [.85, 0], ...speak('k', t, { mouth: 'grit' }, 'laugh'), eye: 1.06 }; far = FIST_UP(t); lean = .07; tilt = -.05 }      // expressive delivery
    else { f = { closed: 'happy', brow: .3, mouth: 'smile', blush: true }; lean = .03 }                                                                                            // satisfied
  }
  else if (t < 27) { const laugh = (t > 16.6 && t < 18.6); f = laugh ? { closed: 'happy', brow: .3, mouth: 'laugh', open: .55 + Math.abs(Math.sin(t * 12)) * .35 } : { brow: .3, lid: .35, look: [.85, 0], mouth: 'smirk' }; nod = laugh ? 0 : Math.max(0, Math.sin(t * 2.2)) * .5; hop = laugh ? Math.abs(Math.sin(t * 12)) * 6 : 0 }   // proud listener
  else if (t < 32) { f = { brow: .75, lid: .45, tears: t > 29, look: [.6, .2], ...speak('k', t, { mouth: 'sad' }) }; near = HEART; tilt = .04 }                                     // "woh emotion bhi dekho"
  else if (t < 38.2) { f = { brow: .55, browUp: .5, look: [.85, 0], ...speak('k', t, { mouth: 'smile' }) }; far = POINT_UP(t); lean = .04 }                                         // "achha pandit ji..."
  else { const done = env('k', t) < .08 && t > 40.2; f = done ? { closed: 'happy', brow: .2, mouth: 'smile', blush: true } : { brow: -.25, lid: .1, look: [.85, 0], ...speak('k', t, { mouth: 'grit' }) }; far = OPEN(t, 3); lean = -.03 }  // proud answer
  if (!f.closed && blink(t, .3)) f = { ...f, closed: 'flat' };
  return { face: f, arms: { near, far }, lean, nod, headTilt: tilt, hop };
}
function battState(t) {
  let f = { brow: .25, look: [.75, 0], mouth: 'smile' }, near = REST_N, far = REST_F, lean = 0, nod = 0, tilt = 0, hop = 0;
  if (t < 4) { f = { brow: .25, look: [.8, 0], mouth: 'smile' }; nod = Math.max(0, Math.sin(t * 2.5)) * .5 }                                                                       // listens, nodding
  else if (t < 8) { f = { brow: .6, browUp: .4, look: [.85, 0], ...speak('f', t, { mouth: 'smirk' }) }; far = OPEN(t, 2); lean = .03 }                                            // the cheeky question
  else if (t < 12) { if (t < 9.4) { f = { brow: .7, browUp: 1, eye: 1.12, look: [.85, 0], mouth: 'o', open: .4 }; lean = .05 } else { f = { closed: 'happy', brow: .4, mouth: 'laugh', open: .6 + Math.abs(Math.sin(t * 12)) * .4, blush: true }; near = SLAP(t); hop = Math.abs(Math.sin(t * 12)) * 8; tilt = -.06 } }   // waits, then cracks up
  else if (t < 27) {
    if (t < 14.2) { f = { brow: .85, browUp: 1, eye: 1.1, look: [.85, 0], ...speak('f', t, { mouth: 'o' }) }; far = OPEN(t, 4) }                                                   // "matlab Manoj bhai, poori kavita hai"
    else if (t < 20.5) { const sav = t > 15.6 && t < 17.4; f = sav ? { closed: 'happy', brow: .5, ...speak('f', t, { mouth: 'smile' }) } : { brow: .45, lid: .2, look: [.85, 0], ...speak('f', t, { mouth: 'smile' }) }; far = OPEN(t, 6); tilt = Math.sin(t * 1.8) * .05 }   // poetry appreciation
    else if (t < 25) { f = { brow: -.1, lid: .2, look: [.85, -.1], ...speak('f', t, { mouth: 'smile' }) }; far = POINT_UP(t) }                                                        // professor of maatraayein
    else { f = { closed: 'flat', brow: .6, ...speak('f', t, { mouth: 'smile' }) }; far = POINT_UP(t); tilt = .05 }                                                                   // "maa... da..."
  }
  else if (t < 32) { f = { brow: .7, lid: .35, look: [.85, 0], mouth: 'smile' }; nod = Math.max(0, Math.sin(t * 2)) * .6 }                                                          // moved
  else if (t < 38.2) { f = { brow: .4, look: [.85, 0], mouth: 'smirk' } }                                                                                                       // waits for it
  else { f = { closed: 'happy', brow: .4, mouth: 'laugh', open: .6 + Math.abs(Math.sin(t * 12)) * .4, blush: true }; near = SLAP(t); hop = Math.abs(Math.sin(t * 12)) * 8; tilt = -.06 }  // loses it
  if (!f.closed && blink(t, 1.7)) f = { ...f, closed: 'flat' };
  return { face: f, arms: { near, far }, lean, nod, headTilt: tilt, hop };
}
function backdrop() {
  const g = c.createLinearGradient(0, 0, 0, FLOOR); g.addColorStop(0, '#F1ECE4'); g.addColorStop(1, '#E6DED2'); c.fillStyle = g; c.fillRect(-1000, -1000, 3100, FLOOR + 1000);
  c.fillStyle = '#D8CDBE'; c.fillRect(-1000, FLOOR, 3100, 2000); c.fillStyle = 'rgba(0,0,0,.07)'; c.fillRect(-1000, FLOOR, 3100, 8);
  c.save(); c.globalAlpha = .12; c.fillStyle = '#2a2420'; c.beginPath(); c.ellipse(540, FLOOR + 14, 470, 26, 0, 0, 7); c.fill(); c.restore();
}
export function draw(t) {
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
  const ka = env('k', t), ba = env('f', t), who = ka > ba ? -1 : ba > ka ? 1 : 0;
  const z = 1.27 + ease(pr(t, 8.6, 9.4)) * .05 * (1 - ease(pr(t, 11.5, 12.3))) + ease(pr(t, 38.2, 38.9)) * .05;
  const cx = 540 + Math.sin(t * .35) * 8, cy = 1265;
  c.translate(W / 2, H / 2); c.scale(z, z); c.translate(-cx, -cy);
  backdrop();
  kpChair(KX - 14 * S, HY + 14 * S, S, false); kpChair(BX + 14 * S, HY + 14 * S, S, true);
  kpSeated({ ...KALU, x: KX, y: HY, s: S, ...kaluState(t) });
  kpSeated({ ...BATT, x: BX, y: HY, s: S, flip: true, ...battState(t) });
  c.restore();
  label([['Avg conversation between ', '#111'], ['boys', '#D7261E']], W / 2, 260, 56);
  captions(groups, t, KEYS, 1700); finish(t);
}
export const cues = [];
