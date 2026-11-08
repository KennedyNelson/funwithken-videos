// 2026-11-08 IG reel "I am Kala" (cafe scene), Desi Goggle-Eye Toon. Replicates the owner's clip beat for beat with OUR characters:
//  Kalu (main) = brown, black suit + tie, plaid fedora, black sunglasses, deadpan, never laughs; Battery = cream suit, clear specs, long centre-parted hair.
//  Shots follow the clip: wide two-shot (0-6.77), close-up Battery over Kalu's shoulder (6.77-11.33), close-up Kalu over Battery's shoulder (11.33-15.31).
//  Actions: Battery stirs his coffee, sips it, then eyes Kalu; Kalu stays dead serious, says the line, then holds his cup deadpan. Lip-sync = clip's speech envelope.
import { W, H, bind, ctx, lerp, clamp, easeOut, pr, label, captions, groupWords, finish } from '../toon/toon.js';
import { kpSeated } from '../toon/kp.js';
const META = await (await fetch('/data/meta.json')).json();
const ENV = await (await fetch('/data/env.json')).json();
export const DUR = META.dur;
let c, groups = [];
const KEYS = /^(hello|kala|gora|andha|coffee|karta)/i;
function retime(w) {   // "Dikhta nahi coffee pi raha hoon" starts after the pause at 13.1-13.7
  const out = w.filter(x => x.line !== 5), L = w.filter(x => x.line === 5);
  const spread = (ws, a, b) => { const g = ws.map(x => x.w.replace(/\W/g, '').length + 1.5), T = g.reduce((p, q) => p + q, 0); let cu = 0; ws.forEach((x, i) => { const s0 = a + cu / T * (b - a); cu += g[i]; out.push({ ...x, s: +s0.toFixed(3), e: +(a + cu / T * (b - a)).toFixed(3) }) }) };
  spread(L.slice(0, 3), 12.42, 13.1); spread(L.slice(3), 13.7, 14.85); return out;
}
export function init(cx, w) { c = cx; bind(c); groups = groupWords(retime(w)) }
const env = (k, t) => { const a = ENV[k]; return a ? (a[Math.min(a.length - 1, Math.max(0, Math.floor(t * 30)))] || 0) : 0 };
const nz = (t, k) => Math.sin(t * 17.3 + k) * .5 + Math.sin(t * 9.1 + k * 2) * .5;
const sm = (u) => { u = clamp(u, 0, 1); return u * u * (3 - 2 * u) };
const seg = (t, a, b) => sm((t - a) / (b - a));
const blink = (t, ph) => ((t + ph) % 3.7) < .12;
// ---------- characters ----------
const KALU = { skin: '#8A5536', head: 'square', hat: true, hatCol: '#15151A', hatChk: '#4C4E5A', hatBand: '#3A3A44', sun: true, top: 'shirt', suit: true, topCol: '#1D1D23', tie: '#2A2A33', pant: '#17171B', shoe: '#0E0E10', stubble: true };
const BATT = { skin: '#C9976A', hair: 'mane', hairCol: '#3A2B22', specs: 'clear', top: 'shirt', suit: true, topCol: '#EDE5D2', tie: '#B3A878', tieStripe: '#6E6745', pant: '#E3DAC4', shoe: '#6B4A32' };
const S = .86, HY = 1180, TT = 1075, BX = 340, KX = 740, SH = { near: [-70, -300], far: [78, -312] }, LEN = 146;
// two-bone IK in the body's local frame: hand to a WORLD target
function ik(X, flip, side, tx, ty) {
  const lx = flip ? (X - tx) / S : (tx - X) / S, ly = (ty - HY) / S, s0 = SH[side];
  let rx = lx - s0[0], ry = ly - s0[1]; const d0 = Math.hypot(rx, ry) || 1, mx = 2 * LEN * .985; if (d0 > mx) { rx *= mx / d0; ry *= mx / d0 }
  const d = Math.hypot(rx, ry), hh = Math.sqrt(Math.max(0, LEN * LEN - d * d / 4)); let px = -ry / d, py = rx / d; if (py < 0) { px = -px; py = -py }
  return { e: [rx / 2 + px * hh, ry / 2 + py * hh], h: [rx, ry] };
}
const lerpA = (a, b, u) => ({ e: [lerp(a.e[0], b.e[0], u), lerp(a.e[1], b.e[1], u)], h: [lerp(a.h[0], b.h[0], u), lerp(a.h[1], b.h[1], u)] });
const handW = (X, flip, side, a) => [X + (flip ? -1 : 1) * S * (SH[side][0] + a.h[0]), HY + S * (SH[side][1] + a.h[1])];
// ---------- props ----------
function cup(x, y, sc = 1, rot = 0, steam = 0, t = 0) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(sc, sc);
  c.lineWidth = 4.5; c.strokeStyle = '#1E1814'; c.lineJoin = 'round';
  c.beginPath(); c.ellipse(46, -30, 17, 21, 0, 0, 7); c.stroke();                                   // handle
  c.beginPath(); c.moveTo(-36, -54); c.lineTo(36, -54); c.quadraticCurveTo(34, 0, 0, 2); c.quadraticCurveTo(-34, 0, -36, -54); c.closePath(); c.fillStyle = '#F6F4EF'; c.fill(); c.stroke();
  c.save(); c.clip(); c.fillStyle = 'rgba(0,0,0,.08)'; c.fillRect(8, -60, 40, 70); c.restore();
  c.beginPath(); c.ellipse(0, -54, 36, 9, 0, 0, 7); c.fillStyle = '#5A3823'; c.fill(); c.stroke();
  if (steam) { c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineWidth = 4; c.lineCap = 'round'; for (const k of [-14, 0, 14]) { c.beginPath(); const u = (t * .8 + k * .05) % 1; c.moveTo(k, -64); c.bezierCurveTo(k - 10, -84 - u * 6, k + 10, -100, k, -122 - Math.sin(t * 3 + k) * 4); c.stroke() } }
  c.restore();
}
function saucer(x, y, sc = 1) { c.save(); c.translate(x, y); c.scale(sc, sc); c.beginPath(); c.ellipse(0, 4, 62, 10, 0, 0, 7); c.fillStyle = '#EFECE6'; c.fill(); c.lineWidth = 4; c.strokeStyle = '#1E1814'; c.stroke(); c.restore() }
function cake(x, y) { c.save(); c.translate(x, y); c.beginPath(); c.ellipse(0, 4, 78, 12, 0, 0, 7); c.fillStyle = '#F2EFE9'; c.fill(); c.lineWidth = 4; c.strokeStyle = '#1E1814'; c.stroke();
  c.beginPath(); c.moveTo(-46, 0); c.lineTo(-30, -52); c.lineTo(46, -46); c.lineTo(52, 0); c.closePath(); c.fillStyle = '#F6E7C2'; c.fill(); c.stroke();
  c.beginPath(); c.moveTo(-40, -20); c.lineTo(48, -18); c.lineWidth = 3; c.stroke();
  c.beginPath(); c.moveTo(-32, -50); c.quadraticCurveTo(0, -66, 44, -48); c.lineTo(44, -42); c.quadraticCurveTo(0, -56, -30, -42); c.closePath(); c.fillStyle = '#FFFFFF'; c.fill(); c.lineWidth = 3; c.stroke();
  c.beginPath(); c.arc(-4, -66, 9, 0, 7); c.fillStyle = '#D9323B'; c.fill(); c.stroke(); c.restore() }
function spoon(x0, y0, x1, y1) { c.save(); c.lineCap = 'round'; c.strokeStyle = '#1E1814'; c.lineWidth = 9; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); c.strokeStyle = '#D5DADF'; c.lineWidth = 4.5; c.stroke(); c.restore() }
function fingers(x, y, skin, a = 0) { c.save(); c.translate(x, y); c.rotate(a); for (const k of [-1, 0, 1]) { c.beginPath(); c.ellipse(k * 11, 4 + Math.abs(k) * 2, 9, 14, 0, 0, 7); c.fillStyle = skin; c.fill(); c.lineWidth = 3.5; c.strokeStyle = '#1E1814'; c.stroke() } c.restore() }
// ---------- set ----------
const FOLK = [[60, 22, '#3A3F4A', '#9C6B4A'], [210, -18, '#D9488C', '#B77A55'], [330, 30, '#23232A', '#8A5536'], [430, -26, '#E7963A', '#A8714F'], [560, 16, '#6C7480', '#7B4C34'], [700, -22, '#23232A', '#B27D58'], [830, 28, '#8A8F99', '#966241'], [960, -14, '#C94F5E', '#A9714D'], [1090, 24, '#2E3340', '#8C5A3C']];
function backdrop(t, z) {
  const b = Math.max(3, 3.4 * z); c.save(); c.filter = `blur(${b}px)`;
  c.fillStyle = '#4E372B'; c.fillRect(-300, -300, 1700, 2600);
  for (let y = -40; y < 1010; y += 26) { c.fillStyle = (y / 26 & 1) ? '#3A281F' : '#7A5340'; c.fillRect(-300, y, 1700, 13) }
  const g = c.createLinearGradient(0, 0, 0, 1000); g.addColorStop(0, 'rgba(255,190,110,.0)'); g.addColorStop(.7, 'rgba(255,190,110,.20)'); g.addColorStop(1, 'rgba(255,190,110,.0)'); c.fillStyle = g; c.fillRect(-300, 0, 1700, 1000);
  c.fillStyle = '#2B1C16'; c.fillRect(-300, 1000, 1700, 1400);
  for (const [x0, v, col, skin] of FOLK) { const x = ((x0 + v * t + 200) % 1500 + 1500) % 1500 - 200, by = 1010; c.fillStyle = col; c.beginPath(); c.roundRect(x - 52, by - 300, 104, 300, 40); c.fill(); c.fillStyle = skin; c.beginPath(); c.arc(x, by - 345, 44, 0, 7); c.fill(); c.fillStyle = '#1B1412'; c.beginPath(); c.arc(x, by - 360, 44, Math.PI, 0); c.fill() }
  // waitress with a tray crosses behind 1.0-3.6
  const wu = (t - 1.0) / 2.6; if (wu > -.2 && wu < 1.2) { const x = lerp(1180, -120, wu), by = 1010; c.fillStyle = '#6B6F3C'; c.beginPath(); c.roundRect(x - 55, by - 310, 110, 310, 40); c.fill(); c.fillStyle = '#F1ECE4'; c.fillRect(x - 55, by - 300, 20, 120); c.fillStyle = '#A9714D'; c.beginPath(); c.arc(x, by - 355, 46, 0, 7); c.fill(); c.fillStyle = '#1B1412'; c.beginPath(); c.arc(x, by - 372, 46, Math.PI * .95, Math.PI * 2.05); c.fill();
    c.fillStyle = '#C9CDD2'; c.fillRect(x - 130, by - 232, 150, 12); c.fillStyle = '#FFF'; c.fillRect(x - 100, by - 262, 36, 30); c.fillRect(x - 40, by - 252, 30, 20) }
  c.restore();
}
function booth(x0, x1) { c.save(); c.beginPath(); c.roundRect(x0, 700, x1 - x0, 760, 70); c.fillStyle = '#B22B2D'; c.fill(); c.lineWidth = 5; c.strokeStyle = '#1E1814'; c.stroke(); c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(x0 + 10, 1010, x1 - x0 - 20, 20); c.fillStyle = 'rgba(255,255,255,.12)'; c.beginPath(); c.roundRect(x0 + 24, 720, 40, 270, 18); c.fill(); c.restore() }
function table() { c.save(); c.fillStyle = '#2C1814'; c.fillRect(402, TT + 12, 276, 330); c.fillStyle = '#4A2A22'; c.beginPath(); c.moveTo(384, TT + 14); c.lineTo(410, TT - 14); c.lineTo(670, TT - 14); c.lineTo(696, TT + 14); c.closePath(); c.fill(); c.lineWidth = 5; c.strokeStyle = '#1E1814'; c.stroke(); c.fillStyle = 'rgba(255,220,180,.14)'; c.fillRect(425, TT - 8, 200, 5); c.restore() }
// ---------- acting ----------
function talk(k, t, style = 'talk') { const a = env(k, t), K = k === 'k'; return a > .06 ? { mouth: style, open: K ? clamp(a * .8, .12, .42) : clamp(a * 1.05, .2, .8), wide: K ? .16 : .21, wideNow: nz(t * 1.7, K ? 1 : 5) * (K ? .1 : .3) } : null }   // Kalu: tight, flat, serious mouth
const CUPB = [478, TT], CUPK = [610, TT];
function battery(t) {
  let f = { brow: -.55, lid: .15, look: [.9, 0], mouth: 'flat' }, lean = 0, tilt = 0, nod = 0, hold = null;
  const REST = { near: { e: [16, 150], h: [124, 266], hand: 'rest' }, far: { e: [8, 146], h: [96, 268], hand: 'rest' } };
  let near = REST.near, far = REST.far;
  const tableFar = { ...ik(BX, false, 'far', 490, TT - 16), hand: 'rest' }, spoonHand = (a) => ({ ...ik(BX, false, 'far', 490 + Math.cos(a) * 11, TT - 74 + Math.sin(a) * 7), hand: 'fist' });
  const cupHand = { ...ik(BX, false, 'far', CUPB[0] + 36, TT - 34), hand: 'fist' };
  // 0-4.1 stern stare at Kalu; 4.1-4.4 looks down; says the line; 5.2 leans in
  if (t < 4.1) { const sp = talk('b', t, 'talk'); f = { brow: -.7, lid: .2, look: [.92, -.05], mouth: 'flat', ...(sp || {}) }; tilt = -.03 + Math.sin(t * 1.3) * .01; if (t > 3.4) f.look = [.85, .1] }
  else if (t < 5.5) { const sp = talk('b', t); f = { brow: -.8, lid: .1, look: [.5, .6 - seg(t, 4.1, 4.5) * .0], mouth: 'flat', ...(sp || {}) }; tilt = .05; lean = seg(t, 4.3, 5.5) * .05; far = lerpA(REST.far, tableFar, seg(t, 5.0, 5.5)) }
  else if (t < 7.0) { f = { brow: -.4, lid: .3, look: [.5, .85], mouth: 'flat' }; lean = .08; tilt = .06; far = spoonHand(t * 11); near = REST.near }                                   // stirs, eyes on the cup
  else if (t < 7.5) { f = { brow: -.2, lid: .35, look: [.5, .85], mouth: 'flat' }; lean = .08 - seg(t, 7.0, 7.5) * .05; far = lerpA(spoonHand(t * 11), cupHand, seg(t, 7.0, 7.4)); hold = { mode: 'table' } }
  else if (t < 9.5) {   // takes the cup up and sips, then puts it back
    const up = seg(t, 7.5, 8.2) * (1 - seg(t, 8.95, 9.5)); const sip = seg(t, 8.0, 8.3) * (1 - seg(t, 8.8, 9.05));
    f = { brow: -.3, lid: .25, look: [.6, .5], mouth: 'flat' }; if (sip > .5) f = { closed: 'flat', brow: -.1, mouth: 'flat' }; tilt = -.06 * sip; lean = .03 * (1 - up); hold = { mode: 'mouth', up, sip };
  }
  else if (t < 10.2) { f = { brow: .3, browUp: .4, lid: .15, look: [.9, -.05], mouth: 'flat' }; far = { ...ik(BX, false, 'far', 490, TT - 16), hand: 'rest' }; lean = .02 }                     // looks up at Kalu
  else if (t < 11.33) { const sp = talk('b', t); f = { brow: .55, browUp: .9, lid: .08, look: [.92, -.1], eye: 1.04, mouth: 'flat', ...(sp || {}) }; tilt = .06; lean = .02; far = { ...ik(BX, false, 'far', 490, TT - 16), hand: 'rest' } }   // "Tu karta kya hai?"
  else { f = { brow: -.2, lid: .3, look: [.9, .1], mouth: 'flat' }; far = { ...ik(BX, false, 'far', 490, TT - 16), hand: 'rest' }; if (t > 14.8) f = { brow: -.5, lid: .45, look: [.8, .2], mouth: 'flat' } }
  if (!f.closed && blink(t, 1.9)) f = { ...f, closed: 'flat' };
  return { face: f, arms: { near, far }, lean, nod, headTilt: tilt, hold };
}
function kalu(t) {
  let f = { brow: .2, look: [.9, 0], mouth: 'flat', wide: .3 }, lean = 0, tilt = 0, hop = 0;
  const restN = { ...ik(KX, true, 'near', 690, TT - 18), hand: 'rest' }, restF = { ...ik(KX, true, 'far', 600, TT - 16), hand: 'rest' };
  let near = restN, far = restF, hold = null;
  // sarcastically serious: Kalu never laughs or even grins, only a flat deadpan with small brow acting
  if (t < .2) { f = { brow: -.1, look: [.9, 0], mouth: 'flat', wide: .3 } }
  else if (t < .75) { const sp = talk('k', t, 'talk'); f = { brow: .15, browUp: .2, look: [.9, 0], mouth: 'flat', wide: .3, ...(sp || {}) }; tilt = .02 }                  // "Hello." flat, confident
  else if (t < 2.7) { f = { brow: -.15, look: [.9, 0], mouth: 'flat', wide: .3 }; tilt = Math.sin(t * 1.6) * .015 }                                                  // stays still, unbothered
  else if (t < 3.5) { const sp = talk('k', t, 'talk'); f = { brow: -.3, look: [.9, 0], mouth: 'flat', wide: .3, ...(sp || {}) }; tilt = .03; lean = .015 }               // "I am Kala." dead serious
  else if (t < 6.77) { f = { brow: -.2, look: [.9, 0], mouth: 'flat', wide: .3 }; tilt = Math.sin(t * 1.4) * .012; if (t > 5.6) f.look = [.8, .15] }                // watches Battery stir his coffee
  else if (t < 9.0) { f = { brow: -.15, look: [.9, 0], mouth: 'flat', wide: .3 } }
  else { f = { brow: -.1, look: [.9, 0], mouth: 'flat' } }
  // cup to the chest from 8.2, held in both hands (deadpan close-up from 11.33)
  const up = seg(t, 8.2, 9.4);
  if (t > 8.2) { const cx = lerp(CUPK[0], KX - 125 * S, up), cy = lerp(CUPK[1], HY - 215 * S, up); near = { ...ik(KX, true, 'near', cx + 22 * 0 - 4, cy - 28), hand: 'fist' }; far = { ...ik(KX, true, 'far', cx - 30, cy - 36), hand: 'fist' }; hold = { x: cx, y: cy } }
  if (t >= 11.33) {
    const sp1 = talk('k', t, 'talk'), looksDown = t > 13.1 && t < 13.7;
    f = { brow: -.55, browUp: 0, look: [.9, looksDown ? .45 : 0], mouth: 'flat', ...(sp1 || {}) }; tilt = t < 12.4 ? .05 : (t > 13.7 ? Math.sin(t * 5.5) * .03 : .0);
    if (t < 12.4) f.brow = -.25; if (looksDown) { f.brow = -.1; tilt = .08 }
    if (t > 14.85) f = { brow: -.5, look: [.9, .1], mouth: 'flat' };
  }
  if (!f.closed && blink(t, .6) && !f.sun) { /* sunglasses hide the eyes: no blink needed */ }
  return { face: f, arms: { near, far }, lean, nod: 0, headTilt: tilt, hop, hold };
}
// ---------- draw ----------
function drawChar(o, X, flip, st, data) {
  const { hold } = st;
  kpSeated({ ...o, x: X, y: HY, s: S, flip, ...st, hold: undefined });
}
const sipPos = (t) => { const mx = BX + S * 33, my = HY + S * -393; return [mx, my] };
function overShoulder(side, kind, t) {   // blurred foreground of the other character in the close-ups
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.filter = 'blur(13px)';
  if (kind === 'kalu') {   // Kalu's hat brim and black shoulder, right side
    const hx = 930, hy = 330; c.fillStyle = '#16161B'; c.beginPath(); c.roundRect(700, 700, 500, 800, 150); c.fill();
    c.fillStyle = '#D8D8DC'; c.beginPath(); c.ellipse(hx, hy + 20, 300, 66, -.06, 0, 7); c.fill(); c.fillStyle = '#4B4D55'; for (let i = 0; i < 9; i++) c.fillRect(700 + i * 56, hy - 30 + (i & 1) * 22, 30, 24);
    c.fillStyle = '#E4E4E8'; c.beginPath(); c.roundRect(840, hy - 200, 330, 240, 90); c.fill(); c.fillStyle = '#16161B'; c.fillRect(840, hy - 40, 330, 30);
  } else {   // Battery's cream shoulder and long hair, left side
    c.fillStyle = '#E7DEC9'; c.beginPath(); c.roundRect(-220, 760, 420, 900, 130); c.fill(); c.fillStyle = '#3A2B22'; c.beginPath(); c.roundRect(-120, 330, 280, 600, 120); c.fill();
  }
  c.restore();
}
export function draw(t) {
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
  const shot = t < 6.767 ? 'W' : t < 11.333 ? 'B' : 'K';
  let z = 1.5 + t / 6.767 * .08, cx = 540, cy = 1010;
  if (shot === 'B') { const u = (t - 6.767) / 4.566; z = 2.15 + u * .1; cx = 420 + u * 10; cy = 930 }
  if (shot === 'K') { const u = (t - 11.333) / 3.977; z = 2.1 + u * .12; cx = 668 - u * 8; cy = 940 }
  c.translate(W / 2, H / 2); c.scale(z, z); c.translate(-cx, -cy);
  backdrop(t, shot === 'W' ? 1 : 2);
  booth(150, 430); booth(650, 930);
  const kst = kalu(t), bst = battery(t);
  // holding / sipping prop placement
  let bCup = { x: CUPB[0], y: TT, rot: 0, steam: 1 }, spoonDraw = null, bHandProp = null;
  if (bst.hold) {
    const h = bst.hold;
    if (h.mode === 'mouth') {
      const [mx, my] = sipPos(t), rot = -.95 - h.sip * .35, R = (x, y) => [x * Math.cos(rot) - y * Math.sin(rot), x * Math.sin(rot) + y * Math.cos(rot)];
      const rimOff = R(0, -54), ox = mx - rimOff[0] + 6, oy = my - rimOff[1] + 4;      // cup rim at the lips
      const cx2 = lerp(CUPB[0], ox, easeOut(h.up)), cy2 = lerp(CUPB[1], oy, easeOut(h.up)), r2 = lerp(0, rot, easeOut(h.up));
      bCup = { x: cx2, y: cy2, rot: r2, steam: h.up < .2 ? 1 : 0 };
      const hp = R(30, -22); bst.arms.far = { ...ik(BX, false, 'far', cx2 + hp[0] * easeOut(h.up) + 36 * (1 - easeOut(h.up)), cy2 + hp[1] * easeOut(h.up) - 34 * (1 - easeOut(h.up))), hand: 'fist' };
      bHandProp = h.up > .5 ? [cx2 + hp[0], cy2 + hp[1]] : null;
    }
  }
  if (t >= 5.9 && t < 7.0) { const a = t * 11, hx = BX + 0, h = handW(BX, false, 'far', bst.arms.far); spoonDraw = [h[0], h[1], 490 + Math.cos(a) * 11, TT - 56 + Math.sin(a) * 6] }
  else if (t >= 7.0 || (t > 5.5 && t < 5.9)) { spoonDraw = null }
  kpSeated({ ...BATT, x: BX, y: HY, s: S, ...bst, hold: undefined });
  kpSeated({ ...KALU, x: KX, y: HY, s: S, flip: true, ...kst, hold: undefined });
  table();
  saucer(CUPB[0], TT - 2); cake(544, TT - 4); saucer(CUPK[0], TT - 2);
  // spoon rests on Battery's saucer when not stirring
  if (!(t >= 5.5 && t < 7.0)) { spoon(CUPB[0] + 8, TT - 4, CUPB[0] + 64, TT - 14) }
  // cups
  if (!(bCup.rot !== 0 && bCup.y < TT - 4 && bst.hold && bst.hold.up > .02)) cup(bCup.x, bCup.y - 2, 1, bCup.rot, bCup.steam, t); else cup(bCup.x, bCup.y, 1, bCup.rot, 0, t);
  if (t < 8.2) cup(CUPK[0], TT - 2, 1, 0, 1, t); else if (kst.hold) cup(kst.hold.x, kst.hold.y, 1, 0, t > 9.4 ? 1 : 0, t);
  if (spoonDraw) spoon(...spoonDraw);
  if (bHandProp) fingers(bHandProp[0] + 6, bHandProp[1] + 4, BATT.skin, -.5);
  if (kst.hold) { fingers(kst.hold.x - 22, kst.hold.y - 24, KALU.skin, 0); fingers(kst.hold.x + 20, kst.hold.y - 22, KALU.skin, 0) }
  if (shot === 'B') overShoulder('right', 'kalu', t); else if (shot === 'K') overShoulder('left', 'batt', t);
  c.restore();
  label([["World's ", '#111'], ['shortest', '#D7261E'], [' conversation ever', '#111']], W / 2, 150, 50);
  captions(groups, t, KEYS, 1700); finish(t);
}
export const cues = [];
