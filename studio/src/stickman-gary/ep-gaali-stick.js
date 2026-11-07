// 2026-11-08 IG reel test (Stickman style) "Avg conversation between boys": Kalu (left, brown, mustard tee, tall quiff) and
// Battery (right, thin specs, side part, teal shirt + tie) seated facing each other in one plain scene, both on screen the
// whole time. Sarcastically serious: dead-straight faces, NO laughing. Mouths from the clip's speech envelope (owner timestamps).
import { bind as bindT, label, captions, groupWords } from '../toon/toon.js';
import { bind, man, line, finish, setBoil } from './engine.js';
const META = await (await fetch('/data/meta.json')).json();
const ENV = await (await fetch('/data/env.json')).json();
export const DUR = 38;
// owner's cut: the clip is tightened to 38 s. Two pauses are removed (source 35.65-36.25 and 37.6-40.3), so the last word
// "Bh*sdi ke" lands at 37.0 and the reel ends at 38.0. src(t) maps reel time to clip time for the lip envelope.
const src = (t) => t < 35.65 ? t : t < 37.0 ? t + 0.6 : t + 3.3;
let c, groups = [];
const KEYS = /^(gaali|gaaliyan|kavita|lay|maatraayein|emotion|M\*darch\*d\.?|Bh\*sdi|samaaj|pasandida)/i;
function retime(w) {   // last line re-spread onto the tightened ending: question 32.3-35.6, "Pasandida gaali hamari hai" 35.75-36.95, last word 37.0
  w = w.map(x => x.line === 2 ? { ...x, s: 8.7 } : x);   // caption pops once he is standing
  const keep = w.filter(x => x.line !== 5), L5 = w.filter(x => x.line === 5), out = [...keep];
  const spread = (ws, a, b) => { const g = ws.map(x => x.w.replace(/\W/g, '').length + 1.5), T = g.reduce((p, q) => p + q, 0); let cu = 0; ws.forEach((x, i) => { const s0 = a + cu / T * (b - a); cu += g[i]; out.push({ ...x, s: +s0.toFixed(3), e: +(a + cu / T * (b - a)).toFixed(3) }) }) };
  spread(L5.slice(0, 13), 32.3, 35.6); spread(L5.slice(13, 17), 35.75, 36.95); spread(L5.slice(17), 37.0, 37.7);
  return out;
}
export function init(cx, w) { c = cx; bind(c); bindT(c); groups = groupWords(retime(w)) }
const env = (k, t) => { const a = ENV[k], i = Math.floor(src(t) * 30); return a && i < a.length ? (a[Math.max(0, i)] || 0) : 0 };
const clamp = (v) => Math.max(0, Math.min(1, v)), lerp = (a, b, u) => a + (b - a) * u, easeIO = (u) => u * u * (3 - 2 * u);
const blink = (t, ph) => ((t + ph) % 3.4) < .13;
const FLOOR = 1430, KX = 300, BX = 780, S = .9;
const SEAT = [[115, -150, 150, 0], [85, -150, 105, 0]];
// arms: [elbowX, elbowY, handX, handY] from the shoulder (character faces +x before flip)
const LAP = [[20, 110, 95, 175], [55, 105, 135, 165]];
const GEST = (t, k) => [70, 70, 160, -10 + Math.sin(t * 5 + k) * 22];
const FINGER = (t) => [80, 40, 120, -80 + Math.sin(t * 4) * 8, -1.6];
const HEART = [40, 90, -10, 40];
const CHIN = [90, 40, 30, -95];
function mouth(k, t, rest) { const a = env(k, t); return a > .08 ? { mouth: 'open', open: Math.min(1, a * 1.3) } : { mouth: rest } }
function kalu(t) {
  let f = { brow: -.3, look: [.6, 0] }, A = LAP, nod = 0, lean = 0, tilt = 0;
  if (t < 4) { f = { brow: -.5, look: [.6, -.1], ...mouth('k', t, 'flat') }; A = [LAP[0], GEST(t, 1)]; tilt = -.04 }            // grave philosophy
  else if (t < 8) { f = { brow: .3, look: [.65, 0], mouth: 'flat' }; nod = Math.max(0, Math.sin(t * 2.3)) * .25 }                 // listens like a judge
  else if (t < 8.7) { f = { eyes: 'closed', brow: -.2, mouth: 'flat' } }                                                       // eyes shut, rises                                                           // eyes shut, finds the word
  else if (t < 12) { f = { brow: -.9, look: [.7, 0], eye: 1.05, ...mouth('k', t, 'frown') }; A = [LAP[0], FINGER(t)]; lean = .06 } // total conviction
  else if (t < 27) { f = { brow: .2, look: [.65, 0], mouth: 'flat' }; nod = Math.max(0, Math.sin(t * 2.1)) * .22; A = t > 18 && t < 23 ? [LAP[0], CHIN] : LAP }  // respectful listener
  else if (t < 32) { f = { brow: .6, look: [.5, .15], ...mouth('k', t, 'frown') }; A = [HEART, LAP[1]]; tilt = .06 }             // "woh emotion bhi dekho"
  else if (t < 37.0) { f = { brow: -.2, look: [.65, 0], ...mouth('k', t, 'flat') }; A = [LAP[0], GEST(t, 3)] }                   // formal question
  else { f = { brow: -.7, look: [.65, 0], ...mouth('k', t, 'frown') }; A = [LAP[0], FINGER(t)]; lean = -.03 }                     // the scholar's favourite
  if (!f.eyes && blink(t, .4)) f = { ...f, eyes: 'closed' };
  return { face: { ...f, hair: 'quiff', hairFill: '#17110E', kind: 'egg', hairStill: true }, arms: A, nod: 0, lean, tilt: tilt + nod * .35 };
}
function batt(t) {
  let f = { brow: .1, look: [.6, 0] }, A = LAP, nod = 0, lean = 0, tilt = 0;
  if (t < 4) { f = { brow: .2, look: [.65, 0], mouth: 'flat' }; nod = Math.max(0, Math.sin(t * 2)) * .25 }
  else if (t < 8) { f = { brow: -.4, look: [.65, 0], ...mouth('f', t, 'flat') }; A = [LAP[0], GEST(t, 2)] }                     // the interviewer
  else if (t < 12) { f = { brow: .1, look: [.65, 0], mouth: 'flat' }; A = [LAP[0], CHIN]; nod = t > 10.2 ? .25 : 0 }             // absorbs it, one grave nod
  else if (t < 14.2) { f = { brow: .6, eye: 1.08, look: [.65, 0], ...mouth('f', t, 'flat') }; A = [LAP[0], GEST(t, 4)] }         // "poori kavita hai"
  else if (t < 20.5) { const sav = t > 15.6 && t < 17.4; f = sav ? { eyes: 'closed', brow: .4, ...mouth('f', t, 'flat') } : { brow: .3, look: [.65, 0], ...mouth('f', t, 'flat') }; A = [LAP[0], GEST(t, 6)]; tilt = Math.sin(t * 1.6) * .05 }  // recites, savouring
  else if (t < 25) { f = { brow: -.5, look: [.65, -.1], ...mouth('f', t, 'frown') }; A = [LAP[0], FINGER(t)] }                   // professor of maatraayein
  else if (t < 27) { f = { eyes: 'closed', brow: .5, ...mouth('f', t, 'flat') }; A = [LAP[0], FINGER(t)]; tilt = .05 }             // "maa... da..."
  else { f = { brow: .35, look: [.65, 0], mouth: 'flat' }; nod = Math.max(0, Math.sin(t * 2)) * .25; A = t > 36.9 ? [LAP[0], CHIN] : LAP }  // deep respect
  if (!f.eyes && blink(t, 1.9)) f = { ...f, eyes: 'closed' };
  return { face: { ...f, hair: 'part', hairFill: '#2A1D16', kind: 'round', specs: 'thin', hairStill: true }, arms: A, nod: 0, lean, tilt: tilt + nod * .35 };
}
function chair(x, flip) {
  const d = flip ? -1 : 1, sy = FLOOR - 150 * S;
  line([[x - 70 * d, sy], [x + 95 * d, sy]], 9, '#3B4050', 1.2);
  line([[x - 70 * d, sy], [x - 85 * d, sy - 250]], 9, '#3B4050', 1.2);
  line([[x - 55 * d, sy], [x - 60 * d, FLOOR]], 8, '#3B4050', 1); line([[x + 85 * d, sy], [x + 90 * d, FLOOR]], 8, '#3B4050', 1);
}
export function draw(t) {
  setBoil(Math.floor(t * 8));
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
  c.fillStyle = '#F3EEE4'; c.fillRect(0, 0, 1080, 1920);
  c.fillStyle = '#E4DCCD'; c.fillRect(0, FLOOR, 1080, 1920 - FLOOR);
  line([[-20, FLOOR], [1100, FLOOR]], 7, '#141414', 1.5);
  const z = 1.3 + t / DUR * .06; c.translate(540, 1130); c.scale(z, z); c.translate(-540, -1150);
  chair(KX, false); chair(BX, true);
  const k = kalu(t), b = batt(t);
  // stand-up gag: rises 8.0-8.7 (eyes shut), says it standing, sits back down 10.5-11.1 with a little settle
  const up = easeIO(clamp((t - 8.0) / .7)) * (1 - easeIO(clamp((t - 10.5) / .6))), settle = t > 11.1 && t < 11.5 ? Math.sin((t - 11.1) / .4 * Math.PI) * 10 : 0;
  const KL = [[lerp(115, 15, up), -150, lerp(150, 35, up), 0], [lerp(85, -15, up), -150, lerp(105, -10, up), 0]];
  man({ x: KX + 115 * S * up, y: FLOOR - settle, s: S, legH: 150 + 150 * up, torso: 220, r: 118, skin: '#8A5536', body: '#E8A33A', shoe: '#F1F1EE', legs: KL, ...k, lean: k.lean - .05 * up });
  man({ x: BX, y: FLOOR, s: S, legH: 150, torso: 220, r: 112, skin: '#EAC49A', body: '#2E9C97', tie: '#C8382E', shoe: '#3B3B40', legs: SEAT, flip: true, ...b });
  c.restore();
  label([['Avg conversation between ', '#111'], ['boys', '#D7261E']], 540, 260, 56);
  captions(groups, t, KEYS, 1700); finish(t);
}
export const cues = [];
