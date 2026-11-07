// 2026-11-07 IG reel "Avg conversation between boys" (gaali = kavita). Owner's interview clip re-staged with OUR characters
// (Kalu + friend, not lookalikes of the people in the clip), invented poster, Polished Desi Toon cel-lit room.
// Built on the clip's own timeline; the owner lays the original audio on top.
import { W, H, bind, ctx, lerp, clamp, ease, easeOut, back, pr, label, captions, groupWords, finish, poly, ell, fillEll, fillPoly, line, rrect, dark, light, shadowBlob } from '../toon/toon.js';
import { person, head } from '../toon/people.js';
const META = await (await fetch('/data/meta.json')).json();
const ENV = await (await fetch('/data/env.json')).json();
export const DUR = META.dur;
let c, groups = [];
const KEYS = /^(gaali|gaaliyan|kavita|lay|maatraayein|emotion|M\*darch\*d\.?|Bh\*sdi|samaaj|pasandida)/i;
export function init(cx, w) { c = cx; bind(c); groups = groupWords(w) }
const env = (k, t) => { const a = ENV[k]; return a ? (a[Math.min(a.length - 1, Math.max(0, Math.floor(t * 30)))] || 0) : 0 };
const talk = (k, t, base = 'smile', big = 'open') => { const a = env(k, t); return a > .12 ? { mouth: big, open: clamp(a * 1.3, .3, 1) } : { mouth: base } };
const blink = (t, ph = 0) => ((t + ph) % 3.4) < .11 ? .95 : 0;
const cam = (z, x, y, sh, t, fn) => { c.save(); const dx = sh ? Math.sin(t * 61) * sh : 0, dy = sh ? Math.cos(t * 83) * sh : 0; c.translate(W / 2 + dx, H / 2 + dy); c.scale(z, z); c.translate(-x, -y); fn(); c.restore() };
// ---------- cast (our own) ----------
const KALU = { skin: '#7B4A2F', shirt: '#2F6FA8', pant: '#2B3A55', hair: 'quiff', shoe: 'sneaker', shoeCol: '#EDEDED', collar: '#245886', stubble: true };
const DOST = { skin: '#C08A5E', shirt: '#F4F4F0', pant: '#5C6B7A', hair: 'sidepart', hairCol: '#3B2A20', shoe: 'chappal', collar: '#E2E2DC', specs: true };
const FLOOR = 1700, KX = 300, FX = 790, SS = .66;
// ---------- set: a warm interview room ----------
let roomC = null;
function roomLayer() {
  if (roomC) return roomC; const cv = document.createElement('canvas'); cv.width = 1600; cv.height = 2400; const g = cv.getContext('2d'); const prev = c; bind(g); c = g;
  c.translate(260, 0);
  // wall + wainscot
  const wg = c.createLinearGradient(0, 0, 0, FLOOR); wg.addColorStop(0, '#F3E3C4'); wg.addColorStop(1, '#E9D2A8'); c.fillStyle = wg; c.fillRect(-300, 0, 1700, FLOOR);
  c.fillStyle = '#8E5B34'; c.fillRect(-300, 1180, 1700, 520); c.fillStyle = '#7A4C2A'; for (let i = 0; i < 16; i++) c.fillRect(-300 + i * 110, 1180, 6, 520);
  c.fillStyle = '#B07A4A'; c.fillRect(-300, 1166, 1700, 22); c.fillStyle = 'rgba(0,0,0,.15)'; c.fillRect(-300, 1188, 1700, 10);
  // window with sheer curtains (left) and soft light shaft
  poly([[-180, 260], [140, 260], [140, 900], [-180, 900]], '#CFE8F5', () => { fillPoly([[-180, 260], [-60, 260], [-140, 900], [-180, 900]], 'rgba(255,255,255,.5)'); line([[-20, 260], [-20, 900]], 8, '#B9C9D2', false); line([[-180, 580], [140, 580]], 8, '#B9C9D2', false) }, 6);
  for (const [x0, dir] of [[-200, 1], [150, -1]]) poly([[x0, 230], [x0 + dir * 110, 230], [x0 + dir * 80, 960], [x0 - dir * 20, 980]], '#F6F0E6', () => { for (let i = 0; i < 4; i++) line([[x0 + dir * (18 + i * 22), 240], [x0 + dir * (10 + i * 20), 970]], 3, '#E2D8C8', false) }, 4);
  c.save(); c.globalAlpha = .18; c.fillStyle = '#FFF6DE'; c.beginPath(); c.moveTo(-180, 260); c.lineTo(140, 260); c.lineTo(620, FLOOR + 200); c.lineTo(120, FLOOR + 200); c.closePath(); c.fill(); c.restore();
  line([[-260, 225], [180, 225]], 10, '#6B4A30', false);
  // wall lamp (right)
  poly([[1040, 420], [1120, 420], [1140, 520], [1020, 520]], '#F7E7B5', () => fillPoly([[1080, 420], [1120, 420], [1140, 520], [1090, 520]], '#E8D08C'), 5); line([[1080, 520], [1080, 560]], 6, '#555', false);
  c.save(); const lg = c.createRadialGradient(1080, 540, 10, 1080, 540, 380); lg.addColorStop(0, 'rgba(255,230,160,.45)'); lg.addColorStop(1, 'rgba(255,230,160,0)'); c.fillStyle = lg; c.fillRect(700, 160, 760, 760); c.restore();
  // plant in the corner
  poly([[1060, 1560], [1180, 1560], [1160, 1700], [1080, 1700]], '#C46A3C', () => fillPoly([[1120, 1560], [1180, 1560], [1160, 1700], [1120, 1700]], '#A85730'), 5);
  for (let i = 0; i < 7; i++) { const a = -2.6 + i * .35; poly([[1120, 1560], [1120 + Math.cos(a) * 120, 1560 + Math.sin(a) * 240 - 40], [1120 + Math.cos(a) * 60 + 18, 1560 + Math.sin(a) * 120]], i % 2 ? '#4E9A57' : '#5DAE62', null, 4) }
  // wooden floor
  const fg = c.createLinearGradient(0, FLOOR, 0, 2400); fg.addColorStop(0, '#B07445'); fg.addColorStop(1, '#8A552F'); c.fillStyle = fg; c.fillRect(-300, FLOOR, 1700, 800);
  c.strokeStyle = 'rgba(70,35,15,.35)'; c.lineWidth = 3; for (let i = 0; i < 9; i++) { c.beginPath(); c.moveTo(-300, FLOOR + 30 + i * 70); c.lineTo(1400, FLOOR + 30 + i * 70); c.stroke() }
  for (let r = 0; r < 9; r++) for (let k = 0; k < 6; k++) { const x = -300 + ((k * 330 + r * 170) % 1700); c.beginPath(); c.moveTo(x, FLOOR + 30 + r * 70); c.lineTo(x, FLOOR + 100 + r * 70); c.stroke() }
  line([[-300, FLOOR], [1400, FLOOR]], 6, '#5A3418', false);
  c = prev; bind(prev); roomC = cv; return cv;
}
// invented film poster: "SANSKAARI", a hand-folded good boy, sun rays (the irony is the gag)
function poster(x, y, s, t, shock = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  shadowBlob(0, 330, 200, 16, .25);
  rrect(-170, -300, 340, 620, 8, '#2A3E8C', null, 6);
  rrect(-155, -285, 310, 590, 4, '#FFD23F', () => { c.save(); for (let i = 0; i < 18; i++) { const a = i / 18 * 6.283 + t * .1; c.fillStyle = i % 2 ? '#FFC107' : '#FFE27A'; c.beginPath(); c.moveTo(0, -60); c.arc(0, -60, 520, a, a + .17); c.closePath(); c.fill() } c.restore() }, 4);
  // the sanskaari hero, hands folded
  c.save(); c.translate(0, 80); c.scale(.62, .62);
  poly([[-120, -40], [120, -40], [150, 260], [-150, 260]], '#F6F2E8', () => fillPoly([[40, -40], [150, -40], [150, 260], [60, 260]], '#E2DCCF'), 5);
  poly([[-30, 60], [0, -10], [30, 60], [0, 120]], '#C98B5C', null, 4);
  c.restore();
  c.save(); c.translate(0, 180 - 440 * .62 + 82); c.scale(.62, .62); c.translate(0, 640);
  head({ skin: '#C98B5C', hair: 'sidepart', hairCol: '#222', face: shock ? { eye: 1.35, pupil: .22, brow: 1, mouth: 'shout', open: 1 } : { closed: true, brow: .2, mouth: 'smile', blush: true } });
  c.restore();
  c.font = '900 64px Inter'; c.textAlign = 'center'; c.lineJoin = 'round'; c.strokeStyle = '#2A3E8C'; c.lineWidth = 12; c.strokeText('SANSKAARI', 0, 240); c.fillStyle = '#E8392B'; c.fillText('SANSKAARI', 0, 240);
  c.font = '800 22px Inter'; c.fillStyle = '#2A3E8C'; c.fillText('IN CINEMAS SOON', 0, 280);
  c.restore();
}
// red plastic chair (front view) drawn behind a seated person at (x, floor)
function chair(x, y, s) {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (const q of [-1, 1]) { line([[q * 120, -250], [q * 140, 0]], 14, '#9E1F1F', false); line([[q * 96, -250], [q * 70, -6]], 12, '#8A1A1A', false) }
  poly([[-150, -620], [150, -620], ['q', 170, -620, 166, -580], [150, -300], [-150, -300], [-166, -580], ['q', -170, -620, -150, -620]], '#D33A2C', () => { fillPoly([[60, -620], [170, -620], [150, -300], [70, -300]], '#B42C21'); for (let i = 0; i < 4; i++) fillPoly([[-80 + i * 50, -560], [-60 + i * 50, -560], [-60 + i * 50, -380], [-80 + i * 50, -380]], '#B42C21') }, 5);
  poly([[-170, -300], [170, -300], [180, -240], [-180, -240]], '#E04A3A', () => fillPoly([[-180, -262], [180, -262], [180, -240], [-180, -240]], '#B42C21'), 5);
  c.restore();
}
function lapelMic(x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); rrect(-7, -14, 14, 24, 4, '#1b1b1b', null, 2); c.restore() }
// ---------- characters with gestures ----------
const A = {
  rest: [[-20, 130, -10, 230], [20, 130, 10, 230]],
  headScratchL: [[-90, -70, -20, -190], [20, 130, 10, 230]],
  explainR: [[-20, 130, -10, 230], [70, 70, 150, -10]],
  bothOpen: [[-70, 80, -150, 0], [70, 80, 150, 0]],
  chin: [[-20, 130, -10, 230], [10, 70, -70, -50]],
  heart: [[-20, 130, -10, 230], [0, 110, -120, 60]],
  clap: (t) => { const u = Math.abs(Math.sin(t * 9)); return [[-50, 110, 80 - 30 * u, 120], [50, 110, -80 + 30 * u, 120]] },
  raise: [[-20, 130, -10, 230], [60, -40, 110, -190]],
  laugh: [[-60, 110, 40, 180], [60, 110, -40, 180]],
};
function kalu(t, o = {}) { const p = { ...KALU, x: KX, y: FLOOR, s: SS, sit: true, noShadow: true, arms: A.rest, ...o }; chair(p.x, p.y, p.s); person(p); lapelMic(p.x - 40 * p.s, p.y - 470 * p.s, p.s) }
function dost(t, o = {}) { const p = { ...DOST, x: FX, y: FLOOR, s: SS, sit: true, noShadow: true, flip: true, arms: A.rest, ...o }; chair(p.x, p.y, p.s); person(p); lapelMic(p.x + 40 * p.s, p.y - 470 * p.s, p.s) }
function room(t, posterShock = 0) { const r = roomLayer(); c.drawImage(r, -260, 0); poster(545, 980, .78, t, posterShock) }
// ---------- shots ----------
const SC = []; const at = (a, b, fn) => SC.push([a, b, fn]);
// 1. establishing two-shot, slow push; Kalu opens with the big philosophy
at(0, 3.58, t => cam(lerp(1.28, 1.4, ease(pr(t, 0, 3.58))), 545, 1330, 0, t, () => { room(t);
  kalu(t, { arms: A.headScratchL, tilt: -.05, face: { look: [.8, -.1], brow: .5, lid: blink(t), ...talk('k', t) } });
  dost(t, { face: { look: [.8, 0], brow: .1, mouth: 'smile', lid: blink(t, 1) } }) }));
// 2. Kalu medium: the question, hand waving
at(3.58, 7.98, t => cam(lerp(2.0, 2.12, pr(t, 3.58, 7.98)), KX + 20, 1250, 0, t, () => { room(t);
  kalu(t, { arms: t < 5.8 ? A.explainR : A.bothOpen, tilt: Math.sin(t * 2) * .04, face: { look: [.9, -.1], brow: .6, blush: false, lid: blink(t), ...talk('k', t) } }) }));
// 3. Dost medium: thinking hard, chin rub, eyes narrowing as he searches for the perfect word
at(7.98, 11.85, t => cam(lerp(2.0, 2.25, ease(pr(t, 7.98, 11.85))), FX - 20, 1250, 0, t, () => { room(t);
  dost(t, { arms: A.chin, tilt: .06, face: { look: [.6, -.5], brow: .9, lid: lerp(.1, .45, pr(t, 8, 11.6)), mouth: 'tight' } }) }));
// 4. punch-in: the answer lands, calm and confident
at(11.85, 13.82, t => cam(lerp(2.9, 3.1, easeOut(pr(t, 11.85, 13.82))), FX - 10, 1130, t < 12.6 ? 2 : 0, t, () => { room(t);
  dost(t, { arms: A.rest, face: { look: [.9, 0], brow: -.2, lid: .2, ...talk('f', t, 'grin', 'open') } }) }));
// 5. Kalu delighted, slow clap: "poori kavita hai"
at(13.82, 16.58, t => cam(2.1, KX + 10, 1230, 0, t, () => { room(t);
  kalu(t, { arms: A.clap(t), lean: .05, face: { look: [.8, 0], brow: .8, eye: 1.15, blush: true, ...talk('k', t, 'bigsmile', 'open') } }) }));
// 6. Dost explains like a professor of gaali, eyes closed in bliss
at(16.58, 21.54, t => cam(lerp(2.0, 2.15, pr(t, 16.58, 21.54)), FX - 20, 1240, 0, t, () => { room(t);
  dost(t, { arms: t < 19 ? A.explainR : A.bothOpen, tilt: Math.sin(t * 1.6) * .05, face: { closed: t > 18.6 && t < 20.2, look: [.8, -.2], brow: .4, ...talk('f', t, 'smile', 'open') } }) }));
// 7. POET MODE cutaway: spotlight, petals falling, the mushaira of maa-behen
function petals(t) { for (let i = 0; i < 26; i++) { const x = (i * 97 + Math.sin(t + i) * 40) % 1080, y = ((t * 160 + i * 211) % 2100) - 100; c.save(); c.translate(x, y); c.rotate(t * 2 + i); fillEll(0, 0, 16, 9, i % 3 ? '#F06A8E' : '#FFD1DC'); c.restore() } }
at(21.54, 24.38, t => { c.fillStyle = '#4A1E2E'; c.fillRect(0, 0, W, H);
  const g = c.createRadialGradient(540, 900, 40, 540, 900, 760); g.addColorStop(0, 'rgba(255,224,170,.85)'); g.addColorStop(1, 'rgba(255,224,170,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(380, 0); c.lineTo(700, 0); c.lineTo(1000, 1900); c.lineTo(80, 1900); c.closePath(); c.fill();
  cam(lerp(1.05, 1.18, pr(t, 21.54, 24.38)), 540, 1150, 0, t, () => { c.fillStyle = '#7A2E3E'; c.fillRect(-500, 1700, 2100, 800); fillEll(540, 1700, 330, 40, 'rgba(255,224,170,.45)');
    person({ ...DOST, x: 540, y: 1700, s: .8, arms: A.raise, face: { closed: true, brow: .5, ...talk('f', t, 'smile', 'open') }, tilt: -.08 }) });
  petals(t) });
// 8. MACRO insert: counting the maatraayein on his fingers, each beat glows
function bigHand(n, t) { c.save(); c.translate(540, 1150); const sk = DOST.skin;
  poly([[-150, 150], [150, 150], [175, 460], [-175, 460]], DOST.shirt, () => fillPoly([[50, 150], [175, 150], [175, 460], [70, 460]], '#DDDDD6'), 6);
  const F = [[-96, -60, -.12, 150], [-32, -80, -.04, 175], [32, -80, .04, 170], [96, -62, .12, 140]];
  F.forEach(([x, y, a, len], i) => { const up = i < n; c.save(); c.translate(x, y); c.rotate(a); const L = up ? len : 46; rrect(-30, -L, 60, L + 70, 30, sk, () => fillPoly([[8, -L], [40, -L], [40, 70], [8, 70]], dark(sk, .14)), 6); if (up) { line([[-14, -L * .5], [14, -L * .5]], 4, dark(sk, .3), false); rrect(-18, -L + 8, 36, 30, 13, light(sk, .3), null, 3) } c.restore() });
  poly([[-132, -50], [132, -50], ['q', 150, 60, 120, 150], [-120, 150], ['q', -150, 60, -132, -50]], sk, () => fillEll(70, 60, 80, 110, dark(sk, .14)), 6);
  const th = n >= 5; c.save(); c.translate(-128, 40); c.rotate(th ? -.9 : -.2); rrect(-30, -(th ? 120 : 60), 60, th ? 150 : 90, 30, sk, () => fillPoly([[8, -120], [40, -120], [40, 40], [8, 40]], dark(sk, .14)), 6); c.restore();
  c.restore() }
at(24.38, 26.86, t => { c.fillStyle = '#E9D2A8'; c.fillRect(0, 0, W, H); const r = roomLayer(); c.save(); c.filter = 'blur(18px)'; c.drawImage(r, -260 - 200, -300, 2000, 3000); c.restore();
  const n = 1 + Math.min(4, Math.floor(pr(t, 24.38, 26.7) * 5)), ph = (pr(t, 24.38, 26.7) * 5) % 1;
  cam(lerp(1.0, 1.1, pr(t, 24.38, 26.86)), 540, 1050, 0, t, () => { bigHand(n, t); c.save(); c.globalAlpha = (1 - ph) * .7; c.strokeStyle = '#FFD93B'; c.lineWidth = 10; c.beginPath(); c.arc(540, 820, 120 + ph * 160, 0, 7); c.stroke(); c.restore() }) });
// 9. "emotion bhi dekho": hand on heart, a single proud tear; Kalu moved in the background
at(26.86, 30.14, t => cam(lerp(1.28, 1.4, pr(t, 26.86, 30.14)), 600, 1250, 0, t, () => { room(t);
  kalu(t, { tilt: Math.sin(t * 3) * .05, face: { look: [.9, 0], brow: .9, tears: true, mouth: 'wobble' } });
  dost(t, { arms: A.heart, tilt: .08, face: { closed: true, brow: .9, tears: t > 28, ...talk('f', t, 'smile', 'open') } }) }));
// 10. Kalu wipes a tear: truly the poet of our generation
at(30.14, 32.18, t => cam(2.3, KX + 10, 1210, 0, t, () => { room(t);
  kalu(t, { arms: [[-20, 130, -10, 230], [10, 60, -70, -80]], face: { look: [.6, .2], brow: 1, tears: true, mouth: 'wobble', lid: .25 } }) }));
// 11. Dost asks Pandit ji for his favourite; Kalu already laughing
at(32.18, 36.06, t => cam(lerp(2.0, 2.1, pr(t, 32.18, 36.06)), FX - 20, 1250, 0, t, () => { room(t);
  dost(t, { arms: A.explainR, face: { look: [.9, 0], brow: .3, ...talk('f', t, 'grin', 'open') } }) }));
at(36.06, 38.35, t => cam(lerp(1.9, 2.05, pr(t, 36.06, 38.35)), KX + 20, 1240, 0, t, () => { room(t);
  kalu(t, { arms: A.laugh, tilt: Math.sin(t * 14) * .05, hop: Math.abs(Math.sin(t * 14)) * 6, face: { closed: true, brow: .4, mouth: 'bigsmile', blush: true } }) }));
// 12. the answer, delivered with pride; whip punch-in; the poster's sanskaari hero is SHOOK
at(38.35, 40.35, t => cam(lerp(2.6, 3.0, easeOut(pr(t, 38.35, 40.35))), KX + 10, 1130, t < 38.7 ? 3 : 0, t, () => { room(t);
  kalu(t, { arms: A.explainR, tilt: -.06, face: { look: [.9, -.1], brow: -.3, lid: .15, ...talk('k', t, 'grin', 'open') } }) }));
at(40.35, DUR + .1, t => cam(lerp(2.2, 2.6, easeOut(pr(t, 40.35, DUR))), 545, 960, 4, t, () => { room(t, 1) }));
export function draw(t) {
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = '#E9D2A8'; c.fillRect(0, 0, W, H);
  for (const [a, b, fn] of SC) if (t >= a && t < b) { fn(t); break }
  c.restore();
  label([['Avg conversation between ', '#111'], ['boys', '#D7261E']], W / 2, 260, 56);
  captions(groups, t, KEYS, 1640); finish(t);
}
export const cues = [];
