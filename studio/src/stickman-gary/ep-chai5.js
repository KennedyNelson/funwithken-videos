// 2026-11-07 IG reel v6 (20 rupaye caption, '(has only 10 Rs)' on the wallet, 5 s disappointment, no sweat) (owner's revised dialogue; commanding samosa line; 3 s disappointment hold for an IG sound) "Being kind in this economy" (chai + samosa). Style: POLISHED DESI TOON (Desi Ride Toon + cel-lit tea stall + macro insert).
import { W, H, bind, ctx, lerp, clamp, ease, easeOut, back, pr, label, captions, groupWords, finish, fillEll } from '../toon/toon.js';
import { person } from '../toon/people.js';
import { drawStreet, autoBack, autoFront, stallBack, stallFront, chaiGlass, samosa, bench, wallet, CT, CH2 } from '../toon/sets.js';
const META = await (await fetch('/data/meta.json')).json();
const ENV = await (await fetch('/data/env.json')).json();
export const DUR = META.dur;
const S = META.starts, E = META.ends;
let c, groups = [];
const KEYS = /^(chai|samosa|20|chai,?|rupaye\.?|10)$/i;
export function init(cx, w) { c = cx; bind(c); groups = groupWords(w) }
const env = (k, t) => { const a = ENV[k]; if (!a) return 0; return a[Math.min(a.length - 1, Math.max(0, Math.floor(t * 30)))] || 0 };
const talk = (k, t, base = 'smile', big = 'open') => { const a = env(k, t); return a > .1 ? { mouth: big, open: clamp(a * 1.4, .3, 1) } : { mouth: base } };
const blink = (t, ph = 0) => ((t + ph) % 3.1) < .12 ? .95 : 0;
const cam = (z, x, y, sh, t, fn) => { c.save(); const dx = sh ? Math.sin(t * 61) * sh : 0, dy = sh ? Math.cos(t * 83) * sh : 0; c.translate(W / 2 + dx, H / 2 + dy); c.scale(z, z); c.translate(-x, -y); fn(); c.restore() };
// ---------- cast ----------
const KALU = { skin: '#7B4A2F', shirt: '#3BA7D9', pant: '#2E4C7A', hair: 'quiff', shoe: 'sneaker', stubble: true };
const DRV = { skin: '#B97A4E', shirt: '#BFA064', pant: '#5E4B36', hair: 'sidepart', stache: true, belly: true, gamcha: '#C9302C', pocket: true, collar: '#A88C52', shoe: 'chappal' };
const CHW = { skin: '#C98B5C', vest: true, lungi: true, hair: 'bald', hairCol: '#3a3a3a', stache: true, belly: true, specs: true, shoe: 'chappal', lungiCol: '#EEF1F5', lungiLine: '#6F96C4' };
// arm helper: hand target in WORLD coords -> [ex,ey,hx,hy] relative to the shoulder (local units)
function armTo(p, q, wx, wy, droop = 50, prop) {
  const s = p.s || 1, fl = p.flip ? -1 : 1, lx = (wx - p.x) / s * fl, ly = (wy - p.y) / s + (p.hop || 0) / s;
  const sx = q * 96, sy = p.sit ? -450 : -490; let hx = lx - sx, hy = ly - sy; const L = Math.hypot(hx, hy), M = 230; if (L > M) { hx *= M / L; hy *= M / L }
  return [hx * .5 + q * 18, hy * .5 + droop, hx, hy, prop];
}
// ---------- the auto on the street ----------
const AX = 560, AY = 1500, AS = .95;
const SPEED = t => t < .7 ? 1500 : t < 1.15 ? 1500 * (1 - ease((t - .7) / .45)) : 0;
function streetOff(t) { let o = 0, dt = 1 / 60; for (let u = 0; u < t; u += dt) o += SPEED(u) * dt; return o }
const offCache = []; const OFF = t => { const i = Math.round(t * 30); if (offCache[i] == null) offCache[i] = streetOff(i / 30); return offCache[i] };
// passengers in auto-local coords
const KIN = (t, o = {}) => ({ ...KALU, x: 175, y: -168, s: .63, sit: true, noShadow: true, ...o });
const DIN = (t, o = {}) => ({ ...DRV, x: -165, y: -168, s: .63, sit: true, flip: true, noShadow: true, ...o });
function autoScene(t, kalu, drv, vib = 0) {
  const sp = SPEED(t), bob = vib * Math.sin(t * 48) * 3 + (sp > 0 ? Math.sin(t * 9) * 4 : 0);
  // street
  c.save(); c.translate(-AX * 0, 0); drawStreet(OFF(t) * .8, 200, 1, sp); c.restore();
  c.fillStyle = '#5E5957'; c.fillRect(-2000, 1700, 6000, 3000);
  c.save(); c.translate(AX, AY + bob); c.scale(AS, AS);
  autoBack(t);
  if (drv) person(drv); if (kalu) person(kalu);
  autoFront(t, -OFF(t) / 70);
  c.restore();
}
// ---------- the tea stall ----------
const FLOOR = 2120;
function stallScene(t, fn) {
  // blurred street behind the open stall
  drawStreet(900, -260, 1.2, 0, 18);
  stallBack(t);
  if (fn && fn.behind) fn.behind();
  stallFront(t);
  c.fillStyle = '#B9A88E'; c.fillRect(-1000, CT + CH2, 4000, 3000);
  for (let i = 0; i < 14; i++) { c.fillStyle = i % 2 ? '#B0A086' : '#C2B297'; c.fillRect(-300 + i * 140, CT + CH2, 140, 2000) }
  c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(-1000, CT + CH2, 4000, 40);
  if (fn && fn.front) fn.front();
}
const CHAIWALA = (t, face, arms) => person({ ...CHW, x: 780, y: 1760, s: .86, face, arms: arms || [[-30, 130, -10, 230], [30, 130, 10, 230]] });
// ---------- scenes ----------
const SC = []; const at = (a, b, fn) => SC.push([a, b, fn]);
const WAL = E[5] + .02, PAY = S[6] - .02, PUNCH = S[6] + .9, CRUSH = E[6] + .05;
// A. ride in + B. "Bhaiya... ek chai piyoge?"
at(0, E[0] + .1, t => {
  const stop = t > 1.15, u = ease(pr(t, 1.05, S[0] + .3));
  const z = lerp(.92, 1.45, u), cx = lerp(560, 600, u), cy = lerp(1080, 1080, u);
  const kl = talk('k', t, 'bigsmile', 'open');
  cam(z, cx, cy, 0, t, () => autoScene(t,
    KIN(t, { lean: lerp(0, -.18, u), face: { look: [-1, 0], brow: .3, blush: true, lid: blink(t), ...kl }, arms: [[-20, 120, -20, 220], [-40, 40, -150, 0]] }),
    DIN(t, { face: { look: [1, 0], brow: 0, mouth: 'tight', lid: blink(t, 1) }, arms: [[60, 90, 70, 60], [60, 90, 70, 60]] }), stop ? 0 : 1));
});
// C. driver close-up: shy refusal
at(E[0] + .1, S[2] - .05, t => {
  const z = lerp(2.25, 2.4, pr(t, E[0], S[2])), wave = Math.sin(t * 12) * 40;
  const dl = talk('d', t, 'bigsmile', 'open'), shy = t > E[1] - .2;
  cam(z, 420, 1090, 0, t, () => autoScene(t,
    KIN(t, { face: { look: [-1, 0], brow: .3, mouth: 'bigsmile' }, arms: [[-20, 120, -20, 220], [-40, 40, -150, 0]] }),
    DIN(t, { tilt: Math.sin(t * 7) * .05, face: { look: [-.6, .3], brow: .9, blush: true, closed: shy, lid: shy ? 0 : .25, ...dl }, arms: [[60, 90, 70, 60], [-90, -10, -150 + wave * .6, -140]] }), 0));
});
// D. two-shot: driver chuckling and waving it off, Kalu grinning
at(99, 99, t => {
  const z = lerp(1.55, 1.62, pr(t, 4.45, S[2])), wave = Math.sin(t * 10) * 34;
  const dl = talk('d', t, 'bigsmile', 'bigsmile');
  cam(z, 560, 1080, 0, t, () => autoScene(t,
    KIN(t, { lean: -.08, face: { look: [-1, 0], brow: .4, mouth: 'bigsmile', blush: true, lid: blink(t) }, arms: [[-20, 120, -20, 220], [-40, 40, -120, 20]] }),
    DIN(t, { tilt: -.05, face: { look: [-.5, .2], brow: .8, closed: true, blush: true, ...dl }, arms: [[60, 90, 70, 60], [-90, -10, -150 + wave * .6, -140]] }), 0));
});
// E. Kalu close-up: insisting, laughing, hand on heart then open palm
at(S[2] - .05, S[3] - .02, t => {
  const z = lerp(2.3, 2.5, pr(t, S[2], S[3])), u = pr(t, S[2], S[2] + .9);
  const kl = talk('k', t, 'bigsmile', 'open');
  const arm = u < 1 ? [-60, 40, -40, -60] : [-60, 30, -170, -40];
  cam(z, 735, 1060, 0, t, () => autoScene(t,
    KIN(t, { lean: -.12, tilt: Math.sin(t * 6) * .05, face: { look: [-1, -.1], brow: .5, blush: true, ...kl }, arms: [[-20, 120, -20, 220], arm] }),
    DIN(t, { face: { look: [1, 0], brow: .6, mouth: 'smile' }, arms: [[60, 90, 70, 60], [60, 90, 70, 60]] }), 0));
});
// F. "Theek hai." driver stays seated in the auto, normal tone, small nod; Kalu pleased
at(S[3] - .02, E[3] + .7, t => {
  const z = lerp(1.6, 1.7, pr(t, S[3], E[3] + .7)), nod = Math.max(0, Math.sin(pr(t, S[3], E[3]) * Math.PI)) * .25;
  const dl = talk('d', t, 'smile', 'open');
  cam(z, 560, 1080, 0, t, () => autoScene(t,
    KIN(t, { lean: -.06, face: { look: [-1, 0], brow: .3, mouth: 'bigsmile', blush: true, lid: blink(t) }, arms: [[-20, 120, -20, 220], [-40, 40, -120, 20]] }),
    DIN(t, { nod, tilt: Math.sin(t * 5) * .04, face: { look: [-.6, .5], brow: .8, lid: .35, blush: true, ...dl }, arms: [[60, 90, 70, 60], [60, 90, 70, 60]] }), 0));
});
// G. tea stall wide: both on the bench, sipping, steam, slurp
at(E[3] + .7, S[4] - .05, t => {
  const z = lerp(.82, .9, pr(t, E[3] + .7, S[4])), sip = Math.sin(t * 4) > .2;
  cam(z, 540, 1300, 0, t, () => stallScene(t, {
    behind: () => CHAIWALA(t, { look: [-.5, .2], brow: 0, mouth: 'flat', lid: .35 + blink(t) * .6 }, [[-30, 130, -10, 230], [60, 60, 120, -10, (x, y) => chaiGlass(x, y + 10, 1, .9, 1, t)]]),
    front: () => {
      bench(40, 1860, 820);
      const d = { ...DRV, x: 260, y: FLOOR, s: .9, sit: true, face: { closed: sip, brow: .3, mouth: sip ? 'open' : 'smile', open: .35, blush: true } };
      d.arms = [[-40, 120, -30, 220], armTo(d, 1, 330, 1610, 40, (x, y) => chaiGlass(x, y + 30, 1.1, .5, 1, t))]; person(d);
      const k = { ...KALU, x: 620, y: FLOOR, s: .9, sit: true, face: { look: [-1, 0], brow: .2, mouth: 'smile', lid: .3 + blink(t, .7) * .6 } };
      k.arms = [[-30, 120, -20, 220], armTo(k, 1, 690, 1650, 40, (x, y) => chaiGlass(x, y + 30, 1.1, .7, 1, t))]; person(k);
    }
  }));
});
// H. "Bhaiya, kitna hua?" Kalu at the counter, relaxed and proud
at(S[4] - .05, S[5] - .05, t => {
  const z = lerp(1.12, 1.2, pr(t, S[4], S[5]));
  const kl = talk('k', t, 'smile', 'open');
  cam(z, 590, 1330, 0, t, () => stallScene(t, {
    behind: () => CHAIWALA(t, { look: [-.6, .1], brow: 0, mouth: 'flat', lid: .4 + blink(t) * .55 }),
    front: () => { const k = { ...KALU, x: 420, y: 1830, s: .98, lean: .04, face: { look: [.8, -.1], brow: .2, lid: .25, ...kl } }; k.arms = [[-30, 120, -30, 230], armTo(k, 1, 590, 1440, 40)]; person(k) }
  }));
});
// I. chaiwala close-up: "Bees rupaye." deadpan, palm out
at(S[5] - .05, WAL, t => {
  const z = lerp(2.1, 2.25, pr(t, S[5], WAL));
  const cl = talk('c', t, 'flat', 'open');
  cam(z, 780, 1290, 0, t, () => stallScene(t, {
    behind: () => CHAIWALA(t, { look: [-.5, .1], brow: -.2, lid: .45, ...cl }, [[-30, 130, -10, 230], [-80, 60, -150, -40]]),
  }));
});
// J. MACRO INSERT: wallet opens, one crumpled Rs 10 (music cuts out)
at(WAL, PAY, t => {
  const u = ease(pr(t, WAL, WAL + .45)), z = lerp(1.15, 1.35, pr(t, WAL, PAY));
  cam(z, 540, 920, 0, t, () => { drawStreet(1400, -200, 1.2, 0, 24); c.fillStyle = 'rgba(40,20,10,.25)'; c.fillRect(-500, -500, 3000, 3000); wallet(u, t, KALU.skin) });
});
// K. payoff two-shot: driver on the bench calling out for a samosa, Kalu frozen in front
at(PAY, PUNCH, t => {
  const z = lerp(.95, 1.0, pr(t, PAY, PUNCH));
  const dl = talk('d', t, 'tight', 'shout');
  cam(z, 560, 1450, 0, t, () => stallScene(t, {
    behind: () => CHAIWALA(t, { look: [-1, 0], brow: .4, mouth: 'flat', lid: .2 }),
    front: () => {
      bench(-60, 1860, 600);
      const d = { ...DRV, x: 170, y: FLOOR, s: .82, sit: true, lean: .05, tilt: .04, face: { look: [1, -.2], brow: -.8, ...dl } };
      d.arms = [armTo(d, -1, 60, 1700, 40, (x, y) => chaiGlass(x, y + 30, 1, .05, 0, t)), [110, -10, 230, -70]]; person(d);
      const k = { ...KALU, x: 770, y: FLOOR + 120, s: 1.18, face: { look: [.3, .7], brow: .9, eye: 1.2, pupil: .3, mouth: 'flat' } };
      k.arms = [[-30, 120, -30, 230], armTo(k, 1, 700, 1640, 50, (x, y) => { c.save(); c.translate(x - 50, y - 50); c.fillStyle = '#7A4526'; c.fillRect(0, 0, 120, 84); c.strokeStyle = '#2B1D16'; c.lineWidth = 5; c.strokeRect(0, 0, 120, 84); c.restore() })]; person(k);
    }
  }));
});
// L. punch-in on Kalu as the samosa line lands
at(PUNCH, CRUSH, t => {
  const z = lerp(2.5, 2.9, easeOut(pr(t, PUNCH, CRUSH)));
  cam(z, 770, 1335, 2, t, () => stallScene(t, {
    front: () => { const k = { ...KALU, x: 770, y: FLOOR + 120, s: 1.18, face: { look: [-.9, 0], brow: .9, eye: 1.3, pupil: .22, mouth: 'tight' } }; k.arms = [[-30, 120, -30, 230], [30, 120, 30, 230]]; person(k) }
  }));
});
// M. silent crushed face, slow push-in, droopy lids, eye twitch, hard stop
at(CRUSH, DUR + .1, t => {
  const u = ease(pr(t, CRUSH, DUR)), z = lerp(2.9, 3.6, u), tw = (t > CRUSH + .5 && Math.sin(t * 38) > .7) ? 3 : 0;
  cam(z, 770, 1340 + u * 14, tw, t, () => stallScene(t, {
    front: () => { const k = { ...KALU, x: 770, y: FLOOR + 120, s: 1.18, nod: u * .5, face: { look: [0, .6], brow: lerp(.4, 1, u), lid: lerp(.45, .62, u), tears: u > .3, mouth: 'wobble' } }; k.arms = [[-30, 120, -30, 230], [30, 120, 30, 230]]; person(k) }
  }));
});
export function draw(t) {
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = '#E8D3A8'; c.fillRect(0, 0, W, H);
  for (const [a, b, fn] of SC) if (t >= a && t < b) { fn(t); break }
  c.restore();
  label([['Being kind in this ', '#111'], ['economy', '#D7261E']], W / 2, 250, 60);
  if (t >= WAL + .35 && t < PAY) { const u = clamp((t - WAL - .35) / .11), z = lerp(.75, 1, back(u)); c.save(); c.translate(W / 2, 1700); c.scale(z, z); c.font = '900 84px Inter'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; c.strokeStyle = '#000'; c.lineWidth = 18; const s1 = '(has only ', s2 = '10 Rs', s3 = ')'; const w1 = c.measureText(s1).width, w2 = c.measureText(s2).width, w3 = c.measureText(s3).width, x0 = -(w1 + w2 + w3) / 2; c.textAlign = 'left'; [[s1, x0, '#FFFFFF'], [s2, x0 + w1, '#FFD93B'], [s3, x0 + w1 + w2, '#FFFFFF']].forEach(([s, x, col]) => { c.strokeText(s, x, 0); c.fillStyle = col; c.fillText(s, x, 0) }); c.restore() }
  else captions(groups, t, KEYS, 1700);
  finish(t);
}
export const cues = [];
