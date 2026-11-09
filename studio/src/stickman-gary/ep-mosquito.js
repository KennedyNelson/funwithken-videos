// 2026-11-09 YouTube "Why Mosquitoes Bite Only You" (type 1 funny knowledge). Desi Goggle-Eye Toon, rooftop terrace at golden dusk.
// Kalu (canon: fedora, sunglasses, black suit) and Battery sit on plastic chairs. Mosquitoes swarm only Battery; Kalu sips chai.
// Beats: L1 Kalu hook (100x tastier) on the wide contrast shot / L2 Battery 'that's me' / L3 Kalu explains -> skin insert (oil + bacteria
// make a smell, a mosquito follows the smell trail) / L4 Battery 'I'll bathe twice' / L5 Kalu 'no difference, 3 years' / L6 Battery
// defeated, a mosquito lands on his cheek / L7 Kalu 'sit close, with you here nobody bites me' - one mosquito tries Kalu, turns back.
import { W, H, bind, ctx, lerp, clamp, captions, groupWords, finish, poly, ell, fillEll, fillPoly, line, rrect, layer, blurred, shadowBlob, dark, light } from '../toon/toon.js';
import { kpSeated, kpChair } from '../toon/kp.js';
import { KALU, BATTERY } from '../toon/kalu.js';
import { chaiGlass } from '../toon/sets.js';
const META = await (await fetch('/data/meta.json')).json();
const ENV = await (await fetch('/data/env.json')).json();
export const DUR = META.dur;
const TL = META.lines;
let c, groups = [];
const KEYS = /^(sau|guna|tasty|tel|bacteria|smell\.?|farak|teen|saal|kaatta\.?|main)$/i;
export function init(cx, w) { c = cx; bind(c); groups = groupWords(w) }
const env = (k, t) => { const a = ENV[k]; return a ? (a[Math.min(a.length - 1, Math.max(0, Math.floor(t * 30)))] || 0) : 0 };
const sm = (u) => { u = clamp(u, 0, 1); return u * u * (3 - 2 * u) };
const seg = (t, a, b) => sm((t - a) / (b - a));
const nz = (t, k) => Math.sin(t * 17.3 + k) * .5 + Math.sin(t * 9.1 + k * 2) * .5;
const speaking = (sp, t) => TL.some(([s, a, b]) => s === sp && t >= a - .05 && t <= b);
const S = .86, HY = 1190, LEN = 146, SH = { near: [-70, -300], far: [78, -312] };
const BX = 315, KX = 790;
const KAL = { ...KALU };
const BAT = { ...BATTERY, specs: 'clear', specCol: '#1A1A1E' };
const L = (i) => TL[i];                         // [sp, start, end]
const INS = [TL[2][1] + 1.0, TL[2][2] + .05];   // skin insert window
function ik(X, flip, hy, side, tx, ty) {
  const lx = flip ? (X - tx) / S : (tx - X) / S, ly = (ty - hy) / S, s0 = SH[side];
  let rx = lx - s0[0], ry = ly - s0[1]; const d0 = Math.hypot(rx, ry) || 1, mx = 2 * LEN * .985; if (d0 > mx) { rx *= mx / d0; ry *= mx / d0 }
  const d = Math.hypot(rx, ry), hh = Math.sqrt(Math.max(0, LEN * LEN - d * d / 4)); let px = -ry / d, py = rx / d; if (py < 0) { px = -px; py = -py }
  return { e: [rx / 2 + px * hh, ry / 2 + py * hh], h: [rx, ry] };
}
const OX = 220;
// ---------- set: rooftop terrace at golden dusk ----------
function roofLayer() {
  return layer('roof', 1520, 1920, () => {
    const g = ctx(); g.translate(OX, 0);
    const sk = g.createLinearGradient(0, 0, 0, 1150); sk.addColorStop(0, '#8FA9D6'); sk.addColorStop(.45, '#F2B98C'); sk.addColorStop(1, '#FFD9A0'); g.fillStyle = sk; g.fillRect(-OX, 0, 1520, 1150);
    g.fillStyle = 'rgba(255,240,200,.85)'; g.beginPath(); g.arc(250, 900, 70, 0, 7); g.fill();                 // low sun
    // distant rooftops
    const bl = [[-220, 820, 180], [-60, 760, 140], [60, 860, 200], [240, 790, 120], [340, 700, 170], [500, 840, 150], [640, 760, 190], [820, 880, 160], [960, 730, 150], [1100, 820, 200], [1260, 780, 160]];
    for (const [x, y, w] of bl) { g.fillStyle = '#C98E7A'; g.fillRect(x, y, w, 1150 - y); g.fillStyle = '#B57D6C'; g.fillRect(x, y, w, 14); for (let k = 0; k < 3; k++) { g.fillStyle = 'rgba(255,220,150,.55)'; g.fillRect(x + 22 + k * (w / 3.4), y + 50, 22, 30) } }
    g.strokeStyle = 'rgba(70,50,50,.45)'; g.lineWidth = 3; g.beginPath(); g.moveTo(-OX, 690); g.quadraticCurveTo(500, 760, 1300, 670); g.stroke();   // power line
    // black water tank on a stand (left)
    g.fillStyle = '#5E534E'; g.fillRect(-150, 760, 24, 300); g.fillRect(70, 760, 24, 300); g.fillStyle = '#222'; g.beginPath(); g.roundRect(-180, 560, 300, 230, 40); g.fill(); g.fillStyle = 'rgba(255,255,255,.12)'; for (let k = 0; k < 4; k++) g.fillRect(-180, 600 + k * 48, 300, 8); g.fillStyle = '#333'; g.beginPath(); g.ellipse(-30, 560, 60, 16, 0, 0, 7); g.fill();
    // clothesline with a towel and a kurta (right)
    g.strokeStyle = '#555'; g.lineWidth = 3; g.beginPath(); g.moveTo(870, 760); g.quadraticCurveTo(1050, 790, 1240, 760); g.stroke();
    g.fillStyle = '#E86F5A'; g.fillRect(930, 772, 90, 150); g.fillStyle = '#F4E3B5'; g.beginPath(); g.moveTo(1070, 782); g.lineTo(1170, 778); g.lineTo(1180, 960); g.lineTo(1060, 962); g.closePath(); g.fill();
    // parapet wall
    g.fillStyle = '#E8C9A0'; g.fillRect(-OX, 1040, 1520, 140); g.fillStyle = '#D4B288'; g.fillRect(-OX, 1040, 1520, 22); g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(-OX, 1160, 1520, 20);
    // terrace floor tiles
    for (let y = 1180; y < 1920; y += 74) { g.fillStyle = (y / 74 & 1) ? '#C9A27A' : '#C29A70'; g.fillRect(-OX, y, 1520, 74) }
    for (let x = -OX; x < 1400; x += 160) { g.strokeStyle = 'rgba(90,50,20,.22)'; g.lineWidth = 3; g.beginPath(); g.moveTo(x, 1180); g.lineTo(x - 120, 1920); g.stroke() }
    const glow = g.createLinearGradient(0, 1180, 0, 1920); glow.addColorStop(0, 'rgba(255,200,130,.25)'); glow.addColorStop(1, 'rgba(255,200,130,0)'); g.fillStyle = glow; g.fillRect(-OX, 1180, 1520, 740);
  });
}
// ---------- mosquito ----------
function mosq(x, y, s, t, k, dir = 1, landed = 0) {
  const g = ctx(); g.save(); g.translate(x, y); g.scale(s * dir, s); g.rotate(landed ? .15 : Math.sin(t * 9 + k) * .12);
  const flap = landed ? .3 : Math.sin(t * 90 + k * 3);
  g.strokeStyle = '#2A2A30'; g.lineWidth = 1.6; g.lineCap = 'round';
  for (const [ax, lx, ly] of [[-2, -14, 16], [2, -4, 18], [6, 10, 17]]) { g.beginPath(); g.moveTo(ax, 2); g.lineTo(lx, ly * .55); g.lineTo(lx - 3, ly); g.stroke() }
  g.save(); g.globalAlpha = .4; g.fillStyle = '#FFFFFF'; g.strokeStyle = 'rgba(40,40,50,.6)'; g.lineWidth = 1;
  for (const sgn of [-1, 1]) { g.save(); g.translate(0, -3); g.rotate(-.6 - sgn * .25 * flap); g.beginPath(); g.ellipse(-12, 0, 13, 4.5, 0, 0, 7); g.fill(); g.stroke(); g.restore() }
  g.restore();
  g.fillStyle = '#2A2A30'; g.beginPath(); g.ellipse(-12, 1, 12, 4, .1, 0, 7); g.fill();                  // abdomen
  g.fillStyle = '#E9E9E9'; for (const sx of [-18, -12, -6]) g.fillRect(sx, -2, 2, 6);                   // white stripes
  g.fillStyle = '#2A2A30'; g.beginPath(); g.ellipse(3, 0, 6, 5, 0, 0, 7); g.fill(); g.beginPath(); g.arc(10, 0, 3.4, 0, 7); g.fill();
  g.lineWidth = 1.4; g.beginPath(); g.moveTo(12, 1); g.lineTo(24, 6); g.stroke();                          // proboscis
  g.restore();
}
// swarm around Battery's head and arms. returns positions in world coords
const BH = [BX + S * 6, HY - S * 470];
function swarm(t) {
  const o = [];
  for (let k = 0; k < 6; k++) {
    const a = t * (1.3 + k * .23) + k * 1.7, rx = 150 + (k % 3) * 30, ry = 120 + (k % 2) * 60;
    let x = BH[0] + Math.sin(a) * rx + nz(t * .6, k) * 18, y = BH[1] + 40 + Math.cos(a * 1.3) * ry + nz(t * .7, k + 3) * 14, landed = 0, dir = Math.cos(a) > 0 ? 1 : -1;
    // L6: one lands on Battery's cheek and stays
    if (k === 0) { const u = seg(t, L(5)[1] - .4, L(5)[1] + .3); x = lerp(x, BH[0] + 72, u); y = lerp(y, BH[1] + 52, u); if (u > .98) { landed = 1; dir = -1 } }
    // L7: one flies over to Kalu, hovers by his face, turns back to Battery
    if (k === 3) { const go = seg(t, L(6)[1] + .2, L(6)[1] + 1.1), back = seg(t, L(6)[1] + 2.1, L(6)[1] + 3.0), w = go * (1 - back);
      const kx = KX - 70 + Math.sin(t * 5) * 20, ky = HY - S * 470 + 10 + Math.cos(t * 6) * 16; x = lerp(x, kx, w); y = lerp(y, ky, w); if (w > .1) dir = go < 1 ? 1 : (back > 0 ? -1 : 1) }
    o.push([x, y, dir, landed, k]);
  }
  return o;
}
// ---------- characters ----------
const SIPS = [[TL[3][1] + .3, TL[3][2] + .2], [TL[6][2] + .1, DUR + 1]];
const sipAmt = (t) => SIPS.reduce((m, [a, b]) => Math.max(m, seg(t, a, a + .4) * (1 - seg(t, b - .35, b))), 0);
function kalu(t) {
  const sp = speaking('k', t), sip = sipAmt(t);
  let f = { brow: -.12, look: [.9, 0], mouth: 'flat', wide: .3 };
  if (sp) f = { brow: -.12, look: [.9, 0], mouth: 'talk', open: clamp(env('k', t) * .6, .1, .3), wide: .14, wideNow: nz(t * 1.2, 1) * .06 };
  if (t > L(6)[1] + .9 && t < L(6)[1] + 2.4) f = { ...f, brow: -.45 };          // unimpressed at the mosquito
  const rest = { ...ik(KX, true, HY, 'near', KX - 80, HY - 240), hand: 'fist' }, restF = { ...ik(KX, true, HY, 'far', KX - 70, HY - 220), hand: 'fist' };
  const mouthP = [KX - S * 6 - 62, HY - S * 470 + 78];
  const gx = lerp(KX - 80, mouthP[0] - 8, sip), gy = lerp(HY - 240, mouthP[1] + 18, sip);
  const near = sip > 0 ? { ...ik(KX, true, HY, 'near', gx, gy), hand: 'fist' } : rest;
  return { face: f, arms: { near, far: restF }, headTilt: Math.sin(t * 1.4) * .008 - .03 * sip, glass: { x: gx - 8, y: gy + 52, up: sip } };
}
const SLAPS = [[.35, .75], [TL[1][1] + .1, TL[1][1] + .5], [TL[3][2] + .3, TL[3][2] + .7]];
function battery(t) {
  const sp = speaking('b', t);
  let f = { brow: .25, lid: .3, look: [.9, .05], mouth: 'flat', wide: .2 };
  if (sp) f = { ...f, mouth: 'talk', open: clamp(env('b', t) * 1.0, .16, .65), wide: .21, wideNow: nz(t * 1.7, 5) * .25 };
  if (t >= L(3)[1] - .1 && t < L(3)[2] + .1) f = { ...f, brow: -.2, lid: .15 };                         // determined
  if (t >= L(4)[1] && t < L(4)[2]) f = { ...f, brow: .45, lid: .3 };
  if (t >= L(5)[1] - .1) f = { ...f, brow: .6, lid: .42, mouth: sp ? f.mouth : 'sad' };                  // defeated
  const slap = SLAPS.reduce((m, [a, b]) => Math.max(m, seg(t, a, a + .12) * (1 - seg(t, b - .15, b))), 0);
  const far = { ...ik(BX, false, HY, 'far', BX + 60, HY - 205), hand: 'rest' };
  const tgt = [lerp(BX + 40, BX + 120, slap), lerp(HY - 210, HY - 236, slap)];
  const near = { ...ik(BX, false, HY, 'near', tgt[0], tgt[1]), hand: slap > .5 ? 'open' : 'rest' };
  return { face: f, arms: { near, far }, headTilt: -.02 + Math.sin(t * 1.3) * .012 + (t >= L(5)[1] ? .05 : 0), lean: .02 };
}
// ---------- skin insert ----------
function insert(t, u0) {
  const g = ctx(), lt = t - INS[0];
  const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#F6C89A'); bg.addColorStop(1, '#E9A777'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
  g.save(); g.globalAlpha = .35; g.drawImage(blurred('roofB2', roofLayer(), 22), -OX - 200, -300, 1520 * 1.4, 1920 * 1.4); g.restore();
  const zoom = 1 + lt * .02; g.save(); g.translate(W / 2, H / 2); g.scale(zoom, zoom); g.translate(-W / 2, -H / 2);
  // forearm across the frame, sleeve on the left
  const sk = BAT.skin; g.save(); g.translate(540, 1180); g.rotate(-.12);
  rrect(-760, -170, 1520, 340, 170, sk, () => { fillPoly([[-760, 70], [760, 70], [760, 170], [-760, 170]], dark(sk, .12)); fillPoly([[-760, -170], [760, -170], [760, -120], [-760, -120]], light(sk, .1)) }, 6);
  rrect(-760, -200, 300, 400, 30, BAT.topCol, () => fillPoly([[-760, 90], [-460, 90], [-460, 200], [-760, 200]], dark(BAT.topCol, .12)), 6);
  // skin oil glints + tiny bacteria
  const spots = [[-300, -60], [-120, 30], [60, -80], [210, 10], [380, -50], [-200, 90], [300, 90]];
  for (const [i, [x, y]] of spots.entries()) {
    g.save(); g.globalAlpha = .55; fillEll(x, y, 26, 9, '#FFF6DA', .2); g.restore();
    const wob = Math.sin(t * 3 + i) * 3; rrect(x - 30 + wob, y - 34, 34, 16, 8, i % 2 ? '#7FB86A' : '#9C7FD1', null, 3); rrect(x + 4 - wob, y + 14, 28, 14, 7, i % 2 ? '#9C7FD1' : '#7FB86A', null, 3);
  }
  // smell wisps rising (appear during sentence 1)
  const wa = seg(t, INS[0] + .2, INS[0] + 1.0);
  g.save(); g.globalAlpha = .55 * wa; g.strokeStyle = '#F7F3C8'; g.lineWidth = 12; g.lineCap = 'round';
  for (const [i, [x, y]] of spots.entries()) { g.beginPath(); const ph = t * 2.2 + i; g.moveTo(x, y - 40); for (let k = 1; k <= 8; k++) g.lineTo(x + Math.sin(ph + k * .7) * 26 + k * 6, y - 40 - k * 70 * wa); g.stroke() }
  g.restore();
  g.restore();
  // mosquito follows the trail in (sentence 2) and lands on the arm
  const s2 = TL[2][1] + 4.0, m = seg(t, s2 - .6, s2 + 1.2), lx = lerp(1180, 640, m), ly = lerp(260, 905, m) + Math.sin(t * 7) * 24 * (1 - m);
  mosq(lx, ly, 5.2, t, 7, -1, m > .98 ? 1 : 0);
  g.restore();
}
// ---------- camera ----------
function camera(t) {
  const K = [[0, 1.18, 545, 1000], [2.4, 1.85, 760, 820], [L(1)[1] - .05, 1.95, 330, 830], [L(2)[1] - .05, 1.7, 720, 840], [L(3)[1] - .05, 2.1, 330, 820],
    [L(4)[1] - .05, 1.35, 550, 900], [L(4)[1] + 2.45, 2.1, 760, 820], [L(5)[1] - .05, 2.35, 345, 800], [L(6)[1] - .05, 1.45, 555, 880]];
  let i = 0; while (i + 1 < K.length && t >= K[i + 1][0]) i++;
  const k = K[i], u = clamp((t - k[0]) / ((K[i + 1] ? K[i + 1][0] : DUR) - k[0])), push = 1 + u * .05;
  return { z: k[1] * push, cx: k[2], cy: k[3] };
}
export function draw(t) {
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
  if (t >= INS[0] && t < INS[1]) { insert(t); c.restore(); captions(groups, t, KEYS, 1690); finish(t); return }
  const cm = camera(t);
  c.translate(W / 2, H / 2); c.scale(cm.z, cm.z); c.translate(-cm.cx, -cm.cy);
  c.drawImage(blurred('roofB', roofLayer(), 6), -OX, 0);
  shadowBlob(BX + 60, 1452, 250, 24, .22); shadowBlob(KX - 60, 1452, 250, 24, .22);
  kpChair(BX, HY, S, false, '#3C7DBF'); kpChair(KX, HY, S, true, '#3C7DBF');
  const bst = battery(t), kst = kalu(t);
  kpSeated({ ...BAT, x: BX, y: HY, s: S, flip: false, face: bst.face, arms: bst.arms, headTilt: bst.headTilt, lean: bst.lean, turn: .55 });
  kpSeated({ ...KAL, x: KX, y: HY, s: S, flip: true, face: kst.face, arms: kst.arms, headTilt: kst.headTilt, turn: .55 });
  chaiGlass(kst.glass.x, kst.glass.y, 1.05, .85 - kst.glass.up * .25, 0, t);
  for (const [x, y, dir, landed, k] of swarm(t)) mosq(x, y, 1.9, t, k, dir, landed);
  c.restore();
  captions(groups, t, KEYS, 1690); finish(t);
}
export const cues = [];
