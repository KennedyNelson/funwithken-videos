// 2026-11-08 IG reel "Chakri bargain" (Diwali firecracker stall), Desi Goggle-Eye Toon, ~9 s, with voices.
//  Kalu = KALU CANON (src/toon/kalu.js): square head, black plaid fedora, sunglasses, black suit, deadpan. Shopkeeper: mustache, white cap, tilak, mustard kurta.
//  Beats: Kalu walks up (0-0.9) -> "Bhaiya, chakri kitne ki di?" (1.0) -> shopkeeper proudly shows a chakri "Paanch sau ki." (2.7)
//  -> Kalu, fast and deadpan, "Bhaiya aapki g**nd ki baat nahi kar raha, thoda sasta lagao!" (4.35) -> shopkeeper's reaction is quiet DISAPPOINTMENT (6.65-end), not shock.
//  Shots: W wide 0-2.55 | B shopkeeper CU 2.55-4.25 | K Kalu CU 4.25-6.15 | W wide 6.15-7.0 | B2 shopkeeper CU push-in 7.0-end.
import { W, H, bind, lerp, clamp, easeOut, label, captions, groupWords, finish } from '../toon/toon.js';
import { kpSeated } from '../toon/kp.js';
import { KALU } from '../toon/kalu.js';
const META = await (await fetch('/data/meta.json')).json();
const ENV = await (await fetch('/data/env.json')).json();
export const DUR = META.dur;
let c, groups = [], main;
const KEYS = /^(chakri|sau|paanch|sasta|thoda|g\*\*nd)/i;
export function init(cx, w) { c = main = cx; bind(c); groups = groupWords(w) }
const env = (k, t) => { const a = ENV[k]; return a ? (a[Math.min(a.length - 1, Math.max(0, Math.floor(t * 30)))] || 0) : 0 };
const sm = (u) => { u = clamp(u, 0, 1); return u * u * (3 - 2 * u) };
const seg = (t, a, b) => sm((t - a) / (b - a));
const S = .86, HY = 1215, LIFT = 205, FL = 1440, CT = 1010, KX0 = 330, SX = 770, SH = { near: [-70, -300], far: [78, -312] }, LEN = 146;
const SHOP = { skin: '#C58B5C', top: 'tee', topCol: '#F2A93B', pant: '#F3EFE2', shoe: '#6B4A32', mustache: '#1A1210', topi: true, tilak: true, browCol: '#241410' };
const [K1s, K1e] = [META.lines[0][1], META.lines[0][2]], [S1s, S1e] = [META.lines[1][1], META.lines[1][2]], [K2s, K2e] = [META.lines[2][1], META.lines[2][2]];
// two-bone IK for the STANDING body (hip lifted by LIFT): hand to a WORLD target
function ik(X, flip, side, tx, ty) {
  const lx = flip ? (X - tx) / S : (tx - X) / S, ly = (ty - (HY - LIFT * S)) / S, s0 = SH[side];
  let rx = lx - s0[0], ry = ly - s0[1]; const d0 = Math.hypot(rx, ry) || 1, mx = 2 * LEN * .985; if (d0 > mx) { rx *= mx / d0; ry *= mx / d0 }
  const d = Math.hypot(rx, ry), hh = Math.sqrt(Math.max(0, LEN * LEN - d * d / 4)); let px = -ry / d, py = rx / d; if (py < 0) { px = -px; py = -py }
  return { e: [rx / 2 + px * hh, ry / 2 + py * hh], h: [rx, ry] };
}
const handW = (X, flip, side, a) => [X + (flip ? -1 : 1) * S * (SH[side][0] + a.h[0]), HY - LIFT * S + S * (SH[side][1] + a.h[1])];
const lerpA = (a, b, u) => ({ e: [lerp(a.e[0], b.e[0], u), lerp(a.e[1], b.e[1], u)], h: [lerp(a.h[0], b.h[0], u), lerp(a.h[1], b.h[1], u)], hand: u > .5 ? b.hand : a.hand });
const T_OFF = S1e + .15, UPH = { e: [-6, 70], h: [78, -178], hand: 'rest' };
const HANG = { near: { e: [-4, 150], h: [6, 292], hand: 'rest' }, far: { e: [6, 150], h: [0, 292], hand: 'rest' } };
const blink = (t, ph) => ((t + ph) % 3.4) < .12;
function talkK(t) { const a = env('k', t); return a > .06 ? { mouth: 'talk', open: clamp(a * .8, .12, .42), wide: .16, wideNow: Math.sin(t * 29) * .1 } : null }
function talkS(t) { const a = env('s', t); return a > .06 ? { mouth: 'talk', open: clamp(a * 1.05, .2, .8), wide: .21, wideNow: Math.sin(t * 23) * .25 } : null }
// ---------- acting ----------
function kalu(t) {
  const walk = seg(t, 0, .9); let f = { brow: -.15, look: [.9, 0], mouth: 'flat', wide: .3 }, lean = 0, tilt = 0, near = HANG.near, far = HANG.far;
  const hop = walk < 1 && t > .05 ? Math.abs(Math.sin(t * 13)) * 12 : 0;
  if (t < K1s - .1) { tilt = -.02; far = { e: [20 + Math.sin(t * 13) * 6, 150], h: [-16 + Math.sin(t * 13) * 14, 290], hand: 'rest' } }
  else if (t < K1e + .3) { const sp = talkK(t); f = { brow: .12, browUp: .3, look: [.9, 0], mouth: 'flat', wide: .3, ...(sp || {}) }; tilt = .035 + Math.sin(t * 7) * .01; far = lerpA(HANG.far, { e: [70, 120], h: [150, 200], hand: 'point' }, seg(t, K1s - .1, K1s + .3)) }       // "chakri kitne ki di?" points at the chakri
  else if (t < K2s - .05) { f = { brow: -.2, look: [.9, 0], mouth: 'flat', wide: .3 }; far = lerpA({ e: [70, 120], h: [150, 200], hand: 'point' }, HANG.far, seg(t, K1e + .3, K1e + .7)); tilt = .0 }
  else if (t < K2e + .25) {   // fast bargaining, hands down, sunglasses already off
    const u = t - K2s, sp = talkK(t); f = { brow: -.4, look: [.9, 0], mouth: 'flat', wide: .3, ...(sp || {}) }; tilt = Math.sin(u * 10) * .035; lean = .018;
  } else { f = { brow: -.5, look: [.9, 0], mouth: 'flat', wide: .3 }; tilt = .02; if (t > 8.2) f = { brow: -.3, look: [.9, .05], mouth: 'flat', wide: .3 } }
  // takes his sunglasses off right after the shopkeeper's price: far hand goes up to the face, whips them off, drops to his side holding them
  const up = seg(t, T_OFF - .38, T_OFF), dn = seg(t, T_OFF + .02, T_OFF + .36);
  if (up > 0) near = lerpA(lerpA(near, UPH, up), HANG.near, dn);
  if (t >= T_OFF) f = { ...f, sunOff: true };
  return { face: f, arms: { near, far }, lean, nod: 0, headTilt: tilt, hop, x: lerp(120, KX0, easeOut(walk)) };
}
let chakriHeld = null;
function shop(t) {
  let f = { brow: .1, look: [.9, 0], mouth: 'smile', wide: .22 }, lean = 0, tilt = 0, nod = 0, near = HANG.near, far = HANG.far; chakriHeld = null;
  const hold = { ...ik(SX, true, 'near', SX - 150, 700), hand: 'fist' };
  const up = seg(t, S1s - .35, S1s + .1) * (1 - seg(t, K2e + .1, K2e + 1.1));       // raises a chakri to show it, lowers it slowly after the bargain
  if (t < S1s - .3) { f = { brow: .15, look: [.9, 0], mouth: 'smile', wide: .22 }; tilt = Math.sin(t * 2) * .01; if (blink(t, .7)) f = { ...f, closed: 'flat' } }
  else if (t < K2s - .2) { const sp = talkS(t); f = { brow: -.15, browUp: .4, look: [.9, -.05], mouth: 'smirk', wide: .26, ...(sp || {}) }; tilt = -.05; nod = -.15 + Math.sin(t * 6) * .04; lean = -.02 }   // smug, chin up: "Paanch sau ki."
  else if (t < K2e - .2) { f = { brow: -.05, look: [.9, 0], mouth: 'flat', wide: .22 }; tilt = -.02; nod = -.05 + seg(t, K2s, K2e) * .12 }   // smile slowly dies while he listens
  else { // quiet disappointment: heavy lids, inner brows up, small frown, eyes drop, a slow head shake and a long sigh
    const u = t - K2e, shake = Math.sin(u * 3.2) * .05 * seg(u, .2, .8) * (1 - seg(u, 1.6, 2.2));
    const a2 = env('s', t), sp2 = a2 > .06 ? { mouth: 'talk', open: clamp(a2 * .55, .12, .4), wide: .2, wideNow: Math.sin(t * 17) * .08 } : null;   // his last line is spoken softly, still disappointed
    f = { brow: .65, browUp: -.1, lid: .45 + seg(u, 0, .3) * .1, look: [.7, .55 - seg(u, 1.2, 1.7) * .5], mouth: 'sad', wide: .2, ...(sp2 || {}) }; tilt = .08 + shake; nod = .35 * seg(u, 0, .45) - .05 * seg(u, 1.4, 2); lean = -.03 * seg(u, 0, .5);
    if (blink(t, 1.1) && u > 1) f = { ...f, closed: 'flat', brow: .65 }
  }
  near = lerpA(HANG.near, hold, up); if (up > .02) chakriHeld = handW(SX, true, 'near', near);
  return { face: f, arms: { near, far }, lean, nod, headTilt: tilt };
}
// ---------- props ----------
function chakri(x, y, rx, ry, ph, big = 0) {
  c.save(); c.translate(x, y); c.rotate(big ? ph : 0);
  c.beginPath(); c.ellipse(0, 3, rx * 1.02, ry * 1.05, 0, 0, 7); c.fillStyle = '#C9921F'; c.fill();
  c.beginPath(); c.ellipse(0, 0, rx, ry, 0, 0, 7); c.fillStyle = '#F3C23A'; c.fill(); c.lineWidth = 3.5; c.strokeStyle = '#1E1814'; c.stroke();
  c.beginPath(); for (let i = 0; i <= 90; i++) { const a = i * .24 + (big ? 0 : ph), r = .1 + i / 90 * .86; const px = Math.cos(a) * rx * r, py = Math.sin(a) * ry * r; i ? c.lineTo(px, py) : c.moveTo(px, py) }
  c.lineWidth = Math.max(5, rx * .13); c.strokeStyle = '#D9323B'; c.lineCap = 'round'; c.stroke(); c.lineWidth = Math.max(1.6, rx * .03); c.strokeStyle = '#FFD7A0'; c.stroke();
  c.restore();
}
function diya(x, y, t, k) { c.save(); c.translate(x, y); c.beginPath(); c.moveTo(-26, -14); c.quadraticCurveTo(0, 8, 26, -14); c.quadraticCurveTo(0, -4, -26, -14); c.closePath(); c.fillStyle = '#B5532A'; c.fill(); c.lineWidth = 3.5; c.strokeStyle = '#1E1814'; c.stroke();
  const fl = 1 + Math.sin(t * 25 + k) * .1; c.beginPath(); c.ellipse(0, -28, 8 * fl, 17 * fl, 0, 0, 7); c.fillStyle = '#FFD56A'; c.fill(); c.beginPath(); c.ellipse(0, -24, 4, 9, 0, 0, 7); c.fillStyle = '#FF8A2A'; c.fill(); c.restore() }
// ---------- set ----------
const PAL = ['#E43D30', '#2FA84F', '#F5B71A', '#2E6FD6', '#E85DA5', '#F57C20', '#7A3FC4'];
function paintBackdrop() {
  const g = document.createElement('canvas'); g.width = 2000; g.height = 2400; const gc = g.getContext('2d'), keep = c; c = gc; c.translate(300, 300);
  let sg = c.createLinearGradient(0, -300, 0, 1440); sg.addColorStop(0, '#3E5C9E'); sg.addColorStop(.3, '#B7708C'); sg.addColorStop(.52, '#F4A56B'); sg.addColorStop(.7, '#FFD08A'); sg.addColorStop(1, '#8A5A44'); c.fillStyle = sg; c.fillRect(-300, -300, 2000, 2400);
  for (let i = 0; i < 9; i++) { const bx = -260 + i * 150, bh = 260 + (i * 71 % 190); c.fillStyle = ['#6B4358', '#5A3A55', '#7A4B5A'][i % 3]; c.fillRect(bx, 1040 - bh, 130, bh + 400); for (let k = 0; k < 6; k++) { c.fillStyle = (i + k) % 3 ? '#FFC96A' : '#3A2A40'; c.fillRect(bx + 16 + (k % 3) * 38, 1040 - bh + 24 + Math.floor(k / 3) * 56, 22, 30) } }
  for (let i = 0; i < 40; i++) { c.globalAlpha = .55; c.fillStyle = ['#FFD27A', '#FF8F4D', '#FFF0B0', '#FF6F91', '#9FE2FF'][i % 5]; c.beginPath(); c.arc(-250 + (i * 97 % 1450), 300 + (i * 61 % 700), 10 + i % 5 * 5, 0, 7); c.fill() } c.globalAlpha = 1;
  const out = document.createElement('canvas'); out.width = 2000; out.height = 2400; const oc = out.getContext('2d'); oc.filter = 'blur(10px)'; oc.drawImage(g, 0, 0); c = oc; c.translate(300, 300); c.filter = 'blur(4px)';
  // stall: back wall, shelves with firecracker boxes, awning, garlands
  c.fillStyle = '#F0D6A2'; c.fillRect(520, 280, 1000, 1200);
  c.fillStyle = 'rgba(120,70,30,.12)'; c.fillRect(520, 280, 1000, 40);
  for (let row = 0; row < 3; row++) {
    const y = 600 + row * 200; c.fillStyle = '#7A4A28'; c.fillRect(520, y, 1000, 16);
    for (let i = 0; i < 12; i++) { const k = (i + row) % 3, x = 560 + i * 82, col = PAL[(i * 3 + row * 2) % 7];
      if (k === 0) { c.fillStyle = col; c.fillRect(x, y - 80, 70, 80); c.fillStyle = '#FFE9A8'; c.fillRect(x, y - 52, 70, 18); c.fillStyle = '#222'; c.fillRect(x + 8, y - 30, 22, 22) }
      else if (k === 1) { c.fillStyle = col; c.beginPath(); c.moveTo(x + 10, y - 82); c.lineTo(x + 60, y - 82); c.lineTo(x + 70, y); c.lineTo(x, y); c.closePath(); c.fill(); c.fillStyle = '#FFE9A8'; c.fillRect(x + 6, y - 56, 58, 14) }
      else { c.fillStyle = col; c.fillRect(x + 28, y - 120, 14, 120); c.fillStyle = '#F5F5F0'; c.beginPath(); c.moveTo(x + 24, y - 120); c.lineTo(x + 46, y - 120); c.lineTo(x + 35, y - 156); c.closePath(); c.fill() } }
  }
  c.fillStyle = '#C9372A'; c.fillRect(500, 280, 1040, 60); for (let i = 0; i < 17; i++) { c.fillStyle = i % 2 ? '#F7F3E8' : '#C9372A'; c.beginPath(); c.moveTo(500 + i * 61, 340); c.lineTo(500 + i * 61 + 61, 340); c.quadraticCurveTo(500 + i * 61 + 30, 400, 500 + i * 61, 340); c.fill() }
  for (const [y0, sag, cols] of [[420, 60, ['#FF9F1C', '#FFC93C', '#FF7B00']], [470, 40, ['#FFC93C', '#E8311A', '#FF9F1C']]]) for (let i = 0; i <= 40; i++) { const u = i / 40; c.fillStyle = cols[i % 3]; c.beginPath(); c.arc(520 + u * 1000, y0 + Math.sin(u * Math.PI) * sag, 13, 0, 7); c.fill() }
  for (let i = 0; i <= 24; i++) { const u = i / 24; c.fillStyle = ['#FFD27A', '#FF5E5E', '#7AE0FF', '#9BFF7A'][i % 4]; c.beginPath(); c.arc(520 + u * 1000, 520 + Math.sin(u * Math.PI) * 30, 9, 0, 7); c.fill() }
  c.fillStyle = '#E63B2E'; c.beginPath(); c.roundRect(588, 520, 60, 96, 20); c.fill(); c.fillStyle = '#FFD34D'; c.fillRect(592, 514, 52, 10); c.fillRect(592, 612, 52, 10);
  c.fillStyle = '#B58A62'; c.fillRect(-300, FL, 2000, 600);   // street
  c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(-300, FL, 2000, 14);
  c = keep; return out;
}
let BG = null;
function drawBackdrop(t) {
  if (!BG) BG = paintBackdrop();
  c.drawImage(BG, -300, -300);
  for (const [t0, x, y, col] of [[.3, 150, 480, '#FFD27A'], [2.4, 330, 420, '#FF6F91'], [4.9, 120, 540, '#9FE2FF'], [7.3, 250, 450, '#FFE08A']]) { const u = (t - t0) / 1.2; if (u > 0 && u < 1) { c.save(); c.translate(x, y); c.globalAlpha = (1 - u) * .85; c.strokeStyle = col; c.lineWidth = 7; c.lineCap = 'round'; const R = 40 + u * 150; for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283; c.beginPath(); c.moveTo(Math.cos(a) * R * .55, Math.sin(a) * R * .55); c.lineTo(Math.cos(a) * R, Math.sin(a) * R + u * u * 40); c.stroke() } c.restore() } }
}
function counter(t) {
  c.save(); c.fillStyle = '#B0743F'; c.fillRect(540, CT, 1000, FL - CT); for (let i = 0; i < 6; i++) { c.fillStyle = i % 2 ? '#A66A38' : '#BD7F48'; c.fillRect(540, CT + 12 + i * 70, 1000, 66); c.fillStyle = '#6B4020'; c.fillRect(540, CT + 12 + i * 70 + 66, 1000, 4) }
  c.lineWidth = 5; c.strokeStyle = '#1E1814'; c.strokeRect(540, CT, 1000, FL - CT); c.fillStyle = '#8A5430'; c.fillRect(520, CT - 24, 1040, 30); c.strokeRect(520, CT - 24, 1040, 30); c.fillStyle = 'rgba(255,220,170,.25)'; c.fillRect(530, CT - 22, 1020, 5); c.restore();
  // chakri spinning on the counter top (seen from a low angle: a squashed coil), diyas, sparkler boxes
  if (!(chakriHeld && false)) chakri(640, CT - 36, 76, 20, t * 7);
  diya(1000, CT - 14, t, 0); diya(1090, CT - 14, t, 2);
  for (let i = 0; i < 3; i++) { c.fillStyle = PAL[i + 1]; c.fillRect(1170 + i * 4, CT - 38 - i * 24, 120, 24); c.lineWidth = 3.5; c.strokeStyle = '#1E1814'; c.strokeRect(1170 + i * 4, CT - 38 - i * 24, 120, 24) }
}
function overShoulder(kind) {
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.filter = 'blur(13px)';
  if (kind === 'kalu') { c.fillStyle = '#16161B'; c.beginPath(); c.roundRect(-160, 760, 420, 1000, 150); c.fill(); c.fillStyle = '#D8D8DC'; c.beginPath(); c.ellipse(20, 360, 280, 66, -.06, 0, 7); c.fill(); c.fillStyle = '#4B4D55'; for (let i = 0; i < 8; i++) c.fillRect(-250 + i * 56, 316 + (i & 1) * 22, 30, 24); c.fillStyle = '#16161B'; c.beginPath(); c.roundRect(-120, 150, 330, 240, 90); c.fill() }
  else { c.fillStyle = '#F2A93B'; c.beginPath(); c.roundRect(800, 780, 460, 1000, 150); c.fill(); c.fillStyle = '#F4F1E8'; c.beginPath(); c.roundRect(880, 220, 300, 200, 100); c.fill(); c.fillStyle = '#C58B5C'; c.beginPath(); c.roundRect(870, 400, 330, 360, 120); c.fill() }
  c.restore();
}
// ---------- draw ----------
function sunHeld(x, y) {   // the sunglasses in his hand
  c.save(); c.translate(x + 6, y + 4); c.rotate(-.5); for (const q of [-1, 1]) { c.beginPath(); c.roundRect(q * 22 - 19, -13, 38, 26, 9); c.fillStyle = '#0B0B0E'; c.fill(); c.lineWidth = 3; c.strokeStyle = '#050506'; c.stroke() }
  c.fillStyle = '#050506'; c.fillRect(-6, -5, 12, 4); c.restore();
}
export function draw(t) {
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
  let shot = 'W', z = 1.38 + t * .006, cx = 540, cy = 1010;
  const B0 = S1s - .4, B1 = S1e - .2;
  if (t >= B0 && t < B1) { shot = 'B'; const u = (t - B0) / (B1 - B0); z = 2.15 + u * .1; cx = 735 + u * 6; cy = 790 }
  else if (t >= B1) { shot = 'W2'; const u = (t - B1) / (DUR - B1); z = 1.36 + u * .12; cx = 540 + u * 20; cy = 1000 - u * 40 }   // full scene, both characters, to the end
  c.translate(W / 2, H / 2); c.scale(z, z); c.translate(-cx, -cy);
  drawBackdrop(t);
  const ks = kalu(t), ss = shop(t);
  kpSeated({ ...SHOP, x: SX, y: HY, s: S, flip: true, stand: 1, ...ss });
  counter(t);
  if (chakriHeld) { const [hx, hy] = chakriHeld; chakri(hx - 6, hy - 70, 62, 62, t * 6, 1) }
  kpSeated({ ...KALU, x: ks.x, y: HY, s: S, stand: 1, ...ks, hold: undefined });
  if (t >= T_OFF) { const [gx, gy] = handW(ks.x, false, 'near', ks.arms.near); sunHeld(gx, gy) }
  if (shot === 'B') overShoulder('kalu'); else if (shot === 'K') overShoulder('shop');
  c.restore();
  label([['POV: ', '#111'], ['bargaining', '#D7261E'], [' on Diwali', '#111']], W / 2, 150, 50);
  captions(groups, t, KEYS, 1690); finish(t);
}
export const cues = [];
